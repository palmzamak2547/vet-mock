# VetMock AI (ai.vetmock.com)

A research-preview assistant for veterinary students. Answers come from VetMock's own
governed content (VetWiki, notes, video summaries, the question bank, the VetMock guide)
with numbered sources, plus research papers when a question needs them. The page is a sea
drawn entirely in glyph tiles, and the animals in it react to what you do.

```bash
cd ai
npm install
npm run dev            # http://localhost:43130 (proxies /api to the local adapter)
npm test               # node --test: physics, simulation stability, stream reader
npm run build          # dist/
```

The model route is `api/ai-chat.js` in the main VetMock project (it needs the corpora,
the keys and the shared limiter that live there). For local work run the adapter from the
repo root: `node scripts/ai-dev-api.mjs` (port 43139, reads `.env.local`).

Useful query flags: `?mock` (dev only: a scripted answer, no key needed), `?soft`
(allow software WebGL, for headless screenshots), `?capture` (manual clock:
`window.__ocean.step(dt)` draws one frame; frame-exact recordings for films and the OG
cover), `?seed=N` (same animals every time).

Structure and how to extend it: [ARCHITECTURE.md](ARCHITECTURE.md).
