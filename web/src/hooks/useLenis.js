import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReduce } from './useCountUp';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling wired into GSAP's ticker so ScrollTrigger stays in
 * sync. Also intercepts in-page anchor clicks for smooth scrollTo, and drives
 * the top scroll-progress bar. Under prefers-reduced-motion Lenis stays off
 * but window.__scrollToId still works via native smooth scrolling.
 */
export function useLenis() {
  useEffect(() => {
    // progress-bar node is cached once; width writes are rAF-throttled so a
    // scroll storm forces at most one style flush per frame.
    const bar = document.getElementById('progress');
    let pending = false;
    let latest = 0;
    const paintBar = (p) => {
      if (!bar) return;
      latest = p;
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        bar.style.width = `${(Math.min(100, Math.max(0, latest)) * 100).toFixed(1)}%`;
      });
    };

    if (prefersReduce()) {
      window.__scrollToId = (id) => {
        if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
        else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      return () => { delete window.__scrollToId; };
    }

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
      const limit = lenis.limit || 1;
      const p = typeof e?.progress === 'number' ? e.progress : (lenis.scroll || 0) / limit;
      paintBar(p);
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

    return () => {
      gsap.ticker.remove(raf);
      lenis.off('scroll', onScroll);
      lenis.off('scroll', onLenisScroll);
      document.removeEventListener('click', onClick);
      lenis.destroy();
      delete window.__scrollToId;
    };
  }, []);
}
