// ============================================================
// /api/fetch-external-doc.js — read a pasted Notion / Google link
// ============================================================
// The app's CSP forbids the browser from fetching docs.google.com /
// notion.so directly and from framing them, so this function does the
// fetching server-side and answers markdown the reader can draw.
//
// Trust boundaries, in order of importance:
//   1. SSRF — the pasted URL is untrusted input to a server-side fetch.
//      normalizeExternalDocUrl is an exact-host allowlist (the only door),
//      and the FINAL upstream URL after redirects must pass the same
//      allowlist or the body is never read.
//   2. Public only — this endpoint holds no per-user Google OAuth, so a
//      link must be shared "anyone with the link" (Notion additionally
//      needs the page shared with the integration behind NOTION_TOKEN).
//      A login page or 4xx upstream answers 422 not_public, never a
//      partial render.
//   3. Size — an upstream answer that cannot fit the reader is refused
//      outright rather than silently truncated.
//
// Follows the api/wiki-explain.js contract exactly: origin-aware CORS,
// per-IP rate limit, honest 503 when the integration is not configured.
// ============================================================

import {
  normalizeExternalDocUrl,
  csvToMarkdownTable,
  notionBlocksToMarkdown,
  isAllowedUpstreamHost,
  MAX_UPSTREAM_BYTES,
  MAX_MARKDOWN_CHARS,
} from './_lib/external-doc.js';
import { sendRateLimitFailure, rateLimit, clientIP, allowedOrigin, kvGetJSON, kvSetJSON } from './_lib/rate-limit.js';
import { createHash } from 'node:crypto';

const NOTION_VERSION = '2026-03-11'; // the dated version that serves /pages/{id}/markdown
const NOTION_API = 'https://api.notion.com/v1';
const TIMEOUT_MS = 15_000;
const MAX_NOTION_PAGES = 10;

/** A login/consent wall comes back as 200 with an HTML shell — never read it as content. */
function looksLikeHtml(text) {
  return /^\s*<(?:!doctype\s+html|html[\s>])/i.test(String(text || ''));
}

/**
 * Fetch one candidate export URL and return its text, or null when the
 * answer is not usable content (bad status, redirect out of the allowlist,
 * login shell, oversized). null means "try the next candidate", so the
 * caller's fallback chain stays honest.
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
  let text;
  try {
    text = await resp.text();
  } catch {
    return null;
  }
  if (typeof text !== 'string' || text.length > MAX_UPSTREAM_BYTES) return null;
  if (looksLikeHtml(text)) return null;
  return { text };
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

async function fetchNotionMarkdown(id, token) {
  const headers = { 'Authorization': `Bearer ${token}`, 'Notion-Version': NOTION_VERSION };
  // The dated markdown endpoint answers prose directly. If it is ever
  // unavailable (older workspace posture, changed contract), the block
  // children walk below still serves the page.
  let markdown = null;
  try {
    const resp = await fetch(`${NOTION_API}/pages/${id}/markdown`, {
      headers, signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (resp.ok) {
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
    if (resp.ok) title = notionTitleFromPage(await resp.json().catch(() => null));
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
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (reqOrigin && !allowed) return res.status(403).json({ error: 'Origin not allowed' });

  const ip = clientIP(req);
  const rl = await rateLimit(`external-doc:${ip}`, 20, 60 * 60 * 1000);
  if (!rl.ok) return sendRateLimitFailure(res, rl);

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

    // Exact-match cache on the normalized link — the same shared sheet
    // re-opened by twenty students should not cost twenty upstream reads.
    const cacheKey = `extdoc:${createHash('sha1').update(`${target.provider}:${target.id}`).digest('hex')}`;
    const cached = await kvGetJSON(cacheKey);
    if (cached && typeof cached.markdown === 'string') {
      return res.status(200).json({ ...cached, cached: true });
    }

    let markdown = null;
    let title = null;
    let upstreamBlocked = false;
    let upstreamStatus = null;

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
      for (const url of target.exportUrls) {
        let result;
        try {
          result = await fetchText(url);
        } catch (err) {
          if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
            return res.status(504).json({ error: 'Upstream request timed out' });
          }
          throw err;
        }
        if (result && result.failed) { upstreamStatus = result.status; continue; }
        if (!result) { upstreamBlocked = true; continue; }
        markdown = target.provider === 'gsheets'
          ? csvToMarkdownTable(result.text)
          : result.text;
        if (markdown) break;
      }
      if (!markdown) {
        // A real 4xx/5xx from the export path, or a login shell on every
        // candidate, both mean the same thing to the student: the doc is
        // not reachable without being signed in to its owner account.
        return res.status(422).json({
          error: 'The document is not publicly readable',
          reason: 'not_public',
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
    };
    await kvSetJSON(cacheKey, payload, 600);
    return res.status(200).json(payload);

  } catch (err) {
    if (err?.name === 'AbortError' || err?.name === 'TimeoutError') {
      return res.status(504).json({ error: 'Upstream request timed out' });
    }
    if (/invalid json/i.test(String(err?.message || ''))) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
    return res.status(500).json({ error: 'Unexpected error', detail: String(err?.message || err).slice(0, 200) });
  }
}
