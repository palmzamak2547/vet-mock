import { useEffect, useRef, useState } from 'react';
import Mochi, { mochiEnabled } from './Mochi.jsx';
import { useMochiContext } from './MochiContext.jsx';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';
import { motionIsReduced, readMotionPreferences } from '../lib/motion-preferences.js';

// Mochi that moves for a moment. The still pose is the same <Mochi> image as
// everywhere else; when motion is allowed and the rig has loaded, one Motion
// Kit state plays over it (lib/mochi-live.js) and ends on that still.
// Inputs, not animation code, come from the screen: `pose` (the still) and
// `play` (the state to play once, or null), chosen by lib/mochi-reactions.js.
// Until the rig has loaded, or under reduced motion, the still keeps its
// small CSS greeting, as before.

let rigModule = null;
let rigLoading = null;

/** Start loading the rig once, only where it could ever play. */
export function preloadMochiRig() {
  if (rigModule || rigLoading || typeof window === 'undefined') return rigLoading;
  if (motionIsReduced() || !readMotionPreferences().companion) return null;
  rigLoading = import('../lib/mochi-live.js')
    .then((module) => {
      rigModule = module;
      // Build the rig itself in idle time too (lib/mochi-live.js warmRig).
      const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 300));
      idle(() => module.warmRig?.());
      return module;
    })
    // An optional illustration chunk that fails leaves the stills, and the
    // next practice set tries again (never the app's chunk recovery).
    .catch(() => { rigLoading = null; return null; });
  return rigLoading;
}

export default function MochiLive({ pose, play = null, size = 40, slot, className = '' }) {
  const { preferences, reduced } = useMotionPreferences();
  const enabled = mochiEnabled(preferences, useMochiContext(), slot);
  const host = useRef(null);
  const live = Boolean(rigModule) && !reduced;
  // Decided once, at mount: the feedback panel mounts once per revealed answer.
  const [canPlay] = useState(() => Boolean(play) && live);
  // Nothing of the rig runs inside the tap that revealed the answer: the
  // verdict paints first, then the observer's first callback (after that
  // frame's layout, no forced reflow) starts the reaction, or shows the
  // still when the stamp is below the fold. While pending the still is
  // hidden, so the rig's first frame never pops over a different pose.
  // The state attribute is written on the element directly: a React state
  // update for it re-rendered inside the tap.
  useEffect(() => {
    const el = host.current;
    if (!canPlay || !enabled || !el) return undefined;
    const wrap = el.parentElement;
    let stop = null;
    const begin = (visible) => {
      if (!visible) { wrap.dataset.mochiLive = 'still'; return; }
      wrap.dataset.mochiLive = 'playing';
      stop = rigModule.playMochi(el, { state: play, pose, onDone: () => { wrap.dataset.mochiLive = 'still'; } });
    };
    if (typeof IntersectionObserver === 'undefined') {
      const id = requestAnimationFrame(() => begin(true));
      return () => { cancelAnimationFrame(id); stop?.(); };
    }
    const io = new IntersectionObserver((entries) => {
      io.disconnect();
      begin(entries.some((e) => e.isIntersecting));
    });
    io.observe(el);
    return () => { io.disconnect(); stop?.(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!enabled) return null;
  return <span className={`vmx-mochi-live ${className}`} data-mochi-live={canPlay ? 'pending' : 'still'} aria-hidden="true">
    <Mochi state={pose} size={size} animate={!live} slot={slot} />
    <span ref={host} className="vmx-mochi-live-rig" />
  </span>;
}
