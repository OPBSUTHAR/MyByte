import { useEffect, useState } from 'react';

// The ancient book — CSS-3D flipbook with leather cover + parchment pages.
// Shared by the Story page route and the Storybook modal.

const PAGES = [
  {
    num: 'I',
    title: 'Origins & Academic Foundation',
    body: <>3rd Year BCA — <b>Regular, On-Campus</b> @ CHRIST (Deemed to be University), Yeshwantpur, Bengaluru. Batch 2024–27. Learning by shipping: first Git repos, first deploys, first live demos — fundamentals forged in public.</>,
  },
  {
    num: 'II',
    title: 'The 8 Elements — One Infinite System',
    body: <><b>Land • Infrastructure • Power • AI/ML/DL/NLP • Agriculture • Space • Transportation • Ocean.</b> My life symbol is ∞ — a continuous loop where each element feeds the next. Research → Prototype → Ship → Iterate, across all eight domains.</>,
  },
  {
    num: 'III',
    title: 'Core Engineering Principles',
    body: <><b>Offline-first. ≤30KB. Frugal AI.</b> Systems that work when the internet doesn't — on low compute, for people who need it most. Precision &amp; polish over noise. If it doesn't ship live, it doesn't count.</>,
  },
  {
    num: 'IV',
    title: 'Future Roadmap & Collaboration',
    body: <>2026 → 2030: Ship 5 field-ready AI tools → frugal edge models &lt;10MB → systems for Bharat at 1M rural users → <b>MyByte as a product studio.</b> Seeking internships &amp; collabs in AI / Space / AgTech. Let's build.</>,
  },
];

export default function AncientBook() {
  const [open, setOpen] = useState(false);
  const [spread, setSpread] = useState(0); // -1 = cover, 0..1 = two two-page spreads

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setSpread((s) => Math.min(1, s + 1));
      if (e.key === 'ArrowLeft') setSpread((s) => Math.max(-1, s - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const flip = (dir) => {
    setSpread((s) => {
      const n = s + dir;
      if (n < -1) return -1;
      if (n > 1) return 1;
      return n;
    });
    if (!open) setOpen(true);
  };

  const page = (i) => PAGES[i];

  return (
    <div className="book-stage">
      <div className={`book ${open ? 'is-open' : ''}`}>
        <div className="book__spine" aria-hidden="true" />

        {/* leather cover */}
        <div className={`book-cover ${open ? 'is-open' : ''}`}>
          <i className="corner tl" aria-hidden="true" /><i className="corner tr" aria-hidden="true" />
          <i className="corner bl" aria-hidden="true" /><i className="corner br" aria-hidden="true" />
          <div className="book-cover__label">Liber • MyByte • MMXXVI — Yeshwantpur</div>
          <h2>MyByte —<br />Ancient Book</h2>
          <div className="seal">∞</div>
          <p><b>Omprakash Suthar</b> — 3rd Year BCA @ CHRIST Yeshwantpur • 42 repos<br />Stories &amp; marginalia from Land → Ocean.</p>
          <div className="cover-actions">
            <button className="btn btn--primary" onClick={() => { setOpen(true); setSpread((s) => (s < 0 ? 0 : s)); }}>Open book →</button>
          </div>
          <div className="ornament" aria-hidden="true">❦ ─── ✦ ─── ❦</div>
        </div>

        {/* flipping leaves — 2 leaves = 4 pages */}
        {[0, 1].map((leafIdx) => {
          const leftIdx = leafIdx * 2;
          const rightIdx = leafIdx * 2 + 1;
          const state = spread > leafIdx ? 'flipped' : 'rest';
          return (
            <div className={`leaf leaf--${leafIdx} leaf--${state}`} key={leafIdx} aria-hidden={state === 'rest'}>
              <div className="leaf__front page">
                <div className="page__inner">
                  <span className="page__num">[{String(leftIdx + 1).padStart(2, '0')}]</span>
                  <h3>{page(leftIdx)?.title}</h3>
                  <p>{page(leftIdx)?.body}</p>
                  <span className="page__mark">∞</span>
                </div>
              </div>
              <div className="leaf__back page">
                <div className="page__inner">
                  <span className="page__num">[{String(rightIdx + 1).padStart(2, '0')}]</span>
                  <h3>{page(rightIdx)?.title}</h3>
                  <p>{page(rightIdx)?.body}</p>
                  <span className="page__mark">∞</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* static right page underneath the leaves */}
        <div className="page page--static">
          <div className="page__inner">
            <span className="page__num">[Fin]</span>
            <h3>The loop continues</h3>
            <p>Research → Prototype → Ship → Iterate — across all eight elements. ∞</p>
            <span className="page__mark">∞</span>
          </div>
        </div>
      </div>

      <div className="book-controls">
        <button className="ctrl" onClick={() => flip(-1)} aria-label="Previous">← Prev</button>
        <span className="spread-idx">
          {spread < 0 ? 'Cover' : `Page ${spread + 1} / 2`}
        </span>
        <button className="ctrl" onClick={() => flip(1)} aria-label="Next">Next →</button>
      </div>
      <div className="book-dots" aria-hidden="true">
        {Array.from({ length: 3 }, (_, i) => (
          <button
            key={i}
            className={`book-dot ${spread === i - 1 ? 'active' : ''}`}
            onClick={() => { setOpen(true); setSpread(i - 1); }}
            aria-label={i === 0 ? 'Cover' : `Page ${i}`}
          />
        ))}
      </div>
    </div>
  );
}
