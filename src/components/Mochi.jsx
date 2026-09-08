import { memo, useEffect, useRef, useState } from 'react';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';
import { useMochiContext } from './MochiContext.jsx';
import { MOCHI_POSE_ASSETS } from '../data/mochi-poses.generated.js';

function Picture({ pose, size, animate, reduced, slot, className }) {
  const host = useRef(null);
  const [seen, setSeen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failures, setFailures] = useState(0);
  const [settled, setSettled] = useState(!animate || reduced);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setSeen(true); observer.disconnect(); }
    });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { if (reduced) setSettled(true); }, [reduced]);
  const playing = loaded && animate && !reduced && !settled;
  const asset = typeof MOCHI_POSE_ASSETS[pose] === 'string' ? MOCHI_POSE_ASSETS[pose] : MOCHI_POSE_ASSETS.idle;
  return <span ref={host}
    className={`vmx-mochi ${className}${playing ? ' is-reacting' : ''}`}
    style={{ width: size, height: size }} aria-hidden="true"
    data-mochi-slot={slot} data-mochi-pose={pose}
    data-mochi-settled={String(settled || reduced || !animate)}
    onAnimationEnd={event => { if (event.target === event.currentTarget) setSettled(true); }}
  >
    {seen && failures < 2 && <img
      src={failures ? '/motion/assets/mochi.png' : asset} width={size} height={size}
      alt="" decoding="async" loading="lazy"
      onLoad={() => setLoaded(true)}
      onError={() => { setLoaded(false); setFailures(count => Math.min(count + 1, 2)); }}
    />}
  </span>;
}

// Ordinary UI needs no artwork JavaScript or WebGL. A failed native image can
// fall back locally, without invoking the app's stale-module recovery/reload.
const Mochi = memo(function Mochi({ state, size = 44, animate = false, slot = 'inline', className = '', fallback = null }) {
  const { preferences, reduced } = useMotionPreferences();
  const context = useMochiContext();
  const enabled = preferences.companion && preferences.mode !== 'off'
    && (context.visible || (slot === 'feedback' && context.feedback));
  if (!enabled) return fallback;
  const pose = state || context.pose;
  return <Picture key={pose} {...{ pose, size, animate, reduced, slot, className }} />;
});
export default Mochi;
