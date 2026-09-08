# Mochi and Motion FX integration

The subsequent real-workflow integration is mapped in
[motion-kit-real-usage.md](motion-kit-real-usage.md): reading pointers/focus,
actual control feedback, PDF progress, contextual celebrations and timer breaks.

The supplied VetMock Motion FX Kit is integrated as source, with MIT attribution
in `docs/licenses/vetmock-motion-kit.txt`. The original download remains intact.
The app does not load the kit's duplicate standalone bundles or playground page.

## Product surfaces

| Surface | Behavior |
| --- | --- |
| Home and welcome | Mochi sits inside the existing welcome and how-to controls, year/phase selection, sign-in and onboarding. There is no separate Home promotion card. |
| Navigation and reading | Small, still poses accompany the sidebar, BackBar, Notes, VetWiki, library, schedule, reading checklist, progress and community views. |
| Loading, empty and error states | Shared StatePanel/EmptyState and search, connection and save notices use appropriate poses while preserving factual messages and recovery actions. |
| Practice and SR | Correct/encouraging feedback appears only after a revealed practice answer. SR changes from thinking to reading on reveal. Results celebrate only a sufficiently large, strong result. |
| Tools / search | The canonical feature registry opens `/app/mochi`; browser Back and direct links work. |
| Mochi break room | All 60 supplied presets across seven groups, all 27 poses, 2D/3D switching, camera views, speed, pause and restart. |
| Break activities | Fetch, four-pair memory, twelve bubbles, guided breathing and ambient scenes remain local activities. |
| Loading | An indeterminate style chosen on the device appears during a long actual Suspense wait. A percentage is shown only when a consumer provides measured progress. |
| Study feedback | Bookmarks get a brief press response. Question transitions use transform/opacity without a forced layout. Existing result and quest events use the selected particle style. |
| Preferences | Auto, quiet, off, global companion visibility, loader and celebration style. Stored under `vmx-motion-settings`, separate from account/study backups. Storage failures are reported. |

Loading, interaction and celebration previews in the break room are clearly
labelled as examples. They never change notes, scores, bookmarks or streaks.
Active exams retain the existing reveal/grading guard and have no mascot overlay.

## Lifecycle and performance contracts

- `src/lib/motion-kit/core.js` owns each surface's listeners, timers, observers,
  WAAPI animations and animation frames. Destroy is idempotent.
- Reduced motion and device preferences stop decoration. Page visibility and
  IntersectionObserver pause offscreen/hidden surfaces. Reduced-motion games
  retain their controls and counts; the breathing guide retains its text clock.
- Dormant particle bursts/trails and a stopped breathing exercise own no frame
  callback. Particles are capped at 160; ink trails at 100 points.
- Only one activity is mounted. Mochi pose changes reuse the rig and camera.
  3D is dynamically imported after the user selects it, uses the existing Three
  dependency, caps DPR at 1.5 and shadows at 512px, and falls back to 2D on failure.
- A late 3D import cannot recreate a destroyed view. Context loss releases the
  failed scene; geometries, materials, renderer and observers are disposed.
- App celebrations share one bounded canvas, stop on navigation/visibility/
  preference changes, and expire. Delayed result bursts are cancelled on unmount.
- UI colors use VetMock's semantic tokens. Original mascot/particle pigments are
  illustration colors and are documented separately in the hex-budget exemptions.
- `Mochi.jsx` is the reusable, input-transparent, viewport-lazy UI illustration.
  `MochiContext.jsx` and `mochi-presence.js` keep focused exams, drawing, imaging,
  race and existing game/timer workspaces clear. The illustration uses native SVG
  images, not the playground runtime or Three. Long waits retain the selected
  loader style beside the companion.
- `npm run regen:mochi` creates 27 content-hashed SVGs and their generated lookup
  from the same source artwork/poses as the full rig. The prebuild hook regenerates
  them; `lint:mochi` verifies their contents. After editing source artwork during
  development, run `npm run regen:mochi`. Do not edit generated files by hand.
- Still images have no frame loop; short CSS reactions finish in 900ms and obey
  reduced motion. A failed SVG falls back to the supplied PNG without entering
  stale-module recovery or reloading a form. If both images fail, the reserved
  illustration slot stays empty and all controls remain usable.
- The original PNG/WebP artwork and exported GLB with its 27 clips live in
  `public/motion/assets/`. They are not eagerly downloaded; the live rig uses the
  same pose engine as the exported model. No new package dependency is required.

## Verification

`tests/unit/motion-lifecycle.test.mjs` tests frame suspension, reduced motion,
infinite-animation cancellation, no replay and full disposal.
`tests/unit/motion-preferences.test.mjs` covers invalid preferences, catalog
completeness and finite poses under rapid switches/irregular frame times.

`tests/e2e/motion-kit.spec.js` exercises all presets, all poses, pause/resume,
games, reduced motion, storage failure, 3D lazy loading/reuse/fallback, preview
data isolation and 320px controls. Run it against a production preview alongside
the existing instant-feedback and connected-study specs. The latter deliberately
intercepts a built VetWiki chunk and must not run against a source dev server.

`tests/e2e/mochi-presence.spec.js` covers contextual placement, real practice/SR
states, the exam guard, global visibility preference and image failure after a
draft has been entered. `tests/unit/app-lifecycle.test.mjs` also pins retry
markers to an entry bundle so delayed failures cannot create a reload loop.

Source version 5.84.0 includes the concurrent 5.83.0 onboarding release. Local
validation is distinct from deployment: production requires the exact commit's
GitHub Build/Smoke checks, Vercel Production status and a changed-capability live
flow. See the task's verification receipt for the actual results.
