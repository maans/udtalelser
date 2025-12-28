import { ALIASES } from "./aliases.js";

export function normalizeKey(s){
  return (s||"").toString().trim().toLowerCase();
}

export function expandAlias(input){
  const raw=(input||"").toString().trim();
  if(!raw) return "";
  const up=raw.toUpperCase().trim();
  if(ALIASES[up]) return ALIASES[up];
  return raw;
}

export function replacePronouns(text, gender){
  // gender: "M"|"F"|... from CSV
  const isF = (gender||"").toString().trim().toLowerCase().startsWith("k") || (gender||"").toString().trim().toLowerCase().startsWith("f");
  const han = isF ? "hun" : "han";
  const ham = isF ? "hende" : "ham";
  return text.replaceAll("{{HAN_HUN}}", han).replaceAll("{{HAM_HENDE}}", ham);
}

export function applyNameTokens(text, fornavn){
  return text.replaceAll("{{FORNAVN}}", fornavn||"");
}
