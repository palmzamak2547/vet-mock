// Loaded by `npm run test:unit` (node --import) before any test file: the changelog modules are
// derived and gitignored, and several tests import modules that import them.
import { writeChangelogModules } from '../../scripts/regen-latest-changelog.mjs';

await writeChangelogModules();
