// The environment contract: every variable the code reads, in one list.
//
// This list is the source. `node scripts/env-contract.mjs --write` turns it
// into .env.example (names and comments, never a value) and docs/ENV.md (with
// the files that read each name, found by scripts/lib/env-scan.mjs).
// `npm run lint:env` fails when the code reads a name this list lacks, when
// this list holds a name nothing reads, or when either file is stale.
//
// need: 'required' — production breaks without it (the effect says how);
//       'optional' — a feature turns off or a default applies.
// Values live in Vercel (project settings), Supabase (edge function secrets),
// GitHub Actions or a local .env.local; never in this repository.

/** Set by the platform or the tools, never by us: documented, not in .env.example. */
export const PLATFORM = [
  ['CI', 'set by GitHub Actions; Playwright and a few scripts switch to CI mode'],
  ['GITHUB_ACTIONS', 'set by GitHub Actions; the SQL harnesses refuse native Postgres without it'],
  ['GITHUB_STEP_SUMMARY', 'set by GitHub Actions; perf and e2e duration reports append to it'],
  ['NODE_ENV', 'set by Node tooling and Vercel; production makes the rate limiter require Upstash'],
  ['PATH', 'the system search path; scripts/video-asr.py adds its CUDA folder'],
  ['VERCEL_ENV', 'set by Vercel; production makes the rate limiter and the Chula gate fail closed'],
  ['VERCEL_GIT_COMMIT_SHA', 'set by Vercel builds; vite.config.js writes it into the vmx-build meta tag'],
  ['DEV', 'set by Vite (import.meta.env) in the dev server'],
  ['MODE', 'set by Vite (import.meta.env): development or production'],
  ['PROD', 'set by Vite (import.meta.env) in a production build'],
];

/** @type {Array<{ name: string, group: string, need: 'required' | 'optional', does: string }>} */
export const ENV = [
  // ── Browser build (Vercel project vetmock; read at build time by Vite) ──
  { name: 'VITE_SUPABASE_URL', group: 'Supabase', need: 'required', does: 'Supabase project URL, in the browser build and the functions. Without it nothing signs in or saves to an account.' },
  { name: 'VITE_SUPABASE_ANON_KEY', group: 'Supabase', need: 'required', does: 'Supabase anon (public) key, in the browser build and the functions. Without it nothing signs in or saves to an account.' },
  { name: 'VITE_GOOGLE_CLIENT_ID', group: 'Sign-in', need: 'required', does: 'Google OAuth web client id (public). Without it Google\'s own button and One Tap do not show. A new origin must be added to the client first (origin_mismatch otherwise).' },
  { name: 'VITE_LINE_LIFF_ID', group: 'Sign-in', need: 'optional', does: 'LINE LIFF app id (public). Without it the LINE sign-in button is hidden. The LIFF endpoint must be the site URL, and line-auth needs LINE_CHANNEL_ID.' },
  { name: 'VITE_LIBRARY_CDN_BASE', group: 'Library', need: 'optional', does: 'Public CDN origin of R2 library files (absolute https, no trailing slash). Without it no CDN link is built and files open through signed links. A new host also needs connect-src in vercel.json and CORS on the bucket.' },

  // ── Supabase and the app backend (functions) ──
  { name: 'SUPABASE_URL', group: 'Supabase', need: 'optional', does: 'Supabase URL for functions and scripts; the functions fall back to VITE_SUPABASE_URL.' },
  { name: 'SUPABASE_ANON_KEY', group: 'Supabase', need: 'optional', does: 'Anon key for functions and the delete-account edge function; the functions fall back to VITE_SUPABASE_ANON_KEY.' },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', group: 'Supabase', need: 'required', does: 'Service-role key (secret) for functions, the edge functions and ingest scripts. Without it feedback quotas, external connections and account deletion fail.' },
  { name: 'SUPABASE_ACCESS_TOKEN', group: 'Supabase', need: 'optional', does: 'Management API token (secret) for owner scripts (library audits, links, auth emails, provenance). Scripts only.' },
  { name: 'VETMOCK_RPC_SIGNING_KEY', group: 'Supabase', need: 'required', does: 'Signs the functions\' calls to the database (secret). Without it exam results, race rooms and error reports are not saved.' },
  { name: 'LINE_CHANNEL_ID', group: 'Sign-in', need: 'optional', does: 'LINE Login channel id, a secret of the line-auth edge function. Without it LINE sign-in fails.' },
  { name: 'NOTION_OAUTH_CLIENT_ID', group: 'External documents', need: 'optional', does: 'Notion OAuth client id. Without it and its secret the Notion connect button stays hidden; delete-account also uses it to revoke a grant.' },
  { name: 'NOTION_OAUTH_CLIENT_SECRET', group: 'External documents', need: 'optional', does: 'Notion OAuth client secret (secret). See NOTION_OAUTH_CLIENT_ID.' },
  { name: 'GOOGLE_OAUTH_CLIENT_ID', group: 'External documents', need: 'optional', does: 'Google OAuth client for Drive (drive.file). Without it and its secret the Drive connect button stays hidden.' },
  { name: 'GOOGLE_OAUTH_CLIENT_SECRET', group: 'External documents', need: 'optional', does: 'Google OAuth client secret (secret). See GOOGLE_OAUTH_CLIENT_ID.' },
  { name: 'GOOGLE_PICKER_API_KEY', group: 'External documents', need: 'optional', does: 'Google Picker developer key. Without it the Drive picker does not open.' },
  { name: 'GOOGLE_API_KEY', group: 'External documents', need: 'optional', does: 'Google API key for public Docs and Sheets exports. Without it a pasted public Google document cannot be read.' },
  { name: 'NOTION_TOKEN', group: 'External documents', need: 'optional', does: 'Notion integration token (secret) for pages shared with it. Without it only connected accounts read Notion.' },
  { name: 'EXTERNAL_OAUTH_STATE_SECRET', group: 'External documents', need: 'optional', does: 'Signs the OAuth state of external connections (secret); falls back to a key derived from SUPABASE_SERVICE_ROLE_KEY.' },

  // ── Rate limits ──
  { name: 'UPSTASH_REDIS_REST_URL', group: 'Rate limits', need: 'required', does: 'Upstash Redis REST URL, the shared limiter. In production every limited endpoint answers unavailable without it; locally an in-memory limiter is used.' },
  { name: 'UPSTASH_REDIS_REST_TOKEN', group: 'Rate limits', need: 'required', does: 'Upstash Redis REST token (secret). See UPSTASH_REDIS_REST_URL.' },

  // ── AI (study coach, grading, VetMock AI, handwriting) ──
  { name: 'DEEPSEEK_API_KEY', group: 'AI', need: 'required', does: 'DeepSeek key (secret), the first model of every chain. Without it and ANTHROPIC_API_KEY the AI features are off; without it alone everything runs on Anthropic. Scripts use it too.' },
  { name: 'ANTHROPIC_API_KEY', group: 'AI', need: 'optional', does: 'Anthropic key (secret), the fallback model. Without it a DeepSeek outage leaves the AI with no fallback.' },
  { name: 'LLM_MODEL', group: 'AI', need: 'optional', does: 'Overrides the primary DeepSeek model id; also the video-summary script\'s model.' },
  { name: 'LLM_VISION_MODEL', group: 'AI', need: 'optional', does: 'Overrides the DeepSeek model for image reading.' },
  { name: 'AI_GRADER_MODEL', group: 'AI', need: 'optional', does: 'Overrides the Anthropic model id. Set it when the default is retired (/app/admin says so).' },
  { name: 'AI_VISION_MODEL', group: 'AI', need: 'optional', does: 'Overrides the Anthropic model for image reading.' },
  { name: 'AI_CHAT_DAILY_CAP', group: 'AI', need: 'optional', does: 'VetMock AI questions a day across all students; default 2,500.' },
  { name: 'NCBI_API_KEY', group: 'AI', need: 'optional', does: 'NCBI key for PubMed lookups in VetMock AI; without it the lower anonymous rate applies.' },
  { name: 'HANDWRITING_PROVIDER', group: 'AI', need: 'optional', does: 'deepseek puts DeepSeek first for handwriting transcription; default Anthropic first.' },
  { name: 'HANDWRITING_MODEL', group: 'AI', need: 'optional', does: 'Pins one model id for handwriting transcription.' },

  // ── Voice (VetMock AI voice call, Mochi voice, read-aloud, microphone) ──
  { name: 'ELEVENLABS_API_KEY', group: 'Voice', need: 'optional', does: 'ElevenLabs key (secret) for the voice call, the agent script and recorded clips. Without it the call button says voice is unavailable.' },
  { name: 'ELEVENLABS_VOICE_AGENT_ID', group: 'Voice', need: 'optional', does: 'The ElevenLabs agent the voice call opens (written by scripts/ai-voice-agent.mjs). Without it the call is unavailable.' },
  { name: 'AI_VOICE_OFF', group: 'Voice', need: 'optional', does: '1 closes the voice call and says so (the switch in docs/HANDOVER.md).' },
  { name: 'AI_VOICE_FLOOR_CREDITS', group: 'Voice', need: 'optional', does: 'ElevenLabs credits never spent by the call (the account is shared); default 50,000.' },
  { name: 'AI_VOICE_CREDITS_PER_MINUTE', group: 'Voice', need: 'optional', does: 'Credits a call minute is budgeted at; default 600.' },
  { name: 'AI_VOICE_SESSION_SECONDS', group: 'Voice', need: 'optional', does: 'Longest call; default 300.' },
  { name: 'AI_VOICE_USER_SESSIONS', group: 'Voice', need: 'optional', does: 'Calls a student a Bangkok day; default 4.' },
  { name: 'AI_VOICE_MAX_CONCURRENT', group: 'Voice', need: 'optional', does: 'Calls at once; default 4.' },
  { name: 'GEMINI_API_KEY', group: 'Voice', need: 'optional', does: 'Gemini key (secret) for Mochi\'s live voice. Without it that feature stays closed.' },
  { name: 'MOCHI_VOICE_OPEN', group: 'Voice', need: 'optional', does: '1 opens Mochi\'s voice to students; default closed.' },
  { name: 'MOCHI_VOICE_MONTHLY_USD', group: 'Voice', need: 'optional', does: 'Monthly spend cap for Mochi\'s voice.' },
  { name: 'MOCHI_VOICE_SESSION_MINUTES', group: 'Voice', need: 'optional', does: 'Longest Mochi voice session in minutes; default 10, at most 14.' },
  { name: 'MOCHI_VOICE_USER_SESSIONS', group: 'Voice', need: 'optional', does: 'Mochi voice sessions a student a month.' },
  { name: 'IAPP_API_KEY', group: 'Voice', need: 'optional', does: 'iApp key (secret) for Thai speech and transcription. Without it Thai read-aloud uses Edge and the microphone needs Workers AI.' },
  { name: 'CF_AI_TOKEN', group: 'Voice', need: 'optional', does: 'Cloudflare token with Workers AI (secret) for Whisper transcription. Without it and IAPP_API_KEY, browsers without Web Speech show no microphone.' },
  { name: 'CF_AI_ACCOUNT_ID', group: 'Voice', need: 'optional', does: 'Account for Workers AI; falls back to R2_ACCOUNT_ID, then CF_ACCOUNT_ID.' },
  { name: 'OPENROUTER_API_KEY', group: 'Voice', need: 'optional', does: 'OpenRouter key for the Gemini clip generation in scripts/tts-clips.mjs. Scripts only.' },
  { name: 'TTS_KEYS_ENV', group: 'Voice', need: 'optional', does: 'Path of a local env file scripts/tts-clips.mjs reads keys from. Scripts only.' },

  // ── Library, R2 and answer evidence ──
  { name: 'CLOUDFLARE_API_TOKEN', group: 'Library', need: 'required', does: 'Cloudflare token (secret) for R2 temporary credentials; also keys library links and open tickets. Without it library files do not open.' },
  { name: 'R2_ACCOUNT_ID', group: 'Library', need: 'required', does: 'Cloudflare account id of the R2 buckets. Without it library files do not open.' },
  { name: 'CF_ACCOUNT_ID', group: 'Library', need: 'optional', does: 'Same account id under an older name; read when R2_ACCOUNT_ID is unset.' },
  { name: 'R2_ACCESS_KEY_ID', group: 'Library', need: 'optional', does: 'Permanent R2 key id; when set with R2_SECRET_ACCESS_KEY it is used instead of temporary credentials.' },
  { name: 'R2_SECRET_ACCESS_KEY', group: 'Library', need: 'optional', does: 'Permanent R2 secret (secret). See R2_ACCESS_KEY_ID.' },
  { name: 'R2_BUCKET', group: 'Library', need: 'optional', does: 'Default bucket when a row names none; default vetmock-library. Scripts read it too.' },
  { name: 'LIBRARY_BLOB_SECRET', group: 'Library', need: 'optional', does: 'Signs library links and open tickets when CLOUDFLARE_API_TOKEN is unset (secret).' },
  { name: 'LIBRARY_CDN_BASE', group: 'Library', need: 'optional', does: 'CDN origin scripts/upload-library-doc.mjs prints links under. Scripts only.' },
  { name: 'EVIDENCE_BASE', group: 'Library', need: 'required', does: 'The slides.vetmock.com folder of answer-evidence images. Without it the slide under an answer shows its title only.' },

  // ── Feedback mail ──
  { name: 'RESEND_API_KEY', group: 'Feedback', need: 'required', does: 'Resend key (secret). Without it the feedback page cannot send mail.' },
  { name: 'FEEDBACK_EMAIL', group: 'Feedback', need: 'optional', does: 'Where feedback mail goes; default the owner\'s address.' },
  { name: 'FEEDBACK_FROM', group: 'Feedback', need: 'optional', does: 'Sender of feedback mail; default onboarding@resend.dev, which reaches only the Resend account owner.' },
  { name: 'FEEDBACK_HASH_KEY', group: 'Feedback', need: 'optional', does: 'Keys the hashed sender in feedback quotas (secret); default derived from RESEND_API_KEY.' },

  // ── Video library ──
  { name: 'YOUTUBE_API_KEY', group: 'Video', need: 'optional', does: 'YouTube Data API key for /api/playlist and the channel inventory script; without it the playlist is read from the public page.' },
  { name: 'VIDEO_AI_BUDGET_CNY', group: 'Video scripts', need: 'optional', does: 'DeepSeek spend at which the video pipeline stops. Scripts only.' },
  { name: 'VIDEO_ASR_MODEL', group: 'Video scripts', need: 'optional', does: 'Speech model folder for scripts/video-asr.py. Scripts only.' },
  { name: 'VIDEO_BATCH', group: 'Video scripts', need: 'optional', does: 'File of video ids one registry run adds. Scripts only.' },
  { name: 'VIDEO_CACHE_DIR', group: 'Video scripts', need: 'optional', does: 'Transcript and media cache folder; default data-cache/. Scripts only.' },
  { name: 'VIDEO_DATA_DIR', group: 'Video scripts', need: 'optional', does: 'Video data root outside the checkout. Scripts only.' },
  { name: 'VIDEO_HEAVY_LOCK', group: 'Video scripts', need: 'optional', does: 'Lock file the media download takes. Scripts only.' },
  { name: 'VIDEO_MIN_FREE_GB', group: 'Video scripts', need: 'optional', does: 'Free disk the media download keeps; default 20. Scripts only.' },
  { name: 'VIDEO_RATE', group: 'Video scripts', need: 'optional', does: 'Download rate cap in yt-dlp syntax. Scripts only.' },
  { name: 'VIDEO_REGISTRY_ALL', group: 'Video scripts', need: 'optional', does: '1 lists every video, not only this batch. Scripts only.' },
  { name: 'VIDEO_SKIP_MIN', group: 'Video scripts', need: 'optional', does: 'Shortest stretch the player may skip, in seconds; default 20. Scripts only.' },

  // ── Content and research scripts ──
  { name: 'VMX_EVIDENCE_DATA', group: 'Content scripts', need: 'optional', does: 'Answer-evidence data root outside the checkout. Scripts only.' },
  { name: 'VMX_EVIDENCE_FLOOR_CNY', group: 'Content scripts', need: 'optional', does: 'DeepSeek balance the evidence build keeps; default 40. Scripts only.' },
  { name: 'VMX_EVIDENCE_FOLDER', group: 'Content scripts', need: 'optional', does: 'Evidence image folder (the grant); default read from the data root. Scripts only.' },
  { name: 'VMX_EVIDENCE_POINTER', group: 'Content scripts', need: 'optional', does: 'Model that points at slide lines. Scripts only.' },
  { name: 'VMX_EVIDENCE_READER', group: 'Content scripts', need: 'optional', does: 'Model that reads those lines without the key. Scripts only.' },
  { name: 'VMX_PROVENANCE_DATA', group: 'Content scripts', need: 'optional', does: 'Provenance data root outside the checkout. Scripts only.' },
  { name: 'VMX_PROBE_TOKEN', group: 'Content scripts', need: 'optional', does: 'Access token scripts/probe-api-latency.mjs signs in with. Scripts only.' },
  { name: 'VETMOCK_ORIGIN', group: 'Content scripts', need: 'optional', does: 'Origin the prerendered wiki and covers link to; default https://vetmock.com. Build scripts.' },
  { name: 'VETMOCK_INSTRUCTOR_VAULT', group: 'Content scripts', need: 'optional', does: 'Notes vault the instructor profile script reads. Scripts only.' },
  { name: 'VETMOCK_RESEARCH_CONTACT', group: 'Content scripts', need: 'optional', does: 'Contact address sent to the scholarly APIs the faculty scripts call. Scripts only.' },
  { name: 'CONSENSUS_API_KEY', group: 'Content scripts', need: 'optional', does: 'Consensus key for the faculty expansion script. Scripts only.' },
  { name: 'FACULTY_THROTTLE_MS', group: 'Content scripts', need: 'optional', does: 'Pause between faculty lookups; default 400. Scripts only.' },
  { name: 'VETWIKI_SOURCES_OFFLINE', group: 'Content scripts', need: 'optional', does: '1 skips the network in verify:sources. Scripts only.' },
  { name: 'BACKFILL_WRITE', group: 'Content scripts', need: 'optional', does: '1 is --write for scripts/backfill-wiki-hashes.mjs. Scripts only.' },
  { name: 'CHECK_ONLY', group: 'Content scripts', need: 'optional', does: '1 is --check for scripts/regen-video-meta.mjs. Scripts only.' },

  // ── Tests, gate and local tools ──
  { name: 'PLAYWRIGHT_BASE_URL', group: 'Tests', need: 'optional', does: 'Runs the e2e suite against another origin (test:e2e:prod uses vetmock.com).' },
  { name: 'PLAYWRIGHT_PORT', group: 'Tests', need: 'optional', does: 'Port of the e2e server; scope it to e2e only.' },
  { name: 'PLAYWRIGHT_OUTPUT_DIR', group: 'Tests', need: 'optional', does: 'Where Playwright writes results; default test-results.' },
  { name: 'PLAYWRIGHT_JSON_OUTPUT_FILE', group: 'Tests', need: 'optional', does: 'Where CI writes the JSON e2e report; default e2e-results.json.' },
  { name: 'PLAYWRIGHT_CHROMIUM', group: 'Tests', need: 'optional', does: 'A Chromium binary for the VCA specs and image scripts.' },
  { name: 'PERF_BUDGET_CPU', group: 'Tests', need: 'optional', does: 'CPU slowdown for the perf budget spec.' },
  { name: 'UPDATE_PERF_BUDGETS', group: 'Tests', need: 'optional', does: '1 rewrites perf-budgets.json from a fresh measurement.' },
  { name: 'PGLITE_MODULE', group: 'Tests', need: 'optional', does: 'Path of the pglite module the SQL harnesses load.' },
  { name: 'PG_CONTAINER', group: 'Tests', need: 'optional', does: 'Postgres service container the SQL harnesses use in CI.' },
  { name: 'PG_MODULE', group: 'Tests', need: 'optional', does: 'Path of the pg module the VCA community harness loads.' },
  { name: 'PGHOST', group: 'Tests', need: 'optional', does: 'Postgres socket folder for the VCA community harness.' },
  { name: 'PGUSER', group: 'Tests', need: 'optional', does: 'Postgres user for the VCA community harness; default postgres.' },
  { name: 'VMX_GATE_LOCK', group: 'Tests', need: 'optional', does: 'Moves the local gate\'s e2e lock file.' },
  { name: 'VMX_ROUTE_SWEEP', group: 'Tests', need: 'optional', does: 'Set to 1 by test:e2e:sweep to run the route sweep, which every other run leaves out.' },
  { name: 'VCA_BUILD_QUIET', group: 'Tests', need: 'optional', does: '1 is --quiet for vca/scripts/build-bank.mjs.' },
  { name: 'VCA_E2E_PORT', group: 'Tests', need: 'optional', does: 'Port of the VCA e2e server.' },
  { name: 'RESEARCH_BASE_URL', group: 'Tests', need: 'optional', does: 'Runs the Research e2e against another origin.' },
  { name: 'RESEARCH_E2E_PORT', group: 'Tests', need: 'optional', does: 'Port of the Research e2e server.' },
  { name: 'RS_SHOTS', group: 'Tests', need: 'optional', does: '1 saves full-page pictures of Research\'s key screens.' },
  { name: 'RSCRIPT', group: 'Tests', need: 'optional', does: 'Rscript binary for the native R parity run; default Rscript.' },
  { name: 'WEBR_RUNNER_DIR', group: 'Tests', need: 'optional', does: 'Folder of the webR runner for R parity.' },
  { name: 'CHROME', group: 'Tests', need: 'optional', does: 'Chrome binary for Research\'s OG image render.' },
  { name: 'CPU', group: 'VCA perf scripts', need: 'optional', does: 'CPU slowdown for the VCA perf scripts.' },
  { name: 'DESK', group: 'VCA perf scripts', need: 'optional', does: '1 measures CLS at a desk viewport.' },
  { name: 'ENGINE', group: 'VCA perf scripts', need: 'optional', does: 'chromium or webkit for the VCA journeys; default chromium.' },
  { name: 'HEADED', group: 'VCA perf scripts', need: 'optional', does: '1 shows the browser while measuring.' },
  { name: 'HEADLESS', group: 'VCA perf scripts', need: 'optional', does: '1 runs Chromium headless in the journeys.' },
  { name: 'ONLY', group: 'VCA perf scripts', need: 'optional', does: 'Comma list of journeys to run.' },
  { name: 'PATHS', group: 'VCA perf scripts', need: 'optional', does: 'Comma list of routes the journey audit opens.' },
  { name: 'RUNS', group: 'VCA perf scripts', need: 'optional', does: 'Runs per journey; the median is kept; default 3.' },
  { name: 'SCROLL', group: 'VCA perf scripts', need: 'optional', does: '1 scrolls the page while measuring CLS.' },
  { name: 'THEMES', group: 'VCA perf scripts', need: 'optional', does: 'Comma list of themes the journey audit uses; default light,dark.' },
  { name: 'WIDTH', group: 'VCA perf scripts', need: 'optional', does: 'Viewport width for the journeys; default 390.' },
  { name: 'WIDTHS', group: 'VCA perf scripts', need: 'optional', does: 'Comma list of widths the journey audit uses.' },
];
