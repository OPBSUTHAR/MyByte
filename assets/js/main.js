// MyByte — motion & interactions — creative developer showcase
const phrases = ["BharatVista Nexus — Pure C + SQLite • live @ data.gov.in","Agnirva NEAT 5.0 — AI for Indian Satellites • ISRO track","Frugal AI • Edge OCR — works offline","Krishi-Gati-AI → farms @ 2G","CrimeIntel-AI → safety with explainability","SpaceFlightMonitor → precision dashboards","C • Python • JS/TS • 42 repos live — shipped 🚀"];
let pi=0, ci=0, del=false;
const typed = document.getElementById('typed');
function tick(){
  if(!typed) return;
  const w = phrases[pi];
  if(!del){ ci++; typed.textContent = w.slice(0,ci); if(ci===w.length){ del=true; setTimeout(tick,1600); return; } }
  else { ci--; typed.textContent = w.slice(0,ci); if(ci===0){ del=false; pi=(pi+1)%phrases.length; } }
  setTimeout(tick, del? 42: 96);
}
if(typed) tick();

// Seamless marquee — duplicate for continuous loop, future-proof
(() => {
  function makeSeamless(id){
    const el=document.getElementById(id);
    if(!el || el.dataset.seamless==="1") return;
    const html=el.innerHTML;
    // duplicate exactly once for -50% seamless (no gap)
    el.innerHTML = html + html;
    el.dataset.seamless="1";
  }
  // defer to idle for perf
  const run=()=>{ makeSeamless('marqueeTrack'); makeSeamless('stripTrack'); };
  if('requestIdleCallback' in window) requestIdleCallback(run); else setTimeout(run, 200);
})();
// Optimized: defer heavy work to idle, passive listeners
if('requestIdleCallback' in window){
  requestIdleCallback(()=>{ document.documentElement.classList.add('js-ready'); });
}
// theme — default dark (techie = dark best)
const toggle = document.getElementById('themeToggle');
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  if(toggle) toggle.textContent = t==='dark' ? '☀️' : '🌙';
}
const saved = localStorage.getItem('theme');
applyTheme(saved || 'dark');
toggle?.addEventListener('click', ()=> applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'));

// nav
document.getElementById('menuBtn')?.addEventListener('click', ()=> document.getElementById('navLinks').classList.toggle('open'));
document.querySelectorAll('#navLinks a').forEach(a=> a.addEventListener('click', ()=> document.getElementById('navLinks').classList.remove('open')));

// reveal
const obs = new IntersectionObserver(es=> es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target);} }),{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=> obs.observe(el));
if(!window.gsap){
  // legacy stagger for GitHub-injected cards — GSAP handles these when present
  document.querySelectorAll('.card').forEach((el,i)=>{ el.classList.add('reveal'); el.style.setProperty('--d', `${(i%3)*80}ms`); obs.observe(el); });
}

// progress
const prog = document.getElementById('progress');
if(prog){
  addEventListener('scroll', ()=>{
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (scrollY / (h||1) * 100) + '%';
  }, {passive:true});
}

// parallax orbs — GSAP ScrollTrigger takes over when available (see bottom)
let ticking=false;
if(!window.gsap){
  addEventListener('scroll', ()=>{
    if(ticking) return; ticking=true;
    requestAnimationFrame(()=>{
      const y = scrollY * 0.12;
      document.querySelectorAll('.orb').forEach((o,i)=> o.style.transform = `translateY(${y*(0.6+i*0.2)}px)`);
      ticking=false;
    });
  }, {passive:true});
}

// magnetic buttons
document.querySelectorAll('.magnetic').forEach(btn=>{
  btn.addEventListener('mousemove', e=>{
    const r=btn.getBoundingClientRect();
    const x=(e.clientX - (r.left+r.width/2))*0.22;
    const y=(e.clientY - (r.top+r.height/2))*0.28;
    btn.style.transform=`translate(${x}px,${y}px)`;
  });
  btn.addEventListener('mouseleave', ()=> btn.style.transform='');
});

// play demo — scroll to showcase and trigger animation
document.getElementById('playBtn')?.addEventListener('click', ()=>{
  document.getElementById('showcase')?.scrollIntoView({behavior:'smooth'});
  // flash showcase
  const s=document.getElementById('showcaseTrack');
  s.animate([{transform:'scale(0.98)'},{transform:'scale(1)'}], {duration:420, easing:'ease-out'});
  // try auto-open first project
  setTimeout(()=>{ const first=document.querySelector('.shot'); if(first) first.click(); }, 600);
});

// === CANVAS PARTICLE NETWORK — innovation field ===
(() => {
  const c = document.getElementById('techCanvas');
  if(!c) return;
  const ctx = c.getContext('2d');
  let w, h, particles;
  const prefersReduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduce) { c.style.display='none'; return; }
  function resize(){ w=c.width=innerWidth; h=c.height=innerHeight; init() }
  function init(){
    const count = Math.min(64, Math.round(w*h/22000));
    particles = Array.from({length: count}, () => ({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-.5)*0.6, vy: (Math.random()-.5)*0.6,
      r: Math.random()*1.4+0.6
    }));
  }
  function step(){
    ctx.clearRect(0,0,w,h);
    // faint connecting lines
    particles.forEach((p,i)=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;
      // draw
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = p.r>1.2 ? 'rgba(0,255,157,.9)' : 'rgba(6,182,214,.75)';
      ctx.fill();
      for(let j=i+1;j<particles.length;j++){
        const q=particles[j];
        const dx=p.x-q.x, dy=p.y-q.y;
        const d=Math.hypot(dx,dy);
        if(d<140){
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
          ctx.strokeStyle = `rgba(0,255,157,${(1-d/140)*0.16})`;
          ctx.lineWidth=1; ctx.stroke();
        }
      }
    });
    requestAnimationFrame(step);
  }
  addEventListener('resize', resize);
  resize(); step();
})();

// === CODE CARD MOUSE GLOW + TYPING INDICATOR ===
(() => {
  const card = document.getElementById('codeCard');
  if(!card) return;
  card.addEventListener('mousemove', e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
    card.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
  });
  // blinking compile status
  const s = document.getElementById('codeStatus');
  const t = document.getElementById('codeTitle');
  if(s && t){
    setInterval(()=>{
      const states = ['● Python • edge • shipped ✓','● compiling…','● Python • edge • live ●'];
      s.textContent = states[Math.floor(Date.now()/1200)%states.length];
    }, 1200);
  }
})();

// === SPOTLIGHT FOR ALL CARDS ===
document.querySelectorAll('.card,.domain,.case,.skill,.goal').forEach(el=>{
  el.addEventListener('mousemove', e=>{
    const r=el.getBoundingClientRect();
    el.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
    el.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
  });
});

// === SKILL / GOAL BARS ANIMATE ON REVEAL ===
const barObserver = new IntersectionObserver(entries=>{
  entries.forEach(ent=>{
    if(ent.isIntersecting){ ent.target.classList.add('in'); barObserver.unobserve(ent.target); }
  });
},{threshold:.3});
document.querySelectorAll('.skill,.goal').forEach(el=> barObserver.observe(el));

// === ENHANCED REVEAL FOR NEW ELEMENTS ===
const nav = document.querySelector('.nav');
if(nav){
  addEventListener('scroll', ()=>{
    nav.style.boxShadow = scrollY>20 ? '0 8px 32px rgba(0,0,0,.2)' : 'none';
  }, {passive:true});
}

// parallax tech orbit on mouse
const orbit = document.querySelector('.tech-orbit');
if(orbit){
  addEventListener('mousemove', e=>{
    const x=(e.clientX/innerWidth-.5)*6;
    const y=(e.clientY/innerHeight-.5)*6;
    orbit.style.transform=`translate(${x}px,${y}px)`;
  });
}

// resume modal — PDF copy interactive popup
window.openResumeModal = ()=> document.getElementById('resumeModal')?.showModal();
document.getElementById('rClose')?.addEventListener('click', ()=> document.getElementById('resumeModal')?.close());
document.getElementById('resumeModal')?.addEventListener('click', e=>{ if(e.target.id==='resumeModal') e.target.close(); });

// contact
window.handleContact = (e)=>{
  e.preventDefault();
  const fd=new FormData(e.target);
  const name=fd.get('name'), email=fd.get('email'), msg=fd.get('message');
  const subject=encodeURIComponent(`MyByte — contact from ${name}`);
  const body=encodeURIComponent(`From: ${name} <${email}>\n\n${msg}\n\n— via MyByte`);
  location.href=`mailto:omprakashsuthar.os974660@gmail.com?subject=${subject}&body=${body}`;
  document.getElementById('formMsg').textContent='Opening mail client… fallback: omprakashsuthar.os974660@gmail.com';
  return false;
};

// === OVERVIEW — 5 HIGHLIGHTS, CONTINUOUS LOOP ===
(() => {
  const track=document.getElementById("comicTrack");
  if(!track) return;
  // make visible — overview cards use reveal but must be shown even before observer
  track.querySelectorAll(".overview-card").forEach(el=> el.classList.add("in"));
  if(track.dataset.loop==="1") return;
  // duplicate for seamless -50% loop (future items auto-duplicate)
  if(!track.dataset.loop){
    track.innerHTML += track.innerHTML;
    // ensure duplicated cards also visible
    track.querySelectorAll(".overview-card").forEach(el=> el.classList.add("in"));
    track.dataset.loop="1";
  }
  const dots=[...document.querySelectorAll("#comicDots button")];
  const prev=document.getElementById("comicPrev"), next=document.getElementById("comicNext"), playBtn=document.getElementById("comicPlay");
  // dots/prev/next now control animation-play-state, not stepwise
  let paused=false;
  function setPaused(v){
    paused=v;
    track.style.animationPlayState = v ? "paused" : "running";
    if(playBtn) playBtn.textContent = v ? "▶ Play" : "⏸ Pause";
  }
  // hover pauses (CSS also does), buttons pause
  track.addEventListener("mouseenter", ()=> setPaused(true));
  track.addEventListener("mouseleave", ()=> setPaused(false));
  prev?.addEventListener("click", ()=> setPaused(!paused));
  next?.addEventListener("click", ()=> setPaused(!paused));
  playBtn?.addEventListener("click", ()=> setPaused(!paused));
  dots.forEach((d,i)=> d.addEventListener("click", ()=>{
    // on dot click, briefly pause then resume
    setPaused(true); setTimeout(()=> setPaused(false), 1200);
  }));
})();

// === INFINITY — free style, subtle hover ===
(() => {
  const wrap=document.querySelector(".free-infinity");
  const dots=[...document.querySelectorAll(".free-dots circle")];
  const cards=[...document.querySelectorAll(".domain--infinity")];
  if(!wrap || !dots.length) return;
  dots.forEach((n,i)=>{
    n.style.cursor="pointer";
    n.addEventListener("mouseenter", ()=>{
      dots.forEach(x=> x.style.fill="");
      n.style.fill="var(--primary)";
      cards.forEach(c=> c.style.outline="");
      if(cards[i]){ cards[i].style.outline="1px solid var(--primary)"; }
    });
    n.addEventListener("mouseleave", ()=>{ n.style.fill=""; cards.forEach(c=> c.style.outline=""); });
    n.addEventListener("click", ()=>{ if(cards[i]) cards[i].scrollIntoView({behavior:"smooth", block:"center"}); });
  });
})();

// ============================================================
// === GSAP — scroll animations (core + ScrollTrigger) =========
// Progressive enhancement: if GSAP is missing, nothing runs and
// the legacy IntersectionObserver + CSS reveal keeps working.
// ============================================================
(() => {
  if(!window.gsap || !window.ScrollTrigger) return;
  const {gsap, ScrollTrigger} = window;
  gsap.registerPlugin(ScrollTrigger);

  // hand opacity/transform control to GSAP (disables legacy .reveal transition)
  document.documentElement.classList.add('gsap-ready');

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(reduce){ gsap.set('.hero__copy > *', {clearProps:'all'}); ScrollTrigger.refresh(); return; }

  const EASE = 'power3.out';

  // After an entrance finishes, release GSAP's inline transform/opacity and
  // drop the legacy `.reveal` class so CSS :hover lifts behave normally again.
  function clean(targets){
    const nodes = gsap.utils.toArray(targets);
    gsap.set(nodes, {clearProps:'transform,opacity,visibility,filter'});
    nodes.forEach(n => n.classList.remove('reveal'));
  }

  // --- shared batch reveal (staggered, fires once) ---
  function batch(nodes, from, to){
    nodes = nodes.filter(Boolean);
    if(!nodes.length) return;
    ScrollTrigger.batch(nodes, {
      interval: 0.12,
      batchMax: 4,
      start: 'top 88%',
      once: true,
      onEnter: b => gsap.from(b, Object.assign({
        duration:0.65, ease:EASE, stagger:0.08, overwrite:true,
        onComplete: () => clean(b)
      }, from, to))
    });
  }

  // --- 1. HERO intro timeline (badge → title → lead → code card) ---
  const copy = document.querySelector('.hero__copy');
  const heroKids = copy ? Array.from(copy.children) : [];
  const visual = document.querySelector('.hero__visual');
  const floats = gsap.utils.toArray('.profile-float, .mini-float');
  if(heroKids.length || visual){
    gsap.set(heroKids.concat(visual ? [visual] : []), {autoAlpha:1});
    const tl = gsap.timeline({defaults:{ease:EASE}});
    if(heroKids.length) tl.from(heroKids, {y:30, autoAlpha:0, duration:0.7, stagger:0.09});
    if(visual) tl.from(visual, {y:40, autoAlpha:0, duration:0.85}, '-=0.55');
    if(floats.length) tl.from(floats, {y:18, autoAlpha:0, duration:0.6, stagger:0.08}, '-=0.4');
    tl.eventCallback('onComplete', () => {
      clean(heroKids.concat(visual ? [visual] : [], floats));
    });
  }

  // --- 2. Section heads / eyebrows (slide from the left) ---
  ScrollTrigger.batch(gsap.utils.toArray('.section__eyebrow, .section__head'), {
    interval: 0.12, batchMax: 4, start: 'top 88%', once: true,
    onEnter: b => gsap.from(b, {x:-28, autoAlpha:0, duration:0.7, ease:EASE, stagger:0.08,
      overwrite:true, onComplete: () => clean(b)})
  });

  // --- 3. Generic reveal elements (exclude those handled by dedicated batches) ---
  const genericReveals = gsap.utils.toArray('.reveal').filter(el =>
    !el.matches('.domain, .goal, .skill, .overview-card, .card, .b-card, .case'));
  batch(genericReveals, {y:24});

  // --- 4. ∞ domain cards — staggered rise ---
  batch(gsap.utils.toArray('.domain'), {y:34, duration:0.7});

  // --- 5. Case studies / static bento cards ---
  batch(gsap.utils.toArray('.case, .b-card'), {y:30, scale:0.98, duration:0.7});

  // --- 6. Timeline entries slide in from the left ---
  gsap.utils.toArray('.tl').forEach(el => {
    gsap.from(el, {x:-28, autoAlpha:0, duration:0.7, ease:EASE,
      onComplete: () => clean(el),
      scrollTrigger:{trigger:el, start:'top 86%', once:true}});
  });

  // --- 7. Goals + skills — card rise, and the progress bars fill ---
  gsap.utils.toArray('.goal, .skill').forEach(el => {
    gsap.from(el, {y:30, autoAlpha:0, duration:0.7, ease:EASE,
      onComplete: () => clean(el),
      scrollTrigger:{trigger:el, start:'top 86%', once:true}});
    const bar = el.querySelector('.bar i');
    if(bar){
      gsap.fromTo(bar, {scaleX:0}, {scaleX:1, duration:1.2, ease:'power3.out',
        scrollTrigger:{trigger:el, start:'top 82%', once:true}});
    }
  });

  // --- 8. Dynamic project cards (injected after GitHub fetch) ---
  function animateCards(root=document){
    const nodes = gsap.utils.toArray('.card:not(.fx-done), .shot:not(.fx-done)', root);
    nodes.forEach(el => {
      el.classList.add('fx-done');
      gsap.from(el, {y:28, autoAlpha:0, duration:0.6, ease:EASE,
        onComplete: () => clean(el),
        scrollTrigger:{trigger:el, start:'top 90%', once:true}});
    });
    if(nodes.length) ScrollTrigger.refresh();
  }
  animateCards();
  addEventListener('mybyte:rendered', () => animateCards());

  // --- 9. Subtle parallax depth on floating hero orbs layer ---
  gsap.utils.toArray('.orb').forEach((orb, i) => {
    gsap.to(orb, {yPercent: 12 + i*7, ease:'none',
      scrollTrigger:{trigger:'body', start:'top top', end:'bottom bottom', scrub:true}});
  });

  // re-measure after images/fonts settle
  addEventListener('load', () => ScrollTrigger.refresh());
})();



