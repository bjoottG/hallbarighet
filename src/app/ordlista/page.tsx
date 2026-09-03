'use client';

import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { OMRADEN } from '@/types';

interface Term {
  term: string;
  category?: string;
  definition: string;
}

const TERMS: Term[] = [
  {
    term: 'Ärende',
    category: 'Grunddata',
    definition: 'En ansökan om stöd som handläggs av Tillväxtverket. Varje rad i datan är ett ärende, identifierat med ett unikt ärende-id.',
  },
  {
    term: 'Ärende-id',
    category: 'Grunddata',
    definition: 'Unikt identifikationsnummer för ett ärende i Tillväxtverkets ärendehantering.',
  },
  {
    term: 'Stödtyp',
    category: 'Grunddata',
    definition: 'Typ av stöd som ärendet avser. PROJ = projektstöd.',
  },
  {
    term: 'Utlysning',
    category: 'Grunddata',
    definition: 'Den utlysning (ansökningsomgång) som ärendet lämnats in inom. En utlysning riktar sig mot ett visst tema eller en viss målgrupp.',
  },
  {
    term: 'Beviljat belopp',
    category: 'Finansiering',
    definition: 'Det belopp i kronor som beviljats för ärendet.',
  },
  {
    term: 'Utbetalt belopp',
    category: 'Finansiering',
    definition: 'Det belopp i kronor som hittills betalats ut för ärendet. Utbetalt belopp kan vara lägre än beviljat, t.ex. för pågående ärenden.',
  },
  {
    term: 'Bransch',
    category: 'Grunddata',
    definition: 'Den sökande aktörens bransch enligt SNI:s avdelningsindelning, t.ex. C Tillverkning eller F Byggverksamhet.',
  },
  {
    term: 'Hållbarhetsområde (Nivå 1)',
    category: 'Hållbarhet',
    definition: 'Ett av sju övergripande hållbarhetsområden som en sökande kan ange att ärendet bidrar till: Klimat och miljö, Cirkularitet och effektivt resursnyttjande, Hållbar konsumtion och marknad, Social inkludering och jämlikhet, Hälsa och välbefinnande, Ekonomisk hållbarhet samt Motverka hunger och fattigdom. Ett ärende kan välja flera områden.',
  },
  {
    term: 'Delområde (Nivå 2)',
    category: 'Hållbarhet',
    definition: 'En mer specifik inriktning inom ett hållbarhetsområde, t.ex. Minska växthusgasutsläpp inom Klimat och miljö. Det finns 20 delområden fördelade på de sju hållbarhetsområdena. För varje delområde anger sökande om ärendet bidrar (Ja/Nej).',
  },
  {
    term: 'AOS – Ansökan om stöd',
    category: 'Bedömning',
    definition: 'Uppgifter som lämnas och bedöms i samband med ansökan om stöd. I ansökan anger sökande vilka hållbarhetsområden och delområden ärendet bidrar till.',
  },
  {
    term: 'AOS – Bidrar till (sökande)',
    category: 'Bedömning',
    definition: 'Sökandes egen uppgift i ansökan om att ärendet bidrar till ett visst delområde (Ja/Nej). Lämnas bara för hållbarhetsområden som valts på Nivå 1.',
  },
  {
    term: 'AOS – Godkännas (bedömning)',
    category: 'Bedömning',
    definition: 'Handläggarens bedömning av ärendets bidrag till ett valt hållbarhetsområde, på skalan 0 Nej, 1 Hänsyn, 2 Positiv påverkan, 3 Transformativt. Vid bedömningen 0 följs området inte upp vidare.',
  },
  {
    term: 'Bedömningsskala AOS (0–3)',
    category: 'Bedömning',
    definition: '0 Nej = området godkänns inte som hållbarhetsinsats. 1 Hänsyn = insatsen tar hänsyn till området. 2 Positiv påverkan = insatsen har en positiv påverkan på området. 3 Transformativt = insatsen bedöms vara transformativ inom området.',
  },
  {
    term: 'AOU – Ansökan om utbetalning',
    category: 'Bedömning',
    definition: 'Uppgifter som lämnas och bedöms i samband med ansökan om utbetalning, där ärendets faktiska resultat följs upp mot det som angavs i ansökan om stöd.',
  },
  {
    term: 'Slutlig AOU – Bidragit till (sökande)',
    category: 'Bedömning',
    definition: 'Sökandes slutliga bedömning av om ärendet bidragit till hållbarhetsområdet: 1 Har till största del uppnåtts, 2 Bara vissa delar har uppnåtts, 3 Har ej uppnåtts.',
  },
  {
    term: 'Slutlig AOU – Godkännas (bedömning)',
    category: 'Bedömning',
    definition: 'Handläggarens slutliga bedömning (Ja/Nej) av om ärendets hållbarhetsarbete inom området kan godkännas vid ansökan om utbetalning.',
  },
  {
    term: 'Agenda 2030',
    category: 'Agenda 2030',
    definition: 'FN:s globala handlingsplan för hållbar utveckling med 17 globala mål som antogs 2015. Varje delområde i dashboarden är kopplat till ett eller flera av de globala målen — se fliken Agenda 2030.',
  },
  {
    term: 'Globala målen (SDG)',
    category: 'Agenda 2030',
    definition: 'De 17 målen i Agenda 2030 (Sustainable Development Goals), t.ex. Mål 7 Hållbar energi för alla och Mål 13 Bekämpa klimatförändringarna. Ett ärende räknas till ett mål när det bidrar till ett delområde som är kopplat till målet.',
  },
  {
    term: 'SNI – Svensk näringsgrensindelning',
    category: 'Grunddata',
    definition: 'Standard för att klassificera företag och arbetsställen efter verksamhet. Branschkolumnen i dashboarden använder SNI:s avdelningsbokstäver (A–U).',
  },
  {
    term: 'Tillväxtverket',
    category: 'Organisation',
    definition: 'Sveriges nationella myndighet för tillväxt och regional utveckling. Handlägger de stöd och utlysningar som visas i dashboarden.',
  },
  // Definitioner av de sju hållbarhetsområdena
  ...OMRADEN.map((o) => ({
    term: `${o.nummer}. ${o.namn}`,
    category: 'Hållbarhetsområde',
    definition: `${o.beskrivning} Delområden: ${o.delomraden.map((d) => d.namn).join(', ')}.`,
  })),
];

const sorted = [...TERMS].sort((a, b) => a.term.localeCompare(b.term, 'sv'));

const CATEGORIES = [...new Set(TERMS.map(t => t.category).filter(Boolean))].sort() as string[];

const CATEGORY_COLORS: Record<string, string> = {
  'Grunddata':          '#2196A8',
  'Finansiering':       '#00A896',
  'Hållbarhet':         '#4A1B8B',
  'Hållbarhetsområde':  '#7B4FBC',
  'Bedömning':          '#9C27B0',
  'Agenda 2030':        '#E040FB',
  'Organisation':       '#00BCD4',
};

export default function OrdlistaPage() {
  return (
    <>
      <Header />
      <Navigation />

      <main className="max-w-[900px] mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>Ordlista</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Förklaringar av begrepp och termer som används i dashboarden, sorterade i bokstavsordning.
          </p>
        </div>

        {/* Kategorilegende */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <span
              key={cat}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: `${CATEGORY_COLORS[cat] ?? '#888'}22`,
                color: CATEGORY_COLORS[cat] ?? '#888',
                border: `1px solid ${CATEGORY_COLORS[cat] ?? '#888'}44`,
              }}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Termslista */}
        <div className="flex flex-col">
          {sorted.map((item, i) => (
            <div
              key={item.term}
              className="py-4 flex gap-6"
              style={{
                borderTop: i === 0 ? undefined : '1px solid var(--color-border)',
              }}
            >
              <div className="w-64 flex-shrink-0">
                <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                  {item.term}
                </p>
                {item.category && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-medium mt-1 inline-block"
                    style={{
                      background: `${CATEGORY_COLORS[item.category] ?? '#888'}18`,
                      color: CATEGORY_COLORS[item.category] ?? '#888',
                    }}
                  >
                    {item.category}
                  </span>
                )}
              </div>
              <p className="text-sm flex-1 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {item.definition}
              </p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
