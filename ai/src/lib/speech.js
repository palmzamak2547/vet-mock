// Speech in (recognition, th-TH) and out (the device's own Thai voice).
// Both are optional: buttons appear only where the browser really has them.

import { Recognition, CAN_SPEAK } from './env.js';

export function listen({ onText, onEnd, onLevel }) {
  if (!Recognition) return null;
  const r = new Recognition();
  r.lang = 'th-TH';
  r.interimResults = true;
  r.continuous = false;
  r.maxAlternatives = 1;
  let finalText = '';
  r.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) finalText += t;
      else interim += t;
    }
    onText(finalText + interim, !interim);
  };
  r.onsoundstart = () => onLevel?.(1);
  r.onspeechend = () => onLevel?.(0);
  r.onerror = (e) => onEnd?.(e.error || 'error');
  r.onend = () => onEnd?.(null);
  try { r.start(); } catch { return null; }
  return { stop: () => { try { r.stop(); } catch { /* already stopped */ } } };
}

let thaiVoice;
function pickVoice() {
  if (thaiVoice !== undefined) return thaiVoice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  thaiVoice = voices.find((v) => /^th(-|_|$)/i.test(v.lang)) || null;
  return thaiVoice;
}

export function hasThaiVoice() {
  if (!CAN_SPEAK) return Promise.resolve(false);
  if (pickVoice()) return Promise.resolve(true);
  return new Promise((res) => {
    const done = () => res(!!pickVoice());
    window.speechSynthesis.addEventListener?.('voiceschanged', done, { once: true });
    setTimeout(done, 1500);
  });
}

/** Markdown and citation marks are for eyes, not ears. */
export function speakable(md) {
  return String(md || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[(\d+(?:\s*,\s*\d+)*)\]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_`|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function speak(text, { onEnd } = {}) {
  if (!CAN_SPEAK) return null;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(speakable(text));
  const v = pickVoice();
  if (v) u.voice = v;
  u.lang = 'th-TH';
  u.rate = 1;
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  synth.speak(u);
  return { stop: () => { synth.cancel(); onEnd?.(); } };
}
