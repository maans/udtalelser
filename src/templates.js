
export const DEFAULT_TEMPLATE = "Udtalelse vedrørende {{ELEV_FULDE_NAVN}}\n\n{{ELEV_FORNAVN}} {{ELEV_EFTERNAVN}} har været elev på Himmerlands Ungdomsskole i perioden fra {{PERIODE_FRA}} til {{PERIODE_TIL}} i {{ELEV_KLASSE}}.\n\nHimmerlands Ungdomsskole er en traditionsrig efterskole, som prioriterer fællesskabet og faglig fordybelse højt. Elevernes hverdag er præget af frie rammer og mange muligheder. Vi møder eleverne med tillid, positive forventninger og faglige udfordringer. I løbet af et efterskoleår på Himmerlands Ungdomsskole er oplevelserne mange og udfordringerne ligeså. Det gælder i hverdagens almindelige undervisning, som fordeler sig over boglige fag, fællesfag og profilfag. Det gælder også alle de dage, hvor hverdagen ændres til fordel for temauger, studieture mm. \n\n{{ELEV_UDVIKLING_AFSNIT}}\n\nSom en del af et efterskoleår på Himmerlands Ungdomsskole deltager eleverne ugentligt i fællessang og fællesgymnastik. Begge fag udgør en del af efterskolelivet, hvor eleverne oplever nye sider af sig selv, flytter grænser og oplever, at deres bidrag til fællesskabet har betydning. I løbet af året optræder eleverne med fælleskor og gymnastikopvisninger.\n\n{{SANG_GYM_AFSNIT}}\n\nPå en efterskole er der mange praktiske opgaver.\n\n{{PRAKTISK_AFSNIT}}\n\n{{ELEV_FORNAVN}} har på Himmerlands Ungdomsskole været en del af en kontaktgruppe på {{KONTAKTGRUPPE_ANTAL}} elever. I kontaktgruppen kender vi {{HAM_HENDE}} som {{KONTAKTGRUPPE_BESKRIVELSE}}.\n\nVi har været rigtig glade for at have {{ELEV_FORNAVN}} som elev på skolen og ønsker held og lykke fremover.\n\n{{KONTAKTLÆRER_1_NAVN}} & {{KONTAKTLÆRER_2_NAVN}}\n\nKontaktlærere\n\n{{FORSTANDER_NAVN}}\n\nForstander";

export const DEFAULT_SNIPPETS = {
  "sang": {
    "S1": {
      "title": "Meget aktiv deltagelse",
      "m": "{{FORNAVN}} har deltaget meget engageret i fællessang gennem hele året. {{HAN_HUN}} har bidraget positivt til fællesskabet og vist lyst til at udvikle sin sangstemme.",
      "k": "{{FORNAVN}} har deltaget meget engageret i fællessang gennem hele året. {{HAN_HUN}} har bidraget positivt til fællesskabet og vist lyst til at udvikle sin sangstemme."
    },
    "S2": {
      "title": "Stabil deltagelse",
      "m": "{{FORNAVN}} har deltaget stabilt i fællessang og har mødt undervisningen med en positiv indstilling. {{HAN_HUN}} har været en god del af fællesskabet.",
      "k": "{{FORNAVN}} har deltaget stabilt i fællessang og har mødt undervisningen med en positiv indstilling. {{HAN_HUN}} har været en god del af fællesskabet."
    },
    "S3": {
      "title": "Varierende deltagelse",
      "m": "{{FORNAVN}} har haft en varierende deltagelse i fællessang. {{HAN_HUN}} har dog i perioder vist engagement og vilje til at indgå i fællesskabet.",
      "k": "{{FORNAVN}} har haft en varierende deltagelse i fællessang. {{HAN_HUN}} har dog i perioder vist engagement og vilje til at indgå i fællesskabet."
    }
  },
  "gym": {
    "G1": {
      "title": "Meget engageret",
      "m": "{{FORNAVN}} har deltaget meget engageret i fællesgymnastik og har vist stor lyst til at udfordre sig selv. {{HAN_HUN}} har bidraget positivt til holdets fællesskab.",
      "k": "{{FORNAVN}} har deltaget meget engageret i fællesgymnastik og har vist stor lyst til at udfordre sig selv. {{HAN_HUN}} har bidraget positivt til holdets fællesskab."
    },
    "G2": {
      "title": "Stabil deltagelse",
      "m": "{{FORNAVN}} har deltaget stabilt i fællesgymnastik og har mødt undervisningen med en positiv indstilling.",
      "k": "{{FORNAVN}} har deltaget stabilt i fællesgymnastik og har mødt undervisningen med en positiv indstilling."
    },
    "G3": {
      "title": "Varierende deltagelse",
      "m": "{{FORNAVN}} har haft en varierende deltagelse i fællesgymnastik, men har i perioder vist vilje til at indgå i fællesskabet.",
      "k": "{{FORNAVN}} har haft en varierende deltagelse i fællesgymnastik, men har i perioder vist vilje til at indgå i fællesskabet."
    }
  },
  "roles": {
    "ELEVRAAD": "{{FORNAVN}} har været en del af elevrådet på Himmerlands Ungdomsskole og har bidraget konstruktivt til arbejdet.",
    "FANEBAERER": "{{FORNAVN}} har været udtaget som fanebærer og har løftet opgaven ansvarsfuldt og med overblik.",
    "REDSKAB": "{{FORNAVN}} har været en del af redskabsholdet og har vist ansvar og stabilitet i arbejdet med redskaber og opstillinger.",
    "DGI": "{{FORNAVN}} har været DGI-hjælper og har bidraget med initiativ og ansvar i foreningens arbejde."
  }
};

// Keys used in template overrides
export const TEMPLATE_KEYS = {
  TEMPLATE: "TEMPLATE",
  SNIPPETS: "SNIPPETS"
};

// UI text
export const LOCAL_SAVE_TEXT = "Tekst, du skriver i appen, gemmes automatisk lokalt på din computer og sendes ikke nogen steder, så du kan holde pause og fortsætte senere.";
