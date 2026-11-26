// Shared utility functions

export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const fmtTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

// Days are Bangkok's calendar days (UTC+7, no daylight saving), never the
// device's midnight: a phone or a CI runner set to UTC put 01:00 in Bangkok on
// the previous day, so a card due this morning read "เมื่อวาน".
const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
/** The Bangkok calendar day that holds an instant, as a day number. */
export const bangkokDayNumber = (ts) => Math.floor((new Date(ts).getTime() + BANGKOK_OFFSET_MS) / DAY_MS);
/** Epoch ms of the Bangkok midnight that starts a day number. */
const bangkokDayStart = (day) => day * DAY_MS - BANGKOK_OFFSET_MS;

export const fmtDate = (ts, now = Date.now()) => {
  const diffDays = bangkokDayNumber(ts) - bangkokDayNumber(now);
  if (diffDays === 0) return 'วันนี้';
  if (diffDays === 1) return 'พรุ่งนี้';
  if (diffDays === -1) return 'เมื่อวาน';
  if (diffDays > 0) return `อีก ${diffDays} วัน`;
  return `${Math.abs(diffDays)} วันที่แล้ว`;
};

// ── Fill-in-the-blank ────────────────────────────────────────────────
// One rule for the client and the server: api/_lib/exam-scoring.js imports
// isCorrect from here, so the leaderboard re-scores with this same code.

// Two Thai spellings that look the same on screen and differ in code points,
// so a student who typed the key was marked wrong: SARA AM typed as NIKHAHIT
// plus SARA AA (U+0E4D U+0E32, some keyboards and input methods), with or
// without a tone mark between or before them; and a tone mark (or the
// thanthakhat) typed before the vowel above or below the same consonant,
// which NFC does not reorder because those vowels have no combining class.
// One fixed form for both, applied to the answer and the key alike: a text
// that already matched still matches (the same input gives the same output).
const thaiSpelling = (s) => s
  .replace(/ํ([่-๋]?)า/g, '$1ำ')
  .replace(/([่-๋])ํา/g, '$1ำ')
  .replace(/([่-์])([ัิ-ฺ็])/g, '$2$1');

// Case, spacing, dash style and Thai digits are writing, not knowledge.
const normFill = (s) => thaiSpelling(String(s ?? '')
  .normalize('NFC'))
  .toLowerCase()
  .replace(/[๐-๙]/g, (d) => String(d.charCodeAt(0) - 0x0e50))
  .replace(/[‐-―−]/g, '-')
  .replace(/\s+/g, ' ')
  .trim();

// A key made only of numbers joined by : or - ("15", "2:1", "80-100").
const NUMERIC_KEY = /^\d+(?:\.\d+)?(?:\s*[:-]\s*\d+(?:\.\d+)?)*$/;
// A number in the typed answer. A digit glued to a Latin letter is part of a
// code or a unit ("m2", "C1", "H5"), not a second number. A Thai letter does
// not count: Thai has no spaces between words, so "ประมาณ15" is 15.
// (No lookbehind: the support floor is iOS 14. The character before the
// number is captured instead, and the number is group 2.)
const NUMBER_IN_ANSWER = /(^|[^a-z\d.])(\d+(?:\.\d+)?(?:\s*[:-]\s*\d+(?:\.\d+)?)*)/g;
const numberParts = (s) => {
  const nums = s.split(/\s*[:-]\s*/).map(Number);
  const seps = s.match(/[:-]/g) || [];
  return { nums, seps };
};

// B01/B46: containment let "2500" stand for 250, "150" for 15 and "10 ml"
// for 1 ml. A number is right only when the answer holds exactly one number
// and it is the key: units, spacing and "ถึง"/"to" for a range are allowed.
function numericBlankCorrect(u, key, stemNumbers = null) {
  // Thousands separators only in a whole group: "2,500,000" is 2500000, "1.2,500,000" stays three numbers,
  // and a comma that opens a clause ("1,000, based on") ends the number.
  const text = u
    .replace(/(^|[^\d.,])(\d{1,3}(?:,\d{3})+)(?!\d|,\d)/g, (m, before, n) => before + n.replace(/,/g, ''))
    .replace(/(\d)\s*(?:ถึง|to|~)\s*(\d)/g, '$1-$2');
  let found = [...text.matchAll(NUMBER_IN_ANSWER)].map((m) => ({ n: m[2], at: m.index + m[1].length }));
  // A number the stem itself prints ("dose ___ ml/100 kg", "ตอบในรูป x:1") is
  // not held against a student who copies the unit: "1 ml/100 kg" is 1. Only
  // when that leaves exactly one number, so "1 ml/10 kg" and "100" stay wrong.
  if (found.length > 1 && stemNumbers?.size) {
    const own = found.filter((f) => !stemNumbers.has(f.n));
    if (own.length === 1) found = own;
  }
  if (found.length !== 1) return false;
  // "ไม่ใช่ 15" says the answer is not 15.
  if (NEGATED.test(text.slice(0, found[0].at))) return false;
  const a = numberParts(found[0].n);
  const k = numberParts(key);
  return a.nums.length === k.nums.length
    && a.seps.join('') === k.seps.join('')
    && a.nums.every((n, i) => n === k.nums[i]);
}

const LATIN_WORD = /[a-z0-9]/;
// "hips" for hip, "condyles" for condyle: an English plural ending is still
// the key. Only s or es, and only when the word ends there.
const PLURAL_TAIL = /^(?:s|es)(?![a-z0-9])/;
// "not" right before the key, also across a bracket, colon or quote ("not (15 mg)", "ไม่ใช่:15").
const NEGATED = /(?:ไม่\s*ใช่|มิ\s*ใช่|ไม่)[\s([:"'“‘]*$|(?:^|[^a-z])(?:not|no|non)[\s\-([:"'“‘]*$/;

// Where the key found at `at` ends, a plural ending included, or -1 when it is
// only the inside of a longer word, code or decimal ("S55" for S5,
// "noncohesive" for cohesive, "2/1.5", "1.2/1" or ".2/1" for 2/1).
function keyEnd(u, bl, at) {
  const last = bl[bl.length - 1];
  if (at > 0 && LATIN_WORD.test(u[at - 1]) && LATIN_WORD.test(bl[0])) return -1;
  if (/\d/.test(bl[0]) && u[at - 1] === '.') return -1;
  const end = at + bl.length;
  const tail = /[a-z]/.test(last) ? u.slice(end).match(PLURAL_TAIL) : null;
  if (tail) return end + tail[0].length;
  if (end < u.length && LATIN_WORD.test(u[end]) && LATIN_WORD.test(last)) return -1;
  if (/\d/.test(last) && /^\.\d/.test(u.slice(end))) return -1;
  return end;
}

// Writing MORE than the key is fine: "the lateral condyle" still names the
// lateral condyle. It is not fine when the key is only the inside of a
// longer word or code, or when the answer says it is NOT the key ("ไม่ใช่ตับอ่อน").
function containsKey(u, bl) {
  for (let at = u.indexOf(bl); at >= 0; at = u.indexOf(bl, at + 1)) {
    if (keyEnd(u, bl, at) >= 0 && !NEGATED.test(u.slice(0, at))) return true;
  }
  return false;
}

// One blank takes one answer. "Piperazine หรือ Levamisole" names two drugs, and
// because it holds the key as a whole word it scored as right: a student could
// list every candidate. An answer that joins alternatives (หรือ, or, a slash) is
// right only when every alternative is itself a right answer for the blank
// ("Act / Action"). A comma is not a joiner: in "Schirmer tear test, the
// standard test for tear production" it opens an explanation, and nothing tells
// that apart from a list.
// "or" as a word, also after a bracket, comma, colon or slash: "Piperazine (or Levamisole)", "and/or".
// Not after a dash: "Odds ratio—OR measures association" names one thing.
const WORD_JOINER = /\s*หรือ\s*|(?:^|[\s([{,;:/])or(?![a-z0-9])\s*/;
const JOINER = new RegExp(`${WORD_JOINER.source}|\\s*\\/\\s*`);
// Units a dose, a count or a rate writes after a slash ("mg/kg", "CFU/mL", "2 ครั้ง/วัน").
const SLASH_UNITS = new Set(['ml', 'dl', 'ul', 'µl', 'μl', 'kg', 'mg', 'mcg', 'µg', 'μg', 'ug', 'ng', 'lb', 'min', 'mins',
  'minute', 'minutes', 'hr', 'hrs', 'hour', 'hours', 'day', 'days', 'wk', 'week', 'weeks', 'month', 'months', 'yr',
  'year', 'years', 'sec', 'second', 'seconds', 'cell', 'cells', 'dose', 'doses', 'head', 'unit', 'units', 'mmol',
  'meq', 'kcal', 'iu', 'beats', 'breaths', 'copies', 'hpf', 'liter', 'litre', 'milliliter', 'millilitre', 'gram',
  'kilogram', 'milligram', 'วัน', 'ครั้ง', 'ชั่วโมง', 'ชม', 'ชม.', 'นาที', 'วินาที', 'สัปดาห์', 'เดือน', 'ปี', 'ตัว',
  'กรัม', 'ลิตร', 'มิลลิลิตร', 'ไมโครลิตร', 'กิโลกรัม', 'กก', 'กก.', 'มก', 'มก.', 'มล', 'มล.']);
// A word of its own: letters only, not a unit, and in Latin three letters or more (Na, K, M are symbols).
const plainWord = (t) => /^\p{L}[\p{L}\p{M}]*$/u.test(t) && !SLASH_UNITS.has(t) && (/[^a-z]/.test(t) || t.length >= 3);
// A slash joins two answers where a right answer stands on one side of it and no unit on the other
// ("IgG/IgM", "IgG/M", "H5/H7", "T3/T4" for T3, "ไต/ตับ"; but "CFU/mL" and "Ketamine/kg" are one answer),
// and between two plain words outside brackets ("Piperazine citrate / Levamisole", "ไต/เนื้อตับ"). Elsewhere it
// belongs to a unit, ratio or code in one answer: "Ketamine 10 mg/kg/day", "thyroid hormone (T3/T4)",
// "(Na+/K+ ATPase)", "Clavamox (amoxicillin/clavulanate)". Each side is read only as far as the longest right
// answer reaches, so a long answer costs no more.
function keepAnswerSlashes(s, right) {
  const reach = Math.max(12, ...right.map((f) => f.length)) + 8;
  const endsWithRight = (b) => right.some((f) => [f, `${f}s`, `${f}es`]
    .some((g) => b.endsWith(g) && keyEnd(b, f, b.length - g.length) >= 0));
  const startsWithRight = (a) => right.some((f) => a.startsWith(f) && keyEnd(a, f, 0) >= 0);
  let out = '';
  let from = 0;
  let depth = 0;
  let seen = 0;
  for (let at = s.indexOf('/'); at >= 0; at = s.indexOf('/', at + 1)) {
    for (; seen < at; seen++) {
      if (s[seen] === '(' || s[seen] === '[') depth++;
      else if ((s[seen] === ')' || s[seen] === ']') && depth > 0) depth--;
    }
    // Each side without the spaces, further slashes and brackets right beside the slash.
    const before = s.slice(Math.max(0, at - reach), at).replace(/[\s/)\]]+$/, '');
    const after = s.slice(at + 1, at + 1 + reach).replace(/^[\s/([]+/, '');
    const leftWord = before.match(/[\p{L}\p{M}\d.]*$/u)[0];
    const rightWord = after.match(/^[\p{L}\p{M}\d.]*/u)[0];
    const joins = /\u0000$/.test(before) || /^(?:\u0000|or(?![a-z0-9]))/.test(after)
      || (endsWithRight(before) && !SLASH_UNITS.has(rightWord))
      || (startsWithRight(after) && !SLASH_UNITS.has(leftWord))
      || (depth === 0 && plainWord(leftWord) && plainWord(rightWord));
    if (joins) continue;
    out += `${s.slice(from, at)}\u0001`;
    from = at + 1;
  }
  return out + s.slice(from);
}
// The alternatives of an answer. A piece with no letter or digit is not one: "odds ratio (OR)".
const splitAlternatives = (s, joiner, right = null) => (right ? keepAnswerSlashes(s, right) : s).split(joiner)
  .map((part) => part.replace(/\u0001/g, '/').trim())
  .filter((part) => /[\p{L}\p{N}]/u.test(part));
// Every whole occurrence of a right answer (as containsKey finds it) put away as one token.
function maskKey(s, key, i) {
  let out = '';
  let from = 0;
  for (let at = s.indexOf(key); at >= 0; at = s.indexOf(key, at + 1)) {
    const end = at >= from ? keyEnd(s, key, at) : -1;
    if (end < 0) continue;
    out += `${s.slice(from, at)}\u0000${i}\u0000`;
    from = end;
  }
  return out + s.slice(from);
}
function namesAnother(u, bl, right, stemNumbers = null) {
  // A right answer that holds a joiner of its own ("2/1", "กินหรือดื่ม") is one
  // alternative: it is set aside whole before the answer is split, so "2/1" is
  // one answer and "2/1 or 8/1" is still two.
  let text = u;
  right.forEach((key, i) => {
    if (JOINER.test(key)) text = maskKey(text, key, i);
  });
  const parts = splitAlternatives(text, JOINER, right);
  if (parts.length < 2) return false;
  // Each alternative by the rule of the key it names: a number by the number
  // rule ("2:1.5" is not 2:1), and a form set aside above must not be negated.
  const isRight = (part) => {
    const masks = [...part.matchAll(/\u0000\d+\u0000/g)];
    if (masks.length) return !masks.some((m) => NEGATED.test(part.slice(0, m.index)));
    return right.some((key) => (NUMERIC_KEY.test(key)
      ? numericBlankCorrect(part, key, stemNumbers)
      : part === key || (part.length >= 3 && containsKey(part, key))));
  };
  return !parts.every(isRight);
}

// `also`: the blank's other right answers (the key and its accept entries), so
// an answer that offers two of them is not read as a hedge.
function blankMatches(rawAnswer, rawKey, allowFragment = true, stemNumbers = null, also = null) {
  const u = normFill(rawAnswer);
  const bl = normFill(rawKey);
  // A blank holds a word or a short phrase, and the field takes 200 characters. Far longer text is not
  // an answer, and the server re-score, which takes any stored answer, never spends time on it.
  if (!u || u.length > 1000) return false;
  if (u === bl) return true;
  // A number blank takes one number, so every alternative that holds a number
  // must be that number ("15 mg หรือ 15mg"); words beside it are not a second
  // answer ("odds ratio (OR) 2.5"). A slash is not split here: "1 ml/100 kg" is one dose.
  if (NUMERIC_KEY.test(bl)) {
    const parts = splitAlternatives(u, WORD_JOINER).filter((part) => /\d/.test(part));
    return parts.length > 0 && parts.every((part) => numericBlankCorrect(part, bl, stemNumbers));
  }
  if (u.length < 3) return false;
  if (containsKey(u, bl)) return !namesAnother(u, bl, [bl, ...(also || []).map(normFill)], stemNumbers);
  // Writing LESS used to be fine too, and that was the bug: any three
  // characters of the key scored full marks. Measured on the corpus,
  // 36 of 60 blanks accepted their own first three letters — "lat" for
  // lateral condyle, "vas" for vastus lateralis, "ตับ" for ตับอ่อน,
  // which is a different organ. A fragment is not an answer.
  //
  // Short-of-the-key is still allowed when it covers most of it, so a
  // student who drops a qualifier ("reticuloperitonitis" for
  // "traumatic reticuloperitonitis") is not punished for it.
  return allowFragment && bl.includes(u) && u.length >= bl.length * 0.6;
}

// The stem text printed right before blank i ("วางด้าน ____" → "วางด้าน").
function textBeforeBlank(stem, i) {
  const marks = [...String(stem || '').matchAll(/_{3,}/g)];
  const mark = marks[i];
  if (!mark) return '';
  const start = i > 0 ? marks[i - 1].index + marks[i - 1][0].length : 0;
  return normFill(stem.slice(start, mark.index));
}

// B46: the key of 32 is "ด้านหน้า" and the stem already prints "วางด้าน ____",
// so "หน้า" is the answer the stem asks for. When the key opens with the word
// the stem ends on, the rest of the key is accepted as well.
function stemEchoRest(stem, i, key) {
  const before = textBeforeBlank(stem, i);
  const bl = normFill(key);
  if (!before || !bl) return null;
  const lastWord = before.split(' ').pop();
  for (let n = Math.min(lastWord.length, bl.length - 2); n >= 3; n--) {
    const echo = bl.slice(0, n);
    if (!lastWord.endsWith(echo)) continue;
    // Latin: only a whole word of the key, and only the whole last word.
    if (/[a-z]/.test(echo) && (echo !== lastWord || bl[n] !== ' ')) continue;
    const rest = bl.slice(n).trim();
    return rest.length >= 2 ? rest : null;
  }
  return null;
}

// Numbers the stem prints anywhere (units such as "ml/100 kg", formats such as "x:1").
function stemNumbersOf(stem) {
  return new Set([...normFill(stem).matchAll(NUMBER_IN_ANSWER)].map((m) => m[2]));
}

// The negation the stem prints right before the blank ("ทำให้สัตว์น้ำไม่ ____").
const STEM_NEGATION = /(ไม่ใช่|มิใช่|ไม่)\s*$|(?:^|[^a-z])(not|no|non)[\s-]*$/;

// q.accept: extra right answers for a blank, by blank index ({ 3: ['Act'] } for
// the key "Action"). Each is written by hand for one item and matched by the
// same rules as the key. There is no fuzzy matching: Linoleic and linolenic are
// one letter apart and are different acids.
function acceptedFor(q, i) {
  const list = q?.accept && typeof q.accept === 'object' ? q.accept[i] : null;
  return Array.isArray(list) ? list.filter((a) => typeof a === 'string' && a.trim()) : [];
}

function blankCorrect(q, i, answer, key) {
  const accepted = acceptedFor(q, i);
  if (keyCorrect(q, answer, key, textBeforeBlank(q.q, i), stemEchoRest(q.q, i, key), accepted)) return true;
  const all = [key, ...accepted];
  return accepted.some((a) => keyCorrect(q, answer, a, textBeforeBlank(q.q, i), null, all));
}

// One right answer (the key, or an accept entry) against what was typed.
// `before` is the stem text in front of the blank, `rest` the key without the
// word the stem already prints, `also` the blank's other right answers.
function keyCorrect(q, answer, key, before, rest, also) {
  if (blankMatches(answer, key, true, stemNumbersOf(q.q), also)) return true;
  // A student who writes the stem's own negation with the key ("ไม่กินกันเอง"
  // for "ไม่ ____" = กินกันเอง) is answering, not negating: drop the echo.
  const neg = before.match(STEM_NEGATION);
  const said = normFill(answer);
  const echo = neg && (neg[1] || neg[2]);
  const tail = echo && said.startsWith(echo) ? said.slice(echo.length) : null;
  if (tail !== null && !/^\s*ใช่/.test(tail) && blankMatches(tail, key, true, null, also)) return true;
  // The rest is short ("หน้า"), so a fragment of it ("น้า") is not it.
  return rest !== null && blankMatches(answer, rest, false, null, [key, ...also]);
}

// q.unordered: true when every blank is one set, or a list of index groups
// ([[0,1,2,3]]) when only some blanks are ("Quality ____" ×4, then "และ ____").
function unorderedGroups(q) {
  const n = q.blanks.length;
  if (q.unordered === true) return [q.blanks.map((_, i) => i)];
  if (!Array.isArray(q.unordered)) return [];
  const used = new Set();
  const groups = [];
  for (const g of q.unordered) {
    if (!Array.isArray(g)) continue;
    const idx = g.filter((i) => Number.isInteger(i) && i >= 0 && i < n && !used.has(i));
    idx.forEach((i) => used.add(i));
    if (idx.length > 1) groups.push(idx);
  }
  return groups;
}

// The best pairing of a group's typed answers with its keys, each key used
// once (augmenting paths, so it is a maximum pairing). Returns the positions
// whose answer is paired with a key. Scoring and the marks both read it, so
// the marks can never disagree with the score.
function groupPairing(q, idx, ua) {
  return new Set(groupOwners(q, idx, ua).filter((a) => a !== -1).map((a) => idx[a]));
}

// For each key slot of the group, the answer slot the pairing gave it (-1: none).
function groupOwners(q, idx, ua) {
  const owner = new Array(idx.length).fill(-1); // key slot -> answer slot
  const tryPlace = (a, seen) => {
    for (let k = 0; k < idx.length; k++) {
      if (seen[k] || !blankCorrect(q, idx[k], ua[idx[a]], q.blanks[idx[k]])) continue;
      seen[k] = true;
      if (owner[k] === -1 || tryPlace(owner[k], seen)) { owner[k] = a; return true; }
    }
    return false;
  };
  for (let a = 0; a < idx.length; a++) tryPlace(a, new Array(idx.length).fill(false));
  return owner;
}

// Each typed answer in a group must match a different key of that group.
function groupCorrect(q, idx, ua) {
  return groupPairing(q, idx, ua).size === idx.length;
}

// Which typed blanks are right, for the marks beside each blank in practice.
// Display only: isCorrect below is the score. In an unordered group a blank is
// right when the best pairing (the one scoring uses) gives it a key.
export function fillBlankMarks(q, ua) {
  if (!Array.isArray(q?.blanks)) return [];
  const answers = Array.isArray(ua) ? ua : [];
  const marks = q.blanks.map((b, i) => blankCorrect(q, i, answers[i], b));
  for (const g of unorderedGroups(q)) {
    const paired = groupPairing(q, g, answers);
    for (const i of g) marks[i] = paired.has(i);
  }
  return marks;
}

/**
 * Each blank as the reveal and Review draw it: whether it is right, the key to
 * print for it (in an unordered group, the key its answer took, or for a wrong
 * blank one of the keys nobody took, so each key prints once), and `alt` when
 * the answer is right through an accept entry and is not the key's own
 * wording. Display only, like fillBlankMarks: isCorrect is the score.
 */
export function fillBlankReport(q, ua) {
  if (!Array.isArray(q?.blanks)) return [];
  const answers = Array.isArray(ua) ? ua : [];
  const keyAt = q.blanks.map((_, i) => i);
  const ok = q.blanks.map((b, i) => blankCorrect(q, i, answers[i], b));
  for (const g of unorderedGroups(q)) {
    const owner = groupOwners(q, g, answers);
    const free = g.filter((_, k) => owner[k] === -1);
    for (const i of g) ok[i] = false;
    owner.forEach((a, k) => { if (a !== -1) { keyAt[g[a]] = g[k]; ok[g[a]] = true; } });
    for (const i of g) if (!ok[i]) keyAt[i] = free.shift();
  }
  return q.blanks.map((_, i) => {
    const k = keyAt[i];
    const key = q.blanks[k];
    const own = ok[i] && keyCorrect(q, answers[i], key, textBeforeBlank(q.q, k), stemEchoRest(q.q, k, key), acceptedFor(q, k));
    return { ok: ok[i], key, alt: ok[i] && !own };
  });
}

/** Blank indexes that may be answered in any order, as groups ([] when the order is fixed). */
export function fillUnorderedGroups(q) {
  return Array.isArray(q?.blanks) ? unorderedGroups(q) : [];
}

/** The longest text a fill-in blank or a tfc correction takes: room for any term, never a paste that outweighs the paper. */
export const TYPED_MAX_CHARS = 200;

/** Whether a blank's key is a number, a ratio or a range, for a field half the row wide. */
export function fillBlankNumeric(q, i) {
  return NUMERIC_KEY.test(normFill(q?.blanks?.[i]));
}

/** Whether the phone's decimal keypad can type the blank's key. The keypad has digits and a point only,
 *  so a ratio ("2:1") or a range ("80-100") keeps the text keyboard. */
export function fillBlankDecimal(q, i) {
  return /^\d+(?:\.\d+)?$/.test(normFill(q?.blanks?.[i]));
}

/** How many blanks of a fill item hold text. */
export function fillFilledCount(q, ua) {
  if (!Array.isArray(q?.blanks) || !Array.isArray(ua)) return 0;
  return q.blanks.filter((_, i) => typeof ua[i] === 'string' && ua[i].trim().length > 0).length;
}

/**
 * Whether a typed question is answered in full: every blank of a fill item
 * holds text. isAnswered says yes from the first blank, which is the right rule
 * for "was anything answered" (results, the redo set) and the wrong one for the
 * exam map and the submit dialog: an item with one blank of three typed was
 * painted as done and never warned about. Every other type follows isAnswered.
 */
export function fillFilled(q, ua) {
  if (q?.type === 'fill' && Array.isArray(q.blanks) && q.blanks.length > 0) {
    return fillFilledCount(q, ua) === q.blanks.length;
  }
  // ผิด always needs its correction: the map cannot read the key to know otherwise.
  if (q?.type === 'tfc') {
    const said = tfcSaid(ua);
    return said === 'T' || (said === 'F' && typeof ua[1] === 'string' && ua[1].trim().length > 0);
  }
  return isAnswered(ua);
}

// True or false with a written correction (type 'tfc'). The answer is stored as a
// fill-in answer is, an array of strings: ['T'], or ['F', 'the correction'].
const tfcSaid = (ua) => (Array.isArray(ua) && (ua[0] === 'T' || ua[0] === 'F') ? ua[0] : null);

/**
 * How a tfc answer stands: { answered, verdict, fix, correct }.
 *   verdict  the student's ถูก/ผิด is the key's
 *   fix      'ok' | 'off' for the written correction of a false statement,
 *            'self' when the item leaves it to the student (fix.selfCheck),
 *            'none' when no correction is graded (a true key, or a wrong verdict)
 *   correct  the score, all or nothing: isCorrect returns exactly this
 * The correction is matched as a fill-in blank is: fix.right is the key and
 * fix.accept its other right answers.
 */
export function tfcOutcome(q, ua) {
  const said = tfcSaid(ua);
  if (!said || typeof q?.answer !== 'boolean') return { answered: false, verdict: false, fix: 'none', correct: false };
  const verdict = (said === 'T') === q.answer;
  if (!verdict || q.answer) return { answered: true, verdict, fix: 'none', correct: verdict };
  const fix = q.fix && typeof q.fix === 'object' ? q.fix : null;
  const text = typeof ua[1] === 'string' ? ua[1] : '';
  // An item that leaves the correction to the student still needs one written:
  // ผิด with nothing put right is not the paper's answer.
  if (fix?.selfCheck === true) return { answered: true, verdict, fix: text.trim() ? 'self' : 'off', correct: Boolean(text.trim()) };
  const right = typeof fix?.right === 'string' ? fix.right : '';
  const ok = Boolean(right.trim() && text.trim())
    && blankCorrect({ q: '', blanks: [right], accept: { 0: fix.accept } }, 0, text, right);
  return { answered: true, verdict, fix: ok ? 'ok' : 'off', correct: ok };
}

function fillCorrect(q, ua) {
  if (!Array.isArray(ua) || !Array.isArray(q.blanks)) return false;
  const groups = unorderedGroups(q);
  const inGroup = new Set(groups.flat());
  return groups.every((g) => groupCorrect(q, g, ua))
    && q.blanks.every((b, i) => inGroup.has(i) || blankCorrect(q, i, ua[i], b));
}

// ── Does a written answer mention a keyword? ───────────────────────────
// One rule for the short-answer grade below and SmartGrader's checklist.
// Case and spacing never decide it, and punctuation reads as a space on both
// sides ("T-cell" is "T cell", "10-16" is "10–16"), except a point or comma
// between two digits, which belongs to the number. Then:
//   - a number never runs on into more number: '5' is not in '15', '54',
//     '2.5' or '1,500', and '5 วัน' is not in '15 วัน'. A unit written
//     against it ('5mg') or Thai running on ('5วัน') is fine;
//   - a Latin keyword starts a word and may run on to the end of it, because
//     the bank writes stems: 'Strept' for Streptococcus, 'apx' for ApxIV,
//     'herpes' for herpesvirus, 'biolog' for biological. So 'men' is not in
//     'women', 'cat' is not in 'concatenated', 'virus' is in 'viruses', and
//     a keyword ending in s also matches without it ('cells' in 'cell');
//   - Thai runs its words together, so a Thai keyword is a plain substring.
// Character checks rather than a lookbehind: the support floor (iOS 14)
// cannot parse one (tests/unit/no-lookbehind.test.mjs).
const THAI_CHAR = /[฀-๿]/;
const DIGIT = /[0-9]/;
const LATIN_OR_DIGIT = /[a-z0-9]/;
function keywordText(s) {
  return thaiSpelling(String(s ?? '')).toLowerCase()
    .replace(/[^a-z0-9฀-๿.,\s]/g, ' ')
    .replace(/[.,]/g, (m, at, all) => (DIGIT.test(all[at - 1] || '') && DIGIT.test(all[at + 1] || '') ? m : ' '))
    .replace(/\s+/g, ' ')
    .trim();
}
// Whether a match ending in a digit continues into more number: a digit just
// outside it at `i`, or a point or comma there and a digit one step further.
const runsOnAsNumber = (hay, i, d) => DIGIT.test(hay[i] || '')
  || ((hay[i] === '.' || hay[i] === ',') && DIGIT.test(hay[i + d] || ''));
export function keywordHit(text, keyword) {
  const hay = keywordText(text);
  const key = keywordText(keyword);
  if (!key || !hay) return false;
  const latin = !THAI_CHAR.test(key) && /[a-z]/.test(key);
  const forms = latin && key.length > 3 && key.endsWith('s') ? [key, key.slice(0, -1)] : [key];
  return forms.some((form) => {
    const first = form[0];
    const last = form[form.length - 1];
    for (let at = hay.indexOf(form); at !== -1; at = hay.indexOf(form, at + 1)) {
      const before = at - 1;
      const after = at + form.length;
      if (DIGIT.test(first) && runsOnAsNumber(hay, before, -1)) continue;
      if (DIGIT.test(last) && runsOnAsNumber(hay, after, 1)) continue;
      if (latin && LATIN_OR_DIGIT.test(first) && LATIN_OR_DIGIT.test(hay[before] || '')) continue;
      return true;
    }
    return false;
  });
}

export const isCorrect = (q, ua) => {
  if (ua === null || ua === undefined) return false;
  if (q.type === 'mcq' || q.type === 'tf') return ua === q.answer;
  if (q.type === 'fill') return fillCorrect(q, ua);
  if (q.type === 'tfc') return tfcOutcome(q, ua).correct;
  if (q.type === 'match') {
    if (!ua || typeof ua !== 'object') return false;
    // รองรับทั้ง object {0:right} (เดิม) และ array [right, ...]
    const get = (i) => Array.isArray(ua) ? ua[i] : ua[i];
    return q.pairs.every((p, i) => get(i) === p.right);
  }
  if (q.type === 'short') {
    // Loose keyword match — q.keywords is an array of strings/phrases
    // student needs to mention. ≥75% coverage = "correct" (heuristic).
    // Stricter graders should self-assess in Review.
    if (typeof ua !== 'string' || !ua.trim()) return false;
    const keys = Array.isArray(q.keywords) ? q.keywords : [];
    if (keys.length === 0) return false; // ungraded — Review will self-assess
    const hit = keys.filter((k) => keywordHit(ua, k)).length;
    return hit / keys.length >= 0.75;
  }
  if (q.type === 'essay') {
    // Open-ended writing — never auto-correct. ReviewView shows the
    // model answer + rubric so the student self-assesses.
    return false;
  }
  return false;
};

// คะแนนแบบบางส่วนสำหรับจับคู่ — ใช้ใน ResultsView/ReviewView (ข้อ B: partial credit + distractors)
export function matchScore(q, ua) {
  if (!q || q.type !== 'match' || !ua || typeof ua !== 'object') return { correct: 0, total: q?.pairs?.length || 0, fraction: 0 };
  const total = q.pairs.length;
  if (total === 0) return { correct: 0, total: 0, fraction: 0 };
  let correct = 0;
  for (let i = 0; i < total; i++) {
    const val = Array.isArray(ua) ? ua[i] : ua[i];
    if (val != null && val !== '' && val === q.pairs[i].right) correct++;
  }
  return { correct, total, fraction: correct / total };
}

// True if the question is a writing-style question (short answer or
// essay). Used to (a) allocate longer per-question time, (b) trigger
// a confirm dialog when skipping blank answers, (c) exclude from the
// auto-graded percentage in ResultsView.
export const isWritingType = (q) => q?.type === 'essay' || q?.type === 'short';

/**
 * Did the student actually answer this, as opposed to leaving a value behind?
 *
 * Clearing an answer does not delete the key: emptying an essay stores '',
 * and MatchDragDrop's "ล้างทั้งหมด" stores {}. Every count in ExamView asked
 * `answers[q.id] !== undefined`, which both of those pass — so the
 * submit-confirm reported cleared questions as answered and, because it
 * derived "remaining" from that, suppressed its own "you left N blank"
 * warning at the exact moment it was needed. useExamSession and ResultsView
 * already knew better and checked for blankness; this is that same rule, in
 * one place, so the screens cannot drift apart again.
 */
export const isAnswered = (ua) => {
  if (ua === undefined || ua === null) return false;
  if (typeof ua === 'string') return ua.trim().length > 0;
  // Fill-in-the-blank stores one string per blank. A blank that was typed
  // into and then deleted is [''] — an array with a key, so the object rule
  // below counted it as answered and the submit dialog stopped warning
  // about it in the one shape it was written to catch.
  if (Array.isArray(ua)) return ua.some((v) => (typeof v === 'string' ? v.trim().length > 0 : v != null));
  // Match questions store a pair map; an empty one is a cleared question.
  if (typeof ua === 'object') return Object.keys(ua).length > 0;
  return true; // numbers (MCQ index, including 0) and booleans (true/false)
};

/**
 * Where a question lands after submit: 'skipped', 'correct' or 'wrong'.
 *
 * Results and Review used to test `!== undefined`, so an answer typed and then
 * erased, which the submit dialog had just called unanswered, sat under ผิด,
 * joined the redo-wrong set and was missing from ข้าม. Skipped means what the
 * dialog means by it. A cleared answer does not join the redo-wrong set, the
 * same as a question never touched: that set is the questions answered wrong.
 */
export const answerOutcome = (q, ua) => {
  if (!isAnswered(ua)) return 'skipped';
  return isCorrect(q, ua) ? 'correct' : 'wrong';
};

/**
 * Review's bucket for a question: answerOutcome, plus 'self' for a written
 * answer. Results keeps essays and short answers out of the score and says
 * they are checked against the rubric; Review called them ✗ ผิด, because an
 * essay is never auto-correct and 14 short items fail their own model answer
 * on the keyword count. A written answer is graded by the student.
 */
export const reviewOutcome = (q, ua) => {
  if (!isAnswered(ua)) return 'skipped';
  if (isWritingType(q)) return 'self';
  return isCorrect(q, ua) ? 'correct' : 'wrong';
};

// Per-question time allocation. The Final exam is 2 hours for ~20
// short answers + 1 essay (~5 min/short + ~25 min/essay), so when
// the user sets a base time-per-question we scale it for writing
// types so a 60-second-per-MCQ default doesn't cripple the essay.
//   MCQ / T/F / fill / match → user's base value (e.g., 60s)
//   short                    → max(base × 3, 180s = 3 min)
//   essay                    → max(base × 25, 1500s = 25 min)
// Returns 0 if the user disabled the timer entirely.
export function timeForQuestion(q, baseSeconds) {
  if (!baseSeconds || baseSeconds <= 0) return 0;
  if (!q) return baseSeconds;
  if (q.type === 'essay') return Math.max(baseSeconds * 25, 25 * 60);
  if (q.type === 'short') return Math.max(baseSeconds * 3, 3 * 60);
  if (q.type === 'match') {
    // จับคู่ใช้เวลามากกว่า MCQ ตามจำนวนคู่ + ตัวลวง (timed mode)
    // base 60s + 15s ต่อคู่ (ceil 5 คู่ ~ 135s) เพื่อไม่ให้ timed mock กดดันเกิน
    const n = Array.isArray(q.pairs) ? q.pairs.length : 0;
    const extra = Array.isArray(q.distractors) ? q.distractors.length : 0;
    const perPair = 15;
    return Math.max(baseSeconds, baseSeconds + Math.max(0, (n + Math.min(extra, 2) - 2)) * perPair);
  }
  if (q.type === 'fill') {
    // 15 s for each blank after the first, the step matching uses per pair:
    // five blanks had the 60 s of one.
    const n = Array.isArray(q.blanks) ? q.blanks.length : 0;
    return baseSeconds + Math.max(0, n - 1) * 15;
  }
  // One typed field on top of the tap, whatever the key: the time must not hint at it.
  if (q.type === 'tfc') return baseSeconds + 15;
  return baseSeconds;
}

/**
 * The least and the most a whole-set clock gives `count` questions drawn from
 * `pool`. The clock adds up timeForQuestion over the draw, and written and
 * matching items get more than the base, so count × base is only the least:
 * "สอบจริง 50" on Swine Clinic read 50 minutes and could run 67. Without a
 * pool (still counting) it is count × base, as before.
 */
export function wholeSetTime(pool, count, baseSeconds) {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  const base = Number(baseSeconds) || 0;
  if (!Array.isArray(pool) || !pool.length) {
    const total = Math.max(0, Math.round(n * base));
    return { min: total, max: total };
  }
  const allowances = pool.map((q) => timeForQuestion(q, base)).sort((a, b) => a - b);
  const take = Math.min(n, allowances.length);
  let min = 0;
  let max = 0;
  for (let i = 0; i < take; i++) {
    min += allowances[i];
    max += allowances[allowances.length - 1 - i];
  }
  return { min, max };
}

const formatSetSeconds = (seconds) => {
  const total = Math.max(0, Math.round(seconds));
  if (!total) return '0 นาที';
  const m = Math.floor(total / 60);
  const sec = total % 60;
  if (!m) return `${sec} วินาที`;
  return sec ? `${m} นาที ${sec} วินาที` : `${m} นาที`;
};

/** '50 นาที' when every draw gets the same time, '50 ถึง 67 นาที' when not. */
export function wholeSetTimeLabel({ min, max }) {
  if (min === max) return formatSetSeconds(min);
  // Whole minutes, rounded outward, so neither end claims more than it can.
  if (min >= 60) return `${Math.floor(min / 60)} ถึง ${Math.ceil(max / 60)} นาที`;
  return `${formatSetSeconds(min)} ถึง ${formatSetSeconds(max)}`;
}

// Categorize a question for the ConfigView type-filter chip.
//   'mcq'     = pure multiple-choice / true-false (mcq, tf, match)
//   'writing' = anything that needs typing input (short, essay, fill)
//
// Updated 2026-05-04 per Palm: fill-in-the-blank should NOT pollute MCQ
// practice pools (they're a different study mode requiring keyboard input).
// Old behavior: fill in mcq → mixed with options → confusing UX.
// New behavior: fill in writing → user picks "writing" chip to practice all
// typed-input questions together (fill + short + essay).
export function questionCategory(q) {
  if (!q?.type) return 'mcq';
  // tfc is auto-marked like fill and, like fill, needs a keyboard.
  return (q.type === 'short' || q.type === 'essay' || q.type === 'fill' || q.type === 'tfc') ? 'writing' : 'mcq';
}

// Check if today is a new study day (for streak).
// Streak freeze (since v6 social): if the user misses ONE day but has a
// streak of ≥ 5 days, we silently let them skip without breaking. The
// freeze can be used at most once per active streak — tracked via
// `freezeUsedAt` (timestamp of the day that was skipped). Reset when
// the streak itself resets to 1.
// Days are Bangkok's (bangkokDayNumber above), so the run means the same on a
// phone set to any zone; a stored lastDate from an older build, a local
// midnight, still falls on the day it was written.
export function updateStreak(lastStudyDate, currentStreak, freezeUsedAt = null, now = Date.now()) {
  const todayDay = bangkokDayNumber(now);
  const todayTs = bangkokDayStart(todayDay);

  if (!lastStudyDate) return { streak: 1, lastDate: todayTs, freezeUsedAt: null };

  const diff = todayDay - bangkokDayNumber(lastStudyDate);

  if (diff === 0) return { streak: currentStreak, lastDate: lastStudyDate, freezeUsedAt }; // Same day
  if (diff === 1) return { streak: currentStreak + 1, lastDate: todayTs, freezeUsedAt }; // Next day
  // diff === 2 + streak ≥ 5 + freeze not yet used → consume freeze, keep streak
  if (diff === 2 && currentStreak >= 5 && !freezeUsedAt) {
    return { streak: currentStreak + 1, lastDate: todayTs, freezeUsedAt: todayTs, freezeJustUsed: true };
  }
  return { streak: 1, lastDate: todayTs, freezeUsedAt: null }; // Gap — reset streak
}

/**
 * The streak to show now. The saved number changes only when a set is graded
 * (updateStreak), so read as-is it kept a run that ended weeks ago on every
 * screen: "10 วันต่อเนื่อง" above a week strip with nothing in it. A run is
 * alive through yesterday, and through the day before while the freeze could
 * still save it (the next graded set would); after that it is over and reads 0.
 * The Pomodoro streak is expired on read the same way.
 */
export function streakShown(streakData, now = Date.now()) {
  const streak = Number(streakData?.streak) || 0;
  if (!streakData?.lastDate || streak <= 0) return 0;
  const diff = bangkokDayNumber(now) - bangkokDayNumber(streakData.lastDate);
  if (!Number.isFinite(diff)) return 0;
  if (diff <= 1) return streak;
  if (diff === 2 && streak >= 5 && !streakData.freezeUsedAt) return streak;
  return 0;
}

export function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** A subject's identity colour, made readable as TEXT.
 *
 *  The 23 colours in curriculum.js were chosen against a cream page. Used
 *  as text they fail AA badly — 12 of 23 in light, 22 of 23 in dark, one
 *  of them at 1.00:1 because it was literally the page's own ink. They are
 *  fine as dots, borders and fills, where they are identity and nothing
 *  reads on top of them; it is only the text role that needs help.
 *
 *  Blending toward the current theme's ink keeps the hue recognisable
 *  while pulling the lightness to where it can be read, and the ratio is a
 *  per-theme token because dark needs to travel further (40% vs 45% of the
 *  original). Verified: all 23 clear 4.5 on every surface in both themes.
 */
export const subjectText = (color) =>
  (color ? `color-mix(in srgb, ${color} var(--subject-text-mix), var(--clr-ink))` : 'var(--clr-ink-soft)');

/** Dose for a drug-database row at a given body weight.
 *
 *  Extracted so the calculator and its test run the SAME code. The bug
 *  this replaces was two inline expressions in JSX: the dose multiplied
 *  by weight unconditionally, and the displayed unit chosen by
 *  `doseLo > 1 ? 'mg' : 'µg'` — magnitude, not the drug's own unit. That
 *  labelled 26 of 57 drugs µg when the answer was mg (furosemide,
 *  pimobendan, enalapril, meloxicam…), and called insulin's IU µg too.
 *
 *  `perKg: false` marks a dose that is per ANIMAL — methimazole is
 *  1.25-2.5 mg/cat regardless of weight — and must not be multiplied.
 */
export function drugDose(drug, weightKg, species) {
  if (!drug) return null;
  const perKg = drug.unit !== 'fixed';
  const unit = drug.unit === 'fixed'
    ? (drug.fixedUnit || 'mg')
    : String(drug.unit).replace('/kg', '').replace('/day', '');
  if (!perKg) return { lo: drug.doseLo, hi: drug.doseHi, unit, perKg };
  // A per-species ceiling wins over the general range. Enrofloxacin's
  // range tops out at exactly the 20 mg/kg that blinds cats, and the
  // warning that says so is prose under a number the student is about to
  // write down.
  const cap = species && drug.speciesMax ? drug.speciesMax[species] : undefined;
  const lo0 = Number.isFinite(cap) ? Math.min(drug.doseLo, cap) : drug.doseLo;
  const hi0 = Number.isFinite(cap) ? Math.min(drug.doseHi, cap) : drug.doseHi;
  const cappedFor = Number.isFinite(cap) && cap < drug.doseHi ? species : null;

  const w = Number(weightKg);
  if (!Number.isFinite(w) || w <= 0) return { lo: null, hi: null, unit, perKg, cappedFor, cap };
  const round = (n) => Math.round(n * 100) / 100;
  return { lo: round(lo0 * w), hi: round(hi0 * w), unit, perKg, cappedFor, cap };
}
