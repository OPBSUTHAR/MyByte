import { HIGHLIGHTS } from '../content.jsx';
import Reveal from './Reveal';

// Overview strip — the 5 highlights. Responsive, keyboard-friendly grid.
// (No hover state: the old `active` class had no visual rule — pure CSS
// :hover/:focus-visible in site.css handles the highlight instead.)
export default function Highlights() {
  return (
    <section id="storyboard" className="section">
      <div className="container">
        <div className="section__eyebrow">Overview — At a Glance</div>
        <div className="section__head">
          <h2>Explore MyByte — 5 highlights</h2>
          <p className="muted">Professional overview — hover or tab through the highlights.</p>
        </div>
        <div className="infinity__grid" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
          {HIGHLIGHTS.map((h, i) => (
            <Reveal
              key={h.h}
              as="article"
              className="overview-card"
              delay={Math.min(i * 0.06, 0.12)}
              tabIndex={0}
            >
              <div className="overview-card__eyebrow">{h.eyebrow}</div>
              <h3>{h.h}</h3>
              <p>{h.p}</p>
              <a href={h.href} className="overview-card__link">{h.link}</a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
