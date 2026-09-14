// ============================================================
// BenchView — what a positive result is actually worth
// ============================================================
// Built from Module 5 of Veterinary Epidemiology (3107508, อ.ชัยเดช
// อินทร์ไชยศรี, 2026/1), which makes two claims with numbers attached:
// a system can be "99% accurate" while finding none of the sick animals,
// and a good test can still be wrong about most of the animals it flags.
//
// A slide can only assert those. Here every figure on screen is computed
// from four dials, so the student moves prevalence and watches the alert
// they would act on turn mostly false — which is the part that does not
// survive being read once and forgotten.
//
// The maths lives in lib/screening.js and is pinned against the slide's own
// printed table by tests/unit/screening.test.mjs.
import { useState, useMemo, useCallback, useId } from 'react';
import { screeningTable, ppvCurve, LECTURE_SCENARIOS } from '../lib/screening.js';

const nf = (v) => Math.round(v).toLocaleString('en-US');
const pct1 = (v) => `${(v * 100).toFixed(1)}%`;
const pct0 = (v) => `${Math.round(v * 100)}%`;

// Population sizes offered as buttons rather than a free field: the bench is
// about the ratio, and a typed 7 would spend the student's attention on
// rounding artefacts instead of on prevalence.
const SIZES = [1000, 10000, 100000];

// At most this many dots are drawn. Beyond it each dot stands for several
// animals and the scale is printed — a field of 40,000 elements would say
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

/** The flagged group, one dot per animal (or per k animals when the group is
 *  larger than the field). Truly diseased first, so the eye reads a
 *  proportion instead of a texture. */
function FlaggedField({ table }) {
  const { flagged, tp, fp } = table;
  const perDot = Math.max(1, Math.ceil(flagged / MAX_DOTS));
  const dots = Math.ceil(flagged / perDot);
  const hitDots = Math.round(tp / perDot);

  if (flagged === 0) {
    return (
      <p className="vmx-bench-field__empty">
        เครื่องมือนี้ไม่ปลุกสัตว์ตัวไหนเลย จึงไม่มีกลุ่ม “ผลบวก” ให้คิดสัดส่วน
      </p>
    );
  }

  return (
    <figure className="vmx-bench-field">
      <figcaption className="vmx-bench-field__caption">
        ปลุกมาทั้งหมด <b>{nf(flagged)}</b> ตัว — เป็นโรคจริง{' '}
        <b className="vmx-bench-hit">{nf(tp)}</b> ตัว, ปลุกผิด{' '}
        <b className="vmx-bench-miss">{nf(fp)}</b> ตัว
        {perDot > 1 && <span className="vmx-bench-field__scale"> · 1 จุด = {nf(perDot)} ตัว</span>}
      </figcaption>
      <div
        className="vmx-bench-field__grid"
        role="img"
        aria-label={`จากสัตว์ที่ถูกปลุก ${nf(flagged)} ตัว เป็นโรคจริง ${nf(tp)} ตัว ที่เหลือ ${nf(fp)} ตัวเป็นการปลุกผิด`}
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

/** PPV against prevalence, with this test held still. Log x, because
 *  everything that matters happens below 10%. */
function PrevalenceCurve({ sensitivity, specificity, prevalence, ppv }) {
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

  // A test that can never flag anything has no predictive value to plot at
  // any prevalence. Drawing the empty axes would read as a broken chart
  // rather than as the answer, which here is that the question does not
  // arise.
  if (!d) {
    return (
      <p className="vmx-bench-field__empty">
        เครื่องมือนี้ไม่ปลุกสัตว์ตัวไหนเลยไม่ว่าโรคจะชุกเท่าไร จึงไม่มีค่าทำนายผลบวกให้เขียนเป็นกราฟ
      </p>
    );
  }

  return (
    <figure className="vmx-bench-curve">
      <figcaption className="vmx-bench-curve__caption">
        ถ้าเครื่องมือเดิม (Se {pct0(sensitivity)} · Sp {pct0(specificity)}) ไปใช้กับฝูงที่โรคชุกต่างกัน
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="vmx-bench-curve__svg" role="img"
        aria-label={`กราฟค่าทำนายผลบวกเทียบกับความชุก ที่ความชุก ${pct1(prevalence)} ค่าทำนายผลบวกเท่ากับ ${ppv === null ? 'ไม่นิยาม' : pct1(ppv)}`}>
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
        {d && <path d={d} className="vmx-bench-curve__line" />}
        {inRange && ppv !== null && (
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

export default function BenchView({ goHome }) {
  const [n, setN] = useState(10000);
  const [prevalence, setPrevalence] = useState(1);      // percent
  const [sensitivity, setSensitivity] = useState(90);   // percent
  const [specificity, setSpecificity] = useState(95);   // percent
  const [guess, setGuess] = useState(null);             // null = not guessing
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

  // Changing a dial invalidates a committed guess — it was a guess about a
  // different test.
  const onDial = useCallback((setter) => (v) => {
    setter(v);
    setCommitted(null);
  }, []);

  const hidden = guess !== null && committed === null;

  return (
    <div className="vmx-bench">
      <header className="vmx-bench__head">
        <p className="vmx-bench__eyebrow">ระบาดวิทยา · โต๊ะทดลอง</p>
        <h1 className="vmx-bench__title">ผลบวกหนึ่งครั้ง เชื่อได้แค่ไหน</h1>
        <p className="vmx-bench__lede">
          เครื่องมือคัดกรองที่ “แม่นมาก” ยังปลุกสัตว์ที่ไม่ได้เป็นโรคได้เป็นส่วนใหญ่
          ถ้าโรคนั้นชุกน้อย ลองหมุนดูว่าตัวเลขไหนเป็นตัวตัดสินจริง ๆ
        </p>
      </header>

      <section className="vmx-bench__scenarios" aria-label="สถานการณ์ตั้งต้น">
        {LECTURE_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            className="vmx-bench-scenario"
            onClick={() => applyScenario(s)}
          >
            <span className="vmx-bench-scenario__label">{s.label}</span>
            <span className="vmx-bench-scenario__note">{s.note}</span>
          </button>
        ))}
      </section>

      <div className="vmx-bench__body">
        <section className="vmx-bench__controls" aria-label="ตั้งค่าเครื่องมือและฝูงสัตว์">
          <Dial
            label="ความชุกของโรค" tone="gold" value={prevalence} min={0.1} max={50} step={0.1}
            onChange={onDial(setPrevalence)} format={(v) => `${v.toFixed(1)}%`}
            hint="สัดส่วนสัตว์ที่เป็นโรคจริงในฝูงที่เอามาคัดกรอง"
          />
          <Dial
            label="Sensitivity" tone="hit" value={sensitivity} min={0} max={100} step={1}
            onChange={onDial(setSensitivity)} format={(v) => `${v}%`}
            hint="ในสัตว์ที่เป็นโรค เครื่องมือปลุกได้กี่เปอร์เซ็นต์"
          />
          <Dial
            label="Specificity" tone="miss" value={specificity} min={0} max={100} step={1}
            onChange={onDial(setSpecificity)} format={(v) => `${v}%`}
            hint="ในสัตว์ที่ไม่เป็นโรค เครื่องมือปล่อยผ่านได้กี่เปอร์เซ็นต์"
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
                  onClick={() => { setN(s); setCommitted(null); }}
                >
                  {nf(s)}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="vmx-bench__readout" aria-label="ผลที่ได้">
          <div className="vmx-bench-headline">
            <div className="vmx-bench-headline__main">
              <p className="vmx-bench-headline__label">ในตัวที่ถูกปลุก เป็นโรคจริงกี่เปอร์เซ็นต์ (PPV)</p>
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
                  คุณเดา <b>{committed}%</b> · จริง{' '}
                  <b>{table.ppv === null ? 'ไม่นิยาม' : pct1(table.ppv)}</b>
                  {table.ppv !== null && (
                    <> — ต่างกัน {Math.abs(committed - table.ppv * 100).toFixed(1)} จุด</>
                  )}
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
                <dt>Accuracy</dt>
                <dd>{pct1(table.accuracy)}</dd>
              </div>
              <div>
                <dt>NPV</dt>
                <dd>{table.npv === null ? '—' : pct1(table.npv)}</dd>
              </div>
              <div>
                <dt>ปลุกผิดต่อการเจอ 1 ตัว</dt>
                <dd>{table.falseAlertsPerHit === null ? '—' : `${table.falseAlertsPerHit.toFixed(1)} ตัว`}</dd>
              </div>
            </dl>
          </div>

          {!hidden && <FlaggedField table={table} />}

          <table className="vmx-bench-table">
            <caption className="vmx-bench-table__caption">
              จาก {nf(table.n)} ตัว — เป็นโรคจริง {nf(table.diseased)} ตัว
            </caption>
            <thead>
              <tr>
                <th scope="col"><span className="vmx-sr-only">ผลของเครื่องมือ</span></th>
                <th scope="col">เป็นโรค</th>
                <th scope="col">ไม่เป็นโรค</th>
                <th scope="col">รวม</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">ปลุก</th>
                <td className="is-hit">{nf(table.tp)}</td>
                <td className="is-false">{nf(table.fp)}</td>
                <td>{nf(table.flagged)}</td>
              </tr>
              <tr>
                <th scope="row">ไม่ปลุก</th>
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

          <PrevalenceCurve
            sensitivity={sensitivity / 100}
            specificity={specificity / 100}
            prevalence={prevalence / 100}
            ppv={table.ppv}
          />
        </section>
      </div>

      <footer className="vmx-bench__foot">
        <p>
          ตัวเลขทุกตัวบนหน้านี้คำนวณสด ไม่ได้พิมพ์ไว้ สถานการณ์ตั้งต้นมาจาก Veterinary
          Epidemiology · Module 5 (อ.ชัยเดช อินทร์ไชยศรี) ซึ่งระบุไว้เองว่าเป็นตัวอย่างสมมติเพื่อการสอน
          ไม่ใช่ผลจากฟาร์มหรือระบบจริง
        </p>
        {goHome && (
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={goHome}>
            กลับหน้าแรก
          </button>
        )}
      </footer>
    </div>
  );
}
