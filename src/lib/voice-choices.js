// ============================================================
// voice-choices — what the voice settings offer: named settings, the tone
// steps by name, and the device voices to choose from
// ============================================================
// Apart from voice-prefs.js so the practice card carries only the stored
// settings; this loads with the dialog and the speech code.
// ============================================================
import { getVoicePrefs } from './voice-prefs.js';

export const PITCH_LABELS = ['ทุ้มมาก', 'ทุ้ม', 'ปกติ', 'สูง', 'สูงมาก'];

/** Named settings a student understands at a glance. */
export const PRESETS = [
  { id: 'clear', label: 'ช้าและชัด', note: 'ฟังศัพท์ยาก', rate: 0.75, pitch: 1 },
  { id: 'normal', label: 'ปกติ', note: 'ฟังทั่วไป', rate: 1, pitch: 1 },
  { id: 'revise', label: 'เร็ว ทบทวน', note: 'ทวนข้อเดิม', rate: 1.5, pitch: 1 },
];

/** The preset these settings match, or null (the listener's own mix). */
export function presetOf(prefs) {
  return PRESETS.find((p) => p.rate === prefs.rate && p.pitch === prefs.pitch)?.id ?? null;
}

/**
 * The device's voices a listener can choose from, by language: Thai voices
 * for Thai text, English ones for English text, each once, by name.
 */
export function voiceChoices(voices) {
  const out = { th: [], en: [] };
  const seen = new Set();
  for (const v of voices || []) {
    if (!v || !v.voiceURI || seen.has(v.voiceURI)) continue;
    const lang = /^th/i.test(v.lang || '') ? 'th' : /^en/i.test(v.lang || '') ? 'en' : null;
    if (!lang) continue;
    seen.add(v.voiceURI);
    out[lang].push({ id: v.voiceURI, name: v.name || v.voiceURI, lang: v.lang });
  }
  for (const k of ['th', 'en']) out[k].sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

/**
 * The voice the listener chose for a language, if this device still has it
 * (a voice can be removed, or the setting came from another device's
 * browser); null means the reader picks the best voice itself.
 */
export function chosenVoice(voices, lang, prefs = getVoicePrefs()) {
  const id = lang === 'en' ? prefs.voiceEn : prefs.voiceTh;
  if (!id) return null;
  const want = lang === 'en' ? /^en/i : /^th/i;
  return (voices || []).find((v) => v && v.voiceURI === id && want.test(v.lang || '')) || null;
}
