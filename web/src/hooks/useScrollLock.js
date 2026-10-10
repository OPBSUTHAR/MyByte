import { useEffect } from 'react';

// Ref-counted body scroll lock — N modals can lock at once; scroll unlocks
// only when the last one releases. Escape is handled topmost-first: each open
// modal registers its closer, only the last registration fires.
let locks = 0;
const closers = [];

export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    locks += 1;
    if (locks === 1) document.body.style.overflow = 'hidden';
    return () => {
      locks = Math.max(0, locks - 1);
      if (locks === 0) document.body.style.overflow = '';
    };
  }, [active]);
}

export function useTopmostEscape(active, onClose) {
  useEffect(() => {
    if (!active) return;
    closers.push(onClose);
    const onKey = (e) => {
      if (e.key === 'Escape' && closers[closers.length - 1] === onClose) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      const i = closers.indexOf(onClose);
      if (i >= 0) closers.splice(i, 1);
    };
  }, [active, onClose]);
}
