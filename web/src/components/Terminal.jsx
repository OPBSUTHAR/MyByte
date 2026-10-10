import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { prefersReduce } from '../hooks/useCountUp';

// nybyte.py — interactive CLI window:
//   help · whoami · cat skills · cat secret.txt · sudo hire · run demo
//   matrix · frugal = true|false · clear
// Typing → compiling → live runs on mount (overlapping the preloader, not
// serialized after it). ⟳ in the title bar replays the sequence.
// Secret commands dispatch window `mybyte:secret` events (HUD + modals).

const BANNER = [
  [['c', '# infinite loop — 8 elements, ship, polish']],
  [['k', 'class'], ['n', ' MyByte'], ['n', ':']],
  [['k', '    symbol'], ['n', ' = '], ['s', '"∞"'], ['c', '   # my life symbol']],
  [['k', '    elements'], ['n', ' = ['], ['s', '"Land"'], ['n', ', '], ['s', '"Infra"'], ['n', ', '], ['s', '"Power"'], ['n', ', '], ['s', '"AI"'], ['n', ', '], ['s', '"Agri"'], ['n', ', '], ['s', '"Space"'], ['n', ', '], ['s', '"Move"'], ['n', ', '], ['s', '"Ocean"'], ['n', ']']],
  [['k', '    cost'], ['n', ' = '], ['s', '"≤30KB • offline-first • frugal • ∞"']],
  [['k', '    frugal'], ['n', ' = '], ['s', 'True'], ['c', '   # flip to False… if you dare']],
  [['k', '    def'], ['n', ' ship(self, idea):']],
  [['k', '        return'], ['n', ' idea.loop().polished().deployed()'], ['c', '  # ∞']],
  [['n', 'print'], ['n', '(MyByte().ship'], ['s', '(your_problem)'], ['n', ')'], ['c', '   → ∞ shipped']],
];

const HELP = [
  ['$', 'help', '— this message'],
  ['$', 'whoami', '— about the builder'],
  ['$', 'cat skills', '— the stack, direct from source'],
  ['$', 'cat secret.txt', '— origin log (shhh)'],
  ['$', 'ls', '— what is in this repo'],
  ['$', 'sudo hire', '— try it. seriously.'],
  ['$', 'run demo', '— confetti protocol'],
  ['$', 'matrix', '— rain protocol'],
  ['$', 'frugal = <true|false>', '— toggle the build budget'],
  ['$', 'clear', '— wipe the terminal'],
];

const SKILLS = [
  ['k', 'C'], ['n', ' · '], ['k', 'C++'], ['n', ' · '], ['k', 'Python'], ['n', ' · '], ['k', 'JS/TS'], ['n', ' · '], ['k', 'React'], ['n', ' · '], ['k', 'SQL'], ['n', ' · '], ['k', 'OCR'], ['n', ' · '], ['k', 'SGP4'], ['n', ' · '], ['k', 'Leaflet'], ['n', ' · '], ['k', 'GSAP'], ['n', ' · '], ['k', '∞'], ['n', ' (42 repos)'],
];

const cmdOut = {
  whoami: [
    ['n', 'omprakash@mybyte'],
    ['s', '~ $'],
    ['n', ' 3rd Year BCA · CHRIST Yeshwantpur · Bengaluru'],
    ['n', ' builder of frugal, field-ready systems across 8 elements.'],
    ['n', ' reply < 24h · ships live or it doesn’t count.'],
  ],
  ls: [
    ['s', 'drwxr-xr-x  8 elements/   Land Infra Power AI Agri Space Move Ocean'],
    ['s', '-rw-r--r--   nybyte.py         the build script you are typing into'],
    ['s', '-rw-r--r--   resume.pdf        hit the Résumé button in the nav ↑'],
    ['s', '-rw-r--r--   contact.md        scroll to #contact ↓'],
  ],
  'cat skills': SKILLS,
  help: HELP,
};

// hidden origin log — unlocked via `cat secret.txt` (secret #04)
const SECRET_LOG = [
  ['c', '# ── origin.log ── classified: ∞'],
  ['n', '2024 :: first repo. on-campus BCA, off-campus curiosity.'],
  ['n', '2025 :: JS mastery — state, storage, polish. ship after ship.'],
  ['n', '2026 :: AI + systems — OCR, NLP, satellites, Pure C.'],
  ['s', '∞    :: eight elements, one loop. secret 04/05 logged.'],
];

const fireSecret = (id) => {
  window.dispatchEvent(new CustomEvent('mybyte:secret', { detail: { id } }));
};

export default function Terminal({ onFrugal }) {
  const cardRef = useRef(null);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const [lines, setLines] = useState([]); // history of [segments[], isInput]
  const [frugal, setFrugal] = useState(true);
  const [phase, setPhase] = useState('typing'); // typing → compiling → live
  const [typed, setTyped] = useState(0);
  const [secs, setSecs] = useState(0);
  const frugalRef = useRef({ onFrugal });
  frugalRef.current = { onFrugal };

  // central timer registry — every timeout/interval in the compile sequence
  // is tracked so rerun() and unmount always cancel the previous run first.
  // (Rapid ⟳ clicks used to spawn overlapping tick chains racing on setTyped.)
  const timers = useRef({ timeouts: new Set(), intervals: new Set() });
  const later = useCallback((fn, ms) => {
    const id = setTimeout(() => { timers.current.timeouts.delete(id); fn(); }, ms);
    timers.current.timeouts.add(id);
    return id;
  }, []);
  const every = useCallback((fn, ms) => {
    const id = setInterval(fn, ms);
    timers.current.intervals.add(id);
    return id;
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.timeouts.forEach(clearTimeout);
    timers.current.intervals.forEach(clearInterval);
    timers.current.timeouts.clear();
    timers.current.intervals.clear();
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const startRun = useCallback(() => {
    clearTimers();
    if (prefersReduce()) {
      setTyped(BANNER.length);
      setPhase('live');
      setSecs(0.8);
      return;
    }
    setLines([]);
    setTyped(0);
    setSecs(0);
    setPhase('typing');
    let i = 0;
    const tick = () => {
      i += 1;
      setTyped(i);
      if (i < BANNER.length) {
        later(tick, 110 + Math.random() * 80);
      } else {
        setPhase('compiling');
        const started = performance.now();
        const count = every(() => {
          const v = (performance.now() - started) / 1000;
          setSecs(Math.min(0.8, v));
          if (v >= 0.8) {
            timers.current.intervals.delete(count);
            clearInterval(count);
            setSecs(0.8);
            setPhase('live');
          }
        }, 60);
      }
    };
    later(tick, 300);
  }, [clearTimers, later, every]);

  // banner typing → compiling → live. Starts on mount so it overlaps the
  // preloader instead of serializing ~2.6s behind it.
  useEffect(() => {
    startRun();
  }, [startRun]);

  // auto-scroll only when already near the bottom — never yanks a user who
  // scrolled up to read, and skips a forced layout on every ~110ms tick.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [lines, typed, phase]);

  // 3D tilt — quickTo setters (no per-event tween allocation/GC churn).
  useEffect(() => {
    const card = cardRef.current;
    if (!card || prefersReduce() || matchMedia('(pointer: coarse)').matches) return;
    const rY = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power2.out' });
    const rX = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power2.out' });
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      card.style.setProperty('--mx', `${((px + 1) / 2 * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${((py + 1) / 2 * 100).toFixed(1)}%`);
      gsap.set(card, { transformPerspective: 1000, y: -4, scale: 1.015 });
      rY(px * 8);
      rX(-py * 8);
    };
    const onLeave = () => {
      gsap.to(card, {
        rotationX: 0, rotationY: 0, y: 0, scale: 1,
        duration: 1.1,
        ease: 'elastic.out(1, 0.45)', // heavy slab — slow spring back
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

  const print = (segments) => setLines((l) => [...l.slice(-60), [segments, false]]);

  const run = (raw) => {
    const input = raw.trim();
    if (!input) return;
    const echo = [[ 's', 'omprakash@mybyte' ], [ 'n', ':~$ ' ], [ 'n', input ]];
    setLines((l) => [...l.slice(-60), [echo, true]]);

    const [cmd, ...args] = input.split(/\s+/);
    const arg = args.join(' ');

    // known commands
    if (cmdOut[input] || cmdOut[`${cmd} ${arg}`]) {
      print(cmdOut[input] || cmdOut[`${cmd} ${arg}`]);
      return;
    }

    if (cmd === 'sudo' && arg === 'hire') {
      print([
        [ 'n', 'sudo: omprakash is already hired — by the problem.'],
        [ 'n', '  → V.I.P. lane opening… check the modal.'],
      ]);
      fireSecret('sudo');
      return;
    }

    if (cmd === 'sudo') {
      print([[ 'n', `sudo: permission denied — '${arg}' is not in the sudoers file. This incident will be reported (to the ∞ loop).` ]]);
      return;
    }

    if (cmd === 'run' && arg === 'demo') {
      print([[ 'n', '✓ demo protocol engaged — the ∞ loop is already live. Scroll ↓' ]]);
      return;
    }

    if (cmd === 'matrix') {
      if (prefersReduce()) {
        print([[ 'n', 'matrix: rain disabled under reduced-motion. The loop stays calm.' ]]);
      } else {
        print([[ 'n', '◉ matrix rain engaged — Esc or click to exit.' ]]);
        fireSecret('matrix');
      }
      return;
    }

    if (cmd === 'frugal') {
      const m = input.match(/=\s*(true|false)/);
      if (m) {
        const v = m[1] === 'true';
        setFrugal(v);
        frugalRef.current.onFrugal?.(v);
        print(v
          ? [[ 'n', '✓ frugal = True. Build budget: ≤30KB. The stone stays lean.' ]]
          : [[ 'n', '⚠ frugal = False. Bloat mode engaged. (+42KB, +3 shadows, 0 regrets)' ]]);
      } else {
        print([[ 'n', 'frugal = true' ]]);
      }
      return;
    }

    if (cmd === 'rm' && arg.includes('-rf')) {
      print([[ 'n', 'rm: nice try. The ∞ loop is immutable.' ]]);
      return;
    }

    if (cmd === 'cat' && arg === 'secret.txt') {
      print(SECRET_LOG);
      fireSecret('secret');
      return;
    }

    if (cmd === 'cat' || cmd === 'dog') {
      print([[ 'n', `cat: ${arg || 'skills'}: No such file. This is a C portfolio, not a petting zoo.` ]]);
      return;
    }

    if (cmd === 'clear') {
      setLines([]);
      return;
    }

    print([[ 'n', `zsh: command not found: ${cmd}. Type 'help'.` ]]);
  };

  const live = phase === 'live';
  const typing = phase === 'typing';

  return (
    <div
      ref={cardRef}
      className={`glass-card code-card tilt tilt--3d ${live ? 'code-card--live' : ''}`}
      data-cursor="code"
      onClick={() => inputRef.current?.focus()}
      title='Click to focus · type "help" · ⟳ recompiles'
    >
      <div className="code-card__bar">
        <span /><span /><span />
        <b>{live ? 'nybyte.py — ✓ compiled in 0.8s · type "help"' : typing ? 'nybyte.py — typing…' : 'nybyte.py — compiling…'}</b>
        <button
          type="button"
          className="recompile-btn"
          title="Replay the compile sequence"
          aria-label="Replay the compile sequence"
          onClick={(e) => { e.stopPropagation(); startRun(); inputRef.current?.focus(); }}
        >⟳</button>
        <span className="bar__right">● Python • edge • shipped</span>
      </div>

      <pre className="code-card__pre" ref={scrollRef} aria-label="nybyte.py — interactive terminal">
        <code>
          {BANNER.slice(0, typed).map((segs, i) => (
            <span className="cc-line" key={i}>
              {segs.map(([cls, txt], j) => <span className={cls} key={j}>{txt}</span>)}
              {'\n'}
            </span>
          ))}
          {lines.map(([segs], i) => (
            <span className="cc-line cc-line--out" key={`o${i}`}>
              {segs.map(([cls, txt], j) => <span className={cls} key={j}>{txt}</span>)}
              {'\n'}
            </span>
          ))}
          {live && (
            <span className="cc-line cc-line--input">
              <span className="s">omprakash@mybyte</span>
              <span>:~$&nbsp;</span>
              <input
                ref={inputRef}
                className="cc-input"
                aria-label="terminal input"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    run(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </span>
          )}
          {typing && <span className="cc-line cc-line--ghost" aria-hidden="true"><span className="cc-caret">▌</span></span>}
        </code>
      </pre>

      <div className="code-card__foot">
        <span className={`badge-pill badge-pill--live pill-tip ${live ? 'is-on' : ''}`} data-tip="Every project opens a live iframe preview — not just code."><i /> Live previews</span>
        <span className={`badge-pill badge-pill--bharat pill-tip ${live ? 'is-on' : ''}`} data-tip="Built for Bharat-scale constraints: offline, frugal, field-ready."><i /> Bharat-ready</span>
        <span className="foot-counter">
          {typing ? `${typed}/${BANNER.length} lines` : live ? '0.8s compile ✓' : `compiling ${secs.toFixed(1)}s`}
        </span>
      </div>

      <div className="code-glow" />
    </div>
  );
}
