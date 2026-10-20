import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

import { APP_PATH_ALIASES, isUnknownAppPath, viewForAppPath } from '../../src/lib/view-route.js';
import { viewTitle, NAV_ITEMS } from '../../src/lib/nav.js';

test('unknown /app/* paths are named so Home can say so; known ones and aliases are not', () => {
  assert.equal(isUnknownAppPath('/app/zzz'), true);
  assert.equal(isUnknownAppPath('/app/not-a-feature/'), true);
  assert.equal(isUnknownAppPath('/app'), false, 'the bare /app door is not a wrong address');
  assert.equal(isUnknownAppPath('/app/'), false);
  assert.equal(isUnknownAppPath('/app/videos'), false);
  assert.equal(isUnknownAppPath('/wiki/com5/rabies'), false);
  assert.equal(isUnknownAppPath('/'), false);
  for (const path of Object.keys(APP_PATH_ALIASES)) {
    assert.equal(isUnknownAppPath(path), false, `${path} is a legacy alias on purpose`);
    assert.ok(viewForAppPath(path));
  }
});

test('every routed view has a page title; home has none (it restores the base title)', () => {
  assert.equal(viewTitle('home'), null);
  assert.equal(viewTitle('videos'), 'คลิปย้อนหลัง');
  assert.equal(viewTitle('profile'), 'โปรไฟล์');
  assert.equal(viewTitle('privacy') != null, true);
  for (const item of NAV_ITEMS) if (item.id !== 'home') assert.ok(viewTitle(item.id), item.id);
  // VetWiki and the atlas set their own titles; the app must not overwrite them.
  assert.equal(viewTitle('knowledge'), null);
  assert.equal(viewTitle('atlas'), null);
});

test('the rail overflow row reveals the rest in place instead of opening search', () => {
  const src = readFileSync(new URL('../../src/components/Sidebar.jsx', import.meta.url), 'utf8');
  const more = src.slice(src.indexOf('vmx-sidebar-more') - 200, src.indexOf('vmx-sidebar-count') + 200);
  assert.doesNotMatch(more, /setPaletteOpen\(true\)/);
  assert.match(src, /aria-expanded/);
});

test('profile has one row for the review queue', () => {
  const src = readFileSync(new URL('../../src/views/ProfileView.jsx', import.meta.url), 'utf8');
  assert.equal((src.match(/setView\('sr-session'\)/g) || []).length, 1);
});
