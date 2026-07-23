import { LitElement, css, html, svg } from "lit";
import { PLOT, seriesPath } from "./chart";
import { activeProviders, chartRange, collectLocations, tooltipAt, validateConfig } from "./data";
import { t } from "./i18n";
import "./editor";
import type { ChartRange, HomeAssistant, ProviderForecast, RadarConfig, TooltipItem } from "./types";

const COLORS = ["#0d47a1", "#1565c0", "#1976d2", "#1e88e5", "#42a5f5", "#64b5f6"];

function providerIndex(provider: string): number {
  return [...provider].reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 0) % COLORS.length;
}

function providerColor(provider: string): string {
  const known = provider.toLowerCase();
  const named: Record<string, string> = {
    buienradar: "var(--neerslag-radar-buienradar, #0d47a1)",
    buienalarm: "var(--neerslag-radar-buienalarm, #1565c0)",
    knmi: "var(--neerslag-radar-knmi, #1e88e5)",
    open_meteo: "var(--neerslag-radar-open-meteo, #42a5f5)",
  };
  const fallbackIndex = providerIndex(known);
  return named[known] ?? `var(--neerslag-radar-provider-${fallbackIndex + 1}, ${COLORS[fallbackIndex]})`;
}

function providerName(provider: string): string {
  return {
    buienradar: "Buienradar",
    buienalarm: "Buienalarm",
    knmi: "KNMI",
    open_meteo: "Open-Meteo",
  }[provider.toLowerCase()] ?? provider.replaceAll("_", " ");
}

export class NeerslagRadarCard extends LitElement {
  static properties = { hass: { attribute: false } };
  hass?: HomeAssistant;
  private config?: RadarConfig;
  private hiddenProviders = new Set<string>();
  private hover?: { timestamp: number; items: TooltipItem[] };

  static styles = css`
    :host { display: block; }
    ha-card { overflow: hidden; }
    .content { padding: 14px 16px 12px; }
    h2 { font-size: 1rem; margin: 0 0 10px; font-weight: 500; color: var(--primary-text-color); }
    .legend { display: flex; flex-wrap: wrap; gap: 5px 12px; margin-bottom: 6px; }
    .legend button { display: inline-flex; align-items: center; gap: 5px; color: var(--primary-text-color); border: 0; background: transparent; padding: 2px; cursor: pointer; font: inherit; font-size: .8rem; }
    .legend button[aria-pressed="false"] { opacity: .45; text-decoration: line-through; }
    .swatch { width: 13px; height: 3px; background: var(--series-color); border-radius: 3px; }
    .chart { width: 100%; display: block; outline: none; touch-action: pan-y; }
    .grid { stroke: var(--divider-color, #d0d0d0); stroke-opacity: .65; stroke-width: 1; }
    .axis, .tick { fill: var(--secondary-text-color); font-size: 10px; }
    .axis { font-size: 9px; }
    path.series { fill: none; stroke: var(--series-color); stroke-width: 2.5; vector-effect: non-scaling-stroke; stroke-linecap: round; stroke-linejoin: round; }
    path.unavailable { stroke-dasharray: 5 4; opacity: .56; }
    .cursor { stroke: var(--secondary-text-color); stroke-width: 1; stroke-dasharray: 3 3; }
    .tooltip { position: relative; margin: 2px 0 0 46px; padding: 7px 9px; border-radius: 6px; background: var(--secondary-background-color, rgba(127,127,127,.14)); color: var(--primary-text-color); font-size: .78rem; }
    .tooltip div + div { margin-top: 3px; }
    .warning { color: var(--warning-color, #f57c00); font-size: .78rem; margin: 4px 0 0; }
    .empty { color: var(--secondary-text-color); padding: 16px 0; }
    @media (max-width: 400px) { .content { padding-inline: 10px; } .tooltip { margin-left: 38px; } }
  `;

  setConfig(config: RadarConfig): void { validateConfig(config); this.config = { ...config }; }
  getCardSize(): number { return 4; }
  getGridOptions() { return { columns: 12, min_columns: 6, max_columns: 12, min_rows: 3 }; }

  static getConfigElement(): HTMLElement { return document.createElement("neerslag-radar-card-editor"); }
  static getStubConfig(hass?: HomeAssistant): RadarConfig {
    const location = hass ? collectLocations(hass)[0] : undefined;
    return { type: "custom:neerslag-radar-card", location_id: location?.id ?? "" };
  }
  static getEntitySuggestion(): undefined { return undefined; }

  private locale(): string { return this.hass?.locale?.language ?? this.hass?.config.language ?? "en"; }
  private timeZone(): string | undefined { return this.hass?.config.time_zone; }
  private formatTime(timestamp: number): string {
    return new Intl.DateTimeFormat(this.locale(), { hour: "2-digit", minute: "2-digit", timeZone: this.timeZone() }).format(timestamp);
  }
  private formatNumber(value: number): string { return new Intl.NumberFormat(this.locale(), { maximumFractionDigits: 2 }).format(value); }
  private providerKey(provider: ProviderForecast): string { return `${provider.provider}|${provider.entityId}`; }
  private toggle(provider: ProviderForecast): void {
    const key = this.providerKey(provider);
    if (this.hiddenProviders.has(key)) {
      this.hiddenProviders.delete(key);
    } else {
      this.hiddenProviders.add(key);
    }
    this.hiddenProviders = new Set(this.hiddenProviders);
    this.requestUpdate();
  }
  private setHover(event: PointerEvent | KeyboardEvent, range: ChartRange, providers: ProviderForecast[]): void {
    let ratio: number;
    if (event instanceof PointerEvent) {
      const bounds = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
      const svgX = ((event.clientX - bounds.left) / bounds.width) * PLOT.width;
      ratio = Math.max(0, Math.min(1, (svgX - PLOT.left) / (PLOT.width - PLOT.left - PLOT.right)));
    } else {
      const previous = this.hover?.timestamp ?? range.start;
      const direction = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
      const timestamp = event.key === "Home" ? range.start : event.key === "End" ? range.end : previous + direction * 60_000;
      ratio = Math.max(0, Math.min(1, (timestamp - range.start) / (range.end - range.start)));
    }
    const timestamp = range.start + ratio * (range.end - range.start);
    this.hover = { timestamp, items: tooltipAt(providers, timestamp) };
    this.requestUpdate();
  }

  private renderChart(providers: ProviderForecast[], range: ChartRange) {
    const language = this.locale();
    const plotHeight = PLOT.height - PLOT.top - PLOT.bottom;
    const plotWidth = PLOT.width - PLOT.left - PLOT.right;
    const ticks = [0, .5, 1];
    const shown = providers.filter((provider) => !this.hiddenProviders.has(this.providerKey(provider)));
    const cursorX = this.hover ? PLOT.left + ((this.hover.timestamp - range.start) / (range.end - range.start)) * plotWidth : undefined;
    return html`
      <div class="legend" aria-label=${t(language, "intensity")}>
        ${providers.map((provider) => {
          const visible = !this.hiddenProviders.has(this.providerKey(provider));
          return html`<button aria-pressed=${String(visible)} @click=${() => this.toggle(provider)} style=${`--series-color:${providerColor(provider.provider)}`}>
            <span class="swatch"></span>${providerName(provider.provider)}
            ${provider.unavailable ? html`<span class="warning-icon" title=${t(language, "staleProvider")} aria-label=${t(language, "staleProvider")}>⚠</span>` : null}
          </button>`;
        })}
      </div>
      <svg class="chart" viewBox="0 0 ${PLOT.width} ${PLOT.height}" role="img" tabindex="0"
        aria-label=${t(language, "intensity")}
        @pointermove=${(event: PointerEvent) => this.setHover(event, range, shown)}
        @pointerleave=${() => { this.hover = undefined; this.requestUpdate(); }}
        @keydown=${(event: KeyboardEvent) => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) { event.preventDefault(); this.setHover(event, range, shown); } }}>
        ${ticks.map((tick) => svg`<g><line class="grid" x1=${PLOT.left} x2=${PLOT.width - PLOT.right} y1=${PLOT.top + plotHeight * (1 - tick)} y2=${PLOT.top + plotHeight * (1 - tick)} />
          <text class="tick" x=${PLOT.left - 5} y=${PLOT.top + plotHeight * (1 - tick) + 3} text-anchor="end">${this.formatNumber(range.maxY * tick)}</text></g>`)}
        <text class="axis" x="5" y="12">mm/u</text>
        ${[0, .5, 1].map((tick) => svg`<text class="tick" x=${PLOT.left + plotWidth * tick} y=${PLOT.height - 10} text-anchor=${tick === 0 ? "start" : tick === 1 ? "end" : "middle"}>${this.formatTime(range.start + (range.end - range.start) * tick)}</text>`)}
        ${shown.map((provider) => svg`<path class="series ${provider.unavailable ? "unavailable" : ""}" style=${`--series-color:${providerColor(provider.provider)}`} d=${seriesPath(provider, range)} />`)}
        ${cursorX !== undefined ? svg`<line class="cursor" x1=${cursorX} x2=${cursorX} y1=${PLOT.top} y2=${PLOT.top + plotHeight} />` : null}
      </svg>
      ${this.hover?.items.length ? html`<div class="tooltip" role="status">
        ${this.hover.items.map((item) => html`<div><strong>${providerName(item.provider)}</strong>: ${this.formatTime(item.point.start)}–${this.formatTime(item.point.end)} · ${this.formatNumber(item.point.precipitation_intensity)} ${t(language, "intensityUnit")} · ${this.formatNumber(item.point.precipitation)} mm</div>`)}</div>` : null}`;
  }

  render() {
    const language = this.locale();
    const locations = this.hass ? collectLocations(this.hass) : [];
    const locationId = this.config?.location_id || (locations.length === 1 ? locations[0].id : undefined);
    const location = locations.find((candidate) => candidate.id === locationId);
    const providers = location ? activeProviders(location) : [];
    const range = chartRange(providers);
    const title = this.config?.title || t(language, "titlePlaceholder");
    return html`<ha-card><div class="content"><h2>${title}</h2>
      ${range ? this.renderChart(providers, range) : html`<div class="empty">${t(language, "noData")}</div>`}
      ${providers.some((provider) => provider.unavailable) ? html`<p class="warning" role="alert">${t(language, "unavailable")}</p>` : null}
    </div></ha-card>`;
  }
}

if (!customElements.get("neerslag-radar-card")) customElements.define("neerslag-radar-card", NeerslagRadarCard);
