# VetMock OSS adoption audit — 2026-08-21

## Decision rule

Adopt a project only when it fixes a measured VetMock problem, has a clear
permissive license, is currently maintained, and can be isolated from the first
load. A popular dependency is not automatically an improvement.

## Adopted now

| Project | Version | License | VetMock use | Measured result |
|---|---:|---|---|---|
| [Vite](https://github.com/vitejs/vite/tree/v6.4.3) | 6.4.3 | MIT | Literal dynamic imports split the six-megabyte note corpus by subject. One lazy source map now serves NotesView, VetWiki, and the generated notes registry. | NotesView's own gzip chunk fell from 631,956 B to 36,331 B (94.3%). Opening COM V now needs about 54,048 B gzip for the view plus its note body, instead of loading the full corpus path. |
| [Valibot](https://github.com/open-circle/valibot) | 1.4.2 | MIT | Runtime schemas validate backup and custom-question JSON before any local state changes. | Invalid files fail closed; empty arrays restore correctly; legacy SR cards receive safe defaults; the complete streak timestamp is preserved. The dependency is a 2,671 B gzip lazy chunk and is not preloaded on the home page. |

The Vite implementation follows its official dynamic-import behavior: each
literal `import()` becomes a separately cacheable production chunk. The note
loader evicts rejected requests so a transient network failure can be retried.

## Evaluated, not adopted yet

| Project | Version checked | License | Decision | Reason |
|---|---:|---|---|---|
| [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) | 5.4.1 | MIT | Defer | VetMock's existing cards store SM-2 aggregates, not the complete review event stream needed for a truthful replay/calibration. A direct swap would silently move due dates. First add a compact versioned review log, then compare schedules in shadow mode before migration. |
| [TanStack Virtual](https://github.com/TanStack/virtual) | 3.14.10 | MIT | Defer | The 4,506-question bank is searched but not rendered as one list. Current visible lists are small enough that virtualization would add scroll/measurement and keyboard-selection risk without a measured bottleneck. Revisit if the custom-question manager commonly exceeds 200 rendered cards. |
| [idb-keyval](https://github.com/jakearchibald/idb-keyval) | 6.3.0 | Apache-2.0 | Defer | IndexedDB could reduce synchronous localStorage work, but VetMock also syncs these records through Supabase. Moving one side without a versioned dual-read migration risks device-to-device divergence. |
| [FlexSearch](https://github.com/nextapps-de/flexsearch) | 0.8.212 | Apache-2.0 | Do not add now | The current search keeps Thai substring matching predictable, pre-lowers its index, debounces input, and renders at most 80 rows. A new tokenizer must beat the current relevance and latency on a Thai query corpus before shipping. |
| [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa) | 1.3.0 | MIT | Do not replace current worker | VetMock's worker deliberately keeps `/api` network-only, uses controlled update activation, and retains immutable hashed assets across releases. Replacing it is only worthwhile if the plugin configuration reproduces those privacy and update contracts in tests. |

## Verification gates

- Shared corpus: 28 subjects and 305 note topics must equal the generated
  availability registry.
- Provenance: lecture sections remain first; Vet 85 sections append without
  losing their source labels.
- Imports: malformed backup/question files cannot call a data setter.
- Compatibility: v5.0 backups remain accepted; v5.1 additionally restores the
  full streak record.
- Delivery: `vendor-validation` and per-subject notes must not appear in the
  initial HTML module-preload list.

## Next evidence to collect

1. Record anonymized duration/count metrics for custom-question lists before
   considering list virtualization.
2. Add a bounded, versioned review-event ledger before running FSRS in shadow
   mode. Never convert due dates from aggregate SM-2 fields alone.
3. If local user data approaches the browser storage ceiling, design a
   dual-read localStorage-to-IndexedDB migration together with Supabase sync and
   rollback tests.
