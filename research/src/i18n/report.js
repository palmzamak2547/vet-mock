// Area 'report', key prefix 'report.'. The sentence templates of the methods and results draft, Thai
// and English, filled by workspace/report/build.js from saved envelopes and recipe steps: every
// number arrives through a placeholder from an envelope value, never typed here. Each template is one
// sentence; Thai sentences end without a full stop and build.js adds the English one. OWNER: workspace role. Rules: M1-DESIGN.md 4.

/** @type {[string, string, string][]} */
const ROWS = [
  // methods
  ['report.methods.design', 'รูปแบบการศึกษาเป็นแบบ{design}', 'The study design was {design}'],
  ['report.methods.cluster', 'สัตว์อยู่เป็นกลุ่มตาม{column} และแต่ละการวิเคราะห์ระบุว่าปรับตามฟาร์มด้วยวิธีใด', 'Animals were grouped by {column}, and each analysis states how farms were accounted for'],
  ['report.methods.importConverted', 'ตอนนำเข้าแปลงรูปแบบข้อมูลใน {count} คอลัมน์ (เช่น วันที่ที่เป็นปี พ.ศ. รหัสค่าที่หายไป และรหัสที่ Excel เปลี่ยนเป็นวันที่) ทุกรายการผ่านการยืนยันจากผู้วิจัยก่อน', 'At import, the format of {count} columns was converted (for example dates in Buddhist Era years, missing-value codes and IDs that Excel had turned into dates), each confirmed by the investigator first'],
  ['report.methods.steps', 'ก่อนวิเคราะห์ได้จัดการข้อมูลดังนี้ {steps}', 'Before analysis the data were prepared as follows: {steps}'],
  ['report.methods.analysisNoCi', 'วิเคราะห์ด้วย {method}', '{method} was used'],
  ['report.methods.analysis', 'วิเคราะห์ด้วย {method} และรายงานค่าประมาณพร้อม {level} CI', '{method} was used, with {level} confidence intervals'],
  ['report.methods.table1', 'บรรยายลักษณะของกลุ่มตัวอย่างใน Table 1 (จำนวนและร้อยละ มัธยฐานและ IQR) โดยไม่รายงานค่า p และ CI', 'The sample was described in a Table 1 (counts and percentages, medians and IQR), without p-values or confidence intervals'],
  ['report.methods.table1MeanSd', 'บรรยายลักษณะของกลุ่มตัวอย่างใน Table 1 (จำนวนและร้อยละ มัธยฐานและ IQR หรือค่าเฉลี่ยและ SD) โดยไม่รายงานค่า p และ CI', 'The sample was described in a Table 1 (counts and percentages, medians and IQR or means and SD), without p-values or confidence intervals'],
  ['report.methods.summary', 'บรรยายตัวแปรด้วยค่าสรุป (ค่ากลางและการกระจาย) โดยไม่รายงานค่า p และ CI', 'The variables were described with summary statistics (centre and spread), without p-values or confidence intervals'],
  ['report.methods.roles', 'ตัวแปรที่ใช้ได้แก่ {roles}', 'The variables were {roles}'],
  ['report.methods.role', '{column} ({role})', '{column} ({role})'],
  ['report.methods.route.mhWithin', 'ปรับตามฟาร์มโดยเทียบสัตว์เฉพาะภายใน{column}เดียวกัน', 'Farms were accounted for by comparing animals only within the same {column}'],
  ['report.methods.route.mhWithinNamed', 'ปรับตามฟาร์มด้วยวิธี Mantel-Haenszel โดยเทียบสัตว์เฉพาะภายใน{column}เดียวกัน', 'Farms were accounted for with Mantel-Haenszel methods, comparing animals only within the same {column}'],
  ['report.methods.route.deff', 'ปรับตามฟาร์มโดยขยาย CI ตาม design effect ที่คำนวณจาก ICC ภายใน{column}', 'Farms were accounted for by widening the confidence intervals by the design effect estimated from the ICC within {column}'],
  ['report.methods.route.aggregate', 'ปรับตามฟาร์มโดยวิเคราะห์หนึ่งแถวต่อ{column}', 'Farms were accounted for by analysing one row per {column}'],
  ['report.methods.route.aggregateCounts', 'ปรับตามฟาร์มโดยสรุปข้อมูลสัตว์ {animals} แถวเป็น {farms} แถว หนึ่งแถวต่อฟาร์มตามคอลัมน์ {column}', 'Farms were accounted for by summarising the {animals} animal rows as {farms} farm rows, one row per farm (column {column})'],
  ['report.methods.aggregatePositive', 'ฟาร์มนับเป็นบวกเมื่อมีสัตว์อย่างน้อยหนึ่งตัวให้ผลบวก', 'A farm counted as positive when at least one of its animals was positive'],
  ['report.methods.removed', 'ตัดแถวออก {n} แถวตามขั้นตอนจัดการข้อมูลข้างต้น', '{n} rows were removed in the preparation steps above'],
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
  ['report.results.valueCi', '{value} ({level} CI {bounds})', '{value} ({level} CI {bounds})'],
  ['report.results.compare', 'เมื่อเทียบกลุ่มที่ {exposure} เป็น "{exposed}" กับกลุ่มที่เป็น "{reference}" ได้ {measure} เท่ากับ {value}', 'Comparing {exposure} "{exposed}" with "{reference}", the {measure} was {value}'],
  ['report.results.compareAdjusted', 'เมื่อเทียบกลุ่มที่ {exposure} เป็น "{exposed}" กับกลุ่มที่เป็น "{reference}" โดยปรับตาม {strata} ได้ {measure} เท่ากับ {value}', 'Comparing {exposure} "{exposed}" with "{reference}" and adjusting for {strata}, the {measure} was {value}'],
  ['report.results.ofOutcome', '{label}ของ{outcome} ที่เป็น "{positive}" เท่ากับ {value}', 'The {label} of {outcome} "{positive}" was {value}'],
  ['report.results.estimate', '{label} เท่ากับ {value}', 'The {label} was {value}'],
  ['report.results.undefined', '{label} คำนวณไม่ได้ ({reason})', '{label} could not be computed ({reason})'],
  ['report.results.test', '{test} ได้ {stats}', '{test} gave {stats}'],
  ['report.results.pWithheld', '{test} ยังไม่แสดงค่า p', 'No p-value is shown for {test}'],
  ['report.results.strataDiffer', 'ค่าของแต่ละชั้นต่างกัน ({test} {stats}) ค่ารวมข้ามชั้นจึงควรอ่านอย่างระมัดระวังคู่กับค่าของแต่ละชั้น', 'The strata gave different values ({test}, {stats}), so the pooled estimate should be read with care, alongside the estimate in each stratum'],
  ['report.results.strataTest', 'การทดสอบว่าทุกชั้นมีค่าเท่ากัน ({test}) ได้ {stats}', 'The {test} of equal values across strata gave {stats}'],
  ['report.results.stopped', '{method} หยุดก่อนแสดงผล ดูเหตุผลในผลที่เก็บไว้', '{method} stopped before a result, and the kept result says why'],
  ['report.results.table1', 'ลักษณะของกลุ่มตัวอย่างแสดงใน Table 1', 'Characteristics of the sample are shown in Table 1'],
  ['report.results.summary', 'ค่าสรุปของแต่ละตัวแปรอยู่ในตารางของผลที่เก็บไว้', 'The summary statistics of each variable are in the table of the kept result'],
  ['report.results.tableOnly', 'ผลจาก {method} อยู่ในตารางของผลที่เก็บไว้', 'The result of {method} is in the table of the kept result'],
  // tests inside a sentence
  ['report.test.chisq', 'การทดสอบ chi-square', 'the chi-square test'],
  ['report.test.fisher', "Fisher's exact test", "Fisher's exact test"],
  ['report.test.cmh', 'การทดสอบ Cochran-Mantel-Haenszel', 'the Cochran-Mantel-Haenszel test'],
  ['report.test.tTest', 't-test', 'the t-test'],
  ['report.test.anova', 'การทดสอบ ANOVA', 'the ANOVA F-test'],
  ['report.test.mannWhitney', 'การทดสอบ Mann-Whitney', 'the Mann-Whitney test'],
  ['report.test.kruskalWallis', 'การทดสอบ Kruskal-Wallis', 'the Kruskal-Wallis test'],
  ['report.test.mcnemar', 'การทดสอบ McNemar', "McNemar's test"],
  ['report.test.trend', 'การทดสอบ chi-square for trend', 'the chi-square test for trend'],
  ['report.test.signedRank', 'การทดสอบ Wilcoxon signed-rank', 'the Wilcoxon signed-rank test'],
  ['report.test.pearson', 'การทดสอบค่า Pearson r', "the test of Pearson's r"],
  ['report.test.spearman', 'การทดสอบค่า Spearman rho', "the test of Spearman's rho"],
  ['report.test.overall', 'F-test ของทั้งแบบจำลอง', 'the overall F-test'],
  // the test of equal strata, by variant
  ['report.homogeneity.woolf', 'Woolf test', 'Woolf test'],
  ['report.homogeneity.breslowDayTarone', 'Breslow-Day test ที่ปรับตาม Tarone', "Breslow-Day test with Tarone's correction"],
  ['report.homogeneity.breslowDay', 'Breslow-Day test', 'Breslow-Day test'],
  ['report.homogeneity.generic', 'การทดสอบ', 'test'],
];

const th = {};
const en = {};
for (const [k, a, b] of ROWS) {
  th[k] = a;
  en[k] = b;
}

export default { th, en };
