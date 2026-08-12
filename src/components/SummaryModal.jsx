// ============================================================
// SummaryModal — แสดงสรุปคลิปอาจารย์ (Claude อ่าน YouTube ASR
// แล้วถอดเป็น markdown), มี download .md + open in new tab
// ============================================================
//
// Props:
//   summary  : entry จาก VIDEO_SUMMARIES (มี summary, title, ฯลฯ)
//   onClose  : callback ปิด modal
//
// Renderer: minimal Thai-friendly markdown (heading, list, table,
// blockquote, bold, italic, code) — เขียนเองเพื่อไม่เพิ่ม
// dependency, summary content เราเขียนเองทั้งหมด ไม่ห่วง XSS

import { useMemo } from 'react';
import PinButton from './PinButton.jsx';
import { useModalFocus } from '../hooks/useModalFocus.js';

// ─────────────────────────────────────────────────────────────
// Mini markdown → HTML renderer
// ─────────────────────────────────────────────────────────────
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Inline replacements: bold, italic, code, links
function renderInline(text) {
  let s = escapeHtml(text);
  // `code`
  s = s.replace(/`([^`]+)`/g, '<code class="vmx-md-code">$1</code>');
  // **bold**
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // *italic*  (skip if it's inside ** already — handled above)
  s = s.replace(/(^|[\s>])\*([^*\s][^*]*)\*(?=$|[\s.,;:?!])/g, '$1<em>$2</em>');
  // [text](url)
  // Add both `noopener` (block window.opener tabnabbing) and `noreferrer`
  // (strip Referer — content domains may not want us referring).
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return s;
}

// Block-level renderer
function renderMarkdown(md) {
  if (!md) return '';
  const lines = md.split('\n');
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code fence ``` (optional language tag). Captures everything until
    // the matching closing fence; content rendered verbatim inside
    // <pre><code> with HTML escaped so backticks/brackets don't leak
    // into surrounding flow. Used by ~7 video summaries for ASCII
    // diagrams (e.g. nitrogen cycle pathway). Without this block, the
    // backtick lines render as plain text and the diagram collapses.
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

    // Heading
    if (/^### /.test(line)) { out.push(`<h3 class="vmx-md-h3">${renderInline(line.slice(4))}</h3>`); i++; continue; }
    if (/^## /.test(line))  { out.push(`<h2 class="vmx-md-h2">${renderInline(line.slice(3))}</h2>`);  i++; continue; }
    if (/^# /.test(line))   { out.push(`<h1 class="vmx-md-h1">${renderInline(line.slice(2))}</h1>`);  i++; continue; }

    // Horizontal rule
    if (/^---+\s*$/.test(line)) { out.push('<hr class="vmx-md-hr" />'); i++; continue; }

    // Blockquote (collect consecutive > lines)
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      out.push(`<blockquote class="vmx-md-quote">${buf.map(renderInline).join('<br/>')}</blockquote>`);
      continue;
    }

    // Table (simple: header row, separator row, body rows)
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

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        buf.push(`<li>${renderInline(lines[i].replace(/^\d+\.\s/, ''))}</li>`);
        i++;
      }
      out.push(`<ol class="vmx-md-ol">${buf.join('')}</ol>`);
      continue;
    }

    // Unordered list (-, *, •)
    if (/^[-*•]\s/.test(line)) {
      const buf = [];
      while (i < lines.length && /^[-*•]\s/.test(lines[i])) {
        buf.push(`<li>${renderInline(lines[i].replace(/^[-*•]\s/, ''))}</li>`);
        i++;
      }
      out.push(`<ul class="vmx-md-ul">${buf.join('')}</ul>`);
      continue;
    }

    // Empty line
    if (!line.trim()) { i++; continue; }

    // Plain paragraph (collect consecutive non-special lines)
    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#|>|\d+\.\s|[-*•]\s|\|)/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    out.push(`<p class="vmx-md-p">${buf.map(renderInline).join('<br/>')}</p>`);
  }

  return out.join('\n');
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
export default function SummaryModal({ summary, onClose }) {
  const html = useMemo(() => renderMarkdown(summary?.summary || ''), [summary]);
  const dialogRef = useModalFocus({ active: Boolean(summary), onClose });

  if (!summary) return null;

  const downloadMd = () => {
    const blob = new Blob([summary.summary], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${summary.title.replace(/[^\w.-]+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="vmx-modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      {/* Grid > flex for the header / body / footer split: with
          flex-column we needed `min-height: 0` on the body to bypass
          the `min-height: auto` default, but Firefox + some Chrome
          builds occasionally still left the body unscrollable on
          desktop. Grid with template-rows `auto 1fr auto` gives the
          body exactly the leftover space, no min-height tricks. */}
      <div
        ref={dialogRef}
        className="vmx-modal vmx-summary-modal"
        style={{
          maxWidth: 820,
          width: '100%',
          maxHeight: 'min(92vh, calc(100dvh - 24px))',
          padding: 0,
          overflowX: 'hidden',
          overflowY: 'hidden',
          display: 'grid',
          gridTemplateRows: 'auto minmax(0, 1fr) auto',
        }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        data-vmx-modal="true"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vmx-summary-title"
      >
        {/* Header */}
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--clr-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          background: 'linear-gradient(135deg, rgba(194,109,109,0.06), rgba(232,212,168,0.06))',
        }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              สรุปจากคลิปอาจารย์
            </div>
            <h2 id="vmx-summary-title" style={{ margin: '4px 0 0', fontSize: 17, fontFamily: 'Fraunces, serif', fontWeight: 600 }}>
              {summary.title}
            </h2>
            <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', marginTop: 3, fontStyle: 'italic' }}>
              {summary.subject?.toUpperCase()}, {summary.date}, {summary.durationMin} นาที
              {summary.instructor && <>, {summary.instructor}</>}
            </div>
          </div>
          <PinButton
            type="summary"
            payload={{ videoId: summary.videoId, title: summary.title, subject: summary.subject, instructor: summary.instructor, date: summary.date }}
            label={summary.title}
            compact
            style={{ flexShrink: 0 }}
          />
          <button
            type="button"
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            onClick={downloadMd}
            title="ดาวน์โหลด .md เพื่ออ่านใน Notability/Obsidian/etc"
            style={{ flexShrink: 0 }}
          >
            💾 .md
          </button>
          <button
            type="button"
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            onClick={onClose}
            title="ปิด (Esc)"
            aria-label="ปิดสรุปคลิป"
            style={{ flexShrink: 0, fontSize: 18, padding: '4px 10px' }}
          >
            ✕
          </button>
        </div>

        {/* Body — scrollable. Grid track `minmax(0, 1fr)` gives this
            row exactly the leftover height between header and footer,
            so overflowY: auto reliably triggers a scrollbar on desktop
            when content overflows. (Previous flex-column + min-height:
            0 trick worked on mobile thanks to momentum scroll papering
            over edge cases, but PC users sometimes saw a stuck modal.)
            Keep `overscroll-behavior: contain` so wheel scrolling
            doesn't leak into the underlying VideoView player when the
            user reaches the top/bottom. */}
        <div
          className="vmx-summary-body"
          style={{
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
            padding: '18px 26px 26px',
            lineHeight: 1.7,
            fontSize: 15,
            color: 'var(--clr-ink)',
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Footer */}
        {summary.examFormat && (
          <div style={{
            padding: '10px 18px',
            borderTop: '1px solid var(--clr-border)',
            background: 'var(--clr-surface-2)',
            fontSize: 12,
            color: 'var(--clr-ink-soft)',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <span style={{ fontFamily: 'var(--vmx-mono)', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.08em' }}>
              Exam format
            </span>
            <span style={{ flex: 1 }}>{summary.examFormat}</span>
          </div>
        )}
      </div>
    </div>
  );
}
