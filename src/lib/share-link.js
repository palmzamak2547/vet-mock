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

// Build the full URL the user can copy + paste.
// Round 2B (2026-05-18): optional sender-score + sender-name params
// so the receiver lands with a "📨 ผู้ส่งได้ X/Y · ดูว่าคุณได้เท่าไหร่"
// banner — Palm spec calls for score comparison after async challenge.
//
// opts: { senderScore: {correct: number, total: number}, senderName: string }
// Both keys are optional; passing nothing produces the legacy URL shape.
export function buildShareUrl(questions, opts = {}) {
  const qset = encodeQuizSet(questions);
  if (!qset) return null;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vetmock.vercel.app';
  let url = `${origin}/?qset=${qset}`;
  if (opts.senderScore && Number.isFinite(opts.senderScore.correct) && Number.isFinite(opts.senderScore.total)) {
    url += `&sc=${opts.senderScore.correct}_${opts.senderScore.total}`;
  }
  if (typeof opts.senderName === 'string' && opts.senderName.trim()) {
    // Trim aggressive — 24 chars max keeps URL+chat preview reasonable.
    const safe = opts.senderName.trim().slice(0, 24);
    url += `&by=${encodeURIComponent(safe)}`;
  }
  // Sender elapsed time in seconds — Phase 5 spec "เทียบคะแนน/เวลา".
  // Capped at 9999s (~2h 46m) to bound URL size + reject pathological
  // tab-left-open-overnight sessions that aren't meaningful comparisons.
  if (Number.isFinite(opts.senderTimeSec) && opts.senderTimeSec > 0) {
    const t = Math.min(9999, Math.max(1, Math.round(opts.senderTimeSec)));
    url += `&t=${t}`;
  }
  return url;
}

// Parse sender-score + sender-name from current location. Returns null
// when missing/malformed so callers can branch without try/catch.
export function readSenderInfoFromLocation() {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const sc = params.get('sc');
    const by = params.get('by');
    let senderScore = null;
    if (sc) {
      const m = sc.match(/^(\d{1,3})_(\d{1,3})$/);
      if (m) {
        const correct = Number(m[1]);
        const total = Number(m[2]);
        if (Number.isFinite(correct) && Number.isFinite(total) && total > 0 && correct <= total) {
          senderScore = { correct, total };
        }
      }
    }
    const senderName = by ? decodeURIComponent(by).slice(0, 24) : null;
    const tRaw = params.get('t');
    let senderTimeSec = null;
    if (tRaw) {
      const n = Number(tRaw);
      if (Number.isFinite(n) && n > 0 && n <= 9999) senderTimeSec = Math.round(n);
    }
    if (!senderScore && !senderName && !senderTimeSec) return null;
    return { senderScore, senderName, senderTimeSec };
  } catch {
    return null;
  }
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
