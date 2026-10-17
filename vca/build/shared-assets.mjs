// Serves and ships files the main VetMock app already has in ../public, under the same unhashed
// paths the VCA pages ask for: the domain bookplates (/art/<file>.webp, from subject-art and
// panic-art). Fonts and the footer's print are this app's own, in public/.
// Nothing is copied into this folder; the main app stays the one source of truth for its art.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Every shared file the VCA site uses, as { url, file } pairs.
 * @param {{ repoPublic: string, appDir: string }} dirs
 */
export async function sharedAssetList({ repoPublic, appDir }) {
  const { SUBJECT_COVERS } = await import(pathToFileURL(path.join(repoPublic, '..', 'src', 'data', 'subject-covers.js')).href);
  const { DOMAINS } = await import(pathToFileURL(path.join(appDir, 'src', 'data', 'domains.js')).href);
  const list = [
  ];
  for (const id of new Set([...DOMAINS.map((d) => d.art), 'vca'])) {
    const cover = SUBJECT_COVERS[id];
    if (!cover) throw new Error(`vca: bookplate ${id} is not in subject-covers.js`);
    list.push({ url: `/art/${path.basename(cover.src)}`, file: path.join(repoPublic, cover.src.replace(/^\//, '')) });
  }
  for (const { url, file } of list) {
    if (!fs.existsSync(file)) throw new Error(`vca: missing shared asset ${url} (${file})`);
  }
  return list;
}

const TYPES = { '.webp': 'image/webp', '.woff2': 'font/woff2', '.png': 'image/png' };

/**
 * @param {{ repoPublic: string, appDir: string }} dirs
 * @returns {Promise<import('vite').Plugin>}
 */
export async function sharedAssets(dirs) {
  const list = await sharedAssetList(dirs);
  const byUrl = new Map(list.map((a) => [a.url, a.file]));
  const serve = (server) => {
    server.middlewares.use((req, res, next) => {
      const url = (req.url || '').split('?')[0];
      const file = byUrl.get(url);
      if (!file) return next();
      res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'no-cache');
      fs.createReadStream(file).pipe(res);
    });
  };
  return {
    name: 'vca-shared-assets',
    configureServer: serve,
    configurePreviewServer: serve,
    generateBundle() {
      for (const { url, file } of list) {
        this.emitFile({ type: 'asset', fileName: url.replace(/^\//, ''), source: fs.readFileSync(file) });
      }
    },
  };
}
