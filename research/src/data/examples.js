// Example datasets offered on the project list, every one labelled ข้อมูลสมมุติ / made-up data
// [M2-DESIGN.md 11.4]. The files are JS modules under data/examples/ loaded with a literal import()
// (not public/ files: research/vercel.json rewrites unknown paths to index.html). OWNER: trust role.
// STUB(m2): empty until the examples are written by scripts/make-examples.mjs.

/**
 * @typedef {{ id: string, titleKey: string, descKey: string, design: string, methods: string[], rows: number, load: () => Promise<{ default: { fileName: string, csv: string } }> }} Example
 */

/** @type {readonly Example[]} */
export const EXAMPLES = Object.freeze([]);
