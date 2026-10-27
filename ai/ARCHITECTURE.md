# VetMock AI: architecture

## Shape

```
ai/                         static Vite app, Vercel project "vetmock-ai", ai.vetmock.com
  src/ocean/                the glyph sea (no React, no DOM besides its canvas and one label)
    math.js                 physics + colour models; every constant cites its formula
    creatures.js            species data, swimming kinematics, school (boids), mesh writer
    shaders.js              four GLSL ES 1.0 passes (scene, cell, glow, composite)
    atlas.js                glyph atlas measured at device cell size (ink coverage ramp)
    gl.js                   WebGL 1 helpers
    index.js                createOcean(): resize, quality ladder, modes, capture clock
  src/lib/                  api (SSE over POST), markdown renderer, store (localStorage),
                            speech (th-TH in/out), image (resize before upload), env
  src/components/           Composer, Message (answer, sources deck, cards), Chrome
                            (header, history sheet, specimen label, footer), GlyphText
  tests/unit/               node --test, no browser
api/ai-chat.js              the model route (main project), modules in api/_lib/ai/
scripts/ai-dev-api.mjs      local adapter for the route
```

## Contract between the page and the route

`GET /api/ai-chat` → `{ ok, configured, stats }` (stats are counted from the loaded corpora).
`POST /api/ai-chat` `{ messages: [{role, content}], image?: {mediaType, data} }` →
`text/event-stream` with events, in this order where they occur:

| event | data | page does |
|---|---|---|
| `status` | `{ phase, label }` | spinner + label; the school mills around the answer |
| `sources` | `{ covered, items: [{ n, kind, title, subtitle?, url, snippet }] }` | citation chips resolve against `n`; `covered: false` shows the general-knowledge note |
| `delta` | `{ text }` | appended, rendered once per frame |
| `cards` | `{ items: [quiz \| action \| papers] }` | rendered under the text |
| `check` | `{ ungrounded: [string], invalidCitations: [number] }` | flagged numbers get a dotted underline |
| `done` / `error` | `{ ms, model }` / `{ reason, message }` | finish or show the Thai message with retry |

Refusals before streaming are JSON `{ error, message, retryAfter? }` with 400/429/503.
A stream that ends without `done` or `error` is treated as cut (tested).

## The sea, in one paragraph

Animals are spines of joints that follow their head like a chain, with a carangiform body
wave on top (A(s) = 0.02 - 0.0825 s + 0.1625 s², tail beat f = U / 0.7 L). Each frame the
CPU writes their meshes (about 4,000 vertices) and the GPU draws: scene into a target of
3 x 3 samples per glyph cell (alpha tags water / particle / animal), a cell pass that picks a
glyph (edge stroke from the direction of the animal's mass, else a measured density ramp
with 4 x 4 Bayer dither), a 5 x 5 glow over the cell grid, and a composite that draws
halftone tiles + glyphs per device pixel, dark and light computed together so a theme change
crossfades. Depth uses Beer-Lambert per channel (red goes first in the dark sea).

## Extending without debt

- **A new animal**: add an entry to `SPECIES` (names, palette pair, body type and its
  numbers) and, if it needs a new pattern, one branch in `BODY_FS` keyed by `pattern`. New
  body plans get a `write<Body>()` method on `Swimmer`. `tests/unit/creatures.test.mjs`
  runs every species for a simulated minute at mixed frame rates and fails on NaN, stretched
  spines, lost animals or mesh overflow.
- **A new card type**: the route adds `{ type: 'x', ... }` to a `cards` event; the page adds
  one component and one line in `Card()` (Message.jsx). Unknown types render nothing.
- **A new source kind**: route sets `kind`; the page adds a label in `KIND` and a colour pair
  `--k-<kind>` (both themes, different lightness, not only hue).
- **A new mode for the sea**: `setMode(name, at)` in `ocean/index.js`; behaviours read
  `env` in `Swimmer.update` / `School.update`. Keep motion that carries information alive
  under reduced motion and stop decoration only.
- **Quality ladder**: frame time EMA over 26 ms for 2 s steps down (pixel ratio 2 → 1.5 →
  1, cell +2 px, 30 fps, still frame); under 18 ms for 12 s steps back up.

## Rules this app keeps

- No glass on reading text; glass only on the composer, the chat header, the sheet.
- Every visible number comes from data (footer stats from the route, never typed).
- Thai copy is plain and short; no vendor or model names on any surface.
- Reduced motion is per effect: the sea becomes one still composition, UI motion fades.
- In-app browsers get the same page; only speech recognition is left out there.
