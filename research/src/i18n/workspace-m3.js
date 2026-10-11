// Area 'workspace-m3', key prefix 'ws.': the words of the M3a analysis screens [M3-DESIGN.md 2, 6] (the questions
// and layouts of the standard curve, dose-response, curve equation, area under the curve, qPCR and PCA, the
// method blurbs, the role words, option words and plain sentences of the eight new methods, the Pfaffl efficiency
// boxes, the Firth switch, the second within factor of repeated measures). Kept apart from workspace.js so the
// first workspace chunk does not carry them (tests/unit/build-lazy-exporters.test.mjs byte budget): the project
// screen (screens/Project.jsx), the lazy root of every analysis, report and figure pane, registers this file
// before any of them renders. Rules as workspace.js (M2-DESIGN.md 9: plain words, statistics terms English with a
// short Thai gloss, no middle dot, ellipsis or star glyph, Arabic digits). OWNER: ui-analysis role.
//
// Rows of [key, Thai, English], as workspace.js, so the two languages cannot drift apart in their keys.

/** @type {[string, string, string][]} */
const ROWS = [
  ['ws.question.standardCurve.title', 'อ่านความเข้มข้นจาก standard curve', 'Read concentrations off a standard curve'],
  ['ws.question.standardCurve.help', 'เช่นเพลต ELISA ที่มีสารมาตรฐานหลายความเข้มข้นกับตัวอย่างที่ไม่รู้ค่า ใส่ความเข้มข้นของสารมาตรฐาน เว้นว่างไว้ในแถวของตัวอย่าง แล้วระบบอ่านค่าจากเส้นโค้ง 4PL หรือ 5PL', 'For example an ELISA plate with standards at known concentrations and samples of unknown concentration. Enter the standards’ concentrations and leave the samples’ blank; they are read off a 4PL or 5PL curve.'],
  ['ws.question.doseResponse.title', 'ขนาดยากับการตอบสนอง', 'Dose and response'],
  ['ws.question.doseResponse.help', 'เช่นการเจริญของเชื้อที่ความเข้มข้นยาหลายระดับ ได้ EC50 หรือ IC50 ของแต่ละกลุ่ม และทดสอบว่าเส้นโค้งของแต่ละกลุ่มต่างกันไหม', 'For example bacterial growth at several drug concentrations: the EC50 or IC50 of each group, and a test of whether the groups’ curves differ.'],
  ['ws.question.curveEquation.title', 'หาค่าในสมการของเส้นโค้ง', 'Fit a curve equation'],
  ['ws.question.curveEquation.help', 'Michaelis-Menten สำหรับปฏิกิริยาของเอนไซม์ การลดลงแบบ exponential เช่นระดับยาในเลือด (ได้ half-life) และการเพิ่มแบบ exponential เช่นจำนวนเชื้อ (ได้ doubling time)', 'Michaelis-Menten for enzyme kinetics, one-phase decay such as a drug level in blood (with its half-life), and exponential growth such as bacterial counts (with the doubling time).'],
  ['ws.question.areaUnderCurve.title', 'สรุปค่าที่วัดซ้ำเป็นพื้นที่ใต้กราฟ', 'Sum up repeated measurements as an area under the curve'],
  ['ws.question.areaUnderCurve.help', 'เช่นการทดสอบความทนต่อกลูโคส สัตว์แต่ละตัวได้พื้นที่ใต้กราฟหนึ่งค่า แล้วเทียบกลุ่มด้วย Welch t-test (สองกลุ่ม) หรือ one-way ANOVA (สามกลุ่มขึ้นไป)', 'For example a glucose tolerance test: one area per animal, then the groups compared by Welch’s t-test (two groups) or one-way ANOVA (three or more).'],
  ['ws.question.geneExpression.title', 'การแสดงออกของยีนจาก qPCR', 'Gene expression from qPCR'],
  ['ws.question.geneExpression.help', 'ค่า Ct ของยีนที่สนใจกับยีนอ้างอิง เทียบกับกลุ่มเทียบ (calibrator) ด้วยวิธี Livak หรือ Pfaffl และหาประสิทธิภาพของ primer จาก dilution series', 'Ct values of a gene of interest and reference genes compared with a calibrator group by the Livak or Pfaffl method, and primer efficiency from a dilution series.'],
  ['ws.question.manyMeasures.title', 'ค่าที่วัดหลายตัวพร้อมกันไปด้วยกันอย่างไร', 'How several measures move together'],
  ['ws.question.manyMeasures.help', 'เช่นค่าเลือดหลายตัวของโคชุดเดียวกัน PCA สรุปเป็นองค์ประกอบไม่กี่ตัว ใช้บรรยายข้อมูล ไม่ใช่การทดสอบ', 'For example several blood values on the same cows: PCA sums them up in a few components. It describes the data; it is not a test.'],

  ['ws.layout.assay', 'standard curve ในเพลต', 'standard curve assay'],
  ['ws.layout.doseResponse', 'หลายความเข้มข้น', 'dose-response'],
  ['ws.layout.curve', 'เส้นโค้งตามสมการ', 'curve fit'],
  ['ws.layout.qpcr', 'qPCR', 'qPCR'],
  ['ws.layout.multivariate', 'หลายค่าที่วัดพร้อมกัน', 'many measures'],

  ['ws.methodBlurb.nlsFourPL', '4PL หรือ 5PL พร้อม EC50 และความเข้มข้นของแต่ละตัวอย่างพร้อม 95% CI', '4PL or 5PL, with the EC50 and each sample’s concentration with its 95% CI'],
  ['ws.methodBlurb.nlsDoseResponse', 'เส้นโค้งของแต่ละกลุ่ม EC50 หรือ IC50 และ extra sum-of-squares F test', 'A curve per group, the EC50 or IC50, and the extra sum-of-squares F test'],
  ['ws.methodBlurb.nlsEquation', 'Michaelis-Menten, decay หรือ growth พร้อมค่าในสมการและ 95% CI', 'Michaelis-Menten, decay or growth, with each value of the equation and its 95% CI'],
  ['ws.methodBlurb.calcAuc', 'พื้นที่ใต้กราฟหนึ่งค่าต่อตัว แล้วเทียบกลุ่ม', 'One area per animal, then the groups compared'],
  ['ws.methodBlurb.qpcrRelative', 'ΔΔCt และ fold change เทียบกับกลุ่มเทียบ ทดสอบบน ΔCt', 'ΔΔCt and fold change against the calibrator, tested on ΔCt'],
  ['ws.methodBlurb.qpcrEfficiency', 'ประสิทธิภาพของ primer จาก dilution series', 'Primer efficiency from a dilution series'],
  ['ws.methodBlurb.mvPca', 'องค์ประกอบหลัก loading และ biplot', 'Principal components, loadings and a biplot'],
  ['ws.methodBlurb.regNegbin', 'IRR เมื่อจำนวนนับกระจายกว้างกว่าที่ Poisson คาด (overdispersion)', 'An IRR when the counts spread more than Poisson expects (overdispersion)'],

  ['ws.roleFor.nlsFourPL.x', 'ความเข้มข้นของสารมาตรฐาน', 'Standard concentration'],
  ['ws.roleHintFor.nlsFourPL.x', 'ความเข้มข้นที่รู้ค่า ใส่ 0 ได้ แถวที่เว้นว่างไว้แต่มีค่าที่วัดได้คือตัวอย่างที่จะอ่านค่าจากเส้นโค้ง', 'The known concentration, 0 allowed. Rows left blank that have a reading are the samples read off the curve.'],
  ['ws.roleFor.nlsFourPL.outcome', 'ค่าที่วัดได้ เช่นค่า OD', 'Reading, such as the OD'],
  ['ws.roleHintFor.nlsFourPL.outcome', 'ค่าที่เครื่องอ่านได้ ทั้งของสารมาตรฐานและของตัวอย่าง', 'What the reader gave, for the standards and for the samples'],
  ['ws.roleFor.nlsDoseResponse.x', 'ขนาดยาหรือความเข้มข้น', 'Dose or concentration'],
  ['ws.roleHintFor.nlsDoseResponse.x', 'ค่าจริง ไม่ใช่ค่า log ใส่ 0 ได้สำหรับหลุมที่ไม่ได้รับยา', 'The actual value, not its log; 0 is allowed for untreated wells'],
  ['ws.roleFor.nlsDoseResponse.outcome', 'การตอบสนอง', 'Response'],
  ['ws.roleHintFor.nlsDoseResponse.outcome', 'เช่นร้อยละการเจริญของเชื้อ หรือร้อยละการยับยั้ง', 'Such as percent growth or percent inhibition'],
  ['ws.roleFor.nlsDoseResponse.group', 'กลุ่มที่เทียบเส้นโค้ง (ถ้ามี)', 'Groups whose curves are compared (if any)'],
  ['ws.roleHintFor.nlsDoseResponse.group', 'แต่ละกลุ่มได้เส้นโค้งของตัวเอง เมื่อเลือกกลุ่ม ระบบจะทดสอบด้วยว่าเส้นต่างกันไหม', 'Each group gets its own curve; choosing groups also tests whether the curves differ'],
  ['ws.roleFor.nlsEquation.x', 'ค่าแกนนอน เช่นเวลาหรือความเข้มข้นของสารตั้งต้น', 'x, such as time or substrate concentration'],
  ['ws.roleHintFor.nlsEquation.x', 'Michaelis-Menten ใช้ความเข้มข้นที่ไม่ติดลบ decay และ growth ใช้เวลา', 'Michaelis-Menten takes concentrations of 0 or more; decay and growth take time'],
  ['ws.roleFor.nlsEquation.outcome', 'ค่าที่วัดได้', 'Measured value'],
  ['ws.roleHintFor.nlsEquation.outcome', 'เช่นอัตราการเกิดปฏิกิริยา หรือระดับยาในเลือด', 'Such as the reaction rate, or the drug level in blood'],
  ['ws.roleFor.calcAuc.outcome', 'ค่าที่วัดซ้ำ', 'Repeated measurement'],
  ['ws.roleHintFor.calcAuc.outcome', 'เช่นระดับกลูโคสในเลือดแต่ละครั้งที่วัด', 'Such as the blood glucose at each measurement'],
  ['ws.roleFor.calcAuc.subject', 'รหัสตัวสัตว์', 'Animal id'],
  ['ws.roleFor.calcAuc.time', 'เวลาที่วัด', 'Time of measurement'],
  ['ws.roleHintFor.calcAuc.time', 'เป็นตัวเลข เช่นนาทีหลังให้กลูโคส ข้อมูลต้องเป็นหนึ่งแถวต่อสัตว์ต่อเวลา (แบบยาว)', 'A number, such as minutes after the glucose dose. The data need one row per animal and time (long form).'],
  ['ws.roleFor.calcAuc.group', 'กลุ่มที่เทียบ (ถ้ามี)', 'Groups compared (if any)'],
  ['ws.roleFor.qpcrRelative.outcome', 'Ct ของยีนที่สนใจ', 'Ct of the gene of interest'],
  ['ws.roleHintFor.qpcrRelative.outcome', 'หนึ่งแถวต่อตัวอย่าง ถ้ามีหลุมซ้ำทางเทคนิค ให้เฉลี่ยก่อน', 'One row per sample; average the technical replicate wells first'],
  ['ws.roleFor.qpcrRelative.items', 'Ct ของยีนอ้างอิง', 'Ct of the reference genes'],
  ['ws.roleHintFor.qpcrRelative.items', 'เลือกได้หนึ่งยีนขึ้นไป ถ้าเลือกหลายยีน ระบบรวมด้วยค่าเฉลี่ยเรขาคณิต', 'One or more; several are combined by their geometric mean'],
  ['ws.roleFor.qpcrRelative.group', 'กลุ่ม', 'Groups'],
  ['ws.roleHintFor.qpcrRelative.group', 'แล้วเลือกกลุ่มเทียบ (calibrator) ซึ่งปกติคือกลุ่มควบคุม', 'Then choose the calibrator group, usually the control'],
  ['ws.levelFor.qpcrRelative.controlLevel', 'กลุ่มเทียบ (calibrator)', 'Calibrator group'],
  ['ws.roleFor.qpcrEfficiency.x', 'log10 ของปริมาณที่ใส่ (dilution series)', 'log10 of the input amount (dilution series)'],
  ['ws.roleHintFor.qpcrEfficiency.x', 'เช่น 0, -1, -2 สำหรับการเจือจางทีละ 10 เท่า', 'Such as 0, -1, -2 for tenfold dilutions'],
  ['ws.roleFor.qpcrEfficiency.outcome', 'Ct', 'Ct'],
  ['ws.roleHintFor.qpcrEfficiency.outcome', 'Ct ของแต่ละหลุมที่แต่ละความเจือจาง', 'The Ct of each well at each dilution'],
  ['ws.roleFor.mvPca.items', 'ค่าที่วัด (อย่างน้อย 2 ตัว)', 'Measures (at least 2)'],
  ['ws.roleHintFor.mvPca.items', 'ค่าตัวเลขที่วัดในสัตว์ตัวเดียวกัน แถวที่ขาดค่าใดค่าหนึ่งจะไม่ถูกใช้', 'Numbers measured on the same animals; a row missing any of them is left out'],
  ['ws.roleFor.mvPca.subject', 'ชื่อจุดบนกราฟ (ถ้ามี)', 'Point labels (if any)'],
  ['ws.roleHintFor.mvPca.subject', 'เช่นรหัสสัตว์', 'Such as the animal id'],
  ['ws.roleFor.mvPca.group', 'สีของจุดตามกลุ่ม (ถ้ามี)', 'Colour the points by group (if any)'],
  ['ws.roleHintFor.mvPca.group', 'ใช้ระบายสีบนกราฟเท่านั้น ตัวเลขไม่เปลี่ยน', 'Only colours the chart; the numbers do not change'],
  ['ws.roleFor.regNegbin.outcome', 'จำนวนที่นับได้', 'Count'],
  ['ws.roleHintFor.regNegbin.outcome', 'จำนวนที่นับได้ เช่นจำนวนไข่พยาธิต่อกรัมมูล หรือจำนวนวันที่ป่วย', 'A count, for example worm eggs per gram of faeces or days ill'],
  ['ws.roleFor.regNegbin.covariates', 'ตัวแปรอธิบาย', 'Explanatory variables'],
  ['ws.roleFor.regNegbin.time', 'เวลาที่ติดตาม (ถ้ามี)', 'Follow-up time (if any)'],
  ['ws.roleHintFor.regNegbin.time', 'เช่นจำนวนวันที่ติดตามแต่ละตัว ใช้เป็น offset ในสมการ', 'For example days each animal was followed; used as the offset in the model'],
  ['ws.roleFor.anovaRepeated.factorB', 'ปัจจัยที่สองที่วัดในตัวเดิม (ถ้ามี)', 'Second within-animal factor (if any)'],
  ['ws.roleHintFor.anovaRepeated.factorB', 'เช่นชั่วโมงหลังให้อาหารในแต่ละช่วงที่วัด ข้อมูลต้องมีหนึ่งแถวต่อสัตว์ต่อทุกคู่ของสองปัจจัย ถ้าปัจจัยนี้เป็นตัวเลข เช่น 1 ถึง 5 ให้ตั้งชนิดเป็นกลุ่มมีลำดับในหน้ารหัสตัวแปรก่อน', 'Such as the hour after feeding within each phase. The data need one row per animal for every pair of the two factors. If this factor is made of numbers, such as 1 to 5, set the column to Ordered categories in the Codebook first.'],

  ['ws.opt.model.label', 'รูปแบบเส้นโค้ง', 'Curve model'],
  ['ws.opt.model.4pl', '4PL (สมมาตร)', '4PL (symmetric)'],
  ['ws.opt.model.5pl', '5PL (ไม่สมมาตร)', '5PL (asymmetric)'],
  ['ws.opt.compare.label', 'เทียบเส้นโค้งของแต่ละกลุ่ม', 'Compare the groups’ curves'],
  ['ws.opt.compare.none', 'ไม่เทียบ', 'No comparison'],
  ['ws.opt.compare.ec50', 'EC50 เท่ากันไหม (shared EC50)', 'Same EC50? (shared EC50)'],
  ['ws.opt.compare.all', 'เป็นเส้นเดียวกันทั้งเส้นไหม', 'Same curve altogether?'],
  ['ws.opt.equation.label', 'สมการ', 'Equation'],
  ['ws.opt.equation.michaelisMenten', 'Michaelis-Menten (Vmax, Km)', 'Michaelis-Menten (Vmax, Km)'],
  ['ws.opt.equation.decay', 'ลดลงแบบ exponential (half-life)', 'One-phase decay (half-life)'],
  ['ws.opt.equation.growth', 'เพิ่มขึ้นแบบ exponential (doubling time)', 'Exponential growth (doubling time)'],
  ['ws.opt.baseline.label', 'พื้นที่ที่คิด', 'Area measured'],
  ['ws.opt.baseline.zero', 'พื้นที่ทั้งหมดเหนือศูนย์', 'Total area above zero'],
  ['ws.opt.baseline.first', 'พื้นที่เหนือค่าแรกของแต่ละตัว (ส่วนที่ต่ำกว่านับเป็นลบ)', 'Area above each animal’s first value (below counts as negative)'],
  ['ws.opt.method.livak', 'Livak (ทุกยีนเพิ่มเป็นสองเท่าต่อรอบ)', 'Livak (every gene doubles each cycle)'],
  ['ws.opt.method.pfaffl', 'Pfaffl (ใส่ประสิทธิภาพของแต่ละยีน)', 'Pfaffl (each gene’s own efficiency)'],
  ['ws.opt.test.welch', 'Welch t-test (ความแปรปรวนต่างกันได้)', 'Welch’s t-test (variances may differ)'],
  ['ws.opt.test.pooled', 'Student t-test (ใช้ความแปรปรวนรวม)', 'Student’s t-test (pooled variance)'],
  ['ws.opt.scale.true', 'correlation matrix (ปรับทุกค่าให้มีสเกลเท่ากัน)', 'Correlation matrix (every measure scaled)'],
  ['ws.opt.scale.false', 'covariance matrix (ใช้หน่วยเดิม)', 'Covariance matrix (original units)'],
  ['ws.optFor.qpcrRelative.method.label', 'วิธีคำนวณ ΔΔCt', 'ΔΔCt method'],
  ['ws.optFor.qpcrRelative.test.label', 'การทดสอบเมื่อมีสองกลุ่ม', 'Test for two groups'],
  ['ws.optFor.mvPca.scale.label', 'เมทริกซ์ที่ใช้', 'Matrix used'],
  ['ws.optFor.regLogistic.method.label', 'วิธีประมาณค่า', 'Estimation'],
  ['ws.opt.method.firth', 'Firth’s correction (penalised likelihood)', 'Firth’s correction (penalised likelihood)'],
  ['ws.opt.method.ml', 'maximum likelihood', 'Maximum likelihood'],
  ['ws.optHelp.nlsFourPL.model', '4PL ใช้ได้กับงานส่วนใหญ่ 5PL เพิ่มค่าความไม่สมมาตรสำหรับเส้นโค้งที่ไม่สมมาตร และผลจะเทียบกับ 4PL ให้ด้วย', 'The 4PL suits most assays. The 5PL adds an asymmetry value for a lopsided curve, and the result compares it with the 4PL.'],
  ['ws.optHelp.nlsDoseResponse.model', '4PL ใช้ได้กับงานส่วนใหญ่ 5PL เพิ่มค่าความไม่สมมาตรสำหรับเส้นโค้งที่ไม่สมมาตร', 'The 4PL suits most assays; the 5PL adds an asymmetry value for a lopsided curve.'],
  ['ws.optHelp.nlsDoseResponse.compare', 'ใช้ extra sum-of-squares F test พร้อม AICc ต้องมีอย่างน้อยสองกลุ่ม เมื่อเลือกกลุ่ม ระบบตั้งเป็น EC50 เท่ากันไหม ให้ก่อน เปลี่ยนได้', 'Uses the extra sum-of-squares F test with AICc and needs two or more groups. Choosing groups sets it to the shared EC50; you can change it.'],
  ['ws.optHelp.nlsEquation.equation', 'เลือกจากสิ่งที่รู้เกี่ยวกับกระบวนการก่อนดูข้อมูล', 'Choose from what you know about the process before looking at the data.'],
  ['ws.optHelp.calcAuc.baseline', 'แบบทั้งหมดรวมระดับเริ่มต้นของแต่ละตัวด้วย แบบเหนือค่าแรกดูเฉพาะการเปลี่ยนจากค่าแรก', 'Total includes each animal’s starting level; above the first value looks only at the change from the start.'],
  ['ws.optHelp.qpcrRelative.method', 'Livak ถือว่าทุกยีนมีประสิทธิภาพ 2 (100%) ใช้ Pfaffl เมื่อรู้ประสิทธิภาพของทุกยีนจาก dilution series', 'Livak takes every efficiency as 2 (100%). Use Pfaffl when every gene’s efficiency is known from a dilution series.'],
  ['ws.optHelp.qpcrRelative.test', 'ใช้เมื่อมีสองกลุ่ม ทดสอบบน ΔCt ถ้ามีสามกลุ่มขึ้นไป ใช้ one-way ANOVA และ Dunnett เทียบกับกลุ่มเทียบเสมอ', 'For two groups, tested on ΔCt. Three or more groups always use one-way ANOVA with Dunnett against the calibrator.'],
  ['ws.optHelp.mvPca.scale', 'ใช้ correlation เมื่อค่าที่วัดมีหน่วยหรือขนาดต่างกัน ไม่อย่างนั้นค่าที่ตัวเลขใหญ่จะครอบงำผล', 'Use the correlation matrix when the measures differ in unit or size; otherwise the large numbers dominate.'],
  ['ws.optHelp.regNegbin.ciMethod', 'profile likelihood (ถือ theta คงที่ตามค่าที่ประมาณได้) เหมาะเมื่อจำนวนนับน้อย Wald คำนวณง่ายกว่า', 'Profile likelihood (theta held at its estimate) suits small counts; Wald is simpler.'],

  ['ws.qpcr.effTitle', 'ประสิทธิภาพของแต่ละยีน (Pfaffl)', 'Each gene’s efficiency (Pfaffl)'],
  ['ws.qpcr.effLabel', 'ประสิทธิภาพ: {gene}', 'Efficiency: {gene}'],
  ['ws.qpcr.effHint', 'ใส่เป็นจำนวนเท่าต่อรอบ (1.5 ถึง 2.5 เช่น 1.95) หรือเป็นร้อยละ (50 ถึง 150 เช่น 95)', 'As the amplification factor (1.5 to 2.5, such as 1.95) or as a percent (50 to 150, such as 95)'],
  ['ws.qpcr.effReadAs', 'ใช้ค่า {factor} ({percent}%)', 'Used as {factor} ({percent}%)'],
  ['ws.qpcr.effMissing', 'ใส่ประสิทธิภาพของยีนนี้ วิธี Pfaffl ต้องรู้ทุกยีน', 'Enter this gene’s efficiency; Pfaffl needs every gene’s'],
  ['ws.qpcr.effNotNumber', 'ใส่เป็นตัวเลข เช่น 1.95 หรือ 95', 'Type a number, such as 1.95 or 95'],
  ['ws.qpcr.effRange', 'อยู่นอกช่วงที่ใช้ได้: จำนวนเท่าต่อรอบต้องอยู่ระหว่าง 1.5 ถึง 2.5 (ร้อยละ 50 ถึง 150)', 'Outside the usable range: the amplification factor must be 1.5 to 2.5 (50 to 150%)'],
  ['ws.qpcr.effStill', 'ประสิทธิภาพของ {genes}', 'efficiency of {genes}'],

  ['ws.firth.switch', 'ใช้ Firth’s correction', 'Use Firth’s correction'],
  ['ws.firth.switchHint', 'สำหรับผลลัพธ์ที่แยกกันเด็ดขาด (separation) ระบบไม่เปิดให้เอง CI คิดแบบ profile penalised likelihood หรือ Wald ตามตัวเลือกวิธีคำนวณ CI', 'For an outcome that is split completely (separation). It is never switched on for you. Intervals use profile penalised likelihood, or Wald, as the CI method option says.'],
  ['ws.firth.stopTitle', 'สมการแบบปกติให้ตัวเลขไม่ได้ เพราะเกิด separation', 'The usual model gives no numbers here: separation'],
  ['ws.firth.stopBody', 'ผลลัพธ์แยกกันเด็ดขาดด้วยตัวแปรหนึ่งตัวหรือหลายตัวรวมกัน คือสัตว์ทุกตัวในระดับ ช่วงค่า หรือชุดค่าชุดหนึ่งมีผลลัพธ์เหมือนกันหมด ทางเลือกคือรวมระดับที่มีสัตว์น้อยเข้ากับระดับข้างเคียง เอาตัวแปรออกจากสมการ หรือคำนวณใหม่ด้วย Firth’s correction ซึ่งให้ค่าประมาณมีขอบเขต เลือกเองว่าจะใช้ทางไหน ผลที่ได้จะบอกว่าใช้ Firth’s correction', 'The outcome is split completely by one variable or a combination of them: every animal in a level, a range of values or a combination has the same outcome. You can merge a level with few animals into its neighbour, leave a variable out, or compute again with Firth’s correction, which keeps the estimates finite. The choice is yours; the result says when Firth’s correction was used.'],
  ['ws.firth.run', 'คำนวณใหม่ด้วย Firth’s correction', 'Compute again with Firth’s correction'],
  // chart titles of the M3a kinds the chart kit draws (M3-DESIGN.md 5; chart-inputs.js titles a kit chart ws.chart.title.<kind>)
  ['ws.chart.title.doseResponse', 'เส้น dose-response และแถบ 95% CI', 'Dose-response curves with their 95% CI bands'],
  ['ws.chart.title.standardCurve', 'standard curve และตัวอย่างที่อ่านค่าจากเส้น', 'Standard curve and the samples read off it'],
  ['ws.chart.title.scree', 'eigenvalue ของแต่ละ component (scree plot)', 'Eigenvalue of each component (scree plot)'],
  ['ws.chart.title.biplot', 'biplot ของสอง component แรก', 'Biplot of the first two components'],
  ['ws.chart.title.qpcrFold', 'fold change ของแต่ละตัวอย่าง (สเกล log2)', 'Fold change of each sample (log2 scale)'],
  ['ws.test.interaction3', 'ผลร่วมของ {a}, {b} และ {c} (interaction)', '{a} by {b} by {c} (interaction)'],
];

const th = {};
const en = {};
for (const [k, a, b] of ROWS) {
  th[k] = a;
  en[k] = b;
}

export default { th, en };
