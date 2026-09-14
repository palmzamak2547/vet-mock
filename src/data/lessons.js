// ============================================================
// lessons.js — interactive lessons, listed under the subject they belong to
// ============================================================
// A lesson is content, not a destination. "ระบาดวิทยา Module 5" is one
// module of one year-5 subject; putting it in the left rail asked every
// student — including first years, who do not take the subject at all — to
// walk past it on every screen.
//
// So a lesson is registered here, against its subject, and appears as a
// study resource on that subject's page next to สรุปบทเรียน, VetWiki and the
// document shelf. The rail keeps the destinations that are the same for
// everyone; this keeps the things that are not.
//
// feature-registry.js still carries an entry so the command palette can find
// it by name, marked `rail: false` for the same reason.

export const LESSONS = Object.freeze([
  {
    id: 'epi-m5',
    subject: 'epidemiology',
    year: 5,
    view: 'bench',
    title: 'สัตวแพทย์ในวันข้างหน้า',
    sub: 'บทเรียน Module 5 พร้อมโจทย์ 22 ข้อ และโต๊ะทดลองผลตรวจ',
  },
]);

/** The lessons registered for one subject, in listed order. */
export function lessonsForSubject(subject) {
  if (!subject) return [];
  return LESSONS.filter((l) => l.subject === subject);
}
