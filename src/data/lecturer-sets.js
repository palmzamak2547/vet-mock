// ============================================================
// Lecturer sets — a paper organised the way it is actually written
// ============================================================
// A midterm is not one exam; it is several lecturers' parts stapled together,
// and each lecturer writes in their own format. For Avian Medicine the class
// was told which format each part takes — true/false, matching, written — and
// in one case how many items. A student revising the night before wants
// exactly that shape: อ.เกรียงวิชญ์'s topics as true/false statements,
// อ.ณทยา's as matching cards, not a mixed pool of everything.
//
// What each field is evidence of:
//   sessions      — the department's own timetable (ตารางเรียน 3107510), one
//                   entry per teaching session, with the lecture date and the
//                   VET86 recording of that session. The topics under a session
//                   are the decks the lecturer actually opened that day.
//   format        — the announcement the class received. `announced: false`
//                   means nobody has announced it and the format is what a
//                   previous cohort recorded; the card says so in its note.
//   count         — announced item count, or null.
//   decks[].cover — an id into LECTURE_COVERS in art.js: the title slide of
//                   that deck, cropped from the recording, so the row reads as
//                   "the slides this lecturer taught from".
//
// A deck may span several topic ids (อ.เกรียงวิชญ์ teaches six diseases from
// one deck). `alsoTopics` are topics that belong to the lecturer's part but have
// no deck of their own to show.
// ============================================================

/** The exam these sets are for. A set only shows while this is the scope. */
export const LECTURER_SET_SCOPE = { year: 5, phase: '1-mid' };

export const FORMAT_LABEL = {
  tf: 'ถูกผิด',
  match: 'จับคู่',
  writing: 'ข้อเขียน',
  mcq: 'ปรนัย',
  all: 'ทุกประเภท',
};

export const LECTURER_SETS = {
  'avian-medicine': {
    examDate: '2026-09-21',
    coverage: 'เนื้อหาตั้งแต่ 4 ส.ค. ถึง 15 ก.ย.',
    lecturers: [
      {
        id: 'nataya',
        name: 'ผศ.สพ.ญ.ดร.ณทยา เจริญวิศาล',
        lecturer: 'Nataya Charoenvisal',
        format: 'match',
        count: null,
        announced: true,
        note: 'อาจารย์แจ้งรูปแบบข้อสอบ: จับคู่',
        sessions: [
          {
            n: 1, date: '2026-08-04', videoId: '7XyI0SjnuBA',
            decks: [
              { cover: 'avian-nd', topics: ['avian-nd'] },
              { cover: 'avian-ib', topics: ['avian-ib'] },
              { cover: 'avian-lt', topics: ['avian-lt'] },
              { cover: 'avian-mpv', topics: ['avian-mpv'] },
              { cover: 'avian-pox', topics: ['avian-pox'] },
            ],
          },
          {
            n: 5, date: '2026-09-01', videoId: 'ScpsvwW0FhM',
            decks: [
              { cover: 'avian-ibd', topics: ['avian-ibd'] },
              { cover: 'avian-marek', title: 'Neoplastic Diseases (Marek, ALV, RE)', topics: ['avian-marek'] },
              { cover: 'avian-cia', topics: ['avian-cia'] },
              { cover: 'avian-reo', topics: ['avian-reo'] },
            ],
          },
          {
            n: 6, date: '2026-09-08', videoId: 'RWCDahVkYTk',
            decks: [
              { cover: 'avian-rss', topics: ['avian-rss'] },
              { cover: 'avian-cocci', topics: ['avian-cocci'] },
              { cover: 'avian-ne', topics: ['avian-ne'] },
              { cover: 'avian-leuko', topics: ['avian-leuko'] },
              { cover: 'avian-malaria', topics: ['avian-malaria'] },
            ],
          },
        ],
      },
      {
        id: 'somsak',
        name: 'ศ.น.สพ.ดร.สมศักดิ์ ภัคภิญโญ',
        lecturer: 'Somsak Pakpinyo',
        format: 'tf',
        count: null,
        announced: false,
        note: 'ยังไม่มีประกาศรูปแบบจากอาจารย์ รุ่นก่อนหน้าบันทึกไว้ว่าเป็นข้อสอบถูกผิด',
        sessions: [
          {
            n: 2, date: '2026-08-11', videoId: '8ekNMuG25gI',
            decks: [{ cover: 'avian-myco', topics: ['avian-myco'] }],
          },
          {
            n: 3, date: '2026-08-18', videoId: 'R0xTpIvGn98',
            decks: [
              { cover: 'avian-coryza', topics: ['avian-coryza'] },
              { cover: 'avian-fowl-cholera', topics: ['avian-fowl-cholera'] },
              { cover: 'avian-coli', topics: ['avian-coli'] },
            ],
          },
        ],
      },
      {
        id: 'jiroj',
        name: 'ศ.กิตติคุณ น.สพ.ดร.จิโรจ ศศิปรียจันทร์',
        lecturer: 'Jiroj Sasipreeyajan',
        format: 'writing',
        count: null,
        announced: true,
        note: 'อาจารย์แจ้งรูปแบบข้อสอบ: ข้อเขียน',
        sessions: [
          {
            n: 4, date: '2026-08-25', videoId: 'F1jwpqQCGBM',
            alsoTopics: ['avian-intro'],
            decks: [
              { cover: 'avian-ai', topics: ['avian-ai'] },
              { cover: 'avian-egg-breakout', topics: ['avian-egg-breakout'] },
            ],
          },
        ],
      },
      {
        id: 'kriengwich',
        name: 'อ.น.สพ.ดร.เกรียงวิชญ์ ลิมปวิทยากุล',
        lecturer: 'Kriengwich Limpavithayakul',
        format: 'tf',
        count: 24,
        announced: true,
        note: 'อาจารย์แจ้งรูปแบบข้อสอบ: ถูกผิด 24 ข้อ',
        sessions: [
          {
            n: 7, date: '2026-09-15', videoId: 'ezb2wLM_R2o',
            decks: [
              {
                cover: 'avian-ahra-set',
                title: 'Omphalitis, Ascites, Staphylococcosis, Salmonellosis, Adenovirus, AE',
                topics: ['avian-ahra-set', 'avian-salmonella', 'avian-adeno', 'avian-ae'],
              },
            ],
          },
        ],
      },
    ],
  },
};

/** Whether this subject has a lecturer set for the scope the student is in. */
export function hasLecturerSet(subjectId, selectedYear, selectedPhase) {
  return Boolean(LECTURER_SETS[subjectId])
    && Number(selectedYear) === LECTURER_SET_SCOPE.year
    && selectedPhase === LECTURER_SET_SCOPE.phase;
}

/** Every topic id in a lecturer's part of the paper, decks and alsoTopics alike. */
export function lecturerTopics(lecturer) {
  const out = [];
  for (const s of lecturer.sessions || []) {
    for (const d of s.decks || []) for (const t of d.topics) if (!out.includes(t)) out.push(t);
    for (const t of s.alsoTopics || []) if (!out.includes(t)) out.push(t);
  }
  return out;
}
