export interface ForecastPoint {
  datetime: string;
  interval_minutes: number;
  precipitation: number;
  precipitation_intensity: number;
  probability?: number;
  uncertainty?: number;
  source?: string;
}

export interface RadarConfig {
  type: "custom:neerslag-radar-card";
  location_id?: string;
  title?: string;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  config: { time_zone?: string; language?: string };
  locale?: { language?: string };
}

export interface ParsedPoint extends ForecastPoint {
  start: number;
  end: number;
  middle: number;
}

export interface ProviderForecast {
  entityId: string;
  provider: string;
  locationId: string;
  locationName: string;
  points: ParsedPoint[];
  unavailable: boolean;
}

export interface LocationForecast {
  id: string;
  name: string;
  providers: ProviderForecast[];
}

export interface ChartRange {
  start: number;
  end: number;
  maxY: number;
}

export interface TooltipItem {
  provider: string;
  point: ParsedPoint;
  unavailable: boolean;
}
