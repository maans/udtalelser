export function setTooltip(el, text){
  el.setAttribute("title", text);
}

export function formatTime(iso){
  if(!iso) return "";
  try{
    const d=new Date(iso);
    return d.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
  }catch{ return ""; }
}

export function formatDateTime(iso){
  if(!iso) return "";
  try{
    const d=new Date(iso);
    return d.toLocaleString([], {year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit"});
  }catch{ return ""; }
}

export function debounce(fn, ms){
  let t=null;
  return (...args)=>{
    if(t) clearTimeout(t);
    t=setTimeout(()=>fn(...args), ms);
  };
}
