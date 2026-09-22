// Browser-only full-text search. The Wiki index imports this module on demand,
// once someone starts typing. The canonical synchronous search remains
// available to scripts and tests.
//
// It reads a prebuilt text index, one data chunk per subject
// (search-index-subject-*.generated.js, written by npm run regen:wiki-runtime).
// It used to build that text itself: the first word typed imported every
// subject's note chunk and evidence chunk and adapted every article, about
// 1.8 MB compressed and 27 MB of memory, on the phone's main thread. The index
// holds exactly the text that pass produced, so the results are unchanged;
// tests/unit/wiki-search-parity.test.mjs keeps the old pass as the oracle.
import { listTopics } from './registry.js';
import { loadSearchIndex } from './search-index-loaders.generated.js';

const normalize = (value) => String(value || '')
  .replace(/\*\*/g, '')
  .replace(/\*/g, '')
  .toLocaleLowerCase();

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

// A factory so tests can hand in a loader that fails; the app uses the
// default instance below.
export function createSearchTopics(loadIndex = loadSearchIndex) {
  // One in-flight promise per subject, shared by every article in it and by
  // searches that overlap. A rejected one is evicted so the next search asks
  // again (STABILITY 0.3 retry invariant).
  const subjects = new Map();
  function subjectIndex(subject) {
    if (!subjects.has(subject)) {
      const pending = Promise.resolve()
        .then(() => loadIndex(subject))
        .catch((error) => {
          subjects.delete(subject);
          throw error;
        });
      subjects.set(subject, pending);
    }
    return subjects.get(subject);
  }

  // Rows are [section id, heading, text], the text already stripped of
  // emphasis markers and lower-cased by the generator. They are read in place:
  // a normalised copy would double the text a phone holds.
  async function indexTopic(topic) {
    const index = await subjectIndex(topic.subject);
    return index && hasOwn(index, topic.id) ? index[topic.id] : null;
  }

  return async function searchTopics(query) {
    const normalized = normalize(query).trim();
    const topics = listTopics();
    if (!normalized) {
      return topics.map((topic) => ({ topic, matchedSections: [], inTitle: false }));
    }

    // One subject chunk failing must not fail the search. Promise.all rejected
    // the whole thing, and the caller's catch then quietly fell back to
    // title-and-summary matches — so an incomplete search was presented as a
    // complete one that simply found less. The failures are counted instead, and
    // reported to the caller so it can say the search was partial.
    // Count SUBJECTS, not articles. indexTopic loads one chunk per subject, so a
    // single failed chunk rejects once for every article in it — counting those
    // rejections told the student "ค้นไม่ครบ 24 วิชา" when one subject had failed
    // and VetWiki only has 21 subjects in total.
    const failedSubjects = new Set();
    const indexed = await Promise.all(topics.map(async (topic) => ({
      topic,
      index: await indexTopic(topic).catch(() => { failedSubjects.add(topic.subject); return null; }),
    })));
    const results = [];
    for (const { topic, index } of indexed) {
      if (!index) continue;
      const inTitle = normalize(topic.title).includes(normalized)
        || normalize(topic.summary).includes(normalized);
      const matchedSections = index
        .filter(([, , text]) => text.includes(normalized))
        .map(([id, heading]) => ({ id, heading }));
      if (inTitle || matchedSections.length > 0) {
        results.push({ topic, matchedSections, inTitle });
      }
    }
    results.sort((a, b) => (Number(b.inTitle) - Number(a.inTitle))
      || (b.matchedSections.length - a.matchedSections.length));
    // Non-enumerable so the array still deep-equals a plain array: a test
    // asserting `deepEqual(await searchTopics(...), [])` must keep passing, and
    // callers that ignore this are unaffected.
    Object.defineProperty(results, 'incompleteSubjects', { value: failedSubjects.size });
    return results;
  };
}

export const searchTopics = createSearchTopics();
