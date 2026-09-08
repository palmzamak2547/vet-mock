// Shared motion from the supplied interaction kit, applied to real controls.
// This module never creates actions, answers, saved state or success messages.
import { clamp, element } from './core.js';

export const FEEDBACK_FRAMES = {
  bookmark: [{ transform: 'scale(1)' }, { transform: 'scale(1.16) rotate(-3deg)' }, { transform: 'scale(1)' }],
  like: [{ transform: 'scale(1)' }, { transform: 'scale(1.16) rotate(-3deg)' }, { transform: 'scale(1)' }],
  retry: [{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(-2px)' }, { transform: 'translateX(0)' }],
  reveal: [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
  accordion: [{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'translateY(0)' }],
  toast: [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
  flip: [{ opacity: .3, transform: 'perspective(900px) rotateY(-75deg)' }, { opacity: 1, transform: 'perspective(900px) rotateY(0)' }],
  magnet: [{ transform: 'scale(1)' }, { transform: 'scale(.96)' }, { transform: 'scale(1)' }],
  tilt: [{ transform: 'scale(1)' }, { transform: 'scale(1.025)' }, { transform: 'scale(1)' }],
};

export function playFeedback(target, variant, { scope, layer, event } = {}) {
  if (!target || !scope?.enabled()) return null;
  if (variant === 'ripple' && layer) {
    const rect = target.getBoundingClientRect();
    const ripple = element('i', 'vm-ripple');
    const x = event?.detail ? clamp(event.clientX - rect.left, 0, rect.width) : rect.width / 2;
    const y = event?.detail ? clamp(event.clientY - rect.top, 0, rect.height) : rect.height / 2;
    const size = Math.hypot(rect.width, rect.height) * 2;
    ripple.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;`;
    // Rapid clicking must not build an unbounded stack of surfaces.
    layer.replaceChildren(ripple);
    const animation = scope.animate(ripple, [
      { transform: 'translate(-50%,-50%) scale(0)', opacity: .18 },
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 0 },
    ], { duration: 420 });
    const remove = () => ripple.remove();
    if (animation) animation.finished.then(remove, remove);
    else remove();
    return animation;
  }
  const frames = FEEDBACK_FRAMES[variant];
  return frames ? scope.animate(target, frames, { duration: variant === 'flip' ? 280 : variant === 'retry' ? 300 : 240 }) : null;
}

/** Optional fine-pointer hover; one layout read on entry, one write per frame. */
export function bindHoverFeedback(target, variant, scope) {
  if (!['magnet', 'tilt'].includes(variant)) return;
  const original = target.style.transform;
  let rect = null, point = null, stop = null;
  const reset = () => { stop?.(); stop = null; rect = null; target.style.transform = original; };
  scope.on(target, 'pointerenter', (event) => {
    if (event.pointerType !== 'mouse' || !scope.enabled()) return;
    rect = target.getBoundingClientRect();
  });
  scope.on(target, 'pointermove', (event) => {
    if (!rect || event.pointerType !== 'mouse' || !scope.enabled()) return;
    point = { x: clamp((event.clientX - rect.left) / rect.width - .5, -.5, .5), y: clamp((event.clientY - rect.top) / rect.height - .5, -.5, .5) };
    if (stop) return;
    stop = scope.frame(() => {
      target.style.transform = variant === 'tilt'
        ? `perspective(750px) rotateX(${-point.y * 4}deg) rotateY(${point.x * 4}deg)`
        : `translate(${point.x * 4}px, ${point.y * 4}px)`;
      stop?.(); stop = null;
    });
  }, { passive: true });
  scope.on(target, 'pointerleave', reset);
  scope.on(target, 'click', reset);
  scope.on(target, 'vm:motionchange', reset);
  return reset;
}
