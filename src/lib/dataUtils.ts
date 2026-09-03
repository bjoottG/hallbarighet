import type { Arende } from '@/types';
import { OMRADEN, DELOMRADE_AGENDA } from '@/types';

// ─── Formatering ───────────────────────────────────────────────────────────

export function formatNumber(n: number): string {
  return n.toLocaleString('sv-SE');
}

/** Kompakt beloppsformat: 12,3 mnkr / 1,2 mdkr */
export function formatKr(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('sv-SE', { maximumFractionDigits: 1 })} mdkr`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toLocaleString('sv-SE', { maximumFractionDigits: 1 })} mnkr`;
  return `${formatNumber(Math.round(n))} kr`;
}

export function formatKrFull(n: number): string {
  return `${formatNumber(Math.round(n))} kr`;
}

export function formatPct(n: number): string {
  return `${n.toLocaleString('sv-SE', { maximumFractionDigits: 1 })} %`;
}

// ─── KPI-beräkningar ────────────────────────────────────────────────────────

export function kpiAntalArenden(rows: Arende[]): number {
  return rows.length;
}

export function kpiBeviljat(rows: Arende[]): number {
  return rows.reduce((s, r) => s + (r.beviljat || 0), 0);
}

export function kpiUtbetalt(rows: Arende[]): number {
  return rows.reduce((s, r) => s + (r.utbetalt || 0), 0);
}

/** Antal valda hållbarhetsområden (Nivå 1 = Ja) för ett ärende */
export function antalOmraden(r: Arende): number {
  return OMRADEN.reduce((s, o) => s + (r.omraden[o.id]?.valt ? 1 : 0), 0);
}

/** Antal områden där Nivå 1 = Ja och sökande angett Bidrar till = Ja för minst ett delområde (Nivå 2) */
export function antalOmradenMedDelomrade(r: Arende): number {
  return OMRADEN.reduce((s, o) => {
    const d = r.omraden[o.id];
    if (!d?.valt) return s;
    return s + (Object.values(d.delomraden).some((v) => v === 'Ja') ? 1 : 0);
  }, 0);
}

/** Fördelning: antal ärenden per antal valda hållbarhetsområden (0–7),
 *  dels enligt Nivå 1, dels Nivå 1 med minst ett delområde (Nivå 2) = Ja */
export function fordelningAntalOmraden(rows: Arende[]): { antalOmr: number; niva1: number; niva12: number }[] {
  const result = Array.from({ length: OMRADEN.length + 1 }, (_, i) => ({ antalOmr: i, niva1: 0, niva12: 0 }));
  for (const r of rows) {
    result[antalOmraden(r)].niva1 += 1;
    result[antalOmradenMedDelomrade(r)].niva12 += 1;
  }
  return result;
}

/** Andel ärenden med minst ett valt hållbarhetsområde (0–100) */
export function kpiAndelMedOmrade(rows: Arende[]): number {
  if (rows.length === 0) return 0;
  return (rows.filter((r) => antalOmraden(r) > 0).length / rows.length) * 100;
}

/** Genomsnittligt antal valda områden per ärende */
export function kpiSnittOmraden(rows: Arende[]): number {
  if (rows.length === 0) return 0;
  return rows.reduce((s, r) => s + antalOmraden(r), 0) / rows.length;
}

/** Andel AOS-bedömningar som är Positiv påverkan eller Transformativt (av alla bedömda områdesval), 0–100 */
export function kpiAndelAosPositiv(rows: Arende[]): number {
  let bedomda = 0;
  let positiva = 0;
  for (const r of rows) {
    for (const o of OMRADEN) {
      const v = r.omraden[o.id]?.aosGodkannas;
      if (v != null) {
        bedomda += 1;
        if (v >= 2) positiva += 1;
      }
    }
  }
  return bedomda === 0 ? 0 : (positiva / bedomda) * 100;
}

/** Andel godkända slutliga AOU (av alla AOU-bedömda områdesval), 0–100 */
export function kpiAndelAouGodkand(rows: Arende[]): number {
  let bedomda = 0;
  let godkanda = 0;
  for (const r of rows) {
    for (const o of OMRADEN) {
      const v = r.omraden[o.id]?.aouGodkannas;
      if (v != null) {
        bedomda += 1;
        if (v === 'Ja') godkanda += 1;
      }
    }
  }
  return bedomda === 0 ? 0 : (godkanda / bedomda) * 100;
}

// ─── Aggregeringar ──────────────────────────────────────────────────────────

export interface GruppRad {
  name: string;
  antal: number;
  beviljat: number;
  utbetalt: number;
}

/** Gruppera ärenden på ett grundfält (utlysning, bransch, stödtyp) */
export function perFalt(rows: Arende[], key: 'utlysning' | 'bransch' | 'stodtyp'): GruppRad[] {
  const map = new Map<string, GruppRad>();
  for (const r of rows) {
    const k = r[key] || 'Okänd';
    if (!map.has(k)) map.set(k, { name: k, antal: 0, beviljat: 0, utbetalt: 0 });
    const e = map.get(k)!;
    e.antal += 1;
    e.beviljat += r.beviljat || 0;
    e.utbetalt += r.utbetalt || 0;
  }
  return [...map.values()].sort((a, b) => b.antal - a.antal);
}

export interface OmradeRad extends GruppRad {
  id: string;
  andel: number; // 0–100 av ärenden i urvalet
}

/** Per hållbarhetsområde: antal ärenden som valt området + belopp för dessa ärenden */
export function perOmrade(rows: Arende[]): OmradeRad[] {
  return OMRADEN.map((o) => {
    const valda = rows.filter((r) => r.omraden[o.id]?.valt);
    return {
      id: o.id,
      name: `${o.nummer}. ${o.namn}`,
      antal: valda.length,
      beviljat: valda.reduce((s, r) => s + (r.beviljat || 0), 0),
      utbetalt: valda.reduce((s, r) => s + (r.utbetalt || 0), 0),
      andel: rows.length === 0 ? 0 : (valda.length / rows.length) * 100,
    };
  });
}

export interface DelomradeRad {
  id: string;
  name: string;
  omradeId: string;
  omradeNamn: string;
  antal: number;
  andel: number;
  beviljat: number;
}

/** Per delområde: antal ärenden där sökande angett Bidrar till = Ja */
export function perDelomrade(rows: Arende[]): DelomradeRad[] {
  const result: DelomradeRad[] = [];
  for (const o of OMRADEN) {
    for (const d of o.delomraden) {
      const traffar = rows.filter((r) => r.omraden[o.id]?.delomraden[d.id] === 'Ja');
      result.push({
        id: d.id,
        name: d.namn,
        omradeId: o.id,
        omradeNamn: `${o.nummer}. ${o.namn}`,
        antal: traffar.length,
        andel: rows.length === 0 ? 0 : (traffar.length / rows.length) * 100,
        beviljat: traffar.reduce((s, r) => s + (r.beviljat || 0), 0),
      });
    }
  }
  return result;
}

/** Krysstabell: antal AOS-bedömningar per område och nivå 0–3 */
export function aosPerOmrade(rows: Arende[]): { id: string; name: string; n0: number; n1: number; n2: number; n3: number; total: number }[] {
  return OMRADEN.map((o) => {
    const counts = [0, 0, 0, 0];
    for (const r of rows) {
      const v = r.omraden[o.id]?.aosGodkannas;
      if (v != null && v >= 0 && v <= 3) counts[v] += 1;
    }
    return {
      id: o.id,
      name: `${o.nummer}. ${o.namn}`,
      n0: counts[0], n1: counts[1], n2: counts[2], n3: counts[3],
      total: counts[0] + counts[1] + counts[2] + counts[3],
    };
  });
}

/** AOU-utfall per område: bidragit 1–3 + godkända */
export function aouPerOmrade(rows: Arende[]): { id: string; name: string; b1: number; b2: number; b3: number; godkanda: number; bedomda: number }[] {
  return OMRADEN.map((o) => {
    let b1 = 0, b2 = 0, b3 = 0, godkanda = 0, bedomda = 0;
    for (const r of rows) {
      const d = r.omraden[o.id];
      if (!d) continue;
      if (d.aouBidragit === 1) b1 += 1;
      if (d.aouBidragit === 2) b2 += 1;
      if (d.aouBidragit === 3) b3 += 1;
      if (d.aouGodkannas != null) {
        bedomda += 1;
        if (d.aouGodkannas === 'Ja') godkanda += 1;
      }
    }
    return { id: o.id, name: `${o.nummer}. ${o.namn}`, b1, b2, b3, godkanda, bedomda };
  });
}

/** Fördelning av AOS-bedömningar totalt (nivå → antal) */
export function aosFordelning(rows: Arende[]): { niva: string; antal: number }[] {
  const counts = [0, 0, 0, 0];
  for (const r of rows) {
    for (const o of OMRADEN) {
      const v = r.omraden[o.id]?.aosGodkannas;
      if (v != null && v >= 0 && v <= 3) counts[v] += 1;
    }
  }
  return counts.map((antal, i) => ({ niva: String(i), antal }));
}

// ─── Agenda 2030 ────────────────────────────────────────────────────────────

/** De delområde-id:n där ärendet angett Bidrar till = Ja */
export function arendeDelomraden(r: Arende): string[] {
  const result: string[] = [];
  for (const o of OMRADEN) {
    const d = r.omraden[o.id];
    if (!d?.valt) continue;
    for (const [subId, v] of Object.entries(d.delomraden)) {
      if (v === 'Ja') result.push(subId);
    }
  }
  return result;
}

/** De Agenda 2030-mål ett ärende bidrar till (via delområden med Ja) */
export function arendeAgendaMal(r: Arende): number[] {
  const mal = new Set<number>();
  for (const subId of arendeDelomraden(r)) {
    for (const m of DELOMRADE_AGENDA[subId] ?? []) mal.add(m);
  }
  return [...mal].sort((a, b) => a - b);
}

export interface AgendaMalRad {
  mal: number;
  antal: number;
  andel: number;
  beviljat: number;
  delomraden: string[]; // delområde-id:n kopplade till målet
}

/** Per Agenda 2030-mål: antal ärenden och beviljat belopp för ärenden kopplade till målet */
export function perAgendaMal(rows: Arende[]): AgendaMalRad[] {
  const allaMal = [...new Set(Object.values(DELOMRADE_AGENDA).flat())].sort((a, b) => a - b);
  return allaMal.map((mal) => {
    const subs = Object.entries(DELOMRADE_AGENDA)
      .filter(([, malLista]) => malLista.includes(mal))
      .map(([subId]) => subId);
    const traffar = rows.filter((r) => arendeAgendaMal(r).includes(mal));
    return {
      mal,
      antal: traffar.length,
      andel: rows.length === 0 ? 0 : (traffar.length / rows.length) * 100,
      beviljat: traffar.reduce((s, r) => s + (r.beviljat || 0), 0),
      delomraden: subs,
    };
  });
}
