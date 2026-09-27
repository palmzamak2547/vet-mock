// RIS and BibTeX for the references a report cites and for citing VetMock Research itself [M2-DESIGN.md
// 6.5].
// OWNER: report role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {{ id: string, type: 'article'|'book'|'software', authors: string[], title: string, year: number, journal?: string, volume?: string, issue?: string, pages?: string, doi?: string|null, url?: string, version?: string, accessed?: string }[]} refs
 * @returns {string}
 */
export function toRis(refs) {
  throw new Error('not implemented: export/cite.toRis');
}

/**
 * @param {Parameters<typeof toRis>[0]} refs
 * @returns {string}
 */
export function toBibtex(refs) {
  throw new Error('not implemented: export/cite.toBibtex');
}
