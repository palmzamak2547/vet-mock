# Imaging products: Practical + Pro

**Status:** intentional two-product split, confirmed 2026-08-11.

VetMock and [CUVETSMO Imaging](https://imaging.cuvetsmo.com) solve different
jobs. They are not redirects or interchangeable shells.

## VetMock Imaging Practical

Owned by this repository and reached through `#lab`.

- Fast, approachable practice for students and general use.
- Public teaching cases plus local DICOM import.
- Essential viewing controls and learning-oriented Norberg/VHS workflows.
- Mobile-friendly guidance and low-friction defaults.
- No account or advanced workstation knowledge required for the core flow.

The Practical must stay intentionally focused. A feature belongs here only
when it makes routine study clearer or easier.

## CUVETSMO Imaging Pro

Owned by the dedicated imaging product at `imaging.cuvetsmo.com`.

- Full imaging toolset and deeper professional workflows.
- The destination for advanced tooling that would make VetMock's Practical
  slower, denser, or harder to learn.
- Linked from the Practical and from a separate `Imaging Pro` feature entry.

## Architecture boundary

- VetMock may own its compact viewer UI and educational workflow.
- Shared imaging services, advanced algorithms, and professional workflow
  expansion belong in CUVETSMO Imaging Pro.
- Keep the two feature descriptors and labels distinct: `lab` is local
  Practical; `imaging-pro` is external Pro.
- Do not silently redirect one product into the other.
- Test `#lab` locally and verify the Pro link independently before release.
