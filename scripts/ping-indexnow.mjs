#!/usr/bin/env node
// ============================================================
// ping-indexnow.mjs — บอก Bing/Yandex/Naver ว่ามี content ใหม่
// ============================================================
// ใช้: `node scripts/ping-indexnow.mjs` (รัน manual หลัง deploy)
//
// IndexNow protocol (https://www.indexnow.org/) — search engine
// ที่ support: Bing, Yandex, Naver, Seznam, DuckDuckGo (ผ่าน Bing)
//
// ⚠️  Google ไม่ support IndexNow — ใช้ Search Console submit sitemap แทน
// ============================================================

const API_KEY = 'e1e4e0feff0c42b1a0cb1118045ff82f';
const HOST = 'vetmock.vercel.app';
const URLS = [
  `https://${HOST}/`,
];

async function ping() {
  const body = {
    host: HOST,
    key: API_KEY,
    keyLocation: `https://${HOST}/${API_KEY}.txt`,
    urlList: URLS,
  };

  console.log('🔔 Pinging IndexNow with', URLS.length, 'URL(s)...');

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      console.log('✅ IndexNow accepted', res.status, res.statusText);
    } else {
      console.error('❌ IndexNow error:', res.status, res.statusText);
      const text = await res.text();
      if (text) console.error(text);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Network error:', err.message);
    process.exit(1);
  }
}

ping();
