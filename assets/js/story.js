// Story — Ancient Book • Three.js realistic curl + viewport-fitted • GH Pages static (no build)
import * as THREE from 'three';

(() => {
  const spreads = [
    {
      left: {
        eyebrow: "Chapter I — The Idea of Infinity",
        title: "Why an 8-element system needs a book",
        body: `<p class="dropcap">I began with <b>∞</b> — villages and orbits share one constraint: do more with less. Land, Infra, Power, AI, Agriculture, Space, Transport, Ocean — eight nodes on one loop.</p><p>This book fits the viewport — no scroll. Three.js curl + GSAP, parchment via CanvasTexture. GH Pages static, Vercel universal.</p><div class="ornament">❦ ─── ✦ ─── ❦</div><p>Use <b>← →</b>, dots, or swipe.</p>`,
        illu: { src: "https://picsum.photos/seed/parchment1/640/360", cap: "Plate I — The 8-element loop" },
        chips: ["∞ System", "Three.js", "GSAP"],
        num: "I — left"
      },
      right: {
        eyebrow: "What this page is",
        title: "A living manuscript for stories & blog",
        body: `<p>Each spread is a chapter. <b>Stories</b> read like folklore, <b>Blog</b> like marginalia — field notes from shipping.</p><div class="illu"><img src="https://picsum.photos/seed/parchment2/640/360" loading="lazy" alt="workbench"><figcaption>Plate II — C sockets → satellite.js</figcaption></div><p>Add a story: duplicate a <code>spreads</code> entry in <code>assets/js/story.js</code> or POST to <code>/api/stories</code> on Vercel.</p>`,
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
        body: `<p class="dropcap">Ship live or it didn\'t happen. Each page &lt;30KB so a ₹7k phone on 2G still turns it.</p><p><b>Curl:</b> bent <code>PlaneGeometry(24 segments)</code> + vertex warp + GSAP <code>power2.inOut</code> + warm point light. Not flat rotateY.</p><div class="ornament">✦ ─── ❦ ─── ✦</div><p>Next: quantization & ONNX for &lt;10MB OCR.</p>`,
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
        body: `<p><b>GH Pages:</b> static — push to <code>main</code>, workflow uploads. No functions.</p><p><b>Vercel:</b> same file + add <code>api/stories.ts → Postgres</code>. Swap <code>spreads</code> for fetch — no rewrite.</p><ul style="margin:8px 0 8px 18px; color:var(--ink2); font-family:EB Garamond, serif; line-height:1.6"><li>• True 3D already here — this Three.js curl works on both hosts</li><li>• Keep images WebP/AVIF &lt;120KB</li></ul>`,
        illu: { src: "https://picsum.photos/seed/parchment7/640/360", cap: "Plate VII — Two hosts, one book" },
        chips: ["GH Pages ✓", "Vercel ✓"],
        num: "App. — left"
      },
      right: {
        eyebrow: "Appendix — Add your story",
        title: "Copy this template",
        body: `<p>Edit <code>assets/js/story.js:8</code> — push a new <code>spreads</code> entry with <code>left</code>/<code>right</code>. Dots & deep-links (<code>#s2</code>) update.</p><div class="ornament"><em>Illuminated • Paginated</em></div><p><a href="work.html">Explore work →</a> &nbsp; <a href="#" onclick="event.preventDefault(); goTo(0)">Cover ↑</a></p>`,
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

  let idx = 0;
  let turning = false;

  // --- HTML render helpers ---
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
  function renderDots(){ if(!dotsEl) return; dotsEl.innerHTML = spreads.map((_,i)=>`<button aria-label="Go to ${i+1}" class="${i===idx-1?'active':''}" data-i="${i+1}"></button>`).join(''); dotsEl.querySelectorAll('button').forEach(b=> b.addEventListener('click', ()=> goTo(parseInt(b.dataset.i,10)))); }
  function renderToc(){ if(!tocEl) return; const labels=["I — Infinity","II — Field Notes","III — Blog","App. — Host"]; tocEl.innerHTML = labels.map((l,i)=>`<button class="${i===idx-1?'active':''}" data-i="${i+1}">${String(i+1).padStart(2,'0')} · ${l}</button>`).join(''); tocEl.querySelectorAll('button').forEach(b=> b.addEventListener('click', ()=> goTo(parseInt(b.dataset.i,10)))); }

  // --- Three.js setup for realistic curl ---
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => window.innerWidth <= 860;
  let renderer, scene, camera, flipMesh, flipGeom, origPositions;
  let frontTex, backTex;
  const loader = new THREE.TextureLoader();

  function initThree(){
    if(prefersReduce || isMobile()) return;
    renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, 1, 0.1, 20);
    camera.position.set(0, 0.15, 2.35);
    camera.lookAt(0,0,0);
    // warm lights like candle + ambient
    scene.add(new THREE.AmbientLight(0xfff6e0, 1.05));
    const point = new THREE.PointLight(0xffc07a, 1.2, 6);
    point.position.set(0.6, 1.1, 1.2);
    scene.add(point);
    const dir = new THREE.DirectionalLight(0xffffff, 0.55);
    dir.position.set(-0.8, 0.9, 1);
    scene.add(dir);
    // page geometry — pivot at spine (left edge)
    const W = 1.02, H = 1.42;
    flipGeom = new THREE.PlaneGeometry(W, H, 24, 12);
    flipGeom.translate(W/2, 0, 0); // pivot at left edge
    origPositions = flipGeom.attributes.position.array.slice();
    const mat = new THREE.MeshStandardMaterial({ side:THREE.DoubleSide, roughness:0.92, metalness:0.0, transparent:true });
    flipMesh = new THREE.Mesh(flipGeom, mat);
    flipMesh.visible = false;
    flipMesh.position.set(0, 0, 0.015);
    scene.add(flipMesh);
    // subtle page shadow plane under flip
    const shadowGeo = new THREE.PlaneGeometry(W*0.9, H*0.92);
    const shadowMat = new THREE.MeshBasicMaterial({ color:0x000000, transparent:true, opacity:0.0 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.position.set(0.45, -0.02, -0.01);
    shadow.userData.isShadow = true;
    scene.add(shadow);
    scene.userData.shadow = shadow;
    onResizeThree();
    addEventListener('resize', onResizeThree);
    animate();
  }
  function onResizeThree(){
    if(!renderer || !canvas || !camera) return;
    const rect = canvas.getBoundingClientRect();
    if(rect.width===0 || rect.height===0) return;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }
  function animate(){ if(!renderer || !scene || !camera) return; requestAnimationFrame(animate); renderer.render(scene, camera); }

  // CanvasTexture from page data (parchment + text + ornaments) — high-res for crisp curl
  function createPageTexture(page, side){
    const w=1024, h=1440;
    const c=document.createElement('canvas'); c.width=w; c.height=h;
    const ctx=c.getContext('2d');
    // parchment base
    ctx.fillStyle='#fdf6e3'; ctx.fillRect(0,0,w,h);
    // subtle noise + old-map tint
    ctx.fillStyle='rgba(90,70,30,0.04)'; for(let i=0;i<420;i++){ const x=Math.random()*w, y=Math.random()*h, r=Math.random()*1.6; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); }
    // leather edge hint
    ctx.strokeStyle='rgba(90,70,30,0.12)'; ctx.lineWidth=10; ctx.strokeRect(6,6,w-12,h-12);
    ctx.strokeStyle='rgba(201,168,106,0.16)'; ctx.lineWidth=1; ctx.strokeRect(18,18,w-36,h-36);
    // eyebrow
    ctx.fillStyle='#7a6a4f'; ctx.font='12px Cinzel, serif'; ctx.letterSpacing='0.12em'; ctx.fillText(page.eyebrow.toUpperCase(), 48, 64);
    ctx.strokeStyle='rgba(90,70,30,0.18)'; ctx.beginPath(); ctx.moveTo(48,72); ctx.lineTo(w-48,72); ctx.stroke();
    // Title wrapped
    ctx.fillStyle='#2b2114'; ctx.font='bold 44px Cinzel, serif';
    let y=118;
    const titleLines = wrap(ctx, page.title, w-96, 46);
    titleLines.forEach(line=>{ ctx.fillText(line, 48, y); y+=50; });
    y+=8;
    // chips as pills
    if(page.chips){
      ctx.font='12px JetBrains Mono, monospace';
      let x=48;
      page.chips.forEach(ch=>{
        const tw = ctx.measureText(ch).width + 22;
        if(x+tw > w-48){ x=48; y+=22; }
        ctx.fillStyle='rgba(255,255,255,0.72)'; ctx.strokeStyle='rgba(90,70,30,0.16)';
        roundRect(ctx, x, y-14, tw, 20, 10); ctx.fill(); ctx.stroke();
        ctx.fillStyle='#7a6a4f'; ctx.fillText(ch, x+11, y);
        x+=tw+8;
      });
      y+=26;
    }
    // body — strip HTML tags for canvas, keep line breaks
    const text = page.body.replace(/<[^>]*>/g, ' ').replace(/\s+/g,' ').trim();
    ctx.fillStyle='#5a4630'; ctx.font='22px EB Garamond, serif';
    const bodyLines = wrap(ctx, text, w-96, 28);
    bodyLines.slice(0, 22).forEach(line=>{ ctx.fillText(line, 48, y); y+=30; });
    y+=12;
    // ornament
    ctx.fillStyle='#c9a86a'; ctx.font='20px serif'; ctx.textAlign='center';
    ctx.fillText('❦ ─── ✦ ─── ❦', w/2, y); ctx.textAlign='left'; y+=28;
    // illu placeholder
    if(page.illu){
      ctx.fillStyle='#f5e6c8'; ctx.strokeStyle='rgba(90,70,30,0.14)'; ctx.lineWidth=2;
      roundRect(ctx, 48, y, w-96, 220, 10); ctx.fill(); ctx.stroke();
      // inner image tint
      const grad = ctx.createLinearGradient(48,y, w-48, y+220);
      grad.addColorStop(0,'#e8d5a3'); grad.addColorStop(1,'#d8bd8a');
      ctx.fillStyle=grad; roundRect(ctx, 50, y+2, w-100, 190, 8); ctx.fill();
      ctx.fillStyle='rgba(43,33,20,0.55)'; ctx.font='12px JetBrains Mono, monospace'; ctx.textAlign='center';
      ctx.fillText(page.illu.cap.slice(0, 42), w/2, y+206); ctx.textAlign='left';
      y+=236;
    }
    // page number
    ctx.fillStyle='#7a6a4f'; ctx.font='12px Cinzel, serif';
    ctx.fillText(`${page.num} — ${side}`, side==='left'?48:w-200, h-38);
    // burnt edges vignette
    const g=ctx.createRadialGradient(w/2,h/2,w*0.45, w/2,h/2,w*0.85);
    g.addColorStop(0,'transparent'); g.addColorStop(1,'rgba(60,40,15,0.09)');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    const tex=new THREE.CanvasTexture(c);
    tex.colorSpace=THREE.SRGBColorSpace; tex.needsUpdate=true; tex.minFilter=THREE.LinearFilter;
    return tex;
  }
  function wrap(ctx, text, maxW, lineH){
    const words=text.split(' '); const lines=[]; let cur='';
    words.forEach(w=>{ const test=cur?cur+' '+w:w; if(ctx.measureText(test).width>maxW){ if(cur) lines.push(cur); cur=w; } else cur=test; });
    if(cur) lines.push(cur); return lines;
  }
  function roundRect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
  function disposeTex(t){ if(t) t.dispose(); }

  function bendFlip(progress){
    // progress 0..1, bend vertices along curl
    const pos = flipGeom.attributes.position;
    const arr = pos.array;
    const bend = Math.sin(progress * Math.PI) * 0.42; // max curl at mid
    const W=1.02;
    for(let i=0;i<arr.length;i+=3){
      const ox = origPositions[i];
      const oy = origPositions[i+1];
      const t = (ox) / W; // 0 at spine, 1 at edge (since translated)
      // cylindrical curl: z lifts with sin(t * pi) * bend
      const z = Math.sin(t * Math.PI) * bend * (0.55 + 0.45 * Math.sin(progress * Math.PI));
      // slight x compression near curl to feel paper thickness
      const xComp = ox - Math.sin(t * Math.PI) * 0.04 * Math.sin(progress * Math.PI);
      arr[i] = xComp;
      arr[i+1] = oy;
      arr[i+2] = z;
    }
    pos.needsUpdate=true;
    flipGeom.computeVertexNormals();
    // shadow opacity follows bend
    if(scene?.userData?.shadow){
      scene.userData.shadow.material.opacity = Math.sin(progress * Math.PI) * 0.16;
    }
  }

  // --- Show logic ---
  function showCover(animate){
    book.classList.add('is-closed');
    leftEl.style.display='none'; rightEl.style.display='none'; if(coverEl) coverEl.style.display='block';
    book.setAttribute('aria-label','Book cover');
    if(idxEl) idxEl.textContent='Cover';
    if(prevBtn) prevBtn.disabled=true;
    if(nextBtn) nextBtn.disabled=false;
    renderDots(); renderToc();
    if(flipMesh) flipMesh.visible=false;
    if(animate && window.gsap){ window.gsap.fromTo(book, {scale:.98},{scale:1,duration:.5,ease:'power2.out'}); }
    history.replaceState(null,'','#cover');
  }
  function showSpread(n, direction){
    const s=spreads[n-1]; if(!s) return;
    if(turning) return;
    const doSwapHTML = ()=>{
      leftEl.innerHTML = pageHTML(s.left,'left');
      rightEl.innerHTML = pageHTML(s.right,'right');
      leftEl.style.display=''; rightEl.style.display='';
      if(coverEl) coverEl.style.display='none';
      book.classList.remove('is-closed');
      if(idxEl) idxEl.textContent=`${n} / ${spreads.length}`;
      renderDots(); renderToc();
      history.replaceState(null,'',`#s${n}`);
    };
    const useThree = !!flipMesh && !prefersReduce && !isMobile() && typeof window.gsap!=='undefined';
    if(!useThree){
      doSwapHTML(); return;
    }
    turning=true;
    // Prepare textures: front = outgoing page, back = incoming page
    // For next: front = current right, back = next left (mirrored) ; For prev: front = current left, back = prev right
    const cur = idx===0 ? null : spreads[idx-1];
    let frontPage, backPage;
    if(direction==='next'){
      frontPage = cur ? cur.right : s.left; // from cover, front is blank -> use s.left
      backPage = s.left;
      // if coming from cover, we simulate cover turning — use parchment texture for front
      if(idx===0) frontPage = { eyebrow:'', title:'', body:'', chips:[], num:'', illu:null };
    } else {
      frontPage = cur ? cur.left : s.right;
      backPage = n===1 ? null : spreads[n-1].right; // going to cover handled separately
      if(n===1 && direction==='prev'){ // will go to cover after — we still animate left page back to cover
        backPage = { eyebrow:'', title:'', body:'', chips:[], num:'', illu:null };
      }
    }
    // Going to cover: animate then show cover
    if(n===0 || (direction==='prev' && idx===1 && n===1 && false)){
      // not used — goTo handles cover separately
    }
    disposeTex(frontTex); disposeTex(backTex);
    frontTex = createPageTexture(frontPage, direction==='next'?'right':'left');
    backTex = createPageTexture(backPage || s.right, direction==='next'?'left':'right');
    // Use frontTex for front face, backTex for back face via material on flip
    // Three.js double side with two textures needs custom: we swap at mid
    flipMesh.material.map = frontTex;
    flipMesh.material.needsUpdate = true;
    flipMesh.visible = true;
    flipMesh.rotation.y = 0;
    flipMesh.position.set(0,0,0.02);
    // keep book visible — canvas overlays on top, book stays showing behind curl
    canvas.style.zIndex='6';
    canvas.style.pointerEvents='auto';
    // prepare HTML behind flip: set next pages underneath so they show through after curl
    doSwapHTML();
    // temporarily hide the side being flipped so we see only curl, not duplicate page underneath
    if(direction==='next') rightEl.style.visibility='hidden'; else leftEl.style.visibility='hidden';
    const obj={p:0};
    let swapped=false;
    window.gsap.to(obj,{
      p:1, duration:0.92, ease:'power2.inOut',
      onUpdate:()=>{
        bendFlip(obj.p);
        flipMesh.rotation.y = (direction==='next' ? -obj.p : obj.p) * Math.PI;
        flipMesh.position.z = 0.02 + Math.sin(obj.p*Math.PI)*0.05;
        if(obj.p>0.5 && !swapped){
          swapped=true;
          flipMesh.material.map = backTex;
          flipMesh.material.needsUpdate=true;
        }
        book.style.transform = `scale(${1 - Math.sin(obj.p*Math.PI)*0.008})`;
      },
      onComplete:()=>{
        flipMesh.visible=false;
        book.style.transform='';
        canvas.style.zIndex='1';
        canvas.style.pointerEvents='none';
        leftEl.style.visibility=''; rightEl.style.visibility='';
        disposeTex(frontTex); disposeTex(backTex); frontTex=null; backTex=null;
        turning=false;
        onResizeThree();
      }
    });
    // For next, we already swapped HTML mid — but keep hidden until flip completes via visibility, so user sees three.js
  }

  window.goTo = (n)=>{
    if(n===0){ idx=0; showCover(true); return; }
    const clamped=Math.max(1,Math.min(spreads.length,n));
    const dir = clamped > idx ? 'next' : 'prev';
    // if idx is 0 (cover), dir is next
    const prevIdx=idx;
    idx=clamped;
    // For three.js, we need to pass direction based on prev
    const direction = prevIdx===0 ? 'next' : (clamped > prevIdx ? 'next' : 'prev');
    if(idx===0) { showCover(true); return; }
    // Temporarily set idx back for texture picking of current page if needed — showSpread expects idx to be new, cur derived from prevIdx
    // To keep cur correct, restore prev then call
    const tmp=idx; idx=prevIdx; showSpread(tmp, direction); idx=tmp;
  };
  function next(){ if(idx===0) goTo(1); else if(idx < spreads.length) goTo(idx+1); }
  function prev(){ if(idx>1) goTo(idx-1); else if(idx===1) goTo(0); }

  openBtn?.addEventListener('click', ()=> goTo(1));
  nextBtn?.addEventListener('click', next);
  prevBtn?.addEventListener('click', prev);
  addEventListener('keydown', e=>{ if(e.key==='ArrowRight') next(); if(e.key==='ArrowLeft') prev(); if(e.key==='Home') goTo(0); });
  let sx=0;
  book.addEventListener('touchstart', e=> sx=e.touches[0].clientX, {passive:true});
  book.addEventListener('touchend', e=>{ const dx=e.changedTouches[0].clientX - sx; if(Math.abs(dx)>44) { if(dx<0) next(); else prev(); } }, {passive:true});

  // init three after layout
  initThree();
  // deep-link
  const hash=location.hash;
  if(hash.startsWith('#s')){ const n=parseInt(hash.slice(2),10); if(!Number.isNaN(n) && n>=1 && n<=spreads.length){ idx=n; const s=spreads[n-1]; leftEl.innerHTML=pageHTML(s.left,'left'); rightEl.innerHTML=pageHTML(s.right,'right'); leftEl.style.display=''; rightEl.style.display=''; if(coverEl) coverEl.style.display='none'; book.classList.remove('is-closed'); if(idxEl) idxEl.textContent=`${n} / ${spreads.length}`; renderDots(); renderToc(); history.replaceState(null,'',`#s${n}`); } else showCover(false); } else showCover(false);

  window.__STORY_SPREADS__=spreads;
})();
