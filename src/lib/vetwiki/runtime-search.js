// Browser-only full-text search. The Wiki index imports this module on demand,
// then the governed note bodies are loaded per subject through runtime.js.
// The canonical synchronous search remains available to scripts and tests.
import { listTopics, loadTopic } from './runtime.js';

function flattenBody(body, out = []) {
  for (const item of body || []) {
    if (typeof item === 'string') { out.push(item); continue; }
    if (!item || typeof item !== 'object') continue;
    if (item.bullets) {
      for (const bullet of item.bullets) {
        out.push(typeof bullet === 'string' ? bullet : `${bullet.label} ${bullet.value}`);
      }
    }
    if (item.sub) { out.push(item.sub); flattenBody(item.body, out); }
    if (item.callout) out.push(item.callout);
    if (item.table) {
      for (const heading of item.table.headers || []) out.push(heading);
      for (const row of item.table.rows || []) for (const cell of row) out.push(cell);
    }
  }
  return out;
}

const normalize = (value) => String(value || '')
  .replace(/\*\*/g, '')
  .replace(/\*/g, '')
  .toLocaleLowerCase();

const cache = new Map();

async function indexTopic(topic) {
  if (cache.has(topic.id)) return cache.get(topic.id);
  const knowledge = await loadTopic(topic.subject, topic.topic);
  if (!knowledge) return null;
  const entry = {
    sections: knowledge.sections.map((section) => ({
      id: section.id,
      heading: section.heading,
      text: normalize([
        section.heading,
        ...flattenBody(section.body),
        ...(section.claims || []).map((claim) => claim.statement),
      ].join(' \n ')),
    })),
  };
  cache.set(topic.id, entry);
  return entry;
}

export async function searchTopics(query) {
  const normalized = normalize(query).trim();
  const topics = listTopics();
  if (!normalized) {
    return topics.map((topic) => ({ topic, matchedSections: [], inTitle: false }));
  }

  const indexed = await Promise.all(topics.map(async (topic) => ({
    topic,
    index: await indexTopic(topic),
  })));
  const results = [];
  for (const { topic, index } of indexed) {
    if (!index) continue;
    const inTitle = normalize(topic.title).includes(normalized)
      || normalize(topic.summary).includes(normalized);
    const matchedSections = index.sections
      .filter((section) => section.text.includes(normalized))
      .map((section) => ({ id: section.id, heading: section.heading }));
    if (inTitle || matchedSections.length > 0) {
      results.push({ topic, matchedSections, inTitle });
    }
  }
  results.sort((a, b) => (Number(b.inTitle) - Number(a.inTitle))
    || (b.matchedSections.length - a.matchedSections.length));
  return results;
}
