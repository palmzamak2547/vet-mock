import { useState, useRef, useEffect, useMemo, useId, useCallback } from 'react';
import NavIcon from '../NavIcon.jsx';
import CaseText from './CaseText.jsx';
import { hasTable } from '../../lib/rich-blocks.js';
import { readStoredJson } from '../../lib/stored-json.js';
import { createHandPolicy } from '../../lib/handwriting-pad.js';
import {
  readCaseMarks, writeCaseMarks, resolveRanges, makeRange, applyOp, createHistory,
  PEN_COLORS, newMarkId, penInk,
} from '../../lib/case-marks.js';

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

// Undo is per case and kept for the page's life, so it survives the card moving to the next part.
const HISTORIES = new Map();

// What a hand needs, loaded once for the page: the pane asks for it as it draws, and the sheet's
// opening waits for it, so the reading place is always measured, however slow the network.
let handLoad = null;
let handReady = null;
const handNow = () => handReady;
const loadHand = () => {
  if (!handLoad) {
    handLoad = Promise.all([import('../../lib/ink/case-hand.js'), import('./CaseTools.jsx')])
      .then(([m, tools]) => { handReady = { ...m, Tools: tools.default, MarkBar: tools.MarkBar, PickBar: tools.PickBar }; return handReady; });
    handLoad.catch(() => { handLoad = null; });
  }
  return handLoad;
};
const historyFor = (key) => {
  if (!HISTORIES.has(key)) HISTORIES.set(key, createHistory());
  return HISTORIES.get(key);
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
  const [penColor, setPenColor] = useState(PEN_COLORS[0].id);
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
  const marksRef = useRef(state);
  marksRef.current = state;
  const history = state.key ? historyFor(state.key) : null;
  const [, bump] = useState(0);

  // A record that could not be read is never written over: marks made then live in memory only.
  const save = (cur, marks) => {
    const s = storage();
    if (!cur.ok || !s || !writeCaseMarks(s, cur.key, marks)) setSaveFailed(true);
  };
  // Any other change ends a clear's way back: its marks may be back already, or meant to stay gone.
  const toastRef = useRef(null);
  const commit = useCallback((op, { record = true, fromToast = false } = {}) => {
    const cur = marksRef.current;
    if (!cur.key) return;
    if (!fromToast) dropToast();
    const marks = applyOp(cur.marks, op);
    const next = { ...cur, marks };
    marksRef.current = next;
    setState(next);
    save(cur, marks);
    if (record) historyFor(cur.key).push(op);
    bump((n) => n + 1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const replaceMarks = useCallback((marks) => {
    const cur = marksRef.current;
    if (!cur.key || !marks) return;
    dropToast();
    const next = { ...cur, marks };
    marksRef.current = next;
    setState(next);
    save(cur, marks);
    bump((n) => n + 1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const undo = () => replaceMarks(history?.undo(marksRef.current.marks));
  const redo = () => replaceMarks(history?.redo(marksRef.current.marks));

  const { shown: ranges } = useMemo(() => resolveRanges(text || '', state.marks), [text, state.marks]);
  const strokes = useMemo(() => state.marks.filter((m) => m.kind === 'px'), [state.marks]);
  const rangesRef = useRef(ranges);
  rangesRef.current = ranges;

  const addRange = useCallback((range, color) => {
    // A range already wholly marked adds nothing (a tap that ran a little long would stack a hidden copy).
    if (rangesRef.current.some((m) => m.start <= range.start && m.end >= range.end)) return;
    commit({ add: [makeRange(text || '', range, color)], remove: [] });
  }, [commit, text]);
  const erase = useCallback((ids) => {
    const gone = new Set(ids);
    commit({ add: [], remove: marksRef.current.marks.filter((m) => gone.has(m.id)) });
  }, [commit]);

  // ── clear all, with a way back ──
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(0);
  toastRef.current = toast;
  function dropToast() {
    clearTimeout(toastTimer.current);
    if (toastRef.current) { toastRef.current = null; setToast(null); }
  }
  // Clear removes what this view shows: the marks of another stage of the case, unseen here, stay. The
  // sheet clears its highlights only, since it does not show the pane's pen strokes.
  const clearAll = ({ strokesToo = true } = {}) => {
    const cur = marksRef.current;
    const visible = new Set([...rangesRef.current.map((m) => m.id), ...(strokesToo ? strokes.map((m) => m.id) : [])]);
    const removed = cur.marks.filter((m) => visible.has(m.id));
    if (!removed.length) return;
    commit({ add: [], remove: removed });
    const t = { key: cur.key, removed, n: removed.length };
    toastRef.current = t;
    setToast(t);
    toastTimer.current = setTimeout(() => { toastRef.current = null; setToast(null); }, 8000);
  };
  const undoClear = () => {
    const t = toastRef.current;
    dropToast();
    if (!t) return;
    const h = handRef.current;
    if (!h) return;
    if (t.key === marksRef.current.key) {
      const op = h.restoreOp(marksRef.current.marks, t.removed);
      if (op) commit(op, { fromToast: true });
      return;
    }
    // The card moved on to another case: the marks go back to the case they came from.
    const s = storage();
    if (s) h.restoreElsewhere(s, t.key, t.removed, { readStoredJson, writeCaseMarks, applyOp });
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // ── a tap on a highlight: its colour, or remove it ──
  const [markBar, setMarkBar] = useState(null);
  const recolor = (id, color) => {
    const m = marksRef.current.marks.find((x) => x.id === id);
    setMarkBar(null);
    if (!m || m.color === color) return;
    commit({ add: [{ ...m, color, id: newMarkId() }], remove: [m] });
  };

  // ── the hand on the pane ──
  const policy = useMemo(() => createHandPolicy(storage()), []);
  const [penSeen, setPenSeen] = useState(policy.penSeen);
  const surfaceRef = useRef(null);
  const textRef = useRef(null);
  const wetRef = useRef(null);
  const canvasRef = useRef(null);
  const live = useRef({ tool, penColor, rangeColor, phone, text, strokes });
  live.current = { tool, penColor, rangeColor, phone, text, strokes };

  // What a hand needs to mark (ink/case-hand.js) loads with the case, after the pane has drawn:
  // nothing of it is in the exam's own chunk.
  const [hand, setHand] = useState(null);
  const handRef = useRef(null);
  handRef.current = hand;
  useEffect(() => {
    let alive = true;
    loadHand().then((h) => { if (alive) setHand(h); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  // Pen strokes on the pane's canvas, as today: pixels in the text box.
  const redraw = useCallback(() => {
    handRef.current?.drawPixelStrokes(canvasRef.current, surfaceRef.current, live.current.strokes);
  }, []);
  useEffect(() => {
    if (!open || !hand) return undefined;
    redraw();
    const box = surfaceRef.current;
    if (!box || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(redraw);
    ro.observe(box);
    return () => ro.disconnect();
  }, [open, hand, strokes, redraw]);

  useEffect(() => {
    const root = textRef.current;
    const box = surfaceRef.current;
    if (!open || !hand || !root || !box) return undefined;
    return hand.attachCaseSurface(root, wetRef.current, {
      policy,
      state: () => ({
        tool: live.current.phone ? 'none' : live.current.tool,
        writeSwitch: false,
        penEnabled: true,
        text: live.current.text || '',
        ranges: rangesRef.current,
        scroller: hand.scrollerOf(box) || window,
      }),
      onRange: (range) => addRange(range, live.current.rangeColor),
      onErase: erase,
      onMarkTap: (id, rect) => setMarkBar({ id, rect }),
      onPicked: (r) => setPicked(r || null),
      onPenSeen: () => setPenSeen(true),
      pen: hand.pixelPen({
        box,
        canvas: () => canvasRef.current,
        strokes: () => live.current.strokes,
        color: () => penInk(live.current.penColor),
        commit: (stroke) => commit({ add: [stroke], remove: [] }),
        redraw,
        newId: newMarkId,
      }),
    });
  }, [open, hand, policy, addRange, erase, commit, redraw]);

  // A mouse selection with the highlighter in hand is a highlight. A finger's long press keeps the
  // system's copy and look-up, and offers ไฮไลต์ beside them.
  const [picked, setPicked] = useState(null);

  // ── the sheet ──
  const [Sheet, setSheet] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetFailed, setSheetFailed] = useState(false);
  const opening = useRef(null);
  const topRef = useRef(null);
  const questionRef = useRef(questionKey);
  questionRef.current = questionKey;
  const entry = useRef({});
  const openSheet = () => {
    setSheetFailed(false);
    const scrollY = window.scrollY;
    const asked = questionRef.current;
    // The sheet's history entry is made in the tap itself: an entry pushed later, without the tap's
    // activation, is one WebKit's Back may skip. Back then closes the sheet (CaseSheet).
    const e = { on: false };
    try { window.history.pushState({ ...window.history.state, vmxCaseSheet: 1 }, ''); e.on = true; } catch { /* no history */ }
    entry.current = e;
    Promise.all([loadHand(), Sheet ? null : import('./CaseSheet.jsx')])
      .then(([h, m]) => {
        if (m) setSheet(() => m.default);
        // The card moved on while the sheet was loading: it opens for nothing.
        if (questionRef.current !== asked) { h.dropEntry(e); return; }
        // Measured once both have arrived and nothing has moved: the first line under the pane's top bar.
        const root = textRef.current;
        opening.current = { place: root ? h.readingPlace(root, h.paneTop(root, topRef.current)) : null, scrollY };
        setSheetOpen(true);
      })
      .catch(() => { setSheetFailed(true); handNow()?.dropEntry(e); });
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
  // its ask as they are now, never a sheet that changed what it was asking.
  useEffect(() => { setSheetOpen(false); }, [questionKey, where.passage.slice(0, 200), where.title]); // eslint-disable-line react-hooks/exhaustive-deps

  const titleId = useId();
  const isData = hasTable(text || '');
  const canMark = !phone;
  // The row keeps its height while its buttons load, so the text under it never moves.
  const Tools = hand?.Tools;
  const tools = canMark && open && !Tools ? <div className="vmx-case-tools is-row is-waiting" aria-hidden="true" /> : canMark && open ? (
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
      onClear={() => clearAll()}
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
          <button type="button" className="vmx-case-toast-undo" onClick={undoClear}>ย้อนกลับ</button>
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
          onClear={() => clearAll({ strokesToo: false })}
          toast={toast}
          onUndoClear={undoClear}
        />
      )}
    </div>
  );
}
