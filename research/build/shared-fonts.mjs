// Serves and ships the Sarabun woff2 files the main VetMock app already has in ../public/fonts,
// so research.vetmock.com self-hosts the same bytes under the same unhashed /fonts/ paths
// (index.html preloads them; the @font-face rules in src/styles/base.css point at them).
// Nothing is copied into this folder: one source of truth stays in the main app.
// OWNER after M1 scaffold: runtime role.
import fs from 'node:fs';
import path from 'node:path';

/** The faces the research app uses. Keep in step with src/styles/base.css and index.html. */
export const RESEARCH_FONT_FILES = [
  'sarabun-400.woff2',
  'sarabun-500.woff2',
  'sarabun-600.woff2',
  'sarabun-700.woff2',
];

const FONT_URL = /^\/fonts\/([a-z0-9-]+\.woff2)(?:\?.*)?$/;

/**
 * @param {{ fontsDir: string }} opts absolute path of the main app's public/fonts folder
 * @returns {import('vite').Plugin}
 */
export function sharedFonts({ fontsDir }) {
  for (const file of RESEARCH_FONT_FILES) {
    if (!fs.existsSync(path.join(fontsDir, file))) throw new Error(`research: missing shared font ${file} in ${fontsDir}`);
  }
  const serve = (server) => {
    server.middlewares.use((req, res, next) => {
      const m = FONT_URL.exec(req.url || '');
      if (!m || !RESEARCH_FONT_FILES.includes(m[1])) return next();
      res.setHeader('Content-Type', 'font/woff2');
      res.setHeader('Cache-Control', 'no-cache');
      fs.createReadStream(path.join(fontsDir, m[1])).pipe(res);
    });
  };
  return {
    name: 'research-shared-fonts',
    configureServer: serve,
    configurePreviewServer: serve,
    generateBundle() {
      for (const file of RESEARCH_FONT_FILES) {
        this.emitFile({ type: 'asset', fileName: `fonts/${file}`, source: fs.readFileSync(path.join(fontsDir, file)) });
      }
    },
  };
}
