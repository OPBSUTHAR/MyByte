import { useScramble } from '../hooks/useScramble';

// Brutalist chamfer button with ASCII scramble label + neon flicker on hover.
// Renders <a> when href is given, <button> otherwise.
export default function GlitchButton({ label, href, onClick, className = '', type = 'button' }) {
  const { display, onMouseEnter, onMouseLeave } = useScramble(label);
  const cls = `glitch-btn hover-cyber-flicker ${className}`;
  const inner = (
    <>
      <span className="glitch-btn__pulse" aria-hidden="true" />
      <span className="glitch-btn__label">{display}</span>
    </>
  );
  if (href) {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href} className={cls} onClick={onClick}
        onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
        {...(external ? { target: '_blank', rel: 'noopener' } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {inner}
    </button>
  );
}
