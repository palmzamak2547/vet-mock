// The 3D Mochi's sculpt: smooth where the eye reads a silhouette, light
// where it cannot, rounded fabric and nose, a triangle budget a phone carries.
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMochi } from '../../src/lib/motion-kit/mochi/model-3d.js';
import { STATES, poseAt } from '../../src/lib/motion-kit/mochi/motion.js';

const meshes = (model) => {
  const out = new Map();
  model.root.traverse((o) => { if (o.isMesh) out.set(o.name, o); });
  return out;
};
const triangles = (geometry) => (geometry.index ? geometry.index.count : geometry.attributes.position.count) / 3;

test('every part is tessellated so its silhouette stays within 0.35 px in the buddy stage', () => {
  const all = meshes(buildMochi({ detail: 20 }));
  for (const mesh of all.values()) {
    const p = mesh.geometry.parameters;
    if (mesh.geometry.type !== 'SphereGeometry') continue;
    // The part's radius on screen: the 1.01-unit head is about 150 px.
    const r = 150 * Math.max(mesh.scale.x, mesh.scale.y, mesh.scale.z) / 1.01;
    const sagitta = r * (1 - Math.cos(Math.PI / p.widthSegments));
    assert.ok(sagitta <= 0.35 || p.widthSegments === 48, `${mesh.name} ${p.widthSegments} sides, ${sagitta.toFixed(2)} px`);
  }
  assert.equal(all.get('HeadMesh').geometry.parameters.widthSegments, 48);
  assert.equal(all.get('EyeGlintL').geometry.parameters.widthSegments, 20);
});

test('the bandana and nose have rounded outlines; the stars keep their points', () => {
  const all = meshes(buildMochi({ detail: 20 }));
  // A rounded corner is drawn as a curve: the outline has many more points
  // than the five corners it was given.
  for (const name of ['Bandana', 'Nose', 'ScarfKnot']) {
    const outline = all.get(name).geometry.parameters.shapes.extractPoints(12).shape;
    assert.ok(outline.length > 20, `${name} ${outline.length}`);
  }
  // 8 points and the closing one: no curve was added.
  assert.equal(all.get('StarMesh0').geometry.parameters.shapes.extractPoints(12).shape.length, 9);
});

test('the whole figure stays inside a phone budget and every vertex is finite', () => {
  const model = buildMochi({ detail: 20 });
  let tris = 0;
  for (const mesh of meshes(model).values()) {
    tris += triangles(mesh.geometry);
    assert.ok(mesh.geometry.attributes.position.array.every(Number.isFinite), mesh.name);
  }
  assert.ok(tris < 160_000, `triangles ${tris}`);
  // Every state still poses the rig.
  for (const state of Object.keys(STATES)) model.applyPose(poseAt(state, STATES[state].duration * 0.4), 0);
});
