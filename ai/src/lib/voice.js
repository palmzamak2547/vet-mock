// ============================================================
// voice.js — one realtime voice session with the VetMock agent
// ============================================================
// createVoice(handlers).start() asks for the microphone, gets a conversation
// token from /api/ai-voice (the Chula wall's token rides along, lib/api.js)
// and connects to the agent over WebRTC: Opus over UDP, the browser's own
// echo cancellation, LiveKit's jitter buffer. Where WebRTC cannot connect
// (networks that drop UDP) it starts again over WebSocket with the retry
// ticket the server handed out, which is not counted as a second session,
// and the device remembers for a day to go straight there.
//
// The agent's tools run here: the browser forwards them to /api/ai-chat
// (api/_lib/ai/voice-tools.js), which answers with what the page shows
// (sources, a quiz card, papers) and what the agent reads.
//
// A connection that drops mid-call is rejoined once, silently, with the last
// turns handed to the new conversation as context. The SDK is imported on
// demand (the voice chunk), never by the landing page; its audio worklets are
// served from this origin, so the page's CSP keeps script-src 'self'.
// ============================================================

import { API_URL, authorized, warm } from './api.js';
import { IN_APP } from './env.js';
import { checkAnswer, asksForQuiz, asksWhichTopic, quizCount, quizTopic } from './voice-turns.js';
import rawAudioProcessor from '@elevenlabs/client/worklets/rawAudioProcessor.js?url';
import audioConcatProcessor from '@elevenlabs/client/worklets/audioConcatProcessor.js?url';
import libsamplerate from '@alexanderolsen/libsamplerate-js/dist/libsamplerate.worklet.js?url';

export const VOICE_URL = API_URL.replace(/ai-chat$/, 'ai-voice');

export const VOICE_ERRORS = Object.freeze({
  unsupported: 'เบราว์เซอร์นี้คุยด้วยเสียงไม่ได้ ลองเปิดใน Chrome หรือ Safari รุ่นใหม่',
  'not-allowed': 'ยังไม่ได้อนุญาตให้ใช้ไมค์ เปิดสิทธิ์ไมค์ในการตั้งค่าเบราว์เซอร์แล้วลองอีกครั้ง',
  inapp: 'แอปนี้ไม่ให้หน้าเว็บใช้ไมค์ เปิดลิงก์ใน Safari หรือ Chrome แล้วลองอีกครั้ง',
  'no-mic': 'ไม่พบไมค์ในเครื่องนี้',
  'mic-busy': 'ไมค์ถูกแอปอื่นใช้อยู่ ปิดแอปนั้นแล้วลองอีกครั้ง',
  network: 'เชื่อมต่อไม่ได้ เช็กอินเทอร์เน็ตแล้วลองอีกครั้ง',
  connect: 'เชื่อมต่อเสียงไม่สำเร็จ ลองอีกครั้ง',
  busy: 'ตอนนี้มีคนคุยด้วยเสียงเต็มแล้ว ลองใหม่อีกสักครู่',
});

const WORKLETS = { rawAudioProcessor, audioConcatProcessor };
const LISTEN_HOLD_MS = 300;
// a lead-in's end to its answer's first audio after a look-up: 160 to 1060 ms in the recorded call
const COMPOSE_HOLD_MS = 1100;
const CONNECT_MS = 14_000;
const TOOL_MS = 6500;
const RTC_KEY = 'vmai-voice-ws'; // a day on WebSocket after WebRTC failed on this device
const MIC_KEY = 'vmai-voice-mic'; // the microphone and speaker the student picked
const OUT_KEY = 'vmai-voice-out';
// Barge-in, politely: while the agent talks and the student starts to (the server's voice
// activity above DUCK_VAD), the agent's voice drops to DUCK_VOLUME until DUCK_HOLD_MS after
// the student stops, so a real interruption is heard at once and a cough or an echo costs
// nothing but a dip (Lin et al. 2022, KDD: most rule-based barge-ins in live traffic were not
// requests; lowering the volume until one is confirmed is their proposed fix).
const DUCK_VAD = 0.65;
const DUCK_VOLUME = 0.32;
const DUCK_HOLD_MS = 650;
const DAY = 86_400_000;

export class VoiceError extends Error {
  constructor(code, message, extra = {}) {
    super(message || VOICE_ERRORS[code] || VOICE_ERRORS.connect);
    this.code = code;
    Object.assign(this, extra);
  }
}

/** Can this browser hold a voice session at all? (no network, no permission prompt) */
export function voiceSupport(w = typeof window !== 'undefined' ? window : null) {
  if (!w || !w.isSecureContext || !w.navigator?.mediaDevices?.getUserMedia) return { ok: false, reason: IN_APP ? 'inapp' : 'unsupported' };
  const rtc = typeof w.RTCPeerConnection === 'function';
  const worklet = typeof w.AudioWorkletNode === 'function';
  return rtc || worklet ? { ok: true, rtc, worklet } : { ok: false, reason: 'unsupported' };
}

/** GET /api/ai-voice: { available, reason?, sessionSeconds }. */
export async function voiceStatus(signal) {
  const r = await fetch(VOICE_URL, { signal, headers: { Accept: 'application/json' } });
  if (!r.ok) throw new Error('status');
  return r.json();
}

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* private mode */ } },
};
const rtcBlocked = () => Date.now() - Number(store.get(RTC_KEY) || 0) < DAY;
// WebRTC first (Opus, the browser's echo canceller, a jitter buffer: the best audio on a phone network),
// unless this browser has none or WebRTC failed on this device in the last day: then WebSocket
const firstTransport = () => (typeof RTCPeerConnection !== 'function' || rtcBlocked() ? 'websocket' : 'webrtc');

/** 'granted' | 'prompt' | 'denied' | 'unknown' (Firefox and older Safari cannot say). */
async function micPermission() {
  try {
    const s = await navigator.permissions?.query({ name: 'microphone' });
    return s?.state || 'unknown';
  } catch {
    return 'unknown';
  }
}

/** Warm the agent's hosts (DNS, TLS) while a finger is on the call button. */
export function preconnectVoice() {
  if (typeof document === 'undefined' || document.querySelector('link[data-voice-preconnect]')) return;
  for (const href of ['https://livekit.rtc.elevenlabs.io', 'https://api.elevenlabs.io']) {
    const l = document.createElement('link');
    l.rel = 'preconnect';
    l.href = href;
    l.crossOrigin = 'anonymous';
    l.dataset.voicePreconnect = '';
    document.head.appendChild(l);
  }
}

/** The microphone, asked for before a session is minted, so a refusal costs nothing and says why. */
async function askMicrophone() {
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
  } catch (e) {
    const n = e?.name;
    if (n === 'NotAllowedError' || n === 'SecurityError') throw new VoiceError(IN_APP ? 'inapp' : 'not-allowed');
    if (n === 'NotReadableError' || n === 'AbortError') throw new VoiceError('mic-busy');
    throw new VoiceError('no-mic');
  }
  for (const t of stream.getTracks()) t.stop();
}

async function mint(transport, retry) {
  let res;
  try {
    res = await authorized(VOICE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'start', transport, ...(retry ? { retry } : {}) }) });
  } catch {
    throw new VoiceError('network');
  }
  let j = {};
  try { j = await res.json(); } catch { /* not JSON */ }
  if (!res.ok) throw new VoiceError(j.error || 'connect', j.message, { status: res.status, retryAfter: j.retryAfter, renewsAt: j.renewsAt, refused: true });
  return j;
}

/** One tool call to /api/ai-chat; null when it could not be answered in time. */
async function askTool(body, ms = TOOL_MS) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    const res = await authorized(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ voice: body }), signal: ctl.signal });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

let sdkPending = null;
// A page that sets window.__voiceSdk before the call (a recorded call replayed through this screen:
// the e2e suite, the launch film) gets that { Conversation } instead of the SDK's. Nothing else does.
export const loadVoiceSdk = () => {
  if (typeof window !== 'undefined' && window.__voiceSdk?.Conversation) return Promise.resolve(window.__voiceSdk);
  if (!sdkPending) sdkPending = import('@elevenlabs/client').catch((e) => { sdkPending = null; throw e; });
  return sdkPending;
};

const TOOL_DOWN = 'search failed this time: say briefly that VetMock could not be checked right now, then explain only the general principle, with no specific numbers.';
const QUIZ_DOWN = 'the quiz could not be fetched this time: say so briefly and offer to try again in a moment; never make up a question.';
const closed = () => Object.assign(new Error('closed'), { closed: true });
// what the service says when a call cannot start or stops, in the page's words (never its English)
const sdkMessage = (m) => (/limit|concurren|capacity|busy|queue|quota/i.test(String(m || '')) ? VOICE_ERRORS.busy : VOICE_ERRORS.connect);

/** A microphone or speaker kept from another day that is not plugged in now: forgotten (see start). */
async function forgetMissingDevices() {
  const list = (await navigator.mediaDevices?.enumerateDevices?.().catch(() => null)) || [];
  if (!list.some((d) => d.deviceId)) return; // ids hidden (no permission yet): nothing can be told
  for (const [key, kind] of [[MIC_KEY, 'audioinput'], [OUT_KEY, 'audiooutput']]) {
    const id = store.get(key);
    if (id && !list.some((d) => d.kind === kind && d.deviceId === id)) store.del(key);
  }
}

/** A real device id for "default": WebRTC treats a missing id as "no change". */
async function concreteDevice(kind, id) {
  if (id && id !== 'default') return id;
  const list = ((await navigator.mediaDevices?.enumerateDevices?.().catch(() => null)) || []).filter((d) => d.kind === kind && d.deviceId);
  return (list.find((d) => d.deviceId === 'default') || list[0])?.deviceId;
}

/**
 * @param {{
 *   onPhase?: (phase: 'starting'|'connecting'|'listening'|'thinking'|'speaking'|'reconnecting'|'ended', info?: object) => void,
 *   onUser?: (text: string) => void,
 *   onAgentPart?: (part: { type: 'start'|'delta'|'stop', text: string }) => void,
 *   onAgent?: (text: string) => void,
 *   onCorrection?: (spoken: string) => void,
 *   onInterrupted?: () => void,
 *   onVad?: (score: number) => void,
 *   onTool?: (kind: 'sources'|'quiz'|'papers', data: object) => void,
 *   onCheck?: (p: { picked?: string, question?: number }) => string,
 *   onSession?: (s: { sessionSeconds: number, left: number|null, transport: string }) => void,
 *   onEnd?: (e: { reason: 'user'|'agent'|'error', message?: string, ms: number }) => void,
 * }} h
 */
export function createVoice(h = {}) {
  const call = (name, ...a) => { try { h[name]?.(...a); } catch (e) { console.error('[voice]', name, e); } };
  let conv = null;
  let closing = false;
  let connectedAt = 0;
  let toolsBusy = 0;
  let mode = 'listening'; // what the screen shows (speaking held through short gaps)
  let sdkMode = 'listening'; // what the SDK said last
  let muted = false;
  let cred = null;
  let transport = 'webrtc';
  let rejoined = false;
  const history = []; // the last finished turns, for a rejoin
  const remember = (role, text) => { if (text) { history.push({ role, text }); if (history.length > 10) history.shift(); } };
  let phase = 'idle';
  let lastResponse = null;
  let lastActivity = Date.now(); // the last word either side said (a long silence is the service hanging up)
  let startedAt = 0; // the session's first connect: its time cap holds across a rejoin
  let capTimer = 0;
  let busyKind = '';
  // the student's latest turn, when it asked for a quiz (see recoverQuiz)
  let turnNo = 0;
  let ask = null;
  let lastTopic = '';
  let lastStudent = '';
  const studentSaid = (text) => {
    composed();
    turnNo++;
    lastStudent = String(text || '');
    lastActivity = Date.now();
    ask = asksForQuiz(text) ? { n: turnNo, text, acted: false, said: '' } : null;
  };
  const setPhase = (p, info) => { if (p !== phase || info) { phase = p; call('onPhase', p, info); } };
  // A look-up's result is in and its answer not yet heard: the agent is still working, not listening (between the
  // lead-in's end and the answer's first audio the screen said กำลังฟัง for 0.1 to 0.5 s). Until the answer's voice
  // starts, the student speaks, or 6 s pass.
  let composing = false;
  let answered = false; // the answer's words have come since the look-up ended
  let composeTimer = 0;
  const composed = () => { composing = false; answered = false; clearTimeout(composeTimer); };
  const settle = () => {
    if (finished) return; // a timer that outlives the call never brings a phase back
    setPhase(toolsBusy > 0 || (composing && mode !== 'speaking') ? 'thinking' : mode === 'speaking' ? 'speaking' : 'listening');
  };
  let ducked = false;
  let unduck = 0;
  const duck = (on) => {
    if (on === ducked) return;
    ducked = on;
    try { conv?.setVolume({ volume: on ? DUCK_VOLUME : 1 }); } catch { /* not connected */ }
  };
  // Over WebRTC the SDK reports "listening" for a few milliseconds between two chunks of
  // one answer (measured 1-12 ms, every 2-5 s). Speaking starts at once; listening only
  // once it has lasted LISTEN_HOLD_MS, so the screen, the caption and the sea never flicker.
  let listenTimer = 0;
  const onMode = (m) => {
    sdkMode = m;
    clearTimeout(listenTimer);
    if (m === 'speaking') { mode = 'speaking'; if (composing && answered) composed(); settle(); return; }
    // after a look-up the answer usually follows its lead-in within half a second: hold "speaking" through that gap
    listenTimer = setTimeout(() => {
      mode = 'listening';
      duck(false);
      settle();
      // the agent finished a turn the student asked for a quiz in, without fetching one
      if (ask && !ask.acted && !ask.recovering && ask.said && !asksWhichTopic(ask.said)) {
        ask.recovering = true;
        recoverQuiz(ask);
      }
    }, composing ? COMPOSE_HOLD_MS : LISTEN_HOLD_MS);
  };

  const busy = async (kind, run) => {
    toolsBusy++;
    busyKind = kind;
    settle();
    try {
      return await run();
    } finally {
      toolsBusy = Math.max(0, toolsBusy - 1);
      settle();
    }
  };
  const tool = (kind, run) => async (params) => {
    if (ask) ask.acted = true;
    try {
      return await busy(kind, () => run(params || {}));
    } finally {
      composing = true;
      answered = false;
      clearTimeout(composeTimer);
      composeTimer = setTimeout(() => { composed(); settle(); }, 6000);
      settle();
    }
  };

  // The model, asked for a quiz, said it would fetch one and did not (or read one it made up):
  // about 1 ask in 4 in the text probes, and in both spoken calls through the page on 2026-11-06.
  // The page fetches the quiz the student asked for (from 700 ms after the lead-in came with no
  // call: a call comes with its lead-in), puts it on screen once the voice stops and hands it to
  // the agent to read. A message the page sends is not shown or kept as the student's words (the
  // service does not echo typed messages back as transcripts).
  const quizFor = (a) => askTool({ op: 'quiz', topic: quizTopic(a.text, lastTopic), count: quizCount(a.text) });
  async function recoverQuiz(a) {
    if (a.acted || turnNo !== a.n || !conv || closing) return;
    const out = await busy('quiz', () => a.quiz || quizFor(a));
    if (a.acted || turnNo !== a.n || !conv || closing) return;
    if (out?.card) call('onTool', 'quiz', out.card);
    const say = out?.card
      ? `(ระบบ) ข้อสอบที่นิสิตขอขึ้นบนจอแล้ว นี่คือผลของ quiz_vetmock อ่านข้อแรกให้นิสิตฟังเลยโดยไม่ต้องทักใหม่ ถ้าเมื่อกี้อ่านโจทย์อื่นไปแล้ว ให้บอกสั้น ๆ ว่าขอใช้ข้อนี้แทน\n\n${out.agent}`
      : `(ระบบ) ${out?.agent || QUIZ_DOWN}`;
    try { conv.sendUserMessage(say); } catch { /* the call just ended */ }
  }
  const clientTools = {
    search_vetmock: tool('sources', async (p) => {
      const out = await askTool({ op: 'search', query: p.query, terms: p.terms });
      if (!out) return TOOL_DOWN;
      call('onTool', 'sources', out);
      return out.agent;
    }),
    quiz_vetmock: tool('quiz', async (p) => {
      if (p.topic) lastTopic = String(p.topic).slice(0, 120);
      // "ข้อนึง" and no count from the model (it often leaves it out): the student's own number
      const out = await askTool({ op: 'quiz', topic: p.topic, count: p.count || quizCount(lastStudent) });
      if (!out) return QUIZ_DOWN;
      if (out.card) call('onTool', 'quiz', out.card);
      return out.agent;
    }),
    // the verdict comes from the quiz on screen (the page holds the key), never from the model
    // (`heard`: the student's own words, so a ข or ค the recogniser blurred is asked again)
    quiz_check: (p) => {
      try { return h.onCheck ? h.onCheck({ ...(p || {}), heard: lastStudent }) : checkAnswer(null).agent; } catch (e) { console.error('[voice] onCheck', e); return checkAnswer(null).agent; }
    },
    find_papers: tool('papers', async (p) => {
      const out = await askTool({ op: 'papers', terms: p.terms, recent: p.recent === true }, 11_000);
      if (!out) return 'the paper search failed this time: say it can be tried again; never name a paper yourself.';
      if (out.found) call('onTool', 'papers', out);
      return out.agent;
    }),
  };

  async function connect(c, how) {
    const { Conversation } = await loadVoiceSdk();
    // Every callback belongs to this attempt. One given up on (a WebRTC start that lands after
    // the timeout, once WebSocket has replaced it) is ended and heard no more: its disconnect
    // must not close the call that replaced it.
    const att = { dead: false };
    const live = (fn) => (...a) => (att.dead ? undefined : fn(...a));
    const dev = import.meta.env?.DEV && typeof window !== 'undefined';
    if (dev) window.__voiceEvents = window.__voiceEvents || [];
    const options = {
      clientTools,
      userId: c.user,
      useWakeLock: true,
      preferHeadphonesForIosDevices: true,
      ...(store.get(MIC_KEY) ? { inputDeviceId: store.get(MIC_KEY) } : {}),
      ...(store.get(OUT_KEY) ? { outputDeviceId: store.get(OUT_KEY) } : {}),
      workletPaths: WORKLETS,
      libsampleratePath: libsamplerate,
      onConnect: live(() => { connectedAt = Date.now(); startedAt ||= connectedAt; lastActivity = Date.now(); }),
      onModeChange: live(({ mode: m }) => {
        if (dev) window.__voiceEvents.push({ t: Math.round(performance.now()), type: 'mode', e: m });
        onMode(m);
      }),
      onMessage: live(({ role, source, message, response_id: id }) => {
        const who = role || (source === 'ai' ? 'agent' : 'user');
        if (who === 'user') { studentSaid(message); remember('user', message); call('onUser', message); return; }
        // one response is one turn, however often it arrives
        if (id && id === lastResponse) return;
        lastResponse = id || null;
        lastActivity = Date.now();
        // the answer's words; once its voice is also playing (the SDK's mode, not the held one) the look-up is over
        if (composing) { answered = true; if (sdkMode === 'speaking') { composed(); settle(); } }
        if (ask) {
          const a = ask;
          a.said += ` ${message}`;
          // no call with these words, 700 ms on: the quiz is fetched now, while the voice still talks
          if (!a.acted && !a.quiz) {
            setTimeout(() => {
              if (a.acted || a.quiz || turnNo !== a.n || asksWhichTopic(a.said)) return;
              a.quiz = quizFor(a);
            }, 700);
          }
        }
        remember('agent', message);
        call('onAgent', message);
      }),
      onAgentResponseCorrection: live((c2) => call('onCorrection', c2?.corrected_agent_response || '')),
      // a student who cuts in has the floor at once, without the listening hold
      onInterruption: live(() => { clearTimeout(listenTimer); composed(); mode = 'listening'; sdkMode = 'listening'; duck(false); settle(); call('onInterrupted'); }),
      onVadScore: live(({ vadScore }) => {
        call('onVad', vadScore);
        if (vadScore > 0.6) lastActivity = Date.now();
        // (on iPhone over WebRTC the SDK cannot lower the voice: <audio>.volume is fixed there)
        if (mode === 'speaking' && vadScore > DUCK_VAD) {
          duck(true);
          clearTimeout(unduck);
          unduck = setTimeout(() => duck(false), DUCK_HOLD_MS);
        }
      }),
      onError: (message) => console.warn('[voice] sdk', message),
      onDisconnect: live((d) => onDisconnect(d)),
      // the end of a response's voice (the caption learns the voice's pace from it);
      // dev only: the call's events (no audio) in window.__voiceEvents, for tests and debugging
      onIncomingEvent: live((e) => {
        if (e?.type === 'agent_response_complete') call('onComplete');
        if (dev && e && e.type !== 'audio' && e.type !== 'ping' && e.type !== 'vad_score') {
          window.__voiceEvents.push({ t: Math.round(performance.now()), type: e.type, e: JSON.stringify(e).slice(0, 400) });
        }
      }),
    };
    const p = how === 'webrtc'
      ? Conversation.startSession({ ...options, conversationToken: c.token, connectionType: 'webrtc' })
      : Conversation.startSession({ ...options, signedUrl: c.signedUrl, connectionType: 'websocket' });
    // a start that hangs (ICE that never completes) is given up on, and ended if it lands later
    let timer;
    const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new VoiceError('connect')), CONNECT_MS); });
    try {
      return await Promise.race([p, timeout]);
    } catch (e) {
      att.dead = true;
      p.then((late) => late.endSession().catch(() => {}), () => {});
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }

  // A hang-up can land at any await below: after each, a call nobody wants any more is not
  // opened (or is ended at once), so the microphone never comes on behind a closed screen.
  async function open(retryTicket, minted) {
    const first = firstTransport();
    cred = await (minted || mint(first, retryTicket));
    if (closing) throw closed();
    transport = first;
    let c;
    try {
      c = await connect(cred, first);
    } catch (e) {
      if (closing) throw closed();
      if (first !== 'webrtc') throw e instanceof VoiceError ? e : new VoiceError('connect', sdkMessage(e?.message));
      // WebRTC could not connect here: WebSocket, without counting a second session
      cred = await mint('websocket', cred.retry);
      if (closing) throw closed();
      transport = 'websocket';
      c = await connect(cred, 'websocket');
      store.set(RTC_KEY, String(Date.now()));
    }
    if (closing) { await c.endSession().catch(() => {}); throw closed(); }
    conv = c;
    if (transport === 'webrtc') store.del(RTC_KEY);
    if (muted) conv.setMicMuted(true);
    // the speaker picked another day: over WebRTC the start option is not applied, so set it now
    const out = store.get(OUT_KEY);
    if (out && transport === 'webrtc') conv.changeOutputDevice({ outputDeviceId: out }).catch(() => store.del(OUT_KEY));
    call('onSession', { sessionSeconds: cred.sessionSeconds, left: cred.left, transport });
  }

  async function onDisconnect(d) {
    const was = conv;
    conv = null;
    // When the far end closes a WebRTC call, SDK 1.35.0 skips its audio cleanup (close() runs it
    // only while connected): two AudioContexts and an <audio> per call would pile up until the
    // browser refuses new ones. Its cleanup() is idempotent.
    try { was?.connection?.audioAdapter?.cleanup?.(); } catch { /* not WebRTC */ }
    if (closing || !was) return;
    const lived = connectedAt ? Date.now() - connectedAt : 0;
    // The service ending the call (its time cap, a long silence) reaches the page as an "error"
    // over WebRTC: an ending, not a drop, and it never takes the free restart.
    const timeUp = d?.context?.type === 'max_duration_exceeded' || (cred?.sessionSeconds && startedAt && Date.now() - startedAt >= (cred.sessionSeconds - 10) * 1000);
    // (the agent ends a call after 90 s of silence: voice-agent.js silence_end_call_timeout)
    if (d?.reason === 'error' && (timeUp || Date.now() - lastActivity > 75_000)) { finish('agent'); return; }
    // dropped mid-call: rejoin once, quietly, with the conversation so far
    if (d?.reason === 'error' && !rejoined && lived > 3000 && navigator.onLine !== false && cred?.retry) {
      rejoined = true;
      setPhase('reconnecting');
      try {
        await open(cred.retry);
        if (closing) return;
        // the rejoined conversation has a fresh cap on the service: this one holds the session's
        const rest = startedAt + cred.sessionSeconds * 1000 - Date.now();
        clearTimeout(capTimer);
        capTimer = setTimeout(() => {
          if (closing || !conv) return;
          closing = true;
          const c = conv;
          conv = null;
          c.endSession().catch(() => {});
          finish('agent');
        }, Math.max(0, rest));
        if (history.length) {
          const recap = history.map((t) => `${t.role === 'user' ? 'นิสิต' : 'ผู้ช่วย'}: ${t.text}`).join('\n');
          conv?.sendContextualUpdate(`สายหลุดและต่อใหม่แล้ว นี่คือบทสนทนาก่อนหน้า (คุยต่อจากตรงนี้ ไม่ต้องทักทายใหม่):\n${recap}`);
        }
        settle();
        return;
      } catch {
        // fall through: the call is over
      }
    }
    finish(d?.reason === 'agent' ? 'agent' : d?.reason === 'user' ? 'user' : 'error', d?.reason === 'error' ? sdkMessage(d.message) : undefined);
  }

  let finished = false;
  function finish(reason, message) {
    if (finished) return;
    finished = true;
    clearTimeout(listenTimer);
    clearTimeout(capTimer);
    clearTimeout(composeTimer);
    clearTimeout(unduck);
    setPhase('ended');
    // the whole session's length, a rejoin included (the time-up note reads it)
    call('onEnd', { reason, message, ms: startedAt ? Date.now() - startedAt : 0 });
  }

  return {
    async start() {
      setPhase('starting');
      warm();
      try {
        // an app's own browser that will not share the microphone says so (and offers the way out)
        const sup = voiceSupport();
        if (!sup.ok) throw new VoiceError(sup.reason);
        // A microphone this page may already use: the token is asked for at the same time,
        // which takes its round trip off the start. Otherwise the microphone comes first,
        // so a refusal never spends one of the day's sessions.
        const granted = (await micPermission()) === 'granted';
        const minted = granted ? mint(firstTransport()) : null;
        minted?.catch(() => {});
        await Promise.all([askMicrophone(), loadVoiceSdk().catch(() => { throw new VoiceError('network'); })]);
        // the SDK asks for a kept device exactly ({ exact: id }): one unplugged since would fail every start
        await forgetMissingDevices();
        if (closing) return;
        setPhase('connecting');
        await open(undefined, minted);
        settle();
      } catch (e) {
        if (closing || e?.closed) return;
        finish('error', e instanceof VoiceError ? e.message : VOICE_ERRORS.connect);
        throw e;
      }
    },
    async end() {
      closing = true;
      const c = conv;
      conv = null;
      try { await c?.endSession(); } catch { /* already gone */ }
      finish('user');
    },
    setMuted(on) {
      muted = Boolean(on);
      try { conv?.setMicMuted(muted); } catch { /* not connected */ }
    },
    /** A typed message inside the call; the agent answers by voice. */
    send(text) {
      const t = String(text || '').trim();
      if (!t || !conv) return false;
      conv.sendUserMessage(t);
      studentSaid(t);
      remember('user', t);
      return true;
    },
    /**
     * A photo inside the call: resized on the device (lib/image.js), uploaded to the
     * conversation, then asked about. Resolves to the preview URL, or throws a Thai message.
     */
    async sendImage(file, text = 'ช่วยดูรูปนี้หน่อย') {
      if (!conv) throw new VoiceError('connect');
      const { prepareImage } = await import('./image.js');
      const img = await prepareImage(file);
      const bytes = Uint8Array.from(atob(img.data), (ch) => ch.charCodeAt(0));
      let up;
      try {
        up = await conv.uploadFile(new Blob([bytes], { type: img.mediaType }));
      } catch {
        throw new VoiceError('connect', 'ส่งรูปไม่สำเร็จ ลองอีกครั้ง');
      }
      conv.sendMultimodalMessage({ text, fileIds: [up.fileId] });
      remember('user', `${text} (ส่งรูป)`);
      return img.preview;
    },
    /** The microphones and speakers this device has (names appear once the microphone is allowed). */
    async devices() {
      const list = await navigator.mediaDevices.enumerateDevices().catch(() => []);
      const pick = (kind) => list.filter((d) => d.kind === kind && d.deviceId !== 'communications');
      return {
        inputs: pick('audioinput'),
        // choosing a speaker needs setSinkId (Chromium, Firefox 116+, Safari 18.4+)
        outputs: typeof HTMLMediaElement !== 'undefined' && 'setSinkId' in HTMLMediaElement.prototype ? pick('audiooutput') : [],
        input: store.get(MIC_KEY) || 'default',
        output: store.get(OUT_KEY) || 'default',
      };
    },
    // WebRTC takes a device id and nothing else (any other option throws) and a missing id is
    // "no change", so "default" goes as a real id there; WebSocket rebuilds its input or output.
    async setInput(id) {
      if (id && id !== 'default') store.set(MIC_KEY, id); else store.del(MIC_KEY);
      if (!conv) return;
      if (transport === 'webrtc') await conv.changeInputDevice({ inputDeviceId: await concreteDevice('audioinput', id) });
      else await conv.changeInputDevice({ inputDeviceId: id && id !== 'default' ? id : undefined, preferHeadphonesForIosDevices: true, sampleRate: 16000, format: 'pcm' });
    },
    async setOutput(id) {
      if (id && id !== 'default') store.set(OUT_KEY, id); else store.del(OUT_KEY);
      if (!conv) return;
      if (transport === 'webrtc') await conv.changeOutputDevice({ outputDeviceId: await concreteDevice('audiooutput', id) });
      else await conv.changeOutputDevice({ outputDeviceId: id && id !== 'default' ? id : undefined, sampleRate: 24000, format: 'pcm' });
    },
    /** Background the agent should know (the chat typed before the call), as data, not a turn. */
    context(text) {
      const t = String(text || '').trim();
      if (!t || !conv) return;
      try { conv.sendContextualUpdate(t); } catch { /* not connected */ }
      for (const line of t.split('\n').slice(-6)) remember('context', line);
    },
    /** While the student types, the agent should not take the turn. */
    typing() { try { conv?.sendUserActivity(); } catch { /* not connected */ } },
    /** 0..1 levels for the sea and the meter, read once a frame. */
    levels() {
      if (!conv) return { input: 0, output: 0 };
      try { return { input: muted ? 0 : conv.getInputVolume() || 0, output: conv.getOutputVolume() || 0 }; } catch { return { input: 0, output: 0 }; }
    },
    get transport() { return transport; },
    get phase() { return phase; },
    /** What the look-up in progress is: 'sources', 'quiz' or 'papers'. */
    get tool() { return busyKind; },
  };
}

/** Why the page cannot offer voice right now (GET /api/ai-voice reasons). */
export function voiceOffMessage(reason, renewsAt) {
  if (reason === 'budget') {
    const when = renewsAt ? new Date(renewsAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', timeZone: 'Asia/Bangkok' }) : '';
    return `โควตาคุยด้วยเสียงของเดือนนี้หมดแล้ว${when ? ` ใช้ได้อีกครั้ง ${when}` : ''} ระหว่างนี้พิมพ์ถามได้ตามปกติ`;
  }
  if (reason === 'off') return 'โหมดคุยด้วยเสียงปิดปรับปรุงชั่วคราว พิมพ์ถามได้ตามปกติ';
  return 'โหมดคุยด้วยเสียงยังไม่พร้อมในตอนนี้ พิมพ์ถามได้ตามปกติ';
}
