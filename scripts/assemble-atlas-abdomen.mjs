// Preserve the five named CT surface composites in Pixelbeaker's original OBJ.
// Usage: node scripts/assemble-atlas-abdomen.mjs <directory containing Z01A.obj>
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import * as T from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

const root = resolve(process.argv[2] || 'scratch/atlas-full-body/pixelbeaker-abdomen-source');
const bytes = await readFile(join(root, 'Z01A.obj'));
const digest = createHash('sha256').update(bytes).digest('hex');
if (digest !== '1e131b1515acb46e0755f14597dee980eedac91bd9400d7dd4de48afa0ccbeae') throw new Error('Unexpected source OBJ');
const names = ['bones', 'vascular', 'lungs', 'vascular_liver_pancreas', 'intestines'];
// mmGroup identifiers are export fragments within each object, not anatomy.
const object = new OBJLoader().parse(bytes.toString().replace(/^g .*$/gm, ''));
const meshes = object.children.filter(mesh => mesh.isMesh);
if (JSON.stringify(meshes.map(mesh => mesh.name)) !== JSON.stringify(names)) throw new Error('Unexpected anatomical object inventory');
for (const mesh of meshes) {
  mesh.name = mesh.name.replaceAll('_', '-');
  for (const key of Object.keys(mesh.geometry.attributes)) if (key !== 'position') mesh.geometry.deleteAttribute(key);
  mesh.geometry.clearGroups();
  mesh.material = new T.MeshStandardMaterial({ roughness: 0.72 });
}
object.userData = {
  source: 'https://sketchfab.com/3d-models/3d-canine-anatomy-normal-abdomen-962de878d2e94b75b10075931f0edaa3',
  license: 'CC BY 4.0', copyright: 'Pixelbeaker',
  licenseText: '3D Canine Anatomy: Normal Abdomen by Pixelbeaker is licensed under Creative Commons Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0/). Converted from the original OBJ; display coordinates and mesh resolution modified.',
  representation: 'Five source CT surface composites. Not individually segmented organs and not registered to another specimen. Source units unspecified.',
};
globalThis.FileReader = class { async readAsArrayBuffer(blob) { this.result = await blob.arrayBuffer(); this.onloadend?.(); } };
await writeFile(join(root, 'assembled.glb'), Buffer.from(await new GLTFExporter().parseAsync(object, { binary: true })));
await writeFile(resolve('public/atlas/canine-abdomen-pixelbeaker-source.json'), JSON.stringify({
  id: 'canine-abdomen-pixelbeaker', ...object.userData,
  archive: { filename: '3d-canine-anatomy-normal-abdomen.zip', bytes: 35593528, sha256: '1fc4d9d4783607eecfcf8ee201446897840fa06da85e9cbaed3203b242f9a0ab' },
  original: { filename: 'Z01A.obj', bytes: bytes.length, sha256: digest },
  sourceObjects: names, sourceUnits: null, sourceCheckedAt: '2026-09-06',
  derivation: 'Removed non-anatomical mmGroup fragments, retained five source objects and all source triangles before the separately recorded display conversion.',
}, null, 2) + '\n');
console.log(`Assembled ${meshes.length} source composites.`);
