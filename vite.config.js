import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

export default defineConfig({
  plugins: [react(), viteCommonjs()],
  // Cornerstone3D's dicom-image-loader ships its own web workers and
  // must NOT be pre-bundled by Vite; dicom-parser is CJS and needs
  // explicit inclusion so esbuild rewrites it cleanly.
  optimizeDeps: {
    exclude: ['@cornerstonejs/dicom-image-loader'],
    include: ['dicom-parser'],
  },
  worker: { format: 'es' },
  build: {
    target: 'esnext',
    // Palm perf audit 2026-05-20: two chunks legitimately exceed 700KB
    // and we KNOW they're lazy:
    //   • data-video-summaries (~2.2MB) — only loaded after user clicks
    //     "📝 อ่านสรุปคลิป" inside VideoView's PlayerModal
    //   • vendor-cornerstone (~1.7MB) — only loaded on /lab visit
    // Both are excluded from modulePreload (below) so they don't bloat
    // first-paint. 2300KB cap silences the warning without disabling
    // visibility for accidental regressions in the main bundle.
    chunkSizeWarningLimit: 2300,
    // ── Phase 1 perf rework (2026-05-17) ─────────────────────────
    // Vite's default behaviour is to emit <link rel="modulepreload">
    // for EVERY chunk in the entry's transitive load graph, including
    // chunks only reachable through React.lazy() dynamic imports.
    // That bloated first-paint preload to 3.88 MB even though the home
    // screen only needs ~500 KB of code.
    //
    // resolveDependencies trims the preload list per-entry. Filter out
    // chunks that only run on routes the average user never visits
    // (vendor-cornerstone for /lab) or load on demand later in the
    // session (Q banks fetch when the user actually starts a quiz —
    // currently they're statically imported via data/questions.js
    // barrel but Phase 2+3 will lazy them; preload-trim is harmless
    // in the interim because the static imports still work — just
    // without the eager-prefetch hint).
    //
    // Excluded chunks still ship + chunk-split as before; the browser
    // just fetches them when actually imported, not as a speculative
    // pre-warm. For lazy-loaded chunks (cornerstone) this is a pure
    // win. For statically-imported chunks (Q banks) it's neutral
    // until Phase 3 ships.
    modulePreload: {
      polyfill: true,
      resolveDependencies(_filename, deps) {
        const SKIP_PRELOAD_PATTERNS = [
          /vendor-cornerstone/,        // /lab only · 1.69 MB
          /data-q-/,                   // Q banks · 16 chunks · ~2 MB (Phase 2+3 will lazy them)
          /data-video-summaries/,      // VideoView only · 2 MB
          /data-notes-/,               // NotesView only · per-subject
          /data-instructors/,          // FacultyView only · 135 KB
        ];
        return deps.filter((dep) => !SKIP_PRELOAD_PATTERNS.some((re) => re.test(dep)));
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
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
            // Cornerstone3D + its dep tree (vtk.js, gl-matrix, comlink,
            // dicom-parser) all funnel into a single lab-only chunk so
            // they never ship with the main bundle. LabView lazy-loads
            // this chunk on first /lab visit.
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
          // video-summaries.js is ~60k lines / ~2MB and only loaded inside
          // VideoView (lazy). Splitting it from VideoView's component code
          // means the view shell renders fast while data streams in.
          if (id.includes('video-summaries')) return 'data-video-summaries'
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
