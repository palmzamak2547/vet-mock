import { Fragment, useMemo } from 'react';
import { splitBlocks } from '../lib/rich-blocks.js';
import { RichText } from '../lib/richtext.jsx';

// A cell that holds a figure and no word: a count, a rate, a range, a fraction.
const FIGURE = /^[^A-Za-z฀-๿]*\d[^A-Za-z฀-๿]*$/;

/** One table of a passage or an explanation (src/lib/rich-blocks.js). A header
 *  whose first cell is empty means the first column names the rows. */
export function RichTable({ table }) {
  const named = table.head[0] === '';
  // The table keeps its own display (a table drawn as a block loses its rows
  // and columns for a screen reader); the frame around it is what scrolls, and
  // it takes focus so the arrow keys can scroll a wide one.
  return (
    <div className="vmx-qtable-wrap" role="group" aria-label="ตารางข้อมูล" tabIndex={0}>
    <table className="vmx-qtable">
      <thead>
        <tr>
          {table.head.map((cell, i) => (i === 0 && named
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
  );
}

/**
 * A passage or an explanation: its prose through `renderText`, its tables as
 * tables. A text with no table goes to `renderText` whole, as it always did.
 */
export default function RichBlocks({ text, renderText = (t) => <RichText text={t} /> }) {
  const blocks = useMemo(() => splitBlocks(text), [text]);
  if (blocks.length === 1 && blocks[0].type === 'text') return renderText(text);
  return blocks.map((b, i) => (b.type === 'table'
    ? <RichTable key={i} table={b} />
    : <Fragment key={i}>{renderText(b.text)}</Fragment>));
}
