import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { figureLayout } from '../lib/figure-spec.js';

// Where a figure of an explanation goes (src/lib/figure-spec.js). This file is
// all that the card carries: the drawing and its styles are one lazy chunk
// (ExplainFigure.jsx), asked for only when a figure is on screen or while a
// question that carries one is read in practice (warmFigure). The box is held
// at the height figureLayout() gives for the width measured here, before the
// first paint, and the drawing lays itself out to that same height, so
// nothing below it moves when it arrives, however late.
let View = null;
let job = null;
const load = () => {
  // A module that loads but holds no drawing counts as a failed load, so the next figure asks again.
  job ||= import('./ExplainFigure.jsx').then((m) => { View = typeof m?.default === 'function' ? m.default : null; if (!View) job = null; }, () => { job = null; });
  return job;
};

/** Ask for the drawing while a question that carries a figure is read in practice, so it paints with
 *  the explanation. Never during a timed paper: the caller asks only where the answer will be shown. */
export const warmFigure = () => { load(); };

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * `onFail`: what to do when the drawing cannot load (a lost connection, a
 * chunk the server no longer has). The explanation hands over its whole
 * paragraph (RichBlocks `say`); without one the figure is written out in
 * words, so a student never meets a gap.
 */
export default function FigureSlot({ fig, play = false, onFail }) {
  const [state, setState] = useState(View ? 'ready' : 'wait');
  const box = useRef(null);
  const [width, setWidth] = useState(0);
  // The width this figure has, read before paint and again when it changes (a rotation, a zoom).
  useIso(() => {
    const el = box.current;
    if (!el) return undefined;
    const measure = () => { const w = Math.round(el.getBoundingClientRect?.().width || 0); if (w) setWidth((p) => (p === w ? p : w)); };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const watch = new ResizeObserver(measure);
    watch.observe(el);
    return () => watch.disconnect();
  }, []);
  useEffect(() => {
    if (state !== 'wait') return undefined;
    let live = true;
    load().then(() => { if (live) setState(View ? 'ready' : 'gone'); });
    return () => { live = false; };
  }, [state]);
  useEffect(() => { if (state === 'gone') onFail?.(); }, [state]); // eslint-disable-line react-hooks/exhaustive-deps -- once, when it fails
  if (state === 'gone') return onFail ? null : <p className="vmx-fig-words" style={{ whiteSpace: 'pre-line' }}>{fig.plain}</p>;
  const height = figureLayout(fig, width).height;
  return (
    <div ref={box} className="vmx-fig-slot">
      {state === 'wait' || !View
        ? <div className="vmx-fig is-hold" style={{ minHeight: `${height}px` }} aria-hidden="true" />
        : <View fig={fig} play={play} width={width} />}
    </div>
  );
}
