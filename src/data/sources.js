// ============================================================
// Source Mapping — บอกว่าข้อสอบแต่ละวิชาดึงมาจากโพยไหน
// ============================================================

export const QUESTION_SOURCES = {
  surg2: {
    files: [
      'ต้องอ่าน_โพย_Sur_lab_final_eye_85.pdf',
      'vet_surg_lab_II_ (notes)',
      'ตารางสอนปฏิบัติการ_Vet_Sur_Lab_2__3____2568.pdf',
    ],
    contributors: ['พี่ Vet 85', 'Kimchii 85'],
    topics: 'Ophthalmology, Aural hematoma, Mammary, Dental, Bandage, Suture',
    note: 'ข้อสอบ Final สอบพุธ 22 เม.ย. 2569 ชั้น 8',
  },
  surg3: {
    files: [
      'surg_lab_3_final_VET_84__โน_ตเพ__ม.pdf',
      'sos_รวมโพย_Lab_ortho_____.pdf',
      'vet_surg_lab_III_ (notes)',
      'ตารางสอนปฏิบัติการ_Vet_Surg_Lab_3.pdf',
    ],
    contributors: ['พี่พล Vet 84', 'Vet 84 (Ping, Sunsun, Saideang, Janny)'],
    topics: 'ESF, IM pin, Plate, Cerclage, Tension band, Approach to humerus/hip/femur, Cruciate',
    note: 'ข้อสอบ Final สอบพฤหัส 23 เม.ย. 2569 · ยกเว้น Lab 3,4,5 (approach)',
  },
  com5: {
    files: [
      'Com_5_final_TJ.pdf',
    ],
    contributors: ['TJ86 (vet 86)'],
    topics: 'Canine viral enteritis (CPV/CCV), Sporotrichosis & Cryptococcosis, GI protozoal enteritis, Rabies, Vaccine guidelines (WSAVA/VPAT), Feline URI',
    note: 'รวบรวมโพยรุ่นพี่ + อัพเดต 2024 · สอบ จันทร์ 27 เม.ย. 2569 · 08:30-10:30 · VET6 202/203',
  },
  com3: {
    files: [
      'COM_III_Final_.pdf',
    ],
    contributors: ['Kimchii 85'],
    topics: 'Companion Animal Clinical Sciences III — รอข้อสอบเพิ่ม',
    note: 'วิชาซัฟเฟอร์และยากที่สุด · สอบ พุธ 29 เม.ย. 2569',
  },
  com4: {
    files: [
      'COM_IV_final_โพยสร_ป_Kim.pdf',
      'COM_IV_86_Final_.pdf',
      'รายละเอ_ยด_COMIV (notes)',
    ],
    contributors: ['Kimchii 85', 'Vet 86'],
    topics: 'SLE, IMT, IMHA, Glomerular, Dermatology, Endocrine, Cardiology, Pediatric, Geriatric',
    note: 'ข้อสอบ Final · ศุกร์ 1 พ.ค. 2569 · ข้อสอบยากและเยอะมาก (>2.5 ชม.)',
  },
  repro: {
    files: [
      'animal_repro_โพย_compressed.pdf',
      'โพย_Repro_Lab_Vet8385.pdf',
    ],
    contributors: ['pployyyn Vet 83', 'Kimchii 85'],
    topics: 'Vaginal cytology, Estrus cycle, Pyometra, Dystocia, Cryptorchid, Hormone',
    note: 'รวมเนื้อหา Vet 83 + 85 · สอบ อังคาร 5 พ.ค. 2569 · 13:00-16:00',
  },
  exotic: {
    files: [
      'โพย_pp_s_exotic__Kimchii.pdf',
    ],
    contributors: ['Kimchii 85', 'Pannawat Supapannachart DVM, MSc'],
    topics: 'ECZM, Residency (USA/EU), Avian medicine, Reptile, Rabbit, Ferret',
    note: 'Wildlife & Exotic Health Mgt · สอบ พฤหัส 30 เม.ย. 2569',
  },
  practrum: {
    files: [],
    contributors: [],
    topics: 'Practice Ruminant — รอข้อสอบเพิ่ม',
    note: 'สอบ พุธ 6 พ.ค. 2569 · 13:00-16:00 · VET6 B01-B03',
  },
  poultry: {
    files: [],
    contributors: [],
    topics: 'Poultry Health Management — รอข้อสอบเพิ่ม',
    note: 'สอบ พฤหัส 7 พ.ค. 2569 · 13:00-15:00 · VET6 702',
  },
  engprof: {
    files: [],
    contributors: [],
    topics: 'English for Veterinary Profession II — รอข้อสอบเพิ่ม',
    note: 'สอบ อังคาร 28 เม.ย. 2569 · 13:00-15:00 · VET6 807',
  },
  cliapprum: {
    files: [
      'รวมโพย_84_clin_App_Rum.pdf',
    ],
    contributors: ['Vet 84'],
    topics: 'Foot rot, Laminitis, Sole ulcer, LDA, Hardware disease, BSP',
    note: 'Clinical App Ruminant · สอบ ศุกร์ 8 พ.ค. 2569 · 13:00-16:00',
  },
};

export function getSourceInfo(subjectId) {
  return QUESTION_SOURCES[subjectId] || null;
}
