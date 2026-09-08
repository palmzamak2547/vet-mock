# Motion Kit in the study experience

This integration uses the supplied effect source on existing product controls,
documents and timer states. The optional examples on `/app/mochi` remain available
inside a closed disclosure; that page starts with a usable study break and a link
to the existing focus timer.

## Usage map

| Supplied family | Actual use |
| --- | --- |
| Mochi poses | Existing contextual companions in welcome, reading, navigation, loading, practice feedback and results continue to use the same supplied artwork. |
| Paw, halo, comet, orbit, Mochi follower, leaf, ink, spotlight | Optional pointer styles over real Notes and VetWiki content. They never intercept text selection, links or input and do not save marks into the document. |
| Line focus | Next/previous paragraph navigation over the actual article. It marks the selected paragraph while retaining readable text and normal links. |
| Loading styles | All eight styles are available through the real theme menu. Shared loading/error surfaces and Notes use the selected loader. PDF downloads use measured byte progress; unknown/compressed lengths remain indeterminate. |
| Magnet and tilt | A small bounded fine-pointer response on the primary recommended study action and the Library/Atlas feature cards. Touch and keyboard actions work without pointer movement. |
| Ripple | Actual study, feature, retry, reader-tool and focus-start controls. Click handlers run immediately; the wave is optional. |
| Bookmark pop | Question bookmarks and Pinboard controls after their state changes. A failed Pinboard write retains the old state and error path. |
| Flip and reveal | Real SR answers after explicit reveal and actual practice feedback after grading. The renderer does not create or reveal answers itself. |
| Accordion and retry | Opening Notes sections and displaying actual error/retry states. |
| Toast and heart pop | PDF status/save messages and completion of a real break activity. No synthetic save state or learning credit is added. |
| Confetti, fireflies, paws, stars, chapter, hearts | Contextual score/personal-best, reading-checklist and break-completion feedback. A user's explicitly chosen celebration style still overrides the contextual default. |
| Breathing, memory, bubbles, fetch | Available during real Pomodoro breaks and in the existing rest page. Ending a break removes the activity and its resources. |
| Rain, glow, garden | Selectable backdrops inside the real focus timer. They pause with the timer and stop when hidden, offscreen or motion is disabled. |

## Ownership and limits

- `motion-kit/feedback.js` shares the original interaction keyframes between the
  examples and real controls. It owns no study data or action semantics.
- `MotionButton` gives the imperative ripple a dedicated empty DOM child. React
  continues to own the real label, handler, disabled state and accessible name.
- Motion failure is contained. Unsupported animation/canvas APIs cannot prevent
  navigation, answer selection, storage or document reading.
- Reading particles stay in a viewport-sized transparent layer, capped at 1.25
  DPR. A resting pointer sleeps after 700 ms. There is no per-frame React state
  update, document-wide trail, or permanently running reading animation loop.
- The existing scope owns listeners, observers, timers, frames and animations.
  Quiet/off, visibility and disposal contracts also apply to the new consumers.
- PDF progress reflects actual transfer information, not a simulated clock. The
  parsing stage returns to an indeterminate state.
- Content-hashed SVGs use LF on every platform; their names match their bytes.
- No new package dependency, learner-data schema or public route is introduced.

## Verification

`tests/e2e/motion-integration.spec.js` covers real reading content, idle cleanup,
global controls, failure of the animation API, reveal gating, actual timer breaks,
Pinboard persistence failure, measured PDF download and the organized rest page.
The original all-preset, Mochi, instant-feedback, PDF and study suites remain part
of regression coverage. Release proof must still include exact-SHA CI, Vercel
Production and canonical live use; the source usage map is not deployment proof.

Local v5.85.0 validation on 2026-09-08: build, lint and all 784 unit tests passed;
64 final integration/kit cases passed across the four browser profiles with no
retry or skip. The Safari artwork-failure/draft-preservation case also passed
twice in isolation. Dependency audit reported no vulnerabilities. The optional
3D failure notice now survives pose completion instead of being overwritten.
