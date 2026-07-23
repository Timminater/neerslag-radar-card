const strings = {
  nl: {
    unavailable: "Een of meer bronnen zijn niet beschikbaar; de verwachting kan verouderd zijn.",
    noData: "Geen actuele neerslagverwachting beschikbaar.",
    chooseLocation: "Kies een locatie",
    location: "Locatie",
    title: "Titel",
    titlePlaceholder: "Neerslagverwachting",
    intensity: "Neerslagintensiteit (mm/u)",
    amount: "Neerslag",
    interval: "Interval",
    configuration: "Kaartconfiguratie",
    intensityUnit: "mm/u",
    staleProvider: "Deze provider is tijdelijk niet beschikbaar; laatst bekende verwachting",
  },
  en: {
    unavailable: "One or more sources are unavailable; this forecast may be stale.",
    noData: "No current precipitation forecast available.",
    chooseLocation: "Choose a location",
    location: "Location",
    title: "Title",
    titlePlaceholder: "Precipitation forecast",
    intensity: "Precipitation intensity (mm/h)",
    amount: "Precipitation",
    interval: "Interval",
    configuration: "Card configuration",
    intensityUnit: "mm/h",
    staleProvider: "This provider is temporarily unavailable; last known forecast",
  },
} as const;

export type TranslationKey = keyof typeof strings.en;

export function languageOf(language?: string): keyof typeof strings {
  return language?.toLowerCase().startsWith("nl") ? "nl" : "en";
}

export function t(language: string | undefined, key: TranslationKey): string {
  return strings[languageOf(language)][key];
}
