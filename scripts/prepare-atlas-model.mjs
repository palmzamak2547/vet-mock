// Rebuild the educational pilot from the published M3#1859 archive.
// Download and extract it yourself; this script never fetches or executes data.
// Usage: node scripts/prepare-atlas-model.mjs <directory of original PLYs>
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { BufferGeometry, BufferAttribute, Group, Mesh, MeshStandardMaterial } from 'three';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { MeshoptSimplifier } from 'meshoptimizer';

const sourceDir = process.argv[2];
if (!sourceDir) throw new Error('Pass the directory containing the seven original M3#1859 PLYs.');
const files = {
  basisphenoid: 'BASISPHENOID.ply',
  presphenoid: 'PRESPHENOID.ply',
  'palatine-left': 'L-PALATINE.ply',
  'palatine-right': 'R-PALATINE.ply',
  'pterygoid-left': 'L-PTERYGOID.ply',
  'pterygoid-right': 'R-PTERYGOID.ply',
  vomer: 'VOMER.ply',
};
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
// GLTFExporter uses this browser API only to read its own generated binary Blob.
globalThis.FileReader = class {
  async readAsArrayBuffer(blob) {
    this.result = await blob.arrayBuffer();
    this.onloadend?.();
  }
};
await MeshoptSimplifier.ready;
const model = new Group();
model.name = 'canine-skull-base-cuhl9';
const report = { source: 'https://doi.org/10.18563/m3.sf.1859', license: 'CC-BY-NC-4.0', relativeErrorLimit: 0.001, parts: [] };
for (const [id, filename] of Object.entries(files)) {
  const bytes = await readFile(join(resolve(sourceDir), filename));
  const original = new PLYLoader().parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
  const positions = original.getAttribute('position').array;
  const indices = new Uint32Array(original.index.array);
  if (!positions.every(Number.isFinite) || indices.some(i => i >= positions.length / 3)) throw new Error(`Invalid geometry: ${filename}`);
  const target = Math.max(3000, Math.floor(indices.length * 0.06 / 3) * 3);
  const [simplified, error] = MeshoptSimplifier.simplify(indices, positions, 3, target, report.relativeErrorLimit, ['LockBorder']);
  const [remap, count] = MeshoptSimplifier.compactMesh(simplified);
  const compact = new Float32Array(count * 3);
  for (let i = 0; i < remap.length; i++) {
    if (remap[i] !== 0xffffffff) compact.set(positions.subarray(i * 3, i * 3 + 3), remap[i] * 3);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(compact, 3));
  geometry.setIndex(new BufferAttribute(count < 65536 ? new Uint16Array(simplified) : simplified, 1));
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  const mesh = new Mesh(geometry, new MeshStandardMaterial({ roughness: 0.72 }));
  mesh.name = id;
  model.add(mesh);
  const part = { id, filename, sha256: digest(bytes), sourceTriangles: indices.length / 3, triangles: simplified.length / 3, vertices: count, simplifierError: error, bounds: [geometry.boundingBox.min.toArray(), geometry.boundingBox.max.toArray()] };
  report.parts.push(part);
  console.log(JSON.stringify(part));
  original.dispose();
}
model.userData = { source: report.source, specimen: 'CUHL 9', license: report.license, authors: 'Hooker, Liu, Slack, Schachner, Ryerson & Hedrick (2025)', changes: 'Mesh simplification for browser use; source coordinates retained. Display colours are illustrative.' };
const glb = Buffer.from(await new GLTFExporter().parseAsync(model, { binary: true }));
const hash = digest(glb);
const outputDir = resolve('public/atlas');
await mkdir(outputDir, { recursive: true });
report.model = `/atlas/cuhl9-base-${hash.slice(0, 12)}.glb`;
report.sha256 = hash;
report.bytes = glb.length;
report.gzipBytes = gzipSync(glb).length;
await writeFile(resolve(`public${report.model}`), glb);
await writeFile(join(outputDir, 'model-provenance.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ model: report.model, bytes: report.bytes, gzipBytes: report.gzipBytes }));
