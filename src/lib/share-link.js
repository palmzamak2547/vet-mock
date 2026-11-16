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

import { CUSTOM_QUESTION_ID_RANGE } from './custom-question-ids.js';

const MAX_Q = 200;
// 200 compact {subject,id} entries are far below this. Reject an oversized
// query before atob/JSON.parse so a crafted URL cannot force a large decode.
const MAX_QSET_CHARS = 32_000;

// A link carries subject and id, and the friend's app looks the id up in the
// bank. A question the student wrote (Question Manager, ids inside
// CUSTOM_QUESTION_ID_RANGE) lives only in the author's own store, so it can
// never be found on the other side; a link made of such questions landed the
// friend on Home with nothing to show. Those stay out of every link, and the
// screens that make links say so when nothing shareable is left.
export function isShareableQuestion(q) {
  if (!q?.subject) return false;
  const id = Number(q.id);
  if (!Number.isFinite(id)) return false;
  const [min, max] = CUSTOM_QUESTION_ID_RANGE;
  return !(id >= min && id <= max);
}

export function shareableQuestions(questions) {
  return Array.isArray(questions) ? questions.filter(isShareableQuestion) : [];
}

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
    .filter(isShareableQuestion)
    .slice(0, MAX_Q)
    .map((q) => ({ s: q.subject, i: q.id }));
  if (!slim.length) return '';
  try {
    return b64UrlEncode(JSON.stringify(slim));
  } catch {
    return '';
  }
}

export function decodeQuizSet(qsetParam) {
  if (
    !qsetParam ||
    typeof qsetParam !== 'string' ||
    qsetParam.length > MAX_QSET_CHARS ||
    !/^[A-Za-z0-9_-]+$/.test(qsetParam)
  ) return [];
  try {
    const json = b64UrlDecode(qsetParam);
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((row) => row && typeof row === 'object' && row.s && typeof row.i !== 'undefined')
      .slice(0, MAX_Q)
      .map((row) => ({ subject: String(row.s), id: Number(row.i) }))
      .filter((row) => row.subject.length <= 100 && Number.isFinite(row.id));
  } catch {
    return [];
  }
}

// ── The short form: /s/<code> ───────────────────────────────
// The same set as `?qset=`, packed into bytes so a 10-question set is a link
// of about 50 characters instead of about 470, and so a chat preview can be
// drawn by api/s.js from the code alone (no lookup). Layout, version 1:
//
//   byte 0   bits 0-3 version (1); bit 4 the set mixes subjects;
//            bit 5 the sender's picks follow (kept for comparing answers,
//            never written yet, and refused until a reader understands it);
//            bits 6-7 zero
//   varint   how many questions, 1 to SHARE_CODE_MAX_ITEMS
//   varint   the subject's index in SHARE_SUBJECTS (one subject only)
//   per item [varint subject index, a mixed set only]
//            zigzag varint: this id minus the previous one (the first minus 0)
//   (later)  the picks: 3 bits per question, packed, when bit 5 is set
//
// Nothing else is allowed: no trailing bytes, no overlong varint, no repeat
// of a question, no subject outside the table. Every rule is checked by
// decodeShareCode, because a code arrives from anyone.

// Index order is the link format: append only, never reorder or remove, or
// every link made before the change opens other questions.
export const SHARE_SUBJECTS = Object.freeze([
  'aquatic-clinic', 'avian-medicine', 'biochem-1', 'cliapprum', 'com1', 'com2', 'com3', 'com4', 'com5',
  'comp-repro-clinic', 'engprof', 'engprof1', 'epidemiology', 'equine-medicine', 'equine-repro', 'exotic',
  'food-industry', 'food-safety-y4', 'herd-health-rum', 'livestock-pathology', 'milk-meat-hygiene', 'one-health',
  'poa-clinical', 'poultry', 'practrum', 'rec-adv-bioscience', 'repro', 'repro-lect', 'ruminant-clinical', 'surg1',
  'surg2', 'surg3', 'swine-clinic', 'swine-herd', 'swine-repro', 'vca', 'vet-dev-anat', 'vet-histo', 'vet-imaging',
  'vet-juris', 'vet-neuroanat', 'vet-pharm-2', 'zoonoses',
]);
const SUBJECT_INDEX = new Map(SHARE_SUBJECTS.map((s, i) => [s, i]));

export const SHARE_CODE_VERSION = 1;
export const SHARE_CODE_MAX_ITEMS = MAX_Q;
// 200 ids from mixed subjects, each a 3-byte gap: about 1,070 characters.
export const SHARE_CODE_MAX_CHARS = 1200;
const FLAG_MIXED = 0x10;
const FLAG_PICKS = 0x20;
const MAX_ID = 2 ** 31 - 1;
const BASE64URL = /^[A-Za-z0-9_-]+$/;

function pushVarint(out, n) {
  let v = n;
  while (v >= 0x80) { out.push((v % 0x80) | 0x80); v = Math.floor(v / 0x80); }
  out.push(v);
}
const zigzag = (n) => (n >= 0 ? n * 2 : -n * 2 - 1);
const unzigzag = (z) => (z % 2 === 0 ? z / 2 : -(z + 1) / 2);

function bytesToBase64Url(bytes) {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return b64UrlEncode(bin);
}

/** A set as the code of a /s/ link, or '' when nothing in it can travel. */
export function encodeShareCode(questions) {
  if (!Array.isArray(questions)) return '';
  const items = [];
  const seen = new Set();
  for (const q of questions) {
    if (!isShareableQuestion(q)) continue;
    const s = SUBJECT_INDEX.get(q.subject);
    const id = Number(q.id);
    if (s === undefined || !Number.isInteger(id) || id < 1 || id > MAX_ID) continue;
    const key = `${s}:${id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ s, id });
    if (items.length === SHARE_CODE_MAX_ITEMS) break;
  }
  if (!items.length) return '';
  const mixed = items.some((it) => it.s !== items[0].s);
  const out = [SHARE_CODE_VERSION | (mixed ? FLAG_MIXED : 0)];
  pushVarint(out, items.length);
  if (!mixed) pushVarint(out, items[0].s);
  let prev = 0;
  for (const it of items) {
    if (mixed) pushVarint(out, it.s);
    pushVarint(out, zigzag(it.id - prev));
    prev = it.id;
  }
  return bytesToBase64Url(out);
}

function strictBase64UrlBytes(code) {
  // A length of 1 mod 4 cannot come from any byte string.
  if (code.length % 4 === 1) return null;
  let bin;
  try { bin = b64UrlDecode(code); } catch { return null; }
  // Unused low bits of the last character must be zero, or two codes would
  // name one set and the code would not be canonical.
  if (b64UrlEncode(bin) !== code) return null;
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/**
 * The questions a /s/ code names, as [{ subject, id }], or null for anything
 * that is not exactly a code this file writes. `has(subject, id)`, when given,
 * must also say yes for every question (the bank check on the server).
 */
export function decodeShareCode(code, { has = null } = {}) {
  if (typeof code !== 'string' || !code || code.length > SHARE_CODE_MAX_CHARS || !BASE64URL.test(code)) return null;
  const bytes = strictBase64UrlBytes(code);
  if (!bytes || bytes.length < 3) return null;
  let at = 0;
  const varint = () => {
    let n = 0;
    let scale = 1;
    for (let k = 0; k < 5; k++) {
      if (at >= bytes.length) return null;
      const b = bytes[at++];
      n += (b & 0x7f) * scale;
      if (b < 0x80) {
        if (k > 0 && b === 0) return null; // overlong
        return n;
      }
      scale *= 0x80;
    }
    return null;
  };
  const head = bytes[at++];
  if ((head & 0x0f) !== SHARE_CODE_VERSION || (head & 0xc0) !== 0 || (head & FLAG_PICKS)) return null;
  const mixed = Boolean(head & FLAG_MIXED);
  const count = varint();
  if (count === null || count < 1 || count > SHARE_CODE_MAX_ITEMS) return null;
  let subject = null;
  if (!mixed) {
    const s = varint();
    if (s === null || s >= SHARE_SUBJECTS.length) return null;
    subject = SHARE_SUBJECTS[s];
  }
  const out = [];
  const seen = new Set();
  let prev = 0;
  for (let i = 0; i < count; i++) {
    let subj = subject;
    if (mixed) {
      const s = varint();
      if (s === null || s >= SHARE_SUBJECTS.length) return null;
      subj = SHARE_SUBJECTS[s];
    }
    const z = varint();
    if (z === null) return null;
    const id = prev + unzigzag(z);
    if (!Number.isInteger(id) || id < 1 || id > MAX_ID) return null;
    const [min, max] = CUSTOM_QUESTION_ID_RANGE;
    if (id >= min && id <= max) return null;
    const key = `${subj}:${id}`;
    if (seen.has(key)) return null;
    seen.add(key);
    if (has && !has(subj, id)) return null;
    out.push({ subject: subj, id });
    prev = id;
  }
  // A mixed flag on a one-subject set is not what this file writes.
  if (mixed && out.every((q) => q.subject === out[0].subject)) return null;
  if (at !== bytes.length) return null;
  return out;
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
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vetmock.com';
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

// The link the results screen sends: the short /s/<code> form, which a chat
// app previews with the subject's cover (api/s.js) and which carries the
// question ids and nothing else: no score, no time, no name, no text the
// student typed. A set the short form cannot hold (a subject outside
// SHARE_SUBJECTS) falls back to the old `?qset=` form, still without a score.
export function buildShortShareUrl(questions, origin = null) {
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : 'https://vetmock.com');
  const code = encodeShareCode(questions);
  if (code) return `${base}/s/${code}`;
  const qset = encodeQuizSet(questions);
  return qset ? `${base}/?qset=${qset}` : null;
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
    // URLSearchParams has already decoded `by` once. A second decode threw on
    // any name holding a literal percent sign ("100%"), and since this whole
    // read sits in one try/catch, the score and time in the same link were
    // dropped with it — the challenge banner never appeared at all.
    const senderName = by && by.trim() ? by.trim().slice(0, 24) : null;
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

// Read current URL → { keys: [{subject,id}, ...] } or empty. A /s/<code> link
// reaches the app as `?qset=` too: api/s.js sends the browser on in that form,
// so every link sent before 5.282.0 and every short one open the same way.
export function readShareUrlFromLocation(loc = typeof window === 'undefined' ? null : window.location) {
  if (!loc) return [];
  try {
    const params = new URLSearchParams(loc.search);
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
