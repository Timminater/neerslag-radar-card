# Neerslag Radar Card

[![CI](https://github.com/timminaters/neerslag-radar-card/actions/workflows/ci.yml/badge.svg)](https://github.com/timminaters/neerslag-radar-card/actions/workflows/ci.yml)

Een compacte, toegankelijke Home Assistant-kaart die lokale neerslagverwachtingen van meerdere aanbieders naast elkaar zet. De kaart gebruikt uitsluitend de forecast-attributen van je sensoren; er zijn geen externe grafiekbibliotheken, CDN's of netwerkverzoeken in de kaart.

## Installeren (HACS)

1. Open **HACS** in Home Assistant.
2. Open rechtsboven het menu en kies **Custom repositories**.
3. Voeg `https://github.com/Timminater/neerslag-radar-card` toe met categorie **Dashboard**.
4. Zoek naar **Neerslag Radar Card** en installeer deze.
5. Herlaad de browser (of vernieuw de dashboard-resources wanneer HACS daarom vraagt).
6. Voeg de kaart toe via de visuele kaartkiezer. Bij één gevonden locatie wordt die automatisch gekozen; bij meerdere locaties kies je er één.

De HACS-release installeert `dist/neerslag-radar-card.js` als een JavaScript-module. Handmatig installeren kan door dit bestand naar `/config/www/` te kopiëren, het als module-resource toe te voegen en de browser te herladen.

## Configuratie

```yaml
type: custom:neerslag-radar-card
location_id: utrecht-centre
title: Neerslag in Utrecht # optioneel
```

`location_id` is verplicht. De visuele editor toont alle geldige lokale locaties, zodat je deze waarde normaal niet zelf hoeft op te zoeken.

## Benodigd sensorcontract

De kaart doorzoekt automatisch alle `sensor.*`-entiteiten. Een sensor telt mee wanneer de attributen dit contract volgen:

```text
forecast_schema_version: 1
location_id: unieke-locatie-id
location_name: Leesbare locatienaam
provider: aanbieder-naam       # "global" wordt altijd uitgesloten
forecast:
  - datetime: 2026-07-23T12:00:00Z
    interval_minutes: 5
    precipitation: 0.12         # mm in dit interval
    precipitation_intensity: 1.44 # mm/u
    probability: 80              # optioneel
    uncertainty: 0.2             # optioneel
    source: radar                # optioneel
```

`datetime` is een UTC ISO-8601 starttijd. Punten mogen 5, 15 of andere positieve intervallen hebben. De kaart toont tijden in de locale taal en tijdzone van Home Assistant.

## Grafiekgedrag

- De horizontale as start bij het eerste nog geldige of overlappende interval en loopt tot de langste werkelijk beschikbare verwachting, met een maximum van drie uur.
- Elke aanbieder stopt op zijn eigen laatste datapunt; korte verwachtingen worden dus niet kunstmatig doorgetrokken.
- Waarden worden op het midden van hun interval getekend met een monotone vloeiende curve. Die kan niet negatief worden of boven lokale pieken doorschieten.
- Klik op een aanbieder in de legenda om de lijn tijdelijk te verbergen. Met toetsenbordfocus op de grafiek werken `←`, `→`, `Home` en `End` voor de tooltip.
- Een `unavailable` of `unknown` sensor met nog forecast-attributen blijft zichtbaar als een gedimde stippellijn met waarschuwing. Volledig verlopen data wordt niet getekend.

Kleuren kun je per dashboardthema overschrijven, bijvoorbeeld:

```yaml
card_mod:
  style: |
    ha-card {
      --neerslag-radar-buienradar: #1565c0;
      --neerslag-radar-buienalarm: #1976d2;
      --neerslag-radar-knmi: #42a5f5;
      --neerslag-radar-open-meteo: #64b5f6;
    }
```

De kaart volgt de standaard light/dark-themekleuren van Home Assistant en werkt in Sections-grid en masonry-lay-outs.

## Ontwikkelen

Vereist: Node.js 24 of nieuwer.

```sh
npm ci
npm run lint
npm test
npm run build
```

De bundel komt in `dist/neerslag-radar-card.js`. De testset controleert parsing en schema-validatie, locatiegroepering en global-uitsluiting, intervallen, grafiekbereiken en curveclamping, tooltip-intervals, verlopen/stale data en configuratievalidatie.

## English

**Neerslag Radar Card** is a compact, accessible Home Assistant card that compares local precipitation forecasts from multiple providers. It only reads sensor forecast attributes: no external chart runtime, CDN, or network request is used.

Add `https://github.com/Timminater/neerslag-radar-card` as a custom HACS repository in the **Dashboard** category, install it, reload your browser, then add the card from the visual card picker. If exactly one valid local location is found it is selected automatically; otherwise choose one in the editor.

```yaml
type: custom:neerslag-radar-card
location_id: utrecht-centre
title: Rain in Utrecht # optional
```

The card scans `sensor.*` entities whose attributes have `forecast_schema_version: 1`, `location_id`, `location_name`, `provider`, and `forecast`. Provider `global` is always ignored. A forecast point needs UTC ISO `datetime`, positive `interval_minutes`, `precipitation` (mm/interval), and `precipitation_intensity` (mm/h); `probability`, `uncertainty`, and `source` are optional.

Times use Home Assistant's configured language and time zone. The chart starts at the first active/overlapping interval and ends at the longest real forecast (up to three hours). Provider lines end at their own horizon. Click legend items to hide/show them; use arrow keys, Home, or End on the chart for the tooltip. Unavailable data remains as a subdued dashed line, while fully expired data is omitted.

For development, run `npm ci`, `npm run lint`, `npm test`, and `npm run build`. The HACS artifact is `dist/neerslag-radar-card.js`.

## License

MIT. See [LICENSE](LICENSE).
