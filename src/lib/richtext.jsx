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

export function RichText({ text, highlight }) {
  if (text === null || text === undefined) return null;
  const str = String(text);
  if (!str) return null;
  const parts = str.split(TOKEN_RE);
  return (
    <>
      {parts.map((p, i) => {
        if (!p) return null;
        if (p === '\n') return <br key={i} />;
        if (p.length >= 4 && p.startsWith('**') && p.endsWith('**')) {
          // Inherit color from parent so the bold stays readable on
          // dark/selected backgrounds (e.g. selected MCQ option)
          return <strong key={i} style={{ fontWeight: 700 }}>{highlightMatches(p.slice(2, -2), highlight, i)}</strong>;
        }
        if (p.length >= 3 && p.startsWith('*') && p.endsWith('*')) {
          return <em key={i}>{highlightMatches(p.slice(1, -1), highlight, i)}</em>;
        }
        if (p.length >= 3 && p.startsWith('`') && p.endsWith('`')) {
          return <code key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.92em', background: 'var(--clr-surface-2)', padding: '1px 5px', borderRadius: 4 }}>{highlightMatches(p.slice(1, -1), highlight, i)}</code>;
        }
        return <Fragment key={i}>{highlightMatches(p, highlight, i)}</Fragment>;
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
