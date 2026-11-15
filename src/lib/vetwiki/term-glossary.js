// ============================================================
// term-glossary — กล่อง "ศัพท์เฉพาะทางในบทนี้" ท้ายบท VetWiki
// นำร่อง 16 บท zoonoses (data/vetwiki-glossary-zoonoses.js)
// บทไหนมีกล่อง บทนั้นโหลดข้อมูลเป็น chunk แยกเมื่อเปิดอ่าน —
// บทอื่นไม่จ่ายไบต์ของข้อมูลชุดนี้
// ============================================================
const GLOSSARY_TOPICS = new Set([
  'zoo-intro', 'zoo-corona', 'zoo-ebola-nipah', 'zoo-ai-basic', 'zoo-siv-civ',
  'zoo-vbz', 'zoo-rabies', 'zoo-epi-approach', 'zoo-mycoses', 'zoo-prion',
  'zoo-bacterial', 'zoo-rickettsial', 'zoo-eid-wildlife', 'zoo-helminthic',
  'zoo-eid-cuvet', 'zoo-protozoal',
]);

export function hasTermGlossary(topicId) {
  return GLOSSARY_TOPICS.has(topicId);
}

let cache = null;

export async function loadTermGlossary() {
  if (!cache) {
    cache = await import('../../data/vetwiki-glossary-zoonoses.js')
      .then((m) => m.VETWIKI_GLOSSARY_ZOONOSES);
  }
  return cache;
}
