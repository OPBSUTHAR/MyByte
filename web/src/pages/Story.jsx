import AncientBook from '../components/AncientBook';

// Full-page route wrapper for the ancient book (direct URL access).
// The primary entry point is the hero "Open Story →" CTA → StoryModal.
export default function Story() {
  return (
    <section className="section story-page">
      <div className="container">
        <div className="section__eyebrow">Story • Ancient Book — ∞ 8 Elements</div>
        <h1 style={{ fontFamily: 'Fraunces,serif', fontSize: 'clamp(2rem,4vw,3rem)', margin: 0 }}>
          Stories as <span className="grad">manuscripts</span>
        </h1>
        <p className="story-sub">The ∞ loop told as four chapters — <b>← →</b> to turn the pages.</p>
        <AncientBook />
      </div>
    </section>
  );
}
