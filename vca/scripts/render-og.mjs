// Draws the link-preview covers (1200×630, JPEG) into public/og/: the home page, the exam page, the
// other pages, and one per domain, set in the site's own type and bookplates. Run it after the
// bank, the rounds or the art change: npm run og. Needs the repo's Playwright and Chromium.
//
// The covers are drawn by a headless browser from HTML on a small local server that serves the
// same fonts and plates the site does, so a cover never differs from the page it advertises.

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { sharedAssetList } from '../build/shared-assets.mjs';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(APP, '..');
const OUT = path.join(APP, 'public', 'og');
const only = process.argv.slice(2);

const { BANK, SAMPLES } = await import(pathToFileURL(path.join(APP, 'src/generated/bank.js')).href);
const { domainProfile, SUBJECTS, YEARS, cellValue } = await import(pathToFileURL(path.join(APP, 'src/data/almanac.js')).href);
const { ROUNDS, FORMAT } = await import(pathToFileURL(path.join(APP, 'src/data/exam.js')).href);

const n = (x) => x.toLocaleString('th-TH');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const card = (id) => BANK.domains.find((d) => d.id === id);
const profile = domainProfile();

// ── a server for the fonts and plates ────────────────────────────────────────────────────────
const shared = new Map((await sharedAssetList({ repoPublic: path.join(REPO, 'public'), appDir: APP })).map((a) => [a.url, a.file]));
const TYPES = { '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = shared.get(url) || (url.startsWith('/fonts/') ? path.join(APP, 'public', url) : null);
  if (!file || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
  // The covers are set from about:blank, so fonts arrive cross-origin and need CORS to load.
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'access-control-allow-origin': '*' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const base = `http://127.0.0.1:${server.address().port}/`;

// ── the covers ───────────────────────────────────────────────────────────────────────────────
const MARK = `<svg class="mark" viewBox="0 0 64 64" width="40" height="40"><rect width="64" height="64" rx="14" fill="#15171a"/><g fill="#f2f0eb"><ellipse cx="32" cy="42.25" rx="11.5" ry="9.25"/><ellipse cx="18.5" cy="29" rx="4.5" ry="6" transform="rotate(-18 18.5 29)"/><ellipse cx="26.5" cy="19.75" rx="4.25" ry="5.75" transform="rotate(-6 26.5 19.75)"/><ellipse cx="45.5" cy="29" rx="4.5" ry="6" transform="rotate(18 45.5 29)"/></g><ellipse cx="37.5" cy="19.75" rx="4.25" ry="5.75" transform="rotate(6 37.5 19.75)" fill="#2a9a7b"/></svg>`;

const CSS = `
@font-face { font-family: Inter; src: url(fonts/inter-latin-var.woff2); font-weight: 100 900; }
@font-face { font-family: Anuphan; src: url(fonts/anuphan-thai-var.woff2); font-weight: 100 700; unicode-range: U+0E01-0E5B, U+200C-200D, U+25CC; }
@font-face { font-family: "Instrument Serif"; src: url(fonts/instrument-serif-latin.woff2); font-weight: 400; }
@font-face { font-family: "Serif Thai"; src: url(fonts/noto-serif-thai-var.woff2); font-weight: 100 900; font-stretch: 87.5%; unicode-range: U+0E01-0E5B, U+200C-200D, U+25CC; }
@font-face { font-family: "Geist Mono"; src: url(fonts/geist-mono-latin-var.woff2); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1200px; height: 630px; }
body { font-family: Inter, Anuphan, sans-serif; color: #15171a; -webkit-font-smoothing: antialiased; font-synthesis: none; }
.og { position: relative; width: 1200px; height: 630px; overflow: hidden; background: #f2f0eb; }
.atmos { position: absolute; inset: 0; background:
  radial-gradient(520px 420px at 12% 8%, rgba(29, 122, 98, .16), transparent 70%),
  radial-gradient(620px 520px at 92% 96%, rgba(201, 154, 69, .20), transparent 70%),
  radial-gradient(500px 400px at 70% 10%, rgba(255, 255, 255, .7), transparent 70%); }
.grain { position: absolute; inset: 0; opacity: .5; mix-blend-mode: multiply; background-image: radial-gradient(rgba(21, 23, 26, .05) 1px, transparent 1px); background-size: 3px 3px; }
.brand { position: absolute; left: 64px; top: 54px; display: flex; align-items: center; gap: 14px; z-index: 3; }
.brand b { font: 650 25px/1 Inter; letter-spacing: -.015em; }
.brand i { width: 1.5px; height: 22px; background: rgba(21, 23, 26, .28); }
.brand span { font: 500 16px/1 "Geist Mono"; letter-spacing: .16em; color: #474c54; }
.copy { position: absolute; left: 64px; top: 150px; width: 600px; z-index: 3; }
.kicker { display: flex; align-items: center; gap: 14px; font: 500 15px/1 "Geist Mono"; letter-spacing: .18em; text-transform: uppercase; color: #474c54; }
.kicker::before { content: ""; width: 38px; height: 1.5px; background: #1d7a62; }
h1 { margin-top: 26px; font: 400 80px/1.16 "Instrument Serif", "Serif Thai"; }
h1 em { font-style: normal; color: #1d7a62; }
h1 .nw { white-space: nowrap; }
.sub { margin-top: 26px; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 28px; font: 500 25px/1.4 Inter, Anuphan; color: #474c54; }
.sub b { color: #15171a; font-weight: 650; }
.url { position: absolute; left: 64px; bottom: 50px; z-index: 3; font: 500 18px/1 "Geist Mono"; letter-spacing: .04em; color: #676c74; }
.url b { color: #15171a; font-weight: 600; }

/* plates on the wall, as on the home page */
.plate { position: absolute; display: flex; flex-direction: column; justify-content: flex-end; border-radius: 18px; overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(21, 23, 26, .09), 0 1px 0 rgba(255, 255, 255, .5), 0 22px 40px -26px rgba(28, 34, 40, .45); }
.plate img { position: absolute; inset: 10% 10% 22%; width: 80%; height: 68%; object-fit: contain; }
.plate figcaption { position: relative; display: flex; justify-content: space-between; gap: 10px; padding: 0 14px 12px; white-space: nowrap; font: 500 12px/1 "Geist Mono"; letter-spacing: .12em; text-transform: uppercase; color: #474c54; }
.plate figcaption span:last-child { overflow: hidden; text-overflow: ellipsis; }
.kicker .no { color: #1d7a62; margin-right: 4px; }

/* the glass question */
.glass { position: absolute; border-radius: 26px; background: rgba(255, 255, 255, .6); backdrop-filter: blur(22px) saturate(170%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .9), 0 0 0 1px rgba(21, 23, 26, .06), 0 30px 60px -24px rgba(28, 34, 40, .40), 0 4px 10px -4px rgba(28, 34, 40, .12); }
.q { padding: 26px 28px; }
.q-top { display: flex; align-items: center; gap: 10px; font: 600 14px/1 Inter, Anuphan; color: #1d7a62; }
.q-top .pill { display: inline-flex; gap: 7px; margin-left: 2px; padding: 5px 10px; border-radius: 999px; background: rgba(21, 23, 26, .07); color: #474c54; font-weight: 500; }
.q-top .pill i { font: 500 12px/1 "Geist Mono"; font-style: normal; color: #676c74; }
.q-top .no { margin-left: auto; font: 500 13px/1 "Geist Mono"; letter-spacing: .08em; color: #676c74; }
.q-stem { margin-top: 16px; font: 600 21px/1.5 Inter, Anuphan; }
.opts { margin-top: 16px; display: grid; gap: 9px; }
.opt { display: flex; align-items: center; gap: 12px; height: 46px; padding: 0 14px; border-radius: 13px; background: rgba(255, 255, 255, .78); box-shadow: inset 0 0 0 1px rgba(21, 23, 26, .10); font: 500 18px/1 Inter, Anuphan; }
.opt i { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 7px; font: 600 12.5px/1 "Geist Mono"; font-style: normal; color: #474c54; box-shadow: inset 0 0 0 1px rgba(21, 23, 26, .16); }
.opt.right { background: rgba(29, 122, 98, .12); box-shadow: inset 0 0 0 1.5px rgba(29, 122, 98, .55); color: #0f4d3d; }
.opt.right i { background: #1d7a62; color: #fff; box-shadow: none; }
.opt .tick { margin-left: auto; color: #1d7a62; font: 700 18px/1 Inter; }

/* admission tickets, as on the exam page */
.ticket { position: absolute; display: grid; grid-template-columns: 1fr 116px; width: 470px; height: 178px; border-radius: 20px;
  -webkit-mask: radial-gradient(circle 13px at calc(100% - 116px) 0, transparent 12.5px, #000 13px) top / 100% 51% no-repeat, radial-gradient(circle 13px at calc(100% - 116px) 100%, transparent 12.5px, #000 13px) bottom / 100% 51% no-repeat; }
.ticket::after { content: ""; position: absolute; inset: 8px; border: 1px solid rgba(21, 23, 26, .16); border-radius: 13px; }
.tk-main { padding: 24px 22px 20px 28px; display: flex; flex-direction: column; }
.tk-k { display: flex; align-items: baseline; gap: 8px; font: 500 16px/1 Inter, Anuphan; color: #474c54; }
.tk-k b { font: 400 62px/.8 "Instrument Serif"; color: #1d7a62; }
.tk-date { margin-top: 16px; font: 600 18px/1.3 Inter, Anuphan; }
.tk-time { margin-top: 6px; font: 500 28px/1.1 "Geist Mono"; letter-spacing: -.02em; }
.tk-stub { display: grid; align-content: center; justify-items: center; border-left: 2px dashed rgba(21, 23, 26, .28); }
.tk-day { font: 400 72px/.9 "Instrument Serif"; letter-spacing: -.02em; }
.tk-mon { font: 600 16px/1.4 Inter, Anuphan; color: #474c54; }
.tickets { position: absolute; inset: 0; filter: drop-shadow(0 24px 30px rgba(28, 34, 40, .2)) drop-shadow(0 2px 4px rgba(28, 34, 40, .08)); }

/* a slice of the almanac */
.heat { margin-top: 34px; display: grid; grid-template-columns: repeat(11, 30px); gap: 4px; }
.heat i { width: 30px; height: 22px; border-radius: 5px; }
.heat span { font: 500 11.5px/1 "Geist Mono"; color: #676c74; text-align: center; padding-top: 6px; }
`;

const page = (body) => `<!doctype html><html lang="th"><head><meta charset="utf-8"><base href="${base}"><style>${CSS}</style></head><body><div class="og"><div class="atmos"></div><div class="grain"></div><div class="brand">${MARK}<b>VetMock</b><i></i><span>VCA</span></div>${body}</div></body></html>`;

/** A plate. Its caption is whole ('full'), its number alone where a wall crowds it or runs off
 *  the edge ('number'), or left off where something stands in front of it ('none'): a caption
 *  never shows cut short. */
const plateAt = (id, x, y, w, h, extra = '', caption = 'full') => {
  const d = card(id);
  const no = `<span>Pl. ${String(d.plate).padStart(2, '0')}</span>`;
  const cap = caption === 'none' ? '' : `<figcaption>${no}${caption === 'full' ? `<span>${esc(d.tag)}</span>` : ''}</figcaption>`;
  return `<figure class="plate" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${d.paper};${extra}"><img src="${d.art.slice(1)}" alt="">${cap}</figure>`;
};

function wall(ids, { x0 = 700, y0 = 34, w = 168, h = 196, gap = 16, cols = 3 } = {}) {
  return ids.map((id, i) => plateAt(id, x0 + (i % cols) * (w + gap), y0 + Math.floor(i / cols) * (h + gap), w, h, '', 'number')).join('');
}

/** A Thai name broken only between its phrases (spaces and | marks), as the site sets it. */
const words = (text) => String(text).split(/(\s+|\|)/).map((t) => (t === '|' ? '<wbr>' : /^\s+$/.test(t) ? ' ' : t ? `<span class="nw">${esc(t)}</span>` : '')).join('');

function sub(items) {
  return `<p class="sub">${items.map((t) => `<span>${t}</span>`).join('')}</p>`;
}

function homeCover() {
  const s = SAMPLES.find((q) => q.domain === 'aquatic') || SAMPLES[0];
  const d = card(s.domain);
  const order = [1, 0, 2, 3, 4].filter((i) => i < s.options.length);
  const opts = order.map((oi, row) => `<div class="opt${oi === s.answer ? ' right' : ''}"><i>${'ABCDE'[row]}</i>${esc(s.options[oi])}${oi === s.answer ? '<span class="tick">✓</span>' : ''}</div>`).join('');
  return page(`
    ${wall(['equine', 'swine', 'aquatic', 'avian', 'ruminant', 'small-animal', 'exotic', 'theriogenology', 'zoonoses'], { x0: 716, y0: -60, w: 156, h: 186 })}
    <div class="glass" style="left:676px;top:150px;width:474px"><div class="q">
      <div class="q-top">● ลองข้อนี้<span class="pill"><i>Pl. ${String(d.plate).padStart(2, '0')}</i>${esc(d.th)}</span><span class="no">No. ${s.id}</span></div>
      <p class="q-stem">${esc(s.q)}</p>
      <div class="opts">${opts}</div>
    </div></div>
    <div class="copy">
      <p class="kicker">Veterinary Competency Assessment</p>
      <h1 style="font-size:64px"><span class="nw">ซ้อมสอบใบประกอบฯ</span><br><span class="nw">ให้เหมือน<em>วันจริง</em></span></h1>
      ${sub([`<b>${n(BANK.total)} ข้อ</b>`, `<b>${BANK.domains.length} หมวด</b>`, 'เฉลยทุกข้อ'])}
    </div>
    <p class="url"><b>vca</b>.vetmock.com</p>`);
}

function domainCover(d) {
  const p = profile.get(d.id);
  const share = p ? `ออกสอบราว ${Math.round(p.share * 100)}%` : null;
  const neighbour = BANK.domains[(BANK.domains.indexOf(d) + 1) % BANK.domains.length];
  return page(`
    ${plateAt(neighbour.id, 900, 120, 300, 360, 'rotate:7deg;opacity:.55', 'none')}
    ${plateAt(d.id, 700, 96, 380, 450, 'rotate:-2.5deg')}
    <div class="copy" style="top:170px;width:560px">
      <p class="kicker"><span class="no">Pl. ${String(d.plate).padStart(2, '0')}</span>${esc(d.tag)}</p>
      <h1 style="font-size:${d.th.length > 14 ? 64 : 76}px">${words(d.thw)}</h1>
      ${sub([`<b>${n(d.count)} ข้อ</b>`, ...(share ? [share] : []), 'เฉลยทุกข้อ'])}
    </div>
    <p class="url"><b>vca</b>.vetmock.com/d/${d.id}</p>`);
}

function examCover() {
  const round = ROUNDS[ROUNDS.length - 1];
  const day = (iso) => new Date(`${iso}T12:00:00+07:00`);
  const fmt = (iso, o) => day(iso).toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok', ...o });
  const tickets = round.parts.map((p, i) => `
    <div class="ticket" style="left:${640 + i * 50}px;top:${120 + i * 208}px;rotate:${i ? 1.8 : -2.4}deg;background:${i ? '#e6eef0' : '#f6eedf'}">
      <div class="tk-main"><p class="tk-k">หมวด <b>${p.part}</b></p><p class="tk-date">${fmt(p.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p><p class="tk-time">${p.from}–${p.to}</p></div>
      <div class="tk-stub"><span class="tk-day">${Number(p.date.slice(8))}</span><span class="tk-mon">${fmt(p.date, { month: 'short' })}</span></div>
    </div>`).join('');
  // Five long-running subjects across the eleven years, inked as the almanac inks them.
  const rows = ['Diseases dogs & cats', 'Avian medicine', 'Equine medicine & surgery', 'Aquatic medicine', 'Epidemiology'].map((en) => SUBJECTS.find((s) => s.en === en));
  const cells = rows.flatMap((s) => s.y.map((c) => {
    const v = cellValue(c);
    return `<i style="background:rgb(29 122 98 / ${v === null ? 0.04 : (Math.min(1, v / 40) * 0.9 + 0.05).toFixed(3)})"></i>`;
  })).join('') + YEARS.map((y) => `<span>${String(y).slice(2)}</span>`).join('');
  return page(`
    <div class="tickets">${tickets}</div>
    <div class="copy" style="top:150px;width:560px">
      <p class="kicker">The next sitting <span class="no">${round.id}</span></p>
      <h1>สนามสอบ VCA</h1>
      ${sub([`<b>${FORMAT.perPart} ข้อ</b> ต่อหมวด`, `${FORMAT.minutesPerPart / 60} ชั่วโมง`, `สถิติ ${YEARS.length} ปี`])}
      <div class="heat">${cells}</div>
    </div>
    <p class="url"><b>vca</b>.vetmock.com/exam</p>`);
}

function plainCover({ kicker, title, items, ids, url }) {
  return page(`
    ${wall(ids, { x0: 716, y0: 70, w: 156, h: 186, cols: 3 })}
    <div class="copy" style="top:170px;width:600px">
      <p class="kicker">${kicker}</p>
      <h1>${title}</h1>
      ${sub(items)}
    </div>
    <p class="url"><b>vca</b>.vetmock.com${url}</p>`);
}

const lib = BANK.library;
const COVERS = [
  ['home', homeCover],
  ['exam', examCover],
  ['practice', () => plainCover({ kicker: 'Practice & mock exams', title: '<span class="nw">ฝึกทีละข้อ</span><br><span class="nw">หรือ<em>สอบจำลอง</em></span>', items: ['เลือกหมวด จำนวนข้อ และเวลา', `<b>${FORMAT.perPart} ข้อ</b> เท่าสนามจริง`], ids: ['surgery', 'small-animal', 'equine', 'theriogenology', 'imaging', 'avian'], url: '/practice' })],
  ['bank', () => plainCover({ kicker: 'The bank', title: '<span class="nw">คลังข้อสอบ</span> VCA', items: [`<b>${n(BANK.total)} ข้อ</b>`, 'ค้นได้ทุกคำ', 'เฉลยทุกข้อ'], ids: ['pathology', 'micro-immuno', 'pharmacology', 'anatomy', 'neuro-ophtho', 'food-hygiene'], url: '/bank' })],
  ['library', () => plainCover({ kicker: 'The archive', title: 'เอกสาร VCA', items: [`<b>${n(lib.documents)} รายการ</b>`, `${n(lib.pages)} หน้า`, `ตั้งแต่ พ.ศ. ${lib.firstYear}`], ids: ['juris', 'epidemiology', 'zoonoses', 'food-hygiene', 'swine', 'ruminant'], url: '/library' })],
  ['progress', () => plainCover({ kicker: 'Your progress', title: 'ความคืบหน้า', items: ['เก็บในเครื่องของคุณ', 'ไม่ต้องสมัคร'], ids: ['aquatic', 'exotic', 'avian', 'equine', 'swine', 'small-animal'], url: '/progress' })],
  ['about', () => plainCover({ kicker: 'About the bank', title: 'ที่มาของข้อสอบ', items: ['ทุกข้อบอกที่มา', 'คัดเฉพาะข้อที่เฉลยชัด'], ids: ['anatomy', 'pathology', 'juris', 'imaging', 'epidemiology', 'surgery'], url: '/about' })],
  ['community', () => plainCover({ kicker: 'The commons', title: 'ชุมชน VCA', items: ['ถามข้อที่ติด', 'แชทตามหมวด', 'บัญชีเดียวกับ VetMock'], ids: ['small-animal', 'ruminant', 'zoonoses', 'swine', 'avian', 'theriogenology'], url: '/community' })],
  ...BANK.domains.map((d) => [`d-${d.id}`, () => domainCover(d)]),
];

// ── draw ─────────────────────────────────────────────────────────────────────────────────────
const require = createRequire(path.join(REPO, 'package.json'));
const { chromium } = require('@playwright/test');
const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch(chromiumPath ? { executablePath: chromiumPath } : {});
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
fs.mkdirSync(OUT, { recursive: true });
const sizes = [];
for (const [name, draw] of COVERS) {
  if (only.length && !only.includes(name)) continue;
  await tab.setContent(draw(), { waitUntil: 'networkidle' });
  await tab.evaluate(() => document.fonts.ready);
  await tab.evaluate(() => Promise.all([...document.images].map((img) => (img.complete ? null : new Promise((ok) => { img.onload = ok; img.onerror = ok; })))));
  const file = path.join(OUT, `${name}.jpg`);
  await tab.screenshot({ path: file, type: 'jpeg', quality: 88 });
  sizes.push(`${name} ${Math.round(fs.statSync(file).size / 1024)} KB`);
}
await browser.close();
server.close();
console.log(`og: ${sizes.length} covers\n  ${sizes.join(', ')}`);
