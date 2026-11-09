// ============================================================
// library-read.mjs — a script reads the study library past the Chula wall
// ============================================================
// Since 5.184.0 the library answers Chula members only: with the anon key the
// Data API refuses every library read (HTTP 401, chula_member_required), and
// /api/library-file signs a link only for a member. A script has no member
// session, so, like library-pages.py and library-links.mjs, it reads the
// catalog through the Supabase Management API (SUPABASE_ACCESS_TOKEN) and a
// file's bytes straight from R2 (CLOUDFLARE_API_TOKEN and R2_ACCOUNT_ID, as in
// .r2env). It reads only what a member is served: public documents, never one
// held for personal data (text_status 'pii_held').

const REF = 'mpovsdzdggvksmeehqfj';

/** The documents a member is served, as a condition on library_docs d. */
export const SERVED = "d.status = 'public' and d.text_status is distinct from 'pii_held'";

const lit = (s) => `'${String(s).replace(/'/g, "''")}'`;

export async function librarySql(query, { env = process.env, fetchImpl = fetch } = {}) {
  const token = env.SUPABASE_ACCESS_TOKEN;
  if (!token) {
    throw new Error('the library is behind the Chula wall: set SUPABASE_ACCESS_TOKEN (a Supabase Management API token), as for library-pages.py');
  }
  for (let attempt = 0; ; attempt++) {
    const res = await fetchImpl(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'vetmock-library-read' },
      body: JSON.stringify({ query }),
    });
    if (res.ok) return res.json();
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt));
      continue;
    }
    throw new Error(`library ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}

/** Every served document: id, slug, title, subject, kind. */
export function libraryCatalog(opts) {
  return librarySql(`select d.id, d.slug, d.title, d.subject, d.kind from library_docs d where ${SERVED} order by d.id`, opts);
}

/** Page one of each listed document that has it stored, served documents only. */
export function libraryFirstPages(ids, opts) {
  if (!ids.length) return Promise.resolve([]);
  return librarySql(`select p.doc_id, p.body from library_doc_pages p join library_docs d on d.id = p.doc_id
    where p.page = 1 and ${SERVED} and p.doc_id in (${ids.map((id) => `${lit(id)}::uuid`).join(',')})`, opts);
}

/** A served document's bytes, read from R2. */
export async function libraryFileBytes(slug, { env = process.env, fetchImpl = fetch } = {}) {
  const [doc] = await librarySql(`select d.storage_provider, d.storage_bucket, d.storage_key from library_docs d
    where d.slug = ${lit(slug)} and ${SERVED}`, { env, fetchImpl });
  if (!doc) throw new Error(`${slug} is not a served library document`);
  if (doc.storage_provider !== 'r2' || !doc.storage_key) throw new Error(`${slug} is stored in ${doc.storage_provider}, not R2: fetch it by hand`);
  const { R2_ACCOUNT_ID: account, CLOUDFLARE_API_TOKEN: cf } = env;
  if (!account || !cf) throw new Error('set R2_ACCOUNT_ID and CLOUDFLARE_API_TOKEN (.r2env) to read a file from R2');
  const bucket = doc.storage_bucket || env.R2_BUCKET || 'vetmock-library';
  const res = await fetchImpl(
    `https://api.cloudflare.com/client/v4/accounts/${account}/r2/buckets/${encodeURIComponent(bucket)}/objects/${doc.storage_key.split('/').map(encodeURIComponent).join('/')}`,
    { headers: { Authorization: `Bearer ${cf}` } },
  );
  if (!res.ok) throw new Error(`${slug} answered ${res.status} from R2`);
  return Buffer.from(await res.arrayBuffer());
}
