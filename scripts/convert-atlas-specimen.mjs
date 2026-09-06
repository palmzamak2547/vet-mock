// Convert local, licensed source geometry into portable glTF and a real-mesh poster.
// No downloads or source scripts are executed. Output keeps a reproducible ledger.
// node scripts/convert-atlas-specimen.mjs <specimen-id> <source.glb|source.stl|directory-of-ply>
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { resolve, extname, join, basename } from 'node:path';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import * as T from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';

const [id, input, rotationInput = '0,0,0', ...options] = process.argv.slice(2);
if (options.some(option => option !== '--named-parts' && !option.startsWith('--output-dir='))) throw new Error('Unknown conversion option');
const namesOption = options.includes('--named-parts');
const displayRotation = rotationInput.split(',').map(Number);
if (displayRotation.length !== 3 || displayRotation.some(value => !Number.isFinite(value) || Math.abs(value) > 360)) throw new Error('Rotation must be three finite degrees.');
if (!/^[a-z][a-z0-9-]{2,80}$/.test(id || '') || !input) throw new Error('Pass a specimen ID and source file/directory.');
const outDir = resolve(options.find(option => option.startsWith('--output-dir='))?.slice(13) || 'public/atlas');
await mkdir(outDir, { recursive: true });
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
globalThis.FileReader = class { async readAsArrayBuffer(blob) { this.result = await blob.arrayBuffer(); this.onloadend?.(); } };
const source = [];
const sources = [];
const attribution = {};
const bytesToArray = bytes => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
const plyNames = { 'BASISPHENOID.ply': 'basisphenoid', 'PRESPHENOID.ply': 'presphenoid', 'VOMER.ply': 'vomer', 'L-PALATINE.ply': 'palatine-left', 'R-PALATINE.ply': 'palatine-right', 'L-PTERYGOID.ply': 'pterygoid-left', 'R-PTERYGOID.ply': 'pterygoid-right' };
if (extname(input).toLowerCase() === '.glb') {
  const bytes = await readFile(resolve(input));
  const json = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString());
  if (json.images?.length || json.buffers?.some(buffer => buffer.uri)) throw new Error('Only self-contained, untextured source geometry is accepted.');
  const gltf = await new GLTFLoader().parseAsync(bytesToArray(bytes), '');
  gltf.scene.traverse(object => {
    for (const key of ['source', 'license', 'copyright', 'licenseText', 'representation']) {
      const value = object.userData[key];
      if (typeof value !== 'string' || value.length > 10000) continue;
      if (attribution[key] && attribution[key] !== value) throw new Error('Conflicting source notices need asset-level review');
      attribution[key] = value;
    }
  });
  gltf.scene.updateMatrixWorld(true);
  gltf.scene.traverse(mesh => {
    if (mesh.isMesh) {
      const name = namesOption ? mesh.name : `specimen${source.length ? `-${source.length + 1}` : ''}`;
      if (namesOption && (!/^[a-z][a-z0-9-]{1,120}$/.test(name) || source.some(part => part.name === name))) throw new Error('Invalid or duplicate named part');
      source.push({ name, originalName: mesh.name, geometry: mesh.geometry.clone().applyMatrix4(mesh.matrixWorld) });
    }
  });
  sources.push({ filename: input.split(/[\\/]/).pop(), sha256: hash(bytes), bytes: bytes.length });
} else if (extname(input).toLowerCase() === '.stl') {
  const bytes = await readFile(resolve(input));
  source.push({ name: 'specimen', originalName: input.split(/[\\/]/).pop(), geometry: new STLLoader().parse(bytesToArray(bytes)) });
  sources.push({ filename: input.split(/[\\/]/).pop(), sha256: hash(bytes), bytes: bytes.length });
} else {
  for (const filename of (await readdir(resolve(input))).filter(name => name.endsWith('.ply')).sort()) {
    if (!plyNames[filename]) throw new Error(`Unmapped source surface: ${filename}`);
    const bytes = await readFile(join(resolve(input), filename));
    source.push({ name: plyNames[filename], originalName: filename, geometry: new PLYLoader().parse(bytesToArray(bytes)) });
    sources.push({ filename, sha256: hash(bytes), bytes: bytes.length });
  }
}
if (!source.length) throw new Error('No source surfaces.');
const rotationMatrix = new T.Matrix4().makeRotationFromEuler(new T.Euler(...displayRotation.map(value => value * Math.PI / 180)));
const originalBounds = new T.Box3();
for (const part of source) { part.geometry.computeBoundingBox(); originalBounds.union(part.geometry.boundingBox); part.geometry.applyMatrix4(rotationMatrix); }
const bounds = new T.Box3();
for (const part of source) {
  part.geometry.computeBoundingBox();
  bounds.union(part.geometry.boundingBox);
}
const center = bounds.getCenter(new T.Vector3());
const size = bounds.getSize(new T.Vector3());
const extent = Math.max(size.x, size.y, size.z);
if (!Number.isFinite(extent) || extent <= 0) throw new Error('Invalid source bounds.');
const report = { id, sources, sourceBounds: [originalBounds.min.toArray(), originalBounds.max.toArray()], sourceToDisplay: { rotationDegreesXYZ: displayRotation, center: center.toArray(), scale: 2 / extent }, profiles: {} };
for (const part of source) {
  const original = part.geometry;
  original.deleteAttribute('normal'); original.deleteAttribute('color'); original.deleteAttribute('uv');
  original.translate(-center.x, -center.y, -center.z).scale(2 / extent, 2 / extent, 2 / extent);
  part.geometry = original.index ? original : mergeVertices(original, 0.0000001);
  if (!part.geometry.getAttribute('position').array.every(Number.isFinite)) throw new Error('Non-finite source coordinates.');
}
await MeshoptSimplifier.ready;
let posterParts;
for (const profile of [{ id: 'quick', ratio: 0.015, error: 0.003 }, { id: 'detail', ratio: 0.06, error: 0.001 }]) {
  const group = new T.Group(); group.name = id;
  const parts = [];
  for (const part of source) {
    const positions = new Float32Array(part.geometry.getAttribute('position').array);
    const indices = new Uint32Array(part.geometry.index.array);
    if (indices.some(index => index >= positions.length / 3)) throw new Error('Invalid source indices.');
    const [simplified, error] = MeshoptSimplifier.simplify(indices, positions, 3, Math.min(indices.length, Math.max(1200, Math.floor(indices.length * profile.ratio / 3) * 3)), profile.error, ['LockBorder']);
    const [remap, count] = MeshoptSimplifier.compactMesh(simplified);
    const compact = new Float32Array(count * 3);
    for (let i = 0; i < remap.length; i++) if (remap[i] !== 0xffffffff) compact.set(positions.subarray(i * 3, i * 3 + 3), remap[i] * 3);
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.BufferAttribute(compact, 3));
    geometry.setIndex(new T.BufferAttribute(count < 65536 ? new Uint16Array(simplified) : simplified, 1));
    geometry.computeVertexNormals();
    const normals = geometry.getAttribute('normal').array;
    // Standard KHR_mesh_quantization: no runtime codec, WASM or external decoder.
    geometry.setAttribute('position', new T.BufferAttribute(Int16Array.from(compact, v => Math.round(Math.max(-1, Math.min(1, v)) * 32767)), 3, true));
    geometry.setAttribute('normal', new T.BufferAttribute(Int8Array.from(normals, v => Math.round(Math.max(-1, Math.min(1, v)) * 127)), 3, true));
    const mesh = new T.Mesh(geometry, new T.MeshStandardMaterial({ color: 0xe7dfcf, roughness: 0.72 }));
    mesh.name = part.name;
    group.add(mesh);
    parts.push({ id: part.name, originalName: part.originalName, sourceTriangles: indices.length / 3, triangles: simplified.length / 3, vertices: count, error });
  }
  group.userData = { ...attribution, specimenId: id, change: 'Normalised display coordinates, topology-preserving simplification, 16-bit positions; source transform recorded in ledger.' };
  const bytes = Buffer.from(await new GLTFExporter().parseAsync(group, { binary: true }));
  const digest = hash(bytes);
  const model = `/atlas/${id}-${profile.id}-${digest.slice(0, 12)}.glb`;
  await writeFile(join(outDir, basename(model)), bytes);
  report.profiles[profile.id] = { model, bytes: bytes.length, gzipBytes: gzipSync(bytes).length, sha256: digest, relativeErrorLimit: profile.error, parts };
  if (profile.id === 'quick') posterParts = group.children;
  console.log(JSON.stringify({ id, profile: profile.id, bytes: bytes.length, gzipBytes: gzipSync(bytes).length, triangles: parts.reduce((sum, part) => sum + part.triangles, 0) }));
}

// A static fallback from the exact quick geometry, not an invented illustration.
const camera = new T.PerspectiveCamera(35, 1, 0.01, 100);
camera.position.set(2.4, 1.8, -3.5); camera.lookAt(0, 0, 0); camera.updateMatrixWorld(true);
const light = new T.Vector3(-0.3, 0.8, -0.6).normalize();
const faces = [];
const a = new T.Vector3(), b = new T.Vector3(), c = new T.Vector3(), n = new T.Vector3(), e = new T.Vector3();
for (const mesh of posterParts) {
  const positions = mesh.geometry.getAttribute('position'), indices = mesh.geometry.index.array;
  for (let i = 0; i < indices.length; i += 3) {
    a.fromBufferAttribute(positions, indices[i]); b.fromBufferAttribute(positions, indices[i + 1]); c.fromBufferAttribute(positions, indices[i + 2]);
    n.subVectors(b, a).cross(e.subVectors(c, a)).normalize();
    const shade = 0.62 + Math.abs(n.dot(light)) * 0.38;
    a.project(camera); b.project(camera); c.project(camera);
    faces.push({ z: (a.z + b.z + c.z) / 3, shade, path: `M${((a.x + 1) * 300).toFixed(1)},${((1 - a.y) * 300).toFixed(1)}L${((b.x + 1) * 300).toFixed(1)},${((1 - b.y) * 300).toFixed(1)}L${((c.x + 1) * 300).toFixed(1)},${((1 - c.y) * 300).toFixed(1)}Z` });
  }
}
faces.sort((a, b) => b.z - a.z);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">${faces.map(face => `<path fill="rgb(${Math.round(237 * face.shade)},${Math.round(226 * face.shade)},${Math.round(205 * face.shade)})" d="${face.path}"/>`).join('')}</svg>`;
const poster = await sharp(Buffer.from(svg)).webp({ quality: 85 }).toBuffer();
report.poster = `/atlas/${id}-${hash(poster).slice(0, 12)}.webp`;
await writeFile(join(outDir, basename(report.poster)), poster);
await writeFile(join(outDir, `${id}-provenance.json`), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ id, poster: report.poster }));
