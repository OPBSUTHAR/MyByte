import { useEffect, useState } from 'react';

// Tiny hash router — no dependency. Routes:
//   #/ or #/story → ancient book
//   #story       → ancient book (no-slash fallback)
//   #/           → home (all sections)
//   anything     → 404
// In-page section links (#vision, #work, …) are handled separately by
// Lenis scrollTo — see useLenis' anchor interceptor (it skips "#/" hrefs).

const KNOWN = ['/story'];

export function useRoute() {
  const read = () => {
    const h = window.location.hash.replace(/^#/, '');
    const path = h.startsWith('/') ? h : (h ? `/${h}` : '/');
    return KNOWN.includes(path) ? path : (h === '' || h === '/' ? '/' : path);
  };
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const fn = () => setRoute(read());
    window.addEventListener('hashchange', fn);
    return () => window.removeEventListener('hashchange', fn);
  }, []);
  return route;
}

export function navigate(path) {
  window.location.hash = path;
}
