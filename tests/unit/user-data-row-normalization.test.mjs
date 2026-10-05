import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeUserDataRow } from '../../src/lib/user-data-row.js';
import { stableItemKey } from '../../src/lib/user-data-sync.js';
import migrationMap from '../../src/lib/id-migration-map.json' with { type: 'json' };
import { SUBJECTS, yearForSubject } from '../../src/data/curriculum.js';
import { loadModule } from '../helpers/fake-react.mjs';
import { userDataChanges } from '../../src/lib/user-data-operations.js';

const legacy = [
  { subject: 'engprof', questionId: 1100, correct: true, date: 1700000000000 },
  { id: 'attempt-2', subject: 'engprof', questionId: 1101, correct: false, date: 1700000000001 },
  { subject: 'engprof', questionId: 1102, correct: true },
  { subject: 'engprof', questionId: 1103, correct: false, year: null, phase: '1-mid' },
  { subject: 'unknown-subject', questionId: 'external-id', correct: true },
];

test('row normalization retains ID migration, year enrichment and explicit metadata without mutating receipts', () => {
  const input = { user_id: 'A', history: structuredClone(legacy) };
  const result = normalizeUserDataRow(input);
  assert.deepEqual(input.history, legacy);
  assert.deepEqual(result.history[0], { ...legacy[0], questionId: migrationMap['engprof:1100'], year: 4, phase: null });
  assert.deepEqual(result.history[1], { ...legacy[1], questionId: migrationMap['engprof:1101'], year: 4, phase: null });
  assert.equal(stableItemKey(result.history[1]), 'id:attempt-2');
  assert.deepEqual(result.history[2], { ...legacy[2], questionId: migrationMap['engprof:1102'], year: 4, phase: null });
  assert.deepEqual(result.history[3], { ...legacy[3], questionId: migrationMap['engprof:1103'] });
  assert.deepEqual(result.history[4], { ...legacy[4], year: null, phase: null });
  assert.deepEqual(normalizeUserDataRow(result), result, 'normalization is idempotent');
  assert.equal(normalizeUserDataRow(null), null);
});

test('ordinary reads and atomic RPC replies share the same history contract', async () => {
  const row = { user_id: 'A', history: structuredClone(legacy) };
  const receipt = { row, acknowledged: ['op'], conflicts: [] };
  const query = { select() { return this; }, eq() { return this; }, abortSignal() { return this; },
    maybeSingle: async () => ({ data: row }) };
  globalThis.__historyNormalizationClient = {
    from: () => query,
    auth: { getSession: async () => ({ data: { session: { user: { id: 'A' } } } }) },
    rpc: () => ({ abortSignal: async () => ({ data: receipt }) }),
  };
  const api = await loadModule('src/lib/api.js', { stubs: [{ match: '/supabase\\.js$',
    contents: 'export const getSupabase = async () => globalThis.__historyNormalizationClient;' }] });
  const pulled = await api.pullUserData('A');
  const applied = await api.applyUserDataOperations('A', []);
  assert.deepEqual(applied.row, pulled);
  assert.deepEqual(applied.acknowledged, ['op']);
  assert.deepEqual(row.history, legacy, 'the raw RPC receipt remains unchanged');
});

test('SQL normalization maps are generated from the same immutable IDs and curriculum years', () => {
  const sql = readFileSync(new URL('../../supabase/migrations/20261005140235_user_data_operation_sync.sql', import.meta.url), 'utf8');
  const block = marker => {
    const parts = sql.split(`$${marker}$`);
    assert.equal(parts.length, 3, `missing or duplicate generated map ${marker}`);
    return JSON.parse(parts[1]);
  };
  assert.deepEqual(block('vmx_history_id_map'), migrationMap);
  const years = Object.fromEntries(SUBJECTS.filter(subject => subject.id !== 'all').map(subject => [subject.id, yearForSubject(subject.id) ?? null]));
  assert.deepEqual(block('vmx_history_year_map'), years);
});

test('legacy recovery and canonical account history never produce alias put/remove overlap', () => {
  const account = normalizeUserDataRow({ history: legacy }).history;
  assert.deepEqual(userDataChanges({ history: account }, { history: legacy }), {});
  assert.deepEqual(userDataChanges({ history: legacy }, { history: account }), {});
  for (let index = 0; index < legacy.length; index++) {
    const changes = userDataChanges({ history: account }, { history: legacy.filter((_, n) => n !== index) });
    assert.deepEqual(changes.history.put, []);
    assert.deepEqual(changes.history.remove, [stableItemKey(account[index])]);
  }
});
