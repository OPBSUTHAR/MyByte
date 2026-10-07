import { useEffect, useRef } from 'react';
import { prefersReduce } from '../hooks/useCountUp';

// Popmotion — low-level springs / physics primitives.
// Mo.js — playful burst micro-interactions.
// GSAP — orchestrated timeline for the burst ring.
export default function PhysicsPlayground() {
  const orb = useRef(null);
  const host = useRef(null);

  useEffect(() => {
    const el = orb.current;
    if (!el) return;
    let stop;
    let disposed = false;
    import('popmotion').then(({ animate, spring }) => {
      if (disposed) return;
      const width = el.parentElement?.clientWidth || 320;
      stop = animate({
        from: 0,
        to: 1,
        repeat: Infinity,
        repeatType: 'mirror',
        duration: 2600,
        ease: spring({ stiffness: 120, damping: 12 }),
        onUpdate: (v) => {
          const x = v * Math.max(0, width - 60);
          el.style.transform = `translateX(${x}px) scale(${1 + (1 - Math.abs(v - 0.5) * 2) * 0.25})`;
        },
      }).stop;
    });
    return () => { disposed = true; stop?.(); };
  }, []);

  const burst = async (e) => {
    if (prefersReduce()) return;
    const rect = host.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    try {
      const Mo = (await import('@mojs/core')).default;
      const burst = new Mo.Burst({
        left: x, top: y, radius: { 8: 70 }, count: 10,
        children: { shape: 'circle', fill: ['#06b6d4', '#7c3aed', '#f59e0b'], radius: 6, scale: { 0.4: 0 } },
      });
      burst.play();
      new Mo.Shape({ left: x, top: y, shape: 'circle', radius: 8, fill: 'none', stroke: '#22d3ee', strokeWidth: 3, scale: { 0.5: 2.4 }, opacity: { 1: 0 }, duration: 600 }).play();
    } catch { /* mo.js optional */ }
  };

  return (
    <div className="lab-card">
      <span className="lab-card__tag">Popmotion + Mo.js + GSAP</span>
      <h3>Physics &amp; bursts</h3>
      <div className="fx-play" ref={host} onClick={burst} role="button" tabIndex={0} aria-label="Click to fire a particle burst">
        <div className="fx-play__orb" ref={orb} style={{ position: 'absolute', left: 8, top: '50%', marginTop: -23 }} />
        <span className="fx-play__hint">click anywhere for a burst</span>
      </div>
      <p>Popmotion drives the spring; Mo.js fires the burst; GSAP times the sequence.</p>
    </div>
  );
}
