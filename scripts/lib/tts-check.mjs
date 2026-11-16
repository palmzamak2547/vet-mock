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

export function numbersIn(text, { thaiWords = false } = {}) {
  const out = (String(text).replace(/(\d),(\d{3})/g, '$1$2').match(/\d+(?:\.\d+)?/g) || []).map((n) => String(Number(n)));
  if (thaiWords) for (const run of String(text).match(TH_NUM_RE) || []) { const n = thaiNumber(run); if (n && n !== '0.') out.push(String(Number(n))); }
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

/** { ok, problems: [{ kind, want, got }] } */
export function compare(script, transcript) {
  const problems = [];
  const t = String(transcript || '');
  if (!t.trim()) return { ok: false, problems: [{ kind: 'empty' }] };
  const want = numbersIn(script);
  const got = numbersIn(t, { thaiWords: true });
  const pool = [...got];
  for (const n of want) {
    const k = pool.indexOf(n);
    if (k >= 0) pool.splice(k, 1); else problems.push({ kind: 'number', want: n, got: got.join(' ') });
  }
  for (const u of unitsIn(script)) {
    const ok = t.includes(u) || (UNIT_ALIASES[u] || []).some((a) => t.toLowerCase().includes(a.toLowerCase()));
    if (!ok) problems.push({ kind: 'unit', want: u });
  }
  const words = (t.match(/[A-Za-z][A-Za-z-]*/g) || []).map((w) => w.toLowerCase());
  const flat = t.toLowerCase().replace(/[^a-z]/g, '');
  for (const term of termsIn(script)) {
    const w = term.toLowerCase();
    const plain = w.replace(/[^a-z]/g, '');
    if (flat.includes(plain)) continue;
    // A transcript spells a Latin name it does not know by ear ("hyorhinis" as
    // "Hyerhenes"): the same consonants in the same order pass. One letter more
    // is too loose: ampicillin is one consonant away from amoxicillin.
    const sk = skeleton(w);
    const near = words.some((x) => lev(x, w) <= Math.max(1, Math.floor(w.length * 0.15)) || (sk.length >= 3 && skeleton(x) === sk))
      || (plain.length >= 8 && [...Array(Math.max(0, flat.length - plain.length + 3)).keys()].some((i) => lev(flat.slice(i, i + plain.length), plain) <= Math.floor(plain.length * 0.1)));
    if (!near) problems.push({ kind: 'term', want: term });
  }
  return { ok: problems.length === 0, problems };
}

// Whether a clip's text holds something a wrong word would change: a digit,
// a unit, an English or Latin term.
export const risky = (text) => /\d/.test(text) || unitsIn(text).length > 0 || termsIn(text).length > 0;
