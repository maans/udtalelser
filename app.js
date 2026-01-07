function resolveFullName(row) {
  const full = row.fullName || row.fuldtNavn || row.navn || row.kontaktlaerer || row.kontaktlaererNavn;
  if (full && String(full).trim()) return String(full).trim();
  const fn = row.fornavn || row.firstName || "";
  const en = row.efternavn || row.lastName || "";
  return `${fn} ${en}`.trim();
}

/* Udtalelser v1.0 – statisk GitHub Pages app (ingen libs)
   localStorage prefix: udt_
*/
(() => {
  'use strict';

  const PRINT_HEADER_LOGO_DATAURL = 'data:image/png;base64,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';
// Used for cache-busting verification in the UI.
  // If a browser still shows an older build id, it's caching an old app.js.
  const BUILD_ID = '';

  const LS_PREFIX = 'udt_';

  // ---------- Print logo override ----------
  // Priority:
  // 1) Local *test* logo (stored in localStorage) for quick preview before committing to repo
  // 2) Repo override file (/overrides/print_logo.png or .svg)
  // 3) Hardcoded fallback (PRINT_HEADER_LOGO_DATAURL)
  const PRINT_LOGO_LOCAL_KEY = LS_PREFIX + 'print_logo_local_v1';
  const PRINT_LOGO_REMOTE_CANDIDATES = [
    './overrides/print_logo.png',
    './overrides/print_logo.svg',
    '/overrides/print_logo.png',
    '/overrides/print_logo.svg'
  ];
  let PRINT_LOGO_REMOTE_CACHE = null; // dataURL or null



  /* ---------- Multi-tab single-writer lock ----------
     Goal: Only one tab can write to localStorage at a time.
     - First tab gets edit access.
     - Other tabs become view-only and see a banner.
     - They can click "Overtag redigering" to take over.
  */
  const TAB_ID_KEY = LS_PREFIX + 'tab_id';
  const LOCK_KEY   = LS_PREFIX + 'tab_lock';
  const LOCK_TTL_MS = 8000;      // lock considered stale after this
  const HEARTBEAT_MS = 2000;     // owner refresh interval

  const getTabId = () => {
    try{
      const fromSession = sessionStorage.getItem(TAB_ID_KEY);
      if (fromSession) return fromSession;
      const id = Math.random().toString(16).slice(2) + '-' + Date.now().toString(16);
      sessionStorage.setItem(TAB_ID_KEY, id);
      return id;
    }catch(_){
      return 'tab-' + Date.now();
    }
  };
  const TAB_ID = getTabId();

  let isWriterTab = false;
  let heartbeatTimer = null;

  const readLock = () => {
    try{
      const raw = localStorage.getItem(LOCK_KEY);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || typeof obj !== 'object') return null;
      return { id: String(obj.id||''), ts: Number(obj.ts||0) };
    }catch(_){ return null; }
  };

  const writeLock = (force = false) => {
    // force=true used by "Overtag redigering"
    try{
      const current = readLock();
      const stale = !current || (Date.now() - current.ts) > LOCK_TTL_MS;
      if (force || !current || stale || current.id === TAB_ID){
        localStorage.setItem(LOCK_KEY, JSON.stringify({ id: TAB_ID, ts: Date.now() }));
        return true;
      }
    }catch(_){}
    return false;
  };

  // Patch localStorage writes so non-writer tabs cannot persist changes.
  const _lsSetItem = Storage.prototype.setItem;
  const _lsRemoveItem = Storage.prototype.removeItem;
  const _lsClear = Storage.prototype.clear;

  Storage.prototype.setItem = function(k, v){
    if (!isWriterTab && String(k) !== LOCK_KEY) return;
    return _lsSetItem.call(this, k, v);
  };
  Storage.prototype.removeItem = function(k){
    if (!isWriterTab && String(k) !== LOCK_KEY) return;
    return _lsRemoveItem.call(this, k);
  };
  Storage.prototype.clear = function(){
    if (!isWriterTab) return;
    return _lsClear.call(this);
  };

  const ensureLockBanner = () => {
    let el = document.getElementById('udtTabLockBanner');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'udtTabLockBanner';
    el.className = 'udt-lock-banner no-print';
    el.innerHTML = `
      <div class="udt-lock-text">
        <strong>Appen er åben i en anden fane</strong>
        <span class="udt-lock-sub">Denne fane er i visning-tilstand.</span>
      </div>
      <button type="button" class="btn small" id="udtTakeoverBtn" title="Overtag redigering (hvis den anden fane er lukket eller du vil overtage)">
        Overtag redigering
      </button>
    `.trim();

    const header = document.querySelector('header.topbar');
    if (header && header.parentNode){
      header.parentNode.insertBefore(el, header.nextSibling);
    }else{
      document.body.insertBefore(el, document.body.firstChild);
    }

    el.querySelector('#udtTakeoverBtn')?.addEventListener('click', () => {
      // Take over lock, then sync latest state from localStorage before enabling edits
      writeLock(true);
      evaluateTabLock(true);
      try { syncFromLocalStorageAndRender(); } catch(_) {}
    });

    return el;
  };

  const setControlsDisabled = (disabled) => {
    // Disable form controls in view-only tabs to avoid "false edits"
    const ctrls = document.querySelectorAll('main.app input, main.app textarea, main.app select');
    ctrls.forEach(ctrl => {
      const prev = ctrl.getAttribute('data-udt-prev-disabled');
      if (disabled){
        if (prev === null) ctrl.setAttribute('data-udt-prev-disabled', ctrl.disabled ? '1' : '0');
        ctrl.disabled = true;
      }else{
        if (prev !== null){
          ctrl.disabled = (prev === '1');
          ctrl.removeAttribute('data-udt-prev-disabled');
        }
      }
    });
  };

  const applyWriterState = (writer) => {
    const was = isWriterTab;
    isWriterTab = !!writer;

    // Banner
    const banner = ensureLockBanner();
    banner.style.display = isWriterTab ? 'none' : 'flex';

    // Disable / enable controls
    document.body.classList.toggle('udt-readonly', !isWriterTab);
    setControlsDisabled(!isWriterTab);

    // Heartbeat
    if (isWriterTab){
      if (!heartbeatTimer){
        heartbeatTimer = setInterval(() => {
          try{ localStorage.setItem(LOCK_KEY, JSON.stringify({ id: TAB_ID, ts: Date.now() })); }catch(_){}
        }, HEARTBEAT_MS);
      }
    }else{
      if (heartbeatTimer){
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
    }

    // If we just became writer, also refresh to re-enable UI states correctly
    if (!was && isWriterTab){
      try{ setTimeout(() => setControlsDisabled(false), 0); }catch(_){}
    }
  };


  const syncFromLocalStorageAndRender = () => {
    // Ensure any derived/cached structures are rebuilt from latest localStorage,
    // then re-render UI. This avoids stale in-memory state after "Overtag redigering".
    try { rebuildAliasMapFromStudents(getStudents()); } catch(_) {}
    try { renderAll(); } catch(_) {}
  };

  const evaluateTabLock = (fromTakeover = false) => {
    const lock = readLock();
    const stale = !lock || (Date.now() - lock.ts) > LOCK_TTL_MS;

    if (!lock || stale || lock.id === TAB_ID){
      // Acquire / refresh
      const ok = writeLock(fromTakeover);
      applyWriterState(!!ok);
      return;
    }
    // Someone else owns it
    applyWriterState(false);
  };

  // Listen for other tabs: lock changes + data changes
  window.addEventListener('storage', (e) => {
    if (!e || !e.key) return;
    const k = String(e.key);

    if (k === LOCK_KEY){
      evaluateTabLock(false);
      return;
    }

    // Keep view-only tabs in sync with latest data written by the writer tab
    if (!isWriterTab && k.startsWith(LS_PREFIX)){
      try { syncFromLocalStorageAndRender(); } catch(_) {}
    }
  });
// Acquire lock ASAP (before first render)
  evaluateTabLock(false);

  // Release lock on close (best-effort)
  window.addEventListener('beforeunload', () => {
    try{
      const lock = readLock();
      if (lock && lock.id === TAB_ID) localStorage.removeItem(LOCK_KEY);
    }catch(_){}
  });

  /* ---------- end tab lock ---------- */

  const KEYS = {
    settings: LS_PREFIX + 'settings',
    students:  LS_PREFIX + 'students',
    templates: LS_PREFIX + 'templates',
    templatesImported: LS_PREFIX + 'templates_imported',
    marksSang: LS_PREFIX + 'marks_sang',
    marksGym:  LS_PREFIX + 'marks_gym',
    marksElev: LS_PREFIX + 'marks_elevraad',
	  marksType: LS_PREFIX + 'marks_type',
    textPrefix: LS_PREFIX + 'text_' // + unilogin
  };

  // Post-import hint used to avoid landing on an empty K-elever view when a backup
  // doesn't contain a chosen K-lærer.
  // Stored as JSON: { showInfo: true, suggestedIni?: "AB" }
  const KEY_POST_IMPORT_TEACHER_HINT = LS_PREFIX + 'post_import_teacher_hint';

	// Backwards-compat alias used by some older event handlers
	// Backwards-compat alias (older builds referenced KEY_MARKS_TYPE directly)
	const KEY_MARKS_TYPE = KEYS.marksType;

  const TEACHER_ALIAS_MAP = {}; // v1.0: no hardcoded teacher directory (persondata-safe)


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
    "text_m": "{{FORNAVN}} har deltaget meget engageret i fællesgymnastik og har vist stor lyst til at udfordre sig selv. {(HAN_HUN_CAP)} har bidraget positivt til holdets fællesskab.",
    "text_k": "{{FORNAVN}} har deltaget meget engageret i fællesgymnastik og har vist stor lyst til at udfordre sig selv. {(HAN_HUN_CAP)} har bidraget positivt til holdets fællesskab."
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
    "text_m": "{{FORNAVN}} har været en del af redskabsholdet, som {{HAN_HUN}} frivilligt har meldt sig til. {(HAN_HUN_CAP)} har ydet en stor indsats og taget ansvar.",
    "text_k": "{{FORNAVN}} har været en del af redskabsholdet, som {{HAN_HUN}} frivilligt har meldt sig til. {(HAN_HUN_CAP)} har ydet en stor indsats og taget ansvar."
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

  // Backwards compatibility: some code paths still reference DEFAULT_ALIAS_MAP.
  // Keep it as an alias of TEACHER_ALIAS_MAP.
  const DEFAULT_ALIAS_MAP = {}; // v1.0: no defaults


    const SNIPPETS_DEFAULT = JSON.parse(JSON.stringify(SNIPPETS));

const DEFAULT_SCHOOL_TEXT = `På Himmerlands Ungdomsskole arbejder vi med både faglighed, fællesskab og personlig udvikling.
Udtalelsen er skrevet med udgangspunkt i elevens hverdag og deltagelse gennem skoleåret.`;

  const DEFAULT_TEMPLATE = "Udtalelse vedrørende {{ELEV_FULDE_NAVN}}\n\n{{ELEV_FORNAVN}} {{ELEV_EFTERNAVN}} har været elev på Himmerlands Ungdomsskole i perioden fra {{PERIODE_FRA}} til {{PERIODE_TIL}} i {{ELEV_KLASSE}}.\n\nHimmerlands Ungdomsskole er en traditionsrig efterskole, som prioriterer fællesskabet og faglig fordybelse højt. Elevernes hverdag er præget af frie rammer og mange muligheder. Vi møder eleverne med tillid, positive forventninger og faglige udfordringer. I løbet af et efterskoleår på Himmerlands Ungdomsskole er oplevelserne mange og udfordringerne ligeså. Det gælder i hverdagens almindelige undervisning, som fordeler sig over boglige fag, fællesfag og profilfag. Det gælder også alle de dage, hvor hverdagen ændres til fordel for temauger, studieture mm. \n\n{{ELEV_UDVIKLING_AFSNIT}}\n{{ELEVRAAD_AFSNIT}}\n{{ROLLE_AFSNIT}}\n\nSom en del af et efterskoleår på Himmerlands Ungdomsskole deltager eleverne ugentligt i fællessang og fællesgymnastik. Begge fag udgør en del af efterskolelivet, hvor eleverne oplever nye sider af sig selv, flytter grænser og oplever, at deres bidrag til fællesskabet har betydning. I løbet af året optræder eleverne med fælleskor og gymnastikopvisninger.\n{{SANG_GYM_AFSNIT}}\n\nPå en efterskole er der mange praktiske opgaver. {{PRAKTISK_AFSNIT}}\n{{ELEV_FORNAVN}} har på Himmerlands Ungdomsskole været en del af en kontaktgruppe på {{KONTAKTGRUPPE_ANTAL}} elever. I kontaktgruppen kender vi {{HAM_HENDE}} som {{KONTAKTGRUPPE_BESKRIVELSE}}.\n\nVi har været rigtig glade for at have {{ELEV_FORNAVN}} som elev på skolen og ønsker {{HAM_HENDE}} held og lykke fremover.\n\n\n\n{{KONTAKTLÆRER_1_NAVN}} & {{KONTAKTLÆRER_2_NAVN}}     {{FORSTANDER_NAVN}}\nKontaktlærere                                                           Forstander\n";

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

  // Compatibility alias used by some UI handlers
  function saveLS(key, value) { return lsSet(key, value); }

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

// Meta flags: used to avoid overwriting deliberate local edits when refreshing overrides.
// If a user edits templates/snippets locally, we should not auto-overwrite on tab changes.
const META_KEYS = {
  templatesDirty: 'udt_templatesDirty_v1',
  snippetsDirty: 'udt_snippetsDirty_v1',
  remoteOverridesFetchedAt: 'udt_remoteOverridesFetchedAt_v1',
};

function isTemplatesDirty(){ return !!lsGet(META_KEYS.templatesDirty, false); }
function setTemplatesDirty(v){ lsSet(META_KEYS.templatesDirty, !!v); }
function hasTemplatesDirtyMeta(){ try { return localStorage.getItem(META_KEYS.templatesDirty) !== null; } catch(_) { return true; } }
function isSnippetsDirty(){ return !!lsGet(META_KEYS.snippetsDirty, false); }
function setSnippetsDirty(v){ lsSet(META_KEYS.snippetsDirty, !!v); }

function stampOverridesFetched(){ lsSet(META_KEYS.remoteOverridesFetchedAt, Date.now()); }
function overridesFetchedAt(){ return lsGet(META_KEYS.remoteOverridesFetchedAt, 0) || 0; }


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

// Convert JSON-escaped newlines (\n) into real newlines so templates render correctly.
// This makes overrides robust whether they store real newlines or \n sequences.
function normalizeOverrideText(s){
  if (typeof s !== 'string') return s;
  // If the string contains literal "\n", turn it into a newline.
  // Also handle "\r\n" -> "\n" -> newline.
  return s
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n");
}
function normalizeOverrideDeep(obj){
  if (!obj) return obj;
  if (typeof obj === 'string') return normalizeOverrideText(obj);
  if (Array.isArray(obj)) return obj.map(normalizeOverrideDeep);
  if (typeof obj === 'object') {
    const out = {};
    Object.keys(obj).forEach(k => { out[k] = normalizeOverrideDeep(obj[k]); });
    return out;
  }
  return obj;
}


async function loadRemoteOverrides(){
  const [sang, gym, elevraad, templates] = await Promise.all([
    fetchJsonIfExists(REMOTE_OVERRIDE_FILES.sang),
    fetchJsonIfExists(REMOTE_OVERRIDE_FILES.gym),
    fetchJsonIfExists(REMOTE_OVERRIDE_FILES.elevraad),
    fetchJsonIfExists(REMOTE_OVERRIDE_FILES.templates),
  ]);
  // NOTE: templates_override.json is a packed object: { templates: { schoolText, template, ... } }
  // We want the inner "templates" object to be the merge target.
  const tplPack = unwrapOverridePack(templates);
  const tplObj = (tplPack && tplPack.templates) ? tplPack.templates : tplPack;
  const tplObjNorm = normalizeOverrideDeep(tplObj);

  REMOTE_OVERRIDES = {
    sang: normalizeOverrideDeep(unwrapOverridePack(sang)),
    gym: normalizeOverrideDeep(unwrapOverridePack(gym)),
    elevraad: normalizeOverrideDeep(unwrapOverridePack(elevraad)),
    templates: tplObjNorm,
  };
  stampOverridesFetched();
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

function clearLocalSnippetScope(scope){
  const d = getSnippetDraft();
  const i = getSnippetImported();
  if (scope && typeof scope === 'string') {
    delete d[scope];
    delete i[scope];
  }
  setSnippetDraft(d);
  setSnippetImported(i);
  // If nothing local remains, allow auto-refresh again
  if (Object.keys(d).length === 0 && Object.keys(i).length === 0) setSnippetsDirty(false);
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
    // --- Roller (separat scope)
    const roller = pack.roller && (pack.roller.roles ? pack.roller : (pack.roller.roller ? pack.roller.roller : null));
    if (roller && roller.roles) {
      Object.keys(roller.roles).forEach(k => {
        const it = roller.roles[k] || {};
        if (!SNIPPETS.roller[k]) SNIPPETS.roller[k] = { title: k, text_m: '', text_k: '' };
        // Rollenavne er faste, men vi accepterer tekstfelterne.
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
  // Some browsers need a short delay before revoking
  setTimeout(()=>{ try{ URL.revokeObjectURL(url); }catch(e){} }, 250);
}

function exportLocalBackup() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k || !k.startsWith(LS_PREFIX)) continue;
    data[k] = localStorage.getItem(k);
  }
  if (!Object.keys(data).length) {
    alert('Der var ingen lokale data at tage backup af endnu.');
    return;
  }
  // Filename: "<INITIALER>_UdtalelsesBackup.json" (so backups are easy to share across K-lærere)
  let ini = '';
  try {
    const s = getSettings();
    const raw = ((s.me || s.meResolved || '') + '').trim();
    ini = toInitials(raw);
  } catch(_) {}
  const fn = `${(ini || 'XX')}_UdtalelsesBackup.json`;
  downloadJson(fn, {
    schema: 'elevudtalelser_backup_v1',
    prefix: LS_PREFIX,
    createdAt: new Date().toISOString(),
    data
  });
}

function getMyKStudents() {
  const s = getSettings();
  const studs = getStudents();
  const meIni = toInitials((s.me || '') + '');
  if (!studs.length || !meIni) return [];
  return sortedStudents(studs)
    .filter(st => toInitials(st.kontaktlaerer1_ini) === meIni || toInitials(st.kontaktlaerer2_ini) === meIni);
}


// --- Print: force single-student print to always fit on ONE A4 page by scaling down.
// Strategy: compute available content height (A4 minus margins = 261mm) in px,
// compare to rendered preview height at scale=1, and set CSS var --printScale.
function applyOnePagePrintScale() {
  const preview = document.getElementById('preview');
  if (!preview) return;
  // Reset
  document.documentElement.style.setProperty('--printScale', '1');
  // Only relevant when preview has content
  const txt = (preview.textContent || '').trim();

  // Title extraction (first line) — no regex
  const rawPrint = String(txt || '').replaceAll('\r', '');
  const nl = rawPrint.indexOf('\n');
  let titleLine = '';
  let bodyText = rawPrint;
  if (nl >= 0) {
    titleLine = rawPrint.slice(0, nl).trim();
    bodyText = rawPrint.slice(nl + 1);
    while (bodyText.startsWith('\n')) bodyText = bodyText.slice(1);
  } else {
    titleLine = rawPrint.trim();
    bodyText = '';
  }
  if (!txt) return;

  // Create a mm-to-px probe (hidden)
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed; left:-9999px; top:-9999px; width:1mm; height:261mm; visibility:hidden; pointer-events:none;';
  document.body.appendChild(probe);
  const availPx = probe.getBoundingClientRect().height;
  probe.remove();

  // Measure needed height at scale=1
  // Use scrollHeight so we capture full content.
  const neededPx = preview.scrollHeight;
  if (!availPx || !neededPx) return;

  if (neededPx > availPx) {
    const s = Math.max(0.10, Math.min(1, availPx / neededPx));
    document.documentElement.style.setProperty('--printScale', String(s));
  }
}



// --- Print logo helpers ---
function getLocalPrintLogoDataUrl() {
  try { return localStorage.getItem(PRINT_LOGO_LOCAL_KEY) || ''; } catch { return ''; }
}
function setLocalPrintLogoDataUrl(dataUrl) {
  try { localStorage.setItem(PRINT_LOGO_LOCAL_KEY, String(dataUrl || '')); } catch {}
}
function clearLocalPrintLogoDataUrl() {
  try { localStorage.removeItem(PRINT_LOGO_LOCAL_KEY); } catch {}
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    try {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result || ''));
      fr.onerror = () => reject(fr.error || new Error('FileReader fejl'));
      fr.readAsDataURL(blob);
    } catch (e) { reject(e); }
  });
}

async function tryFetchAsDataUrl(url) {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : ''));
  const blob = await r.blob();
  return await blobToDataUrl(blob);
}

async function resolvePrintLogoDataUrl() {
  const local = getLocalPrintLogoDataUrl();
  if (local) return local;

  if (PRINT_LOGO_REMOTE_CACHE) return PRINT_LOGO_REMOTE_CACHE;

  for (const url of PRINT_LOGO_REMOTE_CANDIDATES) {
    try {
      const dataUrl = await tryFetchAsDataUrl(url);
      if (dataUrl) {
        PRINT_LOGO_REMOTE_CACHE = dataUrl;
        return dataUrl;
      }
    } catch (_) {}
  }
  return PRINT_HEADER_LOGO_DATAURL;
}

function syncPrintLogoTestUI() {
  const img = document.getElementById('printLogoPreview');
  const status = document.getElementById('printLogoStatus');
  const btnPick = document.getElementById('btnPickPrintLogo');
  const btnClear = document.getElementById('btnClearPrintLogo');
  if (!img || !status || !btnClear || !btnPick) return;

  const local = getLocalPrintLogoDataUrl();
  if (local) {
    img.src = local;
    img.style.display = 'block';
    status.textContent = 'Test-logo er aktivt (kun i denne browser).';
    btnPick.style.display = 'none';
    btnClear.style.display = '';
    btnClear.disabled = false;
  } else {
    img.removeAttribute('src');
    img.style.display = 'none';
    status.textContent = 'Intet test-logo valgt.';
    btnPick.style.display = '';
    btnClear.style.display = 'none';
    btnClear.disabled = true;
  }
}


async function openPrintWindowForStudents(students, settings, title) {
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));

  const opts = arguments.length > 3 ? (arguments[3] || {}) : {};
  const list = opts.preserveOrder ? (Array.isArray(students) ? students : []) : sortedStudents(Array.isArray(students) ? students : []);

  // Header date (month + year) should match 'Dato måned/år (auto)' from Indstillinger → Periode
  let headerDateText = '';
  try {
    if (typeof computePeriod === 'function') {
      const p = computePeriod(settings && settings.schoolYearEnd);
      headerDateText = (p && p.dateMonthYear) ? String(p.dateMonthYear) : '';
    }
  } catch(e) {}
  if (!headerDateText) {
    const _d = new Date();
    const _monthYear = _d.toLocaleDateString('da-DK', { month: 'long', year: 'numeric' });
    headerDateText = _monthYear ? (_monthYear.charAt(0).toUpperCase() + _monthYear.slice(1)) : '';
  }

  const logoSrc = await resolvePrintLogoDataUrl();
  const pagesHtml = list.map(st => {
    const txt = buildStatement(st, settings);
    // Title extraction (first line) — no regex
    const rawPrint = String(txt || '').replaceAll('\r', '');
    const nl = rawPrint.indexOf('\n');
    let titleLine = '';
    let bodyText = rawPrint;
    if (nl >= 0) {
      titleLine = rawPrint.slice(0, nl).trim();
      bodyText = rawPrint.slice(nl + 1);
      while (bodyText.startsWith('\n')) bodyText = bodyText.slice(1);
    } else {
      titleLine = rawPrint.trim();
      bodyText = '';
    }
    return `
      <div class="page">
        <div class="content">
          <div class="printHeaderTop"><div class="printHeaderDate">${escapeHtml(headerDateText)}</div></div>
          <div class="printHeaderLogo"><img src="${logoSrc}" alt="Himmerlands Ungdomsskole" /></div>
          <div class="printTitle">${escapeHtml(titleLine)}</div>
          <pre class="statement">${escapeHtml(bodyText)}</pre>
        </div>
      </div>`;
  }).join('');

  const docTitle = escapeHtml(title || 'Print');

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${docTitle}</title>
  <style>
    @page { size: A4; margin: 12mm 14mm; }
    html, body { margin: 0; padding: 0; background: #fff; }
    .page{
      page-break-after: always;
    }
    .content{ width: 100%; }
    .statement {
      margin: 0;
      white-space: pre-wrap;
      font-family: Arial, sans-serif;
      font-size: 10.5pt;
      font-size: 10.5pt;
      line-height: 1.45;
      transform: none;
      transform-origin: top left;
    }
  
    /* iOS/iPadOS Safari: disable scaling transforms to avoid alternating blank pages */
    @supports (-webkit-touch-callout: none) {
      .page { --s: 1 !important; }
      .statement { transform: none !important; width: auto !important; }
    }

    /* Header logo */
    .printHeader{
      display:flex;
      justify-content:center;
      align-items:center;
      margin: 0mm 0 6mm 0;
    }
    .printTitle{
      text-align: center;
      font-family: Arial, sans-serif;
      font-size: 12pt;
      font-weight: 700;
      margin: 0 0 6mm 0;
    }

    .printHeader img{
      height: 22mm;
      width: auto;
      display:block;
    }


    /* Header: date (top-right) + logo (center) */
    .printHeaderTop{
      display:flex;
      justify-content:flex-end;
      align-items:flex-start;
      margin: 2mm 0 0 0;
      font-size: 10pt;
      color: #222;
    }
    .printHeaderDate{ white-space: nowrap; }
    .printHeaderLogo{
      display:flex;
      justify-content:center;
      align-items:center;
      margin: 8mm 0 8mm 0;
    }
    .printHeaderLogo img{
      height: 22mm;
      width: auto;
      display:block;
    }


    .page:last-child{
      break-after: auto;
      page-break-after: auto;
    }
    .content{
      height: 100%;
      overflow: hidden;
      position: relative;
    }
    pre.statement{
      white-space: pre-wrap;
      margin: 0;
      overflow: hidden;
    }

</style>
</head>
<body>
${pagesHtml}
<script>
(function(){
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  window.addEventListener('load', () => {
    // Give fonts/images a moment, then open print dialog.
    setTimeout(() => { try { window.focus(); window.print(); } catch(e) {} }, 250);
  });
})();
</script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) {
    alert('Kunne ikke åbne print-vindue (pop-up blokeret).');
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}

async function printAllKStudents() {
  // Keep overrides fresh for printing unless the user is actively editing templates.
  try {
    await loadRemoteOverrides();
    applyTemplatesFromOverridesToLocal({ preserveLocks: true });
  } catch (_) {}

  const studs = getStudents();
  const kGroups = buildKGroups(studs);

  // K-mode: print "mine" K-elever
  // ALL-mode: print den aktive K-gruppe (som UI'et viser)
  const isAll = state.viewMode === 'ALL';
  const list = isAll
    ? ((kGroups[state.kGroupIndex] && kGroups[state.kGroupIndex].students) ? kGroups[state.kGroupIndex].students.slice() : [])
    : getMyKStudents();

  if (!list.length) {
    alert(isAll
      ? 'Der er ingen elever i denne K-gruppe at printe.'
      : 'Der er ingen K-elever at printe (tjek elevliste og initialer).'
    );
    return;
  }

  const title = isAll ? 'Udtalelser v1.0 – print K-gruppe' : 'Udtalelser v1.0 – print K-elever';
  const sorted = sortedStudents(list);
  await openPrintWindowForStudents(sorted, getSettings(), title);
}

async function printAllKGroups() {
  // Keep overrides fresh for printing unless the user is actively editing templates.
  try {
    await loadRemoteOverrides();
    applyTemplatesFromOverridesToLocal({ preserveLocks: true });
  } catch(_) {}

  const studs = getStudents();
  if (!studs.length) {
    alert('Der er ingen elevliste indlæst endnu.');
    return;
  }

  const kGroups = buildKGroups(studs);

// Sortering i 2 niveauer:
// 1) K-grupper efter K-lærer1 (initialer) – derefter K-lærer2 – derefter nøgle
// 2) Elever i hver gruppe alfabetisk efter fornavn (da-DK)
const coll = new Intl.Collator('da', { sensitivity: 'base' });

kGroups.sort((g1, g2) => {
  const a0 = (g1.students && g1.students[0]) ? g1.students[0] : {};
  const b0 = (g2.students && g2.students[0]) ? g2.students[0] : {};
  const aK1 = toInitials(a0.kontaktlaerer1_ini || '');
  const bK1 = toInitials(b0.kontaktlaerer1_ini || '');
  const c1 = coll.compare(aK1, bK1);
  if (c1) return c1;

  const aK2 = toInitials(a0.kontaktlaerer2_ini || '');
  const bK2 = toInitials(b0.kontaktlaerer2_ini || '');
  const c2 = coll.compare(aK2, bK2);
  if (c2) return c2;

  return coll.compare(String(g1.key || ''), String(g2.key || ''));
});

for (const g of kGroups) {
  (g.students || []).sort((x, y) => {
    const c = coll.compare((x.fornavn || '').trim(), (y.fornavn || '').trim());
    if (c) return c;
    // tie-break: efternavn
    return coll.compare((x.efternavn || '').trim(), (y.efternavn || '').trim());
  });
}

const all = [];

// Flatten i gruppe-rækkefølge (stabilt og forudsigeligt)
kGroups.forEach(g => {
  (g.students || []).forEach(s => all.push(s));
});

  if (!all.length) {
    alert('Der var ingen elever i K-grupperne at printe.');
    return;
  }

  const title = 'Udtalelser v1.0 – print alle K-grupper';
  // Brug samme printmotor som enkelt-elev / k-gruppe, så header (logo + dato) altid kommer med.
  // preserveOrder=true så vi ikke mister gruppe-ordenen ved intern sortering.
  await openPrintWindowForStudents(all, getSettings(), title, { preserveOrder: true });
}

async function printAllStudents() {
  // Keep overrides fresh for printing unless the user is actively editing templates.
  try {
    await loadRemoteOverrides();
    applyTemplatesFromOverridesToLocal({ preserveLocks: true });
  } catch(_) {}

  const studs = getStudents();
  if (!studs.length) {
    alert('Der er ingen elevliste indlæst endnu.');
    return;
  }

  const coll = new Intl.Collator('da', { sensitivity: 'base' });
  const all = studs.slice().sort((a, b) => {
    const c = coll.compare((a.fornavn || '').trim(), (b.fornavn || '').trim());
    if (c) return c;
    return coll.compare((a.efternavn || '').trim(), (b.efternavn || '').trim());
  });

  const title = 'Udtalelser v1.0 – print alle elever';
  await openPrintWindowForStudents(all, getSettings(), title, { preserveOrder: true });
}



function importLocalBackup(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const obj = JSON.parse(String(reader.result || '{}'));
      if (!obj || typeof obj !== 'object' || !obj.data) throw new Error('Ugyldig backupfil.');
      const prefix = obj.prefix || LS_PREFIX;

      // Helper: try to extract teacher initials from filename (AB-backup.json, EB_backup_2026.json, ...)
      const guessIniFromFilename = (name) => {
        const base = String(name || '').trim();
        if (!base) return '';
        const m = base.match(/^\s*([A-Za-zÆØÅæøå]{1,4})[\-_]/);
        return m ? String(m[1] || '').toUpperCase() : '';
      };

      // SAFE IMPORT (merge) so you can import colleagues' backups without losing your own work.
      // Policy:
      // - We never delete existing data.
      // - For text keys (udt_text_<unilogin>): merge per field (only fill blanks).
      // - For non-text keys: import only if missing locally.
      const textKeyPrefix = prefix + 'text_';
      let mergedText = 0, addedText = 0, skippedText = 0;
      let addedOther = 0, skippedOther = 0;

      // Special-case: "aktiv K-lærer" is allowed to be restored from backup if it is missing locally.
      // We still avoid clobbering other colleague settings.
      let restoredTeacher = false;
      const tryRestoreTeacherFromIncomingSettings = (incomingRaw) => {
        try {
          const inc = JSON.parse(String(incomingRaw || '{}')) || {};
          const incomingMe = ((inc.me || inc.activeTeacher || '') + '').trim();
          if (!incomingMe) return false;
          const cur = getSettings();
          const curMe = ((cur.me || '') + '').trim();
          if (curMe) return false; // don't override an already chosen teacher
          cur.me = incomingMe.toUpperCase();
          cur.meResolved = cur.me;
          cur.meResolvedConfirmed = cur.me;
          if ((inc.meFullName || '') && !cur.meFullName) cur.meFullName = String(inc.meFullName || '').trim();
          setSettings(cur);
          return true;
        } catch (_) {
          return false;
        }
      };

      // Clear any previous post-import hint before we start.
      try { localStorage.removeItem(KEY_POST_IMPORT_TEACHER_HINT); } catch (_) {}

      Object.entries(obj.data).forEach(([k, v]) => {
        if (typeof k !== 'string' || !k.startsWith(prefix)) return;
        const incomingRaw = String(v ?? '');

        // Settings: keep safe-by-default, but allow restoring missing K-lærer identity.
        if (k === KEYS.settings) {
          if (tryRestoreTeacherFromIncomingSettings(incomingRaw)) {
            restoredTeacher = true;
          }
          skippedOther++;
          return;
        }

        if (k.startsWith(textKeyPrefix)) {
          const existingRaw = localStorage.getItem(k);
          if (!existingRaw) {
            localStorage.setItem(k, incomingRaw);
            addedText++;
            return;
          }
          // Merge JSON fields if possible
          try {
            const ex = JSON.parse(existingRaw || '{}') || {};
            const inc = JSON.parse(incomingRaw || '{}') || {};
            const fields = ['elevudvikling','praktisk','kgruppe'];
            let changed = false;
            fields.forEach(f => {
              const exVal = ((ex[f] ?? '') + '').trim();
              const incVal = ((inc[f] ?? '') + '').trim();
              if (!exVal && incVal) { ex[f] = inc[f]; changed = true; }
            });
            // If we had no local lastEditedBy, keep incoming for visibility.
            if (!((ex.lastEditedBy || '') + '').trim() && ((inc.lastEditedBy || '') + '').trim()) {
              ex.lastEditedBy = inc.lastEditedBy;
              changed = true;
            }
            if (changed) {
              localStorage.setItem(k, JSON.stringify(ex));
              mergedText++;
            } else {
              skippedText++;
            }
          } catch (_) {
            // Fallback: keep existing (safe)
            skippedText++;
          }
          return;
        }

        // Non-text keys: import only if missing, to avoid clobbering your setup.
        if (localStorage.getItem(k) == null) {
          localStorage.setItem(k, incomingRaw);
          addedOther++;
        } else {
          skippedOther++;
        }
      });

      alert(
        `Backup importeret (sikkert)\n\n` +
        `Tekster: +${addedText} nye, +${mergedText} udfyldt (tomt→fyldt), ${skippedText} uændret\n` +
        `Andet: +${addedOther} nye nøgler, ${skippedOther} uændret\n\n` +
        `Tip: Import af kollegers backup udfylder primært tomme felter – det overskriver ikke din tekst.`
      );

      // Post-import navigation rules:
      // - If we have an active teacher after import: go directly to K-elever (normal/fast case)
      // - Otherwise: go to Indstillinger → Generelt and show a small info text.
      //   If the filename looks like "AB-backup.json", prefill "AB" and open the dropdown.
      try {
        const meNow = ((getSettings().me || '') + '').trim();
        if (!meNow) {
          const suggested = guessIniFromFilename(file && file.name);
          const hint = { showInfo: true };
          if (suggested) hint.suggestedIni = suggested;
          localStorage.setItem(KEY_POST_IMPORT_TEACHER_HINT, JSON.stringify(hint));
        } else {
          localStorage.removeItem(KEY_POST_IMPORT_TEACHER_HINT);
        }
      } catch (_) {}

      location.reload();
    } catch (err) {
      alert(err?.message || 'Kunne ikke indlæse backup.');
    }
  };
  reader.readAsText(file);
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
    pkg.payload.gym = { variants, variantOrder: ['G1','G2','G3'] };
  }

  if (scope === 'roller') {
    const roles = {};
    const roleRows = Array.from(document.querySelectorAll('[data-role-key]'));
    roleRows.forEach(row => {
      const key = row.getAttribute('data-role-key');
      const text = (row.querySelector('.roleText')?.value || '').trim();
      if (key) roles[key] = { label: key, text };
    });
    pkg.payload.roller = { roles, roleOrder: Object.keys(roles) };
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
    if (p.gym) {
      const prev = overrides.gym || {};
      overrides.gym = Object.assign({}, prev, p.gym);
      // Backward compat: ældre gym-pakker kan indeholde roller.
      if (p.gym.roles) {
        const prevR = overrides.roller || {};
        overrides.roller = {
          roles: Object.assign({}, prevR.roles || {}, p.gym.roles),
          roleOrder: p.gym.roleOrder || prevR.roleOrder || Object.keys(p.gym.roles)
        };
      }
    }
  }
  if (obj.scope === 'all' || obj.scope === 'roller') {
    if (p.roller && p.roller.roles) {
      const prevR = overrides.roller || {};
      overrides.roller = {
        roles: Object.assign({}, prevR.roles || {}, p.roller.roles),
        roleOrder: p.roller.roleOrder || prevR.roleOrder || Object.keys(p.roller.roles)
      };
    }
  }

  if (obj.scope === 'all' || obj.scope === 'elevraad') {
    if (p.elevraad) overrides.elevraad = p.elevraad;
  }

  // Mark local snippet edits so auto-refresh does not overwrite them.
  if (obj.scope === 'all' || obj.scope === 'sang' || obj.scope === 'gym' || obj.scope === 'roller' || obj.scope === 'elevraad') {
    setSnippetsDirty(true);
  }

  if (expectedScope === 'templates' || obj.scope === 'templates' || obj.scope === 'all') {
    // Templates er ikke snippets-overrides, men indstillinger/templates.
    if (p.templates) {
      // Store imported templates separately, so a local draft is not overwritten on refresh.
      const tImp = lsGet(KEYS.templatesImported, {});
      if (typeof p.templates.schoolText === 'string') tImp.schoolText = p.templates.schoolText;
      if (typeof p.templates.template === 'string') tImp.template = p.templates.template;
      if (typeof p.templates.forstanderName === 'string') tImp.forstanderName = p.templates.forstanderName;
      // Backwards compatibility
      if (typeof p.templates.forstanderNavn === 'string') tImp.forstanderName = p.templates.forstanderNavn;
      lsSet(KEYS.templatesImported, tImp);

      setTemplatesDirty(true);
    }
  }

  setSnippetImported(overrides);
  setSnippetsDirty(true);
  applySnippetOverrides();
}

// ---------- normalize ----------
  function normalizeName(input) {
  if (!input) return "";
  return input
    .toString()
    .trim()
    // Handle common mojibake when a UTF-8 CSV has been decoded as latin1/Win-1252
    // (e.g. "KontaktlÃ¦rer" instead of "Kontaktlærer").
    .replace(/Ã¦/g, 'æ')
    .replace(/Ã¸/g, 'ø')
    .replace(/Ã¥/g, 'å')
    .replace(/Ã†/g, 'Æ')
    .replace(/Ã˜/g, 'Ø')
    .replace(/Ã…/g, 'Å')
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

function uniqStrings(arr) {
  const out = [];
  const seen = new Set();
  for (const v of arr || []) {
    const raw = (v || "").toString().trim();
    if (!raw) continue;
    const k = normalizeName(raw);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(raw);
  }
  return out;
}

function getAllTeacherNamesFromStudents() {
  const studs = (window.__STATE__ && window.__STATE__.students) ? window.__STATE__.students : [];
  const names = [];
  for (const st of studs) {
    if (st && st.kontaktlaerer1) names.push(st.kontaktlaerer1);
    if (st && st.kontaktlaerer2) names.push(st.kontaktlaerer2);
  }
  return uniqStrings(names).sort((a,b) => normalizeName(a).localeCompare(normalizeName(b)));
}

function resolveTeacherMatch(raw) {
  const s = getSettings();
  const input = (raw ?? "").toString().trim();
  if (!input) return { raw: "", resolved: "" };

  // Merge alias maps, but let DEFAULT_ALIAS_MAP win to avoid stale/wrong mappings in localStorage.
  const aliasMap = { ...(s && s.aliasMap ? s.aliasMap : {}), ...DEFAULT_ALIAS_MAP };
  const key = normalizeName(input).replace(/\s+/g, "");
  if (aliasMap && aliasMap[key]) {
    return { raw: input, resolved: aliasMap[key] };
  }

  const all = getAllTeacherNamesFromStudents();
  const nIn = normalizeName(input);
  const exact = all.find(n => normalizeName(n) === nIn);
  if (exact) return { raw: input, resolved: exact };

  // Partial match: allow "Måns" -> "Måns Patrik Mårtensson" etc.
  const partial = all.filter(n => normalizeName(n).includes(nIn));
  if (partial.length === 1) return { raw: input, resolved: partial[0] };

  return { raw: input, resolved: input };
}

function resolveTeacherName(raw) {
  return resolveTeacherMatch(raw).resolved;
}

function toInitials(raw) {
  // v1.0: generic initials, no name-based special cases (persondata-safe)
  const s = (raw ?? "").toString().trim();
  if (!s) return "";
  const up = s.toUpperCase();

  // If it already looks like initials (1–4 letters), keep it
  if (/^[A-ZÆØÅ]{1,4}$/.test(up)) return up;

  // Otherwise: first letter of first word + first letter of last word
  const parts = up.split(/[^A-ZÆØÅ]+/).filter(Boolean);
  if (!parts.length) return "";
  const first = parts[0][0] || "";
  const last = parts[parts.length - 1][0] || "";
  return (first + last).toUpperCase();
}

function cleanInitials(raw){
  // CSV'er og brugere kan skrive initialer med tegn som punktum, mellemrum osv.
  // Vi stripper alt andet end bogstaver og accepterer 1–4 bogstaver som "gyldige" initialer.
  const s = (raw ?? '').toString().trim().toUpperCase();
  const cleaned = s.replace(/[^A-ZÆØÅ]+/g, '');
  return cleaned;
}

function isValidInitials(raw){
  const cleaned = cleanInitials(raw);
  return /^[A-ZÆØÅ]{1,4}$/.test(cleaned);
}

function normalizedInitials(overrideRaw, fullNameRaw){
  // Rules (per "Accepterede kolonner"):
  // - If Initialer for k-lærer1/2 is provided AND looks like real initials (1-4 letters), use it.
  // - Otherwise auto-generate from the full name.
  const o = (overrideRaw ?? '').toString().trim();
  if (isValidInitials(o)) return cleanInitials(o);
  return toInitials(fullNameRaw);
}


function reverseResolveTeacherInitials(nameOrInitials) {
  // Try to map full name -> initials based on known alias map (if present in settings).
  const s = getSettings();
  // Merge, but let defaults win to avoid stale/wrong mappings.
  const m = { ...(s.aliasMap || {}), ...DEFAULT_ALIAS_MAP };
  const key = ((nameOrInitials||'')+'').trim().toLowerCase();
  for (const [ini, full] of Object.entries(m)) {
    if (((full||'')+'').trim().toLowerCase() === key) return (ini||'').toUpperCase();
  }
  return '';
}

function groupKeyFromTeachers(k1Raw, k2Raw) {
  const a = toInitials(k1Raw);
  const b = toInitials(k2Raw);
  const parts = [a,b].filter(Boolean).sort((x,y)=>x.localeCompare(y,'da'));
  return parts.length ? parts.join('/') : '—';
}

function buildKGroups(students) {
  const groups = new Map();
  for (const st of students) {
    const key = groupKeyFromTeachers(st.kontaktlaerer1_ini||'', st.kontaktlaerer2_ini||'');
    if (!groups.has(key)) groups.set(key, {key, students: []});
    groups.get(key).students.push(st);
  }
  // Sort students in each group (efternavn, fornavn)
  const coll = new Intl.Collator('da', {sensitivity:'base'});
  for (const g of groups.values()) {
    g.students.sort((x,y)=> {
      const a = (x.efternavn||'').trim(); const b=(y.efternavn||'').trim();
      const c = coll.compare(a,b);
      if (c) return c;
      return coll.compare((x.fornavn||'').trim(), (y.fornavn||'').trim());
    });
  }
  // Sort groups by key, but put '—' last
  const arr = Array.from(groups.values()).sort((g1,g2)=>{
    if (g1.key==='—' && g2.key!=='—') return 1;
    if (g2.key==='—' && g1.key!=='—') return -1;
    return coll.compare(g1.key,g2.key);
  });
  return arr;
}

function computeMissingKTeacher(students) {
  const miss = [];
  for (const st of students) {
    const k1 = ((st.kontaktlaerer1_ini||'')+'').trim();
    const k2 = ((st.kontaktlaerer2_ini||'')+'').trim();
    if (!k1 && !k2) miss.push(st);
  }
  return miss;
}

function updateTeacherDatalist() {
  // K-lærer-pickeren bygges primært ud fra elevlisten:
  // - Initialer findes i kontaktlærer1/2_ini
  // - Fulde navne (hvis til stede) findes i kontaktlærer1/2
  // Derudover kan brugerens aliasMap supplere med fulde navne.
  const input = document.getElementById('meInput');
  const menu  = document.getElementById('teacherPickerMenu');
  const btn   = document.getElementById('teacherPickerBtn');
  const wrap  = document.getElementById('teacherPicker');
  const clear = document.getElementById('meInputClear');
  if (!input || !menu || !btn || !wrap) return;
  try { menu.tabIndex = -1; } catch(_) {}

  const studs = getStudents();
  if (!studs.length) {
    input.value = '';
    input.disabled = true;
    btn.disabled = true;
    if (clear) clear.hidden = true;
    menu.innerHTML = `<div class="pickerEmpty">Indlæs elevliste først (students.csv).</div>`;
    wrap.classList.remove('open');
    menu.hidden = true;
    return;
  }

  input.disabled = false;
  btn.disabled = false;

  // Build initials -> full name map (prefer names seen in students.csv)
  const nameByIni = new Map();          // ini -> bestName
  const freqByIni = new Map();          // ini -> Map(name->count)
  const bump = (ini, full) => {
    const I = (ini || '').toString().trim().toUpperCase();
    const F = (full || '').toString().trim();
    if (!I) return;
    if (!freqByIni.has(I)) freqByIni.set(I, new Map());
    if (F) {
      const m = freqByIni.get(I);
      m.set(F, (m.get(F) || 0) + 1);
    }
  };

  for (const st of studs) {
    // Vær defensiv: hvis der ligger ældre/fejl-importerede values i localStorage,
    // så genberegner vi initialer ud fra fulde navne, med mindre der ligger en
    // gyldig override (1-4 bogstaver).
    bump(normalizedInitials(st.kontaktlaerer1_ini, st.kontaktlaerer1), st.kontaktlaerer1);
    bump(normalizedInitials(st.kontaktlaerer2_ini, st.kontaktlaerer2), st.kontaktlaerer2);
  }

  // Choose most frequent name per initials
  for (const [ini, m] of freqByIni.entries()) {
    let best = '';
    let bestN = 0;
    for (const [nm, n] of m.entries()) {
      if (n > bestN) { bestN = n; best = nm; }
    }
    if (best) nameByIni.set(ini, best);
  }

  // Merge aliasMap (ini -> full name)
  try {
    const s = getSettings();
    const alias = { ...(s.aliasMap || {}), ...(DEFAULT_ALIAS_MAP || {}) };
    Object.keys(alias || {}).forEach(k => {
      const I = (k || '').toString().trim().toUpperCase();
      const F = (alias[k] || '').toString().trim();
      // aliasMap indeholder også navne-keys (fx "andreasbechpedersen").
      // I pickeren vil vi KUN bruge rigtige initialer (1-4 bogstaver).
      if (!I || !F) return;
      if (!isValidInitials(I)) return;
      if (!nameByIni.has(I)) nameByIni.set(I, F);
    });
  } catch(_) {}

  // Build items
  const coll = new Intl.Collator('da', { sensitivity: 'base' });
  const allInitials = Array.from(new Set([
    ...Array.from(freqByIni.keys()),
    ...Array.from(nameByIni.keys())
  ])).sort((a,b)=>coll.compare(a,b));

  const items = allInitials.map(ini => {
    const full = nameByIni.get(ini) || '';
    const first = (full.split(/\s+/).filter(Boolean)[0] || '').toLowerCase();
    const last  = (full.split(/\s+/).filter(Boolean).slice(-1)[0] || '').toLowerCase();
    return {
      ini,
      full,
      first,
      last,
      label: full ? `${ini} (${full})` : ini
    };
  });

  let activeIndex = 0;
  let filteredItems = items.slice();

  function setActive(idx){
    const opts = Array.from(menu.querySelectorAll('[role="option"]'));
    if (!opts.length) return;
    activeIndex = Math.max(0, Math.min(idx, opts.length-1));
    opts.forEach((el,i)=>el.classList.toggle('active', i===activeIndex));
    const el = opts[activeIndex];
    if (el) el.scrollIntoView({ block: 'nearest' });
    // aria-activedescendant (optional)
    try { input.setAttribute('aria-activedescendant', el.id || ''); } catch(_) {}
  }

  function norm(s){ return normalizeName((s||'').toString()); }

  function matches(it, qRaw){
    const q = (qRaw || '').toString().trim();
    if (!q) return true;

    const qUpper = q.toUpperCase();
    const qNorm  = norm(q);
    const iniOk = it.ini.startsWith(qUpper);

    // If user types a short token (often initials), prioritize initials and name-begins.
    const parts = qNorm.split(/\s+/).filter(Boolean);
    const fullNorm = norm(it.full || '');
    const firstOk = it.first && it.first.startsWith(parts[0] || '');
    const lastOk  = it.last  && it.last.startsWith(parts[0] || '');

    if (parts.length === 1) {
      // Accept:
      // - initials prefix
      // - first or last name prefix
      // - or full name contains token (fallback)
      return iniOk || firstOk || lastOk || (fullNorm && fullNorm.includes(parts[0]));
    }

    // Multiple tokens: require all tokens to be present in full name OR initials prefix for first token
    if (iniOk) return true;
    if (!fullNorm) return false;
    return parts.every(t => fullNorm.includes(t));
  }

  function renderMenu(){
    const q = (input.value || '');
    filteredItems = items.filter(it => matches(it, q));

    menu.innerHTML = '';
    if (!filteredItems.length){
      menu.innerHTML = `<div class="pickerEmpty">Ingen match</div>`;
      return;
    }

    filteredItems.slice(0, 40).forEach((it, i) => {
      const row = document.createElement('div');
      row.className = 'tpItem';
      row.setAttribute('role','option');
      row.dataset.value = it.ini;
      row.dataset.full = it.full || '';
      row.id = `teacherOpt_${it.ini}_${i}`;
      row.innerHTML = `<span class="tpLeft">${it.ini}</span><span class="tpRight">${it.full ? '('+it.full+')' : ''}</span>`;
      row.addEventListener('mousedown', (e) => {
        // mousedown so selection happens before blur
        e.preventDefault();
        commit(it);
        closeMenu();
      });
      menu.appendChild(row);
    });
    setActive(0);
  }

  function openMenu(){
    menu.hidden = false;
    wrap.classList.add('open');
    renderMenu();
  }
  function closeMenu(){
    wrap.classList.remove('open');
    menu.hidden = true;
  }

  function commit(it){
    const ini = (it && it.ini) ? it.ini : ((it||'')+'').trim().toUpperCase();
    if (!ini) return;

    const s2 = getSettings();
    // Gem altid initialer som "me" (bruges til match mod elevernes k-lærer1/2-initialer)
    s2.me = ini;
    s2.meResolved = ini;
    s2.meResolvedConfirmed = ini;

    // Gem fulde navn separat (bruges kun til visning i UI)
    s2.meFullName = (it && it.full) ? (it.full + '').trim() : '';
    setSettings(s2);

    // If we came here right after a backup import that lacked a chosen teacher,
    // this selection completes the flow.
    try { localStorage.removeItem(KEY_POST_IMPORT_TEACHER_HINT); } catch (_) {}

    input.value = ini; // feltet holdes kort; listen viser fulde navne
    if (clear) clear.hidden = false;
    renderStatus();

    // Send user direkte til K-elever (som ønsket)
    try { state.viewMode = 'K'; setTab('k'); } catch(_) {}
  }


  // Button / clear
  btn.onclick = (e) => { e.preventDefault(); wrap.classList.contains('open') ? closeMenu() : openMenu(); input.focus(); };
  input.onfocus = () => openMenu();
  input.oninput = () => { if (!wrap.classList.contains('open')) openMenu(); else renderMenu(); };

  if (clear) {
    clear.onclick = (e) => {
      e.preventDefault();
      const s2 = getSettings(); s2.me = ''; s2.meResolved = ''; s2.meResolvedConfirmed = ''; s2.meFullName = ''; setSettings(s2);
      input.value = '';
      clear.hidden = true;
      closeMenu();
      renderStatus();
    };
    clear.hidden = !(getSettings().me || '').trim();
  }

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) closeMenu();
  });

  const handlePickerKeydown = (e) => {
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key === 'ArrowDown' || e.key === 'Down' || e.keyCode === 40) {
      if (!wrap.classList.contains('open')) openMenu();
      e.preventDefault();
      setActive(activeIndex + 1);
      return;
    }
    if (e.key === 'ArrowUp' || e.key === 'Up' || e.keyCode === 38) {
      if (!wrap.classList.contains('open')) openMenu();
      e.preventDefault();
      setActive(activeIndex - 1);
      return;
    }
    if (e.key === 'Enter') {
      const el = menu.querySelectorAll('[role="option"]')[activeIndex];
      if (el && el.dataset.value) {
        e.preventDefault();
        const ini = el.dataset.value;
        const full = el.dataset.full || '';
        commit({ ini, full });
        closeMenu();
      }
    }
  };

  input.addEventListener('keydown', handlePickerKeydown);
  btn.addEventListener('keydown', handlePickerKeydown);
  menu.addEventListener('keydown', handlePickerKeydown);
}

function initMarksSearchPicker(){
  const input = document.getElementById('marksSearch');
  const menu  = document.getElementById('marksSearchMenu');
  const btn   = document.getElementById('marksSearchBtn');
  const wrap  = document.getElementById('marksSearchPicker');
  const clear = document.getElementById('marksSearchClear');
  if (!input || !menu || !btn || !wrap) return;

  let items = [];
  let activeIndex = 0;

  function setActive(idx){
    const opts = Array.from(menu.querySelectorAll('[role="option"]'));
    if (!opts.length) return;
    activeIndex = Math.max(0, Math.min(idx, opts.length-1));
    opts.forEach((el,i)=>el.classList.toggle('active', i===activeIndex));
    const el = opts[activeIndex];
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  function computeItems(){
    const studs = getStudents();
    const coll = new Intl.Collator('da', {sensitivity:'base'});
    items = studs.slice().sort((a,b)=>coll.compare((a.efternavn||'')+' '+(a.fornavn||''),(b.efternavn||'')+' '+(b.fornavn||''))).map(st=>{
      const full = `${(st.fornavn||'').trim()} ${(st.efternavn||'').trim()}`.trim();
      return { full, unilogin: (st.unilogin||'').trim(), kgrp: groupKeyFromTeachers(st.kontaktlaerer1_ini||'', st.kontaktlaerer2_ini||'') };
    });
  }

  function renderMenu(){
    if (!items.length) computeItems();
    const q = (input.value || '').toString().trim().toLowerCase();
    const filtered = !q ? items : items.filter(it => (it.full||'').toLowerCase().includes(q));
    menu.innerHTML = '';
    if (!filtered.length){
      menu.innerHTML = `<div class="pickerEmpty">Ingen match</div>`;
      return;
    }
    filtered.slice(0, 24).forEach((it) => {
      const row = document.createElement('div');
      row.className = 'tpItem';
      row.setAttribute('role','option');
      row.dataset.value = it.unilogin || it.full;
      row.setAttribute('data-full', it.full || '');
      row.innerHTML = `<div class="tpLeft">${escapeHtml(it.full)}</div><div class="tpRight">${escapeHtml(it.kgrp||'')}</div>`;
      row.addEventListener('mousedown', (e) => {
        e.preventDefault();
        commit(it.full);
        closeMenu();
      });
      menu.appendChild(row);
    });
    setActive(0);
  }

  function openMenu(){
    menu.hidden = false;
    wrap.classList.add('open');
    computeItems();
    renderMenu();
  }

  function closeMenu(){
    wrap.classList.remove('open');
    menu.hidden = true;
  }

  function commit(name){
    input.value = name;
    // keep plain search filter in state; renderMarksTable reads input value on render
    renderMarksTable();
    if (clear) clear.hidden = !input.value;
  }

  btn.onclick = (e) => { e.preventDefault(); wrap.classList.contains('open') ? closeMenu() : openMenu(); input.focus(); };
  input.onfocus = () => openMenu();
  input.oninput = () => { if (!wrap.classList.contains('open')) openMenu(); else renderMenu(); };

  if (clear){
    clear.onclick = (e)=>{ e.preventDefault(); input.value=''; clear.hidden=true; closeMenu(); renderMarksTable(); };
    clear.hidden = !input.value;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!wrap.classList.contains('open')) openMenu();
      e.preventDefault();
      setActive(activeIndex + (e.key === 'ArrowDown' ? 1 : -1));
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
    if (e.key === 'Enter') {
      const el = menu.querySelectorAll('[role="option"]')[activeIndex];
      if (el){ e.preventDefault(); commit((el.getAttribute('data-full') || el.dataset.full || el.textContent || '').trim()); closeMenu(); }
    }
  });

  document.addEventListener('click', (e)=>{ if (!wrap.contains(e.target)) closeMenu(); });
  closeMenu();
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

  // ---------- util ----------
  function escapeAttr(s) { return (s ?? '').toString()
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/\r?\n/g,'&#10;'); }
  function $(id){ return document.getElementById(id); }

// Focus + open K-lærer picker (waits for DOM + picker init)
function focusTeacherPickerAutoOpen(opts){
  const maxMs = (opts && opts.maxMs) ? opts.maxMs : 1200;
  const t0 = Date.now();
  (function tick(){
    const input = document.getElementById('meInput');
    const btn = document.getElementById('teacherPickerBtn');
    // We prefer clicking the button because it reliably opens the menu and focuses input
    if (input && btn && !input.disabled && !btn.disabled) {
      try { btn.click(); } catch(_) {}
      try { input.focus(); } catch(_) {}
      return;
    }
    if (Date.now() - t0 < maxMs) {
      requestAnimationFrame(tick);
    }
  })();
}


  // Hold "Faglærer-arbejde" type tabs in sync with the underlying select.
  // This must live in the same scope as renderMarksTable().
  function syncMarksTypeTabs(){
    const wrap = $("marksTypeTabs");
    const sel  = $("marksType");
    if(!wrap || !sel) return;
  // Compare using normalized tokens (e.g. "Elevråd" == "elevraad").
  const val = normalizeHeader(sel.value || "sang");
  wrap.querySelectorAll("button[data-type]").forEach(btn => {
    const t = normalizeHeader(btn.getAttribute("data-type") || "");
    const on = (t && t === val);
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });
  }

const on = (id, ev, fn, opts) => { const el = document.getElementById(id); if (el) el.addEventListener(ev, fn, opts); };
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
  
// --- Marks export helpers (human-friendly file names) ---
function _dateStampYYYYMMDD() {
  const d = new Date();
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
function marksExportLabel(type) {
  if (type === 'sang') return 'Sangkarakterer';
  if (type === 'gym')  return 'Gymnastikkarakterer & roller';
  if (type === 'elevraad') return 'Elevrådsrepræsentanter';
  return 'Markeringer';
}
function marksExportFilename(type) {
  const stamp = _dateStampYYYYMMDD();
  // Keep filenames ASCII-friendly for Windows/Drive etc.
  if (type === 'sang') return `Sangkarakterer_${stamp}.csv`;
  if (type === 'gym')  return `Gymnastikkarakterer_og_roller_Fanebaerer_Redskabshold_DGI-instruktoer_${stamp}.csv`;
  if (type === 'elevraad') return `Elevraadsrepraesentanter_${stamp}.csv`;
  return `Markeringer_${stamp}.csv`;
}
// ---------------------------------------------------------

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
    viewMode: 'K', // 'K' | 'ALL' (K-elever vs Alle elever)
    kGroupIndex: 0,

    settingsSubtab: 'general',
    selectedUnilogin: null,
    studentInputUrls: {},
    // The current visible K-elev list (after any filters). Used for prev/next navigation in Redigér.
    visibleKElevIds: [],
    kMeDraft: ''
  };

  // Restore last UI selection (settings subtab etc.) from localStorage
  loadUIStateInto(state);

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

  // UI-state (tabs etc.) is stored inside settings.ui so it survives reloads
  function loadUIStateInto(stateObj){
    const s = getSettings();
    const ui = (s && s.ui) ? s.ui : {};
    if (typeof ui.settingsSubtab === 'string' && ui.settingsSubtab) stateObj.settingsSubtab = ui.settingsSubtab;
    if (typeof ui.marksType === 'string' && ui.marksType) stateObj.marksType = ui.marksType;
  }

  function saveUIStateFrom(stateObj){
    const s = getSettings();
    s.ui = s.ui || {};
    s.ui.settingsSubtab = stateObj.settingsSubtab;
    s.ui.marksType = stateObj.marksType;
    setSettings(s);
  }

  // Back-compat: older code calls saveState()
  function saveState(){ saveUIStateFrom(state); }
  function getTemplates(){ return Object.assign(defaultTemplates(), (REMOTE_OVERRIDES.templates && (REMOTE_OVERRIDES.templates.templates || REMOTE_OVERRIDES.templates)) || {}, lsGet(KEYS.templatesImported, {}), lsGet(KEYS.templates, {})); }

function getRemoteTemplatesOnly(){
  return (REMOTE_OVERRIDES && REMOTE_OVERRIDES.templates) ? (REMOTE_OVERRIDES.templates.templates || REMOTE_OVERRIDES.templates) : null;
}

function normalizeGender(value) {
  const s = String(value ?? '').trim().toLowerCase();
  if (!s) return '';
  // Common Danish + English variants
  if (['m', 'mand', 'dreng', 'male', 'boy', 'han'].includes(s)) return 'm';
  if (['k', 'kvinde', 'pige', 'female', 'girl', 'hun', 'f', 'w'].includes(s)) return 'k';
  // Heuristics
  if (s.startsWith('m')) return 'm';
  if (s.startsWith('k')) return 'k';
  if (s.startsWith('f')) return 'k';
  return '';
}


function applyRemoteTemplatesToLocal(opts){
  opts = opts || {};
  const remote = getRemoteTemplatesOnly();
  if(!remote) return false;

  const curLocal = lsGet(KEYS.templates, {});
  const curT = getTemplates();
  const locks = {
    schoolTextLocked: curT.schoolTextLocked,
    templateLocked: curT.templateLocked,
    forstanderNameLocked: curT.forstanderNameLocked,
  };

  const nextLocal = Object.assign({}, curLocal);
  // Copy only known template fields from remote (preserve other local keys)
  ['schoolText','template','forstanderName'].forEach(k => {
    if(remote[k] != null) nextLocal[k] = remote[k];
  });
  if(opts && opts.preserveLocks !== false){
    Object.assign(nextLocal, locks);
  }

  // Clear any imported templates (leader pack) when syncing from authoritative overrides
  lsDel(KEYS.templatesImported);
  lsSet(KEYS.templates, nextLocal);
  setTemplatesDirty(false);
  return true;
}

function clearLocalTemplates(){
  lsDel(KEYS.templatesImported);
  lsDel(KEYS.templates);
  setTemplatesDirty(false);
}

function applyTemplatesFromOverridesToLocal(opts={}){
  const { preserveLocks = true, force = false } = opts;
  // Safety: never overwrite user edits unless explicitly forced.
  if(!force && isTemplatesDirty()) return false;
  const remoteT = getRemoteTemplatesOnly();
  if(!remoteT) return false;

  const localNow = lsGet(KEYS.templates, {});
  const next = {};

  // Bring over override-controlled fields
  ['forstanderName','schoolText','template'].forEach(k=>{
    if(remoteT[k] !== undefined) next[k] = remoteT[k];
  });

  // Preserve lock flags (so “leder” can lock text fields without being overwritten)
  if(preserveLocks){
    ['forstanderNameLocked','schoolTextLocked','templateLocked'].forEach(k=>{
      if(localNow[k] !== undefined) next[k] = localNow[k];
    });
  }

  // Write into localStorage so the app works consistently offline (after first load)
  lsSet(KEYS.templates, next);
  setTemplatesDirty(false);
  return true;
}

async function refreshOverridesAndApplyTemplatesIfSafe(force=false){
  if(isTemplatesDirty()) return false;
  await loadRemoteOverrides();
  return applyTemplatesFromOverridesToLocal({ preserveLocks: true });
}
  function setTemplates(t){ lsSet(KEYS.templates, t); }
  function getStudents(){ const s = lsGet(KEYS.students, []); window.__ALL_STUDENTS__ = s || []; return s; }

  function getSelectedStudent(){
    const u = state.selectedUnilogin;
    if(!u) return null;
    const studs = getStudents() || [];
    return (studs || []).find(s => s && s.unilogin === u) || null;
  }

  
function rebuildAliasMapFromStudents(studs){
  const s = getSettings();
  // Start from existing aliasMap, but drop any old initials-keys.
  // Initials are derived from the current student list and may include overrides.
  const alias = { ...(s.aliasMap || {}) };
  try {
    Object.keys(alias).forEach(k => {
      const keyUp = (k || '').toString().trim().toUpperCase();
      if (!keyUp) return;
      if (/^[A-ZÆØÅ]{1,4}$/.test(keyUp)) delete alias[k];
      if (/^[A-ZÆØÅ]{1,4}\/[A-ZÆØÅ]{1,4}$/.test(keyUp)) delete alias[k];
    });
  } catch(_) {}
  const add = (ini, full) => {
    if (!ini || !full) return;
    const k = (ini||'').toString().trim().toLowerCase();
    if (k) alias[k] = full;
    const nk = normalizeName(full).replace(/\s+/g,'');
    if (nk) alias[nk] = full;
  };
  // IMPORTANT:
  // Brug de initialer, der allerede er beregnet ved import (kontaktlaererX_ini).
  // De kan indeholde eksplicitte overrides fra CSV ("Initialer for k-lærer1/2").
  // Hvis vi i stedet danner initialer ud fra navnet her, ender vi med at "genopfinde"
  // auto-initialer (fx Andreas Bech Pedersen -> AP), selv om CSV'en siger AB.
  (studs || []).forEach(st => {
    if (!st) return;

    const pairs = [
      { full: (st.kontaktlaerer1||'').toString().trim(), ini: (st.kontaktlaerer1_ini||'').toString().trim() },
      { full: (st.kontaktlaerer2||'').toString().trim(), ini: (st.kontaktlaerer2_ini||'').toString().trim() }
    ];

    for (const p of pairs){
      if (!p.full) continue;
      // Hvis "fulde" feltet faktisk er initialer (sjældent), gem det som sig selv.
      if (/^[A-ZÆØÅ]{1,4}(\/[A-ZÆØÅ]{1,4})?$/.test(p.full.toUpperCase())) {
        add(p.full.toUpperCase(), p.full);
        continue;
      }
      const ini = isValidInitials(p.ini) ? cleanInitials(p.ini) : toInitials(p.full);
      if (ini) add(ini, p.full);
    }
  });
  setSettings({ ...s, aliasMap: alias });
}

function setStudents(studs){ lsSet(KEYS.students, studs); rebuildAliasMapFromStudents(studs); window.__ALL_STUDENTS__ = studs || []; rebuildAliasMapFromStudents(studs); }
  function getMarks(kindKey){ return lsGet(kindKey, {}); }
  function setMarks(kindKey, m){ lsSet(kindKey, m); try{ updateImportStatsUI(); }catch(_){} }
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

    const cap1 = (s) => {
      const str = String(s || '');
      return str ? (str.charAt(0).toUpperCase() + str.slice(1)) : str;
    };

    const pack = (hanHun, hamHende, hansHendes) => ({
      HAN_HUN: hanHun,
      HAM_HENDE: hamHende,
      HANS_HENDES: hansHendes,
      SIG_HAM_HENDE: 'sig',
      HAN_HUN_CAP: cap1(hanHun),
      HAM_HENDE_CAP: cap1(hamHende),
      HANS_HENDES_CAP: cap1(hansHendes),
    });

    if (isFemale && !isMale) return pack('hun', 'hende', 'hendes');
    if (isMale && !isFemale) return pack('han', 'ham', 'hans');
    // Ukendt/neutral
    return pack('han/hun', 'ham/hende', 'hans/hendes');
  }


  function sortedStudents(all) {
    // Sortér alfabetisk efter fornavn (primært), derefter efternavn.
    return all.slice().sort((a,b) =>
      (a.fornavn||'').localeCompare(b.fornavn||'', 'da') ||
      (a.efternavn||'').localeCompare(b.efternavn||'', 'da')
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
  return s.replace(/\{\{\s*([^{}]+?)\s*\}\}|\{\(\s*([^){}]+?)\s*\)\}|\{\s*([^{}]+?)\s*\}/g, (m, k1, k2, k3) => {
    const rawKey = (k1 || k2 || k3 || "").trim();
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
const rolesObj = (SNIPPETS && SNIPPETS.roller) ? SNIPPETS.roller : {};
const roleCodes = Object.keys(rolesObj);

// ny model: array af valgte roller gemt som marksER.gym_roles
// Roller kommer normalt fra gymnastik-faglærerens marks (marksGym).
// Vi har dog set ældre / blandede backups, hvor gym_roles kan ligge andre steder.
// Derfor: prøv marksGym først, fallback til marksER.
const selectedArr =
  (marksGym && Array.isArray(marksGym.gym_roles)) ? marksGym.gym_roles
  : (marksER && Array.isArray(marksER.gym_roles)) ? marksER.gym_roles
  : [];
const selected = new Set(selectedArr.map(s => String(s || '').trim()).filter(Boolean));

roleCodes.forEach(code => {
  const isOn =
    selected.has(code) ||               // ny måde
    (marksGym && marksGym[code] === true); // fallback (hvis gamle booleans findes)

  if (isOn && rolesObj[code]) {
    roleTexts.push(snippetTextByGender(rolesObj[code], student.koen));
  }
});

let rolleAfsnit = roleTexts.filter(Boolean).join('\n\n');

   let elevraadAfsnit = "";
const erObj = (SNIPPETS && SNIPPETS.elevraad) ? SNIPPETS.elevraad : {};
const erKeys = Object.keys(erObj);

// ny model: valgt variant gemt som marksER.elevraad_variant
const chosen =
  (marksER && typeof marksER.elevraad_variant === "string" && marksER.elevraad_variant.trim())
    ? marksER.elevraad_variant.trim()
    : ((marksER && marksER.elevraad && erKeys[0]) ? erKeys[0] : "");

if (chosen && erObj[chosen]) {
  elevraadAfsnit = snippetTextByGender(erObj[chosen], student.koen);
}

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
      "HANS_HENDES": pr.HANS_HENDES,
      "HAN_HUN_CAP": pr.HAN_HUN_CAP,
      "HAM_HENDE_CAP": pr.HAM_HENDE_CAP,
      "HANS_HENDES_CAP": pr.HANS_HENDES_CAP
    };
    sangAfsnit = applyPlaceholders(sangAfsnit, snMap);
    gymAfsnit = applyPlaceholders(gymAfsnit, snMap);
    elevraadAfsnit = applyPlaceholders(elevraadAfsnit, snMap);
    rolleAfsnit = applyPlaceholders(rolleAfsnit, snMap);

    const kontakt = [student.kontaktlaerer1, student.kontaktlaerer2].filter(x => (x||'').trim()).join(' / ');

    // Kontaktgruppe-antal skal være antal elever i den *aktive* K-lærers kontaktgruppe.
    // Brug aldrig "alle elever" som fallback her, da det giver forkerte tal i udtalelser.
    function computeActiveContactGroupCount() {
      try {
        const studsAll = (window.__ALL_STUDENTS__ && Array.isArray(window.__ALL_STUDENTS__)) ? window.__ALL_STUDENTS__ : [];
        if (!studsAll.length) return '';
        const meRaw = (settings.meResolved || settings.me || '').toString();
        const meNorm = normalizeName(meRaw);
        if (!meNorm) return '';
        const cnt = studsAll.filter(st =>
          normalizeName(toInitials(st.kontaktlaerer1_ini || '')) === meNorm ||
          normalizeName(toInitials(st.kontaktlaerer2_ini || '')) === meNorm
        ).length;
        return String(cnt);
      } catch (e) {
        return '';
      }
    }

    const activeContactGroupCount = computeActiveContactGroupCount() || String(settings.contactGroupCount || '');

    const placeholderMap = {
      "ELEV_NAVN": fullName,
      "ELEV_FORNAVN": firstName,
      "HAN_HUN": pr.HAN_HUN,
      "HAM_HENDE": pr.HAM_HENDE,
      "HANS_HENDES": pr.HANS_HENDES,
      "HAN_HUN_CAP": pr.HAN_HUN_CAP,
      "HAM_HENDE_CAP": pr.HAM_HENDE_CAP,
      "HANS_HENDES_CAP": pr.HANS_HENDES_CAP,
      "ELEV_EFTERNAVN": (student.efternavn || '').trim(),
      "ELEV_KLASSE": formatClassLabel(student.klasse),
      "PERIODE_FRA": period.from,
      "PERIODE_TIL": period.to,
      "DATO_MAANED_AAR": period.dateMonthYear,

      "SKOLENS_STANDARDTEKST": tpls.schoolText || '',
      "SANG_AFSNIT": sangAfsnit,
      "GYM_AFSNIT": gymAfsnit,
      "SANG_GYM_AFSNIT": [sangAfsnit, gymAfsnit].filter(Boolean).join("\n\n"),
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
"KONTAKTGRUPPE_ANTAL": activeContactGroupCount,
"KONTAKTGRUPPE_BESKRIVELSE": (free.kgruppe || SNIPPETS.kontaktgruppeDefault || ''),
"KONTAKTLAERER_1_NAVN": ((student.kontaktlaerer1 || '') + '').trim(),
"KONTAKTLAERER_2_NAVN": ((student.kontaktlaerer2 || '') + '').trim(),
      "KONTAKTLÆRER_1_NAVN": ((student.kontaktlaerer1 || '') + '').trim(),
      "KONTAKTLÆRER_2_NAVN": ((student.kontaktlaerer2 || '') + '').trim(),
"FORSTANDER_NAVN": settings.forstanderName || '',

      "HAN_HUN": pr.HAN_HUN,
      "HAM_HENDE": pr.HAM_HENDE,
      "HANS_HENDES": pr.HANS_HENDES,
      "HAN_HUN_CAP": pr.HAN_HUN_CAP,
      "HAM_HENDE_CAP": pr.HAM_HENDE_CAP,
      "HANS_HENDES_CAP": pr.HANS_HENDES_CAP,

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
      "ELEVRAAD_AFSNIT": (elevraadAfsnit || ""),
      "ROLLE_AFSNIT": (rolleAfsnit || ""),
      "MARKS_AFSNIT": [sangAfsnit, gymAfsnit, elevraadAfsnit, rolleAfsnit].filter(Boolean).join('\n\n'),

      "SANG_GYM_AFSNIT": ""
    };

    let out = tpls.template || DEFAULT_TEMPLATE;
    // If the active template has separate placeholders for elevråd/roller,
    // keep SANG_GYM_AFSNIT limited to sang+gym to avoid duplicates.
    const hasElevraadSlot = (out.indexOf("{{ELEVRAAD_AFSNIT}}") !== -1);
    const hasRolleSlot = (out.indexOf("{{ROLLE_AFSNIT}}") !== -1);
    placeholderMap.SANG_GYM_AFSNIT = [sangAfsnit, gymAfsnit]
      .concat((!hasElevraadSlot ? [elevraadAfsnit] : []))
      .concat((!hasRolleSlot ? [rolleAfsnit] : []))
      .filter(Boolean).join('\n\n');
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
    ,ini1: new Set(["initialerforklaerer1","initialerforklærer1","kontaktlaerer1initialer","kontaktlærer1initialer"])
    ,ini2: new Set(["initialerforklaerer2","initialerforklærer2","kontaktlaerer2initialer","kontaktlærer2initialer"])
  };
  function mapStudentHeaders(headers) {
    const mapped = {};
    for (const h of headers) {
      const key = normalizeHeader(h);
      for (const [field,set] of Object.entries(STUDENT_COLMAP)) {
        if (set.has(key)) mapped[field] = h;
      }
    }

    // Fuzzy fallbacks (Excel/Uni-C variants with odd dashes/spaces etc.)
    // We ONLY use these if the strict map did not find a column.
    const findBy = (pred) => {
      for (const h of headers) {
        const k = normalizeHeader(h);
        if (pred(k)) return h;
      }
      return null;
    };

    if (!mapped.ini1) {
      const h = findBy(k => k.includes('initialer') && k.includes('laerer') && k.includes('1'));
      if (h) mapped.ini1 = h;
    }
    if (!mapped.ini2) {
      const h = findBy(k => k.includes('initialer') && k.includes('laerer') && k.includes('2'));
      if (h) mapped.ini2 = h;
    }

    return mapped;
  }

  function buildTeacherOverrideMap(rows, map){
    // Build canonical teacher overrides from CSV columns:
    // - Kontaktlærer1 paired with "Initialer for k-lærer1"
    // - Kontaktlærer2 paired with "Initialer for k-lærer2"
    // Any valid override (1-4 letters after cleaning) wins for that full name, regardless of later position.
    const out = new Map(); // normFullName -> cleanedInitials
    const add = (fullRaw, iniRaw) => {
      const full = (fullRaw ?? '').toString().trim();
      if (!full) return;
      const norm = normalizeName(full);
      if (!norm) return;
      const cleaned = cleanInitials(iniRaw);
      if (!isValidInitials(cleaned)) return;
      // Keep first seen override unless a later one differs; if differs, prefer the shorter/cleaner one.
      if (!out.has(norm)) out.set(norm, cleaned);
      else {
        const prev = out.get(norm);
        if (prev !== cleaned) {
          // Prefer the one that looks more like typical initials (2-3 letters), else keep existing.
          const score = (s) => (s.length===2?3:(s.length===3?2:(s.length===1?1:0)));
          if (score(cleaned) > score(prev)) out.set(norm, cleaned);
        }
      }
    };

    for (const row of (rows || [])){
      if (!row) continue;
      const k1 = (row[map.kontakt1] ?? '').toString().trim();
      const i1 = (row[map.ini1] ?? '').toString().trim();
      add(k1, i1);
      const k2 = (row[map.kontakt2] ?? '').toString().trim();
      const i2 = (row[map.ini2] ?? '').toString().trim();
      add(k2, i2);
    }
    return out;
  }
  function normalizeStudentRow(row, map, teacherOverrides) {
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
    const koen = normalizeGender(get('koen'));
const klasse = get('klasse');
    const ini1 = (get('ini1') || '').trim();
    const ini2 = (get('ini2') || '').trim();
    const kontakt1_navn = get('kontakt1');
    const kontakt2_navn = get('kontakt2');

    // Initialer-regel (per "Accepterede kolonner"):
    // - Hvis "Initialer for k-lærerX" er udfyldt og ligner rigtige initialer (1-4 bogstaver), brug dem.
    // - Ellers dannes initialer automatisk ud fra kontaktlærerens navn.
    // Tomme felter ignoreres senere i UI.
    const ov1 = teacherOverrides && kontakt1_navn ? teacherOverrides.get(normalizeName(kontakt1_navn)) : '';
    const ov2 = teacherOverrides && kontakt2_navn ? teacherOverrides.get(normalizeName(kontakt2_navn)) : '';
    const k1 = ov1 ? ov1 : normalizedInitials(ini1, kontakt1_navn);
    const k2 = ov2 ? ov2 : normalizedInitials(ini2, kontakt2_navn);
    const navn = ((fornavn || '') + ' ' + (efternavn || '')).trim();
    return { fornavn, efternavn, navn, unilogin, koen, klasse, kontaktlaerer1: kontakt1_navn, kontaktlaerer2: kontakt2_navn, kontaktlaerer1_ini: k1, kontaktlaerer2_ini: k2 };
  }

  // ---------- Canonicalize K-lærer initials across dataset ----------
  // In nogle CSV'er kan samme kontaktlærer optræde med både auto-initialer
  // (fx Andreas Bech Pedersen -> AP) og et eksplicit override (fx AB).
  // Vi ønsker én entydig initial pr. fulde navn i hele datasættet.
  // Heuristik:
  //   - Hvis et fulde navn har mindst én initial som afviger fra autoInitials(fullName),
  //     betragtes den/de som overrides, og den mest hyppige override vælges som canonical.
  //   - Ellers vælges den mest hyppige initial (typisk auto).
  // Resultat: alle elever får samme *_ini for samme fulde navn.
  function canonicalizeTeacherInitials(students){
    const studs = Array.isArray(students) ? students : [];
    if (!studs.length) return studs;

    // Collect stats per full name
    const statsByName = new Map(); // normName -> { fullName, auto, counts: Map(ini->count) }
    const bump = (fullNameRaw, iniRaw) => {
      const full = (fullNameRaw || '').toString().trim();
      if (!full) return;
      const norm = normalizeName(full);
      if (!norm) return;
      const ini = (iniRaw || '').toString().trim().toUpperCase();
      if (!ini) return;
      if (!statsByName.has(norm)) statsByName.set(norm, { fullName: full, auto: toInitials(full), counts: new Map() });
      const s = statsByName.get(norm);
      // keep prettiest full name (longest) if variations exist
      if (full.length > (s.fullName||'').length) s.fullName = full;
      s.counts.set(ini, (s.counts.get(ini) || 0) + 1);
    };

    for (const st of studs){
      if (!st) continue;
      bump(st.kontaktlaerer1, st.kontaktlaerer1_ini);
      bump(st.kontaktlaerer2, st.kontaktlaerer2_ini);
    }

    // Choose canonical initials per name
    const canonicalByName = new Map(); // normName -> canonicalIni
    for (const [norm, info] of statsByName.entries()){
      const auto = (info.auto || '').toUpperCase();
      let best = '';
      let bestCount = -1;

      // Prefer overrides that differ from auto
      for (const [ini, cnt] of info.counts.entries()){
        if (auto && ini === auto) continue;
        if (cnt > bestCount){ best = ini; bestCount = cnt; }
      }

      // If no differing overrides, fall back to most frequent overall
      if (!best){
        for (const [ini, cnt] of info.counts.entries()){
          if (cnt > bestCount){ best = ini; bestCount = cnt; }
        }
      }

      if (best) canonicalByName.set(norm, best);
    }

    // Apply canonical initials
    for (const st of studs){
      if (!st) continue;
      const n1 = normalizeName((st.kontaktlaerer1 || '').toString().trim());
      const n2 = normalizeName((st.kontaktlaerer2 || '').toString().trim());
      if (n1 && canonicalByName.has(n1)) st.kontaktlaerer1_ini = canonicalByName.get(n1);
      if (n2 && canonicalByName.has(n2)) st.kontaktlaerer2_ini = canonicalByName.get(n2);
    }

    return studs;
  }

  // ---------- UI rendering ----------
  function setTab(tab) {
    let students = getStudents();
    if (!students.length && Array.isArray(window.__ALL_STUDENTS__)) students = window.__ALL_STUDENTS__;
    if (!students.length && tab !== 'set') tab = 'set';

    // Redigér kræver valgt elev. Hvis ingen er valgt, send brugeren til K-elever.
    if (tab === 'edit' && !state.selectedUnilogin) tab = 'k';

    state.tab = tab;
    if (tab === 'k') updateTabLabels();

    if (tab === 'set') setSettingsSubtab('general');

    ['k','edit','set'].forEach(t => {
      const btn = $('tab-' + (t==='set'?'set':t));
      if (btn) btn.classList.toggle('active', tab === t);
      const view = $('view-' + (t==='set'?'set':t));
      if (view) view.classList.toggle('active', tab === t);
    });

    renderAll();
  }

function setSettingsSubtab(sub) {
    state.settingsSubtab = sub || 'general';
    const btns = document.querySelectorAll('#settingsSubtabs .subtab');
    btns.forEach(b => b.classList.toggle('active', b.dataset.subtab === state.settingsSubtab));
    const panes = document.querySelectorAll('#view-set .settingsSubtab');
    panes.forEach(p => p.classList.toggle('active', p.dataset.subtab === state.settingsSubtab));

    // Persistér valg af underfane og sørg for at UI'et re-rendres
    // (ellers bliver fx faglærer-tabellen ikke bygget).
    saveState();
  // Undgå recursion: opdater kun UI lokalt
  updateTeacherDatalist();
  renderMarksTable(); // hvis export-pane er synligt
}

function updateTabLabels(){
  const kBtn = $('tab-k');
  if(!kBtn) return;
  const span = kBtn.querySelector('span');

  // Tab label (kort) og stor titel (mere informativ)
  const tabTitle = (state.viewMode === 'ALL') ? 'Alle K-grupper' : 'K-elever';
  if (span) span.textContent = tabTitle;
  kBtn.title = tabTitle;

  const h = $('kTitle');
  if (h) {
    if (state.viewMode === 'ALL') {
      h.textContent = 'Alle K-grupper';
    } else {
      const s = getSettings();
      const meRaw = ((s.me || '') + '').trim();
      const meIni = toInitials(meRaw);
      h.textContent = meIni ? `${meIni}'s K-elever` : 'K-elever';
    }
  }
}


  function updateTabVisibility() {
    const editBtn = $('tab-edit');
    if (!editBtn) return;
    // Skjul Redigér, hvis ingen elev er valgt.
    editBtn.style.display = state.selectedUnilogin ? '' : 'none';
  }

  function renderAll() {
    updateTeacherDatalist();
    updateTabVisibility();
    initMarksSearchPicker();
    renderStatus();
    if (state.tab === 'set') renderSettings();
    if (state.tab === 'k') renderKList();
    if (state.tab === 'edit') renderEdit();
  }

  function renderStatus() {
    const s = getSettings();
    const studs = getStudents();
    const isAll = state.viewMode === 'ALL';
    // Build k-grupper (teacher pairs) once; later UI uses this.
    const kGroups = buildKGroups(studs);
    state.__kGroups = kGroups;
    if (state.kGroupIndex < 0) state.kGroupIndex = 0;
    if (state.kGroupIndex > Math.max(0, kGroups.length-1)) state.kGroupIndex = Math.max(0, kGroups.length-1);

    const me = '';
    const build = '';
    $('statusText').textContent = studs.length ? `Elever: ${studs.length}` : `Ingen elevliste indlæst`;
}

  
function updateImportStatsUI() {
  const statsCard = document.getElementById('importStatsCard');
  if (!statsCard) return;

  const s = getSettings();
  const studs = getStudents();
  const meRaw = (s.me || '').toString().trim();
  const meIni = toInitials(meRaw);
  const meNorm = normalizeName((s.meResolved || s.me || '').toString());

  // Determine active K-gruppe students (by initials match)
  const total = (studs.length && meNorm)
    ? studs.filter(st =>
        normalizeName(toInitials(st.kontaktlaerer1_ini)) === meNorm ||
        normalizeName(toInitials(st.kontaktlaerer2_ini)) === meNorm
      )
    : [];

  const nTot = total.length;

  const setVal = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  const setList = (id, arr) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!arr.length) { el.innerHTML = '<span class="muted">Ingen</span>'; return; }
    el.innerHTML = arr.map(escapeHtml).join('<span class="muted">, </span>');
  };

  // Compute "done" and missing lists (per student: any mark in that category?)
  const missing = { sang: [], gym: [], elevraad: [] };
  const markedER = [];

  const isTruthy = (v) => {
    if (v === true) return true;
    if (v === 1) return true;
    if (typeof v === 'string') return v.trim().length > 0;
    if (typeof v === 'number') return v !== 0 && !Number.isNaN(v);
    return false;
  };
  const hasAnyTruthyValue = (obj) => {
    if (!obj || typeof obj !== 'object') return false;
    return Object.keys(obj).some(k => isTruthy(obj[k]));
  };

  const marksS = getMarks(KEYS.marksSang);
  const marksG = getMarks(KEYS.marksGym);
  const marksE = getMarks(KEYS.marksElev);

  let doneS = 0, doneG = 0, doneE = 0;

  total.forEach(st => {
    const u = st.unilogin;
    const full = `${st.fornavn||''} ${st.efternavn||''}`.trim() || (u||'');
    const sM = marksS[u] || {};
    const gM = marksG[u] || {};
    const eM = marksE[u] || {};

    const hasS = !!(sM.sang_variant || sM.variant || sM.sang || sM.S1 || sM.S2 || sM.S3 || hasAnyTruthyValue(sM));
    const hasG = !!(gM.gym_variant || gM.variant || gM.gym || gM.G1 || gM.G2 || gM.G3 ||
                    Object.keys(gM||{}).some(k => (k||'').toUpperCase().startsWith('R') && isTruthy(gM[k])) ||
                    hasAnyTruthyValue(gM));
    // Elevråd kan være bool/variant/streng – og kan importeres under forskellige nøgler.
    const hasE = !!(eM.elevraad_variant || eM.variant || eM.elevraad || eM.E1 || eM.YES || hasAnyTruthyValue(eM));

    if (hasS) doneS++; else missing.sang.push(full);
    if (hasG) doneG++; else missing.gym.push(full);
    if (hasE) { doneE++; markedER.push(full); } else missing.elevraad.push(full);
  });

  // Hint
  const hint = document.getElementById('importStatsHint');
  if (hint) {
    if (!meNorm || !studs.length) hint.textContent = 'Vælg K-lærer og indlæs elevliste for at se status.';
    else hint.textContent = `Status for ${meIni || 'aktiv'}'s K-gruppe (${nTot} elev${nTot===1?'':'er'}):`;
  }

  // Markerede elevrådsrepræsentanter (typisk få)
  const erMarkedEl = document.getElementById('importERMarked');
  if (erMarkedEl) {
    erMarkedEl.textContent = markedER.length ? `Markeret: ${markedER.join(', ')}` : 'Ingen markeret';
  }

  // Values + "mangler" hint
  setVal('importStatsSang', `${doneS}/${nTot}`);
  setVal('importStatsGym', `${doneG}/${nTot}`);
  setVal('importStatsElevraad', `${doneE}/${nTot}`);
  setVal('importMissSang', nTot ? `(mangler ${missing.sang.length})` : '');
  setVal('importMissGym',  nTot ? `(mangler ${missing.gym.length})` : '');
  setVal('importMissER',   nTot ? `(mangler ${missing.elevraad.length})` : '');

  setList('importMissingSang', missing.sang);
  setList('importMissingGym',  missing.gym);
  setList('importMissingElevraad', missing.elevraad);

  // Colored dots (ok/warn/bad)
  const dotClass = (done, tot) => {
    if (!tot) return 'none';
    if (done === 0) return 'bad';
    const pct = done / tot;
    if (pct >= 0.9) return 'ok';
    return 'warn';
  };
  const setDot = (id, cls) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('ok','warn','bad','none');
    el.classList.add(cls);
  };
  setDot('dotSang', dotClass(doneS, nTot));
  setDot('dotGym',  dotClass(doneG, nTot));
  setDot('dotER',   dotClass(doneE, nTot));

  // Wire toggles once (Sang/Gym)
  const wireToggle = (btnId, boxId) => {
    const btn = document.getElementById(btnId);
    const box = document.getElementById(boxId);
    if (!btn || !box) return;
    if (btn.dataset.wired === '1') return;
    btn.dataset.wired = '1';
    btn.addEventListener('click', () => {
      const isHidden = box.style.display === 'none';
      box.style.display = isHidden ? 'block' : 'none';
      btn.textContent = isHidden ? 'Skjul manglende' : 'Vis manglende';
    });
  };
  wireToggle('btnToggleMissingSang', 'importMissingSang');
  wireToggle('btnToggleMissingGym',  'importMissingGym');


  // Disable controls if no data
  const setDisabled = (btnId) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled = !nTot;
    btn.style.opacity = nTot ? '1' : '.5';
  };
  setDisabled('btnToggleMissingSang');
  setDisabled('btnToggleMissingGym');
  // (Elevråd har ingen "vis manglende" knap i UI – men hold logikken robust)
}

function renderSettings() {
    const s = getSettings();
    const t = getTemplates();
    const studs = getStudents();
    const isAll = state.viewMode === 'ALL';
    // Build k-grupper (teacher pairs) once; later UI uses this.
    const kGroups = buildKGroups(studs);
    state.__kGroups = kGroups;
    if (state.kGroupIndex < 0) state.kGroupIndex = 0;
    if (state.kGroupIndex > Math.max(0, kGroups.length-1)) state.kGroupIndex = Math.max(0, kGroups.length-1);


    // Ensure correct subtab visibility
    if (typeof setSettingsSubtab === 'function') setSettingsSubtab(state.settingsSubtab);

    $('forstanderName').value = s.forstanderName || '';
    $('forstanderName').readOnly = !!s.forstanderLocked;
    $('btnToggleForstander').textContent = s.forstanderLocked ? '✏️' : '🔒';

    $('meInput').value = s.me || '';

    // Discreet guidance when a teacher hasn't been chosen yet (e.g. right after importing a backup)
    try {
      const info = document.getElementById('teacherInfoAfterImport');
      if (info) {
        const hasTeacher = ((s.me || '') + '').trim();
        info.style.display = hasTeacher ? 'none' : 'block';
      }
    } catch (_) {}
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
    const warnEl = $('studentsWarn');
    if (warnEl) {
      const miss = computeMissingKTeacher(studs);
      if (miss.length) {
        const ex = miss.slice(0,3).map(st => `${escapeHtml(st.fornavn||'')} ${escapeHtml(st.efternavn||'')}`.trim()).filter(Boolean);
        warnEl.style.display = 'block';
        warnEl.innerHTML = `⚠️ <b>Tjek manglende data i CSV</b><div class="small muted" style="margin-top:.25rem">${miss.length} elev(er) mangler K-lærere (Kontaktlærer1/2).${ex.length? '<br>Fx: '+ex.join(', '):''}</div>`;
      } else {
        warnEl.style.display = 'none';
        warnEl.textContent = '';
      }
    }


    // Hvis vi er på Eksport, så render/refresh også flueben-tabellen her,
    // så den ikke "hænger" på en gammel status efter import af students.csv.
    if (state.settingsSubtab === 'export') {
      try { renderMarksTable(); } catch (e) { /* no-op */ }
    }

    const meNorm = normalizeName((s.meResolved || s.me || '').toString());
    if (studs.length && meNorm) {
      const count = studs.filter(st => normalizeName(toInitials(st.kontaktlaerer1_ini)) === meNorm || normalizeName(toInitials(st.kontaktlaerer2_ini)) === meNorm).length;
      $('contactCount').value = String(count);
      // persist contact group count for placeholders
      const s0 = getSettings();
      if (String(s0.contactGroupCount||'') !== String(count)) { s0.contactGroupCount = String(count); setSettings(s0); }
    } else {
      $('contactCount').value = '';
      const s0 = getSettings();
      if (s0.contactGroupCount) { s0.contactGroupCount = ''; setSettings(s0); }
    }

        // ---- Import-status for faglærer-vurderinger (Sang/Gymnastik/Elevråd) ----
    updateImportStatsUI();

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

  // Roller
  const list = document.getElementById('rolesList') || document.getElementById('gymRolesList');
  if (!list) return;
  if (!list.dataset._boundInput) {
    list.dataset._boundInput = '1';
    list.addEventListener('input', (e) => {
      const t = e.target;
      if (t && t.classList && t.classList.contains('roleText')) commitSnippetsFromUI('roller');
    });
  }
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
          <input class="roleLabel" type="text" value="${escapeHtml(it.title || key)}" readonly disabled>
        </div>
        <div class="field" style="flex:2;min-width:280px">
          <label>Tekst</label>
          <textarea class="roleText" rows="3">${escapeHtml((it.text_m || it.text_k || ''))}</textarea>
        </div>
        
      </div>
    `;
    list.appendChild(row);
  });
    // Sync optional local print-logo test UI
    try { syncPrintLogoTestUI(); } catch (_) {}

}

function escapeHtml(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}


// ---------- Teacher shortcut (header) ----------
function goToGeneralSettingsForTeacher(){
  try {
    setTab('set');
    setSettingsSubtab('general');
  } catch(_) {}
  // Focus + open K-lærer picker
  focusTeacherPickerAutoOpen();
}

function renderTeacherShortcutButton(hostEl, who){
  if (!hostEl) return;
  const title = "Skift K-lærer (Indstillinger → Generelt)";
  const label = (who || '—') + '';
  hostEl.classList.add('teacherRightHost');
  if (hostEl.parentElement) hostEl.parentElement.classList.add('teacherRightWrap');
  hostEl.innerHTML = '';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'teacherShortcutBtn';
  btn.title = title;
  btn.setAttribute('aria-label', title);
  btn.innerHTML = `<span class="teacherShortcutIcon">✏️</span><span class="teacherShortcutName">${escapeHtml(label)}</span>`;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    goToGeneralSettingsForTeacher();
  });
  hostEl.appendChild(btn);
}
// ----------------------------------------------


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
    overrides.gym = { variants, variantOrder: ['G1','G2','G3'] };
  }

  if (scope === 'roller') {
    const roles = {};
    Array.from(document.querySelectorAll('[data-role-key]')).forEach(row => {
      const key = row.getAttribute('data-role-key');
      if (!key) return;
      roles[key] = { label: key, text: (row.querySelector('.roleText')?.value || '').trim() };
    });
    overrides.roller = { roles, roleOrder: Object.keys(roles) };
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
    // Faglærer-markeringer (til små indikatorer på elevkort)
    const marksS = getMarks(KEYS.marksSang);
    const marksG = getMarks(KEYS.marksGym);
    const marksE = getMarks(KEYS.marksElev);
    const isTruthy = (v) => {
      if (v === true) return true;
      if (v === 1) return true;
      if (typeof v === 'string') return v.trim().length > 0;
      return false;
    };
    const hasAnyTruthyValue = (obj) => {
      if (!obj || typeof obj !== 'object') return false;
      return Object.values(obj).some(isTruthy);
    };
    const isAll = state.viewMode === 'ALL';
    // Build k-grupper (teacher pairs) once; later UI uses this.
    const kGroups = buildKGroups(studs);
    state.__kGroups = kGroups;
    if (state.kGroupIndex < 0) state.kGroupIndex = 0;
    if (state.kGroupIndex > Math.max(0, kGroups.length-1)) state.kGroupIndex = Math.max(0, kGroups.length-1);

    // K-lærer-identitet er initialer (persondata-sikkert). Filtrér på elevernes k-lærer-initialer.
    const meRaw = ((s.me || '') + '').trim();
    const meIni = toInitials(meRaw);
    const meResolvedRaw = meIni || meRaw;
    const minePreview = isAll
      ? studs.slice()
      : (meIni
        ? studs.filter(st => toInitials(st.kontaktlaerer1_ini) === meIni || toInitials(st.kontaktlaerer2_ini) === meIni)
        : []);
    const kBox = $('kMessage');
    const kMsg = $('kMsgHost');
    if (kBox) kBox.classList.remove('compact');
    const kList = $('kList');

    // If "Initialer" is not confirmed yet, show an inline input that commits on ENTER.
    // User may type initials OR full name; we only update settings when ENTER is pressed.
    if (!(((s.me || '') + '').trim())) {
      state.visibleKElevIds = [];
      if (kList) kList.innerHTML = '';

      const draft = (state.kMeDraft || '').trim();

      if (kMsg) {
        kMsg.innerHTML = `<div class="row between alignCenter" style="gap:1rem; flex-wrap:wrap;">
        <div class="row alignCenter" style="gap:.7rem; flex-wrap:wrap;">
          <div><b>${minePreview.length} match:</b> <span class="pill">${escapeHtml(meResolvedRaw || s.me || '')}</span></div>
          <div class="muted small">
            Kontaktlærer1/2 matcher initialer.
            <span id="kStatusLine" class="muted"></span>
          </div>
        </div>
        <div class="muted small" id="kProgLine"></div>
      </div>`;
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

          const match = resolveTeacherMatch(raw);
          const resolved = match.resolved || raw;

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
    const meResolvedConfirmed = ((s.meResolvedConfirmed || '') + '').trim();
    const kHeaderInfo = $("kHeaderInfo");
    const meNorm = normalizeName(meResolvedConfirmed || meResolvedRaw);

    // --- ALL-mode navigation (K-grupper) ---
    // In ALL mode we show one K-gruppe at a time with ◀︎ / ▶︎ navigation.
    // In K mode we hide the nav-row and keep the existing header/print placement.
    (function syncAllNav(){
      const navRow = $("kAllNavRow");
      const navLabel = $("kAllNavLabel");
      const navRight = $("kAllNavRight");
      const titleActions = $("kTitleActions");
      const btnPrint = $("btnPrintAllK");
      const btnPrev = $("btnPrevGroup");
      const btnNext = $("btnNextGroup");

      if (!navRow || !navLabel || !navRight || !titleActions || !btnPrint || !btnPrev || !btnNext) return;

      // Print button lives in the title row in both modes.
// Label differs so users can tell what will be printed.
try {
  if (isAll) {
    const totalGroups = kGroups.length || 0;
    const gi = Math.max(0, Math.min(state.kGroupIndex || 0, Math.max(0, totalGroups - 1)));
    const g = kGroups[gi];
    const key = g ? g.key : '—';
    btnPrint.textContent = `🖨️ Print ${key} · K-gruppe ${gi+1}/${totalGroups}`;
    btnPrint.title = 'Udskriv den aktive K-gruppe som én samlet udskrift';
  } else {
	    const sNow = getSettings();
	    const meIniNow = toInitials(((sNow.meResolvedConfirmed || sNow.meResolved || sNow.me || '') + '').trim()) || '—';
	    const visibleCount = (typeof getVisibleKElevIds === 'function') ? (getVisibleKElevIds().length || 0) : 0;
	    btnPrint.textContent = `🖨️ Print ${meIniNow}'s ${visibleCount} K-elever`;
	    btnPrint.title = 'Udskriv dine K-elever som én samlet udskrift';
  }
  if (btnPrint.parentElement !== titleActions) titleActions.appendChild(btnPrint);
} catch(_) {}

// Default: hidden
      navRow.style.display = isAll ? '' : 'none';

      if (!isAll) return;

      const totalGroups = kGroups.length || 0;
      const gi = Math.max(0, Math.min(state.kGroupIndex || 0, Math.max(0, totalGroups - 1)));
      state.kGroupIndex = gi;

      // Progress = how many students have *any* text (U/P/K)
      const totalStudents = studs.length || 0;
      let edited = 0;
      for (const st of studs) {
        const t = getTextFor(st.unilogin);
        const hasAny = !!((t.elevudvikling||'').trim() || (t.praktisk||'').trim() || (t.kgruppe||'').trim());
        if (hasAny) edited++;
      }

      // Center-label bliver sat senere (efter vi har beregnet udfyldt-status for den aktive gruppe)
      navLabel.textContent = '';

      // Arrow labels show the *target* group (like student prev/next in Redigér)
const prevKey = (gi > 0 && kGroups[gi-1]) ? (kGroups[gi-1].key || '—') : '';
const nextKey = (gi < totalGroups - 1 && kGroups[gi+1]) ? (kGroups[gi+1].key || '—') : '';

if (gi > 0) {
  btnPrev.style.visibility = 'visible';
  btnPrev.textContent = `◀ ${prevKey}`;
} else {
  btnPrev.style.visibility = 'hidden';
  btnPrev.textContent = '◀';
}

if (gi < totalGroups - 1) {
  btnNext.style.visibility = 'visible';
  btnNext.textContent = `${nextKey} ▶`;
} else {
  btnNext.style.visibility = 'hidden';
  btnNext.textContent = '▶';
}

      if (!btnPrev.__wired) {
        btnPrev.__wired = true;
        btnPrev.addEventListener('click', () => {
          if (state.kGroupIndex > 0) state.kGroupIndex -= 1;
          renderKList();
        });
      }
      if (!btnNext.__wired) {
        btnNext.__wired = true;
        btnNext.addEventListener('click', () => {
          if (state.kGroupIndex < kGroups.length - 1) state.kGroupIndex += 1;
          renderKList();
        });
      }
    })();

    // If we landed here directly (e.g. reload with confirmed name), the dashed box
    // may still be empty because it's normally populated in the "not confirmed" branch.
    // Ensure the status/progress lines exist so we don't show an empty placeholder.
    if (kMsg && (!$("kStatusLine") || !$("kProgLine"))) {
      kMsg.innerHTML = `
	        <div class="k-row" style="align-items:center; gap:10px;">
	          <div id="kStatusLine" class="muted small"></div>
	        </div>
        <div id="kProgLine" class="muted small" style="margin-top:6px;"></div>
      `;
    }

    // Build list
    // - K mode: show only my K-elever
    // - ALL mode: show current K-gruppe (state.kGroupIndex)
    const mineList = isAll
      ? ((kGroups[state.kGroupIndex] && kGroups[state.kGroupIndex].students) ? kGroups[state.kGroupIndex].students.slice() : [])
      : sortedStudents(studs).filter(st => normalizeName(toInitials(st.kontaktlaerer1_ini)) === meNorm || normalizeName(toInitials(st.kontaktlaerer2_ini)) === meNorm);
    // Sortér altid alfabetisk efter fornavn i den viste liste
    mineList.sort((a,b)=>(a.fornavn||'').localeCompare(b.fornavn||'', 'da') || (a.efternavn||'').localeCompare(b.efternavn||'', 'da'));


const prog = mineList.reduce((acc, st) => {
      const f = getTextFor(st.unilogin);
      acc.u += (f.elevudvikling||'').trim()?1:0;
      acc.p += (f.praktisk||'').trim()?1:0;
      acc.k += (f.kgruppe||'').trim()?1:0;
      return acc;
    }, {u:0,p:0,k:0});

    const progEl = $("kProgLine");
    if (progEl) {
      const core = `Udvikling: ${prog.u} af ${mineList.length} · Praktisk: ${prog.p} af ${mineList.length} · K-gruppe: ${prog.k} af ${mineList.length}`;
      const txt = `${core}`;
      // I ALL-visning viser vi KUN "core" i midten (uden "Udfyldt indtil nu"), så linjen ikke bliver for høj.
      progEl.textContent = txt;
      progEl.style.display = isAll ? 'none' : '';
      // I K-visning centrerer vi linjen i den stiplede boks.
      progEl.style.textAlign = isAll ? '' : 'center';
      const navLabel = $("kAllNavLabel");
      if (isAll && navLabel) navLabel.textContent = core;
    }

    const statusEl = $("kStatusLine");
    if (statusEl) statusEl.textContent = "";
    if (kHeaderInfo) {
      const fullName = ((s.meFullName || '') + '').trim();
      const ini = ((meResolvedConfirmed || meRaw || '') + '').trim();
      const who = (fullName || ini || '—');
      // Mindre dobbeltinfo: kun blyant + navn/initialer
      renderTeacherShortcutButton(kHeaderInfo, who);
    }

    if (kList) {
      kList.innerHTML = mineList.map((st, idx) => {
        const full = `${st.fornavn || ''} ${st.efternavn || ''}`.trim();
        const free = getTextFor(st.unilogin);
        const hasU = !!(free.elevudvikling || '').trim();
        const hasP = !!(free.praktisk || '').trim();
        const hasK = !!(free.kgruppe || '').trim();
        const hasUPK = !!(hasU && hasP && hasK);

        // ALL-mode status: U · P · K → initials (last editor)
        const lastBy = ((free.lastEditedBy || '') + '').trim();
        const letters = [hasU ? 'U' : '', hasP ? 'P' : '', hasK ? 'K' : ''].filter(Boolean).join(' · ');
        // Status on cards: show only filled letters, and (when available) last editor initials.
        // We show this in BOTH views so imported colleague-edits remain visible in K-visning.
        const statusRight = letters
          ? `${letters}${lastBy ? ` → ${escapeHtml(lastBy)}` : ''}`
          : '';

        // Indikér om der ER importeret/markeret Sang/Gym/Elevråd for eleven
        const u = st.unilogin || '';
        const mS = marksS[u] || {};
        const mG = marksG[u] || {};
        const mE = marksE[u] || {};
        const hasS = isTruthy(mS.sang_variant) || isTruthy(mS.variant) || mS.S1 === true || mS.S2 === true || mS.S3 === true || hasAnyTruthyValue(mS);
        const hasG = !!(mG.gym_variant || mG.variant || mG.gym || mG.G1 || mG.G2 || mG.G3);
        const hasE = isTruthy(mE.elevraad_variant) || isTruthy(mE.variant) || isTruthy(mE.elevraad) || hasAnyTruthyValue(mE);
        const isComplete = !!(hasUPK && hasS && hasG);
        const hasAnyProgress = !!(hasU || hasP || hasK || hasS || hasG || hasE);
        const isWip = !!(hasAnyProgress && !isComplete);
        const markLabels = [hasS ? 'Sang' : '', hasG ? 'Gym' : '', hasE ? 'Elevråd' : ''].filter(Boolean);
        const marksLine = markLabels.length ? ` · ${markLabels.join(' · ')}` : '';

        return `
          <div class="card clickable ${((idx === state.kActiveIndex) ? "kbActive " : "")}${isComplete ? "complete" : (isWip ? "wip" : "")}" data-unilogin="${escapeAttr(st.unilogin)}">
            <div class="cardTopRow">
              <div class="cardTitle"><b>${escapeHtml(full)}</b></div>
              ${isComplete ? `<span class="dot done" title="Færdig: U, P og K er udfyldt."></span>` : (isWip ? `<span class="dot wip" title="Undervejs: der er indhold, men ikke alt er færdigt endnu."></span>` : ``)}
              <div class="cardFlags muted small">${statusRight}</div>
            </div>
            <div class="cardSub muted small">${escapeHtml(formatClassLabel(st.klasse || '') + marksLine)}</div>
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
    const isAll = state.viewMode === 'ALL';
    // Build k-grupper (teacher pairs) once; later UI uses this.
    const kGroups = buildKGroups(studs);
    state.__kGroups = kGroups;
    if (state.kGroupIndex < 0) state.kGroupIndex = 0;
    if (state.kGroupIndex > Math.max(0, kGroups.length-1)) state.kGroupIndex = Math.max(0, kGroups.length-1);

    // In ALL-mode we navigate within the currently selected K-gruppe.
    if (isAll) {
      const g = kGroups[state.kGroupIndex];
      if (!g || !g.students) return [];
      return g.students.map(st => st.unilogin);
    }

    const meNorm = normalizeName((s.meResolved || s.me || '').toString());
    if (!studs.length || !meNorm) return [];
    return sortedStudents(studs)
      .filter(st => normalizeName(toInitials(st.kontaktlaerer1_ini)) === meNorm || normalizeName(toInitials(st.kontaktlaerer2_ini)) === meNorm)
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
    const isAll = state.viewMode === 'ALL';
    // Build k-grupper (teacher pairs) once; later UI uses this.
    const kGroups = buildKGroups(studs);
    state.__kGroups = kGroups;
    if (state.kGroupIndex < 0) state.kGroupIndex = 0;
    if (state.kGroupIndex > Math.max(0, kGroups.length-1)) state.kGroupIndex = Math.max(0, kGroups.length-1);

    const msg = $('editMessage');
    const hint = $('editHint');
    const navRow = $('editNavRow');
    const pill = $('editStudentPill');
    const bPrev = $('btnPrevStudent'); const bNext = $('btnNextStudent');
    const editHeaderInfo = $('editHeaderInfo');
    if (editHeaderInfo) {
      const s = getSettings();
      const fullName = ((s.meFullName || '') + '').trim();
      const meResolvedConfirmed = ((s.meResolvedConfirmed || '') + '').trim();
      const meRaw = ((s.me || '') + '').trim();
      const meIni = toInitials(meRaw);
      const who = (fullName || meResolvedConfirmed || meIni || meRaw || '—');
      renderTeacherShortcutButton(editHeaderInfo, who);
    }

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

	    // Update "Print elev" button label to include the active student's first name.
	    const btnPrintOne = $('btnPrint');
	    if (btnPrintOne) {
	      const fn = (st.fornavn || '').trim();
	      btnPrintOne.textContent = fn ? `🖨️ Print ${fn}` : '🖨️ Print elev';
	      btnPrintOne.title = fn ? `Udskriv udtalelsen for ${fn}` : 'Udskriv udtalelsen for den aktive elev';
	    }
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
    // A: Auto-fokus i Udvikling når Redigér åbnes via tastatur (Enter fra K-elever).
    if (state && state.__editOpenedByKeyboard) {
      state.__editOpenedByKeyboard = false;
      // Sørg for at sektionen er åben (Model 1: fold ikke andre sammen).
      const d = $('secElevudv'); if (d) d.open = true;
      setTimeout(() => {
        const el = $('txtElevudv');
        if (el) {
          try { el.focus(); } catch(_) {}
          try { const v = el.value || ''; el.setSelectionRange(v.length, v.length); } catch(_) {}
        }
      }, 0);
    }

    // Keep layout stable: the pill is always present, but hidden when empty.
    const as = $('autosavePill');
    if (as) {
      if (t.lastSavedTs) {
        as.textContent = `Sidst gemt: ${formatTime(t.lastSavedTs)}`;
        as.style.visibility = 'visible';
      } else {
        as.textContent = 'Sidst gemt:';
        as.style.visibility = 'hidden';
      }
    }

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

    const btnPick = $('btnPickStudentPdf');
    const btnOpen = $('btnOpenStudentInput');
    const btnClear = $('btnClearStudentInput');

    // PDF-knapper: Som ønsket
    // - Ingen PDF valgt: vis kun "Vælg PDF…"
    // - PDF valgt og kan åbnes (har URL): vis "Åbn i nyt vindue" + "Fjern"
    const hasReadyPdf = !!hasInputUrl;

    if (btnPick) {
      btnPick.textContent = 'Vælg PDF…';
      btnPick.style.display = hasReadyPdf ? 'none' : '';
      btnPick.disabled = false;
    }
    if (btnOpen) {
      btnOpen.textContent = 'Åbn i nyt vindue';
      btnOpen.style.display = hasReadyPdf ? '' : 'none';
      btnOpen.disabled = !hasReadyPdf;
    }
    if (btnClear) {
      btnClear.textContent = 'Fjern';
      btnClear.style.display = hasReadyPdf ? '' : 'none';
      btnClear.disabled = !hasReadyPdf;
    }

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
    const typeEl = $('marksType');
    const searchEl = $('marksSearch');
    const legendEl = $('marksLegend');
    const pickTextForStudent = (snippet, st) => {
      if (!snippet) return '';
      const pr = pronouns(st.koen || st.gender || st.sex || '');
      const isFemale = pr && pr.HAN_HUN === 'hun';
      return (isFemale ? (snippet.text_k || snippet.text_m || '') : (snippet.text_m || snippet.text_k || ''));
    };
    const placeholderMapFor = (st) => {
      const full = `${st.fornavn||''} ${st.efternavn||''}`.trim();
      const first = (st.fornavn||'').trim() || full.split(' ')[0] || '';
      const pr = pronouns(st.koen || st.gender || st.sex || '');
      return {
        "FORNAVN": first,
        "ELEV_FORNAVN": first,
        "ELEV_NAVN": full,
        "ELEV_FULDE_NAVN": full,
        "HAN_HUN": pr.HAN_HUN,
        "HAM_HENDE": pr.HAM_HENDE,
        "HANS_HENDES": pr.HANS_HENDES,
        "HAN_HUN_CAP": pr.HAN_HUN_CAP,
        "HAM_HENDE_CAP": pr.HAM_HENDE_CAP,
        "HANS_HENDES_CAP": pr.HANS_HENDES_CAP,
        "SIG_HAM_HENDE": pr.SIG_HAM_HENDE
      };
    };
    const previewFor = (st, rawText) => {
      let txt = (rawText || '').trim();
      if (!txt) return '';
      // Support legacy placeholder style: {(HAN_HUN)} etc. -> {HAN_HUN}
      txt = txt.replace(/\{\(\s*([^{}()]+?)\s*\)\}/g, '{$1}')
               .replace(/\{\{\(\s*([^{}()]+?)\s*\)\}\}/g, '{{$1}}');
      // Apply placeholders (same engine as the print-template)
      let out = applyPlaceholders(txt, placeholderMapFor(st)).trim();
      // Make preview readable (only for tooltip): insert line breaks after sentence ends.
      out = out.replace(/([.!?])\s+/g, '$1\n\n');
      // Avoid extreme whitespace
      out = out.replace(/[\t\r]+/g, ' ').trim();
      return out;
    }; // (ellers føles knapperne 'døde').
    const hasStudents = !!(studs && studs.length);
    const disableWithHint = (id, disabled, hint) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.disabled = !!disabled;
      // Preserve original title when enabled.
      if (!el.dataset._origTitle) el.dataset._origTitle = el.getAttribute('title') || '';
      el.setAttribute('title', disabled ? (hint || 'Indlæs først elevliste (students.csv).') : el.dataset._origTitle);
      el.classList.toggle('disabled', !!disabled);
    };
    // Export/print depends on students. Backup should stay available.
    disableWithHint('btnExportMarks', !hasStudents, 'Indlæs først elevliste (students.csv), før du kan eksportere.');
    disableWithHint('btnPrintAllStudents', !hasStudents, 'Indlæs først elevliste (students.csv), før du kan printe.');
    disableWithHint('btnPrintAllGroups', !hasStudents, 'Indlæs først elevliste (students.csv), før du kan printe.');

    // Sticky kolonneheader i eksport-tabellen (marks)
    if (!document.getElementById('marksStickyCss')) {
      const st = document.createElement('style');
      st.id = 'marksStickyCss';
      st.textContent = `
        #marksTableWrap { overflow:auto; max-height:70vh; }
        #marksTableWrap table { border-collapse: separate; border-spacing: 0; }
        #marksTableWrap thead th { position: sticky; top: 0; z-index: 5; background: rgba(14,18,24,0.98); }
      `;
      document.head.appendChild(st);
    }


    // Keep kGroups cached for K-grp labels
    const kGroups = buildKGroups(studs);
    window.__kGroupsCache = kGroups;

    // Tabs for marks type (Sang/Gymnastik/Elevråd)
    const tabs = $('marksTypeTabs');
    if (tabs && typeEl){
      tabs.querySelectorAll('button.tab').forEach(btn=>{
        btn.onclick = ()=>{
          const t = btn.dataset.type;
          if (t && typeEl.value !== t){
            typeEl.value = t;
            renderMarksTable();
          }
        };
      });
      tabs.querySelectorAll('button.tab').forEach(btn=>{
        btn.classList.toggle('active', btn.dataset.type === (typeEl.value || 'sang'));
      });
    }

    const type = (typeEl && typeEl.value) ? typeEl.value : 'sang';

    const storageKey = (type === 'sang') ? KEYS.marksSang : (type === 'gym' || type === 'roller') ? KEYS.marksGym : KEYS.marksElev;
    const q = normalizeName((searchEl && searchEl.value) ? searchEl.value : '').trim();

    if (!studs || !studs.length){
      wrap.innerHTML = `<div class="muted small">Indlæs først elevliste (students.csv).</div>`;
      legendEl.textContent = '';
      return;
    }



    let list = sortedStudents(studs).filter(st => {
      if (!q) return true;
      const fn = normalizeName(st.fornavn || '');
      const en = normalizeName(st.efternavn || '');
      const full = normalizeName(`${st.fornavn} ${st.efternavn}`);
      // Mere forudsigelig filtrering: start på fornavn/efternavn (og evt. fuldt navn)
      return fn.startsWith(q) || en.startsWith(q) || full.startsWith(q);
    });

    // --- Sortering (3-state) på K-grp / Klasse ---
    if (!state.marksSort) state.marksSort = { key: null, dir: 0 };

    const kgrpLabel = (st) => {
      // Always show initials-based group key (e.g. AB/EB), even if CSV stores full teacher names.
      const a = (st.kontaktlaerer1_ini || '').toString().trim();
      const b = (st.kontaktlaerer2_ini || '').toString().trim();
      return groupKeyFromTeachers(a, b);
    };

    function klasseSortKey(v){
      const s = (v || '').toString().trim().toUpperCase();
      const m = s.match(/^(\d+)\s*([A-ZÆØÅ]*)$/);
      if (!m) return { t: 1, s };
      return { t: 0, n: parseInt(m[1],10) || 0, suf: m[2] || '' };
    }

    // Anvend sortering hvis aktiv
    if (state.marksSort && state.marksSort.key && state.marksSort.dir) {
      const dir = state.marksSort.dir;
      const key = state.marksSort.key;
      const cmp = (a,b) => {
        if (key === 'kgrp') {
          return kgrpLabel(a).localeCompare(kgrpLabel(b), 'da');
        }
        if (key === 'klasse') {
          const ka = klasseSortKey(a.klasse);
          const kb = klasseSortKey(b.klasse);
          if (ka.t !== kb.t) return ka.t - kb.t;
          if (ka.t === 0) {
            if (ka.n !== kb.n) return ka.n - kb.n;
            return (ka.suf || '').localeCompare((kb.suf || ''), 'da');
          }
          return (ka.s || '').localeCompare((kb.s || ''), 'da');
        }
        return 0;
      };
      list = [...list].sort((a,b) => dir * cmp(a,b));
    }

    function renderTick(unilogin, key, on, tooltip){
      const pressed = on ? 'true' : 'false';
      const cls = 'tickbox' + (on ? ' on' : '');
      // data-u/data-k bruges af click-handleren på marks-tabellen
      return `<td class="cb"><button type="button" class="${cls}" data-u="${escapeAttr(unilogin)}" data-k="${escapeAttr(key)}" aria-pressed="${pressed}" data-tip="${escapeAttr(tooltip||'')}"><span class="check">✓</span></button></td>`;
    }

    
    // --- Custom hover tooltip (multi-line). We don't use the browser title-tooltip because it can't wrap nicely.
    let _hoverTipEl = null;
    function ensureHoverTipEl(){
      if (_hoverTipEl) return _hoverTipEl;
      const el = document.createElement('div');
      el.className = 'hoverTip';
      el.style.display = 'none';
      document.body.appendChild(el);
      _hoverTipEl = el;
      return el;
    }
    function showHoverTip(text, x, y){
      if (!text) return;
      const el = ensureHoverTipEl();
      el.textContent = text;
      el.style.display = 'block';
      // position with clamping
      const pad = 12;
      const rect = el.getBoundingClientRect();
      let left = x + pad;
      let top  = y + pad;
      const maxLeft = window.innerWidth - rect.width - 8;
      const maxTop  = window.innerHeight - rect.height - 8;
      if (left > maxLeft) left = Math.max(8, x - rect.width - pad);
      if (top  > maxTop)  top  = Math.max(8, y - rect.height - pad);
      el.style.left = left + 'px';
      el.style.top  = top  + 'px';
    }
    function hideHoverTip(){
      if (!_hoverTipEl) return;
      _hoverTipEl.style.display = 'none';
    }
    function bindMarksHoverTips(container){
      if (!container || container.dataset._hoverTipsBound) return;
      container.dataset._hoverTipsBound = '1';

      let currentBtn = null;

      container.addEventListener('mousemove', (e) => {
        if (!currentBtn) return;
        const tip = currentBtn.getAttribute('data-tip') || '';
        if (!tip) return;
        showHoverTip(tip, e.clientX, e.clientY);
      });

      container.addEventListener('mouseleave', () => {
        currentBtn = null;
        hideHoverTip();
      });

      container.addEventListener('mouseover', (e) => {
        const btn = e.target && e.target.closest ? e.target.closest('button[data-tip]') : null;
        if (!btn) return;
        const tip = btn.getAttribute('data-tip') || '';
        if (!tip) return;
        currentBtn = btn;
        showHoverTip(tip, e.clientX, e.clientY);
      });

      container.addEventListener('mouseout', (e) => {
        const btn = e.target && e.target.closest ? e.target.closest('button[data-tip]') : null;
        if (!btn) return;
        if (btn === currentBtn) {
          currentBtn = null;
          hideHoverTip();
        }
      });
    }

function tooltipTextFor(st, scope, key){
      try {
        let snip = null;
        if (scope === 'roller') snip = (SNIPPETS.roller || {})[key];
        else snip = (SNIPPETS[scope] || {})[key];
        if (!snip) return '';
        const p = pronouns(st.koen || st.køn || st.gender || '');
        const base = (p.HAN_HUN === 'hun' && snip.text_k) ? snip.text_k : (snip.text_m || snip.text_k || '');
        const filled = applyPlaceholders(base, Object.assign({ FORNAVN: st.fornavn || '' }, p));
        const flat = String(filled || '').trim().replace(/\s+/g,' ');
        if (!flat) return '';
        const pretty = flat.replace(/([.!?])\s+/g, '$1\n\n');
        const title = String(snip.title || key).trim();
        return (title ? (title + '\n\n') : '') + pretty;
      } catch(e) {
        return '';
      }
    }




    // Inline search i kolonneheaderen ("Navn").
    // Vi bruger en separat input (marksSearchInline) og spejler værdien til
    // den eksisterende skjulte marksSearch-input, så resten af logikken er intakt.
    function attachInlineMarksSearch(){
      const inline = document.getElementById('marksSearchInline');
      const clear  = document.getElementById('marksSearchInlineClear');
      if (!inline) return;

      // sync current value
      inline.value = (searchEl && searchEl.value) ? searchEl.value : '';
      if (clear) clear.hidden = !inline.value;

      const rerenderWithFocus = () => {
        // preserve caret
        const pos = inline.selectionStart ?? inline.value.length;
        setTimeout(() => {
          const ii = document.getElementById('marksSearchInline');
          if (!ii) return;
          try {
            ii.focus();
            ii.setSelectionRange(pos, pos);
          } catch(_){ /* no-op */ }
        }, 0);
      };

      inline.oninput = () => {
        if (searchEl) searchEl.value = inline.value;
        if (clear) clear.hidden = !inline.value;
        renderMarksTable();
        rerenderWithFocus();
      };

      if (clear) {
        clear.onclick = (e) => {
          e.preventDefault();
          inline.value = '';
          if (searchEl) searchEl.value = '';
          clear.hidden = true;
          renderMarksTable();
          rerenderWithFocus();
        };
      }
    }


    function attachMarksSortButtons(){
      const btnK = document.getElementById('marksSortKgrp');
      const btnC = document.getElementById('marksSortKlasse');
      const toggle = (key) => {
        if (!state.marksSort) state.marksSort = { key: null, dir: 0 };
        if (state.marksSort.key !== key) {
          state.marksSort.key = key;
          state.marksSort.dir = 1;
        } else {
          // cycle: none -> asc -> desc -> none
          if (!state.marksSort.dir) state.marksSort.dir = 1;
          else if (state.marksSort.dir === 1) state.marksSort.dir = -1;
          else state.marksSort.dir = 0;
        }
        renderMarksTable();
      };
      if (btnK) btnK.onclick = (e) => { e.preventDefault(); toggle('kgrp'); };
      if (btnC) btnC.onclick = (e) => { e.preventDefault(); toggle('klasse'); };
    }


    const nameTh = `
      <th class="nameTh">
        <div class="thName compact">
          <div class="thControl">
            <input id="marksSearchInline" type="text" placeholder="Søg navn…" title="Find elever ved at skrive hele eller dele af navnet" aria-label="Filtrer navn" autocomplete="off" />
            <button class="clearBtn" id="marksSearchInlineClear" title="Ryd" aria-label="Ryd" hidden>×</button>
          </div>
        </div>
      </th>`;

    const sortIcon = (key) => {
      if (!state.marksSort) state.marksSort = { key: null, dir: 0 };
      if (state.marksSort.key !== key || !state.marksSort.dir) return '';
      return state.marksSort.dir === 1 ? '↑' : '↓';
    };
    const thKgrp = `<th class="sortTh"><button type="button" class="sortBtn" id="marksSortKgrp" title="Sortér elever efter kontaktgruppe">K-grp<span class="sortIcon">${sortIcon('kgrp')}</span></button></th>`;
    const thKlasse = `<th class="sortTh"><button type="button" class="sortBtn" id="marksSortKlasse" title="Sortér elever efter klasse">Klasse<span class="sortIcon">${sortIcon('klasse')}</span></button></th>`;

    if (type === 'sang') {
      const marks = getMarks(KEYS.marksSang);
      $('marksLegend').textContent = '';
      const cols = ['S1','S2','S3'].filter(k => (SNIPPETS.sang||{})[k]);

      wrap.innerHTML = `
        <table>
          <thead>
            <tr>
              ${nameTh}${thKgrp}${thKlasse}
              ${cols.map((c,i) => `<th class="cb" title="${escapeAttr((SNIPPETS.sang[c]||{}).title||'')}"><span class="muted small">Niveau ${i+1}</span></th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${list.map(st => {
              const m = marks[st.unilogin] || {};
              const full = `${st.fornavn||''} ${st.efternavn||''}`.trim();
              return `<tr>
                <td>${escapeHtml(full)}</td>
                <td class="muted small">${escapeHtml(kgrpLabel(st))}</td>
                <td class="muted small">${escapeHtml(st.klasse||'')}</td>
                ${cols.map(c => renderTick(st.unilogin, c, ((m.sang_variant||'')===c), previewFor(st, pickTextForStudent(SNIPPETS.sang[c], st)))).join('')}
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      `;
      attachInlineMarksSearch();
      attachMarksSortButtons();
      bindMarksHoverTips(wrap);
      return;
    }

    if (type === 'gym' || type === 'roller') {
      const marks = getMarks(KEYS.marksGym);
      $('marksLegend').textContent = '';
      const cols = ['G1','G2','G3'].filter(k => (SNIPPETS.gym||{})[k]);

      wrap.innerHTML = `
        <table>
          <thead>
            <tr>
              ${nameTh}${thKgrp}${thKlasse}
              ${cols.map((c,i) => `<th class="cb" title="${escapeAttr((SNIPPETS.gym[c]||{}).title||'')}"><span class="muted small">${['Engageret','Stabil','Varierende'][i]||escapeHtml((SNIPPETS.gym[c]||{}).title||c)}</span></th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${list.map(st => {
              const m = marks[st.unilogin] || {};
              const full = `${st.fornavn||''} ${st.efternavn||''}`.trim();
              return `<tr>
                <td>${escapeHtml(full)}</td>
                <td class="muted small">${escapeHtml(kgrpLabel(st))}</td>
                <td class="muted small">${escapeHtml(st.klasse||'')}</td>
                ${cols.map(c => renderTick(st.unilogin, c, ((m.gym_variant||'')===c), previewFor(st, pickTextForStudent(SNIPPETS.gym[c], st)))).join('')}
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      `;
      attachInlineMarksSearch();
      attachMarksSortButtons();
      bindMarksHoverTips(wrap);
      return;
    }

    if (type === 'roller') {
      const marks = getMarks(KEYS.marksGym);
      $('marksLegend').textContent = '';
      const roleCodes = Object.keys(SNIPPETS.roller || {});

      wrap.innerHTML = `
        <table>
          <thead>
            <tr>
              ${nameTh}${thKgrp}${thKlasse}
              ${roleCodes.map(r => `<th class="cb" title="${escapeAttr((SNIPPETS.roller[r]||{}).hint||'')}"><span class="muted small">${escapeHtml((SNIPPETS.roller[r]||{}).title||r)}</span></th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${list.map(st => {
              const m = marks[st.unilogin] || {};
              const full = `${st.fornavn||''} ${st.efternavn||''}`.trim();
              const roles = Array.isArray(m.gym_roles) ? m.gym_roles : [];
              return `<tr>
                <td>${escapeHtml(full)}</td>
                <td class="muted small">${escapeHtml(kgrpLabel(st))}</td>
                <td class="muted small">${escapeHtml(st.klasse||'')}</td>
                ${roleCodes.map(r => renderTick(st.unilogin, 'role:'+r, roles.includes(r), previewFor(st, pickTextForStudent(SNIPPETS.roller[r], st)))).join('')}
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      `;
      attachInlineMarksSearch();
      attachMarksSortButtons();
      bindMarksHoverTips(wrap);
      return;
    }

    // elevraad
    const marks = getMarks(KEYS.marksElev);
    $('marksLegend').textContent = '';
    const cols = Object.keys(SNIPPETS.elevraad || {});

    wrap.innerHTML = `
      <table>
        <thead>
          <tr>
            ${nameTh}${thKgrp}${thKlasse}
            ${cols.map((c,i) => `<th class="cb" title="${escapeAttr((SNIPPETS.elevraad[c]||{}).title||'')}"><span class="muted small">${cols.length===1?'Elevråd':'Valg '+(i+1)}</span></th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${list.map(st => {
            const m = marks[st.unilogin] || {};
            const full = `${st.fornavn||''} ${st.efternavn||''}`.trim();
            return `<tr>
              <td>${escapeHtml(full)}</td>
              <td class="muted small">${escapeHtml(kgrpLabel(st))}</td>
              <td class="muted small">${escapeHtml(st.klasse||'')}</td>
              ${cols.map(c => renderTick(st.unilogin, c, ((m.elevraad_variant||'')===c), previewFor(st, pickTextForStudent(SNIPPETS.elevraad[c], st)))).join('')}
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
    attachInlineMarksSearch();
    attachMarksSortButtons();
    bindMarksHoverTips(wrap);
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
    on('tab-k','click', () => { if (state.tab === 'k') { state.viewMode = (state.viewMode === 'ALL') ? 'K' : 'ALL'; renderStatus(); renderKList(); updateTabLabels(); } else { setTab('k'); } });
    on('kTitleBtn','click', () => { state.viewMode = (state.viewMode === 'ALL') ? 'K' : 'ALL'; updateTabLabels(); renderStatus(); renderKList(); });
    // Redigér-tab er skjult når ingen elev er valgt, men vær robust hvis nogen alligevel klikker.
  on('tab-edit','click', async () => {
    // Ensure latest overrides are loaded and applied (unless the user has local edits)
    await loadRemoteOverrides();
    applyTemplatesFromOverridesToLocal({ force: false, preserveLocks: true });
    // Snippets are applied in-memory; clearLocalSnippetScope is not used here.
    applySnippetOverrides();
    setTab('edit');
  });
    on('tab-set','click', () => setTab('set'));

    // Indstillinger: subtabs
    const st = document.getElementById('settingsSubtabs');
    if (st) {
      st.addEventListener('click', (e) => {
        const b = e.target && e.target.closest && e.target.closest('button[data-subtab]');
        if (!b) return;
        setSettingsSubtab(b.dataset.subtab);
      });
    }

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

    on('btnReload','click', () => location.reload());

    on('btnReset','click', () => {
      if (!confirm('Ryd alle lokale data i denne browser?')) return;
      lsDelPrefix(LS_PREFIX);
      location.reload();
    });

    // Print-logo: lokalt test-logo (gemmes i localStorage, kan ryddes igen)
    const pickLogoBtn = document.getElementById('btnPickPrintLogo');
    const clearLogoBtn = document.getElementById('btnClearPrintLogo');
    const logoInput = document.getElementById('filePrintLogo');
    if (pickLogoBtn && logoInput) {
      pickLogoBtn.addEventListener('click', () => logoInput.click());
      logoInput.addEventListener('change', (e) => {
        const f = e && e.target && e.target.files ? e.target.files[0] : null;
        if (!f) return;
        // Basic guard: only images
        if (!String(f.type || '').startsWith('image/')) {
          alert('Vælg venligst en billedfil (PNG eller SVG).');
          return;
        }
        const fr = new FileReader();
        fr.onload = () => {
          const dataUrl = String(fr.result || '');
          if (!dataUrl) return;
          setLocalPrintLogoDataUrl(dataUrl);
          syncPrintLogoTestUI();
          // reset input so same file can be chosen again
          try { logoInput.value = ''; } catch(_) {}
        };
        fr.readAsDataURL(f);
      });
    }
    if (clearLogoBtn) {
      clearLogoBtn.addEventListener('click', () => {
        clearLocalPrintLogoDataUrl();
        syncPrintLogoTestUI();
      });
    }


async function loadDemoStudentsCsv() {
  const candidates = [
    'demo_students.csv',
    '/demo_students.csv',
    '../demo_students.csv'
  ];

  let text = null;
  let usedUrl = null;

  for (const url of candidates) {
    try {
      const r = await fetch(url, { cache: 'no-store' });
      if (r && r.ok) { text = await r.text(); usedUrl = url; break; }
    } catch (e) {}
  }

  if (!text) throw new Error('Kunne ikke hente demo_students.csv (prøvede: ' + candidates.join(', ') + ')');

  const parsed = parseCsv(text);
  const map = mapStudentHeaders(parsed.headers);
  const required = ['fornavn','efternavn','klasse'];
  if (!required.every(r => map[r])) {
    alert('Kunne ikke finde de nødvendige kolonner (fornavn, efternavn, klasse) i demo_students.csv.');
    return;
  }

      const teacherOverrides = buildTeacherOverrideMap(parsed.rows, map);
  const studentsRaw = parsed.rows.map(r => normalizeStudentRow(r, map, teacherOverrides));
  const students = canonicalizeTeacherInitials(studentsRaw);
  setStudents(students);

  renderSettings(); renderStatus();
  if (state.tab === 'k') renderKList();
  if (state.tab === 'edit') renderEdit();

  // Navigate to settings -> Generelt (vælg K-lærer)
  try {
    setTab('set');
    const btnGen = document.getElementById('settingsTab-general');
    if (btnGen) btnGen.click();
    focusTeacherPickerAutoOpen();
      } catch (_) {}

  console.log('Demo indlæst fra:', usedUrl);
}


on('btnLoadDemo','click', async () => {
  const ok = confirm('Indlæs demo? Dette rydder ALLE lokale data og kan ikke fortrydes.');
  if (!ok) return;

  // Wipe all app local data, then load demo CSV directly (no page reload)
  try {
    lsDelPrefix(LS_PREFIX);
    await loadDemoStudentsCsv();

    // After import, bring user to Generelt (like normal import flow)
    try {
      setTab('set');
      const btnGen = document.getElementById('settingsTab-general');
      if (btnGen) btnGen.click();
      focusTeacherPickerAutoOpen();
      } catch (_) {}
  } catch (e) {
    console.error(e);
    alert('Kunne ikke indlæse demo_students.csv. Se console for detaljer.');
  }
});
on('btnToggleForstander','click', () => {
      const s = getSettings();
      s.forstanderLocked = !s.forstanderLocked;
      setSettings(s);
      renderSettings();
    });
    on('forstanderName','input', () => {
      const s = getSettings();
      s.forstanderName = $('forstanderName').value;
      setSettings(s);
      renderStatus();
      if (state.tab === 'edit') renderEdit();
    });

    on('meInput','input', () => {
      // Do not commit identity on every keystroke; commit happens on ENTER (see teacher picker).
      const raw = $('meInput').value;
      const s = getSettings();
      s.meDraft = raw;
      setSettings(s);
      renderStatus();
    });
on('schoolYearEnd','input', () => {
      const s = getSettings();
      s.schoolYearEnd = Number($('schoolYearEnd').value || s.schoolYearEnd);
      setSettings(s);
      renderSettings();
      if (state.tab === 'edit') renderEdit();
    });

    on('btnToggleSchoolText','click', () => {
      const t = getTemplates();
      t.schoolTextLocked = !t.schoolTextLocked;
      setTemplates(t);
      renderSettings();
    });
    on('btnRestoreSchoolText','click', () => {
      // "Opdater" = hent nyeste overrides og læg dem i localStorage (med mindre brugeren har lokale edits)
      (async () => {
        await loadRemoteOverrides();
        applyTemplatesFromOverridesToLocal({ force: true, preserveLocks: true });
        renderSettings();
        if (state.tab === 'edit') renderEdit();
      })();
    });
    on('schoolText','input', () => {
      const t = getTemplates();
      t.schoolText = $('schoolText').value;
      setTemplates(t);
      setTemplatesDirty(true);
      if (state.tab === 'edit') renderEdit();
    });

    on('btnToggleTemplate','click', () => {
      const t = getTemplates();
      t.templateLocked = !t.templateLocked;
      setTemplates(t);
      renderSettings();
    });
    on('btnRestoreTemplate','click', () => {
      (async () => {
        await loadRemoteOverrides();
        applyTemplatesFromOverridesToLocal({ force: true, preserveLocks: true });
        renderSettings();
        if (state.tab === 'edit') renderEdit();
      })();
    });
    on('templateText','input', () => {
      const t = getTemplates();
      t.template = $('templateText').value;
      setTemplates(t);
      setTemplatesDirty(true);
      if (state.tab === 'edit') renderEdit();
    });

    // Del / importér skabeloner (leder)
    if (document.getElementById('btnExportTemplates')) {
      on('btnExportTemplates','click', () => {
        const pkg = buildOverridePackage('templates');
        downloadJson('templates_override.json', pkg);
      });
      if (document.getElementById('btnImportTemplates') && document.getElementById('fileImportTemplates')) {
        on('btnImportTemplates','click', () => $('fileImportTemplates').click());
        on('fileImportTemplates','change', async (e) => {
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
  on('elevraadText','input', () => commitSnippetsFromUI('elevraad'));
  syncMarksTypeTabs();

}

if (document.getElementById('btnDownloadSang')) {
  on('btnDownloadSang','click', () => {
    const pkg = buildOverridePackage('sang');
    downloadJson('snippets_sang_override.json', pkg);
  });
  if (document.getElementById('btnImportSang') && document.getElementById('fileImportSang')) {
    on('btnImportSang','click', () => $('fileImportSang').click());
    on('fileImportSang','change', async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const txt = await f.text();
    const obj = JSON.parse(txt);
    importOverridePackage('sang', obj);
    renderSettings();
    e.target.value = '';
    });
  }
  on('btnRestoreSang','click', async () => {
    await loadRemoteOverrides();
    clearLocalSnippetScope('sang');
    applySnippetOverrides();
    renderSettings();
    if (state.tab === 'edit') renderEdit();
  });
}

if (document.getElementById('btnDownloadGym')) {
  on('btnDownloadGym','click', () => {
    const pkg = buildOverridePackage('gym');
    downloadJson('snippets_gym_override.json', pkg);
  });
  if (document.getElementById('btnImportGym') && document.getElementById('fileImportGym')) {
    on('btnImportGym','click', () => $('fileImportGym').click());
    on('fileImportGym','change', async (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const txt = await f.text();
      const obj = JSON.parse(txt);
      importOverridePackage('gym', obj);
      renderSettings();
      e.target.value = '';
    });
  }
  if (document.getElementById('btnRestoreGym')) {
    on('btnRestoreGym','click', async () => {
      await loadRemoteOverrides();
      clearLocalSnippetScope('gym');
      applySnippetOverrides();
      renderSettings();
      if (state.tab === 'edit') renderEdit();
    });
  }
}

if (document.getElementById('btnDownloadRoller')) {
  on('btnDownloadRoller','click', () => {
    const pkg = buildOverridePackage('roller');
    downloadJson('snippets_roller_override.json', pkg);
  });
  if (document.getElementById('btnImportRoller') && document.getElementById('fileImportRoller')) {
    on('btnImportRoller','click', () => $('fileImportRoller').click());
    on('fileImportRoller','change', async (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const txt = await f.text();
      const obj = JSON.parse(txt);
      importOverridePackage('roller', obj);
      renderSettings();
      e.target.value = '';
    });
  }
  if (document.getElementById('btnRestoreRoller')) {
    on('btnRestoreRoller','click', async () => {
      await loadRemoteOverrides();
      clearLocalSnippetScope('roller');
      applySnippetOverrides();
      renderSettings();
      if (state.tab === 'edit') renderEdit();
    });
  }
}

if (document.getElementById('btnDownloadElevraad')) {
  on('btnDownloadElevraad','click', () => {
    const pkg = buildOverridePackage('elevraad');
    downloadJson('snippets_elevraad_override.json', pkg);
  });
  if (document.getElementById('btnImportElevraadSnippets') && document.getElementById('fileImportElevraadSnippets')) {
    on('btnImportElevraadSnippets','click', () => $('fileImportElevraadSnippets').click());
    on('fileImportElevraadSnippets','change', async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const txt = await f.text();
    const obj = JSON.parse(txt);
    importOverridePackage('elevraad', obj);
    renderSettings();
    e.target.value = '';
    });
  }
  on('btnRestoreElevraad','click', async () => {
    await loadRemoteOverrides();
    clearLocalSnippetScope('elevraad');
    applySnippetOverrides();
    renderSettings();
    if (state.tab === 'edit') renderEdit();
  });
}

    on('studentsFile','change', async (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const text = await readFileText(f);
      const parsed = parseCsv(text);
      const map = mapStudentHeaders(parsed.headers);
      const required = ['fornavn','efternavn','klasse'];
      const ok = required.every(r => map[r]);
      if (!ok) { alert('Kunne ikke finde de nødvendige kolonner (fornavn, efternavn, klasse).'); return; }

      // IMPORTANT:
      // We must honor per-row explicit initials overrides from the CSV columns
      // "Initialer for k-lærer1" / "Initialer for k-lærer2".
      // These overrides are tied to the corresponding contact teacher column
      // (Kontaktlærer1/Kontaktlærer2) and should become the canonical initials
      // for that full name across the entire dataset.
      const teacherOverrides = buildTeacherOverrideMap(parsed.rows, map);

      // Skip completely empty rows (no student name). Count skipped for feedback.
      let skippedEmpty = 0;
      let missingTeachers = 0;
      const missingTeacherNames = [];
      const validRows = [];
      for (const r of parsed.rows) {
        const fn = (r[map.fornavn] ?? '').toString().trim();
        const en = (r[map.efternavn] ?? '').toString().trim();
        if (!fn && !en) { skippedEmpty++; continue; }

        const k1 = (map.kontaktlaerer1 ? (r[map.kontaktlaerer1] ?? '') : '').toString().trim();
        const k2 = (map.kontaktlaerer2 ? (r[map.kontaktlaerer2] ?? '') : '').toString().trim();
        if (!k1 && !k2) {
          missingTeachers++;
          const nm = `${fn} ${en}`.trim() || '(ukendt elev)';
          if (missingTeacherNames.length < 12) missingTeacherNames.push(nm);
        }
        validRows.push(r);
      }

      const studentsRaw = validRows.map(r => normalizeStudentRow(r, map, teacherOverrides));
      const students = canonicalizeTeacherInitials(studentsRaw);
      setStudents(students);
      // Feedback in Import tab
      const statusEl = $('importStatus');
      if (statusEl) {
        const parts = [];
        if (skippedEmpty) parts.push(`Sprunget over ${skippedEmpty} tomme rækker.`);
        if (missingTeachers) {
          const list = missingTeacherNames.length ? ` (fx: ${missingTeacherNames.join(', ')})` : '';
          parts.push(`⚠️ ${missingTeachers} elever mangler kontaktlærer${list}.`);
        }
        statusEl.textContent = parts.length ? `✅ Elevliste indlæst. ${parts.join(' ')}` : '✅ Elevliste indlæst.';
      }


      renderSettings(); renderStatus();
      if (state.tab === 'k') renderKList();
      setTab('set');
    });

    on('marksType','change', () => renderMarksTable());
// Tabs (Sang/Gymnastik/Elevråd) should behave like changing the select.
    on('marksTypeTabs','click', (e) => {
      const btn = e.target && e.target.closest && e.target.closest('button[data-type]');
      if(!btn) return;
      const sel = $('marksType');
      if(!sel) return;
      const type = btn.getAttribute('data-type');
      if(!type) return;
      sel.value = type;
			  saveLS(KEYS.marksType, type);
      renderMarksTable();
    });

    on('btnExportMarks','click', () => {
      const type = $('marksType').value;
      const studs = getStudents();
    const isAll = state.viewMode === 'ALL';
    // Build k-grupper (teacher pairs) once; later UI uses this.
    const kGroups = buildKGroups(studs);
    state.__kGroups = kGroups;
    if (state.kGroupIndex < 0) state.kGroupIndex = 0;
    if (state.kGroupIndex > Math.max(0, kGroups.length-1)) state.kGroupIndex = Math.max(0, kGroups.length-1);

      if (!studs.length) return;
      const sorted = sortedStudents(studs);

      if (type === 'sang') {
        const marks = getMarks(KEYS.marksSang);
        const rows = sorted.map(st => {
          const full = `${st.fornavn} ${st.efternavn}`.trim();
          const m = marks[st.unilogin] || {};
          return { Unilogin: st.unilogin, Navn: full, Sang_variant: m.sang_variant || '' };
        });
        downloadText('sang_vurderinger.csv', toCsv(rows, ['Unilogin','Navn','Sang_variant']));
      }
      if (type === 'gym' || type === 'roller') {
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
        downloadText('gym_rolle_vurderinger.csv', toCsv(rows, headers));
      }
      if (type === 'elevraad') {
        const marks = getMarks(KEYS.marksElev);
        const rows = sorted.map(st => {
          const full = `${st.fornavn} ${st.efternavn}`.trim();
          const m = marks[st.unilogin] || {};
          return { Unilogin: st.unilogin, Navn: full, Elevraad: m.elevraad ? 1 : 0 };
        });
        downloadText('elevraad_vurderinger.csv', toCsv(rows, ['Unilogin','Navn','Elevraad']));
      }
    });

    on('importSang','change', (e) => importMarksFile(e, 'sang'));
    on('importGym','change', (e) => importMarksFile(e, 'gym'));
    on('importElevraad','change', (e) => importMarksFile(e, 'elevraad'));

    ['txtElevudv','txtPraktisk','txtKgruppe'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => {
        if (!state.selectedUnilogin) return;
        const obj = getTextFor(state.selectedUnilogin);
        obj.elevudvikling = $('txtElevudv').value;
        obj.praktisk = $('txtPraktisk').value;
        obj.kgruppe = $('txtKgruppe').value;
        obj.lastSavedTs = Date.now();
        // Track last editor (initials) for ALL-mode status badges.
        // We store a single "lastEditedBy" for the whole student card (simple + robust).
        try {
          const sNow = getSettings();
          const rawMe = ((sNow.me || sNow.meResolved || '') + '').trim();
          const ini = toInitials(rawMe || (sNow.meResolved || ''));
          if (ini) obj.lastEditedBy = ini;
        } catch(_) {}
        setTextFor(state.selectedUnilogin, obj);

        const as = $('autosavePill');
        if (as) {
          as.textContent = `Sidst gemt: ${formatTime(obj.lastSavedTs)}`;
          as.style.visibility = 'visible';
        }
        const st = getStudents().find(x => x.unilogin === state.selectedUnilogin);
        if (st) $('preview').textContent = buildStatement(st, getSettings());
        updateEditRatios();
      });
    });

    on('btnPickStudentPdf','click', () => {
      if (!state.selectedUnilogin) return;
      $('fileStudentInput').click();
    });

    on('btnOpenStudentInput','click', () => {
      const url = state.selectedUnilogin ? state.studentInputUrls[state.selectedUnilogin] : null;
      if (!url) return;
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win) alert('Popup blev blokeret af browseren. Tillad popups for siden og prøv igen.');
    });

    on('fileStudentInput','change', (e) => {
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
    on('btnClearStudentInput','click', () => {
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

    on('btnPrint','click', async () => {
      // Keep overrides fresh for printing unless the user is actively editing templates.
      try {
        await loadRemoteOverrides();
        applyTemplatesFromOverridesToLocal({ preserveLocks: true });
      } catch(_) {}

      const st = getSelectedStudent();
      if (!st) return;

      const settings = getSettings();
      const title = (`Udtalelse - ${(st.fornavn || '').trim()} ${(st.efternavn || '').trim()}`).trim() || 'Udtalelse';
      await openPrintWindowForStudents([st], settings, title);
    });
  
    // --- Faglærer-markeringer (Eksport) ---
    // Tabs (Sang/Gymnastik/Elevråd)
    const marksTabs = document.getElementById('marksTypeTabs');
    if (marksTabs && !marksTabs.__wired) {
      marksTabs.__wired = true;
      marksTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-type]');
        if (!btn) return;
        state.marksType = btn.dataset.type || 'sang';
        saveLS(KEYS.marksType, state.marksType);
        syncMarksTypeTabs();
        renderMarksTable();
      });
    }

    // Søg elev i marks-tabellen
    const marksFind = document.getElementById('marksFind');
    if (marksFind && !marksFind.__wired) {
      marksFind.__wired = true;
      marksFind.addEventListener('input', () => {
        state.marksQuery = (marksFind.value || '').trim();
        saveLS(KEYS.marksQuery, state.marksQuery);
        renderMarksTable();
      });
    }

    // Checkbox ændringer i marks-tabellen
    const marksWrap = document.getElementById('marksTableWrap');
    if (marksWrap && !marksWrap.__wired) {
      marksWrap.__wired = true;
      marksWrap.addEventListener('change', (e) => {
        const el = e.target;
        if (!el || el.type !== 'checkbox') return;
        const u = el.getAttribute('data-u');
        const k = el.getAttribute('data-k');
        if (!u || !k) return;
        const type = (state.marksType || 'sang');
        const storageKey = (type === 'gym' || type === 'roller') ? KEYS.marksGym : (type === 'elevraad' ? KEYS.marksElev : KEYS.marksSang);
        const marks = getMarks(storageKey);
        marks[u] = marks[u] || {};

        if (k.startsWith('role:')) {
          // Gym-roller (multi)
          const roleKey = k.slice(5);
          const arr = Array.isArray(marks[u].gym_roles) ? marks[u].gym_roles : [];
          const has = arr.includes(roleKey);
          if (el.checked && !has) arr.push(roleKey);
          if (!el.checked && has) arr.splice(arr.indexOf(roleKey), 1);
          marks[u].gym_roles = arr;
        } else {
          // Variant (single)
          const field = (type === 'gym') ? 'gym_variant' : (type === 'elevraad' ? 'elevraad_variant' : 'sang_variant');
          if (el.checked) marks[u][field] = k;
          else if (marks[u][field] === k) marks[u][field] = '';
        }

        setMarks(storageKey, marks);
        // Live opdater status-boksen og evt. K-elever-kort
        try { updateImportStatsUI(); } catch (err) {}
        if (state.tab === 'k') { try { renderKList(); } catch (err) {} }
        renderMarksTable();
      });
    }

    // Tick-buttons (erstatter checkboxes)
    if (marksWrap && !marksWrap.__wiredClick) {
      marksWrap.__wiredClick = true;
      marksWrap.addEventListener('click', (e) => {
        const btn = e.target && (e.target.closest ? e.target.closest('button.tickbox[data-u][data-k]') : null);
        if (!btn) return;
        e.preventDefault();
        const u = btn.getAttribute('data-u');
        const k = btn.getAttribute('data-k');
        if (!u || !k) return;
        const type = (state.marksType || 'sang');
        const storageKey = (type === 'gym' || type === 'roller') ? KEYS.marksGym : (type === 'elevraad' ? KEYS.marksElev : KEYS.marksSang);
        const marks = getMarks(storageKey);
        marks[u] = marks[u] || {};

        if (k.startsWith('role:')) {
          const roleKey = k.slice(5);
          const arr = Array.isArray(marks[u].gym_roles) ? marks[u].gym_roles : [];
          const has = arr.includes(roleKey);
          if (has) arr.splice(arr.indexOf(roleKey), 1);
          else arr.push(roleKey);
          marks[u].gym_roles = arr;
        } else {
          const field = (type === 'gym') ? 'gym_variant' : (type === 'elevraad' ? 'elevraad_variant' : 'sang_variant');
          const cur = (marks[u][field] || '');
          marks[u][field] = (cur === k) ? '' : k;
        }

        setMarks(storageKey, marks);
        try { updateImportStatsUI(); } catch (err) {}
        if (state.tab === 'k') { try { renderKList(); } catch (err) {} }
        renderMarksTable();
      });
    }

    // Eksportér CSV
    const btnExport = document.getElementById('btnExportMarksCSV');
  // Update button text/tooltip every render
  if (btnExport) {
    const t = (state.marksType || 'sang');
    btnExport.textContent = `Eksportér ${marksExportLabel(t)}`;
    btnExport.title = `Downloader: ${marksExportFilename(t)}`;
  }

  if (btnExport && !btnExport.__wired) {
      btnExport.__wired = true;
      btnExport.addEventListener('click', () => {
        const type = (state.marksType || 'sang');
        const storageKey = (type === 'gym' || type === 'roller') ? KEYS.marksGym : (type === 'elevraad' ? KEYS.marksElev : KEYS.marksSang);
        const studs = getStudents() || [];
        if (!studs.length) { alert('Upload elevliste først.'); return; }
        const marks = getMarks(storageKey) || {};

        const baseCols = ['UniLogin','Navn','Klasse'];
        let extraCols = [];
        if (type === 'sang') extraCols = Object.keys(SNIPPETS.sang || {});
        else if (type === 'elevraad') extraCols = Object.keys(SNIPPETS.elevraad || {});
        else if (type === 'gym') extraCols = [...Object.keys(SNIPPETS.gym || {}), ...Object.keys(SNIPPETS.roller || {}).map(r => `role:${r}`)];

        const header = [...baseCols, ...extraCols];

        const rows = studs.map(s => {
          const u = s.unilogin || '';
          const m = marks[u] || {};
          const out = {};
          out['UniLogin'] = u;
          out['Navn'] = s.navn || s.fulde_navn || '';
          out['Klasse'] = s.klasse || '';

          if (type === 'sang') {
            const v = m.sang_variant || '';
            for (const c of Object.keys(SNIPPETS.sang || {})) out[c] = (v === c) ? '1' : '';
          } else if (type === 'elevraad') {
            const v = m.elevraad_variant || '';
            for (const c of Object.keys(SNIPPETS.elevraad || {})) out[c] = (v === c) ? '1' : '';
          } else if (type === 'gym' || type === 'roller') {
            const v = m.gym_variant || '';
            for (const c of Object.keys(SNIPPETS.gym || {})) out[c] = (v === c) ? '1' : '';
            const roles = Array.isArray(m.gym_roles) ? m.gym_roles : [];
            for (const r of Object.keys(SNIPPETS.roller || {})) out[`role:${r}`] = roles.includes(r) ? '1' : '';
          }

          return header.map(h => out[h] ?? '');
        });

        const esc = (x) => {
          const s = String(x ?? '');
          return /[",\n;]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
        };
        const csv = [header.join(';'), ...rows.map(r => r.map(esc).join(';'))].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const a = document.createElement('a');
        const date = new Date();
        const stamp = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
        a.download = `${type}_marks_${stamp}.csv`;
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
      });
    }

}

  async function init() {

// Demo: load demo_students.csv if requested (after wipe)
try {
} catch (e) {
  console.error(e);
  alert('Kunne ikke indlæse demo_students.csv. Se console for detaljer.');
}

    wireEvents();

    // Globale genvejstaster (baseline): Ctrl+Alt + bogstav
    // Vi klikker på eksisterende UI-knapper (id'er), så navigationen følger appens normale flow.
    if (!window.__huShortcutsWired) {
      window.__huShortcutsWired = true;

      const isTypingTarget = (el) => {
        if (!el) return false;
        const tag = (el.tagName || '').toUpperCase();
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
        if (el.isContentEditable) return true;
        return false;
      };

  // TRIN 2: Tastatur-aktivt elevkort (state-baseret markør, ikke DOM-fokus)
  function updateKActiveCardUI() {
    try {
      const kList = $("kList");
      if (!kList) return;
      const cards = Array.from(kList.querySelectorAll('[data-unilogin]'));
      if (!cards.length) return;

      let idx = Number.isFinite(state.kActiveIndex) ? state.kActiveIndex : 0;
      idx = Math.max(0, Math.min(idx, cards.length - 1));
      state.kActiveIndex = idx;

      cards.forEach((el, i) => {
        if (i === idx) el.classList.add("kbActive");
        else el.classList.remove("kbActive");
      });

      try { cards[idx].scrollIntoView({ block: "nearest" }); } catch(_) {}
    } catch(_) {}
  }


      const clickById = (id) => {
        try {
          const el = document.getElementById(id);
          if (el && !el.disabled) el.click();
        } catch (_) {}
      };

      const goSettingsSubtab = (subtabId) => {
        clickById('tab-set');
        clickById(subtabId);
      };

      document.addEventListener('keydown', (e) => {
        // ESC: slip fokus fra tekstfelter, så genveje virker igen
        if (e.key === 'Escape') {
          const ae = document.activeElement;
          if (isTypingTarget(ae)) {
            try { ae.blur(); } catch(_) {}
            return;
          }
        }


        // A+B (Redigér):
        // A: Hvis Redigér åbnes via tastatur (Enter fra K-elever), fokuseres Udvikling-feltet (done i renderEdit).
        // B: Tab / Shift+Tab cykler mellem de tre tekstfelter i Redigér (kun når fokus allerede er i et af felterne).
        if (!e.ctrlKey && !e.altKey && !e.metaKey && state && state.tab === 'edit') {
          const k = e.key;
          if (k === 'Tab') {
            const ae = document.activeElement;
            const id = ae && ae.id;
            const order = ['txtElevudv','txtPraktisk','txtKgruppe'];
            const pos = order.indexOf(id);
            if (pos !== -1) {
              e.preventDefault();
              const nextPos = e.shiftKey ? (pos + order.length - 1) % order.length : (pos + 1) % order.length;
              const nextId = order[nextPos];
              // Fold ud hvis sektionen er lukket, men fold ikke andre sammen (Model 1).
              if (nextId === 'txtElevudv') { const d = $('secElevudv'); if (d) d.open = true; }
              if (nextId === 'txtPraktisk') { const d = $('secPraktisk'); if (d) d.open = true; }
              if (nextId === 'txtKgruppe') { const d = $('secKgruppe'); if (d) d.open = true; }
              // Fokusér (læg cursor sidst) efter eventuel fold-ud.
              setTimeout(() => {
                const el = $(nextId);
                if (el) {
                  try { el.focus(); } catch(_) {}
                  try { const v = el.value || ''; el.setSelectionRange(v.length, v.length); } catch(_) {}
                }
              }, 0);
              return;
            }
          }
        }

        // TRIN 1: ← / → til K-grupper (kun i "Alle K-grupper"-tilstand)
        // - Kun aktiv når fokus ikke er i input/textarea/contenteditable
        // - Kun i K-fanen og kun når viewMode === 'ALL'
        // - preventDefault() for at undgå browser-scroll/hop
        // - Ingen øvrige taster (Op/Ned/Enter) håndteres her endnu
        if (!e.ctrlKey && !e.altKey && !e.metaKey) {
          const k = e.key;
          if (k === 'ArrowLeft' || k === 'ArrowRight') {
            const typing = isTypingTarget(e.target);
            if (!typing && state && state.tab === 'k' && state.viewMode === 'ALL') {
              const studsNow = getStudents();
              const groups = (state.__kGroups && Array.isArray(state.__kGroups)) ? state.__kGroups : buildKGroups(studsNow);
              const n = (groups && groups.length) ? groups.length : 0;
              if (n > 0) {
                e.preventDefault();
                const gi = Math.max(0, Math.min(state.kGroupIndex || 0, n - 1));
                if (k === 'ArrowLeft' && gi > 0) state.kGroupIndex = gi - 1;
                if (k === 'ArrowRight' && gi < n - 1) state.kGroupIndex = gi + 1;
                renderKList();
                return;
              }
            }
          }
        }

        

        // TRIN 2: ↑ / ↓ over elevkort (state-indeks, ikke DOM-fokus)
        // - Kun når fokus ikke er i input/textarea/contenteditable
        // - Kun i K-fanen
        // - Ingen Enter her
        if (!e.ctrlKey && !e.altKey && !e.metaKey) {
          const k = e.key;
          const code = e.code;
          if (k === 'ArrowUp' || k === 'ArrowDown' || code === 'ArrowUp' || code === 'ArrowDown') {
            const typing = isTypingTarget(e.target);
            if (!typing && state && state.tab === 'k') {
              e.preventDefault();
              const kList = $("kList");
              const n = kList ? kList.querySelectorAll('[data-unilogin]').length : 0;
              if (n > 0) {
                let idx = Number.isFinite(state.kActiveIndex) ? state.kActiveIndex : 0;
                idx = Math.max(0, Math.min(idx, n - 1));
                if (k === 'ArrowUp' || code === 'ArrowUp') idx = Math.max(0, idx - 1);
                if (k === 'ArrowDown' || code === 'ArrowDown') idx = Math.min(n - 1, idx + 1);
                state.kActiveIndex = idx;
                updateKActiveCardUI();
                return;
              }
            }
          }
        }

        // TRIN 3: Enter = åbn aktiv elev (samme handling som klik på elevkort)
        // - Kun når fokus ikke er i input/textarea/contenteditable
        // - Kun i K-fanen
        if (!e.ctrlKey && !e.altKey && !e.metaKey) {
          const k = e.key;
          const code = e.code;
          if (k === 'Enter' || code === 'Enter' || code === 'NumpadEnter') {
            const typing = isTypingTarget(e.target);
            if (!typing && state && state.tab === 'k') {
              const kList = $("kList");
              const cards = kList ? Array.from(kList.querySelectorAll('[data-unilogin]')) : [];
              const n = cards.length;
              if (n > 0) {
                e.preventDefault();
                let idx = Number.isFinite(state.kActiveIndex) ? state.kActiveIndex : 0;
                idx = Math.max(0, Math.min(idx, n - 1));
                state.kActiveIndex = idx;
                const u = (cards[idx] && cards[idx].getAttribute('data-unilogin')) || '';
                if (u) {
                  state.selectedUnilogin = u;
                  state.__editOpenedByKeyboard = true;
                  setTab('edit');
                  renderAll();
                  return;
                }
              }
            }
          }
        }

const modOk = (e.ctrlKey && e.altKey);
        if (!modOk) return;

        const keyRaw = (e.key || '');
        const key0 = (keyRaw + '').toLowerCase();
        // På dansk tastatur kan Ctrl+Alt+E være AltGr+E (= '€')
        const key = (key0 === '€') ? 'e' : key0;
        const typing = isTypingTarget(e.target);
        // Kapr ikke genveje mens man skriver – undtagelse: Backup må gerne være global.
        if (typing && key !== 'b') return;

        if (key === 'k') { e.preventDefault(); clickById('tab-k'); return; }
        if (key === 'r') { e.preventDefault(); clickById('tab-edit'); return; }
        if (key === 's') { e.preventDefault(); clickById('tab-set'); return; }
        if (key === 'z') { e.preventDefault(); clickById('tab-set'); return; }
        if (key === 'x') { e.preventDefault(); clickById('tab-set'); requestAnimationFrame(() => { clickById('settingsTab-general'); requestAnimationFrame(() => { try { const inp = document.getElementById('meInput'); if (inp) { inp.focus(); try { inp.setSelectionRange(inp.value.length, inp.value.length); } catch(_) {} } } catch(_) {} }); }); return; }


        if (key === 'i') { e.preventDefault(); goSettingsSubtab('settingsTab-data'); return; }
        if (key === 'e') { e.preventDefault(); goSettingsSubtab('settingsTab-export'); return; }
        if (key === 't') { e.preventDefault(); goSettingsSubtab('settingsTab-texts'); return; }
        if (key === 'h') { e.preventDefault(); goSettingsSubtab('settingsTab-help'); return; }

        if (key === 'b') { e.preventDefault(); clickById('btnBackupDownload'); return; }
      }, true);
    }

    // Print scaling (single-student print)
    if (!window.__printScaleWired) {
      window.__printScaleWired = true;
      window.addEventListener('beforeprint', () => { try { applyOnePagePrintScale(); } catch(_) {} });
      window.addEventListener('afterprint', () => {
        try { document.documentElement.style.setProperty('--printScale', '1'); } catch(_) {}
      });
    }

    // Meta-safety: older versions could have templates stored in localStorage
    // without tracking whether the user edited them. If that's the case, we
    // assume "edited" to avoid auto-overwriting.
    const hadTemplatesBefore = localStorage.getItem(KEYS.templates) !== null;
    const hadTemplatesDirtyMeta = hasTemplatesDirtyMeta();

    await loadRemoteOverrides();
    if (!localStorage.getItem(KEYS.settings)) setSettings(defaultSettings());
    if (!localStorage.getItem(KEYS.templates)) setTemplates(defaultTemplates());
    if (!hadTemplatesDirtyMeta) setTemplatesDirty(hadTemplatesBefore);
    // Keep overrides authoritative unless the user has explicitly edited templates locally.
    applyTemplatesFromOverridesToLocal({ preserveLocks: true, force: false });
    applySnippetOverrides();

    const s = getSettings();
    if (s.me && !s.meResolved) {
      s.meResolved = toInitials(s.me);
      setSettings(s);
    }
    // Top: Hjælp-knap
    const topHelpBtn = $("tab-help-top");
    if (topHelpBtn) topHelpBtn.addEventListener("click", () => {
      setTab("set");
      setSettingsSubtab("help");
      renderAll();
    });

    // Logo/brand: hvis setup ikke er gjort endnu, hop til Import
    const brandHome = $("brandHome");
    if (brandHome) brandHome.addEventListener("click", () => {
      // Always go to Import (tooltip must match behavior)
      setTab("set");
      setSettingsSubtab("data");
      renderAll();
    });

    // K-elever: Print alle
    const btnPrintAllK = $("btnPrintAllK");
    if (btnPrintAllK) btnPrintAllK.addEventListener("click", printAllKStudents);

        // Indstillinger → Eksport: Print alle elever (alfabetisk efter fornavn)
    const btnPrintAllStudents = $("btnPrintAllStudents");
    if (btnPrintAllStudents) btnPrintAllStudents.addEventListener("click", printAllStudents);

// Indstillinger → Eksport: Print alle K-grupper (alle elever)
    const btnPrintAllGroups = $("btnPrintAllGroups");
    if (btnPrintAllGroups) btnPrintAllGroups.addEventListener("click", printAllKGroups);

    // Hjælp-links (hop til relevante faner)
    document.body.addEventListener("click", (ev) => {
      const a = ev.target.closest && ev.target.closest(".helpLink");
      if (!a) return;
      ev.preventDefault();
      const goto = String(a.getAttribute("data-goto") || "");
      if (!goto) return;
      if (goto === "k") { setTab("k"); renderAll(); return; }
      if (goto === "edit") { setTab("edit"); renderAll(); return; }
      if (goto.startsWith("set:")) {
        const sub = goto.split(":")[1] || "general";
        setTab("set");
        setSettingsSubtab(sub);
        renderAll();
        return;
      }
    });

    // Backup
    const btnBackupDownload = $("btnBackupDownload");
    if (btnBackupDownload) btnBackupDownload.addEventListener("click", exportLocalBackup);
    const backupFileInput = $("backupFileInput");
    if (backupFileInput) backupFileInput.addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      importLocalBackup(f);
      e.target.value = "";
    });

    // Start-fane-logik:
    // - Ingen elevliste → Indstillinger → Hjælp
    // - Elevliste + valgt K-lærer → K-elever
    // - Elevliste + ingen K-lærer → Indstillinger → Generelt (ingen tom K-elever-visning)
    const hasStudents = getStudents().length > 0;
    const meNow = ((getSettings().me || '') + '').trim();
    let postImportHint = null;
    try { postImportHint = JSON.parse(localStorage.getItem(KEY_POST_IMPORT_TEACHER_HINT) || 'null'); } catch (_) { postImportHint = null; }

    if (!hasStudents) {
      setTab('set');
      setSettingsSubtab('help');
    } else if (meNow) {
      setTab('k');
    } else {
      setTab('set');
      setSettingsSubtab('general');
    }

    renderAll();

    // After render: if a backup import requested a teacher selection, show a discreet hint,
    // optionally prefill initials from filename, and open the dropdown.
    if (hasStudents && !meNow) {
      try {
        const infoEl = document.getElementById('teacherInfoAfterImport');
        if (infoEl) infoEl.style.display = 'block';
      } catch (_) {}

      if (postImportHint && postImportHint.suggestedIni) {
        const ini = String(postImportHint.suggestedIni || '').trim().toUpperCase();
        if (ini) {
          const meInput = document.getElementById('meInput');
          if (meInput) {
            meInput.value = ini;
            // Trigger filtering without committing (commit happens on click/ENTER)
            try { meInput.dispatchEvent(new Event('input', { bubbles: true })); } catch (_) {}
          }
        }
      }

      // Focus will open the picker (input.onfocus opens the menu)
      try {
        const meInput = document.getElementById('meInput');
        if (meInput) meInput.focus();
      } catch (_) {}
    }
}
  init().catch(console.error);
})();
function updateCsvButton(count) {
  const btn = document.getElementById('btnImportStudents');
  if (!btn) return;
  btn.classList.add('success');
  btn.textContent = `Elevliste indlæst: ${count} elever`;
  btn.title = 'Klik for at indlæse en ny CSV og overskrive den nuværende elevliste';
}


/* === EXPORT / IMPORT SKABELONER === */
function exportTemplates() {
  const data = {
    forstanderNavn,
    standardTekst,
    udtalelsesSkabelon
  };

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "udtalelses-skabeloner.json";
  a.click();
}

function handleImportTemplates(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      forstanderNavn = data.forstanderNavn ?? "";
      standardTekst = data.standardTekst ?? "";
      udtalelsesSkabelon = data.udtalelsesSkabelon ?? "";
      saveToLocalStorage();
      renderAll();
      setTemplatesImportedState();
    } catch (e) {
      alert("Ugyldig skabelon-fil");
    }
  };
  reader.readAsText(file);
}


document.addEventListener("DOMContentLoaded", () => {
  const exportBtn = document.getElementById("exportTemplatesBtn");
  if (exportBtn) exportBtn.addEventListener("click", exportTemplates);

  const importBtn = document.getElementById("importTemplatesBtn");
  const importInput = document.getElementById("importTemplatesInput");

  if (importBtn && importInput) {
    importBtn.addEventListener("click", () => importInput.click());
    importInput.addEventListener("change", e => {
      if (e.target.files[0]) handleImportTemplates(e.target.files[0]);
    });
  }
});


function setTemplatesImportedState() {
  const btn = document.getElementById("importTemplatesBtn");
  if (!btn) return;
  btn.classList.add("btn-imported");
  btn.textContent = "Skabeloner importeret";
  btn.title = "Klik for at overskrive skabeloner ved ny import";
}



document.addEventListener("click", (e) => {
  const t = e.target;
  if (!t || !t.textContent) return;

  const label = t.textContent.trim();

  if (label === "Download skabeloner") {
    exportTemplates();
  }

  if (label === "Importér skabeloner") {
    let input = document.getElementById("importTemplatesInput");
    if (!input) {
      input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.id = "importTemplatesInput";
      input.style.display = "none";
      document.body.appendChild(input);
      input.addEventListener("change", ev => {
        if (ev.target.files[0]) handleImportTemplates(ev.target.files[0]);
      });
    }
    input.click();
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const exportBtn = document.getElementById("btnExportTemplates");
  if (exportBtn) {
    exportBtn.addEventListener("click", exportTemplates);
  }

  let importBtn = document.getElementById("btnImportTemplates");
  let importInput = document.getElementById("importTemplatesInput");

  if (!importInput) {
    importInput = document.createElement("input");
    importInput.type = "file";
    importInput.accept = ".json";
    importInput.id = "importTemplatesInput";
    importInput.hidden = true;
    document.body.appendChild(importInput);
  }

  if (importBtn) {
    importBtn.addEventListener("click", () => importInput.click());
  }

  importInput.addEventListener("change", e => {
    if (e.target.files[0]) {
      handleImportTemplates(e.target.files[0]);
      importBtn?.classList.add("btn-imported");
      importBtn.textContent = "Skabeloner importeret";
      importBtn.title = "Klik for at overskrive skabeloner ved ny import";
    }
  });
});

/* === v1.0.2: K-lærer dropdown uses SAME logic as Find-elev ===
   This does NOT modify the Find-elev implementation.
   It simply reuses the initializer with a different data source.
*/
document.addEventListener("DOMContentLoaded", () => {
  if (typeof initFindElevDropdown !== "function") return;

  const kInput = document.getElementById("kLaererInitialerInput");
  const kList  = document.getElementById("kLaererDropdown");

  if (!kInput || !kList) return;

  // Data adapter: reuse same dropdown logic
  initFindElevDropdown({
    input: kInput,
    list: kList,
    getItems: () => window.kLaerereInitialer || [],
    onSelect: (item) => {
      if (typeof setAktivKontaktlaerer === "function") {
        setAktivKontaktlaerer(item);
      }
    }
  });
});