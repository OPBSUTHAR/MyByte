import { useEffect, useRef, useState } from 'react';
import Reveal from '../components/Reveal';

// The ancient book — ported from the static story.html Three.js page into a
// pure CSS-3D flipbook: cover + spreads for the ∞ 8 elements, ←/→ keys and
// buttons, no scroll, viewport-fitted.

const CHAPTERS = [
  ['Land', 'Ground truth — GIS kernels, cadastral maps, soil data. Where data meets the soil.'],
  ['Infrastructure', 'SynchroGroundedNet, Econnect — networks that connect, systems that last.'],
  ['Power', 'Energy-aware scheduling, frugal compute, offline-first power logic.'],
  ['AI / ML / DL / NLP', 'Agnirva NEAT 5.0, ai-scanner, CrimeIntel — machines that see and read.'],
  ['Agriculture', 'Krishi-Gati-AI — farm advisory that works on 2G and offline.'],
  ['Space', 'SGP4 ground-tracks, SpaceFlightMonitor, BharatVista satellite.html.'],
  ['Transportation', 'railway, Aviation_NLP — mobility with precision under latency.'],
  ['Ocean', 'Coastal open-data, fisheries, climate — the loop returns to the source.'],
];

export default function Story() {
  const [open, setOpen] = useState(false);
  const [spread, setSpread] = useState(0);
  const touchX = useRef(null);

  // spread -1 = cover, 0..3 = four two-page spreads
  const maxSpread = Math.ceil(CHAPTERS.length / 2) - 1;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setSpread((s) => Math.min(maxSpread, s + 1));
      if (e.key === 'ArrowLeft') setSpread((s) => Math.max(-1, s - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [maxSpread]);

  const flip = (dir) => {
    setSpread((s) => {
      const n = s + dir;
      if (n < -1) return -1;
      if (n > maxSpread) return maxSpread;
      return n;
    });
    if (!open) setOpen(true);
  };

  const page = (i) => CHAPTERS[i];

  return (
    <section className="section story-page">
      <div className="container">
        <div className="section__eyebrow">Story • Ancient Book — ∞ 8 Elements</div>
        <h1 style={{ fontFamily: 'Fraunces,serif', fontSize: 'clamp(2rem,4vw,3rem)', margin: 0 }}>
          Stories as <span className="grad grad-anim">manuscripts</span>
        </h1>
        <p className="story-sub">The ∞ loop told as eight chapters — <b>← →</b> to turn the pages.</p>

        <Reveal className="book-stage">
          <div className={`book ${open ? 'is-open' : ''}`}>
            <div className="book__spine" aria-hidden="true" />

            {/* cover */}
            <div className={`book-cover ${open ? 'is-open' : ''}`}>
              <i className="corner tl" aria-hidden="true" /><i className="corner tr" aria-hidden="true" />
              <i className="corner bl" aria-hidden="true" /><i className="corner br" aria-hidden="true" />
              <div style={{ position: 'relative', fontFamily: 'Cinzel,serif', fontSize: '.6rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(232,201,154,.92)' }}>
                Liber • MyByte • MMXXVI — Yeshwantpur
              </div>
              <h2>MyByte —<br />Ancient Book</h2>
              <div className="seal">∞</div>
              <p><b>Omprakash Suthar</b> — 3rd Year BCA @ CHRIST Yeshwantpur • 42 repos<br />Stories &amp; marginalia from Land → Ocean.</p>
              <div className="cover-actions">
                <button className="btn btn--primary" onClick={() => { setOpen(true); setSpread((s) => (s < 0 ? 0 : s)); }}>Open book →</button>
                <a href="#/" className="btn btn--ghost">∞ Home</a>
              </div>
              <div className="ornament" style={{ position: 'relative', marginTop: 10, color: 'rgba(232,201,154,.88)' }}>❦ ─── ✦ ─── ❦</div>
            </div>

            {/* flipping leaves */}
            {[0, 1, 2, 3].map((leafIdx) => {
              const leftIdx = leafIdx * 2;
              const rightIdx = leafIdx * 2 + 1;
              const state = spread > leafIdx ? 'flipped' : spread === leafIdx ? 'turning' : 'rest';
              return (
                <div className={`leaf leaf--${leafIdx} leaf--${state}`} key={leafIdx} aria-hidden={state === 'rest'}>
                  <div className="leaf__front page">
                    <div className="page__inner">
                      <span className="page__num">[{String(leftIdx + 1).padStart(2, '0')}]</span>
                      <h3>{page(leftIdx)?.[0]}</h3>
                      <p>{page(leftIdx)?.[1]}</p>
                      <span className="page__mark">∞</span>
                    </div>
                  </div>
                  <div className="leaf__back page">
                    <div className="page__inner">
                      <span className="page__num">[{String(rightIdx + 1).padStart(2, '0')}]</span>
                      <h3>{page(rightIdx)?.[0]}</h3>
                      <p>{page(rightIdx)?.[1]}</p>
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
              {spread < 0 ? 'Cover' : `Spread ${spread + 1} / ${maxSpread + 1}`}
            </span>
            <button className="ctrl" onClick={() => flip(1)} aria-label="Next">Next →</button>
          </div>
          <div className="book-dots" aria-hidden="true">
            {Array.from({ length: maxSpread + 2 }, (_, i) => (
              <button
                key={i}
                className={`book-dot ${spread === i - 1 ? 'active' : ''}`}
                onClick={() => { setOpen(true); setSpread(i - 1); }}
                aria-label={i === 0 ? 'Cover' : `Spread ${i}`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
