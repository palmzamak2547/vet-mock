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
};

/** Look up the verification overlay for a topic (or empty object). */
export function verificationFor(topicId) {
  return VERIFICATIONS[topicId] || {};
}
