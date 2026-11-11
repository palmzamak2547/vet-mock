import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { figureLayout, parseFigure, withoutKeys } from '../lib/figure-spec.js';

// The box a figure is drawn in (FigureSlot.jsx loads this, the figure's core, with figure-spec.js). It
// measures the width it has before paint, holds the height figureLayout() gives for that width, and swaps in
// the drawing (ExplainFigure.jsx, its own lazy chunk) when it arrives; the drawing lays itself out to the same
// height, so nothing below it moves, however late it comes.
let View = null;
let job = null;
/** The drawing. A module that loads but holds no drawing counts as a failed load, so the next figure asks again. */
export const loadDrawing = () => {
  job ||= import('./ExplainFigure.jsx').then((m) => { View = typeof m?.default === 'function' ? m.default : null; if (!View) job = null; }, () => { job = null; });
  return job;
};

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * `block`: the figure block of splitBlocks ({ kind, body, plain }). `passage`: it is read before the answer,
 * so no mark is shown as the answer. `onFail`: what to do when the drawing cannot load (a lost connection, a
 * chunk the server no longer has); the explanation hands over its whole paragraph (RichBlocks `say`), and
 * without one the figure is written out in words, so a student never meets a gap.
 */
export default function FigureBox({ block, passage = false, play = false, onFail }) {
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
    loadDrawing().then(() => { if (live) setState(View ? 'ready' : 'gone'); });
    return () => { live = false; };
  }, [state]);
  useEffect(() => { if (state === 'gone') onFail?.(); }, [state]); // eslint-disable-line react-hooks/exhaustive-deps -- once, when it fails
  const fig = useMemo(() => { const read = parseFigure(block.kind, block.body); return passage ? withoutKeys(read) : read; }, [block.kind, block.body, passage]);
  if (state === 'gone') return onFail ? null : <p className="vmx-fig-words" style={{ whiteSpace: 'pre-line' }}>{block.plain}</p>;
  const height = figureLayout(fig, width).height;
  return (
    <div ref={box} className="vmx-fig-slot">
      {state === 'wait' || !View
        ? <div className="vmx-fig is-hold" style={{ minHeight: `${height}px` }} aria-hidden="true" />
        : <View fig={fig} play={play} width={width} />}
    </div>
  );
}
