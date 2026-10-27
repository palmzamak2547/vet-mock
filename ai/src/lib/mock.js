// Dev only (?mock): a scripted stream in the real event shapes, so the UI can be
// built and checked without a key. Never bundled into production (dynamic import
// behind import.meta.env.DEV).

const wait = (ms, signal) => new Promise((res, rej) => {
  const t = setTimeout(res, ms);
  signal?.addEventListener('abort', () => { clearTimeout(t); rej(new DOMException('aborted', 'AbortError')); }, { once: true });
});

const ANSWER = `**Rabies** ในสุนัขมีระยะฟักตัวแปรผันมาก ขึ้นกับตำแหน่งแผลและปริมาณเชื้อ [1]

## ระยะของโรค
- **Prodromal** ราว 2 ถึง 3 วัน พฤติกรรมเปลี่ยน [1]
- **Furious** ดุร้าย กัดสิ่งของ [2]
- **Paralytic** อัมพาต กลืนลำบาก น้ำลายไหล [1, 2]

| ระยะ | อาการเด่น |
| --- | --- |
| Prodromal | พฤติกรรมเปลี่ยน |
| Furious | ดุร้าย |
| Paralytic | อัมพาต |

ตัวเลขทดสอบที่ไม่มีในแหล่ง: 999 วัน`;

export async function mockChat({ messages, signal, on }) {
  const q = messages[messages.length - 1]?.content || '';
  on('status', { phase: 'plan', label: 'ทำความเข้าใจคำถาม' });
  await wait(500, signal);
  on('status', { phase: 'search', label: 'ค้นในคลัง VetMock' });
  await wait(900, signal);
  if (/ข้อสอบ|quiz/i.test(q)) {
    on('sources', { covered: true, items: [] });
    on('delta', { text: 'ข้อสอบจริงจากคลัง 2 ข้อ ลองทำดู' });
    on('cards', { items: [{ type: 'quiz', title: 'COM5', questions: [
      { id: 'mock-1', stem: 'เชื้อใดเป็นสาเหตุของโรคพิษสุนัขบ้า', options: ['Lyssavirus', 'Parvovirus', 'Morbillivirus', 'Coronavirus'], answer: 0, explain: 'Rabies virus อยู่ในสกุล Lyssavirus', subject: 'com5', url: 'https://vetmock.com/' },
      { id: 'mock-2', stem: 'สัตว์ชนิดใด**ไม่ใช่**พาหะหลักของ rabies ในไทย', options: ['สุนัข', 'แมว', 'ปลา', 'วัว'], answer: 2, explain: null, subject: 'com5', url: 'https://vetmock.com/' },
    ] }] });
    on('check', { ungrounded: [], invalidCitations: [] });
    on('done', { ms: 1400, model: 'primary' });
    return;
  }
  on('sources', { covered: true, items: [
    { n: 1, kind: 'wiki', title: 'Rabies', subtitle: 'COM5', subject: 'com5', url: 'https://vetmock.com/wiki/com5/rabies', snippet: 'ระยะฟักตัวขึ้นกับตำแหน่งที่ถูกกัดและปริมาณเชื้อ' },
    { n: 2, kind: 'note', title: 'Rabies: clinical signs', subtitle: 'โน้ต COM5', subject: 'com5', url: 'https://vetmock.com/', snippet: 'furious form และ paralytic form' },
    { n: 3, kind: 'paper', title: 'Rabies in dogs: a review', subtitle: 'Vet J 2024', url: 'https://pubmed.ncbi.nlm.nih.gov/', snippet: 'Incubation period in dogs varies widely.' },
  ] });
  on('status', { phase: 'write', label: 'เรียบเรียงคำตอบ' });
  await wait(300, signal);
  const parts = ANSWER.match(/[\s\S]{1,6}/g);
  for (const p of parts) {
    on('delta', { text: p });
    await wait(16 + Math.random() * 30, signal);
  }
  on('check', { ungrounded: ['999'], invalidCitations: [] });
  on('done', { ms: 2600, model: 'primary' });
}
