#!/usr/bin/env node
// ============================================================
// audit-library-pii.mjs — library text and titles that must not be served
// ============================================================
// Read only. It checks, and exits 1 when any of these fails or lists a row:
//   0. the database still refuses to serve a held document's text:
//      library_search and the select policies on library_doc_pages and
//      library_doc_links all skip text_status 'pii_held'
//      (supabase/migrations/20261107140012_library_pii_held_not_served.sql),
//      and library_search still asks chula_access() itself (20261107141605);
//      and a held document is not listed or opened: every permissive select
//      policy on library_docs and library_doc_for_signing skip it, except for
//      the admin (20261114120000_library_held_not_listed_or_opened.sql);
//   1. public library_docs rows whose title or original file name reads as a
//      score or grade announcement (scripts/lib/library-pii.mjs, the rule
//      mcv-manifest.mjs and the ingest scripts enforce);
//   2. served text with a page of ROSTER_IDS or more student-ID-like numbers:
//      a public document that is not held, whose stored pages search and the
//      AI can read. library-pages.py would hold it today.
// For information only, it counts held documents whose text is still stored
// (not served; what happens to it is a person's decision) and lists the
// archived ones among them.
// It changes nothing and prints no page text.
//
//   SUPABASE_ACCESS_TOKEN=<Management API PAT> node scripts/audit-library-pii.mjs

import { ROSTER_ID_PATTERN, ROSTER_IDS, scoreSheetReason } from './lib/library-pii.mjs';

const REF = 'mpovsdzdggvksmeehqfj';

async function sql(query) {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) throw new Error('missing env SUPABASE_ACCESS_TOKEN (a Supabase Management API token)');
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'vetmock-audit-library-pii' },
      body: JSON.stringify({ query }),
    });
    if (res.ok) return res.json();
    if ((res.status === 429 || res.status >= 500) && attempt < 5) { await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt)); continue; }
    throw new Error(`SQL ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
}

// The condition every text-serving path must carry, as the migration writes it.
export const NOT_HELD = "text_status is distinct from 'pii_held'";

/** One row: does each serving path still skip held documents? Postgres keeps a
 *  function body as written and prints a policy back as an expression
 *  ("IS DISTINCT FROM 'pii_held'::text"), so both are read case-blind. */
export function servingRuleSql() {
  const has = (expr) => `coalesce(${expr} ~* 'text_status is distinct from ''pii_held''', false)`;
  const policy = (table) => `(select string_agg(qual, ' ') from pg_policies
      where schemaname = 'public' and tablename = '${table}' and policyname = '${table} follow their document')`;
  const search = `pg_get_functiondef('public.library_search(text,int)'::regprocedure)`;
  const signing = `pg_get_functiondef('public.library_doc_for_signing(text)'::regprocedure)`;
  // Every permissive policy that grants reads on the catalogue (SELECT or ALL), so a new one without the rule fails too.
  const catalogue = `(select count(*) > 0 and bool_and(${has('qual')}) from pg_policies
      where schemaname = 'public' and tablename = 'library_docs' and cmd in ('SELECT', 'ALL') and permissive = 'PERMISSIVE')`;
  return `select
    ${has(search)} as search,
    ${has(policy('library_doc_pages'))} as pages,
    ${has(policy('library_doc_links'))} as links,
    coalesce(${catalogue}, false) as catalogue,
    ${has(signing)} as signing,
    coalesce(${search} ~* 'if not public\\.chula_access\\(\\) then', false) as wall`;
}

/** Public rows whose title or source file name reads as a score or grade announcement. */
export function scoreTitleRows(rows) {
  return rows
    .filter((r) => r.status === 'public')
    .map((r) => ({ ...r, reason: scoreSheetReason({ title: r.title, sourceUrl: r.source_url }) }))
    .filter((r) => r.reason);
}

const lit = (s) => `'${String(s).replace(/'/g, "''")}'`;

/** Per served document (public, not held): pages with ROSTER_IDS or more student-ID-like numbers. Counts only. */
export function rosterSql(pattern = ROSTER_ID_PATTERN, min = ROSTER_IDS) {
  return `with c as (
    select p.doc_id, p.page, regexp_count(p.body, ${lit(pattern)}) as n
    from library_doc_pages p join library_docs d on d.id = p.doc_id
    where d.status = 'public' and d.${NOT_HELD})
  select d.id, d.title, d.subject, d.text_status,
    count(*) filter (where c.n >= ${Number(min)}) as pages, max(c.n) as most, sum(c.n) as ids
  from c join library_docs d on d.id = c.doc_id
  group by d.id having max(c.n) >= ${Number(min)}
  order by d.subject, d.title`;
}

const line = (r, extra) => `  ${r.id}  ${r.subject ?? '-'}  "${r.title}"  ${extra}`;

async function main() {
  const [rule] = await sql(servingRuleSql());
  const docs = await sql('select id, title, subject, status, text_status, mime, source_url from library_docs');
  const titled = scoreTitleRows(docs);
  const rosters = await sql(rosterSql());
  const heldStored = await sql(`select d.id, d.title, d.subject, d.status, count(*) as pages
    from library_docs d join library_doc_pages p on p.doc_id = d.id
    where d.text_status = 'pii_held' group by d.id order by d.status, d.subject, d.title`);
  const heldPublic = docs.filter((r) => r.status === 'public' && r.text_status === 'pii_held');

  const missing = Object.entries(rule).filter(([, ok]) => !ok).map(([k]) => k);
  console.log(`0. A held document is never served, and library_search asks the Chula wall: ${missing.length ? `MISSING in ${missing.join(', ')}` : 'library_search, the page and link policies, the catalogue policies and library_doc_for_signing all skip pii_held; library_search calls chula_access()'}`);
  console.log(`\nlibrary_docs: ${docs.length} rows, ${docs.filter((r) => r.status === 'public').length} public`);

  console.log(`\n1. Public rows titled as a score or grade announcement: ${titled.length}`);
  for (const r of titled) console.log(line(r, `[${r.text_status ?? 'unread'}, ${r.mime}] ${r.reason}`));

  console.log(`\n2. Served text with a page of ${ROSTER_IDS}+ student-ID-like numbers: ${rosters.length}`);
  const bySubject = new Map();
  for (const r of rosters) bySubject.set(r.subject, (bySubject.get(r.subject) || 0) + 1);
  if (rosters.length) console.log(`   by subject: ${[...bySubject].map(([s, n]) => `${s} ${n}`).join(', ')}`);
  for (const r of rosters) console.log(line(r, `[${r.text_status}] ${r.ids} IDs, ${r.pages} page(s) of ${ROSTER_IDS}+, at most ${r.most} on one page`));

  const archivedStored = heldStored.filter((r) => r.status !== 'public');
  console.log(`\nFor information: ${heldPublic.length} public row(s) are held (pii_held): a member is served neither their row, their file nor their text.`);
  console.log(`${heldStored.length} held row(s) still have text stored, not served; ${archivedStored.length} of them archived, which a person decides on:`);
  for (const r of archivedStored) console.log(line(r, `[${r.status}] ${r.pages} page(s) of text stored`));

  const found = missing.length + titled.length + rosters.length;
  console.log(found ? `\n${found} problem(s) in 0 to 2. Nothing was changed.` : '\nClean: nothing in 0 to 2. Nothing was changed.');
  if (found) process.exitCode = 1;
}

const entry = process.argv[1]?.replace(/\\/g, '/');
if (entry && import.meta.url.endsWith(entry.split('/').pop())) {
  main().catch((e) => { console.error(`audit failed: ${e.message}`); process.exit(2); });
}
