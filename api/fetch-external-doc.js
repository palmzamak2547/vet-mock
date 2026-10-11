// ============================================================
// /api/fetch-external-doc.js — read a pasted Notion / Google link
// ============================================================
// The app's CSP forbids the browser from fetching docs.google.com /
// notion.so directly and from framing them, so this function does the
// fetching server-side and answers markdown the reader can draw.
//
// Trust boundaries, in order of importance:
//   1. SSRF — the pasted URL is untrusted input to a server-side fetch.
//      normalizeExternalDocUrl is an exact-host allowlist (the only door)
//      and every fetch re-checks where it LANDED: a Google answer is read
//      only from docs.google.com, a Notion answer only from api.notion.com.
//      Anything else and the body is never read.
//   2. Connected documents use only the request owner's OAuth connection.
//      Otherwise a link must be shared "anyone with the link" (Notion
//      additionally needs the page shared with NOTION_TOKEN).
//      A login page or 4xx upstream answers 422 not_public, never a
//      partial render.
//   3. Size — an upstream answer that cannot fit the reader is refused
//      outright rather than silently truncated.
//
// Follows the api/wiki-explain.js contract: origin-aware CORS and an honest
// 503 when the integration is not configured. Rate limits are shaped for a
// lecture hall behind one campus address: a generous per-address ceiling
// covers every request, a shared-cache hit costs nothing more, and only an
// upstream read spends a budget, keyed on the student's account when they
// are signed in and on the address only for guests.
// ============================================================

import {
  normalizeExternalDocUrl,
  csvToMarkdownTable,
  notionBlocksToMarkdown,
  isAllowedUpstreamHost,
  stripMarkdownImages,
  MAX_UPSTREAM_BYTES,
  MAX_MARKDOWN_CHARS,
  MAX_GOOGLE_MARKDOWN_RAW_BYTES,
} from './_lib/external-doc.js';
import { sendRateLimitFailure, rateLimit, clientIP, allowedOrigin, kvGetJSON, kvSetJSON } from './_lib/rate-limit.js';
import { getUserFromRequest, getConnection, googleTokenStale, refreshGoogleAccess, isGoogleApiHost } from './_lib/external-connections.js';
import { createHash } from 'node:crypto';

const NOTION_VERSION = '2026-03-11'; // the dated version that serves /pages/{id}/markdown
const NOTION_API = 'https://api.notion.com/v1';
const TIMEOUT_MS = 15_000;
const MAX_NOTION_PAGES = 10;
const HOUR_MS = 60 * 60 * 1000;
const IP_CEILING_PER_HOUR = 600;      // every request from one address, cache hits included
const USER_READS_PER_HOUR = 60;       // upstream reads for one signed-in account
const GUEST_IP_READS_PER_HOUR = 40;   // upstream reads for guests sharing one address

/** A login/consent wall comes back as 200 with an HTML shell — never read it as content. */
function looksLikeHtml(text) {
  return /^\s*<(?:!doctype\s+html|html[\s>])/i.test(String(text || ''));
}

/**
 * Where a request to the Notion API may LAND. The token rides every Notion
 * call; if a redirect walks one onto another host, that answer is refused
 * before its body is read, exactly like the Google path.
 */
function notionLanded(resp) {
  if (!resp.url) return true;
  try {
    const host = new URL(resp.url).hostname;
    return host === 'api.notion.com' || host.endsWith('.amazonaws.com');
  } catch {
    return false;
  }
}

/** A body that says up front it is bigger than `cap` is never read. */
function declaredOver(resp, cap) {
  const length = Number(resp?.headers?.get?.('content-length'));
  return Number.isFinite(length) && length > cap;
}

/**
 * Read a Google answer that may be markdown. Markdown loses its pictures
 * before any cap applies (they are base64 inside the file), so a short
 * document with screenshots is measured by what the reader would show.
 * Returns { text, imagesOmitted } or { tooLarge: true }.
 */
async function readGoogleBody(resp, { markdown }) {
  const rawCap = markdown ? MAX_GOOGLE_MARKDOWN_RAW_BYTES : MAX_UPSTREAM_BYTES;
  if (declaredOver(resp, rawCap)) return { tooLarge: true };
  let text = await resp.text();
  if (typeof text !== 'string') return { text: null };
  if (text.length > rawCap) return { tooLarge: true };
  let imagesOmitted = false;
  if (markdown) ({ text, imagesOmitted } = stripMarkdownImages(text));
  if (text.length > MAX_UPSTREAM_BYTES || (markdown && text.length > MAX_MARKDOWN_CHARS)) return { tooLarge: true, imagesOmitted };
  return { text, imagesOmitted };
}

/**
 * Fetch one candidate export URL and return its text, or null when the
 * answer is not usable content (bad status, redirect out of the allowlist,
 * login shell). An oversized answer says so ({ tooLarge }) so the caller
 * can try the next candidate and, when none fits, answer too_large instead
 * of claiming the document is private. null means "try the next candidate",
 * so the caller's fallback chain stays honest.
 */
async function fetchText(url) {
  let resp;
  try {
    resp = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), redirect: 'follow' });
  } catch (err) {
    if (err?.name === 'TimeoutError' || err?.name === 'AbortError') throw err;
    return null;
  }
  if (!resp.ok) return { failed: true, status: resp.status };
  // The allowlist applies where the fetch LANDED, not where it started.
  if (resp.url) {
    try {
      if (!isAllowedUpstreamHost(new URL(resp.url).hostname)) return null;
    } catch {
      return null;
    }
  }
  let body;
  try {
    body = await readGoogleBody(resp, { markdown: new URL(url).searchParams.get('format') === 'md' });
  } catch {
    return null;
  }
  if (body.tooLarge) return body;
  if (typeof body.text !== 'string' || looksLikeHtml(body.text)) return null;
  return body;
}

/**
 * The documented public-Google-Doc path. A key is server-only and optional:
 * when it is not provisioned (or the provider refuses it), the existing
 * zero-config export chain remains the compatible fallback for public links.
 */
async function fetchPublicGoogleDoc(id) {
  const key = process.env.GOOGLE_API_KEY || '';
  if (!key) return null;
  const query = new URLSearchParams({ mimeType: 'text/markdown', key });
  let resp;
  try {
    resp = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}/export?${query}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      redirect: 'follow',
    });
  } catch (err) {
    if (err?.name === 'TimeoutError' || err?.name === 'AbortError') throw err;
    return null;
  }
  if (!resp.ok) return null;
  if (resp.url) {
    try {
      if (!isGoogleApiHost(new URL(resp.url).hostname)) return null;
    } catch {
      return null;
    }
  }
  let body;
  try {
    body = await readGoogleBody(resp, { markdown: true });
  } catch {
    return null;
  }
  // Too large here still lets the export chain try its plain-text candidate.
  if (body.tooLarge || typeof body.text !== 'string' || looksLikeHtml(body.text)) return null;
  return body;
}

/** Extract the page title from a /v1/pages response, or null. */
function notionTitleFromPage(page) {
  try {
    const prop = Object.values(page?.properties || {}).find((p) => p?.type === 'title');
    return (prop?.title || []).map((t) => String(t?.plain_text || '')).join('').trim() || null;
  } catch {
    return null;
  }
}

/**
 * The connected path: the student's own Google account reads the file, so
 * private documents work the same way public ones do. One refresh is tried
 * when the stored access token has aged out. Null means "unusable — let
 * the public path try", which keeps a public doc readable even when the
 * connection hiccups.
 */
async function fetchConnectedGoogle(target, row) {
  const { id, provider: kind } = target;
  let token = row.access_token;
  if (googleTokenStale(row)) {
    const refreshed = await refreshGoogleAccess(row);
    if (!refreshed) return null;
    token = refreshed.accessToken;
  }
  const gid = kind === 'gsheets' ? new URL(target.exportUrls[0]).searchParams.get('gid') : null;
  if (gid !== null) {
    // Drive CSV export always reads the first tab; resolve the linked tab by id.
    if (!/^\d+$/.test(gid) || !Number.isSafeInteger(Number(gid))) return null;
    try {
      const base = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(id)}`;
      const headers = { Authorization: `Bearer ${token}` };
      const meta = await fetch(`${base}?fields=properties(title),sheets(properties(sheetId,title))`, {
        headers, signal: AbortSignal.timeout(TIMEOUT_MS), redirect: 'error',
      });
      if (!meta.ok) return null;
      const data = await meta.json().catch(() => null);
      const sheet = data?.sheets?.find(s => s?.properties?.sheetId === Number(gid))?.properties;
      if (typeof sheet?.title !== 'string') return null;
      const range = `'${sheet.title.replace(/'/g, "''")}'`;
      const values = await fetch(`${base}/values/${encodeURIComponent(range)}?majorDimension=ROWS`, {
        headers, signal: AbortSignal.timeout(TIMEOUT_MS), redirect: 'error',
      });
      if (!values.ok) return null;
      const raw = await values.text();
      if (raw.length > MAX_UPSTREAM_BYTES) return null;
      const cells = JSON.parse(raw).values || [];
      if (!Array.isArray(cells) || cells.some(r => !Array.isArray(r) || r.some(c => !['string', 'number', 'boolean'].includes(typeof c)))) return null;
      const text = cells.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
      return { text, title: typeof data.properties?.title === 'string' ? data.properties.title.slice(0, 200) : sheet.title };
    } catch (err) {
      if (err?.name === 'TimeoutError' || err?.name === 'AbortError') throw err;
      return null;
    }
  }
  // A document whose markdown is still too long once its pictures are gone
  // is tried once more as plain text, the same fallback the public path has.
  const mimeTypes = kind === 'gsheets' ? ['text/csv'] : ['text/markdown', 'text/plain'];
  let text = null;
  let imagesOmitted = false;
  for (const mimeType of mimeTypes) {
    let resp;
    try {
      resp = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}/export?mimeType=${encodeURIComponent(mimeType)}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (err) {
      if (err?.name === 'TimeoutError' || err?.name === 'AbortError') throw err;
      return null;
    }
    let landed = true;
    if (resp.url) {
      try {
        landed = isGoogleApiHost(new URL(resp.url).hostname);
      } catch {
        landed = false;
      }
    }
    if (!resp.ok || !landed) return null;
    let body;
    try {
      body = await readGoogleBody(resp, { markdown: mimeType === 'text/markdown' });
    } catch {
      return null;
    }
    imagesOmitted = imagesOmitted || !!body.imagesOmitted;
    if (body.tooLarge) continue;
    if (typeof body.text !== 'string' || looksLikeHtml(body.text)) return null;
    text = body.text;
    break;
  }
  if (text === null) return null;
  let title = null;
  try {
    const meta = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?fields=name`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (meta.ok) {
      const data = await meta.json().catch(() => null);
      title = data?.name ? String(data.name).slice(0, 200) : null;
    }
  } catch { /* title is optional */ }
  return { text, title, imagesOmitted };
}

async function fetchNotionMarkdown(id, token) {
  const headers = { 'Authorization': `Bearer ${token}`, 'Notion-Version': NOTION_VERSION };
  // The dated markdown endpoint answers prose directly and is the COMPLETE
  // path: nested blocks (toggles, columns, child pages) arrive inside its
  // markdown. The block-children walk below is the degraded fallback and
  // flattens TOP-LEVEL blocks only — nested content is left out there, so
  // a page only the fallback can read renders thinner, not wrong.
  let markdown = null;
  try {
    const resp = await fetch(`${NOTION_API}/pages/${id}/markdown`, {
      headers, signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (resp.ok && notionLanded(resp)) {
      const raw = await resp.text();
      if (raw && !looksLikeHtml(raw)) {
        // Tolerant of both response shapes: raw markdown text, or a JSON
        // envelope that carries the markdown in a field.
        if (raw.trimStart().startsWith('{')) {
          try {
            const parsed = JSON.parse(raw);
            markdown = typeof parsed?.markdown === 'string' ? parsed.markdown
              : typeof parsed?.text === 'string' ? parsed.text : null;
          } catch { /* not JSON after all — treat as failed */ }
        } else {
          markdown = raw;
        }
      }
    }
  } catch { /* fall through to the block walk */ }

  if (markdown == null) {
    const blocks = [];
    let cursor;
    for (let page = 0; page < MAX_NOTION_PAGES; page++) {
      const qs = new URLSearchParams({ page_size: '100' });
      if (cursor) qs.set('start_cursor', cursor);
      const resp = await fetch(`${NOTION_API}/blocks/${id}/children?${qs}`, {
        headers, signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!resp.ok) return { status: resp.status, markdown: null, title: null };
      if (!notionLanded(resp)) return { status: resp.status, markdown: null, title: null };
      const data = await resp.json().catch(() => null);
      if (!data || !Array.isArray(data.results)) return { status: resp.status, markdown: null, title: null };
      blocks.push(...data.results);
      if (!data.next_cursor) break;
      cursor = data.next_cursor;
    }
    markdown = notionBlocksToMarkdown(blocks);
  }

  // The title is presentation sugar; a failed or unshared title read must
  // not void a page we already read.
  let title = null;
  try {
    const resp = await fetch(`${NOTION_API}/pages/${id}`, {
      headers, signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (resp.ok && notionLanded(resp)) title = notionTitleFromPage(await resp.json().catch(() => null));
  } catch { /* title is optional */ }

  return { status: 200, markdown, title };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  const reqOrigin = req.headers.origin;
  const allowed = allowedOrigin(req);
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', allowed);
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (reqOrigin && !allowed) return res.status(403).json({ error: 'Origin not allowed' });

  const ip = clientIP(req);
  const ceiling = await rateLimit(`external-doc-ip:${ip}`, IP_CEILING_PER_HOUR, HOUR_MS);
  if (!ceiling.ok) return sendRateLimitFailure(res, ceiling);

  try {
    const rawUrl = typeof req.body?.url === 'string' ? req.body.url.trim() : '';
    if (!rawUrl) return res.status(400).json({ error: 'url is required' });
    const target = normalizeExternalDocUrl(rawUrl);
    if (!target) {
      return res.status(400).json({
        error: 'Unsupported link',
        reason: 'unsupported_link',
        hint: 'Supported: docs.google.com documents and spreadsheets, notion.so pages.',
      });
    }

    // A signed-in student with a connected account reads through their OWN
    // credentials — private documents work — and the shared answer cache
    // is skipped entirely: one student's private doc must never be served
    // to another from a shared key.
    const userId = await getUserFromRequest(req);
    const connection = userId ? await getConnection({ userId, provider: target.provider === 'notion' ? 'notion' : 'google' }) : null;

    // One upstream budget per request, spent at most once: the connected
    // attempt and a public fallback after it are the same student's read.
    let upstreamCharged = false;
    const chargeUpstream = async () => {
      if (upstreamCharged) return null;
      upstreamCharged = true;
      const limit = userId
        ? await rateLimit(`external-doc-user:${userId}`, USER_READS_PER_HOUR, HOUR_MS)
        : await rateLimit(`external-doc:${ip}`, GUEST_IP_READS_PER_HOUR, HOUR_MS);
      return limit.ok ? null : limit;
    };

    if (connection?.access_token) {
      const limited = await chargeUpstream();
      if (limited) return sendRateLimitFailure(res, limited);
      let markdown = null;
      let title = null;
      let imagesOmitted = false;
      try {
        if (target.provider === 'gdocs' || target.provider === 'gsheets') {
          const result = await fetchConnectedGoogle(target, connection);
          if (result) {
            markdown = target.provider === 'gsheets' ? csvToMarkdownTable(result.text) : result.text;
            title = result.title;
            imagesOmitted = !!result.imagesOmitted;
          }
        } else {
          const result = await fetchNotionMarkdown(target.id, connection.access_token);
          if (result.markdown != null) {
            markdown = result.markdown;
            title = result.title;
          }
        }
      } catch (err) {
        if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
          return res.status(504).json({ error: 'Upstream request timed out', reason: 'timeout' });
        }
        throw err;
      }
      if (markdown) {
        if (markdown.length > MAX_MARKDOWN_CHARS) {
          return res.status(413).json({ error: 'Document too large for the reader', reason: 'too_large' });
        }
        return res.status(200).json({
          provider: target.provider,
          title: title || null,
          markdown,
          sourceUrl: target.sourceUrl,
          ...(imagesOmitted ? { imagesOmitted: true } : {}),
        });
      }
      // The connected attempt found nothing usable — a PUBLIC doc should
      // still open through the shared path below rather than dying with
      // the connection.
    }

    // Exact-match cache on the validated source link — the link carries
    // the gid, so a second sheet of the same spreadsheet is its own entry,
    // and the same shared sheet re-opened by twenty students still costs
    // one upstream read, not twenty.
    const cacheKey = `extdoc:${createHash('sha1').update(`${target.provider}:${target.sourceUrl}`).digest('hex')}`;
    const cached = await kvGetJSON(cacheKey);
    if (cached && typeof cached.markdown === 'string') {
      return res.status(200).json({ ...cached, cached: true });
    }
    const limited = await chargeUpstream();
    if (limited) return sendRateLimitFailure(res, limited);

    let markdown = null;
    let title = null;
    let upstreamBlocked = false;
    let upstreamStatus = null;
    let tooLarge = false;
    let imagesOmitted = false;

    if (target.provider === 'notion') {
      const token = process.env.NOTION_TOKEN || '';
      if (!token) {
        return res.status(503).json({
          error: 'Notion is not configured',
          reason: 'not_configured',
          hint: 'Set NOTION_TOKEN for a Notion integration and share the page with it.',
        });
      }
      const result = await fetchNotionMarkdown(target.id, token);
      if (result.markdown == null) {
        // 401 → the token itself was rejected; anything else reads as a
        // page the integration was never asked to see.
        if (result.status === 401) {
          return res.status(503).json({
            error: 'Notion rejected the integration token',
            reason: 'not_configured',
            hint: 'Check NOTION_TOKEN on Vercel.',
          });
        }
        return res.status(422).json({
          error: 'The page is not shared with this app',
          reason: 'not_public',
        });
      }
      markdown = result.markdown;
      title = result.title;
    } else {
      if (target.provider === 'gdocs') {
        try {
          const result = await fetchPublicGoogleDoc(target.id);
          if (result) {
            markdown = result.text;
            imagesOmitted = !!result.imagesOmitted;
          }
        } catch (err) {
          if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
            return res.status(504).json({ error: 'Upstream request timed out', reason: 'timeout' });
          }
          throw err;
        }
      }
      if (!markdown) {
        for (const url of target.exportUrls) {
          let result;
          try {
            result = await fetchText(url);
          } catch (err) {
            if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
              return res.status(504).json({ error: 'Upstream request timed out', reason: 'timeout' });
            }
            throw err;
          }
          if (result && result.failed) { upstreamStatus = result.status; continue; }
          if (result?.tooLarge) { tooLarge = true; imagesOmitted = imagesOmitted || !!result.imagesOmitted; continue; }
          if (!result) { upstreamBlocked = true; continue; }
          imagesOmitted = imagesOmitted || !!result.imagesOmitted;
          const candidate = target.provider === 'gsheets'
            ? csvToMarkdownTable(result.text)
            : result.text;
          // Too long for the reader: the next candidate (plain text) may fit.
          if (candidate.length > MAX_MARKDOWN_CHARS) { tooLarge = true; continue; }
          markdown = candidate;
          if (markdown) break;
        }
      }
      if (!markdown && tooLarge) {
        return res.status(413).json({ error: 'Document too large for the reader', reason: 'too_large' });
      }
      if (!markdown) {
        // A real 4xx/5xx from the export path, or a login shell on every
        // candidate, both mean the same thing to the student: the doc is
        // not reachable without being signed in to its owner account.
        return res.status(422).json({
          error: 'The document is not publicly readable',
          reason: connection && target.provider === 'gsheets' && new URL(target.exportUrls[0]).searchParams.has('gid') ? 'sheet_unavailable' : 'not_public',
          ...(upstreamStatus && upstreamStatus !== 200 ? { status: upstreamStatus } : {}),
          ...(upstreamBlocked && !upstreamStatus ? { hint: 'The link answered a sign-in page.' } : {}),
        });
      }
    }

    if (markdown.length > MAX_MARKDOWN_CHARS) {
      return res.status(413).json({
        error: 'Document too large for the reader',
        reason: 'too_large',
      });
    }

    const payload = {
      provider: target.provider,
      title: title || null,
      markdown,
      sourceUrl: target.sourceUrl,
      ...(imagesOmitted ? { imagesOmitted: true } : {}),
    };
    await kvSetJSON(cacheKey, payload, 600);
    return res.status(200).json(payload);

  } catch (err) {
    if (err?.name === 'AbortError' || err?.name === 'TimeoutError') {
      return res.status(504).json({ error: 'Upstream request timed out', reason: 'timeout' });
    }
    if (/invalid json/i.test(String(err?.message || ''))) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
    return res.status(500).json({ error: 'Unexpected error', detail: String(err?.message || err).slice(0, 200) });
  }
}
