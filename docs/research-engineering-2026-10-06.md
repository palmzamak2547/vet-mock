# Research 0.1.2 verification

Status: candidate on `codex/research-release-1006`, base `278ca1da`; hosted CI, integration and production acceptance pending. The owner authorized staggered releases and continued engineering in this chat. Study remains 5.137.0 with its existing worker.

Derived recipes and their codebook columns now commit in one existing compare-and-set transaction. A refused write preserves the typed formula for retry. Derived columns inherit hidden/privacy metadata; an explicit Codebook Show or Hide remains effective through saving, reload and project backup. The initial inheritance candidate broke explicit Show and was corrected before release.

OLS uses the effective codebook reference after any explicit analysis reference. Kept results retain their original numbers and receive a stale notice when interpretation changes. A separate codebook fingerprint preserves the canonical CSV hash. Older envelopes without this optional fingerprint retain their previous data-hash behavior.

Saved results, figures and report/script exports share the current hidden-column rule, including previously kept analyses. No numerical fixture, tolerance, clinical content, server schema, original artwork or worker lifecycle was changed. Both lockfiles patch source-map-js to 1.2.2; the Study audit still contains eight moderate findings in its existing Imaging dependency chain, while Research audit is zero.

Fresh corrected Research acceptance: 1,342/1,342 units in Bangkok and 1,342/1,342 in UTC; build, six built export contracts and dependency audit pass. Four changed journeys across Chromium desktop/mobile, WebKit mobile and Firefox pass 16/16 with zero retries: atomic native save/failure/retry, hidden CSV and reload, kept reference-result notices/HTML, and explicit derived Show with a positively observed raw header before hiding.

The unchanged Study/root-lock gate passed data 51/51, build/prerenders, contrast 3/3 and browsers 815 passed/44 skipped/5 retry-flaky. That dated gate preceded the final Research visibility correction; acceptance of the correction is the fresh Research evidence above plus required exact-head hosted Build, Smoke and Research R-parity CI. Original retry diagnostics remain recorded; the serial runner removed earlier Chromium attachments, so those images are unavailable. This is not a claim of a fresh full local gate on the corrected whole tree.

Source regression checks: `research/tests/unit/{store-transform-atomic,intake-derived-privacy,derived-visibility-controls,runtime-snapshot-interpretation,export-hidden-snapshot}.test.mjs` and `research/tests/e2e/{research-correctness-seams,research-derived-visibility-controls}.spec.js`. Local receipt, source/dependency manifests and first-attempt logs: `work/research-release-20261006/report.md` in the release checkout.

Next: require exact-head hosted CI, merge the coherent slice once, verify production SHA/aliases/assets and repeat these native journeys on the public origin. Local checks do not prove production, physical devices or real-account login. The old retained fixture and primary checkout's unrelated edits remain untouched.
