// ============================================================
// /api/library-blob — streams one library object from private R2.
// ============================================================
// The second half of the no-S3-credentials design (see _lib/blob-token.js
// for why S3 presigning is unavailable). /api/library-file authenticates
// the caller and mints a signed, minutes-lived link here; this endpoint
// verifies the signature and streams the bytes from R2 through the
// Cloudflare REST API, which the standing account token CAN do.
//
// Range is forwarded, but the storage API ignores it and sends the whole
// object, so every GET pulls it through this function: the bytes are budgeted
// per member (BLOB_BYTES). A reading surface: when the shared limiter cannot
// count, this instance's own counter bounds it instead of a refusal.

import { verifyBlobToken } from './_lib/blob-token.js';
import { rateLimit, rateLimitLocal, clientIP } from './_lib/rate-limit.js';
import { byteRange } from '../workers/library-archive.js';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

// Storage ignores Range, so each GET streams the whole object through this
// function. The budget is per address AND per link. Public links are minted
// on fixed windows, so a whole lecture hall behind one NAT can open the SAME
// URL at once: 300 per 10 minutes stays above the largest class (about 150)
// while a looping viewer or a script is still capped.
export const BLOB_RATE = { max: 300, windowMs: 10 * 60 * 1000 };

// The bytes one caller may pull through this function in the same window, for
// documents: 300 opens of a 50 MB deck were 15 GB in ten minutes. A link
// library-file.js mints for a member carries a digest of their id (u), and
// they are counted on it: 2 GB is 40 opens of a 50 MB deck, and one member
// looping a link stops only themselves. A link without one (an open ticket) is
// counted by address, 8 GB, enough for a hall opening one deck at once.
// Video and audio are not in this budget (the mime comes from the signed
// token, so a client cannot claim it): storage ignores Range, so every range
// reads the object from byte 0 and an honest count of a seek is most of the
// object; a byte budget would refuse a student who seeks during a lecture.
// They keep BLOB_RATE per link. The real fix is a ranged read (see the notes).
export const BLOB_BYTES = { max: 2 * 1024 ** 3, address: 8 * 1024 ** 3, windowMs: 10 * 60 * 1000 };

// A refusal is read in the deck's own tab, so it is a page in Thai that says
// what happened and when to try again, not JSON.
export function refusalPage(retryAfter) {
  const minutes = Math.max(1, Math.ceil(Number(retryAfter || 60) / 60));
  return `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>เปิดไฟล์ไม่ได้ชั่วคราว</title>
<style>body{font-family:system-ui,sans-serif;max-width:32rem;margin:15vh auto;padding:0 1rem;line-height:1.6;color:#2b2419;background:#f6efe4}h1{font-size:1.25rem}</style></head>
<body><h1>เปิดไฟล์ไม่ได้ชั่วคราว</h1><p>ช่วงนี้บัญชีหรือเครือข่ายนี้เปิดไฟล์จากคลังเอกสารไปมากแล้ว ลองเปิดอีกครั้งในอีกประมาณ ${minutes} นาที</p><p>ไฟล์ที่เคยเปิดในเครื่องนี้แล้วยังอ่านได้จากหน้าคลังเอกสาร</p></body></html>`;
}

function refuse(res, limit) {
  res.statusCode = 429;
  res.setHeader('Retry-After', String(limit.retryAfter || 60));
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.end(refusalPage(limit.retryAfter));
}

// The shared count, or this instance's own when the shared limiter cannot count.
async function count(key, max, windowMs, by) {
  const shared = await rateLimit(key, max, windowMs, { by });
  return shared.unavailable ? rateLimitLocal(key, max, windowMs, { by }) : shared;
}

/**
 * What one GET is counted before it is served: a document's catalogued size;
 * nothing for video and audio (exempt, above). A document whose size is not
 * catalogued is counted as it streams instead (countStreamed), so it is never
 * counted as less than it sends; before serving it is counted 1 byte, which
 * refuses it once the budget is already spent.
 */
export function bytesPulled(payload, media) {
  if (media) return 0;
  return Number.isSafeInteger(payload?.n) && payload.n > 0 ? payload.n : 1;
}

/** Counts the bytes that pass, then calls done(total) once the stream ends or stops. */
export function countStreamed(body, done) {
  let total = 0;
  let reported = false;
  const report = () => { if (!reported) { reported = true; done(total); } };
  return body.pipeThrough(new TransformStream({
    transform(chunk, controller) { total += chunk.byteLength || chunk.length || 0; controller.enqueue(chunk); },
    flush() { report(); },
    cancel() { report(); },
  }));
}

// What the browser is told the bytes are. The catalog is curated under the
// service role, but this route answers on the app's OWN origin — a row whose
// mime said text/html or image/svg+xml would have rendered inline right here,
// under the app's CSP (which allows inline script). Those types are handed
// over as a download instead; everything else keeps its declared mime.
const INLINE_UNSAFE_MIME = /html|xml|javascript|ecmascript/i;
// Word, PowerPoint and Excel files are zipped XML that no browser renders as a
// page, but "openxmlformats" in their type matched the guard above: all 214 of
// them went out as an application/octet-stream attachment, which a phone
// saves as an unknown file instead of previewing.
const OFFICE_MIME = /^application\/vnd\.openxmlformats-officedocument\.(?:wordprocessingml\.document|presentationml\.presentation|spreadsheetml\.sheet)$/i;
export function contentHeaders(payload, fallback) {
  const declared = payload?.m || fallback || 'application/octet-stream';
  const unsafe = INLINE_UNSAFE_MIME.test(declared) && !OFFICE_MIME.test(declared);
  return {
    type: unsafe ? 'application/octet-stream' : declared,
    disposition: unsafe ? 'attachment' : 'inline',
  };
}

// RFC 5987 value: encodeURIComponent leaves !'()* alone, and a quote inside
// filename*=UTF-8''... ends the value early.
const rfc5987 = (s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
// The plain filename= fallback for clients that ignore filename*: ASCII only,
// no quotes.
const asciiName = (s) => (String(s).replace(/[^\x20-\x7E]/g, '_').replace(/"/g, '').trim() || 'document');

// Waiting for storage's response headers, and the longest silence tolerated
// mid-body. Neither is a cap on the whole transfer: a slow link may take as long
// as it needs while bytes keep arriving.
const UPSTREAM_HEADERS_MS = 60_000;
const UPSTREAM_IDLE_MS = 60_000;

// Re-arms an idle timer on every read from storage. pull() runs only when the
// consumer wants more (highWaterMark 0), so time spent waiting on a slow client
// never counts; only silence from storage does. A stall aborts the fetch and
// errors the stream, which truncates the download rather than claiming it done.
function stallGuard(body, disconnected) {
  const reader = body.getReader();
  return new ReadableStream({
    async pull(controller) {
      const timer = setTimeout(() => {
        const stalled = new Error('storage_stalled');
        disconnected.abort(stalled);
        reader.cancel(stalled).catch(() => {});
        try { controller.error(stalled); } catch { /* already finished */ }
      }, UPSTREAM_IDLE_MS);
      try {
        const { done, value } = await reader.read();
        if (done) controller.close(); else controller.enqueue(value);
      } catch (error) {
        try { controller.error(error); } catch { /* already finished */ }
      } finally {
        clearTimeout(timer);
      }
    },
    cancel(reason) { return reader.cancel(reason); },
  }, { highWaterMark: 0 });
}

// The bytes [offset, offset + length) of a whole-object stream. Storage sends
// the object from its first byte whatever was asked, so the prefix is read and
// dropped, and storage is let go once the range is out.
// ponytail: reads the prefix through the function, so a seek near the end of a
// big video costs the whole object; a ranged storage read (an R2 binding, as
// the archive worker has) removes that if media use grows.
export function sliceBody(body, offset, length) {
  const reader = body.getReader();
  let skip = offset;
  let left = length;
  return new ReadableStream({
    async pull(controller) {
      for (;;) {
        if (left <= 0) {
          controller.close();
          reader.cancel().catch(() => {});
          return;
        }
        const { done, value } = await reader.read();
        if (done) {
          controller.error(new Error('object_shorter_than_catalogued'));
          return;
        }
        let chunk = value;
        if (skip >= chunk.length) { skip -= chunk.length; continue; }
        if (skip > 0) { chunk = chunk.subarray(skip); skip = 0; }
        if (chunk.length > left) chunk = chunk.subarray(0, left);
        left -= chunk.length;
        controller.enqueue(chunk);
        return;
      }
    },
    cancel(reason) { return reader.cancel(reason); },
  }, { highWaterMark: 0 });
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    return res.end();
  }

  const url = new URL(req.url, 'http://localhost');
  const payload = verifyBlobToken(url.searchParams.get('t'), url.searchParams.get('s'));
  if (!payload) {
    res.statusCode = 403;
    res.setHeader('Cache-Control', 'no-store');
    return res.end(JSON.stringify({ error: 'link_invalid_or_expired' }));
  }

  const accountId = process.env.R2_ACCOUNT_ID || process.env.CF_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    res.statusCode = 503;
    return res.end(JSON.stringify({ error: 'storage_not_configured' }));
  }

  // How long this response may sit in the browser's cache: exactly as long
  // as the link itself is valid. Tokens are minted against fixed window
  // boundaries, so a re-open within the window is a cache hit, not a
  // re-stream.
  const cacheSeconds = Math.max(0, Math.floor(payload.e - Date.now() / 1000));
  const access = payload.a === 'public' ? 'public' : 'restricted';
  const cacheControl = access === 'public' ? `private, max-age=${cacheSeconds}` : 'no-store';
  res.setHeader('X-VetMock-Library-Access', access);

  // Video and audio answer a byte range with 206: Safari on iPhone and iPad
  // plays media only from a server that does (Apple's media guidance), and the
  // 61 library videos used to come back whole with Accept-Ranges: none. Only
  // media: a PDF viewer told it may seek would ask for ranges that each pull
  // the whole object through here (see sliceBody).
  const media = /^(?:video|audio)\//i.test(payload.m || '');
  const asksRange = media && req.method === 'GET' && !!req.headers.range;

  // The CF REST object API is a management plane: it ignores Range and
  // rejects HEAD (probed live — HEAD came back as an upstream error, and a
  // 1 KB Range request returned the full body, rechecked 1 Nov 2026). Answer
  // HEAD locally from the verified token instead of asking upstream a
  // question it fails.
  if (req.method === 'HEAD') {
    res.statusCode = 200;
    res.setHeader('Content-Type', contentHeaders(payload).type);
    if (Number.isFinite(payload.n) && payload.n > 0) res.setHeader('Content-Length', String(payload.n));
    res.setHeader('Accept-Ranges', media ? 'bytes' : 'none');
    res.setHeader('Cache-Control', cacheControl);
    return res.end();
  }

  const linkKey = String(url.searchParams.get('s') || '').slice(0, 22);
  const ip = clientIP(req);
  const who = typeof payload.u === 'string' && payload.u ? `user:${payload.u}` : `addr:${ip}`;
  const limit = await count(`library-blob:${who}:${linkKey}`, BLOB_RATE.max, BLOB_RATE.windowMs, 1);
  if (!limit.ok) return refuse(res, limit);
  const budget = payload.u ? BLOB_BYTES.max : BLOB_BYTES.address;
  const charge = bytesPulled(payload, media);
  if (charge > 0) {
    const bytes = await count(`library-blob-bytes:${who}`, budget, BLOB_BYTES.windowMs, charge);
    if (!bytes.ok) return refuse(res, bytes);
  }
  // A document of unknown size: what it really sent is counted once it ends.
  const unsized = !media && charge === 1;
  const settle = (sent) => {
    if (sent > 1) count(`library-blob-bytes:${who}`, budget, BLOB_BYTES.windowMs, sent - 1).catch(() => {});
  };

  const objectPath = `${encodeURIComponent(payload.b)}/objects/${payload.k.split('/').map(encodeURIComponent).join('/')}`;
  const upstreamHeaders = { Authorization: `Bearer ${apiToken}` };
  // A range cut here asks storage for the whole object, so a storage that one
  // day honours Range cannot have its answer cut a second time.
  if (req.headers.range && !asksRange) upstreamHeaders.Range = req.headers.range;

  const disconnected = new AbortController();
  // This limit covers the upstream HEADERS only. The same signal governs the body
  // once fetch resolves, so a timer left running would cut off a slow client's
  // download while bytes are still moving. The body has its own stall guard below.
  const headersTimeout = setTimeout(() => disconnected.abort(), UPSTREAM_HEADERS_MS);
  res.once('close', () => { clearTimeout(headersTimeout); disconnected.abort(); });
  let upstream;
  try {
    upstream = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${objectPath}`,
      { method: req.method, headers: upstreamHeaders, redirect: 'error', signal: disconnected.signal },
    );
  } catch {
    res.statusCode = 502;
    return res.end(JSON.stringify({ error: 'storage_unavailable' }));
  } finally {
    clearTimeout(headersTimeout);
  }

  if (!upstream.ok && upstream.status !== 206) {
    // The signature was valid, so a miss here is an operational problem
    // (object deleted, token rotated), not a caller problem.
    res.statusCode = upstream.status === 404 ? 404 : 502;
    res.setHeader('Cache-Control', 'no-store');
    return res.end(JSON.stringify({ error: 'object_unavailable' }));
  }

  // The object measures the range, not the catalogue: a size that drifted
  // would cut the wrong bytes under a consistent-looking Content-Range.
  let range = null;
  let total = 0;
  if (asksRange && upstream.status === 200) {
    const stored = (upstream.headers.get('content-encoding') || 'identity') === 'identity' ? Number(upstream.headers.get('content-length')) : NaN;
    total = Number.isSafeInteger(stored) && stored > 0 ? stored : Number(payload.n);
    if (Number.isSafeInteger(total) && total > 0) range = byteRange(req.headers.range, total);
    if (range === false) {
      upstream.body?.cancel().catch(() => {});
      res.statusCode = 416;
      res.setHeader('Content-Range', `bytes */${total}`);
      res.setHeader('Cache-Control', 'no-store');
      return res.end();
    }
  }

  res.statusCode = upstream.status;
  const content = contentHeaders(payload, upstream.headers.get('content-type'));
  res.setHeader('Content-Type', content.type);
  // Inline: the shelf opens decks in a tab. `filename` keeps a sensible
  // save-as name — the key's basename is the slugified title.
  const basename = payload.k.split('/').pop() || 'document';
  // ?dl=1 asks for a download (the deck cover's download glyph) and may name
  // the file with ?name= — one line, 150 chars, no path characters. Neither
  // is signed: they change how the bytes are labelled, never which bytes.
  const wantDownload = url.searchParams.get('dl') === '1';
  const askedName = String(url.searchParams.get('name') || '').replace(/[\r\n"\\/]+/g, ' ').trim().slice(0, 150);
  const saveAs = wantDownload && askedName ? askedName : basename;
  const disposition = wantDownload ? 'attachment' : content.disposition;
  res.setHeader('Content-Disposition', `${disposition}; filename="${asciiName(saveAs)}"; filename*=UTF-8''${rfc5987(saveAs)}`);
  // Restricted offline copies belong to the worker's revocable cache, never
  // the HTTP cache which sign-out cannot remove.
  res.setHeader('Cache-Control', cacheControl);
  for (const h of ['content-length', 'content-range', 'etag']) {
    const v = upstream.headers.get(h);
    if (v) res.setHeader(h, v);
  }
  if (range) {
    res.statusCode = 206;
    res.setHeader('Content-Range', `bytes ${range.offset}-${range.offset + range.length - 1}/${total}`);
    res.setHeader('Content-Length', String(range.length));
    res.setHeader('Accept-Ranges', 'bytes');
    if (!upstream.body) return res.end();
    try {
      await pipeline(Readable.fromWeb(sliceBody(stallGuard(upstream.body, disconnected), range.offset, range.length)), res);
    } catch {
      // As below: an abandoned or stalled read ends the response short.
    }
    return;
  }
  // Be honest with PDF viewers: unless upstream really answered a range
  // (it does not today), advertising ranges would invite seek requests
  // that each pull the entire object. Media is cut here (above).
  res.setHeader('Accept-Ranges', media || upstream.headers.get('content-range') ? 'bytes' : 'none');

  if (!upstream.body) return res.end();

  // Stream, not buffer: an 18 MB deck must not sit in function memory
  // twice, and first bytes should reach the tab before last bytes leave R2.
  try {
    const body = stallGuard(upstream.body, disconnected);
    await pipeline(Readable.fromWeb(unsized ? countStreamed(body, settle) : body), res);
  } catch {
    // Pipeline cancels abandoned reads and terminates incomplete downloads.
  }
}
