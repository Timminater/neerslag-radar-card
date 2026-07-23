import type { ChartRange, ParsedPoint, ProviderForecast } from "./types";

/** Monotone cubic interpolation (Fritsch-Carlson): never overshoots adjacent values. */
export function monotonePath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  const slopes = points.slice(1).map((point, index) =>
    (point.y - points[index].y) / (point.x - points[index].x));
  const tangents = points.map((_, index) => {
    if (index === 0) return slopes[0];
    if (index === points.length - 1) return slopes[slopes.length - 1];
    if (slopes[index - 1] * slopes[index] <= 0) return 0;
    const h0 = points[index].x - points[index - 1].x;
    const h1 = points[index + 1].x - points[index].x;
    return 3 * (h0 + h1) / ((2 * h1 + h0) / slopes[index - 1] + (h1 + 2 * h0) / slopes[index]);
  });
  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const a = points[index]; const b = points[index + 1]; const h = (b.x - a.x) / 3;
    path += ` C ${(a.x + h).toFixed(2)} ${(a.y + h * tangents[index]).toFixed(2)}`;
    path += ` ${(b.x - h).toFixed(2)} ${(b.y - h * tangents[index + 1]).toFixed(2)}`;
    path += ` ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
  }
  return path;
}

export const PLOT = { width: 600, height: 220, left: 46, right: 12, top: 18, bottom: 34 };

export function clampTooltipCenter(
  anchor: number,
  containerWidth: number,
  tooltipWidth: number,
  padding = 12,
): number {
  const halfWidth = tooltipWidth / 2;
  const minimum = padding + halfWidth;
  const maximum = containerWidth - padding - halfWidth;
  return Math.max(minimum, Math.min(maximum, anchor));
}

export function seriesPath(provider: ProviderForecast, range: ChartRange): string {
  const width = PLOT.width - PLOT.left - PLOT.right;
  const height = PLOT.height - PLOT.top - PLOT.bottom;
  const visible = provider.points.filter((point: ParsedPoint) => point.middle >= range.start && point.middle <= range.end);
  const pixels = visible.map((point) => ({
    x: PLOT.left + ((point.middle - range.start) / (range.end - range.start)) * width,
    y: PLOT.top + height - Math.max(0, Math.min(range.maxY, point.precipitation_intensity)) / range.maxY * height,
  }));
  return monotonePath(pixels);
}
