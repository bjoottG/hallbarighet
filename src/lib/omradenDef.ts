// GENERERAD FIL — kör `npm run convert-data` för att uppdatera. Redigera inte för hand.
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

export const OMRADEN: OmradeDef[] = [
  {
    "id": "climate",
    "nummer": 1,
    "namn": "Klimat och miljö",
    "beskrivning": "Arbeta för att minska klimat- och miljöpåverkan genom att effektivisera energi- och transportlösningar, öka förnybar energi samt förebygga föroreningar och skydda biologisk mångfald.",
    "delomraden": [
      {
        "id": "reduce-emissions",
        "namn": "Minska växthusgasutsläpp",
        "beskrivning": "Prioritera lokala inköp, ökad bränsleeffektivitet, minimera utsläpp från transporter.",
        "agenda2030": [
          7,
          13
        ]
      },
      {
        "id": "protect-nature",
        "namn": "Skydda naturen",
        "beskrivning": "Bevara och återställa biologisk mångfald, skydda marina ekosystem, motverka föroreningar i mark, luft och vatten.",
        "agenda2030": [
          6,
          14,
          15
        ]
      },
      {
        "id": "energy-efficiency",
        "namn": "Energieffektivisering och förnybar energi",
        "beskrivning": "Välj fossilfria och förnybara lösningar, arbeta för minskad energianvändning. Öka mängden förnybar energi.",
        "agenda2030": [
          7
        ]
      },
      {
        "id": "climate-adaptation",
        "namn": "Klimatanpassning",
        "beskrivning": "Utveckla robusta system och lösningar för att hantera effekter av ett förändrat klimat.",
        "agenda2030": [
          11,
          13
        ]
      }
    ]
  },
  {
    "id": "circularity",
    "nummer": 2,
    "namn": "Cirkularitet och effektivt resursnyttjande",
    "beskrivning": "Främja cirkulär och resurseffektiv utveckling genom minskad materialanvändning, innovativa hållbara material, återanvändningsbar design samt minskat avfall och vattenhushållning.",
    "delomraden": [
      {
        "id": "material-use",
        "namn": "Materialanvändning",
        "beskrivning": "Minska materialanvändning, stimulera teknikutveckling och innovation inom material. Utveckla nya material med minskad miljöpåverkan/energiintensitet. Fasa ut engångsartiklar.",
        "agenda2030": [
          9,
          12
        ]
      },
      {
        "id": "product-service-development",
        "namn": "Utveckling av produkter och tjänster",
        "beskrivning": "Designa produkter för återanvändning och återvinning, utveckla affärsmodeller för delningsekonomi och minskad förbrukning.",
        "agenda2030": [
          9,
          12
        ]
      },
      {
        "id": "efficient-resource-use",
        "namn": "Effektivt resursnyttjande",
        "beskrivning": "Reducera svinn och avfall. Utveckla cirkulära lösningar och hushållande med vatten.",
        "agenda2030": [
          6,
          8,
          12
        ]
      }
    ]
  },
  {
    "id": "consumption",
    "nummer": 3,
    "namn": "Hållbar konsumtion och marknad",
    "beskrivning": "Stärk hållbar konsumtion genom att informera kunder, främja innovation via strategiska inköp och välja certifierade, ekologiska produkter.",
    "delomraden": [
      {
        "id": "customer-awareness",
        "namn": "Medvetandegöra kunder och konsumenter",
        "beskrivning": "Höj kunskapen hos kunder och konsumenter om hållbara, produkter, tjänster och val.",
        "agenda2030": [
          12
        ]
      },
      {
        "id": "strategic-procurement",
        "namn": "Verka för strategiska inköp",
        "beskrivning": "Genomför inköp och upphandling som stärker efterfrågan på hållbara produkter och tjänster samt som driver marknaden mot resurseffektivitet och innovation.",
        "agenda2030": [
          12
        ]
      }
    ]
  },
  {
    "id": "inclusion",
    "nummer": 4,
    "namn": "Social inkludering och jämlikhet",
    "beskrivning": "Inkludera utsatta grupper och främja en arbetsplats där mångfald, jämställdhet och kontinuerlig kompetensutveckling är en självklarhet. Främja tillgängliga och inkluderande samhällen.",
    "delomraden": [
      {
        "id": "recruitment-education",
        "namn": "Rekrytering och utbildning",
        "beskrivning": "Anställ personer som står långt ifrån arbetsmarknaden. Säkerställ lärlingsmöjligheter och regelbunden kompetensutveckling för alla.",
        "agenda2030": [
          4,
          8
        ]
      },
      {
        "id": "accessible-inclusive-communities",
        "namn": "Tillgängliga och inkluderande samhällen",
        "beskrivning": "Skapa trygga, inkluderande och tillgängliga miljöer för alla, med särskilt fokus på grupper som riskerar social eller ekonomisk marginalisering. Utveckla mötesplatser, bostäder och mobilitetslösningar som stärker social sammanhållning och gör det möjligt för olika grupper att delta i samhällslivet på lika villkor.",
        "agenda2030": [
          10,
          11
        ]
      },
      {
        "id": "promote-diversity-inclusion",
        "namn": "Främja mångfald och inkludering",
        "beskrivning": "Säkerställ lika möjligheter för alla medarbetare och deltagare. Arbeta aktivt för jämställdhet, mångfald och mot diskriminering.",
        "agenda2030": [
          5,
          10
        ]
      }
    ]
  },
  {
    "id": "health",
    "nummer": 5,
    "namn": "Hälsa och välbefinnande",
    "beskrivning": "Främja hälsa genom insatser för bättre matvanor och fysisk aktivitet samt skapa en trygg arbetsmiljö med säkra villkor. Innovation och utveckling av produkter och tjänster som stärker välbefinnandet i samhället.",
    "delomraden": [
      {
        "id": "healthy-habits",
        "namn": "Främja hälsosamma matvanor och fysisk aktivitet",
        "beskrivning": "Förhindra livsstilssjukdomar, verka för god fysisk och psykisk hälsa hos personal och kunder.",
        "agenda2030": [
          3
        ]
      },
      {
        "id": "research-development",
        "namn": "Forskning och utveckling",
        "beskrivning": "Innovation och utveckling av produkter, tjänster och lösningar som främjar fysisk och psykisk hälsa, förebygger sjukdomar och stärker välbefinnandet i samhället.",
        "agenda2030": [
          3
        ]
      },
      {
        "id": "work-environment",
        "namn": "Arbetsmiljö",
        "beskrivning": "Trygg sysselsättning och anställningsförhållanden (säkerhet, hälsa, trygghet). Förbättra hantering av farliga kemikalier, arbeta systematiskt med arbetsmiljö.",
        "agenda2030": [
          8
        ]
      }
    ]
  },
  {
    "id": "economy",
    "nummer": 6,
    "namn": "Ekonomisk hållbarhet",
    "beskrivning": "Utveckla hållbara och långsiktiga värdekedjor genom leverantörsanalyser och motverkande av korruption och tvångsarbete, samt utveckla samarbeten för hållbar utveckling. Utveckla innovations- och företagsfrämjande miljöer.",
    "delomraden": [
      {
        "id": "value-chains",
        "namn": "Värdekedjor",
        "beskrivning": "Utveckla hållbara och motståndskraftiga värdekedjor för minskad sårbarhet och ökad långsiktig ekonomisk stabilitet. Motverka korruption, ekonomisk brottslighet samt barn- och tvångsarbete.",
        "agenda2030": [
          8,
          16
        ]
      },
      {
        "id": "industry-transformation",
        "namn": "Industri och samhällsomvandling",
        "beskrivning": "Utveckla innovations- och företagsfrämjande miljöer genom forskning, samverkan eller fysisk eller digital infrastruktur, som främjar social och miljömässig industriell utveckling.",
        "agenda2030": [
          9
        ]
      },
      {
        "id": "partnerships-cooperation",
        "namn": "Partnerskap och samarbeten",
        "beskrivning": "Ingå samarbeten för att stödja hållbar ekonomisk utveckling. Samverka med andra företag och aktörer för att stärka hållbar ekonomisk stabilitet och omställning i både Sverige och i andra länder.",
        "agenda2030": [
          8,
          17
        ]
      }
    ]
  },
  {
    "id": "poverty",
    "nummer": 7,
    "namn": "Motverka hunger och fattigdom",
    "beskrivning": "Motverka hunger och fattigdom i Sverige och internationellt. Främja utbildning och utveckling i utvecklingsländer.",
    "delomraden": [
      {
        "id": "counter-hunger",
        "namn": "Motverka hunger",
        "beskrivning": "Säkra tillgång till näringsrik mat för alla och främja ekonomisk stabilitet för småskaliga producenter.",
        "agenda2030": [
          2
        ]
      },
      {
        "id": "counter-poverty",
        "namn": "Motverka fattigdom",
        "beskrivning": "Utveckla industri, teknik eller företagande i utvecklingsländer. Inför nya arbetssätt eller utbildningsinsatser.",
        "agenda2030": [
          1,
          17
        ]
      }
    ]
  }
];
