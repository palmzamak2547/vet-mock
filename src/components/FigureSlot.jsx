import { useEffect, useState } from 'react';

// Where a figure of an explanation goes (src/lib/figure-spec.js). This file is
// all that the card carries. The figure's core (FigureBox.jsx with the parser
// and the layout) and its drawing (ExplainFigure.jsx and its styles) are lazy
// chunks, asked for while a practice question that carries a figure is read
// (warmFigure) or when a figure is about to show. Until the core is in, the
// slot is an empty box; once it is, the box is held at the figure's height for
// its width, before the drawing arrives.
let Box = null;
let job = null;
const loadBox = () => {
  job ||= import('./FigureBox.jsx').then((m) => { Box = m.default; return m; }, () => { job = null; return null; });
  return job;
};

/** Ask for the core and the drawing while a question that carries a figure is read in practice, so it paints
 *  with the explanation. Never during a timed paper: the caller asks only where the answer will be shown. */
export const warmFigure = () => { loadBox().then((m) => m?.loadDrawing()); };

/**
 * `block`: the figure block of splitBlocks ({ kind, body, plain }). `passage`: it is read before the answer,
 * so no mark is shown as the answer. `onFail`: the explanation's way to show its whole paragraph instead;
 * without it a figure that cannot load is written out in words, so a student never meets a gap.
 */
export default function FigureSlot(props) {
  const [ready, setReady] = useState(Boolean(Box));
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (ready) return undefined;
    let live = true;
    loadBox().then((m) => { if (!live) return; if (m && Box) setReady(true); else { setFailed(true); props.onFail?.(); } });
    return () => { live = false; };
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps -- once
  if (failed) return props.onFail ? null : <p className="vmx-fig-words" style={{ whiteSpace: 'pre-line' }}>{props.block.plain}</p>;
  return ready ? <Box {...props} /> : <div className="vmx-fig-slot"><div className="vmx-fig is-hold" aria-hidden="true" /></div>;
}
