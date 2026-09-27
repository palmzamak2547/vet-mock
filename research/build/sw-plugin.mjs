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
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const TEMPLATE = fileURLToPath(new URL('../src/sw/sw-template.js', import.meta.url));

/**
 * The list the worker precaches: every emitted file except sw.js, source maps and license notes,
 * as root-relative URLs, sorted. index.html is always first so the offline shell exists.
 * @param {string[]} fileNames  bundle file names (relative to dist)
 * @returns {string[]}
 */
export function precacheList(fileNames) {
  const urls = [...new Set(fileNames)]
    .filter((f) => f !== 'sw.js' && !f.endsWith('.map') && !f.endsWith('.LICENSE.txt'))
    .map((f) => `/${f.split('\\').join('/')}`)
    .sort();
  const shell = urls.indexOf('/index.html');
  if (shell > 0) urls.unshift(...urls.splice(shell, 1));
  return urls;
}

/**
 * Fill the template. Throws when a placeholder survives (the build must fail then).
 * @param {string} template
 * @param {string[]} urls
 * @returns {{ code: string, version: string }}
 */
export function renderServiceWorker(template, urls) {
  const version = createHash('sha256').update(JSON.stringify([...urls].sort())).update(template).digest('hex').slice(0, 12);
  const code = template
    .replace('self.__RS_PRECACHE__', JSON.stringify(urls))
    .replace('self.__RS_SW_VERSION__', JSON.stringify(version));
  if (code.includes('__RS_PRECACHE__') || code.includes('__RS_SW_VERSION__')) throw new Error('research sw: a placeholder survived in sw.js');
  return { code, version };
}

/** @returns {import('vite').Plugin} */
export function researchServiceWorker() {
  return {
    name: 'research-service-worker',
    apply: 'build',
    generateBundle(_options, bundle) {
      // Files that reach dist outside the bundle: the shared Sarabun (plugin-emitted) and public/ (the
      // manifest and the install icons an offline start needs; the link-preview image is left out).
      // index.html too: Vite's HTML plugin emits it in its own generateBundle, which can run after this
      // one, and without it the offline shell does not exist.
      const extra = [
        'index.html',
        'fonts/sarabun-400.woff2', 'fonts/sarabun-500.woff2', 'fonts/sarabun-600.woff2', 'fonts/sarabun-700.woff2',
        'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png',
      ];
      const names = [...Object.keys(bundle), ...extra.filter((f) => !(f in bundle))];
      const urls = precacheList(names);
      const { code } = renderServiceWorker(fs.readFileSync(TEMPLATE, 'utf8'), urls);
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: code });
    },
  };
}
