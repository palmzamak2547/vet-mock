// ============================================================
// library-pii-held-not-served.test.mjs — a held document's text is never served
// ============================================================
// On 7 Nov 2026 seventy public documents whose stored pages list students were
// marked pii_held after the fact, and their text stayed findable: library_search
// and the page policy looked at status alone. Since migration 20261107140012
// every path that serves page text skips a held document. These pin that the
// newest definition of each path still does, that the status rule stays, and
// that the audit checks the same three paths on production.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NOT_HELD, servingRuleSql, rosterSql } from '../../scripts/audit-library-pii.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DIR = path.join(ROOT, 'supabase/migrations');
const migrations = fs.readdirSync(DIR).filter((f) => f.endsWith('.sql')).sort()
  .map((f) => ({ file: f, sql: fs.readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n') }));

// The newest migration that (re)defines something, and the statement doing it.
function newest(marker) {
  const hit = migrations.filter((m) => m.sql.includes(marker)).at(-1);
  assert.ok(hit, `no migration defines ${marker}`);
  const at = hit.sql.lastIndexOf(marker);
  const end = marker.includes('function ') ? hit.sql.indexOf('$$;', at) : hit.sql.indexOf(';', at);
  return { file: hit.file, statement: hit.sql.slice(at, end) };
}

test('library_search keeps its status rule and skips held documents', () => {
  const { file, statement } = newest('create or replace function public.library_search(');
  assert.ok(statement.includes(`d.status = any ($1) and d.${NOT_HELD}`), `${file} must filter status and held documents`);
  assert.ok(statement.includes('security definer'), 'it applies the rule itself, so it stays the one that does');
});

test('library_search asks the Chula wall before it reads a page', () => {
  // Row security cannot see into a SECURITY DEFINER function, so without this
  // the wall's Data API gate was the only thing between anon and the snippets.
  const { file, statement } = newest('create or replace function public.library_search(');
  const guard = statement.indexOf('if not public.chula_access() then');
  assert.ok(guard > 0, `${file}: library_search must ask chula_access()`);
  assert.ok(guard < statement.indexOf('terms := array('), 'and ask before it reads anything');
  assert.match(statement.slice(guard, statement.indexOf('end if;', guard)), /\breturn;/);
});

for (const table of ['library_doc_pages', 'library_doc_links']) {
  test(`the select policy on ${table} skips held documents, USING only`, () => {
    const { file, statement } = newest(`"${table} follow their document"`);
    assert.match(statement, /\busing\s*\(/i, `${file}: the policy has a USING clause`);
    assert.ok(statement.includes(`d.id = doc_id and d.${NOT_HELD}`), `${file}: the newest policy must skip held documents`);
    assert.doesNotMatch(statement, /with\s+check/i, 'a select policy takes no WITH CHECK');
  });
}

test('the AI reads library pages as the member or anon, so the page policy applies to it', () => {
  const src = fs.readFileSync(path.join(ROOT, 'api/_lib/ai/library.js'), 'utf8');
  assert.match(src, /VITE_SUPABASE_ANON_KEY \|\| env\.SUPABASE_ANON_KEY/);
  assert.doesNotMatch(src, /SERVICE_ROLE/i, 'a service key would read past every policy');
});

test('the audit checks all three paths on production and counts only served text', () => {
  const rule = servingRuleSql();
  assert.match(rule, /library_search\(text,int\)/);
  assert.match(rule, /library_doc_pages follow their document/);
  assert.match(rule, /library_doc_links follow their document/);
  assert.match(rule, /chula_access/, 'and that library_search still asks the wall');
  assert.ok(rosterSql().includes(`d.status = 'public' and d.${NOT_HELD}`));
});

// Since migration 20261114120000 a held document is not listed or opened either:
// the catalogue policies and library_doc_for_signing skip it, except for the admin,
// who reviews it. scripts/test-library-held-db.mjs walks every door against a
// real database; these pin the newest definitions and keep that harness current.

test('both select policies on library_docs skip held documents, and only the admin is excepted', () => {
  const anon = newest('create policy "library_docs anon read"');
  assert.match(anon.statement, /to anon\s/);
  assert.ok(anon.statement.includes(`status = 'public' and ${NOT_HELD}`), `${anon.file}: the anon policy must skip held documents`);
  const member = newest('create policy "library_docs member read"');
  assert.ok(member.statement.includes(`(${NOT_HELD} or (select public.is_admin()))`), `${member.file}: the member policy must skip held documents for all but the admin`);
  assert.ok(member.statement.includes(`status in ('public', 'restricted')`), 'the status rule stays');
  // The old name granted anon and authenticated alike on status alone: it must stay dropped.
  const old = migrations.filter((m) => m.sql.includes('create policy "library_docs public read"')).at(-1);
  const dropped = migrations.filter((m) => m.sql.includes('drop policy if exists "library_docs public read"')).at(-1);
  assert.ok(dropped.file > old.file, 'library_docs public read is dropped after it was last created');
});

// The newest of several spellings of one definition (create, or create or replace).
function newestOf(...markers) {
  return markers.map((m) => { try { return newest(m); } catch { return null; } }).filter(Boolean)
    .sort((a, b) => a.file.localeCompare(b.file)).at(-1);
}
const SIGNING = ['create or replace function public.library_doc_for_signing(', 'create function public.library_doc_for_signing('];

test('library_doc_for_signing gives no row for a held document but to the admin', () => {
  const { file, statement } = newestOf(...SIGNING);
  const where = statement.slice(statement.lastIndexOf('where d.slug = p_slug'));
  assert.ok(where.includes(`and (d.${NOT_HELD} or public.is_admin())`), `${file}: the held rule must be in WHERE, not only on the key`);
  assert.ok(where.includes(`d.status in ('public', 'restricted')`), 'archived and draft stay unserved');
  assert.match(statement, /security definer/);
  assert.match(statement, /set search_path = public, pg_temp/);
  assert.match(statement, /\bheld boolean\b/, 'the admin row says it is held, so the API never caches it as public');
});

test('the database harness applies the newest definition of every door', () => {
  const harness = fs.readFileSync(path.join(ROOT, 'scripts/test-library-held-db.mjs'), 'utf8');
  for (const marker of [
    'create policy "library_docs anon read"',
    'create policy "library_docs member read"',
    'create or replace function public.library_search(',
    '"library_doc_pages follow their document"',
    '"library_doc_links follow their document"',
    'create or replace function public.library_related(',
  ]) {
    const { file } = newest(marker);
    assert.ok(harness.includes(`'${file}'`), `scripts/test-library-held-db.mjs must apply ${file} (it defines ${marker})`);
  }
  const { file } = newestOf(...SIGNING);
  assert.ok(harness.includes(`'${file}'`), `scripts/test-library-held-db.mjs must apply ${file} (it defines library_doc_for_signing)`);
});

test('the audit checks the catalogue policies and library_doc_for_signing on production', () => {
  const rule = servingRuleSql();
  assert.match(rule, /tablename = 'library_docs' and cmd in \('SELECT', 'ALL'\) and permissive = 'PERMISSIVE'/, 'every permissive policy that reads, not one by name');
  assert.match(rule, /library_doc_for_signing\(text\)/);
  assert.match(rule, / as catalogue,/);
  assert.match(rule, / as signing,/);
});

test('/api/library-file signs a held row (only the admin gets one) as restricted, never as a public offline copy', async (t) => {
  const { default: handler } = await import('../../api/library-file.js');
  const { verifyBlobToken } = await import('../../api/_lib/blob-token.js');
  const previous = { ...process.env }; const previousFetch = globalThis.fetch;
  Object.assign(process.env, { VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_ANON_KEY: 'anon-key', CLOUDFLARE_API_TOKEN: 'test-only', R2_ACCOUNT_ID: 'acct' });
  for (const k of ['R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY']) delete process.env[k];
  t.after(() => { process.env = previous; globalThis.fetch = previousFetch; });
  const row = { slug: 'class-list-abc123', status: 'public', storage_provider: 'r2', storage_bucket: 'vetmock-library', storage_key: 'docs/abc.pdf', mime: 'application/pdf', byte_size: 1000, held: true };
  globalThis.fetch = async (url) => {
    if (String(url).endsWith('/rest/v1/rpc/chula_access_state')) return Response.json({ enforce: false, member: false, signed_in: false, uid: null });
    return Response.json([row]);
  };
  const mint = async () => {
    const res = { statusCode: 0, headers: {}, body: '', setHeader(k, v) { this.headers[k] = v; }, end(b = '') { this.body = b; } };
    await handler({ method: 'GET', url: `/api/library-file?slug=${row.slug}`, headers: {} }, res);
    assert.equal(res.statusCode, 200, res.body);
    const link = new URL(JSON.parse(res.body).url, 'https://vetmock.com');
    return { cache: res.headers['Cache-Control'], access: verifyBlobToken(link.searchParams.get('t'), link.searchParams.get('s')).a };
  };
  assert.deepEqual(await mint(), { cache: 'no-store', access: 'restricted' });
  row.held = false;
  const open = await mint();
  assert.equal(open.access, 'public', 'an unheld public row is signed as before');
  assert.match(open.cache, /^private, max-age=\d+$/);
});
