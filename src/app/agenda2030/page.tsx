'use client';

import { useMemo } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import FilterBar from '@/components/FilterBar';
import KPICard from '@/components/KPICard';
import { ChartCard, TableCard, TH, TD } from '@/components/Cards';
import { useFilters } from '@/context/FilterContext';
import {
  perAgendaMal, arendeAgendaMal, formatNumber, formatKr, formatPct,
} from '@/lib/dataUtils';
import {
  OMRADEN, OMRADE_FARG, AGENDA_MAL_NAMN, AGENDA_MAL_FARG, DELOMRADE_NAMN,
  AGENDA_MAL_AKTUELLA,
} from '@/types';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const TOOLTIP_STYLE = { fontSize: 11, borderRadius: 8 };

function MalBadge({ mal }: { mal: number }) {
  return (
    <span
      className="inline-flex items-center text-[11px] font-semibold text-white rounded px-1.5 py-0.5 whitespace-nowrap"
      style={{ background: AGENDA_MAL_FARG[mal] }}
      title={`Mål ${mal} – ${AGENDA_MAL_NAMN[mal]}`}
    >
      Mål {mal}
    </span>
  );
}

export default function Agenda2030Page() {
  const { filtered, isLoading } = useFilters();

  const malRader = useMemo(() => perAgendaMal(filtered), [filtered]);

  const kpis = useMemo(() => {
    const medMal = filtered.filter((r) => arendeAgendaMal(r).length > 0);
    const beviljatMedMal = medMal.reduce((s, r) => s + (r.beviljat || 0), 0);
    const vanligaste = [...malRader].sort((a, b) => b.antal - a.antal)[0];
    return {
      antalMal: malRader.filter((m) => m.antal > 0).length,
      medMal: medMal.length,
      andelMedMal: filtered.length === 0 ? 0 : (medMal.length / filtered.length) * 100,
      beviljatMedMal,
      vanligaste,
    };
  }, [filtered, malRader]);

  const chartData = useMemo(
    () => malRader.map((m) => ({ ...m, name: `Mål ${m.mal}` })),
    [malRader],
  );

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

        {/* Relationer: hållbarhetsområden → delområden → Agenda 2030-mål */}
        <section>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            Hållbarhetsområden och Agenda 2030
          </h2>
          <p className="text-sm mb-4 max-w-[820px]" style={{ color: 'var(--color-text-muted)' }}>
            Varje ärende kan bidra till ett eller flera hållbarhetsområden (Nivå 1), som i sin tur består av
            delområden (Nivå 2). Varje delområde är kopplat till ett eller flera av de 17 globala målen i
            Agenda 2030. Ett ärende räknas till ett mål när sökande angett att ärendet bidrar till ett
            delområde som är kopplat till målet.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {OMRADEN.map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-xl shadow-sm border p-4"
                style={{ borderColor: 'var(--color-border)', borderTop: `3px solid ${OMRADE_FARG[o.id]}` }}
              >
                <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--color-text)' }}>
                  {o.nummer}. {o.namn}
                </h3>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {o.beskrivning}
                </p>
                <div className="flex flex-col gap-1.5">
                  {o.delomraden.map((d) => (
                    <div key={d.id} className="flex items-center justify-between gap-3 text-xs">
                      <span style={{ color: 'var(--color-text)' }} title={d.beskrivning}>{d.namn}</span>
                      <span className="flex gap-1 flex-shrink-0">
                        {d.agenda2030.map((m) => <MalBadge key={m} mal={m} />)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Omvända relationer: Agenda 2030-mål → hållbarhetsområden → delområden */}
        <section>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            Från Agenda 2030-mål till hållbarhetsområden
          </h2>
          <p className="text-sm mb-4 max-w-[820px]" style={{ color: 'var(--color-text-muted)' }}>
            Samma koppling sedd från målens håll: för varje globalt mål visas vilka hållbarhetsområden
            och delområden som hör till målet.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {AGENDA_MAL_AKTUELLA.map((mal) => {
              const omradenForMal = OMRADEN
                .map((o) => ({
                  omrade: o,
                  delomraden: o.delomraden.filter((d) => d.agenda2030.includes(mal)),
                }))
                .filter((g) => g.delomraden.length > 0);
              const antalDelomraden = omradenForMal.reduce((s, g) => s + g.delomraden.length, 0);
              return (
                <div
                  key={mal}
                  className="bg-white rounded-xl shadow-sm border p-4"
                  style={{ borderColor: 'var(--color-border)', borderTop: `3px solid ${AGENDA_MAL_FARG[mal]}` }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MalBadge mal={mal} />
                    <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                      {AGENDA_MAL_NAMN[mal]}
                    </h3>
                  </div>
                  <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
                    {omradenForMal.length} {omradenForMal.length === 1 ? 'hållbarhetsområde' : 'hållbarhetsområden'},{' '}
                    {antalDelomraden} {antalDelomraden === 1 ? 'delområde' : 'delområden'}
                  </p>
                  <div className="flex flex-col gap-2">
                    {omradenForMal.map(({ omrade, delomraden }) => (
                      <div key={omrade.id}>
                        <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: OMRADE_FARG[omrade.id] }} />
                          {omrade.nummer}. {omrade.namn}
                        </div>
                        <ul className="mt-0.5 ml-3.5 flex flex-col gap-0.5">
                          {delomraden.map((d) => (
                            <li key={d.id} className="text-xs" style={{ color: 'var(--color-text-muted)' }} title={d.beskrivning}>
                              {d.namn}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* KPI-rad */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard
            title="Globala mål som berörs"
            value={`${formatNumber(kpis.antalMal)} av 17`}
            subtitle="Mål med minst ett kopplat ärende i urvalet"
          />
          <KPICard
            title="Ärenden med Agenda 2030-koppling"
            value={`${formatNumber(kpis.medMal)} st`}
            subtitle={`${formatPct(kpis.andelMedMal)} av ärendena i urvalet`}
          />
          <KPICard
            title="Beviljat med målkoppling"
            value={formatKr(kpis.beviljatMedMal)}
            subtitle="Beviljat belopp för ärenden kopplade till minst ett mål"
          />
          <KPICard
            title="Vanligaste målet"
            value={kpis.vanligaste && kpis.vanligaste.antal > 0 ? `Mål ${kpis.vanligaste.mal}` : '–'}
            subtitle={kpis.vanligaste && kpis.vanligaste.antal > 0
              ? `${AGENDA_MAL_NAMN[kpis.vanligaste.mal]} (${formatNumber(kpis.vanligaste.antal)} ärenden)`
              : 'Inga ärenden i urvalet'}
          />
        </div>

        {/* Diagram: ärenden + beviljat per mål */}
        <div className="grid grid-cols-2 gap-5">
          <ChartCard title="Antal ärenden per Agenda 2030-mål" subtitle="Ett ärende kan bidra till flera mål">
            <ResponsiveContainer width="100%" height={380}>
              <BarChart layout="vertical" data={chartData} margin={{ left: 4, right: 50, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={0} />
                <Tooltip contentStyle={TOOLTIP_STYLE}
                  formatter={(v) => [`${formatNumber(Number(v))} st`, 'Ärenden']}
                  labelFormatter={(l) => {
                    const m = Number(String(l).replace('Mål ', ''));
                    return `Mål ${m} – ${AGENDA_MAL_NAMN[m]}`;
                  }} />
                <Bar dataKey="antal" radius={[0, 3, 3, 0]} maxBarSize={16}>
                  {chartData.map((d) => <Cell key={d.mal} fill={AGENDA_MAL_FARG[d.mal]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Beviljat belopp per Agenda 2030-mål" subtitle="Summa beviljat för ärenden kopplade till målet">
            <ResponsiveContainer width="100%" height={380}>
              <BarChart layout="vertical" data={chartData} margin={{ left: 4, right: 70, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)} mnkr`} />
                <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={0} />
                <Tooltip contentStyle={TOOLTIP_STYLE}
                  formatter={(v) => [formatKr(Number(v)), 'Beviljat']}
                  labelFormatter={(l) => {
                    const m = Number(String(l).replace('Mål ', ''));
                    return `Mål ${m} – ${AGENDA_MAL_NAMN[m]}`;
                  }} />
                <Bar dataKey="beviljat" radius={[0, 3, 3, 0]} maxBarSize={16}>
                  {chartData.map((d) => <Cell key={d.mal} fill={AGENDA_MAL_FARG[d.mal]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Tabell: per mål */}
        <TableCard
          title="Agenda 2030-mål i urvalet"
          subtitle="Ärenden räknas till ett mål via delområden där sökande angett Bidrar till = Ja. Ett ärende kan bidra till flera mål."
          maxHeight={700}
        >
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                <TH>Mål</TH>
                <TH>Namn</TH>
                <TH>Kopplade delområden</TH>
                <TH right>Ärenden</TH>
                <TH right>Andel</TH>
                <TH right>Beviljat</TH>
              </tr>
            </thead>
            <tbody>
              {malRader.map((r) => (
                <tr key={r.mal} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <TD><MalBadge mal={r.mal} /></TD>
                  <TD>{AGENDA_MAL_NAMN[r.mal]}</TD>
                  <TD>
                    <span className="block max-w-[380px]" style={{ color: 'var(--color-text-muted)' }}>
                      {r.delomraden.map((id) => DELOMRADE_NAMN[id]).join(', ')}
                    </span>
                  </TD>
                  <TD right mono>{formatNumber(r.antal)}</TD>
                  <TD right mono>{formatPct(r.andel)}</TD>
                  <TD right mono>{formatKr(r.beviljat)}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </main>
    </>
  );
}
