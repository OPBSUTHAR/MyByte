export default function NotFound() {
  return (
    <section className="section notfound">
      <div className="container">
        <div className="section__eyebrow">404 — Lost in space 🚀</div>
        <h1 style={{ fontFamily: 'Fraunces,serif', fontSize: 'clamp(2.4rem,6vw,4.4rem)', margin: '.4rem 0' }}>
          This page drifted off the map.
        </h1>
        <p className="muted">Like a satellite without a tracker — but you can always fly back home.</p>
        <div style={{ marginTop: 18 }}>
          <a href="#/" className="btn btn--primary btn--xl magnetic">← Back to MyByte</a>
        </div>
      </div>
    </section>
  );
}
