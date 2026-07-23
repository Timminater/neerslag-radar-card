import { NeerslagRadarCard } from "./neerslag-radar-card";

declare global {
  interface Window { customCards?: Array<Record<string, unknown>>; }
}

window.customCards ??= [];
if (!window.customCards.some((card) => card.type === "neerslag-radar-card")) {
  window.customCards.push({
    type: "neerslag-radar-card",
    name: "Neerslag Radar Card",
    description: "Compare local precipitation forecasts from multiple providers.",
    documentationURL: "https://github.com/timminaters/neerslag-radar-card",
    preview: true,
  });
}

export { NeerslagRadarCard };
