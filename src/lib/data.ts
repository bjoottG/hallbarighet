import type { Arende } from '@/types';

let cachedData: Arende[] | null = null;

export async function getData(): Promise<Arende[]> {
  if (cachedData) return cachedData;

  const res = await fetch('/data/rawdata.json');
  if (!res.ok) throw new Error('Kunde inte läsa rawdata.json');

  const json = await res.json();
  cachedData = json as Arende[];
  return cachedData;
}
