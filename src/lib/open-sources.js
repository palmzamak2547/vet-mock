// ============================================================
// open-sources.js — study library sources from outside Chula
// ============================================================
// The registry is src/data/library-open-sources.js. Two kinds of entry:
// - `hosted: '<slug>'`: the licence lets VetMock keep a copy, so the file is a
//   library_docs row like any other (R2, the in-app reader, search inside);
//   this module only gives that row its source label.
// - no `hosted`: free to read but not ours to copy. The card opens the
//   publisher's own page in a new tab (storage_provider 'external').
import { SUBJECTS_BY_YEAR } from '../data/curriculum.js';

export const OPEN_TIERS = Object.freeze({
  official: 'แนวทางจากหน่วยงานทางการ',
  'peer-reviewed': 'บทความผ่านการทบทวน',
  'open-textbook': 'ตำราเปิด',
  reference: 'ตำราอ้างอิง',
  community: 'แหล่งชุมชน',
});

// Every licence id the registry may use; a unit test fails on any other.
export const OPEN_LICENSES = Object.freeze({
  'CC-BY-4.0': 'CC BY 4.0',
  'CC-BY-SA-4.0': 'CC BY-SA 4.0',
  'CC-BY-NC-4.0': 'CC BY-NC 4.0',
  'CC-BY-NC-SA-3.0-IGO': 'CC BY-NC-SA 3.0 IGO',
  'CC-BY-NC-SA-4.0': 'CC BY-NC-SA 4.0',
  'CC-BY-NC-ND-4.0': 'CC BY-NC-ND 4.0',
  'CC0-1.0': 'CC0',
  'public-domain-us-gov': 'สาธารณสมบัติ (งานของรัฐบาลสหรัฐฯ)',
  'publisher-noncommercial-permission': 'ผู้จัดพิมพ์อนุญาตให้เผยแพร่เพื่อการศึกษา',
  'all-rights-reserved': 'สงวนลิขสิทธิ์ อ่านฟรีที่เว็บต้นทาง',
  'not-stated': 'อ่านฟรีที่เว็บต้นทาง',
});

const PLACE = new Map(Object.entries(SUBJECTS_BY_YEAR)
  .flatMap(([year, list]) => list.map((s) => [s.id, { year: Number(year), semester: s.semester ?? null }])));

/** The address a link card may open: https only, else null. */
export function openSourceUrl(raw) {
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

/** "WHO 2018, แนวทางจากหน่วยงานทางการ, CC BY-NC-SA 3.0 IGO" */
export function openSourceLine(entry) {
  return [entry.year ? `${entry.org} ${entry.year}` : entry.org, OPEN_TIERS[entry.tier], OPEN_LICENSES[entry.license]]
    .filter(Boolean).join(', ');
}

/** Link entries as shelf rows. Hosted entries are already rows (see withOpenLabels). */
export function openSourceDocs(entries) {
  return entries.filter((e) => !e.hosted).map((e) => ({
    id: `open-${e.id}`, slug: `open-${e.id}`, title: e.title, description: e.description,
    kind: e.kind, subject: e.subject, year: PLACE.get(e.subject)?.year ?? null,
    semester: PLACE.get(e.subject)?.semester ?? null, academic_year: null, cohort: null,
    lecturer: null, topics: e.topics || [], sequence: 0,
    storage_provider: 'external', external_url: e.url, mime: 'text/html',
    byte_size: null, page_count: null, sha256_16: null, linearized: false,
    attribution: e.org, status: 'public', open: e,
  }));
}

/** The hosted rows, each with its registry entry as `open` (the label on its card). */
export function withOpenLabels(docs, entries) {
  const bySlug = new Map(entries.filter((e) => e.hosted).map((e) => [e.hosted, e]));
  return docs.map((doc) => (bySlug.has(doc.slug) ? { ...doc, open: bySlug.get(doc.slug) } : doc));
}
