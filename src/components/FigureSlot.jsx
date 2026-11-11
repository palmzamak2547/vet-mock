import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

// Where a figure of an explanation goes (src/lib/figure-spec.js). This file is
// all that the card carries. Two lazy chunks do the rest, asked for while a
// question that carries a figure is read in practice (warmFigure), or when a
// figure is about to show:
//   - the core (figure-spec.js): reads the block and lays it out for a width;
//   - the drawing (ExplainFigure.jsx and its styles).
// The box is held at the height figureLayout() gives for the width measured
// here, before paint, and the drawing lays itself out to that same height,
// so nothing below it moves when the drawing arrives, however late.
let core = null;
let coreJob = null;
let View = null;
let job = null;
const loadCore = () => {
  coreJob ||= import('../lib/figure-spec.js').then((m) => { core = m; }, () => { coreJob = null; });
  return coreJob;
};
const load = () => {
  // A module that loads but holds no drawing counts as a failed load, so the next figure asks again.
  job ||= import('./ExplainFigure.jsx').then((m) => { View = typeof m?.default === 'function' ? m.default : null; if (!View) job = null; }, () => { job = null; });
  return job;
};

/** Ask for the core and the drawing while a question that carries a figure is read in practice, so it paints
 *  with the explanation. Never during a timed paper: the caller asks only where the answer will be shown. */
export const warmFigure = () => { loadCore(); load(); };

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * `block`: the figure block of splitBlocks ({ kind, body, plain }). `passage`: it is read before the answer,
 * so no mark is shown as the answer. `onFail`: what to do when the drawing cannot load (a lost connection, a
 * chunk the server no longer has); the explanation hands over its whole paragraph (RichBlocks `say`), and
 * without one the figure is written out in words, so a student never meets a gap.
 */
export default function FigureSlot({ block, passage = false, play = false, onFail }) {
  const [state, setState] = useState(View && core ? 'ready' : 'wait');
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
  const [, setCoreIn] = useState(Boolean(core));
  useEffect(() => {
    let live = true;
    if (!core) loadCore().then(() => { if (live) setCoreIn(Boolean(core)); });
    if (state === 'wait') Promise.all([loadCore(), load()]).then(() => { if (live) setState(View && core ? 'ready' : 'gone'); });
    return () => { live = false; };
  }, [state]);
  useEffect(() => { if (state === 'gone') onFail?.(); }, [state]); // eslint-disable-line react-hooks/exhaustive-deps -- once, when it fails
  const fig = useMemo(() => {
    if (!core) return null;
    const read = core.parseFigure(block.kind, block.body);
    return passage ? core.withoutKeys(read) : read;
  }, [block.kind, block.body, passage, core]); // eslint-disable-line react-hooks/exhaustive-deps -- core arrives once
  if (state === 'gone') return onFail ? null : <p className="vmx-fig-words" style={{ whiteSpace: 'pre-line' }}>{block.plain}</p>;
  const height = fig ? core.figureLayout(fig, width).height : 0;
  return (
    <div ref={box} className="vmx-fig-slot">
      {state === 'wait' || !View || !fig
        ? <div className="vmx-fig is-hold" style={{ minHeight: `${height}px` }} aria-hidden="true" />
        : <View fig={fig} play={play} width={width} />}
    </div>
  );
}
