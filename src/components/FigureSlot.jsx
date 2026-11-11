import { useEffect, useState } from 'react';
import { figureHeight } from '../lib/figure-spec.js';

// Where a figure of an explanation goes (src/lib/figure-spec.js). This file is
// all that the card carries: the drawing and its styles are one lazy chunk
// (ExplainFigure.jsx), asked for only when a figure is on screen or while a
// question that carries one is read in practice (warmFigure). Until it
// arrives the box is held at the height the figure will take, so nothing
// below it moves. If the chunk cannot load, the box goes and the explanation
// around it still says everything (the figure only draws what it says).
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

/**
 * `onFail`: what to do when the drawing cannot load (a lost connection, a
 * chunk the server no longer has). The explanation hands over its whole
 * paragraph (RichBlocks `say`); without one the figure is written out in
 * words, so a student never meets a gap.
 */
export default function FigureSlot({ fig, play = false, onFail }) {
  const [state, setState] = useState(View ? 'ready' : 'wait');
  useEffect(() => {
    if (state !== 'wait') return undefined;
    let live = true;
    load().then(() => { if (live) setState(View ? 'ready' : 'gone'); });
    return () => { live = false; };
  }, [state]);
  useEffect(() => { if (state === 'gone') onFail?.(); }, [state]); // eslint-disable-line react-hooks/exhaustive-deps -- once, when it fails
  const height = figureHeight(fig);
  if (state === 'gone') return onFail ? null : <p className="vmx-fig-words" style={{ whiteSpace: 'pre-line' }}>{fig.plain}</p>;
  if (state === 'wait' || !View) return <div className="vmx-fig is-hold" style={{ minHeight: `${height}px` }} aria-hidden="true" />;
  return <View fig={fig} play={play} height={height} />;
}
