// Atlas label layer contracts: the presentation state machine, the pure
// projection math, the registry builder, and the real pilot label set.
// No filesystem writes anywhere — the regen writing path never runs here.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { anchorVisible, DENSITY_THRESHOLD_PX, labelPresentation, projectToScreen } from '../../src/lib/atlas-labels.js';
import { buildLabelRegistry } from '../../scripts/lib/atlas-label-registry.mjs';
import { displayToSource, sourceToDisplay } from '../../scripts/lib/atlas-label-transform.mjs';

const repo = resolve(resolve(dirname()), '../..');
function dirname() { return fileURLToPath(new URL('.', import.meta.url)); }

test('presentation: explore shows text by default and dots when the toggle is off', () => {
  assert.equal(labelPresentation({ mode: 'explore', labelsVisible: true, stageSize: 900, sceneReady: true }), 'text');
  assert.equal(labelPresentation({ mode: 'explore', labelsVisible: false, stageSize: 900, sceneReady: true }), 'dots');
});

test('presentation: below the density threshold everything is a dot, at it text returns', () => {
  assert.equal(labelPresentation({ mode: 'explore', labelsVisible: true, stageSize: DENSITY_THRESHOLD_PX - 1, sceneReady: true }), 'dots');
  assert.equal(labelPresentation({ mode: 'explore', labelsVisible: true, stageSize: DENSITY_THRESHOLD_PX, sceneReady: true }), 'text');
  assert.equal(labelPresentation({ mode: 'explore', labelsVisible: false, stageSize: DENSITY_THRESHOLD_PX - 1, sceneReady: true }), 'dots');
});

test('presentation: compare, recall, exploded and dead scenes hide the layer', () => {
  for (const mode of ['compare', 'recall']) {
    assert.equal(labelPresentation({ mode, labelsVisible: true, stageSize: 900, sceneReady: true }), 'hidden');
  }
  assert.equal(labelPresentation({ mode: 'explore', labelsVisible: true, stageSize: 900, sceneReady: true, exploded: 1 }), 'hidden');
  assert.equal(labelPresentation({ mode: 'explore', labelsVisible: true, stageSize: 900, sceneReady: true, exploded: 0 }), 'text');
  assert.equal(labelPresentation({ mode: 'explore', labelsVisible: true, stageSize: 900, sceneReady: false }), 'hidden');
});

test('anchor visibility: the cut plane, the camera and the frustum each hide an anchor', () => {
  assert.equal(anchorVisible({ visible: true, clipped: false, behindCamera: false, offFrustum: false }), true);
  assert.equal(anchorVisible({ visible: true, clipped: true, behindCamera: false, offFrustum: false }), false);
  assert.equal(anchorVisible({ visible: true, clipped: false, behindCamera: true, offFrustum: false }), false);
  assert.equal(anchorVisible({ visible: false, clipped: false, behindCamera: false, offFrustum: false }), false);
});

test('projection maps NDC centre to the pane centre and rejects the far hemisphere', () => {
  const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  assert.deepEqual(projectToScreen([0, 0, 0], identity, 800, 600), { x: 400, y: 300, behind: false });
  assert.deepEqual(projectToScreen([1, 0, 0], identity, 800, 600), { x: 800, y: 300, behind: false });
  assert.equal(projectToScreen([0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 800, 600).behind, true);
});

test('transform round-trip survives the real visible-ajou ledger', () => {
  const proof = JSON.parse(readFileSync(resolve(repo, 'public/atlas/canine-visible-ajou-provenance.json'), 'utf8'));
  const point = [618.962463, -1278.313393, 1796.253377];
  const back = displayToSource(sourceToDisplay(point, proof.sourceToDisplay), proof.sourceToDisplay);
  assert.ok(Math.abs(back[0] - point[0]) < 1e-4, `x drifted: ${back[0]}`);
  assert.ok(Math.abs(back[1] - point[1]) < 1e-4, `y drifted: ${back[1]}`);
  assert.ok(Math.abs(back[2] - point[2]) < 1e-4, `z drifted: ${back[2]}`);
});

const SYNTHETIC_PROOF = {
  id: 'spec-x',
  sourceToDisplay: { rotationDegreesXYZ: [0, 90, 180], center: [10, 20, 30], scale: 0.5 },
  profiles: { quick: { parts: [{ id: 'heart' }, { id: 'lung' }] } },
};

test('registry builder: emits display anchors, th only when overridden', () => {
  const entry = buildLabelRegistry(SYNTHETIC_PROOF, {
    specimen: 'spec-x',
    labels: [
      { partId: 'heart', source: [1, 2, 3], latin: 'Cor', pickedAt: '2026-11-07', pickedAgainst: 'abc' },
      { partId: 'lung', source: [4, 5, 6], latin: 'Pulmo', th: 'ปอด', pickedAt: '2026-11-07', pickedAgainst: 'abc' },
    ],
  });
  assert.equal(entry['spec-x'].labels[0].latin, 'Cor');
  assert.equal(entry['spec-x'].labels[0].th, undefined);
  assert.equal(entry['spec-x'].labels[1].th, 'ปอด');
  const expected = sourceToDisplay([1, 2, 3], SYNTHETIC_PROOF.sourceToDisplay);
  assert.deepEqual(entry['spec-x'].labels[0].display, expected);
});

test('registry builder: nothing authored means nothing emitted (rollback contract)', () => {
  assert.equal(buildLabelRegistry(SYNTHETIC_PROOF, null), null);
});

test('registry builder: rejects unknown parts, empty latin, missing anchors and mismatches', () => {
  const base = { specimen: 'spec-x', pickedAt: '2026-11-07', pickedAgainst: 'abc' };
  assert.throws(() => buildLabelRegistry(SYNTHETIC_PROOF, { specimen: 'other', labels: [] }), /targets/);
  assert.throws(() => buildLabelRegistry(SYNTHETIC_PROOF, { ...base, labels: [{ partId: 'spleen', source: [0, 0, 0], latin: 'X' }] }), /Unknown partId/);
  assert.throws(() => buildLabelRegistry(SYNTHETIC_PROOF, { ...base, labels: [{ partId: 'heart', source: [0, 0, 0], latin: '' }] }), /empty latin/);
  assert.throws(() => buildLabelRegistry(SYNTHETIC_PROOF, { ...base, labels: [{ partId: 'heart', latin: 'Cor' }] }), /finite source anchor/);
  assert.throws(() => buildLabelRegistry(SYNTHETIC_PROOF, { ...base, labels: [{ partId: 'heart', source: [0, 0, 0], latin: 'Cor' }] }), /pick provenance/);
});

test('the real pilot label set is inside the owner-agreed bounds and inside its part', () => {
  const proof = JSON.parse(readFileSync(resolve(repo, 'public/atlas/canine-visible-ajou-provenance.json'), 'utf8'));
  const authored = JSON.parse(readFileSync(resolve(repo, 'scripts/atlas-labels/canine-visible-ajou.json'), 'utf8'));
  const entry = buildLabelRegistry(proof, authored);
  const labels = entry['canine-visible-ajou'].labels;
  assert.ok(labels.length >= 10 && labels.length <= 20, `label count ${labels.length} outside 10-20`);
  const partIds = new Set(proof.profiles.quick.parts.map((part) => part.id));
  const composites = new Set(['skin', 'muscle', 'bones']);
  for (const label of labels) {
    assert.ok(!composites.has(label.partId), `composite ${label.partId} must not be labeled`);
    assert.ok(partIds.has(label.partId));
    assert.ok(label.latin.trim().length > 0);
    const draft = authored.labels.find((item) => item.partId === label.partId);
    const [min, max] = draft.sourceBounds;
    for (let axis = 0; axis < 3; axis++) {
      assert.ok(draft.source[axis] >= min[axis] - 1e-3 && draft.source[axis] <= max[axis] + 1e-3,
        `${label.partId} anchor outside its part bounds on axis ${axis}`);
      assert.ok(label.display[axis] >= -1.05 && label.display[axis] <= 1.05,
        `${label.partId} display anchor outside the normalized model`);
    }
  }
});

test('the built atlas first-load graph carries no label chunk (run after npm run build)', () => {
  const manifestPath = resolve(repo, 'dist/.vite/manifest.json');
  if (!existsSync(manifestPath)) {
    console.log('skip: no dist manifest (npm run build first for this check)');
    return;
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const seen = new Set();
  const walk = (key) => {
    if (!key || seen.has(key)) return;
    seen.add(key);
    const entry = manifest[key];
    if (!entry) return;
    for (const dependency of entry.imports || []) walk(dependency);
  };
  walk('atlas.html');
  for (const key of seen) {
    assert.ok(!/AtlasLabels/.test(key), `label chunk ${key} leaked into the atlas static graph`);
    for (const file of [manifest[key].file, ...(manifest[key].css || [])]) {
      assert.ok(!/atlas-labels/i.test(file), `label asset ${file} leaked into the atlas static graph`);
    }
  }
});
