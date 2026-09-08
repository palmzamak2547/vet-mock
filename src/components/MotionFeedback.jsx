import { useEffect, useRef } from 'react';
import { createScope } from '../lib/motion-kit/core.js';
import { bindHoverFeedback, playFeedback } from '../lib/motion-kit/feedback.js';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';

// Call only after React has committed the real state transition.
export function useMotionFeedback(effect, signal) {
  const ref = useRef(null), owner = useRef(null), previous = useRef(null);
  const { reduced } = useMotionPreferences();
  useEffect(() => {
    const target = ref.current;
    if (!target) return undefined;
    const scope = createScope(target, { quiet: reduced });
    owner.current = scope;
    if (previous.current?.target === target && previous.current.signal !== signal) playFeedback(target, effect, { scope });
    previous.current = { target, signal };
    return () => { scope.destroy(); if (owner.current === scope) owner.current = null; };
    // Preference changes cancel the existing effect without replaying it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effect, signal]);
  useEffect(() => { owner.current?.setQuiet(reduced); }, [reduced]);
  return ref;
}

/** An entering panel wraps only content its caller has already revealed. */
export function MotionEnter({ effect = 'reveal', children, className = '', ...props }) {
  const ref = useRef(null), owner = useRef(null);
  const { reduced } = useMotionPreferences();
  useEffect(() => {
    const scope = createScope(ref.current, { quiet: reduced });
    owner.current = scope;
    playFeedback(ref.current, effect, { scope });
    return () => { scope.destroy(); owner.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effect]);
  useEffect(() => { owner.current?.setQuiet(reduced); }, [reduced]);
  return <div {...props} ref={ref} className={className} data-motion-feedback={effect}>{children}</div>;
}

export function MotionButton({ effect = 'ripple', onClick, children, className = '', type = 'button', ...props }) {
  const ref = useRef(null), layer = useRef(null), owner = useRef(null);
  const { reduced } = useMotionPreferences();
  useEffect(() => {
    const scope = createScope(ref.current, { quiet: reduced });
    owner.current = scope;
    const reset = bindHoverFeedback(ref.current, effect, scope);
    return () => { reset?.(); scope.destroy(); owner.current = null; layer.current?.replaceChildren(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effect]);
  useEffect(() => { owner.current?.setQuiet(reduced); }, [reduced]);
  return <button {...props} ref={ref} type={type} className={`${className} vmx-motion-action`} data-motion-feedback={effect} onClick={event => {
    // Business behavior runs immediately, independently of visual support.
    onClick?.(event);
    if (!event.defaultPrevented) playFeedback(ref.current, effect, { scope: owner.current, layer: layer.current, event });
  }}>{children}<span ref={layer} className="vmx-motion-action-layer" aria-hidden="true" /></button>;
}
