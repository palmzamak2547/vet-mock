// The workspace film: a short cut of the VetMock Workspace film, played once per device before the
// entrance, the first time a student opens the workspace. A real cow, then a run of old plates seen
// through a microscope eyepiece, then into the lens until the field is the page's own paper, where
// the entrance takes over. A plain muted <video>: if it has not started within 2.5 s, or stalls for
// 1.5 s, the page goes on without it. Skip by button, click, Escape or any key. Gated by
// film-gate.js; mounted by Workspace.jsx. OWNER: landing role.
import { useEffect, useRef, useState } from 'react';
import { registerArea, useT } from '../i18n/index.js';
import entrance from '../i18n/entrance.js';
import './workspace-film.css';

registerArea('entrance', entrance);

// Bump when the files in public/film change: /film/ is served as immutable.
const VERSION = '1';

/** @param {{ onLeave: () => void, onGone: () => void }} props onLeave when the film starts to fade
 *  (the entrance mounts underneath), onGone once it has faded out */
export default function WorkspaceFilm({ onLeave, onGone }) {
  const { t } = useT();
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const leaveRef = useRef(() => {});
  const cb = useRef({ onLeave, onGone });
  cb.current = { onLeave, onGone };
  const [phase, setPhase] = useState('wait'); // wait | play | leaving
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
    v.play()?.catch(leave);
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

  return (
    <div className="rs-wsfilm" data-phase={phase} onPointerDown={() => leaveRef.current()}>
      <video
        ref={videoRef}
        src={`${base}.mp4?v=${VERSION}`}
        poster={`${base}.jpg?v=${VERSION}`}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      />
      <button type="button" className="rs-wsfilm-skip" aria-label={t('entrance.film.skipLabel')} onClick={() => leaveRef.current()}>
        {t('entrance.film.skip')}
      </button>
    </div>
  );
}
