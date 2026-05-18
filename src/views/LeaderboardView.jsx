import { useState, useEffect, useCallback } from 'react';
import { getLeaderboard } from '../lib/api.js';
import { SUBJECTS } from '../data/questions.js';

export default function LeaderboardView({ user, goHome, selectedYear }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  // Distinguish "API failed" from "no scores yet" — silent fallback
  // to [] gaslights the user about what's wrong. Track the failure
  // explicitly and surface it with a retry button.
  const [error, setError] = useState(null);
  // Year-scope toggle — Palm directive 2026-05-18 Q2=C: user picks
  // between current-year leaderboard and lifetime cross-year ranking.
  // Default = current year (most relevant context). Survives view
  // re-mount via localStorage so the choice sticks across sessions.
  const [yearScope, setYearScope] = useState(() => {
    try {
      const saved = window.localStorage?.getItem('vmx-leaderboard-year-scope');
      return saved === 'all' ? 'all' : 'current';
    } catch { return 'current'; }
  });
  useEffect(() => {
    try { window.localStorage?.setItem('vmx-leaderboard-year-scope', yearScope); } catch {}
  }, [yearScope]);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    const yearArg = yearScope === 'current' && Number.isFinite(selectedYear)
      ? selectedYear
      : null;
    getLeaderboard({ year: yearArg })
      .then(setScores)
      .catch((err) => {
        setScores([]);
        setError(err?.message || 'โหลดข้อมูลไม่สำเร็จ');
      })
      .finally(() => setLoading(false));
  }, [yearScope, selectedYear]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <div className="vmx-hero">
        <h1>🏆 Global <em>Leaderboard</em></h1>
        <p>
          {yearScope === 'current' && Number.isFinite(selectedYear)
            ? <>เฉพาะปี {selectedYear} — สู้กับ cohort เดียวกัน 💪</>
            : <>คะแนนสูงสุดจากผู้ใช้ทุกปี · cross-year ranking 🏅</>}
        </p>
      </div>

      {/* Year-scope toggle — Palm directive Q2=C. Defaults to current
          year (sticky via localStorage). Hidden when selectedYear is
          null (no year context · just show lifetime). */}
      {Number.isFinite(selectedYear) && (
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 18,
          padding: 4,
          borderRadius: 999,
          background: 'var(--clr-surface)',
          border: '1px solid var(--clr-border)',
          width: 'fit-content',
          margin: '0 auto 18px',
        }}>
          {[
            { id: 'current', label: `🎓 ปี ${selectedYear}` },
            { id: 'all', label: '🌐 ทั้งหมด' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setYearScope(opt.id)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: 12,
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: yearScope === opt.id ? 700 : 500,
                background: yearScope === opt.id ? 'var(--clr-sage)' : 'transparent',
                color: yearScope === opt.id ? 'var(--clr-bg)' : 'var(--clr-ink-soft)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="vmx-empty">กำลังโหลด...</div>
      ) : error ? (
        <div className="vmx-empty" style={{ background: 'var(--clr-rose-soft)', border: '1px solid var(--clr-rose)', color: 'var(--clr-ink)' }}>
          ⚠️ โหลด Leaderboard ไม่สำเร็จ — {error}
          <div style={{ marginTop: 12 }}>
            <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={load}>🔄 ลองอีกครั้ง</button>
          </div>
        </div>
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
