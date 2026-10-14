// ============================================================
// WikiEvidence: what a section was checked against, and the article's list
// ============================================================
// Under a section, "ตรวจทานกับ" and one numbered chip per source
// (lib/vetwiki/cite.js numbers them across the article). A chip opens a
// drawer in place, not a floating popover: it never covers the text, needs no
// position maths, and reads in order on a phone. The drawer holds the points
// this section checked against that source, their evidence, the full citation
// and the two ways on. Where the page has a margin (styles-wiki.css), the
// same block stands beside its section as a sidenote. The points themselves
// open from a chip there too: they run 216 characters at the median, about
// nine lines each in a 216 px margin, taller than most sections.
// ============================================================

import React, { useEffect, useId, useRef, useState } from 'react';
import { RichText } from '../lib/richtext.jsx';
import { EVIDENCE_LABEL } from '../lib/vetwiki/schema.js';
import { SOURCE_KIND, sourceChipLabel, citationText } from '../lib/vetwiki/cite.js';
import { motionIsReduced } from '../lib/motion-preferences.js';

const pad = (i) => String(i + 1).padStart(2, '0');

// "ระดับหลักฐาน:" in front, so "ความเห็นพ้องผู้เชี่ยวชาญ" (636 points) reads as
// the strength of the evidence and not as experts having reviewed the point.
function Claim({ claim, locator, cited }) {
  const ev = EVIDENCE_LABEL[claim.evidenceStatus];
  const where = locator && !cited.includes(locator) ? locator : '';
  return (
    <>
      <RichText text={claim.statement} />
      {(ev || where) && (
        <span className="vw-ev-note">
          {ev && <>ระดับหลักฐาน: <span className={`vw-tone-${ev.tone}`}>{ev.th}</span></>}
          {ev && where ? ', ' : ''}
          {where}
        </span>
      )}
      {Array.isArray(claim.limitations) && claim.limitations.length > 0 && (
        <ul className="vw-ev-limits">{claim.limitations.map((l, i) => <li key={i}>{l}</li>)}</ul>
      )}
    </>
  );
}

export function SectionEvidence({ chips, onGoToSource }) {
  const [open, setOpen] = useState(null);
  const chipRefs = useRef(new Map());
  const drawerRef = useRef(null);
  const drawerId = `${useId()}-drawer`;
  // A chip near the bottom of the screen opened its drawer out of sight, so
  // the tap seemed to do nothing: bring the whole drawer into view, clear of
  // the tab bar and the contents pill (its scroll-margin, styles-wiki.css).
  useEffect(() => {
    if (open == null) return;
    drawerRef.current?.scrollIntoView({ block: 'nearest', behavior: motionIsReduced() ? 'auto' : 'smooth' });
  }, [open]);
  // Escape closes an open drawer and puts focus on the chip that opened it.
  // Listened for on the document, since Safari does not focus a button it
  // taps and the key lands on <body>; but only with focus in this block or
  // nowhere, so a report box being typed in keeps its own Escape. A dialog
  // above (the contents sheet) takes Escape first, in its capture. A tap
  // outside the block closes the drawer too.
  const blockRef = useRef(null);
  const close = (focusChip) => {
    const chip = chipRefs.current.get(open);
    setOpen(null);
    if (focusChip) chip?.focus({ preventScroll: true });
  };
  useEffect(() => {
    if (open == null) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented || e.isComposing) return;
      const at = document.activeElement;
      if (at && at !== document.body && !blockRef.current?.contains(at)) return;
      close(true);
    };
    const away = (e) => { if (!blockRef.current?.contains(e.target)) setOpen(null); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', away);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', away); };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close reads this render's `open`
  }, [open]);
  if (!chips.length) return null;
  const openChip = chips.find((c) => c.n === open) || null;
  return (
    <div className="vw-ev" ref={blockRef}>
      <p className="vw-ev-head">ตรวจทานกับ</p>
      <ul className="vw-ev-chips">
        {chips.map((ch) => (
          <li key={ch.n}>
            <button
              type="button"
              ref={(el) => { if (el) chipRefs.current.set(ch.n, el); else chipRefs.current.delete(ch.n); }}
              className="vw-chip"
              aria-expanded={open === ch.n}
              aria-controls={open === ch.n ? drawerId : undefined}
              aria-label={`แหล่งอ้างอิงที่ ${ch.n}: ${sourceChipLabel(ch.src)}`}
              onClick={() => setOpen(open === ch.n ? null : ch.n)}
            >
              <span className="vw-chip-face">
                <span className="vw-chip-n">{ch.n}</span>
                <span className="vw-chip-name">{sourceChipLabel(ch.src)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {openChip && (
        <div id={drawerId} ref={drawerRef} className="vw-ev-drawer" role="region" aria-label={`แหล่งอ้างอิงที่ ${openChip.n}`}>
          <p className="vw-ev-cite">
            <span className="vw-ev-kind">{SOURCE_KIND[openChip.src.kind] || 'แหล่งอ้างอิง'}</span>
            {citationText(openChip.src)}
          </p>
          <p className="vw-ev-sub">จุดในหัวข้อย่อยนี้ที่ตรวจทานกับแหล่งนี้</p>
          <ul className="vw-ev-points">
            {openChip.claims.map(({ claim, locator }) => (
              <li key={claim.id}><Claim claim={claim} locator={locator} cited={citationText(openChip.src)} /></li>
            ))}
          </ul>
          <div className="vw-ev-actions">
            {openChip.src.url && (
              <a className="vmx-btn vmx-btn-ghost vmx-btn-sm" href={openChip.src.url} target="_blank" rel="noopener noreferrer">
                เปิดแหล่งอ้างอิง <span aria-hidden="true">↗</span>
              </a>
            )}
            <a className="vmx-btn vmx-btn-ghost vmx-btn-sm" href={`#vw-src-${openChip.n}`}
              onClick={(e) => {
                e.preventDefault();
                const n = openChip.n;
                setOpen(null);
                // Jump once the drawer has closed: measured before, the list
                // entry lands a drawer's height above the screen on a phone.
                window.requestAnimationFrame(() => onGoToSource(n));
              }}>
              ดูในรายการแหล่งอ้างอิง
            </a>
            <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => close(true)}>ปิด</button>
          </div>
        </div>
      )}
    </div>
  );
}

/** The article's sources, numbered as in the chips, each with the sections that cite it. */
export function SourceList({ list, sections, onJump }) {
  if (!list.length) return null;
  return (
    <section className="vw-sources" id="vw-sources" aria-labelledby="vw-sources-head" tabIndex={-1}>
      <h2 id="vw-sources-head">แหล่งอ้างอิงทั้งหมด {list.length.toLocaleString('en-US')} แหล่ง</h2>
      <ol>
        {list.map(({ n, src, sections: at }) => (
          <li key={n} id={`vw-src-${n}`} tabIndex={-1}>
            <span className="vw-src-n" aria-hidden="true">{n}</span>
            <div className="vw-src-text">
              <p className="vw-src-cite">
                <span className="vmx-sr-only">{n}. </span>
                {src.url
                  ? <a href={src.url} target="_blank" rel="noopener noreferrer">{citationText(src)}</a>
                  : citationText(src)}
              </p>
              <p className="vw-src-meta">
                <span>{[SOURCE_KIND[src.kind], src.citation ? '' : src.organization, src.citation ? '' : src.year].filter(Boolean).join(', ')}</span>
                <span>
                {'อ้างในหัวข้อย่อย '}
                {at.map((si, k) => (
                  <React.Fragment key={si}>
                    {k > 0 && ', '}
                    <a href={`#${sections[si].id}`} onClick={(e) => { e.preventDefault(); onJump(sections[si].id); }}
                      aria-label={`หัวข้อย่อย ${pad(si)} ${sections[si].heading}`}>
                      {pad(si)}
                    </a>
                  </React.Fragment>
                ))}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
