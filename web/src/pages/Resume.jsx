import { useEffect } from 'react';

// Dedicated, shareable Resume page (#/resume) so a recruiter can open it
// directly via URL. Light, single-screen layout: shows the PDF inline and
// offers a one-click download. No page scroll.
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
    <div className="resume-page" style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: '#f5f6f8', color: '#1a1d23',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, padding: '14px 24px', background: '#ffffff',
        borderBottom: '1px solid #e3e6ec', flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#6b7280' }}>
            Resume
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
            Omprakash Suthar
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a href={pdfUrl} download="Om_Prakash_Suthar_Resume.pdf"
             style={btnPrimary}>⬇ Download PDF</a>
          <a href={pdfUrl} target="_blank" rel="noopener" style={btnGhost}>Open in new tab ↗</a>
          <a href="#/" style={btnGhost}>← Back</a>
        </div>
      </header>
      <main style={{ flex: 1, padding: 16, minHeight: 0, display: 'flex' }}>
        <div style={{
          flex: 1, background: '#ffffff', borderRadius: 12,
          border: '1px solid #e3e6ec', overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(15,23,42,.08)',
        }}>
          <object data={pdfUrl} type="application/pdf"
                  style={{ width: '100%', height: '100%', border: 0, display: 'block' }}>
            <p style={{ padding: 24, color: '#374151' }}>
              Your browser can't display the PDF inline.{' '}
              <a href={pdfUrl} download="Om_Prakash_Suthar_Resume.pdf">Download it here</a>.
            </p>
          </object>
        </div>
      </main>
    </div>
  );
}

const btnPrimary = {
  background: '#0ea5e9', color: '#fff', padding: '8px 14px', borderRadius: 8,
  fontWeight: 700, fontSize: 14, textDecoration: 'none', border: 'none',
};
const btnGhost = {
  background: '#fff', color: '#1f2937', padding: '8px 14px', borderRadius: 8,
  fontWeight: 600, fontSize: 14, textDecoration: 'none',
  border: '1px solid #d1d5db',
};