import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReduce } from '../hooks/useCountUp';
import { useDesktop } from '../hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   Aurora Engine — the living backdrop behind every section.

   One scroll signal (position + velocity of the Lenis-smoothed page)
   drives three canvas systems on fine-pointer desktops:
     · aurora ribbons  — soft light bands that rise with page progress
                         and brighten / flow faster with scroll velocity
     · constellation   — depth-parallax particle field that repels the
                         pointer and streaks while you scroll
     · comets          — rare light streaks released only by fast
                         scrolling (scroll itself is the trigger)
   …plus DOM depth layers (.orb-par / .veil-par) that counter-drift
   the page, and an emerald-family palette crossfade per section.

   Budget: desktop + fine pointer only, DPR capped at 1.5, paused while
   the tab is hidden, O(visible²) links, no blur passes. Under
   prefers-reduced-motion the whole engine stays still.
   ================================================================ */

// per-section ribbon palettes — strictly the site's emerald family
// (mint / emerald / neon / teal / deep). No new hues.
const PALETTES = {
  top:        [[167, 243, 208], [0, 229, 153]],
  storyboard: [[167, 243, 208], [45, 212, 191]],
  vision:     [[45, 212, 191], [167, 243, 208]],
  infinity:   [[0, 255, 135], [45, 212, 191]],
  domains:    [[45, 212, 191], [0, 229, 153]],
  featured:   [[16, 185, 129], [6, 95, 70]],
  showcase:   [[0, 229, 153], [45, 212, 191]],
  work:       [[167, 243, 208], [0, 229, 153]],
  goals:      [[0, 255, 135], [0, 229, 153]],
  stack:      [[45, 212, 191], [167, 243, 208]],
  about:      [[167, 243, 208], [45, 212, 191]],
  journey:    [[0, 229, 153], [0, 255, 135]],
  contact:    [[0, 255, 135], [167, 243, 208]],
};

const SECTIONS = [
  ['#top', 'top'], ['#storyboard', 'storyboard'], ['#vision', 'vision'],
  ['#infinity', 'infinity'], ['#domains', 'domains'], ['#featured', 'featured'],
  ['#showcase', 'showcase'], ['#work', 'work'], ['#goals', 'goals'],
  ['#stack', 'stack'], ['#about', 'about'], ['#journey', 'journey'],
  ['#contact', 'contact'],
];

// ribbon bands: y = base height fraction · amp = wave amplitude (fraction of
// viewport height) · thick = band width · speed = flow · par = how strongly
// page progress lifts the band · mix = blend point between palette colors
const RIBBONS = [
  { y: 0.22, amp: 0.055, thick: 0.17, speed: 0.16, alpha: 0.085, par: 0.10, mix: 0.30 },
  { y: 0.50, amp: 0.075, thick: 0.22, speed: 0.11, alpha: 0.065, par: 0.18, mix: 0.65 },
  { y: 0.78, amp: 0.060, thick: 0.18, speed: 0.09, alpha: 0.055, par: 0.26, mix: 1.00 },
];

const TINT0 = PALETTES.top;

const rgba = (c, a) =>
  `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
const lerpRGB = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

export default function Background({ routeKey = '/' }) {
  const canvas = useRef(null);
  const desktop = useDesktop();
  // live palette — tweened by ScrollTrigger, read by the canvas each frame
  const tint = useRef({
    ar: TINT0[0][0], ag: TINT0[0][1], ab: TINT0[0][2],
    br: TINT0[1][0], bg: TINT0[1][1], bb: TINT0[1][2],
  });

  // canvas engine — aurora + constellation + comets
  useEffect(() => {
    const c = canvas.current;
    const coarse = matchMedia('(pointer: coarse)').matches;
    if (!c || prefersReduce() || coarse || !desktop) { if (c) c.style.display = 'none'; return; }
    c.style.display = '';
    const ctx = c.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

    let w = 0, h = 0, fieldH = 1, raf = 0, time = 0;
    let particles = [];
    const comets = [];
    const pointer = { x: -9999, y: -9999, sx: 0 };
    let visible = !document.hidden;
    let lastY = 0, lastT = 0;
    let energy = 0;    // smoothed scroll velocity, 0..1
    let dir = 1;       // 1 = scrolling down, -1 = up
    let cometCd = 1.2; // comet cooldown (s)

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      c.width = Math.round(w * DPR); c.height = Math.round(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      fieldH = h * 2.4;
      const count = Math.min(90, Math.round((w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * fieldH,
        z: 0.45 + Math.random() * 0.85,
        vx: 0, vy: 0,
        tw: Math.random() * Math.PI * 2,
      }));
      lastY = window.scrollY;
    };

    const draw = (now) => {
      if (!visible) { raf = 0; return; }
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
      lastT = now; time += dt;

      // ---- scroll signal ----
      const y = window.scrollY;
      const delta = y - lastY;
      if (delta > 0.5) dir = 1; else if (delta < -0.5) dir = -1;
      lastY = y;
      const target = Math.min(1, Math.abs(delta) / dt / 2600);
      energy += (target - energy) * Math.min(1, dt * (target > energy ? 7 : 2.2));
      const progress = y / Math.max(1, document.documentElement.scrollHeight - h);
      pointer.sx += ((pointer.x < -1000 ? 0 : (pointer.x / w) * 2 - 1) - pointer.sx) * Math.min(1, dt * 3);

      const A = [tint.current.ar, tint.current.ag, tint.current.ab];
      const B = [tint.current.br, tint.current.bg, tint.current.bb];

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      // ---- aurora dome: overhead glow that breathes with velocity ----
      const domeX = w * 0.5 + pointer.sx * w * 0.06;
      const dome = ctx.createRadialGradient(domeX, -h * 0.15, 0, domeX, -h * 0.15, h * 0.95);
      dome.addColorStop(0, rgba(A, 0.05 + energy * 0.09));
      dome.addColorStop(0.55, rgba(A, 0.018 + energy * 0.04));
      dome.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = dome;
      ctx.fillRect(0, 0, w, h);

      // ---- aurora ribbons ----
      const NP = 9, x0 = -120, stepX = (w + 240) / (NP - 1);
      for (let r = 0; r < RIBBONS.length; r++) {
        const rb = RIBBONS[r];
        const col = lerpRGB(A, B, rb.mix);
        const t = time * rb.speed * (1 + energy * 1.8);
        const drift = -progress * h * 0.34 * rb.par + dir * energy * h * 0.06 * rb.par;
        const amp = h * rb.amp * (1 + energy * 0.45);
        const lw = h * rb.thick;
        const px = pointer.sx * w * 0.02 * (1 + rb.par);
        const pts = [];
        for (let i = 0; i < NP; i++) {
          const n = Math.sin(i * 1.31 + t * 2.1 + r * 2.4) * 0.6
                  + Math.sin(i * 0.53 - t * 1.13 + r * 1.7) * 0.4;
          pts.push([x0 + i * stepX + px, rb.y * h + drift + n * amp]);
        }
        const yc = (pts[0][1] + pts[NP - 1][1]) / 2;
        const g = ctx.createLinearGradient(0, yc - lw * 0.5, 0, yc + lw * 0.5);
        const a = rb.alpha * (1 + energy * 1.5);
        g.addColorStop(0, rgba(col, 0));
        g.addColorStop(0.5, rgba(col, a));
        g.addColorStop(1, rgba(col, 0));
        ctx.strokeStyle = g;
        ctx.lineWidth = lw;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < NP - 1; i++) {
          ctx.quadraticCurveTo(
            pts[i][0], pts[i][1],
            (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2,
          );
        }
        ctx.lineTo(pts[NP - 1][0], pts[NP - 1][1]);
        ctx.stroke();
      }

      // ---- comets: released by fast scrolling ----
      cometCd -= dt;
      if (energy > 0.5 && cometCd <= 0 && comets.length < 4) {
        comets.push({
          x: w * (0.12 + Math.random() * 0.76),
          y: h * (0.08 + Math.random() * 0.5),
          vx: (Math.random() - 0.5) * 280,
          vy: dir * (560 + Math.random() * 460),
          life: 1,
        });
        cometCd = 0.9 + Math.random() * 1.3;
        energy *= 0.82; // the comet spends the burst that spawned it
      }
      for (let i = comets.length - 1; i >= 0; i--) {
        const cm = comets[i];
        cm.x += cm.vx * dt; cm.y += cm.vy * dt; cm.life -= dt / 0.85;
        if (cm.life <= 0 || cm.y < -80 || cm.y > h + 80) { comets.splice(i, 1); continue; }
        const a = cm.life;
        const tx = cm.x - cm.vx * 0.11, ty = cm.y - cm.vy * 0.11;
        const g = ctx.createLinearGradient(tx, ty, cm.x, cm.y);
        g.addColorStop(0, rgba(A, 0));
        g.addColorStop(1, `rgba(214,255,239,${(0.55 * a).toFixed(3)})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(cm.x, cm.y); ctx.stroke();
        ctx.fillStyle = `rgba(230,255,246,${(0.85 * a).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(cm.x, cm.y, 1.6, 0, Math.PI * 2); ctx.fill();
      }

      // ---- constellation: depth parallax from absolute scroll ----
      const scrollOff = y * 0.22;
      const vis = [];
      for (const p of particles) {
        const py = ((p.y - scrollOff * p.z) % fieldH + fieldH) % fieldH;
        if (py > h + 40 || py < -40) continue;
        const dx = p.x - pointer.x, dy = py - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22500 && d2 > 0.01) { // 150px repulsion field
          const d = Math.sqrt(d2);
          const f = ((150 - d) / 150) * 3200 * dt;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        const drag = Math.pow(0.35, dt);
        p.vx *= drag; p.vy *= drag;
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
        p.y = ((p.y % fieldH) + fieldH) % fieldH;
        vis.push([p.x, py, p.z, p.tw]);
      }

      // motion streaks — only while scrolling
      if (energy > 0.04) {
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        for (let i = 0; i < vis.length; i++) {
          const q = vis[i];
          ctx.strokeStyle = rgba(A, 0.16 * energy * (0.5 + q[2] * 0.5));
          const len = energy * q[2] * 30;
          ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(q[0], q[1] - dir * len); ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = 'source-over';

      // links — visible pairs only
      for (let i = 0; i < vis.length; i++) {
        const a = vis[i];
        for (let j = i + 1; j < vis.length; j++) {
          const b = vis[j];
          const dx = a[0] - b[0], dy = a[1] - b[1];
          const d2 = dx * dx + dy * dy;
          if (d2 > 19600) continue; // 140²
          const d = Math.sqrt(d2);
          ctx.strokeStyle = rgba(A, (1 - d / 140) * (0.10 + energy * 0.16));
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        }
      }

      // dots — twinkling, palette-mixed by depth
      for (let i = 0; i < vis.length; i++) {
        const q = vis[i];
        const twk = 0.75 + Math.sin(time * 2.2 + q[3]) * 0.25;
        ctx.fillStyle = rgba(lerpRGB(A, B, (q[2] - 0.45) / 0.85), 0.30 + q[2] * 0.35);
        ctx.beginPath();
        ctx.arc(q[0], q[1], (0.7 + q[2] * 1.1) * twk, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => { pointer.x = e.clientX; pointer.y = e.clientY; };
    const onLeave = () => { pointer.x = -9999; pointer.y = -9999; };
    const onVis = () => {
      visible = !document.hidden;
      if (visible && !raf) { lastT = performance.now(); raf = requestAnimationFrame(draw); }
    };

    resize();
    lastT = performance.now();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [desktop]);

  // palette crossfade + depth parallax — (re)armed per route so triggers
  // always point at live sections; skipped entirely under reduced motion
  useEffect(() => {
    if (prefersReduce()) return;
    const ctx = gsap.context(() => {
      const t = tint.current;
      let wired = 0;
      SECTIONS.forEach(([sel, key]) => {
        const el = document.querySelector(sel);
        if (!el) return;
        wired++;
        const [a, b] = PALETTES[key];
        const apply = () => gsap.to(t, {
          ar: a[0], ag: a[1], ab: a[2], br: b[0], bg: b[1], bb: b[2],
          duration: 1.6, ease: 'power2.out', overwrite: 'auto',
        });
        ScrollTrigger.create({
          trigger: el, start: 'top 62%', end: 'bottom 38%',
          onEnter: apply, onEnterBack: apply,
        });
      });
      if (!wired) {
        // non-home route (story / 404) — settle back to the default palette
        gsap.to(t, {
          ar: TINT0[0][0], ag: TINT0[0][1], ab: TINT0[0][2],
          br: TINT0[1][0], bg: TINT0[1][1], bb: TINT0[1][2],
          duration: 1.2, ease: 'power2.out', overwrite: 'auto',
        });
      }

      // depth parallax — wrappers counter-drift the page (transform only)
      const scr = () => ({
        trigger: 'body', start: 'top top', end: 'bottom bottom',
        scrub: true, invalidateOnRefresh: true,
      });
      gsap.utils.toArray('.orb-par').forEach((el, i) =>
        gsap.to(el, { yPercent: 9 + i * 7, ease: 'none', scrollTrigger: scr() }));
      gsap.utils.toArray('.veil-par').forEach((el, i) =>
        gsap.fromTo(el, { yPercent: -6 + i * 4 }, { yPercent: 8 - i * 4, ease: 'none', scrollTrigger: scr() }));
    });
    return () => ctx.revert();
  }, [routeKey]);

  return (
    <>
      <canvas id="techCanvas" ref={canvas} aria-hidden="true" />
      <div className="aurora-veils" aria-hidden="true">
        <div className="veil-par"><div className="veil veil--1" /></div>
        <div className="veil-par"><div className="veil veil--2" /></div>
        <div className="veil-par"><div className="veil veil--3" /></div>
      </div>
      <div className="scanlines" aria-hidden="true" />
      <div className="bg-mesh" aria-hidden="true">
        <div className="orb-par orb-par--1"><div className="orb orb--1" /></div>
        <div className="orb-par orb-par--2"><div className="orb orb--2" /></div>
        <div className="orb-par orb-par--3"><div className="orb orb--3" /></div>
        <div className="grid-fade" />
      </div>
    </>
  );
}
