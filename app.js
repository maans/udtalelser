/* Elevudtalelser – statisk GitHub Pages app (ingen libs)
   localStorage prefix: udt_
*/
(() => {
  'use strict';

  const LS_PREFIX = 'udt_';
  const KEYS = {
    settings: LS_PREFIX + 'settings',
    students:  LS_PREFIX + 'students',
    templates: LS_PREFIX + 'templates',
    marksSang: LS_PREFIX + 'marks_sang',
    marksGym:  LS_PREFIX + 'marks_gym',
    marksElev: LS_PREFIX + 'marks_elevraad',
    textPrefix: LS_PREFIX + 'text_' // + unilogin
  };

  const TEACHER_ALIAS_MAP = {
  "ab": "Andreas Bech Pedersen",
  "avp": "Ane Vestergaard Pedersen",
  "av": "Anne Valsted",
  "ao": "Astrid Sun Otte",
  "bpo": "Bjarne Poulsen",
  "bs": "Bo Serritzlew",
  "cm": "Carsten Søe Mortensen",
  "dh": "Dennis Horn",
  "dc": "Dorthe Corneliussen Bertelsen",
  "eb": "Emil Egetoft Brinch",
  "eni": "Emil Nielsen",
  "hm": "Henrik Marcussen",
  "ic": "Ida Søttrup Christensen",
  "is": "Inge Johansen Stuhr",
  "jg": "Jakob Mols Græsborg",
  "jh": "Jens H. Noe",
  "jl": "Jesper Laubjerg",
  "kb": "Kathrine Spandet Brøndum",
  "kh": "Kenneth Hald",
  "kvs": "Kristoffer Vorre Sørensen",
  "lgn": "Laura Guldbæk Nymann",
  "mti": "Magnus Tolborg Ibsen",
  "mt": "Maria Rosborg Thornval",
  "mo": "Marianne Brun Ottesen",
  "mv": "Mark Vestergaard Pedersen",
  "mg": "Martin Gregersen",
  "ms": "Mia Mejlby Sørensen",
  "mtp": "Mikkel Tejlgaard Pedersen",
  "mm": "Måns Patrik Mårtensson",
  "rb": "Randi Borum",
  "rd": "Rasmus Damsgaard",
  "ra": "Rebecka Antonsen",
  "sg": "Sara Maiken Mols Græsborg",
  "smb": "Stine Maria Birkeholm",
  "snv": "Stine Nielsen Vad",
  "sp": "Stinne Krogh Poulsen",
  "th": "Trine Hedegaard Nielsen",
  "tin": "Trine Isager Nielsen",
  "tk": "Trine Krogh Korneliussen",
  "vsi": "Viola Simonsen"
};

  /**
 * ============================
 * SNIPPETS (hardcoded tekster)
 * ============================
 *
 * Her ændrer du de indbyggede tekster (default), som bruges i preview/print:
 * - sang:   variant-tekster
 * - gym:    variant-tekster
 * - elevraad: repræsentant-tekst
 * - roller: ekstra roller (fanebærer / redskabshold / DGI-instruktør)
 *
 * Struktur:
 *  title = UI-overskrift (kolonner + tooltips)
 *  text  = teksten der indsættes i udtalelsen
 *
 * Koderne (S1/S2/S3, G1/G2/G3 osv.) er keys i objektet og bruges til eksport/import.
 * UI viser kun title-teksterne.
 */
const SNIPPETS = {
    sang: {
  "S1": {
    "title": "Meget aktiv deltagelse",
    "text_m": "{{FORNAVN}} har deltaget meget engageret i fællessang gennem hele året. {{HAN_HUN}} har bidraget positivt til fællesskabet og vist lyst til at udvikle sin sangstemme.",
    "text_k": "{{FORNAVN}} har deltaget meget engageret i fællessang gennem hele året. {{HAN_HUN}} har bidraget positivt til fællesskabet og vist lyst til at udvikle sin sangstemme."
  },
  "S2": {
    "title": "Stabil deltagelse",
    "text_m": "{{FORNAVN}} har deltaget stabilt i fællessang og har mødt undervisningen med en positiv indstilling. {{HAN_HUN}} har været en god del af fællesskabet.",
    "text_k": "{{FORNAVN}} har deltaget stabilt i fællessang og har mødt undervisningen med en positiv indstilling. {{HAN_HUN}} har været en god del af fællesskabet."
  },
  "S3": {
    "title": "Varierende deltagelse",
    "text_m": "{{FORNAVN}} har haft en varierende deltagelse i fællessang. {{HAN_HUN}} har dog i perioder vist engagement og vilje til at indgå i fællesskabet.",
    "text_k": "{{FORNAVN}} har haft en varierende deltagelse i fællessang. {{HAN_HUN}} har dog i perioder vist engagement og vilje til at indgå i fællesskabet."
  }
},
    gym:  {
  "G1": {
    "title": "Meget engageret",
    "text_m": "{{FORNAVN}} har deltaget meget engageret i fællesgymnastik og har vist stor lyst til at udfordre sig selv. {{HAN_HUN}} har bidraget positivt til holdets fællesskab.",
    "text_k": "{{FORNAVN}} har deltaget meget engageret i fællesgymnastik og har vist stor lyst til at udfordre sig selv. {{HAN_HUN}} har bidraget positivt til holdets fællesskab."
  },
  "G2": {
    "title": "Stabil deltagelse",
    "text_m": "{{FORNAVN}} har deltaget stabilt i fællesgymnastik og har mødt undervisningen med en positiv indstilling.",
    "text_k": "{{FORNAVN}} har deltaget stabilt i fællesgymnastik og har mødt undervisningen med en positiv indstilling."
  },
  "G3": {
    "title": "Varierende deltagelse",
    "text_m": "{{FORNAVN}} har haft en varierende deltagelse i fællesgymnastik, men har i perioder vist vilje til at indgå i fællesskabet.",
    "text_k": "{{FORNAVN}} har haft en varierende deltagelse i fællesgymnastik, men har i perioder vist vilje til at indgå i fællesskabet."
  }
},
    roller: {
  "FANEBÆRER": {
    "title": "Fanebærer",
    "text_m": "{{FORNAVN}} har været udtaget som fanebærer til skolens fælles gymnastikopvisninger. Et hverv {{HAN_HUN}} har varetaget ansvarsfuldt og respektfuldt.",
    "text_k": "{{FORNAVN}} har været udtaget som fanebærer til skolens fælles gymnastikopvisninger. Et hverv {{HAN_HUN}} har varetaget ansvarsfuldt og respektfuldt."
  },
  "REDSKAB": {
    "title": "Redskabshold",
    "text_m": "{{FORNAVN}} har været en del af redskabsholdet, som {{HAN_HUN}} frivilligt har meldt sig til. {{HAN_HUN}} har ydet en stor indsats og taget ansvar.",
    "text_k": "{{FORNAVN}} har været en del af redskabsholdet, som {{HAN_HUN}} frivilligt har meldt sig til. {{HAN_HUN}} har ydet en stor indsats og taget ansvar."
  },
  "DGI": {
    "title": "DGI-instruktør",
    "text_m": "{{FORNAVN}} har deltaget aktivt i skolens frivillige samarbejde med foreningslivet og har vist engagement og ansvar.",
    "text_k": "{{FORNAVN}} har deltaget aktivt i skolens frivillige samarbejde med foreningslivet og har vist engagement og ansvar."
  }
},
    elevraad: {
      YES: {
        title: "Elevrådsrepræsentant",
        text_m: "{{ELEV_FORNAVN}} har været repræsentant i elevrådet og har taget ansvar i fællesskabet.",
        text_k: "{{ELEV_FORNAVN}} har været repræsentant i elevrådet og har taget ansvar i fællesskabet."
      }
    },
    kontaktgruppeDefault: "I kontaktgruppen har vi arbejdet med trivsel, ansvar og fællesskab.",
    afslutningDefault: "Vi ønsker eleven alt det bedste fremover."
  };

  const DEFAULT_SCHOOL_TEXT =
`På Himmerlands Ungdomsskole arbejder vi med både faglighed, fællesskab og personlig udvikling.
Udtalelsen er skrevet med udgangspunkt i elevens hverdag og deltagelse gennem skoleåret.`;

  const DEFAULT_TEMPLATE = "Udtalelse vedrørende {{ELEV_FULDE_NAVN}}\n\n{{ELEV_FORNAVN}} {{ELEV_EFTERNAVN}} har været elev på Himmerlands Ungdomsskole i perioden fra {{PERIODE_FRA}} til {{PERIODE_TIL}} i {{ELEV_KLASSE}}.\n\nHimmerlands Ungdomsskole er en traditionsrig efterskole, som prioriterer fællesskabet og faglig fordybelse højt. Elevernes hverdag er præget af frie rammer og mange muligheder. Vi møder eleverne med tillid, positive forventninger og faglige udfordringer. I løbet af et efterskoleår på Himmerlands Ungdomsskole er oplevelserne mange og udfordringerne ligeså. Det gælder i hverdagens almindelige undervisning, som fordeler sig over boglige fag, fællesfag og profilfag. Det gælder også alle de dage, hvor hverdagen ændres til fordel for temauger, studieture mm. \n\n{{ELEV_UDVIKLING_AFSNIT}}\n\nSom en del af et efterskoleår på Himmerlands Ungdomsskole deltager eleverne ugentligt i fællessang og fællesgymnastik. Begge fag udgør en del af efterskolelivet, hvor eleverne oplever nye sider af sig selv, flytter grænser og oplever, at deres bidrag til fællesskabet har betydning. I løbet af året optræder eleverne med fælleskor og gymnastikopvisninger.\n\n{{SANG_GYM_AFSNIT}}\n\nPå en efterskole er der mange praktiske opgaver.\n\n{{PRAKTISK_AFSNIT}}\n\n{{ELEV_FORNAVN}} har på Himmerlands Ungdomsskole været en del af en kontaktgruppe på {{KONTAKTGRUPPE_ANTAL}} elever. I kontaktgruppen kender vi {{HAM_HENDE}} som {{KONTAKTGRUPPE_BESKRIVELSE}}.\n\nVi har været rigtig glade for at have {{ELEV_FORNAVN}} som elev på skolen og ønsker held og lykke fremover.\n\n{{KONTAKTLÆRER_1_NAVN}} & {{KONTAKTLÆRER_2_NAVN}}\n\nKontaktlærere\n\n{{FORSTANDER_NAVN}}\n\nForstander";

  // ---------- storage ----------
  function lsGet(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      if (v === null || v === undefined) return fallback;
      return JSON.parse(v);
    } catch {
      return fallback;
    }
  }
  function lsSet(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function lsDelPrefix(prefix) {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
  }

  // ---------- normalize ----------
  function normalizeName(input) {
  if (!input) return "";
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\./g, " ")
    // Danish letters are not decomposed by NFD, so transliterate explicitly
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePlaceholderKey(key) {
  if (!key) return "";
  return key
    .toString()
    .trim()
    .toUpperCase()
    .replace(/Æ/g, "AE")
    .replace(/Ø/g, "OE")
    .replace(/Å/g, "AA")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}



  function callName(rawFirstName) {
    // HU-data: hvis fornavn-feltet indeholder ekstra efternavn, brug kun første ord.
    // Behold bindestreg-navne (fx Anne-Sofie) uændret.
    const s = (rawFirstName ?? '').toString().trim();
    if (!s) return '';
    const parts = s.split(/\s+/).filter(Boolean);
    return parts.length ? parts[0] : s;
  }
  function normalizeHeader(input) { return normalizeName(input).replace(/[^a-z0-9]+/g, ""); }
  function resolveTeacherName(inputRaw) {
    const norm = normalizeName(inputRaw);
    if (!norm) return "";
    if (TEACHER_ALIAS_MAP[norm]) return TEACHER_ALIAS_MAP[norm];
    return (inputRaw || '').toString().trim();
  }

  // ---------- util ----------
  function escapeHtml(s) {
    return (s ?? '').toString()
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function escapeAttr(s) { return (s ?? '').toString().replace(/"/g,'&quot;'); }
  function $(id){ return document.getElementById(id); }

  // ---------- CSV ----------
  function detectDelimiter(firstLine) {
    const candidates = [';', ',', '\t'];
    let best = ',', bestCount = -1;
    for (const d of candidates) {
      const needle = d === '\t' ? '\t' : d;
      const count = (firstLine.split(needle).length - 1);
      if (count > bestCount) { bestCount = count; best = d; }
    }
    return best;
  }
  function parseCsvLine(line, delim) {
    const out = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i+1] === '"') { cur += '"'; i++; continue; }
        inQuotes = !inQuotes;
        continue;
      }
      if (!inQuotes && (delim === '\t' ? ch === '\t' : ch === delim)) {
        out.push(cur); cur = ''; continue;
      }
      cur += ch;
    }
    out.push(cur);
    return out;
  }
  function parseCsv(text) {
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    while (lines.length && !lines[lines.length-1].trim()) lines.pop();
    if (lines.length === 0) return { headers: [], rows: [] };

    const delim = detectDelimiter(lines[0]);
    const headers = parseCsvLine(lines[0], delim).map(h => h.trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const parts = parseCsvLine(lines[i], delim);
      const row = {};
      for (let c = 0; c < headers.length; c++) row[headers[c]] = (parts[c] ?? '').trim();
      rows.push(row);
    }
    return { headers, rows, delim };
  }
  function toCsv(rows, headers) {
    const esc = (v) => {
      const s = (v ?? '').toString();
      if (/[",\n\r;]/.test(s)) return '"' + s.replace(/"/g,'""') + '"';
      return s;
    };
    const head = headers.join(',');
    const body = rows.map(r => headers.map(h => esc(r[h])).join(',')).join('\n');
    return head + '\n' + body + '\n';
  }
  function downloadText(filename, text) {
    const blob = new Blob([text], {type:'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ---------- app state ----------
  const state = { tab: 'set', selectedUnilogin: null, studentInputUrls: {} };

  function defaultSettings() {
    return {
      forstanderName: "Stinne Poulsen",
      forstanderLocked: true,
      me: "",
      meResolved: "",
      schoolYearEnd: new Date().getFullYear() + 1
    };
  }
  function defaultTemplates() {
    return {
      schoolText: DEFAULT_SCHOOL_TEXT,
      schoolTextLocked: true,
      template: DEFAULT_TEMPLATE,
      templateLocked: true
    };
  }

  function getSettings(){ return Object.assign(defaultSettings(), lsGet(KEYS.settings, {})); }
  function setSettings(s){ lsSet(KEYS.settings, s); }
  function getTemplates(){ return Object.assign(defaultTemplates(), lsGet(KEYS.templates, {})); }
  function setTemplates(t){ lsSet(KEYS.templates, t); }
  function getStudents(){ return lsGet(KEYS.students, []); }
  function setStudents(studs){ lsSet(KEYS.students, studs); }
  function getMarks(kindKey){ return lsGet(kindKey, {}); }
  function setMarks(kindKey, m){ lsSet(kindKey, m); }
  function getTextFor(unilogin){
    return lsGet(KEYS.textPrefix + unilogin, { elevudvikling:'', praktisk:'', kgruppe:'', lastSavedTs:null, studentInputMeta:null });
  }
  function setTextFor(unilogin, obj){ lsSet(KEYS.textPrefix + unilogin, obj); }

  function computePeriod(schoolYearEnd) {
    const endYear = Number(schoolYearEnd) || (new Date().getFullYear() + 1);
    return { from: `August ${endYear - 1}`, to: `Juni ${endYear}`, dateMonthYear: `Juni ${endYear}` };
  }

  function genderGroup(genderRaw) {
    const g = normalizeName(genderRaw);
    if (g === 'k' || g.includes('pige') || g.includes('female')) return 0;
    if (g === 'm' || g.includes('dreng') || /\bmale\b/.test(g)) return 1;
    return 2;
  }

  function pronouns(genderRaw) {
    const g = normalizeName(genderRaw);

    const isFemale = (g === 'k' || g === 'f' || g === 'p' || g.includes('pige') || g.includes('kvinde') || g.includes('female'));
    const isMale = (g === 'm' || g === 'd' || g.includes('dreng') || g.includes('mand') || /\bmale\b/.test(g));

    if (isFemale && !isMale) {
      return { HAN_HUN: 'hun', HAM_HENDE: 'hende', HANS_HENDES: 'hendes', SIG_HAM_HENDE: 'sig' };
    }
    if (isMale && !isFemale) {
      return { HAN_HUN: 'han', HAM_HENDE: 'ham', HANS_HENDES: 'hans', SIG_HAM_HENDE: 'sig' };
    }
    // Ukendt/neutral
    return { HAN_HUN: 'han/hun', HAM_HENDE: 'ham/hende', HANS_HENDES: 'hans/hendes', SIG_HAM_HENDE: 'sig' };
  }


  function sortedStudents(all) {
    return all.slice().sort((a,b) =>
      (genderGroup(a.koen) - genderGroup(b.koen)) ||
      (a.efternavn||'').localeCompare(b.efternavn||'', 'da') ||
      (a.fornavn||'').localeCompare(b.fornavn||'', 'da')
    );
  }

  // ---------- templating ----------
  function snippetTextByGender(snObj, genderRaw) {
    const g = normalizeName(genderRaw);
    const isMale = (g === 'm' || g.includes('dreng') || /\bmale\b/.test(g));
    const txt = isMale ? (snObj.text_m || '') : (snObj.text_k || snObj.text_m || '');
    return txt;
  }
  function applyPlaceholders(text, placeholderMap) {
  if (!text) return "";
  const s = String(text);

  // Replaces both {KEY} and {{KEY}} (allows æ/ø/å).
  // Lookup strategy:
  // 1) exact uppercased key
  // 2) normalized key (æ/ø/å -> AE/OE/AA + diacritics stripped)
  // 3) raw key as-is
  return s.replace(/\{\{\s*([^{}]+?)\s*\}\}|\{\s*([^{}]+?)\s*\}/g, (m, k1, k2) => {
    const rawKey = (k1 || k2 || "").trim();
    if (!rawKey) return "";
    const keyUpper = rawKey.toUpperCase();
    const keyNorm = normalizePlaceholderKey(rawKey);

    const v =
      (placeholderMap && (placeholderMap[keyUpper] ?? placeholderMap[keyNorm] ?? placeholderMap[rawKey])) ?? "";

    return (v === null || v === undefined) ? "" : String(v);
  });
}
  function cleanSpacing(text) {
    return (text || '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function buildStatement(student, settings) {
    const tpls = getTemplates();
    const period = computePeriod(settings.schoolYearEnd);

    const free = getTextFor(student.unilogin);
    const marksSang = getMarks(KEYS.marksSang)[student.unilogin] || {};
    const marksGym  = getMarks(KEYS.marksGym)[student.unilogin] || {};
    const marksER   = getMarks(KEYS.marksElev)[student.unilogin] || {};

    let sangAfsnit = '';
    if (marksSang.sang_variant && SNIPPETS.sang[marksSang.sang_variant]) {
      sangAfsnit = snippetTextByGender(SNIPPETS.sang[marksSang.sang_variant], student.koen);
    }

    let gymAfsnit = '';
    if (marksGym.gym_variant && SNIPPETS.gym[marksGym.gym_variant]) {
      gymAfsnit = snippetTextByGender(SNIPPETS.gym[marksGym.gym_variant], student.koen);
    }

    const roleTexts = [];
    Object.keys(SNIPPETS.roller).forEach(code => {
      if (marksGym[code]) roleTexts.push(snippetTextByGender(SNIPPETS.roller[code], student.koen));
    });
    let rolleAfsnit = roleTexts.filter(Boolean).join('\n\n');

    let elevraadAfsnit = '';
    if (marksER.elevraad) elevraadAfsnit = snippetTextByGender(SNIPPETS.elevraad.YES, student.koen);

    const fullName = `${student.fornavn} ${student.efternavn}`.trim();
    const firstName = callName(student.fornavn);
    const pr = pronouns(student.koen);
    const snMap = {
      "ELEV_FORNAVN": (student.fornavn||'').trim(),
      "ELEV_NAVN": fullName,
      "FORNAVN": (student.fornavn||'').trim(),
      "NAVN": fullName,
      "HAN_HUN": pr.HAN_HUN,
      "HAM_HENDE": pr.HAM_HENDE,
      "HANS_HENDES": pr.HANS_HENDES
    };
    sangAfsnit = applyPlaceholders(sangAfsnit, snMap);
    gymAfsnit = applyPlaceholders(gymAfsnit, snMap);
    elevraadAfsnit = applyPlaceholders(elevraadAfsnit, snMap);
    rolleAfsnit = applyPlaceholders(rolleAfsnit, snMap);

    const kontakt = [student.kontaktlaerer1, student.kontaktlaerer2].filter(x => (x||'').trim()).join(' / ');

    const placeholderMap = {
      "ELEV_NAVN": fullName,
      "ELEV_FORNAVN": firstName,
      "HAN_HUN": pr.HAN_HUN,
      "HAM_HENDE": pr.HAM_HENDE,
      "HANS_HENDES": pr.HANS_HENDES,
      "ELEV_EFTERNAVN": (student.efternavn || '').trim(),
      "ELEV_KLASSE": (student.klasse || '').trim(),
      "PERIODE_FRA": period.from,
      "PERIODE_TIL": period.to,
      "DATO_MAANED_AAR": period.dateMonthYear,

      "SKOLENS_STANDARDTEKST": tpls.schoolText || '',
      "SANG_AFSNIT": sangAfsnit,
      "GYM_AFSNIT": gymAfsnit,
      "ELEVRAAD_AFSNIT": elevraadAfsnit,
      "ROLLE_AFSNIT": rolleAfsnit,

      "ELEVUDVIKLING_AFSNIT": (free.elevudvikling || ''),
      "PRAKTISK_AFSNIT": (free.praktisk || ''),
      "KONTAKTGRUPPE_AFSNIT": (free.kgruppe || SNIPPETS.kontaktgruppeDefault),

      "AFSLUTNING_AFSNIT": SNIPPETS.afslutningDefault,

      "KONTAKTLAERERE": kontakt,
      "FORSTANDER": settings.forstanderName || '',
// Synonymer til skabeloner/snippets (forskellige placeholder-navne)
"ELEV_FULDE_NAVN": fullName,
"ELEV_FULD_E_NAVN": fullName,
"ELEV_UDVIKLING_AFSNIT": (free.elevudvikling || ''),
"ELEV_UDVIKLING_FRI": (free.elevudvikling || ''),
"PRAKTISK_FRI": (free.praktisk || ''),
"KGRUPPE_FRI": (free.kgruppe || ''),
"KONTAKTGRUPPE_ANTAL": String(settings.contactGroupCount || ''),
"KONTAKTGRUPPE_BESKRIVELSE": (free.kgruppe || SNIPPETS.kontaktgruppeDefault || ''),
"KONTAKTLAERER_1_NAVN": (student.kontaktlaerer1 || '').trim(),
"KONTAKTLAERER_2_NAVN": (student.kontaktlaerer2 || '').trim(),
      "KONTAKTLÆRER_1_NAVN": (student.kontaktlaerer1 || '').trim(),
      "KONTAKTLÆRER_2_NAVN": (student.kontaktlaerer2 || '').trim(),
"FORSTANDER_NAVN": settings.forstanderName || '',

      "HAN_HUN": pr.HAN_HUN,
      "HAM_HENDE": pr.HAM_HENDE,
      "HANS_HENDES": pr.HANS_HENDES,

      /* legacy placeholders */
      "NAVN": fullName,
      "FORNAVN": firstName,
      "KLASSE": (student.klasse || '').trim(),
      "ELEVUDVIKLING_FRI": (free.elevudvikling || ''),
      "PRAKTISK_FRI": (free.praktisk || ''),
      "KGRUPPE_FRI": (free.kgruppe || SNIPPETS.kontaktgruppeDefault),
      "SANG_SNIPPET": sangAfsnit,
      "GYM_SNIPPET": gymAfsnit,
      "ELEVRAAD_SNIPPET": elevraadAfsnit,
      "ROLLE_SNIPPETS": rolleAfsnit,
      "SANG_GYM_AFSNIT": [sangAfsnit, gymAfsnit, elevraadAfsnit, rolleAfsnit].filter(Boolean).join('\n\n')
    };

    let out = tpls.template || DEFAULT_TEMPLATE;
    out = applyPlaceholders(out, placeholderMap);
    return cleanSpacing(out);
  }

  async function readFileText(file) { return await file.text(); }

  // ---------- student CSV mapping ----------
  const STUDENT_COLMAP = {
    fornavn: new Set(["fornavn","firstname","givenname"]),
    efternavn: new Set(["efternavn","lastname","surname","familyname"]),
    unilogin: new Set(["unilogin","unicbrugernavn","unicusername","unic"]),
    koen: new Set(["køn","koen","gender", "kon"]),
    klasse: new Set(["klasse","class","hold"]),
    kontakt1: new Set(["kontaktlærer1","kontaktlaerer1","relationerkontaktlaerernavn","relationerkontaktlærernavn","kontaktlærer","kontaktlaerer"]),
    kontakt2: new Set(["kontaktlærer2","kontaktlaerer2","relationerandenkontaktlaerernavn","relationerandenkontaktlærernavn","andenkontaktlærer","andenkontaktlaerer"])
  };
  function mapStudentHeaders(headers) {
    const mapped = {};
    for (const h of headers) {
      const key = normalizeHeader(h);
      for (const [field,set] of Object.entries(STUDENT_COLMAP)) {
        if (set.has(key)) mapped[field] = h;
      }
    }
    return mapped;
  }
  function normalizeStudentRow(row, map) {
    const get = (field) => (row[map[field]] ?? '').trim();

    // Rens fornavn-felt: nogle elever har et "ekstra efternavn" i fornavn-kolonnen.
    // Regel: hvis fornavn har flere ord og IKKE indeholder bindestreg, så bruges første ord som kaldnavn,
    // og resten flyttes over i efternavn (foran eksisterende efternavn).
    const fornavnRaw = get('fornavn');
    let efternavnRaw = get('efternavn');

    let fornavn = fornavnRaw;
    if (fornavnRaw && !fornavnRaw.includes('-')) {
      const parts = fornavnRaw.split(/\s+/).filter(Boolean);
      if (parts.length > 1) {
        fornavn = parts[0];
        const extraSurname = parts.slice(1).join(' ');
        efternavnRaw = (extraSurname + ' ' + (efternavnRaw || '')).trim();
      }
    }

    const efternavn = efternavnRaw;
    const unilogin = get('unilogin') || (normalizeName((fornavn + ' ' + efternavn)).replace(/\s/g, '') + '_missing');
    const koen = get('koen');
    const klasse = get('klasse');
    const k1 = resolveTeacherName(get('kontakt1'));
    const k2 = resolveTeacherName(get('kontakt2'));
    return { fornavn, efternavn, unilogin, koen, klasse, kontaktlaerer1: k1, kontaktlaerer2: k2 };
  }

  // ---------- UI rendering ----------
  function setTab(tab) {
    state.tab = tab;
    const students = getStudents();
    if (!students.length && tab !== 'set') tab = 'set';

    ['k','edit','set'].forEach(t => {
      const btn = $('tab-' + (t==='set'?'set':t));
      if (btn) btn.classList.toggle('active', tab === t);
      const view = $('view-' + (t==='set'?'set':t));
      if (view) view.classList.toggle('active', tab === t);
    });

    renderAll();
  }

  function renderAll() {
    renderStatus();
    if (state.tab === 'set') renderSettings();
    if (state.tab === 'k') renderKList();
    if (state.tab === 'edit') renderEdit();
  }

  function renderStatus() {
    const s = getSettings();
    const studs = getStudents();
    const me = s.meResolved ? `· Jeg er: ${s.meResolved}` : '';
    $('statusText').textContent = studs.length ? `Elever: ${studs.length} ${me}` : `Ingen elevliste indlæst`;
  }

  function renderSettings() {
    const s = getSettings();
    const t = getTemplates();
    const studs = getStudents();

    $('forstanderName').value = s.forstanderName || '';
    $('forstanderName').readOnly = !!s.forstanderLocked;
    $('btnToggleForstander').textContent = s.forstanderLocked ? '✏️' : '🔒';

    $('meInput').value = s.me || '';
    $('schoolYearEnd').value = s.schoolYearEnd || '';

    const p = computePeriod(s.schoolYearEnd);
    $('periodFrom').value = p.from;
    $('dateMonthYear').value = p.dateMonthYear;

    $('schoolText').value = t.schoolText ?? DEFAULT_SCHOOL_TEXT;
    $('schoolText').readOnly = !!t.schoolTextLocked;
    $('btnToggleSchoolText').textContent = t.schoolTextLocked ? '✏️ Redigér' : '🔒 Lås';

    $('templateText').value = t.template ?? DEFAULT_TEMPLATE;
    $('templateText').readOnly = !!t.templateLocked;
    $('btnToggleTemplate').textContent = t.templateLocked ? '✏️ Redigér' : '🔒 Lås';

    $('studentsStatus').textContent = studs.length ? `✅ Elevliste indlæst: ${studs.length} elever` : `Upload elevliste først.`;
    $('studentsStatus').style.color = studs.length ? 'var(--accent)' : 'var(--muted)';

    const meNorm = normalizeName(s.meResolved);
    if (studs.length && meNorm) {
      const count = studs.filter(st => normalizeName(st.kontaktlaerer1) === meNorm || normalizeName(st.kontaktlaerer2) === meNorm).length;
      $('contactCount').value = String(count);
    } else {
      $('contactCount').value = '';
    }

    renderMarksTable();
  }

  function renderKList() {
    const s = getSettings();
    const studs = getStudents();
    const meNorm = normalizeName(s.meResolved);

    const kMessage = $('kMessage');
    const kList = $('kList');

    if (!studs.length) {
      kMessage.innerHTML = `<b>Upload elevliste først</b><br><span class="muted">Gå til Indstillinger → Elevliste (CSV).</span>`;
      kList.innerHTML = '';
      return;
    }
    if (!meNorm) {
      kMessage.innerHTML = `<b>Udfyld “Jeg er” i Indstillinger</b><br><span class="muted">Skriv fx MM, RD, MTP eller fuldt navn.</span>`;
      kList.innerHTML = '';
      return;
    }

    const mine = sortedStudents(getStudents())
      .filter(st => normalizeName(st.kontaktlaerer1) === meNorm || normalizeName(st.kontaktlaerer2) === meNorm);

    if (!mine.length) {
      kMessage.innerHTML = `<b>Ingen K-elever matcher</b><br>
        <ul class="muted small">
          <li>Tjek at “Jeg er” er korrekt (Indstillinger).</li>
          <li>Tjek at elevlisten indeholder kontaktlærernavne i Kontaktlærer1/2.</li>
        </ul>`;
      kList.innerHTML = '';
      return;
    }

    kMessage.innerHTML = `<b>${mine.length}</b> elever matcher <b>${escapeHtml(s.meResolved)}</b>. Klik for at redigere.`;

    kList.innerHTML = mine.map(st => {
      const full = `${st.fornavn || ''} ${st.efternavn || ''}`.trim();
      return `<div class="item" role="button" tabindex="0" data-unilogin="${escapeAttr(st.unilogin)}">
        <div class="itemTitle">${escapeHtml(full)}</div>
        <div class="itemMeta">${escapeHtml(st.klasse || '')}</div>
      </div>`;
    }).join('');

    [...kList.querySelectorAll('.item')].forEach(el => {
      el.addEventListener('click', () => {
        state.selectedUnilogin = el.getAttribute('data-unilogin');
        setTab('edit');
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
      });
    });
  }

  function setEditEnabled(enabled) {
    ['txtElevudv','txtPraktisk','txtKgruppe','fileStudentInput','btnClearStudentInput','btnPrint']
      .forEach(id => { const el = $(id); if (el) el.disabled = !enabled; });
  }
  function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString('da-DK', {hour:'2-digit', minute:'2-digit'});
  }
  function formatDateTime(ts) {
    const d = new Date(ts);
    return d.toLocaleString('da-DK', {year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'});
  }

  function renderEdit() {
    const studs = getStudents();
    const msg = $('editMessage');
    const pill = $('editStudentPill');

    if (!studs.length) {
      msg.innerHTML = `<b>Upload elevliste først</b><br><span class="muted">Gå til Indstillinger → Elevliste (CSV).</span>`;
      pill.textContent = 'Ingen elev valgt';
      setEditEnabled(false);
      $('preview').textContent = '';
      return;
    }
    if (!state.selectedUnilogin) {
      msg.innerHTML = `<b>Vælg en elev</b><br><span class="muted">Gå til fanen K-elever og klik på en elev.</span>`;
      pill.textContent = 'Ingen elev valgt';
      setEditEnabled(false);
      $('preview').textContent = '';
      return;
    }

    const st = studs.find(x => x.unilogin === state.selectedUnilogin);
    if (!st) {
      msg.innerHTML = `<b>Kunne ikke finde eleven</b><br><span class="muted">Vælg eleven igen under K-elever.</span>`;
      pill.textContent = 'Ingen elev valgt';
      setEditEnabled(false);
      $('preview').textContent = '';
      return;
    }

    msg.innerHTML = '';
    const full = `${st.fornavn} ${st.efternavn}`.trim();
    pill.textContent = `${full} · ${st.klasse || ''}`;

    setEditEnabled(true);

    const t = getTextFor(st.unilogin);
    $('txtElevudv').value = t.elevudvikling || '';
    $('txtPraktisk').value = t.praktisk || '';
    $('txtKgruppe').value = t.kgruppe || '';
    $('autosavePill').textContent = t.lastSavedTs ? `Sidst gemt: ${formatTime(t.lastSavedTs)}` : '';

    if (t.studentInputMeta && t.studentInputMeta.filename) {
      $('studentInputMeta').textContent = `Valgt fil: ${t.studentInputMeta.filename} (registreret ${formatDateTime(t.studentInputMeta.ts)})`;
    } else {
      $('studentInputMeta').textContent = '';
    }

    $('btnOpenStudentInput').textContent = (state.selectedUnilogin && state.studentInputUrls[state.selectedUnilogin]) ? 'Åbn fil' : 'Vælg fil';

    $('preview').textContent = buildStatement(st, getSettings());
  }

  /**
 * ----------------------------
 * Faglærer-UI (Sang / Gym / Elevråd)
 * ----------------------------
 *
 * Formål:
 * - Faglærere udfylder vurderinger for ALLE elever.
 * - Valg gemmes i localStorage og kan eksporteres som CSV.
 *
 * Vigtige steder at ændre tekster:
 * - SNIPPETS.sang / SNIPPETS.gym / SNIPPETS.elevraad / SNIPPETS.roller
 *   - .title = teksten der vises i UI (kolonne-overskrift og tooltip)
 *   - .text  = tekst der indsættes i udtalelsen (preview/print)
 *
 * UI-princip:
 * - Der vælges præcis 0 eller 1 variant pr. elev (Sang og Gym).
 * - Klik på aktivt flueben = ryd valg (så vi kan undvære ekstra “x”-kolonne).
 *
 * Implementationsprincip:
 * - Vi bruger event delegation (én click-listener på wrap),
 *   så koden er lettere at vedligeholde og mindre “skrøbelig”.
 */
function renderMarksTable() {
  const studs = getStudents();
  const wrap = $('marksTableWrap');
  const type = $('marksType').value;
  const q = normalizeName($('marksSearch').value || '');

  if (!studs.length) {
    wrap.innerHTML = `<div class="muted small">Upload elevliste først.</div>`;
    $('marksLegend').textContent = '';
    return;
  }

  // Filter + sort
  const list = sortedStudents(getStudents()).filter(st => {
    if (!q) return true;
    const full = normalizeName(`${st.fornavn} ${st.efternavn}`);
    return full.includes(q);
  });

  if (type === 'sang') return renderMarksSang(wrap, list);
  if (type === 'gym') return renderMarksGym(wrap, list);
  return renderMarksElevraad(wrap, list);
}

function renderMarksSang(wrap, list) {
  const marks = getMarks(KEYS.marksSang);
  const cols = Object.keys(SNIPPETS.sang);

  $('marksLegend').innerHTML = `<b>Sang</b>: klik for at vælge (klik igen for at fjerne).`;

  wrap.innerHTML = `
    <table data-kind="sang">
      <thead>
        <tr>
          <th>Navn</th>
          <th>Klasse</th>
          ${cols.map(c => `
            <th title="${escapeAttr(SNIPPETS.sang[c].title || c)}">
              ${escapeHtml(SNIPPETS.sang[c].title || c)}
            </th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${list.map(st => {
          const u = st.unilogin;
          const m = marks[u] || { sang_variant: "" };
          const full = `${st.fornavn} ${st.efternavn}`.trim();
          return `<tr data-u="${escapeAttr(u)}">
            <td>${escapeHtml(full)}</td>
            <td>${escapeHtml(st.klasse||'')}</td>
            ${cols.map(c => {
              const on = (m.sang_variant === c);
              return `<td>
                <button type="button" class="markbtn ${on ? 'on' : ''}"
                  data-action="setVariant" data-field="sang_variant" data-code="${escapeAttr(c)}" title="${escapeAttr(SNIPPETS.sang[c].title||c)}">
                  <span class="check">✓</span>
                </button>
              </td>`;
            }).join('')}
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  `;

  // Event delegation: toggle = click again clears
  wrap.onclick = (ev) => {
    const btn = ev.target.closest('button[data-action="setVariant"]');
    if (!btn) return;
    const tr = btn.closest('tr[data-u]');
    const u = tr.getAttribute('data-u');
    const code = btn.getAttribute('data-code') || '';
    marks[u] = marks[u] || {};
    marks[u].sang_variant = (marks[u].sang_variant === code) ? "" : code;
    setMarks(KEYS.marksSang, marks);
    renderMarksTable();
  };
}

function renderMarksGym(wrap, list) {
  const marks = getMarks(KEYS.marksGym);
  const variants = Object.keys(SNIPPETS.gym);
  const roles = Object.keys(SNIPPETS.roller);

  $('marksLegend').innerHTML = `<b>Gym/roller</b>: vælg gym-variant + evt. ekstra roller. (Klik igen for at fjerne variant.)`;

  wrap.innerHTML = `
    <table data-kind="gym">
      <thead>
        <tr>
          <th>Navn</th><th>Klasse</th>
          ${variants.map(v => `
            <th title="${escapeAttr(SNIPPETS.gym[v].title || v)}">
              ${escapeHtml(SNIPPETS.gym[v].title || v)}
            </th>`).join('')}
          ${roles.map(r => `
            <th title="${escapeAttr(SNIPPETS.roller[r].title || r)}">
              ${escapeHtml(SNIPPETS.roller[r].title || r)}
            </th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${list.map(st => {
          const u = st.unilogin;
          const m = marks[u] || { gym_variant: "" };
          const full = `${st.fornavn} ${st.efternavn}`.trim();
          return `<tr data-u="${escapeAttr(u)}">
            <td>${escapeHtml(full)}</td>
            <td>${escapeHtml(st.klasse||'')}</td>
            ${variants.map(v => {
              const on = (m.gym_variant === v);
              return `<td>
                <button type="button" class="markbtn ${on ? 'on' : ''}"
                  data-action="setVariant" data-field="gym_variant" data-code="${escapeAttr(v)}" title="${escapeAttr(SNIPPETS.gym[v].title||v)}">
                  <span class="check">✓</span>
                </button>
              </td>`;
            }).join('')}
            ${roles.map(r => {
              const on = !!m[r];
              return `<td>
                <input type="checkbox" data-action="toggleRole" data-role="${escapeAttr(r)}" ${on ? 'checked' : ''}/>
              </td>`;
            }).join('')}
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  `;

  wrap.onclick = (ev) => {
    const btn = ev.target.closest('button[data-action="setVariant"]');
    if (!btn) return;
    const tr = btn.closest('tr[data-u]');
    const u = tr.getAttribute('data-u');
    const code = btn.getAttribute('data-code') || '';
    marks[u] = marks[u] || {};
    marks[u].gym_variant = (marks[u].gym_variant === code) ? "" : code;
    setMarks(KEYS.marksGym, marks);
    renderMarksTable();
  };

  wrap.onchange = (ev) => {
    const cb = ev.target.closest('input[type="checkbox"][data-action="toggleRole"]');
    if (!cb) return;
    const tr = cb.closest('tr[data-u]');
    const u = tr.getAttribute('data-u');
    const role = cb.getAttribute('data-role');
    marks[u] = marks[u] || {};
    marks[u][role] = cb.checked;
    setMarks(KEYS.marksGym, marks);
    // no full rerender needed, but keeps UI consistent if you later add derived things
  };
}

function renderMarksElevraad(wrap, list) {
  const marks = getMarks(KEYS.marksElevraad);
  $('marksLegend').innerHTML = `<b>Elevråd</b>: markér elever der er repræsentanter.`;

  wrap.innerHTML = `
    <table data-kind="elevraad">
      <thead>
        <tr>
          <th>Navn</th>
          <th>Klasse</th>
          <th>${escapeHtml(SNIPPETS.elevraad.repr?.title || 'Elevrådsrepræsentant')}</th>
        </tr>
      </thead>
      <tbody>
        ${list.map(st => {
          const u = st.unilogin;
          const m = marks[u] || {};
          const full = `${st.fornavn} ${st.efternavn}`.trim();
          const on = !!m.repr;
          return `<tr data-u="${escapeAttr(u)}">
            <td>${escapeHtml(full)}</td>
            <td>${escapeHtml(st.klasse||'')}</td>
            <td><input type="checkbox" data-action="toggleElevraad" ${on ? 'checked' : ''}/></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  `;

  wrap.onchange = (ev) => {
    const cb = ev.target.closest('input[type="checkbox"][data-action="toggleElevraad"]');
    if (!cb) return;
    const tr = cb.closest('tr[data-u]');
    const u = tr.getAttribute('data-u');
    marks[u] = marks[u] || {};
    marks[u].repr = cb.checked;
    setMarks(KEYS.marksElevraad, marks);
  };
}

  // --- disabled duplicate block (Plan B hotfix) ---
  if (false) {
    const list = sortedStudents(getStudents()).filter(st => {
      if (!q) return true;
      const full = normalizeName(`${st.fornavn} ${st.efternavn}`);
      return full.includes(q);
    });

    if (type === 'sang') {
      const marks = getMarks(KEYS.marksSang);
      $('marksLegend').innerHTML = `<b>Sang</b>: vælg det udsagn der passer bedst. (Klik på “x” for at rydde.)`;
      const cols = Object.keys(SNIPPETS.sang);

      wrap.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Navn</th><th>Klasse</th>
              ${cols.map(c => `<th title="${escapeAttr(SNIPPETS.sang[c].title || c)}">${escapeHtml(c)}<br><span class="small muted">${escapeHtml(SNIPPETS.sang[c].title||'')}</span></th>`).join('')}
              <th>–</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(st => {
              const m = marks[st.unilogin] || { sang_variant: "" };
              const full = `${st.fornavn} ${st.efternavn}`.trim();
              return `<tr data-u="${escapeAttr(st.unilogin)}">
                <td>${escapeHtml(full)}</td>
                <td>${escapeHtml(st.klasse||'')}</td>
                ${cols.map(c => {
                  const active = (m.sang_variant === c);
                  return `<td><button type="button" class="markbtn ${active?'on':''}" data-set="${c}" title="${escapeAttr(SNIPPETS.sang[c].title||c)}"><span class="check">✓</span></button></td>`;
                }).join('')}
                <td><button type="button" class="markbtn clear" data-clear="1" title="Ryd valg"><span class="check">×</span></button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>`;

      

  } // end disabled duplicate block
$('marksType').addEventListener('change', () => renderMarksTable());
    $('marksSearch').addEventListener('input', () => renderMarksTable());

    $('btnExportMarks').addEventListener('click', () => {
      const type = $('marksType').value;
      const studs = getStudents();
      if (!studs.length) return;
      const sorted = sortedStudents(getStudents());

      if (type === 'sang') {
        const marks = getMarks(KEYS.marksSang);
        const rows = sorted.map(st => {
          const full = `${st.fornavn} ${st.efternavn}`.trim();
          const m = marks[st.unilogin] || {};
          return { Unilogin: st.unilogin, Navn: full, Sang_variant: m.sang_variant || '' };
        });
        downloadText('sang_marks.csv', toCsv(rows, ['Unilogin','Navn','Sang_variant']));
      }
      if (type === 'gym') {
        const marks = getMarks(KEYS.marksGym);
        const roleCodes = Object.keys(SNIPPETS.roller);
        const headers = ['Unilogin','Navn','Gym_variant', ...roleCodes];
        const rows = sorted.map(st => {
          const full = `${st.fornavn} ${st.efternavn}`.trim();
          const m = marks[st.unilogin] || {};
          const row = { Unilogin: st.unilogin, Navn: full, Gym_variant: m.gym_variant || '' };
          roleCodes.forEach(rc => row[rc] = m[rc] ? 1 : 0);
          return row;
        });
        downloadText('gym_marks.csv', toCsv(rows, headers));
      }
      if (type === 'elevraad') {
          const marks = getMarks(KEYS.marksElevraad);
          const rows = sorted.map(st => {
            const full = `${st.fornavn} ${st.efternavn}`.trim();
            const m = marks[st.unilogin] || {};
            return { Unilogin: st.unilogin, Navn: full, Elevrådsrepræsentant: m.repr ? 1 : 0 };
          });
          downloadText('elevraad_marks.csv', toCsv(rows, ['Unilogin','Navn','Elevrådsrepræsentant']));
        }
      });

// ---- CSV import (faglærer-CSV’er) ---------------------------------
function truthy(v) {
  const s = String(v ?? '').trim().toLowerCase();
  return s === '1' || s === 'true' || s === 'ja' || s === 'yes' || s === 'x' || s === '✓';
}

function importMarksFile(e, kind) {
  const f = e.target.files && e.target.files[0];
  if (!f) return;

  readFileText(f).then(text => {
    const parsed = parseCSV(text);
    const uniCol = parsed.headers.find(h => ['unilogin','unicbrugernavn','unicusername','unic'].includes(normalizeName(h))) || parsed.headers[0];

    if (kind === 'sang') {
      const marks = getMarks(KEYS.marksSang);
      for (const row of parsed.rows) {
        const u = String(row[uniCol]||'').trim();
        if (!u) continue;
        const val = String(row['Sang_variant'] ?? row['sang_variant'] ?? row['Sang'] ?? row['sang'] ?? '').trim();
        if (!marks[u]) marks[u] = {};
        marks[u].sang_variant = val || "";
      }
      setMarks(KEYS.marksSang, marks);
    }

    if (kind === 'gym') {
      const marks = getMarks(KEYS.marksGym);
      for (const row of parsed.rows) {
        const u = String(row[uniCol]||'').trim();
        if (!u) continue;
        if (!marks[u]) marks[u] = {};
        const val = String(row['Gym_variant'] ?? row['gym_variant'] ?? row['Gym'] ?? row['gym'] ?? '').trim();
        marks[u].gym_variant = val || "";

        // roles (robust header spellings)
        const fan = row['fanebaerer'] ?? row['Fanebærer'] ?? row['Fanebaerer'];
        const red = row['redskabshold'] ?? row['Redskabshold'];
        const dgi = row['dgi_instruktor'] ?? row['DGI-instruktør'] ?? row['DGI-instruktor'];
        marks[u].fanebaerer = truthy(fan);
        marks[u].redskabshold = truthy(red);
        marks[u].dgi_instruktor = truthy(dgi);
      }
      setMarks(KEYS.marksGym, marks);
    }

    if (kind === 'elevraad') {
      const marks = getMarks(KEYS.marksElevraad);
      for (const row of parsed.rows) {
        const u = String(row[uniCol]||'').trim();
        if (!u) continue;
        if (!marks[u]) marks[u] = {};
        const val = row['Elevrådsrepræsentant'] ?? row['Elevraadsrepraesentant'] ?? row['repr'] ?? row['Elevraad'] ?? row['elevraad'];
        marks[u].repr = truthy(val);
      }
      setMarks(KEYS.marksElevraad, marks);
    }

    renderMarksTable();
  }).catch(err => {
    console.error(err);
    alert('Kunne ikke importere CSV. Tjek filformat/kolonnenavne.');
  });
}

$('importSang').addEventListener('change', (e) => importMarksFile(e, 'sang'));
    $('importGym').addEventListener('change', (e) => importMarksFile(e, 'gym'));
    $('importElevraad').addEventListener('change', (e) => importMarksFile(e, 'elevraad'));

    ['txtElevudv','txtPraktisk','txtKgruppe'].forEach(id => {
      $(id).addEventListener('input', () => {
        if (!state.selectedUnilogin) return;
        const obj = getTextFor(state.selectedUnilogin);
        obj.elevudvikling = $('txtElevudv').value;
        obj.praktisk = $('txtPraktisk').value;
        obj.kgruppe = $('txtKgruppe').value;
        obj.lastSavedTs = Date.now();
        setTextFor(state.selectedUnilogin, obj);

        $('autosavePill').textContent = `Sidst gemt: ${formatTime(obj.lastSavedTs)}`;
        const st = getStudents().find(x => x.unilogin === state.selectedUnilogin);
        if (st) $('preview').textContent = buildStatement(st, getSettings());
      });
    });

    $('btnOpenStudentInput').addEventListener('click', () => {
      const url = state.selectedUnilogin ? state.studentInputUrls[state.selectedUnilogin] : null;
      if (url) {
        const win = window.open(url, '_blank', 'noopener,noreferrer');
        if (!win) alert('Popup blev stadig blokeret. Tillad popups for siden og prøv igen.');
      } else {
        $('fileStudentInput').click();
      }
    });

    $('fileStudentInput').addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f || !state.selectedUnilogin) return;
      const url = URL.createObjectURL(f);
      state.studentInputUrls[state.selectedUnilogin] = url;
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win) {
        alert('Popup blev blokeret af browseren. Tillad popups for siden, og klik derefter på “Åbn fil”.');
      }

      const obj = getTextFor(state.selectedUnilogin);
      obj.studentInputMeta = { filename: f.name, ts: Date.now() };
      setTextFor(state.selectedUnilogin, obj);
      renderEdit();
    });
    $('btnClearStudentInput').addEventListener('click', () => {
      if (!state.selectedUnilogin) return;
      const obj = getTextFor(state.selectedUnilogin);
      obj.studentInputMeta = null;
      setTextFor(state.selectedUnilogin, obj);
      delete state.studentInputUrls[state.selectedUnilogin];
      $('fileStudentInput').value = '';
      renderEdit();
    });

    $('btnPrint').addEventListener('click', () => window.print());
  }

  function wireEvents() {
  // NOTE: Denne Plan-B build binder events direkte i modul-scope længere oppe.
  // wireEvents() eksisterer kun for at undgå runtime-fejl, fordi init() kalder den.
}

function init() {
    wireEvents();
    if (!localStorage.getItem(KEYS.settings)) setSettings(defaultSettings());
    if (!localStorage.getItem(KEYS.templates)) setTemplates(defaultTemplates());

    const s = getSettings();
    if (s.me && !s.meResolved) { s.meResolved = resolveTeacherName(s.me); setSettings(s); }

    setTab('set');
    renderAll();
  }

  init();
})();
