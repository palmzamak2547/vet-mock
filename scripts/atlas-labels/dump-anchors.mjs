// Draft the authored label file for one specimen: for every label named on the
// command line, compute a representative anchor point from the part's own
// vertices in the QUICK glb (display space), invert the recorded transform back
// to source space, and record the part's source bounds so the unit suite can
// pin anchor containment. Palm adjusts points in the authored file after
// reviewing screenshots; every adjustment re-runs regen.
//
//   node scripts/atlas-labels/dump-anchors.mjs <specimen-id> partId[=latin] ...
//
// The quick GLB bakes display coordinates (converter: rotate → −center →
// ×scale), so a vertex average sits at the organ's visual center; occlusion is
// not modelled, by design (owner decision 9).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { displayToSource } from '../lib/atlas-label-transform.mjs';

const [id, ...partArgs] = process.argv.slice(2);
if (!/^[a-z][a-z0-9-]{2,80}$/.test(id || '') || !partArgs.length) {
  console.error('usage: node scripts/atlas-labels/dump-anchors.mjs <specimen-id> partId[=Thai label] ...');
  process.exit(1);
}
const proof = JSON.parse(readFileSync(resolve('public/atlas', `${id}-provenance.json`), 'utf8'));
const profile = proof.profiles.quick;
const known = new Set(profile.parts.map(part => part.id));
const unknown = partArgs.map(arg => arg.split('=')[0]).filter(partId => !known.has(partId));
if (unknown.length) throw new Error(`Unknown partId(s) for ${id}: ${unknown.join(', ')}`);

globalThis.FileReader = class { async readAsArrayBuffer(blob) { this.result = await blob.arrayBuffer(); this.onloadend?.(); } };
const bytes = readFileSync(resolve('public', profile.model.slice(1)));
const gltf = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
const meshes = new Map();
gltf.scene.traverse(object => { if (object.isMesh) meshes.set(object.name, object); });

const latinDraft = {
  'heart': 'Cor', 'aorta': 'Aorta', 'right-lung': 'Pulmo dexter', 'left-lung': 'Pulmo sinister',
  'trachea': 'Trachea', 'esophagus': 'Oesophagus', 'liver': 'Hepar', 'gallbladder': 'Vesica biliaris',
  'stomach': 'Gaster', 'small-intestine': 'Intestinum tenue', 'ascending-colon': 'Colon ascendens',
  'rectum': 'Rectum', 'right-kidney': 'Ren dexter', 'left-kidney': 'Ren sinister', 'spleen': 'Lien',
  'cerebellum': 'Cerebellum', 'eyeball': 'Bulbus oculi',
};

const labels = partArgs.map(arg => {
  const [partId, th] = arg.split('=');
  const mesh = meshes.get(partId);
  if (!mesh) throw new Error(`Part "${partId}" has no mesh in ${profile.model}.`);
  const positions = mesh.geometry.getAttribute('position');
  const center = new T.Vector3();
  const min = new T.Vector3(Infinity, Infinity, Infinity);
  const max = new T.Vector3(-Infinity, -Infinity, -Infinity);
  mesh.updateMatrixWorld(true);
  for (let i = 0; i < positions.count; i++) {
    const vertex = new T.Vector3().fromBufferAttribute(positions, i).applyMatrix4(mesh.matrixWorld);
    center.add(vertex); min.min(vertex); max.max(vertex);
  }
  center.divideScalar(positions.count);
  const display = center.toArray();
  const source = displayToSource(display, proof.sourceToDisplay);
  // The rotation is not axis-aligned, so source bounds need every corner of the
  // display-space box transformed back, then re-min/max'd in source space.
  const corners = [];
  for (const x of [min.x, max.x]) for (const y of [min.y, max.y]) for (const z of [min.z, max.z]) {
    corners.push(displayToSource([x, y, z], proof.sourceToDisplay));
  }
  const sourceMin = [0, 1, 2].map(axis => Math.min(...corners.map(corner => corner[axis])));
  const sourceMax = [0, 1, 2].map(axis => Math.max(...corners.map(corner => corner[axis])));
  const round6 = point => point.map(value => Number(value.toFixed(6)));
  return {
    partId,
    source: round6(source),
    latin: latinDraft[partId] ?? '',
    ...(th ? { th } : {}),
    pickedAt: new Date().toISOString().slice(0, 10),
    pickedAgainst: profile.sha256.slice(0, 12),
    sourceBounds: [round6(sourceMin), round6(sourceMax)],
  };
});

const outPath = resolve('scripts/atlas-labels', `${id}.json`);
const existing = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8')) : { specimen: id, labels: [] };
const byPart = new Map(existing.labels.map(label => [label.partId, label]));
for (const label of labels) byPart.set(label.partId, { ...byPart.get(label.partId), ...label });
existing.labels = [...byPart.values()].sort((a, b) => a.partId.localeCompare(b.partId));
writeFileSync(outPath, `${JSON.stringify(existing, null, 2)}\n`);
console.log(`Authored ${labels.length} anchor(s) for ${id} → ${outPath}`);
for (const label of labels) if (!label.latin) console.warn(`MISSING LATIN DRAFT: ${label.partId}`);
