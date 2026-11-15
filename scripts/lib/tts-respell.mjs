// What a recorded clip's voice is sent in place of the clip text, where the
// voice reads a spelling wrong. The clip keeps its name (the hash of the clip
// text) and a student only ever sees the card's own text: this changes only
// the sound. The voice has no pronunciation dictionary, so spelling is the
// lever. Found by transcribing clips back (16 Nov 2026): an acronym said as a
// word ("APP" as "แอป"), so capitals are spelled letter by letter.
// Used by scripts/tts-clips.mjs; tests/unit/tts-respell.test.mjs.

// Acronyms said as a word in class, kept whole.
const AS_WORDS = new Set(['COVID', 'HACCP', 'WOAH', 'NASA', 'AIDS', 'SARS', 'MERS']);

export function respell(text) {
  return String(text)
    // A run of 2 to 5 capitals (digits allowed after the first letter) standing alone: letter by letter.
    .replace(/(^|[^A-Za-z0-9])([A-Z][A-Z0-9]{1,4})(?![A-Za-z0-9])/g, (m, pre, word) => {
      if (AS_WORDS.has(word) || !/[A-Z].*[A-Z]/.test(word)) return m;
      return pre + word.split('').join(' ');
    });
}
