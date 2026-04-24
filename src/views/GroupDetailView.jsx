import { useState, useEffect } from 'react';
import { getGroupMembers, getSharedQuestions, getLeaderboard, deleteSharedQuestion } from '../lib/api.js';
import { SUBJECTS } from '../data/questions.js';

export default function GroupDetailView({ group, user, goBack }) {
  const [tab, setTab] = useState('leaderboard'); // 'leaderboard' | 'questions' | 'members'
  const [members, setMembers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [m, q, lb] = await Promise.all([
        getGroupMembers(group.id),
        getSharedQuestions(group.id),
        getLeaderboard(group.id, 20),
      ]);
      setMembers(m); setQuestions(q); setLeaderboard(lb);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [group.id]);

  const copyCode = () => {
    navigator.clipboard.writeText(group.code);
    alert(`คัดลอกรหัส ${group.code} แล้ว ส่งให้เพื่อนได้เลย!`);
  };

  return (
    <>
      <div className="vmx-hero">
        <h1>👥 <em>{group.name}</em></h1>
        <p>
          Code: <strong style={{ color: 'var(--clr-gold)', fontFamily: 'JetBrains Mono, monospace' }}>{group.code}</strong>
          {' · '}<a onClick={copyCode} style={{ cursor: 'pointer', textDecoration: 'underline' }}>📋 คัดลอก</a>
          {' · '}สมาชิก {members.length} คน
        </p>
      </div>

      <div className="vmx-nav" style={{ marginBottom: 24 }}>
        <button className={`vmx-nav-btn ${tab === 'leaderboard' ? 'active' : ''}`} onClick={() => setTab('leaderboard')}>🏆 Leaderboard</button>
        <button className={`vmx-nav-btn ${tab === 'questions' ? 'active' : ''}`} onClick={() => setTab('questions')}>📝 Shared Q ({questions.length})</button>
        <button className={`vmx-nav-btn ${tab === 'members' ? 'active' : ''}`} onClick={() => setTab('members')}>👤 Members ({members.length})</button>
      </div>

      {loading && <div className="vmx-empty">กำลังโหลด...</div>}

      {!loading && tab === 'leaderboard' && (
        <div>
          {leaderboard.length === 0 ? (
            <div className="vmx-empty">ยังไม่มีใครทำข้อสอบในกลุ่มนี้ — ลองเป็นคนแรกกันเถอะ 💪</div>
          ) : (
            leaderboard.map((r, idx) => (
              <div key={r.id} className="vmx-review-item" style={{ background: idx === 0 ? 'rgba(184, 137, 64, 0.1)' : 'var(--clr-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: idx < 3 ? 'var(--clr-gold)' : 'var(--clr-surface-2)', color: idx < 3 ? 'var(--clr-surface)' : 'var(--clr-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 16 }}>
                      {r.profiles?.avatar_emoji || '🐾'} {r.profiles?.username || 'Anon'}
                      {r.user_id === user.id && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--clr-sage)', fontStyle: 'italic' }}>(คุณ)</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                      {r.mode === 'exam' ? '🎓 Exam' : '📝 Practice'} · {r.subject ? SUBJECTS.find((s) => s.id === r.subject)?.name : 'All'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 22, color: r.pct >= 80 ? 'var(--clr-sage)' : r.pct >= 60 ? 'var(--clr-gold)' : 'var(--clr-rose)' }}>{r.pct}%</div>
                    <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace' }}>{r.correct}/{r.total}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!loading && tab === 'questions' && (
        <div>
          <div style={{ marginBottom: 20, fontSize: 13, color: 'var(--clr-ink-soft)' }}>
            📌 ข้อสอบที่สมาชิกในกลุ่มแชร์มา — ทุกคนในกลุ่มใช้ทำข้อสอบได้<br/>
            <em>เพิ่มข้อสอบที่ Question Manager → แล้วกด "Share" ในข้อที่ต้องการ</em>
          </div>
          {questions.length === 0 ? (
            <div className="vmx-empty">ยังไม่มีข้อสอบที่แชร์</div>
          ) : (
            questions.map((q) => (
              <div key={q.id} className="vmx-review-item">
                <div className="vmx-review-head">
                  <span>by {q.author_name || 'Anon'} · {SUBJECTS.find((s) => s.id === q.data.subject)?.name || q.data.subject}</span>
                  {q.author_id === user.id && (
                    <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={async () => {
                      if (confirm('ลบข้อนี้ออกจากกลุ่ม?')) { await deleteSharedQuestion(q.id); load(); }
                    }}>🗑</button>
                  )}
                </div>
                <div className="vmx-review-q">{q.data.q}</div>
                {q.data.tags && q.data.tags.length > 0 && (
                  <div>{q.data.tags.map((t) => <span key={t} className="vmx-tag-pill">#{t}</span>)}</div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {!loading && tab === 'members' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {members.map((m) => (
            <div key={m.id} className="vmx-dash-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{m.avatar_emoji || '🐾'}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 16 }}>
                {m.username}
                {m.id === user.id && <div style={{ fontSize: 11, color: 'var(--clr-sage)', fontStyle: 'italic' }}>(คุณ)</div>}
              </div>
              {m.role === 'admin' && <div style={{ fontSize: 11, color: 'var(--clr-gold)', marginTop: 4 }}>👑 Admin</div>}
            </div>
          ))}
        </div>
      )}

      <div className="vmx-btn-row" style={{ marginTop: 30 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goBack}>← กลับกลุ่มทั้งหมด</button>
      </div>
    </>
  );
}
