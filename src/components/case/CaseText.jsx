import { forwardRef, useMemo } from 'react';
import { proseBlocks, splitBlocks } from '../../lib/rich-blocks.js';
import { segmentsFor } from '../../lib/case-marks.js';
import { ProseBlocks, RichTable } from '../RichBlocks.jsx';

// ============================================================
// CaseText — a case's passage, typeset, with its highlights laid in
// ============================================================
// The pane and the reading sheet draw the passage through this one component
// with the typeset blocks of 5.236.0 (rich-blocks.js proseBlocks, RichBlocks
// ProseBlocks and RichTable): paragraphs, label and value pairs, result rows,
// lists and tables. No character is added, dropped or reordered, and no word
// is emphasised that the paper did not emphasise.
//
// Every piece of prose is a <span data-off> holding the passage's characters
// from that offset on, so a highlight (a text range) lands on the same words
// in the pane, on the sheet, after rotation and at any text size.
// ============================================================

function PieceAt({ str, at, ranges }) {
  return (
    <span data-off={at}>
      {segmentsFor(str, at, ranges).map((seg, i) => (seg.mark
        ? <mark key={`${seg.mark.id}:${i}`} data-mark={seg.mark.id} className={`vmx-case-mark is-${seg.mark.color || 'lemon'}`}>{seg.text}</mark>
        : <span key={i}>{seg.text}</span>))}
    </span>
  );
}

const CaseText = forwardRef(function CaseText({ text, ranges = [], labelledBy, className = '' }, ref) {
  const runs = useMemo(() => splitBlocks(text).map((b) => (b.type === 'table' ? b : { ...b, blocks: proseBlocks(b.text) })), [text]);
  return (
    <div ref={ref} className={`vmx-case-text${className ? ` ${className}` : ''}`}>
      {runs.map((run) => (run.type === 'table'
        ? <RichTable key={`t${run.start}`} table={run} labelledBy={labelledBy} />
        : (
          <ProseBlocks
            key={`p${run.start}`}
            text={run.text}
            blocks={run.blocks}
            renderText={(str, off = 0) => <PieceAt str={str} at={run.start + off} ranges={ranges} />}
          />
        )))}
    </div>
  );
});

export default CaseText;
