// The one way the app loads a part of itself lazily. React's own lazy() keeps
// a failed import failed for the life of the page, and Chromium refuses to ask
// for the same URL twice, so one dropped request (a flaky phone connection, or
// a release that replaced the files a second ago) used to leave that part dead
// until a reload. Here a failed download is asked for once more under a fresh
// URL (importFresh) before anything is shown, and `.retry()` swaps in a new
// lazy() for a boundary that offers the student another try.
//
// A part a page cannot work without renders under the page's boundary, which
// says what failed and offers a reload. An optional part also renders inside
// <OptionalFeature>, so its failure is reported through client diagnostics
// and the rest of the screen stays. tests/unit/lazy-guard.test.mjs refuses a
// bare lazy() anywhere else in src/.

import { createElement, lazy } from 'react';
import { importFresh } from './chunk-error.js';

/**
 * @param {() => Promise<any>} load  the dynamic import()
 * @param {(mod: any) => any} [pick]  maps the module to `{ default }`, for a
 *   named export; applied to the fresh retry too, which a `.then` on `load`
 *   would miss
 */
export function lazyWithRetry(load, pick = (mod) => mod) {
  const make = () => lazy(() => importFresh(load).then(pick));
  let Current = make();
  function Retryable(props) { return createElement(Current, props); }
  Retryable.retry = () => { Current = make(); };
  return Retryable;
}
