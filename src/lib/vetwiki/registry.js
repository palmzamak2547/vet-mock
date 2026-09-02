// Browser-light VetWiki discovery seam.
//
// Keep this module metadata-only. Views that merely list Wiki topics or check
// whether an article exists must not import ./index.js: that full module also
// owns note bodies, verification overlays, the source registry and validation.

import { VETWIKI_TOPICS } from './topic-registry.generated.js';
import { hasTopic, articleForQuestion } from './registry-lite.js';

// The existence checks live in registry-lite.js (ids + question links only)
// so views that need nothing more do not carry the full catalog; they are
// re-exported here so one import path keeps working for everyone else.
export { hasTopic, articleForQuestion };

export function listTopics() {
  return VETWIKI_TOPICS.map((topic) => ({ ...topic }));
}
