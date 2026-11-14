// ============================================================
// The differential board of the Swine Medicine final (2569-1, 23 Nov 2026):
// diarrhoea in pigs, from what the farm shows to the disease.
// ============================================================
// An ARRANGEMENT of src/data/wrapups/swine-clinic-final.js, nothing more.
// Every cell is [words, item, line]: the words are copied from that line of
// that item, and lib/wrap-board.js refuses a cell whose words are not there,
// so the board cannot say anything the wrap-up does not, and each cell keeps
// the wrap-up's citation. The step titles are headings only.
//
// Item: the start of the item's name (exactly one item), which is also the
// node's label on the board; the card opened from it shows the whole name.
// A node whose line is about another entity inside the topic carries
// `label: [words, item, line]` and is named by those words (B. pilosicoli
// under swine dysentery), keeping the topic's number. A clue may carry a
// fourth element, its chip: the board's short Thai label for what the quoted
// words state, adding no fact (lib/wrap-board.js refuses a number the line
// lacks, or a chip that is not Thai).
// Line: k<n> keyword,
// e<n> what the lecturer stressed, x<n> a past-paper line, p the pitfall.
// The skeleton is item 1 (Differential of enteric disease): spread, age,
// faeces, response to an antibiotic, as the lecturer laid it out; the
// diseases are items 2 to 10.
//
// What the wrap-up does not hold is left out, not filled in: an age for
// Salmonella, Campylobacter or gastric ulcer, a stool picture for
// Campylobacter, and the viral causes (TGE, PED, rota) as items of their own.
// ============================================================
const DIFF = 'Differential of enteric disease';
const PE = 'Proliferative enteropathy (PE)';
const CLOS = 'Clostridial enteritis';
const SD = 'Swine dysentery';
const YER = 'Yersinia infection';
const COLI = 'Colibacillosis';
const SAL = 'Salmonellosis';
const COC = 'Swine coccidiosis';
const GU = 'Gastric ulcer';

export const BOARD = {
  v: 1,
  subject: 'swine-clinic',
  exam: '2026-11-23',
  // In phrases: each stays on one line where it fits.
  title: ['ท้องเสียในสุกร', 'ไล่จากสิ่งที่เห็นในฟาร์มไปหาโรค'],
  frame: DIFF,
  steps: [
    {
      title: 'ดูการกระจายในฝูง',
      rows: [
        { clue: ['กระจุกเป็นกลุ่ม', DIFF, 'e0'], to: [{ text: ['โรคจากแบคทีเรีย', DIFF, 'e0'] }] },
        { clue: ['กระจายทั้งฝูง', DIFF, 'e0'], to: [{ text: ['โรคจากไวรัส', DIFF, 'e0'] }] },
      ],
    },
    {
      title: 'ดูอายุ',
      rows: [
        {
          clue: ['ไม่ถึงสัปดาห์', CLOS, 'e2', 'อายุไม่ถึงสัปดาห์'],
          to: [
            {
              item: CLOS,
              notes: [
                ['type A: mild diarrhea < 3 days of age', CLOS, 'k3'],
                ['C. difficile: 3-4 days old', CLOS, 'k4'],
                ['Acute form < 5 days old', CLOS, 'k1'],
              ],
            },
            { item: COLI, label: ['ETEC', COLI, 'k0'], notes: [['ETEC: diarrhea in piglets < 5 days of age', COLI, 'k0']] },
          ],
        },
        {
          clue: ['5-21 วัน', CLOS, 'e1', 'อายุ 5-21 วัน'],
          to: [{ item: CLOS, notes: [['Chronic form 5-21 days old: differential from coccidiosis', CLOS, 'k2']] }],
        },
        {
          clue: ['5 วันถึงหย่านม', COC, 'e0', 'อายุ 5 วันถึงหย่านม'],
          to: [{ item: COC, notes: [['Coccidiosis จาก Isospora suis', COC, 'e0']] }],
        },
        {
          clue: ['หลังหย่านม', COLI, 'e1'],
          to: [{ item: COLI, notes: [['Edema disease 10-20 days, postweaning diarrhea 4-10 days after weaning', COLI, 'k7']] }],
        },
        {
          clue: ['2-6 months of age', SD, 'k2', 'อายุ 2-6 เดือน'],
          to: [{ item: SD, notes: [['Mucohemorrhagic colitis', SD, 'k0']] }],
        },
        {
          clue: ['สุกรขุน', PE, 'x0'],
          note: ['ถ่ายเหลว ถ่ายมูกเลือด และถ่ายสีดำในฝูงเดียวกัน', PE, 'x0'],
          to: [{ item: SD }, { item: PE }, { item: YER }],
        },
        {
          clue: ['สุกรโต', PE, 'k0'],
          to: [{ item: PE, notes: [['PHE: acute form, bloody diarrhea, sudden death', PE, 'k0']] }],
        },
      ],
    },
    {
      title: 'ดูอุจจาระ',
      rows: [
        { clue: ['มูกปนเลือดสด', SD, 'e0'], to: [{ item: SD, notes: [['เลือดออกที่ลำไส้ใหญ่ใกล้ทางออก', SD, 'e0']] }] },
        { clue: ['เลือดคล้ำกว่า', SD, 'e0', 'เลือดสีคล้ำ'], to: [{ item: PE, notes: [['ออกจากลำไส้เล็กส่วนท้าย', SD, 'e0']] }] },
        { clue: ['น้ำสีดำเข้มมีจุดเลือดปน', YER, 'e1'], to: [{ item: YER }] },
        {
          clue: ['เป็นน้ำหรือมูก ไม่มีเลือด', SD, 'e1'],
          to: [{ item: SD, label: ['B. pilosicoli', SD, 'e1'], notes: [['hemolysis อ่อน ก่อ colonic spirochetosis', SD, 'e1'], ['ไม่ถึงตาย', SD, 'e1']] }],
        },
        { clue: ['ไม่มีเลือด สีเหลืองถึงเทาเขียว', COC, 'e0'], to: [{ item: COC, notes: [['Isospora suis', COC, 'e0']] }] },
        { clue: ['อุจจาระเหลือง', SAL, 'e2'], to: [{ item: SAL, notes: [['หูม่วง ตัวม่วง', SAL, 'e2']] }] },
        {
          clue: ['อุจจาระดำในสุกรโต', GU, 'p'],
          note: ['ผ่าซากดูว่าเลือดออกที่กระเพาะหรือที่ลำไส้', GU, 'p'],
          to: [{ item: GU }, { item: PE, notes: [['ileitis แบบ PHE', GU, 'p']] }, { item: YER }],
        },
        {
          clue: ['อุจจาระดำในลูกสุกรอายุไม่ถึงสัปดาห์', YER, 'p'],
          to: [{ item: CLOS, notes: [['นึกถึง Clostridium ก่อน Yersinia', YER, 'p']] }],
        },
        { clue: ['pH > 7', DIFF, 'e1', 'pH อุจจาระ > 7'], to: [{ text: ['แบคทีเรียทำให้อุจจาระเป็นด่าง', DIFF, 'e1'] }] },
        { clue: ['pH < 7', DIFF, 'e1', 'pH อุจจาระ < 7'], to: [{ text: ['ไวรัสทำให้เป็นกรด', DIFF, 'e1'] }] },
      ],
    },
    {
      title: 'ให้ยาปฏิชีวนะแล้วดูผล',
      rows: [
        { clue: ['วันรุ่งขึ้นหยุดท้องเสีย', DIFF, 'e3'], to: [{ text: ['สาเหตุหลักเป็นแบคทีเรีย', DIFF, 'e3'] }] },
        { clue: ['ให้ยาแล้วยังตายเหมือนเดิม', DIFF, 'e3'], to: [{ text: ['นึกถึงไวรัสร่วม เช่น TGE หรือ PED', DIFF, 'e3'] }] },
        { clue: ['ดีขึ้นในวันรุ่งขึ้น', SAL, 'e0'], to: [{ item: SAL, notes: [['ตัวแยกที่เร็วที่สุดคือยาปฏิชีวนะ', SAL, 'e0']] }] },
        {
          clue: ['ไม่ตอบสนองต่อยาปฏิชีวนะ', COC, 'e0'],
          to: [
            { text: ['swine fever', SAL, 'e0'] },
            { item: COC, notes: [['toltrazuril 5% ครั้งเดียวในวันที่ 3', COC, 'e0']] },
          ],
        },
        {
          clue: ['ตอบสนองต่อยาไม่ดี', COLI, 'x0', 'ตัวที่ชักตอบสนองต่อยาไม่ดี'],
          to: [{ item: COLI, label: ['edema disease', COLI, 'x0'], notes: [['ต้องแก้ด้วยการจัดการอาหาร', COLI, 'x0']] }],
        },
      ],
    },
    {
      title: 'ยืนยันด้วยห้องปฏิบัติการ',
      rows: [
        {
          clue: ['smear ย้อม crystal violet (มากกว่า 10 ตัวต่อ field ถือว่าบวก)', SD, 'x1', 'นับ spirochete ใน smear ย้อม crystal violet ได้มากกว่า 10 ตัวต่อ field'],
          to: [{ item: SD, notes: [['darkfield บอกได้แค่สงสัย', SD, 'p']] }],
        },
        { clue: ['PCR, Warthin-Starry stain, immunohistochemistry และ serology', PE, 'x0', 'ยืนยันด้วย PCR, Warthin-Starry stain, immunohistochemistry และ serology'], to: [{ item: PE, notes: [['เพาะเชื้อธรรมดาไม่ได้', PE, 'x0']] }] },
        { clue: ['impression smear', CLOS, 'e1', 'วินิจฉัยด้วย impression smear'], to: [{ item: CLOS, notes: [['แบบเรื้อรังพบอายุ 5-21 วัน', CLOS, 'e1']] }] },
        { clue: ['culture หรือ PCR', YER, 'e2', 'วินิจฉัยด้วย culture หรือ PCR'], to: [{ item: YER }] },
        { clue: ['enrichment และ selective media', SAL, 'e3', 'เพาะเชื้อด้วย enrichment และ selective media'], to: [{ item: SAL }] },
        { clue: ['ลอยตัวในน้ำเกลือหรือน้ำตาลเข้มข้น', COC, 'e1', 'ตรวจ oocyst ด้วยการลอยตัวในน้ำเกลือหรือน้ำตาลเข้มข้น'], to: [{ item: COC, notes: [['oocyst มักพบหลังเริ่มท้องเสีย 2-3 วัน', COC, 'e1']] }] },
        { clue: ['direct smear', COC, 'e2', 'ส่อง direct smear เห็นโปรโตซัวเคลื่อนที่จำนวนมาก'], to: [{ item: COC, label: ['Balantidium coli', COC, 'e2'], notes: [['สุกรโตท้องเสีย', COC, 'e2']] }] },
      ],
    },
  ],
};
