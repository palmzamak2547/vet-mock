// ============================================================
// /api/playlist?id=<PLAYLIST_ID> — Vercel Serverless Function
// ============================================================
//
// ดึงรายการคลิปใน YouTube playlist:
//   1) ถ้ามี env YOUTUBE_API_KEY → ใช้ YouTube Data API v3 (แม่นที่สุด)
//   2) Fallback: ดึง RSS (เร็ว, ไม่ต้อง key)
//      ⚠️ RSS มีข้อจำกัด: แสดงเฉพาะคลิปจาก channel เจ้าของ playlist
//      ถ้า playlist รวมคลิปจากหลายช่อง (เช่น Dai รวมเลคเชอร์
//      จากหลายอาจารย์) → RSS จะคืน feed ว่าง (ไม่ใช่ error)
//
// Returns: { items: [{id, title}], count, source: 'api'|'rss', note? }
// ============================================================

const YT_API = 'https://www.googleapis.com/youtube/v3/playlistItems';
const YT_RSS = 'https://www.youtube.com/feeds/videos.xml';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const id = (req.query?.id || '').trim();
  if (!id || !/^[A-Za-z0-9_-]{10,40}$/.test(id)) {
    return res.status(400).json({ error: 'invalid playlist id' });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  // ─── 1) Prefer YouTube Data API if key configured ───
  if (apiKey) {
    try {
      const items = await fromDataApi(id, apiKey);
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
      return res.status(200).json({ items, count: items.length, source: 'api' });
    } catch (err) {
      console.warn('Data API failed, falling back to RSS:', err.message);
    }
  }

  // ─── 2) Fallback to RSS ───
  try {
    const items = await fromRss(id);
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');
    if (items.length === 0) {
      // ไม่ใช่ error — playlist ที่รวม video หลายช่องจะ RSS ว่าง
      return res.status(200).json({
        items: [],
        count: 0,
        source: 'rss',
        note: 'YouTube RSS คืนเฉพาะคลิปของช่องเจ้าของ playlist · playlist นี้น่าจะรวมคลิปจากหลายช่อง · ลองคลิก ▶ ในเครื่องเล่นเพื่อดูรายการคลิปจาก YouTube โดยตรง หรือ เปิดบน YouTube',
      });
    }
    return res.status(200).json({ items, count: items.length, source: 'rss' });
  } catch (err) {
    console.error('playlist fetch error:', err);
    return res.status(502).json({ error: err.message || 'fetch failed' });
  }
}

// ─── Helper: YouTube Data API ───
async function fromDataApi(playlistId, apiKey) {
  const items = [];
  let pageToken = '';
  for (let page = 0; page < 5; page++) {
    const url = new URL(YT_API);
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('playlistId', playlistId);
    url.searchParams.set('key', apiKey);
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const r = await fetch(url);
    if (!r.ok) {
      const txt = await r.text();
      throw new Error(`Data API ${r.status}: ${txt.slice(0, 200)}`);
    }
    const data = await r.json();
    for (const it of data.items || []) {
      const vid = it.snippet?.resourceId?.videoId;
      if (!vid) continue;
      items.push({ id: vid, title: it.snippet?.title || 'Untitled' });
    }
    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;
  }
  return items;
}

// ─── Helper: YouTube RSS feed ───
async function fromRss(playlistId) {
  const url = `${YT_RSS}?playlist_id=${playlistId}`;
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; vet-mock/1.0)' },
  });
  if (!r.ok) throw new Error(`RSS ${r.status}`);
  const xml = await r.text();
  if (!xml || !xml.includes('<feed')) throw new Error('not a valid feed');

  const items = [];
  const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
  let m;
  while ((m = entryRe.exec(xml)) !== null) {
    const entry = m[1];
    const vid = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const title = entry.match(/<title>([\s\S]*?)<\/title>/);
    if (vid) {
      items.push({
        id: vid[1].trim(),
        title: (title ? title[1] : 'Untitled').trim()
          .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
      });
    }
  }
  return items;
}
