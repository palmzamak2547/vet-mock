// ============================================================
// VetWiki — external source registry
// ============================================================
// Stable, real, verifiable veterinary sources that VetWiki claims cite.
//
// ⛔ IRON RULE 0: every entry here is a REAL source. Do NOT add a source,
// author, journal, volume, page, DOI, or URL that has not been verified.
// `availability`:
//   'verified-online'  = the citation (and URL where present) was confirmed
//                        against the live source during authoring.
//   'named'            = a real, well-known reference we name for attribution
//                        but do NOT link/quote a specific passage from (so we
//                        never fabricate a locator we haven't checked).
// A missing URL is honest — better no link than a guessed one.
// ============================================================

/** @typedef {import('./schema.js').SourceRef} SourceRef */

/**
 * @typedef {Object} Source
 * @property {string} id
 * @property {string} title
 * @property {string} organization
 * @property {'guideline'|'textbook'|'primary-literature'|'lecture-note'} kind
 * @property {number} [year]
 * @property {string} [edition]
 * @property {string} [citation]     human-readable full citation
 * @property {string} [url]          ONLY when verified
 * @property {'verified-online'|'named'} availability
 */

/** @type {Record<string, Source>} */
export const SOURCES = {
  'woah-tahm-rabies': {
    id: 'woah-tahm-rabies',
    title: 'Manual of Diagnostic Tests and Vaccines for Terrestrial Animals — Chapter 3.1.18 Rabies (Infection with rabies virus and other lyssaviruses)',
    organization: 'WOAH (World Organisation for Animal Health)',
    kind: 'guideline',
    year: 2023,
    citation: 'WOAH. Terrestrial Manual, Chapter 3.1.18 — Rabies. 2023.',
    url: 'https://www.woah.org/fileadmin/Home/eng/Health_standards/tahm/3.01.18_RABIES.pdf',
    availability: 'verified-online',
  },
  'tepsumethanon-2005': {
    id: 'tepsumethanon-2005',
    title: 'Six criteria for rabies diagnosis in living dogs',
    organization: 'Journal of the Medical Association of Thailand',
    kind: 'primary-literature',
    year: 2005,
    citation: 'Tepsumethanon V, Wilde H, Meslin FX. Six criteria for rabies diagnosis in living dogs. J Med Assoc Thai. 2005;88(3):419-22.',
    availability: 'verified-online', // citation + sens 90.2% / spec 96.2% confirmed
  },
  'wsava-2024': {
    id: 'wsava-2024',
    title: '2024 guidelines for the vaccination of dogs and cats — compiled by the Vaccination Guidelines Group (VGG) of the WSAVA',
    organization: 'WSAVA · Journal of Small Animal Practice',
    kind: 'guideline',
    year: 2024,
    citation: 'Squires RA, Crawford C, Marcondes M, Whitley N. 2024 guidelines for the vaccination of dogs and cats (WSAVA VGG). J Small Anim Pract. 2024;65(5):277-316. doi:10.1111/jsap.13718',
    url: 'https://wsava.org/wp-content/uploads/2024/04/WSAVA-Vaccination-guidelines-2024.pdf',
    availability: 'verified-online', // journal/volume/pages + DOI + official PDF confirmed
  },
  'greene-iddc': {
    id: 'greene-iddc',
    title: 'Infectious Diseases of the Dog and Cat',
    organization: 'Elsevier (Greene / Sykes eds.)',
    kind: 'textbook',
    citation: "Greene CE / Sykes JE (eds.). Infectious Diseases of the Dog and Cat. Elsevier.",
    availability: 'named', // real standard reference; no specific page asserted
  },
};

/** Resolve a SourceRef to its Source record (or null if it points at a
 *  lecture-note locator rather than an external source). */
export function resolveSource(ref) {
  if (!ref) return null;
  return SOURCES[ref.sourceId] || null;
}

export const ALL_SOURCE_IDS = Object.keys(SOURCES);
