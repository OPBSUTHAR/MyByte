import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { prefersReduce } from '../hooks/useCountUp';
import { useScrollLock, useTopmostEscape } from '../hooks/useScrollLock';

// Zero-dependency emerald confetti burst for the V.I.P. hire modal.
function ConfettiBurst() {
  const canvas = useRef(null);
  const reduced = prefersReduce();
  useEffect(() => {
    if (reduced) return;
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const COLORS = ['#00FF87', '#00E599', '#FFFFFF', '#34D399'];
    let w, h, parts, raf = 0;
    const t0 = performance.now();
    const resize = () => { w = c.width = innerWidth; h = c.height = innerHeight; };
    const spawn = () => Array.from({ length: 130 }, () => ({
      x: w / 2 + (Math.random() - 0.5) * 120,
      y: h * 0.42,
      vx: (Math.random() - 0.5) * 11,
      vy: Math.random() * -9 - 2,
      s: Math.random() * 7 + 3,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      c: COLORS[(Math.random() * COLORS.length) | 0],
    }));
    const step = (t) => {
      const age = (t - t0) / 1400;
      if (age >= 1) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.vy += 0.28;
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save();
        ctx.globalAlpha = 1 - age;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        ctx.restore();
      }
      raf = requestAnimationFrame(step);
    };
    resize();
    parts = spawn();
    raf = requestAnimationFrame(step);
    addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); };
  }, [reduced]);
  if (reduced) return null;
  return <canvas ref={canvas} className="confetti-burst" aria-hidden="true" />;
}

const EMAIL = 'omprakashsuthar.os974660@gmail.com';

// V.I.P. hire modal (sudo hire) + origin dev-log modal (traveler ×3).
export default function SecretModal({ kind, onClose, onGoContact }) {
  const [copied, setCopied] = useState(false);
  useScrollLock(true);
  useTopmostEscape(true, onClose);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard unavailable */ }
  };

  const hire = kind === 'hire';

  return (
    <AnimatePresence>
      <motion.div
        className="overlay-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog" aria-modal="true" aria-label={hire ? 'V.I.P. collaboration' : 'Origin log'}
      >
        {hire && <ConfettiBurst />}
        <motion.div
          className="secret-card"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="secret-card__eyebrow">{hire ? 'SECRET 01 — V.I.P. ACCESS GRANTED' : 'SECRET 05 — ∞ ORIGIN LOG'}</div>
          <h2>{hire ? 'You typed the magic words.' : 'Three taps on the loop.'}</h2>
          {hire ? (
            <>
              <p className="muted">
                <b>sudo hire</b> accepted — Omprakash is already hired by the problem,
                but there's always room for one more impossible build. Priority lane:
                skip the queue, land straight in the inbox.
              </p>
              <div className="secret-card__actions">
                <button type="button" className="btn btn--primary" onClick={onGoContact} autoFocus>Open contact ↓</button>
                <button type="button" className="btn btn--ghost" onClick={copy}>{copied ? '✓ Copied' : 'Copy email'}</button>
                <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
              </div>
            </>
          ) : (
            <>
              <div className="secret-card__log">
                <p><span>› 2024 —</span> First Git repo. On-campus BCA, off-campus curiosity.</p>
                <p><span>› 2025 —</span> JS mastery era: state, storage, polish. Ship after ship.</p>
                <p><span>› 2026 —</span> AI + systems depth: OCR, NLP, satellites, Pure C servers.</p>
                <p><span>› ∞ —</span> Eight elements, one loop. Research → Prototype → Ship → Iterate.</p>
              </div>
              <div className="secret-card__actions">
                <button type="button" className="btn btn--primary" onClick={onClose} autoFocus>Back to the loop ∞</button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
