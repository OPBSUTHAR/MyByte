import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ogUrl, liveUrl, isLiveCandidate, domainLabel } from '../lib/github';
import { useProjects } from '../ProjectsContext';

const LANGS = ['all', 'Python', 'JavaScript', 'TypeScript', 'HTML', 'C'];
const DOMAINS = ['all', 'krishi', 'safety', 'space', 'edu', 'other'];

function Card({ p, onOpen, index }) {
  const live = liveUrl(p.name);
  const isLive = isLiveCandidate(p.lang, p.name);
  return (
    <motion.article
      layout
      className="card"
      data-lang={p.lang || ''}
      data-domain={p.domain || 'other'}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.04 }}
      onClick={() => onOpen(p)}
      style={{ position: 'relative' }}
    >
      <div className="card__thumb">
        <img src={ogUrl(p.name)} alt={`${p.name} preview`} loading="lazy" onError={(e) => { e.currentTarget.src = 'https://avatars.githubusercontent.com/u/178475619?v=4'; }} />
      </div>
      {isLive && <span className="card__live">◉ Live</span>}
      <div className="card__top">
        <span>{p.lang || 'Other'}</span>
        <span>{domainLabel(p.domain || 'other')}</span>
        <span>★ {p.stars ?? 0}</span>
        <span>⑂ {p.forks ?? 0}</span>
      </div>
      <h3>{p.name}</h3>
      <p>{p.desc || 'No description.'}</p>
      <div className="card__meta"><span>↗ {live.replace('https://', '')}</span></div>
      <div className="card__actions">
        <a className="primary" href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOpen(p); }}>Live Preview</a>
        <a href={p.url} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>Code</a>
      </div>
    </motion.article>
  );
}

export default function Work() {
  const { list, openProject } = useProjects();
  const [q, setQ] = useState('');
  const [lang, setLang] = useState('all');
  const [domain, setDomain] = useState('all');

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
        <p className="muted small" style={{ marginTop: 10 }}>{filtered.length} of {list.length} projects • browse by domain and technology.</p>

        <motion.div layout className="cards">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <Card key={p.name} p={p} index={i} onOpen={openProject} />
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="center mt">
          <a href="https://github.com/OPBSUTHAR?tab=repositories" target="_blank" rel="noopener" className="btn btn--ghost">View all on GitHub ↗</a>
        </div>
      </div>
    </section>
  );
}
