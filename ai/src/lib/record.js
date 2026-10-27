// The microphone where the browser has no speech recognition of its own:
// record the question, then hand /api/ai-transcribe a 16 kHz mono WAV (iApp's
// Thai ASR takes MP3, WAV, AAC or M4A, not the WebM most browsers record).
// The browser decodes whatever it recorded (WebM/Opus, MP4/AAC) with Web Audio,
// so no codec ships in this page.

export const CAN_RECORD = typeof window !== 'undefined'
  && !!navigator.mediaDevices?.getUserMedia
  && typeof MediaRecorder !== 'undefined'
  && typeof (window.AudioContext || window.webkitAudioContext) !== 'undefined';

const RATE = 16000;
export const MAX_SECONDS = 60;

/** 16-bit PCM WAV from mono samples in [-1, 1]. */
export function encodeWav(samples, rate = RATE) {
  const buf = new ArrayBuffer(44 + samples.length * 2);
  const v = new DataView(buf);
  const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); v.setUint32(4, 36 + samples.length * 2, true); str(8, 'WAVE');
  str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, 'data'); v.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    v.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buf], { type: 'audio/wav' });
}

/** Average to mono and resample to 16 kHz (linear: speech needs nothing finer). */
export function toMono16k(channels, rate) {
  const n = channels[0].length;
  const mono = new Float32Array(n);
  for (const ch of channels) for (let i = 0; i < n; i++) mono[i] += ch[i] / channels.length;
  if (rate === RATE) return mono;
  const out = new Float32Array(Math.floor((n * RATE) / rate));
  const step = rate / RATE;
  for (let i = 0; i < out.length; i++) {
    const x = i * step;
    const a = Math.floor(x);
    const t = x - a;
    out[i] = mono[a] * (1 - t) + (mono[Math.min(n - 1, a + 1)] || 0) * t;
  }
  return out;
}

/**
 * Start recording. Resolves once the microphone is open, to
 * { stop(): Promise<Blob>, cancel() }; rejects with the browser's error
 * (NotAllowedError, NotFoundError...). Stops by itself after MAX_SECONDS.
 */
export async function startRecording({ onAutoStop } = {}) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
  const rec = new MediaRecorder(stream);
  const chunks = [];
  rec.ondataavailable = (e) => { if (e.data?.size) chunks.push(e.data); };
  const ended = new Promise((resolve) => { rec.onstop = resolve; });
  const release = () => stream.getTracks().forEach((t) => t.stop());
  const timer = setTimeout(() => { if (rec.state === 'recording') { rec.stop(); onAutoStop?.(); } }, MAX_SECONDS * 1000);
  rec.start();
  return {
    async stop() {
      clearTimeout(timer);
      if (rec.state === 'recording') rec.stop();
      await ended;
      release();
      const raw = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      try {
        const audio = await ctx.decodeAudioData(await raw.arrayBuffer());
        const channels = Array.from({ length: audio.numberOfChannels }, (_, i) => audio.getChannelData(i));
        return encodeWav(toMono16k(channels, audio.sampleRate));
      } finally {
        ctx.close?.();
      }
    },
    cancel() {
      clearTimeout(timer);
      if (rec.state === 'recording') rec.stop();
      release();
    },
  };
}
