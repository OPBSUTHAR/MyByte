import { motion } from 'motion/react';
import { prefersReduce } from '../hooks/useCountUp';

// Tactile motion-theme switch — a physical sliding knob with spring
// inertia. data-on = light theme. The whole DOM re-tints via CSS vars.
export default function ThemeToggle({ theme, onToggle }) {
  const on = theme === 'light';
  return (
    <button
      type="button"
      className="switch"
      data-on={on}
      aria-label={on ? 'Switch to dark theme' : 'Switch to light theme'}
      aria-pressed={on}
      onClick={onToggle}
    >
      <motion.span
        className="switch__knob"
        initial={false}
        animate={{ x: on ? 24 : 0 }}
        transition={prefersReduce()
          ? { duration: 0 }
          : { type: 'spring', stiffness: 550, damping: 28, mass: 0.9 }}
      />
      <span className="switch__icon switch__icon--moon" aria-hidden="true">☾</span>
      <span className="switch__icon switch__icon--sun" aria-hidden="true">☀</span>
    </button>
  );
}
