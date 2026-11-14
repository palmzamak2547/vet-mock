// A wrap-up keyword written "Term — what it is" or "Term: what it is" leads
// with the term, so the page can set the term apart from its explanation and
// the eye lands on it first. Split at the FIRST separator only: a later dash
// or colon belongs to the explanation. A line without the shape returns null
// and is rendered exactly as written.
//
// A colon only counts with a space after it ("Stool pH: bacteria > 7"), so a
// clock time ("13:00") or a ratio ("1:2") is never a term. The part before it
// must read as a term, not a clause: at most TERM_MAX characters and no
// bracket left open ("2 Public Health (บทบาท 4: ..." stays whole).
export const TERM_MAX = 60;
const SEPARATORS = [' — ', ': '];

export function keyTerm(line) {
  const s = String(line ?? '');
  let at = -1;
  let sep = '';
  for (const candidate of SEPARATORS) {
    const i = s.indexOf(candidate);
    if (i > 0 && (at < 0 || i < at)) { at = i; sep = candidate; }
  }
  if (at <= 0) return null;
  const term = s.slice(0, at);
  const rest = s.slice(at + sep.length);
  if (!rest.trim() || !term.trim()) return null;
  if (sep === ': ' && term.length > TERM_MAX) return null;
  if ((term.match(/\(/g) || []).length !== (term.match(/\)/g) || []).length) return null;
  return { term, sep, rest };
}
