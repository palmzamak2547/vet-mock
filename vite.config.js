import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react'
            if (id.includes('@supabase')) return 'vendor-supabase'
            return 'vendor'
          }
          // Question banks are heavy + only needed once user starts a quiz
          if (id.includes('questions-com3')) return 'data-q-com3'
          if (id.includes('questions-com4')) return 'data-q-com4'
          if (id.includes('questions-com5')) return 'data-q-com5'
          if (id.includes('questions-engprof')) return 'data-q-engprof'
          // Notes data is only loaded when NotesView is opened
          if (id.includes('notes-com3')) return 'data-notes-com3'
          if (id.includes('notes-com4')) return 'data-notes-com4'
          if (id.includes('notes-com5')) return 'data-notes-com5'
          if (id.includes('notes-engprof')) return 'data-notes-engprof'
        },
      },
    },
  },
})
