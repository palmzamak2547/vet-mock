// ============================================================
// lecturer-count — how many questions a lecturer-practice start serves
// ============================================================
// One rule for every button that opens practice on a lecturer's topics: the
// lecturer card on the topic screen (LecturerSets) and the per-item button
// on the wrap-up page (WrapUpView). The wrap-up once read the format's cell
// alone, so a lecturer whose format is 'all' (no such cell) and a disease
// covered only by a matching set filed under another topic both showed no
// button, while the session would have served them questions.
//
// `kindTable` is one subject's row of Q_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE:
// { [topicId]: { mcq, tf, match, writing, _matchCovers? } }.
// ============================================================

/**
 * Questions of `kind` across `topicIds`. 'all' sums every kind. With
 * `covers`, a matching set filed under another topic whose bank names this
 * one counts too (a deck cover, a single topic); a lecturer's whole-part
 * button leaves it out, or one set spanning five decks would count five times.
 */
export function lecturerCount(kindTable, topicIds, kind, { covers = false } = {}) {
  const table = kindTable || {};
  return (topicIds || []).reduce((sum, id) => {
    const row = table[id] || {};
    if (kind === 'all') return sum + Object.entries(row).reduce((a, [k, v]) => (k.startsWith('_') ? a : a + (Number(v) || 0)), 0);
    return sum + (Number(row[kind]) || 0) + (covers && kind === 'match' ? (Number(row._matchCovers) || 0) : 0);
  }, 0);
}

/**
 * What one practice button on a topic (or deck) serves: the lecturer's own
 * format when it has questions there, otherwise every format together.
 * Returns { format, count, fellBack }; count 0 means no button.
 */
export function topicPractice(kindTable, topicIds, format) {
  const inFormat = lecturerCount(kindTable, topicIds, format, { covers: true });
  if (inFormat > 0 || format === 'all') return { format, count: inFormat, fellBack: false };
  const inAny = lecturerCount(kindTable, topicIds, 'all');
  return { format: 'all', count: inAny, fellBack: inAny > 0 };
}
