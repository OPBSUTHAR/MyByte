import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReduce } from '../hooks/useCountUp';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-reveal wrapper — GSAP ScrollTrigger reveals with a direction and
 * stagger-aware delay. Also drives the `.bar i` fill when `bar` is set.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  from = 'up',
  delay = 0,
  duration = 0.7,
  bar = false,
  className = '',
  style,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduce()) {
      gsap.set(el, { clearProps: 'all' });
      const fill = el.querySelector('.bar i');
      if (fill) fill.style.transform = 'none';
      return;
    }
    const offset =
      from === 'left' ? { x: -40, y: 0 } :
      from === 'right' ? { x: 40, y: 0 } :
      from === 'scale' ? { y: 36, scale: 0.97 } :
      { y: 40, scale: 0.985 };

    const tween = gsap.from(el, {
      ...offset,
      autoAlpha: 0,
      duration,
      delay,
      ease: 'power3.out',
      onComplete: () => {
        gsap.set(el, { clearProps: 'transform,opacity,visibility,filter' });
      },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });

    let barTween;
    if (bar) {
      const fill = el.querySelector('.bar i');
      if (fill) {
        barTween = gsap.fromTo(fill, { scaleX: 0 }, {
          scaleX: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 84%', once: true },
        });
      }
    }

    return () => { tween.scrollTrigger?.kill(); tween.kill(); barTween?.scrollTrigger?.kill(); barTween?.kill(); };
  }, [from, delay, duration, bar]);

  return (
    <Tag ref={ref} className={`fx-reveal ${className}`} style={style} {...rest}>
      {children}
    </Tag>
  );
}
