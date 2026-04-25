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

export function RichText({ text }) {
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
          return <strong key={i} style={{ color: 'var(--clr-ink)', fontWeight: 700 }}>{p.slice(2, -2)}</strong>;
        }
        if (p.length >= 3 && p.startsWith('*') && p.endsWith('*')) {
          return <em key={i}>{p.slice(1, -1)}</em>;
        }
        if (p.length >= 3 && p.startsWith('`') && p.endsWith('`')) {
          return <code key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.92em', background: 'var(--clr-surface-2)', padding: '1px 5px', borderRadius: 4 }}>{p.slice(1, -1)}</code>;
        }
        return <Fragment key={i}>{p}</Fragment>;
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
