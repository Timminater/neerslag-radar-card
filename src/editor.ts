import { LitElement, css, html } from "lit";
import { collectLocations } from "./data";
import { t } from "./i18n";
import type { HomeAssistant, RadarConfig } from "./types";

export class NeerslagRadarCardEditor extends LitElement {
  static properties = { hass: { attribute: false }, _config: { state: true } };
  hass?: HomeAssistant;
  private _config?: RadarConfig;

  static styles = css`
    :host { display: block; padding: 16px; }
    .field { display: grid; gap: 6px; margin: 0 0 16px; }
    label { font-weight: 500; }
    select, input { font: inherit; border: 1px solid var(--divider-color); border-radius: 4px; padding: 9px; color: var(--primary-text-color); background: var(--card-background-color); }
  `;

  setConfig(config: RadarConfig): void { this._config = { ...config }; }

  private changed(key: "location_id" | "title", value: string): void {
    const config = { type: "custom:neerslag-radar-card" as const, ...this._config, [key]: value };
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }

  render() {
    const language = this.hass?.locale?.language ?? this.hass?.config.language;
    const locations = this.hass ? collectLocations(this.hass) : [];
    const selected = this._config?.location_id ?? (locations.length === 1 ? locations[0].id : "");
    return html`
      <div class="field">
        <label for="location">${t(language, "location")}</label>
        <select id="location" .value=${selected} @change=${(event: Event) => this.changed("location_id", (event.target as HTMLSelectElement).value)}>
          ${locations.length !== 1 ? html`<option value="" disabled>${t(language, "chooseLocation")}</option>` : null}
          ${locations.map((location) => html`<option value=${location.id}>${location.name}</option>`)}
        </select>
      </div>
      <div class="field">
        <label for="title">${t(language, "title")}</label>
        <input id="title" .value=${this._config?.title ?? ""} placeholder=${t(language, "titlePlaceholder")}
          @input=${(event: Event) => this.changed("title", (event.target as HTMLInputElement).value)}>
      </div>`;
  }
}

if (!customElements.get("neerslag-radar-card-editor")) {
  customElements.define("neerslag-radar-card-editor", NeerslagRadarCardEditor);
}
