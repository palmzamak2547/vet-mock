// The opening film on the front door. It plays over the landing, then flies into the sunrise and
// floods to the page's own background, so the page arrives out of the light. Skip by button, click,
// key or scroll: skipping jumps to the flight, so the handover always looks the same. The film is
// film.js, the same renderer that made the social video. Loaded lazily by Landing.jsx only when
// gate.js says it should play. OWNER: landing role.
import { useEffect, useRef, useState } from 'react';
import { useT } from '../../i18n/index.js';
import { createFilm } from './film.js';
import { endIntro } from './gate.js';
import './intro.css';

// The flood colour is the page background of the current theme, read from the token.
function pageBackground() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--rs-bg').trim();
  const m = /^#([0-9a-f]{6})$/i.exec(raw);
  const n = m ? parseInt(m[1], 16) : 0xf6efe4;
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const loadFace = () =>
  new FontFace('Newsreader Intro', 'url(/fonts/newsreader-intro.woff2)', { weight: '440' })
    .load()
    .then((f) => document.fonts.add(f));

export default function IntroFilm({ onDone }) {
  const { t } = useT();
  const glRef = useRef(null);
  const txRef = useRef(null);
  const skipRef = useRef(() => {});
  const [phase, setPhase] = useState('film'); // film | fly | leaving

  useEffect(() => {
    let film = null;
    let raf = 0;
    let alive = true;
    let clock = 0;
    let last = 0;
    let flyAt = Infinity;
    let flying = false;
    const dts = [];
    const fit = () => film && film.resize(window.innerWidth, window.innerHeight);
    const finish = () => {
      if (!alive) return;
      alive = false;
      cancelAnimationFrame(raf);
      endIntro();
      setPhase('leaving');
      window.setTimeout(onDone, 400);
    };
    skipRef.current = () => {
      if (!film) finish(); // still loading: go straight to the page
      else if (clock < flyAt) clock = flyAt;
    };
    const frame = (now) => {
      if (!alive) return;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      // Shaders compile in the background; the clock waits for the programs a moment ahead rather
      // than stalling mid-shot on a compile.
      if (!document.hidden && film.ready(clock + 0.35)) clock += dt;
      if (!film.ready(clock)) {
        raf = requestAnimationFrame(frame);
        return;
      }
      // A machine that cannot hold about 24 frames a second gets fewer pixels instead of a stutter.
      if (dts.length < 20 && dt > 0) {
        dts.push(dt);
        if (dts.length === 20 && dts.reduce((a, b) => a + b, 0) / 20 > 0.042) {
          film.setDpr(0.7);
          fit();
        }
      }
      if (!flying && clock >= flyAt) {
        flying = true;
        setPhase('fly');
      }
      if (clock >= film.duration) {
        film.renderAt(film.duration - 1e-3);
        finish();
        return;
      }
      film.renderAt(clock);
      raf = requestAnimationFrame(frame);
    };

    // The typeface gets a second and a half; after that the film starts with the fallback serif.
    Promise.race([loadFace(), new Promise((r) => window.setTimeout(r, 1500))])
      .catch(() => {})
      .then(() => {
        if (!alive) return;
        film = createFilm({
          glCanvas: glRef.current,
          txCanvas: txRef.current,
          cut: 'web',
          lang: 'en',
          dpr: Math.min(window.devicePixelRatio || 1, 1.25),
          face: '"Newsreader Intro", Georgia, serif',
          flood: pageBackground(),
        });
        flyAt = film.shots.find((s) => s.kind === 'fly').t0;
        film.prepare();
        fit();
        raf = requestAnimationFrame(frame);
      })
      .catch(finish); // WebGL2 refused at run time: go straight to the page

    // Scrolling or typing means "take me to the page": skip, and keep the page at its top so the
    // handover lands on the hero. The Skip button keeps its own keys (Enter and Space press it).
    const onKey = (e) => {
      if (e.key === 'Tab' || e.key === 'Shift' || e.target instanceof HTMLButtonElement) return;
      e.preventDefault();
      skipRef.current();
    };
    const onScroll = (e) => {
      e.preventDefault();
      skipRef.current();
    };
    window.addEventListener('resize', fit);
    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onScroll, { passive: false });
    window.addEventListener('touchmove', onScroll, { passive: false });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', fit);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', onScroll);
      window.removeEventListener('touchmove', onScroll);
    };
  }, [onDone]);

  return (
    <div className="rs-intro" data-phase={phase} onPointerDown={() => skipRef.current()}>
      <canvas ref={glRef} aria-hidden="true" />
      <canvas ref={txRef} aria-hidden="true" />
      <button type="button" className="rs-intro-skip" aria-label={t('landing.intro.skipLabel')} onClick={() => skipRef.current()}>
        {t('landing.intro.skip')}
      </button>
    </div>
  );
}
