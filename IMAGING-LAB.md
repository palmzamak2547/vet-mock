# Imaging Lab ownership handoff

**Status:** externalized from VetMock on 2026-08-11.

The canonical Imaging Lab is [imaging.cuvetsmo.com](https://imaging.cuvetsmo.com),
owned by the `cuvetsmo-imaging` product. VetMock keeps discovery links in its
feature registry, command palette, floating tools menu, and landing page; each
opens the canonical app directly.

## Why the local viewer was retired

- One owner now controls DICOM parsing, measurements, privacy fixes, and releases.
- VetMock no longer ships the duplicated Cornerstone, VTK, codec, and DICOM stack.
- The public study app has a smaller dependency and attack surface.
- Imaging users always receive the current Norberg/VHS workflow instead of a fork.

## VetMock integration contract

- Canonical URL: `IMAGING_URL` in `src/lib/feature-registry.js`.
- Feature descriptor: `FEATURES[id="lab"]` with `invoke.kind = "external"`.
- Consumers must execute the registry descriptor; do not add a local `/lab` view.
- Imaging-specific code and dependencies belong in `cuvetsmo-imaging`.

The former implementation remains recoverable from Git history before the
VetMock v5.26.0 release.
