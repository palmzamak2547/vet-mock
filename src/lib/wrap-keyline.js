// A wrap-up list line written "Term — what it is" leads with the term, so
// the page can set the term apart from its explanation. Split at the FIRST
// " — " only: a second dash belongs to the explanation. A line without the
// shape returns null and is rendered exactly as written.
export function keyTerm(line) {
  const s = String(line ?? '');
  const at = s.indexOf(' — ');
  if (at <= 0) return null;
  return { term: s.slice(0, at), rest: s.slice(at + 3) };
}
