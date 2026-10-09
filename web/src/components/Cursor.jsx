import { useEffect, useRef } from 'react';
import { prefersReduce } from '../hooks/useCountUp';

// Custom cursor: an instant dot + a lerped ring. Both use mix-blend-mode:
// difference so they invert whatever they hover. The ring expands over
// interactive elements and magnetically snaps toward the element's center.
// Desktop (fine pointer) only — touch devices and reduced-motion users keep
// the native cursor.
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const fine = matchMedia('(pointer: fine)').matches;
    const big = matchMedia('(min-width: 901px)').matches;
    if (!fine || !big || prefersReduce()) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add('fx-cursor');

    let mx = innerWidth / 2;
    let my = innerHeight / 2;
    let tx = mx; // ring target (snaps to element center when hovering)
    let ty = my;
    let rx = mx;
    let ry = my;
    let raf;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    };

    const loop = () => {
      const hovering = document.body.classList.contains('cursor-hover');
      const ease = hovering ? 0.34 : 0.16; // magnetic snap is faster
      rx += (tx - rx) * ease;
      ry += (ty - ry) * ease;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e) => {
      const hit = e.target.closest?.(
        'a, button, [data-cursor], input, textarea, select, .card, .shot, .domain, .tl'
      );
      document.body.classList.toggle('cursor-hover', Boolean(hit));
      if (hit) {
        const r = hit.getBoundingClientRect();
        // magnetic snap: ring glides to the element center
        tx = r.left + r.width / 2;
        ty = r.top + r.height / 2;
      } else {
        tx = mx;
        ty = my;
      }
    };

    const onLeave = () => {
      document.body.classList.remove('cursor-hover');
      tx = mx;
      ty = my;
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.classList.remove('fx-cursor');
      document.body.classList.remove('cursor-hover');
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}
