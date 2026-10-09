import { useEffect, useState } from 'react';

/** Reactive matchMedia hook — drives desktop-only effects (tilt, parallax, pins). */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof matchMedia !== 'undefined' ? matchMedia(query).matches : false
  );
  useEffect(() => {
    const mq = matchMedia(query);
    const fn = () => setMatches(mq.matches);
    mq.addEventListener('change', fn);
    setMatches(mq.matches);
    return () => mq.removeEventListener('change', fn);
  }, [query]);
  return matches;
}

/** Desktop-capable device: wide viewport + fine pointer. */
export const useDesktop = () => useMediaQuery('(min-width: 901px) and (pointer: fine)');
