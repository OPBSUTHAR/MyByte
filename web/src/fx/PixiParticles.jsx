import { useEffect, useRef } from 'react';
import { prefersReduce } from '../hooks/useCountUp';

// PixiJS — GPU-accelerated 2D canvas. Thousands of sprites at 60fps.
export default function PixiParticles({ height = 300, count = 900, label = 'PixiJS • GPU sprites' }) {
  const host = useRef(null);
  useEffect(() => {
    if (!host.current) return;
    let app;
    let disposed = false;
    (async () => {
      const PIXI = await import('pixi.js');
      if (disposed || !host.current) return;
      app = new PIXI.Application();
      await app.init({ width: host.current.clientWidth, height, background: 0x070a14, antialias: true, resolution: Math.min(2, devicePixelRatio || 1) });
      if (disposed) { app.destroy(true); return; }
      host.current.appendChild(app.canvas);

      const palette = [0x06b6d4, 0x7c3aed, 0x22d3ee, 0xf59e0b];
      const sprites = [];
      const sp = new PIXI.Graphics();
      sp.circle(0, 0, 3).fill(0xffffff);
      const tex = app.renderer.generateTexture(sp);

      for (let i = 0; i < count; i++) {
        const s = new PIXI.Sprite(tex);
        s.anchor.set(0.5);
        s.x = Math.random() * app.screen.width;
        s.y = Math.random() * app.screen.height;
        s.tint = palette[i % palette.length];
        s.alpha = 0.35 + Math.random() * 0.5;
        const sc = 0.4 + Math.random() * 1.1;
        s.scale.set(sc);
        s._vx = (Math.random() - 0.5) * 0.6;
        s._vy = (Math.random() - 0.5) * 0.6;
        s._sc = sc;
        sprites.push(s);
        app.stage.addChild(s);
      }

      const spin = prefersReduce();
      app.ticker.add(() => {
        const w = app.screen.width;
        const h = app.screen.height;
        for (const s of sprites) {
          if (!spin) {
            s.x += s._vx; s.y += s._vy;
            if (s.x < 0 || s.x > w) s._vx *= -1;
            if (s.y < 0 || s.y > h) s._vy *= -1;
          }
          s.rotation += 0.004;
        }
      });

      const onResize = () => { if (host.current) app.renderer.resize(host.current.clientWidth, height); };
      window.addEventListener('resize', onResize);
      host.current._onResize = onResize;
    })();

    return () => {
      disposed = true;
      if (host.current?._onResize) window.removeEventListener('resize', host.current._onResize);
      try { app?.destroy(true, { children: true }); } catch { /* noop */ }
    };
  }, [height, count]);

  return (
    <div className="fx-stage" style={{ height }}>
      <div ref={host} style={{ position: 'absolute', inset: 0 }} />
      <span className="fx-stage__label">{label}</span>
      <span className="fx-stage__hint">{count} sprites</span>
    </div>
  );
}
