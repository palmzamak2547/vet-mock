# VCA owned archive — 2026-09-05

The supplied CUVET85 collection is preserved in VetMock's private R2 bucket
`vetmock-library`, independently of Google Drive. Every stored object was read
back in full and its SHA-256 matched the acquired source bytes.

| Coverage | Verified result |
|---|---:|
| Accessible original source IDs | 487 |
| Study documents and videos | 485 |
| Word owner-lock files retained only in the backup | 2 |
| Artifacts, including native exports | 498 |
| Unique stored objects after full-hash deduplication | 441 |
| Stored object bytes | 4,209,236,979 |
| Study objects registered in the catalog | 440 |
| Library cards after binary duplicate reconciliation | 294 |

All 485 study source IDs remain attached to their cards, including duplicate
aliases and alternate formats. Native Google documents (10) and the spreadsheet
(1) each have an editable DOCX/XLSX export and a PDF snapshot. These preserve the
current document content, not Google's revision history or comments. All 22
exports passed PDF parsing or Office ZIP integrity validation.

The two 162-byte `~$` Word owner-lock files are identical and are not documents.
Their single object remains in the private backup and is excluded from both
the catalog and source-link resolver. One previously broken Vet82 shortcut,
target `1y-5rRgaj_suh0nfhvh-F0EQIw-oegpGc`, had no retrievable bytes and is listed
as unavailable in the manifest; it is not counted among the 487 acquired IDs.

## Independent recovery manifest

The manifest is also stored in R2, so recovery does not depend on this checkout:

- Key: `archives/vca/manifests/2026-09-05-7709984d65f3ebf0.json`
- Bytes: `414340`
- SHA-256: `7709984d65f3ebf0765fa300ab9551d557e7d67e9d858800dc91310bfb78501f`

It maps original file IDs, titles, collection paths, URLs and export formats to
the immutable object key, full hash, size and readback verification time.
Retrieve it through the private R2 management API or dashboard. With the
existing server signing configuration loaded from `.r2env`, restore without
contacting Google Drive:

    node scripts/restore-vca-archive.mjs --manifest <manifest.json> --out <restore-directory>

The command restores collection folders and source-ID subfolders to avoid
same-name collisions. It checks every file before renaming a partial download,
skips already verified copies, and refuses to overwrite different existing
bytes. Original URLs remain provenance; they are not required for restoration.

## Reading and access

`src/data/vca-materials.js` is the canonical mapping used by the library and
source resolver. The catalog keeps one row per unique study object; the UI
groups these rows into source cards. The original collection's reader access is
preserved. The retention basis is recorded as `user-authorized-study-backup`;
no public-domain license or instructor verification is asserted.

`/api/library-file` continues to enforce catalog publication and authentication
before signing a read. Archive reads go to
`vetmock-library-archive.palmzamak2547.workers.dev`, using
`workers/library-archive.js`. Its production module has no write endpoint and
requires the signed bucket, `archives/vca/` key and expiration. The Worker holds
only the derived signing key, never the account API token. Its R2 binding
supports byte ranges for large PDFs and videos; unchanged original bytes retain
the same annotation hash.

Deploy the module with `ARCHIVE` bound to `vetmock-library`, `ARCHIVE_BUCKET` set
to that bucket name, and secret `BLOB_MAC_KEY` set to base64 of
SHA-256(`vetmock-library-blob:` + the server's signing secret). Rotate this binding
whenever the server signing secret changes. The temporary authenticated upload
module was replaced with this read-only module after transfer and verification.

Cloudflare's management upload endpoint is limited to 300 MB. The large files
were uploaded as R2 multipart objects, verifying each part's MD5 and then the
assembled object's full SHA-256. See the official [upload API reference](https://developers.cloudflare.com/api/resources/r2/subresources/buckets/subresources/objects/methods/upload/)
and [R2 binding reference](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/).
