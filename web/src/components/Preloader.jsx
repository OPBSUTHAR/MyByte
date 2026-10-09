import { useEffect, useRef, useState } from 'react';
import { prefersReduce } from '../hooks/useCountUp';

// ~1s terminal "compile" preloader. Lines stream in, then the whole panel
// fades out and hands off to the hero intro timeline. Reduced-motion users
// skip straight through.

const LINES = [
  '$ python build.py --deploy my-byte',
  '▸ hydrating 42 repos ✓ — 0 errors',
  '▸ gsap ✓  lenis ✓  motion ✓  splittype ✓',
  '▸ compiling nybyte.py … done in 0.8s',
  '▶ DEPLOY READY — https://my-byte.vercel.app',
];

export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (prefersReduce()) {
      setCount(LINES.length);
      doneRef.current();
      return () => { document.body.style.overflow = ''; };
    }
    let i = 0;
    let t1, t2, t3;
    const tick = () => {
      i += 1;
      setCount(i);
      if (i < LINES.length) {
        t1 = setTimeout(tick, 105 + Math.random() * 55);
      } else {
        t2 = setTimeout(() => setLeaving(true), 190);
        t3 = setTimeout(() => doneRef.current(), 620);
      }
    };
    t1 = setTimeout(tick, 160);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className={`preloader ${leaving ? 'preloader--out' : ''}`} aria-hidden={leaving}>
      <div className="preloader__box">
        <div className="preloader__bar">
          <span /><span /><span />
          <b>mybyte — compile</b>
          <span className="preloader__right">zsh • edge</span>
        </div>
        <div className="preloader__lines">
          {LINES.slice(0, count).map((l, i) => (
            <div className="preloader__line" key={i}>{l}</div>
          ))}
          <span className="preloader__cursor">▌</span>
        </div>
      </div>
    </div>
  );
}
