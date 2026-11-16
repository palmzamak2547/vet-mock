// The words an empty place on the subject and topic screens may say, in one
// place so each claim is tied to the fact it states. "ยังไม่มีเนื้อหา" is true
// only when nothing is loading, nothing is unknown, and no question, note,
// article or shelf document exists for the place.

export const NO_CONTENT_TEXT = 'ยังไม่มีเนื้อหา';
export const NO_CONTENT_TITLE = 'ยังไม่มีเนื้อหาของวิชานี้ในแอป';

// docs: the number of shelf documents for the subject, or null when the shelf
// has not been read (still loading, or it could not be read).
export function subjectCardCopy({
  qbLoading = false, count = 0, hasNotes = false, docs = null, docsChecked = false, outOfPhase = false,
}) {
  const isEmpty = count === 0 && !hasNotes;
  if (qbLoading) return { kind: 'loading', text: 'กำลังโหลด…', title: 'กำลังโหลดคลังข้อสอบ', dead: false };
  if (count === 0 && hasNotes) return { kind: 'notes', text: 'มีสรุปให้อ่าน', title: '', dead: false };
  if (isEmpty && docs > 0) {
    return { kind: 'docs', text: `เอกสารจริง ${docs} ไฟล์`, title: `เปิดคลังเอกสารจริงของวิชานี้ (${docs} ไฟล์)`, dead: false };
  }
  if (isEmpty && outOfPhase) {
    return { kind: 'outOfPhase', text: 'ไม่อยู่ในช่วงสอบนี้', title: 'วิชานี้ไม่อยู่ในช่วงสอบที่เลือก สลับช่วงสอบที่หน้าแรกเพื่อฝึก', dead: true };
  }
  if (isEmpty && docs === null) {
    // The shelf is not known yet: say so, never "empty".
    return docsChecked
      ? { kind: 'unknown', text: 'ยังโหลดคลังเอกสารไม่ได้', title: '', dead: false }
      : { kind: 'checking', text: 'กำลังโหลด…', title: 'กำลังตรวจคลังเอกสาร', dead: false };
  }
  if (isEmpty) return { kind: 'empty', text: NO_CONTENT_TEXT, title: NO_CONTENT_TITLE, dead: true };
  return { kind: 'count', text: `${count.toLocaleString()} ข้อ`, title: '', dead: false };
}

// The spoken label of a topic row's main button. A topic that has only a
// VetWiki article is not empty.
export function topicPrimaryLabel({ label, count = 0, notes = false, wiki = false }) {
  if (count > 0) return `ฝึกข้อสอบ ${label} ${count} ข้อ`;
  if (notes) return `อ่าน Notes ${label}`;
  if (wiki) return `หัวข้อ ${label} มีบทความ VetWiki`;
  return `หัวข้อ ${label} ${NO_CONTENT_TEXT}พร้อมใช้`;
}

// The line under the title on a preview year's subject list. It promises open
// documents only when at least one subject of that year has some.
// docCounts: Map of subject id to document count, or null when not read.
export function previewYearSubtitle({ subjectIds = [], docCounts = null, docsChecked = false }) {
  if (!docCounts) {
    return docsChecked ? 'ข้อสอบกำลังทยอยเพิ่ม' : '';
  }
  const withDocs = subjectIds.filter((id) => (docCounts.get(id) || 0) > 0).length;
  return withDocs > 0
    ? 'วิชาที่มีคลังเอกสารเปิดอ่านได้เลย ข้อสอบกำลังทยอยเพิ่ม'
    : 'ข้อสอบและเอกสารกำลังทยอยเพิ่ม';
}
