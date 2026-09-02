// GitHub projects loader — fetches live + falls back to data/projects.json
const USER='OPBSUTHAR';
const grid=document.getElementById('projectsGrid');
const statusEl=document.getElementById('projectsStatus');

const curated = [
  {name:'crimeintel-ai', lang:'Python', desc:'AI-powered crime pattern analysis', stars:0, url:`https://github.com/${USER}/crimeintel-ai`},
  {name:'ai-scanner', lang:'Python', desc:'AI-powered document scanner with edge detection, OCR & cloud sync', stars:0, url:`https://github.com/${USER}/ai-scanner`},
  {name:'AstraForge', lang:'TypeScript', desc:'Modern TypeScript playground / tooling', stars:0, url:`https://github.com/${USER}/AstraForge`},
  {name:'Krishi-Gati-AI', lang:'JavaScript', desc:'AI for agriculture — Krishi Gati', stars:0, url:`https://github.com/${USER}/Krishi-Gati-AI`},
  {name:'SpaceFlightMonitor', lang:'JavaScript', desc:'Monitor space flights & launches', stars:0, url:`https://github.com/${USER}/SpaceFlightMonitor`},
  {name:'Expense-Tracker', lang:'JavaScript', desc:'Track expenses with charts & local storage', stars:0, url:`https://github.com/${USER}/Expense-Tracker`},
  {name:'SynchroGroundedNet', lang:'TypeScript', desc:'Infrastructural safety system with space & power', stars:0, url:`https://github.com/${USER}/SynchroGroundedNet`},
  {name:'Econnect', lang:'HTML', desc:'E-connect platform (HTML/CSS/JS)', stars:0, url:`https://github.com/${USER}/Econnect`},
];

function cardHTML(p){
  return `<article class="card" data-lang="${p.lang||''}">
    <div class="card__top"><span>${p.lang||'—'}</span><span>★ ${p.stars??0}</span></div>
    <h3>${p.name}</h3>
    <p>${p.desc||'No description.'}</p>
    <div class="card__meta"><span>● ${p.lang||'code'}</span><span>↗ GitHub</span></div>
    <div class="card__actions"><a class="primary" href="${p.url}" target="_blank" rel="noopener">Code</a><a href="${p.url}" target="_blank" rel="noopener">Details</a></div>
  </article>`;
}

function render(list){
  grid.innerHTML = list.slice(0,9).map(cardHTML).join('');
}

async function load(){
  // try live API
  try{
    const r=await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`, {headers:{'Accept':'application/vnd.github.v3+json'}});
    if(r.ok){
      const data=await r.json();
      if(Array.isArray(data) && data.length){
        const mapped=data.filter(x=>!x.fork || x.name==='crimeintel-ai').map(x=>({
          name:x.name, lang:x.language||'Other', desc:x.description||'', stars:x.stargazers_count, url:x.html_url, updated:x.pushed_at
        })).sort((a,b)=> (b.stars-a.stars) || (new Date(b.updated)-new Date(a.updated)));
        render(mapped);
        statusEl.textContent=`Live from GitHub • ${mapped.length} repos • updated just now`;
        return;
      }
    }
    throw new Error('API failed');
  }catch(e){
    // fallback to curated or local json
    try{
      const r2=await fetch('data/projects.json');
      if(r2.ok){ const j=await r2.json(); if(j.length){ render(j); statusEl.textContent='From local cache (data/projects.json) — run tools/fetch_github.py to refresh'; return; } }
    }catch(_){}
    render(curated);
    statusEl.textContent='Showing curated picks (API rate-limited). See GitHub for full list.';
  }
}
load();
