// The catalogue the landing chart reads (M1-DESIGN.md 5). Families resolve to a count in a committed
// evidence file; method ids are unique; every M1 method has an owner and a design that offers it;
// shipped and verified are derived, never typed. OWNER: runtime role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { FAMILIES, METHODS, getCatalog, familyStatus } from '../../src/lib/runtime/catalog.js';
import { IMPLEMENTED } from '../../src/lib/runtime/registry.js';
import { DESIGNS, DESIGN_FREE_METHODS } from '../../src/lib/epi/design.js';

const evidenceDir = new URL('../../src/landing/evidence/', import.meta.url);
const read = (file) => JSON.parse(readFileSync(fileURLToPath(new URL(file, evidenceDir)), 'utf8'));

function at(obj, dotted) {
  // paths are "<top>.<key>" where the key may itself contain dots or slashes; split on the first dot
  const i = dotted.indexOf('.');
  return obj[dotted.slice(0, i)]?.[dotted.slice(i + 1)];
}

test('every family with evidence resolves to a whole number in a committed file', () => {
  for (const f of FAMILIES) {
    for (const e of f.evidence) {
      const n = at(read(e.file), e.path);
      assert.ok(Number.isInteger(n) && n >= 0, `${f.id}: ${e.file} ${e.path} -> ${n}`);
    }
  }
});

test('method ids are unique and families exist', () => {
  const ids = METHODS.map((m) => m.id);
  assert.equal(new Set(ids).size, ids.length);
  const fam = new Set(FAMILIES.map((f) => f.id));
  for (const m of METHODS) for (const f of m.families) assert.ok(fam.has(f), `${m.id} -> unknown family ${f}`);
});

test('every M1 method has an owner and is offered by a design or needs none', () => {
  const offered = new Set(DESIGNS.flatMap((d) => d.offers.map((o) => o.method)).concat(DESIGN_FREE_METHODS));
  for (const m of METHODS.filter((x) => x.milestone === 'M1')) {
    assert.ok(m.owner === 'stats' || m.owner === 'epi', `${m.id} has no owner`);
    if (m.id !== 'posthoc.tukey') assert.ok(offered.has(m.id), `${m.id} is offered by no design`);
  }
});

test('shipped follows the registry and verified needs shipped', () => {
  for (const c of getCatalog()) {
    assert.equal(c.shipped, Boolean(IMPLEMENTED[c.id]));
    if (c.verified) assert.ok(c.shipped && c.validatedAgainst.length > 0);
  }
});

test('family status is one of the published labels', () => {
  for (const f of FAMILIES) assert.ok(['now', 'M1', 'M2', 'M3', 'later'].includes(familyStatus(f.id)));
});
