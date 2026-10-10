import { useScramble } from '../hooks/useScramble';

// Hover-to-decode ASCII text (Elvis-Mao style). Text-only — safe inside
// magnetic buttons, nav links and table rows (no layout, no transforms).
export default function GlitchText({ text, className = '' }) {
  const { display, onMouseEnter, onMouseLeave } = useScramble(text);
  return (
    <span className={`glitch-text ${className}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {display}
    </span>
  );
}
