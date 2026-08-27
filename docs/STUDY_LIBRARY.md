# Study library — operations

Downloadable study documents (handouts, slides, summaries, past papers,
textbooks). The catalog is a Supabase table; the bytes live in an object store.

## Why the bytes are not in the repo

`public/figures` is already 157 MB across 2,234 tracked files and `.git` is
244 MB. A textbook shelf added the same way would be re-uploaded on every
Vercel build and cloned by every contributor.

Serving it from Vercel is worse than slow — Hobby's 100 GB Fast Data Transfer
is a hard stop, not an overage. One popular document could take the whole app
offline for the rest of the month, mid-exam.

## Cost shape

Measured against a 20 GB shelf with 200 GB/month of reads (≈100 students
pulling 2 GB each):

| Where the bytes live | Monthly |
|---|---:|
| `public/` on Vercel Hobby | app stops serving past 100 GB |
| `public/` on Vercel Pro | $20 + build weight |
| Supabase Storage, Free plan | infeasible — 1 GB storage, 5 GB egress |
| Supabase Storage, Pro plan | $25 (inside the included 100 GB / 250 GB) |
| **Cloudflare R2** | **~$0.30** — $0.015/GB-month, egress free |

R2's free tier (10 GB storage, 1M Class A, 10M Class B operations, free egress)
covers a small shelf outright.

## Two providers, one column

`library_docs.storage_provider` decides how the browser resolves bytes.
No caller in `src/lib/library.js` or `LibraryView` knows which it got, so
moving a document is a column update plus a re-upload.

- **`supabase`** (default) — private `library-docs` bucket, read through
  10-minute signed URLs. Same shape as `lab-dicom`. Zero new infrastructure,
  and `mpovsdzdggvksmeehqfj.supabase.co` is already in the CSP.
- **`r2`** — Cloudflare R2 behind a custom domain. Egress is free, so the
  marginal cost of a second reader is zero.

### Enabling R2

Three things must line up or every open fails:

1. `VITE_LIBRARY_CDN_BASE` — absolute https origin, no trailing slash.
2. The same host added to `connect-src` in `vercel.json`'s
   Content-Security-Policy. pdf.js fetches through XHR, so a missing entry
   fails as a CSP violation.
3. CORS on the bucket allowing `GET` and `Range` from the site origin.

## Speed

Two things do the work, and both are free:

- **Linearize before upload.** A "fast web view" PDF puts its hint table at the
  front, so pdf.js paints page 1 after ~100 KB of range requests instead of
  downloading the whole file. `library_docs.linearized` records this and
  `PdfAnnotateView` streams by URL when it is true, downloads whole when it is
  not (chasing a trailing cross-reference table over dozens of small ranges is
  slower than one sequential read).
- **Content-addressed keys.** `docs/<sha256_16>/<name>.pdf` never changes
  content, so objects are uploaded with `max-age=31536000` and cache at the
  edge and in the browser indefinitely.

Scanned PDFs are usually the real problem. Downsampling images first typically
cuts 5–10×:

```bash
gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dNOPAUSE -dBATCH -sOutputFile=small.pdf in.pdf
qpdf --linearize small.pdf out.pdf
```

## Annotations

`library_docs.sha256_16` is the *same* key `src/lib/pdf-annotations.js` derives
from an uploaded file — SHA-256, first 16 hex chars. Storing it in the catalog
is what lets a library document stream by range and still restore the reader's
strokes: the annotation key no longer has to be computed from bytes the browser
never downloaded.

`tests/unit/library.test.mjs` asserts the two agree. If that test fails, every
annotation on every library document has silently orphaned.

## How the shelf is organised

Four browse dimensions, all mirroring `src/data/curriculum.js` vocabulary:

| Column | Meaning | Notes |
|---|---|---|
| `year` | ชั้นปี 1-6 | primary grouping |
| `subject` | วิชา | a `SUBJECTS` id, e.g. `equine-medicine` |
| `semester` | เทอม | `1` ภาคต้น · `2` ภาคปลาย · `3` ภาคฤดูร้อน |
| `academic_year` | ปีการศึกษา | stored **CE** (2026), rendered **พ.ศ.** (2569) |

`academic_year` earns its place: the curriculum is re-taught yearly and the
lecturer and scope move with it — `curriculum.js` already carries notes like
*"ตารางบรรยาย 2569 — ไม่ใช่ อ.สหฤทัย อย่างที่สรุปรุ่นก่อนระบุ"*. Without it a
student cannot tell a current deck from a three-year-old one.

Three more columns are provenance and ordering rather than browse dimensions:

- `cohort` — the class taught, e.g. `Vet 86`.
- `lecturer` — shown on the card and searchable.
- `sequence` — ordering within a subject. A plain title sort puts "GI X" before
  "GI II", so every multi-part series needs it.

`LibraryView` reads this as **ชั้นปี → วิชา**, collapsible, with the reader's own
year open first. A search query switches to one flat list instead, because
grouping a handful of hits across four years buries them under headings.

## Adding a document

The browser has no write path into `library_docs` — `license`, `status` and
`storage_key` are authorization data, and a browser-writable row would let any
signed-in account publish arbitrary bytes under the VetMock name. Ingest runs
under the service role:

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
node scripts/upload-library-doc.mjs path/to/file.pdf \
  --title "สรีรวิทยาระบบหัวใจ" \
  --kind handout --subject com5 --year 5 \
  --license "instructor-permission" \
  --attribution "อ.ชื่ออาจารย์" \
  --permission-evidence "อีเมลอนุญาต 2026-08-20"
```

`--dry-run` prints the row without uploading. Rows land as `draft` and are
invisible until promoted:

```sql
update public.library_docs set status = 'public' where slug = '...';
```

`status` values: `draft` (nobody), `public` (anonymous visitors),
`restricted` (signed-in only), `archived` (hidden, kept for history).

For R2, upload out of band first — the script refuses to insert a row pointing
at bytes it cannot reach:

```bash
npx wrangler r2 object put "library-docs/docs/<sha>/<name>.pdf" \
  --file in.pdf --content-type application/pdf \
  --cache-control "public, max-age=31536000, immutable"
```

## Licensing

`license` is `NOT NULL` and the ingest script refuses to run without it. A row
cannot exist without an explicit answer to "why may we host this?", and a
permission grant additionally requires `--permission-evidence` naming where the
consent is on file.

## Storage access control

The `library-docs` bucket is **private**. `createSignedUrl` is permission-checked
against `storage.objects` before it signs, so the bucket carries two SELECT
policies that mirror the table's read rules — the catalog row is the authority:

- anon + authenticated → objects referenced by a `status = 'public'` row
- authenticated → also `status = 'restricted'`

A `draft` or `archived` document's bytes are therefore unreachable even to
someone who guesses the content-addressed key. Same shape as
`"lab-dicom read for public cases only"`.

## Production state (applied 2026-08-27)

Live on project `mpovsdzdggvksmeehqfj`:

- migration `library_docs_init` — table, 9 indexes, 2 read policies, RLS on
- migration `library_docs_storage_bucket` — private PDF-only bucket + 2 storage policies

Verified against the live database: `anon` has no INSERT, `authenticated` has no
UPDATE, and a status probe confirmed anon sees `public` rows only —
`draft`, `restricted` and `archived` all return 0 rows. `get_advisors` reported
no new security findings.
