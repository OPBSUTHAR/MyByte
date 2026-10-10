import { useCallback, useEffect, useState } from 'react';

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
    filter.frequency.value = 3200;
    filter.Q.value = 0.8;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.14, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    src.connect(filter).connect(gain).connect(audioCtx.destination);
    src.start();
  } catch { /* audio unavailable */ }
}

// ─── Inline SVG manuscript illustrations (no external repo cards) ────────────
const ART = {
  origins: (
    <svg viewBox="0 0 320 120" role="img" aria-label="Academic foundation illustration">
      <rect x="4" y="4" width="312" height="112" rx="10" fill="none" stroke="#C5A059" strokeWidth="1" opacity=".5"/>
      <path d="M60 96 L160 40 L260 96" fill="none" stroke="#C5A059" strokeWidth="2"/>
      <rect x="100" y="66" width="120" height="30" fill="none" stroke="#8A6D3B" strokeWidth="1.5"/>
      <line x1="130" y1="66" x2="130" y2="96" stroke="#8A6D3B" strokeWidth="1"/>
      <line x1="190" y1="66" x2="190" y2="96" stroke="#8A6D3B" strokeWidth="1"/>
      <circle cx="160" cy="28" r="10" fill="none" stroke="#C5A059" strokeWidth="1.5"/>
      <text x="160" y="32" textAnchor="middle" fontSize="11" fill="#C5A059" fontFamily="serif">∞</text>
      <text x="160" y="112" textAnchor="middle" fontSize="8" fill="#8A6D3B" fontFamily="monospace" letterSpacing="2">MMXXIV — MMXXVII</text>
    </svg>
  ),
  elements: (
    <svg viewBox="0 0 320 120" role="img" aria-label="Eight elements illustration">
      <rect x="4" y="4" width="312" height="112" rx="10" fill="none" stroke="#C5A059" strokeWidth="1" opacity=".5"/>
      <ellipse cx="160" cy="60" rx="110" ry="34" fill="none" stroke="#C5A059" strokeWidth="2"/>
      <ellipse cx="160" cy="60" rx="34" ry="34" fill="none" stroke="#8A6D3B" strokeWidth="1.5"/>
      {[[70,60],[250,60],[160,26],[160,94],[105,38],[215,38],[105,82],[215,82]].map(([cx,cy],i)=>(
        <g key={i}>
          <rect x={cx-9} y={cy-9} width="18" height="18" rx="4" fill="none" stroke="#8A6D3B" strokeWidth="1.2"/>
          <text x={cx} y={cy+3.5} textAnchor="middle" fontSize="9" fill="#C5A059" fontFamily="monospace">{[1,2,3,4,5,6,7,8][i]}</text>
        </g>
      ))}
      <text x="160" y="112" textAnchor="middle" fontSize="8" fill="#8A6D3B" fontFamily="monospace" letterSpacing="2">LAND → OCEAN</text>
    </svg>
  ),
  principles: (
    <svg viewBox="0 0 320 120" role="img" aria-label="Engineering principles illustration">
      <rect x="4" y="4" width="312" height="112" rx="10" fill="none" stroke="#C5A059" strokeWidth="1" opacity=".5"/>
      <circle cx="160" cy="58" r="26" fill="none" stroke="#C5A059" strokeWidth="2"/>
      <path d="M160 32 L160 84 M134 58 L186 58 M142 40 L178 76 M178 40 L142 76" stroke="#8A6D3B" strokeWidth="1.2" fill="none"/>
      <text x="160" y="63" textAnchor="middle" fontSize="10" fill="#C5A059" fontFamily="monospace">∞</text>
      <text x="40" y="104" fontSize="8" fill="#8A6D3B" fontFamily="monospace">≤30KB</text>
      <text x="280" y="104" textAnchor="end" fontSize="8" fill="#8A6D3B" fontFamily="monospace">OFFLINE-FIRST</text>
    </svg>
  ),
  roadmap: (
    <svg viewBox="0 0 320 120" role="img" aria-label="Roadmap illustration">
      <rect x="4" y="4" width="312" height="112" rx="10" fill="none" stroke="#C5A059" strokeWidth="1" opacity=".5"/>
      <path d="M24 92 C 90 88, 130 60, 180 52 S 280 36, 296 30" fill="none" stroke="#C5A059" strokeWidth="2" strokeDasharray="5 4"/>
      {[[24,92],[110,70],[180,52],[296,30]].map(([cx,cy],i)=>(
        <g key={i}>
          <circle cx={cx} cy={cy} r="7" fill="none" stroke="#8A6D3B" strokeWidth="1.5"/>
          <text x={cx} y={cy+3} textAnchor="middle" fontSize="7.5" fill="#C5A059" fontFamily="monospace">{[26,27,28,30][i]}</text>
        </g>
      ))}
      <text x="160" y="112" textAnchor="middle" fontSize="8" fill="#8A6D3B" fontFamily="monospace" letterSpacing="2">DREAM → PLAN → SHIP</text>
    </svg>
  ),
};

// ─── Page content ───────────────────────────────────────────────────────────
const PAGES = [
  {
    num: 'I',
    title: 'Origins & Academic Foundation',
    art: ART.origins,
    body: <>3rd Year BCA — <b>Regular, On-Campus</b> @ CHRIST (Deemed to be University), Yeshwantpur, Bengaluru. Batch 2024–27. Learning by shipping: first Git repos, first deploys, first live demos — fundamentals forged in public.</>,
  },
  {
    num: 'II',
    title: 'The 8 Elements — One Infinite System',
    art: ART.elements,
    body: <><b>Land • Infrastructure • Power • AI/ML/DL/NLP • Agriculture • Space • Transportation • Ocean.</b> My life symbol is ∞ — a continuous loop where each element feeds the next. Research → Prototype → Ship → Iterate, across all eight domains.</>,
  },
  {
    num: 'III',
    title: 'Core Engineering Principles',
    art: ART.principles,
    body: <><b>Offline-first. ≤30KB. Frugal AI.</b> Systems that work when the internet doesn't — on low compute, for people who need it most. Precision &amp; polish over noise. If it doesn't ship live, it doesn't count.</>,
  },
  {
    num: 'IV',
    title: 'Future Roadmap & Collaboration',
    art: ART.roadmap,
    body: <>2026 → 2030: Ship 5 field-ready AI tools → frugal edge models &lt;10MB → systems for Bharat at 1M rural users → <b>MyByte as a product studio.</b> Seeking internships &amp; collabs in AI / Space / AgTech. Let's build.</>,
  },
];

// ─── Main component ─────────────────────────────────────────────────────────
export default function AncientBook() {
  const [open, setOpen] = useState(false);
  const [spread, setSpread] = useState(0); // -1 = cover, 0..1 = two spreads
  const [dragging, setDragging] = useState(null);

  const flip = useCallback((dir) => {
    setSpread((s) => {
      const n = Math.max(-1, Math.min(1, s + dir));
      // sound only when the spread actually changes — not on edge clicks
      if (n !== s) playPageSound();
      return n;
    });
    if (!open) setOpen(true);
  }, [open]);

  // keyboard nav — active only while the book is open, so arrows never
  // hijack page scroll on the story route / behind the modal
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') flip(1);
      if (e.key === 'ArrowLeft') flip(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, flip]);

  // drag a turned page: left = forward, right = back (single live gesture)
  const onPointerDown = (e, leafIdx) => {
    if (spread <= leafIdx) return;
    e.preventDefault();
    setDragging({ startX: e.clientX });
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragging.startX;
    if (dx < -80) { flip(1); setDragging(null); }
    else if (dx > 80) { flip(-1); setDragging(null); }
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

        {/* flipping leaves — explicit page-front / page-back sub-containers */}
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
              {/* FRONT face — content reads normally */}
              <div className="leaf__face leaf__front">
                <div className="page-front">
                  <div className="page__inner">
                    <span className="page__num">[{String(leftIdx + 1).padStart(2, '0')}]</span>
                    <h3>{page(leftIdx)?.title}</h3>
                    <div className="page__img">{page(leftIdx)?.art}</div>
                    <p>{page(leftIdx)?.body}</p>
                    <span className="page__mark">∞</span>
                  </div>
                </div>
              </div>
              {/* BACK face — rotateY(180deg) so content reads correctly when turned */}
              <div className="leaf__face leaf__back">
                <div className="page-back">
                  <div className="page__inner">
                    <span className="page__num">[{String(rightIdx + 1).padStart(2, '0')}]</span>
                    <h3>{page(rightIdx)?.title}</h3>
                    <div className="page__img">{page(rightIdx)?.art}</div>
                    <p>{page(rightIdx)?.body}</p>
                    <span className="page__mark">∞</span>
                  </div>
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
      <div className="book-dots">
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
