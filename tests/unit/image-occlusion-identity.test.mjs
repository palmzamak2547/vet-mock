// ============================================================
// image-occlusion-identity.test.mjs — a save must not move a card's identity
// ============================================================
// Three defects at the editor/store seam (audit 2026-09-20, MT-01..03),
// each driven against the real store over a stubbed localStorage and, where
// the editor is involved, through the editor's own callbacks lifted out of
// the source so the code that runs is the code that ships:
//   MT-01  the editor serialised masks without their slot, so every save
//          renumbered the survivors from zero: deleting box A handed A's SR
//          card id, and its review history, to box B; and a box drawn after
//          a deletion took the deleted box's id;
//   MT-02  a write the storage refused (quota, private mode) was reported as
//          a successful deletion;
//   MT-03  replacing the image of a new deck kept the old boxes and answers
//          on the new picture, and a slow first pick could land on top of a
//          faster second one.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const EDITOR = readFileSync(join(resolve(process.cwd()), 'src/components/ImageOcclusionEditor.jsx'), 'utf8').replace(/\r\n/g, '\n');
const DECK_KEY = 'vmx-image-occlusion-decks';
const IMG = 'data:image/png;base64,AAAA';

function installStorage() {
  const rows = new Map();
  const state = { failWrites: false, events: [] };
  const storage = {
    getItem: (k) => (rows.has(k) ? rows.get(k) : null),
    setItem: (k, v) => {
      if (state.failWrites) { const e = new Error('QuotaExceededError'); e.name = 'QuotaExceededError'; throw e; }
      rows.set(k, v);
    },
    removeItem: (k) => rows.delete(k),
  };
  globalThis.window = {
    localStorage: storage,
    dispatchEvent: (e) => { state.events.push(e?.type); return true; },
    addEventListener() {},
    removeEventListener() {},
  };
  return { rows, state };
}

const io = await import('../../src/lib/image-occlusion.js');
const extras = await import('../../src/lib/local-extras.js');

const mask = (id, answer) => ({ id, x: 0.1, y: 0.1, w: 0.2, h: 0.2, label: '', answer });
/** Values built inside the vm realm carry another realm's prototypes; compare them as data. */
const plain = (value) => JSON.parse(JSON.stringify(value));
/** answer -> SR card id, for every card the SR pool would see. */
const cardIds = () => new Map(io.loadOcclusionCards().map((c) => [c.answer, c.id]));

/** The editor's save handler, as it ships, wired to the real store. */
function editorSave({ initialDeck, name, imageDataUrl, masks }) {
  const anchor = 'const handleSave = ';
  const start = EDITOR.indexOf(anchor);
  assert.notEqual(start, -1, 'the editor must still have handleSave');
  const end = EDITOR.indexOf('\n  };', start) + 4;
  const payloads = [];
  const handleSave = vm.runInNewContext('(' + EDITOR.slice(start + anchor.length, end) + ')', {
    initialDeck, name, imageDataUrl, masks, Date, Number,
    onSave: (payload) => { payloads.push(payload); return io.saveDeck(payload); },
    setToast() {},
  });
  handleSave();
  assert.equal(payloads.length, 1, 'the editor must hand exactly one payload to onSave');
  return payloads[0];
}

/** What the view hands the editor: the store's copy, each mask copied. */
function openInEditor(deckId) {
  const deck = io.findDeck(deckId);
  assert.ok(deck, 'the deck must still be in the store');
  return { deck, masks: deck.masks.map((m) => ({ ...m })) };
}

test('MT-01: deleting a box in the editor leaves every other box on its card id', () => {
  installStorage();
  const saved = io.saveDeck({ name: 'Pelvis', imageDataUrl: IMG, masks: [mask('a', 'ilium'), mask('b', 'ischium'), mask('c', 'pubis')] });
  const before = cardIds();
  assert.equal(before.size, 3);

  const { deck, masks } = openInEditor(saved.id);
  const payload = editorSave({ initialDeck: deck, name: deck.name, imageDataUrl: deck.imageDataUrl, masks: masks.filter((m) => m.answer !== 'ilium') });
  assert.ok(payload.masks.every((m) => Number.isInteger(m.slot)), 'the editor must send each surviving mask with its slot');

  const after = cardIds();
  assert.equal(after.get('ischium'), before.get('ischium'), 'deleting the first box moved the second box onto another card id');
  assert.equal(after.get('pubis'), before.get('pubis'), 'deleting the first box moved the third box onto another card id');
  assert.equal(after.has('ilium'), false, 'the deleted box still produces a card');
  assert.ok(![...after.values()].includes(before.get('ilium')), 'a surviving box inherited the deleted box\'s card id and review history');
});

test('MT-01: a box drawn after a deletion cannot take the deleted box\'s card id', () => {
  installStorage();
  const saved = io.saveDeck({ name: 'Carpus', imageDataUrl: IMG, masks: [mask('a', 'radius'), mask('b', 'ulna')] });
  const before = cardIds();

  // Delete the first box, then draw a new one (the editor creates it with no slot).
  let opened = openInEditor(saved.id);
  editorSave({ initialDeck: opened.deck, name: 'Carpus', imageDataUrl: IMG, masks: opened.masks.filter((m) => m.answer !== 'radius') });
  opened = openInEditor(saved.id);
  editorSave({ initialDeck: opened.deck, name: 'Carpus', imageDataUrl: IMG, masks: [...opened.masks, mask('c', 'scaphoid')] });

  const after = cardIds();
  assert.equal(after.get('ulna'), before.get('ulna'));
  assert.notEqual(after.get('scaphoid'), before.get('radius'), 'the new box was given the deleted box\'s card id, so it inherits that card\'s review schedule');
  assert.ok(after.get('scaphoid') > after.get('ulna'), 'new boxes take slots above every slot the deck has handed out');

  // Delete the new box, draw another: still no reuse of any retired id.
  opened = openInEditor(saved.id);
  editorSave({ initialDeck: opened.deck, name: 'Carpus', imageDataUrl: IMG, masks: opened.masks.filter((m) => m.answer !== 'scaphoid') });
  opened = openInEditor(saved.id);
  editorSave({ initialDeck: opened.deck, name: 'Carpus', imageDataUrl: IMG, masks: [...opened.masks, mask('d', 'lunate')] });
  const later = cardIds();
  assert.ok(![before.get('radius'), after.get('scaphoid')].includes(later.get('lunate')), 'a retired card id was handed to a new box');
});

test('MT-01: reordering, relabelling and saving several times keep every card id', () => {
  installStorage();
  const saved = io.saveDeck({ name: 'Skull', imageDataUrl: IMG, masks: [mask('a', 'frontal'), mask('b', 'maxilla'), mask('c', 'mandible')] });
  const before = cardIds();
  for (let round = 0; round < 3; round++) {
    const { deck, masks } = openInEditor(saved.id);
    const shuffled = [...masks].reverse().map((m, i) => ({ ...m, label: `round ${round} #${i}` }));
    editorSave({ initialDeck: deck, name: `Skull ${round}`, imageDataUrl: IMG, masks: shuffled });
    assert.deepEqual([...cardIds().entries()].sort(), [...before.entries()].sort(), `save ${round + 1} moved a card id`);
  }
});

test('MT-01: a deck saved before slots were carried keeps its ids, and its next box does not reuse one', () => {
  const { rows } = installStorage();
  // Stored by the previous release: positional slots, no high-water mark.
  rows.set(DECK_KEY, JSON.stringify([{
    id: 80000, name: 'Old deck', imageDataUrl: IMG, createdAt: 1, lastOpened: 1,
    masks: [{ ...mask('m1', 'aorta'), slot: 0 }, { ...mask('m2', 'vena cava'), slot: 1 }],
  }]));
  const before = cardIds();
  assert.deepEqual([...before.entries()].sort(), [['aorta', 80000], ['vena cava', 80001]]);

  let opened = openInEditor(80000);
  editorSave({ initialDeck: opened.deck, name: 'Old deck', imageDataUrl: IMG, masks: opened.masks.filter((m) => m.answer !== 'aorta') });
  assert.equal(cardIds().get('vena cava'), 80001, 'the surviving card of an old deck moved on the first save after the upgrade');

  opened = openInEditor(80000);
  editorSave({ initialDeck: opened.deck, name: 'Old deck', imageDataUrl: IMG, masks: [...opened.masks, mask('m3', 'oesophagus')] });
  assert.equal(cardIds().get('oesophagus'), 80002, 'a new box on an old deck reused a retired card id');
});

test('MT-01: the store itself restores a slot a caller dropped, matched by mask id', () => {
  installStorage();
  const saved = io.saveDeck({ name: 'Stifle', imageDataUrl: IMG, masks: [mask('a', 'patella'), mask('b', 'tibia')] });
  const before = cardIds();
  const stripped = saved.masks.filter((m) => m.answer !== 'patella').map(({ slot, ...rest }) => rest);
  io.saveDeck({ ...saved, masks: stripped });
  assert.equal(cardIds().get('tibia'), before.get('tibia'), 'a mask saved without its slot was renumbered');
});

test('MT-01: card ids survive a backup, a restore on another device and further edits there', () => {
  installStorage();
  const saved = io.saveDeck({ name: 'Thorax', imageDataUrl: IMG, masks: [mask('a', 'heart'), mask('b', 'trachea'), mask('c', 'diaphragm')] });
  let opened = openInEditor(saved.id);
  editorSave({ initialDeck: opened.deck, name: 'Thorax', imageDataUrl: IMG, masks: opened.masks.filter((m) => m.answer !== 'heart') });
  const before = cardIds();
  const archive = extras.exportLocalExtras();

  installStorage(); // the other device
  assert.equal(extras.restoreLocalExtras(archive).ok, true);
  assert.deepEqual([...cardIds().entries()].sort(), [...before.entries()].sort(), 'restoring the backup changed the card ids');

  opened = openInEditor(saved.id);
  editorSave({ initialDeck: opened.deck, name: 'Thorax', imageDataUrl: IMG, masks: [...opened.masks, mask('d', 'sternum')] });
  const after = cardIds();
  assert.equal(after.get('trachea'), before.get('trachea'));
  assert.notEqual(after.get('sternum'), saved.id, 'after the restore the deleted heart card\'s id was handed to a new box');
});

test('MT-02: a deletion the storage refused is reported as a failure and the deck stays', () => {
  const { state } = installStorage();
  const deck = io.saveDeck({ name: 'Ear', imageDataUrl: IMG, masks: [mask('a', 'pinna')] });
  const events = state.events.length;

  state.failWrites = true;
  assert.equal(io.deleteDeck(deck.id), false, 'a refused write was reported as a deletion');
  assert.ok(io.loadDecks().some((d) => d.id === deck.id), 'the deck must still be listed after a refused delete');
  assert.equal(state.events.length, events, 'no change event may be sent for a deletion that did not happen');

  state.failWrites = false;
  assert.equal(io.deleteDeck(deck.id), true, 'the retry after the storage recovered must succeed');
  assert.equal(io.loadDecks().some((d) => d.id === deck.id), false);
  assert.equal(io.deleteDeck(deck.id), true, 'deleting a deck that is already gone is not a failure');
});

test('MT-02: the same holds when the decks live in a restored local-extras bundle', () => {
  installStorage();
  const deck = io.saveDeck({ name: 'Eye', imageDataUrl: IMG, masks: [mask('a', 'cornea')] });
  const archive = extras.exportLocalExtras();
  const { state } = installStorage();
  assert.equal(extras.restoreLocalExtras(archive).ok, true);
  assert.ok(io.loadDecks().some((d) => d.id === deck.id));

  state.failWrites = true;
  assert.equal(io.deleteDeck(deck.id), false);
  assert.ok(io.loadDecks().some((d) => d.id === deck.id));
  state.failWrites = false;
  assert.equal(io.deleteDeck(deck.id), true);
  assert.equal(io.loadDecks().some((d) => d.id === deck.id), false);
});

/** The editor's file handler, as it ships, over mocked React state. */
function editorOnFile(readFileAsDataUrl, image) {
  const anchor = 'const onFile = useCallback(';
  const start = EDITOR.indexOf(anchor);
  assert.notEqual(start, -1, 'the editor must still have onFile');
  const end = EDITOR.indexOf('\n  }, [', start) + 4;
  const editor = { image, masks: [mask('old', 'old anatomy')], selectedId: 'old', toasts: [], maskWrites: 0 };
  const onFile = vm.runInNewContext('(' + EDITOR.slice(start + anchor.length, end) + ')', {
    WARN_SIZE_BYTES: 2 * 1024 * 1024,
    readFileAsDataUrl,
    imageRef: { current: image },
    pickSeq: { current: 0 },
    setImageDataUrl: (v) => { editor.image = v; },
    setMasks: (v) => { editor.masks = v; editor.maskWrites += 1; },
    setSelectedId: (v) => { editor.selectedId = v; },
    setToast: (v) => { editor.toasts.push(v); },
  });
  return { onFile, editor };
}

const png = (name) => ({ name, type: 'image/png', size: 4 });

test('MT-03: replacing the image of a new deck drops the boxes drawn on the old one', async () => {
  const { onFile, editor } = editorOnFile(async (f) => `data:image/png;base64,${f.name}`, 'data:image/png;base64,A');
  await onFile(png('B'));
  assert.equal(editor.image, 'data:image/png;base64,B');
  assert.deepEqual(plain(editor.masks), [], 'boxes and answers drawn over picture A are still attached to picture B');
  assert.equal(editor.selectedId, null, 'the selection must not point at a box that no longer exists');
});

test('MT-03: an existing deck resets on every swap, but picking the same picture again keeps the boxes', async () => {
  const { onFile, editor } = editorOnFile(async (f) => `data:image/png;base64,${f.name}`, 'data:image/png;base64,A');
  await onFile(png('B'));
  assert.deepEqual(plain(editor.masks), []);
  editor.masks = [mask('onB', 'drawn on B')];
  await onFile(png('A'));
  assert.equal(editor.image, 'data:image/png;base64,A');
  assert.deepEqual(plain(editor.masks), [], 'swapping back to the original picture kept the boxes drawn on the second one');
  editor.masks = [mask('onA', 'drawn on A')];
  await onFile(png('A'));
  assert.deepEqual(plain(editor.masks), [mask('onA', 'drawn on A')], 're-selecting the picture on screen must keep the boxes');
});

test('MT-03: when two picks are in flight the last pick owns the editor, whichever read finishes first', async () => {
  const pending = new Map();
  const read = (f) => new Promise((resolve) => { pending.set(f.name, resolve); });
  const { onFile, editor } = editorOnFile(read, 'data:image/png;base64,A');

  const slow = onFile(png('S'));
  const fast = onFile(png('F'));
  pending.get('F')('data:image/png;base64,F');
  await fast;
  assert.equal(editor.image, 'data:image/png;base64,F');
  assert.deepEqual(plain(editor.masks), []);
  editor.masks = [mask('onF', 'drawn on F')];

  pending.get('S')('data:image/png;base64,S');
  await slow;
  assert.equal(editor.image, 'data:image/png;base64,F', 'the earlier, slower pick replaced the picture the student chose last');
  assert.deepEqual(plain(editor.masks), [mask('onF', 'drawn on F')], 'the stale pick wiped boxes drawn on the picture that won');
  assert.equal(editor.maskWrites, 1, 'only the winning pick may reset the boxes');
});
