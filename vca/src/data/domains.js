// The VCA collection: nineteen domains in four families, each one a plate on the wall.
//
// A domain gathers the main bank's questions that test the same field the VCA past papers
// group under one heading (see the categories in ../../../src/data/vca-materials.js). The
// mapping is by subject, and by subject + topic for the VCA bank itself, whose topics are
// already species and disciplines. A question lands in exactly one domain or in none;
// tests/unit/domains.test.mjs holds that, and fails on a subject that is neither mapped
// here nor listed in EXCLUDED_SUBJECTS, so a new course bank is a decision, not a gap.
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
    from: [{ subject: 'vet-histo' }, { subject: 'vet-dev-anat' }] },
  { id: 'neuro-ophtho', tag: 'Neuro & eye', plate: 2, family: 'bio', th: 'ประสาท|และจักษุวิทยา', en: 'Neurology & ophthalmology', art: 'surg2',
    from: [{ subject: 'vet-neuroanat' }, { subject: 'vca', topic: 'neurology' }, { subject: 'vca', topic: 'ophthalmology' }] },
  { id: 'pharmacology', tag: 'Pharmacology', plate: 3, family: 'bio', th: 'เภสัชวิทยา', en: 'Pharmacology & toxicology', art: 'vet-pharm-2',
    from: [{ subject: 'vet-pharm-2' }] },
  { id: 'pathology', tag: 'Pathology', plate: 4, family: 'bio', th: 'พยาธิวิทยา', en: 'Pathology & clinical pathology', art: 'vet-path-2',
    from: [{ subject: 'livestock-pathology' }, { subject: 'vca', topic: 'clinical-pathology' }] },
  { id: 'micro-immuno', tag: 'Micro & immuno', plate: 5, family: 'bio', th: 'จุลชีวะ ปรสิต และภูมิคุ้มกัน', en: 'Microbiology, parasitology & immunology', art: 'vet-immuno',
    from: [{ subject: 'vca', topic: 'immunology' }, { subject: 'vca', topic: 'parasitology' }, { subject: 'rec-adv-bioscience' }] },

  { id: 'small-animal', tag: 'Small animal', plate: 6, family: 'species', th: 'สุนัขและแมว', en: 'Canine & feline medicine', art: 'rotation-small-animal',
    from: [{ subject: 'com1' }, { subject: 'com2' }, { subject: 'com3' }, { subject: 'com4' }, { subject: 'com5' }, { subject: 'poa-clinical' }, { subject: 'vca', topic: 'dogcat' }] },
  { id: 'exotic', tag: 'Exotic', plate: 7, family: 'species', th: 'สัตว์เลี้ยงพิเศษ|และสัตว์ป่า', en: 'Exotic & wildlife medicine', art: 'exotic',
    from: [{ subject: 'exotic' }, { subject: 'vca', topic: 'exotic' }] },
  { id: 'avian', tag: 'Avian', plate: 8, family: 'species', th: 'สัตว์ปีก', en: 'Avian & poultry medicine', art: 'avian-medicine',
    from: [{ subject: 'avian-medicine' }, { subject: 'poultry' }, { subject: 'vca', topic: 'poultry' }] },
  { id: 'swine', tag: 'Swine', plate: 9, family: 'species', th: 'สุกร', en: 'Swine medicine', art: 'swine-clinic',
    from: [{ subject: 'swine-clinic' }, { subject: 'swine-herd' }, { subject: 'vca', topic: 'swine' }] },
  { id: 'equine', tag: 'Equine', plate: 10, family: 'species', th: 'ม้า', en: 'Equine medicine & surgery', art: 'equine-medicine',
    from: [{ subject: 'equine-medicine' }, { subject: 'vca', topic: 'equine' }] },
  { id: 'ruminant', tag: 'Ruminant', plate: 11, family: 'species', th: 'โค กระบือ แพะ แกะ', en: 'Ruminant medicine', art: 'cliapprum',
    from: [{ subject: 'cliapprum' }, { subject: 'practrum' }, { subject: 'herd-health-rum' }, { subject: 'ruminant-clinical' }, { subject: 'vca', topic: 'ruminant' }] },
  { id: 'aquatic', tag: 'Aquatic', plate: 12, family: 'species', th: 'สัตว์น้ำ', en: 'Aquatic animal medicine', art: 'aquatic-clinic',
    from: [{ subject: 'aquatic-clinic' }, { subject: 'vca', topic: 'aquatic' }] },

  { id: 'theriogenology', tag: 'Therio', plate: 13, family: 'clinic', th: 'วิทยาการ|สืบพันธุ์', en: 'Theriogenology', art: 'principles-therio',
    from: [{ subject: 'repro-lect' }, { subject: 'repro' }, { subject: 'comp-repro-clinic' }, { subject: 'equine-repro' }, { subject: 'swine-repro' }] },
  { id: 'surgery', tag: 'Surgery', plate: 14, family: 'clinic', th: 'ศัลยศาสตร์', en: 'Surgery', art: 'principles-surgery',
    from: [{ subject: 'surg1' }, { subject: 'surg2' }, { subject: 'surg3' }] },
  { id: 'imaging', tag: 'Imaging', plate: 15, family: 'clinic', th: 'รังสีวิทยา', en: 'Diagnostic imaging', art: 'vet-imaging',
    from: [{ subject: 'vet-imaging' }] },

  { id: 'food-hygiene', tag: 'Food hygiene', plate: 16, family: 'public', th: 'สุขศาสตร์|อาหาร', en: 'Food hygiene & safety', art: 'milk-meat-hygiene',
    from: [{ subject: 'milk-meat-hygiene' }, { subject: 'food-industry' }, { subject: 'food-safety-y4' }] },
  { id: 'zoonoses', tag: 'Zoonoses', plate: 17, family: 'public', th: 'โรคสัตว์|สู่คน', en: 'Zoonoses & One Health', art: 'zoonoses',
    from: [{ subject: 'zoonoses' }, { subject: 'one-health' }] },
  { id: 'epidemiology', tag: 'Epidemiology', plate: 18, family: 'public', th: 'ระบาดวิทยา', en: 'Epidemiology', art: 'epidemiology',
    from: [{ subject: 'epidemiology' }, { subject: 'vca', topic: 'epidemiology' }] },
  { id: 'juris', tag: 'Law & ethics', plate: 19, family: 'public', th: 'กฎหมาย|และจริยธรรม', en: 'Law, ethics & animal welfare', art: 'vet-juris',
    from: [{ subject: 'vet-juris' }] },
];

// Subjects with questions that the VCA collection leaves out, and why. Shown on /about.
export const EXCLUDED_SUBJECTS = {
  'biochem-1': 'ชีวเคมีปี 1 ไม่ได้เป็นหมวดหนึ่งในข้อสอบ VCA',
  engprof: 'ภาษาอังกฤษวิชาชีพ ไม่ได้เป็นหมวดหนึ่งในข้อสอบ VCA',
  engprof1: 'ภาษาอังกฤษวิชาชีพ ไม่ได้เป็นหมวดหนึ่งในข้อสอบ VCA',
};

export const thPlain = (text) => String(text).replace(/\|/g, '');

export const DOMAIN_BY_ID = Object.fromEntries(DOMAINS.map((d) => [d.id, d]));

/**
 * The domain a question belongs to, or null. A subject + topic rule wins over a subject rule,
 * so the VCA bank's topics are read before anything that names the whole subject.
 * @param {{ subject?: string, topic?: string }} q
 * @returns {string|null}
 */
export function domainOf(q) {
  if (!q) return null;
  for (const d of DOMAINS) {
    if (d.from.some((r) => r.topic && r.subject === q.subject && r.topic === q.topic)) return d.id;
  }
  for (const d of DOMAINS) {
    if (d.from.some((r) => !r.topic && r.subject === q.subject)) return d.id;
  }
  return null;
}

/** Every subject some rule names, for the generator's coverage report. */
export const MAPPED_SUBJECTS = [...new Set(DOMAINS.flatMap((d) => d.from.map((r) => r.subject)))];
