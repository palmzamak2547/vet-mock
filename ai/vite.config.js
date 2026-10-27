import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sharedAssets } from './build/shared-assets.mjs';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

// VetMock AI is its own Vite app on its own origin (ai.vetmock.com), like research/ and vca/.
// The model route lives in the main project (vetmock.com/api/ai-chat); in dev, /api goes to
// the local adapter (node scripts/ai-dev-api.mjs, port 43139) unless VITE_AI_API points elsewhere.
export default defineConfig({
  root: here('.'),
  plugins: [react(), sharedAssets({ repoPublic: here('../public') })],
  build: {
    target: ['es2019', 'safari14'],
    cssTarget: ['safari14'],
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: { react: ['react', 'react-dom'] },
      },
    },
  },
  server: {
    port: 43130,
    strictPort: true,
    proxy: { '/api': 'http://localhost:43139' },
  },
  preview: { port: 43131, strictPort: true },
});
