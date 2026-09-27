// The entrance into the workspace at /app [M1-DESIGN.md 16]: a designed first screen and transition
// (the herd settles into the project list) that plays once per device, skippable, and is still
// under prefers-reduced-motion. Same performance rules as the front door. OWNER: landing role.
//
// First visit on this device (prefs.entranceSeen false): the herd from the front door, 728 dots in
// one WebGL draw, drifts as a cloud behind a short greeting, then gathers onto the border of the
// element the workspace points at (the new-user drop zone, or the project list) while the veil
// lifts; for a moment the dots are the dashed border, then they fade and the real border remains.
// Under 2.5 s, skippable with the button or Escape, and the overlay never takes pointer input (only
// its skip button does), so the list behind it works as soon as it is ready. Later visits: a short
// cross-fade. Reduced motion: no transition at all. No WebGL: the veil and greeting fade in CSS.
// The only number it prints is the student's own project count, passed in from the store.
import { useEffect, useRef, useState } from 'react';
import { registerArea, useT } from '../i18n/index.js';
import entrance from '../i18n/entrance.js';
import { readPrefs, writePrefs } from '../lib/store/prefs.js';
import { HERD_LAYOUTS, herdData } from '../landing/herd/data.js';
import { createHerdEngine, readGlColours, webglAvailable, DPR_CAP } from '../landing/herd/engine.js';
import { smooth } from '../landing/story/layout.js';
import { useReducedMotion } from '../landing/shell/theme.js';
import { gatherToBorders } from './gather.js';
import { ENTRANCE_MS, CROSSFADE_MS } from './entrance-timing.js';
import './entrance.css';

registerArea('entrance', entrance);


/**
 * @param {{ onDone: () => void, projectCount: number,
 *   target?: () => (DOMRect | DOMRect[] | null) }} props
 *   onDone is called when the transition ends or is skipped; projectCount lets the scene show the
 *   student's own number of projects (never a made-up one); target returns the element rectangle(s),
 *   in viewport coordinates, the dots should settle on (default: a centred panel)
 */
export default function Entrance({ onDone, projectCount, target }) {
  const { t } = useT();
  const reduce = useReducedMotion();
  const [mode] = useState(() => (readPrefs().entranceSeen ? 'crossfade' : 'full'));
  const veilRef = useRef(null);
  const textRef = useRef(null);
  const canvasRef = useRef(null);
  const skipRef = useRef(null);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const targetRef = useRef(target);
  targetRef.current = target;

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    writePrefs({ entranceSeen: true });
    onDoneRef.current?.();
  };

  useEffect(() => {
    if (reduce) {
      finish();
      return undefined;
    }
    const onKey = (e) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);

    if (mode === 'crossfade') {
      const veil = veilRef.current;
      const raf = requestAnimationFrame(() => {
        if (veil) veil.style.opacity = '0.002';
      });
      const timer = window.setTimeout(finish, CROSSFADE_MS + 40);
      return () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(timer);
        window.removeEventListener('keydown', onKey);
      };
    }

    const canvas = canvasRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const phone = vw < 820;
    const herd = herdData(phone ? HERD_LAYOUTS.phone : HERD_LAYOUTS.desktop);
    const eng = canvas && webglAvailable() ? createHerdEngine(canvas, herd) : null;
    if (canvas && !eng) canvas.hidden = true;
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    eng?.resize(vw, vh, dpr);
    const colours = readGlColours();
    const pointPx = phone ? 4 : 5;

    const rectsNow = () => {
      let r = null;
      try {
        r = targetRef.current?.() || null;
      } catch {
        r = null;
      }
      const list = (Array.isArray(r) ? r : r ? [r] : []).filter((x) => x && x.width > 8 && x.height > 8);
      if (list.length) return list.map((x) => ({ x: x.left, y: x.top, w: x.width, h: x.height }));
      const w = Math.min(560, vw - 48);
      const h = Math.min(260, vh * 0.35);
      return [{ x: (vw - w) / 2, y: vh * 0.55 - h / 2, w, h }];
    };
    let lastRects = '';
    const place = () => {
      if (!eng) return;
      const rects = rectsNow();
      const key = rects.map((r) => `${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.w)},${Math.round(r.h)}`).join('|');
      if (key === lastRects) return;
      lastRects = key;
      const plan = gatherToBorders(rects, { total: herd.N, pitch: pointPx + 3, radius: 14, pointPx });
      eng.setTarget(plan.grid, plan.sizes, plan.use, plan.pos);
    };
    place();

    const t0 = performance.now();
    let raf = 0;
    let lastPlace = 0;
    const M = ENTRANCE_MS;
    const tick = (now) => {
      raf = 0;
      if (doneRef.current) return;
      const e = now - t0;
      if (e >= M.end) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
      if (e - lastPlace > 180 && e < M.gatherEnd) {
        lastPlace = e;
        place();
      }
      const veil = 1 - smooth(M.veilStart, M.veilEnd, e);
      if (veilRef.current) veilRef.current.style.opacity = String(Math.max(0.002, veil));
      if (textRef.current) {
        // The greeting is gone before the veil starts to lift, so it never ghosts over the workspace
        // heading (review round 2).
        const tin = smooth(0, 200, e) * (1 - smooth(M.veilStart - 350, M.veilStart, e));
        textRef.current.style.opacity = String(Math.max(0, tin).toFixed(3));
        textRef.current.style.transform = `translateY(${((1 - smooth(0, 400, e)) * 12).toFixed(1)}px)`;
      }
      if (eng && !eng.lost()) {
        const g = smooth(M.gatherStart, M.gatherEnd, e);
        const dim = smooth(0, 220, e) * (1 - smooth(M.fadeStart, M.end - 60, e));
        eng.draw({
          time: now / 1000, fold: 0, grid: g, dim, posMix: 0.35 + 0.65 * g, reduce: false, pointPx, posBoost: 0, stagger: 0.35,
          colPos: colours.pos, colNeg: colours.neg,
          scatterOrigin: [0, -vh * 0.04], farmOrigin: [0, 0], gridOrigin: [-vw / 2, -vh / 2],
        });
      }
    };
    raf = requestAnimationFrame(tick);
    const onVis = () => {
      // A hidden tab would freeze mid-transition: finish instead.
      if (document.hidden) finish();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVis);
      eng?.destroy();
    };
  }, [reduce, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (reduce) return null;
  return (
    <div className={`rs-entrance rs-entrance-${mode}`} aria-hidden={mode === 'crossfade' ? 'true' : undefined}>
      <div className="rs-entrance-veil" ref={veilRef} />
      {mode === 'full' ? (
        <>
          <canvas className="rs-entrance-canvas" ref={canvasRef} aria-hidden="true" />
          <div className="rs-entrance-text" ref={textRef} role="status">
            <p className="rs-entrance-eyebrow">{t('entrance.eyebrow')}</p>
            <p className="rs-entrance-title">{t('entrance.opening')}</p>
            <p className="rs-entrance-sub">
              {projectCount > 0 ? t('entrance.returning', { count: projectCount }) : t('entrance.first')}
            </p>
          </div>
          <button type="button" className="rs-entrance-skip" ref={skipRef} onClick={finish}>
            {t('entrance.skip')}
          </button>
        </>
      ) : null}
    </div>
  );
}
