// The chapter "บทความของคณะใช้สถิติอะไร / What statistics CUVET papers use" [M1-DESIGN.md 15.3].
// The HTML table with bars drawn to scale is the source of truth (and the whole view under reduced
// motion or without WebGL); the WebGL moment only adds the herd's dots flowing into the bars as the
// chapter scrolls in, ending exactly on the lengths the table draws (dots.js), then fading out.
// Counts come from research/src/data/cuvet-methods.json (joined from the committed Europe PMC files by
// landing/evidence/build-cuvet-methods.mjs, checked by a unit test); each row's status comes from the method catalogue
// (familyStatus), loaded as its own chunk as the chapter approaches so the front door's first paint
// never waits for the engine code the catalogue references. OWNER: landing role.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useT } from '../../i18n/index.js';
import joined from '../../data/cuvet-methods.json';
import { EVIDENCE_BASE_URL, buildRows, sharePercent } from './rows.js';
import { layoutBarDots } from './dots.js';
import { smooth } from '../story/layout.js';
import { HERD_LAYOUTS, herdData } from '../herd/data.js';
import { createHerdEngine, readGlColours, webglAvailable, DPR_CAP } from '../herd/engine.js';
import { useReducedMotion } from '../shell/theme.js';
import { formatDate } from '../shell/dates.js';

export const SHOWN_FIRST = 16;

/** Progress of the chapter's entrance: 0 when its top reaches the bottom of the viewport, 1 at 35%. */
function progressOf(el) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  return Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.65)));
}

/** Bar i grows from its origin after the dots have mostly arrived. */
export function barScale(p, i, n) {
  const start = 0.55 + (0.2 * i) / Math.max(1, n);
  return Math.max(0.001, smooth(start, start + 0.25, p));
}

function StatusMark({ status }) {
  // Shape as well as colour: a filled circle for "now", a ring for planned, a dash for later.
  return <span className={`rs-papers-mark rs-papers-mark-${status === 'now' ? 'now' : status === 'later' ? 'later' : 'soon'}`} aria-hidden="true" />;
}

export default function MethodsChapter() {
  const { t, lang } = useT();
  const reduce = useReducedMotion();
  const [catalog, setCatalog] = useState(null);
  const [all, setAll] = useState(false);
  const sectionRef = useRef(null);
  const figureRef = useRef(null);
  const canvasRef = useRef(null);
  const barRefs = useRef([]);
  const trackRefs = useRef([]);
  const [gl, setGl] = useState(() => (webglAvailable() ? 'on' : 'off'));

  // Load the catalogue as the chapter approaches (or when the browser is idle after first paint).
  useEffect(() => {
    let done = false;
    const load = () => {
      if (done) return;
      done = true;
      import('../../lib/runtime/catalog.js').then((m) => setCatalog({ familyStatus: m.familyStatus })).catch(() => setCatalog('error'));
    };
    const io = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && load(), { rootMargin: '1200px 0px' });
    if (sectionRef.current) io.observe(sectionRef.current);
    const idle = window.requestIdleCallback ? window.requestIdleCallback(load, { timeout: 4000 }) : window.setTimeout(load, 2500);
    return () => {
      io.disconnect();
      if (window.cancelIdleCallback && window.requestIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  const data = useMemo(() => {
    if (!catalog || catalog === 'error') return null;
    return buildRows(joined, catalog.familyStatus);
  }, [catalog]);

  const rows = useMemo(() => (data ? (all ? data.rows : data.rows.slice(0, SHOWN_FIRST)) : []), [data, all]);
  const animate = !reduce && Boolean(data);
  const denominator = joined.denominator;
  const dates = joined.checked.map((c) => c.date);

  // One loop while the chapter is on screen: bar transforms through refs and the WebGL flow.
  useEffect(() => {
    if (!animate) return undefined;
    const section = sectionRef.current;
    const figure = figureRef.current;
    const canvas = canvasRef.current;
    if (!section || !figure) return undefined;
    const n = rows.length;
    let eng = null;
    let herd = null;
    if (gl === 'on' && canvas) {
      herd = herdData(window.innerWidth < 820 ? HERD_LAYOUTS.phone : HERD_LAYOUTS.desktop);
      eng = createHerdEngine(canvas, herd, { onError: () => setGl('off') });
      if (!eng) setGl('off');
    }
    let colours = readGlColours();
    let raf = 0;
    let alive = true;
    let visible = false;
    let size = { w: 1, h: 1 };
    let finished = false;
    const pointPx = window.innerWidth < 820 ? 4.5 : 6;
    const layout = () => {
      if (!eng) return;
      const fr = canvas.getBoundingClientRect();
      size = { w: fr.width, h: fr.height };
      eng.resize(size.w, size.h, Math.min(window.devicePixelRatio || 1, DPR_CAP));
      const bars = rows.map((row, i) => {
        const track = trackRefs.current[i];
        const bar = barRefs.current[i];
        if (!track || !bar) return { x: 0, y: 0, length: 0, height: 0, now: false };
        const tr = track.getBoundingClientRect();
        return {
          x: tr.left - fr.left,
          y: tr.top - fr.top + tr.height / 2,
          length: (tr.width * row.count) / data.max,
          height: bar.offsetHeight,
          now: row.status === 'now',
        };
      });
      const plan = layoutBarDots(bars, { total: herd.N, pointPx, pitch: pointPx + 1.5 });
      eng.setTarget(plan.grid, plan.sizes, plan.use, plan.pos);
    };
    // Scroll starts the entrance; time finishes it. A reader who lands on the chapter from the header
    // link or #rs-papers stops with the figure half way up the screen, and scrubbing by scroll depth
    // left the bars short there (review round 1). Once the figure is in view the bars reach their true
    // length within about 1.6 s whatever the reader does next.
    let entered = 0;
    const draw = (now) => {
      const sp = progressOf(figure);
      if (!entered && sp > 0.12) entered = now;
      const tp = entered ? Math.min(1, (now - entered) / 1600) : 0;
      const p = Math.max(sp, tp);
      for (let i = 0; i < n; i++) {
        const b = barRefs.current[i];
        if (b) b.style.transform = `scaleX(${barScale(p, i, n).toFixed(4)})`;
      }
      if (eng && !eng.lost()) {
        const flow = smooth(0.05, 0.75, p);
        const fade = 1 - smooth(0.82, 1, p);
        if (fade <= 0.001) {
          if (!finished) {
            eng.draw({ time: 0, fold: 0, grid: 1, dim: 0, posMix: 1, reduce: true, pointPx, colPos: colours.ring, colNeg: colours.neg, scatterOrigin: [0, 0], farmOrigin: [0, 0], gridOrigin: [-size.w / 2, -size.h / 2] });
            finished = true;
          }
        } else {
          finished = false;
          eng.draw({
            time: now / 1000, fold: 0, grid: flow, dim: fade, posMix: 1, reduce: false, pointPx, posBoost: 0, stagger: 0.4,
            colPos: colours.ring, colNeg: colours.neg,
            scatterOrigin: [0, -size.h / 2 + Math.min(260, size.h * 0.3)], farmOrigin: [0, 0], gridOrigin: [-size.w / 2, -size.h / 2],
          });
        }
      }
    };
    const tick = (now) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      raf = requestAnimationFrame(tick);
      draw(now);
    };
    const start = () => {
      if (!raf && alive && visible && !document.hidden) raf = requestAnimationFrame(tick);
    };
    layout();
    draw(performance.now());
    const io = new IntersectionObserver((es) => {
      visible = es.some((e) => e.isIntersecting);
      start();
    });
    io.observe(figure);
    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now());
    });
    ro.observe(figure);
    const mo = new MutationObserver(() => {
      colours = readGlColours();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const onVis = () => start();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      eng?.destroy();
      for (const b of barRefs.current) if (b) b.style.transform = '';
    };
  }, [animate, rows, data, gl, lang]);

  const statusLabel = (s) => t(`landing.papers.status.${s}`);
  const top = data?.rows[0];

  return (
    <section id="rs-papers" className="rs-papers" ref={sectionRef} aria-labelledby="rs-papers-title">
      <div className="rs-papers-inner">
        <p className="rs-l-eyebrow">{t('landing.papers.eyebrow', { n: denominator })}</p>
        <h2 id="rs-papers-title" className="rs-papers-title">{t('landing.papers.title')}</h2>
        <p className="rs-papers-lead">{t('landing.papers.lead', { n: denominator })}</p>
        {top ? (
          <p className="rs-papers-top">
            {t('landing.papers.top', { name: t(`landing.family.${top.id}`), count: top.count, share: sharePercent(top.share) })}
          </p>
        ) : null}

        <figure className="rs-papers-figure" ref={figureRef}>
          {animate && gl === 'on' ? <canvas className="rs-papers-canvas" ref={canvasRef} aria-hidden="true" /> : null}
          <table className="rs-papers-table">
            <caption className="rs-visually-hidden">{t('landing.papers.title')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('landing.papers.col.family')}</th>
                <th scope="col" className="rs-papers-num">{t('landing.papers.col.count')}</th>
                <th scope="col" className="rs-papers-num">{t('landing.papers.col.share', { n: denominator })}</th>
                <th scope="col" className="rs-papers-barcol">
                  <span className="rs-visually-hidden">{t('landing.papers.axis')}</span>
                </th>
                <th scope="col">{t('landing.papers.col.status')}</th>
              </tr>
            </thead>
            <tbody>
              {data
                ? rows.map((row, i) => (
                    <tr key={row.id} className={`rs-papers-row rs-papers-row-${row.status === 'now' ? 'now' : 'soon'}`}>
                      <th scope="row" className="rs-papers-name">{t(`landing.family.${row.id}`)}</th>
                      <td className="rs-papers-num rs-num">{row.count}</td>
                      <td className="rs-papers-num rs-num">{t('landing.papers.share', { share: sharePercent(row.share) })}</td>
                      <td className="rs-papers-barcell" aria-hidden="true">
                        <div className="rs-papers-track" ref={(el) => { trackRefs.current[i] = el; }}>
                          <div
                            className="rs-papers-bar"
                            ref={(el) => { barRefs.current[i] = el; }}
                            style={{ width: `${(row.count / data.max) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className="rs-papers-status">
                        <StatusMark status={row.status} />
                        {statusLabel(row.status)}
                      </td>
                    </tr>
                  ))
                : (
                    <tr>
                      <td colSpan={5} className="rs-papers-loading">{catalog === 'error' ? t('landing.papers.loadError') : t('landing.papers.status.loading')}</td>
                    </tr>
                  )}
            </tbody>
          </table>
          {data ? <figcaption className="rs-papers-axis">{t('landing.papers.axisNote', { max: data.max, name: t(`landing.family.${data.rows[0].id}`) })}</figcaption> : null}
        </figure>

        {/* Rendered from the first paint (disabled until the rows load), so a keyboard reader tabbing past
            the chart before it loads does not skip it (review round 1). The count is the joined table's. */}
        {joined.families.length > SHOWN_FIRST ? (
          <button type="button" className="rs-l-btn rs-l-btn-ghost rs-papers-more" aria-expanded={all} disabled={!data} onClick={() => setAll((x) => !x)}>
            {all ? t('landing.papers.showFewer', { n: SHOWN_FIRST }) : t('landing.papers.showAll', { n: data ? data.rows.length : joined.families.length })}
          </button>
        ) : null}

        <div className="rs-papers-notes">
          <p>{t('landing.papers.caption')}</p>
          <p className="rs-papers-legend">
            <span><StatusMark status="now" />{statusLabel('now')}</span>
            <span><StatusMark status="M2" />{t('landing.papers.legend.soon')}</span>
            <span><StatusMark status="later" />{statusLabel('later')}</span>
          </p>
          <p>{t('landing.papers.statusNote')}</p>
          <dl className="rs-papers-source">
            <div>
              <dt>{t('landing.papers.query')}</dt>
              <dd className="rs-mono">{joined.query}</dd>
            </div>
            <div>
              <dt>{t('landing.papers.checked', { dates: t('landing.papers.and', { a: formatDate(dates[0], lang, t), b: formatDate(dates[1], lang, t) }) })}</dt>
              <dd className="rs-papers-links">
                {joined.checked.map((c) => (
                  <a key={c.file} href={c.url} rel="noopener">
                    {t('landing.papers.file', { date: formatDate(c.date, lang, t) })}
                  </a>
                ))}
                <a href={joined.script} rel="noopener">
                  {t('landing.papers.script', { date: formatDate(dates[1], lang, t) })}
                </a>
                <a href={`${EVIDENCE_BASE_URL}README.md`} rel="noopener">
                  {t('landing.papers.readme')}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
