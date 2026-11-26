// @ts-check
// The site's language, read before anything is drawn. The translator (ui-translate.js) and its
// dictionary are fetched only when English is on screen or chosen, so a Thai visit downloads neither.
import { useSyncExternalStore } from 'react';
import { importFresh } from './chunk-error.js';
import { isPlainObject, readStoredJson } from './stored-json.js';

// The language of the whole site. Not 'vmx-landing-lang', which set only the landing page's language
// before the app had English: a student who once read the landing page in English never chose an
// English app. index.html reads this key too, to set <html lang> before the first paint.
export const UI_LANG_KEY = 'vmx-lang';

/** The language this visit opens in: one carried from another VetMock site, else the saved one. */
export function readUiLang() {
  /** @type {Storage | undefined} */
  let session;
  try { session = window.sessionStorage; } catch { /* refused: the saved choice decides */ }
  const carried = session && readStoredJson('vmx-family-visit', {}, { accept: isPlainObject, storage: session }).lang;
  if (carried === 'en' || carried === 'th') return carried;
  return readStoredJson(UI_LANG_KEY, 'th') === 'en' ? 'en' : 'th';
}

/** @type {Promise<typeof import('./ui-translate.js')> | null} */
let translator = null;
/** The translator once it has arrived, for text read at once. @type {typeof import('./ui-translate.js') | null} */
let loaded = null;

/** Text a canvas draws, which the page's translator cannot reach, in the language on screen. */
export function uiText(/** @type {string} */ text) {
  return loaded ? loaded.uiText(text) : text;
}

/**
 * The language on screen: English once the dictionary reads the page. Not `<html lang>` alone, which
 * index.html sets to the saved language before the dictionary has arrived; the translator sets it
 * again when it switches, and that is the moment this changes.
 */
export function useShownLang() {
  return useSyncExternalStore(watchShownLang, () => loaded?.langOnScreen() ?? 'th');
}

function watchShownLang(/** @type {() => void} */ onChange) {
  const watch = new MutationObserver(onChange);
  watch.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  return () => watch.disconnect();
}

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
  // A chunk that failed (offline on a first visit) stays failed for the page's life in Chromium:
  // the next try fetches it under a fresh query (chunk-error.js), so English loads once online.
  translator ??= /** @type {Promise<typeof import('./ui-translate.js')>} */ (importFresh(() => import('./ui-translate.js')));
  return translator.then((m) => { loaded = m; return m.showInterfaceIn(lang, options); }, () => {
    translator = null;
    document.documentElement.lang = 'th';
    return /** @type {'th'} */ ('th');
  });
}
