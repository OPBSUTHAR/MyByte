import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { liveUrl, ogUrl } from '../lib/github';
import { useScrollLock, useTopmostEscape } from '../hooks/useScrollLock';

export default function Modal({ project, onClose }) {
  const [tab, setTab] = useState('live');
  const [failed, setFailed] = useState(false);
  const loadedRef = useRef(false);

  useScrollLock(!!project);
  useTopmostEscape(!!project, onClose);

  useEffect(() => {
    if (!project) return;
    setTab('live');
    setFailed(false);
    loadedRef.current = false;
    // iframe onError never fires for X-Frame-Options / cross-origin blocks —
    // fall back to the OG preview if nothing loads within 10s
    const t = setTimeout(() => { if (!loadedRef.current) setFailed(true); }, 10000);
    return () => clearTimeout(t);
  }, [project]);

  const live = project ? liveUrl(project.name) : '#';

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="opencode-modal-backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(7,10,20,.72)', display: 'grid', placeItems: 'center', padding: 16 }}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-label={project.name}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            style={{ width: 'min(980px, 92vw)', maxHeight: '86vh', background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--line)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.6)' }}
          >
            <div className="modal__head">
              <div><h3>{project.name}</h3><p className="muted">{project.desc}</p></div>
              <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
            </div>
            <div className="modal__tabs">
              <button className={tab === 'live' ? 'active' : ''} onClick={() => setTab('live')}>◉ Live Preview</button>
              <button className={tab === 'code' ? 'active' : ''} onClick={() => setTab('code')}>Code</button>
            </div>
            <div className="modal__body">
              {tab === 'live' ? (
                <div className="modal__pane active">
                  <div className="browser">
                    <span /><span /><span /><b>{live}</b>
                    <a href={live} target="_blank" rel="noopener" className="btn btn--sm">Open ↗</a>
                  </div>
                  <div className="iframeWrap">
                    {failed ? (
                      <div className="fallback">
                        <p>Live demo not yet deployed — showing GitHub OG preview.</p>
                        <img src={ogUrl(project.name)} alt="preview" />
                      </div>
                    ) : (
                      <iframe title={`${project.name} live preview`} src={live} loading="lazy" onLoad={() => { loadedRef.current = true; }} onError={() => setFailed(true)} />
                    )}
                  </div>
                </div>
              ) : (
                <div className="modal__pane active">
                  <a id="mGithub" href={project.url} target="_blank" rel="noopener" className="btn btn--primary">View on GitHub ↗</a>
                  <p className="muted small">Stars + language + description are live from the GitHub API. Domain tags are a local factorial mapping.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
