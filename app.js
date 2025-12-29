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
    templatesImported: LS_PREFIX + 'templates_imported',
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

  let SNIPPETS = {
    sang: {
      "S1": {
        "title": "Sang – niveau 1",
        "text_m": "{{FORNAVN}} har bidraget til fællessang på allerbedste vis. Med sangglæde, engagement og nysgerrighed har {{FORNAVN}} været en drivkraft i timerne og en inspiration for andre. {{FORNAVN}} har herigennem oplevet det fællesskab, som fællessang kan give.",
        "text_k": "{{FORNAVN}} har bidraget til fællessang på allerbedste vis. Med sangglæde, engagement og nysgerrighed har {{FORNAVN}} været en drivkraft i timerne og en inspiration for andre. {{FORNAVN}} har herigennem oplevet det fællesskab, som fællessang kan give."
      },
      "S2": {
        "title": "Sang – niveau 2",
        "text_m": "{{FORNAVN}} har med godt humør bidraget til fællessang og kor og har derigennem vist sangglæde og åbenhed og fået kendskab til nye sange. {{FORNAVN}} har oplevet det fællesskab, som fællessang kan give.",
        "text_k": "{{FORNAVN}} har med godt humør bidraget til fællessang og kor og har derigennem vist sangglæde og åbenhed og fået kendskab til nye sange. {{FORNAVN}} har oplevet det fællesskab, som fællessang kan give."
      },
      "S3": {
        "title": "Sang – niveau 3",
        "text_m": "{{FORNAVN}} har deltaget i fællessang og kor og har derigennem fået kendskab til nye sange og har oplevet det fællesskab, som fællessang kan give.",
        "text_k": "{{FORNAVN}} har deltaget i fællessang og kor og har derigennem fået kendskab til nye sange og har oplevet det fællesskab, som fællessang kan give."
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
        text_m: "{{ELEV_FORNAVN}} har været en del af elevrådet på Himmerlands Ungdomsskole, hvor elevrådet blandt andet har stået for ugentlige fællesmøder for elever og lærere. Derudover har elevrådsarbejdet omfattet en række forskellige opgaver i løbet af året med ansvar for at sætte aktiviteter i gang i fællesskabets ånd. I den forbindelse har {{ELEV_FORNAVN}} vist engagement og vilje til at påtage sig og gennemføre forskellige opgaver og aktiviteter.",
        text_k: "{{ELEV_FORNAVN}} har været en del af elevrådet på Himmerlands Ungdomsskole, hvor elevrådet blandt andet har stået for ugentlige fællesmøder for elever og lærere. Derudover har elevrådsarbejdet omfattet en række forskellige opgaver i løbet af året med ansvar for at sætte aktiviteter i gang i fællesskabets ånd. I den forbindelse har {{ELEV_FORNAVN}} vist engagement og vilje til at påtage sig og gennemføre forskellige opgaver og aktiviteter."
      }
    },
    kontaktgruppeDefault: "I kontaktgruppen har vi arbejdet med trivsel, ansvar og fællesskab.",
    afslutningDefault: "Vi ønsker eleven alt det bedste fremover."
  };

    const SNIPPETS_DEFAULT = JSON.parse(JSON.stringify(SNIPPETS));

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

  
// ---------- snippet overrides (deling mellem lærere) ----------
const SNIPPETS_LEGACY_KEY = 'udt_snippets_override_v1';
const SNIPPETS_IMPORTED_KEY = 'udt_snippets_imported_v1';
const SNIPPETS_DRAFT_KEY = 'udt_snippets_draft_v1';
const OVERRIDE_SCHEMA = 'hu-elevudtalelser-snippets-override@1';
// --- Remote overrides from GitHub Pages (optional) -------------------------
// If files exist in /overrides/, they are merged on top of defaults.
// Missing files are ignored silently.
const REMOTE_OVERRIDE_FILES = {
  sang: './overrides/sang_override.json',
  gym: './overrides/gym_override.json',
  elevraad: './overrides/elevraad_override.json',
  templates: './overrides/templates_override.json',
};
let REMOTE_OVERRIDES = { sang: null, gym: null, elevraad: null, templates: null };

function cacheBust(url){
  const v = Date.now();
  return url + (url.includes('?') ? '&' : '?') + 'v=' + v;
}
async function fetchJsonIfExists(url){
  try{
    const res = await fetch(cacheBust(url), { cache: 'no-store' });
    if (!res.ok) return null; // 404 etc.
    return await res.json();
  }catch(_e){
    return null;
  }
}
function unwrapOverridePack(pack){
  if (!pack) return null;
  // Accept either full package {schema,scope,payload} or raw payload object
  if (pack.payload) return pack.payload;
  return pack;
}
async function loadRemoteOverrides(){
  const [sang, gym, elevraad, templates] = await Promise.all([
    fetchJsonIfExists(REMOTE_OVERRIDE_FILES.sang),
    fetchJsonIfExists(REMOTE_OVERRIDE_FILES.gym),
    fetchJsonIfExists(REMOTE_OVERRIDE_FILES.elevraad),
    fetchJsonIfExists(REMOTE_OVERRIDE_FILES.templates),
  ]);
  REMOTE_OVERRIDES = {
    sang: unwrapOverridePack(sang),
    gym: unwrapOverridePack(gym),
    elevraad: unwrapOverridePack(elevraad),
    templates: unwrapOverridePack(templates),
  };
}


function getSnippetImported() {
  return lsGet(SNIPPETS_IMPORTED_KEY, {}) || {};
}
function setSnippetImported(o) {
  lsSet(SNIPPETS_IMPORTED_KEY, o || {});
}
function getSnippetDraft() {
  // Backward compatibility: migrate legacy key -> draft
  const draft = lsGet(SNIPPETS_DRAFT_KEY, null);
  if (draft) return draft || {};
  const legacy = lsGet(SNIPPETS_LEGACY_KEY, null);
  if (legacy) {
    lsSet(SNIPPETS_DRAFT_KEY, legacy);
    try { localStorage.removeItem(SNIPPETS_LEGACY_KEY); } catch {}
    return legacy || {};
  }
  return {};
}
function setSnippetDraft(o) {
  lsSet(SNIPPETS_DRAFT_KEY, o || {});
}
function applySnippetOverrides() {
  const remote = REMOTE_OVERRIDES || {};
  const imported = getSnippetImported();
  const draft = getSnippetDraft();

  // start fra defaults (deep clone)
  SNIPPETS = JSON.parse(JSON.stringify(SNIPPETS_DEFAULT));

  function applyPack(pack){
    if(!pack) return;

    // If a full override package was stored, unwrap payload
    if (pack.payload) pack = pack.payload;

    // --- Sang
    const sang = pack.sang && (pack.sang.items ? pack.sang : pack.sang.sang); // accept nested
    if (sang && sang.items) {
      Object.keys(sang.items).forEach(k => {
        const it = sang.items[k] || {};
        if (!SNIPPETS.sang[k]) SNIPPETS.sang[k] = { title: k, text_m: '', text_k: '' };
        if (typeof it.label === 'string' && it.label.trim()) SNIPPETS.sang[k].title = it.label.trim();
        if (typeof it.text === 'string') { SNIPPETS.sang[k].text_m = it.text; SNIPPETS.sang[k].text_k = it.text; }
        // allow direct text_m/text_k too
        if (typeof it.text_m === 'string') SNIPPETS.sang[k].text_m = it.text_m;
        if (typeof it.text_k === 'string') SNIPPETS.sang[k].text_k = it.text_k;
      });
    } else if (pack.snippets && pack.snippets.sang) {
      Object.keys(pack.snippets.sang).forEach(k => {
        const it = pack.snippets.sang[k] || {};
        if (!SNIPPETS.sang[k]) SNIPPETS.sang[k] = { title: k, text_m: '', text_k: '' };
        if (typeof it.label === 'string') SNIPPETS.sang[k].title = it.label;
        if (typeof it.text === 'string') { SNIPPETS.sang[k].text_m = it.text; SNIPPETS.sang[k].text_k = it.text; }
      });
    }

    // --- Gym (varianter + roller)
    const gym = pack.gym && (pack.gym.variants || pack.gym.roles) ? pack.gym : (pack.gym && pack.gym.gym ? pack.gym.gym : null);
    if (gym && gym.variants) {
      Object.keys(gym.variants).forEach(k => {
        const it = gym.variants[k] || {};
        if (!SNIPPETS.gym[k]) SNIPPETS.gym[k] = { title: k, text_m: '', text_k: '' };
        if (typeof it.label === 'string' && it.label.trim()) SNIPPETS.gym[k].title = it.label.trim();
        if (typeof it.text === 'string') { SNIPPETS.gym[k].text_m = it.text; SNIPPETS.gym[k].text_k = it.text; }
        if (typeof it.text_m === 'string') SNIPPETS.gym[k].text_m = it.text_m;
        if (typeof it.text_k === 'string') SNIPPETS.gym[k].text_k = it.text_k;
      });
    }
    if (gym && gym.roles) {
      Object.keys(gym.roles).forEach(k => {
        const it = gym.roles[k] || {};
        if (!SNIPPETS.roller[k]) SNIPPETS.roller[k] = { title: k, text_m: '', text_k: '' };
        if (typeof it.label === 'string' && it.label.trim()) SNIPPETS.roller[k].title = it.label.trim();
        if (typeof it.text === 'string') { SNIPPETS.roller[k].text_m = it.text; SNIPPETS.roller[k].text_k = it.text; }
        if (typeof it.text_m === 'string') SNIPPETS.roller[k].text_m = it.text_m;
        if (typeof it.text_k === 'string') SNIPPETS.roller[k].text_k = it.text_k;
      });
    }

    // --- Elevråd (YES)
    const er = pack.elevraad && (typeof pack.elevraad.text === 'string') ? pack.elevraad : (pack.elevraad && pack.elevraad.elevraad ? pack.elevraad.elevraad : null);
    if (er && typeof er.text === 'string') {
      if (!SNIPPETS.elevraad.YES) SNIPPETS.elevraad.YES = { title: 'Elevrådsrepræsentant', text_m: '', text_k: '' };
      SNIPPETS.elevraad.YES.text_m = er.text;
      SNIPPETS.elevraad.YES.text_k = er.text;
      if (typeof er.label === 'string' && er.label.trim()) SNIPPETS.elevraad.YES.title = er.label.trim();
    }
  }

  // 1) Remote (GitHub /overrides/)
  applyPack(remote.sang);
  applyPack(remote.gym);
  applyPack(remote.elevraad);

  // 2) Imported overrides (explicitly imported JSON)
  applyPack(imported);

  // 3) Draft overrides (local work-in-progress; MUST win on refresh)
  applyPack(draft);
}

function downloadJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function buildOverridePackage(scope) {
  const today = new Date().toISOString().slice(0,10);
  const s = getSettings();
  const author = (s && s.me) ? String(s.me) : '';
  const pkg = { schema: OVERRIDE_SCHEMA, scope, author, createdAt: today, payload: {} };

  if (scope === 'sang') {
    const items = {};
    ['S1','S2','S3'].forEach(k => {
      const label = ($('sangLabel_'+k)?.value || '').trim() || k;
      const text = ($('sangText_'+k)?.value || '').trim();
      items[k] = { label, text };
    });
    pkg.payload.sang = { items, order: ['S1','S2','S3'] };
  }

  if (scope === 'gym') {
    const variants = {};
    ['G1','G2','G3'].forEach(k => {
      const label = ($('gymLabel_'+k)?.value || '').trim() || k;
      const text = ($('gymText_'+k)?.value || '').trim();
      variants[k] = { label, text };
    });

    const roles = {};
    const roleRows = Array.from(document.querySelectorAll('[data-role-key]'));
    roleRows.forEach(row => {
      const key = row.getAttribute('data-role-key');
      const label = (row.querySelector('.roleLabel')?.value || '').trim() || key;
      const text = (row.querySelector('.roleText')?.value || '').trim();
      if (key) roles[key] = { label, text };
    });

    pkg.payload.gym = {
      variants,
      variantOrder: ['G1','G2','G3'],
      roles,
      roleOrder: Object.keys(roles)
    };
  }

  if (scope === 'elevraad') {
    const text = ($('elevraadText')?.value || '').trim();
    pkg.payload.elevraad = { label: 'Elevråd', text };
  }

  if (scope === 'templates') {
    const t = getTemplates();
    const s2 = getSettings();
    pkg.payload.templates = {
      forstanderNavn: (s2.forstanderName || '').trim(),
      schoolText: String(t.schoolText ?? DEFAULT_SCHOOL_TEXT),
      template: String(t.template ?? DEFAULT_TEMPLATE)
    };
  }

  return pkg;
}

function importOverridePackage(expectedScope, obj) {
  if (!obj || obj.schema !== OVERRIDE_SCHEMA) throw new Error('Forkert fil: schema matcher ikke.');
  if (!obj.scope) throw new Error('Forkert fil: mangler scope.');
  if (obj.scope !== expectedScope && obj.scope !== 'all') throw new Error('Forkert fil: scope matcher ikke.');

  const overrides = getSnippetImported();
  const p = obj.payload || {};

  if (obj.scope === 'all' || obj.scope === 'sang') {
    if (p.sang && p.sang.items) overrides.sang = p.sang;
  }
  if (obj.scope === 'all' || obj.scope === 'gym') {
    if (p.gym) overrides.gym = p.gym;
  }
  if (obj.scope === 'all' || obj.scope === 'elevraad') {
    if (p.elevraad) overrides.elevraad = p.elevraad;
  }

  if (expectedScope === 'templates' || obj.scope === 'templates' || obj.scope === 'all') {
    // Templates er ikke snippets-overrides, men indstillinger/templates.
    if (p.templates) {
      // Store imported templates separately, so a local draft is not overwritten on refresh.
      const tImp = lsGet(KEYS.templatesImported, {});
      if (typeof p.templates.schoolText === 'string') tImp.schoolText = p.templates.schoolText;
      if (typeof p.templates.template === 'string') tImp.template = p.templates.template;
      lsSet(KEYS.templatesImported, tImp);

const s = getSettings();
      if (typeof p.templates.forstanderNavn === 'string') s.forstanderName = p.templates.forstanderNavn;
      setSettings(s);
    }
  }

  setSnippetImported(overrides);
  applySnippetOverrides();
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
  const state = {
    tab: 'set',
    selectedUnilogin: null,
    studentInputUrls: {},
    // The current visible K-elev list (after any filters). Used for prev/next navigation in Redigér.
    visibleKElevIds: [],
    kMeDraft: ''
  };

function defaultSettings() {
    return {
      contactGroupCount: "",
      forstanderName: "Stinne Krogh Poulsen",
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
  function getTemplates(){ return Object.assign(defaultTemplates(), (REMOTE_OVERRIDES.templates && (REMOTE_OVERRIDES.templates.templates || REMOTE_OVERRIDES.templates)) || {}, lsGet(KEYS.templatesImported, {}), lsGet(KEYS.templates, {})); }
  function setTemplates(t){ lsSet(KEYS.templates, t); }
  function getStudents(){ const s = lsGet(KEYS.students, []); window.__ALL_STUDENTS__ = s || []; return s; }
  function setStudents(studs){ lsSet(KEYS.students, studs); window.__ALL_STUDENTS__ = studs || []; }
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
      "ELEV_KLASSE": formatClassLabel(student.klasse),
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
"KONTAKTGRUPPE_ANTAL": String(settings.contactGroupCount || (window.__ALL_STUDENTS__ ? window.__ALL_STUDENTS__.length : "") || ''),
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
    const students = getStudents();
    if (!students.length && tab !== 'set') tab = 'set';

    // Redigér kræver valgt elev. Hvis ingen er valgt, send brugeren til K-elever.
    if (tab === 'edit' && !state.selectedUnilogin) tab = 'k';

    state.tab = tab;

    ['k','edit','set'].forEach(t => {
      const btn = $('tab-' + (t==='set'?'set':t));
      if (btn) btn.classList.toggle('active', tab === t);
      const view = $('view-' + (t==='set'?'set':t));
      if (view) view.classList.toggle('active', tab === t);
    });

    renderAll();
    if (tab === 'set') {
      wireSnippetAccordion();
      collapseSnippetFolds();
    }
  }

  function updateTabVisibility() {
    const editBtn = $('tab-edit');
    if (!editBtn) return;
    // Skjul Redigér, hvis ingen elev er valgt.
    editBtn.style.display = state.selectedUnilogin ? '' : 'none';
  }


  // Snippet-accordion i Indstillinger: ingen sektioner åbne ved indgang, og max én åben ad gangen.
  let _snippetAccordionWired = false;
  function wireSnippetAccordion() {
    if (_snippetAccordionWired) return;
    _snippetAccordionWired = true;

    document.addEventListener('toggle', (ev) => {
      const d = ev.target;
      if (!(d instanceof HTMLDetailsElement)) return;
      if (!d.classList.contains('snippetFold')) return;
      if (!d.open) return;

      // Luk alle andre snippet-folds
      document.querySelectorAll('details.snippetFold[open]').forEach(other => {
        if (other !== d) other.open = false;
      });
    }, true);
  }

  function collapseSnippetFolds() {
    document.querySelectorAll('details.snippetFold').forEach(d => { d.open = false; });
  }


  function renderAll() {
    updateTabVisibility();
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
      // persist contact group count for placeholders
      const s0 = getSettings();
      if (String(s0.contactGroupCount||'') !== String(count)) { s0.contactGroupCount = String(count); setSettings(s0); }
    } else {
      $('contactCount').value = '';
      const s0 = getSettings();
      if (s0.contactGroupCount) { s0.contactGroupCount = ''; setSettings(s0); }
    }

    renderSnippetsEditor();
    renderMarksTable();
  }

  
function renderSnippetsEditor() {
  // Hvis UI ikke findes (ældre HTML), gør intet
  if (!$('sangText_S1')) return;

  // Sikr vi viser de aktuelle (merged) værdier
  const sangKeys = ['S1','S2','S3'];
  sangKeys.forEach(k => {
    const it = SNIPPETS.sang[k] || { title: k, text_m: '', text_k: '' };
    $('sangLabel_'+k).value = it.title || k;
    $('sangText_'+k).value = (it.text_m || it.text_k || '');
  });

  const gymKeys = ['G1','G2','G3'];
  gymKeys.forEach(k => {
    const it = SNIPPETS.gym[k] || { title: k, text_m: '', text_k: '' };
    $('gymLabel_'+k).value = it.title || k;
    $('gymText_'+k).value = (it.text_m || it.text_k || '');
  });

  // Elevråd
  const er = (SNIPPETS.elevraad && SNIPPETS.elevraad.YES) ? SNIPPETS.elevraad.YES : { text_m: '', text_k: '' };
  $('elevraadText').value = (er.text_m || er.text_k || '');

  // Roller (gym)
  const list = document.getElementById('gymRolesList');
  if (!list) return;
  list.innerHTML = '';
  Object.keys(SNIPPETS.roller || {}).forEach(key => {
    const it = SNIPPETS.roller[key];
    const row = document.createElement('div');
    row.className = 'roleRow';
    row.setAttribute('data-role-key', key);
    row.innerHTML = `
      <div class="row gap wrap" style="align-items:center">
        <div class="field" style="min-width:220px;flex:1">
          <label>Rolle-navn</label>
          <input class="roleLabel" type="text" value="${escapeHtml(it.title || key)}">
        </div>
        <div class="field" style="flex:2;min-width:280px">
          <label>Tekst</label>
          <textarea class="roleText" rows="3">${escapeHtml((it.text_m || it.text_k || ''))}</textarea>
        </div>
        <button class="btn danger" type="button" data-remove-role="${escapeHtml(key)}">Slet</button>
      </div>
    `;
    list.appendChild(row);
  });
}

function escapeHtml(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function commitSnippetsFromUI(scope) {
  const overrides = getSnippetImported();

  if (scope === 'sang') {
    const items = {};
    ['S1','S2','S3'].forEach(k => {
      items[k] = {
        label: ($('sangLabel_'+k).value || '').trim() || k,
        text: ($('sangText_'+k).value || '').trim()
      };
    });
    overrides.sang = { items, order: ['S1','S2','S3'] };
  }

  if (scope === 'gym') {
    const variants = {};
    ['G1','G2','G3'].forEach(k => {
      variants[k] = {
        label: ($('gymLabel_'+k).value || '').trim() || k,
        text: ($('gymText_'+k).value || '').trim()
      };
    });
    const roles = {};
    Array.from(document.querySelectorAll('[data-role-key]')).forEach(row => {
      const key = row.getAttribute('data-role-key');
      if (!key) return;
      roles[key] = {
        label: (row.querySelector('.roleLabel')?.value || '').trim() || key,
        text: (row.querySelector('.roleText')?.value || '').trim()
      };
    });
    overrides.gym = { variants, roles, variantOrder: ['G1','G2','G3'], roleOrder: Object.keys(roles) };
  }

  if (scope === 'elevraad') {
    overrides.elevraad = { label: 'Elevråd', text: ($('elevraadText').value || '').trim() };
  }

  setSnippetImported(overrides);
  applySnippetOverrides();
  // opdater visninger
  if (state.tab === 'edit') renderEdit();
  renderMarksTable();
}

function renderKList() {
    const s = getSettings();
    const studs = getStudents();
    const kMsg = $('kMessage');
    if (kMsg) kMsg.classList.remove('compact');
    const kList = $('kList');

    // If "Jeg er" is not confirmed yet, show an inline input that commits on ENTER.
    // User may type initials OR full name; we only update settings when ENTER is pressed.
    if (!((s.meResolved || '') + '').trim()) {
      state.visibleKElevIds = [];
      if (kList) kList.innerHTML = '';

      const draft = (state.kMeDraft || '').trim();

      if (kMsg) {
        kMsg.innerHTML = `
          <div class="field" style="max-width:520px">
            <label><b>Hvem er du?</b> <span class="muted small">(initialer eller navn)</span></label>
            <input id="kMeInline" type="text" inputmode="text" autocapitalize="words" autocomplete="off" spellcheck="false"
                   placeholder="Skriv initialer eller navn og tryk Enter" value="${escapeAttr(draft)}">
            <div class="muted small" style="margin-top:.25rem">Tip: Initialer findes i alias-map. Du kan også skrive et helt navn og trykke Enter.</div>
            <div class="muted small" id="kMeInlineHint" style="margin-top:.25rem"></div>
          </div>
        `;
      }

      const inp = $('kMeInline');
      const hint = $('kMeInlineHint');

      if (hint) hint.textContent = 'Tryk Enter for at vise dine K-elever.';

      if (inp) {
        // Restore focus/caret nicely
        try { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); } catch {}
        inp.addEventListener('input', (e) => {
          state.kMeDraft = (e.target.value || '');
        }, { passive: true });

        inp.addEventListener('keydown', (e) => {
          if (e.key !== 'Enter') return;
          e.preventDefault();

          const raw = ((inp.value || '') + '').trim();
          if (!raw) {
            if (hint) hint.textContent = 'Skriv noget først (initialer eller navn).';
            return;
          }

          // Resolve via alias-map if input looks like initials (2-3 letters). Otherwise accept as full name.
          const cleaned = raw.toUpperCase().replace(/\s+/g,'').replace(/[^A-ZÆØÅ]/g,'').slice(0,3);
          let resolved = '';
          if (cleaned.length >= 2 && cleaned.length <= 3) {
            const key = normalizeName(cleaned);
            resolved = TEACHER_ALIAS_MAP[key] || '';
          }
          if (!resolved) {
            resolved = raw; // accept full name (may include spaces and diacritics)
          }

          const s2 = getSettings();
          s2.me = raw;
          s2.meResolved = resolved;
          setSettings(s2);

          state.kMeDraft = '';

          renderStatus();
          renderKList();
        });

        // Allow Esc to clear draft
        inp.addEventListener('keydown', (e) => {
          if (e.key !== 'Escape') return;
          state.kMeDraft = '';
          inp.value = '';
          if (hint) hint.textContent = 'Tryk Enter for at vise dine K-elever.';
        });
      }
      return;
    }

    // Confirmed teacher name present -> show list.
    const meResolved = ((s.meResolved || '') + '').trim();
    const meNorm = normalizeName(meResolved);

    if (kMsg) kMsg.innerHTML = '';
    const mine = sortedStudents(studs)
      .filter(st => normalizeName(st.kontaktlaerer1) === meNorm || normalizeName(st.kontaktlaerer2) === meNorm);

    state.visibleKElevIds = mine.map(st => st.unilogin);

    if (!mine.length) {
      if (kMsg) {
        kMsg.innerHTML = `<div class="muted">${escapeHtml(0)} elever matcher <b>${escapeHtml(meResolved)}</b>.</div>`;
      }
      if (kList) kList.innerHTML = '';
      return;
    }

    const prog = mine.reduce((acc, st) => {
      const f = getTextFor(st.unilogin);
      acc.u += (f.elevudvikling||'').trim()?1:0;
      acc.p += (f.praktisk||'').trim()?1:0;
      acc.k += (f.kgruppe||'').trim()?1:0;
      return acc;
    }, {u:0,p:0,k:0});

    if (kMsg) {
      kMsg.classList.add('compact');
      kMsg.innerHTML = `
        <div class="muted"><b>${mine.length}</b> elev(e) matcher <b>${escapeHtml(meResolved)}</b>. Klik for at redigere.</div>
        <div class="muted small">U ${prog.u}/${mine.length} · P ${prog.p}/${mine.length} · K ${prog.k}/${mine.length}</div>
      `;
    }

    if (kList) {
      kList.innerHTML = mine.map(st => {
        const full = `${st.fornavn || ''} ${st.efternavn || ''}`.trim();
        const free = getTextFor(st.unilogin);
        const hasU = !!(free.elevudvikling || '').trim();
        const hasP = !!(free.praktisk || '').trim();
        const hasK = !!(free.kgruppe || '').trim();

        return `
          <div class="card clickable" data-unilogin="${escapeAttr(st.unilogin)}">
            <div class="cardTopRow">
              <div class="cardTitle"><b>${escapeHtml(full)}</b></div>
              <div class="cardFlags muted small">${hasU?'U':''}${hasP?' P':''}${hasK?' K':''}</div>
            </div>
            <div class="cardSub muted small">${escapeHtml(formatClassLabel(st.klasse || ''))}</div>
          </div>
        `;
      }).join('');

      kList.querySelectorAll('[data-unilogin]').forEach(el => {
        el.addEventListener('click', () => {
          state.selectedUnilogin = el.getAttribute('data-unilogin');
          setTab('edit');
          renderAll();
          });
      });
    }
}

function setEditEnabled(enabled) {
    ['txtElevudv','txtPraktisk','txtKgruppe','fileStudentInput','btnPickStudentPdf','btnOpenStudentInput','btnClearStudentInput','btnPrint']
      .forEach(id => { const el = $(id); if (el) el.disabled = !enabled; });
  }
  function formatClassLabel(raw) {
  const k = ((raw || '') + '').trim();
  if (!k) return '';
  // Accept "9", "10", "9.", "10." etc.
  const m = k.match(/^(\d{1,2})\.?$/);
  if (m) return `${m[1]}. klasse`;
  return k;
}

function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString('da-DK', {hour:'2-digit', minute:'2-digit'});
  }
  function formatDateTime(ts) {
    const d = new Date(ts);
    return d.toLocaleString('da-DK', {year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'});
  }



  // Completion ratios shown in folded section headers (e.g. 6/10)
  // Targets are char-count goals; tweak here if you want different expectations.
  const SECTION_TARGETS = { elevudv: 600, praktisk: 350, kgruppe: 350 };

  function ratio10(text, target) {
    const n = (text || '').trim().length;
    if (!target || target <= 0) return { score: 0, n };
    const score = Math.max(0, Math.min(10, Math.round((n / target) * 10)));
    return { score, n };
  }

  function updateEditRatios() {
    const nE = ($('txtElevudv')?.value || '').trim().length;
    const nP = ($('txtPraktisk')?.value || '').trim().length;
    const nK = ($('txtKgruppe')?.value || '').trim().length;

    const elE = $('ratioElevudv'); if (elE) elE.textContent = nE ? `antal tegn: ${nE}` : '';
    const elP = $('ratioPraktisk'); if (elP) elP.textContent = nP ? `antal tegn: ${nP}` : '';
    const elK = $('ratioKgruppe'); if (elK) elK.textContent = nK ? `antal tegn: ${nK}` : '';
  }

  function maybeOpenEditSection() {
    const sec = state.openEditSection;
    if (!sec) return;
    const map = {
      elevudv: { details: 'secElevudv', textarea: 'txtElevudv' },
      praktisk: { details: 'secPraktisk', textarea: 'txtPraktisk' },
      kgruppe: { details: 'secKgruppe', textarea: 'txtKgruppe' }
    };
    const m = map[sec];
    if (m) {
      const d = $(m.details);
      if (d) d.open = true;
      const ta = $(m.textarea);
      if (ta) ta.focus();
    }
    state.openEditSection = null;
  }

  function getVisibleKElevIds() {
    if (state.visibleKElevIds && state.visibleKElevIds.length) return state.visibleKElevIds.slice();
    const s = getSettings();
    const studs = getStudents();
    const meNorm = normalizeName(s.meResolved);
    if (!studs.length || !meNorm) return [];
    return sortedStudents(studs)
      .filter(st => normalizeName(st.kontaktlaerer1) === meNorm || normalizeName(st.kontaktlaerer2) === meNorm)
      .map(st => st.unilogin);
  }

  function gotoAdjacentStudent(dir) {
    const ids = getVisibleKElevIds();
    if (!ids.length || !state.selectedUnilogin) return;
    const i = ids.indexOf(state.selectedUnilogin);
    if (i === -1) return;
    const nextIndex = i + (dir === 'next' ? 1 : -1);
    if (nextIndex < 0 || nextIndex >= ids.length) return;
    state.selectedUnilogin = ids[nextIndex];
    state.openEditSection = null;
    // Ensure edit tab stays visible
    updateTabVisibility();
    renderEdit();
  }

  function renderEdit() {
    const studs = getStudents();
    const msg = $('editMessage');
    const hint = $('editHint');
    const navRow = $('editNavRow');
    const pill = $('editStudentPill');
    const bPrev = $('btnPrevStudent'); const bNext = $('btnNextStudent');

    if (!studs.length) {
      if (navRow) navRow.style.display = 'none';
      if (hint) hint.innerHTML = `<b>Upload elevliste først</b><br><span class="muted">Gå til Indstillinger → Elevliste (CSV).</span>`;
      pill.textContent = 'Ingen elev valgt';
      setEditEnabled(false);
      $('preview').textContent = '';
      if (bPrev) bPrev.style.display = 'none';
      if (bNext) bNext.style.display = 'none';
      return;
    }
    if (!state.selectedUnilogin) {
      if (navRow) navRow.style.display = 'none';
      if (hint) hint.innerHTML = `<b>Vælg en elev</b><br><span class="muted">Gå til fanen K-elever og klik på en elev.</span>`;
      pill.textContent = 'Ingen elev valgt';
      setEditEnabled(false);
      $('preview').textContent = '';
      if (bPrev) bPrev.style.display = 'none';
      if (bNext) bNext.style.display = 'none';
      return;
    }

    const st = studs.find(x => x.unilogin === state.selectedUnilogin);
    if (!st) {
      if (navRow) navRow.style.display = 'none';
      if (hint) hint.innerHTML = `<b>Kunne ikke finde eleven</b><br><span class="muted">Vælg eleven igen under K-elever.</span>`;
      pill.textContent = 'Ingen elev valgt';
      setEditEnabled(false);
      $('preview').textContent = '';
      if (bPrev) bPrev.style.display = 'none';
      if (bNext) bNext.style.display = 'none';
      return;
    }

    if (navRow) navRow.style.display = '';
    if (hint) hint.innerHTML = '';
    const full = `${st.fornavn} ${st.efternavn}`.trim();
    // Move the full active student name into the nav row center (bigger), to free vertical space.
    if (pill) { pill.style.display = 'none'; }
    const centerSlot = navRow ? navRow.querySelector('.navSlot.center') : null;
    if (centerSlot) {
      centerSlot.innerHTML = `<div class="navActiveName">${escapeHtml(full)}</div>` + (st.klasse ? `<div class="navActiveMeta muted small">${escapeHtml(formatClassLabel(st.klasse))}</div>` : ``);
    }

    
    const firstNameById = (id) => {
      const s = studs.find(x => x.unilogin === id);
      return s ? (s.fornavn || '').trim() : '';
    };
// Prev/Next buttons
    const ids = getVisibleKElevIds();
    const idx = ids.indexOf(st.unilogin);
    if (bPrev) {
      const prevId = (idx > 0) ? ids[idx-1] : null;
      if (!prevId) {
        bPrev.style.display = 'none';
      } else {
        bPrev.style.display = '';
        const prevName = firstNameById(prevId) || '';
        bPrev.textContent = prevName ? `◀ ${prevName}` : '◀ Forrige';
      }
    }
    if (bNext) {
      const nextId = (idx !== -1 && idx < ids.length-1) ? ids[idx+1] : null;
      if (!nextId) {
        bNext.style.display = 'none';
      } else {
        bNext.style.display = '';
        const nextName = firstNameById(nextId) || '';
        bNext.textContent = nextName ? `${nextName} ▶` : 'Næste ▶';
      }
    }

    setEditEnabled(true);

    const t = getTextFor(st.unilogin);
    $('txtElevudv').value = t.elevudvikling || '';
    $('txtPraktisk').value = t.praktisk || '';
    $('txtKgruppe').value = t.kgruppe || '';
    $('autosavePill').textContent = t.lastSavedTs ? `Sidst gemt: ${formatTime(t.lastSavedTs)}` : '';

    updateEditRatios();
    maybeOpenEditSection();

    const hasInputUrl = !!(state.selectedUnilogin && state.studentInputUrls[state.selectedUnilogin]);
    const meta = t.studentInputMeta || null;
    const hasMeta = !!(meta && meta.filename);
    const metaIsPdf = !!(hasMeta && meta.filename.toLowerCase().endsWith('.pdf'));

    // Meta line: show filename, and if preview can't be restored after reload, explain briefly.
    if (hasMeta) {
      if (!hasInputUrl && metaIsPdf) {
        $('studentInputMeta').textContent = `PDF valgt tidligere: ${meta.filename} — vælg PDF igen for at vise den her.`;
      } else {
        $('studentInputMeta').textContent = `${meta.filename}`;
      }
    } else {
      $('studentInputMeta').textContent = '';
    }

    $('btnOpenStudentInput').textContent = 'Åbn i nyt vindue';
    $('btnOpenStudentInput').disabled = !hasInputUrl;
    $('btnClearStudentInput').disabled = !hasMeta;
    $('btnPickStudentPdf').textContent = hasMeta ? (hasInputUrl ? 'Skift PDF…' : 'Vælg PDF igen…') : 'Vælg PDF…';

    // PDF preview (session only)
    const pWrap = $('studentInputPreviewWrap');
    const pFrame = $('studentInputPreview');
    const isPdf = !!(hasInputUrl && metaIsPdf);
    if (pWrap && pFrame) {
      if (isPdf) {
        pWrap.style.display = '';
        pFrame.src = state.studentInputUrls[state.selectedUnilogin];
      } else {
        pWrap.style.display = 'none';
        pFrame.removeAttribute('src');
      }
    }
$('preview').textContent = buildStatement(st, getSettings());
  }

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

    const list = sortedStudents(studs).filter(st => {
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

      wrap.querySelectorAll('tr[data-u]').forEach(tr => {
        const u = tr.getAttribute('data-u');
        tr.querySelectorAll('[data-set]').forEach(btn => {
          btn.addEventListener('click', () => {
            const code = btn.getAttribute('data-set');
            marks[u] = marks[u] || {};
            marks[u].sang_variant = code;
            setMarks(KEYS.marksSang, marks);
            renderMarksTable();
          });
        });
        tr.querySelector('[data-clear]').addEventListener('click', () => {
          marks[u] = marks[u] || {};
          marks[u].sang_variant = "";
          setMarks(KEYS.marksSang, marks);
          renderMarksTable();
        });
      });
      return;
    }

    if (type === 'gym') {
      const marks = getMarks(KEYS.marksGym);
      const variants = Object.keys(SNIPPETS.gym);
      const roles = Object.keys(SNIPPETS.roller);

      $('marksLegend').innerHTML = `<b>Gym/roller</b>: vælg gym-variant + evt. ekstra roller.`;

      wrap.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Navn</th><th>Klasse</th>
              ${variants.map(v => `<th title="${escapeAttr(SNIPPETS.gym[v].title||v)}">${escapeHtml(v)}<br><span class="small muted">${escapeHtml(SNIPPETS.gym[v].title||'')}</span></th>`).join('')}
              ${roles.map(r => `<th title="${escapeAttr(SNIPPETS.roller[r].title||r)}">${escapeHtml(SNIPPETS.roller[r].title||r)}</th>`).join('')}
              <th>–</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(st => {
              const m = marks[st.unilogin] || {};
              const full = `${st.fornavn} ${st.efternavn}`.trim();
              return `<tr data-u="${escapeAttr(st.unilogin)}">
                <td>${escapeHtml(full)}</td>
                <td>${escapeHtml(st.klasse||'')}</td>
                ${variants.map(v => {
                  const active = (m.gym_variant === v);
                  return `<td><button type="button" class="markbtn ${active?'on':''}" data-gym="${v}" title="${escapeAttr(SNIPPETS.gym[v].title||v)}"><span class="check">✓</span></button></td>`;
                }).join('')}
                ${roles.map(r => {
                  const checked = !!m[r];
                  return `<td><input type="checkbox" data-role="${r}" ${checked?'checked':''} /></td>`;
                }).join('')}
                <td><button type="button" class="markbtn clear" data-clear="1" title="Ryd valg"><span class="check">×</span></button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>`;

      wrap.querySelectorAll('tr[data-u]').forEach(tr => {
        const u = tr.getAttribute('data-u');
        tr.querySelectorAll('[data-gym]').forEach(btn => {
          btn.addEventListener('click', () => {
            const code = btn.getAttribute('data-gym');
            marks[u] = marks[u] || {};
            marks[u].gym_variant = code;
            setMarks(KEYS.marksGym, marks);
            renderMarksTable();
          });
        });
        tr.querySelectorAll('input[data-role]').forEach(ch => {
          ch.addEventListener('change', () => {
            const r = ch.getAttribute('data-role');
            marks[u] = marks[u] || {};
            marks[u][r] = ch.checked;
            setMarks(KEYS.marksGym, marks);
          });
        });
        tr.querySelector('[data-clear]').addEventListener('click', () => {
          marks[u] = {};
          setMarks(KEYS.marksGym, marks);
          renderMarksTable();
        });
      });
      return;
    }

    if (type === 'elevraad') {
      const marks = getMarks(KEYS.marksElev);
      $('marksLegend').innerHTML = `<b>Elevråd</b>: markér elever der er repræsentanter.`;

      wrap.innerHTML = `
        <table>
          <thead>
            <tr><th>Navn</th><th>Klasse</th><th>Elevrådsrepræsentant</th><th>–</th></tr>
          </thead>
          <tbody>
            ${list.map(st => {
              const m = marks[st.unilogin] || {};
              const full = `${st.fornavn} ${st.efternavn}`.trim();
              const checked = !!m.elevraad;
              return `<tr data-u="${escapeAttr(st.unilogin)}">
                <td>${escapeHtml(full)}</td>
                <td>${escapeHtml(st.klasse||'')}</td>
                <td><input type="checkbox" data-er="1" ${checked?'checked':''} /></td>
                <td><button type="button" class="markbtn clear" data-clear="1" title="Ryd valg"><span class="check">×</span></button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>`;

      wrap.querySelectorAll('tr[data-u]').forEach(tr => {
        const u = tr.getAttribute('data-u');
        tr.querySelector('input[data-er]').addEventListener('change', (e) => {
          marks[u] = marks[u] || {};
          marks[u].elevraad = e.target.checked;
          setMarks(KEYS.marksElev, marks);
        });
        tr.querySelector('[data-clear]').addEventListener('click', () => {
          marks[u] = {};
          setMarks(KEYS.marksElev, marks);
          renderMarksTable();
        });
      });
      return;
    }
  }

  async function importMarksFile(e, kind) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const text = await readFileText(f);
    const parsed = parseCsv(text);

    const colUnilogin = parsed.headers.find(h => ['unilogin','unicbrugernavn','unicusername','unic'].includes(normalizeHeader(h)));
    if (!colUnilogin) { alert('CSV mangler kolonne: Unilogin'); return; }

    let imported = 0;
    if (kind === 'sang') {
      const colVar = parsed.headers.find(h => ['sangvariant','sang_variant','sang'].includes(normalizeHeader(h)));
      const map = getMarks(KEYS.marksSang);
      parsed.rows.forEach(r => {
        const u = (r[colUnilogin] || '').trim(); if (!u) return;
        map[u] = map[u] || {};
        map[u].sang_variant = (r[colVar] || '').trim();
        imported++;
      });
      setMarks(KEYS.marksSang, map);
    }
    if (kind === 'gym') {
      const colVar = parsed.headers.find(h => ['gymvariant','gym_variant','gym'].includes(normalizeHeader(h)));
      const roleCodes = Object.keys(SNIPPETS.roller);
      const map = getMarks(KEYS.marksGym);
      parsed.rows.forEach(r => {
        const u = (r[colUnilogin] || '').trim(); if (!u) return;
        map[u] = map[u] || {};
        map[u].gym_variant = (r[colVar] || '').trim();
        roleCodes.forEach(rc => {
          const col = parsed.headers.find(h => normalizeHeader(h) === normalizeHeader(rc));
          if (col) {
            const val = String(r[col]||'').trim();
            map[u][rc] = (val === '1' || normalizeName(val)==='true' || normalizeName(val)==='ja');
          }
        });
        imported++;
      });
      setMarks(KEYS.marksGym, map);
    }
    if (kind === 'elevraad') {
      const colER = parsed.headers.find(h => ['elevraad','elevråd'].includes(normalizeHeader(h)));
      const map = getMarks(KEYS.marksElev);
      parsed.rows.forEach(r => {
        const u = (r[colUnilogin] || '').trim(); if (!u) return;
        map[u] = map[u] || {};
        const val = String(r[colER]||'').trim();
        map[u].elevraad = (val === '1' || normalizeName(val)==='true' || normalizeName(val)==='ja');
        imported++;
      });
      setMarks(KEYS.marksElev, map);
    }

    $('importStatus').textContent = `✅ Importeret ${imported} rækker fra ${f.name}`;
    if (state.tab === 'set') renderMarksTable();
    if (state.tab === 'edit') renderEdit();
  }

  // ---------- events ----------
  function wireEvents() {
    $('tab-k').addEventListener('click', () => setTab('k'));
    // Redigér-tab er skjult når ingen elev er valgt, men vær robust hvis nogen alligevel klikker.
    $('tab-edit').addEventListener('click', () => setTab('edit'));
    $('tab-set').addEventListener('click', () => setTab('set'));

    const navEdit = (delta) => {
      // Guard: if buttons are disabled, ignore.
      const btn = delta < 0 ? $('btnPrevStudent') : $('btnNextStudent');
      if (btn && btn.disabled) return;
      const dir = delta < 0 ? 'prev' : 'next';
      gotoAdjacentStudent(dir);
    };
    const bPrev = $('btnPrevStudent');
    const bNext = $('btnNextStudent');
    if (bPrev) bPrev.addEventListener('click', () => navEdit(-1));
    if (bNext) bNext.addEventListener('click', () => navEdit(+1));

    $('btnReload').addEventListener('click', () => location.reload());

    $('btnReset').addEventListener('click', () => {
      if (!confirm('Ryd alle lokale data i denne browser?')) return;
      lsDelPrefix(LS_PREFIX);
      location.reload();
    });

    $('btnToggleForstander').addEventListener('click', () => {
      const s = getSettings();
      s.forstanderLocked = !s.forstanderLocked;
      setSettings(s);
      renderSettings();
    });
    $('forstanderName').addEventListener('input', () => {
      const s = getSettings();
      s.forstanderName = $('forstanderName').value;
      setSettings(s);
      renderStatus();
      if (state.tab === 'edit') renderEdit();
    });

    $('meInput').addEventListener('input', () => {
      const raw = $('meInput').value;
      const s = getSettings();
      s.me = raw;
      s.meResolved = resolveTeacherName(raw);
      setSettings(s);
      renderStatus();
      if (state.tab === 'k') renderKList();
      renderSettings();
    });
    $('schoolYearEnd').addEventListener('input', () => {
      const s = getSettings();
      s.schoolYearEnd = Number($('schoolYearEnd').value || s.schoolYearEnd);
      setSettings(s);
      renderSettings();
      if (state.tab === 'edit') renderEdit();
    });

    $('btnToggleSchoolText').addEventListener('click', () => {
      const t = getTemplates();
      t.schoolTextLocked = !t.schoolTextLocked;
      setTemplates(t);
      renderSettings();
    });
    $('btnRestoreSchoolText').addEventListener('click', () => {
      const t = getTemplates();
      t.schoolText = DEFAULT_SCHOOL_TEXT;
      setTemplates(t);
      renderSettings();
      if (state.tab === 'edit') renderEdit();
    });
    $('schoolText').addEventListener('input', () => {
      const t = getTemplates();
      t.schoolText = $('schoolText').value;
      setTemplates(t);
      if (state.tab === 'edit') renderEdit();
    });

    $('btnToggleTemplate').addEventListener('click', () => {
      const t = getTemplates();
      t.templateLocked = !t.templateLocked;
      setTemplates(t);
      renderSettings();
    });
    $('btnRestoreTemplate').addEventListener('click', () => {
      const t = getTemplates();
      t.template = DEFAULT_TEMPLATE;
      setTemplates(t);
      renderSettings();
      if (state.tab === 'edit') renderEdit();
    });
    $('templateText').addEventListener('input', () => {
      const t = getTemplates();
      t.template = $('templateText').value;
      setTemplates(t);
      if (state.tab === 'edit') renderEdit();
    });

    // Del / importér skabeloner (leder)
    if (document.getElementById('btnDownloadTemplates')) {
      $('btnDownloadTemplates').addEventListener('click', () => {
        const pkg = buildOverridePackage('templates');
        downloadJson('templates_override.json', pkg);
      });
      $('btnImportTemplates').addEventListener('click', () => $('fileImportTemplates').click());
      $('fileImportTemplates').addEventListener('change', async (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const txt = await f.text();
        const obj = JSON.parse(txt);
        importOverridePackage('templates', obj);
        renderSettings();
        if (state.tab === 'edit') renderEdit();
        e.target.value = '';
      });
    }

// --- Faglærer-tekster (snippets) ---
const sangInputs = ['S1','S2','S3'].flatMap(k => ['sangLabel_'+k, 'sangText_'+k]);
sangInputs.forEach(id => {
  if (!document.getElementById(id)) return;
  $(id).addEventListener('input', () => commitSnippetsFromUI('sang'));
});

const gymInputs = ['G1','G2','G3'].flatMap(k => ['gymLabel_'+k, 'gymText_'+k]);
gymInputs.forEach(id => {
  if (!document.getElementById(id)) return;
  $(id).addEventListener('input', () => commitSnippetsFromUI('gym'));
});

if (document.getElementById('elevraadText')) {
  $('elevraadText').addEventListener('input', () => commitSnippetsFromUI('elevraad'));
}

if (document.getElementById('btnDownloadSang')) {
  $('btnDownloadSang').addEventListener('click', () => {
    const pkg = buildOverridePackage('sang');
    downloadJson('snippets_sang_override.json', pkg);
  });
  $('btnImportSang').addEventListener('click', () => $('fileImportSang').click());
  $('fileImportSang').addEventListener('change', async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const txt = await f.text();
    const obj = JSON.parse(txt);
    importOverridePackage('sang', obj);
    renderSettings();
    e.target.value = '';
  });
  $('btnRestoreSang').addEventListener('click', () => {
    const o = getSnippetDraft();
    delete o.sang;
    setSnippetDraft(o);
    applySnippetOverrides();
    renderSettings();
  });
}

if (document.getElementById('btnDownloadGym')) {
  $('btnDownloadGym').addEventListener('click', () => {
    const pkg = buildOverridePackage('gym');
    downloadJson('snippets_gym_override.json', pkg);
  });
  $('btnImportGymSnippets').addEventListener('click', () => $('fileImportGymSnippets').click());
  $('fileImportGymSnippets').addEventListener('change', async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const txt = await f.text();
    const obj = JSON.parse(txt);
    importOverridePackage('gym', obj);
    renderSettings();
    e.target.value = '';
  });
  $('btnRestoreGymSnippets').addEventListener('click', () => {
    const o = getSnippetDraft();
    delete o.gym;
    setSnippetDraft(o);
    applySnippetOverrides();
    renderSettings();
  });

  $('btnAddRole').addEventListener('click', () => {
    const keyRaw = prompt('Kort nøgle til rollen (fx FANEBÆRER, REDSKAB, DGI):');
    if (!keyRaw) return;
    const key = keyRaw.trim().toUpperCase().replace(/\s+/g,'_');
    if (!key) return;
    const o = getSnippetDraft();
    if (!o.gym) o.gym = { variants: {}, roles: {} };
    if (!o.gym.roles) o.gym.roles = {};
    if (!o.gym.roles[key]) o.gym.roles[key] = { label: keyRaw.trim(), text: '' };
    setSnippetDraft(o);
    applySnippetOverrides();
    renderSettings();
  });

  const rolesList = document.getElementById('gymRolesList');
  if (rolesList) {
    rolesList.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-remove-role]');
      if (!btn) return;
      const key = btn.getAttribute('data-remove-role');
      if (!key) return;
      const o = getSnippetDraft();
      // Hvis rollen kun findes som override, så fjern den her; ellers gem "tom" override for at kunne skjule?
      // Minimal: fjern override-rollen + fjern fra defaults via et "tombstone"
      if (!o.gym) o.gym = {};
      if (!o.gym.roles) o.gym.roles = {};
      // Tombstone for at kunne fjerne en default-rolle:
      o.gym.roles[key] = { label: '', text: '' , _deleted: true };
      setSnippetDraft(o);
      applySnippetOverrides();
      renderSettings();
    });
  }
}

if (document.getElementById('btnDownloadElevraad')) {
  $('btnDownloadElevraad').addEventListener('click', () => {
    const pkg = buildOverridePackage('elevraad');
    downloadJson('snippets_elevraad_override.json', pkg);
  });
  $('btnImportElevraadSnippets').addEventListener('click', () => $('fileImportElevraadSnippets').click());
  $('fileImportElevraadSnippets').addEventListener('change', async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const txt = await f.text();
    const obj = JSON.parse(txt);
    importOverridePackage('elevraad', obj);
    renderSettings();
    e.target.value = '';
  });
  $('btnRestoreElevraad').addEventListener('click', () => {
    const o = getSnippetDraft();
    delete o.elevraad;
    setSnippetDraft(o);
    applySnippetOverrides();
    renderSettings();
  });
}

    $('studentsFile').addEventListener('change', async (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const text = await readFileText(f);
      const parsed = parseCsv(text);
      const map = mapStudentHeaders(parsed.headers);
      const required = ['fornavn','efternavn','klasse'];
      const ok = required.every(r => map[r]);
      if (!ok) { alert('Kunne ikke finde de nødvendige kolonner (fornavn, efternavn, klasse).'); return; }

      const students = parsed.rows.map(r => normalizeStudentRow(r, map));
      setStudents(students);

      renderSettings(); renderStatus();
      if (state.tab === 'k') renderKList();
      setTab('set');
    });

    $('marksType').addEventListener('change', () => renderMarksTable());
    $('marksSearch').addEventListener('input', () => renderMarksTable());

    $('btnExportMarks').addEventListener('click', () => {
      const type = $('marksType').value;
      const studs = getStudents();
      if (!studs.length) return;
      const sorted = sortedStudents(studs);

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
        const marks = getMarks(KEYS.marksElev);
        const rows = sorted.map(st => {
          const full = `${st.fornavn} ${st.efternavn}`.trim();
          const m = marks[st.unilogin] || {};
          return { Unilogin: st.unilogin, Navn: full, Elevraad: m.elevraad ? 1 : 0 };
        });
        downloadText('elevraad_marks.csv', toCsv(rows, ['Unilogin','Navn','Elevraad']));
      }
    });

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
        updateEditRatios();
      });
    });

    $('btnPickStudentPdf').addEventListener('click', () => {
      if (!state.selectedUnilogin) return;
      $('fileStudentInput').click();
    });

    $('btnOpenStudentInput').addEventListener('click', () => {
      const url = state.selectedUnilogin ? state.studentInputUrls[state.selectedUnilogin] : null;
      if (!url) return;
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win) alert('Popup blev blokeret af browseren. Tillad popups for siden og prøv igen.');
    });

    $('fileStudentInput').addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f || !state.selectedUnilogin) return;

      const isPdf = (f.type === 'application/pdf') || (f.name && f.name.toLowerCase().endsWith('.pdf'));
      if (!isPdf) {
        alert('Vælg venligst en PDF-fil.');
        $('fileStudentInput').value = '';
        return;
      }


      // Revoke previous object URL for this student (session only)
      const prevUrl = state.studentInputUrls[state.selectedUnilogin];
      if (prevUrl) { try { URL.revokeObjectURL(prevUrl); } catch(_) {} }

      const url = URL.createObjectURL(f);
      state.studentInputUrls[state.selectedUnilogin] = url;

      const obj = getTextFor(state.selectedUnilogin);
      obj.studentInputMeta = { filename: f.name, ts: Date.now(), mime: f.type || '' };
      setTextFor(state.selectedUnilogin, obj);

      renderEdit();
    });
    $('btnClearStudentInput').addEventListener('click', () => {
      if (!state.selectedUnilogin) return;
      const obj = getTextFor(state.selectedUnilogin);
      obj.studentInputMeta = null;
      setTextFor(state.selectedUnilogin, obj);

      const prevUrl = state.studentInputUrls[state.selectedUnilogin];
      if (prevUrl) { try { URL.revokeObjectURL(prevUrl); } catch(_) {} }
      delete state.studentInputUrls[state.selectedUnilogin];

      const pWrap = $('studentInputPreviewWrap');
      const pFrame = $('studentInputPreview');
      if (pWrap && pFrame) {
        pWrap.style.display = 'none';
        pFrame.removeAttribute('src');
      }

      $('fileStudentInput').value = '';
      renderEdit();
    });

    $('btnPrint').addEventListener('click', () => window.print());
  }

  async function init() {
    wireEvents();
    await loadRemoteOverrides();
    if (!localStorage.getItem(KEYS.settings)) setSettings(defaultSettings());
    if (!localStorage.getItem(KEYS.templates)) setTemplates(defaultTemplates());
    applySnippetOverrides();

    const s = getSettings();
    if (s.me && !s.meResolved) {
      s.meResolved = resolveTeacherName(s.me);
      setSettings(s);
    }

    setTab('set');
    renderAll();
  }

  init();
})();