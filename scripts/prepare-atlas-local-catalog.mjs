// Build the workstation catalog only after the inspected PRC profiles exist.
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { ATLAS_READING } from '../src/data/atlas.js';
const out = resolve('scratch/atlas-local');
const sourceRoot = resolve('scratch/atlas-full-body/ajou-prc-meshes');
const parts = JSON.parse(await readFile(join(sourceRoot, 'atlas-parts.json'), 'utf8'));
const proof = JSON.parse(await readFile(join(out, 'canine-visible-ajou-provenance.json'), 'utf8'));
const names = {
  skin: 'ผิวหนัง', muscle: 'กล้ามเนื้อรวม', bones: 'โครงกระดูกรวม',
  esophagus: 'หลอดอาหาร', stomach: 'กระเพาะอาหาร', 'small-intestine': 'ลำไส้เล็ก',
  'ascending-colon': 'ลำไส้ใหญ่ส่วนขึ้น', 'transverse-colon': 'ลำไส้ใหญ่ส่วนขวาง',
  'descending-colon': 'ลำไส้ใหญ่ส่วนลง', 'sigmoid-colon': 'ส่วนลำไส้ใหญ่ตามชื่อต้นฉบับ',
  rectum: 'ไส้ตรง', anus: 'ทวารหนัก', liver: 'ตับ', gallbladder: 'ถุงน้ำดี',
  'cystic-duct': 'ท่อถุงน้ำดี', trachea: 'หลอดลม', 'right-lung': 'ปอดขวา', 'left-lung': 'ปอดซ้าย',
  'right-bronchus': 'หลอดลมใหญ่ขวา', 'left-bronchus': 'หลอดลมใหญ่ซ้าย',
  'right-kidney': 'ไตขวา', 'left-kidney': 'ไตซ้าย', 'genital-organs': 'อวัยวะสืบพันธุ์รวม',
  heart: 'หัวใจ', aorta: 'เอออร์ตา', spleen: 'ม้าม', brainstem: 'ก้านสมอง',
  cerebellum: 'สมองน้อย', cerebrum: 'สมองใหญ่', 'optic-nerve': 'เส้นประสาทตา', eyeball: 'ลูกตา', lens: 'เลนส์ตา',
};
const systems = {
  Integumentary_system: 'ผิวหนัง', Muscular_system: 'กล้ามเนื้อ', Skeletal_system: 'โครงกระดูก',
  Alimentary_system: 'ทางเดินอาหาร', Respiratory_system: 'การหายใจ', Urinary_system: 'ทางเดินปัสสาวะ',
  Genital_system: 'สืบพันธุ์', Cardiovascular_system: 'หัวใจและหลอดเลือด', Lymphoid_system: 'น้ำเหลือง',
  Central_nervous_system: 'ประสาทส่วนกลาง', Peripheral_nervous_system: 'ประสาทส่วนปลาย', Sensory_system: 'การรับสัมผัส',
};
const order = Object.keys(systems);
const metadata = parts.map(p => {
  if (!names[p.id] || !systems[p.sourceSystem]) throw new Error('Unmapped source identity');
  const pair = p.id.startsWith('right-') ? p.id.replace('right-', 'left-') : p.id.startsWith('left-') ? p.id.replace('left-', 'right-') : null;
  return { id: p.id, en: p.sourceName.replaceAll('_', ' '), th: names[p.id], latin: '',
    group: systems[p.sourceSystem], systemLabel: systems[p.sourceSystem], pair,
    sourceFile: p.sourcePath.join(' / '), representation: 'source-segment' };
}).sort((a, b) => Object.values(systems).indexOf(a.systemLabel) - Object.values(systems).indexOf(b.systemLabel));
const sourceManifest = '/atlas/canine-visible-ajou-source.json';
await writeFile(join(out, 'canine-visible-ajou-source.json'), JSON.stringify({
  source: 'https://sites.google.com/ajou.ac.kr/anatomy',
  extraction: JSON.parse(await readFile(join(sourceRoot, 'named-manifest.json'), 'utf8')),
  derivedParts: parts, displayConversion: proof.sourceToDisplay,
  physicalUnitConfirmed: false,
  terminology: 'Names retained from the PRC hierarchy. Sigmoid_colon requires veterinary nomenclature review. Muscle and Bones are composite surfaces.',
}, null, 2));
await writeFile(join(out, 'catalog.json'), JSON.stringify([{
  id: 'canine-visible-ajou', speciesId: 'dog', species: 'สุนัข', speciesEn: 'Dog',
  title: 'สุนัขทั้งตัวและอวัยวะ', titleEn: 'Visible dog · whole-body anatomy', scientificName: 'Canis lupus familiaris',
  subtitle: 'ผิวหนัง กล้ามเนื้อ โครงกระดูก และอวัยวะในตัวอย่างเดียวกัน', collectionLabel: 'VISIBLE DOG',
  partSearchLabel: 'ค้นหาโครงสร้าง', kind: 'segmented', institution: 'Ajou University · Visible dog',
  authors: 'Jin Seo Park and colleagues · Visible dog dataset',
  sourceUrl: 'https://sites.google.com/ajou.ac.kr/anatomy', sourceOverview: 'https://doi.org/10.1002/ar.23200',
  sourceManifest, license: 'เงื่อนไขตามต้นทาง', licenseUrl: 'https://sites.google.com/ajou.ac.kr/anatomy',
  sourceCheckedAt: '2026-09-06', geometryReview: 'source-linked', terminologyReview: 'pending',
  scope: 'สุนัข Beagle จากชุด Visible dog: ผิวโมเดล 32 ชิ้นใน 12 ระบบ เก็บชื่อและพิกัดร่วมจากต้นฉบับ PRC กล้ามเนื้อและโครงกระดูกเป็นชิ้นรวม บางอวัยวะแยกซ้าย–ขวาได้ ไม่ใช้วัดระยะจริง ศัพท์บางรายการ เช่น Sigmoid colon ยังรอทบทวนตามกายวิภาคสัตวแพทย์',
  reading: ATLAS_READING.map(book => ({ ...book, locator: 'อ่านประกอบกายวิภาคสุนัขทั้งตัว' })),
  poster: proof.poster, parts: metadata,
  profiles: Object.fromEntries(Object.entries(proof.profiles).map(([id, p]) => [id, { model: p.model, bytes: p.bytes, sha256: p.sha256, triangles: p.parts.reduce((n, x) => n + x.triangles, 0) }])),
}], null, 2));
console.log(`Prepared local catalog: ${metadata.length} parts / ${order.length} systems.`);
