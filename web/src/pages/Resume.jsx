import { useEffect } from 'react';

// Dedicated, shareable Resume page (#/resume) so a recruiter can open it
// directly via URL. Shows the PDF inline and offers a one-click download.
export default function Resume() {
  const base = import.meta.env.BASE_URL || '/';
  const pdfUrl = `${base}assets/resume/Om_Prakash_Suthar_Resume.pdf`;

  useEffect(() => {
    document.title = 'Resume — Omprakash Suthar';
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <section className="section resume-page">
      <div className="container">
        <div className="section__eyebrow">Resume — Omprakash Suthar</div>
        <h1 style={{ fontFamily: 'Fraunces,serif', fontSize: 'clamp(2rem,4vw,3rem)', margin: '0 0 12px' }}>
          Resume
        </h1>
        <p className="muted" style={{ marginBottom: 18 }}>
          BCA · CHRIST (Deemed to be University), Yeshwantpur · Bengaluru · Open to offers
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
          <a className="btn btn--primary" href={pdfUrl} download="Om_Prakash_Suthar_Resume.pdf">
            ⬇ Download PDF
          </a>
          <a className="btn" href={pdfUrl} target="_blank" rel="noopener">
            Open in new tab ↗
          </a>
          <a className="btn" href="#/">← Back to MyByte</a>
        </div>
        <div className="resume-viewer" style={{
          border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden',
          background: 'var(--card)', boxShadow: 'var(--shadow)',
        }}>
          <object data={pdfUrl} type="application/pdf" width="100%" height="calc(100vh - 230px)" style={{ display: 'block' }}>
            <p className="muted" style={{ padding: 18 }}>
              Your browser can't display the PDF inline.{' '}
              <a href={pdfUrl} download="Om_Prakash_Suthar_Resume.pdf">Download it here</a>.
            </p>
          </object>
        </div>
      </div>
    </section>
  );
}
