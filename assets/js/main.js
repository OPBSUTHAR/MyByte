// MyByte — interactions
const $ = s => document.querySelector(s);

// typing effect
const phrases = ["Python 🐍","Web Technologies","JavaScript / TypeScript","AI & Automation","C / C++","clean UI/UX"];
let pi=0, ci=0, del=false;
const typed = document.getElementById('typed');
function tick(){
  const word = phrases[pi];
  if(!del){ ci++; typed.textContent = word.slice(0,ci); if(ci===word.length){ del=true; setTimeout(tick,1200); return; } }
  else { ci--; typed.textContent = word.slice(0,ci); if(ci===0){ del=false; pi=(pi+1)%phrases.length; } }
  setTimeout(tick, del? 55: 110);
}
tick();

// theme
const toggle = document.getElementById('themeToggle');
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  toggle.textContent = t==='dark' ? '☀️' : '🌙';
}
const saved = localStorage.getItem('theme');
applyTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
toggle.addEventListener('click', ()=> applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'));

// mobile nav
document.getElementById('menuBtn').addEventListener('click', ()=> document.getElementById('navLinks').classList.toggle('open'));
document.querySelectorAll('#navLinks a').forEach(a=> a.addEventListener('click', ()=> document.getElementById('navLinks').classList.remove('open')));

// filter
const filterBtns = document.querySelectorAll('.filter button');
filterBtns.forEach(b=> b.addEventListener('click', ()=>{
  filterBtns.forEach(x=>x.classList.remove('active')); b.classList.add('active');
  const f=b.dataset.filter;
  document.querySelectorAll('.card').forEach(c=>{
    const lang=(c.dataset.lang||'').toLowerCase();
    c.style.display = (f==='all' || lang===f.toLowerCase()) ? 'flex':'none';
  });
}));

// contact form — mailto fallback (no backend needed on Pages)
window.handleContact = (e)=>{
  e.preventDefault();
  const fd=new FormData(e.target);
  const name=fd.get('name'), email=fd.get('email'), msg=fd.get('message');
  const subject=encodeURIComponent(`Portfolio contact from ${name}`);
  const body=encodeURIComponent(`From: ${name} <${email}>\n\n${msg}`);
  // try mailto
  window.location.href=`mailto:opbsuthar@github.com?subject=${subject}&body=${body}`;
  document.getElementById('formMsg').textContent='Opening your email client… If not, email me at opbsuthar@github.com';
  return false;
};

// smooth reveal
const obs=new IntersectionObserver(es=> es.forEach(e=>{ if(e.isIntersecting) e.target.style.opacity=1}),{threshold:.08});
document.querySelectorAll('.card,.mini-card,.skill-group').forEach(el=>{ el.style.opacity=.0; el.style.transition='opacity .5s'; obs.observe(el)});
setTimeout(()=>document.querySelectorAll('.card').forEach(c=>c.style.opacity=1),800);
