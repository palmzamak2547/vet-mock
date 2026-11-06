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
                            speech (th-TH in/out), image (resize before upload), env;
                            the Chula sign-in wall: chula (the rule, a copy of src/lib/chula.js),
                            wall (its state), auth (the one Supabase Auth module, lazy), gis
                            (Google's own button), account (the page's wall + the API's token), inapp
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

## The Chula sign-in wall

While the wall is on (docs/CHULA-SIGNIN.md) the page shows a sign-in card over the sea until a
member session is present, and every POST to `/api/ai-chat` and `/api/ai-transcribe` carries
`Authorization: Bearer <access token>` (`lib/api.js`; the GETs stay public). A 401
`signin_required` refreshes the session once and retries, else shows the sign-in card; a 403
`chula_required` shows the link screen; a 503 is a temporary error. The state is `lib/wall.js`
(gateState's four answers, remembered on the device so a saved member session opens offline);
the session is `lib/auth.js` (PKCE, storage key `vmx-ai-auth`, its own session, never vetmock.com's).
The way in is Google's own button (`lib/gis.js`, One Tap beside it, only on https://ai.vetmock.com);
the redirect is the fallback, and so is an empty button slot 4 s after Google's script loaded. A
signed-in account with no Chula identity links one in place on this page's own session (Google's
button again, no One Tap, then `linkIdentity` with the ID token and a reload); an address that
already has its own account is told so with a way to sign in with it. A tab shown again re-asks the
switch at most once a minute. Signing out is at the foot of the history sheet. A build without
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` has no accounts and no wall.

## The voice call

A tap on the call button (the send button of an empty box, or the landing pill) opens
`components/Voice.jsx` (its own chunk with `styles/voice.css`, prefetched on hover, touch or
focus with the SDK, and the agent's hosts preconnected). `lib/voice.js` is the session,
`lib/voice-turns.js` the transcript and captions (pure, in `tests/unit/voice.test.mjs`),
`lib/voice-sound.js` the four synthesised tones.

```
tap -> microphone (asked first; when already granted the token is fetched at the same time)
    -> POST /api/ai-voice {action:'start'}   Chula wall, the student's day, the account floor
    -> WebRTC (14 s, then WebSocket with the session's one retry ticket; remembered a day)
    -> chime, "พูดได้เลย"; the sea holds the agent as a jelly (ocean setVoice)
the agent's tools -> POST /api/ai-chat {voice:{op:'search'|'quiz'|'papers', ...}}
hang up / time / silence -> the transcript joins the chat as ordinary messages
```

The agent lives on ElevenLabs but is defined in `api/_lib/ai/voice-agent.js` (prompt, tools,
voice, ASR keywords, turn-taking, caps, privacy) and written with
`node scripts/ai-voice-agent.mjs --apply`; the dashboard is never edited by hand. The caps and
the budget are `api/_lib/ai/voice.js`; the tools' answers `api/_lib/ai/voice-tools.js`.

What the screen does, and why (studies cited in the code):
- Turn-taking is "normal" with speculative generation (eager cut students off mid-pause). Before a
  search the agent says a few words that echo the topic: first audio about 1.0-1.5 s, the answer
  about 2 s. A look-up that outlasts that gets one soft ping (`PING_AFTER_MS`).
- Barge-in ducks: while the agent talks and the student starts to, its voice drops to 0.32 until
  the student stops (`DUCK_*` in lib/voice.js). Thai acknowledgements (อืม, ค่ะ...) never stop it.
- Captions default to the English terms as they are said (`keyTerms`); CC shows the whole line,
  revealed whole words at a time at the voice's pace, learned from finished answers (`nextRate`).
- A quiz shows its question and options on screen while they are read; `quiz_mark` lights the key
  and the pick; feedback explains why the key is right and the pick wrong.
- Follow-up chips after an answer, typing inside the call, a photo sent to the agent, the
  microphone and the speaker chosen (remembered), and hints for a microphone that hears nothing
  and for a speaker the agent hears itself through.

Traps the call has already paid for:
- **Mode flicker.** Over WebRTC the SDK reports "listening" for 1-12 ms between two chunks of one
  answer, every 2-5 s. `LISTEN_HOLD_MS` (300) holds speaking through it; without it the caption
  restarted and the jelly blinked.
- **Streamed parts restart.** Response parts over WebRTC begin again from the start of the
  response: the caption reads only the whole response (onMessage, deduped by `response_id`),
  on its own clock, queued behind a lead-in still being said.
- **CSP.** The SDK's worklets are served from this origin (`?url` imports, so they always match
  the installed SDK, which checks); `libsamplerate` too (WebSocket path in Firefox). Permissions
  allow autoplay and screen-wake-lock for self; connect-src names the agent's two hosts.
- **StrictMode** mounts the call twice in dev: the start waits a tick, so the thrown-away mount
  never mints a session.
- **Plan-gated options** (`noisy_environment_detection`) answer 403 on --apply: the page gives
  that hint itself.

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
- In-app browsers get the same page; only speech recognition is left out there. A call that
  cannot get the microphone there says to open the link in Safari or Chrome.
