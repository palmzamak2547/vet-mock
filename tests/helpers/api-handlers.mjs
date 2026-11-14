// The Vercel functions: every .js file directly in api/ is one handler (api/_lib holds shared code).
// Tests that must cover every endpoint read the folder through this, so a new endpoint is in their
// list the moment its file exists.
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const API_DIR = fileURLToPath(new URL('../../api/', import.meta.url));

/** Handler names without the extension, sorted: ['agent-action', 'ai-chat', ...]. */
export function apiHandlerNames() {
  return readdirSync(API_DIR, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.js'))
    .map((e) => e.name.slice(0, -3))
    .sort();
}
