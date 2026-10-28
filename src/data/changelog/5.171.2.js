// Release 5.171.2. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.171.2',
  date: '2026-10-29',
  headline: 'คำอธิบายในแอปตรงกับที่คลังมีจริง',
  changes: [
    { kind: 'fix', scope: 'system', title: 'หน้าแรกและหน้าเกี่ยวกับบอกตามจริง', desc: 'บอกว่ามีโจทย์ตั้งแต่ปี 1 ถึงปี 5 แต่บางวิชาของปี 1 ถึงปี 3 ยังไม่มี และข้อที่ตอบผิดซ้ำเป็นครั้งที่สองจะเข้ารอบทบทวนเอง ส่วนชุดที่ VetMock AI สุ่มให้เรียกว่าโจทย์ฝึก' },
    { kind: 'fix', scope: 'system', title: 'ที่มาใต้โจทย์อ่านง่ายขึ้น', desc: 'แถวที่มา ตรวจกับ และหมายเหตุใต้โจทย์ คั่นแต่ละส่วนด้วยจุลภาค' },
  ],
};
