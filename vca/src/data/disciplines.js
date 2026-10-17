// The library's shelves: the disciplines the VCA past papers and tutor handouts are filed
// under, with the names the collection itself uses in its folder paths and titles.
//
// The collection (../../../src/data/vca-materials.js) was gathered by several cohorts, so the
// same field appears as "Anes", "Anesthesiology" and "VCA 2568/Anesthesiology/รวมข้อสอบเก่า".
// shelfOf() reads a material's folder path, then its title, against these spellings; a
// document that names no field goes on the "general" shelf (whole papers, exam notices).
// Plain ESM: scripts/build-bank.mjs reads it in Node.

export const DISCIPLINES = [
  // I: bioscience
  { id: 'anatomy', family: 'bio', domain: 'anatomy', th: 'กายวิภาคศาสตร์', en: 'Anatomy', match: ['anatomy'] },
  { id: 'physiology', family: 'bio', domain: null, th: 'สรีรวิทยา', en: 'Physiology', match: ['physiology', 'physio'] },
  { id: 'pharmacology', family: 'bio', domain: 'pharmacology', th: 'เภสัชวิทยาและพิษวิทยา', en: 'Pharmacology & toxicology', match: ['pharmacology'] },
  { id: 'pathology', family: 'bio', domain: 'pathology', th: 'พยาธิวิทยา', en: 'Pathology', match: ['pathology _ clin chem', 'pathology', 'patho'] },
  { id: 'clinical-chemistry', family: 'bio', domain: 'pathology', th: 'เคมีคลินิก', en: 'Clinical chemistry', match: ['clinical chemistry', 'clin chem'] },
  { id: 'hematology', family: 'bio', domain: 'pathology', th: 'โลหิตวิทยาและเซลล์วิทยา', en: 'Hematology & cytology', match: ['hematology _ cytology', 'hematology', 'cytology'] },
  { id: 'bacteriology', family: 'bio', domain: 'micro-immuno', th: 'แบคทีเรียวิทยา', en: 'Bacteriology', match: ['bacteriology'] },
  { id: 'virology', family: 'bio', domain: 'micro-immuno', th: 'ไวรัสวิทยา', en: 'Virology', match: ['virology'] },
  { id: 'mycology', family: 'bio', domain: 'micro-immuno', th: 'วิทยาเชื้อรา', en: 'Mycology', match: ['mycology', 'myco'] },
  { id: 'immunology', family: 'bio', domain: 'micro-immuno', th: 'ภูมิคุ้มกันวิทยาและวัคซีน', en: 'Immunology & vaccinology', match: ['immunology _ vaccinology', 'immunology and vaccinology', 'immunology & vaccinology', 'immunology'] },
  { id: 'helminthology', family: 'bio', domain: 'micro-immuno', th: 'หนอนพยาธิวิทยา', en: 'Helminthology', match: ['helminthology', 'helmithology'] },
  { id: 'protozoology', family: 'bio', domain: 'micro-immuno', th: 'โปรโตซัววิทยา', en: 'Protozoology', match: ['protozoology', 'protozoa'] },
  { id: 'entomology', family: 'bio', domain: 'micro-immuno', th: 'กีฏวิทยา', en: 'Entomology', match: ['entomology'] },
  { id: 'neurology', family: 'bio', domain: 'neuro-ophtho', th: 'ประสาทวิทยา', en: 'Neurology', match: ['neurology'] },
  { id: 'ophthalmology', family: 'bio', domain: 'neuro-ophtho', th: 'จักษุวิทยา', en: 'Ophthalmology', match: ['ophthalmology', 'oph'] },

  // II: by species
  { id: 'small-animal', family: 'species', domain: 'small-animal', th: 'อายุรศาสตร์สุนัขและแมว', en: 'Canine & feline medicine', match: ['diseases in dogs and cats', 'dog and cat medicine', 'canine and feline medicine'] },
  { id: 'dermatology', family: 'species', domain: 'small-animal', th: 'ตจวิทยา', en: 'Dermatology', match: ['dermatology'] },
  { id: 'emergency', family: 'species', domain: 'small-animal', th: 'เวชศาสตร์ฉุกเฉิน', en: 'Emergency medicine', match: ['emergency medicine', 'emergency med'] },
  { id: 'exotic', family: 'species', domain: 'exotic', th: 'สัตว์เลี้ยงพิเศษ', en: 'Exotic medicine', match: ['exotic medicine', 'exotic pets', 'exotic'] },
  { id: 'wildlife', family: 'species', domain: 'exotic', th: 'สัตว์ป่า', en: 'Wildlife medicine', match: ['wildlife medicine', 'wildlife'] },
  { id: 'avian', family: 'species', domain: 'avian', th: 'สัตว์ปีก', en: 'Avian medicine', match: ['avian medicine', 'nutrition avian'] },
  { id: 'swine', family: 'species', domain: 'swine', th: 'อายุรศาสตร์สุกร', en: 'Swine medicine', match: ['swine medicine', 'swine med', 'swine'] },
  { id: 'equine', family: 'species', domain: 'equine', th: 'อายุรศาสตร์และศัลยศาสตร์ม้า', en: 'Equine medicine & surgery', match: ['equine medicine and surgery', 'equine surgery and medicine', 'equine med surg', 'equine medicine & surgery'] },
  { id: 'ruminant', family: 'species', domain: 'ruminant', th: 'อายุรศาสตร์สัตว์เคี้ยวเอื้อง', en: 'Ruminant medicine', match: ['ruminant medicine', 'rum medicine'] },
  { id: 'ruminant-management', family: 'species', domain: 'ruminant', th: 'การจัดการและโภชนศาสตร์โค', en: 'Ruminant management & nutrition', match: ['ruminant management and nutrition', 'rum management and nutrition', 'ruminant nutrition'] },
  { id: 'aquatic', family: 'species', domain: 'aquatic', th: 'สัตว์น้ำ', en: 'Aquatic medicine', match: ['aquatic medicine', 'aqua med'] },
  { id: 'nutrition', family: 'species', domain: null, th: 'โภชนศาสตร์', en: 'Nutrition', match: ['pet nutrition', 'livestock animal nutrition', 'nutrition'] },

  // III: clinical disciplines
  { id: 'repro-dogcat', family: 'clinic', domain: 'theriogenology', th: 'การสืบพันธุ์สุนัขและแมว', en: 'Reproduction in dogs & cats', match: ['reproduction in dogs and cats', 'reproduction in dog and cat', 'reproduction in dog cat', 'companion animal reproduction'] },
  { id: 'repro-horse', family: 'clinic', domain: 'theriogenology', th: 'การสืบพันธุ์ม้า', en: 'Reproduction in horses', match: ['reproduction in horses'] },
  { id: 'repro-ruminant', family: 'clinic', domain: 'theriogenology', th: 'การสืบพันธุ์โค', en: 'Reproduction in ruminants', match: ['reproduction in ruminants', 'reproduction in ruminant', 'rum repro', 'ruminants repro'] },
  { id: 'repro-swine', family: 'clinic', domain: 'theriogenology', th: 'การสืบพันธุ์สุกร', en: 'Reproduction in swine', match: ['reproduction in swine', 'swine reproduction', 'swine repro'] },
  { id: 'anesthesiology', family: 'clinic', domain: 'surgery', th: 'วิสัญญีวิทยา', en: 'Anesthesiology', match: ['anesthesiology', 'anes'] },
  { id: 'soft-tissue', family: 'clinic', domain: 'surgery', th: 'ศัลยศาสตร์เนื้อเยื่ออ่อน', en: 'Soft tissue surgery', match: ['soft tissue surgery', 'soft tissue'] },
  { id: 'orthopedic', family: 'clinic', domain: 'surgery', th: 'ศัลยศาสตร์กระดูก', en: 'Orthopedic surgery', match: ['orthopedic surgery', 'ortho'] },
  { id: 'radiology', family: 'clinic', domain: 'imaging', th: 'รังสีวิทยา', en: 'Radiology & imaging', match: ['radiology', 'radio', 'imaging'] },

  // IV: public health and the profession
  { id: 'vph', family: 'public', domain: 'food-hygiene', th: 'สัตวแพทย์สาธารณสุข', en: 'Veterinary public health', match: ['veterinary public health', 'vph + juris', 'vph'] },
  { id: 'epidemiology', family: 'public', domain: 'epidemiology', th: 'ระบาดวิทยา', en: 'Epidemiology', match: ['epidemiology'] },
  { id: 'juris', family: 'public', domain: 'juris', th: 'กฎหมาย จริยธรรม และสวัสดิภาพสัตว์', en: 'Law, ethics & animal welfare', match: ['juris, ethics and animal welfare', 'animal welfare & juris and ethics', 'กฎหมายในวิชาชีพสัตวแพทย์', 'animal welfare', 'juris'] },
];

export const GENERAL_SHELF = { id: 'general', family: null, domain: null, th: 'ข้อสอบรวมและข้อมูลการสอบ', en: 'Whole papers & exam notices' };

// Folder names that say how a file reached the collection, not what it is about.
const NOISE = /^(?:vca\b.*|รวมข้อสอบเก่า|เอกสารติวปีก่อน|เอกสารติว|เอกสารประกอบการติว|ส่งไฟล์ข้อสอบทุกปีที่แยกแล้ว|ข้อสอบเก่า|surgery|older vca past papers|na|mn|ptt|อ\..*|พี่.*)$/i;

const tidy = (s) => String(s || '').replace(/[\u{1F300}-\u{1FAFF}☀-➿]/gu, '').replace(/\s+/g, ' ').trim().toLowerCase();

// Longest spelling first, so "pathology _ clin chem" is tried before "pathology".
const SPELLINGS = DISCIPLINES.flatMap((d) => d.match.map((m) => ({ m: tidy(m), d })))
  .sort((a, b) => b.m.length - a.m.length);

function matchSegment(segment) {
  const s = tidy(segment);
  if (!s || NOISE.test(s)) return null;
  return SPELLINGS.find(({ m }) => s === m || s.startsWith(`${m} `))?.d || null;
}

function matchTitle(title) {
  const s = tidy(title).replace(/[()[\]_’'`.,:-]+/g, ' ').replace(/\s+/g, ' ');
  return SPELLINGS.find(({ m }) => new RegExp(`(?:^|\\s)${m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|$)`).test(s))?.d || null;
}

/**
 * The shelf a material belongs on: the first folder segment that names a field, deepest
 * first, else its title, else the general shelf.
 * @param {{ title: string, categories: string[] }} material
 */
export function shelfOf(material) {
  for (const category of material?.categories || []) {
    const segments = String(category).split('/').reverse();
    for (const segment of segments) {
      const d = matchSegment(segment);
      if (d) return d;
    }
  }
  return matchTitle(material?.title) || GENERAL_SHELF;
}

/**
 * The Buddhist-era years a title covers, from the collection's own spellings: "(VCA58-68)",
 * "VCA 66-58", "VCA'66-65", "VCA 2567 หมวด 2", "VCA 1.2568", "VCA2026_anatomy", "’65 หมวดที่สอง".
 * @param {string} title
 * @returns {{ from: number, to: number } | null}
 */
export function yearsOf(title) {
  const t = String(title || '');
  const years = [];
  const be = t.match(/25[5-7]\d/g);
  if (be) years.push(...be.map(Number));
  const ad = t.match(/20[1-3]\d/g);
  if (ad) years.push(...ad.map((y) => Number(y) + 543));
  const pair = /VCA\s*[’'‘`]?\s*(\d{2})\s*[-–]\s*(\d{2})(?!\d)/i.exec(t);
  if (pair) years.push(2500 + Number(pair[1]), 2500 + Number(pair[2]));
  if (!years.length) {
    const one = /(?:VCA\s*[’'‘`]?\s*|[’'‘`])(\d{2})(?!\d)/i.exec(t);
    if (one) years.push(2500 + Number(one[1]));
  }
  const valid = years.filter((y) => y >= 2550 && y <= 2580);
  if (!valid.length) return null;
  return { from: Math.min(...valid), to: Math.max(...valid) };
}

const FORMAT = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.google-apps.document': 'Google Docs',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'application/vnd.google-apps.spreadsheet': 'Google Sheets',
  'video/mp4': 'วิดีโอ',
};

export const formatOf = (mime) => FORMAT[mime] || 'ไฟล์';
