// Open before sign-in while the Chula wall is on: the public front door and
// the privacy terms a student reads before agreeing (docs/CHULA-SIGNIN.md).
// App.jsx gates every other view on it, and the sitemap lists no /app screen
// outside it (scripts/lib/sitemap.mjs).
export const GATE_PUBLIC_VIEWS = new Set(['landing', 'privacy']);
