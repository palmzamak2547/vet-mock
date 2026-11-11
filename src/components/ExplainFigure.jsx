import { useEffect, useRef, useState } from 'react';
import { figuresIn, figureLayout } from '../lib/figure-spec.js';
import { figureProblems } from '../lib/figure-check.js';
import '../styles-figure.css';

// The drawing of a figure in an explanation (src/lib/figure-spec.js), its own
// lazy chunk. FigureSlot measures the width it has, holds the box at the
// height figureLayout() gives for that width, and swaps this in; this lays
// itself out from the same figureLayout(), row by row in normal flow, so the
// box it fills is the box that was held.
//
// What the writer does not decide, decided here once for every figure:
//   - one accent, the sage the correct option wears on the card, means "this
//     is the answer" and nothing else; what a formula uses is drawn in ink and
//     says so in words (ตัวตั้ง, ตัวหาร, the way to read);
//   - lines that carry meaning are ink or ink-soft, 3:1 or more against the
//     paper; one line style (dashed) means one thing: a reference line that is
//     not a value (the no-difference value of an interval);
//   - every label sits on its mark, Thai labels break only between words;
//   - motion: the data is there from the first frame. Only the emphasis (what
//     a formula uses, the answer's accent) comes in, once, for an answer given
//     just now, when the figure is in view; never under reduced motion.

const x = (s) => String(s).replace(/\s+[x*]\s+/g, ' × ');
const NONE = new Set();
const pct = (v) => `${Math.max(0, Math.min(100, v)).toFixed(2)}%`;
const oneSpace = (s) => String(s).replace(/\s+/g, ' ').trim();

// Thai has no spaces between words, and a browser may break inside one ("ผล|บวก"). Each word is kept whole;
// a line may break only between words.
const segmenter = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('th', { granularity: 'word' }) : null;
export function thaiWords(text) {
  const s = String(text ?? '');
  if (!segmenter || !/[฀-๿]/.test(s)) return [s];
  // The segmenter cuts compounds into syllable-length words ("ผล" "บวก", "อย่าง" "น้อย"); a piece of three
  // letters or fewer joins its neighbour, up to ten letters, so a compound breaks only where a reader would.
  const base = (w) => w.replace(/[ัิ-ฺ็-๎]/g, '').length;
  const out = [];
  for (const { segment } of segmenter.segment(s)) {
    const prev = out[out.length - 1];
    const thai = /[฀-๿]/.test(segment);
    if (prev != null && thai && /[฀-๿]$/.test(prev) && (base(segment) <= 3 || base(prev) <= 3) && base(prev) + base(segment) <= 10) out[out.length - 1] = prev + segment;
    else out.push(segment);
  }
  return out;
}
function W({ children }) {
  const parts = thaiWords(children);
  if (parts.length === 1) return parts[0];
  // One inline run, so a flex parent keeps the spaces between words.
  return <span>{parts.map((p, i) => (/^\s+$/.test(p) ? p : <span key={i} className="vmx-fig-word">{p}</span>))}</span>;
}

/** The numbers of a text; those of the answer's fractions wear the accent. */
function Expr({ text, lit }) {
  const parts = x(text).split(/(\d[\d,]*(?:\.\d+)?)/);
  return parts.map((p, i) => (i % 2 ? <span key={i} className={lit.has(p) ? 'is-lit' : undefined}>{p}</span> : p));
}

function Calc({ c, lit, way, height }) {
  return (
    <div className="vmx-fig-calc" style={{ minHeight: `${height}px` }}>
      <span className="lbl"><W>{c.label}</W>{way && <span className="way">{way}</span>}</span>
      {c.den
        ? <span className="frac"><span className="n"><Expr text={c.num} lit={lit} /></span><span className="d"><Expr text={c.den} lit={lit} /></span></span>
        : <span><Expr text={c.num} lit={lit} /></span>}
      {(c.mid || []).map((m, i) => <span key={i} className="mid"><span className="eq">=</span> <Expr text={m} lit={NONE} /></span>)}
      <span className="eq">=</span>
      <span className="res">{c.result}</span>
    </div>
  );
}

/** Which cells each calc uses, and the way it reads them: one cell over its column's or its row's total. */
export function readings(fig) {
  const rows = fig.rows || [];
  const grid = [...rows.map((r) => r.cells), ...(fig.sum ? [fig.sum.cells] : [])];
  const find = (n) => {
    for (let r = 0; r < grid.length; r++) for (let k = 0; k < grid[r].length; k++) if (grid[r][k].replace(/,/g, '') === n.replace(/,/g, '')) return [r, k];
    return null;
  };
  const use = new Map();
  const rail = new Map();
  const ways = [];
  for (const c of fig.calcs || []) {
    const cells = { num: [], den: [] };
    for (const side of ['num', 'den']) for (const n of figuresIn(c[side])) { const at = find(n); if (at) { cells[side].push(at); if (!use.has(at.join(':')) || side === 'num') use.set(at.join(':'), side); } }
    let way = '';
    if (cells.num.length === 1 && cells.den.length === 1) {
      const [[r0, k0], [r1, k1]] = [cells.num[0], cells.den[0]];
      if (k0 === k1) { way = 'อ่านลงตามคอลัมน์'; for (let r = Math.min(r0, r1); r < Math.max(r0, r1); r++) rail.set(`${r}:${k0}`, 'v'); }
      else if (r0 === r1) { way = 'อ่านตามแถว'; for (let k = Math.min(k0, k1); k < Math.max(k0, k1); k++) rail.set(`${r0}:${k}`, 'h'); }
    }
    ways.push(way);
  }
  return { grid, use, rail, ways };
}

function TwoByTwo({ fig, lay }) {
  const rows = fig.rows || [];
  const calcs = fig.calcs || [];
  const n = (fig.cols || []).length;
  const { grid, use, rail, ways } = readings(fig);
  const lit = new Set(calcs.flatMap((c) => [...figuresIn(c.num), ...figuresIn(c.den)]));
  const body = (r, k) => r < rows.length && k < 2;
  const label = (r) => (r < rows.length ? rows[r].label : fig.sum.label);
  return (
    <>
      <div className={`vmx-fig-grid${lay.narrow ? ' is-narrow' : ''}`} style={{ gridTemplateColumns: lay.narrow ? `repeat(${n}, minmax(0, 1fr))` : `minmax(0, 1.15fr) repeat(${n}, minmax(0, 1fr))` }}>
        {!lay.narrow && <span />}
        {(fig.cols || []).map((c, k) => <span key={k} className={`h${k > 1 ? ' is-sum' : ''}`} style={{ minHeight: `${lay.head}px` }}><W>{c}</W></span>)}
        {grid.map((cells, r) => [
          <span key={`l${r}`} className={`rl${r >= rows.length ? ' is-sum' : ''}`}><W>{label(r)}</W></span>,
          ...cells.map((v, k) => {
            const u = use.get(`${r}:${k}`);
            const p = lay.narrow ? null : rail.get(`${r}:${k}`);
            return (
              <span key={`${r}:${k}`} className={`c${body(r, k) ? '' : ' is-sum'}${u ? ` is-${u}` : ''}${p ? ` rail-${p}` : ''}`}>
                <span className="cv">{v}</span>
                {u && <span className="role" data-s="2">{u === 'num' ? 'ตัวตั้ง' : 'ตัวหาร'}</span>}
              </span>
            );
          }),
        ])}
      </div>
      <div className="vmx-fig-calcs" style={{ gridTemplateColumns: `repeat(${lay.calcCols}, minmax(0, 1fr))` }}>{calcs.map((c, i) => <Calc key={i} c={c} lit={lit} way={ways[i]} height={lay.calcH} />)}</div>
    </>
  );
}

function Interval({ fig, lay }) {
  const rows = (fig.rows || []).filter((r) => r.est != null && r.lo != null && r.hi != null);
  const nil = fig.nil ?? 0;
  const log = nil === 1 && rows.every((r) => r.lo > 0);
  const f = log ? Math.log : (v) => v;
  const vals = [nil, ...rows.flatMap((r) => [r.lo, r.hi])].map(f);
  const pad = (Math.max(...vals) - Math.min(...vals)) * 0.12 || 1;
  const [a, b] = [Math.min(...vals) - pad, Math.max(...vals) + pad];
  const at = (v) => ((f(v) - a) / (b - a)) * 100;
  return (
    <div className="vmx-fig-plot">
      <div className="nil" style={{ left: pct(at(nil)) }}><span className="nl">{nil}</span></div>
      {rows.map((r, i) => {
        const crosses = r.lo <= nil && nil <= r.hi;
        const [lo, hi, est] = [at(r.lo), at(r.hi), at(r.est)];
        return (
          <div key={i} className={`row${crosses ? ' is-cross' : ''}${r.key ? ' is-key' : ''}`}>
            <span className="rl"><W>{r.label}</W> {r.text[0]}{lay.narrow ? ` (${r.text[1]} ถึง ${r.text[2]})` : ''}</span>
            <div className="track">
              <span className="ci" style={{ left: pct(lo), width: pct(hi - lo) }} />
              <span className="est" style={{ left: pct(est) }} />
              {!lay.narrow && <span className="v lo-v" style={{ left: pct(lo) }}>{r.text[1]}</span>}
              {!lay.narrow && <span className="v hi-v" style={{ left: pct(hi) }}>{r.text[2]}</span>}
              {crosses && <span className="hit" data-s="2" style={{ left: pct(at(nil)) }} />}
            </div>
          </div>
        );
      })}
      {fig.note && <p className="note"><W>{fig.note}</W></p>}
      {log && <p className="axis">สเกลลอการิทึม</p>}
    </div>
  );
}

function Bars({ fig, lay }) {
  const bars = (fig.bars || []).filter((b) => b.value != null);
  const max = Math.max(...bars.map((b) => b.value), 0) || 1;
  const head = fig.head || [];
  return (
    <div className={`vmx-fig-bars${lay.narrow ? ' is-narrow' : ''}`}>
      {head.length > 0 && <><span className="bh"><W>{head[0]}</W></span><span className="bh"><W>{head[1] || ''}</W></span></>}
      {bars.map((b, i) => [
        <span key={`l${i}`} className={`rl${b.key ? ' is-key' : ''}`}>{b.label}</span>,
        <span key={`b${i}`} className={`track${b.key ? ' is-key' : ''}`}>
          <span className="fill" style={{ width: pct((b.value / max) * 100) }}>{b.key && <span className="ans" data-s="2" />}</span>
          <span className="v">{b.text}</span>
        </span>,
      ])}
      {fig.unit && <span className="unit"><W>{fig.unit}</W></span>}
    </div>
  );
}

function Timeline({ fig, lay }) {
  const unit = fig.unit ? <span className="u">{fig.unit}</span> : null;
  return (
    <ol className="vmx-fig-time">
      {lay.rows.map((row, i) => (
        <li key={i} className={`ev${row.start ? ' is-start' : ''}${row.key ? ' is-key' : ''}`} style={{ minHeight: `${row.height}px` }}>
          <span className="t">{row.start ? '' : <>{row.text}{unit}</>}</span>
          <span className="dot">{row.key && <span className="ans" data-s="2" />}</span>
          <span className="lbls">{row.labels.map((l, j) => <span key={j} className={l.key ? 'is-key' : undefined}><W>{l.label}</W></span>)}</span>
        </li>
      ))}
    </ol>
  );
}

function Flow({ fig, lay }) {
  const lanes = fig.lanes || [];
  const titled = lanes.length > 1 || Boolean(lanes[0]?.title);
  return (
    <div className="vmx-fig-flow" style={{ gridTemplateColumns: `repeat(${lay.narrow ? 1 : lanes.length || 1}, minmax(0, 1fr))` }}>
      {lanes.map((lane, l) => (
        <div key={l} className={`lane${lane.key ? ' is-key' : ''}`}>
          {titled && <span className="lt"><W>{lane.title}</W></span>}
          {lane.steps.map((s, i) => (
            <div key={i} className={`step${s.key ? ' is-key' : ''}`}>
              {i > 0 && <span className="link" />}
              <div className={s.no ? 'box has-no' : 'box'}>
                {s.no && <span className="no">{s.no}</span>}
                <span className="sl"><W>{s.label}</W></span>
                {s.detail && <span className="sd"><W>{s.detail}</W></span>}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Scale({ fig, lay }) {
  const bands = fig.bands || [];
  const val = fig.value;
  const edges = bands.flatMap((b) => [b.lo, b.hi]).filter((v) => v != null);
  if (val?.value != null) edges.push(val.value);
  const lo0 = Math.min(...edges), hi0 = Math.max(...edges);
  const w = (hi0 - lo0) || 1;
  const [a, b] = [lo0 - w * 0.9, hi0 + w * 0.9];
  const at = (v) => ((v - a) / (b - a)) * 100;
  return (
    <div className="vmx-fig-scale">
      {val && <p className="ml">{val.label} = <b>{val.text}</b></p>}
      <div className="strip">
        {bands.map((bd, i) => {
          const l = at(bd.lo ?? a), r = at(bd.hi ?? b);
          return <span key={i} className={`band${bd.key ? ' is-key' : ''}`} style={{ left: pct(l), width: pct(r - l) }} />;
        })}
        {val && <span className="needle" style={{ left: pct(at(val.value)) }} />}
      </div>
      <ul className="bls">{bands.map((bd, i) => <li key={i} className={bd.key ? 'is-key' : undefined}><W>{bd.label}</W> {bd.text[0] || ''}{bd.text[0] && bd.text[1] ? ' ถึง ' : ''}{bd.text[1] || ''}</li>)}</ul>
    </div>
  );
}

/** The figure as a list of short lines (what a screen reader is told, and what a too-narrow screen shows). */
export function listItems(fig) {
  const k = (m) => (m.key ? ' (คำตอบ)' : '');
  const x = (t) => String(t).replace(/s+[x*]s+/g, ' × ');
  switch (fig.kind) {
    case 'twobytwo': return [...(fig.rows || []), ...(fig.sum ? [fig.sum] : [])].map((r) => `${r.label}: ${r.cells.map((c, i) => `${(fig.cols || [])[i] || ''} ${c}`).join(', ')}`)
      .concat((fig.calcs || []).map((c) => `${c.label} = ${x(c.num)}${c.den ? ` / ${x(c.den)}` : ''} = ${c.result}${k(c)}`));
    case 'interval': return (fig.rows || []).map((r) => `${r.label} ${r.text[0]} (${r.text[1]} ถึง ${r.text[2]})${k(r)}`).concat(fig.note ? [fig.note] : []);
    case 'bars': return (fig.bars || []).map((b) => `${b.label}: ${b.text}${k(b)}`);
    case 'timeline': return (fig.start ? [fig.start] : []).concat((fig.events || []).map((e) => `${e.text} ${fig.unit || ''}: ${e.label}${k(e)}`));
    case 'flow': return (fig.lanes || []).flatMap((l) => (l.title ? [`${l.title}${k(l)}`] : []).concat(l.steps.map((st) => `${st.no ? `${st.no}. ` : ''}${st.label}${st.detail ? `, ${st.detail}` : ''}${k(st)}`)));
    case 'scale': return (fig.value ? [`${fig.value.label} = ${fig.value.text}`] : []).concat((fig.bands || []).map((b) => `${b.label} ${b.text[0] || ''} ถึง ${b.text[1] || ''}${k(b)}`));
    default: return [fig.plain || ''];
  }
}

const DRAW = { twobytwo: TwoByTwo, interval: Interval, bars: Bars, timeline: Timeline, flow: Flow, scale: Scale };

/**
 * What the drawing shows, for a screen reader, in Thai: every cell, label, value and time, which mark is the
 * answer, and for a 2x2 what each formula uses and the way it reads. Items are listed, never joined as if
 * one followed from the other.
 */
export function describe(fig) {
  const ans = ' (คำตอบ)';
  const k = (m) => (m.key ? ans : '');
  const list = (xs) => xs.filter(Boolean).map(oneSpace).join('; ');
  switch (fig.kind) {
    case 'twobytwo': {
      const { ways } = readings(fig);
      const rowCells = (r) => `${r.label}: ${r.cells.map((c, i) => `${(fig.cols || [])[i] || ''} ${c}`).join(', ')}`;
      return list(['ตาราง 2x2', ...(fig.rows || []).map(rowCells), fig.sum ? rowCells(fig.sum) : '',
        ...(fig.calcs || []).map((c, i) => `${c.label} = ${x(c.num)}${c.den ? ` หารด้วย ${x(c.den)}` : ''}${c.mid?.length ? ` = ${c.mid.join(' = ')}` : ''} = ${c.result}${ways[i] ? ` (${ways[i]})` : ''}${k(c)}`)]);
    }
    case 'interval': return list([...(fig.rows || []).map((r) => `${r.label} ${r.text[0]}, ช่วงความเชื่อมั่น ${r.text[1]} ถึง ${r.text[2]}, ${r.lo <= fig.nil && fig.nil <= r.hi ? 'ครอบ' : 'ไม่ครอบ'}ค่า ${fig.nil}${k(r)}`), fig.note, fig.nil === 1 ? 'แกนเป็นสเกลลอการิทึม' : '']);
    case 'bars': return list([(fig.head || []).join(' และ '), ...(fig.bars || []).map((b) => `${b.label}: ${b.text}${k(b)}`), fig.unit]);
    case 'timeline': return list([fig.start ? `เริ่มที่${fig.start}` : '', ...(fig.events || []).map((e) => `${e.text} ${fig.unit || ''}: ${e.label}${k(e)}`)]);
    case 'flow': return list((fig.lanes || []).flatMap((l) => [l.title ? `${l.title}${k(l)}` : '', ...l.steps.map((st) => `${st.no ? `ขั้นตอนที่ ${st.no} ` : ''}${st.label}${st.detail ? `, ${st.detail}` : ''}${k(st)}`)]));
    case 'scale': return list([fig.value ? `${fig.value.label} = ${fig.value.text}` : '', ...(fig.bands || []).map((b) => `ช่วง ${b.label} ${b.text[0] || ''} ถึง ${b.text[1] || ''}${k(b)}`)]);
    default: return fig.plain || '';
  }
}

export default function ExplainFigure({ fig, play = false, width = 0 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(!play);
  useEffect(() => {
    if (!play || on) return undefined;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setOn(true); return undefined; }
    // Plays once its top is a quarter of the screen up from the bottom; a figure below the fold waits for the scroll.
    const watch = new IntersectionObserver((seen) => { if (seen.some((s) => s.isIntersecting)) { setOn(true); watch.disconnect(); } }, { rootMargin: '0px 0px -25% 0px' });
    watch.observe(el);
    return () => watch.disconnect();
  }, [play, on]);
  const Draw = DRAW[fig.kind];
  // A figure the parser could not read whole is written out in words, never drawn half (the lint fails on it too).
  if (!Draw || figureProblems(fig).length) return <p className="vmx-fig-words" style={{ whiteSpace: 'pre-line' }}>{fig.plain}</p>;
  const lay = figureLayout(fig, width);
  return (
    <figure ref={ref} className={`vmx-fig is-${fig.kind}${play ? ' is-play' : ''}${on ? ' is-on' : ''}`} style={{ minHeight: `${lay.height}px` }} role="img" aria-label={describe(fig)}>
      {lay.list ? <ul className="vmx-fig-list">{listItems(fig).map((t, i) => <li key={i}>{t}</li>)}</ul> : <Draw fig={fig} lay={lay} />}
    </figure>
  );
}
