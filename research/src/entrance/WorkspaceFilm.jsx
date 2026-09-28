// The workspace film: a short cut of the VetMock Workspace film, played once per device before the
// entrance, the first time a student opens the workspace. A real cow, then a run of old plates seen
// through a microscope eyepiece, then into the lens until the field is the page's own paper, where
// the entrance takes over. A plain <video> with its score: with sound when the browser allows it
// (the student has just clicked into the workspace), muted otherwise, with a button either way
// (lib/film-sound.js). If it has not started within 2.5 s, or stalls for 1.5 s, the page goes on
// without it. Skip by button, click, Escape or any key. Gated by film-gate.js; mounted by
// Workspace.jsx. OWNER: landing role.
import { useEffect, useRef, useState } from 'react';
import { registerArea, useT } from '../i18n/index.js';
import entrance from '../i18n/entrance.js';
import { playWithSound, rememberSound } from '../lib/film-sound.js';
import './workspace-film.css';

registerArea('entrance', entrance);

// Bump when the files in public/film change: /film/ is served as immutable.
const VERSION = '2';

/** @param {{ onLeave: () => void, onGone: () => void }} props onLeave when the film starts to fade
 *  (the entrance mounts underneath), onGone once it has faded out */
export default function WorkspaceFilm({ onLeave, onGone }) {
  const { t } = useT();
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const leaveRef = useRef(() => {});
  const cb = useRef({ onLeave, onGone });
  cb.current = { onLeave, onGone };
  const [phase, setPhase] = useState('wait'); // wait | play | leaving
  const [sound, setSound] = useState(/** @type {boolean|null} */ (null)); // null until it plays
  const [base] = useState(() => `/film/workspace-${window.innerHeight > window.innerWidth ? '9x16' : '16x9'}`);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    let done = false;
    let startTimer = 0;
    let stallTimer = 0;
    let goneTimer = 0;
    const leave = () => {
      if (done) return;
      done = true;
      window.clearTimeout(startTimer);
      window.clearTimeout(stallTimer);
      setPhase('leaving');
      // the sound leaves with the picture (where the volume can be set; iOS keeps it until the end)
      const v0 = v.volume;
      const t0 = performance.now();
      const fade = (now) => {
        // a frame's timestamp can be a little earlier than t0: clamp, volume outside [0, 1] throws
        const k = Math.min(Math.max((now - t0) / 400, 0), 1);
        v.volume = v0 * (1 - k);
        if (k < 1 && !v.paused) requestAnimationFrame(fade);
      };
      requestAnimationFrame(fade);
      cb.current.onLeave();
      goneTimer = window.setTimeout(() => cb.current.onGone(), 450);
    };
    leaveRef.current = leave;
    startTimer = window.setTimeout(leave, 2500);
    const playing = () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(stallTimer);
      setPhase((p) => (p === 'leaving' ? p : 'play'));
    };
    const waiting = () => {
      window.clearTimeout(stallTimer);
      stallTimer = window.setTimeout(leave, 1500);
    };
    v.addEventListener('playing', playing);
    v.addEventListener('waiting', waiting);
    v.addEventListener('ended', leave);
    v.addEventListener('error', leave);
    playWithSound(v).then((on) => {
      if (!done) setSound(on);
    }, leave);
    const onKey = (e) => {
      if (e.key === 'Tab' || e.key === 'Shift') return;
      if (e.target instanceof HTMLButtonElement && e.key !== 'Escape') return;
      e.preventDefault();
      leave();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      done = true;
      window.clearTimeout(startTimer);
      window.clearTimeout(stallTimer);
      window.clearTimeout(goneTimer);
      v.removeEventListener('playing', playing);
      v.removeEventListener('waiting', waiting);
      v.removeEventListener('ended', leave);
      v.removeEventListener('error', leave);
      window.removeEventListener('keydown', onKey);
      v.pause();
    };
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setSound(!v.muted);
    rememberSound(!v.muted);
  };

  return (
    <div className="rs-wsfilm" data-phase={phase} onPointerDown={() => leaveRef.current()}>
      <video
        ref={videoRef}
        src={`${base}.mp4?v=${VERSION}`}
        poster={`${base}.jpg?v=${VERSION}`}
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="rs-wsfilm-controls" onPointerDown={(e) => e.stopPropagation()}>
        {sound === null ? null : (
          <button type="button" className="rs-wsfilm-btn" onClick={toggleSound}>
            {t(sound ? 'entrance.film.soundOff' : 'entrance.film.soundOn')}
          </button>
        )}
        <button type="button" className="rs-wsfilm-btn" aria-label={t('entrance.film.skipLabel')} onClick={() => leaveRef.current()}>
          {t('entrance.film.skip')}
        </button>
      </div>
    </div>
  );
}
