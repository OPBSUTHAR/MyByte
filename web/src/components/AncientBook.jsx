import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Web Audio API paper-rustle sound ───────────────────────────────────────
let audioCtx = null;
function playPageSound() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const dur = 0.35;
    const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * dur, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      data[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI) * 0.3;
    }
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000;
    filter.Q.value = 0.8;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    src.connect(filter).connect(gain).connect(audioCtx.destination);
    src.start();
  } catch { /* audio unavailable */ }
}

// ─── Page content ───────────────────────────────────────────────────────────
const PAGES = [
  {
    num: 'I',
    title: 'Origins & Academic Foundation',
    img: 'https://avatars.githubusercontent.com/u/178475619?v=4',
    body: <>3rd Year BCA — <b>Regular, On-Campus</b> @ CHRIST (Deemed to be University), Yeshwantpur, Bengaluru. Batch 2024–27. Learning by shipping: first Git repos, first deploys, first live demos — fundamentals forged in public.</>,
  },
  {
    num: 'II',
    title: 'The 8 Elements — One Infinite System',
    img: 'https://opengraph.githubassets.com/1/OPBSUTHAR/BharatVista-Nexus',
    body: <><b>Land • Infrastructure • Power • AI/ML/DL/NLP • Agriculture • Space • Transportation • Ocean.</b> My life symbol is ∞ — a continuous loop where each element feeds the next. Research → Prototype → Ship → Iterate, across all eight domains.</>,
  },
  {
    num: 'III',
    title: 'Core Engineering Principles',
    img: 'https://opengraph.githubassets.com/1/OPBSUTHAR/Satora',
    body: <><b>Offline-first. ≤30KB. Frugal AI.</b> Systems that work when the internet doesn't — on low compute, for people who need it most. Precision &amp; polish over noise. If it doesn't ship live, it doesn't count.</>,
  },
  {
    num: 'IV',
    title: 'Future Roadmap & Collaboration',
    img: 'https://opengraph.githubassets.com/1/OPBSUTHAR/SpaceFlightMonitor',
    body: <>2026 → 2030: Ship 5 field-ready AI tools → frugal edge models &lt;10MB → systems for Bharat at 1M rural users → <b>MyByte as a product studio.</b> Seeking internships &amp; collabs in AI / Space / AgTech. Let's build.</>,
  },
];

// ─── Main component ─────────────────────────────────────────────────────────
export default function AncientBook() {
  const [open, setOpen] = useState(false);
  const [spread, setSpread] = useState(0); // -1 = cover, 0..1 = two spreads
  const [dragging, setDragging] = useState(null); // { leafIdx, startX, startTime }
  const bookRef = useRef(null);

  const flip = useCallback((dir) => {
    playPageSound();
    setSpread((s) => {
      const n = s + dir;
      if (n < -1) return -1;
      if (n > 1) return 1;
      return n;
    });
    if (!open) setOpen(true);
  }, [open]);

  // keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') flip(1);
      if (e.key === 'ArrowLeft') flip(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flip]);

  // drag page corner
  const onPointerDown = (e, leafIdx) => {
    if (spread <= leafIdx) return; // can't drag a leaf that hasn't been reached
    e.preventDefault();
    setDragging({ leafIdx, startX: e.clientX, startTime: Date.now() });
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragging.startX;
    const threshold = 80;
    if (dx < -threshold && spread > dragging.leafIdx) {
      flip(1);
      setDragging(null);
    } else if (dx > threshold && spread <= dragging.leafIdx) {
      flip(-1);
      setDragging(null);
    }
  };

  const onPointerUp = () => setDragging(null);

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [dragging, spread, flip]);

  const page = (i) => PAGES[i];

  return (
    <div className="book-stage" ref={bookRef}>
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
            <div
              className={`leaf leaf--${leafIdx} leaf--${state}`}
              key={leafIdx}
              aria-hidden={state === 'rest'}
              onPointerDown={(e) => onPointerDown(e, leafIdx)}
              style={{ cursor: spread > leafIdx ? 'grab' : 'default' }}
            >
              <div className="leaf__front page">
                <div className="page__inner">
                  <span className="page__num">[{String(leftIdx + 1).padStart(2, '0')}]</span>
                  <h3>{page(leftIdx)?.title}</h3>
                  <div className="page__img">
                    <img src={page(leftIdx)?.img} alt="" loading="lazy" />
                  </div>
                  <p>{page(leftIdx)?.body}</p>
                  <span className="page__mark">∞</span>
                </div>
              </div>
              <div className="leaf__back page">
                <div className="page__inner">
                  <span className="page__num">[{String(rightIdx + 1).padStart(2, '0')}]</span>
                  <h3>{page(rightIdx)?.title}</h3>
                  <div className="page__img">
                    <img src={page(rightIdx)?.img} alt="" loading="lazy" />
                  </div>
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
