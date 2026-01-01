/* Udtalelser v1.0 – statisk GitHub Pages app (ingen libs)
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
	  marksType: LS_PREFIX + 'marks_type',
    textPrefix: LS_PREFIX + 'text_' // + unilogin
  };

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

  // Backwards compatibility: some code paths still reference DEFAULT_ALIAS_MAP.
  // Keep it as an alias of TEACHER_ALIAS_MAP.
  const DEFAULT_ALIAS_MAP = {}; // v1.0: no defaults


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

function printAllKStudents() {
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
  // Build a dedicated print window with page breaks between students
  const title = isAll ? 'Udtalelser v1.0 – print K-gruppe' : 'Udtalelser v1.0 – print K-elever';
  // One-page-per-student, always fit by scaling down if needed.
  // Printable area: A4 minus @page margins = 178mm x 261mm.
  const styles = `
    <style>
      @page { size: A4; margin: 18mm 16mm; }
      body{ font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#000; background:#fff; }
      .entry{ page-break-after: always; }
      .page{ width: 178mm; height: 261mm; overflow:hidden; position:relative; }
      pre.content{
        white-space: pre-wrap;
        font: 11pt/1.45 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        margin:0;
        transform: scale(var(--s, 1));
        transform-origin: top left;
        width: calc(100% / var(--s, 1));
      }
    </style>
  `;
  const body = list.map(st => {
    const txt = buildStatement(st, getSettings());
    return `
      <section class="entry">
        <div class="page"><pre class="content">${escapeHtml(txt)}</pre></div>
      </section>
    `;
  }).join('');

  const w = window.open('', '_blank');
  if (!w) {
    alert('Pop-up blev blokeret. Tillad pop-ups for at printe alle.');
    return;
  }
  w.document.open();
  w.document.write(`<!doctype html><html lang="da"><head><meta charset="utf-8"><title>${title}</title>${styles}</head><body>${body}
    <script>
      (function(){
        function fitAll(){
          const pages = Array.from(document.querySelectorAll('.page'));
          pages.forEach(p=>{
            const c = p.querySelector('.content');
            if(!c) return;
            // Reset
            p.style.setProperty('--s','1');
            // Measure at scale=1
            const avail = p.clientHeight;
            const needed = c.scrollHeight;
            let s = 1;
            if (needed > avail && avail > 0) s = Math.max(0.10, Math.min(1, avail / needed));
            p.style.setProperty('--s', String(s));
          });
        }
        window.addEventListener('load', fitAll);
        window.addEventListener('beforeprint', fitAll);
      })();
    </script>
  </body></html>`);
  w.document.close();
  // Let the browser lay out the document before printing
  setTimeout(()=>{ try{ w.focus(); w.print(); }catch(e){} }, 250);
}

function printAllKGroups() {
  const studs = getStudents();
  if (!studs.length) {
    alert('Der er ingen elevliste indlæst endnu.');
    return;
  }
  const kGroups = buildKGroups(studs);
  const all = [];

  // Flatten i gruppe-rækkefølge (stabilt og forudsigeligt)
  kGroups.forEach(g => {
    (g.students || []).forEach(st => all.push(st));
  });

  if (!all.length) {
    alert('Der var ingen elever i K-grupperne at printe.');
    return;
  }

  const title = 'Udtalelser v1.0 – print alle K-grupper';
  const styles = `
    <style>
      @page { size: A4; margin: 18mm 16mm; }
      body{ font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#000; background:#fff; }
      .entry{ page-break-after: always; }
      .page{ width: 178mm; height: 261mm; overflow:hidden; position:relative; }
      pre.content{
        white-space: pre-wrap;
        font: 11pt/1.45 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        margin:0;
        transform: scale(var(--s, 1));
        transform-origin: top left;
        width: calc(100% / var(--s, 1));
      }
    </style>
  `;
  const body = all.map(st => {
    const txt = buildStatement(st, getSettings());
    return `
      <section class="entry">
        <div class="page"><pre class="content">${escapeHtml(txt)}</pre></div>
      </section>
    `;
  }).join('');

  const w = window.open('', '_blank');
  if (!w) {
    alert('Pop-up blev blokeret. Tillad pop-ups for at printe.');
    return;
  }
  w.document.open();
  w.document.write(`<!doctype html><html lang="da"><head><meta charset="utf-8"><title>${title}</title>${styles}</head><body>${body}
    <script>
      (function(){
        function fitAll(){
          const pages = Array.from(document.querySelectorAll('.page'));
          pages.forEach(p=>{
            const c = p.querySelector('.content');
            if(!c) return;
            p.style.setProperty('--s','1');
            const avail = p.clientHeight;
            const needed = c.scrollHeight;
            let s = 1;
            if (needed > avail && avail > 0) s = Math.max(0.10, Math.min(1, avail / needed));
            p.style.setProperty('--s', String(s));
          });
        }
        window.addEventListener('load', fitAll);
        window.addEventListener('beforeprint', fitAll);
      })();
    </script>
  </body></html>`);
  w.document.close();
  setTimeout(()=>{ try{ w.focus(); w.print(); }catch(e){} }, 250);
}

function importLocalBackup(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const obj = JSON.parse(String(reader.result || '{}'));
      if (!obj || typeof obj !== 'object' || !obj.data) throw new Error('Ugyldig backupfil.');
      const prefix = obj.prefix || LS_PREFIX;

      // SAFE IMPORT (merge) so you can import colleagues' backups without losing your own work.
      // Policy:
      // - We never delete existing data.
      // - For text keys (udt_text_<unilogin>): merge per field (only fill blanks).
      // - For non-text keys: import only if missing locally.
      const textKeyPrefix = prefix + 'text_';
      let mergedText = 0, addedText = 0, skippedText = 0;
      let addedOther = 0, skippedOther = 0;

      Object.entries(obj.data).forEach(([k, v]) => {
        if (typeof k !== 'string' || !k.startsWith(prefix)) return;
        const incomingRaw = String(v ?? '');

        // Never import colleague settings over your own.
        if (k === KEYS.settings) { skippedOther++; return; }

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
  // v1.0: Identitet-listen bygges udelukkende ud fra elevlisten (initialer), ingen hardcodede lærere.
  const input = document.getElementById('meInput');
  const menu  = document.getElementById('teacherPickerMenu');
  const btn   = document.getElementById('teacherPickerBtn');
  const wrap  = document.getElementById('teacherPicker');
  const clear = document.getElementById('meInputClear');
  if (!input || !menu || !btn || !wrap) return;

  const studs = getStudents();
  if (!studs.length) {
    input.value = '';
    input.disabled = true;
    btn.disabled = true;
    if (clear) clear.hidden = true;
    menu.innerHTML = `<div class="pickerEmpty">Indlæs elevliste først (students.csv).</div>`;
    wrap.classList.remove('open');
    return;
  }

  input.disabled = false;
  btn.disabled = false;

  const set = new Set();
  for (const st of studs) {
    const a = (st.kontaktlaerer1_ini || '').toString().trim().toUpperCase();
    const b = (st.kontaktlaerer2_ini || '').toString().trim().toUpperCase();
    if (a) set.add(a);
    if (b) set.add(b);
  }
  const items = Array.from(set).sort((x,y)=>x.localeCompare(y,'da'));

  let activeIndex = 0;

  function setActive(idx){
    const opts = Array.from(menu.querySelectorAll('[role="option"]'));
    if (!opts.length) return;
    activeIndex = Math.max(0, Math.min(idx, opts.length-1));
    opts.forEach((el,i)=>el.classList.toggle('active', i===activeIndex));
    const el = opts[activeIndex];
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  function renderMenu(){
    const q = (input.value || '').toString().trim().toUpperCase();
    const filtered = !q ? items : items.filter(x => x.includes(q));
    menu.innerHTML = '';
    if (!filtered.length){
      menu.innerHTML = `<div class="pickerEmpty">Ingen match</div>`;
      return;
    }
    filtered.slice(0, 24).forEach((code, i) => {
      const row = document.createElement('div');
      row.className = 'tpRow';
      row.setAttribute('role','option');
      row.dataset.value = code;
      row.textContent = code;
      row.addEventListener('mousedown', (e) => {
        e.preventDefault();
        commit(code);
        closeMenu();
      });
      menu.appendChild(row);
    });
    setActive(0);
  }

  function openMenu(){
    menu.hidden = false;
    if (!wrap.classList.contains('open')) wrap.classList.add('open');
    renderMenu();
  }
  function closeMenu(){
    wrap.classList.remove('open');
    menu.hidden = true;
  }

  function commit(code){
    const ini = (code || '').toString().trim().toUpperCase();
    const s2 = getSettings();
    s2.me = ini;
    // keep aliasMap if user already has it in storage, but we do not ship defaults
    setSettings(s2);
    input.value = ini;
    renderStatus();
    if (clear) clear.hidden = !ini;
    try { state.viewMode = 'K'; setTab('k'); } catch(_) {}
  }

  // Button / clear
  btn.onclick = (e) => { e.preventDefault(); wrap.classList.contains('open') ? closeMenu() : openMenu(); input.focus(); };
  input.onfocus = () => openMenu();
  input.oninput = () => { if (!wrap.classList.contains('open')) openMenu(); else renderMenu(); };

  if (clear) {
    clear.onclick = (e) => {
      e.preventDefault();
      const s2 = getSettings(); s2.me = ''; s2.meResolved = ''; setSettings(s2);
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

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!wrap.classList.contains('open')) openMenu();
      e.preventDefault();
      setActive(activeIndex + (e.key === 'ArrowDown' ? 1 : -1));
      return;
    }
    if (e.key === 'Enter') {
      const el = menu.querySelectorAll('[role="option"]')[activeIndex];
      if (el && el.dataset.value) {
        e.preventDefault();
        commit(el.dataset.value);
        closeMenu();
      }
    }
  });
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
  function escapeAttr(s) { return (s ?? '').toString().replace(/"/g,'&quot;'); }
  function $(id){ return document.getElementById(id); }

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
  function setTemplates(t){ lsSet(KEYS.templates, t); }
  function getStudents(){ const s = lsGet(KEYS.students, []); window.__ALL_STUDENTS__ = s || []; return s; }
  
function rebuildAliasMapFromStudents(studs){
  const s = getSettings();
  const alias = { ...(s.aliasMap || {}) };
  const add = (ini, full) => {
    if (!ini || !full) return;
    const k = (ini||'').toString().trim().toLowerCase();
    if (k) alias[k] = full;
    const nk = normalizeName(full).replace(/\s+/g,'');
    if (nk) alias[nk] = full;
  };
  (studs || []).forEach(st => {
    const t1 = (st && st.kontaktlaerer1) ? (st.kontaktlaerer1+'').trim() : '';
    const t2 = (st && st.kontaktlaerer2) ? (st.kontaktlaerer2+'').trim() : '';
    [t1,t2].filter(Boolean).forEach(t => {
      if (/^[A-ZÆØÅ]{1,4}(\/[A-ZÆØÅ]{1,4})?$/.test(t)) {
        add(t, t); // initials-only (fallback)
      } else {
        add(toInitials(t), t);
      }
    });
  });
  setSettings({ ...s, aliasMap: alias });
}

function setStudents(studs){ lsSet(KEYS.students, studs); rebuildAliasMapFromStudents(studs); window.__ALL_STUDENTS__ = studs || []; rebuildAliasMapFromStudents(studs); }
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
"KONTAKTLAERER_1_NAVN": ((student.kontaktlaerer1 || '') + '').trim(),
"KONTAKTLAERER_2_NAVN": ((student.kontaktlaerer2 || '') + '').trim(),
      "KONTAKTLÆRER_1_NAVN": ((student.kontaktlaerer1 || '') + '').trim(),
      "KONTAKTLÆRER_2_NAVN": ((student.kontaktlaerer2 || '') + '').trim(),
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
    const ini1 = (get('ini1') || '').trim();
    const ini2 = (get('ini2') || '').trim();
    const k1 = ini1 ? ini1.toUpperCase() : toInitials(get('kontakt1'));
    const k2 = ini2 ? ini2.toUpperCase() : toInitials(get('kontakt2'));
    const kontakt1_navn = get('kontakt1');
    const kontakt2_navn = get('kontakt2');
    const navn = `${fornavn} ${efternavn}`.trim();
    return { fornavn, efternavn, navn, unilogin, koen, klasse, kontaktlaerer1: kontakt1_navn, kontaktlaerer2: kontakt2_navn, kontaktlaerer1_ini: k1, kontaktlaerer2_ini: k2 };
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
  const title = (state.viewMode === 'ALL') ? 'Alle K-grupper' : 'K-elever';
  if (span) span.textContent = title;
  kBtn.title = title;
  const h = $('kTitle');
  if (h) h.textContent = title;
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

    const me = (s.me || '').trim() ? `· K-lærer: ${(s.me||'').trim().toUpperCase()}` : '';
    $('statusText').textContent = studs.length ? `Elever: ${studs.length} ${me}` : `Ingen elevliste indlæst`;
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

    const meNorm = normalizeName(s.meResolved);
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
    btnPrint.textContent = '🖨️ Print dine K-elever';
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
      const who = (meResolvedConfirmed || meRaw || "").trim();
      kHeaderInfo.textContent = who ? `✏️ Redigeres nu af: ${who}` : `✏️ Redigeres nu af: —`;
    }

    if (kList) {
      kList.innerHTML = mineList.map(st => {
        const full = `${st.fornavn || ''} ${st.efternavn || ''}`.trim();
        const free = getTextFor(st.unilogin);
        const hasU = !!(free.elevudvikling || '').trim();
        const hasP = !!(free.praktisk || '').trim();
        const hasK = !!(free.kgruppe || '').trim();

        // ALL-mode status: U · P · K → initials (last editor)
        const lastBy = ((free.lastEditedBy || '') + '').trim();
        const letters = [hasU ? 'U' : '', hasP ? 'P' : '', hasK ? 'K' : ''].filter(Boolean).join(' · ');
        // Status on cards: show only filled letters, and (when available) last editor initials.
        // We show this in BOTH views so imported colleague-edits remain visible in K-visning.
        const statusRight = letters
          ? `${letters}${lastBy ? ` → ${escapeHtml(lastBy)}` : ''}`
          : '';

        return `
          <div class="card clickable" data-unilogin="${escapeAttr(st.unilogin)}">
            <div class="cardTopRow">
              <div class="cardTitle"><b>${escapeHtml(full)}</b></div>
              <div class="cardFlags muted small">${statusRight}</div>
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

    const meNorm = normalizeName(s.meResolved);
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
    if (!wrap || !legendEl) return;

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
    const q = normalizeName((searchEl && searchEl.value) ? searchEl.value : '').trim();

    if (!studs || !studs.length){
      wrap.innerHTML = `<div class="muted small">Indlæs først elevliste (students.csv).</div>`;
      legendEl.textContent = '';
      return;
    }



    const list = sortedStudents(studs).filter(st => {
      if (!q) return true;
      const full = normalizeName(`${st.fornavn} ${st.efternavn}`);
      return full.includes(q);
    });

    const kgrpLabel = (st) => {
      // Always show initials-based group key (e.g. AB/EB), even if CSV stores full teacher names.
      const a = (st.kontaktlaerer1_ini || '').toString().trim();
      const b = (st.kontaktlaerer2_ini || '').toString().trim();
      return groupKeyFromTeachers(a, b);
    };

    function renderTick(unilogin, key, on){
      return `<td class="cb"><button type="button" class="markbtn tickbox ${on?'on':''}" data-u="${escapeAttr(unilogin)}" data-k="${escapeAttr(key)}" aria-pressed="${on?'true':'false'}"><span class="check">✓</span></button></td>`;
    }

    if (type === 'sang') {
      const marks = getMarks('sang');
      $('marksLegend').textContent = '';
      const cols = Object.keys(SNIPPETS.sang);

      wrap.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Navn</th><th>K-grp</th><th>Klasse</th>
              ${cols.map(c => `<th class="cb" title="${escapeAttr(SNIPPETS.sang[c].hint||'')}"><span class="muted small">${escapeHtml(SNIPPETS.sang[c].title||'')}</span></th>`).join('')}
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
                ${cols.map(c => renderTick(st.unilogin, c, ((m.sang_variant||'')===c))).join('')}
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      `;
      return;
    }

    if (type === 'gym') {
      const marks = getMarks('gym');
      $('marksLegend').textContent = '';
      const cols = Object.keys(SNIPPETS.gym);
      const roleCodes = Object.keys(SNIPPETS.roller || {});

      wrap.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Navn</th><th>K-grp</th><th>Klasse</th>
              ${cols.map(c => `<th class="cb" title="${escapeAttr(SNIPPETS.gym[c].hint||'')}"><span class="muted small">${escapeHtml(SNIPPETS.gym[c].title||'')}</span></th>`).join('')}
              ${roleCodes.map(r => `<th class="cb" title="${escapeAttr((SNIPPETS.roller[r]||{}).hint||'')}"><span class="muted small">${escapeHtml((SNIPPETS.roller[r]||{}).title||r)}</span></th>`).join('')}
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
                ${cols.map(c => renderTick(st.unilogin, c, ((m.gym_variant||'')===c))).join('')}
                ${roleCodes.map(r => renderTick(st.unilogin, 'role:'+r, (Array.isArray(m.gym_roles)?m.gym_roles:[]).includes(r))).join('')}
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      `;
      return;
    }

    // elevraad
    const marks = getMarks('elevraad');
    $('marksLegend').textContent = '';
    const cols = Object.keys(SNIPPETS.elevraad);

    wrap.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Navn</th><th>K-grp</th><th>Klasse</th>
            ${cols.map(c => `<th class="cb" title="${escapeAttr(SNIPPETS.elevraad[c].hint||'')}"><span class="muted small">${escapeHtml(SNIPPETS.elevraad[c].title||'')}</span></th>`).join('')}
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
              ${cols.map(c => renderTick(st.unilogin, c, ((m.elevraad_variant||'')===c))).join('')}
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
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
    // Redigér-tab er skjult når ingen elev er valgt, men vær robust hvis nogen alligevel klikker.
    on('tab-edit','click', () => setTab('edit'));
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
      const t = getTemplates();
      t.schoolText = DEFAULT_SCHOOL_TEXT;
      setTemplates(t);
      renderSettings();
      if (state.tab === 'edit') renderEdit();
    });
    on('schoolText','input', () => {
      const t = getTemplates();
      t.schoolText = $('schoolText').value;
      setTemplates(t);
      if (state.tab === 'edit') renderEdit();
    });

    on('btnToggleTemplate','click', () => {
      const t = getTemplates();
      t.templateLocked = !t.templateLocked;
      setTemplates(t);
      renderSettings();
    });
    on('btnRestoreTemplate','click', () => {
      const t = getTemplates();
      t.template = DEFAULT_TEMPLATE;
      setTemplates(t);
      renderSettings();
      if (state.tab === 'edit') renderEdit();
    });
    on('templateText','input', () => {
      const t = getTemplates();
      t.template = $('templateText').value;
      setTemplates(t);
      if (state.tab === 'edit') renderEdit();
    });

    // Del / importér skabeloner (leder)
    if (document.getElementById('btnDownloadTemplates')) {
      on('btnDownloadTemplates','click', () => {
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
  on('btnRestoreSang','click', () => {
    const o = getSnippetDraft();
    delete o.sang;
    setSnippetDraft(o);
    applySnippetOverrides();
    renderSettings();
  });
}

if (document.getElementById('btnDownloadGym')) {
  on('btnDownloadGym','click', () => {
    const pkg = buildOverridePackage('gym');
    downloadJson('snippets_gym_override.json', pkg);
  });
  if (document.getElementById('btnImportGymSnippets') && document.getElementById('fileImportGymSnippets')) {
    on('btnImportGymSnippets','click', () => $('fileImportGymSnippets').click());
    on('fileImportGymSnippets','change', async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const txt = await f.text();
    const obj = JSON.parse(txt);
    importOverridePackage('gym', obj);
    renderSettings();
    e.target.value = '';
    });
  }
  on('btnRestoreGymSnippets','click', () => {
    const o = getSnippetDraft();
    delete o.gym;
    setSnippetDraft(o);
    applySnippetOverrides();
    renderSettings();
  });

  on('btnAddRole','click', () => {
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
  on('btnRestoreElevraad','click', () => {
    const o = getSnippetDraft();
    delete o.elevraad;
    setSnippetDraft(o);
    applySnippetOverrides();
    renderSettings();
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

      const students = parsed.rows.map(r => normalizeStudentRow(r, map));
      setStudents(students);

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
        const marks = getMarks('sang');
        const rows = sorted.map(st => {
          const full = `${st.fornavn} ${st.efternavn}`.trim();
          const m = marks[st.unilogin] || {};
          return { Unilogin: st.unilogin, Navn: full, Sang_variant: m.sang_variant || '' };
        });
        downloadText('sang_marks.csv', toCsv(rows, ['Unilogin','Navn','Sang_variant']));
      }
      if (type === 'gym') {
        const marks = getMarks('gym');
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

    on('btnPrint','click', () => {
      // Ensure the statement always fits on ONE A4 page (scale down if needed)
      try { applyOnePagePrintScale(); } catch(_) {}
      // Give the browser a tick to apply CSS variable before print dialog
      setTimeout(()=>{ try{ window.print(); } catch(_) {} }, 0);
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
        const marks = getMarks(type);
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

        setMarks(type, marks);
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
        const marks = getMarks(type);
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

        setMarks(type, marks);
        renderMarksTable();
      });
    }

    // Eksportér CSV
    const btnExport = document.getElementById('btnExportMarksCSV');
    if (btnExport && !btnExport.__wired) {
      btnExport.__wired = true;
      btnExport.addEventListener('click', () => {
        const type = (state.marksType || 'sang');
        const studs = getStudents() || [];
        if (!studs.length) { alert('Upload elevliste først.'); return; }
        const marks = getMarks(type) || {};

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
          } else if (type === 'gym') {
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
    wireEvents();

    // Print scaling (single-student print)
    if (!window.__printScaleWired) {
      window.__printScaleWired = true;
      window.addEventListener('beforeprint', () => { try { applyOnePagePrintScale(); } catch(_) {} });
      window.addEventListener('afterprint', () => {
        try { document.documentElement.style.setProperty('--printScale', '1'); } catch(_) {}
      });
    }

    await loadRemoteOverrides();
    if (!localStorage.getItem(KEYS.settings)) setSettings(defaultSettings());
    if (!localStorage.getItem(KEYS.templates)) setTemplates(defaultTemplates());
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

    // Start: hvis elever eller initialer mangler, start i Import
    const hasStudents = getStudents().length > 0;
    const hasMe = String(getSettings().me || "").trim().length > 0;
    if (!hasStudents || !hasMe) {
      setTab("set");
      setSettingsSubtab("data");
    } else {
      setTab("k");
    }
    renderAll();
}

  init();
})();