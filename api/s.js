// A set sent by link: vetmock.com/s/<code> (vercel.json rewrites it here).
// A chat app reads this page's tags to draw the preview: the subject's name,
// how many questions, about how long, and the subject's cover. A person's
// browser is sent on to /?qset=..., the form the app already opens.
//
// The code is input from anyone. It is decoded strictly (src/lib/share-link.js)
// and every question must be one the bank has (share-bank.generated.js); any
// other code gets the not-found page with the site's own tags. No part of the
// input is ever written into the page: the words come from the repository's
// tables and the numbers from the decoded set, and the address the person is
// sent to is encoded again from those numbers. No database, no fetch.

import { decodeShareCode, encodeQuizSet, encodeShareCode } from '../src/lib/share-link.js';
import { setCoverId, ogImageUrl } from '../src/data/og-covers.js';
import { SHARE_BANK } from './_lib/share-bank.generated.js';

const SITE = 'https://vetmock.com';
// The app's timed practice gives each question a minute.
const MINUTES_PER_QUESTION = 1;

const has = (subject, id) => {
  const runs = Object.hasOwn(SHARE_BANK, subject) ? SHARE_BANK[subject].runs : null;
  if (!runs) return false;
  let lo = 0;
  let hi = runs.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const [first, last] = runs[mid];
    if (id < first) hi = mid - 1;
    else if (id > last) lo = mid + 1;
    else return true;
  }
  return false;
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** The set a code names, checked against the bank, or null. */
export function readSet(code) {
  if (typeof code !== 'string') return null;
  return decodeShareCode(code, { has });
}

/** The words of the preview, from the tables and the counts only. */
export function previewOf(set) {
  const subjects = [...new Set(set.map((q) => q.subject))];
  const one = subjects.length === 1 ? SHARE_BANK[subjects[0]].name : null;
  const n = set.length;
  const minutes = Math.max(1, n * MINUTES_PER_QUESTION);
  return {
    title: one ? `ชุดโจทย์ ${one} ${n} ข้อ | VetMock` : `ชุดโจทย์ ${n} ข้อ จาก ${subjects.length} วิชา | VetMock`,
    description: `เพื่อนส่งชุดโจทย์ ${n} ข้อมาให้ลองทำ ใช้เวลาราว ${minutes} นาที`,
    image: one ? ogImageUrl(SITE, setCoverId(subjects[0])) : ogImageUrl(SITE, 'home'),
    alt: one ? `ชุดโจทย์ ${one}` : 'ชุดโจทย์จากเพื่อน',
    url: `${SITE}/s/${encodeShareCode(set)}`,
    target: `/?qset=${encodeQuizSet(set)}`,
  };
}

const NOT_FOUND = {
  title: 'ไม่พบชุดนี้ | VetMock',
  description: 'ลิงก์นี้ไม่มีชุดโจทย์ที่เปิดได้ ลองขอลิงก์ใหม่จากเพื่อน หรือเริ่มฝึกที่ VetMock',
  image: ogImageUrl(SITE, 'home'),
  alt: 'VetMock',
  url: SITE,
  target: '/',
};

export function page(p, found) {
  const tag = (attr, key, value) => `<meta ${attr}="${key}" content="${esc(value)}">`;
  // The address is our own base64url text; JSON keeps it a string and the
  // escape keeps "</script>" out even if that ever changed.
  const target = JSON.stringify(p.target).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="th"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
${tag('name', 'description', p.description)}
${tag('name', 'robots', 'noindex')}
${tag('property', 'og:type', 'website')}
${tag('property', 'og:site_name', 'VetMock')}
${tag('property', 'og:url', p.url)}
${tag('property', 'og:title', p.title)}
${tag('property', 'og:description', p.description)}
${tag('property', 'og:image', p.image)}
${tag('property', 'og:image:width', '1200')}
${tag('property', 'og:image:height', '630')}
${tag('property', 'og:image:alt', p.alt)}
${tag('name', 'twitter:card', 'summary_large_image')}
${tag('name', 'twitter:title', p.title)}
${tag('name', 'twitter:description', p.description)}
${tag('name', 'twitter:image', p.image)}
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f6efe4;color:#2b2419;font:16px/1.6 system-ui,sans-serif}a{color:#355a39;font-weight:700}</style>
</head><body>
<p>${found ? `<a href="${esc(p.target)}">เปิดชุดนี้ใน VetMock</a>` : `ไม่พบชุดนี้ <a href="/">ไปที่ VetMock</a>`}</p>
${found ? `<script>location.replace(${target})</script>` : ''}
</body></html>`;
}

export default function handler(req, res) {
  const raw = req?.query?.code;
  const set = readSet(Array.isArray(raw) ? null : raw);
  const found = Boolean(set);
  res.setHeader('content-type', 'text/html; charset=utf-8');
  // One code always gives the same page until the bank changes, so the edge
  // answers repeated preview fetches; a day, then a week served stale while it
  // refreshes. A miss costs one short run with no lookup.
  res.setHeader('cache-control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800');
  res.setHeader('x-robots-tag', 'noindex');
  res.setHeader('content-security-policy', "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
  res.status(found ? 200 : 404).send(page(found ? previewOf(set) : NOT_FOUND, found));
}
