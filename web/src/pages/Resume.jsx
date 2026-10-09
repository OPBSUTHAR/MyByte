import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal';
import { prefersReduce } from '../hooks/useCountUp';

// Interactive resume — ported from the old static resume.html, now driven
// by data/resume.json (same source the Python fetch tool generates).

const FALLBACK = {
  name: 'OM PRAKASH SUTHAR',
  headline: 'BCA | Batch 2024–27 | CHRIST (Deemed to be University), Bengaluru',
  contacts: {},
  experience: [],
  projects: [],
  skills: {},
  certifications: [],
  education: [],
  pdf: '/assets/resume/RESUME_OM_PRAKASH_SUTHAR.pdf',
};

export default function Resume() {
  const [r, setR] = useState(FALLBACK);

  useEffect(() => {
    let alive = true;
    fetch('data/resume.json')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((j) => { if (alive) setR({ ...FALLBACK, ...j }); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const contacts = [
    ['mailto:prakash.suthar@bcah.christuniversity.in', r.contacts.email],
    ['tel:+917676581319', r.contacts.phone],
    [r.contacts.linkedin, 'LinkedIn'],
    [r.contacts.github, 'GitHub'],
    [r.contacts.x, 'X'],
  ].filter(([, label]) => label);

  return (
    <section className="section resume-page">
      <div className="container">
        <div className="section__eyebrow">Resume — University Format • Neo-Stone</div>
        <h1 style={{ fontFamily: 'Fraunces,serif', fontSize: 'clamp(2rem,4vw,2.8rem)', margin: 0 }}>
          Interactive resume — <span className="grad grad-anim">not a PDF embed</span>
        </h1>
        <p className="muted">
          Skill matrix, certs, experience. Download for the original PDF. <a href="#/">← Home</a>
        </p>

        <Reveal className="resume-header" style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'start' }}>
            <img className="resume-avatar" src="https://avatars.githubusercontent.com/u/178475619?v=4" alt="Omprakash" />
            <div>
              <h2 className="resume-name grad grad-anim" style={{ fontSize: '1.8rem' }}>{r.name}</h2>
              <div className="resume-headline">{r.headline}</div>
              <div className="resume-contacts" style={{ marginTop: 10 }}>
                {contacts.map(([href, label]) => (
                  <a key={label} href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener">{label}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="resume-actions">
            <a href={r.pdf} download className="btn btn--primary magnetic">⬇ Download PDF</a>
            <a href="#/" className="btn btn--ghost">↗ Back to Home</a>
            <div className="resume-pdf-note">Interactive • Download for original PDF</div>
          </div>
        </Reveal>

        <Reveal style={{ marginTop: 18, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '14px 16px', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <b style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '.72rem', letterSpacing: '.1em', color: 'var(--primary)' }}>∞ LIFE SYMBOL — 8 ELEMENTS</b><br />
            <span style={{ fontWeight: 700 }}>Land • Infrastructure • Power • AI/ML/DL/NLP/Tech • Agriculture • Space • Transportation • Ocean</span><br />
            <span className="muted small">∞ = continuous, interconnected, never-ending — loops through all 8.</span>
          </div>
          <div className="infinity-badge">∞</div>
        </Reveal>

        <div className="resume-grid" style={{ marginTop: 18 }}>
          <div style={{ display: 'grid', gap: 18 }}>
            <Reveal className="resume-block">
              <h3><i>∞</i> Career Field — 8 Elements</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {['Land', 'Infrastructure', 'Power', 'AI/ML/DL/NLP/Tech', 'Agriculture', 'Space', 'Transportation', 'Ocean'].map((e, i) => (
                  <span key={e} className={`elem-chip ${i === 3 ? 'elem-chip--active' : ''}`}>{e}</span>
                ))}
              </div>
              <p className="muted small" style={{ marginTop: 10 }}><b>∞ life symbol:</b> infinite loop — Land grounds, Infra connects, Power fuels, AI thinks, Agri feeds, Space guides, Transport moves, Ocean sustains — one continuous system.</p>
            </Reveal>

            {r.experience.map((x, i) => (
              <Reveal key={i} className="resume-block" delay={i * 60}>
                <h3><i>•</i> Experience</h3>
                {x.role && (
                  <div className="resume-item">
                    <div className="resume-item__head">
                      {x.logo && <img className="resume-logo" src={x.logo} alt="" loading="lazy" />}
                      <div>
                        <h4>{x.role} — {x.org}</h4>
                        <div className="muted">{x.period} • {x.location}</div>
                      </div>
                    </div>
                    <ul className="resume-bullets">
                      {(x.bullets || []).map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  </div>
                )}
              </Reveal>
            ))}

            <Reveal className="resume-block">
              <h3><i>PR</i> Projects — Latest</h3>
              {r.projects.map((p, i) => (
                <div className="resume-item" key={i}>
                  <h4>{p.name} — {p.subtitle}</h4>
                  <p className="muted">{p.stack} • {p.desc} {p.link && <a href={p.link} target="_blank" rel="noopener">Code ↗</a>}</p>
                </div>
              ))}
            </Reveal>

            <Reveal className="resume-block">
              <h3><i>ED</i> Education</h3>
              {r.education.map((e, i) => (
                <div className="resume-edu" key={i}>
                  {e.logo && <img src={e.logo} alt="" loading="lazy" />}
                  <div>
                    <h4>{e.degree} — {e.org}</h4>
                    <div className="muted">{e.period} • {e.detail}</div>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>

          <div style={{ display: 'grid', gap: 18 }}>
            <Reveal className="resume-block">
              <h3><i>•</i> Stack — Done</h3>
              <div className="resume-skills">
                {Object.entries(r.skills).map(([cat, list]) => (
                  <div className="skill-cat" key={cat}>
                    <h4>{cat}</h4>
                    <div className="tags">{(list || []).map((s) => <span key={s}>{s}</span>)}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="resume-block">
              <h3><i>CT</i> Certifications</h3>
              {r.certifications.map((c, i) => (
                <div className="resume-cert" key={i}>
                  {c.logo && <img src={c.logo} alt="" loading="lazy" />}
                  <div><b>{c.name} — {c.org}</b><br /><span>{c.date}</span></div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
