import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { atlasLocalPlugin } from './scripts/atlas-local-plugin.mjs'

const atlasEntry = (server) => {
  server.middlewares.use((request, _response, next) => {
    if (/^\/app\/atlas\/?(?:\?|$)/.test(request.url || '')) request.url = `/atlas.html${(request.url || '').includes('?') ? (request.url || '').slice(request.url.indexOf('?')) : ''}`;
    next();
  });
};

export default defineConfig({
  plugins: [react(), tailwindcss(), atlasLocalPlugin(), { name: 'atlas-entry', configureServer: atlasEntry, configurePreviewServer: atlasEntry }],
  // '@' is the alias the shadcn CLI writes into installed block imports
  // (@/lib/utils, @/components/ui/*). jsconfig.json mirrors it for the
  // CLI + editors.
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // Cornerstone's image loader owns its web workers. Keep it out of Vite's
  // dependency pre-bundle. Vite 6 handles dicom-parser's CJS conversion.
  optimizeDeps: {
    exclude: ['@cornerstonejs/dicom-image-loader'],
    // The loader owns its workers, but its WASM glue files are UMD/CommonJS.
    // Prebundle those deep imports explicitly so `npm run dev` gets the same
    // default-export interop Rollup provides in production builds.
    include: [
      'dicom-parser',
      '@cornerstonejs/codec-libjpeg-turbo-8bit/decodewasmjs',
      '@cornerstonejs/codec-openjpeg/decodewasmjs',
      '@cornerstonejs/codec-charls/decodewasmjs',
      '@cornerstonejs/codec-openjph/wasmjs',
    ],
  },
  worker: { format: 'es' },
  build: {
    manifest: true,
    // Palm compat audit 2026-05-24: was 'esnext' which emits whatever
    // the latest spec supports — could include features iOS 14-15
    // doesn't parse (top-level await, logical assignment, etc.).
    // 'es2020' is the safest baseline that covers:
    //   • iOS Safari 14+ (~98% of iOS market)
    //   • Android Chrome 87+ (~99% of Android market)
    //   • Desktop Chrome/Edge/Firefox/Safari last 4 years
    // Keeps optional chaining / nullish coalescing native (no transpile
    // weight) but transpiles anything newer down to ES2020 syntax.
    target: 'es2020',
    // Keep visibility for any new multi-megabyte chunk. VetWiki's canonical
    // article renderer is intentionally lazy and tracked separately.
    chunkSizeWarningLimit: 2300,
    // ── Phase 1 perf rework (2026-05-17) ─────────────────────────
    // Vite's default behaviour is to emit <link rel="modulepreload">
    // for EVERY chunk in the entry's transitive load graph, including
    // chunks only reachable through React.lazy() dynamic imports.
    // That bloated first-paint preload to 3.88 MB even though the home
    // screen only needs ~500 KB of code.
    //
    // resolveDependencies trims the preload list per-entry. Filter out
    // chunks that load on demand later in the session (Q banks fetch when
    // the user actually starts a quiz —
    // currently they're statically imported via data/questions.js
    // barrel but Phase 2+3 will lazy them; preload-trim is harmless
    // in the interim because the static imports still work — just
    // without the eager-prefetch hint).
    //
    // Excluded chunks still ship + chunk-split as before; the browser
    // just fetches them when actually imported, not as a speculative
    // pre-warm. For statically-imported chunks (Q banks) it's neutral.
    modulePreload: {
      polyfill: true,
      resolveDependencies(_filename, deps) {
        const SKIP_PRELOAD_PATTERNS = [
          /vendor-cornerstone/,        // Practical Imaging Lab only
          /vendor-atlas/,              // Anatomy viewer only
          /data-q-/,                   // Q banks · 16 chunks · ~2 MB (Phase 2+3 will lazy them)
          /data-video-summaries/,      // VideoView only · 2 MB
          /data-notes-/,               // NotesView only · per-subject
          /data-instructors/,          // FacultyView (+ palette, on demand) · ~330 KB
          /vendor-validation/,         // JSON import only · Dashboard/Q manager
        ];
        return deps.filter((dep) => !SKIP_PRELOAD_PATTERNS.some((re) => re.test(dep)));
      },
    },
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        atlas: fileURLToPath(new URL('./atlas.html', import.meta.url)),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/[\\/]node_modules[\\/]three[\\/]/.test(id)) return 'vendor-atlas'
            if (/[\\/]node_modules[\\/]lucide-react[\\/]/.test(id)) return 'vendor-icons'
            // Runtime schemas are only needed when importing JSON in two lazy
            // views. Keep them out of the shared first-load vendor chunk.
            if (/[\\/]node_modules[\\/]valibot[\\/]/.test(id)) return 'vendor-validation'
            // pdf-lib writes the annotated PDF and is reached only from the
            // export button. Without its own chunk it lands in the shared
            // `vendor` bundle, which the app loads on first paint — so every
            // student would download half a megabyte for a button most of
            // them never press. Measured before this line existed: it was in
            // vendor-CIZ-5148.js.
            if (/[\\/]node_modules[\\/]pdf-lib[\\/]/.test(id)) return 'vendor-pdf-write'
            // Be SPECIFIC about react packaging — `includes('react')` was
            // too broad and matched any path containing the substring
            // (e.g. `use-sync-external-store`, `cmdk`, things that
            // *use* react). That created a circular dep where vendor →
            // vendor-react → vendor. Pin to react itself + reconciler +
            // scheduler only. Palm perf audit 2026-05-20.
            if (
              /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)
            ) return 'vendor-react'
            if (id.includes('@supabase')) return 'vendor-supabase'
            if (
              id.includes('@cornerstonejs') ||
              id.includes('@kitware/vtk.js') ||
              id.includes('dicom-parser') ||
              id.includes('gl-matrix') ||
              id.includes('comlink')
            ) return 'vendor-cornerstone'
            return 'vendor'
          }
          // Question banks are heavy + only needed once user starts a quiz.
          // Splitting each into its own chunk lets the browser fetch them
          // in parallel over HTTP/2 (~6 simultaneous) and improves cache
          // granularity — editing 1 subject's Qs won't re-download the rest.
          if (id.includes('questions-com3-special')) return 'data-q-com3-special'
          if (id.includes('questions-com3')) return 'data-q-com3'
          if (id.includes('questions-com4')) return 'data-q-com4'
          if (id.includes('questions-com5')) return 'data-q-com5'
          // ⚠️ engprof1 (Y4 Sem 1) must match BEFORE engprof (Y4 Sem 2) —
          // both share the 'engprof' prefix; specific rule wins.
          if (id.includes('questions-engprof1')) return 'data-q-engprof1'
          if (id.includes('questions-engprof')) return 'data-q-engprof'
          if (id.includes('questions-exotic')) return 'data-q-exotic'
          // Y4 Sem 1 banks (added 2026-05-17)
          if (id.includes('questions-com1')) return 'data-q-com1'
          if (id.includes('questions-com2')) return 'data-q-com2'
          if (id.includes('questions-vet-imaging')) return 'data-q-vet-imaging'
          if (id.includes('questions-swine-repro')) return 'data-q-swine-repro'
          if (id.includes('questions-swine-herd')) return 'data-q-swine-herd'
          if (id.includes('questions-food-safety-y4')) return 'data-q-food-safety-y4'
          if (id.includes('questions-vet-juris')) return 'data-q-vet-juris'
          // Wave 3 (2026-05-17) — 2 new Y4 Sem 1 subjects flipped from scaffold
          if (id.includes('questions-surg1')) return 'data-q-surg1'
          if (id.includes('questions-herd-health-rum')) return 'data-q-herd-health-rum'
          if (id.includes('questions-repro-lect')) return 'data-q-repro-lect'
          if (id.includes('questions-poultry')) return 'data-q-poultry'
          if (id.includes('questions-cliapprum')) return 'data-q-cliapprum'
          if (id.includes('questions-practrum')) return 'data-q-practrum'
          if (id.includes('questions-vca')) return 'data-q-vca'
          if (id.includes('questions-mahahon')) return 'data-q-mahahon'
          if (id.includes('questions-termpaper')) return 'data-q-termpaper'
          if (id.includes('questions-short')) return 'data-q-short'
          if (id.includes('questions-part1')) return 'data-q-part1'
          if (id.includes('questions-part2')) return 'data-q-part2'
          if (id.includes('questions-part3')) return 'data-q-part3'
          // Y5 banks — split per file so users only pay for what they study
          if (id.includes('questions-y5-final-mixed')) return 'data-q-y5-mixed'
          if (id.includes('questions-y5-patho')) return 'data-q-y5-patho'
          if (id.includes('questions-y5-osce-ruminant')) return 'data-q-y5-osce-rum'
          if (id.includes('questions-y5-osce-med')) return 'data-q-y5-osce-med'
          if (id.includes('questions-y5-swine-clinic')) return 'data-q-y5-swine'
          if (id.includes('questions-y5-repro-clinic')) return 'data-q-y5-repro'
          if (id.includes('questions-y5-vision-batch')) return 'data-q-y5-vision'
          if (id.includes('data/instructors')) return 'data-instructors'
          // Palm audit r4 (2026-05-24): video-summaries was a 2.2MB monolith.
          // scripts/split-video-summaries.cjs broke it into per-subject
          // files (video-summaries-<subject>.js). To get the lazy benefit,
          // each per-subject file must land in its OWN chunk — the
          // legacy catch-all rule `id.includes('video-summaries')` lumped
          // them back into one chunk. Match the per-subject filename
          // first; the bare barrel file (video-summaries.js exact) gets
          // its own tiny chunk too.
          if (/video-summaries-([a-z0-9-]+)\.js$/.test(id)) {
            const m = id.match(/video-summaries-([a-z0-9-]+)\.js$/);
            return `data-video-summaries-${m[1]}`;
          }
          if (/video-summaries(-meta)?\.js$/.test(id)) return 'data-video-summaries-barrel'
          // Notes data is only loaded when NotesView is opened
          if (id.includes('notes-com3')) return 'data-notes-com3'
          if (id.includes('notes-com4')) return 'data-notes-com4'
          if (id.includes('notes-com5')) return 'data-notes-com5'
          if (id.includes('notes-engprof')) return 'data-notes-engprof'
          if (id.includes('notes-exotic')) return 'data-notes-exotic'
          if (id.includes('notes-repro-lect')) return 'data-notes-repro-lect'
          if (id.includes('notes-poultry')) return 'data-notes-poultry'
          if (id.includes('notes-cliapprum')) return 'data-notes-cliapprum'
          if (id.includes('notes-practrum')) return 'data-notes-practrum'
          // Y5 notes — split per subject (top-3 added 2026-05-12)
          if (id.includes('notes-y5-zoonoses')) return 'data-notes-y5-zoonoses'
          if (id.includes('notes-y5-milk-meat-hygiene')) return 'data-notes-y5-milk-meat'
          if (id.includes('notes-y5-equine-medicine')) return 'data-notes-y5-equine'
        },
      },
    },
  },
})
