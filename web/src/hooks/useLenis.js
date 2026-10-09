import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReduce } from './useCountUp';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling wired into GSAP's ticker so ScrollTrigger stays in
 * sync. Also intercepts in-page anchor clicks for smooth scrollTo, and drives
 * the top scroll-progress bar. Disabled entirely under prefers-reduced-motion.
 */
export function useLenis() {
  useEffect(() => {
    if (prefersReduce()) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 1 });
    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    // global smooth-scroll helper used by nav / route changes
    window.__scrollToId = (id) => {
      if (id === 'top') lenis.scrollTo(0, { duration: 1.1 });
      else {
        const el = document.getElementById(id);
        if (el) lenis.scrollTo(el, { offset: -64, duration: 1.1 });
      }
    };

    // scroll progress bar
    const onLenisScroll = (e) => {
      const bar = document.getElementById('progress');
      if (!bar) return;
      const limit = lenis.limit || 1;
      const p = typeof e?.progress === 'number' ? e.progress : (lenis.scroll || 0) / limit;
      bar.style.width = `${Math.min(100, Math.max(0, p * 100)).toFixed(1)}%`;
    };
    lenis.on('scroll', onLenisScroll);

    // smooth in-page anchor navigation (route links "#/..." are left alone)
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]:not([href^="#/"])');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      if (href === '#top') {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        const el = document.querySelector(href);
        if (el) lenis.scrollTo(el, { offset: -64, duration: 1.2 });
      }
      history.replaceState(null, '', href);
    };
    document.addEventListener('click', onClick);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.off('scroll', onScroll);
      lenis.off('scroll', onLenisScroll);
      document.removeEventListener('click', onClick);
      lenis.destroy();
    };
  }, []);
}
