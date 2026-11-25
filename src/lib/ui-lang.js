// @ts-check
// The site's language, read before anything is drawn. The translator (ui-translate.js) and its
// dictionary are fetched only when English is on screen or chosen, so a Thai visit downloads neither.

// The key kept its first name from when only the landing page had a language; it holds the language
// of the whole site. index.html reads it too, to set <html lang> before the first paint.
export const UI_LANG_KEY = 'vmx-landing-lang';

/** The language this visit opens in: one carried from another VetMock site, else the saved one. */
export function readUiLang() {
  try {
    const visit = JSON.parse(sessionStorage.getItem('vmx-family-visit') || '{}') || {};
    if (visit.lang === 'en' || visit.lang === 'th') return visit.lang;
    return JSON.parse(localStorage.getItem(UI_LANG_KEY) || 'null') === 'en' ? 'en' : 'th';
  } catch {
    return 'th';
  }
}

/** @type {Promise<typeof import('./ui-translate.js')> | null} */
let translator = null;

/**
 * Shows the interface in this language and resolves to the one on screen: 'en' unless the translator
 * or its dictionary could not be fetched (offline on a first visit), when the page stays Thai. Every
 * call after the first English one goes through the translator, which settles the order of calls.
 * @param {string} lang @param {{ animate?: boolean }} [options]
 * @returns {Promise<'th' | 'en'>}
 */
export function showInterfaceIn(lang, options) {
  if (lang !== 'en' && !translator) {
    document.documentElement.lang = 'th';
    return Promise.resolve('th');
  }
  // The dictionary is the larger file: ask for it beside the translator, not after it.
  if (lang === 'en') import('../data/ui-en.js').catch(() => {});
  translator ??= import('./ui-translate.js');
  return translator.then((m) => m.showInterfaceIn(lang, options), () => {
    translator = null;
    document.documentElement.lang = 'th';
    return /** @type {'th'} */ ('th');
  });
}
