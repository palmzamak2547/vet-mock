// Serves and ships the few files VetMock AI shares with the main app, under the same paths:
// the official paw mark and favicons, and Mochi's diving art. Nothing is copied into this
// folder; the main app's public/ stays the one source of truth.
import fs from 'node:fs';
import path from 'node:path';

const SHARED = [
  ['/brand/vetmock-logo.svg', 'vetmock-logo.svg'],
  ['/favicon.svg', 'favicon.svg'],
  ['/favicon-32.png', 'favicon-32.png'],
  ['/favicon.ico', 'favicon.ico'],
  ['/icon-512.png', 'icon-512.png'],
  ['/art/mochi-aquatic.webp', 'art/mochi-subjects/aquatic.webp'],
  // the apps an answer can be sent to (official marks, see public/brand/ATTRIBUTION.md)
  ...['line', 'notion', 'google-docs', 'anki', 'google-calendar', 'apple-calendar', 'outlook'].map((n) => [`/brand/${n}.svg`, `brand/${n}.svg`]),
];

const TYPES = { '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.webp': 'image/webp' };

export function sharedAssets({ repoPublic }) {
  const list = SHARED.map(([url, rel]) => ({ url, file: path.join(repoPublic, rel) }));
  for (const { url, file } of list) {
    if (!fs.existsSync(file)) throw new Error(`ai: missing shared asset ${url} (${file})`);
  }
  const byUrl = new Map(list.map((a) => [a.url, a.file]));
  const serve = (server) => {
    server.middlewares.use((req, res, next) => {
      const file = byUrl.get((req.url || '').split('?')[0]);
      if (!file) return next();
      res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'no-cache');
      fs.createReadStream(file).pipe(res);
    });
  };
  return {
    name: 'ai-shared-assets',
    configureServer: serve,
    configurePreviewServer: serve,
    generateBundle() {
      for (const { url, file } of list) {
        this.emitFile({ type: 'asset', fileName: url.replace(/^\//, ''), source: fs.readFileSync(file) });
      }
    },
  };
}
