// ============================================================
// tts-phonetic — English → Thai phonetic transliteration
// ============================================================
//
// Why this exists:
//   Thai TTS voices (Pattara, Kanya) butcher Latin script when read
//   directly. They're EXCELLENT at reading Thai phonetics. So the
//   trick: pre-translate English medical terms into Thai phonetic
//   spelling BEFORE handing the text to the voice. The voice then
//   reads "โดเบอร์มัน" naturally instead of garbling "Doberman".
//
// Coverage strategy:
//   • Drugs (top 50 used in VetMock Q)
//   • Breeds (top 30)
//   • Anatomy / disease terms (top 60)
//   • Lab values / electrolytes (top 25)
//   • Acronyms (spelled out as Thai letters where Thai voice fails
//     to spell them naturally on its own)
//   • Common procedural English ("triage", "shock", "bolus")
//
// What this is NOT:
//   • Not a romanization — direction is English → Thai.
//   • Not a translation — "Doberman" stays "Doberman" semantically;
//     we just spell it the way a Thai speaker would say it.
//   • Not perfect IPA — pragmatic spellings that Pattara reads cleanly.
//
// Maintenance:
//   When you spot an English term that the Thai voice mispronounces in
//   a Q, add an entry here. Order doesn't matter; the matcher sorts
//   by length descending so multi-word phrases always match before
//   single words.
// ============================================================

// All keys lowercase. Multi-word phrases use single space.
export const TH_PHONETIC = {
  // ── Drugs (alphabetical) ──────────────────────────────────────
  'aminoglycoside': 'อะมิโนไกลโคไซด์',
  'amoxicillin': 'อะม็อกซิซิลลิน',
  'ampicillin': 'แอมพิซิลลิน',
  'atropine': 'อะโทรพีน',
  'azithromycin': 'อะซิโทรมัยซิน',
  'buprenorphine': 'บูพรีนอร์ฟีน',
  'butorphanol': 'บิวทอร์ฟานอล',
  'carprofen': 'คาร์โพรเฟน',
  'cefazolin': 'เซฟาโซลิน',
  'cefovecin': 'เซโฟเวซิน',
  'cephalexin': 'เซฟาเล็กซิน',
  'chlorhexidine': 'คลอเฮกซิดีน',
  'clindamycin': 'คลินดามัยซิน',
  'corticosteroid': 'คอร์ติโคสเตียรอยด์',
  'dexamethasone': 'เด็กซาเมทาโซน',
  'dexmedetomidine': 'เด็กซ์เมเดโทมิดีน',
  'diazepam': 'ไดอาซีแพม',
  'diphenhydramine': 'ไดเฟนไฮดรามีน',
  'doxycycline': 'ด็อกซีไซคลีน',
  'enrofloxacin': 'เอนโรฟลอกซาซิน',
  'epinephrine': 'เอพิเนฟริน',
  'famotidine': 'ฟาโมทิดีน',
  'fenbendazole': 'เฟนเบนดาโซล',
  'fluconazole': 'ฟลูโคนาโซล',
  'furosemide': 'ฟูโรซีไมด์',
  'gabapentin': 'กาบาเพนทิน',
  'glucocorticoid': 'กลูโคคอร์ติคอยด์',
  'heparin': 'เฮพาริน',
  'hydromorphone': 'ไฮโดรมอร์โฟน',
  'insulin': 'อินสุลิน',
  'isoflurane': 'ไอโซฟลูเรน',
  'ketamine': 'คีตามีน',
  'levothyroxine': 'ลีโวไทร็อกซีน',
  'lidocaine': 'ลิโดเคน',
  'maropitant': 'มาโรพิแทนต์',
  'meloxicam': 'เมล็อกซิแคม',
  'metronidazole': 'เมโทรนิดาโซล',
  'midazolam': 'มิดาโซแลม',
  'morphine': 'มอร์ฟีน',
  'naloxone': 'นาล็อกโซน',
  'omeprazole': 'โอเมพราโซล',
  'oxytocin': 'ออกซิโทซิน',
  'pimobendan': 'ไพโมเบนแดน',
  'prednisolone': 'เพรดนิโซโลน',
  'prednisone': 'เพรดนิโซน',
  'propofol': 'โพรโพฟอล',
  'pyrantel': 'ไพแรนเทล',
  'spironolactone': 'สไปโรโนแลคโตน',
  'sucralfate': 'ซูคราลเฟต',
  'sulfadiazine': 'ซัลฟาไดอาซีน',
  'tramadol': 'ทรามาดอล',
  'trimethoprim': 'ไทรเมโทพริม',
  'vancomycin': 'แวนโคมัยซิน',
  'vincristine': 'วินคริสติน',
  'xylazine': 'ไซลาซีน',

  // ── Breeds ────────────────────────────────────────────────────
  'beagle': 'บีเกิ้ล',
  'bichon': 'บิชอง',
  'border collie': 'บอร์เดอร์ คอลลี่',
  'boxer': 'บ็อกเซอร์',
  'bulldog': 'บูลด็อก',
  'chihuahua': 'ชิวาวา',
  'cocker spaniel': 'ค็อกเกอร์ สแปเนียล',
  'corgi': 'คอร์กี้',
  'dachshund': 'แดชชุนด์',
  'doberman': 'โดเบอร์มัน',
  'french bulldog': 'เฟรนช์ บูลด็อก',
  'german shepherd': 'เยอรมัน เชพเพิร์ด',
  'golden retriever': 'โกลเด้น รีทรีฟเวอร์',
  'great dane': 'เกรท เดน',
  'husky': 'ฮัสกี้',
  'jack russell': 'แจ็ค รัสเซลล์',
  'labrador': 'ลาบราดอร์',
  'maltese': 'มอลทีส',
  'persian': 'เพอร์เซีย',
  'pomeranian': 'โพเมอเรเนียน',
  'poodle': 'พุดเดิ้ล',
  'pug': 'ปั๊ก',
  'rottweiler': 'ร็อตไวเลอร์',
  'shih tzu': 'ชิสุห์',
  'siamese': 'สยามมีส',
  'siberian': 'ไซบีเรียน',
  'yorkshire': 'ยอร์คเชียร์',

  // ── Laterality / position / direction ────────────────────────
  'anterior': 'แอนทีเรียร์',
  'apical': 'เอพิคัล',
  'basilar': 'เบซิลาร์',
  'bilateral': 'ไบลาเทอรัล',
  'distal': 'ดิสตัล',
  'dorsal': 'ดอร์ซัล',
  'gland': 'แกลนด์',
  'inferior': 'อินฟีเรียร์',
  'inguinal': 'อินกวินอล',
  'lateral': 'ลาเทอรัล',
  'left': 'เลฟท์',
  'local': 'โลคอล',
  'medial': 'มีเดียล',
  'midline': 'มิดไลน์',
  'palmar': 'พาลมาร์',
  'plantar': 'แพลนตาร์',
  'posterior': 'พอสเทเรียร์',
  'proximal': 'พรอกซิมัล',
  'regional': 'รีเจียนัล',
  'right': 'ไรท์',
  'superior': 'ซูพีเรียร์',
  'unilateral': 'ยูนิลาเทอรัล',
  'ventral': 'เวนทรัล',

  // ── Anatomy / location ────────────────────────────────────────
  'abdominal': 'แอบโดมินอล',
  'abdomen': 'แอบโดเมน',
  'adrenal': 'อะดรีนอล',
  'aorta': 'เอออร์ตา',
  'aortic': 'เอออร์ติก',
  'atrium': 'แอเทรียม',
  'atrial': 'เอเทรียล',
  'cardiac': 'คาร์เดียก',
  'carotid': 'คาโรทิด',
  'cartilage': 'คาร์ทิเลจ',
  'caudal': 'คอดัล',
  'cervical': 'เซอร์วิคัล',
  'cornea': 'คอร์เนีย',
  'corneal': 'คอร์เนียล',
  'cranial': 'เครเนียล',
  'duodenum': 'ดูโอดีนัม',
  'esophagus': 'อีโซฟากัส',
  'femoral': 'ฟีโมรัล',
  'gastric': 'แกสทริก',
  'gastrointestinal': 'แกสโตรอินเทสตินอล',
  'hepatic': 'ฮีพาทิก',
  'jugular': 'จูกูลาร์',
  'lacrimal': 'แลคริมอล',
  'laryngeal': 'ลารินเจียล',
  'mammary': 'แมมมารี',
  'metacarpal': 'เมตาคาร์ปอล',
  'metatarsal': 'เมตาทาร์ซอล',
  'myocardial': 'ไมโอคาร์เดียล',
  'neurological': 'นูโรลอจิคัล',
  'pancreas': 'แพนเครียส',
  'pericardium': 'เพอริคาร์เดียม',
  'pulmonary': 'พัลโมนารี',
  'renal': 'รีนอล',
  'retinal': 'เรทินอล',
  'sclera': 'สเคลรา',
  'splenic': 'สเปลนิก',
  'thoracic': 'ทอราซิก',
  'thorax': 'ทอแร็กซ์',
  'thyroid': 'ไทรอยด์',
  'tibia': 'ทิเบีย',
  'trachea': 'เทรเคีย',
  'urethra': 'ยูริทรา',
  'urinary': 'ยูรินารี',
  'ventricle': 'เวนทริเคิล',
  'ventricular': 'เวนทริคูลาร์',
  'vertebra': 'เวอร์ทีบรา',

  // ── Diseases / conditions ─────────────────────────────────────
  'anaphylaxis': 'อะนาฟิแลกซิส',
  'anemia': 'อะนีเมีย',
  'arrhythmia': 'อะริทเมีย',
  'arthritis': 'อาร์ไทรติส',
  'cataract': 'คาทาแร็คท์',
  'conjunctivitis': 'คอนจังทิไวติส',
  'cushing': 'คุชชิ่ง',
  'cystitis': 'ซีสไทติส',
  'dermatitis': 'เดอร์มาไทติส',
  'distemper': 'ดิสเทมเปอร์',
  'dystocia': 'ดิสโทเชีย',
  'eclampsia': 'อีแคลมเซีย',
  'enteritis': 'เอนเทอไรติส',
  'epilepsy': 'อีพิเล็พซี',
  'gastritis': 'แกสไทติส',
  'gastroenteritis': 'แกสโตรเอนเทอไรติส',
  'glaucoma': 'กลอโคมา',
  'hyperthyroidism': 'ไฮเปอร์ไทรอยด์ดิซึ่ม',
  'hypothyroidism': 'ไฮโปไทรอยด์ดิซึ่ม',
  'hypovolemic': 'ไฮโปโวเลมิก',
  'hypoxia': 'ไฮป็อกเซีย',
  'ketoacidosis': 'คีโทอะซิโดซิส',
  'leptospirosis': 'เลปโทสไปโรซิส',
  'lumpectomy': 'ลัมเพคโตมี',
  'mastectomy': 'มาสเทคโตมี',
  'mastitis': 'มาสไทติส',
  'meningitis': 'เมนินไจติส',
  'nephritis': 'เนฟริติส',
  'osteoarthritis': 'ออสติโออาร์ไทรติส',
  'otitis': 'โอไทติส',
  'pancreatitis': 'แพนคราอะไทติส',
  'parvovirus': 'พาร์โวไวรัส',
  'pneumonia': 'นิวโมเนีย',
  'pyometra': 'ไพโอเมตรา',
  'rabies': 'ราบีส',
  'sepsis': 'เซ็พซิส',
  'septic': 'เซ็พติก',
  'shock': 'ช็อก',
  'tachycardia': 'ทาคิคาร์เดีย',
  'thrombocytopenia': 'ทรอมโบไซโตพีเนีย',
  'tumor': 'ทูเมอร์',
  'uveitis': 'ยูเวไอติส',

  // ── Lab values / electrolytes / pathology ────────────────────
  'albumin': 'อัลบูมิน',
  'amylase': 'อะไมเลส',
  'azotemia': 'อะโซทีเมีย',
  'bilirubin': 'บิลิรูบิน',
  'calcium': 'แคลเซียม',
  'chloride': 'คลอไรด์',
  'creatinine': 'ครีอะตินิน',
  'electrolyte': 'อิเล็กโทรไลต์',
  'globulin': 'โกลบูลิน',
  'glucose': 'กลูโคส',
  'hematocrit': 'ฮีมาโทคริต',
  'hemoglobin': 'ฮีโมโกลบิน',
  'lactate': 'แลคเทต',
  'lipase': 'ไลเปส',
  'magnesium': 'แมกนีเซียม',
  'phosphorus': 'ฟอสฟอรัส',
  'potassium': 'โพแทสเซียม',
  'proteinuria': 'โปรตีนยูเรีย',
  'sodium': 'โซเดียม',
  'urea': 'ยูเรีย',

  // ── Everyday English words common in Thai-medic prose ───────
  'aj.': 'อาจารย์',
  'aj': 'อาจารย์',
  'antibiotic': 'แอนติไบโอติก',
  'antibiotics': 'แอนติไบโอติกส์',
  'antibody': 'แอนติบอดี',
  'antigen': 'แอนติเจน',
  'agent': 'เอเจ้นท์',
  'antimicrobial': 'แอนติไมโครเบียล',
  'bacterial': 'แบคทีเรียล',
  'bacteria': 'แบคทีเรีย',
  'beta-lactam': 'เบต้า-แลคแทม',
  'cardiomyopathy': 'คาร์ดิโอไมโอพาธี',
  'combination': 'คอมบิเนชัน',
  'comparison': 'คอมพาริซัน',
  'consciousness': 'คอนเชียสเนส',
  'dilated': 'ไดเลทเต็ด',
  'enzyme': 'เอนไซม์',
  'function': 'ฟังก์ชัน',
  'hormone': 'ฮอร์โมน',
  'hyperkalemia': 'ไฮเปอร์คาลีเมีย',
  'hyperthermia': 'ไฮเปอร์เธอร์เมีย',
  'hypocalcemia': 'ไฮโปแคลซีเมีย',
  'hypothermia': 'ไฮโปเธอร์เมีย',
  'immune': 'อิมมูน',
  'inflammation': 'อินแฟลมเมชัน',
  'inflammatory': 'อินแฟลมมาทอรี',
  'intravenous': 'อินทราวีนัส',
  'intramuscular': 'อินทรามัสคูลาร์',
  'parenteral': 'พาเรนเทอรัล',
  'perfusion': 'เพอร์ฟิวชัน',
  'pharmacology': 'ฟาร์มาโคโลจี',
  'protocol': 'โปรโตคอล',
  'recommend': 'เรคคอมเมนด์',
  'recommended': 'เรคคอมเมนเด็ด',
  'restrictive': 'รีสตริกทีฟ',
  'sedative': 'เซเดทีฟ',
  'subcutaneous': 'ซับคิวเทเนียส',
  'systemic': 'ซีสเทมิก',
  'topical': 'ทอปปิคัล',
  'toxic': 'ทอกซิก',
  'toxicity': 'ทอกซิซิตี',
  'vaccine': 'แวคซีน',
  'vaccination': 'แวคซิเนชัน',
  'virus': 'ไวรัส',
  'viral': 'ไวรัล',
  'acute': 'อคิวท์',
  'case': 'เคส',
  'cat': 'แคท',
  'chronic': 'โครนิก',
  'condition': 'คอนดิชัน',
  'diagnosis': 'ไดแอกโนซิส',
  'differential': 'ดิฟเฟอเรนเชียล',
  'disease': 'ดิซีส',
  'dog': 'ด็อก',
  'drug': 'ดรัก',
  'feline': 'ฟีไลน์',
  'history': 'ฮิสตอรี',
  'infection': 'อินเฟกชัน',
  'lab': 'แล็บ',
  'level': 'เลเวล',
  'management': 'แมเนจเม้นท์',
  'medication': 'เมดิเคชัน',
  'patient': 'เพเชนท์',
  'pre-op': 'พรี-ออป',
  'post-op': 'โพสต์-ออป',
  'reaction': 'รีแอ็กชัน',
  'result': 'รีซัลท์',
  'severe': 'ซีเวียร์',
  'stage': 'สเตจ',
  'surgery': 'เซอร์เจอรี',
  'symptom': 'ซิมป์ทอม',
  'symptoms': 'ซิมป์ทอมส์',
  'syndrome': 'ซินโดรม',
  'test': 'เทสต์',
  'therapy': 'เธอราพี',
  'treatment': 'ทรีตเม้นท์',
  'value': 'วาลู',

  // ── Procedural / clinical English used in Thai vet context ───
  'aggressive': 'แอกเกรสซีฟ',
  'auscultation': 'ออสคัลเทชัน',
  'biopsy': 'ไบออปซี',
  'bolus': 'โบลัส',
  'cannula': 'แคนนูลา',
  'catheter': 'คาเธเทอร์',
  'catheterization': 'คาเธเทอไรเซชัน',
  'consciousness': 'คอนเชียสเนส',
  'crystalloid': 'คริสตัลลอยด์',
  'decompress': 'ดีคอมเพรส',
  'dehydration': 'ดีไฮเดรชัน',
  'dosage': 'โดเสจ',
  'electrocardiogram': 'อิเล็กโทรคาร์ดิโอแกรม',
  'electrolytes': 'อิเล็กโทรไลต์ส',
  'emergency': 'อิเมอร์เจนซี',
  'fluid': 'ฟลูอิด',
  'fluids': 'ฟลูอิดส์',
  'hemorrhage': 'ฮีเมอเรจ',
  'intubate': 'อินทูเบต',
  'intubation': 'อินทูเบชัน',
  'mannitol': 'แมนนิทอล',
  'maintenance': 'เมนเทเนนซ์',
  'oxygenate': 'ออกซิจีเนต',
  'palpation': 'พัลเพชัน',
  'physical exam': 'ฟิสิคัล อิแกซม',
  'physical examination': 'ฟิสิคัล เอ็กแซมิเนชัน',
  'primary survey': 'ไพรมารี เซอร์เวย์',
  'prognosis': 'โพรกโนซิส',
  'radiograph': 'เรดิโอกราฟ',
  'ringer': 'ริงเงอร์',
  'sedation': 'เซเดชัน',
  'stabilize': 'สเตบิไลซ์',
  'staging': 'สเตจจิ้ง',
  'surgical': 'เซอร์จิคัล',
  'syndrome': 'ซินโดรม',
  'transfusion': 'ทรานสฟิวชัน',
  'triage': 'ไทรอาจ',
  'ultrasound': 'อัลตราซาวด์',
  'vital signs': 'ไวทัล ไซน์ส',

  // ── Letters / abbreviations spelled in Thai for the Thai voice
  // (Keep as backup — the acronym map in tts.js already handles
  // most via "G D V" etc, but Pattara sometimes still trips on
  // mixed cases, so we hardcode common Thai-letter spellings.)
  'gdv': 'จี ดี วี',
  'aki': 'เอ เค ไอ',
  'ckd': 'ซี เค ดี',
  'dcm': 'ดี ซี เอ็ม',
  'hcm': 'เอช ซี เอ็ม',
  'ecg': 'อี ซี จี',
  'ekg': 'อี เค จี',
  'mri': 'เอ็ม อาร์ ไอ',
  'iv': 'ไอ วี',
  'im': 'ไอ เอ็ม',
  'po': 'พี โอ',
  'sc': 'เอส ซี',
  'sq': 'เอส คิว',
  'cpcr': 'ซี พี ซี อาร์',
  'cpr': 'ซี พี อาร์',
  'bls': 'บี แอล เอส',
  'als': 'เอ แอล เอส',
  'dka': 'ดี เค เอ',
  'sirs': 'เอส ไอ อาร์ เอส',
  'dic': 'ดี ไอ ซี',
  'iris': 'ไอริส',
  'rer': 'อาร์ อี อาร์',
  'bsa': 'บี เอส เอ',
  'soap': 'โซป',
  'pqrst': 'พี คิว อาร์ เอส ที',
  'opqrst': 'โอ พี คิว อาร์ เอส ที',
  'abcde': 'เอ บี ซี ดี อี',
};

// Build a sorted list of (key, value) for longest-match-first replacement.
// Multi-word phrases must match BEFORE their constituent single words.
const ENTRIES = Object.entries(TH_PHONETIC).sort((a, b) => b[0].length - a[0].length);

// Regex-escape a string so it can be used inside a RegExp literal
function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Word-boundary match — but \b doesn't work right with non-ASCII Thai chars
// on the right side, so we use a custom boundary check via lookarounds.
// Compatibility: lookbehind/lookahead are universal in evergreen browsers.
function makePattern(key) {
  // Multi-word phrases need to be matched as a whole; spaces inside should
  // accept any whitespace run. \b at start/end ensures we don't grab parts
  // of longer words ("Doberman" inside "Dobermans" would still match the
  // Doberman prefix; we handle plurals separately below if needed).
  return new RegExp(`(^|[^A-Za-z])(${escRe(key)})(?=[^A-Za-z]|$)`, 'gi');
}

// Pre-compile patterns once at module load — replacement is hot path
const COMPILED = ENTRIES.map(([key, val]) => ({ pattern: makePattern(key), val }));

// Apply phonetic transliteration to a piece of text. Only call this when
// the speaking voice is Thai — for English voices it's a no-op (and would
// actually hurt: Zira reading "โดเบอร์มัน" would garble it).
//
// Replaces longest matches first; case-insensitive; preserves preceding
// non-letter character so we don't accidentally swallow punctuation.
export function thaiPhoneticTranslit(text) {
  if (!text || typeof text !== 'string') return text;
  let out = text;
  for (const { pattern, val } of COMPILED) {
    out = out.replace(pattern, (m, lead) => `${lead}${val}`);
  }
  // Spell-letter fallback for any 2-5-char ALL-CAPS word that wasn't in
  // the dictionary. Reads "DKA" → "ดี เค เอ" if not already mapped.
  // Single-letter Thai equivalents — covers the full Latin alphabet.
  const TH_LETTER = {
    A: 'เอ', B: 'บี', C: 'ซี', D: 'ดี', E: 'อี', F: 'เอฟ', G: 'จี',
    H: 'เอช', I: 'ไอ', J: 'เจ', K: 'เค', L: 'แอล', M: 'เอ็ม', N: 'เอ็น',
    O: 'โอ', P: 'พี', Q: 'คิว', R: 'อาร์', S: 'เอส', T: 'ที', U: 'ยู',
    V: 'วี', W: 'ดับเบิลยู', X: 'เอ็กซ์', Y: 'วาย', Z: 'แซด',
  };
  out = out.replace(/(^|[^A-Za-z])([A-Z]{2,5})(?=[^A-Za-z]|$)/g, (m, lead, abbr) => {
    const spelled = abbr.split('').map((ch) => TH_LETTER[ch] || ch).join(' ');
    return `${lead}${spelled}`;
  });
  return out;
}
