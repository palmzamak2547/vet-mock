// Primary references for the methods a report cites, so the methods paragraph can name its sources and
// the student can take them to Zotero or EndNote as RIS or BibTeX [M2-DESIGN.md 6.5]. Every DOI is
// checked against Crossref before it is added, and the check date is written in `checked`; a reference
// without a DOI keeps doi null (never a guessed one). OWNER: report role. STUB(m2): empty until filled.

/**
 * @typedef {{ id: string, methods: string[], type: 'article'|'book', authors: string[], title: string, year: number,
 *   journal?: string, volume?: string, issue?: string, pages?: string, doi: string|null, checked: string }} Reference
 */

/** @type {readonly Reference[]} */
export const REFERENCES = Object.freeze([]);
