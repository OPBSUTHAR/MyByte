import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReduce } from './useCountUp';

// ASCII scramble engine (Elvis-Mao style decode effect). Characters resolve
// left → right through matrix glyphs. rAF-driven, cleaned up on unmount,
// static text under prefers-reduced-motion.
export const GLYPHS = '█▓▒░<>/\\|[]{}=+*^?#_01X%@';

function renderFrame(finalText, progress) {
  const n = Math.floor(progress * finalText.length);
  let out = '';
  for (let i = 0; i < finalText.length; i++) {
    const ch = finalText[i];
    out += (ch === ' ' || i < n) ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
  }
  return out;
}

// imperative scramble for delegated hover targets (table tags)
export function scrambleTo(el, finalText, dur = 550) {
  if (!el) return () => {};
  if (prefersReduce() || el._scramble) {
    if (!el._scramble) el.textContent = finalText;
    return () => {};
  }
  el._scramble = true;
  let raf = 0;
  const t0 = performance.now();
  const step = (t) => {
    const p = Math.min(1, (t - t0) / dur);
    el.textContent = renderFrame(finalText, p);
    if (p < 1) {
      raf = requestAnimationFrame(step);
    } else {
      el.textContent = finalText;
      el._scramble = false;
    }
  };
  raf = requestAnimationFrame(step);
  return () => { cancelAnimationFrame(raf); el._scramble = false; };
}

export function useScramble(text) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef(0);
  useEffect(() => setDisplay(text), [text]);
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);
  const start = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (prefersReduce()) { setDisplay(text); return; }
    const t0 = performance.now();
    const dur = 550;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      setDisplay(renderFrame(text, p));
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = 0;
        setDisplay(text);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [text]);
  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    setDisplay(text);
  }, [text]);
  return { display, onMouseEnter: start, onMouseLeave: reset };
}
