import { useMemo, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { ogUrl, liveUrl, isLiveCandidate, domainLabel } from '../lib/github';
import { useProjects } from '../ProjectsContext';

const LANGS = ['all', 'Python', 'JavaScript', 'TypeScript', 'HTML', 'C'];
const DOMAINS = ['all', 'krishi', 'safety', 'space', 'edu', 'other'];

// ─── Hover preview card with spring mouse-tracking ──────────────────────────
function RowPreview({ p, mx, my }) {
  const live = liveUrl(p.name);
  const isLive = isLiveCandidate(p.lang, p.name);
  // spring config: damping 20, stiffness 200, mass 0.5 — smooth inertia
  const sx = useSpring(mx, { damping: 20, stiffness: 200, mass: 0.5 });
  const sy = useSpring(my, { damping: 20, stiffness: 200, mass: 0.5 });
  return (
    <motion.div
      className="row-preview"
      style={{ x: sx, y: sy }}
      initial={{ opacity: 0, scale: .85, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: .9, y: -10 }}
      transition={{ duration: .25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="row-preview__thumb">
        <img src={ogUrl(p.name)} alt={`${p.name} preview`} loading="lazy" onError={(e) => { e.currentTarget.src = 'https://avatars.githubusercontent.com/u/178475619?v=4'; }} />
        {isLive && <span className="card__live">◉ Live</span>}
      </div>
      <div className="row-preview__body">
        <b>{p.name}</b>
        <p>{p.desc || 'No description.'}</p>
        <div className="row-preview__stack">
          {(p.lang || 'Other').split(',').map((s) => (
            <span key={s.trim()} className="tag-lift">{s.trim()}</span>
          ))}
        </div>
        <div className="row-preview__actions">
          <motion.a
            href={live} target="_blank" rel="noopener"
            whileHover={{ scale: 1.04, boxShadow: '0 0 15px rgba(16,185,129,.3)' }}
            whileTap={{ scale: .98 }}
          >Live Preview ↗</motion.a>
          <motion.a
            href={p.url} target="_blank" rel="noopener"
            whileHover={{ scale: 1.04, boxShadow: '0 0 15px rgba(16,185,129,.3)' }}
            whileTap={{ scale: .98 }}
          >Code ↗</motion.a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Table row ──────────────────────────────────────────────────────────────
function Row({ p, index, onOpen, onHover, onLeave }) {
  const live = liveUrl(p.name);
  const isLive = isLiveCandidate(p.lang, p.name);
  return (
    <motion.div
      layout
      className="proj-row"
      data-lang={p.lang || ''}
      data-domain={p.domain || 'other'}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: .98 }}
      transition={{ duration: .3, delay: (index % 8) * 0.03 }}
      onClick={() => onOpen(p)}
      onMouseMove={(e) => onHover(p, e.clientX, e.clientY)}
      onMouseLeave={onLeave}
    >
      <span className="proj-row__idx">{String(index + 1).padStart(2, '0')}</span>
      <div className="proj-row__main">
        <b className="proj-row__title">{p.name}</b>
        <span className="proj-row__repo">{p.name}</span>
      </div>
      <div className="proj-row__tags">
        <span className="tag-lift">{domainLabel(p.domain || 'other')}</span>
        <span className="tag-lift">{p.lang || 'Other'}</span>
        <span className="tag-lift">★ {p.stars ?? 0}</span>
      </div>
      <span className={`proj-row__status ${isLive ? 'is-live' : ''}`}>
        {isLive ? '🟢 Live' : '◌ Code'}
      </span>
      <div className="proj-row__actions">
        <a href={live} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>Preview</a>
        <a href={p.url} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>Code</a>
      </div>
    </motion.div>
  );
}

export default function Work() {
  const { list, openProject } = useProjects();
  const [q, setQ] = useState('');
  const [lang, setLang] = useState('all');
  const [domain, setDomain] = useState('all');
  const [preview, setPreview] = useState(null);

  // raw cursor motion values — the springs below smooth them
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim();
    return list
      .map((p) => ({ ...p, domain: p.domain || 'other' }))
      .filter((p) => {
        const text = `${p.name} ${p.desc} ${p.lang} ${p.domain}`.toLowerCase();
        const okLang = lang === 'all' || (p.lang || '').toLowerCase() === lang.toLowerCase();
        const okDomain = domain === 'all' || p.domain === domain;
        const okQ = !query || text.includes(query);
        return okLang && okDomain && okQ;
      });
  }, [list, q, lang, domain]);

  // offset: +20px right, −140px up — clamped into the viewport
  const onHover = (p, x, y) => {
    mx.set(Math.min(x + 20, innerWidth - 380));
    my.set(Math.max(y - 140, 80));
    setPreview((prev) => (prev && prev.p.name === p.name ? prev : { p }));
  };
  const onLeave = () => setPreview(null);

  return (
    <section id="work" className="section">
      <div className="container">
        <div className="section__eyebrow">04 — Portfolio</div>
        <div className="section__head">
          <h2>Projects</h2>
          <div className="toolbar">
            <input placeholder="Search… e.g. AI, tracker, space, Python" value={q} onChange={(e) => setQ(e.target.value)} />
            <div className="filter">
              {LANGS.map((l) => (
                <button key={l} className={lang === l ? 'active' : ''} onClick={() => setLang(l)}>{l === 'all' ? 'All' : l}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="filter" style={{ marginTop: 12 }}>
          {DOMAINS.map((d) => (
            <button key={d} className={domain === d ? 'active' : ''} onClick={() => setDomain(d)}>
              {d === 'all' ? 'All Domains' : domainLabel(d)}
            </button>
          ))}
        </div>
        <p className="muted small" style={{ marginTop: 10 }}>{filtered.length} of {list.length} projects • hover a row for preview.</p>

        <div className="proj-table">
          <div className="proj-row proj-row--head">
            <span>#</span>
            <span>Project</span>
            <span>Domain • Lang • Stars</span>
            <span>Status</span>
            <span>Links</span>
          </div>
          <AnimatePresence>
            {filtered.map((p, i) => (
              <Row key={p.name} p={p} index={i} onOpen={openProject} onHover={onHover} onLeave={onLeave} />
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {preview && <RowPreview p={preview.p} mx={mx} my={my} />}
        </AnimatePresence>

        <div className="center mt">
          <a href="https://github.com/OPBSUTHAR?tab=repositories" target="_blank" rel="noopener" className="btn btn--ghost">View all on GitHub ↗</a>
        </div>
      </div>
    </section>
  );
}
