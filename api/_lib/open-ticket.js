// open-ticket.js — a library link a member was handed, usable without a header.
//
// Behind the Chula wall /api/library-file wants the member's bearer token, but
// a link a student taps (a VetMock AI files card, a source chip) is a plain
// navigation that carries no header. So the server that already let the member
// in signs the link itself: an HMAC over the slug and an expiry, the same
// construction as blob-token.js, derived from the same server-only secret under
// another prefix. It names one document for a week and nothing else.
import crypto from 'node:crypto';

export const OPEN_TICKET_TTL_SECONDS = 7 * 24 * 60 * 60;

function macKey(env = process.env) {
  const secret = env.CLOUDFLARE_API_TOKEN || env.LIBRARY_BLOB_SECRET;
  if (!secret) return null;
  return crypto.createHash('sha256').update(`vetmock-library-open:${secret}`).digest();
}

const sign = (key, slug, expires) => crypto.createHmac('sha256', key).update(`${slug}|${expires}`).digest('base64url');

/** { vt, ve } for this slug, or null when the server has no secret to sign with. */
export function mintOpenTicket(slug, { env = process.env, now = Date.now(), ttlSeconds = OPEN_TICKET_TTL_SECONDS } = {}) {
  const key = macKey(env);
  if (!key || !slug) return null;
  const ve = Math.floor(now / 1000) + ttlSeconds;
  return { vt: sign(key, slug, ve), ve };
}

/** True only for an unexpired ticket minted for exactly this slug. */
export function verifyOpenTicket(slug, vt, ve, { env = process.env, now = Date.now() } = {}) {
  const key = macKey(env);
  const expires = Number(ve);
  if (!key || !slug || typeof vt !== 'string' || !Number.isInteger(expires) || expires * 1000 < now) return false;
  const expect = Buffer.from(sign(key, slug, expires));
  const got = Buffer.from(vt);
  return got.length === expect.length && crypto.timingSafeEqual(got, expect);
}

/** The query string fragment a link carries, or '' when no ticket. */
export const ticketQuery = (ticket) => (ticket ? `&vt=${encodeURIComponent(ticket.vt)}&ve=${ticket.ve}` : '');
