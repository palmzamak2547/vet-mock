// The pinned scroll story [M1-DESIGN.md 15.1]: the WebGL herd behind a fixed-size artboard (the
// design's desktop 1440 x 900 or phone 390 x 844 board, scaled to fit the stage), with the hero, the
// four panels, the accuracy card, the result card and the device chapter as layers whose opacity and
// transform come from layout.js. CSS mode (scroll-driven animation from the same function) where the
// browser supports view timelines, JS mode otherwise; one rAF loop either way for WebGL and the
// header state, paused when the story is offscreen or the tab is hidden. Reduced motion renders the
// still story instead: every layer in the page flow, nothing moving, all information shown.
// OWNER: landing role.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useT } from '../../i18n/index.js';
import { appLinkProps } from '../shell/nav.js';
import { readPrefs } from '../../lib/store/prefs.js';
import { storedOwner } from '../../lib/auth/stored.js';
import { HERD_LAYOUTS, herdData, herdFacts, stillHalf } from '../herd/data.js';
import { createHerdEngine, readGlColours, webglAvailable, DPR_CAP } from '../herd/engine.js';
import HerdStill from '../herd/HerdStill.jsx';
import { applyValues, chapterAt, layoutValues, pickVariant, scene, stageScale } from './layout.js';
import { cssTimelinesSupported, keyframesCss } from './keyframes.js';
import { Caption, Device, FoldCard, Glosses, Lines, PANELS, PrivacyCaption, ResultCaption, ResultCard } from './blocks.jsx';
import { useReducedMotion, useTheme } from '../shell/theme.js';


function useViewport() {
  const [vp, set] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        set((p) => (p.w === window.innerWidth && p.h === window.innerHeight ? p : { w: window.innerWidth, h: window.innerHeight }));
      });
    };
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('resize', on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return vp;
}

function Hero({ reg, variant }) {
  const { t } = useT();
  const d = herdFacts().display;
  // "Continue" only for the owner that project belongs to (review round 1: after sign-out the guest
  // was offered an account's project it cannot open).
  const prefs = readPrefs();
  const last = prefs.lastProjectId && prefs.lastProjectOwner === storedOwner() ? prefs.lastProjectId : null;
  return (
    <>
      <div className="rs-l-hero" data-rs="hero" ref={reg?.('hero')}>
        <p className="rs-l-eyebrow rs-l-hero-eyebrow">{t('landing.hero.eyebrow')}</p>
        <h1 className="rs-l-hero-title">
          <Lines a="landing.hero.title1" b="landing.hero.title2" />
        </h1>
        <p className="rs-l-hero-lead">{t('landing.hero.lead')}</p>
        <div className="rs-l-hero-actions">
          {last ? (
            <a className="rs-l-btn rs-l-btn-primary" {...appLinkProps(`/app/p/${last}`)}>
              {t('landing.hero.continue')}
            </a>
          ) : null}
          <a className={`rs-l-btn ${last ? 'rs-l-btn-ghost' : 'rs-l-btn-primary'}`} {...appLinkProps('/app')}>
            {t('landing.hero.open')}
          </a>
          <a className="rs-l-btn rs-l-btn-ghost" href="#rs-how">
            {t('landing.hero.how')}
          </a>
        </div>
      </div>
      <p className="rs-l-hero-note rs-mono" data-rs="heroNote" ref={reg?.('heroNote')}>
        {t('landing.hero.note', { n: d.n, farms: d.farms })}
      </p>
      <a className="rs-l-cue" href="#rs-how" data-rs="cue" ref={reg?.('cue')}>
        <span>{t('landing.hero.cue')}</span>
        <span className={variant === 'phone' ? 'rs-l-cue-arrow rs-l-cue-arrow-bare' : 'rs-l-cue-arrow'} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3 V13 M4 9 L8 13 L12 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </a>
    </>
  );
}

/** The reduced-motion story: every layer in the flow, all information, nothing moving. */
function StillStory({ chrome }) {
  const { t } = useT();
  const ref = useRef(null);
  // The still story reports the header state too (review round 2: under reduced motion the header
  // pill stayed transparent, so text scrolled under the nav): scrolled past 24 px, and the chapter
  // whose section has reached 40% of the window. One passive listener, one frame per burst.
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const ids = ['rs-how', 'rs-acc', 'rs-res', 'rs-priv'];
    let queued = 0;
    const report = () => {
      queued = 0;
      const line = window.innerHeight * 0.4;
      const box = root.getBoundingClientRect();
      let chapter = 0;
      ids.forEach((id, i) => {
        const el = root.querySelector(`#${id}`);
        if (el && el.getBoundingClientRect().top <= line) chapter = i + 1;
      });
      chrome?.story(box.bottom < line ? -1 : chapter, window.scrollY > 24);
    };
    const onScroll = () => { if (!queued) queued = requestAnimationFrame(report); };
    report();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (queued) cancelAnimationFrame(queued);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [chrome]);
  return (
    <section className="rs-still" ref={ref} aria-label={t('landing.story.label')}>
      {/* The title, lead and buttons come first and fit the first screen; the still herd sits beside
          them on a wide screen and under them on a phone (review round 3: above the title it pushed
          both buttons below the fold at 1440 x 900). */}
      <div id="rs-top" className="rs-still-hero">
        <div className="rs-still-hero-text">
          <Hero variant="desktop" />
        </div>
        <HerdStill layout="desktop" className="rs-still-herd" />
      </div>
      <div id="rs-how" className="rs-still-steps">
        {PANELS.map((Panel, i) => (
          <div className="rs-still-step" key={i}>
            <Caption i={i} />
            <Panel />
          </div>
        ))}
      </div>
      <div id="rs-acc" className="rs-still-row">
        <div className="rs-still-col">
          <HerdStill layout="desktop" className="rs-still-herd-sm" />
        </div>
        <FoldCard still />
      </div>
      {/* The glossary follows the accuracy card, so the farm rings sit next to the card they explain (review round 2). */}
      <div className="rs-still-row rs-still-glosses">
        <Glosses titled />
      </div>
      <div id="rs-res" className="rs-still-row">
        <ResultCaption />
        <ResultCard />
      </div>
      <div id="rs-priv" className="rs-still-row">
        <PrivacyCaption />
      </div>
    </section>
  );
}

/**
 * @param {{ chrome: { story: (chapter: number, scrolled: boolean) => void } }} props
 */
export default function Story({ chrome }) {
  const reduce = useReducedMotion();
  if (reduce) return <StillStory chrome={chrome} />;
  return <PinnedStory chrome={chrome} />;
}

function PinnedStory({ chrome }) {
  const { t } = useT();
  const theme = useTheme();
  const vp = useViewport();
  const v = pickVariant(vp.w, vp.h);
  const s = stageScale(v, vp.w, vp.h);
  const widen = herdFacts().stats.widen;
  const cssMode = useMemo(() => cssTimelinesSupported(), []);
  const css = useMemo(() => (cssMode ? keyframesCss(v, widen) : ''), [cssMode, v, widen]);
  const [gl, setGl] = useState(() => (webglAvailable() ? 'on' : 'off'));

  const els = useRef({});
  const regs = useRef({});
  const reg = useCallback((k) => {
    if (!regs.current[k]) regs.current[k] = (el) => { els.current[k] = el; };
    return regs.current[k];
  }, []);
  const colours = useRef(null);
  const dirty = useRef(true);
  const chromeRef = useRef(chrome);
  chromeRef.current = chrome;
  const scaleRef = useRef(s);
  scaleRef.current = s;
  const remeasure = useRef(() => {});
  useEffect(() => {
    remeasure.current();
  }, [s]);

  useEffect(() => {
    colours.current = readGlColours();
    dirty.current = true;
  }, [theme]);

  // Context loss is watched here, not only inside the engine: the engine is torn down when the
  // context is lost, and something must still hear the restore to build it again.
  useEffect(() => {
    const c = els.current.canvas;
    if (!c) return undefined;
    const lost = (e) => {
      e.preventDefault();
      setGl('lost');
    };
    const back = () => {
      setGl('on');
      dirty.current = true;
    };
    c.addEventListener('webglcontextlost', lost);
    c.addEventListener('webglcontextrestored', back);
    return () => {
      c.removeEventListener('webglcontextlost', lost);
      c.removeEventListener('webglcontextrestored', back);
    };
  }, []);

  useEffect(() => {
    const get = (k) => els.current[k];
    const canvas = get('canvas');
    const stage = get('stage');
    const track = get('track');
    if (!canvas || !stage || !track) return undefined;
    let eng = null;
    if (gl === 'on') {
      eng = createHerdEngine(canvas, herdData(HERD_LAYOUTS[v.layout]), { onError: () => setGl('off') });
      if (!eng) setGl('off');
    }
    let raf = 0;
    let alive = true;
    let visible = true;
    let trackTop = 0;
    let range = 1;
    let stageH = 1;
    let lastKey = '';
    const measure = () => {
      const r = track.getBoundingClientRect();
      trackTop = r.top + window.scrollY;
      stageH = stage.clientHeight || window.innerHeight;
      range = Math.max(1, track.offsetHeight - stageH);
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const sc = scaleRef.current;
      eng?.resize(stage.clientWidth / sc, stageH / sc, dpr * sc);
      dirty.current = true;
    };
    measure();
    remeasure.current = measure;
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    ro.observe(stage);
    const tick = (now) => {
      raf = 0;
      if (!alive || document.hidden || !visible) return;
      raf = requestAnimationFrame(tick);
      const y = window.scrollY;
      const t = Math.min(1, Math.max(0, (y - trackTop) / range));
      const key = t.toFixed(5);
      if (key !== lastKey || dirty.current) {
        if (!cssMode) applyValues(layoutValues(t, v, false, widen), get);
        lastKey = key;
      }
      if (eng && !eng.lost()) {
        const sc = scene(t);
        const c = colours.current || readGlColours();
        eng.draw({
          time: now / 1000, fold: sc.fold, grid: sc.grid, dim: sc.dim, posMix: sc.posMix, reduce: false,
          ringAlpha: sc.ringAlpha, ringPx: v.ringPx, pointPx: v.pointPx, colPos: c.pos, colNeg: c.neg, colRing: c.ring,
          scatterOrigin: v.scatterOrigin, farmOrigin: v.farmOrigin, gridOrigin: v.gridOrigin,
          halo: sc.halo, haloC: [v.halo[0], v.halo[1]], haloR: [v.halo[2], v.halo[3]],
        });
      }
      dirty.current = false;
      const past = y > trackTop + range + stageH * 0.5;
      chromeRef.current?.story(past ? -1 : chapterAt(t), y > 24);
    };
    const start = () => {
      if (!raf && alive && visible && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
      if (visible) start();
      else chromeRef.current?.story(-1, window.scrollY > 24);
    });
    io.observe(track);
    const onVis = () => start();
    document.addEventListener('visibilitychange', onVis);
    if (!cssMode) applyValues(layoutValues(Math.min(1, Math.max(0, (window.scrollY - trackTop) / range)), v, false, widen), get);
    start();
    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      remeasure.current = () => {};
      eng?.destroy();
    };
  }, [v, cssMode, widen, gl === 'on']); // eslint-disable-line react-hooks/exhaustive-deps

  const anchors = Object.entries(v.anchors);
  const half = stillHalf(v.layout);
  return (
    <section className="rs-story" data-variant={v.id} data-rs-mode={cssMode ? 'css' : 'js'} aria-label={t('landing.story.label')} style={{ '--rs-s': s, '--rs-track-ratio': v.trackH / v.H }}>
      {css ? <style>{css}</style> : null}
      <div className="rs-story-track" data-rs="track" ref={reg('track')}>
        <span id="rs-top" className="rs-story-anchor" style={{ top: 0 }} />
        {anchors.map(([id, px]) => (
          <span key={id} id={`rs-${id}`} className="rs-story-anchor" style={{ top: `${(px / v.trackH) * 100}%` }} />
        ))}
        <div className="rs-story-stage" ref={reg('stage')}>
          <canvas className="rs-story-canvas" ref={reg('canvas')} aria-hidden="true" hidden={gl !== 'on'} />
          <div className="rs-story-board" style={{ width: v.W, height: v.H }}>
            <Device reg={reg} variant={v.id} />
            {gl !== 'on' ? (
              <HerdStill
                layout={v.layout}
                className="rs-story-fallback"
                style={{ width: half * 2, height: half * 2, left: v.W / 2 + v.farmOrigin[0] - half, top: v.H / 2 + v.farmOrigin[1] - half }}
              />
            ) : null}
            <Hero reg={reg} variant={v.id} />
            <div className="rs-story-persp" aria-hidden="true">
              <div className="rs-story-stack" data-rs="stack" ref={reg('stack')}>
                {PANELS.map((Panel, i) => (
                  <Panel key={i} reg={reg} compact={!v.wide} />
                ))}
              </div>
            </div>
            {[0, 1, 2, 3].map((i) => (
              <Caption key={i} i={i} reg={reg} short={!v.wide} />
            ))}
            <FoldCard reg={reg} short={!v.wide} />
            <ResultCaption reg={reg} short={!v.wide} />
            <ResultCard reg={reg} compact={!v.wide} />
            <PrivacyCaption reg={reg} short={!v.wide} />
          </div>
        </div>
      </div>
      <div className="rs-l-terms-strip">
        <Glosses titled />
      </div>
    </section>
  );
}
