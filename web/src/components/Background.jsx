import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReduce } from '../hooks/useCountUp';
import { useDesktop } from '../hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger);

// Canvas particle network that reacts to the pointer (repulsion field),
// plus GSAP orb parallax and floating tech-icon chips at different depths.
export default function Background() {
  const canvas = useRef(null);
  const desktop = useDesktop();

  // particle field with pointer repulsion
  useEffect(() => {
    const c = canvas.current;
    if (!c || prefersReduce()) { if (c) c.style.display = 'none'; return; }
    const ctx = c.getContext('2d');
    let w, h, particles, raf;
    const pointer = { x: -9999, y: -9999 };

    const init = () => {
      const count = Math.min(64, Math.round((w * h) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 1.4 + 0.6,
      }));
    };
    const resize = () => { w = c.width = innerWidth; h = c.height = innerHeight; init(); };
    const step = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        // pointer repulsion field
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 160 * 160 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = ((160 - d) / 160) * 0.9;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx *= 0.96; p.vy *= 0.96; // drag so they settle back
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.r > 1.2 ? 'rgba(194,255,4,.9)' : 'rgba(6,182,214,.75)';
        ctx.fill();
      }
      // links
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 140) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(194,255,4,${(1 - d / 140) * 0.14})`;
            ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(step);
    };
    const onMove = (e) => { pointer.x = e.clientX; pointer.y = e.clientY; };
    const onLeave = () => { pointer.x = -9999; pointer.y = -9999; };
    resize(); step();
    addEventListener('resize', resize);
    addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // orb + chip scroll parallax — desktop only, each layer at its own depth
  useEffect(() => {
    if (prefersReduce() || !desktop) return;
    const tweens = gsap.utils.toArray('.orb').map((orb, i) =>
      gsap.to(orb, {
        yPercent: 12 + i * 7, ease: 'none',
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true },
      }));
    const chips = gsap.utils.toArray('.parallax-chip').map((chip) => {
      const depth = Number(chip.dataset.depth || 20);
      return gsap.to(chip, {
        yPercent: depth, ease: 'none',
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true },
      });
    });
    return () => tweens.concat(chips).forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
  }, [desktop]);

  return (
    <>
      <canvas id="techCanvas" ref={canvas} aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <div className="bg-mesh" aria-hidden="true">
        <div className="orb orb--1" />
        <div className="orb orb--2" />
        <div className="orb orb--3" />
        <div className="grid-fade" />
        <span className="parallax-chip" data-depth="-24" style={{ top: '14%', left: '5%' }}>Pure C</span>
        <span className="parallax-chip" data-depth="32" style={{ top: '26%', right: '6%' }}>SGP4</span>
        <span className="parallax-chip" data-depth="-14" style={{ top: '52%', left: '8%' }}>∞ loop</span>
        <span className="parallax-chip" data-depth="22" style={{ top: '64%', right: '9%' }}>SQLite</span>
        <span className="parallax-chip" data-depth="-30" style={{ top: '82%', left: '12%' }}>OCR</span>
      </div>
    </>
  );
}
