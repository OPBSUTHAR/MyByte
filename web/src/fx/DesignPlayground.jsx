import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { prefersReduce } from '../hooks/useCountUp';

// Motionlab "Alchemy" — the same trigger, two spring configs, side by side.
// Declarative Motion vs an explicitly tuned spring — a teaching visual.
export default function DesignPlayground() {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (prefersReduce()) return;
    const id = setInterval(() => setPlaying((p) => !p), 2600);
    return () => clearInterval(id);
  }, []);

  const configs = [
    { label: 'soft', spring: { type: 'spring', stiffness: 170, damping: 16 }, color: '#06b6d4' },
    { label: 'snappy', spring: { type: 'spring', stiffness: 520, damping: 28 }, color: '#7c3aed' },
  ];

  return (
    <div className="lab-card">
      <span className="lab-card__tag">Motion — springs</span>
      <h3>Design playground — tune it live</h3>
      <div style={{ display: 'grid', gap: 14, marginTop: 6 }}>
        {configs.map((c) => (
          <div key={c.label} style={{ position: 'relative', height: 44, borderRadius: 12, background: 'color-mix(in srgb, var(--card2) 60%, transparent)' }}>
            <AnimatePresence>
              <motion.div
                animate={{ left: playing ? 'calc(100% - 44px)' : '0px' }}
                transition={c.spring}
                style={{ position: 'absolute', top: 0, width: 44, height: 44, borderRadius: 12, background: c.color }}
              />
            </AnimatePresence>
            <span style={{ position: 'absolute', right: 8, top: 13, fontSize: '.68rem', color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>{c.label}</span>
          </div>
        ))}
      </div>
      <button className="btn btn--sm" style={{ alignSelf: 'flex-start' }} onClick={() => setPlaying((p) => !p)}>
        {playing ? '⏸ Pause' : '▶ Play'}
      </button>
      <p>One trigger, two spring personalities — the same physics Motion uses everywhere.</p>
    </div>
  );
}
