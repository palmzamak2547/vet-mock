// Local fallback for optional artwork <img>s that sit outside the Mochi
// component (squad mascots, seasonal stamps, empty-state art). A missing
// file must degrade to the static portrait — never a broken-image icon and
// never the app's stale-module recovery/reload. Mirrors the two-step
// contract in Mochi.jsx: first failure swaps the source, a second hides.
export function artImgFallback(event) {
  const img = event?.currentTarget;
  if (!img) return;
  if (img.dataset.artFallback) {
    img.style.display = 'none';
    return;
  }
  img.dataset.artFallback = '1';
  img.src = '/motion/assets/mochi.png';
}
