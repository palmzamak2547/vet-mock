// ============================================================
// markdown.jsx — the answer, rendered as React elements (never innerHTML)
// ============================================================
// Small on purpose: headings, paragraphs, lists (one nesting level), quotes,
// tables, code, bold/italic/code spans, http(s) links, and citation marks
// [1] / [1, 3]. Safe while streaming: an unfinished ** or ` at the end is
// shown as plain text instead of flashing its marker.
//
// Two honesty hooks: a citation number that matches no source renders as
// plain text, and a number the route flagged as not found in the cited
// sources is underlined dotted with a tooltip saying so.

import { Fragment } from 'react';

const INLINE = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\[(\d{1,2}(?:\s*[,–-]\s*\d{1,2})*)\](?!\())|(\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\))|(\*[^*\s][^*\n]*\*)|(_[^_\s][^_\n]*_)/g;
const NUM = /\d+(?:,\d{3})*(?:\.\d+)?/g;

function numbers(text, flagged, keyBase) {
  if (!flagged?.size || !text) return text;
  const out = [];
  let last = 0;
  let m;
  const re = new RegExp(NUM.source, 'g');
  while ((m = re.exec(text))) {
    const norm = String(Number(m[0].replace(/,/g, '')));
    if (!flagged.has(norm)) continue;
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <span key={`${keyBase}n${m.index}`} className="unsure" title="ตัวเลขนี้ไม่พบในแหล่งที่อ้าง ตรวจสอบก่อนใช้">
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (!out.length) return text;
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function expandCites(spec) {
  const out = [];
  for (const part of spec.split(/\s*,\s*/)) {
    const r = part.split(/\s*[–-]\s*/).map(Number);
    if (r.length === 2 && r[1] >= r[0] && r[1] - r[0] < 12) for (let i = r[0]; i <= r[1]; i++) out.push(i);
    else if (Number.isFinite(r[0])) out.push(r[0]);
  }
  return out;
}

export function inline(text, ctx, keyBase = 'i') {
  const out = [];
  let last = 0;
  let m;
  // a fresh regex per call: inline() recurses into bold/italic, and a shared
  // /g regex would have its lastIndex reset by the inner call, re-matching the
  // same span forever (it froze the tab once)
  const re = new RegExp(INLINE.source, 'g');
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={`${keyBase}t${k++}`}>{numbers(text.slice(last, m.index), ctx.flagged, `${keyBase}${k}`)}</Fragment>);
    const key = `${keyBase}m${k++}`;
    if (m[1]) out.push(<code key={key}>{m[1].slice(1, -1)}</code>);
    else if (m[2]) out.push(<strong key={key}>{inline(m[2].slice(2, -2), ctx, key)}</strong>);
    else if (m[3]) {
      const ns = expandCites(m[4]).filter((n) => ctx.sources?.[n - 1]);
      if (ns.length && ctx.Cite) out.push(<span key={key} className="cites">{ns.map((n) => <ctx.Cite key={n} n={n} />)}</span>);
      else out.push(<Fragment key={key}>{m[3]}</Fragment>);
    } else if (m[5]) {
      out.push(<a key={key} href={m[7]} target="_blank" rel="noopener noreferrer">{m[6]}</a>);
    } else if (m[8]) out.push(<em key={key}>{inline(m[8].slice(1, -1), ctx, key)}</em>);
    else if (m[9]) out.push(<em key={key}>{inline(m[9].slice(1, -1), ctx, key)}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={`${keyBase}e`}>{numbers(text.slice(last), ctx.flagged, `${keyBase}z`)}</Fragment>);
  return out;
}

/** Hide a half-written marker at the very end of a streaming answer. */
function settle(text) {
  let t = text;
  if ((t.match(/\*\*/g) || []).length % 2) t = t.replace(/\*\*(?!.*\*\*)/, '');
  if ((t.match(/`/g) || []).length % 2) t = t.replace(/`(?!.*`)/, '');
  return t.replace(/\[(\d{0,2}(?:\s*,\s*\d{0,2})*)$/, '');
}

const isRow = (l) => /^\s*\|.*\|\s*$/.test(l);
const isSep = (l) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l);
const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

export function Markdown({ text, streaming = false, sources, flagged, Cite }) {
  const ctx = { sources, flagged, Cite };
  const src = streaming ? settle(text || '') : text || '';
  const lines = src.split('\n');
  const blocks = [];
  let i = 0;
  let para = [];
  const flush = () => {
    if (para.length) {
      blocks.push(<p key={`p${blocks.length}`}>{inline(para.join(' '), ctx, `p${blocks.length}`)}</p>);
      para = [];
    }
  };
  while (i < lines.length) {
    const line = lines[i];
    const fence = line.match(/^\s*```(\w*)/);
    if (fence) {
      flush();
      const body = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) body.push(lines[i++]);
      i++;
      blocks.push(<pre key={`c${blocks.length}`}><code>{body.join('\n')}</code></pre>);
      continue;
    }
    if (isRow(line) && i + 1 < lines.length && isSep(lines[i + 1])) {
      flush();
      const head = cells(line);
      const rows = [];
      i += 2;
      while (i < lines.length && isRow(lines[i])) rows.push(cells(lines[i++]));
      const b = blocks.length;
      blocks.push(
        <div className="md-table" key={`t${b}`} tabIndex={0} role="region" aria-label="ตาราง">
          <table>
            <thead><tr>{head.map((c, j) => <th key={j}>{inline(c, ctx, `t${b}h${j}`)}</th>)}</tr></thead>
            <tbody>{rows.map((r, ri) => <tr key={ri}>{head.map((_, j) => <td key={j}>{inline(r[j] || '', ctx, `t${b}r${ri}c${j}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)/);
    if (h) {
      flush();
      const level = Math.min(4, h[1].length + 1);
      const Tag = `h${level}`;
      blocks.push(<Tag key={`h${blocks.length}`}>{inline(h[2], ctx, `h${blocks.length}`)}</Tag>);
      i++;
      continue;
    }
    const li = line.match(/^(\s*)([-*•]|\d+[.)])\s+(.*)/);
    if (li) {
      flush();
      const ordered = /\d/.test(li[2]);
      const items = [];
      while (i < lines.length) {
        const m = lines[i].match(/^(\s*)([-*•]|\d+[.)])\s+(.*)/);
        if (!m) {
          if (lines[i].trim() && items.length && /^\s{2,}\S/.test(lines[i])) { items[items.length - 1].text += ` ${lines[i].trim()}`; i++; continue; }
          break;
        }
        if (/\d/.test(m[2]) !== ordered && m[1].length < 2) break;
        if (m[1].length >= 2 && items.length) items[items.length - 1].kids.push(m[3]);
        else items.push({ text: m[3], kids: [] });
        i++;
      }
      const L = ordered ? 'ol' : 'ul';
      const b = blocks.length;
      blocks.push(
        <L key={`l${b}`}>
          {items.map((it, j) => (
            <li key={j}>
              {inline(it.text, ctx, `l${b}i${j}`)}
              {it.kids.length > 0 && <ul>{it.kids.map((kid, q) => <li key={q}>{inline(kid, ctx, `l${b}i${j}k${q}`)}</li>)}</ul>}
            </li>
          ))}
        </L>,
      );
      continue;
    }
    const q = line.match(/^>\s?(.*)/);
    if (q) {
      flush();
      const body = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) body.push(lines[i++].replace(/^>\s?/, ''));
      blocks.push(<blockquote key={`q${blocks.length}`}>{inline(body.join(' '), ctx, `q${blocks.length}`)}</blockquote>);
      continue;
    }
    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) { flush(); i++; continue; }
    if (!line.trim()) { flush(); i++; continue; }
    para.push(line.trim());
    i++;
  }
  flush();
  return <div className="md">{blocks}</div>;
}
