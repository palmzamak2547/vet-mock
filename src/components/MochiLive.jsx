import { useLayoutEffect, useRef, useState } from 'react';
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
    .then((module) => { rigModule = module; return module; })
    // An optional illustration chunk that fails leaves the stills, and the
    // next practice set tries again (never the app's chunk recovery).
    .catch(() => { rigLoading = null; return null; });
  return rigLoading;
}

export default function MochiLive({ pose, play = null, size = 40, slot, className = '' }) {
  const { preferences, reduced } = useMotionPreferences();
  const enabled = mochiEnabled(preferences, useMochiContext(), slot);
  const host = useRef(null);
  const [phase, setPhase] = useState('still');
  const live = Boolean(rigModule) && !reduced;
  useLayoutEffect(() => {
    const el = host.current;
    if (!play || !enabled || !live || !el) return undefined;
    // Below the fold (a long stem on a phone): nobody would see it play.
    const box = el.getBoundingClientRect();
    if (box.bottom < 0 || box.top > window.innerHeight) return undefined;
    const wrap = el.parentElement;
    setPhase('playing');
    return rigModule.playMochi(el, {
      state: play,
      pose,
      // The still shows again in the same frame the rig leaves (a state
      // update alone can land a frame later and blink an empty stamp).
      onDone: () => { wrap.dataset.mochiLive = 'still'; setPhase('still'); },
    });
    // One reaction per mount: the feedback panel mounts once per revealed answer.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!enabled) return null;
  return <span className={`vmx-mochi-live ${className}`} data-mochi-live={phase} aria-hidden="true">
    <Mochi state={pose} size={size} animate={!live} slot={slot} />
    <span ref={host} className="vmx-mochi-live-rig" />
  </span>;
}
