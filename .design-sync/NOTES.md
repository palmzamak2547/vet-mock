# VetMock (vet-mock-exam) design-sync — NOTES

## ⛔ Upload gated on a design-scoped claude.ai login
Same gate as all apps (DesignSync needs `/login` design scopes, unavailable in the Claude Desktop-spawned session). See `reference_design-sync-needs-login` memory. Upload from an interactive `claude` terminal: create_project "VetMock Design System" → finalize_plan localDir ./ds-bundle → write_files.

## ⚠️ MUST SLIM before upload — bundle is 7.1 MB (> 5 MB hard upload limit)
`[FILE_OVER_5MB]`: `_ds_bundle.js` is 7.1 MB, 55 inlined npm packages. The claude.ai/design upload rejects files > 5 MB. **Next session: trim the entry.** Start by excluding heavy components from `gen-entry` args, rebuild, recheck size:
- `PdfThumbnailSidebar` (pdfjs) — definitely heavy
- likely also: `ImageAnnotator`, `ImageOcclusionEditor`, `DiagramLabelDrill`, `OSCEDrill`, `VideoNotePanel`, `TermLinkedRichText`, `SmartGrader`, `TemplateLibrary`, `CommandPalette`
- Many of these floor-card anyway (live data / editors) → dropping them loses little and is the fastest path under 5 MB.
- After trimming, `node .ds-sync/package-build.mjs … && node .ds-sync/package-validate.mjs ./ds-bundle` and confirm no `[FILE_OVER_5MB]`.

## JSX project (no TypeScript)
- `.d.ts` contracts are minimal (ts-morph allowJs, no real types). `[BUNDLE_EXPORT] 49/49 not a component` + `exported PascalCase symbols: 0` are **no-types enumeration artifacts**, NOT breakage — the render check shows 48/49 mount and 18 render real content, so `window.VetMock.*` works. The app's self-check reads the real bundle on upload.
- Plain CSS (converted from a JS stylesheet); cssEntry = `dist/assets/index-CX9ovixr.css`. No tsconfig needed.

## gen-entry.mjs was FIXED here (canonical copy)
The committed webcuvetsmo/johnjud `gen-entry.mjs` only stripped `.tsx?`, so `.jsx` files with anonymous/class default exports produced an invalid name like `ErrorBoundary.jsx` → esbuild syntax error. The fixed version (this repo's `.design-sync/gen-entry.mjs`) strips `.[tj]sx?`, detects `export default class`, and falls back to the filename for any default form. **Propagate this fixed copy to the other repos' `.design-sync/gen-entry.mjs` next session.**

## Component landscape (49 in bundle)
- 18 render from defaults; 31 floor cards; `ImageOcclusionCard` has a caught in-cell render error.
- Name quirks: `Question.jsx` exports `QuestionComponent`; `TopLoadingBar.jsx` exports both `TopLoadingBar` + `ViewFallback`.
- Filter used: excluded components importing `useTranslation|supabase|createClient|useAuth`.

## Render check needs playwright
Installed `playwright@1.60.0` into `.ds-sync` (cached chromium-1224, `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`).

## State this session
Config + curated entry + conventions done; build works but NEEDS SLIMMING (7MB) before it can upload. No previews authored yet.
