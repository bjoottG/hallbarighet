'use client';

import { useMemo } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import FilterBar from '@/components/FilterBar';
import KPICard from '@/components/KPICard';
import { ChartCard } from '@/components/Cards';
import { useFilters } from '@/context/FilterContext';
import {
  kpiAntalArenden, kpiBeviljat, kpiUtbetalt,
  perOmrade, perDelomrade, aosPerOmrade, aouPerOmrade, aosFordelning,
  fordelningAntalOmraden, overlappPerOmrade, overlappMatris,
  formatNumber, formatKr,
} from '@/lib/dataUtils';
import {
  DIAGRAM_COLORS, OMRADE_FARG, AOS_FARG, AOU_FARG, AOS_SKALA, AOU_SKALA,
} from '@/types';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const TOOLTIP_STYLE = { fontSize: 11, borderRadius: 8 };

export default function DiagramPage() {
  const { filtered, isLoading } = useFilters();

  const omraden = useMemo(() => perOmrade(filtered), [filtered]);
  const delomraden = useMemo(() => perDelomrade(filtered).sort((a, b) => b.antal - a.antal), [filtered]);
  const aos = useMemo(() => aosPerOmrade(filtered), [filtered]);
  const aou = useMemo(() => aouPerOmrade(filtered), [filtered]);
  const fordelning = useMemo(() => fordelningAntalOmraden(filtered), [filtered]);
  const overlapp = useMemo(() => overlappPerOmrade(filtered), [filtered]);
  const matris = useMemo(() => overlappMatris(filtered), [filtered]);
  const aosTotal = useMemo(
    () => aosFordelning(filtered).map((d) => ({ name: AOS_SKALA[d.niva], value: d.antal, niva: d.niva })).filter((d) => d.value > 0),
    [filtered],
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

        {/* KPI-rad */}
        <div className="grid grid-cols-3 gap-4">
          <KPICard title="Antal ärenden" value={`${formatNumber(kpiAntalArenden(filtered))} st`} />
          <KPICard title="Beviljat belopp" value={formatKr(kpiBeviljat(filtered))} />
          <KPICard title="Utbetalt belopp" value={formatKr(kpiUtbetalt(filtered))} />
        </div>

        {/* Rad 1: Ärenden + beviljat per hållbarhetsområde */}
        <div className="grid grid-cols-2 gap-5">
          <ChartCard
            title="Antal ärenden per hållbarhetsområde"
            subtitle={`Obs! Staplarna överlappar: ett ärende som valt flera områden räknas i varje stapel. Staplarna summerar till ${formatNumber(omraden.reduce((s, d) => s + d.antal, 0))} områdesval — urvalet innehåller ${formatNumber(filtered.length)} ärenden.`}
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart layout="vertical" data={omraden} margin={{ left: 4, right: 50, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={220} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={0} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${formatNumber(Number(v))} st`, 'Ärenden']} />
                <Bar dataKey="antal" radius={[0, 3, 3, 0]} maxBarSize={22}>
                  {omraden.map((d) => <Cell key={d.id} fill={OMRADE_FARG[d.id]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Beviljat belopp per hållbarhetsområde"
            subtitle={`Obs! Staplarna överlappar: hela ärendets beviljade belopp räknas i varje valt område. Staplarna summerar till ${formatKr(omraden.reduce((s, d) => s + d.beviljat, 0))} — urvalets beviljade belopp är ${formatKr(kpiBeviljat(filtered))}.`}
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart layout="vertical" data={omraden} margin={{ left: 4, right: 70, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)} mnkr`} />
                <YAxis type="category" dataKey="name" width={220} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={0} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [formatKr(Number(v)), 'Beviljat']} />
                <Bar dataKey="beviljat" radius={[0, 3, 3, 0]} maxBarSize={22}>
                  {omraden.map((d) => <Cell key={d.id} fill={OMRADE_FARG[d.id]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Rad 1a: Överlapp mellan hållbarhetsområden */}
        <div className="grid grid-cols-2 gap-5">
          <ChartCard
            title="Överlapp: antal ärenden per hållbarhetsområde"
            subtitle="Varje stapel uppdelad i ärenden som enbart valt området respektive ärenden som även valt andra områden."
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart layout="vertical" data={overlapp} margin={{ left: 4, right: 50, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={200} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={0} />
                <Tooltip contentStyle={TOOLTIP_STYLE}
                  formatter={(v, n) => [`${formatNumber(Number(v))} st`, n === 'enbart' ? 'Enbart detta område' : 'Delar ärende med andra områden']} />
                <Legend formatter={(v) => (v === 'enbart' ? 'Enbart detta område' : 'Delar ärende med andra områden')} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="enbart" stackId="o" fill="#4A1B8B" maxBarSize={20} />
                <Bar dataKey="delat" stackId="o" fill="#C9C4D4" radius={[0, 3, 3, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Överlapp: beviljat belopp per hållbarhetsområde"
            subtitle="Beviljat belopp uppdelat i ärenden som enbart valt området respektive ärenden som även valt andra områden."
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart layout="vertical" data={overlapp} margin={{ left: 4, right: 70, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)} mnkr`} />
                <YAxis type="category" dataKey="name" width={200} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={0} />
                <Tooltip contentStyle={TOOLTIP_STYLE}
                  formatter={(v, n) => [formatKr(Number(v)), n === 'beviljatEnbart' ? 'Enbart detta område' : 'Delar ärende med andra områden']} />
                <Legend formatter={(v) => (v === 'beviljatEnbart' ? 'Enbart detta område' : 'Delar ärende med andra områden')} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="beviljatEnbart" stackId="b" fill="#00A896" maxBarSize={20} />
                <Bar dataKey="beviljatDelat" stackId="b" fill="#B7E1DC" radius={[0, 3, 3, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Rad 1a2: Överlappsmatris */}
        <ChartCard
          title="Överlappsmatris: ärenden med båda områdena valda"
          subtitle="Cellen visar antal ärenden som valt både radens och kolumnens hållbarhetsområde. Diagonalen visar samtliga ärenden som valt området."
        >
          {(() => {
            const maxOffDiag = Math.max(1, ...matris.flatMap((rad) =>
              matris.filter((k) => k.id !== rad.id).map((k) => rad.counts[k.id]),
            ));
            return (
              <div className="overflow-x-auto">
                <table className="text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left py-1.5 pr-3 font-semibold" style={{ color: 'var(--color-text-muted)' }}>Område</th>
                      {matris.map((k) => (
                        <th key={k.id} className="text-center py-1.5 px-1 font-semibold w-14" style={{ color: 'var(--color-text-muted)' }} title={k.name}>
                          {k.name.split('.')[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matris.map((rad) => (
                      <tr key={rad.id}>
                        <td className="py-1 pr-3 whitespace-nowrap" style={{ color: 'var(--color-text)' }}>{rad.name}</td>
                        {matris.map((kol) => {
                          const v = rad.counts[kol.id];
                          const diagonal = rad.id === kol.id;
                          const alpha = diagonal ? 0 : Math.min(0.9, (v / maxOffDiag) * 0.9);
                          return (
                            <td
                              key={kol.id}
                              className="text-center py-1.5 px-1 font-mono rounded"
                              title={`${rad.name} × ${kol.name}: ${formatNumber(v)} ärenden`}
                              style={{
                                background: diagonal ? 'var(--color-kpi-bg)' : `rgba(74, 27, 139, ${alpha})`,
                                color: !diagonal && alpha > 0.45 ? '#fff' : 'var(--color-text)',
                                fontWeight: diagonal ? 700 : 400,
                              }}
                            >
                              {formatNumber(v)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </ChartCard>

        {/* Rad 1b: Antal hållbarhetsområden per ärende */}
        <ChartCard
          title="Antal hållbarhetsområden per ärende (0–7)"
          subtitle="Hur många hållbarhetsområden (Nivå 1) ärendena valt i ansökan."
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={fordelning} margin={{ left: 4, right: 20, top: 0, bottom: 0 }}>
              <XAxis dataKey="antalOmr" tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
                label={{ value: 'Antal hållbarhetsområden', position: 'insideBottom', offset: -2, fontSize: 11, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE}
                formatter={(v) => [`${formatNumber(Number(v))} st`, 'Ärenden']}
                labelFormatter={(l) => `${l} hållbarhetsområden`} />
              <Bar dataKey="antal" fill={DIAGRAM_COLORS[0]} radius={[3, 3, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Rad 2: AOS-donut */}
        <div className="grid grid-cols-2 gap-5">
          <ChartCard title="AOS – Godkännas (bedömning), fördelning" subtitle="Alla bedömda områdesval i urvalet">
            <div className="flex items-center justify-center" style={{ height: 240 }}>
              <ResponsiveContainer width="55%" height={240}>
                <PieChart>
                  <Pie data={aosTotal} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} innerRadius={48}>
                    {aosTotal.map((d) => <Cell key={d.niva} fill={AOS_FARG[d.niva]} />)}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${formatNumber(Number(v))} st`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 text-sm">
                {aosTotal.map((d) => (
                  <div key={d.niva} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: AOS_FARG[d.niva] }} />
                    <span style={{ color: 'var(--color-text)' }}>{d.name}</span>
                    <span className="font-bold ml-1" style={{ color: 'var(--color-primary)' }}>{formatNumber(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Rad 3: AOS-bedömning per område (staplat) */}
        <ChartCard title="AOS – Godkännas (bedömning) per hållbarhetsområde" subtitle="Antal områdesval per bedömningsnivå">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={aos} margin={{ left: 4, right: 50, top: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" width={220} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={0} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, n) => [`${formatNumber(Number(v))} st`, AOS_SKALA[String(n).replace('n', '')]]} />
              <Legend formatter={(v) => AOS_SKALA[String(v).replace('n', '')]} wrapperStyle={{ fontSize: 11 }} />
              {(['n0', 'n1', 'n2', 'n3'] as const).map((k) => (
                <Bar key={k} dataKey={k} stackId="aos" fill={AOS_FARG[k.replace('n', '')]} maxBarSize={22} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Rad 4: Delområden */}
        <ChartCard title="Antal ärenden per delområde (Nivå 2)" subtitle="Delområden där sökande angett Bidrar till = Ja">
          <ResponsiveContainer width="100%" height={520}>
            <BarChart layout="vertical" data={delomraden} margin={{ left: 4, right: 50, top: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" width={280} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={0} />
              <Tooltip contentStyle={TOOLTIP_STYLE}
                formatter={(v) => [`${formatNumber(Number(v))} st`, 'Ärenden']}
                labelFormatter={(l) => {
                  const d = delomraden.find((x) => x.name === l);
                  return d ? `${d.name} (${d.omradeNamn})` : l;
                }} />
              <Bar dataKey="antal" radius={[0, 3, 3, 0]} maxBarSize={14}>
                {delomraden.map((d) => <Cell key={d.id} fill={OMRADE_FARG[d.omradeId]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Rad 5: AOU-utfall */}
        <div className="grid grid-cols-2 gap-5">
          <ChartCard title="Slutlig AOU – Bidragit till, per område" subtitle="Sökandes bedömning av måluppfyllelse">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={aou} margin={{ left: 4, right: 50, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={200} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={0} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, n) => [`${formatNumber(Number(v))} st`, AOU_SKALA[String(n).replace('b', '')]]} />
                <Legend formatter={(v) => AOU_SKALA[String(v).replace('b', '')]} wrapperStyle={{ fontSize: 10 }} />
                {(['b1', 'b2', 'b3'] as const).map((k) => (
                  <Bar key={k} dataKey={k} stackId="aou" fill={AOU_FARG[k.replace('b', '')]} maxBarSize={20} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </main>
    </>
  );
}
