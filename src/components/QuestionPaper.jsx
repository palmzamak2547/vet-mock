import { Fragment } from 'react';
import { createPortal } from 'react-dom';
import { StemText } from './RichBlocks.jsx';
import { SUBJECTS } from '../data/curriculum.js';

// A question set as a printed exam paper. Only the print stylesheet shows it
// (src/styles-print.css, loaded by print-document.js); on a screen it stays
// hidden. Three forms: 'paper' (questions only), 'key' (answers at the end),
// 'reasons' (the answer and its reason under each question).

export const PAPER_FORMS = [
  { id: 'paper', label: 'ข้อสอบอย่างเดียว' },
  { id: 'key', label: 'เฉลยอยู่ท้ายเล่ม' },
  { id: 'reasons', label: 'เฉลยพร้อมเหตุผลใต้ข้อ' },
];

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SIDE = ['ก', 'ข', 'ค', 'ง', 'จ', 'ฉ', 'ช', 'ซ'];

export function paperTitle(questions) {
  const ids = [...new Set(questions.map(q => q.subject).filter(Boolean))];
  if (ids.length === 1) {
    const s = SUBJECTS.find(x => x.id === ids[0]);
    if (s) return { title: 'ชุดข้อสอบ', subject: s.name };
  }
  return { title: 'ชุดข้อสอบ', subject: ids.length > 1 ? 'หลายวิชา' : '' };
}

// The right-hand column of a matching item: the pairs' answers (and any
// distractors) in a fixed order that is not the order of the left column.
export function matchSide(q) {
  const pairs = q.pairs || [];
  const rights = pairs.map(p => p.right).concat(q.distractors || []);
  const order = rights.map((_, i) => i);
  if (pairs.length > 1) {
    const shift = Math.min(1, pairs.length - 1);
    order.splice(0, pairs.length, ...order.slice(0, pairs.length).map((_, i, a) => a[(i + shift) % a.length]));
  }
  return order.map(i => rights[i]);
}

export function answerOf(q) {
  if (q.type === 'mcq') return typeof q.answer === 'number' ? LETTERS[q.answer] : String(q.answer ?? '');
  if (q.type === 'tf') return q.answer === true || q.answer === 'true' ? 'ถูก' : 'ผิด';
  if (q.type === 'fill') return (q.blanks || []).join(', ');
  if (q.type === 'match') {
    const side = matchSide(q);
    return (q.pairs || []).map((p, i) => `${i + 1}${SIDE[side.indexOf(p.right)] || ''}`).join(' ');
  }
  return String(q.model_answer || q.answer || '');
}

function Body({ q }) {
  if (q.type === 'mcq') {
    return (
      <ol className="vmx-paper-opts">
        {(q.options || []).map((o, i) => <li key={i} data-letter={LETTERS[i]}>{o}</li>)}
      </ol>
    );
  }
  if (q.type === 'tf') {
    return (
      <ol className="vmx-paper-opts">
        <li data-letter="A">ถูก</li>
        <li data-letter="B">ผิด</li>
      </ol>
    );
  }
  if (q.type === 'match') {
    const side = matchSide(q);
    return (
      <div className="vmx-paper-match">
        <ol>{(q.pairs || []).map((p, i) => <li key={i} data-letter={String(i + 1)}>{p.left}</li>)}</ol>
        <ol>{side.map((r, i) => <li key={i} data-letter={SIDE[i]}>{r}</li>)}</ol>
      </div>
    );
  }
  const lines = q.type === 'essay' ? 8 : q.type === 'short' ? 3 : Math.max(1, (q.blanks || []).length);
  return (
    <div className="vmx-paper-lines" aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => <span key={i} />)}
    </div>
  );
}

function Key({ items }) {
  const cols = 3;
  const rows = Math.ceil(items.length / cols);
  const grid = Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => items[c * rows + r] || null));
  return (
    <table className="vmx-paper-key">
      <thead>
        <tr>{Array.from({ length: cols }, (_, c) => <Fragment key={c}><th>ข้อ</th><th>เฉลย</th></Fragment>)}</tr>
      </thead>
      <tbody>
        {grid.map((row, r) => (
          <tr key={r}>
            {row.map((cell, c) => <Fragment key={c}><td>{cell ? cell.n : ''}</td><td>{cell ? cell.a : ''}</td></Fragment>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// A long stem prints as the card draws it: its body as blocks, then the ask (RichBlocks.jsx StemText).
// The paper prints the text as stored, so its blocks hold plain text.
const plainText = (t) => t;
const paperStem = (content) => <p className="vmx-paper-stem">{content}</p>;

export default function QuestionPaper({ questions, form }) {
  const { title, subject } = paperTitle(questions);
  const items = questions.map((q, i) => ({ n: i + 1, a: answerOf(q) }));
  return createPortal(
    <div className="vmx-paper-host" hidden>
      <article className="vmx-paper" data-form={form}>
        <header>
          <h1>{title}</h1>
          <p>{[subject, `${questions.length} ข้อ`].filter(Boolean).join(' ')}</p>
        </header>
        <ol className="vmx-paper-list">
          {questions.map((q, i) => (
            <li key={q.id ?? i} className="vmx-paper-q" data-n={i + 1}>
              <StemText text={q.q} renderText={plainText} ask={paperStem} />
              {q.image ? <img className="vmx-paper-fig" src={q.image} alt="" /> : null}
              <Body q={q} />
              {form === 'reasons' ? (
                <p className="vmx-paper-why"><b>เฉลย {answerOf(q)}</b>{q.explain ? <> {q.explain}</> : null}</p>
              ) : null}
            </li>
          ))}
        </ol>
        {form === 'key' ? <section className="vmx-paper-answers"><Key items={items} /></section> : null}
      </article>
    </div>,
    document.body,
  );
}
