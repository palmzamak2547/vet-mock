// ============================================================
// /api/profile-picture — a student's own picture, kept private.
// ============================================================
// Every call needs a signed-in Chula account (a member, api/_lib/chula-gate.js);
// a guest, or an account that is not the university's, gets nothing, whether
// the wall is on or off.
//
//   GET    ?users=<id>,<id>  signed, minutes-lived links to the pictures of up
//                            to 60 accounts: a shown picture for any member, a
//                            hidden one only for its owner (and the admin). The
//                            database decides who sees what (profile_pictures_for,
//                            supabase/migrations/20261116120000_profile_pictures.sql).
//   POST                     the student's new picture, as 'b64:' + base64 (the
//                            edge in front of these functions damages raw
//                            non-ASCII bytes). Judged by its bytes and redrawn
//                            here (api/_lib/profile-picture-image.js); the
//                            upload itself is never stored.
//   POST   ?report=<id>      reports another member's shown picture.
//   DELETE                   removes the student's picture: back to the ready-made one.
//
// Storage is the private bucket the library uses, under profile-pictures/, at a
// key this function makes up (a random id; never the account id, never the
// file's name). A picture is read only through /api/library-blob with a link
// minted here, and only by the callers above. Nothing here is shared publicly:
// no share card, link cover or preview reads this function.
import { randomUUID } from 'node:crypto';
import { chulaGate, CHULA_REQUIRED, SIGNIN_REQUIRED } from './_lib/chula-gate.js';
import { limitCaller, sendRateLimitFailure } from './_lib/rate-limit.js';
import { backendConfig, signedRpc } from './_lib/app-backend.js';
import { mintBlobToken } from './_lib/blob-token.js';
import { r2Config, writeObject } from './_lib/r2.js';
import { remakePicture, PICTURE_LIMITS } from './_lib/profile-picture-image.js';

export const RATES = Object.freeze({
  read: { max: 300, windowMs: 10 * 60 * 1000 },
  // Uploads and removals together: a student trying pictures for a while is
  // fine; a script replacing one every few seconds is not.
  write: { max: 12, windowMs: 60 * 60 * 1000 },
  report: { max: 30, windowMs: 60 * 60 * 1000 },
});
export const MAX_ACCOUNTS = 60;
// Base64 of the largest picture accepted, its 'b64:' prefix and a little slack.
const MAX_BODY_CHARS = Math.ceil(PICTURE_LIMITS.maxBytes / 3) * 4 + 16;
// Links live on fixed windows so a picture seen twice in one window is the
// same address (the browser keeps it in memory), and never more than 20 minutes.
const WINDOW_SEC = 900;
const GRACE_SEC = 300;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store');
  res.end(JSON.stringify(body));
}

async function postgrest(name, args, token, env, fetchImpl) {
  const { url, key } = backendConfig(env);
  if (!url || !key) return { status: 503, data: null };
  const response = await fetchImpl(`${url.replace(/\/$/, '')}/rest/v1/rpc/${name}`, {
    redirect: 'error',
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(8000),
  });
  return { status: response.status, data: response.ok ? await response.json() : null };
}

/** The request body as the picture's bytes; { tooLarge } past the cap; null when unreadable. */
async function readPicture(req) {
  const declared = Number(req.headers?.['content-length']);
  if (Number.isFinite(declared) && declared > MAX_BODY_CHARS) return { tooLarge: true };
  let raw = '';
  try {
    const parsed = req.body;
    if (typeof parsed === 'string') raw = parsed;
    else if (Buffer.isBuffer(parsed)) raw = parsed.toString('latin1');
    else if (req.readable) {
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > MAX_BODY_CHARS) return { tooLarge: true };
        chunks.push(chunk);
      }
      raw = Buffer.concat(chunks).toString('latin1');
    }
  } catch {
    return null;
  }
  if (raw.length > MAX_BODY_CHARS) return { tooLarge: true };
  if (!raw.startsWith('b64:')) return null;
  const text = raw.slice(4).replace(/\s+/g, '');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(text)) return null;
  return { bytes: Buffer.from(text, 'base64') };
}

export function createHandler({
  env = process.env,
  fetchImpl = fetch,
  gate = (req) => chulaGate(req, { env, fetchImpl }),
  limit = limitCaller,
  rpc = (name, args, token) => postgrest(name, args, token, env, fetchImpl),
  signed = (name, purpose, data, token) => signedRpc(name, purpose, data, token, env),
  store = (method, key, opts) => writeObject(method, key, { ...opts, bucket: r2Config(env).bucket, env, fetchImpl }),
  remake = remakePicture,
  now = () => Date.now(),
  makeKey = () => `profile-pictures/${randomUUID()}.webp`,
} = {}) {
  const bucket = () => r2Config(env).bucket;
  const link = (key, userId) => {
    const nowSec = Math.floor(now() / 1000);
    const expiresAtSec = (Math.floor(nowSec / WINDOW_SEC) + 1) * WINDOW_SEC + GRACE_SEC;
    const token = mintBlobToken(
      { storage_bucket: bucket(), storage_key: key, mime: 'image/webp', status: 'restricted', file_name: 'picture.webp' },
      { expiresAtSec, env, now: now(), user: userId },
    );
    return token ? `/api/library-blob?t=${token.t}&s=${token.s}` : null;
  };
  const ownRow = async (who) => {
    const asked = await rpc('profile_pictures_for', { p_users: [who.userId] }, who.token);
    if (asked.status === 404) return { missing: true };
    if (!Array.isArray(asked.data)) return { failed: true };
    return { row: asked.data[0] || null };
  };

  return async function handler(req, res) {
    const method = req.method;
    if (!['GET', 'POST', 'DELETE'].includes(method)) return send(res, 405, { error: 'method_not_allowed' });
    const url = new URL(req.url, 'http://localhost');

    let who;
    try {
      who = await gate(req);
    } catch {
      return send(res, 503, { error: 'backend-unavailable' });
    }
    if (!who.ok) return send(res, who.status, who.body);
    // A university account only, wall or no wall.
    if (!who.userId || !who.token) return send(res, SIGNIN_REQUIRED.status, SIGNIN_REQUIRED.body);
    if (who.member !== true) return send(res, CHULA_REQUIRED.status, CHULA_REQUIRED.body);

    const report = url.searchParams.get('report');
    const route = method === 'GET' ? 'read' : report !== null ? 'report' : 'write';
    const rate = RATES[route];
    const limited = await limit(req, who, `profile-picture-${route}`, rate.max, rate.windowMs);
    if (!limited.ok) return sendRateLimitFailure(res, limited);

    try {
      if (method === 'GET') {
        const ids = [...new Set(String(url.searchParams.get('users') || '').split(',').filter(Boolean))];
        if (ids.length === 0 || ids.length > MAX_ACCOUNTS || !ids.every((id) => UUID.test(id))) return send(res, 400, { error: 'bad_users' });
        const asked = await rpc('profile_pictures_for', { p_users: ids }, who.token);
        // Before the migration: nobody has a picture yet, so everyone keeps the ready-made one.
        if (asked.status === 404) return send(res, 200, { pictures: {}, ready: false });
        if (!Array.isArray(asked.data)) return send(res, 502, { error: 'database_unavailable' });
        const pictures = {};
        for (const row of asked.data) {
          if (!row?.picture_key || !UUID.test(row.user_id)) continue;
          const shown = row.picture_state === 'shown';
          // Hidden pictures reach only their owner (and the admin): the database
          // already filtered, and the owner is the one who needs to see which.
          const address = link(row.picture_key, who.userId);
          if (!address) return send(res, 503, { error: 'storage_not_configured' });
          pictures[row.user_id] = { url: address, state: shown ? 'shown' : row.picture_state };
        }
        return send(res, 200, { pictures, ready: true });
      }

      if (method === 'POST' && report !== null) {
        if (!UUID.test(report)) return send(res, 400, { error: 'bad_user' });
        if (report === who.userId) return send(res, 400, { error: 'own_picture' });
        const asked = await rpc('report_profile_picture', { p_owner: report }, who.token);
        if (asked.status === 404) return send(res, 503, { error: 'not_ready' });
        if (!asked.data || typeof asked.data !== 'object') return send(res, 502, { error: 'database_unavailable' });
        return send(res, 200, { reported: asked.data.reported === true, hidden: asked.data.hidden === true });
      }

      if (method === 'DELETE') {
        const own = await ownRow(who);
        if (own.missing) return send(res, 503, { error: 'not_ready' });
        if (own.failed) return send(res, 502, { error: 'database_unavailable' });
        if (!own.row) return send(res, 200, { ok: true, removed: false });
        const result = await signed('set_profile_picture', 'profile-picture', { user_id: who.userId, key: null }, who.token);
        if (result?.ok !== true) return send(res, 502, { error: 'database_unavailable' });
        if (result.previous_key) await store('DELETE', result.previous_key).catch(() => false);
        return send(res, 200, { ok: true, removed: true });
      }

      // POST: a new picture.
      const body = await readPicture(req);
      if (body?.tooLarge) return send(res, 413, { error: 'too_large' });
      if (!body) return send(res, 415, { error: 'not_picture' });
      const own = await ownRow(who);
      if (own.missing) return send(res, 503, { error: 'not_ready' });
      if (own.failed) return send(res, 502, { error: 'database_unavailable' });
      if (own.row?.picture_state === 'hidden_admin') return send(res, 403, { error: 'refused' });
      const made = await remake(body.bytes);
      if (!made.ok) {
        const status = made.reason === 'too_large' ? 413 : made.reason === 'too_many_pixels' ? 422 : 415;
        return send(res, status, { error: made.reason });
      }
      const key = makeKey();
      if (!(await store('PUT', key, { body: made.bytes, mime: 'image/webp' }).catch(() => false))) {
        return send(res, 503, { error: 'storage_unavailable' });
      }
      let result;
      try {
        result = await signed('set_profile_picture', 'profile-picture', { user_id: who.userId, key }, who.token);
      } catch (error) {
        await store('DELETE', key).catch(() => false);
        throw error;
      }
      if (result?.ok !== true) {
        await store('DELETE', key).catch(() => false);
        return send(res, result?.reason === 'refused' ? 403 : 502, { error: result?.reason === 'refused' ? 'refused' : 'database_unavailable' });
      }
      if (result.previous_key && result.previous_key !== key) await store('DELETE', result.previous_key).catch(() => false);
      return send(res, 200, { url: link(key, who.userId), state: 'shown' });
    } catch {
      return send(res, 502, { error: 'database_unavailable' });
    }
  };
}

export default createHandler();
