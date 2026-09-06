// Assemble published body frames and path points; no anatomical sculpting.
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import * as T from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const root = resolve(process.argv[2]);
const source = JSON.parse(await readFile(join(root, 'atlas-source.json'), 'utf8'));
const model = new T.Group();
const display = new T.Matrix4().set(0,1,0,0, 0,0,1,0, 1,0,0,0, 0,0,0,1);
const material = new T.MeshStandardMaterial({ roughness: 0.72 });
const parts = [];
const bodyNames = {
  thorax: ['Thoracic skeletal segment', 'โครงกระดูกส่วนอก'],
  cervix: ['Cervical skeletal segment', 'โครงกระดูกส่วนคอ'],
  caput: ['Skull segment', 'ส่วนกะโหลก'],
  abdomen: ['Lumbar skeletal segment', 'โครงกระดูกส่วนเอว'],
  cauda: ['Caudal skeletal segment', 'โครงกระดูกส่วนหาง'],
  pelvis: ['Pelvic segment', 'ส่วนเชิงกราน'],
  scapula: ['Scapula', 'กระดูกสะบัก'], humerus: ['Humerus', 'กระดูกต้นแขน'],
  antebrachium: ['Antebrachial segment', 'โครงกระดูกปลายแขน'],
  carpus: ['Carpal and metacarpal segment', 'โครงกระดูกข้อมือและฝ่ามือ'],
  forepaw: ['Forepaw digits', 'โครงกระดูกนิ้วเท้าหน้า'],
  femur: ['Femur', 'กระดูกต้นขา'], crus: ['Crural segment', 'โครงกระดูกขาส่วนปลาย'],
  calx: ['Tarsal and metatarsal segment', 'โครงกระดูกข้อเท้าและฝ่าเท้า'],
  hindpaw: ['Hindpaw digits', 'โครงกระดูกนิ้วเท้าหลัง'],
};
for (const body of source.bodies) {
  const transform = display.clone().multiply(new T.Matrix4().set(...body.matrix.flat()))
    .scale(new T.Vector3(...body.scale));
  const geometries = [];
  for (const asset of body.sources) {
    const bytes = await readFile(join(root, 'Geometry', asset.file));
    if (createHash('sha256').update(bytes).digest('hex') !== asset.sha256) throw new Error('Source hash mismatch');
    new OBJLoader().parse(bytes.toString()).traverse((mesh) => {
      if (!mesh.isMesh) return;
      const geometry = mesh.geometry.clone();
      for (const attribute of Object.keys(geometry.attributes)) if (attribute !== 'position') geometry.deleteAttribute(attribute);
      geometry.applyMatrix4(transform);
      geometries.push(geometry);
    });
  }
  if (!geometries.length) throw new Error('Missing source body geometry');
  const mesh = new T.Mesh(mergeGeometries(geometries), material);
  mesh.name = body.id; model.add(mesh);
  const side = body.sourceName.startsWith('left_') ? 'Left' : body.sourceName.startsWith('right_') ? 'Right' : '';
  const base = body.sourceName.replace(/^(left|right)_/, '');
  if (!bodyNames[base]) throw new Error(`Unmapped body ${base}`);
  const [en, th] = bodyNames[base];
  parts.push({ id: body.id, en: `${side ? side + ' ' : ''}${en}`, th: `${th}${side === 'Left' ? 'ซ้าย' : side === 'Right' ? 'ขวา' : ''}`,
    group: side ? `${side} limbs` : 'Axial skeleton', systemLabel: 'โครงกระดูก',
    pair: side ? body.id.replace(side.toLowerCase(), side === 'Left' ? 'right' : 'left') : null,
    sourceFile: body.sources.map((item) => item.file).join(', '), representation: 'source-segment' });
}
for (const path of source.musclePaths) {
  const points = path.points.map((p) => new T.Vector3(...p.world).applyMatrix4(display));
  const segments = [];
  for (let i = 1; i < points.length; i++) {
    const delta = points[i].clone().sub(points[i - 1]);
    if (delta.length() < 1e-8) continue;
    const cylinder = new T.CylinderGeometry(0.0013, 0.0013, delta.length(), 6, 1);
    cylinder.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), delta.clone().normalize()));
    cylinder.translate(...points[i].clone().add(points[i - 1]).multiplyScalar(0.5).toArray());
    cylinder.deleteAttribute('normal'); cylinder.deleteAttribute('uv');
    segments.push(cylinder);
  }
  if (!segments.length) throw new Error('Empty muscle path');
  const mesh = new T.Mesh(mergeGeometries(segments), material); mesh.name = path.id; model.add(mesh);
  const side = path.sourceName.startsWith('left_') ? 'Left' : 'Right';
  const label = path.sourceName.replace(/^(left|right)_/, '').replaceAll('_', ' ');
  parts.push({ id: path.id, en: `${side} ${label} (path)`, th: `แนวกล้ามเนื้อ ${label} · ${side === 'Left' ? 'ซ้าย' : 'ขวา'}`,
    group: `${side} muscle paths`, systemLabel: 'แนวกล้ามเนื้อจำลอง', representation: 'muscle-path',
    sourceFile: source.modelFile, pair: path.id.replace(side.toLowerCase(), side === 'Left' ? 'right' : 'left') });
}
model.userData = {
  source: source.source, license: 'MIT', copyright: 'Copyright (c) 2021, FSU Jena, Heiko Stark',
  licenseText: await readFile(resolve('public/atlas/stark-LICENSE.txt'), 'utf8'),
  representation: 'Published skeletal body segments and illustrative muscle centerline tubes, not volumetric muscle anatomy.',
};
globalThis.FileReader = class { async readAsArrayBuffer(blob) { this.result = await blob.arrayBuffer(); this.onloadend?.(); } };
const bytes = Buffer.from(await new GLTFExporter().parseAsync(model, { binary: true }));
await writeFile(join(root, 'assembled.glb'), bytes);
await writeFile(join(root, 'atlas-parts.json'), JSON.stringify(parts, null, 2));
await writeFile(resolve('src/data/atlas-dogmodel.generated.js'), `// Generated by scripts/assemble-atlas-dogmodel.mjs from the published source.\nexport const ATLAS_DOGMODEL_PARTS = Object.freeze(${JSON.stringify(parts, null, 2)});\n`);
await writeFile(resolve('public/atlas/canine-musculoskeletal-stark-source.json'), JSON.stringify({ ...source,
  derivation: { ...source.archive, sourceToThreeAxes: '(x,y,z) -> (y,z,x)', musclePathRadiusMeters: 0.0013,
    musclePathMeaning: 'Illustrative centerlines between published fixed path points, not tissue volumes or muscle thickness',
    excludedSimulationObjects: ['ground box', 'CoordinateActuator', 'PointActuator', 'TorqueActuator'], anatomicalReview: 'pending' },
}, null, 2) + '\n');
console.log(JSON.stringify({ bytes: bytes.length, parts: parts.length, skeletalSegments: source.bodies.length, musclePaths: source.musclePaths.length }));
