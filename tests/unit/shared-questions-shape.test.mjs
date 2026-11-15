// The app and the shared_questions CHECK constraint agree on what a shared
// question is (supabase/migrations/20261115120000_shared_questions_data_shape.sql).
//
// The constraint is proven against a real database by
// scripts/test-shared-questions-db.mjs, which inserts every value in
// scripts/lib/shared-question-shapes.mjs. This file holds the app to the same
// table, so the two cannot drift apart:
//   - every question the app writes passes the app's own validator and leaves
//     shareQuestion unchanged in shape, and the table expects the database to
//     keep it;
//   - every value the database keeps, the page shows, apart from the listed
//     ones made only of spaces the database does not strip;
//   - the count query a reviewer runs before validating is the constraint itself.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseCustomQuestion } from '../../src/lib/user-data-schema.js';
import { ALL_SHAPES, APP_WRITTEN, KEPT_BUT_BLANK, SENT_DIRECTLY } from '../../scripts/lib/shared-question-shapes.mjs';

const ROOT = resolve(process.cwd());
const MIGRATION = join(ROOT, 'supabase/migrations/20261115120000_shared_questions_data_shape.sql');

// src/lib/api.js with its one browser-only import swapped for a stub client,
// as tests/unit/shared-questions-mapper.test.mjs does.
const API_PATH = join(ROOT, 'src/lib/api.js');
const supabaseStub = 'data:text/javascript,' + encodeURIComponent(
  'export const hasSupabase = true;\n'
  + 'export function getSupabase() { return Promise.resolve(globalThis.__vmxShapeSupabase); }\n',
);
// Static and dynamic imports alike: shareQuestion loads safe-url.js on demand.
const rewritten = readFileSync(API_PATH, 'utf8').replace(/(from |import\()'(\.[^']+)'/g, (_m, lead, spec) => (
  spec === './supabase.js'
    ? `${lead}'${supabaseStub}'`
    : `${lead}'${pathToFileURL(resolve(dirname(API_PATH), spec)).href}'`
));
const api = await import('data:text/javascript;base64,'
  + Buffer.from(rewritten + '\n//# sourceURL=api-shape-under-test.mjs').toString('base64'));

/** What shareQuestion hands the database as `data`. */
async function written(question) {
  let inserted;
  const chain = {
    insert(row) { inserted = row; return chain; },
    select() { return chain; },
    single() { return Promise.resolve({ data: { id: 1, ...inserted }, error: null }); },
  };
  globalThis.__vmxShapeSupabase = { from: (table) => { assert.equal(table, 'shared_questions'); return chain; } };
  await api.shareQuestion('g-1', question, 'u-1', 'friend');
  return inserted.data;
}

test('the table names every value once and says for each whether it is kept', () => {
  const names = ALL_SHAPES.map((s) => s.name);
  assert.equal(new Set(names).size, names.length, 'no two values share a name');
  for (const shape of ALL_SHAPES) assert.equal(typeof shape.kept, 'boolean', shape.name);
  assert.ok(SENT_DIRECTLY.some((s) => s.kept) && SENT_DIRECTLY.some((s) => !s.kept), 'both answers are tested');
});

test('every question the app writes is a question the app itself accepts, and shareQuestion keeps its shape', async () => {
  for (const { name, data } of APP_WRITTEN) {
    const parsed = parseCustomQuestion(data);
    assert.ok(parsed.success, `${name}: ${parsed.reason}`);
    assert.deepEqual(await written(data), data, `${name}: shareQuestion writes it as it is`);
  }
});

test('what the database keeps, the page shows, except a question made only of spaces it does not strip', () => {
  const blank = new Set(KEPT_BUT_BLANK.map((s) => s.name));
  for (const { name, data, kept } of ALL_SHAPES) {
    if (!kept) continue;
    const shown = api.readSharedQuestion({ id: 1, data });
    assert.equal(shown.invalid, blank.has(name), `${name}: ${blank.has(name) ? 'listed as cannot be shown' : 'shown'}`);
  }
});

test('a value the page cannot show is one the database refuses, or one of the listed blanks', () => {
  const blank = new Set(KEPT_BUT_BLANK.map((s) => s.name));
  for (const { name, data, kept } of ALL_SHAPES) {
    if (api.readSharedQuestion({ id: 1, data }).invalid) assert.ok(!kept || blank.has(name), name);
  }
});

test('the migration adds the constraint NOT VALID and its count query is the constraint itself', () => {
  const sql = readFileSync(MIGRATION, 'utf8').replace(/\r\n/g, '\n');
  const flat = (s) => s.replace(/\s+/g, ' ').trim();
  const statement = sql.split('\n').filter((line) => !line.startsWith('--')).join('\n');
  const check = statement.match(/add constraint shared_questions_data_shape check \(\(([\s\S]+)\) is true\) not valid;/);
  assert.ok(check, 'one constraint, added NOT VALID, tested with `is true`');
  const comment = sql.split('\n').filter((line) => line.startsWith('--')).map((line) => line.replace(/^--\s?/, '')).join('\n');
  const count = comment.match(/from public\.shared_questions where \(([\s\S]+?)\) is not true;/);
  assert.ok(count, 'the comment gives the count query');
  assert.equal(flat(count[1]), flat(check[1]), 'the count query counts exactly the rows the constraint refuses');
  assert.match(comment, /alter table public\.shared_questions validate constraint shared_questions_data_shape;/);
  assert.match(comment, /does not\s+apply it/, 'the file says it is not applied by the pull request');
  assert.doesNotMatch(statement, /\b(delete|update|drop)\b/i, 'the file changes no row and drops nothing');
});
