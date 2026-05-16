// ============================================================
// Swine Herd Health Management (Y4 Sem 1)
// ============================================================
//
// AUTO-MERGED from tmp/y4-patches/swine-herd.json via
// scripts/apply-y4-patches.mjs.
// Built: 2026-05-16
//
// Subject slug: swine-herd
// ID range: 92000–92035 (36 Qs)
// Topics: adg-calculation, aflatoxin-source-effect, all-in-all-out-system, asf-acute-signs, biosecurity-segregation-sanitation-resistance, blup-breeding-value, boar-restraint-snare, breeding-system-3-breed-cross, contagious-vs-environmental-mastitis-pathogens, cross-sectional-vs-case-control, epidemic-vs-endemic, feeding-pregnancy-stage, halothane-gene-pss, inbreeding-depression, iron-deficiency-anemia-piglet, isolation-acclimatization-new-gilts, mastitis-subclinical-scc, milk-letdown-oxytocin, milking-machine-pulsation, mycotoxin-zearalenone, npd-calculation, parakeratosis-zinc-deficiency, parity-structure-management, production-tree-low-total-born, prrs-vaccination-program, psy-calculation, return-to-estrus-pattern, sensitivity-specificity-calculation, sow-feeding-lactation, swine-dysentery-brachyspira, swine-euthanasia-method, swine-house-count-calculation, swine-welfare-5-freedoms, thin-sow-syndrome, vitamin-e-selenium-deficiency, wsi-fertility-relationship
// Flagged: 0
//
// Sources: Y4 Sem 1 past-paper PDFs (Vet 86 study folder).
// Each Q cross-checked against ≥2 sources per extraction-agent brief.
// Academic-safety vocab sanitized across q/options/explain/verified/
// examOrigin/source per Palm rule (lint:academic-safety gates commits).
// ============================================================

export const QB_SWINE_HERD = [
  {
    "id": 92000,
    "subject": "swine-herd",
    "topic": "biosecurity-segregation-sanitation-resistance",
    "year": 4,
    "source": "Swine Hlth final TJ.pdf",
    "examOrigin": "Swine Health Final TJ86",
    "tags": [
      "biosecurity",
      "pdr",
      "segregation",
      "sanitation",
      "resistance"
    ],
    "type": "mcq",
    "q": "อาจารย์อธิภู สอนหลักการ Biosecurity ในฟาร์มสุกร 3 ขา (segregation / sanitation / resistance) ข้อใดจัดเป็น 'resistance' ที่ถูกต้องที่สุด",
    "options": [
      "การกั้นรั้วฟาร์มและทำ all-in all-out เพื่อแยกเชื้อจากภายนอก",
      "การจุ่มเท้าด้วยน้ำยาฆ่าเชื้อพร้อม contact time ที่เพียงพอ",
      "การทำวัคซีนและคัดเลือกหมูที่มี genetic resistance เช่น CD163 edited PRRS-resistant pig",
      "การควบคุมโซนรถขนส่งและจอดไกลคอกหมู"
    ],
    "answer": 2,
    "explain": "✓ Resistance = ทำให้ตัวสัตว์ทนโรค โดย genetic selection, vaccine (active immune), colostrum/passive immune\n✗ ตัวเลือก a, d = Segregation (กั้น/แยก physical-policy barrier)\n✗ ตัวเลือก b = Sanitation (ทำความสะอาด/disinfect)\n💡 Biosecurity 3 ขา: Segregation (กั้น) + Sanitation (สะอาด) + Resistance (ทนโรค) — ถ้าขาใดอ่อน multifactorial disease จะ break-through",
    "verified": "Swine Hlth final TJ.pdf อ.อธิภู section biosecurity + swine herd mid p.4 PDR intervention strategies"
  },
  {
    "id": 92001,
    "subject": "swine-herd",
    "topic": "asf-acute-signs",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86",
    "tags": [
      "asf",
      "african-swine-fever",
      "differential-diagnosis",
      "hemorrhagic-fever"
    ],
    "type": "mcq",
    "q": "หมูขุนตายเฉียบพลันในฟาร์ม signs : ไข้สูง เลือดออกตามอวัยวะภายใน cyanosis ที่หู spleenomegaly fatality สูงเกือบ 100% สงสัย ASF มากที่สุด การส่งตัวอย่างเพื่อ definitive diagnosis ใดเหมาะสมที่สุด",
    "options": [
      "เก็บ feces ส่งตรวจ ELISA หาแอนติเจน",
      "เก็บ blood และ superficial inguinal lymph node ส่งตรวจ PCR",
      "เก็บ nasal swab ส่งเพาะเชื้อแบคทีเรีย",
      "เก็บ urine ส่งตรวจ heavy metal และ mycotoxin"
    ],
    "answer": 1,
    "explain": "✓ ASF diagnostic sample = blood (viremia สูง acute phase) + superficial inguinal lymph node (target organ ของ virus, replicate ใน macrophage ของต่อมน้ำเหลือง) → PCR หา ASFV genome\n✗ Feces ELISA ไม่ใช่ definitive ASF — ASFV ขับทาง secretion ทุกชนิดแต่ blood/LN ใช้ confirm\n✗ Nasal swab + bacterial culture ผิด — ASF เป็น virus ไม่ใช่แบคทีเรีย\n💡 ASF differential dx : PRRS, CSF, salmonella cholera suis — fatality 100% + spleenomegaly ทำให้ ASF เด่นกว่า",
    "verified": "swine herd mid p.2 ASF section, also Swine Hlth final TJ Q3 PRRS/Glasser context"
  },
  {
    "id": 92002,
    "subject": "swine-herd",
    "topic": "prrs-vaccination-program",
    "year": 4,
    "source": "Swine Hlth final TJ.pdf",
    "examOrigin": "Swine Health Final TJ86",
    "tags": [
      "prrs",
      "vaccine",
      "passive-immunity",
      "colostrum"
    ],
    "type": "mcq",
    "q": "หมูอนุบาลอายุ 7-8 week ระบาด PRRS + Glasser ป่วย 30% ตาย 20% ในเรื่องโปรแกรมวัคซีน PRRS ของลูกสุกร ควรเริ่มฉีดเมื่ออายุเท่าใดเหมาะสมที่สุด",
    "options": [
      "1-2 สัปดาห์ ทันทีหลังคลอด",
      "4-5 สัปดาห์ เนื่องจาก passive immunity จาก colostrum เริ่มลดลง",
      "10 สัปดาห์ หลัง wean 5 สัปดาห์",
      "16 สัปดาห์ ก่อนเข้าโรงเรือนขุน"
    ],
    "answer": 1,
    "explain": "✓ ฉีด PRRS vaccine ที่ 4-5 wk เพราะ passive immunity จาก colostrum (MDA — maternal-derived antibody) ลดลงพอที่ vaccine จะทำงานได้ ไม่ถูก neutralize\n✗ ฉีดเร็วเกินที่ 1-2 wk → MDA สูง vaccine ไม่ติด\n✗ ฉีดช้าเกินที่ 10+ wk → window ของ susceptibility (MDA หมดแต่ vaccine ยังไม่ขึ้น) เสี่ยงติดธรรมชาติก่อน\n💡 ถ้าแม่ไม่เคยฉีด vaccine ระหว่างตั้งท้อง → ฉีดลูกได้ที่อายุ 3 wk (MDA ต่ำกว่า)",
    "verified": "Swine Hlth final TJ.pdf Q3 อ.สุพจน์ section PRRS vaccine guideline"
  },
  {
    "id": 92003,
    "subject": "swine-herd",
    "topic": "iron-deficiency-anemia-piglet",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86",
    "tags": [
      "anemia",
      "iron",
      "piglet",
      "iron-dextran"
    ],
    "type": "mcq",
    "q": "ลูกสุกรแรกเกิดอายุ 3-7 วัน สีซีดเหลือง mucous membrane ซีด อ่อนเพลีย ผลเลือด Hb และ Hct ต่ำ การจัดการป้องกัน/รักษาที่เป็นมาตรฐาน",
    "options": [
      "ให้กิน iron sulfate ผสมน้ำดื่ม ตั้งแต่อายุ 1 วัน",
      "ฉีด iron dextran 100-200 mg/ตัว IM ที่ขาหลังหรือต้นคอ ภายใน 3 วันหลังคลอด",
      "เปลี่ยน colostrum เป็นนมโคให้แทน เพื่อเพิ่ม iron",
      "ให้ vitamin B12 และ folate IM เพื่อกระตุ้น erythropoiesis"
    ],
    "answer": 1,
    "explain": "✓ Piglet newborn anemia = iron deficiency เนื่องจาก (1) แม่ผ่าน iron ผ่าน placenta ได้น้อย (2) นมแม่มี iron ต่ำ (3) piglet โตเร็วมาก iron demand สูง → ฉีด iron dextran/iron leptoferin 100-200 mg/ตัว IM ที่ neck หรือ rear ham ภายใน 3 วันหลังคลอด\n✗ Oral iron ก็ทำได้แต่ไม่นิยม (อาจอาเจียน + ต้องให้ภายใน 12 hr ก่อนลำไส้ปิด)\n✗ นมโคไม่แก้ปัญหา iron — colostrum สำคัญสำหรับ passive immune\n✗ B12/folate ไม่ใช่สาเหตุของ piglet anemia\n💡 Diff dx : eperythrozoonosis (M. hemosuis) → blood smear ดู parasite",
    "verified": "swine herd mid p.17 piglet newborn anemia section"
  },
  {
    "id": 92004,
    "subject": "swine-herd",
    "topic": "parakeratosis-zinc-deficiency",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86",
    "tags": [
      "parakeratosis",
      "zinc-deficiency",
      "skin-lesion",
      "vitamin-a"
    ],
    "type": "mcq",
    "q": "หมูขุนผิวหนังหนาตัว keratin สะสมที่ stratum corneum ไม่คัน skin lesion diff dx จาก sarcoptic mange และ fatty acid deficiency เลือด zinc level ต่ำ การรักษาที่เหมาะสมที่สุด",
    "options": [
      "Zinc oxide ผสมในอาหาร ระยะยาว",
      "Zinc carbonate หรือ zinc sulfate supplement ในอาหาร",
      "Ivermectin SC ทุก 7 วัน 3 ครั้ง",
      "Vitamin A injection ครั้งเดียว high dose"
    ],
    "answer": 1,
    "explain": "✓ Parakeratosis = zinc deficiency (ทำให้ vitamin A metabolism ผิดปกติด้วย) → รักษาด้วย zinc carbonate หรือ zinc sulfate supplement ในอาหาร\n✗ Zinc oxide เคยใช้แต่ปัจจุบันลด (EU ban) — ปัญหา antibiotic resistance + environmental Zn pollution + ก่อ diarrhea ที่ขนาดสูง\n✗ Ivermectin เป็นการรักษา mange — diff dx ที่ exclude ไปแล้วเพราะ 'ไม่คัน'\n✗ Vitamin A injection ไม่ใช่ primary tx — zinc deficiency ก่อ vit A metabolism abnormal แต่ก็แก้ที่ zinc\n💡 Sign: skin lesion + keratin↑ + ไม่คัน (ต่างจาก mange) + diff dx ด้วย zn level เลือด",
    "verified": "swine herd mid p.17 parakeratosis section"
  },
  {
    "id": 92005,
    "subject": "swine-herd",
    "topic": "mycotoxin-zearalenone",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86",
    "tags": [
      "mycotoxin",
      "zearalenone",
      "fusarium",
      "estrogenic",
      "repro-fail"
    ],
    "type": "mcq",
    "q": "ฟาร์มแม่สุกรพบ vaginal prolapse, swollen vulva, mammary enlargement ในสุกรสาว และ testis atrophy + delayed puberty ในสุกรเพศผู้ ลูกสุกรอายุน้อยพบ splay leg สาเหตุ mycotoxin ที่น่าจะใช่ที่สุด",
    "options": [
      "Aflatoxin (Aspergillus flavus)",
      "Ergot (Claviceps purpurea)",
      "Zearalenone (F-2 toxin, Fusarium roseum)",
      "Trichothecenes (DON / vomitoxin, Fusarium spp.)"
    ],
    "answer": 2,
    "explain": "✓ Zearalenone = F-2 toxin จาก Fusarium roseum — estrogenic compound ก่อ hyperestrogenism\n  - ตัวเมีย: vaginal/rectal prolapse, vulva swelling, mammary enlarge, splay leg ในลูก\n  - ตัวผู้: testis atrophy, libido↓, delayed puberty\n✗ Aflatoxin → suppress immune, milk drop, ตับ-มะเร็ง (carcinogen)\n✗ Ergot → blood flow extremities ลด → ear/tail necrosis, hoof slough\n💡 หมูคือ susceptible species ของ zearalenone มากที่สุด",
    "verified": "swine herd mid p.18 zearalenone section + clinical signs"
  },
  {
    "id": 92006,
    "subject": "swine-herd",
    "topic": "aflatoxin-source-effect",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86",
    "tags": [
      "aflatoxin",
      "aspergillus",
      "immune-suppression",
      "carcinogen"
    ],
    "type": "mcq",
    "q": "Aflatoxin ผลิตโดยเชื้อราชนิดใดและพบในอาหารกลุ่มใดมากที่สุด",
    "options": [
      "Fusarium roseum — ข้าวโพดและถั่วเหลืองตอนเก็บเกี่ยวฝน",
      "Claviceps purpurea — ข้าวโพดและบาร์เลย์ที่ขึ้นรา",
      "Aspergillus flavus — ถั่วและเมล็ดข้าวโพดเก็บที่ความชื้นสูง",
      "Penicillium spp. — กากชา rapeseed และถั่ว alfalfa"
    ],
    "answer": 2,
    "explain": "✓ Aflatoxin จาก Aspergillus flavus ชอบสภาพ humid + อุ่น (เก็บข้าวโพด/ถั่วในโกดังชื้น) — สร้างพิษกลุ่ม B1/B2/G1/G2 (B1 พิษสุดและ carcinogen ที่ทำให้คนเป็นมะเร็งตับ)\n  - Clinical: suppress immune, milk drop, diarrhea, carcinogen ที่ตับ\n✗ Fusarium roseum สร้าง zearalenone (F-2), DON, T-2\n✗ Claviceps สร้าง ergot alkaloid\n💡 Susceptible species ของ aflatoxin = ducks (เป็ดไวสุด) > สุกร > อื่น ๆ",
    "verified": "swine herd mid p.18 aflatoxin section"
  },
  {
    "id": 92007,
    "subject": "swine-herd",
    "topic": "psy-calculation",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86 อ.รุ่งธรรม",
    "tags": [
      "psy",
      "production-calculation",
      "weaned-pigs",
      "sow-productivity"
    ],
    "type": "mcq",
    "q": "ฟาร์มแห่งหนึ่งมีแม่สุกร 1500 แม่ ต้องการ PSY = 30 ตัว/แม่/ปี ลูกอย่านมต่อแม่คลอด > 12 ตัว อัตราการผสมติด > 95% ลูกสุกรประมาณกี่ตัวต่อสัปดาห์ที่ต้องผลิต (ไม่ต้องเผื่อ 10% ตอบเลขที่คำนวณได้เป็นจำนวนเต็ม)",
    "options": [
      "ลูกสุกรประมาณ 760 ตัวต่อสัปดาห์",
      "ลูกสุกรประมาณ 821 ตัวต่อสัปดาห์",
      "ลูกสุกรประมาณ 866 ตัวต่อสัปดาห์",
      "ลูกสุกรประมาณ 943 ตัวต่อสัปดาห์"
    ],
    "answer": 2,
    "explain": "✓ คำนวณ: 1500 แม่ × 30 ตัว/แม่/ปี = 45,000 ลูกอย่านม/ปี\n  → 45,000 ÷ 52 wk ≈ 865.38 ≈ 866 ตัว/สัปดาห์\n💡 PSY (Pig weaned/Sow/Year) = target = 28-30 ตัวต่อแม่ต่อปี — แม่ pyramid GGP → PS\n💡 1 production cycle ≈ 147-160 d → 1 ปีให้ได้ 2.4-2.48 รอบ",
    "verified": "swine herd mid p.27 อ.เพราพิลาส Q4 — 45,000÷52 = 865.38 ≈ 866 ตัว/wk"
  },
  {
    "id": 92008,
    "subject": "swine-herd",
    "topic": "adg-calculation",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86 อ.เพราพิลาส",
    "tags": [
      "adg",
      "production-calculation",
      "feed-conversion",
      "fcr"
    ],
    "type": "mcq",
    "q": "สุกรคอกหนึ่ง 10 ตัว เข้าทดสอบอาหารวันที่ 1 ก.ค. เวลา 8:00 น. สิ้นสุด 31 ก.ค. เวลา 8:00 น. (30 วัน) น้ำหนักรวมเพิ่ม 500 kg สุกรได้รับอาหารรวม 800 kg (ถัง 40 kg × 20 ถัง = 800 kg, เหลือ 70 kg → กิน 730 kg) ค่า ADG ของสุกรเท่ากับเท่าใด",
    "options": [
      "ADG = 1.67 kg/ตัว/วัน",
      "ADG = 2.43 kg/ตัว/วัน",
      "ADG = 1.99 kg/ตัว/วัน",
      "ADG = 0.67 kg/ตัว/วัน"
    ],
    "answer": 0,
    "explain": "✓ ADG = (น้ำหนักเพิ่มต่อตัว) ÷ จำนวนวัน = (500 ÷ 10) ÷ 30 = 50 ÷ 30 = 1.67 kg/ตัว/วัน\n✗ 2.43 = ADFI (กินอาหารต่อตัวต่อวัน = 730÷10÷30 = 2.43)\n✗ 1.99 ≈ FCR (= 730÷500 = 1.46) ใกล้ตอบ แต่ไม่ตรง\n✗ 0.67 = FE (feed efficiency = 50÷73 = 0.685)\n💡 4 ตัวชี้วัด: ADG = น้ำหนักเพิ่ม/วัน, ADFI = อาหารกิน/วัน, FCR = อาหาร/น้ำหนักเพิ่ม, FE = 1/FCR",
    "verified": "swine herd mid p.27 อ.เพราพิลาส Q1 — 500÷10÷30 = 1.67 kg/d"
  },
  {
    "id": 92009,
    "subject": "swine-herd",
    "topic": "swine-house-count-calculation",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86 อ.เพราพิลาส",
    "tags": [
      "swine-house",
      "production-flow",
      "all-in-all-out",
      "calculation"
    ],
    "type": "mcq",
    "q": "ฟาร์มแห่งหนึ่งมีลูกสุกรอย่านม 20,000 ตัว/ปี ใช้ขุนหนึ่งรอบเท่ากับ 26 สัปดาห์ 1 โรงเรือนจุสุกรขุนได้ 800 ตัว ต้องใช้โรงเรือนกี่โรงเรือน (ไม่ต้องเผื่อ 10% ตอบจำนวนเต็ม)",
    "options": [
      "13 โรงเรือน",
      "15 โรงเรือน",
      "18 โรงเรือน",
      "20 โรงเรือน"
    ],
    "answer": 0,
    "explain": "✓ คำนวณ: 1 ปี = 52 wk → รอบขุน 26 wk = 2 รอบ/ปี\n  - 1 โรง × 800 ตัว × 2 รอบ/ปี = 1,600 ตัว/โรง/ปี\n  - 20,000 ÷ 1,600 = 12.5 → ปัดขึ้น 13 โรงเรือน\n💡 All-in-all-out flow: ลูกหมูทุกตัว age-batched เข้า/ออกพร้อมกัน ลดโรคแพร่ข้าม age-cohort",
    "verified": "swine herd mid p.27 อ.เพราพิลาส Q2 — 20,000÷(800×2) = 12.5 → 13 โรง"
  },
  {
    "id": 92010,
    "subject": "swine-herd",
    "topic": "production-tree-low-total-born",
    "year": 4,
    "source": "Record Analysis.pdf",
    "examOrigin": "Record Analysis อ.รุ่งธรรม",
    "tags": [
      "production-tree",
      "total-born",
      "ovulation",
      "fertilization",
      "embryonic-death"
    ],
    "type": "mcq",
    "q": "ฟาร์มสุกรพบปัญหา Low total born (ลูกเกิดทั้งหมดต่อแม่ลด) ในระยะ <30 d หลัง mating ปัญหาน่าจะเกิดที่ระยะใดของ pregnancy timeline มากที่สุด",
    "options": [
      "Embryonic deaths totally reabsorbed (1-30 d post-conception)",
      "Fetal deaths partially reabsorbed → Mummies (38-100 d)",
      "Stillborns — deaths not reabsorbed (>100 d / peri-parturient)",
      "Pre-weaning mortality หลังคลอด"
    ],
    "answer": 0,
    "explain": "✓ Low total born = ปัญหาที่ ovulation rate, fertilization, หรือ early embryonic death (1-30 d) ก่อน pregnancy signal\n  - Embryo ตายช่วงนี้จะถูก reabsorb หมด → แม่กลับมา return-to-estrus หรือเหลือลูกน้อย\n✗ Mummies = ลูกตาย 38-100 d (calcification เริ่มแล้ว reabsorb ไม่หมด)\n✗ Stillborns = ตายปริ-parturient (>100 d, ไม่ reabsorb)\n💡 Production tree: low total born → look at ovulation/fertilization/embryonic death; mummies → 30-70 d; stillborns → late",
    "verified": "Record Analysis.pdf slide 14/19/43 — timeline conception → parturition"
  },
  {
    "id": 92011,
    "subject": "swine-herd",
    "topic": "parity-structure-management",
    "year": 4,
    "source": "Record Analysis.pdf",
    "examOrigin": "Record Analysis อ.รุ่งธรรม",
    "tags": [
      "parity-structure",
      "culling",
      "gilt-replacement",
      "production-peak"
    ],
    "type": "mcq",
    "q": "Parity structure ที่ดีของฝูงแม่สุกรควรเป็นอย่างไร — โดยพิจารณาจาก performance curve (born alive peak ที่ parity 2-4)",
    "options": [
      "P1 = 35%, P2 = 22%, P3-7 = 10% — ฝูง young heavy ไม่ culled",
      "P1 = 20%, P2-4 = 18-19% (peak), P5+ ค่อย ๆ ลด — pyramid ปกติ",
      "P1 = 7%, P2-4 = 13-22%, P>7 = 18% — มี old sows เหลือมากเกิน",
      "P1 = 50%, P2 = 30%, P3+ = 5-10% — replace ทุกปี"
    ],
    "answer": 1,
    "explain": "✓ Parity structure ปกติ: P1 ≈ 20%, P2-4 peak ที่ 17-19%, P5+ ลดลงต่อเนื่อง 10/6/5/5% — minimum culling ก่อน peak (P2-4), selective culling หลัง peak\n  - Born alive peak ที่ parity 2-4 → ฟาร์มต้องเก็บแม่ให้ถึงรอบนี้\n✗ ตัวเลือก a + c = poor parity structure (young-heavy หรือ old-heavy → poor production)\n✗ ตัวเลือก d = over-replacement → ขาด experienced sows ที่อยู่ peak\n💡 Performance not equal across parities — culling ทำหลัง peak (P5+ onwards)",
    "verified": "Record Analysis.pdf slides 33-37 parity structure + production curve"
  },
  {
    "id": 92012,
    "subject": "swine-herd",
    "topic": "npd-calculation",
    "year": 4,
    "source": "Record Analysis.pdf",
    "examOrigin": "Record Analysis อ.รุ่งธรรม",
    "tags": [
      "npd",
      "non-productive-day",
      "lsy",
      "production-tree"
    ],
    "type": "mcq",
    "q": "Non-productive Day (NPD) ของแม่สุกรหมายถึงข้อใดและคำนวณอย่างไร",
    "options": [
      "วันที่แม่ inactive ระหว่างคลอด คำนวณจาก farrowing duration",
      "วันที่แม่เข้าฝูงผสมพันธุ์แล้วไม่ได้ทั้ง pregnant และไม่ได้ nursing — NPD = 365 − [(gest days + lact days) × LSY]",
      "จำนวนวันที่แม่สาวรอ first heat — คำนวณจาก puberty age",
      "วันที่ระหว่างคัดทิ้งและขายส่ง — คำนวณจาก culling-to-sale interval"
    ],
    "answer": 1,
    "explain": "✓ NPD (non-productive sow day) = any day ที่แม่ entered breeding herd แล้วไม่ได้ pregnant และไม่ได้ nursing a litter — ฟาร์มยังต้องจ่ายค่า feed + space\n  - สูตร: NPD/ปี = 365 − [(gestation days + lactation days) × LSY (litter/sow/year)]\n  - High-perform farm: NPD ≈ 42 d/ปี, ordinary farm: NPD ≈ 63 d/ปี → NPD diff ≈ 21 d\n💡 Main components ของ NPD diff: sow first-mating-to-pregnancy (6.18 d) + sow first-mating-to-culling (6.90 d)",
    "verified": "Record Analysis.pdf slides 26-29 NPD definition + formula + 95-farms Japan study"
  },
  {
    "id": 92013,
    "subject": "swine-herd",
    "topic": "return-to-estrus-pattern",
    "year": 4,
    "source": "Record Analysis.pdf",
    "examOrigin": "Record Analysis อ.รุ่งธรรม",
    "tags": [
      "return-to-estrus",
      "regular-return",
      "irregular-return",
      "embryonic-death"
    ],
    "type": "mcq",
    "q": "ฟาร์มแม่สุกรพบ %return-to-estrus สูง 23% (target 8%) Pattern: return 10-17 d = 2.3%, return 18-24 d = 1.2%, return 25-35 d = 14.9% — ลักษณะนี้บ่งบอกถึงปัญหาใดมากที่สุด",
    "options": [
      "Regular return — failure of fertilization (3-week cycle ปกติ 18-24 d)",
      "Irregular return — early embryonic death ที่ระหว่าง 12-30 d (pregnancy signal failed)",
      "Failed to detect estrus — ไม่ใช่ปัญหาทาง biology",
      "Mating with inferior boar semen quality"
    ],
    "answer": 1,
    "explain": "✓ Pattern: return 25-35 d (14.9%) สูงกว่า return 18-24 d (regular cycle 21 d) = irregular return\n  - Irregular return → ตั้งท้องระยะแรกแต่ embryo ตาย 12-30 d (after pregnancy signal failed) → cycle ยืดไป 25-35 d\n  - สาเหตุ: stress, moving sows ก่อน D35 (implantation ยังไม่สมบูรณ์), nutrition, mycotoxin, diseases\n✗ Regular return = 18-24 d (3-week cycle) = fertilization failure → ตัวอย่างนี้กลับเป็น 1.2% เท่านั้น\n💡 Target return rate: total <8-10%, regular ~5%, irregular ~3%",
    "verified": "Record Analysis.pdf slides 45, 55 return-to-estrus pattern Ex.2"
  },
  {
    "id": 92014,
    "subject": "swine-herd",
    "topic": "wsi-fertility-relationship",
    "year": 4,
    "source": "Record Analysis.pdf",
    "examOrigin": "Record Analysis อ.รุ่งธรรม",
    "tags": [
      "wsi",
      "wean-to-service",
      "lactation",
      "fertility"
    ],
    "type": "mcq",
    "q": "Wean-to-Service Interval (WSI) ของแม่สุกรหลังหย่านม ค่า ideal และผลต่อ fertility คือข้อใด",
    "options": [
      "WSI 15+ d = good fertility (แม่ได้พักนาน estrus แข็งแรง)",
      "WSI 1-7 d = good fertility, WSI 8-14 d = risky, WSI 15+ d = varied (poor fertility ส่วนใหญ่)",
      "WSI > 21 d เป็น optimal — ตรงกับ estrus cycle ปกติ",
      "WSI ไม่มีผลต่อ fertility — ขึ้นกับ boar quality เท่านั้น"
    ],
    "answer": 1,
    "explain": "✓ WSI ideal = 5-7 d (target 90% ของแม่ < 7 d) → good fertility\n  - WSI 1-7 d = good (สอดคล้อง LH surge ปกติหลัง wean)\n  - WSI 8-14 d = risky\n  - WSI 15+ d = varied (เสี่ยง poor fertility สูง)\n💡 Cause ของ long WSI: poor sow condition during lactation (BCS ต่ำ, lactation feed ไม่พอ) → delayed estrus → longer WSI → poorer fertility ลูกครอกต่อไป",
    "verified": "Record Analysis.pdf slides 50-51 WSI fertility relationship + อ.พรชลิต feed table"
  },
  {
    "id": 92015,
    "subject": "swine-herd",
    "topic": "sow-feeding-lactation",
    "year": 4,
    "source": "Swine Hlth final TJ.pdf",
    "examOrigin": "Swine Health Final TJ86 อ.พรชลิต",
    "tags": [
      "sow-feeding",
      "lactation",
      "bcs",
      "flushing"
    ],
    "type": "mcq",
    "q": "อ.พรชลิต สอนการให้อาหารแม่สุกรในระยะ lactation 3 สัปดาห์ (week 3) ปริมาณอาหารต่อตัวต่อวัน",
    "options": [
      "2 kg/ตัว/วัน restriction (เหมือนช่วงตั้งท้องแรก)",
      "4 kg/ตัว/วัน",
      "6 kg/ตัว/วัน → ad libitum 2-3 มื้อ/วัน",
      "10 kg/ตัว/วัน feed pump"
    ],
    "answer": 2,
    "explain": "✓ Lactation feeding plan ของอ.พรชลิต:\n  - Week 1: 4 kg/ตัว/วัน → ad libitum 2-3 มื้อ/วัน\n  - Week 2: 5 kg/ตัว/วัน → ad libitum 2-3 มื้อ/วัน\n  - Week 3: 6 kg/ตัว/วัน → ad libitum 2-3 มื้อ/วัน\n  - Pre-farrow 2-3 d: 1.8-2.3 kg/ตัว/วัน\n✗ Restriction 2 kg เป็นช่วง gestation 1-4 wk (BCS=3 target)\n💡 WSI (wean-to-service) ขึ้นกับ flushing — ก่อนผสม flushing 3-4 kg/d ประมาณ 1 wk หลังหย่านม",
    "verified": "Swine Hlth final TJ.pdf อ.พรชลิต section sow feeding by stage"
  },
  {
    "id": 92016,
    "subject": "swine-herd",
    "topic": "swine-welfare-5-freedoms",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86 อ.บุญฤทธิ์",
    "tags": [
      "welfare",
      "5-freedoms",
      "ethics",
      "animal-welfare-act"
    ],
    "type": "mcq",
    "q": "หลัก 5 Freedoms ของ Animal Welfare ครอบคลุม 5 ด้าน ข้อใด NOT INCLUDED ใน 5 freedoms",
    "options": [
      "Freedom from hunger and thirst",
      "Freedom from discomfort",
      "Freedom from pain and disease",
      "Freedom from economic burden of owner"
    ],
    "answer": 3,
    "explain": "✓ 5 Freedoms (Brambell 1965, FAWC):\n  1. Freedom from hunger and thirst\n  2. Freedom from discomfort\n  3. Freedom from pain, injury, disease\n  4. Freedom from fear and distress\n  5. Freedom to express normal behaviour\n✗ Economic burden ไม่ใช่หลัก welfare — เป็น issue ของผู้เลี้ยง\n💡 พรบ.ป้องกันทารุณกรรมสัตว์ 2557 มี 4 ข้อ: ไม่ทำร้ายโดยไม่จำเป็น / เจ้าของต้องจัด welfare / มองศักดิ์ welfare / มีสถานสงเคราะห์",
    "verified": "swine herd mid p.21 อ.บุญฤทธิ์ 5 freedoms + พรบ.ทารุณกรรมสัตว์"
  },
  {
    "id": 92017,
    "subject": "swine-herd",
    "topic": "swine-euthanasia-method",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86 อ.บุญฤทธิ์",
    "tags": [
      "euthanasia",
      "co2",
      "gunshot",
      "captive-bolt",
      "asf-depopulation"
    ],
    "type": "mcq",
    "q": "การุณยฆาตสุกรน้ำหนัก 80-100 kg ในเหตุระบาด ASF ต้องเลือกวิธีที่ rapid + humane + ปลอดภัยกับบุคลากร — วิธีที่ NOT recommended สำหรับสุกรขนาดนี้",
    "options": [
      "CO2 gas concentration 70% ในห้องปิด → acidosis CNS",
      "Captive bolt ที่กลางหน้าผากเหนือตา (cross-mark) + bleed-out",
      "Anesthetic overdose + tranquilizer (azaperone) ลด stress ก่อน",
      "Head blunt trauma — ใช้ค้อนทุบหัว สำหรับ adult pigs 80-100 kg"
    ],
    "answer": 3,
    "explain": "✓ Head blunt trauma เหมาะกับ piglet/neonate เท่านั้น — adult 80-100 kg skull หนาเกิน → ไม่ humane (ทำให้สัตว์เจ็บก่อนตาย) + อันตรายกับผู้ปฏิบัติ\n✓ Methods ที่เหมาะกับ adult ASF depopulation:\n  - CO2 gas 70% (close chamber)\n  - Anesthetic overdose + tranquilizer\n  - Captive bolt / gunshot ที่ frontal cross-mark\n  - Electrocution (electrode ที่หู → fibrillation cardiac)\n💡 Death confirmation: heart rate + respiration + pupil light reflex (caution: atropine ก่อ pupil dilated false-positive)",
    "verified": "swine herd mid p.22 อ.บุญฤทธิ์ euthanasia methods + ASF 20 ตัว essay"
  },
  {
    "id": 92018,
    "subject": "swine-herd",
    "topic": "boar-restraint-snare",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86 อ.บุญฤทธิ์",
    "tags": [
      "restraint",
      "snare",
      "boar",
      "blood-collection",
      "jugular-fossa"
    ],
    "type": "mcq",
    "q": "การจับบังคับสุกรขนาดใหญ่ (boar/sow) ด้วย wire/rope snare เพื่อเจาะเลือดที่ jugular fossa ขวา ตำแหน่ง loop snare ที่ถูกต้อง",
    "options": [
      "ห่วงคล้องที่คอ ผูกแน่นกับเสา",
      "ห่วงคล้องที่ upper lip (riam หลังเขี้ยว) ตรงปุ่ม-เบ้า แล้วปรับระดับให้ตึง",
      "ห่วงคล้องที่ตา ปิดการมองเห็นเพื่อสงบ",
      "ห่วงคล้องที่หาง ดึงให้สัตว์ยืนนิ่ง"
    ],
    "answer": 1,
    "explain": "✓ Wire/rope snare = loop รัดที่ upper lip ของหมูใหญ่ — คล้องที่หลุมหลังฟันเขี้ยว ตรงปุ่ม-เบ้า แล้วปรับให้ตึง (ไม่บาดปาก)\n  - หมูจะถอยหลังต้านแรงดึง → ยืนนิ่งให้เจาะเลือดได้ที่ jugular fossa\n✗ คอ/ตา/หาง = ไม่ใช่ standard restraint สำหรับหมูใหญ่\n💡 Site เจาะเลือด = Rt. jugular fossa (right cranial vena cava drains into right side, ลดความเสี่ยง phrenic nerve damage ที่ซ้าย)\n💡 หมูเล็ก: ดึงขาหลัง 2 ข้าง คว่ำลง (ไม่ใช่ snare — sad T_T เสียง)",
    "verified": "swine herd mid p.22 อ.บุญฤทธิ์ restraining boar with wire/rope snare"
  },
  {
    "id": 92019,
    "subject": "swine-herd",
    "topic": "breeding-system-3-breed-cross",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86 อ.อจิมา",
    "tags": [
      "breeding-system",
      "terminal-cross",
      "heterosis",
      "duroc"
    ],
    "type": "mcq",
    "q": "ระบบผสมข้ามพันธุ์แบบ 3 พันธุ์ (3-breed terminal cross) ในฟาร์มสุกรพาณิชย์ใช้พันธุ์ใดเป็น sire line สุดท้าย และให้ลูกแบบใด",
    "options": [
      "Landrace × Yorkshire (LR-LW two-line) — เก็บไว้เป็นแม่พันธุ์",
      "(LR × LW) × Duroc — ลูกหมูขุน 3 สาย (terminal cross) เน้น heterosis + เนื้อแดง",
      "Berkshire × Hampshire — กรอบนุ่ม สำหรับ kurobuta",
      "Pietrain × Yorkshire — สำหรับ purebred GGP"
    ],
    "answer": 1,
    "explain": "✓ 3-breed terminal cross (สุกรพาณิชย์ Thai standard):\n  - GGP (ทวดพันธุ์) → purebred LR, LW, Duroc\n  - GP (ปู่ย่า) → (LR × LW) สองสาย = แม่สองสาย\n  - PS (พ่อแม่พันธุ์) → (LR-LW) แม่สองสาย × Duroc พ่อ → ลูก 3 สาย (terminal — ขายทั้งหมด)\n  - ผลดี: heterosis สูงสุด, ความสมบูรณ์พันธุ์แม่ดี (จาก LR-LW), เนื้อแดง+ADG ดี (จาก Duroc sire)\n✗ Berkshire = สำหรับ kurobuta พิเศษ ไม่ใช่ pyramid commercial\n💡 Duroc = sire line เนื้อแดง pleiotropy gene (NN/Nn — Pietrain มี Pss กว่า)",
    "verified": "swine herd mid p.11-12 อ.อจิมา 3-breed cross + pyramid GGP→PS"
  },
  {
    "id": 92020,
    "subject": "swine-herd",
    "topic": "halothane-gene-pss",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86 อ.อจิมา",
    "tags": [
      "halothane-gene",
      "pss",
      "porcine-stress-syndrome",
      "marker-assisted-selection"
    ],
    "type": "mcq",
    "q": "Halothane gene ในสุกรเชื่อมโยงกับ Porcine Stress Syndrome (PSS) แบบ pleiotropy — ทำให้เนื้อแดง+โตเร็ว แต่เครียดง่าย MAS (Marker-Assisted Selection) สามารถ detect ได้ระดับใด",
    "options": [
      "detect ได้เฉพาะ homozygous resistant (NN) เท่านั้น",
      "detect ได้ทั้ง NN, Nn, nn — เก็บ NN ขยายพันธุ์ คัด Nn/nn ทิ้ง",
      "detect ไม่ได้ — ต้อง halothane challenge test เท่านั้น",
      "detect ได้แค่ phenotype PSE meat หลังโรงเชือด"
    ],
    "answer": 1,
    "explain": "✓ MAS ใช้ DNA marker หา PSS allele → detect ได้ทุก genotype: NN (homozygous resistant), Nn (heterozygous carrier), nn (homozygous susceptible)\n  - เก็บ NN เป็น sire/dam line, คัด carrier (Nn) + susceptible (nn) ทิ้ง\n  - PSS susceptible → halothane gas ก่อ malignant hyperthermia + PSE meat (pale soft exudative)\n✗ Halothane challenge แต่ก่อนทำได้แค่ระดับ phenotype (กำจัด nn ที่แสดง MH) — แต่กำจัด Nn carrier ไม่ได้\n💡 Pleiotropy = 1 gene → หลาย trait: เนื้อแดง+โตเร็ว (+) + เครียด/PSE (−)",
    "verified": "swine herd mid p.10 อ.อจิมา MAS + halothane gene + PSE meat"
  },
  {
    "id": 92021,
    "subject": "swine-herd",
    "topic": "blup-breeding-value",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86 อ.อจิมา",
    "tags": [
      "blup",
      "breeding-value",
      "ebv",
      "selection"
    ],
    "type": "mcq",
    "q": "BLUP (Best Linear Unbiased Prediction) ในการคัดเลือกพันธุ์สุกรใช้ทำสิ่งใด",
    "options": [
      "วัดน้ำหนักจริงด้วย ultrasound (back fat + LEA)",
      "ใส่ข้อมูลพันธุ์ประวัติ + performance ของญาติ → คำนวณ EBV (Estimated Breeding Value) → จัดลำดับเลือก",
      "ตรวจ DNA หาเครื่องหมายพันธุกรรม PSS",
      "ทดสอบ halothane gas dose ที่ทำให้สุกรเริ่มเครียด"
    ],
    "answer": 1,
    "explain": "✓ BLUP = statistical model ที่ใส่ pedigree + performance data ของตัวสัตว์และญาติ → คำนวณ EBV (Estimated Breeding Value) เพื่อจัดลำดับเลือกพันธุ์\n  - ใช้ทำ selection index — เลือกตัวที่มี EBV สูงสุดในแต่ละ trait (ADG, FCR, BF, litter size)\n✗ Ultrasound = real-time measurement of BF + LEA — ใส่เข้าใน BLUP ได้แต่ไม่ใช่ BLUP เอง\n✗ MAS = marker assisted selection (DNA marker) — เสริม BLUP ได้\n💡 BLUP + MAS + ultrasound → modern integrated breeding program",
    "verified": "swine herd mid p.10-12 อ.อจิมา BLUP + MAS + selection index"
  },
  {
    "id": 92022,
    "subject": "swine-herd",
    "topic": "swine-dysentery-brachyspira",
    "year": 4,
    "source": "Swine Hlth final TJ.pdf",
    "examOrigin": "Swine Health Final TJ86",
    "tags": [
      "swine-dysentery",
      "brachyspira",
      "tiamulin",
      "diarrhea-bloody"
    ],
    "type": "mcq",
    "q": "หมูอายุ 10-week ถ่ายเหลว ตาย 2-3 ตัว บางตัวถ่ายมีเลือด สาเหตุที่ น่าจะใช่ที่สุดและยาที่เหมาะสมที่สุด",
    "options": [
      "PEDV (porcine epidemic diarrhea) — ยา supportive only",
      "Brachyspira hyodysenteriae (Swine Dysentery) — ยา tiamulin 10 mg/kg",
      "Coccidia (Isospora suis) — ยา toltrazuril",
      "Rotavirus — ยาแก้อาเจียน + ORS"
    ],
    "answer": 1,
    "explain": "✓ Swine Dysentery (B. hyodysenteriae): bloody diarrhea (mucohemorrhagic) ในหมูอายุ 6-16 wk (grower/finisher), mortality moderate\n  - Drug of choice: Tiamulin หรือ oxytetracycline 10 mg/kg, sensitivity test แนะนำ\n  - Sample: feces + large intestine tissue\n✗ PEDV/Rotavirus = ลูกสุกรอายุน้อย (neonate), อาการ watery ไม่ใช่ bloody\n✗ Coccidia = piglet 1-3 wk, treatment toltrazuril/sulfa\n💡 Diff dx bloody diarrhea: Brachyspira + Salmonella + Lawsonia (PIA) + Trichuris",
    "verified": "Swine Hlth final TJ.pdf Q4 อ.สุพจน์ section diarrhea 10-wk + Brachyspira hyodysenteriae"
  },
  {
    "id": 92023,
    "subject": "swine-herd",
    "topic": "sensitivity-specificity-calculation",
    "year": 4,
    "source": "Swine Hlth final TJ.pdf",
    "examOrigin": "Swine Health Final TJ86 อ.สุพจน์",
    "tags": [
      "sensitivity",
      "specificity",
      "diagnostic-test",
      "epidemiology"
    ],
    "type": "mcq",
    "q": "ผลตรวจ test kit: True disease+ test+ = 22 (a), True disease− test+ = 1 (b), True disease+ test− = 14 (c), True disease− test− = 43 (d) คำนวณ sensitivity และ specificity",
    "options": [
      "Sensitivity = 22/23 = 96%, Specificity = 43/57 = 75%",
      "Sensitivity = 22/36 = 61%, Specificity = 43/44 = 98%",
      "Sensitivity = 22/44 = 50%, Specificity = 43/36 = 119%",
      "Sensitivity = 43/57 = 75%, Specificity = 22/23 = 96%"
    ],
    "answer": 1,
    "explain": "✓ Sensitivity = True Positive / (True Positive + False Negative) = a/(a+c) = 22/(22+14) = 22/36 = 61% — ไวจับโรค (rule-OUT test)\n✓ Specificity = True Negative / (True Negative + False Positive) = d/(b+d) = 43/(1+43) = 43/44 = 98% — แม่นจับ no-disease (rule-IN test)\n💡 ชุดนี้ sens ต่ำ (61% — มี false negative สูง) → ไม่เหมาะ screening\n💡 spec สูง (98%) → ถ้า positive ค่อนข้างเชื่อได้",
    "verified": "Swine Hlth final TJ.pdf Q1 อ.สุพจน์ 2x2 table calculation"
  },
  {
    "id": 92024,
    "subject": "swine-herd",
    "topic": "epidemic-vs-endemic",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86",
    "tags": [
      "epidemiology",
      "epidemic",
      "endemic",
      "pandemic",
      "asf",
      "fmd"
    ],
    "type": "mcq",
    "q": "คำใดอธิบายสถานะของ ASF ทั่วโลกในปี 2024-2025 ได้ตรงที่สุด",
    "options": [
      "Sporadic — เกิดประปราย ไม่มี pattern",
      "Endemic — เกิดประจำในบางประเทศและบางทวีป",
      "Epidemic — outbreak ในช่วงเวลาจำกัด พื้นที่จำกัด",
      "Pandemic — เกิดทั่วโลก (worldwide spread) ยกเว้นบางทวีป เช่น Oceania"
    ],
    "answer": 3,
    "explain": "✓ ASF ปัจจุบัน = pandemic — global spread ตั้งแต่ 2007 จาก Georgia → รัสเซีย → ยุโรปตะวันออก → จีน 2018 → SE Asia 2019 (รวมไทย 2022) → ทั่วโลกยกเว้น Oceania (Australia/NZ)\n✗ Endemic = predictable frequency ในบางพื้นที่ — FMD/PRRS เป็น endemic ในไทยแต่ ASF เป็น pandemic\n✗ Epidemic = unpredictable spike — ตอน ASF เริ่มในไทย 2022 = epidemic, ปัจจุบันใกล้ endemic\n💡 Pandemic ตัวอย่างอื่น: COVID-19, H1N1 2009, FMD type O (also pandemic by region)",
    "verified": "swine herd mid p.23 epidemiology section endemic/epidemic/pandemic"
  },
  {
    "id": 92025,
    "subject": "swine-herd",
    "topic": "cross-sectional-vs-case-control",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86",
    "tags": [
      "epidemiology",
      "study-design",
      "cross-sectional",
      "case-control",
      "prevalence"
    ],
    "type": "mcq",
    "q": "ฟาร์มต้องการทราบ prevalence ของ PRRS ในลูกสุกรอายุ 3w / 6w / 9w เพื่อ baseline survey — ควรเลือก study design ใด",
    "options": [
      "Cross-sectional study — snapshot ที่ point-in-time → prevalence",
      "Case-control study — เลือก cases vs controls หา risk factor",
      "Prospective cohort — follow groups across time → incidence",
      "Retrospective case series — เก็บ history เก่า ๆ"
    ],
    "answer": 0,
    "explain": "✓ Cross-sectional study (CSS) = snapshot ที่ point-in-time, เก็บ sample ทั้งกลุ่ม → คำนวณ prevalence ได้\n  - ตัวอย่าง: เจาะเลือดลูกสุกร 3w/6w/9w วันเดียวกัน หา %seropositive ของแต่ละ age\n  - ✓ cost+time ต่ำ, ✗ ไม่ได้ causal relationship\n✗ Case-control = หา risk factor (cases vs controls) — ใช้กับโรค rare\n✗ Prospective cohort = follow-forward → incidence\n💡 Prevalence = existing cases / total at one time, Incidence = new cases / time × population",
    "verified": "swine herd mid p.23-24 epidemiology study design CSS vs case-control"
  },
  {
    "id": 92026,
    "subject": "swine-herd",
    "topic": "isolation-acclimatization-new-gilts",
    "year": 4,
    "source": "Swine Hlth final TJ.pdf",
    "examOrigin": "Swine Health Final TJ86 อ.อธิภู",
    "tags": [
      "isolation",
      "acclimatization",
      "biosecurity",
      "gilt-replacement",
      "feedback"
    ],
    "type": "mcq",
    "q": "ฟาร์มจะนำสุกรสาวทดแทน (replacement gilts) เข้าฟาร์มใหม่ ขั้นตอน biosecurity ที่ถูกต้องตามลำดับ",
    "options": [
      "ฉีดวัคซีน → ปล่อยเข้าฝูงทันที → observe 7 วัน",
      "Isolation 30 วัน (กักโรค) → Acclimatization (ปรับภูมิ ≥3 เดือน, อาจใช้ feedback) → Recovery → ปล่อยรวมฝูง",
      "Recovery 14 วัน → Feedback colostrum สด → ปล่อยฝูง",
      "ผสมรวมฝูงเก่าเลย → ปรับ flora ธรรมชาติ"
    ],
    "answer": 1,
    "explain": "✓ Standard biosecurity for new gilts:\n  1. Isolation 30 d — กักโรค separate site/farm, observe health, ทดสอบ disease-free\n  2. Acclimatization 3 mo — ปรับ immune ให้เข้ากับ farm pathogen profile — อาจ vaccinate, exposed to farm fomites/feces (feedback), หรือ co-housing with sentinel sows\n  3. Recovery — immune stabilization ก่อนปล่อยเข้าฝูงผสมพันธุ์\n✗ Vaccinate-then-mix ไม่ใช่ standard — เสี่ยง PRRS/Glasser ระบาด\n💡 Feedback = exposure to controlled pathogen (feces, manure, dead piglet) เพื่อ build immune — ต้องระวังไม่ให้เป็นทาง spread reverse",
    "verified": "Swine Hlth final TJ.pdf อ.อธิภู section isolation/acclimatization + swine herd mid p.5 closed herd"
  },
  {
    "id": 92027,
    "subject": "swine-herd",
    "topic": "mastitis-subclinical-scc",
    "year": 4,
    "source": "Udder Health.pdf",
    "examOrigin": "Udder Health อ.ศิริรัตน์",
    "tags": [
      "mastitis",
      "subclinical",
      "scc",
      "somatic-cell-count",
      "cmt"
    ],
    "type": "mcq",
    "q": "Subclinical mastitis ในโคนมไม่มีอาการ visible แต่ทำให้ผลผลิตน้ำนมและคุณภาพลดลง — การตรวจที่เหมาะสมที่สุดในระดับฟาร์มคือข้อใด",
    "options": [
      "ดูสีน้ำนมและคลำเต้าให้ครบทุก quarter ทุกวัน",
      "Somatic Cell Count (SCC) — direct count หรือ indirect ด้วย California Mastitis Test (CMT)",
      "เพาะเชื้อแบคทีเรียทุกตัวทุกสัปดาห์",
      "Bulk tank PCR ทุกเช้า"
    ],
    "answer": 1,
    "explain": "✓ Subclinical mastitis = no visible signs, milk appearance ปกติ → ตรวจด้วย SCC (somatic cell count)\n  - Direct SCC: lab count, threshold > 200,000 cells/mL = subclinical\n  - Indirect: California Mastitis Test (CMT) ที่ farm-side ใช้ detergent ทำให้ cell DNA gel up → กระจายตัวบ่งบอกระดับ SCC\n✗ Visual inspection ไม่จับ subclinical (definition คือ no visible)\n✗ Bacterial culture ทุกตัวทุกสัปดาห์ — expensive + slow, ใช้ตอนสงสัยและเลือก antibiotic\n💡 Iceberg: subclinical mastitis prevalence < 15% ของฝูง > clinical mastitis < 5%",
    "verified": "Udder Health.pdf slide 18 subclinical mastitis + SCC + CMT"
  },
  {
    "id": 92028,
    "subject": "swine-herd",
    "topic": "contagious-vs-environmental-mastitis-pathogens",
    "year": 4,
    "source": "Udder Health.pdf",
    "examOrigin": "Udder Health อ.ศิริรัตน์",
    "tags": [
      "mastitis",
      "contagious",
      "environmental",
      "staphylococcus-aureus",
      "streptococcus-uberis"
    ],
    "type": "mcq",
    "q": "เชื้อก่อ mastitis แบ่งเป็น contagious และ environmental เชื้อกลุ่ม contagious มีลักษณะใดเด่นที่สุด",
    "options": [
      "เชื้อมาจากดิน, bedding, น้ำสกปรก — เช่น Streptococcus uberis, E. coli, Klebsiella",
      "ติดต่อจากเต้าโคหนึ่งไปอีกเต้าระหว่าง milking — เช่น Staphylococcus aureus, Streptococcus agalactiae, Mycoplasma bovis",
      "ติดจากคนเลี้ยงเท่านั้น — เช่น Aspergillus, Candida",
      "Contagious = อาการ acute ทั้งหมด, environmental = chronic ทั้งหมด"
    ],
    "answer": 1,
    "explain": "✓ Contagious mastitis pathogens = cow-to-cow ส่งผ่านมือ/ผ้า/เครื่อง milking:\n  - Staphylococcus aureus — chronic, treatment-resistant (40% cure rate)\n  - Streptococcus agalactiae — highly contagious, primarily subclinical (>90% cure)\n  - Mycoplasma bovis — herd-wide, no cell wall (no β-lactam)\n✓ Environmental pathogens = จากบริเวณ farm/bedding:\n  - Streptococcus uberis (bedding-associated)\n  - E. coli, Klebsiella (coliforms, endotoxin → acute toxic mastitis)\n  - Enterococcus, Coagulase-negative staph (CNS)\n✗ Contagious vs environmental มี clinical pattern ที่ overlap — ไม่ใช่ acute/chronic แบ่ง",
    "verified": "Udder Health.pdf slides 21-22 contagious vs environmental"
  },
  {
    "id": 92029,
    "subject": "swine-herd",
    "topic": "milking-machine-pulsation",
    "year": 4,
    "source": "Udder Health.pdf",
    "examOrigin": "Udder Health อ.ศิริรัตน์",
    "tags": [
      "milking-machine",
      "pulsation",
      "vacuum-level",
      "teat-health"
    ],
    "type": "mcq",
    "q": "Milking machine parameter ที่ถูกต้องสำหรับการรีดนมที่ปลอดภัยต่อ teat",
    "options": [
      "Vacuum level 80-100 kPa, pulsation 100 cycles/min — เร็วและแรง",
      "Vacuum level 42-48 kPa, pulsation 60-65 cycles/min, ratio 60:40 ถึง 70:30 (milk:massage)",
      "Vacuum level 20-30 kPa, pulsation 30 cycles/min — กลัวเต้าช้ำ",
      "Vacuum level constant 60 kPa, no pulsation — flow ต่อเนื่อง"
    ],
    "answer": 1,
    "explain": "✓ Standard milking machine parameters:\n  - Vacuum level: 42-48 kPa (ต่ำเกิน → milking incomplete + slippage, สูงเกิน → teat congestion + hyperkeratosis + mastitis risk↑)\n  - Pulsation rate: 60-65 cycles/min\n  - Pulsation ratio: 60:40 ถึง 70:30 (milk phase : massage phase)\n  - Faster rate + higher ratio (70:30) = faster milking but more stress\n💡 Milking phase (liner open) = milk flow, massage phase (liner closed) = mimic natural suckling, prevent congestion",
    "verified": "Udder Health.pdf slide 10 key milking machine parameters"
  },
  {
    "id": 92030,
    "subject": "swine-herd",
    "topic": "milk-letdown-oxytocin",
    "year": 4,
    "source": "Udder Health.pdf",
    "examOrigin": "Udder Health อ.ศิริรัตน์",
    "tags": [
      "milk-letdown",
      "oxytocin",
      "myoepithelial",
      "stimulation"
    ],
    "type": "mcq",
    "q": "Mechanism ของ milk letdown เริ่มจาก stimulus ที่เต้า → ภายในกี่วินาทีและผ่านขั้นตอนใด",
    "options": [
      "5 วินาที, ผ่าน adrenaline จาก adrenal gland → contract alveoli",
      "60-90 วินาที, stimulation → hypothalamus → posterior pituitary release oxytocin → myoepithelial cell contraction → milk ejection",
      "5 นาที, vagal nerve → smooth muscle teat cistern → milk pump",
      "Letdown ไม่ต้อง hormone — milk flow ตาม gravity เท่านั้น"
    ],
    "answer": 1,
    "explain": "✓ Milk letdown pathway (60-90 s prep-lag time):\n  1. Stimulation: teat washing, foremilk stripping, CMT → mechanoreceptors\n  2. Afferent nervous tract → hypothalamus\n  3. Hypothalamus → posterior pituitary → release oxytocin (OXT)\n  4. OXT travels via bloodstream → binds myoepithelial cells around alveoli\n  5. Myoepithelial contraction → milk forced into ducts → teat cistern\n💡 Synchronization between machine attachment + letdown = critical → bimodal milk flow ถ้า prep-lag time สั้นเกิน\n✗ Adrenaline ตรงกันข้าม → inhibit letdown (stress response)",
    "verified": "Udder Health.pdf slide 8-9 milk letdown 5-step process"
  },
  {
    "id": 92031,
    "subject": "swine-herd",
    "topic": "thin-sow-syndrome",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86 อ.อนุศกุล",
    "tags": [
      "thin-sow-syndrome",
      "energy-deficiency",
      "bcs",
      "lactation-loss"
    ],
    "type": "mcq",
    "q": "แม่สุกรหลังคลอด BCS ลดจาก 3 → 1.5 หลังหย่านม น้ำนมลด ลูกอย่านมน้ำหนักไม่ถึง 6 kg + WSI ยาว > 14 d สาเหตุที่เป็น primary deficiency คือข้อใด",
    "options": [
      "Excess protein → diarrhea + amino acid imbalance",
      "Energy deficiency (carbohydrate + fat ต่ำ) → catabolism muscle → thin sow syndrome",
      "Excess vitamin A → osteomalacia",
      "Salt deficiency → low water intake"
    ],
    "answer": 1,
    "explain": "✓ Thin sow syndrome = energy deficiency โดย lactation demand สูง (lactation feed needs ↑ทุกสัปดาห์: 4/5/6 kg) ถ้าไม่ได้รับพอ:\n  - แม่ catabolize body fat + muscle → BCS ↓\n  - Repro fail (delayed estrus, long WSI), milk drop, lactation fail\n✓ ใน practice = อาหารแม่ pregnancy ad libitum ไม่พอ ระยะ lactation\n✗ Excess protein → diarrhea แต่ไม่ทำให้ BCS ลด\n✗ Vitamin A excess ทำให้ vit E requirement ↑ → mulberry heart disease\n💡 อ.พรชลิต: pre-mate flushing 3-4 kg/d × 1 wk หลังหย่านม เพื่อ recover energy",
    "verified": "swine herd mid p.16 อ.อนุศกุล nutrient deficiency table + อ.พรชลิต flushing"
  },
  {
    "id": 92032,
    "subject": "swine-herd",
    "topic": "all-in-all-out-system",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86",
    "tags": [
      "all-in-all-out",
      "continuous-flow",
      "biosecurity",
      "age-segregation"
    ],
    "type": "mcq",
    "q": "ระบบการเลี้ยง All-in All-out (AI-AO) มีประโยชน์เด่นข้อใดเหนือกว่า continuous flow",
    "options": [
      "ใช้พื้นที่น้อยลง — ลูกหมูทุกอายุอยู่คอกเดียวกันได้",
      "อายุเท่ากันอยู่โรงเรือนเดียวกัน → ขายพร้อมกัน → ล้าง+พักโรงเรือนระหว่าง batch → ลดโรคแพร่ระหว่าง age cohort",
      "ลด labor cost — ไม่ต้องคัดอายุ",
      "ลด FCR เนื่องจากลูกหมูแย่งอาหารกัน"
    ],
    "answer": 1,
    "explain": "✓ All-in All-out (AI-AO) = ลูกหมูอายุเท่ากันเข้าโรงเรือนพร้อมกัน → ขายพร้อมกัน → ระหว่าง batch ทำความสะอาด+disinfect+พักโรงเรือน (rest period)\n  - ตัดวงจรเชื้อ between age cohort\n  - ลูกหมูใหม่ไม่สัมผัสเชื้อจากกลุ่มเก่า\n  - Reduce respiratory + enteric disease pressure\n✗ Continuous flow = หลายอายุอยู่ในโรงเรือนเดียวกัน — เชื้อแพร่ข้าม cohort ที่ immune ไม่เท่ากัน\n💡 AI-AO ต้อง biosecurity ครบ: clean + disinfect + dry + rest (≥7 d) ก่อน batch ใหม่",
    "verified": "swine herd mid p.1-2 one-site/multisite system + AI-AO vs continuous"
  },
  {
    "id": 92033,
    "subject": "swine-herd",
    "topic": "inbreeding-depression",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86 อ.อจิมา",
    "tags": [
      "inbreeding",
      "inbreeding-depression",
      "genetic-diversity",
      "homozygosity"
    ],
    "type": "mcq",
    "q": "Inbreeding depression ในฟาร์มสุกรพันธุ์จะแสดงผลเสียอย่างไร และวิธีป้องกันที่ obvious ที่สุด",
    "options": [
      "Heterosis สูงขึ้น, ป้องกันโดยผสมพี่น้อง",
      "Litter size ↓, growth rate ↓ ถึง 154 d, libido ↓ ในพ่อพันธุ์, ใบ้, splay leg, ไส้เลื่อน — ป้องกันโดยตรวจ pedigree ก่อนผสม + avoiding mating brothers/sisters/parents-offspring/grandparents",
      "ผลผลิตเพิ่มขึ้น เพราะ homozygosity ของ favorable allele",
      "ไม่มีผล — สุกรเป็น polyestrous polytocous"
    ],
    "answer": 1,
    "explain": "✓ Inbreeding depression effects (จาก Hauser et al. 1952 + Melka & Schenkel 2010):\n  - Litter size ↓, piglet weight ↓, growth ลดลงถึง 154 d\n  - Boars: lack of libido + delayed puberty\n  - Increased recessive defects: splay leg, ไส้เลื่อนสะดือ/อัณฑะ, ทองแดง (red), ใบ้\n  - Canadian Hampshire สูญเสีย genetic diversity 22%\n✓ Prevention:\n  - Examine pedigrees ก่อนผสม\n  - Avoid mating: brothers × sisters, parents × offspring, grandparents-in-common\n💡 Inbreeding depression = opposite ของ heterosis (hybrid vigor)",
    "verified": "swine herd mid p.13-14 inbreeding & herd health slides 54-61"
  },
  {
    "id": 92034,
    "subject": "swine-herd",
    "topic": "feeding-pregnancy-stage",
    "year": 4,
    "source": "Swine Hlth final TJ.pdf",
    "examOrigin": "Swine Health Final TJ86 อ.พรชลิต",
    "tags": [
      "sow-feeding",
      "pregnancy",
      "bcs",
      "fetal-growth"
    ],
    "type": "mcq",
    "q": "การให้อาหารแม่สุกร pregnancy 12-16 wk (ระยะ fetal growth สำคัญ) ตามคำแนะนำ อ.พรชลิต",
    "options": [
      "Restriction 2 kg/วัน ตลอด pregnancy เพื่อ BCS = 3",
      "Pregnancy 5-11 wk ปรับลดอาหารให้ BCS = 3, แต่ 12-16 wk feed ad libitum เพิ่มให้ลูกโต (birth weight target 1.5 kg) แม่ไม่ซูบ",
      "Feed ad libitum ทั้ง pregnancy — ตามต้องการ",
      "Fasting 24 hr ก่อนคลอด เพื่อให้คลอดง่าย"
    ],
    "answer": 1,
    "explain": "✓ Pregnancy feeding plan ของอ.พรชลิต:\n  - 1-4 wk หลังผสม: restriction 2 มื้อ/วัน → 2 kg/วัน (BCS = 3 target)\n  - 5-11 wk: ปรับลดอาหารให้ BCS = 3 (avoid over-condition)\n  - 12-16 wk: feed ad libitum → เพิ่มให้ลูกโต birth weight target 1.5 kg, แม่ไม่ซูบ (ไม่สนใจ BCS)\n  - Pre-farrow 2-3 d: 1.8-2.3 kg/d\n✗ Restriction ตลอด pregnancy → fetal growth restriction\n✗ Ad lib ทั้ง pregnancy → over-condition → dystocia + เคี้ยวลูกหลังคลอด\n💡 BCS target = 3 ตลอดยกเว้น last trimester ที่ปล่อย ad libitum",
    "verified": "Swine Hlth final TJ.pdf อ.พรชลิต sow feeding by pregnancy stage"
  },
  {
    "id": 92035,
    "subject": "swine-herd",
    "topic": "vitamin-e-selenium-deficiency",
    "year": 4,
    "source": "-swine herd mid ดาวสรุปบายน้อนพิน.pdf",
    "examOrigin": "Swine Herd Mid TJ86 อ.อนุศกุล",
    "tags": [
      "vitamin-e",
      "selenium",
      "mulberry-heart-disease",
      "muscle-change"
    ],
    "type": "mcq",
    "q": "หมูขุนตายเฉียบพลัน autopsy พบ pericardial effusion + epicardial hemorrhage (mulberry-like) + skeletal muscle pallor สาเหตุที่น่าจะใช่ที่สุด",
    "options": [
      "Aflatoxin poisoning",
      "Vitamin E + Selenium deficiency → Mulberry Heart Disease (MHD) + nutritional myopathy",
      "Salt poisoning — sodium ion CNS toxicity",
      "Hypocalcemia — agalactia"
    ],
    "answer": 1,
    "explain": "✓ Vitamin E + Selenium deficiency → Mulberry Heart Disease (MHD):\n  - Pathology: pericardial effusion + epicardial petechial hemorrhage (สีคล้าย mulberry)\n  - Muscle: white striations (nutritional myopathy), pallor\n  - Sudden death ในหมูที่โตเร็ว (พันธุ์ Duroc esp.)\n  - Excess vitamin A → ↑vit E requirement → จะเป็น MHD ง่ายขึ้น\n✗ Aflatoxin → ตับเสีย + immunosuppression\n✗ Salt poisoning → CNS convulsion + polioencephalomalacia\n💡 Treatment/prevention: Vit E + Se supplement in feed, esp. ในพันธุ์ Duroc ที่ ADG สูง",
    "verified": "swine herd mid p.16 อ.อนุศกุล vitamin/mineral deficiency table"
  }
];
