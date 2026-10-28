// Merge westerly's feline models (Feline Skeleton Dec, Feline Ecorche Dec)
// into one whole-surface display source each. The Sketchfab OBJ export splits
// each sculpt at the 65,535-vertex boundary: all chunks cover the whole body,
// so they are export fragments, not anatomical parts, and the surface is kept
// whole rather than renamed.
// Usage: node scripts/assemble-atlas-feline.mjs <feline_skeleton_dec.glb|feline_ecorche_dec.glb>
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const SOURCES = {
  'b2be07592effdcc6a7786057d1dd7774d530a6c61ea7f4523b7322a8869d25c9': {
    id: 'feline-skeleton-westerly', chunks: 8, url: 'https://sketchfab.com/3d-models/feline-skeleton-dec-a5d0bb8f55dc4f49b103cd20d65e0b17',
    representation: 'One whole-body skeleton surface merged from the eight export chunks the source OBJ was split into at its 65,535-vertex boundary. Not segmented into individual bones; an artist sculpt published as a base for an ecorche study, not a scan of a real specimen.',
  },
  'c687f23ab0df293de6d0695736539dc5cc99bd9a0134048909b6f936a1a12e35': {
    id: 'feline-ecorche-westerly', chunks: 5, url: 'https://sketchfab.com/3d-models/feline-ecorche-dec-4c08824eb4914ff4b6e71b4dc2ba080e',
    representation: 'One whole-body ecorche surface (skin removed, muscle layer) merged from the five export chunks the source OBJ was split into at its 65,535-vertex boundary. Not segmented into individually named muscles; an artist sculpt, not a scan of a real specimen, and not registered to the skeleton specimen.',
  },
};
const input = resolve(process.argv[2] || 'work/atlas-src/feline/feline_skeleton_dec.glb');
const bytes = await readFile(input);
const digest = createHash('sha256').update(bytes).digest('hex');
const known = SOURCES[digest];
if (!known) throw new Error('Unexpected source GLB');
globalThis.FileReader = class { async readAsArrayBuffer(blob) { this.result = await blob.arrayBuffer(); this.onloadend?.(); } };
const gltf = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
const meshes = [];
gltf.scene.updateMatrixWorld(true);
gltf.scene.traverse(object => { if (object.isMesh) meshes.push(object); });
if (meshes.length !== known.chunks) throw new Error(`Expected ${known.chunks} export chunks, found ${meshes.length}`);
const merged = mergeGeometries(meshes.map(mesh => {
  const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
  for (const key of Object.keys(geometry.attributes)) if (key !== 'position') geometry.deleteAttribute(key);
  geometry.clearGroups();
  return geometry;
}));
if (!merged || !merged.getAttribute('position').array.every(Number.isFinite)) throw new Error('Merged geometry is not finite');
const surface = new T.Mesh(merged, new T.MeshStandardMaterial({ roughness: 0.72 }));
surface.name = 'specimen';
surface.userData = {
  source: known.url,
  license: 'CC BY 4.0', copyright: 'westerly',
  licenseText: `${known.id.startsWith('feline-ecorche') ? 'Feline Ecorche Dec' : 'Feline Skeleton Dec'} by westerly is licensed under Creative Commons Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0/). Converted from the original GLB; display coordinates and mesh resolution modified.`,
  representation: known.representation,
};
await writeFile(join(dirname(input), `${known.id}-assembled.glb`), Buffer.from(await new GLTFExporter().parseAsync(surface, { binary: true })));
await writeFile(resolve('public/atlas', `${known.id}-source.json`), JSON.stringify({
  id: known.id, ...surface.userData,
  original: { filename: input.split('/').pop(), bytes: bytes.length, sha256: digest },
  sourceChunks: meshes.map(mesh => mesh.name),
  sourceUnits: null, sourceCheckedAt: '2026-10-28',
  derivation: 'Merged the whole-body export chunks into one surface, keeping every source triangle; display conversion is separately recorded in the provenance ledger.',
}, null, 2) + '\n');
console.log(`Merged ${meshes.length} export chunks into one surface for ${known.id}.`);
