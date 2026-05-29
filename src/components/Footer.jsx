// ============================================================
// Footer — brand line + utility links + Vet 86 ecosystem cross-links
// ============================================================
// Extracted from App.jsx 2026-05-27 (round-2 slim). Pure presentation;
// the only behavior is in-app navigation, so it takes a single `setView`
// prop. Two visual rows on mobile so a long line doesn't wrap mid-link.
//
// The ecosystem cross-links (CUVETSMO · Hanong · Imaging Lab) help
// Google + users discover the sister sites — VetMock is the most-
// trafficked of the network so these links give the newer sites a fast
// lane through Googlebot's existing crawl schedule. Keep them.
// ============================================================

export default function Footer({ setView }) {
  return (
    <div className="vmx-footer">
      <div style={{ marginBottom: 6 }}>
        made with ♡ by <strong>Vet 86</strong>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', justifyContent: 'center' }}>
        <a onClick={() => setView('about')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>About</a>
        <a href="/blog/" style={{ textDecoration: 'underline' }}>บทความ</a>
        <a href="https://www.instagram.com/vetmock.cu/" target="_blank" rel="noopener noreferrer" title="ติดตามบน Instagram @vetmock.cu" style={{ textDecoration: 'underline' }}>📷 @vetmock.cu</a>
        <a onClick={() => setView('feedback')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>แจ้งปัญหา</a>
        <a onClick={() => setView('offline-game')} style={{ cursor: 'pointer', textDecoration: 'underline' }} title="เกมเล็ก ๆ — ลูกไก่หนีเชื้อโรค">🐤 มินิเกม</a>
      </div>
      {/* Ecosystem cross-links · sister sites in the Vet 86 ecosystem.
          Helps Google + users discover the network (CUVETSMO = student
          council, Hanong = stray welfare). VetMock is the most-trafficked
          of the three so this link gives the newer sites a fast lane
          through Googlebot's existing crawl schedule. */}
      <div style={{ marginTop: 8, fontSize: 11, color: '#888', display: 'flex', flexWrap: 'wrap', gap: '4px 12px', justifyContent: 'center' }}>
        <span>เครือข่าย Vet 86:</span>
        <a href="https://cuvetsmo.com" target="_blank" rel="noopener noreferrer" title="สโมสรนิสิตสัตวแพทย์ จุฬาฯ" style={{ textDecoration: 'underline', color: '#666' }}>🐾 CUVETSMO · สโมสรนิสิตสัตวแพทย์ จุฬาฯ</a>
        <a href="https://hanong.vercel.app" target="_blank" rel="noopener noreferrer" title="Hanong — stray welfare platform" style={{ textDecoration: 'underline', color: '#666' }}>🐕 Hanong · หาน้อง</a>
        {/* Internal link — same-origin hash route. Same window. */}
        <a
          onClick={(e) => { e.preventDefault(); setView('lab'); if (window.location.hash !== '#lab') window.location.hash = '#lab'; }}
          href="#lab"
          title="Imaging Practice Lab — ฝึกอ่าน X-ray + DICOM viewer (Experimental)"
          style={{ textDecoration: 'underline', color: '#666', cursor: 'pointer' }}
        >🔬 Imaging Lab · ฝึกอ่าน X-ray (Experimental)</a>
      </div>
    </div>
  );
}
