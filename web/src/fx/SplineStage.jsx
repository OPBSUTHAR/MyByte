import { useState } from 'react';
import { motion } from 'motion/react';

// Spline — interactive 3D scenes designed in a browser editor and embedded with
// minimal code. Loaded on demand so a missing network/scene never blocks the page.
const SCENE = 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode';

export default function SplineStage() {
  const [Comp, setComp] = useState(null);
  const [state, setState] = useState('idle'); // idle | loading | error

  const load = async () => {
    setState('loading');
    try {
      const mod = await import('@splinetool/react-spline');
      setComp(() => mod.default);
      setState('ready');
    } catch {
      setState('error');
    }
  };

  return (
    <div className="lab-card">
      <span className="lab-card__tag">Spline</span>
      <h3>Interactive 3D scene</h3>
      <div className="fx-stage" style={{ height: 240, minHeight: 240 }}>
        {Comp && state === 'ready' ? (
          <Comp scene={SCENE} style={{ width: '100%', height: '100%' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', gap: 10 }}>
            <motion.div
              animate={{ rotateY: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              style={{ fontSize: '3rem', fontFamily: 'Fraunces, serif', color: 'var(--primary)' }}
            >
              ∞
            </motion.div>
            {state !== 'ready' && (
              <button className="btn btn--sm btn--primary" onClick={load} disabled={state === 'loading'}>
                {state === 'loading' ? 'Loading…' : state === 'error' ? 'Retry Spline scene' : 'Load Spline scene'}
              </button>
            )}
          </div>
        )}
        <span className="fx-stage__label">Spline • 3D embed</span>
      </div>
      <p>3D scene authored in the Spline editor, embedded as a runtime component.</p>
    </div>
  );
}
