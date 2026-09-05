# VCA source intake and review — 2026-09-05

Source collection: [CUVET85 VCA](https://drive.google.com/drive/folders/1FszyjmGV29_Z63qv0kCg0bwppEaSfETC).

## Reconciled scope

| Item | Result |
|---|---:|
| Accessible source-file IDs inventoried, including linked older collections | 487 |
| Source groups before binary duplicate reconciliation | 352 |
| Library entries after reconciling a verified identical-file copy | 351 |
| Original file links retained after reconciliation | 487 |
| Added practice questions reviewed individually | 121 |
| Newly added curriculum topics | 6 |
| Unavailable older shortcut targets | 1 |

`src/data/vca-materials.js` is the source inventory. It retains each observed
Drive file ID, original title, URL, MIME type, size, and collection path.
Alternate formats within the same named collection share a library entry.
Different years and editions remain distinct. Content hashes reconcile
verified binary copies without discarding their original links.

The files remain on their original Drive URLs. They are not mirrored into the
application bundle or relabelled as licensed public-domain material. The
1,518 existing public catalog rows were read in full and had no VCA-tagged
documents or content-hash overlap with the 132 acquired recent source files.

## Practice boundary

The new bank, `src/data/questions-vca-reviewed.js`, contains **adapted practice**.
Every item retains its source file, physical PDF page and source question
number. Supplemental references are included where used. The source
collection includes recollections, incomplete alternatives, image-dependent
questions and highlighted answers that cannot all be accepted as authoritative.

Two equivalent questions were merged into their existing canonical entries
instead of added again: `1042` (DAT/Coombs in COM IV) and `106869`
(central/peripheral vestibular nystagmus in neuroanatomy). Their explanations
were corrected and the additional VCA source locators retained.

All inventoried source material is linked in the library; **the complete set
of original questions has not been converted into scored practice**. Only the
121 individually reviewed, self-contained items are added to scored pools.
Other questions remain accessible in the originals. A count of extracted text
blocks is not a verified count of distinct or answerable questions.

Examples of reviewed corrections include hatchable-egg arithmetic, urinary
obstruction and potassium, mucosal IgA, IgE-mediated anaphylaxis, the current
Anelloviridae classification of chicken anemia virus, and mosquito transmission
of avian Plasmodium. Older VCA questions also no longer present temperature
manipulation as reliable KHV prevention or nonspecific fish lesions as a
confirmed viral diagnosis.

Examples of primary references:

- [Cornell eClinpath: Potassium](https://eclinpath.com/chemistry/electrolytes/potassium/)
- [ICTV: Anelloviridae](https://ictv.global/report/chapter/anelloviridae/anelloviridae)
- [UF/IFAS: Koi herpesvirus disease](https://ask.ifas.ufl.edu/publication/VM113)
- [WSAVA vaccination guidelines 2024](https://wsava.org/wp-content/uploads/2024/04/WSAVA-Vaccination-guidelines-2024.pdf)

The older `VCA vet 82` shortcut resolves to file
`1y-5rRgaj_suh0nfhvh-F0EQIw-oegpGc`, which returned not-found both in the browser
and Drive metadata API. It is omitted from working document links. Restoring
that source requires a replacement link from its owner.

## System contracts added or repaired

- Timed questions use an absolute deadline, preserve it when resuming, and
  reconcile after background-tab suspension. A stale skip-confirmation cannot
  move a newer question.
- Missing-table errors are distinguished from permission errors and outages.
- Persistent library snapshots contain public metadata only, clear when a
  catalog becomes empty, and auth changes invalidate in-memory catalog and URL caches.
- Library source links are validated by host and document path, remain outside
  the PDF-byte reader, and expose every grouped original format.
- Source cards wrap long names at narrow widths; grouped links have 44px targets.
- Figure-dependent questions are recognized even when PDF copying inserts a
  space or line break into phrases such as “จาก ภาพ”.
- Connectivity indicators ignore superseded probes, trust a successful network
  response over a stale interface flag, and confirm an isolated failed probe
  before declaring the connection offline.

Current learner/source totals are generated in `docs/content-inventory.md`.
Release requires the normal unit, lint, build, dependency and browser gates,
then exact-SHA CI, successful production deployment, and a live changed flow.
