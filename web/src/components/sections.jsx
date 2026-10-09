import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from './Reveal';
import { prefersReduce } from '../hooks/useCountUp';
import { DOMAINS, CASES, GOALS, SKILLS, BENTO, TIMELINE } from '../content.jsx';

gsap.registerPlugin(ScrollTrigger);

/* ---------------- 00 VISION ---------------- */
export function Vision() {
  return (
    <section id="vision" className="section">
      <div className="container">
        <div className="section__eyebrow">00 — North Star • Why I Build</div>
        <div className="bento" style={{ gridTemplateColumns: '1.2fr .8fr' }}>
          <Reveal className="paper-anim" style={{ background: 'linear-gradient(180deg,#fffef8,#fefce8)', border: '1px solid #e7e5e4', borderRadius: 24, padding: 22, boxShadow: '0 8px 24px rgba(0,0,0,.08)', color: '#1c1917' }}>
            <h2 style={{ fontFamily: 'Fraunces,serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', lineHeight: .92, letterSpacing: '-.04em', margin: 0, color: '#1c1917' }}>
              Byte-scale craft.<br /><span className="grad">Bharat-scale problems.</span>
            </h2>
            <p style={{ marginTop: 14, fontSize: '1.02rem', lineHeight: 1.65, color: '#44403c' }}>
              Most portfolios show <em>what</em> I built. I want to show <em>why</em>. My ambition is to build <b>intelligent systems that are fast, frugal and field-ready</b> — that work when the internet doesn't, on low compute, for people who need it most — farmer in Rajasthan, controller at airport, student without laptop.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
              {['Frugal AI — offline-first, ≤30KB', 'Real users, real constraints', "Ship live or it didn't happen"].map((t) => (
                <span key={t} style={{ border: '1px solid var(--line)', background: 'var(--card2)', padding: '7px 12px', borderRadius: 999, fontWeight: 700, fontSize: '.82rem' }}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
              <a href="#infinity" className="btn btn--primary magnetic">My ∞ 8 elements →</a>
              <a href="#about" className="btn btn--ghost">2026–30 roadmap</a>
            </div>
          </Reveal>

          <Reveal from="right" delay={90} style={{ display: 'grid', gap: 14 }}>
            <div style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed 55%,#f59e0b)', color: '#fff', borderRadius: 20, padding: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '.68rem', letterSpacing: '.14em', opacity: .92 }}>MYBYTE PRINCIPLE</div>
              <div style={{ fontFamily: 'Fraunces,serif', fontSize: '1.45rem', lineHeight: 1.02, marginTop: 10, fontWeight: 900 }}>“Precision &amp; polish<br />over noise.<br />If it doesn't ship live,<br />it doesn't count.”</div>
              <div style={{ marginTop: 14, fontSize: '.86rem', opacity: .9 }}>Every project is live and deployed. — <b>Omprakash</b></div>
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18, padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['3rd Year BCA', 'CHRIST Yeshwantpur • 2024–27'], ['AI + Systems', 'Pure C • Python • JS/TS'], ['29', 'Repos shipped • 2 new'], ['Yeshwantpur → Global', 'Bengaluru • On-Campus']].map(([b, s]) => (
                <div key={b}><b style={{ fontSize: '1.35rem' }}>{b}</b><br /><span className="muted small">{s}</span></div>
              ))}
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="muted small" style={{ fontWeight: 700 }}>NEXT: Seeking 2026 internships &amp; collabs in AI / Space / AgTech</span>
              <a href="#contact" className="btn btn--sm btn--primary">Hire me</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 00.5 ∞ ELEMENTS ---------------- */
export function InfinitySection() {
  const labels = ['Land', 'Infra', 'Power', 'AI', 'Agri', 'Space', 'Move', 'Ocean'];
  const [active, setActive] = useState(null);
  return (
    <section id="infinity" className="section infinity">
      <div className="container">
        <Reveal className="infinity__wrap">
          <div className="infinity__hero">
            <div>
              <div className="infinity__badge">Focus Areas</div>
              <h2 style={{ fontFamily: 'Fraunces,serif', fontSize: 'clamp(1.9rem,4vw,2.6rem)', lineHeight: .96, margin: '10px 0', letterSpacing: '-.03em' }}>
                Eight Focus Areas — <span className="grad">One System</span>
              </h2>
              <p className="muted" style={{ fontSize: '1.01rem', lineHeight: 1.6 }}>
                A unified practice across <b>Land, Infrastructure, Power, AI/ML/DL/NLP, Agriculture, Space, Transportation and Ocean</b> — each a node on a continuous, disciplined loop.
              </p>
              <div className="infinity__labels">
                <span className="hl">∞ Land</span><span>Infrastructure</span><span>Power</span><span>AI/ML</span><span>Agriculture</span><span>Space</span><span>Transportation</span><span>Ocean</span>
              </div>
              <p className="muted small" style={{ marginTop: 10 }}>Research → Prototype → Ship → Iterate — across all eight domains</p>
              <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                <a href="#domains" className="btn btn--primary magnetic">Explore 8 domains →</a>
                <a href="#about" className="btn btn--ghost">Why ∞ ?</a>
              </div>
            </div>

            <div className="infinity__symbol infinity__symbol--free" aria-hidden="true">
              <div className="free-infinity">
                <svg viewBox="0 0 400 140" className="free-infinity__svg" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="negGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity=".85" />
                      <stop offset="50%" stopColor="#7c3aed" stopOpacity=".85" />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity=".85" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M 70 70 C 70 18, 168 8, 200 70 C 232 132, 330 122, 330 70 C 330 18, 232 8, 200 70 C 168 132, 70 122, 70 70 Z"
                    fill="none" stroke="url(#negGrad)" strokeWidth="3.2" strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1.8, ease: 'easeInOut' }}
                  />
                  <g className="free-dots">
                    {[[68, 62], [132, 28], [268, 28], [332, 62], [332, 78], [268, 112], [132, 112], [68, 78]].map(([cx, cy], i) => (
                      <circle key={i} cx={cx} cy={cy} r={i % 2 ? 2.6 : 3.2}
                        style={{ cursor: 'pointer', fill: active === i ? 'var(--primary)' : '' }}
                        onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} />
                    ))}
                  </g>
                  <circle cx="200" cy="70" r="10" fill="var(--card)" stroke="var(--line)" strokeWidth="1.2" />
                  <text x="200" y="74" textAnchor="middle" fontFamily="Fraunces,serif" fontSize="13" fontWeight="800" fill="var(--text)">∞</text>
                </svg>
                <div className="free-infinity__labels">{labels.map((l, i) => <span key={l} style={active === i ? { color: 'var(--primary)' } : undefined}>{l}</span>)}</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- 01 DOMAINS — pinned horizontal scroll (desktop) ---------------- */
export function Domains() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    if (prefersReduce()) return;
    // Desktop: pin the stage and slide the 8 domain cards sideways as the
    // user scrolls vertically. Mobile/tablet: plain vertical grid (no pin).
    const mm = ScrollTrigger.matchMedia({
      '(min-width: 901px)': () => {
        const track = trackRef.current;
        const viewport = track?.parentElement;
        if (!track || !viewport) return;
        const getAmount = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        return gsap.to(track, {
          x: () => -getAmount(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => '+=' + getAmount(),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
      },
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="domains" className="section section--alt domains" ref={sectionRef}>
      <div className="container domains__stage">
        <div className="section__eyebrow">01 — Domains • ∞ 8 Elements • One Loop</div>
        <div className="section__head">
          <h2>Eight elements, one infinite system</h2>
          <p className="muted">∞ connects Land → Ocean. Scroll to travel the loop — each domain has stack &amp; live work.</p>
        </div>

        <div className="domains__viewport">
          <div className="domains__track" ref={trackRef}>
            {DOMAINS.map((d, i) => (
              <Reveal
                key={d.h}
                as="article"
                className="domain domain--infinity domain--pin"
                delay={0}
                duration={0.5}
              >
                <div className="domain__icon" style={{ background: d.grad }}>{d.id}</div>
                <div className="domain__head"><h3>{d.h}</h3><span>{d.tag}</span></div>
                <p>{d.p}</p>
                <div className="tags">{d.tags.map((t) => <span key={t}>{t}</span>)}</div>
                <a href="#work" className="domain__link">View {d.h.split(' ')[0]} →</a>
                <span className="domain__index">0{i + 1} / 08</span>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="domains__progress"><i ref={barRef} /></div>
      </div>
    </section>
  );
}

/* ---------------- 02 CASE STUDIES ---------------- */
export function Cases() {
  return (
    <section id="featured" className="section">
      <div className="container">
        <div className="section__eyebrow">02 — Featured Case Studies • Curated, Not Dumped</div>
        <div className="section__head"><h2>3 builds that explain how I think</h2><p className="muted">Challenge → Role → Process → Result. Like a real studio portfolio.</p></div>
        <div className="case-grid">
          {CASES.map((c, i) => (
            <Reveal key={c.h} as="article" className="case" from="scale" delay={i * 0.09}>
              <div className="case__bar" style={{ background: c.bar }} />
              <div className="case__body">
                <div className="case__eyebrow" style={{ color: c.color }}>{c.eyebrow}</div>
                <h3>{c.h}</h3>
                <p className="muted">{c.p}</p>
                <div className="case__stats">{c.tags.map((t) => <span key={t}>{t}</span>)}</div>
                <div className="case__actions">
                  <a className="btn btn--primary btn--sm" href={c.code} target="_blank" rel="noopener">Code ↗</a>
                  <a className="btn btn--sm" href="#work">Live preview</a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 06 GOALS ---------------- */
export function Goals() {
  return (
    <section id="goals" className="section section--alt">
      <div className="container">
        <div className="section__eyebrow">05 — Goals • Ambition in Public</div>
        <div className="section__head"><h2>Where I'm headed — 2026 → 2030</h2><p className="muted">Goals not wishes. Public = accountable.</p></div>
        <div className="goals">
          {GOALS.map((g, i) => (
            <Reveal key={g.h} className="goal" bar delay={(i % 2) * 0.08}>
              <span className="goal__when">{g.when}</span>
              <h3>{g.h}</h3>
              <p className="muted">{g.p}</p>
              <div className="bar"><i style={{ width: `${g.width}%` }} /></div>
              <span className="small muted">{g.note}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 06 STACK / SERVICES ---------------- */
export function Stack() {
  return (
    <section id="stack" className="section">
      <div className="container">
        <div className="section__head">
          <div><div className="section__eyebrow">06 — Stack &amp; Services</div><h2>Hire me for outcomes, not buzzwords</h2></div>
          <p className="muted">Minimal deps, maximal ship speed.</p>
        </div>
        <div className="skills-grid">
          {SKILLS.map((s, i) => (
            <Reveal key={s.h} className="skill" bar delay={(i % 4) * 0.08}>
              <div className="skill__head"><h3>{s.h}</h3><span>{s.lvl}</span></div>
              <p className="muted small">{s.p}</p>
              <div className="bar"><i style={{ width: `${s.width}%` }} /></div>
              <div className="tags">{s.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </Reveal>
          ))}
        </div>
        <Reveal className="hire" style={{ marginTop: 18, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: 16, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
          <div><b>What I can do for you in 2 weeks:</b> <span className="muted">Landing + live demo + analytics, or OCR prototype, or dashboard refactor — all shipped.</span></div>
          <a href="#contact" className="btn btn--primary">Start a project →</a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- 07 ABOUT / BENTO ---------------- */
export function About() {
  return (
    <section id="about" className="section section--alt">
      <div className="container">
        <div className="section__eyebrow">07 — About • The Person Behind Bytes</div>
        <div className="bento">
          <Reveal className="bento__main">
            <h2>Continuous learner.<br />Adaptable builder.<br />Smile-driven.</h2>
            <p className="muted">I love web tech and the <b>smile when UX finally feels right</b>. 3rd Year BCA — regular, on-campus @ CHRIST Yeshwantpur. My journey is factorial: each project is a small system that taught me a constraint — offline, latency, low compute, trust.</p>
            <ul className="ticks">
              <li>Learning HTML/CSS/JS, Python, C, C++ — daily</li>
              <li>Open to team builds, partnerships, OSS — I reply fast</li>
              <li>India • X @omprakashrj155 • LinkedIn</li>
              <li>Principles: frugal &gt; fancy, live &gt; slides, clarity &gt; cleverness</li>
            </ul>
            <div className="chips"><span>SMILE-driven</span><span>Ships live</span><span>On-Campus</span><span>Regular</span></div>
          </Reveal>
          <div className="bento__cards">
            {BENTO.map((b, i) => (
              <Reveal key={b.h} className="b-card" delay={i * 0.06}><i>•</i><h3>{b.h}</h3><p>{b.p}</p></Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 08 JOURNEY ---------------- */
export function Journey() {
  return (
    <section id="journey" className="section">
      <div className="container">
        <div className="section__eyebrow">08 — Journey</div>
        <h2>The path so far — diverse by doing</h2>
        <div className="timeline">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.h} className="tl" from="left" delay={i * 0.06}>
              <span>{t.when}</span>
              <div><h3>{t.h}</h3><p>{t.p}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 09 CONTACT ---------------- */
export function Contact() {
  const [msg, setMsg] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const subject = encodeURIComponent(`MyByte — contact from ${fd.get('name')}`);
    const body = encodeURIComponent(`From: ${fd.get('name')} <${fd.get('email')}>\n\n${fd.get('message')}\n\n— via MyByte`);
    location.href = `mailto:omprakashsuthar.os974660@gmail.com?subject=${subject}&body=${body}`;
    setMsg('Opening mail client… fallback: omprakashsuthar.os974660@gmail.com');
  };
  return (
    <section id="contact" className="section section--alt contact">
      <div className="container grid2">
        <Reveal from="left">
          <div className="section__eyebrow">09 — Contact</div>
          <h2>Let's build<br />together.</h2>
          <p className="muted">Have a problem worth a system? Need efficient, clean execution? I reply &lt; 24h — DM, email, or open an issue on GitHub.</p>
          <div className="contact-list">
            {[['https://github.com/OPBSUTHAR', 'github.com/OPBSUTHAR', '↗'], ['https://www.linkedin.com/in/omprakash-suthar-246240318/', 'LinkedIn — Omprakash Suthar', '↗'], ['https://x.com/omprakashrj155', 'X @omprakashrj155', '↗'], ['mailto:omprakashsuthar.os974660@gmail.com', 'omprakashsuthar.os974660@gmail.com', '→']].map(([href, label, arrow]) => (
              <a key={href} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener">{label} <span>{arrow}</span></a>
            ))}
          </div>
          <p className="small muted" style={{ marginTop: 12 }}>Preferred: GitHub issue or LinkedIn DM with a 1-liner problem + deadline. I'll send a 1-day plan.</p>
        </Reveal>

        <Reveal from="right" delay={120} className="form glass-card" as="form" onSubmit={submit}>
          <label>Name<input name="name" required placeholder="Omprakash" /></label>
          <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
          <label>Budget / Timeline
            <select name="budget" defaultValue="Just exploring" style={{ padding: '11px 12px', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--text)', font: 'inherit' }}>
              <option>Just exploring</option><option>&lt; ₹25k — 1 week sprint</option><option>₹25k–1L — 2–4 weeks</option><option>Internship / Full-time</option><option>Collab / OSS</option>
            </select>
          </label>
          <label>Message<textarea name="message" rows={5} required placeholder="Tell me about your idea / problem… what's the real constraint?" /></label>
          <motion.button className="btn btn--primary btn--xl magnetic" type="submit" whileTap={{ scale: 0.97 }}>Send — let's ship</motion.button>
          <p className="small muted">{msg}</p>
        </Reveal>
      </div>
    </section>
  );
}
