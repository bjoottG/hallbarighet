# Hållbarhet

Dashboard för hållbarhetsdata, byggd med [Next.js](https://nextjs.org). Strukturen är baserad på [interregbarometern](https://github.com/bjoottG/interregbarometern) men ska få en egen datastruktur och egen rådata.

## Status

- [x] Projektskelett kopierat från interregbarometern (sidor, filter, diagram, tabeller, karta)
- [ ] Ny datastruktur definierad utifrån Excel med rådata (**väntar på Excelfilen**)
- [ ] `public/data/rawdata.json` ersatt med hållbarhetsdata
- [ ] Typer i `src/types/index.ts` anpassade till den nya datastrukturen
- [ ] Komponenter anpassade till nya fält

Tills den nya rådatan finns på plats ligger Interreg-datan kvar som platshållare så att appen bygger och går att deploya.

## Dataflöde

1. Rådata levereras som Excel.
2. Excel konverteras till JSON och sparas som `public/data/rawdata.json`.
3. `src/lib/data.ts` läser JSON:en, `src/types/index.ts` definierar typerna.
4. Komponenterna i `src/components/` filtrerar och visualiserar datan via `src/context/FilterContext.tsx`.

## Utveckling

```bash
npm install
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

## Deploy

Projektet deployas till Vercel med projektnamnet `hallbarighet`.
