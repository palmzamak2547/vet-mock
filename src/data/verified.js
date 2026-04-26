// ============================================================
// Verified-source parser — แปลง verified string ของแต่ละข้อสอบ
// ออกเป็น list ของ source แยกตามประเภทเพื่อแสดง badge ที่ ReviewView
// ============================================================
//
// Type:
//   'lecture-2026'  — Slide Lecture 2026 (current academic year)
//   'lecture-2024'  — Lecture 2024 archive (sunsun84/Vet 84) — คนสอนอาจคนละคน
//   'old-exam'      — ข้อสอบเก่า + study compilation (TJ86, etc.)
//   'guideline'     — WSAVA / VPAT / JAVMA / Plumb's / textbook / paper
//   'other'         — fallback
// ============================================================

// Map slide PDF filenames → label + lecturer (current 2026 staff)
const LECTURE_FILES_2026 = {
  // ── COM V ────────────────────────────────────────────────
  'cve.pdf':                                 { label: 'CVE Lecture 2026',           lecturer: 'Aj. Punyamanee Yamkate' },
  'sporotrichosis and cryptococcosis.pdf':   { label: 'Sporo+Crypto Lecture 2026',  lecturer: 'Aj. Siwaporn Pengpis' },
  'gi_protozoa.pdf':                         { label: 'GI Protozoa Lecture 2026',   lecturer: 'Aj. Woraporn Sukhumavasi' },
  'rabies.pdf':                              { label: 'Rabies Lecture 2026',        lecturer: 'Aj. Vachira Hunprasit' },
  'vaccination_guideline.pdf':               { label: 'Vaccine Lecture 2026',       lecturer: 'Prof. Sanipa Suradhat' },
  'feline_upper_respiratory_infection.pdf':  { label: 'FURI Lecture 2026',          lecturer: 'Aj. Nattawan Tangmahakul' },
  // ── COM IV ───────────────────────────────────────────────
  'derm_1__2_dermatology_introduction':      { label: 'Derm Intro Lecture 2026',     lecturer: 'Dermatology team' },
  'derm_3_parasitic_skin_diseases':          { label: 'Parasitic Skin Lecture 2026', lecturer: 'Dermatology team' },
  'derm__4_bacterial_skin_diseases':         { label: 'Bacterial Skin Lecture 2026', lecturer: 'Dermatology team' },
  'derm__5_fungal_skin_diseases':            { label: 'Fungal Skin Lecture 2026',    lecturer: 'Dermatology team' },
  'derm_6_endocrine_skin_diseases':          { label: 'Endocrine Skin Lecture 2026', lecturer: 'Dermatology team' },
  'derm_7_nutrition_skin_disease':           { label: 'Nutrition Skin Lecture 2026', lecturer: 'Dermatology team' },
  'derm_8_allergic_dermatitis':              { label: 'Allergic Derm Lecture 2026',  lecturer: 'Dermatology team' },
  'derm_9_autoimmune_skin_diseases':         { label: 'Autoimmune Skin Lecture 2026', lecturer: 'Dermatology team' },
  'drug_used_for_immune_mediated_diseases':  { label: 'Immune-mediated Drugs Lecture 2026', lecturer: 'Aj. Chaiyot Tanrattana' },
  'immune-mediated hemolytic anemia':        { label: 'IMHA Lecture 2026',           lecturer: 'Aj. Rosama Pusoonthornthum' },
  'systemic_lupus_erythematosus':            { label: 'SLE Lecture 2026',            lecturer: 'Aj. Rosama Pusoonthornthum' },
  'inflamatory_bowel_disease':               { label: 'IBD Lecture 2026',            lecturer: 'Aj. Rosama Pusoonthornthum' },
  'pediatrics_and_geriatrics':               { label: 'Peds & Geri Lecture 2026',    lecturer: 'Companion Animal Med team' },
};

// regex สำหรับ guideline / reference สากล
const GUIDELINE_RE = /(wsava|vpat|abcd|isfm|aaha|acvim|capc|cdc|woah|merck|plumb|javma|jvim|jfms|jsap|squires|moore|gonzalez|altheimer|gookins|tepsumethanon|sykes|pollock|carmichael)/i;

export function parseVerified(s) {
  if (!s || typeof s !== 'string') return [];

  // split โดย ' + ' หรือ ' / ' (สำหรับหลายแหล่งใน 1 ข้อ)
  const parts = s.split(/\s+\+\s+|\s+\/\s+/).map((p) => p.trim()).filter(Boolean);
  return parts.map(classify);
}

function classify(part) {
  const lower = part.toLowerCase();

  // ── 1) Slide Lecture 2026 ──
  for (const [file, meta] of Object.entries(LECTURE_FILES_2026)) {
    if (lower.startsWith(file) || lower.includes(file)) {
      return { type: 'lecture-2026', year: 2026, label: meta.label, by: meta.lecturer, raw: part };
    }
  }

  // ── 2) Master COM V FINAL ข้อสอบเก่า (TJ86, Vet 86) ──
  if (lower.includes('com v final 86') || lower.includes('com_5_final_tj') || lower.includes('com_5_final.pdf')) {
    return { type: 'old-exam', year: 2026, label: 'ข้อสอบเก่า COM V', by: 'TJ86 (Vet 86)', raw: part };
  }

  // ── 3) Lecture archive 2024 (sunsun84 / Vet 84) ──
  if (lower.includes('sunsun84') || lower.includes('sunsun 84') || lower.includes('vet 84') || lower.includes('vet84') || lower.includes('frdc 2024')) {
    return { type: 'lecture-2024', year: 2024, label: 'Lecture 2024 archive', by: 'sunsun84 (Vet 84)', note: 'คนสอนอาจคนละคนกับปี 86', raw: part };
  }

  // ── 4) Old exams of other contributors ──
  if (lower.includes('vet 83') || lower.includes('vet83') || lower.includes('pployyyn')) {
    return { type: 'old-exam', label: 'ข้อสอบเก่า (Vet 83)', by: 'pployyyn (Vet 83)', raw: part };
  }
  if (lower.includes('vet 85') || lower.includes('vet85') || lower.includes('kimchii')) {
    return { type: 'old-exam', label: 'ข้อสอบเก่า (Vet 85)', by: 'Kimchii (Vet 85)', raw: part };
  }

  // ── 5) Guideline / textbook / paper ──
  if (GUIDELINE_RE.test(part)) {
    return { type: 'guideline', label: 'Guideline / Reference', raw: part };
  }

  return { type: 'other', label: 'อื่นๆ', raw: part };
}

// ── Display helpers (icon + color tokens สำหรับ React inline-style) ──
export const VERIFIED_STYLE = {
  'lecture-2026': { icon: '🎓', bg: 'rgba(74, 107, 74, 0.12)',   border: 'var(--clr-sage)',  ink: 'var(--clr-ink)' },
  'lecture-2024': { icon: '📚', bg: 'rgba(184, 137, 64, 0.10)',  border: 'var(--clr-gold)',  ink: 'var(--clr-ink)' },
  'old-exam':     { icon: '📄', bg: 'rgba(184, 137, 64, 0.14)',  border: 'var(--clr-gold)',  ink: 'var(--clr-ink)' },
  'guideline':    { icon: '📘', bg: 'rgba(61, 107, 130, 0.12)',  border: 'var(--clr-ocean)', ink: 'var(--clr-ink)' },
  'other':        { icon: '✅', bg: 'rgba(74, 107, 74, 0.10)',   border: 'var(--clr-border)', ink: 'var(--clr-ink-soft)' },
};
