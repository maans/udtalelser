import { normalizeKey } from "./normalize.js";

export function parseCSV(text){
  // Simple CSV parser for comma/semicolon/tab separated
  const lines = (text||"").replace(/\r/g,"").split("\n").filter(l=>l.trim().length>0);
  if(lines.length===0) return {headers:[], rows:[]};
  const sep = detectSep(lines[0]);
  const headers = splitLine(lines[0], sep).map(h=>h.trim());
  const rows = [];
  for(let i=1;i<lines.length;i++){
    const parts = splitLine(lines[i], sep);
    const row = {};
    headers.forEach((h,idx)=>row[h]= (parts[idx]??"").trim());
    rows.push(row);
  }
  return {headers, rows};
}

function detectSep(line){
  // choose among ; , \t
  const cands = [",",";","\t"];
  let best=",", bestCount=-1;
  for(const s of cands){
    const cnt = splitLine(line, s).length;
    if(cnt>bestCount){ bestCount=cnt; best=s; }
  }
  return best;
}

function splitLine(line, sep){
  // handles basic quoted fields
  const out=[];
  let cur="", inQ=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'){
      if(inQ && line[i+1]==='"'){ cur+='"'; i++; }
      else inQ=!inQ;
    } else if(!inQ && ch===sep){
      out.push(cur); cur="";
    } else {
      cur+=ch;
    }
  }
  out.push(cur);
  return out;
}

export function toCSV(headers, rows){
  const esc = (v)=> {
    const s=(v??"").toString();
    if(/["\n\r,;]/.test(s)) return '"'+s.replaceAll('"','""')+'"';
    return s;
  };
  const sep=",";
  const lines=[headers.map(esc).join(sep)];
  for(const r of rows){
    lines.push(headers.map(h=>esc(r[h]??"")).join(sep));
  }
  return lines.join("\n");
}

export function makeDownload(filename, text){
  const blob = new Blob([text], {type:"text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}

export function headerIndex(headers){
  const map = {};
  headers.forEach(h=>map[normalizeKey(h)]=h);
  return map;
}
