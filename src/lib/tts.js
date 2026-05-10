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

import { thaiPhoneticTranslit } from './tts-phonetic.js';
import { speakViaEdge, stopAllEdgeAudio, stopControllerEdge } from './tts-edge.js';

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
  // Standard SAPI — slower so multi-syllable phonetic strings articulate
  return lang === 'en' ? 0.85 : 0.88;
}

// Single pause schedule — was tier-adaptive but the extra SAPI pauses
// felt chopped rather than natural. Treat all voices the same and let
// the voice's own punctuation prosody do most of the work.
function pausesFor() {
  return { afterStem: 550, betweenOpts: 380, afterLast: 180 };
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
// surrounding language. Also handles fill-in-blank underscore runs
// (Pattara would read "_____" as "ขีดล่างๆๆๆๆๆ" — ugly) and dash
// ranges like "5-10" (Pattara reads as "5 ลบ 10" subtraction).
function normalizeSymbols(text, lang) {
  if (!text) return text;
  const isEn = lang === 'en';
  return text
    // Fill-in-the-blank: 2+ underscores in a row → "ช่องว่าง" / "blank"
    // Single underscore (e.g. in a variable name) kept as-is.
    .replace(/_{2,}/g, isEn ? ' blank ' : ' ช่องว่าง ')
    // Numeric ranges with hyphen/dash/en-dash: "5-10" / "5–10" → "5 ถึง 10"
    // Run BEFORE we touch unit slashes so we don't accidentally absorb the
    // hyphen inside drug names like "Sulfa-Trimethoprim".
    .replace(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/g, (m, a, b) => `${a} ${isEn ? 'to' : 'ถึง'} ${b}`)
    // Three-or-more dots (ellipsis) → comma pause (browser ignores literal dots)
    .replace(/\.{3,}/g, ', ')
    .replace(/…/g, ', ')
    // Arrows
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
    .replace(/\/day\b|\/d\b/g, isEn ? ' per day' : ' ต่อวัน')
    // Veterinary dosing frequency — "q12h" / "q4h" / "q8h" etc.
    // Format: q<number>h means "every N hours". Pattara reads "q12h"
    // letter-by-letter ("คิว ทเวลฟ์ เอช") — confusing. Replace with
    // natural Thai/English phrasing.
    .replace(/\bq(\d+)h\b/gi, (m, n) => isEn ? `every ${n} hours` : `ทุก ${n} ชั่วโมง`)
    // Latin abbreviations for daily frequency (SID/BID/TID/QID).
    // SID = once a day, BID = twice, TID = 3×, QID = 4×.
    .replace(/\bSID\b/g, isEn ? 'once a day' : 'วันละครั้ง')
    .replace(/\bBID\b/g, isEn ? 'twice a day' : 'วันละสองครั้ง')
    .replace(/\bTID\b/g, isEn ? 'three times a day' : 'วันละสามครั้ง')
    .replace(/\bQID\b/g, isEn ? 'four times a day' : 'วันละสี่ครั้ง')
    // PRN = as needed
    .replace(/\bPRN\b/g, isEn ? 'as needed' : 'เมื่อจำเป็น');
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
  return text
    // "5 mg" / "0.5 mcg" — number-prefixed units
    .replace(/(\d+(?:\.\d+)?)\s*([a-zA-Zµμ]{1,5})\b/g, (m, num, unit) => {
      const expanded = map[unit];
      if (!expanded) return m;
      return `${num} ${expanded}`;
    })
    // "ต่อ kg" / "per kg" — bare units after a preposition word
    // (normalizeSymbols above turns "mg/kg" into "mg ต่อ kg", so the
    // trailing "kg" loses its leading number and needs this catch).
    .replace(/(ต่อ|per)\s+([a-zA-Zµμ]{1,5})\b/g, (m, prep, unit) => {
      const expanded = map[unit];
      if (!expanded) return m;
      return `${prep} ${expanded}`;
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
    if (runLen > 60 && /\s/.test(ch)) {
      // Replace the just-added space with ", " to inject a pause
      out = out.slice(0, -1) + ', ';
      runLen = 0;
    }
  }
  return out;
}

// Full preprocessing pipeline applied per (text, lang).
//
// Order matters:
//   1. Symbol normalization first — turns "→ / × / %" into language
//      words, BEFORE phonetic translit walks the string.
//   2. Unit smoothing next — "5 mg/kg" becomes
//      "5 milligrams per kilogram" (English) or
//      "5 มิลลิกรัมต่อกิโลกรัม" (Thai). Translit step would otherwise
//      tag "mg" / "kg" as unknown abbreviations.
//   3. Acronym expansion — turns "GDV" → "G D V" letter form. For
//      Thai voice, the next translit step rewrites those letters into
//      Thai phonetic letter names.
//   4. PHONETIC TRANSLIT (Thai voice only) — turns remaining English
//      medical terms ("Doberman", "mastectomy") into Thai phonetic
//      spellings the Thai voice can read smoothly. Includes a fallback
//      that spells unmapped 2-5-letter all-caps words as Thai letters.
//   5. Breath commas last — visual whitespace is final, so we don't
//      mess up boundary regexes earlier in the pipeline.
function preprocess(text, lang) {
  if (!text) return '';
  let t = text;
  t = normalizeSymbols(t, lang);
  t = expandUnits(t, lang);
  if (lang === 'th') {
    // Thai voice path: phonetic translit FIRST so "IV"/"PO"/"GDV"
    // hit the dict's intact form before the generic acronym expander
    // would split them into spaced letters (which then wouldn't match
    // dict entries). The translit's spell-letter fallback at the end
    // covers any remaining unmapped 2-5 char ALL-CAPS abbreviations.
    t = thaiPhoneticTranslit(t);
  } else {
    // English voice path: spell out acronyms with spaces so Zira
    // reads them letter-by-letter ("D K A") instead of guessing.
    t = expandAcronyms(t);
  }
  // Breath-comma injection removed — was breaking flow inside coherent
  // Thai sentences. Voices handle their own prosody on punctuation.
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
  // Rule: voice is decided by the STEM language, with a strong bias
  // toward Thai. If Thai chars are ≥ 25 % of the detected chars in
  // the stem, the whole Q reads with the Thai voice — which then
  // pipes English medical terms through the phonetic-translit dict
  // (tts-phonetic.js). The dict is comprehensive enough that
  // "Doberman" / "Mastectomy" / "Fenbendazole" all read as smooth
  // Thai phonetics. Only Q where the stem is essentially-no-Thai
  // (engprof research papers, all-English drills) get Zira.
  //
  // Why 25 % and not 50 %: typical Thai vet stems are 60-70 % Thai
  // prose with embedded English drug/disease names. At 50 % the
  // Drug-Q-with-Aj.-attribution style ("Antibiotic combination
  // แนวทาง parenteral ที่ Aj. X แนะนำใน CPV …") tips to English
  // and the Thai context words get silently skipped by Zira. 25 %
  // captures these correctly.
  const stemText = (stem || '').trim();
  let th = 0, en = 0;
  const target = stemText || ((stem || '') + ' ' + safeOptions.join(' '));
  for (const ch of target) {
    if (THAI_RE.test(ch)) th++;
    else if (ENG_RE.test(ch)) en++;
  }
  const total = th + en;
  // Default Thai when no detected chars (digit-only / empty edge case).
  // English wins ONLY when Thai content is < 25 % AND English exists.
  const qLang = (total > 0 && th / total < 0.25 && en > 0) ? 'en' : 'th';

  // Single pause schedule for all voices — voice's own punctuation
  // prosody handles intra-sentence rhythm; we only set inter-segment gaps.
  const P = pausesFor();

  // Thai numbering for natural narrator cadence — "ตัวเลือกที่ หนึ่ง / สอง / สาม …"
  // is how Thai audiobook narrators read MCQs aloud. Way smoother for
  // Pattara than "A. ..." which it reads as "เอ ดอท" lurch. English
  // voices keep "Option A. ..." which Zira reads naturally.
  const TH_NUM = ['หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด'];

  // Build the full sentence list once — same for both Edge and Web Speech
  // paths so a fallback mid-flight resumes from the same content model.
  const sentences = [];
  if (stem && stem.trim()) {
    const text = preprocess(stem, qLang);
    sentences.push(/[.!?]$/.test(text) ? text : text + '.');
  }
  for (let i = 0; i < safeOptions.length; i++) {
    const raw = safeOptions[i] || '';
    const opt = preprocess(raw, qLang);
    sentences.push(qLang === 'th'
      ? `ตัวเลือกที่ ${TH_NUM[i] || (i + 1)}, ${opt}.`
      : `Option ${String.fromCharCode(65 + i)}. ${opt}.`);
  }

  // ── Try Edge TTS first (neural quality on EVERY platform) ────
  // Bypass when 'standard' tier voices give us free neural elsewhere
  // (Apple iOS/macOS premium / Edge browser online voices) since local
  // playback is faster + offline. Edge proxy only kicks in when the
  // local voice is SAPI-tier robotic.
  const chosenVoice = pickVoice(voices, qLang);
  const tier = voiceTier(chosenVoice);
  const useEdge = tier === 'standard' || !chosenVoice;

  let edgeFallback = false;
  if (useEdge) {
    try {
      for (let i = 0; i < sentences.length; i++) {
        if (controller?.cancelled) { stopControllerEdge(controller); break; }
        await speakViaEdge({ text: sentences[i], lang: qLang, rate: 1.0, controller });
        if (controller?.cancelled) break;
        // Inter-segment pause — Edge audio has no built-in gap between calls
        const isStem = i === 0 && stem && stem.trim();
        const isLast = i === sentences.length - 1;
        await pause(isStem ? P.afterStem : (isLast ? P.afterLast : P.betweenOpts));
      }
      onEnd?.();
      return;
    } catch (err) {
      // Edge failed — clear any half-played audio + fall back to Web Speech
      console.warn('[tts] edge proxy failed, falling back to Web Speech:', err?.message);
      stopControllerEdge(controller);
      stopAllEdgeAudio();
      edgeFallback = true;
    }
  }

  // ── Web Speech fallback / direct path ────────────────────────
  try {
    if (stem && stem.trim()) {
      await speakSentence(sentences[0], qLang, voices, controller);
      if (controller?.cancelled) { synth.cancel(); return; }
      await pause(P.afterStem);
    }
    const optStart = (stem && stem.trim()) ? 1 : 0;
    for (let i = optStart; i < sentences.length; i++) {
      if (controller?.cancelled) { synth.cancel(); break; }
      await speakSentence(sentences[i], qLang, voices, controller);
      const isLast = i === sentences.length - 1;
      await pause(isLast ? P.afterLast : P.betweenOpts);
    }
  } finally {
    onEnd?.();
  }
  // edgeFallback is set when we deliberately fell through; keeps lint
  // happy and could surface a UI hint later if desired.
  void edgeFallback;
}

export function cancelSpeech() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  stopAllEdgeAudio();
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
