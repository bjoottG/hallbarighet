'use client';

import { useMemo, useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import FilterBar from '@/components/FilterBar';
import KPICard from '@/components/KPICard';
import { TableCard, TH, TD } from '@/components/Cards';
import { useFilters } from '@/context/FilterContext';
import {
  kpiAntalOmradesval, kpiSnittOmraden, kpiAndelAosPositiv, kpiAndelAouGodkand,
  perOmrade, perDelomrade, aosPerOmrade, aouPerOmrade, antalOmraden,
  fordelningAntalOmraden,
  formatNumber, formatKr, formatKrFull, formatPct,
} from '@/lib/dataUtils';
import { AOS_SKALA, AOU_SKALA } from '@/types';

const ARENDEN_PER_SIDA = 25;

export default function OversiktPage() {
  const { filtered, isLoading } = useFilters();
  const [sida, setSida] = useState(0);

  const kpis = useMemo(() => ({
    omradesval: kpiAntalOmradesval(filtered),
    snittOmraden: kpiSnittOmraden(filtered),
    andelAosPositiv: kpiAndelAosPositiv(filtered),
    andelAouGodkand: kpiAndelAouGodkand(filtered),
  }), [filtered]);

  const omradeRader = useMemo(() => perOmrade(filtered), [filtered]);
  const delomradeRader = useMemo(() => perDelomrade(filtered).sort((a, b) => b.antal - a.antal), [filtered]);
  const aosRader = useMemo(() => aosPerOmrade(filtered), [filtered]);
  const aouRader = useMemo(() => aouPerOmrade(filtered), [filtered]);
  const fordelningRader = useMemo(() => fordelningAntalOmraden(filtered), [filtered]);

  const antalSidor = Math.max(1, Math.ceil(filtered.length / ARENDEN_PER_SIDA));
  const sidaClamped = Math.min(sida, antalSidor - 1);
  const arendeSida = filtered.slice(sidaClamped * ARENDEN_PER_SIDA, (sidaClamped + 1) * ARENDEN_PER_SIDA);

  if (isLoading) {
    return (
      <>
        <Header />
        <Navigation />
        <div className="max-w-[1200px] mx-auto px-6 py-12 text-center" style={{ color: 'var(--color-text-muted)' }}>
          Laddar data…
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <Navigation />
      <FilterBar />

      <main className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col gap-5">
        {/* KPI-rad */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard title="Valda hållbarhetsområden" value={`${formatNumber(kpis.omradesval)} områdesval`} subtitle={`Urvalet innehåller ${formatNumber(filtered.length)} ärenden`} />
          <KPICard title="Hållbarhetsområden per ärende" value={kpis.snittOmraden.toLocaleString('sv-SE', { maximumFractionDigits: 1 })} subtitle="Genomsnitt av valda hållbarhetsområden" />
          <KPICard title="Bedömda: Positiv eller Transformativt" value={formatPct(kpis.andelAosPositiv)} subtitle="Andel av bedömda områdesval (nivå 2–3)" />
          <KPICard title="Godkända slutliga AOU" value={formatPct(kpis.andelAouGodkand)} subtitle="Andel av AOU-bedömda områdesval" />
        </div>

        {/* Tabell 1–2: Hållbarhetsområden + Delområden */}
        <div className="grid grid-cols-2 gap-4">
          <TableCard
            title="Ärenden per hållbarhetsområde (Nivå 1)"
            subtitle="Ett ärende kan välja flera hållbarhetsområden och räknas då flera gånger."
          >
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <TH>Hållbarhetsområde</TH>
                  <TH right>Ärenden</TH>
                  <TH right>Andel</TH>
                  <TH right>Beviljat</TH>
                  <TH right>Utbetalt</TH>
                </tr>
              </thead>
              <tbody>
                {omradeRader.map((r) => (
                  <tr key={r.id} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <TD>{r.name}</TD>
                    <TD right mono>{formatNumber(r.antal)}</TD>
                    <TD right mono>{formatPct(r.andel)}</TD>
                    <TD right mono>{formatKr(r.beviljat)}</TD>
                    <TD right mono>{formatKr(r.utbetalt)}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>

          <TableCard
            title="Ärenden per delområde (Nivå 2)"
            subtitle="Delområden där sökande angett Bidrar till = Ja."
          >
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <TH>Delområde</TH>
                  <TH>Hållbarhetsområde</TH>
                  <TH right>Ärenden</TH>
                  <TH right>Andel</TH>
                </tr>
              </thead>
              <tbody>
                {delomradeRader.map((r) => (
                  <tr key={r.id} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <TD>{r.name}</TD>
                    <TD>{r.omradeNamn}</TD>
                    <TD right mono>{formatNumber(r.antal)}</TD>
                    <TD right mono>{formatPct(r.andel)}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </div>

        {/* Tabell 5–6: AOS-bedömning + AOU-utfall per område */}
        <div className="grid grid-cols-2 gap-4">
          <TableCard
            title="AOS – Godkännas (bedömning) per hållbarhetsområde"
            subtitle="Antal områdesval per bedömningsnivå."
          >
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <TH>Hållbarhetsområde</TH>
                  <TH right>{AOS_SKALA['0']}</TH>
                  <TH right>{AOS_SKALA['1']}</TH>
                  <TH right>{AOS_SKALA['2']}</TH>
                  <TH right>{AOS_SKALA['3']}</TH>
                </tr>
              </thead>
              <tbody>
                {aosRader.map((r) => (
                  <tr key={r.id} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <TD>{r.name}</TD>
                    <TD right mono>{formatNumber(r.n0)}</TD>
                    <TD right mono>{formatNumber(r.n1)}</TD>
                    <TD right mono>{formatNumber(r.n2)}</TD>
                    <TD right mono>{formatNumber(r.n3)}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>

          <TableCard
            title="Slutlig AOU per hållbarhetsområde"
            subtitle="Sökandes bedömning av måluppfyllelse samt andel godkända."
          >
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <TH>Hållbarhetsområde</TH>
                  <TH right>{AOU_SKALA['1']}</TH>
                  <TH right>{AOU_SKALA['2']}</TH>
                  <TH right>{AOU_SKALA['3']}</TH>
                  <TH right>Godkända</TH>
                </tr>
              </thead>
              <tbody>
                {aouRader.map((r) => (
                  <tr key={r.id} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <TD>{r.name}</TD>
                    <TD right mono>{formatNumber(r.b1)}</TD>
                    <TD right mono>{formatNumber(r.b2)}</TD>
                    <TD right mono>{formatNumber(r.b3)}</TD>
                    <TD right mono>{r.bedomda > 0 ? formatPct((r.godkanda / r.bedomda) * 100) : '–'}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </div>

        {/* Tabell 7: Antal hållbarhetsområden per ärende */}
        <div className="grid grid-cols-2 gap-4">
          <TableCard
            title="Antal hållbarhetsområden per ärende (0–7)"
            subtitle="Hur många hållbarhetsområden (Nivå 1) ärendena valt i ansökan."
          >
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <TH>Antal hållbarhetsområden</TH>
                  <TH right>Ärenden</TH>
                  <TH right>Andel</TH>
                </tr>
              </thead>
              <tbody>
                {fordelningRader.map((r) => (
                  <tr key={r.antalOmr} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <TD>{r.antalOmr}</TD>
                    <TD right mono>{formatNumber(r.antal)}</TD>
                    <TD right mono>{filtered.length > 0 ? formatPct((r.antal / filtered.length) * 100) : '–'}</TD>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2" style={{ borderColor: 'var(--color-border)' }}>
                  <TD>Summa</TD>
                  <TD right mono>{formatNumber(filtered.length)}</TD>
                  <TD right mono>{filtered.length > 0 ? formatPct(100) : '–'}</TD>
                </tr>
              </tfoot>
            </table>
          </TableCard>
        </div>

        {/* Tabell 8: Ärendelista */}
        <TableCard
          title="Ärendelista"
          subtitle={`Visar ${formatNumber(arendeSida.length)} av ${formatNumber(filtered.length)} ärenden i urvalet.`}
          maxHeight={700}
        >
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                <TH>Ärende-id</TH>
                <TH>Stödtyp</TH>
                <TH>Beslutande organisation</TH>
                <TH>Utlysning</TH>
                <TH>Bransch</TH>
                <TH right>Beviljat</TH>
                <TH right>Utbetalt</TH>
                <TH right>Hållbarhetsområden</TH>
              </tr>
            </thead>
            <tbody>
              {arendeSida.map((r) => (
                <tr key={r.arendeid} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <TD mono>{r.arendeid}</TD>
                  <TD>{r.stodtyp}</TD>
                  <TD>{r.beslutandeOrg}</TD>
                  <TD title={r.utlysning}><span className="block max-w-[240px] truncate">{r.utlysning}</span></TD>
                  <TD>{r.bransch}</TD>
                  <TD right mono>{formatKrFull(r.beviljat)}</TD>
                  <TD right mono>{formatKrFull(r.utbetalt)}</TD>
                  <TD right mono>{antalOmraden(r)}</TD>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSida(Math.max(0, sidaClamped - 1))}
              disabled={sidaClamped === 0}
              className="px-3 py-1 text-xs font-medium rounded border disabled:opacity-40"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              ← Föregående
            </button>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Sida {sidaClamped + 1} av {antalSidor}
            </span>
            <button
              onClick={() => setSida(Math.min(antalSidor - 1, sidaClamped + 1))}
              disabled={sidaClamped >= antalSidor - 1}
              className="px-3 py-1 text-xs font-medium rounded border disabled:opacity-40"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              Nästa →
            </button>
          </div>
        </TableCard>
      </main>
    </>
  );
}
