// Minimal canvas confetti — zero dependency. Spawns a burst of particles
// from a point (default: viewport center-top), gravity + drag, auto-cleanup.

let canvas = null;
let ctx = null;
let parts = [];
let raf = null;

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:12000';
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; };
  resize();
  addEventListener('resize', resize);
}

const COLORS = ['#C2FF04', '#06b6d4', '#FF6B00', '#7c3aed', '#f59e0b', '#EAE8E1'];

export function confettiBurst({ x = innerWidth / 2, y = innerHeight * 0.3, count = 90, spread = Math.PI * 2, power = 11 } = {}) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  ensureCanvas();
  for (let i = 0; i < count; i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * spread;
    const v = power * (0.5 + Math.random() * 0.8);
    parts.push({
      x, y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      w: 4 + Math.random() * 6,
      h: 6 + Math.random() * 8,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      life: 1,
      decay: 0.008 + Math.random() * 0.01,
    });
  }
  if (!raf) tick();
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const dpr = devicePixelRatio;
  parts = parts.filter((p) => p.life > 0 && p.y < canvas.height + 40);
  for (const p of parts) {
    p.vy += 0.22 * dpr;
    p.vx *= 0.992;
    p.vy *= 0.992;
    p.x += p.vx;
    p.y += p.vy;
    p.r += p.vr;
    p.life -= p.decay;
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.translate(p.x * dpr, p.y * dpr);
    ctx.rotate(p.r);
    ctx.fillStyle = p.c;
    ctx.fillRect((-p.w / 2) * dpr, (-p.h / 2) * dpr, p.w * dpr, p.h * dpr);
    ctx.restore();
  }
  if (parts.length) {
    raf = requestAnimationFrame(tick);
  } else {
    raf = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
