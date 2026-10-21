// ============================================================
// RichText — render lightweight markdown inline
// ============================================================
// Supports:
//   **bold**            → <strong>
//   *italic*            → <em>
//   `code`              → <code>
//   \n / line breaks    → <br>
//
// Used everywhere question / explain / option / note content
// is rendered, so author copy with **emphasis** doesn't show
// raw asterisks in the UI.
// ============================================================

import { Fragment } from 'react';

const TOKEN_RE = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`|\n)/g;

// Wrap occurrences of `query` in plain `text` with a <mark> element.
// Case-insensitive, returns the original string when no match (so
// callers don't have to special-case empty results). Skips empty
// queries (returns text untouched).
function highlightMatches(text, query, baseKey) {
  if (!query) return text;
  const q = String(query).trim();
  if (!q) return text;
  const lower = text.toLowerCase();
  const qLower = q.toLowerCase();
  const out = [];
  let lastIdx = 0;
  let idx = lower.indexOf(qLower);
  let k = 0;
  while (idx !== -1) {
    if (idx > lastIdx) out.push(text.slice(lastIdx, idx));
    out.push(
      <mark
        key={`${baseKey}-h-${k++}`}
        style={{ background: 'rgba(184, 137, 64, 0.45)', color: 'inherit', padding: '0 1px', borderRadius: 2 }}
      >
        {text.slice(idx, idx + q.length)}
      </mark>
    );
    lastIdx = idx + q.length;
    idx = lower.indexOf(qLower, lastIdx);
  }
  if (out.length === 0) return text;
  if (lastIdx < text.length) out.push(text.slice(lastIdx));
  return <>{out}</>;
}

// Chromium and WebKit break Thai by dictionary, and a word missing from it (a
// loanword such as เลกเชอร์) can break before its silent final, so a line
// starts with "ร์" (seen on VetWiki, 5.146.0). The silent final stays on the
// line of the letter before it. The span holds whole clusters, a base and its
// marks, never a mark cut from its base.
const SILENT_FINAL_RE = /([\u{0E01}-\u{0E30}\u{0E32}\u{0E33}\u{0E40}-\u{0E46}][\u{0E31}\u{0E34}-\u{0E3A}\u{0E47}-\u{0E4E}]*[\u{0E01}-\u{0E2E}]{1,2}[\u{0E34}\u{0E38}]?\u{0E4C})/u;
const NOBR = { whiteSpace: 'nowrap' };
export function keepSilentFinals(text, baseKey = 'sf') {
  const parts = String(text).split(SILENT_FINAL_RE);
  if (parts.length === 1) return text;
  return parts.map((p, i) => (i % 2 ? <span key={`${baseKey}-${i}`} style={NOBR}>{p}</span> : p));
}

// The middle dot is not a separator this app uses (house style, Palm
// 2026-10-21), yet 1,615 of them sit in the governed notes and questions,
// where their text is hashed for review. On screen they read as a list:
// "pH · density" becomes "pH, density", a line that starts with "· " loses
// it, and a British decimal "25·4" becomes "25.4". The data is untouched.
export function plainSeparators(text) {
  return String(text)
    .replace(/(\d)·(?=\d)/g, '$1.')
    .replace(/(^|\n)[ \t]*·[ \t]+/g, '$1')
    .replace(/[ \t]+·[ \t]+/g, ', ');
}

export function RichText({ text, highlight }) {
  if (text === null || text === undefined) return null;
  const str = plainSeparators(text);
  if (!str) return null;
  // A search highlight cuts the text by its own offsets, so it wins there.
  const plain = (s, key) => (highlight ? highlightMatches(s, highlight, key) : keepSilentFinals(s, key));
  const parts = str.split(TOKEN_RE);
  return (
    <>
      {parts.map((p, i) => {
        if (!p) return null;
        if (p === '\n') return <br key={i} />;
        if (p.length >= 4 && p.startsWith('**') && p.endsWith('**')) {
          // Inherit color from parent so the bold stays readable on
          // dark/selected backgrounds (e.g. selected MCQ option)
          return <strong key={i} style={{ fontWeight: 700 }}>{plain(p.slice(2, -2), i)}</strong>;
        }
        if (p.length >= 3 && p.startsWith('*') && p.endsWith('*')) {
          return <em key={i}>{plain(p.slice(1, -1), i)}</em>;
        }
        if (p.length >= 3 && p.startsWith('`') && p.endsWith('`')) {
          return <code key={i} style={{ fontFamily: 'var(--vmx-mono)', fontSize: '0.92em', background: 'var(--clr-surface-2)', padding: '1px 5px', borderRadius: 4 }}>{highlightMatches(p.slice(1, -1), highlight, i)}</code>;
        }
        return <Fragment key={i}>{plain(p, i)}</Fragment>;
      })}
    </>
  );
}

// Plain string version — strips markdown markers (for places where
// JSX won't fit, e.g. <input value={...}>, alt text, search index).
export function stripRichText(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/\*\*([^*\n]+)\*\*/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/`([^`\n]+)`/g, '$1');
}
