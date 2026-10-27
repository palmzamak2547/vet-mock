// User-perceived characters. A Thai syllable's vowel and tone marks stay with
// their consonant (น้ำ is one piece, not four), so text can be typed or
// scrambled piece by piece without ever showing a floating mark.
const seg = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('th', { granularity: 'grapheme' }) : null;

export const graphemes = (s) => (seg ? Array.from(seg.segment(String(s)), (x) => x.segment) : Array.from(String(s)));
