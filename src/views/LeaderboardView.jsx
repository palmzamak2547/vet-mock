import { useState, useEffect } from 'react';
import { getLeaderboard } from '../lib/api.js';
import { SUBJECTS } from '../data/questions.js';

export default function LeaderboardView({ user, goHome }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard(null, 50)
      .then(setScores)
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="vmx-hero">
        <h1>🏆 Global <em>Leaderboard</em></h1>
        <p>คะแนนสูงสุดจากผู้ใช้ VetMock ทั้งหมด — ติด Top 10 ได้ไหมนะ 👀</p>
      </div>

      {loading ? (
        <div className="vmx-empty">กำลังโหลด...</div>
      ) : scores.length === 0 ? (
        <div className="vmx-empty">ยังไม่มีคะแนน — ลองเป็นคนแรกกันเถอะ 💪</div>
      ) : (
        <div>
          {scores.map((r, idx) => (
            <div key={r.id} className="vmx-review-item" style={{
              background: idx === 0 ? 'rgba(184, 137, 64, 0.15)' :
                          idx < 3 ? 'rgba(184, 137, 64, 0.08)' : 'var(--clr-surface)',
              borderLeft: idx < 3 ? '4px solid var(--clr-gold)' : undefined,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: idx < 3 ? 'var(--clr-gold)' : 'var(--clr-surface-2)', color: idx < 3 ? 'var(--clr-surface)' : 'var(--clr-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 20, flexShrink: 0 }}>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 17 }}>
                    {r.profiles?.avatar_emoji || '🐾'} {r.profiles?.username || 'Anon'}
                    {r.user_id === user.id && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--clr-sage)', fontStyle: 'italic' }}>(คุณ)</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                    {r.mode === 'exam' ? '🎓 Exam' : '📝 Practice'} · {r.subject ? SUBJECTS.find((s) => s.id === r.subject)?.name : 'All'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 24, color: r.pct >= 80 ? 'var(--clr-sage)' : r.pct >= 60 ? 'var(--clr-gold)' : 'var(--clr-rose)' }}>{r.pct}%</div>
                  <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace' }}>{r.correct}/{r.total}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="vmx-btn-row" style={{ marginTop: 30 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
      </div>
    </>
  );
}
