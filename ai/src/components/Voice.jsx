import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createVoice, VOICE_ERRORS } from '../lib/voice.js';
import { voiceSound } from '../lib/voice-sound.js';
import { cleanSpoken, revealed, nextRate, keyTerms, toChatMessages, chatRecap, clock, currentQuestion, CAPTION_CPS } from '../lib/voice-turns.js';
import { newId, getPref, setPref } from '../lib/store.js';
import { reducedMotion } from '../lib/env.js';
import { speciesOf } from '../lib/species.js';
import { IconMic, IconMicOff, IconHangUp, IconKeyboard, IconSend, IconArrowOut, IconRetry, IconClose, IconImage, IconSliders } from './icons.jsx';
import { KIND } from './Message.jsx';
import '../styles/voice.css';

// ============================================================
// Voice — the call screen over the sea
// ============================================================
// Mounting it starts a call (lib/voice.js); unmounting ends it. The agent is
// the jelly the sea holds at the core's place (ocean setVoice), driven by the
// call's levels each frame. Under it: what is happening, what the student
// said, and the words to catch: by default the English terms as they are said
// (key terms beat word-for-word captions for learning from speech), the whole
// caption one tap away (CC). The sources of a look-up, a quiz from the bank
// (options on screen while they are read: heard-only options load working
// memory and bias toward the last one) and a photo the student sends sit
// below. When the call ends its transcript goes back to the page as a chat.
// ============================================================

const STATUS = {
  starting: 'ขอใช้ไมค์',
  connecting: 'กำลังเชื่อมต่อ',
  first: 'พูดได้เลย',
  listening: 'กำลังฟัง',
  thinking: 'ค้นในคลัง VetMock',
  speaking: 'กำลังตอบ',
  reconnecting: 'สายหลุด กำลังต่อใหม่',
  muted: 'ปิดไมค์อยู่ แตะไมค์เพื่อพูด',
};
const LETTERS = ['ก', 'ข', 'ค', 'ง', 'จ', 'ฉ', 'ช', 'ซ'];
const WARN_S = 30;
// a look-up that outlasts the spoken lead-in gets one soft ping (research: silent waits under 4-8 s)
const PING_AFTER_MS = 2000;
const FOLLOW_UPS = ['อธิบายเพิ่มอีกนิด', 'ขอข้อสอบเรื่องนี้', 'สรุปให้จำง่าย ๆ'];

function endNote(reason, { ms, sessionSeconds, quietFor }) {
  if (reason === 'error') return 'สายหลุดระหว่างคุย บทสนทนาเก็บไว้ในแชตแล้ว';
  if (reason === 'agent') {
    if (sessionSeconds && ms >= (sessionSeconds - 6) * 1000) return 'หมดเวลาของรอบนี้แล้ว เริ่มรอบใหม่ได้ที่ปุ่มเสียง';
    if (quietFor > 100_000) return 'วางสายเพราะเงียบไปนาน';
  }
  return '';
}

export default function Voice({ oceanRef, still, onDone, onClose, chat = [] }) {
  const rootRef = useRef(null);
  const coreRef = useRef(null);
  const voiceRef = useRef(null);
  const phaseRef = useRef('starting');
  const turnsRef = useRef([]);
  const agentRef = useRef({ text: '', at: 0, done: true, prev: null });
  const rateRef = useRef(CAPTION_CPS);
  const lastHeardAt = useRef(Date.now());
  const sessionRef = useRef(null);
  const connectedAt = useRef(0);
  const doneRef = useRef(false);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const captionRef = useRef(null);
  const typedAt = useRef(0);
  const pending = useRef({ sources: null, cards: [] });
  const lastTurn = useRef(null);
  const pingTimer = useRef(0);
  const heardOnce = useRef(false);
  const micPeak = useRef(0);
  const echoes = useRef([]);
  const hinted = useRef(new Set());
  const chatRef = useRef(chat);
  chatRef.current = chat;

  const [phase, setPhaseState] = useState('starting');
  const [error, setError] = useState(null);
  const [caption, setCaption] = useState('');
  const [heard, setHeard] = useState('');
  const [deck, setDeck] = useState(null);
  const [papers, setPapers] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [muted, setMuted] = useState(false);
  const [typing, setTyping] = useState(false);
  const [left, setLeft] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [spoke, setSpoke] = useState(false);
  const [full, setFull] = useState(() => getPref('vmai-voice-cc') === 'full');
  const [photo, setPhoto] = useState(null); // { preview, sending }
  const [hint, setHint] = useState('');
  const [sheet, setSheet] = useState(null); // devices: { inputs, outputs, input, output }
  const [answered, setAnswered] = useState(false); // an answer just finished: offer follow-ups

  const setPhase = useCallback((p) => { phaseRef.current = p; setPhaseState(p); }, []);
  const say = useCallback((id, text) => {
    if (hinted.current.has(id)) return;
    hinted.current.add(id);
    setHint(text);
  }, []);

  // ── the call ────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    doneRef.current = false;
    turnsRef.current = [];
    const finish = (info) => {
      if (doneRef.current) return;
      doneRef.current = true;
      agentRef.current = { text: '', at: 0, done: true, prev: null };
      clearTimeout(pingTimer.current);
      voiceSound.close();
      navigator.vibrate?.(8);
      onDone(toChatMessages(turnsRef.current, newId), info);
    };
    const v = createVoice({
      onPhase: (p) => {
        if (!alive || p === 'ended') return;
        if ((p === 'listening' || p === 'thinking') && phaseRef.current === 'connecting') {
          connectedAt.current = Date.now();
          voiceSound.open();
          navigator.vibrate?.(8);
          // a call started from a chat goes on from it: the agent knows what was typed
          const recap = chatRecap(chatRef.current);
          if (recap) v.context(recap);
        }
        clearTimeout(pingTimer.current);
        if (p === 'thinking') pingTimer.current = setTimeout(() => { if (phaseRef.current === 'thinking') voiceSound.ping(); }, PING_AFTER_MS);
        if (p === 'speaking') setAnswered(false);
        if (p === 'listening' && phaseRef.current === 'speaking') {
          const last = turnsRef.current[turnsRef.current.length - 1];
          setAnswered(Boolean(last?.role === 'agent' && !last.lead && last.text.length > 40));
        }
        setPhase(p);
      },
      onSession: (s) => { sessionRef.current = s; },
      onUser: (text) => {
        const t = cleanSpoken(text);
        if (!t) return;
        heardOnce.current = true;
        lastHeardAt.current = Date.now();
        turnsRef.current.push({ role: 'user', text: t });
        agentRef.current = { text: '', at: 0, done: true, prev: null };
        echoes.current = [];
        setHeard(t);
        setSpoke(true);
        setCaption('');
        setPapers(null);
        setAnswered(false);
        setHint('');
        setQuiz((x) => (x && x.marks[x.shown + 1] ? { ...x, shown: currentQuestion(x.card, x.marks), tapped: null } : x));
      },
      // The caption is the whole response (it arrives well before its voice ends), revealed
      // at the voice's pace on its own clock. A response that arrives while the one before
      // it is still being said (the lead-in, then the answer) waits its turn: its clock
      // starts where the earlier one's voice should end. Phase changes never touch it.
      onAgent: (text) => {
        const t = cleanSpoken(text);
        const turn = { role: 'agent', text: t, sources: pending.current.sources, cards: pending.current.cards };
        pending.current = { sources: null, cards: [] };
        turnsRef.current.push(turn);
        lastTurn.current = turn;
        const now = performance.now();
        const prev = agentRef.current;
        const prevEnd = prev.text && prev.at && !prev.done ? prev.at + (prev.text.length / rateRef.current) * 1000 : 0;
        agentRef.current = { text: t, at: Math.max(now, prevEnd), done: false, prev: prevEnd > now ? prev : null };
      },
      // a response's voice ended: show it whole, and learn the voice's pace from it
      onComplete: () => {
        const a = agentRef.current;
        const now = performance.now();
        if (a.text && a.at && !a.done && now > a.at) rateRef.current = nextRate(rateRef.current, a.text.length, (now - a.at) / 1000);
        a.done = true;
        a.prev = null;
      },
      onCorrection: (spoken) => {
        const t = cleanSpoken(spoken);
        const last = lastTurn.current;
        if (last && last.role === 'agent') last.text = t ? `${t}…` : last.text;
        agentRef.current = { text: t ? `${t}…` : agentRef.current.text, at: agentRef.current.at, done: true, prev: null };
      },
      onInterrupted: () => {
        agentRef.current.done = true;
        agentRef.current.prev = null;
        // an interruption nobody then says anything after is the agent hearing itself
        const at = Date.now();
        setTimeout(() => {
          if (lastHeardAt.current >= at) return;
          echoes.current = [...echoes.current.filter((x) => at - x < 45_000), at];
          if (echoes.current.length >= 2) say('echo', 'ใส่หูฟังจะคุยได้ลื่นขึ้น เสียงจากลำโพงอาจย้อนเข้าไมค์');
        }, 2600);
      },
      onVad: (score) => {
        if (score > 0.6) lastHeardAt.current = Date.now();
      },
      onTool: (kind, data) => {
        if (kind === 'sources') {
          // the words just before this look-up were a lead-in, not the answer
          const turns = turnsRef.current;
          const last = turns[turns.length - 1];
          if (last?.role === 'agent') last.lead = true;
          pending.current.sources = data;
          setDeck({ covered: data.covered, items: data.items || [] });
          setQuiz(null);
        } else if (kind === 'quiz') {
          const turns = turnsRef.current;
          const last = turns[turns.length - 1];
          if (last?.role === 'agent') last.lead = true;
          pending.current.cards.push(data);
          setQuiz({ card: data, marks: {}, shown: 0, tapped: null });
          setDeck(null);
        } else if (kind === 'mark') {
          const n = Math.round(Number(data.question));
          if (!Number.isFinite(n)) return;
          navigator.vibrate?.(data.correct === true ? 12 : [8, 60, 8]);
          setQuiz((q) => (q ? { ...q, marks: { ...q.marks, [n]: { picked: String(data.picked || ''), correct: data.correct === true } }, shown: n - 1 } : q));
        } else if (kind === 'papers') {
          pending.current.sources = { covered: true, items: data.items || [] };
          if (data.card) pending.current.cards.push(data.card);
          setPapers(data.card?.items || []);
          setDeck(null);
        }
      },
      onEnd: (e) => {
        if (!alive) return;
        const s = sessionRef.current;
        const info = { ...e, note: endNote(e.reason, { ms: e.ms, sessionSeconds: s?.sessionSeconds, quietFor: Date.now() - lastHeardAt.current }), left: s?.left ?? null };
        // nothing said yet and the call never opened: stay, say why, offer again
        if (e.reason === 'error' && !connectedAt.current && !turnsRef.current.length) {
          setError({ message: e.message || VOICE_ERRORS.connect });
          setPhase('ended');
          return;
        }
        finish(info);
      },
    });
    voiceRef.current = v;
    const pendingStart = setTimeout(() => {
      // a tick later, so a mount React throws away (StrictMode) never mints a session
      v.start().catch((e) => {
        if (!alive) return;
        if (!connectedAt.current) {
          setError({ message: e?.message || VOICE_ERRORS.connect, code: e?.code, renewsAt: e?.renewsAt });
          setPhase('ended');
        }
      });
    }, 0);
    return () => {
      alive = false;
      clearTimeout(pendingStart);
      clearTimeout(pingTimer.current);
      v.end();
      voiceRef.current = null;
    };
  }, [attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── the sea holds the jelly where the core is ──────────────
  useLayoutEffect(() => {
    const place = () => {
      const r = coreRef.current?.getBoundingClientRect();
      if (!r) return;
      oceanRef.current?.setVoice({
        x: r.left + r.width / 2,
        // the bell's centre on the box's 38% line, so the tentacles hang inside it
        y: r.top + r.height * 0.38,
        size: r.width,
        levels: () => voiceRef.current?.levels() || { input: 0, output: 0 },
        phase: () => phaseRef.current,
      });
      oceanRef.current?.setContent(null, 0);
      oceanRef.current?.setFocus(null);
    };
    place();
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('resize', place);
      oceanRef.current?.setVoice(null);
    };
  }, [oceanRef]);

  // ── once a frame: levels for the meters, the caption at the voice's pace ──
  useEffect(() => {
    let raf = 0;
    let shown = '';
    const root = rootRef.current;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const lv = voiceRef.current?.levels() || { input: 0, output: 0 };
      const inp = Math.min(1, Math.sqrt(lv.input * 2.6));
      if (phaseRef.current === 'listening') micPeak.current = Math.max(micPeak.current, inp);
      root?.style.setProperty('--in', inp.toFixed(3));
      root?.style.setProperty('--out', Math.min(1, Math.sqrt(lv.output * 2.6)).toFixed(3));
      const a = agentRef.current;
      const now = performance.now();
      let text = a.text;
      if (a.prev && now < a.at) text = a.prev.text; // the line before is still being said
      else if (!a.done && a.at && !reducedMotion()) text = revealed(a.text, now - a.at, rateRef.current);
      if (text !== shown) { shown = text; setCaption(text); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // a long caption keeps its newest words in view (its older lines fade at the top)
  useLayoutEffect(() => {
    const el = captionRef.current;
    if (!el) return;
    const long = el.scrollHeight > el.clientHeight + 2;
    el.toggleAttribute('data-long', long);
    if (long) el.scrollTop = el.scrollHeight;
  }, [caption, full]);

  // ── the clock, and the microphone that never hears anything ──
  useEffect(() => {
    const id = setInterval(() => {
      const s = sessionRef.current;
      if (!s?.sessionSeconds || !connectedAt.current) return;
      const t = (Date.now() - connectedAt.current) / 1000;
      setLeft(Math.max(0, s.sessionSeconds - t));
      if (t > 12 && !heardOnce.current && !muted && micPeak.current < 0.05 && phaseRef.current === 'listening') {
        say('mic', 'ยังไม่ได้ยินเสียงจากไมค์ ลองพูดใกล้ขึ้น หรือเลือกไมค์อีกตัวที่ปุ่มอุปกรณ์');
      }
    }, 500);
    return () => clearInterval(id);
  }, [muted, say]);

  // ── keys: Esc hangs up (or closes the device sheet), Space or M toggles the microphone ──
  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const n = !m;
      voiceRef.current?.setMuted(n);
      voiceSound.tick(n);
      return n;
    });
  }, []);
  const hangUp = useCallback(() => {
    if (doneRef.current || phaseRef.current === 'ended') { onClose(); return; }
    voiceRef.current?.end();
  }, [onClose]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); if (sheet) setSheet(null); else hangUp(); return; }
      if (e.target?.closest?.('input, textarea, select')) return;
      if (e.key === ' ' || e.key === 'm' || e.key === 'M') { e.preventDefault(); toggleMute(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hangUp, toggleMute, sheet]);
  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
    const title = document.title;
    document.title = 'คุยด้วยเสียง – VetMock AI';
    return () => { document.title = title; };
  }, []);

  // ── typed lines, follow-ups and photos inside the call ──
  const sendText = (text) => {
    if (voiceRef.current?.send(text)) {
      turnsRef.current.push({ role: 'user', text });
      setHeard(text);
      setSpoke(true);
      setAnswered(false);
      return true;
    }
    return false;
  };
  const sendTyped = (e) => {
    e.preventDefault();
    const el = inputRef.current;
    const text = (el?.value || '').trim();
    if (text && sendText(text)) el.value = '';
  };
  const onTypedInput = () => {
    const now = Date.now();
    if (now - typedAt.current > 900) { typedAt.current = now; voiceRef.current?.typing(); }
  };
  useEffect(() => { if (typing) inputRef.current?.focus(); }, [typing]);
  const sendPhoto = async (file) => {
    if (!file) return;
    setPhoto({ preview: null, sending: true });
    try {
      const preview = await voiceRef.current?.sendImage(file);
      turnsRef.current.push({ role: 'user', text: 'ช่วยดูรูปนี้หน่อย (ส่งรูป)' });
      setHeard('ส่งรูปให้ดูแล้ว');
      setSpoke(true);
      setPhoto({ preview, sending: false });
    } catch (e) {
      setPhoto(null);
      setHint(e?.message || 'ส่งรูปไม่สำเร็จ ลองอีกครั้ง');
    }
  };

  const pickOption = (i) => {
    if (!quiz || quiz.marks[quiz.shown + 1]) return;
    if (sendText(`ตอบข้อ ${LETTERS[i]}`)) setQuiz((x) => (x ? { ...x, tapped: { q: x.shown, i } } : x));
  };

  // ── the microphone and the speaker ──
  const openDevices = async () => {
    if (sheet) { setSheet(null); return; }
    setSheet((await voiceRef.current?.devices()) || { inputs: [], outputs: [], input: 'default', output: 'default' });
  };
  const chooseDevice = async (kind, id) => {
    try {
      if (kind === 'input') await voiceRef.current?.setInput(id);
      else await voiceRef.current?.setOutput(id);
      setSheet((s) => (s ? { ...s, [kind]: id } : s));
      micPeak.current = 0;
      hinted.current.delete('mic');
    } catch {
      setHint(kind === 'input' ? 'เปลี่ยนไมค์ไม่สำเร็จ ลองอีกตัว' : 'เปลี่ยนลำโพงไม่สำเร็จ');
    }
  };

  const toggleFull = () => setFull((f) => { setPref('vmai-voice-cc', f ? 'terms' : 'full'); return !f; });
  const retry = () => { setError(null); setPhase('starting'); connectedAt.current = 0; setAttempt((n) => n + 1); };

  const shownPhase = muted && (phase === 'listening' || phase === 'thinking') ? 'muted' : phase === 'listening' && !spoke ? 'first' : phase;
  const status = error ? '' : STATUS[shownPhase] ?? '';
  const warn = left !== null && left <= WARN_S;
  const qIndex = quiz ? Math.min(quiz.shown, (quiz.card.questions?.length || 1) - 1) : 0;
  const q = quiz?.card?.questions?.[qIndex];
  const mark = quiz?.marks?.[qIndex + 1];
  const terms = full ? [] : keyTerms(caption);
  const live = connectedAt.current && (phase === 'listening' || phase === 'speaking' || phase === 'thinking');
  const showDeck = !error && !q && (deck?.items?.length > 0 || papers?.length > 0);

  return (
    <div
      ref={rootRef}
      className={`voice is-${phase}${muted ? ' is-muted' : ''}${still ? ' no-sea' : ''}${error ? ' has-error' : ''}${full ? ' is-full' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="คุยด้วยเสียงกับผู้ช่วย AI ของ VetMock"
      tabIndex={-1}
    >
      <div className="voice-top">
        <span className="voice-live">
          <span className="voice-dot" aria-hidden="true" />
          <span>{phase === 'reconnecting' ? 'กำลังต่อใหม่' : live ? 'ผู้ช่วย AI ของ VetMock' : 'VetMock AI'}</span>
        </span>
        <span className="voice-top-right">
          <button type="button" className={`voice-cc${full ? ' is-on' : ''}`} onClick={toggleFull} aria-pressed={full} aria-label="แสดงคำบรรยายทั้งหมด">CC</button>
          {left !== null && <span className={`voice-clock${warn ? ' is-warn' : ''}`} aria-label={`เหลือเวลา ${clock(left)} นาที`}>{clock(left)}</span>}
        </span>
      </div>

      <div className="voice-stage">
        <div ref={coreRef} className="voice-core" aria-hidden="true">
          <span className="voice-orb"><span /><span /><span /></span>
        </div>
        <p className="voice-status" role="status" aria-live="polite">{status}</p>
        {hint && !error && <p className="voice-hint-line" role="status">{hint}</p>}
        {heard && <p className="voice-heard"><span className="sr-only">คุณพูดว่า </span>{heard}</p>}
        {full ? (
          <p ref={captionRef} className="voice-caption" aria-live="off">{caption}</p>
        ) : (
          <ul className="voice-terms" aria-label="คำสำคัญที่พูดถึง">
            {terms.map((t, i) => <li key={t} className={i === terms.length - 1 ? 'is-new' : undefined}>{t}</li>)}
          </ul>
        )}
        {photo && (
          <figure className={`voice-photo${photo.sending ? ' is-sending' : ''}`}>
            {photo.preview && <img src={photo.preview} alt="รูปที่ส่งให้ดู" />}
            <figcaption>{photo.sending ? 'กำลังส่งรูป' : 'ส่งรูปแล้ว'}</figcaption>
          </figure>
        )}
      </div>

      {error && (
        <div className="voice-error" role="alert">
          <p>{error.message}</p>
          <div className="voice-error-actions">
            {!['user', 'budget', 'off', 'unconfigured', 'unsupported'].includes(error.code) && (
              <button type="button" className="voice-pill is-primary" onClick={retry}><IconRetry size={18} />ลองอีกครั้ง</button>
            )}
            <button type="button" className="voice-pill" onClick={onClose}><IconClose size={18} />ปิด</button>
          </div>
        </div>
      )}

      {q && !error && (
        <section className="voice-quiz" aria-label={`ข้อสอบข้อ ${qIndex + 1}`}>
          <p className="voice-quiz-head"><span>ข้อ {qIndex + 1}/{quiz.card.questions.length}</span><span>{q.subject}</span></p>
          <p className="voice-quiz-stem">{q.stem}</p>
          <ol className="voice-quiz-options">
            {q.options.map((o, i) => {
              const state = mark ? (i === q.answer ? 'is-key' : LETTERS[i] === mark.picked ? 'is-wrong' : '') : quiz.tapped?.q === qIndex && quiz.tapped?.i === i ? 'is-tapped' : '';
              return (
                <li key={i}>
                  <button type="button" className={`voice-option ${state}`} onClick={() => pickOption(i)} disabled={Boolean(mark)}>
                    <span className="voice-option-letter">{LETTERS[i]}</span>
                    <span>{o}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          {mark && q.explain && <p className="voice-quiz-explain">{q.explain}</p>}
        </section>
      )}

      {showDeck && (
        <section className="voice-deck" aria-label="ที่มาของคำตอบ">
          {deck && !deck.covered && <p className="voice-deck-note">ในคลังยังไม่ตรงคำถามนี้ ส่วนที่ไม่มีที่มาเป็นความรู้ทั่วไป</p>}
          <ul>
            {(papers?.length ? papers.map((p, i) => ({ n: i + 1, kind: 'paper', title: p.title, url: p.url })) : deck.items).map((s) => {
              const sp = speciesOf(s);
              return (
                <li key={`${s.kind}-${s.n}`} className={`voice-src k-${s.kind}`}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {sp && <span className="voice-src-plate" aria-hidden="true" style={{ '--plate': `url(/art/specimens/${sp}-s.svg)` }} />}
                    <span className="voice-src-body">
                      <span className="voice-src-kind">{KIND[s.kind] || s.kind}</span>
                      <span className="voice-src-title">{s.title}</span>
                    </span>
                    <IconArrowOut size={14} className="voice-src-out" />
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="voice-dock">
        {answered && !error && !q && !typing && (
          <ul className="voice-follow" aria-label="ถามต่อ">
            {FOLLOW_UPS.map((t) => <li key={t}><button type="button" onClick={() => sendText(t)}>{t}</button></li>)}
          </ul>
        )}
        {sheet && (
          <div className="voice-sheet" role="group" aria-label="ไมค์และลำโพง">
            <label>
              <span>ไมค์</span>
              <select value={sheet.input} onChange={(e) => chooseDevice('input', e.target.value)}>
                <option value="default">ไมค์หลักของเครื่อง</option>
                {sheet.inputs.filter((d) => d.deviceId !== 'default').map((d, i) => <option key={d.deviceId} value={d.deviceId}>{d.label || `ไมค์ ${i + 1}`}</option>)}
              </select>
            </label>
            {sheet.outputs.length > 0 && (
              <label>
                <span>ลำโพง</span>
                <select value={sheet.output} onChange={(e) => chooseDevice('output', e.target.value)}>
                  <option value="default">ลำโพงหลักของเครื่อง</option>
                  {sheet.outputs.filter((d) => d.deviceId !== 'default').map((d, i) => <option key={d.deviceId} value={d.deviceId}>{d.label || `ลำโพง ${i + 1}`}</option>)}
                </select>
              </label>
            )}
            <span className="voice-sheet-meter" aria-hidden="true"><span /></span>
          </div>
        )}
        {typing && !error && (
          <form className="voice-type" onSubmit={sendTyped}>
            <label className="sr-only" htmlFor="voice-type-input">พิมพ์ถามระหว่างคุย</label>
            <input id="voice-type-input" ref={inputRef} type="text" autoComplete="off" enterKeyHint="send" placeholder="พิมพ์ชื่อยาหรือคำถาม แล้วกดส่ง" maxLength={400} onInput={onTypedInput} />
            <button type="submit" className="voice-type-send" aria-label="ส่ง"><IconSend size={18} /></button>
          </form>
        )}
        <div className="voice-controls">
          <button type="button" className={`voice-btn voice-mic${muted ? ' is-off' : ''}`} onClick={toggleMute} aria-pressed={muted} aria-label={muted ? 'เปิดไมค์' : 'ปิดไมค์'} disabled={Boolean(error)}>
            <span className="voice-mic-ring" aria-hidden="true" />
            {muted ? <IconMicOff size={22} /> : <IconMic size={22} />}
          </button>
          <button type="button" className="voice-btn" onClick={() => fileRef.current?.click()} aria-label="ส่งรูปให้ดู" disabled={Boolean(error) || !live || photo?.sending}>
            <IconImage size={22} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { sendPhoto(e.target.files?.[0]); e.target.value = ''; }} />
          <button type="button" className="voice-btn voice-end" onClick={hangUp} aria-label={error ? 'ปิด' : 'วางสาย'}>
            <IconHangUp size={30} />
          </button>
          <button type="button" className={`voice-btn${typing ? ' is-on' : ''}`} onClick={() => setTyping((t) => !t)} aria-pressed={typing} aria-label="พิมพ์ระหว่างคุย" disabled={Boolean(error)}>
            <IconKeyboard size={22} />
          </button>
          <button type="button" className={`voice-btn${sheet ? ' is-on' : ''}`} onClick={openDevices} aria-pressed={Boolean(sheet)} aria-label="เลือกไมค์และลำโพง" disabled={Boolean(error)}>
            <IconSliders size={22} />
          </button>
        </div>
        <p className="voice-hint" aria-hidden="true">Space ปิดเปิดไมค์, Esc วางสาย</p>
      </div>
    </div>
  );
}
