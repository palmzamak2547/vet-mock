// ============================================================
// api/_lib/external-doc.js — fetch-and-convert for pasted doc links
// ============================================================
// The external-doc reader turns a pasted Notion / Google Docs / Google
// Sheets link into markdown the app's own renderer can draw. The browser
// cannot fetch those hosts (CSP connect-src is self-only) and cannot
// frame them (frame-src is narrow), so a Vercel function fetches server
// side and this module owns the two halves of that job:
//
//   1. normalizeExternalDocUrl — the ONLY door. A pasted URL is untrusted
//      input to a server-side fetch, so this is an exact-host allowlist,
//      not a "looks like" check. Everything else returns null and the
//      route answers "unsupported link".
//   2. the converters (CSV → markdown table, Notion blocks → markdown)
//      — pure string work, unit-tested, no network.
//
// Escaping discipline: the converters emit markdown TEXT and never HTML.
// Every character that could escape its markdown container (a pipe in a
// table cell) is neutralised here, and the renderer escapes HTML before
// any markup is applied — the two layers must both hold.
// ============================================================

export const MAX_UPSTREAM_BYTES = 2_000_000;
export const MAX_MARKDOWN_CHARS = 200_000;

const HEX32 = /^[0-9a-f]{32}$/i;
const DOCS_PATH = /^\/document\/d\/([\w-]+)/;
const SHEETS_PATH = /^\/spreadsheets\/d\/([\w-]+)/;

/**
 * Where a fetch may LAND. The pasted URL decides where the request starts;
 * this decides whose answer may be read, because a redirect that walks the
 * reader onto another host must not turn the function into a proxy.
 */
export function isAllowedUpstreamHost(hostname) {
  const host = String(hostname || '').toLowerCase();
  return host === 'docs.google.com'
    || host === 'notion.so' || host === 'www.notion.so'
    || host === 'notion.site' || host.endsWith('.notion.site');
}

/**
 * Validate a pasted link and describe what to fetch. Returns null for
 * anything the reader does not serve — callers must treat null as the
 * normal "unsupported link" outcome, not an error path.
 */
export function normalizeExternalDocUrl(raw) {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > 2048) return null;
  let url;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;

  const host = url.hostname.toLowerCase();
  if (host === 'docs.google.com') {
    let m = DOCS_PATH.exec(url.pathname);
    if (m) {
      return {
        provider: 'gdocs',
        id: m[1],
        sourceUrl: url.href,
        // Markdown export first; the text fallback is tried by the route
        // when the markdown answer is not usable text.
        exportUrls: [
          `https://docs.google.com/document/d/${m[1]}/export?format=md`,
          `https://docs.google.com/document/d/${m[1]}/export?format=txt`,
        ],
      };
    }
    m = SHEETS_PATH.exec(url.pathname);
    if (m) {
      // A spreadsheet link names one sheet via #gid= (hash) or ?gid=
      // (query). Without it the export covers the first sheet only.
      const gid = url.hash.match(/gid=(\d+)/)?.[1] || url.searchParams.get('gid');
      const gidQ = gid ? `&gid=${encodeURIComponent(gid)}` : '';
      return {
        provider: 'gsheets',
        id: m[1],
        sourceUrl: url.href,
        exportUrls: [
          `https://docs.google.com/spreadsheets/d/${m[1]}/export?format=csv${gidQ}`,
          `https://docs.google.com/spreadsheets/d/${m[1]}/gviz/tq?tqx=out:csv${gidQ}`,
        ],
      };
    }
    return null;
  }

  if (host === 'notion.so' || host === 'www.notion.so'
    || host === 'notion.site' || host.endsWith('.notion.site')) {
    // Public page URLs end in the page id: a 32-hex tail, dashed or not,
    // whatever title slug sits in front of it. The slug may itself hold
    // hex-looking words, so the id is exactly the LAST 32 characters.
    const segments = url.pathname.split('/').filter(Boolean);
    const tail = (segments[segments.length - 1] || '').replace(/-/g, '').slice(-32);
    if (!HEX32.test(tail)) return null;
    return { provider: 'notion', id: tail, sourceUrl: url.href, exportUrls: [] };
  }

  return null;
}

// ── CSV → markdown table ─────────────────────────────────────────────
// A small RFC-4180 reader: quoted fields may hold commas, escaped quotes
// and line breaks. Enough for a spreadsheet export, no more.

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else quoted = false;
      } else field += c;
      continue;
    }
    if (c === '"') { quoted = true; continue; }
    if (c === ',') { row.push(field); field = ''; continue; }
    if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      rows.push(row); row = [];
      continue;
    }
    field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  // A trailing line break yields an empty final row — drop it.
  while (rows.length && rows[rows.length - 1].every((f) => f === '')) rows.pop();
  return rows;
}

/** One cell of markdown table text: pipes tamed, line breaks flattened. */
function csvCell(value) {
  return String(value ?? '')
    .replace(/\s*\r?\n\s*/g, ' ')
    .replace(/\|/g, '\\|')
    .trim();
}

export function csvToMarkdownTable(text, { maxRows = 200, maxCols = 20 } = {}) {
  if (typeof text !== 'string' || !text.trim()) return '';
  const rows = parseCsv(text);
  if (!rows.length) return '';
  const header = rows[0].slice(0, maxCols).map(csvCell);
  if (!header.some((h) => h !== '')) return '';
  const lines = [`| ${header.join(' | ')} |`, `| ${header.map(() => '---').join(' | ')} |`];
  for (const row of rows.slice(1, 1 + maxRows)) {
    const cells = row.slice(0, maxCols).map(csvCell);
    while (cells.length < header.length) cells.push('');
    lines.push(`| ${cells.join(' | ')} |`);
  }
  return lines.join('\n');
}

// ── Notion blocks → markdown ─────────────────────────────────────────

/** One rich_text array → markdown text (bold / italic / code / links kept). */
function richText(rt = []) {
  let out = '';
  for (const part of rt) {
    const text = String(part?.plain_text ?? part?.text?.content ?? '');
    if (!text) continue;
    const a = part.annotations || {};
    let piece = a.code ? `\`${text}\`` : text;
    if (a.bold) piece = `**${piece}**`;
    if (a.italic) piece = `*${piece}*`;
    if (part.href) piece = `[${piece}](${part.href})`;
    out += piece;
  }
  return out;
}

/**
 * Flatten a Notion blocks/children response into markdown. Only the
 * block types a study page is made of are carried; images and embedded
 * files are left out on purpose — their URLs are short-lived and would
 * render as dead weight behind the reader.
 */
export function notionBlocksToMarkdown(blocks) {
  const out = [];
  let numbered = 0;
  for (const block of blocks || []) {
    const b = block || {};
    const t = b.type;
    const body = t && b[t] ? b[t] : {};
    const text = richText(body.rich_text).trim();
    if (t === 'divider') { numbered = 0; out.push('---'); continue; }
    if (t === 'heading_1') { numbered = 0; if (text) out.push(`# ${text}`); continue; }
    if (t === 'heading_2') { numbered = 0; if (text) out.push(`## ${text}`); continue; }
    if (t === 'heading_3') { numbered = 0; if (text) out.push(`### ${text}`); continue; }
    if (t === 'paragraph') { numbered = 0; if (text) out.push(text); continue; }
    if (t === 'bulleted_list_item') { numbered = 0; if (text) out.push(`- ${text}`); continue; }
    if (t === 'numbered_list_item') {
      numbered += 1;
      if (text) out.push(`${numbered}. ${text}`);
      continue;
    }
    if (t === 'to_do') {
      numbered = 0;
      if (text) out.push(`- [${body.checked ? 'x' : ' '}] ${text}`);
      continue;
    }
    if (t === 'quote' || t === 'callout') {
      numbered = 0;
      if (text) out.push(`> ${text}`);
      continue;
    }
    if (t === 'code') {
      numbered = 0;
      // Fences are single-quoted strings, never inside a template literal —
      // a literal ``` in a template closes it (project landmine #3).
      if (text) out.push('```\n' + text + '\n```');
      continue;
    }
    numbered = 0;
  }
  return out.join('\n');
}
