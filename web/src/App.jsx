import { useCallback, useEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
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
import ResumeModal from './components/ResumeModal';
import StoryModal from './components/StoryModal';
import { Vision, InfinitySection, Domains, Cases, Goals, Stack, About, Journey, Contact } from './components/sections';
import Story from './pages/Story';
import NotFound from './pages/NotFound';

import { ProjectsContext } from './ProjectsContext';
import { loadProjects, projectDomain } from './lib/github';
import { useLenis } from './hooks/useLenis';
import { useRoute } from './router';

gsap.registerPlugin(ScrollTrigger);

// Single obsidian theme — no light mode, no toggle, no persistence.
// data-theme="dark" is set statically in index.html.
export default function App() {
  const route = useRoute();
  const isHome = route === '/';

  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState(null);
  const [ready, setReady] = useState(false);
  const [frugal, setFrugal] = useState(true);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);

  useLenis();

  // frugal → bloat mode
  useEffect(() => {
    document.documentElement.classList.toggle('bloat', !frugal);
  }, [frugal]);

  // preloader hand-off → hero intro timeline
  const handleReady = useCallback(() => {
    setReady(true);
  }, []);

  // fail-safe: if the preloader ever stalls, force the handoff so the hero
  // can never deadlock invisible (single place — covers Hero + Terminal).
  useEffect(() => {
    if (ready) return;
    const t = setTimeout(() => setReady(true), 4000);
    return () => clearTimeout(t);
  }, [ready]);

  // data — load once, never throws (falls back to cache → curated)
  useEffect(() => {
    let alive = true;
    loadProjects().then(({ list }) => {
      if (!alive) return;
      setProjects(list.map((p) => ({ ...p, domain: p.domain || projectDomain(p.name) })));
    });
    return () => { alive = false; };
  }, []);

  // single ScrollTrigger re-measure: fires after render commits for the new
  // projects / route / ready state, plus once when webfonts land (they shift
  // layout). Replaces the old triple-refresh (rAF + 400ms timeout + handoff).
  useEffect(() => {
    let raf = 0;
    const refresh = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    refresh();
    let cancelled = false;
    document.fonts?.ready.then(() => { if (!cancelled) refresh(); }).catch(() => {});
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, [projects, ready, route]);

  // scroll to top on route change
  useEffect(() => {
    window.__scrollToId?.('top');
  }, [route]);

  const ctx = useMemo(() => ({
    list: projects,
    openProject: (p) => setActive(p),
  }), [projects]);

  const handleFrugal = useCallback((v) => {
    setFrugal(v);
  }, []);

  const home = isHome && (
    <>
      <Hero
        ready={ready}
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
      <SpeedInsights />
      <ProjectsContext.Provider value={ctx}>
        <div id="progress" />
        <Background />
        <div className="grain" aria-hidden="true" />
        {isHome && !ready && <Preloader onDone={handleReady} />}
        <Cursor />
        <Nav onOpenResume={() => setResumeOpen(true)} />

        <main>
          {isHome && home}
          {route === '/story' && <Story />}
          {!isHome && route !== '/story' && <NotFound />}
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
