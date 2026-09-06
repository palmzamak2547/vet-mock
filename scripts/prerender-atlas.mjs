// Public, script-free entry for discovery, sharing and browsers without WebGL.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { ATLAS_CATALOG } from '../src/data/atlas-catalog.js';
import { atlasSharePath } from '../src/lib/atlas-workspace.js';
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const url = 'https://vetmock.vercel.app/atlas/';
const species = new Set(ATLAS_CATALOG.map(specimen => specimen.speciesId)).size;
const title = 'Atlas สัตว์ 3D — สำรวจและเปรียบเทียบกะโหลก | VetMock';
const description = `สำรวจกะโหลกสัตว์จาก ${ATLAS_CATALOG.length} ตัวอย่าง ${species} ชนิดสัตว์ หมุน เปรียบเทียบ และอ่านแหล่งที่มาของโมเดลใน VetMock`;
const cards = ATLAS_CATALOG.map(specimen => `<article><a class="poster" href="${escape(atlasSharePath({ specimenId: specimen.id, selected: specimen.parts[0].id }))}"><img src="${escape(specimen.poster)}" width="600" height="600" alt="ภาพจากโมเดล ${escape(specimen.title)}" loading="lazy"></a><div class="entry"><p class="species">${escape(specimen.species)} · ${escape(specimen.scientificName)}</p><h2>${escape(specimen.title)}</h2><p>${escape(specimen.subtitle)}</p><p class="source">${escape(specimen.institution)}<br>${escape(specimen.license)}</p><a class="action" href="${escape(atlasSharePath({ specimenId: specimen.id, selected: specimen.parts[0].id }))}">เปิดสำรวจ 3D <span aria-hidden="true">↗</span></a><a class="citation" href="${escape(specimen.sourceUrl)}" rel="noopener noreferrer">แหล่งโมเดลต้นฉบับ</a></div></article>`).join('\n');
const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@type': 'LearningResource', name: title, description, url, inLanguage: ['th', 'en'], learningResourceType: 'Interactive anatomy atlas', educationalUse: 'Visualization and comparison', isAccessibleForFree: true, publisher: { '@type': 'Organization', name: 'VetMock' } }).replace(/</g, '\\u003c');
const html = `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${url}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${url}"><meta property="og:type" content="website"><meta property="og:image" content="https://vetmock.vercel.app${escape(ATLAS_CATALOG[0].poster)}"><link rel="icon" href="/favicon.svg"><link rel="manifest" href="/manifest.webmanifest"><script type="application/ld+json">${jsonLd}</script>
<style>@font-face{font-family:Sarabun;src:url('/fonts/sarabun-400.woff2') format('woff2');font-display:swap}*{box-sizing:border-box}body{margin:0;background:#f6efe4;color:#2b2419;font-family:Sarabun,system-ui,sans-serif;line-height:1.8}main{max-width:1100px;margin:auto;padding:28px 24px 60px}nav{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #d8c9a8;padding-bottom:18px}a{color:inherit;text-underline-offset:4px}nav a{min-height:44px;display:inline-flex;align-items:center}header{padding:48px 0 32px;max-width:760px}h1{font-size:clamp(32px,6vw,58px);line-height:1.25;letter-spacing:-.04em;margin:12px 0 18px}header p{font-size:18px}.eyebrow{font-size:12px;letter-spacing:.13em;color:#355a39}.intro{color:#5c4f3d}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:22px}article{background:#fdf8ef;border:1px solid #d8c9a8;border-radius:16px;overflow:hidden}.poster{display:block;aspect-ratio:4/3;background:#5c4f3d}.poster img{width:100%;height:100%;object-fit:contain}.entry{padding:24px}h2{font-size:24px;line-height:1.4;margin:8px 0}.species{font-size:12px;color:#355a39;margin:0}.source{font-size:12px;color:#5c4f3d}.action{display:flex;align-items:center;justify-content:space-between;min-height:48px;background:#4a6b4a;color:white;text-decoration:none;padding:10px 16px;border-radius:9px;margin-top:20px}.citation{display:inline-flex;align-items:center;min-height:44px;font-size:12px;margin-top:8px}.context{border-top:1px solid #d8c9a8;margin-top:36px;padding-top:24px;max-width:80ch}.context h2{font-size:18px}.context p{font-size:14px;color:#5c4f3d}a:focus-visible{outline:3px solid #4a6b4a;outline-offset:4px}@media(prefers-color-scheme:dark){body{background:#191611;color:#f2e9d8}article{background:#292318;border-color:#514630}.poster{background:#14120e}.intro,.source,.context p{color:#d5c6b1}.eyebrow,.species{color:#b4cba1}nav,.context{border-color:#514630}}@media(max-width:600px){main{padding:18px 18px 40px}header{padding:28px 0 24px}.entry{padding:20px}}</style></head><body><main><nav aria-label="นำทาง"><a href="/">← VetMock</a><a href="/app/atlas">เปิด Atlas</a></nav><header><span class="eyebrow">VETMOCK / ANATOMY COLLECTION</span><h1>สัตว์ต่างชนิด<br>มองโครงสร้างร่วมกัน</h1><p class="intro">หมุนดูโมเดลจริง เปรียบเทียบรูปร่างจากหลายมุม และเปิดอ่านที่มาของสิ่งที่เห็น เริ่มจากกะโหลกสัตว์ ${ATLAS_CATALOG.length} ตัวอย่างใน ${species} ชนิดสัตว์</p></header><section class="grid" aria-label="ตัวอย่างใน Atlas">${cards}</section><section class="context"><h2>เรียนรู้จากแหล่งที่ตรวจสอบได้</h2><p>ชุดนี้เชื่อมไปยังผู้สร้างและสิทธิ์ใช้งานของแต่ละโมเดล ขนาดถูกปรับให้พอดีจอเพื่อเทียบรูปร่าง ไม่ใช่มาตราส่วนร่างกายจริง การแสดงผลเป็นผิว 3D ไม่ใช่ภาพ CT ตัดขวาง และยังไม่ครอบคลุมทุกส่วนหรือความแปรผันของสัตว์แต่ละชนิด</p><p>โมเดลที่แยกชิ้นมีชื่อศัพท์และแหล่งอ้างอิงกำกับ ตำราที่แนะนำใช้สำหรับศึกษาและตรวจทานประกอบ การมีแหล่งที่มาไม่ได้หมายถึงการรับรองทางคลินิก</p><a href="/atlas/ATTRIBUTION.md">เครดิตและรายละเอียดการดัดแปลง</a></section></main></body></html>`;
await mkdir(resolve('dist/atlas'), { recursive: true });
await writeFile(resolve('dist/atlas/index.html'), html);
// Vite owns the dependency graph. Cache only this entry and its actual lazy
// renderer dependencies, not the question banks or the account application.
const viteManifest = JSON.parse(await readFile(resolve('dist/.vite/manifest.json'), 'utf8'));
const included = new Set();
const files = new Set();
function includeEntry(key) {
  if (included.has(key)) return;
  const entry = viteManifest[key];
  if (!entry) throw new Error(`Missing Atlas build entry: ${key}`);
  included.add(key); files.add(entry.file);
  for (const css of entry.css || []) files.add(css);
  for (const dependency of entry.imports || []) includeEntry(dependency);
}
includeEntry('atlas.html');
// Shared chunks can also expose unrelated lazy loaders. Atlas has one explicit
// lazy renderer; following every dynamic edge would download the video corpus.
includeEntry('src/components/AtlasScene.jsx');
for (const weight of ['400', '500', '600', '700', 'i400', 'i700']) files.add(`fonts/sarabun-${weight}.woff2`);
for (const specimen of ATLAS_CATALOG) files.add(specimen.poster.slice(1));
const shellAssets = [];
for (const file of [...files].sort()) {
  const bytes = await readFile(resolve('dist', file));
  shellAssets.push({ url: `/${file}`, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
}
const entryHtml = await readFile(resolve('dist/atlas.html'));
const revision = createHash('sha256').update(entryHtml).update(JSON.stringify(shellAssets)).digest('hex');
await writeFile(resolve('dist/atlas-offline.json'), JSON.stringify({ version: 1, revision, entryScript: viteManifest['atlas.html'].file, assets: shellAssets }));
const sitemapPath = resolve('dist/sitemap.xml');
const sitemap = await readFile(sitemapPath, 'utf8');
if (!sitemap.includes(`${url}</loc>`)) await writeFile(sitemapPath, sitemap.replace('</urlset>', `  <url><loc>${url}</loc><changefreq>monthly</changefreq></url>\n</urlset>`));
console.log(`Atlas entry prerendered: ${ATLAS_CATALOG.length} specimens / ${species} species.`);
