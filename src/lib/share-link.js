// ============================================================
// share-link — encode/decode quiz sets in URL params
// ============================================================
//
// Lets a user share the exact set of questions they just did with a
// friend via a single URL. The receiver lands on the exam screen
// pre-loaded with the same questions, in the same order, no login
// required.
//
// Format: `?qset=<base64url>` where the decoded payload is a compact
// JSON of [{s,i}, ...] (subject + id). Capped at 200 Qs (URL length).
//
// Why compound key (subject:id): Q ids dupe across subjects in
// VetMock — same as q_comments. Skipping subject would mismatch on
// the receiver's side.
// ============================================================

const MAX_Q = 200;

// Base64URL — RFC 4648 §5: replaces +/= with -_ (no padding) so the
// string is safe in URL params without percent-encoding.
function b64UrlEncode(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64UrlDecode(str) {
  // Restore standard base64 padding before atob
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  return atob(str.replace(/-/g, '+').replace(/_/g, '/') + pad);
}

export function encodeQuizSet(questions) {
  if (!Array.isArray(questions) || questions.length === 0) return '';
  const slim = questions
    .slice(0, MAX_Q)
    .filter((q) => q?.subject && typeof q?.id !== 'undefined')
    .map((q) => ({ s: q.subject, i: q.id }));
  if (!slim.length) return '';
  try {
    return b64UrlEncode(JSON.stringify(slim));
  } catch {
    return '';
  }
}

export function decodeQuizSet(qsetParam) {
  if (!qsetParam) return [];
  try {
    const json = b64UrlDecode(qsetParam);
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((row) => row && typeof row === 'object' && row.s && typeof row.i !== 'undefined')
      .slice(0, MAX_Q)
      .map((row) => ({ subject: String(row.s), id: Number(row.i) }));
  } catch {
    return [];
  }
}

// Build the full URL the user can copy + paste
export function buildShareUrl(questions) {
  const qset = encodeQuizSet(questions);
  if (!qset) return null;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vetmock.vercel.app';
  return `${origin}/?qset=${qset}`;
}

// Read current URL → { keys: [{subject,id}, ...] } or empty
export function readShareUrlFromLocation() {
  if (typeof window === 'undefined') return [];
  try {
    const params = new URLSearchParams(window.location.search);
    return decodeQuizSet(params.get('qset'));
  } catch {
    return [];
  }
}

// Copy URL to clipboard, with fallback for older browsers + in-app webviews.
// Routes through src/lib/clipboard.js which detects the Clipboard API
// properly (so LINE/Facebook in-app browsers fall through to the
// document.execCommand path instead of silently "succeeding").
export async function copyShareUrl(questions) {
  const url = buildShareUrl(questions);
  if (!url) return { ok: false, reason: 'empty' };
  const { copyText } = await import('./clipboard.js');
  const result = await copyText(url);
  return result.ok ? { ok: true, url, method: result.method } : { ...result, url };
}
