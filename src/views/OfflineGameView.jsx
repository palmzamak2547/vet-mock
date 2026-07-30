// ──────────────────────────────────────────────────────────────────
// OfflineGameView — full-page wrapper around the mini-game.
//
// Reachable two ways:
//   1. Auto-suggested when navigator.onLine flips false (banner in App)
//   2. Manual easter egg: tap the offline-status pill or use the
//      🎮 button in the footer (so it works even when online).
//
// Why a separate view (vs. a modal): the game wants the whole screen
// real estate on mobile, and tab away / Escape should restore the
// previous view cleanly. Pinning it to App's view router uses the
// existing back-button and View Transitions plumbing for free.
// ──────────────────────────────────────────────────────────────────
import OfflineGame from '../components/OfflineGame.jsx';

export default function OfflineGameView({ goBack, online }) {
  return (
    <div className="vmx-page" style={{ padding: '24px 16px 48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button
          className="vmx-btn vmx-btn-ghost vmx-btn-sm"
          onClick={goBack}
          aria-label="กลับหน้าหลัก"
        >
          ← กลับ
        </button>
        <div style={{ fontSize: 13, color: online ? 'var(--clr-sage, #4a6b4a)' : 'var(--clr-rose, #a73d3d)' }}>
          {online ? '● ออนไลน์' : '● ออฟไลน์'}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22 }}>🐤 ลูกไก่หนีเชื้อโรค</h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--clr-ink-soft, #7a6f5e)' }}>
          {online
            ? 'อีสเตอร์เอ้กตอนเน็ตหลุด, กระโดดข้าม Salmonella, มูลไก่ติดตูด, เชื้อรา, หมอบหลบแมลงวัน'
            : 'ตอนนี้ใช้งานออฟไลน์อยู่ — ลองเล่นเกมระหว่างรอเน็ตกลับมาก็ได้นะ'}
        </p>
      </div>

      <OfflineGame onClose={goBack} />

      <div style={{ maxWidth: 600, margin: '24px auto 0', fontSize: 12, color: 'var(--clr-ink-soft, #7a6f5e)', lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--clr-ink, #3d3a36)' }}>วิธีเล่น</strong>
        <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
          <li>คอมพิวเตอร์: <code>Space</code> หรือ <code>↑</code> = กระโดด, <code>↓</code> = หมอบ, <code>Esc</code> = ปิด</li>
          <li>มือถือ: แตะหน้าจอ = กระโดด</li>
          <li>คะแนนสูงสุดเก็บไว้ในเครื่อง (localStorage) ไม่ส่งขึ้น server</li>
        </ul>
      </div>
    </div>
  );
}
