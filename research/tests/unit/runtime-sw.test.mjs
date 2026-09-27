// The research origin's own service worker (M1-DESIGN.md 12; competitor-gaps.md D4(d)): static files
// only, no skipWaiting, no other origins, placeholders always replaced; registration only on https or
// localhost and never in development. OWNER: runtime role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { precacheList, renderServiceWorker, researchServiceWorker } from '../../build/sw-plugin.mjs';
import { registerServiceWorker } from '../../src/lib/runtime/sw-register.js';

const template = readFileSync(fileURLToPath(new URL('../../src/sw/sw-template.js', import.meta.url)), 'utf8');

test('precache list: index.html first, sorted, no sw.js, no source maps, forward slashes', () => {
  const urls = precacheList(['assets/b.js', 'sw.js', 'index.html', 'assets/a.js.map', 'fonts\\sarabun-400.woff2', 'assets/a.js', 'assets/a.js']);
  assert.deepEqual(urls, ['/index.html', '/assets/a.js', '/assets/b.js', '/fonts/sarabun-400.woff2']);
});

test('rendering replaces both placeholders and the version follows the list and the template', () => {
  const a = renderServiceWorker(template, ['/index.html', '/assets/a.js']);
  const b = renderServiceWorker(template, ['/index.html', '/assets/b.js']);
  assert.ok(!a.code.includes('__RS_'));
  assert.ok(a.code.includes('const PRECACHE = ["/index.html","/assets/a.js"]'));
  assert.match(a.version, /^[0-9a-f]{12}$/);
  assert.notEqual(a.version, b.version);
  assert.equal(renderServiceWorker(template, ['/assets/a.js', '/index.html']).version, a.version, 'order of the input does not change the version');
  assert.throws(() => renderServiceWorker('self.__RS_PRECACHE__; self.__RS_PRECACHE__; self.__RS_SW_VERSION__', []), /placeholder survived/);
});

test('the worker template never takes over an open page and never touches other origins or POST', () => {
  const code = template.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.ok(!/skipWaiting|clients\.claim/.test(code));
  assert.ok(/request\.method !== 'GET'\) return/.test(code));
  assert.ok(/url\.origin !== self\.location\.origin\) return/.test(code));
  assert.ok(!/indexedDB/i.test(code));
});

test('registration: skipped in development and on plain http, registered on https and localhost', async () => {
  const calls = [];
  const nav = { serviceWorker: { register: async (url, opts) => { calls.push([url, opts.scope]); } } };
  assert.equal(await registerServiceWorker({ dev: true, navigator: nav, location: { protocol: 'https:', hostname: 'research.vetmock.com' } }), 'skipped');
  assert.equal(await registerServiceWorker({ dev: false, navigator: nav, location: { protocol: 'http:', hostname: '192.168.1.5' } }), 'skipped');
  assert.equal(await registerServiceWorker({ dev: false, navigator: {}, location: { protocol: 'https:', hostname: 'x' } }), 'unsupported');
  assert.equal(await registerServiceWorker({ dev: false, navigator: nav, location: { protocol: 'https:', hostname: 'research.vetmock.com' } }), 'registered');
  assert.equal(await registerServiceWorker({ dev: false, navigator: nav, location: { protocol: 'http:', hostname: 'localhost' } }), 'registered');
  assert.deepEqual(calls[0], ['/sw.js', '/']);
  const failing = { serviceWorker: { register: async () => { throw new Error('no'); } } };
  assert.equal(await registerServiceWorker({ dev: false, navigator: failing, location: { protocol: 'https:', hostname: 'x' } }), 'failed');
});

test('the emitted worker precaches the offline shell and install files even when the bundle has no index.html yet', () => {
  // Vite's HTML plugin can emit index.html after this plugin's generateBundle runs; the shell must
  // still be in the list, or an offline reload of /app fails (found by research-offline.spec.js).
  const plugin = researchServiceWorker();
  let emitted = null;
  plugin.generateBundle.call({ emitFile: (f) => { emitted = f; } }, {}, { 'assets/index-abc.js': {}, 'assets/Workspace-def.js': {} });
  assert.ok(emitted && emitted.fileName === 'sw.js');
  const list = JSON.parse(emitted.source.match(/const PRECACHE = (\[.*?\]);/)[1]);
  assert.equal(list[0], '/index.html');
  for (const f of ['/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png', '/fonts/sarabun-400.woff2']) assert.ok(list.includes(f), f);
});
