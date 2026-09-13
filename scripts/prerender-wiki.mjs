#!/usr/bin/env node
// ============================================================
// scripts/prerender-wiki.mjs — static HTML + OG for every VetWiki article
// ============================================================
// Runs after `vite build`. For each governed topic it writes
//   dist/wiki/<subject>/<topic>/index.html
// which is byte-identical to the built SPA shell EXCEPT for the <head>:
// real <title>, description, canonical, Open Graph / Twitter tags and
// Article JSON-LD for that specific article.
//
// Why this instead of migrating to a framework: the only thing an SPA
// genuinely cannot do here is serve per-article metadata to a crawler or a
// chat-app link preview (they don't run our JS). Vercel serves a matching
// static file before falling back to the /wiki/* rewrite, so a shared link
// gets correct metadata AND the normal app boots and takes over. No SSR
// runtime, no framework change, no risk to the exam flow.
//
// Also refreshes public/sitemap.xml's wiki entries in dist.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildOgHead } from './lib/og-head.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const ORIGIN = process.env.VETMOCK_ORIGIN || 'https://vetmock.vercel.app';

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('prerender-wiki: dist/index.html not found — run vite build first');
  process.exit(1);
}

const shell = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

const vw = await import(new URL('../src/lib/vetwiki/index.js', import.meta.url).href);
const { SUBJECTS } = await import(new URL('../src/data/curriculum.js', import.meta.url).href);
const subjectName = (id) => SUBJECTS.find((s) => s.id === id)?.name || id.toUpperCase();

const topics = vw.listTopics();
const written = [];

for (const t of topics) {
  const k = vw.loadTopic(t.subject, t.topic);
  if (!k) continue;
  const prov = vw.provenanceSummary(k);
  const url = `${ORIGIN}/wiki/${t.subject}/${t.topic}`;
  const title = `${k.title} — VetWiki · VetMock`;
  // Honest description: say what the article is AND how well-checked it is.
  const checked = prov.verifiedClaimCount > 0
    ? `ตรวจทานกับแหล่งอ้างอิงภายนอกแล้ว ${prov.verifiedClaimCount} จุด`
    : 'เนื้อหาจากโน้ตเลกเชอร์ ยังไม่ได้ตรวจทานกับแหล่งอ้างอิงภายนอก';
  const description = `${k.summary || k.title} — ${subjectName(t.subject)} · ${k.sections.length} หัวข้อย่อย · ${checked}`.slice(0, 300);

  let html = buildOgHead(shell, {
    title, description, url, type: 'article', indexable: true,
    image: `${ORIGIN}/og/wiki.png`,
    imageAlt: `ความรู้ที่ เชื่อมถึงกัน — ${k.title} บน VetWiki`,
  });

  // Article JSON-LD. Only facts we actually hold; no invented author/date.
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: k.title,
    description,
    url,
    isPartOf: { '@type': 'WebSite', name: 'VetMock · VetWiki', url: `${ORIGIN}/wiki` },
    inLanguage: 'th-TH',
    articleSection: subjectName(t.subject),
    ...(prov.sources.length ? { citation: prov.sources.map((s) => s.citation) } : {}),
  };
  html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>\n  </head>`);

  const dir = path.join(DIST, 'wiki', t.subject, t.topic);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  written.push(`/wiki/${t.subject}/${t.topic}`);
}

// The wiki index itself.
{
  const url = `${ORIGIN}/wiki`;
  const html = buildOgHead(shell, {
    title: 'VetWiki — คลังความรู้สัตวแพทย์ที่ตรวจสอบได้',
    description: `คลังความรู้ที่ตรวจสอบได้ ${topics.length} หัวข้อ — ทุกหัวข้อบอกได้ว่าเนื้อหามาจากไหน ส่วนไหนตรวจทานกับแหล่งอ้างอิงภายนอกแล้ว`,
    url,
    indexable: true,
    image: `${ORIGIN}/og/wiki.png`,
    imageAlt: 'ความรู้ที่ เชื่อมถึงกัน — VetWiki บน VetMock',
  });
  fs.mkdirSync(path.join(DIST, 'wiki'), { recursive: true });
  fs.writeFileSync(path.join(DIST, 'wiki', 'index.html'), html, 'utf8');
  written.push('/wiki');
}

// ---- sitemap: merge the wiki URLs into the shipped sitemap ----
const sitemapPath = path.join(DIST, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  const entries = written
    .filter((u) => !xml.includes(`${ORIGIN}${u}<`))
    .map((u) => `  <url><loc>${ORIGIN}${u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq></url>`)
    .join('\n');
  if (entries) {
    xml = xml.replace('</urlset>', `${entries}\n</urlset>`);
    fs.writeFileSync(sitemapPath, xml, 'utf8');
  }
}

console.log(`✓ prerendered ${written.length} VetWiki pages with per-article metadata`);
for (const u of written) console.log(`   ${u}`);
