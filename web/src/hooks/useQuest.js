import { useCallback, useEffect, useRef, useState } from 'react';
import { confettiBurst } from '../lib/confetti';

// XP / achievement system. XP is earned by exploring; levels unlock titles.
// Persisted to localStorage. Emits toasts on level-up and achievement unlock.

const LEVELS = [
  { xp: 0, title: 'Explorer' },
  { xp: 60, title: 'Builder' },
  { xp: 140, title: 'Shipper' },
  { xp: 240, title: 'Code Inspector' },
  { xp: 360, title: '∞ Loop Runner' },
];

const ACHIEVEMENTS = [
  { id: 'first-scroll', label: 'First Steps', hint: 'Scroll past the hero', xp: 10 },
  { id: 'vision', label: 'North Star', hint: 'Read the vision', xp: 15 },
  { id: 'domains', label: 'Element Walker', hint: 'Travel the ∞ loop', xp: 20 },
  { id: 'work', label: 'Project Hunter', hint: 'Browse the work grid', xp: 15 },
  { id: 'case', label: 'Case Cracker', hint: 'Open a case study', xp: 15 },
  { id: 'modal', label: 'Live Tester', hint: 'Open a live preview', xp: 20 },
  { id: 'terminal', label: 'Command Runner', hint: 'Run a terminal command', xp: 20 },
  { id: 'easter', label: 'Easter Egg', hint: 'Find a hidden command', xp: 40 },
  { id: 'konami', label: 'Arcade Legend', hint: 'Enter the Konami code', xp: 50 },
  { id: 'theme', label: 'Alchemist', hint: 'Switch the theme', xp: 10 },
  { id: 'frugal', label: 'Bloat Mode', hint: 'Set frugal = false', xp: 25 },
  { id: 'resume', label: 'Paper Trail', hint: 'Open the resume', xp: 10 },
  { id: 'story', label: 'Bookworm', hint: 'Open the ancient book', xp: 15 },
  { id: 'contact', label: 'Signal Sent', hint: 'Reach the contact section', xp: 10 },
];

const STORE_KEY = 'mybyte-quest-v1';

export function useQuest() {
  const [xp, setXp] = useState(0);
  const [unlocked, setUnlocked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch { return {}; }
  });
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const unlockedRef = useRef(unlocked);
  unlockedRef.current = unlocked;

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(unlocked)); } catch { /* private mode */ }
  }, [unlocked]);

  const showToast = useCallback((msg, kind = 'xp') => {
    clearTimeout(toastTimer.current);
    setToast({ msg, kind, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const award = useCallback((id) => {
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (!a || unlockedRef.current[id]) return;
    setUnlocked((u) => ({ ...u, [a.id]: true }));
    setXp((v) => v + a.xp);
    showToast(`🏅 ${a.label} — +${a.xp} XP`, 'achievement');
    confettiBurst({ count: 60, y: innerHeight * 0.25 });
  }, [showToast]);

  const addXp = useCallback((n, label) => {
    setXp((v) => v + n);
    if (label) showToast(`+${n} XP — ${label}`, 'xp');
  }, [showToast]);

  const level = LEVELS.reduce((acc, l, i) => (xp >= l.xp ? { level: i + 1, title: l.title, next: LEVELS[i + 1] || null } : acc), { level: 1, title: LEVELS[0].title, next: LEVELS[1] });
  const progress = level.next ? (xp - LEVELS[level.level - 1].xp) / (level.next.xp - LEVELS[level.level - 1].xp) : 1;

  return { xp, level, progress, unlocked, award, addXp, toast, showToast };
}
