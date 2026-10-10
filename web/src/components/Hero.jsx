import { memo, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { PHRASES, MARQUEE } from '../content.jsx';
import { useCountUp, prefersReduce } from '../hooks/useCountUp';
import { useProjects } from '../ProjectsContext';
import SplitChars from './SplitChars';
import Terminal from './Terminal';

// Isolated typewriter line — owns its tick state so the 42–96ms updates
// never re-render the whole Hero (Terminal, stats, headline stay still).
const TypedLine = memo(function TypedLine() {
  const [text, setText] = useState('');
  useEffect(() => {
    if (prefersReduce()) { setText(PHRASES[0]); return; }
    let pi = 0, ci = 0, del = false, t;
    const tick = () => {
      const w = PHRASES[pi];
      if (!del) {
        ci++; setText(w.slice(0, ci));
        if (ci === w.length) { del = true; t = setTimeout(tick, 1600); return; }
      } else {
        ci--; setText(w.slice(0, ci));
        if (ci === 0) { del = false; pi = (pi + 1) % PHRASES.length; }
      }
      t = setTimeout(tick, del ? 42 : 96);
    };
    tick();
    return () => clearTimeout(t);
  }, []);
  return (
    <p className="typed-line"><span className="typed-prefix">▸</span> <span className="typed">{text}</span><span className="cursor">▌</span></p>
  );
});

function Stat({ value, label }) {
  const ref = useCountUp(value);
  return <div><b ref={ref}>0</b><span>{label}</span></div>;
}

// Headline lines — each word becomes a SplitChars mask; `cls` styles the word.
const HEADLINE = [
  [{ t: 'Intelligent' }],
  [{ t: 'systems,' }, { t: '∞', cls: 'grad grad-anim infinity-accent' }],
  [{ t: '&' }, { t: 'field-ready' }, { t: '.', cls: 'dot' }],
];

export default function Hero({ ready, onFrugal, onOpenStory }) {
  const section = useRef(null);
  const copy = useRef(null);
  const visual = useRef(null);
  const { list, openProject } = useProjects();

  // Open the live-preview modal for a floating project pill.
  const openByName = (name) => {
    const hit = list.find((p) => p.name.toLowerCase().includes(name.toLowerCase().split(' ')[0]));
    openProject(hit || {
      name, lang: '', desc: `${name} — live build preview.`,
      url: `https://github.com/OPBSUTHAR/${name}`, stars: 0, forks: 0, updated: '',
    });
  };

  // Hero GSAP intro timeline — runs once the preloader hands off.
  // Floats are owned by Motion (initial/animate below) and excluded here so
  // the two systems never fight over the same transforms. Char query is
  // scoped to this hero instance, not the whole document.
  useEffect(() => {
    const c = copy.current, v = visual.current;
    if (!c) return;
    const kids = Array.from(c.children).filter((k) => !k.classList.contains('anim-title'));
    const chars = c.querySelectorAll('.hero-title .ht-char');

    if (!ready) {
      gsap.set([...kids, ...(v ? [v] : [])], { autoAlpha: 0 });
      return;
    }
    gsap.set([...kids, ...(v ? [v] : [])], { autoAlpha: 1 });

    if (prefersReduce()) {
      document.documentElement.classList.add('gsap-hero-done');
      gsap.set([...kids, ...(v ? [v] : []), ...chars], { clearProps: 'transform,opacity,visibility,filter' });
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        document.documentElement.classList.add('gsap-hero-done');
        gsap.set([...kids, ...(v ? [v] : []), ...chars], { clearProps: 'transform,opacity,visibility,filter' });
      },
    });
    // split headline — chars slide up out of their word masks
    tl.from(chars, {
      yPercent: 112,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power4.out',
      stagger: { each: 0.016, from: 'start' },
    }, 0.1);
    tl.from(kids, { y: 26, autoAlpha: 0, duration: 0.55, stagger: 0.07 }, '-=0.25');
    if (v) tl.from(v, { y: 40, autoAlpha: 0, duration: 0.85, ease: 'power3.out' }, '-=0.5');
    return () => tl.kill();
  }, [ready]);

  // magnetic CTA buttons — scoped to this hero; gsap.to with overwrite so it
  // never clobbers the intro tween's inline transforms.
  useEffect(() => {
    const root = section.current;
    if (!root || prefersReduce()) return;
    const els = root.querySelectorAll('.magnetic');
    const cleanups = [];
    els.forEach((btn) => {
      const move = (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.28;
        gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      };
      const leave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
      btn.addEventListener('mousemove', move);
      btn.addEventListener('mouseleave', leave);
      cleanups.push(() => { btn.removeEventListener('mousemove', move); btn.removeEventListener('mouseleave', leave); });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  const marqueeHtml = MARQUEE.map((m, i) => <span key={i}>{m}</span>);

  return (
    <section className="hero" id="top" ref={section}>
      <div className="container hero__grid">
        <div className="hero__copy" ref={copy}>
          <div className="pill"><span className="pulse" /> Omprakash Suthar • MyByte — ∞ 8 Elements • Land → Ocean, byte-scale impact <span className="pill__arrow">→</span></div>

          <h1 className="anim-title hero-title" aria-label="Intelligent systems, ∞ & field-ready.">
            {HEADLINE.map((words, li) => (
              <span
                className="ht-line"
                key={li}
                onMouseEnter={() => copy.current?.classList.add('headline-lit')}
                onMouseLeave={() => copy.current?.classList.remove('headline-lit')}
              >
                {words.map((w, wi) => (
                  <span key={wi} className={w.cls || ''}>
                    <SplitChars text={w.t} />
                    {wi < words.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <TypedLine />
          <p className="lead paper-anim" style={{ maxWidth: '62ch', lineHeight: 1.6 }}>
            <span className="paper-line"><span>I'm <strong>Omprakash Suthar</strong> — <b>Regular, On-Campus — 3rd Year BCA @ CHRIST Yeshwantpur</b></span></span>
            <span className="paper-line"><span>builder of <b>∞ loop systems across 8 elements: Land • Infrastructure • Power • AI/ML/DL/NLP/Tech</b></span></span>
            <span className="paper-line"><span><b>Agriculture • Space • Transportation • Ocean</b> — my life symbol is <b>∞</b>. <b>42 repos</b> live.</span></span>
          </p>
          <div className="hero__cta">
            <button type="button" className="btn btn--primary btn--xl magnetic" onClick={onOpenStory}>Open Story →</button>
            <a href="#vision" className="btn btn--ghost btn--xl">My vision</a>
            <a href="#work" className="btn btn--ghost btn--xl">Explore work</a>
          </div>
          <div className="hero__meta">
            <div className="avatars">
              <img src="https://avatars.githubusercontent.com/u/178475619?v=4" alt="Omprakash" />
              <span>Regular @ CHRIST Yeshwantpur • Bengaluru • he/him • Reply &lt; 24h</span>
            </div>
            <div className="stats">
              <Stat value={42} label="Repos" />
              <Stat value={23} label="Stars" />
              <div><b>95+</b><span>Lighthouse</span></div>
              <Stat value={14} label="Live demos" />
            </div>
          </div>
        </div>

        <div className="hero__visual" ref={visual}>
          <Terminal onFrugal={onFrugal} />

          <motion.div className="profile-float anim-float neon-glow-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <img src="https://avatars.githubusercontent.com/u/178475619?v=4" alt="Omprakash" />
            <div><b>Omprakash Suthar</b><span>Full-Stack • AI • C/C++ • OPBSUTHAR</span></div>
            <span className="badge badge-pulse">Open to collabs</span>
          </motion.div>

          <div className="mini-float-row">
            {([
              ['BharatVista Nexus', 'Pure C • SQLite • Live ↗', 'BharatVista-Nexus'],
              ['Agnirva NEAT 5.0', 'AI for Satellites ↗', 'Satora'],
              ['AI Scanner', 'OCR • Edge • Live ↗', 'ai-scanner'],
            ]).map(([b, s, key], i) => (
              <motion.button
                key={key}
                type="button"
                className="mini-float anim-float neon-glow-card"
                data-cursor="view"
                title={`Open ${b} live preview`}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.12 }}
                onClick={() => openByName(key)}
              >
                <b>{b}</b><span>{s}</span><i className="mini-dot" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">{marqueeHtml}{marqueeHtml}</div>
      </div>
    </section>
  );
}
