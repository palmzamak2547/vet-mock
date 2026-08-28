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

import { presignAny, r2Config, cfConfig } from './_lib/r2.js';

const TTL_SECONDS = 300;

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // A signed URL is per-request and per-user. Anything that caches this
  // response hands one student's link to the next.
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'method_not_allowed' });

  const env = process.env;
  const url = new URL(req.url, 'http://localhost');
  const slug = (url.searchParams.get('slug') || '').trim();
  if (!/^[a-z0-9][a-z0-9-]{0,120}$/.test(slug)) {
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
  const bearer = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
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

  // Either permanent S3 keys or the CF API token will do; presignAny
  // prefers the permanent keys and falls back to minting temporary ones.
  if (!r2Config(env).configured && !cfConfig(env).configured) {
    return send(res, 503, { error: 'storage_not_configured' });
  }

  let signed;
  try {
    signed = await presignAny(doc.storage_key, {
      method: 'GET',
      expiresIn: TTL_SECONDS,
      bucket: doc.storage_bucket || undefined,
      env,
    });
  } catch {
    return send(res, 503, { error: 'storage_unavailable' });
  }
  if (!signed) return send(res, 503, { error: 'storage_not_configured' });

  return send(res, 200, { url: signed, expiresIn: TTL_SECONDS, mime: doc.mime, byteSize: doc.byte_size });
}
