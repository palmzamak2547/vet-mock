// Paints the chosen theme before the first frame, so a dark phone never flashes porcelain.
// An external file because the CSP allows script-src 'self' only. Keep the key and values in
// step with src/lib/prefs.js.
(function () {
  // Arriving from another VetMock site: ?vmt=light|dark is the theme the student was looking at
  // there. Taken once into this site's own key, then out of the address. Same name as
  // src/lib/family/family.js (CROSSING), held by its test. VCA has no language switch: ?vml goes.
  try {
    var q = new URLSearchParams(location.search);
    if (q.has('vmt') || q.has('vml')) {
      var vt = q.get('vmt');
      if (vt === 'light' || vt === 'dark') {
        var prefs = {};
        try { prefs = JSON.parse(localStorage.getItem('vca:prefs') || '{}') || {}; } catch (e) { prefs = {}; }
        prefs.theme = vt;
        localStorage.setItem('vca:prefs', JSON.stringify(prefs));
      }
      q.delete('vmt'); q.delete('vml');
      var qs = q.toString();
      history.replaceState(history.state, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    }
  } catch (e) { /* storage or history blocked: the saved theme stands */ }
  var theme = 'system';
  try {
    var saved = JSON.parse(localStorage.getItem('vca:prefs') || '{}');
    if (saved && (saved.theme === 'light' || saved.theme === 'dark' || saved.theme === 'system')) theme = saved.theme;
  } catch (e) { /* storage blocked: follow the system */ }
  var dark = theme === 'dark' || (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
})();
