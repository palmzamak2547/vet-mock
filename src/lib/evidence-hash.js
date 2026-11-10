// What a slide was matched to: the question's stem and its key, as text.
// scripts/evidence/build.mjs stores this hash beside each slide it files, and
// the card shows the slide only while the question still hashes the same. A
// stem or a key edited later hides its slide until it is matched again, so a
// student never sees a highlight that belongs to an older wording.

/** The key as the student reads it: the correct option, ถูก or ผิด, or the model answer. */
export function keyText(q) {
  if (!q) return '';
  if (q.type === 'tf') return typeof q.answer === 'boolean' ? (q.answer ? 'ถูก' : 'ผิด') : '';
  if (Array.isArray(q.options) && typeof q.answer === 'number') return String(q.options[q.answer] ?? '');
  return typeof q.model_answer === 'string' ? q.model_answer : '';
}

/** FNV-1a over the stem and the key, eight hex characters. */
export function evidenceHash(q) {
  const text = `${String(q?.q ?? '').normalize('NFC')}\u0001${keyText(q).normalize('NFC')}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}
