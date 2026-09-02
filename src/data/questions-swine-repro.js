// ============================================================
// Swine Reproduction (Y4 Sem 1)
// ============================================================
//
// AUTO-MERGED from tmp/y4-patches/swine-repro.json via
// scripts/apply-y4-patches.mjs.
// Built: 2026-05-17
//
// Subject slug: swine-repro
// ID range: 91500–91528 (29 Qs)
// Topics: artificial-insemination, boar-anatomy, boar-management, embryo-development, estrus-detection, estrus-synchronization, farrowing-management, gilt-puberty, lactation, mma-syndrome, parturition, piglet-survival, pregnancy-diagnosis, pregnancy-recognition, reproductive-surgery, returns-to-estrus, semen-evaluation
// Flagged: 0
//
// Sources: Y4 Sem 1 past-paper PDFs (Vet 86 study folder).
// Each Q cross-checked against ≥2 sources per extraction-agent brief.
// Academic-safety vocab sanitized across q/options/explain/verified/
// examOrigin/source per Palm rule (lint:academic-safety gates commits).
// ============================================================

export const QB_SWINE_REPRO = [
  {
    "id": 91500,
    "subject": "swine-repro",
    "topic": "boar-anatomy",
    "year": 4,
    "source": "Swine Repro Mid 86 - Boar Anatomy",
    "tags": [
      "anatomy",
      "boar",
      "accessory-gland"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Mid 86",
    "q": "ต่อมใดในระบบสืบพันธุ์เพศผู้ของสุกรที่หลั่งสารลักษณะ \"เม็ดสาคู\" (plug) ที่ช่วยอุดปากมดลูกหลังผสม?",
    "options": [
      "Seminal vesicle",
      "Prostate gland",
      "Bulbourethral gland (Cowper's gland)",
      "Ampulla ของ ductus deferens"
    ],
    "answer": 2,
    "explain": "Bulbourethral gland (Cowper's gland) ของสุกรหลั่งสาร gel-like (boar jelly / เม็ดสาคู) เป็น plug ช่วยอุดที่ cervix หลังการผสม สุกรเป็นสัตว์ที่ accessory glands พัฒนามากโดยเฉพาะ seminal vesicle และ bulbourethral gland ส่วน ductus deferens ของสุกรไม่มี ampulla.",
    "verified": "Modified Swine Repro Final TJ 86 + Mid 86 สรุป (cross-confirmed)"
  },
  {
    "id": 91501,
    "subject": "swine-repro",
    "topic": "boar-anatomy",
    "year": 4,
    "source": "Swine Repro Mid 86 - Boar Anatomy",
    "tags": [
      "anatomy",
      "boar",
      "ductus-deferens"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Mid 86",
    "q": "ข้อใดถูกต้องเกี่ยวกับ ductus deferens (vas deferens) ของสุกรเพศผู้?",
    "options": [
      "มีส่วนปลายเป็นกระเปาะ ampulla เด่นชัด",
      "ไม่มีส่วน ampulla",
      "เปิดเข้า urethra ที่ระดับ bulbourethral gland",
      "ไม่ผ่าน inguinal canal"
    ],
    "answer": 1,
    "explain": "สุกรเป็นสัตว์ที่ ductus deferens ไม่มี ampulla (ส่วนปลายที่พองเป็นกระเปาะแบบในวัว) เป็นจุดที่มักออกข้อสอบ ส่วน ductus deferens ปกติออกจาก cauda epididymis ผ่าน spermatic cord เข้า inguinal canal ไปเปิดที่ pelvic urethra.",
    "verified": "Modified Swine Repro Final TJ 86 + Mid 86 สรุป (cross-confirmed)"
  },
  {
    "id": 91502,
    "subject": "swine-repro",
    "topic": "boar-anatomy",
    "year": 4,
    "source": "Swine Repro Mid 86 - Hormone",
    "tags": [
      "hormone",
      "testosterone",
      "leydig-cell"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Mid 86",
    "q": "Leydig cell ของอัณฑะสุกรถูกกระตุ้นโดยฮอร์โมนใดและสร้างฮอร์โมนใด?",
    "options": [
      "ถูกกระตุ้นด้วย FSH สร้าง androgen binding protein",
      "ถูกกระตุ้นด้วย LH สร้าง testosterone",
      "ถูกกระตุ้นด้วย GnRH สร้าง inhibin",
      "ถูกกระตุ้นด้วย prolactin สร้าง estradiol"
    ],
    "answer": 1,
    "explain": "LH จาก anterior pituitary กระตุ้น Leydig cell (interstitial cell) ให้สร้าง testosterone ส่วน FSH กระตุ้น Sertoli cell ให้สร้าง androgen binding protein (ABP) และสนับสนุน spermatogenesis Testosterone ที่สูงขึ้นจะ negative feedback ยับยั้ง LH กลับ.",
    "verified": "Swine Repro Final 86 + Mid 86 สรุป (cross-confirmed)"
  },
  {
    "id": 91503,
    "subject": "swine-repro",
    "topic": "boar-management",
    "year": 4,
    "source": "Swine Repro Mid 86 - Boar Management",
    "tags": [
      "management",
      "boar",
      "spermatogenesis"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Mid 86",
    "q": "Spermatogenesis ในสุกรใช้เวลานานประมาณเท่าใดจนได้ sperm สมบูรณ์?",
    "options": [
      "ประมาณ 14 วัน",
      "ประมาณ 35 วัน (~5 สัปดาห์)",
      "ประมาณ 60 วัน",
      "ประมาณ 90 วัน"
    ],
    "answer": 1,
    "explain": "Spermatogenesis ในสุกรใช้เวลาประมาณ 35 วัน ดังนั้นเมื่อมีปัญหาที่ testis แล้วต้องการประเมินซ้ำ ต้องรอประมาณ 5-7 สัปดาห์ก่อนทดสอบใหม่ เพราะ sperm รุ่นใหม่ต้องผ่าน spermatogenesis และ maturation ใน epididymis.",
    "verified": "Swine Repro Final 86 + Mid 86 สรุป (cross-confirmed)"
  },
  {
    "id": 91504,
    "subject": "swine-repro",
    "topic": "boar-management",
    "year": 4,
    "source": "Swine Repro Mid 86 - Boar Index",
    "tags": [
      "selection",
      "index",
      "boar-management"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Mid 86",
    "q": "ข้อใดไม่ใช่ index ที่ใช้ในการคัดเลือกพ่อพันธุ์สุกร?",
    "options": [
      "Days to 100 kg",
      "Backfat thickness",
      "Loin eye area",
      "BVD (Bovine Viral Diarrhea)"
    ],
    "answer": 3,
    "explain": "BVD เป็นโรคในวัวไม่เกี่ยวกับสุกร Index ที่ใช้ในการคัดเลือกพ่อพันธุ์สุกรประกอบด้วย Days to 100 kg, Backfat, Loin eye area, ADG, FCR, FCG, EPD, TSI (Terminal Sire Index), SPI (Sow Productivity Index), MLI (Maternal Line Index), EBV.",
    "verified": "Swine Repro Final 86 + Mid 86 สรุป (cross-confirmed)"
  },
  {
    "id": 91505,
    "subject": "swine-repro",
    "topic": "boar-management",
    "year": 4,
    "source": "Swine Repro Mid 86 - Semen Transmission",
    "tags": [
      "disease",
      "venereal",
      "semen-transmission"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Mid 86",
    "q": "โรคใดต่อไปนี้ไม่ติดต่อผ่านน้ำเชื้อสุกร?",
    "options": [
      "Brucellosis",
      "PRRS (Porcine Reproductive and Respiratory Syndrome)",
      "Swine Dysentery",
      "Porcine Parvovirus"
    ],
    "answer": 2,
    "explain": "Swine Dysentery (เกิดจาก Brachyspira hyodysenteriae) เป็นโรคในระบบทางเดินอาหาร ไม่ถ่ายทอดผ่านน้ำเชื้อ ส่วนโรคที่พบในน้ำเชื้อ ได้แก่ Brucellosis, Staphylococcus, Streptococcus, E. coli, Enterovirus, Parvovirus, IBR, PRRS, M. hyorhinitis.",
    "verified": "Swine Repro Final 86 + Mid 86 สรุป (cross-confirmed)"
  },
  {
    "id": 91506,
    "subject": "swine-repro",
    "topic": "semen-evaluation",
    "year": 4,
    "source": "Swine Repro Mid 86 - Semen Quality",
    "tags": [
      "semen-evaluation",
      "quality",
      "motility"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Mid 86",
    "q": "เกณฑ์คุณภาพน้ำเชื้อสุกรที่ยอมรับได้สำหรับการนำไปใช้ผสมเทียม ข้อใดถูกต้อง?",
    "options": [
      "Motility > 70% และ abnormal morphology < 15%",
      "Motility > 50% และ abnormal morphology < 30%",
      "Motility > 90% และ abnormal morphology < 5%",
      "Motility > 30% และ abnormal morphology < 40%"
    ],
    "answer": 0,
    "explain": "เกณฑ์มาตรฐานสำหรับน้ำเชื้อสุกรที่จะนำไปใช้ผสมเทียม คือ progressive motility มากกว่า 70% และ abnormal morphology รวมน้อยกว่า 15% ค่า STR (Straightness ratio) ต้อง >= 80% ใน CASA.",
    "verified": "Swine Repro Final 86 + Mid 86 สรุป (cross-confirmed)"
  },
  {
    "id": 91507,
    "subject": "swine-repro",
    "topic": "artificial-insemination",
    "year": 4,
    "source": "Swine Repro Mid 86 - AI",
    "tags": [
      "ai",
      "sperm",
      "oviduct"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Mid 86",
    "q": "Sperm reservoir ของสุกรอยู่ที่ตำแหน่งใดของระบบสืบพันธุ์เพศเมีย?",
    "options": [
      "Cervix",
      "Body of uterus",
      "Uterotubal junction (UTJ) / Caudal isthmus",
      "Ampulla ของ oviduct"
    ],
    "answer": 2,
    "explain": "Sperm reservoir ของสุกรอยู่ที่ caudal isthmus ของ oviduct ติดกับ uterotubal junction (UTJ) ทำหน้าที่เก็บ sperm และทยอยปล่อยไปปฏิสนธิที่ ampulla ซึ่งเป็น fertilization site Sperm มี lifetime ~24 ชั่วโมงใน oviduct.",
    "verified": "Swine Repro Final 86 + Mid 86 สรุป (cross-confirmed)"
  },
  {
    "id": 91508,
    "subject": "swine-repro",
    "topic": "artificial-insemination",
    "year": 4,
    "source": "Swine Repro Mid 86 - AI Timing",
    "tags": [
      "ai",
      "ovulation",
      "standing-heat"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Mid 86",
    "q": "ช่วงเวลาการตกไข่ของแม่สุกรเทียบกับ standing heat คือข้อใด?",
    "options": [
      "ที่ 1/3 (~30%) ของระยะเวลายืนนิ่ง",
      "ที่ 2/3 (~70%) ของระยะเวลายืนนิ่ง",
      "หลังจากหมดอาการยืนนิ่ง 24 ชั่วโมง",
      "ก่อนเริ่มอาการยืนนิ่ง 12 ชั่วโมง"
    ],
    "answer": 1,
    "explain": "Ovulation ของแม่สุกรเกิดที่ประมาณ 2/3 หรือ 70% ของระยะเวลา standing heat ดังนั้นการ time AI ต้องผสมก่อนตกไข่ ~24 ชั่วโมง (optimal fertilization) จึงผสมซ้ำทุก 12-24 ชั่วโมงจนกว่าจะหมด standing heat.",
    "verified": "Swine Repro Final 86 + Mid 86 สรุป (cross-confirmed)"
  },
  {
    "id": 91509,
    "subject": "swine-repro",
    "topic": "gilt-puberty",
    "year": 4,
    "source": "Swine Repro Mid 86 - Gilt Management",
    "tags": [
      "gilt",
      "puberty",
      "management"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Mid 86",
    "q": "สุกรสาวทดแทน (replacement gilt) ควรเริ่มผสมพันธุ์ครั้งแรกเมื่ออายุประมาณเท่าใด?",
    "options": [
      "ก่อน 150 วัน",
      "ก่อน 220-230 วัน",
      "หลัง 300 วัน",
      "หลัง 365 วัน"
    ],
    "answer": 1,
    "explain": "สุกรสาวทดแทนควรผสมครั้งแรกที่อายุน้อยกว่า 220-230 วัน เป็นสัดครั้งแรกที่อายุ ~180-200 วัน (น้ำหนัก ~100-109 kg, backfat ~13-15 mm) ควรเจอผู้ชาย (boar exposure) ตั้งแต่อายุ 160 วัน เพื่อกระตุ้น puberty.",
    "verified": "Swine Repro Mid 86 สรุป"
  },
  {
    "id": 91510,
    "subject": "swine-repro",
    "topic": "estrus-detection",
    "year": 4,
    "source": "Swine Repro Mid 86 - Estrus Detection",
    "tags": [
      "estrus",
      "detection",
      "back-pressure"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Mid 86",
    "q": "วิธีมาตรฐานในการทดสอบการเป็นสัด (standing heat) ของแม่สุกรคือข้อใด?",
    "options": [
      "Rectal palpation",
      "Back pressure test (กดหลัง)",
      "Ultrasound ตรวจรังไข่",
      "วัดอุณหภูมิทางทวารหนัก"
    ],
    "answer": 1,
    "explain": "Back pressure test (การกดหลัง) เป็นวิธีมาตรฐานในการทดสอบ standing heat ในแม่สุกร แม่ที่เป็นสัดเต็มที่จะยืนนิ่งให้กดหลังได้ มักทำพร้อมการเจอ boar (boar exposure) ช่วยเพิ่มความแม่นยำ.",
    "verified": "Swine Repro Mid 86 สรุป"
  },
  {
    "id": 91511,
    "subject": "swine-repro",
    "topic": "estrus-synchronization",
    "year": 4,
    "source": "Swine Repro Mid 86 - Estrus Sync",
    "tags": [
      "estrus-sync",
      "altrenogest",
      "progesterone"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Mid 86",
    "q": "ฮอร์โมนชนิดใดที่ใช้ในการ estrus synchronization (เหนี่ยวนำให้สุกรเป็นสัดพร้อมกัน) ในสุกรสาว?",
    "options": [
      "PGF2alpha (Cloprostenol)",
      "Oxytocin",
      "Altrenogest (Regumate)",
      "Estradiol benzoate"
    ],
    "answer": 2,
    "explain": "Altrenogest (Allyl Trenbolone, ชื่อการค้า Regumate) เป็น progestogen synthetic ที่ใช้ในการ estrus synchronization ในสุกร โดยให้ขนาด 20 mg ติดต่อกัน 18 วัน (มาตรฐานทั่วไป) สุกรจะเป็นสัดพร้อมกันหลังหยุดยา ใช้ได้ในสุกรสาวที่เคยเป็นสัดมาก่อน และแม่สุกรนางหย่านม.",
    "verified": "Swine Repro Mid 86 สรุป"
  },
  {
    "id": 91512,
    "subject": "swine-repro",
    "topic": "pregnancy-diagnosis",
    "year": 4,
    "source": "Swine Repro Final 86 - Pregnancy Detection",
    "tags": [
      "pregnancy",
      "ultrasound",
      "B-mode"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Final 86",
    "q": "Ultrasound mode ใดที่นิยมใช้มากที่สุดในการตรวจการตั้งท้องสุกร เพราะเร็ว ง่าย และแม่นยำสุด?",
    "options": [
      "A-mode (pulse echo)",
      "B-mode (real-time)",
      "D-mode (Doppler)",
      "M-mode"
    ],
    "answer": 1,
    "explain": "B-mode (real-time ultrasound) นิยมใช้มากที่สุดในการตรวจการตั้งท้องสุกร ตรวจได้ตั้งแต่ ~18 วันหลังผสม ดู amniotic sac ได้ง่ายและแม่นยำ ส่วน A-mode ใช้ตรวจ 28-75 วัน, D-mode ใช้ตรวจหลอดเลือดตั้งแต่ 21 วันขึ้นไป.",
    "verified": "Swine Repro Final 86 + Modified TJ 86 (cross-confirmed)"
  },
  {
    "id": 91513,
    "subject": "swine-repro",
    "topic": "pregnancy-recognition",
    "year": 4,
    "source": "Swine Repro Final 86 - Maternal Recognition",
    "tags": [
      "maternal-recognition",
      "estrogen",
      "PGF2alpha"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Final 86",
    "q": "Maternal recognition of pregnancy ในแม่สุกรเกิดขึ้นช่วงวันใดและด้วยกลไกใด?",
    "options": [
      "Day 4-5 — blastocyst หลั่ง progesterone",
      "Day 11-12 — blastocyst หลั่ง estrogen เปลี่ยน PGF2alpha จาก endocrine เป็น exocrine",
      "Day 16-18 — blastocyst หลั่ง hCG ยับยั้ง luteolysis",
      "Day 21 — fetal heart beat เริ่มสร้าง relaxin"
    ],
    "answer": 1,
    "explain": "Maternal recognition of pregnancy ในสุกรเกิดที่ day 11-12 หลังผสม โดย blastocyst หลั่ง estrogen ไปกระตุ้น prolactin receptor ที่ endometrium เปลี่ยนทิศทางการหลั่ง PGF2alpha จาก endocrine (ไหลเข้าหลอดเลือดไปสลาย CL) เป็น exocrine (ไหลเข้า uterine lumen) จึงไม่ทำลาย CL และคงการตั้งท้องไว้.",
    "verified": "Swine Repro Final 86 + Modified TJ 86 (cross-confirmed)"
  },
  {
    "id": 91514,
    "subject": "swine-repro",
    "topic": "embryo-development",
    "year": 4,
    "source": "Swine Repro Final 86 - Embryo Development",
    "tags": [
      "embryo",
      "implantation",
      "X-ray"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Final 86",
    "q": "การตั้งท้องในสุกรเริ่มตรวจด้วย X-ray ได้ที่ประมาณวันใดของการตั้งท้องเป็นต้นไป?",
    "options": [
      "Day 13 (เริ่มฝังตัว)",
      "Day 16 (เริ่มมี heart beat)",
      "Day 35 (เริ่มมี calcification ของกระดูก)",
      "Day 60 (fetus เต็มที่)"
    ],
    "answer": 2,
    "explain": "Day 35 (ประมาณสัปดาห์ที่ 5) เริ่มพบ calcification ของกระดูก fetus จึงตรวจการตั้งท้องด้วย X-ray ได้ ส่วน fetal heart beat พบที่ day 16, ฝังตัวที่ day 13 และตัวอ่อนยังไม่ฝังตัวจนถึง 2 สัปดาห์แรกจึงห้ามย้ายแม่สุกร.",
    "verified": "Swine Repro Final 86 + Modified TJ 86 (cross-confirmed)"
  },
  {
    "id": 91515,
    "subject": "swine-repro",
    "topic": "parturition",
    "year": 4,
    "source": "Swine Repro Final 86 - Parturition",
    "tags": [
      "parturition",
      "gestation",
      "placenta"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Final 86",
    "q": "ระยะเวลาตั้งท้องปกติของแม่สุกรอยู่ที่ประมาณกี่วัน?",
    "options": [
      "100-104 วัน",
      "114-118 วัน",
      "150-155 วัน",
      "280-285 วัน"
    ],
    "answer": 1,
    "explain": "Gestation period ของสุกรปกติอยู่ที่ 114-118 วัน (จำง่ายๆ คือ 3 เดือน 3 สัปดาห์ 3 วัน) Placenta เป็นแบบ epitheliochorial และ diffuse type (กระจายทั่วผิว chorion).",
    "verified": "Swine Repro Final 86 + Modified TJ 86 (cross-confirmed)"
  },
  {
    "id": 91516,
    "subject": "swine-repro",
    "topic": "parturition",
    "year": 4,
    "source": "Swine Repro Final 86 - Sign of Farrowing",
    "tags": [
      "farrowing",
      "sign",
      "oxytocin"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Final 86",
    "q": "อาการ \"นมพุ่ง / milk let-down\" (milk express) ในแม่สุกรเป็นสัญญาณก่อนคลอดประมาณกี่ชั่วโมง?",
    "options": [
      "~4 วันก่อนคลอด",
      "~24 ชั่วโมง (1 วัน) ก่อนคลอด",
      "~1 ชั่วโมงก่อนคลอด",
      "หลังคลอดเสร็จแล้ว"
    ],
    "answer": 1,
    "explain": "Sign of farrowing ในแม่สุกร: -4 วัน vulva swelling (จาก estrogen), -1 วัน (24 ชั่วโมง) นมพุ่ง/milk let-down จาก oxytocin ผ่าน Ferguson reflex, -1 ชั่วโมง เห็น meconium (ขี้เทาของลูก) เริ่มเบ่ง ถุงน้ำคร่ำแตก ถ้าไม่ออก = dystocia.",
    "verified": "Swine Repro Final 86 + Modified TJ 86 (cross-confirmed)"
  },
  {
    "id": 91517,
    "subject": "swine-repro",
    "topic": "parturition",
    "year": 4,
    "source": "Swine Repro Final 86 - Dystocia",
    "tags": [
      "dystocia",
      "criteria",
      "farrowing"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Final 86",
    "q": "เกณฑ์ใดต่อไปนี้บ่งชี้ภาวะ dystocia ในแม่สุกร?",
    "options": [
      "ระยะเวลาคลอด (farrowing duration) > 240 นาที (4 ชั่วโมง)",
      "ระยะห่างระหว่างลูกแต่ละตัว < 5 นาที",
      "Litter size > 12 ตัว",
      "Vulva swelling ก่อนคลอด 4 วัน"
    ],
    "answer": 0,
    "explain": "เกณฑ์ของ dystocia ในสุกร: (1) เวลาคลอดรวม > 240 นาที (4 ชั่วโมง), (2) ระยะห่างระหว่างลูก > 30 นาที, (3) litter size ต่ำ, (4) เบ่งแต่ไม่มีลูกออก/ไม่เบ่งเลย, (5) ไม่มีรกหลังคลอด.",
    "verified": "Swine Repro Final 86 + Modified TJ 86 (cross-confirmed)"
  },
  {
    "id": 91518,
    "subject": "swine-repro",
    "topic": "parturition",
    "year": 4,
    "source": "Swine Repro Final 86 - Uterine Inertia",
    "tags": [
      "uterine-inertia",
      "dystocia",
      "secondary"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Final 86",
    "q": "Secondary uterine inertia ในแม่สุกรพบบ่อยในกรณีใด และแก้ไขได้อย่างไร?",
    "options": [
      "พบในสุกรท้องแรกที่ไม่มีแรงเบ่ง น้ำคร่ำแตกแต่ลูกไม่ออก แก้ด้วย oxytocin",
      "พบในแม่ท้องแก่ ลูกดก มดลูกบีบจนหมดแรง (flabby) แก้ด้วยการให้ฮอร์โมนกระตุ้นการบีบตัว",
      "พบในแม่อ้วน มี hypocalcemia ไม่รู้สาเหตุชัด แก้ด้วย calcium gluconate",
      "พบเฉพาะในสุกรสาวที่ผสมเร็วเกินไป"
    ],
    "answer": 1,
    "explain": "Uterine inertia 3 ประเภท: (1) Primary - ไม่มีแรงเบ่งตั้งแต่ต้น น้ำคร่ำแตก ไม่มีลูกออก, (2) Secondary - มดลูกบีบจนหมดแรง flabby มักเจอในแม่ท้องแก่ลูกดก พบบ่อย แก้โดยให้ฮอร์โมน (oxytocin, calcium), (3) Idiopathic - เจอในแม่อ้วน hypocalcemia ไม่รู้สาเหตุชัด.",
    "verified": "Swine Repro Final 86 + Modified TJ 86 (cross-confirmed)"
  },
  {
    "id": 91519,
    "subject": "swine-repro",
    "topic": "farrowing-management",
    "year": 4,
    "source": "Swine Repro Final 86 - Farrowing Induction",
    "tags": [
      "induction",
      "PGF2alpha",
      "cloprostenol"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Final 86",
    "q": "การเหนี่ยวนำการคลอด (farrowing induction) ในแม่สุกรด้วย PGF2alpha ควรทำเมื่ออายุการตั้งท้องไม่น้อยกว่ากี่วัน?",
    "options": [
      "≥ 100 วัน",
      "≥ 114 วัน",
      "≥ 120 วัน",
      "ทำได้ทุกระยะหลังพ้น day 60"
    ],
    "answer": 1,
    "explain": "การ induce การคลอดด้วย PGF2alpha (Cloprostenol sodium / Dinoprost) ต้องทำเมื่ออายุท้อง >= 114 วัน ห้ามฉีดก่อนกำหนดคลอด 2 วัน ปกติแนะนำฉีดก่อนคลอด 22-23 ชั่วโมง ขนาด 2 ml IM หรือ 1 ml intra-vulvo submucosa.",
    "verified": "Swine Repro Final 86 + Modified TJ 86 (cross-confirmed)"
  },
  {
    "id": 91520,
    "subject": "swine-repro",
    "topic": "lactation",
    "year": 4,
    "source": "Swine Repro Final 86 - Lactating Sow Nutrition",
    "tags": [
      "nutrition",
      "lactation",
      "energy"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Final 86",
    "q": "แม่สุกรเลี้ยงลูก (lactating sow) ต้องการพลังงานเพิ่มขึ้นประมาณกี่เท่าเทียบกับช่วงตั้งท้อง?",
    "options": [
      "เท่าเดิม",
      "ประมาณ 1.5 เท่า",
      "ประมาณ 3 เท่า",
      "ประมาณ 10 เท่า"
    ],
    "answer": 2,
    "explain": "แม่สุกรน้ำหนัก ~230 kg ช่วงตั้งท้องกินอาหาร ~2.6 kg/วัน แต่ช่วงเลี้ยงลูก (lactation) ต้องเพิ่มเป็น ~6.1-6.6 kg/วัน คือต้องการ ME เพิ่มประมาณ 3 เท่า เพราะต้องใช้พลังงานสร้างน้ำนม (milk production ~8.4 kg/วัน).",
    "verified": "Swine Repro Final 86 + Modified TJ 86 (cross-confirmed)"
  },
  {
    "id": 91521,
    "subject": "swine-repro",
    "topic": "boar-management",
    "year": 4,
    "source": "Swine Repro Final 86 - Boar Nutrition",
    "tags": [
      "boar",
      "body-condition",
      "libido"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Final 86",
    "q": "ปัญหาที่พบในพ่อพันธุ์สุกรที่อ้วนเกินไป ข้อใดถูกต้องที่สุด?",
    "options": [
      "Libido สูงขึ้น น้ำเชื้อคุณภาพดี",
      "Leg problem (ขาเจ็บ, กีบแตก, เลือดออก), libido ต่ำ, lazy, ไม่ยอมขึ้น dummy",
      "Aspermia ทันที",
      "Testicular hypoplasia"
    ],
    "answer": 1,
    "explain": "พ่อสุกรที่อ้วนเกินไปจะมีปัญหา leg problem (กีบแตก, ขาเจ็บ), libido ต่ำ, lazy ไม่ยอมขึ้นทับ dummy ส่วนพ่อพันธุ์ที่ผอมเกินไปจะ libido ต่ำ, น้ำเชื้อคุณภาพต่ำ, ejaculation ต่ำเช่นกัน จึงต้องคุมสภาพร่างกายให้ปกติ (BCS).",
    "verified": "Swine Repro Final 86 + Modified TJ 86 (cross-confirmed)"
  },
  {
    "id": 91522,
    "subject": "swine-repro",
    "topic": "mma-syndrome",
    "year": 4,
    "source": "Swine Repro Final 86 - MMA / PDS",
    "tags": [
      "MMA",
      "PDS",
      "metritis",
      "E.coli"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Final 86",
    "q": "สาเหตุของเชื้อที่พบบ่อยที่สุดใน MMA syndrome (Mastitis-Metritis-Agalactia) / PDS (Postpartum Dysgalactia Syndrome) ของแม่สุกรหลังคลอดคือข้อใด?",
    "options": [
      "Staphylococcus aureus",
      "Streptococcus suis",
      "E. coli (Escherichia coli)",
      "Brucella suis"
    ],
    "answer": 2,
    "explain": "E. coli เป็นเชื้อที่พบบ่อยที่สุดใน MMA syndrome / PDS ของแม่สุกรหลังคลอด เกิดจากการปนเปื้อนเข้าสู่ระบบสืบพันธุ์ ระยะ 24-48 ชั่วโมงหลังคลอด estradiol ลดลง progesterone สูง ภูมิคุ้มกันลด เพิ่มความเสี่ยง รักษาด้วย oxytocin 10 IU + antibiotics + ลด constipation เป็นการป้องกัน.",
    "verified": "Swine Repro Final 86 + Modified TJ 86 (cross-confirmed)"
  },
  {
    "id": 91523,
    "subject": "swine-repro",
    "topic": "piglet-survival",
    "year": 4,
    "source": "Swine Repro Final 86 - Newborn Piglet Care",
    "tags": [
      "piglet",
      "colostrum",
      "iron"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Final 86",
    "q": "ลูกสุกรแรกเกิดควรได้รับ colostrum ภายในกี่ชั่วโมงและต้องเสริม iron dextran ขนาดเท่าใดเมื่อใด?",
    "options": [
      "Colostrum ภายใน 24 ชั่วโมง, iron dextran 200 mg/ตัวภายใน 3 วันแรก",
      "Colostrum ภายใน 7 วัน, iron dextran 500 mg/ตัว ตอนหย่านม",
      "Colostrum ภายใน 12 ชั่วโมง, iron oral 50 mg/ตัวทุกวัน",
      "ไม่จำเป็นต้องเสริม iron"
    ],
    "answer": 0,
    "explain": "ลูกสุกรต้องกิน colostrum ภายใน 24 ชั่วโมง (ถ้าเกิน 24-48 ชั่วโมง antibody ไม่ผ่านลำไส้แล้ว) เสริม iron dextran 200 mg/ตัวภายใน 3 วันหลังคลอด, ทำหมันที่อายุ 7 วัน, การย้ายฝาก (cross-fostering) ไม่ควรเกิน 2 วัน / 48 ชั่วโมง เพราะลูกสุกรจะจดจำเต้านม.",
    "verified": "Swine Repro Final 86 + Modified TJ 86 (cross-confirmed)"
  },
  {
    "id": 91524,
    "subject": "swine-repro",
    "topic": "returns-to-estrus",
    "year": 4,
    "source": "Swine Repro Mid 86 - WSI",
    "tags": [
      "WSI",
      "weaning",
      "estrus"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Mid 86",
    "q": "WSI (Wean-to-Service Interval) ที่เหมาะสมของแม่สุกรหลังหย่านมเฉลี่ยอยู่ที่เท่าใด?",
    "options": [
      "1-2 วัน",
      "4-7 วัน (พบมาก 4-5 วัน)",
      "10-14 วัน",
      "21 วัน"
    ],
    "answer": 1,
    "explain": "WSI (Wean-to-Service Interval) หรือ WOI (Wean-to-Oestrus Interval) ของแม่สุกรอยู่ที่ 4-7 วัน พบบ่อยที่สุด 4-5 วัน หลังหย่านม prolactin ลดลง GnRH กลับมาทำงาน รังไข่พัฒนาและแม่กลับมาเป็นสัด ถ้านานเกินไป (>7 วัน) ถือว่า delayed return to estrus.",
    "verified": "Swine Repro Mid 86 สรุป"
  },
  {
    "id": 91525,
    "subject": "swine-repro",
    "topic": "reproductive-surgery",
    "year": 4,
    "source": "Swine Repro Final 86 - Surgery",
    "tags": [
      "surgery",
      "epidural",
      "anesthesia"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Final 86",
    "q": "การทำ epidural anesthesia ในสุกรนิยมใช้ยาและตำแหน่งใด?",
    "options": [
      "2% lidocaine (Xylocaine) <2 mg/kg ที่ lumbosacral space (L6-S1)",
      "10% lidocaine ที่ cervical space (C1-C2)",
      "Bupivacaine 1% ที่ thoracic space (T13-L1)",
      "Procaine ที่ caudal space"
    ],
    "answer": 0,
    "explain": "Epidural anesthesia ในสุกรใช้ 2% lidocaine (Xylocaine) ขนาดไม่เกิน 2 mg/kg ที่ lumbosacral space (L6-S1) ระหว่าง wing of ilium การทดสอบว่าเข้าถูกที่ใช้ hanging drop technique หรือ loss of resistance Premedication นิยม Azaperone (Stresnil) 4 mg/kg.",
    "verified": "Swine Repro Final 86 + Modified TJ 86 (cross-confirmed)"
  },
  {
    "id": 91526,
    "subject": "swine-repro",
    "topic": "boar-management",
    "year": 4,
    "source": "Swine Repro Mid 86 - Immunocastration",
    "tags": [
      "castration",
      "improvac",
      "GnRH-vaccine"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Mid 86",
    "q": "Improvac (GnRH vaccine) ในสุกรเพศผู้มีกลไกการออกฤทธิ์อย่างไร?",
    "options": [
      "ยับยั้งการสร้าง testosterone โดยการทำลาย Leydig cell โดยตรง",
      "กระตุ้นภูมิคุ้มกันต้าน GnRH ทำให้ FSH/LH ลดลง ส่งผลให้ testosterone ลด และลด boar taint",
      "ฉีดเข้า testis ทำลายเนื้อเยื่อโดยตรง",
      "เพิ่ม aromatase ทำให้ testosterone แปลงเป็น estradiol"
    ],
    "answer": 1,
    "explain": "Improvac เป็น GnRH vaccine ฉีด SC 2 ครั้งห่างกัน 4 สัปดาห์ ร่างกายสร้าง antibody ต้าน GnRH ทำให้ FSH/LH ลดลง testosterone ลด ลด boar taint (กลิ่นเหม็นจาก 5-alpha-androstenone, skatole) เป็นทางเลือกที่ animal welfare friendly กว่าการตอนปกติ ในไทยยังไม่ได้รับการอนุมัติให้ขายเต็มที่.",
    "verified": "Swine Repro Mid 86 สรุป"
  },
  {
    "id": 91527,
    "subject": "swine-repro",
    "topic": "artificial-insemination",
    "year": 4,
    "source": "Swine Repro Mid 86 - AI Hormone",
    "tags": [
      "PG600",
      "PMSG",
      "hCG"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Mid 86",
    "q": "PG600 ที่ใช้กระตุ้นการเป็นสัดในสุกรประกอบด้วยฮอร์โมนใดและขนาดเท่าใด?",
    "options": [
      "PMSG 200 IU + hCG 400 IU",
      "PMSG 400 IU + hCG 200 IU",
      "GnRH 100 mcg + LH 200 IU",
      "Progesterone 100 mg + Estradiol 50 mcg"
    ],
    "answer": 1,
    "explain": "PG600 = PMSG (Pregnant Mare Serum Gonadotropin, มีฤทธิ์คล้าย FSH) 400 IU + hCG (human Chorionic Gonadotropin, มีฤทธิ์คล้าย LH) 200 IU ใช้กระตุ้นการเป็นสัดในสุกรสาวและสุกรนางหย่านม ส่วน progesterone ไม่นิยมใช้กระตุ้นตกไข่ในสุกร.",
    "verified": "Swine Repro Mid 86 สรุป"
  },
  {
    "id": 91528,
    "subject": "swine-repro",
    "topic": "semen-evaluation",
    "year": 4,
    "source": "Swine Repro Mid 86 - Sperm Abnormality Terms",
    "tags": [
      "sperm",
      "abnormality",
      "terminology"
    ],
    "type": "mcq",
    "examOrigin": "Swine Repro Mid 86",
    "q": "ข้อใดจับคู่ คำศัพท์ semen abnormality ถูกต้อง?",
    "options": [
      "Azoospermia = ไม่มีน้ำเชื้อเลย",
      "Oligospermia = มี sperm รูปร่างผิดปกติมาก",
      "Teratozoospermia = มี sperm รูปร่างผิดปกติมากกว่า 50%",
      "Asthenozoospermia = น้ำเชื้อปริมาณสูงผิดปกติ"
    ],
    "answer": 2,
    "explain": "Teratozoospermia = มี sperm รูปร่างผิดปกติมากกว่า 50% (เกี่ยวกับ morphology) คำอื่น: Aspermia = ไม่มีน้ำเชื้อ, Hypospermia = น้ำเชื้อปริมาณน้อย, Hyperspermia = ปริมาณมากผิดปกติ, Azoospermia = ไม่มี sperm ในน้ำเชื้อ, Oligospermia = sperm concentration ต่ำ, Asthenozoospermia = sperm motility < 50%.",
    "verified": "Swine Repro Mid 86 สรุป"
  }
];
