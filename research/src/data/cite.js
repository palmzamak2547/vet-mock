// How to cite VetMock Research [M2-DESIGN.md 11.2]: one record per release. `doi` stays null until a
// DOI is actually minted for that release (Zenodo needs the owner's account; never invent one).
// OWNER: trust role. STUB(m2): filled when the release is cut.

/**
 * @typedef {{ version: string, year: number, released: string, url: string, doi: string|null, authors: string[] }} Release
 */

/** @type {readonly Release[]} */
export const RELEASES = Object.freeze([]);
