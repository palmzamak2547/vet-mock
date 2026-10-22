# ADR: the VetMock Android app

Status: accepted, 2026-10-22. Owner request: "เราจะทำแอพด้วยครับ google playstore เราก็พร้อมแล้ว และเหนือกว่าในทุกๆแอพที่เราส่งให้คุณ!"

## Decision

**Capacitor 8 (Android), with the production web build bundled inside the app, served under the real origin
`https://vetmock.com`, and kept current by a native delta updater that pulls changed files from vetmock.com itself.**
Native code adds what a browser tab cannot do: a home-screen widget, reminders that skip a day you already studied,
system haptics for Mochi's states, the Android share sheet, Android's Google account sheet (Credential Manager),
App Links, app shortcuts and Play's review and update flows.

The web build stays the single source: the app runs the same `dist/` that vetmock.com serves. The only web code that
knows about the app is `src/lib/native-app.js`, plus one-line guards where a browser-only feature must stay off.

## The facts the decision rests on (measured 2026-10-22)

| Fact | Value | How measured |
|---|---|---|
| Production build | 284 MB, 3,973 files | `du` on a `npm run build` output of main (5.158) |
| Of which code (`assets/`) | 58 MB | same |
| Of which media fetched on demand | figures 158 MB, atlas 32 MB, og 8.2 MB, wiki pre-render 8.7 MB | same |
| Releases | 5.130 to 5.158 in about three weeks, often several a day | `src/data/changelog*` |
| PWA start | HTML is network-first with a 4 s timeout, then the cache | `public/sw.js` header |
| PWA offline | hashed code is cached only after it was first requested | `public/sw.js` |
| Sign-in methods | email and password, magic link, Google (GIS popup), Discord, LINE (LIFF), passkey | `src/lib/supabase.js`, `src/views/AuthView.jsx` |
| Supabase redirect allow list | includes `https://vetmock.com/**` | Management API, read only |
| Play target API | new apps and updates must target API 36 from 2026-08-31 | [Play target API requirements](https://developer.android.com/google/play/requirements/target-sdk) |
| Exact alarms | `SCHEDULE_EXACT_ALARM` is denied by default on Android 14+; `USE_EXACT_ALARM` is for alarm clocks and calendars | [Android 14 behaviour change](https://developer.android.com/about/versions/14/changes/schedule-exact-alarms) |
| Base APKs of the seven apps (no native-lib splits, so the real install is larger) | Duolingo 163.4 MB, Grab 218.7 MB, TikTok 161.2 MB, Dime! 121.6 MB, TrueMoney 100.5 MB, ViaBus 66.6 MB, CUNEX 65.3 MB | file sizes in `C:\dev\_rea\targets` (decimal MB) |

## Options

| Criterion | Trusted Web Activity (Bubblewrap) | **Capacitor, bundled build** | Full native (Kotlin/Compose) |
|---|---|---|---|
| Offline-first start | only what the PWA already cached; first open needs the network | **the whole code bundle ships in the app; opens with no network** | yes |
| Cold start | Chrome must start (if not running), then the 4 s network-first HTML | **no network on the start path; local files** | fastest |
| Download size | about 1 MB | code bundle plus a small shell (measured below) | unknown, years of work |
| Widget with streak, goal, exam | no way to read the page's data (Chrome owns the storage) | **web writes, widget reads** | yes |
| Reminders that skip a studied day | needs a push server | **on-device, inexact alarm** | yes |
| System haptics (`HapticFeedbackConstants`) | `navigator.vibrate` only | **yes, on the WebView** | yes |
| Google sign-in | web GIS works in Chrome | **Credential Manager account sheet** | yes |
| Play in-app review at a happy moment | our activity is not on screen | **yes** | yes |
| One codebase with the web | yes | **yes (same `dist/`)** | no: a second app |
| Update speed | instant (it is the website) | **minutes: delta updater from vetmock.com** | Play review per change |

Full native fails "one codebase": VetMock is thousands of components, 4,800+ questions, VetWiki, notes, the atlas
and PDF annotation, all shipping daily on the web. A TWA is the cheapest route and keeps every browser feature, but
it cannot carry the native work the owner asked for (widget data, on-device reminders, system haptics, in-app review)
and its first start depends on the network. Capacitor gets both, at the price of the work listed under Consequences.
The owner's expectation (Capacitor) holds.

## How the pieces work

**Origin.** Capacitor serves the bundle for `https://vetmock.com` (`server.hostname`). The page therefore has the same
origin as production: every share link, calendar link and auth redirect built from `location.origin` is right, the
production CSP applies unchanged, and the Supabase allow list already covers it. Requests the bundle does not hold
(`/api/*`, the on-demand media above) are not intercepted, so the WebView sends them to the real vetmock.com with
their bodies intact and caches them in its own HTTP cache.

**Updates.** Every build writes `dist/app-bundle.json`: the files the app carries, each with its SHA-256. The app reads
it from vetmock.com on start and on resume (ETag, so an unchanged manifest costs a 304), downloads only files whose
hash changed into a staging folder, checks every hash, and switches at the next cold start. A new bundle must report
itself healthy within 20 s or the app goes back to the previous one. A new native version (Play) resets to its own
bundle. Downloading JavaScript that runs in a WebView is allowed by Play's Device and Network Abuse policy.

**Sign-in.** Email and password, and magic links (they return through a verified App Link), work unchanged. Google
uses Android's Credential Manager when the Android OAuth client exists (owner step), otherwise the Supabase redirect
opens in an Auth Tab and comes back to the app. Discord and LINE take the same Auth Tab route. Passkeys stay hidden
inside the app: a WebView passkey is signed for the app's own origin (`android:apk-key-hash`), which Supabase does not
accept yet.

**WebView gaps filled natively.** Android's WebView has no Web Share, no `speechSynthesis` and no install state, so the
app provides them: the share sheet (files included), Android text-to-speech for read-aloud when no shared clip exists,
and `display-mode: standalone`. The service worker is not registered inside the app (the bundle and the updater do its
job).

**Native features.** Edge-to-edge with the page's own safe-area padding; predictive back (the WebView history first,
then home); the Android 12 splash with Mochi held until the page has painted, so there is no white frame and a dark
phone stays dark; adaptive and themed icon; app shortcuts (ฝึกทำข้อสอบ, ทบทวน, VetWiki); Thai as the app language;
notification channels; a widget with the streak, today's practice and the next exam; a daily reminder on an inexact
alarm that is skipped once the day's practice is done; system haptics for Mochi's correct, wrong and milestone states;
Play in-app review only after a perfect set or a streak milestone, at most once in 120 days.

**Not in the first release, and why.** Firebase Cloud Messaging: there is no server-side sender yet and reminders are
on-device, so the SDK would add size and a Data safety entry for nothing; it lands with the first server-sent message
(the owner creates the Firebase project then). Passkeys (above). LINE inside the app depends on its LIFF
endpoint accepting the Auth Tab return; if it does not, the LINE button stays hidden in the app.

## Consequences

- New: `mobile/` (Capacitor project, native code, scripts, store listing), `src/lib/native-app.js`,
  `scripts/app-bundle-manifest.mjs`, `.github/workflows/android.yml` (build, unit tests and emulator measurements in
  CI, not a required check). `public/.well-known/assetlinks.json` is written by the wizard once Play shows the app
  signing certificate.
- Shared files touched, one hunk each: `src/main.jsx` (imports the bridge first), `src/lib/app-lifecycle.js` (no
  service worker in the app), `src/lib/google-gis.js` (no GIS popup in the app), `src/lib/supabase.js` (Android's
  account sheet first), `src/views/PrivacyView.jsx` (what the app keeps on the phone), `package.json` (the build
  writes the manifest), `vercel.json` (a change only under `mobile/` does not rebuild the website).
- The app and the website keep separate storage: a student signs in once in the app; study data follows the account
  through the existing sync.
- Signing: Play App Signing holds the app key; the upload key is created by the owner with `mobile/scripts/wizard.sh`
  and never enters the repo or a chat.

## Measured beat table

Filled from the emulator run recorded in `docs/releases/` for the release that ships the app. Numbers that were not
measured are marked as not measured; nothing is estimated.
