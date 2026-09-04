// ============================================================
// schema-bootstrap.test.mjs — the documented rebuild must run to the end
// ============================================================
// SETUP.md §3.2 tells a person rebuilding this project to paste
// supabase-schema.sql into the Supabase SQL editor and press Run. That file
// created `exam_results` without `year`/`phase`, and then 140 lines later
// defined get_global_leaderboard() whose body SELECTs r.year and r.phase.
// Postgres validates a LANGUAGE sql body at CREATE time, so the bootstrap
// did not produce a thin table — it stopped there with "column r.year does
// not exist" and left every statement after it uncreated. Nobody notices in
// daily use; you find out on the day you are rebuilding, which is the worst
// possible day, on a Free-tier project with no point-in-time recovery.
//
// race_results already carried a comment about this exact class, fixed for
// that one table and missed for this one. These assertions pin the class
// rather than the instance: any column a function body reads off a table the
// same file creates must be declared by that CREATE TABLE.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const SCHEMA = readFileSync(join(ROOT, 'supabase-schema.sql'), 'utf8');

/** Column names declared by `CREATE TABLE IF NOT EXISTS <name> ( ... );` */
function declaredColumns(table) {
  const start = SCHEMA.indexOf(`CREATE TABLE IF NOT EXISTS ${table} (`);
  assert.notEqual(start, -1, `supabase-schema.sql must create ${table}`);
  const end = SCHEMA.indexOf('\n);', start);
  assert.notEqual(end, -1, `unterminated CREATE TABLE for ${table}`);
  const body = SCHEMA.slice(start, end);
  const cols = new Set();
  for (const raw of body.split('\n').slice(1)) {
    const line = raw.trim();
    if (!line || line.startsWith('--')) continue;
    const m = /^([a-z_][a-z0-9_]*)\s+[A-Z]/.exec(line);
    if (m) cols.add(m[1]);
  }
  return cols;
}

/** `alias.column` references inside a named function's body. */
function aliasReads(fnName, alias) {
  const start = SCHEMA.indexOf(`FUNCTION ${fnName}(`);
  assert.notEqual(start, -1, `supabase-schema.sql must define ${fnName}`);
  const end = SCHEMA.indexOf('$$;', start);
  assert.notEqual(end, -1, `unterminated body for ${fnName}`);
  const body = SCHEMA.slice(start, end);
  const reads = new Set();
  for (const m of body.matchAll(new RegExp(`\\b${alias}\\.([a-z_][a-z0-9_]*)`, 'g'))) {
    reads.add(m[1]);
  }
  return reads;
}

test('exam_results declares every column the schema file\'s own leaderboard RPC reads', () => {
  const declared = declaredColumns('exam_results');
  const read = aliasReads('get_global_leaderboard', 'r');
  assert.ok(read.size > 0, 'the RPC body should read columns off its exam_results alias');
  const missing = [...read].filter((c) => !declared.has(c));
  assert.deepEqual(
    missing,
    [],
    `supabase-schema.sql would abort at CREATE FUNCTION get_global_leaderboard: `
    + `exam_results is missing ${missing.join(', ')}`,
  );
});

test('year and phase are present by name — the two the app filters and ranks on', () => {
  // Named explicitly so a future refactor of the RPC cannot make the check
  // above vacuous by dropping the reads.
  const declared = declaredColumns('exam_results');
  assert.ok(declared.has('year'), 'exam_results.year is what the year toggle filters the board by');
  assert.ok(declared.has('phase'), 'exam_results.phase is what the midterm/final board filters by');
});

test('race_results keeps the columns whose earlier absence this mirrors', () => {
  const declared = declaredColumns('race_results');
  assert.ok(declared.has('year'));
  assert.ok(declared.has('phase'));
});

test('SETUP.md does not promise a complete database from this one file', () => {
  // The file creates 7 of production's 17 tables. Claiming "เรียบร้อย!" after
  // it sends the reader away believing the library, PDF annotations, daily-Q
  // pulse, contributions and imaging tables exist. They do not.
  const setup = readFileSync(join(ROOT, 'SETUP.md'), 'utf8');
  assert.match(
    setup,
    /supabase\/migrations\//,
    'SETUP.md must point the reader at the migrations that carry the rest',
  );
  assert.doesNotMatch(
    setup,
    /Success\. No rows returned"\*\* = เรียบร้อย!/,
    'the bootstrap step must not claim a finished database',
  );
});
