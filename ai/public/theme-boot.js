// Runs before first paint (an external file, so the CSP needs no inline script):
// a saved pick wins, otherwise the system theme; nothing flashes the wrong colour.
(function () {
  // Arriving from another VetMock site: ?vmt=light|dark is the theme the student was looking at
  // there. It applies to this visit only (sessionStorage vmx-family-visit), never over the saved
  // choice, and leaves the address. Same names as src/lib/family/family.js (CROSSING, VISIT_KEY,
  // CHOSEN_ATTR), held by its test. No language switch here: ?vml goes.
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
  var saved = null;
  try { saved = localStorage.getItem('vmai-theme'); } catch (e) {}
  var chosen = visit.theme === 'light' || visit.theme === 'dark' ? visit.theme : (saved === 'light' || saved === 'dark' ? saved : null);
  var t = chosen || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', t);
  if (chosen) document.documentElement.setAttribute('data-theme-chosen', chosen);
})();
