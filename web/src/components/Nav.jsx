import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useRoute, navigate } from '../router';
import ThemeToggle from './ThemeToggle';

const SECTIONS = [
  { id: 'vision', label: 'Vision' },
  { id: 'domains', label: 'Domains' },
  { id: 'featured', label: 'Case Studies' },
  { id: 'work', label: 'Work' },
  { id: 'goals', label: 'Goals' },
  { id: 'stack', label: 'Stack' },
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav({ theme, onToggleTheme, onOpenResume }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const route = useRoute();

  // scroll-spy on the section nodes (home only)
  useEffect(() => {
    if (route !== '/') return;
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive('#' + e.target.id); }),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [route]);

  // section link: go home first if on another route, then smooth-scroll
  const goSection = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    const scroll = () => window.__scrollToId?.(id);
    if (route !== '/') {
      navigate('/');
      setTimeout(scroll, 120);
    } else {
      scroll();
    }
  };

  return (
    <header className="nav">
      <div className="nav__inner">
        {/* LEFT ZONE — brand */}
        <motion.div
          className="nav__brand"
          initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
        >
          <button
            type="button"
            className="logo"
            onClick={() => { navigate('/'); setTimeout(() => window.__scrollToId?.('top'), 120); }}
          >
            <span className="logo__mark">MB</span>
            <span className="logo__text">
              <span className="logo__name">MyByte</span>
              <span className="logo__sub">by OPBSUTHAR</span>
            </span>
          </button>
        </motion.div>

        {/* CENTER ZONE — navigation links */}
        <nav className={`nav__links ${open ? 'open' : ''}`}>
          <button
            type="button"
            className={route === '/' ? 'active' : ''}
            style={linkStyle}
            onClick={() => { setOpen(false); navigate('/'); setTimeout(() => window.__scrollToId?.('top'), 120); }}
          >
            Home
          </button>
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={active === `#${s.id}` ? 'active' : ''} onClick={goSection(s.id)}>
              {s.label}
            </a>
          ))}
          <button
            type="button"
            style={linkStyle}
            onClick={(e) => { e.preventDefault(); setOpen(false); onOpenResume(); }}
          >
            Resume
          </button>
          <a href="#/story" className={route === '/story' ? 'active' : ''} onClick={() => setOpen(false)}>Story</a>
        </nav>

        {/* RIGHT ZONE — actions */}
        <div className="nav__actions">
          <a className="nav__github" href="https://github.com/OPBSUTHAR" target="_blank" rel="noopener">
            <span>GitHub</span> <span aria-hidden="true">↗</span>
          </a>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button className="icon-btn nav__burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>☰</button>
        </div>
      </div>
    </header>
  );
}

const linkStyle = {
  background: 'none', border: 0, cursor: 'pointer', padding: 0,
  font: 'inherit', color: 'var(--text)', fontWeight: 500, opacity: .78, fontSize: '.875rem',
};
