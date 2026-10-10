import { useEffect, useRef } from 'react';
import { prefersReduce } from '../hooks/useCountUp';

// Custom cursor: an instant emerald dot + a tight trailing ring. Both track
// the pointer itself 1:1 — no magnetic snap to element centers, no blend
// modes — so the cursor never feels detached or laggy. The ring converges in
// ~3 frames (fast follow, not a slow glide) and only grows over interactive
// elements. Desktop (fine pointer) only — touch and reduced-motion users keep
// the native cursor.
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const fineMQ = matchMedia('(pointer: fine)');
    const bigMQ = matchMedia('(min-width: 901px)');

    const setup = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!fineMQ.matches || !bigMQ.matches || prefersReduce() || !dot || !ring) return undefined;

      document.documentElement.classList.add('fx-cursor');

      let mx = innerWidth / 2;
      let my = innerHeight / 2;
      let rx = mx;
      let ry = my;
      let raf = 0;
      let running = false;

      const place = (el, x, y) => {
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      };

      const onMove = (e) => {
        mx = e.clientX;
        my = e.clientY;
        place(dot, mx, my); // dot: exact 1:1, zero lag
      };

      const loop = () => {
        if (!running) return;
        const dx = mx - rx;
        const dy = my - ry;
        // skip the write once settled — no pointless style churn when idle
        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
          rx += dx * 0.5;
          ry += dy * 0.5;
          place(ring, rx, ry);
        }
        raf = requestAnimationFrame(loop);
      };
      const start = () => { if (!running) { running = true; raf = requestAnimationFrame(loop); } };
      const stop = () => { running = false; cancelAnimationFrame(raf); };
      // hidden tabs burn no CPU on an invisible cursor
      const onVis = () => (document.hidden ? stop() : start());

      // hover state only grows the ring — the ring stays on the pointer
      const onOver = (e) => {
        const hit = e.target.closest?.(
          'a, button, [data-cursor], input, textarea, select, .card, .shot, .domain, .tl'
        );
        document.body.classList.toggle('cursor-hover', Boolean(hit));
      };

      document.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('mouseover', onOver, { passive: true });
      document.addEventListener('visibilitychange', onVis);
      place(dot, mx, my);
      place(ring, rx, ry);
      start();

      return () => {
        stop();
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseover', onOver);
        document.removeEventListener('visibilitychange', onVis);
        document.documentElement.classList.remove('fx-cursor');
        document.body.classList.remove('cursor-hover');
      };
    };

    let teardown = setup();
    // resize / orientation / docked-devtools can flip pointer + width —
    // re-evaluate instead of going stale
    const recheck = () => { teardown?.(); teardown = setup(); };
    fineMQ.addEventListener('change', recheck);
    bigMQ.addEventListener('change', recheck);
    return () => {
      fineMQ.removeEventListener('change', recheck);
      bigMQ.removeEventListener('change', recheck);
      teardown?.();
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}
