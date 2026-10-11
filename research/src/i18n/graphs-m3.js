// Area 'graphs-m3', key prefix 'graphs.' [M3-DESIGN.md 5, M2-DESIGN.md 9]. The words of the M3a charts: standard
// curve, dose-response, fitted curve, scree, biplot, qPCR fold change, the area-under-the-curve charts and the panels of
// two within factors. Kept apart from graphs.js so the first workspace chunk does not carry them (the source budget in
// tests/unit/build-lazy-exporters.test.mjs), as terms-m2.js is kept apart from terms.js for the landing. Registered at
// module load by src/workspace/charts/words.js, which charts/model.js and charts/from-result.js import: every screen
// that lists or draws a chart reaches one of the two through a static import, so these words exist before an M3 chart
// or its title renders. OWNER: graphs role. Rules: docs/research/M1-DESIGN.md 4.3 and M2-DESIGN.md 9 (plain words,
// one term per concept, statistics terms in English with a Thai gloss once, no middle dot, no ellipsis, no star glyph,
// Arabic digits).
// One row per key: [key, Thai, English].
const ROWS = [
  ['graphs.kind.doseResponse', 'เส้นโค้ง dose-response', 'Dose-response curves'],
  ['graphs.kind.standardCurve', 'Standard curve', 'Standard curve'],
  ['graphs.kind.fittedCurve', 'เส้นโค้งจากสมการ', 'Fitted curve'],
  ['graphs.kind.scree', 'Scree plot', 'Scree plot'],
  ['graphs.kind.biplot', 'Biplot', 'Biplot'],
  ['graphs.kind.qpcrFold', 'fold change ของแต่ละตัวอย่าง', 'Fold change of each sample'],
  ['graphs.title.standardCurve', 'Standard curve กับแถบ CI และค่าที่อ่านจาก curve', 'Standard curve with its CI band and the unknowns read off it'],
  ['graphs.title.doseResponse', 'เส้นโค้ง dose-response กับแถบ CI และ EC50 หรือ IC50', 'Dose-response curves with their CI bands and EC50 or IC50'],
  ['graphs.title.fittedCurve', 'เส้นโค้งจากสมการกับแถบ CI', 'Fitted curve with its CI band'],
  ['graphs.title.aucCourse', 'ค่าของสัตว์แต่ละตัวตามเวลา กับค่าเฉลี่ยของกลุ่ม', 'Each animal over time, with the group means'],
  ['graphs.title.aucAreas', 'พื้นที่ใต้กราฟ (AUC) ของสัตว์แต่ละตัว', 'Area under the curve of each animal'],
  ['graphs.title.qpcrFold', 'fold change ของแต่ละตัวอย่างเทียบกลุ่ม calibrator (สเกล log2)', 'Fold change of each sample against the calibrator (log2 scale)'],
  ['graphs.title.scree', 'eigenvalue และความแปรปรวนสะสมของแต่ละ component (scree plot)', 'Eigenvalue and cumulative variance of each component (scree plot)'],
  ['graphs.title.biplot', 'Biplot ของ component ที่ 1 และ 2', 'Biplot of the first two components'],
  ['graphs.title.twoWithin', 'ค่าเฉลี่ยและ CI ตามเวลา แยกตามปัจจัยที่สองภายในตัว', 'Means and CIs over time, by the second within-animal factor'],
  ['graphs.col.fitted', 'ค่าบน curve', 'On the curve'],
  ['graphs.col.readOff', 'ค่าที่อ่านจาก curve', 'Read off the curve'],
  ['graphs.col.response', 'ค่าที่วัดได้', 'Response'],
  ['graphs.col.concentration', 'ความเข้มข้น', 'Concentration'],
  ['graphs.col.halfway', 'ค่าการตอบสนองครึ่งทาง', 'Half-way response'],
  ['graphs.col.component', 'component (องค์ประกอบหลัก)', 'Component'],
  ['graphs.col.eigenvalue', 'eigenvalue', 'Eigenvalue'],
  ['graphs.col.variance', 'ร้อยละของความแปรปรวนทั้งหมด', 'Share of the variance'],
  ['graphs.col.cumulative', 'ร้อยละสะสม', 'Cumulative share'],
  ['graphs.col.measurement', 'ตัวแปรที่วัด', 'Measurement'],
  ['graphs.col.fold', 'fold change (ค่าเฉลี่ยเรขาคณิต)', 'Fold change (geometric mean)'],
  ['graphs.curve.ic50', 'IC50', 'IC50'],
  ['graphs.curve.ec50', 'EC50', 'EC50'],
  ['graphs.curve.ecOrIc', 'EC50 หรือ IC50 ของแต่ละ curve', 'EC50 or IC50 of each curve'],
  ['graphs.curve.potencyRow', '{name} (ที่ค่าการตอบสนองครึ่งทาง)', '{name} (at the half-way response)'],
  ['graphs.curve.outside', 'นอกช่วงของ standard curve', 'outside the standard curve'],
  ['graphs.curve.row', 'แถว {row}', 'Row {row}'],
  ['graphs.scree.xTitle', 'component (องค์ประกอบหลัก)', 'Component'],
  ['graphs.scree.yTitle', 'eigenvalue', 'Eigenvalue'],
  ['graphs.scree.legendEigen', 'eigenvalue (แกนซ้าย)', 'Eigenvalue (left axis)'],
  ['graphs.scree.legendCumulative', 'ร้อยละสะสมของความแปรปรวน (แกนขวา)', 'Cumulative share of the variance (right axis)'],
  ['graphs.biplot.arrowOn', 'ลูกศรบน {axis}', 'Arrow on {axis}'],
  ['graphs.biplot.axis', '{pc} ({share} ของความแปรปรวน)', '{pc} ({share} of the variance)'],
  ['graphs.qpcr.yTitle', 'fold change (สเกล log2)', 'Fold change (log2 scale)'],
  ['graphs.qpcr.calibratorRow', '{group} (calibrator)', '{group} (calibrator)'],
  ['graphs.auc.yTitle', 'พื้นที่ใต้กราฟของ {outcome}', 'Area under the curve of {outcome}'],
  ['graphs.panels.title', '{factor}: {level}', '{factor}: {level}'],
  ['graphs.panels.legend', '{factor} {level}', '{factor} {level}'],
  ['graphs.note.curve', 'จุดคือค่าที่วัดได้ เส้นคือ curve ที่ fit ได้ แถบจางคือ {level} CI ของ curve เอง ไม่ใช่ช่วงที่ค่าที่วัดใหม่หนึ่งค่าจะตกอยู่', 'Points are the measured values. The line is the fitted curve and the band its {level} CI, the uncertainty of the curve itself, not the range a new measurement would fall in.'],
  ['graphs.note.curvePotency', 'แถบแนวนอนที่ค่าการตอบสนองครึ่งทางคือ {name} กับ {level} CI จุดโปร่งบนแถบคือค่าประมาณ', 'The horizontal bar at the half-way response is the {name} with its {level} CI; the open marker on it is the estimate.'],
  ['graphs.note.curveLog', 'แกนความเข้มข้นเป็นสเกล log', 'The concentration axis is on a log scale.'],
  ['graphs.note.curveLogZero', 'แกนความเข้มข้นเป็นสเกล log ซึ่งไม่มีตำแหน่งของ 0 ความเข้มข้น 0 จึงวาดไว้หลังรอยตัดของแกนที่เขียนว่า 0 พร้อมขีดสั้นที่ค่าของ curve ที่ 0', 'The concentration axis is on a log scale, which has no place for 0: doses of 0 are drawn beyond the break in the axis labelled 0, with the curve’s value at 0 as a short line.'],
  ['graphs.note.curveNoPoints', 'ไม่ได้วาดค่าที่วัดได้ทีละจุด curve แถบ CI และค่าครึ่งทางมาจากผลการวิเคราะห์', 'The measured values are not drawn here; the curve, its band and the half-way values come from the result.'],
  ['graphs.note.unknowns', 'กากบาทคือตัวอย่างที่อ่านความเข้มข้นจาก curve เส้นจุดลากไปที่ค่าที่วัดได้และความเข้มข้นที่อ่านได้ CI ในตารางรวมเฉพาะความไม่แน่นอนของ curve ไม่รวมความคลาดเคลื่อนของการวัดตัวอย่างนั้นเอง', 'Each cross is an unknown read off the curve, with dotted lines to its response and its concentration. Its CI in the table carries the curve’s uncertainty only, not the error of measuring that sample.'],
  ['graphs.note.unknownsOutside', 'นอกช่วงของ standard curve จึงไม่ได้วาด: {rows}', 'Outside the standard curve, so not drawn: {rows}.'],
  ['graphs.note.scree', 'จุดวงกลมคือ eigenvalue ของแต่ละ component (แกนซ้าย) จุดสี่เหลี่ยมคือร้อยละสะสมของความแปรปรวน (แกนขวา)', 'Circles are the eigenvalue of each component (left axis); squares the cumulative share of the variance (right axis).'],
  ['graphs.note.screeReference', 'เส้นประที่ eigenvalue 1 เป็นเส้นอ้างอิงของ PCA บน correlation matrix ไม่ใช่กฎว่าต้องเก็บกี่ component', 'The dashed line at eigenvalue 1 is a reference for a PCA on the correlation matrix, not a rule for how many components to keep.'],
  ['graphs.note.biplot', 'จุดคือ score ของแต่ละแถว ลูกศรคือ loading ของแต่ละตัวแปร สเกลเดียวกับ biplot(prcomp(x), scale = 1) ของ R จุดอ่านค่าจากแกนล่างและซ้าย ลูกศรอ่านจากแกนบนและขวา ลูกศรที่ชี้ทางเดียวกันคือตัวแปรที่มักสูงขึ้นด้วยกัน', 'Points are the scores of each row and arrows the loadings of each measurement, scaled as R’s biplot(prcomp(x), scale = 1): points read on the bottom and left axes, arrows on the top and right axes. Arrows that point the same way are measurements that tend to rise together.'],
  ['graphs.note.biplotLabelsLeft', 'ไม่เขียนชื่อกำกับ {n} จุด เพราะจะทับชื่ออื่น ตาราง score ในผลการวิเคราะห์มีชื่อของทุกแถว', 'Points left unlabelled where a name would cover another: {n}. The scores table of the result names every row.'],
  ['graphs.note.biplotNoLabels', 'มีจุดมากกว่า {n} จุด จึงไม่เขียนชื่อกำกับจุด', 'More than {n} points, so the points are not labelled.'],
  ['graphs.note.qpcrFold', 'จุดแต่ละจุดคือตัวอย่าง 1 ตัวอย่าง คือ 2 ยกกำลังลบของ (ΔCt ของตัวอย่าง ลบ ΔCt เฉลี่ยของ {calibrator}) บนแกนสเกล log2 ซึ่ง 1 คือไม่เปลี่ยนจาก {calibrator} ขีดแนวนอนคือ fold change เฉลี่ยแบบเรขาคณิตของกลุ่ม เส้นแนวตั้งคือ {level} CI ของ ΔCt เฉลี่ยของกลุ่ม โดยถือค่าเฉลี่ยของ {calibrator} คงที่', 'Each dot is one sample: 2 to the power of minus (its ΔCt minus the mean ΔCt of {calibrator}), on a log2 axis where 1 means no change from {calibrator}. The bar is the group’s geometric mean fold change and the vertical line the {level} CI of its mean ΔCt, with the mean of {calibrator} held fixed.'],
  ['graphs.note.qpcrTested', 'การทดสอบทางสถิติทำบน ΔCt ส่วน fold change แสดงให้ดูเท่านั้น ไม่ได้นำไปทดสอบ', 'The tests run on ΔCt; fold changes are shown, never tested.'],
  ['graphs.note.aucCourse', 'เวลาวางตามระยะห่างจริง เส้นของสัตว์แต่ละตัวจึงล้อมพื้นที่ที่ผลคำนวณไว้ให้ตัวนั้น (กฎสี่เหลี่ยมคางหมู นับจาก 0)', 'Times are drawn at their real spacing, so each animal’s line encloses the area the result computed for it (trapezoidal rule, from 0).'],
  ['graphs.note.aucCourseFirst', 'เวลาวางตามระยะห่างจริง พื้นที่ของสัตว์แต่ละตัวคือพื้นที่ระหว่างเส้นของตัวนั้นกับค่าแรกของตัวเอง (กฎสี่เหลี่ยมคางหมู ช่วงที่ต่ำกว่าค่าแรกนับเป็นลบ)', 'Times are drawn at their real spacing; each animal’s area is the area between its line and its own first value (trapezoidal rule, the part below the first value counted negative).'],
  ['graphs.note.timePanels', 'จุดคือค่าเฉลี่ยของแต่ละคู่ระดับ เส้นแนวตั้งคือ {level} CI แบบ t ของคู่นั้นเพียงคู่เดียว เส้นเชื่อมจุดของ {factor} ระดับเดียวกัน แผงละ 1 ระดับของ {panel} ทุกแผงใช้แกนค่าเดียวกัน', 'Points are the mean of each pairing of levels and vertical lines the {level} t interval of that pairing alone; lines join the points of the same level of {factor}. One panel per level of {panel}, all on the same value axis.'],
  ['graphs.note.timePanelsOne', 'จุดคือค่าเฉลี่ยของแต่ละคู่ระดับ เส้นแนวตั้งคือ {level} CI แบบ t ของคู่นั้นเพียงคู่เดียว เส้นเชื่อมจุดของ {factor} ระดับเดียวกัน', 'Points are the mean of each pairing of levels and vertical lines the {level} t interval of that pairing alone; lines join the points of the same level of {factor}.'],
  ['graphs.summary.doseResponse', 'curve ที่ fit ได้ {k} เส้น พร้อมแถบ {level} CI: {rows}', '{k} fitted curves with their {level} CI bands: {rows}'],
  ['graphs.summary.standardCurve', 'Standard curve {potency} อ่านความเข้มข้นได้ {shown} ตัวอย่าง นอกช่วงของ curve {outside} ตัวอย่าง', 'Standard curve, {potency}; {shown} unknowns read off the curve, {outside} outside it'],
  ['graphs.summary.fittedCurve', 'curve จากสมการพร้อมแถบ {level} CI ตั้งแต่ {from} ถึง {to} จากค่าที่วัด {n} จุด', 'Fitted curve with its {level} CI band from {from} to {to}, {n} measured points'],
  ['graphs.summary.scree', 'Scree plot {k} component: {rows}', 'Scree plot of {k} components: {rows}'],
  ['graphs.summary.screeRow', '{component} eigenvalue {eigenvalue} ({share} สะสม {cumulative})', '{component} eigenvalue {eigenvalue} ({share}, cumulative {cumulative})'],
  ['graphs.summary.biplot', 'Biplot ของ {n} แถวและ {p} ตัวแปรบน {x} และ {y} ลูกศร: {arrows}', 'Biplot of {n} rows and {p} measurements on {x} and {y}; arrows: {arrows}'],
  ['graphs.summary.qpcrFold', 'fold change เทียบ {calibrator} {k} กลุ่ม: {rows}', 'Fold change against {calibrator}, {k} groups: {rows}'],
  ['graphs.summary.qpcrGroup', '{group} n = {n} ค่าเฉลี่ยเรขาคณิต {fold} ({level} CI {ci})', '{group} n = {n}, geometric mean {fold} ({level} CI {ci})'],
  ['graphs.summary.timePanels', 'ค่าเฉลี่ยตามเวลา {panels} แผง {series} เส้นต่อแผง {times} เวลา: {rows}', 'Means over time, {panels} panels, {series} lines each, {times} times: {rows}'],
];

const th = {};
const en = {};
for (const [k, a, b] of ROWS) {
  th[k] = a;
  en[k] = b;
}

export default { th, en };
