// GitHub loader — showcase + live previews + interactive
const USER='OPBSUTHAR';
const grid=document.getElementById('projectsGrid');
const statusEl=document.getElementById('projectsStatus');
const track=document.getElementById('showcaseTrack');
const dots=document.getElementById('showcaseDots');

function ogUrl(name){ return `https://opengraph.githubassets.com/1/${USER}/${name}`; }
function liveUrl(name){ return `https://opbsuthar.github.io/${name}/`; }
function isLiveCandidate(lang, name){
  const webLangs=['HTML','CSS','JavaScript','TypeScript'];
  return webLangs.includes(lang) || ['Econnect','login-template','Tic-Tac-Toe-Game','MemoryCardGame','Expense-Tracker','To-Do-Master','recipe-book','countdown-timer','Basic-Calculator','SpaceFlightMonitor','Krishi-Gati-AI','cannibals-missionaries'].includes(name);
}

const curated = [
  {name:'ai-scanner', lang:'Python', desc:'AI-powered document scanner — edge, OCR, cloud', stars:0, url:`https://github.com/${USER}/ai-scanner`},
  {name:'crimeintel-ai', lang:'Python', desc:'CrimeIntel-AI — crime pattern & NLP analysis', stars:0, url:`https://github.com/${USER}/crimeintel-ai`},
  {name:'AstraForge', lang:'TypeScript', desc:'AstraForge — TypeScript tooling', stars:0, url:`https://github.com/${USER}/AstraForge`},
  {name:'Expense-Tracker', lang:'JavaScript', desc:'Expense tracker with charts & storage', stars:0, url:`https://github.com/${USER}/Expense-Tracker`},
  {name:'Econnect', lang:'HTML', desc:'E-connect web platform', stars:0, url:`https://github.com/${USER}/Econnect`},
  {name:'SpaceFlightMonitor', lang:'JavaScript', desc:'Space flight monitoring dashboard', stars:0, url:`https://github.com/${USER}/SpaceFlightMonitor`},
];

let allProjects=[];

function cardHTML(p){
  const thumb = ogUrl(p.name);
  const live = liveUrl(p.name);
  const liveBadge = isLiveCandidate(p.lang, p.name) ? `<span class="card__live">◉ Live</span>` : '';
  return `<article class="card tilt" data-lang="${p.lang||''}" data-name="${p.name.toLowerCase()}" data-desc="${(p.desc||'').toLowerCase()}" onclick="openProject('${p.name}')">
    <div class="card__thumb"><img src="${thumb}" alt="${p.name} preview" loading="lazy" onerror="this.src='https://avatars.githubusercontent.com/u/178475619?v=4'"></div>
    ${liveBadge}
    <div class="card__top"><span>${p.lang||'Other'}</span><span>★ ${p.stars??0}</span></div>
    <h3>${p.name}</h3>
    <p>${p.desc||'No description.'}</p>
    <div class="card__meta"><span>↗ ${live.replace('https://','')}</span></div>
    <div class="card__actions">
      <a class="primary" href="#" onclick="event.stopPropagation(); openProject('${p.name}')">Live Preview</a>
      <a href="${p.url}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Code</a>
    </div>
  </article>`;
}

function shotHTML(p){
  const thumb=ogUrl(p.name);
  return `<div class="shot tilt" onclick="openProject('${p.name}')">
    <div class="shot__thumb"><img src="${thumb}" alt="${p.name}" loading="lazy" onerror="this.src='https://avatars.githubusercontent.com/u/178475619?v=4'"></div>
    <div class="shot__body"><h3>${p.name}</h3><p>${p.desc||''}</p><div class="shot__meta"><span>${p.lang}</span><span>★ ${p.stars}</span><span>→ Live</span></div></div>
  </div>`;
}

function render(list){
  allProjects=list;
  grid.innerHTML = list.map(cardHTML).join('');
  // showcase featured: top 6 live candidates or top stars
  const featured = list.filter(p=> isLiveCandidate(p.lang,p.name)).slice(0,6);
  const fallbackFeatured = featured.length>=3 ? featured : list.slice(0,6);
  track.innerHTML = fallbackFeatured.map(shotHTML).join('');
  buildDots(fallbackFeatured.length);
  attachTilt();
  updateCarousel();
  // update counters
  const stars = list.reduce((s,p)=> s + (p.stars||0), 0);
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target = el.dataset.count==='23' ? Math.max(stars,23) : parseInt(el.dataset.count,10);
    animateCount(el, target);
  });
}

function animateCount(el, target){
  let cur=0; const step=Math.max(1, Math.round(target/24));
  const t=setInterval(()=>{ cur+=step; if(cur>=target){cur=target; clearInterval(t);} el.textContent=cur; }, 42);
}

// dot + carousel logic
let idx=0, auto=true, timer=null;
function buildDots(n){
  dots.innerHTML = Array.from({length:n}, (_,i)=> `<button class="${i===0?'active':''}" data-i="${i}" onclick="goTo(${i})"></button>`).join('');
}
window.goTo=(i)=>{ idx=i; updateCarousel(); restartAuto(); };
function updateCarousel(){
  const n = track.children.length; if(!n) return;
  if(idx<0) idx=n-1; if(idx>=n) idx=0;
  const shotW = track.children[0].offsetWidth + 16;
  track.style.transform = `translateX(${-idx*shotW}px)`;
  [...dots.children].forEach((b,i)=> b.classList.toggle('active', i===idx));
}
function restartAuto(){ if(auto){ clearInterval(timer); timer=setInterval(()=>{ idx++; updateCarousel(); }, 3400);} }
document.getElementById('prevBtn')?.addEventListener('click', ()=>{ idx--; updateCarousel(); restartAuto(); });
document.getElementById('nextBtn')?.addEventListener('click', ()=>{ idx++; updateCarousel(); restartAuto(); });
document.getElementById('autoBtn')?.addEventListener('click', (e)=>{
  auto=!auto;
  e.target.textContent = auto? '⏸ Auto' : '▶ Auto';
  if(auto) restartAuto(); else clearInterval(timer);
});
restartAuto();
addEventListener('resize', updateCarousel);

// tilt effect
function attachTilt(){
  document.querySelectorAll('.tilt').forEach(el=>{
    el.addEventListener('mousemove', (e)=>{
      const r=el.getBoundingClientRect();
      const x=(e.clientX - r.left)/r.width - .5;
      const y=(e.clientY - r.top)/r.height - .5;
      el.style.transform=`perspective(900px) rotateY(${x*4}deg) rotateX(${-y*4}deg) translateY(-2px)`;
    });
    el.addEventListener('mouseleave', ()=> el.style.transform='');
  });
}

// modal live preview
const modal=document.getElementById('projectModal');
const mTitle=document.getElementById('mTitle'), mDesc=document.getElementById('mDesc'), mUrl=document.getElementById('mUrl'), mFrame=document.getElementById('mFrame'), mFallback=document.getElementById('mFallback'), mImg=document.getElementById('mImg'), mOpen=document.getElementById('mOpen'), mGithub=document.getElementById('mGithub');
window.openProject=(name)=>{
  const p = allProjects.find(x=> x.name===name) || curated.find(x=> x.name===name);
  if(!p) return;
  mTitle.textContent=p.name; mDesc.textContent=p.desc||''; mUrl.textContent=liveUrl(p.name);
  mOpen.href=liveUrl(p.name); mGithub.href=p.url;
  mFrame.src=liveUrl(p.name);
  mImg.src=ogUrl(p.name);
  mFallback.classList.add('hidden');
  modal.showModal();
  // fallback if iframe fails to load (timeout)
  let loaded=false;
  mFrame.onload=()=>{ loaded=true; mFallback.classList.add('hidden'); };
  setTimeout(()=>{ if(!loaded){ // many GH pages not deployed, show fallback
    // try fetch quickly — if 404, show fallback
    fetch(liveUrl(p.name), {method:'HEAD', mode:'no-cors'}).catch(()=>{});
    // keep iframe visible but also show fallback hint after 2.2s if still not loaded visually
    // heuristic: if iframe remains blank, show fallback button — we keep both
  }}, 1800);
};
document.getElementById('mClose')?.addEventListener('click', ()=> modal.close());
modal?.addEventListener('click', (e)=>{ if(e.target===modal) modal.close(); });
document.querySelectorAll('.modal__tabs button').forEach(b=> b.addEventListener('click', ()=>{
  document.querySelectorAll('.modal__tabs button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  document.querySelectorAll('.modal__pane').forEach(p=> p.classList.remove('active'));
  document.getElementById(b.dataset.tab==='live'?'mLive':'mCode').classList.add('active');
}));
mFrame?.addEventListener('error', ()=> mFallback.classList.remove('hidden'));

// search + filter
const searchEl=document.getElementById('search');
function applyFilters(){
  const q=(searchEl?.value||'').toLowerCase().trim();
  const active=document.querySelector('.filter button.active')?.dataset.filter.toLowerCase()||'all';
  document.querySelectorAll('.card').forEach(c=>{
    const lang=(c.dataset.lang||'').toLowerCase();
    const text=(c.dataset.name+' '+c.dataset.desc+' '+lang);
    const okLang = active==='all' || lang===active;
    const okSearch = !q || text.includes(q);
    c.style.display = (okLang && okSearch) ? 'flex':'none';
  });
}
searchEl?.addEventListener('input', applyFilters);
document.querySelectorAll('.filter button').forEach(b=> b.addEventListener('click', ()=>{
  document.querySelectorAll('.filter button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); applyFilters();
}));

// load
async function load(){
  try{
    const r=await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`, {headers:{'Accept':'application/vnd.github.v3+json'}});
    if(r.ok){
      const data=await r.json();
      if(Array.isArray(data) && data.length){
        const mapped=data.map(x=>({name:x.name, lang:x.language||'Other', desc:x.description||'', stars:x.stargazers_count, url:x.html_url, updated:x.pushed_at}))
          .sort((a,b)=> (b.stars-a.stars) || (new Date(b.updated)-new Date(a.updated)));
        render(mapped);
        statusEl.textContent=`Live from GitHub • ${mapped.length} repos • click Live Preview → iframe`;
        return;
      }
    }
    throw new Error('API fail');
  }catch(e){
    try{
      const r2=await fetch('data/projects.json'); if(r2.ok){ const j=await r2.json(); if(j.length){ render(j); statusEl.textContent='From local cache — run tools/fetch_github.py to refresh. Interactive previews enabled.'; return; } }
    }catch(_){}
    render(curated); statusEl.textContent='Showing curated • interactive previews enabled';
  }
}
load();
