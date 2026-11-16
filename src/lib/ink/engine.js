// ============================================================
// ink/engine.js — the pen and touch loop, apart from any one reader
// ============================================================
// Moved out of PdfAnnotateView.jsx unchanged in behaviour. It decides what a
// pointer is for and keeps the gesture state: the pen-only and palm rule
// (once pen-only is on, a touch scrolls and never marks, and a touch that
// lands while the pen is drawing is the hand and is ignored), the finger pan,
// the two-finger pinch that throws away a stroke one of its fingers started,
// every coalesced sample into the stroke, the stylus barrel eraser, the
// double tap that swaps pen and eraser, and the stroke eraser's hit test.
//
// Framework-free. A reader drives it through a host object it hands to
// `setHost` on every render, so the host's getters and callbacks always see
// that render's state:
//
//   penOnly, sawPen, zoom, tool, eraserMode, size   current settings
//   toStored(event, pressure)   a client point in the reader's stored space
//   newId(), colorFor(tool)     what a new stroke carries
//   beforeDown(e)               false drops the pointer (nothing open yet)
//   onPenSeen()                 the first stylus on this device
//   scroller()                  the element a finger pans
//   startTool / moveTool / endTool(ref|tool, e)   the reader's own tools
//                               (text, tape, lasso); true when handled
//   eraseAt(e)                  stroke eraser under the pointer
//   hoverRing(x, y)             a hovering pencil
//   surface()                   truthy when the live stroke can be painted
//   grow(stroke, added, surface)   paint the samples just added
//   commit(stroke)              a finished stroke
//   discardLive()               a stroke the pinch threw away
//   onUp(), onStrokeEnd(), afterStroke(), onDoubleTap()
//   pinchTo(zoom, cx, cy)       the zoom a pinch asks for, unsnapped
//
// Options, for surfaces that are not the PDF reader (each defaults to the
// reader's behaviour when left out):
//
//   pinch: false        no two-finger pinch; a second pointer is its own
//   penLocksTouch       once a pen has touched, a finger never marks again
//                       until resetHand() (the handwriting pad's palm rule)
//   onTouchIgnored(e)   a finger or mouse that pen-only mode turned away
//   samples(e)          the samples one move carries (default: coalesced)
//   near(last, pt)      true drops pt as a near-duplicate of last
//   started(stroke)     a stroke has its first point (paint the dot)
//   onDoubleTap         left out, a pen tap is an ordinary stroke
//
// No predicted events: the PDF reader does not draw them yet.
// ============================================================

import { strokeHit } from '../shape-fit.js';
import { createPointerPolicy } from './hand.js';

/** Undo history keeps this many steps. */
export const REDO_CAP = 40;

/** The redo stack with `entries` pushed on top, capped. */
export function pushRedo(stack, ...entries) {
  return [...stack, ...entries].slice(-REDO_CAP);
}

/** The strokes the whole-stroke eraser takes at (x, y). A pixel-eraser
 *  stroke is a hole, not ink: deleting one un-erases the ink beneath it. */
export function strokesUnder(list, x, y, reach, aspect) {
  return list.filter((st) => st.mode !== 'eraser' && strokeHit(st, x, y, reach, aspect));
}

/** Every sample the digitiser took since the last event. A pen runs at about
 *  240 Hz against a 60 Hz screen, so without this three of every four points
 *  a student writes are thrown away. */
export function coalescedSamples(e) {
  const raw = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [];
  return raw.length ? raw : [e];
}

// How far from upright the stylus is, 0 (vertical) to 1 (almost flat).
// Safari has reported altitudeAngle since 16.4 and it is the accurate
// source; tiltX/tiltY are the older, wider-support fallback. Anything that
// reports neither returns 0 and the brush behaves exactly as before.
// Tilt rides as a fourth component, so a point stays [x, y] on hardware
// that reports nothing and never grows for a mouse or a finger.
export function withTilt(pt, tilt) {
  if (!tilt || pt.length < 3) return pt;
  return [pt[0], pt[1], pt[2], Math.round(tilt * 100) / 100];
}

export function tiltOf(e) {
  if (typeof e.altitudeAngle === 'number' && e.altitudeAngle > 0) {
    // altitudeAngle is radians from the surface: PI/2 is upright.
    return Math.min(1, Math.max(0, 1 - e.altitudeAngle / (Math.PI / 2)));
  }
  const tx = e.tiltX || 0;
  const ty = e.tiltY || 0;
  if (!tx && !ty) return 0;
  return Math.min(1, Math.hypot(tx, ty) / 90);
}

export function createInkEngine(initialHost = {}) {
  let h = initialHost;
  const drawingRef = { current: { on: false, points: [] } };
  const panRef = { current: null };
  const tapRef = { current: { at: 0, x: 0, y: 0 } };
  // Two-finger pinch. `touch-action: none` on the overlay is what makes
  // single-finger drawing possible, and it also swallows the browser's own
  // pinch, so on an iPad with a Pencil there would otherwise be no way to
  // zoom except the toolbar.
  const gestureRef = { current: null };
  const activePointers = { current: new Map() };
  const hand = createPointerPolicy();

  function gestureDown(e) {
    const penOnly = h.penOnly;
    // Pen-only mode: the stylus draws and never pinches, and a touch that
    // lands while the pen is down is the hand settling on the glass, the
    // very thing this mode exists to ignore. Both used to be booked as pinch
    // fingers, so a palm resting mid-stroke threw the stroke away and started
    // zooming against the hand.
    if (penOnly && e.pointerType === 'pen') return false;
    if (penOnly && e.pointerType !== 'pen' && drawingRef.current?.on) return true;
    if (h.pinch === false) return false;
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activePointers.current.size !== 2) return false;
    // A second finger means this was never a stroke, when the stroke belongs
    // to one of these two pointers. Throw it away rather than leaving a stray
    // mark behind every pinch.
    const d = drawingRef.current;
    if (d?.on && activePointers.current.has(d.pointerId)) {
      drawingRef.current = { on: false, points: [] };
      h.discardLive?.();
    }
    const [a, b] = [...activePointers.current.values()];
    gestureRef.current = {
      startDist: Math.hypot(a.x - b.x, a.y - b.y),
      startZoom: h.zoom,
      // The midpoint between the fingers is the point the reader expects to
      // stay put: it is the thing they are pinching.
      cx: (a.x + b.x) / 2,
      cy: (a.y + b.y) / 2,
    };
    return true;
  }

  function gestureMove(e) {
    if (!activePointers.current.has(e.pointerId)) return false;
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gestureRef.current;
    if (!g || activePointers.current.size < 2) return false;
    const [a, b] = [...activePointers.current.values()];
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    if (g.startDist > 0) {
      h.pinchTo?.(g.startZoom * (dist / g.startDist), (a.x + b.x) / 2, (a.y + b.y) / 2);
    }
    return true;
  }

  function gestureUp(e) {
    activePointers.current.delete(e.pointerId);
    if (activePointers.current.size < 2) gestureRef.current = null;
    return activePointers.current.size > 0;
  }

  function onPointerDown(e) {
    if (h.beforeDown && h.beforeDown(e) === false) return;
    if (gestureDown(e)) {
      // In pen-only mode a finger that lands here never draws.
      if (h.penOnly && e.pointerType !== 'pen') h.onTouchIgnored?.(e);
      return;
    }
    if (h.penLocksTouch && !hand.accept(e.pointerType)) return;
    const penOnly = h.penOnly;
    // A stylus anywhere on the page proves this device has one.
    if (e.pointerType === 'pen' && !h.sawPen) h.onPenSeen?.();
    // Palm rejection: with a stylus in hand, a hand resting on the glass is
    // not a drawing gesture. But a finger still has a job: it scrolls, the
    // way it does in every notes app that offers this mode. Without that,
    // `touch-action: none` would leave a zoomed page with no way to move
    // around it except two-finger pinching.
    if (penOnly && e.pointerType !== 'pen') {
      h.onTouchIgnored?.(e);
      const wrap = h.scroller?.();
      if (wrap) {
        panRef.current = {
          id: e.pointerId, el: wrap, x: e.clientX, y: e.clientY,
          left: wrap.scrollLeft, top: wrap.scrollTop,
        };
      }
      return;
    }
    // A hand that settled on the glass before the pen came down was booked
    // as a scrolling finger. Once the pen is drawing, that hand must not drag
    // the page under the nib.
    if (penOnly && e.pointerType === 'pen' && panRef.current) panRef.current = null;
    e.preventDefault();
    // Capture on the element the stroke started on, so a line that runs past
    // the bottom of a page keeps reporting to that page instead of jumping to
    // the next one mid-stroke.
    try { e.currentTarget?.setPointerCapture?.(e.pointerId); } catch { /* synthetic pointer */ }
    const usePressure = e.pointerType === 'pen';
    const useTilt = usePressure;
    // Surface, Wacom and S Pen styluses report the eraser barrel as button 5
    // / buttons bit 32. Flipping the stylus over is how people expect to
    // erase; the toolbar selection stays, so turning the pen back over
    // resumes drawing with the same pen.
    const barrelEraser = e.pointerType === 'pen' && (e.button === 5 || (e.buttons & 32) !== 0);
    const usedTool = barrelEraser ? 'eraser' : h.tool;
    if (h.startTool?.(usedTool, e)) return;
    if (usedTool === 'eraser' && h.eraserMode === 'stroke') {
      drawingRef.current = { on: true, pointerId: e.pointerId, erase: true, points: [] };
      h.eraseAt?.(e);
      return;
    }
    const pt = withTilt(h.toStored(e, usePressure ? e.pressure : 0), useTilt ? tiltOf(e) : 0);
    drawingRef.current = {
      on: true,
      pointerId: e.pointerId,
      stroke: {
        id: h.newId(),
        mode: usedTool,
        color: h.colorFor(usedTool),
        size: h.size,
        pressure: usePressure,
        points: [pt],
      },
    };
    h.started?.(drawingRef.current.stroke);
  }

  function onPointerMove(e) {
    if (gestureMove(e)) return;
    const pan = panRef.current;
    if (pan && e.pointerId === pan.id) {
      const wrap = pan.el || h.scroller?.();
      if (wrap) {
        wrap.scrollLeft = pan.left - (e.clientX - pan.x);
        wrap.scrollTop = pan.top - (e.clientY - pan.y);
      }
      return;
    }
    // A hovering Apple Pencil (M2 iPad Pro and later) reports movement with no
    // buttons pressed. Showing where the nib will land, at the real brush
    // size, is the difference between aiming and guessing.
    if (e.pointerType === 'pen' && e.buttons === 0) {
      h.hoverRing?.(e.clientX, e.clientY);
      return;
    }
    const ref = drawingRef.current;
    if (!ref?.on || e.pointerId !== ref.pointerId) return;
    e.preventDefault();
    if (ref.erase) { h.eraseAt?.(e); return; }
    if (h.moveTool?.(ref, e)) return;
    const stroke = ref.stroke;
    const surface = h.surface ? h.surface() : true;
    if (!surface) return;
    let added = 0;
    for (const se of (h.samples ? h.samples(e) : coalescedSamples(e))) {
      const pt = withTilt(
        h.toStored(se, stroke.pressure ? se.pressure : 0),
        stroke.pressure ? tiltOf(se) : 0,
      );
      const last = stroke.points[stroke.points.length - 1];
      // Drop near-duplicates so a still hand does not grow the array.
      if (h.near ? h.near(last, pt)
        : (Math.abs(last[0] - pt[0]) < 0.0004 && Math.abs(last[1] - pt[1]) < 0.0004)) continue;
      stroke.points.push(pt);
      added++;
    }
    if (!added || stroke.points.length < 2) return;
    h.grow?.(stroke, added, surface);
  }

  function onPointerUp(e) {
    h.onUp?.();
    // A tap is a pointer that went down and came up in the same place, quickly
    // and without drawing anything worth keeping. Two of them in a row, from a
    // stylus, mean the reader wants the eraser.
    if (h.onDoubleTap && e?.pointerType === 'pen' && drawingRef.current?.on && !drawingRef.current.erase) {
      const st = drawingRef.current.stroke;
      const moved = st?.points?.length > 1
        ? Math.hypot(st.points[st.points.length - 1][0] - st.points[0][0],
                     st.points[st.points.length - 1][1] - st.points[0][1])
        : 0;
      const now = Date.now();
      const near = Math.hypot(e.clientX - tapRef.current.x, e.clientY - tapRef.current.y);
      if (moved < 0.01) {
        if (now - tapRef.current.at < 400 && near < 36) {
          // Second tap: the host switches tool and takes back the dots.
          tapRef.current = { at: 0, x: 0, y: 0 };
          drawingRef.current = { on: false, points: [] };
          h.onDoubleTap?.();
          return;
        }
        tapRef.current = { at: now, x: e.clientX, y: e.clientY };
      } else {
        tapRef.current = { at: 0, x: 0, y: 0 };
      }
    }
    if (e && panRef.current && e.pointerId === panRef.current.id) {
      panRef.current = null;
      // onPointerDown registers EVERY pointer with the pinch bookkeeping
      // before it decides what the pointer is for, so the scrolling finger is
      // in that map and has to come back out. Returning without this left it
      // there as a phantom contact: the next single finger down counted as
      // the SECOND finger of a pinch, so one finger dragging zoomed the
      // document and scrolling was over for the rest of the session. The
      // return value is deliberately ignored: a finished pan ends here.
      gestureUp(e);
      return;
    }
    // Other pointers still down end here, except when the one lifting is the
    // pen that is drawing: a pen in pen-only mode is never in the pinch map,
    // so a hand that landed before it and is still resting would otherwise
    // swallow the stroke and leave the pen "drawing" after it lifted.
    const live = drawingRef.current;
    const drawer = !!(e && live?.on && e.pointerId === live.pointerId);
    if (e && gestureUp(e) && !drawer) return;
    const ref = drawingRef.current;
    if (!ref?.on) return;
    if (e && e.pointerId !== undefined && e.pointerId !== ref.pointerId) return;
    drawingRef.current = { on: false, points: [] };
    h.onStrokeEnd?.();
    if (ref.erase) { h.afterStroke?.(); return; }
    if (h.endTool?.(ref)) return;
    if (!ref.stroke || ref.stroke.points.length < 1) { h.afterStroke?.(); return; }
    h.commit?.(ref.stroke);
  }

  return {
    drawingRef,
    panRef,
    tapRef,
    gestureRef,
    activePointers,
    setHost(next) { h = next || {}; },
    /** Fingers count again (penLocksTouch), as on a cleared pad. */
    resetHand() { hand.reset(); },
    onPointerDown,
    onPointerMove,
    onPointerUp,
    gestureDown,
    gestureMove,
    gestureUp,
  };
}
