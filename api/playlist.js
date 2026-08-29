// ============================================================
// /api/playlist?id=<PLAYLIST_ID> — Vercel Serverless Function
// ============================================================
//
// ดึงรายการคลิปใน YouTube playlist:
// ⚠️ ACCESS PATTERN (measured on prod 2026-08-29): /app/videos mounts one card
// per playlist and each card asks for a preview, so a cold visit fires ~41
// requests inside ~40 ms from ONE ip. Anything tuned for "a person clicks a
// playlist" is wrong here; the client now fetches only visible cards with a
// concurrency cap, and the limits below match the real burst.
//
//   1) ถ้ามี env YOUTUBE_API_KEY → ใช้ YouTube Data API v3 (แม่นที่สุด)
//   2) Fallback: ดึง RSS (เร็ว, ไม่ต้อง key)
//      ⚠️ RSS มีข้อจำกัด: แสดงเฉพาะคลิปจาก channel เจ้าของ playlist
//      ถ้า playlist รวมคลิปจากหลายช่อง (เช่น Dai รวมเลคเชอร์
//      จากหลายอาจารย์) → RSS จะคืน feed ว่าง (ไม่ใช่ error)
//
// Returns: { items: [{id, title}], count, source: 'api'|'rss', note? }
// ============================================================

import { rateLimit, clientIP, allowedOrigin } from './_lib/rate-limit.js';

const YT_API = 'https://www.googleapis.com/youtube/v3/playlistItems';
const YT_RSS = 'https://www.youtube.com/feeds/videos.xml';

export default async function handler(req, res) {
  // ── CORS: allow same-origin (no Origin header) + known origins ──
  // Browsers often omit Origin on same-origin GET fetches → only reject
  // when Origin IS present but isn't in the allowlist. POST routes (which
  // always carry Origin) can be stricter — see send-feedback.js.
  const reqOrigin = req.headers.origin;
  const allowed = allowedOrigin(req);
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', allowed);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (reqOrigin && !allowed) return res.status(403).json({ error: 'Origin not allowed' });

  // ── Rate limit ──
  // 30/min used to be the cap. One cold load of /app/videos is ~41 requests, so
  // the 31st onward answered 429 and the player rendered "ดึงรายการคลิปไม่ได้ —
  // playlist อาจรวมจากหลายช่อง" — a cause that had nothing to do with it. The cap
  // now clears a full page plus scrolling while still stopping a scripted flood.
  const ip = clientIP(req);
  const rl = await rateLimit(`playlist:${ip}`, 120, 60_000);
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfter));
    // Never cache a rate-limit answer: a cached 429 would lock out everyone
    // sharing the CDN node for its lifetime.
    res.setHeader('Cache-Control', 'no-store');
    return res.status(429).json({ error: 'Too many requests', reason: 'rate_limited', retryAfter: rl.retryAfter });
  }

  const rawId = Array.isArray(req.query?.id) ? req.query.id[0] : req.query?.id;
  const id = String(rawId || '').trim();
  if (!id || !/^[A-Za-z0-9_-]{10,40}$/.test(id)) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(400).json({ error: 'invalid playlist id', reason: 'bad_id' });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  // ─── 1) Prefer YouTube Data API if key configured ───
  let degraded = null; // why we fell through to RSS, if we did
  if (apiKey) {
    // YouTube's free quota is 10,000 UNITS/day and one fetch here costs 2
    // (playlistItems.list 1 + videos.list 1). The old cap of 250 CALLS/day was
    // therefore ~5% of what we may spend, while a single cold visit to
    // /app/videos costs 41 — the budget died after ~6 visitors and every
    // playlist silently degraded to an empty RSS answer for the rest of the day.
    const providerBudget = await rateLimit('provider:youtube-data-api:daily', 2000, 24 * 60 * 60 * 1000);
    if (providerBudget.ok) {
      try {
        const items = await fromDataApi(id, apiKey);
        // Only a REAL answer earns a long cache. An empty list from the API is
        // a genuine empty playlist, so it caches too — but says so.
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
        return res.status(200).json({
          items,
          count: items.length,
          source: 'api',
          ...(items.length === 0 ? { reason: 'empty_playlist' } : {}),
        });
      } catch (err) {
        console.warn('Data API failed, falling back to RSS:', err.message);
        degraded = 'api_error';
      }
    } else {
      degraded = 'budget_exhausted';
    }
  } else {
    degraded = 'no_key';
  }

  // ─── 2) Fallback to RSS ───
  try {
    const items = await fromRss(id);
    if (items.length === 0) {
      // An empty feed is NOT proof of a multi-channel playlist when we only
      // reached RSS because the Data API was unavailable — say which it is.
      // And never cache this: the old header cached the empty answer for 30
      // minutes with a 24-hour stale-while-revalidate window, so one exhausted
      // moment served "no clips" to every later visitor for up to a day.
      res.setHeader('Cache-Control', degraded ? 'no-store' : 's-maxage=1800, stale-while-revalidate=86400');
      return res.status(200).json({
        items: [],
        count: 0,
        source: 'rss',
        reason: degraded || 'multi_channel',
        note: degraded
          ? 'ดึงรายการคลิปจาก YouTube ไม่ได้ชั่วคราว'
          : 'YouTube RSS คืนเฉพาะคลิปของช่องเจ้าของ playlist, playlist นี้รวมคลิปจากหลายช่อง',
      });
    }
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');
    return res.status(200).json({ items, count: items.length, source: 'rss', ...(degraded ? { degraded } : {}) });
  } catch (err) {
    // A playlist that does not exist (deleted by its owner, or a stale id in
    // the library) is a 404 about that playlist — not a server fault. It was
    // answered with 502 'upstream_unreachable', untrue on both counts: YouTube
    // WAS reachable and told us plainly. It also meant one removed playlist
    // raised a 5xx alert and told the reader the server was broken.
    if (err?.playlistMissing) {
      console.warn('playlist not found on YouTube:', id);
      res.setHeader('Cache-Control', 'no-store');
      return res.status(404).json({ error: 'playlist not found', reason: 'playlist_not_found' });
    }
    console.error('playlist fetch error:', err);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ error: err.message || 'fetch failed', reason: 'upstream_unreachable' });
  }
}

// ─── Helper: YouTube Data API ───
// Fetch playlistItems + videos (for duration) — costs 2 units per 50-clip page
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
      const thumbs = it.snippet?.thumbnails || {};
      // pick best available thumbnail (max → high → medium → default)
      const thumbUrl = (thumbs.maxres || thumbs.high || thumbs.medium || thumbs.default)?.url || null;
      items.push({
        id: vid,
        title: it.snippet?.title || 'Untitled',
        channel: it.snippet?.videoOwnerChannelTitle || null,
        thumb: thumbUrl,
        position: it.snippet?.position ?? items.length,
      });
    }
    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;
  }

  // Fetch durations (videos.list) — batch up to 50 IDs per call
  if (items.length > 0) {
    try {
      for (let i = 0; i < items.length; i += 50) {
        const batch = items.slice(i, i + 50);
        const u = new URL('https://www.googleapis.com/youtube/v3/videos');
        u.searchParams.set('part', 'contentDetails');
        u.searchParams.set('id', batch.map((b) => b.id).join(','));
        u.searchParams.set('key', apiKey);
        const r = await fetch(u);
        if (!r.ok) break;
        const data = await r.json();
        const dmap = new Map();
        for (const it of data.items || []) {
          dmap.set(it.id, it.contentDetails?.duration || null);
        }
        for (const item of batch) {
          item.duration = formatIso8601(dmap.get(item.id));
        }
      }
    } catch (e) {
      // duration is optional — don't fail the whole call
      console.warn('duration fetch failed:', e.message);
    }
  }
  return items;
}

// PT5M30S → "5:30" · PT1H2M3S → "1:02:03"
function formatIso8601(s) {
  if (!s) return null;
  const m = s.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return null;
  const h = parseInt(m[1] || '0', 10);
  const mn = parseInt(m[2] || '0', 10);
  const sc = parseInt(m[3] || '0', 10);
  if (h > 0) return `${h}:${String(mn).padStart(2, '0')}:${String(sc).padStart(2, '0')}`;
  return `${mn}:${String(sc).padStart(2, '0')}`;
}

// ─── Helper: YouTube RSS feed ───
async function fromRss(playlistId) {
  const url = `${YT_RSS}?playlist_id=${playlistId}`;
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; vetmock/1.0)' },
  });
  if (r.status === 404) {
    // YouTube answered clearly: there is no such playlist. That is a 404 about
    // the resource, NOT a failure of ours — see the handler.
    const gone = new Error(`RSS ${r.status}`);
    gone.playlistMissing = true;
    throw gone;
  }
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
