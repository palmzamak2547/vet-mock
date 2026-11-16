// ============================================================
// ink/case-hand.js — the hand on a case surface (pane and sheet)
// ============================================================
// The case reader design, sections 2 and 3, slice 1. Framework-free: the
// pointer loop calls back into React only when a mark is committed or erased,
// never per pointer move. Slice 2 moves the PDF reader's pointer loop into
// src/lib/ink/engine.js beside this file and folds this one into it; until
// then this holds only what the highlighter, the eraser of ranges and the hand
// model need, and hands pen strokes to the pane's own canvas (`pen`).
//
// The hand (createHandPolicy, handwriting-pad.js): a pen marks with the tool
// in hand and a finger moves the page with the browser's own scrolling. With
// the finger switch on, one finger marks and two fingers scroll; a stroke
// that a second finger joins, at any moment before it is committed, is dropped.
// ============================================================
import { quoteAt, legacyPassageHash, ADOPT_KEY, writeCaseMarks } from '../case-marks.js';
import { applyOp, historyFor, makeRange, newMarkId, penInk } from '../case-ops.js';
import { readStoredJson } from '../stored-json.js';

export { applyOp, historyFor, makeRange, newMarkId, penInk } from '../case-ops.js';

// ── the word snap ───────────────────────────────────────────
// Thai has no spaces: word boundaries come from the segmenter. A browser
// without Intl.Segmenter falls back to runs of letters and digits.
let segmenter;
function words(text, from, to) {
  if (segmenter === undefined) {
    try { segmenter = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('th', { granularity: 'word' }) : null; } catch { segmenter = null; }
  }
  const a = Math.max(0, from);
  const piece = text.slice(a, to);
  const out = [];
  if (segmenter) {
    for (const s of segmenter.segment(piece)) out.push({ start: a + s.index, end: a + s.index + s.segment.length, word: Boolean(s.isWordLike) });
  } else {
    const re = /[\p{L}\p{M}\p{N}]+|[^\p{L}\p{M}\p{N}]+/gu;
    for (let m = re.exec(piece); m; m = re.exec(piece)) out.push({ start: a + m.index, end: a + m.index + m[0].length, word: /[\p{L}\p{N}]/u.test(m[0]) });
  }
  return out;
}

/**
 * A drag from offset `a` to offset `b` (either order) widened to whole words:
 * a word the drag starts or ends inside is taken whole, never half a syllable.
 * Punctuation the drag covered is kept (a closing bracket is part of what was
 * marked); space at either edge is left out. Null when the drag covers no word.
 */
export function snapRange(text, a, b) {
  const str = String(text ?? '');
  const lo = Math.max(0, Math.min(a, b));
  let hi = Math.min(str.length, Math.max(a, b));
  if (hi === lo) hi = Math.min(str.length, lo + 1);
  if (hi <= lo) return null;
  // Only the words at the two edges are segmented (64 characters each side of each end), so a drag
  // across a whole long case costs what a short one does.
  const over = (s) => s.end > lo && s.start < hi;
  let first;
  let last;
  if (hi - lo <= 128) {
    const segs = words(str, lo - 64, hi + 64).filter(over);
    if (!segs.some((x) => x.word)) return null;
    [first, last] = [segs[0], segs[segs.length - 1]];
  } else {
    first = words(str, lo - 64, lo + 64).find(over);
    last = words(str, hi - 64, hi + 64).filter(over).pop();
    if (!first || !last) return null;
  }
  let start = first.word ? first.start : lo;
  let end = last.word ? last.end : hi;
  while (start < end && /\s/.test(str[start])) start++;
  while (end > start && /\s/.test(str[end - 1])) end--;
  return end > start ? { start, end } : null;
}

// ── the DOM half: offsets of points, the reading place ──────

/** The runs of a drawn passage, in reading order. */
export const runsOf = (root) => (root ? [...root.querySelectorAll('[data-off]')] : []);

/**
 * The passage offset of a DOM point (node, offset). A point outside every run
 * (in a table, between blocks) moves to the nearest edge of prose: a start to
 * the next run's start, an end to the end of the run before it.
 */
export function offsetOfPoint(root, node, off, isEnd = false) {
  let passed = null;
  for (const run of runsOf(root)) {
    const from = Number(run.dataset.off);
    const whole = document.createRange();
    whole.selectNodeContents(run);
    let where;
    try { where = whole.comparePoint(node, off); } catch { return null; }
    if (where < 0) return isEnd ? (passed ?? from) : from;
    if (where === 0) {
      const head = document.createRange();
      head.selectNodeContents(run);
      head.setEnd(node, off);
      return from + head.toString().length;
    }
    passed = from + whole.toString().length;
  }
  return passed;
}

/** The caret under a client point, as { node, offset }, in every engine that has one. */
export function caretAt(x, y) {
  if (typeof document.caretPositionFromPoint === 'function') {
    const p = document.caretPositionFromPoint(x, y);
    return p ? { node: p.offsetNode, offset: p.offset } : null;
  }
  if (typeof document.caretRangeFromPoint === 'function') {
    const r = document.caretRangeFromPoint(x, y);
    return r ? { node: r.startContainer, offset: r.startOffset } : null;
  }
  return null;
}

/** The passage offset under a client point, or null when the point is not over a run's text. */
export function offsetAt(root, x, y) {
  const hit = document.elementFromPoint(x, y);
  const run = hit?.closest?.('[data-off]');
  if (!run || !root.contains(run)) return null;
  const caret = caretAt(x, y);
  if (!caret || !run.contains(caret.node)) return Number(run.dataset.off);
  return offsetOfPoint(root, caret.node, caret.offset);
}

/** A DOM range over passage offsets [start, end), clipped to the runs. */
export function domRange(root, start, end) {
  let startPoint = null;
  let endPoint = null;
  for (const run of runsOf(root)) {
    const from = Number(run.dataset.off);
    const walker = document.createTreeWalker(run, NodeFilter.SHOW_TEXT);
    let at = from;
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const len = n.nodeValue.length;
      if (!startPoint && start < at + len && start >= at) startPoint = [n, start - at];
      if (!startPoint && start < at) startPoint = [n, 0];
      if (startPoint && end <= at + len && end >= at) { endPoint = [n, end - at]; break; }
      at += len;
    }
    if (endPoint) break;
  }
  if (!startPoint) return null;
  const r = document.createRange();
  r.setStart(...startPoint);
  if (endPoint) r.setEnd(...endPoint);
  else r.collapse(true);
  return r;
}

/** The box of the character at `off`, or null. */
function charBox(root, off) {
  const r = domRange(root, off, off + 1);
  const rect = r?.getClientRects?.()[0] || r?.getBoundingClientRect?.();
  return rect && rect.height ? rect : null;
}

/**
 * The reading place at client height `top`: the first character whose line
 * reaches below `top`, and how far down its line `top` falls (a fraction of
 * the line). A character survives a reflow; a pixel scroll position does not.
 * Where `top` falls in a table or after the last line of prose, the place is
 * the nearest character, with how many of its lines lie between it and `top`
 * (a fraction below 0 or above 1), so the table stays where the reader had it.
 */
export function readingPlace(root, top) {
  const runs = runsOf(root);
  for (const run of runs) {
    const box = run.getBoundingClientRect();
    if (box.bottom <= top) continue;
    const from = Number(run.dataset.off);
    const len = run.textContent.length;
    // The first character of this run whose box ends below `top`: boxes grow down the run.
    let lo = 0;
    let hi = len - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const b = charBox(root, from + mid);
      if (b && b.bottom > top) hi = mid; else lo = mid + 1;
    }
    const off = from + lo;
    const b = charBox(root, off);
    const into = b ? Math.max(-40, Math.min(1, (top - b.top) / b.height)) : 0;
    return { off, into };
  }
  if (!runs.length) return null;
  const last = runs[runs.length - 1];
  const off = Number(last.dataset.off) + Math.max(0, last.textContent.length - 1);
  const b = charBox(root, off);
  return { off, into: b ? Math.min(40, Math.max(0, (top - b.top) / b.height)) : 0 };
}

/** How far a scroller must move so `place` sits at client height `top`. */
export function placeDelta(root, place, top) {
  if (!place) return 0;
  const b = charBox(root, place.off);
  if (!b) return 0;
  return b.top + place.into * b.height - top;
}

// ── the hand ────────────────────────────────────────────────
// A tap is short and still: under 250 ms and 8 px (a Pencil or a fingertip moves a few pixels as it lands).
const TAP_MS = 250;
const TAP_PX = 8;

/** The passage offset under a point inside the text column, or null outside it. */
export function offsetInColumn(root, x, y) {
  const box = root.getBoundingClientRect();
  if (x < box.left || x > box.right || y < box.top || y > box.bottom) return null;
  const caret = caretAt(x, y);
  if (!caret || !root.contains(caret.node)) return null;
  return offsetOfPoint(root, caret.node, caret.offset, true);
}

const isIOSStylus = (e) => e.changedTouches && e.changedTouches.length > 0
  && [...e.changedTouches].every((t) => t.touchType === 'stylus');

/**
 * Wires one surface. `root` is the element holding the passage runs, `wet` an
 * empty layer positioned over it for the live wash. Returns a detach function.
 *
 * opts:
 *   policy                 createHandPolicy()
 *   state()                { tool, writeSwitch, penEnabled, text, ranges, scroller }
 *   onRange({ start, end }) a highlight to add (already snapped to words)
 *   onErase(ids)           marks to remove, one gesture at a time
 *   onMarkTap(id, rect)    a tap on a highlight with the highlighter in hand
 *   onPenSeen()            the first pen on this device
 *   pen                    { down(pt), move(pts), up(), cancel(), hit(x, y) } in client points, or null
 */
export function attachCaseSurface(root, wet, opts) {
  let stroke = null;           // the one marking pointer
  const fingers = new Map();   // touch pointers while the finger switch is on
  let pan = null;
  let frame = 0;

  const clearWet = () => { if (wet) wet.replaceChildren(); };
  const paintWet = (range) => {
    if (!wet) return;
    const r = range && domRange(root, range.start, range.end);
    const rects = r ? [...r.getClientRects()].filter((b) => b.width > 0.5) : [];
    const base = wet.getBoundingClientRect();
    const kids = wet.children;
    for (let i = 0; i < rects.length; i++) {
      let d = kids[i];
      if (!d) { d = document.createElement('div'); d.className = 'vmx-case-wet-box'; wet.appendChild(d); }
      const b = rects[i];
      d.style.transform = `translate(${b.left - base.left}px, ${b.top - base.top}px)`;
      d.style.width = `${b.width}px`;
      d.style.height = `${b.height}px`;
    }
    while (wet.children.length > rects.length) wet.lastChild.remove();
  };

  // The mark under a point, judged by the character's own box: the caret sits between two characters,
  // so the right half of a mark's last character would otherwise miss it.
  const markAt = (x, y) => {
    let off = offsetInColumn(root, x, y);
    if (off == null) return null;
    const before = off > 0 ? charBox(root, off - 1) : null;
    if (before && x >= before.left && x <= before.right && y >= before.top && y <= before.bottom) off -= 1;
    const { ranges } = opts.state();
    const hit = (ranges || []).find((m) => off >= m.start && off < m.end);
    return hit || null;
  };

  const paint = () => {
    frame = 0;
    if (!stroke) return;
    const t0 = performance.now();
    if (stroke.tool === 'highlighter') {
      const b = offsetInColumn(root, stroke.x, stroke.y);
      stroke.b = b;
      paintWet(stroke.a != null && b != null ? snapRange(opts.state().text, stroke.a, b) : null);
    } else if (stroke.tool === 'eraser') {
      // Every few pixels along the path since the last frame, so a fast swipe does not skip a mark.
      const { px, py, x, y } = stroke;
      const steps = Math.max(1, Math.ceil(Math.hypot(x - px, y - py) / 4));
      for (let i = 1; i <= steps; i++) {
        const sx = px + ((x - px) * i) / steps;
        const sy = py + ((y - py) * i) / steps;
        const m = markAt(sx, sy);
        if (m && !stroke.hits.has(m.id)) {
          stroke.hits.add(m.id);
          root.querySelectorAll(`mark[data-mark="${CSS.escape(m.id)}"]`).forEach((el) => el.classList.add('is-erasing'));
        }
        for (const id of opts.pen?.hit?.(sx, sy) || []) stroke.hits.add(id);
      }
      stroke.px = x; stroke.py = y;
    }
    try { performance.measure('vmx-case-paint', { start: t0 }); } catch { /* measurement only */ }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };

  const end = (commit) => {
    const s = stroke;
    stroke = null;
    if (frame) { cancelAnimationFrame(frame); frame = 0; }
    root.style.touchAction = '';
    if (!s) return;
    try { root.releasePointerCapture?.(s.id); } catch { /* synthetic pointer */ }
    if (s.tool === 'pen') { if (commit) opts.pen?.up(); else opts.pen?.cancel(); return; }
    if (s.tool === 'eraser') {
      if (commit && s.hits.size) opts.onErase([...s.hits]);
      else root.querySelectorAll('mark.is-erasing').forEach((el) => el.classList.remove('is-erasing'));
      return;
    }
    clearWet();
    if (!commit) return;
    const moved = Math.hypot(s.x - s.x0, s.y - s.y0);
    const tap = moved < TAP_PX && performance.now() - s.t0 < TAP_MS;
    if (tap) {
      const m = markAt(s.x0, s.y0);
      if (m) {
        const el = root.querySelector(`mark[data-mark="${CSS.escape(m.id)}"]`);
        opts.onMarkTap?.(m.id, el?.getBoundingClientRect() || null);
      }
      return;
    }
    const b = offsetInColumn(root, s.x, s.y);
    if (s.a == null || b == null) return;   // a drag that leaves the column marks nothing
    const range = snapRange(opts.state().text, s.a, b);
    if (range) opts.onRange(range);
  };

  const onDown = (e) => {
    const st = opts.state();
    if (e.pointerType === 'touch' && st.writeSwitch && !opts.policy.penSeen) {
      fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (fingers.size >= 2) {
        // A second finger: the page moves. A stroke it joined at once was the start of a scroll.
        // A second finger, however late it lands, means the hand is scrolling: the stroke under way is dropped.
        if (stroke && stroke.pointerType === 'touch') end(false);
        pan = { y: midY() };
        return;
      }
    }
    if (stroke || !['pen', 'highlighter', 'eraser'].includes(st.tool)) return;
    const wasSeen = opts.policy.penSeen;
    const marks = opts.policy.marks(e.pointerType, { button: e.button, writeSwitch: st.writeSwitch });
    if (!wasSeen && opts.policy.penSeen) opts.onPenSeen?.();
    if (!marks) return;
    if (st.tool === 'pen' && (!st.penEnabled || !opts.pen)) return;
    e.preventDefault();
    try { root.setPointerCapture?.(e.pointerId); } catch { /* synthetic pointer */ }
    // What keeps a pen from scrolling is the touchstart below, which arrives after this pointerdown
    // and is cancelled for a stylus; this only holds the surface still for the rest of the stroke.
    if (e.pointerType === 'pen') root.style.touchAction = 'none';
    stroke = {
      id: e.pointerId, pointerType: e.pointerType, tool: st.tool, t0: performance.now(),
      x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, px: e.clientX, py: e.clientY,
      a: st.tool === 'highlighter' ? offsetInColumn(root, e.clientX, e.clientY) : null, hits: new Set(),
    };
    if (st.tool === 'pen') opts.pen.down({ x: e.clientX, y: e.clientY, p: e.pressure, type: e.pointerType });
    else schedule();
  };

  const midY = () => { let s = 0; for (const f of fingers.values()) s += f.y; return s / fingers.size; };

  const onMove = (e) => {
    if (fingers.has(e.pointerId)) {
      fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pan && fingers.size >= 2) {
        const y = midY();
        const sc = opts.state().scroller;
        if (sc === window || !sc) window.scrollBy(0, pan.y - y); else sc.scrollTop += pan.y - y;
        pan.y = y;
        return;
      }
    }
    if (!stroke || e.pointerId !== stroke.id) return;
    e.preventDefault();
    stroke.x = e.clientX;
    stroke.y = e.clientY;
    if (stroke.tool === 'pen') {
      const evs = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [];
      const pts = (evs.length ? evs : [e]).map((c) => ({ x: c.clientX, y: c.clientY, p: c.pressure }));
      opts.pen.move(pts);
      return;
    }
    schedule();
  };

  const onUp = (e) => {
    if (fingers.delete(e.pointerId) && fingers.size < 2) pan = null;
    if (stroke && e.pointerId === stroke.id) {
      if (stroke.tool !== 'pen') { stroke.x = e.clientX; stroke.y = e.clientY; if (stroke.tool === 'eraser') paint(); }
      end(true);
    }
  };
  const onCancel = (e) => {
    if (fingers.delete(e.pointerId) && fingers.size < 2) pan = null;
    if (stroke && e.pointerId === stroke.id) end(false);
  };

  // iPad: the Pencil never scrolls, and while it is down a resting palm cannot drag the page.
  const onTouch = (e) => {
    if (isIOSStylus(e) || (stroke && stroke.pointerType === 'pen')) e.preventDefault();
  };
  const onSelectStart = (e) => { if (stroke) e.preventDefault(); };
  // A mouse selection with the highlighter in hand is a highlight. A finger's long press keeps the
  // system's copy and look-up, and is offered ไฮไลต์ beside them (onPicked), once the selection settles.
  const onMouseUp = () => {
    const st = opts.state();
    if (st.tool !== 'highlighter') return;
    const r = selectedRange(root, st.text);
    if (!r) return;
    opts.onRange(r);
    window.getSelection?.().removeAllRanges();
  };
  const onTouchEnd = (e) => {
    // Every finger is off the glass: no finger is down, whatever its pointerup missed. A finger whose
    // capture a dropped stroke released can lift outside the text, and its stale entry would make the
    // next single touch a "second finger", so one finger would never write again.
    if (!e.touches?.length) { fingers.clear(); pan = null; }
    setTimeout(() => opts.onPicked?.(selectedRange(root, opts.state().text)), 0);
  };

  root.addEventListener('pointerdown', onDown);
  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerup', onUp);
  root.addEventListener('pointercancel', onCancel);
  root.addEventListener('touchstart', onTouch, { passive: false });
  root.addEventListener('touchmove', onTouch, { passive: false });
  root.addEventListener('selectstart', onSelectStart);
  root.addEventListener('mouseup', onMouseUp);
  root.addEventListener('touchend', onTouchEnd);
  return () => {
    root.removeEventListener('mouseup', onMouseUp);
    root.removeEventListener('touchend', onTouchEnd);
    end(false);
    root.removeEventListener('pointerdown', onDown);
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerup', onUp);
    root.removeEventListener('pointercancel', onCancel);
    root.removeEventListener('touchstart', onTouch);
    root.removeEventListener('touchmove', onTouch);
    root.removeEventListener('selectstart', onSelectStart);
  };
}

/**
 * The text a hand selected inside `root` (a mouse drag, a finger's long press), as
 * a range snapped to words, or null. The highlighter turns a mouse selection into a
 * mark at once; a finger's selection keeps the system's copy and look-up and is
 * offered as one more choice, ไฮไลต์.
 */
export function selectedRange(root, text) {
  const sel = typeof window !== 'undefined' ? window.getSelection?.() : null;
  if (!sel || sel.isCollapsed || !root || !sel.rangeCount) return null;
  const range = sel.getRangeAt(0);
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return null;
  const a = offsetOfPoint(root, range.startContainer, range.startOffset, false);
  const b = offsetOfPoint(root, range.endContainer, range.endOffset, true);
  if (a == null || b == null || b <= a) return null;
  const snapped = snapRange(text, a, b);
  return snapped ? { ...snapped, rect: range.getBoundingClientRect() } : null;
}

// ── the pane's pen strokes, as they were ────────────────────
// Pixels from the top left of the pane's text box, on a canvas inside it that
// scrolls with the words. Slice 3 replaces this with ink anchored to the text.

/** Draws every pixel stroke on the canvas, sized to the text box. */
export function drawPixelStrokes(canvas, box, strokes) {
  if (!canvas || !box) return;
  const w = box.offsetWidth;
  const h = box.offsetHeight;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.max(1, Math.floor(w * dpr));
  canvas.height = Math.max(1, Math.floor(h * dpr));
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const s of strokes) {
    ctx.strokeStyle = s.color;
    ctx.beginPath();
    s.points.forEach(([x, y, p], i) => {
      ctx.lineWidth = (s.width || 2) * (0.5 + (p || 0.5));
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
}

/**
 * The `pen` of attachCaseSurface for the pane: draws the live stroke straight
 * onto the canvas and hands the finished one to `commit` once.
 */
export function pixelPen({ box, canvas, strokes, color, commit, redraw, newId }) {
  let pen = null;
  const local = (pt) => {
    const r = box.getBoundingClientRect();
    return [pt.x - r.left, pt.y - r.top, pt.p > 0 ? pt.p : 0.5];
  };
  return {
    down(pt) { pen = { id: newId(), kind: 'px', color: color(), width: pt.type === 'pen' ? 1.6 : 2.2, points: [local(pt)] }; },
    move(pts) {
      if (!pen) return;
      const ctx = canvas()?.getContext('2d');
      for (const pt of pts) {
        const p = local(pt);
        const prev = pen.points[pen.points.length - 1];
        pen.points.push(p);
        if (!ctx) continue;
        ctx.strokeStyle = pen.color;
        ctx.lineCap = 'round';
        ctx.lineWidth = pen.width * (0.5 + p[2]);
        ctx.beginPath();
        ctx.moveTo(prev[0], prev[1]);
        ctx.lineTo(p[0], p[1]);
        ctx.stroke();
      }
    },
    up() {
      const s = pen;
      pen = null;
      if (s && s.points.length >= 2) commit(s);
      else redraw();
    },
    cancel() { pen = null; redraw(); },
    hit(x, y) {
      const r = box.getBoundingClientRect();
      const lx = x - r.left;
      const ly = y - r.top;
      return strokes().filter((s) => s.points.some(([px, py]) => (px - lx) ** 2 + (py - ly) ** 2 < 14 * 14)).map((s) => s.id);
    },
  };
}

// ── the pane's side of the sheet and of a clear ─────────────

// The scroller a pane reads in: the pane itself where it scrolls (the sticky column from 1024 px), else the page.
export function scrollerOf(el) {
  const pane = el?.closest?.('.vmx-q-passage-pane');
  if (pane && pane.scrollHeight > pane.clientHeight + 1 && getComputedStyle(pane).overflowY !== 'visible') return pane;
  return null;
}

/** The first line a reader of the pane sees: under the pane's top bar, inside the pane where it scrolls. */
export function paneTop(root, bar) {
  const sc = scrollerOf(root);
  return Math.max(sc ? sc.getBoundingClientRect().top : 0, bar?.getBoundingClientRect().bottom ?? 0);
}

/**
 * The op that puts back marks a clear removed, counting only those not already
 * back (the toolbar's undo may have restored them first), or null when there is
 * nothing to put back. Applying it twice, or after an undo, changes nothing.
 */
export function restoreOp(marks, removed) {
  const have = new Set((marks || []).map((m) => m.id));
  const add = (removed || []).filter((m) => !have.has(m.id));
  return add.length ? { add, remove: [] } : null;
}

/**
 * The way back from a clear, for a case the card has left: its marks go back under its own key, unless
 * its record cannot be read, which is never written over. The restore goes on that view's undo history
 * (`history`) as the toast's own restore does, so its next undo takes back the restore, not the clear.
 */
export function restoreElsewhere(storage, key, removed, history) {
  try {
    const present = storage.getItem(key) != null;
    const rec = readStoredJson(key, null, { storage, accept: (r) => Array.isArray(r?.marks) });
    if (present && !rec) return;
    const marks = rec ? rec.marks : [];
    const op = restoreOp(marks, removed);
    if (op && writeCaseMarks(storage, key, applyOp(marks, op))) history?.push(op);
  } catch { /* storage refused: nothing else to do */ }
}

// ── the pane's actions on its marks ─────────────────────────
// What the pane does with a mark once a hand made one: kept here, loaded with the hand, so none of it is in
// the exam's own chunk. `p` is the pane's: { cur (its marks: { key, marks, ok }), set(next), text, ranges,
// strokes, saveFailed(), bump(), toast (the clear's way back, or null), setToast(t), timer, storage }.

/** Writes the marks; a record that could not be read is never written over: marks made then live in memory. */
function saveMarks(p, cur, marks) {
  const s = p.storage();
  if (!cur.ok || !s || !writeCaseMarks(s, cur.key, marks)) p.saveFailed();
}

/** Any other change ends a clear's way back: its marks may be back already, or meant to stay gone. */
export function dropToast(p) {
  clearTimeout(p.timer);
  if (p.toast) p.setToast(null);
}

function put(p, cur, marks) {
  const next = { ...cur, marks };
  p.set(next);
  saveMarks(p, cur, marks);
  p.bump();
}

/** Applies an op to the pane's marks, saves them, and records it on this case's undo (per text). */
export function commitOp(p, op, { record = true, fromToast = false } = {}) {
  const cur = p.cur;
  if (!cur.key) return;
  if (!fromToast) dropToast(p);
  put(p, cur, applyOp(cur.marks, op));
  if (record) historyFor(cur.key, p.text).push(op);
}

/** Undo and redo hand back the whole set of marks. */
export function replaceMarks(p, marks) {
  if (!p.cur.key || !marks) return;
  dropToast(p);
  put(p, p.cur, marks);
}

/** A highlight; a range already wholly marked adds nothing (a tap that ran a little long would stack a hidden copy). */
export function addRange(p, range, color) {
  if (p.ranges.some((m) => m.start <= range.start && m.end >= range.end)) return;
  commitOp(p, { add: [makeRange(p.text, range, color)], remove: [] });
}

export function eraseIds(p, ids) {
  const gone = new Set(ids);
  commitOp(p, { add: [], remove: p.cur.marks.filter((m) => gone.has(m.id)) });
}

export function recolor(p, id, color) {
  const m = p.cur.marks.find((x) => x.id === id);
  if (!m || m.color === color) return;
  commitOp(p, { add: [{ ...m, color, id: newMarkId() }], remove: [m] });
}

/**
 * Clear removes what this view shows: the marks of another stage of the case, unseen here, stay. The sheet
 * clears its highlights only, since it does not show the pane's pen strokes, except on a phone, whose pane has
 * no tools: there the sheet's clear is the only one, and takes the strokes too. Its way back stays 8 seconds.
 */
export function clearAll(p, strokesToo = true) {
  const cur = p.cur;
  const visible = new Set([...p.ranges.map((m) => m.id), ...(strokesToo ? p.strokes.map((m) => m.id) : [])]);
  const removed = cur.marks.filter((m) => visible.has(m.id));
  if (!removed.length) return;
  commitOp(p, { add: [], remove: removed });
  const t = { key: cur.key, text: p.text, removed, n: removed.length };
  p.setToast(t);
  p.timer = setTimeout(() => p.setToast(null), 8000);
}

/** The clear's way back: onto this case, or, after the card moved on, onto the case it came from and its undo. */
export function undoClear(p) {
  const t = p.toast;
  dropToast(p);
  if (!t) return;
  if (t.key === p.cur.key) {
    const op = restoreOp(p.cur.marks, t.removed);
    if (op) commitOp(p, op, { fromToast: true });
    return;
  }
  const s = p.storage();
  if (s) restoreElsewhere(s, t.key, t.removed, historyFor(t.key, t.text));
}

/** The pane's pen strokes on its canvas, drawn now and again whenever the text box changes size. */
export function watchStrokes(p, box, canvas) {
  const redraw = () => drawPixelStrokes(canvas, box, p.strokes);
  redraw();
  if (!box || typeof ResizeObserver === 'undefined') return undefined;
  const ro = new ResizeObserver(redraw);
  ro.observe(box);
  return () => ro.disconnect();
}

/** The hand on the pane's text: the tool and colours the pane holds now, its pen on the pane's canvas. */
export function attachPane(p, root, wet, box, canvas, policy) {
  if (!box) return undefined;
  return attachCaseSurface(root, wet, {
    policy,
    state: () => ({ tool: p.phone ? 'none' : p.tool, writeSwitch: false, penEnabled: true, text: p.text, ranges: p.ranges, scroller: scrollerOf(box) || window }),
    onRange: (range) => addRange(p, range, p.rangeColor),
    onErase: (ids) => eraseIds(p, ids),
    onMarkTap: (id, rect) => p.markTap({ id, rect }),
    onPicked: (r) => p.picked(r || null),
    onPenSeen: () => p.penSeen(),
    pen: pixelPen({
      box,
      canvas: () => canvas,
      strokes: () => p.strokes,
      color: () => penInk(p.penColor),
      commit: (stroke) => commitOp(p, { add: [stroke], remove: [] }),
      redraw: () => drawPixelStrokes(canvas, box, p.strokes),
      newId: newMarkId,
    }),
  });
}

// ── the marks saved before owner-scoped keys ────────────────
const LEGACY_RANGE = { yellow: 'lemon', green: 'sky', pink: 'lilac' };

/** The marks SmartPassage saved under the passage's own key, in today's form. The old values stay where they are. */
export function convertLegacy(text, hlRaw, drRaw) {
  const marks = [];
  // Each old key on its own: one that cannot be read is left where it is (the backup) and brings nothing.
  const list = (raw) => { try { const v = JSON.parse(raw || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } };
  const hl = list(hlRaw);
  const dr = list(drRaw);
  for (const h of hl) {
    if (!(Number.isInteger(h?.start) && Number.isInteger(h?.end) && h.end > h.start)) continue;
    marks.push({
      id: `legacy-hl-${String(h.id ?? marks.length)}`, kind: 'range', style: 'wash', start: h.start, end: h.end,
      color: LEGACY_RANGE[h.color] || 'lemon', quote: quoteAt(text, h.start, h.end),
    });
  }
  dr.forEach((s, i) => {
    if (!Array.isArray(s?.points)) return;
    marks.push({ id: `legacy-dr-${i}`, kind: 'px', color: s.color, width: s.width, points: s.points, legacy: 1 });
  });
  return marks;
}

/**
 * The first read of a case with no record (readCaseMarks): the account signed in when a case is first
 * shown after this release (or the visitor) is recorded once in ADOPT_KEY as the owner of the marks
 * saved before it; that owner alone gets a copy of a passage's old marks, written at once so a later
 * clear is not undone by adopting again. The old keys are never written or removed.
 */
export function adoptLegacy(storage, key, { ownerId = null, passage = '' }) {
  let claim = readStoredJson(ADOPT_KEY, null, { storage });
  const me = ownerId || null;
  if (!claim || !('owner' in claim)) {
    claim = { owner: me, at: Date.now() };
    try { storage.setItem(ADOPT_KEY, JSON.stringify(claim)); } catch { /* read-only storage: adopt nothing */ return { ok: true, key, marks: [], adopted: false }; }
  }
  if ((claim.owner || null) !== me) return { ok: true, key, marks: [], adopted: false };
  const legacy = `vmx-pass-${legacyPassageHash(String(passage))}`;
  const hl = storage.getItem(`${legacy}-hl`);
  const dr = storage.getItem(`${legacy}-dr`);
  if (hl == null && dr == null) return { ok: true, key, marks: [], adopted: false };
  const marks = convertLegacy(String(passage), hl, dr);
  // Written at once, so a later clear of this case is not undone by adopting the old keys again.
  storage.setItem(key, JSON.stringify({ v: 1, marks }));
  return { ok: true, key, marks, adopted: true };
}
