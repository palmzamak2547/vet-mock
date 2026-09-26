// ============================================================
// TermLinkedRichText — RichText + glossary term popups
// ============================================================
// AMBOSS-style wrapper: detects glossary terms inside the text, wraps
// each match in a clickable .vmx-term button with a dotted underline,
// and routes clicks through a single delegated handler to TermPopup.
//
// Non-term text is passed through the existing RichText component
// unchanged, so markdown (**bold**, *italic*, `code`) still renders.
// We deliberately do NOT scan inside `code` runs (those tokens are
// usually identifiers, not glossary terms).
//
// Props mirror RichText: { text, highlight }. The highlight prop is
// preserved so search-result highlighting still works around terms.
//
// Click behaviour:
//   - Single delegated `onClick` on the wrapper (event delegation)
//   - Clicked button's data-term opens TermPopup at its boundingRect
//   - Same term clicked again → close (toggle)
//   - Different term clicked → re-anchor popup (rapid scan)
//   - Outside click / Esc / scroll → close (handled inside TermPopup)
// ============================================================

import { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import { RichText } from '../lib/richtext.jsx';
import { detectTerms } from '../lib/term-detect.js';
import { entryKey } from '../data/glossary.js';
import { GLOSSARY_RELATED } from '../data/glossary-related.generated.js';
import TermPopup from './TermPopup.jsx';

// One-shot stylesheet injection. We attach a single <style> to the
// document head when the first TermLinkedRichText mounts. Cheaper
// than inlining `style` per term and keeps :focus-visible reachable.
let STYLE_INJECTED = false;
function ensureTermStyles() {
  if (STYLE_INJECTED || typeof document === 'undefined') return;
  STYLE_INJECTED = true;
  const css = `
.vmx-term {
  all: unset;
  cursor: pointer;
  display: inline;
  /* Subtle dotted underline — AMBOSS-ish */
  text-decoration: underline;
  text-decoration-style: dotted;
  text-decoration-color: var(--clr-ink-soft, #999);
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  /* Inline tap target — extra padding-block gives 44 px effective hit */
  padding: 2px 0;
  /* Prevent iOS double-tap-zoom on rapid taps */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  color: inherit;
}
.vmx-term:hover {
  text-decoration-color: var(--clr-gold);
  background: var(--clr-gold-soft, rgba(184, 137, 64, 0.08));
  border-radius: 3px;
}
.vmx-term:focus-visible {
  outline: 2px solid var(--clr-gold);
  outline-offset: 1px;
  border-radius: 3px;
}
.vmx-term.active {
  background: var(--clr-gold-soft, rgba(184, 137, 64, 0.15));
  text-decoration-color: var(--clr-gold);
  border-radius: 3px;
}
`;
  const tag = document.createElement('style');
  tag.setAttribute('data-vmx', 'term-popups');
  tag.textContent = css;
  document.head.appendChild(tag);
}

// Receive an optional `onOpenRelated(ids, entry)` callback so the host
// can route to its exam-config flow. We provide a sensible default:
// dispatch a CustomEvent('vmx:open-related-qs', { detail: { ids, entry } })
// that an App-level listener can hook into without us depending on
// the routing layer.
function defaultOpenRelated(ids, entry) {
  try {
    window.dispatchEvent(new CustomEvent('vmx:open-related-qs', {
      detail: { ids, term: entry?.term, entryKey: entry?.term, entry },
    }));
  } catch {}
}

// RichText's own tokens (lib/richtext.jsx TOKEN_RE): bold, italic, code, and
// line breaks. Kept in step with it by the term-markdown test.
const MARKDOWN_TOKEN_RE = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`|\n)/g;

// Terms are detected on the whole string (their context guard reads the words
// before them), but the markdown is split first. Cutting the raw string at
// each term used to hand RichText a lone "**" on either side of "**DMI**", so
// the asterisks printed and the bold was lost. A term now renders inside the
// bold or italic run it sits in; one inside `code`, or straddling a marker,
// stays plain text. Pure data, no JSX: nodes are
//   { type: 'text', value } | { type: 'term', value, entry, at }
//   | { type: 'raw', value }  (a code span or a line break, for RichText)
//   | { type: 'strong' | 'em', children }
function splitTermMarkdown(str, matches) {
  const terms = [];
  const inside = (a, b) => {
    const out = [];
    let cursor = a;
    for (const m of matches) {
      if (m.start < a || m.end > b) continue;
      if (m.start < cursor) continue;
      if (m.start > cursor) out.push({ type: 'text', value: str.slice(cursor, m.start) });
      const node = { type: 'term', value: str.slice(m.start, m.end), entry: m.entry, at: terms.length };
      terms.push(node);
      out.push(node);
      cursor = m.end;
    }
    if (cursor < b) out.push({ type: 'text', value: str.slice(cursor, b) });
    return out;
  };
  const nodes = [];
  let last = 0;
  MARKDOWN_TOKEN_RE.lastIndex = 0;
  let t;
  while ((t = MARKDOWN_TOKEN_RE.exec(str)) !== null) {
    const a = t.index;
    const b = a + t[0].length;
    if (a > last) nodes.push(...inside(last, a));
    const tok = t[0];
    if (tok.length >= 4 && tok.startsWith('**') && tok.endsWith('**')) {
      nodes.push({ type: 'strong', children: inside(a + 2, b - 2) });
    } else if (tok.length >= 3 && tok.startsWith('*') && tok.endsWith('*')) {
      nodes.push({ type: 'em', children: inside(a + 1, b - 1) });
    } else {
      nodes.push({ type: 'raw', value: tok });
    }
    last = b;
  }
  if (last < str.length) nodes.push(...inside(last, str.length));
  return { nodes, terms };
}

export default function TermLinkedRichText({ text, highlight, onOpenRelated, subject = null }) {
  if (typeof document !== 'undefined') ensureTermStyles();

  const wrapperRef = useRef(null);
  // WHICH OCCURRENCE is open, not which entry. One card can be reached by
  // several different words in the same sentence — the avian IBD card answers
  // to "Infectious bursal disease", "IBD" and "Gumboro", and that stem holds
  // all three. Keyed on the entry, tapping any one of them lit all three, so
  // the highlight said which CARD was open instead of which WORD was tapped.
  const [openAt, setOpenAt] = useState(null);           // segment index
  const [anchorRect, setAnchorRect] = useState(null);

  // Compute segments + related-Q counts once per text change.
  // Memoized because Question.jsx may re-render frequently (timers,
  // bookmark state, etc.) but text rarely changes mid-Q.
  const { nodes, terms, relatedCountByTerm } = useMemo(() => {
    if (!text) return { nodes: [], terms: [], relatedCountByTerm: new Map() };
    const str = String(text);
    const matches = detectTerms(str, subject);
    if (matches.length === 0) {
      return { nodes: [{ type: 'raw', value: str }], terms: [], relatedCountByTerm: new Map() };
    }
    const { nodes: built, terms: found } = splitTermMarkdown(str, matches);

    // Related-Q counts come from the build-time index, not a scan of
    // whatever the session has loaded — see regen-glossary-related.mjs.
    const counts = new Map();
    for (const m of matches) {
      const key = m.entry.term.toLowerCase();
      if (counts.has(key)) continue;
      counts.set(key, (GLOSSARY_RELATED[entryKey(m.entry)] || []).length);
    }
    return { nodes: built, terms: found, relatedCountByTerm: counts };
  }, [text, subject]);

  // Delegated click handler — fires for any descendant.
  // Walks up to the nearest .vmx-term button (closest()) and toggles
  // the popover. Uses the button's boundingRect so the popup anchors
  // to the visible span even when text wraps mid-button.
  const onWrapperClick = useCallback((e) => {
    const btn = e.target.closest?.('.vmx-term');
    if (!btn || !wrapperRef.current?.contains(btn)) return;
    e.preventDefault();
    e.stopPropagation();
    const at = Number(btn.dataset.at);
    if (!Number.isInteger(at)) return;
    if (openAt === at) {
      // Same word clicked again → toggle close.
      setOpenAt(null);
      setAnchorRect(null);
      return;
    }
    const rect = btn.getBoundingClientRect();
    setOpenAt(at);
    setAnchorRect(rect);
  }, [openAt]);

  const closePopup = useCallback(() => {
    setOpenAt(null);
    setAnchorRect(null);
  }, []);

  const openRelated = useCallback((entry) => {
    const ids = GLOSSARY_RELATED[entryKey(entry)] || [];
    if (typeof onOpenRelated === 'function') {
      onOpenRelated(ids, entry);
    } else {
      defaultOpenRelated(ids, entry);
    }
    // Close popup after firing — host opens the exam in its own UI.
    closePopup();
  }, [onOpenRelated, closePopup]);

  // Resolve the currently-open entry for the popup. We look up via the
  // glossary index (not the segment array) so the popup survives
  // re-renders that might shuffle segment order.
  // Read the entry off the segment that was actually clicked. If the text
  // changed under us the index no longer names a term, and nothing opens.
  const openSegment = openAt != null ? terms[openAt] : null;
  const openEntry = openSegment && openSegment.type === 'term' ? openSegment.entry : null;
  const openRelatedCount = openEntry
    ? (relatedCountByTerm.get(openEntry.term.toLowerCase()) ?? 0)
    : 0;

  // Plain runs and raw tokens go through RichText so highlight and code still
  // render; bold and italic wrap their own children, terms included.
  const renderNode = (node, key) => {
    if (node.type === 'text' || node.type === 'raw') {
      return <Fragment key={key}><RichText text={node.value} highlight={highlight} /></Fragment>;
    }
    if (node.type === 'strong') {
      return <strong key={key} style={{ fontWeight: 700 }}>{node.children.map(renderNode)}</strong>;
    }
    if (node.type === 'em') {
      return <em key={key}>{node.children.map(renderNode)}</em>;
    }
    // Term — render as a button. We deliberately keep the original casing
    // inside so the underlined word reads naturally inline with surrounding
    // text.
    const isActive = openAt === node.at;
    return (
      <button
        key={key}
        type="button"
        className={`vmx-term${isActive ? ' active' : ''}`}
        data-at={node.at}
        aria-haspopup="dialog"
        aria-expanded={isActive ? 'true' : 'false'}
        aria-label={`Definition: ${node.entry.term}`}
        title={node.entry.defShort || node.entry.term}
      >
        {/* Highlight search query inside the term text too, so Cmd-K results
            still glow when the result is the term itself. */}
        <RichText text={node.value} highlight={highlight} />
      </button>
    );
  };

  return (
    <>
      <span
        ref={wrapperRef}
        onClick={onWrapperClick}
        // Keyboard support: pressing Enter/Space on a focused .vmx-term
        // synthesizes a click — we let the delegated click handler do
        // the work. Browsers do this natively for <button> elements,
        // but since we use `all: unset` we also handle keydown for
        // safety.
        onKeyDown={(e) => {
          const btn = e.target?.closest?.('.vmx-term');
          if (!btn) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
          }
        }}
      >
        {nodes.map((node, i) => renderNode(node, i))}
      </span>

      {openEntry && anchorRect && (
        <TermPopup
          entry={openEntry}
          anchorRect={anchorRect}
          relatedCount={openRelatedCount}
          onClose={closePopup}
          onOpenRelated={openRelated}
        />
      )}
    </>
  );
}
