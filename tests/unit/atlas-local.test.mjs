import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { atlasLocalPlugin } from '../../scripts/atlas-local-plugin.mjs';

test('production builds never read or embed workstation specimen metadata', () => {
  const root = mkdtempSync(join(tmpdir(), 'vetmock-atlas-local-'));
  try {
    writeFileSync(join(root, 'catalog.json'), 'not even valid JSON');
    const plugin = atlasLocalPlugin(root);
    assert.equal(plugin.config({}, { command: 'build' }).define.__ATLAS_LOCAL_SPECIMENS__, '[]');
    assert.equal(plugin.config({}, { command: 'serve', isPreview: true }).define.__ATLAS_LOCAL_SPECIMENS__, '[]');
  } finally { rmSync(root, { recursive: true }); }
});

test('local asset routes only serve manifest-declared basenames', () => {
  const root = mkdtempSync(join(tmpdir(), 'vetmock-atlas-local-'));
  try {
    const url = '/atlas/local-test-123456789abc.glb';
    writeFileSync(join(root, 'local-test-123456789abc.glb'), 'test');
    writeFileSync(join(root, 'catalog.json'), JSON.stringify([{ profiles: { quick: { model: url } } }]));
    const plugin = atlasLocalPlugin(root);
    plugin.config({}, { command: 'serve' });
    let middleware;
    plugin.configureServer({ middlewares: { use: fn => { middleware = fn; } } });
    let next = 0;
    middleware({ url: '/atlas/../../catalog.json', method: 'GET' }, {}, () => { next++; });
    middleware({ url: '/atlas/unlisted.json', method: 'GET' }, {}, () => { next++; });
    assert.equal(next, 2);
    const headers = {};
    let ended = false;
    middleware({ url, method: 'HEAD' }, { setHeader: (k, v) => { headers[k] = v; }, end: () => { ended = true; } }, () => assert.fail('Declared asset should be served'));
    assert.equal(headers['Content-Length'], 4);
    assert.equal(headers['Cache-Control'], 'no-store');
    assert.equal(ended, true);
    writeFileSync(join(root, 'catalog.json'), JSON.stringify([{ poster: '/atlas/../secret.json' }]));
    assert.throws(() => atlasLocalPlugin(root).config({}, { command: 'serve' }), /Invalid local Atlas asset path/);
  } finally { rmSync(root, { recursive: true }); }
});
