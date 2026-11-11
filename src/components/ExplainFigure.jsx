import { useEffect, useRef, useState } from 'react';
import { figuresIn } from '../lib/figure-spec.js';
import '../styles-figure.css';

// The drawing of a figure in an explanation (src/lib/figure-spec.js), its own
// lazy chunk: FigureSlot reserves the box at the height figureHeight() gives
// and swaps this in, so nothing below it moves.
//
// What the writer does not decide, decided here once for every figure:
//   - one accent, the colour the key already wears on the card (sage), means
//     "this answers the question"; everything else is ink or ink-soft;
//   - every label sits on its mark: no legend, no axis to decode;
//   - the eye lands first on what answers (the accent, the serif result);
//   - motion follows the reasoning: the data is there from the first frame,
//     then what the reasoning uses lights up, then the result (stages 2 and 3).
//     It plays once, only for an answer given just now, and only once the
//     figure is in view; a figure seen again, a review list, reduced motion or
//     the app's own motion setting show the finished figure.

const x = (s) => String(s).replace(/\s+[x*]\s+/g, ' × ');
const NONE = new Set();
const pct = (v) => `${Math.max(0, Math.min(100, v)).toFixed(2)}%`;

/** The numbers of a text, each wrapped where it matches a used cell. */
function Expr({ text, lit }) {
  const parts = x(text).split(/(\d[\d,]*(?:\.\d+)?)/);
  return parts.map((p, i) => (i % 2 ? <span key={i} className={lit.has(p) ? 'is-lit' : undefined}>{p}</span> : p));
}

function Calc({ c, lit }) {
  return (
    <div className="vmx-fig-calc" data-s="3">
      <span className="lbl">{c.label}</span>
      {c.den
        ? <span className="frac"><span className="n"><Expr text={c.num} lit={lit} /></span><span className="d"><Expr text={c.den} lit={lit} /></span></span>
        : <span><Expr text={c.num} lit={lit} /></span>}
      {(c.mid || []).map((m, i) => <span key={i} className="mid"><span className="eq">=</span> <Expr text={m} lit={NONE} /></span>)}
      <span className="eq">=</span>
      <span className="res">{c.result}</span>
    </div>
  );
}

function TwoByTwo({ fig }) {
  const rows = fig.rows || [];
  const calcs = fig.calcs || [];
  const margin = (fig.cols || []).length > 2;
  // Which cell each number of a calc names: the body first, then the margins.
  const grid = [...rows.map((r) => r.cells), ...(fig.sum ? [fig.sum.cells] : [])];
  const use = new Map();
  const path = new Map();
  const lit = new Set();
  const find = (n) => {
    for (let r = 0; r < grid.length; r++) for (let k = 0; k < grid[r].length; k++) if (grid[r][k].replace(/,/g, '') === n.replace(/,/g, '')) return [r, k];
    return null;
  };
  for (const c of calcs) {
    const cells = { num: [], den: [] };
    for (const side of ['num', 'den']) {
      for (const n of figuresIn(c[side])) {
        const at = find(n);
        if (!at) continue;
        lit.add(n);
        cells[side].push(at);
        const id = at.join(':');
        if (!use.has(id) || side === 'num') use.set(id, side);
      }
    }
    // One cell over a total: read down its column (sensitivity) or along its row (a predictive value).
    // The cells between them carry a rail, so the direction of the reading is drawn, not said.
    if (cells.num.length === 1 && cells.den.length === 1) {
      const [[r0, k0], [r1, k1]] = [cells.num[0], cells.den[0]];
      if (k0 === k1) for (let r = Math.min(r0, r1); r <= Math.max(r0, r1); r++) path.set(`${r}:${k0}`, r === Math.max(r0, r1) ? 'v is-end' : 'v');
      else if (r0 === r1) for (let k = Math.min(k0, k1); k <= Math.max(k0, k1); k++) path.set(`${r0}:${k}`, k === Math.max(k0, k1) ? 'h is-end' : 'h');
    }
  }
  const body = (r, k) => r < rows.length && k < 2;
  const cross = calcs.length === 1 && rows.length === 2 && ['0:0', '1:1'].every((p) => use.get(p) === 'num') && ['0:1', '1:0'].every((p) => use.get(p) === 'den');
  const cols = `minmax(0, ${margin ? 1.1 : 1.3}fr) repeat(${margin ? 3 : 2}, minmax(0, 1fr))`;
  return (
    <>
      <div className="vmx-fig-grid" style={{ gridTemplateColumns: cols }}>
        <span />
        {(fig.cols || []).map((c, k) => <span key={k} className={`h${k > 1 ? ' is-sum' : ''}`}>{c}</span>)}
        {grid.map((cells, r) => [
          <span key={`l${r}`} className={`rl${r >= rows.length ? ' is-sum' : ''}`}>{r < rows.length ? rows[r].label : fig.sum.label}</span>,
          ...cells.map((v, k) => {
            const u = use.get(`${r}:${k}`);
            const p = path.get(`${r}:${k}`);
            return <span key={`${r}:${k}`} className={`c${body(r, k) ? '' : ' is-sum'}${u ? ` is-${u}` : (use.size ? ' is-off' : '')}${p ? ` is-${p}` : ''}`}>{v}</span>;
          }),
        ])}
        {cross && (
          <span className="vmx-fig-cross" style={{ gridRow: '2 / span 2', gridColumn: '2 / span 2' }} data-s="2">
            <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" className="d" /></svg>
          </span>
        )}
      </div>
      <div className="vmx-fig-calcs">{calcs.map((c, i) => <Calc key={i} c={c} lit={lit} />)}</div>
    </>
  );
}

function Interval({ fig }) {
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
          <div key={i} className={`row${crosses ? ' is-cross' : ''}`}>
            <span className="rl">{r.label}</span>
            <div className="track">
              <span className="ci" data-s="2" style={{ left: pct(lo), width: pct(hi - lo), transformOrigin: `${(((est - lo) / (hi - lo || 1)) * 100).toFixed(1)}% 50%` }} />
              <span className="est" style={{ left: pct(est) }} />
              <span className="v est-v" style={{ left: pct(est) }}>{r.text[0]}</span>
              <span className="v lo-v" data-s="2" style={{ left: pct(lo) }}>{r.text[1]}</span>
              <span className="v hi-v" data-s="2" style={{ left: pct(hi) }}>{r.text[2]}</span>
              {crosses && <span className="hit" data-s="3" style={{ left: pct(at(nil)) }} />}
            </div>
          </div>
        );
      })}
      {fig.note && <p className="note" data-s="3" style={{ paddingLeft: `calc(${pct(at(nil))} + 10px)` }}>{fig.note}</p>}
    </div>
  );
}

function Bars({ fig }) {
  const bars = (fig.bars || []).filter((b) => b.value != null);
  const max = Math.max(...bars.map((b) => b.value), 0) || 1;
  const head = fig.head || [];
  return (
    <div className="vmx-fig-bars">
      {head.length > 0 && <div className="bh"><span>{head[0]}</span><span>{head[1] || ''}</span></div>}
      {bars.map((b, i) => (
        <div key={i} className={`bar${b.key ? ' is-key' : ''}`}>
          <span className="rl">{b.label}</span>
          <span className="track">
            <span className="fill" style={{ width: pct((b.value / max) * 100) }} />
            <span className="v" style={{ left: pct((b.value / max) * 100) }}>{b.text}</span>
          </span>
        </div>
      ))}
      {fig.unit && <p className="unit">{fig.unit}</p>}
    </div>
  );
}

function Timeline({ fig, height }) {
  const evs = (fig.events || []).filter((e) => e.at != null);
  const times = [...new Set(evs.map((e) => e.at))].sort((p, q) => p - q);
  const t0 = fig.start ? Math.min(0, ...times) : times[0];
  const t1 = times[times.length - 1];
  const top = fig.start ? 22 : 26;
  const inner = height - 28; // the box's padding and border
  const span = inner - top - 24;
  // Proportional to time, with room for each label: a later time never sits closer than 44 px.
  let last = -Infinity;
  const y = new Map(times.map((t) => {
    const want = top + (t1 > t0 ? ((t - t0) / (t1 - t0)) * span : 0);
    last = Math.max(want, last + 44);
    return [t, Math.min(last, top + span)];
  }));
  const unit = fig.unit ? <span className="u">{fig.unit}</span> : null;
  return (
    <div className="vmx-fig-time" style={{ height: `${inner}px` }}>
      <span className="rail" data-s="2" style={{ top: `${top}px`, height: `${span}px` }} />
      {fig.start && <div className="ev is-start" style={{ top: `${top}px` }}><span className="t" /><span className="dot" /><span className="lbls"><span>{fig.start}</span></span></div>}
      {evs.filter((e) => e.to != null).map((e, i) => (
        <span key={`s${i}`} className={`span${e.key ? ' is-key' : ''}`} data-s="2" style={{ top: `${y.get(e.at)}px`, height: `${(y.get(e.to) ?? y.get(e.at)) - y.get(e.at)}px` }} />
      ))}
      {times.map((t) => {
        const here = evs.filter((e) => e.at === t);
        const key = here.some((e) => e.key);
        return (
          <div key={t} className={`ev${key ? ' is-key' : ''}`} style={{ top: `${y.get(t)}px` }} data-s={key ? '3' : '2'}>
            <span className="t">{here[0].text}{unit}</span>
            <span className="dot" />
            <span className="lbls">{here.map((e, i) => <span key={i} className={e.key ? 'is-key' : undefined}>{e.label}</span>)}</span>
          </div>
        );
      })}
    </div>
  );
}

function Flow({ fig }) {
  const lanes = fig.lanes || [];
  const titled = lanes.length > 1 || Boolean(lanes[0]?.title);
  return (
    <div className="vmx-fig-flow" style={{ gridTemplateColumns: `repeat(${lanes.length || 1}, minmax(0, 1fr))` }}>
      {lanes.map((lane, l) => (
        <div key={l} className={`lane${lane.key ? ' is-key' : ''}${lanes.some((o) => o.key) && !lane.key ? ' is-off' : ''}`}>
          {titled && <span className="lt">{lane.title}</span>}
          {lane.steps.map((s, i) => {
            const prev = lane.steps[i - 1];
            // Steps that skip a number (2, then 4) are joined by a broken line.
            const gap = s.no && prev?.no && Number(s.no) - Number(prev.no) > 1;
            return (
              <div key={i} className={`step${s.key ? ' is-key' : ''}`} data-s={s.key ? '3' : undefined}>
                {i > 0 && <span className={`link${gap ? ' is-gap' : ''}`} data-s="2" />}
                <div className={s.no ? "box has-no" : "box"}>
                  {s.no && <span className="no">{s.no}</span>}
                  <span className="sl">{s.label}</span>
                  {s.detail && <span className="sd">{s.detail}</span>}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Scale({ fig }) {
  const bands = fig.bands || [];
  const val = fig.value;
  const edges = bands.flatMap((b) => [b.lo, b.hi]).filter((v) => v != null);
  if (val?.value != null) edges.push(val.value);
  const lo0 = Math.min(...edges), hi0 = Math.max(...edges);
  const w = (hi0 - lo0) || 1;
  const [a, b] = [lo0 - w * 0.9, hi0 + w * 0.9];
  const at = (v) => ((v - a) / (b - a)) * 100;
  const ticks = [...new Map(bands.flatMap((bd, i) => [[bd.lo, bd.text[0]], [bd.hi, bd.text[1]]].filter(([v]) => v != null)).map(([v, t]) => [v, t])).entries()];
  return (
    <div className="vmx-fig-scale">
      {val && (
        <div className="mk" style={{ left: pct(at(val.value)) }} data-s="2">
          <span className="ml" data-s="3">{val.label} = <b>{val.text}</b></span>
          <span className="needle" />
        </div>
      )}
      <div className="strip">
        {bands.map((bd, i) => {
          const l = at(bd.lo ?? a), r = at(bd.hi ?? b);
          return <span key={i} className={`band${bd.key ? ' is-key' : ''}${bd.lo == null || bd.hi == null ? ' is-open' : ''}`} style={{ left: pct(l), width: pct(r - l) }} />;
        })}
      </div>
      <div className="ticks">{ticks.map(([v, t]) => <span key={v} style={{ left: pct(at(v)) }}>{t}</span>)}</div>
      <div className="bls">{bands.map((bd, i) => { const l = at(bd.lo ?? a), r = at(bd.hi ?? b); return <span key={i} className={bd.key ? 'is-key' : undefined} style={{ left: pct(l), width: pct(r - l) }}>{bd.label}</span>; })}</div>
    </div>
  );
}

const DRAW = { twobytwo: TwoByTwo, interval: Interval, bars: Bars, timeline: Timeline, flow: Flow, scale: Scale };

/** One Thai sentence for a screen reader: what the figure shows and what answers. */
export function describe(fig) {
  const keyOf = (list) => (list || []).find((m) => m.key);
  switch (fig.kind) {
    case 'twobytwo': return `ตาราง 2x2 ${(fig.cols || []).join(', ')}. ${(fig.calcs || []).map((c) => `${c.label} = ${x(c.num)}${c.den ? ` หารด้วย ${x(c.den)}` : ''} = ${c.result}`).join('. ')}`;
    case 'interval': return (fig.rows || []).map((r) => `${r.label} ${r.text[0]} ช่วงความเชื่อมั่น ${r.text[1]} ถึง ${r.text[2]}${r.lo <= (fig.nil ?? 0) && (fig.nil ?? 0) <= r.hi ? ` ครอบค่า ${fig.nil ?? 0}` : ''}`).join('. ');
    case 'bars': return `${(fig.head || []).join(' กับ ')}: ${(fig.bars || []).map((b) => `${b.label} ${b.text}`).join(', ')}${keyOf(fig.bars) ? `. คำตอบคือ ${keyOf(fig.bars).label} ${keyOf(fig.bars).text}` : ''}`;
    case 'timeline': return `${fig.start ? `นับจาก${fig.start}: ` : ''}${(fig.events || []).map((e) => `${e.text} ${fig.unit || ''} ${e.label}`.replace(/\s+/g, ' ')).join(', ')}`;
    case 'flow': return (fig.lanes || []).map((l) => `${l.title ? `${l.title}: ` : ''}${l.steps.map((s) => `${s.no ? `${s.no} ` : ''}${s.label}`).join(' แล้ว ')}`).join('. ');
    case 'scale': return `${fig.value ? `${fig.value.label} = ${fig.value.text}` : ''} ${(fig.bands || []).filter((b) => b.key).map((b) => `อยู่ในช่วง ${b.label}`).join('')}`.trim();
    default: return '';
  }
}

export default function ExplainFigure({ fig, play = false, height = 0 }) {
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
  if (!Draw) return null;
  // The held height is fitted to a phone; held there, nothing below moves when the drawing arrives.
  // A wider screen draws it shorter and keeps no empty band under it.
  const hold = typeof window !== 'undefined' && window.matchMedia?.('(max-width: 767px)').matches;
  return (
    <figure ref={ref} className={`vmx-fig is-${fig.kind}${play ? ' is-play' : ''}${on ? ' is-on' : ''}`} style={hold ? { minHeight: `${height}px` } : undefined} role="img" aria-label={describe(fig)}>
      <Draw fig={fig} height={height} />
    </figure>
  );
}
