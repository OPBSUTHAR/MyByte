import { useEffect, useRef } from 'react';

export const prefersReduce = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// One shared dynamic import — 4 stats no longer fire 4 duplicate imports.
let motionPromise = null;
const getAnimate = () => {
  if (!motionPromise) motionPromise = import('motion').then((m) => m.animate);
  return motionPromise;
};

/**
 * Count-up number. Starts only when the element scrolls into view (stats sit
 * below the fold / behind the preloader at mount), so users actually see the
 * animation and we don't pay for 4 concurrent offscreen updates.
 */
export function useCountUp(target, { duration = 1.4 } = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduce()) { el.textContent = String(target); return; }
    let controls;
    let cancelled = false;
    const obs = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      obs.disconnect();
      getAnimate().then((animate) => {
        if (cancelled || !animate) { el.textContent = String(target); return; }
        controls = animate(0, target, {
          duration,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: (v) => { el.textContent = String(Math.round(v)); },
          onComplete: () => { el.textContent = String(target); },
        });
      }).catch(() => { el.textContent = String(target); });
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => { cancelled = true; obs.disconnect(); controls?.stop?.(); };
  }, [target, duration]);
  return ref;
}
