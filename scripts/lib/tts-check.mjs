// Used by scripts/tts-clips.mjs --check.
// Compares a clip's script with its transcript where a wrong word changes the
// meaning: numbers, units, and English or Latin terms (drug names, organisms).
// Thai prose around them is not compared (the transcript spells it freely).
const TH_DIGIT = { ศูนย์: 0, หนึ่ง: 1, เอ็ด: 1, สอง: 2, ยี่: 2, สาม: 3, สี่: 4, ห้า: 5, หก: 6, เจ็ด: 7, แปด: 8, เก้า: 9 };
const TH_MULT = { สิบ: 10, ร้อย: 100, พัน: 1000, หมื่น: 10000, แสน: 100000, ล้าน: 1000000 };
const TH_NUM_RE = new RegExp(`(?:${[...Object.keys(TH_DIGIT), ...Object.keys(TH_MULT), 'จุด'].join('|')})+`, 'g');

// Thai number words in a run ("สี่สิบเอ็ดจุดห้า") to a number string ("41.5").
export function thaiNumber(run) {
  const [intPart, frac] = run.split('จุด');
  let total = 0, cur = 0, any = false;
  const words = intPart.match(new RegExp([...Object.keys(TH_DIGIT), ...Object.keys(TH_MULT)].join('|'), 'g')) || [];
  for (const w of words) {
    any = true;
    if (w in TH_DIGIT) cur = TH_DIGIT[w];
    else {
      const m = TH_MULT[w];
      if (m === 10 && cur === 0) cur = 1;
      total += cur * m; cur = 0;
    }
  }
  total += cur;
  let s = any ? String(total) : '';
  if (frac != null) {
    const d = (frac.match(new RegExp(Object.keys(TH_DIGIT).join('|'), 'g')) || []).map((w) => TH_DIGIT[w]).join('');
    s = `${s || '0'}.${d}`;
  }
  return s;
}

// A transcript of Thai speech writes a number the voice said in English as
// English words ("Three point one", "Asia One"; 16 Nov 2026 ledger).
const EN_ONES = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 };
const EN_TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const EN_WORD = new RegExp(`^(?:${[...Object.keys(EN_ONES), ...Object.keys(EN_TENS), 'hundred', 'thousand', 'point', 'and'].join('|')})$`);

// English number words in a text to number strings: "twenty four" 24, "three point one" 3.1.
export function englishNumbers(text) {
  const out = [];
  // Punctuation ends a number ("three point one, one hundred"); a hyphen inside one does not ("twenty-four").
  const words = String(text).toLowerCase().replace(/([a-z])-(?=[a-z])/g, '$1 ').match(/[a-z]+|[^a-z\s]/g) || [];
  for (let i = 0; i < words.length;) {
    if (!EN_WORD.test(words[i]) || words[i] === 'and' || words[i] === 'point') { i++; continue; }
    let total = 0, cur = 0, j = i, frac = null;
    for (; j < words.length && EN_WORD.test(words[j]); j++) {
      const w = words[j];
      if (w === 'and') continue;
      if (w === 'point') {
        frac = '';
        for (j++; j < words.length && words[j] in EN_ONES && EN_ONES[words[j]] < 10; j++) frac += EN_ONES[words[j]];
        break;
      }
      if (w in EN_ONES) cur += EN_ONES[w];
      else if (w in EN_TENS) cur += EN_TENS[w];
      else if (w === 'hundred') cur = (cur || 1) * 100;
      else if (w === 'thousand') { total += (cur || 1) * 1000; cur = 0; }
    }
    out.push(String(Number(frac ? `${total + cur}.${frac}` : total + cur)));
    i = Math.max(j, i + 1);
  }
  return out;
}

export function numbersIn(text, { thaiWords = false } = {}) {
  const out = (String(text).replace(/(\d),(\d{3})/g, '$1$2').match(/\d+(?:\.\d+)?/g) || []).map((n) => String(Number(n)));
  if (thaiWords) {
    for (const run of String(text).match(TH_NUM_RE) || []) { const n = thaiNumber(run); if (n && n !== '0.') out.push(String(Number(n))); }
    out.push(...englishNumbers(text));
  }
  return out;
}

const UNITS = ['มิลลิกรัม', 'กิโลกรัม', 'ไมโครกรัม', 'กรัม', 'มิลลิลิตร', 'ลิตร', 'เซนติเมตร', 'มิลลิเมตร', 'เปอร์เซ็นต์', 'องศาเซลเซียส', 'ชั่วโมง', 'นาที', 'วินาที', 'สัปดาห์', 'วัน', 'เดือน', 'ปี', 'ครั้ง'];
const UNIT_ALIASES = { มิลลิกรัม: ['mg', 'มก'], กิโลกรัม: ['kg', 'กก', 'โล'], มิลลิลิตร: ['ml', 'มล', 'ซีซี', 'cc'], เปอร์เซ็นต์: ['%', 'เปอร์เซน'], องศาเซลเซียส: ['องศา', '°'], ไมโครกรัม: ['mcg', 'µg'] };
export const unitsIn = (text) => UNITS.filter((u) => String(text).includes(u) && !UNITS.some((v) => v !== u && v.includes(u) && String(text).includes(v) && String(text).split(v).join('').indexOf(u) < 0));

const lev = (a, b) => {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
};
const skeleton = (w) => w.toLowerCase().replace(/[^a-z]/g, '').replace(/([tp])h/g, '$1').replace(/(?!^)[aeiouy]/g, '').replace(/(.)\1+/g, '$1');
// English and Latin words of four letters or more, and acronyms of two or more capitals.
export const termsIn = (text) => [...new Set(String(text).match(/[A-Za-z][A-Za-z-]{3,}|[A-Z]{2,}/g) || [])];

// The usual Thai spelling of a term a transcript of Thai speech writes in Thai
// script ("ไวรัส" for virus). The 16 Nov 2026 Swine run failed 240 checks;
// a second transcription showed most were words like these, said right.
// tests/unit/tts-check.test.mjs.
export const THAI_SPELLING = {
  virus: ['ไวรัส'], vaccine: ['วัคซีน'], protein: ['โปรตีน'], fiber: ['ไฟเบอร์'], fibre: ['ไฟเบอร์'],
  antibody: ['แอนติบอดี'], antigen: ['แอนติเจน'], toxin: ['ท็อกซิน', 'ทอกซิน'], bacteria: ['แบคทีเรีย'],
  ileum: ['อีเลียม', 'อีเลี่ยม', 'ไอเลียม'], serum: ['ซีรัม', 'ซีรั่ม'], cell: ['เซลล์'], tissue: ['ทิชชู'],
  colostrum: ['โคลอสตรัม'], cilia: ['ซีเลีย'], mycoplasma: ['ไมโคพลาสมา'], asia: ['เอเชีย'],
  serotype: ['ซีโรไทป์'], elisa: ['เอไลซ่า', 'อีไลซ่า', 'อิไลซ่า', 'อีไลซา'], insulin: ['อินซูลิน'],
  hormone: ['ฮอร์โมน'], enzyme: ['เอนไซม์'], plasma: ['พลาสมา'], gene: ['ยีน'], vitamin: ['วิตามิน'],
};

const LETTER_TH = { A: 'เอ', B: 'บี', C: 'ซี', D: 'ดี', E: 'อี', F: 'เอฟ', G: 'จี', H: 'เอช', I: 'ไอ', J: 'เจ', K: 'เค', L: 'แอล', M: 'เอ็ม', N: 'เอ็น', O: 'โอ', P: 'พี', Q: 'คิว', R: 'อาร์', S: 'เอส', T: 'ที', U: 'ยู', V: 'วี', W: 'ดับเบิลยู', X: 'เอ็กซ์', Y: 'วาย', Z: 'แซด' };

// Whether a term is heard in one transcript: in Latin letters (case-insensitive,
// a small edit distance, or the same consonants in the same order), or as its
// usual Thai spelling.
export function termHeard(term, transcript) {
  const t = String(transcript || '');
  const w = term.toLowerCase();
  const plain = w.replace(/[^a-z]/g, '');
  const flat = t.toLowerCase().replace(/[^a-z]/g, '');
  if (plain && flat.includes(plain)) return true;
  if ((THAI_SPELLING[plain] || []).some((s) => t.includes(s))) return true;
  // An acronym the voice spells letter by letter (tts-respell.mjs), written back as Thai letter names ("เอพีพี").
  if (/^[A-Z][A-Z0-9-]*[A-Z0-9]$/.test(term) && /[A-Z].*[A-Z]/.test(term)) {
    const names = term.replace(/[^A-Z]/g, '').split('').map((c) => LETTER_TH[c]).join('');
    if (t.replace(/\s+/g, '').includes(names)) return true;
  }
  const words = (t.match(/[A-Za-z][A-Za-z-]*/g) || []).map((x) => x.toLowerCase());
  // A transcript spells a Latin name it does not know by ear ("hyorhinis" as
  // "Hirohinis"): the same consonants in the same order pass. One letter more
  // is too loose: ampicillin is one consonant away from amoxicillin.
  const sk = skeleton(w);
  return words.some((x) => lev(x, w) <= Math.max(1, Math.floor(w.length * 0.15)) || (sk.length >= 3 && skeleton(x) === sk))
    || (plain.length >= 8 && [...Array(Math.max(0, flat.length - plain.length + 3)).keys()].some((i) => lev(flat.slice(i, i + plain.length), plain) <= Math.floor(plain.length * 0.1)));
}

/**
 * The check of one clip against one or more transcripts of it.
 * { ok, problems: [{ kind, want, got }], unverified: [term] }
 * Numbers and units are strict: one missing from every transcript fails the
 * clip (it is voiced again). A term no transcript confirms is unverified: the
 * clip passes and the term is listed for a listening check, because the
 * transcribers write Latin names and English words they do not know by ear in
 * their own way (16 Nov 2026: 17 of 29 sampled failures were the check's own,
 * 3 were the voice, 9 need an ear).
 */
export function compare(script, transcript) {
  const all = (Array.isArray(transcript) ? transcript : [transcript]).map((x) => String(x || '')).filter((x) => x.trim());
  if (!all.length) return { ok: false, problems: [{ kind: 'empty' }], unverified: [] };
  const problems = [];
  const unverified = [];
  // Numbers: each transcript on its own, so two transcripts cannot add up to one reading.
  const want = numbersIn(script);
  let numberProblems = null;
  for (const t of all) {
    const got = numbersIn(t, { thaiWords: true });
    const pool = [...got];
    const miss = [];
    for (const n of want) { const k = pool.indexOf(n); if (k >= 0) pool.splice(k, 1); else miss.push({ kind: 'number', want: n, got: got.join(' ') }); }
    if (!numberProblems || miss.length < numberProblems.length) numberProblems = miss;
  }
  problems.push(...numberProblems);
  const lower = all.map((t) => t.toLowerCase());
  for (const u of unitsIn(script)) {
    const ok = all.some((t) => t.includes(u)) || (UNIT_ALIASES[u] || []).some((a) => lower.some((t) => t.includes(a.toLowerCase())));
    if (!ok) problems.push({ kind: 'unit', want: u });
  }
  for (const term of termsIn(script)) if (!all.some((t) => termHeard(term, t))) unverified.push(term);
  return { ok: problems.length === 0, problems, unverified };
}

// Whether a clip's text holds something a wrong word would change: a digit,
// a unit, an English or Latin term.
export const risky = (text) => /\d/.test(text) || unitsIn(text).length > 0 || termsIn(text).length > 0;
