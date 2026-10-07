import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

// Lottie-Web (Airbnb) — renders After Effects vector animations from JSON.
// The bundled animation is generated for this lab (see public/lottie/loop.json)
// so there is no network dependency; a pure-CSS orbit is the graceful fallback.
export default function LottieMotion() {
  const [anim, setAnim] = useState(null);
  const [Lottie, setLottie] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [{ default: L }, data] = await Promise.all([
          import('lottie-react'),
          fetch('lottie/loop.json').then((r) => r.json()),
        ]);
        if (alive) { setLottie(() => L); setAnim(data); }
      } catch { /* keep fallback */ }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="lab-card">
      <span className="lab-card__tag">Lottie</span>
      <h3>After Effects → JSON</h3>
      <motion.div className="fx-lottie" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {Lottie && anim ? (
          <Lottie animationData={anim} loop autoplay style={{ height: 170 }} />
        ) : (
          <svg viewBox="0 0 200 200" height={170} aria-label="Lottie fallback">
            <circle cx="100" cy="100" r="60" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="12 10">
              <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="6s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="40" r="9" fill="#7c3aed">
              <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="4s" repeatCount="indefinite" />
            </circle>
          </svg>
        )}
      </motion.div>
      <p>High-fidelity vector motion without hand-coding every frame.</p>
    </div>
  );
}
