// ============================================================
// safe-url.js — image/link URL hardening helpers
// ============================================================
// Defends against shared-content tracking-pixel attacks:
//   A group member could paste `image: 'https://attacker/x.gif'` into
//   a custom Q, share it, and every viewer's IP + UA leaks on render.
//
// Strategy: allow-list of trusted image hosts. Anything outside the
// list returns null → calling site renders nothing (or a placeholder).
//
// Applied at TWO layers (defense in depth):
//   1. SOURCE — `sanitizeSharedQuestionData` strips bad URLs before
//      writing to Supabase `shared_questions` table.
//   2. SINK — every `<img src={...}>` for shared/custom Qs runs the
//      url through `safeImageUrl(...)` first.
//
// Same-origin (relative paths starting with `/`) and `data:` URIs
// are always allowed. Trusted external hosts:
//   • VetMock's exact Supabase host — never an attacker-owned project
//   • i.imgur.com           — common student-shared host
//   • imgur.com/...          (redirect to i.imgur.com)
//   • i.ibb.co              — image-bb (popular mirror)
//   • avatars.githubusercontent.com — for any future GitHub-source UI
//   • lh3.googleusercontent.com     — Google Drive sharing link host
// ============================================================

const ALLOWED_HOSTS = [
  /^mpovsdzdggvksmeehqfj\.supabase\.co$/i,
  /^i\.imgur\.com$/i,
  /^imgur\.com$/i,
  /^i\.ibb\.co$/i,
  /^avatars\.githubusercontent\.com$/i,
  /^lh3\.googleusercontent\.com$/i,
];

/**
 * Returns the URL if it's safe to render as an <img src>, else null.
 * Accepts: same-origin paths, data: URIs, blob: URIs, allow-listed hosts.
 * Rejects: arbitrary http(s) hosts, javascript:/file: schemes, malformed.
 */
export function safeImageUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Same-origin relative path
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;

  // data: URIs — only image/* MIME types allowed
  if (/^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml|avif);/i.test(trimmed)) {
    return trimmed;
  }

  // blob: URIs — same-origin by definition (created by URL.createObjectURL)
  if (trimmed.startsWith('blob:')) return trimmed;

  // External http(s) — must match allow-list
  try {
    const u = new URL(trimmed);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    if (u.protocol === 'http:') return null; // require https for external
    const host = u.hostname.toLowerCase();
    for (const re of ALLOWED_HOSTS) {
      if (re.test(host)) return trimmed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Allow a markdown/source link only when it cannot execute script or escape
 * to an insecure transport. Relative and fragment links stay same-origin;
 * external links must use HTTPS.
 */
export function safeLinkUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed || trimmed.length > 2048) return null;
  if (trimmed.startsWith('#')) return trimmed;
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') return null;
    if (parsed.username || parsed.password) return null;
    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Sanitize a question payload before sharing to Supabase. Strips fields
 * that could be used as tracking vectors (image URLs to untrusted hosts).
 * Returns a NEW object — does not mutate input.
 */
export function sanitizeSharedQuestionData(qData) {
  if (!qData || typeof qData !== 'object') return qData;
  const clean = { ...qData };
  if ('image' in clean) {
    const safe = safeImageUrl(clean.image);
    if (safe == null) {
      // Drop the field entirely rather than leaving a broken/null
      // value that might confuse renderers
      delete clean.image;
    } else {
      clean.image = safe;
    }
  }
  if ('imagePath' in clean) {
    const safe = safeImageUrl(clean.imagePath);
    if (safe == null) {
      delete clean.imagePath;
    } else {
      clean.imagePath = safe;
    }
  }
  // External `passage` URL would also be a vector if treated as URL.
  // Currently passage is rendered as text — no fix needed unless that
  // changes.
  return clean;
}
