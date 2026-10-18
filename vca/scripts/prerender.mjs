// After `vite build`: one HTML file per public route, each with its own title, description,
// canonical address and link-preview cover, so a link shared to LINE, Facebook or X shows the
// page it points at. The body stays the app shell; the app renders the page as usual.
//
// Writes dist/<route>.html (served at /<route> through cleanUrls in vercel.json), fixes the
// cover on dist/index.html, and writes dist/sitemap.xml. Every number comes from the bank the
// generator built and from src/data, so a preview never quotes a count the site no longer has.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(APP, 'dist');
const ORIGIN = 'https://vca.vetmock.com';
const SITE = 'VetMock VCA';
const load = (rel) => import(pathToFileURL(path.join(APP, rel)).href);

const { BANK } = await load('src/generated/bank.js');
const { ROUNDS, FORMAT, upcomingRound } = await load('src/data/exam.js');
const { YEARS, RECENT, domainProfile } = await load('src/data/almanac.js');

const shell = path.join(DIST, 'index.html');
if (!fs.existsSync(shell)) {
  console.error('prerender: dist/index.html is missing; run vite build first');
  process.exit(1);
}

const n = (x) => Number(x).toLocaleString('en-US');
const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const text = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const be = (year) => String(year).slice(2);

/** A calendar day in Thai, read in Bangkok so the build machine's zone cannot move it. */
const thaiDay = (iso, opts) => new Date(`${iso}T12:00:00+07:00`).toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok', ...opts });

// ── what each route says about itself ────────────────────────────────────────────────────────
const lib = BANK.library;
const profile = domainProfile();
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
const round = upcomingRound(today) || null;
const span = `${be(RECENT[0])} ถึง ${be(RECENT[RECENT.length - 1])}`;

function examDescription() {
  const tail = `หมวดละ ${n(FORMAT.perPart)} ข้อ ${FORMAT.minutesPerPart / 60} ชั่วโมง พร้อมสถิติข้อสอบรายวิชา ${YEARS.length} ปีที่รุ่นพี่บันทึกไว้`;
  if (!round) return `กำหนดการสอบ VCA รอบถัดไปยังไม่ประกาศ ข้อสอบ${tail}`;
  const days = round.parts.map((p) => `หมวด ${p.part} ${thaiDay(p.date, { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}`);
  return `สอบ VCA รอบ ${round.id} ${days.join(' และ')} ${tail}`;
}

const PAGES = [
  {
    route: '/practice',
    cover: 'practice',
    title: 'ฝึกและสอบจำลอง',
    ogTitle: 'ตั้งชุดฝึกและสอบจำลอง VCA',
    description: `เลือกหมวด จำนวนข้อ และเวลาต่อข้อได้เอง ฝึกแบบเห็นเฉลยทันที หรือสอบจำลองจับเวลา ${n(FORMAT.perPart)} ข้อเท่าสนามจริง จากคลัง ${n(BANK.total)} ข้อใน ${BANK.domains.length} หมวด`,
    alt: 'ฝึกทีละข้อหรือสอบจำลอง บนภาพพิมพ์สัตว์ลายเส้น',
  },
  {
    route: '/bank',
    cover: 'bank',
    title: 'คลังข้อสอบ',
    ogTitle: 'คลังข้อสอบ VCA',
    description: `ค้นข้อสอบ VCA ทั้ง ${n(BANK.total)} ข้อได้ทุกคำ ดูเฉลยและคำอธิบายทุกข้อ กรองตามหมวดและที่มาของข้อ`,
    alt: `คลังข้อสอบ VCA ${n(BANK.total)} ข้อ บนภาพพิมพ์สัตว์ลายเส้น`,
  },
  {
    route: '/library',
    cover: 'library',
    title: 'เอกสาร VCA',
    ogTitle: 'เอกสาร VCA',
    description: `เอกสารติวและข้อสอบเก่า VCA ${n(lib.documents)} รายการ รวม ${n(lib.pages)} หน้า จัดเป็นชั้นตามสาขาวิชา${lib.firstYear ? ` ตั้งแต่ พ.ศ. ${lib.firstYear}` : ''}`,
    alt: `เอกสาร VCA ${n(lib.documents)} รายการ บนภาพพิมพ์สัตว์ลายเส้น`,
  },
  {
    route: '/progress',
    cover: 'progress',
    title: 'ความคืบหน้า',
    ogTitle: 'ความคืบหน้าการซ้อมสอบ VCA',
    description: 'ดูว่าทำไปแล้วกี่ข้อ ถูกกี่ข้อในแต่ละหมวด ฝึกซ้ำข้อที่พลาด และตั้งวันสอบเพื่อรู้ว่าต้องทำวันละกี่ข้อ ข้อมูลเก็บในเครื่องของคุณ ไม่ต้องสมัคร',
    alt: 'ความคืบหน้าการซ้อมสอบ บนภาพพิมพ์สัตว์ลายเส้น',
  },
  {
    route: '/exam',
    cover: 'exam',
    title: 'สนามสอบ',
    ogTitle: round ? `สนามสอบ VCA รอบ ${round.id}` : 'สนามสอบ VCA',
    description: examDescription(),
    alt: round
      ? `ตั๋วสอบ VCA รอบ ${round.id} ${round.parts.map((p) => `หมวด ${p.part} วันที่ ${thaiDay(p.date, { day: 'numeric', month: 'short', year: 'numeric' })}`).join(' และ')}`
      : 'สนามสอบ VCA และสถิติข้อสอบรายวิชา',
  },
  {
    route: '/about',
    cover: 'about',
    title: 'ที่มาของข้อสอบ',
    ogTitle: 'ที่มาของข้อสอบใน VetMock VCA',
    description: `ข้อสอบ ${n(BANK.total)} ข้อในคลังมาจากไหน คัดอย่างไร ข้อไหนเป็นแนว VCA ข้อไหนมาจากข้อสอบเก่าหรือคลังรายวิชา และทำไมบางข้อถูกพักไว้ก่อน`,
    alt: 'ที่มาของข้อสอบ บนภาพพิมพ์สัตว์ลายเส้น',
  },
  // The community's front page, in a build that has a backend for it (src/online/config.js).
  ...(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY ? [{
    route: '/community',
    cover: 'community',
    title: 'ชุมชน',
    ogTitle: 'ชุมชน VetMock VCA',
    description: 'ถามข้อสอบที่ติด แชร์เทคนิค เล่าประสบการณ์สอบ และแชทตามหมวดวิชา กับเพื่อนที่เตรียมสอบ VCA รอบเดียวกัน เข้าสู่ระบบด้วยบัญชีเดียวกับ VetMock',
    alt: 'ชุมชน VCA บนภาพพิมพ์สัตว์ลายเส้น',
  }] : []),
  ...BANK.domains.map((d) => {
    const p = profile.get(d.id);
    const pctOf = p ? Math.round(p.share * 100) : null;
    const share = pctOf === null ? '' : ` ออกสอบราว ${pctOf < 1 ? 'ไม่ถึง 1' : pctOf}% ของข้อที่รุ่นพี่บันทึกได้ในปี ${span}`;
    return {
      route: `/d/${d.id}`,
      cover: `d-${d.id}`,
      title: d.th,
      ogTitle: `ข้อสอบ VCA หมวด${d.th}`,
      description: `ข้อสอบ VCA หมวด${d.th} ${n(d.count)} ข้อ พร้อมเฉลยและคำอธิบาย${share} ฝึก 10 ข้อหรือสอบจำลองเฉพาะหมวดนี้ได้ทันที`,
      alt: `ภาพพิมพ์ลายเส้นประจำหมวด${d.th} กับจำนวนข้อสอบ ${n(d.count)} ข้อ`,
    };
  }),
];

// ── head surgery ─────────────────────────────────────────────────────────────────────────────
// The tags a route owns. Everything else in the head (theme, fonts, the app's scripts) stays.
const OWNED = [
  /<title>[\s\S]*?<\/title>\s*/i,
  /<meta\s+name="description"[^>]*>\s*/gi,
  /<link\s+rel="canonical"[^>]*>\s*/gi,
  /<meta\s+property="og:(?:url|title|description|image|image:width|image:height|image:alt|image:type)"[^>]*>\s*/gi,
  /<meta\s+name="twitter:(?:card|title|description|image|image:alt)"[^>]*>\s*/gi,
];

function headFor(page) {
  const url = `${ORIGIN}${page.route}`;
  const image = `${ORIGIN}/og/${page.cover}.jpg`;
  return [
    `<title>${text(`${page.title} | ${SITE}`)}</title>`,
    `<meta name="description" content="${attr(page.description)}" />`,
    `<link rel="canonical" href="${attr(url)}" />`,
    `<meta property="og:url" content="${attr(url)}" />`,
    `<meta property="og:title" content="${attr(page.ogTitle)}" />`,
    `<meta property="og:description" content="${attr(page.description)}" />`,
    `<meta property="og:image" content="${attr(image)}" />`,
    '<meta property="og:image:type" content="image/jpeg" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${attr(page.alt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${attr(page.ogTitle)}" />`,
    `<meta name="twitter:description" content="${attr(page.description)}" />`,
    `<meta name="twitter:image" content="${attr(image)}" />`,
    `<meta name="twitter:image:alt" content="${attr(page.alt)}" />`,
  ].join('\n    ');
}

/** The shell with a route's own tags where the <title> was, and none of the shell's left over. */
function render(html, page) {
  const at = html.search(/<title>/i);
  if (at < 0) throw new Error('prerender: dist/index.html has no <title>');
  const before = html.slice(0, at);
  let after = html.slice(at);
  for (const re of OWNED) after = after.replace(re, '');
  return `${before}${headFor(page)}\n    ${after}`;
}

// The home page keeps its own title and copy from index.html; only its cover is set here, as
// the JPEG render-og.mjs draws, and X is told to use it too.
function homeShell(html) {
  const image = `${ORIGIN}/og/home.jpg`;
  let out = html.replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/i, `$1${image}$2`);
  if (!/<meta\s+property="og:image:type"/i.test(out)) {
    out = out.replace(/(<meta\s+property="og:image"[^>]*>)/i, '$1\n    <meta property="og:image:type" content="image/jpeg" />');
  }
  if (/<meta\s+name="twitter:image"/i.test(out)) {
    out = out.replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/i, `$1${image}$2`);
  } else {
    out = out.replace(/(<meta\s+name="twitter:card"[^>]*>)/i, `$1\n    <meta name="twitter:image" content="${image}" />`);
  }
  return out;
}

// Inter (45 KB) is preloaded on the front door only. There its sample question is the page's largest
// text: without the preload it is laid out in a fallback font and again when Inter arrives, and the
// largest paint came at 3.9 s on a 4G phone against 2.9 s with it (first paint 2.57 s against 2.60 s,
// eight runs each). On any other page nothing waits for Inter, and the preload only delays the first
// paint by 80 to 270 ms.
const INTER_PRELOAD = /<link rel="preload" href="\/fonts\/inter-latin-sub\.woff2"[^>]*>\s*/i;

// ── write ────────────────────────────────────────────────────────────────────────────────────
const base = homeShell(fs.readFileSync(shell, 'utf8'));
if (!INTER_PRELOAD.test(base)) throw new Error('prerender: index.html no longer preloads Inter; the front door needs it (see INTER_PRELOAD)');
fs.writeFileSync(shell, base);

for (const page of PAGES) {
  const cover = path.join(APP, 'public', 'og', `${page.cover}.jpg`);
  if (!fs.existsSync(cover)) throw new Error(`prerender: missing cover public/og/${page.cover}.jpg (run npm run og)`);
  const file = path.join(DIST, `${page.route.slice(1)}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, render(base.replace(INTER_PRELOAD, ''), page));
}

const routes = ['/', ...PAGES.map((p) => p.route)];
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map((r) => `  <url><loc>${ORIGIN}${r === '/' ? '/' : r}</loc></url>`),
  '</urlset>',
  '',
].join('\n');
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);

console.log(`prerender: ${PAGES.length} routes + home, sitemap ${routes.length} urls${round ? `, exam round ${round.id}` : ', no exam round announced'} (${ROUNDS.length} rounds known)`);
