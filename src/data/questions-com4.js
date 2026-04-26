// ==========================================================
// COM IV — Companion Animal Clinical Sciences IV
// Topics: Dermatology series (8) + Immune-mediated (drugs/IMHA/SLE)
//         + IBD + Pediatrics & Geriatrics
// IDs: 900-1099 (room for ~200)
//
// Each question has the standard schema:
//   id, subject: 'com4', topic, year, source, tags, type,
//   q, options/answer/blanks/pairs, explain, verified?, flag?
// ==========================================================

export const QB_COM4 = [
  // ═══════════════════════════════════════════════════════════
  // Dermatology Introduction (Aj. Chaiyot Tanrattana)
  // ═══════════════════════════════════════════════════════════
  { id: 900, subject: 'com4', topic: 'derm-intro', year: 4, source: 'Derm_1__2_Dermatology_introduction.pdf',
    tags: ['skin-anatomy', 'basics'], type: 'mcq',
    q: 'ผิวหนังของสุนัขและแมว ประกอบด้วย primary layers กี่ชั้น และข้อใดถูกต้อง',
    options: ['2 ชั้น: Epidermis + Dermis', '3 ชั้น: Epidermis + Dermis + Hypodermis (subcutis)', '4 ชั้น: Epidermis + Dermis + Hypodermis + Muscle', '5 ชั้น: Stratum corneum + lucidum + granulosum + spinosum + basale'],
    answer: 1, explain: 'Skin = 3 primary layers: Epidermis (ชั้นนอก) + Dermis (กลาง) + Hypodermis (subcutis ชั้นใน) + adnexa (hair follicle, glands)\n\n❌ ทำไมข้ออื่นผิด\n— "2 ชั้น" = ขาด hypodermis\n— "4 ชั้น + muscle" = muscle ไม่นับเป็น skin layer\n— 5 ชั้น = Stratum sub-layers ของ epidermis (sub-classification)',
    verified: 'Derm_1__2_Dermatology_introduction.pdf p.1' },

  { id: 901, subject: 'com4', topic: 'derm-intro', year: 4, source: 'Derm_1__2_Dermatology_introduction.pdf',
    tags: ['glands', 'eccrine'], type: 'mcq',
    q: 'Eccrine glands (true sweat glands) ในสุนัขและแมว พบที่ไหน',
    options: ['ทั่วผิวหนัง เหมือนในคน', 'เฉพาะ foot pads (อุ้งเท้า)', 'เฉพาะหู', 'เฉพาะหาง'],
    answer: 1, explain: 'Eccrine glands ในสุนัข/แมว = พบเฉพาะ foot pads · ทำให้สุนัขแมวระบายความร้อนผ่านการหายใจหอบเป็นหลัก ไม่ใช่ผ่านเหงื่อ · มี cholinergic innervation\n\n❌ ทำไมข้ออื่นผิด\n— "ทั่วผิว" = ของคน, ของสุนัขแมวคือ apocrine ทั่วตัว\n— "หู" / "หาง" = sebaceous + apocrine glands ไม่ใช่ eccrine',
    verified: 'Derm_1__2_Dermatology_introduction.pdf p.3' },

  { id: 902, subject: 'com4', topic: 'derm-intro', year: 4, source: 'Derm_1__2_Dermatology_introduction.pdf',
    tags: ['hair-cycle'], type: 'mcq',
    q: 'Hair cycle ระยะ "transitional phase" (ระยะเปลี่ยนผ่าน) คือระยะใด',
    options: ['Anagen — growth phase', 'Catagen — transitional phase', 'Telogen — resting phase', 'Exogen — shedding phase'],
    answer: 1, explain: 'Hair cycle 3 ระยะหลัก: Anagen (growth) → Catagen (transitional, สั้น) → Telogen (resting) · Exogen = sub-phase ของการหลุดร่วง (ไม่นับเป็นระยะหลัก)\n\n❌ ทำไมข้ออื่นผิด\n— Anagen = growth (ไม่ใช่ transitional)\n— Telogen = resting\n— Exogen = sub-phase shedding ไม่ใช่ transitional หลัก',
    verified: 'Derm_1__2_Dermatology_introduction.pdf p.5' },

  { id: 903, subject: 'com4', topic: 'derm-intro', year: 4, source: 'Derm_1__2_Dermatology_introduction.pdf',
    tags: ['hair-cycle', 'hormone'], type: 'mcq',
    q: 'Hormone ใดเป็น stimulator ของ anagen phase (กระตุ้น hair growth)',
    options: ['Glucocorticoid', 'Estrogen', 'Thyroid hormones', 'Cortisol'],
    answer: 2, explain: 'Thyroid hormones = stimulator ของ anagen → hypothyroidism จึงทำให้ขนร่วง\n\n❌ ทำไมข้ออื่นผิด\n— Glucocorticoid + Estrogen + Cortisol = inhibitors ของ anagen → ทำให้ขนร่วง (alopecia ใน Cushing\'s, ในแมวที่ติดยา corticosteroid นาน)',
    verified: 'Derm_1__2_Dermatology_introduction.pdf p.6' },

  { id: 904, subject: 'com4', topic: 'derm-intro', year: 4, source: 'Derm_1__2_Dermatology_introduction.pdf',
    tags: ['hair-follicle', 'cat-vs-dog'], type: 'mcq',
    q: 'Hair follicle ของแมวต่างกับของสุนัขอย่างไร',
    options: ['ไม่ต่าง — เหมือนกันทั้งสอง', 'แมวมี compound follicles ที่ให้ขนหลายเส้นออกจากรูเดียว', 'แมวมีแค่ primary hair ไม่มี secondary', 'แมวไม่มี sebaceous gland'],
    answer: 1, explain: 'แมว = compound follicle (multiple hairs จากรูเดียวกัน) · สุนัข = primary + secondary หลายเส้นในกลุ่ม (up to 20 hairs/group) · 1° hair attached sebaceous + apocrine gland · 2° hair attached sebaceous gland\n\n❌ ทำไมข้ออื่นผิด\n— "ไม่ต่าง" = ผิด · มี architecture ต่างกัน\n— "แค่ primary" = ผิด · มีทั้ง primary + secondary\n— "ไม่มี sebaceous" = ผิด · มีเหมือนสุนัข',
    verified: 'Derm_1__2_Dermatology_introduction.pdf p.4' },

  // ═══════════════════════════════════════════════════════════
  // Parasitic Skin Diseases (Aj. Chaiyot Tanrattana)
  // ═══════════════════════════════════════════════════════════
  { id: 905, subject: 'com4', topic: 'derm-parasitic', year: 4, source: 'Derm_3_Parasitic_skin_diseases.pdf',
    tags: ['flea', 'species'], type: 'mcq',
    q: 'Flea species ที่พบบ่อยที่สุดในสุนัขและแมวในประเทศไทยคือ',
    options: ['Pulex irritans', 'Xenopsylla cheopis', 'Ctenocephalides felis felis', 'Tunga penetrans'],
    answer: 2, explain: 'Ctenocephalides felis felis = หมัดแมวที่พบบ่อยทั้งในสุนัขและแมว · C. canis = หมัดสุนัข แต่พบน้อยกว่า · ทั้งคู่กิน blood meal ของ host\n\n❌ ทำไมข้ออื่นผิด\n— Pulex irritans = หมัดคน (rare ในสัตว์)\n— Xenopsylla cheopis = หมัดหนู (vector ของกาฬโรค)\n— Tunga penetrans = sand flea (tropical แอฟริกา/อเมริกาใต้)',
    verified: 'Derm_3_Parasitic_skin_diseases.pdf p.3' },

  { id: 906, subject: 'com4', topic: 'derm-parasitic', year: 4, source: 'Derm_3_Parasitic_skin_diseases.pdf',
    tags: ['fad', 'distribution'], type: 'mcq',
    q: 'Flea Allergic Dermatitis (FAD) ในสุนัข ตำแหน่งคลาสสิกของ lesion คือ',
    options: ['ใบหน้าเท่านั้น', 'Lumbosacral region, proximal tail, ventral abdomen', 'อุ้งเท้าทั้ง 4 ข้าง', 'หูทั้ง 2 ข้าง'],
    answer: 1, explain: 'FAD ใน dog: Lumbosacral alopecia + dermatitis · proximal tail · ventral abdomen · severe pruritus + papules + crust + lichenification + hyperpigmentation · 2° infection (S. pseudintermedius + Malassezia pachydermatis) บ่อย\n\n❌ ทำไมข้ออื่นผิด\n— "ใบหน้า" = food allergy / atopy classic\n— "อุ้งเท้า" = atopic dermatitis (CAD)\n— "หู" = otitis externa (Malassezia / atopy)',
    verified: 'Derm_3_Parasitic_skin_diseases.pdf p.4' },

  { id: 907, subject: 'com4', topic: 'derm-parasitic', year: 4, source: 'Derm_3_Parasitic_skin_diseases.pdf',
    tags: ['tick', 'epidemiology'], type: 'mcq',
    q: 'Tick infestation ในสุนัข entirely outdoor ในประเทศไทย ประมาณกี่ %',
    options: ['< 10%', '50-80%', '80-100%', 'น้อยกว่า 5%'],
    answer: 2, explain: 'Outdoor dogs in Thailand: 80-100% โดน tick infestation · partially outdoor 50-80% · entirely indoor < 10% (จาก hospital + grooming visits)\n\n❌ ทำไมข้ออื่นผิด\n— "<10%" / "<5%" = entirely indoor\n— "50-80%" = partially outdoor',
    verified: 'Derm_3_Parasitic_skin_diseases.pdf p.2' },

  { id: 908, subject: 'com4', topic: 'derm-parasitic', year: 4, source: 'Derm_3_Parasitic_skin_diseases.pdf',
    tags: ['tick', 'biology'], type: 'mcq',
    q: 'หลังกินเลือด female tick จะ drop off แล้ววางไข่ประมาณกี่ฟอง',
    options: ['100-500 ฟอง', '1,000-2,000 ฟอง', '3,000-6,000 ฟอง', 'มากกว่า 50,000 ฟอง'],
    answer: 2, explain: 'Female tick: drops off host + hides + lays 3,000-6,000 eggs · life cycle 2-6 ปี · ทุก stage ต้องการ blood meal เพื่อ molt\n\n❌ ทำไมข้ออื่นผิด\n— "100-500" / "1000-2000" = น้อยเกินไป\n— "> 50,000" = สูงเกินไป (ไม่ใช่ insect/mosquito)',
    verified: 'Derm_3_Parasitic_skin_diseases.pdf p.2' },

  { id: 909, subject: 'com4', topic: 'derm-parasitic', year: 4, source: 'Derm_3_Parasitic_skin_diseases.pdf',
    tags: ['demodex', 'microbiology'], type: 'mcq',
    q: 'Demodex canis อาศัยอยู่ที่ไหนบนสัตว์',
    options: ['ผิวหนังชั้นนอก (stratum corneum)', 'Hair follicles + sebaceous glands', 'Subcutaneous tissue', 'ภายในเลือด'],
    answer: 1, explain: 'Demodex canis = mite อาศัยใน hair follicle + sebaceous gland (deep) · ปกติเป็น commensal · พบได้บ้างในสุนัขปกติ · เป็นโรคเมื่อ immunocompromised → demodicosis\n\n❌ ทำไมข้ออื่นผิด\n— "ผิวหนังชั้นนอก" = Sarcoptes / Cheyletiella (surface)\n— "Subcutaneous" = filarial worms\n— "ในเลือด" = blood parasites (Babesia, Ehrlichia)',
    verified: 'Derm_3_Parasitic_skin_diseases.pdf p.7' },

  { id: 910, subject: 'com4', topic: 'derm-parasitic', year: 4, source: 'Derm_3_Parasitic_skin_diseases.pdf',
    tags: ['sarcoptes', 'transmission'], type: 'mcq',
    q: 'Sarcoptes scabiei var. canis ติดต่ออย่างไร',
    options: ['ผ่านพาหะแมลง (เห็บกัด)', 'Direct contact (สัมผัสตัวต่อตัว)', 'หายใจเอาเข้าทางอากาศ', 'พันธุกรรม (genetic)'],
    answer: 1, explain: 'Sarcoptes = direct contact transmission · highly contagious · zoonotic (canine scabies → คนคันชั่วคราว) · burrows ใน stratum corneum → severe pruritus\n\n❌ ทำไมข้ออื่นผิด\n— "พาหะแมลง" = vector-borne diseases (Babesia, Ehrlichia, Rickettsia)\n— "หายใจ" = respiratory pathogens\n— "พันธุกรรม" = genetic conditions ไม่ใช่ parasite',
    verified: 'Derm_3_Parasitic_skin_diseases.pdf p.9' },

  { id: 911, subject: 'com4', topic: 'derm-parasitic', year: 4, source: 'Derm_3_Parasitic_skin_diseases.pdf',
    tags: ['demodex', 'diagnosis'], type: 'mcq',
    q: 'การวินิจฉัย Demodex canis วิธีหลักคือ',
    options: ['ELISA blood test', 'Deep skin scraping — เห็น mite + egg ภายใต้กล้อง', 'Fungal culture', 'Histopath เท่านั้น'],
    answer: 1, explain: 'Deep skin scraping (squeeze + scrape จนเห็นเลือดออกเล็กน้อย) → demodex อยู่ลึกใน follicle · เห็น cigar-shaped mite (~250 μm) + ovoid eggs · trichogram + tape ก็ใช้เสริมได้\n\n❌ ทำไมข้ออื่นผิด\n— ELISA blood = ไม่มี commercial สำหรับ Demodex\n— Fungal culture = dermatophyte\n— Histopath = ใช้ในกรณีที่ scraping negative ซ้ำๆ ไม่ใช่ first-line',
    verified: 'Derm_3_Parasitic_skin_diseases.pdf p.7' },

  { id: 912, subject: 'com4', topic: 'derm-parasitic', year: 4, source: 'Derm_3_Parasitic_skin_diseases.pdf',
    tags: ['sarcoptes', 'distribution'], type: 'mcq',
    q: 'Sarcoptes scabiei ใน canine scabies ตำแหน่ง predilection คือ',
    options: ['Pinnal margin (ขอบใบหู), elbow, hock, ventral abdomen', 'อุ้งเท้าเท่านั้น', 'โคนหางเท่านั้น', 'กระจายไม่เป็น pattern'],
    answer: 0, explain: 'Sarcoptes predilection: ear margins (pinnal-pedal reflex test +ve), elbows, hocks, ventral abdomen, ventral chest · severe pruritus · self-trauma\n\n❌ ทำไมข้ออื่นผิด\n— อุ้งเท้า = atopic dermatitis (paw chewing)\n— โคนหาง = FAD\n— "ไม่เป็น pattern" = generic infection',
    verified: 'Derm_3_Parasitic_skin_diseases.pdf p.9' },

  { id: 913, subject: 'com4', topic: 'derm-parasitic', year: 4, source: 'Derm_3_Parasitic_skin_diseases.pdf',
    tags: ['otodectes', 'ear-mite'], type: 'mcq',
    q: 'Otodectes cynotis ทำให้เกิดโรคใด',
    options: ['Demodicosis', 'Sarcoptic mange', 'Otoacariasis (ear mite infestation)', 'Cheyletiellosis'],
    answer: 2, explain: 'Otodectes cynotis = ear mite · พบบ่อยในแมวมากกว่าสุนัข · clinical: dark coffee-ground exudate + pruritus หู · diagnosis: otoscope + ear swab cytology\n\n❌ ทำไมข้ออื่นผิด\n— Demodicosis = Demodex (follicle)\n— Sarcoptic mange = Sarcoptes (skin surface)\n— Cheyletiellosis = Cheyletiella (walking dandruff)',
    verified: 'Derm_3_Parasitic_skin_diseases.pdf p.10' },

  { id: 914, subject: 'com4', topic: 'derm-parasitic', year: 4, source: 'Derm_3_Parasitic_skin_diseases.pdf',
    tags: ['cheyletiella', 'walking-dandruff'], type: 'mcq',
    q: 'Cheyletiella spp. มีลักษณะคลินิกที่เด่นเรียกว่าอะไร',
    options: ['Hair loss only', '"Walking dandruff" — เกล็ดผิวสีขาวเหลืองที่เคลื่อนไหวได้บนผิวหนัง', 'Black crust จาก melanin', 'Bullae ใหญ่'],
    answer: 1, explain: '"Walking dandruff" = Cheyletiella · large mite (~500 μm) เคลื่อนไหวบนผิวพร้อมเกล็ดผิวจน mimic ดูเหมือนรังแคที่เดินได้ · zoonotic (papules ใน owner) · Diagnosis: tape + microscopy\n\n❌ ทำไมข้ออื่นผิด\n— "Hair loss only" = ไม่ specific\n— "Black crust" = พิเศษ Demodicosis บางชนิด\n— "Bullae" = pemphigus (autoimmune)',
    verified: 'Derm_3_Parasitic_skin_diseases.pdf p.10' },

  // ═══════════════════════════════════════════════════════════
  // (More batches to follow: bacterial, fungal, endocrine, nutrition,
  //  allergic, autoimmune, immune-drugs, IMHA, SLE, IBD, peds-geri)
  // ═══════════════════════════════════════════════════════════
];
