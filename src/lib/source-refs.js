// What the source chip's panel says about the documents an answer was checked
// against. Both read fields the bank already holds and add nothing:
//   verificationSources — [{ title, locator, url }], the references the key
//                         was checked against (vca.vetmock.com lists them too)
//   sourceDocument      — { page, question }, where in the source file the
//                         question sits
import { safeLinkUrl } from './safe-url.js';

const DRIVE = /^https:\/\/(?:drive|docs)\.google\.com\//i;
const text = (v) => (typeof v === 'string' || typeof v === 'number' ? String(v).replace(/\s+/g, ' ').trim() : '');

/** Each reference with a title, its locator as text, and a link only when the app's URL check passes it. */
export function verificationRefs(q) {
  const list = Array.isArray(q?.verificationSources) ? q.verificationSources : [];
  return list
    .map((r) => {
      const href = typeof r?.url === 'string' ? safeLinkUrl(r.url) : null;
      // Only an absolute https address: a same-site path in a reference would be ours, not the source's.
      // A Google Drive file stays text, as on vca.vetmock.com: a member who cannot open it meets a dead link.
      const linkable = href && /^https:\/\//.test(href) && !DRIVE.test(href);
      return { title: text(r?.title), locator: text(r?.locator), href: linkable ? href : null };
    })
    .filter((r) => r.title);
}

// A bare address, with the separator in front of it ("…หน้า 15-16; https://…").
const BARE_URL = /\s*[;,|]?\s*https?:\/\/[^\s,;)]+/g;

/**
 * The `verified` text the "ตรวจกับ" line prints. When the question lists its references, they carry
 * the addresses, so the line leaves bare ones out; otherwise it is the text as the bank holds it.
 */
export function verifiedLine(q) {
  const verified = typeof q?.verified === 'string' ? q.verified : '';
  if (!verificationRefs(q).length) return verified;
  const kept = verified.replace(BARE_URL, '').replace(/[\s;,|\-–—]+$/, '').trim();
  // Nothing but an address: no line, the references list names it.
  return kept;
}

const positive = (n) => Number.isInteger(n) && n > 0;

/** "อ้างหน้า 9 ข้อ 2", "อ้างหน้า 9", "อ้างข้อ 2", or '' when the document names neither. */
export function sourceDocumentPointer(doc) {
  const page = positive(doc?.page) ? `หน้า ${doc.page}` : '';
  const item = positive(doc?.question) ? `ข้อ ${doc.question}` : '';
  const where = [page, item].filter(Boolean).join(' ');
  return where ? `อ้าง${where}` : '';
}
