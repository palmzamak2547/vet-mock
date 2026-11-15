import { Fragment, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { blockText, proseBlocks, splitBlocks, splitStem } from '../lib/rich-blocks.js';
import { RichText } from '../lib/richtext.jsx';

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

// A pairs run this long sits in two columns side by side where the frame is
// wide enough for both without smaller type (the container query in styles.css).
const SPLIT_PAIRS = 8;

/**
 * One block of typeset prose (rich-blocks.js proseBlocks). Each line is drawn
 * from its own parts, so every character of the text is in the page, in
 * order: the ":" stays after its label, and the "|" before a range is kept
 * for a screen reader while the column gap stands for it on screen.
 * renderText is called with each piece and its offset in `text`, so a surface
 * that marks words by offset (the case reader) can find them; a renderer that
 * takes one argument draws exactly as before.
 */
function ProseBlock({ text, block, renderText }) {
  const { lines } = block;
  if (block.type === 'para') return <div className="vmx-rb-p">{renderText(blockText(text, block), (block.lead || lines[0])?.start ?? block.start)}</div>;
  if (block.type === 'list') {
    return (
      <div className="vmx-rb-list">
        {lines.map(({ start, parts }) => (
          <Fragment key={start}>
            <span className={/^\s*\d/.test(parts.marker) ? 'vmx-rb-mark is-num' : 'vmx-rb-mark'}>{parts.indent}{parts.marker}{parts.gap}</span>
            <span className="vmx-rb-item">{renderText(parts.body, start + parts.indent.length + parts.marker.length + parts.gap.length)}</span>
          </Fragment>
        ))}
      </div>
    );
  }
  let grid;
  if (block.type === 'results') {
    grid = (
      <div className="vmx-rb-results">
        {lines.map(({ start, parts }) => (
          <Fragment key={start}>
            <span className="vmx-rb-k">{renderText(parts.label + parts.gap, start)}</span>
            <span className="vmx-rb-r">{renderText(parts.result + parts.tail, start + parts.label.length + parts.gap.length)}</span>
          </Fragment>
        ))}
      </div>
    );
  } else {
    const half = Math.ceil(lines.length / 2);
    const two = block.range && lines.length >= SPLIT_PAIRS;
    grid = (
      <div className={`vmx-rb-pairs${block.range ? ' has-range' : ' is-kv'}${two ? ' can-split' : ''}`}>
        {lines.map(({ start, parts }, r) => {
          const b = two && r >= half;
          const at = { '--r': r + 1, '--r2': (b ? r - half : r) + 1 };
          const side = b ? ' is-b' : '';
          return (
            <Fragment key={start}>
              <span className={`vmx-rb-k${side}`} style={at}>{renderText(parts.label + parts.sep, start)}</span>
              <span className={`vmx-rb-v${side}`} style={at}>
                {renderText(parts.value, start + parts.label.length + parts.sep.length)}
                {parts.bar ? <span className="vmx-sr-only">{parts.bar}</span> : null}
              </span>
              {block.range ? <span className={`vmx-rb-x${side}`} style={at}>{renderText(parts.range, start + parts.label.length + parts.sep.length + parts.value.length + parts.bar.length)}</span> : null}
            </Fragment>
          );
        })}
      </div>
    );
  }
  if (!block.lead) return grid;
  return (
    <div className="vmx-rb-group">
      <div className={block.lead.label ? 'vmx-rb-lead is-label' : 'vmx-rb-lead'}>{renderText(block.lead.text, block.lead.start)}</div>
      {grid}
    </div>
  );
}

/** A run of prose as its typed blocks, a gap between them instead of an empty line. */
export function ProseBlocks({ text, blocks, renderText = (t) => <RichText text={t} /> }) {
  const str = String(text ?? '');
  return (
    <div className="vmx-rb">
      {blocks.map((block) => <ProseBlock key={block.start} text={str} block={block} renderText={renderText} />)}
    </div>
  );
}

// A run of prose: as it always was when it is one paragraph, typeset otherwise.
function ProseRun({ text, renderText }) {
  const blocks = proseBlocks(text);
  if (blocks.length === 1 && blocks[0].type === 'para') return renderText(text);
  return <ProseBlocks text={text} blocks={blocks} renderText={renderText} />;
}

/**
 * A stem cut by splitStem (rich-blocks.js): the body drawn as blocks, then
 * the ask alone, in the element the surface uses for its heading. Every
 * surface that draws a stem with room for a body draws it through this, so
 * they agree on where the question starts. `stemRef` is the whole stem (the
 * read-aloud marks words in it by its text, and keeps it in view).
 */
export function SplitStem({ text, split, renderText = (t) => <RichText text={t} />, className = '', stemRef, ask }) {
  return (
    <div ref={stemRef} className={`vmx-qstem${className ? ` ${className}` : ''}`}>
      <div className="vmx-qstem-body"><ProseBlocks text={text} blocks={split.body} renderText={renderText} /></div>
      {ask(renderText(split.askText))}
    </div>
  );
}

/**
 * A stem on a surface with room for a body (the review list, the spaced
 * repetition card, the daily question): cut by splitStem into its body and
 * its ask, or, for every stem that is not cut, `whole` around the text
 * exactly as the surface drew it before.
 */
export function StemText({ text, ask, whole = ask, renderText = (t) => <RichText text={t} />, className = '' }) {
  const split = useMemo(() => splitStem(text), [text]);
  if (!split) return whole(renderText(text));
  return <SplitStem text={text} split={split} renderText={renderText} className={className} ask={ask} />;
}

/**
 * A passage or an explanation: its tables as tables, its prose typeset
 * (paragraphs, lists, label and value runs). A text that is one paragraph
 * with no table goes to `renderText` whole, as it always did.
 */
export default function RichBlocks({ text, renderText = (t) => <RichText text={t} /> }) {
  const blocks = useMemo(() => splitBlocks(text), [text]);
  if (blocks.length === 1 && blocks[0].type === 'text') return <ProseRun text={text} renderText={renderText} />;
  return blocks.map((b, i) => (b.type === 'table'
    ? <RichTable key={i} table={b} />
    : <ProseRun key={i} text={b.text} renderText={renderText} />));
}
