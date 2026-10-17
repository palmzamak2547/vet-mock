// The licensing exam itself: when it sits, how long it runs, what it costs. Every fact names
// its source. The evaluation centre announces a whole year's rounds at once (2569's came on
// 17 พ.ย. 2568), so add 2570's rounds here when it publishes them, likely from November 2569.

export const SOURCES = {
  council: {
    kind: 'ทางการ',
    th: 'ประกาศศูนย์ประเมินฯ ที่ 10/2568 กำหนดการสอบประเมิน ประจำปี 2569 (17 พ.ย. 2568) ในสารสัตวแพทยสภา ฉบับที่ 51 หน้า 15',
    url: 'https://eval.vetcouncil.or.th/students/news',
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
 * The rounds the centre has announced. Each part sits on its own day: part 2 on the first
 * afternoon, part 3 the next morning, three hours each. Times are Bangkok time.
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
];

/**
 * The paper. Three hours a part is the centre's; 200 questions a part (400 a round) is what
 * the cohorts record; the fee is the procedure page's, for graduates of Thai schools.
 */
export const FORMAT = {
  perPart: 200,
  minutesPerPart: 180,
  feePerPart: 2000,
};

/** The pace the paper sets: 180 minutes over 200 questions. */
export const EXAM_SECONDS = (FORMAT.minutesPerPart * 60) / FORMAT.perPart;

/** The first round whose last day is today or later, or null when none is announced yet. */
export function upcomingRound(today) {
  return ROUNDS.find((r) => r.parts[r.parts.length - 1].date >= today) || null;
}

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

/**
 * The round as a calendar file: one event per part with a reminder the day before, so a
 * phone can hold the dates.
 * @param {typeof ROUNDS[number]} round
 */
export function roundCalendar(round) {
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//VetMock//VCA//TH', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    ...round.parts.flatMap((p) => [
      'BEGIN:VEVENT',
      `UID:vca-${round.id.replace('/', '-')}-part${p.part}@vca.vetmock.com`,
      `DTSTAMP:${utcStamp(p.date, p.from)}`,
      `DTSTART:${utcStamp(p.date, p.from)}`,
      `DTEND:${utcStamp(p.date, p.to)}`,
      `SUMMARY:สอบ VCA หมวด ${p.part} (รอบ ${round.id})`,
      `DESCRIPTION:${FORMAT.perPart} ข้อ ${FORMAT.minutesPerPart / 60} ชั่วโมง ตรวจประกาศล่าสุดได้ที่ ${SOURCES[round.source].url}`,
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:พรุ่งนี้สอบ VCA หมวด ${p.part}`, 'END:VALARM',
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
