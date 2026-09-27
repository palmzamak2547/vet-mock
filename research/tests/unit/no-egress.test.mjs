// Nothing about the student's data leaves the device in M1 (M1-DESIGN.md 9.8). Static scan of every
// source file: no network API outside the two allowed places, no Supabase import outside lib/auth,
// no import of the main app's network modules. The e2e spec research-network-silence adds the
// runtime check. OWNER: runtime role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../src/', import.meta.url));

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(m?js|jsx)$/.test(name)) out.push(p);
  }
  return out;
}

const rel = (p) => path.relative(root, p).split(path.sep).join('/');
const files = walk(root);

// Network APIs. The service worker template may fetch same-origin static files; lib/auth may reach
// Supabase Auth (sign-in only; never data).
const NETWORK = /\b(fetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|importScripts\s*\()/;
const NETWORK_ALLOWED = new Set(['sw/sw-template.js']);

test('no network API outside the service worker template', () => {
  for (const f of files) {
    const r = rel(f);
    if (NETWORK_ALLOWED.has(r) || r.startsWith('lib/auth/')) continue;
    const src = readFileSync(f, 'utf8').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    assert.ok(!NETWORK.test(src), `${r} uses a network API`);
  }
});

test('Supabase is imported only by lib/auth', () => {
  for (const f of files) {
    const r = rel(f);
    if (r.startsWith('lib/auth/')) continue;
    const src = readFileSync(f, 'utf8');
    assert.ok(!/from\s+['"]@supabase\//.test(src) && !/import\(\s*['"]@supabase\//.test(src), `${r} imports Supabase`);
  }
});

test('no import of the main app network or sync modules', () => {
  const forbidden = /(src\/lib\/(supabase|api|feedback-client|study-coach|user-data-sync|local-extras)|src\/lib\/tts)/;
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    const imports = [...src.matchAll(/(?:from\s+|import\(\s*)['"]([^'"]+)['"]/g)].map((m) => m[1]);
    for (const spec of imports) {
      const resolved = spec.startsWith('.') ? path.resolve(path.dirname(f), spec).split(path.sep).join('/') : spec;
      assert.ok(!forbidden.test(resolved) && !/^@vetmock\/lib\/(supabase|api|feedback-client|study-coach|user-data-sync|local-extras|tts)/.test(spec), `${rel(f)} imports ${spec}`);
    }
  }
});

test('the only localStorage key is vmx-research-prefs-v1 and nothing calls localStorage.clear', () => {
  for (const f of files) {
    const src = readFileSync(f, 'utf8').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    assert.ok(!/localStorage\.clear\s*\(/.test(src), `${rel(f)} calls localStorage.clear`);
    if (/localStorage/.test(src)) assert.equal(rel(f), 'lib/store/prefs.js', `${rel(f)} touches localStorage`);
  }
});
