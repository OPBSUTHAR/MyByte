import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReduce } from '../hooks/useCountUp';

// 5 discoverable secrets: sudo (hire modal) · crt (konami) · matrix (rain) ·
// secret (cat secret.txt) · origin (traveler ×3). Progress persists in
// localStorage. Global typing listener ignores editable targets and open
// modals (body scroll-locked) so terminal input and the storybook arrows
// can never trigger secrets by accident.
const TOTAL = 5;
const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

const load = () => {
  try {
    const v = JSON.parse(localStorage.getItem('mybyte_secrets') || '[]');
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
};

export function useSecretEngine() {
  const [unlocked, setUnlocked] = useState(load);
  const [modal, setModal] = useState(null); // 'hire' | 'origin' | null
  const [matrixOn, setMatrixOn] = useState(false);
  const [crtOn, setCrtOn] = useState(false);
  const [toast, setToast] = useState(null);
  const ref = useRef(unlocked);
  const toastTimer = useRef(0);

  const unlock = useCallback((id, label) => {
    if (ref.current.includes(id)) return false;
    ref.current = [...ref.current, id];
    setUnlocked(ref.current);
    try { localStorage.setItem('mybyte_secrets', JSON.stringify(ref.current)); } catch { /* private mode */ }
    setToast({ id, label });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
    return true;
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const openMatrix = useCallback(() => {
    if (prefersReduce()) return false;
    setMatrixOn(true);
    return true;
  }, []);

  useEffect(() => {
    let ki = 0;
    let buf = '';
    const modalOpen = () => document.body.style.overflow === 'hidden';
    const editable = (t) => t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);

    const onKey = (e) => {
      if (e.key === 'Escape') { setMatrixOn(false); return; }
      if (editable(e.target) || modalOpen()) { ki = 0; buf = ''; return; }
      const k = e.key.toLowerCase();
      // konami → CRT cyber mode toggle
      if (k === KONAMI[ki]) {
        ki++;
        if (ki === KONAMI.length) {
          ki = 0;
          setCrtOn((c) => !c);
          unlock('crt', 'CRT CYBER MODE');
        }
      } else {
        ki = k === KONAMI[0] ? 1 : 0;
      }
      // typed keyword → matrix rain (bonus path; terminal has its own)
      if (k.length === 1) {
        buf = (buf + k).slice(-20);
        if (buf.includes('matrix')) {
          buf = '';
          if (openMatrix()) unlock('matrix', 'MATRIX RAIN');
        }
      }
    };

    const onSecret = (e) => {
      const id = e.detail?.id;
      if (id === 'matrix') { if (openMatrix()) unlock('matrix', 'MATRIX RAIN'); }
      else if (id === 'secret') unlock('secret', 'ORIGIN LOG');
      else if (id === 'sudo') { unlock('sudo', 'V.I.P. ACCESS'); setModal('hire'); }
      else if (id === 'origin') { unlock('origin', '∞ ORIGIN'); setModal('origin'); }
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('mybyte:secret', onSecret);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mybyte:secret', onSecret);
    };
  }, [unlock, openMatrix]);

  useEffect(() => {
    document.documentElement.classList.toggle('crt-mode', crtOn);
    return () => document.documentElement.classList.remove('crt-mode');
  }, [crtOn]);

  return { unlocked, modal, setModal, matrixOn, setMatrixOn, crtOn, toast, total: TOTAL };
}
