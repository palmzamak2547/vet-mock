// ============================================================
// Eng Vet Prof II Questions — Final Exam (Units 4-5)
// ============================================================
// Sources:
//   - 5500419 Eng Vet Prof II Textbook (Units 4-5, pp.99-167)
//   - Exercise 1 + 2 + KEY (textbook practice)
//   - Final Exam Specification 2-2025
//
// IDs: 1100-1199 (room for ~100 questions)
//
// Topics:
//   research-paper-structure  · ส่วนต่างๆ ของ paper
//   research-design           · 8 research designs
//   academic-writing          · paper types + citation
//   paraphrasing              · 5 techniques + acceptability
//   summary-writing           · summary rules + marking
// ============================================================

export const QB_ENGPROF = [
  // ═══════════════════════════════════════════════════════════
  // Research Paper Structure (Unit 4)
  // ═══════════════════════════════════════════════════════════
  { id: 1100, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.99', tags: ['imrd', 'structure'], type: 'mcq',
    q: 'A veterinary research paper conventionally consists of 4 main sections in which order?',
    options: [
      'Introduction → Discussion → Methods → Results',
      'Introduction → Methodology → Results → Discussion and Conclusion',
      'Abstract → Introduction → Discussion → References',
      'Methods → Results → Introduction → Conclusion',
    ],
    answer: 1, explain: 'Conventional sequence (IMRD): Introduction → Methodology → Results → Discussion & Conclusion. ใน Final Part I อ่านที่ตำแหน่งใดต้องรู้ว่า section ไหน',
    verified: 'Textbook p.99' },

  { id: 1101, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.99', tags: ['definition', 'concept'], type: 'mcq',
    q: 'According to the textbook, a veterinary research paper is NOT:',
    options: [
      'An original analysis based on the authors\' research study',
      'A summary of topic / opinion essay / book report',
      'A piece of academic writing showing argument',
      'A contribution to the existing body of knowledge',
    ],
    answer: 1, explain: 'Research paper เป็น **original** analysis/argument จากงานวิจัยของผู้เขียน — **ไม่ใช่** summary, opinion essay, หรือ book report (textbook p.99 ระบุ explicitly)',
    verified: 'Textbook p.99' },

  { id: 1102, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.100', tags: ['introduction', 'purpose'], type: 'mcq',
    q: 'In a research paper, where would you most likely find the **purpose / aim of the study**?',
    options: ['Methodology', 'Results', 'Introduction (often last paragraph)', 'References'],
    answer: 2, explain: 'Purpose / aim / objective อยู่ใน Introduction มักประโยคสุดท้าย หลังจากอธิบาย gap in knowledge แล้ว',
    verified: 'Textbook p.100' },

  { id: 1103, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.103', tags: ['methodology'], type: 'mcq',
    q: 'Which of the following information is found in the **Methodology** section?',
    options: [
      'Mean, SD, and p-values of outcomes',
      'Background of the disease',
      'Research design, sample size, statistical procedures',
      'Recommendations for further research',
    ],
    answer: 2, explain: 'Methodology บอก **research design, population/sample, instruments, data collection procedure, data analysis method** — ส่วน mean/SD/p-value อยู่ Results · background อยู่ Intro · recommendations อยู่ Discussion',
    verified: 'Textbook p.103' },

  { id: 1104, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.107', tags: ['results'], type: 'tf',
    q: 'The Results section is the appropriate place for the authors to **interpret the meaning** of their findings.',
    answer: false, explain: 'False — Results เพียงแค่**ตอบ research question ด้วยข้อมูล** (ตัวเลข/tables/figures) **ไม่ตีความ** · การ interpret meaning อยู่ใน Discussion',
    verified: 'Textbook p.107' },

  { id: 1105, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.110', tags: ['discussion', 'limitations'], type: 'mcq',
    q: 'Which information is typically found in the **Discussion and Conclusion** section? (select the most complete answer)',
    options: [
      'Sample size and recruitment methods',
      'Interpretation of results, comparison with prior studies, limitations, and recommendations for further research',
      'Tables of statistical results',
      'Definitions of technical terms',
    ],
    answer: 1, explain: 'Discussion & Conclusion = interpret findings + compare vs prior literature + state implications + state **limitations** + provide **recommendations for further research**',
    verified: 'Textbook p.110' },

  { id: 1106, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.103', tags: ['methods', 'sample'], type: 'mcq',
    q: 'A reader wants to know **how the sample was recruited** for a study. They should look in:',
    options: ['Introduction', 'Methodology — population and sample subsection', 'Results', 'Discussion'],
    answer: 1, explain: 'Methodology อธิบาย "who they were, how many there were, and how and why they were recruited" (sampling method)',
    verified: 'Textbook p.103' },

  { id: 1107, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.110', tags: ['discussion', 'recommendations'], type: 'tf',
    q: 'Recommendations for further research are typically found at the **end** of the Discussion / Conclusion section.',
    answer: true, explain: 'True — Discussion มักจบด้วย recommendations for further research + limitations · บางครั้ง separate ออกเป็น Conclusion section ของตัวเอง',
    verified: 'Textbook p.110' },

  { id: 1108, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 KEY', tags: ['methods', 'study-design'], type: 'mcq',
    q: 'In Exercise 2 (Research Article I — bone density in baboons), the study design was identified as:',
    options: ['Case series', 'Quantitative observational study', 'Randomized controlled trial', 'Systematic review'],
    answer: 1, explain: 'Per KEY: "Quantitative research design (Observational study)" — researchers วัดข้อมูลโดยไม่แทรกแซงตัวอย่าง',
    verified: 'Exercise 2 KEY p.23' },

  { id: 1109, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 KEY', tags: ['methods', 'study-design'], type: 'mcq',
    q: 'In Exercise 2 (Research Article II — Newcastle disease in Oman), the study design was:',
    options: ['Case-control study', 'Cohort study', 'Survey study', 'Randomized clinical trial'],
    answer: 2, explain: 'Per KEY: "Survey study" — ใช้แบบสอบถาม + เก็บ serum samples จาก backyard chicken flocks',
    verified: 'Exercise 2 KEY p.25' },

  // ═══════════════════════════════════════════════════════════
  // Research Designs (Unit 4)
  // ═══════════════════════════════════════════════════════════
  { id: 1110, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.104', tags: ['case-control'], type: 'mcq',
    q: 'A study compares dogs with **lymphoma (cases)** to dogs without lymphoma (controls), looking back at their dietary history. This is a:',
    options: ['Cohort study', 'Case-control study', 'Cross-sectional study', 'Randomized controlled trial'],
    answer: 1, explain: 'Case-control = compare กลุ่มมีโรค (cases) vs ไม่มีโรค (controls) **retrospectively** — ดี risk factors โดยเฉพาะ rare diseases',
    verified: 'Textbook p.104' },

  { id: 1111, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.104', tags: ['cohort'], type: 'mcq',
    q: 'A study **follows 500 dogs over 5 years** to see who develops cancer. This is a:',
    options: ['Case report', 'Case-control study', 'Cohort study', 'Cross-sectional study'],
    answer: 2, explain: 'Cohort = ตามกลุ่มผ่านเวลา (prospective) → ดี **incidence + risk** ของโรค · ตรงข้ามกับ case-control ที่มอง retrospective',
    verified: 'Textbook p.104' },

  { id: 1112, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.104', tags: ['rct', 'gold-standard'], type: 'mcq',
    q: 'Which study design is considered the **gold standard** for testing the effect of a new treatment, because it eliminates **selection bias**?',
    options: [
      'Case series',
      'Cohort study',
      'Randomized Controlled Trial (RCT)',
      'Cross-sectional study',
    ],
    answer: 2, explain: 'RCT = Controlled Clinical Trial + **random assignment** ของ subjects ไป arms · random ทำให้ทุกคนมีโอกาสได้แต่ละ treatment เท่ากัน → no selection bias',
    verified: 'Textbook p.104-105' },

  { id: 1113, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.105', tags: ['rct', 'pseudo'], type: 'tf',
    q: 'Assigning subjects to treatment arms by **coin toss or odd/even numbers** is considered true randomization in an RCT.',
    answer: false, explain: 'False — coin toss + odd/even = **pseudo-randomization** · ต้องใช้ machine-generated random number tables เป็น true random',
    verified: 'Textbook p.105' },

  { id: 1114, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.104', tags: ['case-report'], type: 'mcq',
    q: 'A veterinarian writes up the clinical presentation of **one unusual case** of a rare tumor. This is a:',
    options: ['Case report', 'Case series', 'Cohort study', 'Cross-sectional study'],
    answer: 0, explain: 'Case report = write-up ของ individual patient เพียง 1 ราย — มักเป็น first report ของ new disease หรือ trend',
    verified: 'Textbook p.104' },

  { id: 1115, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.104', tags: ['case-series'], type: 'mcq',
    q: 'A clinic publishes a description of **10 dogs that all received the same novel chemo protocol**. This is a:',
    options: ['Case report', 'Case series', 'Case-control study', 'Cohort study'],
    answer: 1, explain: 'Case series = หลายรายที่ได้ similar treatment · no control group · larger than case report (1 case) · ไม่ใช่ analytic',
    verified: 'Textbook p.104' },

  { id: 1116, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.104', tags: ['cross-sectional'], type: 'mcq',
    q: 'A descriptive study that **counts how many dogs in Bangkok have obesity at one point in time** is a:',
    options: ['Cohort study', 'Case-control study', 'Cross-sectional study', 'Clinical trial'],
    answer: 2, explain: 'Cross-sectional = snapshot ณ เวลาใดเวลาหนึ่ง · ดี prevalence (ความชุก) · ไม่ตามผ่านเวลา',
    verified: 'Textbook p.104' },

  { id: 1117, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.104', tags: ['controlled-trial'], type: 'mcq',
    q: 'What is the difference between a **Clinical Trial** and a **Controlled Clinical Trial**?',
    options: [
      'Clinical trials use animals, controlled trials use humans',
      'Controlled trials have a **control group** receiving comparison treatment or placebo',
      'Clinical trials are retrospective, controlled trials are prospective',
      'There is no difference',
    ],
    answer: 1, explain: 'Controlled CT = clinical trial **+ control group** (placebo/no treatment) · เพิ่ม control group ทำให้ rigorous กว่า · RCT เพิ่ม random assignment ลงไปอีก',
    verified: 'Textbook p.104' },

  { id: 1118, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.104', tags: ['observational-vs-experimental'], type: 'mcq',
    q: 'Which set of designs are all **observational** (no intervention by the researcher)?',
    options: [
      'Case report, Case-control, Cohort, Cross-sectional',
      'RCT, Clinical trial, Controlled CT, Case report',
      'Cohort, RCT, Cross-sectional, Case series',
      'Case-control, RCT, Cohort, Clinical trial',
    ],
    answer: 0, explain: 'Observational = ผู้วิจัยสังเกต ไม่แทรกแซง: case report, case series, case-control, cohort, cross-sectional · Experimental/Interventional = clinical trial, controlled CT, RCT (มีการให้ treatment)',
    verified: 'Textbook p.104' },

  { id: 1119, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.104', tags: ['case-control', 'rare-disease'], type: 'tf',
    q: 'Case-control studies are particularly **good for studying rare diseases** but tend to have lower data quality.',
    answer: true, explain: 'True — case-control เริ่มจาก disease (rare ก็หาได้) แล้วมองย้อน → efficient สำหรับ rare diseases · แต่ retrospective data → recall bias + missing data',
    verified: 'Textbook p.104' },

  // ═══════════════════════════════════════════════════════════
  // Academic Writing (Unit 5)
  // ═══════════════════════════════════════════════════════════
  { id: 1120, subject: 'engprof', topic: 'academic-writing', year: 4,
    source: 'Textbook p.122', tags: ['paper-types'], type: 'mcq',
    q: 'Which sequence describes the structure of a **review article**?',
    options: [
      'Introduction → Methods → Results → Discussion',
      'Introduction → Case Description → Discussion → Conclusion',
      'Introduction → Body paragraphs (subheadings) → Conclusion',
      'Abstract → References only',
    ],
    answer: 2, explain: 'Review article: Intro (statement of problem + scope) → Body paragraphs marked by **subheadings** → Conclusion · ต่างจาก research paper (IMRD) และ case report (Intro/Case Desc/Discussion)',
    verified: 'Textbook p.122-123' },

  { id: 1121, subject: 'engprof', topic: 'academic-writing', year: 4,
    source: 'Textbook p.122', tags: ['paper-types', 'editorial'], type: 'mcq',
    q: 'A **case report** typically follows which structure?',
    options: [
      'Introduction → Methodology → Results → Discussion',
      'Introduction → Case Description → Discussion → Conclusion',
      'Introduction → Body → Conclusion (with subheadings)',
      'Statement of problem → Evidence → Counterevidence → Conclusion',
    ],
    answer: 1, explain: 'Case report = Intro → **Case Description** (clinical details ของ patient) → Discussion → Conclusion · ต่างจาก research paper ที่มี methods/results',
    verified: 'Textbook p.122' },

  { id: 1122, subject: 'engprof', topic: 'academic-writing', year: 4,
    source: 'Textbook p.127', tags: ['steps'], type: 'mcq',
    q: 'According to the textbook, the **first step** in writing an academic review paper is:',
    options: [
      'Write the first draft',
      'Prepare a tentative outline',
      'Select a subject and narrow it to a topic',
      'Prepare a preliminary bibliography',
    ],
    answer: 2, explain: 'Step 1 = Select subject + narrow ลงเป็น specific topic · ก่อนจะอ่าน หา references หรือ outline ใดๆ',
    verified: 'Textbook p.127' },

  { id: 1123, subject: 'engprof', topic: 'academic-writing', year: 4,
    source: 'Textbook p.140', tags: ['introduction', 'components'], type: 'mcq',
    q: 'According to Lester and Lester, an introduction has 4 components: Subject, Background, Problem, and:',
    options: ['Conclusion', 'Methods', 'Thesis', 'Results'],
    answer: 2, explain: '4 components: Subject (specific topic) + Background (history) + Problem (objectives) + **Thesis** (direction of article)',
    verified: 'Textbook p.140' },

  { id: 1124, subject: 'engprof', topic: 'academic-writing', year: 4,
    source: 'Textbook p.140', tags: ['introduction', 'methods'], type: 'mcq',
    q: 'Which of the following is NOT one of the 5 standard methods of writing an introduction listed in the textbook?',
    options: [
      'General-to-specific method',
      'Using a quotation',
      'Using statistics or facts',
      'Listing all references first',
    ],
    answer: 3, explain: '5 methods = (1) general-to-specific (2) opposite idea (3) explanation of topic (4) quotation (5) statistics/facts · "List references first" ไม่ใช่ method',
    verified: 'Textbook p.140' },

  { id: 1125, subject: 'engprof', topic: 'academic-writing', year: 4,
    source: 'Textbook p.141', tags: ['conclusion'], type: 'mcq',
    q: 'Which is NOT one of the 5 ways to develop a conclusion mentioned in the textbook?',
    options: [
      'Restate the main idea',
      'Summarize the main points',
      'State recommendations for further research',
      'Introduce new evidence not in the body',
    ],
    answer: 3, explain: '5 ways = restate main idea / summarize main points / provide solution-prediction-recommendation / state limitations / refer to other studies · **Never** introduce new evidence in conclusion',
    verified: 'Textbook p.141' },

  { id: 1126, subject: 'engprof', topic: 'academic-writing', year: 4,
    source: 'Textbook p.132', tags: ['ama-citation'], type: 'mcq',
    q: 'In **AMA citation style**, in-text citations are formatted as:',
    options: [
      '(Author, Year)',
      'Author (Year)',
      'Superscript Arabic numbers (¹ ² ³)',
      '[Author] [Page number]',
    ],
    answer: 2, explain: 'AMA = superscript Arabic numbers · เรียงตาม order ของการปรากฏใน paper · ต่างจาก APA ที่ใช้ (Author, Year)',
    verified: 'Textbook p.132' },

  { id: 1127, subject: 'engprof', topic: 'academic-writing', year: 4,
    source: 'Textbook p.132', tags: ['ama-citation'], type: 'mcq',
    q: 'In AMA style, when a paper has **3 or more authors**, the in-text citation uses:',
    options: [
      'All last names',
      'First author last name + "et al"',
      'Last author only',
      'No author names — just the number',
    ],
    answer: 1, explain: 'AMA: 1 author = name · 2 authors = both names · **3+ authors = first author + "et al"** + superscript number · ใน reference list 6 หรือน้อยกว่า list ทั้งหมด, 7+ list first 3 + et al',
    verified: 'Textbook p.132' },

  { id: 1128, subject: 'engprof', topic: 'academic-writing', year: 4,
    source: 'Textbook p.144', tags: ['plagiarism'], type: 'tf',
    q: 'Ideas or information that are common knowledge **must always be cited** in an academic paper.',
    answer: false, explain: 'False — common knowledge **ไม่ต้อง cite** · เฉพาะ ideas/information ที่ไม่ใช่ของเรา + ไม่ใช่ common knowledge ต้อง cite — ไม่งั้น = plagiarism',
    verified: 'Textbook p.144' },

  // ═══════════════════════════════════════════════════════════
  // Paraphrasing (Unit 5)
  // ═══════════════════════════════════════════════════════════
  { id: 1130, subject: 'engprof', topic: 'paraphrasing', year: 4,
    source: 'Textbook p.149', tags: ['techniques'], type: 'mcq',
    q: 'Which is NOT one of the 5 paraphrasing techniques listed in the textbook?',
    options: [
      'Using synonyms',
      'Changing active and passive verb forms',
      'Inventing new information not in the original',
      'Changing sentence structures',
    ],
    answer: 2, explain: '5 techniques = synonyms / active↔passive / parts of speech / sentence markers / sentence structures · **Never invent material** — ทำลาย accuracy ของ paraphrase',
    verified: 'Textbook p.149' },

  { id: 1131, subject: 'engprof', topic: 'paraphrasing', year: 4,
    source: 'Textbook p.147', tags: ['definition'], type: 'mcq',
    q: 'What is the correct definition of paraphrasing?',
    options: [
      'Copying the original text word-for-word with quotation marks',
      'Retelling another person\'s ideas in your own words while preserving the meaning',
      'Adding your own opinion to make the writing more persuasive',
      'Translating the text into a different language',
    ],
    answer: 1, explain: 'Paraphrasing = retell ideas in **your own words** + **same meaning** · ห้ามเปลี่ยน original idea · ห้ามเพิ่ม opinion · ต้อง cite source',
    verified: 'Textbook p.147' },

  { id: 1132, subject: 'engprof', topic: 'paraphrasing', year: 4,
    source: 'Textbook p.147-148', tags: ['acceptable'], type: 'mcq',
    q: 'Original: "If the existence of a signing ape was unsettling for linguists, it was also startling news for animal behaviorists." Which of the following is the **acceptable** paraphrase?',
    options: [
      'Davis observed that the existence of a signing ape unsettled linguists and startled animal behaviorists.',
      'Davis observed that if the presence of a sign-language-using chimp was disturbing for scientists studying language, it was also surprising to scientists studying animal behavior.',
      'Davis observed both linguists and animal behaviorists were taken by surprise upon learning of an ape\'s ability to use sign language.',
      'A signing ape was very surprising news.',
    ],
    answer: 2, explain: 'Acceptable: เปลี่ยนทั้ง word choice + structure + grammar pattern → own words ★ · Option 0 = unacceptable borrowing of phrases · Option 1 = unacceptable borrowing of structure (if X, also Y) · Option 3 = ไม่ cite + ไม่ใช่ paraphrase ที่สมบูรณ์',
    verified: 'Textbook p.147-148' },

  { id: 1133, subject: 'engprof', topic: 'paraphrasing', year: 4,
    source: 'Textbook p.149', tags: ['active-passive'], type: 'mcq',
    q: 'Original: "Researchers collected 234 questionnaires from poultry farmers." Which paraphrase uses the **change active to passive voice** technique?',
    options: [
      'Researchers gathered 234 surveys from poultry farmers.',
      '234 questionnaires were collected from poultry farmers by researchers.',
      'The researchers obtained 234 forms by surveying poultry farmers.',
      'Out of all poultry farmers approached, 234 returned their questionnaires.',
    ],
    answer: 1, explain: 'Active → Passive: subject (234 questionnaires) + were + past participle (collected) + by-phrase (by researchers)',
    verified: 'Textbook p.149' },

  { id: 1134, subject: 'engprof', topic: 'paraphrasing', year: 4,
    source: 'Textbook p.149', tags: ['parts-of-speech'], type: 'mcq',
    q: 'Original: "Cats are **susceptible** (adj) to feline parvovirus." Which paraphrase changes the **part of speech**?',
    options: [
      'Cats are sensitive to feline parvovirus.',
      'Feline parvovirus can infect cats easily.',
      'Cats demonstrate **susceptibility** (noun) to feline parvovirus.',
      'Cats are vulnerable to the virus that causes panleukopenia.',
    ],
    answer: 2, explain: 'Adjective "susceptible" → Noun "susceptibility" + adjusted verb · Part of speech change · Option 0 = synonym only (still adj) · Option 1 = sentence structure change · Option 3 = synonym + adding context',
    verified: 'Textbook p.149' },

  { id: 1135, subject: 'engprof', topic: 'paraphrasing', year: 4,
    source: 'Textbook p.149', tags: ['markers'], type: 'mcq',
    q: 'Which of the following is a valid replacement for the sentence marker **"however"**?',
    options: [
      'Therefore',
      'Because',
      'Nevertheless',
      'For example',
    ],
    answer: 2, explain: 'However ↔ nevertheless · nonetheless · on the other hand (contrast) · "Therefore" = consequence · "Because" = reason · "For example" = illustration',
    verified: 'Textbook p.149' },

  { id: 1136, subject: 'engprof', topic: 'paraphrasing', year: 4,
    source: 'Textbook p.149', tags: ['markers'], type: 'mcq',
    q: 'Which marker can replace **"because"** as a paraphrasing technique?',
    options: ['However', 'Although', 'Since', 'Moreover'],
    answer: 2, explain: 'Because ↔ since · as · due to the fact that (reason/cause) · However = contrast · Although = concession · Moreover = addition',
    verified: 'Textbook p.149' },

  { id: 1137, subject: 'engprof', topic: 'paraphrasing', year: 4,
    source: 'Final Exam Spec', tags: ['marking', 'paraphrase-score'], type: 'mcq',
    q: 'In Final Part II marking, what would earn the paraphrasing score of **3 (full)**?',
    options: [
      'Copy all key phrases and sentences',
      'Minimally paraphrase and copy most key phrases',
      'Paraphrase using own words but copy some key phrases',
      'Paraphrase information using own words throughout',
    ],
    answer: 3, explain: 'Score 3 = paraphrase using **own words** (full credit) · 2 = own words but copy some key phrases · 1 = minimal paraphrase + copy most · 0 = copy all',
    verified: 'Final Exam Spec p.2' },

  { id: 1138, subject: 'engprof', topic: 'paraphrasing', year: 4,
    source: 'Textbook p.147', tags: ['plagiarism'], type: 'tf',
    q: 'When paraphrasing, you must **always cite the source** to avoid plagiarism.',
    answer: true, explain: 'True — paraphrase ≠ excuse to skip citation · ต้อง cite ทุกครั้งเสมอ — ไม่งั้น plagiarism (เปลี่ยนคำเฉยๆ ไม่ทำให้กลายเป็น original idea)',
    verified: 'Textbook p.147' },

  { id: 1139, subject: 'engprof', topic: 'paraphrasing', year: 4,
    source: 'Textbook p.147-148', tags: ['borrowing-of-structure'], type: 'tf',
    q: 'Replacing each word in a sentence with a synonym while keeping the original sentence structure is considered a **good paraphrase**.',
    answer: false, explain: 'False — แค่เปลี่ยน synonyms แต่ structure เดิม = "unacceptable borrowing of structure" · ต้องเปลี่ยน **both word choice AND structure** ถึงจะ acceptable',
    verified: 'Textbook p.147-148' },

  // ═══════════════════════════════════════════════════════════
  // Summary Writing (Unit 5 + Final Spec)
  // ═══════════════════════════════════════════════════════════
  { id: 1140, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Final Exam Spec', tags: ['marking', 'word-count'], type: 'mcq',
    q: 'In the Final Part II, the target summary length is 150 words. What is the penalty if your summary is **205 words long**?',
    options: ['No penalty', '-1 point (longer than 180)', '-2 points (longer than 200)', '-5 points'],
    answer: 2, explain: '205 > 200 → **-2 points** · 180-200 = -1 · ≤180 no penalty · นับคำให้ดีก่อนส่ง',
    verified: 'Final Exam Spec p.2' },

  { id: 1141, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Final Exam Spec', tags: ['marking', 'breakdown'], type: 'mcq',
    q: 'The Final Part II (Summary, 15 points total) is broken down into:',
    options: [
      'Content 5 + Grammar 5 + Length 5',
      'Content 7 + Organization & Grammar 5 + Paraphrasing 3',
      'Main idea 7 + Word choice 8',
      'Reading 10 + Writing 5',
    ],
    answer: 1, explain: '15 pts = Content **7** (main idea 1-2 + major details 1 each) + Org & Grammar **5** + Paraphrasing **3**',
    verified: 'Final Exam Spec p.2' },

  { id: 1142, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Textbook p.152', tags: ['procedure'], type: 'mcq',
    q: 'According to the textbook procedure, you should read the entire document **how many times** before writing the summary?',
    options: ['Once', 'Twice (first for sense, second to underline main points)', 'Three times', 'Until you memorize it'],
    answer: 1, explain: 'Read **twice**: 1st for sense of WHAT it says + HOW · 2nd to underline main points + eliminate secondary',
    verified: 'Textbook p.152' },

  { id: 1143, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Textbook p.152', tags: ['procedure'], type: 'mcq',
    q: 'Which of the following should you **NOT** include in a summary?',
    options: [
      'The main idea of the original',
      'Major supporting details',
      'Your own opinion or judgement on the original',
      'A clear opening statement',
    ],
    answer: 2, explain: 'Summary = **objective** condensation · ห้ามใส่ opinion/judgement ของตัวเอง · ห้าม invent material · ห้าม repeat exactly · เก็บแค่ main idea + key supporting details',
    verified: 'Textbook p.152' },

  { id: 1144, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Textbook p.156', tags: ['rules'], type: 'mcq',
    q: 'When writing a summary, what should you do with **illustrations, examples, and quotations** from the original?',
    options: [
      'Include all of them word-for-word',
      'Include them but with quotation marks',
      'Eliminate them — keep only main ideas + key supporting details',
      'Replace them with your own examples',
    ],
    answer: 2, explain: 'Eliminate illustrations, examples, quotations · เก็บเฉพาะ main idea + key supporting details · เพื่อ condense ให้ concise',
    verified: 'Textbook p.156' },

  { id: 1145, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Final Exam Spec', tags: ['content-marking'], type: 'mcq',
    q: 'In the Content (7 points) section of the Final marking, how are the points distributed?',
    options: [
      'Spelling 7 points',
      'Main idea 1-2 points + Major details 1 point each',
      'Word count 7 points',
      'Grammar 7 points',
    ],
    answer: 1, explain: 'Content 7 pts = main idea (1-2) + major details (1 pt each) · ยิ่ง identify key details ได้มาก ยิ่งคะแนนสูง',
    verified: 'Final Exam Spec p.1' },

  { id: 1146, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Textbook p.152', tags: ['rewrite'], type: 'tf',
    q: 'When rewriting a summary, you should begin with a **clear statement of the longer document\'s main idea**.',
    answer: true, explain: 'True — Step 3a per textbook: "Begin with a clear statement of the longer document\'s main idea" · เป็น topic sentence ของ summary',
    verified: 'Textbook p.152' },

  { id: 1147, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Textbook p.152', tags: ['concision'], type: 'tf',
    q: 'A summary should **repeat key phrases exactly as they appear in the original**, even if it makes the writing longer.',
    answer: false, explain: 'False — "Never repeat material, even if the original does" + "use your own words whenever possible" · Repeating original = paraphrasing fail + makes it less concise',
    verified: 'Textbook p.152' },

  { id: 1148, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Final Exam Spec p.1 (Org rubric)', tags: ['transitions'], type: 'mcq',
    q: 'To earn **5/5 (top score) in Organization** in the Final summary marking, what is needed?',
    options: [
      'Many sentences but no transitions',
      'Connected ideas making the writing flow + excellent transitions + statements coincide with original',
      'Random order with creative ideas',
      'Lots of opinions about the topic',
    ],
    answer: 1, explain: 'Score 5 Organization = ideas connected (flow) + excellent transitions (However, Moreover, Therefore...) + all statements coincide with original',
    verified: 'Final Exam Spec p.1' },

  { id: 1149, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Final Exam Spec p.1', tags: ['grammar'], type: 'mcq',
    q: 'For top score (5) in **Grammar, Mechanics, and Conventions**, the summary should have:',
    options: [
      'Many fragment sentences for emphasis',
      'Few or no spelling/grammatical errors, no run-ons or fragments, accurate punctuation',
      'Creative use of capitalization',
      'Multiple complex sentences regardless of correctness',
    ],
    answer: 1, explain: 'Score 5 = few/no errors + no run-on sentences + no fragments + accurate capitalization + accurate punctuation',
    verified: 'Final Exam Spec p.1' },

  // ═══════════════════════════════════════════════════════════
  // Bonus: Reading-comprehension style (mimics Part I exam pattern)
  // ═══════════════════════════════════════════════════════════
  { id: 1150, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.100-102 (Pet-Human Relationships article)', tags: ['mdors', 'reading'], type: 'mcq',
    q: 'In the textbook example article "Pet-Human Relationships: Dogs versus Cats", the **purpose** of the study was to:',
    options: [
      'Determine which species lives longer',
      'Compare dog-owner vs cat-owner relationships using MDORS/CORS scales',
      'Identify the prevalence of zoonotic diseases',
      'Test a new vaccine for cats',
    ],
    answer: 1, explain: 'Purpose of study (อยู่ใน Introduction): "compare the dog-owner relationship with the cat-owner relationship based on the perceptions of people living with both dogs and cats"',
    verified: 'Textbook p.102' },

  { id: 1151, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.105 (MDORS article methods)', tags: ['mdors', 'reading'], type: 'mcq',
    q: 'In the same MDORS/CORS article, the **sampling method** was:',
    options: [
      'Random sampling from clinics',
      'Snowball sampling via SurveyMonkey + Facebook',
      'Census of all pet owners in Mexico',
      'Convenience sampling at vet offices',
    ],
    answer: 1, explain: 'Methodology: "Snowball sampling was used... An online system (SurveyMonkey.com) was used. The survey link was posted on the author\'s wall on Facebook"',
    verified: 'Textbook p.105' },

  { id: 1152, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.108-109', tags: ['mdors', 'results', 'reading'], type: 'tf',
    q: 'In the MDORS/CORS study results, **owners reported greater emotional closeness with cats than with dogs**.',
    answer: false, explain: 'False — actually opposite: "**greater emotional closeness with their dogs**" but lower perceived cost + greater interaction with cats · "the relationships with cats are better than relationships with dogs" overall',
    verified: 'Textbook p.108-109' },

  { id: 1153, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.114 (Effects of physical activity on dogs)', tags: ['reading'], type: 'mcq',
    q: 'In the article "Effects of physical activity on dog behavior", the questionnaire was divided into **how many sections**?',
    options: ['2', '3', '4', '5'],
    answer: 2, explain: '4 sections: (1) the dog (sex/age/repro status/origin) (2) the owner (sex/age/education/profession) (3) dog management (4) 44 multiple-choice questions about dog behavior',
    verified: 'Textbook p.114' },

  { id: 1154, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.114-115', tags: ['reading'], type: 'mcq',
    q: 'In the same physical activity study, what statistical test was used to analyze the data?',
    options: ['t-test', 'ANOVA', 'χ² (chi-square) test', 'Wilcoxon signed-rank'],
    answer: 2, explain: '"Statistical analysis of the data was performed with the **χ² test**" — chi-square ใช้สำหรับ categorical data + group comparison',
    verified: 'Textbook p.115' },

  { id: 1155, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Final Exam Spec', tags: ['exam-strategy'], type: 'mcq',
    q: 'In the Final Part I, you will be asked to do which of the following on a research paper?',
    options: [
      'Translate it into Thai',
      'Write a critique of the methodology',
      'Read the paper and answer short answers + true/false questions',
      'Recreate the figures from memory',
    ],
    answer: 2, explain: 'Per spec: "Read a research paper to understand different components of the papers and answer the questions – **short answers and true-false**"',
    verified: 'Final Exam Spec Part I' },
];
