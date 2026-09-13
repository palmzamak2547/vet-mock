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
  const { segments, relatedCountByTerm } = useMemo(() => {
    if (!text) return { segments: [], relatedCountByTerm: new Map() };
    const str = String(text);
    const matches = detectTerms(str, subject);
    if (matches.length === 0) {
      return { segments: [{ type: 'text', value: str }], relatedCountByTerm: new Map() };
    }
    // Build ordered segment list — non-overlapping by construction.
    const segs = [];
    let cursor = 0;
    for (const m of matches) {
      if (m.start > cursor) {
        segs.push({ type: 'text', value: str.slice(cursor, m.start) });
      }
      segs.push({
        type: 'term',
        value: str.slice(m.start, m.end),  // preserve original casing
        entry: m.entry,
      });
      cursor = m.end;
    }
    if (cursor < str.length) {
      segs.push({ type: 'text', value: str.slice(cursor) });
    }

    // Related-Q counts come from the build-time index, not a scan of
    // whatever the session has loaded — see regen-glossary-related.mjs.
    const counts = new Map();
    for (const m of matches) {
      const key = m.entry.term.toLowerCase();
      if (counts.has(key)) continue;
      counts.set(key, (GLOSSARY_RELATED[entryKey(m.entry)] || []).length);
    }
    return { segments: segs, relatedCountByTerm: counts };
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
  const openSegment = openAt != null ? segments[openAt] : null;
  const openEntry = openSegment && openSegment.type === 'term' ? openSegment.entry : null;
  const openRelatedCount = openEntry
    ? (relatedCountByTerm.get(openEntry.term.toLowerCase()) ?? 0)
    : 0;

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
        {segments.map((seg, i) => {
          if (seg.type === 'text') {
            // Pass through RichText so markdown still works.
            return <Fragment key={i}><RichText text={seg.value} highlight={highlight} /></Fragment>;
          }
          // Term segment — render as a button. We deliberately keep
          // the original casing inside so the underlined word reads
          // naturally inline with surrounding text.
          const isActive = openAt === i;
          return (
            <button
              key={i}
              type="button"
              className={`vmx-term${isActive ? ' active' : ''}`}
              data-at={i}
              aria-haspopup="dialog"
              aria-expanded={isActive ? 'true' : 'false'}
              aria-label={`Definition: ${seg.entry.term}`}
              title={seg.entry.defShort || seg.entry.term}
            >
              {/* Highlight search query inside the term text too, so
                  Cmd-K results still glow when the result is the term
                  itself. */}
              <RichText text={seg.value} highlight={highlight} />
            </button>
          );
        })}
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
