// Night-owl rank card — shows the user's current late-night study
// rank (สิบเอกนอนเยอะ → พลเอกนอนน้อย) with progress toward the next
// promotion. Purely derived from `history` timestamps — see
// src/lib/night-rank.js. Sits on the Dashboard under the heatmap.
import { getNightStats } from '../lib/night-rank.js';

export default function NightRankCard({ history }) {
  const { nightCount, rank, progress } = getNightStats(history);

  return (
    <div className="vmx-dash-card vmx-night-rank-card">
      <h3>🎖️ ยศโต้รุ้ง</h3>
      <div className="vmx-night-rank-row">
        <span className="vmx-night-rank-icon" aria-hidden="true">{rank.icon}</span>
        <div className="vmx-night-rank-info">
          <div className="vmx-night-rank-label">{rank.label}</div>
          <div className="vmx-night-rank-blurb">{rank.blurb}</div>
        </div>
      </div>
      <div className="vmx-bar" role="img"
        aria-label={`คืนที่อ่านดึกสะสม ${nightCount} ข้อ`}>
        <div
          className="vmx-bar-fill"
          style={{
            width: `${progress.hasNext ? Math.max(4, progress.pct) : 100}%`,
            background: 'linear-gradient(90deg, var(--clr-gold), #d4a437)',
          }}
        />
      </div>
      <div className="vmx-night-rank-meta">
        {progress.hasNext ? (
          <>ตอบดึกสะสม <strong>{nightCount}</strong> ข้อ · เหลืออีก <strong>{progress.needed}</strong> ข้อเป็น <strong>{progress.next.label}</strong></>
        ) : (
          <>ตอบดึกสะสม <strong>{nightCount}</strong> ข้อ · ยศสูงสุดแล้ว คืนนี้พักได้</>
        )}
      </div>
      <div className="vmx-night-rank-footnote">
        นับเฉพาะข้อที่ส่งคำตอบช่วง 23:00–04:59 · ยศลดอัตโนมัติถ้าล้างประวัติ
      </div>
    </div>
  );
}
