import { Suspense, lazy } from 'react';
import Reveal from './Reveal';

const ThreeScene = lazy(() => import('../fx/ThreeScene'));
const PixiParticles = lazy(() => import('../fx/PixiParticles'));
const AnimeDraw = lazy(() => import('../fx/AnimeDraw'));
const TheatreSeq = lazy(() => import('../fx/TheatreSeq'));
const MotionLab = lazy(() => import('../fx/MotionLab'));
const LottieMotion = lazy(() => import('../fx/LottieMotion'));
const PhysicsPlayground = lazy(() => import('../fx/PhysicsPlayground'));
const DesignPlayground = lazy(() => import('../fx/DesignPlayground'));
const SplineStage = lazy(() => import('../fx/SplineStage'));

const Fallback = () => <div className="fx-stage" style={{ height: 300 }}><span className="fx-stage__hint">loading…</span></div>;

// The "full potential" showcase — every listed library in its best-fit role.
export default function AnimationLab() {
  return (
    <section id="lab" className="section section--alt">
      <div className="container">
        <div className="section__eyebrow">10 — Motion Lab • Full-Potential Build</div>
        <div className="section__head">
          <h2>The animation stack, in its element</h2>
          <p className="muted">Motion • Anime.js • Theatre.js • Lottie • Three.js • Spline • PixiJS • Popmotion • Mo.js — each used where it genuinely fits.</p>
        </div>

        <Reveal style={{ display: 'grid', gap: 16 }}>
          <Suspense fallback={<Fallback />}>
            <ThreeScene />
          </Suspense>
        </Reveal>

        <Reveal delay={80} style={{ marginTop: 16 }}>
          <Suspense fallback={<Fallback />}>
            <PixiParticles />
          </Suspense>
        </Reveal>

        <div className="lab-grid">
          <Reveal from="scale"><Suspense fallback={<Fallback />}><MotionLab /></Suspense></Reveal>
          <Reveal from="scale" delay={60}><Suspense fallback={<Fallback />}><DesignPlayground /></Suspense></Reveal>
          <Reveal from="scale"><Suspense fallback={<Fallback />}><AnimeDraw /></Suspense></Reveal>
          <Reveal from="scale" delay={60}><Suspense fallback={<Fallback />}><TheatreSeq /></Suspense></Reveal>
          <Reveal from="scale"><Suspense fallback={<Fallback />}><LottieMotion /></Suspense></Reveal>
          <Reveal from="scale" delay={60}><Suspense fallback={<Fallback />}><SplineStage /></Suspense></Reveal>
          <Reveal from="scale"><Suspense fallback={<Fallback />}><PhysicsPlayground /></Suspense></Reveal>
          <Reveal from="scale" delay={60}>
            <div className="lab-card">
              <span className="lab-card__tag">GSAP + Lenis</span>
              <h3>Timelines &amp; smooth scroll</h3>
              <p>GSAP drives every scroll reveal and the hero timeline; Lenis provides inertial smooth scrolling synced to the GSAP ticker. Theatre.js, Mo.js and the rest are orchestrated from the same timeline.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
