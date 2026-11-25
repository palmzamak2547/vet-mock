import { Fragment } from 'react';
import { RichText } from '../lib/richtext.jsx';
import { fillBlankReport, tfcOutcome } from '../hooks/utils.js';
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

/** The key of a tfc item in words: the verdict, the word that puts the statement right, and the
 *  corrected sentence with that word marked. */
export function TfcKey({ q }) {
  if (q.answer === true) return <>ถูก</>;
  const right = typeof q.fix?.right === 'string' ? q.fix.right : '';
  const sentence = typeof q.fix?.sentence === 'string' ? q.fix.sentence : '';
  const at = right ? sentence.indexOf(right) : -1;
  return (
    <>
      <span>ผิด{right ? <>, แก้เป็น <b><RichText text={right} /></b></> : null}</span>
      {sentence ? (
        <span className="vmx-tfc-sentence">
          {at === -1 ? <RichText text={sentence} /> : <>{sentence.slice(0, at)}<mark>{right}</mark>{sentence.slice(at + right.length)}</>}
        </span>
      ) : null}
      {q.fix?.selfCheck === true ? <span className="vmx-tfc-self">ข้อนี้นับคะแนนจากถูกหรือผิด ส่วนคำที่แก้ให้เทียบกับเฉลยเอง</span> : null}
    </>
  );
}

/** A tfc answer as Review prints it: what the student said, then the key. */
export function TfcReview({ q, userAns }) {
  const o = tfcOutcome(q, userAns);
  const said = Array.isArray(userAns) ? userAns[0] : null;
  const text = said === 'F' && typeof userAns[1] === 'string' ? userAns[1].trim() : '';
  // Struck: a correction that is off, or one written for a statement that was true.
  const struck = said === 'F' && (q.answer === true || o.fix === 'off');
  return (
    <>
      <div className={`vmx-review-ans ${o.correct ? 'correct-ans' : 'wrong-ans'}`}>
        <span className="k">คุณตอบ:</span>
        {said === 'T' ? 'ถูก' : text ? <>ผิด, แก้เป็น <span className={struck ? 'vmx-tfc-struck' : undefined}>{text}</span></> : 'ผิด, ไม่ได้เขียนแก้'}
      </div>
      {(!o.correct || q.answer === false) && (
        <div className="vmx-review-ans correct-ans vmx-tfc-key"><span className="k">เฉลย:</span><TfcKey q={q} /></div>
      )}
    </>
  );
}

/** The two parts of a tfc answer, for the badge: "◐ 1/2" is a right verdict with a correction that is off. */
export function tfcScore(q, userAns) {
  const o = tfcOutcome(q, userAns);
  return { correct: o.correct ? 2 : o.verdict && o.fix === 'off' ? 1 : 0, total: 2 };
}

/** Right and total blanks of a fill answer, for the badge "◐ 1/2". */
export function fillScore(q, userAns) {
  const report = fillBlankReport(q, userAns);
  return { correct: report.filter((b) => b.ok).length, total: report.length };
}
