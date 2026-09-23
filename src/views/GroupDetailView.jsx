import Mochi from '../components/Mochi.jsx';
import { useState, useEffect, useRef } from 'react';
import { getGroupMembers, getSharedQuestions, getLeaderboard, deleteSharedQuestion } from '../lib/api.js';
import { qualifiesForLeaderboard } from '../lib/leaderboard-gate.js';
import { copyText } from '../lib/clipboard.js';
import { SUBJECTS } from '../data/questions.js';
import { confirmDialog, alertDialog } from '../lib/dialog.js';
import { thaiError } from '../lib/errors.js';
import StatePanel from '../components/StatePanel.jsx';

// A group page is three independent requests, one per tab.
const SECTIONS = ['members', 'questions', 'leaderboard'];
const ALL_PENDING = { members: true, questions: true, leaderboard: true };
const NONE_FAILED = { members: '', questions: '', leaderboard: '' };

export default function GroupDetailView({ group, user, goBack }) {
  const [tab, setTab] = useState('leaderboard'); // 'leaderboard' | 'questions' | 'members'
  const [members, setMembers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  // Each section loads, fails and retries on its own. One Promise.allSettled
  // behind one spinner made the tab on screen wait for the slowest hidden
  // request, and a failed section was only a banner: its own tab then drew an
  // empty list, as though the group had no members or nobody had scored.
  const [pending, setPending] = useState(ALL_PENDING);
  const [failed, setFailed] = useState(NONE_FAILED);
  // Errors from an action the student took (delete), separate from a load
  // failure, which replaces its own section with a panel.
  const [actionError, setActionError] = useState('');
  // The newest request per section. An answer to an older one (a reload
  // overtook it, or the page left this group) is dropped rather than drawn
  // over the newer answer.
  const latest = useRef({ members: 0, questions: 0, leaderboard: 0 });

  const show = {
    members: setMembers,
    questions: setQuestions,
    // Same min-questions gate as the global board — a 2-question
    // sprint topping a group board is the same luck problem.
    leaderboard: (rows) => setLeaderboard((Array.isArray(rows) ? rows : []).filter(qualifiesForLeaderboard)),
  };

  // Resolves once every requested section has settled, each having painted
  // the moment its own answer arrived.
  const load = (keys = SECTIONS) => {
    const request = { members: getGroupMembers, questions: getSharedQuestions, leaderboard: getLeaderboard };
    const all = (value) => Object.fromEntries(keys.map((key) => [key, value]));
    setPending((p) => ({ ...p, ...all(true) }));
    setFailed((f) => ({ ...f, ...all('') }));
    return Promise.allSettled(keys.map((key) => {
      const ticket = ++latest.current[key];
      const settle = (apply) => {
        if (latest.current[key] !== ticket) return;
        apply();
        setPending((p) => ({ ...p, [key]: false }));
      };
      return request[key](group.id).then(
        (rows) => settle(() => show[key](rows)),
        (err) => settle(() => setFailed((f) => ({ ...f, [key]: thaiError(err, 'โหลดข้อมูลกลุ่มไม่สำเร็จ') }))),
      );
    }));
  };
  const retryFailed = () => load(SECTIONS.filter((key) => failed[key]));

  // GroupsView records which account opened the group. If the session is now
  // another account (a direct switch while this page is open, or a sign-out
  // and a different sign-in with the page still selected), nothing of the
  // group is fetched or drawn, its invite code included: back to the list,
  // which loads the new account's groups.
  const foreign = group.openedBy != null && group.openedBy !== user.id;

  useEffect(() => {
    if (foreign) { goBack(); return undefined; }
    load();
    // Leaving the group or the account makes every answer in flight stale.
    return () => { for (const key of SECTIONS) latest.current[key] += 1; };
  }, [group.id, user.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const status = pending[tab] ? 'loading' : failed[tab] ? 'error' : 'ready';
  // The tab on screen speaks for itself; this is for a failure out of sight.
  const hiddenFailure = status !== 'error' && SECTIONS.some((key) => key !== tab && failed[key]);

  // Robust copy: Clipboard API → execCommand fallback for in-app browsers
  // (LINE / FB WebView) where navigator.clipboard is absent or rejects.
  const copyCode = async () => {
    const r = await copyText(group.code);
    if (r.ok) {
      alertDialog(`คัดลอกรหัส ${group.code} แล้ว ส่งให้เพื่อนได้เลย!`);
    } else {
      // Surface the code so the user can long-press to copy manually
      alertDialog(`คัดลอกอัตโนมัติไม่ได้บนเบราว์เซอร์นี้ — กดค้าง code นี้แล้วเลือก Copy:\n\n${group.code}`);
    }
  };

  if (foreign) return null;

  return (
    <>
      <div className="vmx-hero">
        <Mochi state="hearts" size={44} slot="page-intro" className="vmx-hero-mochi" />
        <h1><em>{group.name}</em></h1>
        <p>
          Code: <strong style={{ color: 'var(--clr-gold-text)', fontFamily: 'var(--vmx-mono)' }}>{group.code}</strong>
          {', '}<button type="button" className="vmx-footer-link" onClick={copyCode} style={{ border: 0, background: 'transparent', padding: 0, color: 'inherit', font: 'inherit', textDecoration: 'underline' }}>คัดลอก</button>
          {', '}สมาชิก {members.length} คน
        </p>
      </div>

      <div className="vmx-nav" style={{ marginBottom: 24 }}>
        <button className={`vmx-nav-btn ${tab === 'leaderboard' ? 'active' : ''}`} onClick={() => setTab('leaderboard')}>อันดับคะแนน</button>
        <button className={`vmx-nav-btn ${tab === 'questions' ? 'active' : ''}`} onClick={() => setTab('questions')}>Shared Q ({questions.length})</button>
        <button className={`vmx-nav-btn ${tab === 'members' ? 'active' : ''}`} onClick={() => setTab('members')}>👤 Members ({members.length})</button>
      </div>

      {actionError && <div style={{ padding: 12, borderRadius: 10, background: 'var(--clr-rose-soft)', marginBottom: 16, fontSize: 13 }}>⚠️ {actionError}</div>}

      {hiddenFailure && (
        <div style={{ padding: 12, borderRadius: 10, background: 'var(--clr-gold-soft)', marginBottom: 16, fontSize: 13 }}>
          ⚠️ บางส่วนของกลุ่มโหลดไม่สำเร็จ{' '}
          <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={retryFailed} style={{ marginInlineStart: 8 }}>ลองอีกครั้ง</button>
        </div>
      )}

      {status === 'loading' && <StatePanel kind="loading" title="กำลังโหลดข้อมูลกลุ่ม…" />}
      {status === 'error' && <StatePanel kind="error" title="โหลดข้อมูลกลุ่มไม่สำเร็จ" body={failed[tab]} actionLabel="ลองอีกครั้ง" onAction={retryFailed} />}

      {status === 'ready' && tab === 'leaderboard' && (
        <div>
          {leaderboard.length === 0 ? (
            <div className="vmx-empty">ยังไม่มีใครทำข้อสอบในกลุ่มนี้ — ลองเป็นคนแรกกันเถอะ 💪</div>
          ) : (
            leaderboard.map((r, idx) => (
              <div key={r.id} className="vmx-review-item" style={{ background: idx === 0 ? 'rgba(184, 137, 64, 0.1)' : 'var(--clr-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: idx < 3 ? 'var(--clr-gold)' : 'var(--clr-surface-2)', color: idx < 3 ? 'var(--clr-surface)' : 'var(--clr-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--vmx-display)', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--vmx-display)', fontWeight: 600, fontSize: 16 }}>
                      {r.profiles?.avatar_emoji || '🐾'} {r.profiles?.username || 'Anon'}
                      {r.user_id === user.id && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--clr-sage-text)', fontStyle: 'italic' }}>(คุณ)</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)', marginTop: 2 }}>
                      {r.mode === 'exam' ? 'Exam' : 'Practice'}, {r.subject ? SUBJECTS.find((s) => s.id === r.subject)?.name : 'All'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--vmx-display)', fontWeight: 700, fontSize: 22, color: r.pct >= 80 ? 'var(--clr-sage-text)' : r.pct >= 60 ? 'var(--clr-gold-text)' : 'var(--clr-rose-text)' }}>{r.pct}%</div>
                    <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)' }}>{r.correct}/{r.total}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {status === 'ready' && tab === 'questions' && (
        <div>
          <div style={{ marginBottom: 20, fontSize: 13, color: 'var(--clr-ink-soft)' }}>
            ข้อสอบที่สมาชิกในกลุ่มแชร์ไว้<br/>
            <em>ตอนนี้ยังแชร์ข้อสอบเข้ากลุ่มไม่ได้</em>
          </div>
          {questions.length === 0 ? (
            <div className="vmx-empty">ยังไม่มีข้อสอบที่แชร์</div>
          ) : (
            questions.map((q) => (
              <div key={q.id} className="vmx-review-item">
                <div className="vmx-review-head">
                  <span>by {q.author_name || 'Anon'}{!q.invalid && q.data.subject ? `, ${SUBJECTS.find((s) => s.id === q.data.subject)?.name || q.data.subject}` : ''}</span>
                  {q.author_id === user.id && (
                    <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={async () => {
                      if (!(await confirmDialog({ title: 'ลบข้อนี้ออกจากกลุ่ม?', confirmLabel: 'ลบ', tone: 'danger' }))) return;
                      // deleteSharedQuestion throws on any PostgREST or network
                      // error. Unhandled, the row just stayed in the list with
                      // nothing said — the student could not tell a failed
                      // delete from one that had not happened yet.
                      setActionError('');
                      try { await deleteSharedQuestion(q.id); await load(); }
                      catch (e) { setActionError(thaiError(e, 'ลบไม่สำเร็จ ลองใหม่อีกครั้ง')); }
                    }}>🗑</button>
                  )}
                </div>
                {/* getSharedQuestions flags a row whose question cannot be
                    read; it stays in the list so its author can delete it. */}
                {q.invalid ? (
                  <div className="vmx-review-q" style={{ color: 'var(--clr-ink-soft)' }}>แสดงข้อนี้ไม่ได้ เพราะข้อมูลของข้อไม่ครบ</div>
                ) : (
                  <>
                    <div className="vmx-review-q">{q.data.q}</div>
                    {Array.isArray(q.data.tags) && q.data.tags.length > 0 && (
                      <div>{q.data.tags.map((t) => <span key={t} className="vmx-tag-pill">#{t}</span>)}</div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {status === 'ready' && tab === 'members' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {members.map((m) => (
            <div key={m.id} className="vmx-dash-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{m.avatar_emoji || '🐾'}</div>
              <div style={{ fontFamily: 'var(--vmx-display)', fontWeight: 600, fontSize: 16 }}>
                {m.username}
                {m.id === user.id && <div style={{ fontSize: 11, color: 'var(--clr-sage-text)', fontStyle: 'italic' }}>(คุณ)</div>}
              </div>
              {m.role === 'admin' && <div style={{ fontSize: 11, color: 'var(--clr-gold-text)', marginTop: 4 }}>👑 Admin</div>}
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
