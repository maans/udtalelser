import { load } from "./storage.js";
import { expandAlias, applyNameTokens, replacePronouns } from "./normalize.js";
import { DEFAULT_TEMPLATE, DEFAULT_SNIPPETS } from "./templates.js";

export function getEffectiveTemplate(){
  const ov = load("overrides");
  if(ov?.isEnabled && ov.overrides?.TEMPLATE) return ov.overrides.TEMPLATE;
  return DEFAULT_TEMPLATE;
}
export function getEffectiveSnippets(){
  const ov = load("overrides");
  if(ov?.isEnabled && ov.overrides?.SNIPPETS) return ov.overrides.SNIPPETS;
  return DEFAULT_SNIPPETS;
}

function pickGenderSnippet(snippet, gender){
  const g=(gender||"").toString().trim().toLowerCase();
  const isF = g.startsWith("k") || g.startsWith("f");
  return isF ? (snippet.k || snippet.m || "") : (snippet.m || snippet.k || "");
}

export function composeUdtalelse(uni){
  const students=load("students").byUni;
  const s = students[uni];
  if(!s) return "";
  const settings=load("settings");
  const drafts=load("drafts")[uni] || {};
  const marks=load("marks");
  const snippets=getEffectiveSnippets();
  const tpl=getEffectiveTemplate();

  const fornavn=s.fornavn||"";
  const efternavn=s.efternavn||"";
  const fuld=(fornavn+" "+efternavn).trim();

  // contact teachers: from settings if provided, else from student csv
  let a = expandAlias(settings.kTeacherA||"").trim();
  let b = expandAlias(settings.kTeacherB||"").trim();

  const csvA = (s.kontakt1||"").trim();
  const csvB = (s.kontakt2||"").trim();

  // ensure two names: if only one provided, fill with the other from CSV
  if(a && !b){
    // choose other from csv that isn't a
    if(csvA && csvA!==a) b=csvA;
    else if(csvB && csvB!==a) b=csvB;
  } else if(!a && b){
    if(csvA && csvA!==b) a=csvA;
    else if(csvB && csvB!==b) a=csvB;
  } else if(!a && !b){
    a=csvA; b=csvB;
  }
  // fallback if still missing
  if(!a) a=csvA;
  if(!b) b=csvB;

  // Build SANG_GYM_AFSNIT with extra roles + gym + sang
  const blocks=[];
  const er = marks.elevraad?.[uni]?.isMember;
  if(er) blocks.push(applyNameTokens(snippets.roles.ELEVRAAD, fornavn));
  const gy = marks.gym?.[uni] || {};
  if(gy.fanebaerer) blocks.push(applyNameTokens(snippets.roles.FANEBAERER, fornavn));
  if(gy.redskab) blocks.push(applyNameTokens(snippets.roles.REDSKAB, fornavn));
  if(gy.dgi) blocks.push(applyNameTokens(snippets.roles.DGI, fornavn));

  if(gy.variant && snippets.gym[gy.variant]){
    const txt = pickGenderSnippet(snippets.gym[gy.variant], s.koen);
    blocks.push(applyNameTokens(txt, fornavn));
  }
  const sa = marks.sang?.[uni] || {};
  if(sa.variant && snippets.sang[sa.variant]){
    const txt = pickGenderSnippet(snippets.sang[sa.variant], s.koen);
    blocks.push(applyNameTokens(txt, fornavn));
  }
  const sangGym = blocks.filter(Boolean).join("\n\n");

  let out = tpl;
  const periodeFra = settings.periodFrom || "";
  const periodeTil = settings.dateMonthYear || "";

  out = out.replaceAll("{{ELEV_FULDE_NAVN}}", fuld)
           .replaceAll("{{ELEV_FORNAVN}}", fornavn)
           .replaceAll("{{ELEV_EFTERNAVN}}", efternavn)
           .replaceAll("{{ELEV_KLASSE}}", s.klasse||"")
           .replaceAll("{{PERIODE_FRA}}", periodeFra)
           .replaceAll("{{PERIODE_TIL}}", periodeTil)
           .replaceAll("{{ELEV_UDVIKLING_AFSNIT}}", drafts.elevudvikling||"")
           .replaceAll("{{PRAKTISK_AFSNIT}}", drafts.praktisk||"")
           .replaceAll("{{KONTAKTGRUPPE_BESKRIVELSE}}", drafts.kontaktgruppe||"")
           .replaceAll("{{SANG_GYM_AFSNIT}}", sangGym)
           .replaceAll("{{KONTAKTLÆRER_1_NAVN}}", a||"")
           .replaceAll("{{KONTAKTLÆRER_2_NAVN}}", b||"")
           .replaceAll("{{FORSTANDER_NAVN}}", expandAlias(settings.principalName||""));

  out = replacePronouns(out, s.koen);
  return out.trim();
}
