// ============================================================
// markdown-render.js — mini markdown → HTML, escape-first
// ============================================================
// The renderer the external-doc reader draws with. It mirrors the proven
// renderer inside SummaryModal (same markdown subset, same vmx-md-*
// classes) and exists as its own module because the reader's input comes
// from OTHER people's servers, while SummaryModal renders VetMock's own
// authored summaries. Consolidating the two into one import is an owner
// decision — SummaryModal sits on another active lane — until then this
// file carries the same invariants, and tests/unit/markdown-render.test.mjs
// pins them:
//
//   1. escape FIRST, then apply markdown — hostile input cannot emit tags;
//   2. every link target passes safeLinkUrl (https-only, no credentials);
//   3. no dependency added — same hand-rolled subset as the summaries.
// ============================================================

import { safeLinkUrl } from './safe-url.js';

export function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderInline(text) {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, '<code class="vmx-md-code">$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[\s>])\*([^*\s][^*]*)\*(?=$|[\s.,;:?!])/g, '$1<em>$2</em>');
  // target has already been HTML-escaped; decode ampersands for URL
  // validation, then escape the normalized URL again for the attribute.
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, target) => {
    const safe = safeLinkUrl(target.replace(/&amp;/g, '&'));
    if (!safe) return label;
    return `<a href="${escapeHtml(safe)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });
  return s;
}

export function renderMarkdown(md) {
  if (!md) return '';
  const lines = String(md).split('\n');
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code fence — content verbatim inside <pre><code>, HTML escaped so
    // backticks/brackets/tags never leak into the flow.
    if (/^```/.test(line)) {
      const lang = line.slice(3).trim();
      i++;
      const codeLines = [];
      while (i < lines.length && !/^```/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // consume closing fence
      const langAttr = lang ? ` data-lang="${escapeHtml(lang)}"` : '';
      out.push(`<pre class="vmx-md-pre"${langAttr}><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    if (/^### /.test(line)) { out.push(`<h3 class="vmx-md-h3">${renderInline(line.slice(4))}</h3>`); i++; continue; }
    if (/^## /.test(line))  { out.push(`<h2 class="vmx-md-h2">${renderInline(line.slice(3))}</h2>`);  i++; continue; }
    if (/^# /.test(line))   { out.push(`<h1 class="vmx-md-h1">${renderInline(line.slice(2))}</h1>`);  i++; continue; }

    if (/^---+\s*$/.test(line)) { out.push('<hr class="vmx-md-hr" />'); i++; continue; }

    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      out.push(`<blockquote class="vmx-md-quote">${buf.map(renderInline).join('<br/>')}</blockquote>`);
      continue;
    }

    if (/^\|.+\|/.test(line) && i + 1 < lines.length && /^\|[\s|:-]+\|/.test(lines[i + 1])) {
      const headerCells = line.split('|').slice(1, -1).map((c) => c.trim());
      i += 2; // skip header + separator
      const bodyRows = [];
      while (i < lines.length && /^\|.+\|/.test(lines[i])) {
        const cells = lines[i].split('|').slice(1, -1).map((c) => c.trim());
        bodyRows.push(cells);
        i++;
      }
      const headerHtml = `<thead><tr>${headerCells.map((c) => `<th>${renderInline(c)}</th>`).join('')}</tr></thead>`;
      const bodyHtml = `<tbody>${bodyRows.map((row) => `<tr>${row.map((c) => `<td>${renderInline(c)}</td>`).join('')}</tr>`).join('')}</tbody>`;
      out.push(`<table class="vmx-md-table">${headerHtml}${bodyHtml}</table>`);
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        buf.push(`<li>${renderInline(lines[i].replace(/^\d+\.\s/, ''))}</li>`);
        i++;
      }
      out.push(`<ol class="vmx-md-ol">${buf.join('')}</ol>`);
      continue;
    }

    if (/^[-*•]\s/.test(line)) {
      const buf = [];
      while (i < lines.length && /^[-*•]\s/.test(lines[i])) {
        buf.push(`<li>${renderInline(lines[i].replace(/^[-*•]\s/, ''))}</li>`);
        i++;
      }
      out.push(`<ul class="vmx-md-ul">${buf.join('')}</ul>`);
      continue;
    }

    if (!line.trim()) { i++; continue; }

    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#|>|```|\d+\.\s|[-*•]\s|\|)/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    out.push(`<p class="vmx-md-p">${buf.map(renderInline).join('<br/>')}</p>`);
  }

  return out.join('\n');
}
