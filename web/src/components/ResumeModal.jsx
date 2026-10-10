import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollLock, useTopmostEscape } from '../hooks/useScrollLock';

// Interactive web-native resume — modal with filter tabs, expandable
// accordions, skill tooltips and a recruiter action bar.
// Data source: data/resume.json (same file the Python fetch tool generates).

const TABS = ['All', 'AI / Systems', 'Full-Stack', 'Research'];

const TAB_MATCH = {
  'AI / Systems': ['AI', 'Systems', 'ML', 'OCR', 'NLP', 'Data', 'Space', 'C', 'Python', 'Technical'],
  'Full-Stack': ['Full-Stack', 'Frontend', 'Backend', 'React', 'Web', 'MERN', 'Node', 'Express', 'SQL'],
  'Research': ['Research', 'AI', 'ML', 'LLM', 'Hugging', 'Neural', 'DeepSpeed'],
};

const SKILL_TIPS = {
  'C': 'BharatVista Nexus (POSIX/WinSock, pthreads, libcurl, SQLite) — production C server',
  'C++': 'Data structures, SCALER coursework, systems programming',
  'C#': 'SpaceFlightMonitor — .NET WinForms, MS SQL, multi-threaded telemetry',
  'Java': 'SynchroGroundedNet — networking, RMI, distributed dashboards',
  'Python': 'CrimeIntel-AI, ai-scanner (OpenCV/OCR), Krishi-Gati-AI, Satora',
  'JavaScript': 'SpaceFlightMonitor dashboards, Leaflet frontends, 11+ mini apps',
  'TypeScript': 'AstraForge — typed tooling and libraries',
  'SQL': 'SQLite (BharatVista), MS SQL Server (telemetry), MongoDB (MERN)',
  'React': 'FieldSync, SynchroGroundedNet dashboards, this portfolio',
  'Node.js': 'Express APIs, REST design, MongoDB backends',
  'MongoDB': 'FieldSync GIS app — geospatial schemas, Express + Mongo',
  'MS SQL': 'SpaceFlightMonitor — async multi-threaded DB updates',
  'OpenCV': 'ai-scanner — edge detection, perspective warp, classifier pipelines',
  'Tesseract': 'ai-scanner — on-device OCR, no cloud',
  'Leaflet': 'BharatVista satellite ground-tracks, FieldSync maps',
  'satellite.js': 'SGP4 orbital propagation, live TLE tracking',
  'GSAP': 'This site — ScrollTrigger, pinned galleries, timelines',
  'React-Three': 'WebGL scenes and 3D interactions',
  'OCR': 'Edge document intelligence — ai-scanner, offline-first',
  'NLP': 'Aviation_NLP, CrimeIntel explainability, Aviation NLP project',
  'LLM/SLM': 'Fine-tuning, agentic workflows, Hugging Face pipelines',
  'Git': '42 repos, clean version trees, CI/CD, concurrent codebases',
  'Docker': 'Containerized deploys, reproducible builds',
  'Figma': 'UI/UX design → handoff, design systems',
  'Vercel': 'Edge deploys — this portfolio is live on Vercel',
};

const PDF_URL = '/assets/resume/RESUME_OM_PRAKASH_SUTHAR.pdf';
const EMAIL = 'omprakashsuthar.os974660@gmail.com';

export default function ResumeModal({ open, onClose }) {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [copied, setCopied] = useState(null);
  const copyTimer = useRef(0);

  useScrollLock(open);
  useTopmostEscape(open, onClose);

  useEffect(() => {
    if (!open) return;
    // BASE_URL-aware so subpath deploys resolve data correctly
    fetch(`${import.meta.env.BASE_URL}data/resume.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setData)
      .catch(() => setData(null));
  }, [open]);

  // changing tabs repoints index-based accordion ids — collapse on switch
  useEffect(() => { setExpanded(null); }, [tab]);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const matches = (text, t) => t === 'All' || TAB_MATCH[t]?.some((k) => text.toLowerCase().includes(k.toLowerCase()));

  const exp = useMemo(() => (data?.experience || []).filter((x) => matches(`${x.role} ${x.org}`, tab)), [data, tab]);
  const proj = useMemo(() => (data?.projects || []).filter((p) => matches(`${p.name} ${p.subtitle} ${p.stack}`, tab)), [data, tab]);
  const skills = useMemo(() => {
    if (!data?.skills) return [];
    return Object.entries(data.skills).filter(([cat]) => matches(cat, tab));
  }, [data, tab]);

  const copy = async (kind) => {
    const text = kind === 'email' ? EMAIL : `OM PRAKASH SUTHAR — Resume\n${location.origin}/assets/resume/RESUME_OM_PRAKASH_SUTHAR.pdf`;
    const done = () => {
      setCopied(kind);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(null), 1800);
    };
    try {
      await navigator.clipboard.writeText(text);
      done();
    } catch {
      // http / denied clipboard — legacy execCommand fallback
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        if (document.execCommand('copy')) done();
        else setCopied('error');
        document.body.removeChild(ta);
      } catch { setCopied('error'); }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="overlay-backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog" aria-modal="true" aria-label="Resume — Omprakash Suthar"
        >
          <motion.div
            className="resume-modal"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* action bar */}
            <div className="resume-modal__bar">
              <div className="resume-modal__who">
                <img src="https://avatars.githubusercontent.com/u/178475619?v=4" alt="" />
                <div>
                  <b>OM PRAKASH SUTHAR</b>
                  <span>BCA • CHRIST Yeshwantpur • Bengaluru</span>
                </div>
                <span className="live-dot"><i /> Open to offers</span>
              </div>
              <div className="resume-modal__actions">
                <a className="btn btn--sm btn--primary" href={PDF_URL} download="Omprakash_Suthar_Resume.pdf">⬇ Download PDF</a>
                <button className="btn btn--sm" onClick={() => copy('email')}>{copied === 'email' ? '✓ Email copied' : '✉ Copy Email'}</button>
                <button className="btn btn--sm" onClick={() => copy('text')}>{copied === 'text' ? '✓ Copied' : '⧉ Copy Text'}</button>
                <button className="icon-btn" onClick={onClose} aria-label="Close resume">✕</button>
              </div>
            </div>

            {/* filter tabs */}
            <div className="resume-tabs">
              {TABS.map((t) => (
                <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
              ))}
            </div>

            {/* body */}
            <div className="resume-modal__body">
              {!data && <p className="muted">Loading resume…</p>}

              {data && (
                <>
                  {/* experience accordions */}
                  {exp.map((x, i) => {
                    const id = `exp-${i}`;
                    const isOpen = expanded === id;
                    return (
                      <div className={`acc ${isOpen ? 'acc--open' : ''}`} key={id}>
                        <button className="acc__head" onClick={() => setExpanded(isOpen ? null : id)} aria-expanded={isOpen}>
                          <div className="acc__main">
                            {x.logo && <img src={x.logo} alt="" loading="lazy" />}
                            <div>
                              <b>{x.role}</b>
                              <span>{x.org} • {x.period} — {x.location}</span>
                            </div>
                          </div>
                          <span className="acc__chev">{isOpen ? '−' : '+'}</span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              className="acc__body"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <ul>
                                {(x.bullets || []).map((b, j) => <li key={j}>{b}</li>)}
                              </ul>
                              <div className="acc__meta">
                                <span>{(x.bullets || []).length} key contributions</span>
                                <span>{x.type || 'Internship'}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}

                  {/* projects */}
                  {proj.length > 0 && (
                    <div className="resume-block">
                      <h3>Projects</h3>
                      <div className="resume-proj">
                        {proj.map((p, i) => (
                          <div className="resume-proj__item" key={i}>
                            <b>{p.name}</b> <span className="muted">— {p.subtitle}</span>
                            <p className="muted small">{p.desc}</p>
                            <div className="tags">
                              {p.stack.split(',').map((s) => <span key={s.trim()}>{s.trim()}</span>)}
                            </div>
                            {p.link && <a href={p.link} target="_blank" rel="noopener">Code ↗</a>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* skills with tooltips */}
                  {skills.length > 0 && (
                    <div className="resume-block">
                      <h3>Stack &amp; Tools</h3>
                      {skills.map(([cat, list]) => (
                        <div className="skill-cat" key={cat}>
                          <h4>{cat}</h4>
                          <div className="tags">
                            {(list || []).map((s) => (
                              <span key={s} className="skill-tip" data-tip={SKILL_TIPS[s] || `Used across live projects`}>{s}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* education + certs */}
                  <div className="resume-block">
                    <h3>Education</h3>
                    {(data.education || []).map((e, i) => (
                      <div className="resume-edu" key={i}>
                        {e.logo && <img src={e.logo} alt="" loading="lazy" />}
                        <div>
                          <b>{e.degree}</b>
                          <span className="muted">{e.org} • {e.period}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="resume-block">
                    <h3>Certifications</h3>
                    <div className="resume-certs">
                      {(data.certifications || []).map((c, i) => (
                        <div key={i}>
                          <b>{c.name}</b>
                          <span className="muted">{c.org} • {c.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
