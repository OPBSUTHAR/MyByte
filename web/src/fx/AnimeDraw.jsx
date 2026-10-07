import { useEffect, useRef } from 'react';
import { prefersReduce } from '../hooks/useCountUp';

// Anime.js — tiny, chainable, ideal for SVG line-drawing micro-interactions.
export default function AnimeDraw({ height = 220, label = 'Anime.js • SVG draw' }) {
  const ref = useRef(null);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let mod;
    let cancelled = false;
    import('animejs').then((m) => {
      if (cancelled) return;
      const anime = m.default || m;
      mod = anime;
      const paths = host.querySelectorAll('.draw');
      const run = (auto) => {
        paths.forEach((p) => {
          const len = p.getTotalLength ? p.getTotalLength() : 900;
          p.style.strokeDasharray = len;
          p.style.strokeDashoffset = len;
        });
        anime({
          targets: paths,
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: 'easeInOutSine',
          duration: 1400,
          delay: (el, i) => i * 140,
          autoplay: auto,
        });
      };
      run(!prefersReduce());
      host._run = run;
      host.addEventListener('click', () => run(true));
    });
    return () => { cancelled = true; mod?.remove?.(host.querySelectorAll('.draw')); };
  }, []);

  return (
    <div className="fx-anime" ref={ref} style={{ position: 'relative', cursor: 'pointer' }} aria-label="Anime.js line-draw animation">
      <svg viewBox="0 0 400 140" xmlns="http://www.w3.org/2000/svg" height={height}>
        <defs>
          <linearGradient id="animeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
        <path className="draw" d="M 70 70 C 70 18, 168 8, 200 70 C 232 132, 330 122, 330 70 C 330 18, 232 8, 200 70 C 168 132, 70 122, 70 70 Z" fill="none" stroke="url(#animeGrad)" strokeWidth="3.2" strokeLinecap="round" />
        <path className="draw" d="M 40 70 H 360" stroke="color-mix(in srgb, var(--line) 90%, transparent)" strokeWidth="1" strokeDasharray="4 6" />
      </svg>
      <span className="fx-stage__label">{label}</span>
      <span className="fx-stage__hint">click to redraw</span>
    </div>
  );
}
