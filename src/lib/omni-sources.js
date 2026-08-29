// ============================================================
// omni-sources.js — async sources for the AI Search overlay
// ============================================================
// CommandPalette's static index (features, subjects, exams, videos,
// faculty, questions, wiki, flashcards, notes) is built synchronously from
// bundled data. These sources are the ones that live OUTSIDE the bundle
// and arrive while the palette is already open — the UI streams them in
// group by group, which is most of what makes it feel like an AI search
// instead of a filter box.
//
//   library — the 1,496-doc course shelf, straight from Supabase. The
//             entries carry the full row so a hit can open the PDF
//             reader directly, not just navigate to the shelf.
//   drugs   — the 57-drug dose database. Small, but it lives in the
//             calculator's chunk, not the palette's, so it loads the
//             same lazy way.
//
// Each source caches per session and drops its cache on the same
// 'vmx-palette-invalidate' event the static index listens to, so the
// search always follows the data without anyone maintaining an index.

import { getLibraryCatalog, subjectMeta, formatBytes } from './library.js';

const cache = new Map(); // sourceId → entries[]

if (typeof window !== 'undefined') {
  window.addEventListener('vmx-palette-invalidate', () => cache.clear());
}

function lowered(entry) {
  const labelLc = (entry.label || '').toLowerCase();
  return { ...entry, _labelLc: labelLc, _hayLc: labelLc + ' ' + (entry.kw || '').toLowerCase() };
}

/** Pure mapper — exported for tests. */
export function libraryDocEntry(doc) {
  const meta = subjectMeta(doc.subject);
  const subjectName = meta?.name || doc.subject || '';
  const hint = [
    subjectName,
    doc.year != null ? `ปี ${doc.year}` : null,
    doc.description || null,
    formatBytes(doc.byte_size) || null,
  ].filter(Boolean).join(', ');
  return lowered({
    type: 'library-doc',
    payload: doc,
    label: doc.title,
    hint,
    icon: meta?.icon || '📄',
    kw: [subjectName, meta?.name_en, meta?.code, doc.subject, doc.description, 'library เอกสาร คลัง ชีท สไลด์']
      .filter(Boolean).join(' '),
  });
}

export function drugEntry(drug) {
  return lowered({
    type: 'drug',
    payload: { id: drug.id },
    label: drug.generic,
    hint: [drug.category, drug.indication].filter(Boolean).join(', '),
    icon: '💊',
    kw: [drug.generic, drug.brand, drug.category, drug.indication, 'drug dose ยา ขนาดยา']
      .filter(Boolean).join(' '),
  });
}

export const OMNI_SOURCES = [
  {
    id: 'library',
    label: 'คลังเอกสาร',
    icon: '📚',
    async load() {
      if (cache.has('library')) return cache.get('library');
      // fetchLibraryDocs resolves { docs, configured } — the same contract
      // LibraryView consumes (and the .map-on-an-object TypeError that
      // shipped as "ออฟไลน์" the first time this assumed a bare array).
      const { docs } = await getLibraryCatalog();
      const entries = (docs || []).map(libraryDocEntry);
      cache.set('library', entries);
      return entries;
    },
  },
  {
    id: 'drugs',
    label: 'ขนาดยา',
    icon: '💊',
    async load() {
      if (cache.has('drugs')) return cache.get('drugs');
      const { VET_DRUGS } = await import('../data/vet-drug-database.js');
      const entries = VET_DRUGS.map(drugEntry);
      cache.set('drugs', entries);
      return entries;
    },
  },
];
