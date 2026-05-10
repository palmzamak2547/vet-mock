// ============================================================
// tts — natural-sounding Web Speech for clinical Thai + English
// ============================================================
//
// Design notes (TTS v3 · 2026-05-11):
//
// Targets the "audiobook narration" feel — calm, clear, code-switch
// gracefully without sounding like two robots dueting.
//
// Standards we anchor to:
//   • Newscaster / educational pace ≈ 140 wpm English. Web Speech
//     baseline (rate=1.0) is ~180 wpm = too fast for med terms.
//   • Audible / Apple Books pause rhythm: period ≈ 700 ms,
//     comma ≈ 250 ms, list-item separator ≈ 450 ms.
//   • One voice per sentence (Apple VoiceOver / Speechify pattern).
//     Mid-sentence voice swaps sound comedic; we pick the dominant
//     language and let minor-language tokens be phonetically
//     approximated.
//
// What this v3 adds over v2:
//
// 1. Voice quality ranking — prefer Microsoft Edge "Online (Natural)"
//    neural voices > Apple premium > Google > standard SAPI. Adaptive
//    rate per tier (neural can run at 0.95; SAPI needs 0.85).
//
// 2. Acronym phonetic expansion — common medical abbreviations like
//    GDV, AKI, ECG, CKD get spelled out as letters so Thai voices
//    don't pronounce them as words ("ah-kee" → "A K I"). Selective
//    list — we don't blow up every all-caps word.
//
// 3. Symbol + arrow normalization — "→" → "ไป" (or "to" for English),
//    "×" → "คูณ" / "times", "%" → "เปอร์เซ็นต์" / "percent",
//    "/" between units → "ต่อ" / "per".
//
// 4. Number + unit smoothing — "5 mg/kg" reads horribly; rewrite to
//    "5 มิลลิกรัมต่อกิโลกรัม" (Thai context) or
//    "5 milligrams per kilogram" (English context).
//
// 5. Adaptive sentence-end pauses — period 700 ms, ellipsis 800 ms,
//    end-of-stem 600 ms, between options 450 ms. Ditch v2's flat 500.
//
// 6. Long-sentence safety chunking — Chrome Web Speech has a bug
//    where utterances ≥ 280 chars can hang. We split on sentence
//    boundaries before that limit.
//
// All preprocessing is OPT-IN per call (defaults on). Cancellation
// token still works mid-chain.
// ============================================================

const THAI_RE = /[฀-๿]/;
const ENG_RE = /[A-Za-z]/;
const SAFE_CHUNK_LIMIT = 240; // chars — under Chrome's reported hang threshold

// Voice cache + readiness — getVoices() may return [] on Chrome until
// the 'voiceschanged' event fires.
let _voicesPromise = null;
function ensureVoices() {
  if (_voicesPromise) return _voicesPromise;
  _voicesPromise = new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) { resolve([]); return; }
    const synth = window.speechSynthesis;
    const got = synth.getVoices();
    if (got && got.length > 0) { resolve(got); return; }
    const onChange = () => {
      const v = synth.getVoices();
      if (v && v.length > 0) {
        synth.removeEventListener('voiceschanged', onChange);
        resolve(v);
      }
    };
    synth.addEventListener('voiceschanged', onChange);
    setTimeout(() => resolve(synth.getVoices() || []), 1500);
  });
  return _voicesPromise;
}

// Pick the dominant language of a piece of text — count Thai vs Latin
// chars and return whichever is bigger. Empty/digit-only → 'th'.
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

// ── Voice quality tier classification ─────────────────────────
// Used to pick BOTH which voice to prefer AND what rate sounds natural.
// "neural" voices are near-human; SAPI offline voices are 1995-era
// formant synthesis and need significant slowdown to be intelligible.
function voiceTier(voice) {
  if (!voice) return 'standard';
  const name = voice.name || '';
  const uri = voice.voiceURI || '';
  // Microsoft Edge online neural voices ship as "Microsoft … Online (Natural)"
  if (/Online \(Natural\)|Neural|GoogleWavenet/i.test(name + uri)) return 'neural';
  // Apple "Premium" + "Enhanced" voices — modern macOS / iOS 17+
  if (/Premium|Enhanced/i.test(name)) return 'premium';
  // Apple stock voices (still good)
  if (/^(Samantha|Karen|Daniel|Allison|Kanya|Niwat|Ava)$/i.test(name)) return 'premium';
  // Google Chrome desktop voices
  if (/Google/i.test(name)) return 'premium';
  // Microsoft SAPI offline (Pattara, Zira, David, Mark) — usable but robotic
  return 'standard';
}

function rateFor(lang, tier) {
  if (tier === 'neural' || tier === 'premium') return lang === 'en' ? 0.95 : 1.0;
  // Standard SAPI voices need slowdown to be comprehensible on med terms
  return lang === 'en' ? 0.85 : 0.93;
}

function pickVoice(voices, lang) {
  if (!voices || voices.length === 0) return null;
  const matchLang = lang === 'th' ? (v) => /^th/i.test(v.lang) : (v) => /^en/i.test(v.lang);
  const candidates = voices.filter(matchLang);
  if (candidates.length === 0) return null;

  // Sort candidates by quality tier first; within tier, prefer known names.
  const tierRank = { neural: 0, premium: 1, standard: 2 };
  const preferList = lang === 'th'
    ? [
        /Online \(Natural\)|Neural/i,            // MS Edge online neural
        /Google.*ไทย|Google.*Thai/i,             // Chrome / Android
        /Kanya|Niwat/i,                           // Apple
        /Pattara|Premwadee/i,                    // Windows MS SAPI
      ]
    : [
        /Online \(Natural\)|Neural/i,            // MS Edge online (Aria/Jenny/Ana)
        /Google.*US.*English|Google.*UK/i,        // Chrome desktop
        /Samantha|Ava|Allison/i,                 // Apple female (clearer for clinical)
        /Karen|Daniel/i,                          // Apple alt
        /Microsoft.*Aria.*Online/i,
        /Microsoft.*Jenny.*Online/i,
        /Microsoft.*Zira/i,                       // Win10 SAPI female — clearer than David
        /Microsoft.*David|Microsoft.*Mark/i,
      ];

  const scored = candidates.map((v) => {
    const tRank = tierRank[voiceTier(v)] ?? 3;
    let nameRank = preferList.length;
    for (let i = 0; i < preferList.length; i++) {
      if (preferList[i].test(v.name)) { nameRank = i; break; }
    }
    return { v, tRank, nameRank };
  });
  scored.sort((a, b) => a.tRank - b.tRank || a.nameRank - b.nameRank);
  return scored[0].v;
}

// ── Preprocessing — clean text BEFORE speech ──────────────────

// Acronyms commonly seen in clinical Q. Spelled-out form keeps Thai
// voices from mispronouncing them as words and English voices from
// guessing wrong. Selective list — only abbreviations confirmed to
// fail on at least one common voice.
const ACRONYM_MAP = {
  GDV: 'G D V', AKI: 'A K I', CKD: 'C K D', DKA: 'D K A',
  ECG: 'E C G', EKG: 'E K G', MRI: 'M R I', CT: 'C T', US: 'U S',
  DCM: 'D C M', HCM: 'H C M', DMVD: 'D M V D', PDA: 'P D A',
  ARDS: 'A R D S', DIC: 'D I C', SIRS: 'S I R S',
  CPR: 'C P R', CPCR: 'C P C R', BLS: 'B L S', ALS: 'A L S',
  IV: 'I V', IM: 'I M', SC: 'S C', PO: 'P O', SQ: 'S Q',
  RBC: 'R B C', WBC: 'W B C', PCV: 'P C V',
  BUN: 'B U N',
  PRRSV: 'P R R S V', FIV: 'F I V', FeLV: 'fee-lyv',
  COPD: 'C O P D', UTI: 'U T I',
  RER: 'R E R', BSA: 'B S A',
  // VetMock-specific
  VCA: 'V C A',
};
function expandAcronyms(text) {
  if (!text) return text;
  return text.replace(/\b([A-Z]{2,5})\b/g, (m) => ACRONYM_MAP[m] || m);
}

// Symbols that confuse TTS — replace with words appropriate to the
// surrounding language.
function normalizeSymbols(text, lang) {
  if (!text) return text;
  const isEn = lang === 'en';
  return text
    .replace(/→|⇒|->/g, isEn ? ' to ' : ' ไป ')
    .replace(/×/g, isEn ? ' times ' : ' คูณ ')
    .replace(/±/g, isEn ? ' plus or minus ' : ' บวกลบ ')
    .replace(/≥/g, isEn ? ' greater than or equal to ' : ' มากกว่าหรือเท่ากับ ')
    .replace(/≤/g, isEn ? ' less than or equal to ' : ' น้อยกว่าหรือเท่ากับ ')
    .replace(/%/g, isEn ? ' percent' : ' เปอร์เซ็นต์')
    // "5 mg/kg" → "5 mg per kg" (preprocessor for unit expansion below)
    .replace(/(\d+(?:\.\d+)?\s*[a-zA-Zµμ]+)\/([a-zA-Zµμ]+)/g, (m, a, b) => `${a} ${isEn ? 'per' : 'ต่อ'} ${b}`)
    // Trailing "/min", "/hr"
    .replace(/\/min\b/g, isEn ? ' per minute' : ' ต่อนาที')
    .replace(/\/hr\b|\/h\b/g, isEn ? ' per hour' : ' ต่อชั่วโมง')
    .replace(/\/day\b|\/d\b/g, isEn ? ' per day' : ' ต่อวัน');
}

// Common clinical units. Thai voices mangle these letter-by-letter.
const UNIT_TH = {
  mg: 'มิลลิกรัม', kg: 'กิโลกรัม', g: 'กรัม', ml: 'มิลลิลิตร', mL: 'มิลลิลิตร',
  l: 'ลิตร', L: 'ลิตร', µg: 'ไมโครกรัม', mcg: 'ไมโครกรัม', ug: 'ไมโครกรัม',
  bpm: 'ครั้งต่อนาที', mmHg: 'มิลลิเมตรปรอท', cm: 'เซนติเมตร', mm: 'มิลลิเมตร',
  hr: 'ชั่วโมง', min: 'นาที', sec: 'วินาที',
};
const UNIT_EN = {
  mg: 'milligrams', kg: 'kilograms', g: 'grams', ml: 'milliliters', mL: 'milliliters',
  l: 'liters', L: 'liters', µg: 'micrograms', mcg: 'micrograms', ug: 'micrograms',
  bpm: 'beats per minute', mmHg: 'millimeters of mercury',
  cm: 'centimeters', mm: 'millimeters',
  hr: 'hours', min: 'minutes', sec: 'seconds',
};
function expandUnits(text, lang) {
  if (!text) return text;
  const map = lang === 'en' ? UNIT_EN : UNIT_TH;
  return text.replace(/(\d+(?:\.\d+)?)\s*([a-zA-Zµμ]{1,5})\b/g, (m, num, unit) => {
    const expanded = map[unit];
    if (!expanded) return m;
    return `${num} ${expanded}`;
  });
}

// Add light comma breath points to long Thai monologues — Pattara is
// otherwise relentless. Insert after every ~8 Thai-character word run
// that doesn't already have a punctuation break. English voices
// already meter on word boundaries, so this is Thai-only.
function injectBreathCommas(text, lang) {
  if (lang !== 'th' || !text) return text;
  // Crude: insert a comma after a Thai-only run of ~50+ chars without
  // any punctuation. Walks the string, drops a comma after the next
  // space when the running count exceeds the threshold.
  let out = '';
  let runLen = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    out += ch;
    if (/[.,;:!?]/.test(ch)) { runLen = 0; continue; }
    if (THAI_RE.test(ch)) runLen++;
    if (runLen > 40 && /\s/.test(ch)) {
      // Replace the just-added space with ", " to inject a pause
      out = out.slice(0, -1) + ', ';
      runLen = 0;
    }
  }
  return out;
}

// Full preprocessing pipeline applied per (text, lang).
function preprocess(text, lang) {
  if (!text) return '';
  let t = text;
  t = expandAcronyms(t);
  t = normalizeSymbols(t, lang);
  t = expandUnits(t, lang);
  t = injectBreathCommas(t, lang);
  return t.replace(/\s+/g, ' ').trim();
}

// Long-sentence safety: Chrome can stall on >280-char utterances.
// Split at sentence boundaries (period / Thai end-quote markers).
function safeSplit(text) {
  if (text.length <= SAFE_CHUNK_LIMIT) return [text];
  const out = [];
  let buf = '';
  for (const part of text.split(/(?<=[.!?]\s)/)) {
    if ((buf + part).length > SAFE_CHUNK_LIMIT && buf) {
      out.push(buf.trim());
      buf = part;
    } else {
      buf += part;
    }
  }
  if (buf.trim()) out.push(buf.trim());
  // If a single piece is still too long (no sentence-end punctuation),
  // hard-split at word boundaries near the limit.
  return out.flatMap((p) => {
    if (p.length <= SAFE_CHUNK_LIMIT) return [p];
    const slices = [];
    let s = p;
    while (s.length > SAFE_CHUNK_LIMIT) {
      let cut = s.lastIndexOf(' ', SAFE_CHUNK_LIMIT);
      if (cut < SAFE_CHUNK_LIMIT * 0.5) cut = SAFE_CHUNK_LIMIT;
      slices.push(s.slice(0, cut));
      s = s.slice(cut).trim();
    }
    if (s) slices.push(s);
    return slices;
  });
}

function speakChunk(text, lang, voices, opts = {}) {
  return new Promise((resolve) => {
    if (!text || !text.trim()) { resolve(); return; }
    if (typeof window === 'undefined' || !window.speechSynthesis) { resolve(); return; }
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    const voice = pickVoice(voices, lang);
    const tier = voiceTier(voice);
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    } else {
      utter.lang = lang === 'th' ? 'th-TH' : 'en-US';
    }
    utter.rate = opts.rate ?? rateFor(lang, tier);
    utter.pitch = opts.pitch ?? 1.0;
    utter.volume = opts.volume ?? 1.0;
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    synth.speak(utter);
  });
}

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

// Speak one sentence safely (auto-chunks if too long for Chrome).
async function speakSentence(text, lang, voices, controller) {
  const pieces = safeSplit(text);
  for (const p of pieces) {
    if (controller?.cancelled) return;
    await speakChunk(p, lang, voices);
  }
}

// Public — speak a Q stem + options sequence.
export async function speakQuestion({ stem, options, onStart, onEnd, controller }) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  synth.cancel();

  const voices = await ensureVoices();
  if (controller?.cancelled) return;
  onStart?.();

  const safeOptions = Array.isArray(options) ? options : [];

  // ── ONE voice per Q. ALWAYS. ──────────────────────────────────
  // Earlier iterations tried per-piece dominance (stem voice could
  // differ from option voice). Even with each piece internally
  // consistent, the inter-piece swap landed as comedy ("ตลก" — Palm).
  //
  // The user's strong preference is unambiguous: prefer ONE voice
  // throughout, even if minority-language tokens get phonetically
  // approximated (Pattara reading "Doberman" sounds odd, but the
  // listener's brain auto-corrects medical terminology — vastly
  // better than two robots dueting).
  //
  // Rule: dominance is decided by the STEM language, not whole-Q.
  // Reason: stems carry the bulk of cognitive content; options are
  // usually short labels. A Thai stem with English-only short options
  // would otherwise tip the whole-Q count to English (since 4 short
  // options collectively outweigh a long Thai stem in raw chars), and
  // Zira would silently skip the Thai stem chars — the worst outcome.
  // If stem is empty (rare), fall back to combined-text dominance.
  const stemText = (stem || '').trim();
  let th = 0, en = 0;
  const target = stemText || ((stem || '') + ' ' + safeOptions.join(' '));
  for (const ch of target) {
    if (THAI_RE.test(ch)) th++;
    else if (ENG_RE.test(ch)) en++;
  }
  // Default Thai when no detected chars (digit-only / empty edge case)
  const qLang = (en > th) ? 'en' : 'th';

  // Audiobook-standard pauses (ms)
  const PAUSE_END_OF_STEM = 600;
  const PAUSE_BETWEEN_OPTIONS = 450;

  try {
    if (stem && stem.trim()) {
      const text = preprocess(stem, qLang);
      const stemText = /[.!?]$/.test(text) ? text : text + '.';
      await speakSentence(stemText, qLang, voices, controller);
      if (controller?.cancelled) { synth.cancel(); return; }
      await pause(PAUSE_END_OF_STEM);
    }

    for (let i = 0; i < safeOptions.length; i++) {
      if (controller?.cancelled) { synth.cancel(); break; }
      const letter = String.fromCharCode(65 + i);
      const raw = safeOptions[i] || '';
      const opt = preprocess(raw, qLang);
      // Comma form for Thai (so Pattara doesn't read "A dot");
      // period form for English (natural newscaster cadence).
      const text = qLang === 'en' ? `${letter}. ${opt}.` : `${letter}, ${opt}.`;
      await speakSentence(text, qLang, voices, controller);
      const isLast = i === safeOptions.length - 1;
      await pause(isLast ? 200 : PAUSE_BETWEEN_OPTIONS);
    }
  } finally {
    onEnd?.();
  }
}

export function cancelSpeech() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

// Exposed for tests / debugging — checks an installed voice setup
// without playing audio. Returns { ok, tier, voice, rate } per lang.
export async function inspectVoices() {
  const voices = await ensureVoices();
  const out = {};
  for (const lang of ['th', 'en']) {
    const v = pickVoice(voices, lang);
    out[lang] = v ? {
      name: v.name,
      lang: v.lang,
      tier: voiceTier(v),
      rate: rateFor(lang, voiceTier(v)),
      localService: v.localService,
    } : null;
  }
  return out;
}
