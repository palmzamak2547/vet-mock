# Automatic updates and study continuity

## Update boundary

`src/lib/app-lifecycle.js` checks for updates hourly and when the tab becomes
visible. Updates install automatically; the browser activates a waiting worker
after all documents using the old worker close. Open documents keep their
controller and state. Online new documents already receive the newest UI through
network-first navigation, even while the previous worker remains active. This
applies to the main app and the standalone Atlas.

There is no `skipWaiting` call or capability handshake. Ignore early-activation
messages, including legacy `SKIP_WAITING`: an older document may already have
armed a reload on `controllerchange`. Informational waiting status must never
request takeover. Worker improvements can wait until every app tab/PWA window
closes; loading the newest online UI does not depend on early worker activation.
Ordinary browser activation retains `clients.claim` for newly opened documents.

Never call `location.reload()` in response to update availability,
`controllerchange`, tab visibility or a SPA view change. A route does not
serialize drafts, dialogs, playback, a loaded local PDF, or reading position.
The previous eight-view denylist was therefore insufficient. No update banner
or update button is required.

`vite:preloadError` keeps its rejection so the importing component can show its
existing retry. Do not call `preventDefault()` there: Vite would resolve the
failed import to `undefined`. The shared ErrorBoundary offers an explicit page
reload for a failed module and explains the unsaved-work consequence.

Global lazy overlays use `OptionalFeature`, which combines the existing
Suspense/ErrorBoundary and shared dialog. A failed search, sketchpad, tour or
settings import closes that feature without unmounting the page underneath.
Background helpers and telemetry use a silent fallback. Do not leave optional
lazy components outside an error boundary: Suspense handles loading, not errors.

## Offline continuity

`public/sw.js` retains the current runtime and the newest previous runtime
with a usable root document. Offline lookups prefer the current exact route,
then the previous exact route; only document navigation falls back to `/`.
Atlas keeps its independently verified shell cache.

When a successful cached root already exists, background installation skips
the new `/` document. Its hashed entry has not been loaded yet, so caching that
HTML could displace a usable offline shell with a build that cannot start.
Natural online document navigation caches the new HTML normally. A first
install with no earlier root retains best-effort root precaching.

Immutable assets already fetched remain available while any browser window is
open. The 300-entry target is soft: retained HTML documents and their reachable
cached JS/CSS/assets stay intact even when one complete build exceeds 300 files.
Cleanup scans those cached dependency graphs without network fetches and removes
only unrelated leftovers; a failed scan cancels cleanup. Runtime-shell inspection
errors also cancel pruning and new-root precaching, rather than treating an
unreadable shell as absent. A non-BFCache `pagehide` sends a best-effort
cleanup request; the worker waits one second for the departure, then rechecks
all windows before scanning, then checks again before trimming. Another open or
newly created window protects its assets. Cache writes, revalidation and delayed cleanup use `event.waitUntil`;
a storage failure cannot replace a successful network response with an error.
API privacy and library content-hash rules are unchanged.

This does not retroactively fix JavaScript already running from an older
release, recover an old chunk that was never downloaded, or prevent browser/OS
eviction. A missing chunk remains an explicit retry condition. A browser test
using HTTP 503 for installation requests remained in `installing` for over
15 seconds; no installation deadline change is claimed by this patch.
Future API/schema releases must remain compatible with the older documents
that are deliberately allowed to finish. This patch changes no API or schema.

## Navigation continuity

- Video subject filters live in the URL and history. Chips replace the current
  entry, so changing filters does not add browser Back steps. Unknown subjects
  fall back to All; choosing All clears an old incoming subject.
- Reopening the current destination delivers `vmx-view-intent` without
  remounting it. Library consumes a fresh subject/query and clears conflicting
  old filters. Subject selection switches between reading and practice intent.
- Topic selection reports its active tab to App, so a round trip to Notes
  returns to the tab that opened it. Selecting another subject starts fresh.
- Existing global navigation categories, sidebar limits, course scope and
  source content remain the owners of structure; this patch adds no menu items.
- The essay word counter uses text colour tokens separately from the progress
  bar's fill tokens. Zero and all three length bands remain readable in every
  palette, without changing counting, grading or the bar's colours.

## Regression evidence

`tests/unit/app-lifecycle.test.mjs` covers every stable route plus stateful,
unknown and initial views. `service-worker-update-safety.test.mjs` covers
failed installation, cache lifetime, exact/current-route preference and writes.
`tests/e2e/service-worker-live-update.spec.js` uses actual workers on isolated
HTTP origins to verify unchanged open documents, new UI under the existing
controller, natural activation after every document closes, and fallback after
real connection loss. It also uses the exact production lifecycle from
`e6ab5ea2` to verify armed legacy tabs mixed with modern documents. App flows
are covered by `update-and-intent`,
`video-navigation`, and the existing `connected-study`/`system-polish` specs.
Only the worker fixture uses `/app/` scope so an uncontrolled same-origin
observer can wait for native activation before reopening. Production keeps
root scope; its live transition must be verified separately at that real scope.
`optional-feature-failure` aborts actual module downloads and verifies the
underlying draft stays editable, including repeated failed opening attempts.

Release evidence and any blockers are recorded in AGENTS.md. Local checks are
not proof of deployment; merge with the current release branch and verify its
exact CI/deployment and live flows before declaring production updated.
