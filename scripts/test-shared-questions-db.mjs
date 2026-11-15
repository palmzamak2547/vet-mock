// public.shared_questions keeps a question and refuses anything else, in a
// disposable database only
// (supabase/migrations/20261115120000_shared_questions_data_shape.sql).
// Local: PGLITE_MODULE=/path/to/@electric-sql/pglite/dist/index.js node scripts/test-shared-questions-db.mjs
// CI:    PG_CONTAINER=<postgres:17.6 service ID> node scripts/test-shared-questions-db.mjs --backend=postgres
// Never accepts a database URL: the native adapter only talks to the dedicated CI container.
//
// Every value in scripts/lib/shared-question-shapes.mjs is inserted and must be
// kept or refused as the table says; tests/unit/shared-questions-shape.test.mjs
// holds the app to the same table. The steps a reviewer takes on production are
// walked too: the migration adds the constraint without looking at rows already
// there, the count query in its comment finds them, and validation succeeds
// only once that count is 0.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ALL_SHAPES } from './lib/shared-question-shapes.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const MIGRATION = path.join(ROOT, 'supabase/migrations/20261115120000_shared_questions_data_shape.sql');
const backend = process.argv.find((a) => a.startsWith('--backend='))?.slice(10) || 'pglite';
assert(['pglite', 'postgres'].includes(backend));

const q = (v) => `'${String(v).replaceAll("'", "''")}'`;

let run, cleanup = async () => {};
if (backend === 'pglite') {
  const modulePath = process.env.PGLITE_MODULE;
  assert(modulePath, 'Set PGLITE_MODULE to @electric-sql/pglite/dist/index.js');
  const { PGlite } = await import(pathToFileURL(path.resolve(modulePath)).href);
  const pg = new PGlite();
  await pg.waitReady;
  run = async (sql) => {
    try {
      const results = await pg.exec(sql);
      const last = [...results].reverse().find((r) => r.fields?.length);
      return last?.rows?.[0] ? String(Object.values(last.rows[0])[0] ?? '') : null;
    } catch (error) {
      await pg.exec('rollback;').catch(() => {});
      throw error;
    }
  };
  cleanup = () => pg.close();
} else {
  assert.equal(process.env.GITHUB_ACTIONS, 'true', 'Native mode requires the dedicated GitHub Actions test service');
  const container = process.env.PG_CONTAINER;
  assert(/^[a-f0-9]{64}$/.test(container || ''), 'Missing dedicated CI container ID');
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('PG') && k !== 'DATABASE_URL'));
  const image = spawnSync('docker', ['inspect', '--format', '{{.Config.Image}}', container], { env, encoding: 'utf8' });
  assert.equal(image.stdout.trim(), 'postgres:17.6', 'Use the dedicated exact-version CI test service');
  const database = `vmx_shared_questions_${crypto.randomBytes(8).toString('hex')}`;
  const psql = (sql, db) => {
    const r = spawnSync('docker', ['exec', '-i', container, 'psql', '-X', '-qAt', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', db],
      { env, input: sql, encoding: 'utf8', maxBuffer: 16 << 20 });
    if (r.status !== 0) throw new Error(r.stderr.slice(-1500));
    return r.stdout.trim().split('\n').filter(Boolean).at(-1) ?? null;
  };
  psql(`create database ${database};`, 'postgres');
  run = async (sql) => psql(sql, database);
  cleanup = async () => { psql(`drop database ${database} with (force);`, 'postgres'); };
}

const checks = [];
async function check(name, fn) {
  try { await fn(); checks.push({ name, ok: true }); } catch (error) { checks.push({ name, ok: false, error: String(error.message).slice(0, 600) }); }
}

const insert = (data) => `insert into public.shared_questions (group_id, author_id, author_name, data)
  values (gen_random_uuid(), gen_random_uuid(), 'friend', ${q(JSON.stringify(data))}::jsonb);`;
/** True when the row was written, false when the constraint refused it; any other error is thrown. */
async function kept(sql) {
  try {
    await run(sql);
    return true;
  } catch (error) {
    if (/shared_questions_data_shape/.test(String(error.message))) return false;
    throw error;
  }
}
const sqlText = fs.readFileSync(MIGRATION, 'utf8').replace(/\r\n/g, '\n');
const countQuery = sqlText.split('\n').filter((l) => l.startsWith('--')).map((l) => l.replace(/^--\s?/, '')).join('\n')
  .match(/select count\(\*\) as violating from public\.shared_questions where \([\s\S]+?\) is not true;/)[0];

try {
  // The table's columns as production has them; only `data` matters here.
  await run(`
    create table public.shared_questions (
      id uuid primary key default gen_random_uuid(),
      group_id uuid not null,
      author_id uuid not null,
      author_name text,
      data jsonb not null,
      created_at timestamptz not null default now()
    );
  `);

  await check('the constraint is added without looking at rows already there, and none is changed', async () => {
    await run(insert({ subject: 'com5', q: 'Still a question', tags: 'oops' }));
    await run(insert(42));
    await run(insert({ q: 'A good row from before' }));
    await run(sqlText);
    assert.equal(await run(`select count(*) from public.shared_questions;`), '3');
    assert.equal(await run(`select convalidated::text from pg_constraint where conname = 'shared_questions_data_shape';`), 'false');
  });

  await check('the count query in the comment finds the rows that break it, and validation waits for 0', async () => {
    assert.equal(await run(countQuery), '2');
    await assert.rejects(run(`alter table public.shared_questions validate constraint shared_questions_data_shape;`), /shared_questions_data_shape/);
    await run(`delete from public.shared_questions where jsonb_typeof(data) <> 'object' or jsonb_typeof(data -> 'tags') = 'string';`);
    assert.equal(await run(countQuery), '0');
    await run(`alter table public.shared_questions validate constraint shared_questions_data_shape;`);
    assert.equal(await run(`select convalidated::text from pg_constraint where conname = 'shared_questions_data_shape';`), 'true');
  });

  await check(`each of the ${ALL_SHAPES.length} values is kept or refused as the table says`, async () => {
    const wrong = [];
    for (const { name, data, kept: expected } of ALL_SHAPES) {
      if (await kept(insert(data)) !== expected) wrong.push(`${name}: expected ${expected ? 'kept' : 'refused'}`);
    }
    assert.deepEqual(wrong, []);
  });

  await check('an update is held to the same shape as an insert', async () => {
    const id = await run(`${insert({ q: 'To be changed' }).replace(/;$/, '')} returning id::text;`);
    assert.equal(await kept(`update public.shared_questions set data = '{"q":"x","tags":"oops"}'::jsonb where id = ${q(id)};`), false);
    assert.equal(await kept(`update public.shared_questions set data = data || '{"tags":["pharm"]}'::jsonb where id = ${q(id)};`), true);
  });

  await check('the count query finds nothing among the rows the table keeps', async () => {
    assert.equal(await run(countQuery), '0');
  });
} catch (error) {
  checks.push({ name: 'setup', ok: false, error: String(error.message).slice(0, 1500) });
} finally {
  try { await cleanup(); } catch (error) { checks.push({ name: 'cleanup', ok: false, error: String(error.message).slice(0, 600) }); }
}

const failed = checks.filter((c) => !c.ok);
for (const c of checks) console.log(`${c.ok ? 'ok  ' : 'FAIL'} ${c.name}${c.ok ? '' : `\n     ${c.error}`}`);
console.log(JSON.stringify({ backend, passed: checks.length - failed.length, failed: failed.length }));
process.exitCode = failed.length || checks.length < 5 ? 1 : 0;
