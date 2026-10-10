import { useEffect, useState } from 'react';

// Footer visit counter — port of the old assets/js/visitors.js.
// Uses the public CounterAPI; falls back to a per-browser localStorage count.
export function useVisits() {
  const [count, setCount] = useState(null);
  useEffect(() => {
    const ctrl = new AbortController();
    let alive = true;
    const NS = 'opbsuthar-mybyte';
    const KEY = 'visits';
    fetch(`https://api.counterapi.dev/v1/${NS}/${KEY}/up`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((d) => { if (alive) setCount(d.count); })
      .catch(() => {
        if (!alive) return;
        const n = Number(localStorage.getItem('mybyte_visits') || 0) + 1;
        localStorage.setItem('mybyte_visits', String(n));
        setCount(n);
      });
    return () => { alive = false; ctrl.abort(); };
  }, []);
  return count;
}
