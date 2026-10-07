import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const LINKS = [
  { href: '#vision', label: 'Vision' },
  { href: '#domains', label: 'Domains' },
  { href: '#featured', label: 'Case Studies' },
  { href: '#work', label: 'Work' },
  { href: '#goals', label: 'Goals' },
  { href: '#stack', label: 'Stack' },
  { href: '#about', label: 'About' },
  { href: '#journey', label: 'Journey' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#vision');

  // scroll-spy on the section nodes
  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive('#' + e.target.id); }),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <header className="nav">
      <div className="container nav__inner">
        <motion.a
          className="logo" href="#top"
          initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
        >
          <span className="logo__mark">MB</span><span>MyByte</span>
          <span style={{ fontWeight: 500, color: 'var(--muted)', fontSize: '.82rem', marginLeft: 4 }}>by Omprakash</span>
        </motion.a>

        <nav className={`nav__links ${open ? 'open' : ''}`}>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.href ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a className="btn btn--sm btn--glow" href="https://github.com/OPBSUTHAR" target="_blank" rel="noopener">GitHub ↗</a>
        </nav>

        <div className="nav__actions">
          <button className="icon-btn" aria-label="Toggle theme" onClick={onToggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="icon-btn nav__burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>☰</button>
        </div>
      </div>
    </header>
  );
}
