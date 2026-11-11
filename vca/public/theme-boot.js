// Paints the chosen theme before the first frame, so a dark phone never flashes porcelain.
// An external file because the CSP allows script-src 'self' only. Keep the key and values in
// step with src/lib/prefs.js.
(function () {
  // Arriving from another VetMock site: ?vmt=light|dark is the theme the student was looking at
  // there. It applies to this visit only (sessionStorage vmx-family-visit), never over the saved
  // choice, and leaves the address. Same names as src/lib/family/family.js (CROSSING, VISIT_KEY,
  // CHOSEN_ATTR), held by its test. VCA has no language switch: ?vml goes.
  var visit = {};
  try {
    visit = JSON.parse(sessionStorage.getItem('vmx-family-visit') || '{}') || {};
    var q = new URLSearchParams(location.search);
    if (q.has('vmt') || q.has('vml')) {
      var vt = q.get('vmt');
      if (vt === 'light' || vt === 'dark') {
        visit.theme = vt;
        sessionStorage.setItem('vmx-family-visit', JSON.stringify(visit));
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
  if (visit.theme === 'light' || visit.theme === 'dark') theme = visit.theme;
  var dark = theme === 'dark' || (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var d = document.documentElement;
  d.setAttribute('data-theme', dark ? 'dark' : 'light');
  if (theme === 'light' || theme === 'dark') d.setAttribute('data-theme-chosen', theme);
})();
