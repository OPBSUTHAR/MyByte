import { useEffect, useState } from 'react';

// Tiny hash router — no dependency. Routes:
//   #/          → home (all sections)
//   #/resume    → interactive resume
//   #/story     → ancient book
//   anything    → 404
// In-page section links (#vision, #work, …) are handled separately by
// Lenis scrollTo — see useLenis' anchor interceptor (it skips "#/" hrefs).

export function useRoute() {
  const read = () => {
    const h = window.location.hash.replace(/^#/, '');
    return h.startsWith('/') ? h : '/';
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

export function Link({ to, children, className, onClick, ...rest }) {
  return (
    <a href={`#${to}`} className={className} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}
