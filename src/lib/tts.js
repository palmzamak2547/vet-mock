// ============================================================
// tts — robust Web Speech text-to-speech for Thai + English
// ============================================================
//
// Why this file exists:
//   The naive `new SpeechSynthesisUtterance(text); synth.speak(utter)`
//   pattern fails in two ways for Q reading:
//     • Mixed-language Q (Thai stem + English options) gets read with
//       ONE voice — Thai voice butchers English ("Doberman" → unreadable);
//       English voice butchers Thai.
//     • Concatenated A.B.C.D. options run together with no pauses —
//       students can't tell where one option ends.
//
// What this module does:
//   • Splits text into language-tagged chunks via Unicode range
//     detection (Thai block U+0E00-U+0E7F).
//   • Picks the best installed voice per language per platform — Apple
//     'Kanya'/'Samantha', Google 'th-TH'/'en-US', Microsoft 'Pattara'/
//     'Aria' — falling back to first matching lang.
//   • Speaks chunks sequentially with explicit gaps (real silence,
//     not utterance concatenation) so options feel "...A. ... B. ..."
//   • Slower rate for English than Thai (English voices on
//     desktop Windows are robotic at 1.0; 0.88 is the sweet spot).
//   • Handles the Chrome quirk where voices.getVoices() returns []
//     on first call until the 'voiceschanged' event fires.
// ============================================================

const THAI_RE = /[฀-๿]/;
const ENG_RE = /[A-Za-z]/;

// Voice cache — getVoices() result + a promise that resolves once it's populated
let _voicesPromise = null;
function ensureVoices() {
  if (_voicesPromise) return _voicesPromise;
  _voicesPromise = new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([]);
      return;
    }
    const synth = window.speechSynthesis;
    const got = synth.getVoices();
    if (got && got.length > 0) {
      resolve(got);
      return;
    }
    const onChange = () => {
      const v = synth.getVoices();
      if (v && v.length > 0) {
        synth.removeEventListener('voiceschanged', onChange);
        resolve(v);
      }
    };
    synth.addEventListener('voiceschanged', onChange);
    // Fallback timeout in case the event never fires (some Linux Chromiums)
    setTimeout(() => resolve(synth.getVoices() || []), 1500);
  });
  return _voicesPromise;
}

// Detect language of a chunk: count Thai chars vs Latin letters and pick
// the majority. Empty/whitespace-only → returns null (skip).
function detectLang(text) {
  if (!text) return null;
  let th = 0, en = 0;
  for (const ch of text) {
    if (THAI_RE.test(ch)) th++;
    else if (ENG_RE.test(ch)) en++;
  }
  if (th === 0 && en === 0) return null;
  return th >= en ? 'th' : 'en';
}

// Split text into runs of one language at a time. We don't split on every
// character — we batch consecutive same-language characters (including
// punctuation/spaces between them) into one chunk. Mixed runs of words
// like "Doberman อายุ 5 ปี" become 2 chunks.
function splitByLanguage(text) {
  if (!text) return [];
  const chunks = [];
  let buf = '';
  let bufLang = null;
  const flush = () => {
    if (buf.trim()) chunks.push({ text: buf, lang: bufLang || 'th' });
    buf = '';
    bufLang = null;
  };
  for (const ch of text) {
    let chLang = null;
    if (THAI_RE.test(ch)) chLang = 'th';
    else if (ENG_RE.test(ch)) chLang = 'en';
    // Punctuation/digits/spaces get attached to current run
    if (chLang === null) {
      buf += ch;
      continue;
    }
    if (bufLang && chLang !== bufLang) {
      // Language switch — flush current run
      flush();
    }
    buf += ch;
    bufLang = chLang;
  }
  flush();
  return chunks;
}

// Best-voice picker per (lang, platform). Walks the voices list with a
// preference order — known-good voices first, then any voice matching
// the requested lang. Returns null if no voice covers the lang.
function pickVoice(voices, lang) {
  if (!voices || voices.length === 0) return null;
  const isThaiVoice = (v) => /^th/i.test(v.lang);
  const isEnglishVoice = (v) => /^en/i.test(v.lang);
  const matchLang = lang === 'th' ? isThaiVoice : isEnglishVoice;
  const candidates = voices.filter(matchLang);
  if (candidates.length === 0) return null;

  // Preferred names (regex over voice.name) — known to sound natural
  // on each platform for each language.
  const preferList = lang === 'th'
    ? [
        /Google.*ไทย|Google.*Thai/i,    // Chrome / Android
        /Kanya/i,                         // Apple iOS/macOS
        /Pattara/i,                       // Windows Microsoft
        /Premwadee/i,                     // Windows
      ]
    : [
        /Google.*US.*English/i,           // Chrome desktop
        /Google.*UK.*English/i,           // Chrome desktop
        /Samantha/i,                      // Apple
        /Karen|Daniel|Allison/i,          // Apple
        /Microsoft.*Aria.*Online/i,       // Windows 11
        /Microsoft.*Jenny.*Online/i,      // Windows 11
        /Microsoft.*Zira/i,               // Windows
        /Microsoft.*David/i,              // Windows
      ];

  for (const re of preferList) {
    const hit = candidates.find((v) => re.test(v.name));
    if (hit) return hit;
  }
  // Prefer non-novelty voices ("default" is usually the system default)
  const nonNovelty = candidates.find((v) => v.localService) || candidates.find((v) => v.default);
  return nonNovelty || candidates[0];
}

// Speak a single text chunk in a language. Returns a Promise that
// resolves when the utterance finishes or errors out. Chains nicely.
function speakChunk(text, lang, voices, opts = {}) {
  return new Promise((resolve) => {
    if (!text || !text.trim()) { resolve(); return; }
    if (typeof window === 'undefined' || !window.speechSynthesis) { resolve(); return; }
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    const voice = pickVoice(voices, lang);
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    } else {
      utter.lang = lang === 'th' ? 'th-TH' : 'en-US';
    }
    // English voices on Windows + some Linux Chromiums are robotic at
    // 1.0; slowing slightly makes them comprehensible. Thai voices on
    // Apple are fine at 0.95.
    utter.rate = opts.rate ?? (lang === 'en' ? 0.88 : 0.95);
    utter.pitch = opts.pitch ?? 1.0;
    utter.volume = opts.volume ?? 1.0;
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    synth.speak(utter);
  });
}

// Tiny pause primitive — actual silence between sentences. Browsers don't
// reliably honor `,` or `.` for pause length, so we just delay before
// scheduling the next utterance.
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

// Public — speak a Q stem + options sequence. `controller` is an
// optional { cancelled } object the caller can flip to abort mid-flight.
export async function speakQuestion({ stem, options, onStart, onEnd, controller }) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  // Cancel anything currently in queue so we don't stack up
  synth.cancel();

  const voices = await ensureVoices();
  if (controller?.cancelled) return;
  onStart?.();
  try {
    // Speak the stem
    const stemChunks = splitByLanguage(stem || '');
    for (const c of stemChunks) {
      if (controller?.cancelled) { synth.cancel(); break; }
      await speakChunk(c.text, c.lang, voices);
    }
    if (controller?.cancelled) return;
    // Slightly longer pause between stem and options
    await pause(450);

    // Speak each option labelled "A.", "B." with explicit pauses between
    if (Array.isArray(options)) {
      for (let i = 0; i < options.length; i++) {
        if (controller?.cancelled) { synth.cancel(); break; }
        const letter = String.fromCharCode(65 + i);
        // Letter is always English — speak with English voice for clarity
        await speakChunk(letter + '.', 'en', voices, { rate: 0.95 });
        await pause(180);
        const optChunks = splitByLanguage(options[i] || '');
        for (const c of optChunks) {
          if (controller?.cancelled) { synth.cancel(); break; }
          await speakChunk(c.text, c.lang, voices);
        }
        // Inter-option pause — long enough that it doesn't feel rushed
        await pause(420);
      }
    }
  } finally {
    onEnd?.();
  }
}

// Cancel any in-flight speech (used on Q change / unmount)
export function cancelSpeech() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
