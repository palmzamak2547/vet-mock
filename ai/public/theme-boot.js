// Runs before first paint (an external file, so the CSP needs no inline script):
// a saved pick wins, otherwise the system theme; nothing flashes the wrong colour.
(function () {
  var t = null;
  try { t = localStorage.getItem('vmai-theme'); } catch (e) {}
  if (t !== 'light' && t !== 'dark') {
    t = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  document.documentElement.setAttribute('data-theme', t);
})();
