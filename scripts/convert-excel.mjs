/**
 * Konverterar rådata-Excel till appens datafiler.
 *
 * Läser:
 *   data/hallbarhetsomraden_ver3.xlsx        → ärenderader
 *   data/hallbarhetsområden_agend2030.xlsx   → definitioner (områden, delområden, Agenda 2030-mål)
 *
 * Skriver:
 *   public/data/rawdata.json   → Arende[]
 *   src/lib/omradenDef.ts      → genererad definitionsmodul (OMRADEN)
 *
 * Kör: npm run convert-data
 */
import XLSX from 'xlsx';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// ── Definitioner från agendafilen ────────────────────────────────────────────
const agendaWb = XLSX.readFile(join(root, 'data/hallbarhetsområden_agend2030.xlsx'));
const agendaRows = XLSX.utils.sheet_to_json(agendaWb.Sheets[agendaWb.SheetNames[0]], { defval: null });

const AREA_ORDER = ['climate', 'circularity', 'consumption', 'inclusion', 'health', 'economy', 'poverty'];
const areas = new Map();
for (const r of agendaRows) {
  const id = r['Hållbarhetsområde ID'];
  if (!areas.has(id)) {
    areas.set(id, {
      id,
      nummer: AREA_ORDER.indexOf(id) + 1,
      namn: r['Hållbarhetsområde'],
      beskrivning: (r['Områdesbeskrivning'] ?? '').trim(),
      delomraden: [],
    });
  }
  areas.get(id).delomraden.push({
    id: r['Delområde ID'],
    namn: r['Delområde'],
    beskrivning: (r['Delområdesbeskrivning'] ?? '').trim(),
    agenda2030: String(r['Agenda 2030'] ?? '')
      .replace(/^Mål\s*/i, '')
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n)),
  });
}
const OMRADEN = AREA_ORDER.map((id) => areas.get(id));

// ── Ärenderader från huvudfilen ──────────────────────────────────────────────
// Kolumnlayout per områdesblock: flagga [Ja/Nej], en kolumn per delområde
// (AOS – Bidrar till), därefter AOS – Godkännas (0–3), Slutlig AOU – Bidragit
// till (1–3) och Slutlig AOU – Godkännas [Ja/Nej].
const BLOCKS = [
  { id: 'climate',     flag: 6,  subs: [7, 8, 9, 10] },
  { id: 'circularity', flag: 14, subs: [15, 16, 17] },
  { id: 'consumption', flag: 21, subs: [22, 23] },
  { id: 'inclusion',   flag: 27, subs: [28, 29, 30] },
  { id: 'health',      flag: 34, subs: [35, 36, 37] },
  { id: 'economy',     flag: 41, subs: [42, 43, 44] },
  { id: 'poverty',     flag: 48, subs: [49, 50] },
];

const dataWb = XLSX.readFile(join(root, 'data/hallbarhetsomraden_ver3.xlsx'));
const raw = XLSX.utils.sheet_to_json(dataWb.Sheets[dataWb.SheetNames[0]], { header: 1, defval: null });
const dataRows = raw.slice(3); // rad 1–3 är rubriker

const jaNej = (v) => (v === 'Ja' || v === 'Nej' ? v : null);
const num = (v) => (typeof v === 'number' ? v : v != null && v !== '' ? Number(v) : null);

const arenden = dataRows
  .filter((r) => r[0] != null)
  .map((r) => {
    const omraden = {};
    for (const b of BLOCKS) {
      const def = areas.get(b.id);
      const delomraden = {};
      b.subs.forEach((col, i) => {
        delomraden[def.delomraden[i].id] = jaNej(r[col]);
      });
      const after = b.subs[b.subs.length - 1];
      omraden[b.id] = {
        valt: r[b.flag] === 'Ja',
        delomraden,
        aosGodkannas: num(r[after + 1]),
        aouBidragit: num(r[after + 2]),
        aouGodkannas: jaNej(r[after + 3]),
      };
    }
    return {
      arendeid: r[0],
      stodtyp: r[1],
      utlysning: r[2],
      beviljat: num(r[3]) ?? 0,
      utbetalt: num(r[4]) ?? 0,
      bransch: r[5],
      omraden,
    };
  });

writeFileSync(join(root, 'public/data/rawdata.json'), JSON.stringify(arenden));
console.log(`public/data/rawdata.json: ${arenden.length} ärenden`);

// ── Genererad definitionsmodul ───────────────────────────────────────────────
const ts = `// GENERERAD FIL — kör \`npm run convert-data\` för att uppdatera. Redigera inte för hand.
// Källa: data/hallbarhetsområden_agend2030.xlsx

export interface DelomradeDef {
  id: string;
  namn: string;
  beskrivning: string;
  agenda2030: number[];
}

export interface OmradeDef {
  id: string;
  nummer: number;
  namn: string;
  beskrivning: string;
  delomraden: DelomradeDef[];
}

export const OMRADEN: OmradeDef[] = ${JSON.stringify(OMRADEN, null, 2)};
`;
writeFileSync(join(root, 'src/lib/omradenDef.ts'), ts);
console.log(`src/lib/omradenDef.ts: ${OMRADEN.length} områden, ${OMRADEN.reduce((s, o) => s + o.delomraden.length, 0)} delområden`);
