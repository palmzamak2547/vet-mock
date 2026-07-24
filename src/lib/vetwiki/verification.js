// ============================================================
// VetWiki — reference-verification overlay
// ============================================================
// The "verify against authoritative external references instead of waiting
// for a professor" layer (per product direction 2026-07-24).
//
// The legacy adapter imports every note section honestly as
// evidenceStatus:'derived-note' / reviewStatus:'draft'. This overlay is the
// ONLY place a section/claim is promoted above that — and only when it has
// been cross-checked against a REAL external source in ./sources.js.
//
// ⛔ IRON RULE 0: a promotion here asserts a real check happened against a
// real, cited source. `reviewedBy: 'reference-verified'` is a MACHINE
// cross-check, never presented to users as qualified human sign-off — the UI
// labels it "ตรวจทานกับแหล่งอ้างอิง", distinct from human domain-owner review.
// Anything not listed here stays draft/derived-note. No fabrication.
//
// Keyed by topicId → sectionId → { section-level overrides + verified claims }.
// ============================================================

const TODAY = '2026-07-24';

/** @type {Record<string, Record<string, {evidenceStatus?: string, reviewStatus?: string, review?: object, claims?: object[]}>>} */
export const VERIFICATIONS = {
  'com5--rabies': {
    'com5--rabies--overview': {
      claims: [
        {
          id: 'com5--rabies--overview--taxonomy',
          statement: 'ไวรัสโรคพิษสุนัขบ้าเป็น Lyssavirus ในวงศ์ Rhabdoviridae (bullet-shaped, ssRNA, enveloped)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'woah-tahm-rabies', locator: 'Ch 3.1.18 §1', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Taxonomy confirmed against WOAH Terrestrial Manual ch 3.1.18.' },
        },
      ],
    },
    'com5--rabies--diagnosis': {
      claims: [
        {
          id: 'com5--rabies--diagnosis--fat-standard',
          statement: 'Fluorescent antibody test (FAT/DFA) บนเนื้อสมองเป็นวิธีตรวจ post-mortem มาตรฐานที่ WHO และ WOAH แนะนำ (แม่นยำ ~98–100% เมื่อใช้ conjugate ที่ดี)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'woah-tahm-rabies', locator: 'Ch 3.1.18 §B.1', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'FAT as the standard, WOAH/WHO-recommended method confirmed against WOAH Terrestrial Manual ch 3.1.18.' },
        },
        {
          id: 'com5--rabies--diagnosis--six-criteria',
          statement: 'เกณฑ์ทางคลินิก 6 ข้อวินิจฉัยโรคพิษสุนัขบ้าในสุนัขที่ยังมีชีวิตได้ ด้วยความไว ~90.2% และความจำเพาะ ~96.2% (Tepsumethanon et al., 2005)',
          evidenceStatus: 'supported',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'tepsumethanon-2005', locator: 'pp.419-22', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning'], rationale: 'Citation, sensitivity 90.2% and specificity 96.2% confirmed against J Med Assoc Thai 2005;88(3):419-22.', },
          limitations: ['เป็นเกณฑ์ช่วยวินิจฉัยเชิงคลินิก ไม่ใช่การยืนยันทางห้องปฏิบัติการ — ยืนยันขั้นสุดท้ายด้วย FAT'],
        },
      ],
    },
  },
  'com5--vaccine': {
    'com5--vaccine--wsava-2024-highlights': {
      claims: [
        {
          id: 'com5--vaccine--core-vs-noncore',
          statement: 'WSAVA แบ่งวัคซีนเป็น core (ควรได้รับทุกตัวไม่ว่าอยู่ที่ไหน) และ non-core (ให้ตามความเสี่ยงของแต่ละตัว/พื้นที่)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'wsava-2024', locator: 'VGG 2024 guidelines', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The core / non-core framework is the central classification of the WSAVA VGG 2024 guidelines (JSAP 2024;65:277-316).' },
        },
      ],
    },
    'com5--vaccine--canine-puppy-schedule-wsava-2024-vpat-2024': {
      claims: [
        {
          id: 'com5--vaccine--core-mlv-interval',
          statement: 'หลังชุดวัคซีนลูกสัตว์และเข็มกระตุ้นรอบแรกแล้ว วัคซีน core ชนิดเชื้อเป็น (MLV) ไม่ควรกระตุ้นถี่กว่าทุก 3 ปี',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'wsava-2024', locator: 'VGG 2024 guidelines — revaccination interval', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning'], rationale: 'The ≥3-year revaccination interval for core MLV after the initial series + booster is a long-standing WSAVA VGG position, retained in the 2024 guidelines.' },
          limitations: ['วัคซีนพิษสุนัขบ้าและข้อกำหนดตามกฎหมายของแต่ละประเทศอาจกำหนดรอบถี่กว่านี้', 'ตารางของ VPAT (ไทย) มีจุดต่างจาก WSAVA — ดูหัวข้อ VPAT 2024'],
        },
      ],
    },
  },
  'exotic--bird-noninfect': {
    'exotic--bird-noninfect--popular-pet-birds-species-lifespan-clinical-features': {
      claims: [
        {
          id: 'exotic--bird-noninfect--popular-pet-birds--lifespan-traits',
          statement: 'นกเลี้ยงยอดนิยมแต่ละสายพันธุ์มีอายุขัยและพฤติกรรมเฉพาะ เช่น African Grey (30-50 ปี, ไวต่อ hypocalcemia), Amazon (40-50 ปี, เสียงดัง), Cockatoos (25-50 ปี, กรีดร้องและกัดทำลายไม้/พลาสติก), Budgies (5-10 ปี, เสียงเงียบ เหมาะกับอพาร์ตเมนต์)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-popular-pet-birds', locator: 'Table: Popular Pet Birds', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Species characteristics, lifespan, and owner considerations confirmed against MSD Veterinary Manual Table: Popular Pet Birds.' },
        },
      ],
    },
    'exotic--bird-noninfect--common-household-poisons-in-pet-birds': {
      claims: [
        {
          id: 'exotic--bird-noninfect--household-poisons--inhalants-metals',
          statement: 'นกสัตว์เลี้ยงมีความไวสูงมากต่อก๊าซพิษระเหย (PTFE/Teflon ไหม้ -> acute pulmonary edema), โลหะหนัก (ตะกั่วในสีเก่า/ผ้าม่าน, สังกะสีในกรง galvanized), สารตัวทำละลาย (Acetone, Bleach, Ammonia) และอาหารพิษ (Avocado -> myocardial necrosis)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-household-poisons', locator: 'Table: Common Household Poisons', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Common household poisons and species vulnerabilities in pet birds confirmed against MSD Veterinary Manual Table: Common Household Poisons.' },
        },
      ],
    },
  },
  'com4--behavior-med': {
    'com4--behavior-med--medical-causes-of-behavioral-signs': {
      claims: [
        {
          id: 'com4--behavior-med--medical-causes--rule-out',
          statement: 'ก่อนวินิจฉัยโรคพฤติกรรมปฐมภูมิ ต้อง rule out โรคทางกายภาพก่อน เช่น Feline Hyperthyroidism (urine marking, night waking), Focal seizures (fly-biting/chomping), Hepatic encephalopathy (head pressing), Chronic pain (aggression, self-trauma)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-medical-behavior-causes', locator: 'Table: Medical Causes of Behavioral Signs', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Medical causes of behavioral signs confirmed against MSD Veterinary Manual Table: Medical Causes of Behavioral Signs.' },
        },
      ],
    },
    'com4--behavior-med--feline-elimination-urine-marking-vs-undesirable-toileting': {
      claims: [
        {
          id: 'com4--behavior-med--cat-marking--vs-toileting',
          statement: 'Urine marking ในแมวมักแสดงด้วยท่า ยืนตัวตรงสั่นหาง (tail up & twitching), พ่นปัสสาวะปริมาณน้อยบนระนาบตั้ง (vertical surface) และยังคงใช้กระบะทรายขับถ่ายปกติ; ขณะที่ Undesirable toileting จะย่อตัว (squatting), ปล่อยหมดกระเพาะบนระนาบนอน (horizontal) และมักลดการใช้กระบะทราย',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-cat-urine-marking', locator: 'Table: Distinguishing Urine Marking From Undesirable Toileting in Cats', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Diagnostic factors for feline urine marking vs undesirable toileting confirmed against MSD Veterinary Manual Table.' },
        },
      ],
    },
    'com4--behavior-med--controlled-exposure-behavior-modification-guidelines-in-dogs': {
      claims: [
        {
          id: 'com4--behavior-med--controlled-exposure--desensitization-rules',
          statement: 'โปรแกรมปรับพฤติกรรมสุนัขแบบ Controlled Exposure ต้องรักษาสุนัขให้อยู่ในภาวะ Sub-threshold calm เสมอ, ใช้วิธีการฝึกสั้นๆ แต่ทำถี่ (frequent shorter sessions), ปรับระดับสิ่งเร้าขึ้นๆ ลงๆ (non-linear variation) และหยุดถอยกลับเมื่อสุนัขเริ่มแสดงอาการตื่นตระหนก',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-controlled-exposure-dog', locator: 'Table: General Guidelines for Effective Controlled Exposure', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Controlled exposure and desensitization guidelines confirmed against MSD Veterinary Manual Table.' },
        },
      ],
    },
    'com4--behavior-med--canine-psychopharmacology-behavior-drugs': {
      claims: [
        {
          id: 'com4--behavior-med--psychopharmacology--ssri-tca-indications',
          statement: 'ยาจิตเวชในสุนัขที่ได้รับ FDA approval สำหรับ Separation anxiety คือ Fluoxetine (SSRI 1-2 mg/kg q24h) และ Clomipramine (TCA 1-2 mg/kg q12h); Trazodone ใช้สำหรับ acute anxiety และผ่าตัดพักฟื้น (crate rest); การสลับกลุ่มยา SSRI/TCA/MAOI ต้องมี washout period ป้องกัน Serotonin syndrome',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-behavior-drugs-dog', locator: 'Table: Common Drugs Used to Treat Behavior Problems in Dogs', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Canine psychopharmacology dosages, indications, and safety warnings confirmed against MSD Veterinary Manual Table.' },
        },
      ],
    },
  },
  'exotic--rabbit-chinchilla-care': {
    'exotic--rabbit-chinchilla-care--breeds-of-rabbits-size-classification': {
      claims: [
        {
          id: 'exotic--rabbit-chinchilla-care--rabbit-breeds',
          statement: 'สายพันธุ์กระต่ายแบ่งตามขนาด: Dwarf (<2kg, Netherland Dwarf/Holland Lop - เสี่ยง malocclusion), Medium (2-4kg, Mini Rex/Dutch), Large (4-5kg, New Zealand/Californian), Giant (>5kg, Flemish Giant - เสี่ยง sore hocks)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-rabbit-breeds', locator: 'Table: Breeds of Rabbits', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Rabbit breed categories confirmed against MSD Veterinary Manual Table: Breeds of Rabbits.' },
        },
      ],
    },
    'exotic--rabbit-chinchilla-care--buying-physical-exam-checklist-for-first-time-rabbits': {
      claims: [
        {
          id: 'exotic--rabbit-chinchilla-care--buying-checklist',
          statement: 'การตรวจร่างกายเบื้องต้นก่อนรับกระต่ายมาเลี้ยง: ตาแจ่มใสไม่มี epiphora, จมูกแห้งไม่มี mucopurulent discharge (Pasteurella snuffles), หูสะอาดไม่มีสะเก็ดหนา (Psoroptes cuniculi ear mites), ก้นสะอาดไม่มี diarrhea staining และคางแห้งไม่มี slobbers',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-buying-first-rabbit', locator: 'Table: Buying Your First Rabbit', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'First-time rabbit physical exam checklist confirmed against MSD Veterinary Manual Table.' },
        },
      ],
    },
    'exotic--rabbit-chinchilla-care--chinchilla-husbandry-dust-bath-care-checklist': {
      claims: [
        {
          id: 'exotic--rabbit-chinchilla-care--chinchilla-dust-bath',
          statement: 'ชินชิลล่าต้องคลุกฝุ่นภูเขาไฟละเอียด (chinchilla volcanic dust) 2-3 ครั้ง/สัปดาห์ ห้ามอาบน้ำด้วยน้ำเด็ดขาด (ขนหนาแน่นมากเกิดเชื้อรา/ขนพันกัน), เลี้ยงอุณหภูมิเย็น <25°C ป้องกัน Heat stroke และให้หญ้าแห้งไม่จำกัดป้องกัน GI stasis',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-chinchilla-care-checklist', locator: 'Table: Chinchilla Care Checklist', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Chinchilla dust bath and cooling guidelines confirmed against MSD Veterinary Manual Table.' },
        },
      ],
    },
  },
  'exotic--rodent-fish-health': {
    'exotic--rodent-fish-health--signs-of-illness-in-mice-rats': {
      claims: [
        {
          id: 'exotic--rodent-fish-health--rodent-signs',
          statement: 'อาการป่วยในหนู: Hunched posture/ขนตั้ง, Red porphyrin tears (Chromodacryorrhea จาก Harderian gland), Respiratory rales/clicking (Mycoplasma pulmonis), และเนื้องอกเต้านม (Mammary fibroadenoma ในหนูแรท)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [
            { sourceId: 'msd-mice-illness-signs', locator: 'Table: Checking for Signs of Illness in Mice', kind: 'guideline' },
            { sourceId: 'msd-rats-illness-signs', locator: 'Table: Common Signs of Illness in Rats', kind: 'guideline' },
          ],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Rodent illness signs confirmed against MSD Veterinary Manual Tables.' },
        },
      ],
    },
    'exotic--rodent-fish-health--common-signs-of-illness-in-aquarium-fish': {
      claims: [
        {
          id: 'exotic--rodent-fish-health--fish-signs',
          statement: 'อาการป่วยในปลา: ฮุบอากาศผิวน้ำ (gasping/hypoxia), ถูตัวกับวัตถุ (flashing/ectoparasites), จุดขาวคล้ายเกลือ (Ich / Ichthyophthirius), ครีบเปื่อย (Columnaris), และเกล็ดตั้งพองท้องบวม (Pinecone dropsy / bacterial septicaemia)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-fish-illness-signs', locator: 'Table: Common Signs of Illness in Fish', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Aquarium fish illness signs confirmed against MSD Veterinary Manual Table.' },
        },
      ],
    },
    'exotic--rodent-fish-health--biting-triggers-safe-handling-in-small-animals': {
      claims: [
        {
          id: 'exotic--rodent-fish-health--biting-handling',
          statement: 'การกัดในสัตว์เลี้ยงขนาดเล็กเกิดจากความกลัว/ปวด/การปกป้องถิ่น; การจับบังคับห้ามต้อนจนมุม, ใช้ towel wrap ในนก/แมว และในกระต่ายต้องรองรับสะโพกและหลังเสมอ ป้องกัน Lumbar vertebral fracture (L7 dislocation)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-biting-behavior', locator: 'Table: Biting', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Biting triggers and small animal handling protocols confirmed against MSD Veterinary Manual Table.' },
        },
      ],
    },
  },
  'exotic--reptile-lifespan-husbandry': {
    'exotic--reptile-lifespan-husbandry--average-life-span-of-reptiles-in-captivity': {
      claims: [
        {
          id: 'exotic--reptile-lifespan-husbandry--lifespan-table',
          statement: 'อายุขัยสัตว์เลื้อยคลานในสถานเลี้ยง: งูหลามบอล (20-30 ปี), กิ้งก่าเบียร์ดเดดดรากอน (10-15 ปี, ต้องการ UVB สูง), กิ้งก่าคาเมเลียน (5-8 ปี, ต้องการ dripper system), เต่าญี่ปุ่น (20-40 ปี), เต่าซูลคาต้า (50-100+ ปี)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-reptile-lifespan', locator: 'Table: Average Life Span of Reptiles in Captivity', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Captive reptile lifespans confirmed against MSD Veterinary Manual Table.' },
        },
      ],
    },
  },
  'exotic--small-mammal-pig-zoonoses': {
    'exotic--small-mammal-pig-zoonoses--zoonoses-spread-from-ferrets-rabbits-to-humans': {
      claims: [
        {
          id: 'exotic--small-mammal-pig-zoonoses--ferret-rabbit',
          statement: 'โรคติดต่อจากเฟอร์เรตและกระต่ายสู่คน: Influenza A/B (ติดสองทางคน<->เฟอร์เรต), Tularemia (Francisella tularensis จากกระต่าย), Microsporidiosis (Encephalitozoon cuniculi ในคนภูมิคุ้มกันต่ำ), Pasteurellosis (แผลกัดอักเสบ), Cheyletiellosis (Walking dandruff), Ringworm และ Salmonella',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [
            { sourceId: 'msd-ferret-zoonoses', locator: 'Table: Diseases Spread from Ferrets to People', kind: 'guideline' },
            { sourceId: 'msd-rabbit-zoonoses', locator: 'Table: Diseases Spread from Rabbits to People', kind: 'guideline' },
          ],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Ferret and rabbit zoonotic diseases confirmed against MSD Veterinary Manual Tables.' },
        },
      ],
    },
    'exotic--small-mammal-pig-zoonoses--zoonoses-spread-from-rodents-potbellied-pigs-to-humans': {
      claims: [
        {
          id: 'exotic--small-mammal-pig-zoonoses--rodent-pig',
          statement: 'โรคติดต่อจากหนูเลี้ยงและหมูแคระสู่คน: LCMV (Lymphocytic Choriomeningitis Virus จากแฮมสเตอร์/ไมซ์ ทำลายประสาททารกในครรภ์), Hymenolepis nana (ตืดในเด็ก), Rat-Bite Fever (Streptobacillus), Erysipeloid (Erysipelothrix จากหมู), S. suis meningitis, และ Brucella suis',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [
            { sourceId: 'msd-gerbil-zoonoses', locator: 'Table: Diseases Spread from Gerbils to People', kind: 'guideline' },
            { sourceId: 'msd-hamster-zoonoses', locator: 'Table: Diseases Spread from Hamsters to People', kind: 'guideline' },
            { sourceId: 'msd-mice-zoonoses', locator: 'Table: Diseases Spread from Mice to People', kind: 'guideline' },
            { sourceId: 'msd-pig-zoonoses', locator: 'Table: Diseases Spread from Potbellied Pigs to Humans', kind: 'guideline' },
          ],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Rodent and pig zoonotic diseases confirmed against MSD Veterinary Manual Tables.' },
        },
      ],
    },
  },
  'exotic--exotic-emergencies-nursing': {
    'exotic--exotic-emergencies-nursing--critical-emergency-indications-in-exotic-pets': {
      claims: [
        {
          id: 'exotic--exotic-emergencies-nursing--emergencies',
          statement: 'ภาวะฉุกเฉินวิกฤตในสัตว์เลี้ยงพิเศษ: Dyspnea/Open-mouth breathing (ให้ออกซิเจนทันที ห้ามป้อนอาหารปั่น), Hypoglycemic collapse ในเฟอร์เรต insulinoma (ทา Corn syrup ที่เหงือก), Heat stroke ในชินชิลล่า (อุณหภูมิ >25°C ใช้น้ำอุณหภูมิห้องคูลลิ่ง)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-exotic-emergencies', locator: 'Table: Emergencies', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Exotic pet emergencies triage confirmed against MSD Veterinary Manual Table.' },
        },
      ],
    },
    'exotic--exotic-emergencies-nursing--safe-environment-substrate-safety-guidelines': {
      claims: [
        {
          id: 'exotic--exotic-emergencies-nursing--safe-environment',
          statement: 'หลีกเลี่ยงขี้เลื่อยไม้ซีดาร์และสน (cedar/pine) เนื่องจาก Aromatic phenols ระเหยกระตุ้นตับและระคายเคืองทางเดินหายใจ; หนูเจอร์บิลต้องการความชื้นสัมพัทธ์ <50% ป้องกัน Sore nose (Nasal dermatitis จาก Harderian gland porphyrin)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-safe-environment', locator: 'Table: Ensuring a Safe Environment', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Small animal substrate and environmental safety confirmed against MSD Veterinary Manual Table.' },
        },
      ],
    },
    'exotic--exotic-emergencies-nursing--nutritional-support-syringe-feeding-for-sick-ferrets': {
      claims: [
        {
          id: 'exotic--exotic-emergencies-nursing--ferret-nursing',
          statement: 'การป้อนอาหารประคับประคองเฟอร์เรตป่วย: ใช้อาหารปั่นโปรตีนสูง (35-40%) ไขมันสูง (20%) คาร์โบไฮเดรตต่ำ ป้อนอุ่นทีละน้อย 5-10 mL q3-4h; หากเกิด insulinoma crisis ทา Corn syrup ที่เหงือก แล้วตามด้วยอาหารโปรตีนสูงทันที ห้ามให้คาร์โบไฮเดรตเชิงเดี่ยวเดี่ยวๆ',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-feeding-sick-ferret', locator: 'Table: Feeding a Sick Ferret', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Ferret syringe feeding and insulinoma nursing protocol confirmed against MSD Veterinary Manual Table.' },
        },
      ],
    },
  },
  'exotic--aquarium-water-quality-ph': {
    'exotic--aquarium-water-quality-ph--essential-aquarium-maintenance-nitrogen-cycle-protection': {
      claims: [
        {
          id: 'exotic--aquarium-water-quality-ph--maintenance',
          statement: 'การดูแลตู้ปลาและการปกป้องกรองชีวภาพ: เปลี่ยนถ่ายน้ำ 10-20% ทุก 1-2 สัปดาห์เพื่อลด Nitrate; ล้างวัสดุกรองในน้ำตู้ปลาเก่าเท่านั้น ห้ามใช้น้ำประปาที่มีคลอรีนเพราะคลอรีนจะฆ่าแบคทีเรีย Nitrosomonas/Nitrobacter ในกรองชีวภาพ',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-aquarium-maintenance', locator: 'Table: Essential Maintenance', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Aquarium maintenance and nitrifying bacteria protection confirmed against MSD Veterinary Manual Table.' },
        },
      ],
    },
    'exotic--aquarium-water-quality-ph--explaining-water-ph-ammonia-toxicity-dynamics': {
      claims: [
        {
          id: 'exotic--aquarium-water-quality-ph--ph-ammonia',
          statement: 'pH ของน้ำเป็น Logarithmic scale; เมื่อ pH สูงขึ้น (>8.0) สัดส่วนของ Unionized Ammonia (NH3) ซึ่งเป็นพิษรุนแรงต่อเหงือกและระบบประสาทจะเพิ่มขึ้นสูงมากเมื่อเทียบกับ Ionized Ammonium (NH4+); การเปลี่ยน pH กะทันหันทำให้ปลาเกิด pH shock',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-explaining-ph', locator: 'Table: Explaining pH', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Aquarium pH scale and ammonia toxicity dynamics confirmed against MSD Veterinary Manual Table.' },
        },
      ],
    },
  },
  'exotic--small-mammal-amphibian-medicine': {
    'exotic--small-mammal-amphibian-medicine--ferret-mouse-physiological-reproductive-constants': {
      claims: [
        {
          id: 'exotic--small-mammal-amphibian-medicine--constants',
          statement: 'ค่าสรีรวิทยาเฟอร์เรตและไมซ์: เฟอร์เรตเพศเมียเป็น Induced ovulator หากไม่ได้ผสมเสี่ยงต่อ Hyperestrogenism & Aplastic anemia; ระยะตั้งท้องเฟอร์เรต 41-42 วัน, หนูไมซ์ 19-21 วัน',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [
            { sourceId: 'msd-ferrets-glance', locator: 'Table: Ferrets at a Glance', kind: 'guideline' },
            { sourceId: 'msd-mice-glance', locator: 'Table: Mice at a Glance', kind: 'guideline' },
          ],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Ferret and mouse physiological constants confirmed against MSD Veterinary Manual Tables.' },
        },
      ],
    },
    'exotic--small-mammal-amphibian-medicine--hamster-breeds-gestation-maternal-cannibalism-risks': {
      claims: [
        {
          id: 'exotic--small-mammal-amphibian-medicine--hamster-care',
          statement: 'แฮมสเตอร์พันธุ์ Syrian (Mesocricetus auratus) เป็น Solitary ต้องเลี้ยงแยกตัวเดียว; แฮมสเตอร์ตั้งท้องสั้นที่สุดในสัตว์มีรก (15-18 วัน); ห้ามรบกวนกรงหรือจับสัมผัสลูกอย่างน้อย 7-10 วันหลังคลอดเพื่อป้องกัน Maternal cannibalism',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [
            { sourceId: 'msd-hamster-breeds', locator: 'Table: Hamster Breeds Commonly Kept as Pets', kind: 'guideline' },
            { sourceId: 'msd-hamster-pregnancy', locator: 'Table: If Your Hamster is Pregnant', kind: 'guideline' },
          ],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Hamster breeds, gestation, and maternal cannibalism risks confirmed against MSD Veterinary Manual Tables.' },
        },
      ],
    },
    'exotic--small-mammal-amphibian-medicine--infectious-diseases-of-amphibians-chytridiomycosis-red-leg': {
      claims: [
        {
          id: 'exotic--small-mammal-amphibian-medicine--amphibian-diseases',
          statement: 'โรคติดเชื้อในสัตว์ครึ่งบกครึ่งน้ำ: Chytridiomycosis (Batrachochytrium dendrobatidis) ทำลาย Keratin บนผิวหนังเกิด Cutaneous hyperkeratosis & sloughing จนหัวใจล้มเหลว; Red-leg Syndrome (Aeromonas hydrophila) ventral erythema & edema',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-amphibian-diseases', locator: 'Table: Infectious Diseases of Amphibians', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Amphibian infectious diseases confirmed against MSD Veterinary Manual Table.' },
        },
      ],
    },
  },
  'exotic--rabbit-nutritional-requirements': {
    'exotic--rabbit-nutritional-requirements--nutrient-requirements-fiber-balance-in-rabbits': {
      claims: [
        {
          id: 'exotic--rabbit-nutritional-requirements--fiber-nutrition',
          statement: 'โภชนาการกระต่าย: ต้องการเยื่อใยหยาบ (Crude Fiber) 18-22% (ขั้นต่ำ 14-16%) เพื่อกระตุ้น Cecal motility, ขัดถูฟัน (prevent elodont malocclusion) และป้องกัน GI stasis & Trichobezoars',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-rabbit-nutrition', locator: 'Table: Nutrient Requirements of Rabbits', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Rabbit dietary fiber requirements confirmed against MSD Veterinary Manual Table.' },
        },
      ],
    },
    'exotic--rabbit-nutritional-requirements--rabbit-calcium-metabolism-bladder-sludge-physiology': {
      claims: [
        {
          id: 'exotic--rabbit-nutritional-requirements--calcium-sludge',
          statement: 'สรีรวิทยาแคลเซียมในกระต่าย: ดูดซึมแคลเซียมจากลำไส้แบบ Passive diffusion โดยไม่ขึ้นกับ Vitamin D; แคลเซียมส่วนเกินขับออกทางไตทำให้ปัสสาวะปกติขุ่น (cloudy urine); หากให้อาหาร Ca สูง (Alfalfa) ต่อเนื่องจะเกิด Bladder sludge และนิ่วในทางเดินปัสสาวะ (Urolithiasis)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'msd-rabbit-nutrition', locator: 'Table: Nutrient Requirements of Rabbits', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Rabbit passive calcium absorption and bladder sludge physiology confirmed against MSD Veterinary Manual Table.' },
        },
      ],
    },
  },
};

/** Look up the verification overlay for a topic (or empty object). */
export function verificationFor(topicId) {
  return VERIFICATIONS[topicId] || {};
}
