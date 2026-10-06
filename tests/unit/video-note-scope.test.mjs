import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';
import * as dialogs from '../../src/lib/dialog.js';
import { addNote, loadNotes } from '../../src/lib/video-notes.js';

const A = 'WRttiWQ7D9s', B = 'j44XnjxUPFI';
const rows = panel => findAll(panel.tree, node => node.props.title === 'คลิกเพื่อแก้ไข').map(textOf);
const button = (panel, label) => findAll(panel.tree, node => node.type === 'button' && textOf(node) === label)[0];
const textarea = (panel, label) => findAll(panel.tree, node => node.type === 'textarea' && node.props['aria-label'] === label)[0];

test('video-note deletion belongs to its live resource; current decisions and drafts still work', async () => {
  const previous = { window: globalThis.window, localStorage: globalThis.localStorage, dialogs: globalThis.__videoNoteDialogs };
  const mounted = [];
  globalThis.__videoNoteDialogs = dialogs;
  try {
    const stubs = [
      { match: '/lib/dialog\\.js$', contents: 'export const {registerDialogHost,confirmDialog,alertDialog,promptDialog}=globalThis.__videoNoteDialogs;' },
      { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences=()=>({reduced:true});' },
      { match: '\\.css$', contents: '' },
    ];
    const { default: DialogHost } = await loadModule('src/components/DialogHost.jsx', { stubs });
    const { default: VideoNotePanel } = await loadModule('src/components/VideoNotePanel.jsx', { stubs });
    function fixture() {
      const values = new Map(), writes = [];
      const storage = { getItem: key => values.get(key) ?? null,
        setItem(key, value) { writes.push(key); if (state.refuse) throw new Error('QuotaExceededError'); values.set(key, String(value)); },
        removeItem: key => values.delete(key) };
      const state = { values, writes, refuse: false };
      globalThis.localStorage = storage;
      globalThis.window = { localStorage: storage, addEventListener() {}, removeEventListener() {}, dispatchEvent() {} };
      addNote(A, 0, 'A remove'); const retained = addNote(A, 5, 'A retained');
      addNote(B, 0, 'B first'); const other = addNote(B, 5, 'B correct');
      assert.equal(retained.id, other.id, 'real per-video note IDs collide');
      state.raw = storage.getItem('vmx-video-notes');
      writes.length = 0;
      const host = mount(DialogHost, { owner: null, scope: 'videos' });
      const panel = mount(VideoNotePanel, { videoId: A, playerRef: { current: null }, currentTime: 12 });
      mounted.push(host, panel);
      return { ...state, host, panel, state };
    }
    function request({ panel, host }) {
      const pending = findAll(panel.tree, node => node.type === 'button' && node.props['aria-label'] === 'ลบโน้ต')[0].props.onClick();
      host.flush();
      assert.equal(host.tree.props.title, 'ลบโน้ตนี้?');
      return pending;
    }
    const compose = panel => { button(panel, '+ จด ณ เวลานี้').props.onClick(); panel.flush(); textarea(panel, 'โน้ต ณ เวลานี้').props.onChange({ target: { value: 'Current draft' } }); panel.flush(); };
    const edit = (panel, text) => { findAll(panel.tree, node => node.props.title === 'คลิกเพื่อแก้ไข' && textOf(node) === text)[0].props.onClick(); panel.flush(); };

    for (const scenario of ['B compose', 'B edit', 'ABA', 'unmount']) {
      const f = fixture(), pending = request(f);
      if (scenario === 'unmount') { f.panel.unmount(); f.state.refuse = true; }
      else {
        f.panel.update({ videoId: B });
        if (scenario === 'ABA') f.panel.update({ videoId: A });
        if (scenario === 'B edit') {
          edit(f.panel, 'B correct');
          textarea(f.panel, 'แก้ไขโน้ตที่ 00:05').props.onChange({ target: { value: 'Current edit' } });
          f.panel.flush();
        } else compose(f.panel);
      }
      f.host.tree.props.onConfirm();
      await pending; f.host.flush(); f.panel.flush();
      assert.deepEqual(f.writes, [], `${scenario}: a retired acceptance must attempt zero storage writes; displayed=${JSON.stringify(rows(f.panel))}`);
      assert.equal(f.values.get('vmx-video-notes'), f.raw, `${scenario}: both real buckets must stay byte-for-byte intact`);
      assert.equal(f.host.tree, null, `${scenario}: no late failure notice`);
      if (scenario !== 'unmount') {
        const active = scenario === 'ABA' ? A : B;
        assert.deepEqual(rows(f.panel), loadNotes(active).filter(n => scenario !== 'B edit' || n.text !== 'B correct').map(n => n.text));
        assert.equal(textarea(f.panel, scenario === 'B edit' ? 'แก้ไขโน้ตที่ 00:05' : 'โน้ต ณ เวลานี้').props.value,
          scenario === 'B edit' ? 'Current edit' : 'Current draft', `${scenario}: current draft stays open and unchanged`);
      }
      if (scenario !== 'unmount') f.panel.unmount();
      f.host.unmount();
    }
    for (const accepted of [false, true]) {
      const f = fixture(), pending = request(f);
      f.host.tree.props[accepted ? 'onConfirm' : 'onCancel']();
      await pending; f.host.flush(); f.panel.flush();
      assert.deepEqual(loadNotes(A).map(n => n.text), accepted ? ['A retained'] : ['A remove', 'A retained']);
      assert.deepEqual(loadNotes(B).map(n => n.text), ['B first', 'B correct']);
      assert.equal(f.writes.length, accepted ? 1 : 0);
      assert.deepEqual(rows(f.panel), loadNotes(A).map(n => n.text));
      f.panel.unmount(); f.host.unmount();
    }
    const failed = fixture(), failedDecision = request(failed);
    failed.state.refuse = true;
    failed.host.tree.props.onConfirm(); await failedDecision; failed.host.flush(); failed.panel.flush();
    assert.equal(failed.values.get('vmx-video-notes'), failed.raw);
    assert.equal(failed.writes.length, 1);
    assert.equal(failed.host.tree.props.title, 'ลบโน้ตไม่สำเร็จ กรุณาลองใหม่');
    failed.host.tree.props.onConfirm(); failed.host.flush();
    failed.state.refuse = false;
    compose(failed.panel); button(failed.panel, 'บันทึก').props.onClick(); failed.panel.flush();
    assert.deepEqual(loadNotes(A).map(n => [n.t, n.text]), [[0, 'A remove'], [5, 'A retained'], [12, 'Current draft']]);
    edit(failed.panel, 'A retained');
    textarea(failed.panel, 'แก้ไขโน้ตที่ 00:05').props.onChange({ target: { value: 'Edited current note' } }); failed.panel.flush();
    textarea(failed.panel, 'แก้ไขโน้ตที่ 00:05').props.onBlur(); failed.panel.flush();
    assert.equal(loadNotes(A)[1].text, 'Edited current note');
    assert.deepEqual(loadNotes(B).map(n => n.text), ['B first', 'B correct']);
    assert.deepEqual(rows(failed.panel), loadNotes(A).map(n => n.text));
  } finally {
    for (const instance of mounted) if (!instance.dead) instance.unmount();
    for (const [key, value] of Object.entries({ window: previous.window, localStorage: previous.localStorage, __videoNoteDialogs: previous.dialogs })) {
      if (value === undefined) delete globalThis[key]; else globalThis[key] = value;
    }
  }
});
