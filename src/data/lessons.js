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
  // Modules 1 to 4 of the same course are interactive pages the lecturer
  // hosts outside MyCourseVille (MCV lists them as links, with no file to
  // mirror), so VetMock does not copy them: the card opens the lecturer's own
  // pages in a new tab. Each URL was opened and answered on 15 Nov 2026.
  {
    id: 'epi-fmd-modules',
    subject: 'epidemiology',
    year: 5,
    title: 'FMD Module 1 ถึง 4',
    sub: 'หน้าเว็บบทเรียนของอาจารย์ผู้สอน เปิดในแท็บใหม่ นอก VetMock',
    links: [
      { label: 'Module 1 การทดสอบวินิจฉัย FMD', url: 'https://annthanicha.github.io/Module1-FMD-diagnostic-tests/index.html' },
      { label: 'Module 2 การวางแผนการศึกษา การสุ่มตัวอย่าง และขนาดตัวอย่าง', url: 'https://annthanicha.github.io/Module2-FMD-Study-design-sampling/index.html' },
      { label: 'Module 3 การสอบสวนการระบาด', url: 'https://annthanicha.github.io/Module3_FMD_outbreak-investigation/#intro' },
      { label: 'Module 4 การป้องกัน การเฝ้าระวัง และการควบคุม', url: 'https://annthanicha.github.io/Module-4-FMD-prevention-surveillance-and-control/' },
    ],
  },
]);

/** The lessons registered for one subject, in listed order. */
export function lessonsForSubject(subject) {
  if (!subject) return [];
  return LESSONS.filter((l) => l.subject === subject);
}
