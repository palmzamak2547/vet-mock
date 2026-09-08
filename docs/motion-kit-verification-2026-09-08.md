# VetMock 5.84.0 — local verification

Verified on Windows, 2026-09-08. This snapshot covers the Motion Kit integration
on top of the 5.83.0 onboarding release and the current local-file ingestion fix.
No production push or deployment is claimed by this receipt.

## Final checks

| Check | Result |
| --- | --- |
| Production build | Passed; app, wiki and Atlas entry prerenders completed. |
| Unit suite | 778 passed, 0 failed, 0 skipped. |
| `lint:all` | Passed, including generated data, tokens and three contrast passes. Existing question advisories remain 191 warnings / 0 errors. |
| Dependency audit | 0 vulnerabilities. No dependency added for the kit. |
| Motion browser suite | 30 passed, 2 explicitly skipped, 0 failed; Chromium desktop/mobile, WebKit mobile, Firefox desktop. |
| Existing connected-study, instant-feedback and layout regressions | 115 passed; 29 platform/fixture-specific skips. Includes real practice, exam reveal protection, Notes and VetWiki navigation. |
| Model archive | GLB v2 length valid; 2,392,340 bytes, 27 uniquely named animation clips. |
| Visual inspection | 2D/3D, desktop, 320px, dark mode, native controls and return-to-study. |

The two Motion skips are the real WebGL rendering case on WebKit/Firefox.
Their 2D activities and deliberately unavailable-WebGL fallback passed. Real
WebGL rendering, lazy loading, rig reuse and disposal passed on Chromium.

The final Motion suite also forces the actual update notice to appear before
Pause/Resume. Mobile controls retain stable rows and enough bottom space to stay
clear of the notice and fixed navigation. A cold view waits for explicit Mochi
readiness, with a bounded 20-second allowance, rather than a network-idle signal.

The contrast checker reports 432 gradient-backed landing elements outside its
flat-color calculation. It reported no unexcused contrast failures; that does
not constitute a numeric contrast measurement of those gradients.

## Performance evidence

A 60-frame exploratory sample during concurrent automated checks measured
Chromium median intervals of 16.7ms on desktop and 16.8ms with mobile emulation;
both had a 33.4ms 95th percentile. These are local observations, not a performance
guarantee for every physical device or a measured speedup over the input kit.

The browser suite independently verifies that Three/3D is not requested on
opening the 2D break room. Lifecycle tests verify that hidden/offscreen/reduced
surfaces stop scheduling frames and destruction removes scheduled work. The
main content and archive are not duplicated into standalone demo bundles.

## Reproduce

    npm run build
    npm run test:unit
    npm run lint:all
    npm audit --audit-level=high
    npx playwright test tests/e2e/motion-kit.spec.js --workers=1
    npx playwright test tests/e2e/instant-feedback.spec.js tests/e2e/connected-study.spec.js tests/e2e/layout.spec.js --workers=2

Use a production preview for browser checks. Raw local logs are kept in the
ignored `work/` directory. Production acceptance still requires the exact
commit's GitHub Build/Smoke, Vercel Production deployment and a live flow.
