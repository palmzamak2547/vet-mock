// ============================================================
// PredictSet — one coming paper drawn as its parts
// ============================================================
// The head is a chart, not a picture: one ring per part of the paper, the
// first part outermost, its colour the part's format and its length how firm
// the evidence for that part is. Under it, the whole paper on the paper's own
// clock, then one card per part: its format, how firm the forecast is, and
// the questions to practise. What each forecast rests on (lecturer, session,
// evidence, where its questions come from) lives in one folded row under the
// cards, as every source on a screen does (AGENTS.md, Quiet screens rule 3).
// Every number on a button is the length of the list the tap serves
// (predict-sets.js, checked against the banks by a unit test).
// ============================================================
import { PREDICT_FORMAT_LABEL } from '../data/predict-sets.js';
import '../styles-predict.css';

const TH_MONTH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const thaiDate = (iso) => {
  const [, m, d] = String(iso || '').split('-').map(Number);
  return m ? `${d} ${TH_MONTH[m - 1]}` : '';
};

const FORMAT_TONE = { tf: 'sage', mcq: 'gold', short: 'rose' };
const CONFIDENCE_LABEL = { 3: 'หลักฐานแน่น', 2: 'หลักฐานพอใช้', 1: 'หลักฐานน้อย' };
// The longest ring stops short of a full turn so its round cap never meets
// its own start; a weaker part draws a shorter arc of the same circle.
const RING_MAX = 86;

function Rings({ parts, total }) {
  return (
    <svg className="vmx-predict-rings" viewBox="0 0 200 200" role="img"
      aria-label={`ข้อสอบที่คาด ${parts.length} ส่วน รวม ${total} ข้อ วงนอกสุดคือส่วนแรก สีบอกรูปแบบ ความยาววงบอกความแน่นของหลักฐาน`}>
      <g transform="rotate(-90 100 100)">
        {parts.map((p, i) => {
          const r = 90 - i * 8.4;
          return (
            <g key={p.id}>
              <circle className="vmx-predict-track" cx="100" cy="100" r={r} pathLength="100" />
              <circle
                className={`vmx-predict-arc is-${FORMAT_TONE[p.format]}`}
                cx="100" cy="100" r={r} pathLength="100"
                strokeDasharray={`${Math.round((RING_MAX * p.confidence) / 3)} 100`}
                style={{ '--i': i }}
              />
            </g>
          );
        })}
      </g>
      <text className="vmx-predict-total" x="100" y="106" textAnchor="middle">{total}</text>
      <text className="vmx-predict-unit" x="100" y="127" textAnchor="middle">ข้อ</text>
    </svg>
  );
}

// Where a part's questions come from, as a bar and its key: a senior paper,
// seniors' notes and marks, or this year's recording.
function Mix({ part }) {
  const rows = [
    ['past', 'ข้อสอบเก่า', part.past],
    ['notes', 'เอกสารรุ่นพี่', part.ids.length - part.past - part.fresh],
    ['fresh', 'คาบปีนี้', part.fresh],
  ].filter(([, , n]) => n > 0);
  return (
    <div className="vmx-predict-mix">
      <div className="vmx-predict-mixbar" aria-hidden="true">
        {rows.map(([k, , n]) => <span key={k} className={`is-${k}`} style={{ flexGrow: n }} />)}
      </div>
      <ul role="list" aria-label="ที่มาของข้อในส่วนนี้">
        {rows.map(([k, label, n]) => <li key={k} className={`is-${k}`}>{label} {n} ข้อ</li>)}
      </ul>
    </div>
  );
}

export default function PredictSet({ set, subject, onStart }) {
  if (!set || typeof onStart !== 'function') return null;
  const all = set.parts.flatMap((p) => p.ids);
  // A part whose lecturer named more items than the banks hold shows the named count on its tag, in the legend
  // and in the ring total (`announced`); its button still says how many it serves, and the whole-paper button
  // says that some parts are short instead of printing a count it does not serve.
  const size = (p) => p.announced ?? p.count;
  const paper = set.parts.reduce((n, p) => n + size(p), 0);
  const byFormat = ['tf', 'mcq', 'short']
    .map((f) => [f, set.parts.filter((p) => p.format === f).reduce((n, p) => n + size(p), 0)])
    .filter(([, n]) => n > 0);
  const startPart = (ids, format) => onStart({
    subjectId: subject, ids, timePerQ: format === 'tf' ? 45 : 60, timed: format !== 'short',
  });
  // On a phone the parts are one swiped row. Tabbing into a card that only
  // peeks in at the edge brings the whole card in: left alone, the browser
  // scrolls just enough to show the button and the row snaps back to the card
  // before it, hiding the focused button. The page itself does not move.
  // Keyboard focus only: a tap focuses the button too, and moving the row
  // between press and release would send the tap to whatever slid under it.
  const bringPartIn = (e) => {
    const rail = e.currentTarget;
    const card = e.target.closest('.vmx-predict-part');
    if (!card || rail.scrollWidth <= rail.clientWidth) return;
    let keyboard = false;
    try { keyboard = e.target.matches(':focus-visible'); } catch { /* an older browser: leave its own scrolling */ }
    if (!keyboard) return;
    rail.scrollTo({ left: rail.scrollLeft + card.getBoundingClientRect().left - rail.getBoundingClientRect().left });
  };

  return (
    <section className="vmx-predict" aria-labelledby="vmx-predict-title">
      <div className="vmx-predict-hero">
        <div className="vmx-predict-head">
          <p className="vmx-predict-eyebrow">Predict ปลายภาค</p>
          <h2 id="vmx-predict-title">ชุดคาดการณ์ข้อสอบ</h2>
          <p className="vmx-predict-when">สอบ {thaiDate(set.examDate)} {set.minutes} นาที {set.parts.length} ส่วน</p>
        </div>
        <Rings parts={set.parts} total={paper} />
        <ul className="vmx-predict-legend" role="list" aria-label="จำนวนข้อตามรูปแบบ">
          {byFormat.map(([f, n]) => (
            <li key={f} className={`is-${FORMAT_TONE[f]}`}>{PREDICT_FORMAT_LABEL[f]} {n} ข้อ</li>
          ))}
        </ul>
        <button
          type="button"
          className="vmx-predict-go"
          onClick={() => onStart({ subjectId: subject, ids: all, whole: true, budget: set.minutes * 60 })}
        >
          ทำทั้งฉบับ {all.length} ข้อ จับเวลา {set.minutes} นาที
          <span><span>เรียงทีละส่วน</span> {all.length < paper && <><span>บางส่วนยังมีข้อไม่ครบ</span> </>}<span>เฉลยหลังส่ง</span></span>
        </button>
      </div>

      <ol className="vmx-predict-parts" role="list" onFocus={bringPartIn}>
        {set.parts.map((p, i) => (
          <li key={p.id} className={`vmx-predict-part is-${FORMAT_TONE[p.format]}`}>
            <span className="vmx-predict-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h3>{p.title}</h3>
            <div className="vmx-predict-tags">
              <span className="vmx-predict-fmt">{PREDICT_FORMAT_LABEL[p.format]} {size(p)} ข้อ</span>
              <span className="vmx-predict-conf" data-level={p.confidence}>
                <span className="bars" aria-hidden="true"><i /><i /><i /></span>
                {CONFIDENCE_LABEL[p.confidence]}
              </span>
            </div>
            <div className="vmx-predict-acts">
              <button type="button" className="vmx-lect-btn is-primary" onClick={() => startPart(p.ids, p.format)}>
                ฝึกส่วนนี้ {p.ids.length} ข้อ<span className="vmx-sr-only"> {p.title}</span>
              </button>
              {p.extra.length > 0 && (
                <button type="button" className="vmx-lect-btn" onClick={() => startPart(p.extra, p.format)}>
                  ข้อเสริม {p.extra.length} ข้อ<span className="vmx-sr-only"> {p.title}</span>
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>

      <details className="vmx-topic-prov vmx-predict-why">
        <summary>ที่มาของการคาดการณ์แต่ละส่วน</summary>
        <p>{set.basis}</p>
        <ol role="list">
          {set.parts.map((p, i) => (
            <li key={p.id} className={`is-${FORMAT_TONE[p.format]}`}>
              <p><b>{String(i + 1).padStart(2, '0')} {p.title}</b> <span>{p.lecturer}, คาบ {thaiDate(p.session)}</span></p>
              <ul className="vmx-predict-ev" role="list">
                {p.evidence.map((line) => <li key={line}>{line}</li>)}
              </ul>
              <Mix part={p} />
            </li>
          ))}
        </ol>
      </details>
    </section>
  );
}
