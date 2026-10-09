import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { prefersReduce } from '../hooks/useCountUp';

// nybyte.py — floating code window with:
//  • 3D pointer tilt (parallax rotate + glow that follows the cursor)
//  • line-by-line "typing", then a compile flash, then LIVE badges
//  • softly pulsing LIVE PREVIEWS / BHARAT-READY status pills

const LINES = [
  [['c', '# ∞ — 8 elements → loop → polish → ship']],
  [['k', 'class'], ['n', ' MyByte'], ['n', ':']],
  [['k', '    symbol'], ['n', ' = '], ['s', '"∞"'], ['c', '   # infinite loop — my life symbol']],
  [['k', '    elements'], ['n', ' = ['], ['s', '"Land"'], ['n', ', '], ['s', '"Infra"'], ['n', ', '], ['s', '"Power"'], ['n', ', '], ['s', '"AI"'], ['n', ', '], ['s', '"Agri"'], ['n', ', '], ['s', '"Space"'], ['n', ', '], ['s', '"Move"'], ['n', ', '], ['s', '"Ocean"'], ['n', ']']],
  [['k', '    cost'], ['n', ' = '], ['s', '"≤30KB • offline-first • frugal • ∞"']],
  [['k', '    def'], ['n', ' ship(self, idea):']],
  [['k', '        return'], ['n', ' idea.loop().polished().deployed()'], ['c', '  # ∞']],
  [['n', 'print'], ['n', '(MyByte().ship'], ['s', '(your_problem)'], ['n', ')'], ['c', '   → ∞ shipped']],
];

export default function CodeCard({ ready, startDelay = 300 }) {
  const cardRef = useRef(null);
  const [lineIdx, setLineIdx] = useState(0);
  const [phase, setPhase] = useState('typing'); // typing → compiling → live
  const [secs, setSecs] = useState(0);

  // typing → compiling → live (starts once the hero is visible)
  useEffect(() => {
    if (!ready) return;
    if (prefersReduce()) {
      setLineIdx(LINES.length);
      setPhase('live');
      setSecs(0.8);
      return;
    }
    let i = 0;
    let t;
    const tick = () => {
      i += 1;
      setLineIdx(i);
      if (i < LINES.length) {
        t = setTimeout(tick, 120 + Math.random() * 90);
      } else {
        setPhase('compiling');
        const started = performance.now();
        const count = setInterval(() => {
          const v = (performance.now() - started) / 1000;
          setSecs(Math.min(0.8, v));
          if (v >= 0.8) {
            clearInterval(count);
            setSecs(0.8);
            setPhase('live');
          }
        }, 60);
        return () => clearInterval(count);
      }
    };
    t = setTimeout(tick, startDelay);
    return () => clearTimeout(t);
  }, [ready, startDelay]);

  // 3D tilt on pointer move (parallax), disabled for touch / reduced motion
  useEffect(() => {
    const card = cardRef.current;
    if (!card || prefersReduce() || matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      card.style.setProperty('--mx', `${((px + 1) / 2 * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${((py + 1) / 2 * 100).toFixed(1)}%`);
      gsap.to(card, {
        rotateY: px * 9,
        rotateX: -py * 9,
        y: -5,
        scale: 1.02,
        transformPerspective: 1000,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };
    const onLeave = () => {
      gsap.to(card, {
        rotateX: 0, rotateY: 0, y: 0, scale: 1,
        duration: 0.9,
        ease: 'elastic.out(1, 0.55)',
        overwrite: 'auto',
      });
    };
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
    return () => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const live = phase === 'live';
  const typing = phase === 'typing';

  return (
    <div className={`glass-card code-card tilt tilt--3d ${live ? 'code-card--live' : ''}`} ref={cardRef} data-cursor="code">
      <div className="code-card__bar">
        <span /><span /><span />
        <b>{live ? 'nybyte.py — ✓ compiled in 0.8s' : typing ? 'nybyte.py — typing…' : 'nybyte.py — compiling…'}</b>
        <span className="bar__right">● Python • edge • shipped</span>
      </div>

      <pre className="code-card__pre" aria-label="nybyte.py — MyByte build script">
        <code>
          {LINES.slice(0, lineIdx).map((segs, i) => (
            <span className="cc-line" key={i}>
              {segs.map(([cls, txt], j) => (
                <span className={cls} key={j}>{txt}</span>
              ))}
              {'\n'}
            </span>
          ))}
          {typing && lineIdx < LINES.length && (
            <span className="cc-line cc-line--ghost" aria-hidden="true">
              <span className="cc-caret">▌</span>
            </span>
          )}
        </code>
      </pre>

      <div className="code-card__foot">
        <span className={`badge-pill badge-pill--live ${live ? 'is-on' : ''}`}>
          <i /> Live previews
        </span>
        <span className={`badge-pill badge-pill--bharat ${live ? 'is-on' : ''}`}>
          <i /> Bharat-ready
        </span>
        <span className="foot-counter">
          {typing ? `${lineIdx}/${LINES.length} lines` : live ? '0.8s compile ✓' : `compiling ${secs.toFixed(1)}s`}
        </span>
      </div>

      <div className="code-glow" />
    </div>
  );
}
