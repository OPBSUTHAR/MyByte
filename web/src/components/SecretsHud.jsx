import { AnimatePresence, motion } from 'motion/react';

// Minimal secrets HUD: bottom-right progress chip + unlock toast.
// Pure Motion/CSS — no scroll, no timers beyond the toast (owned by engine).
export default function SecretsHud({ count, total, toast }) {
  return (
    <>
      <div className="secrets-hud" aria-label={`${count} of ${total} secrets discovered`}>
        <span className="secrets-hud__label">SECRETS</span>
        <span className="secrets-hud__count">{count}/{total}</span>
        <span className="secrets-hud__bar" aria-hidden="true">
          <i style={{ transform: `scaleX(${count / total})` }} />
        </span>
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            className="secret-toast"
            key={`${toast.id}-${count}`}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            role="status"
          >
            <span className="secret-toast__key">SECRET UNLOCKED</span>
            <b>{toast.label}</b>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
