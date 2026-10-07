import { useEffect, useRef, useState } from 'react';
import { prefersReduce } from '../hooks/useCountUp';

// Theatre.js — keyframe/state authoring with a visual editor.
// Here the box's transform is driven by a Theatre object's reactive values,
// scrubbed by the range input. In dev, `@theatre/studio` opens the GUI so the
// keyframes can be edited visually.
export default function TheatreSeq() {
  const box = useRef(null);
  const objRef = useRef(null);
  const [pos, setPos] = useState(prefersReduce() ? 1 : 0);

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        if (import.meta.env.DEV) {
          const studio = (await import('@theatre/studio')).default;
          studio.initialize();
        }
        const core = await import('@theatre/core');
        if (disposed || !box.current) return;
        const project = core.getProject('MyByte Lab');
        const sheet = project.sheet('Sequence');
        const obj = sheet.object('Cursor', { x: 0, spin: 0, scale: 1 });
        objRef.current = obj;
        obj.onValuesChange((v) => {
          if (!box.current) return;
          box.current.style.transform = `translateX(${v.x}px) rotate(${v.spin}deg) scale(${v.scale})`;
        });
      } catch { /* Theatre unavailable — scrubber still moves the box via ref */ }
    })();
    return () => { disposed = true; };
  }, []);

  const apply = (t) => {
    setPos(t);
    const width = box.current?.parentElement?.clientWidth || 300;
    const x = t * Math.max(0, width - 70);
    const spin = t * 360;
    const scale = 1 + Math.sin(t * Math.PI) * 0.35;
    if (objRef.current) objRef.current.value = { x, spin, scale };
    else if (box.current) box.current.style.transform = `translateX(${x}px) rotate(${spin}deg) scale(${scale})`;
  };

  return (
    <div className="lab-card fx-theatre">
      <span className="lab-card__tag">Theatre.js</span>
      <h3>Keyframe sequence — scrub</h3>
      <div className="fx-theatre__stage">
        <div className="fx-theatre__box" ref={box} />
      </div>
      <input
        type="range" min="0" max="1" step="0.001" value={pos}
        onChange={(e) => apply(parseFloat(e.target.value))}
        aria-label="Theatre.js sequence scrubber"
      />
      <p>Reactive object values drive the transform; open Theatre Studio in dev to author curves.</p>
    </div>
  );
}
