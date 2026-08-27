import * as v from 'valibot';

// Runtime schemas for the two places where a user can bring JSON into
// VetMock. Unknown optional fields are retained for forward compatibility,
// while the fields the app reads are checked before any local data is changed.

export const USER_DATA_IMPORT_MAX_BYTES = 20 * 1024 * 1024;

const finiteNumber = (message = 'ต้องเป็นตัวเลข') => v.pipe(v.number(message), v.finite(message));
const nonNegativeNumber = (message = 'ต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป') => v.pipe(
  finiteNumber(message),
  v.minValue(0, message),
);
const nonEmptyString = (message = 'ห้ามเว้นว่าง') => v.pipe(
  v.string(message),
  v.check((value) => value.trim().length > 0, message),
);
const idSchema = v.union([
  finiteNumber('รหัสข้อต้องเป็นตัวเลขหรือข้อความ'),
  nonEmptyString('รหัสข้อต้องเป็นตัวเลขหรือข้อความ'),
], 'รหัสข้อต้องเป็นตัวเลขหรือข้อความ');

const shortString = (message) => v.pipe(
  v.string(message),
  v.maxLength(5_000, 'ข้อความยาวเกินขอบเขตที่รองรับ'),
);

const tagsSchema = v.optional(v.pipe(
  v.array(v.pipe(v.string('tag ต้องเป็นข้อความ'), v.maxLength(100, 'tag ยาวเกิน 100 ตัวอักษร'))),
  v.maxLength(50, 'หนึ่งข้อมี tag ได้ไม่เกิน 50 รายการ'),
));

function questionObject(type, fields = {}) {
  return v.looseObject({
    id: v.optional(idSchema),
    type: v.literal(type),
    q: v.pipe(
      nonEmptyString('ข้อความคำถามว่าง'),
      v.maxLength(20_000, 'ข้อความคำถามยาวเกินขอบเขตที่รองรับ'),
    ),
    subject: v.pipe(
      nonEmptyString('ไม่พบรหัสวิชา'),
      v.maxLength(100, 'รหัสวิชายาวผิดปกติ'),
    ),
    topic: v.optional(v.string('รหัสหัวข้อต้องเป็นข้อความ')),
    year: v.optional(finiteNumber('ชั้นปีต้องเป็นตัวเลข')),
    tags: tagsSchema,
    explain: v.optional(v.pipe(v.string('คำอธิบายต้องเป็นข้อความ'), v.maxLength(100_000, 'คำอธิบายยาวเกินขอบเขตที่รองรับ'))),
    image: v.optional(v.pipe(v.string('ที่อยู่รูปต้องเป็นข้อความ'), v.maxLength(8_000, 'ที่อยู่รูปยาวผิดปกติ'))),
    ...fields,
  });
}

const mcqSchema = v.pipe(
  questionObject('mcq', {
    options: v.pipe(
      v.array(shortString('ตัวเลือกต้องเป็นข้อความ')),
      v.minLength(2, 'ข้อแบบเลือกตอบต้องมีอย่างน้อย 2 ตัวเลือก'),
      v.maxLength(20, 'ข้อแบบเลือกตอบมีตัวเลือกได้ไม่เกิน 20 ตัวเลือก'),
    ),
    answer: v.pipe(
      finiteNumber('เฉลยของข้อแบบเลือกตอบต้องเป็นลำดับตัวเลือก'),
      v.integer('เฉลยของข้อแบบเลือกตอบต้องเป็นจำนวนเต็ม'),
      v.minValue(0, 'ลำดับเฉลยต้องเริ่มจาก 0'),
    ),
  }),
  v.check((question) => question.answer < question.options.length, 'ลำดับเฉลยอยู่นอกจำนวนตัวเลือก'),
);

const tfSchema = questionObject('tf', {
  answer: v.boolean('เฉลยถูก/ผิดต้องเป็น true หรือ false'),
});

const fillSchema = questionObject('fill', {
  blanks: v.pipe(
    v.array(nonEmptyString('คำตอบช่องว่างต้องเป็นข้อความ')),
    v.minLength(1, 'ข้อเติมคำต้องมีคำตอบอย่างน้อย 1 ช่อง'),
    v.maxLength(100, 'ข้อเติมคำมีช่องว่างได้ไม่เกิน 100 ช่อง'),
  ),
});

const pairSchema = v.looseObject({
  left: nonEmptyString('คำจับคู่ด้านซ้ายว่าง'),
  right: nonEmptyString('คำจับคู่ด้านขวาว่าง'),
});

const matchSchema = v.pipe(
  questionObject('match', {
    pairs: v.pipe(
      v.array(pairSchema),
      v.minLength(1, 'ข้อจับคู่ต้องมีอย่างน้อย 1 คู่'),
      v.maxLength(100, 'ข้อจับคู่มีได้ไม่เกิน 100 คู่'),
    ),
    // ตัวลวง — รายการด้านขวาที่ไม่มีคู่ซ้ายตรง (ทำให้เดาข้อสุดท้ายไม่ได้)
    distractors: v.optional(v.pipe(
      v.array(nonEmptyString('ตัวลวงต้องเป็นข้อความ')),
      v.maxLength(20, 'ตัวลวงมีได้ไม่เกิน 20 รายการ'),
    )),
    // สุ่มตำแหน่งตัวเลือกขวา (default true) — ปิดได้ด้วย shuffle:false สำหรับข้อที่ลำดับมีความหมาย
    shuffle: v.optional(v.boolean('shuffle ต้องเป็น boolean')),
  }),
  // ตรวจซ้ำ: left/right/distractors ต้องไม่ซ้ำกันจนทำให้สับสน
  v.check((q) => {
    const rights = q.pairs.map((p) => p.right.trim().toLowerCase());
    return new Set(rights).size === rights.length;
  }, 'คำตอบด้านขวาซ้ำกัน — แต่ละคู่ต้องมี right ไม่ซ้ำ'),
  v.check((q) => {
    if (!q.distractors || q.distractors.length === 0) return true;
    const rights = new Set(q.pairs.map((p) => p.right.trim().toLowerCase()));
    return q.distractors.every((d) => !rights.has(d.trim().toLowerCase()));
  }, 'ตัวลวงซ้ำกับคำตอบที่ถูก — ตัวลวงต้องไม่ตรงกับ right ใดๆ'),
);

const shortAnswerSchema = questionObject('short', {
  keywords: v.optional(v.pipe(
    v.array(shortString('keyword ต้องเป็นข้อความ')),
    v.maxLength(100, 'keyword มีได้ไม่เกิน 100 รายการ'),
  )),
  model_answer: v.optional(v.string('คำตอบตัวอย่างต้องเป็นข้อความ')),
});

const essaySchema = questionObject('essay', {
  model_answer: v.optional(v.string('คำตอบตัวอย่างต้องเป็นข้อความ')),
});

export const CUSTOM_QUESTION_SCHEMA = v.variant('type', [
  mcqSchema,
  tfSchema,
  fillSchema,
  matchSchema,
  shortAnswerSchema,
  essaySchema,
], 'ชนิดข้อสอบไม่รองรับ');

const historyEntrySchema = v.looseObject({
  questionId: idSchema,
  correct: v.boolean('ผลตอบถูก/ผิดต้องเป็น boolean'),
  date: v.optional(nonNegativeNumber('วันที่ทำข้อต้องเป็น timestamp')),
  subject: v.optional(v.string('รหัสวิชาในประวัติต้องเป็นข้อความ')),
  year: v.optional(v.nullable(finiteNumber('ชั้นปีในประวัติต้องเป็นตัวเลข'))),
  phase: v.optional(v.nullable(v.string('ช่วงเรียนในประวัติต้องเป็นข้อความ'))),
});

const srCardSchema = v.looseObject({
  questionId: idSchema,
  easeFactor: v.optional(v.pipe(finiteNumber('ease factor ต้องเป็นตัวเลข'), v.minValue(1.3, 'ease factor ต่ำกว่า 1.3 ไม่ได้')), 2.5),
  interval: v.optional(nonNegativeNumber('ช่วงทบทวนต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป'), 0),
  repetitions: v.optional(nonNegativeNumber('จำนวนรอบทบทวนต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป'), 0),
  nextReview: v.optional(nonNegativeNumber('วันทบทวนครั้งถัดไปต้องเป็น timestamp'), 0),
  lastReview: v.optional(v.nullable(nonNegativeNumber('วันทบทวนล่าสุดต้องเป็น timestamp')), null),
  totalReviews: v.optional(nonNegativeNumber('จำนวนครั้งที่ทบทวนต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป'), 0),
  lapses: v.optional(nonNegativeNumber('จำนวนครั้งที่ลืมต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป'), 0),
  autoPromoted: v.optional(v.boolean('สถานะเพิ่มเข้าคิวอัตโนมัติต้องเป็น boolean')),
});

const streakDataSchema = v.looseObject({
  streak: nonNegativeNumber('จำนวนวันต่อเนื่องต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป'),
  lastDate: v.optional(v.nullable(nonNegativeNumber('วันที่ฝึกล่าสุดต้องเป็น timestamp')), null),
  freezeUsedAt: v.optional(v.nullable(nonNegativeNumber('วันที่ใช้สิทธิ์รักษา streak ต้องเป็น timestamp')), null),
});

const safeRecordKeys = (value) => !Object.keys(value).some((key) => (
  key === '__proto__' || key === 'prototype' || key === 'constructor'
));

const notesSchema = v.pipe(
  v.record(v.string(), v.string('โน้ตแต่ละข้อต้องเป็นข้อความ')),
  v.check(safeRecordKeys, 'พบชื่อช่องข้อมูลที่ไม่ปลอดภัยในโน้ต'),
  v.check((value) => Object.keys(value).length <= 50_000, 'จำนวนโน้ตมากเกินขอบเขตที่รองรับ'),
);

const srCardsSchema = v.pipe(
  v.record(v.string(), srCardSchema),
  v.check(safeRecordKeys, 'พบชื่อช่องข้อมูลที่ไม่ปลอดภัยในการ์ดทบทวน'),
  v.check((value) => Object.keys(value).length <= 50_000, 'จำนวนการ์ดทบทวนมากเกินขอบเขตที่รองรับ'),
);

const backupSchema = v.pipe(
  v.looseObject({
    exportDate: v.optional(v.string('วันส่งออกต้องเป็นข้อความ ISO')),
    version: v.optional(v.union([v.string(), finiteNumber()])),
    bookmarks: v.optional(v.pipe(v.array(idSchema), v.maxLength(50_000, 'จำนวนข้อที่บันทึกไว้มากเกินขอบเขตที่รองรับ'))),
    history: v.optional(v.pipe(v.array(historyEntrySchema), v.maxLength(500_000, 'จำนวนประวัติมากเกินขอบเขตที่รองรับ'))),
    notes: v.optional(notesSchema),
    srCards: v.optional(srCardsSchema),
    streak: v.optional(nonNegativeNumber('จำนวนวันต่อเนื่องต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป')),
    streakData: v.optional(streakDataSchema),
    customQuestions: v.optional(v.pipe(v.array(CUSTOM_QUESTION_SCHEMA), v.maxLength(50_000, 'จำนวนข้อสอบส่วนตัวมากเกินขอบเขตที่รองรับ'))),
  }),
  v.check(
    (data) => BACKUP_FIELDS.some((field) => Object.prototype.hasOwnProperty.call(data, field)),
    'ไม่พบข้อมูล VetMock ที่นำเข้าได้',
  ),
);

export const BACKUP_FIELDS = Object.freeze([
  'bookmarks',
  'history',
  'notes',
  'srCards',
  'streakData',
  'streak',
  'customQuestions',
]);

function firstIssueReason(issues, fallback) {
  const issue = issues?.[0];
  if (!issue) return fallback;
  const pathLabels = {
    bookmarks: 'ข้อที่บันทึกไว้',
    history: 'ประวัติการฝึก',
    notes: 'โน้ต',
    srCards: 'การ์ดทบทวน',
    streak: 'วันต่อเนื่อง',
    streakData: 'ข้อมูลวันต่อเนื่อง',
    customQuestions: 'ข้อสอบส่วนตัว',
    pairs: 'คู่คำตอบ',
    left: 'ด้านซ้าย',
    right: 'ด้านขวา',
    options: 'ตัวเลือก',
    answer: 'เฉลย',
    blanks: 'ช่องว่าง',
  };
  const path = (issue.path || [])
    .map((item) => item.key)
    .filter((key) => key !== undefined)
    .slice(0, 4)
    .map((key) => pathLabels[key] || key)
    .join(' › ');
  const message = /^Invalid (type|key):/.test(issue.message)
    ? 'ชนิดข้อมูลไม่ถูกต้องหรือมีช่องข้อมูลหาย'
    : issue.message;
  return path ? `${path}: ${message}` : message;
}

export function parseCustomQuestion(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { success: false, reason: 'ข้อมูลข้อสอบต้องเป็น object' };
  }
  const result = v.safeParse(CUSTOM_QUESTION_SCHEMA, value, { abortEarly: true });
  return result.success
    ? { success: true, data: result.output }
    : { success: false, reason: firstIssueReason(result.issues, 'ข้อมูลข้อสอบไม่ครบ') };
}

export function parseUserBackup(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { success: false, reason: 'ไฟล์ backup ต้องเป็น object' };
  }
  const result = v.safeParse(backupSchema, value, { abortEarly: true });
  if (!result.success) {
    return {
      success: false,
      reason: firstIssueReason(result.issues, 'โครงสร้างไฟล์ backup ไม่ถูกต้อง'),
    };
  }
  return {
    success: true,
    data: result.output,
    fields: BACKUP_FIELDS.filter((field) => Object.prototype.hasOwnProperty.call(value, field)),
  };
}

export function describeBackupFields(data, fields) {
  const labels = {
    bookmarks: () => `ข้อที่บันทึกไว้ ${data.bookmarks.length} ข้อ`,
    history: () => `ประวัติการฝึก ${data.history.length} รายการ`,
    notes: () => `โน้ตส่วนตัว ${Object.keys(data.notes).length} ข้อ`,
    srCards: () => `การ์ดทบทวน ${Object.keys(data.srCards).length} ใบ`,
    streakData: () => `ฝึกต่อเนื่อง ${data.streakData.streak} วัน`,
    streak: () => `ฝึกต่อเนื่อง ${data.streak} วัน (backup รุ่นเดิม)`,
    customQuestions: () => `ข้อสอบส่วนตัว ${data.customQuestions.length} ข้อ`,
  };
  return fields
    // Prefer the complete v5.1 streak record over its legacy numeric mirror.
    .filter((field) => field !== 'streak' || !fields.includes('streakData'))
    .map((field) => labels[field]?.())
    .filter(Boolean);
}
