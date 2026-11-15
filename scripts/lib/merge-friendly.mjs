// Generated files that merge by themselves.
//
// Two pull requests that add questions to different topics must merge with no
// conflict in any generated file, and the merged text must be exactly what a
// fresh regeneration writes. Git (and GitHub) conflict whenever both sides
// change the same line, two neighbouring lines, or one side changes a line
// right next to where the other inserts one. So a generated file:
//
//   * holds no timestamp, total or other number that every change moves;
//     aggregates are computed where they are read, from the leaves;
//   * writes each leaf (a topic's counts, a bank's row) on its own line, between
//     a header and a footer line that name the leaf and never change, so a
//     change to one leaf is never adjacent to a change or an insertion at any
//     other leaf;
//   * sorts its leaves by a stable key, compared by code unit (never
//     localeCompare, which follows the machine's locale).
//
// tests/unit/derived-merge.test.mjs merges two changes in different topics with
// `git merge-file` and requires the result to equal a regeneration.

/** Code-unit order of two keys given as arrays of strings (or numbers). */
export function compareKeys(a, b) {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i += 1) {
    const x = String(a[i]);
    const y = String(b[i]);
    if (x !== y) return x < y ? -1 : 1;
  }
  return a.length - b.length;
}

/**
 * The three lines of one leaf: a header naming it, the leaf itself (one line,
 * ending with a comma), and a footer naming it again.
 * @param {unknown[]} key the leaf's identity; only its JSON is printed
 * @param {string} body one line of JavaScript, without the trailing comma
 * @param {string} [indent]
 */
export function leafLines(key, body, indent = '  ') {
  if (/[\r\n]/.test(body)) throw new Error(`leaf ${JSON.stringify(key)} must fit on one line`);
  const label = JSON.stringify(key);
  return [`${indent}// ${label}`, `${indent}${body},`, `${indent}// end ${label}`];
}

/** The comment every merge-friendly generated file carries about its layout. */
export const LEAF_LAYOUT_NOTE = [
  '// Layout: one leaf per line, between a header and a footer line naming it, so',
  '// two pull requests that change different leaves merge without a conflict and',
  '// the merge equals a regeneration. Nothing here is a total: the totals are',
  '// computed from the leaves when this module loads (scripts/lib/merge-friendly.mjs).',
];
