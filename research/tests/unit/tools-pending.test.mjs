// The files waiting for a project's import screens (screens/pending-file.js): one per purpose, taken once,
// and an example's codebook hints applied by column name without touching keys [M2-DESIGN.md 11.4].
// Made-up data (ข้อมูลสมมุติ). OWNER: ui-tools role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyHints, setPendingFile, takePending, takePendingFile } from '../../src/workspace/screens/pending-file.js';

test('a waiting file is taken once, and each purpose waits apart', () => {
  setPendingFile('p1', 'animals.csv', { hints: [{ name: 'farm' }], next: 'merge' });
  setPendingFile('p1', 'farms.csv', { purpose: 'merge' });
  assert.equal(takePendingFile('p1', 'double-entry'), null);
  assert.deepEqual(takePending('p1'), { file: 'animals.csv', hints: [{ name: 'farm' }], next: 'merge' });
  assert.equal(takePending('p1'), null, 'taken once');
  assert.equal(takePendingFile('p1', 'merge'), 'farms.csv');
});

test('applyHints matches by name, keeps key and name, names the cluster column', () => {
  const cb = { unitOfAnalysis: 'animal', clusterKey: null, columns: [
    { key: 'c1', name: 'farm', labelTh: 'farm', type: 'nominal', role: 'none', levels: [] },
    { key: 'c2', name: 'weight', labelTh: 'weight', type: 'text', role: 'none', range: null },
  ] };
  const hints = [{ name: 'farm', labelTh: 'ฟาร์ม', role: 'cluster', level: 'farm', key: 'zz' }, { name: 'weight ', type: 'continuous', unit: 'kg', range: { min: 0, max: 900 } }];
  const out = applyHints(cb, hints);
  assert.equal(out.clusterKey, 'c1');
  assert.deepEqual(out.columns[0], { key: 'c1', name: 'farm', labelTh: 'ฟาร์ม', type: 'nominal', role: 'cluster', levels: [], level: 'farm' });
  assert.deepEqual(out.columns[1], { key: 'c2', name: 'weight', labelTh: 'weight', type: 'continuous', role: 'none', range: { min: 0, max: 900 }, unit: 'kg' });
  assert.equal(cb.columns[1].type, 'text', 'the argument is not changed');
  assert.equal(applyHints(cb, null), cb);
});
