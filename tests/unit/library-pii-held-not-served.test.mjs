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
