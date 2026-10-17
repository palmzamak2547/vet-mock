// Paints the chosen theme before the first frame, so a dark phone never flashes porcelain.
// An external file because the CSP allows script-src 'self' only. Keep the key and values in
// step with src/lib/prefs.js.
(function () {
  var theme = 'system';
  try {
    var saved = JSON.parse(localStorage.getItem('vca:prefs') || '{}');
    if (saved && (saved.theme === 'light' || saved.theme === 'dark' || saved.theme === 'system')) theme = saved.theme;
  } catch (e) { /* storage blocked: follow the system */ }
  var dark = theme === 'dark' || (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
})();
