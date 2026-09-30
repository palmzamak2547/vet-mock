import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { parse } from '@babel/parser';

const source = readFileSync(new URL('../../src/components/DailyQShareCard.jsx', import.meta.url), 'utf8');
const component = parse(source, { sourceType: 'module', plugins: ['jsx'] }).program.body.find(n => n.type === 'ExportDefaultDeclaration').declaration;
const wanted = new Set(['ensureBlob', 'ensureImage', 'handleSwitchToImage', 'handleNativeShare']);
const handlers = component.body.body.filter(n => n.type === 'FunctionDeclaration' && wanted.has(n.id.name));

test('Daily Q image preview and repeated native shares send the same PNG', async () => {
  const png = new Blob(['daily-q-png'], { type: 'image/png' });
  const calls = [];
  let builds = 0;
  const context = vm.createContext({
    busy: false, imgUrl: null, imgUrlRef: { current: null }, imgBlobRef: { current: null },
    history: [], streak: 0, todayDate: '2026-09-30', todayStatus: 'correct', shareText: 'daily q',
    Blob, File, URL: { createObjectURL: () => 'blob:preview' },
    buildShareImage: async () => { builds++; return png; },
    navigator: { canShare: () => true, share: async payload => calls.push(payload) },
    setBusy(value) { context.busy = value; },
    setImgUrl(value) { context.imgUrl = value; },
    setMode(value) { context.mode = value; },
    flash() {}, copyText: async () => ({ ok: true }),
  });
  vm.runInContext(handlers.map(n => source.slice(n.start, n.end)).join('\n'), context);
  await context.handleSwitchToImage();
  assert.equal(context.mode, 'image');
  assert.equal(context.imgUrl, 'blob:preview');
  await context.handleNativeShare();
  await context.handleNativeShare();
  assert.equal(calls.length, 2);
  for (const payload of calls) {
    assert.equal(payload.files?.length, 1, 'native sharing must retain the preview PNG');
    assert.equal(payload.files[0].type, 'image/png');
    assert.equal(await payload.files[0].text(), 'daily-q-png');
  }
  assert.equal(builds, 1, 'preview and repeated shares reuse the image');
  assert.equal(context.busy, false);
});
