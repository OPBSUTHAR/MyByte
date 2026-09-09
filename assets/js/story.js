// Story — Ancient Book • Three.js curl • viewport-fitted • no scroll • GH Pages static
import * as THREE from 'three';

(() => {
  const spreads = [
    {
      left: {
        eyebrow: "Chapter I — The Idea of Infinity",
        title: "Why an 8-element system needs a book",
        body: `<p class="dropcap">I began with <b>∞</b> — villages and orbits share one constraint: do more with less. Land, Infra, Power, AI, Agriculture, Space, Transport, Ocean — eight nodes on one loop.</p><p>No scroll inside pages — everything fits the viewport. Three.js curl + GSAP, leather cover, parchment pages.</p><div class="ornament">❦ ─── ✦ ─── ❦</div><p>Use <b>← →</b>, dots, or swipe. ESC to close.</p>`,
        illu: { src: "https://picsum.photos/seed/parchment1/640/360", cap: "Plate I — The 8-element loop" },
        chips: ["∞ System", "Three.js", "No scroll"],
        num: "I — left"
      },
      right: {
        eyebrow: "What this page is",
        title: "A living manuscript for stories & blog",
        body: `<p>Each spread is a chapter. <b>Stories</b> read like folklore, <b>Blog</b> like marginalia — field notes from shipping.</p><div class="illu"><img src="https://picsum.photos/seed/parchment2/640/360" loading="lazy" alt="workbench"><figcaption>Plate II — C sockets → satellite.js</figcaption></div><p>Add a story: duplicate a <code>spreads</code> entry in <code>assets/js/story.js</code>.</p>`,
        chips: ["Stories", "Blog"],
        num: "I — right"
      }
    },
    {
      left: {
        eyebrow: "Chapter II — Field Notes",
        title: "BharatVista Nexus in Pure C",
        body: `<p><b>Challenge:</b> OSINT without Python/Node — only <code>api.data.gov.in</code> + Celestrak TLE.</p><p><b>Build:</b> POSIX/WinSock, pthreads, libcurl, SQLite; haversine; Leaflet + satellite.js (SGP4).</p><div class="ornament"><em>POSIX • SQLite • SGP4</em></div><p><a href="https://opbsuthar.github.io/BharatVista-Nexus/" target="_blank">Live ↗</a> — <code>make && ./build/server</code></p>`,
        illu: { src: "https://picsum.photos/seed/parchment3/640/360", cap: "Plate III — Illuminated ground track" },
        chips: ["Pure C", "SQLite", "Leaflet"],
        num: "II — left"
      },
      right: {
        eyebrow: "Chapter II — Continued",
        title: "Agnirva NEAT 5.0 — AI for Indian Satellites",
        body: `<p><b>Role:</b> Intern @ Agnirva (CHRIST) — BRD v0.2, Framewirk, 6-hat.</p><p><b>Process:</b> Week 1 ✓ → Business Analyst → prototype in <code>src/</code>.</p><div class="illu"><img src="https://picsum.photos/seed/parchment4/640/360" loading="lazy" alt="satellite"><figcaption>Plate IV — Earth observation</figcaption></div><p><a href="https://github.com/OPBSUTHAR/Agnirva-AI-Internship" target="_blank">Docs ↗</a></p>`,
        chips: ["NEAT 5.0", "BRD"],
        num: "II — right"
      }
    },
    {
      left: {
        eyebrow: "Chapter III — Blog: Marginalia",
        title: "Frugal AI — what ≤30KB teaches",
        body: `<p class="dropcap">Ship live or it didn\'t happen. Each page &lt;30KB so a ₹7k phone on 2G still turns it.</p><p><b>Curl:</b> bent plane (24 segs) + vertex warp — matches book size, no blur.</p><div class="ornament">✦ ─── ❦ ─── ✦</div><p>Next: quantization & ONNX for &lt;10MB OCR.</p>`,
        illu: { src: "https://picsum.photos/seed/parchment5/640/360", cap: "Marginal note — 2G-first" },
        chips: ["≤30KB", "Three.js curl"],
        num: "III — left"
      },
      right: {
        eyebrow: "Chapter III — Continued",
        title: "Roadmap 2026 → 2030",
        body: `<p><b>2026:</b> 5 field AI tools — 68%. <b>2027:</b> ≤10MB models. <b>2028:</b> 1M rural users. <b>2030:</b> MyByte studio.</p><div class="illu"><img src="https://picsum.photos/seed/parchment6/640/360" loading="lazy" alt="roadmap"><figcaption>Plate VI — The loop continues</figcaption></div><p><a href="contact.html">Contact →</a> • <a href="https://github.com/OPBSUTHAR" target="_blank">GitHub ↗</a></p>`,
        chips: ["2026–30", "Roadmap"],
        num: "III — right"
      }
    },
    {
      left: {
        eyebrow: "Appendix — How to host",
        title: "GitHub Pages vs Vercel",
        body: `<p><b>GH Pages:</b> static — push to <code>main</code>. <b>Vercel:</b> same file + <code>api/stories.ts → Postgres</code>.</p><ul style="margin:8px 0 8px 18px; color:var(--ink2); font-family:EB Garamond, serif; line-height:1.6"><li>• Three.js curl works on both hosts</li><li>• Keep images WebP/AVIF &lt;120KB</li></ul>`,
        illu: { src: "https://picsum.photos/seed/parchment7/640/360", cap: "Plate VII — Two hosts, one book" },
        chips: ["GH Pages ✓", "Vercel ✓"],
        num: "App. — left"
      },
      right: {
        eyebrow: "Appendix — Add your story",
        title: "Copy this template",
        body: `<p>Edit <code>assets/js/story.js</code> — push a new <code>spreads</code> entry with <code>left</code>/<code>right</code>. Dots & deep-links (<code>#s2</code>) update.</p><div class="ornament"><em>Illuminated • Paginated</em></div><p><a href="work.html">Explore work →</a> &nbsp; <a href="#" onclick="event.preventDefault(); goTo(0)">Cover ↑</a></p>`,
        chips: ["Template", "WebP"],
        num: "App. — right"
      }
    }
  ];

  const book = document.getElementById('book');
  const leftEl = document.getElementById('pageLeft');
  const rightEl = document.getElementById('pageRight');
  const coverEl = document.getElementById('bookCover');
  const dotsEl = document.getElementById('bookDots');
  const prevBtn = document.getElementById('prevSpread');
  const nextBtn = document.getElementById('nextSpread');
  const openBtn = document.getElementById('openBook');
  const tocEl = document.getElementById('bookToc');
  const idxEl = document.getElementById('spreadIdx');
  const canvas = document.getElementById('bookCanvas');
  if (!book || !leftEl || !rightEl || !canvas) return;

  let curIdx = 0; // 0=cover, 1..n=spreads
  let turning = false;

  function pageHTML(p, side) {
    return `
      <div class="page__eyebrow"><span>${p.eyebrow}</span><i></i></div>
      <h2>${p.title}</h2>
      ${p.chips ? `<div class="meta-chips">${p.chips.map(c=>`<span>${c}</span>`).join('')}</div>` : ''}
      ${p.body}
      ${p.illu ? `<figure class="illu"><img src="${p.illu.src}" alt="" loading="lazy"><figcaption>${p.illu.cap}</figcaption></figure>` : ''}
      <div class="page-num">${p.num} — ${side}</div>
    `;
  }
  function renderDots(){ if(!dotsEl) return; dotsEl.innerHTML = spreads.map((_,i)=>`<button aria-label="Go to ${i+1}" class="${i===curIdx-1?'active':''}" data-i="${i+1}"></button>`).join(''); dotsEl.querySelectorAll('button').forEach(b=> b.addEventListener('click', ()=> goTo(parseInt(b.dataset.i,10)))); }
  function renderToc(){ if(!tocEl) return; const labels=["I — Infinity","II — Field Notes","III — Blog","App. — Host"]; tocEl.innerHTML = labels.map((l,i)=>`<button class="${i===curIdx-1?'active':''}" data-i="${i+1}">${String(i+1).padStart(2,'0')} · ${l}</button>`).join(''); tocEl.querySelectorAll('button').forEach(b=> b.addEventListener('click', ()=> goTo(parseInt(b.dataset.i,10)))); }
  function syncControls(){
    if(prevBtn) prevBtn.disabled = turning ? true : (curIdx===0);
    if(nextBtn){
      if(curIdx===0) nextBtn.disabled = turning;
      else nextBtn.disabled = turning ? true : (curIdx===spreads.length);
      nextBtn.textContent = curIdx===spreads.length ? '— End' : 'Next →';
    }
    if(prevBtn) prevBtn.textContent = curIdx===0 ? '— Cover' : (curIdx===1 ? '← Cover' : '← Prev');
  }

  // --- Three.js ---
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => window.innerWidth <= 860;
  let renderer, scene, camera, flipMesh, flipGeom, origPos;
  let frontTex=null, backTex=null;

  function initThree(){
    if(prefersReduce || isMobile()) return;
    renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    scene = new THREE.Scene();
    // match book inner aspect: each page ~480x520 → pair 960x520 → aspect 1.846
    camera = new THREE.PerspectiveCamera(44, 1, 0.1, 20);
    camera.position.set(0, 0.06, 2.02);
    camera.lookAt(0,0,0);
    scene.add(new THREE.AmbientLight(0xfff6e0, 1.08));
    const point = new THREE.PointLight(0xffbf7a, 1.1, 6); point.position.set(0.5, 0.95, 1.1); scene.add(point);
    const dir = new THREE.DirectionalLight(0xffffff, 0.5); dir.position.set(-0.7, 0.8, 0.9); scene.add(dir);
    // page size matched to book inner: width ~ 0.92*halfBook, height ~ 0.92*bookHeight
    // book inner 960x520 → half 480x520 → ratio 0.923 → plane 0.96 x 1.04 gives same ratio
    const W = 0.96, H = 1.02;
    flipGeom = new THREE.PlaneGeometry(W, H, 28, 14);
    flipGeom.translate(W/2, 0, 0);
    origPos = flipGeom.attributes.position.array.slice();
    const mat = new THREE.MeshStandardMaterial({ side:THREE.DoubleSide, roughness:0.88, metalness:0.0 });
    flipMesh = new THREE.Mesh(flipGeom, mat);
    flipMesh.visible=false; flipMesh.position.set(0,0,0.02); scene.add(flipMesh);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(W*0.88, H*0.88), new THREE.MeshBasicMaterial({ color:0x000000, transparent:true, opacity:0 }));
    shadow.position.set(0.42, -0.02, -0.015); shadow.userData.isShadow=true; scene.add(shadow); scene.userData={shadow};
    onResizeThree(); addEventListener('resize', onResizeThree); animate();
  }
  function onResizeThree(){
    if(!renderer || !canvas || !camera) return;
    const r=canvas.getBoundingClientRect(); if(r.width<10) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect=r.width/r.height; camera.updateProjectionMatrix();
  }
  function animate(){ if(!renderer||!scene||!camera) return; requestAnimationFrame(animate); renderer.render(scene,camera); }

  function createPageTexture(page, side){
    const w=1024, h=1120; // matched to page ratio, not tall → less blur when mapped to shorter plane
    const c=document.createElement('canvas'); c.width=w; c.height=h;
    const ctx=c.getContext('2d');
    ctx.fillStyle='#fdf6e3'; ctx.fillRect(0,0,w,h);
    // subtle grain
    ctx.fillStyle='rgba(90,70,30,0.035)'; for(let i=0;i<380;i++){ const x=Math.random()*w,y=Math.random()*h,r=Math.random()*1.3; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); }
    ctx.strokeStyle='rgba(90,70,30,0.10)'; ctx.lineWidth=8; ctx.strokeRect(8,8,w-16,h-16);
    ctx.strokeStyle='rgba(201,168,106,0.14)'; ctx.lineWidth=1; ctx.strokeRect(18,18,w-36,h-36);
    // text
    ctx.fillStyle='#7a6a4f'; ctx.font='11px Cinzel, serif'; ctx.fillText((page.eyebrow||'').toUpperCase(), 44, 54);
    ctx.strokeStyle='rgba(90,70,30,0.16)'; ctx.beginPath(); ctx.moveTo(44,62); ctx.lineTo(w-44,62); ctx.stroke();
    ctx.fillStyle='#2b2114'; ctx.font='bold 38px Cinzel, serif';
    let y=110; const tl=wrap(ctx, page.title||'', w-88, 40); tl.slice(0,3).forEach(l=>{ ctx.fillText(l,44,y); y+=44; }); y+=6;
    if(page.chips && page.chips.length){ ctx.font='11px JetBrains Mono, monospace'; let x=44; page.chips.forEach(ch=>{ const tw=ctx.measureText(ch).width+18; if(x+tw>w-44){x=44; y+=20;} ctx.fillStyle='rgba(255,255,255,0.68)'; ctx.strokeStyle='rgba(90,70,30,0.14)'; roundRect(ctx,x,y-12,tw,18,9); ctx.fill(); ctx.stroke(); ctx.fillStyle='#7a6a4f'; ctx.fillText(ch,x+9,y); x+=tw+6; }); y+=22; }
    const text=(page.body||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
    ctx.fillStyle='#5a4630'; ctx.font='19px EB Garamond, serif'; const bl=wrap(ctx,text,w-88, 24); bl.slice(0,14).forEach(l=>{ ctx.fillText(l,44,y); y+=26; }); y+=10;
    ctx.fillStyle='#c9a86a'; ctx.font='18px serif'; ctx.textAlign='center'; ctx.fillText('❦ ─── ✦ ─── ❦', w/2, y); ctx.textAlign='left'; y+=22;
    if(page.illu){ ctx.fillStyle='#f5e6c8'; ctx.strokeStyle='rgba(90,70,30,0.12)'; roundRect(ctx,44,y,w-88,170,8); ctx.fill(); ctx.stroke(); const g=ctx.createLinearGradient(44,y,w-44,y+170); g.addColorStop(0,'#e8d5a3'); g.addColorStop(1,'#d8bd8a'); ctx.fillStyle=g; roundRect(ctx,46,y+2,w-92,140,6); ctx.fill(); ctx.fillStyle='rgba(43,33,20,0.52)'; ctx.font='11px JetBrains Mono, monospace'; ctx.textAlign='center'; ctx.fillText((page.illu.cap||'').slice(0,48), w/2, y+162); ctx.textAlign='left'; y+=182; }
    ctx.fillStyle='#7a6a4f'; ctx.font='11px Cinzel, serif'; ctx.fillText(`${page.num||''} — ${side}`, side==='left'?44:w-190, h-28);
    const vg=ctx.createRadialGradient(w/2,h/2,w*0.42,w/2,h/2,w*0.82); vg.addColorStop(0,'transparent'); vg.addColorStop(1,'rgba(60,40,15,0.08)'); ctx.fillStyle=vg; ctx.fillRect(0,0,w,h);
    const tex=new THREE.CanvasTexture(c); tex.colorSpace=THREE.SRGBColorSpace; tex.generateMipmaps=false; tex.minFilter=THREE.LinearFilter; tex.magFilter=THREE.LinearFilter; tex.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 1; tex.needsUpdate=true;
    return tex;
  }
  function wrap(ctx, text, maxW){ const words=text.split(' '); const lines=[]; let cur=''; words.forEach(w=>{ const t=cur?cur+' '+w:w; if(ctx.measureText(t).width>maxW){ if(cur) lines.push(cur); cur=w; } else cur=t; }); if(cur) lines.push(cur); return lines; }
  function roundRect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
  function disposeTex(t){ if(t && t.dispose) t.dispose(); }
  function bendFlip(p){
    const pos=flipGeom.attributes.position, arr=pos.array; const bend=Math.sin(p*Math.PI)*0.38, W=0.96;
    for(let i=0;i<arr.length;i+=3){ const ox=origPos[i], t=ox/W; const z=Math.sin(t*Math.PI)*bend*(0.58+0.42*Math.sin(p*Math.PI)); const xc=ox - Math.sin(t*Math.PI)*0.035*Math.sin(p*Math.PI); arr[i]=xc; arr[i+2]=z; }
    pos.needsUpdate=true; flipGeom.computeVertexNormals();
    if(scene?.userData?.shadow) scene.userData.shadow.material.opacity = Math.sin(p*Math.PI)*0.14;
  }

  function showCover(animate){
    if(turning) return;
    curIdx=0; book.classList.add('is-closed'); leftEl.style.display='none'; rightEl.style.display='none'; if(coverEl) coverEl.style.display='block';
    leftEl.style.visibility=''; rightEl.style.visibility=''; book.style.transform='';
    if(canvas){ canvas.style.zIndex='1'; canvas.style.pointerEvents='none'; }
    if(flipMesh) flipMesh.visible=false;
    if(idxEl) idxEl.textContent='Cover'; renderDots(); renderToc(); syncControls();
    if(animate && window.gsap) window.gsap.fromTo(book,{scale:.985},{scale:1,duration:.45,ease:'power2.out'});
    history.replaceState(null,'','#cover');
  }
  function showSpread(n, direction){
    const s=spreads[n-1]; if(!s) return;
    if(turning) return;
    const useThree = !!flipMesh && !prefersReduce && !isMobile() && typeof window.gsap!=='undefined';
    const doSwap = ()=>{
      leftEl.innerHTML=pageHTML(s.left,'left'); rightEl.innerHTML=pageHTML(s.right,'right');
      leftEl.style.display=''; rightEl.style.display=''; leftEl.style.visibility=''; rightEl.style.visibility='';
      if(coverEl) coverEl.style.display='none'; book.classList.remove('is-closed');
      if(idxEl) idxEl.textContent=`${n} / ${spreads.length}`; renderDots(); renderToc(); syncControls();
      history.replaceState(null,'',`#s${n}`);
    };
    if(!useThree){
      curIdx=n; doSwap(); return;
    }
    // Three.js curl: overlay matches book inner size
    turning=true; syncControls();
    const prevIdx=curIdx; // cur before change
    const cur = prevIdx===0 ? null : spreads[prevIdx-1];
    let frontPage, backPage;
    if(direction==='next'){
      frontPage = cur ? cur.right : {eyebrow:'',title:'',body:'',chips:[],num:'',illu:null};
      backPage = s.left;
    } else {
      frontPage = cur ? cur.left : s.right;
      // when going prev, back is previous spread's right page (n already target, so spreads[n-1] is target? Wait we want target's right when going prev from 2->1? No 2->1 target n=1, back should be spreads[0].right? Actually 2->1: front=cur.left (spread2 left), back=target right (spread1 right) → flap reveals right side behind? But left flip should reveal previous right. Simpler: for prev, back = s.right
      backPage = s.right;
    }
    disposeTex(frontTex); disposeTex(backTex);
    frontTex=createPageTexture(frontPage, direction==='next'?'right':'left');
    backTex=createPageTexture(backPage, direction==='next'?'left':'right');
    flipMesh.material.map=frontTex; flipMesh.material.needsUpdate=true; flipMesh.visible=true; flipMesh.rotation.y=0; flipMesh.position.set(0,0,0.02);
    canvas.style.zIndex='6'; canvas.style.pointerEvents='auto';
    // set HTML to target behind flip, hide flipping side underneath so no double
    curIdx=n; doSwap();
    if(direction==='next') rightEl.style.visibility='hidden'; else leftEl.style.visibility='hidden';
    const obj={p:0}; let swapped=false;
    window.gsap.to(obj,{
      p:1, duration:0.88, ease:'power2.inOut',
      onUpdate:()=>{
        bendFlip(obj.p);
        flipMesh.rotation.y=(direction==='next'?-obj.p:obj.p)*Math.PI;
        flipMesh.position.z=0.02+Math.sin(obj.p*Math.PI)*0.05;
        if(obj.p>0.5 && !swapped){ swapped=true; flipMesh.material.map=backTex; flipMesh.material.needsUpdate=true; }
        book.style.transform=`scale(${1-Math.sin(obj.p*Math.PI)*0.007})`;
      },
      onComplete:()=>{
        flipMesh.visible=false; book.style.transform=''; canvas.style.zIndex='1'; canvas.style.pointerEvents='none';
        leftEl.style.visibility=''; rightEl.style.visibility='';
        disposeTex(frontTex); disposeTex(backTex); frontTex=null; backTex=null;
        turning=false; syncControls(); onResizeThree();
      }
    });
  }

  window.goTo = (n)=>{
    if(turning) return;
    if(n===0){ showCover(true); return; }
    n=Math.max(1, Math.min(spreads.length, n));
    if(n===curIdx) return;
    const dir = n > curIdx ? 'next' : 'prev';
    showSpread(n, dir);
    curIdx=n; // keep sync for non-three path (showSpread already set curIdx for three path, but ensure)
    // For three path, curIdx was set inside showSpread's doSwap, but we also need prev for texture — already handled via prevIdx capture above, so keep
  };
  // Correction: showSpread already sets curIdx via doSwap, so goTo should not double set. Remove double.
  // Rewire goTo correctly:
  window.goTo = (n)=>{
    if(turning) return;
    if(n===0){ showCover(true); return; }
    n=Math.max(1, Math.min(spreads.length, n));
    if(n===curIdx) return;
    const dir = n > curIdx ? 'next' : 'prev';
    showSpread(n, dir);
    // curIdx is set inside showSpread via doSwap for both paths, but for three path it's set before animation start via curIdx=n in doSwap — need to ensure prevIdx captured correctly
    // So we capture prev before, but showSpread uses curIdx at call time for frontPage — need prev. Fix by passing prev explicitly.
  };
  // Actually re-define showSpread to accept prevIdx
  const _origShowSpread = showSpread;
  // Monkey-patch goTo to capture prev
  window.goTo = (n)=>{
    if(turning) return;
    if(n===0){ showCover(true); return; }
    n=Math.max(1, Math.min(spreads.length, n));
    if(n===curIdx) return;
    const dir = n > curIdx ? 'next' : 'prev';
    const prev = curIdx;
    // call with explicit prev
    const s=spreads[n-1]; if(!s) return;
    const useThree = !!flipMesh && !prefersReduce && !isMobile() && typeof window.gsap!=='undefined';
    if(!useThree){
      curIdx=n;
      leftEl.innerHTML=pageHTML(s.left,'left'); rightEl.innerHTML=pageHTML(s.right,'right');
      leftEl.style.display=''; rightEl.style.display=''; if(coverEl) coverEl.style.display='none'; book.classList.remove('is-closed');
      if(idxEl) idxEl.textContent=`${n} / ${spreads.length}`; renderDots(); renderToc(); syncControls(); history.replaceState(null,'',`#s${n}`); return;
    }
    turning=true; syncControls();
    let frontPage, backPage;
    if(dir==='next'){
      const cur = prev===0 ? null : spreads[prev-1];
      frontPage = cur ? cur.right : {eyebrow:'',title:'',body:'',chips:[],num:'',illu:null};
      backPage = s.left;
    } else {
      const cur = prev===0 ? null : spreads[prev-1];
      frontPage = cur ? cur.left : s.right;
      backPage = s.right;
    }
    disposeTex(frontTex); disposeTex(backTex);
    frontTex=createPageTexture(frontPage, dir==='next'?'right':'left');
    backTex=createPageTexture(backPage, dir==='next'?'left':'right');
    flipMesh.material.map=frontTex; flipMesh.material.needsUpdate=true; flipMesh.visible=true; flipMesh.rotation.y=0; flipMesh.position.set(0,0,0.02);
    canvas.style.zIndex='6'; canvas.style.pointerEvents='auto';
    curIdx=n;
    leftEl.innerHTML=pageHTML(s.left,'left'); rightEl.innerHTML=pageHTML(s.right,'right');
    leftEl.style.display=''; rightEl.style.display=''; leftEl.style.visibility=''; rightEl.style.visibility='';
    if(coverEl) coverEl.style.display='none'; book.classList.remove('is-closed');
    if(idxEl) idxEl.textContent=`${n} / ${spreads.length}`; renderDots(); renderToc(); syncControls(); history.replaceState(null,'',`#s${n}`);
    if(dir==='next') rightEl.style.visibility='hidden'; else leftEl.style.visibility='hidden';
    const obj={p:0}; let swapped=false;
    window.gsap.to(obj,{
      p:1, duration:0.88, ease:'power2.inOut',
      onUpdate:()=>{
        bendFlip(obj.p);
        flipMesh.rotation.y=(dir==='next'?-obj.p:obj.p)*Math.PI;
        flipMesh.position.z=0.02+Math.sin(obj.p*Math.PI)*0.05;
        if(obj.p>0.5 && !swapped){ swapped=true; flipMesh.material.map=backTex; flipMesh.material.needsUpdate=true; }
        book.style.transform=`scale(${1-Math.sin(obj.p*Math.PI)*0.007})`;
      },
      onComplete:()=>{
        flipMesh.visible=false; book.style.transform=''; canvas.style.zIndex='1'; canvas.style.pointerEvents='none';
        leftEl.style.visibility=''; rightEl.style.visibility='';
        disposeTex(frontTex); disposeTex(backTex); frontTex=null; backTex=null;
        turning=false; syncControls(); onResizeThree();
      }
    });
  };

  function next(){ if(curIdx===0) goTo(1); else if(curIdx < spreads.length) goTo(curIdx+1); }
  function prev(){ if(curIdx===1) goTo(0); else if(curIdx>1) goTo(curIdx-1); else if(curIdx===0) return; }

  openBtn?.addEventListener('click', ()=> goTo(1));
  nextBtn?.addEventListener('click', next);
  prevBtn?.addEventListener('click', prev);
  addEventListener('keydown', e=>{
    if(e.key==='ArrowRight') next();
    else if(e.key==='ArrowLeft') prev();
    else if(e.key==='Escape') goTo(0);
    else if(e.key==='Home') goTo(0);
  });
  let sx=0;
  book.addEventListener('touchstart', e=> sx=e.touches[0].clientX, {passive:true});
  book.addEventListener('touchend', e=>{ const dx=e.changedTouches[0].clientX - sx; if(Math.abs(dx)>44) { if(dx<0) next(); else prev(); } }, {passive:true});

  initThree();
  const hash=location.hash;
  if(hash.startsWith('#s')){ const n=parseInt(hash.slice(2),10); if(!Number.isNaN(n) && n>=1 && n<=spreads.length){ curIdx=n; const s=spreads[n-1]; leftEl.innerHTML=pageHTML(s.left,'left'); rightEl.innerHTML=pageHTML(s.right,'right'); leftEl.style.display=''; rightEl.style.display=''; if(coverEl) coverEl.style.display='none'; book.classList.remove('is-closed'); if(idxEl) idxEl.textContent=`${n} / ${spreads.length}`; renderDots(); renderToc(); syncControls(); history.replaceState(null,'',`#s${n}`); } else showCover(false); } else showCover(false);

  window.__STORY_SPREADS__=spreads;
})();
