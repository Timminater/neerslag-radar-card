import type {
  ChartRange,
  ForecastPoint,
  HassEntity,
  HomeAssistant,
  LocationForecast,
  ParsedPoint,
  ProviderForecast,
  TooltipItem,
} from "./types";

const MAX_HORIZON_MS = 3 * 60 * 60 * 1000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseForecastPoint(value: unknown): ParsedPoint | undefined {
  if (!isRecord(value)) return undefined;
  const datetime = value.datetime;
  const interval = value.interval_minutes;
  const precipitation = value.precipitation;
  const intensity = value.precipitation_intensity;
  const start = typeof datetime === "string" ? Date.parse(datetime) : Number.NaN;
  if (!Number.isFinite(start) || typeof interval !== "number" || interval <= 0 ||
      typeof precipitation !== "number" || !Number.isFinite(precipitation) ||
      typeof intensity !== "number" || !Number.isFinite(intensity)) return undefined;
  const optional = (key: "probability" | "uncertainty" | "source") => value[key];
  const point: ForecastPoint = { datetime, interval_minutes: interval, precipitation, precipitation_intensity: intensity };
  if (typeof optional("probability") === "number") point.probability = optional("probability") as number;
  if (typeof optional("uncertainty") === "number") point.uncertainty = optional("uncertainty") as number;
  if (typeof optional("source") === "string") point.source = optional("source") as string;
  const end = start + interval * 60_000;
  return { ...point, start, end, middle: start + (end - start) / 2 };
}

function parseEntity(entity: HassEntity): ProviderForecast | undefined {
  if (!entity.entity_id.startsWith("sensor.")) return undefined;
  const attrs = entity.attributes;
  if (attrs.forecast_schema_version !== 1 || typeof attrs.location_id !== "string" ||
      typeof attrs.location_name !== "string" || typeof attrs.provider !== "string" ||
      attrs.provider.toLowerCase() === "global" || !Array.isArray(attrs.forecast)) return undefined;
  const points = attrs.forecast.map(parseForecastPoint).filter((point): point is ParsedPoint => point !== undefined)
    .sort((a, b) => a.start - b.start);
  if (points.length === 0) return undefined;
  return {
    entityId: entity.entity_id,
    provider: attrs.provider,
    locationId: attrs.location_id,
    locationName: attrs.location_name,
    points,
    unavailable: entity.state === "unavailable" || entity.state === "unknown",
  };
}

/** Finds only version 1 local-provider forecast sensors, grouped by location. */
export function collectLocations(hass: Pick<HomeAssistant, "states">): LocationForecast[] {
  const locations = new Map<string, LocationForecast>();
  Object.values(hass.states).forEach((entity) => {
    const series = parseEntity(entity);
    if (!series) return;
    const location = locations.get(series.locationId) ?? {
      id: series.locationId, name: series.locationName, providers: [],
    };
    location.providers.push(series);
    locations.set(location.id, location);
  });
  return [...locations.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function activeProviders(location: LocationForecast, now = Date.now()): ProviderForecast[] {
  return location.providers.map((provider) => ({
    ...provider,
    points: provider.points.filter((point) => point.end > now),
  })).filter((provider) => provider.points.length > 0);
}

/** Range begins at an active/overlapping interval and is capped to 3 real forecast hours. */
export function chartRange(providers: ProviderForecast[], now = Date.now()): ChartRange | undefined {
  const points = providers.flatMap((provider) => provider.points.filter((point) => point.end > now));
  if (!points.length) return undefined;
  const start = Math.min(...points.map((point) => point.start));
  const longestEnd = Math.max(...points.map((point) => point.end));
  const end = Math.min(longestEnd, start + MAX_HORIZON_MS);
  const maxValue = Math.max(0, ...points.filter((point) => point.middle <= end).map((point) => point.precipitation_intensity));
  return { start, end, maxY: niceMax(maxValue) };
}

/** A readable scale with a stable all-zero fallback. */
export function niceMax(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(value));
  const scaled = value / power;
  const nice = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10;
  return nice * power;
}

export function tooltipAt(providers: ProviderForecast[], timestamp: number): TooltipItem[] {
  return providers.flatMap((provider) => {
    const point = provider.points.find((candidate) => candidate.start <= timestamp && timestamp < candidate.end);
    return point ? [{ provider: provider.provider, point, unavailable: provider.unavailable }] : [];
  });
}

export function validateConfig(config: unknown): asserts config is { type: string; location_id?: string; title?: string } {
  if (!isRecord(config) || config.type !== "custom:neerslag-radar-card" ||
      (config.location_id !== undefined && typeof config.location_id !== "string") ||
      (config.title !== undefined && typeof config.title !== "string")) {
    throw new Error("Invalid configuration for custom:neerslag-radar-card");
  }
}
