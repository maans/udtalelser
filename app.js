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

  // =============================
  // Alias map (initialer → fuldt navn)
  // =============================
  const TEACHER_ALIAS_MAP = {
    "ab":  "Andreas Bech Pedersen",
    "avp": "Ane Vestergaard Pedersen",
    "av":  "Anne Valsted",
    "ao":  "Astrid Sun Otte",
    "bpo": "Bjarne Poulsen",
    "bs":  "Bo Serritzlew",
    "cm":  "Carsten Søe Mortensen",
    "dh":  "Dennis Horn",
    "dc":  "Dorthe Corneliussen Bertelsen",
    "eb":  "Emil Egetoft Brinch",
    "eni": "Emil Nielsen",
    "hm":  "Henrik Marcussen",
    "ic":  "Ida Søttrup Christensen",
    "is":  "Inge Johansen Stuhr",
    "jg":  "Jakob Mols Græsborg",
    "jh":  "Jens H. Noe",
    "jl":  "Jesper Laubjerg",
    "kb":  "Kathrine Spandet Brøndum",
    "kh":  "Kenneth Hald",
    "kvs": "Kristoffer Vorre Sørensen",
    "lgn": "Laura Guldbæk Nymann",
    "mti": "Magnus Tolborg Ibsen",
    "mt":  "Maria Rosborg Thornval",
    "mo":  "Marianne Brun Ottesen",
    "mv":  "Mark Vestergaard Pedersen",
    "mg":  "Martin Gregersen",
    "ms":  "Mia Mejlby Sørensen",
    "mtp": "Mikkel Tejlgaard Pedersen",
    "mm":  "Måns Patrik Mårtensson",
    "rb":  "Randi Borum",
    "rd":  "Rasmus Damsgaard",
    "ra":  "Rebecka Antonsen",
    "sg":  "Sara Maiken Mols Græsborg",
    "smb": "Stine Maria Birkeholm",
    "snv": "Stine Nielsen Vad",
    "sp":  "Stinne Krogh Poulsen",
    "th":  "Trine Hedegaard Nielsen",
    "tin": "Trine Isager Nielsen",
    "tk":  "Trine Krogh Korneliussen",
    "vsi": "Viola Simonsen"
  };

  // =============================
  // Snippets bank (defaults)
  // =============================
  const SNIPPETS = {
    // Sang (S1/S2/S3)
    sang: {
      S1: { neutral: "Elevens deltagelse i fællessang har været meget aktiv og engageret." },
      S2: { neutral: "Elevens deltagelse i fællessang har været stabil og positiv." },
      S3: { neutral: "Elevens deltagelse i fællessang har været varierende." }
    },
    // Gym (G1/G2/G3)
    gym: {
      G1: { neutral: "Eleven har været meget aktiv og deltagende i fællesgymnastik." },
      G2: { neutral: "Eleven har deltaget stabilt i fællesgymnastik." },
      G3: { neutral: "Elevens deltagelse i fællesgymnastik har været varierende." }
    },
    // Elevråd
    elevraad: {
      YES: { neutral: "Eleven har været repræsentant i elevrådet og har taget ansvar i fællesskabet." }
    },
    // Roller
    roller: {
      FANEB: { neutral: "Eleven har været fanebærer." },
      REDSK: { neutral: "Eleven har været en del af redskabsholdet." },
      DGI:   { neutral: "Eleven har været DGI-hjælper." }
    },
    // Kontaktgruppe standard (bruges hvis fritekst er tom)
    kontaktgruppeDefault: "I kontaktgruppen har vi arbejdet med trivsel, ansvar og fællesskab.",
    afslutningDefault: "Vi ønsker eleven alt det bedste fremover."
  };

  // Default skolens standardtekst (kan redigeres/låses op)
  const DEFAULT_SCHOOL_TEXT =
`På Himmerlands Ungdomsskole arbejder vi med både faglighed, fællesskab og personlig udvikling.
Udtalelsen er skrevet med udgangspunkt i elevens hverdag og deltagelse gennem skoleåret.`;

  // Template (simpel, placeholder-baseret)
  // Note: vi bruger én samlet blok SANG_GYM_AFSNIT (som din docx gør).
  const DEFAULT_TEMPLATE =
`{DATO_MAANED_AAR}

{NAVN} ({KLASSE})
Periode: {PERIODE_FRA} – {PERIODE_TIL}

{SKOLENS_STANDARDTEKST}

{SANG_GYM_AFSNIT}

{ELEVUDVIKLING_FRI}

{PRAKTISK_FRI}

{KGRUPPE_FRI}

Kontaktlærere: {KONTAKTLAERERE}
Forstander: {FORSTANDER}
`;

  // =============================
  // Utilities: localStorage
  // =============================
  function lsGet(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      if (v === null || v === undefined) return fallback;
      return JSON.parse(v);
    } catch {
      return fallback;
    }
  }
  function lsSet(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  function lsDel(key) {
    localStorage.removeItem(key);
  }
  function lsDelPrefix(prefix) {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
  }

  // =============================
  // Normalisering (navne + header)
  // =============================
  function normalizeName(input) {
    if (!input) return "";
    return input
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\./g, " ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  function normalizeHeader(input) {
    // mere aggressiv: behold kun a-z0-9
    return normalizeName(input).replace(/[^a-z0-9]+/g, "");
  }

  function resolveTeacherName(inputRaw) {
    const norm = normalizeName(inputRaw);
    if (!norm) return "";
    if (TEACHER_ALIAS_MAP[norm]) return TEACHER_ALIAS_MAP[norm];
    return inputRaw.trim(); // fuldt navn eller andet
  }

  // =============================
  // CSV parsing (delimiter detect + simple quote support)
  // =============================
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

  function parseCsv(text) {
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    // fjern tomme slutlinjer
    while (lines.length && !lines[lines.length-1].trim()) lines.pop();
    if (lines.length === 0) return { headers: [], rows: [] };

    const delim = detectDelimiter(lines[0]);
    const headers = parseCsvLine(lines[0], delim).map(h => h.trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const parts = parseCsvLine(lines[i], delim);
      const row = {};
      for (let c = 0; c < headers.length; c++) {
        row[headers[c]] = (parts[c] ?? '').trim();
      }
      rows.push(row);
    }
    return { headers, rows, delim };
  }

  function parseCsvLine(line, delim) {
    const out = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        // double quote inside quotes -> escape
        if (inQuotes && line[i+1] === '"') { cur += '"'; i++; continue; }
        inQuotes = !inQuotes;
        continue;
      }
      if (!inQuotes && (delim === '\t' ? ch === '\t' : ch === delim)) {
        out.push(cur);
        cur = '';
        continue;
      }
      cur += ch;
    }
    out.push(cur);
    return out;
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

  // =============================
  // App state
  // =============================
  const state = {
    tab: 'set',
    selectedUnilogin: null
  };

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
      template: DEFAULT_TEMPLATE
    };
  }

  function getSettings() { return Object.assign(defaultSettings(), lsGet(KEYS.settings, {})); }
  function setSettings(s) { lsSet(KEYS.settings, s); }
  function getTemplates() { return Object.assign(defaultTemplates(), lsGet(KEYS.templates, {})); }
  function setTemplates(t) { lsSet(KEYS.templates, t); }

  function getStudents() { return lsGet(KEYS.students, []); }
  function setStudents(studs) { lsSet(KEYS.students, studs); }

  function getMarks(kindKey) { return lsGet(kindKey, {}); }
  function setMarks(kindKey, m) { lsSet(kindKey, m); }

  function getTextFor(unilogin) { return lsGet(KEYS.textPrefix + unilogin, { elevudvikling:'', praktisk:'', kgruppe:'', lastSavedTs:null, studentInputMeta:null }); }
  function setTextFor(unilogin, obj) { lsSet(KEYS.textPrefix + unilogin, obj); }

  // =============================
  // Period helpers
  // =============================
  function computePeriod(schoolYearEnd) {
    const endYear = Number(schoolYearEnd) || (new Date().getFullYear() + 1);
    return {
      from: `August ${endYear - 1}`,
      to:   `Juni ${endYear}`,
      dateMonthYear: `Juni ${endYear}`
    };
  }

  function genderPronounHamHende(genderRaw) {
    const g = normalizeName(genderRaw);
    // accepterer m/k, dreng/pige, male/female
    if (g === 'm' || g.includes('dreng') || g.includes('male')) return 'ham';
    if (g === 'k' || g.includes('pige') || g.includes('female')) return 'hende';
    return 'eleven';
  }

  // =============================
  // Rendering + routing
  // =============================
  const els = {};
  function $(id){ return document.getElementById(id); }

  function setTab(tab) {
    state.tab = tab;
    // landingslogik: hvis ingen elever, så altid indstillinger
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

    // students status
    $('studentsStatus').textContent = studs.length ? `✅ Elevliste indlæst: ${studs.length} elever` : `Upload elevliste først.`;
    $('studentsStatus').style.color = studs.length ? 'var(--accent)' : 'var(--muted)';

    // contact count
    const meNorm = normalizeName(s.meResolved);
    if (studs.length && meNorm) {
      const count = studs.filter(st => normalizeName(st.kontaktlaerer1) === meNorm || normalizeName(st.kontaktlaerer2) === meNorm).length;
      $('contactCount').value = String(count);
    } else {
      $('contactCount').value = '';
    }

    renderMarksTable(); // also depends on students
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

    const mine = studs
      .filter(st => normalizeName(st.kontaktlaerer1) === meNorm || normalizeName(st.kontaktlaerer2) === meNorm)
      .sort((a,b) => (a.efternavn||'').localeCompare(b.efternavn||'', 'da') || (a.fornavn||'').localeCompare(b.fornavn||'', 'da'));

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

    // attach click handlers
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

  function renderEdit() {
    const studs = getStudents();
    const s = getSettings();

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

    // student input meta
    if (t.studentInputMeta && t.studentInputMeta.filename) {
      $('studentInputMeta').textContent = `Valgt fil: ${t.studentInputMeta.filename} (registreret ${formatDateTime(t.studentInputMeta.ts)})`;
    } else {
      $('studentInputMeta').textContent = '';
    }

    // preview
    $('preview').textContent = buildStatement(st, s);
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

  function renderMarksTable() {
    const studs = getStudents();
    const wrap = $('marksTableWrap');
    const type = $('marksType').value;

    if (!studs.length) {
      wrap.innerHTML = `<div class="muted small">Upload elevliste først.</div>`;
      return;
    }

    const sorted = studs.slice().sort((a,b) => (a.efternavn||'').localeCompare(b.efternavn||'', 'da') || (a.fornavn||'').localeCompare(b.fornavn||'', 'da'));

    if (type === 'sang') {
      const marks = getMarks(KEYS.marksSang);
      wrap.innerHTML = buildSangTable(sorted, marks);
      wireSangTable();
    } else if (type === 'gym') {
      const marks = getMarks(KEYS.marksGym);
      wrap.innerHTML = buildGymTable(sorted, marks);
      wireGymTable();
    } else {
      const marks = getMarks(KEYS.marksElev);
      wrap.innerHTML = buildElevraadTable(sorted, marks);
      wireElevraadTable();
    }
  }

  function buildSangTable(students, marks) {
    return `<table>
      <thead><tr>
        <th>Navn</th><th>Klasse</th><th>S1</th><th>S2</th><th>S3</th><th>–</th>
      </tr></thead>
      <tbody>
        ${students.map(st => {
          const v = (marks[st.unilogin]?.variant) || '';
          const pill = (code,label) => `<span class="pillbtn ${v===code?'active':''}" data-u="${escapeAttr(st.unilogin)}" data-v="${code}">${label}</span>`;
          return `<tr>
            <td>${escapeHtml(`${st.fornavn} ${st.efternavn}`.trim())}</td>
            <td class="muted">${escapeHtml(st.klasse||'')}</td>
            <td><div class="pills">${pill('S1','S1')}</div></td>
            <td><div class="pills">${pill('S2','S2')}</div></td>
            <td><div class="pills">${pill('S3','S3')}</div></td>
            <td><button class="btn ghost small" type="button" data-clear="${escapeAttr(st.unilogin)}">x</button></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
  }

  function wireSangTable() {
    const wrap = $('marksTableWrap');
    wrap.querySelectorAll('.pillbtn').forEach(btn => {
      btn.addEventListener('click', () => {
        const u = btn.getAttribute('data-u');
        const v = btn.getAttribute('data-v');
        const marks = getMarks(KEYS.marksSang);
        marks[u] = { variant: v };
        setMarks(KEYS.marksSang, marks);
        renderMarksTable();
        renderEdit();
      });
    });
    wrap.querySelectorAll('button[data-clear]').forEach(btn => {
      btn.addEventListener('click', () => {
        const u = btn.getAttribute('data-clear');
        const marks = getMarks(KEYS.marksSang);
        delete marks[u];
        setMarks(KEYS.marksSang, marks);
        renderMarksTable();
        renderEdit();
      });
    });
  }

  function buildGymTable(students, marks) {
    return `<table>
      <thead><tr>
        <th>Navn</th><th>Klasse</th><th>G1</th><th>G2</th><th>G3</th><th>Fanebærer</th><th>Redskabshold</th><th>DGI-hjælper</th><th>–</th>
      </tr></thead>
      <tbody>
        ${students.map(st => {
          const m = marks[st.unilogin] || {};
          const v = m.variant || '';
          const pill = (code,label) => `<span class="pillbtn ${v===code?'active':''}" data-u="${escapeAttr(st.unilogin)}" data-v="${code}">${label}</span>`;
          const chk = (key) => `<input type="checkbox" data-u="${escapeAttr(st.unilogin)}" data-k="${key}" ${m[key] ? 'checked' : ''} />`;
          return `<tr>
            <td>${escapeHtml(`${st.fornavn} ${st.efternavn}`.trim())}</td>
            <td class="muted">${escapeHtml(st.klasse||'')}</td>
            <td><div class="pills">${pill('G1','G1')}</div></td>
            <td><div class="pills">${pill('G2','G2')}</div></td>
            <td><div class="pills">${pill('G3','G3')}</div></td>
            <td style="text-align:center">${chk('fanebaerer')}</td>
            <td style="text-align:center">${chk('redskabshold')}</td>
            <td style="text-align:center">${chk('dgi_hjaelper')}</td>
            <td><button class="btn ghost small" type="button" data-clear="${escapeAttr(st.unilogin)}">x</button></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
  }

  function wireGymTable() {
    const wrap = $('marksTableWrap');
    wrap.querySelectorAll('.pillbtn').forEach(btn => {
      btn.addEventListener('click', () => {
        const u = btn.getAttribute('data-u');
        const v = btn.getAttribute('data-v');
        const marks = getMarks(KEYS.marksGym);
        marks[u] = Object.assign({}, marks[u] || {}, { variant: v });
        setMarks(KEYS.marksGym, marks);
        renderMarksTable();
        renderEdit();
      });
    });
    wrap.querySelectorAll('input[type="checkbox"]').forEach(chk => {
      chk.addEventListener('change', () => {
        const u = chk.getAttribute('data-u');
        const k = chk.getAttribute('data-k');
        const marks = getMarks(KEYS.marksGym);
        marks[u] = Object.assign({}, marks[u] || {});
        marks[u][k] = chk.checked;
        setMarks(KEYS.marksGym, marks);
        renderEdit();
      });
    });
    wrap.querySelectorAll('button[data-clear]').forEach(btn => {
      btn.addEventListener('click', () => {
        const u = btn.getAttribute('data-clear');
        const marks = getMarks(KEYS.marksGym);
        delete marks[u];
        setMarks(KEYS.marksGym, marks);
        renderMarksTable();
        renderEdit();
      });
    });
  }

  function buildElevraadTable(students, marks) {
    return `<table>
      <thead><tr>
        <th>Navn</th><th>Klasse</th><th>Elevråd</th><th>–</th>
      </tr></thead>
      <tbody>
        ${students.map(st => {
          const m = marks[st.unilogin] || {};
          return `<tr>
            <td>${escapeHtml(`${st.fornavn} ${st.efternavn}`.trim())}</td>
            <td class="muted">${escapeHtml(st.klasse||'')}</td>
            <td style="text-align:center">
              <input type="checkbox" data-u="${escapeAttr(st.unilogin)}" ${m.yes ? 'checked':''} />
            </td>
            <td><button class="btn ghost small" type="button" data-clear="${escapeAttr(st.unilogin)}">x</button></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
  }

  function wireElevraadTable() {
    const wrap = $('marksTableWrap');
    wrap.querySelectorAll('input[type="checkbox"]').forEach(chk => {
      chk.addEventListener('change', () => {
        const u = chk.getAttribute('data-u');
        const marks = getMarks(KEYS.marksElev);
        marks[u] = { yes: chk.checked };
        if (!chk.checked) delete marks[u];
        setMarks(KEYS.marksElev, marks);
        renderEdit();
      });
    });
    wrap.querySelectorAll('button[data-clear]').forEach(btn => {
      btn.addEventListener('click', () => {
        const u = btn.getAttribute('data-clear');
        const marks = getMarks(KEYS.marksElev);
        delete marks[u];
        setMarks(KEYS.marksElev, marks);
        renderMarksTable();
        renderEdit();
      });
    });
  }

  function renderAll() {
    renderStatus();
    renderSettings();
    renderKList();
    renderEdit();
  }

  // =============================
  // Build statement (template + snippets + free text)
  // =============================
  function buildStatement(st, settings) {
    const templates = getTemplates();
    const p = computePeriod(settings.schoolYearEnd);

    // free texts
    const t = getTextFor(st.unilogin);

    const freeElev = (t.elevudvikling || '').trim();
    const freePrak = (t.praktisk || '').trim();
    const freeKgrp = (t.kgruppe || '').trim() || SNIPPETS.kontaktgruppeDefault;

    // marks
    const sang = getMarks(KEYS.marksSang)[st.unilogin]?.variant || '';
    const gym  = getMarks(KEYS.marksGym)[st.unilogin] || {};
    const elev = getMarks(KEYS.marksElev)[st.unilogin] || {};

    const sangSnippet = sang ? (SNIPPETS.sang[sang]?.neutral || '') : '';
    const gymSnippet  = gym.variant ? (SNIPPETS.gym[gym.variant]?.neutral || '') : '';
    const elevSnippet = elev.yes ? (SNIPPETS.elevraad.YES.neutral) : '';

    const roleSnips = [];
    if (gym.fanebaerer) roleSnips.push(SNIPPETS.roller.FANEB.neutral);
    if (gym.redskabshold) roleSnips.push(SNIPPETS.roller.REDSK.neutral);
    if (gym.dgi_hjaelper) roleSnips.push(SNIPPETS.roller.DGI.neutral);

    // samlet sang+gym afsnit (trim blanklinjer)
    const sangGymBlock = compactParagraphs([
      sangSnippet,
      gymSnippet,
      elevSnippet,
      ...roleSnips
    ]);

    const kontaktlaerere = compactInline([
      st.kontaktlaerer1 || '',
      st.kontaktlaerer2 || ''
    ]);

    const tokens = {
      NAVN: `${st.fornavn} ${st.efternavn}`.trim(),
      FORNAVN: st.fornavn || '',
      EFTERNAVN: st.efternavn || '',
      KLASSE: st.klasse || '',
      PERIODE_FRA: p.from,
      PERIODE_TIL: p.to,
      DATO_MAANED_AAR: p.dateMonthYear,
      SKOLENS_STANDARDTEKST: (templates.schoolText || '').trim(),
      SANG_GYM_AFSNIT: sangGymBlock,
      ELEVUDVIKLING_FRI: freeElev,
      PRAKTISK_FRI: freePrak,
      KGRUPPE_FRI: freeKgrp,
      KONTAKTLAERERE: kontaktlaerere,
      FORSTANDER: settings.forstanderName || ''
    };

    let out = (templates.template || DEFAULT_TEMPLATE);
    out = replaceTokens(out, tokens);

    // fjern “huller”: flere tomme linjer -> maks 2
    out = out.replace(/\n{3,}/g, '\n\n').trim() + '\n\n' + SNIPPETS.afslutningDefault + '\n';
    return out.trim();
  }

  function replaceTokens(template, tokens) {
    return template.replace(/\{([A-Z0-9_]+)\}/g, (m, key) => {
      const v = tokens[key];
      return (v === null || v === undefined) ? '' : String(v);
    });
  }

  function compactParagraphs(parts) {
    const cleaned = parts.map(s => (s||'').trim()).filter(Boolean);
    return cleaned.join('\n\n').trim();
  }
  function compactInline(parts) {
    const cleaned = parts.map(s => (s||'').trim()).filter(Boolean);
    return cleaned.join(' / ').trim();
  }

  // =============================
  // Events
  // =============================
  function bindEvents() {
    // tabs
    $('tab-k').addEventListener('click', () => setTab('k'));
    $('tab-edit').addEventListener('click', () => setTab('edit'));
    $('tab-set').addEventListener('click', () => setTab('set'));

    // reset
    $('btnReset').addEventListener('click', () => {
      if (!confirm('Slette alle lokale data for denne app i denne browser?')) return;
      lsDelPrefix(LS_PREFIX);
      // hard reset
      location.reload();
    });

    // forstander lock toggle
    $('btnToggleForstander').addEventListener('click', () => {
      const s = getSettings();
      s.forstanderLocked = !s.forstanderLocked;
      setSettings(s);
      renderSettings();
    });
    $('forstanderName').addEventListener('input', () => {
      const s = getSettings();
      if (s.forstanderLocked) return;
      s.forstanderName = $('forstanderName').value;
      setSettings(s);
      renderStatus();
      renderEdit();
    });

    // me + year
    $('meInput').addEventListener('input', () => {
      const s = getSettings();
      s.me = $('meInput').value;
      s.meResolved = resolveTeacherName(s.me);
      setSettings(s);
      renderAll();
    });
    $('schoolYearEnd').addEventListener('input', () => {
      const s = getSettings();
      s.schoolYearEnd = Number($('schoolYearEnd').value) || s.schoolYearEnd;
      setSettings(s);
      renderAll();
    });

    // school text lock + restore
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
      renderEdit();
    });
    $('schoolText').addEventListener('input', () => {
      const t = getTemplates();
      if (t.schoolTextLocked) return;
      t.schoolText = $('schoolText').value;
      setTemplates(t);
      renderEdit();
    });

    // students upload
    $('studentsFile').addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      const parsed = parseCsv(text);
      const mapped = mapStudents(parsed);
      if (!mapped.ok) {
        $('studentsStatus').textContent = '❌ Kunne ikke mappe kolonner: ' + mapped.error;
        return;
      }
      setStudents(mapped.students);
      // auto: vælg første K-elev hvis mulig
      const s = getSettings();
      if (s.meResolved) {
        const meNorm = normalizeName(s.meResolved);
        const mine = mapped.students.filter(st => normalizeName(st.kontaktlaerer1)===meNorm || normalizeName(st.kontaktlaerer2)===meNorm);
        if (mine.length) state.selectedUnilogin = mine[0].unilogin;
      }
      renderAll();
      setTab('set');
    });

    // edit autosave
    const saveNow = () => {
      const studs = getStudents();
      if (!state.selectedUnilogin) return;
      const st = studs.find(x => x.unilogin === state.selectedUnilogin);
      if (!st) return;

      const obj = getTextFor(st.unilogin);
      obj.elevudvikling = $('txtElevudv').value;
      obj.praktisk = $('txtPraktisk').value;
      obj.kgruppe = $('txtKgruppe').value;
      obj.lastSavedTs = Date.now();
      setTextFor(st.unilogin, obj);

      $('autosavePill').textContent = `Sidst gemt: ${formatTime(obj.lastSavedTs)}`;
      $('preview').textContent = buildStatement(st, getSettings());
    };

    // debounce
    let tmr = null;
    const debouncedSave = () => {
      if (tmr) clearTimeout(tmr);
      tmr = setTimeout(saveNow, 400);
    };

    ['txtElevudv','txtPraktisk','txtKgruppe'].forEach(id => {
      $(id).addEventListener('input', debouncedSave);
      $(id).addEventListener('blur', saveNow);
    });

    // student input meta
    $('fileStudentInput').addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const studs = getStudents();
      const st = studs.find(x => x.unilogin === state.selectedUnilogin);
      if (!st) return;
      const obj = getTextFor(st.unilogin);
      obj.studentInputMeta = { filename: file.name, ts: Date.now() };
      setTextFor(st.unilogin, obj);
      renderEdit();
    });
    $('btnClearStudentInput').addEventListener('click', () => {
      const studs = getStudents();
      const st = studs.find(x => x.unilogin === state.selectedUnilogin);
      if (!st) return;
      const obj = getTextFor(st.unilogin);
      obj.studentInputMeta = null;
      setTextFor(st.unilogin, obj);
      $('fileStudentInput').value = '';
      renderEdit();
    });

    // print
    $('btnPrint').addEventListener('click', () => window.print());

    // marks type + export
    $('marksType').addEventListener('change', () => renderMarksTable());
    $('btnExportMarks').addEventListener('click', () => exportMarks());

    // imports
    $('importSang').addEventListener('change', e => importMarksFile(e, 'sang'));
    $('importGym').addEventListener('change', e => importMarksFile(e, 'gym'));
    $('importElevraad').addEventListener('change', e => importMarksFile(e, 'elevraad'));
  }

  function exportMarks() {
    const studs = getStudents();
    if (!studs.length) return;
    const type = $('marksType').value;

    let rows = [];
    let headers = [];
    let filename = '';

    if (type === 'sang') {
      const marks = getMarks(KEYS.marksSang);
      headers = ['Unilogin','Navn','Sang_variant'];
      filename = 'sang_marks.csv';
      rows = studs.map(st => ({
        Unilogin: st.unilogin,
        Navn: `${st.fornavn} ${st.efternavn}`.trim(),
        Sang_variant: marks[st.unilogin]?.variant || ''
      }));
    } else if (type === 'gym') {
      const marks = getMarks(KEYS.marksGym);
      headers = ['Unilogin','Navn','Gym_variant','Fanebaerer','Redskabshold','DGI_hjaelper'];
      filename = 'gym_marks.csv';
      rows = studs.map(st => {
        const m = marks[st.unilogin] || {};
        return {
          Unilogin: st.unilogin,
          Navn: `${st.fornavn} ${st.efternavn}`.trim(),
          Gym_variant: m.variant || '',
          Fanebaerer: m.fanebaerer ? 1 : 0,
          Redskabshold: m.redskabshold ? 1 : 0,
          DGI_hjaelper: m.dgi_hjaelper ? 1 : 0
        };
      });
    } else {
      const marks = getMarks(KEYS.marksElev);
      headers = ['Unilogin','Navn','Elevraad'];
      filename = 'elevraad_marks.csv';
      rows = studs.map(st => ({
        Unilogin: st.unilogin,
        Navn: `${st.fornavn} ${st.efternavn}`.trim(),
        Elevraad: marks[st.unilogin]?.yes ? 1 : 0
      }));
    }

    const csv = toCsv(rows, headers);
    downloadText(filename, csv, 'text/csv;charset=utf-8');
  }

  async function importMarksFile(e, kind) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseCsv(text);

    const status = $('importStatus');
    const studs = getStudents();

    const keyMap = {
      sang: KEYS.marksSang,
      gym: KEYS.marksGym,
      elevraad: KEYS.marksElev
    };
    const storeKey = keyMap[kind];

    // find relevant columns
    const headers = parsed.headers;
    const normMap = {};
    headers.forEach(h => normMap[normalizeHeader(h)] = h);

    const colU = normMap['unilogin'] || normMap['unicbrugernavn'] || normMap['username'] || null;
    const colName = normMap['navn'] || normMap['name'] || null;

    if (!colU && !colName) {
      status.textContent = `❌ Import ${kind}: mangler Unilogin eller Navn kolonne.`;
      return;
    }

    let updated = 0;
    const marks = getMarks(storeKey);

    parsed.rows.forEach(r => {
      let u = colU ? (r[colU] || '').trim() : '';
      if (!u && colName) {
        // fallback: match på navn (nødfald)
        const n = normalizeName(r[colName]);
        const hit = studs.find(st => normalizeName(`${st.fornavn} ${st.efternavn}`) === n);
        if (hit) u = hit.unilogin;
      }
      if (!u) return;

      if (kind === 'sang') {
        const colV = pickAny(normMap, ['sangvariant','variant','sang_variant']);
        const v = colV ? (r[colV] || '').trim() : '';
        if (!v) return;
        marks[u] = { variant: v };
        updated++;
      } else if (kind === 'gym') {
        const colV = pickAny(normMap, ['gymvariant','variant','gym_variant']);
        const v = colV ? (r[colV] || '').trim() : '';
        const fan = truthy(r[pickAny(normMap, ['fanebaerer','fanebærer'])]);
        const red = truthy(r[pickAny(normMap, ['redskabshold','redskabsholdet'])]);
        const dgi = truthy(r[pickAny(normMap, ['dgihjaelper','dgi_hjaelper','dgi-hjaelper','dgi hjælper'])]);
        marks[u] = Object.assign({}, marks[u] || {});
        if (v) marks[u].variant = v;
        if (fan !== null) marks[u].fanebaerer = fan;
        if (red !== null) marks[u].redskabshold = red;
        if (dgi !== null) marks[u].dgi_hjaelper = dgi;
        updated++;
      } else {
        const colV = pickAny(normMap, ['elevraad','elevråd']);
        const v = colV ? (r[colV] || '').trim() : '';
        const yes = truthy(v);
        if (yes) marks[u] = { yes: true };
        else delete marks[u];
        updated++;
      }
    });

    setMarks(storeKey, marks);
    status.textContent = `✅ Import ${kind}: opdaterede ${updated} rækker.`;
    renderAll();
  }

  function pickAny(normMap, keys) {
    for (const k of keys) {
      const nk = normalizeHeader(k);
      if (normMap[nk]) return normMap[nk];
    }
    return null;
  }
  function truthy(v) {
    if (v === undefined || v === null) return null;
    const s = normalizeName(String(v));
    if (!s) return null;
    if (s === '1' || s === 'ja' || s === 'true' || s === 'yes' || s === 'x') return true;
    if (s === '0' || s === 'nej' || s === 'false' || s === 'no') return false;
    return null;
  }

  function downloadText(filename, text, mime) {
    const blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  // =============================
  // Student mapping
  // =============================
  function mapStudents(parsed) {
    const headers = parsed.headers;
    const normToOrig = {};
    headers.forEach(h => normToOrig[normalizeHeader(h)] = h);

    const col = (aliases) => {
      for (const a of aliases) {
        const k = normalizeHeader(a);
        if (normToOrig[k]) return normToOrig[k];
      }
      return null;
    };

    const cFornavn = col(['fornavn','firstname','navnfornavn']);
    const cEfternavn= col(['efternavn','lastname','navnefternavn']);
    const cUni     = col(['unilogin','uni-cbrugernavn','unicbrugernavn','uni-c brugernavn','username','unic']);
    const cKoen    = col(['køn','koen','gender']);
    const cK1      = col(['kontaktlærer1','kontaktlaerer1','relationerkontaktlaerer-navn','relationer-kontaktlærer-navn','relationerkontaktlaerer navn']);
    const cK2      = col(['kontaktlærer2','kontaktlaerer2','relationerandenkontaktlaerer-navn','relationer-anden kontaktlærer-navn','relationer-anden kontaktlaerer-navn']);
    const cKlasse  = col(['klasse','class']);

    // Minimum: fornavn, efternavn, unilogin, klasse, kontaktlærere
    if (!cFornavn || !cEfternavn || !cKlasse || (!cK1 && !cK2)) {
      return { ok:false, error:`Fandt ikke nok kolonner (kræver Fornavn, Efternavn, Klasse og mindst én af Kontaktlærer1/2).` };
    }

    const students = [];
    parsed.rows.forEach((r, idx) => {
      const fornavn = (r[cFornavn] || '').trim();
      const efternavn = (r[cEfternavn] || '').trim();
      const klasse = (r[cKlasse] || '').trim();
      const k1 = cK1 ? (r[cK1] || '').trim() : '';
      const k2 = cK2 ? (r[cK2] || '').trim() : '';
      const koen = cKoen ? (r[cKoen] || '').trim() : '';
      let unilogin = cUni ? (r[cUni] || '').trim() : '';

      // fallback unilogin: lav stabil key hvis mangler
      if (!unilogin) {
        unilogin = `name_${normalizeHeader(fornavn + '_' + efternavn)}_${idx+1}`;
      }

      students.push({
        fornavn, efternavn, unilogin,
        koen,
        kontaktlaerer1: k1,
        kontaktlaerer2: k2,
        klasse
      });
    });

    return { ok:true, students };
  }

  // =============================
  // HTML escaping
  // =============================
  function escapeHtml(s) {
    return (s ?? '').toString()
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/\s+/g,' ');
  }

  // =============================
  // Boot
  // =============================
  function init() {
    // ensure settings/templates exist
    if (!localStorage.getItem(KEYS.settings)) setSettings(defaultSettings());
    if (!localStorage.getItem(KEYS.templates)) setTemplates(defaultTemplates());

    bindEvents();

    // initial tab: if no students -> set
    const studs = getStudents();
    state.tab = studs.length ? 'k' : 'set';
    setTab(state.tab);
  }

  window.addEventListener('DOMContentLoaded', init);

})();
