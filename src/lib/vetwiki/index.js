// ============================================================
// VetWiki — public entry (topic registry + loader + provenance)
// ============================================================
// The one import surface the app uses. The registry AUTO-DERIVES from the
// whole note corpus — every notes-*.js topic with content becomes a governed
// VetWiki topic, so "add a note → it's in the wiki" with zero extra wiring.
// Verified claims stay curated in verification.js; coverage is automatic,
// verification is deliberate.
//
// Knowledge is derived live from the existing note corpus, so there is no
// second source of truth to keep in sync and no migration.
// ============================================================

import { QUESTION_LINKS } from './question-links.generated.js';
import { NOTES_COM5 } from '../../data/notes-com5.js';
import { NOTES_COM4 } from '../../data/notes-com4.js';
import { NOTES_COM3 } from '../../data/notes-com3.js';
import { NOTES_ENGPROF } from '../../data/notes-engprof.js';
import { NOTES_EXOTIC } from '../../data/notes-exotic.js';
import { NOTES_REPRO_LECT } from '../../data/notes-repro-lect.js';
import { NOTES_PRACTRUM } from '../../data/notes-practrum.js';
import { NOTES_POULTRY } from '../../data/notes-poultry.js';
import { NOTES_CLIAPPRUM } from '../../data/notes-cliapprum.js';
import { NOTES_Y5_ZOONOSES } from '../../data/notes-y5-zoonoses.js';
import { NOTES_Y5_MILK_MEAT_HYGIENE } from '../../data/notes-y5-milk-meat-hygiene.js';
import { NOTES_Y5_EQUINE_MEDICINE } from '../../data/notes-y5-equine-medicine.js';
import { NOTES_Y5_EPIDEMIOLOGY } from '../../data/notes-y5-epidemiology.js';
import { NOTES_Y5_AVIAN_MEDICINE } from '../../data/notes-y5-avian-medicine.js';
import { NOTES_Y5_AQUATIC } from '../../data/notes-y5-aquatic.js';
import { NOTES_Y5_ONE_HEALTH } from '../../data/notes-y5-one-health.js';
import { NOTES_Y5_FIQC } from '../../data/notes-y5-fiqc.js';
import { NOTES_Y5_POA } from '../../data/notes-y5-poa.js';
import { NOTES_85_AQUATIC_CLINIC } from '../../data/notes-85-aquatic-clinic.js';
import { NOTES_85_AVIAN_MEDICINE } from '../../data/notes-85-avian-medicine.js';
import { NOTES_85_EQUINE_MEDICINE } from '../../data/notes-85-equine-medicine.js';
import { NOTES_85_EQUINE_REPRO } from '../../data/notes-85-equine-repro.js';
import { NOTES_85_FOOD_INDUSTRY } from '../../data/notes-85-food-industry.js';
import { NOTES_85_MILK_MEAT_HYGIENE } from '../../data/notes-85-milk-meat-hygiene.js';
import { NOTES_85_ONE_HEALTH } from '../../data/notes-85-one-health.js';
import { NOTES_85_POA_CLINICAL } from '../../data/notes-85-poa-clinical.js';
import { NOTES_85_SWINE_CLINIC } from '../../data/notes-85-swine-clinic.js';
import { NOTES_85_ZOONOSES } from '../../data/notes-85-zoonoses.js';
import { NOTES_Y2_NEUROANAT } from '../../data/notes-y2-neuroanat.js';
import { noteToKnowledge, verifiedClaimCount } from './adapter.js';
import { validateTopic } from './validate.js';
import { resolveSource } from './sources.js';
import { EVIDENCE_LABEL, REVIEW_LABEL, wikiTitle, wikiSummary } from './schema.js';

// subject id → its notes module. Mirrors NotesView's NOTES_BY_SUBJECT (kept a
// local copy rather than refactoring the live, actively-edited NotesView).
const NOTES_85_BY_SUBJECT = {
  'aquatic-clinic': NOTES_85_AQUATIC_CLINIC,
  'avian-medicine': NOTES_85_AVIAN_MEDICINE,
  'equine-medicine': NOTES_85_EQUINE_MEDICINE,
  'equine-repro': NOTES_85_EQUINE_REPRO,
  'food-industry': NOTES_85_FOOD_INDUSTRY,
  'milk-meat-hygiene': NOTES_85_MILK_MEAT_HYGIENE,
  'one-health': NOTES_85_ONE_HEALTH,
  'poa-clinical': NOTES_85_POA_CLINICAL,
  'swine-clinic': NOTES_85_SWINE_CLINIC,
  'zoonoses': NOTES_85_ZOONOSES,
};

const NOTES_BY_SUBJECT_BASE = {
  'vet-neuroanat': NOTES_Y2_NEUROANAT,
  com5: NOTES_COM5,
  com4: NOTES_COM4,
  com3: NOTES_COM3,
  engprof: NOTES_ENGPROF,
  exotic: NOTES_EXOTIC,
  'repro-lect': NOTES_REPRO_LECT,
  practrum: NOTES_PRACTRUM,
  poultry: NOTES_POULTRY,
  cliapprum: NOTES_CLIAPPRUM,
  zoonoses: NOTES_Y5_ZOONOSES,
  'milk-meat-hygiene': NOTES_Y5_MILK_MEAT_HYGIENE,
  'equine-medicine': NOTES_Y5_EQUINE_MEDICINE,
  epidemiology: NOTES_Y5_EPIDEMIOLOGY,
  'avian-medicine': NOTES_Y5_AVIAN_MEDICINE,
  'aquatic-clinic': NOTES_Y5_AQUATIC,
  'one-health': NOTES_Y5_ONE_HEALTH,
  'food-industry': NOTES_Y5_FIQC,
  'poa-clinical': NOTES_Y5_POA,
};

// Fold the Vet 85 summaries in so their topics become governed articles too.
// A topic in both keeps the lecture sections first; the senior ones append,
// each still carrying its own source line.
const NOTES_BY_SUBJECT = (() => {
  const out = {};
  for (const k of new Set([...Object.keys(NOTES_BY_SUBJECT_BASE), ...Object.keys(NOTES_85_BY_SUBJECT)])) {
    const own = NOTES_BY_SUBJECT_BASE[k] || {};
    const s85 = NOTES_85_BY_SUBJECT[k] || {};
    const merged = { ...own };
    for (const [id, t] of Object.entries(s85)) {
      merged[id] = merged[id]
        ? { ...merged[id], sections: [...(merged[id].sections || []), ...(t.sections || [])] }
        : t;
    }
    out[k] = merged;
  }
  return out;
})();

const FLAGSHIP = 'com5--rabies';

// ---- Topic registry (auto-derived) ---------------------------------------
// Every topic that has at least one section becomes governed. The note object
// is read by reference (read-only) — no copy, no migration.
const REGISTRY = (() => {
  const rows = [];
  for (const [subject, mod] of Object.entries(NOTES_BY_SUBJECT)) {
    if (!mod || typeof mod !== 'object') continue;
    for (const [topic, note] of Object.entries(mod)) {
      if (!note || !Array.isArray(note.sections) || note.sections.length === 0) continue;
      rows.push({
        subject,
        topic,
        source: () => NOTES_BY_SUBJECT[subject][topic],
        flagship: `${subject}--${topic}` === FLAGSHIP,
      });
    }
  }
  // Flagship first, then a stable code-unit order (locale-independent).
  rows.sort((a, b) => (Number(b.flagship) - Number(a.flagship))
    || (a.subject < b.subject ? -1 : a.subject > b.subject ? 1 : 0)
    || (a.topic < b.topic ? -1 : a.topic > b.topic ? 1 : 0));
  return rows;
})();

export function listTopics() {
  return REGISTRY.map((r) => {
    const note = r.source();
    return {
      id: `${r.subject}--${r.topic}`,
      subject: r.subject,
      topic: r.topic,
      title: wikiTitle(note?.title || r.topic),
      icon: note?.icon || '📄',
      summary: wikiSummary(note?.summary || ''),
      flagship: !!r.flagship,
    };
  });
}

export function hasTopic(subject, topic) {
  return REGISTRY.some((r) => r.subject === subject && r.topic === topic);
}

/** Which governed article a question should send its reader to, or null.
 *
 *  Normally that is the question's own topic. It is not, for anything drawn
 *  from a past-paper compilation: those carry the compilation's name as their
 *  topic ("vca/dogcat", "mahahon-*"), which matches no article, so the reader
 *  gets a question wrong and is offered nothing — while the article they need
 *  already exists. QUESTION_LINKS closes that gap with a judged mapping.
 *
 *  Own topic wins. A derived link is a fallback, never an override. */
export function articleForQuestion(q) {
  if (!q) return null;
  if (hasTopic(q.subject, q.topic)) {
    return { subject: q.subject, topic: q.topic, derived: false };
  }
  const link = QUESTION_LINKS[String(q.id)];
  if (!link || !hasTopic(link.subject, link.topic)) return null;
  return { ...link, derived: true };
}

/** Load a governed KnowledgeTopic (adapter + verification overlay). Returns
 *  null for an unknown/empty topic rather than throwing (UI shows empty state). */
export function loadTopic(subject, topic) {
  const row = REGISTRY.find((r) => r.subject === subject && r.topic === topic);
  if (!row) return null;
  const note = row.source();
  if (!note) return null;
  return noteToKnowledge(subject, topic, note);
}

/** Provenance summary for the read page + "VetMock รู้เรื่องนี้ได้อย่างไร?"
 *  panel. Pure data → the view renders it with vmx-* + Thai labels. */
export function provenanceSummary(knowledgeTopic) {
  if (!knowledgeTopic) return null;
  const sections = knowledgeTopic.sections || [];
  const verified = verifiedClaimCount(knowledgeTopic);
  const draftSections = sections.filter((s) => s.reviewStatus === 'draft').length;
  const metadataSections = sections.filter((s) => s.reviewStatus === 'metadata').length;

  // Distinct external sources actually cited by verified claims.
  const citedIds = new Set();
  for (const s of sections) {
    for (const c of s.claims || []) {
      for (const ref of c.sourceRefs || []) {
        if (resolveSource(ref)) citedIds.add(ref.sourceId);
      }
    }
  }
  const sources = [...citedIds].map((id) => resolveSource({ sourceId: id })).filter(Boolean);

  return {
    sectionCount: sections.length,
    verifiedClaimCount: verified,
    draftSectionCount: draftSections,
    metadataSectionCount: metadataSections,
    sources,
    // Honest one-liner for the UI (no jargon). Three states, told apart:
    // everything verifiable is verified (the corpus norm now) / some
    // sections still pending / nothing verified yet.
    headline: verified > 0 && draftSections === 0
      ? `ทุกจุดความรู้ในหัวข้อนี้ตรวจทานกับแหล่งอ้างอิงภายนอกแล้ว (${verified} จุด)`
      : verified > 0
        ? `เนื้อหามาจากโน้ตเลกเชอร์, ${verified} จุดตรวจทานกับแหล่งอ้างอิงภายนอกแล้ว, อีก ${draftSections} หัวข้อรอตรวจ`
        : 'เนื้อหามาจากโน้ตเลกเชอร์, ยังไม่ได้ตรวจทานกับแหล่งอ้างอิงภายนอก',
  };
}

export { validateTopic, resolveSource, EVIDENCE_LABEL, REVIEW_LABEL };
export { verificationFor } from './verification.js';
