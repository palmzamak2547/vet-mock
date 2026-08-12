// Browser runtime for VetWiki. Discovery stays metadata-only; note bodies and
// the correction/verification adapter load only after an article is opened.
import { listTopics } from './registry.js';
import { EVIDENCE_LABEL, REVIEW_LABEL } from './schema.js';
import { loadRuntimeData } from './runtime-data.generated.js';

// Grow this cache as subjects are opened/searched. It avoids a global source
// corpus while remaining safe when several subject chunks load concurrently.
const loadedSources = new Map();

const LOADERS = {
  com5: async () => [(await import('../../data/notes-com5.js')).NOTES_COM5],
  com4: async () => [(await import('../../data/notes-com4.js')).NOTES_COM4],
  com3: async () => [(await import('../../data/notes-com3.js')).NOTES_COM3],
  engprof: async () => [(await import('../../data/notes-engprof.js')).NOTES_ENGPROF],
  exotic: async () => [(await import('../../data/notes-exotic.js')).NOTES_EXOTIC],
  'repro-lect': async () => [(await import('../../data/notes-repro-lect.js')).NOTES_REPRO_LECT],
  practrum: async () => [(await import('../../data/notes-practrum.js')).NOTES_PRACTRUM],
  poultry: async () => [(await import('../../data/notes-poultry.js')).NOTES_POULTRY],
  cliapprum: async () => [(await import('../../data/notes-cliapprum.js')).NOTES_CLIAPPRUM],
  zoonoses: async () => {
    const [base, senior] = await Promise.all([
      import('../../data/notes-y5-zoonoses.js'),
      import('../../data/notes-85-zoonoses.js'),
    ]);
    return [base.NOTES_Y5_ZOONOSES, senior.NOTES_85_ZOONOSES];
  },
  'milk-meat-hygiene': async () => {
    const [base, senior] = await Promise.all([
      import('../../data/notes-y5-milk-meat-hygiene.js'),
      import('../../data/notes-85-milk-meat-hygiene.js'),
    ]);
    return [base.NOTES_Y5_MILK_MEAT_HYGIENE, senior.NOTES_85_MILK_MEAT_HYGIENE];
  },
  'equine-medicine': async () => {
    const [base, senior] = await Promise.all([
      import('../../data/notes-y5-equine-medicine.js'),
      import('../../data/notes-85-equine-medicine.js'),
    ]);
    return [base.NOTES_Y5_EQUINE_MEDICINE, senior.NOTES_85_EQUINE_MEDICINE];
  },
  epidemiology: async () => [(await import('../../data/notes-y5-epidemiology.js')).NOTES_Y5_EPIDEMIOLOGY],
  'avian-medicine': async () => {
    const [base, senior] = await Promise.all([
      import('../../data/notes-y5-avian-medicine.js'),
      import('../../data/notes-85-avian-medicine.js'),
    ]);
    return [base.NOTES_Y5_AVIAN_MEDICINE, senior.NOTES_85_AVIAN_MEDICINE];
  },
  'aquatic-clinic': async () => {
    const [base, senior] = await Promise.all([
      import('../../data/notes-y5-aquatic.js'),
      import('../../data/notes-85-aquatic-clinic.js'),
    ]);
    return [base.NOTES_Y5_AQUATIC, senior.NOTES_85_AQUATIC_CLINIC];
  },
  'one-health': async () => {
    const [base, senior] = await Promise.all([
      import('../../data/notes-y5-one-health.js'),
      import('../../data/notes-85-one-health.js'),
    ]);
    return [base.NOTES_Y5_ONE_HEALTH, senior.NOTES_85_ONE_HEALTH];
  },
  'food-industry': async () => {
    const [base, senior] = await Promise.all([
      import('../../data/notes-y5-fiqc.js'),
      import('../../data/notes-85-food-industry.js'),
    ]);
    return [base.NOTES_Y5_FIQC, senior.NOTES_85_FOOD_INDUSTRY];
  },
  'poa-clinical': async () => {
    const [base, senior] = await Promise.all([
      import('../../data/notes-y5-poa.js'),
      import('../../data/notes-85-poa-clinical.js'),
    ]);
    return [base.NOTES_Y5_POA, senior.NOTES_85_POA_CLINICAL];
  },
  'equine-repro': async () => [(await import('../../data/notes-85-equine-repro.js')).NOTES_85_EQUINE_REPRO],
  'swine-clinic': async () => [(await import('../../data/notes-85-swine-clinic.js')).NOTES_85_SWINE_CLINIC],
};

const subjectCache = new Map();

async function loadSubject(subject) {
  if (!LOADERS[subject]) return [];
  if (!subjectCache.has(subject)) {
    const pending = LOADERS[subject]().catch((error) => {
      // A transient chunk/network failure must not poison every later retry.
      subjectCache.delete(subject);
      throw error;
    });
    subjectCache.set(subject, pending);
  }
  return subjectCache.get(subject);
}

function mergeTopic(sources, topic) {
  let merged = null;
  for (const source of sources) {
    const note = source?.[topic];
    if (!note) continue;
    merged = merged
      ? { ...merged, sections: [...(merged.sections || []), ...(note.sections || [])] }
      : note;
  }
  return merged;
}

export async function loadTopic(subject, topic) {
  const sources = await loadSubject(subject);
  const note = mergeTopic(sources, topic);
  if (!note) return null;
  const [{ noteToKnowledge }, runtimeData] = await Promise.all([
    import('./runtime-adapter.js'),
    loadRuntimeData(subject),
  ]);
  for (const [id, source] of Object.entries(runtimeData.SOURCES || {})) {
    loadedSources.set(id, source);
  }
  return noteToKnowledge(
    subject,
    topic,
    note,
    runtimeData.OVERLAYS?.[`${subject}--${topic}`] || {},
    runtimeData.CORRECTIONS || {},
  );
}

export function resolveSource(ref) {
  return ref ? loadedSources.get(ref.sourceId) || null : null;
}

function verifiedClaimCount(knowledgeTopic) {
  return (knowledgeTopic?.sections || []).reduce(
    (total, section) => total + (section.claims || []).length,
    0,
  );
}

export function provenanceSummary(knowledgeTopic) {
  if (!knowledgeTopic) return null;
  const sections = knowledgeTopic.sections || [];
  const verified = verifiedClaimCount(knowledgeTopic);
  const draftSections = sections.filter((section) => section.reviewStatus === 'draft').length;
  const citedIds = new Set();
  for (const section of sections) {
    for (const claim of section.claims || []) {
      for (const ref of claim.sourceRefs || []) {
        if (resolveSource(ref)) citedIds.add(ref.sourceId);
      }
    }
  }
  const sources = [...citedIds].map((id) => resolveSource({ sourceId: id })).filter(Boolean);
  return {
    sectionCount: sections.length,
    verifiedClaimCount: verified,
    draftSectionCount: draftSections,
    sources,
    headline: verified > 0
      ? `เนื้อหาส่วนใหญ่มาจากโน้ตเลกเชอร์, ${verified} จุดตรวจทานกับแหล่งอ้างอิงภายนอกแล้ว`
      : 'เนื้อหามาจากโน้ตเลกเชอร์, ยังไม่ได้ตรวจทานกับแหล่งอ้างอิงภายนอก',
  };
}

export { listTopics, EVIDENCE_LABEL, REVIEW_LABEL };
