// Example datasets offered on the project list, every one labelled ข้อมูลสมมุติ / made-up data
// [M2-DESIGN.md 11.4; competitor-gaps.md D7]. The files are JS modules under data/examples/ loaded with
// a literal import() (not public/ files: research/vercel.json rewrites unknown paths to index.html),
// written by scripts/make-examples.mjs from PCG32 with the seed recorded in each file. Words: the
// title, the two-sentence story and the "made-up data" label live in i18n/trust.js (trust.example.*);
// a screen that shows the list registers the 'trust' area. tests/unit/trust-examples.test.mjs checks
// that `rows` and `columns` match the generated files and that each file redraws from its seed.
// OWNER: trust role.

/**
 * What an example module's default export holds.
 * @typedef {Object} ExampleData
 * @property {string} id
 * @property {true} madeUp
 * @property {{ algorithm: string, seed: number, stream: number, script: string }} generator
 * @property {string} fileName        the first file, as it would be imported (UTF-8 CSV, comma, header row)
 * @property {string} csv
 * @property {{ fileName: string, csv: string }|null} second   the farm file to merge, or the second typist's file
 * @property {ExampleColumn[]} codebook   one entry per column name across both files
 * @property {{ row: string, column: string, what?: string, a?: string, b?: string }[]} planted  the gaps and
 *   mistakes written in on purpose (a missing weighing, a mistyped farm code, the double-entry differences)
 */

/**
 * A codebook hint in the shape of lib/runtime/types.js CodebookEntry, matched to a column by `name`.
 * @typedef {{ name: string, labelTh: string, labelEn: string, type: string, role: string, level: string,
 *   unit: string|null, levels: { value: string, labelTh: string, labelEn: string }[], reference: string|null,
 *   positive: string|null, range: { min: number|null, max: number|null }|null, missingNote: string|null }} ExampleColumn
 */

/**
 * @typedef {Object} Example
 * @property {string} id
 * @property {string} titleKey
 * @property {string} descKey          the two-sentence story: what was studied, then what to try
 * @property {string} design           a design id (lib/epi/design.js and the area design rows)
 * @property {string[]} methods        method ids the example is built for
 * @property {'merge'|'compare'|'reshape-long'|null} tool   the data tool to try first, when there is one
 * @property {string} guide            the /guide page that walks through it
 * @property {number} rows             rows of the first file
 * @property {number} columns          columns of the first file
 * @property {number|null} secondRows  rows of the second file, or null
 * @property {() => Promise<{ default: ExampleData }>} load
 */

/** @type {readonly Example[]} */
export const EXAMPLES = Object.freeze([
  {
    id: 'feed-trial', titleKey: 'trust.example.feed-trial.title', descKey: 'trust.example.feed-trial.story',
    design: 'experiment', methods: ['anova.twoWay', 'diag.shapiro'], tool: null, guide: 'lab',
    rows: 48, columns: 4, secondRows: null,
    load: () => import('./examples/feed-trial.js'),
  },
  {
    id: 'piglet-growth', titleKey: 'trust.example.piglet-growth.title', descKey: 'trust.example.piglet-growth.story',
    design: 'experiment', methods: ['anova.repeated'], tool: 'reshape-long', guide: 'repeated',
    rows: 12, columns: 6, secondRows: null,
    load: () => import('./examples/piglet-growth.js'),
  },
  {
    id: 'calf-survival', titleKey: 'trust.example.calf-survival.title', descKey: 'trust.example.calf-survival.story',
    design: 'cohort', methods: ['surv.kaplanMeier'], tool: null, guide: 'survival',
    rows: 80, columns: 7, secondRows: null,
    load: () => import('./examples/calf-survival.js'),
  },
  {
    id: 'rapid-test', titleKey: 'trust.example.rapid-test.title', descKey: 'trust.example.rapid-test.story',
    design: 'diagnostic', methods: ['roc.delong'], tool: null, guide: 'diagnostic',
    rows: 90, columns: 4, secondRows: null,
    load: () => import('./examples/rapid-test.js'),
  },
  {
    id: 'thermometers', titleKey: 'trust.example.thermometers.title', descKey: 'trust.example.thermometers.story',
    design: 'agreement', methods: ['agree.blandAltman'], tool: null, guide: 'agreement',
    rows: 45, columns: 3, secondRows: null,
    load: () => import('./examples/thermometers.js'),
  },
  {
    id: 'questionnaire', titleKey: 'trust.example.questionnaire.title', descKey: 'trust.example.questionnaire.story',
    design: 'cross-sectional', methods: ['rel.cronbach'], tool: null, guide: 'agreement',
    rows: 60, columns: 8, secondRows: null,
    load: () => import('./examples/questionnaire.js'),
  },
  {
    id: 'merge-farms', titleKey: 'trust.example.merge-farms.title', descKey: 'trust.example.merge-farms.story',
    design: 'cross-sectional', methods: ['freq.proportion', 'epi.twoByTwo', 'cluster.iccDeff'], tool: 'merge', guide: 'farms',
    rows: 150, columns: 5, secondRows: 12,
    load: () => import('./examples/merge-farms.js'),
  },
  {
    id: 'double-entry', titleKey: 'trust.example.double-entry.title', descKey: 'trust.example.double-entry.story',
    design: 'descriptive', methods: ['desc.summary'], tool: 'compare', guide: 'prepare',
    rows: 30, columns: 6, secondRows: 30,
    load: () => import('./examples/double-entry.js'),
  },
]);

/** @param {string} id @returns {Example|undefined} */
export function getExample(id) {
  return EXAMPLES.find((e) => e.id === id);
}
