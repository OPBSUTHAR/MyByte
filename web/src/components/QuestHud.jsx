import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';

// Floating XP HUD — level, progress bar, achievement count. Toast popups for
// level-ups and unlocks. Sits bottom-left, collapses to a pill on mobile.

export default function QuestHud({ quest, visible }) {
  const { xp, level, progress, unlocked, toast } = quest;
  const earned = Object.keys(unlocked).length;
  const barRef = useRef(null);
  const prevLevel = useRef(level.level);

  useEffect(() => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
  }, [progress]);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            className="quest-hud"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <div className="quest-hud__row">
              <span className="quest-hud__level">Lv {level.level}</span>
              <b>{level.title}</b>
            </div>
            <div className="quest-hud__bar"><i ref={barRef} /></div>
            <div className="quest-hud__row quest-hud__meta">
              <span>⚡ {xp} XP</span>
              <span>🏅 {earned}/14</span>
              {level.next && <span>next: {level.next.title}</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className={`quest-toast quest-toast--${toast.kind}`}
            initial={{ opacity: 0, x: -30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
