import { describe, expect, it } from "vitest";
import { clampTooltipCenter, monotonePath, seriesPath } from "../src/chart";
import type { ProviderForecast } from "../src/types";

describe("chart geometry", () => {
  it("keeps a tooltip inside both chart edges", () => {
    expect(clampTooltipCenter(20, 500, 360)).toBe(192);
    expect(clampTooltipCenter(250, 500, 360)).toBe(250);
    expect(clampTooltipCenter(480, 500, 360)).toBe(308);
  });

  it("generates a continuous monotone cubic path", () => {
    const path = monotonePath([{ x: 0, y: 100 }, { x: 10, y: 0 }, { x: 20, y: 100 }]);
    expect(path).toMatch(/^M 0.00 100.00 C /);
    expect((path.match(/ C /g) ?? [])).toHaveLength(2);
  });

  it("clamps negative and over-scale series values to the plot bounds", () => {
    const provider: ProviderForecast = {
      entityId: "sensor.a", provider: "a", locationId: "u", locationName: "U", unavailable: false,
      points: [
        { datetime: "2026-01-01T00:00:00Z", interval_minutes: 5, precipitation: 0, precipitation_intensity: -1, start: 0, end: 300000, middle: 150000 },
        { datetime: "2026-01-01T00:05:00Z", interval_minutes: 5, precipitation: 2, precipitation_intensity: 20, start: 300000, end: 600000, middle: 450000 },
      ],
    };
    const values = seriesPath(provider, { start: 0, end: 600000, maxY: 5 }).match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    const yValues = values.filter((_, index) => index % 2 === 1);
    expect(Math.min(...yValues)).toBeGreaterThanOrEqual(18);
    expect(Math.max(...yValues)).toBeLessThanOrEqual(186);
  });
});
