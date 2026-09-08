# Reading flow, v5.84.1

The Home feature preview previously hid both the document library and lecture
notes behind expansion. The library could open an existing PDF but offered no
route to the personal PDF reader. Returning from a shelf PDF discarded the
search, and the personal file picker could not be reached with a keyboard.

The shared feature registry now leads with reading destinations. The library
offers a personal-file entry into the existing PDF reader, and the standalone
reader links back to the library. App retains the shelf's return URL and clears
the remote document payload before opening a personal file. Both the loading
and loaded reader states label their destination correctly. The file chooser
uses a native button; its error alert follows theme tokens.

No data format, annotation key, account scope, PDF storage policy, dependency or
public route changes. The return URL restores the text search; other shelf
filters still use the existing lifetime of LibraryView.

## Validation

- Production build and all lint gates passed, including generated projections,
  CSS tokens and contrast audits.
- Unit suite: 784 passed.
- Related PDF/library batch: 90 passed; two new-case failures were the loading
  readiness issue described below. Focused rerun: all 24 cases passed across
  Chromium desktop/mobile, WebKit mobile and Firefox, including those cases,
  remote-to-local isolation and Quick Practice through results.
- Desktop library and file-picker layouts inspected in the browser.
- Browser regression coverage includes Home discoverability, library/personal
  reader navigation, query restoration, remote-to-local document isolation,
  keyboard file selection, narrow dark/reduced-motion error state, drawing,
  immediate exit, IndexedDB persistence and reopening the same local PDF.
- The initial new drawing test counted canvases before the page-loading cover
  had gone away. It now waits for PdfPage's actual render-ready state. Existing
  annotation, scrolling, pressure, erase, zoom and persistence tests remain.

Exact-SHA CI, deployment and canonical live evidence are recorded separately
after publication; local checks do not establish production state.

## Next review candidates

These are scoped leads for later iterations, not completed fixes:

- ToolsFAB: keyboard/focus behavior and the rotated close glyph.
- Reader recent-file rows: interaction between the row and its delete control.
- Library: retention of non-query filters across the reader round trip.
- Home: relationship between daily plan, quests, goal and personal checklist.

Reproduce a concrete user-facing issue before changing these surfaces. Preserve
the shared navigation registry and existing study, import and data contracts.
