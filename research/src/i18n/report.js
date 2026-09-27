// Area 'report', key prefix 'report.'. The sentence templates of the methods and results draft, Thai
// and English, filled by workspace/report/build.js from saved envelopes and recipe steps: every
// number arrives through a placeholder from an envelope value, never typed here. Each template is one
// sentence; Thai sentences end without a full stop and build.js adds the English one. OWNER: workspace role. Rules: M1-DESIGN.md 4.

/** @type {[string, string, string][]} */
const ROWS = [
  // methods
  ['report.methods.design', 'รูปแบบการศึกษาเป็นแบบ{design}', 'The study design was {design}'],
  ['report.methods.cluster', 'สัตว์อยู่เป็นกลุ่มตาม{column} และแต่ละการวิเคราะห์ระบุว่าปรับตามฟาร์มด้วยวิธีใด', 'Animals were grouped by {column}, and each analysis states how farms were accounted for'],
  ['report.methods.steps', 'ก่อนวิเคราะห์ได้จัดการข้อมูลดังนี้ {steps}', 'Before analysis the data were prepared as follows: {steps}'],
  ['report.methods.analysis', 'วิเคราะห์ด้วย {method} และรายงานค่าประมาณพร้อม {level} CI', '{method} was used, with {level} confidence intervals'],
  ['report.methods.analysisDescriptive', 'บรรยายลักษณะของกลุ่มตัวอย่างด้วย {method} โดยไม่รายงานค่า p และ CI', '{method} was used to describe the sample, without p-values or confidence intervals'],
  ['report.methods.roles', 'ตัวแปรที่ใช้ได้แก่ {roles}', 'The variables were {roles}'],
  ['report.methods.role', '{column} ({role})', '{column} ({role})'],
  ['report.methods.route.mhWithin', 'ปรับตามฟาร์มโดยเทียบสัตว์เฉพาะภายใน{column}เดียวกัน', 'Farms were accounted for by comparing animals only within the same {column}'],
  ['report.methods.route.mhWithinNamed', 'ปรับตามฟาร์มด้วยวิธี Mantel-Haenszel โดยเทียบสัตว์เฉพาะภายใน{column}เดียวกัน', 'Farms were accounted for with Mantel-Haenszel methods, comparing animals only within the same {column}'],
  ['report.methods.route.deff', 'ปรับตามฟาร์มโดยขยาย CI ตาม design effect ที่คำนวณจาก ICC ภายใน{column}', 'Farms were accounted for by widening the confidence intervals by the design effect estimated from the ICC within {column}'],
  ['report.methods.route.aggregate', 'ปรับตามฟาร์มโดยวิเคราะห์หนึ่งแถวต่อ{column}', 'Farms were accounted for by analysing one row per {column}'],
  ['report.methods.dropped', 'ไม่นำแถวที่มีค่าที่หายไป {n} แถวมาวิเคราะห์', '{n} rows with missing values were left out'],
  ['report.methods.droppedOne', 'ไม่นำแถวที่มีค่าที่หายไป 1 แถวมาวิเคราะห์', 'One row with missing values was left out'],
  ['report.methods.software', 'คำนวณด้วย VetMock Research Studio รุ่น {engine}', 'Analyses were run in VetMock Research Studio, version {engine}'],
  // role nouns inside a sentence
  ['report.role.outcome', 'ตัวแปรผล', 'outcome'],
  ['report.role.exposure', 'ปัจจัยที่สนใจ', 'exposure'],
  ['report.role.group', 'กลุ่ม', 'groups'],
  ['report.role.x', 'ตัวแปรแรก', 'first variable'],
  ['report.role.y', 'ตัวแปรที่สอง', 'second variable'],
  ['report.role.strata', 'ชั้น', 'strata'],
  ['report.role.cluster', 'ฟาร์ม', 'farm'],
  ['report.role.pair', 'คู่', 'pairs'],
  ['report.role.raterA', 'ผู้ประเมินคนที่ 1', 'rater 1'],
  ['report.role.raterB', 'ผู้ประเมินคนที่ 2', 'rater 2'],
  ['report.role.test', 'ชุดตรวจที่ประเมิน', 'test evaluated'],
  ['report.role.reference', 'วิธีอ้างอิง', 'reference standard'],
  ['report.role.covariates', 'ตัวแปรอธิบาย', 'explanatory variables'],
  ['report.role.described', 'ตัวแปรที่บรรยาย', 'described'],
  ['report.role.time', 'เวลาที่สัตว์อยู่ในการศึกษา', 'animal-time'],
  // results
  ['report.results.lead', 'ผลจาก {method} ได้ {parts}', '{method} gave {parts}'],
  ['report.results.valueCi', '{label} {value} ({level} CI {bounds})', '{label} {value} ({level} CI {bounds})'],
  ['report.results.value', '{label} {value}', '{label} {value}'],
  ['report.results.undefined', '{label} คำนวณไม่ได้ ({reason})', '{label} could not be computed ({reason})'],
  ['report.results.p', '{test} {p}', '{test}, {p}'],
  ['report.results.pWithheld', '{test} ยังไม่แสดงค่า p', 'no p-value shown for {test}'],
  ['report.results.stopped', '{method} หยุดก่อนแสดงผล ดูเหตุผลในผลที่เก็บไว้', '{method} stopped before a result, and the kept result says why'],
  ['report.results.tableOnly', 'ผลจาก {method} อยู่ในตารางของผลที่เก็บไว้', 'The {method} result is the table in the kept result'],
];

const th = {};
const en = {};
for (const [k, a, b] of ROWS) {
  th[k] = a;
  en[k] = b;
}

export default { th, en };
