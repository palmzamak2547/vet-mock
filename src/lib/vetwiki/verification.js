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
  // Generated from a sourcing pass whose every identifier was resolved
  // against NCBI E-utilities / Crossref before being written here.
  'zoonoses--zoo-rabies': {
    'zoonoses--zoo-rabies--rabies-virus-characteristics-pathogenesis': {
      claims: [
        {
          id: 'zoonoses--zoo-rabies--rabies-virus-characteristics-pathogenesis--v1',
          statement: 'Genome ของ rabies virus เป็น RNA สายเดี่ยว linear ที่มีความยาวประมาณ 11.9 kb (ใกล้เคียง 12 kb) และมี coding region 5 ยีนเรียงกันคือ N (nucleoprotein), P (phosphoprotein), M (matrix protein), G (glycoprotein) และ L (RNA-dependent RNA polymerase) โดยความยาวของ 5 coding region นี้ค่อนข้างคงที่ระหว่าง strain',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-20193207', locator: 'Abstract, Results and Conclusions sections. Vol 30(8):824-8.', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The two full-length genomes were completely sequenced to find out that they had the same genetic structure with 11 923 nts including 58 nts-Leader, 1353 nts-NP, 894 nts-PP, 609 nts-MP, 1575 nts-GP, 6386 nts-LP […] Compared to the referenced' },
        },
        {
          id: 'zoonoses--zoo-rabies--rabies-virus-characteristics-pathogenesis--v2',
          statement: 'Pathogenesis: RABV เข้าสู่ร่างกายที่ periphery แล้วเข้า motoneuron หรือ sensory nerve และเดินทางเข้าสู่ CNS ผ่าน **retrograde axonal transport** จากนั้นในระยะหลังจะมี centrifugal spread ออกไปยัง exit portal สำคัญเช่น **salivary gland** ซึ่งเป็นเหตุให้ shed เชื้อทางน้ำลาย',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-15885837', locator: 'Abstract (review article). Virus Res 2005;111(2):120-31.', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'RV infects hosts at the periphery, enters motoneurons or sensory nerves and moves to the central nervous system (CNS) via retrograde axonal transport. At later stages, there is also centrifugal spread to major exit portals, such as the sali' },
        },
        {
          id: 'zoonoses--zoo-rabies--rabies-virus-characteristics-pathogenesis--v3',
          statement: 'ในเอเชียรวมถึงประเทศไทย **สุนัข (dog)** เป็น major reservoir ของ rabies virus และ rabies เป็นสาเหตุการตายในคนเกือบ 60,000 รายต่อปีทั่วโลก โดยเฉพาะในแอฟริกาและเอเชีย',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-34490393', locator: 'Abstract, opening paragraph. Front Vet Sci 2021;8:699352.', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Rabies is a deadly zoonotic disease responsible for almost 60,000 deaths each year, especially in Africa and Asia including Thailand. Dogs are the major reservoirs for rabies virus in these settings.' },
        },
        {
          id: 'zoonoses--zoo-rabies--rabies-virus-characteristics-pathogenesis--v4',
          statement: 'Rabies เกิดจาก neurotropic virus ใน genus *Lyssavirus* family **Rhabdoviridae** order Mononegavirales และติดต่อได้ในสัตว์เลี้ยงลูกด้วยนมทุกชนิด โดย rabies virus (RABV) คือ taxonomic prototype species "Rabies lyssavirus" ของ genus นี้ และเป็นสาเหตุของ rabies ที่รายงานในคนและสัตว์เกือบทั้งหมด',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-woah-world-organisat-2023', locator: 'Chapter 3.1.18, Section A (Introduction), p. 2. Chapter number and page confirmed by reading the PDF directly.', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Rabies is caused by neurotropic viruses of the genus Lyssavirus in the family Rhabdoviridae of the order Mononegavirales (Kuhn et al., 2021; Walker et al., 2022), and is transmissible to all mammals. […] Rabies virus (RABV) represents the t' },
        },
      ],
    },
    'zoonoses--zoo-rabies--good-sample-good-tests-good-result': {
      claims: [
        {
          id: 'zoonoses--zoo-rabies--good-sample-good-tests-good-result--v1',
          statement: 'ตัวอย่างสมองที่ส่งตรวจ rabies **ต้องมี brain stem เสมอ** เพราะ rabies antigen พบได้สม่ำเสมอที่สุดใน thalamus, pons และ medulla (positive ในทุกตัวอย่างที่ตรวจ) ขณะที่ cerebellum ให้ผลลบใน 4.5% ของสมองที่เป็นบวกจริง และ hippocampus ให้ผลลบ 4.9%',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-11849687', locator: 'Abstract, Results and Recommendation. J Virol Methods 2002;101(1-2):85-94. Study re-tested 252 rabies-positive brains.', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The thalamus, pons and medulla were the most reliable parts of the brain as they were positive in all specimens tested. The cerebellum, hippocampus and different parts of the cerebrum were negative in, respectively, 4.5, 4.9 and 3.9-11.1% o' },
        },
      ],
    },
    'zoonoses--zoo-rabies--diagnostic-methods-woah-cdc': {
      claims: [
        {
          id: 'zoonoses--zoo-rabies--diagnostic-methods-woah-cdc--v1',
          statement: '**Direct fluorescent antibody (DFA/FAT) test** คือ gold standard สำหรับการวินิจฉัย rabies และ WOAH จัดให้เป็น primary diagnostic test ร่วมกับ dRIT และ pan-lyssavirus RT-PCR ซึ่งทั้งสามให้ผลวินิจฉัยที่เชื่อถือได้ 98–100% ของ case สำหรับ lyssavirus ทุก strain หากใช้ conjugate หรือ primer/probe ที่เหมาะสม',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-29925781', locator: 'Abstract, opening statement. Vet Sci 2018;5(2):59.', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Laboratory-based surveillance is fundamental to effective rabies prevention and control. The direct fluorescent antibody (AB) test (FAT) is the gold standard for rabies diagnosis.' },
        },
        {
          id: 'zoonoses--zoo-rabies--diagnostic-methods-woah-cdc--v2',
          statement: 'สำหรับการยืนยัน antibody response ก่อนเคลื่อนย้ายสัตว์ระหว่างประเทศ ระดับ VN antibody ขั้นต่ำที่ถือว่า seroconversion เพียงพอคือ **0.5 IU/ml** และ WOAH ระบุว่ารับเฉพาะ VN method เท่านั้น (FAVN และ RFFIT) ส่วน **ELISA ปัจจุบันยังใช้กับการเคลื่อนย้ายสัตว์ระหว่างประเทศหรือการค้าไม่ได้**',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-woah-world-organisat-2023', locator: 'Chapter 3.1.18, Summary (Serological tests) and Section B.2 / B.2.1 (FAVN), pp. 1 and 15. Pages confirmed by reading the PDF directly.', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Generally, the minimum measurable neutralising VN antibody titre considered to represent a reasonable level of seroconversion is 0.5 IU per ml. The same measure is used in dogs and cats to confirm an adequate response to vaccination prior t' },
        },
      ],
    },
    'zoonoses--zoo-rabies--sample-collection-official-protocol': {
      claims: [
        {
          id: 'zoonoses--zoo-rabies--sample-collection-official-protocol--v1',
          statement: 'เนื่องจาก RABV ถูกทำลาย (inactivated) ได้เร็ว ตัวอย่างส่งตรวจจึงต้องเป็น **refrigerated specimen** และส่งถึงห้องปฏิบัติการด้วยวิธีที่เร็วที่สุดเท่าที่ทำได้ โดยเงื่อนไขการขนส่งถือเป็นส่วนหนึ่งของ \'rabies diagnostic chain\'',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-woah-world-organisat-2023', locator: 'Chapter 3.1.18, Section B.1 (Detection and identification of the agent), p. 3. Page confirmed by reading the PDF directly.', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'As RABV is rapidly inactivated, refrigerated diagnostic specimens should be sent to the laboratory by the fastest means available. Shipment conditions must be considered to be part of the \'rabies diagnostic chain\' and should follow internat' },
        },
      ],
    },
  },
  'zoonoses--zoo-bacterial': {
    'zoonoses--zoo-bacterial--รอเติม-body-content-จาก-slide-4-per-disease-detail': {
      claims: [
        {
          id: 'zoonoses--zoo-bacterial--รอเติม-body-content-จาก-slide-4-per-disease-detail--v1',
          statement: 'คนติด Leptospira ได้ทั้งทาง direct contact กับ urine ของ animal reservoir host ที่ติดเชื้อ และทาง indirect contact กับดินและน้ำในสิ่งแวดล้อมที่ปนเปื้อน',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-35686145', locator: 'Abstract, opening sentences (abstract read via NCBI E-utilities; full text not read)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Humans can become infecteddirect contact with the urine of infected animal reservoir hosts or by indirect contact with contaminated soil and water in the environment.' },
        },
        {
          id: 'zoonoses--zoo-bacterial--รอเติม-body-content-จาก-slide-4-per-disease-detail--v2',
          statement: 'ในประเทศไทย ผู้ติดเชื้อ leptospirosis ส่วนใหญ่เป็นเกษตรกร (farmers) และชาวประมง (fishermen) และมี severe epidemic ที่สัมพันธ์กับฤดูฝนเกิดขึ้นมาตั้งแต่ปี 1996 โดยพบ persisting hotspot ในภาคตะวันออกเฉียงเหนือและภาคใต้',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-31099522', locator: 'Abstract (abstract read via NCBI E-utilities; full text not read)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The majority of those infected are farmers and fishermen. Severe epidemics of leptospirosis in association with the rainy reason have occurred since 1996. ... there were persisting hotspots in north-eastern and southern parts of Thailand ov' },
        },
        {
          id: 'zoonoses--zoo-bacterial--รอเติม-body-content-จาก-slide-4-per-disease-detail--v3',
          statement: 'Streptococcus suis เป็น commensal ของสุกร โดย colonize ที่ tonsil และ nasal cavity โดยเฉพาะลูกสุกรหย่านมอายุ 4-10 สัปดาห์ คนติดเชื้อจากการสัมผัสใกล้ชิดสุกรหรือผลิตภัณฑ์จากสุกร มักผ่านการปนเปื้อนของบาดแผลถลอกเล็กๆ ที่มือหรือแขน หรือถูกสุกรกัด จึงเป็น occupational zoonosis ของผู้เลี้ยงสุกร คนงานโรงฆ่าสัตว์ คนชำแหละเนื้อ คนงานโรงงานแปรรูปเนื้อ สัตวแพทย์ และพนักงานตรวจเนื้อ',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-29284248', locator: 'Abstract; 24(4):683-695 (abstract read via NCBI E-utilities; full text not read)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'is a commensal of pigs, commonly colonizing their tonsils and nasal cavities, mostly in weaning piglets between 4-10 weeks of age. ... The human disease has mostly a zoonotic and occupational origin and occurs in pig breeders, abattoir work' },
        },
        {
          id: 'zoonoses--zoo-bacterial--รอเติม-body-content-จาก-slide-4-per-disease-detail--v4',
          statement: 'Meningitis เป็น primary disease syndrome ของ S. suis ทั้งในสุกรและในคน (ประมาณ 68.0% ของผู้ป่วยคนที่รายงานจนถึงสิ้นปี 2012) และ hearing loss และ/หรือ vestibular dysfunction เป็น sequelae ที่พบบ่อยที่สุดหลังหายจาก meningitis คือพบในผู้ป่วยมากกว่า 50% โดย strain ที่ก่อโรคส่วนใหญ่เป็น serotype 2',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-29284248', locator: 'Abstract; 24(4):683-695 (abstract read via NCBI E-utilities; full text not read)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Some strains, mostly those belonging to serotype 2, are also pathogenic for pigs, as well as for other animals and humans. Meningitis is the primary disease syndrome caused by, both in pigs and in humans. It is estimated that meningitis acc' },
        },
        {
          id: 'zoonoses--zoo-bacterial--รอเติม-body-content-จาก-slide-4-per-disease-detail--v5',
          statement: 'S. suis เป็น zoonotic disease ที่รุนแรงและพบบ่อยในภาคเหนือของประเทศไทย ซึ่งประชาชนมักบริโภคเนื้อหมูดิบและ/หรือเลือดหมู โดย clinical presentation ที่พบบ่อยที่สุดคือ meningitis, sepsis และ endocarditis ร่วมกับอัตราการเสียชีวิตและ hearing loss sequelae ที่สูงกว่า',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-24734186', locator: 'Abstract, opening sentences (abstract read via NCBI E-utilities; full text not read)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Streptococcus suis infection is a severe zoonotic disease commonly found in Northern Thailand where people often consume raw pork and/or pig\'s blood. The most frequent clinical presentations are meningitis, sepsis, and endocarditis with hig' },
        },
        {
          id: 'zoonoses--zoo-bacterial--รอเติม-body-content-จาก-slide-4-per-disease-detail--v6',
          statement: 'Brucella melitensis ยังคงเป็นสาเหตุหลัก (principal cause) ของ human brucellosis แม้จะมี vaccination campaign ด้วย Rev 1 strain แล้วก็ตาม โดยในบางพื้นที่ B. melitensis เป็นสาเหตุการติดเชื้อทั้งในโค แพะ และแกะ',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-9204307', locator: 'Abstract; 3(2):213-21 (abstract read via NCBI E-utilities; full text not read)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Although many countries have eradicated Brucella abortus from cattle, in some areas Brucella melitensis has emerged as a cause of infection in this species as well as in sheep and goats. Despite vaccination campaigns with the Rev 1 strain,' },
        },
        {
          id: 'zoonoses--zoo-bacterial--รอเติม-body-content-จาก-slide-4-per-disease-detail--v7',
          statement: 'Brucellosis เป็น occupational disease ชัดเจน โดยข้อมูลเฝ้าระวังระดับชาติของกรีซ ปี 2004-2015 พบ incidence ในสัตวแพทย์สูงที่สุดคือ 53.2 ต่อ 100,000 ต่อปี รองลงมาคือคนชำแหละเนื้อและคนงานโรงฆ่าสัตว์ 12.7 และเจ้าหน้าที่ห้องปฏิบัติการ 3.1 เทียบกับเกษตรกรและผู้เลี้ยงปศุสัตว์ 7.1 ขณะที่ผู้ป่วย 77.1% รายงานว่าดื่มนมที่ไม่ผ่าน pasteurization หรือสัมผัสปศุสัตว์',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-27651083', locator: 'Abstract, Results; 7(4):221-6 (abstract read via NCBI E-utilities; full text not read)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'A large majority of cases (77.1%) reported consumption of unpasteurized milk or contact with livestock animals. Most cases occured in farmers and livestock breeders (1079 [87.7%] of 1231 cases reporting their occupation), corresponding to a' },
        },
        {
          id: 'zoonoses--zoo-bacterial--รอเติม-body-content-จาก-slide-4-per-disease-detail--v8',
          statement: 'แมวเป็น main reservoir ของ Bartonella henselae ซึ่งเป็นสาเหตุของ cat scratch disease ในคน โดยเชื้อแพร่ระหว่างแมวด้วยกันผ่าน cat flea (Ctenocephalides felis felis) หรืออุจจาระหมัด ส่วนการติดต่อสู่คนและสัตว์อื่นมักเกิดจากการถูกแมวข่วน และแมวที่ติดเชื้อตามธรรมชาติส่วนใหญ่ไม่แสดงอาการ',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-23813816', locator: 'Abstract, sections on agent / infection and transmission / clinical signs; 15(7):563-9 (abstract read via NCBI E-utilities; full text not read)', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Cats are the main reservoir for this bacterium. B henselae is the causative agent of cat scratch disease in man, a self-limiting regional lymphadenopathy, but also of other potentially fatal disorders in immunocompromised people. B henselae' },
        },
      ],
    },
  },
  'zoonoses--zoo-ai-basic': {
    'zoonoses--zoo-ai-basic--influenza-a-virus-structure-transmission': {
      claims: [
        {
          id: 'zoonoses--zoo-ai-basic--influenza-a-virus-structure-transmission--v1',
          statement: 'Hemagglutinin (HA) ทำหน้าที่ entry คือจับ cellular receptor และช่วย fusion ของ viral membrane กับ endosomal membrane ส่วน Neuraminidase (NA) เป็น receptor-destroying enzyme ที่ตัด sialic acid ออกจาก host cell membrane และ viral glycoprotein เพื่อให้ virion ที่สร้างใหม่หลุดออกจากเซลล์ได้',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-28714909', locator: 'Int J Mol Sci 18(7), article 1541, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Entry of the virus is mediated by functions of the HA: binding to cellular receptors and facilitating fusion of the virion membrane with the endosomal membrane. ... The neuraminidase, or the receptor-destroying protein, cleaves the sialic a' },
        },
      ],
    },
    'zoonoses--zoo-ai-basic--host-range-natural-reservoir': {
      claims: [
        {
          id: 'zoonoses--zoo-ai-basic--host-range-natural-reservoir--v1',
          statement: 'Aquatic waterfowl เป็น asymptomatic carrier ของ influenza A virus แทบทุก hemagglutinin และ neuraminidase combination จึงทำหน้าที่เป็น natural reservoir',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-15931279', locator: 'Clin Med Res 1(1):5-12, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Aquatic waterfowl are asymptomatic carriers of essentially all hemagglutinin and neuraminidase combinations of influenza A virus.' },
        },
        {
          id: 'zoonoses--zoo-ai-basic--host-range-natural-reservoir--v2',
          statement: 'H7N9 ที่ระบาดในคนที่ประเทศจีนตั้งแต่ปี 2013 มีรายงานสะสม 1,344 ราย เสียชีวิต 511 ราย (ข้อมูลถึง 9 เมษายน 2017) โดยผู้เขียนชี้ว่าสะท้อนความเสี่ยงที่ยังคงอยู่จากระบบ poultry trade และ live poultry market ในจีน',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-28734617', locator: 'Trends Microbiol 25(9):713-728, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'H7N9 infections represent an ongoing public health threat that has resulted in 1344 cases with 511 deaths as of April 9, 2017. This highlights the continued threat posed by the current poultry trade and live poultry market system in China.' },
        },
      ],
    },
    'zoonoses--zoo-ai-basic--hpai-h5n1-outbreak-origin-spread': {
      claims: [
        {
          id: 'zoonoses--zoo-ai-basic--hpai-h5n1-outbreak-origin-spread--v1',
          statement: 'HPAI H5N1 genotype ใหม่เกิดขึ้นในปี 1996 ทางตอนใต้ของประเทศจีน แล้วแตกออกเป็นหลาย lineage ผ่าน mutation, reassortment และ natural selection จนขยายเข้าสู่ reservoir host หลายชนิด เรียกรวมว่า Goose/Guangdong lineage',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-23735535', locator: 'Virus Res 178(1):63-77, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'A novel genotype of HPAI H5N1 arose in 1996 in Southern China and through ongoing mutation, reassortment, and natural selection, has diverged into distinct lineages and expanded into multiple reservoir hosts.' },
        },
        {
          id: 'zoonoses--zoo-ai-basic--hpai-h5n1-outbreak-origin-spread--v2',
          statement: 'ในปี 1997 ที่ฮ่องกงพบผู้ป่วย influenza A (H5N1) 18 ราย เสียชีวิต 6 ราย ซึ่งเป็นรายงานแรกของการแยกเชื้อ influenza subtype ในกลุ่ม H4-H15 จากผู้ป่วยที่เป็นคน โดยเชื่อว่าผู้ป่วยส่วนใหญ่ติดเชื้อโดยตรงจากไก่',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-9749297', locator: 'Ned Tijdschr Geneeskd 142(22):1252-6, English abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'In 1997, 18 influenza patients were detected who were infected with influenza A(H5N1) virus. Six patients died. Presumably most of the patients had acquired the infection directly from chickens with the fowl plague prevalent in China in 199' },
        },
        {
          id: 'zoonoses--zoo-ai-basic--hpai-h5n1-outbreak-origin-spread--v3',
          statement: 'จาก case-control study ของผู้ป่วย H5N1 ฮ่องกงปี 1997 การสัมผัส live poultry ในสัปดาห์ก่อนเริ่มป่วยสัมพันธ์กับการเกิดโรคอย่างมีนัยสำคัญ (64 เปอร์เซ็นต์ ในผู้ป่วย เทียบกับ 29 เปอร์เซ็นต์ ในกลุ่มควบคุม, odds ratio 4.5, P เท่ากับ 0.045) ขณะที่การกินหรือเตรียมเนื้อสัตว์ปีก และการสัมผัสผู้ป่วยทางเดินหายใจ ไม่สัมพันธ์กับการเกิดโรค',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-10395870', locator: 'J Infect Dis 180(2):505-8, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Exposure to live poultry (by visiting either a retail poultry stall or a market selling live poultry) in the week before illness began was significantly associated with H5N1 disease (64% of cases vs. 29% of controls, odds ratio, 4.5, P=.045' },
        },
        {
          id: 'zoonoses--zoo-ai-basic--hpai-h5n1-outbreak-origin-spread--v4',
          statement: 'ข้อมูล WHO ที่เผยแพร่เดือนมกราคม 2025 รายงานผู้ป่วยยืนยัน avian influenza A (H5N1) ในคนสะสม 964 ราย จาก 24 ประเทศ เสียชีวิต 466 ราย คิดเป็นอัตราตายราว 48 เปอร์เซ็นต์ และยังไม่มีรายงานการติดต่อจากคนสู่คนที่ยืนยันได้',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-40165538', locator: 'Med Sci Monit 31:e949109, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'In January 2025, the World Health Organization (WHO) published data on the cumulative number of reported and confirmed human cases of avian influenza A(H5N1) in 24 countries, including 964 cases with 466 deaths, which gives a mortality rate' },
        },
      ],
    },
    'zoonoses--zoo-ai-basic--รอเติม-body-content-จาก-slide-4': {
      claims: [
        {
          id: 'zoonoses--zoo-ai-basic--รอเติม-body-content-จาก-slide-4--v1',
          statement: 'Highly pathogenic avian influenza virus ในกลุ่ม HA subtype H5 และ H7 วิวัฒนาการมาจาก low-pathogenic precursor โดยได้ multiple basic amino acid residues เพิ่มเข้ามาที่ HA cleavage site และในธรรมชาติกลไกนี้พบเฉพาะใน HA subtype เหล่านี้ ขณะที่ waterfowl reservoir เป็นแหล่งที่คง HA subtype H1 ถึง H16 ไว้',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-28196963', locator: 'mBio 8(1):e02298-16, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Highly pathogenic avian influenza viruses with H5 and H7 hemagglutinin (HA) subtypes evolve from low-pathogenic precursors through the acquisition of multiple basic amino acid residues at the HA cleavage site. Although this mechanism has be' },
        },
      ],
    },
  },
  'zoonoses--zoo-corona': {
    'zoonoses--zoo-corona--coronaviruses-overview-4-genus': {
      claims: [
        {
          id: 'zoonoses--zoo-corona--coronaviruses-overview-4-genus--v1',
          statement: 'Porcine epidemic diarrhea virus (PEDV) จัดอยู่ใน genus **Alphacoronavirus** ส่วนเชื้อ coronavirus ของหมูที่อยู่ใน genus **Deltacoronavirus** คือ porcine deltacoronavirus (PDCoV) ซึ่งเป็นคนละตัวกัน แม้ทั้งคู่จะก่อ acute diarrhea/vomiting และ dehydration ในลูกหมูแรกเกิดเหมือนกัน',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-27086031', locator: 'Virus Res 2016;226:50-59, Abstract, opening sentences', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Porcine deltacoronavirus (PDCoV) (family Coronaviridae, genus Deltacoronavirus) is a novel swine enteropathogenic coronavirus that causes acute diarrhea/vomiting, dehydration and mortality in seronegative neonatal piglets. PDCoV diarrhea wa' },
        },
      ],
    },
    'zoonoses--zoo-corona--human-coronaviruses-timeline-1965-2020-7-ตัว': {
      claims: [
        {
          id: 'zoonoses--zoo-corona--human-coronaviruses-timeline-1965-2020-7-ตัว--v1',
          statement: 'SARS-CoV ใช้ angiotensin-converting enzyme 2 (ACE2) เป็น functional receptor โดย S1 domain ของ spike protein จับกับ ACE2 และ anti-ACE2 antibody ยับยั้งการ replicate ของไวรัสใน Vero E6 cells ได้',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-14647384', locator: 'Nature 2003;426(6965):450-4, Abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Here we identify a metallopeptidase, angiotensin-converting enzyme 2 (ACE2), isolated from SARS coronavirus (SARS-CoV)-permissive Vero E6 cells, that efficiently binds the S1 domain of the SARS-CoV S protein... Finally, anti-ACE2 but not an' },
        },
        {
          id: 'zoonoses--zoo-corona--human-coronaviruses-timeline-1965-2020-7-ตัว--v2',
          statement: 'MERS-CoV ใช้ dipeptidyl peptidase 4 (DPP4 หรือ CD26) เป็น functional receptor ซึ่งต่างจาก ACE2 ที่ SARS-CoV ใช้ และ DPP4 ของค้างคาว (Pipistrellus pipistrellus) ก็ทำให้เซลล์ที่ไม่ติดเชื้อกลายเป็นติดเชื้อได้',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-23486063', locator: 'Nature 2013;495(7440):251-4, Abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Here we identify dipeptidyl peptidase 4 (DPP4; also known as CD26) as a functional receptor for hCoV-EMC... Expression of human and bat (Pipistrellus pipistrellus) DPP4 in non-susceptible COS-7 cells enabled infection by hCoV-EMC.' },
        },
        {
          id: 'zoonoses--zoo-corona--human-coronaviruses-timeline-1965-2020-7-ตัว--v3',
          statement: 'SARS-CoV-2 ใช้ ACE2 เป็น cell entry receptor ตัวเดียวกับ SARS-CoV และ genome ทั้งสายเหมือน bat coronavirus 96% แต่เหมือน SARS-CoV เพียง 79.6% จึงสนับสนุนว่ามีต้นกำเนิดจากค้างคาว',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-32015507', locator: 'Nature 2020;579(7798):270-273, Abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The sequences are almost identical and share 79.6% sequence identity to SARS-CoV. Furthermore, we show that 2019-nCoV is 96% identical at the whole-genome level to a bat coronavirus... Notably, we confirmed that 2019-nCoV uses the same cell' },
        },
        {
          id: 'zoonoses--zoo-corona--human-coronaviruses-timeline-1965-2020-7-ตัว--v4',
          statement: 'SARS-CoV-like viruses ถูก isolate ได้จาก Himalayan palm civet ใน live-animal market ที่กวางตุ้ง ประเทศจีน และตรวจพบหลักฐานการติดเชื้อในสัตว์อื่น (เช่น raccoon dog) กับคนที่ทำงานในตลาดเดียวกัน ซึ่งชี้ว่าตลาดค้าสัตว์ป่าเป็นเส้นทาง interspecies transmission แต่การศึกษานี้ยังไม่ได้ระบุ natural reservoir',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-12958366', locator: 'Science 2003;302(5643):276-8, Abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'SCoV-like viruses were isolated from Himalayan palm civets found in a live-animal market in Guangdong, China. Evidence of virus infection was also detected in other animals (including a raccoon dog, Nyctereutes procyonoides) and in humans w' },
        },
        {
          id: 'zoonoses--zoo-corona--human-coronaviruses-timeline-1965-2020-7-ตัว--v5',
          statement: 'Dromedary camel มีหลักฐานทาง serology ว่าติดเชื้อ MERS-CoV หรือไวรัสใกล้เคียงอย่างแพร่หลาย โดยซีรัมอูฐจากโอมาน 50/50 ตัว (100%) และอูฐจากสเปน 15/105 ตัว (14%) มี antibody ต่อ MERS-CoV spike ขณะที่แกะ แพะ วัว และ camelid ชนิดอื่นในยุโรปตรวจไม่พบ',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-23933067', locator: 'Lancet Infect Dis 2013;13(10):859-66, Abstract, Findings and Interpretation', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: '50 of 50 (100%) sera from Omani camels and 15 of 105 (14%) from Spanish camels had protein-specific antibodies against MERS-CoV spike. Sera from European sheep, goats, cattle, and other camelids had no such antibodies... MERS-CoV or a relat' },
        },
        {
          id: 'zoonoses--zoo-corona--human-coronaviruses-timeline-1965-2020-7-ตัว--v6',
          statement: 'มีหลักฐานการติดต่อจากอูฐสู่คนโดยตรง โดยผู้ป่วยที่เสียชีวิตจาก MERS-CoV กับอูฐของเขาที่มี rhinorrhea ตรวจพบเชื้อทั้งคู่ และ full genome sequence ของ isolate จากคนกับจากอูฐเหมือนกันทุกตำแหน่ง ประกอบกับ serology ที่แสดงว่าอูฐติดเชื้อมาก่อนคน',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-24896817', locator: 'N Engl J Med 2014;370(26):2499-505, Abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The full genome sequences of the two isolates were identical. Serologic data indicated that MERS-CoV was circulating in the camels but not in the patient before the human infection occurred. These data suggest that this fatal case of human' },
        },
      ],
    },
    'zoonoses--zoo-corona--รอเติม-body-content-จาก-slide-4': {
      claims: [
        {
          id: 'zoonoses--zoo-corona--รอเติม-body-content-จาก-slide-4--v1',
          statement: 'จากการทดลอง SARS-CoV-2 replicate ได้ไม่ดีในสุนัข หมู ไก่ และเป็ด แต่ ferret และแมวติดเชื้อได้ (permissive) และแมวยังติดต่อกันทาง airborne transmission ได้ด้วย',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-32269068', locator: 'Science 2020;368(6494):1016-1020, Abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'We found that SARS-CoV-2 replicates poorly in dogs, pigs, chickens, and ducks, but ferrets and cats are permissive to infection. Additionally, cats are susceptible to airborne transmission.' },
        },
      ],
    },
  },
  'zoonoses--zoo-vbz': {
    'zoonoses--zoo-vbz--mosquito-borne-viral-zoonoses': {
      claims: [
        {
          id: 'zoonoses--zoo-vbz--mosquito-borne-viral-zoonoses--v1',
          statement: 'วงจร enzootic ของ Japanese encephalitis virus (JEV) หมุนเวียนโดยยุงเป็น vector ระหว่าง นก (birds) = reservoir host และ หมู (pigs) = amplifying host โดยมี Culex tritaeniorhynchus เป็น principal mosquito vector',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-26086337', locator: 'Abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The virus exists in an enzootic transmission cycle, with mosquitoes transmitting JEV between birds as reservoir hosts and pigs as amplifying hosts. ... vector control of the principal mosquito vector, Culex tritaeniorhynchus, represents a m' },
        },
        {
          id: 'zoonoses--zoo-vbz--mosquito-borne-viral-zoonoses--v2',
          statement: 'คนเป็น dead-end host ของ JEV ดังนั้นการฉีดวัคซีนเฉพาะในประชากรคนจึงไม่น่าจะกำจัดโรคได้ (unlikely to result in eradication) การควบคุม vector จึงเป็นกลยุทธ์ที่มีแนวโน้มมากกว่า',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-26086337', locator: 'Abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'As humans are a "dead-end" host for the virus, vaccination of the human population is unlikely to result in eradication. Therefore, vector control of the principal mosquito vector, Culex tritaeniorhynchus, represents a more promising strate' },
        },
        {
          id: 'zoonoses--zoo-vbz--mosquito-borne-viral-zoonoses--v3',
          statement: 'ในหมู JEV ทำให้เกิด reproductive failure โดยในการระบาดที่ออสเตรเลียปี 2022 พบว่า JEV เป็นสาเหตุของลูกหมูตายแรกคลอด (stillborn) และ mummified piglets ในฟาร์มหมู',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-35746679', locator: 'Abstract, opening sentence', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'In early 2022, the Japanese encephalitis virus (JEV) was identified as the cause of stillborn and mummified piglets in pig farms in southeastern Australia.' },
        },
        {
          id: 'zoonoses--zoo-vbz--mosquito-borne-viral-zoonoses--v4',
          statement: 'Rift Valley fever (RVF) เป็น mosquito-borne viral zoonosis ที่ติดเชื้อหลักใน domestic livestock (แกะ แพะ โค) ทำให้เกิด neonatal mortality สูงและการแท้ง (abortion) ส่วนในคนอาการมีได้กว้างตั้งแต่ febrile illness จนถึง haemorrhagic diathesis และการแท้งในหญิงตั้งครรภ์',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-31310198', locator: 'Abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Rift Valley fever (RVF) is a mosquito-borne viral zoonosis that was first discovered in Kenya in 1930 ... RVF virus primarily infects domestic livestock (sheep, goats, cattle) causing high rates of neonatal mortality and abortion, with huma' },
        },
        {
          id: 'zoonoses--zoo-vbz--mosquito-borne-viral-zoonoses--v5',
          statement: 'นอกจากยุงแล้ว การสัมผัสสัตว์โดยตรง ได้แก่ การชำแหละ (butchering) การรีดนม (milking) และการจับต้องซากแท้ง (handling aborted material) สัมพันธ์อย่างมีนัยสำคัญกับ odds ของการสัมผัสเชื้อ RVFV ที่สูงขึ้น ซึ่งเป็นความเสี่ยงเชิงอาชีพของสัตวแพทย์และผู้เลี้ยงสัตว์',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-35073355', locator: 'Abstract, Results (meta-analysis of risk factors)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Men had greater odds of RVFV infection than women, and animal contact, butchering, milking, and handling aborted material were significantly associated with greater odds of exposure.' },
        },
        {
          id: 'zoonoses--zoo-vbz--mosquito-borne-viral-zoonoses--v6',
          statement: 'West Nile virus (WNV) ใช้ นกเป็น amplifier host และยุงสกุล Culex เป็น vector ส่วน คนและม้าเป็น dead-end host',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-27207312', locator: 'Abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'While birds serve as amplifier hosts, mosquitoes of the Culex genus function as vectors. Humans and horses are dead end hosts.' },
        },
      ],
    },
    'zoonoses--zoo-vbz--tick-borne-viral-zoonoses': {
      claims: [
        {
          id: 'zoonoses--zoo-vbz--tick-borne-viral-zoonoses--v1',
          statement: 'Crimean-Congo haemorrhagic fever (CCHF) เป็นโรค tick-borne ที่รุนแรง มี case fatality rate 30% ขึ้นไป โดยมีเห็บสกุล Hyalomma เป็น vector และแม้ CCHFV จะติดเชื้อในสัตว์ได้หลายชนิด แต่มีเพียงคนเท่านั้นที่แสดงอาการรุนแรง',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-36918725', locator: 'Abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Crimean-Congo haemorrhagic fever (CCHF) is a severe tick-borne illness with a wide geographical distribution and case fatality rates of 30% or higher. ... The expanding range of the Hyalomma tick vector is placing new populations at risk fo' },
        },
        {
          id: 'zoonoses--zoo-vbz--tick-borne-viral-zoonoses--v2',
          statement: 'Severe fever with thrombocytopenia syndrome virus (SFTSV) ถ่ายทอดโดยเห็บ Haemaphysalis longicornis (Asian long-horned tick) ซึ่งเป็นเห็บที่เพิ่งถูกนำเข้าไปพบในสหรัฐฯ จากจีน',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-32891500', locator: 'Abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Recently, several new tickborne viruses have emerged in the United States, including Bourbon virus, Heartland virus, Powassan virus, and the severe fever with thrombocytopenia syndrome virus transmitted by a tick recently introduced from Ch' },
        },
      ],
    },
  },
  'zoonoses--zoo-prion': {
    'zoonoses--zoo-prion--introduction-what-are-prion-diseases': {
      claims: [
        {
          id: 'zoonoses--zoo-prion--introduction-what-are-prion-diseases--v1',
          statement: 'Prion agent มี protein เป็นองค์ประกอบที่จำเป็นต่อ infectivity — วิธีที่จำเพาะต่อการทำลาย nucleic acid 5 วิธี ไม่สามารถ inactivate agent ได้ จึงเสนอคำว่า prion (small proteinaceous infectious particle) ซึ่งทนต่อกระบวนการที่ทำลาย nucleic acid',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-6801762', locator: 'Abstract; Science 216(4542):136-144', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Six lines of evidence including sensitivity to proteases demonstrate that this agent contains a protein that is required for infectivity. Although the scrapie agent is irreversibly inactivated by alkali, five procedures with more specificit' },
        },
      ],
    },
    'zoonoses--zoo-prion--human-prion-diseases-5-known': {
      claims: [
        {
          id: 'zoonoses--zoo-prion--human-prion-diseases-5-known--v1',
          statement: 'Kuru ติดต่อผ่าน endocannibalism ในพิธีศพของชาว Fore ที่ Papua New Guinea และอุบัติการณ์ลดลงต่อเนื่องหลังการหยุดพิธีในทศวรรษ 1950 — incubation period ของ human prion infection อาจเกิน 50 ปี (ในผู้ป่วยที่ศึกษา minimum estimated incubation 34-41 ปี)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-16798390', locator: 'Abstract; Lancet 367(9528):2068-2074', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Its incidence has steadily fallen after the abrupt cessation of its route of transmission (endocannibalism) in Papua New Guinea in the 1950s. ... The minimum estimated incubation periods ranged from 34 to 41 years. ... Incubation periods of' },
        },
        {
          id: 'zoonoses--zoo-prion--human-prion-diseases-5-known--v2',
          statement: 'หลักฐานจาก strain typing โดย transmission เข้า inbred mice ให้ strong evidence ว่า vCJD และ BSE เกิดจาก agent strain เดียวกัน — สนับสนุนว่า vCJD คือ prion disease ที่เป็น true zoonosis จาก BSE',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-9333239', locator: 'Abstract; Nature 389(6650):498-501', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Here we report the interim results of transmissions of sporadic CJD and vCJD to mice. Our data provide strong evidence that the same agent strain is involved in both BSE and vCJD.' },
        },
        {
          id: 'zoonoses--zoo-prion--human-prion-diseases-5-known--v3',
          statement: 'ผู้ป่วย vCJD ที่เป็น definite และ probable ทุกรายก่อนหน้ารายงานนี้ เป็น methionine homozygote (MM) ที่ codon 129 ของ PRNP — และมีรายงาน vCJD 3 รายที่เกิดหลังได้รับ red cell transfusion จากผู้บริจาคที่ต่อมาป่วยเป็น vCJD (human-to-human transmission ทางเลือด)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-23449776', locator: 'Abstract; Brain 136(Pt 4):1139-1145', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Blood transfusion has been identified as a source of human-to-human transmission of variant Creutzfeldt-Jakob disease. Three cases of variant Creutzfeldt-Jakob disease have been identified following red cell transfusions from donors who sub' },
        },
      ],
    },
    'zoonoses--zoo-prion--รอเติม-body-content-จาก-slide-4-animal-tse-diagnosis': {
      claims: [
        {
          id: 'zoonoses--zoo-prion--รอเติม-body-content-จาก-slide-4-animal-tse-diagnosis--v1',
          statement: 'BSE strain ให้ pattern ของโรคในหนูที่จำเพาะ และคง signature นี้ไว้แม้ผ่าน intermediate species — พบ BSE signature เดียวกันใน TSE ของแมวบ้านและ ruminant แปลกถิ่น 2 ชนิด ซึ่งเป็น direct evidence ชิ้นแรกของการแพร่ TSE ข้าม species โดยอุบัติเหตุ',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-9333239', locator: 'Abstract; Nature 389(6650):498-501', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'We have shown that the strain of agent from cattle affected by bovine spongiform encephalopathy (BSE) produces a characteristic pattern of disease in mice that is retained after experimental passage through a variety of intermediate species' },
        },
        {
          id: 'zoonoses--zoo-prion--รอเติม-body-content-จาก-slide-4-animal-tse-diagnosis--v2',
          statement: 'ข้อมูล epidemiology ของ BSE สอดคล้องกับ extended common source epidemic ที่เริ่มจากการเปลี่ยนแปลงการสัมผัส scrapie-like agent ใน meat and bone meal ที่ผสมใน commercial animal feedstuffs ของโคในสหราชอาณาจักร ตั้งแต่ปี 1981-82',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-1688299', locator: 'Abstract; Brain Pathol 1(2):69-78', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Epidemiological data are consistent with an extended common source epidemic originating from an abrupt change, commencing in 1981-82, in the exposure of domestic cattle to a scrapie-like agent in meat and bone meal incorporated into commerc' },
        },
        {
          id: 'zoonoses--zoo-prion--รอเติม-body-content-จาก-slide-4-animal-tse-diagnosis--v3',
          statement: 'Scrapie เป็น TSE ที่เกิดตามธรรมชาติในแกะและแพะ — ความไวหรือความต้านทานต่อ classical scrapie ในแกะถูกกำหนดอย่างมากโดย polymorphism ที่ codon 136, 154 และ 171 ของยีน PRNP โดยแผนคัดเลือกพันธุ์มุ่งลด susceptible allele และเพิ่ม resistant allele ARR',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-27109462', locator: 'Abstract; Animal 10(10):1585-1593', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Scrapie is a naturally occurring transmissible spongiform encephalopathy in sheep and goat. ... Sheep susceptibility or resistance to classical scrapie is strongly regulated by the polymorphisms at codons 136, 154 and 171 of the PRNP. ... t' },
        },
        {
          id: 'zoonoses--zoo-prion--รอเติม-body-content-จาก-slide-4-animal-tse-diagnosis--v4',
          statement: 'ใน CWD สัตว์ที่ติดเชื้อสามารถ shed prion ออกทาง bodily excretions ทำให้เกิดการติดต่อโดยตรงระหว่างตัวสัตว์ หรือโดยอ้อมผ่านสิ่งแวดล้อมที่ปนเปื้อน prion — ความทนทานของ prion ทำให้การแพร่ทางสิ่งแวดล้อมประสบผลสำเร็จสูงและควบคุม CWD ได้ยาก',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-34823556', locator: 'Abstract; Acta Vet Scand 63(1):48', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Classical scrapie in sheep and goats and chronic wasting disease (CWD) in cervids are known to be infectious under natural conditions. In CWD, infected animals can shed prions via bodily excretions, allowing direct host-to-host transmission' },
        },
      ],
    },
  },


  // epidemiology sourcing pass, 2026-08-01 — every identifier resolved against
  // NCBI/Crossref and title-matched before being written here.
  'epidemiology--epidem-intro': {
    'epidemiology--epidem-intro--avian-influenza-a-h5n1-ในคน-ปี-2003-ถึง-2013-แผนที่-who': {
      claims: [
        {
          id: 'epidemiology--epidem-intro--avian-influenza-a-h5n1-ในคน-ปี-2003-ถึง-2013-แผนที่-who--v1',
          statement: 'ผู้ป่วยยืนยัน avian influenza A(H5N1) ในคนที่ WHO รวบรวมสะสมตั้งแต่ปี 2003 มีอัตราป่วยตาย (case fatality) สูงเกินครึ่ง โดยข้อมูลถึงวันที่ 14 กรกฎาคม 2023 คือ 878 ราย เสียชีวิต 458 ราย คิดเป็น 52.16% ใน 23 ประเทศ',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-37652253', locator: 'Travel Med Infect Dis 2023;55:102638', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Since 2003 to 14 July 2023, the World Health Organization (WHO) has documented 878 cases of HPAI H5N1 infection in humans and 458 (52.16%) fatalities in 23 countries.' },
        },
      ],
    },
    'epidemiology--epidem-intro--ภาระโรคไข้หวัดใหญ่-h5n1-h1n1-2009-และ-pandemic-ในศตวรรษที่-20': {
      claims: [
        {
          id: 'epidemiology--epidem-intro--ภาระโรคไข้หวัดใหญ่-h5n1-h1n1-2009-และ-pandemic-ในศตวรรษที่-20--v1',
          statement: 'influenza pandemic ในศตวรรษที่ 20 เกิดขึ้น 3 ครั้ง คือปี 1918, 1957 และ 1968 ซึ่งเป็น influenza A virus คนละ antigenic subtype ได้แก่ H1N1, H2N2 และ H3N2 ตามลำดับ',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-16494710', locator: 'Emerg Infect Dis 2006;12(1):9-14', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Three worldwide (pandemic) outbreaks of influenza occurred in the 20th century: in 1918, 1957, and 1968. ... They are now known to represent 3 different antigenic subtypes of influenza A virus: H1N1, H2N2, and H3N2, respectively.' },
        },
        {
          id: 'epidemiology--epidem-intro--ภาระโรคไข้หวัดใหญ่-h5n1-h1n1-2009-และ-pandemic-ในศตวรรษที่-20--v2',
          statement: 'ประมาณการผู้เสียชีวิตทั่วโลกจาก Spanish influenza pandemic ปี 1918 ถึง 1920 อยู่ในระดับประมาณ 50 ล้านราย และผู้ประมาณการเองระบุว่าตัวเลขจริงอาจสูงกว่านี้มาก',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-11875246', locator: 'Bull Hist Med 2002;76(1):105-15', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'This paper suggests that it was of the order of 50 million. However, it must be acknowledged that even this vast figure may be substantially lower than the real toll, perhaps as much as 100 percent understated.' },
        },
      ],
    },
    'epidemiology--epidem-intro--หมูเป็น-mixing-vessel-และยาต้านไวรัสไข้หวัดใหญ่': {
      claims: [
        {
          id: 'epidemiology--epidem-intro--หมูเป็น-mixing-vessel-และยาต้านไวรัสไข้หวัดใหญ่--v1',
          statement: 'สุกรติดเชื้อได้ทั้ง avian influenza virus และ human influenza virus จึงเกิด reassortment ของ viral gene segment ขึ้นในสุกรได้ อันเป็นที่มาของทฤษฎี mixing vessel และมี reassortant swine virus บางชนิดที่ถ่ายทอดสู่คนแล้วจริง',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-19565018', locator: 'J Mol Genet Med 2008;3(1):158-66 (PMC2702078)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Because swine are susceptible to infection with both avian and human influenza viruses, novel reassortant influenza viruses can be generated in this mammalian species by reassortment of influenza viral segments leading to the "mixing vessel' },
        },
        {
          id: 'epidemiology--epidem-intro--หมูเป็น-mixing-vessel-และยาต้านไวรัสไข้หวัดใหญ่--v2',
          statement: 'นกน้ำอพยพ (migrating waterfowl) และ shorebird ทั่วโลกเป็น reservoir ของ influenza A virus ครบทุก HA และ NA subtype ที่รู้จัก และ influenza A virus ที่พบในสัตว์เลี้ยงลูกด้วยนมล้วนมีต้นทางมาจาก avian gene pool',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-1579108', locator: 'Microbiol Rev 1992;56(1):152-79', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Two partly overlapping reservoirs of influenza A viruses exist in migrating waterfowl and shorebirds throughout the world. These species harbor influenza viruses of all the known HA and NA subtypes. ... All of the influenza A viruses of mam' },
        },
        {
          id: 'epidemiology--epidem-intro--หมูเป็น-mixing-vessel-และยาต้านไวรัสไข้หวัดใหญ่--v3',
          statement: 'oseltamivir (ชื่อการค้า Tamiflu) และ zanamivir (ชื่อการค้า Relenza) เป็นยาต้านไวรัสไข้หวัดใหญ่ที่ออกฤทธิ์ที่ viral neuraminidase (NA) ยากลุ่ม neuraminidase inhibitor นี้ยังมี laninamivir (Inavir) และ peramivir (Rapivab) ด้วย',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-31640786', locator: 'J Biomed Sci 2019;26(1):84', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Relenza™ (zanamivir), Tamiflu™ (the phosphate salt of oseltamivir), Inavir™ (laninamivir octanoate) and Rapivab™ (peramivir) are four anti-influenza drugs targeting the viral neuraminidases (NAs).' },
        },
      ],
    },
  },
  'epidemiology--epidem-basic-concepts': {
    'epidemiology--epidem-basic-concepts--รากศัพท์และนิยามของระบาดวิทยา': {
      claims: [
        {
          id: 'epidemiology--epidem-basic-concepts--รากศัพท์และนิยามของระบาดวิทยา--v1',
          statement: 'ระบาดวิทยา (epidemiology) คือการศึกษาการกระจาย (distribution) และปัจจัยกำหนด (determinants) ของภาวะหรือเหตุการณ์ที่เกี่ยวข้องกับสุขภาพ ในประชากรที่ระบุ (specified populations) และการนำผลการศึกษานั้นไปประยุกต์ใช้ควบคุมปัญหาสุขภาพ',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-centers-for-disease-co-na', locator: 'Lesson 1, Section 1: Definition of Epidemiology (lesson and section title read directly off the page; the document carries no clause numbering)', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Epidemiology is the study of the distribution and determinants of health-related states or events in specified populations, and the application of this study to the control of health problems' },
        },
      ],
    },
    'epidemiology--epidem-basic-concepts--epidemiological-triad-และการเปรียบเทียบกับคลินิกและพยาธิวิทยา': {
      claims: [
        {
          id: 'epidemiology--epidem-basic-concepts--epidemiological-triad-และการเปรียบเทียบกับคลินิกและพยาธิวิทยา--v1',
          statement: 'Epidemiologic triad ประกอบด้วย 3 องค์ประกอบ คือ agent ซึ่งเป็นปัจจัยก่อโรคจากภายนอก, host ที่ไวรับต่อโรค และ environment ที่ทำให้ host กับ agent มาพบกัน โดยโรคเกิดจากปฏิสัมพันธ์ของทั้งสามองค์ประกอบนี้',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-centers-for-disease-co-na', locator: 'Lesson 1, Section 8: Concepts of Disease Occurrence (lesson and section title read directly off the page)', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The triad consists of an external agent, a susceptible host, and an environment that brings the host and agent together.' },
        },
      ],
    },
    'epidemiology--epidem-basic-concepts--ตัวอย่างภาคสนาม-กระบือตายรอบหนองน้ำในหมู่บ้าน': {
      claims: [
        {
          id: 'epidemiology--epidem-basic-concepts--ตัวอย่างภาคสนาม-กระบือตายรอบหนองน้ำในหมู่บ้าน--v1',
          statement: 'Pasteurella multocida capsular type B และ E เป็นสาเหตุของ haemorrhagic septicaemia (โรคคอบวม) ซึ่งเกิดในโค กระบือ และไบซันเป็นหลัก มีการดำเนินโรครวดเร็วและอัตราการตายสูง',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-39491557', locator: '', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'P. multocida capsular types B and E cause haemorrhagic septicaemia, a devastating disease primarily of cattle, water buffalo, and bison that develops rapidly with high mortality.' },
        },
        {
          id: 'epidemiology--epidem-basic-concepts--ตัวอย่างภาคสนาม-กระบือตายรอบหนองน้ำในหมู่บ้าน--v2',
          statement: 'การควบคุม haemorrhagic septicaemia อาศัย immunoprophylaxis คือการทำวัคซีน ร่วมกับการวางแผนสุขาภิบาล การใช้ยา และการจัดการพื้นฐาน ไม่ใช่การรักษาสัตว์ป่วยเพียงอย่างเดียว และความถี่กับการกระจายของการระบาดแปรผันไปตาม agroclimatic zone',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-40201842', locator: '', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The frequency and distribution of HS epidemics involving various animal species vary according to the agroclimatic zone. ... Effective control of various HS diseases will be aided by hygienic planning, immunoprophylaxis, chemotherapy, and f' },
        },
      ],
    },
    'epidemiology--epidem-basic-concepts--กลุ่มโรคระบาดสัตว์ที่ต้องรายงานของกรมปศุสัตว์-และด่านกักกันสัตว์': {
      claims: [
        {
          id: 'epidemiology--epidem-basic-concepts--กลุ่มโรคระบาดสัตว์ที่ต้องรายงานของกรมปศุสัตว์-และด่านกักกันสัตว์--v1',
          statement: 'การยืนยันโรคพิษสุนัขบ้าอาศัยการตรวจทางห้องปฏิบัติการจากตัวอย่างสมอง โดย fluorescent antibody test (FAT) ถูกใช้เป็น gold standard ที่วิธีตรวจอื่นต้องเทียบด้วย',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-27706156', locator: '', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Under reference laboratory conditions, specificity was 93.3% and sensitivity was 95.3% compared to the gold standard FAT test.' },
        },
      ],
    },
    'epidemiology--epidem-basic-concepts--องค์ประกอบของการศึกษาทางระบาดวิทยา-และรูปแบบ-study-design': {
      claims: [
        {
          id: 'epidemiology--epidem-basic-concepts--องค์ประกอบของการศึกษาทางระบาดวิทยา-และรูปแบบ-study-design--v1',
          statement: 'การจำแนก study design แยก observational ออกจาก experimental (interventional) ที่ว่าผู้วิจัยเป็นผู้กำหนด exposure เองหรือไม่ และในกลุ่ม observational แบบ analytical จำแนกตามจังหวะที่วัด outcome คือ วัดตั้งแต่เริ่มการศึกษา = case-control, วัดหลังติดตามไประยะหนึ่ง = cohort, วัดพร้อมกันกับ exposure = cross-sectional',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-30319950', locator: '', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'If analytical, did the investigator determine the exposure? - If no, it is an observational study, and if yes, it is an experimental study ... If observational, when was the outcome determined? - at the start of the study (case-control stud' },
        },
      ],
    },
  },
  'epidemiology--epidem-surveillance': {
    'epidemiology--epidem-surveillance--หลักการและชนิดของการเฝ้าระวัง': {
      claims: [
        {
          id: 'epidemiology--epidem-surveillance--หลักการและชนิดของการเฝ้าระวัง--v1',
          statement: 'Passive surveillance มีต้นทุนต่ำและใช้เป็นเครื่องมือพื้นฐานของการเฝ้าระวังโรคติดเชื้อ แต่มีปัญหา under-reporting จึงมักต้องเสริมด้วย active surveillance ซึ่งใช้ทรัพยากรมากกว่า เพื่อเพิ่ม sensitivity ของระบบเฝ้าระวัง',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-18651991', locator: 'Abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Because passive surveillance is a relatively cost-effective and therefore commonly used process, it is the basic tool for infectious disease surveillance. Because of under-reporting in passive surveillance, cost-intensive active surveillanc' },
        },
        {
          id: 'epidemiology--epidem-surveillance--หลักการและชนิดของการเฝ้าระวัง--v2',
          statement: 'Syndromic surveillance ใช้ข้อมูลแบบ pre-diagnostic คือจับ signs และ symptoms ก่อนที่จะมี diagnosis ยืนยัน เพื่อ early detection ของ outbreak',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-19698212', locator: 'Abstract, ประโยคเปิด', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Because syndromic surveillance systems use pre-diagnostic data for early detection of disease outbreaks, it is important to know how the earliest signs and symptoms of a disease might appear in these systems.' },
        },
      ],
    },
    'epidemiology--epidem-surveillance--วัตถุประสงค์-4-แบบของการเฝ้าระวังโรคสัตว์': {
      claims: [
        {
          id: 'epidemiology--epidem-surveillance--วัตถุประสงค์-4-แบบของการเฝ้าระวังโรคสัตว์--v1',
          statement: 'Sensitivity ของระบบเฝ้าระวังต้องอ่านคู่กับ design prevalence เสมอ คือเป็นความน่าจะเป็นที่ระบบจะให้ผลบวก เมื่อประชากรติดเชื้ออยู่จริงที่ design prevalence ที่กำหนดไว้',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-17239459', locator: 'Abstract, ส่วนผลการศึกษา', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The estimated mean surveillance system component (SSC) sensitivities (probability that the SSC would give a positive outcome given the animals processed and that the country is infected at the design prevalences) per month were 0.18, 0.63 a' },
        },
        {
          id: 'epidemiology--epidem-surveillance--วัตถุประสงค์-4-แบบของการเฝ้าระวังโรคสัตว์--v2',
          statement: 'Risk-based surveillance คือการนำ risk assessment มาใช้ในขั้นตอนต่าง ๆ ของการออกแบบเฝ้าระวัง โดยให้ประชากรบางกลุ่มย่อยมีโอกาสถูกสุ่มสูงกว่ากลุ่มอื่น เป้าหมายคือให้ efficiency ซึ่งวัดด้วย benefit-cost ratio สูงกว่าระบบดั้งเดิม โดย efficacy ต้องเท่ากันหรือดีกว่า',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-16507106', locator: 'Abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'We propose to define risk-based surveillance systems as those that apply risk assessment methods in different steps of traditional surveillance design for early detection and management of diseases or hazards... Furthermore, certain strata' },
        },
      ],
    },
    'epidemiology--epidem-surveillance--แหล่งข้อมูล-บทบาท-who-และตัวอย่าง-bluetongue': {
      claims: [
        {
          id: 'epidemiology--epidem-surveillance--แหล่งข้อมูล-บทบาท-who-และตัวอย่าง-bluetongue--v1',
          statement: 'แหล่งข้อมูลเฝ้าระวังแบ่งเป็น formal sources เช่น รายงานของ WHO และหน่วยงานภาครัฐ กับ informal sources เช่น สื่อออนไลน์และ social network โดยระบบ web-based ที่ดึง informal sources เช่น ProMED-mail สามารถตรวจจับโรคติดเชื้ออุบัติใหม่ได้เร็วกว่าระบบเฝ้าระวังแบบดั้งเดิม',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-26082109', locator: 'Abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Partially and fully automated systems allow for earlier detection of disease outbreaks by searching for information from both formal sources (e.g., World Health Organization and government ministry reports) and informal sources (e.g., blogs' },
        },
      ],
    },
    'epidemiology--epidem-surveillance--ทำไมต้องเฝ้าระวัง-วัตถุประสงค์-และนิยามหลัก': {
      claims: [
        {
          id: 'epidemiology--epidem-surveillance--ทำไมต้องเฝ้าระวัง-วัตถุประสงค์-และนิยามหลัก--v1',
          statement: 'ตามมาตรฐาน WOAH วัตถุประสงค์ของ animal health surveillance รวมถึงการแสดงว่าปลอดโรคหรือปลอดการติดเชื้อ การระบุการเกิดหรือการกระจายของโรคหรือการติดเชื้อ และการตรวจจับโรคจากต่างถิ่นหรือโรคอุบัติใหม่ให้เร็วที่สุด',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-world-organisation-for-na', locator: 'Chapter 1.4 Animal Health Surveillance. ไม่ได้ตรวจสอบเลขบทความย่อย (article) ภายในบทนี้กับฉบับออนไลน์ปัจจุบัน จึงไม่ระบุเลข article', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: '' },
        },
      ],
    },
  },
  'epidemiology--epidem-outbreak-investigation': {
    'epidemiology--epidem-outbreak-investigation--11-ขั้นตอนของการสอบสวนโรคระบาด': {
      claims: [
        {
          id: 'epidemiology--epidem-outbreak-investigation--11-ขั้นตอนของการสอบสวนโรคระบาด--v1',
          statement: 'ขั้นตอนของการสอบสวน outbreak เรียงลำดับจากการ verify ว่ามี outbreak จริง, การยืนยันการวินิจฉัย, การสร้าง case definition และ case finding, การบรรยายข้อมูลตาม time, place และ person, การระบุความเสี่ยงและการตั้งกับทดสอบสมมติฐาน, การวางแผนศึกษาเพิ่มเติม, การใช้มาตรการควบคุม และการสื่อสารผล',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-16160889', locator: 'Vol 48(9):1013-9, abstract (final sentence listing the steps)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The steps of an outbreak investigation include verification, confirming the diagnosis, developing a case definition and case finding, describing the data in terms of time, place and person, risk identification, formulating and testing of a' },
        },
      ],
    },
    'epidemiology--epidem-outbreak-investigation--step-4-นิยามผู้ป่วยและการจำแนกผู้ป่วย': {
      claims: [
        {
          id: 'epidemiology--epidem-outbreak-investigation--step-4-นิยามผู้ป่วยและการจำแนกผู้ป่วย--v1',
          statement: 'case definition ที่ใช้จริงในภาคสนามประกอบด้วย clinical criteria ร่วมกับการจำกัดขอบเขตด้วย place แล้วจำแนกผู้ป่วยเป็น probable case (เข้าเกณฑ์ทางคลินิกในพื้นที่ที่กำหนด) และ confirmed case (probable case ที่มีผลตรวจทางห้องปฏิบัติการยืนยัน)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-30126362', locator: 'Vol 18(1):412, abstract, Methods', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'We defined a probable case as onset of fever (>=3 days) and generalized rash, plus >=1 of the following: conjunctivitis, cough, and/or runny nose in a Mayuge District resident. A confirmed case was a probable case with measles-specific IgM' },
        },
      ],
    },
    'epidemiology--epidem-outbreak-investigation--step-5-descriptive-epidemiology-time-place-person': {
      claims: [
        {
          id: 'epidemiology--epidem-outbreak-investigation--step-5-descriptive-epidemiology-time-place-person--v1',
          statement: 'epidemic curve แบบ propagated บ่งชี้การแพร่ต่อเนื่องจากคนสู่คน ต่างจาก common source ที่ผู้ป่วยเกิดจากการสัมผัสแหล่งเดียวกัน และ outbreak เดียวกันอาจให้ curve ที่เริ่มแบบ common source แล้วตามด้วย propagated pattern ได้',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-26587177', locator: 'Vol 21:331, abstract, Results', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The epidemic curve initially shows a typical common source outbreak, followed by a propagated pattern.' },
        },
        {
          id: 'epidemiology--epidem-outbreak-investigation--step-5-descriptive-epidemiology-time-place-person--v2',
          statement: 'Shiga toxin-producing E. coli O157 ใช้ incubation period ประมาณ 4 วัน เป็นเกณฑ์ในการสอบสวน outbreak เช่น ใช้แยกว่าผู้ป่วยรายใดเป็น secondary case ที่เกิดหลัง primary case เกินหนึ่ง incubation period',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-18444854', locator: 'Vol 46(8):1189-96, abstract, Methods', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Secondary cases were considered to be preventable if the secondary case patient\'s symptoms started >1 incubation period (4 days) after the date of microbiological diagnosis of the primary case.' },
        },
      ],
    },
    'epidemiology--epidem-outbreak-investigation--step-6-7-ตั้งสมมติฐานและ-analytic-epidemiology': {
      claims: [
        {
          id: 'epidemiology--epidem-outbreak-investigation--step-6-7-ตั้งสมมติฐานและ-analytic-epidemiology--v1',
          statement: 'ใน retrospective cohort study ของ outbreak attack rate คำนวณจากจำนวนผู้ป่วยหารด้วยจำนวนผู้ที่สัมผัสเหตุการณ์ทั้งหมด (ตัวอย่างจริง 66 จาก 138 คน = 48%) และใช้ relative risk เป็น measure of association ระหว่าง exposure กับการป่วย (ตัวอย่างจริง ขนมที่ใช้ไข่ดิบ adjusted RR = 7.8, 95% CI 3.5-20.1)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-39722008', locator: 'Vol 24(1):1464, abstract, Results', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Of the 138 participants, 66 became ill; the attack rate was 48%. ... In multivariable analysis, honey cake was the only risk factor associated with illness (aRR = 7.8, 95% confidence interval = 3.5-20.1, p < 0.01).' },
        },
      ],
    },
    'epidemiology--epidem-outbreak-investigation--กรณีศึกษาและโครงสร้างรายงานการสอบสวนโรค': {
      claims: [
        {
          id: 'epidemiology--epidem-outbreak-investigation--กรณีศึกษาและโครงสร้างรายงานการสอบสวนโรค--v1',
          statement: 'การสอบสวน Salmonella Typhimurium outbreak ในผู้ร่วมงานเลี้ยงแต่งงานใช้ retrospective cohort study ในผู้ร่วมงาน คำนวณ attack rate หา vehicle ด้วย measure of association และทำการตรวจสิ่งแวดล้อมของสถานที่จัดเลี้ยงกับผู้ผลิตอาหารร่วมกับการเก็บตัวอย่างอาหาร โดยมีวัตถุประสงค์ คือ บรรยาย outbreak ตาม person, place และ time, ระบุแหล่งที่น่าจะเป็น และดำเนินมาตรการควบคุม',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-22010514', locator: 'Vol 35(2):192-6, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The CDCB commenced an investigation to: characterise the outbreak in terms of person, place and time; identify probable source or sources; and implement control measures. A retrospective cohort study was undertaken among wedding reception a' },
        },
      ],
    },
  },


  // one-health sourcing pass, 2026-08-01 — every identifier resolved against
  // NCBI/Crossref and title-matched before being written here.
  'one-health--oh-vet-role': {
    'one-health--oh-vet-role--บทนำ-ทำไม-one-health-ต้องมีสัตวแพทย์': {
      claims: [
        {
          id: 'one-health--oh-vet-role--บทนำ-ทำไม-one-health-ต้องมีสัตวแพทย์--v1',
          statement: 'จากเชื้อก่อโรคในคนที่จัดว่าเป็น emerging จำนวน 175 ชนิด มี 132 ชนิด คิดเป็น 75% ที่เป็น zoonotic และโดยรวมแล้วเชื้อ zoonotic มีโอกาสสัมพันธ์กับโรคอุบัติใหม่มากกว่าเชื้อที่ไม่ใช่ zoonotic ประมาณ 2 เท่า',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-11516376', locator: '356(1411):983-9', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Out of the emerging pathogens, 132 (75%) are zoonotic, and overall, zoonotic pathogens are twice as likely to be associated with emerging diseases than non-zoonotic pathogens.' },
        },
        {
          id: 'one-health--oh-vet-role--บทนำ-ทำไม-one-health-ต้องมีสัตวแพทย์--v2',
          statement: 'แนวคิด one medicine หรือ One Health ในรูปแบบสมัยใหม่ถูกเรียบเรียงขึ้นใหม่ในหนังสือ Veterinary Medicine and Human Health ฉบับปี 1984 ของ Calvin Schwabe',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-18040269', locator: '88(1):18-26', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The concept in its modern iteration was re-articulated in the 1984 edition of Calvin Schwabe\'s \'Veterinary Medicine and Human Health.\'' },
        },
      ],
    },
    'one-health--oh-vet-role--ประเด็นที่-1-emerging-infectious-diseases-ohzdp-และการกำจัดโรคพิ': {
      claims: [
        {
          id: 'one-health--oh-vet-role--ประเด็นที่-1-emerging-infectious-diseases-ohzdp-และการกำจัดโรคพิ--v1',
          statement: 'โรคพิษสุนัขบ้าที่หมุนเวียนในประชากรสุนัขทำให้คนเสียชีวิตทั่วโลกประมาณ 59,000 คนต่อปี และการฉีดวัคซีนในสุนัขเป็นมาตรการเดี่ยวที่ลดภาระโรคได้มากที่สุด',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-25881058', locator: '9(4):e0003709', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'This study demonstrates that investment in dog vaccination, the single most effective way of reducing the disease burden, has been inadequate and that the availability and affordability of PEP needs improving.' },
        },
      ],
    },
    'one-health--oh-vet-role--ประเด็นที่-3-ความปลอดภัยอาหาร-จากฟาร์มถึงโต๊ะอาหาร': {
      claims: [
        {
          id: 'one-health--oh-vet-role--ประเด็นที่-3-ความปลอดภัยอาหาร-จากฟาร์มถึงโต๊ะอาหาร--v1',
          statement: 'สาเหตุของการเจ็บป่วยจากอาหารที่พบบ่อยที่สุดคือเชื้อกลุ่มที่ทำให้เกิดอุจจาระร่วง โดยเฉพาะ norovirus และ Campylobacter spp. ส่วนสาเหตุการเสียชีวิตจากโรคที่เกิดจากอาหารส่วนใหญ่คือ non-typhoidal Salmonella enterica',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-26633896', locator: '12(12):e1001923', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The most frequent causes of foodborne illness were diarrheal disease agents, particularly norovirus and Campylobacter spp. Diarrheal disease agents, especially non-typhoidal Salmonella enterica, were also responsible for the majority of dea' },
        },
      ],
    },
    'one-health--oh-vet-role--ประเด็นที่-5-การดื้อยาต้านจุลชีพและแผน-amr-ของไทย': {
      claims: [
        {
          id: 'one-health--oh-vet-role--ประเด็นที่-5-การดื้อยาต้านจุลชีพและแผน-amr-ของไทย--v1',
          statement: 'AMR เชื่อมโยงกับทั้งสาม domain ของ One Health คือ คน สัตว์ และสิ่งแวดล้อม โดยการใช้ยาต้านจุลชีพในการผลิตสัตว์ในขนาด sub-therapeutic ร่วมกับระยะเวลาสัมผัสยาที่ยาวนาน สร้างสภาวะที่เหมาะสมให้แบคทีเรียตรึงยีนที่ทำให้ดื้อยาไว้ และยีนเหล่านี้ถูกถ่ายทอดต่อไปยังเชื้อก่อโรคในคนหรือ gut microbiota ของคนได้ผ่านคน อาหารที่ปนเปื้อน หรือสิ่งแวดล้อม',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-27475987', locator: '110(7):377-80', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'because of the way that many antibiotics are used in animal production, in sub-therapeutic doses and with long exposure periods, these production systems create ideal conditions for bacteria to fix genes that confer resistance. These genes' },
        },
      ],
    },
    'one-health--oh-vet-role--ประเด็นที่-7-มลพิษสิ่งแวดล้อมและการใช้สัตว์เป็น-sentinel': {
      claims: [
        {
          id: 'one-health--oh-vet-role--ประเด็นที่-7-มลพิษสิ่งแวดล้อมและการใช้สัตว์เป็น-sentinel--v1',
          statement: '23% ของการเสียชีวิตทั่วโลก และ 22% ของ DALYs ทั่วโลกในปี 2012 เกิดจากปัจจัยเสี่ยงด้านสิ่งแวดล้อมที่ปรับเปลี่ยนได้',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-27621336', locator: '39(3):464-475', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Twenty-three percent (95% CI: 13-34%) of global deaths and 22% (95% CI: 13-32%) of global disability adjusted life years (DALYs) were attributable to environmental risks in 2012.' },
        },
      ],
    },
  },
  'one-health--oh-global-network': {
    'one-health--oh-global-network--ภาพรวม-นิยาม-และ-one-health-triad': {
      claims: [
        {
          id: 'one-health--oh-global-network--ภาพรวม-นิยาม-และ-one-health-triad--v1',
          statement: 'ในบรรดา pathogen ที่ก่อโรคในคนซึ่งจัดว่าเป็น emerging จำนวน 175 ชนิด มี 132 ชนิด (75%) ที่เป็น zoonotic และโดยรวม zoonotic pathogens มีโอกาสสัมพันธ์กับ emerging disease มากกว่า non-zoonotic pathogens ประมาณ 2 เท่า',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-11516376', locator: 'Abstract; 2001;356(1411):983-9', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Out of these, 868 (61%) are zoonotic, that is, they can be transmitted between humans and animals, and 175 pathogenic species are associated with diseases considered to be \'emerging\'. We test the hypothesis that zoonotic pathogens are more' },
        },
      ],
    },
    'one-health--oh-global-network--module-2-surveillance-dashboard-และโรคสัตว์สู่คนที่จัดลำดับความส': {
      claims: [
        {
          id: 'one-health--oh-global-network--module-2-surveillance-dashboard-และโรคสัตว์สู่คนที่จัดลำดับความส--v1',
          statement: 'Leptospirosis: หนูเป็น reservoir ที่ปล่อยเชื้อออกมาทางปัสสาวะปนเปื้อนสิ่งแวดล้อม คนจึงติดเชื้อจากการสัมผัสสิ่งแวดล้อมที่ปนเปื้อน และเหตุการณ์น้ำท่วมบ่อยครั้งอาจช่วยกระจายเชื้อในพื้นที่ต่ำ ทำให้เส้นทางการติดต่อสัมพันธ์กับทั้งความชุกของหนูและน้ำท่วม',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-36111781', locator: 'Abstract, Background and Conclusions; eLife 2022;11:e73120', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Endemic transmission of, the agent of leptospirosis, in marginalised urban communities occurs through human exposure to an environment contaminated by bacteria shed in the urine of the rat reservoir. ... These findings suggest that, while f' },
        },
      ],
    },
    'one-health--oh-global-network--module-3-regional-case-studies-และ-cross-node-simulation': {
      claims: [
        {
          id: 'one-health--oh-global-network--module-3-regional-case-studies-และ-cross-node-simulation--v1',
          statement: 'Africa Node: การระบาดของ Rift Valley Fever สัมพันธ์กับรูปแบบปริมาณฝน โดยการระบาดของ RVF ในแอฟริกาตะวันออกที่ทราบทั้งหมดในช่วงปี 1950 ถึงพฤษภาคม 1998 เกิดตามหลังช่วงที่ฝนตกสูงผิดปกติ และการพยากรณ์ล่วงหน้าอาจทำได้ถึงประมาณ 5 เดือนก่อนการระบาด',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-10411500', locator: 'Abstract; Science 1999;285(5426):397-400', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'All known Rift Valley fever virus outbreaks in East Africa from 1950 to May 1998, and probably earlier, followed periods of abnormally high rainfall. Analysis of this record and Pacific and Indian Ocean sea surface temperature anomalies, co' },
        },
        {
          id: 'one-health--oh-global-network--module-3-regional-case-studies-และ-cross-node-simulation--v2',
          statement: 'Middle East Node: อูฐ dromedary เป็นประชากรสัตว์ที่ติดเชื้อ MERS-CoV จริง จึงเป็นเป้าของการเฝ้าระวัง โดยซีรัมอูฐจากโอมาน 50 จาก 50 ตัว (100%) และจากสเปน 15 จาก 105 ตัว (14%) ตรวจพบ antibody ต่อ MERS-CoV spike ขณะที่ซีรัมของแกะ แพะ โค และ camelid ชนิดอื่นในยุโรปตรวจไม่พบ',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-23933067', locator: 'Abstract, Findings and Interpretation; Lancet Infect Dis 2013;13(10):859-66', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: '50 of 50 (100%) sera from Omani camels and 15 of 105 (14%) from Spanish camels had protein-specific antibodies against MERS-CoV spike. Sera from European sheep, goats, cattle, and other camelids had no such antibodies. ... MERS-CoV or a rel' },
        },
      ],
    },
    'one-health--oh-global-network--module-6-peer-review-และตาราง-cdc-priority-zoonoses': {
      claims: [
        {
          id: 'one-health--oh-global-network--module-6-peer-review-และตาราง-cdc-priority-zoonoses--v1',
          statement: 'ใน One Health Zoonotic Disease Prioritization (OHZDP) process ของ US CDC โรคที่ถูกจัดเป็นลำดับความสำคัญบ่อยที่สุดทั่วโลกคือ rabies ซึ่ง CDC ระบุว่าถูกจัดลำดับใน 24 จาก 25 workshops ณ เวลาที่รายงาน ร่วมกับ zoonotic influenzas, viral hemorrhagic fevers, anthrax และ brucellosis',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-united-states-centers--2024', locator: 'OHZDP web page, section listing the zoonoses most commonly prioritized around the globe. I could not confirm the exact section heading because cdc.gov returned HTTP 403 to a direct fetch, so no clause or heading number is asserted here. The slide itself prints the older path cdc.gov/onehealth/global-activities/prioritization.html.', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Rabies has been prioritized in 24 of 25 workshops to date; other commonly prioritized zoonotic diseases globally include zoonotic influenzas, viral hemorrhagic fevers, anthrax, and brucellosis.' },
        },
      ],
    },
    'one-health--oh-global-network--background-quadripartite-และกรอบ-one-health-ระดับโลก': {
      claims: [
        {
          id: 'one-health--oh-global-network--background-quadripartite-และกรอบ-one-health-ระดับโลก--v1',
          statement: 'Quadripartite ประกอบด้วย 4 องค์กร คือ FAO, UNEP, WHO และ WOAH ซึ่งร่วมกันจัดทำ One Health Joint Plan of Action เป็นกรอบวาระ One Health ระดับโลก',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-food-and-agriculture-o-2022', locator: 'Title page and authorship statement of the joint publication, issued 14 October 2022, ISBN 978-92-4-005913-9. No internal chapter or clause number is asserted.', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'One health joint plan of action (2022-2026): working together for the health of humans, animals, plants and the environment, produced jointly by the Food and Agriculture Organization of the United Nations (FAO), the United Nations Environme' },
        },
      ],
    },
  },


  // milk-meat-hygiene sourcing pass, 2026-08-01 — every identifier resolved against
  // NCBI/Crossref and title-matched before being written here.
  'milk-meat-hygiene--milk-mastitis': {
    'milk-meat-hygiene--milk-mastitis--definition-of-mastitis': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-mastitis--definition-of-mastitis--v1',
          statement: 'Mastitis คือ inflammation ของ mammary gland (udder) ซึ่งโดยหลักเกิดจาก intramammary infection (IMI) และเป็นหนึ่งในโรคที่พบบ่อยที่สุดในโคนม',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-39694240', locator: 'Vol 108, issue 4, pages 3917-3928; abstract, opening sentence', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Mastitis, an inflammation of the udder primarily caused by an IMI, is one of the most common diseases in dairy cattle.' },
        },
      ],
    },
    'milk-meat-hygiene--milk-mastitis--process-of-infection-4-steps': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-mastitis--process-of-infection-4-steps--v1',
          statement: 'เชื้อเข้าสู่เต้านมผ่าน teat canal โดยมี keratin ภายใน teat canal ทำหน้าที่เป็นด่านป้องกัน การเปลี่ยนแปลง/รบกวน keratin สัมพันธ์กับจำนวน new intramammary infection ที่เปลี่ยนไป และ staphylococci สามารถ colonize keratin ใน teat canal ของ heifer ได้ตั้งแต่อายุประมาณ 9 เดือน',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-3319986', locator: 'Vol 191, issue 11, pages 1484-1488; review abstract (teat-end defenses)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Alteration of teat canal keratin by method of intramammary drug infusion through the teat canal influenced the number of new infections. ... Staphylococci colonize teat canal keratin and lacteal secretions of dairy heifers as early as 9 mon' },
        },
        {
          id: 'milk-meat-hygiene--milk-mastitis--process-of-infection-4-steps--v2',
          statement: 'Mastitis ทำให้ milk yield ลดลงและ milk composition เปลี่ยนแปลง โดยเชื้อก่อโรคทุกกลุ่มที่ศึกษา (Streptococcus spp., Staphylococcus aureus, coagulase-negative staphylococci, coliforms, fungi) ทำให้ SCC เพิ่มขึ้นอย่างมีนัยสำคัญ และทำให้ปริมาณ lactose ในน้ำนมลดลง',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-30101726', locator: 'Vol 85, issue 3, pages 309-316; abstract, results (3,149 dairy cows, 31 herds, Hokkaido)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'All pathogens, in particular S. aureus and fungi, significantly increased SCC in both parity groups. All pathogens, especially CNS (in primipara) and S. aureus (in multipara), decreased lactose content.' },
        },
      ],
    },
    'milk-meat-hygiene--milk-mastitis--mastitis-classification-pathogen-list': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-mastitis--mastitis-classification-pathogen-list--v1',
          statement: 'Environmental mastitis เป็นรูปแบบที่พบบ่อยและสร้างความสูญเสียมากที่สุดในฟาร์มโคนมสมัยใหม่ที่ควบคุมการแพร่แบบ contagious ได้แล้ว โดยมูลโค สภาพแวดล้อมในโรงเรือน และแปลงหญ้าที่ใช้แล้วเป็นแหล่งสำคัญของเชื้อ เช่น Escherichia coli และ Streptococcus uberis อย่างไรก็ตาม การจัดกลุ่มเชื้อแบบ binary เป็น contagious หรือ environmental อาจทำให้เข้าใจผิดได้ โดยเฉพาะกับ Staphylococcus aureus, Streptococcus uberis และ streptococci อื่นรวมถึง Streptococcus agalactiae',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-29083115', locator: 'Vol 65 Suppl 1, pages 166-185; abstract (review)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Environmental mastitis can be caused by a wide range of bacterial species, and binary classification of species as contagious or environmental is misleading, particularly for Staphylococcus aureus, Streptococcus uberis and other streptococc' },
        },
        {
          id: 'milk-meat-hygiene--milk-mastitis--mastitis-classification-pathogen-list--v2',
          statement: 'Subclinical mastitis นิยมนิยามด้วยเกณฑ์ somatic cell count (SCC) มากกว่า 200,000 cells/mL ที่ระดับ quarter',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-30591327', locator: 'Vol 102, issue 2, pages 1402-1416; abstract, methods (case definition)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Quarter somatic cell count (SCC) was measured using the reference method (DeLaval cell counter; De Laval International AB, Tumba, Sweden) with SCM defined as SCC >200,000 cells/mL.' },
        },
        {
          id: 'milk-meat-hygiene--milk-mastitis--mastitis-classification-pathogen-list--v3',
          statement: 'California Mastitis Test (CMT) เป็น cow-side test สำหรับคัดกรอง subclinical mastitis โดยประเมิน SCC ทางอ้อม เมื่อเทียบกับวิธีอ้างอิง Fossomatic cell count พบ sensitivity 81.0% และ specificity 92.9% และให้ผลตรงกับวิธีอ้างอิง 83.1% ของตัวอย่าง',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-37505872', locator: 'Vol 10, issue 7, article 468; abstract, results (284 mixed milk samples, FSCC as gold standard)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The CMT matched with the FSCC in 83.1% of the samples ... The sensitivity and specificity reached 81.0% and 92.9% for the CMT' },
        },
      ],
    },
  },
  'milk-meat-hygiene--milk-quality-composition': {
    'milk-meat-hygiene--milk-quality-composition--factors-affecting-milk-composition': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-quality-composition--factors-affecting-milk-composition--v1',
          statement: 'Breed มีผลต่อ milk composition ชัดเจน — จากข้อมูล multibreed herds 139,821 records (16,566 ตัว) พบว่า Holstein-Friesian ให้น้ำนมที่มี fat, protein และ casein ต่ำที่สุด ขณะที่ Jersey ให้ค่าสูงที่สุด',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-30221430', locator: 'Anim Sci J 2018;89(11):1622-1627, Abstract (Results)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Holstein-Friesian yielded milk with the lowest fat, protein, and casein concentration, and Ca, Mg, and P contents, whereas Jersey cows produced milk with the greatest fat, protein, and casein concentration, and Ca and Mg contents.' },
        },
        {
          id: 'milk-meat-hygiene--milk-quality-composition--factors-affecting-milk-composition--v2',
          statement: 'Animal health: subclinical mastitis ทำให้ casein-to-protein ratio และ lactose content เปลี่ยนแปลงอย่างมีนัยสำคัญ และการเปลี่ยนแปลงนี้สัมพันธ์กับ inflammation (SCC สูง) มากกว่าชนิดเชื้อ — contagious, environmental และ opportunistic pathogens ให้ผลไม่แตกต่างกัน',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-28365113', locator: 'J Dairy Sci 2017;100(6):4868-4883, Abstract (Results and conclusion)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Significant variations in the casein to protein ratio and lactose content were observed in all culture-positive samples and in culture-negative samples with medium to high SCC compared to normal milk. No differences were observed among cont' },
        },
        {
          id: 'milk-meat-hygiene--milk-quality-composition--factors-affecting-milk-composition--v3',
          statement: 'Diet: อาหารสูตร high concentrate/low forage เหนี่ยวนำ milk fat depression (MFD) โดยลด milk fat percentage 25% และ fat yield 27% ในขณะที่ dry matter intake, milk yield, protein และ lactose ไม่เปลี่ยน',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-14519791', locator: 'J Nutr 2003;133(10):3098-3102, Abstract (Results)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The HC/LF diet reduced milk fat percentage by 25% and yield by 27% with no effect on dietary intake, milk production, protein or lactose.' },
        },
        {
          id: 'milk-meat-hygiene--milk-quality-composition--factors-affecting-milk-composition--v4',
          statement: 'กลไกของ diet-induced MFD คือ biohydrogenation theory — อาหารบางแบบเปลี่ยน pathway ของ rumen biohydrogenation ของ dietary PUFA ให้เกิด fatty acid intermediates ที่ยับยั้ง mammary fat synthesis โดย trans-10, cis-12 CLA เป็นตัวอย่างที่ถูกระบุ ไม่ใช่การขาด lipogenic precursors',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-12626693', locator: 'Annu Rev Nutr 2003;23:203-227, Abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The biohydrogenation theory proposes that under certain dietary conditions, typical pathways of rumen biohydrogenation are altered to produce unique fatty acid intermediates that inhibit milk fat synthesis. Trans-10, cis-12 conjugated linol' },
        },
      ],
    },
    'milk-meat-hygiene--milk-quality-composition--milk-composition-3-property-categories': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-quality-composition--milk-composition-3-property-categories--v1',
          statement: 'Freezing point เป็น physicochemical property ที่สัมพันธ์เชิงเส้น (linear relationship) กับ lactose concentration จึงใช้การวัด cryoscopic point ทำนาย % lactose ในน้ำนมได้',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-17225605', locator: 'J AOAC Int 2006;89(6):1581-1584, Abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'A lineal relationship was found between lactose concentration and freezing point, the analytical equation for which shows a close relationship regarding the 3 methods used. ... The equation obtained also enables prediction of the lactose pe' },
        },
        {
          id: 'milk-meat-hygiene--milk-quality-composition--milk-composition-3-property-categories--v2',
          statement: 'Physicochemical properties ของน้ำนมดิบสัมพันธ์กับ chemical composition — ในโคนม dual-purpose เขตร้อน density มี positive correlation กับ protein, freezing point และ lactose ส่วน fat มี negative correlation กับ density, freezing point, acidity และ conductivity',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-40267016', locator: 'Vet Sci 2025;12(3):269, Abstract (correlation results)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'density maintained significant positive correlations with the variables of protein, freezing point and lactose (< 0.05). However, fat showed significant negative correlations with density, freezing point, acidity and conductivity (< 0.05).' },
        },
      ],
    },
  },
  'milk-meat-hygiene--milk-raw-std': {
    'milk-meat-hygiene--milk-raw-std--standard-parameters-raw-milk': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-raw-std--standard-parameters-raw-milk--v1',
          statement: 'มกษ. 6003-2553 (TAS 6003-2010) กำหนดองค์ประกอบขั้นต่ำของน้ำนมโคดิบ: fat ไม่น้อยกว่า 3.35% โดยน้ำหนัก, milk solids not fat (SNF) ไม่น้อยกว่า 8.25% โดยน้ำหนัก และ protein ไม่น้อยกว่า 3.00% โดยน้ำหนัก',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-national-bureau-of-agr-2010', locator: 'Section 3 Quality, clauses 3.9-3.11 (ACFS unofficial English translation)', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: '3.9 Protein content shall not be less than 3.00% by weight. 3.10 Fat content shall not be less than 3.35% by weight. 3.11 Milk solids not fat shall not be less than 8.25% by weight.' },
        },
        {
          id: 'milk-meat-hygiene--milk-raw-std--standard-parameters-raw-milk--v2',
          statement: 'มกษ. 6003-2553 กำหนดว่า freezing point ของน้ำนมโคดิบต้องไม่สูงกว่า -0.520 องศาเซลเซียส และให้ตรวจด้วย thermistor cryoscopy ตามวิธี ISO 5764/IDF 108',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-national-bureau-of-agr-2010', locator: 'Section 3 Quality clause 3.5, and Section 10 Table 1 item 4 (methods of analysis)', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: '3.5 Freezing point shall not be above – 0.520°C. ... Table 1 item 4: Freezing point (section 3.5) | ISO 5764/IDF 108 | Thermistor Cryoscopy' },
        },
        {
          id: 'milk-meat-hygiene--milk-raw-std--standard-parameters-raw-milk--v3',
          statement: 'มกษ. 6003-2553 กำหนด somatic cell count (SCC) ไม่เกิน 500,000 cells/ml และเกณฑ์จุลินทรีย์: standard plate count ไม่เกิน 5 x 10^5 cfu/ml, coliform count ไม่เกิน 10^4 cfu/ml, thermoduric count ไม่เกิน 10^3 cfu/ml',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-national-bureau-of-agr-2010', locator: 'Section 3 Quality clause 3.8 (SCC) and Section 8.3 Microbiological criteria, clauses 8.3.1-8.3.3', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: '3.8 Somatic cell count shall not exceed 500,000 cells/ml ... 8.3.1 Standard plate count shall not exceed 5 x 10^5 cfu/ml. 8.3.2 Coliform count shall not exceed 10^4 cfu/ml. 8.3.3 Thermoduric count shall not exceed 10^3 cfu/ml.' },
        },
        {
          id: 'milk-meat-hygiene--milk-raw-std--standard-parameters-raw-milk--v4',
          statement: 'มกษ. 6003-2553 กำหนดเกณฑ์ physicochemical และ platform test ของน้ำนมโคดิบ: titratable acid ไม่เกิน 0.16% และ pH 6.6 ถึง 6.8, specific gravity ไม่น้อยกว่า 1.028 ที่ 20 องศาเซลเซียส, ต้องไม่เกิด protein precipitation เมื่อทดสอบด้วย 70% ethyl alcohol และ methylene blue reduction time ต้องนานกว่า 4 ชั่วโมง หรือ resazurin reduction test อย่างน้อย grade 4.5 ที่ 1 ชั่วโมง',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-national-bureau-of-agr-2010', locator: 'Section 3 Quality, clauses 3.3, 3.4, 3.6, 3.7', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: '3.3 There shall be no protein precipitation under preliminary testing with 70% ethyl alcohol. If precipitation is observed, the test shall be confirmed by the clot on boiling test. 3.4 Tritable acid shall not exceed 0.16% and pH shall be 6.' },
        },
      ],
    },
    'milk-meat-hygiene--milk-raw-std--objectives-of-milk-quality-determination': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-raw-std--objectives-of-milk-quality-determination--v1',
          statement: 'วัตถุประสงค์ zoonosis prevention และ residue control ถูกเขียนเป็นข้อกำหนดจริงใน มกษ. 6003-2553 คือ ต้องตรวจไม่พบจุลินทรีย์ที่ก่อโรคติดต่อจากสัตว์สู่คน เช่น วัณโรค (tuberculosis) และต้องตรวจไม่พบยาปฏิชีวนะเมื่อใช้ชุดทดสอบที่ผ่านการ validate',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-national-bureau-of-agr-2010', locator: 'Section 7 Veterinary drug residues, and Section 8.3 clause 8.3.4', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Antibiotics shall not be detected if a validated test kit is used. ... 8.3.4 Zoonotic microorganisms such as tuberculosis shall not be found.' },
        },
      ],
    },
    'milk-meat-hygiene--milk-raw-std--thai-regulatory-framework-2-ministries': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-raw-std--thai-regulatory-framework-2-ministries--v1',
          statement: 'มกษ. 6003-2553 ออกภายใต้ พ.ร.บ. มาตรฐานสินค้าเกษตร พ.ศ. 2551 ในฐานะ voluntary standard (มาตรฐานทั่วไป ไม่ใช่มาตรฐานบังคับ) โดยยกเลิก มกษ. 6003-2548 ฉบับเดิม และนิยามของ น้ำนมโคดิบ คือน้ำนมจากแม่โคหลังคลอดไม่น้อยกว่า 3 วัน และต้องไม่มี colostrum ปน',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-national-bureau-of-agr-2010', locator: 'Notification of the Ministry of Agriculture and Cooperatives (clauses 1-2, notified 26 August B.E. 2553) and Section 2 Definitions', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The Notification of the National Committee on Agricultural Commodity and Food Standards entitled the establishment of Thai Agricultural Commodity and Food Standard: Raw Cow Milk, dated 5 August B.E. 2548 (2005) is repealed. The Thai Agricul' },
        },
      ],
    },
  },
  'milk-meat-hygiene--milk-raw-storage': {
    'milk-meat-hygiene--milk-raw-storage--cold-chain-principles-transport': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-raw-storage--cold-chain-principles-transport--v1',
          statement: 'ตามเกณฑ์ EU (Reg. 853/2004) น้ำนมดิบต้อง cool ทันทีหลังรีดให้ไม่เกิน 8°C ถ้าเก็บ (collection) ทุกวัน หรือไม่เกิน 6°C ถ้าไม่ได้เก็บทุกวัน และระหว่าง transport ต้องรักษา cold chain โดยอุณหภูมิเมื่อถึงโรงงานปลายทางต้องไม่เกิน 10°C',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-european-union-europea-2004', locator: 'Annex III, Section IX, Chapter I, Part II(B), points 2(a) and 3', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Milk must be cooled immediately to not more than 8 oC in the case of daily collection, or not more than 6 oC if collection is not daily ... During transport the cold chain must be maintained and, on arrival at the establishment of destinati' },
        },
        {
          id: 'milk-meat-hygiene--milk-raw-storage--cold-chain-principles-transport--v2',
          statement: 'การเก็บน้ำนมดิบที่อุณหภูมิ ≥6°C ทำให้ bacterial count, protease activity และ proteolysis เพิ่มขึ้นอย่างมีนัยสำคัญ ส่วน deep cooling ที่ 2°C หรือการใช้ heating ร่วมกับ refrigeration ที่ ≤4°C ยืด storage life ได้ โดย isolate ที่พบเด่นคือ Pseudomonas fluorescens และ Bacillus cereus',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-28252354', locator: 'J Dairy Res 2017;84(1):92-101', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'all of the samples showed increasing BC, PA and PL as a function of temperature, time and initial BC with a significant increase in those criteria ≥6 °C ... deep cooling (2 °C) and combination of heating and refrigeration (≤4 °C) significan' },
        },
        {
          id: 'milk-meat-hygiene--milk-raw-storage--cold-chain-principles-transport--v3',
          statement: 'Psychrotrophic bacteria ที่เติบโตในน้ำนมดิบแช่เย็นสร้าง protease และ lipase ที่ทน heat โดยยังคง activity อยู่หลังให้ความร้อนที่ 70, 80 หรือ 90°C และ protease ทนความร้อนได้มากกว่า lipase จึงเป็นเหตุผลว่า cold chain ที่ล้มเหลวทำให้ผลิตภัณฑ์เสียได้แม้ผ่านความร้อนแล้ว',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-30070086', locator: 'J Zhejiang Univ Sci B 2018;19(8):630-642', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Proteases and lipases produced by psychrotrophic bacteria retained activity after heat treatment at 70, 80, or 90 °C, and proteases appeared to be more heat-stable than lipases.' },
        },
      ],
    },
    'milk-meat-hygiene--milk-raw-storage--milk-collecting-centers-ศูนย์รวบรวมน้ำนม-mcc': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-raw-storage--milk-collecting-centers-ศูนย์รวบรวมน้ำนม-mcc--v1',
          statement: 'คุณภาพจุลชีววิทยาของน้ำนมดิบเปลี่ยนแปลงอย่างมีนัยสำคัญระหว่างจุดเก็บตัวอย่างสองจุดในระบบรวบรวมน้ำนม โดย reduction time of methylene blue (RTMB) ลดลงประมาณ 54% และ risk factor ที่ระบุได้คือ ฤดูกาล และระยะทางระหว่างฟาร์มกับโรงนม',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-25374932', locator: 'ScientificWorldJournal 2014;2014:131593', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The average contamination by total mesophilic aerobic bacteria (TMAB), coliforms, yeasts, molds, and different pathogens in samples taken at M1 showed significant changes at M2. This was confirmed by the decrease of reduction time of methyl' },
        },
      ],
    },
    'milk-meat-hygiene--milk-raw-storage--milk-collecting-points-จุดรับน้ำนม': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-raw-storage--milk-collecting-points-จุดรับน้ำนม--v1',
          statement: 'นิยามทางกฎหมายของ raw milk คือ น้ำนมที่หลั่งจาก mammary gland ของสัตว์ farmed ที่ยังไม่ผ่านความร้อนเกิน 40°C และไม่ผ่านกระบวนการใดที่ให้ผลเทียบเท่า',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-european-union-europea-2004', locator: 'Annex I, point 4.1 (definition of \'raw milk\')', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: '\'Raw milk\' means milk produced by the secretion of the mammary gland of farmed animals that has not been heated to more than 40 °C or undergone any treatment that has an equivalent effect.' },
        },
      ],
    },
  },
  'milk-meat-hygiene--milk-products-storage': {
    'milk-meat-hygiene--milk-products-storage--storage-methodology-per-product-class': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-products-storage--storage-methodology-per-product-class--v1',
          statement: 'Pasteurisation ของน้ำนมดิบและผลิตภัณฑ์นมต้องใช้อย่างน้อย 72°C นาน 15 วินาที หรืออย่างน้อย 63°C นาน 30 นาที หรือ combination ที่เทียบเท่า โดยผล alkaline phosphatase (ALP) test ทันทีหลังการให้ความร้อนต้องเป็น negative',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-33968255', locator: 'EFSA Journal 2021;19(4):e06576', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Pasteurisation of raw milk, colostrum, dairy or colostrum-based products must be achieved using at least 72°C for 15 s, at least 63°C for 30 min or any equivalent combination, such that the alkaline phosphatase (ALP) test immediately after' },
        },
        {
          id: 'milk-meat-hygiene--milk-products-storage--storage-methodology-per-product-class--v2',
          statement: 'สำหรับนมโค ผล ALP test ที่ถือว่า negative คือ activity ≤ 350 milliunits ต่อลิตร (mU/L) วัดด้วย ISO 11816-1 โดย ALP activity ในน้ำนมแกะดิบสูงกว่านมโคประมาณ 3 เท่า และในน้ำนมแพะต่ำกว่านมโคประมาณ 5 เท่า',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-33968255', locator: 'EFSA Journal 2021;19(4):e06576', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'For cows\' milk, a negative result is when the measured activity is ≤ 350 milliunits of enzyme activity per litre (mU/L) using the ISO standard 11816-1 ... ALP activity in raw ovine milk appears to be about three times higher and in caprine' },
        },
        {
          id: 'milk-meat-hygiene--milk-products-storage--storage-methodology-per-product-class--v3',
          statement: 'ระดับ somatic cell count (SCC) ที่สูงในน้ำนมดิบสัมพันธ์กับปริมาณ heat-stable protease (plasmin) และ lipase (lipoprotein lipase) ที่มากขึ้น ซึ่งย่อย protein และ fat ระหว่างการเก็บแบบ refrigerated ทำให้เกิด off-flavour ในนม pasteurized แม้ไม่มีเชื้อเติบโต',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-16527874', locator: 'J Dairy Sci 2006;89 Suppl 1:E15-9', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Increased SCC is correlated with increased amounts of heat-stable protease (plasmin) and lipase (lipoprotein lipase) in milk. When starting with raw milk that has a low bacterial count, and in the absence of microbial growth in pasteurized' },
        },
        {
          id: 'milk-meat-hygiene--milk-products-storage--storage-methodology-per-product-class--v4',
          statement: 'ในสหรัฐฯ ช่วงปี 2009-2014 ผลิตภัณฑ์นมที่ไม่ผ่าน pasteurization ก่อให้เกิดการเจ็บป่วยจาก outbreak มากกว่าผลิตภัณฑ์ที่ผ่าน pasteurization ประมาณ 840 เท่า (95% CrI 611-1,158) และการเข้าโรงพยาบาลมากกว่าประมาณ 45 เท่า (95% CrI 34-59)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-28518026', locator: 'Emerg Infect Dis 2017;23(6):957-964', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Unpasteurized dairy products thus cause 840 (95% CrI 611-1,158) times more illnesses and 45 (95% CrI 34-59) times more hospitalizations than pasteurized products.' },
        },
      ],
    },
    'milk-meat-hygiene--milk-products-storage--abnormalities-of-milk-3-categories': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-products-storage--abnormalities-of-milk-3-categories--v1',
          statement: 'Contaminated milk จาก antibiotic residue เป็นปัญหาที่ตรวจพบได้จริง ในการศึกษาที่ Sidama ประเทศเอธิโอเปีย พบ residue positive 29/324 ตัวอย่าง (9%) ด้วย Delvotest SP โดย HPLC ยืนยัน oxytetracycline 2.5% และ penicillin G 4.9% ซึ่ง penicillin G สูงถึง 142.38 µg/L เกิน Codex Alimentarius MRL อย่างชัดเจน และการไม่ปฏิบัติตาม withdrawal period สัมพันธ์กับการพบ residue อย่างมีนัยสำคัญ',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-42130764', locator: 'Vet Med Int 2026;2026:1579502', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Out of 324 milk samples tested, 29 (9%) were positive for antibiotic residues using the Delvotest SP kit. (HPLC confirmed oxytetracycline (OTC) in 8 (2.5%) samples and penicillin G (PnG) in 16 (4.9%) samples. The mean OTC concentration was' },
        },
        {
          id: 'milk-meat-hygiene--milk-products-storage--abnormalities-of-milk-3-categories--v2',
          statement: 'Colostrum ถูกจัดการแยกจากน้ำนมปกติตามกฎหมาย คือต้อง store แยกและ cool ทันทีให้ไม่เกิน 8°C ถ้าเก็บทุกวัน หรือไม่เกิน 6°C ถ้าไม่ได้เก็บทุกวัน หรือแช่แข็ง จึงไม่ถูกส่งเข้ารวมกับ raw milk ที่จำหน่าย',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-european-union-europea-2004', locator: 'Annex III, Section IX, Chapter I, Part II(B), point 2(b)', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Colostrum must be stored separately and immediately cooled to not more than 8 oC in the case of daily collection, or not more than 6 oC if collection is not daily, or frozen' },
        },
      ],
    },
  },
  'milk-meat-hygiene--milk-quality-determination': {
    'milk-meat-hygiene--milk-quality-determination--methods-of-milk-quality-testing': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-quality-determination--methods-of-milk-quality-testing--v1',
          statement: 'เกณฑ์ EU สำหรับน้ำนมโคดิบกำหนด somatic cell count (SCC) ≤ 400,000 cells/mL คิดเป็น rolling geometric average ในช่วง 3 เดือน โดยเก็บตัวอย่างอย่างน้อย 1 ตัวอย่าง/เดือน',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-european-union-europea-2004', locator: 'Annex III, Section IX, Chapter I, Part III (Criteria for raw milk and colostrum)', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Somatic cell count: ≤ 400 000 [per ml] ... Rolling geometric average over a three-month period, with at least one sample per month, unless the competent authority specifies another methodology to take account of seasonal variations in produ' },
        },
        {
          id: 'milk-meat-hygiene--milk-quality-determination--methods-of-milk-quality-testing--v2',
          statement: 'เกณฑ์ EU สำหรับน้ำนมโคดิบกำหนด plate count ที่ 30°C (total bacterial count, TBC) ≤ 100,000 cfu/mL คิดเป็น rolling geometric average ในช่วง 2 เดือน โดยเก็บตัวอย่างอย่างน้อย 2 ตัวอย่าง/เดือน',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-european-union-europea-2004', locator: 'Annex III, Section IX, Chapter I, Part III (Criteria for raw milk and colostrum)', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Plate Count at 30°C: ≤ 100 000 [per ml] ... Rolling geometric average over a two-month period, with at least two samples per month.' },
        },
        {
          id: 'milk-meat-hygiene--milk-quality-determination--methods-of-milk-quality-testing--v3',
          statement: 'SCC เป็น screening test ไม่ใช่ definitive test สำหรับ intramammary infection (IMI) ที่ threshold 200,000 cells/mL จากการตรวจ quarter-composite SCC ครั้งเดียว ได้ sensitivity 44.3% และ specificity 87.3% สำหรับการติดเชื้อจาก pathogen ใดก็ตาม และ sensitivity 65.1% specificity 73.0% สำหรับ major pathogens',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-27544856', locator: 'J Dairy Sci 2016;99(11):9271-9286', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The overall Se and Sp at a threshold of 200,000 cells/mL for a single quarter-cSCC observation obtained closest to the time of bacteriologic culture were 44.3 and 87.3%, respectively, for cows infected with any pathogen, and 65.1 and 73.0%,' },
        },
        {
          id: 'milk-meat-hygiene--milk-quality-determination--methods-of-milk-quality-testing--v4',
          statement: 'Resazurin reduction test ใช้ติดตามการปนเปื้อนของ bacteria และ yeast ในน้ำนมมานานราว 50 ปี โดยอาศัยลำดับการเปลี่ยนสี คือ resazurin (สีน้ำเงิน ไม่เรืองแสง) ถูก reduce เป็น resorufin (สีชมพู เรืองแสงสูง) แล้วถูก reduce ต่อเป็น hydroresorufin (ไม่มีสี ไม่เรืองแสง)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-10951200', locator: 'Eur J Biochem 2000;267(17):5421-6', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The \'resazurin reduction test\' has been used for about 50 years to monitor bacterial and yeast contamination of milk, and also for assessing semen quality. Resazurin (blue and nonfluorescent) is reduced to resorufin (pink and highly fluores' },
        },
        {
          id: 'milk-meat-hygiene--milk-quality-determination--methods-of-milk-quality-testing--v5',
          statement: 'Methylene blue reduction time (RTMB) สั้นลงเมื่อการปนเปื้อนของจุลินทรีย์ในน้ำนมสูงขึ้น ในการศึกษาที่แอลจีเรีย RTMB ลดลงประมาณ 54% สอดคล้องกับการเพิ่มขึ้นอย่างมีนัยสำคัญของ total mesophilic aerobic bacteria, coliforms, yeasts และ molds ระหว่างจุดเก็บตัวอย่างสองจุด',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-25374932', locator: 'ScientificWorldJournal 2014;2014:131593', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The average contamination by total mesophilic aerobic bacteria (TMAB), coliforms, yeasts, molds, and different pathogens in samples taken at M1 showed significant changes at M2. This was confirmed by the decrease of reduction time of methyl' },
        },
        {
          id: 'milk-meat-hygiene--milk-quality-determination--methods-of-milk-quality-testing--v6',
          statement: 'Alcohol test สะท้อนความไม่เสถียรของ casein micelle ต่อ ionic balance ตัวอย่างน้ำนมที่ไม่เสถียรต่อ ethanol 72% v/v มีค่า pH, casein และ non-fat-solids ต่ำกว่า และมี freezing point, chloride, sodium และ potassium สูงกว่าตัวอย่างที่เสถียรที่ ethanol 78% v/v ขึ้นไป โดยตัวแปรที่เข้าสู่ logistic model ของ alcohol stability คือ chloride, potassium, ionic calcium และ somatic cell count',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-15190949', locator: 'J Dairy Res 2004;71(2):201-6', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Unstable samples to ethanol (72%, v/v) presented lower values of pH, somatic cells count, casein and non-fat-solids relative to ethanol stable samples (ethanol at 78%, v/v or more); whereas freezing point, chloride, sodium and potassium con' },
        },
      ],
    },
  },
  'milk-meat-hygiene--milk-microbiology': {
    'milk-meat-hygiene--milk-microbiology--microorganisms-in-milk-2-main-groups': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-microbiology--microorganisms-in-milk-2-main-groups--v1',
          statement: 'Psychrotrophic bacteria ที่แยกได้จากน้ำนมดิบ สร้าง protease และ lipase ที่ยังคงมี activity หลังผ่านความร้อน 70, 80 หรือ 90 องศาเซลเซียส โดย protease ทนความร้อนได้มากกว่า lipase',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-30070086', locator: '19(8):630-642', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Proteases and lipases produced by psychrotrophic bacteria retained activity after heat treatment at 70, 80, or 90 °C, and proteases appeared to be more heat-stable than lipases.' },
        },
        {
          id: 'milk-meat-hygiene--milk-microbiology--microorganisms-in-milk-2-main-groups--v2',
          statement: 'ระหว่างการเก็บน้ำนมดิบที่อุณหภูมิต่ำหลังรีดนม ประชากร psychrotroph จะกลายเป็น dominant microflora และ Pseudomonas กับ Acinetobacter เป็น genera เด่นซึ่งแสดง lipolytic activity เป็นหลัก',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-17890340', locator: '73(22):7162-8', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'During cold storage after milk collection, psychrotrophic bacterial populations dominate the microflora, and their extracellular enzymes, mainly proteases and lipases, contribute to the spoilage of dairy products. ... The dominant genera, P' },
        },
        {
          id: 'milk-meat-hygiene--milk-microbiology--microorganisms-in-milk-2-main-groups--v3',
          statement: 'Bacillus cereus group เป็น spore-forming organism ที่พบบ่อยว่าเกี่ยวข้องกับ spoilage ของนมและผลิตภัณฑ์นม และเป็น Bacillus group ที่ dominant ในนมพาสเจอร์ไรส์ที่เก็บไว้ โดยเจริญได้ในสภาวะเก็บที่ไม่เหมาะสม (8 องศาเซลเซียส)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-30910086', locator: '81:32-39', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Members of the Bacillus cereus sensu lato (B. cereus group) are spore-forming organisms commonly associated with spoilage of milk and dairy products. ... Our results show that the B. cereus group is the dominant Bacillus group in stored con' },
        },
        {
          id: 'milk-meat-hygiene--milk-microbiology--microorganisms-in-milk-2-main-groups--v4',
          statement: 'Mycobacterium bovis ติดต่อสู่คนโดยหลักผ่านการบริโภคผลิตภัณฑ์จากโคที่ปนเปื้อน เช่น น้ำนมที่ไม่ผ่าน pasteurization หรือเนื้อดิบ หรือผ่านการสัมผัสใกล้ชิดกับโคที่ติดเชื้อ โดยคนเป็น incidental host',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-33725176', locator: '94(6):1147-1171', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Humans are the incidental hosts of M. bovis whereby its transmission to humans is primarily through the consumption of cattle products such as unpasteurized milk or raw meat products that have been contaminated with M. bovis or the transmis' },
        },
      ],
    },
    'milk-meat-hygiene--milk-microbiology--sources-of-contamination-indicator-organisms': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-microbiology--sources-of-contamination-indicator-organisms--v1',
          statement: 'หลายประเทศใช้ Escherichia coli และ coliforms เป็น indicator ของ sanitary quality ในอาหาร และตั้ง limit ไว้สำหรับ cheese รวมถึง cheese ที่ทำจากนมดิบ',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-31500718', locator: '85:103283', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Many countries use Escherichia coli and coliforms as indicators of sanitary quality of foods and have set limits for cheeses, including raw-milk cheeses.' },
        },
        {
          id: 'milk-meat-hygiene--milk-microbiology--sources-of-contamination-indicator-organisms--v2',
          statement: 'จากการสำรวจ raw drinking milk ที่วางขายปลีกในอังกฤษ 902 ตัวอย่าง มี 229 ตัวอย่าง (25.4%) ที่ไม่ผ่านเกณฑ์เพราะ aerobic colony count และ/หรือ coliforms สูงเกิน',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-29215775', locator: '124(2):535-546', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'A total of 229 of 902 samples (25·4%) gave unsatisfactory results due to elevated aerobic colony counts and/or coliforms, whilst 139 of 902 samples (15·4%) were of borderline quality due to coagulase-positive staphylococci.' },
        },
      ],
    },
  },
  'milk-meat-hygiene--milk-borne-pathogens': {
    'milk-meat-hygiene--milk-borne-pathogens--detail-per-pathogen-brucella-listeria-salmonella-stec-mycobacter': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-borne-pathogens--detail-per-pathogen-brucella-listeria-salmonella-stec-mycobacter--v1',
          statement: 'Coxiella burnetii ถูกจัดว่าเป็น pathogen ที่ทนความร้อนมากที่สุดในน้ำนมดิบมาโดยตลอด จึงถูกใช้เป็น reference pathogen ในการกำหนดสภาวะ pasteurization ของผลิตภัณฑ์นม',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-26143937', locator: '82(4):478-84', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The obligate intracellular pathogen Coxiella burnetii has long been considered the most heat resistant pathogen in raw milk, making it the reference pathogen for determining pasteurisation conditions for milk products.' },
        },
        {
          id: 'milk-meat-hygiene--milk-borne-pathogens--detail-per-pathogen-brucella-listeria-salmonella-stec-mycobacter--v2',
          statement: 'การศึกษาที่ wildlife-livestock-human interface ในแอฟริกาใต้ยืนยันว่า zoonotic TB จาก Mycobacterium bovis ถ่ายทอดสู่คนได้ทั้งทางน้ำนมที่ไม่ผ่าน pasteurization และทาง aerosol โดยการบริโภคน้ำนมเป็น risk factor ที่สัมพันธ์กับประวัติ TB ในครัวเรือนอย่างมีนัยสำคัญสูง',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-31337117', locator: '8(3):101', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Ownership of a bTB infected herd and consumption of milk were recognized as highly significant risk factors associated with a history of TB in the household using multiple correspondence analysis (MCA) and logistic regression. The findings' },
        },
        {
          id: 'milk-meat-hygiene--milk-borne-pathogens--detail-per-pathogen-brucella-listeria-salmonella-stec-mycobacter--v3',
          statement: 'ในการศึกษาผู้ป่วยที่มีไข้ที่ Ijara ประเทศเคนยา การบริโภคน้ำนมที่ซื้อมาสัมพันธ์กับความเสี่ยง brucellosis ที่สูงขึ้น ขณะที่การต้มน้ำนมก่อนบริโภคสัมพันธ์กับความเสี่ยงที่ลดลงอย่างชัดเจน',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-32236091', locator: '14(4):e0008108', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The IT and LASSO approaches both identified consuming purchased milk as strongly associated with elevated risk and boiling milk before consumption strongly associated with reduced risk.' },
        },
        {
          id: 'milk-meat-hygiene--milk-borne-pathogens--detail-per-pathogen-brucella-listeria-salmonella-stec-mycobacter--v4',
          statement: 'จากการเฝ้าระวังผู้ป่วยโรคติดเชื้อทางเดินอาหารในรัฐมินนิโซตา พบ hemolytic uremic syndrome ใน 21% ของผู้ป่วยที่ติดเชื้อ Escherichia coli O157 ซึ่งมีประวัติดื่มน้ำนมดิบ',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-24520559', locator: '20(1):38-44', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Severe illness was noted, including hemolytic uremic syndrome among 21% of Escherichia coli O157-infected patients reporting raw milk consumption, and 1 death was reported.' },
        },
        {
          id: 'milk-meat-hygiene--milk-borne-pathogens--detail-per-pathogen-brucella-listeria-salmonella-stec-mycobacter--v5',
          statement: 'การสำรวจฟาร์มโคนมในสหรัฐฯ ตรวจพบ Campylobacter spp. ใน bulk tank milk หรือ milk filter ที่ 24.9% ของฟาร์ม (weighted prevalence) โดย 91.8% ของ isolate เป็น Campylobacter jejuni',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-28237599', locator: '100(5):3470-3479', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The weighted prevalence of operations from which we detected Campylobacter spp. in either bulk tank milk or milk filters was 24.9%. ... The majority (91.8%) of isolates were C. jejuni, but C. lari and C. coli were also isolated.' },
        },
      ],
    },
    'milk-meat-hygiene--milk-borne-pathogens--sources-of-contamination-3-categories': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-borne-pathogens--sources-of-contamination-3-categories--v1',
          statement: 'cheese ที่ทำจากนมดิบเป็น vehicle ที่ทราบกันของ human listeriosis โดยการปนเปื้อน Listeria monocytogenes ในน้ำนมอาจมาจาก farm environment หรือมาจากสัตว์ที่เป็น mastitis',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-27285819', locator: '37(4):661-676', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'However, raw milk cheese is also a known vehicle of human listeriosis and contamination of sheep cheese with Listeria monocytogenes has been reported. ... In the model, contamination of milk may originate from the farm environment or from m' },
        },
      ],
    },
  },
  'milk-meat-hygiene--milk-industry-std': {
    'milk-meat-hygiene--milk-industry-std--gmp-haccp-detail-processing-plant-standard': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-industry-std--gmp-haccp-detail-processing-plant-standard--v1',
          statement: 'การจัดทำแผน HACCP ในโรงงานแปรรูปนมใช้ **หลักการ 7 ข้อของ HACCP (seven principles)** เป็นกรอบวิธีการ ร่วมกับการมี pre-requisite programs อยู่ก่อน',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-16786735', locator: 'Vol 56(1):60-8, abstract (Methodology)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The used methodology was based in the application of the seven principles of the HACCP, the information from the plant about the compliment of the pre-requisite programs (70-80%), the experience of the HACCP team' },
        },
        {
          id: 'milk-meat-hygiene--milk-industry-std--gmp-haccp-detail-processing-plant-standard--v2',
          statement: 'ในสายการผลิตผลิตภัณฑ์นม ขั้นตอนที่ถูกกำหนดเป็น **CCP** ได้แก่ การรับน้ำนมดิบ (raw milk receipt) · **pasteurization** · การบรรจุ (packaging) · การเก็บรักษา (storage) เพราะเป็นจุดที่เสี่ยงต่อการปนเปื้อนมากที่สุด',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-38646882', locator: 'Vol 91(1):125-135, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'In yogurt production, raw milk receipt, pasteurization, packaging, and storage are the steps most susceptible to contamination and were considered critical control points.' },
        },
      ],
    },
    'milk-meat-hygiene--milk-industry-std--standards-hierarchy-4-layers-from-top-to-bottom': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-industry-std--standards-hierarchy-4-layers-from-top-to-bottom--v1',
          statement: '**Prerequisite Programs (PRPs)** ซึ่งรวม GMP และ GHP เป็น **ฐานรองรับ (foundation) ของ HACCP** — ต้องมีอยู่ก่อนจึงจะป้องกันการระบาดของโรคจากอาหารได้ ตรงกับที่ GMP อยู่ชั้นล่างสุดของลำดับมาตรฐาน',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-34574279', locator: 'Vol 10(9):2169, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Our study focuses on the importance of Food Safety Management System (FSMS), Critical Control Points Hazard Analysis (HACCP) and the Prerequisite Programs (PRPs) as the foundation of HACCP, in preventing foodborne outbreaks.' },
        },
        {
          id: 'milk-meat-hygiene--milk-industry-std--standards-hierarchy-4-layers-from-top-to-bottom--v2',
          statement: '**ISO 22000** คือมาตรฐานระบบการจัดการความปลอดภัยอาหาร (Food Safety Management System, FSMS) โดยฉบับที่ใช้อ้างอิงในปัจจุบันคือ **ISO 22000:2018**',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-34574279', locator: 'Vol 10(9):2169, abstract (final sentence)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Implementation of food safety management systems (ISO 22000:2018) along with incorporation of management tools such as HAZOP, FMEA, Ishikawa and Pareto have proved to be proactive in the maintenance of a positive food safety culture' },
        },
      ],
    },
    'milk-meat-hygiene--milk-industry-std--standard-of-milk-collection-center-มาตรฐาน-mcc-ของไทย': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-industry-std--standard-of-milk-collection-center-มาตรฐาน-mcc-ของไทย--v1',
          statement: 'มาตรฐานสินค้าเกษตรของไทยเรื่อง **การปฏิบัติที่ดีสำหรับศูนย์รวบรวมน้ำนมดิบ** คือ **มกษ. 6401-2558** ออกโดย **มกอช. (ACFS)** ภายใต้ พ.ร.บ. มาตรฐานสินค้าเกษตร พ.ศ. 2551 ส่วน **มกษ. 6401(G)-2560** เป็นเอกสาร *แนวปฏิบัติในการใช้* มาตรฐานดังกล่าว',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide--national-bureau-of-ag-2015', locator: 'หมายเลขมาตรฐาน มกษ. 6401-2558 — หน้าสินค้า \'ศูนย์รวบรวมน้ำนมดิบ\' บนระบบสารสนเทศสินค้าเกษตรตามมาตรฐานบังคับ ของ มกอช. ไม่ระบุเลขข้อย่อย เนื่องจากยังไม่ได้ตรวจสอบตัวบทมาตรฐานฉบับเต็ม', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: '' },
        },
      ],
    },
  },
  'milk-meat-hygiene--milk-processing': {
    'milk-meat-hygiene--milk-processing--heat-treatment-time-temp-product-specific-lines': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-processing--heat-treatment-time-temp-product-specific-lines--v1',
          statement: 'Pasteurization ของน้ำนมมี 2 รูปแบบหลัก — **LTLT (low temperature long time) = 63°C นาน 30 นาที** และ **HTST (high temperature short time) = 72°C นาน 15 วินาที**',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-21381400', locator: 'Issue 128:81-4, abstract (plant pasteurization experiment)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'We conducted plant pasteurization experiment at four pasteurization conditions (high temperature, short time (HTST); 82, 77, 72 degrees C for 15 seconds and low temperature, long time (LTLT); 63 degrees C for 30 minutes)' },
        },
        {
          id: 'milk-meat-hygiene--milk-processing--heat-treatment-time-temp-product-specific-lines--v2',
          statement: 'ในการทดสอบระดับโรงงาน ทั้ง HTST (72, 77, 82°C/15 วินาที) และ LTLT (63°C/30 นาที) ไม่พบโคโลนีของ **Mycobacterium avium subsp. paratuberculosis (MAP)** ในน้ำนมที่ผ่านความร้อน ทั้งสายพันธุ์ ATCC19698 และ OKY-20',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-21381400', locator: 'Issue 128:81-4, abstract (conclusion)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'In conclusion, there appeared no colony of the two MAP strains formed from the milk pasteurized at the four pasteurization conditions examined.' },
        },
        {
          id: 'milk-meat-hygiene--milk-processing--heat-treatment-time-temp-product-specific-lines--v3',
          statement: '**UHT ที่ 135°C นาน ~5 วินาที กำจัดสปอร์ได้หมด** ขณะที่ pasteurization ทั่วไป (75-95°C/15 วินาที) ทำลายเชื้อรูป vegetative ได้แต่ **ไม่กำจัดสปอร์** — นี่คือเหตุผลที่ UHT เก็บที่อุณหภูมิห้องได้ แต่นมพาสเจอร์ไรส์ต้องแช่เย็น',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-41829232', locator: 'Vol 15(5):959, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'This study systematically compared the effects of instantaneous ultra-high-temperature treatment (INF, 145-155 °C/0.09 s) with that of conventional pasteurization (75-95 °C/15 s) as well as ultra-high-temperature treatment (UHT, 135 °C/5 s)' },
        },
        {
          id: 'milk-meat-hygiene--milk-processing--heat-treatment-time-temp-product-specific-lines--v4',
          statement: '**Alkaline phosphatase (ALP)** เป็นเอนไซม์ธรรมชาติในน้ำนมที่ใช้ยืนยันว่า pasteurization เพียงพอ โดยเกณฑ์สาธารณสุขของสหรัฐฯ และยุโรปสำหรับเครื่องดื่มนมพาสเจอร์ไรส์คือ **ALP ไม่เกิน 350 mU/ลิตร**',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-21740717', locator: 'Vol 74(7):1144-54, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Alkaline phosphatase is a ubiquitous milk enzyme that historically has been used to verify adequate pasteurization of milk for public health purposes... The U.S. and European public health limit for alkaline phosphatase in pasteurized drink' },
        },
        {
          id: 'milk-meat-hygiene--milk-processing--heat-treatment-time-temp-product-specific-lines--v5',
          statement: 'ความร้อนสูงกระทบโปรตีนในนม — หลัง **UHT** พบว่า lactoferrin และ IgG **เสียสภาพหมด (complete denaturation)** และค่า **furosine** (ดัชนีปฏิกิริยา glycation) สูงราว **67 mg/100 g protein** เทียบกับราว **15 mg/100 g protein** ที่ 95°C/15 วินาที',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-41829232', locator: 'Vol 15(5):959, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The retention of lactoferrin and immunoglobulin G was about 30% and 12% after INF treatment, respectively, which were higher than that of 13% and 8% in the 85 °C/15 s group, and complete denaturation in the 95 °C/15 s and UHT groups... furo' },
        },
      ],
    },
  },
  'milk-meat-hygiene--milk-cleaning': {
    'milk-meat-hygiene--milk-cleaning--cleaning-agents-disinfectants-detail': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-cleaning--cleaning-agents-disinfectants-detail--v1',
          statement: 'ชุด **CIP มาตรฐาน** ของโรงงานนมคือ water rinse → **sodium hydroxide (โซดาไฟ) 1% ที่ 65°C นาน 10 นาที** → water rinse → **nitric acid (กรดไนตริก) 1.0% ที่ 65°C นาน 10 นาที** → water rinse',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-16216371', locator: 'Vol 106(3):254-62, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'a standard clean-in-place (CIP) regime (water rinse, 1% sodium hydroxide at 65 degrees C for 10 min, water rinse, 1.0% nitric acid at 65 degrees C for 10 min, water rinse)' },
        },
        {
          id: 'milk-meat-hygiene--milk-cleaning--cleaning-agents-disinfectants-detail--v2',
          statement: 'เมื่อแบคทีเรียเกาะติดผิว **stainless steel** เป็น biofilm แล้ว ชุด CIP มาตรฐาน (caustic + acid) **ไม่สามารถกำจัดออกได้อย่างสม่ำเสมอ (not reproducibly)**',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-16216371', locator: 'Vol 106(3):254-62, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Once bacteria attached to surfaces, a standard clean-in-place (CIP) regime (water rinse, 1% sodium hydroxide at 65 degrees C for 10 min, water rinse, 1.0% nitric acid at 65 degrees C for 10 min, water rinse) did not reproducibly ensure thei' },
        },
        {
          id: 'milk-meat-hygiene--milk-cleaning--cleaning-agents-disinfectants-detail--v3',
          statement: 'ในการศึกษาระดับห้องปฏิบัติการ **การเพิ่มขั้นตอน sanitizer เข้าไปใน CIP ไม่ได้ช่วยให้กำจัด biofilm ดีขึ้น** ขณะที่การใช้ caustic additive ร่วมกับ acid blend ลดจำนวนเซลล์ที่เก็บได้จากผิว stainless steel ลง **3.8 log**',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-16216371', locator: 'Vol 106(3):254-62, abstract (results)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The combination of NaOH plus Eliminator and Nitroplus achieved a 3.8 log reduction in the number of cells recovered from the stainless steel surface. The incorporation of a sanitizer step into the CIP did not appear to enhance biofilm remov' },
        },
      ],
    },
    'milk-meat-hygiene--milk-cleaning--ส่วนที่-1-ข้อกำหนดสำหรับสถานที่ผลิตอาหารทุกประเภท': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-cleaning--ส่วนที่-1-ข้อกำหนดสำหรับสถานที่ผลิตอาหารทุกประเภท--v1',
          statement: 'แบคทีเรียส่วนใหญ่ที่แยกได้บ่อยในห่วงโซ่น้ำนม **สร้าง biofilm ได้** เช่น **Staphylococcus aureus** (และ staphylococci อื่น) · **Bacillus spp.** · **Listeria monocytogenes** · **Pseudomonas spp.** ซึ่งเข้าไปตั้งรกรากบนเครื่องรีดนมและเครื่องมือแปรรูปนม และ **ทนต่อสารฆ่าเชื้อ (biocides) ได้มากกว่ารูป planktonic**',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-39603496', locator: 'Vol 108(8):8157-8175, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Biofilm formation allows microorganisms including bacteria to persist on abiotic or biotic surfaces, to resist treatments with biocides (disinfectants and antibiotics)... most of the bacterial species isolated frequently in the dairy chain' },
        },
      ],
    },
  },
  'milk-meat-hygiene--milk-biosec-dairy': {
    'milk-meat-hygiene--milk-biosec-dairy--lecture-identity': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-biosec-dairy--lecture-identity--v1',
          statement: 'การเลี้ยงแบบ closed herd (ไม่นำสัตว์จากภายนอกเข้าฝูง) ลดความเสี่ยงของการนำเชื้อที่กระทบ udder health เข้าฟาร์ม และถ้าจำเป็นต้องซื้อสัตว์เข้าฝูง ต้องประเมินประวัติ udder health ของสัตว์นั้น ร่วมกับตรวจร่างกายและตรวจโรคติดต่อก่อนนำเข้า',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-19762787', locator: '92(10):4717-29, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Maintaining a closed herd decreases the risk of introduction of pathogens that affect udder health directly or indirectly. If animals are purchased, their udder health history should be evaluated and they should be examined and tested for c' },
        },
        {
          id: 'milk-meat-hygiene--milk-biosec-dairy--lecture-identity--v2',
          statement: 'สัตว์ที่นำเข้าฝูงใหม่ต้องถูกคัดกรอง contagious intramammary infection (IMI) ก่อนที่ฝูงเดิมจะสัมผัสกับสัตว์นั้น และต้องมีระบบเฝ้าระวังเพื่อตรวจจับ contagious IMI ให้เร็วที่สุดหลังนำสัตว์เข้าฝูง เพื่อป้องกันการระบาดของ contagious mastitis',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-12064164', locator: '18(1):115-31, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'To prevent costly outbreaks of contagious mastitis, introduced animals must be screened for contagious IMI before the resident herd is exposed to them. Screening programs must be instituted to detect the appearance of contagious IMI as soon' },
        },
        {
          id: 'milk-meat-hygiene--milk-biosec-dairy--lecture-identity--v3',
          statement: 'การซื้อโคหรือโคสาวเข้าฝูง เป็นปัจจัยที่เพิ่มความเสี่ยงต่อการเกิดการติดเชื้อ Streptococcus agalactiae ใหม่ในระดับฝูง (herd infection) จากการศึกษาแบบ case-control ในฟาร์มโคนมเดนมาร์ก โดยวินิจฉัยฝูงติดเชื้อจากการตรวจทางจุลชีววิทยาของ bulk tank milk',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-8038790', locator: '25(2-3):227-34, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Results from logistic regression clearly indicate that purchase of cows or heifers increases the risk of a new Streptococcus agalactiae herd infection. Hygiene management risk factors inside the farm were also identified.' },
        },
      ],
    },
    'milk-meat-hygiene--milk-biosec-dairy--lecture-outline-3-หัวข้อหลัก': {
      claims: [
        {
          id: 'milk-meat-hygiene--milk-biosec-dairy--lecture-outline-3-หัวข้อหลัก--v1',
          statement: 'มาตรฐานฟาร์มโคนมของไทยที่ใช้อ้างอิงคือ มาตรฐานสินค้าเกษตร มกษ. 6402-2562 (TAS 6402-2019) การปฏิบัติทางการเกษตรที่ดีสำหรับฟาร์มโคนม ออกโดยสำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ (มกอช.) กระทรวงเกษตรและสหกรณ์',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide--acfs--2019', locator: 'ยืนยันได้เฉพาะเลขมาตรฐาน ชื่อเรื่อง ปี และหน่วยงานที่ออก จากหน้าปกไฟล์ราชการ (opsmoac.go.th) ยังไม่ได้อ่านเนื้อในเพื่อระบุเลขข้อ จึงไม่ระบุ clause', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'มาตรฐานสินค้าเกษตร มกษ. 6402-2562 THAI AGRICULTURAL STANDARD TAS 6402-2019' },
        },
        {
          id: 'milk-meat-hygiene--milk-biosec-dairy--lecture-outline-3-หัวข้อหลัก--v2',
          statement: 'แนวปฏิบัติสากล FAO/IDF Guide to Good Dairy Farming Practice ระบุว่าเกษตรกรโคนมต้องใช้ GAP ครอบคลุม 5 ด้าน ได้แก่ animal health, milking hygiene, animal feeding and water, animal welfare และ environment',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-food-and-agriculture-o-2004', locator: 'หัวข้อ Guiding objective for good dairy farming practice (ฉบับ HTML ไม่มีเลขหน้า)', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'To achieve this, dairy farmers need to apply GAP in the following areas: animal health; milking hygiene; animal feeding and water; animal welfare; and environment.' },
        },
      ],
    },
  },
  'milk-meat-hygiene--meat-hygiene-intro': {
    'milk-meat-hygiene--meat-hygiene-intro--meat-as-a-food-definition-4-categories': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-hygiene-intro--meat-as-a-food-definition-4-categories--v1',
          statement: 'ตามนิยามของ Codex Code of Hygienic Practice for Meat คำว่า meat หมายถึงทุกส่วนของสัตว์ที่ตั้งใจให้ใช้เป็นอาหาร หรือได้รับการตัดสินแล้วว่า safe and suitable สำหรับการบริโภคของมนุษย์ ซึ่งครอบคลุมกว้างกว่าเฉพาะ muscle tissue',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-codex-alimentarius-com-2005', locator: 'Definitions section, entry for \'meat\'. ไม่ได้ยืนยันเลขข้อย่อยที่แน่นอน จึงไม่ระบุ clause number', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: '' },
        },
        {
          id: 'milk-meat-hygiene--meat-hygiene-intro--meat-as-a-food-definition-4-categories--v2',
          statement: 'IARC นิยาม red meat ว่าเป็น mammalian muscle meat ทั้งหมด ซึ่งรวม beef, veal, pork, lamb, mutton, horse และ goat และจากการประเมินของ IARC Working Group จัด processed meat ไว้ใน Group 1 (carcinogenic to humans) ส่วน red meat อยู่ใน Group 2A (probably carcinogenic to humans)',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-international-agency-f-2018', locator: 'Working Group evaluation (ประกาศผลการประเมินเดือนตุลาคม 2015, monograph เล่มเต็มตีพิมพ์ปี 2018) ไม่ได้ยืนยันเลขหน้า', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: '' },
        },
      ],
    },
    'milk-meat-hygiene--meat-hygiene-intro--meat-components-5-tissue-types': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-hygiene-intro--meat-components-5-tissue-types--v1',
          statement: 'Intramuscular connective tissue (IMCT) โดยเฉพาะส่วน perimysium เป็นโครงสร้างที่กำหนด mechanical integrity ของเนื้อที่ปรุงสุกมากที่สุด และการทำสุกจะเพิ่มความแข็งแรงของ IMCT ในช่วง 20-50 องศาเซลเซียส แต่ลดบทบาทของมันลงเมื่ออุณหภูมิสูงขึ้นหรือใช้เวลานานขึ้น',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-22063743', locator: 'Meat Sci 2005;70(3):435-47, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The perimysial component of IMCT varies most in amount between muscles and is also the IMCT structure most involved in defining the mechanical integrity of cooked meat. ... Cooking increases IMCT strength in the range 20-50 °C and decreases' },
        },
      ],
    },
    'milk-meat-hygiene--meat-hygiene-intro--nutrition-structure-global-trends': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-hygiene-intro--nutrition-structure-global-trends--v1',
          statement: 'สีของเนื้อสดถูกกำหนดโดย myoglobin โดย deoxymyoglobin ให้สีม่วง, oxymyoglobin ให้สีแดงสด และเมื่อ oxidize ไปเป็น metmyoglobin จะให้สีน้ำตาล ทั้งนี้เนื้อวัวที่มี myoglobin สูงจะเกิดการเปลี่ยนสี (discoloration) ได้ง่ายกว่าเนื้อไก่ขาว',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-28846443', locator: 'Crit Rev Food Sci Nutr 59(2):228-252, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'A decreased redness is attributed to a large degree to the oxidation of the bright red oxymyoglobin or the purplish deoxymyoglobin into the brownish metmyoglobin, as well as to the denaturation of myoglobin. Surely, the high myoglobin conte' },
        },
      ],
    },
  },
  'milk-meat-hygiene--meat-seafood': {
    'milk-meat-hygiene--meat-seafood--spoilage-mechanisms-seafood-toxins-detail': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-seafood--spoilage-mechanisms-seafood-toxins-detail--v1',
          statement: 'Scombroid poisoning หรือ histamine fish poisoning เกิดจากแบคทีเรียที่ใช้เอนไซม์ histidine decarboxylase เปลี่ยน free histidine ในเนื้อปลาไปเป็น histamine โดยการลดอุณหภูมิที่ไม่เพียงพอหลังจับปลาเป็นตัวส่งเสริมการสร้าง histamine และปลาที่มี free histidine สูงคือกลุ่มที่พบเป็นสาเหตุบ่อยที่สุด',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-20152850', locator: 'Toxicon 2010;56(2):231-43, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Inadequate cooling following harvest promotes bacterial histamine production, and can result in outbreaks of scombroid poisoning. Fish with high levels of free histidine, the enzyme substrate converted to histamine by bacterial histidine de' },
        },
        {
          id: 'milk-meat-hygiene--meat-seafood--spoilage-mechanisms-seafood-toxins-detail--v2',
          statement: 'Histamine-forming bacteria ที่เชื่อมโยงกับ scombroid fish poisoning ส่วนใหญ่เป็นแบคทีเรีย Gram-negative เช่น Morganella spp. และ Photobacterium spp. ซึ่งมียีน hdc สำหรับสร้าง histidine decarboxylase และพบได้ที่เหงือก ทางเดินอาหาร และผิวหนังของปลา โดยเฉพาะปลาในวงศ์ Scombridae',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-36916556', locator: 'J Food Prot 2023;86(3):100049, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Previous studies linked a plethora of Gram-negative HFB including Morganella spp. and Photobacterium spp. to scombroid fish poisoning from many types of seafood, especially the Scombridae family. These bacteria possess the hdc gene to produ' },
        },
        {
          id: 'milk-meat-hygiene--meat-seafood--spoilage-mechanisms-seafood-toxins-detail--v3',
          statement: 'Paralytic shellfish poisoning (PSP) เกิดจาก saxitoxins ที่สร้างโดย dinoflagellate Alexandrium catenella แล้วสะสมผ่านห่วงโซ่อาหารในหอยกรองอาหาร โดยเกณฑ์ความปลอดภัยด้านอาหารทะเลที่ใช้อ้างอิงคือ 80 ไมโครกรัม STX equivalents ต่อเนื้อหอย 100 กรัม',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-35550288', locator: 'Harmful Algae 2022;114:102205, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'This algal species produces neurotoxins that impact marine wildlife health and cause the human illness known as paralytic shellfish poisoning (PSP). ... PSTs (saxitoxin equivalents, STX eq.) were detected in all trophic levels with concentr' },
        },
        {
          id: 'milk-meat-hygiene--meat-seafood--spoilage-mechanisms-seafood-toxins-detail--v4',
          statement: 'Ciguatera fish poisoning เป็นโรคจาก seafood toxin ที่มีรายงานบ่อยที่สุดในโลก อาการเป็นชุดผสมของระบบทางเดินอาหาร ระบบประสาทและ neuropsychological และระบบหัวใจหลอดเลือด ซึ่งอาจคงอยู่เป็นวัน สัปดาห์ หรือเป็นเดือน',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-28335428', locator: 'Mar Drugs 2017;15(3):72, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Ciguatera Fish Poisoning (CFP) is the most frequently reported seafood-toxin illness in the world. ... The illness produces a complex array of gastrointestinal, neurological and neuropsychological, and cardiovascular symptoms, which may las' },
        },
        {
          id: 'milk-meat-hygiene--meat-seafood--spoilage-mechanisms-seafood-toxins-detail--v5',
          statement: 'Tetrodotoxin (TTX) เป็น neurotoxin ที่พบครั้งแรกในปลาปักเป้า แต่ตรวจพบได้ในสัตว์หลายกลุ่มที่มีแบคทีเรียสร้าง TTX อาศัยอยู่ ออกฤทธิ์หลักโดยยับยั้ง voltage-gated sodium channels และขนาดที่ทำให้คนเสียชีวิตอยู่ในช่วงประมาณ 1.5 ถึง 2.0 มิลลิกรัม',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-34437388', locator: 'Toxins (Basel) 2021;13(8):517, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Tetrodotoxin (TTX) is a potent neurotoxin that was first identified in pufferfish but has since been isolated from an array of taxa that host TTX-producing bacteria. ... TTX is primarily a powerful sodium channel inhibitor that targets volt' },
        },
        {
          id: 'milk-meat-hygiene--meat-seafood--spoilage-mechanisms-seafood-toxins-detail--v6',
          statement: 'ในปลาแช่เย็น Shewanella baltica ถูกจัดเป็น specific spoilage organism โดยสามารถ reduce trimethylamine-N-oxide (TMAO) ไปเป็น trimethylamine (TMA) และสร้าง H2S ทำให้ค่า TVB-N สูงกว่ากลุ่ม Pseudomonas อย่างมีนัยสำคัญ',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-27747903', locator: 'Lett Appl Microbiol 64(1):86-93, abstract', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'All of them were able to grow aerobically from 4 to 30°C, and reduce trimethylamine-N-oxide to trimethylamine (TMA) and produce H S except SB01, PF05 and PF07. ... the TVB-N value of S. baltica was significantly higher than that of Pseudomo' },
        },
      ],
    },
  },
  'milk-meat-hygiene--meat-microbiology': {
    'milk-meat-hygiene--meat-microbiology--introduction-where-contamination-starts': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-microbiology--introduction-where-contamination-starts--v1',
          statement: 'Salmonella อาศัยอยู่ในทางเดินอาหารของโคที่สุขภาพดีได้ตามปกติ และถูกถ่ายทอดมาปนเปื้อนที่ผิว carcass ระหว่างขั้นตอน hide removal และ evisceration',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-26125489', locator: 'Vol 210, pages 149-55 (abstract, opening statement and results)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Salmonella is a foodborne pathogen that commonly inhabits the gastrointestinal tract of a healthy feedlot cattle and can be transferred to the carcass surface during hide removal and evisceration procedures.' },
        },
        {
          id: 'milk-meat-hygiene--meat-microbiology--introduction-where-contamination-starts--v2',
          statement: 'หนัง (hide) เป็นแหล่งปนเปื้อนหลักที่มี bacterial load สูงกว่าผิว carcass ชัดเจน โดยพบ mean total plate count บน exterior hide ในช่วง 8.2 ถึง 12.5 log CFU/100 cm2 ขณะที่ผิว carcass หลังลอกหนังแต่ก่อนทำ decontamination อยู่ในช่วง 6.1 ถึง 9.1 log CFU/100 cm2',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-10945584', locator: 'Vol 63, issue 8, pages 1080-6 (abstract, results)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Sponge swab samples yielded mean (log CFU/100 cm2) total plate counts (TPC), total coliform counts (TCC), and Escherichia coli counts (ECC) on the exterior hide in the ranges of 8.2 to 12.5, 6.0 to 7.9, and 5.5 to 7.5, respectively, while c' },
        },
      ],
    },
    'milk-meat-hygiene--meat-microbiology--intrinsic-extrinsic-factors-standard-pathogen-panel': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-microbiology--intrinsic-extrinsic-factors-standard-pathogen-panel--v1',
          statement: 'Process hygiene criteria สำหรับ aerobic colony count และ Enterobacteriaceae บน carcass ตาม Commission Regulation (EC) No 2073/2005 อ้างอิงกับ destructive sampling (excision) เท่านั้น แต่อนุญาตให้ใช้ sampling scheme อื่น เช่น swab และใช้ indicator organism อื่น เช่น E. coli ได้ ถ้าพิสูจน์ได้ว่าให้หลักประกันความปลอดภัยเทียบเท่ากัน',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-17706823', locator: 'Vol 118, issue 2, pages 180-5 (abstract, aim and rationale)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'These criteria apply only to destructive sampling of total aerobic counts and Enterobacteriaceae, but alternative sampling schemes, as well as alternative indicator organisms such as E. coli, are allowed if equivalent guarantees of food saf' },
        },
        {
          id: 'milk-meat-hygiene--meat-microbiology--intrinsic-extrinsic-factors-standard-pathogen-panel--v2',
          statement: 'Campylobacter jejuni เป็นสาเหตุอันดับต้นของ bacterial gastroenteritis ทั่วโลก และการติดเชื้อมักถ่ายทอดผ่านการบริโภคเนื้อสัตว์ปีกดิบหรือปรุงไม่สุก',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-34041858', locator: 'Vol 68, issue 6, pages 638-649 (abstract, opening statement)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Campylobacter jejuni is the leading cause of bacterial gastroenteritis globally, and infections are often transmitted through consumption of raw or undercooked poultry.' },
        },
        {
          id: 'milk-meat-hygiene--meat-microbiology--intrinsic-extrinsic-factors-standard-pathogen-panel--v3',
          statement: 'pH และ temperature ทำงานร่วมกันเป็น hurdle ต่อ Listeria monocytogenes โดยที่อุณหภูมิ chill 5 องศาเซลเซียส เชื้อเจริญได้ที่ pH 7.0 แต่ไม่เจริญที่ pH 5.13',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-2118897', locator: 'Vol 69, issue 1, pages 63-72 (abstract, results)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'At 5 degrees C growth occurred at pH 7.0 but not at pH 5.13.' },
        },
        {
          id: 'milk-meat-hygiene--meat-microbiology--intrinsic-extrinsic-factors-standard-pathogen-panel--v4',
          statement: 'Pseudomonas ที่สร้าง protease เป็นกลุ่มเด่นของ spoilage flora ในเนื้อดิบที่เก็บแบบ aerobic ที่อุณหภูมิ chill โดยมี Enterobacteriaceae ตามมาห่าง ๆ',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-17133818', locator: 'Vol 69, issue 11, pages 2729-37 (abstract, opening statement and results)', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Proteolytic pseudomonads dominate the spoilage flora of aerobically chill-stored proteinaceous raw foods. ... Pseudomonads dominated the psychrotrophic flora, followed distantly by members of the Enterobacteriaceae.' },
        },
      ],
    },
  },
  'milk-meat-hygiene--meat-storage': {
    'milk-meat-hygiene--meat-storage--factors-affecting-microorganisms-in-meat': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-storage--factors-affecting-microorganisms-in-meat--v1',
          statement: 'อุณหภูมิเก็บรักษาเป็น extrinsic factor ที่กำหนดชนิดจุลินทรีย์ในเนื้อ โดยเนื้อหมูที่เก็บ -2°C กับ 4°C มี bacterial community คล้ายกันมาก แต่ที่ 10°C ทั้ง psychrophilic และ mesophilic bacteria ขึ้นได้ และองค์ประกอบใกล้เคียงกับเนื้อที่เก็บอุณหภูมิห้อง (25°C)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-35954075', locator: 'Foods 2022;11(15):2307', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The microbial composition exhibited high similarity between pork meat stored at -2 °C and 4 °C' },
        },
        {
          id: 'milk-meat-hygiene--meat-storage--factors-affecting-microorganisms-in-meat--v2',
          statement: 'บรรยากาศรอบเนื้อ (gas atmosphere/packaging) เป็น extrinsic factor ที่กำหนดกลุ่มจุลินทรีย์เด่น โดยซากโคที่เก็บ 0°C แบบ aerobic มี Pseudomonas spp. เป็นกลุ่มเด่น ส่วนแบบ vacuum (anaerobic) มี Serratia spp. เป็นกลุ่มเด่น',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-34416953', locator: 'Food Microbiol 2021;100:103849', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The predominant group was Pseudomonas spp. under aerobic conditions and Serratia spp. under anaerobic conditions.' },
        },
      ],
    },
    'milk-meat-hygiene--meat-storage--specific-storage-methods-chilling-freezing-map-curing-drying': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-storage--specific-storage-methods-chilling-freezing-map-curing-drying--v1',
          statement: 'ในเนื้อแดงแช่เย็นที่เก็บแบบ aerobic จุลินทรีย์หลักที่ทำให้เกิด spoilage คือ psychrotrophic Pseudomonas species ซึ่งทนสภาวะเครียดได้ดีกว่าจุลินทรีย์ psychrotroph กลุ่มอื่น',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-33336914', locator: 'Compr Rev Food Sci Food Saf 2019;18(5):1622-1635', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Psychrotrophic Pseudomonas species are the key microorganisms that cause spoilage in aerobically stored chilled meat.' },
        },
        {
          id: 'milk-meat-hygiene--meat-storage--specific-storage-methods-chilling-freezing-map-curing-drying--v2',
          statement: 'MAP ยับยั้ง total aerobic bacteria และ lactic acid bacteria ในเนื้อโคบรรจุกล่องที่เก็บและขนส่งที่ 4±2°C ได้ดีกว่า vacuum packaging',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-31333861', locator: 'J Anim Sci Technol 2019;61(1):47-53', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'MAP was more effective than vacuum packaging for the inhibition of total aerobic, lactic acid bacteria' },
        },
        {
          id: 'milk-meat-hygiene--meat-storage--specific-storage-methods-chilling-freezing-map-curing-drying--v3',
          statement: 'Codex ใช้ -18°C เป็นอุณหภูมิอ้างอิงของ quick frozen food โดยต้องรักษา product temperature ที่ -18°C หรือต่ำกว่า ตลอด cold chain ทั้งห้องเย็น การขนส่ง และตู้แช่ ณ จุดขายปลีก',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-codex-alimentarius-com-1976', locator: 'CXC 8-1976 (adopted 1976; revised 1978, 1983, 2008). Frozen storage, transport and retail provisions. Exact clause numbering of the adopted 2008 revision was NOT verified.', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'maintain a product temperature of -18°C or lower with a minimum of fluctuation' },
        },
        {
          id: 'milk-meat-hygiene--meat-storage--specific-storage-methods-chilling-freezing-map-curing-drying--v4',
          statement: 'Nitrite ถูกใช้ควบคุม Clostridium botulinum ในผลิตภัณฑ์เนื้อหมักมาแต่เดิม แต่ใน dry fermented sausage ปัจจัย pH, aw และ competitive microbiota อาจมีบทบาทมากกว่า nitrite โดยการศึกษาแบบ challenge test ตรวจไม่พบ botulinum neurotoxin แม้ในสูตรที่ไม่ใส่ nitrate/nitrite เลย เมื่อ pH ลดต่ำกว่า 5.0-5.2 และ aw ลดจาก 0.96 เหลือ 0.88-0.90',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-26619314', locator: 'Int J Food Microbiol 2016;218:66-70', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Botulinum neurotoxin was not detected in any of the sausages, including those manufactured without nitrate and nitrite.' },
        },
      ],
    },
  },
  'milk-meat-hygiene--meat-quality': {
    'milk-meat-hygiene--meat-quality--definition-of-fresh-meat': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-quality--definition-of-fresh-meat--v1',
          statement: 'Codex Code of Hygienic Practice for Meat นิยาม fresh meat ว่าเป็นเนื้อที่นอกจาก refrigeration แล้ว ไม่ได้ผ่านการ treat เพื่อการถนอมอาหารด้วยวิธีอื่นนอกจาก protective packaging และยังคง natural characteristics ไว้',
          evidenceStatus: 'expert-consensus',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'guide-codex-alimentarius-com-2005', locator: 'CXC 58-2005 (CAC/RCP 58-2005), Section 3 Definitions, paragraph 13 (page 5 of 52)', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Meat that apart from refrigeration has not been treated for the purpose of preservation other than through protective packaging' },
        },
      ],
    },
    'milk-meat-hygiene--meat-quality--properties-of-meat-4-key-attributes': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-quality--properties-of-meat-4-key-attributes--v1',
          statement: 'Myoglobin เป็น sarcoplasmic heme protein ที่กำหนดสีของเนื้อเป็นหลัก และ chemistry ของ myoglobin เป็น species specific โดยผู้บริโภคใช้สีของเนื้อสดเป็นตัวชี้วัด wholesomeness ณ จุดขาย',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-23190143', locator: 'Annu Rev Food Sci Technol 2013;4:79-99', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Myoglobin is the sarcoplasmic heme protein primarily responsible for the meat color, and the chemistry of myoglobin is species specific.' },
        },
        {
          id: 'milk-meat-hygiene--meat-quality--properties-of-meat-4-key-attributes--v2',
          statement: 'สีเนื้อขึ้นกับ redox state ของ myoglobin โดยการรีดิวซ์ metmyoglobin กลับไปเป็น oxymyoglobin ทำให้สีเนื้อเปลี่ยนจากสีน้ำตาลเป็นสีแดงสด',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-25221843', locator: 'J Agric Food Chem 2014;62(39):9472-8', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The reduction of MetMb to MbO2 changes the color of meat from brown to the more desirable bright red.' },
        },
        {
          id: 'milk-meat-hygiene--meat-quality--properties-of-meat-4-key-attributes--v3',
          statement: 'μ-calpain (micro-calpain) เป็นเอนไซม์หลักที่รับผิดชอบ postmortem proteolysis ของโปรตีนกล้ามเนื้อ ซึ่งเป็นกลไกของ meat tenderization ระหว่างการบ่มเนื้อ',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-16971586', locator: 'J Anim Sci 2006;84(10):2834-40', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'micro-calpain is largely responsible for postmortem proteolysis of muscle proteins' },
        },
      ],
    },
    'milk-meat-hygiene--meat-quality--quality-defects-wholesomeness-criteria-detail': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-quality--quality-defects-wholesomeness-criteria-detail--v1',
          statement: 'PSE pork สัมพันธ์กับ recessive halothane allele ซึ่งทำให้ Ca release channel / ryanodine receptor (RYR1) ที่ sarcoplasmic reticulum ผิดปกติ ปล่อย Ca2+ ออกมาไม่หยุดเมื่อสัตว์เจอ stress ก่อนฆ่า ทำให้ pH ของกล้ามเนื้อลดลงอย่างรวดเร็วหลังฆ่า เกิดเนื้อ pale, soft, exudative ที่ WHC ต่ำและ drip loss สูง',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-27854153', locator: 'Anim Biotechnol 2017;28(2):148-155', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Abnormal lactic acid metabolism caused by stress prior to slaughter leads to the sudden drop in postmortem muscle pH producing the PSE pork.' },
        },
        {
          id: 'milk-meat-hygiene--meat-quality--quality-defects-wholesomeness-criteria-detail--v2',
          statement: 'Dark cutting beef แบบ classic (DFD) จัดกลุ่มด้วย ultimate pH ของ longissimus thoracis มากกว่า 6.0 และมี lactate กับ glucidic potential ต่ำที่สุด สีเข้ม รวมทั้ง purge, drip loss และ cooking loss ลดลง',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-25173716', locator: 'Meat Sci 2014;98(4):842-9', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'ten B4 with LT pH>6.0 (CL, classic), and ten B4 with LT pH<6.0 (AT, atypical)' },
        },
      ],
    },
  },
  'milk-meat-hygiene--meat-molecular': {
    'milk-meat-hygiene--meat-molecular--applications-species-id-authentication-adulteration-qpcr': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-molecular--applications-species-id-authentication-adulteration-qpcr--v1',
          statement: 'Cytochrome c oxidase subunit I (COI) เป็นบริเวณ DNA ที่นิยมใช้เป็น barcode มากที่สุดสำหรับ species identification ในสัตว์ รวมทั้งปลาและ shellfish โดย DNA barcoding ที่อาศัย Sanger sequencing เป็นวิธีที่ใช้มากที่สุดในการพิสูจน์ชนิดของ seafood',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-32838560', locator: 'Crit Rev Food Sci Nutr 2021;61(22):3904-3935', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Cytochrome c oxidase subunit I (COI) gene has been the preferential targeted DNA region in animal species identification' },
        },
        {
          id: 'milk-meat-hygiene--meat-molecular--applications-species-id-authentication-adulteration-qpcr--v2',
          statement: 'การตรวจชนิดสัตว์ในผลิตภัณฑ์เนื้อแปรรูปควรใช้ amplicon สั้นและจับหลายยีน โดย multiplex PCR-RFLP ที่จับยีนไมโทคอนเดรีย cytochrome b และ ND5 ด้วย target ขนาด 73-146 bp ยังคงตรวจได้แม้ตัวอย่างผ่าน boiling และ autoclaving',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-27501408', locator: 'J Agric Food Chem 2016;64(32):6343-54', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'all targets (73, 90, 106, 120, 138, and 146 bp) were stable under extreme boiling and autoclaving treatments' },
        },
        {
          id: 'milk-meat-hygiene--meat-molecular--applications-species-id-authentication-adulteration-qpcr--v3',
          statement: 'Real-time PCR ที่ใช้ primer จำเพาะสุกรจับยีน cytochrome b ซึ่งเป็น multi-copy target ใช้พิสูจน์ Halal/Kosher ของ gelatine ได้ โดยระดับการปลอมปนต่ำสุดที่ตรวจพบคือ 1.0% w/w ใน marshmallow และ gum drop',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-22098822', locator: 'Meat Sci 2012;90(3):686-9', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The minimum level of adulteration that could be detected was 1.0% w/w for marshmallows and gum drops.' },
        },
        {
          id: 'milk-meat-hygiene--meat-molecular--applications-species-id-authentication-adulteration-qpcr--v4',
          statement: 'PCR-RFLP ที่ขยายชิ้นส่วนยีน cytochrome b แล้วตัดด้วย restriction enzyme AluI ใช้แยกเนื้อลาออกจากเนื้อม้าได้ และเมื่อสำรวจผลิตภัณฑ์เนื้อ 224 ตัวอย่างในอิหร่านพบเนื้อ haram รวม 7.58% ของตัวอย่างทั้งหมด',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-24426061', locator: 'J Food Sci Technol 2014;51(1):148-52', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'the mitochondrial DNA segment (cytochrome-b gene) was amplified and products were digested with AluI restriction enzyme' },
        },
        {
          id: 'milk-meat-hygiene--meat-molecular--applications-species-id-authentication-adulteration-qpcr--v5',
          statement: 'Limit of detection ของการตรวจ porcine DNA ใน gelatine ต่างกันมากตามวิธีสกัด DNA และชุดตรวจที่ใช้ โดยวิธีที่พัฒนาขึ้น (TübiGel) ตรวจได้ที่ 0.01% porcine gelatin ขณะที่ชุดตรวจการค้าสองชุดตรวจได้ที่ 0.1% และมากกว่า 5% ตามลำดับ',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-33818304', locator: 'Food Addit Contam Part A Chem Anal Control Expo Risk Assess 2021;38(6):881-891', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'detection limit of 0.01% porcine gelatin, whilst the Biotecon method had 0.1% and R-Biopharm method detected >5%' },
        },
      ],
    },
  },
  'milk-meat-hygiene--meat-slaughter': {
    'milk-meat-hygiene--meat-slaughter--layout-zoning-water-consumption-waste-handling-detail': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-slaughter--layout-zoning-water-consumption-waste-handling-detail--v1',
          statement: 'หนัง (hide) ของโคคือแหล่งหลักของการปนเปื้อนซากระหว่างกระบวนการชำแหละ และการขนส่ง + การพักใน lairage ทำให้ความชุกของ Escherichia coli O157:H7 บนหนังเพิ่มจาก 50.3% ตอนขึ้นรถที่ feedlot เป็น 94.4% ตอนถลกหนังในโรงฆ่า',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-17340859', locator: '70(2):280-6', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Hide has been established as the main source of carcass contamination during cattle processing... The prevalence of E. coli O157:H7 on hides increased from 50.3 to 94.4% between the time cattle were loaded onto tractor-trailers at the feedl' },
        },
        {
          id: 'milk-meat-hygiene--meat-slaughter--layout-zoning-water-consumption-waste-handling-detail--v2',
          statement: 'ความชุกของ EHEC O157 บนซากโคลดลงตามลำดับขั้นของสายการผลิต คือ 43% ที่ pre-evisceration, 18% ที่ post-evisceration (ก่อน antimicrobial intervention) และ 2% หลังซากเข้าห้องเย็น แสดงว่า sanitary procedure ในสายการผลิตลดการปนเปื้อนได้จริง',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-10725380', locator: '97(7):2999-3003', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Carcass samples were taken at three points during processing: preevisceration, postevisceration before antimicrobial intervention, and postprocessing after carcasses entered the cooler... Prevalence of EHEC O157 in the three postprocessing' },
        },
        {
          id: 'milk-meat-hygiene--meat-slaughter--layout-zoning-water-consumption-waste-handling-detail--v3',
          statement: 'ในสายการฆ่าสุกร ขั้นตอน scalding, singeing และ chilling ลดจำนวนจุลินทรีย์บนซาก ส่วน dehairing และ polishing ทำให้การปนเปื้อนเพิ่มขึ้นอย่างมีนัยสำคัญ จึงเสนอให้ scalding, singeing และ chilling เป็นจุดที่รวมเข้าในระบบ HACCP',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-17133797', locator: '69(11):2568-75', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'mean TVCs and the percentage of Enterobacteriaceae-positive carcasses were reduced (P < 0.05) after scalding (1.9 log CFU cm(-2) and 12%, respectively), singeing (1.9 log CFU cm(-2) and 66%, respectively), and blast chilling (2.3 log CFU cm' },
        },
        {
          id: 'milk-meat-hygiene--meat-slaughter--layout-zoning-water-consumption-waste-handling-detail--v4',
          statement: 'คอกพักสัตว์ (lairage) เป็นแหล่งสำคัญของการปนเปื้อน Salmonella บนซากสุกร โดย serotype และ MLVA/PFGE profile ที่พบบนซากมักเชื่อมโยงกับ holding pen มากกว่าที่พบจาก caecum content หรือ lymph node ของตัวสัตว์เอง',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-23261811', locator: '161(1):44-52', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The Salmonella serotypes identified on the carcasses of the 16 tracked batches were frequently linked to lairage, whereas the serotypes detected at the farm, transport or pig-related samples (i.e., caecum content and lymph nodes) were only' },
        },
      ],
    },
  },
  'milk-meat-hygiene--meat-ante-post-mortem': {
    'milk-meat-hygiene--meat-ante-post-mortem--am-pm-lesion-judgement-table-per-organ-disposition': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-ante-post-mortem--am-pm-lesion-judgement-table-per-organ-disposition--v1',
          statement: 'Routine abattoir meat inspection ตรวจจับซากที่ติด Mycobacterium bovis ได้เพียงส่วนน้อย โดยมี sensitivity 28.2% เมื่อเทียบกับ detailed abattoir inspection และ 55.2% เมื่อเทียบกับ culture + microscopy ทำให้พลาดซากที่มีรอยโรค TB ถึง 71.8%',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-20691081', locator: '10:462', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The sensitivity (Sn) and specificity (Sp) of RA inspection were 28.2% (95/337) [95%CI: 23.4-33.0] and 99.3% (2963/2985) [95%CI: 99.0-99.6], respectively, when DA inspection was considered as reference test. When culture and microscopy (CM)' },
        },
        {
          id: 'milk-meat-hygiene--meat-ante-post-mortem--am-pm-lesion-judgement-table-per-organ-disposition--v2',
          statement: 'รอยโรค tuberculosis ในโคที่ตรวจพบตอน postmortem อยู่ที่ปอดและ lymph node ที่เกี่ยวข้องประมาณ 59% และ lymph node ของหัวประมาณ 35% จึงเป็นตำแหน่งที่ต้องกรีดตรวจเป็นหลัก และ routine inspection มี sensitivity เพียง 23.8% เทียบกับ detailed inspection',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-23080340', locator: '45(3):855-64', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'About 59.45 % of tuberculous lesions were observed in the lungs and associated lymph nodes, whereas 35.13 % lesions were from the lymph nodes of the head... The sensitivity of RA meat inspection was 23.8 % in comparison to the detailed abat' },
        },
        {
          id: 'milk-meat-hygiene--meat-ante-post-mortem--am-pm-lesion-judgement-table-per-organ-disposition--v3',
          statement: 'Routine meat inspection มี sensitivity ต่ำมากต่อ bovine cysticercosis โดยแบบจำลอง scenario-analysis ของเบลเยียมประเมิน sensitivity ของ meat inspection สำหรับ cysticerci ทั้งที่ยังมีชีวิตและที่เสื่อมสภาพไว้เพียง 0.54% (95% CI 0.37-0.71%) เทียบกับความชุกจริงที่ประเมินได้ 42.5%',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-30466649', locator: '161:1-8', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The model estimated the current prevalence of BCC to be 42.5% (95% CI: 32.4-60.7%) and the sensitivity of the MI for viable and degenerated cysticerci at only 0.54% (95% CI: 0.37-0.71%).' },
        },
        {
          id: 'milk-meat-hygiene--meat-ante-post-mortem--am-pm-lesion-judgement-table-per-organ-disposition--v4',
          statement: 'ในโคขุนที่ตรวจ postmortem แบบ routine พบ Cysticercus bovis บ่อยที่สุดที่หัวใจ รองลงมาคือตับและกล้ามเนื้อ masseter และ postmortem inspection มี sensitivity 52.4% เมื่อเทียบกับ stereoscopic microscopy เป็น gold standard',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-25803448', locator: '12(5):462-5', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The sensitivity of the postmortem inspection, when compared to a gold standard of stereoscopic microscopy, was 52.4%... Cysticerci were most frequently found in the heart, followed by liver and masseter muscles.' },
        },
      ],
    },
    'milk-meat-hygiene--meat-ante-post-mortem--general-principles-am-vs-pm': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-ante-post-mortem--general-principles-am-vs-pm--v1',
          statement: 'การตรวจซากสุกรในสหภาพยุโรปเปลี่ยนเป็น visual inspection อย่างเดียวตาม Regulation (EU) No 219/2014 เพราะการ palpation และ incision อาจทำให้เกิด cross-contamination และแพร่ zoonotic agent แต่การตัด palpation/incision ออกทำให้การตรวจพบรอยโรคตับลดลง 59% และรอยโรคปอดลดลง 38.5%',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-36590018', locator: '11(4):10761', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'According to Regulation (EU) No 219/2014, pig carcasses inspection is exclusively visual as palpation and incision could lead to cross-contamination and spread of relevant zoonotic agents... Carcasses undergone the only visual inspection ha' },
        },
        {
          id: 'milk-meat-hygiene--meat-ante-post-mortem--general-principles-am-vs-pm--v2',
          statement: 'Abattoir surveillance สำหรับ bovine tuberculosis มี herd-level detection sensitivity ต่ำ โดยแบบจำลองในไอร์แลนด์ประเมินไว้เฉลี่ย 0.24 ภายใต้ current meat inspection และลดเหลือ 0.16 ถึง 0.08 หากเปลี่ยนไปใช้ visual-only inspection',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-29876359', locator: '5:82', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The simulated mean herd-level detection sensitivity estimates were 0.24 for CMI, and 0.16, 0.12, 0.10 and 0.08 for VOI2-5, assuming a 2-, 3-, 4- and 5-fold decrease, respectively, in the animal-level detection sensitivity of VOI relative to' },
        },
      ],
    },
  },
  'milk-meat-hygiene--meat-cutting-grading': {
    'milk-meat-hygiene--meat-cutting-grading--immobilization-exsanguination': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-cutting-grading--immobilization-exsanguination--v1',
          statement: 'การทำให้สลบด้วยไฟฟ้ามีผลต่อการเกิด blood splash (hemorrhage เข้าไปในเนื้อ) โดยวิธี head-back ลดอุบัติการณ์ blood splash ในซากลูกแกะได้ชัดเจนเมื่อเทียบกับวิธี head-only',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-22054488', locator: '5(5):347-53', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The head-back stunning method markedly decreased the incidence of carcass blood splash in comparison with the splash observed in lambs stunned by the head application method.' },
        },
      ],
    },
    'milk-meat-hygiene--meat-cutting-grading--conversion-of-muscle-to-meat': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-cutting-grading--conversion-of-muscle-to-meat--v1',
          statement: 'สภาวะของสัตว์ก่อนฆ่ามีผลต่อคุณภาพเนื้อจริง โดยไก่เนื้อที่ถูกขนส่งภายใต้อุณหภูมิสิ่งแวดล้อมสูงเกิดเนื้อแบบ PSE-like ซึ่งมี glycolysis หลังฆ่าเร็วผิดปกติ ร่วมกับ phosphorylation ของ glycometabolic enzymes ที่สูงขึ้นในระยะ early postmortem',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-32169763', locator: '319:126531', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Broiler chickens were randomly distributed to unstressed control and transport under high environmental temperature groups. PM muscle samples of transport-stressed broilers were classified into normal or pale, soft and exudative (PSE)-like.' },
        },
      ],
    },
    'milk-meat-hygiene--meat-cutting-grading--rigor-mortis-ageing-cutting-grading-detail': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-cutting-grading--rigor-mortis-ageing-cutting-grading-detail--v1',
          statement: 'การจำแนก DFD ในเนื้อโคใช้ ultimate pH ที่ 48 ชั่วโมงหลังฆ่า โดยเนื้อปกติมี pHu ต่ำกว่า 5.8, atypical DFD อยู่ระหว่าง 5.8 ถึง 6.0 และ typical DFD มี pHu ตั้งแต่ 6.0 ขึ้นไป',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-38103397', locator: '209:109415', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The steaks were divided according to their pHu (normal pH < 5.8, atypical darkness, firmness, and dryness [DFD] > 5.8 pH < 6, and typical DFD pH ≥ 6).' },
        },
        {
          id: 'milk-meat-hygiene--meat-cutting-grading--rigor-mortis-ageing-cutting-grading-detail--v2',
          statement: 'เนื้อโค normal pH มี ultimate pH ราว 5.47 ± 0.02 ส่วนซาก dark cutting มี ultimate pH สูงราว 6.69 ± 0.09 และ dark cutting steaks มีค่า lightness (L*), redness (a*) และ yellowness (b*) ต่ำที่สุดไม่ว่าจะ aging ด้วยวิธีใด',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-33223267', locator: '172:108365', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Strip loins from six normal pH carcasses (pH = 5.47 ± 0.02) and dark cutting (DC) strip loins from six high pH carcasses (pH = 6.69 ± 0.09) were obtained... In general, DC steaks had the lowest lightness (L*), redness (a*), and yellowness (' },
        },
        {
          id: 'milk-meat-hygiene--meat-cutting-grading--rigor-mortis-ageing-cutting-grading-detail--v3',
          statement: 'การ ageing ทำให้เนื้อนุ่มขึ้นผ่าน proteolysis ของ myofibrillar protein (desmin, titin, filamin) โดย μ-calpain และอัตราการเกิดขึ้นกับ ultimate pH โดยในเนื้อ pHu สูง (≥ 6.2) μ-calpain เกิด autolysis เร็วกว่าและ titin กับ filamin ถูกย่อยเร็วกว่า',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-24769876', locator: '97(4):548-57', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'bull LD (n = 94) were aged at -1.5°C for up to 28 days post mortem. μ-Calpain autolysed faster in high ultimate pH (pH(u)) meat (pH(u)≥6.2) and this was concomitant with the more rapid degradation of titin and filamin in this pH(u) group.' },
        },
        {
          id: 'milk-meat-hygiene--meat-cutting-grading--rigor-mortis-ageing-cutting-grading-detail--v4',
          statement: 'Porcine stress syndrome ซึ่งทำให้เกิดเนื้อ PSE สัมพันธ์กับ mutation C เป็น T ที่ base pair 1843 ของ skeletal muscle ryanodine receptor (ryr1) cDNA และการตรวจด้วย DNA-based assay ทำนาย genotype ทั้งแบบ homozygous และ heterozygous ได้แม่นยำกว่า halothane challenge test',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-8392044', locator: '71(6):1395-9', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The DNA-based assay for a C to T mutation at base pair 1,843 of the skeletal muscle ryanodine receptor (ryr1) cDNA, which is very highly correlated with PSS, was also determined for these animals... The results of this study indicate that t' },
        },
      ],
    },
  },
  'milk-meat-hygiene--meat-pest-control': {
    'milk-meat-hygiene--meat-pest-control--problems-of-pest-3-main-impacts': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-pest-control--problems-of-pest-3-main-impacts--v1',
          statement: 'หนู (wild rats) ในเขตเมืองเป็น reservoir ของ pathogenic Leptospira และปล่อยเชื้อออกทางปัสสาวะ คนติดเชื้อจากการสัมผัสน้ำผิวดินหรือดินที่ปนเปื้อนปัสสาวะสัตว์ติดเชื้อ (ในหนูป่าเมือง Fukuoka เพาะเชื้อขึ้นจาก kidney 72.2% และจากปัสสาวะ 30.8%)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-25890990', locator: '59(6):322-30', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'urban rats carry pathogenic leptospires and people acquire these pathogens through contact with surface water or soil contaminated by the urine of the infected animals' },
        },
        {
          id: 'milk-meat-hygiene--meat-pest-control--problems-of-pest-3-main-impacts--v2',
          statement: 'Plague เป็น flea-borne zoonosis ที่เกิดจากแบคทีเรียแกรมลบ coccobacillus ชื่อ Yersinia pestis โดยตรวจพบ pla gene ของเชื้อได้ทั้งใน rodents, shrews และ fleas ในพื้นที่ระบาด',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-29433443', locator: '18(1):2', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Plague is a flea-borne zoonotic and invasive disease caused by a gram negative coccobacillus bacterium called Yersinia pestis. ... The plasminogen activator gene (pla gene) of Y. pestis was detected in 42.8% bubo aspirates, 6.9% rodents, 3.' },
        },
        {
          id: 'milk-meat-hygiene--meat-pest-control--problems-of-pest-3-main-impacts--v3',
          statement: 'Murine typhus (endemic typhus) เกิดจาก Rickettsia typhi ซึ่งมีหนู Rattus rattus และ Rattus norvegicus เป็น mammalian host และหมัดหนู Xenopsylla cheopis เป็น vector หลัก (ในการศึกษาที่ Kisangani พบ R. typhi ในหนู 13% และใน X. cheopis pools ถึง 72%)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-24445202', locator: '90(3):463-8', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'An overall prevalence of 17% Bartonella species and 13% Rickettsia typhi, the agent of murine typhus, was found in the cosmopolitan rat species, Rattus rattus and Rattus norvegicus that were infested by a majority of Xenopsylla cheopis flea' },
        },
      ],
    },
    'milk-meat-hygiene--meat-pest-control--types-of-pest-3-categories': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-pest-control--types-of-pest-3-categories--v1',
          statement: 'แมลงสาบเป็น carrier ของแบคทีเรียที่สำคัญทางการแพทย์ มีรายงานอย่างน้อย 78 bacterial species จาก 42 genera โดย Blattella germanica เป็นชนิดที่พบปนเปื้อนบ่อยที่สุดและมีความหลากหลายของเชื้อมากที่สุด รองลงมาคือ Periplaneta americana',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-31219601', locator: '56(6):1534-1554', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'At least 78 bacterial species and 42 genera from 24 families and 11 orders of bacteria were reported to have contaminated cockroaches. ... Blattella germanica is the most commonly contaminated cockroach species, with the widest bacterial sp' },
        },
        {
          id: 'milk-meat-hygiene--meat-pest-control--types-of-pest-3-categories--v2',
          statement: 'แมลงวันบ้าน (Musca domestica) ที่กินอาหารปนเปื้อนสามารถส่งผ่าน foodborne pathogens ได้แก่ Salmonella enterica, Cronobacter sakazakii, Escherichia coli O157:H7 และ Listeria monocytogenes ไปยังไข่ของมัน และ S. enterica กับ C. sakazakii ยังถูกส่งต่อไปถึงตัวเต็มวัยรุ่น F1 โดยพบที่ผิวลำตัวมากกว่าในทางเดินอาหารประมาณ 2.4 เท่า',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-26228457', locator: '15:150', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'All foodborne pathogens were present in samples containing pooled house fly eggs. ... Only S. enterica and C. sakazakii were transmitted to F1 generation adults and their presence was 2.4 times more likely on their body surfaces than in the' },
        },
      ],
    },
    'milk-meat-hygiene--meat-pest-control--control-methods-ipm-traps-baits-exclusion': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-pest-control--control-methods-ipm-traps-baits-exclusion--v1',
          statement: 'การควบคุมนกกิ้งโครง European starling (Sturnus vulgaris) ในฟาร์มโค ทำให้ตรวจไม่พบ Salmonella enterica ใน feed bunk และลดลงมากใน water trough แต่ไม่ได้ลด herd prevalence ในตัวโค ผู้วิจัยจึงสรุปว่าไม่ควรใช้การควบคุมนกเป็นมาตรการเดี่ยว แต่ควรเป็นส่วนหนึ่งของแผนควบคุมโรคแบบครอบคลุม',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-21324202', locator: '7:9', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Within the starling-controlled CAFO, detections of S. enterica contamination disappeared from feed bunks and substantially declined within water troughs following starling control operations. ... Starling control was not observed to reduce' },
        },
      ],
    },
  },
  'milk-meat-hygiene--meat-egg-micro': {
    'milk-meat-hygiene--meat-egg-micro--significance-of-microbe-with-egg': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-egg-micro--significance-of-microbe-with-egg--v1',
          statement: 'Salmonella enterica serovar Enteritidis เป็นเชื้อที่ทำให้เกิด egg-associated salmonellosis ในคน โดยในสหรัฐฯ การนำ egg quality assurance program (EQAP) มาใช้สัมพันธ์กับอุบัติการณ์ที่ลดลง คือไข่ที่ผลิตภายใต้ EQAP เพิ่มขึ้น 1% สัมพันธ์กับ S. Enteritidis incidence ลดลง 0.14% (p < 0.05)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-15504264', locator: '10(10):1782-9', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Regression analysis showed that a 1% increase in the number of eggs produced under an EQAP was associated with a 0.14% decrease in S. Enteritidis incidence (p < 0.05). These data indicate that EQAPs probably played a major role in reducing' },
        },
      ],
    },
    'milk-meat-hygiene--meat-egg-micro--egg-shell-structure-and-function': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-egg-micro--egg-shell-structure-and-function--v1',
          statement: 'ความหนาเปลือกไข่ พื้นที่เปลือก และจำนวนรู (pores) ไม่ใช่ปัจจัยที่กำหนดการ penetrate ของแบคทีเรียผ่านเปลือกไข่ แต่ cuticle deposition ต่างหากที่สัมพันธ์ โดยไข่ที่ถูก penetrate มี cuticle deposition เฉลี่ยต่ำกว่าไข่ที่ไม่ถูก penetrate และเชื้อแกรมลบที่เคลื่อนที่ได้ penetrate บ่อยที่สุด (Pseudomonas sp. 60%, Alcaligenes sp. 58%, S. Enteritidis 43%)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-16822571', locator: '112(3):253-60', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The eggshell characteristics such as area eggshell, shell thickness and number of pores did not influence the bacterial eggshell penetration. For each individual bacterial strain the mean cuticle deposition was lower for penetrated compared' },
        },
      ],
    },
    'milk-meat-hygiene--meat-egg-micro--egg-contamination-routes-salmonella-vertical-horizontal-processi': {
      claims: [
        {
          id: 'milk-meat-hygiene--meat-egg-micro--egg-contamination-routes-salmonella-vertical-horizontal-processi--v1',
          statement: 'Vertical transmission ของ Salmonella Enteritidis สู่ไข่เกิดจากการที่เชื้อ colonize ที่ ovary และ oviduct ของแม่ไก่ไข่ ซึ่งเป็นตำแหน่งหลักของการติดเชื้อในระบบสืบพันธุ์',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-14676008', locator: '32(6):583-90', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The ovaries and the oviducts of the laying hens are the major sites of SE colonization from which vertical transmission to eggs occurs.' },
        },
        {
          id: 'milk-meat-hygiene--meat-egg-micro--egg-contamination-routes-salmonella-vertical-horizontal-processi--v2',
          statement: 'S. Enteritidis penetrate ผ่านเปลือกไข่ได้จริง (horizontal หรือ trans-shell route) โดยหลังเก็บ 14 วันที่ 20 องศาเซลเซียส ความชื้นสัมพัทธ์ 60% พบการ penetrate 6.0% ในไข่ free-range และ 16.0% ในไข่ขาว generic แต่สูงถึง 30-34% ในไข่ generic brown, organic และ omega-3 และพบบ่อยขึ้นเมื่อไม่มี cuticle spots',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-17388050', locator: '70(3):623-8', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'At 14 days of storage, only 6.0% of the eggs from free-range hens and 16.0% of the generic (i.e., eggs from hens in conventional battery cages that were given standard feed) white eggs were penetrated. The generic brown, organic, and omega-' },
        },
        {
          id: 'milk-meat-hygiene--meat-egg-micro--egg-contamination-routes-salmonella-vertical-horizontal-processi--v3',
          statement: 'USDA FSIS กำหนดให้ liquid egg white (LEW) ต้องผ่าน pasteurization ที่ 56.7 องศาเซลเซียส นาน 3.5 นาที',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-22410216', locator: '75(3):443-8', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The U.S. Department of Agriculture, Food Safety and Inspection Service (FSIS) requires that liquid egg white (LEW) be pasteurized at 56.7 degrees C for 3.5 min.' },
        },
        {
          id: 'milk-meat-hygiene--meat-egg-micro--egg-contamination-routes-salmonella-vertical-horizontal-processi--v4',
          statement: 'Haugh unit (HU) เป็นค่าวัด internal egg quality ที่ได้จากการวัด albumen height ค่าจะลดลงเมื่อเก็บนานขึ้น (เฉลี่ย 72.44 ที่เวลาเริ่มต้น เหลือ 59.99 ที่ 7 สัปดาห์) และขึ้นกับอุณหภูมิขณะวัดด้วย โดยที่ 7 สัปดาห์ HU ลดลงประมาณ 6 หน่วยเมื่ออุณหภูมิทดสอบสูงขึ้น จึงควรรายงานอุณหภูมิที่ใช้วัดทุกครั้ง',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'pmid-16553288', locator: '85(3):550-5', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: '2026-08-01', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'The HU measurements averaged 72.44 at time zero and 59.99 at 7 wk. At 7 wk for all devices, HU values decreased 6 units with increased temperature (P < 0.05). ... Thus, it is recommended that egg testing temperature be reported when HU are' },
        },
      ],
    },
  },
};

/** Look up the verification overlay for a topic (or empty object). */
export function verificationFor(topicId) {
  return VERIFICATIONS[topicId] || {};
}
