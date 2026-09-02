// ============================================================
// supabase-rls-guard.test.mjs — RLS policies & Profile Metric Guards
// ============================================================
// Ensures that database migrations and schemas enforce strict
// Row Level Security (RLS) and protect user metrics from direct
// client tampering via Supabase API / DevTools.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(process.cwd());
const MIGRATION_PATH = join(ROOT, 'supabase/migrations/20260815000000_pr1_critical_rls_lockdown.sql');
const SCHEMA_PATH = join(ROOT, 'supabase-schema.sql');
const MIGRATIONS_DIR = join(ROOT, 'supabase/migrations');

// A guard pinned to one filename goes quiet the moment the thing it
// guards moves house. 20260815000000 was timestamped BEHIND the
// 2026-08-24 hardening pass, so it never applied anywhere and the
// trigger + leaderboard RPC were re-landed in a later migration; these
// assertions kept passing while reading a file production had never
// run. So: for objects that can be re-landed, read whichever migration
// defines them LAST — that is the one a fresh rebuild ends on.
function latestDefining(pattern) {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort();
  for (let i = files.length - 1; i >= 0; i--) {
    const sql = readFileSync(join(MIGRATIONS_DIR, files[i]), 'utf8');
    if (pattern.test(sql)) return sql;
  }
  throw new Error(`no migration defines ${pattern}`);
}

const TRIGGER_SQL = () => latestDefining(/CREATE OR REPLACE FUNCTION\s+(public\.)?protect_profile_metrics/i);
const RPC_SQL = () => latestDefining(/CREATE OR REPLACE FUNCTION\s+(public\.)?get_global_leaderboard/i);

test('PR1 migration file exists', () => {
  assert.equal(existsSync(MIGRATION_PATH), true, 'PR1 migration file must exist');
});

test('the live protect_profile_metrics trigger is SECURITY DEFINER with a locked search_path', () => {
  const sql = TRIGGER_SQL();

  assert.match(sql, /CREATE OR REPLACE FUNCTION\s+(public\.)?protect_profile_metrics/i);
  assert.match(sql, /SECURITY DEFINER/i, 'Trigger function must be SECURITY DEFINER');
  assert.match(sql, /SET search_path\s*=\s*public,\s*pg_temp/i, 'Must lock search_path to prevent injection');
  assert.match(sql, /NEW\.total_attempts\s*:=\s*OLD\.total_attempts/i, 'Must preserve total_attempts for client updates');
  assert.match(sql, /NEW\.total_correct\s*:=\s*OLD\.total_correct/i, 'Must preserve total_correct for client updates');
  assert.match(sql, /NEW\.streak\s*:=\s*OLD\.streak/i, 'Must preserve streak for client updates');
  assert.match(sql, /CREATE TRIGGER tr_protect_profile_metrics/i, 'Must register trigger on profiles table');
});

test('protect_profile_metrics trusts non-HTTP sessions (empty JWT claims), not just service_role', () => {
  const sql = TRIGGER_SQL();

  // Regression: the original check COALESCE(auth.jwt()->>'role','anon')
  // treated cron / SQL-editor / db-script sessions (which carry no JWT
  // claims at all) as untrusted and silently reverted their writes.
  assert.match(
    sql,
    /current_setting\('request\.jwt\.claims',\s*true\)/i,
    'Must read request.jwt.claims directly so empty claims = trusted internal session',
  );
  assert.match(
    sql,
    /claims\s*=\s*''\s*THEN\s*\n?\s*RETURN NEW/i,
    'Empty claims (non-HTTP session) must pass through untouched',
  );
});

test('global leaderboard goes through SECURITY DEFINER RPC, not a broad SELECT policy', () => {
  const sql = RPC_SQL();

  // Regression: "OR group_id IS NULL" made every solo attempt of every
  // user readable by all authenticated users. Strip -- comments first
  // so explanatory prose can't trip (or mask) the check.
  const sqlStatements = readFileSync(MIGRATION_PATH, 'utf8').replace(/^\s*--.*$/gm, '');
  assert.doesNotMatch(
    sqlStatements,
    /group_id\s+IS\s+NULL/i,
    'exam_results SELECT policy must not expose all NULL-group rows',
  );
  assert.match(
    sql,
    /CREATE OR REPLACE FUNCTION\s+(public\.)?get_global_leaderboard/i,
    'Must provide the global leaderboard RPC',
  );
  assert.match(
    sql,
    /get_global_leaderboard[\s\S]*SECURITY DEFINER/i,
    'Leaderboard RPC must be SECURITY DEFINER',
  );
  assert.match(
    sql,
    /show_on_leaderboard/i,
    'Leaderboard RPC must honor the show_on_leaderboard opt-out',
  );
  assert.match(
    sql,
    /GRANT EXECUTE ON FUNCTION\s+(public\.)?get_global_leaderboard[\s\S]*TO\s+authenticated/i,
    'Leaderboard RPC must be executable by authenticated users only',
  );
});

test('migration is reproducible on a fresh DB (race_results DDL precedes its ALTER)', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const createAt = sql.search(/CREATE TABLE IF NOT EXISTS\s+(public\.)?race_results/i);
  const alterAt = sql.search(/ALTER TABLE\s+(public\.)?race_results\s+ENABLE ROW LEVEL SECURITY/i);
  assert.ok(createAt !== -1, 'race_results CREATE TABLE must exist in the repo');
  assert.ok(alterAt !== -1, 'race_results ALTER must exist');
  assert.ok(createAt < alterAt, 'race_results table must be created before it is altered');
});

test('exam_results and race_results are immutable (no UPDATE/DELETE policies granted)', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  // Must enable RLS
  assert.match(sql, /ALTER TABLE\s+(public\.)?exam_results\s+ENABLE ROW LEVEL SECURITY/i);
  assert.match(sql, /ALTER TABLE\s+(public\.)?race_results\s+ENABLE ROW LEVEL SECURITY/i);

  // Must drop any permissive update/delete policies
  assert.match(sql, /DROP POLICY IF EXISTS ".*update.*" ON public\.exam_results/i);
  assert.match(sql, /DROP POLICY IF EXISTS ".*delete.*" ON public\.exam_results/i);
  assert.match(sql, /DROP POLICY IF EXISTS ".*update.*" ON public\.race_results/i);
  assert.match(sql, /DROP POLICY IF EXISTS ".*delete.*" ON public\.race_results/i);

  // Ensure no CREATE POLICY FOR UPDATE or FOR DELETE exists on exam_results or race_results
  const policyCreates = sql.split(/CREATE POLICY/i).slice(1);
  for (const pol of policyCreates) {
    if (/ON\s+(public\.)?exam_results/i.test(pol) || /ON\s+(public\.)?race_results/i.test(pol)) {
      assert.doesNotMatch(pol, /FOR\s+(UPDATE|DELETE|ALL)/i, 'exam_results and race_results must only allow SELECT and INSERT');
    }
  }
});

test('user_data strictly isolates tenant access with auth.uid() = user_id', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  assert.match(sql, /ALTER TABLE\s+(public\.)?user_data\s+ENABLE ROW LEVEL SECURITY/i);
  assert.match(sql, /CREATE POLICY "udata_select_own"\s+ON\s+public\.user_data\s+FOR SELECT[\s\S]*auth\.uid\(\)\s*=\s*user_id/i);
  assert.match(sql, /CREATE POLICY "udata_insert_own"\s+ON\s+public\.user_data\s+FOR INSERT[\s\S]*auth\.uid\(\)\s*=\s*user_id/i);
  assert.match(sql, /CREATE POLICY "udata_update_own"\s+ON\s+public\.user_data\s+FOR UPDATE[\s\S]*auth\.uid\(\)\s*=\s*user_id/i);
});

test('pdf_annotations has a repo copy of record that isolates rows by owner', () => {
  // The table was created live on 2026-08-31 and the client has synced to it
  // since; a fresh rebuild came out without it and nobody could review its
  // policies from the repo.
  const sql = latestDefining(/create table if not exists\s+public\.pdf_annotations/i);
  assert.match(sql, /primary key \(user_id, doc_hash\)/i, 'one row per (user, document)');
  assert.match(sql, /alter table public\.pdf_annotations enable row level security/i);
  for (const verb of ['select', 'insert', 'update', 'delete']) {
    const policy = new RegExp(`create policy "pdf_annotations_${verb}_own"[\\s\\S]*?for ${verb}[\\s\\S]*?to authenticated[\\s\\S]*?\\(select auth\\.uid\\(\\)\\) = user_id`, 'i');
    assert.match(sql, policy, `${verb} is not gated to the owning user`);
  }
  assert.match(sql, /with check \(\(select auth\.uid\(\)\) = user_id\)/i, 'update must carry WITH CHECK so a row cannot be reassigned');
  assert.match(sql, /revoke all privileges on table public\.pdf_annotations from anon/i, 'anon keeps the default grants otherwise');
  assert.match(sql, /pg_column_size\(data\) <= 8 \* 1024 \* 1024/i, 'the 8 MB row guard is missing');
});

test('supabase-schema.sql is in sync with PR1 profile protection', () => {
  const schemaSql = readFileSync(SCHEMA_PATH, 'utf8');

  assert.match(schemaSql, /protect_profile_metrics/i, 'supabase-schema.sql must include protect_profile_metrics');
  assert.match(schemaSql, /tr_protect_profile_metrics/i, 'supabase-schema.sql must include tr_protect_profile_metrics');
});
