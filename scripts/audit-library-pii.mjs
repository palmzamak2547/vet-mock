#!/usr/bin/env node
// ============================================================
// audit-library-pii.mjs — library rows that must not be public
// ============================================================
// Read only. It lists:
//   1. public library_docs rows whose title or original file name reads as a
//      score or grade announcement (scripts/lib/library-pii.mjs, the rule
//      mcv-manifest.mjs and the ingest scripts enforce);
//   2. public rows whose stored page text has a page of ROSTER_IDS or more
//      student-ID-like numbers: searchable today, and library-pages.py would
//      now hold them;
//   3. held rows (text_status pii_held) that still have pages stored, which a
//      hold promises they do not;
// and, for information only, public rows already held from search.
// It changes nothing and prints no page text. A person decides what happens
// to each row. Exit 1 when sections 1 to 3 list anything.
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

/** Public rows whose title or source file name reads as a score or grade announcement. */
export function scoreTitleRows(rows) {
  return rows
    .filter((r) => r.status === 'public')
    .map((r) => ({ ...r, reason: scoreSheetReason({ title: r.title, sourceUrl: r.source_url }) }))
    .filter((r) => r.reason);
}

const lit = (s) => `'${String(s).replace(/'/g, "''")}'`;

/** Per public document: pages with ROSTER_IDS or more student-ID-like numbers. Counts only. */
export function rosterSql(pattern = ROSTER_ID_PATTERN, min = ROSTER_IDS) {
  return `with c as (
    select p.doc_id, p.page, regexp_count(p.body, ${lit(pattern)}) as n
    from library_doc_pages p join library_docs d on d.id = p.doc_id
    where d.status = 'public')
  select d.id, d.title, d.subject, d.text_status,
    count(*) filter (where c.n >= ${Number(min)}) as pages, max(c.n) as most, sum(c.n) as ids
  from c join library_docs d on d.id = c.doc_id
  group by d.id having max(c.n) >= ${Number(min)}
  order by d.subject, d.title`;
}

const line = (r, extra) => `  ${r.id}  ${r.subject ?? '-'}  "${r.title}"  ${extra}`;

async function main() {
  const docs = await sql('select id, title, subject, status, text_status, mime, source_url from library_docs');
  const titled = scoreTitleRows(docs);
  const rosters = await sql(rosterSql());
  const heldWithPages = await sql(`select d.id, d.title, d.subject, d.status, count(*) as pages
    from library_docs d join library_doc_pages p on p.doc_id = d.id
    where d.text_status = 'pii_held' group by d.id order by d.subject, d.title`);
  const heldPublic = docs.filter((r) => r.status === 'public' && r.text_status === 'pii_held');

  console.log(`library_docs: ${docs.length} rows, ${docs.filter((r) => r.status === 'public').length} public\n`);

  console.log(`1. Public rows titled as a score or grade announcement: ${titled.length}`);
  for (const r of titled) console.log(line(r, `[${r.text_status ?? 'unread'}, ${r.mime}] ${r.reason}`));

  console.log(`\n2. Public rows with a page of ${ROSTER_IDS}+ student-ID-like numbers in searchable text: ${rosters.length}`);
  const bySubject = new Map();
  for (const r of rosters) bySubject.set(r.subject, (bySubject.get(r.subject) || 0) + 1);
  if (rosters.length) console.log(`   by subject: ${[...bySubject].map(([s, n]) => `${s} ${n}`).join(', ')}`);
  for (const r of rosters) console.log(line(r, `[${r.text_status}] ${r.ids} IDs, ${r.pages} page(s) of ${ROSTER_IDS}+, at most ${r.most} on one page`));

  console.log(`\n3. Held rows (pii_held) that still have stored pages: ${heldWithPages.length}`);
  for (const r of heldWithPages) console.log(line(r, `[${r.status}] ${r.pages} page(s) of text stored`));

  console.log(`\nFor information: ${heldPublic.length} public row(s) are held from search (pii_held); their files still open for members.`);
  for (const r of heldPublic) console.log(line(r, `[${r.mime}]`));

  const found = titled.length + rosters.length + heldWithPages.length;
  console.log(found ? `\n${found} row(s) listed in 1 to 3. Nothing was changed.` : '\nClean: nothing listed in 1 to 3. Nothing was changed.');
  if (found) process.exitCode = 1;
}

const entry = process.argv[1]?.replace(/\\/g, '/');
if (entry && import.meta.url.endsWith(entry.split('/').pop())) {
  main().catch((e) => { console.error(`audit failed: ${e.message}`); process.exit(2); });
}
