// Decides before the first paint whether the opening film plays, so a first visit starts dark instead
// of flashing the cream page. The front door only, once per device, never under reduced motion, never
// for automation or browsers without WebGL2; ?intro=1 replays it, ?intro=0 skips it. The React side
// (src/landing/intro/gate.js) reads the attribute this sets and never decides on its own. "Seen" is
// the introSeen field of the app's one preferences entry (src/lib/store/prefs.js).
(function () {
  try {
    var q = new URLSearchParams(location.search).get('intro');
    var play = q === '1' || (q !== '0' &&
      location.pathname === '/' && !location.hash &&
      !navigator.webdriver && !!window.WebGL2RenderingContext &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches &&
      !JSON.parse(localStorage.getItem('vmx-research-prefs-v1') || '{}').introSeen);
    if (play) document.documentElement.setAttribute('data-intro', 'pending');
  } catch (e) {
    // Storage or matchMedia unavailable: no film, the page opens as usual.
  }
})();
