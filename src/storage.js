const NS = "HU_Udtalelse_vB1_4__";
const KEYS = {
  meta: NS+"meta",
  settings: NS+"settings",
  students: NS+"students",
  marks: NS+"marks",
  drafts: NS+"drafts",
  elevinput: NS+"elevinput_meta",
  overrides: NS+"template_overrides"
};

const DEFAULTS = {
  settings: {
    principalName: "Stinne Poulsen",
    meTeacher: "",
    schoolYear: "",
    periodFrom: "",
    dateMonthYear: "",
    lastSavedISO: ""
  },
  students: { headerMap:{}, byUni:{}, order:[], lastImportedISO:"" },
  marks: { sang:{}, gym:{}, elevraad:{}, lastImportedISO:"" },
  drafts: {},
  elevinput_meta: {},
  overrides: { isEnabled:false, overrides:{} },
  meta: { version:"B1.4" }
};

export function load(key){
  const k = KEYS[key];
  const raw = localStorage.getItem(k);
  if(!raw) return structuredClone(DEFAULTS[key]);
  try {
    return Object.assign(structuredClone(DEFAULTS[key]), JSON.parse(raw));
  } catch {
    return structuredClone(DEFAULTS[key]);
  }
}

export function save(key, value){
  const k=KEYS[key];
  localStorage.setItem(k, JSON.stringify(value));
}

export function update(key, fn){
  const cur = load(key);
  const next = fn(cur) || cur;
  save(key, next);
  return next;
}

export function hasStudents(){
  const s = load("students");
  return s && s.order && s.order.length>0;
}

export function wipeAll(){
  Object.values(KEYS).forEach(k=>localStorage.removeItem(k));
}

export function keys(){ return KEYS; }
