// ============================================================
// COM I — Companion Animal Clinical Sciences I (Y4 Sem 1)
// ============================================================
//
// AUTO-MERGED from tmp/y4-patches/com1.json via
// scripts/apply-y4-patches.mjs.
// Built: 2026-05-17
//
// Subject slug: com1
// ID range: 90000–90030 (31 Qs)
// Topics: acute-chf-collapse, aki-stages, anemia-regen-vs-non, aspiration-pneumonia, blood-transfusion, bone-marrow-biopsy, brachycephalic-syndrome, cardiogenic-shock, ckd-complications, ckd-iris, ckd-proteinuria-rx, dcm-management, echocardiography, ectopic-ureter, ekg-arrhythmia, feline-asthma, feline-flutd, feline-hypertension, hcm-feline, laryngeal-paralysis, left-sided-heart-failure, mitral-valve-disease, prerenal-azotemia, pulmonary-thromboembolism, respiratory-pattern, splenectomy-indication, tetralogy-of-fallot, tracheal-collapse, urethral-obstruction, urolith-types, vsd-tricuspid
// Flagged: 2 (see flag:"minor"|"unclear" — verify before locking)
//
// Sources: Y4 Sem 1 past-paper PDFs (Vet 86 study folder).
// Each Q cross-checked against ≥2 sources per extraction-agent brief.
// Academic-safety vocab sanitized across q/options/explain/verified/
// examOrigin/source per Palm rule (lint:academic-safety gates commits).
// ============================================================

export const QB_COM1 = [
  {
    "id": 90000,
    "subject": "com1",
    "topic": "left-sided-heart-failure",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "CHF",
      "pulmonary-edema",
      "cat-pleural-effusion"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "ภาวะ Left-sided HF (CHF) ในสุนัข/แมว มักทำให้เกิดข้อใดเป็นหลัก",
    "options": [
      "Peripheral edema + ascites (volume overload backward เข้า systemic venous)",
      "Pulmonary edema / pulmonary venous congestion (แมวอาจมี pleural effusion ร่วมด้วย)",
      "Jugular venous distention + hepatomegaly (backward right-sided sign)",
      "Hindlimb paralysis แบบ ATE (peripheral arterial event)",
      "Splenomegaly + portal hypertension"
    ],
    "answer": 1,
    "explain": "Left-sided CHF = LA pressure ↑ → pulmonary venous congestion → pulmonary edema (dyspnea, short rapid breathing) ในแมวมัก present เป็น pleural effusion ได้บ่อยกว่าหมา (มี mechanism modified transudate)\n\n✗ a/c = Right-sided HF (ascites, hepatomegaly, jugular distention)\n✗ d = Aortic thromboembolism (FATE) จาก HCM\n✗ e = ไม่ใช่ feature หลักของ left CHF\n\n💡 หมา DMVD = left-sided failure pattern ที่พบบ่อยที่สุด → cardiogenic pulmonary edema",
    "verified": "Modified Com1 final TJ (Cardio Q3) + COM I Final 86 cross-checked, lecturer สิริลักษณ์"
  },
  {
    "id": 90001,
    "subject": "com1",
    "topic": "mitral-valve-disease",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "dmvd",
      "murmur",
      "small-breed"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "หมาพุดเดิ้ลอายุ 16 ปี ตรวจพบ systolic murmur 3/6 ที่ left apex โรคที่น่าสงสัยมากที่สุดคือ",
    "options": [
      "Mitral regurgitation / Degenerative Mitral Valve Disease (DMVD)",
      "Tricuspid regurgitation / VSD",
      "Pulmonic stenosis (congenital)",
      "Aortic stenosis (subaortic)",
      "Patent ductus arteriosus (PDA, continuous machinery murmur)"
    ],
    "answer": 0,
    "explain": "DMVD (degenerative mitral valve disease / endocardiosis) = #1 acquired heart disease ในหมา toy/small breed สูงอายุ (poodle, chihuahua, dachshund, cavalier KCS) → systolic murmur PMI ที่ left apex (mitral area) เกิดจาก mitral regurgitation\n\n✗ Tricuspid = right apex (3-5 ICS ขวา)\n✗ Pulmonic/aortic stenosis = left base (heart base)\n✗ PDA = continuous murmur ไม่ใช่ systolic เดี่ยวๆ\n\n💡 PMI mitral = left apex 5th ICS ใกล้ costochondral junction",
    "verified": "Modified Com1 final TJ (Cardio Q4) + COM I Final 86 + ภ.สมาน notes (Wallace 5th ICS PMI)"
  },
  {
    "id": 90002,
    "subject": "com1",
    "topic": "vsd-tricuspid",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "vsd",
      "right-sided-murmur",
      "congenital"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "แมวอายุ 1 ปี มี systolic murmur 3/6 PMI ที่ด้านขวา โรคที่น่าสงสัยมากที่สุดคือ",
    "options": [
      "Mitral regurgitation (DMVD)",
      "Tricuspid regurgitation / Ventricular Septal Defect (VSD)",
      "Patent ductus arteriosus",
      "Pulmonic stenosis",
      "Hypertrophic cardiomyopathy"
    ],
    "answer": 1,
    "explain": "VSD = congenital defect ที่พบบ่อยในแมว → murmur PMI ที่ right hemithorax (5th ICS) เนื่องจาก shunt jet เข้า RV ส่วน tricuspid regurgitation ก็ฟัง murmur right apex (4 ICS ขวา) ได้เช่นกัน\n\n✗ Mitral = left apex\n✗ PDA = left base, continuous\n✗ Pulmonic stenosis = left base 3rd ICS\n✗ HCM = แมวมัก auscultate gallop หรือ murmur แต่ HCM เป็น primary myocardial dz ไม่ใช่ structural defect ที่ฟังเฉพาะ right thorax\n\n💡 แมว 1 ปี + murmur ขวา = ต้องนึกถึง congenital shunt ก่อน",
    "verified": "Modified Com1 final TJ (Cardio Q5) + COM I Final 86"
  },
  {
    "id": 90003,
    "subject": "com1",
    "topic": "dcm-management",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "dcm",
      "pimobendan",
      "inotrope"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "หมาที่ Dx เป็น Dilated cardiomyopathy (DCM) ยา first-line สำหรับเพิ่ม contractility คือข้อใด",
    "options": [
      "Pimobendan (inodilator: PDE3 inhibitor + Ca-sensitizer)",
      "Atenolol (β1-blocker)",
      "Diltiazem (Ca-channel blocker)",
      "Carvedilol (β-blocker)",
      "Digoxin เดี่ยวๆ"
    ],
    "answer": 0,
    "explain": "DCM = primary systolic dysfunction → ต้องการ positive inotrope ที่ไม่เพิ่ม afterload\n\n✓ Pimobendan = inodilator (เพิ่ม contractility + ลด afterload) → first-line ใน DCM และ stage C/D CHF เป็น mainstay\n✓ ใช้ร่วม Furosemide + ACEi (Benazepril/Enalapril) ± Spironolactone\n\n✗ β-blocker = negative inotrope, contraindicated ใน decompensated DCM\n✗ Ca-channel blocker = negative inotrope\n✗ Digoxin เดี่ยวๆ = inotrope อ่อน + narrow therapeutic, ปัจจุบันใช้รองจาก pimobendan\n\n💡 Predisposing breed (Dobermann, Boxer, Great Dane) + ขาด taurine/L-carnitine = supportive history",
    "verified": "Modified Com1 final TJ (Cardio Q6, Q12) + COM I Final 86"
  },
  {
    "id": 90004,
    "subject": "com1",
    "topic": "acute-chf-collapse",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "pulmonary-edema",
      "furosemide",
      "emergency"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "หมาภาวะหัวใจล้มเหลวเฉียบพลัน นอนเอนหัวเหยียดคอหายใจลำบาก ยาตัวแรกที่ควรให้คือ",
    "options": [
      "Furosemide IV (loop diuretic) — ลด preload โดยด่วน",
      "Pimobendan PO เดี่ยวๆ",
      "Enalapril PO",
      "Atenolol PO",
      "Spironolactone PO"
    ],
    "answer": 0,
    "explain": "Acute decompensated CHF / fulminant pulmonary edema = emergency → Furosemide IV (2-4 mg/kg bolus หรือ CRI 0.6-1 mg/kg/hr) เป็น first move เพื่อ off-load fluid + ลด preload + ปอดโล่ง\n\n✓ ร่วมกับ O2 supplementation, cage rest, ± nitroglycerin paste, ± dobutamine ถ้า cardiogenic shock\n✓ Pimobendan IV/PO ตามได้ใน DMVD-CHF\n\n✗ PO drugs = onset ช้า ไม่ใช่ first move ใน emergency\n✗ ACEi/β-blocker = ใช้ chronic management ไม่ใช่ acute rescue\n\n💡 ระวัง overdiurese → pre-renal azotemia, electrolyte derangement",
    "verified": "Modified Com1 final TJ (Cardio Q7) + COM I Final 86, lecturer สิริลักษณ์"
  },
  {
    "id": 90005,
    "subject": "com1",
    "topic": "hcm-feline",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "hcm",
      "ate-prevention",
      "clopidogrel"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "แมว HCM ไม่มีอาการ clinical signs แต่ตรวจ echo พบ LA enlargement ยาที่ควรเริ่มเพื่อ prevent thromboembolism คือ",
    "options": [
      "Furosemide PO",
      "Pimobendan PO",
      "Clopidogrel (antiplatelet)",
      "Atenolol (β-blocker)",
      "ACEi (Benazepril)"
    ],
    "answer": 2,
    "explain": "Feline HCM + LA enlargement = high ATE (aortic thromboembolism) risk → preventive antiplatelet = Clopidogrel (Plavix) 18.75 mg/cat PO SID (FATCAT trial supports clopidogrel > aspirin)\n\n✓ ใช้แม้ยังไม่มี CHF\n✓ ถ้ามี CHF → add furosemide; ถ้า ATE acute → opioid + management hyperkalemia\n\n✗ Furosemide/pimobendan = สำหรับ CHF management ไม่ใช่ ATE prevention\n✗ Atenolol = ลด HR/outflow obstruction ใน HOCM แต่ไม่ป้องกัน clot\n\n💡 Virchow's triad ใน HCM = stasis (LA enlarge) + endothelial injury + hypercoagulability",
    "verified": "Modified Com1 final TJ (Cardio Q8, Q27, Q29) + COM I Final 86"
  },
  {
    "id": 90006,
    "subject": "com1",
    "topic": "feline-hypertension",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "amlodipine",
      "systemic-hypertension",
      "cat"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "ยา first-line ลดความดันโลหิตสูง (systemic hypertension) ในแมว คือข้อใด",
    "options": [
      "Enalapril (ACEi)",
      "Benazepril (ACEi)",
      "Amlodipine (dihydropyridine Ca-channel blocker)",
      "Atenolol (β-blocker)",
      "Spironolactone"
    ],
    "answer": 2,
    "explain": "Feline systemic hypertension first-line = Amlodipine 0.625-1.25 mg/cat PO SID (efficacy เด่นกว่า ACEi ในแมว, response 24-48 hr)\n\n✓ Target BP < 160 mmHg systolic, monitor TOD (target organ damage = eye/kidney/brain/heart)\n✓ ถ้า BP ไม่ลง → add ACEi/ARB (telmisartan)\n\n✗ ACEi ในหมา/แมวเป็น first-line สำหรับ proteinuric CKD แต่ไม่ใช่ first-line สำหรับ pure hypertension control โดยเฉพาะแมว\n✗ β-blocker = ไม่นิยมเดี่ยวๆ ในแมว\n\n💡 Underlying cause แมว = CKD > hyperthyroidism; หมา = CKD > Cushing > DM",
    "verified": "Modified Com1 final TJ (Cardio Q14, Q28) + COM I Final 86"
  },
  {
    "id": 90007,
    "subject": "com1",
    "topic": "tetralogy-of-fallot",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "tof",
      "congenital",
      "cyanosis"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "ข้อใดไม่ใช่องค์ประกอบของ Tetralogy of Fallot (TOF)",
    "options": [
      "Pulmonic stenosis (RVOT obstruction)",
      "Right ventricular hypertrophy",
      "Ventricular septal defect (large VSD)",
      "Overriding aorta",
      "Left ventricular hypertrophy (LVH)"
    ],
    "answer": 4,
    "explain": "TOF 4 องค์ประกอบ = (1) Pulmonic stenosis (RVOT obstruction) (2) RV hypertrophy (3) VSD large (4) Overriding aorta → right-to-left shunt → central cyanosis + hypoxemia\n\n✗ LVH = ไม่ใช่ส่วนหนึ่ง — TOF เป็น right-heart pattern\n\n✓ Clinical: cyanosis ตั้งแต่เกิด, exercise intolerance, polycythemia, syncope\n✓ Dx: echo (เห็น 4 features), CBC = PCV สูง, x-ray = boot-shaped heart\n\n💡 TOF = R→L shunt + cyanosis ตั้งแต่กำเนิด แตกต่างจาก PDA L→R (acyanotic) ที่อาจ reverse เป็น Eisenmenger ทีหลัง",
    "verified": "Modified Com1 final TJ (Cardio Q25, Q36) + COM I Final 86 Q23"
  },
  {
    "id": 90008,
    "subject": "com1",
    "topic": "ekg-arrhythmia",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "hyperkalemia",
      "p-wave",
      "atrial-standstill"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "ภาวะ Hyperkalemia รุนแรง (เช่นจาก Addison's หรือ urethral obstruction) จะทำให้ EKG เปลี่ยนแปลงอย่างไรเป็นลักษณะเด่น",
    "options": [
      "Tall spiked T wave + No P wave (atrial standstill) + wide QRS",
      "Wide P wave (P mitrale) เด่นชัด",
      "Prolonged QT interval",
      "ST elevation pattern",
      "Tall R wave ใน lead II (LVH pattern)"
    ],
    "answer": 0,
    "explain": "Hyperkalemia progressive EKG changes (K classic ladder):\n• K 5.5-6.5 → tall peaked T wave\n• K 6.5-7.5 → P wave flatten, PR ยาวขึ้น\n• K > 7.5 → P wave หายไป (atrial standstill, sinoventricular rhythm)\n• K > 8 → QRS กว้าง, merge กับ T → sine wave → cardiac arrest\n\n✓ Tx: Calcium gluconate 10% (membrane stabilize), regular insulin + dextrose, NaHCO3 (acidosis), unblock urethra\n\n✗ P mitrale = LA enlargement (DMVD)\n✗ Long QT = hypocalcemia/hypomagnesemia\n\n💡 แมว blocked + hindlimb weak + bradycardia = ต้องสงสัย hyperkalemia เป็น first move",
    "verified": "Modified Com1 final TJ (Cardio Q37-38) + COM I Final 86 + ภ.วิชชาญ EKG lecture"
  },
  {
    "id": 90009,
    "subject": "com1",
    "topic": "cardiogenic-shock",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "dobutamine",
      "inotrope",
      "shock"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "ภาวะ Cardiogenic shock + hypotension ที่ poor perfusion ยา positive inotrope ที่นิยมให้ rescue คือข้อใด",
    "options": [
      "Furosemide IV bolus",
      "Dobutamine CRI (β1 agonist — เพิ่ม contractility)",
      "Atropine IV",
      "Norepinephrine CRI",
      "Nitroglycerin paste"
    ],
    "answer": 1,
    "explain": "Cardiogenic shock = forward failure → ต้องการ inotrope + cautious fluid\n\n✓ Dobutamine CRI 2-10 mcg/kg/min = β1 selective → เพิ่ม contractility โดยไม่เพิ่ม HR/SVR มาก เหมาะกับ DCM/severe MMVD ที่มี cardiogenic hypotension\n✓ ใช้ร่วม furosemide ถ้า pulmonary edema, oxygen support\n\n✗ Norepinephrine = vasopressor แต่ไม่ใช่ first-line cardiogenic shock (vasoconstriction อาจเพิ่ม afterload ภาระหัวใจ)\n✗ Atropine = bradycardia rescue ไม่ใช่ inotrope\n\n💡 Pimobendan IV (ถ้ามี) ก็เป็น option, แต่ practical ใน RA = dobutamine",
    "verified": "Modified Com1 final TJ (Cardio Q20) + COM I Final 86 Q18"
  },
  {
    "id": 90010,
    "subject": "com1",
    "topic": "echocardiography",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "echo",
      "diagnostic-cardio"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "Echocardiography (echo) เหนือกว่า x-ray ตรงข้อใด",
    "options": [
      "ดู chamber sizes, wall/septal thickness, valve structure + function, cardiac motion",
      "ประเมิน lung field และ pulmonary parenchyma ได้ดีกว่า",
      "ตรวจ pleural effusion volume แม่นยำกว่า thoracocentesis",
      "ใช้ screen pulmonary metastasis ได้ดีกว่า",
      "ทดแทน EKG ในการ classify arrhythmia"
    ],
    "answer": 0,
    "explain": "Echo = ultrasound หัวใจ → ประเมิน structural + functional ได้ตรง (chamber size, wall thickness, valve motion, contractility/EF, flow direction กับ Doppler)\n\n✓ ใช้ confirm diagnosis: HCM (LV wall thick > 6 mm cat), DCM (LV dilation + reduced FS), DMVD (regurgitant jet), congenital (TOF, PDA, VSD)\n\n✗ Lung/pleural assessment = x-ray + thoracic ultrasound (TFAST) แม่นกว่า\n✗ EKG = ดู rhythm/conduction, echo ดูไม่ได้\n\n💡 Echo = tentative-to-definitive Dx tool สำหรับ cardiac structure; x-ray = ดู cardiomegaly + secondary findings (pulm edema, vessel enlargement)",
    "verified": "Modified Com1 final TJ (Cardio Q21) + COM I Final 86"
  },
  {
    "id": 90011,
    "subject": "com1",
    "topic": "respiratory-pattern",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "obstructive",
      "tracheal-collapse",
      "breathing-pattern"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "สุนัขมีอาการ extrathoracic tracheal lesion (collapse) clinical signs ที่เด่นที่สุดน่าจะเป็น breathing pattern แบบใด",
    "options": [
      "Inspiratory dyspnea (obstructive pattern จาก extrathoracic airway)",
      "Expiratory dyspnea (obstructive pattern จาก intrathoracic airway)",
      "Restrictive pattern (rapid shallow)",
      "Paradoxical breathing (flail chest)",
      "Normal eupnea"
    ],
    "answer": 0,
    "explain": "Localization rule (Ettinger):\n• Extrathoracic upper airway (nose/larynx/cervical trachea) → INSPIRATORY effort เด่น (intraluminal pressure ลบช่วง inspire → collapse เพิ่ม)\n• Intrathoracic airway (intrathoracic trachea/bronchi) → EXPIRATORY effort (positive pleural pressure ช่วง expire → ดัน airway collapse)\n• Tracheal collapse classic ตำแหน่ง cervical = inspiratory, thoracic inlet = mixed, intrathoracic = expiratory\n\n💡 หมา toy breed (Pomeranian, Yorkie, Poodle) + goose-honk cough + inspiratory stridor = tracheal collapse cervical\n\n⚠ Note: Q จาก COM 86 #59 ระบุ abdominal push + obstructive pattern → fit obstructive (Hand off exam grade dyspnea)",
    "verified": "Modified Com1 final TJ (Resp Q9 + breathing pattern flowchart) + COM I Final 86 Q59, lecturer ณัฐวรรณ. Note: original question source pdf ระบุ Expiratory ใน TJ key — flag: 'extrathoracic→inspiratory เป็นหลัก แต่ stem 86 มี abdominal push (expiratory effort) อาจ imply intrathoracic หรือ mixed' ดู verified field",
    "flag": {
      "severity": "minor",
      "note": "TJ key marks Expiratory dyspnea; classic teaching = extrathoracic→inspiratory; stem hints at obstructive overall. Answer set to inspiratory per breathing-pattern flowchart standard."
    }
  },
  {
    "id": 90012,
    "subject": "com1",
    "topic": "aspiration-pneumonia",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "aspiration",
      "X-ray",
      "lung-lobes"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "Aspiration pneumonia ในสุนัข lung lobe ที่พบรอยโรค (alveolar infiltrate) บ่อยที่สุดคือข้อใด",
    "options": [
      "Right caudal lobe",
      "Right middle lobe (และ cranial lobes — ขึ้นกับ recumbency)",
      "Left caudal lobe",
      "Accessory lobe เด่นเดี่ยว",
      "ทุก lobe เท่ากันโดยไม่มี predilection"
    ],
    "answer": 1,
    "explain": "Aspiration pneumonia anatomy: right middle + right cranial + left cranial lobes = gravity-dependent ในท่า sternal/standing → secretion ไหลเข้า bronchi ของ lobes เหล่านี้ก่อน\n\n✓ X-ray finding = focal alveolar pattern (air bronchogram) ที่ cranioventral lung field\n✓ Cause: laryngeal paralysis, megaesophagus, regurgitation/vomiting, anesthesia\n✓ Tx: O2, broad-spectrum antibiotic (Amox-clav, fluoroquinolone), nebulization + coupage, supportive\n\n💡 หากสัตว์ recumbent เปลี่ยนข้าง → lobe ที่เป็นเปลี่ยนตามท่า, มัก bilateral cranioventral",
    "verified": "Modified Com1 final TJ (Resp Q60) + COM I Final 86 Q60"
  },
  {
    "id": 90013,
    "subject": "com1",
    "topic": "pulmonary-thromboembolism",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "pte",
      "ctpa",
      "D-dimer"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "Gold-standard imaging modality สำหรับวินิจฉัย Pulmonary Thromboembolism (PTE) คือข้อใด",
    "options": [
      "Plain thoracic radiograph",
      "Echocardiography",
      "CT Pulmonary Angiography (CTPA)",
      "Pulmonary function test",
      "Ventilation-perfusion scan แบบ planar 2D"
    ],
    "answer": 2,
    "explain": "CT Pulmonary Angiography (CTPA) = current gold-standard ใน vet/human → เห็น filling defect ใน pulmonary artery branches ตรงๆ\n\n✓ D-dimer = screen sensitivity สูงแต่ specificity ต่ำ → ใช้ rule-out\n✓ Thoracic radiograph มัก unremarkable หรือมี hyperlucent region, pleural effusion\n✓ Echo อาจเห็น right heart strain (RV dilation, pulmonary hypertension)\n\n✗ V/Q scan ใช้ใน human เป็น alternative, ในสัตว์ไม่ practical\n\n💡 Underlying causes: IMHA, PLN, hyperadrenocorticism, neoplasia, heartworm, sepsis, recent surgery (Virchow's triad)",
    "verified": "Modified Com1 final TJ (Resp Q61) + COM I Final 86 Q61"
  },
  {
    "id": 90014,
    "subject": "com1",
    "topic": "feline-asthma",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "feline-asthma",
      "bronchodilator",
      "emergency"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "แมวเข้ามาที่คลินิกด้วยอาการ feline asthma (acute distress) หายใจลำบาก expiratory effort เด่น สิ่งที่ควรทำเป็น initial management คือ",
    "options": [
      "Thoracocentesis ก่อนทันที (สงสัย pleural effusion)",
      "Provide O2 supplementation + minimize stress + bronchodilator (terbutaline/albuterol) + injectable glucocorticoid",
      "Furosemide IV (สงสัย CHF)",
      "Antibiotic broad-spectrum เดี่ยวๆ",
      "Intubation + general anesthesia เพื่อ bronchoscopy ทันที"
    ],
    "answer": 1,
    "explain": "Feline asthma acute crisis emergency triad:\n1. O2 supplementation + กรงเงียบลด stress (handling น้อยที่สุด)\n2. Bronchodilator: terbutaline 0.01 mg/kg IM/SC, หรือ albuterol MDI 1-2 puff q15min × 3-4 ครั้ง\n3. Injectable glucocorticoid: dexamethasone 0.25-0.5 mg/kg IV/IM\n\n✓ X-ray ทำหลัง stable → bronchial pattern (donut/tramline) + hyperinflation/flattened diaphragm\n\n✗ Thoracocentesis ทันทีไม่จำเป็น (asthma = air-trapping ในปอด ไม่ใช่ pleural fluid)\n✗ Furosemide = ใช้กับ CHF, feline asthma ปอดบวมแบบ inflammation ไม่ใช่ cardiogenic\n✗ Antibiotic ไม่ใช่ first-line (allergic/inflammatory)\n\n💡 Long-term: avoid allergens, environment management, inhaled fluticasone via spacer",
    "verified": "Modified Com1 final TJ (Resp Q64) + COM I Final 86 Q64"
  },
  {
    "id": 90015,
    "subject": "com1",
    "topic": "laryngeal-paralysis",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "laryngeal-paralysis",
      "golden-retriever",
      "laryngoscopy"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "วิธีวินิจฉัย laryngeal paralysis ในสุนัขโกลเด้น (golden retriever) ที่เป็น gold-standard คือ",
    "options": [
      "Cervical radiograph",
      "Ultrasound คอ",
      "Laryngoscopy ใต้ light sedation",
      "Bronchoscopy",
      "CT cervical region"
    ],
    "answer": 2,
    "explain": "Laryngeal paralysis Dx = Laryngoscopy ใต้ light plane sedation (propofol titrate ให้ jaw tone ยังพอมี) → ดู arytenoid abduction ตอน inspiration\n\n✓ Normal: arytenoid abduct ออกตอน inspire\n✓ Paralysis: arytenoid ไม่ขยับ หรือ paradoxical movement (เคลื่อนเข้าตอน inspire)\n✓ Doxapram 1 mg/kg IV ช่วยเพิ่ม respiratory drive ในการประเมิน\n\n✗ Imaging อื่นๆ = supportive ไม่ใช่ definitive\n\n💡 Predispose: golden retriever, labrador, Newfoundland, GOLPP (geriatric onset laryngeal paralysis polyneuropathy)\n💡 Tx severe: unilateral arytenoid lateralization (tie-back)",
    "verified": "Modified Com1 final TJ (Resp Q3, Q65) + COM I Final 86 Q65"
  },
  {
    "id": 90016,
    "subject": "com1",
    "topic": "tracheal-collapse",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "tracheal-collapse",
      "goose-honk",
      "toy-breed"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "สายพันธุ์ที่ predispose ต่อ tracheal collapse มากที่สุดคือกลุ่มใด",
    "options": [
      "Large breed deep-chested (Great Dane, Doberman)",
      "Brachycephalic (Bulldog, Pug, Persian cat)",
      "Toy breed (Pomeranian, Yorkshire terrier, Poodle, Chihuahua)",
      "Sporting breed (Labrador, Golden)",
      "Herding breed (Border collie, Australian shepherd)"
    ],
    "answer": 2,
    "explain": "Tracheal collapse = degenerative weakening ของ tracheal cartilage rings → C-ring แบนลง + dorsal membrane หย่อน → airway collapse dynamic\n\n✓ Classic signalment: middle-aged to senior toy breed → Pomeranian (most common), Yorkshire terrier, Poodle, Chihuahua\n✓ Sign: goose-honk cough, exercise intolerance, cyanosis episode\n✓ Dx: x-ray inspiratory (cervical collapse) + expiratory (thoracic collapse), fluoroscopy, bronchoscopy grading 1-4\n\n✗ Brachycephalic = BOAS (stenotic nares, elongated soft palate, everted laryngeal saccules, laryngeal collapse) — โรคคนละกลุ่ม\n\n💡 Tx: medical (cough suppressant + bronchodilator + steroid) → severe = intraluminal stent หรือ extraluminal ring prosthesis",
    "verified": "Modified Com1 final TJ (Surgery Resp Q9) + COM I Final 86 Q26"
  },
  {
    "id": 90017,
    "subject": "com1",
    "topic": "brachycephalic-syndrome",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "boas",
      "stenotic-nares",
      "soft-palate"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "องค์ประกอบของ Brachycephalic Airway Syndrome (BOAS) ข้อใด ไม่ใช่",
    "options": [
      "Stenotic nares (รูจมูกตีบ)",
      "Elongated soft palate",
      "Everted laryngeal saccules",
      "Laryngeal collapse (advanced stage)",
      "Tracheal collapse (toy breed pattern)"
    ],
    "answer": 4,
    "explain": "BOAS classic 4 components (primary + secondary):\n1. Stenotic nares (primary)\n2. Elongated soft palate (primary)\n3. Hypoplastic trachea (primary, breed-specific)\n4. Everted laryngeal saccules (secondary)\n5. Laryngeal collapse stage 1-3 (secondary, end-stage)\n\n✗ Tracheal collapse แบบ toy breed (cervical/thoracic trachea ยุบ) = คนละกลุ่มโรค (degenerative cartilage), ถึงแม้ Bulldog/Pug มี hypoplastic trachea ก็ตาม\n\n💡 Breed: English/French Bulldog, Pug, Boston terrier, Pekingese, Persian/Himalayan cat\n💡 Sx: alar wing amputation (Trader/wedge), staphylectomy (soft palate trim), ventriculectomy (saccule)",
    "verified": "Modified Com1 final TJ (Surgery Resp Q7) + COM I Final 86 Q25"
  },
  {
    "id": 90018,
    "subject": "com1",
    "topic": "anemia-regen-vs-non",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "reticulocyte",
      "regen-anemia",
      "hemolymphatic"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "การประเมินว่า anemia เป็น regenerative หรือ non-regenerative ใช้ parameter ตัวใดเป็นหลัก",
    "options": [
      "MCV และ MCHC (RBC indices)",
      "Absolute reticulocyte count (และ corrected reticulocyte %)",
      "Total bilirubin",
      "Serum iron / TIBC",
      "Coomb's test"
    ],
    "answer": 1,
    "explain": "Regenerative status assessment = absolute reticulocyte count\n• หมา: > 60,000/μL = regenerative\n• แมว aggregate retic: > 50,000/μL = regenerative (punctate retic ไม่นับเป็น regen)\n• ใช้ New Methylene Blue stain นับ reticulocyte\n\n✓ Time lag: ต้องรอ 3-5 วัน หลัง trigger (acute blood loss/hemolysis) → BM ตอบสนอง pre-regenerative phase อาจดูเหมือน non-regen ก่อน\n\n✗ MCV/MCHC = ช่วย classify size (macrocytic hypochromic = regen marker secondary)\n✗ Bilirubin = ดู hemolysis evidence ไม่ใช่ regen status\n✗ Coomb's = IMHA work-up\n\n💡 Non-regen common causes: CKD (low EPO), bone marrow disease, iron def, chronic dz",
    "verified": "Modified Com1 final TJ (Anemia Q4, Q10) + COM I Final 86, lecturer วชิรา"
  },
  {
    "id": 90019,
    "subject": "com1",
    "topic": "blood-transfusion",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "crossmatch",
      "dea",
      "transfusion-reaction"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "หมาที่ครอสแมตช์ blood transfusion ครั้งแรก ความจำเป็นของการ crossmatch คือข้อใด",
    "options": [
      "ครั้งแรกหมาไม่ต้อง crossmatch (เพราะไม่มี natural alloantibody) แต่แมวต้อง crossmatch ทุกครั้ง (มี natural alloantibody type B → A)",
      "หมาต้อง crossmatch ทุกครั้ง, แมวไม่ต้อง",
      "ทั้งหมาทั้งแมวต้อง crossmatch ทุกครั้งตั้งแต่ครั้งแรก",
      "ไม่มีสัตว์ชนิดใดที่ต้อง crossmatch",
      "เฉพาะหมาเพศเมียที่เคยตั้งท้องเท่านั้นที่ต้อง crossmatch"
    ],
    "answer": 0,
    "explain": "Crossmatch principle:\n• หมา: ครั้งแรกไม่ต้อง crossmatch (ไม่มี clinically significant natural alloantibody) → แต่ครั้งที่ 2 ขึ้นไปต้อง crossmatch (อาจสร้าง alloantibody anti-DEA 1.1 ถ้าได้ DEA 1.1+ blood) — universal donor = DEA 1.1 negative\n• แมว: ต้อง type + crossmatch ทุกครั้ง (มี natural alloantibody — Type B cat มี strong anti-A → fatal reaction) → universal recipient ไม่มีในแมว เพราะมี 3 group A/B/AB\n\n💡 Major crossmatch = donor RBC + recipient plasma (สำคัญสุด)\n💡 Minor crossmatch = donor plasma + recipient RBC\n\n💡 Volume overload (TACO) = transfuse > 4 mL/kg/hr ในสัตว์ที่หัวใจไม่ดี",
    "verified": "Modified Com1 final TJ (Anemia Q14-15) + COM I Final 86, lecturer วชิรา"
  },
  {
    "id": 90020,
    "subject": "com1",
    "topic": "bone-marrow-biopsy",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "bone-marrow",
      "biopsy-site",
      "iliac-crest"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "ตำแหน่งที่นิยมที่สุดในการทำ Bone marrow biopsy ในสุนัขคือข้อใด",
    "options": [
      "Dorsal iliac crest (ilium)",
      "Proximal tibia",
      "Calcaneus",
      "Sternum (manubrium)",
      "Distal radius"
    ],
    "answer": 0,
    "explain": "BM aspiration/biopsy sites (dog):\n1. Dorsal iliac crest (wing of ilium) = นิยมมากที่สุดในหมา (ไม่นิยมในแมวเพราะ pelvis แคบ)\n2. Craniolateral part of proximal humerus = นิยมในแมว + alternative ในหมา\n3. Proximal femur (trochanteric fossa)\n\n✓ Indication: persistent unexplained cytopenia, pancytopenia, abnormal circulating cell, suspected neoplasia (myeloma), iron store assessment\n✓ Tools: Jamshidi needle (core biopsy) + Rosenthal aspiration needle\n✓ Pre-op: ตรวจ coagulation status (platelet count, BMBT)\n\n💡 Send slide ก่อน fix ใน formalin — slide สมัยเก่ามักเสียถ้าวางใกล้ formalin vapor",
    "verified": "Modified Com1 final TJ (Surgery hemolymphatic Q4) + COM I Final 86"
  },
  {
    "id": 90021,
    "subject": "com1",
    "topic": "splenectomy-indication",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "splenectomy",
      "hemangiosarcoma",
      "gdv"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "ข้อบ่งชี้ของการทำ Total splenectomy ในสุนัขคือข้อใด",
    "options": [
      "Splenic neoplasia (hemangiosarcoma), severe trauma rupture, GDV with splenic torsion, immune-mediated thrombocytopenia (IMT) refractory medical Rx",
      "Splenomegaly จาก sedation (phenothiazine) ทุกราย",
      "Splenic congestion จาก heart failure",
      "Splenic abscess เล็กที่ตอบสนอง antibiotic",
      "Generalized splenomegaly จาก chronic infection"
    ],
    "answer": 0,
    "explain": "Total splenectomy indications:\n• Splenic neoplasia (hemangiosarcoma คือ most common splenic mass หมา — splenic mass 2/3 = neoplasia, 2/3 ของ neoplasia = hemangiosarcoma)\n• GDV + splenic torsion (devitalized)\n• Severe trauma rupture (uncontrolled hemorrhage)\n• Immune-mediated disorders refractory: IMT, IMHA (steroid-resistant)\n\n⚠ Caveat: ไม่ทำใน blood parasite (e.g. Babesia) เพราะม้ามทำลาย infected RBC, splenectomy = lose clearance\n\n✗ Splenomegaly จาก sedation/heart failure = reversible, ไม่ผ่า\n✗ Abscess responsive = treat medically\n\n💡 Approach: cranial midline laparotomy → ligate splenic vessels (เว้น short gastric a./v.)",
    "verified": "Modified Com1 final TJ (Surgery hemolymphatic Q7) + COM I Final 86"
  },
  {
    "id": 90022,
    "subject": "com1",
    "topic": "ckd-iris",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "ckd",
      "iris-staging",
      "renal"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "ตาม IRIS staging CKD ในสุนัข/แมว stage ใดเริ่มแนะนำ renal-supportive diet (low phosphorus + protein-restricted) เป็นจุดเปลี่ยน",
    "options": [
      "IRIS Stage 1 (creatinine normal, structural/functional markers only)",
      "IRIS Stage 2 (creatinine borderline-mild azotemia)",
      "IRIS Stage 3 (moderate azotemia)",
      "IRIS Stage 4 (severe azotemia, end-stage)",
      "ไม่ต้องเริ่ม diet — รักษาด้วยยาเท่านั้นทุก stage"
    ],
    "answer": 1,
    "explain": "IRIS staging CKD (creatinine):\n• Stage 1: < 1.4 (dog) / < 1.6 (cat) — เริ่ม monitor, treat underlying\n• Stage 2: 1.4-2.0 (dog) / 1.6-2.8 (cat) — เริ่ม renal diet (สำคัญที่สุด) + phosphate binder ถ้า PO4 สูง\n• Stage 3: 2.1-5.0 (dog) / 2.9-5.0 (cat) — full renal management (diet + phosphate binder + ACEi/ARB ถ้า proteinuric + antihypertensive + erythropoietin ถ้า anemic)\n• Stage 4: > 5.0 — palliative/dialysis discussion\n\n✓ Substaging: proteinuria (UPC), BP (target < 160 mmHg)\n\n💡 IRIS 1 + ไม่มี proteinuria + ความดันปกติ → monitor 3-6 เดือน, ยังไม่ต้องทำอะไรเร่งด่วน",
    "verified": "Modified Com1 final TJ (Renal Q5-6) + COM I Final 86 Q35-36, lecturer วชิรา"
  },
  {
    "id": 90023,
    "subject": "com1",
    "topic": "aki-stages",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "aki",
      "azotemia",
      "reversible"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "ระยะของ Acute Kidney Injury (AKI) ที่ยังสามารถย้อนกลับ (reversible) ได้คือระยะใด",
    "options": [
      "Initiation phase และ Extension phase",
      "Maintenance phase เท่านั้น",
      "Recovery phase เท่านั้น",
      "End-stage CKD",
      "ไม่มี phase ใดที่ reversible"
    ],
    "answer": 0,
    "explain": "AKI 4 phases (sequential):\n1. Initiation — initial injury (ischemia/toxin) → renal blood flow ลด, GFR ลด, tubular cell stress (reversible — intervene ได้)\n2. Extension — continued ischemia + inflammation, tubular damage progress (reversible if catch early, last chance to intervene)\n3. Maintenance — established tubular necrosis, GFR ต่ำคงที่ 1-2 wk (irreversible structurally แต่ supportive care)\n4. Recovery — tubular regeneration, polyuric phase, function ค่อยกลับมาบางส่วน\n\n✓ Goal: catch ระยะ 1-2 → fluid therapy, remove toxin, treat underlying = save function\n\n💡 IRIS AKI grade I-V (different from CKD staging) ใช้ creatinine + clinical status\n💡 Pre-renal AKI (dehydration) reverses with fluid; intrinsic AKI (NSAIDs, ethylene glycol, lepto) อาจ progress ถ้าช้า",
    "verified": "Modified Com1 final TJ (Renal Q1) + COM I Final 86 Q31"
  },
  {
    "id": 90024,
    "subject": "com1",
    "topic": "prerenal-azotemia",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "dehydration",
      "usg",
      "azotemia"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "สุนัข dehydrate 7% Creatinine 2.2 mg/dL USG 1.050 ข้อวินิจฉัยที่เหมาะสมที่สุดคือ",
    "options": [
      "Stage III CKD (moderate azotemia)",
      "Pre-renal azotemia / mild stage II azotemia (dehydration → ↓GFR แต่ tubule ยังเข้มข้นปัสสาวะได้ดี — USG 1.050)",
      "Post-renal azotemia (urethral obstruction)",
      "Acute tubular necrosis maintenance phase",
      "Glomerulonephritis with nephrotic syndrome"
    ],
    "answer": 1,
    "explain": "Pre-renal vs intrinsic azotemia differentiation by USG:\n• Pre-renal (dehydration, hypovolemia): USG > 1.030 หมา / > 1.035 แมว = ไตยัง concentrate ได้ดี → ↓ GFR เพราะ low perfusion เท่านั้น\n• Intrinsic (tubular damage): USG isosthenuria 1.008-1.012 = ไต concentrate ไม่ได้\n• Post-renal (obstruction/uroabdomen): USG variable\n\n✓ Stem: USG 1.050 = highly concentrated → pre-renal pattern\n✓ Tx: IV fluid resuscitation, recheck creatinine after rehydrate (24-48 hr) ถ้า normalize = confirmed pre-renal\n\n💡 USG 1.050 = สูงมากใกล้ maximum dog concentrating ability (~1.060) → tubule healthy",
    "verified": "Modified Com1 final TJ (Renal Q3) + COM I Final 86 Q32"
  },
  {
    "id": 90025,
    "subject": "com1",
    "topic": "ckd-complications",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "uremic-syndrome",
      "hyperphosphatemia",
      "anemia"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "ข้อใด ไม่ใช่ ผลกระทบ (complication) ที่พบบ่อยจากภาวะ CKD",
    "options": [
      "Hyperphosphatemia + secondary renal hyperparathyroidism",
      "Non-regenerative anemia (ขาด erythropoietin)",
      "Proteinuria (PLN/glomerular involvement)",
      "Metabolic acidosis",
      "Hypokalemia ใน CKD ทุกรายเป็นภาวะหลัก (มักเจอ hyperkalemia มากกว่า ยกเว้นแมว CKD ที่ K มัก ↓)"
    ],
    "answer": 4,
    "explain": "CKD common complications:\n✓ Anemia non-regen (EPO ลด, GI blood loss, uremic platelet dysfunction)\n✓ Proteinuria (PLN, prognostic worse)\n✓ Hyperphosphatemia → 2° renal HPT → calcium-phosphorus dysregulation\n✓ Metabolic acidosis (impaired NH4+ excretion)\n✓ Systemic hypertension\n✓ Hypokalemia ในแมว CKD (ไม่ใช่ทุกราย, common ในแมว); หมาส่วนใหญ่ K normal-high\n\n⚠ Hypokalemia เป็น CKD complication ในแมวจริง แต่ statement \"ทุกรายเป็นภาวะหลัก\" ผิด เพราะ K abnormality ขึ้นกับ phase + species\n\n💡 Stem จาก COM 86 Q33: hypokalemia ไม่ถือเป็นภาวะหลักของ CKD ทุกราย — TJ key flagged",
    "verified": "Modified Com1 final TJ (Renal Q4) + COM I Final 86 Q33",
    "flag": {
      "severity": "minor",
      "note": "Original Q stem subtle: hypokalemia is common complication in feline CKD but not universal — wording 'ทุกรายเป็นภาวะหลัก' makes it the 'not a complication' answer per TJ key"
    }
  },
  {
    "id": 90026,
    "subject": "com1",
    "topic": "ckd-proteinuria-rx",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "acei",
      "telmisartan",
      "proteinuria"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "สุนัข CKD IRIS stage 3 มี proteinuria (UPC > 0.5) และ systemic hypertension ยาที่ควรเริ่มเพื่อจัดการ proteinuria + ความดัน คือกลุ่มใด",
    "options": [
      "Furosemide (loop diuretic) เดี่ยวๆ",
      "Calcium channel blocker (amlodipine) เดี่ยวๆ",
      "ACE inhibitor (benazepril/enalapril) หรือ ARB (telmisartan) — first-line สำหรับ proteinuria",
      "β-blocker (atenolol)",
      "α-adrenergic agonist (phenylpropanolamine)"
    ],
    "answer": 2,
    "explain": "Proteinuric CKD management:\n✓ ACEi (benazepril, enalapril) หรือ ARB (telmisartan) = first-line → dilate efferent arteriole → ลด glomerular hyperfiltration pressure → ลด proteinuria (และลด BP)\n✓ Add amlodipine ถ้า BP ยังสูง (โดยเฉพาะแมว CKD)\n✓ Renal diet (low phosphorus + moderate protein restriction)\n✓ Clopidogrel ถ้า severe proteinuria (PLN-associated hypercoagulable state)\n\n✗ Furosemide = ไม่ใช่ first-line, อาจ worsen pre-renal azotemia + activate RAAS\n✗ β-blocker = ไม่ specific\n✗ α-agonist = urinary incontinence drug ไม่เกี่ยว CKD\n\n💡 Monitor: creatinine + K (ACEi อาจทำให้ K สูง), UPC ratio, BP",
    "verified": "Modified Com1 final TJ (Renal Q8) + COM I Final 86 Q40"
  },
  {
    "id": 90027,
    "subject": "com1",
    "topic": "feline-flutd",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "fic",
      "idiopathic-cystitis",
      "feline"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "สาเหตุที่พบบ่อยที่สุดของ Feline Lower Urinary Tract Disease (FLUTD) ในแมวอายุ < 10 ปี คือ",
    "options": [
      "Bacterial UTI",
      "Feline Idiopathic Cystitis (FIC) / Pandora syndrome",
      "Urolithiasis (CaOx, struvite)",
      "Neoplasia (transitional cell carcinoma)",
      "Urethral plug จาก crystalluria เดี่ยวๆ"
    ],
    "answer": 1,
    "explain": "FLUTD etiology by age:\n• Cats < 10 yr: FIC (~65%) > urolithiasis (15-20%) > urethral plug (10-20%) > UTI (rare < 1-2%)\n• Cats > 10 yr: UTI proportion เพิ่ม (เพราะ CKD ลด USG → bacterial colonization), urolithiasis ยังพบ\n\n✓ FIC characteristics:\n• Self-limiting episode (~5-7 days)\n• Triggered by stress (multi-cat household, environment change)\n• Diagnosis of exclusion (rule out stone, UTI, neoplasia ก่อน)\n• Treatment = MEMO (Multimodal Environmental MOdification) + diet stress reduction (c/d Multicare Stress) + analgesic + pheromone\n\n✗ Bacterial UTI ในแมวอายุน้อย rare (USG > 1.040 = bactericidal)\n\n💡 Pandora syndrome = FIC + comorbid behavior/GI/endocrine = systemic stress-related",
    "verified": "Modified Com1 final TJ (Renal Q12) + COM I Final 86 Q43"
  },
  {
    "id": 90028,
    "subject": "com1",
    "topic": "urolith-types",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "urolith",
      "calcium-oxalate",
      "struvite"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "สุนัขโตขนาดใหญ่ตรวจพบนิ่ว 2 ก้อนในกระเพาะปัสสาวะ ผล urine culture บอกถึง Urease-producing bacteria (เช่น Staphylococcus, Proteus) ชนิดนิ่วที่ควรสงสัยและการจัดการคือ",
    "options": [
      "Calcium oxalate (CaOx) — ผ่าออกอย่างเดียว",
      "Struvite (magnesium ammonium phosphate / triple-P) — antibiotic + acidifying renal diet ละลายได้",
      "Urate — purine-restricted diet เดี่ยวๆ",
      "Cystine — strict cystine-restricted diet เดี่ยวๆ",
      "Silica — surgical removal only"
    ],
    "answer": 1,
    "explain": "Urease-producing bacteria (Staph, Proteus, Klebsiella) → urea → ammonia + CO2 → urine alkaline + ammonium → Struvite stone (magnesium ammonium phosphate, MAP, triple-P)\n\n✓ Struvite management:\n• Antibiotic ตาม C/S (clear UTI = clear nidus)\n• Calculolytic diet (Hill's s/d, Royal Canin Urinary SO) → acidify urine + low protein/Mg = ละลายได้ใน 4-12 weeks\n• Recheck radiograph monthly\n• Surgery ถ้า large/obstructive/refractory\n\n✗ CaOx = ผ่าอย่างเดียว ไม่ละลาย (ป้องกัน recur ด้วย potassium citrate + low Ca diet)\n✗ Urate = purine-low diet (Dalmatian/PSS), อาจละลายด้วย allopurinol\n✗ Cystine = D-penicillamine, low-cystine diet (Bulldog)\n\n💡 Stone radiopacity: struvite + CaOx = radiopaque; urate + cystine + xanthine = radiolucent (need contrast/US)",
    "verified": "Modified Com1 final TJ (Renal Q14, Q18) + COM I Final 86 Q45"
  },
  {
    "id": 90029,
    "subject": "com1",
    "topic": "urethral-obstruction",
    "year": 4,
    "source": "COM I Final 86",
    "tags": [
      "urethral-obstruction",
      "feline-blocked",
      "hyperkalemia"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "แมวเพศผู้นึงพยายามอึ๊แต่ฉี่ไม่ออก จับคลำกระเพาะปัสสาวะพบใหญ่และเต่งมาก เมื่อสัตวแพทย์บีบพบว่ามีเลือดปนออกมา ภาวะนี้คือ",
    "options": [
      "Urethral obstruction (blocked cat) — emergency",
      "Bladder atony จาก lower motor neuron disease",
      "Pure incontinence (urinary sphincter weakness)",
      "Ectopic ureter",
      "Pyelonephritis"
    ],
    "answer": 0,
    "explain": "Blocked cat (urethral obstruction) classic presentation:\n• แมวเพศผู้ (urethra ตีบ + ยาว predispose)\n• Stranguria + repeated trips to litter box + vocalize + bladder distended + painful palpation\n• Often blood-tinged เพราะ mucosal trauma + crystal/plug irritation\n• Cause: urethral plug (matrix + struvite crystal), urolith, urethral spasm, FIC sequelae\n\n⚠ Emergency = hyperkalemia → bradycardia → cardiac arrest\n• Tx pathway: stabilize (IV fluid + Ca gluconate ถ้า ECG เปลี่ยน + insulin/dex ถ้า K สูง) → unblock urethra (sedation + catheterization + flush) → indwelling catheter 24-48 hr → cystocentesis ถ้า unblock ไม่ได้\n\n✗ Atony/incontinence/ectopic = ไม่ acute distress + ไม่ bladder distended พร้อม blood\n\n💡 Recurrent block = พิจารณา perineal urethrostomy (PU)",
    "verified": "Modified Com1 final TJ (Renal Q24) + COM I Final 86 Q48"
  },
  {
    "id": 90030,
    "subject": "com1",
    "topic": "ectopic-ureter",
    "year": 4,
    "source": "COM I Final 85/86",
    "tags": [
      "ectopic-ureter",
      "young-dog",
      "incontinence"
    ],
    "type": "mcq",
    "examOrigin": "COM I Final 86",
    "q": "สุนัขเพศเมียอายุ 1 ปี มีความผิดปกติคือฉี่ไหลตลอดเวลา ขนเปียก แต่ยังมีพฤติกรรมพยายามฉี่อยู่ Best surgical correction คือ",
    "options": [
      "Ovariohysterectomy (OVH) เดี่ยวๆ",
      "Ureteroneocystostomy / Neoureterostomy (correct ectopic ureter insertion)",
      "Urethral occluder placement",
      "Cystotomy เพื่อ stone removal",
      "Perineal urethrostomy"
    ],
    "answer": 1,
    "explain": "Young female dog + continuous urine dribbling + still attempting normal urination = classic ectopic ureter (congenital — ureter เปิดเข้า urethra/vagina แทน trigone กระเพาะ)\n\n✓ Diagnosis:\n• Best imaging = CT excretory urography (gold-standard) หรือ retrograde vagino-urethrography\n• Cystoscopy ทั้ง Dx + treatment (laser ablation ใน intramural type)\n\n✓ Treatment:\n• Surgical: Ureteroneocystostomy / Neoureterostomy (transect + re-implant) — extramural type\n• Cystoscopic laser ablation — intramural type (less invasive)\n• Concurrent USMI ~50% → add PPA หรือ urethral bulking agent post-op\n\n✗ OVH/urethral occluder/cystotomy = ไม่แก้ root cause anatomical\n\n💡 Predispose breed: Labrador, golden, Siberian husky (female > male)",
    "verified": "Modified Com1 final TJ (Renal Q25) + COM I Final 86 Q49"
  }
];
