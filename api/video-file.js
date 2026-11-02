// ============================================================
// /api/video-file — the library's own copy of a lecture video, for a
// signed-in student only.
// ============================================================
//   ?v=<id>&f=video          { url, expiresIn }: a presigned R2 link; the
//                            browser streams and seeks (range requests)
//                            straight from R2, so no video byte passes
//                            through this function (R2 egress is free).
//   ?v=<id>&f=frames         the slide list, each with its presigned picture URL
//   ?v=<id>&f=transcript     the caption lines, [[seconds, text], ...]
//
// R2's S3 keys come from the Cloudflare token the server already holds
// (tokenKeyEnv in _lib/r2.js), unless R2_ACCESS_KEY_ID is set. The video id
// must be one the registry says has a copy: a crafted id signs nothing.
import { presign, tokenKeyEnv } from './_lib/r2.js';
import { chulaGate } from './_lib/chula-gate.js';
import { rateLimit, clientIP, sendRateLimitFailure } from './_lib/rate-limit.js';
import { VIDEO_REGISTRY } from '../src/data/video-registry.generated.js';

// A lecture runs three hours; a link that dies mid-lecture breaks seeking.
export const VIDEO_TTL = 6 * 3600;
export const RATE = { max: 240, windowMs: 10 * 60 * 1000 };
const ID = /^[0-9A-Za-z_-]{11}$/;
const FRAME = /^f\d{1,6}\.webp$/;
const KINDS = ['video', 'frames', 'transcript'];

function send(res, status, body, cache = 'private, no-store') {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', cache);
  res.end(JSON.stringify(body));
}

export default async function handler(req, res, { env = process.env } = {}) {
  if (req.method !== 'GET') return send(res, 405, { error: 'method_not_allowed' });
  const url = new URL(req.url, 'https://vetmock.com');
  const v = url.searchParams.get('v') || '';
  const f = url.searchParams.get('f') || 'video';
  if (!ID.test(v) || !KINDS.includes(f)) return send(res, 400, { error: 'bad_request' });
  if (!Object.prototype.hasOwnProperty.call(VIDEO_REGISTRY, v) || !VIDEO_REGISTRY[v].media) return send(res, 404, { error: 'not_found' });

  const limit = await rateLimit(`video-file:${clientIP(req)}`, RATE.max, RATE.windowMs);
  if (!limit.ok && !limit.unavailable) return sendRateLimitFailure(res, limit);

  // The Chula wall decides who may watch (api/_lib/chula-gate.js); our copy
  // always needs a signed-in student, wall on or off.
  const gate = await chulaGate(req, { env });
  if (!gate.ok) return send(res, gate.status, gate.body);
  if (!gate.userId) return send(res, 401, { error: 'login_required' });

  const r2 = await tokenKeyEnv(env);
  if (!r2) return send(res, 503, { error: 'storage_not_configured' });
  if (f === 'video') {
    return send(res, 200, { url: presign(`videos/${v}/video.mp4`, { method: 'GET', expiresIn: VIDEO_TTL, env: r2 }), expiresIn: VIDEO_TTL });
  }
  // The small JSON comes through here, so the bucket needs no CORS rule.
  let body;
  try {
    const r = await fetch(presign(`videos/${v}/${f}.json`, { method: 'GET', expiresIn: 60, env: r2 }), { signal: AbortSignal.timeout(8000) });
    if (r.status === 404) return send(res, 404, { error: 'not_found' });
    if (!r.ok) return send(res, 502, { error: 'storage_unavailable' });
    body = await r.json();
  } catch {
    return send(res, 502, { error: 'storage_unavailable' });
  }
  if (f === 'frames') {
    // One request for the whole strip: each picture's own short-lived link.
    const frames = (body.frames || []).filter((x) => FRAME.test(x.file))
      .map((x) => ({ t: x.t, url: presign(`videos/${v}/frames/${x.file}`, { method: 'GET', expiresIn: VIDEO_TTL, env: r2 }) }));
    return send(res, 200, { frames, expiresIn: VIDEO_TTL });
  }
  // Never cached: on a shared computer the next account must pass the gate too.
  return send(res, 200, body);
}
