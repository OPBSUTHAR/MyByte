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
      from === 'left' ? { x: -48, y: 0 } :
      from === 'right' ? { x: 48, y: 0 } :
      from === 'scale' ? { y: 40, scale: 0.96 } :
      { y: 48, scale: 0.98 };

    const tween = gsap.from(el, {
      ...offset,
      autoAlpha: 0,
      duration,
      delay,
      ease: 'expo.out',
      onComplete: () => {
        // tilt + hover systems gate on this — reveal owns the transform until here
        el.setAttribute('data-revealed', '1');
        gsap.set(el, { clearProps: 'transform,opacity,visibility,filter' });
      },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });

    let barTween;
    if (bar) {
      const fill = el.querySelector('.bar i');
      if (fill) {
        barTween = gsap.fromTo(fill, { scaleX: 0 }, {
          scaleX: 1, duration: 1.2, ease: 'power3.out', transformOrigin: 'left center',
          scrollTrigger: { trigger: el, start: 'top 84%', once: true },
        });
      }
    }

    // if the component unmounts (route change) before the trigger fires,
    // clear the pre-reveal inline styles so nothing sticks invisible
    return () => {
      tween.scrollTrigger?.kill(); tween.kill();
      barTween?.scrollTrigger?.kill(); barTween?.kill();
      gsap.set(el, { clearProps: 'transform,opacity,visibility,filter' });
    };
  }, [from, delay, duration, bar]);

  return (
    <Tag ref={ref} className={`fx-reveal ${className}`} style={style} {...rest}>
      {children}
    </Tag>
  );
}
