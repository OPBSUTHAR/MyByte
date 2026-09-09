// Story — Ancient Book • GH Pages static + Vercel universal
// No build: vanilla JS + GSAP CDN (fallback to CSS if GSAP missing). Spread model: each spread = 2 pages.
(() => {
  const spreads = [
    {
      left: {
        eyebrow: "Chapter I — The Idea of Infinity",
        title: "Why an 8-element system needs a book",
        body: `<p class="dropcap">I began with a symbol — <b>∞</b> — because villages and orbits obey the same constraint: do more with less. Land, Infrastructure, Power, AI, Agriculture, Space, Transportation, Ocean — eight elements on one loop. The book is the loop made physical.</p><p>This page is <b>GH Pages-ready</b>: pure HTML/CSS + <code>GSAP</code>. No server. On <b>Vercel</b> the same file hydrates with <code>/api/stories</code> if you later add <code>Node.js + PostgreSQL</code> — zero rewrite.</p><div class="ornament">❦ ─── ✦ ─── ❦</div><p>Flip with <b>← →</b>, swipe, or dots. The paper is CSS: <code>old-map.png</code> + <code>paper-fibers</code> + burnt edges.</p>`,
        illu: { src: "https://picsum.photos/seed/parchment1/640/360", cap: "Illumination — The 8-element loop as an open book" },
        chips: ["∞ System", "GH Pages", "Vercel", "GSAP"],
        num: "I — left"
      },
      right: {
        eyebrow: "What this page is",
        title: "A living manuscript for stories & blog",
        body: `<p>Each spread is a chapter. <b>Stories</b> read like folklore — with drop caps, ornaments, and illuminated figures. <b>Blog</b> reads like marginalia — field notes from shipping.</p><div class="illu"><img src="https://picsum.photos/seed/parchment2/640/360" loading="lazy" alt="workbench"><figcaption>Plate II — From C sockets to satellite.js (BharatVista Nexus)</figcaption></div><p><b>How to add a new story:</b> duplicate a <code>spreads</code> entry in <code>assets/js/story.js:8</code> — or, on Vercel, POST to <code>/api/stories</code> and it renders here.</p>`,
        chips: ["Stories", "Blog", "Marginalia"],
        num: "I — right"
      }
    },
    {
      left: {
        eyebrow: "Chapter II — Field Notes",
        title: "BharatVista Nexus in Pure C",
        body: `<p><b>Challenge:</b> enterprise OSINT without Python/Node — only <code>api.data.gov.in</code> + Celestrak TLE.</p><p><b>Build:</b> POSIX/WinSock, pthreads, libcurl, SQLite; geo kernel (haversine); Leaflet + satellite.js (SGP4).</p><div class="ornament"><em>POSIX • SQLite • SGP4</em></div><p><b>Result:</b> <a href="https://opbsuthar.github.io/BharatVista-Nexus/" target="_blank">Live ↗</a> — <code>make && ./build/server</code> on :8080. Frugal, offline-first.</p>`,
        illu: { src: "https://picsum.photos/seed/parchment3/640/360", cap: "Plate III — Ground track as illuminated map" },
        chips: ["Pure C", "SQLite", "Leaflet"],
        num: "II — left"
      },
      right: {
        eyebrow: "Chapter II — Continued",
        title: "Agnirva NEAT 5.0 — AI for Indian Satellites",
        body: `<p><b>Role:</b> Intern @ Agnirva (CHRIST) — BRD v0.2, Framewirk micro-movements, 6-hat artifacts.</p><p><b>Process:</b> Week 1 ✓ → Business Analyst → prototype stub in <code>src/</code>. Progress-log as source of truth.</p><div class="illu"><img src="https://picsum.photos/seed/parchment4/640/360" loading="lazy" alt="satellite"><figcaption>Plate IV — Earth observation pipelines</figcaption></div><p><a href="https://github.com/OPBSUTHAR/Agnirva-AI-Internship" target="_blank">Docs ↗</a> • Yeshwantpur, 2026.</p>`,
        chips: ["NEAT 5.0", "BRD", "CHRIST"],
        num: "II — right"
      }
    },
    {
      left: {
        eyebrow: "Chapter III — Blog: Marginalia",
        title: "Frugal AI — what ≤30KB teaches",
        body: `<p class="dropcap">Ship live or it didn\'t happen. I keep each page under 30KB so a ₹7k phone on 2G can still turn it. The book itself is < 18KB gzipped.</p><p><b>Pattern:</b> CSS 3D <code>perspective:2400px</code> + <code>transform-style: preserve-3d</code>; GSAP <code>rotateY:-180</code> on a turning layer; fallback is instant swap.</p><div class="ornament">✦ ─── ❦ ─── ✦</div><p>Next marginalia: <b>quantization & ONNX</b> for &lt;10MB OCR.</p>`,
        illu: { src: "https://picsum.photos/seed/parchment5/640/360", cap: "Marginal note — 2G-first, offline-first" },
        chips: ["≤30KB", "Offline", "ONNX"],
        num: "III — left"
      },
      right: {
        eyebrow: "Chapter III — Continued",
        title: "Roadmap 2026 → 2030",
        body: `<p><b>NOW 2026:</b> 5 field-ready AI tools — 68% there.</p><p><b>2027:</b> Distill ≤10MB models. <b>2028:</b> 1M rural users, 3 states. <b>2030:</b> MyByte as studio — small team, four domains, one principle.</p><div class="illu"><img src="https://picsum.photos/seed/parchment6/640/360" loading="lazy" alt="roadmap"><figcaption>Plate VI — The loop continues</figcaption></div><p>Reach me: <a href="contact.html">Contact →</a> • <a href="https://github.com/OPBSUTHAR" target="_blank">GitHub ↗</a></p>`,
        chips: ["2026–30", "Roadmap"],
        num: "III — right"
      }
    },
    {
      left: {
        eyebrow: "Appendix — How to host",
        title: "GitHub Pages (static) vs Vercel (full-stack)",
        body: `<p><b>GitHub Pages:</b> this file alone. Push to <code>main</code> — <code>.github/workflows/deploy.yml:1</code> uploads. No functions. Use <code>fetch</code> to <code>data/projects.json</code> if you want live data.</p><p><b>Vercel:</b> same static file works. To go full-stack later, add:</p><ul style="margin:8px 0 8px 18px; color:var(--ink2); font-family:EB Garamond, serif; line-height:1.6"><li><code>api/stories.ts</code> → Postgres (stories, users, collections)</li><li><code>GSAP + React Three Fiber</code> for true 3D page curl (optional)</li><li><code>next.config.js</code> basePath for GH Pages is not needed here</li></ul>`,
        illu: { src: "https://picsum.photos/seed/parchment7/640/360", cap: "Plate VII — Two hosts, one book" },
        chips: ["GH Pages ✓", "Vercel ✓", "No rewrite"],
        num: "App. — left"
      },
      right: {
        eyebrow: "Appendix — Add your story",
        title: "Copy this template",
        body: `<p><b>To add a chapter:</b> edit <code>assets/js/story.js:8</code> — push a new object to <code>spreads</code> with <code>left</code>/<code>right</code>. That\'s it. The book re-renders, dots update, deep-links work via <code>#s2</code>.</p><div class="ornament"><em>Illuminated • Paginated • Searchable</em></div><p><b>Tip:</b> Keep images WebP/AVIF, &lt;120KB. Use <code>picsum</code> placeholders until your illustrations are ready.</p><p><a href="work.html">Explore work →</a> &nbsp; <a href="#" onclick="event.preventDefault(); document.getElementById('book').scrollIntoView({behavior:'smooth'})">Back to cover ↑</a></p>`,
        chips: ["Template", "WebP", "Deep-link"],
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
  if (!book || !leftEl || !rightEl) return;

  let idx = 0; // 0 = cover, 1..n = spreads (displayed as 0-based internally, but cover is separate)
  let turning = false;
  const hasGSAP = typeof window.gsap !== 'undefined';

  function renderDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = spreads.map((_, i) => `<button aria-label="Go to ${i+1}" class="${i===idx-1?'active':''}" data-i="${i+1}"></button>`).join('');
    dotsEl.querySelectorAll('button').forEach(b => b.addEventListener('click', () => goTo(parseInt(b.dataset.i,10))));
  }
  function renderToc() {
    if (!tocEl) return;
    const labels = ["I — Infinity", "II — Field Notes", "III — Blog", "App. — Host"];
    tocEl.innerHTML = labels.map((l,i) => `<button class="${i===idx-1?'active':''}" data-i="${i+1}">${String(i+1).padStart(2,'0')} · ${l}</button>`).join('');
    tocEl.querySelectorAll('button').forEach(b => b.addEventListener('click', () => goTo(parseInt(b.dataset.i,10))));
  }
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
  function showCover(animate) {
    book.classList.add('is-closed');
    leftEl.style.display = 'none'; rightEl.style.display = 'none'; if(coverEl) coverEl.style.display = 'block';
    book.setAttribute('aria-label','Book cover');
    if (idxEl) idxEl.textContent = 'Cover';
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = spreads.length===0;
    renderDots(); renderToc();
    if (animate && hasGSAP) { gsap.fromTo(book, {scale:.98, rotateY:-2}, {scale:1, rotateY:0, duration:.6, ease:'power2.out'}); }
    history.replaceState(null,'','#cover');
  }
  function showSpread(n, direction) {
    const s = spreads[n-1]; if (!s) return;
    // turning animation: create overlay page that flips
    if (turning) return;
    const doSwap = () => {
      leftEl.innerHTML = pageHTML(s.left, 'left');
      rightEl.innerHTML = pageHTML(s.right, 'right');
      leftEl.style.display = ''; rightEl.style.display = '';
      if (coverEl) coverEl.style.display = 'none';
      book.classList.remove('is-closed');
      book.setAttribute('aria-label', `Spread ${n} of ${spreads.length}`);
      if (idxEl) idxEl.textContent = `${n} / ${spreads.length}`;
      if (prevBtn) prevBtn.disabled = false; // can go back to cover
      if (nextBtn) nextBtn.disabled = n===spreads.length;
      renderDots(); renderToc();
      history.replaceState(null,'',`#s${n}`);
    };
    if (!hasGSAP || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { doSwap(); return; }
    turning = true;
    // create turning layer (clone of outgoing left or right depending direction)
    const turn = document.createElement('div');
    turn.className = `page page--turning ${direction==='next'?'page--turning--right':''}`;
    // use current visible page as texture for turning
    const source = direction==='next' ? rightEl : leftEl;
    turn.innerHTML = source.innerHTML || leftEl.innerHTML;
    turn.style.transform = direction==='next' ? 'rotateY(0deg)' : 'rotateY(0deg)';
    book.appendChild(turn);
    gsap.to(turn, {
      rotateY: direction==='next' ? -180 : 180,
      duration: .85, ease: 'power2.inOut',
      onComplete: () => { turn.remove(); doSwap(); gsap.fromTo(book, {scale:.995}, {scale:1, duration:.25}); turning=false; }
    });
    // also swap content mid-flight for continuity
    setTimeout(doSwap, 320);
  }
  window.goTo = (n) => {
    if (n===0) { idx=0; showCover(true); return; }
    n = Math.max(1, Math.min(spreads.length, n));
    const dir = n > idx ? 'next' : 'prev';
    idx = n; showSpread(n, dir);
  };
  function next(){ if(idx===0) goTo(1); else if(idx < spreads.length) goTo(idx+1); }
  function prev(){ if(idx>1) goTo(idx-1); else if(idx===1) goTo(0); }

  // controls
  openBtn?.addEventListener('click', () => goTo(1));
  nextBtn?.addEventListener('click', next);
  prevBtn?.addEventListener('click', prev);
  // deep-link
  const hash = location.hash;
  if (hash.startsWith('#s')) { const n=parseInt(hash.slice(2),10); if(!Number.isNaN(n)) { idx=n; showSpread(n,'next'); } else { showCover(false);} }
  else { showCover(false); }
  // keyboard + swipe
  addEventListener('keydown', e=>{
    if(e.key==='ArrowRight') next();
    if(e.key==='ArrowLeft') prev();
    if(e.key==='Home') goTo(0);
  });
  let sx=0;
  book.addEventListener('touchstart', e=> sx=e.touches[0].clientX, {passive:true});
  book.addEventListener('touchend', e=>{
    const dx=e.changedTouches[0].clientX - sx;
    if(Math.abs(dx)>44) { if(dx<0) next(); else prev(); }
  }, {passive:true});

  // expose spreads for editing hint
  window.__STORY_SPREADS__ = spreads;
})();
