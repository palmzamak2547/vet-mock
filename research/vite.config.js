import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sharedFonts } from './build/shared-fonts.mjs';
import { researchServiceWorker } from './build/sw-plugin.mjs';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const repoSrc = here('../src');
const repoFonts = here('../public/fonts');

// Research Studio is its own Vite app on its own origin (research.vetmock.com). It may import
// read-only from the main app's ../src (tokens, glossary data) and ships the main app's Sarabun
// files; it never writes there. See docs/research/M1-DESIGN.md.
export default defineConfig({
  root: here('.'),
  // Share the repo root .env for local dev; the Vercel project supplies its own variables.
  envDir: here('..'),
  plugins: [react(), sharedFonts({ fontsDir: repoFonts }), researchServiceWorker()],
  resolve: {
    alias: {
      // Read-only access to the main app. Use sparingly; nothing under ../src is ever modified.
      '@vetmock': repoSrc,
    },
  },
  server: {
    fs: {
      // Only this app, the shared ../src and the shared fonts may be served in dev.
      allow: [here('.'), repoSrc, repoFonts],
    },
  },
  worker: { format: 'es' },
  build: {
    target: 'es2020',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Landing and workspace are separate lazy chunks (src/App.jsx). Vendor code is split so the
        // landing never downloads the grid, the validator or the sign-in client.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'vendor-react';
          if (/[\\/]node_modules[\\/]@supabase[\\/]/.test(id)) return 'vendor-auth';
          if (/[\\/]node_modules[\\/]valibot[\\/]/.test(id)) return 'vendor-validation';
          if (/[\\/]node_modules[\\/]@tanstack[\\/]/.test(id)) return 'vendor-grid';
          return undefined;
        },
      },
    },
  },
});
