import { useEffect, useLayoutEffect, useRef } from 'react';

export const prefersReduce = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Count-up number driven by Motion's imperative `animate`.
 * Falls back to the final value when Motion is missing / reduced-motion.
 */
export function useCountUp(target, { duration = 1.4 } = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduce()) { el.textContent = String(target); return; }
    let controls;
    let cancelled = false;
    import('motion').then(({ animate }) => {
      if (cancelled) return;
      const obj = { v: 0 };
      controls = animate(obj.v, target, {
        duration,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: () => { el.textContent = Math.round(obj.v); },
        onComplete: () => { el.textContent = String(target); },
      });
    });
    return () => { cancelled = true; controls?.stop?.(); };
  }, [target, duration]);
  return ref;
}
