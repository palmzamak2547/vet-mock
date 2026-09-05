// ============================================================
// /api/library-file — hands a signed, short-lived link to one library doc.
// ============================================================
// The gate for the study library. The catalog row is public information —
// title, subject, page count — but the BYTES of a lecture deck are not, so
// the object store stays private and every read passes through here.
//
//   restricted  → a valid Supabase session is required
//   public      → open, for material that may be read by anyone
//   draft/archived → never served
//
// The session is verified by asking Supabase who the token belongs to,
// rather than by decoding the JWT here. Slower by one request, and it
// cannot be fooled by a token this server merely finds parseable — the
// forged-`sub` mistake already documented elsewhere in this project.
//
// Returns { url, expiresIn } rather than a 302 so the caller can decide
// between opening a tab and streaming ranges into a PDF viewer.

import { presign, r2Config, cfConfig } from './_lib/r2.js';
import { mintBlobToken } from './_lib/blob-token.js';

const ARCHIVE_ORIGIN = 'https://vetmock-library-archive.palmzamak2547.workers.dev';
let archiveIndex;
async function archives() {
  if (!archiveIndex) archiveIndex = import('../src/data/vca-materials.js').then(({ VCA_MATERIALS }) => {
    const sources = new Map(); const slugs = new Map();
    for (const file of VCA_MATERIALS.flatMap((material) => material.files).filter((file) => !file.archiveOnly)) {
      const copies = file.backups || [];
      sources.set(file.id, copies.find((copy) => copy.mime === 'application/pdf') || copies[0]);
      for (const copy of copies) slugs.set(copy.slug, { ...copy, title: file.title });
    }
    return { sources, slugs };
  });
  return archiveIndex;
}

const TTL_SECONDS = 300;

// Blob links are minted against a fixed WINDOW boundary instead of
// "now + TTL": every mint inside the same hour returns the SAME URL, so a
// student who re-opens a deck hits their browser cache instead of
// re-streaming megabytes through the function. GRACE keeps a URL minted at
// 59 minutes past usable; total lifetime never exceeds 75 minutes, so a
// pasted link still dies on its own.
const WINDOW_SEC = 3600;
const GRACE_SEC = 900;

function send(res, status, body, cacheSeconds = 0) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // Default no-store: signed URLs for restricted material are per-user.
  // Public documents opt into short private caching so a repeat open costs
  // zero requests — the URL inside is stable for the window anyway.
  res.setHeader('Cache-Control', cacheSeconds > 0 ? `private, max-age=${cacheSeconds}` : 'no-store');
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'method_not_allowed' });

  const env = process.env;
  const url = new URL(req.url, 'http://localhost');
  let slug = (url.searchParams.get('slug') || '').trim();
  if (!slug && url.searchParams.has('source')) {
    const source = url.searchParams.get('source');
    if (!/^[\w-]{10,100}$/.test(source)) return send(res, 400, { error: 'bad_source' });
    slug = (await archives()).sources.get(source)?.slug || '';
    if (!slug) return send(res, 404, { error: 'not_found' });
  }
  const sendLink = (body, cacheSeconds = 0) => {
    if (url.searchParams.get('open') === '1') {
      res.statusCode = 302;
      res.setHeader('Location', body.url);
      res.setHeader('Cache-Control', 'no-store');
      return res.end();
    }
    return send(res, 200, body, cacheSeconds);
  };
  // Thai belongs in the character class: slugify deliberately keeps Thai
  // (ตารางเรียน, เฉลย…), and the first ASCII-only guard here answered 400
  // for every Thai-titled deck in the shelf — found by running the gate
  // against a real year-5 file, not by reading the regex.
  if (!/^[a-z0-9฀-๿][a-z0-9฀-๿-]{0,160}$/.test(slug)) {
    return send(res, 400, { error: 'bad_slug' });
  }

  const base = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const anon = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;
  if (!base || !anon) return send(res, 503, { error: 'not_configured' });

  // One RPC answers everything: the row, whether it is published, and —
  // because the login rule lives in the SECURITY DEFINER function, not
  // here — whether THIS caller may see storage_key. The user's own bearer
  // token is forwarded untouched; there is no service key in this
  // environment and the design no longer wants one.
  // A Supabase JWT is base64url segments joined by dots; anything else in the
  // header is not a token this endpoint can forward. It is treated as
  // anonymous rather than rejected: a stray control character in the header
  // used to make fetch throw while building the upstream request, which then
  // surfaced as 'catalog_unavailable' and blamed the catalog.
  const rawBearer = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  const bearer = /^[A-Za-z0-9._~+/=-]{1,4096}$/.test(rawBearer) ? rawBearer : '';
  let doc;
  try {
    const r = await fetch(`${base.replace(/\/$/, '')}/rest/v1/rpc/library_doc_for_signing`, {
      method: 'POST',
      headers: {
        apikey: anon,
        Authorization: `Bearer ${bearer || anon}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_slug: slug }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return send(res, 502, { error: 'catalog_unavailable' });
    doc = (await r.json())[0];
  } catch {
    return send(res, 502, { error: 'catalog_unavailable' });
  }

  // No row: unknown slug, a draft, or archived — deliberately the same
  // answer, so drafts cannot be enumerated.
  if (!doc) return send(res, 404, { error: 'not_found' });

  // A row with no key is the RPC saying "exists, but not for you":
  // restricted material and no (valid) session. An expired token lands
  // here too, because PostgREST treats a bad JWT as anonymous.
  if (!doc.storage_key) return send(res, 401, { error: 'login_required' });

  if (doc.storage_provider !== 'r2') {
    // Supabase-hosted rows are signed in the browser against the user's own
    // session; this endpoint exists for the private object store.
    return send(res, 400, { error: 'not_r2' });
  }

  // Archive objects use a private R2 binding so large PDFs and videos can seek
  // without the management API's full-download behavior or a Vercel proxy.
  if (doc.storage_key.startsWith('archives/vca/')) {
    const copy = (await archives()).slugs.get(slug);
    if (copy) doc.file_name = copy.title.replace(/\.(pdf|docx|xlsx|mp4)$/i, '') + '.' + copy.format;
    const expiresAtSec = (Math.floor(Date.now() / 1000 / WINDOW_SEC) + 1) * WINDOW_SEC + GRACE_SEC;
    const token = mintBlobToken(doc, { expiresAtSec, env });
    if (!token) return send(res, 503, { error: 'storage_not_configured' });
    return sendLink({ url: `${ARCHIVE_ORIGIN}/?${new URLSearchParams(token)}`, expiresIn: expiresAtSec - Math.floor(Date.now() / 1000), mime: doc.mime, byteSize: doc.byte_size });
  }

  // Two ways to hand over the bytes, tried in order of preference:
  //
  //   1. Permanent S3 keys → a presigned R2 URL. The browser talks to R2
  //      directly and no function sits in the download path. Not
  //      configured today (no R2 access key exists yet), but the moment
  //      one lands in the env this branch switches on by itself.
  //
  //   2. The standing Cloudflare token → a signed, minutes-lived link to
  //      /api/library-blob, which streams through the CF REST API. Same
  //      contract as a presigned URL: possession is authorization, and it
  //      expires on its own. (R2's temp-credential mint needs a parent
  //      access key we don't have — see _lib/blob-token.js.)
  const signed = presign(doc.storage_key, {
    method: 'GET',
    expiresIn: TTL_SECONDS,
    bucket: doc.storage_bucket || undefined,
    env,
  });
  if (signed) {
    return sendLink({ url: signed, expiresIn: TTL_SECONDS, mime: doc.mime, byteSize: doc.byte_size });
  }

  if (!cfConfig(env).configured) return send(res, 503, { error: 'storage_not_configured' });
  const nowSec = Math.floor(Date.now() / 1000);
  const expiresAtSec = (Math.floor(nowSec / WINDOW_SEC) + 1) * WINDOW_SEC + GRACE_SEC;
  const tok = mintBlobToken(doc, { expiresAtSec, env });
  if (!tok) return send(res, 503, { error: 'storage_not_configured' });
  // Public rows resolve identically for every caller, so the mint response
  // itself may be cached until the window rolls — the URL inside keeps at
  // least GRACE_SEC of validity beyond that point.
  const mintCacheSec = doc.status === 'public'
    ? Math.max(0, expiresAtSec - GRACE_SEC - nowSec)
    : 0;
  return sendLink({
    url: `/api/library-blob?t=${tok.t}&s=${tok.s}`,
    expiresIn: expiresAtSec - nowSec,
    mime: doc.mime,
    byteSize: doc.byte_size,
  }, mintCacheSec);
}
