import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount } from '../helpers/fake-react.mjs';

test('dialog replacement and retirement cancel pending decisions; accepted decisions stay accepted', async () => {
  const { DialogHost, confirmDialog, promptDialog, alertDialog } = await loadModule('tests/helpers/dialog-host-entry.js', {
    stubs: [{ match: '/components/ConfirmDialog\\.jsx$', contents: 'export default props => ({ type: "div", props });' }],
  });
  for (const renderBetween of [false, true]) {
    const host = mount(DialogHost);
    const prompt = promptDialog({ title: 'Tag' });
    if (renderBetween) host.flush();
    const confirm = confirmDialog({ title: 'Delete?' });
    host.flush();
    assert.equal(await prompt, null);
    host.tree.props.onCancel();
    assert.equal(await confirm, false);
    host.unmount();
  }
  for (const [open, expected] of [[confirmDialog, false], [promptDialog, null], [alertDialog, true]]) {
    const host = mount(DialogHost);
    const decision = open({ title: 'Pending' });
    host.flush();
    const staleConfirm = host.tree.props.onConfirm;
    host.unmount();
    staleConfirm('stale');
    assert.equal(await decision, expected);
  }
  const host = mount(DialogHost);
  const old = confirmDialog({ title: 'Old' });
  host.flush();
  const oldConfirm = host.tree.props.onConfirm;
  const current = promptDialog({ title: 'Current' });
  oldConfirm();
  host.flush();
  assert.equal(await old, false);
  assert.equal(host.tree.props.title, 'Current');
  host.tree.props.onConfirm('tag');
  host.unmount();
  assert.equal(await current, 'tag');
  const active = mount(DialogHost);
  const accepted = confirmDialog({ title: 'Accepted' });
  active.flush();
  active.tree.props.onConfirm();
  active.unmount();
  assert.equal(await accepted, true);
  const unrendered = mount(DialogHost);
  const pending = confirmDialog({ title: 'Before render' });
  unrendered.unmount();
  assert.equal(await pending, false);
  const scoped = mount(DialogHost, { owner: 'a', scope: 'pinboard' });
  for (const next of [{ scope: 'home' }, { owner: 'b' }]) {
    const retired = confirmDialog({ title: 'Retired' });
    scoped.flush();
    scoped.update(next);
    assert.equal(await retired, false);
    assert.equal(scoped.tree, null);
  }
  const sameScope = confirmDialog({ title: 'Still current' });
  scoped.flush();
  scoped.update({ owner: 'b', scope: 'home' });
  assert.equal(scoped.tree.props.title, 'Still current');
  scoped.tree.props.onConfirm();
  assert.equal(await sameScope, true);
  let noticeSettled = false;
  const notice = alertDialog({ title: 'Navigation result' }).then(value => { noticeSettled = true; return value; });
  scoped.flush();
  scoped.update({ scope: 'library' });
  await Promise.resolve();
  assert.equal(noticeSettled, false);
  assert.equal(scoped.tree.props.title, 'Navigation result');
  scoped.update({ owner: 'c' });
  assert.equal(await notice, true);
  assert.equal(scoped.tree, null);
  scoped.unmount();
});
