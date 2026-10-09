import { useCallback, useEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './styles/site.css';
import './styles/overrides.css';

import Background from './components/Background';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Showcase from './components/Showcase';
import Work from './components/Work';
import Modal from './components/Modal';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import ThemeToggle from './components/ThemeToggle';
import ResumeModal from './components/ResumeModal';
import StoryModal from './components/StoryModal';
import { Vision, InfinitySection, Domains, Cases, Goals, Stack, About, Journey, Contact } from './components/sections';
import Story from './pages/Story';
import NotFound from './pages/NotFound';

import { ProjectsContext } from './ProjectsContext';
import { loadProjects, projectDomain, domainLabel, isLiveCandidate } from './lib/github';
import { useLenis } from './hooks/useLenis';
import { useRoute } from './router';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const route = useRoute();

  const [theme, setTheme] = useState(() => (localStorage.getItem('theme') === 'light' ? 'light' : 'dark'));
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState(null);
  const [ready, setReady] = useState(false);
  const [frugal, setFrugal] = useState(true);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);

  useLenis();

  // theme → data-theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // frugal → bloat mode
  useEffect(() => {
    document.documentElement.classList.toggle('bloat', !frugal);
  }, [frugal]);

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
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => clearTimeout(id);
  }, [projects]);

  // scroll to top on route change
  useEffect(() => {
    window.__scrollToId?.('top');
  }, [route]);

  const ctx = useMemo(() => ({
    list: projects,
    source: 'github',
    openProject: (p) => setActive(p),
    live: (name) => isLiveCandidate((projects.find((x) => x.name === name) || {}).lang, name),
    domain: projectDomain,
    domainLabel,
  }), [projects]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleTerminalTheme = useCallback((t) => {
    setTheme(t === 'light' ? 'light' : 'dark');
  }, []);

  const handleFrugal = useCallback((v) => {
    setFrugal(v);
  }, []);

  const handleCommand = useCallback(() => {}, []);

  const home = route === '/' && (
    <>
      <Hero
        ready={ready}
        theme={theme}
        onCommand={handleCommand}
        onTheme={handleTerminalTheme}
        onFrugal={handleFrugal}
        onOpenStory={() => setStoryOpen(true)}
      />
      <Highlights />
      <Vision />
      <InfinitySection />
      <Domains />
      <Cases />
      <Showcase />
      <Work />
      <Goals />
      <Stack />
      <About />
      <Journey />
      <Contact />
    </>
  );

  return (
    <MotionConfig reducedMotion="user">
      <Analytics />
      <ProjectsContext.Provider value={ctx}>
        <div id="progress" />
        <Background />
        <div className="grain" aria-hidden="true" />
        {!ready && <Preloader onDone={handleReady} />}
        <Cursor />
        <Nav theme={theme} onToggleTheme={toggleTheme} onOpenResume={() => setResumeOpen(true)} />

        <main>
          {route === '/' && home}
          {route === '/story' && <Story />}
          {route !== '/' && route !== '/story' && <NotFound />}
        </main>

        <footer className="footer">
          <div className="container footer__inner">
            <p>© 2026 Omprakash Suthar — Built with precision. <a href="https://github.com/OPBSUTHAR/MyByte" target="_blank" rel="noopener">Source Code ↗</a></p>
          </div>
        </footer>

        {!frugal && <div className="bloat-banner">⚠ Bloat mode — frugal = false (+42KB)</div>}

        <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
        <StoryModal open={storyOpen} onClose={() => setStoryOpen(false)} />
        <Modal project={active} onClose={() => setActive(null)} />
      </ProjectsContext.Provider>
    </MotionConfig>
  );
}
