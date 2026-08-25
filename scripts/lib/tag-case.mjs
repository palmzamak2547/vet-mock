// One spelling per idea, or a student's search returns half the questions.
//
// Twenty agents tagging in parallel produced "Staphylococcus-aureus" in one
// batch and "staphylococcus-aureus" in another. That is the failure worth
// fixing — and ONLY that one.
//
// A first version lowercased every tag whose only capital was its first letter.
// It was wrong: "Tm", "A260", "Rf-value", "X-gal" and "N-glycosidic-bond" all
// carry a leading capital that is notation, not habit, and flattening them
// loses meaning while fixing nothing — none of them had a competing spelling.
//
// So: change a tag only when the corpus actually holds two spellings of it, and
// change it to whichever spelling is already the more common. Everything with a
// single spelling is left exactly as written.

/** Build a resolver from every tag in play. */
export function buildTagResolver(allTags) {
  const byKey = new Map();
  for (const t of allTags) {
    const k = String(t).toLowerCase();
    if (!byKey.has(k)) byKey.set(k, new Map());
    const m = byKey.get(k);
    m.set(t, (m.get(t) || 0) + 1);
  }
  const winner = new Map();
  for (const [k, spellings] of byKey) {
    if (spellings.size < 2) continue;                        // no conflict, leave alone
    // Most used wins. On a tie, prefer the form carrying more capitals: a
    // short tag spelled two ways is usually an abbreviation somebody typed in
    // lower case once, and NE reads as net energy where ne reads as nothing.
    const caps = (t) => (String(t).match(/[A-Z]/g) || []).length;
    const best = [...spellings].sort((a, b) => b[1] - a[1] || caps(b[0]) - caps(a[0]) || a[0].localeCompare(b[0]))[0][0];
    winner.set(k, best);
  }
  return {
    resolve: (t) => winner.get(String(t).toLowerCase()) ?? t,
    conflicts: winner,
  };
}
