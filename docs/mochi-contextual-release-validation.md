# VetMock 5.84.0 — contextual Mochi validation

Local release-candidate verification, 2026-09-08. Production is a separate gate:
the release must have exact-commit GitHub Build/Smoke and Vercel Production
success, followed by a changed-capability flow on vetmock.vercel.app.

## Implemented behavior

Mochi is embedded into existing welcome/onboarding, navigation, reading,
search, empty/loading/error, practice-feedback, SR and result surfaces. The
optional break room remains available, while the separate Home promotion card
was removed. A single device preference hides the decorative companions.

The usual illustrations are content-hashed SVG images with a local PNG fallback
and short CSS reactions. They have no JavaScript frame loop and cannot trigger
stale-module recovery if an image fails. A fault-injection test enters a draft,
then fails the image request and verifies that the text and document survive.
The full kit retains its interactive 2D/3D rigs and all 60 activities / 27 poses.

Stale-module recovery now remembers the entry bundle that was already retried.
A slow import failure after HTML load cannot reset the guard and cause another
automatic reload. A new entry hash may recover once. Exam deferral, offline
retry and restricted-storage protections remain in place.

## Completed local checks

| Check | Result |
| --- | --- |
| Unit suite | 784 passed, 0 failed, 0 skipped |
| Build | Production compilation and wiki/Atlas prerenders passed |
| Full lint chain | Passed, including pose generation, data integrity, tokens and three contrast passes |
| Dependency audit | 0 vulnerabilities; no dependency added |
| Mochi + Motion E2E retest | 56 passed across Chromium desktop/mobile, WebKit mobile and Firefox desktop; real 3D exercised in every engine |
| Mobile compatibility retest | 7 passed, 1 explicit platform-specific skip |
| System-polish / Notes–VetWiki recovery retest | 7 passed |
| WebKit data recovery retest | 3 passed |
| WebKit connected-study journey retest | 1 passed |

An earlier full Windows batch completed 450 passes, 10 failures, 43 skips and
5 cases not run. The failed areas were investigated and rerun as above after
the fixes; that original batch is not represented as a clean full-suite pass.
The final exact-commit Linux CI run is the full-matrix release gate.

The contrast checker excludes 432 gradient-backed landing elements from its
flat-color calculation. It found no unexcused failures in the measured elements.
The prior frame-timing sample was exploratory and is not a device-wide FPS claim.

## Reproduce

    npm run build
    npm run test:unit
    npm run lint:all
    npm audit --audit-level=high
    npx playwright test

Use a production preview. Network fault injection blocks service workers so a
cached response cannot bypass the intended failure; dedicated PWA/offline tests
cover caching separately. Native image readiness is checked against the actual
generated pose URL, not a bitmap-only timing assumption.

Source details: `docs/motion-kit-integration.md`. Task-local raw logs and the
post-publish receipt are kept under the ignored `work/` directory.
