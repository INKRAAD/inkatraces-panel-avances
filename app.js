const DONE=["Título de portada listo para buscadores|La portada tiene un título pensado para buscadores.","Plataforma web moderna y estable|Base actual, adecuada para mejorar visibilidad.","Catálogo de experiencias|Itinerarios organizados como catálogo propio.","Home con propuesta, FAQ, contacto y RUC|Mensaje claro, WhatsApp, email y RUC visibles.","Indicaciones correctas para buscadores|El sitio ya indica dónde está el mapa de páginas.","Estructura rica en fichas tour|Itinerario, comidas, transporte, destacados y FAQ.","Títulos distintos por sección clave|Cada sección puede posicionarse con su enfoque.","Portada definida y sitio en español|Alineado al público objetivo."];
const CONF=["Vista previa al compartir|Captura del código o acceso de solo lectura.","Datos estructurados|Confirmar organización, FAQ y experiencias.","Indexación en Google|Acceso a Search Console.","Ajustes internos de SEO|Títulos, mapa y schema.","Velocidad móvil|PageSpeed cuando la caché esté activa."];
const ITEMS=[{id:"sitemap-500",title:"Reparar el mapa del sitio",body:"Regenerar, quitar conflictos y reenviar en Search Console.",prio:"Crítico",area:"Desarrollo",p:["seo","measure"]},{id:"llms-txt",title:"Publicar guía del sitio para IA",body:"Archivo público con marca, propuesta y páginas clave.",prio:"Crítico",area:"Ambos",p:["geo"]},{id:"security-headers",title:"Reforzar la seguridad visible",body:"Protecciones del servidor sin exponer detalles técnicos.",prio:"Crítico",area:"Desarrollo",p:["measure"]},{id:"tagline",title:"Frase corta y descripciones",body:"Tagline y meta descriptions en resultados de búsqueda.",prio:"Importante",area:"Publicidad",p:["seo"]},{id:"favicon",title:"Icono de marca en el navegador",body:"Reparar favicon y recursos asociados.",prio:"Importante",area:"Desarrollo",p:["seo"]},{id:"cache-hcdn",title:"Activar aceleración del sitio",body:"Mejora la velocidad percibida.",prio:"Importante",area:"Desarrollo",p:["measure"]},{id:"tour-content",title:"Corregir fichas tour",body:"Unificar incluido / no incluido y numeración de días.",prio:"Importante",area:"Ambos",p:["geo","seo"]},{id:"elementor-junk",title:"Limpiar páginas temporales",body:"Ocultar o eliminar y sacarlas del mapa.",prio:"Importante",area:"Desarrollo",p:["seo"]},{id:"schema-og",title:"Ficha enriquecida y vista al compartir",body:"Título, descripción e imagen coherentes.",prio:"Importante",area:"Ambos",p:["geo","measure"]},{id:"naming",title:"Unificar el nombre InkaTraces",body:"Una sola palabra en títulos públicos.",prio:"Nice-to-have",area:"Publicidad",p:["seo"]},{id:"timezone",title:"Zona horaria del Perú",body:"Alinear el panel con hora de Lima.",prio:"Nice-to-have",area:"Desarrollo",p:["measure"]},{id:"fonts",title:"Optimizar tipografías",body:"Velocidad y privacidad en la carga de fuentes.",prio:"Nice-to-have",area:"Desarrollo",p:["measure","seo"]},{id:"convention-files",title:"Archivos de contacto y créditos",body:"Convenciones opcionales de seguridad y créditos.",prio:"Nice-to-have",area:"Desarrollo",p:["seo"]}];
const KEY="inkatraces-panel-avances-v2";
function load(){try{const r=JSON.parse(localStorage.getItem(KEY)||"{}");return {checks:r.checks||{},history:r.history||[]};}catch(e){return {checks:{},history:[]}}}
function save(s){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
let state=load(), filter="all";
document.getElementById("done-list").innerHTML=DONE.map(x=>{const [t,b]=x.split("|");return `<article class=\"item ok\"><div class=\"head\"><h3 class=\"t\">${t}</h3><span class=\"tag okt\">Hecho</span></div><p>${b}</p></article>`}).join("");
document.getElementById("confirm-list").innerHTML=CONF.map(x=>{const [t,b]=x.split("|");return `<article class=\"item\"><div class=\"head\"><h3 class=\"t\">${t}</h3><span class=\"tag wait\">Pendiente de acceso</span></div><p>${b}</p></article>`}).join("");
function render(){
  const list=document.getElementById("improve-list");
  const groups=["Crítico","Importante","Nice-to-have"];
  list.innerHTML=groups.map(g=>{
    const rows=ITEMS.filter(i=>i.prio===g && (filter==="all"||i.p.includes(filter)));
    if(!rows.length) return "";
    return `<h3 style=\"font-family:var(--display);color:var(--gold)\">${g}</h3>`+rows.map(i=>{
      const on=!!state.checks[i.id];
      return `<article class=\"item ${on?\"done\":\"\"}\"><label class=\"check\"><input type=\"checkbox\" data-id=\"${i.id}\" ${on?\"checked\":\"\"}/><span><div class=\"head\"><h3 class=\"t\">${i.title}</h3><span><span class=\"tag wait\">${i.prio}</span> <span class=\"tag\">${i.area}</span></span></div><p>${i.body}</p></span></label></article>`;
    }).join("");
  }).join("");
  list.querySelectorAll("input").forEach(inp=>inp.addEventListener("change",()=>{
    const id=inp.dataset.id, on=inp.checked;
    state.checks[id]=on;
    state.history=state.history.filter(h=>h.id!==id);
    if(on) state.history.push({id,label:ITEMS.find(x=>x.id===id).title,at:new Date().toISOString()});
    save(state); render();
  }));
  const done=ITEMS.filter(i=>state.checks[i.id]).length;
  document.getElementById("progress-num").textContent=done;
  document.getElementById("progress-fill").style.width=Math.round(done/13*100)+"%";
  ["seo","geo","measure"].forEach(p=>{
    const rel=ITEMS.filter(i=>i.p.includes(p));
    const n=rel.filter(i=>state.checks[i.id]).length;
    document.getElementById("c-"+p).textContent=n+"/"+rel.length+" mejoras de este pilar";
  });
  const hist=document.getElementById("history-list");
  const empty=document.getElementById("history-empty");
  const items=[...state.history].sort((a,b)=>String(b.at).localeCompare(String(a.at)));
  empty.hidden=items.length>0;
  hist.innerHTML=items.map(e=>{
    let when=e.at;
    try{when=new Intl.DateTimeFormat("es-PE",{timeZone:"America/Lima",dateStyle:"medium",timeStyle:"short"}).format(new Date(e.at))+" (Lima)"}catch(err){}
    return `<li><time>${when}</time><span>${e.label}</span></li>`;
  }).join("");
}
render();
document.querySelectorAll("[data-filter]").forEach(btn=>btn.addEventListener("click",()=>{
  filter=btn.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("gold",b===btn));
  render();
}));
document.getElementById("btn-reset").onclick=()=>{
  if(!confirm("¿Restablecer el progreso de las 13 mejoras?")) return;
  state={checks:{},history:[]}; save(state); render();
};
const themeBtn=document.getElementById("btn-theme");
function paintTheme(){themeBtn.textContent=document.documentElement.getAttribute("data-theme")==="dark"?"Tema claro":"Tema oscuro"}
paintTheme();
themeBtn.onclick=()=>{
  const next=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";
  document.documentElement.setAttribute("data-theme",next);
  try{localStorage.setItem("inkatraces-panel-theme",next)}catch(e){}
  paintTheme();
};
