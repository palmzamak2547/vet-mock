import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sharedAssets } from './build/shared-assets.mjs';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const repoSrc = here('../src');
const repoPublic = here('../public');

// The counts in index.html's meta come from the bank the generator just built, so a link
// preview never quotes a number the site no longer has.
function liveCounts() {
  const counts = async () => {
    const { BANK } = await import(`${pathToFileURL(here('src/generated/bank.js')).href}?t=${Date.now()}`);
    const n = (x) => x.toLocaleString('en-US');
    return { VCA_TOTAL: n(BANK.total), VCA_DOMAINS: String(BANK.domains.length), VCA_DOCUMENTS: n(BANK.library.documents) };
  };
  return {
    name: 'vca-live-counts',
    async transformIndexHtml(html) {
      const values = await counts();
      return html.replace(/%(VCA_[A-Z]+)%/g, (m, key) => values[key] ?? m);
    },
  };
}

// VetMock VCA is its own Vite app on its own origin (vca.vetmock.com), like research/. It reads
// the main app's ../src read-only: the option shuffle and rich text the study app uses, so an
// option order and a bolded term look the same on both sites. Its question data is built by
// scripts/build-bank.mjs before dev and build; nothing under ../src is ever written.
export default defineConfig(async () => ({
  root: here('.'),
  plugins: [react(), await sharedAssets({ repoPublic, appDir: here('.') }), liveCounts()],
  resolve: {
    alias: { '@vetmock': repoSrc },
    // ../src/lib/richtext.jsx imports react; resolve it from this app, never the repo root.
    dedupe: ['react', 'react-dom'],
  },
  server: {
    fs: { allow: [here('.'), repoSrc, repoPublic] },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'vendor-react';
          return undefined;
        },
      },
    },
  },
}));
