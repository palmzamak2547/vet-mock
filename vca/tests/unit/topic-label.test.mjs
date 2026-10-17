// The topic names a domain page lists. The curriculum names its topics for the people who build
// it ("🐺 หมาหอน 4 — Hoof Health (อ.ปิยะณัฐ) 🍅", "คาบ 27-28, Pediatrics & Geriatrics"); the page
// shows a student the cleaned name, with near-duplicates merged and a name that only repeats the
// domain left out. Every pair below is a name as the curriculum writes it and what the page shows.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanTopicLabel, repeatsDomain, topicRows, MIN_TOPICS, TOPICS_LISTED } from '../../src/lib/topic-label.js';
import { hasEmoji } from '../../src/lib/emoji.js';
import { DOMAINS } from '../../src/data/domains.js';
import { BANK } from '../../src/generated/bank.js';
import { CATALOG } from '../../src/generated/catalog.js';
import { SUBJECTS } from '../../../src/data/curriculum.js';
import { INSTRUCTOR_DIRECTORY } from '../../../src/data/instructors-directory.js';

const DOMAIN = Object.fromEntries(DOMAINS.map((d) => [d.id, d]));

const CHANGED = [
  // emoji, and two symbols a page of plain words has no use for
  ['⭐ ข้อสอบเก่าเฉพาะกิจ, COM III Final 2019', 'ข้อสอบเก่าเฉพาะกิจ, COM III Final 2019'],
  ['➕ Reptile (general)', 'Reptile (general)'],
  ['➕ Ferret', 'Ferret'],
  ['WSI ↔ fertility', 'WSI and fertility'],
  ['Mycotoxin · Zearalenone', 'Mycotoxin — Zearalenone'],
  // lecture and week numbers
  ['คาบ 27-28, Pediatrics & Geriatrics', 'Pediatrics & Geriatrics'],
  ['คาบ 17, IBD + GN (Inflammatory disease)', 'IBD + GN (Inflammatory disease)'],
  ['คาบ 15-16, Neuro Exam + Localization', 'Neuro Exam + Localization'],
  ['สัปดาห์ 9-11, โรคติดเชื้อในนก (1-3)', 'โรคติดเชื้อในนก (1-3)'],
  ['สัปดาห์ 5, Sugar Glider + Hedgehog', 'Sugar Glider + Hedgehog'],
  ['Lect 16, Semen evaluation + Breeding management + AI', 'Semen evaluation + Breeding management + AI'],
  ['Lecture 3: Hormonal applications', 'Hormonal applications'], // the spelling the audit names; the curriculum has not used it yet
  ['Week 8/10-12, Hoof Care + Trimming', 'Hoof Care + Trimming'],
  ['Week 7+10-12, Parturition + Fetotomy', 'Parturition + Fetotomy'],
  ['Week 9, Ruminant Nutrition, DMI', 'Ruminant Nutrition, DMI'],
  ['L9, Biosecurity & Disease Surveillance', 'Biosecurity & Disease Surveillance'],
  ['L10-11, Avian Drugs + Therapeutic Techniques', 'Avian Drugs + Therapeutic Techniques'],
  // a study group's nickname, the lecturer in brackets, the source tag after
  ['🐺 หมาหอน 4 — Hoof Health (อ.ปิยะณัฐ) 🍅', 'Hoof Health'],
  ['🐺 หมาหอน 6 — L8 Nutrition (อ.หทัยรัตน์) TJ + Master 86', 'Nutrition'],
  ['🐺 หมาหอน 5 — L14 First-Week Mortality (เกรียงวิทย์) TJ', 'First-Week Mortality'],
  ['🐺 หมาหอน 4 — L13 Zoonosis (กมลพรรณ) TJ', 'Zoonosis'],
  ['🐺 หมาหอน 1 — Anesthesia (อ.ภัทร์มนฉัตร) TJ', 'Anesthesia'],
  ['🐺 หมาหอน 2 — GI Internal Med (อ.ธนศักดิ์) TJ ปี 85', 'GI Internal Med'],
  ['🐺 หมาหอน 3 — Feed Mgmt (อ.น้ำ formulas)', 'Feed Mgmt'],
  ['🐺 หมาหอน 2 — Silage Quality (อ.น้ำ ชี้แจง)', 'Silage Quality'],
  ['🐺 หมาหอน 1 — ภาคศัลย์ (Past paper Q1-10 verified)', 'ภาคศัลย์'],
  ['🐺 หมาหอน 3 — Sawita GI Surgery I+II (Hernia)', 'GI Surgery I+II (Hernia)'],
  ['🐺 หมาหอน 5 — Sawita Head/Respi/Eye/Udder/Urinary (Sawita III 2026)', 'Head/Respi/Eye/Udder/Urinary'],
  ['🐺 หมาหอน 5 — ART พี่อิม (Blackboard p17)', 'ART'],
  ['🐺 หมาหอน 7 — Risk-benefit gonadectomy (synthesized)', 'Risk-benefit gonadectomy'],
  ['🐺 หมาหอน 2 — Ultrasound (Blackboard 10/10 + ภาพ)', 'Ultrasound'],
  ['🐺 หมาหอน 3 — Semen freezing + Infertility', 'Semen freezing + Infertility'],
  ['🐺 หมาหอน 5 — Penile Deviation + Caudal Epididymectomy', 'Penile Deviation + Caudal Epididymectomy'],
  ['❓ Uncertain Scope, Tendon Sx (legacy Vet 84)', 'Tendon Sx'],
  ['❓ Uncertain Scope, ND/AE/aMPV/E.coli/Mycoplasma', 'ND/AE/aMPV/E.coli/Mycoplasma'],
  ['📜 Term Paper G5 — Felidae infertility (teratozoospermia)', 'Felidae infertility (teratozoospermia)'],
  ['📜 Term Paper G11 — GnRH agonist (Buserelin) in pig', 'GnRH agonist (Buserelin) in pig'],
  // a lecturer outside those groups
  ['Swine medicine Dr. Pornchalit set', 'Swine medicine set'],
  ['GI Surgery (Sawita 3 lectures, 45 ข้อ)', 'GI Surgery'],
];

// Names that are already fine, em dash and brackets included: only the tags named above are internal.
const KEPT = [
  'ASF — acute signs',
  'CCL — surgical Rx',
  'CVE — CPV / CCV',
  'Male reproductive — BPH, prostate, cryptorchid',
  'Repro surgery — OVH, mastectomy, C-section',
  'Swine welfare — 5 freedoms',
  'Avian Influenza (ไข้หวัดนก)',
  'Neoplastic Diseases (Marek / Leukosis)',
  'Vaginal cytology + reproductive exam (สุนัข/แมว)',
  'ยาระบบประสาทอัตโนมัติ (ANS Drugs)',
  'Equine nutrition (Basic + What diet provides + Feeds)',
  'Dairy Herd Health Management 2024',
  'พรบ.ยา 2510',
  'L5 vertebral disc', // a number after an L without a comma is not a lecture
  'Ajmaline toxicity', // Aj is a title only with its dot
];

test('a curriculum name becomes what a student should read', () => {
  for (const [raw, shown] of CHANGED) assert.equal(cleanTopicLabel(raw), shown, raw);
});

test('names that are fine are left exactly as they are', () => {
  for (const name of KEPT) assert.equal(cleanTopicLabel(name), name);
});

test('nothing goes in, nothing comes out', () => {
  assert.equal(cleanTopicLabel(''), '');
  assert.equal(cleanTopicLabel(null), '');
  assert.equal(cleanTopicLabel('🐺 หมาหอน 4 — '), '');
});

// ── a name that only repeats the domain ─────────────────────────────────────────────────────

test('the first row of a species page no longer repeats the page', () => {
  const echoes = [
    ['small-animal', 'หมาแมว — Dog & Cat'],
    ['exotic', 'Exotic & Wildlife'],
    ['avian', 'สัตว์ปีก — Poultry'],
    ['swine', 'หมู — Swine'],
    ['swine', cleanTopicLabel('Swine medicine Dr. Pornchalit set')], // the lecturer's own set: once the name is gone it is the page's title again
    ['equine', 'ม้า — Equine'],
    ['ruminant', 'Ruminant — โค กระบือ แพะ แกะ'],
    ['aquatic', 'สัตว์น้ำ — Fish & Shrimp'],
    ['theriogenology', 'วิทยาการสืบพันธุ์'],
    ['surgery', 'ศัลยศาสตร์และวิสัญญีวิทยา'],
    ['zoonoses', 'โรคสัตว์สู่คน'],
    ['epidemiology', 'ระบาดวิทยา'],
    ['juris', 'กฎหมาย จริยธรรม และสวัสดิภาพสัตว์'],
    ['pharmacology', 'เภสัชวิทยาและพิษวิทยา'],
    ['anatomy', 'กายวิภาคและสรีรวิทยา'],
  ];
  for (const [id, name] of echoes) assert.ok(repeatsDomain(cleanTopicLabel(name), DOMAIN[id]), `${id}: ${name}`);
});

test('a name with something of its own to say is not an echo, even with the domain\'s word in it', () => {
  const own = [
    ['swine', 'Swine welfare — 5 freedoms'],
    ['equine', 'Equine dentistry'],
    ['small-animal', 'Feline URI'],
    ['avian', 'Avian Pox'],
    ['aquatic', 'Aquatic disease control + พรบ.โรคระบาด 2558'],
    ['epidemiology', 'Intro to Vet Epidemiology'],
    ['zoonoses', 'Intro Zoonoses + fact sheet'],
    ['neuro-ophtho', 'จักษุวิทยา'], // half of a combined domain: how many are eye questions is news
    ['neuro-ophtho', 'ประสาทวิทยา'],
    ['micro-immuno', 'ปรสิตวิทยา'],
    ['pathology', 'โลหิตวิทยา เคมีคลินิก และเซลล์วิทยา'],
  ];
  for (const [id, name] of own) assert.ok(!repeatsDomain(cleanTopicLabel(name), DOMAIN[id]), `${id}: ${name}`);
});

// ── rows ────────────────────────────────────────────────────────────────────────────────────

test('names that come out the same become one row: counts added, every key kept for the link', () => {
  const names = {
    'vca/theriogenology': 'วิทยาการสืบพันธุ์',
    'repro-lect/surgical-neutering': 'Lect 22, Surgical neutering',
    'repro-lect/mahahon-surgical': '🐺 หมาหอน 9 — Surgical neutering (synthesized)',
    'equine-repro/eqrepro-postpartum': 'Postpartum complications',
    'comp-repro-clinic/comp-repro-postpartum': 'Postpartum complications',
    'repro-lect/infertility': 'Lect 18, Infertility problems',
    'comp-repro-clinic/comp-repro-infertility': 'Infertility problems',
    'repro-lect/biotech': 'Lect 19, Reproductive biotechnology',
  };
  const topics = [
    { key: 'repro/', n: 28 }, // no name: not listed
    { key: 'repro-lect/biotech', n: 14 },
    { key: 'repro-lect/surgical-neutering', n: 12 },
    { key: 'equine-repro/eqrepro-postpartum', n: 11 },
    { key: 'vca/theriogenology', n: 11 }, // only repeats the page
    { key: 'repro-lect/mahahon-surgical', n: 10 },
    { key: 'repro-lect/infertility', n: 6 },
    { key: 'comp-repro-clinic/comp-repro-infertility', n: 2 },
    { key: 'comp-repro-clinic/comp-repro-postpartum', n: 1 },
  ];
  assert.deepEqual(topicRows(topics, names, DOMAIN.theriogenology), [
    { label: 'Surgical neutering', n: 22, keys: ['repro-lect/surgical-neutering', 'repro-lect/mahahon-surgical'] },
    { label: 'Reproductive biotechnology', n: 14, keys: ['repro-lect/biotech'] },
    { label: 'Postpartum complications', n: 12, keys: ['equine-repro/eqrepro-postpartum', 'comp-repro-clinic/comp-repro-postpartum'] },
    { label: 'Infertility problems', n: 8, keys: ['repro-lect/infertility', 'comp-repro-clinic/comp-repro-infertility'] },
  ]);
});

test('a merged row is named after its biggest part', () => {
  const names = { 'equine-repro/eqrepro-ai': 'Artificial insemination', 'swine-repro/artificial-insemination': 'Artificial Insemination', a: 'Ovulation', b: 'Estrus', c: 'Gestation' };
  const rows = topicRows([
    { key: 'swine-repro/artificial-insemination', n: 3 }, { key: 'equine-repro/eqrepro-ai', n: 11 },
    { key: 'a', n: 5 }, { key: 'b', n: 4 }, { key: 'c', n: 2 },
  ], names, DOMAIN.theriogenology);
  assert.deepEqual(rows.map((r) => [r.label, r.n]), [['Artificial insemination', 14], ['Ovulation', 5], ['Estrus', 4], ['Gestation', 2]]);
  assert.deepEqual(rows[0].keys.sort(), ['equine-repro/eqrepro-ai', 'swine-repro/artificial-insemination']);
});

test('under four topics a domain lists none, counted after the cleaning', () => {
  // Pharmacology as the curriculum has it: two lectures and a name that repeats the page.
  const pharmacology = topicRows(
    [{ key: 'vet-pharm-2/antiparasitic', n: 28 }, { key: 'vet-pharm-2/autonomic', n: 26 }, { key: 'vca/pharmacology', n: 6 }],
    { 'vet-pharm-2/antiparasitic': 'ยาถ่ายพยาธิ / ยาต้านโปรโตซัว', 'vet-pharm-2/autonomic': 'ยาระบบประสาทอัตโนมัติ (ANS Drugs)', 'vca/pharmacology': 'เภสัชวิทยาและพิษวิทยา' },
    DOMAIN.pharmacology,
  );
  assert.deepEqual(pharmacology, []);

  // Four names, one of them only the page's title again: three are left, so none is listed.
  const names = { a: 'Anatomy', b: 'Heart', c: 'Lung', d: 'Liver' };
  const four = (d) => topicRows(Object.keys(names).map((key, i) => ({ key, n: 4 - i })), names, d);
  assert.deepEqual(four(DOMAIN.pharmacology).map((r) => r.label), ['Anatomy', 'Heart', 'Lung', 'Liver'], 'four real topics are listed');
  assert.deepEqual(four(DOMAIN.anatomy), [], 'the same four, one of them the page itself: three left');
  assert.equal(MIN_TOPICS, 4);
});

// ── what the build wrote ────────────────────────────────────────────────────────────────────

// The names as build-bank.mjs reads them.
const NAMES = {};
for (const s of SUBJECTS) for (const t of s.topics || []) NAMES[`${s.id}/${t.id}`] = String(t.label || t.id).trim();

const NAME_FRAGMENTS = [
  /^\s*(?:คาบ|สัปดาห์|Lect|Lecture|Week|Wk|L)\s*\d/i,
  /(?:^|[\s(])(?:ผศ\.|รศ\.|ดร\.|อ\.|Dr\.|Prof\.|Aj\.)/,
  /หมาหอน|Uncertain|Term Paper|\bTJ\b|synthesi[sz]ed|blackboard|legacy|พี่/i,
  /·/,
];

test('the catalog is the cleaned rows, domain by domain, and the cards agree with it', () => {
  for (const card of BANK.domains) {
    const detail = CATALOG.domains[card.id];
    const all = topicRows(detail.topics, NAMES, DOMAIN[card.id]);
    assert.equal(card.topicCount, all.length, `${card.id}: the card counts the rows`);
    assert.deepEqual(detail.shown, all.slice(0, TOPICS_LISTED), `${card.id}: the catalog holds the first ${TOPICS_LISTED}`);
    assert.ok(all.length === 0 || all.length >= MIN_TOPICS, `${card.id}: none or at least ${MIN_TOPICS}`);
  }
  assert.ok(BANK.domains.some((d) => d.topicCount === 0), 'at least one domain is too thin for a list');
  assert.ok(BANK.domains.filter((d) => d.topicCount > 0).length >= 15);
});

test('every row ties back to real topics: its keys are the domain\'s, once each, and its count is theirs', () => {
  for (const card of BANK.domains) {
    const detail = CATALOG.domains[card.id];
    const counts = new Map(detail.topics.map((t) => [t.key, t.n]));
    const used = new Set();
    let last = Infinity;
    for (const row of topicRows(detail.topics, NAMES, DOMAIN[card.id])) {
      assert.ok(row.label.trim() && row.keys.length > 0, `${card.id}: a row with a name and keys`);
      let sum = 0;
      for (const key of row.keys) {
        assert.ok(counts.has(key), `${card.id}: ${key} is a topic of this domain`);
        assert.ok(!used.has(key), `${card.id}: ${key} is in one row only`);
        used.add(key);
        sum += counts.get(key);
      }
      assert.equal(row.n, sum, `${card.id}: ${row.label}`);
      assert.ok(row.n <= last, `${card.id}: most questions first`);
      last = row.n;
    }
  }
});

test('no row shows an emoji, a lecture number, an internal tag or a lecturer', () => {
  let rows = 0;
  for (const card of BANK.domains) {
    for (const row of topicRows(CATALOG.domains[card.id].topics, NAMES, DOMAIN[card.id])) {
      rows += 1;
      assert.ok(!hasEmoji(row.label), `${card.id}: ${row.label}`);
      for (const bad of NAME_FRAGMENTS) assert.ok(!bad.test(row.label), `${card.id}: ${row.label} still has ${bad}`);
    }
  }
  assert.ok(rows > 400, `${rows} rows read`);
});

test('no row carries the given name of anyone on the faculty list', () => {
  const latin = new Set();
  const thai = new Set();
  for (const person of INSTRUCTOR_DIRECTORY) {
    for (const full of [person.nameEn, ...(person.aliases || [])]) {
      const first = String(full || '').trim().split(/\s+/)[0];
      if (/^[A-Za-z]{4,}$/.test(first)) latin.add(first.toLowerCase());
    }
    const first = String(person.nameTh || '').trim().split(/\s+/)[0];
    if ([...first].length >= 4) thai.add(first);
  }
  assert.ok(latin.has('sawita') && latin.has('pornchalit'), 'the two spelled-out lecturers are on the list');
  for (const card of BANK.domains) {
    for (const row of topicRows(CATALOG.domains[card.id].topics, NAMES, DOMAIN[card.id])) {
      for (const word of row.label.toLowerCase().split(/[^a-z]+/)) assert.ok(!latin.has(word), `${card.id}: "${row.label}" names ${word}`);
      for (const name of thai) assert.ok(!row.label.includes(name), `${card.id}: "${row.label}" names ${name}`);
    }
  }
  // And the check would have caught the originals.
  assert.ok(['Swine medicine Dr. Pornchalit set', 'GI Surgery (Sawita 3 lectures, 45 ข้อ)'].every((raw) => raw.toLowerCase().split(/[^a-z]+/).some((w) => latin.has(w))));
});
