// ============================================================
// Footer — grouped site links + Vet 86 ecosystem cross-links
// ============================================================
// De-slop pass 2026-07-24: this was one italic centred blob — a brand line,
// then six links in a wrapping row, then three very long emoji-prefixed
// ecosystem links held together by middle dots. It read as filler.
//
// Now it's a real footer: labelled groups, left-aligned so the eye has a
// column to follow, plain type (no italic), link text that says the
// destination, and no decorative emoji or dot separators. Styling lives in
// styles.css (.vmx-footer*) rather than inline, per docs/DESIGN_SYSTEM.md.
//
// The ecosystem cross-links (CUVETSMO · Hanong · Imaging Lab) help Google
// and users discover the sister sites — VetMock is the most-trafficked of
// the network, so these give the newer sites a fast lane through
// Googlebot's existing crawl schedule. Keep the links AND their
// descriptive anchor text.
// ============================================================

export default function Footer({ setView }) {
  const handleNav = (targetView) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (setView) setView(targetView);
  };

  return (
    <footer className="vmx-footer">
      <div className="vmx-footer-grid">
        <div className="vmx-footer-brand">
          <div className="vmx-footer-wordmark">Vet<span>Mock</span></div>
          <p>คลังโจทย์ฝึกและสรุปเนื้อหาสำหรับนิสิตสัตวแพทย์ ทำโดยรุ่นพี่ Vet 86</p>
        </div>

        <nav className="vmx-footer-col" aria-label="เกี่ยวกับ VetMock">
          <h2>เกี่ยวกับ</h2>
          <button type="button" className="vmx-footer-link" onClick={() => handleNav('about')}>เกี่ยวกับเรา</button>
          <button type="button" className="vmx-footer-link" onClick={() => handleNav('landing')}>หน้าแนะนำ</button>
          <a href="/blog/">บทความ</a>
          <button type="button" className="vmx-footer-link" onClick={() => handleNav('feedback')}>แจ้งปัญหา</button>
          <button type="button" className="vmx-footer-link" onClick={() => handleNav('offline-game')} title="เกมเล็ก ๆ — ลูกไก่หนีเชื้อโรค">มินิเกม</button>
        </nav>

        <nav className="vmx-footer-col" aria-label="เครือข่าย Vet 86">
          <h2>เครือข่าย Vet 86</h2>
          <a href="https://cuvetsmo.com" target="_blank" rel="noopener noreferrer">
            CUVETSMO สโมสรนิสิตสัตวแพทย์ จุฬาฯ
          </a>
          <a href="https://hanong.vercel.app" target="_blank" rel="noopener noreferrer">
            หาน้อง แพลตฟอร์มสัตว์จร
          </a>
          {/* Internal link — same-origin hash route, same window. */}
          <a
            href="#lab"
            onClick={(e) => { e.preventDefault(); if (window.location.hash !== '#lab') window.location.hash = '#lab'; handleNav('lab'); }}
            title="Imaging Practice Lab — ฝึกอ่าน X-ray + DICOM viewer (Experimental)"
          >
            Imaging Lab ฝึกอ่าน X-ray
          </a>
        </nav>
      </div>

      <div className="vmx-footer-base">
        <span>สร้างโดยนิสิตสัตวแพทย์ Vet 86</span>
        <a href="https://www.instagram.com/vetmock.cu/" target="_blank" rel="noopener noreferrer">
          Instagram @vetmock.cu
        </a>
      </div>
    </footer>
  );
}
