// A student's study data is one set of fields, written down in nine places by hand: the sync
// engine's USER_DATA_FIELDS (user-data-sync.js), the backup's BACKUP_FIELDS, its schema, its
// error labels and its import preview (user-data-schema.js), the backup the progress screen
// downloads, the export on the account screen, the progress screen's reset, and the server's
// allow-list in sync_user_data_v2. A new field that reaches the sync engine and misses one of them
// is saved and synced, then silently left out of the backup a student restores from, or refused by
// the server so the device never syncs again. This test names every list and fails on a field that
// is in one and absent from another, unless the gap is written below with what it costs.
// (move-base.js and the account purge's key prefixes have their own pins: move-base.test.mjs and
// account-local-purge.test.mjs; the purge works on whole account snapshots, not on fields, and the
// last test here checks it from the other side.)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { USER_DATA_FIELDS } from '../../src/lib/user-data-sync.js';
import { BACKUP_FIELDS, describeBackupFields } from '../../src/lib/user-data-schema.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
// The top-level keys of an object literal's body: comments and nested braces dropped first.
function keysOf(block) {
  let flat = block.replace(/\/\/[^\n]*/g, '').replace(/\s+/g, ' ');
  for (let prev = ''; prev !== flat;) { prev = flat; flat = flat.replace(/\{[^{}]*\}/g, '0'); }
  return [...flat.matchAll(/(?:^|,)\s*([a-zA-Z]\w*)\s*(?=[:,]|$)/g)].map((m) => m[1]);
}
const between = (src, start, end, what) => {
  const i = src.indexOf(start);
  assert.ok(i !== -1, `${what}: cannot find ${start}`);
  const j = src.indexOf(end, i + start.length);
  assert.ok(j !== -1, `${what}: cannot find the end of ${start}`);
  return src.slice(i + start.length, j);
};

const SCHEMA = read('src/lib/user-data-schema.js');
const DASHBOARD = read('src/views/DashboardView.jsx');
const APP = read('src/App.jsx');

// What a backup file says about itself, not study data.
const FILE_META = ['exportDate', 'version'];

const LISTS = {
  'BACKUP_FIELDS': new Set(BACKUP_FIELDS),
  'backup schema': new Set([...between(SCHEMA, 'const backupSchema = v.pipe(', 'v.check(', 'backup schema').matchAll(/^\s+(\w+): v\.optional/gm)].map((m) => m[1]).filter((k) => !FILE_META.includes(k))),
  'backup error labels': new Set(keysOf(between(SCHEMA, 'const pathLabels = {', '};', 'error labels')).filter((k) => k in USER_DATA_FIELDS || BACKUP_FIELDS.includes(k))),
  'import preview': new Set(BACKUP_FIELDS.filter((f) => describeBackupFields(SAMPLE(), [f]).length === 1)),
  'progress backup download': new Set(keysOf(between(DASHBOARD, 'const exportData = () => {\n    const data = {', '\n    };', 'dashboard export'))
    .filter((k) => !FILE_META.includes(k))),
  'account export': new Set(keysOf(between(APP, 'coreData={{', '}}', 'account export'))),
  'progress reset': new Set(keysOf(between(DASHBOARD, 'const result = restoreUserData?.({', '});', 'progress reset')).filter((k) => k in USER_DATA_FIELDS)),
};

function SAMPLE() {
  return { bookmarks: [], history: [], notes: {}, srCards: {}, streakData: { streak: 0, lastDate: null }, streak: 0, customQuestions: [], readingChecklist: {}, pendingExamResults: [] };
}

// Every gap between the lists today, with what a student loses through it. A field leaves this
// table by joining the list; a new field joins every list or gets a line here.
const GAPS = {
  streak: {
    lists: ['account export', 'progress reset'],
    sync: true,
    why: 'the bare day count, a legacy mirror of streakData that old backups carry; it is read on import (as streakData) and written to the backup for older versions, never synced',
  },
  customQuestions: {
    lists: ['progress reset'],
    why: 'the reset clears study progress and keeps the questions a student wrote; its dialog lists what it clears and does not name them',
  },
};

test('every field is in every list, or its gap is written down with its cost', () => {
  const fields = new Set([...Object.keys(USER_DATA_FIELDS), ...Object.values(LISTS).flatMap((s) => [...s])]);
  for (const field of fields) {
    const gap = GAPS[field];
    if (!(field in USER_DATA_FIELDS)) assert.ok(gap?.sync, `${field} is in a backup list but not in USER_DATA_FIELDS, and GAPS does not say why`);
    for (const [name, list] of Object.entries(LISTS)) {
      const expectedAbsent = gap?.lists.includes(name);
      if (expectedAbsent) assert.ok(!list.has(field), `${field} is in ${name} now: drop that list from its GAPS entry`);
      else assert.ok(list.has(field), `${field} is missing from ${name}${field in USER_DATA_FIELDS ? '' : ' (a backup-only field)'}, and GAPS does not say why`);
    }
  }
  for (const field of Object.keys(GAPS)) assert.ok(fields.has(field), `GAPS names ${field}, which no list has any more`);
});

test('the server accepts exactly the fields the client syncs', () => {
  const dir = new URL('../../supabase/migrations/', import.meta.url);
  const latest = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort().reverse()
    .find((f) => /create or replace function public\.sync_user_data_v2\(/.test(readFileSync(new URL(f, dir), 'utf8')));
  assert.ok(latest, 'a migration defines sync_user_data_v2');
  const sql = readFileSync(new URL(latest, dir), 'utf8');
  const allowed = sql.match(/if field_name not in \(([^)]*)\)/);
  assert.ok(allowed, `${latest}: the field allow-list moved`);
  const server = [...allowed[1].matchAll(/'([a-z_]+)'/g)].map((m) => m[1]).sort();
  const client = Object.values(USER_DATA_FIELDS).map((d) => d.remoteKey).filter(Boolean).sort();
  assert.deepEqual(server, client, `${latest} accepts other fields than USER_DATA_FIELDS' remoteKeys: a field the server refuses stops that device's sync`);
});

test('the backup refuses unsafe record keys in exactly the keyed-object fields', () => {
  const guarded = between(SCHEMA, 'for (const field of [', ']) {', 'record-key guard').match(/'([^']+)'/g).map((s) => s.slice(1, -1)).sort();
  const keyed = Object.entries(USER_DATA_FIELDS).filter(([f, d]) => d.merge === 'keyed-object' && BACKUP_FIELDS.includes(f)).map(([f]) => f).sort();
  assert.deepEqual(guarded, keyed, 'parseUserBackup checks raw record keys before the schema strips them; a keyed field outside that list could import as an empty map');
});

test('the account purge forgets every per-account store the sync engine writes', () => {
  const written = new Set();
  for (const p of ['src/lib/user-data-sync.js', 'src/lib/user-data-atomic.js']) {
    for (const m of read(p).matchAll(/'(vmx-user-[a-z-]+-v\d+:)'/g)) written.add(m[1]);
  }
  const purge = read('src/lib/account-local-purge.js');
  const purged = new Set([...purge.matchAll(/'(vmx-[a-z-]+-v\d+:)'/g)].map((m) => m[1]));
  assert.ok(written.size >= 5, `per-account prefixes found: ${[...written]}`);
  for (const prefix of written) assert.ok(purged.has(prefix), `the sync engine writes ${prefix}<account>, which a deleted account leaves on the device`);
});
