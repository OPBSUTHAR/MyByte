import { useMemo } from 'react';
import { motion } from 'motion/react';
import { isLiveCandidate, liveUrl, ogUrl, domainLabel } from '../lib/github';
import { useProjects } from '../ProjectsContext';

// 03 — Selected Work. Cards enter via whileInView; no AnimatePresence (the
// list never conditionally unmounts, so presence bookkeeping was pure cost).
export default function Showcase() {
  const { list, openProject } = useProjects();
  const featured = useMemo(() => {
    const live = list.filter((p) => isLiveCandidate(p.lang, p.name));
    return (live.length >= 3 ? live : list).slice(0, 8);
  }, [list]);

  return (
    <section id="showcase" className="section section--alt" style={{ paddingTop: 32 }}>
      <div className="container">
        <div className="section__eyebrow">03 — Selected Work</div>
        <div className="section__head">
          <h2>Selected Projects</h2>
        </div>
        <p className="muted">Interactive previews — click any card to open the live build.</p>

        <div className="showcase__wrap">
          <div className="showcase__track" style={{ transform: 'none' }}>
            {featured.map((p, i) => (
                <motion.div
                  key={p.name}
                  className="shot tilt"
                  onClick={() => openProject(p)}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: (i % 4) * 0.06, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="shot__thumb">
                    <img src={ogUrl(p.name)} alt={`${p.name} preview`} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://avatars.githubusercontent.com/u/178475619?v=4'; }} />
                  </div>
                  <div className="shot__body">
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                    <div className="shot__meta">
                      <span>{p.lang}</span><span>★ {p.stars ?? 0}</span><span>⑂ {p.forks ?? 0}</span>
                      <span>{isLiveCandidate(p.lang, p.name) ? '● Live' : domainLabel(p.domain || 'other')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
