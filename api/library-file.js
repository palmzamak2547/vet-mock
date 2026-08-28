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

import { presign, r2Config } from './_lib/r2.js';

const TTL_SECONDS = 300;

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // A signed URL is per-request and per-user. Anything that caches this
  // response hands one student's link to the next.
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

/** Resolve a bearer token to a user via Supabase, or null. */
async function userFromToken(token, env) {
  if (!token) return null;
  const base = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const anon = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;
  if (!base || !anon) return null;
  try {
    const r = await fetch(`${base.replace(/\/$/, '')}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: anon },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return null;
    const u = await r.json();
    return u?.id ? u : null;
  } catch {
    return null;
  }
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
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !serviceKey) return send(res, 503, { error: 'not_configured' });

  // Read the row with the service key: the browser's own grant deliberately
  // cannot see storage_key, and it is the key that has to stay unguessable.
  let doc;
  try {
    const q = new URL(`${base.replace(/\/$/, '')}/rest/v1/library_docs`);
    q.searchParams.set('slug', `eq.${slug}`);
    q.searchParams.set('select', 'slug,status,storage_provider,storage_bucket,storage_key,mime,byte_size');
    q.searchParams.set('limit', '1');
    const r = await fetch(q, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return send(res, 502, { error: 'catalog_unavailable' });
    doc = (await r.json())[0];
  } catch {
    return send(res, 502, { error: 'catalog_unavailable' });
  }

  // Same answer for "no such document" and "not published": a 404 that only
  // fires for real slugs is a way to enumerate the drafts.
  if (!doc || doc.status === 'draft' || doc.status === 'archived') {
    return send(res, 404, { error: 'not_found' });
  }

  if (doc.status === 'restricted') {
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
    const user = await userFromToken(token, env);
    if (!user) return send(res, 401, { error: 'login_required' });
  }

  if (doc.storage_provider !== 'r2') {
    // Supabase-hosted rows are signed in the browser against the user's own
    // session; this endpoint exists for the private object store.
    return send(res, 400, { error: 'not_r2' });
  }

  if (!r2Config(env).configured) return send(res, 503, { error: 'storage_not_configured' });

  const signed = presign(doc.storage_key, {
    method: 'GET',
    expiresIn: TTL_SECONDS,
    bucket: doc.storage_bucket || undefined,
    env,
  });
  if (!signed) return send(res, 503, { error: 'storage_not_configured' });

  return send(res, 200, { url: signed, expiresIn: TTL_SECONDS, mime: doc.mime, byteSize: doc.byte_size });
}
