// Emits /sw.js for research.vetmock.com: a static-files-only service worker (competitor-gaps.md D4(d)).
// It precaches the built app shell and its hashed assets so the workspace opens offline; it never
// caches or sees research data (that lives in IndexedDB) and never touches another origin.
//
// OWNER: runtime role. Contract (docs/research/M1-DESIGN.md section 12):
//   - emits exactly one file, `sw.js`, at the dist root, unhashed;
//   - its body comes from src/sw/sw-template.js with two replacements:
//       self.__RS_PRECACHE__ -> JSON array of every dist file URL except sw.js and *.map
//       self.__RS_SW_VERSION__ -> sha-256 (first 12 hex) of that sorted list plus the template text
//   - the build fails if the template still contains either placeholder after replacement.
// Until the runtime role lands it, the plugin emits nothing and registration stays off.

/** @returns {import('vite').Plugin} */
export function researchServiceWorker() {
  return {
    name: 'research-service-worker',
    apply: 'build',
    // generateBundle(options, bundle) { ... } implemented by the runtime role.
  };
}
