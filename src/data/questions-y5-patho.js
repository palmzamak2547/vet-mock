// ============================================================
// Y5 Patho Questions — พยาธิวิทยาปศุสัตว์ (Livestock Pathology)
// ============================================================
// Source:
//   - "1. Final Patho prac.pdf" — Vet 81 สรุปรวม final (Tangmay,
//     Zinzin, Bombam compilation) · cross-validated with พี่ใหม่ Vet 81
//   - 70 ข้อ MCQ · 2 hr exam · Y5 term 2 livestock pathology final
//
// Subjects/topics (matches curriculum.js):
//   - livestock-pathology: lpath-slaughter | lpath-swine-systemic | lpath-avian
//
// Each question: { id, subject:'livestock-pathology', topic, year:5,
//   source, examOrigin, tags, type:'mcq', q, options, answer, explain,
//   verified, flag? }
//
//   examOrigin: "Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update"
//   flag: ใช้เมื่อ commentary ของพี่ปอ disagree กับคำตอบ X ของกลุ่ม Vet 81
//         หรือเมื่อข้อสอบเก่ามี ambiguity ระหว่าง textbook
// ============================================================

export const QB_Y5_PATHO = [
  // ═══════════════════════════════════════════════════════════
  // General Systemic Pathology + Differential Diagnosis
  // ═══════════════════════════════════════════════════════════

  { id: 8200, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['kidney', 'nephropathy', 'differential'], type: 'mcq',
    q: 'ข้อใด ไม่ก่อ ให้เกิดพยาธิสภาพของไต',
    options: [
      'Melamine, Porcine dermatitis and nephropathy syndrome (PDNS)',
      'Leptospirosis, Aflatoxin',
      'Ochratoxin, Heartworm',
      'Sulfonamide, Canine ehrlichiosis',
      'Gentamicin, Feline infectious peritonitis (FIP)'
    ],
    answer: 1,
    explain: 'Vet 81 group ตอบ B (Lepto + Aflatoxin) — แต่ commentary "ปอน่าจะตอบข้อนี้" ชี้ไปที่ C (Ochratoxin + Heartworm)\nLepto = interstitial nephritis (ชัด)\nAflatoxin = primary hepatotoxin, renal effect รอง\nOchratoxin = renal tubular damage (ชัด)\nHeartworm = glomerulonephritis (immune-complex)\n\nทุกข้อ list สารที่ทำพยาธิไตทั้งคู่จึงไม่มีข้อ "ไม่ก่อ" ที่ชัดเจน — flag ambiguity',
    verified: 'Final Patho prac.pdf p.1',
    flag: { note: 'Vet 81 ตอบ B แต่ commentary พี่ปอ ตอบ C — disagreement', sources: ['Final Patho prac.pdf p.1'], severity: 'major' } },

  { id: 8201, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['jaundice', 'differential', 'hemolysis'], type: 'mcq',
    q: 'ข้อใด มิใช่ พยาธิวินิจฉัยแยกแยะของภาวะดีซ่าน (Jaundice)',
    options: [
      'Canine babesiosis, Hepatic lipidosis in cat',
      'Mycoplasma haemofelis infection, Leptospirosis',
      'Immune-mediated hemolytic anemia, Porcine circovirus type II infection',
      'Anaplasmosis in cow, Copper-induced hepatitis',
      'ผิดทุกข้อ (เพราะในตัวเลือกเป็นดีซ่านได้หมด)'
    ],
    answer: 4,
    explain: 'ตัวเลือก A-D เป็น DDx ของ jaundice ครบทุกข้อ (pre/hepatic/post-hepatic)\n- Babesiosis, M. haemofelis, IMHA = pre-hepatic (hemolysis)\n- Hepatic lipidosis, Lepto, Cu-hepatitis = hepatic\n- PCV2, Anaplasmosis = mixed\n→ E "ผิดทุกข้อ" คือ "ไม่มีข้อใดที่ไม่ใช่ DDx" = ทุกข้อเป็น DDx ทั้งหมด',
    verified: 'Final Patho prac.pdf p.1' },

  { id: 8202, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['uremia', 'kidney-failure'], type: 'mcq',
    q: 'รอยโรคใดที่ ไม่ สามารถเจอได้เมื่อสุนัขเกิดภาวะปัสสาวะเป็นพิษในโลหิต (Uremia)',
    options: [
      'แผลหลุมในทางเดินอาหาร (Gastrointestinal ulceration)',
      'การสะสมของแคลเซียมใต้เยื่อบุช่องอก (Subpleural calcification)',
      'ต่อมไทรอยด์ขยายใหญ่ (Thyroid hyperplasia)',
      'แผลหลุมของกระพุ้งแก้ม (Ulcerative stomatitis)',
      'ถูกทุกข้อ'
    ],
    answer: 2,
    explain: 'Uremia lesions ใน dog:\n- GI ulceration (uremic gastritis/colitis)\n- Subpleural / soft tissue calcification (Ca x P imbalance)\n- Ulcerative stomatitis (uremic burn ที่ลิ้น/แก้ม)\n- Renal secondary hyperparathyroidism\n→ Thyroid hyperplasia ไม่ใช่ feature of uremia (parathyroid ต่างหากที่ hyperplasia)',
    verified: 'Final Patho prac.pdf p.1' },

  { id: 8203, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['granulomatous', 'inflammation'], type: 'mcq',
    q: 'ข้อใด ไม่ทำให้เกิด การอักเสบแบบ Granulomatous inflammation',
    options: [
      'Tuberculosis, Actinomycosis',
      'Cryptococcosis, Blastomycosis',
      'Dry form of FIP, Dermatophytic pseudomycetoma',
      'Botryomycosis, Porcine circovirus type II infection',
      'Paratuberculosis, Infectious laryngotracheitis (ILT)'
    ],
    answer: 4,
    explain: 'Granulomatous inflammation = chronic Mø-rich response\nA: TB, Actinomycosis ✓\nB: Crypto, Blasto (fungi) ✓\nC: FIP dry form (pyogranulomatous), pseudomycetoma ✓\nD: Botryomycosis (Staph granuloma), PCV2 (granulomatous lymphadenitis) ✓\nE: Paratuberculosis ✓ แต่ ILT = diphtheritic membrane (necro-fibrinous tracheitis), NOT granulomatous → E คือคำตอบ',
    verified: 'Final Patho prac.pdf p.1' },

  { id: 8204, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['hemorrhage', 'coagulopathy', 'differential'], type: 'mcq',
    q: 'กรณีใดที่ ไม่ทำให้เกิด จุดเลือดออกที่ผิวหนังและ/หรืออวัยวะภายใน',
    options: [
      'Warfarin poisoning, hookworm infection, Acute classical swine fever',
      'Infectious canine hepatitis, Zinc phosphide intoxication, Septicemic salmonellosis',
      'Canine tropical pancytopenia, Highly pathogenic avian influenza, Canine herpesvirus infection',
      'Acute heat stroke, Canine herpesvirus infection, Infectious bursal disease',
      'Porcine dermatitis and nephropathy syndrome, Infectious bronchitis, Ancylostomiasis'
    ],
    answer: 1,
    explain: 'B: Zinc phosphide → GI corrosion + pulm edema (สาเหตุตายเร็ว) แต่ไม่ทำให้เลือดออกแบบ petechiae/ecchymosis เป็น primary lesion (เน้น respiratory/GI)\nข้ออื่นทุกตัวมี hemorrhage ชัดเจน — Warfarin/CSF/ICH/IBD/PDNS/HPAI/Salmonella/CHV ทั้งหมดทำเลือดออกได้',
    verified: 'Final Patho prac.pdf p.1-2' },

  { id: 8205, subject: 'livestock-pathology', topic: 'lpath-slaughter', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['postmortem-change', 'autopsy'], type: 'mcq',
    q: 'ลักษณะใด ไม่ใช่ การเปลี่ยนแปลงหลังการตาย (Postmortem change)',
    options: [
      'Pseudomelanosis, Bile imbibition',
      'Rigor mortis, Hemoglobin imbibition',
      'Hypostatic congestion, Gas accumulation in GI tract',
      'Putrefaction, Algor mortis',
      'Pulmonary congestion and edema, Bloat'
    ],
    answer: 4,
    explain: 'Postmortem changes = สิ่งที่เกิดขึ้นหลังตาย ไม่เกี่ยวกับโรค\n- Pseudomelanosis, Bile/Hb imbibition (สีเปลี่ยน)\n- Rigor mortis (กล้ามเนื้อแข็ง)\n- Hypostatic congestion (เลือดตกตามแรงโน้มถ่วง)\n- Putrefaction, Algor mortis (อุณหภูมิลดลง)\n- Gas in GI = postmortem fermentation\n→ E: Pulmonary congestion + edema = ANTEMORTEM (agonal) lesion / Bloat ในวัว = อาจ ante- หรือ postmortem แต่ pulm edema = antemortem ชัด',
    verified: 'Final Patho prac.pdf p.2' },

  { id: 8206, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['gi','enteritis','differential'], type: 'mcq',
    q: 'ข้อใด ไม่ก่อ ให้เกิดรอยโรคในระบบทางเดินอาหาร',
    options: [
      'Giardiasis, FMD, Canine distemper',
      'Feline infectious peritonitis (FIP), Stress, Duck plaque',
      'Mast cell tumor, Spirocerca lupi infection, Tuberculosis',
      'Coccidiosis, porcine parvovirus infection, leptospirosis',
      'Salmonellosis, paratuberculosis, porcine epidemic diarrhea'
    ],
    answer: 3,
    explain: 'D: Porcine parvovirus = SMEDI (reproductive, ไม่ใช่ GI) ในแม่สุกร และ leptospirosis = ส่วนใหญ่ไต/ตับ ไม่ใช่ GI\nA: Giardia (GI) / FMD (oral vesicles + esophagus → GI) / CD (alimentary form = diarrhea)\nB: FIP (GI mass, granuloma), stress (GI ulcer), Duck plaque (Diph esophagitis)\nC: MCT (GI ulcer จาก histamine), Spirocerca (esophageal granuloma), TB (GI ก็เจอ)\nE: ทั้งหมด GI ชัด',
    verified: 'Final Patho prac.pdf p.2' },

  { id: 8207, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['infarction', 'circulation'], type: 'mcq',
    q: 'ลักษณะทางมหพยาธิวิทยาข้อใดกล่าว ไม่ถูกต้อง เกี่ยวกับ Infarction',
    options: [
      'ม้ามพบ hemorrhagic infarction',
      'หัวใจเกิด infarction เนื่องจากเกิด thrombus ใน coronary artery',
      'กระเพาะอาหารไม่สามารถเจอรอยโรค infarction',
      'ไตพบ anemic infarction',
      'ผิดทุกข้อ'
    ],
    answer: 2,
    explain: 'กระเพาะอาหาร CAN have infarction — เช่นใน GDV (Gastric dilatation-volvulus) ที่บิด → infarction ของผนังกระเพาะ\nม้าม = hemorrhagic infarct (loose tissue)\nไต = anemic infarct (firm tissue)\nหัวใจ = thrombo-embolic from coronary\n→ C ผิด',
    verified: 'Final Patho prac.pdf p.2' },

  { id: 8208, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['inclusion-body', 'viral', 'differential'], type: 'mcq',
    q: 'ข้อใดต่อไปนี้ ไม่ สัมพันธ์กัน (โรค-IB-cell)',
    options: [
      'Infectious canine hepatitis — Basophilic intranuclear IB in endothelium',
      'Pseudorabies — Acidophilic intranuclear IB in neuron',
      'Rabies — Acidophilic intracytoplasmic IB in microglia',
      'Canine distemper — Acidophilic intracytoplasmic IB in bronchiolar epithelium',
      'Porcine circovirus type II — Amphophilic intracytoplasmic IB in macrophage'
    ],
    answer: 2,
    explain: 'Negri body (Rabies) อยู่ใน NEURONS (Purkinje cells, hippocampal pyramidal cells) — ไม่ใช่ microglia\n- ICH = basophilic intranuclear in hepatocyte/endothelium ✓\n- PR = acidophilic intranuclear in neuron ✓\n- CD = intracytoplasmic in bronchiolar epi / urothelium / lymphocyte ✓\n- PCV2 = amphophilic intracytoplasmic in macrophage (botryoid) ✓',
    verified: 'Final Patho prac.pdf p.2' },

  { id: 8209, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['CPV', 'parvovirus', 'case'], type: 'mcq',
    q: 'สุนัขอายุ 3 เดือน ยังไม่เคยฉีดวัคซีน แสดงอาเจียนบ่อยครั้ง ท้องเสียอย่างรุนแรง สีแดงคล้ำ กลิ่นเหม็นคาวจัด เหงือกซีด — คาดว่าโรคอะไร และพบรอยโรคใดทางจุลพยาธิ',
    options: [
      'Diphtheritic (fibrinonecrotic) enteritis — Salmonellosis',
      'Multifocal necrosis of intestinal mucosa — Coccidiosis',
      'Necrosis of crypt epithelium, villous atrophy — Canine parvovirus',
      'Multifocal necrosis of liver — Herpes virus infection',
      'Atrophic enteritis with villous blunting — Ancylostomiasis'
    ],
    answer: 2,
    explain: 'CPV-2 ในลูกสุนัขไม่ฉีดวัคซีน → bloody/fetid diarrhea + vomiting → crypt epithelium necrosis → villus collapse/atrophy → diagnostic histology',
    verified: 'Final Patho prac.pdf p.2-3' },

  { id: 8210, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['heartworm', 'Dirofilaria', 'case'], type: 'mcq',
    q: 'สุนัขท้องกาง เหงือกซีด หายใจหอบ ตรวจเลือดพบ microfilaria ชันสูตรซากคิดว่าจะพบรอยโรคใด',
    options: [
      'Cirrhosis, Right heart dilatation',
      'Parasitic pneumonia, Villous formation of pulmonary artery',
      'Contracted kidney, Subpleural fibrosis',
      'Ascites, Dilatation of pulmonary artery',
      'ถูกทุกข้อ'
    ],
    answer: 4,
    explain: 'Dirofilaria immitis (heartworm) → R-side heart load → tricuspid regurg, R heart dilatation, pulm artery villous endarteritis, parasitic pneumonia, ascites, chronic glomerulonephritis (immune complex → contracted kidney), subpleural fibrosis\n→ ทุกข้อเป็นรอยโรค heartworm ได้หมด',
    verified: 'Final Patho prac.pdf p.3' },

  { id: 8211, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['FIP', 'feline', 'case'], type: 'mcq',
    q: 'แมวเพศผู้อายุ 5 ปี เลี้ยงปล่อย ท้องกาง หายใจลำบาก โรคใดน่าจะเป็นสาเหตุมากที่สุด',
    options: [
      'Feline infectious peritonitis',
      'Mycoplasma haemofelis infection',
      'Feline leukemia virus (FeLV)',
      'Platynosomum sp. infection',
      'Disseminated actinomycosis'
    ],
    answer: 0,
    explain: 'Wet FIP (effusive form) — แมวปล่อย, ascites + dyspnea จาก pleural effusion/peritonitis = classic FIP\nM. haemofelis → hemolytic anemia (ไม่ใช่ ascites)\nFeLV → lymphoma\nPlatynosomum → liver fluke (cholangitis)',
    verified: 'Final Patho prac.pdf p.3' },

  { id: 8212, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['fungi', 'mycology', 'differential'], type: 'mcq',
    q: 'ข้อใด ไม่ใช่ โรคที่เกิดจากการติดเชื้อรา หรือ dimorphic fungi',
    options: [
      'Pythiosis, Blastomycosis',
      'Dermatophytosis, Mycetoma',
      'Sporotrichosis, Candidiasis',
      'Botryomycosis, Cryptococcosis',
      'Phaeohyphomycosis, Coccidioidomycosis'
    ],
    answer: 3,
    explain: 'Botryomycosis = แบคทีเรีย (Staphylococcus aureus) granuloma ที่มี Splendore-Hoeppli phenomenon — NOT fungus\n- Pythium = oomycete (รา-like)\n- Crypto = yeast (encapsulated)\n- ข้ออื่นทุกตัวเป็นรา/dimorphic ครบ',
    verified: 'Final Patho prac.pdf p.3' },

  { id: 8213, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['skin', 'dermatology', 'differential'], type: 'mcq',
    q: 'ข้อใด ไม่ก่อ ให้เกิดพยาธิสภาพที่ผิวหนัง',
    options: [
      'Hypothyroidism, Scabies',
      'Photosensitization, Psoroptes cuniculi infection',
      'Zinc deficiency, Hypovitaminosis D',
      'Blastomyces dermatitidis, Malassezia pachydermatis infection',
      'Hyperadrenocorticism, Demodicosis'
    ],
    answer: 2,
    explain: 'Hypovitaminosis D → bone disease (rickets) — ไม่ใช่ผิวหนัง\n- Hypothyroidism → seborrhea, alopecia ✓\n- Photosensitization → skin necrosis ✓\n- Zinc deficiency → parakeratosis (skin) ✓\nคำว่า "Zinc deficiency" ก่อ skin lesion แต่ "Hypovit D" ไม่ — C ผิด',
    verified: 'Final Patho prac.pdf p.3' },

  { id: 8214, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['CDV', 'distemper', 'inclusion-body', 'case'], type: 'mcq',
    q: 'สุนัขมีน้ำมูก ขี้ตา ท้องเสีย และอาการทางประสาท — วินิจฉัยและตำแหน่ง inclusion body',
    options: [
      'Canine distemper: intranuclear IB in bronchiolar epithelium',
      'Canine distemper: intranuclear IB in neuron and astrocyte',
      'Canine distemper: intracytoplasmic IB in neuron and astrocyte',
      'Rabies: intranuclear IB in neuron and astrocyte',
      'Rabies: intracytoplasmic IB in neuron and astrocyte'
    ],
    answer: 1,
    explain: 'Vet 81 group ตอบ B (intranuclear IB in neuron/astrocyte) — CDV มี IB ได้ทั้ง intranuclear และ intracytoplasmic ในหลายชนิดเซลล์ (urothelium, lymphocyte, bronchiolar epi, neuron, astrocyte)\nClinical signs ระบบประสาท + GI + URI = CDV ชัด ไม่ใช่ Rabies\nNote: บางตำราเน้น intracytoplasmic IB ของ CDV ใน neuron — เลือกตาม Vet 81 key',
    verified: 'Final Patho prac.pdf p.3-4',
    flag: { note: 'CDV inclusion bodies เจอได้ทั้ง intranuclear และ intracytoplasmic — บางตำราเน้น intracytoplasmic เป็นหลัก แต่ Vet 81 key ตอบ B', sources: ['Final Patho prac.pdf p.3-4'], severity: 'minor' } },

  { id: 8215, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['gross-histo-correlation'], type: 'mcq',
    q: 'โรคใดที่ทำให้เกิดรอยโรคทางมหพยาธิวิทยาและจุลพยาธิวิทยาที่สัมพันธ์กันมากที่สุด',
    options: [
      'Dirofilariasis — Nutmeg liver — Centrilobular fatty degeneration',
      'Feline herpes virus infection — Ulcerative glossitis — Intranuclear inclusion of conjunctival epithelium',
      'Canine parvoviral enteritis — Watery diarrhea — Destruction of intestinal crypts',
      'Feline distemper — Catarrhal enteritis — Destruction of intestinal crypts',
      'PRRS virus — Diffuse pneumonia — Bronchointerstitial pneumonia'
    ],
    answer: 0,
    explain: 'Dirofilariasis → R-heart failure → chronic passive congestion of liver → "nutmeg liver" gross → centrilobular fatty degeneration histology — match ครบทุก level\n- FHV-1 = corneal ulcer + IB in epithelium (glossitis ไม่ใช่ feature หลัก)\n- CPV = BLOODY diarrhea (not watery) + crypt necrosis\n- FPV = catarrhal + crypt damage (พอใช้แต่ A ดีกว่า)\n- PRRS = bronchointerstitial pneumonia ✓ แต่ "diffuse" ไม่เน้นทั่ว',
    verified: 'Final Patho prac.pdf p.4' },

  // ═══════════════════════════════════════════════════════════
  // Swine Pathology (PRRS, PCV2, CSF, FMD, polyserositis, etc.)
  // ═══════════════════════════════════════════════════════════

  { id: 8216, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['swine', 'PCV2', 'PRRS', 'general'], type: 'mcq',
    q: 'ข้อใดกล่าวถูกต้องเกี่ยวกับโรคในสุกร',
    options: [
      'โรคไข้หวัดใหญ่สุกร (Swine influenza) สามารถทำให้สุกรเสียชีวิตได้เหมือนไข้หวัดนก (HPAI)',
      'Cranioventral pneumonia ในสุกรเกิดจากการติดเชื้อ Mycoplasma hyopneumoniae เท่านั้น',
      'การพบเลือดออกที่ต่อมน้ำเหลืองของสุกรเมื่อชันสูตรซาก สามารถบอกได้ว่าสุกรเป็น CSF',
      'รอยโรค generalized lymphadenopathy เกิดได้จาก PCV2 หรือ PRRSV',
      'โรคฉี่หนู (Leptospirosis) ทำให้แม่สุกรไตวายเท่านั้น ไม่ทำให้แท้ง'
    ],
    answer: 3,
    explain: 'D: ทั้ง PCV2 และ PRRSV ทำให้ generalized lymphadenopathy ได้\nA: SIV จำกัดที่ respiratory system, ไม่ตายเหมือน HPAI\nB: Cranioventral pneumonia เกิดได้จาก หลายเชื้อ (Pasteurella, App, Strep, Mycoplasma)\nC: hemorrhagic LN เป็น DDx หลายโรค (HPAI-like PRRS, septicemia, anthrax)\nE: Lepto ทำให้แท้งในแม่สุกรได้ (abortion storm)',
    verified: 'Final Patho prac.pdf p.4' },

  { id: 8217, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['fmd','vesicular','swine'], type: 'mcq',
    q: 'ข้อใดกล่าว ไม่ถูกต้อง เกี่ยวกับโรคปากและเท้าเปื่อย (FMD)',
    options: [
      'สามารถทำให้เกิดรอยโรคเหมือนโรคติดเชื้อไวรัส Senecavirus A',
      'ไวรัส FMD ในสุกรทนต่อสภาวะแวดล้อมได้ดี และแพร่กระจายง่าย',
      'ผิวหนังพุพองหรือน้ำในถุงน้ำ (vesicular fluid) เป็นตัวอย่างที่เหมาะสมในการเพาะแยกไวรัส',
      'ไวรัส FMD ที่ระบาดในไทยมี 3 สายพันธุ์ คือ A, O และ Asia 1',
      'การเกิดแผลผุพอง (vesicle) ที่ปลายจมูกในสุกรเกิดจาก FMD เท่านั้น'
    ],
    answer: 4,
    explain: 'Vesicle ที่ปลายจมูก ในสุกรเป็น DDx หลายโรค:\n- FMD\n- Swine vesicular disease (SVD)\n- Vesicular stomatitis (VS)\n- Vesicular exanthema of swine (VES)\n- Senecavirus A (SVA)\nClinically แยกไม่ได้ ต้อง lab confirm\n→ E ผิด (ไม่ใช่ FMD เท่านั้น)',
    verified: 'Final Patho prac.pdf p.4' },

  { id: 8218, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['PRRS', 'swine'], type: 'mcq',
    q: 'ข้อใด ไม่ถูกต้อง เกี่ยวกับโรค Porcine reproductive and respiratory syndrome (PRRS)',
    options: [
      'Late-term abortion, Generalized lymphadenopathy',
      'Respiratory syndrome in piglets, No effect in boar',
      'In utero infection from infected semen, Thai-isolate PRRSV induced hemorrhage of renal surface',
      'Highly pathogenic PRRS virus-induced lesions similar to acute classical swine fever',
      'ผิดทุกข้อ'
    ],
    answer: 1,
    explain: 'B: PRRSV affects boars — testicular damage, reduced sperm quality, sheds virus in semen\nA: Late-term abortion + lymphadenopathy ✓\nC: vertical via semen + Thai isolate causes renal surface hemorrhage ✓\nD: HP-PRRS = high fever + hemorrhagic LN/spleen mimicking CSF',
    verified: 'Final Patho prac.pdf p.4-5' },

  { id: 8219, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['polyserositis', 'swine', 'bacterial'], type: 'mcq',
    q: 'สุกรอนุบาลป่วย ซึม ข้อบวม ชันสูตรพบ Fibrinopurulent pericarditis/epicarditis, pleuritis, peritonitis, polyarthritis — เชื้อใด ไม่ทำให้เกิด รอยโรคดังกล่าว',
    options: [
      'Haemophilus parasuis infection (Glasser disease)',
      'Mycoplasma hyorhinis infection',
      'Streptococcus suis type II infection',
      'Erysipelothrix rhusiopathiae',
      'ผิดทุกข้อ'
    ],
    answer: 3,
    explain: 'Erysipelas → vegetative valvular endocarditis + chronic proliferative synovitis + diamond skin lesion + degenerative arthritis — ไม่มี polyserositis (fibrinous เยื่อหุ้ม)\nA: H. parasuis = Glasser disease = classic fibrinous polyserositis + polyarthritis + meningitis\nB: M. hyorhinis = polyserositis + polyarthritis\nC: S. suis = meningitis + polyserositis + polyarthritis\n→ D ไม่เข้ากลุ่ม polyserositis',
    verified: 'Final Patho prac.pdf p.5' },

  { id: 8220, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['PCV2', 'PCVAD', 'swine'], type: 'mcq',
    q: 'ข้อใด ไม่ใช่ อาการหรือรอยโรคของกลุ่มอาการ Porcine circovirus associated disease (PCVAD)',
    options: [
      'Generalized lymphadenopathy, Diarrhea',
      'Mesocolon edema, Diffuse pneumonia',
      'Jaundice, Emaciation, Lymphoid depletion',
      'Diphtheritic colitis, PDNS skin-kidney lesions',
      'Reproductive failure, Hepatitis'
    ],
    answer: 3,
    explain: 'PDNS = Porcine dermatitis and nephropathy syndrome (เป็นส่วนหนึ่งของ PCVAD จริง) แต่ Diphtheritic colitis = Salmonella/Swine dysentery feature ไม่ใช่ PCVAD → ข้อนี้จึงเป็นข้อที่ "ไม่ใช่"\nLymphoid depletion = รอยโรคแกนของ PMWS จึงนับเป็น feature ของ PCVAD\nPCVAD spectrum: PMWS (lymphadenopathy + emaciation + jaundice + lymphoid depletion) + PDNS + PRDC + reproductive failure + enteritis (granulomatous) + hepatitis\nMesocolon edema = edema disease (E. coli) จริงๆ — แต่อยู่กับ "diffuse pneumonia" ของ PCV (PRDC)\n→ D ผิด (Diph colitis ไม่ใช่ PCV)',
    verified: 'Final Patho prac.pdf p.5-6' },

  { id: 8221, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['neuro', 'differential'], type: 'mcq',
    q: 'ข้อใดต่อไปนี้ที่ ไม่ ทำให้เกิดอาการทางระบบประสาท',
    options: [
      'Shiga-like toxin-producing E. coli (STEC), Highly pathogenic avian influenza virus, Salt poisoning in pig',
      'Classical swine fever, Nipah virus infection, Pseudorabies',
      'Porcine respiratory coronavirus infection, West Nile virus infection, Rabies',
      'Streptococcus suis type II, Haemophilus somni, Bovine spongiform encephalopathy',
      'Canine distemper, Newcastle disease, Avian influenza H5N1'
    ],
    answer: 2,
    explain: 'Porcine respiratory coronavirus (PRCV) = RESPIRATORY ONLY, ไม่ทำ neuro\n- TGEV (สายพันธุ์ที่เป็น PRCV deletion mutant) = GI\n- PRCV เกิดจาก deletion mutation ใน TGEV → tropism เปลี่ยนเป็น respiratory\nWest Nile + Rabies = neuro ทั้งคู่ แต่ PRCV ในข้อ C ทำให้ "เซ็ตของ 3 ตัว" ไม่ครบ neuro\n→ C เป็น set ที่ไม่ neuro ครบ',
    verified: 'Final Patho prac.pdf p.6' },

  { id: 8222, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['arthritis', 'swine'], type: 'mcq',
    q: 'ข้อใดก่อให้เกิดอาการข้ออักเสบ ไม่ใช้ขา และ/หรือพยาธิสภาพของข้อ (joint) ในสุกร แตกต่างจากกลุ่มอื่น',
    options: [
      'Mycoplasma hyorhinis, Erysipelothrix rhusiopathiae',
      'Streptococcus suis type II, Haemophilus parasuis',
      'Haemophilus parasuis, Mycoplasma hyosynoviae',
      'Osteochondrosis, Mycoplasma hyopneumoniae',
      'FMD, Biotin deficiency'
    ],
    answer: 3,
    explain: 'D: Mycoplasma HYOPNEUMONIAE = lung only, ไม่ทำ joint pathology (ต่างจาก M. hyosynoviae/hyorhinis ที่ทำ joint)\n- Osteochondrosis = joint problem ✓\n- A/B/C ทั้งคู่ทำ joint ครบ\n- E: FMD foot lesion + biotin def → lameness ก็เกี่ยวข้อง',
    verified: 'Final Patho prac.pdf p.6' },

  { id: 8223, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['swine', 'enteritis', 'differential'], type: 'mcq',
    q: 'เชื้อในข้อใดที่ ไม่ทำให้ เกิดลำไส้อักเสบในสุกร',
    options: [
      'Isospora suis, Porcine parvovirus, Salmonella spp.',
      'Porcine circovirus type II, Clostridium difficile, Brachyspira pilosicoli',
      'Brachyspira hyodysenteriae, Classical swine fever virus, Candida albicans',
      'Lawsonia intracellularis, Balantidium coli, Porcine epidemic diarrhea virus',
      'Transmissible gastroenteritis virus, E. coli, Trichuris suis'
    ],
    answer: 2,
    explain: 'Candida albicans = oral thrush/esophagitis, ไม่ใช่สาเหตุของ enteritis หลักในสุกร\nA: Isospora (coccidia)/PPV/Salmonella ทำ enteritis ✓\nB: PCV2 (granulomatous enteritis)/C. diff/B. pilosicoli ✓\nD: Lawsonia (PPE)/Balantidium/PED ✓\nE: TGE/ETEC/Trichuris ✓\n→ C ผิด เพราะ Candida',
    verified: 'Final Patho prac.pdf p.6' },

  { id: 8224, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['swine', 'pneumonia', 'pathogenesis'], type: 'mcq',
    q: 'ข้อใด ไม่สัมพันธ์กัน (เชื้อ-target-lesion ในสุกร)',
    options: [
      'PRRSV : Alveolar macrophage : Diffuse pneumonia',
      'Mycoplasma hyopneumoniae : Mucociliary clearance : Cranioventral pneumonia',
      'Pasteurella multocida type D : Turbinate bone : Progressive atrophic rhinitis',
      'Swine influenza virus : Bronchiolar epithelium : Suppurative bronchopneumonia',
      'Actinobacillus pleuropneumoniae : Apx toxin I-IV : focally extensive pleuropneumonia'
    ],
    answer: 3,
    explain: 'SIV → necrotizing BRONCHIOLITIS / bronchointerstitial pneumonia ไม่ใช่ suppurative bronchopneumonia (= bacterial)\nA-E ที่เหลือ match correctly\n→ D ผิด',
    verified: 'Final Patho prac.pdf p.6' },

  { id: 8225, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['hemorrhage', 'lymph-node', 'swine'], type: 'mcq',
    q: 'รอยโรคเลือดออกที่ต่อมน้ำเหลืองสามารถให้การวินิจฉัยแยกแยะเป็นโรคอะไรได้บ้าง',
    options: [
      'Acute classical swine fever',
      'Septicemic salmonellosis',
      'Porcine dermatitis and nephropathy syndrome (PDNS)',
      'Highly pathogenic PRRS virus',
      'ถูกทุกข้อ'
    ],
    answer: 4,
    explain: 'รอยโรค hemorrhagic lymphadenopathy เป็น hallmark ของ:\n- Acute CSF (ขอบ LN แดงเป็น "marbled")\n- Septicemic Salmonella\n- PDNS (PCV2-mediated)\n- HP-PRRS\nทุกข้อเป็น DDx จริง',
    verified: 'Final Patho prac.pdf p.6' },

  { id: 8226, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['swine', 'bloody-diarrhea', 'differential'], type: 'mcq',
    q: 'ข้อใด ไม่ใช่ การวินิจฉัยแยกแยะของการถ่ายเป็นเลือด (bloody diarrhea) ในสุกร',
    options: [
      'Salmonellosis, Swine dysentery',
      'Swine dysentery, Trichuriasis',
      'Hemorrhagic bowel disease, Acute form of porcine proliferative enteropathy',
      'Porcine colonic spirochetosis, Balantidiasis',
      'ผิดทุกข้อ'
    ],
    answer: 4,
    explain: 'Vet 81 commentary: "ในข้อย่อยทั้งหมด ขี้เป็นเลือดได้หมด" → ทุกข้อเป็น DDx of bloody diarrhea จริง\n- Salmonella, Swine dysentery (Brachyspira hyodysenteriae) = bloody\n- Trichuris = bloody (whipworm)\n- HBD, PPE acute = bloody\n- Colonic spirochete + Balantidium = ได้ทั้งคู่ (Balantidium rare แต่ได้)\n→ E "ผิดทุกข้อ" = ไม่มีข้อไหนที่ไม่ใช่ DDx',
    verified: 'Final Patho prac.pdf p.6-7' },

  { id: 8227, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['CSF', 'button-ulcer', 'swine'], type: 'mcq',
    q: 'แผลหลุมเม็ดกระดุม (button ulcer) ที่ลำไส้ใหญ่ในสุกรพบได้บ่อยในโรคใด',
    options: [
      'Colibacillosis / Salmonellosis',
      'Clostridial colitis / Salmonellosis',
      'Chronic form of Classical swine fever / Salmonellosis',
      'Swine dysentery / Colibacillosis',
      'Balantidiosis / Porcine intestinal adenomatosis'
    ],
    answer: 2,
    explain: 'Button ulcer (ulcer แบบ raised edge + central depression) = classic ของ:\n- Chronic CSF (ที่ ileocecal junction)\n- Salmonella choleraesuis (deep button ulcer ใน colon)',
    verified: 'Final Patho prac.pdf p.7' },

  { id: 8228, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['erysipelas','swine'], type: 'mcq',
    q: 'ผ่าซากสุกรพบ Chronic proliferative synovitis, degenerative arthritis และ vegetative valvular endocarditis วินิจฉัยเป็นโรคใด',
    options: [
      'Salmonellosis',
      'Brucellosis',
      'Swine erysipelas',
      'Classical swine fever',
      'Mycoplasma hyosynoviae infection'
    ],
    answer: 2,
    explain: 'Triad classic ของ Swine Erysipelas (Erysipelothrix rhusiopathiae):\n1. Chronic proliferative synovitis\n2. Degenerative arthritis\n3. Vegetative valvular endocarditis (verrucous, mitral valve)\n+ "Diamond skin lesion" acute form',
    verified: 'Final Patho prac.pdf p.7' },

  // ═══════════════════════════════════════════════════════════
  // Avian / Poultry Pathology
  // ═══════════════════════════════════════════════════════════

  { id: 8229, subject: 'livestock-pathology', topic: 'lpath-avian', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['ibd','Gumboro','avian','case'], type: 'mcq',
    q: 'ไก่เนื้ออายุ 4 สัปดาห์ ท้องเสียน้ำสีขาว ตัวสั่น อัมพาตปีก-ขา ตาย 50% ผ่าซากพบจุดเลือดออกที่กระเพาะและต่อมทอนซิลไส้ติ่ง — วินิจฉัยเบื้องต้น',
    options: [
      'Marek\'s disease (lymphoid tumor form)',
      'E. coli infection (Colibacillosis)',
      'Newcastle disease (velogenic form)',
      'Coccidiosis (Eimeria tenella)',
      'Infectious bursal disease (Gumboro)'
    ],
    answer: 4,
    explain: 'Classic IBD presentation:\n- 3-6 wk broiler\n- High mortality (50%)\n- Proventricular-gizzard junction hemorrhage\n- Cecal tonsil hemorrhage\n- Bursa of Fabricius swollen → atrophy\n- Muscle hemorrhage (thigh, breast)\n- Tremors/paralysis = immunosuppression sequelae',
    verified: 'Final Patho prac.pdf p.7' },

  { id: 8230, subject: 'livestock-pathology', topic: 'lpath-avian', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['ibd','IB','avian','differential'], type: 'mcq',
    q: 'ข้อใด ไม่ใช่ รอยโรคของ Infectious bursal disease (IBD)',
    options: [
      'Patchy hemorrhage ที่กล้ามเนื้อขา',
      'การคั่งของ urate ที่ท่อไต',
      'Petechial hemorrhage ที่ bursa of Fabricius',
      'Caseous debris ใน bursa of Fabricius',
      'ถูกทุกข้อ'
    ],
    answer: 1,
    explain: 'Urate cast/deposit ที่ท่อไต = feature ของ Infectious Bronchitis (IB) nephropathogenic strain, ไม่ใช่ IBD\nIBD lesion:\n- Thigh/breast muscle hemorrhage ✓\n- Bursa: petechial hemorrhage → swelling → atrophy + caseous debris ✓\nIB nephropathogenic strain = urolithiasis + visceral gout',
    verified: 'Final Patho prac.pdf p.7' },

  { id: 8231, subject: 'livestock-pathology', topic: 'lpath-avian', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['zoonosis', 'duck-plague', 'general'], type: 'mcq',
    q: 'ข้อใดกล่าวถูกต้อง',
    options: [
      'Trichinellosis เกิดเฉพาะในสุกร ไม่ก่อโรคในคนแม้บริโภคสุกๆดิบๆ',
      'อหิวาต์สุกรก่อ viremia แต่ไม่ใช่สาเหตุของ splenic infarction',
      'Sodium carbonate/hydroxide เป็นยาฆ่าเชื้อที่ไม่เหมาะสมสำหรับ FMD',
      'สุนัขที่กินเนื้อโคที่เป็น Trypanosomiasis จะไม่ติดโรค',
      'Duck plague เป็นโรค พ.ร.บ. โรคระบาดสัตว์ พ.ศ. 2499 เกิดจากเชื้อ herpes virus'
    ],
    answer: 4,
    explain: 'E ถูก: Duck plague = Duck enteritis virus = Anatid alphaherpesvirus 1 (Herpesviridae) + เป็นโรคในบัญชี พ.ร.บ.\nA ผิด: Trichinella spiralis = zoonosis (กินสุกรดิบ → คน)\nB ผิด: CSF ทำให้เกิด splenic infarction (chronic form)\nC ผิด: NaOH/Na2CO3 เป็นยาฆ่าเชื้อที่ดีสำหรับ FMD\nD ผิด: สุนัขกินเนื้อโค Trypanosoma evansi-positive ติดได้ (mechanical)',
    verified: 'Final Patho prac.pdf p.7-8' },

  // ═══════════════════════════════════════════════════════════
  // Diagnostic Reasoning + Sample Collection
  // ═══════════════════════════════════════════════════════════

  { id: 8232, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['diagnostic-reasoning', 'PCR'], type: 'mcq',
    q: 'ข้อใดเป็นการวินิจฉัยโรคที่มี เหตุผลไม่เพียงพอ',
    options: [
      'เป็ดเป็น fowl cholera เพราะพบจุดเลือดออกที่หัวใจ + เนื้อตายที่ตับ + เพาะ Pasteurella multocida ได้',
      'สุนัขเป็น distemper เพราะพบ non-suppurative encephalitis + spongiosis of myelin sheath',
      'โคเป็นวัณโรค เพราะ tuberculin skin test บวก + พบ granuloma ที่ LN ขั้วปอด',
      'สุกรเป็น streptococcal meningitis เพราะพบ suppurative meningitis + แยกเชื้อ Streptococcus ได้จากสมอง',
      'สุกรเป็น PCVAD เพราะ PCR positive จาก LN แม้ไม่มีรอยโรคใด ๆ'
    ],
    answer: 4,
    explain: 'E ไม่เพียงพอ: PCV2 พบเป็น ubiquitous ในประชากรสุกรปกติ (subclinical infection) — PCR positive อย่างเดียวไม่บอกว่าเป็น PCVAD\n→ ต้องมี clinical sign + characteristic lesion (lymphocyte depletion + botryoid IB) ร่วม\nข้ออื่น A-D = combined evidence (clinical + lesion + culture/test) เพียงพอ',
    verified: 'Final Patho prac.pdf p.8' },

  { id: 8233, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['hemorrhagic-septicemia', 'buffalo', 'Pasteurella', 'case'], type: 'mcq',
    q: 'กระบือ 3 ปี ป่วยเฉียบพลัน ไข้สูง หอบ บวมน้ำใต้คอ-ใต้ผิวหนัง จุดเลือดออกที่ผิวหนังท้อง — ฝูงเดียวกันตายเมื่อวาน 2 ตัว ชันสูตรพบเลือดออกตามอวัยวะภายใน + hemorrhagic enteritis + blood-tinged fluid ในช่องอก/ช่องท้อง + subcutaneous edema — โรคใด',
    options: [
      'Bovine tuberculosis',
      'Hemorrhagic septicemia (HS)',
      'Septicemic salmonellosis',
      'Blackleg (Clostridium chauvoei)',
      'Malignant catarrhal fever (MCF)'
    ],
    answer: 1,
    explain: 'Classic HS (Pasteurella multocida B:2 ในเอเชีย):\n- กระบือ, peracute fever\n- Subcutaneous edema (submandibular, brisket)\n- Hemorrhagic LN, lung, viscera\n- Blood-tinged effusion ช่องอก/ช่องท้อง\n- Mortality สูง, ฝูงตายพร้อมกัน\nBlackleg = young cattle, muscle gas\nMCF = upper resp + ocular',
    verified: 'Final Patho prac.pdf p.8' },

  { id: 8234, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['tuberculosis', 'special-stain', 'ruminant'], type: 'mcq',
    q: 'พบต่อมน้ำเหลืองขั้วปอด/ลำไส้แข็ง ขยายใหญ่ หน้าตัดเป็นหนองแข็งในโคนม — โรค + สีพิเศษย้อมเชื้อ',
    options: [
      'Glanders : Giemsa\'s stain',
      'Actinomycosis : Diff-Quik',
      'Tuberculosis : Acid-fast stain',
      'Streptococcosis : Gram stain',
      'Actinomycosis : Gram stain'
    ],
    answer: 2,
    explain: 'Bovine TB (Mycobacterium bovis) → caseous + calcifying granuloma ที่ LN (Mediastinal/bronchial/mesenteric)\nStain: Acid-fast (Ziehl-Neelsen) → AFB เป็น pink rod-shaped\nGlanders (B. mallei) = ม้า ไม่ใช่โค\nActinomycosis = "lumpy jaw" ใน mandible, Gram positive ไม่ใช่ AF',
    verified: 'Final Patho prac.pdf p.8' },

  { id: 8235, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['PU-PD', 'differential'], type: 'mcq',
    q: 'โรคใดต่อไปนี้ ที่ไม่ พบกลุ่มอาการ PU/PD (polyuria, polydipsia)',
    options: [
      'Renal failure',
      'Pyometra',
      'Cushing\'s syndrome',
      'Liver failure',
      'ผิดทุกข้อ เพราะพบหมด'
    ],
    answer: 3,
    explain: 'Vet 81 group ตอบ D (Liver failure ไม่ทำ PU/PD) — commentary "ผิดทุกข้อ*เพราะพบหมด" → ปอเลือก E\nReal answer: Liver failure CAN cause PU/PD ผ่าน:\n- ลด urea synthesis → medullary washout → reduced concentrating ability\n- Hepatic encephalopathy → polydipsia\n→ ทุกข้อทำ PU/PD ได้ → E ถูกต้องทางตำรา\n→ Flag (Vet 81 ตอบ D, ปอ + textbook ตอบ E)',
    verified: 'Final Patho prac.pdf p.8-9',
    flag: { note: 'Vet 81 group ตอบ D (Liver failure) แต่ commentary พี่ปอ + textbook ตอบ E (ผิดทุกข้อ เพราะ liver failure ก็ทำ PU/PD ได้)', sources: ['Final Patho prac.pdf p.8-9'], severity: 'major' } },

  { id: 8236, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['gastric-ulcer', 'swine'], type: 'mcq',
    q: 'ข้อใด ไม่ถูกต้อง เกี่ยวกับการเกิดแผลหลุมในกระเพาะอาหารของสุกร (gastric ulcer)',
    options: [
      'สามารถพบในสุกรที่เป็น PCVAD',
      'เป็น multifactorial causes',
      'Helicobacter heilmannii เป็นสาเหตุหนึ่ง',
      'Particle size ของอาหารเล็กเกินไป หรืออาหาร rancid fat โน้มนำ',
      'มักเกิดที่ส่วน pylorus เช่นเดียวกับ gastric ulcer ในสุนัข'
    ],
    answer: 4,
    explain: 'Gastric ulcer ในสุกร → เกิดที่ PARS ESOPHAGEA (non-glandular squamous region รอบ esophageal entrance) ไม่ใช่ pylorus\nGastric ulcer ในสุนัข = pylorus / pyloric antrum (กรดที่ความเข้มข้นสูงสุด)\nA-D = multifactorial pathogenesis ถูกต้อง',
    verified: 'Final Patho prac.pdf p.9' },

  { id: 8237, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['dermatophytosis', 'zoonosis', 'case'], type: 'mcq',
    q: 'สุนัขเทอร์เรียคันรุนแรง ขนร่วงเป็นวง สีแดง สะเก็ดที่ผิว เลี้ยงปนกับแมวที่มีอาการคล้าย — วินิจฉัยเบื้องต้น',
    options: [
      'Malassezia pachydermatis infection',
      'Dermatophytosis',
      'Sarcoptic mange',
      'Dermatophytic pseudomycetoma',
      'Generalized demodicosis'
    ],
    answer: 1,
    explain: 'Classical dermatophytosis (Microsporum canis):\n- "ring worm" = วงๆ ของขนร่วง\n- คันได้, มี scale\n- ติดได้ระหว่างสุนัข-แมว-คน (zoonosis)\n- Terrier susceptible\n- Pseudomycetoma = deep dermatophyte (rare, Persian cat ส่วนใหญ่)\nMalassezia = greasy seborrhea',
    verified: 'Final Patho prac.pdf p.9' },

  { id: 8238, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['TVT', 'tumor', 'case'], type: 'mcq',
    q: 'สุนัขเพศผู้ 10 ปี ถูกตีที่จมูก รักษา ABO + anti-inflammatory 1 เดือน ก้อนดั้งจมูกโตเรื่อยๆ ดันตา ผ่าซากพบเนื้องอกที่หนังหุ้มลึงค์ (ดอกกะหล่ำ) และก้อนดั้งจมูก 10 cm — ข้อใดกล่าวผิด',
    options: [
      'เนื้องอกของสุนัขนี้คือ Transmissible venereal tumor (TVT)',
      'สุนัขมีภาวะกดภูมิคุ้มกัน',
      'เนื้องอกแพร่กระจายไปดั้งจมูกผ่านกระแสเลือดและน้ำเหลือง',
      'อาจตายจากการติดเชื้อเรื้อรัง',
      'เนื้องอกอาจหายได้เอง (spontaneous regression)'
    ],
    answer: 2,
    explain: 'TVT spread = direct contact / IMPLANTATION (เซลล์เนื้องอกย้ายตัวเองทางผิวสัมผัส mucous membrane) ไม่ใช่ hematogenous/lymphatic\n→ การแพร่ไปดั้งจมูก = transplantation จากการเลีย/สัมผัส (sniffing)\nA: TVT ✓ (cauliflower-like at penile sheath, "ดอกกะหล่ำ")\nB: immunosuppression → grow uncontrolled\nD: secondary infection → death\nE: spontaneous regression ใน immunocompetent dog ภายในเดือน',
    verified: 'Final Patho prac.pdf p.9' },

  { id: 8239, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['PMWS', 'PCV2', 'sampling'], type: 'mcq',
    q: 'เก็บตัวอย่างส่งตรวจ histo เพื่อพิสูจน์ Post-weaning multisystemic wasting syndrome (PMWS) ในสุกร — ควรเก็บตัวอย่างใด',
    options: [
      'ต่อมน้ำเหลือง กระเพาะอาหาร และไต',
      'ลำไส้ส่วน ileum + ต่อมทอนซิล + ต่อมน้ำเหลือง + ปอด',
      'ลำไส้ส่วน ileum + ไต + กระเพาะอาหาร + ปอด',
      'ต่อมน้ำเหลือง + กระเพาะอาหาร + ม้าม + หัวใจ',
      'ตับ + ม้าม + หัวใจ + ผิวหนัง'
    ],
    answer: 1,
    explain: 'PMWS (PCV2) target tissues:\n- Lymphoid: tonsil, mesenteric LN, spleen, Peyer\'s patches → granulomatous lymphadenitis + botryoid IB\n- Lung: bronchointerstitial pneumonia + granuloma\n- Ileum: lymphoid follicle ที่ Peyer\'s patch\n→ B (ileum + tonsil + LN + lung) ครบ key tissue\nข้ออื่นขาดส่วน lymphoid หรือ pulmonary',
    verified: 'Final Patho prac.pdf p.10' },

  { id: 8240, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['BSE', 'prion'], type: 'mcq',
    q: 'ข้อใดต่อไปนี้ ไม่ถูกต้อง เกี่ยวกับโรควัวบ้า (Mad cow disease / BSE)',
    options: [
      'จัดอยู่ในกลุ่มโรค Transmissible spongiform encephalopathies (TSE)',
      'สามารถติดต่อและก่อโรค variant Creutzfeldt-Jakob disease (vCJD) ในคนได้',
      'เก็บเนื้อเยื่อ obex เพื่อตรวจทางห้องปฏิบัติการ โดยเก็บผ่าน foramen magnum',
      'รอยโรคทางจุลพยาธิเด่น คือ Neuronal vacuolation และ spongiosis',
      'เกิดจากเชื้อไวรัส ชื่อ Prion'
    ],
    answer: 4,
    explain: 'Prion = "proteinaceous infectious particle" ไม่ใช่ไวรัส (ไม่มี nucleic acid)\nPrion = PrP^Sc (misfolded prion protein) เปลี่ยน PrP^C ปกติ → propagation\nA-D ถูกต้องทั้งหมด:\n- BSE/scrapie/CWD/CJD = TSE family\n- vCJD ในคน link กับ BSE จากการบริโภคเนื้อ\n- Obex = sample of choice (สำหรับ surveillance)\n- Histology: neuronal vacuolation + spongiosis (no inflammation!)',
    verified: 'Final Patho prac.pdf p.10' },

  { id: 8241, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['PCV2', 'PRDC', 'differential'], type: 'mcq',
    q: 'ข้อใด ไม่ใช่ รอยโรคที่เกิดจากการติดเชื้อ Porcine circovirus type II (PCV2)',
    options: [
      'PMWS, Necrotizing vasculitis',
      'PDNS, Reproductive failure',
      'Porcine respiratory disease complex (PRDC), Proliferative and necrotizing pneumonia (PNP)',
      'Hepatitis, Congenital tremor',
      'ผิดทุกข้อ'
    ],
    answer: 4,
    explain: 'PCV2 spectrum (PCVAD) ครอบคลุม:\n- PMWS (lymphoid + multi-systemic)\n- PDNS (Type III hypersensitivity → necrotizing vasculitis + glomerulonephritis)\n- Reproductive failure (mummies, stillborn)\n- PRDC + PNP\n- Hepatitis\n- Congenital tremor (PCV3, also PCV2-associated)\n→ ทุกข้อเป็น PCV2 จริง → E "ผิดทุกข้อ" = ไม่มีข้อไหนที่ไม่ใช่ PCV2',
    verified: 'Final Patho prac.pdf p.10' },

  { id: 8242, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['AIHA','coombs','diagnostics'], type: 'mcq',
    q: 'การวินิจฉัย Autoimmune hemolytic anemia (AIHA) ในสุนัข ควรตรวจอะไรเพิ่มเติมนอกจากโลหิตวิทยา',
    options: [
      'Red blood cell index',
      'Erythrocyte sedimentation rate (ESR)',
      'Clotting time',
      'Coombs\' test',
      'Polymerase chain reaction'
    ],
    answer: 3,
    explain: 'Coombs\' test (direct antiglobulin test, DAT) = ตรวจหา anti-RBC antibody bound ผิว RBC\n→ Gold standard ยืนยัน immune-mediated hemolysis\nSupporting: spherocytosis ใน blood smear + autoagglutination',
    verified: 'Final Patho prac.pdf p.10-11' },

  { id: 8243, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['Johne', 'paratuberculosis', 'bovine', 'case'], type: 'mcq',
    q: 'โคขุน 3 ปี ถ่ายเหลวเรื้อรัง ผอมโทรม ชันสูตรพบ subcutaneous edema คอ + jejunum/ileum หนาตัว + LN ขั้วไส้โตเดียว — วินิจฉัย + เก็บตัวอย่าง',
    options: [
      'Bovine leucosis : เก็บ LN ส่งตรวจ',
      'Bovine tuberculosis : เก็บ LN ส่งตรวจ',
      'Bovine paratuberculosis : เก็บ jejunum + ileum ส่งตรวจ',
      'Bovine salmonellosis : เก็บ jejunum + ileum ส่งตรวจ',
      'Bovine paratuberculosis : เก็บ LN ส่งตรวจ'
    ],
    answer: 2,
    explain: 'Johne\'s disease (Mycobacterium avium subsp. paratuberculosis):\n- Chronic granulomatous enteritis → mucosal thickening + "corrugated" appearance ของ ileum + jejunum\n- Submandibular edema + hypoproteinemia + emaciation\nSample = ใน MUCOSA ของ jejunum/ileum (ที่ acid-fast bacilli อยู่หนาแน่น) + mesenteric LN\n→ C เก็บลำไส้ตรงจุด (LN ก็เก็บได้ แต่ลำไส้ดีกว่า)',
    verified: 'Final Patho prac.pdf p.11' },

  { id: 8244, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['toxicology', 'gross-pathology'], type: 'mcq',
    q: 'ข้อใด ไม่ใช่ รอยโรคที่น่าสงสัยว่าสัตว์ได้รับสารพิษ',
    options: [
      'จุดเลือดออกที่ผิวหนังและอวัยวะภายใน',
      'น้ำดีคั่งในถุงน้ำดี + บวมน้ำใต้เยื่อบุถุงน้ำดี',
      'มีอาหารสะสมในกระเพาะอาหาร (sudden death)',
      'ถูกทุกข้อ',
      'ผิดทุกข้อ (เพราะทุกข้อเป็นอาการของสัตว์ได้รับสารพิษ)'
    ],
    answer: 4,
    explain: 'Toxicology gross findings ที่ classic:\n- Hemorrhage (anticoagulant rodenticide, ITP)\n- Bile retention + GB wall edema (hepatotoxin)\n- Sudden death + full stomach = peracute toxicity\n→ ทุกข้อ A-C เป็น sign of toxicosis ได้ → E "ผิดทุกข้อ" = ไม่มีข้อใดที่ไม่ใช่ sign',
    verified: 'Final Patho prac.pdf p.11' },

  { id: 8245, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['heart-failure', 'circulation'], type: 'mcq',
    q: 'สัตว์ที่ตายด้วย chronic right heart failure สามารถพบรอยโรคทางมหพยาธิอะไรได้บ้าง',
    options: [
      'Nutmeg liver, Hydrothorax',
      'Ascites, Subcutaneous edema',
      'Right heart dilation, Hydroperitoneum',
      'ไม่มีรอยโรคที่ชัดเจน',
      'ถูกทั้ง A, B, C'
    ],
    answer: 4,
    explain: 'Chronic R-side HF = systemic venous congestion → fluid in cavities + ทั่วร่างกาย:\n- Nutmeg liver (chronic passive congestion of liver)\n- Hydrothorax, Hydroperitoneum (ascites)\n- Subcutaneous edema (dependent)\n- R-heart dilation/hypertrophy\n→ ทุกข้อเป็นรอยโรค',
    verified: 'Final Patho prac.pdf p.11' },

  { id: 8246, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['swine','pneumonia','salmonella'], type: 'mcq',
    q: 'แบคทีเรียชนิดใดในสุกรที่ก่อรอยโรคปอดคล้าย viral pneumonia (diffuse pneumonia)',
    options: [
      'Pasteurella multocida',
      'Salmonella choleraesuis',
      'Streptococcus suis serotype 2',
      'Mycoplasma hyopneumoniae',
      'Actinobacillus pleuropneumoniae'
    ],
    answer: 1,
    explain: 'Salmonella choleraesuis → diffuse interstitial pneumonia + septicemic (เหมือน viral pattern เพราะ hematogenous spread ไม่ใช่ aerogenous)\n- Pasteurella/Mycoplasma/App = cranioventral lobar / fibrinous (bacterial pattern)\n- Strep suis = meningitis หลัก',
    verified: 'Final Patho prac.pdf p.11' },

  { id: 8247, subject: 'livestock-pathology', topic: 'lpath-avian', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['fowl-cholera', 'avian', 'diagnostics'], type: 'mcq',
    q: 'สงสัยสัตว์ปีก fowl cholera — วิธีวินิจฉัยที่เหมาะสมที่สุด',
    options: [
      'เก็บชิ้นเนื้อตรวจ multifocal coagulative necrosis of liver',
      'เพาะเชื้อ Pasteurella multocida จากตับ',
      'ฉีดเลือดไก่เข้าหนูทดลองและสังเกตอาการ 24-48 ชม.',
      'เพาะเชื้อ Pasteurella multocida จากการป้ายถุงลม',
      'ทำได้ทุกข้อที่กล่าวมา'
    ],
    answer: 1,
    explain: 'Liver = primary target of fowl cholera (septicemic spread) → multifocal hepatic necrosis + culture P. multocida\nLiver bacterial culture เป็น gold standard practical (เนื้อเยื่อปลอดเชื้ออื่นๆ ระบบ confirm sensitivity ได้)\nหนูทดลอง = obsolete (mouse inoculation test)\nAir sac swab = สำหรับ chronic respiratory dz มากกว่า',
    verified: 'Final Patho prac.pdf p.11-12' },

  { id: 8248, subject: 'livestock-pathology', topic: 'lpath-avian', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['Marek', 'leukosis', 'avian'], type: 'mcq',
    q: 'ข้อใดกล่าว ไม่ถูกต้อง เกี่ยวกับโรคเนื้องอกในไก่',
    options: [
      'เนื้องอกที่ม้ามเกิดได้จากทั้ง Avian leukosis (AL) และ Marek\'s disease (MD)',
      'Marek\'s disease ทำให้เกิดก้อนเนื้องอกที่รูขุมขน (feather follicle) ได้',
      'เนื้องอกที่เส้นประสาทแยก AL จาก MD ได้',
      'ทั้ง AL และ Marek\'s disease แพร่โรคโดย vertical transmission ได้เหมือนกัน',
      'Avian leukosis เกิดจาก RNA virus ขณะที่ Marek\'s disease เกิดจาก DNA virus'
    ],
    answer: 3,
    explain: 'Marek\'s disease (MDV, Herpesvirus) = HORIZONTAL transmission ผ่าน dander/feather follicle epithelium (ฝุ่นขนนก)\nAvian leukosis (ALV, Retrovirus) = VERTICAL + horizontal\n→ MD ไม่ได้แพร่ vertical (D ผิด)\nA: ม้ามใหญ่ขึ้นจาก lymphoid tumor ของทั้งคู่ ✓\nB: MD ที่ feather follicle ✓ (cutaneous form)\nC: Nerve enlargement = MD signature (sciatic), AL ไม่เกี่ยว ✓\nE: ALV = RNA retrovirus, MDV = DNA herpesvirus ✓',
    verified: 'Final Patho prac.pdf p.12' },

  { id: 8249, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['Actinobacillus', 'bovine', 'case'], type: 'mcq',
    q: 'โคนม 3 เดือน พบก้อนใต้คางขนาดผลแอปเปิ้ลแข็ง CBC: leukocytosis with neutrophilia + left shift (band 7%). เจาะพบหนองเหลืองข้นมีก้อนคล้ายทราย ข้อใดถูกต้อง',
    options: [
      'Leukocytosis shifts to the right (เพราะ band 7%)',
      'สงสัย Actinomycosis เกิดจากเชื้อ Actinobacillus bovis',
      'Impression smear จากหนองย้อม Ziehl-Neelsen พบ acid-fast bacilli',
      'เก็บหนองแช่แข็งเพื่อส่งตรวจห้องปฏิบัติการ',
      'ผิดทุกข้อ'
    ],
    answer: 4,
    explain: 'A ผิด: band 7% = LEFT shift (immature neutrophil) ไม่ใช่ right shift\nB ผิด: Actinobacillosis (woody tongue, granuloma soft tissue) = Actinobacillus lignieresii (Gram-)\n     Actinomycosis (lumpy jaw, bone) = Actinomyces bovis (Gram+)\n     ก้อนใต้คาง soft tissue + sulfur granule = Actinobacillosis มากกว่า\nC ผิด: ไม่ใช่ acid-fast — ใช้ Gram stain (Gram+ rod คือ Actinomyces, Gram- rod คือ Actinobacillus)\nD ผิด: ไม่ควรแช่แข็ง — เก็บใน transport medium / สดส่ง\n→ E ผิดทุกข้อ ถูกต้อง',
    verified: 'Final Patho prac.pdf p.12' },

  // ═══════════════════════════════════════════════════════════
  // Parasitology + Microbiology Methods
  // ═══════════════════════════════════════════════════════════

  { id: 8250, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['fluke', 'fecal-exam'], type: 'mcq',
    q: 'การตรวจหาไข่พยาธิใบไม้ที่มีฝาเปิดในตัวอย่างอุจจาระ — วิธีใดที่ ไม่น่าเลือก ใช้',
    options: [
      'Simple flotation technique',
      'Simple sedimentation technique',
      'Beads sedimentation technique',
      'Fluke finder',
      'McMaster method'
    ],
    answer: 0,
    explain: 'Trematode (fluke) eggs = HEAVY ไข่ใหญ่ + operculate + specific gravity สูง → ไม่ลอย ใน flotation solution (sg ~1.18-1.30)\n→ Simple flotation = FALSE NEGATIVE สำหรับ fluke\nวิธีที่ใช้: sedimentation, fluke finder (เครื่อง centrifuge เฉพาะ), modified Stoll\nMcMaster = egg count quantitative (เห็น strongyle, ascarid, ไม่ใช่ fluke เป็นหลัก)',
    verified: 'Final Patho prac.pdf p.12-13' },

  { id: 8251, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['blood-parasite', 'sample-storage'], type: 'mcq',
    q: 'ตัวอย่างเลือดสำหรับตรวจปรสิตในเลือดควรเก็บอย่างไร',
    options: [
      'แช่ตู้เย็น 2-4°C ไม่เกิน 24 ชั่วโมง',
      'อุณหภูมิห้องไม่เกิน 48 ชั่วโมง',
      'แช่แข็งเก็บไว้ได้นาน 48 ชั่วโมง',
      'อุณหภูมิห้องไม่เกิน 24 ชั่วโมง',
      'แช่ตู้เย็น 2-4°C เกิน 24 ชั่วโมง'
    ],
    answer: 0,
    explain: 'Hemoparasite (Babesia, Anaplasma, microfilaria) สด → preserve morphology + viability\n→ แช่ตู้เย็น 2-4°C ภายใน 24 ชม.\nFreeze → lyse RBC + ทำลาย parasite morphology\nRoom temp → bacterial overgrowth + parasite degeneration',
    verified: 'Final Patho prac.pdf p.13' },

  { id: 8252, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['strongyle', 'sheep', 'parasitology'], type: 'mcq',
    q: 'พยาธิ Strongyle ที่สำคัญในแกะมีดังต่อไปนี้ ยกเว้นข้อใด',
    options: [
      'Haemonchus contortus',
      'Oesophagostomum spp.',
      'Cooperia spp.',
      'Mecistocirrus digitatus',
      'Moniezia spp.'
    ],
    answer: 4,
    explain: 'Moniezia = TAPEWORM (Cestoda), ไม่ใช่ Strongyle (Nematoda)\nGI strongyle ในแกะ:\n- Haemonchus contortus (barber pole worm, abomasum)\n- Oesophagostomum (nodular worm, colon)\n- Cooperia (small intestine)\n- Mecistocirrus (abomasum)',
    verified: 'Final Patho prac.pdf p.13' },

  { id: 8253, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['ehrlichiosis', 'canine', 'diagnostics'], type: 'mcq',
    q: 'ข้อใดต่อไปนี้ ไม่ใช่ วิธีการวินิจฉัยโรค Canine ehrlichiosis',
    options: [
      'History and clinical sign',
      'Body temperature',
      'Blood examination (Buffy coat smear)',
      'Laboratory data (CBC, biochemistry)',
      'Snap 4DX'
    ],
    answer: 1,
    explain: 'Body temperature alone = non-specific (ไข้เกือบทุกโรค) ไม่ diagnostic\nA: Hx + tick exposure ✓\nC: Buffy coat smear → morula in monocyte (E. canis) ✓\nD: thrombocytopenia + pancytopenia + hyperglobulinemia ✓\nE: Snap 4DX = serology (Ab) ✓',
    verified: 'Final Patho prac.pdf p.13' },

  { id: 8254, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['Pythium', 'Prototheca', 'canine', 'case'], type: 'mcq',
    q: 'สุนัขคอลลี่ 2 ปี เลี้ยงปล่อย ฉีดวัคซีนครบ ท้องเสียเลือด 1 สัปดาห์ ตรวจอุจจาระพบสิ่งมีชีวิตรูปร่างกลม/เมล็ดถั่ว มีแคปซูลใส ให้ Enrofloxacin ไม่ตอบสนอง — เพราะติดเชื้ออะไร',
    options: [
      'Canine parvovirus',
      'Prototheca spp.',
      'Herpes virus',
      'Balantidium coli',
      'Toxocara canis'
    ],
    answer: 1,
    explain: 'Vet 81 ตอบ B (Prototheca) — Pee Por commentary แย้งว่าอาจเป็น "PYTHIUM"\nClinical (collie outdoor + bloody diarrhea + capsulated organism + no response to enrofloxacin) เข้าได้ทั้ง:\n- Prototheca = colorless algae, round/oval ขนาดเล็ก, แคปซูลใส, antibiotic ไม่ตอบสนอง\n- Pythium = oomycete, GI granuloma + bloody diarrhea, antibiotic ไม่ตอบสนอง\nMorphology "เมล็ดถั่ว + capsule ใส" → Prototheca มากกว่า (Pythium = hyphae, ไม่ใช่ round)\n→ B (Prototheca)',
    verified: 'Final Patho prac.pdf p.13',
    flag: { note: 'Vet 81 ตอบ Prototheca, commentary พี่ปอ ชี้ Pythium — morphology "round + capsule" เข้า Prototheca มากกว่า', sources: ['Final Patho prac.pdf p.13'], severity: 'minor' } },

  // ═══════════════════════════════════════════════════════════
  // Aquaculture Pathology
  // ═══════════════════════════════════════════════════════════

  { id: 8255, subject: 'livestock-pathology', topic: 'lpath-avian', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['AHPND', 'shrimp', 'Vibrio'], type: 'mcq',
    q: 'Acute Hepatopancreatic Necrosis Disease (AHPND) ในกุ้ง สาเหตุเกิดจาก',
    options: [
      'Vibrio parahaemolyticus',
      'Enterocytozoon hepatopenaei',
      'White spot syndrome virus',
      'Gregarines protozoa'
    ],
    answer: 0,
    explain: 'AHPND (EMS, Early Mortality Syndrome) = Vibrio parahaemolyticus carrying PirAB^vp toxin gene (plasmid)\n→ Hepatopancreas (HP) necrosis + early mortality 30-35 days post-stocking\n- E. hepatopenaei = microsporidian, slow growth\n- WSSV = white spot virus\n- Gregarines = white feces syndrome',
    verified: 'Final Patho prac.pdf p.13' },

  { id: 8256, subject: 'livestock-pathology', topic: 'lpath-avian', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['WFS', 'shrimp', 'Gregarines'], type: 'mcq',
    q: 'โรคขี้ขาวในกุ้ง (White Feces Syndrome, WFS) เกิดจากสาเหตุใด',
    options: [
      'Gregarines protozoa',
      'Aggregated transformed microvilli (ATM)',
      'Hepatopancreatic haplosporidiosis (HPH)',
      'Covert mortality disease'
    ],
    answer: 0,
    explain: 'WFS = ขี้กุ้งสีขาวลอย, hepatopancreas เสียหาย\nสาเหตุหลัก = Gregarines (protozoa) ใน HP tubule\n- ATM = ลักษณะ histo ของ microvilli ที่ปนเปลี่ยน (อาจเป็นรอยโรคไม่ใช่สาเหตุ)\n- HPH/Covert mortality = โรคอื่น',
    verified: 'Final Patho prac.pdf p.13-14' },

  { id: 8257, subject: 'livestock-pathology', topic: 'lpath-avian', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['KHV', 'carp', 'fish-pathology'], type: 'mcq',
    q: 'ข้อใดเป็นลักษณะจำเพาะของ Koi Herpesvirus (KHV) ในปลาคาร์พ',
    options: [
      'Granulomatous inflammation in spleen',
      'Non-suppurative meningoencephalitis',
      'Intranuclear IB ใน gill epithelium',
      'Vasculitis-perivasculitis change'
    ],
    answer: 2,
    explain: 'KHV (CyHV-3) → gill necrosis + "signet ring" appearance ของ branchial epithelial cells/leukocytes:\n- Nuclear swelling\n- Margination of chromatin\n- Pale diffuse eosinophilic intranuclear inclusion\nHallmark histology — diagnostic',
    verified: 'Final Patho prac.pdf p.13-14' },

  { id: 8258, subject: 'livestock-pathology', topic: 'lpath-avian', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['WTD', 'shrimp', 'nodavirus'], type: 'mcq',
    q: 'โรค White tail disease ในกุ้งก้ามกราม (Macrobrachium rosenbergii) สาเหตุเกิดจาก',
    options: [
      'Microsporidiosis',
      'Abdominal segment deformity disease (ASDD)',
      'Infectious myonecrosis virus (IMNV)',
      'Macrobrachium rosenbergii nodavirus (MrNV)'
    ],
    answer: 3,
    explain: 'WTD = MrNV + extra small virus (XSV) co-infection\n→ Whitish opaque tail (abdominal muscle necrosis)\nIMNV = ใน Penaeus vannamei (ไม่ใช่ Macrobrachium)\nMicrosporidiosis = E. hepatopenaei',
    verified: 'Final Patho prac.pdf p.14' },

  // ═══════════════════════════════════════════════════════════
  // Hematology + Coagulation + Postmortem Protocol
  // ═══════════════════════════════════════════════════════════

  { id: 8259, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['D-dimer', 'fibrinolysis', 'coagulation'], type: 'mcq',
    q: 'การตรวจค่าใดในห้องปฏิบัติการจำเพาะกับการเกิด Fibrinolysis มากที่สุด',
    options: [
      'D-Dimer',
      'Plasmin',
      'Fibrin degradation products (FDPs)',
      'Fibrinogen'
    ],
    answer: 0,
    explain: 'D-Dimer = specific marker of FIBRIN breakdown (จาก crosslinked fibrin) → จำเพาะกับ secondary fibrinolysis (e.g., DIC, thromboembolism)\nFDPs = fibrinogen หรือ fibrin breakdown — sensitive แต่ less specific\nPlasmin = enzyme ไม่ใช่ marker\nFibrinogen = ระดับลดลงใน DIC แต่ไม่จำเพาะกับ fibrinolysis',
    verified: 'Final Patho prac.pdf p.14' },

  { id: 8260, subject: 'livestock-pathology', topic: 'lpath-slaughter', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['necropsy', 'protocol', 'fixative'], type: 'mcq',
    q: 'ข้อใดกล่าวถึงขั้นตอนการชันสูตรซากได้อย่างเหมาะสมที่สุด',
    options: [
      'ทราบ signalment + อ่านประวัติ → ตรวจสอบชื่อบนซาก → ชันสูตร → เก็บอวัยวะใน 70% แอลกอฮอล์ → เก็บล้าง → เขียน macroscopic findings',
      'ทราบ signalment + อ่านประวัติ → ตรวจสอบชื่อบนซาก → ชันสูตร → เก็บอวัยวะใน 10% buffered formalin → เก็บล้าง → เขียน macroscopic findings',
      'ทราบ signalment + อ่านประวัติ → ตรวจสอบชื่อบนซาก → ชันสูตร → เก็บล้าง → เก็บอวัยวะใน 10% buffered formalin → เขียน macroscopic findings',
      'ทราบ signalment + อ่านประวัติ → ตรวจสอบชื่อบนซาก → ชันสูตร → เขียน macroscopic findings → เก็บอวัยวะใน 10% buffered formalin → เก็บล้าง'
    ],
    answer: 1,
    explain: 'Necropsy protocol ที่ถูกต้อง:\n1. Signalment + Hx\n2. Verify ID บนซาก\n3. ทำชันสูตร\n4. เก็บอวัยวะใน 10% buffered formalin (ไม่ใช่ 70% alcohol = fixative ผิด)\n5. ล้างซาก/area\n6. บันทึก gross findings\n→ B ถูกที่สุด\n- A ผิดเพราะใช้ 70% alcohol\n- C เก็บล้างก่อน fix = ไม่ optimal (ทิ้งของก่อน fix)\n- D เขียน findings ก่อน fix = ทำงาน flow ไม่ถูก',
    verified: 'Final Patho prac.pdf p.14' },

  { id: 8261, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['reticulocyte', 'hematology', 'feline'], type: 'mcq',
    q: 'ข้อใดถูกต้องเกี่ยวกับ Reticulocyte',
    options: [
      'สุนัขไม่มี Punctate reticulocyte',
      'Reticulocyte คือเซลล์เม็ดเลือดแดงที่เป็น Macrocyte',
      'ค่า Aggregate reticulocyte เท่านั้นที่มีประโยชน์ในการแปลผลเลือดในแมว',
      'การพบ Punctate reticulocyte ในแมวบ่งบอกว่ามีการสร้างเม็ดเลือดแดงในช่วง 3 อาทิตย์ที่ผ่านมา'
    ],
    answer: 2,
    explain: 'แมวมี reticulocyte 2 รูปแบบ:\n- Aggregate retic (newer, <12 hr after release) = นับสำหรับ regenerative response\n- Punctate retic (older, persists 7-21 days) = อยู่นานในเลือด, ไม่บ่ง regeneration ปัจจุบัน\n→ ใช้เฉพาะ aggregate retic ในการประเมิน regenerative response\nA ผิด: สุนัขมีทั้ง 2 รูปแบบ (Macrocytic polychromatophil = aggregate-like)\nB ผิด: Retic คือ immature RBC ที่ stained with new methylene blue → reticular pattern; ไม่ใช่ทุกตัวเป็น macrocyte\nD ส่วน punctate retic บ่ง erythropoiesis 7-21 วันก่อน (ไม่ใช่ 3 สัปดาห์เป๊ะ) — แต่ถูกในแง่ time window',
    verified: 'Final Patho prac.pdf p.15' },

  { id: 8262, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['crossmatch', 'transfusion', 'anticoagulant'], type: 'mcq',
    q: 'หลอดเก็บเลือดที่มีสารกันเลือดแข็งตัวชนิดใด เพื่อตรวจความเข้ากันได้ของเลือดก่อนถ่ายเลือด',
    options: [
      'EDTA',
      'Sodium citrate',
      'Lithium heparin',
      'No anticoagulant'
    ],
    answer: 0,
    explain: 'Crossmatch + blood typing → ใช้ EDTA (purple top) — ป้องกัน coagulation + preserve RBC morphology\nSodium citrate (blue) = coagulation testing\nHeparin (green) = chemistry\nNo anticoag (red) = serum chemistry',
    verified: 'Final Patho prac.pdf p.15' },

  { id: 8263, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['hemolysis', 'RBC-morphology'], type: 'mcq',
    q: 'Red blood cell morphology ในข้อใดบ่งบอกการเกิด intravascular hemolysis',
    options: [
      'Ghost cell',
      'Spherocyte',
      'Heinz body',
      'Howell-Jolly body'
    ],
    answer: 0,
    explain: 'Ghost cell = RBC ที่ Hb หลุดออกหมด เหลือเฉพาะ membrane → intravascular hemolysis classic\nSpherocyte = IMHA (extravascular hemolysis ที่ spleen)\nHeinz body = oxidative damage (onion/garlic, acetaminophen)\nHowell-Jolly = nuclear remnant in regenerative anemia/splenectomy',
    verified: 'Final Patho prac.pdf p.15' },

  { id: 8264, subject: 'livestock-pathology', topic: 'lpath-slaughter', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['necropsy', 'protocol', 'sample-collection'], type: 'mcq',
    q: 'ระหว่างชันสูตรซากพบหนองในช่องท้อง — สัตวแพทย์ท่านใดปฏิบัติงานเหมาะสมที่สุด',
    options: [
      'สพ.ญ.ลิซ่า ถ่ายรูป + จดสีและปริมาตรของน้ำใน gross findings',
      'น.สพ.แบมแบม ถ่ายรูป + sterile syringe เก็บหนองเพาะเชื้อ + fluid analysis + จด gross findings',
      'สพ.ญ.ซูจี ใช้ sterile syringe เก็บหนองส่ง culture + analysis (มองว่าเพียงพอ)',
      'น.สพ.โกโกวา เก็บหนองดองใน formalin ส่งตรวจ histopath'
    ],
    answer: 1,
    explain: 'B (แบมแบม) = complete workflow:\n1. ถ่ายรูป (documentation)\n2. Sterile syringe เก็บหนองสด → bacterial culture + fluid analysis (cell count, protein, cytology)\n3. วัดปริมาตร (quantify)\n4. บันทึก gross findings\nA: ถ่ายรูป + จดสีพอ ไม่เก็บ sample\nC: เก็บ sample แต่ไม่บันทึก findings/วัด\nD: Formalin = ฆ่าแบคทีเรีย ไม่สามารถเพาะเชื้อได้',
    verified: 'Final Patho prac.pdf p.15' },

  { id: 8265, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '1. Final Patho prac.pdf',
    examOrigin: 'Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update',
    tags: ['stress-leukogram', 'hematology', 'canine'], type: 'mcq',
    q: 'รูปแบบใดสอดคล้องกับการเกิด Stress leukogram ในสุนัข',
    options: [
      'Neutropenia, lymphopenia, monocytosis',
      'Neutropenia, lymphocytosis, monocytopenia',
      'Neutrophilia with left shift, lymphopenia, monocytopenia',
      'Neutrophilia with hypersegmentation, lymphopenia, monocytosis'
    ],
    answer: 3,
    explain: 'Stress leukogram (glucocorticoid effect) ในสุนัข:\n- Mature neutrophilia (no left shift, may be hypersegmented) — demargination + delayed apoptosis\n- Lymphopenia — redistribution + apoptosis\n- Monocytosis (ในสุนัข)\n- Eosinopenia\n→ D ตรงตาม classic pattern',
    verified: 'Final Patho prac.pdf p.15' },

];
