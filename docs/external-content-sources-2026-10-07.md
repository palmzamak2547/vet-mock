# External content sources — Notion, Google Docs, Google Sheets

Dated research note, 2026-10-07. Question: the owner wants content from Notion,
Google Docs and Google Sheets to appear in the VetMock web app, and suggested
"MCP or connectors". This note compares the realistic integration options
against primary sources (official docs only), reality-checks MCP for a Vercel
serverless website backend, and proposes an architecture that fits the existing
repo. Every external claim carries a citation URL; repo claims cite file paths.

**Where this file lives:** `docs/external-content-sources-2026-10-07.md`,
following the existing kebab-case + dated-suffix convention in `docs/`
(compare `engineering-loop-2026-10-06.md`, `research-engineering-2026-10-06.md`,
`bugfix-audit-2026-10-05.md`).

---

## TL;DR

1. **Do not use MCP for the product runtime.** MCP is a protocol for *AI
   clients* (Claude, ChatGPT, Cursor) to call tool servers — not a data-fetch
   layer for a website backend. Building one would also collide with the repo's
   no-duplication rule (MCP → cuvetsmo-mcp). Plain HTTPS to the providers'
   documented endpoints is less code, faster, and needs no new dependency.
2. **Google Sheets: zero-config works today.** The documented gviz endpoint
   returns CSV from any "Public on the web" or "Anyone with the link" sheet
   with no credential at all.
3. **Google Docs: near-zero-config.** The official documented path
   (Drive API `files.export`, now including `text/markdown`) uses a server-only
   API key for a public/link-shared doc. The reader prefers it when
   `GOOGLE_API_KEY` is configured, then degrades to the well-known but
   **undocumented** `/export` URL with no credential when it is not (stability
   of that fallback is unverified by Google).
4. **Notion: never zero-config.** Every official Notion API request needs a
   bearer token, and pages must be explicitly shared with the integration —
   even public pages cannot be read with zero credentials via the API. Cost of
   entry is one internal-integration token in a Vercel env var. The new
   `GET /v1/pages/{id}/markdown` endpoint removes the old blocks→markdown pain.
5. **Build one small serverless fetch function** with a strict host allowlist
   (SSRF), the repo's existing origin/rate-limit/error contract, and KV
   caching — then render the result through the **existing** notes/VetWiki
   surfaces. Do not create a second browser loader map (Critical Rule 7).

### Recommendation table

| Source | Zero-config option (no secret) | Token option (Vercel env var) | Effort to integrate |
|---|---|---|---|
| **Google Sheets** | gviz CSV: `https://docs.google.com/spreadsheets/d/<ID>/gviz/tq?tqx=out:csv` for public/link-shared sheets (documented). "Publish to web" CSV also works. | Sheets API + `spreadsheets.readonly` OAuth/service account for private sheets | Small — one fetch + CSV parse |
| **Google Docs** | Undocumented `https://docs.google.com/document/d/<ID>/export?format=md\|txt` for link-shared docs (**unverified stability**) | Drive API `files.export` → `text/markdown` with an API key (public files) or service account | Small — one fetch, already markdown |
| **Notion** | None — API cannot read public pages without a token (verified) | Internal-integration token (`NOTION_TOKEN`) + share the page with the integration + `GET /v1/pages/{id}/markdown` | Medium — token handling, page sharing, rate-limit respect |
| **MCP (Notion/Drive)** | n/a — wrong layer for a website backend (see below) | n/a for product runtime; fine for the owner's own authoring tools | Would be **negative** value here |

---

## 1. MCP reality check

### What an MCP server actually is

MCP (Model Context Protocol) is "an open-source standard for connecting AI
applications to external systems" — the docs liken it to "a USB-C port for AI
applications" so that "AI applications like Claude or ChatGPT can connect to
data sources … and tools" ([MCP intro](https://modelcontextprotocol.io/docs/getting-started/intro)).

The participants are ([MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture)):

- **MCP host** — an AI application (Claude Code, Claude Desktop, VS Code, ChatGPT);
- **MCP client** — one per server, owned by the host;
- **MCP server** — "a program that provides context to MCP clients", exposing
  three primitives: **tools** ("executable functions that AI applications can
  invoke"), **resources** (context data), and **prompts** (templates).

Transports ([same page](https://modelcontextprotocol.io/docs/learn/architecture)):

- **stdio** — "standard input/output streams for direct process communication
  between local processes on the same machine"; local servers "typically serve
  a single MCP client". This is how `npx`-launched servers work.
- **Streamable HTTP** — "HTTP POST for client-to-server messages with optional
  Server-Sent Events"; remote servers "typically serve many MCP clients" and
  support bearer tokens/API keys, with OAuth recommended.

So the intended consumer of every MCP server is an **AI application with an
MCP client session** (JSON-RPC discovery, `tools/list`, `tools/call`). A Vercel
serverless function is none of those things.

### The official Notion and Google MCP servers exist — but they face AI tools

- **Notion** ships "Notion MCP, our hosted MCP server, for a more
  token-efficient, Markdown-based API optimized for ChatGPT, Claude, and other
  tools—or host your own with our open-source server"
  ([developers.notion.com/docs/mcp](https://developers.notion.com/docs/mcp)).
  The open-source repo lives under Notion's GitHub org
  ([makenotion/notion-mcp-server](https://github.com/makenotion/notion-mcp-server)).
- **Google Drive** has an official remote MCP server at
  `https://drivemcp.googleapis.com/mcp/v1` (Streamable HTTP, OAuth 2.0,
  `drive.readonly`/`drive.file` scopes, eight tools such as `search_files` and
  `read_file_content`). Its stated audience is **AI agents** — the doc walks
  through connecting Google Antigravity and Claude — and its prerequisites
  include the Google Workspace Developer Preview program. Google itself warns
  of indirect prompt injection and recommends screening agent actions
  ([Drive MCP server guide](https://developers.google.com/workspace/drive/api/guides/configure-mcp-server)).
- The MCP project's own reference Google Drive server was **archived** — the
  reference repo "is dedicated to housing just the small number of reference
  servers maintained by the MCP steering group", warns the servers are
  educational examples "not production-ready solutions", and lists Google
  Drive among those "now archived"
  ([modelcontextprotocol/servers README](https://github.com/modelcontextprotocol/servers)).

### Why MCP is the wrong tool for VetMock's website backend

1. **The client doesn't exist in our stack.** Our serverless functions are
   plain `fetch` callers (`api/_lib/llm.js` talks to DeepSeek/Anthropic with
   raw HTTPS; `api/send-feedback.js` calls Resend the same way). Calling an
   MCP server would mean implementing or importing an MCP *client*: JSON-RPC
   session, capability discovery, tool-call envelope — a protocol layer whose
   only job is to wrap one HTTPS GET we could have made directly.
2. **stdio servers don't fit serverless at all.** A stdio server is a local
   subprocess piped over stdin/stdout for one client
   ([MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture));
   a Vercel function gets no persistent stdin/stdout peer and would have to
   spawn and tear down a Node process per request. Remote (Streamable HTTP)
   MCP servers work, but then you're doing OAuth as a machine client plus
   tool-result parsing to obtain data a REST endpoint returns as JSON.
3. **Tool output is shaped for models, not renderers.** Notion's hosted MCP
   returns markdown *for token-efficient chat consumption* to chat clients;
   our app needs deterministic HTML/markdown for the existing Notes renderer,
   deterministic error codes, caching and rate limits — exactly what the
   regular Notion API gives us.
4. **No-duplication rule.** AGENTS.md: "Do NOT rebuild knowledge backend
   (→ cuvetsmo-source) · MCP (→ cuvetsmo-mcp) · AI inference (→ shared
   ai-chat)". Building a VetMock MCP layer would duplicate cuvetsmo-mcp's
   role by project rule.
5. **Where MCP *is* right:** the owner's own authoring flow — wiring Notion's
   MCP server into Claude Code/Cursor to draft or review content. That is an
   offline productivity choice, not product code, and needs nothing in this
   repo.

---

## 2. Notion API

### Auth model (and the public-page answer)

- Notion integrations come as "internal connections … scoped to a single
  workspace" that "use a static credential called an internal connection API
  token" ([Notion getting started](https://developers.notion.com/docs/getting-started)).
- Access is **explicit and permission-gated**: connections "require **explicit
  permission** from users to access Notion pages and databases", and
  "Connections must have access to pages and databases before they can
  interact with them" ([same page](https://developers.notion.com/docs/getting-started)).
- **Can a PUBLIC Notion page be read with zero credentials via the official
  API? No.** Every request must carry a valid bearer token; the error
  reference defines HTTP 401 with code `unauthorized` as "The bearer token is
  not valid"
  ([Notion errors](https://developers.notion.com/reference/errors)), and page
  access additionally requires the page to be shared with the connection
  ([getting started](https://developers.notion.com/docs/getting-started)).
  Publishing a page to notion.site makes it readable by *browsers*, but the
  official API is a separate, always-authenticated surface. (There is no
  unauthenticated read anywhere in the API reference; verified against the
  pages cited here.)

### Content model: blocks

- Page content is a tree of **block objects**. `GET /v1/blocks/{block_id}/children`
  "Returns only the first level of children for the specified block"; nested
  content requires walking `has_children: true` recursively, with cursor
  pagination (`has_more`/`next_cursor`) and a `Notion-Version` header
  ([get-block-children](https://developers.notion.com/reference/get-block-children)).

### Markdown: now an official endpoint

- `GET /v1/pages/{page_id}/markdown` returns the page "rendered as enhanced
  Markdown" with `markdown`, `truncated` and `unknown_block_ids` fields;
  requires `Notion-Version` `2026-03-11` and read-content capability
  (otherwise HTTP 403)
  ([retrieve-page-markdown](https://developers.notion.com/reference/retrieve-page-markdown)).
- The guide frames markdown as "an alternative to the block-based API",
  "especially useful for agentic systems and developer tools that work
  natively with markdown"
  ([working with markdown content](https://developers.notion.com/guides/data-apis/working-with-markdown-content)).
- Limits: pages beyond "approximately 20,000 blocks" are truncated; unsupported
  block types (Bookmark, Embed, Link preview, Breadcrumb, Template) "appear as
  `<unknown …/>` tags"; embedded file URLs in the output are pre-signed and
  expire after a short period — long-lived copy must re-host or re-resolve
  assets ([same guide](https://developers.notion.com/guides/data-apis/working-with-markdown-content)).
  Community converters like `notion-to-md` existed precisely because the API
  historically returned only JSON blocks; for new work the official endpoint
  makes them optional
  ([notion-to-md](https://github.com/souvikinator/notion-to-md/discussions/112) — community source).

### Rate limits

- Per-connection, per 60-second window: "Business and Enterprise: 600 requests
  per minute (an average of 10 per second)"; "All other plans: 180 requests
  per minute (an average of 3 per second)". The budget "can be spent at any
  pace within the window".
- Exceeding limits returns HTTP 429 `rate_limited` with an integer-seconds
  `Retry-After` (≤60 s for the connection limit); some endpoints have their
  own limits (`rate_limit_reason` in the body); a separate per-workspace limit
  is shared across all the workspace's connections
  ([request limits](https://developers.notion.com/reference/request-limits)).

The 3 rps figure is comfortable for owner-paced ingestion or cached reads, but
it rules out any per-student live-fan-out design.

---

## 3. Google Docs

### Official API: OAuth only, in practice

- The Docs API REST reference for `documents.get` lists **only OAuth scopes**
  as acceptable authorization — `documents`, `documents.readonly`, `drive`,
  `drive.readonly`, `drive.file` — and offers no API-key credential
  ([documents.get reference](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/get);
  scopes table in
  [Docs API scopes](https://developers.google.com/workspace/docs/api/auth)).
- Google's credential guidance: "An API key is … used to anonymously access
  publicly available data", with the example of "Google Workspace files shared
  using the 'Anyone on the Internet with this link' sharing setting"; OAuth
  client IDs are the credential type "for user data"
  ([create credentials](https://developers.google.com/workspace/guides/create-credentials)).
  Practically: the Docs API is an OAuth/service-account surface; an API key
  alone is not a Docs API path.

### Drive API `files.export` — the documented markdown path

- The Drive API export-format table shows Google **Documents** exporting to,
  among others: `text/plain` (.txt), `text/html` (.html), `application/pdf`,
  and **`text/markdown`** (.md)
  ([Drive export formats](https://developers.google.com/drive/api/guides/ref-export-formats)).
- Combined with the API-key rule above, a **public/anyone-with-link doc can be
  exported through Drive API `files.export` with just an API key** (key sent
  as `?key=`), no OAuth dance. This is the officially documented way to turn a
  Google Doc into markdown for the app.

### The undocumented export URL

- `https://docs.google.com/document/d/<ID>/export?format=txt|md|html` returns
  the exported file for public/link-shared docs without any credential. **This
  endpoint is undocumented**: no official Google page describes it, its
  behavior is community-observed, and its stability is **unverified** —
  Google can change or rate-limit it without notice. Use it only for
  zero-config prototyping, and never as the only path for a shipped feature.
  When in doubt, prefer the documented Drive API export (key or service
  account). *(Unverified-claim marker: everything in this paragraph beyond the
  URL shape is community knowledge, not a primary source.)*

### When does the export endpoint suffice?

For the owner's own authored docs that are already link-shared public, a plain
export-to-markdown fetch (either flavor) is sufficient: the content is
read-only, attribution/provenance stays with the source URL, and there is no
per-user identity involved. The full Docs API (OAuth, structured document
JSON) is only needed for editing, comments, or private documents — none of
which VetMock's read-only study content requires.

---

## 4. Google Sheets

### gviz endpoint — documented, zero-credential for shared sheets

- The Google Charts documentation officially documents querying a spreadsheet:
  `https://docs.google.com/spreadsheets/d/{spreadsheetId}/gviz/tq` with `tq=`
  (Google Visualization query language, e.g. `SELECT A, H`), `headers=N`,
  `gid=`/`sheet=` and `range=` parameters
  ([gviz + spreadsheets](https://developers.google.com/chart/interactive/docs/spreadsheets)).
- Permission rule, quoted: "The spreadsheet must either be visible to everyone
  or the page must explicitly acquire an end-user credential", and
  "Spreadsheets shared to 'anyone who has the link can view' do not require
  credentials. Changing your spreadsheet's sharing settings is much easier
  than implementing authorization."
  ([same page](https://developers.google.com/chart/interactive/docs/spreadsheets)).
- The response format is chosen with the `tqx` parameter; `out=csv` is
  documented as "Comma-separated values. If this is used, the only thing
  returned is a CSV data string"
  ([data source protocol](https://developers.google.com/chart/interactive/docs/dev/implementing_data_source)).
  So `…/gviz/tq?tqx=out:csv&headers=1` is a fully documented, secret-free CSV
  feed from any shared sheet.

### "Publish to web"

- File → Share → Publish to web publishes the file: "you can send a new URL to
  anyone or embed into your website"; spreadsheets can publish "the entire
  spreadsheet or individual sheets" with a chosen publishing format; "Any
  changes you make to the original document will be updated in the published
  version"; removal requires "Stop publishing"; and Google warns to "Be
  careful when publishing private or sensitive info"
  ([support.google.com/docs/answer/183965](https://support.google.com/docs/answer/183965)).

### Official Sheets API

- Scopes: `spreadsheets` and `spreadsheets.readonly` (both "sensitive"),
  `drive.file` ("Recommended, Non-sensitive"), `drive`/`drive.readonly`
  ("restricted") — with the guidance to "choose the most narrowly focused
  scope possible"
  ([Sheets API scopes](https://developers.google.com/workspace/sheets/api/scopes)).
- Private sheets therefore need OAuth or a service account (the sensitive
  scopes add app-verification burden); public/link-shared sheets need nothing
  beyond gviz. For a read-only study-content pipeline, gviz CSV or
  `export?format=csv` covers it without any secret.

---

## 5. Vercel serverless constraints

- **Duration** (with Fluid compute, the current default): "Hobby: 300s default
  and maximum. Pro and Enterprise: 300s default, 800s maximum, and 1800s
  extended maximum Beta." Timeout yields 504 `FUNCTION_INVOCATION_TIMEOUT`
  ([Vercel Functions limits](https://vercel.com/docs/functions/limitations)).
  A Notion + Google fetch chain fits trivially inside the default.
- **Body size**: "The maximum payload size for the request body or the
  response body of a Vercel Function is **4.5 MB**", else 413
  `FUNCTION_PAYLOAD_TOO_LARGE`
  ([same page](https://vercel.com/docs/functions/limitations)). Large exported
  docs should be truncated/cached rather than piped through whole.
- **Environment variables**: "encrypted at rest"; each variable is scoped to
  Production/Preview/Development environments; variables of type **Secret**
  are "write-only after saving"; source code reads them "during … Function
  execution" (server-side `process.env`); total 64 KB per deployment; rotation
  is a documented flow
  ([Vercel environment variables](https://vercel.com/docs/environment-variables)).
  This matches the repo's existing convention that provider keys
  (`RESEND_API_KEY`, `DEEPSEEK_API_KEY`, R2 keys) live as server-only env vars,
  never `VITE_`-prefixed (`api/_lib/r2.js` states "Env (server-only, never
  VITE_)").
- **SSRF**: if a function fetches anything derived from request input, OWASP's
  SSRF cheat sheet applies — "Deny-lists are bypass-prone. Prefer
  allow-lists"; match the host against an allowlist and **rebuild the request
  yourself** instead of forwarding user URLs; use battle-tested URL parsing;
  disable redirect following or re-validate; deny-listing cloud metadata IPs
  is only a "last resort"; cloud metadata services are a prime SSRF credential
  target ([OWASP SSRF cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)).
  The existing repo avoids this class of bug by design — `api/library-file.js`
  resolves only IDs from the static catalog (`src/data/vca-materials.js`), never
  arbitrary URLs.

---

## 6. Zero-backend fallbacks (iframes) and their downsides

- **Notion**: publishing a page gives "anyone on the web" view access without a
  Notion account, on a `*.notion.site` domain, with "all of its subpages …
  published too"; Notion even offers an "Embed this page" snippet to paste into
  a website ([Notion public pages & web publishing](https://www.notion.com/help/public-pages-and-web-publishing)).
- **Google**: "Publish to web" similarly yields an embeddable/read-only
  version ([support.google.com/docs/answer/183965](https://support.google.com/docs/answer/183965)).

Downsides for VetMock specifically:

1. **CSP changes are required and deliberate.** `vercel.json` ships a strict
   `Content-Security-Policy` whose `frame-src` allowlist is currently
   `'self'`, YouTube, Google Identity and LINE — notion.site and
   docs.google.com are **not** framable today, and `connect-src` does not
   include `docs.google.com`, so even browser-side `fetch` of gviz/export URLs
   would be blocked by CSP in the app (`vercel.json` lines 45–46). Any embed
   path means widening production CSP.
2. **UX/brand breakage**: the Notion/Google chrome (sidebars, toolbars, their
   fonts) renders inside our shell; the Design System's typography and dark
   theme don't apply; mobile performance of iframe'd Notion is notoriously
   heavy.
3. **No offline story**: the PWA's offline contracts (service worker, cached
   chunks, retryable note imports in `src/data/note-corpus.js`) cannot reach
   into a cross-origin iframe.
4. **No access control or citation layer**: published pages can't be
   filtered by year/subject, counted by `npm run stats`, or validated by the
   lint gates.

Verdict: acceptable as a stop-gap "open in new tab" link; not acceptable as the
in-app reading experience.

---

## 7. Recommended architecture for VetMock

### Ingestion vs runtime — prefer ingestion into the existing corpus

The app's study content already has one delivery shape: authored data modules
(`src/data/notes-*.js`) loaded through the single lazy map `src/data/
note-corpus.js`, whose header says: "Keep NotesView, VetWiki runtime, and the
generated availability registry on this single map" (`src/data/note-corpus.js`).
Critical Rule 7 (AGENTS.md): "Notes have one browser loader map … never
recreate a loader map in a view."

So the highest-fit path for Notion/Docs/Sheets content is **owner-run
ingestion**: a script (or a one-off admin function) converts each source to
markdown, normalizes it into the notes section shape, and commits it as data —
same discipline as the video-transcript pipeline in AGENTS.md. Content then
gets the PWA cache, offline retry, VetWiki retrieval and citation treatment
for free, and stays lintable. Live per-request fetching is only worth building
if freshness must be minutes, not releases.

### If/when a runtime fetch is wanted: one proxy function

`api/content-source.js` (name TBD), modeled on the existing contracts:

- **Convention parity** with `api/wiki-explain.js` / `api/send-feedback.js`:
  origin-aware CORS via `allowedOrigin(req)` with the "reject only when Origin
  is present" iPad-Safari rule; `rateLimit(...)` per IP (Upstash-backed shared
  limiter in `api/_lib/rate-limit.js`); JSON error shape `{ error, reason?,
  hint? }`; `Cache-Control: private, no-store`; **503 with
  `reason: 'not_configured'`** when the token env var is absent, so the UI
  degrades honestly instead of breaking.
- **Strict host allowlist** (OWASP): the function accepts a *source key* (e.g.
  `notion:<pageId>`, `gdoc:<docId>`, `gsheet:<sheetId>`) — never a URL — and
  rebuilds the URL itself from fixed templates
  (`https://api.notion.com/v1/pages/<id>/markdown`,
  `https://docs.google.com/document/d/<id>/export?format=md` or Drive
  `files.export`, `https://docs.google.com/spreadsheets/d/<id>/gviz/tq?tqx=out:csv`).
  IDs are validated against a conservative format (Notion UUID, Google
  `[A-Za-z0-9_-]{20,}`) before interpolation. No redirect following.
- **Caching**: the wiki-explain pattern — content-hash key into Upstash KV
  (`kvGetJSON`/`kvSetJSON`) with a TTL, so a repeat open costs zero provider
  calls and keeps Notion's 3 rps comfortably irrelevant.
- **Env vars** (server-only Secrets): `NOTION_TOKEN` (only if Notion is used);
  optionally `GOOGLE_API_KEY` for Drive `files.export` on public/link-shared
  Google Docs. The public reader falls back to the zero-config path when the
  key is absent; a private document instead requires the student's own OAuth
  connection.
- **Render surface**: same as notes today — either ingest into the corpus, or
  a small reader view registered the established way: entry in `VIEW_TO_PATH`
  (`src/lib/view-route.js`), lazy export in `src/app/lazy-views.js` (which
  `tests/unit/boot-weight.test.mjs` holds to lazy-only), render branch in
  `src/App.jsx`, and a stable `/app/*` route that `vercel.json` already
  rewrites to the SPA.

### What NOT to build

- **No MCP server or MCP client in the product** — wrong layer for a website
  backend (Section 1) and duplicative of cuvetsmo-mcp by the no-duplication
  rule (AGENTS.md).
- **No second browser loader map** for external content (Critical Rule 7;
  `src/data/note-corpus.js` header).
- **No generic "fetch any URL" proxy** — that is the SSRF bug OWASP exists to
  prevent; allowlist or source-keys only.
- **No per-student Google OAuth** — the content is owner-authored study
  material, not the student's own Drive. A student-facing OAuth flow would add
  consent-screen/verification burden (sensitive scopes) for no product value
  ([Sheets scopes](https://developers.google.com/workspace/sheets/api/scopes)).
- **No knowledge-backend rebuild** — VetMock consumes sources; the governed
  knowledge layer stays as documented in `docs/PROJECT_KNOWLEDGE_BASE.md`
  ("Product boundary"; notes/VetWiki sections).

---

## 8. Security notes

1. **SSRF**: allowlist hosts (`api.notion.com`, `docs.google.com`,
   `www.googleapis.com`), rebuild URLs from templates, validate IDs with a
   strict pattern, disable redirect following, https only. "Deny-lists are
   bypass-prone. Prefer allow-lists" ([OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)).
2. **Token handling**: `NOTION_TOKEN` / `GOOGLE_API_KEY` only as Vercel
   **Secret** env vars (write-only after saving, encrypted at rest, per
   environment) read exclusively server-side in `api/*`
   ([Vercel env vars](https://vercel.com/docs/environment-variables)); never
   in `src/`, never `VITE_`-prefixed (repo convention in `api/_lib/r2.js`).
   No tokens or account IDs in this public repo — including in code, tests, or
   this document. Rotate via Vercel's rotation flow.
3. **Least privilege**: the Notion internal connection should have **read
   content capability only** (no write capabilities), and the shared-page set
   should contain only pages meant for students — the token can read exactly
   what is shared with the integration
   ([Notion getting started](https://developers.notion.com/docs/getting-started)).
   On the Google side prefer key+public-file or a service account limited to
   specific files, and the narrowest scope
   ([create credentials](https://developers.google.com/workspace/guides/create-credentials);
   [Sheets scopes](https://developers.google.com/workspace/sheets/api/scopes)).
4. **Private-content boundary**: default posture is **public/link-shared
   sources only**. The product must never fetch a private document on a
   student's behalf without that student's own authorization — and there is no
   product case for that here (students don't supply Drive/Notion content).
   Anything the owner links must already be published/link-shared or
   deliberately shared to the integration.
5. **Untrusted content in, validated content rendered**: external markdown is
   untrusted input. Follow the repo's import rule — validate before any setter
   renders/persists it, the way `src/lib/user-data-schema.js` gates imports
   (Valibot schemas, size caps, unsafe-key rejection). Render markdown through
   an escaped/sanitized pipeline; never `dangerouslySetInnerHTML` raw source
   text.
6. **CSP**: iframes of notion.site/docs.google.com require widening
   `frame-src` in `vercel.json`; treat that as a deliberate, reviewed change
   (current CSP at `vercel.json` lines 45–46, including
   `frame-ancestors 'none'` for our own pages).

---

## 9. Open questions for the owner

1. **Freshness vs offline**: is content allowed to land as committed data
   through an ingestion script (release-paced, offline-capable, lintable), or
   must edits appear live within minutes (then the KV-cached proxy function is
   needed too)?
2. **Where should it render**: into the existing Notes/VetWiki surfaces as new
   note sources (then `npm run regen:notes-registry` after editing
   `src/data/note-corpus.js`), or a separate reader view with its own
   `/app/*` route?
3. **Sharing posture per source**: which docs/sheets are already
   "Anyone with the link"; which Notion pages will be shared to a dedicated
   read-only integration? (Answer determines zero-config vs token per source.)
4. **Tables**: Sheets content — rendered as tables only, or also used to
   generate question cards? (Sheets as a *question-authoring* surface touches
   the question-intake standard and would need its own pass.)
5. **Undocumented endpoints**: acceptable for a shipped feature, or Google-docs
   paths only (Drive `files.export` + API key) even though it needs one env
   var?

---

## Sources

Primary documentation read for this note:

- MCP: https://modelcontextprotocol.io/docs/getting-started/intro ·
  https://modelcontextprotocol.io/docs/learn/architecture ·
  https://github.com/modelcontextprotocol/servers
- Notion: https://developers.notion.com/docs/mcp ·
  https://developers.notion.com/docs/getting-started ·
  https://developers.notion.com/reference/errors ·
  https://developers.notion.com/reference/request-limits ·
  https://developers.notion.com/reference/get-block-children ·
  https://developers.notion.com/reference/retrieve-page-markdown ·
  https://developers.notion.com/guides/data-apis/working-with-markdown-content ·
  https://github.com/makenotion/notion-mcp-server ·
  https://www.notion.com/help/public-pages-and-web-publishing
- Google: https://developers.google.com/workspace/drive/api/guides/configure-mcp-server ·
  https://developers.google.com/drive/api/guides/ref-export-formats ·
  https://developers.google.com/workspace/docs/api/auth ·
  https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/get ·
  https://developers.google.com/workspace/guides/create-credentials ·
  https://developers.google.com/chart/interactive/docs/spreadsheets ·
  https://developers.google.com/chart/interactive/docs/dev/implementing_data_source ·
  https://developers.google.com/workspace/sheets/api/scopes ·
  https://support.google.com/docs/answer/183965
- Vercel / security: https://vercel.com/docs/functions/limitations ·
  https://vercel.com/docs/environment-variables ·
  https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
- Community (explicitly non-primary, used only where marked): 
  https://github.com/souvikinator/notion-to-md/discussions/112

Repo paths cited: `AGENTS.md`, `docs/PROJECT_KNOWLEDGE_BASE.md`,
`src/data/note-corpus.js`, `src/lib/view-route.js`, `src/app/lazy-views.js`,
`src/App.jsx`, `src/lib/user-data-schema.js`, `api/_lib/llm.js`,
`api/_lib/rate-limit.js`, `api/_lib/r2.js`, `api/wiki-explain.js`,
`api/send-feedback.js`, `api/library-file.js`, `vercel.json`.

---

## Shipped deviations (2026-10-07, recorded after review)

The shipped reader (commit 25c47a48) deviates from this document in three
recorded ways, each deliberate:

1. **Pasted URLs, not source keys.** The recommended architecture had the
   function accepting only source keys, so no user input ever shapes an
   upstream request. The owner's ask was a paste-a-link feature for
   students, so the door is instead `normalizeExternalDocUrl` — an exact-host
   allowlist whose output is rebuilt from templates (the raw pasted string
   never reaches `fetch`), with the post-redirect landing host re-checked
   before any body is read. The SSRF property the source-key design was
   protecting still holds.
2. **The documented Google Drive export path now leads when configured.**
   `api/fetch-external-doc.js` calls `files.export` with `text/markdown` and
   the server-only `GOOGLE_API_KEY` before trying the undocumented public
   `/export` fallback. The fallback remains only so existing public links
   keep working until that optional key is provisioned; failure still degrades
   honestly to 422 `not_public`.
3. **Redirects are followed, then re-checked.** Rather than disabling
   redirect following (which would break the export endpoints' legitimate
   hops), every response's final URL must pass the same host check — Google
   answers are read only from `docs.google.com`, Notion answers only from
   `api.notion.com` — or the body is never read.

---

## Per-user OAuth (owner decision, 2026-10-07)

The owner then asked for the posture the open questions had left open: the
STUDENT connects their own Notion / Google account with OAuth 2.0, so the
reader can open the documents that account can read — private ones
included. This supersedes the "per-student Google OAuth — do not build"
line above for the reader feature.

Shaped like the rest of the app:

- `GET /api/external-connect/start?provider=` — signed-in students only;
  answers the provider consent URL and sets an HttpOnly state cookie
  scoped to this endpoint's path.
- `GET /api/external-connect/callback?provider=` — the query state must
  equal the start cookie (so one student cannot complete a consent that
  stores tokens under another student's account); exchanges the code;
  stores the tokens server-side; redirects back to
  `/app/external-docs?connected=…` or `?connect_error=…`.
- `POST /api/external-connect` — `{ action: 'status' | 'disconnect' }`.
  Status answers provider, display label, scope and expiry — token
  columns never leave the server.
- `api/fetch-external-doc.js` reads through the student's own connection
  when they have one (Google: Drive `files.export`, markdown or csv, one
  refresh on a stale token; Notion: their token against the markdown
  endpoint) and skips the shared answer cache entirely — one student's
  private document must never be served to another from a shared key.
  Without a connection, the public path and its cache apply as before.
- Tokens live in `public.external_connections`: RLS enabled with NO
  policies (every client role denied; only the service role inside Vercel
  functions touches rows), FK cascade on the account so the existing
  deletion flow cleans up. Migration:
  `supabase/migrations/20261007150000_external_connections.sql`.

Owner setup, once, before this goes live:

1. Google Cloud console → OAuth client (Web application) with redirect
   URI `https://vetmock.vercel.app/api/external-connect/callback?provider=google`;
   scopes openid, email, drive.readonly. Set `GOOGLE_OAUTH_CLIENT_ID` +
   `GOOGLE_OAUTH_CLIENT_SECRET` on Vercel.
2. Notion → new public integration with redirect URI
   `https://vetmock.vercel.app/api/external-connect/callback?provider=notion`
   and read-content capability only. Set `NOTION_OAUTH_CLIENT_ID` +
   `NOTION_OAUTH_CLIENT_SECRET` on Vercel.
3. Apply the migration on the provider once. `EXTERNAL_OAUTH_STATE_SECRET`
   is optional — state signing falls back to the service role key.

A provider whose variable pair is missing answers 503 `not_configured`;
the reader keeps working for public links and for whichever provider IS
configured.
