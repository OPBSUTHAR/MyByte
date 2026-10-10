import { useEffect, useRef } from 'react';
import { prefersReduce } from '../hooks/useCountUp';

// Falling emerald code rain. Esc / click / 30s auto-dismiss. Never mounts
// under prefers-reduced-motion (the terminal says so instead).
export default function MatrixRain({ onClose }) {
  const canvas = useRef(null);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const GLYPHS = 'アイスクリームカタカナ01XYZ<>/\\|[]{}=+*#$%';
    let w, h, cols, drops, raf = 0;
    const size = 14;

    const resize = () => {
      w = c.width = innerWidth;
      h = c.height = innerHeight;
      cols = Math.ceil(w / size);
      drops = Array.from({ length: cols }, () => Math.random() * -40);
    };
    const step = () => {
      ctx.fillStyle = 'rgba(10,13,18,0.08)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${size}px "JetBrains Mono", monospace`;
      for (let i = 0; i < cols; i++) {
        const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        const head = Math.random() < 0.06;
        ctx.fillStyle = head ? '#00FF87' : 'rgba(0,229,153,0.75)';
        ctx.fillText(ch, i * size, drops[i] * size);
        if (drops[i] * size > h && Math.random() > 0.976) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(step);
    };
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    const timer = setTimeout(onClose, 30000);
    resize(); step();
    addEventListener('resize', resize);
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      removeEventListener('resize', resize);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return <canvas ref={canvas} className="matrix-rain" aria-hidden="true" onClick={onClose} />;
}
