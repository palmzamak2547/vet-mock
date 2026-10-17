// Search over question text. Thai has no case and no spaces between words, so a query is cut
// only where the student typed spaces, and every piece must appear somewhere in the question:
// its stem, an option, the explanation or the source.

const MARKS = /[*`_]+/g;

export function normalize(text) {
  return String(text || '').normalize('NFC').toLowerCase().replace(MARKS, '').replace(/\s+/g, ' ').trim();
}

export function terms(query) {
  return normalize(query).split(' ').filter(Boolean);
}

export function haystack(q) {
  return normalize([q.q, ...(q.options || []), q.explain, q.source, q.origin, q.id].join(' '));
}

/**
 * @param {Array} questions
 * @param {string} query
 * @param {WeakMap} [cache] haystacks kept between keystrokes
 */
export function searchQuestions(questions, query, cache) {
  const parts = terms(query);
  if (!parts.length) return questions;
  return questions.filter((q) => {
    let text = cache?.get(q);
    if (text === undefined) {
      text = haystack(q);
      cache?.set(q, text);
    }
    return parts.every((p) => text.includes(p));
  });
}

export function searchDocs(docs, query) {
  const parts = terms(query);
  if (!parts.length) return docs;
  return docs.filter((d) => {
    const text = normalize(`${d.title} ${d.shelfName || ''}`);
    return parts.every((p) => text.includes(p));
  });
}
