// ============================================================
// SummaryModal — แสดงสรุปคลิปอาจารย์ (ถอดจาก ASR ของ YouTube
// เป็น markdown), มี download .md + open in new tab
// ============================================================
//
// Props:
//   summary  : entry จาก VIDEO_SUMMARIES (มี summary, title, ฯลฯ)
//   onClose  : callback ปิด modal
//
// Renderer: minimal Thai-friendly markdown (heading, list, table,
// blockquote, bold, italic, code) — เขียนเองเพื่อไม่เพิ่ม
// dependency, summary content เราเขียนเองทั้งหมด ไม่ห่วง XSS

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PinButton from './PinButton.jsx';
import { useModalFocus } from '../hooks/useModalFocus.js';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';
import { safeLinkUrl } from '../lib/safe-url.js';
import RecallQuiz from './RecallQuiz.jsx';

// ─────────────────────────────────────────────────────────────
// Mini markdown → HTML renderer
// ─────────────────────────────────────────────────────────────
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, target) => {
    // target has already been HTML-escaped. Decode only ampersands for URL
    // validation, then escape the normalized URL again for the attribute.
    const safe = safeLinkUrl(target.replace(/&amp;/g, '&'));
    if (!safe) return label;
    return `<a href="${escapeHtml(safe)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });
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

// Front matter is one line of plain text in the source file, but the people
// writing these use markdown emphasis inside it — **ข้อสอบ VCA** in one,
// ten bold pairs in another — and every place that showed examFormat or
// instructor printed the string raw, so a student read the asterisks. They
// go through the same inline subset the body uses. renderInline escapes the
// string before it substitutes anything, so metadata cannot carry markup of
// its own into the page.
function Inline({ text }) {
  return <span dangerouslySetInnerHTML={{ __html: renderInline(String(text ?? '')) }} />;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
export default function SummaryModal({ summary, onClose }) {
  const html = useMemo(() => renderMarkdown(summary?.summary || ''), [summary]);
  const dialogRef = useModalFocus({ active: Boolean(summary), onClose });
  const { reduced } = useMotionPreferences();
  const bodyRef = useRef(null);
  // The scroll container now holds the recall panel as well as the prose, so
  // the reveal observer needs the prose element itself — observing the
  // container's children would have animated two big blocks instead of each
  // paragraph, and swept the panel into the same fade.
  const proseRef = useRef(null);

  // A PDF, not a markdown file. A student revising from this has no reason to
  // own a .md reader, and "save as PDF" is something they already know how to
  // do with a handout. The browser writes it: it is the only engine here that
  // shapes Thai vowels and tone marks correctly, and it paginates, so nothing
  // has to be laid out by hand.
  //
  // The printed copy is mounted only for the print itself. These summaries run
  // past 60,000 characters, and keeping a second copy of that in the DOM for
  // every reader — when almost none of them will print — is a cost with no
  // matching benefit.
  const [printing, setPrinting] = useState(false);
  useEffect(() => {
    if (!printing) return undefined;
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      window.removeEventListener('afterprint', done);
      clearTimeout(timer);
      document.documentElement.removeAttribute('data-vmx-printing');
      setPrinting(false);
    };
    // afterprint has been unreliable in Safari, so the timer is the floor:
    // the app can never be left wearing its print skin.
    const timer = setTimeout(done, 60000);
    window.addEventListener('afterprint', done);
    document.documentElement.setAttribute('data-vmx-printing', 'summary');
    // One frame so the copy is committed and its webfont is applied before
    // the print dialog snapshots the page.
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
    return () => {
      cancelAnimationFrame(raf);
      done();
    };
  }, [printing]);
  const [progress, setProgress] = useState(0);

  // How far through the lecture they have read. A summary of a two-hour
  // lecture is long enough that "how much is left" is a real question, and the
  // modal's own scrollbar is easy to miss beside the page's.
  const trackProgress = useCallback(() => {
    const el = bodyRef.current;
    if (!el) return;
    const span = el.scrollHeight - el.clientHeight;
    setProgress(span > 8 ? Math.min(1, Math.max(0, el.scrollTop / span)) : 0);
  }, []);

  // Bring each block in as it arrives. The class is added from JS and only
  // when there is an observer to take it off again, so if anything here fails
  // the summary is simply visible — never a blank modal.
  useEffect(() => {
    const el = bodyRef.current;
    const prose = proseRef.current;
    if (!el || !prose) return undefined;
    trackProgress();
    if (reduced || typeof IntersectionObserver !== 'function') return undefined;
    const blocks = Array.from(prose.children);
    if (!blocks.length) return undefined;
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    // No negative bottom margin: with the root shrunk by 8% the last block
    // (61px) never entered it on viewports taller than ~1,320px.
    }, { root: el, rootMargin: '0px', threshold: 0.01 });
    for (const block of blocks) {
      block.classList.add('vmx-reveal');
      io.observe(block);
    }
    return () => {
      io.disconnect();
      for (const block of blocks) block.classList.remove('vmx-reveal', 'is-in');
    };
  }, [html, reduced, trackProgress]);

  if (!summary) return null;

  const downloadMd = () => {
    const blob = new Blob([summary.summary], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${summary.title.replace(/[^\w.-]+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
    {/* The printed handout. It is its own document rather than a restyled
        modal: the modal carries inline styles that a print sheet cannot
        override, and the page furniture (scroll container, quiz, buttons)
        has no place on paper. It renders from the same `html` as the screen,
        so the two can never drift apart, and it is mounted only while a
        print is running.

        It hangs off <body> through a portal, and that is the whole reason the
        first version printed a blank page. The print sheet hides .vmx-app to
        clear the screen furniture, and this modal renders inside .vmx-app —
        so the handout was a descendant of a display:none ancestor. It still
        computed as display:block, because getComputedStyle reports an
        element's own value and knows nothing about its ancestors, which is
        exactly why the test that asserted display:block passed on a blank
        page. Outside .vmx-app there is nothing above it to hide. */}
    {printing && createPortal((
    <div className="vmx-print-doc" aria-hidden="true">
      <header className="vmx-print-head">
        <p className="vmx-print-eyebrow">สรุปจากคลิปบรรยาย</p>
        <h1 className="vmx-print-title">{summary.title}</h1>
        <p className="vmx-print-meta">
          <Inline text={[summary.subject?.toUpperCase(), summary.date,
            summary.durationMin ? `${summary.durationMin} นาที` : null,
            summary.instructor].filter(Boolean).join('  ·  ').replace(/·/g, '—')} />
        </p>
      </header>
      {summary.examFormat && (
        <aside className="vmx-print-exam">
          <p className="vmx-print-exam-label">แนวข้อสอบที่อาจารย์บอกไว้</p>
          <p className="vmx-print-exam-body"><Inline text={summary.examFormat} /></p>
        </aside>
      )}
      <div className="vmx-print-body" dangerouslySetInnerHTML={{ __html: html }} />
      <footer className="vmx-print-foot">
        สรุปจากคลิปบรรยายของรุ่น ถอดตามที่อาจารย์พูด ส่วนที่เป็นข้อสังเกตเพิ่มเติมอยู่ในหมายเหตุท้ายบท
      </footer>
    </div>
    ), document.body)}
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
          gridTemplateRows: 'auto auto minmax(0, 1fr) auto',
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
            <h2 id="vmx-summary-title" style={{ margin: '4px 0 0', fontSize: 17, fontFamily: 'var(--vmx-display)', fontWeight: 600 }}>
              {summary.title}
            </h2>
            <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', marginTop: 3, fontStyle: 'italic' }}>
              {summary.subject?.toUpperCase()}, {summary.date}, {summary.durationMin} นาที
              {summary.instructor && <>, <Inline text={summary.instructor} /></>}
            </div>
          </div>
          <PinButton
            type="summary"
            payload={{ videoId: summary.videoId, title: summary.title, subject: summary.subject, instructor: summary.instructor, date: summary.date }}
            label={summary.title}
            compact
            style={{ flexShrink: 0 }}
          />
          {/* Offered only when there is a summary to print. When the body
              failed to load it is one apologetic sentence, and a PDF of that
              is worse than no button. */}
          {(summary.summary || '').length > 400 && (
            <button
              type="button"
              className="vmx-btn vmx-btn-ghost vmx-btn-sm"
              onClick={() => setPrinting(true)}
              disabled={printing}
              title="บันทึกเป็น PDF หรือสั่งพิมพ์ ในหน้าต่างที่เปิดขึ้นให้เลือกปลายทางเป็น บันทึกเป็น PDF"
              style={{ flexShrink: 0 }}
            >
              {printing ? 'กำลังเตรียม…' : 'บันทึกเป็น PDF'}
            </button>
          )}
          <button
            type="button"
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            onClick={downloadMd}
            title="ดาวน์โหลดเป็นไฟล์ .md สำหรับเปิดใน Obsidian หรือ Notability"
            style={{ flexShrink: 0 }}
          >
            .md
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
        {/* Reading progress for the summary itself. Rendered even under
            reduced motion, because it is information rather than decoration;
            only the easing of its movement is dropped. */}
        <div className="vmx-summary-progress" aria-hidden="true">
          <span
            className={reduced ? '' : 'is-eased'}
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>

        <div
          ref={bodyRef}
          onScroll={trackProgress}
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
        >
          <div ref={proseRef} dangerouslySetInnerHTML={{ __html: html }} />
          <RecallQuiz videoId={summary.videoId} />
        </div>

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
            <span style={{ flex: 1 }}><Inline text={summary.examFormat} /></span>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
