// The VCA collection: nineteen domains in four families, each one a plate on the wall.
//
// The site serves VCA material and nothing else (Palm, 28 ต.ค. 2569: "อยากให้มีแค่ที่มาจากคลัง
// และทุกอย่างที่เกี่ยวกับVCAที่ผมให้มาจริงๆ ไม่เอาข้อที่แต่งขึ้นมาหรือนอกเหนือจากนั้น"). A question is
// served only when it belongs to the main bank's VCA subject and one of VCA_SOURCES names where it
// came from. The course banks (items written from lectures, course papers, items written from
// what seniors marked) stay in VetMock and never reach this site. A VCA question that matches no
// source and no NOT_VCA entry stops the build: a new source is a decision, not a gap.
//
// A domain gathers the VCA topics that test the same field the VCA past papers group under one
// heading (see the categories in ../../../src/data/vca-materials.js). A question lands in exactly
// one domain or in none; tests/unit/domains.test.mjs holds that.
//
// Plain ESM with no JSX: scripts/build-bank.mjs reads it in Node.

export const FAMILIES = [
  { id: 'bio', numeral: 'I', th: 'พื้นฐาน|ทางสัตวแพทย์', en: 'Veterinary bioscience' },
  { id: 'species', numeral: 'II', th: 'คลินิก|ตามชนิดสัตว์', en: 'Clinical, by species' },
  { id: 'clinic', numeral: 'III', th: 'สาขาคลินิก', en: 'Clinical disciplines' },
  { id: 'public', numeral: 'IV', th: 'สาธารณสุข|และวิชาชีพ', en: 'Public health & the profession' },
];

// In a Thai name, `|` marks where a line may break inside a phrase the browser's dictionary
// would otherwise split mid-word (จักษุ|วิทยา); spaces break as usual. thPlain() strips them.
// `tag` is the short Latin caption printed under a plate on the wall.
// `art` is a bookplate id from ../../../src/data/subject-covers.js: VetMock's own course prints.
export const DOMAINS = [
  { id: 'anatomy', tag: 'Anatomy', plate: 1, family: 'bio', th: 'กายวิภาคศาสตร์', en: 'Anatomy, histology & embryology', art: 'vet-anat-1',
    from: [{ subject: 'vca', topic: 'anatomy' }] },
  { id: 'neuro-ophtho', tag: 'Neuro & eye', plate: 2, family: 'bio', th: 'ประสาท|และจักษุวิทยา', en: 'Neurology & ophthalmology', art: 'surg2',
    from: [{ subject: 'vca', topic: 'neurology' }, { subject: 'vca', topic: 'ophthalmology' }] },
  { id: 'pharmacology', tag: 'Pharmacology', plate: 3, family: 'bio', th: 'เภสัชวิทยา', en: 'Pharmacology & toxicology', art: 'vet-pharm-2',
    from: [{ subject: 'vca', topic: 'pharmacology' }] },
  { id: 'pathology', tag: 'Pathology', plate: 4, family: 'bio', th: 'พยาธิวิทยา', en: 'Pathology & clinical pathology', art: 'vet-path-2',
    from: [{ subject: 'vca', topic: 'clinical-pathology' }, { subject: 'vca', topic: 'pathology' }] },
  { id: 'micro-immuno', tag: 'Micro & immuno', plate: 5, family: 'bio', th: 'จุลชีวะ ปรสิต และภูมิคุ้มกัน', en: 'Microbiology, parasitology & immunology', art: 'vet-immuno',
    from: [{ subject: 'vca', topic: 'immunology' }, { subject: 'vca', topic: 'parasitology' }, { subject: 'vca', topic: 'microbiology' }] },

  { id: 'small-animal', tag: 'Small animal', plate: 6, family: 'species', th: 'สุนัขและแมว', en: 'Canine & feline medicine', art: 'rotation-small-animal',
    from: [{ subject: 'vca', topic: 'dogcat' }] },
  { id: 'exotic', tag: 'Exotic', plate: 7, family: 'species', th: 'สัตว์เลี้ยงพิเศษ|และสัตว์ป่า', en: 'Exotic & wildlife medicine', art: 'exotic',
    from: [{ subject: 'vca', topic: 'exotic' }] },
  { id: 'avian', tag: 'Avian', plate: 8, family: 'species', th: 'สัตว์ปีก', en: 'Avian & poultry medicine', art: 'avian-medicine',
    from: [{ subject: 'vca', topic: 'poultry' }] },
  { id: 'swine', tag: 'Swine', plate: 9, family: 'species', th: 'สุกร', en: 'Swine medicine', art: 'swine-clinic',
    from: [{ subject: 'vca', topic: 'swine' }] },
  { id: 'equine', tag: 'Equine', plate: 10, family: 'species', th: 'ม้า', en: 'Equine medicine & surgery', art: 'equine-medicine',
    from: [{ subject: 'vca', topic: 'equine' }] },
  { id: 'ruminant', tag: 'Ruminant', plate: 11, family: 'species', th: 'โค กระบือ แพะ แกะ', en: 'Ruminant medicine', art: 'cliapprum',
    from: [{ subject: 'vca', topic: 'ruminant' }] },
  { id: 'aquatic', tag: 'Aquatic', plate: 12, family: 'species', th: 'สัตว์น้ำ', en: 'Aquatic animal medicine', art: 'aquatic-clinic',
    from: [{ subject: 'vca', topic: 'aquatic' }] },

  { id: 'theriogenology', tag: 'Therio', plate: 13, family: 'clinic', th: 'วิทยาการ|สืบพันธุ์', en: 'Theriogenology', art: 'principles-therio',
    from: [{ subject: 'vca', topic: 'theriogenology' }] },
  { id: 'surgery', tag: 'Surgery', plate: 14, family: 'clinic', th: 'ศัลยศาสตร์', en: 'Surgery', art: 'principles-surgery',
    from: [{ subject: 'vca', topic: 'surgery' }] },
  { id: 'imaging', tag: 'Imaging', plate: 15, family: 'clinic', th: 'รังสีวิทยา', en: 'Diagnostic imaging', art: 'vet-imaging',
    from: [{ subject: 'vca', topic: 'imaging' }] },

  { id: 'food-hygiene', tag: 'Food hygiene', plate: 16, family: 'public', th: 'สุขศาสตร์|อาหาร', en: 'Food hygiene & safety', art: 'milk-meat-hygiene',
    from: [{ subject: 'vca', topic: 'food-hygiene' }] },
  { id: 'zoonoses', tag: 'Zoonoses', plate: 17, family: 'public', th: 'โรคสัตว์|สู่คน', en: 'Zoonoses & One Health', art: 'zoonoses',
    from: [{ subject: 'vca', topic: 'zoonoses' }] },
  { id: 'epidemiology', tag: 'Epidemiology', plate: 18, family: 'public', th: 'ระบาดวิทยา', en: 'Epidemiology', art: 'epidemiology',
    from: [{ subject: 'vca', topic: 'epidemiology' }] },
  { id: 'juris', tag: 'Law & ethics', plate: 19, family: 'public', th: 'กฎหมาย|และจริยธรรม', en: 'Law, ethics & animal welfare', art: 'vet-juris',
    from: [{ subject: 'vca', topic: 'juris' }] },
];

/** The main bank's subject this site serves; every other subject stays in VetMock. */
export const SERVED_SUBJECT = 'vca';

/**
 * Where a served question comes from. `th` is what /about says about it; `kind` is the badge the
 * build gives it ('paper' for questions people sat, 'vca' for sets reworded or adapted from VCA
 * papers). Matched in order, on the question's own provenance fields.
 */
export const VCA_SOURCES = [
  { id: 'recall', kind: 'paper', th: 'ข้อสอบ VCA ที่ผู้เข้าสอบจดกลับมาหลังสอบ แต่ละรอบ',
    test: (q) => /^VCA รอบ \d+\/\d{4}/.test(q.examOrigin || '') },
  { id: 'compilation', kind: 'paper', th: 'ข้อสอบเก่า VCA ที่รุ่นพี่บันทึกไว้ในชุดรวม คงถ้อยคำและลำดับตัวเลือกตามต้นฉบับ',
    test: (q) => /^ข้อสอบเก่า VCA/.test(q.examOrigin || '') },
  { id: 'compilation-adapted', kind: 'vca', th: 'แบบฝึกที่ปรับจากข้อสอบเก่าในชุดรวม VCA ของรุ่นพี่ บอกไฟล์ หน้า และข้อของต้นฉบับไว้ทุกข้อ',
    test: (q) => /\(VCA\s?\d{2}-\d{2}\)/.test(q.source || '') },
  { id: 'vca-sure', kind: 'vca', th: 'ชุด “VCA ผ่านชัวร์” ที่ @Fukfangfluffy_channel แจกฟรี เขียนใหม่ด้วยถ้อยคำของเรา',
    test: (q) => /VCA ผ่านชัวร์/.test(q.source || '') },
];

/** VCA-subject questions that are not VCA material, kept out on purpose and said so on /about. */
export const NOT_VCA = [
  { id: 'vet80-final', th: 'ข้อสอบรวมสัตว์เล็กและสัตว์ใหญ่ของรุ่น Vet 80 ซึ่งเป็นข้อสอบของคณะ ไม่ใช่ข้อสอบ VCA',
    test: (q) => /^Vet 80 past paper/.test(q.examOrigin || '') },
];

/**
 * A VCA-subject question's source id, 'not:<id>' when NOT_VCA keeps it out, or null when nothing
 * names it (and for every other subject's question).
 */
export function vcaSource(q) {
  if (q?.subject !== SERVED_SUBJECT) return null;
  const source = VCA_SOURCES.find((s) => s.test(q));
  if (source) return source.id;
  const not = NOT_VCA.find((s) => s.test(q));
  return not ? `not:${not.id}` : null;
}

export const thPlain = (text) => String(text).replace(/\|/g, '');

export const DOMAIN_BY_ID = Object.fromEntries(DOMAINS.map((d) => [d.id, d]));

/**
 * The domain a question belongs to, or null: the domain whose rules name its subject and topic.
 * @param {{ subject?: string, topic?: string }} q
 * @returns {string|null}
 */
export function domainOf(q) {
  if (!q) return null;
  return DOMAINS.find((d) => d.from.some((r) => r.subject === q.subject && r.topic === q.topic))?.id || null;
}

/** Every subject some rule names, for the generator's coverage report. */
export const MAPPED_SUBJECTS = [...new Set(DOMAINS.flatMap((d) => d.from.map((r) => r.subject)))];
