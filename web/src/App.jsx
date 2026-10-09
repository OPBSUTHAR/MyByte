import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
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
import QuestHud from './components/QuestHud';
import Spotlight from './components/Spotlight';
import ThemeToggle from './components/ThemeToggle';
import { Vision, InfinitySection, Domains, Cases, Goals, Stack, About, Journey, Contact } from './components/sections';
import Resume from './pages/Resume';
import Story from './pages/Story';
import NotFound from './pages/NotFound';

import { ProjectsContext } from './ProjectsContext';
import { loadProjects, projectDomain, domainLabel, isLiveCandidate } from './lib/github';
import { useLenis } from './hooks/useLenis';
import { useRoute } from './router';
import { useQuest } from './hooks/useQuest';
import { useVisits } from './hooks/useVisits';
import { confettiBurst } from './fx/confetti';

gsap.registerPlugin(ScrollTrigger);

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const SECTION_QUESTS = ['vision', 'domains', 'work', 'case', 'contact'];

export default function App() {
  const route = useRoute();
  const quest = useQuest();
  const visits = useVisits();

  const [theme, setTheme] = useState(() => (localStorage.getItem('theme') === 'light' ? 'light' : 'dark'));
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState(null);
  const [ready, setReady] = useState(false);
  const [frugal, setFrugal] = useState(true);
  const [arcade, setArcade] = useState(false);
  const konamiIdx = useRef(0);

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
    if (route === '/resume') quest.award('resume');
    if (route === '/story') quest.award('story');
  }, [route]); // eslint-disable-line react-hooks/exhaustive-deps

  // section exploration XP
  useEffect(() => {
    if (!ready || route !== '/') return;
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        const match = SECTION_QUESTS.find((s) => id === s || (s === 'case' && id === 'featured'));
        if (match) quest.award(match);
      }),
      { threshold: 0.35 }
    );
    SECTION_QUESTS.forEach((s) => {
      const el = document.getElementById(s === 'case' ? 'featured' : s);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ready, route, quest]);

  // Konami code → Retro Arcade Mode
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      konamiIdx.current = k === KONAMI[konamiIdx.current] ? konamiIdx.current + 1 : (k === KONAMI[0] ? 1 : 0);
      if (konamiIdx.current === KONAMI.length) {
        konamiIdx.current = 0;
        setArcade(true);
        quest.award('konami');
        confettiBurst({ count: 160, y: innerHeight * 0.2 });
        setTimeout(() => confettiBurst({ x: innerWidth * 0.2, y: innerHeight * 0.4, count: 80 }), 400);
        setTimeout(() => confettiBurst({ x: innerWidth * 0.8, y: innerHeight * 0.4, count: 80 }), 800);
        setTimeout(() => setArcade(false), 9000);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [quest]);

  const ctx = useMemo(() => ({
    list: projects,
    source: 'github',
    openProject: (p) => { setActive(p); quest.award('modal'); },
    live: (name) => isLiveCandidate((projects.find((x) => x.name === name) || {}).lang, name),
    domain: projectDomain,
    domainLabel,
  }), [projects, quest]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
    quest.award('theme');
  }, [quest]);

  const handleTerminalTheme = useCallback((t) => {
    setTheme(t === 'light' ? 'light' : 'dark');
  }, []);

  const handleFrugal = useCallback((v) => {
    setFrugal(v);
    if (!v) {
      quest.award('frugal');
      confettiBurst({ count: 70, y: innerHeight * 0.35 });
    }
  }, [quest]);

  const handleCommand = useCallback((cmd) => {
    quest.award('terminal');
    if (cmd === 'run demo') {
      setTimeout(() => confettiBurst({ count: 120, y: innerHeight * 0.3 }), 350);
    }
  }, [quest]);

  const home = route === '/' && (
    <>
      <Hero
        ready={ready}
        theme={theme}
        onCommand={handleCommand}
        onTheme={handleTerminalTheme}
        onFrugal={handleFrugal}
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
      <ProjectsContext.Provider value={ctx}>
        <div id="progress" />
        <Background />
        <Spotlight />
        <div className="grain" aria-hidden="true" />
        {!ready && <Preloader onDone={handleReady} />}
        <Cursor />
        <Nav theme={theme} onToggleTheme={toggleTheme} />

        <main>
          {route === '/' && home}
          {route === '/resume' && <Resume />}
          {route === '/story' && <Story />}
          {route !== '/' && route !== '/resume' && route !== '/story' && <NotFound />}
        </main>

        <footer className="footer">
          <div className="container footer__inner">
            <p>© 2026 <b>Omprakash Suthar</b> — MyByte. Full-stack React build: Vite • React • GSAP • Lenis • Motion • Three.js • PixiJS. <a href="https://github.com/OPBSUTHAR/MyByte" target="_blank" rel="noopener">Source ↗</a></p>
            <p className="small muted">
              Live at https://my-byte.vercel.app
              {visits != null && <> • 👣 Total visits: <b>{visits}</b></>}
            </p>
          </div>
        </footer>

        {arcade && <div className="arcade-banner">🕹 Retro Arcade Mode — 9 seconds of glory</div>}
        {!frugal && <div className="bloat-banner">⚠ Bloat mode — frugal = false (+42KB)</div>}

        <QuestHud quest={quest} visible={ready} />
        <Modal project={active} onClose={() => setActive(null)} />
      </ProjectsContext.Provider>
    </MotionConfig>
  );
}
