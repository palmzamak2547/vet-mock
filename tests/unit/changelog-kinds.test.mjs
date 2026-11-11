// Every change's kind and scope is one Home can draw. KindPill knows feature,
// fix and content and draws anything else as content; ScopeChip draws nothing
// for a scope missing from SCOPE_LABELS. 5.126.0 and older used improve, add,
// change and one aquatic-clinic scope; they are history and stay as shipped.
import test from 'node:test';
import assert from 'node:assert/strict';

const { CHANGELOG } = await import('../../src/data/changelog-all.js');
const { SCOPE_LABELS } = await import('../../src/data/changelog.js');

const KINDS = new Set(['feature', 'fix', 'content']);
const LAST_EXEMPT = [5, 126, 0];
const after = (v) => {
  const p = String(v).split('.').map((n) => Number.parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) if ((p[i] || 0) !== LAST_EXEMPT[i]) return (p[i] || 0) > LAST_EXEMPT[i];
  return false;
};

test('changes after 5.126.0 use a kind and a scope the reader knows', () => {
  const bad = [];
  for (const r of CHANGELOG.filter((x) => after(x.version))) {
    for (const c of r.changes || []) {
      if (!KINDS.has(c.kind)) bad.push(`${r.version} kind ${c.kind}`);
      if (c.scope != null && !SCOPE_LABELS[c.scope]) bad.push(`${r.version} scope ${c.scope}`);
    }
  }
  assert.deepEqual(bad, []);
});
