// The app and the shared_questions CHECK constraint agree on what a shared
// question is (supabase/migrations/20261115120000_shared_questions_data_shape.sql).
//
// The constraint is proven against a real database by
// scripts/test-shared-questions-db.mjs, which inserts every value in
// scripts/lib/shared-question-shapes.mjs. This file holds the app to the same
// table, so the two cannot drift apart:
//   - every question the app writes passes the app's own validator (the group
//     page no longer shows or writes shared questions);
//   - the count query a reviewer runs before validating is the constraint itself.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseCustomQuestion } from '../../src/lib/user-data-schema.js';
import { ALL_SHAPES, APP_WRITTEN, SENT_DIRECTLY } from '../../scripts/lib/shared-question-shapes.mjs';

const ROOT = resolve(process.cwd());
const MIGRATION = join(ROOT, 'supabase/migrations/20261115120000_shared_questions_data_shape.sql');

test('the table names every value once and says for each whether it is kept', () => {
  const names = ALL_SHAPES.map((s) => s.name);
  assert.equal(new Set(names).size, names.length, 'no two values share a name');
  for (const shape of ALL_SHAPES) assert.equal(typeof shape.kept, 'boolean', shape.name);
  assert.ok(SENT_DIRECTLY.some((s) => s.kept) && SENT_DIRECTLY.some((s) => !s.kept), 'both answers are tested');
});

// The group page no longer shows or writes shared questions (the multiplayer
// wave removed the tab, shareQuestion and readSharedQuestion, and
// shared-questions-mapper.test.mjs requires a mapper of any reader that comes
// back). What still binds the app to the table: a question it would write is
// one its own validator accepts.
test('every question the app writes is a question the app itself accepts', () => {
  for (const { name, data } of APP_WRITTEN) {
    const parsed = parseCustomQuestion(data);
    assert.ok(parsed.success, `${name}: ${parsed.reason}`);
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
