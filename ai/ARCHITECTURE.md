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

Two traps the engine has already paid for:
- **The glyph index rides in an 8-bit channel.** Store `idx / 255` exactly and read with
  `floor(x * 255 + 0.5)`. A value on a rounding tie (`(idx + 0.5) / 255`) is rounded up by
  Apple GPUs and down by most others: on iPad every empty cell of water became a grey tile.
  `tests/unit/shaders.test.mjs` pins it.
- **The canvas is opaque.** Any `canvas.width =` blanks it to black until the next draw, so
  `resize()` returns early when nothing changed and redraws in the same call when something
  did; the canvas is `100lvh` tall so phone toolbars never resize it; the context is made
  after the font wait (no black screen at load).

## The landing page's moving line

`SHOW` in `App.jsx`: the hero's last word (`HeroWord`: each grapheme thins into the glyph
ramp and the new word condenses out of it, the box springs to its width, the sea ripples
under it) and the box's example question (`ghost` in `Composer`, typed by grapheme) change
on one beat. Two rounds, then it rests on ถามให้ลึก; text, a photo or the microphone in the
box holds it; reduced motion shows the still line; a tap on the word asks for the next beat;
→ in an empty box takes the example shown.

## Specimen plates

A source card shows the animal its source is about: `lib/species.js` reads a species named
outright in the title, then subtitle, then subject (Thai look-aheads keep หมาย, หมู่, ม้าม,
ปลาย out; the dog in โรคพิษสุนัขบ้า is not the patient), and no name means no plate. The
plates are VetMock's own engraved bookplates (`public/subject-art`, `public/panic-art`)
cropped to one animal and Atkinson-dithered to 64 x 64 one-bit SVG masks by
`node ai/scripts/specimens.mjs [--preview out.png]` (crops live in `PLATES`); CSS fills the
mask with the kind's colour, so one file serves both themes.

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
  1, cell +2 px, 30 fps, still frame). It never steps back up: a device on the edge used to
  swing between two levels every ~14 s.
- **A new species plate**: add a crop to `PLATES` in `scripts/specimens.mjs`, run it, add the
  names to `lib/species.js`; `tests/unit/species.test.mjs` fails if a name has no plate.

## Rules this app keeps

- No glass on reading text; glass only on the composer, the chat header, the sheet.
- Every visible number comes from data (footer stats from the route, never typed).
- Thai copy is plain and short; no vendor or model names on any surface.
- Reduced motion is per effect: the sea becomes one still composition, UI motion fades.
- In-app browsers get the same page; only speech recognition is left out there.
