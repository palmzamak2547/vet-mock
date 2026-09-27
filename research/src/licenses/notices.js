// Third-party packages shipped to the browser, for the /licenses page (M1-DESIGN.md A10). Versions
// match research/package-lock.json; a unit test (runtime role) compares them. The page shows the
// licence text from each package's LICENSE file, bundled at build time. The @stdlib packages pull in
// further @stdlib/* dependencies (same project, Apache-2.0); the page lists them from package-lock.json.
// OWNER: runtime role.
export const NOTICES = Object.freeze([
  { name: 'react', version: '18.3.1', license: 'MIT', url: 'https://github.com/facebook/react' },
  { name: 'react-dom', version: '18.3.1', license: 'MIT', url: 'https://github.com/facebook/react' },
  { name: 'valibot', version: '1.4.2', license: 'MIT', url: 'https://github.com/open-circle/valibot' },
  { name: '@tanstack/react-virtual', version: '3.14.13', license: 'MIT', url: 'https://github.com/TanStack/virtual' },
  { name: '@supabase/supabase-js', version: '2.115.0', license: 'MIT', url: 'https://github.com/supabase/supabase-js' },
  { name: 'xlsx (SheetJS Community Edition)', version: '0.20.3', license: 'Apache-2.0', url: 'https://git.sheetjs.com/SheetJS/sheetjs' },
  { name: '@stdlib/math-base-special-betainc', version: '0.2.3', license: 'Apache-2.0 AND BSL-1.0', url: 'https://github.com/stdlib-js/math-base-special-betainc' },
  { name: '@stdlib/math-base-special-binomcoefln', version: '0.3.1', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/math-base-special-binomcoefln' },
  { name: '@stdlib/math-base-special-erfc', version: '0.2.5', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/math-base-special-erfc' },
  { name: '@stdlib/math-base-special-gammainc', version: '0.3.1', license: 'Apache-2.0 AND BSL-1.0', url: 'https://github.com/stdlib-js/math-base-special-gammainc' },
  { name: '@stdlib/math-base-special-gammaln', version: '0.3.1', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/math-base-special-gammaln' },
  { name: '@stdlib/stats-base-dists-beta-quantile', version: '0.2.3', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/stats-base-dists-beta-quantile' },
  { name: '@stdlib/stats-base-dists-chisquare-quantile', version: '0.2.3', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/stats-base-dists-chisquare-quantile' },
  { name: '@stdlib/stats-base-dists-f-quantile', version: '0.2.3', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/stats-base-dists-f-quantile' },
  { name: '@stdlib/stats-base-dists-normal-quantile', version: '0.3.1', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/stats-base-dists-normal-quantile' },
  { name: '@stdlib/stats-base-dists-studentized-range-cdf', version: '0.2.3', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/stats-base-dists-studentized-range-cdf' },
  { name: '@stdlib/stats-base-dists-studentized-range-quantile', version: '0.2.2', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/stats-base-dists-studentized-range-quantile' },
  { name: '@stdlib/stats-base-dists-t-quantile', version: '0.2.3', license: 'Apache-2.0', url: 'https://github.com/stdlib-js/stats-base-dists-t-quantile' },
]);
