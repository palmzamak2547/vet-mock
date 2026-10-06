import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseStudyEventArchive } from '../../src/lib/study-event-archive.js';
import { parseLocalExtras } from '../../src/lib/local-extras.js';
import { createAttemptEntries, newStudySessionId } from '../../src/lib/study-events.js';
import { parseUserBackup, userDataPatchFromBackup, describeBackupFields } from '../../src/lib/user-data-schema.js';

// Execute the real FileReader handler; replace only lazy loading and UI/storage
// boundaries so navigation can occur at each await without wall-clock races.
const source = readFileSync(new URL('../../src/views/DashboardView.jsx', import.meta.url), 'utf8');
const start = source.indexOf('  const importData = (e) => {');
const end = source.indexOf('\n  return (', start);
assert.ok(start >= 0 && end > start);
const factory = new Function('FileReader', 'mountedRef', 'load', 'confirmDialog',
  'alertDialog', 'ownerId', 'USER_DATA_IMPORT_MAX_BYTES', 'parseUserBackup',
  'userDataPatchFromBackup', 'describeBackupFields', 'restoreUserData', 'thaiError',
  `${source.slice(start, end).replaceAll('import(', 'load(')}\nreturn importData;`);
const events = createAttemptEntries({
  questions: [{ id: 0, subject: 'surg2', type: 'tf', q: 'Example', answer: false }],
  answers: { 0: false }, sessionId: newStudySessionId(), now: 1000,
});
const study = { format: 'vetmock-study-events-v1', events };
const extras = { format: 'vetmock-local-extras-v1', data: { 'vmx-pinboard': [] } };

async function run(archive, pauseAt) {
  let reader;
  const mountedRef = { current: true };
  const calls = { writes: 0, confirms: 0, alerts: 0, syncs: 0 };
  const pause = at => { if (pauseAt === at) mountedRef.current = false; };
  const load = async path => {
    pause(path);
    if (path.endsWith('study-event-archive.js')) return { parseStudyEventArchive };
    if (path.endsWith('local-extras.js')) return { parseLocalExtras,
      restoreLocalExtras() { calls.writes++; return { ok: true }; } };
    if (path.endsWith('study-event-log.js')) return { async appendStudyEvents(owner, incoming, options) {
      assert.equal(owner, 'owner-a');
      assert.deepEqual(incoming, JSON.parse(JSON.stringify(events)));
      assert.equal(options.keepOnFailure, false);
      calls.writes++;
      pause('append');
      return { ok: true };
    } };
    if (path.endsWith('study-event-sync.js')) return { syncStudyEvents() { calls.syncs++; } };
    throw new Error(path);
  };
  const importData = factory(class { constructor() { reader = this; } readAsText() {} },
    mountedRef, load, async () => { calls.confirms++; pause('confirm'); return true; },
    () => calls.alerts++, 'owner-a', 20 * 1024 * 1024, parseUserBackup,
    userDataPatchFromBackup, describeBackupFields,
    () => { calls.writes++; return { accepted: true }; }, () => 'read failed');
  const target = { files: [{ size: 100 }], value: 'archive.json' };
  importData({ target });
  await reader.onload({ target: { result: JSON.stringify(archive) } });
  return calls;
}

test('retired Dashboard imports stop at lazy-load and confirmation boundaries', async () => {
  for (const [archive, pauseAt, confirms] of [
    [study, '../lib/study-event-archive.js', 0],
    [study, '../lib/study-event-log.js', 1],
    [extras, '../lib/local-extras.js', 0],
    [study, 'confirm', 1], [extras, 'confirm', 1],
    [{ bookmarks: [] }, 'confirm', 1],
  ]) assert.deepEqual(await run(archive, pauseAt), { writes: 0, confirms, alerts: 0, syncs: 0 }, pauseAt);
  assert.deepEqual(await run(study, 'append'), { writes: 1, confirms: 1, alerts: 0, syncs: 0 },
    'an already authorized write remains; the retired view stops its completion UI');
  assert.deepEqual(await run(study, '../lib/study-event-sync.js'), { writes: 1, confirms: 1, alerts: 1, syncs: 0 });
});

test('active Dashboard still imports detailed, local-tool and core backups', async () => {
  assert.deepEqual(await run(study), { writes: 1, confirms: 1, alerts: 1, syncs: 1 });
  for (const archive of [extras, { bookmarks: [] }])
    assert.deepEqual(await run(archive), { writes: 1, confirms: 1, alerts: 1, syncs: 0 });
});
