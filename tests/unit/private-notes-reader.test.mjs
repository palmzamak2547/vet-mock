import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, findAll, textOf, settle } from '../helpers/fake-react.mjs';
import * as dialogs from '../../src/lib/dialog.js';

test('private-note reader keeps latest intent and visible admitted mutation outcomes', async () => {
  const previousRpc = globalThis.__privateReaderRpc, previousDialogs = globalThis.__privateReaderDialogs;
  let panel, host;
  globalThis.__privateReaderDialogs = dialogs;
  try {
    const stubs = [
      { match: '/lib/admin-api\\.js$', contents: 'export const adminRpc=(...args)=>globalThis.__privateReaderRpc(...args);' },
      { match: '/lib/dialog\\.js$', contents: 'export const {registerDialogHost,confirmDialog,alertDialog,promptDialog}=globalThis.__privateReaderDialogs;' },
      { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences=()=>({reduced:true});' },
      { match: '\\.css$', contents: '' },
    ];
    const { default: PrivateNotes } = await loadModule('src/components/PrivateNotes.jsx', { stubs });
    const { default: DialogHost } = await loadModule('src/components/DialogHost.jsx', { stubs });
    for (const scenario of ['latest success', 'latest error', 'latest busy', 'ABA', 'close', 'reader unmount',
      'upload normal', 'upload preserves B', 'upload failure', 'upload unmount', 'delete normal', 'delete preserves B', 'delete pending A', 'delete failure', 'delete cancel']) {
      let list = [{ slug: 'fixture-a', title: 'Reader A', parts: 1 }, { slug: 'fixture-b', title: 'Reader B', parts: 1 }];
      const reads = [], mutations = [];
      let catalogs = 0;
      globalThis.__privateReaderRpc = (name, args) => {
        if (name === 'admin_private_notes') { catalogs++; return Promise.resolve(list); }
        let response;
        const promise = new Promise((resolve, reject) => { response = { name, args, resolve, reject }; });
        if (name === 'admin_private_note') reads.push(response);
        else { assert.ok(['admin_private_note_put', 'admin_private_note_delete'].includes(name)); mutations.push(response); }
        return promise.then(value => {
          if (name === 'admin_private_note_delete') list = list.filter(row => row.slug !== args.note_slug);
          if (name === 'admin_private_note_put') list = [...list, { slug: args.note_slug, title: args.note_title, parts: 1 }];
          return value;
        });
      };
      host = mount(DialogHost, { owner: 'modeled-admin', scope: 'admin' });
      panel = mount(PrivateNotes); await settle(panel, 1);
      const open = title => findAll(panel.tree, node => node.type === 'button'
        && findAll(node, child => child.type === 'b' && textOf(child) === title).length)[0].props.onClick();
      const payload = (slug, stem) => ({ slug, parts: [{ part: 1, section: slug,
        questions: [{ n: 1, type: 'FIB', stem, answer: 'Owned fixture' }] }] });
      const finishRead = async (index, stem) => { reads[index].resolve(payload(reads[index].args.note_slug, stem)); await settle(panel, 1); };
      const document = () => textOf(findAll(panel.tree, node => node.props.className === 'ad-pn-doc')[0]);
      const filter = () => findAll(panel.tree, node => node.props['aria-label'] === 'ค้นในบันทึก')[0];
      if (['latest success', 'latest error', 'latest busy', 'ABA'].includes(scenario)) {
        const first = open('Reader A'); panel.flush();
        const second = open('Reader B'); panel.flush();
        if (scenario === 'ABA') {
          const third = open('Reader A'); panel.flush(); await finishRead(2, 'Newest A');
          await finishRead(1, 'Old B'); await finishRead(0, 'Old A'); await Promise.all([first, second, third]);
          assert.match(document(), /Newest A/); assert.doesNotMatch(document(), /Old [AB]/);
        } else if (scenario === 'latest busy') {
          await finishRead(0, 'Old A');
          assert.match(textOf(panel.tree), /กำลังเปิด fixture-b/, 'old finally must not clear newer reader progress');
          await finishRead(1, 'Current B'); await Promise.all([first, second]);
        } else {
          await finishRead(1, 'Current B');
          filter().props.onChange({ target: { value: 'Current B' } }); panel.flush();
          if (scenario === 'latest error') { reads[0].reject(new Error('Old reader failed')); await settle(panel, 1); }
          else await finishRead(0, 'Old A');
          await Promise.all([first, second]);
          assert.match(document(), /Current B/, `${scenario}: older reader must not replace B`);
          assert.equal(filter().props.value, 'Current B');
          assert.doesNotMatch(textOf(panel.tree), /Old reader failed/);
        }
      } else if (scenario === 'close') {
        const readingB = open('Reader B'); panel.flush(); await finishRead(0, 'Current B'); await readingB;
        const oldA = open('Reader A'); panel.flush();
        await open('Reader B'); panel.flush(); assert.equal(document(), '');
        await finishRead(1, 'Old A'); await oldA;
        assert.equal(document(), '', 'a close intent must invalidate the older pending reader');
        assert.doesNotMatch(textOf(panel.tree), /กำลังเปิด/);
      } else if (scenario === 'reader unmount') {
        const pending = open('Reader A'); panel.flush(); panel.unmount();
        reads[0].resolve(payload('fixture-a', 'Closed reader')); await pending;
        assert.equal(reads.length, 1); assert.equal(mutations.length, 0);
      } else if (scenario.startsWith('upload')) {
        const input = findAll(panel.tree, node => node.type === 'input' && node.props.type === 'file')[0];
        const key = { slug: 'fixture-upload', title: 'Uploaded note', questions: [{ n: 1, type: 'FIB', stem: 'Imported fixture', answer: 'Owned fixture' }] };
        const pending = input.props.onChange({ target: { files: [{ name: 'owned-fixture.json', text: async () => JSON.stringify(key) }], value: 'selected' } });
        await settle(panel, 1); assert.equal(mutations.length, 1);
        assert.equal(mutations[0].name, 'admin_private_note_put');
        if (scenario === 'upload unmount') panel.unmount();
        if (scenario === 'upload preserves B' || scenario === 'upload failure') {
          const reading = open('Reader B'); panel.flush(); await finishRead(0, 'Current B'); await reading;
          filter().props.onChange({ target: { value: 'Current B' } }); panel.flush();
          assert.match(textOf(panel.tree), /กำลังอัปโหลด 1\/1/, 'reader finally cannot hide admitted upload progress');
        }
        if (scenario === 'upload failure') mutations[0].reject(new Error('Upload refused'));
        else mutations[0].resolve(true);
        await settle(panel, 1);
        if (scenario === 'upload normal') {
          assert.equal(reads[0].args.note_slug, 'fixture-upload'); await finishRead(0, 'Uploaded current');
        }
        await pending; panel.flush();
        if (scenario === 'upload normal') assert.match(document(), /Uploaded current/);
        if (scenario === 'upload preserves B') {
          assert.match(document(), /Current B/); assert.equal(reads.length, 1); assert.equal(filter().props.value, 'Current B');
        }
        if (scenario === 'upload failure') {
          assert.match(textOf(panel.tree), /Upload refused/);
          const reading = open('Reader A'); panel.flush();
          assert.match(textOf(panel.tree), /Upload refused/, 'new reader must not dismiss the actual mutation failure');
          await finishRead(1, 'Current A'); await reading;
        } else assert.equal(catalogs, 2, 'accepted upload/catalog refresh continues despite newer reader or unmount');
        if (scenario === 'upload unmount') assert.equal(reads.length, 0, 'retired upload cannot auto-open a new reader');
      } else if (scenario.startsWith('delete')) {
        let pendingRead;
        if (scenario !== 'delete preserves B' && scenario !== 'delete failure') {
          pendingRead = open('Reader A'); panel.flush();
          if (scenario !== 'delete pending A') { await finishRead(0, 'Current A'); await pendingRead; }
        }
        const deleting = findAll(panel.tree, node => node.props['aria-label'] === 'ลบ Reader A')[0].props.onClick(); host.flush();
        host.tree.props[scenario === 'delete cancel' ? 'onCancel' : 'onConfirm']();
        await settle(panel, 1); host.flush();
        if (scenario === 'delete cancel') { await deleting; assert.equal(mutations.length, 0); assert.match(document(), /Current A/); }
        else {
          assert.equal(mutations[0].name, 'admin_private_note_delete'); assert.equal(mutations[0].args.note_slug, 'fixture-a');
          if (scenario === 'delete preserves B' || scenario === 'delete failure') {
            const reading = open('Reader B'); panel.flush(); await finishRead(0, 'Current B'); await reading;
            assert.match(textOf(panel.tree), /กำลังลบ fixture-a/, 'reader finally cannot hide admitted delete progress');
          }
          if (scenario === 'delete failure') mutations[0].reject(new Error('Delete refused'));
          else mutations[0].resolve(true);
          await deleting; panel.flush();
          if (scenario === 'delete preserves B' || scenario === 'delete failure') assert.match(document(), /Current B/);
          if (scenario === 'delete pending A') { await finishRead(0, 'Deleted old A'); await pendingRead; assert.equal(document(), ''); }
          if (scenario === 'delete normal') assert.equal(document(), '');
          if (scenario === 'delete failure') assert.match(textOf(panel.tree), /Delete refused/);
          else assert.equal(catalogs, 2);
        }
      }
      if (!panel.dead) panel.unmount(); host.unmount(); panel = null; host = null;
    }
  } finally {
    if (panel && !panel.dead) panel.unmount(); host?.unmount();
    if (previousRpc === undefined) delete globalThis.__privateReaderRpc; else globalThis.__privateReaderRpc = previousRpc;
    if (previousDialogs === undefined) delete globalThis.__privateReaderDialogs; else globalThis.__privateReaderDialogs = previousDialogs;
  }
});
