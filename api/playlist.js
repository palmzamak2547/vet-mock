// ============================================================
// /api/playlist?id=<PLAYLIST_ID> — Vercel Serverless Function
// ดึง YouTube playlist RSS ฝั่ง server เพื่อหลีกเลี่ยง CORS ใน
// browser และทดแทน CORS proxies สาธารณะที่ไม่เสถียร
// ============================================================
//
// Returns { items: [{id, title}] } หรือ { error: '...' }
//
// YouTube RSS เก็บได้ ~15 คลิปล่าสุด/playlist — เหมาะกับการ
// preview ใน Player modal ไม่ต้องใช้ Data API key
// ============================================================

export default async function handler(req, res) {
  // CORS (แม้จะเป็น same-origin บน Vercel แต่กันไว้เผื่อ)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const id = (req.query?.id || '').trim();
  if (!id || !/^[A-Za-z0-9_-]{10,40}$/.test(id)) {
    return res.status(400).json({ error: 'invalid playlist id' });
  }

  const url = `https://www.youtube.com/feeds/videos.xml?playlist_id=${id}`;

  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; vet-mock/1.0; +https://github.com/palmzamak2547/vet-mock)' },
    });
    if (!r.ok) {
      return res.status(502).json({ error: `youtube responded ${r.status}` });
    }
    const xml = await r.text();
    if (!xml || !xml.includes('<entry')) {
      return res.status(404).json({ error: 'playlist empty or not found' });
    }

    // Parse <entry> blocks ออกมาเอง — ไม่ต้องใช้ DOMParser ฝั่ง node
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
            .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
        });
      }
    }

    // Cache 1 ชั่วโมง + stale-while-revalidate 24 ชม. — ลด load + เร็ว
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ items, count: items.length });
  } catch (err) {
    console.error('playlist fetch error:', err);
    return res.status(500).json({ error: err.message || 'fetch failed' });
  }
}
