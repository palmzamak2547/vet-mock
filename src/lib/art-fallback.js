// Local fallback for optional artwork <img>s that sit outside the Mochi
// component (squad mascots, seasonal stamps, empty-state art). A missing
// file must degrade to the static portrait — never a broken-image icon and
// never the app's stale-module recovery/reload. Mirrors the two-step
// contract in Mochi.jsx: first failure swaps the source, a second hides.
//
// The portrait is the companion, so the swap follows the same device
// preference as every other Mochi surface: with the companion off, or motion
// off, a failed image is simply hidden. A swapped image also drops its alt,
// which described the artwork that failed, not the portrait now showing. The
// state lives on the element, so a caller whose src can change must give the
// <img> key={src}, or a hidden or swapped element outlives its failed source.
import { readMotionPreferences } from './motion-preferences.js';

export function artImgFallback(event) {
  const img = event?.currentTarget;
  if (!img) return;
  const { companion, mode } = readMotionPreferences();
  if (img.dataset.artFallback || !companion || mode === 'off') {
    img.style.display = 'none';
    return;
  }
  img.dataset.artFallback = '1';
  img.alt = '';
  img.src = '/motion/assets/mochi.png';
}
