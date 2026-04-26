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
  // Bacterial Skin Diseases (Aj. Chaiyot Tanrattana)
  // ═══════════════════════════════════════════════════════════
  { id: 915, subject: 'com4', topic: 'derm-bacterial', year: 4, source: 'Derm__4_Bacterial_skin_diseases.pdf',
    tags: ['pyoderma', 'pathogen'], type: 'mcq',
    q: 'เชื้อก่อโรค pyoderma ที่พบบ่อยที่สุดในสุนัขคือ',
    options: ['Staphylococcus aureus', 'Staphylococcus pseudintermedius', 'Streptococcus canis', 'Pseudomonas aeruginosa'],
    answer: 1, explain: 'S. pseudintermedius = most common cause of canine pyoderma · เป็น commensal บนผิวหนัง · เมื่อ skin barrier เสีย หรือ underlying disease (allergy, endocrine) → overgrowth → pyoderma · MRSP (methicillin-resistant) เป็นปัญหาเพิ่มขึ้นเรื่อยๆ\n\n❌ ทำไมข้ออื่นผิด\n— S. aureus = หลักในคน, น้อยในสุนัข\n— Streptococcus canis = พบได้ในบาง deep pyoderma แต่ไม่ใช่หลัก\n— Pseudomonas = บ่อยใน otitis externa, ไม่ใช่ pyoderma',
    verified: 'Derm__4_Bacterial_skin_diseases.pdf p.3' },

  { id: 916, subject: 'com4', topic: 'derm-bacterial', year: 4, source: 'Derm__4_Bacterial_skin_diseases.pdf',
    tags: ['pyoderma', 'classification'], type: 'mcq',
    q: 'การจำแนก pyoderma ตามความลึกของรอยโรค (depth) แบ่งเป็นกี่ประเภท',
    options: ['2 ประเภท: superficial vs deep', '3 ประเภท: surface, superficial, deep', '4 ประเภท: surface, superficial, deep, systemic', 'ไม่จำเป็นต้องแบ่ง'],
    answer: 1, explain: 'Pyoderma 3 levels: Surface (ไม่ผ่าน epidermis เช่น intertrigo, pyotraumatic) · Superficial (involve epidermis ± hair follicle, ไม่ข้าม basement membrane เช่น impetigo, folliculitis) · Deep (ลงลึกถึง dermis/SC เช่น furunculosis, cellulitis) · การจำแนกสำคัญมากเพราะระยะเวลา + วิธี treatment ต่างกัน\n\n❌ ทำไมข้ออื่นผิด\n— "2 ประเภท" = ขาด surface\n— "4 ประเภท + systemic" = systemic ไม่ใช่ depth classification\n— "ไม่จำเป็น" = ผิด, classification key for management',
    verified: 'Derm__4_Bacterial_skin_diseases.pdf p.3' },

  { id: 917, subject: 'com4', topic: 'derm-bacterial', year: 4, source: 'Derm__4_Bacterial_skin_diseases.pdf',
    tags: ['intertrigo', 'breed'], type: 'mcq',
    q: 'Skin fold pyoderma (Intertrigo) มัก predispose ในสายพันธุ์ใดมากที่สุด',
    options: ['Greyhound, Whippet (lean breed)', 'Shar pei, Bulldog, Cocker spaniel, Pekinese (sky fold + obese)', 'Border Collie, Australian Shepherd', 'Chihuahua, Pomeranian'],
    answer: 1, explain: 'Intertrigo predisposing: Shar pei, Bulldog, Pekinese (รอยพับเยอะ) + obese animals (รอยพับน้ำหนักทับ) · location: lip folds, facial folds, vulvar folds, tail folds (cork-screw tail breeds) · Tx: antibacterial shampoo + ลดน้ำหนัก ± surgical excision\n\n❌ ทำไมข้ออื่นผิด\n— Greyhound/Whippet = lean = ไม่ใช่ predisposed\n— Border Collie/Australian Shep = active breeds, no skin folds\n— Chihuahua/Pomeranian = small breed, ไม่มี skin folds มาก',
    verified: 'Derm__4_Bacterial_skin_diseases.pdf p.4' },

  { id: 918, subject: 'com4', topic: 'derm-bacterial', year: 4, source: 'Derm__4_Bacterial_skin_diseases.pdf',
    tags: ['impetigo', 'distribution'], type: 'mcq',
    q: 'Juvenile impetigo มีรอยโรคที่ distribution ใด',
    options: ['ใบหน้าและใบหู', 'Ventral abdomen, inguinal, axillae', 'หลังและสะโพก', 'อุ้งเท้าทั้ง 4'],
    answer: 1, explain: 'Juvenile impetigo: lesions ที่ ventral abdomen + inguinal + axillae · เป็น non-follicular pustules + erythematous skin + epidermal collarettes + crusts · Predisposing: poor hygiene, parasites, virus, poor diet · มักพบใน puppies < 1 yr\n\n❌ ทำไมข้ออื่นผิด\n— "ใบหน้า/ใบหู" = chin acne / atopic\n— "หลัง/สะโพก" = FAD\n— "อุ้งเท้า" = atopic dermatitis',
    verified: 'Derm__4_Bacterial_skin_diseases.pdf p.5' },

  { id: 919, subject: 'com4', topic: 'derm-bacterial', year: 4, source: 'Derm__4_Bacterial_skin_diseases.pdf',
    tags: ['antibiotic', 'pyoderma'], type: 'mcq',
    q: 'Antibiotics ตัวใด **ไม่เหมาะ** สำหรับรักษา pyoderma เพราะ achieve therapeutic conc. ในผิวหนังไม่ดี',
    options: ['Cephalexin', 'Amoxicillin (เดี่ยว) / Penicillin / Ampicillin / Streptomycin', 'Doxycycline', 'Clindamycin'],
    answer: 1, explain: 'ATB ที่ไม่เข้าผิวหนังพอ: Amoxicillin (ใช้ amoxi-clav แทน), Penicillin, Ampicillin, Streptomycin · ATB ที่เข้าผิวหนังดี: Cephalexin (1st choice), Amoxi-clav, Cefadroxil, Cefovecin, Doxycycline, Clindamycin, FQ (enrofloxacin/marbofloxacin) · ต้องเลือกตาม C&S เพราะ MRSP บ่อย\n\n❌ ทำไมข้ออื่นผิด\n— Cephalexin = first-line (เข้าผิวดี)\n— Doxycycline = เข้าผิวดี (ใช้ใน MRSP บางครั้ง)\n— Clindamycin = เข้าผิวดี (alternate cephalexin)',
    verified: 'Derm__4_Bacterial_skin_diseases.pdf p.11' },

  { id: 920, subject: 'com4', topic: 'derm-bacterial', year: 4, source: 'Derm__4_Bacterial_skin_diseases.pdf',
    tags: ['antibiotic', 'dose'], type: 'mcq',
    q: 'Cephalexin dose สำหรับ canine pyoderma คือ',
    options: ['5 mg/kg SID', '30 mg/kg BID หรือ 22 mg/kg TID', '50 mg/kg SID', '100 mg/kg BID'],
    answer: 1, explain: 'Cephalexin (canine pyoderma): 30 mg/kg BID (หรือ 22 mg/kg TID) · 1st-gen cephalosporin · เข้าผิวดี · cover S. pseudintermedius · ต่อ 4-6 wk superficial / 6-12 wk deep · continue > 2 wk หลัง clinical cure\n\n❌ ทำไมข้ออื่นผิด\n— 5 mg/kg SID = ต่ำเกิน\n— 50 mg/kg SID / 100 mg/kg BID = สูงเกิน',
    verified: 'Derm__4_Bacterial_skin_diseases.pdf p.12' },

  { id: 921, subject: 'com4', topic: 'derm-bacterial', year: 4, source: 'Derm__4_Bacterial_skin_diseases.pdf',
    tags: ['treatment', 'duration'], type: 'mcq',
    q: 'Duration ในการรักษา **superficial** pyoderma',
    options: ['3-5 วัน', '1-2 สัปดาห์', 'Minimum 4-6 wk + ต่อ ≥ 2 wk หลัง clinical cure', 'ตลอดชีวิต'],
    answer: 2, explain: 'Superficial pyoderma: minimum 4-6 wk · ให้ต่อ ≥ 2 wk หลัง lesions หาย · prevent recurrence · check at 2-3 weekly intervals\n\n❌ ทำไมข้ออื่นผิด\n— "3-5 วัน" = สั้นเกิน, recurrence แน่\n— "1-2 wk" = สั้นเกิน\n— "ตลอดชีวิต" = ผิด (ต้องหาและแก้ underlying cause)',
    verified: 'Derm__4_Bacterial_skin_diseases.pdf p.12' },

  { id: 922, subject: 'com4', topic: 'derm-bacterial', year: 4, source: 'Derm__4_Bacterial_skin_diseases.pdf',
    tags: ['treatment', 'deep-pyoderma'], type: 'mcq',
    q: 'Duration สำหรับรักษา **deep** pyoderma',
    options: ['1-2 สัปดาห์', '4-6 สัปดาห์', '6-12 สัปดาห์ + ต่อ ≥ 3-4 wk หลัง clinical cure', 'แค่ topical พอ ไม่ต้อง systemic'],
    answer: 2, explain: 'Deep pyoderma: average 6-12 wk + ต่อ ≥ 3-4 wk หลัง clinical cure · ต้อง C&S ทุกครั้ง · clipping + antiseptic shampoo (chlorhexidine, ethyl lactate) · 3 weekly check-ups · มักมี underlying cause (Demodicosis, Cushing\'s, hypothyroid)\n\n❌ ทำไมข้ออื่นผิด\n— "1-2 wk" = สั้นเกินมาก\n— "4-6 wk" = สำหรับ superficial\n— "แค่ topical" = ผิด, deep ต้อง systemic ATB ตาม C&S',
    verified: 'Derm__4_Bacterial_skin_diseases.pdf p.12' },

  { id: 923, subject: 'com4', topic: 'derm-bacterial', year: 4, source: 'Derm__4_Bacterial_skin_diseases.pdf',
    tags: ['cytology'], type: 'mcq',
    q: 'ใน skin cytology ของ pyoderma — การพบ "degenerate neutrophils + intracellular cocci bacteria" หมายถึง',
    options: ['Contamination, ไม่ต้องกังวล', 'Active bacterial infection (septic suppurative inflammation)', 'Eosinophilic dermatitis', 'Sterile pustular dermatosis'],
    answer: 1, explain: 'Degenerate neutrophil (toxic change, vacuolation) + intracellular bacteria = active bacterial infection (septic process) · ถ้า extracellular เท่านั้น = อาจ colonization · cocci consistent กับ Staphylococcus, rod = G-neg (Pseudomonas, E. coli) → ส่งผลต่อการเลือก ATB\n\n❌ ทำไมข้ออื่นผิด\n— Contamination = ไม่ใช่, มี degenerate neutrophil\n— Eosinophilic = พบ eosinophils ไม่ใช่ neutrophils\n— Sterile pustular = ไม่มี bacteria',
    verified: 'Derm__4_Bacterial_skin_diseases.pdf p.7' },

  { id: 924, subject: 'com4', topic: 'derm-bacterial', year: 4, source: 'Derm__4_Bacterial_skin_diseases.pdf',
    tags: ['topical-therapy'], type: 'mcq',
    q: 'Topical antibacterial shampoo สำหรับ pyoderma มักประกอบด้วย active ingredient ใด',
    options: ['Antifungal เท่านั้น (ketoconazole)', 'Chlorhexidine, Benzoyl peroxide, Ethyl lactate, Povidone-iodine, Triclosan', 'NSAIDs topical', 'Steroid topical'],
    answer: 1, explain: 'Antibacterial shampoo: Chlorhexidine 2-4% (most common), Benzoyl peroxide (also follicular flushing), Ethyl lactate, Povidone-iodine, Triclosan · ใช้ 2-3 ครั้ง/wk · leave 5-15 min ก่อนล้างออก · indication: surface/superficial pyoderma + adjunct ใน deep + recurrence prevention\n\n❌ ทำไมข้ออื่นผิด\n— Ketoconazole alone = antifungal สำหรับ Malassezia\n— NSAIDs topical = ไม่ใช่ antibacterial\n— Steroid topical = anti-inflammatory แต่ไม่ kill bacteria',
    verified: 'Derm__4_Bacterial_skin_diseases.pdf p.11' },

  // ═══════════════════════════════════════════════════════════
  // Fungal Skin Diseases (Aj. Chaiyot Tanrattana)
  // ═══════════════════════════════════════════════════════════
  { id: 925, subject: 'com4', topic: 'derm-fungal', year: 4, source: 'Derm__5_Fungal_skin_diseases.pdf',
    tags: ['dermatophyte', 'epidemiology'], type: 'mcq',
    q: 'Dermatophytosis ในแมว ส่วนใหญ่เกิดจากเชื้อชนิดใด',
    options: ['Microsporum gypseum', 'Microsporum canis (90-98% ในแมว)', 'Trichophyton mentagrophytes', 'Aspergillus'],
    answer: 1, explain: 'M. canis = 90-98% ของ feline dermatophytosis · 50-70% ของ canine · ติดผ่าน direct contact + fomites + environment · zoonotic · highly contagious\n\n❌ ทำไมข้ออื่นผิด\n— M. gypseum = soil-borne, ไม่ใช่ most common\n— T. mentagrophytes = rodent-borne, rare\n— Aspergillus = ไม่ใช่ dermatophyte (systemic mycosis)',
    verified: 'Derm__5_Fungal_skin_diseases.pdf p.2' },

  { id: 926, subject: 'com4', topic: 'derm-fungal', year: 4, source: 'Derm__5_Fungal_skin_diseases.pdf',
    tags: ['dermatophyte', 'diagnosis'], type: 'mcq',
    q: 'Wood\'s lamp examination ใช้ตรวจ dermatophytosis — fluoresce ได้ในเชื้อชนิดใด',
    options: ['M. canis (apple-green fluorescence)', 'M. gypseum', 'T. mentagrophytes', 'Malassezia'],
    answer: 0, explain: 'Wood\'s lamp UV (cobalt/nickel filter) → apple-green fluorescence ใน M. canis (ประมาณ 50% ของ strains) · false-positive: bacteria (Pseudomonas, Corynebacterium), crust, soap, cream · M. gypseum + T. mentagrophytes = NEGATIVE · ใช้เป็น screening test ไม่ใช่ definitive\n\n❌ ทำไมข้ออื่นผิด\n— M. gypseum / T. mentagrophytes = no fluorescence\n— Malassezia = yeast (ไม่ใช่ dermatophyte)',
    verified: 'Derm__5_Fungal_skin_diseases.pdf p.3' },

  { id: 927, subject: 'com4', topic: 'derm-fungal', year: 4, source: 'Derm__5_Fungal_skin_diseases.pdf',
    tags: ['dermatophyte', 'dtm'], type: 'mcq',
    q: 'Dermatophyte Test Medium (DTM) มี indicator อะไร และเปลี่ยนสีอย่างไรเมื่อเชื้อขึ้น',
    options: ['Bromothymol blue, น้ำเงิน → เขียว', 'Phenol red, เหลือง → แดง (ภายใน 7-14 วัน)', 'Methylene blue, ใสขึ้น', 'ไม่มี indicator, อ่านจาก colony เท่านั้น'],
    answer: 1, explain: 'DTM มี phenol red indicator (acid-base) · dermatophyte ใช้ protein → produce alkaline metabolites → pH ขึ้น → red color change · 7-14 วัน · concept "3 Cs": Color change + Colony appearance (white-greyish fluffy) + Confirmation by macroconidia (microscopic) · = definitive Dx\n\n❌ ทำไมข้ออื่นผิด\n— Bromothymol blue = pH indicator อื่น\n— Methylene blue = staining dye\n— "ไม่มี indicator" = ผิด',
    verified: 'Derm__5_Fungal_skin_diseases.pdf p.3' },

  { id: 928, subject: 'com4', topic: 'derm-fungal', year: 4, source: 'Derm__5_Fungal_skin_diseases.pdf',
    tags: ['dermatophyte', 'microscopy'], type: 'mcq',
    q: 'Microscopic feature ที่ classic ของ Trichophyton mentagrophytes คือ',
    options: ['Fusoid macroconidia + thick wall + 6+ microconidia', 'Spiral hyphae + grape-like cluster ของ microconidia (round/pyriform)', 'Single large macroconidia เท่านั้น', 'No conidia, only hyphae'],
    answer: 1, explain: 'T. mentagrophytes: spiral hyphae + numerous round/pyriform microconidia ใน grape-like clusters · macroconidia = multi-septate, club-shaped, มักไม่พบ\n\n❌ ทำไมข้ออื่นผิด\n— "Fusoid + thick wall + 6+ micro" = M. canis\n— "Single macro" = ไม่ใช่ pattern of any dermatophyte\n— "No conidia" = saprophyte / non-pathogenic',
    verified: 'Derm__5_Fungal_skin_diseases.pdf p.4' },

  { id: 929, subject: 'com4', topic: 'derm-fungal', year: 4, source: 'Derm__5_Fungal_skin_diseases.pdf',
    tags: ['treatment', 'systemic'], type: 'mcq',
    q: 'Systemic antifungal ที่ first-line สำหรับ dermatophytosis ในแมว',
    options: ['Itraconazole 5-10 mg/kg SID with meal', 'Penicillin G IM', 'Metronidazole PO', 'Doxycycline'],
    answer: 0, explain: 'Itraconazole 5-10 mg/kg SID with meal = first-line · alternatives: Ketoconazole 10 mg/kg/d BID, Terbinafine 30-40 mg/kg SID, Griseofulvin 50 mg/kg microsized · ต่อจนกว่า culture negative 2 ครั้ง (ห่าง 2-4 wk)\n\n❌ ทำไมข้ออื่นผิด\n— Penicillin G = bacterial\n— Metronidazole = anaerobe + protozoa\n— Doxycycline = bacterial / ricketsia',
    verified: 'Derm__5_Fungal_skin_diseases.pdf p.5' },

  { id: 930, subject: 'com4', topic: 'derm-fungal', year: 4, source: 'Derm__5_Fungal_skin_diseases.pdf',
    tags: ['pseudomycetoma'], type: 'mcq',
    q: 'Pseudomycetoma คือรูปแบบของ dermatophytosis ที่',
    options: ['Form hyphae ใน dermal/subcutaneous tissue เป็น nodules/draining tract', 'แบบ surface เท่านั้น', 'เกิดบน nail bed เท่านั้น', 'ไม่ใช่ dermatophyte จริง'],
    answer: 0, explain: 'Pseudomycetoma = unusual deep form of dermatophytosis (มัก M. canis) → hyphae ลงไปถึง dermal + subcutaneous tissue → firm intradermal/SC nodules ± ulcerated + draining tract · พบบ่อย: tail, trunk, flanks · non-pruritic, non-painful · ต้อง histopath / culture ยืนยัน\n\n❌ ทำไมข้ออื่นผิด\n— "surface only" = classic dermatophytosis\n— "nail bed only" = onychomycosis\n— "ไม่ใช่ dermatophyte จริง" = ผิด, เป็นรูปแบบ deep ของ dermatophyte',
    verified: 'Derm__5_Fungal_skin_diseases.pdf p.4' },

  { id: 931, subject: 'com4', topic: 'derm-fungal', year: 4, source: 'Derm__5_Fungal_skin_diseases.pdf',
    tags: ['dermatophyte', 'transmission'], type: 'mcq',
    q: 'Dermatophytosis transmission หลักคือ',
    options: ['Bite ของแมลง', 'Direct contact + fomites + contaminated environment', 'หายใจเข้าทางอากาศ', 'อาหาร'],
    answer: 1, explain: 'Direct contact (cat-cat, dog-cat, cat-human) + fomites (combs, brushes, bedding) + environment (spores ทนนานหลายเดือน) · zoonotic (โดยเฉพาะ M. canis ที่ติดง่ายในเด็ก/ภูมิต่ำ)\n\n❌ ทำไมข้ออื่นผิด\n— Bite แมลง = vector-borne diseases (Babesia, Lyme)\n— หายใจ = systemic mycoses (Histoplasma, Cryptococcus)\n— อาหาร = enteric pathogens',
    verified: 'Derm__5_Fungal_skin_diseases.pdf p.2' },

  { id: 932, subject: 'com4', topic: 'derm-fungal', year: 4, source: 'Derm__5_Fungal_skin_diseases.pdf',
    tags: ['topical', 'lime-sulfur'], type: 'mcq',
    q: 'Lime sulfur dip สำหรับ dermatophytosis ใช้ความเข้มข้นเท่าใด',
    options: ['0.5%', '2-4%', '20-40%', '100% (full strength)'],
    answer: 1, explain: 'Lime sulfur 2-4% (calcium polysulfide) · effective + cheap + safe · ทาทั่วตัวทุก 5-7 วัน × 4-6 ครั้ง · เหม็นกำมะถัน + อาจทำให้ขนเหลือง · alternative: 0.2% enilconazole · 2% miconazole-chlorhexidine shampoo\n\n❌ ทำไมข้ออื่นผิด\n— 0.5% = ต่ำเกิน\n— 20-40% = สูงเกินอันตราย\n— 100% = ห้าม',
    verified: 'Derm__5_Fungal_skin_diseases.pdf p.5' },

  { id: 933, subject: 'com4', topic: 'derm-fungal', year: 4, source: 'Derm__5_Fungal_skin_diseases.pdf',
    tags: ['environment'], type: 'mcq',
    q: 'Environment disinfectant ที่แนะนำสำหรับ dermatophytosis',
    options: ['Alcohol 70%', '5% sodium hypochlorite (bleach) เจือจาง 1:10', 'Chlorhexidine 2%', 'Quaternary ammonium'],
    answer: 1, explain: 'NaOCl 5% (household bleach) เจือจาง 1:10 = effective disinfectant สำหรับ dermatophyte spores · spores ทนนานหลายเดือนใน environment · aggressive cleaning + disinfectant แล้วล้างออก · throw away/wash bedding, brushes, scratching post\n\n❌ ทำไมข้ออื่นผิด\n— Alcohol 70% = ไม่ kill spores\n— Chlorhexidine = bacterial เป็นหลัก\n— QUAT = ไม่ effective ต่อ spores',
    verified: 'Derm__5_Fungal_skin_diseases.pdf p.5' },

  { id: 934, subject: 'com4', topic: 'derm-fungal', year: 4, source: 'Derm__5_Fungal_skin_diseases.pdf',
    tags: ['malassezia'], type: 'mcq',
    q: 'Malassezia pachydermatis ในสุนัข มัก present เป็นอย่างไร',
    options: ['ไม่มีอาการ, asymptomatic', 'Itchy + greasy seborrhea + unpleasant odor + erythema/lichenification', 'Hair loss without inflammation', 'Bullae'],
    answer: 1, explain: 'Malassezia: pruritic + greasy seborrhea + odor + ear infection (Malassezia otitis) + ventral hyperpigmentation/lichenification · cytology: peanut-shaped yeast · Tx: ketoconazole/miconazole shampoo + systemic itra/keto · มักร่วมกับ allergic dermatitis (atopic, food)\n\n❌ ทำไมข้ออื่นผิด\n— Asymptomatic = ผิด, มีอาการชัด\n— Hair loss without inflam = endocrine alopecia (Cushing\'s)\n— Bullae = pemphigus',
    verified: 'Derm__5_Fungal_skin_diseases.pdf p.6' },

  // ═══════════════════════════════════════════════════════════
  // (More batches: endocrine, nutrition, allergic, autoimmune,
  //  immune-drugs, IMHA, SLE, IBD, peds-geri)
  // ═══════════════════════════════════════════════════════════
];
