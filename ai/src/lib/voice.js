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
export const loadVoiceSdk = () => {
  if (!sdkPending) sdkPending = import('@elevenlabs/client').catch((e) => { sdkPending = null; throw e; });
  return sdkPending;
};

const TOOL_DOWN = 'search failed this time: say briefly that VetMock could not be checked right now, then explain only the general principle, with no specific numbers.';

/**
 * @param {{
 *   onPhase?: (phase: 'starting'|'connecting'|'listening'|'thinking'|'speaking'|'reconnecting'|'ended', info?: object) => void,
 *   onUser?: (text: string) => void,
 *   onAgentPart?: (part: { type: 'start'|'delta'|'stop', text: string }) => void,
 *   onAgent?: (text: string) => void,
 *   onCorrection?: (spoken: string) => void,
 *   onInterrupted?: () => void,
 *   onVad?: (score: number) => void,
 *   onTool?: (kind: 'sources'|'quiz'|'mark'|'papers', data: object) => void,
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
  let mode = 'listening';
  let muted = false;
  let cred = null;
  let transport = 'webrtc';
  let rejoined = false;
  const history = []; // the last finished turns, for a rejoin
  const remember = (role, text) => { if (text) { history.push({ role, text }); if (history.length > 10) history.shift(); } };
  let phase = 'idle';
  let lastResponse = null;
  const setPhase = (p, info) => { if (p !== phase || info) { phase = p; call('onPhase', p, info); } };
  const settle = () => setPhase(toolsBusy > 0 ? 'thinking' : mode === 'speaking' ? 'speaking' : 'listening');
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
    clearTimeout(listenTimer);
    if (m === 'speaking') { mode = 'speaking'; settle(); return; }
    listenTimer = setTimeout(() => { mode = 'listening'; duck(false); settle(); }, LISTEN_HOLD_MS);
  };

  const tool = (kind, run) => async (params) => {
    toolsBusy++;
    settle();
    try {
      return await run(params || {});
    } finally {
      toolsBusy = Math.max(0, toolsBusy - 1);
      settle();
    }
  };
  const clientTools = {
    search_vetmock: tool('sources', async (p) => {
      const out = await askTool({ op: 'search', query: p.query, terms: p.terms });
      if (!out) return TOOL_DOWN;
      call('onTool', 'sources', out);
      return out.agent;
    }),
    quiz_vetmock: tool('quiz', async (p) => {
      const out = await askTool({ op: 'quiz', topic: p.topic, count: p.count });
      if (!out) return TOOL_DOWN;
      if (out.card) call('onTool', 'quiz', out.card);
      return out.agent;
    }),
    // fire and forget: the agent does not wait for it
    quiz_mark: (p) => { call('onTool', 'mark', p || {}); },
    find_papers: tool('papers', async (p) => {
      const out = await askTool({ op: 'papers', terms: p.terms, recent: p.recent === true }, 11_000);
      if (!out) return 'the paper search failed this time: say it can be tried again; never name a paper yourself.';
      if (out.found) call('onTool', 'papers', out);
      return out.agent;
    }),
  };

  async function connect(c, how) {
    const { Conversation } = await loadVoiceSdk();
    const options = {
      clientTools,
      userId: c.user,
      useWakeLock: true,
      preferHeadphonesForIosDevices: true,
      ...(store.get(MIC_KEY) ? { inputDeviceId: store.get(MIC_KEY) } : {}),
      ...(store.get(OUT_KEY) ? { outputDeviceId: store.get(OUT_KEY) } : {}),
      workletPaths: WORKLETS,
      libsampleratePath: libsamplerate,
      onConnect: () => { connectedAt = Date.now(); },
      onModeChange: ({ mode: m }) => onMode(m),
      onMessage: ({ role, source, message, response_id: id }) => {
        const who = role || (source === 'ai' ? 'agent' : 'user');
        if (who === 'user') { remember('user', message); call('onUser', message); return; }
        // one response is one turn, however often it arrives
        if (id && id === lastResponse) return;
        lastResponse = id || null;
        remember('agent', message);
        call('onAgent', message);
      },
      onAgentResponseCorrection: (c2) => call('onCorrection', c2?.corrected_agent_response || ''),
      // a student who cuts in has the floor at once, without the listening hold
      onInterruption: () => { clearTimeout(listenTimer); mode = 'listening'; duck(false); settle(); call('onInterrupted'); },
      onVadScore: ({ vadScore }) => {
        call('onVad', vadScore);
        if (mode === 'speaking' && vadScore > DUCK_VAD) {
          duck(true);
          clearTimeout(unduck);
          unduck = setTimeout(() => duck(false), DUCK_HOLD_MS);
        }
      },
      onError: (message) => console.warn('[voice] sdk', message),
      onDisconnect: (d) => onDisconnect(d),
    };
    // the end of a response's voice (the caption learns the voice's pace from it)
    options.onIncomingEvent = (e) => { if (e?.type === 'agent_response_complete') call('onComplete'); };
    // dev only: the call's events (no audio) in window.__voiceEvents, for tests and debugging
    if (import.meta.env?.DEV && typeof window !== 'undefined') {
      window.__voiceEvents = window.__voiceEvents || [];
      options.onIncomingEvent = (e) => {
        if (e?.type === 'agent_response_complete') call('onComplete');
        if (!e || e.type === 'audio' || e.type === 'ping' || e.type === 'vad_score') return;
        window.__voiceEvents.push({ t: Math.round(performance.now()), type: e.type, e: JSON.stringify(e).slice(0, 400) });
      };
      options.onModeChange = (m) => { window.__voiceEvents.push({ t: Math.round(performance.now()), type: 'mode', e: m.mode }); onMode(m.mode); };
    }
    const p = how === 'webrtc'
      ? Conversation.startSession({ ...options, conversationToken: c.token, connectionType: 'webrtc' })
      : Conversation.startSession({ ...options, signedUrl: c.signedUrl, connectionType: 'websocket' });
    // a start that hangs (ICE that never completes) is given up on, and ended if it lands later
    let timer;
    const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new VoiceError('connect')), CONNECT_MS); });
    try {
      return await Promise.race([p, timeout]);
    } catch (e) {
      p.then((late) => late.endSession().catch(() => {}), () => {});
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }

  async function open(retryTicket, minted) {
    const first = rtcBlocked() ? 'websocket' : 'webrtc';
    cred = await (minted || mint(first, retryTicket));
    transport = first;
    try {
      conv = await connect(cred, first);
    } catch (e) {
      if (closing) throw e;
      if (first !== 'webrtc') throw e instanceof VoiceError ? e : new VoiceError('connect');
      // WebRTC could not connect here: WebSocket, without counting a second session
      cred = await mint('websocket', cred.retry);
      transport = 'websocket';
      conv = await connect(cred, 'websocket');
      store.set(RTC_KEY, String(Date.now()));
    }
    if (transport === 'webrtc') store.del(RTC_KEY);
    if (muted) conv.setMicMuted(true);
    call('onSession', { sessionSeconds: cred.sessionSeconds, left: cred.left, transport });
  }

  async function onDisconnect(d) {
    const was = conv;
    conv = null;
    if (closing || !was) return;
    const lived = connectedAt ? Date.now() - connectedAt : 0;
    // dropped mid-call: rejoin once, quietly, with the conversation so far
    if (d?.reason === 'error' && !rejoined && lived > 3000 && navigator.onLine !== false && cred?.retry) {
      rejoined = true;
      setPhase('reconnecting');
      try {
        await open(cred.retry);
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
    finish(d?.reason === 'agent' ? 'agent' : d?.reason === 'user' ? 'user' : 'error', d?.reason === 'error' ? d.message : undefined);
  }

  let finished = false;
  function finish(reason, message) {
    if (finished) return;
    finished = true;
    clearTimeout(listenTimer);
    setPhase('ended');
    call('onEnd', { reason, message, ms: connectedAt ? Date.now() - connectedAt : 0 });
  }

  return {
    async start() {
      setPhase('starting');
      warm();
      try {
        // A microphone this page may already use: the token is asked for at the same time,
        // which takes its round trip off the start. Otherwise the microphone comes first,
        // so a refusal never spends one of the day's sessions.
        const granted = (await micPermission()) === 'granted';
        const minted = granted ? mint(rtcBlocked() ? 'websocket' : 'webrtc') : null;
        minted?.catch(() => {});
        await Promise.all([askMicrophone(), loadVoiceSdk().catch(() => { throw new VoiceError('network'); })]);
        if (closing) return;
        setPhase('connecting');
        await open(undefined, minted);
        if (closing) { await conv?.endSession().catch(() => {}); return; }
        settle();
      } catch (e) {
        if (!closing) finish('error', e instanceof VoiceError ? e.message : VOICE_ERRORS.connect);
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
      remember('user', t);
      return true;
    },
    /**
     * A photo inside the call: resized on the device (lib/image.js), uploaded to the
     * conversation, then asked about. Resolves to the preview URL, or throws a Thai message.
     */
    async sendImage(file, text = 'ช่วยดูรูปนี้หน่อยค่ะ') {
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
    async setInput(id) {
      if (id && id !== 'default') store.set(MIC_KEY, id); else store.del(MIC_KEY);
      await conv?.changeInputDevice({ inputDeviceId: id && id !== 'default' ? id : undefined, preferHeadphonesForIosDevices: true, ...(transport === 'websocket' ? { sampleRate: 16000, format: 'pcm' } : {}) });
    },
    async setOutput(id) {
      if (id && id !== 'default') store.set(OUT_KEY, id); else store.del(OUT_KEY);
      await conv?.changeOutputDevice({ outputDeviceId: id && id !== 'default' ? id : undefined, ...(transport === 'websocket' ? { sampleRate: 24000, format: 'pcm' } : {}) });
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
