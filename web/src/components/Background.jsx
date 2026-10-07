import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReduce } from '../hooks/useCountUp';

gsap.registerPlugin(ScrollTrigger);

// Port of the static site's canvas particle network, plus GSAP orb parallax.
export default function Background() {
  const canvas = useRef(null);

  // particle field
  useEffect(() => {
    const c = canvas.current;
    if (!c || prefersReduce()) { if (c) c.style.display = 'none'; return; }
    const ctx = c.getContext('2d');
    let w, h, particles, raf;

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
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.r > 1.2 ? 'rgba(0,255,157,.9)' : 'rgba(6,182,214,.75)';
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 140) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0,255,157,${(1 - d / 140) * 0.16})`;
            ctx.lineWidth = 1; ctx.stroke();
          }
        }
      });
      raf = requestAnimationFrame(step);
    };
    resize(); step();
    addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); };
  }, []);

  // orb scroll parallax
  useEffect(() => {
    if (prefersReduce()) return;
    const tweens = gsap.utils.toArray('.orb').map((orb, i) =>
      gsap.to(orb, {
        yPercent: 12 + i * 7, ease: 'none',
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true },
      }));
    return () => tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
  }, []);

  return (
    <>
      <canvas id="techCanvas" ref={canvas} aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <div className="bg-mesh" aria-hidden="true">
        <div className="orb orb--1" />
        <div className="orb orb--2" />
        <div className="orb orb--3" />
        <div className="grid-fade" />
      </div>
    </>
  );
}
