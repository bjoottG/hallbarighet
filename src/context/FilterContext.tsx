'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Arende, FilterState } from '@/types';
import { FILTER_DEFAULTS, OMRADEN, DELOMRADE_OMRADE } from '@/types';
import { arendeAgendaMal } from '@/lib/dataUtils';

interface FilterContextValue {
  data: Arende[];
  filtered: Arende[];
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  isLoading: boolean;
  error: string | null;
  allUtlysningar: string[];
  allBranscher: string[];
  allStodtyper: string[];
  allBeslutandeOrg: string[];
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Arende[]>([]);
  const [filters, setFilters] = useState<FilterState>(FILTER_DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/rawdata.json')
      .then((r) => { if (!r.ok) throw new Error('Kunde inte hämta rawdata.json'); return r.json(); })
      .then((json: Arende[]) => {
        setData(json.filter((r) => r.arendeid != null));
        setIsLoading(false);
      })
      .catch((e: Error) => { setError(e.message); setIsLoading(false); });
  }, []);

  const setFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => { setFilters(FILTER_DEFAULTS); }, []);

  const filtered = React.useMemo(() => {
    return data.filter((row) => {
      if (filters.stodtyp.length > 0 && !filters.stodtyp.includes(row.stodtyp)) return false;
      if (filters.beslutandeOrg.length > 0 && !filters.beslutandeOrg.includes(row.beslutandeOrg)) return false;
      if (filters.utlysning.length > 0 && !filters.utlysning.includes(row.utlysning)) return false;
      if (filters.bransch.length > 0 && !filters.bransch.includes(row.bransch)) return false;

      // Hållbarhetsområde: ärendet har valt minst ett av de valda områdena
      if (filters.omrade.length > 0 &&
          !filters.omrade.some((id) => row.omraden[id]?.valt)) return false;

      // Delområde: sökande har angett Bidrar till = Ja för minst ett valt delområde
      if (filters.delomrade.length > 0 &&
          !filters.delomrade.some((subId) => {
            const omradeId = DELOMRADE_OMRADE[subId];
            return row.omraden[omradeId]?.delomraden[subId] === 'Ja';
          })) return false;

      // AOS-bedömning: minst ett områdesval har någon av de valda nivåerna.
      // Om områdesfilter är satt begränsas kontrollen till de områdena.
      if (filters.aosBedomning.length > 0) {
        const ids = filters.omrade.length > 0 ? filters.omrade : OMRADEN.map((o) => o.id);
        if (!ids.some((id) => {
          const v = row.omraden[id]?.aosGodkannas;
          return v != null && filters.aosBedomning.includes(String(v));
        })) return false;
      }

      // Slutlig AOU – Bidragit till (sökande)
      if (filters.aouBidragit.length > 0) {
        const ids = filters.omrade.length > 0 ? filters.omrade : OMRADEN.map((o) => o.id);
        if (!ids.some((id) => {
          const v = row.omraden[id]?.aouBidragit;
          return v != null && filters.aouBidragit.includes(String(v));
        })) return false;
      }

      // Slutlig AOU – Godkännas (bedömning)
      if (filters.aouGodkannas.length > 0) {
        const ids = filters.omrade.length > 0 ? filters.omrade : OMRADEN.map((o) => o.id);
        if (!ids.some((id) => {
          const v = row.omraden[id]?.aouGodkannas;
          return v != null && filters.aouGodkannas.includes(v);
        })) return false;
      }

      // Agenda 2030-mål (via delområden med Bidrar till = Ja)
      if (filters.agendaMal.length > 0) {
        const mal = arendeAgendaMal(row);
        if (!filters.agendaMal.some((m) => mal.includes(Number(m)))) return false;
      }

      return true;
    });
  }, [data, filters]);

  const allUtlysningar = React.useMemo(
    () => Array.from(new Set(data.map((r) => r.utlysning))).sort((a, b) => a.localeCompare(b, 'sv')),
    [data],
  );
  const allBranscher = React.useMemo(
    () => Array.from(new Set(data.map((r) => r.bransch))).sort((a, b) => a.localeCompare(b, 'sv')),
    [data],
  );
  const allStodtyper = React.useMemo(
    () => Array.from(new Set(data.map((r) => r.stodtyp))).sort((a, b) => a.localeCompare(b, 'sv')),
    [data],
  );
  const allBeslutandeOrg = React.useMemo(
    () => Array.from(new Set(data.map((r) => r.beslutandeOrg))).sort((a, b) => a.localeCompare(b, 'sv')),
    [data],
  );

  return (
    <FilterContext.Provider value={{ data, filtered, filters, setFilter, resetFilters, isLoading, error, allUtlysningar, allBranscher, allStodtyper, allBeslutandeOrg }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters(): FilterContextValue {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters måste användas inuti FilterProvider');
  return ctx;
}
