import React, { useEffect, useMemo, useRef, useState } from "react";

const LS_KEY = "udtalelsesapp_v1_3";

const PRONOUNS = {
  dreng: { HAN_HUN: "han", HAM_HENDE: "ham", HANS_HENDES: "hans" },
  pige:  { HAN_HUN: "hun", HAM_HENDE: "hende", HANS_HENDES: "hendes" }
};

const SANG_OPTIONS = [
  { id: "S1", label: "Meget aktiv og engageret deltagelse" },
  { id: "S2", label: "Stabil og positiv deltagelse" },
  { id: "S3", label: "Varierende / tilbageholdende deltagelse" },
  { id: "S4", label: "Begrænset deltagelse / ofte fraværende" }
];

const GYM_OPTIONS = [
  { id: "G1", label: "Meget aktiv og engageret deltagelse" },
  { id: "G2", label: "Stabil og positiv deltagelse" },
  { id: "G3", label: "Varierende / tilbageholdende deltagelse" },
  { id: "G4", label: "Begrænset deltagelse / ofte fraværende" }
];

const ROLE_OPTIONS = [
  { id: "FANEB", label: "Fanebærer" },
  { id: "REDSKAB", label: "Redskabshold" },
  { id: "DGI", label: "DGI-hjælper" },
  { id: "ER", label: "Elevrådsrepræsentant" }
];

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"' && inQuotes && next === '"') { cur += '"'; i++; continue; }
    if (c === '"') { inQuotes = !inQuotes; continue; }
    if (c === "," && !inQuotes) { row.push(cur); cur = ""; continue; }
    if ((c === "\n" || c === "\r") && !inQuotes) {
      if (c === "\r" && next === "\n") i++;
      row.push(cur); rows.push(row); row = []; cur = ""; continue;
    }
    cur += c;
  }
  row.push(cur); rows.push(row);

  const header = (rows.shift() || []).map(h => h.trim());
  return rows
    .filter(r => r.some(x => String(x ?? "").trim() !== ""))
    .map(r => {
      const obj = {};
      header.forEach((h, idx) => (obj[h] = (r[idx] ?? "").trim()));
      return obj;
    });
}

async function fileToText(file) { return await file.text(); }

function normalizeGender(raw) {
  const v = String(raw || "").trim().toLowerCase();
  if (["pige","k","kvinde","f","female"].includes(v)) return "pige";
  return "dreng";
}

function renderTokens(text, student) {
  const p = PRONOUNS[student.genderKey] ?? PRONOUNS.dreng;
  return (text || "")
    .replaceAll("{{FORNAVN}}", student.firstName || "")
    .replaceAll("{{HAN_HUN}}", p.HAN_HUN)
    .replaceAll("{{HAM_HENDE}}", p.HAM_HENDE)
    .replaceAll("{{HANS_HENDES}}", p.HANS_HENDES);
}

function downloadCSV(filename, rows) {
  const csv = rows.map(r => r.map(cell => {
    const s = String(cell ?? "");
    if (/[",\n\r]/.test(s)) return `"${s.replaceAll('"','""')}"`;
    return s;
  }).join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

function downloadText(filename, text, mime = "application/json") {
  const blob = new Blob([text], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

function uid() { return Math.random().toString(36).slice(2, 10); }

const defaultTemplates = {
  schoolIntro: "Udtalelse vedrørende {{FULLNAME}}",
  schoolAbout:
    "Himmerlands Ungdomsskole er en traditionsrig efterskole, som prioriterer fællesskabet og faglig fordybelse højt. Elevernes hverdag er præget af frie rammer og mange muligheder. Vi møder eleverne med tillid, positive forventninger og faglige udfordringer. I løbet af et efterskoleår på Himmerlands Ungdomsskole er oplevelserne mange og udfordringerne ligeså. Det gælder i hverdagens almindelige undervisning, som fordeler sig over boglige fag, fællesfag og profilfag. Det gælder også alle de dage, hvor hverdagen ændres til fordel for temauger, studieture mm.",
  sangGymIntro:
    "Som en del af et efterskoleår på Himmerlands Ungdomsskole deltager eleverne ugentligt i fællessang og fællesgymnastik. Begge fag udgør en del af efterskolelivet, hvor eleverne oplever nye sider af sig selv, flytter grænser og oplever, at deres bidrag til fællesskabet har betydning. I løbet af året optræder eleverne med fælleskor og gymnastikopvisninger.",
  practicalLead: "På en efterskole er der mange praktiske opgaver.",
  closing: "Vi har været rigtig glade for at have {{FORNAVN}} som elev på skolen og ønsker held og lykke fremover."
};

function makeModuleFromOption(opt, kind) {
  const base = kind === "sang" ? "i fællessang" : "i gymnastik";
  return {
    code: opt.id,
    title: opt.label,
    text_m: `{{FORNAVN}} har ${base} udvist: ${opt.label.toLowerCase()}.`,
    text_k: `{{FORNAVN}} har ${base} udvist: ${opt.label.toLowerCase()}.`,
    tags: ""
  };
}

const initialState = {
  defaults: {
    dateMonthYear: "",
    periodFrom: "",
    periodTo: "",
    principal: "",
    contactTeacher1: "",
    contactTeacher2: "",
    kontaktgruppeAntal: 20
  },
  templates: defaultTemplates,
  libs: {
    sang: SANG_OPTIONS.map(o => makeModuleFromOption(o, "sang")),
    gym:  GYM_OPTIONS.map(o => makeModuleFromOption(o, "gym")),
    roles: ROLE_OPTIONS
  },
  students: [],
  statements: {},
  marks: { sang: {}, gym: {}, roles: {}, elevraad: {} }
};

function makeEmptyStatement(UNIlogin, defaults) {
  return {
    statementId: uid(),
    UNIlogin,
    meta: { dateMonthYear: defaults.dateMonthYear, periodFrom: defaults.periodFrom, periodTo: defaults.periodTo },
    selections: { sangModuleCode: "", gymModuleCode: "", roleIds: [] },
    studentInput: { rawText: "" },
    teacherBlocks: {
      elevUdviklingAfsnit: "",
      praktiskAfsnit: "",
      kontaktgruppeAntal: defaults.kontaktgruppeAntal ?? 20,
      kontaktgruppeBeskrivelse: ""
    },
    signatures: { contactTeacher1: defaults.contactTeacher1 || "", contactTeacher2: defaults.contactTeacher2 || "" }
  };
}

function clampStr(s, maxChars) {
  const t = (s || "").trim();
  if (t.length <= maxChars) return t;
  return t.slice(0, maxChars - 1).trimEnd() + "…";
}

function findModuleByCode(list, code) {
  return (list || []).find(m => (m.code || "") === (code || "")) || null;
}

function moduleText(module, student) {
  if (!module) return "";
  const base = student.genderKey === "pige" ? module.text_k : module.text_m;
  return renderTokens(base, student);
}

function buildDocModel({ defaults, templates, student, statement, libs }) {
  const p = PRONOUNS[student.genderKey] ?? PRONOUNS.dreng;
  const sangModule = findModuleByCode(libs.sang, statement.selections.sangModuleCode);
  const gymModule  = findModuleByCode(libs.gym, statement.selections.gymModuleCode);

  const sangText = moduleText(sangModule, student);
  const gymText  = moduleText(gymModule, student);
  const roleLabels = (statement.selections.roleIds || []).map(id => (ROLE_OPTIONS.find(r => r.id === id)?.label)).filter(Boolean);
  const rolesText = roleLabels.length ? `Ekstra roller: ${roleLabels.join(", ")}.` : "";
  const sangGymAfsnit = [sangText, gymText, rolesText].filter(Boolean).join("\n\n");

  return {
    dateMonthYear: statement.meta.dateMonthYear || defaults.dateMonthYear,
    fullName: `${student.firstName} ${student.lastName}`.trim(),
    firstName: student.firstName,
    lastName: student.lastName,
    UNIlogin: student.UNIlogin,
    periodFrom: statement.meta.periodFrom || defaults.periodFrom,
    periodTo: statement.meta.periodTo || defaults.periodTo,
    classLabel: student.classLabel || "",
    hamHende: p.HAM_HENDE,
    elevUdviklingAfsnit: (statement.teacherBlocks.elevUdviklingAfsnit || "").trim(),
    sangGymAfsnit,
    praktiskAfsnit: (statement.teacherBlocks.praktiskAfsnit || "").trim(),
    kontaktgruppeAntal: String(statement.teacherBlocks.kontaktgruppeAntal ?? defaults.kontaktgruppeAntal ?? ""),
    kontaktgruppeBeskrivelse: (statement.teacherBlocks.kontaktgruppeBeskrivelse || "").trim(),
    contactTeacher1: statement.signatures.contactTeacher1 || defaults.contactTeacher1 || "",
    contactTeacher2: statement.signatures.contactTeacher2 || defaults.contactTeacher2 || "",
    principal: defaults.principal || "",
    templates: { ...templates }
  };
}

export default function App() {
  const [state, setState] = useState(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return initialState;
    try {
      const parsed = JSON.parse(raw);
      return { ...initialState, ...parsed, templates: { ...defaultTemplates, ...(parsed.templates || {}) } };
    } catch {
      return initialState;
    }
  });

  const [screen, setScreen] = useState("setup");
  const [activeUNIlogin, setActiveUNIlogin] = useState("");
  const previewRef = useRef(null);
  const [overOnePage, setOverOnePage] = useState(false);

  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify(state)); }, [state]);

  const studentsByUNI = useMemo(() => {
    const m = new Map();
    for (const s of state.students) m.set(s.UNIlogin, s);
    return m;
  }, [state.students]);

  const activeStudent = useMemo(() => studentsByUNI.get(activeUNIlogin) || null, [studentsByUNI, activeUNIlogin]);
  const activeStatement = useMemo(() => {
    if (!activeUNIlogin) return null;
    return state.statements[activeUNIlogin] || makeEmptyStatement(activeUNIlogin, state.defaults);
  }, [activeUNIlogin, state.statements, state.defaults]);

  const docModel = useMemo(() => {
    if (!activeStudent || !activeStatement) return null;
    return buildDocModel({ defaults: state.defaults, templates: state.templates, student: activeStudent, statement: activeStatement, libs: state.libs });
  }, [activeStudent, activeStatement, state.defaults, state.templates, state.libs]);

  useEffect(() => {
    if (!previewRef.current) return;
    const el = previewRef.current;
    const check = () => setOverOnePage(el.scrollHeight > el.clientHeight + 2);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [docModel, screen]);

  function updateDefaults(patch) { setState(s => ({ ...s, defaults: { ...s.defaults, ...patch } })); }
  function updateTemplates(patch) { setState(s => ({ ...s, templates: { ...s.templates, ...patch } })); }

  function updateStatement(UNIlogin, patch) {
    setState(s => ({
      ...s,
      statements: {
        ...s.statements,
        [UNIlogin]: { ...(s.statements[UNIlogin] || makeEmptyStatement(UNIlogin, s.defaults)), ...patch }
      }
    }));
  }

  function updateStudent(UNIlogin, patch) {
    setState(s => ({ ...s, students: s.students.map(st => st.UNIlogin === UNIlogin ? { ...st, ...patch } : st) }));
  }

  async function importStudentsCSV(file) {
    const text = await fileToText(file);
    const arr = parseCSV(text);

    setState(s => {
      const students = [];
      const statements = { ...s.statements };

      for (const r of arr) {
        const UNIlogin = String(r["UNIlogin"] || r["unilogin"] || "").trim();
        if (!UNIlogin) continue;

        const firstName = String(r["Fornavn"] || r["fornavn"] || "").trim();
        const lastName  = String(r["Efternavn"] || r["efternavn"] || "").trim();
        const genderKey = normalizeGender(r["Køn"] || r["køn"]);

        students.push({ UNIlogin, firstName, lastName, genderKey, classLabel: "", kTeacher1: "", kTeacher2: "" });
        if (!statements[UNIlogin]) statements[UNIlogin] = makeEmptyStatement(UNIlogin, s.defaults);
      }

      students.sort((a,b) => (a.lastName||"").localeCompare(b.lastName||"") || (a.firstName||"").localeCompare(b.firstName||""));
      return { ...s, students, statements };
    });
  }

  async function importSangMarks(file) {
    const text = await fileToText(file);
    const arr = parseCSV(text);
    setState(s => {
      const sang = { ...s.marks.sang };
      const statements = { ...s.statements };
      for (const r of arr) {
        const u = String(r["UNIlogin"] || "").trim();
        const label = String(r["SangValgTekst"] || "").trim();
        if (!u || !label) continue;
        const opt = SANG_OPTIONS.find(o => o.label === label) || SANG_OPTIONS[0];
        sang[u] = { id: opt.id, label: opt.label };
        if (statements[u]) statements[u] = { ...statements[u], selections: { ...statements[u].selections, sangModuleCode: opt.id } };
      }
      return { ...s, marks: { ...s.marks, sang }, statements };
    });
  }

  async function importGymMarks(file) {
    const text = await fileToText(file);
    const arr = parseCSV(text);
    setState(s => {
      const gym = { ...s.marks.gym };
      const roles = { ...(s.marks.roles || {}) };
      const statements = { ...s.statements };

      for (const r of arr) {
        const u = String(r["UNIlogin"] || "").trim();
        if (!u) continue;
        const gymLabel = String(r["GymValgTekst"] || "").trim();
        const rolesText = String(r["RollerTekst"] || "").trim();

        if (gymLabel) {
          const opt = GYM_OPTIONS.find(o => o.label === gymLabel) || GYM_OPTIONS[0];
          gym[u] = { id: opt.id, label: opt.label };
          if (statements[u]) statements[u] = { ...statements[u], selections: { ...statements[u].selections, gymModuleCode: opt.id } };
        }

        if (rolesText) {
          const wanted = rolesText.split("|").map(x => x.trim()).filter(Boolean);
          const ids = wanted.map(l => ROLE_OPTIONS.find(r => r.label === l)?.id).filter(Boolean);
          const prev = new Set(roles[u] || []);
          ids.forEach(id => prev.add(id));
          roles[u] = Array.from(prev);

          if (statements[u]) {
            const prev2 = new Set(statements[u].selections.roleIds || []);
            ids.forEach(id => prev2.add(id));
            statements[u] = { ...statements[u], selections: { ...statements[u].selections, roleIds: Array.from(prev2) } };
          }
        }
      }
      return { ...s, marks: { ...s.marks, gym, roles }, statements };
    });
  }

  async function importElevraadMarks(file) {
    const text = await fileToText(file);
    const arr = parseCSV(text);
    setState(s => {
      const elevraad = { ...s.marks.elevraad };
      const roles = { ...(s.marks.roles || {}) };
      const statements = { ...s.statements };

      for (const r of arr) {
        const u = String(r["UNIlogin"] || "").trim();
        if (!u) continue;
        elevraad[u] = true;
        const prev = new Set(roles[u] || []);
        prev.add("ER");
        roles[u] = Array.from(prev);

        if (statements[u]) {
          const prev2 = new Set(statements[u].selections.roleIds || []);
          prev2.add("ER");
          statements[u] = { ...statements[u], selections: { ...statements[u].selections, roleIds: Array.from(prev2) } };
        }
      }
      return { ...s, marks: { ...s.marks, elevraad, roles }, statements };
    });
  }

  function exportBackup() {
    downloadText("elevudtalelsesapp_backup.json", JSON.stringify({ version: "B1.3", exportedAt: new Date().toISOString(), state }, null, 2));
  }

  async function importBackup(file) {
    const text = await fileToText(file);
    const payload = JSON.parse(text);
    if (!payload?.state) return;
    setState({ ...initialState, ...payload.state, templates: { ...defaultTemplates, ...(payload.state.templates || {}) } });
  }

  function onPrint() { window.print(); }

  function Preview({ model }) {
    if (!model) return null;

    const elevUdvikling = clampStr(model.elevUdviklingAfsnit, 950);
    const sangGym = clampStr(model.sangGymAfsnit, 850);
    const praktisk = clampStr(model.praktiskAfsnit, 450);
    const kontakt = clampStr(model.kontaktgruppeBeskrivelse, 280);

    const heading = (model.templates.schoolIntro || "Udtalelse vedrørende {{FULLNAME}}").replaceAll("{{FULLNAME}}", model.fullName);
    const about = model.templates.schoolAbout || "";
    const sangIntro = model.templates.sangGymIntro || "";
    const practicalLead = model.templates.practicalLead || "På en efterskole er der mange praktiske opgaver.";
    const closing = renderTokens(model.templates.closing || "", model);

    return (
      <div className="a4Wrap">
        <div className="a4">
          <div className="hRight small">{model.dateMonthYear}</div>
          <h1>{heading}</h1>

          <p>{model.firstName} {model.lastName} har været elev på Himmerlands Ungdomsskole i perioden fra {model.periodFrom} til {model.periodTo} i {model.classLabel || "—"}.</p>

          {about && <p>{about}</p>}
          {elevUdvikling && <p>{elevUdvikling}</p>}
          {sangIntro && <p>{sangIntro}</p>}
          {sangGym && <p style={{ whiteSpace: "pre-line" }}>{sangGym}</p>}
          {praktisk && <p>{practicalLead} {praktisk}</p>}

          <p>{model.firstName} har på Himmerlands Ungdomsskole været en del af en kontaktgruppe på {model.kontaktgruppeAntal} elever.
            {kontakt ? <> I kontaktgruppen kender vi {model.hamHende} som {kontakt}.</> : null}
          </p>

          {closing && <p>{closing}</p>}

          <div className="sig">
            <p>{model.contactTeacher1}{model.contactTeacher2 ? <> &amp; {model.contactTeacher2}</> : null}</p>
            <p>Kontaktlærere</p>
            {model.principal ? (<><p style={{ marginTop: 10 }}>{model.principal}</p><p>Forstander</p></>) : null}
          </div>
        </div>
      </div>
    );
  }

  // Input tabs state
  const [sangInputs, setSangInputs] = useState({});
  const [gymInputs, setGymInputs] = useState({});
  const [roleInputs, setRoleInputs] = useState({});
  const [elevraadInputs, setElevraadInputs] = useState({});

  useEffect(() => {
    const sMarks = {};
    for (const [u, v] of Object.entries(state.marks.sang || {})) sMarks[u] = v.label;
    setSangInputs(sMarks);

    const gMarks = {};
    for (const [u, v] of Object.entries(state.marks.gym || {})) gMarks[u] = v.label;
    setGymInputs(gMarks);

    const rMarks = {};
    for (const [u, ids] of Object.entries(state.marks.roles || {})) rMarks[u] = new Set(ids || []);
    setRoleInputs(rMarks);

    setElevraadInputs({ ...(state.marks.elevraad || {}) });
  }, []);

  function ensureStudentsLoaded() { return state.students.length > 0; }

  function saveSangToMarks() {
    setState(s => {
      const sang = { ...s.marks.sang };
      for (const [u, label] of Object.entries(sangInputs)) {
        const opt = SANG_OPTIONS.find(o => o.label === label);
        if (opt) sang[u] = { id: opt.id, label: opt.label };
      }
      return { ...s, marks: { ...s.marks, sang } };
    });
  }

  function saveGymToMarks() {
    setState(s => {
      const gym = { ...s.marks.gym };
      for (const [u, label] of Object.entries(gymInputs)) {
        const opt = GYM_OPTIONS.find(o => o.label === label);
        if (opt) gym[u] = { id: opt.id, label: opt.label };
      }

      const rolesPlain = { ...(s.marks.roles || {}) };
      for (const [u, setv] of Object.entries(roleInputs)) rolesPlain[u] = Array.from(setv || []);

      return { ...s, marks: { ...s.marks, gym, roles: rolesPlain } };
    });
  }

  function saveElevraadToMarks() {
    setState(s => {
      const elevraad = {};
      for (const [u, v] of Object.entries(elevraadInputs)) if (v) elevraad[u] = true;

      const rolesPlain = { ...(s.marks.roles || {}) };
      for (const u of Object.keys(elevraad)) {
        const prev = new Set(rolesPlain[u] || []);
        prev.add("ER");
        rolesPlain[u] = Array.from(prev);
      }

      return { ...s, marks: { ...s.marks, elevraad, roles: rolesPlain } };
    });
  }

  function exportSangMarksCSV() {
    const rows = [["UNIlogin", "SangValgTekst"]];
    for (const st of state.students) {
      const label = sangInputs[st.UNIlogin];
      if (label) rows.push([st.UNIlogin, label]);
    }
    downloadCSV("sang_marks.csv", rows);
  }

  function exportGymMarksCSV() {
    const rows = [["UNIlogin", "GymValgTekst", "RollerTekst"]];
    for (const st of state.students) {
      const gymLabel = gymInputs[st.UNIlogin] || "";
      const roleSet = roleInputs[st.UNIlogin] || new Set();
      const roleLabels = Array.from(roleSet).filter(id => id !== "ER")
        .map(id => ROLE_OPTIONS.find(r => r.id === id)?.label).filter(Boolean);
      const rolesText = roleLabels.join("|");
      if (gymLabel || rolesText) rows.push([st.UNIlogin, gymLabel, rolesText]);
    }
    downloadCSV("gym_marks.csv", rows);
  }

  function exportElevraadMarksCSV() {
    const rows = [["UNIlogin"]];
    for (const st of state.students) {
      if (elevraadInputs[st.UNIlogin]) rows.push([st.UNIlogin]);
    }
    downloadCSV("elevraad_marks.csv", rows);
  }

  function applyMarksToStatements() {
    setState(s => {
      const statements = { ...s.statements };
      for (const st of s.students) {
        const u = st.UNIlogin;
        if (!statements[u]) continue;
        const sangOpt = s.marks.sang?.[u];
        const gymOpt = s.marks.gym?.[u];
        const roleIds = (s.marks.roles?.[u] || []);
        statements[u] = {
          ...statements[u],
          selections: {
            ...statements[u].selections,
            sangModuleCode: sangOpt?.id || statements[u].selections.sangModuleCode,
            gymModuleCode: gymOpt?.id || statements[u].selections.gymModuleCode,
            roleIds: Array.from(new Set([...(statements[u].selections.roleIds || []), ...roleIds]))
          }
        };
      }
      return { ...s, statements };
    });
  }

  const sortedStudents = useMemo(() => {
    return [...state.students].sort((a,b) => (a.lastName||"").localeCompare(b.lastName||"") || (a.firstName||"").localeCompare(b.firstName||""));
  }, [state.students]);

  return (
    <div className="container">
      <div className="printDoc"><Preview model={docModel} /></div>

      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="row">
          <strong>Elevudtalelsesapp (B1.3)</strong>
          <span className="badge">Inputfaner</span>
          <span className="badge">lokal data</span>
        </div>
        <div className="row">
          <button className={screen==="setup" ? "btnGhost" : ""} onClick={() => setScreen("setup")} disabled={screen==="setup"}>Setup</button>
          <button className={screen==="library" ? "btnGhost" : ""} onClick={() => setScreen("library")} disabled={screen==="library"}>Bibliotek</button>
          <button className={screen==="editor" ? "btnGhost" : ""} onClick={() => setScreen("editor")} disabled={screen==="editor" || !activeUNIlogin}>Redigér</button>
          <button className={screen==="sang" ? "btnGhost" : ""} onClick={() => setScreen("sang")} disabled={screen==="sang"}>Sang</button>
          <button className={screen==="gym" ? "btnGhost" : ""} onClick={() => setScreen("gym")} disabled={screen==="gym"}>Gym/roller</button>
          <button className={screen==="elevraad" ? "btnGhost" : ""} onClick={() => setScreen("elevraad")} disabled={screen==="elevraad"}>Elevråd</button>
        </div>
      </div>

      {screen === "setup" && (
        <div className="card grid" style={{ marginTop: 12 }}>
          <h3>Setup</h3>

          <div className="grid grid2">
            <div className="field">
              <label>Defaults</label>
              <div className="row">
                <div className="field" style={{ flex: 1 }}>
                  <label>Dato måned/år</label>
                  <input value={state.defaults.dateMonthYear} placeholder="Juni 202x" onChange={(e) => updateDefaults({ dateMonthYear: e.target.value })} />
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label>Periode fra</label>
                  <input value={state.defaults.periodFrom} placeholder="august 202x" onChange={(e) => updateDefaults({ periodFrom: e.target.value })} />
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label>Periode til</label>
                  <input value={state.defaults.periodTo} placeholder="juni 202x" onChange={(e) => updateDefaults({ periodTo: e.target.value })} />
                </div>
              </div>
              <div className="row">
                <div className="field" style={{ flex: 1 }}>
                  <label>Forstander</label>
                  <input value={state.defaults.principal} placeholder="skriv aktuelt navn…" onChange={(e) => updateDefaults({ principal: e.target.value })} />
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label>Kontaktlærer 1</label>
                  <input value={state.defaults.contactTeacher1} onChange={(e) => updateDefaults({ contactTeacher1: e.target.value })} />
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label>Kontaktlærer 2</label>
                  <input value={state.defaults.contactTeacher2} onChange={(e) => updateDefaults({ contactTeacher2: e.target.value })} />
                </div>
                <div className="field" style={{ width: 160 }}>
                  <label>Kontaktgruppe antal</label>
                  <input type="number" value={state.defaults.kontaktgruppeAntal} onChange={(e) => updateDefaults({ kontaktgruppeAntal: Number(e.target.value || 0) })} />
                </div>
              </div>

              <hr />
              <div className="row">
                <button onClick={exportBackup}>Download backup.json</button>
                <label className="small" style={{ display:"inline-flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontWeight: 600 }}>Importér backup.json</span>
                  <input type="file" accept=".json" onChange={(e) => e.target.files?.[0] && importBackup(e.target.files[0])} />
                </label>
              </div>
            </div>

            <div className="field">
              <label>Importér data (lokalt)</label>
              <hr />
              <div className="grid" style={{ gap: 10 }}>
                <div className="field">
                  <label>Elever (students.csv)</label>
                  <input type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && importStudentsCSV(e.target.files[0])} />
                  <div className="small">Headere skal være: Fornavn, Efternavn, UNIlogin, Køn</div>
                </div>

                <hr />
                <strong>Importér faglærer-filer (marks)</strong>

                <div className="field">
                  <label>sang_marks.csv</label>
                  <input type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && importSangMarks(e.target.files[0])} />
                </div>
                <div className="field">
                  <label>gym_marks.csv</label>
                  <input type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && importGymMarks(e.target.files[0])} />
                </div>
                <div className="field">
                  <label>elevraad_marks.csv</label>
                  <input type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && importElevraadMarks(e.target.files[0])} />
                </div>

                <div className="row">
                  <button onClick={applyMarksToStatements} disabled={!ensureStudentsLoaded()}>Overfør marks → udtalelser</button>
                </div>
              </div>
            </div>
          </div>

          <hr />
          <div className="card grid">
            <strong>Skabelon-tekster (redigerbare)</strong>
            <div className="field">
              <label>Skolens standardtekst</label>
              <textarea value={state.templates.schoolAbout} onChange={(e)=>updateTemplates({ schoolAbout: e.target.value })} />
            </div>
          </div>
        </div>
      )}

      {screen === "library" && (
        <div className="card grid" style={{ marginTop: 12 }}>
          <h3 style={{ margin: 0 }}>Bibliotek</h3>
          {state.students.length === 0 ? (
            <div className="small">Ingen elever endnu. Importér “students.csv” i Setup.</div>
          ) : (
            <table>
              <thead><tr><th>Elev</th><th>UNIlogin</th><th>Køn</th><th></th></tr></thead>
              <tbody>
                {sortedStudents.map(st => (
                  <tr key={st.UNIlogin}>
                    <td><strong>{st.firstName} {st.lastName}</strong></td>
                    <td className="small">{st.UNIlogin}</td>
                    <td className="small">{st.genderKey}</td>
                    <td style={{ width: 120 }}>
                      <button onClick={() => { setActiveUNIlogin(st.UNIlogin); setScreen("editor"); }}>Åbn</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {screen === "sang" && (
        <div className="card grid" style={{ marginTop: 12 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h3 style={{ margin: 0 }}>Sang – udfyld for hele elevholdet</h3>
            <button onClick={() => { saveSangToMarks(); exportSangMarksCSV(); }} disabled={!ensureStudentsLoaded()}>Gem + eksportér sang_marks.csv</button>
          </div>
          {!ensureStudentsLoaded() ? (
            <div className="warn">Importér først <strong>students.csv</strong> i Setup.</div>
          ) : (
            <table>
              <thead><tr><th>Elev</th><th>UNIlogin</th><th>Sang-deltagelse</th></tr></thead>
              <tbody>
                {sortedStudents.map(st => (
                  <tr key={st.UNIlogin}>
                    <td><strong>{st.firstName} {st.lastName}</strong></td>
                    <td className="small">{st.UNIlogin}</td>
                    <td>
                      <select value={sangInputs[st.UNIlogin] || ""}
                        onChange={(e) => setSangInputs(prev => ({ ...prev, [st.UNIlogin]: e.target.value }))}>
                        <option value="">— vælg —</option>
                        {SANG_OPTIONS.map(o => (<option key={o.id} value={o.label}>{o.label}</option>))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {screen === "gym" && (
        <div className="card grid" style={{ marginTop: 12 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h3 style={{ margin: 0 }}>Gymnastik/roller – udfyld for hele elevholdet</h3>
            <button onClick={() => { saveGymToMarks(); exportGymMarksCSV(); }} disabled={!ensureStudentsLoaded()}>Gem + eksportér gym_marks.csv</button>
          </div>
          {!ensureStudentsLoaded() ? (
            <div className="warn">Importér først <strong>students.csv</strong> i Setup.</div>
          ) : (
            <table>
              <thead><tr><th>Elev</th><th>UNIlogin</th><th>Gym-deltagelse</th><th>Roller</th></tr></thead>
              <tbody>
                {sortedStudents.map(st => {
                  const roleSet = roleInputs[st.UNIlogin] || new Set();
                  return (
                    <tr key={st.UNIlogin}>
                      <td><strong>{st.firstName} {st.lastName}</strong></td>
                      <td className="small">{st.UNIlogin}</td>
                      <td>
                        <select value={gymInputs[st.UNIlogin] || ""}
                          onChange={(e) => setGymInputs(prev => ({ ...prev, [st.UNilogin]: e.target.value }))}>
                          <option value="">— vælg —</option>
                          {GYM_OPTIONS.map(o => (<option key={o.id} value={o.label}>{o.label}</option>))}
                        </select>
                      </td>
                      <td>
                        <div className="row" style={{ gap: 12 }}>
                          {ROLE_OPTIONS.filter(r => r.id !== "ER").map(r => (
                            <label key={r.id} className="row" style={{ gap: 6 }}>
                              <input type="checkbox" checked={roleSet.has(r.id)}
                                onChange={() => {
                                  const next = new Set(roleSet);
                                  if (next.has(r.id)) next.delete(r.id); else next.add(r.id);
                                  setRoleInputs(prev => ({ ...prev, [st.UNIlogin]: next }));
                                }} />
                              <span className="small">{r.label}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {screen === "elevraad" && (
        <div className="card grid" style={{ marginTop: 12 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h3 style={{ margin: 0 }}>Elevråd – markér kun de relevante</h3>
            <button onClick={() => { saveElevraadToMarks(); exportElevraadMarksCSV(); }} disabled={!ensureStudentsLoaded()}>Gem + eksportér elevraad_marks.csv</button>
          </div>
          {!ensureStudentsLoaded() ? (
            <div className="warn">Importér først <strong>students.csv</strong> i Setup.</div>
          ) : (
            <table>
              <thead><tr><th>Elev</th><th>UNIlogin</th><th>Elevrådsrepræsentant</th></tr></thead>
              <tbody>
                {sortedStudents.map(st => (
                  <tr key={st.UNIlogin}>
                    <td><strong>{st.firstName} {st.lastName}</strong></td>
                    <td className="small">{st.UNIlogin}</td>
                    <td>
                      <input type="checkbox" checked={!!elevraadInputs[st.UNIlogin]}
                        onChange={(e) => setElevraadInputs(prev => ({ ...prev, [st.UNIlogin]: e.target.checked }))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {screen === "editor" && (
        <div className="grid" style={{ marginTop: 12 }}>
          {!activeStudent || !activeStatement ? (
            <div className="card">Vælg en elev i Bibliotek.</div>
          ) : (
            <>
              <div className="card grid">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <h3 style={{ margin: 0 }}>Redigér: {activeStudent.firstName} {activeStudent.lastName}</h3>
                  <button onClick={onPrint}>Print (PDF)</button>
                </div>
                {overOnePage && <div className="warn">⚠️ Preview ser ud til at være over 1 side. Forkort især “Elevudvikling” og/eller “Sang+Gym”.</div>}
              </div>
              <div className="card">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <strong>Preview (A4)</strong>
                  <span className="small">{overOnePage ? "Over 1 side" : "1 side (ca.)"}</span>
                </div>
                <div style={{ marginTop: 10 }}>
                  <div ref={previewRef} style={{ height: "297mm", overflow: "hidden" }}>
                    <Preview model={docModel} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
