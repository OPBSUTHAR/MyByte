import { useEffect } from 'react';
import gsap from 'gsap';
import { prefersReduce } from './useCountUp';

/**
 * Pointer-tracked 3D tilt for any `[data-tilt]` descendants of `ref`.
 * quickTo setters (no per-event tween churn), fine-pointer only, and gated
 * on `data-revealed` so tilt never fights the scroll-reveal intro tween.
 */
export function useTiltGrid(ref, { max = 7 } = {}) {
  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReduce() || matchMedia('(pointer: coarse)').matches) return;
    const els = Array.from(root.querySelectorAll('[data-tilt]'));
    const cleanups = els.map((el) => {
      const rX = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power2.out' });
      const rY = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power2.out' });
      const move = (e) => {
        if (el.dataset.revealed !== '1') return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        gsap.set(el, { transformPerspective: 900 });
        rY(px * max);
        rX(-py * max);
      };
      const leave = () => gsap.to(el, {
        rotationX: 0, rotationY: 0, duration: 0.9,
        ease: 'elastic.out(1, 0.5)', overwrite: 'auto',
      });
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      };
    });
    return () => cleanups.forEach((fn) => fn());
  }, [ref, max]);
}
