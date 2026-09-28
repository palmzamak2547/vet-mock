// How to cite VetMock Research [M2-DESIGN.md 11.2]: one record per release, newest first. `doi` stays
// null until a DOI is actually minted for that release (Zenodo needs the owner's account; never invent
// one). `authors` stays empty until the owner names the people to credit; until then the citation uses
// the program's name as its author, which is how software without named authors is cited. `released`
// is the day the release went live on research.vetmock.com (Asia/Bangkok), from the deploy commit.
// Add the record when a release is cut, in the same commit that bumps ENGINE_VERSION.
// OWNER: trust role.

/**
 * @typedef {{ version: string, year: number, released: string, url: string, doi: string|null, authors: string[] }} Release
 */

/** @type {readonly Release[]} */
export const RELEASES = Object.freeze([
  // M1: the first public release (deploy commit fd09a0cc, 28 Sep 2026 05:25 +07:00).
  { version: '0.1.0', year: 2026, released: '2026-09-28', url: 'https://research.vetmock.com', doi: null, authors: [] },
]);

/** The newest release, or null before the first one. */
export function currentRelease() {
  return RELEASES[0] || null;
}

/**
 * The software reference in the shape report's export/cite.js reads (toRis, toBibtex).
 * @param {Release} r
 * @param {string} accessed YYYY-MM-DD
 * @param {string} title the program's name
 */
export function softwareReference(r, accessed, title) {
  return {
    id: `vetmock-research-${r.version}`,
    type: /** @type {'software'} */ ('software'),
    authors: r.authors.length ? r.authors : [title],
    title,
    year: r.year,
    version: r.version,
    url: r.url,
    doi: r.doi,
    accessed,
  };
}
