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
  // Endocrine Skin Diseases (Aj. Chaiyot Tanrattana)
  // ═══════════════════════════════════════════════════════════
  { id: 935, subject: 'com4', topic: 'derm-endocrine', year: 4, source: 'Derm_6_Endocrine_skin_diseases.pdf',
    tags: ['hypothyroid', 'epidemiology'], type: 'mcq',
    q: 'Endocrinopathy ที่พบบ่อยที่สุดในสุนัขคือ',
    options: ['Hyperadrenocorticism (Cushing\'s)', 'Hypothyroidism', 'Diabetes mellitus', 'Hypoadrenocorticism (Addison\'s)'],
    answer: 1, explain: 'Hypothyroidism = most common endocrinopathy ในสุนัข · incidence ~1 in 200 (~0.5%) · middle-aged 3-8 ปี (mean 7) · spay/neutered ↑ risk · "over-diagnosed" บ่อยเพราะ NTI (non-thyroidal illness/euthyroid sick) ทำให้ T4 ต่ำได้\n\n❌ ทำไมข้ออื่นผิด\n— Cushing\'s = พบบ่อยรองลงมา\n— DM = น้อยกว่าใน dog (มากในแมว)\n— Addison\'s = rare',
    verified: 'Derm_6_Endocrine_skin_diseases.pdf p.2' },

  { id: 936, subject: 'com4', topic: 'derm-endocrine', year: 4, source: 'Derm_6_Endocrine_skin_diseases.pdf',
    tags: ['hypothyroid', 'breed'], type: 'mcq',
    q: 'Hypothyroidism มี predisposed breeds สูงสุดในข้อใด',
    options: ['Chihuahua, Pomeranian, Yorkshire', 'Beagle, Boxer, Cocker, Doberman, Lab, Golden, Dachshund', 'Greyhound เท่านั้น', 'ทุกสายพันธุ์เท่ากัน'],
    answer: 1, explain: 'Predisposed: medium-large breeds — Beagle, Boxer, Cocker, Dachshund, Dalmatian, Doberman, Lab, Golden Retriever · age 3-8 ปี (mean 7) · neutered/spayed ↑ risk · ระวัง breed-specific low T4 (Sighthound, Greyhound, Husky, Scottish Deerhound — มี baseline ต่ำตามธรรมชาติ)\n\n❌ ทำไมข้ออื่นผิด\n— Toy breeds (Chihuahua/Pom) = atlantoaxial / hypoglycemia issues, ไม่ใช่ hypothyroid\n— Greyhound = baseline T4 ต่ำตามสายพันธุ์ (ไม่ใช่ disease)\n— "ทุกสายพันธุ์เท่ากัน" = ผิด',
    verified: 'Derm_6_Endocrine_skin_diseases.pdf p.2' },

  { id: 937, subject: 'com4', topic: 'derm-endocrine', year: 4, source: 'Derm_6_Endocrine_skin_diseases.pdf',
    tags: ['hypothyroid', 'pathology'], type: 'mcq',
    q: 'Primary hypothyroidism ในสุนัข (95%) เกิดจากกลไกใดเป็นหลัก',
    options: ['Pituitary tumor → ↓ TSH', 'Immune destruction (lymphocytic thyroiditis) + idiopathic atrophy', 'Iodine excess', 'Side effect ของ phenobarbital'],
    answer: 1, explain: 'Primary hypothyroidism (95% of cases): immune-mediated lymphocytic thyroiditis + idiopathic atrophy of thyroid gland · 5% เป็น secondary (TSH deficiency จาก pituitary disease) · congenital + iodine deficiency = rare in companion animals\n\n❌ ทำไมข้ออื่นผิด\n— Pituitary tumor = secondary 5%\n— Iodine excess = ทำให้ hyper- ไม่ใช่ hypo-\n— Phenobarb = affect test result, ไม่ทำให้ true hypothyroid',
    verified: 'Derm_6_Endocrine_skin_diseases.pdf p.2' },

  { id: 938, subject: 'com4', topic: 'derm-endocrine', year: 4, source: 'Derm_6_Endocrine_skin_diseases.pdf',
    tags: ['hypothyroid', 'lab'], type: 'mcq',
    q: 'Total T4 (TT4) reference range ในสุนัขปกติ',
    options: ['0.1-0.5 μg/dL', '1.5-3 μg/dL (บางห้องแลบ 2-4)', '5-10 μg/dL', '10-50 μg/dL'],
    answer: 1, explain: 'TT4 normal: 1.5-3 μg/dL (บางที่ 2-4) · TT4 < 0.5 = very likely hypothyroid · 0.5-1 = possible · > 2 = unlikely · TT4 sensitive ไม่ specific (NTI ทำให้ต่ำได้) · ใช้ร่วม cTSH (normal < 0.6 ng/mL) + Free T4\n\n❌ ทำไมข้ออื่นผิด\n— 0.1-0.5 = severely low (advanced disease)\n— 5-10 / 10-50 = สูงเกินจริง',
    verified: 'Derm_6_Endocrine_skin_diseases.pdf p.6' },

  { id: 939, subject: 'com4', topic: 'derm-endocrine', year: 4, source: 'Derm_6_Endocrine_skin_diseases.pdf',
    tags: ['hypothyroid', 'drug-interference'], type: 'mcq',
    q: 'ยาตัวใดที่ลด TT4 + fT4 ในสุนัข แต่ไม่ทำให้เป็น clinical hypothyroidism',
    options: ['Glucocorticoid + Phenobarbital + Sulfonamides + Aspirin', 'Vitamin D', 'Insulin', 'Carprofen, Meloxicam, Deracoxib'],
    answer: 0, explain: 'Glucocorticoid (dose-dependent), Phenobarbital, Sulfonamides (long-term อาจทำ true hypothyroid), Aspirin = ลด T4 levels · KBr ไม่กระทบ · NSAIDs ใหม่ (Carprofen, Meloxicam, Deracoxib) ไม่กระทบมีนัยสำคัญ · ตีความ T4 ต้องระวัง drug history\n\n❌ ทำไมข้ออื่นผิด\n— Vit D = ไม่กระทบ thyroid testing\n— Insulin = ใช้ใน DM, ไม่กระทบ T4\n— Carpro/Meloxi/Deracoxib = ไม่กระทบ ตามผลวิจัย',
    verified: 'Derm_6_Endocrine_skin_diseases.pdf p.8' },

  { id: 940, subject: 'com4', topic: 'derm-endocrine', year: 4, source: 'Derm_6_Endocrine_skin_diseases.pdf',
    tags: ['hypothyroid', 'treatment'], type: 'mcq',
    q: 'Levothyroxine (L-T4) initial dose สำหรับ canine hypothyroidism',
    options: ['1 mcg/kg q24h', '20 mcg/kg q12h initial → 20 mcg/kg q24h maintenance', '500 mcg/kg q12h', 'Inject IV daily'],
    answer: 1, explain: 'Levothyroxine 20 mcg/kg PO q12h initial (หรือ 0.5 mg/m² ใน large breed) · maintenance 20 mcg/kg q24h ถ้าตอบสนองดี · ไม่ให้กับอาหาร (ลด bioavailability) · ลด dose 25-50% ใน cardiac disease · monitor TT4 ที่ 4 wk หลังเริ่มยา (peak 4-6 hr post-pill) · clinical signs improve: energy 1-2 wk, weight/skin 1-2 mo, hair regrow several months\n\n❌ ทำไมข้ออื่นผิด\n— 1 mcg/kg = ต่ำเกิน\n— 500 mcg/kg = สูงเกินอันตราย\n— IV daily = oral มาตรฐาน',
    verified: 'Derm_6_Endocrine_skin_diseases.pdf p.9' },

  { id: 941, subject: 'com4', topic: 'derm-endocrine', year: 4, source: 'Derm_6_Endocrine_skin_diseases.pdf',
    tags: ['cushing', 'screening'], type: 'mcq',
    q: 'Hyperadrenocorticism (Cushing\'s) screening test ที่ใช้บ่อยที่สุดคือ',
    options: ['Resting cortisol เดี่ยว', 'ACTH stimulation test, LDDS (low-dose dex suppression), UCCR', 'Total T4', 'CBC + chemistry เท่านั้น'],
    answer: 1, explain: 'Cushing\'s screening: ACTH stim (sensitive but expensive — ตรวจไม่ค่อยมีในไทย) + LDDS test (0.01 mg/kg dex IV, sample 0/4/8h — sensitive แต่ false-positive จาก stress/NTI) + UCCR (negative predictive value, screening, 3 consecutive AM samples) · resting cortisol เดี่ยวไม่พอ · differentiation PDH vs ADH ใช้ HDDS / endogenous ACTH / imaging\n\n❌ ทำไมข้ออื่นผิด\n— Resting cortisol = ผันผวนมาก, ไม่ใช่ screening\n— TT4 = thyroid test, ไม่ใช่ adrenal\n— CBC alone = supportive (stress leukogram) ไม่ definitive',
    verified: 'Derm_6_Endocrine_skin_diseases.pdf p.16' },

  { id: 942, subject: 'com4', topic: 'derm-endocrine', year: 4, source: 'Derm_6_Endocrine_skin_diseases.pdf',
    tags: ['cushing', 'uccr'], type: 'mcq',
    q: 'Urine Cortisol:Creatinine Ratio (UCCR) มีจุดเด่นในการใช้คืออะไร',
    options: ['ใช้เป็น confirmative test', 'ใช้เป็น screening (high negative predictive value) — ถ้า UCCR ปกติ มักไม่ใช่ Cushing\'s', 'ใช้แยก PDH vs ADH', 'ใช้ติดตามผลการรักษา'],
    answer: 1, explain: 'UCCR = sensitive แต่ non-specific · เก็บปัสสาวะ AM 3 วัน consecutive · normal = unlikely Cushing\'s (high NPV) · elevated = ต้องยืนยันด้วย ACTH stim หรือ LDDS เพราะ stress, illness ก็ทำให้สูงได้ · เก็บที่บ้านลด stress hospital\n\n❌ ทำไมข้ออื่นผิด\n— Confirmative = ผิด (ต้อง follow-up test)\n— PDH vs ADH = ใช้ HDDS / endogenous ACTH / imaging\n— Monitor treatment = ใช้ ACTH stim หรือ pre-trilostane cortisol',
    verified: 'Derm_6_Endocrine_skin_diseases.pdf p.15' },

  { id: 943, subject: 'com4', topic: 'derm-endocrine', year: 4, source: 'Derm_6_Endocrine_skin_diseases.pdf',
    tags: ['cushing', 'lddst'], type: 'mcq',
    q: 'Low-Dose Dexamethasone Suppression Test (LDDS) ใช้ dose เท่าใด และเก็บตอนไหน',
    options: ['0.01 mg/kg IV → sample 0, 4, 8 ชม.', '0.1 mg/kg PO → sample 24 ชม.', '1 mg/kg IM → sample 30 นาที', 'ไม่ต้องวัดเวลา'],
    answer: 0, explain: 'LDDS: dexamethasone 0.01 mg/kg IV → cortisol 0h (baseline), 4h, 8h · normal dog = suppress ทั้ง 4h + 8h (< 1.4 μg/dL) · Cushing\'s = no/partial suppression · 4h suppress + 8h not = PDH pattern · ทั้ง 4h+8h not suppress = PDH/ADH · ทดสอบ definitive · ต้อง quiet environment\n\n❌ ทำไมข้ออื่นผิด\n— 0.1 mg/kg = HDDS (high-dose) — ใช้ differentiate PDH vs ADH\n— 1 mg/kg = สูงเกินไป\n— "ไม่วัดเวลา" = ผิด เวลาสำคัญ',
    verified: 'Derm_6_Endocrine_skin_diseases.pdf p.16' },

  { id: 944, subject: 'com4', topic: 'derm-endocrine', year: 4, source: 'Derm_6_Endocrine_skin_diseases.pdf',
    tags: ['cushing', 'skin-signs'], type: 'mcq',
    q: 'Cushing\'s syndrome ในสุนัข มี skin findings ที่เด่นคือ',
    options: ['Pruritus รุนแรง + papules', 'Bilateral symmetrical alopecia (truncal) + thin skin + comedones + calcinosis cutis + recurrent pyoderma', 'Bullae + crusts ที่ mucocutaneous junction', 'Black hyperpigmentation only'],
    answer: 1, explain: 'Cushing\'s skin: bilateral symmetrical truncal alopecia (sparing head/limbs initially) · thin skin (translucent) · comedones · calcinosis cutis (dystrophic Ca deposit) · recurrent superficial pyoderma + Demodicosis (immunocompromise) · "rat tail" + "pot belly" + PU/PD + polyphagia\n\n❌ ทำไมข้ออื่นผิด\n— Pruritus + papules = atopic / FAD\n— Bullae @ MC junction = pemphigus vulgaris\n— Hyperpigmentation only = post-inflammatory, ไม่ classic Cushing\'s',
    verified: 'Derm_6_Endocrine_skin_diseases.pdf p.13' },

  // ═══════════════════════════════════════════════════════════
  // Nutrition Skin Diseases (Aj. Chaiyot Tanrattana)
  // ═══════════════════════════════════════════════════════════
  { id: 945, subject: 'com4', topic: 'derm-nutrition', year: 4, source: 'Derm_7_Nutrition_skin_disease.pdf',
    tags: ['vitamin-a', 'breed'], type: 'mcq',
    q: 'Vitamin A-responsive dermatosis ("Cocker syndrome") พบบ่อยใน breed ใด',
    options: ['Siberian Husky', 'Cocker Spaniel', 'Bulldog', 'Poodle'],
    answer: 1, explain: 'Vitamin A-responsive dermatosis = "Cocker\'s syndrome" · adult Cocker (2-5 ปี) · ไม่ใช่ true Vit A deficiency แต่ตอบสนองต่อ supraphysiologic dose · clinical: seborrhea + plugging of follicles + hyperkeratotic plaques + crusts/scale/alopecia + ceruminous otitis externa · ระวังต้อง rule out other seborrhea ก่อน supplement\n\n❌ ทำไมข้ออื่นผิด\n— Siberian Husky = Zinc-responsive\n— Bulldog = skin folds / pyoderma\n— Poodle = Sebaceous adenitis (different)',
    verified: 'Derm_7_Nutrition_skin_disease.pdf p.3' },

  { id: 946, subject: 'com4', topic: 'derm-nutrition', year: 4, source: 'Derm_7_Nutrition_skin_disease.pdf',
    tags: ['vitamin-a', 'dose'], type: 'mcq',
    q: 'Treatment dose ของ Vitamin A สำหรับ Cocker\'s syndrome',
    options: ['400 IU/kg/d (true deficiency dose)', '10,000 IU/d oral retinol (supraphysiologic)', '100,000 IU/kg IM ครั้งเดียว', 'ไม่ต้อง supplement'],
    answer: 1, explain: 'Vit A-responsive: oral retinol 10,000 IU/day (supraphysiologic, Cocker spaniel weight ~10-12 kg) · clinical improvement 6-8 wk · lifelong therapy ปกติ · ระวัง toxicity (ถ้าเกิน normal req. ต้อง rule out other seborrhea ก่อน) · ใน true Vit A deficiency = ไม่เกิน 400 IU/kg/d\n\n❌ ทำไมข้ออื่นผิด\n— 400 IU/kg/d = true deficiency, ไม่ supraphysiologic\n— 100,000 IU IM = อันตราย hypervitaminosis A\n— "ไม่ supplement" = ผิด',
    verified: 'Derm_7_Nutrition_skin_disease.pdf p.4' },

  { id: 947, subject: 'com4', topic: 'derm-nutrition', year: 4, source: 'Derm_7_Nutrition_skin_disease.pdf',
    tags: ['zinc', 'breed'], type: 'mcq',
    q: 'Zinc-responsive dermatosis พบบ่อยใน breed ใด',
    options: ['Cocker Spaniel + Poodle', 'Siberian Husky + Alaskan Malamute (Northern breed)', 'Pug + Bulldog', 'Border Collie'],
    answer: 1, explain: 'Zinc-responsive dermatosis: Northern breeds (Siberian Husky, Alaskan Malamute) · 2 syndromes — Type I (genetic Zn malabsorption, Husky/Mal) + Type II (Zn-deficient/high phytate diet, rapidly growing puppy) · Zn เป็น cofactor RNA/DNA polymerase + EFA biosynthesis + immune\n\n❌ ทำไมข้ออื่นผิด\n— Cocker/Poodle = Vit A / sebaceous adenitis\n— Pug/Bulldog = skin fold pyoderma\n— Border Collie = collie nose / DLE',
    verified: 'Derm_7_Nutrition_skin_disease.pdf p.5' },

  { id: 948, subject: 'com4', topic: 'derm-nutrition', year: 4, source: 'Derm_7_Nutrition_skin_disease.pdf',
    tags: ['zinc', 'distribution'], type: 'mcq',
    q: 'Zinc-responsive dermatosis รอยโรคพบบ่อยที่ตำแหน่งใด',
    options: ['ใบหน้า/รอบปาก-รอบตา + nasal planum + foot pads + pressure points', 'อกหน้าและขาหน้าเท่านั้น', 'หูทั้ง 2 ข้างเท่านั้น', 'หางเท่านั้น'],
    answer: 0, explain: 'Zinc dermatosis: erythema + alopecia + crust + scale + parakeratotic hyperkeratosis ที่ — perioral / periocular / mucocutaneous junction · nasal planum (dry adherent hyperkeratosis + fissures) · footpads (thick yellow-grey crusted plaques) · pressure points (elbows, hocks)\n\n❌ ทำไมข้ออื่นผิด\n— อกหน้า/ขาหน้าเท่านั้น = ไม่ใช่ pattern\n— หู / หาง alone = ไม่ใช่ Zn pattern',
    verified: 'Derm_7_Nutrition_skin_disease.pdf p.5' },

  { id: 949, subject: 'com4', topic: 'derm-nutrition', year: 4, source: 'Derm_7_Nutrition_skin_disease.pdf',
    tags: ['zinc', 'histopath'], type: 'mcq',
    q: 'Histopathology ที่ classic ของ Zinc-responsive dermatosis คือ',
    options: ['Eosinophilic infiltrate', 'Parakeratotic hyperkeratosis (retained nuclei in stratum corneum)', 'Subepidermal vesicles', 'Granuloma'],
    answer: 1, explain: 'Parakeratotic hyperkeratosis = nuclei retained in thickened stratum corneum (ปกติ orthokeratotic = no nuclei) · เป็น classic finding ของ Zn deficiency · supportive feature: superficial perivascular dermatitis + follicular keratosis · response to Zn supplement (Zinc methionine, Zinc gluconate, Zinc sulfate)\n\n❌ ทำไมข้ออื่นผิด\n— Eosinophilic = allergic/atopy/parasites\n— Subepidermal vesicles = bullous pemphigoid\n— Granuloma = mycobacterial/fungal infection',
    verified: 'Derm_7_Nutrition_skin_disease.pdf p.5' },

  { id: 950, subject: 'com4', topic: 'derm-nutrition', year: 4, source: 'Derm_7_Nutrition_skin_disease.pdf',
    tags: ['efa'], type: 'mcq',
    q: 'Essential fatty acids (EFA) ที่จำเป็นต่อสุขภาพผิวคือ',
    options: ['Saturated fatty acids only', 'Linoleic acid (ω-6) + α-Linolenic acid (ω-3)', 'Cholesterol', 'Trans fats'],
    answer: 1, explain: 'EFA: Linoleic acid (LA, ω-6) + α-Linolenic acid (ALA, ω-3) ต้องได้จากอาหาร (ร่างกายสร้างไม่ได้) · maintain skin barrier + ลด TEWL (transepidermal water loss) + anti-inflammatory · supplement EPA/DHA (ω-3 จากปลา) ช่วย atopic + IBD\n\n❌ ทำไมข้ออื่นผิด\n— Saturated fatty acids = energy แต่ไม่ essential สำหรับ skin\n— Cholesterol = ไม่ใช่ EFA\n— Trans fats = pro-inflammatory',
    verified: 'Derm_7_Nutrition_skin_disease.pdf p.2' },

  { id: 951, subject: 'com4', topic: 'derm-nutrition', year: 4, source: 'Derm_7_Nutrition_skin_disease.pdf',
    tags: ['generic-diet'], type: 'mcq',
    q: '"Generic dog food disease" หมายถึง',
    options: ['Skin lesions จาก long-term feeding ของ poor-quality cheap diet (ขาด protein/Zn/EFA)', 'Skin reaction ต่อ generic medication', 'Allergy ต่อยี่ห้ออาหารใดยี่ห้อหนึ่ง', 'ไม่มีโรคนี้'],
    answer: 0, explain: 'Generic dog food disease: feeding cheap "generic" pet food long-term → multiple deficiencies (protein, Zn, EFA, Vit A, Vit E) → poor coat, scaling, alopecia, recurrent infection · ตอบสนองต่อ premium balanced diet ภายในหลายเดือน\n\n❌ ทำไมข้ออื่นผิด\n— Reaction ต่อ generic med = drug reaction\n— Allergy ต่อ brand = food allergy (different mechanism)\n— "ไม่มีโรคนี้" = ผิด',
    verified: 'Derm_7_Nutrition_skin_disease.pdf p.6' },

  { id: 952, subject: 'com4', topic: 'derm-nutrition', year: 4, source: 'Derm_7_Nutrition_skin_disease.pdf',
    tags: ['protein', 'deficiency'], type: 'mcq',
    q: 'Protein deficiency ใน skin อาการเด่นคือ',
    options: ['Skin หนาขึ้น + เม็ดสี', 'Poor hair growth + dry/brittle coat + slow wound healing + secondary infection', 'Severe pruritus เท่านั้น', 'No skin changes'],
    answer: 1, explain: 'Protein deficiency: poor hair growth (keratin = protein) + dull/dry/brittle coat + thin skin + delayed wound healing + immune compromise → recurrent infection · supplement high-quality animal protein = ฟื้นใน 4-6 wk\n\n❌ ทำไมข้ออื่นผิด\n— "Skin หนา + เม็ดสี" = endocrine alopecia (Cushing\'s) ตรงข้าม\n— Pruritus only = allergic\n— "No changes" = ผิด',
    verified: 'Derm_7_Nutrition_skin_disease.pdf p.2' },

  { id: 953, subject: 'com4', topic: 'derm-nutrition', year: 4, source: 'Derm_7_Nutrition_skin_disease.pdf',
    tags: ['vitamin-e'], type: 'mcq',
    q: 'Vitamin E ในผิวมีบทบาทอะไร และ deficiency ทำให้เกิดอาการใด',
    options: ['Antioxidant — protect cell membrane → deficiency: dry coat, scaling, ↑ susceptibility', 'Energy production', 'Bone formation', 'Hair pigmentation'],
    answer: 0, explain: 'Vit E (α-tocopherol) = lipid-soluble antioxidant → protect cell membrane lipids · deficiency: dry coat, scaling, panniculitis, ↑ infection · synergistic กับ selenium · supplement ใน inflammatory dermatoses\n\n❌ ทำไมข้ออื่นผิด\n— Energy = carb/fat\n— Bone = Ca, P, Vit D\n— Hair pigment = Cu, Tyrosine',
    verified: 'Derm_7_Nutrition_skin_disease.pdf p.4' },

  { id: 954, subject: 'com4', topic: 'derm-nutrition', year: 4, source: 'Derm_7_Nutrition_skin_disease.pdf',
    tags: ['food-allergy', 'diagnosis'], type: 'mcq',
    q: 'Gold standard ในการวินิจฉัย Food Allergy ในสุนัข/แมวคือ',
    options: ['Serum IgE testing (food panel)', 'Intradermal skin test', 'Strict food elimination diet trial 8 wk → rechallenge', 'Hair analysis'],
    answer: 2, explain: 'Food elimination diet trial = gold standard · novel protein OR hydrolyzed diet × 8 wk strict (ไม่มี treats/chews/flavored med) · ถ้า lesion + pruritus หาย → rechallenge เดิม → recurrence ภายใน 14 วัน = confirm food allergy · serum/skin tests = unreliable for food (good for environmental atopy)\n\n❌ ทำไมข้ออื่นผิด\n— Serum IgE for food = poor sensitivity/specificity\n— Intradermal = ใช้สำหรับ atopy (environmental)\n— Hair analysis = pseudoscience',
    verified: 'Derm_7_Nutrition_skin_disease.pdf p.2' },

  // ═══════════════════════════════════════════════════════════
  // Allergic Dermatitis (Aj. Chaiyot Tanrattana)
  // ═══════════════════════════════════════════════════════════
  { id: 955, subject: 'com4', topic: 'derm-allergic', year: 4, source: 'Derm_8_Allergic_dermatitis.pdf',
    tags: ['allergic', 'classification'], type: 'mcq',
    q: '4 ประเภทหลักของ allergic dermatitis ในสัตว์เลี้ยงคืออะไร',
    options: ['Pemphigus + Lupus + Drug + Bullous', 'Atopic + Food + FAD + Contact', 'Bacterial + Fungal + Parasitic + Viral', 'Type I + II + III + IV hypersensitivity'],
    answer: 1, explain: '4 types ของ allergic dermatitis ใน vet practice: Atopic dermatitis (CAD) · Food allergy (Cutaneous Adverse Food Reaction, CAFR) · Flea Allergic Dermatitis (FAD) · Contact dermatitis (rare, hairless areas) · ทั้ง 4 มี pruritus + 2° infection เป็นหลัก\n\n❌ ทำไมข้ออื่นผิด\n— Pemphigus/Lupus = autoimmune ไม่ใช่ allergic\n— Bact/Fungal/Parasitic = infections\n— Hypersensitivity types = pathogenesis classification, ไม่ใช่ disease',
    verified: 'Derm_8_Allergic_dermatitis.pdf p.2' },

  { id: 956, subject: 'com4', topic: 'derm-allergic', year: 4, source: 'Derm_8_Allergic_dermatitis.pdf',
    tags: ['food-allergy', 'duration'], type: 'mcq',
    q: 'Food elimination diet trial ต้องทำต่อเนื่องนานเท่าใดถึงจะ rule out food allergy ได้',
    options: ['1-2 สัปดาห์', '8-12 สัปดาห์ (ดูผลที่ 4 wk แรก)', '6 เดือน', '1 ปี'],
    answer: 1, explain: 'Food elimination diet: 8-12 wk strict (novel protein OR hydrolyzed) · clinical improvement อาจเริ่มเห็นที่ 4 wk · ไม่มี treats / chews / flavored med · ทำ pruritus score + lesion grading ก่อน-หลัง · No response = atopic dermatitis (diagnosis of exclusion) · ระหว่างทำสามารถใช้ antipruritic/ATB control ได้\n\n❌ ทำไมข้ออื่นผิด\n— "1-2 wk" = สั้นเกิน, false negative\n— "6 เดือน" / "1 ปี" = นานเกินจำเป็น (ถ้าจะเห็นผล จะเห็นใน 8-12 wk)',
    verified: 'Derm_8_Allergic_dermatitis.pdf p.3' },

  { id: 957, subject: 'com4', topic: 'derm-allergic', year: 4, source: 'Derm_8_Allergic_dermatitis.pdf',
    tags: ['atopic', 'pathogenesis'], type: 'mcq',
    q: 'Pathogenesis ของ Atopic Dermatitis (CAD) เกิดจากอะไรเป็นหลัก',
    options: ['Bacterial infection ที่ deep skin', 'Skin barrier dysfunction (filaggrin/ceramide ↓) + aberrant Th2 immunological response + genetic predisposition', 'การติดเชื้อ Demodex', 'การกินอาหารผิด'],
    answer: 1, explain: 'CAD = multifactorial: skin barrier defect (↓ filaggrin/loricrin/ceramide → ↑ TEWL → allergen penetration ง่าย) + aberrant Th2 response (IgE-mediated to environmental allergens) + genetic + cutaneous dysbiosis · environmental allergens (dust mites, mold, pollen) ทำให้ flare\n\n❌ ทำไมข้ออื่นผิด\n— Bacterial deep = pyoderma\n— Demodex = parasitic\n— อาหารผิด = food allergy (different mechanism)',
    verified: 'Derm_8_Allergic_dermatitis.pdf p.4' },

  { id: 958, subject: 'com4', topic: 'derm-allergic', year: 4, source: 'Derm_8_Allergic_dermatitis.pdf',
    tags: ['atopic', 'favrot'], type: 'mcq',
    q: 'Favrot\'s criteria สำหรับ canine atopic dermatitis ใช้ทำอะไร',
    options: ['Confirmatory diagnosis (>= 5/8 = atopy)', 'Clinical screening — ช่วยสนับสนุน diagnosis (sensitivity 85% / specificity 79% ที่ 5/8 หรือ 6/8)', 'แทน intradermal skin test', 'ใช้ตัดสิน prognosis'],
    answer: 1, explain: 'Favrot\'s criteria 8 ข้อ: (1) onset < 3 yr (2) indoor mostly (3) GC-responsive (4) IBL alesional pruritus (5) front feet affected (6) ear pinnae affected (7) ear margin not affected (8) dorsolumbar not affected · ≥ 5/8 = sensitivity ~85% / specificity ~79% · ≥ 6/8 = specificity ~89% · diagnosis ของ atopy ยังต้องอาศัย exclusion (rule out parasites, infection, food allergy)\n\n❌ ทำไมข้ออื่นผิด\n— Confirmatory = ผิด, ใช้ supportive\n— แทน IDST = ผิด (IDST ระบุ allergens)\n— Prognosis = Favrot ไม่ได้ทำนาย prognosis',
    verified: 'Derm_8_Allergic_dermatitis.pdf p.7' },

  { id: 959, subject: 'com4', topic: 'derm-allergic', year: 4, source: 'Derm_8_Allergic_dermatitis.pdf',
    tags: ['atopic', 'distribution'], type: 'mcq',
    q: 'Atopic dermatitis (CAD) ตำแหน่ง classic distribution',
    options: ['Lumbosacral + ventral abdomen เท่านั้น', 'Periorbital, otitis externa, cheilitis, flexor elbow, paws (interdigital), ear pinnae (sparing margin)', 'Dorsal back เท่านั้น', 'Multifocal random'],
    answer: 1, explain: 'CAD distribution: face (periorbital, cheilitis), ears (pinna affected, margin spared) + otitis externa, paws (interdigital, pedal furunculosis), flexor surface (elbow, hock), ventral abdomen + axillae · "sparing dorsolumbar" = differentiate FAD\n\n❌ ทำไมข้ออื่นผิด\n— Lumbosacral = FAD pattern\n— Dorsal back only = ไม่ใช่ atopy\n— Multifocal random = ไม่มี pattern',
    verified: 'Derm_8_Allergic_dermatitis.pdf p.6' },

  { id: 960, subject: 'com4', topic: 'derm-allergic', year: 4, source: 'Derm_8_Allergic_dermatitis.pdf',
    tags: ['atopic', 'breed'], type: 'mcq',
    q: 'Breed ที่ predispose ต่อ Atopic Dermatitis (CAD)',
    options: ['Greyhound + Whippet', 'West Highland White Terrier, Lab/Golden, French Bulldog, Pug, Shih Tzu, Sharpei, Poodle', 'แมวเฉพาะ Persian', 'ไม่มี breed predisposition'],
    answer: 1, explain: 'CAD predisposed breeds: WHWT, Lab, Golden, French Bulldog, Pug, Shih Tzu, Sharpei, Poodle, Boxer, Bulldog, GSD · onset < 3 ปี · seasonal (early disease) → year-round (chronic)\n\n❌ ทำไมข้ออื่นผิด\n— Greyhound/Whippet = ไม่ predisposed\n— Persian only = limited\n— "ไม่มี breed predisposition" = ผิด',
    verified: 'Derm_8_Allergic_dermatitis.pdf p.5' },

  { id: 961, subject: 'com4', topic: 'derm-allergic', year: 4, source: 'Derm_8_Allergic_dermatitis.pdf',
    tags: ['atopic', 'treatment'], type: 'mcq',
    q: 'Multimodal management ของ CAD ใช้หลัก "TRIP" คืออะไร',
    options: ['Treat-Restore-Identify-Pruritus control', 'Topical-Rub-Inject-Pill', 'Time-Rest-Investigate-Plan', 'ไม่มีหลักนี้'],
    answer: 0, explain: '"TRIP" mnemonic: T = Treat secondary infection/infestation (ATB, antifungal, parasiticide) · R = Restore skin barrier (ceramide/EFA topical or oral) · I = Identify causative allergens (IDST/ASIS for environmental, food trial for food) · P = Pruritus control (multiple options)\n\n❌ ทำไมข้ออื่นผิด\n— "Topical-Rub-Inject-Pill" = ไม่ใช่ standard mnemonic\n— "Time-Rest-Investigate-Plan" = ไม่ใช่\n— "ไม่มี" = ผิด',
    verified: 'Derm_8_Allergic_dermatitis.pdf p.9' },

  { id: 962, subject: 'com4', topic: 'derm-allergic', year: 4, source: 'Derm_8_Allergic_dermatitis.pdf',
    tags: ['atopic', 'cyclosporine'], type: 'mcq',
    q: 'Cyclosporine สำหรับ canine CAD — anti-pruritic + anti-inflammatory ในระยะใด',
    options: ['Onset เร็วใน 1-2 ชั่วโมง', 'Onset ช้า 4-6 wk · steady-state 6-8 wk · ใช้ taper เป็น every-other-day หรือ q72h ได้', 'ใช้ inject เท่านั้น', 'ห้ามใช้กับสุนัขที่ติด Demodex'],
    answer: 1, explain: 'Cyclosporine (Atopica) 5 mg/kg PO q24h · onset ช้า 4-6 wk · steady-state 6-8 wk · ใช้ taper q48h หรือ q72h ได้หลัง stable · safe profile แต่ side effect: GI (vomit, gingival hyperplasia, gum bleeding), papillomatosis, hirsutism · ไม่ทำ Demodex แย่ลง (drug ลด T-cell แต่ไม่ severe enough)\n\n❌ ทำไมข้ออื่นผิด\n— Onset 1-2 hr = ผิด (ช้า)\n— Inject only = ผิด, oral standard\n— ห้ามใน Demodex = misconception, ใช้ได้',
    verified: 'Derm_8_Allergic_dermatitis.pdf p.10' },

  { id: 963, subject: 'com4', topic: 'derm-allergic', year: 4, source: 'Derm_8_Allergic_dermatitis.pdf',
    tags: ['atopic', 'oclacitinib'], type: 'mcq',
    q: 'Oclacitinib (Apoquel) มี mechanism of action อย่างไร',
    options: ['Antihistamine (H1 blocker)', 'JAK1 inhibitor — block IL-31 + other pruritogenic cytokines', 'Direct cytotoxic to T-cells', 'Steroid analog'],
    answer: 1, explain: 'Oclacitinib = JAK1 inhibitor · blocks IL-31 signaling (key pruritogenic cytokine ใน CAD) + IL-2/4/6/13 signaling · onset เร็ว (4-24 hr) · 0.4-0.6 mg/kg PO BID × 14 d → SID maintenance · safe long-term · side effect: ↑ infection risk (UTI, pneumonia, demodex), Tumor (rare reports)\n\n❌ ทำไมข้ออื่นผิด\n— H1 blocker = AH (limited efficacy)\n— Cytotoxic to T-cells = chemotherapy\n— Steroid analog = glucocorticoid',
    verified: 'Derm_8_Allergic_dermatitis.pdf p.10' },

  { id: 964, subject: 'com4', topic: 'derm-allergic', year: 4, source: 'Derm_8_Allergic_dermatitis.pdf',
    tags: ['atopic', 'cytopoint'], type: 'mcq',
    q: 'Cytopoint (lokivetmab) คืออะไร และใช้ยังไง',
    options: ['Oral steroid', 'Caninized monoclonal antibody ต่อ IL-31 → SC injection q4-6 wk', 'Topical cream', 'Oral antihistamine'],
    answer: 1, explain: 'Lokivetmab (Cytopoint) = caninized mAb ต่อ canine IL-31 · neutralize IL-31 (key itch cytokine) · SC injection ครั้งเดียว ออกฤทธิ์ 4-8 wk · onset 1 day · safe even ใน young/old/concurrent disease · expensive · ใช้ใน CAD (ไม่ใช่ food allergy)\n\n❌ ทำไมข้ออื่นผิด\n— Oral steroid = prednisolone (different)\n— Topical cream = local treatment\n— Oral AH = ineffective ใน CAD',
    verified: 'Derm_8_Allergic_dermatitis.pdf p.10' },

  // ═══════════════════════════════════════════════════════════
  // Autoimmune Skin Diseases (Aj. Chaiyot Tanrattana)
  // ═══════════════════════════════════════════════════════════
  { id: 965, subject: 'com4', topic: 'derm-autoimmune', year: 4, source: 'Derm_9_Autoimmune_skin_diseases.pdf',
    tags: ['autoimmune', 'pemphigus'], type: 'mcq',
    q: 'Autoimmune skin disease ที่พบบ่อยที่สุดในสุนัขและแมวคือ',
    options: ['Bullous pemphigoid', 'Pemphigus foliaceus (PF)', 'Pemphigus vulgaris', 'Discoid lupus erythematosus'],
    answer: 1, explain: 'Pemphigus foliaceus (PF) = most common autoimmune skin disease ใน dog/cat · "leaf-like" (ภาษากรีก) · superficial vesicles → ruptured → crusts + ulcers · ตำแหน่ง: nasal planum, periocular, ear pinnae, footpad · breed predispose: Akita, Chow Chow, Doberman, Newfoundland\n\n❌ ทำไมข้ออื่นผิด\n— Bullous pemphigoid = subepidermal, rare\n— Pemphigus vulgaris = severe oral lesions, rare\n— DLE = facial only (less severe than PF)',
    verified: 'Derm_9_Autoimmune_skin_diseases.pdf p.4' },

  { id: 966, subject: 'com4', topic: 'derm-autoimmune', year: 4, source: 'Derm_9_Autoimmune_skin_diseases.pdf',
    tags: ['pemphigus', 'antigen'], type: 'mcq',
    q: 'Pemphigus foliaceus มี autoantibody ต่อ target antigen ใด',
    options: ['Desmoglein 3 (Dsg3)', 'Desmoglein 1 (Dsg1) — desmosomal protein ใน superficial epidermis', 'BPAG1, BPAG2 (basement membrane)', 'Type IV collagen'],
    answer: 1, explain: 'PF: IgG ต่อ Dsg1 (desmoglein 1) — ใน superficial epidermis (granular layer) → loss of cell-cell adhesion → acantholysis → subcorneal pustules · Pemphigus vulgaris: Dsg3 (deeper, suprabasal) → severe oral lesions · Bullous pemphigoid: BPAG1/2 (basement membrane) → subepidermal blisters\n\n❌ ทำไมข้ออื่นผิด\n— Dsg3 = pemphigus vulgaris\n— BPAG1/2 = bullous pemphigoid\n— Type IV collagen = epidermolysis bullosa acquisita',
    verified: 'Derm_9_Autoimmune_skin_diseases.pdf p.3' },

  { id: 967, subject: 'com4', topic: 'derm-autoimmune', year: 4, source: 'Derm_9_Autoimmune_skin_diseases.pdf',
    tags: ['pemphigus', 'classification'], type: 'mcq',
    q: 'Pemphigus complex ประกอบด้วย 4 โรคใดบ้าง',
    options: ['PF, PV, Pemphigus vegetans, Pemphigus erythematosus', 'PF + DLE + SLE + Bullous pemphigoid', 'PF + Atopic + Food allergy + FAD', 'PF + Demodicosis + Sarcoptes + Cheyletiellosis'],
    answer: 0, explain: '4 forms ของ pemphigus complex: Pemphigus Foliaceus (PF, most common, Dsg1) · Pemphigus Vulgaris (PV, severe oral, Dsg3) · Pemphigus Vegetans (rare, vegetative lesions) · Pemphigus Erythematosus (PF + lupus features)\n\n❌ ทำไมข้ออื่นผิด\n— DLE/SLE/BP = different diseases (lupus group, BP separate)\n— Atopic/Food/FAD = allergic\n— Demodex/Sarcoptes = parasitic',
    verified: 'Derm_9_Autoimmune_skin_diseases.pdf p.3' },

  { id: 968, subject: 'com4', topic: 'derm-autoimmune', year: 4, source: 'Derm_9_Autoimmune_skin_diseases.pdf',
    tags: ['pemphigus', 'distribution'], type: 'mcq',
    q: 'Pemphigus foliaceus ตำแหน่งคลาสสิกของรอยโรคคือ',
    options: ['Lumbosacral + tail base', 'Nasal planum, periocular, ear pinnae, footpads (sometimes generalized)', 'Mouth ulcers severe', 'Multifocal random'],
    answer: 1, explain: 'PF distribution: bridge of nose, nasal planum, periocular, pinnae, footpads (hyperkeratotic + crust) · ± generalized · variable pruritus · 2° infection จาก ulceration\n\n❌ ทำไมข้ออื่นผิด\n— Lumbosacral/tail = FAD\n— Mouth ulcers severe = pemphigus VULGARIS (ไม่ใช่ foliaceus)\n— Multifocal random = ไม่ specific',
    verified: 'Derm_9_Autoimmune_skin_diseases.pdf p.4' },

  { id: 969, subject: 'com4', topic: 'derm-autoimmune', year: 4, source: 'Derm_9_Autoimmune_skin_diseases.pdf',
    tags: ['pemphigus', 'cytology'], type: 'mcq',
    q: 'Cytology ของ pemphigus foliaceus จะเห็นเซลล์ลักษณะใดเด่น',
    options: ['Eosinophils จำนวนมาก', 'Acantholytic cells (round keratinocytes) + neutrophils', 'Mast cells', 'Bacteria จำนวนมาก'],
    answer: 1, explain: 'PF cytology (impression smear of intact pustule): acantholytic cells = rounded keratinocytes ที่หลุดจากกันเพราะ Dsg1 ถูก destroy + non-degenerate neutrophils ± eosinophils · histopath = subcorneal/intragranular pustule with acantholysis = definitive Dx · IFA/IHC = IgG ที่ intercellular space\n\n❌ ทำไมข้ออื่นผิด\n— Eosinophils alone = parasitic/allergic\n— Mast cells = mast cell tumor\n— Bacteria มาก = bacterial pyoderma',
    verified: 'Derm_9_Autoimmune_skin_diseases.pdf p.5' },

  { id: 970, subject: 'com4', topic: 'derm-autoimmune', year: 4, source: 'Derm_9_Autoimmune_skin_diseases.pdf',
    tags: ['bullous-pemphigoid'], type: 'mcq',
    q: 'Bullous pemphigoid ต่างจาก pemphigus อย่างไร',
    options: ['ไม่ต่างกัน', 'Bullous pemphigoid = autoantibody ต่อ basement membrane (BPAG1/2) → subepidermal blister (deeper than pemphigus)', 'BP = bacterial', 'BP = parasitic'],
    answer: 1, explain: 'Bullous pemphigoid: IgG ต่อ hemidesmosome proteins (BP180/BPAG2, BP230/BPAG1) ที่ basement membrane → subepidermal split → tense bullae (ไม่แตกง่าย เพราะลึกกว่า pemphigus) · severity ≥ pemphigus · oral, mucocutaneous, skin · less common than PF\n\n❌ ทำไมข้ออื่นผิด\n— "ไม่ต่างกัน" = ผิด, mechanism + level ต่าง\n— BP bacterial/parasitic = ผิด (autoimmune)',
    verified: 'Derm_9_Autoimmune_skin_diseases.pdf p.3' },

  { id: 971, subject: 'com4', topic: 'derm-autoimmune', year: 4, source: 'Derm_9_Autoimmune_skin_diseases.pdf',
    tags: ['lupus'], type: 'mcq',
    q: 'Discoid Lupus Erythematosus (DLE) ต่างจาก Systemic Lupus Erythematosus (SLE) อย่างไร',
    options: ['ไม่ต่างกัน', 'DLE = cutaneous-only (face, nasal planum) · SLE = multi-organ (skin + joint + kidney + hematologic)', 'DLE มีหลายอวัยวะ, SLE เฉพาะผิว', 'DLE = bacterial cause'],
    answer: 1, explain: 'DLE = "collie nose" — limited to face (nasal planum, periocular, ear pinnae) · loss of pigment + erythema + scaling + erosion · sun-aggravated · benign · breed: Collie, GSD, Husky · SLE = multisystem autoimmune (skin + arthritis + glomerulonephritis + cytopenias) · ANA + (60-90% positive)\n\n❌ ทำไมข้ออื่นผิด\n— "ไม่ต่างกัน" = ผิด\n— "DLE หลายอวัยวะ" = สลับกัน\n— "DLE bacterial" = ผิด (autoimmune)',
    verified: 'Derm_9_Autoimmune_skin_diseases.pdf p.6' },

  { id: 972, subject: 'com4', topic: 'derm-autoimmune', year: 4, source: 'Derm_9_Autoimmune_skin_diseases.pdf',
    tags: ['dle', 'distribution'], type: 'mcq',
    q: 'Discoid Lupus Erythematosus (DLE) ตำแหน่ง classic คือ',
    options: ['ทั่วตัว', 'Nasal planum (depigmentation, erythema, ulceration) + periocular + ear pinnae', 'Lumbosacral + tail', 'Limbs only'],
    answer: 1, explain: 'DLE: face-limited "collie nose" pattern · loss of cobblestone of nasal planum + depigmentation + erythema + ulceration + scarring · UV-aggravated → worse in summer / outdoor · breeds: Collie, Shetland, GSD, Siberian Husky, Brittany\n\n❌ ทำไมข้ออื่นผิด\n— "ทั่วตัว" = generalized autoimmune\n— Lumbosacral/tail = FAD\n— Limbs only = ไม่ใช่ pattern',
    verified: 'Derm_9_Autoimmune_skin_diseases.pdf p.6' },

  { id: 973, subject: 'com4', topic: 'derm-autoimmune', year: 4, source: 'Derm_9_Autoimmune_skin_diseases.pdf',
    tags: ['autoimmune', 'diagnosis'], type: 'mcq',
    q: 'Definitive diagnosis ของ pemphigus complex / autoimmune skin diseases ใช้',
    options: ['CBC + CRP เท่านั้น', 'Skin biopsy + histopathology (+ IFA/IHC ถ้าทำได้)', 'Bacterial culture', 'Serology IgE'],
    answer: 1, explain: 'Definitive Dx: skin biopsy (intact vesicle/pustule + perilesional area) → histopath: PF = subcorneal pustule with acantholytic cells · BP = subepidermal blister · DLE = interface dermatitis with apoptotic keratinocytes + pigmentary incontinence · IFA/IHC = confirm IgG location (intercellular = pemphigus, basement membrane = BP, lupus band = DLE/SLE)\n\n❌ ทำไมข้ออื่นผิด\n— CBC/CRP = supportive only\n— Bact culture = bacterial pyoderma\n— Serology IgE = atopic test',
    verified: 'Derm_9_Autoimmune_skin_diseases.pdf p.5' },

  { id: 974, subject: 'com4', topic: 'derm-autoimmune', year: 4, source: 'Derm_9_Autoimmune_skin_diseases.pdf',
    tags: ['autoimmune', 'treatment'], type: 'mcq',
    q: 'First-line treatment ของ pemphigus foliaceus ในสุนัข',
    options: ['Antibiotic เดี่ยว', 'Immunosuppressive prednisolone 2-4 mg/kg/d → taper · ± adjunct (azathioprine, cyclosporine, MMF) ถ้า refractory', 'Topical steroid เท่านั้น', 'รอหายเอง'],
    answer: 1, explain: 'PF treatment: induction prednisolone 2-4 mg/kg/d (immunosuppressive dose) × 4-6 wk → taper ทุก 4 wk หาก clinical remission · adjunct (steroid-sparing): Azathioprine 2 mg/kg/d (dog only — ห้ามแมว, fatal myelosuppression) · Cyclosporine · Mycophenolate mofetil (MMF) · Chlorambucil ในแมว · monitor liver, CBC, infection · long-term goal: lowest dose maintaining remission\n\n❌ ทำไมข้ออื่นผิด\n— Antibiotic alone = ไม่ใช่ autoimmune cause\n— Topical steroid only = local lesion เล็กๆ พอ, ไม่ enough generalized PF\n— "รอหายเอง" = autoimmune ไม่หายเอง',
    verified: 'Derm_9_Autoimmune_skin_diseases.pdf p.7' },

  // ═══════════════════════════════════════════════════════════
  // (More: immune-drugs, IMHA, SLE, IBD, peds-geri)
  // ═══════════════════════════════════════════════════════════
];
