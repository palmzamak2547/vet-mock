// Third-party packages shipped to the browser, for the /licenses page (M1-DESIGN.md A10). Versions
// match research/package-lock.json; tests/unit/runtime-licenses.test.mjs compares them. The page
// shows the licence text from each package's LICENSE file, bundled when the page is built. The
// @stdlib packages pull in further @stdlib/* dependencies (same project, Apache-2.0; 12 of them add
// the Boost Software License for code ported from Boost); STDLIB_TOTAL is their count in the lockfile.
// OWNER: trust role (M2; runtime in M1).

/**
 * @typedef {{ name: string, version: string, license: string, url: string, text: string }} Notice
 * `text` names the licence file shown for it (LICENSE_TEXTS keys), or '' for "same text as <name>".
 */

/** @type {readonly Notice[]} */
export const NOTICES = Object.freeze([
  { name: 'react', version: '18.3.1', license: 'MIT', url: 'https://github.com/facebook/react', text: 'react' },
  { name: 'react-dom', version: '18.3.1', license: 'MIT', url: 'https://github.com/facebook/react', text: 'react-dom' },
  { name: 'scheduler', version: '0.23.2', license: 'MIT', url: 'https://github.com/facebook/react', text: 'react' },
  { name: 'valibot', version: '1.4.2', license: 'MIT', url: 'https://github.com/open-circle/valibot', text: 'valibot' },
  { name: '@tanstack/react-virtual', version: '3.14.13', license: 'MIT', url: 'https://github.com/TanStack/virtual', text: 'tanstack' },
  { name: '@tanstack/virtual-core', version: '3.17.11', license: 'MIT', url: 'https://github.com/TanStack/virtual', text: 'tanstack' },
  { name: '@supabase/supabase-js', version: '2.115.0', license: 'MIT', url: 'https://github.com/supabase/supabase-js', text: 'supabase' },
  { name: '@supabase/auth-js', version: '2.115.0', license: 'MIT', url: 'https://github.com/supabase/supabase-js', text: 'supabase' },
  { name: '@supabase/functions-js', version: '2.115.0', license: 'MIT', url: 'https://github.com/supabase/supabase-js', text: 'supabase' },
  { name: '@supabase/postgrest-js', version: '2.115.0', license: 'MIT', url: 'https://github.com/supabase/supabase-js', text: 'supabase' },
  { name: '@supabase/realtime-js', version: '2.115.0', license: 'MIT', url: 'https://github.com/supabase/supabase-js', text: 'supabase' },
  { name: '@supabase/storage-js', version: '2.115.0', license: 'MIT', url: 'https://github.com/supabase/supabase-js', text: 'supabase' },
  { name: '@supabase/phoenix', version: '0.4.5', license: 'MIT', url: 'https://github.com/supabase/supabase-js', text: 'phoenix' },
  { name: 'iceberg-js', version: '0.8.1', license: 'MIT', url: 'https://github.com/supabase/iceberg-js', text: 'iceberg' },
  { name: 'tslib', version: '2.8.1', license: '0BSD', url: 'https://github.com/microsoft/tslib', text: 'tslib' },
  // M2: .docx and .zsav (zip and zlib), loaded only with the Word export and the SPSS reader.
  { name: 'fflate', version: '0.7.5', license: 'MIT', url: 'https://github.com/101arrowz/fflate', text: 'fflate' },
  { name: 'xlsx (SheetJS Community Edition)', version: '0.20.3', license: 'Apache-2.0', url: 'https://git.sheetjs.com/SheetJS/sheetjs', text: 'xlsx' },
  { name: '@stdlib/math-base-special-betainc', version: '0.2.3', license: 'Apache-2.0 AND BSL-1.0', url: 'https://github.com/stdlib-js/math-base-special-betainc', text: 'stdlib' },
  { name: '@stdlib/math-base-special-binomcoefln', version: '0.3.1', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/math-base-special-binomcoefln', text: 'stdlib' },
  { name: '@stdlib/math-base-special-erfc', version: '0.2.5', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/math-base-special-erfc', text: 'stdlib' },
  { name: '@stdlib/math-base-special-gammainc', version: '0.3.1', license: 'Apache-2.0 AND BSL-1.0', url: 'https://github.com/stdlib-js/math-base-special-gammainc', text: 'stdlib' },
  { name: '@stdlib/math-base-special-gammaln', version: '0.3.1', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/math-base-special-gammaln', text: 'stdlib' },
  { name: '@stdlib/stats-base-dists-beta-quantile', version: '0.2.3', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/stats-base-dists-beta-quantile', text: 'stdlib' },
  { name: '@stdlib/stats-base-dists-chisquare-quantile', version: '0.2.3', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/stats-base-dists-chisquare-quantile', text: 'stdlib' },
  { name: '@stdlib/stats-base-dists-f-quantile', version: '0.2.3', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/stats-base-dists-f-quantile', text: 'stdlib' },
  { name: '@stdlib/stats-base-dists-normal-quantile', version: '0.3.1', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/stats-base-dists-normal-quantile', text: 'stdlib' },
  { name: '@stdlib/stats-base-dists-studentized-range-cdf', version: '0.2.3', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/stats-base-dists-studentized-range-cdf', text: 'stdlib' },
  { name: '@stdlib/stats-base-dists-studentized-range-quantile', version: '0.2.2', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/stats-base-dists-studentized-range-quantile', text: 'stdlib' },
  { name: '@stdlib/stats-base-dists-t-quantile', version: '0.2.3', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/stats-base-dists-t-quantile', text: 'stdlib' },
]);

/**
 * Fonts shipped to the browser (review round 2: Sarabun was missing from the page). The woff2 files
 * are the main app's public/fonts; the licence text is public/Sarabun/OFL.txt, copied byte for byte
 * into this folder so the dev server serves it without reaching outside the app. Version: the font's
 * name table (ID 5) in public/fonts/sarabun-400.woff2 reads "Version 1.000". Newsreader is the opening
 * film's face (research/public/fonts/newsreader-intro.woff2, a subset); its name table reads
 * "Version 1.003" and its licence text is newsreader-OFL.txt beside this file.
 * @type {readonly Notice[]}
 */
export const FONT_NOTICES = Object.freeze([
  { name: 'Sarabun', version: '1.000', license: 'OFL-1.1', url: 'https://github.com/cadsondemak/Sarabun', text: 'sarabun' },
  { name: 'Newsreader', version: '1.003', license: 'OFL-1.1', url: 'https://github.com/productiontype/Newsreader', text: 'newsreader' },
]);

/** Every @stdlib package in the lockfile's production tree (direct and indirect). */
export const STDLIB_TOTAL = 238;
/** Of those, the ones whose licence also names the Boost Software License 1.0. */
export const STDLIB_BSL = 12;

/**
 * Licence files, loaded only when the /licenses page opens. The @stdlib text is the gammainc file,
 * which carries both the Apache-2.0 text and the Boost notice.
 * @type {Record<string, () => Promise<{ default: string }>>}
 */
export const LICENSE_TEXTS = Object.freeze({
  react: () => import('../../node_modules/react/LICENSE?raw'),
  'react-dom': () => import('../../node_modules/react-dom/LICENSE?raw'),
  valibot: () => import('../../node_modules/valibot/LICENSE.md?raw'),
  tanstack: () => import('../../node_modules/@tanstack/react-virtual/LICENSE?raw'),
  supabase: () => import('../../node_modules/@supabase/supabase-js/LICENSE?raw'),
  phoenix: () => import('../../node_modules/@supabase/phoenix/LICENSE.md?raw'),
  iceberg: () => import('../../node_modules/iceberg-js/LICENSE?raw'),
  tslib: () => import('../../node_modules/tslib/LICENSE.txt?raw'),
  fflate: () => import('../../node_modules/fflate/LICENSE?raw'),
  xlsx: () => import('../../node_modules/xlsx/LICENSE?raw'),
  stdlib: () => import('../../node_modules/@stdlib/math-base-special-gammainc/LICENSE?raw'),
  sarabun: () => import('./sarabun-OFL.txt?raw'),
  newsreader: () => import('./newsreader-OFL.txt?raw'),
});
