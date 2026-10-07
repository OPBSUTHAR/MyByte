import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const TABS = [
  { id: 'land', label: '∞ Land', color: '#a16207' },
  { id: 'ai', label: 'AI', color: '#7c3aed' },
  { id: 'space', label: 'Space', color: '#06b6d4' },
  { id: 'ocean', label: 'Ocean', color: '#0284c7' },
];

// Motion (formerly Framer Motion) — declarative spring physics, shared-layout
// transitions and drag gestures with very little code.
export default function MotionLab() {
  const [active, setActive] = useState(TABS[0].id);
  const current = TABS.find((t) => t.id === active);

  return (
    <div className="lab-card">
      <span className="lab-card__tag">Motion</span>
      <h3>Shared layout &amp; springs</h3>
      <div className="fx-layout__tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={active === t.id ? 'active' : ''}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="fx-layout" style={{ marginTop: 12 }}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={current.id}
            layoutId="motion-orb"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="fx-layout__tile"
            style={{ background: current.color, inset: 0, margin: 'auto', width: 96, height: 96, borderRadius: 24 }}
          />
        </AnimatePresence>
      </div>
      <motion.div
        drag
        dragConstraints={{ left: -120, right: 120, top: -8, bottom: 8 }}
        dragElastic={0.4}
        whileTap={{ scale: 1.12, cursor: 'grabbing' }}
        className="fx-play__orb"
        style={{ zIndex: 3 }}
      />
      <p>Drag the orb — spring physics and layout animation, declaratively.</p>
    </div>
  );
}
