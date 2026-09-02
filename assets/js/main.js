// MyByte SUPREME — motion & interactions (magnetic, reveal, progress, play)
const phrases = ["Python 🐍 Supreme","Web • Live Previews","JavaScript / TypeScript","AI & Automation","C / C++ • Systems","supreme UI/UX"];
let pi=0, ci=0, del=false;
const typed = document.getElementById('typed');
function tick(){
  const w = phrases[pi];
  if(!del){ ci++; typed.textContent = w.slice(0,ci); if(ci===w.length){ del=true; setTimeout(tick,1600); return; } }
  else { ci--; typed.textContent = w.slice(0,ci); if(ci===0){ del=false; pi=(pi+1)%phrases.length; } }
  setTimeout(tick, del? 42: 96);
}
tick();

// theme — default dark supreme
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

// contact
window.handleContact = (e)=>{
  e.preventDefault();
  const fd=new FormData(e.target);
  const name=fd.get('name'), email=fd.get('email'), msg=fd.get('message');
  const subject=encodeURIComponent(`MyByte Supreme — contact from ${name}`);
  const body=encodeURIComponent(`From: ${name} <${email}>\n\n${msg}\n\n— via MyByte Supreme`);
  location.href=`mailto:opbsuthar@github.com?subject=${subject}&body=${body}`;
  document.getElementById('formMsg').textContent='Opening mail client… fallback: opbsuthar@github.com';
  return false;
};
