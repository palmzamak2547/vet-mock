// Which animal a source is about, for the small plate on its card. Only a
// species named outright counts, read from the title first, then the subtitle,
// then the subject's name; within a field the earliest name wins. No name, no
// plate: a card never shows an animal it is not about.
//
// Thai words have no spaces around them, so each Thai pattern carries the
// look-aheads that keep a longer, different word out: หมาย (to mean), หมู่
// (group), ม้าม (spleen), ปลาย (tip), แกะสลัก (carve).
const NAMES = [
  ['dog', /สุนัข|หมา(?![ยก])|\bcanine|\bcanis\b|\bdogs?\b|\bpupp(?:y|ies)\b/i],
  ['cat', /แมว(?!น้ำ)|\bfeline|\bcats?\b|\bkittens?\b|\bFe(?:LV|IV)\b|\bFIP\b/i],
  ['pig', /สุกร|หมู(?!่)|\bswine\b|\bporcine\b|\bpigs?\b|\bpiglets?\b|\bsows?\b|\bPRRSV?\b|\bASF\b|\bPEDV?\b/i],
  ['cow', /วัว|โคนม|โคเนื้อ|โคขุน|ลูกโค|แม่โค|กระบือ|ควาย|สัตว์เคี้ยวเอื้อง|\bbovine\b|\bcattle\b|\bcows?\b|\bcal(?:f|ves)\b|\bdairy\b|\bruminants?\b|\bheifers?\b/i],
  ['horse', /ม้า(?!ม)|\bequine\b|\bhorses?\b|\bfoals?\b|\bmares?\b|\bstallions?\b/i],
  ['chicken', /ไก่|สัตว์ปีก|ไข้หวัดนก|\bpoultry\b|\bchickens?\b|\bbroilers?\b|\bavian\b|\bNewcastle\b|\bMarek/i],
  ['fish', /ปลา(?!ย)|สัตว์น้ำ|\bfish(?:es)?\b|\baquatic\b|\btilapia\b|\bsalmon/i],
  ['sheep', /แกะ(?!สลัก|รอย)|\bovine\b|\bsheep\b|\blambs?\b|\bewes?\b/i],
  ['rat', /หนู|สัตว์ทดลอง|\brats?\b|\bmice\b|\bmouse\b|\brodents?\b|\blaboratory animals?\b/i],
  ['bird', /นก|\bparrots?\b|\bpsittac|\bbudgerigars?\b|\bcockatiels?\b|\bbirds?\b/i],
  ['turtle', /เต่า|สัตว์เลื้อยคลาน|\bturtles?\b|\btortoises?\b|\bchelonians?\b|\breptiles?\b/i],
];

function earliest(raw) {
  // rabies is โรคพิษสุนัขบ้า in Thai: the dog in its name is not the patient
  // (no look-behind in the patterns: Safari before 16.4 cannot parse one)
  const text = raw.replace(/พิษสุนัขบ้า/g, 'พิษ-บ้า');
  let best = null;
  let at = Infinity;
  for (const [key, re] of NAMES) {
    const m = re.exec(text);
    if (m && m.index < at) { at = m.index; best = key; }
  }
  return best;
}

/** @param {{ title?: string, subtitle?: string, subject?: string }} source */
export function speciesOf(source) {
  for (const field of [source?.title, source?.subtitle, source?.subject]) {
    const k = field ? earliest(String(field)) : null;
    if (k) return k;
  }
  return null;
}

/** Every species the matcher can name (each needs public/art/specimens/<key>.svg). */
export const SPECIES = NAMES.map(([key]) => key);
