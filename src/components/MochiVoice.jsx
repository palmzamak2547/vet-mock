// ============================================================
// MochiVoice — talk to Mochi by voice, answers from VetWiki with sources.
//
// Mounted only for accounts the server enables (admins until
// MOCHI_VOICE_OPEN=1). Every end state says what happened and offers the
// typed path, so a full quota or a dropped line never dead-ends the student.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import Mochi from './Mochi.jsx';
import { MochiVoiceSession, CAP_MESSAGES } from '../lib/mochi-voice.js';

const STATE_TEXT = {
  idle: 'แตะเพื่อเริ่มคุย',
  connecting: 'กำลังเชื่อมต่อ…',
  reconnecting: 'สายหลุด กำลังต่อใหม่…',
  listening: 'ฟังอยู่ พูดได้เลย',
  searching: 'กำลังค้นในคลัง VetMock…',
  speaking: 'Mochi กำลังตอบ พูดแทรกได้',
};
const POSE = { idle: 'wave', connecting: 'loading', reconnecting: 'loading', listening: 'curious', searching: 'read', speaking: 'happy' };
const END_TEXT = {
  stopped: 'จบการคุยแล้ว',
  session_time_up: 'ครบเวลาของรอบนี้แล้ว เริ่มรอบใหม่ได้ถ้ายังมีโควตา',
  connection_lost: 'สายหลุดและต่อใหม่ไม่สำเร็จ ลองเริ่มใหม่ หรือถามแบบพิมพ์',
};

export default function MochiVoice({ onTypeInstead }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState('idle');
  const [lines, setLines] = useState([]);
  const [sources, setSources] = useState([]);
  const [notice, setNotice] = useState('');
  const [text, setText] = useState('');
  const session = useRef(null);

  useEffect(() => () => session.current?.stop(), []);

  const add = (role, chunk) => setLines((prev) => {
    const last = prev[prev.length - 1];
    if (last && last.role === role) return [...prev.slice(0, -1), { role, text: last.text + chunk }];
    return [...prev.slice(-30), { role, text: chunk }];
  });

  async function start() {
    setNotice(''); setSources([]);
    const s = new MochiVoiceSession({
      onState: setState,
      onTranscript: add,
      onSources: (r) => setSources(r.slice(0, 4)),
      onNotice: setNotice,
      onEnd: (reason) => {
        setState('idle');
        setNotice(CAP_MESSAGES[reason] || END_TEXT[reason] || END_TEXT.connection_lost);
        if (session.current === s) session.current = null;
      },
    });
    session.current = s;
    await s.start();
  }

  const live = session.current && state !== 'idle';

  return (
    <>
      <button type="button" aria-label="คุยกับ Mochi ด้วยเสียง" onClick={() => setOpen((v) => !v)}
        style={{ position: 'fixed', right: 16, bottom: 'calc(84px + env(safe-area-inset-bottom))', zIndex: 60,
          width: 56, height: 56, borderRadius: 28, border: '1px solid var(--clr-border)',
          background: 'var(--clr-surface)', color: 'var(--clr-ink)', boxShadow: '0 4px 16px rgba(0,0,0,.18)', cursor: 'pointer' }}>
        <Mochi state={live ? POSE[state] : 'wave'} size={40} slot="voice" fallback="🎙" />
      </button>
      {open && (
        <section role="dialog" aria-label="คุยกับ Mochi"
          style={{ position: 'fixed', right: 16, left: 16, bottom: 'calc(152px + env(safe-area-inset-bottom))', zIndex: 60,
            maxWidth: 420, marginLeft: 'auto', maxHeight: '60vh', display: 'flex', flexDirection: 'column', gap: 10,
            padding: 14, borderRadius: 16, border: '1px solid var(--clr-border)', background: 'var(--clr-surface)',
            color: 'var(--clr-ink)', boxShadow: '0 8px 32px rgba(0,0,0,.22)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Mochi state={POSE[state] || 'idle'} size={44} slot="voice" fallback="🐾" />
            <div style={{ flex: 1 }}>
              <strong>คุยกับ Mochi</strong>
              <div aria-live="polite" style={{ fontSize: 13, color: 'var(--clr-ink-soft)' }}>{STATE_TEXT[state] || ''}</div>
            </div>
            {live
              ? <button type="button" onClick={() => session.current?.stop()}>จบ</button>
              : <button type="button" onClick={start}>เริ่มคุย</button>}
          </div>

          {notice && <p role="status" style={{ margin: 0, fontSize: 14, color: 'var(--clr-rose-text)' }}>{notice}</p>}

          <div style={{ overflowY: 'auto', fontSize: 15, lineHeight: 1.5 }}>
            {lines.map((l, i) => (
              <p key={i} style={{ margin: '0 0 6px', color: l.role === 'user' ? 'var(--clr-ink-soft)' : 'var(--clr-ink)' }}>
                <b>{l.role === 'user' ? 'คุณ' : 'Mochi'}:</b> {l.text}
              </p>
            ))}
          </div>

          {sources.length > 0 && (
            <div style={{ fontSize: 13 }}>
              <div style={{ color: 'var(--clr-ink-soft)' }}>ที่มาของคำตอบ</div>
              {sources.map((s) => (
                <a key={s.id} href={s.url} style={{ display: 'block', color: 'var(--clr-ocean-text)' }}>{s.title}: {s.heading}</a>
              ))}
            </div>
          )}

          {live ? (
            <form onSubmit={(e) => { e.preventDefault(); session.current?.sendText(text); setText(''); }} style={{ display: 'flex', gap: 6 }}>
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="หรือพิมพ์ถาม Mochi" aria-label="พิมพ์ถาม Mochi"
                style={{ flex: 1, minHeight: 44, padding: '0 10px', borderRadius: 10, border: '1px solid var(--clr-border)', background: 'var(--clr-surface-2)', color: 'var(--clr-ink)' }} />
              <button type="submit">ส่ง</button>
            </form>
          ) : (
            onTypeInstead && <button type="button" onClick={() => { setOpen(false); onTypeInstead(); }}>ถามแบบพิมพ์แทน</button>
          )}
          <p style={{ margin: 0, fontSize: 12, color: 'var(--clr-ink-soft)' }}>ไว้ช่วยทบทวนบทเรียน ไม่ใช่คำแนะนำการรักษาสัตว์จริง</p>
        </section>
      )}
    </>
  );
}

