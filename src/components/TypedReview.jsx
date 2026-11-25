import { Fragment } from 'react';
import { RichText } from '../lib/richtext.jsx';
import { fillBlankReport } from '../hooks/utils.js';
import { fillStemParts, fillOrderNote } from '../lib/fill-stem.js';

// A typed answer as Review prints it: the sentence with the student's own words
// in its gaps. A right word stands plain; a wrong one is struck, with the key
// beside it, so the student sees which gap missed and what belonged there.

function Gap({ n, typed, blank }) {
  const text = String(typed ?? '').trim();
  return (
    <span className={`vmx-fill-gap is-typed ${blank.ok ? 'is-ok' : 'is-no'}`}>
      <span className="vmx-sr-only">{`ช่องที่ ${n}: `}</span>
      <span className="n" aria-hidden="true">{n}</span>
      {text
        ? <span className="t">{text}</span>
        : <span className="e">ไม่ได้เติม</span>}
      {blank.ok
        ? <span className="vmx-sr-only"> ถูก</span>
        : <><span className="vmx-sr-only"> ผิด เฉลย </span><span className="key"><RichText text={blank.key} /></span></>}
    </span>
  );
}

export function FillReview({ q, userAns, stem }) {
  const blanks = Array.isArray(q?.blanks) ? q.blanks : [];
  const answers = Array.isArray(userAns) ? userAns : [];
  const report = fillBlankReport(q, answers);
  const parts = fillStemParts(stem ?? q.q, blanks.length);
  const order = fillOrderNote(q);
  const altKeys = report.filter((b) => b.ok && b.alt).map((b) => b.key);
  return (
    <div className="vmx-review-ans vmx-fill-review">
      <div className="k">คำตอบของคุณ</div>
      {parts ? (
        <p className="vmx-fill-stem">
          {parts.texts.map((t, i) => (
            <Fragment key={i}>
              {t ? <RichText text={t} /> : null}
              {i < blanks.length ? <Gap n={i + 1} typed={answers[i]} blank={report[i]} /> : null}
            </Fragment>
          ))}
        </p>
      ) : (
        <ol className="vmx-fill-review-list">
          {blanks.map((_, i) => <li key={i}><Gap n={i + 1} typed={answers[i]} blank={report[i]} /></li>)}
        </ol>
      )}
      {order ? <p className="vmx-fill-order">{order}</p> : null}
      {altKeys.length > 0 && <p className="vmx-fill-altline">เฉลยเขียนว่า {altKeys.map((key, i) => <Fragment key={i}>{i ? ', ' : ''}<RichText text={key} /></Fragment>)}</p>}
    </div>
  );
}

/** Right and total blanks of a fill answer, for the badge "◐ 1/2". */
export function fillScore(q, userAns) {
  const report = fillBlankReport(q, userAns);
  return { correct: report.filter((b) => b.ok).length, total: report.length };
}
