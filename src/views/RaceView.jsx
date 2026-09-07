// Server-owned room membership, start and sequential answers. Snapshots
// survive reconnects and never accept another browser's claimed identity.
import { useEffect, useMemo, useRef, useState } from 'react';
import { hasSupabase, getSupabase } from '../lib/supabase.js';
import { questionRevision } from '../lib/study-events.js';
import { ownedRpc } from '../lib/owned-rpc.js';
import { resolveRaceQuestions, mergeRaceProgress, rankRacePlayers } from '../lib/race-session.js';
import { QB, loadQBForYear } from '../data/questions.js';
import { SUBJECTS_BY_YEAR, YEARS, yearForSubject } from '../data/curriculum.js';
import { RichText } from '../lib/richtext.jsx';
import BackBar from '../components/BackBar.jsx';
import { confirmDialog } from '../lib/dialog.js';
import { isQuestionDeliverable } from '../data/question-delivery.generated.js';

export default function RaceView({ goHome, setView, user, profile }) {
  const raceSubjectsByYear = YEARS.map(y => ({ year: y.id, label: y.label,
    items: (SUBJECTS_BY_YEAR[y.id] || []).filter(s => !s.scaffold) })).filter(shelf => shelf.items.length);
  const [phase, setPhase] = useState('lobby');
  const [code, setCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [subject, setSubject] = useState('com3');
  const [count, setCount] = useState(15);
  const [participants, setParticipants] = useState({});
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [endedAt, setEndedAt] = useState(0);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const context = useRef({});
  context.current = { code, owner: user?.id };
  const [bankTick, setBankTick] = useState(0);
  const [loadingBank, setLoadingBank] = useState(false);
  const progressRef = useRef({});
  useEffect(() => {
    let alive = true;
    setLoadingBank(true);
    loadQBForYear(yearForSubject(subject)).then(() => { if (alive) setBankTick(n => n + 1); })
      .catch(() => { if (alive) setError('โหลดคลังข้อสอบไม่สำเร็จ ลองเลือกวิชาอีกครั้ง'); })
      .finally(() => { if (alive) setLoadingBank(false); });
    return () => { alive = false; };
  }, [subject]);
  const eligibleQs = useMemo(() => QB.filter(q => isQuestionDeliverable(q) && q.type === 'mcq'
    && q.subject === subject && q.options?.length >= 3), [subject, bankTick]);

  async function applySnapshot(snapshot, owner, expectedCode) {
    if (context.current.owner !== owner || (expectedCode && context.current.code !== expectedCode)) return;
    let qs = [];
    if (snapshot.started_at) qs = await resolveRaceQuestions(snapshot, QB, loadQBForYear);
    if (context.current.owner !== owner || (expectedCode && context.current.code !== expectedCode)) return;
    if (snapshot.code !== context.current.code) progressRef.current = {};
    const merged = mergeRaceProgress(progressRef.current, snapshot.participants);
    progressRef.current = merged;
    setCode(snapshot.code);
    setIsHost(snapshot.host_id === owner);
    setParticipants(merged);
    if (snapshot.started_at) {
      const me = merged[owner];
      const start = Date.parse(snapshot.started_at);
      setQuestions(qs); setSubject(snapshot.subject); setStartedAt(start);
      setIdx(me?.idx || 0); setCorrect(me?.correct || 0); setFinished(!!me?.finished);
      setEndedAt(me?.finished ? start + me.duration_ms : 0);
      setPhase(me?.finished ? 'done' : 'run');
    }
    setError(null);
  }
  useEffect(() => {
    if (!code || !user?.id) return;
    let alive = true, reading = false;
    const owner = user.id;
    const refresh = async () => {
      if (!alive || reading || document.visibilityState === 'hidden') return;
      reading = true;
      try {
        const state = await ownedRpc(owner, 'race_snapshot', { p_code: code });
        if (alive) await applySnapshot(state, owner, code);
      } catch { if (alive) setError('การเชื่อมต่อสะดุด ระบบกำลังลองใหม่ คำตอบที่ส่งสำเร็จยังอยู่'); }
      finally { reading = false; }
    };
    refresh();
    const timer = setInterval(refresh, 2000);
    window.addEventListener('online', refresh); document.addEventListener('visibilitychange', refresh);
    return () => { alive = false; clearInterval(timer); window.removeEventListener('online', refresh); document.removeEventListener('visibilitychange', refresh); };
  }, [code, user?.id]);

  async function act(work) {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true); setError(null);
    try { await work(); }
    catch (failure) { setError(failure.message || 'ยังส่งไม่สำเร็จ กรุณาลองอีกครั้ง'); }
    finally { busyRef.current = false; setBusy(false); }
  }
  const createRace = () => act(async () => {
    const owner = user.id;
    await applySnapshot(await ownedRpc(owner, 'enter_race', { p_code: null }), owner);
  });
  const joinRace = input => act(async () => {
    const value = String(input || '').trim().toUpperCase();
    if (!/^[A-F0-9]{6}$/.test(value)) throw new Error('ใส่รหัสห้อง 6 ตัวจากเพื่อน (ห้องรุ่นเก่าต้องสร้างใหม่)');
    const owner = user.id;
    await applySnapshot(await ownedRpc(owner, 'enter_race', { p_code: value }), owner);
  });
  const startRace = () => act(async () => {
    if (!isHost || loadingBank || eligibleQs.length < count) throw new Error('รอโหลดคลัง หรือเลือกจำนวนไม่เกินข้อสอบที่มี');
    const shuffled = [...eligibleQs];
    for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
    const owner = user.id;
    const sb = await getSupabase();
    const { data: { session } = {} } = await sb.auth.getSession();
    if (session?.user?.id !== owner) throw new Error('กรุณาเข้าสู่บัญชีเดิม');
    const response = await fetch('/api/race-start', { method: 'POST', signal: AbortSignal.timeout(30_000),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session.access_token },
      body: JSON.stringify({ code, questionIds: shuffled.slice(0, count).map(q => q.id), questionVersions: Object.fromEntries(shuffled.slice(0, count).map(q => [q.id, questionRevision(q)])) }) });
    if (!response.ok) throw new Error('ยังเริ่มไม่ได้ กรุณาตรวจว่ามีเพื่อนในห้องและลองอีกครั้ง');
    await applySnapshot(await response.json(), owner, code);
  });
  const answer = option => act(async () => {
    if (phase !== 'run' || finished || !questions[idx]) return;
    const owner = user.id;
    const state = await ownedRpc(owner, 'answer_race', { p_code: code, p_index: idx, p_answer: option });
    await applySnapshot(state, owner, code);
  });

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
        <div className="vmx-hero"><h1>แข่งกับ <em>เพื่อน</em></h1><p>ทำข้อสอบพร้อมกัน สร้างรหัสห้องหรือใส่รหัสจากเพื่อน</p></div>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: 18 }}>
          <button className="vmx-btn vmx-btn-primary" onClick={createRace} disabled={busy} style={{ padding: '14px 20px' }}>
            สร้าง Race ใหม่
          </button>
          <JoinForm onJoin={joinRace} busy={busy} />
        </div>
        {error && <div style={{ color: 'var(--clr-rose-text, #c0392b)', fontSize: 13 }}>{error}</div>}
      </>
    );
  }

  if (phase === 'lobby' && code) {
    const others = Object.entries(participants).filter(([k]) => k !== user.id);
    return (
      <>
        <BackBar onBack={() => { setCode(''); setParticipants({}); setIsHost(false); progressRef.current = {}; }} label="กลับ Lobby" />
        <div className="vmx-hero"><h1>รหัส <em>ห้องแข่ง</em></h1></div>
        <div style={{ padding: 24, borderRadius: 12, background: 'var(--clr-surface-2)', textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>RACE CODE</div>
          <div style={{ fontSize: 44, letterSpacing: '0.18em', fontFamily: 'var(--vmx-mono)', fontWeight: 700, marginTop: 8, color: 'var(--clr-sage-text)' }}>{code}</div>
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--clr-ink-soft)' }}>ส่ง code นี้ให้เพื่อน, ทุกคนต้องอยู่ในห้องก่อนเริ่ม</div>
        </div>

        {isHost && (
          <div style={{ marginBottom: 16, padding: 12, borderRadius: 10, border: '1px solid var(--clr-border)' }}>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--vmx-mono)', marginBottom: 8 }}>Host: ตั้งค่า</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
              <label htmlFor="vmx-race-subject" style={{ fontSize: 13 }}>วิชา:</label>
              <select id="vmx-race-subject" value={subject} onChange={(e) => setSubject(e.target.value)} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--clr-border)', background: 'var(--clr-bg)', color: 'var(--clr-ink)', fontSize: 13 }}>
                {/* Grouped by year. Flat, this listed every subject in the app
                    together, so a second-year host picking a race scrolled
                    past Year 5 clinical subjects with nothing to say they
                    belong to a different year. */}
                {raceSubjectsByYear.map((shelf) => (
                  <optgroup key={shelf.year} label={shelf.label}>
                    {shelf.items.map((s) => (
                      <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <label htmlFor="vmx-race-count" style={{ fontSize: 13, marginLeft: 12 }}>จำนวนข้อ:</label>
              <input id="vmx-race-count" type="number" min="5" max="50" value={count} onChange={(e) => setCount(Math.max(5, Math.min(50, parseInt(e.target.value || 0, 10))))} style={{ width: 60, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--clr-border)', background: 'var(--clr-bg)', color: 'var(--clr-ink)', fontSize: 13 }} />
            </div>
            <button className="vmx-btn vmx-btn-primary" onClick={startRace} disabled={busy || loadingBank || others.length === 0} style={{ width: '100%' }}>
              {others.length === 0 ? '🕐 รอเพื่อนเข้าห้อง…' : `🏁 เริ่ม! (${others.length + 1} คน)`}
            </button>
          </div>
        )}

        <div style={{ marginBottom: 8, fontSize: 12, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', fontFamily: 'var(--vmx-mono)', letterSpacing: '0.05em' }}>ในห้อง ({Object.keys(participants).length})</div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {Object.entries(participants).map(([k, p]) => (
            <li key={k} style={{ padding: '6px 10px', borderRadius: 8, background: 'var(--clr-surface)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>{p.avatar}</span>
              <span style={{ fontSize: 13, fontWeight: k === user.id ? 700 : 400 }}>{p.username}{k === user.id && ' (คุณ)'}{k === user.id && isHost && ', host'}</span>
            </li>
          ))}
        </ul>
        {error && <div style={{ marginTop: 12, color: 'var(--clr-rose-text, #c0392b)', fontSize: 13 }}>{error}</div>}
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
        <BackBar onBack={async () => { if (await confirmDialog({ title: 'ออกจาก race?', body: 'คะแนนรอบนี้ของคุณจะหาย', confirmLabel: 'ออก', tone: 'danger' })) goHome(); }} label="ออก" subtitle={`Race ${code}`} />
        <ProgressBars myIdx={idx} myCorrect={correct} mySelf={profile} others={others} total={questions.length} />
        {busy && <p role="status">กำลังบันทึกคำตอบ…</p>}
        {error && <p role="alert" style={{ color: 'var(--clr-rose-text)' }}>{error}</p>}
        {q && (
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)', marginBottom: 4 }}>Q{idx + 1} / {questions.length}</div>
            <div style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 14 }}><RichText text={q.q} /></div>
            <div className="vmx-options">
              {q.options.map((opt, i) => (
                <button key={i} className="vmx-option" disabled={busy} onClick={() => answer(i)}>
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
    const allRows = rankRacePlayers(participants);
    return (
      <>
        <BackBar onBack={goHome} label="หน้าแรก" subtitle={`Race ${code} จบแล้ว`} />
        <div className="vmx-hero"><h1>ผลการ <em>แข่ง</em></h1><p>เวลา: {fmtMs(elapsed)}, ตอบถูก {correct}/{questions.length} ข้อ</p></div>
        <p>เรียงผู้ที่ตอบครบก่อน แล้วเรียงคะแนนเท่ากันด้วยเวลาที่ใช้ สมาชิกที่ยังไม่จบจะแสดงสถานะไว้</p>
        {error && <p role="alert">{error}</p>}
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {allRows.map((p, i) => (
            <li key={p.user_id} style={{ padding: 12, borderRadius: 10, background: i === 0 ? 'rgba(184, 137, 64, 0.18)' : 'var(--clr-surface)', border: i === 0 ? '1px solid var(--clr-gold)' : '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 22 }}>{['🥇', '🥈', '🥉'][i] || `#${i + 1}`}</span>
              <span style={{ fontSize: 16 }}>{p.avatar}</span>
              <span style={{ flex: 1, fontWeight: p.user_id === user.id ? 700 : 400 }}>{p.username}{p.user_id === user.id && ' (คุณ)'}</span>
              <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 14 }}>{p.correct}/{questions.length}, Q{p.idx}{!p.finished && ' (ยังไม่จบ)'}</span>
            </li>
          ))}
        </ol>
        <div className="vmx-btn-row" style={{ marginTop: 16 }}>
          <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
          <button className="vmx-btn vmx-btn-primary" onClick={() => { setPhase('lobby'); setCode(''); setParticipants({}); setIdx(0); setCorrect(0); setFinished(false); setQuestions([]); progressRef.current = {}; }}>🔄 race อีกรอบ</button>
        </div>
      </>
    );
  }

  return null;
}

function JoinForm({ onJoin, busy }) {
  const [val, setVal] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); onJoin(val); }} style={{ display: 'flex', gap: 6, padding: '14px 16px', borderRadius: 10, border: '1px solid var(--clr-border)', alignItems: 'center' }}>
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value.toUpperCase())}
        aria-label="รหัสห้องแข่ง" placeholder="รหัส 6 ตัว เช่น A3C7F2"
        maxLength={6}
        style={{ flex: 1, minWidth: 0, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--clr-border)', fontFamily: 'var(--vmx-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'var(--clr-bg)', color: 'var(--clr-ink)', fontSize: 14 }}
      />
      <button type="submit" className="vmx-btn vmx-btn-primary vmx-btn-sm" disabled={busy || !val.trim()}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3, fontFamily: 'var(--vmx-mono)' }}>
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
