// The Edge voices read-aloud asks for. /api/tts speaks them and the browser's
// audio cache keys on them, so changing a voice here also retires the clips
// cached in the old one; otherwise a question can play a new voice for its
// stem and a cached old one for its options.
//
// Edge has two Thai neural voices, Premwadee (female) and Niwat (male); Aria
// is US English. Thai was Premwadee until 29 Oct 2026: measured that night
// from Bangkok with msedge-tts 2.1.1, Premwadee closed the socket before
// turn.end on a two-sentence stem in 9 of 12 tries (three output formats), so
// a long question waited ~2.7 s and then fell to the device voice. Niwat read
// the same stem 6 of 6. A short line works in both, which is why a one-word
// probe never showed it.
const VOICE_MAP = {
  th: 'th-TH-NiwatNeural',
  en: 'en-US-AriaNeural',
};

// Own-property lookup only. `lang` is caller-supplied, and a plain index
// also answers for 'constructor' or '__proto__' — with an Object method,
// which then went upstream as the voice name. Anything unknown is Thai.
export function voiceFor(lang) {
  return Object.prototype.hasOwnProperty.call(VOICE_MAP, lang) ? VOICE_MAP[lang] : VOICE_MAP.th;
}
