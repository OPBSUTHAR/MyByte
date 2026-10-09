import { useEffect, useRef } from 'react';
import { useDesktop } from '../hooks/useMediaQuery';

// Flashlight / spotlight — a dark overlay with a soft radial "hole" that
// follows the cursor, so the page feels lit by a moving light. The light
// reveals the background grid and text contrast as it passes. Dark themes
// only; disabled for touch + reduced motion.
export default function Spotlight() {
  const canvasRef = useRef(null);
  const desktop = useDesktop();

  useEffect(() => {
    if (!desktop || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, raf;
    let mx = innerWidth / 2;
    let my = innerHeight / 2;
    let lx = mx, ly = my; // lerped light position
    let active = false;

    const resize = () => {
      const dpr = devicePixelRatio;
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
    };

    const RADIUS = () => Math.min(w, h) * 0.22; // ~250px at dpr 1

    const draw = () => {
      lx += (mx - lx) * 0.12;
      ly += (my - ly) * 0.12;
      ctx.clearRect(0, 0, w, h);
      if (active) {
        const r = RADIUS();
        // dim layer
        ctx.fillStyle = 'rgba(4,5,7,0.34)';
        ctx.fillRect(0, 0, w, h);
        // light hole (punched out of the dim layer)
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, r);
        g.addColorStop(0, 'rgba(0,0,0,1)');
        g.addColorStop(0.55, 'rgba(0,0,0,0.85)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(lx, ly, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        // emerald rim around the light
        ctx.save();
        ctx.strokeStyle = 'rgba(0,229,153,0.16)';
        ctx.lineWidth = 1.5 * devicePixelRatio;
        ctx.beginPath();
        ctx.arc(lx, ly, r * 0.62, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => { mx = e.clientX * devicePixelRatio; my = e.clientY * devicePixelRatio; active = true; };
    const onLeave = () => { active = false; ctx.clearRect(0, 0, w, h); };

    resize();
    draw();
    addEventListener('resize', resize);
    addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [desktop]);

  return <canvas id="spotlight" ref={canvasRef} aria-hidden="true" />;
}
