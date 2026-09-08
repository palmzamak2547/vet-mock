import { useEffect, useRef } from 'react';
import { createScope } from '../lib/motion-kit/core.js';
import { createParticles } from '../lib/motion-kit/particles.js';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';

export default function FocusBackdrop({ preset, paused }) {
  const root = useRef(null), owner = useRef(null);
  const { reduced, preferences } = useMotionPreferences();
  useEffect(() => {
    if (preset === 'none' || preferences.mode === 'off') return undefined;
    const scope = createScope(root.current, { quiet: reduced, paused });
    owner.current = scope;
    const fx = createParticles(root.current, { scope, kind: 'ambient', preset, maxDpr: 1.25 });
    return () => { fx.destroy(); scope.destroy(); owner.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, preferences.mode]);
  useEffect(() => { owner.current?.setPaused(paused); }, [paused]);
  useEffect(() => { owner.current?.setQuiet(reduced); }, [reduced]);
  return <div ref={root} className="vmx-focus-atmosphere" aria-hidden="true" data-focus-ambience={preset} />;
}
