import { useEffect, useLayoutEffect, useRef, useState, useId } from 'react';
import { createPortal } from 'react-dom';
import NavIcon from '../NavIcon.jsx';
import CaseText from './CaseText.jsx';
import RichBlocks from '../RichBlocks.jsx';
import ZoomableImage from '../ZoomableImage.jsx';
import ExamClock from '../ExamClock.jsx';
import { useModalFocus } from '../../hooks/useModalFocus.js';
import { leaveEntry, ownPop, dropEntry } from '../../lib/case-entry.js';

// ============================================================
// CaseSheet — the case as a full-screen reading sheet
// ============================================================
// The case reader design, section 1. A layer over the whole viewport in the
// page's own colours, not the browser's Fullscreen API (iPad Safari allows
// that for video only). Loaded on the first tap of อ่านเต็มจอ, so nothing of
// it is in the first load or the exam's chunk.
//
// The place is a character, not a pixel: opening scrolls the sheet so the
// character at the top of the pane sits at its top; closing hands back the
// character at the top of the sheet, and a rotation keeps it there.
//
// What a hand needs (ink/case-hand.js and the tools) comes from the pane as `hand`, the modules the
// pane loaded: imported here, a download that failed once would keep the sheet shut until a reload.
//
// The marks are the pane's (CasePane owns them, their storage and their undo):
// the sheet shows the same ranges and adds to the same history. Pen strokes
// stay in the pane until slice 3 anchors them to the words.
// ============================================================

export default function CaseSheet({
  text, title, ranges, ask, stemBody, figure, clockDeadline, place, onClose,
  policy, penSeen, coarse, phone, rangeColor, penColor, onColor, onRange, onErase, onRecolor, onPenSeen,
  canUndo, canRedo, onUndo, onRedo, onClear, toast, onUndoClear, entry = { on: false }, hand,
}) {
  const { attachCaseSurface, readingPlace, placeDelta, Tools: CaseTools, MarkBar, PickBar } = hand;
  const scrollRef = useRef(null);
  const textRef = useRef(null);
  const wetRef = useRef(null);
  const backRef = useRef(null);
  const placeRef = useRef(place);
  const [tool, setTool] = useState('highlighter');
  const [writeSwitch, setWriteSwitch] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [markBar, setMarkBar] = useState(null);
  const titleId = useId();

  const here = () => {
    const sc = scrollRef.current;
    return sc && textRef.current ? readingPlace(textRef.current, sc.getBoundingClientRect().top) : placeRef.current;
  };
  // Back closes the sheet first, in practice and in a paper, and never leaves the set (lib/case-entry.js).
  // Its buttons and Escape go back through its entry, so the browser's history stays as it was before it.
  const closeRef = useRef(null);
  closeRef.current = () => onClose(here());
  useEffect(() => {
    const onPop = (e) => {
      if (!ownPop(entry)) return;
      e.stopImmediatePropagation();
      closeRef.current();
    };
    window.addEventListener('popstate', onPop, true);
    return () => {
      window.removeEventListener('popstate', onPop, true);
      // Closed from the card (another question, the paper's end), or while its own close is on the way
      // back: the entry goes without the app hearing it, and never twice.
      dropEntry(entry);
    };
  }, [entry]);
  const close = () => { if (!leaveEntry(entry)) closeRef.current(); };
  const dialogRef = useModalFocus({ active: true, onClose: close, initialFocusRef: backRef });

  // Open at the pane's character; keep it on top through a rotation or a resize.
  const settle = () => {
    const sc = scrollRef.current;
    if (sc && textRef.current && placeRef.current) sc.scrollTop += placeDelta(textRef.current, placeRef.current, sc.getBoundingClientRect().top);
  };
  useLayoutEffect(() => { settle(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const sc = scrollRef.current;
    if (!sc) return undefined;
    // The place moves only when the reader moves the sheet. Our own scrolls (opening, a late font, a table
    // measuring itself, a rotation) put the same character back on top and never redefine it.
    let reader = false;
    const mine = () => { reader = true; };
    // Read once the reader stops, not on every frame of a scroll.
    let frame = 0;
    const onScroll = () => {
      if (!reader) return;
      clearTimeout(frame);
      frame = setTimeout(() => { placeRef.current = here(); }, 120);
    };
    const kinds = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
    kinds.forEach((k) => sc.addEventListener(k, mine, { passive: true }));
    sc.addEventListener('scroll', onScroll, { passive: true });
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => settle());
    ro?.observe(sc);
    if (sc.firstElementChild) ro?.observe(sc.firstElementChild);
    const late = requestAnimationFrame(() => requestAnimationFrame(() => { if (!reader) settle(); }));
    document.fonts?.ready?.then(() => { if (!reader) settle(); }).catch(() => {});
    return () => {
      kinds.forEach((k) => sc.removeEventListener(k, mine));
      sc.removeEventListener('scroll', onScroll);
      ro?.disconnect();
      clearTimeout(frame);
      cancelAnimationFrame(late);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // The hand on the sheet. React hears of a mark only when it is committed.
  const live = useRef(null);
  live.current = { tool, writeSwitch, text, ranges };
  // The callbacks are read through a ref: the surface is wired once, so a render mid-stroke
  // (the pane's, the clock's) never cuts a stroke short.
  const calls = useRef(null);
  calls.current = { onRange, onErase, onPenSeen };
  useEffect(() => {
    const root = textRef.current;
    if (!root) return undefined;
    return attachCaseSurface(root, wetRef.current, {
      policy,
      state: () => ({ ...live.current, penEnabled: false, scroller: scrollRef.current }),
      onRange: (r) => calls.current.onRange(r),
      onErase: (ids) => calls.current.onErase(ids),
      onMarkTap: (id, rect) => setMarkBar({ id, rect }),
      onPicked: (r) => setPicked(r || null),
      onPenSeen: () => { setWriteSwitch(false); calls.current.onPenSeen(); },
      pen: null,
    });
  }, [policy]);

  const [picked, setPicked] = useState(null);

  const offersSwitch = coarse && !penSeen;
  const tools = (
    <CaseTools
      layout={phone ? 'bar' : 'rail'}
      tool={tool}
      onTool={setTool}
      penReady={false}
      penColor={penColor}
      rangeColor={rangeColor}
      onColor={onColor}
      canUndo={canUndo}
      canRedo={canRedo}
      onUndo={onUndo}
      onRedo={onRedo}
      onClear={onClear}
      writeSwitch={offersSwitch ? { on: writeSwitch, onToggle: () => setWriteSwitch((v) => !v) } : null}
    />
  );

  const sheet = (
    <div
      ref={dialogRef}
      className={`vmx-case-sheet${phone ? ' is-phone' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      data-vmx-modal="true"
      tabIndex={-1}
    >
      <header className="vmx-case-sheet-head">
        <button ref={backRef} type="button" className="vmx-case-back" onClick={close} aria-label="กลับไปที่คำถาม">
          <NavIcon name="back" size={20} />
          <span className="vmx-case-back-label">กลับไปที่คำถาม</span>
        </button>
        <h2 className="vmx-case-sheet-title" id={titleId}>{title || 'Reading Passage'}</h2>
        {clockDeadline ? <span className="vmx-case-sheet-clock"><ExamClock deadline={clockDeadline} /></span> : null}
      </header>
      <div ref={scrollRef} className="vmx-case-sheet-scroll">
        <div className={`vmx-case-sheet-col is-${writeSwitch ? 'writing' : 'reading'}`}>
          <div className={`vmx-case-surface is-sheet is-${tool}`}>
            <CaseText ref={textRef} text={text} ranges={ranges} labelledBy={titleId} />
            <div ref={wetRef} className="vmx-case-wet" aria-hidden="true" />
          </div>
          {stemBody ? (
            <section className="vmx-case-part" aria-label="ข้อมูลในข้อนี้">
              <p className="vmx-case-part-label">ในข้อนี้</p>
              <div className="vmx-case-part-body"><RichBlocks text={stemBody} /></div>
            </section>
          ) : null}
          {figure?.src ? <div className="vmx-case-figure"><ZoomableImage src={figure.src} alt={figure.alt} caption={figure.caption} maxHeight={420} /></div> : null}
        </div>
      </div>
      {ask ? (
        <button
          type="button"
          className={`vmx-case-ask${askOpen ? ' is-open' : ''}`}
          aria-expanded={askOpen}
          onClick={() => setAskOpen((v) => !v)}
        >
          <span className="vmx-case-ask-label">คำถาม</span>
          <span className="vmx-case-ask-text">{ask}</span>
        </button>
      ) : null}
      {tools}
      {picked && <PickBar rect={picked.rect} onPick={() => { onRange(picked); setPicked(null); window.getSelection?.().removeAllRanges(); }} onClose={() => setPicked(null)} />}
      {markBar && (
        <MarkBar
          rect={markBar.rect}
          onColor={(c) => { onRecolor(markBar.id, c); setMarkBar(null); }}
          onRemove={() => { onErase([markBar.id]); setMarkBar(null); }}
          onClose={() => setMarkBar(null)}
        />
      )}
      {toast && (
        <div className="vmx-case-toast is-sheet" role="status">
          <span>ล้างแล้ว {toast.n} รอย</span>
          <button type="button" className="vmx-case-toast-undo" onClick={onUndoClear} aria-label="ย้อนกลับการล้างทั้งหมด">ย้อนกลับ</button>
        </div>
      )}
    </div>
  );
  return typeof document === 'undefined' ? sheet : createPortal(sheet, document.body);
}
