import { Fragment, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { splitBlocks } from '../lib/rich-blocks.js';
import { RichText } from '../lib/richtext.jsx';
import FigureSlot from './FigureSlot.jsx';

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
  return blocks.map((b, i) => {
    if (b.type === 'table') return <RichTable key={i} table={b} />;
    // A passage is read before the answer, so its figure never shows which mark answers.
    if (b.type === 'figure') return <FigureSlot key={i} block={b} passage={passage} play={play} onFail={say ? () => setFailed(true) : undefined} />;
    return <Fragment key={i}>{renderText(b.text)}</Fragment>;
  });
}
