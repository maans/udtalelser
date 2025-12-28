import { load, save, update, hasStudents, wipeAll } from "./storage.js";
import { parseCSV, headerIndex, toCSV, makeDownload } from "./csv.js";
import { composeUdtalelse } from "./compose.js";
import { expandAlias, normalizeKey } from "./normalize.js";
import { DEFAULT_TEMPLATE, DEFAULT_SNIPPETS, LOCAL_SAVE_TEXT } from "./templates.js";
import { formatTime, formatDateTime, debounce, setTooltip } from "./ui.js";

let state = {
  view: "k", // k | edit | settings
  selectedUni: null
};

function el(id){ return document.getElementById(id); }

function init(){
  // landing
  state.view = hasStudents() ? "k" : "settings";
  renderNav();
  renderAll();
  attachHandlers();
}
window.addEventListener("DOMContentLoaded", init);

function attachHandlers(){
  el("nav-k").addEventListener("click", ()=>{ state.view="k"; renderAll(); });
  el("nav-edit").addEventListener("click", ()=>{ state.view="edit"; renderAll(); });
  el("nav-settings").addEventListener("click", ()=>{ state.view="settings"; renderAll(); });

  // Settings inputs
  ["principalName","kTeacherA","kTeacherB","periodFrom","dateMonthYear"].forEach(id=>{
    const input=el(id);
    input.addEventListener("change", ()=>{
      update("settings", s=>{
        s[id]=input.value;
        s.lastSavedISO=new Date().toISOString();
        return s;
      });
      // expand alias live for teacher fields
      if(id==="principalName" || id==="kTeacherA" || id==="kTeacherB"){
        input.value = expandAlias(input.value);
      }
      renderAll();
    });
  });

  // Import students
  el("studentsFile").addEventListener("change", async (e)=>{
    const f=e.target.files?.[0];
    if(!f) return;
    const text = await f.text();
    const {headers, rows}=parseCSV(text);
    const idx=headerIndex(headers);
    // expected headers (tolerant)
    const H = (name)=> idx[normalizeKey(name)] || idx[normalizeKey(name.replaceAll("-"," ").replaceAll("_"," "))];
    // Uni-login column name varies across exports
    const colUni = H("Uni-C brugernavn") || H("UNIlogin") || H("UNI login") || H("UNILogin") || H("Unilogin") || H("UniLogin") || H("Uni login");
    const colFornavn = H("Fornavn");
    const colEfternavn = H("Efternavn");
    const colKlasse = H("Klasse");
    const colKoen = H("Køn") || H("Koen");
    // Contact teacher columns also vary
    const colK1 = H("Relationer-Kontaktlærer-Navn") || H("Relationer Kontaktlærer Navn") || H("Kontaktlærer1") || H("Kontaktlærer 1") || H("Kontaktlærer") || H("Kontaktlaerer1") || H("Kontaktlaerer 1");
    const colK2 = H("Relationer-Anden kontaktlærer-Navn") || H("Relationer Anden kontaktlærer Navn") || H("Kontaktlærer2") || H("Kontaktlærer 2") || H("Kontaktlaerer2") || H("Kontaktlaerer 2") || H("Anden kontaktlærer") || H("Anden kontaktlaerer");

    if(!colUni){
      alert("Kunne ikke finde Uni-login kolonnen i elevlisten. Forvent f.eks. 'Uni-C brugernavn' eller 'Unilogin'.");
      return;
    }

    const byUni={};
    const order=[];
    for(const r of rows){
      const uni=(r[colUni]||"").trim();
      if(!uni) continue;
      byUni[uni]={
        klasse: (r[colKlasse]||"").trim(),
        fornavn: (r[colFornavn]||"").trim(),
        efternavn: (r[colEfternavn]||"").trim(),
        uni,
        koen: (r[colKoen]||"").trim(),
        kontakt1: (r[colK1]||"").trim(),
        kontakt2: (r[colK2]||"").trim()
      };
      order.push(uni);
    }

    // sort default by kontakt1, klasse, fornavn
    order.sort((a,b)=>{
      const A=byUni[a], B=byUni[b];
      const kA=(A.kontakt1||"").toLowerCase(), kB=(B.kontakt1||"").toLowerCase();
      if(kA!==kB) return kA.localeCompare(kB, "da");
      const cA=(A.klasse||"").toLowerCase(), cB=(B.klasse||"").toLowerCase();
      if(cA!==cB) return cA.localeCompare(cB, "da");
      return (A.fornavn||"").localeCompare(B.fornavn||"", "da");
    });

    const now=new Date().toISOString();
    save("students", { headerMap: idx, byUni, order, lastImportedISO: now });
    // keep selected if still exists
    if(state.selectedUni && !byUni[state.selectedUni]) state.selectedUni=null;
    if(!state.selectedUni && order.length) state.selectedUni=order[0];

    // auto compute kontaktgruppe count display
    renderAll();
  });

  // Import marks files
  ["sangFile","gymFile","elevraadFile"].forEach(id=>{
    el(id).addEventListener("change", async (e)=>{
      const f=e.target.files?.[0];
      if(!f) return;
      const text = await f.text();
      importMarksFromCSV(id, text);
      renderAll();
    });
  });

  // Export marks files (for faglærere)
  el("exportSang").addEventListener("click", ()=> exportSangCSV());
  el("exportGym").addEventListener("click", ()=> exportGymCSV());
  el("exportElevraad").addEventListener("click", ()=> exportElevraadCSV());

  // wipe all
  el("wipeAll").addEventListener("click", ()=>{
    if(confirm("Vil du rydde alle lokalt gemte tekster og valg i denne browser?\nDette kan ikke fortrydes.")){
      wipeAll();
      state.view="settings";
      state.selectedUni=null;
      renderAll();
    }
  });

  // Template edit lock
  el("tplEdit").addEventListener("click", ()=>{
    update("overrides", ov=>{
      ov.isEnabled = !ov.isEnabled;
      if(ov.isEnabled){
        if(!ov.overrides.TEMPLATE) ov.overrides.TEMPLATE = DEFAULT_TEMPLATE;
        if(!ov.overrides.SNIPPETS) ov.overrides.SNIPPETS = DEFAULT_SNIPPETS;
      }
      return ov;
    });
    renderAll();
  });
  el("tplReset").addEventListener("click", ()=>{
    if(confirm("Gendan standardtekster? Dine lokale ændringer overskrives.")){
      update("overrides", ov=>{
        ov.overrides.TEMPLATE = DEFAULT_TEMPLATE;
        ov.overrides.SNIPPETS = DEFAULT_SNIPPETS;
        return ov;
      });
      renderAll();
    }
  });

  el("templateText").addEventListener("input", debounce(()=>{
    const ov=load("overrides");
    if(!ov.isEnabled) return;
    update("overrides", o=>{
      o.overrides.TEMPLATE = el("templateText").value;
      return o;
    });
  }, 400));

  // Snippet editors
  el("snippetText").addEventListener("input", debounce(()=>{
    const ov=load("overrides");
    if(!ov.isEnabled) return;
    const path=el("snippetPath").value;
    try{
      const obj=load("overrides").overrides.SNIPPETS;
      setByPath(obj, path, el("snippetText").value);
      update("overrides", o=>{ o.overrides.SNIPPETS=obj; return o; });
    }catch{}
  }, 400));

  // Library selection
  el("studentList").addEventListener("click", (e)=>{
    const item=e.target.closest("[data-uni]");
    if(!item) return;
    state.selectedUni=item.dataset.uni;
    state.view="edit";
    renderAll();
  });

  el("prevStudent").addEventListener("click", ()=>{
    stepStudent(-1);
  });
  el("nextStudent").addEventListener("click", ()=>{
    stepStudent(1);
  });

  // Draft fields autosave
  ["draftElev","draftPraktisk","draftK"].forEach(id=>{
    el(id).addEventListener("input", debounce(()=>{
      const uni=state.selectedUni;
      if(!uni) return;
      update("drafts", d=>{
        const cur = d[uni] || {};
        if(id==="draftElev") cur.elevudvikling=el(id).value;
        if(id==="draftPraktisk") cur.praktisk=el(id).value;
        if(id==="draftK") cur.kontaktgruppe=el(id).value;
        cur.lastSavedISO=new Date().toISOString();
        d[uni]=cur;
        return d;
      });
      update("settings", s=>{ s.lastSavedISO=new Date().toISOString(); return s; });
      renderSavedTime();
      renderPreview();
      renderLibrary(); // progress update
    }, 600));
  });

  // Marks editors in settings (producer interface)
  el("marksMode").addEventListener("change", ()=> renderMarksEditor());
  el("marksTable").addEventListener("change", (e)=>{
    const uni=e.target.closest("tr")?.dataset?.uni;
    if(!uni) return;
    const t=e.target;
    const marks=load("marks");
    if(t.classList.contains("sangSel")){
      marks.sang[uni]={ variant: t.value || "" };
    }
    if(t.classList.contains("gymSel")){
      marks.gym[uni]=Object.assign(marks.gym[uni]||{}, { variant: t.value || "" });
    }
    if(t.classList.contains("ckFan")){
      marks.gym[uni]=Object.assign(marks.gym[uni]||{}, { fanebaerer: t.checked });
    }
    if(t.classList.contains("ckRed")){
      marks.gym[uni]=Object.assign(marks.gym[uni]||{}, { redskab: t.checked });
    }
    if(t.classList.contains("ckDgi")){
      marks.gym[uni]=Object.assign(marks.gym[uni]||{}, { dgi: t.checked });
    }
    if(t.classList.contains("ckER")){
      marks.elevraad[uni]={ isMember: t.checked };
    }
    marks.lastImportedISO=new Date().toISOString();
    save("marks", marks);
    renderAll();
  });

  // Elevinput meta
  el("elevinputFile").addEventListener("change", (e)=>{
    const f=e.target.files?.[0];
    if(!f || !state.selectedUni) return;
    update("elevinput_meta", m=>{
      m[state.selectedUni]={ fileName: f.name, lastUsedISO: new Date().toISOString() };
      return m;
    });
    renderAll();
  });

  // Print
  el("printBtn").addEventListener("click", ()=>{
    if(!state.selectedUni) return;
    window.print();
  });
}

function importMarksFromCSV(which, text){
  const {headers, rows}=parseCSV(text);
  const idx=headerIndex(headers);
  const uniCol = idx[normalizeKey("Uni-C brugernavn")] || headers.find(h=>normalizeKey(h).includes("uni"));
  if(!uniCol){ alert("Kunne ikke finde 'Uni-C brugernavn' i filen."); return; }
  const marks=load("marks");
  const now=new Date().toISOString();

  if(which==="sangFile"){
    const vCol = idx[normalizeKey("Sang_variant")] || idx[normalizeKey("sang variant")] || headers.find(h=>normalizeKey(h).includes("sang"));
    rows.forEach(r=>{
      const uni=(r[uniCol]||"").trim();
      if(!uni) return;
      marks.sang[uni]={ variant:(r[vCol]||"").trim() };
    });
  }
  if(which==="gymFile"){
    const vCol = idx[normalizeKey("Gym_variant")] || headers.find(h=>normalizeKey(h).includes("gym_variant")) || headers.find(h=>normalizeKey(h).includes("gym"));
    const fan = idx[normalizeKey("Fanebaerer")] || headers.find(h=>normalizeKey(h).includes("fan"));
    const red = idx[normalizeKey("Redskabshold")] || headers.find(h=>normalizeKey(h).includes("redsk"));
    const dgi = idx[normalizeKey("DGI_hjaelper")] || headers.find(h=>normalizeKey(h).includes("dgi"));
    rows.forEach(r=>{
      const uni=(r[uniCol]||"").trim();
      if(!uni) return;
      marks.gym[uni]={
        variant:(r[vCol]||"").trim(),
        fanebaerer: toBool(r[fan]),
        redskab: toBool(r[red]),
        dgi: toBool(r[dgi])
      };
    });
  }
  if(which==="elevraadFile"){
    const er = idx[normalizeKey("Elevraad")] || headers.find(h=>normalizeKey(h).includes("elevraad"));
    rows.forEach(r=>{
      const uni=(r[uniCol]||"").trim();
      if(!uni) return;
      marks.elevraad[uni]={ isMember: toBool(r[er]) };
    });
  }

  marks.lastImportedISO=now;
  save("marks", marks);
}

function toBool(v){
  const s=(v??"").toString().trim().toLowerCase();
  return s==="1" || s==="true" || s==="ja" || s==="x";
}

function exportSangCSV(){
  const students=load("students");
  if(!students.order.length){ alert("Indlæs elevlisten først."); return; }
  const marks=load("marks");
  const headers=["Uni-C brugernavn","Sang_variant"];
  const rows=students.order.map(uni=>({
    "Uni-C brugernavn": uni,
    "Sang_variant": marks.sang[uni]?.variant || ""
  }));
  makeDownload(filenameWithYear("HU_sang"), toCSV(headers, rows));
}
function exportGymCSV(){
  const students=load("students");
  if(!students.order.length){ alert("Indlæs elevlisten først."); return; }
  const marks=load("marks");
  const headers=["Uni-C brugernavn","Gym_variant","Fanebaerer","Redskabshold","DGI_hjaelper"];
  const rows=students.order.map(uni=>({
    "Uni-C brugernavn": uni,
    "Gym_variant": marks.gym[uni]?.variant || "",
    "Fanebaerer": marks.gym[uni]?.fanebaerer ? 1 : 0,
    "Redskabshold": marks.gym[uni]?.redskab ? 1 : 0,
    "DGI_hjaelper": marks.gym[uni]?.dgi ? 1 : 0
  }));
  makeDownload(filenameWithYear("HU_gym"), toCSV(headers, rows));
}
function exportElevraadCSV(){
  const students=load("students");
  if(!students.order.length){ alert("Indlæs elevlisten først."); return; }
  const marks=load("marks");
  const headers=["Uni-C brugernavn","Elevraad"];
  const rows=students.order.map(uni=>({
    "Uni-C brugernavn": uni,
    "Elevraad": marks.elevraad[uni]?.isMember ? 1 : 0
  }));
  makeDownload(filenameWithYear("HU_elevraad"), toCSV(headers, rows));
}

function filenameWithYear(prefix){
  const y = (load("settings").dateMonthYear || "").trim().replaceAll(" ","_");
  return y ? `${prefix}_${y}.csv` : `${prefix}.csv`;
}

function renderNav(){
  const navItems=[
    ["nav-k","Se dine elever (kontaktgruppe)"],
    ["nav-edit","Skriv og redigér elevens udtalelse"],
    ["nav-settings","Upload data, navne, dato og lokal lagring"]
  ];
  navItems.forEach(([id,tip])=>setTooltip(el(id), tip));
}

function renderAll(){
  // show correct view panels
  ["view-k","view-edit","view-settings"].forEach(v=>el(v).classList.add("hidden"));
  el("view-"+state.view).classList.remove("hidden");

  renderSettings();
  renderLibrary();
  renderEditor();
  renderPreview();
  renderMarksEditor();
  renderSavedTime();
  renderNavActive();
}

function renderNavActive(){
  ["nav-k","nav-edit","nav-settings"].forEach(id=>el(id).classList.remove("active"));
  const map={k:"nav-k", edit:"nav-edit", settings:"nav-settings"};
  el(map[state.view]).classList.add("active");
}

function renderSettings(){
  const s = load("settings");

  // defaults / derived period
  const year = String(s.schoolYear || "").trim();
  if(year && /^\d{4}$/.test(year)){
    const y = parseInt(year,10);
    s.periodFrom = `August ${y-1}`;
    s.dateMonthYear = `Juni ${y}`;
  }

  el("principalName").value = s.principalName || "Stinne Poulsen";
  el("principalName").disabled = !state.principalEditable;
  el("editPrincipal").classList.toggle("active", state.principalEditable);

  el("meTeacher").value = s.meTeacher || "";
  el("schoolYear").value = s.schoolYear || "";

  el("periodFrom").value = s.periodFrom || "";
  el("dateMonthYear").value = s.dateMonthYear || "";

  // auto contact group count if we know who "I am"
  const meFull = expandAlias((s.meTeacher||"").trim());
  let count = 0;
  if(state.students && meFull){
    const meKey = normalizeKey(meFull);
    count = state.students.filter(st => {
      const k1 = normalizeKey(st.kTeacher1 || "");
      const k2 = normalizeKey(st.kTeacher2 || "");
      return (k1 && k1 === meKey) || (k2 && k2 === meKey);
    }).length;
  }
  el("kontaktCount").value = String(count || 0);

  // listeners (bind once)
  if(!state._settingsBound){
    state._settingsBound = true;

    el("editPrincipal").addEventListener("click", () => {
      state.principalEditable = !state.principalEditable;
      renderSettings();
    });

    el("principalName").addEventListener("input", () => {
      const s2 = load("settings");
      s2.principalName = el("principalName").value;
      save("settings", s2);
    });

    const saveSimple = () => {
      const s2 = load("settings");
      s2.meTeacher = el("meTeacher").value;
      s2.schoolYear = el("schoolYear").value;
      // derive
      const ytxt = String(s2.schoolYear||"").trim();
      if(ytxt && /^\d{4}$/.test(ytxt)){
        const y = parseInt(ytxt,10);
        s2.periodFrom = `August ${y-1}`;
        s2.dateMonthYear = `Juni ${y}`;
      } else {
        s2.periodFrom = "";
        s2.dateMonthYear = "";
      }
      save("settings", s2);
      // update library filtering + count
      renderAll();
    };

    el("meTeacher").addEventListener("input", saveSimple);
    el("schoolYear").addEventListener("input", saveSimple);
  }
}

function computeKontaktCount(){
  const students=load("students");
  if(!students.order.length) return "—";
  const s=load("settings");
  const a=expandAlias(s.kTeacherA||"").trim();
  const b=expandAlias(s.kTeacherB||"").trim();
  const targets = new Set([a,b].filter(x=>x));
  let cnt=0;
  for(const uni of students.order){
    const st=students.byUni[uni];
    const set = new Set([ (st.kontakt1||"").trim(), (st.kontakt2||"").trim() ].filter(x=>x));
    let hit=false;
    for(const t of targets){
      if(set.has(t)){ hit=true; break; }
    }
    if(hit) cnt++;
  }
  return cnt.toString();
}

function renderLibrary(){
  const lib = el("view-library");
  lib.innerHTML = "";

  const s = load("settings");
  const meFull = expandAlias((s.meTeacher||"").trim());
  const meKey = meFull ? normalizeKey(meFull) : "";

  let list = state.students || [];
  if(meKey){
    list = list.filter(st => {
      const k1 = normalizeKey(st.kTeacher1 || "");
      const k2 = normalizeKey(st.kTeacher2 || "");
      return (k1 && k1 === meKey) || (k2 && k2 === meKey);
    });
  }

  // sort by efternavn + fornavn
  list = [...list].sort((a,b)=>{
    const an = `${a.lastName||""} ${a.firstName||""}`.toLowerCase();
    const bn = `${b.lastName||""} ${b.firstName||""}`.toLowerCase();
    return an.localeCompare(bn, "da");
  });

  if(!list.length){
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.innerText = meKey
      ? "Ingen K-elever fundet for din bruger. Tjek 'Jeg er' i Indstillinger – og at elevlisten har kontaktlærernavne."
      : "Indlæs først elevlisten i Indstillinger.";
    lib.appendChild(empty);
    return;
  }

  list.forEach(st => {
    const row = document.createElement("button");
    row.className = "student-row";
    row.type = "button";
    row.addEventListener("click", () => {
      state.currentStudentId = st.id;
      navigate("edit");
      renderAll();
    });

    const left = document.createElement("div");
    left.className = "student-left";

    const name = document.createElement("div");
    name.className = "student-name";
    name.innerText = `${st.firstName} ${st.lastName}`;

    const meta = document.createElement("div");
    meta.className = "student-meta";
    meta.innerText = st.className ? `${st.className}` : "";

    left.appendChild(name);
    left.appendChild(meta);

    const right = document.createElement("div");
    right.className = "student-right";

    const count = document.createElement("div");
    count.className = "pill";
    const done = countFilledForStudent(st.id);
    count.innerText = `${done}/3`;
    right.appendChild(count);

    row.appendChild(left);
    row.appendChild(right);

    lib.appendChild(row);
  });
}

function renderEditor(){
  const students=load("students");
  if(!students.order.length || !state.selectedUni){
    el("editEmpty").classList.remove("hidden");
    el("editWrap").classList.add("hidden");
    return;
  }
  el("editEmpty").classList.add("hidden");
  el("editWrap").classList.remove("hidden");

  const st=students.byUni[state.selectedUni];
  el("editTitle").textContent = `${st.fornavn||""} ${st.efternavn||""} (${st.klasse||""})`;
  el("fromCSVTeachers").textContent = `${shortName(st.kontakt1)} + ${shortName(st.kontakt2)}`;

  // drafts
  const d=load("drafts")[state.selectedUni] || {};
  el("draftElev").value = d.elevudvikling || "";
  el("draftPraktisk").value = d.praktisk || "";
  el("draftK").value = d.kontaktgruppe || "";

  // elevinput meta
  const meta=load("elevinput_meta")[state.selectedUni];
  el("elevinputMeta").textContent = meta ? `Senest brugt: ${meta.fileName} (${formatDateTime(meta.lastUsedISO)})` : "Ingen elevinput uploadet (valgfrit).";
  el("printBtn").disabled = !state.selectedUni;
  el("printBtn").classList.toggle("disabled", !state.selectedUni);
}

function shortName(full){
  if(!full) return "";
  const parts=full.trim().split(/\s+/);
  if(parts.length===1) return parts[0];
  const init = parts[0][0].toUpperCase()+parts[parts.length-1][0].toUpperCase();
  return init;
}

function renderPreview(){
  if(!state.selectedUni){
    el("previewText").textContent = "";
    return;
  }
  el("previewText").textContent = composeUdtalelse(state.selectedUni);
  // also mirror to print area
  el("printDoc").textContent = composeUdtalelse(state.selectedUni);
}

function renderSavedTime(){
  const uni=state.selectedUni;
  let iso="";
  if(uni){
    iso = load("drafts")[uni]?.lastSavedISO || "";
  }
  if(!iso){
    iso = load("settings").lastSavedISO || "";
  }
  const t = formatTime(iso);
  el("savedTime").textContent = t ? `Sidst gemt: ${t}` : "";
}

function stepStudent(dir){
  const students=load("students");
  if(!students.order.length || !state.selectedUni) return;
  const idx=students.order.indexOf(state.selectedUni);
  if(idx<0) return;
  const next = idx + dir;
  if(next<0 || next>=students.order.length) return;
  state.selectedUni = students.order[next];
  renderAll();
}

function renderMarksEditor(){
  const students=load("students");
  const wrap=el("marksEditorWrap");
  if(!students.order.length){
    wrap.classList.add("hidden");
    return;
  }
  wrap.classList.remove("hidden");
  const mode=el("marksMode").value; // sang | gym | elevraad
  const marks=load("marks");
  const sn=DEFAULT_SNIPPETS;

  let headersHtml="";
  if(mode==="sang"){
    headersHtml = "<tr><th>Elev</th><th>Sang</th></tr>";
  } else if(mode==="gym"){
    headersHtml = "<tr><th>Elev</th><th>Gym</th><th>Fanebærer</th><th>Redskab</th><th>DGI</th></tr>";
  } else {
    headersHtml = "<tr><th>Elev</th><th>Elevråd</th></tr>";
  }
  const tbody=[];
  for(const uni of students.order){
    const st=students.byUni[uni];
    const name = `${escapeHtml(st.fornavn||"")} ${escapeHtml(st.efternavn||"")}`;
    if(mode==="sang"){
      const v=marks.sang[uni]?.variant || "";
      tbody.push(`<tr data-uni="${uni}"><td>${name}</td><td>${sangSelect(v,sn.sang)}</td></tr>`);
    } else if(mode==="gym"){
      const g=marks.gym[uni]||{};
      tbody.push(`<tr data-uni="${uni}"><td>${name}</td><td>${gymSelect(g.variant||"", sn.gym)}</td>
        <td><input class="ckFan" type="checkbox" ${g.fanebaerer?"checked":""}></td>
        <td><input class="ckRed" type="checkbox" ${g.redskab?"checked":""}></td>
        <td><input class="ckDgi" type="checkbox" ${g.dgi?"checked":""}></td>
      </tr>`);
    } else {
      const er=marks.elevraad[uni]?.isMember || false;
      tbody.push(`<tr data-uni="${uni}"><td>${name}</td><td><input class="ckER" type="checkbox" ${er?"checked":""} title="Med i elevråd"></td></tr>`);
    }
  }
  el("marksTable").innerHTML = `<thead>${headersHtml}</thead><tbody>${tbody.join("")}</tbody>`;
}

function sangSelect(value, map){
  const opts = ["", ...Object.keys(map)];
  const html = opts.map(code=>{
    const title = code? `${code} – ${map[code].title}` : "—";
    return `<option value="${code}" ${code===value?"selected":""}>${escapeHtml(title)}</option>`;
  }).join("");
  return `<select class="sangSel">${html}</select>`;
}
function gymSelect(value, map){
  const opts = ["", ...Object.keys(map)];
  const html = opts.map(code=>{
    const title = code? `${code} – ${map[code].title}` : "—";
    return `<option value="${code}" ${code===value?"selected":""}>${escapeHtml(title)}</option>`;
  }).join("");
  return `<select class="gymSel">${html}</select>`;
}

function escapeHtml(s){
  return (s??"").toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

function buildSnippetPaths(sn){
  const paths=[];
  // roles
  Object.keys(sn.roles).forEach(k=>paths.push(`roles.${k}`));
  // sang/gym variant texts (male/female)
  Object.keys(sn.sang).forEach(code=>{
    paths.push(`sang.${code}.m`);
    paths.push(`sang.${code}.k`);
  });
  Object.keys(sn.gym).forEach(code=>{
    paths.push(`gym.${code}.m`);
    paths.push(`gym.${code}.k`);
  });
  return paths;
}
function getByPath(obj, path){
  return path.split(".").reduce((a,p)=>a?.[p], obj);
}
function setByPath(obj, path, value){
  const parts=path.split(".");
  let cur=obj;
  for(let i=0;i<parts.length-1;i++){
    cur=cur[parts[i]];
  }
  cur[parts[parts.length-1]]=value;
}
