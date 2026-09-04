# Hållbarhet

Dashboard för hållbarhetsdata i Tillväxtverkets ärenden, byggd med [Next.js](https://nextjs.org). Strukturen är baserad på [interregbarometern](https://github.com/bjoottG/interregbarometern).

## Innehåll

- **Översikt** – 7 KPI-rutor och 7 filterstyrda tabeller (hållbarhetsområden, delområden, utlysningar, branscher, AOS-bedömning, AOU-utfall, ärendelista).
- **Diagram** – filterstyrda diagram över områden, delområden, branscher, AOS-bedömningar, AOU-utfall och utlysningar.
- **Agenda 2030** – relationerna hållbarhetsområde → delområde → globala mål, med KPI:er, diagram och tabell per mål.
- **Ordlista** – begrepp och definitioner, inklusive de sju hållbarhetsområdena.

## Data

Rådata ligger i `data/`:

| Fil | Innehåll |
|---|---|
| `hallbarhetsomraden_ver4.xlsx` | 950 ärenden med grunddata (inkl. stödtyp och beslutande organisation) och hållbarhetsval (Nivå 1/Nivå 2, AOS- och AOU-bedömningar) |
| `hallbarhetsområden_agend2030.xlsx` | Definitioner av områden och delområden samt koppling till Agenda 2030-målen |
| `hallbarhetsomraden._niva1_niva2xlsx.xlsx` | Referens: Nivå 1/Nivå 2-strukturen |

Konvertering till appens format görs med:

```bash
npm run convert-data
```

Skriptet läser Excelfilerna och genererar `public/data/rawdata.json` (ärenden) och `src/lib/omradenDef.ts` (områdesdefinitioner). Kör om det när Excelfilerna uppdateras.

## Filter

Alla tabeller och diagram styrs av filtren: Stödtyp, Beslutande organisation, Utlysning, Bransch, Hållbarhetsområde (Nivå 1), Delområde (Nivå 2), AOS – Godkännas (bedömning), Slutlig AOU – Bidragit till, Slutlig AOU – Godkänd samt Agenda 2030-mål.

## Utveckling

```bash
npm install
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000). Sajten skyddas av Basic Auth (samma inloggning som interregbarometern).

## Deploy

Projektet deployas till Vercel med projektnamnet `hallbarighet`. GitHub-repot är kopplat för automatisk deploy vid push till `main`.
