# System stability audit — 2026-10-09

Candidate Study5.141.6 / SW217 starts at main `14a62d02`. This is a source and validation record, not production proof. Root coordinates one release; unrelated primary changes and the active Research M3a lane stay preserved.

| Observed failure | Repair | Verification seam |
| --- | --- | --- |
| A delayed exam launch overwrites newer navigation, account, configuration or session; adaptive load failure discards resume context. | Retire pending start intent on context changes; apply replacement state only when selection succeeds; preserve a usable failure route. | Actual handler deferred-result tests and real delayed/failed chunk journeys; ordinary quick, lecturer, Panic and Continue launch controls. |
| Switching equal-sized review filters leaves later rows unreachable. | Observe the replacement sentinel and re-arm pagination after each page. | Actual 80-question review, both filter directions and missing-observer fallback. |
| A second offline PDF deletion drops the tombstones still needed by the account. | Retry the retained deletion record and remove it only after durable upload; tell the reader to reconnect/retry. | Actual handler and annotation merge tests; native IndexedDB/delete/reopen with modeled account traffic. |
| A supplemental archive restored in another tab leaves old image decks on screen. | Listen to the existing archive bundle storage key. | Real cache invalidation and two-tab Dashboard import → deck/editor flow. |
| Repeated visibility or stale realtime callbacks duplicate pending locks/connections. | Coalesce pending wake-lock requests; retire prior channels and cancel queued retries on unmount. | Actual hook tests with deferred browser/provider capabilities; no physical power measurement claimed. |
| External documents retain prior-account state, hide connection errors and show import success without saving. | Account-scoped state/recents, cancel retired requests, visible errors/retry, actual open-in-reader action. | Mounted component regressions, strict client boundary tests and modeled browser flows. |
| Google documents use the wrong connection provider; token refresh loses owner or can undo disconnection; selected Sheets tabs can be substituted. | Canonical provider lookup, owner-conditional token update and selected-gid retrieval with public fallback. | Actual API handlers with modeled upstream/REST responses, concurrent revoke/reconnect cases and tab-specific contents. |

## Evidence and limits

- Detailed original failures and subsequent checks are retained in `work/system-20261009/`, including each scoped agent's evidence. Never combine partial or retried runs into an invented clean total.
- `npm run stats` is authoritative; this audit does not change source questions, clinical facts or scope metadata.
- Root dependencies remain locked and unchanged apart from package release metadata. Current audit: high0, critical0, moderate8. All eight trace to the existing Imaging dependency chain and [sprintf-js precision advisory](https://github.com/advisories/GHSA-hp3w-g68c-fv3c), which currently lists no patched version. No broad major-version migration is included.
- Authenticated browser/API evidence uses controlled synthetic sessions and intercepted traffic; it does not prove real OAuth grants, private production documents, live RLS or Google project API enablement. Hardware IME, physical devices and long-lived mixed-client behavior remain separate validation limits.
- Research source is unchanged and remains under its existing owner's claim. No database/auth/storage/OAuth configuration change or early service-worker takeover is part of this release.

## Release acceptance

Pending: frozen-tree full gate, exact PR/main Build + Smoke, Vercel READY/commit/aliases and actual public changed journeys. Release receipt will be `work/system-20261009/RELEASE.md`; final status belongs in AGENTS.md and Launch Readiness.
