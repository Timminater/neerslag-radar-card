import { describe, expect, it } from "vitest";
import { chartRange, collectLocations, parseForecastPoint, tooltipAt, validateConfig } from "../src/data";
import type { HomeAssistant, ProviderForecast } from "../src/types";

const now = Date.parse("2026-07-23T10:00:00Z");
const point = (datetime: string, interval = 5, intensity = 1, precipitation = intensity * interval / 60) =>
  ({ datetime, interval_minutes: interval, precipitation, precipitation_intensity: intensity });
const entity = (id: string, provider: string, forecast: unknown[], state = "1") => ({
  entity_id: id, state, attributes: { forecast_schema_version: 1, location_id: "utrecht", location_name: "Utrecht", provider, forecast },
});
const hass = (states: Record<string, ReturnType<typeof entity>>): HomeAssistant => ({ states, config: { time_zone: "Europe/Amsterdam", language: "nl" } });

describe("forecast contract", () => {
  it("parses schema points and accepts 5 and 15 minute intervals", () => {
    expect(parseForecastPoint(point("2026-07-23T10:00:00Z", 5))?.end).toBe(now + 5 * 60_000);
    expect(parseForecastPoint(point("2026-07-23T10:00:00Z", 15))?.middle).toBe(now + 7.5 * 60_000);
    expect(parseForecastPoint({ ...point("invalid"), datetime: "invalid" })).toBeUndefined();
  });

  it("groups by location and always excludes global providers", () => {
    const locations = collectLocations(hass({
      "sensor.local": entity("sensor.local", "buienradar", [point("2026-07-23T10:00:00Z")]),
      "sensor.global": entity("sensor.global", "GLOBAL", [point("2026-07-23T10:00:00Z")]),
      "sensor.legacy": { ...entity("sensor.legacy", "knmi", [point("2026-07-23T10:00:00Z")]), attributes: { forecast_schema_version: 2 } } as ReturnType<typeof entity>,
    }));
    expect(locations).toHaveLength(1);
    expect(locations[0].providers.map((provider) => provider.provider)).toEqual(["buienradar"]);
  });

  it("uses the longest actual horizon but caps a chart at three hours", () => {
    const locations = collectLocations(hass({
      "sensor.a": entity("sensor.a", "a", [point("2026-07-23T09:55:00Z", 15, 2), point("2026-07-23T13:00:00Z", 15, 1)]),
      "sensor.b": entity("sensor.b", "b", [point("2026-07-23T10:15:00Z", 5, 6)]),
    }));
    const range = chartRange(locations[0].providers, now);
    expect(range).toMatchObject({ start: Date.parse("2026-07-23T09:55:00Z"), end: Date.parse("2026-07-23T12:55:00Z"), maxY: 10 });
  });

  it("does not draw completely expired data and keeps unavailable forecast data", () => {
    const locations = collectLocations(hass({
      "sensor.expired": entity("sensor.expired", "a", [point("2026-07-23T09:00:00Z")]),
      "sensor.stale": entity("sensor.stale", "b", [point("2026-07-23T10:00:00Z")], "unavailable"),
    }));
    const active = locations[0].providers.map((provider) => ({ ...provider, points: provider.points.filter((candidate) => candidate.end > now) }));
    expect(active).toHaveLength(2);
    expect(active.filter((provider) => provider.points.length > 0)).toHaveLength(1);
    expect(active[1].unavailable).toBe(true);
  });

  it("maps a tooltip to the true start and end of each provider interval", () => {
    const provider: ProviderForecast = {
      entityId: "sensor.a", provider: "a", locationId: "u", locationName: "Utrecht", unavailable: false,
      points: [parseForecastPoint(point("2026-07-23T10:00:00Z", 15, 4))!],
    };
    const tooltip = tooltipAt([provider], now + 8 * 60_000);
    expect(tooltip[0].point.start).toBe(now);
    expect(tooltip[0].point.end).toBe(now + 15 * 60_000);
  });

  it("validates the required configuration", () => {
    expect(() => validateConfig({ type: "custom:neerslag-radar-card", location_id: "utrecht" })).not.toThrow();
    expect(() => validateConfig({ type: "custom:neerslag-radar-card" })).not.toThrow();
    expect(() => validateConfig({ type: "custom:neerslag-radar-card", location_id: 42 })).toThrow(/Invalid/);
  });
});
