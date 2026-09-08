import { useEffect, useRef } from 'react';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';
import { createScope } from '../lib/motion-kit/core.js';
import { createLoader } from '../lib/motion-kit/loaders.js';
import '../styles-motion-kit.css';

export default function MotionLoader({ progress, label = 'กำลังโหลด' }) {
  const host = useRef(null), loader = useRef(null), scope = useRef(null);
  const { preferences, reduced } = useMotionPreferences();
  const measured = typeof progress === 'number' && Number.isFinite(progress);
  // Never turn an indeterminate wait into a made-up percentage.
  const variant = measured ? 'progress' : preferences.loader === 'progress' ? 'pages' : preferences.loader;
  useEffect(() => {
    if (preferences.mode === 'off') return;
    scope.current = createScope(host.current, { quiet: reduced });
    loader.current = createLoader(host.current, { scope: scope.current, variant, label, progress: measured ? progress : 0 });
    return () => { loader.current?.destroy(); scope.current?.destroy(); loader.current = null; scope.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, preferences.mode, label]);
  useEffect(() => { scope.current?.setQuiet(reduced); }, [reduced]);
  useEffect(() => { if (measured) loader.current?.setProgress(progress); }, [measured, progress]);
  return <span ref={host} className="vmx-motion-loader" aria-hidden="true" />;
}
