// ============================================================
// ClozeCard.jsx — render ONE cloze card during an SR session.
// ============================================================
// Driven by SRSessionView (wired by orchestrator post-Wave-4).
// We do NOT mount this component ourselves; we just export it
// so the dispatch layer can branch on q.type === 'cloze'.
//
// Front:  q.front with the BLANK marker styled as a gold pill.
// Back:   q.fullText, every `{{cN::X}}` replaced by its inner
//         text, the answer slot for THIS card's idx highlighted
//         in orange.
//
// Touch:
//   • 44 px tap area on the reveal button
//   • Esc reveals/closes (consumer can listen separately; this
//     component re-uses `showAnswer` + `onReveal` like the rest
//     of the SR cards)
// ============================================================

import { useMemo } from 'react';
import { CLOZE_BLANK } from '../lib/cloze.js';

// Match either the BLANK token (`[_____]`) on the front, or a
// `{{cN::payload}}` mark on the back. Same character class as
// cloze.js to stay in sync.
const CLOZE_RE_LOCAL = /\{\{c(\d+)::((?:[^{}]|\{(?!\{)|\}(?!\}))*)\}\}/g;

function renderFront(front) {
  // Split on the BLANK literal, interleave styled pills.
  if (!front) return null;
  const parts = front.split(CLOZE_BLANK);
  const out = [];
  parts.forEach((part, i) => {
    if (part) out.push(part);
    if (i < parts.length - 1) {
      out.push(
        <span
          key={`blank-${i}`}
          style={{
            display: 'inline-block',
            background: 'var(--clr-gold-soft, #f6e7c1)',
            color: 'var(--clr-ink, #1d201d)',
            padding: '2px 10px',
            borderRadius: 999,
            fontWeight: 700,
            margin: '0 2px',
            minHeight: 20,
            verticalAlign: 'baseline',
          }}
          aria-label="ช่องว่างให้เติม"
        >
          …
        </span>,
      );
    }
  });
  return out;
}

function renderBack(fullText, targetIdx) {
  // Walk through `{{cN::X}}` marks; replace each with the inner text.
  // Marks matching targetIdx → orange highlight (the answer).
  // Other marks → plain text.
  if (!fullText) return null;
  const nodes = [];
  let lastIdx = 0;
  let key = 0;
  CLOZE_RE_LOCAL.lastIndex = 0;
  let m;
  while ((m = CLOZE_RE_LOCAL.exec(fullText)) !== null) {
    if (m.index > lastIdx) {
      nodes.push(fullText.slice(lastIdx, m.index));
    }
    const n = Number.parseInt(m[1], 10);
    const payload = m[2];
    if (n === targetIdx) {
      nodes.push(
        <mark
          key={`hl-${key++}`}
          style={{
            background: 'var(--clr-orange-soft, #ffd9b3)',
            color: 'var(--clr-orange-deep, #8a3a00)',
            padding: '1px 6px',
            borderRadius: 6,
            fontWeight: 700,
          }}
        >
          {payload}
        </mark>,
      );
    } else {
      nodes.push(<span key={`pt-${key++}`}>{payload}</span>);
    }
    lastIdx = m.index + m[0].length;
    if (m.index === CLOZE_RE_LOCAL.lastIndex) CLOZE_RE_LOCAL.lastIndex += 1;
  }
  CLOZE_RE_LOCAL.lastIndex = 0;
  if (lastIdx < fullText.length) {
    nodes.push(fullText.slice(lastIdx));
  }
  return nodes;
}

export default function ClozeCard({ q, showAnswer, onReveal }) {
  const frontNodes = useMemo(() => renderFront(q?.front), [q?.front]);
  const backNodes = useMemo(
    () => renderBack(q?.fullText || '', q?.clozeIdx),
    [q?.fullText, q?.clozeIdx],
  );

  if (!q) return null;

  return (
    <div
      className="vmx-cloze-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: '4px 0',
      }}
    >
      <div
        style={{
          fontSize: 17,
          lineHeight: 1.7,
          color: 'var(--clr-ink, #1d201d)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {frontNodes}
      </div>

      {!showAnswer && (
        <button
          type="button"
          onClick={onReveal}
          className="vmx-btn vmx-btn-primary"
          style={{
            alignSelf: 'flex-start',
            minHeight: 44,
            minWidth: 120,
            padding: '10px 18px',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
          aria-label="เฉลย"
        >
          เฉลย
        </button>
      )}

      {showAnswer && (
        <div
          style={{
            borderTop: '1px dashed var(--clr-border, rgba(0,0,0,0.12))',
            paddingTop: 14,
            fontSize: 17,
            lineHeight: 1.7,
            color: 'var(--clr-ink, #1d201d)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {backNodes}
        </div>
      )}
    </div>
  );
}
