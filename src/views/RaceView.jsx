// ============================================================
// RaceView — multiplayer Q-race over Supabase Realtime broadcast
// ============================================================
//
// Two phases:
//   1. Lobby — create or join via 5-char code. Creator picks subject
//      + question count; once both players are present + the creator
//      taps Start, the same question set is broadcast to everyone.
//   2. Run — local-state quiz UI; on each answer, broadcast { idx,
//      correct, finished } over the channel. We render TWO progress
//      bars: self + opponent. First to finish wins on time; tied
//      score broken by duration. Final score recorded to race_results
//      so a leaderboard view can pick it up later.
//
// The race uses ONE Supabase channel per code:
//   • broadcast events: 'start', 'progress', 'finish'
//   • presence: who's in the lobby
// No DB rows during the race itself. Free tier OK for low-volume.
// ============================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { hasSupabase, getSupabase } from '../lib/supabase.js';
import { recordRaceResult } from '../lib/api.js';
import { QB } from '../data/questions.js';
import { isCorrect } from '../hooks/utils.js';
import { SUBJECTS } from '../data/curriculum.js';
import { RichText } from '../lib/richtext.jsx';
import BackBar from '../components/BackBar.jsx';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const randomCode = () => Array.from({ length: 5 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');

export default function RaceView({ goHome, setView, user, profile }) {
  const [phase, setPhase] = useState('lobby');     // lobby | run | done
  const [code, setCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [subject, setSubject] = useState('com3');
  const [count, setCount] = useState(15);
  const [participants, setParticipants] = useState({}); // { user_id: { username, avatar, idx, correct, finished } }
  const [questions, setQuestions] = useState([]);  // shared question set
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [endedAt, setEndedAt] = useState(0);
  const channelRef = useRef(null);
  const [error, setError] = useState(null);

  // Eligible MCQ pool — race only supports MCQ for fairness + speed
  const eligibleQs = useMemo(() =>
    QB.filter((q) => q.type === 'mcq' && q.subject === subject && q.options?.length >= 3),
  [subject]);

  // ── Channel setup ────────────────────────────────────────────
  // Whenever code changes (host: just generated; guest: just typed),
  // open a Realtime channel for that code. Subscribe to broadcast +
  // presence so we can see other participants live.
  useEffect(() => {
    if (!code || phase !== 'lobby') return;
    if (!hasSupabase || !user) {
      setError('ต้อง login + Supabase ก่อน');
      return;
    }
    let active = true;
    let cleanupFn = () => {};
    (async () => {
      const supabase = await getSupabase();
      if (!supabase) return;
      const ch = supabase.channel(`race:${code}`, {
        config: { presence: { key: user.id } },
      });
      ch.on('broadcast', { event: 'start' }, (payload) => {
        if (!active) return;
        const { qIds } = payload.payload || {};
        const qs = qIds.map((k) => {
          const [s, idStr] = k.split(':');
          const id = parseInt(idStr, 10);
          return QB.find((q) => q.subject === s && q.id === id);
        }).filter(Boolean);
        if (qs.length) {
          setQuestions(qs);
          setStartedAt(Date.now());
          setPhase('run');
        }
      });
      ch.on('broadcast', { event: 'progress' }, (payload) => {
        if (!active) return;
        const { user_id, username, avatar, idx: pIdx, correct: pCorrect, finished: pFinished } = payload.payload || {};
        if (!user_id) return;
        setParticipants((prev) => ({
          ...prev,
          [user_id]: { username, avatar, idx: pIdx, correct: pCorrect, finished: pFinished },
        }));
      });
      ch.on('presence', { event: 'sync' }, () => {
        if (!active) return;
        const state = ch.presenceState();
        const merged = {};
        for (const k of Object.keys(state)) {
          const meta = state[k]?.[0] || {};
          merged[k] = {
            username: meta.username || 'ผู้ใช้',
            avatar: meta.avatar || '🐾',
            idx: 0, correct: 0, finished: false,
          };
        }
        setParticipants((prev) => {
          const merged2 = { ...merged };
          for (const k of Object.keys(prev)) {
            if (merged2[k]) merged2[k] = { ...merged2[k], ...prev[k] };
          }
          return merged2;
        });
      });
      await ch.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await ch.track({
            username: profile?.username || user.email?.split('@')[0] || 'guest',
            avatar: profile?.avatar_emoji || '🐾',
            joined_at: Date.now(),
          });
        }
      });
      channelRef.current = ch;
      cleanupFn = () => {
        try { ch.untrack?.(); } catch {}
        try { ch.unsubscribe?.(); } catch {}
      };
    })();
    return () => { active = false; cleanupFn(); };
  }, [code, phase, user, profile]);

  // Reconnect race-channel presence when tab returns to foreground.
  // iOS Safari kills background WebSockets; without this the race
  // partner sees us as "left" and we miss broadcast events. Re-tracking
  // re-announces presence and Supabase's reconnect handles the rest.
  useEffect(() => {
    if (!user || !code) return;
    const onVis = () => {
      if (document.visibilityState !== 'visible') return;
      const ch = channelRef.current;
      if (!ch) return;
      try {
        ch.track({
          username: profile?.username || user.email?.split('@')[0] || 'guest',
          avatar: profile?.avatar_emoji || '🐾',
          joined_at: Date.now(),
        });
      } catch {}
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [user, profile, code]);

  // ── Lobby actions ────────────────────────────────────────────
  function createRace() {
    setIsHost(true);
    setCode(randomCode());
    setError(null);
  }
  function joinRace(input) {
    const c = String(input || '').trim().toUpperCase();
    if (!/^[A-Z0-9]{4,8}$/.test(c)) {
      setError('Code ต้องเป็นตัวอักษร/ตัวเลข 4-8 ตัว');
      return;
    }
    setIsHost(false);
    setCode(c);
    setError(null);
  }
  async function startRace() {
    if (!isHost) return;
    if (eligibleQs.length < count) {
      setError(`มีข้อ MCQ ในวิชานี้แค่ ${eligibleQs.length} ข้อ`);
      return;
    }
    // Pick `count` random Qs from the eligible pool (Fisher-Yates lite)
    const shuffled = [...eligibleQs].sort(() => Math.random() - 0.5).slice(0, count);
    const qIds = shuffled.map((q) => `${q.subject}:${q.id}`);
    const ch = channelRef.current;
    if (!ch) return;
    await ch.send({ type: 'broadcast', event: 'start', payload: { qIds } });
    // Local state for host (broadcast doesn't echo to sender by default)
    setQuestions(shuffled);
    setStartedAt(Date.now());
    setPhase('run');
  }

  // ── Run — answer + broadcast progress ────────────────────────
  async function answer(optionIdx) {
    if (phase !== 'run' || finished) return;
    const q = questions[idx];
    if (!q) return;
    const wasCorrect = isCorrect(q, optionIdx);
    const newCorrect = correct + (wasCorrect ? 1 : 0);
    const newIdx = idx + 1;
    const isFinished = newIdx >= questions.length;
    setCorrect(newCorrect);
    setIdx(newIdx);
    if (isFinished) {
      setFinished(true);
      const ms = Date.now() - startedAt;
      setEndedAt(Date.now());
      // Persist final result + broadcast finish
      try {
        await recordRaceResult(code, user.id, subject, questions.length, newCorrect, ms);
      } catch {}
      const ch = channelRef.current;
      if (ch) {
        await ch.send({
          type: 'broadcast', event: 'progress',
          payload: { user_id: user.id, username: profile?.username || 'me', avatar: profile?.avatar_emoji || '🐾', idx: newIdx, correct: newCorrect, finished: true },
        });
      }
      setPhase('done');
    } else {
      const ch = channelRef.current;
      if (ch) {
        await ch.send({
          type: 'broadcast', event: 'progress',
          payload: { user_id: user.id, username: profile?.username || 'me', avatar: profile?.avatar_emoji || '🐾', idx: newIdx, correct: newCorrect, finished: false },
        });
      }
    }
  }

  // ── Render: Lobby ────────────────────────────────────────────
  if (!hasSupabase) {
    return (
      <>
        <BackBar onBack={goHome} label="หน้าแรก" />
        <div className="vmx-empty">
          🏁 Race ต้อง Supabase + login ก่อน — single-player ใช้ไม่ได้
        </div>
      </>
    );
  }
  if (!user) {
    return (
      <>
        <BackBar onBack={goHome} label="หน้าแรก" />
        <div className="vmx-empty">
          ต้อง login ก่อนเพื่อแข่ง — <button className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={() => setView('auth')}>Login</button>
        </div>
      </>
    );
  }

  if (phase === 'lobby' && !code) {
    return (
      <>
        <BackBar onBack={goHome} label="หน้าแรก" />
        <div className="vmx-hero"><h1>🏁 <em>Race</em> Mode</h1><p>แข่งทำข้อสอบกับเพื่อนแบบ realtime — สร้าง code หรือใส่ code เพื่อนำ</p></div>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: 18 }}>
          <button className="vmx-btn vmx-btn-primary" onClick={createRace} style={{ padding: '14px 20px' }}>
            ➕ สร้าง Race ใหม่
          </button>
          <JoinForm onJoin={joinRace} />
        </div>
        {error && <div style={{ color: 'var(--clr-rose, #c0392b)', fontSize: 13 }}>{error}</div>}
      </>
    );
  }

  if (phase === 'lobby' && code) {
    const others = Object.entries(participants).filter(([k]) => k !== user.id);
    return (
      <>
        <BackBar onBack={() => { setCode(''); setParticipants({}); setIsHost(false); }} label="กลับ Lobby" />
        <div className="vmx-hero"><h1>🏁 <em>Race</em> Code</h1></div>
        <div style={{ padding: 24, borderRadius: 12, background: 'var(--clr-surface-2)', textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>RACE CODE</div>
          <div style={{ fontSize: 44, letterSpacing: '0.18em', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, marginTop: 8, color: 'var(--clr-sage)' }}>{code}</div>
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--clr-ink-soft)' }}>ส่ง code นี้ให้เพื่อน, ทุกคนต้องอยู่ในห้องก่อนเริ่ม</div>
        </div>

        {isHost && (
          <div style={{ marginBottom: 16, padding: 12, borderRadius: 10, border: '1px solid var(--clr-border)' }}>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>Host: ตั้งค่า</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 13 }}>วิชา:</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--clr-border)', background: 'var(--clr-bg)', color: 'var(--clr-ink)', fontSize: 13 }}>
                {SUBJECTS.filter((s) => !s.scaffold).map((s) => (
                  <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                ))}
              </select>
              <label style={{ fontSize: 13, marginLeft: 12 }}>จำนวนข้อ:</label>
              <input type="number" min="5" max="50" value={count} onChange={(e) => setCount(Math.max(5, Math.min(50, parseInt(e.target.value || 0, 10))))} style={{ width: 60, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--clr-border)', background: 'var(--clr-bg)', color: 'var(--clr-ink)', fontSize: 13 }} />
            </div>
            <button className="vmx-btn vmx-btn-primary" onClick={startRace} disabled={others.length === 0} style={{ width: '100%' }}>
              {others.length === 0 ? '🕐 รอเพื่อนเข้าห้อง…' : `🏁 เริ่ม! (${others.length + 1} คน)`}
            </button>
          </div>
        )}

        <div style={{ marginBottom: 8, fontSize: 12, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}>ในห้อง ({Object.keys(participants).length})</div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {Object.entries(participants).map(([k, p]) => (
            <li key={k} style={{ padding: '6px 10px', borderRadius: 8, background: 'var(--clr-surface)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>{p.avatar}</span>
              <span style={{ fontSize: 13, fontWeight: k === user.id ? 700 : 400 }}>{p.username}{k === user.id && ' (คุณ)'}{k === user.id && isHost && ', host'}</span>
            </li>
          ))}
        </ul>
        {error && <div style={{ marginTop: 12, color: 'var(--clr-rose, #c0392b)', fontSize: 13 }}>{error}</div>}
      </>
    );
  }

  // ── Run + Done ───────────────────────────────────────────────
  const others = Object.entries(participants).filter(([k]) => k !== user.id);
  const myPct = questions.length > 0 ? (idx / questions.length) * 100 : 0;
  const elapsed = phase === 'done' ? endedAt - startedAt : Date.now() - startedAt;
  const fmtMs = (ms) => `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`;

  if (phase === 'run') {
    const q = questions[idx];
    return (
      <>
        <BackBar onBack={() => { if (confirm('ออกจาก race? คะแนนของคุณจะหาย')) goHome(); }} label="ออก" subtitle={`Race ${code}`} />
        <ProgressBars myIdx={idx} myCorrect={correct} mySelf={profile} others={others} total={questions.length} />
        {q && (
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>Q{idx + 1} / {questions.length}</div>
            <div style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 14 }}><RichText text={q.q} /></div>
            <div className="vmx-options">
              {q.options.map((opt, i) => (
                <button key={i} className="vmx-option" onClick={() => answer(i)}>
                  <div className="vmx-option-letter">{String.fromCharCode(65 + i)}</div>
                  <div className="vmx-option-text"><RichText text={opt} /></div>
                </button>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  if (phase === 'done') {
    // Build podium — sort participants by correct desc, then idx (faster finish)
    const allRows = Object.entries({
      ...participants,
      [user.id]: { username: profile?.username || 'me', avatar: profile?.avatar_emoji || '🐾', idx, correct, finished: true },
    }).map(([k, p]) => ({ ...p, user_id: k }));
    allRows.sort((a, b) => (b.correct - a.correct) || (b.idx - a.idx));
    return (
      <>
        <BackBar onBack={goHome} label="หน้าแรก" subtitle={`Race ${code} จบแล้ว`} />
        <div className="vmx-hero"><h1>🏁 <em>Race</em> Result</h1><p>เวลา: {fmtMs(elapsed)}, {correct}/{questions.length} ถูก</p></div>
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {allRows.map((p, i) => (
            <li key={p.user_id} style={{ padding: 12, borderRadius: 10, background: i === 0 ? 'rgba(184, 137, 64, 0.18)' : 'var(--clr-surface)', border: i === 0 ? '1px solid var(--clr-gold)' : '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 22 }}>{['🥇', '🥈', '🥉'][i] || `#${i + 1}`}</span>
              <span style={{ fontSize: 16 }}>{p.avatar}</span>
              <span style={{ flex: 1, fontWeight: p.user_id === user.id ? 700 : 400 }}>{p.username}{p.user_id === user.id && ' (คุณ)'}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14 }}>{p.correct}/{questions.length}, Q{p.idx}{!p.finished && ' (ยังไม่จบ)'}</span>
            </li>
          ))}
        </ol>
        <div className="vmx-btn-row" style={{ marginTop: 16 }}>
          <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
          <button className="vmx-btn vmx-btn-primary" onClick={() => { setPhase('lobby'); setCode(''); setParticipants({}); setIdx(0); setCorrect(0); setFinished(false); setQuestions([]); }}>🔄 race อีกรอบ</button>
        </div>
      </>
    );
  }

  return null;
}

function JoinForm({ onJoin }) {
  const [val, setVal] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); onJoin(val); }} style={{ display: 'flex', gap: 6, padding: '14px 16px', borderRadius: 10, border: '1px solid var(--clr-border)', alignItems: 'center' }}>
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value.toUpperCase())}
        placeholder="ใส่ code (เช่น A3K7Q)"
        maxLength={8}
        style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--clr-border)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'var(--clr-bg)', color: 'var(--clr-ink)', fontSize: 14 }}
      />
      <button type="submit" className="vmx-btn vmx-btn-primary vmx-btn-sm" disabled={!val.trim()}>
        เข้าห้อง
      </button>
    </form>
  );
}

function ProgressBars({ myIdx, myCorrect, mySelf, others, total }) {
  const Bar = ({ name, idx, correct, isMe }) => {
    const pct = total > 0 ? (idx / total) * 100 : 0;
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3, fontFamily: 'JetBrains Mono, monospace' }}>
          <span style={{ fontWeight: isMe ? 700 : 400 }}>{name}{isMe && ' (คุณ)'}</span>
          <span>{correct}/{idx} ถูก, Q{idx}/{total}</span>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: 'var(--clr-surface-2)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: isMe ? 'var(--clr-sage)' : 'var(--clr-gold)', transition: 'width 0.3s' }} />
        </div>
      </div>
    );
  };
  return (
    <div style={{ marginTop: 10 }}>
      <Bar name={mySelf?.username || 'me'} idx={myIdx} correct={myCorrect} isMe />
      {others.map(([k, p]) => <Bar key={k} name={p.username} idx={p.idx || 0} correct={p.correct || 0} />)}
    </div>
  );
}
