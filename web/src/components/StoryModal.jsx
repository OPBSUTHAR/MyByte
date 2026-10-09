import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AncientBook from './AncientBook';

// Full-screen overlay hosting the ancient book. Esc / backdrop / ✕ closes.
export default function StoryModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="overlay-backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog" aria-modal="true" aria-label="Ancient book story"
        >
          <motion.div
            className="story-modal"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="story-modal__head">
              <div>
                <div className="section__eyebrow">Story • Ancient Book — ∞ 8 Elements</div>
                <h2 style={{ margin: '4px 0 0', fontFamily: 'Fraunces,serif', fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
                  Stories as manuscripts
                </h2>
              </div>
              <button className="icon-btn" onClick={onClose} aria-label="Close story">✕</button>
            </div>
            <AncientBook />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
