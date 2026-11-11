// What a matching question's stem shows on the card.
//
// 26 matching stems were written for a drag board and still end
// "(ลากการ์ดขวาไปวาง)", while the card draws one menu per row on every
// screen. The stems stay as they are, because the read-aloud clip is named
// by the text and the answer slide by its hash (wholeStem reads q.q), so
// only the card's display drops that exact clause. "มีตัวลวง 2 ตัว" is a fact
// about the set and stays. Any other wording is left alone.
const DRAG_ONLY = /\s*\(ลากการ์ดขวาไปวาง\)/g;
const DRAG_WITH_NOTE = /\(ลากการ์ดขวาไปวาง\s*(?:—\s*)?(มีตัวลวง[^()]*)\)/g;

export function displayStem(q) {
  const text = String(q?.q ?? '');
  if (q?.type !== 'match') return text;
  return text.replace(DRAG_WITH_NOTE, '($1)').replace(DRAG_ONLY, '');
}
