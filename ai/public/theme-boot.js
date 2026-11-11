// Runs before first paint (an external file, so the CSP needs no inline script):
// a saved pick wins, otherwise the system theme; nothing flashes the wrong colour.
(function () {
  // Arriving from another VetMock site: ?vmt=light|dark is the theme the student was looking at
  // there. Taken once into this site's own key, then out of the address. Same name as
  // src/lib/family/family.js (CROSSING), held by its test. No language switch here: ?vml goes.
  try {
    var q = new URLSearchParams(location.search);
    if (q.has('vmt') || q.has('vml')) {
      var vt = q.get('vmt');
      if (vt === 'light' || vt === 'dark') localStorage.setItem('vmai-theme', vt);
      q.delete('vmt'); q.delete('vml');
      var qs = q.toString();
      history.replaceState(history.state, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    }
  } catch (e) { /* storage or history blocked: the saved theme stands */ }
  var t = null;
  try { t = localStorage.getItem('vmai-theme'); } catch (e) {}
  if (t !== 'light' && t !== 'dark') {
    t = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  document.documentElement.setAttribute('data-theme', t);
})();
