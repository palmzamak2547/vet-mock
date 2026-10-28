// The licensing exam itself: when it sits, how long it runs, what it costs. Every fact names
// its source. The evaluation centre announces a whole year's rounds at once (2569's came on
// 17 พ.ย. 2568). Round 1/2570 is here on the faculty's word, with no hours and no results day:
// when the centre publishes 2570, replace it with the centre's own times and source.

export const SOURCES = {
  council: {
    kind: 'ทางการ',
    th: 'ประกาศศูนย์ประเมินฯ ที่ 10/2568 กำหนดการสอบประเมิน ประจำปี 2569 (17 พ.ย. 2568) ในสารสัตวแพทยสภา ฉบับที่ 51 หน้า 15',
    short: 'ประกาศศูนย์ประเมินฯ ที่ 10/2568',
    url: 'https://eval.vetcouncil.or.th/students/news',
  },
  faculty: {
    kind: 'คณะแจ้ง',
    th: 'ฝ่ายวิชาการ คณะสัตวแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ในการประชุมเตรียมสอบ VCA2570 กับนิสิต (28 ต.ค. 2569): ยืนยันวันสอบรอบที่ 1 ข้อสอบหมวดละ 150 ข้อ และเกณฑ์ผ่าน 55% ศูนย์ประเมินฯ ยังไม่ออกประกาศของปี 2570',
    short: 'คณะยืนยันวันสอบเมื่อ 28 ต.ค. 2569 รอประกาศทางการ',
    url: null,
  },
  procedure: {
    kind: 'ทางการ',
    th: 'ศูนย์รวมข้อมูลเพื่อติดต่อราชการ: การสอบประเมินความรู้ฯ สัตวแพทยสภา ขั้นตอนและค่าธรรมเนียม',
    url: 'https://info.go.th/procedure/94e56d41-a55d-40f9-a089-04f84517bc41',
  },
  almanac: {
    kind: 'นิสิตบันทึก',
    th: 'VCA Almanac, CUVET: สถิติจำนวนข้อสอบ VCA ปี 58 ถึง 68 จากชีตที่รุ่นพี่บันทึกต่อกันมา 11 รุ่น (15 ต.ค. 2569)',
    url: null,
  },
};

/**
 * The rounds announced so far. Each part sits on its own day: part 2 on the first afternoon,
 * part 3 the next morning, three hours each. Times are Bangkok time. A round the centre has not
 * published yet has no `from`/`to`, only the half day (`slot`), and `results: null`.
 */
export const ROUNDS = [
  {
    id: '1/2569',
    parts: [
      { part: 2, date: '2026-06-06', from: '13:30', to: '16:30' },
      { part: 3, date: '2026-06-07', from: '09:30', to: '12:30' },
    ],
    results: '2026-07-24',
    source: 'council',
  },
  {
    id: '2/2569',
    parts: [
      { part: 2, date: '2027-01-23', from: '13:30', to: '16:30' },
      { part: 3, date: '2027-01-24', from: '09:30', to: '12:30' },
    ],
    results: '2027-02-25',
    source: 'council',
  },
  {
    id: '1/2570',
    parts: [
      { part: 2, date: '2027-06-05', slot: 'บ่าย' },
      { part: 3, date: '2027-06-06', slot: 'เช้า' },
    ],
    results: null,
    source: 'faculty',
  },
];

/**
 * The paper. Three hours a part is the centre's (2569); 150 five-choice questions a part, about
 * 50 to 60 that ask for recall and 90 to 100 that apply it, and a pass at 55% of each part are
 * the faculty's (28 ต.ค. 2569); the fee is the procedure page's, for graduates of Thai schools.
 */
export const FORMAT = {
  perPart: 150,
  minutesPerPart: 180,
  feePerPart: 2000,
  passPercent: 55,
  recall: [50, 60],
  applied: [90, 100],
};

/** Questions a part needs to pass: 55% of 150 is 82.5, so 83. */
export const PASS_MARK = Math.ceil((FORMAT.perPart * FORMAT.passPercent) / 100);

/** The pace the paper sets: 180 minutes over 150 questions. */
export const EXAM_SECONDS = (FORMAT.minutesPerPart * 60) / FORMAT.perPart;

/** Every round whose last day is today or later, in date order. */
export function upcomingRounds(today) {
  return ROUNDS.filter((r) => r.parts[r.parts.length - 1].date >= today);
}

/** The first round whose last day is today or later, or null when none is announced yet. */
export function upcomingRound(today) {
  return upcomingRounds(today)[0] || null;
}

/** When a part sits, in Thai: its hours, or the half day while the hours are unannounced. */
export const partTime = (p) => (p.from ? `${p.from}–${p.to}` : `ช่วง${p.slot} รอประกาศเวลา`);

/** Days from exam to results, for each round that has both. */
export function resultsLag() {
  const day = (iso) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
  return ROUNDS.filter((r) => r.results).map((r) => Math.round((day(r.results) - day(r.parts[r.parts.length - 1].date)) / 86400000));
}

/** "YYYY-MM-DD", "HH:MM" in Bangkok (UTC+7 all year) as an iCalendar UTC stamp. */
function utcStamp(date, time) {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh - 7, mm)).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** Lines of at most 75 octets, continued with a space, cut between characters (RFC 5545 3.1). */
function fold(line) {
  const enc = new TextEncoder();
  const out = [];
  let cur = '';
  for (const ch of line) {
    const limit = out.length ? 74 : 75;
    if (enc.encode(cur + ch).length > limit) { out.push(cur); cur = ''; }
    cur += ch;
  }
  out.push(cur);
  return out.join('\r\n ');
}

/** An all-day event's start and end as iCalendar DATEs: "YYYYMMDD" and the next day (the end is exclusive). */
export function allDay(date) {
  const [y, m, d] = date.split('-').map(Number);
  return [date.replace(/-/g, ''), new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10).replace(/-/g, '')];
}

/**
 * The round as a calendar file: one event per part with a reminder the day before, so a
 * phone can hold the dates. A part whose hours are unannounced is an all-day event.
 * @param {typeof ROUNDS[number]} round
 */
export function roundCalendar(round) {
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//VetMock//VCA//TH', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    ...round.parts.flatMap((p) => [
      'BEGIN:VEVENT',
      `UID:vca-${round.id.replace('/', '-')}-part${p.part}@vca.vetmock.com`,
      `DTSTAMP:${utcStamp(p.date, p.from || '00:00')}`,
      ...(p.from
        ? [`DTSTART:${utcStamp(p.date, p.from)}`, `DTEND:${utcStamp(p.date, p.to)}`]
        : allDay(p.date).map((d, i) => `${i ? 'DTEND' : 'DTSTART'};VALUE=DATE:${d}`)),
      `SUMMARY:สอบ VCA หมวด ${p.part} (รอบ ${round.id})`,
      `DESCRIPTION:${p.from ? '' : `ช่วง${p.slot} เวลารอประกาศ `}${FORMAT.perPart} ข้อ ${FORMAT.minutesPerPart / 60} ชั่วโมง ตรวจประกาศล่าสุดได้ที่ ${SOURCES.council.url}`,
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:พรุ่งนี้สอบ VCA หมวด ${p.part}`, 'END:VALARM',
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
