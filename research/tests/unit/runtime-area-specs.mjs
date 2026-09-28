// Every registered method's end-to-end case, M1 and M2 [M2-DESIGN.md 2, 15]. The M1 cases are
// runtime-m1-specs.mjs; each M2 area adds its own in `tests/unit/<area>-specs.mjs` (lab, models,
// measure, plan), owned by the role that owns the area, exporting
//
//   export function specs(ctx) -> { spec, needsFarm?, table?, codebook?, steps? }[]
//
// where ctx = { keys, table, codebook, steps, smallTable }. A case without a table of its own runs on
// the serosurvey table; `smallTable` builds a WorkingTable from typed columns for a made-up dataset
// (rm, roc, items, ...). Shared by runtime-every-method.test.mjs (engine core in Node) and
// tests/e2e/research-network-silence.spec.js (the shipped module worker in a browser).
// OWNER: data role.
import { existsSync } from 'node:fs';
import { applyRecipe } from '../../src/lib/intake/recipe.js';
import { serosurveyTable, m1Specs } from './runtime-m1-specs.mjs';

export const AREA_SPEC_FILES = Object.freeze(['lab-specs.mjs', 'models-specs.mjs', 'measure-specs.mjs', 'plan-specs.mjs']);

/**
 * A WorkingTable from typed columns (made-up data for a method's end-to-end case).
 * @param {{ key?: string, name: string, type: string, values: (string|number|null)[], levels?: string[], positive?: string|null, reference?: string|null }[]} columns
 *   values as the cells would read in a file; null is a blank; keys default to c1, c2, ...
 * @param {{ clusterKey?: string|null, unitOfAnalysis?: string }} [opts]
 * @returns {{ table: any, codebook: any, steps: any[] }}
 */
export function smallTable(columns, opts = {}) {
  const n = columns[0].values.length;
  const raw = {
    header: columns.map((c) => c.name),
    columns: columns.map((c) => c.values.map((v) => (v == null ? '' : String(v)))),
    rowIds: Array.from({ length: n }, (_, i) => `r${i + 1}`),
    rowCount: n,
    source: { fileName: 'made-up.csv', bytes: 0, sha256: '', encoding: 'utf-8', format: 'csv', sheet: null, headerRow: 0, importedAt: '2026-09-28T00:00:00.000Z' },
  };
  const codebook = {
    columns: columns.map((c, i) => ({
      key: `c${i + 1}`, name: c.name, labelTh: c.name, labelEn: c.name, type: c.type, role: 'none', level: 'animal', unit: null,
      levels: (c.levels || []).map((v) => ({ value: v, labelTh: v, labelEn: v })), reference: c.reference ?? null, positive: c.positive ?? null,
      missingCodes: [], range: null, pii: null, hidden: false,
    })),
    unitOfAnalysis: opts.unitOfAnalysis || 'animal',
    clusterKey: opts.clusterKey ?? null,
  };
  const table = applyRecipe(raw, codebook, []);
  return { table, codebook: table.codebook, steps: [] };
}

/**
 * Every case: M1's on the serosurvey, then each area file's.
 * @returns {Promise<{ base: Awaited<ReturnType<typeof serosurveyTable>>, cases: { spec: any, needsFarm?: boolean, table?: any, codebook?: any, steps?: any[], area: string }[], missingFiles: string[] }>}
 */
export async function allSpecs() {
  const base = await serosurveyTable();
  const cases = m1Specs(base.keys).map((c) => ({ ...c, area: 'm1' }));
  const missingFiles = [];
  for (const f of AREA_SPEC_FILES) {
    const url = new URL(`./${f}`, import.meta.url);
    if (!existsSync(url)) { missingFiles.push(f); continue; }
    const mod = await import(url.href);
    const list = mod.specs({ keys: base.keys, table: base.table, codebook: base.codebook, steps: base.steps, smallTable });
    for (const c of list) cases.push({ ...c, area: f.replace(/-specs\.mjs$/, '') });
  }
  return { base, cases, missingFiles };
}
