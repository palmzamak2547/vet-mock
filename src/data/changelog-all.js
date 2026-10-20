// Every release, newest first: the release files (src/data/changelog/<version>.js, gathered into
// the generated module by scripts/regen-latest-changelog.mjs) and the history in changelog.js.
// For pages that list the whole changelog; the banner reads latest-changelog.generated.js.
import { CHANGELOG as HISTORY, SCOPE_LABELS } from './changelog.js';
import { RELEASES } from './changelog-releases.generated.js';

const parse = (v) => String(v).split('.').map((n) => Number.parseInt(n, 10) || 0);
const newer = (a, b) => {
  const x = parse(a.version);
  const y = parse(b.version);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return y[i] - x[i];
  return 0;
};

export { SCOPE_LABELS };
export const CHANGELOG = [...RELEASES, ...HISTORY].sort(newer);
