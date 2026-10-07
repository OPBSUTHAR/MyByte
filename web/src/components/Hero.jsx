import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { PHRASES, MARQUEE } from '../content.jsx';
import { useCountUp } from '../hooks/useCountUp';
import { prefersReduce } from '../hooks/useCountUp';

function useTypewriter(phrases) {
  const [text, setText] = useState('');
  useEffect(() => {
    if (prefersReduce()) { setText(phrases[0]); return; }
    let pi = 0, ci = 0, del = false, t;
    const tick = () => {
      const w = phrases[pi];
      if (!del) {
        ci++; setText(w.slice(0, ci));
        if (ci === w.length) { del = true; t = setTimeout(tick, 1600); return; }
      } else {
        ci--; setText(w.slice(0, ci));
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
      }
      t = setTimeout(tick, del ? 42 : 96);
    };
    tick();
    return () => clearTimeout(t);
  }, [phrases]);
  return text;
}

function Stat({ value, label }) {
  const ref = useCountUp(value);
  return <div><b ref={ref}>0</b><span>{label}</span></div>;
}

export default function Hero() {
  const copy = useRef(null);
  const visual = useRef(null);
  const typed = useTypewriter(PHRASES);

  // Hero GSAP intro timeline
  useEffect(() => {
    const c = copy.current, v = visual.current;
    if (!c) return;
    const kids = Array.from(c.children);
    const floats = gsap.utils.toArray('.profile-float, .mini-float');
    gsap.set([...kids, ...(v ? [v] : [])], { autoAlpha: 1 });
    if (prefersReduce()) {
      document.documentElement.classList.add('gsap-hero-done');
      return;
    }
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        document.documentElement.classList.add('gsap-hero-done');
        gsap.set([...kids, ...(v ? [v] : []), ...floats], { clearProps: 'transform,opacity,visibility,filter' });
      },
    });
    tl.from(kids, { y: 30, autoAlpha: 0, duration: 0.7, stagger: 0.09 });
    if (v) tl.from(v, { y: 40, autoAlpha: 0, duration: 0.85 }, '-=0.55');
    if (floats.length) tl.from(floats, { y: 18, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, '-=0.4');
    return () => tl.kill();
  }, []);

  // magnetic CTA buttons
  useEffect(() => {
    if (prefersReduce()) return;
    const els = document.querySelectorAll('.magnetic');
    const cleanups = [];
    els.forEach((btn) => {
      const move = (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.28;
        btn.style.transform = `translate(${x}px,${y}px)`;
      };
      const leave = () => { btn.style.transform = ''; };
      btn.addEventListener('mousemove', move);
      btn.addEventListener('mouseleave', leave);
      cleanups.push(() => { btn.removeEventListener('mousemove', move); btn.removeEventListener('mouseleave', leave); });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  const marqueeHtml = MARQUEE.map((m, i) => <span key={i}>{m}</span>);

  return (
    <section className="hero" id="top">
      <div className="container hero__grid">
        <div className="hero__copy" ref={copy}>
          <div className="pill"><span className="pulse" /> Omprakash Suthar • MyByte — ∞ 8 Elements • Land → Ocean, byte-scale impact <span className="pill__arrow">→</span></div>
          <h1 className="anim-title">Intelligent<br /><span className="grad grad-anim">systems, ∞</span><br />&amp; field-ready<span className="dot dot-blink">.</span></h1>
          <p className="typed-line"><span className="typed-prefix">▸</span> <span className="typed">{typed}</span><span className="cursor">▌</span></p>
          <p className="lead paper-anim" style={{ maxWidth: '62ch' }}>
            <span className="paper-line"><span>I'm <strong>Omprakash Suthar</strong> — <b>Regular, On-Campus — 3rd Year BCA @ CHRIST Yeshwantpur</b></span></span>
            <span className="paper-line"><span>builder of <b>∞ loop systems across 8 elements: Land • Infrastructure • Power • AI/ML/DL/NLP/Tech</b></span></span>
            <span className="paper-line"><span><b>Agriculture • Space • Transportation • Ocean</b> — my life symbol is <b>∞</b>. <b>42 repos</b> live.</span></span>
          </p>
          <div className="hero__cta">
            <a href="#vision" className="btn btn--primary btn--xl magnetic">Open Story →</a>
            <a href="#about" className="btn btn--ghost btn--xl">My vision</a>
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
          <div className="tech-orbit" aria-hidden="true">
            {['Pure C', 'AI', 'TS', 'Python', 'OCR', 'Satellites'].map((b, i) => (
              <motion.span
                key={b}
                className={`orbit-badge b${i + 1}`}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {b}
              </motion.span>
            ))}
          </div>

          <motion.div
            className="glass-card code-card tilt"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 90, damping: 18 }}
          >
            <div className="code-card__bar"><span /><span /><span /><b>mybyte.py — live ● compiling</b><span className="bar__right">● Python • edge • shipped</span></div>
            <pre><code>{`# ∞ — 8 elements → infinite loop → ship
class MyByte:
  symbol = "∞"  # infinite loop — my life symbol
  elements = ["Land","Infrastructure","Power","AI/ML/DL/NLP/Tech","Agriculture","Space","Transportation","Ocean"]
  cost = "≤30KB • offline-first • frugal • ∞"
  def ship(self, idea):
    return idea.loop().polished().deployed()  # ∞

print(MyByte().ship(your_problem))  → ∞ shipped`}</code></pre>
            <div className="code-card__foot"><span className="foot-pulse">Frugal</span><span>Live previews</span><span>Bharat-ready</span><span className="foot-counter">12 lines • 0.8s compile</span></div>
            <div className="code-glow" />
          </motion.div>

          <motion.div className="profile-float anim-float" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <img src="https://avatars.githubusercontent.com/u/178475619?v=4" alt="Omprakash" />
            <div><b>Omprakash Suthar</b><span>Full-Stack • AI • C/C++ • OPBSUTHAR</span></div>
            <span className="badge badge-pulse">Open to collabs</span>
          </motion.div>

          <div className="mini-float-row">
            {[['BharatVista Nexus', 'Pure C • SQLite • Live ↗'], ['Agnirva NEAT 5.0', 'AI for Satellites ↗'], ['AI Scanner', 'OCR • Edge • Live ↗']].map(([b, s], i) => (
              <motion.div key={b} className="mini-float anim-float" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.12 }}>
                <b>{b}</b><span>{s}</span><i className="mini-dot" />
              </motion.div>
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
