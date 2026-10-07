import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from '@babel/parser';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';
import * as dialogs from '../../src/lib/dialog.js';
import { QB_ENGPROF } from '../../src/data/questions-engprof.js';

test('passage loading and pending clear preserve each resource and valid current decisions', async () => {
  const previous = { window: globalThis.window, localStorage: globalThis.localStorage, dialogs: globalThis.__passageScopeDialogs };
  const source = readFileSync(new URL('../../src/components/SmartPassage.jsx', import.meta.url), 'utf8');
  const hashNode = parse(source, { sourceType: 'module', plugins: ['jsx'] }).program.body
    .find(node => node.type === 'FunctionDeclaration' && node.id.name === 'hashPassage');
  const hashPassage = new Function(`return (${source.slice(hashNode.start, hashNode.end)});`)();
  const A = QB_ENGPROF.find(q => q.passage), B = QB_ENGPROF.find(q => q.passage && q.passage !== A.passage);
  const keyA = `vmx-pass-${hashPassage(A.passage)}`, keyB = `vmx-pass-${hashPassage(B.passage)}`;
  globalThis.__passageScopeDialogs = dialogs;
  let host, panel;
  try {
    const stubs = [
      { match: '/lib/dialog\\.js$', contents: 'export const {registerDialogHost,confirmDialog,alertDialog,promptDialog}=globalThis.__passageScopeDialogs;' },
      { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences=()=>({reduced:true});' },
      { match: '\\.css$', contents: '' },
    ];
    const { default: DialogHost } = await loadModule('src/components/DialogHost.jsx', { stubs });
    const { default: SmartPassage } = await loadModule('src/components/SmartPassage.jsx', { stubs });
    for (const scenario of ['mount refused', 'swap refused', 'read failed', 'parse failed', 'stale B', 'stale ABA', 'unmount', 'cancel', 'accept', 'same passage']) {
      const values = new Map(), writes = [];
      let refuseSet = scenario === 'mount refused', failGet = null, readFailed = false;
      for (const [key, label, color] of [[keyA, 'A', '#1a1a1a'], [keyB, 'B', '#1e6fc7']]) {
        values.set(`${key}-hl`, JSON.stringify([{ id: label, start: 0, end: 8, color: 'yellow' }]));
        values.set(`${key}-dr`, JSON.stringify([{ color, width: 2, points: [[0, 0, 0.5], [10, 10, 0.5]] }]));
      }
      const saved = Object.fromEntries(values);
      globalThis.localStorage = {
        getItem(key) { if (key === failGet) { readFailed = true; throw new Error('Unreadable storage'); } return values.get(key) ?? null; },
        setItem(key, value) { writes.push({ action: 'set', key }); if (refuseSet) throw new Error('QuotaExceededError'); values.set(key, String(value)); },
        removeItem(key) { writes.push({ action: 'remove', key }); values.delete(key); },
      };
      globalThis.window = { localStorage, addEventListener() {}, removeEventListener() {}, dispatchEvent() {} };
      host = mount(DialogHost, { owner: null, scope: 'exam' });
      panel = mount(SmartPassage, { text: A.passage, title: A.passage_title });
      assert.deepEqual(Object.fromEntries(values), saved, `${scenario}: mount must preserve both raw buckets even when restore writes fail`);
      assert.equal(findAll(panel.tree, node => node.type === 'mark').length, 1);
      if (scenario === 'swap refused') {
        findAll(panel.tree, node => node.type === 'mark')[0].props.onClick({ stopPropagation() {} }); panel.flush();
        findAll(panel.tree, node => node.type === 'button' && node.props.title === 'ยกเลิกเส้นล่าสุด')[0].props.onClick(); panel.flush();
        assert.equal(values.has(`${keyA}-hl`), false);
        assert.equal(values.has(`${keyA}-dr`), false);
        refuseSet = true; writes.length = 0;
        const before = Object.fromEntries(values);
        panel.update({ text: B.passage, title: B.passage_title });
        assert.deepEqual(Object.fromEntries(values), before, 'empty A must not delete loaded B before denied restoration');
        assert.deepEqual(writes.filter(write => write.action === 'remove'), []);
        assert.equal(findAll(panel.tree, node => node.type === 'mark').length, 1);
      } else if (scenario === 'read failed' || scenario === 'parse failed') {
        if (scenario === 'read failed') failGet = `${keyB}-dr`;
        else values.set(`${keyB}-dr`, '{');
        const before = Object.fromEntries(values); writes.length = 0;
        panel.update({ text: B.passage, title: B.passage_title });
        assert.deepEqual(Object.fromEntries(values), before, `${scenario}: retain both original raw values`);
        assert.deepEqual(writes, [], `${scenario}: a partial read must not admit persistence`);
        assert.equal(findAll(panel.tree, node => node.type === 'mark').length, 0, 'partial highlight read must not be committed');
        if (scenario === 'read failed') assert.equal(readFailed, true);
        failGet = null; values.set(`${keyB}-dr`, saved[`${keyB}-dr`]);
        const beforeReturn = Object.fromEntries(values); writes.length = 0;
        panel.update({ text: A.passage, title: A.passage_title });
        assert.deepEqual(Object.fromEntries(values), beforeReturn, 'failed B latch must not admit old empty state on return to A');
        assert.deepEqual(writes.filter(write => write.action === 'remove'), []);
        assert.equal(textOf(findAll(panel.tree, node => node.type === 'mark')[0]), A.passage.slice(0, 8));
      } else if (scenario !== 'mount refused') {
        const pending = findAll(panel.tree, node => node.type === 'button' && node.props.title === 'ลบทั้งหมด')[0].props.onClick();
        host.flush(); assert.equal(host.tree.props.title, 'ล้าง highlight ทั้งหมด?');
        if (scenario === 'stale B' || scenario === 'stale ABA') panel.update({ text: B.passage, title: B.passage_title });
        if (scenario === 'stale ABA') panel.update({ text: A.passage, title: A.passage_title });
        if (scenario === 'unmount') panel.unmount();
        // A new question sharing the same text is still the same resource.
        if (scenario === 'same passage') panel.update({ title: 'Next question, same passage' });
        const before = Object.fromEntries(values); writes.length = 0;
        host.tree.props[scenario === 'cancel' ? 'onCancel' : 'onConfirm']();
        await pending; host.flush(); panel.flush();
        if (scenario === 'accept' || scenario === 'same passage') {
          assert.equal(values.has(`${keyA}-hl`), false);
          assert.equal(values.has(`${keyA}-dr`), false);
          assert.equal(values.get(`${keyB}-hl`), saved[`${keyB}-hl`]);
          assert.equal(values.get(`${keyB}-dr`), saved[`${keyB}-dr`]);
          assert.equal(findAll(panel.tree, node => node.type === 'mark').length, 0);
        } else {
          assert.deepEqual(writes, [], `${scenario}: retired or cancelled clear must attempt no persistence`);
          assert.deepEqual(Object.fromEntries(values), before, `${scenario}: both resource buckets stay identical`);
          if (scenario !== 'unmount') {
            const current = scenario === 'stale B' ? B : A;
            assert.equal(textOf(findAll(panel.tree, node => node.type === 'mark')[0]), current.passage.slice(0, 8));
            assert.equal(findAll(panel.tree, node => node.type === 'button' && node.props.title === 'ยกเลิกเส้นล่าสุด')[0].props.disabled, false);
          }
        }
        assert.equal(host.tree, null);
      }
      if (!panel.dead) panel.unmount(); host.unmount(); panel = null; host = null;
    }
  } finally {
    if (panel && !panel.dead) panel.unmount(); host?.unmount();
    for (const [key, value] of Object.entries({ window: previous.window, localStorage: previous.localStorage, __passageScopeDialogs: previous.dialogs })) {
      if (value === undefined) delete globalThis[key]; else globalThis[key] = value;
    }
  }
});
