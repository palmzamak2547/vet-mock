import { ATLAS_ASSETS } from './atlas-assets.generated.js';
import { ATLAS_PARTS, ATLAS_READING } from './atlas.js';
import { ATLAS_DOGMODEL_PARTS } from './atlas-dogmodel.generated.js';
import { VISIBLE_DOG } from './atlas-visible-dog.js';

const EDINBURGH = {
  institution: 'The University of Edinburgh · Royal (Dick) School of Veterinary Studies',
  authors: 'CT: Dr. Tobias Schwarz · preparation: Brian Mather / Open.Ed',
  sourceOverview: 'https://open.ed.ac.uk/3d-skeletons-and-skulls/',
  license: 'CC BY 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  sourceCheckedAt: '2026-09-06',
  geometryReview: 'source-linked',
};
const definitions = [
  VISIBLE_DOG,
  {
    id: 'canine-abdomen-pixelbeaker',
    speciesId: 'dog', species: 'สุนัข', speciesEn: 'Dog',
    title: 'อวัยวะและโครงกระดูกส่วนลำตัว', titleEn: 'Canine abdominal CT surfaces',
    scientificName: 'Canis lupus familiaris',
    subtitle: 'สำรวจปอด หลอดเลือด และอวัยวะช่องท้องจาก CT',
    collectionLabel: 'CT ORGAN SURFACES', partSearchLabel: 'ค้นหาโครงสร้าง',
    kind: 'segmented', institution: 'Pixelbeaker · veterinary training models',
    authors: 'Pixelbeaker (2018)',
    sourceUrl: 'https://sketchfab.com/3d-models/3d-canine-anatomy-normal-abdomen-962de878d2e94b75b10075931f0edaa3',
    sourceOverview: 'https://sketchfab.com/pixelbeaker',
    sourceManifest: '/atlas/canine-abdomen-pixelbeaker-source.json',
    license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceCheckedAt: '2026-09-06', geometryReview: 'source-linked', terminologyReview: 'pending',
    scope: 'ตัวอย่าง CT ช่องท้องสุนัขที่ผู้สร้างระบุว่าปกติ แบ่งเป็น 5 กลุ่มตามต้นฉบับ ตับ ตับอ่อน และหลอดเลือดบางส่วนอยู่ในชิ้นเดียวกัน ไม่ระบุอายุ เพศ สายพันธุ์ หรือหน่วยระยะ ไม่มีผิวหนัง และไม่ได้จัดตำแหน่งร่วมกับโมเดลสุนัขตัวอื่น สีใช้ช่วยแยกโครงสร้าง',
    parts: [
      ['bones', 'Bones (composite)', 'กระดูกหลายชิ้นรวมกัน', 'โครงกระดูก'],
      ['vascular', 'Vascular surfaces', 'หลอดเลือด', 'หลอดเลือด'],
      ['lungs', 'Lungs', 'ปอด', 'อวัยวะ'],
      ['vascular-liver-pancreas', 'Vascular, liver and pancreas (composite)', 'หลอดเลือด ตับ และตับอ่อนรวมกัน', 'อวัยวะ'],
      ['intestines', 'Intestines', 'ลำไส้', 'อวัยวะ'],
    ].map(([id, en, th, systemLabel]) => ({
      id, en, th, latin: '', group: systemLabel, systemLabel,
      pair: null, sourceFile: `Z01A.obj: ${id.replaceAll('-', '_')}`, representation: 'source-segment',
    })),
    reading: ATLAS_READING.map(book => ({ ...book, locator: 'อ่านประกอบอวัยวะทรวงอกและช่องท้องสุนัข · ตำราไม่ได้รับรองโมเดลนี้' })),
  },
  {
    id: 'canine-musculoskeletal-stark',
    speciesId: 'dog', species: 'สุนัข', speciesEn: 'Dog',
    title: 'โครงกระดูกสุนัขเต็มตัว', titleEn: 'Canine musculoskeletal model',
    scientificName: 'Canis lupus familiaris',
    subtitle: 'หัวถึงหาง · แยกส่วนโครงกระดูก · ดูแนวกล้ามเนื้อ',
    collectionLabel: 'SKELETON + MUSCLE PATHS', partSearchLabel: 'ค้นหาโครงสร้าง',
    kind: 'segmented', institution: 'FSU Jena · SimTK DogModel',
    authors: 'Heiko Stark · source project FSU Jena (2021)',
    sourceUrl: 'https://simtk.org/projects/dogmodel',
    sourceOverview: 'https://doi.org/10.1038/s41598-021-90058-0',
    license: 'MIT', licenseUrl: 'https://opensource.org/license/mit',
    licenseNoticeUrl: '/atlas/stark-LICENSE.txt', sourceManifest: '/atlas/canine-musculoskeletal-stark-source.json',
    sourceCheckedAt: '2026-09-06', geometryReview: 'pending', terminologyReview: 'pending',
    parts: ATLAS_DOGMODEL_PARTS,
    scope: 'โมเดล German Shepherd รุ่นทำงานจาก SimTK: โครงกระดูก 24 ส่วนและแนวกล้ามเนื้อจำลอง 158 แนว บางส่วนรวมกระดูกหลายชิ้น เส้นแสดงแนวในแบบจำลองแรง ไม่ใช่รูปร่างหรือความหนาจริงของกล้ามเนื้อ ชุดนี้ไม่มีผิวหนังและอวัยวะภายใน รูปร่างหลังแปลงและคำไทยยังรอทบทวน',
    reading: ATLAS_READING.map((book) => ({ ...book, locator: 'อ่านประกอบระบบกระดูกและกล้ามเนื้อของสุนัข · ยังไม่ได้รับรองโมเดลด้วยตำรา' })),
  },
  {
    id: 'equine-skull-edinburgh',
    speciesId: 'horse',
    species: 'ม้า',
    speciesEn: 'Horse',
    title: 'กะโหลกม้า',
    titleEn: 'Equine skull',
    scientificName: 'Equus ferus caballus',
    subtitle: 'ดูรูปร่างของกะโหลกม้าจากชุด CT',
    kind: 'whole',
    ...EDINBURGH,
    sourceUrl: 'https://sketchfab.com/3d-models/horse-equus-ferus-caballus-ea9a974658fc4cab9860b75024f51791',
    scope:
      'กะโหลกจากตัวอย่าง CT หนึ่งตัว ชุดต้นทางไม่ได้ระบุอายุ เพศ หรือสายพันธุ์ย่อย และไม่ได้แยกชื่อกระดูกแต่ละชิ้น',
    reading: [
      {
        title: 'Dyce, Sack, and Wensing’s Textbook of Veterinary Anatomy',
        edition: '5th ed.',
        locator: 'The Head and Ventral Neck of the Horse',
        url: ATLAS_READING[1].url,
      },
    ],
  },
  {
    id: 'feline-skull-edinburgh',
    speciesId: 'cat',
    species: 'แมว',
    speciesEn: 'Cat',
    title: 'กะโหลกแมว',
    titleEn: 'Feline skull',
    scientificName: 'Felis catus',
    subtitle: 'สำรวจตัวอย่างแมวจากชุด CT',
    kind: 'whole',
    ...EDINBURGH,
    sourceUrl: 'https://sketchfab.com/3d-models/domestic-cat-felis-catus-7c99ca836d834c39872ecf5e9b5e2087',
    scope:
      'ตัวอย่าง CT ของแมวบ้านหนึ่งตัว ชุดต้นทางไม่ได้ระบุอายุ เพศ หรือสายพันธุ์ย่อย และไม่ได้แยกชื่อกระดูกแต่ละชิ้น',
    reading: [
      {
        title: 'Dyce, Sack, and Wensing’s Textbook of Veterinary Anatomy',
        edition: '5th ed.',
        locator: 'The Head and Ventral Neck of the Dog and Cat',
        url: ATLAS_READING[1].url,
      },
    ],
  },
  {
    id: 'canine-skull-nih282',
    speciesId: 'dog',
    species: 'สุนัข',
    speciesEn: 'Dog',
    title: 'กะโหลกสุนัข',
    titleEn: 'Canine skull',
    scientificName: 'Canis lupus familiaris',
    subtitle: 'กะโหลกจาก CT ในคลัง NIH 3D',
    kind: 'whole',
    institution: 'NIH 3D · 3DPX-000282',
    authors: 'LeeDock · Bespoke Modeling / 3D Systems',
    sourceUrl: 'https://3d.nih.gov/entries/282',
    sourceOverview: 'https://3d.nih.gov/entries/282',
    license: 'CC0 / Public domain',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    sourceCheckedAt: '2026-09-06',
    geometryReview: 'source-linked',
    scope:
      'โมเดลกะโหลกสุนัขจาก CT ที่ผู้สร้างเตรียมสำหรับพิมพ์ 3D ไม่ระบุอายุ เพศ หรือสายพันธุ์ และการอยู่ในคลัง NIH ไม่ได้หมายถึงการรับรองทางคลินิก',
    reading: ATLAS_READING.map((book) => ({ ...book, locator: 'อ่านประกอบเรื่องกะโหลกสุนัข' })),
  },
  {
    id: 'canine-skull-base-cuhl9',
    speciesId: 'dog',
    species: 'สุนัข',
    speciesEn: 'Dog',
    title: 'กระดูกฐานกะโหลก',
    titleEn: 'Canine skull base',
    scientificName: 'Canis lupus familiaris',
    subtitle: 'แยกชิ้น · เปรียบเทียบข้าง · ทบทวนชื่อ',
    kind: 'segmented',
    institution: 'Cornell University veterinary teaching collection · CUHL 9',
    authors: 'Hooker, Liu, Slack, Schachner, Ryerson & Hedrick (2025)',
    sourceUrl: 'https://www.morphomuseum.com/specimenfiles/view/1859',
    sourceOverview: 'https://doi.org/10.18563/journal.m3.276',
    license: 'CC BY-NC 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/',
    sourceCheckedAt: '2026-09-06',
    geometryReview: 'pending',
    terminologyReview: 'nav-checked',
    parts: ATLAS_PARTS,
    scope:
      'กระดูกบางส่วนของฐานกะโหลกสุนัขพันธุ์ผสมอายุน้อยกว่า 1 ปี จากโครงการสื่อพิมพ์ 3D · 7 ชิ้นจากกระดูก 5 ชนิด · รูปร่างหลังแปลงและคำไทยยังรอการทบทวน',
    reading: ATLAS_READING.map((book) => ({ ...book, locator: 'อ่านประกอบเรื่องกะโหลกสุนัข' })),
  },
];

// Missing model bytes are not published as selectable specimens.
export const ATLAS_CATALOG = Object.freeze(
  definitions
    .filter((specimen) => ATLAS_ASSETS[specimen.id])
    .map((specimen) =>
      Object.freeze({
        ...specimen,
        ...ATLAS_ASSETS[specimen.id],
        parts:
          specimen.parts ||
          ATLAS_ASSETS[specimen.id].parts.map((part) =>
            Object.freeze({
              id: part.id,
              en: specimen.titleEn,
              th: specimen.title,
              latin: '',
              group: 'ตัวอย่าง',
              sourceFile: part.originalName,
              pair: null,
            }),
          ),
      }),
    )
    .concat((typeof __ATLAS_LOCAL_SPECIMENS__ === 'undefined' ? [] : __ATLAS_LOCAL_SPECIMENS__)
      .filter(local => !definitions.some(specimen => specimen.id === local.id))),
);
export const DEFAULT_ATLAS_ID = 'canine-visible-ajou';
export const getAtlasSpecimen = (id) =>
  ATLAS_CATALOG.find((specimen) => specimen.id === id) ||
  ATLAS_CATALOG.find((specimen) => specimen.id === DEFAULT_ATLAS_ID) ||
  ATLAS_CATALOG[0];
