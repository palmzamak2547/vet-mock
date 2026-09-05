// ============================================================
// agent-actions.js — the action catalog and its validator
// ============================================================
// The agentic layer's rule is the same one the citation layer proved out:
// the model never EXECUTES anything and never invents identifiers — it only
// PICKS from a catalog built from the app's real data, and the validator
// re-grounds every field before anything reaches the client. An action the
// catalog does not carry cannot come back from this module, whatever the
// model wrote.
//
// Pure functions — the endpoint composes them, the unit tests call them.

import { SUBJECTS } from '../../src/data/curriculum.js';
import { FEATURES } from '../../src/lib/feature-registry.js';
import { listTopics } from '../../src/lib/vetwiki/registry.js';

/** What the agent may do, derived live from app data. */
export function buildCatalog() {
  return {
    // Subjects a practice session can actually serve.
    practiceSubjects: SUBJECTS
      .filter((s) => s.id === 'all' || s.has_questions)
      .map((s) => ({ id: s.id, name: s.name, name_en: s.name_en || '', code: s.code || '' })),
    // Every subject can open its library shelf (the shelf itself answers
    // whether it holds documents).
    librarySubjects: SUBJECTS
      .filter((s) => s.id !== 'all')
      .map((s) => ({ id: s.id, name: s.name })),
    // Governed wiki articles.
    wikiTopics: listTopics().map((t) => ({ subject: t.subject, topic: t.topic, title: t.title })),
    // Navigable features (the palette's own dispatch handles these).
    features: FEATURES.map((f) => ({ id: f.id, label: f.label, hint: f.hint || '', kw: f.kw || '' })),
  };
}

const clampInt = (v, lo, hi, dflt) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : dflt;
};

/**
 * Re-ground a model-proposed action against the catalog.
 * @returns {{ ok: true, action: object, say: string } | { ok: false, reason: string }}
 */
export function validateAction(parsed, catalog = buildCatalog()) {
  const type = String(parsed?.type || '');
  const p = parsed?.params || {};
  const say = String(parsed?.say || '').slice(0, 200);

  if (type === 'practice') {
    const subject = catalog.practiceSubjects.find((s) => s.id === String(p.subject));
    if (!subject) return { ok: false, reason: 'unknown practice subject' };
    const numQuestions = clampInt(p.numQuestions, 5, 50, 10);
    const useTimer = p.useTimer === true;
    const timePerQ = useTimer ? clampInt(p.timePerQ, 20, 300, 60) : undefined;
    return {
      ok: true,
      say: say || `เปิดชุดฝึก ${subject.name} ${numQuestions} ข้อ${useTimer ? ` จับเวลา ${timePerQ} วิ/ข้อ` : ''}`,
      action: {
        type: 'practice',
        invoke: {
          kind: 'practice', mode: useTimer ? 'exam' : 'quick', subject: subject.id,
          practiceMode: 'all', numQuestions,
          ...(useTimer ? { useTimer: true, timePerQ } : {}),
        },
        subjectName: subject.name,
      },
    };
  }

  if (type === 'library') {
    const subject = catalog.librarySubjects.find((s) => s.id === String(p.subject));
    if (!subject) return { ok: false, reason: 'unknown library subject' };
    return {
      ok: true,
      say: say || `เปิดชั้นเอกสารวิชา ${subject.name}`,
      // The id rides along so the palette can use the exact-subject shelf
      // hand-off every subject card uses; the name alone, typed into the
      // search box, also matches sibling subjects whose name contains it.
      action: { type: 'library', subject: subject.id, subjectName: subject.name },
    };
  }

  if (type === 'wiki') {
    const topic = catalog.wikiTopics.find((t) => t.subject === String(p.subject) && t.topic === String(p.topic));
    if (!topic) return { ok: false, reason: 'unknown wiki topic' };
    return {
      ok: true,
      say: say || `เปิดบทความ ${topic.title}`,
      action: { type: 'wiki', subject: topic.subject, topic: topic.topic, title: topic.title },
    };
  }

  if (type === 'feature') {
    const feature = catalog.features.find((f) => f.id === String(p.id));
    if (!feature) return { ok: false, reason: 'unknown feature' };
    return {
      ok: true,
      say: say || `เปิด ${feature.label}`,
      action: { type: 'feature', id: feature.id, label: feature.label },
    };
  }

  if (type === 'none') {
    return { ok: false, reason: String(p.reason || 'no matching action').slice(0, 200) };
  }

  return { ok: false, reason: `unknown action type ${type.slice(0, 40)}` };
}
