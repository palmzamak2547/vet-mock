// ============================================================
// The name a topic card gives its lecturer
// ============================================================
// curriculum.js stores lecturers as the faculty roster spells them in
// English ("Teerapol Chinkangsadarn"), sometimes with initials in brackets
// ("จักรกริศน์ เนื่องจำนงค์ (CN)"), two people joined with " + ", or "TBD".
// The lecturer section on the same screen (lecturer-sets.js) names the same
// people in Thai with their titles ("อ.น.สพ.ดร.ธีรพล ชินกังสดาร"). Showing
// both made one lecturer look like two, so a topic card borrows the lecturer
// section's name whenever the subject has one for that person.
//
// Matching is by person, not by string: the two files spell some surnames
// differently (Jarutumnasaki / Jarutummasiri), so a given name plus the
// first four letters of the surname decides. Given name alone is not enough
// — equine reproduction has two Theerawats.
//
// Returns { name, titled } — titled when the name already carries the
// person's academic title, so the card does not add "อาจารย์" in front of
// "อ.น.สพ.ดร." — or null when there is nobody to show (TBD, blank).
// ============================================================

import { LECTURER_SETS } from '../data/lecturer-sets.js';

const clean = (s) => String(s).replace(/\s*\([^)]*\)\s*$/, '').trim();

function samePerson(a, b) {
  const x = clean(a).toLowerCase().split(/\s+/);
  const y = clean(b).toLowerCase().split(/\s+/);
  if (x.join(' ') === y.join(' ')) return true;
  if (x.length < 2 || y.length < 2 || x[0] !== y[0]) return false;
  const [sx, sy] = [x[x.length - 1], y[y.length - 1]];
  return sx.length >= 4 && sy.length >= 4 && sx.slice(0, 4) === sy.slice(0, 4);
}

function fromSet(subjectId, person) {
  const set = LECTURER_SETS[subjectId];
  if (!set) return null;
  for (const lec of set.lecturers) {
    const people = Array.isArray(lec.lecturers) && lec.lecturers.length ? lec.lecturers : [lec.lecturer];
    const names = people.length > 1 ? lec.name.split(' และ ') : [lec.name];
    const i = people.findIndex((p) => p && samePerson(p, person));
    if (i >= 0) return names[i] || lec.name;
  }
  return null;
}

export function topicLecturerLabel(subjectId, lecturer) {
  const raw = typeof lecturer === 'string' ? lecturer.trim() : '';
  if (!raw || /^tbd$/i.test(raw)) return null;
  const people = raw.split(/\s+\+\s+/);
  const resolved = people.map((p) => fromSet(subjectId, p));
  if (resolved.every(Boolean)) return { name: resolved.join(' และ '), titled: true };
  return { name: raw, titled: false };
}
