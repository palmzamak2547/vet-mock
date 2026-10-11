// ============================================================
// The study buddy: one pick, the same buddy on every screen
// ============================================================
// Palm's review of 5.141.6: "Mochi เปลี่ยนไม่ได้มีแบบเดียว". A buddy picked in
// Pomodoro stayed in Pomodoro; the Home card always said Mochi and the Mochi
// page's 3D view always opened on Moocha. lib/buddy.js is the one roster and
// the one answer to "who is my buddy"; hooks/useBuddy.js keeps a screen live.
//
// What these pin:
// - The roster is Mochi first, then every clinic mascot from art.js, each with
//   a name, a picture and a Thai alt text.
// - No pick means Mochi; a stored id that names nobody is no pick at all; an
//   unknown id is never stored.
// - Every buddy has a way to be drawn in 3D: a GLB that exists, or Mochi's
//   own model.
// - Results and Home ask the same module and agree with the pick.
// - The 3D probe answers once and releases its context.
// - useBuddy follows a pick made elsewhere, in this tab or another.

import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { mount, loadModule, repoRoot } from '../helpers/fake-react.mjs';

const store = new Map();
const listeners = {};
const fired = [];
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};
globalThis.window = globalThis;
globalThis.addEventListener = (t, f) => { (listeners[t] ||= []).push(f); };
globalThis.removeEventListener = (t, f) => { listeners[t] = (listeners[t] || []).filter((x) => x !== f); };
globalThis.dispatchEvent = (e) => { fired.push(e.type); for (const f of listeners[e.type] || []) f(e); return true; };
if (typeof globalThis.Event === 'undefined') globalThis.Event = class { constructor(type) { this.type = type; } };

const buddy = await import('../../src/lib/buddy.js');
const { SQUAD_MASCOTS, SUBJECT_MOCHI } = await import('../../src/data/art.js');
const { MOCHI_POSE_ASSETS } = await import('../../src/data/mochi-poses.generated.js');

beforeEach(() => {
  store.clear();
  fired.length = 0;
});

test('the roster is Mochi first, then every clinic mascot, each drawable and named in Thai', () => {
  const ids = buddy.BUDDIES.map((b) => b.id);
  assert.equal(ids[0], 'mochi', 'Mochi leads the roster');
  assert.deepEqual(ids.slice(1), Object.keys(SQUAD_MASCOTS), 'then the clinic mascots, in art.js order');
  assert.equal(new Set(ids).size, ids.length, 'ids are unique');
  for (const b of buddy.BUDDIES) {
    assert.ok(b.nameTh && /[฀-๿]/.test(b.nameTh), `${b.id} has a Thai name`);
    assert.ok(b.alt && /[฀-๿]/.test(b.alt), `${b.id} has a Thai alt text`);
    assert.ok(b.role && b.species, `${b.id} has a role and species line`);
    assert.ok(existsSync(path.join(repoRoot, 'public', b.src)), `${b.id} picture exists: ${b.src}`);
  }
  for (const pose of Object.values(buddy.MOCHI_BUDDY.poses)) {
    assert.ok(Object.values(MOCHI_POSE_ASSETS).includes(pose), `Mochi pose ${pose} is a generated pose asset`);
  }
});

test('no pick means Mochi; a stale id is no pick; an unknown id is never stored', () => {
  assert.equal(buddy.pickedBuddyId(), null);
  assert.equal(buddy.currentBuddy().id, 'mochi', 'no pick: Mochi');
  assert.equal(buddy.currentBuddy('chicky').id, 'chicky', 'a screen may fall back to its own buddy');
  store.set('vmx-selected-buddy', 'moochaa');
  assert.equal(buddy.pickedBuddyId(), null, 'a stored id naming nobody is not a pick');
  assert.equal(buddy.currentBuddy().id, 'mochi');
  assert.equal(buddy.pickBuddy('dragon'), false, 'an unknown buddy is refused');
  assert.equal(store.get('vmx-selected-buddy'), 'moochaa', 'and nothing is written');
  assert.equal(buddy.pickBuddy('glidy'), true);
  assert.equal(buddy.pickedBuddyId(), 'glidy');
  assert.ok(fired.includes('vmx-buddy-changed'), 'a pick is announced');
  assert.equal(buddy.pickBuddy('mochi'), true, 'Mochi can be picked back');
  assert.equal(buddy.currentBuddy('chicky').id, 'mochi', 'an explicit Mochi beats a screen fallback');
});

test('every buddy can be drawn in 3D: a GLB that exists, or Mochi built from the Motion Kit', () => {
  assert.deepEqual(buddy.buddyModel('mochi'), { kind: 'mochi' });
  for (const id of Object.keys(SQUAD_MASCOTS)) {
    const m = buddy.buddyModel(id);
    assert.equal(m.kind, 'glb');
    assert.ok(existsSync(path.join(repoRoot, 'public', m.url)), `${m.url} exists`);
  }
  assert.equal(buddy.buddyModel('nobody'), null);
});

test('a moment picture: Mochi has a drawn pose, a clinic mascot its one picture', () => {
  assert.equal(buddy.buddyArt(buddy.MOCHI_BUDDY, 'celebrate'), MOCHI_POSE_ASSETS.celebrate);
  assert.equal(buddy.buddyArt(buddy.MOCHI_BUDDY, 'sleep-unknown'), buddy.MOCHI_BUDDY.src);
  assert.equal(buddy.buddyArt(SQUAD_MASCOTS.porky, 'celebrate'), SQUAD_MASCOTS.porky.src);
  assert.equal(buddy.buddyArt(null, 'wave'), buddy.MOCHI_BUDDY.src, 'never an empty picture');
});

test('Results: the pick wins, then a one-subject set shows its clinic, otherwise Mochi', () => {
  const swine = Object.keys(SUBJECT_MOCHI).find((k) => SUBJECT_MOCHI[k]?.id === 'porky');
  const chef = Object.keys(SUBJECT_MOCHI).find((k) => !SUBJECT_MOCHI[k]?.id);
  assert.ok(swine && chef);
  const one = [{ subject: swine }, { subject: swine }];
  assert.equal(buddy.resultsCompanion(one, null).id, 'porky', 'one subject, no pick: its clinic mascot');
  assert.equal(buddy.resultsCompanion(one, 'mimi').id, 'mimi', 'a picked buddy wins over the subject');
  assert.equal(buddy.resultsCompanion([{ subject: swine }, { subject: chef }], null).id, 'mochi', 'mixed set: Mochi');
  assert.equal(buddy.resultsCompanion([{ subject: chef }], null).id, 'mochi', 'a Mochi-in-uniform subject is not a clinic buddy');
  assert.equal(buddy.resultsCompanion(undefined, null).id, 'mochi', 'no questions: Mochi');
  store.set('vmx-selected-buddy', 'hootie');
  assert.equal(buddy.resultsCompanion(one).id, 'hootie', 'reads the stored pick by default');
});

test('Home: the picked buddy, else the season\'s Mochi picture', () => {
  const season = { src: '/art/mochi-seasonal/exam-week.webp', alt: 'โมจิคาดผ้าที่หน้าผาก' };
  assert.deepEqual(buddy.homeCompanion(season, null), { id: 'mochi', name: 'Mochi', src: season.src, alt: season.alt });
  assert.equal(buddy.homeCompanion(null, null).src, buddy.MOCHI_BUDDY.src);
  const glidy = buddy.homeCompanion(season, 'glidy');
  assert.deepEqual(glidy, { id: 'glidy', name: SQUAD_MASCOTS.glidy.nameTh, src: SQUAD_MASCOTS.glidy.src, alt: SQUAD_MASCOTS.glidy.alt });
});

test('the 3D probe answers once and releases its context', () => {
  let lost = 0;
  let made = 0;
  const realDocument = globalThis.document;
  globalThis.document = { createElement: () => ({ getContext: (t) => { made++; return t === 'webgl2' ? { getExtension: () => ({ loseContext: () => { lost++; } }) } : null; } }) };
  buddy.resetCanShow3D();
  assert.equal(buddy.canShow3D(), true);
  assert.equal(buddy.canShow3D(), true);
  assert.equal(made, 1, 'probed once');
  assert.equal(lost, 1, 'the probe context is released');
  globalThis.document = { createElement: () => ({ getContext: () => null }) };
  buddy.resetCanShow3D();
  assert.equal(buddy.canShow3D(), false, 'no WebGL2: no 3D');
  globalThis.document = { createElement: () => { throw new Error('blocked'); } };
  buddy.resetCanShow3D();
  assert.equal(buddy.canShow3D(), false, 'a throwing probe is a no');
  globalThis.document = realDocument;
  buddy.resetCanShow3D();
});

test('useBuddy follows a pick made on another screen or in another tab', async () => {
  const { useBuddy } = await loadModule('src/hooks/useBuddy.js');
  let seen = null;
  const Probe = () => { seen = useBuddy(); return null; };
  const inst = mount(Probe);
  assert.equal(seen.id, 'mochi');
  assert.equal(seen.picked, null);
  seen.pick('oto');
  inst.flush();
  assert.equal(seen.id, 'oto', 'a pick through the hook shows at once');
  store.set('vmx-selected-buddy', 'clover');
  globalThis.dispatchEvent({ type: 'storage', key: 'vmx-other' });
  inst.flush();
  assert.equal(seen.id, 'oto', 'another key changing is ignored');
  globalThis.dispatchEvent({ type: 'storage', key: 'vmx-selected-buddy' });
  inst.flush();
  assert.equal(seen.id, 'clover', 'a pick from another tab shows');
  const fallback = (() => { let s; const P = () => { s = useBuddy('chicky'); return null; }; store.clear(); const i = mount(P); i.unmount(); return s; })();
  assert.equal(fallback.id, 'chicky', 'a screen fallback when nothing was picked');
  inst.unmount();
  assert.equal((listeners['vmx-buddy-changed'] || []).length, 0, 'listeners are removed on unmount');
  assert.equal((listeners.storage || []).length, 0);
});
