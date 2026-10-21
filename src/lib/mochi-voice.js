// ============================================================
// Mochi voice client — one Gemini Live session in the browser.
//
// /api/mochi-voice mints a locked, single-session token; this file opens the
// socket, streams the mic as 16 kHz PCM, plays Mochi's 24 kHz reply, runs the
// search tool through the same route, and stops playback the moment the
// student talks over Mochi (the server sends `interrupted`).
//
// Not verified against the live service yet (the project key had no credit
// on 2026-10-21): the token shape and the Constrained endpoint were checked,
// the rest follows the published Live API messages.
// ============================================================

const WS = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained';
const IN_RATE = 16000;
const OUT_RATE = 24000;
const CHUNK = 1600; // 100 ms
const MAX_RECONNECTS = 2;

export const CAP_MESSAGES = {
  user_cap_reached: 'ใช้คุยกับ Mochi ด้วยเสียงครบโควตาเดือนนี้แล้ว ถามแบบพิมพ์ได้ตามปกติ',
  monthly_budget_reached: 'โควตาเสียงของทั้งเว็บเดือนนี้เต็มแล้ว ถามแบบพิมพ์ได้ตามปกติ',
  not_enabled: 'ฟีเจอร์นี้ยังเปิดเฉพาะบางบัญชี',
  not_configured: 'ระบบเสียงยังไม่พร้อม ถามแบบพิมพ์ได้ตามปกติ',
  provider_unavailable: 'ต่อระบบเสียงไม่ได้ตอนนี้ ลองใหม่อีกครั้ง หรือถามแบบพิมพ์',
  sign_in_required: 'เข้าสู่ระบบก่อนนะ แล้วค่อยคุยกับ Mochi',
};

export async function voiceApi(action, extra = {}) {
  const { getSupabase } = await import('./supabase.js'); // the app has it loaded already; tests do not
  const sb = await getSupabase();
  const { data: { session } = {} } = (await sb?.auth.getSession()) || {};
  if (!session?.access_token) return { ok: false, status: 401, body: { error: 'sign_in_required' } };
  const res = await fetch('/api/mochi-voice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
    body: JSON.stringify({ action, ...extra }),
    signal: AbortSignal.timeout(10000),
  });
  return { ok: res.ok, status: res.status, body: await res.json().catch(() => ({})) };
}

export function pcm16ToBase64(float32) {
  const bytes = new Uint8Array(float32.length * 2);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

export function base64ToFloat32(b64) {
  const bin = atob(b64);
  const view = new DataView(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) view.setUint8(i, bin.charCodeAt(i));
  const out = new Float32Array(bin.length >> 1);
  for (let i = 0; i < out.length; i++) out[i] = view.getInt16(i * 2, true) / 0x8000;
  return out;
}

// Collects mic samples into 100 ms frames off the main thread.
const WORKLET = `class F extends AudioWorkletProcessor{constructor(){super();this.b=new Float32Array(${CHUNK});this.n=0}
process(i){const c=i[0]&&i[0][0];if(c){for(let k=0;k<c.length;k++){this.b[this.n++]=c[k];if(this.n===${CHUNK}){this.port.postMessage(this.b.slice());this.n=0}}}return true}}
registerProcessor('mochi-mic',F)`;

/**
 * @param {{ onState(s:string), onTranscript(role:'user'|'mochi', text:string), onSources(r:object[]),
 *           onNotice(text:string), onEnd(reason:string) }} cb
 */
export class MochiVoiceSession {
  constructor(cb) { this.cb = cb; this.sources = new Set(); this.reconnects = 0; this.closed = false; }

  async start() {
    this.cb.onState('connecting');
    const r = await voiceApi('token');
    if (!r.ok) {
      this.cb.onEnd(r.body.error || 'provider_unavailable');
      return false;
    }
    this.token = r.body.token;
    this.endsAt = Date.parse(r.body.expiresAt);
    this.timer = setTimeout(() => this.stop('session_time_up'), Math.max(0, this.endsAt - Date.now()));
    this.out = new AudioContext({ sampleRate: OUT_RATE });
    this.playAt = 0;
    this.open();
    try {
      await this.startMic();
    } catch {
      this.cb.onNotice('เปิดไมค์ไม่ได้ พิมพ์ถาม Mochi แทนได้เลย');
    }
    return true;
  }

  open(handle) {
    const ws = new WebSocket(`${WS}?access_token=${encodeURIComponent(this.token)}`);
    this.ws = ws;
    ws.onopen = () => ws.send(JSON.stringify({ setup: handle ? { sessionResumption: { handle } } : {} }));
    ws.onmessage = async (ev) => {
      const text = typeof ev.data === 'string' ? ev.data : await ev.data.text();
      this.handle(JSON.parse(text));
    };
    ws.onclose = () => {
      if (this.closed || ws !== this.ws) return;
      if (this.reconnects < MAX_RECONNECTS && Date.now() < this.endsAt - 5000) {
        this.reconnects++;
        this.cb.onState('reconnecting');
        setTimeout(() => !this.closed && this.open(this.resumeHandle), 500 * this.reconnects);
      } else {
        this.stop('connection_lost');
      }
    };
  }

  handle(m) {
    if (m.setupComplete) { this.cb.onState('listening'); return; }
    if (m.sessionResumptionUpdate?.newHandle) this.resumeHandle = m.sessionResumptionUpdate.newHandle;
    if (m.goAway) { this.ws.onclose = null; this.ws.close(); this.open(this.resumeHandle); return; }
    if (m.toolCall) { this.runTools(m.toolCall.functionCalls || []); return; }
    const sc = m.serverContent;
    if (!sc) return;
    if (sc.interrupted) this.flushPlayback();
    for (const p of sc.modelTurn?.parts || []) if (p.inlineData?.data) this.play(base64ToFloat32(p.inlineData.data));
    if (sc.inputTranscription?.text) this.cb.onTranscript('user', sc.inputTranscription.text);
    if (sc.outputTranscription?.text) this.cb.onTranscript('mochi', sc.outputTranscription.text);
    if (sc.turnComplete) this.cb.onState('listening');
  }

  async runTools(calls) {
    this.cb.onState('searching');
    const responses = await Promise.all(calls.map(async (c) => {
      let response = { results: [], note: 'search unavailable, say the library could not be reached' };
      if (c.name === 'search_vetmock') {
        const r = await voiceApi('search', { query: c.args?.query }).catch(() => null);
        if (r?.ok) { response = r.body; this.cb.onSources(r.body.results || []); }
      }
      return { id: c.id, name: c.name, response };
    }));
    this.send({ toolResponse: { functionResponses: responses } });
  }

  play(samples) {
    const buf = this.out.createBuffer(1, samples.length, OUT_RATE);
    buf.copyToChannel(samples, 0);
    const src = this.out.createBufferSource();
    src.buffer = buf;
    src.connect(this.out.destination);
    const at = Math.max(this.out.currentTime + 0.02, this.playAt);
    src.start(at);
    this.playAt = at + buf.duration;
    this.sources.add(src);
    src.onended = () => this.sources.delete(src);
    this.cb.onState('speaking');
  }

  flushPlayback() {
    for (const s of this.sources) { try { s.stop(); } catch { /* already ended */ } }
    this.sources.clear();
    this.playAt = 0;
  }

  async startMic() {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 } });
    this.in = new AudioContext({ sampleRate: IN_RATE });
    const url = URL.createObjectURL(new Blob([WORKLET], { type: 'text/javascript' }));
    await this.in.audioWorklet.addModule(url);
    URL.revokeObjectURL(url);
    const node = new AudioWorkletNode(this.in, 'mochi-mic');
    node.port.onmessage = (e) => {
      if (!this.muted) this.send({ realtimeInput: { audio: { data: pcm16ToBase64(e.data), mimeType: `audio/pcm;rate=${IN_RATE}` } } });
    };
    this.in.createMediaStreamSource(this.stream).connect(node);
  }

  sendText(text) {
    const t = String(text || '').trim();
    if (t) { this.flushPlayback(); this.send({ realtimeInput: { text: t } }); this.cb.onTranscript('user', `${t}\n`); }
  }

  send(msg) { if (this.ws?.readyState === 1) this.ws.send(JSON.stringify(msg)); }

  stop(reason = 'stopped') {
    if (this.closed) return;
    this.closed = true;
    clearTimeout(this.timer);
    this.flushPlayback();
    try { this.ws?.close(); } catch { /* closed */ }
    this.stream?.getTracks().forEach((t) => t.stop());
    this.in?.close().catch(() => {});
    this.out?.close().catch(() => {});
    this.cb.onEnd(reason);
  }
}
