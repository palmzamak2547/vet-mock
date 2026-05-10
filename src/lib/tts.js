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

// Pick the dominant language of a piece of text — count Thai vs Latin
// chars and return whichever is bigger. Empty/digit-only → 'th'
// (default for VetMock since most prose is Thai).
//
// We deliberately do NOT split a single sentence into multiple voices.
// Earlier attempt fragmented every code-switch into its own utterance
// (Thai voice → English voice → Thai voice ...) which sounded comedic
// in mid-sentence. Picking ONE voice per sentence + each option means
// minority-language tokens get phonetic-approximated by the majority
// voice, which is "slightly off" but never "broken comedy" — a
// strictly better trade for clinical Q reading.
function dominantLang(text) {
  if (!text) return 'th';
  let th = 0, en = 0;
  for (const ch of text) {
    if (THAI_RE.test(ch)) th++;
    else if (ENG_RE.test(ch)) en++;
  }
  if (th === 0 && en === 0) return 'th';
  return th >= en ? 'th' : 'en';
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

// Public — speak a Q stem + options sequence using ONE voice per
// sentence (dominant language). `controller` is an optional
// { cancelled } object the caller can flip to abort mid-flight.
//
// Voice selection rules:
//   • Stem is spoken once with the dominant-language voice of the stem.
//   • Each option is spoken once with the dominant-language voice of
//     that option (so an English-only option always uses English voice
//     even if the stem is Thai-dominant).
//   • The "A.", "B." letter prefix is bundled into the option utterance
//     instead of a separate utterance. Avoids a forced English voice
//     swap on every option, which read as comedy ping-pong.
//   • If the WHOLE Q (stem + all options concatenated) is dominantly
//     one language, use that single voice for everything — most natural
//     case for the engprof / vca subjects.
export async function speakQuestion({ stem, options, onStart, onEnd, controller }) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  // Cancel anything currently in queue so we don't stack up
  synth.cancel();

  const voices = await ensureVoices();
  if (controller?.cancelled) return;
  onStart?.();

  const safeOptions = Array.isArray(options) ? options : [];
  // Detect the overall language. If the whole Q is overwhelmingly one
  // language (≥ 75% of detected chars), force that voice everywhere
  // for maximum coherence. Otherwise fall back to per-piece dominant.
  const wholeText = (stem || '') + ' ' + safeOptions.join(' ');
  let th = 0, en = 0;
  for (const ch of wholeText) {
    if (THAI_RE.test(ch)) th++;
    else if (ENG_RE.test(ch)) en++;
  }
  const total = th + en;
  const forceLang = total > 0
    ? (th / total >= 0.75 ? 'th' : (en / total >= 0.75 ? 'en' : null))
    : null;

  const langFor = (text) => forceLang || dominantLang(text);

  try {
    // Speak the stem in ONE go with its dominant voice
    if (stem && stem.trim()) {
      await speakChunk(stem, langFor(stem), voices);
      if (controller?.cancelled) { synth.cancel(); return; }
      await pause(500);
    }

    // Each option is spoken as a single utterance: "A. ..." together.
    // Letter + content share one voice — no comedic mid-sentence swap.
    for (let i = 0; i < safeOptions.length; i++) {
      if (controller?.cancelled) { synth.cancel(); break; }
      const letter = String.fromCharCode(65 + i);
      const opt = safeOptions[i] || '';
      const lang = langFor(opt);
      // Use a Thai-side period after the letter so Thai voice doesn't
      // read it as English "A dot"; English voice will say "A period"
      // for "A." which is fine. Trailing space helps prosody.
      const text = lang === 'en' ? `${letter}. ${opt}` : `${letter}, ${opt}`;
      await speakChunk(text, lang, voices);
      // Inter-option pause — long enough that students can tell where
      // one option ends and the next begins.
      await pause(450);
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
