// ============================================================
// Veterinary Drug Database — common Doses for Dogs & Cats
// ============================================================
// Compiled from publicly available veterinary references:
//   • Plumb's Veterinary Drug Handbook (9th ed. / 10th ed.)
//   • MSD Veterinary Manual (merckvetmanual.com)
//   • BSAVA Small Animal Formulary
//   • FECAVA / WSAVA guidelines
//   • Thai veterinary pharmacology textbooks
//
// ⚠️ IMPORTANT: Doses are reference ranges only. Always verify
// with current prescribing information, local regulations, and
// patient-specific factors (renal/hepatic function, age, breed,
// concurrent medications). The calculator is a study aid, NOT
// a substitute for clinical judgment.
//
// Field conventions:
//   id          unique key (lowercase-dashed)
//   generic     generic name (INN)
//   brand       common Thai brand names (comma-separated)
//   category    drug class for grouping
//   species     'dog' | 'cat' | 'both'
//   doseLo       min dose (mg/kg unless noted)
//   doseHi       max dose (mg/kg unless noted)
//   unit        'mg/kg' | 'µg/kg' | 'IU/kg' | 'mg/m²' | 'mg/kg/day' | 'fixed'
//   route       'PO' | 'IV' | 'IM' | 'SC' | 'topical' | 'IV/IM/SC'
//   freq        dosing frequency
//   indication  what it's used for
//   note        special warnings, breed precautions, etc.
//   speciesMax  optional { cat|dog: number } — a hard per-species ceiling
//               in the SAME unit as doseLo/doseHi. The calculator clamps
//               to it and says why. Added because caps that live only in
//               `note` are prose, and the number on screen is what a
//               student writes down: enrofloxacin's range topped out at
//               exactly the 20 mg/kg that blinds cats, with the warning
//               sitting underneath it.
// ============================================================

export const VET_DRUGS = [
  // ── Antibiotics ──────────────────────────────────────────
  {
    id: 'amoxicillin', generic: 'Amoxicillin',
    brand: 'Clamoxyl, Amoxi, Moxigram',
    category: 'Antibiotics', species: 'both',
    doseLo: 10, doseHi: 22, unit: 'mg/kg',
    route: 'PO', freq: 'q8-12h',
    indication: 'UTI, RTI, skin, dental',
    note: 'β-lactam; combine with clavulanate for broader spectrum',
  },
  {
    id: 'amoxicillin-clavulanate', generic: 'Amoxicillin-Clavulanate',
    brand: 'Synulox, Augmentin, Clavubactin',
    category: 'Antibiotics', species: 'both',
    doseLo: 12.5, doseHi: 25, unit: 'mg/kg',
    route: 'PO', freq: 'q8-12h',
    indication: 'Pyoderma, stomatitis, UTI, bite wounds',
    note: 'Dose expressed as amoxicillin component; 2:1 or 4:1 ratio',
  },
  {
    id: 'cephalexin', generic: 'Cephalexin',
    brand: 'Ceporex, Rilexine, Sporidex',
    category: 'Antibiotics', species: 'both',
    doseLo: 15, doseHi: 30, unit: 'mg/kg',
    route: 'PO', freq: 'q8-12h',
    indication: 'Pyoderma, UTI, wound infections',
    note: '1st-gen cephalosporin; good for Gram+, fair for Gram-',
  },
  {
    id: 'cefovecin', generic: 'Cefovecin',
    brand: 'Convenia',
    category: 'Antibiotics', species: 'both',
    doseLo: 8, doseHi: 8, unit: 'mg/kg',
    route: 'SC', freq: 'q14d (single)',
    indication: 'Skin, UTI, wounds (long-acting injectable)',
    note: '3rd-gen cephalosporin; 14-day duration; SC only',
  },
  {
    id: 'enrofloxacin', generic: 'Enrofloxacin',
    brand: 'Baytril, Enrocin, Enroxil',
    category: 'Antibiotics', species: 'both',
    doseLo: 5, doseHi: 20, unit: 'mg/kg',
    speciesMax: { cat: 5 },
    route: 'PO/SC', freq: 'q24h',
    indication: 'Complicated UTI, prostatitis, deep pyoderma',
    note: '⚠️ Cat: >5 mg/kg may cause acute retinopathy; max 5 mg/kg/day. Avoid in young (<12 mo dog, <8 mo giant breed); cartilage damage',
  },
  {
    id: 'marbofloxacin', generic: 'Marbofloxacin',
    brand: 'Marbocyl, Zeniquin',
    category: 'Antibiotics', species: 'both',
    doseLo: 2, doseHi: 5.5, unit: 'mg/kg',
    route: 'PO', freq: 'q24h',
    indication: 'UTI, RTI, pyoderma',
    note: 'Fluoroquinolone; safer than enrofloxacin in cats',
  },
  {
    id: 'metronidazole', generic: 'Metronidazole',
    brand: 'Flagyl, Metrozin, Metrogyl',
    category: 'Antibiotics', species: 'both',
    doseLo: 7.5, doseHi: 15, unit: 'mg/kg',
    route: 'PO', freq: 'q8-12h',
    indication: 'Anaerobic infections, Giardia, IBD',
    note: 'Bitter taste; may cause neurologic signs at high doses',
  },
  {
    id: 'doxycycline', generic: 'Doxycycline',
    brand: 'Vibramycin, Doxycin, Doxsig',
    category: 'Antibiotics', species: 'both',
    doseLo: 5, doseHi: 10, unit: 'mg/kg',
    route: 'PO', freq: 'q12-24h',
    indication: 'Ehrlichia, Anaplasma, Mycoplasma, respiratory',
    note: 'Give with food to prevent esophagitis in cats; avoid concurrent calcium',
  },
  {
    id: 'clindamycin', generic: 'Clindamycin',
    brand: 'Antirobe, Dalacin C, Clindagel',
    category: 'Antibiotics', species: 'both',
    doseLo: 5.5, doseHi: 11, unit: 'mg/kg',
    route: 'PO', freq: 'q12h',
    indication: 'Dental infections, osteomyelitis, Toxoplasma',
    note: 'Good anaerobic coverage; watch for diarrhea in cats',
  },

  // ── NSAIDs ───────────────────────────────────────────────
  {
    id: 'carprofen', generic: 'Carprofen',
    brand: 'Rimadyl, Carprodyl, Norocarp',
    category: 'NSAIDs', species: 'dog',
    doseLo: 2, doseHi: 4.4, unit: 'mg/kg',
    route: 'PO/SC', freq: 'q12-24h (2 mg/kg q12h or 4 mg/kg q24h)',
    indication: 'OA pain, post-op analgesia',
    note: '⚠️ DO NOT USE IN CATS. COX-2 selective. Monitor liver enzymes (Labrador retrievers predisposed to hepatopathy)',
  },
  {
    id: 'meloxicam', generic: 'Meloxicam',
    brand: 'Metacam, Meloxidyl, Loxicom, Mobic',
    category: 'NSAIDs', species: 'both',
    doseLo: 0.1, doseHi: 0.2, unit: 'mg/kg',
    speciesMax: { cat: 0.05 },
    route: 'PO/SC/IV', freq: 'Dog: 0.1 mg/kg q24h; Cat: single 0.2 mg/kg SC then 0.05 mg/kg PO q24h',
    indication: 'OA pain, post-op, acute pain',
    note: '⚠️ Cat: 0.1 mg/kg SC single dose, then 0.05 mg/kg PO q24h. Do NOT exceed 0.05 mg/kg/day PO in cats. Acute renal failure risk in dehydrated patients',
  },
  {
    id: 'firocoxib', generic: 'Firocoxib',
    brand: 'Previcox',
    category: 'NSAIDs', species: 'dog',
    doseLo: 5, doseHi: 5, unit: 'mg/kg',
    route: 'PO', freq: 'q24h',
    indication: 'OA pain',
    note: 'COX-2 selective; DO NOT USE IN CATS. Flavored tablet — watch for accidental ingestion',
  },
  {
    id: 'robenacoxib', generic: 'Robenacoxib',
    brand: 'Onsior',
    category: 'NSAIDs', species: 'both',
    doseLo: 1, doseHi: 2, unit: 'mg/kg',
    route: 'PO/SC', freq: 'q24h (max 3 days)',
    indication: 'Post-op pain, acute musculoskeletal pain',
    note: 'COX-2 selective; licensed for both dogs and cats; short-term use',
  },
  {
    id: 'ketoprofen', generic: 'Ketoprofen',
    brand: 'Ketofen, Ketovid',
    category: 'NSAIDs', species: 'both',
    doseLo: 1, doseHi: 2, unit: 'mg/kg',
    route: 'PO/SC/IM', freq: 'q24h (max 5 days)',
    indication: 'Acute pain, post-op',
    note: 'COX-1/COX-2 non-selective; higher GI risk; short-term only',
  },

  // ── Opioids & Analgesics ─────────────────────────────────
  {
    id: 'tramadol', generic: 'Tramadol',
    brand: 'Tramal, Anadol, Ultracet',
    category: 'Analgesics', species: 'both',
    doseLo: 2, doseHi: 5, unit: 'mg/kg',
    route: 'PO', freq: 'q8-12h',
    indication: 'Chronic pain, mild-moderate pain',
    note: 'µ-opioid agonist + SNRI; variable efficacy in dogs (poor CYP metabolism); bitter taste',
  },
  {
    id: 'gabapentin', generic: 'Gabapentin',
    brand: 'Neurontin, Gaba, Gabapin',
    category: 'Analgesics', species: 'both',
    doseLo: 5, doseHi: 10, unit: 'mg/kg',
    route: 'PO', freq: 'q8-12h',
    indication: 'Neuropathic pain, chronic pain, anxiolytic',
    note: 'Reduce dose in renal impairment; sedating at higher doses; good for stress-related FLUTD in cats',
  },
  {
    id: 'buprenorphine', generic: 'Buprenorphine',
    brand: 'Buprecare, Vetergesic, Temgesic',
    category: 'Analgesics', species: 'both',
    doseLo: 0.01, doseHi: 0.04, unit: 'mg/kg',
    route: 'IV/IM/SC/buccal', freq: 'q6-12h',
    indication: 'Moderate-severe pain, post-op',
    note: 'Partial µ-agonist; good for cats via buccal (OTM) route; long duration',
  },

  // ── Antiparasitics ───────────────────────────────────────
  {
    id: 'fenbendazole', generic: 'Fenbendazole',
    brand: 'Panacur, Fenben, Safe-Guard',
    category: 'Antiparasitics', species: 'both',
    doseLo: 50, doseHi: 50, unit: 'mg/kg',
    route: 'PO', freq: 'q24h × 3-5 days',
    indication: 'Roundworms, hookworms, whipworms, Giardia',
    note: 'Safe in pregnancy; 50 mg/kg × 3d for routine deworming',
  },
  {
    id: 'praziquantel', generic: 'Praziquantel',
    brand: 'Droncit, Drontal (combo), Milbemax (combo)',
    category: 'Antiparasitics', species: 'both',
    doseLo: 5, doseHi: 7.5, unit: 'mg/kg',
    route: 'PO/SC', freq: 'single dose, repeat q3wk for Dipylidium',
    indication: 'Tapeworms (Dipylidium, Taenia, Echinococcus)',
    note: 'Often combined with pyrantel or milbemycin for broad spectrum',
  },
  {
    id: 'ivermectin', generic: 'Ivermectin',
    brand: 'Ivomec, Heartgard, Mectizan',
    category: 'Antiparasitics', species: 'both',
    doseLo: 0.006, doseHi: 0.3, unit: 'mg/kg',
    route: 'PO/SC', freq: 'q30d (heartworm preventive) or single (demodicosis)',
    indication: 'Heartworm prevention (0.006 mg/kg), Demodex (0.3-0.6 mg/kg)',
    note: '⚠️ MDR1 mutation (Collies, Australian Shepherds, etc.): DO NOT use high doses (>0.1 mg/kg); neurotoxicity risk. Cat: sensitive; use cat-specific products',
  },
  {
    id: 'milbemycin', generic: 'Milbemycin oxime',
    brand: 'Interceptor, Milbemax (combo), Sentinel',
    category: 'Antiparasitics', species: 'both',
    doseLo: 0.5, doseHi: 1, unit: 'mg/kg',
    route: 'PO', freq: 'q30d',
    indication: 'Heartworm prevention, roundworms, hookworms, whipworms',
    note: 'Safer for MDR1 breeds than ivermectin; also kills Demodex at higher doses',
  },
  {
    id: 'pyrantel', generic: 'Pyrantel pamoate',
    brand: 'Strongid, Nemex, Drontal (combo)',
    category: 'Antiparasitics', species: 'both',
    doseLo: 5, doseHi: 10, unit: 'mg/kg',
    route: 'PO', freq: 'single dose, repeat q2-3wk',
    indication: 'Roundworms, hookworms',
    note: 'Very safe; used in pregnant/lactating animals; often combined with praziquantel',
  },
  {
    id: 'afoxolaner', generic: 'Afoxolaner',
    brand: 'NexGard',
    category: 'Antiparasitics', species: 'dog',
    doseLo: 2.5, doseHi: 6.3, unit: 'mg/kg',
    route: 'PO', freq: 'q30d',
    indication: 'Fleas, ticks (Rhipicephalus, Ixodes, Dermacentor)',
    note: 'Isoxazoline; also kills Demodex and Sarcoptes at labeled dose. MDR1-safe',
  },
  {
    id: 'fluralaner', generic: 'Fluralaner',
    brand: 'Bravecto',
    category: 'Antiparasitics', species: 'both',
    doseLo: 25, doseHi: 56, unit: 'mg/kg',
    route: 'PO', freq: 'q12wk (dog) / q8wk (cat topical)',
    indication: 'Fleas, ticks, Demodex, Sarcoptes',
    note: 'Long-acting isoxazoline; 12-week protection in dogs',
  },

  // ── Cardiovascular ───────────────────────────────────────
  {
    id: 'pimobendan', generic: 'Pimobendan',
    brand: 'Vetmedin, Cardisure, Pimocard',
    category: 'Cardiovascular', species: 'dog',
    doseLo: 0.2, doseHi: 0.3, unit: 'mg/kg',
    route: 'PO', freq: 'q12h (1 hr before food)',
    indication: 'CHF from DCM or MMVD (ACVIM Stage B2-C)',
    note: '⚠️ NOT for cats (off-label, limited data). Positive inotrope + vasodilator. Give on empty stomach',
  },
  {
    id: 'enalapril', generic: 'Enalapril',
    brand: 'Enacard, Vasotec, Enalap, Enatec',
    category: 'Cardiovascular', species: 'both',
    doseLo: 0.25, doseHi: 0.5, unit: 'mg/kg',
    route: 'PO', freq: 'q12-24h',
    indication: 'CHF, hypertension, CKD (proteinuria)',
    note: 'ACE inhibitor; start low, titrate up; monitor renal function and potassium',
  },
  {
    id: 'benazepril', generic: 'Benazepril',
    brand: 'Fortekor, Lotensin, Benazecare',
    category: 'Cardiovascular', species: 'both',
    doseLo: 0.25, doseHi: 0.5, unit: 'mg/kg',
    route: 'PO', freq: 'q24h',
    indication: 'CHF, CKD (proteinuria), hypertension',
    note: 'ACE inhibitor; preferred in cats (renal + cardiac licensed); dual hepatic/renal elimination',
  },
  {
    id: 'furosemide', generic: 'Furosemide',
    brand: 'Lasix, Frusemide, Diurin',
    category: 'Cardiovascular', species: 'both',
    doseLo: 1, doseHi: 4, unit: 'mg/kg',
    route: 'PO/IV/IM/SC', freq: 'q8-24h (start 1-2 mg/kg, titrate)',
    indication: 'CHF pulmonary edema, pleural effusion',
    note: 'Loop diuretic; monitor renal function, electrolytes; titrate to lowest effective dose',
  },
  {
    id: 'spironolactone', generic: 'Spironolactone',
    brand: 'Aldactone, Spiron, Cardalis (combo)',
    category: 'Cardiovascular', species: 'dog',
    doseLo: 1, doseHi: 2, unit: 'mg/kg',
    route: 'PO', freq: 'q12h',
    indication: 'CHF (adjunct with ACEi), ascites from R-CHF',
    note: 'K-sparing diuretic + aldosterone antagonist; often combined with benazepril (Cardalis)',
  },
  {
    id: 'clopidogrel', generic: 'Clopidogrel',
    brand: 'Plavix, Clopid, Clopivas',
    category: 'Cardiovascular', species: 'both',
    doseLo: 1, doseHi: 3, unit: 'mg/kg',
    route: 'PO', freq: 'q24h',
    indication: 'Thromboembolism prevention (FATE in cats, IMHA in dogs)',
    note: 'Anti-platelet (ADP receptor antagonist); often combined with aspirin; watch for bleeding',
  },

  // ── GI / Antiemetic ──────────────────────────────────────
  {
    id: 'maropitant', generic: 'Maropitant',
    brand: 'Cerenia',
    category: 'GI/Antiemetic', species: 'both',
    doseLo: 1, doseHi: 1, unit: 'mg/kg',
    route: 'SC/PO', freq: 'q24h (max 5 days SC)',
    indication: 'Vomiting, motion sickness, nausea',
    note: 'NK1 receptor antagonist; anti-inflammatory at higher doses; 2 mg/kg PO for motion sickness',
  },
  {
    id: 'omeprazole', generic: 'Omeprazole',
    brand: 'Losec, Omepra, Gastrogard',
    category: 'GI/Antiemetic', species: 'both',
    doseLo: 0.5, doseHi: 1, unit: 'mg/kg',
    route: 'PO', freq: 'q12-24h',
    indication: 'Gastric ulcers, esophagitis, GORD',
    note: 'Proton pump inhibitor; more effective than H2 blockers; give before meals',
  },
  {
    id: 'famotidine', generic: 'Famotidine',
    brand: 'Pepcid, Famodin, Gastrocure',
    category: 'GI/Antiemetic', species: 'both',
    doseLo: 0.5, doseHi: 1, unit: 'mg/kg',
    route: 'PO/IV', freq: 'q12-24h',
    indication: 'Gastric acid reduction, reflux esophagitis',
    note: 'H2 blocker; less potent than omeprazole; rapid tolerance develops',
  },
  {
    id: 'metoclopramide', generic: 'Metoclopramide',
    brand: 'Plasil, Primperan, Maxolon',
    category: 'GI/Antiemetic', species: 'both',
    doseLo: 0.2, doseHi: 0.5, unit: 'mg/kg',
    route: 'PO/SC/IV', freq: 'q6-8h',
    indication: 'Vomiting, gastric stasis, ileus',
    note: 'Dopamine antagonist + prokinetic; CRI option: 0.01-0.02 mg/kg/hr',
  },
  {
    id: 'sucralfate', generic: 'Sucralfate',
    brand: 'Carafate, Ulcermin, Sucral',
    category: 'GI/Antiemetic', species: 'both',
    doseLo: 25, doseHi: 50, unit: 'mg/kg',
    route: 'PO', freq: 'q8-12h',
    indication: 'Gastric ulcer, esophagitis (cytoprotective)',
    note: 'Binds to ulcer base; give 1-2 hr apart from other drugs; slurry (not capsule) for esophagitis',
  },

  // ── Hormones / Endocrine ─────────────────────────────────
  {
    id: 'levothyroxine', generic: 'Levothyroxine (T4)',
    brand: 'Soloxine, Thyroxyl, Leventa',
    category: 'Endocrine', species: 'dog',
    doseLo: 0.02, doseHi: 0.04, unit: 'mg/kg',
    route: 'PO', freq: 'q12h',
    indication: 'Hypothyroidism',
    note: 'Start 0.02 mg/kg q12h; adjust based on post-pill T4 (4-6 hr post). Cat: 0.05-0.1 mg q12h',
  },
  {
    id: 'methimazole', generic: 'Methimazole',
    brand: 'Felimazole, Tapazole, Thiamazole',
    category: 'Endocrine', species: 'cat',
    // FIXED dose per cat, never per kg — adjusted on T4, not body weight.
    // (Merck Vet Manual: initial 1.25-2.5 mg/cat q12h.)
    doseLo: 1.25, doseHi: 2.5, unit: 'fixed', fixedUnit: 'mg/cat',
    route: 'PO', freq: 'q12h',
    indication: 'Feline hyperthyroidism',
    note: 'Start 1.25-2.5 mg/cat q12h (fixed dose, not per kg); adjust on T4. Transdermal gel available (compounded). ⚠️ Monitor CBC (agranulocytosis)',
  },
  {
    id: 'insulin-glargine', generic: 'Insulin glargine',
    brand: 'Lantus, Toujeo',
    category: 'Endocrine', species: 'both',
    // STARTING dose, both species: 0.25 IU/kg, or 0.5 IU/kg in a cat whose
    // blood glucose is above ~360 mg/dL (20 mmol/L). Was 0.25-1, and the
    // 1 IU/kg top is a titrated maintenance figure, not a dose anyone
    // should start on — for a 5 kg cat that is 5 IU q12h against a usual
    // starting 1 IU/cat. Maintenance is titrated to response and can
    // exceed this; the range here is where you begin.
    doseLo: 0.25, doseHi: 0.5, unit: 'IU/kg',
    // The note quotes "1 IU/cat" as practical context, not as the dose —
    // the per-kg figure above is the one to compute with. Declared so the
    // per-animal guard stays strict for everything else; that guard is
    // what would have caught methimazole's 5x overdose on day one.
    perAnimalNoteOk: 'the 1 IU/cat figure is context; the per-kg dose is authoritative',
    route: 'SC', freq: 'q12h',
    indication: 'DM (long-acting basal insulin)',
    note: '⚠️ ขนาดเริ่มต้นเท่านั้น — ปรับตามการตอบสนอง. Cat: 0.25 IU/kg (BG <360 mg/dL) หรือ 0.5 IU/kg (BG >360); ใช้ ideal body weight และแมวทั่วไปเริ่มที่ 1 IU/cat q12h. Dog: 0.25-0.5 IU/kg, มักใช้ NPH/lente มากกว่า. First-line for feline DM (remission protocol)',
  },
  {
    id: 'trilostane', generic: 'Trilostane',
    brand: 'Vetoryl',
    category: 'Endocrine', species: 'dog',
    doseLo: 1, doseHi: 2, unit: 'mg/kg',
    route: 'PO', freq: 'q12-24h',
    indication: 'Pituitary-dependent hyperadrenocorticism (Cushing)',
    note: 'Start 1 mg/kg q12h; monitor ACTH stim; ⚠️ adrenal necrosis risk if overdosed',
  },

  // ── Anticonvulsants ──────────────────────────────────────
  {
    id: 'phenobarbital', generic: 'Phenobarbital',
    brand: 'Luminal, Gardenal, Phenobarb',
    category: 'Anticonvulsants', species: 'both',
    doseLo: 2, doseHi: 3, unit: 'mg/kg',
    route: 'PO/IV', freq: 'q12h',
    indication: 'Idiopathic epilepsy, seizure control',
    note: 'Monitor liver enzymes + serum level (therapeutic 15-40 µg/mL). ⚠️ Cat: hepatotoxicity risk higher',
  },
  {
    id: 'levetiracetam', generic: 'Levetiracetam',
    brand: 'Keppra, Levetirac, Levipil',
    category: 'Anticonvulsants', species: 'both',
    doseLo: 20, doseHi: 30, unit: 'mg/kg',
    route: 'PO/IV', freq: 'q8h',
    indication: 'Epilepsy (adjunct or monotherapy), cluster seizures',
    note: 'Fewer side effects than phenobarbital; renal excretion: adjust dose in CKD; safe in liver disease',
  },
  {
    id: 'diazepam', generic: 'Diazepam',
    brand: 'Valium, Diapam, Zetran',
    category: 'Anticonvulsants', species: 'both',
    doseLo: 0.5, doseHi: 2, unit: 'mg/kg',
    route: 'IV/rectal', freq: 'q4-6h or as needed',
    indication: 'Status epilepticus, cluster seizures, muscle relaxation',
    note: '⚠️ Cat: oral diazepam can cause fatal hepatic necrosis; IV/rectal only. IV dose for status: 0.5-1 mg/kg',
  },

  // ── Anesthetics / Sedatives ──────────────────────────────
  {
    id: 'dexmedetomidine', generic: 'Dexmedetomidine',
    brand: 'Dexdomitor, Dexdor',
    category: 'Anesthetics', species: 'both',
    doseLo: 0.005, doseHi: 0.04, unit: 'mg/kg',
    route: 'IV/IM', freq: 'single dose',
    indication: 'Sedation, premedication, procedural sedation',
    note: 'α2-agonist; reversible with atipamezole (same volume). Dose: 0.005-0.01 IV, 0.01-0.04 IM. Cat: 0.04 mg/kg IM',
  },
  {
    id: 'ketamine', generic: 'Ketamine',
    brand: 'Ketaset, Ketalar, Narketan',
    category: 'Anesthetics', species: 'both',
    doseLo: 5, doseHi: 10, unit: 'mg/kg',
    route: 'IV/IM', freq: 'single dose',
    indication: 'Induction (IV), sedation (IM combo), CRI analgesia',
    note: 'Dissociative anesthetic; co-administer with benzodiazepine or α2-agonist. Cat: 5-10 mg/kg IM for chemical restraint',
  },
  {
    id: 'propofol', generic: 'Propofol',
    brand: 'Diprivan, Propoflo, Provive',
    category: 'Anesthetics', species: 'both',
    doseLo: 4, doseHi: 6, unit: 'mg/kg',
    route: 'IV', freq: 'to effect (induction)',
    indication: 'Anesthetic induction, short procedures, CRI',
    note: '⚠️ Cat: repeated doses or prolonged CRI → Heinz body anemia. Give to effect, not fixed dose',
  },
  {
    id: 'acepromazine', generic: 'Acepromazine',
    brand: 'ACP, PromAce, Aceprom',
    category: 'Anesthetics', species: 'both',
    doseLo: 0.01, doseHi: 0.05, unit: 'mg/kg',
    route: 'PO/IV/IM/SC', freq: 'q6-8h PRN',
    indication: 'Sedation, premedication, anxiolytic',
    note: 'Phenothiazine; long duration (4-8 hr). ⚠️ Boxers sensitive. May cause penile prolapse in stallions; hypotension risk',
  },

  // ── Respiratory / Antihistamine ──────────────────────────
  {
    id: 'diphenhydramine', generic: 'Diphenhydramine',
    brand: 'Benadryl, Diphen, Histaspan',
    category: 'Antihistamine', species: 'both',
    doseLo: 2, doseHi: 4, unit: 'mg/kg',
    route: 'PO/IM/IV', freq: 'q8-12h',
    indication: 'Allergic reactions, insect bites, urticaria, mast cell tumor degranulation',
    note: '1st-gen antihistamine; sedating; cat: 2-4 mg/kg q12h',
  },
  {
    id: 'cetirizine', generic: 'Cetirizine',
    brand: 'Zyrtec, Cetrizin, Zetriz',
    category: 'Antihistamine', species: 'both',
    doseLo: 0.5, doseHi: 1, unit: 'mg/kg',
    route: 'PO', freq: 'q12-24h',
    indication: 'Atopic dermatitis, chronic urticaria',
    note: '2nd-gen antihistamine; less sedating than diphenhydramine',
  },
  {
    id: 'theophylline', generic: 'Theophylline',
    brand: 'Theodur, Theo-Dur, Uniphyllin',
    category: 'Respiratory', species: 'both',
    doseLo: 10, doseHi: 20, unit: 'mg/kg',
    route: 'PO', freq: 'q12h',
    indication: 'Bronchodilation (feline asthma, collapsing trachea)',
    note: 'Phosphodiesterase inhibitor; narrow therapeutic window; monitor serum levels',
  },

  // ── Immunosuppressants ───────────────────────────────────
  {
    id: 'prednisolone', generic: 'Prednisolone',
    brand: 'Prednisolone, Pred Forte, Deltacortril',
    category: 'Immunosuppressants', species: 'both',
    doseLo: 0.5, doseHi: 2, unit: 'mg/kg',
    route: 'PO', freq: 'q12-24h (taper)',
    indication: 'Allergy, IMHA, IBD, CNS inflammation, lymphoma (protocol)',
    note: '⚠️ Cat: use prednisolone NOT prednisone (cats cannot convert prednisone to prednisolone). Anti-inflammatory: 0.5-1 mg/kg/day; immunosuppressive: 2-4 mg/kg/day',
  },
  {
    id: 'cyclosporine', generic: 'Cyclosporine',
    brand: 'Atopica, Neoral, Sandimmun',
    category: 'Immunosuppressants', species: 'both',
    doseLo: 5, doseHi: 7, unit: 'mg/kg',
    route: 'PO', freq: 'q24h (then taper)',
    indication: 'Atopic dermatitis, perianal fistula, IMHA, IBD',
    note: 'Calcineurin inhibitor; give on empty stomach; monitor renal function. Cat: 7 mg/kg q24h',
  },
  {
    id: 'mycophenolate', generic: 'Mycophenolate mofetil',
    brand: 'CellCept, Myfortic, Mycofit',
    category: 'Immunosuppressants', species: 'both',
    doseLo: 10, doseHi: 20, unit: 'mg/kg',
    route: 'PO', freq: 'q12h',
    indication: 'IMHA, IMTP, immune-mediated disease (steroid-sparing)',
    note: 'IMP dehydrogenase inhibitor; ⚠️ GI side effects common; monitor CBC',
  },

  // ── Neurologic / Behavioral ──────────────────────────────
  {
    id: 'fluoxetine', generic: 'Fluoxetine',
    brand: 'Prozac, Reconcile, Fluvoxin',
    category: 'Behavioral', species: 'both',
    doseLo: 0.5, doseHi: 1, unit: 'mg/kg',
    route: 'PO', freq: 'q24h',
    indication: 'Separation anxiety, aggression, FLUTD (FIC), OCD',
    note: 'SSRI; takes 4-6 weeks for full effect. Cat: 0.5-1 mg/kg q24h for FIC',
  },
  {
    id: 'trazodone', generic: 'Trazodone',
    brand: 'Desyrel, Trazodone, Trazonil',
    category: 'Behavioral', species: 'both',
    doseLo: 2, doseHi: 5, unit: 'mg/kg',
    route: 'PO', freq: 'q8-12h PRN',
    indication: 'Situational anxiety, post-op confinement, sedation',
    note: 'SARI (serotonin antagonist + reuptake inhibitor); give 1-2 hr before event; good for veterinary visits',
  },

  // ── Antifungals ──────────────────────────────────────────
  {
    id: 'itraconazole', generic: 'Itraconazole',
    speciesMax: { cat: 5 },
    brand: 'Sporanox, Itranox, Itrazole',
    category: 'Antifungals', species: 'both',
    doseLo: 5, doseHi: 10, unit: 'mg/kg',
    route: 'PO', freq: 'q24h (pulse therapy)',
    indication: 'Dermatophytosis, systemic mycoses, Malassezia',
    note: '⚠️ Cat: hepatotoxicity risk; use 5 mg/kg. Avoid concurrent antacids (needs acidic pH)',
  },
  {
    id: 'fluconazole', generic: 'Fluconazole',
    brand: 'Diflucan, Flucan, Fluzole',
    category: 'Antifungals', species: 'both',
    doseLo: 5, doseHi: 10, unit: 'mg/kg',
    route: 'PO', freq: 'q12-24h',
    indication: 'CNS cryptococcosis, systemic Candida',
    note: 'Good CNS penetration; less hepatotoxic than itraconazole; renal excretion',
  },
  {
    id: 'terbinafine', generic: 'Terbinafine',
    brand: 'Lamisil, Terbina, Terbisil',
    category: 'Antifungals', species: 'both',
    doseLo: 30, doseHi: 40, unit: 'mg/kg',
    route: 'PO', freq: 'q24h',
    indication: 'Dermatophytosis (Microsporum canis), Malassezia',
    note: 'Accumulates in skin/nails; good safety profile; 30-40 mg/kg q24h',
  },
];

// ── Category groups for UI ─────────────────────────────────
export const DRUG_CATEGORIES = [
  { id: 'Antibiotics',         label: '💊 Antibiotics', icon: '🧫' },
  { id: 'NSAIDs',              label: '🩹 NSAIDs', icon: '💢' },
  { id: 'Analgesics',          label: '💉 Analgesics', icon: '🩺' },
  { id: 'Antiparasitics',      label: '🪱 Antiparasitics', icon: '🐛' },
  { id: 'Cardiovascular',      label: '❤️ Cardiovascular', icon: '🫀' },
  { id: 'GI/Antiemetic',       label: '🤢 GI / Antiemetic', icon: '🤮' },
  { id: 'Endocrine',           label: '🧪 Endocrine', icon: '🦋' },
  { id: 'Anticonvulsants',     label: '⚡ Anticonvulsants', icon: '🧠' },
  { id: 'Anesthetics',         label: '😴 Anesthetics/Sedatives', icon: '💤' },
  { id: 'Antihistamine',       label: '🤧 Antihistamine', icon: '🤒' },
  { id: 'Respiratory',         label: '🫁 Respiratory', icon: '🫁' },
  { id: 'Immunosuppressants',  label: '🛡 Immunosuppressants', icon: '🛡️' },
  { id: 'Behavioral',          label: '🧘 Behavioral', icon: '🧘' },
  { id: 'Antifungals',         label: '🍄 Antifungals', icon: '🦠' },
];