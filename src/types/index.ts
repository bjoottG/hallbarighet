import { OMRADEN } from '@/lib/omradenDef';
export { OMRADEN } from '@/lib/omradenDef';
export type { OmradeDef, DelomradeDef } from '@/lib/omradenDef';

// ─── Datamodell ──────────────────────────────────────────────────────────────

/** Ett ärendes uppgifter för ett hållbarhetsområde (Nivå 1) */
export interface OmradeData {
  /** Området valt i ansökan [Ja/Nej] */
  valt: boolean;
  /** AOS – Bidrar till (sökande) per delområde: 'Ja' | 'Nej' | null */
  delomraden: Record<string, string | null>;
  /** AOS – Godkännas (bedömning): 0 Nej, 1 Hänsyn, 2 Positiv påverkan, 3 Transformativt */
  aosGodkannas: number | null;
  /** Slutlig AOU – Bidragit till (sökande): 1–3 */
  aouBidragit: number | null;
  /** Slutlig AOU – Godkännas (bedömning): 'Ja' | 'Nej' */
  aouGodkannas: string | null;
}

export interface Arende {
  arendeid: number;
  stodtyp: string;
  beslutandeOrg: string;
  utlysning: string;
  beviljat: number;
  utbetalt: number;
  bransch: string;
  omraden: Record<string, OmradeData>;
}

// ─── Filter ──────────────────────────────────────────────────────────────────

export interface FilterState {
  stodtyp: string[];
  beslutandeOrg: string[];
  utlysning: string[];
  bransch: string[];
  omrade: string[];        // område-id (Nivå 1)
  delomrade: string[];     // delområde-id (Nivå 2)
  aosBedomning: string[];  // '0' | '1' | '2' | '3'
  aouBidragit: string[];   // '1' | '2' | '3'
  aouGodkannas: string[];  // 'Ja' | 'Nej'
  agendaMal: string[];     // '1'–'17'
}

export const FILTER_DEFAULTS: FilterState = {
  stodtyp: [],
  beslutandeOrg: [],
  utlysning: [],
  bransch: [],
  omrade: [],
  delomrade: [],
  aosBedomning: [],
  aouBidragit: [],
  aouGodkannas: [],
  agendaMal: [],
};

// ─── Uppslag och etiketter ───────────────────────────────────────────────────

export const OMRADE_IDS = OMRADEN.map((o) => o.id);

export const OMRADE_NAMN: Record<string, string> = Object.fromEntries(
  OMRADEN.map((o) => [o.id, `${o.nummer}. ${o.namn}`]),
);

export const DELOMRADE_NAMN: Record<string, string> = Object.fromEntries(
  OMRADEN.flatMap((o) => o.delomraden.map((d) => [d.id, d.namn])),
);

/** delområde-id → område-id */
export const DELOMRADE_OMRADE: Record<string, string> = Object.fromEntries(
  OMRADEN.flatMap((o) => o.delomraden.map((d) => [d.id, o.id])),
);

/** delområde-id → Agenda 2030-mål */
export const DELOMRADE_AGENDA: Record<string, number[]> = Object.fromEntries(
  OMRADEN.flatMap((o) => o.delomraden.map((d) => [d.id, d.agenda2030])),
);

export const AOS_SKALA: Record<string, string> = {
  '0': '0 – Nej',
  '1': '1 – Hänsyn',
  '2': '2 – Positiv påverkan',
  '3': '3 – Transformativt',
};

export const AOS_BESKRIVNING: Record<string, string> = {
  '0': 'Bedömningen godkänner inte området som hållbarhetsinsats',
  '1': 'Insatsen tar hänsyn till hållbarhetsområdet',
  '2': 'Insatsen har en positiv påverkan på hållbarhetsområdet',
  '3': 'Insatsen är transformativ inom hållbarhetsområdet',
};

export const AOU_SKALA: Record<string, string> = {
  '1': '1 – Har till största del uppnåtts',
  '2': '2 – Bara vissa delar har uppnåtts',
  '3': '3 – Har ej uppnåtts',
};

export const STODTYP_NAMN: Record<string, string> = {
  PROJ: 'PROJ – Projektstöd',
  FTG: 'FTG – Företagsstöd',
  'EU21-27': 'EU21-27 – EU-program 2021–2027',
};

// ─── Agenda 2030 ─────────────────────────────────────────────────────────────

export const AGENDA_MAL_NAMN: Record<number, string> = {
  1: 'Ingen fattigdom',
  2: 'Ingen hunger',
  3: 'God hälsa och välbefinnande',
  4: 'God utbildning',
  5: 'Jämställdhet',
  6: 'Rent vatten och sanitet för alla',
  7: 'Hållbar energi för alla',
  8: 'Anständiga arbetsvillkor och ekonomisk tillväxt',
  9: 'Hållbar industri, innovationer och infrastruktur',
  10: 'Minskad ojämlikhet',
  11: 'Hållbara städer och samhällen',
  12: 'Hållbar konsumtion och produktion',
  13: 'Bekämpa klimatförändringarna',
  14: 'Hav och marina resurser',
  15: 'Ekosystem och biologisk mångfald',
  16: 'Fredliga och inkluderande samhällen',
  17: 'Genomförande och globalt partnerskap',
};

/** FN:s officiella färger för de 17 globala målen */
export const AGENDA_MAL_FARG: Record<number, string> = {
  1: '#E5243B', 2: '#DDA63A', 3: '#4C9F38', 4: '#C5192D', 5: '#FF3A21',
  6: '#26BDE2', 7: '#FCC30B', 8: '#A21942', 9: '#FD6925', 10: '#DD1367',
  11: '#FD9D24', 12: '#BF8B2E', 13: '#3F7E44', 14: '#0A97D9', 15: '#56C02B',
  16: '#00689D', 17: '#19486A',
};

/** Alla mål som förekommer i delområdenas kopplingar, sorterade */
export const AGENDA_MAL_AKTUELLA: number[] = [
  ...new Set(OMRADEN.flatMap((o) => o.delomraden.flatMap((d) => d.agenda2030))),
].sort((a, b) => a - b);

// ─── Diagramfärger (samma palett som interregbarometern) ─────────────────────

export const DIAGRAM_COLORS = [
  '#00A896',
  '#4A1B8B',
  '#7B4FBC',
  '#2196A8',
  '#A855F7',
  '#E040FB',
  '#00BCD4',
  '#9C27B0',
  '#F48FB1',
  '#80CBC4',
];

/** Fast färg per hållbarhetsområde (nummer 1–7) */
export const OMRADE_FARG: Record<string, string> = Object.fromEntries(
  OMRADEN.map((o, i) => [o.id, DIAGRAM_COLORS[i % DIAGRAM_COLORS.length]]),
);

export const AOS_FARG: Record<string, string> = {
  '0': '#C9C4D4',
  '1': '#80CBC4',
  '2': '#00A896',
  '3': '#4A1B8B',
};

export const AOU_FARG: Record<string, string> = {
  '1': '#00A896',
  '2': '#F0A202',
  '3': '#D64550',
};
