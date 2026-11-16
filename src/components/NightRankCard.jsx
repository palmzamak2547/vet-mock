// Night-owl rank card — shows the user's current late-night study
// rank (สิบเอกนอนเยอะ → พลเอกนอนน้อย) with progress toward the next
// promotion. Purely derived from `history` timestamps — see
// src/lib/night-rank.js. Sits on the Dashboard under the heatmap.
import { useEffect, useState } from 'react';
import { getNightStats, NIGHT_RANK_EVENT, takePromotion } from '../lib/night-rank.js';

export default function NightRankCard({ history }) {
  const { nightCount, rank, progress } = getNightStats(history);
  // A promotion earned by the last set: finishExam leaves it in the stash, and
  // it is said here, on Progress, instead of between a score and what to do.
  const [promo, setPromo] = useState(null);
  useEffect(() => {
    const pending = takePromotion();
    if (pending) setPromo(pending);
    const onPromo = (e) => {
      const { from, to } = e?.detail || {};
      if (from?.label && to?.label) setPromo({ from, to });
    };
    window.addEventListener(NIGHT_RANK_EVENT, onPromo);
    return () => window.removeEventListener(NIGHT_RANK_EVENT, onPromo);
  }, []);

  return (
    <div className="vmx-dash-card vmx-night-rank-card">
      {/* h2 like every other dashboard card: this card is a peer of
          them, not a subsection of the one rendered before it. */}
      <h2>🎖️ ยศโต้รุ้ง</h2>
      {promo && (
        <div className="vmx-night-rank-promo" role="status">
          <span className="vmx-night-rank-promo-icon" aria-hidden="true">{promo.to.icon}</span>
          <div className="vmx-night-rank-promo-text">
            <div className="vmx-night-rank-promo-title">เลื่อนยศโต้รุ้ง! {promo.to.label}</div>
            <div className="vmx-night-rank-promo-sub">
              จาก {promo.from.label} เป็น {promo.to.label}, {promo.to.blurb}
            </div>
          </div>
        </div>
      )}
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
          <>ตอบดึกสะสม <strong>{nightCount}</strong> ข้อ อีก <strong>{progress.needed}</strong> ข้อได้เป็น <strong>{progress.next.label}</strong></>
        ) : (
          <>ตอบดึกสะสม <strong>{nightCount}</strong> ข้อ ได้ยศสูงสุดแล้ว คืนนี้พักได้</>
        )}
      </div>
      <div className="vmx-night-rank-footnote">
        นับเฉพาะข้อที่ส่งคำตอบช่วง 23:00–04:59 ถ้าล้างประวัติ ยศจะลดตาม
      </div>
    </div>
  );
}
