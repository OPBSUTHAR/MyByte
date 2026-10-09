import { useCallback, useEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './styles/site.css';
import './styles/overrides.css';

import Background from './components/Background';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import AnimationLab from './components/AnimationLab';
import Showcase from './components/Showcase';
import Work from './components/Work';
import Modal from './components/Modal';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import { Vision, InfinitySection, Domains, Cases, Goals, Stack, About, Journey, Contact } from './components/sections';

import { ProjectsContext } from './ProjectsContext';
import { loadProjects, projectDomain, domainLabel, isLiveCandidate } from './lib/github';
import { useLenis } from './hooks/useLenis';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState(null);
  const [ready, setReady] = useState(false);

  useLenis();

  // theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // preloader hand-off → hero intro timeline + re-measure pinned triggers
  const handleReady = useCallback(() => {
    setReady(true);
    requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
  }, []);

  // data
  useEffect(() => {
    let alive = true;
    loadProjects().then(({ list }) => {
      if (!alive) return;
      setProjects(list.map((p) => ({ ...p, domain: p.domain || projectDomain(p.name) })));
      // let layout settle, then re-measure GSAP triggers for the injected cards
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => clearTimeout(id);
  }, [projects]);

  const ctx = useMemo(() => ({
    list: projects,
    source: 'github',
    openProject: (p) => setActive(p),
    live: (name) => isLiveCandidate((projects.find((x) => x.name === name) || {}).lang, name),
    domain: projectDomain,
    domainLabel,
  }), [projects]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  return (
    <MotionConfig reducedMotion="user">
      <ProjectsContext.Provider value={ctx}>
        <div id="progress" />
        <Background />
        {!ready && <Preloader onDone={handleReady} />}
        <Cursor />
        <Nav theme={theme} onToggleTheme={toggleTheme} />

        <main>
          <Hero ready={ready} />
          <Highlights />
          <Vision />
          <InfinitySection />
          <Domains />
          <Cases />
          <Showcase />
          <Work />
          <Goals />
          <Stack />
          <AnimationLab />
          <About />
          <Journey />
          <Contact />
        </main>

        <footer className="footer">
          <div className="container footer__inner">
            <p>© 2026 <b>Omprakash Suthar</b> — MyByte. React build: Motion • Anime.js • Theatre.js • Lottie • Three.js • Spline • PixiJS • Popmotion • Mo.js • GSAP • Lenis • SplitType-style reveal. <a href="https://github.com/OPBSUTHAR/MyByte" target="_blank" rel="noopener">Source ↗</a></p>
            <p className="small muted">Live at https://my-byte.vercel.app — Vercel auto-deploys on push to main. Static GitHub Pages build remains at the repo root.</p>
          </div>
        </footer>

        <Modal project={active} onClose={() => setActive(null)} />
      </ProjectsContext.Provider>
    </MotionConfig>
  );
}
