// The ports the local e2e preview and its neighbours listen on, shared by playwright.config.js,
// scripts/gate.mjs, scripts/audit-contrast.mjs and the specs that build origins of their own
// (origin-move.spec.js), so they can never disagree again: on 18 Oct the config moved and that
// spec kept the old port, and all 96 of its runs failed.
//
// Each checkout gets its own ports, derived from its path: on 20 Oct six worktrees on one machine
// all used 24731 and a second gate failed at once with "port already used". The base falls in
// 25000-25999 (FNV-1a of the lowercased path); the concurrent gl step adds 1000 and the contrast
// audit 2000, so all three stay below every OS's ephemeral range (Linux 32768-60999, Windows and
// macOS 49152-65535), where an outgoing connection can be handed any port: on 17 Oct one held
// 41732 just as CI started a preview. Two paths can hash alike (about 1 in 1000 per pair); the
// strict port then fails loudly and PLAYWRIGHT_PORT names another.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function e2ePorts(root) {
  let h = 0x811c9dc5;
  for (const c of path.resolve(root).toLowerCase().replaceAll('\\', '/')) {
    h = Math.imul(h ^ c.charCodeAt(0), 0x01000193) >>> 0;
  }
  const base = 25000 + (h % 1000);
  return { local: base, concurrent: base + 1000, contrast: base + 2000 };
}

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const PORTS = e2ePorts(REPO_ROOT);
export const LOCAL_E2E_PORT = Number(process.env.PLAYWRIGHT_PORT || PORTS.local);
