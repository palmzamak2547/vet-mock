// Area 'report', key prefix 'report.'. The sentence templates of the methods and results draft, Thai
// and English, filled by workspace/report/build.js from saved envelopes and recipe steps: every
// number arrives through a placeholder from an envelope value, never typed here. Thai sentences end
// without a full stop (build.js adds the English one). OWNER: workspace role. Rules: M1-DESIGN.md 4.

/** @type {[string, string, string][]} */
const ROWS = [
  // methods
  ['report.methods.design', 'รูปแบบการศึกษาเป็นแบบ{design}', 'Study design: {design}'],
  ['report.methods.cluster', 'สัตว์อยู่เป็นกลุ่มตาม{column} วิธีปรับตามฟาร์มระบุไว้ในแต่ละการวิเคราะห์', 'Animals were grouped by {column}; how farms were accounted for is given with each analysis'],
  ['report.methods.steps', 'ก่อนวิเคราะห์ได้จัดการข้อมูลดังนี้ {steps}', 'Before analysis the data were prepared as follows: {steps}'],
  ['report.methods.analysis', 'วิเคราะห์ด้วย {method} รายงานค่าประมาณพร้อม {level} CI', '{method} was used, reporting estimates with {level} CIs'],
  ['report.methods.roles', 'ตัวแปรที่ใช้ {roles}', 'variables used were {roles}'],
  ['report.methods.role', '{role} คือ {column}', '{role} {column}'],
  ['report.methods.route.mhWithin', 'ปรับตามฟาร์มโดยเทียบภายในฟาร์มด้วยวิธี Mantel-Haenszel ใช้ {column} เป็นชั้น', 'farms were accounted for by comparing within farms with the Mantel-Haenszel method, using {column} as strata'],
  ['report.methods.route.deff', 'ปรับตามฟาร์มโดยขยาย CI และค่า p ด้วย design effect ที่คำนวณจาก ICC ภายใน{column}', 'farms were accounted for by widening the CI and p-value with the design effect from the ICC within {column}'],
  ['report.methods.route.aggregate', 'ปรับตามฟาร์มโดยวิเคราะห์หนึ่งแถวต่อ{column}', 'farms were accounted for by analysing one row per {column}'],
  ['report.methods.dropped', 'ตัดแถวที่มีค่าที่หายไปออก {n} แถว', '{n} rows with missing values were left out'],
  ['report.methods.software', 'คำนวณด้วย VetMock Research Studio ({engine})', 'Analyses were run in VetMock Research Studio ({engine})'],
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
  ['report.role.time', 'เวลาที่สัตว์อยู่ในการศึกษา', 'animal-time'],
  // results
  ['report.results.lead', '{method}: {parts}', '{method}: {parts}'],
  ['report.results.valueCi', '{label} {value} ({level} CI {bounds})', '{label} {value} ({level} CI {bounds})'],
  ['report.results.value', '{label} {value}', '{label} {value}'],
  ['report.results.undefined', '{label} คำนวณไม่ได้ ({reason})', '{label} could not be computed ({reason})'],
  ['report.results.p', '{test} {p}', '{test} {p}'],
  ['report.results.pWithheld', '{test} ยังไม่แสดงค่า p', '{test} p-value withheld'],
  ['report.results.stopped', '{method} หยุดก่อนแสดงผล ดูเหตุผลในผลที่เก็บไว้', '{method} stopped before a result; the kept result says why'],
  ['report.results.tableOnly', '{method}: ดูตารางในผลที่เก็บไว้', '{method}: see the table in the kept result'],
];

const th = {};
const en = {};
for (const [k, a, b] of ROWS) {
  th[k] = a;
  en[k] = b;
}

export default { th, en };
