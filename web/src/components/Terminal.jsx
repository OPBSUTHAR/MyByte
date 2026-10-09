import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { prefersReduce } from '../hooks/useCountUp';

// nybyte.py — interactive CLI window. Same tactile look as the old code
// card, but now it is a real terminal:
//   help · whoami · cat skills · sudo hire · run demo · ls
//   theme obsidian|bone|cyber · frugal = true|false · clear
// Hidden commands trigger confetti + XP (handled via onCommand callback).

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
  ['$', 'ls', '— what is in this repo'],
  ['$', 'sudo hire', '— try it. seriously.'],
  ['$', 'run demo', '— confetti protocol'],
  ['$', 'theme <dark|light>', '— material switcher'],
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
    ['s', '-rw-r--r--   resume.pdf        the paper trail → #/resume'],
    ['s', '-rw-r--r--   quest.log        your XP so far (bottom-left HUD)'],
  ],
  'cat skills': SKILLS,
  help: HELP,
};

export default function Terminal({ ready, onCommand, onTheme, onFrugal, initialTheme }) {
  const cardRef = useRef(null);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const [lines, setLines] = useState([]); // history of [segments[], isInput]
  const [frugal, setFrugal] = useState(true);
  const [theme, setTheme] = useState(initialTheme);
  const [phase, setPhase] = useState('typing'); // typing → compiling → live
  const [typed, setTyped] = useState(0);
  const [secs, setSecs] = useState(0);
  const stateRef = useRef({ frugal: true, theme: initialTheme, onCommand, onTheme, onFrugal });
  stateRef.current = { frugal, theme, onCommand, onTheme, onFrugal };

  // banner typing → compiling → live (starts when the hero is visible)
  useEffect(() => {
    if (!ready) return;
    if (prefersReduce()) {
      setTyped(BANNER.length);
      setPhase('live');
      setSecs(0.8);
      return;
    }
    let i = 0;
    let t;
    const tick = () => {
      i += 1;
      setTyped(i);
      if (i < BANNER.length) {
        t = setTimeout(tick, 110 + Math.random() * 80);
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
    t = setTimeout(tick, 350);
    return () => clearTimeout(t);
  }, [ready]);

  // auto-scroll the output
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, typed, phase]);

  // re-run the full compile sequence (click anywhere in the window)
  const rerun = useCallback(() => {
    if (prefersReduce()) return;
    setLines([]);
    setTyped(0);
    setSecs(0);
    setPhase('typing');
    let i = 0;
    const tick = () => {
      i += 1;
      setTyped(i);
      if (i < BANNER.length) {
        setTimeout(tick, 110 + Math.random() * 80);
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
      }
    };
    setTimeout(tick, 200);
  }, []);

  // 3D tilt (heavy slab physics — high damping spring-back)
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
        rotateY: px * 8,
        rotateX: -py * 8,
        y: -4,
        scale: 1.015,
        transformPerspective: 1000,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };
    const onLeave = () => {
      gsap.to(card, {
        rotateX: 0, rotateY: 0, y: 0, scale: 1,
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
      const out = cmdOut[input] || cmdOut[`${cmd} ${arg}`];
      print(out);
      stateRef.current.onCommand?.(input);
      return;
    }

    if (cmd === 'sudo' && arg === 'hire') {
      print([
        [ 'n', 'sudo: omprakash is already hired — by the problem.'],
        [ 'n', '  → open #/contact and let’s ship something live.'],
      ]);
      stateRef.current.onCommand?.('sudo hire');
      return;
    }

    if (cmd === 'sudo') {
      print([[ 'n', `sudo: permission denied — '${arg}' is not in the sudoers file. This incident will be reported (to the ∞ loop).` ]]);
      stateRef.current.onCommand?.(input);
      return;
    }

    if (cmd === 'run' && arg === 'demo') {
      print([[ 'n', '✓ demo protocol engaged — deploying confetti…' ]]);
      stateRef.current.onCommand?.('run demo');
      return;
    }

    if (cmd === 'theme') {
      const t = arg.toLowerCase();
      if (['dark', 'light'].includes(t)) {
        setTheme(t);
        stateRef.current.onTheme?.(t);
        print([[ 'n', `✓ material switched → ${t}. The stone remembers.` ]]);
        stateRef.current.onCommand?.(`theme ${t}`);
      } else {
        print([[ 'n', `theme: unknown material '${arg || '?'}'. Try: dark · light.` ]]);
      }
      return;
    }

    if (cmd === 'frugal') {
      const m = input.match(/=\s*(true|false)/);
      if (m) {
        const v = m[1] === 'true';
        setFrugal(v);
        stateRef.current.onFrugal?.(v);
        print(v
          ? [[ 'n', '✓ frugal = True. Build budget: ≤30KB. The stone stays lean.' ]]
          : [[ 'n', '⚠ frugal = False. Bloat mode engaged. (+42KB, +3 shadows, 0 regrets)' ]]);
        stateRef.current.onCommand?.('frugal toggle');
      } else {
        print([[ 'n', `frugal = ${frugal}` ]]);
      }
      return;
    }

    if (cmd === 'rm' && arg.includes('-rf')) {
      print([[ 'n', 'rm: nice try. The ∞ loop is immutable.' ]]);
      stateRef.current.onCommand?.('easter egg');
      return;
    }

    if (cmd === 'cat' || cmd === 'dog') {
      print([[ 'n', `cat: ${arg || 'skills'}: No such file. This is a C portfolio, not a petting zoo.` ]]);
      stateRef.current.onCommand?.('easter egg');
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
      onClick={(e) => { e.stopPropagation(); rerun(); inputRef.current?.focus(); }}
      title='Click to recompile · type "help"'
    >
      <div className="code-card__bar">
        <span /><span /><span />
        <b>{live ? 'nybyte.py — ✓ compiled in 0.8s · type "help"' : typing ? 'nybyte.py — typing…' : 'nybyte.py — compiling…'}</b>
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
