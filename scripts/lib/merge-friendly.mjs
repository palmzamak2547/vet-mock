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
//   * ends a leaf that holds a number counted over several questions with a
//     comment naming those questions (a digest of each one's id and what it
//     adds to the leaf). Two different changes that happen to reach the same
//     numbers (one held-back question added to a topic on each side) would
//     otherwise write the same line, git would take it once, and the merge
//     would be one short. With the digest they differ and git stops. The build
//     strips comments, so the app never loads them.
//
// tests/unit/derived-merge.test.mjs merges two changes in different topics with
// `git merge-file` and requires the result to equal a regeneration, and checks
// that no other pair of changes merges clean and wrong.

import { createHash } from 'node:crypto';

/**
 * Twelve hex digits naming a set of parts (order does not matter): equal only
 * when the parts are equal.
 * @param {Iterable<string>} parts
 */
export function digestOf(parts) {
  return createHash('sha256').update([...parts].map(String).sort().join('\n')).digest('hex').slice(0, 12);
}

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
 * @param {string} [digest] the questions behind the leaf (digestOf), for a leaf
 *   that counts them
 */
export function leafLines(key, body, indent = '  ', digest = '') {
  if (/[\r\n]/.test(body)) throw new Error(`leaf ${JSON.stringify(key)} must fit on one line`);
  const label = JSON.stringify(key);
  const tail = digest ? ` // ${digest}` : '';
  return [`${indent}// ${label}`, `${indent}${body},${tail}`, `${indent}// end ${label}`];
}

/** The comment every merge-friendly generated file carries about its layout. */
export const LEAF_LAYOUT_NOTE = [
  '// Layout: one leaf per line, between a header and a footer line naming it, so',
  '// two pull requests that change different leaves merge without a conflict and',
  '// the merge equals a regeneration. Nothing here is a total: the totals are',
  '// computed from the leaves when this module loads (scripts/lib/merge-friendly.mjs).',
];

/** For a file whose leaves count questions: what the comment after a leaf is. */
export const LEAF_DIGEST_NOTE = [
  '// The comment after a leaf names the questions it counts, so two different',
  '// changes that reach the same numbers still conflict instead of merging short.',
];
