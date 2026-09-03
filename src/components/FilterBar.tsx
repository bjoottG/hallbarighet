'use client';

import { useFilters } from '@/context/FilterContext';
import MultiSelectDropdown from './MultiSelectDropdown';
import {
  OMRADEN, OMRADE_NAMN, DELOMRADE_NAMN, DELOMRADE_OMRADE,
  AOS_SKALA, AOS_BESKRIVNING, AOU_SKALA,
  AGENDA_MAL_NAMN, AGENDA_MAL_AKTUELLA,
} from '@/types';

const OMRADE_OPTIONS = OMRADEN.map((o) => o.id);
const DELOMRADE_OPTIONS = OMRADEN.flatMap((o) => o.delomraden.map((d) => d.id));
const AOS_OPTIONS = ['0', '1', '2', '3'];
const AOU_OPTIONS = ['1', '2', '3'];
const AOU_GODKAND_OPTIONS = ['Ja', 'Nej'];
const AGENDA_OPTIONS = AGENDA_MAL_AKTUELLA.map(String);

export default function FilterBar({ alignLeft }: { alignLeft?: boolean }) {
  const { filters, setFilter, resetFilters, allUtlysningar, allBranscher } = useFilters();

  const hasFilters = Object.values(filters).some((v) => v.length > 0);

  return (
    <div className="border-b" style={{ borderColor: 'var(--color-border)', background: '#EEEAF6' }}>
      <div className={`${alignLeft ? '' : 'max-w-[1200px] mx-auto'} px-6 py-4`}>
        <div className="grid grid-cols-4 gap-3">
          <MultiSelectDropdown
            label="Utlysning"
            options={allUtlysningar}
            selected={filters.utlysning}
            onChange={(v) => setFilter('utlysning', v)}
          />
          <MultiSelectDropdown
            label="Bransch"
            options={allBranscher}
            selected={filters.bransch}
            onChange={(v) => setFilter('bransch', v)}
          />
          <MultiSelectDropdown
            label="Hållbarhetsområde (Nivå 1)"
            options={OMRADE_OPTIONS}
            selected={filters.omrade}
            onChange={(v) => setFilter('omrade', v)}
            getLabel={(v) => OMRADE_NAMN[v] ?? v}
          />
          <MultiSelectDropdown
            label="Delområde (Nivå 2)"
            options={DELOMRADE_OPTIONS}
            selected={filters.delomrade}
            onChange={(v) => setFilter('delomrade', v)}
            getLabel={(v) => DELOMRADE_NAMN[v] ?? v}
            getDescription={(v) => OMRADE_NAMN[DELOMRADE_OMRADE[v]] ?? ''}
          />
          <MultiSelectDropdown
            label="AOS – Godkännas (bedömning)"
            options={AOS_OPTIONS}
            selected={filters.aosBedomning}
            onChange={(v) => setFilter('aosBedomning', v)}
            getLabel={(v) => AOS_SKALA[v] ?? v}
            getDescription={(v) => AOS_BESKRIVNING[v] ?? ''}
          />
          <MultiSelectDropdown
            label="Slutlig AOU – Bidragit till"
            options={AOU_OPTIONS}
            selected={filters.aouBidragit}
            onChange={(v) => setFilter('aouBidragit', v)}
            getLabel={(v) => AOU_SKALA[v] ?? v}
          />
          <MultiSelectDropdown
            label="Slutlig AOU – Godkänd"
            options={AOU_GODKAND_OPTIONS}
            selected={filters.aouGodkannas}
            onChange={(v) => setFilter('aouGodkannas', v)}
          />
          <MultiSelectDropdown
            label="Agenda 2030-mål"
            options={AGENDA_OPTIONS}
            selected={filters.agendaMal}
            onChange={(v) => setFilter('agendaMal', v)}
            getLabel={(v) => `Mål ${v} – ${AGENDA_MAL_NAMN[Number(v)] ?? ''}`}
          />
          <div className="flex items-end col-start-4">
            <button
              onClick={resetFilters}
              className="w-full px-4 py-[7px] text-sm font-medium rounded-lg border transition-colors"
              style={{
                color: hasFilters ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderColor: hasFilters ? 'var(--color-primary)' : 'var(--color-border)',
                background: 'white',
              }}
            >
              Återställ filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
