// Existing study-success callers use the shared Motion Kit particle engine.
import { createParticles } from './motion-kit/particles.js';
import { createScope } from './motion-kit/core.js';
import { motionIsReduced, readMotionPreferences, subscribeMotionPreferences } from './motion-preferences.js';
let active = null;

export function clearConfetti() { active?.destroy(); }
export function fireConfetti({ count = 120, originXRatio = .5, originYRatio = .55 } = {}) {
  if (typeof document === 'undefined' || document.hidden || motionIsReduced()) return () => {};
  if (!active) {
    const root = document.createElement('div');
    root.className = 'vmx-celebration-overlay';
    root.setAttribute('aria-hidden', 'true');
    root.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:100;overflow:hidden;';
    document.body.append(root);
    const scope = createScope(root), fx = createParticles(root, { scope, kind: 'burst', preset: readMotionPreferences().celebration });
    if (fx.canvas) fx.canvas.style.cssText += ';position:absolute;inset:0;pointer-events:none;';
    let timer, destroyed = false;
    const destroy = () => {
      if (destroyed) return;
      destroyed = true; clearTimeout(timer); unsubscribe(); fx.destroy(); scope.destroy(); root.remove();
      if (active?.root === root) active = null;
    };
    const unsubscribe = subscribeMotionPreferences(() => { if (motionIsReduced()) destroy(); });
    scope.on(document, 'visibilitychange', () => { if (document.hidden) destroy(); });
    scope.on(window, 'vmx-view-change', destroy);
    scope.on(window, 'pagehide', destroy);
    scope.on(window.matchMedia('(prefers-reduced-motion: reduce)'), 'change', () => { if (motionIsReduced()) destroy(); });
    active = { root, fx, destroy, extend() { clearTimeout(timer); timer = setTimeout(destroy, 2800); } };
  }
  active.fx.setIntensity(Math.min(2, Math.max(.25, count / 70)));
  active.fx.burst(readMotionPreferences().celebration, window.innerWidth * originXRatio, window.innerHeight * originYRatio);
  active.extend();
  return active.destroy;
}
