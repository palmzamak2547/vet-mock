import { useState, useRef, useEffect, useMemo, useId, useCallback } from 'react';
import NavIcon from '../NavIcon.jsx';
import CaseText from './CaseText.jsx';
import { hasTable } from '../../lib/rich-blocks.js';
import { createHandPolicy } from '../../lib/handwriting-pad.js';
import { importFresh } from '../../lib/chunk-error.js';
import { readCaseMarks, resolveRanges } from '../../lib/case-marks.js';
import { pushEntry, dropEntry } from '../../lib/case-entry.js';

// ============================================================
// CasePane — a case beside its question (the case reader)
// ============================================================
// The pane draws the passage with the typeset blocks (CaseText), holds the
// student's marks on it and their undo history, and opens the case as a
// full-screen reading sheet (CaseSheet, loaded on the first tap).
//
// Marks belong to the account that made them: they are kept under
// vmx-case-<owner|guest>-<case> (case-marks.js), never under the passage
// alone, so the next account on a shared device does not see them. The marks
// saved before this release under vmx-pass-<hash> are adopted once by the
// account signed in when a case is first shown after it; those old keys are
// never written or removed.
//
// Pen strokes are what they were: pixels from the top left of the passage's
// text box, drawn on a canvas that now sits inside the text and scrolls with
// it. They are not shown on the sheet; slice 3 anchors them to the words.
// ============================================================

// What a hand needs, loaded once for the page: the pane asks for it as it draws, and the sheet's
// opening waits for it, so the reading place is always measured, however slow the network. It holds
// making marks and their undo (case-ops.js), kept per case and text for the page's life. A download
// that fails is asked for again under a fresh address (importFresh), and a later call tries anew.
let handLoad = null;
let handReady = null;
const handNow = () => handReady;
const loadHand = () => {
  if (!handLoad) {
    handLoad = Promise.all([importFresh(() => import('../../lib/ink/case-hand.js')), importFresh(() => import('./CaseTools.jsx'))])
      .then(([m, tools]) => { handReady = { ...m, Tools: tools.default, MarkBar: tools.MarkBar, PickBar: tools.PickBar }; return handReady; });
    handLoad.catch(() => { handLoad = null; });
  }
  return handLoad;
};

const storage = () => {
  try { return window.localStorage; } catch { return null; }
};

function useMedia(query) {
  const read = () => { try { return window.matchMedia(query).matches; } catch { return false; } };
  const [on, setOn] = useState(read);
  useEffect(() => {
    let mq;
    try { mq = window.matchMedia(query); } catch { return undefined; }
    const change = () => setOn(mq.matches);
    change();
    mq.addEventListener?.('change', change);
    return () => mq.removeEventListener?.('change', change);
  }, [query]);
  return on;
}

export default function CasePane({
  text, title, subject = '', ownerId = null, defaultOpen = true, openSignal = 0,
  ask = '', stemBody = '', figure = null, clockDeadline = null, questionKey = '',
}) {
  const [open, setOpen] = useState(defaultOpen);
  // Another passage is another piece of data: it arrives open, whatever the one before it was left as.
  // (A passage shared by two questions in a row keeps the state it was given.)
  useEffect(() => { setOpen(defaultOpen); setTool('pen'); }, [text, defaultOpen]);
  // The card's "back to the passage" button opens a passage the student had hidden, in the same render
  // as the tap, never in an effect a render later (tests/unit/passage-opens-with-the-tap.test.mjs).
  const [seenSignal, setSeenSignal] = useState(openSignal);
  if (openSignal !== seenSignal) {
    setSeenSignal(openSignal);
    if (openSignal) setOpen(true);
  }

  const phone = useMedia('(max-width: 767px)');
  const coarse = useMedia('(pointer: coarse)');
  const [tool, setTool] = useState('pen');
  const [penColor, setPenColor] = useState('ink');
  const [rangeColor, setRangeColor] = useState('lemon');
  const onColor = (which, id) => (which === 'pen' ? setPenColor(id) : setRangeColor(id));

  // ── the marks of this account on this case ──
  const where = useMemo(() => ({ ownerId: ownerId || null, subject, title: title || '', passage: text || '' }), [ownerId, subject, title, text]);
  const [state, setState] = useState({ key: null, marks: [], ok: false });
  // Marks that could not be saved stay on screen for this visit, and the pane says so once.
  const [saveFailed, setSaveFailed] = useState(false);
  const [loadFor, setLoadFor] = useState(null);
  // A case with no record yet is read again the moment the code that adopts old marks has loaded.
  const handLoaded = handNow();
  const sameWhere = loadFor && !(state.pending && handLoaded) && loadFor.ownerId === where.ownerId && loadFor.subject === where.subject
    && loadFor.title === where.title && loadFor.passage.slice(0, 200) === where.passage.slice(0, 200);
  if (!sameWhere) {
    // Read during render, so the first paint of a case already holds its marks.
    const s = storage();
    const got = s ? readCaseMarks(s, where, handLoaded?.adoptLegacy) : { ok: false, key: null };
    setLoadFor(where);
    setState({ key: got.key, marks: got.ok ? got.marks : [], ok: Boolean(got.ok), pending: Boolean(got.pending) });
    setSaveFailed(!got.ok && Boolean(got.key));
  }
  // Undo per case and per text: a stage of a case undoes only what was done in its own view.
  const history = state.key && handLoaded ? handLoaded.historyFor(state.key, text || '') : null;
  const [, setBump] = useState(0);
  const { shown: ranges } = useMemo(() => resolveRanges(text || '', state.marks), [text, state.marks]);
  const strokes = useMemo(() => state.marks.filter((m) => m.kind === 'px'), [state.marks]);
  const [toast, setToastState] = useState(null);

  // What the pane's actions on its marks read and write (ink/case-hand.js, loaded with the hand). One object
  // for the pane's life, its fields brought up to date on every render.
  const p = useRef({ toast: null, timer: 0 }).current;
  Object.assign(p, {
    cur: state, text: text || '', ranges, strokes, storage,
    set: (next) => { p.cur = next; setState(next); },
    saveFailed: () => setSaveFailed(true),
    bump: () => setBump((n) => n + 1),
    setToast: (t) => { p.toast = t; setToastState(t); },
  });
  const act = (name) => (...args) => handNow()?.[name](p, ...args);
  const addRange = act('addRange');
  const erase = act('eraseIds');
  const undo = () => act('replaceMarks')(history?.undo(p.cur.marks));
  const redo = () => act('replaceMarks')(history?.redo(p.cur.marks));
  const clearAll = act('clearAll');
  const undoClear = act('undoClear');
  useEffect(() => () => clearTimeout(p.timer), []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── a tap on a highlight: its colour, or remove it ──
  const [markBar, setMarkBar] = useState(null);
  const recolor = (id, color) => { setMarkBar(null); act('recolor')(id, color); };

  // ── the hand on the pane ──
  const policy = useMemo(() => createHandPolicy(storage()), []);
  const [penSeen, setPenSeen] = useState(policy.penSeen);
  const surfaceRef = useRef(null);
  const textRef = useRef(null);
  const wetRef = useRef(null);
  const canvasRef = useRef(null);
  Object.assign(p, { tool, penColor, rangeColor, phone, penSeen: () => setPenSeen(true) });

  // What a hand needs to mark (ink/case-hand.js) loads with the case, after the pane has drawn:
  // nothing of it is in the exam's own chunk. Whichever surface loads it (the pane, or the sheet's
  // opening after a failed first try) hands it to the pane, so its tools and the old marks appear.
  // A download that failed twice says so in the tools' place and is tried again on a tap.
  const [hand, setHand] = useState(null);
  const [handFailed, setHandFailed] = useState(false);
  const handRef = useRef(null);
  handRef.current = hand;
  const getHand = useCallback(() => loadHand().then((h) => { setHandFailed(false); setHand(h); return h; }), []);
  const tryHand = useCallback(() => { getHand().catch(() => setHandFailed(true)); }, [getHand]);
  useEffect(tryHand, [tryHand]);

  // Pen strokes on the pane's canvas, as today (pixels in the text box), and the hand on the pane's text:
  // both wired by ink/case-hand.js, from what `p` holds now. The surface is wired once per opening, so a
  // render mid-stroke never cuts a stroke short.
  useEffect(() => (open && hand ? hand.watchStrokes(p, surfaceRef.current, canvasRef.current) : undefined), [open, hand, strokes]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => (open && hand && textRef.current
    ? hand.attachPane(p, textRef.current, wetRef.current, surfaceRef.current, canvasRef.current, policy)
    : undefined), [open, hand, policy]); // eslint-disable-line react-hooks/exhaustive-deps

  // A mouse selection with the highlighter in hand is a highlight. A finger's long press keeps the
  // system's copy and look-up, and offers ไฮไลต์ beside them.
  const [picked, setPicked] = useState(null);
  Object.assign(p, { markTap: setMarkBar, picked: setPicked });

  // ── the sheet ──
  const [Sheet, setSheet] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetFailed, setSheetFailed] = useState(false);
  const opening = useRef(null);
  const topRef = useRef(null);
  const questionRef = useRef(questionKey);
  questionRef.current = questionKey;
  const entry = useRef({});
  const sheetOpenRef = useRef(false);
  sheetOpenRef.current = sheetOpen;
  const openSheet = () => {
    // A second tap while the first is loading opens nothing more, and pushes no second entry.
    if (entry.current.wait) return;
    setSheetFailed(false);
    const scrollY = window.scrollY;
    const asked = questionRef.current;
    // The sheet's history entry is made in the tap itself (lib/case-entry.js). Back then closes the sheet.
    const e = pushEntry();
    e.wait = true;
    entry.current = e;
    Promise.all([getHand(), Sheet ? null : importFresh(() => import('./CaseSheet.jsx'))])
      .then(([h, m]) => {
        e.wait = false;
        if (m) setSheet(() => m.default);
        // Back pressed while it loaded took the entry already: the sheet stays shut.
        if (e.on && !window.history.state?.vmxCaseSheet) { e.on = false; return; }
        // The card moved on while the sheet was loading: it opens for nothing.
        if (questionRef.current !== asked) { dropEntry(e); return; }
        // Measured once both have arrived and nothing has moved: the first line under the pane's top bar.
        const root = textRef.current;
        opening.current = { place: root ? h.readingPlace(root, h.paneTop(root, topRef.current)) : null, scrollY };
        setSheetOpen(true);
      })
      .catch(() => { e.wait = false; setSheetFailed(true); dropEntry(e); });
  };
  const closeSheet = (place) => {
    setSheetOpen(false);
    const back = opening.current;
    // After the pane is drawn again: the page where it was, the pane at the character the sheet showed on top.
    requestAnimationFrame(() => {
      if (back) window.scrollTo(0, back.scrollY);
      const root = textRef.current;
      const h = handRef.current;
      const sc = h && root ? h.scrollerOf(root) : null;
      if (sc && place) sc.scrollTop += h.placeDelta(root, place, h.paneTop(root, topRef.current));
    });
  };
  // Another question under the sheet closes it, whatever the reason (a timed paper moving on, a
  // passage shared by several questions, another case): the student sees the card, its notices and
  // its ask as they are now, never a sheet that changed what it was asking. The page goes to its top,
  // where a paper says why the card moved on, once the sheet's entry is gone.
  useEffect(() => {
    if (sheetOpenRef.current) entry.current.then = () => { const top = () => window.scrollTo(0, 0); top(); requestAnimationFrame(top); };
    setSheetOpen(false);
  }, [questionKey, where.passage.slice(0, 200), where.title]); // eslint-disable-line react-hooks/exhaustive-deps

  const titleId = useId();
  const isData = hasTable(text || '');
  const canMark = !phone;
  // The row keeps its height while its buttons load, so the text under it never moves.
  const Tools = hand?.Tools;
  const tools = canMark && open && !Tools ? (handFailed
    ? <button type="button" className="vmx-case-tools is-row is-retry" onClick={tryHand}>โหลดเครื่องมือเขียนไม่สำเร็จ แตะเพื่อลองอีกครั้ง</button>
    : <div className="vmx-case-tools is-row is-waiting" aria-hidden="true" />) : canMark && open ? (
    <Tools
      layout="row"
      tool={tool}
      onTool={setTool}
      penColor={penColor}
      rangeColor={rangeColor}
      onColor={onColor}
      canUndo={Boolean(history?.canUndo)}
      canRedo={Boolean(history?.canRedo)}
      onUndo={undo}
      onRedo={redo}
      onClear={() => clearAll(true)}
    />
  ) : null;

  return (
    <div className="vmx-case-pane">
      {/* The title, อ่านเต็มจอ and the tools stay at the top of the pane while the case scrolls under them. */}
      <div ref={topRef} className="vmx-case-top">
      <div className="vmx-case-head">
        <button type="button" className="vmx-case-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {/* The title as its writer typed it, at the size of the text it names. */}
          <span className="vmx-case-title" id={titleId}>{title || 'Reading Passage'}</span>
          <span className="vmx-case-toggle-word">{open ? '▾ ซ่อน' : isData ? '▸ แสดงตาราง' : '▸ ดู passage'}</span>
        </button>
        <button type="button" className="vmx-case-full" onClick={openSheet} aria-label="อ่านเต็มจอ" title="อ่านเต็มจอ">
          <NavIcon name="fullscreen" size={20} />
          <span className="vmx-case-full-label">อ่านเต็มจอ</span>
        </button>
      </div>
      {sheetFailed && <p className="vmx-case-note" role="status">เปิดหน้าอ่านเต็มจอไม่สำเร็จ ลองแตะอีกครั้ง</p>}
      {saveFailed && <p className="vmx-case-note" role="status">บันทึกรอยบนเคสนี้ลงเครื่องไม่ได้ รอยที่เขียนตอนนี้จะหายเมื่อปิดหน้า</p>}
      {tools}
      </div>
      {open && (
        <div
          ref={surfaceRef}
          className={`vmx-case-surface is-${canMark ? tool : 'read'}`}
        >
          <CaseText ref={textRef} text={text || ''} ranges={ranges} labelledBy={titleId} />
          <div ref={wetRef} className="vmx-case-wet" aria-hidden="true" />
          <canvas ref={canvasRef} className="vmx-case-ink" aria-hidden="true" />
        </div>
      )}
      {picked && hand && <hand.PickBar rect={picked.rect} onPick={() => { addRange(picked, rangeColor); setPicked(null); window.getSelection?.().removeAllRanges(); }} onClose={() => setPicked(null)} />}
      {markBar && hand && (
        <hand.MarkBar
          rect={markBar.rect}
          onColor={(c) => recolor(markBar.id, c)}
          onRemove={() => { erase([markBar.id]); setMarkBar(null); }}
          onClose={() => setMarkBar(null)}
        />
      )}
      {toast && (
        <div className="vmx-case-toast" role="status">
          <span>ล้างแล้ว {toast.n} รอย</span>
          <button type="button" className="vmx-case-toast-undo" onClick={undoClear} aria-label="ย้อนกลับการล้างทั้งหมด">ย้อนกลับ</button>
        </div>
      )}
      {Sheet && sheetOpen && (
        <Sheet
          text={text || ''}
          title={title || ''}
          ranges={ranges}
          ask={ask}
          stemBody={stemBody}
          figure={figure}
          clockDeadline={clockDeadline}
          place={opening.current?.place || null}
          onClose={closeSheet}
          entry={entry.current}
          hand={handNow()}
          policy={policy}
          penSeen={penSeen}
          coarse={coarse}
          phone={phone}
          rangeColor={rangeColor}
          penColor={penColor}
          onColor={onColor}
          onRange={(r) => addRange(r, rangeColor)}
          onErase={erase}
          onRecolor={recolor}
          onPenSeen={() => setPenSeen(true)}
          canUndo={Boolean(history?.canUndo)}
          canRedo={Boolean(history?.canRedo)}
          onUndo={undo}
          onRedo={redo}
          onClear={() => clearAll(false)}
          toast={toast}
          onUndoClear={undoClear}
        />
      )}
    </div>
  );
}
