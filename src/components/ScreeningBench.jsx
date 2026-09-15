// ============================================================
// ScreeningBench — what one positive result is actually worth
// ============================================================
// The instrument for sections 3 and 4 of Module 5. The lecture states two
// numbers and a student has no way to feel either: that a system can be
// "99% accurate" while finding none of the sick animals, and that a good
// test is wrong about most of the animals it calls positive as soon as the
// disease is rare. Here the four dials produce both.
//
// Vocabulary follows src/data/glossary.js, which the question bank and the
// term popovers already use: กลุ่มผลบวก, ผลบวกลวง, ความไว, ความจำเพาะ,
// ค่าทำนายผลบวก. A test gives a ผลบวก; it does not do anything to the animal.
//
// The maths is in lib/screening.js and is pinned against the slide's own
// printed table by tests/unit/screening.test.mjs.
import { useState, useMemo, useCallback, useId } from 'react';
import { screeningTable, ppvCurve, LECTURE_SCENARIOS } from '../lib/screening.js';

const nf = (v) => Math.round(v).toLocaleString('en-US');
const pct1 = (v) => `${(v * 100).toFixed(1)}%`;
const pct0 = (v) => `${Math.round(v * 100)}%`;

const SIZES = [1000, 10000, 100000];

// At most this many dots are drawn. Past it each dot stands for several
// animals and the scale is printed, because 40,000 elements would say
// nothing extra and would cost a phone its frame rate.
const MAX_DOTS = 600;

function Dial({ label, hint, value, min, max, step, onChange, format, tone }) {
  const id = useId();
  return (
    <div className="vmx-bench-dial">
      <label className="vmx-bench-dial__head" htmlFor={id}>
        <span className="vmx-bench-dial__label">{label}</span>
        <output className={`vmx-bench-dial__value vmx-bench-dial__value--${tone}`} htmlFor={id}>
          {format(value)}
        </output>
      </label>
      <input
        id={id}
        type="range"
        className={`vmx-bench-range vmx-bench-range--${tone}`}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <p className="vmx-bench-dial__hint">{hint}</p>
    </div>
  );
}

/** The positive group, one dot per animal (or per k animals when the group
 *  outgrows the field). Truly diseased first, so the eye reads a proportion
 *  rather than a texture. */
function PositiveField({ table }) {
  const { flagged, tp, fp } = table;
  const perDot = Math.max(1, Math.ceil(flagged / MAX_DOTS));
  const dots = Math.ceil(flagged / perDot);
  const hitDots = Math.round(tp / perDot);

  if (flagged === 0) {
    return (
      <p className="vmx-bench-field__empty">
        ไม่มีสัตว์ตัวใดให้ผลบวกเลย จึงไม่มีกลุ่มผลบวกให้คิดสัดส่วน
      </p>
    );
  }

  return (
    <figure className="vmx-bench-field">
      <figcaption className="vmx-bench-field__caption">
        ให้ผลบวกทั้งหมด <b>{nf(flagged)}</b> ตัว ในจำนวนนี้เป็นโรคจริง{' '}
        <b className="vmx-bench-hit">{nf(tp)}</b> ตัว และเป็นผลบวกลวง{' '}
        <b className="vmx-bench-miss">{nf(fp)}</b> ตัว
        {perDot > 1 && <span className="vmx-bench-field__scale"> (หนึ่งจุดแทน {nf(perDot)} ตัว)</span>}
      </figcaption>
      <div
        className="vmx-bench-field__grid"
        role="img"
        aria-label={`ในสัตว์ที่ให้ผลบวก ${nf(flagged)} ตัว เป็นโรคจริง ${nf(tp)} ตัว ที่เหลือ ${nf(fp)} ตัวเป็นผลบวกลวง`}
      >
        {Array.from({ length: dots }, (_, i) => (
          <span
            key={i}
            className={`vmx-bench-dot ${i < hitDots ? 'is-hit' : 'is-false'}`}
            style={{ '--d': `${Math.min(i, 120) * 4}ms` }}
          />
        ))}
      </div>
    </figure>
  );
}

/** Predictive value against prevalence, with this test held still. Log x,
 *  because everything that matters happens below 10%. */
function PrevalenceCurve({ sensitivity, specificity, prevalence, ppv, showNow = true }) {
  const W = 520;
  const H = 190;
  const PAD = { l: 40, r: 12, t: 14, b: 28 };
  const FROM = 0.001;
  const TO = 0.5;

  const points = useMemo(
    () => ppvCurve({ sensitivity, specificity, from: FROM, to: TO, steps: 72 }),
    [sensitivity, specificity],
  );

  const x = useCallback((p) => {
    const lo = Math.log(FROM);
    const hi = Math.log(TO);
    const t = (Math.log(Math.min(TO, Math.max(FROM, p))) - lo) / (hi - lo);
    return PAD.l + t * (W - PAD.l - PAD.r);
  }, [PAD.l, PAD.r]);
  const y = useCallback((v) => PAD.t + (1 - v) * (H - PAD.t - PAD.b), [PAD.t, PAD.b]);

  const d = points
    .filter((pt) => pt.ppv !== null)
    .map((pt, i) => `${i === 0 ? 'M' : 'L'}${x(pt.prevalence).toFixed(1)},${y(pt.ppv).toFixed(1)}`)
    .join(' ');

  const ticks = [0.001, 0.01, 0.1, 0.5];
  const inRange = prevalence >= FROM && prevalence <= TO;

  // A test that can never give a positive result has no predictive value to
  // plot at any prevalence. Empty axes would read as a broken chart rather
  // than as the answer, which here is that the question does not arise.
  if (!d) {
    return (
      <p className="vmx-bench-field__empty">
        เครื่องมือนี้ไม่ให้ผลบวกเลยไม่ว่าโรคจะชุกเท่าไร จึงไม่มีค่าทำนายผลบวกให้เขียนเป็นกราฟ
      </p>
    );
  }

  return (
    <figure className="vmx-bench-curve">
      <figcaption className="vmx-bench-curve__caption">
        ถ้านำเครื่องมือเดิมนี้ (ความไว {pct0(sensitivity)} ความจำเพาะ {pct0(specificity)}) ไปใช้กับฝูงที่โรคชุกต่างกัน
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="vmx-bench-curve__svg"
        role="img"
        aria-label={`กราฟค่าทำนายผลบวกเทียบกับความชุก ที่ความชุก ${pct1(prevalence)} ค่าทำนายผลบวกเท่ากับ ${ppv === null ? 'ไม่นิยาม' : pct1(ppv)}`}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} className="vmx-bench-curve__grid" />
            <text x={PAD.l - 6} y={y(v) + 4} className="vmx-bench-curve__axis" textAnchor="end">{pct0(v)}</text>
          </g>
        ))}
        {ticks.map((t) => (
          <text key={t} x={x(t)} y={H - 8} className="vmx-bench-curve__axis" textAnchor="middle">
            {t < 0.01 ? '0.1%' : pct0(t)}
          </text>
        ))}
        <path d={d} className="vmx-bench-curve__line" />
        {showNow && inRange && ppv !== null && (
          <g>
            <line x1={x(prevalence)} x2={x(prevalence)} y1={y(ppv)} y2={H - PAD.b} className="vmx-bench-curve__drop" />
            <circle cx={x(prevalence)} cy={y(ppv)} r="5" className="vmx-bench-curve__now" />
          </g>
        )}
      </svg>
      <p className="vmx-bench-curve__axis-title">ความชุกของโรคในฝูงที่คัดกรอง (แกนลอการิทึม)</p>
    </figure>
  );
}

export default function ScreeningBench({ preset = 0 }) {
  const start = LECTURE_SCENARIOS[preset]?.input || LECTURE_SCENARIOS[0].input;
  const [n, setN] = useState(start.n);
  const [prevalence, setPrevalence] = useState(start.prevalence * 100);
  const [sensitivity, setSensitivity] = useState(start.sensitivity * 100);
  const [specificity, setSpecificity] = useState(start.specificity * 100);
  const [guess, setGuess] = useState(null);
  const [committed, setCommitted] = useState(null);

  const table = useMemo(
    () => screeningTable({
      n,
      prevalence: prevalence / 100,
      sensitivity: sensitivity / 100,
      specificity: specificity / 100,
    }),
    [n, prevalence, sensitivity, specificity],
  );

  const applyScenario = useCallback((s) => {
    setN(s.input.n);
    setPrevalence(s.input.prevalence * 100);
    setSensitivity(s.input.sensitivity * 100);
    setSpecificity(s.input.specificity * 100);
    setGuess(null);
    setCommitted(null);
  }, []);

  // Moving a dial invalidates a committed guess — it was a guess about a
  // different test.
  // A guess was about a different test, so it ends: readout back, slider
  // gone. Nulling only `committed` kept the slider and hid the answer on
  // every move after the first reveal.
  const onDial = useCallback((setter) => (v) => {
    setter(v);
    setCommitted(null);
    setGuess(null);
  }, []);

  const hidden = guess !== null && committed === null;

  return (
    <div className="vmx-bench">
      <div className="vmx-bench__scenarios">
        {LECTURE_SCENARIOS.map((s) => (
          <button key={s.id} type="button" className="vmx-bench-scenario" onClick={() => applyScenario(s)}>
            <span className="vmx-bench-scenario__label">{s.label}</span>
            <span className="vmx-bench-scenario__note">{s.note}</span>
          </button>
        ))}
      </div>

      <div className="vmx-bench__body">
        <div className="vmx-bench__controls">
          <Dial
            label="ความชุกของโรค" tone="gold" value={prevalence} min={0.1} max={50} step={0.1}
            onChange={onDial(setPrevalence)} format={(v) => `${v.toFixed(1)}%`}
            hint="สัดส่วนสัตว์ที่เป็นโรคจริงในฝูงที่นำมาคัดกรอง"
          />
          <Dial
            label="ความไว (sensitivity)" tone="hit" value={sensitivity} min={0} max={100} step={1}
            onChange={onDial(setSensitivity)} format={(v) => `${v}%`}
            hint="ในสัตว์ที่เป็นโรค เครื่องมือตรวจได้ผลบวกกี่เปอร์เซ็นต์"
          />
          <Dial
            label="ความจำเพาะ (specificity)" tone="miss" value={specificity} min={0} max={100} step={1}
            onChange={onDial(setSpecificity)} format={(v) => `${v}%`}
            hint="ในสัตว์ที่ไม่เป็นโรค เครื่องมือตรวจได้ผลลบกี่เปอร์เซ็นต์"
          />
          <div className="vmx-bench-sizes">
            <span className="vmx-bench-dial__label">จำนวนที่คัดกรอง</span>
            <div className="vmx-bench-sizes__row" role="group" aria-label="จำนวนสัตว์ที่คัดกรอง">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`vmx-bench-size ${n === s ? 'is-on' : ''}`}
                  aria-pressed={n === s}
                  onClick={() => { setN(s); setCommitted(null); setGuess(null); }}
                >
                  {nf(s)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="vmx-bench__readout">
          <div className="vmx-bench-headline">
            <div className="vmx-bench-headline__main">
              <p className="vmx-bench-headline__label">ในกลุ่มผลบวก เป็นโรคจริงกี่เปอร์เซ็นต์ (ค่าทำนายผลบวก)</p>
              {hidden ? (
                <div className="vmx-bench-guess">
                  <output className="vmx-bench-guess__value">{guess}%</output>
                  <input
                    type="range" min="0" max="100" step="1" value={guess}
                    className="vmx-bench-range vmx-bench-range--gold"
                    aria-label="เดาค่าทำนายผลบวก"
                    onChange={(e) => setGuess(Number(e.target.value))}
                  />
                  <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={() => setCommitted(guess)}>
                    ดูคำตอบ
                  </button>
                </div>
              ) : (
                <p className={`vmx-bench-headline__value ${table.ppv !== null && table.ppv < 0.5 ? 'is-low' : ''}`}>
                  {table.ppv === null ? '—' : pct1(table.ppv)}
                </p>
              )}
              {committed !== null && (
                <p className="vmx-bench-guess__verdict">
                  คุณเดาไว้ <b>{committed}%</b> ค่าจริงคือ{' '}
                  <b>{table.ppv === null ? 'ไม่นิยาม' : pct1(table.ppv)}</b>
                  {table.ppv !== null && <> ต่างกัน {Math.abs(committed - table.ppv * 100).toFixed(1)} จุด</>}
                </p>
              )}
              {!hidden && committed === null && (
                <button type="button" className="vmx-bench-guess__start" onClick={() => setGuess(50)}>
                  ลองเดาก่อนดูคำตอบ
                </button>
              )}
            </div>
            <dl className="vmx-bench-headline__side">
              <div>
                <dt>ถูกต้องโดยรวม</dt>
                <dd>{pct1(table.accuracy)}</dd>
              </div>
              <div>
                <dt>ค่าทำนายผลลบ</dt>
                <dd>{table.npv === null ? '—' : pct1(table.npv)}</dd>
              </div>
              <div>
                <dt>ผลบวกลวงต่อการเจอจริงหนึ่งตัว</dt>
                <dd>{hidden || table.falseAlertsPerHit === null ? '—' : `${table.falseAlertsPerHit.toFixed(1)} ตัว`}</dd>
              </div>
            </dl>
          </div>

          {!hidden && <PositiveField table={table} />}

          {hidden ? <p className="vmx-bench-field__empty">ตาราง 2x2 จะแสดงหลังกดดูคำตอบ</p> : (
          <table className="vmx-bench-table">
            <caption className="vmx-bench-table__caption">
              จากสัตว์ {nf(table.n)} ตัว เป็นโรคจริง {nf(table.diseased)} ตัว
            </caption>
            <thead>
              <tr>
                <th scope="col"><span className="vmx-sr-only">ผลการตรวจ</span></th>
                <th scope="col">เป็นโรค</th>
                <th scope="col">ไม่เป็นโรค</th>
                <th scope="col">รวม</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">ผลบวก</th>
                <td className="is-hit">{nf(table.tp)}</td>
                <td className="is-false">{nf(table.fp)}</td>
                <td>{nf(table.flagged)}</td>
              </tr>
              <tr>
                <th scope="row">ผลลบ</th>
                <td className="is-missed">{nf(table.fn)}</td>
                <td>{nf(table.tn)}</td>
                <td>{nf(table.notFlagged)}</td>
              </tr>
              <tr className="vmx-bench-table__total">
                <th scope="row">รวม</th>
                <td>{nf(table.diseased)}</td>
                <td>{nf(table.healthy)}</td>
                <td>{nf(table.n)}</td>
              </tr>
            </tbody>
          </table>
          )}

          <PrevalenceCurve
            showNow={!hidden}
            sensitivity={sensitivity / 100}
            specificity={specificity / 100}
            prevalence={prevalence / 100}
            ppv={table.ppv}
          />
        </div>
      </div>
    </div>
  );
}
