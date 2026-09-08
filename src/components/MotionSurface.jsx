import { useEffect, useRef, useState } from 'react';
import { mountEffect } from '../lib/motion-kit/index.js';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';
import '../styles-motion-kit.css';

/** The imperative kit owns only this empty child, never React's UI or data. */
export default function MotionSurface({ effect, restart = 0, paused = false }) {
  const host = useRef(null), handle = useRef(null);
  const { reduced } = useMotionPreferences();
  const [error, setError] = useState(false);
  // Switching Mochi poses reuses the rig, including the selected 3D camera.
  const family = effect.startsWith('mochi-') ? 'mochi' : effect;
  useEffect(() => {
    const root = host.current;
    setError(false);
    try {
      handle.current = mountEffect(root, effect, { assetBase: '/motion/assets', quiet: reduced, paused, intensity: .75, progress: 0 });
      root.dataset.ready = 'true';
    } catch {
      root.replaceChildren();
      setError(true);
    }
    return () => {
      handle.current?.destroy(); handle.current = null;
      root.replaceChildren(); delete root.dataset.ready;
    };
    // State changes use the controller methods below; they must not reset games.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [family, restart]);
  useEffect(() => { if (family === 'mochi') handle.current?.setEffect(effect); }, [effect, family]);
  useEffect(() => { handle.current?.setPaused(paused); }, [paused]);
  useEffect(() => { handle.current?.setQuiet(reduced); }, [reduced]);
  return <div className="vmx-motion-surface">
    <div ref={host} className="vmx-motion-stage" />
    {error && <p role="status">เปิดกิจกรรมนี้ไม่สำเร็จ ลองเลือกอีกครั้งหรือกลับมาเมื่อเชื่อมต่อได้</p>}
  </div>;
}
