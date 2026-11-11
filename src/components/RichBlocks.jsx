import { Fragment, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { splitBlocks } from '../lib/rich-blocks.js';
import { RichText } from '../lib/richtext.jsx';
import FigureSlot from './FigureSlot.jsx';
import { withoutKeys } from '../lib/figure-spec.js';

// A cell that holds a figure and no word: a count, a rate, a range, a fraction.
const FIGURE = /^[^A-Za-z฀-๿]*\d[^A-Za-z฀-๿]*$/;

/**
 * One table of a passage or an explanation (src/lib/rich-blocks.js).
 *
 * The first column names the rows when its header cell is empty, or when it
 * holds words and no bare figure (a group, a variable, a day): those cells are
 * row headers. The table keeps its own display (drawn as a block it loses its
 * rows and columns for a screen reader); the frame around it is what scrolls.
 * A table wider than its frame says so under it, keeps its row names in view
 * while it scrolls, and only then takes focus, so the arrow keys can scroll it.
 */
export function RichTable({ table, labelledBy }) {
  const frame = useRef(null);
  const [wide, setWide] = useState(false);
  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return undefined;
    const measure = () => setWide(el.scrollWidth > el.clientWidth + 1);
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const watch = new ResizeObserver(measure);
    watch.observe(el);
    return () => watch.disconnect();
  }, [table]);
  const corner = table.head[0] === '';
  const named = corner || table.rows.every((row) => !row[0] || !FIGURE.test(row[0]));
  const name = labelledBy ? { 'aria-labelledby': labelledBy } : { 'aria-label': 'ตารางข้อมูล' };
  return (
    <>
      <div
        ref={frame}
        className={`vmx-qtable-wrap${wide ? ' is-wide' : ''}`}
        role="group"
        {...name}
        tabIndex={wide ? 0 : undefined}
      >
        <table className={named ? 'vmx-qtable has-names' : 'vmx-qtable'}>
          <thead>
            <tr>
              {table.head.map((cell, i) => (i === 0 && corner
                ? <td key={i} />
                : <th key={i} scope="col"><RichText text={cell} /></th>))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, i) => (i === 0 && named
                  ? <th key={i} scope="row"><RichText text={cell} /></th>
                  : <td key={i} className={FIGURE.test(cell) ? 'num' : undefined}><RichText text={cell} /></td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {wide && <p className="vmx-qtable-hint">เลื่อนตารางไปด้านข้างเพื่อดูคอลัมน์ที่เหลือ</p>}
    </>
  );
}

// The house sections of an explanation open with an emoji ("❌ ทำไมข้ออื่นผิด",
// "💡 ..."). Beside a figure they are drawn as line icons in the figure's own
// hand instead. Geometry from Kubai Icons (circle-x, lightbulb), MIT License,
// (c) 2026 Kubai087 and the Kubai Icons contributors; redrawn as one-colour
// strokes. Only an explanation that carries a figure shows them for now.
const HOUSE = /^(❌|💡)[^\S\n]*(.*)$/u;
const ICONS = {
  '❌': <><path d="M4 12.5a11.5 11.5 0 1 0 23 0a11.5 11.5 0 1 0 -23 0Z" /><path d="M11.8 8.8l7.4 7.4M19.2 8.8l-7.4 7.4" /></>,
  '💡': <><path d="M11 15.6C8.8 14 7.4 11.6 7.4 9a8.1 8.1 0 0 1 16.2 0c0 2.6-1.4 5-3.6 6.6v2H11Z" /><path d="M12.8 12.6l1.4-2.8 1.3 2 1.3-2 1.4 2.8M10.8 18.8q0-2 2-2h5.4q2 0 2 2v2.4q0 2-2 2h-5.4q-2 0-2-2ZM12.8 20h5.4" /></>,
};
function HouseLines({ text, renderText }) {
  const out = [];
  let rest = [];
  const flush = (k) => { const t = rest.join('\n').replace(/^\n+|\n+$/g, ''); if (t) out.push(<Fragment key={k}>{renderText(t)}</Fragment>); rest = []; };
  text.split('\n').forEach((line, i) => {
    const m = HOUSE.exec(line);
    if (!m) { rest.push(line); return; }
    flush(`t${i}`);
    out.push(
      <span key={`h${i}`} className={m[1] === '💡' ? 'vmx-house is-tip' : 'vmx-house'}>
        <svg viewBox="2 -1 27 26" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{ICONS[m[1]]}</svg>
        <span className="vmx-house-t">{renderText(m[2])}</span>
      </span>,
    );
  });
  flush('end');
  return out;
}

/**
 * A passage or an explanation: its prose through `renderText`, its tables as
 * tables, its figure drawn (FigureSlot). A text with no table and no figure
 * goes to `renderText` whole, as it always did. `play`: the figure may reveal
 * itself in the order of its reasoning (an answer given just now).
 */
export default function RichBlocks({ text, renderText = (t) => <RichText text={t} />, play = false, say = '', passage = false }) {
  const blocks = useMemo(() => splitBlocks(text), [text]);
  const [failed, setFailed] = useState(false);
  if (blocks.length === 1 && blocks[0].type === 'text') return renderText(text);
  // The drawing did not load: the explanation reads as the paragraph it was written as.
  if (failed && say) return renderText(say);
  const drawn = blocks.some((b) => b.type === 'figure');
  return blocks.map((b, i) => {
    if (b.type === 'table') return <RichTable key={i} table={b} />;
    // A passage is read before the answer, so its figure never shows which mark answers.
    if (b.type === 'figure') return <FigureSlot key={i} fig={passage ? withoutKeys(b.fig) : b.fig} play={play} onFail={say ? () => setFailed(true) : undefined} />;
    return <Fragment key={i}>{drawn ? <HouseLines text={b.text} renderText={renderText} /> : renderText(b.text)}</Fragment>;
  });
}
