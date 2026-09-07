// MyByte — motion & interactions — creative developer showcase
const phrases = ["BharatVista Nexus — Pure C + SQLite • live @ data.gov.in","Agnirva NEAT 5.0 — AI for Indian Satellites • ISRO track","Frugal AI • Edge OCR — works offline","Krishi-Gati-AI → farms @ 2G","CrimeIntel-AI → safety with explainability","SpaceFlightMonitor → precision dashboards","C • Python • JS/TS • 29 repos live — shipped 🚀"];
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
document.querySelectorAll('.card').forEach((el,i)=>{ el.classList.add('reveal'); el.style.setProperty('--d', `${(i%3)*80}ms`); obs.observe(el); });

// progress
const prog = document.getElementById('progress');
if(prog){
  addEventListener('scroll', ()=>{
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (scrollY / (h||1) * 100) + '%';
  }, {passive:true});
}

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

// === COMIC STORYBOARD — dynamic, interactive, auto-play on visit ===
(() => {
  const track=document.getElementById("comicTrack");
  const dots=[...document.querySelectorAll("#comicDots button")];
  const prev=document.getElementById("comicPrev"), next=document.getElementById("comicNext"), playBtn=document.getElementById("comicPlay");
  if(!track || !dots.length) return;
  const frames=[...track.querySelectorAll(".overview-card")];
  let idx=0, auto=true, timer=null, pausedHover=false;
  function update(){
    frames.forEach((f,i)=> f.classList.toggle("active", i===idx));
    dots.forEach((d,i)=> d.classList.toggle("active", i===idx));
    const w=frames[0].offsetWidth + 14;
    track.scrollTo({left: idx*w, behavior: "smooth"});
  }
  function go(n){ idx=(n+frames.length)%frames.length; update(); }
  function restart(){ if(auto && !pausedHover){ clearInterval(timer); timer=setInterval(()=> go(idx+1), 2600);} }
  dots.forEach((d,i)=> d.addEventListener("click", ()=>{ go(i); restart(); }));
  prev?.addEventListener("click", ()=>{ go(idx-1); restart(); });
  next?.addEventListener("click", ()=>{ go(idx+1); restart(); });
  playBtn?.addEventListener("click", ()=>{
    auto=!auto;
    playBtn.textContent = auto ? "⏸ Pause" : "▶ Play";
    if(auto) restart(); else clearInterval(timer);
  });
  track.addEventListener("mouseenter", ()=>{ pausedHover=true; clearInterval(timer); });
  track.addEventListener("mouseleave", ()=>{ pausedHover=false; if(auto) restart(); });
  // reveal stagger on visit
  setTimeout(()=>{ frames.forEach((f,i)=> setTimeout(()=> f.classList.add("in"), 180+i*120)); }, 400);
  restart();
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

// === CURSOR — EVERYWHERE INTERACTIVE & ATTRACTIVE ===
(() => {
  if (matchMedia("(pointer:coarse)").matches || innerWidth<=900) return;
  const dot=document.getElementById("cursor-dot"), ring=document.getElementById("cursor-ring"), cursor=document.getElementById("cursor"), spot=document.getElementById("spotlight");
  if(!dot || !ring) return;
  let mx=innerWidth/2, my=innerHeight/2, rx=mx, ry=my;
  addEventListener("mousemove", e=>{
    mx=e.clientX; my=e.clientY;
    dot.style.left=mx+"px"; dot.style.top=my+"px";
    if(spot){ spot.style.setProperty("--mx", mx+"px"); spot.style.setProperty("--my", my+"px"); }
  }, {passive:true});
  (function loop(){
    rx += (mx - rx)*0.18; ry += (my - ry)*0.18;
    ring.style.left=rx+"px"; ring.style.top=ry+"px";
    requestAnimationFrame(loop);
  })();
  const hoverSel="a, button, .btn, .card, .domain, .overview-card, .skill, .goal, .b-card, .case, input, textarea, select";
  document.querySelectorAll(hoverSel).forEach(el=>{
    el.addEventListener("mouseenter", ()=> cursor?.classList.add("hover"));
    el.addEventListener("mouseleave", ()=> cursor?.classList.remove("hover"));
  });
  // also text hover
  document.addEventListener("mouseover", e=>{
    const t=e.target;
    if(t.matches && (t.matches("h1,h2,h3,p,span,li") || t.closest("h1,h2,h3,p"))) cursor?.classList.add("hover");
  });
  document.addEventListener("mouseout", e=>{
    const t=e.target;
    if(t.matches && t.matches("h1,h2,h3,p,span,li")) cursor?.classList.remove("hover");
  });
  // ripple on click everywhere
  document.addEventListener("click", e=>{
    const r=document.createElement("span"); r.className="ripple";
    const rect={x:e.clientX, y:e.clientY};
    r.style.left=rect.x+"px"; r.style.top=rect.y+"px";
    r.style.width=r.style.height="14px"; r.style.position="fixed"; r.style.marginLeft="-7px"; r.style.marginTop="-7px";
    document.body.appendChild(r); setTimeout(()=> r.remove(), 600);
  });
})();

