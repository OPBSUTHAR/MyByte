// MyByte — motion & interactions — creative developer showcase
const phrases = ["Frugal AI • Edge OCR — works offline","Krishi-Gati-AI → farms @ 2G","CrimeIntel-AI → safety with explainability","SpaceFlightMonitor → precision dashboards","Aviation NLP • SynchroGroundedNet","Python • JS/TS • C/C++ • 26 repos live — shipped 🚀"];
let pi=0, ci=0, del=false;
const typed = document.getElementById('typed');
function tick(){
  const w = phrases[pi];
  if(!del){ ci++; typed.textContent = w.slice(0,ci); if(ci===w.length){ del=true; setTimeout(tick,1600); return; } }
  else { ci--; typed.textContent = w.slice(0,ci); if(ci===0){ del=false; pi=(pi+1)%phrases.length; } }
  setTimeout(tick, del? 42: 96);
}
tick();

// theme — default dark
const toggle = document.getElementById('themeToggle');
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  toggle.textContent = t==='dark' ? '☀️' : '🌙';
}
const saved = localStorage.getItem('theme');
applyTheme(saved || 'dark');
toggle.addEventListener('click', ()=> applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'));

// nav
document.getElementById('menuBtn').addEventListener('click', ()=> document.getElementById('navLinks').classList.toggle('open'));
document.querySelectorAll('#navLinks a').forEach(a=> a.addEventListener('click', ()=> document.getElementById('navLinks').classList.remove('open')));

// reveal
const obs = new IntersectionObserver(es=> es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target);} }),{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=> obs.observe(el));
document.querySelectorAll('.card').forEach((el,i)=>{ el.classList.add('reveal'); el.style.setProperty('--d', `${(i%3)*80}ms`); obs.observe(el); });

// progress
const prog = document.getElementById('progress');
addEventListener('scroll', ()=>{
  const h = document.documentElement.scrollHeight - innerHeight;
  prog.style.width = (scrollY / (h||1) * 100) + '%';
}, {passive:true});

// parallax orbs
let ticking=false;
addEventListener('scroll', ()=>{
  if(ticking) return; ticking=true;
  requestAnimationFrame(()=>{
    const y = scrollY * 0.12;
    document.querySelectorAll('.orb').forEach((o,i)=> o.style.transform = `translateY(${y*(0.6+i*0.2)}px)`);
    ticking=false;
  });
}, {passive:true});

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
      ctx.fillStyle = p.r>1.2 ? 'rgba(6,182,214,.9)' : 'rgba(124,58,237,.7)';
      ctx.fill();
      for(let j=i+1;j<particles.length;j++){
        const q=particles[j];
        const dx=p.x-q.x, dy=p.y-q.y;
        const d=Math.hypot(dx,dy);
        if(d<140){
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
          ctx.strokeStyle = `rgba(6,182,214,${(1-d/140)*0.14})`;
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
addEventListener('scroll', ()=>{
  nav.style.boxShadow = scrollY>20 ? '0 8px 32px rgba(0,0,0,.2)' : 'none';
}, {passive:true});

// parallax tech orbit on mouse
const orbit = document.querySelector('.tech-orbit');
if(orbit){
  addEventListener('mousemove', e=>{
    const x=(e.clientX/innerWidth-.5)*6;
    const y=(e.clientY/innerHeight-.5)*6;
    orbit.style.transform=`translate(${x}px,${y}px)`;
  });
}

// contact
window.handleContact = (e)=>{
  e.preventDefault();
  const fd=new FormData(e.target);
  const name=fd.get('name'), email=fd.get('email'), msg=fd.get('message');
  const subject=encodeURIComponent(`MyByte — contact from ${name}`);
  const body=encodeURIComponent(`From: ${name} <${email}>\n\n${msg}\n\n— via MyByte`);
  location.href=`mailto:opbsuthar@github.com?subject=${subject}&body=${body}`;
  document.getElementById('formMsg').textContent='Opening mail client… fallback: opbsuthar@github.com';
  return false;
};
