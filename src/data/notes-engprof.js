// ============================================================
// Eng Vet Prof II Study Notes — Units 4-5 (Final exam scope)
// ============================================================
// Sources verified from:
//   - 5500419 Eng Vet Prof II Textbook (CULI, Chula Univ Language Institute)
//   - Exercise 1/2 + KEY (textbook practice)
//   - Final Exam Specification 2-2025 (28 เม.ย. 13:00-15:00)
//
// Body item types same as notes-com5.js
// ============================================================

export const NOTES_ENGPROF = {
  // ─────────────────────────────────────────────────────────────
  'research-paper-structure': {
    topic: 'research-paper-structure',
    title: 'ส่วนต่างๆ ของ Research Paper',
    lecturer: 'CULI Eng Vet Prof II',
    icon: '📑',
    summary: '4 ส่วนหลัก: Introduction (background+gap+objective) → Methodology (design/sample/instrument/data analysis) → Results (answer to research questions + tables/figures) → Discussion & Conclusion (interpret+implication+limitation+recommendation)',
    sections: [
      {
        heading: 'What is a research paper?',
        source: 'Textbook p.99',
        body: [
          'Research paper = academic writing ที่ผู้เขียนนำเสนอ analysis, interpretation, และ argument จาก research study ของตน',
          { sub: 'Research paper **คือ**',
            body: [
              { bullets: [
                'Original contribution to knowledge in the field',
                'การแสดงความรู้ของผู้เขียนต่อ topic + การใช้ resources',
              ] },
            ] },
          { sub: 'Research paper **ไม่ใช่**',
            body: [
              { bullets: [
                'A summary of topic',
                'An opinion essay',
                'A book report',
                'A summary ของงานเขียนของคนอื่น',
              ] },
            ] },
          { callout: 'รู้จักความแตกต่างนี้ — ข้อสอบอาจถาม "อะไรไม่ใช่ลักษณะของ research paper"', kind: 'tip' },
        ],
      },
      {
        heading: '4 Conventional Sections — IMRD format',
        source: 'Textbook p.99-110',
        body: [
          { table: {
            headers: ['Section', 'หน้าที่หลัก', 'ข้อมูลที่หาได้'],
            rows: [
              ['**1. Introduction**', 'Set context + show gap + state objectives',
                'Background, prior literature, gap in knowledge, **purpose / aim of the study**, expected outcomes'],
              ['**2. Methodology**', 'How the study was done (replicable)',
                'Research design, **population & sample**, instruments, data collection procedure, **statistical analysis**'],
              ['**3. Results**', 'Answer the research questions',
                '**Numerical findings**, tables, figures, key statistics — usually NO interpretation here'],
              ['**4. Discussion & Conclusion**', 'Interpret meaning + place in larger context',
                'Interpretation, **implications**, comparison vs prior studies, **limitations**, **recommendations for further research**'],
            ],
          } },
          { callout: 'จำให้แม่น: ข้อมูลที่อยู่ใน Methods (เช่น sample size, statistical test) จะ**ไม่อยู่ใน Results** หรือ Discussion · ถ้าโจทย์ถาม "what statistical test was used?" คำตอบมาจาก Methods', kind: 'flag' },
        ],
      },
      {
        heading: '1. Introduction — what to look for',
        source: 'Textbook p.100',
        body: [
          'Key purpose: ดึงความสนใจของผู้อ่าน + ให้ background พอที่จะเข้าใจ study',
          { bullets: [
            { label: 'Context & background', value: 'ทฤษฎีที่เกี่ยวข้อง · prior research · concepts ที่ผู้อ่านต้องรู้' },
            { label: 'Gap in literature', value: 'พื้นที่ที่ยังไม่มีคนศึกษา (= ทำไมงานนี้สำคัญ)' },
            { label: 'Research objectives / aims', value: 'บางครั้งอยู่ใน research question · มักอยู่ใน paragraph สุดท้าย' },
            { label: 'Expected outcomes', value: 'theoretical significance หรือ practical benefits' },
          ] },
          { callout: 'ข้อสอบ Part I ถามได้บ่อย: **"What was the purpose of the study?"** — คำตอบอยู่ใน Introduction (มักประโยคสุดท้าย)', kind: 'tip' },
        ],
      },
      {
        heading: '2. Methodology — what to look for',
        source: 'Textbook p.103',
        body: [
          { bullets: [
            { label: 'Research design', value: 'แบบไหน + ทำไมเลือก (cohort, case-control, RCT ฯลฯ — ดู Topic ถัดไป)' },
            { label: 'Population & sample', value: 'ใคร · กี่คน/ตัว · เลือกอย่างไร (sampling method) · recruit อย่างไร' },
            { label: 'Instruments / materials', value: 'แบบสอบถาม, อุปกรณ์, scale ที่ใช้ + การ validate' },
            { label: 'Data collection procedure', value: 'ทำการทดลองอย่างไร · ใช้ instrument อย่างไร' },
            { label: 'Data analysis method', value: 'สถิติที่ใช้ (descriptive · t-test · chi-square · ANOVA · Wilcoxon · Spearman · Kolmogorov-Smirnov ฯลฯ)' },
          ] },
          { callout: 'Part I มักให้ "tick (✓) ว่า Methods พูดถึง topic นี้ไหม + give more info" — ตอบแบบสั้น (1-2 วลี) อ้างคำในบทความ', kind: 'tip' },
        ],
      },
      {
        heading: '3. Results — what to look for',
        source: 'Textbook p.107-109',
        body: [
          'Key purpose: ตอบ research question ด้วยข้อมูล (ไม่ตีความ — ตีความใน Discussion)',
          { bullets: [
            'Often arranged เรียงตาม research objectives',
            'Includes both **text** + **illustrative materials** (tables, figures)',
            'Statistical significance values: **p < 0.05** = significant',
            'Tables มักใส่ Mean / SD / Median / p-value',
          ] },
          { callout: 'Part I T/F questions ส่วนใหญ่ดึงจาก Results — อ่านตาราง + ตัวเลขดีๆ ก่อนตอบ', kind: 'warn' },
        ],
      },
      {
        heading: '4. Discussion & Conclusion — what to look for',
        source: 'Textbook p.110',
        body: [
          'เริ่มด้วย summary ของผลที่ได้ + interpret meaning',
          { bullets: [
            { label: 'Interpretation', value: 'ผลที่ได้แปลว่าอะไร · ทำไมถึงเป็นแบบนั้น' },
            { label: 'Comparison vs prior studies', value: 'ตรงกับ literature เดิม หรือต่าง · ทำไมถึงต่าง' },
            { label: 'Implications', value: 'practical / clinical significance · ทำให้รู้อะไรเพิ่ม' },
            { label: 'Limitations', value: 'ข้อจำกัด (sample bias, gender bias, sample size, methodology limits)' },
            { label: 'Recommendations', value: 'further research ทางไหน · variable อะไรควรศึกษาเพิ่ม' },
          ] },
          { callout: 'Part I "What can be concluded from the study?" → ดูประโยคปิดท้าย Discussion · "What were the limitations?" → มักมีย่อหน้าเฉพาะ · "Recommendations?" → มักท้ายสุด', kind: 'tip' },
        ],
      },
      {
        heading: '🎯 Quick Reference — ข้อมูลแบบไหนอยู่ section ไหน',
        source: 'Textbook + Exam Spec',
        body: [
          { table: {
            headers: ['ถาม', 'คำตอบมาจาก section'],
            rows: [
              ['Purpose / aim / objective', 'Introduction'],
              ['Background ของโรค / topic', 'Introduction'],
              ['Sample size · ใครเป็นผู้เข้าร่วม', 'Methodology'],
              ['Statistical test ที่ใช้', 'Methodology'],
              ['Research design (cohort, RCT ฯลฯ)', 'Methodology'],
              ['Mean / SD / p-value', 'Results'],
              ['Tables / figures + ตัวเลข', 'Results'],
              ['Interpretation / meaning', 'Discussion'],
              ['Comparison กับ studies ก่อนหน้า', 'Discussion'],
              ['Limitations of the study', 'Discussion'],
              ['Recommendations for further research', 'Discussion / Conclusion'],
              ['Conclusion / take-home message', 'Conclusion (ท้าย Discussion หรือแยก)'],
            ],
          } },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'research-design': {
    topic: 'research-design',
    title: 'Research Designs ที่ต้องรู้จัก',
    lecturer: 'CULI Eng Vet Prof II',
    icon: '🔬',
    summary: '8 designs หลัก: Case Report (1 ราย) · Case Series (หลายรายเหมือนๆ กัน) · Case-Control (โรค vs ไม่เป็นโรค, retrospective) · Cohort (ตามกาลเวลา, prospective) · Clinical Trial (intervention) · Controlled CT (มี control group) · RCT (random assignment) · Cross-sectional (snapshot)',
    sections: [
      {
        heading: 'Observational Studies',
        source: 'Textbook p.104',
        body: [
          'ผู้วิจัย**สังเกต**โดยไม่แทรกแซง (no intervention)',
          { sub: 'Case Report',
            body: [
              { bullets: [
                'เขียน case ของผู้ป่วย/สัตว์ป่วย **1 ราย**',
                'มักเป็นรายงานแรกของโรคใหม่หรือ disease trend',
                'ตัวอย่าง: "First case of FIP in a local cat colony"',
              ] },
            ] },
          { sub: 'Case Series',
            body: [
              { bullets: [
                'เขียน case ของ **หลายราย** ที่ได้รับ treatment คล้ายกัน',
                'No control group',
                'ตัวอย่าง: "10 dogs treated with novel chemo protocol"',
              ] },
            ] },
          { sub: 'Case-Control Study',
            body: [
              { bullets: [
                'เปรียบเทียบ **กลุ่มเป็นโรค (cases)** vs **กลุ่มไม่เป็นโรค (controls)**',
                'ดูย้อนหลัง = **Retrospective study**',
                'ดีสำหรับ **rare diseases** แต่ data quality อาจไม่ดีนัก',
                'ตัวอย่าง: "อะไรเป็น risk factor ของ canine lymphoma" → เลือกหมาเป็น lymphoma + หมาไม่เป็น แล้วเปรียบ exposure ในอดีต',
              ] },
            ] },
          { sub: 'Cohort Study',
            body: [
              { bullets: [
                'ตามกลุ่มคน/สัตว์ ผ่านเวลา = **Prospective**',
                'ดี risk + incidence ของโรค',
                'แบ่งเป็น exposed vs non-exposed → ตามดูว่าใครเป็นโรค',
                'ตัวอย่าง: "ตามหมาที่กิน raw food vs commercial 5 ปี → ใครเป็น GI disease บ่อยกว่า"',
              ] },
            ] },
          { sub: 'Cross-Sectional Study',
            body: [
              { bullets: [
                'Descriptive — count คนที่เป็นโรค + risk factor ใน point-in-time เดียว',
                'Snapshot — ไม่ตามผ่านเวลา',
                'ตัวอย่าง: "Survey หาความชุกของ obesity ในหมาในไทย ปี 2024"',
              ] },
            ] },
        ],
      },
      {
        heading: 'Interventional / Experimental Studies',
        source: 'Textbook p.104-105',
        body: [
          'ผู้วิจัย**แทรกแซง** subjects (ให้ treatment, intervention)',
          { sub: 'Clinical Trial',
            body: [
              { bullets: [
                'Subjects ได้รับ intervention',
                'อาจมีหลาย arms: Treatment A, B, placebo (ไม่จำเป็นต้องมี control)',
                'Best design สำหรับ testing intervention effects',
              ] },
            ] },
          { sub: 'Controlled Clinical Trial',
            body: [
              { bullets: [
                'Clinical trial **+ control group** (กลุ่มไม่ได้ intervention หรือได้ placebo)',
                'แข็งแกร่งกว่า uncontrolled trial',
              ] },
            ] },
          { sub: 'Randomized Controlled Trial (RCT) ⭐',
            body: [
              { bullets: [
                'Controlled CT **+ random assignment** ไป arms',
                'หลีกเลี่ยง **selection bias** — ทุก subject มีโอกาสได้แต่ละ arm เท่ากัน',
                'Random ใช้ machine-generated tables (ไม่ใช่ coin toss = pseudo-randomization)',
                '**Gold standard** ของ clinical research',
              ] },
            ] },
          { callout: 'ข้อสอบให้คำบรรยายแล้วถามว่า design อะไร → keywords ที่ช่วยได้: "follow over time" = Cohort · "compared cases vs controls" = Case-Control · "randomly assigned" = RCT · "single patient" = Case Report · "snapshot survey" = Cross-sectional', kind: 'flag' },
        ],
      },
      {
        heading: 'Other Designs ที่อาจเจอ',
        source: 'Textbook + Exercise 2',
        body: [
          { bullets: [
            { label: 'Survey study', value: 'แจกแบบสอบถามแล้วเก็บข้อมูล (Exercise 2 ใช้แบบนี้ — Newcastle disease in Oman)' },
            { label: 'Quantitative observational study', value: 'สังเกต + วัดเชิงปริมาณ (Exercise 2 ใช้ — bone density in baboons)' },
            { label: 'Qualitative study', value: 'สัมภาษณ์ + วิเคราะห์ theme (ไม่ใช่ตัวเลข)' },
            { label: 'Mixed-methods', value: 'ผสม quantitative + qualitative' },
            { label: 'Systematic review / Meta-analysis', value: 'ทบทวน + รวม results จาก studies เดิมหลายตัว' },
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'academic-writing': {
    topic: 'academic-writing',
    title: 'Writing Academic Papers',
    lecturer: 'CULI Eng Vet Prof II',
    icon: '🖋️',
    summary: '4 ประเภท paper: research / case report / editorial / review article. Review article = Intro → Body (subheadings) → Conclusion. 5 ขั้นตอนเขียน: Topic → Reading → Bibliography → Outline → Draft. AMA citation style ใน vet/medical.',
    sections: [
      {
        heading: 'ประเภทของ Academic Papers',
        source: 'Textbook p.122-123',
        body: [
          { table: {
            headers: ['Type', 'Structure', 'Purpose'],
            rows: [
              ['**Research Paper**', 'Intro → Methods → Results → Discussion/Conclusion', 'Original research findings'],
              ['**Case Report**', 'Intro → Case Description → Discussion/Conclusion', 'Document an unusual / interesting case'],
              ['**Editorial**', 'Intro [problem + tentative answer] → Supportive evidence → Counterevidence → Conclusion [final answer]', 'Author\'s critical opinion + argument'],
              ['**Review Article**', 'Intro [problem + scope] → Body (subheadings) → Conclusion', 'Synthesize + critique existing literature'],
            ],
          } },
          { callout: 'Editorial + Review article share features: statement of a problem + presentation of evidence/counterevidence + answer to problem', kind: 'tip' },
        ],
      },
      {
        heading: '5 Steps to Write a Review Article',
        source: 'Textbook p.127-156',
        body: [
          { sub: 'Step 1 — Select subject + narrow to a topic',
            body: [
              { bullets: [
                'Subject: stress, cancer, obesity, GM food, coronavirus...',
                'Topic = subject + specific angle (e.g., "stress and behaviors in pets")',
                'Topic ควรเป็น noun phrase, concise, มี keywords สำคัญ',
              ] },
            ] },
          { sub: 'Step 2 — Ask question + preliminary reading',
            body: [
              { bullets: [
                'ตั้ง tentative question(s) เพื่อ guide reading',
                'อ่าน background materials → take notes',
                'เลือกคำถามไม่กี่คำ — กำหนด scope',
              ] },
            ] },
          { sub: 'Step 3 — Prepare bibliography (working list of references)',
            body: [
              { bullets: [
                'List sources: books, articles, websites, videos',
                'Use **AMA reference style** ใน medical/vet',
              ] },
            ] },
          { sub: 'Step 4 — Prepare tentative outline',
            body: [
              { bullets: [
                'Roman numerals (I, II, III) = main points',
                'Capital letters (A, B, C) = major details',
                'Arabic numerals (1, 2, 3) = minor details',
                'Outline = roadmap ของ paper',
              ] },
            ] },
          { sub: 'Step 5 — Write the first draft',
            body: [
              { bullets: [
                'เริ่มที่ Introduction',
                'Body paragraphs (สำคัญที่สุด — มี content หลัก)',
                'จบที่ Conclusion',
              ] },
            ] },
        ],
      },
      {
        heading: 'Writing Introduction (4 components — Lester & Lester)',
        source: 'Textbook p.140',
        body: [
          { table: {
            headers: ['Component', 'หน้าที่'],
            rows: [
              ['**Subject**', 'Identify specific topic + define/limit/narrow it'],
              ['**Background**', 'Provide historical data + key sources related to topic'],
              ['**Problem**', 'Identify objectives or problems of the paper'],
              ['**Thesis**', 'Establish direction of the article'],
            ],
          } },
          { sub: 'Methods of introduction',
            body: [
              { bullets: [
                '1. **General-to-specific** — start broad → narrow to thesis',
                '2. **Opposite idea** — hook with contrast',
                '3. **Explanation of topic** — provide background',
                '4. **Quotation** — quote relevant source',
                '5. **Statistics/facts** — surprising numbers to capture interest',
              ] },
            ] },
          { sub: 'Useful expressions',
            body: [
              { bullets: [
                'This article deals with ___',
                'This paper is primarily aimed at ___',
                'The paper addresses the topic of ___',
                'This report describes / discusses / focuses on / examines / investigates / reviews ___',
              ] },
            ] },
        ],
      },
      {
        heading: 'Writing Conclusion + Body Paragraphs',
        source: 'Textbook p.141-144',
        body: [
          { sub: '5 ways to develop a conclusion',
            body: [
              { bullets: [
                '1. Restate the main idea',
                '2. Summarize the main points',
                '3. Provide solution / prediction / **recommendation for further research**',
                '4. State **limitations** of the study',
                '5. Refer to other studies',
              ] },
            ] },
          { sub: 'Useful expressions for "future research"',
            body: [
              { bullets: [
                'The challenge is to ___',
                'Further studies on ___ are needed/required/anticipated',
                'Future studies should concentrate on ___',
                'It will be interesting to see ___',
                'Future research should include ___',
              ] },
            ] },
          { sub: 'Body paragraphs — 2 source-using techniques',
            body: [
              { bullets: [
                '**Direct quotation** — word-for-word, ใช้ quotation marks หรือ indented (>4 lines)',
                '**Paraphrase / summary** — ใช้บ่อยกว่า (ดู topic ถัดไป)',
              ] },
            ] },
          { callout: '⚠️ ความคิด/ข้อมูลที่ไม่ใช่ของเรา + ไม่ใช่ common knowledge ต้อง cite — ไม่งั้น = **PLAGIARISM** → fail paper', kind: 'flag' },
        ],
      },
      {
        heading: 'AMA Citation Style — ที่ต้องรู้',
        source: 'Textbook p.132-134',
        body: [
          { sub: 'In-text citation',
            body: [
              { bullets: [
                'ใช้ **superscript Arabic numbers** (¹ ² ³)',
                'เรียงตาม order ที่ปรากฏใน paper',
                'อ้างซ้ำ → ใช้ตัวเลขเดิม',
                'Author name in-text: ใช้ last name + superscript (Smith¹) · 2 authors = ทั้งคู่ · 3+ = first author + "et al"',
              ] },
            ] },
          { sub: 'Reference list',
            body: [
              { bullets: [
                'Title = "**References**"',
                'เรียงตาม order ใน paper (ไม่ใช่ alphabetical แบบ APA)',
                'Journal titles = abbreviated + italics',
                'Sentence-style capitalization (capitalize เฉพาะคำแรก)',
                '6 authors หรือน้อยกว่า → list ทั้งหมด',
                '7 authors ขึ้นไป → first 3 + "et al"',
              ] },
            ] },
          { sub: 'Format examples',
            body: [
              { bullets: [
                { label: 'Journal article', value: 'Author. Title. Abbrev Journal. Year;vol(issue):pages. doi or URL' },
                { label: 'Book', value: 'Author(s). Title. Edition. City, State: Publisher; Year.' },
                { label: 'Website', value: 'Author. Title. Site name. URL. Pub date. Accessed date.' },
                { label: 'YouTube', value: 'Author. Title [Video]. YouTube. URL. Pub date. Accessed date.' },
              ] },
            ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  paraphrasing: {
    topic: 'paraphrasing',
    title: 'Paraphrasing Techniques',
    lecturer: 'CULI Eng Vet Prof II',
    icon: '🔁',
    summary: '5 techniques: (1) synonyms (2) active↔passive (3) parts of speech (4) sentence markers (5) sentence structures · Acceptable = แทนคำ + เปลี่ยนโครงสร้าง · Unacceptable = เปลี่ยนคำเล็กน้อย, structure คงเดิม, หรือคัดลอก',
    sections: [
      {
        heading: 'What is paraphrasing?',
        source: 'Textbook p.147',
        body: [
          'Paraphrasing = retelling another person\'s ideas **in your own words** while preserving meaning',
          { bullets: [
            'Original idea ห้ามเปลี่ยน (no opinion, no addition)',
            'ต้อง **cite source** เสมอ — ไม่งั้น plagiarism',
            'ใช้บ่อยกว่า direct quotation ใน academic writing',
          ] },
        ],
      },
      {
        heading: '5 Paraphrasing Techniques',
        source: 'Textbook p.149',
        body: [
          { sub: '1. Using synonyms — แทนคำด้วยคำที่มีความหมายเหมือน',
            body: [
              { bullets: [
                'Original: "Rabies is **distributed globally**"',
                'Paraphrase: "Rabies has a **worldwide distribution**"',
                '⚠️ ระวัง medical terms ที่ไม่มี synonym ที่ดี — เก็บไว้เลย (เช่น "rabies", "encephalitis")',
              ] },
            ] },
          { sub: '2. Changing active ↔ passive voice',
            body: [
              { bullets: [
                'Active: "Researchers **collected** 234 questionnaires"',
                'Passive: "234 questionnaires **were collected** by researchers"',
                'มักใช้ใน Methods section (passive voice ฟังเป็น formal กว่า)',
              ] },
            ] },
          { sub: '3. Changing parts of speech (พจน์)',
            body: [
              { bullets: [
                'Original: "Cats are **susceptible** to the virus"',
                'Paraphrase: "The virus has a **susceptibility** in cats"',
                'Adjective ↔ Noun · Verb ↔ Noun · Adjective ↔ Adverb',
              ] },
            ] },
          { sub: '4. Changing sentence markers (transitions)',
            body: [
              { bullets: [
                '**because** ↔ since · as · due to the fact that',
                '**however** ↔ nevertheless · nonetheless · on the other hand',
                '**therefore** ↔ thus · hence · consequently · as a result',
                '**although** ↔ though · even though · despite the fact that',
              ] },
            ] },
          { sub: '5. Changing sentence structures',
            body: [
              { bullets: [
                'Simple ↔ complex sentence',
                'รวม 2 sentences เป็น 1 (compound) หรือแยก 1 เป็น 2',
                'ย้าย clauses (เริ่มด้วย dependent clause vs main clause)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Acceptable vs Unacceptable Paraphrase',
        source: 'Textbook p.147-148',
        body: [
          { callout: 'ตัวอย่างจาก textbook — เปรียบเทียบเพื่อให้เห็นความแตกต่างชัด', kind: 'tip' },
          { sub: 'Original',
            body: [
              'If the existence of a signing ape was unsettling for linguists, it was also startling news for animal behaviorists (Davis 26).',
            ] },
          { sub: '❌ Unacceptable Borrowing of Phrases',
            body: [
              'Davis observed that **the existence of a signing ape unsettled linguists and startled animal behaviorists** (26).',
              { callout: 'เปลี่ยนคำเล็กน้อย แต่ยัง copy "existence of a signing ape" + "unsettled... startled" — phrase เดิม', kind: 'flag' },
            ] },
          { sub: '❌ Unacceptable Borrowing of Structure',
            body: [
              'Davis observed that if the presence of a sign-language-using chimp was disturbing for scientists studying language, it was also surprising to scientists studying animal behavior (26).',
              { callout: 'เปลี่ยน synonyms แต่ structure (if X, also Y) เหมือน original 100% — ไม่ผ่าน', kind: 'flag' },
            ] },
          { sub: '✓ Acceptable Paraphrase',
            body: [
              'Davis observed both linguists and animal behaviorists were taken by surprise upon learning of an ape\'s ability to use sign language (26).',
              { callout: 'เปลี่ยนทั้ง word choice + structure + grammar pattern → เป็น own words', kind: 'tip' },
            ] },
        ],
      },
      {
        heading: '🎯 Lead-in Techniques สำหรับอ้าง source',
        source: 'Textbook p.145',
        body: [
          { sub: 'Patterns บอกว่า "ใครพูดอะไร"',
            body: [
              { table: {
                headers: ['Subject', 'Verb pattern', 'Example'],
                rows: [
                  ['x (researcher / org)', 'has reported / found / suggested / stated that ___', 'Smith¹ has reported that...'],
                  ['A study by x', 'shows / finds / indicates / demonstrates that ___', 'A study by Lee² shows that...'],
                ],
              } },
            ] },
          'Useful expressions ตอน paraphrase:',
          { bullets: [
            '___ has shown that...',
            '___ were described by [author] as...',
            'It has been shown that...',
            'The study from [author] et al. has shown that...',
          ] },
        ],
      },
      {
        heading: '⚠️ Paraphrasing Score (3 points) ใน Final',
        source: 'Final Exam Spec',
        body: [
          { table: {
            headers: ['Score', 'Description'],
            rows: [
              ['**3**', 'Paraphrase using own words ★ goal'],
              ['**2**', 'Use own words แต่อาจ copy key phrases/sentences'],
              ['**1**', 'Minimally paraphrase + copy most key phrases'],
              ['**0**', 'Copy all key phrases + sentences'],
            ],
          } },
          { callout: 'จะได้ 3/3 ต้อง: เปลี่ยน words (synonyms) + เปลี่ยน structure (sentence pattern) + cite source · เปลี่ยนแค่ word ไม่พอ — structure เหมือน original = 1-2', kind: 'flag' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'summary-writing': {
    topic: 'summary-writing',
    title: 'Writing a Summary',
    lecturer: 'CULI Eng Vet Prof II',
    icon: '📝',
    summary: 'Summary = condensed objective version (ไม่ใส่ความคิดเห็น). Procedure: (1) อ่าน 2 รอบ (2) ขีดเส้น main idea (3) ตัด examples/details (4) เขียนใหม่ด้วยคำเอง. Final = 150 words target · เกิน 180 -1 · เกิน 200 -2 · marking: Content 7 + Org/Grammar 5 + Paraphrase 3 = 15',
    sections: [
      {
        heading: 'What is a Summary?',
        source: 'Textbook p.152',
        body: [
          'Summary = **condensation** ของ main idea จากบทความที่อ่าน',
          { bullets: [
            '**Objective** — ไม่ใส่ความคิดเห็น/judgement ของตัวเอง',
            '**Complete** — main idea + key supporting details',
            '**Accurate** — อิงเฉพาะข้อมูลจาก original (ห้าม invent)',
            'Goal: บอก reader ที่ยังไม่ได้อ่าน original ว่า main message คืออะไร',
          ] },
        ],
      },
      {
        heading: 'Procedure for Writing Summaries',
        source: 'Textbook p.152',
        body: [
          { sub: 'Step 1 — Read entire document **twice**',
            body: [
              { bullets: [
                'ครั้งแรก = get sense of WHAT it says + HOW',
                'ครั้งสอง = underline main points + eliminate secondary points',
              ] },
            ] },
          { sub: 'Step 2 — While reading 2nd time',
            body: [
              { bullets: [
                'a. Concentrate on **basic ideas only**',
                'b. Eliminate supporting facts, examples, data',
                'c. Eliminate illustrations, bibliographic references, quotations',
                'd. **Combine similar ideas** into single statements',
                'e. Avoid technical terminology when possible',
                'f. Condense as concisely as possible',
              ] },
            ] },
          { sub: 'Step 3 — Rewrite',
            body: [
              { bullets: [
                'a. Begin with **clear statement of main idea**',
                'b. Supply transitions between points',
                'c. Break into logical paragraphs (long summary)',
                'd. Use **own words**',
                'e. **Never** invent material',
                'f. **Never** repeat material exactly even if original does',
                'g. **Never** pass opinion/judgement on original',
              ] },
            ] },
        ],
      },
      {
        heading: '5 Rules to Remember (Final criteria)',
        source: 'Textbook p.156',
        body: [
          { bullets: [
            '1. Include **only important ideas + key supporting details**',
            '2. **Eliminate** illustrations, quotations, examples',
            '3. **Use own words** as much as possible',
            '4. **Avoid** inventing material / opinion / judgement on the original',
            '5. Write as **concisely + clearly** as possible',
          ] },
          { callout: '⚠️ Final exam criteria: Content (7 pts) — main idea (1-2) + major details (1 each) → ดูได้กี่ key points ก็ได้คะแนนเท่านั้น', kind: 'flag' },
        ],
      },
      {
        heading: 'Summary Marking Rubric (Final = 15 pts)',
        source: 'Final Exam Spec',
        body: [
          { sub: 'Content (7 pts)',
            body: [
              { bullets: [
                'Main idea (1-2 pts) — identify the central message',
                'Major details (1 pt each, ~5 details = 5 pts)',
              ] },
            ] },
          { sub: 'Organization & Grammar (5 pts)',
            body: [
              { table: {
                headers: ['Score', 'Organization', 'Grammar'],
                rows: [
                  ['**5**', 'Connected ideas, excellent transitions, statements coincide w/ original', 'Few/no errors, no run-ons/fragments, accurate punctuation'],
                  ['**4**', 'Logical order, good transitions, most coincide', 'Few errors, mostly accurate'],
                  ['**3**', 'Somewhat logical, partial transitions', 'Errors slightly interfere, occasional run-ons'],
                  ['**2**', 'Random order, illogical transitions, most don\'t coincide', 'Errors interfere, often run-ons'],
                  ['**1**', 'Not logical, no/illogical transitions', 'Errors block comprehension, mostly run-ons'],
                ],
              } },
            ] },
          { sub: 'Paraphrasing (3 pts)',
            body: [
              { bullets: [
                '3 = paraphrase using own words',
                '2 = own words แต่อาจ copy key phrases',
                '1 = minimally paraphrase + copy most',
                '0 = copy all',
              ] },
            ] },
          { callout: '⏱ Word count penalty: 150 target · 180+ → -1 · 200+ → -2 — **นับคำให้ดี**', kind: 'flag' },
        ],
      },
      {
        heading: '🎯 Strategy ใน Final exam (Part II)',
        source: 'Exam tips',
        body: [
          { bullets: [
            '1. **อ่านบทความ 2 รอบเร็วๆ** — รอบแรก get gist · รอบสอง mark main idea',
            '2. **Underline / list 1 main idea + 4-5 major details** บนกระดาษทด',
            '3. **เขียน topic sentence ก่อน** — main idea ที่ paraphrase แล้ว',
            '4. **เขียน supporting sentences** — แต่ละข้อ paraphrase + transition (However, Moreover, In addition, On the other hand)',
            '5. **เขียน concluding sentence** — restate main idea (optional แต่ดี)',
            '6. **นับคำ** ก่อนส่ง — เกิน 180 = -1, เกิน 200 = -2',
            '7. **ห้าม copy phrase ยาวๆ** — เปลี่ยนทั้งคำ + structure',
            '8. **ห้ามใส่ opinion** ของตัวเอง — บอกแค่สิ่งที่ original บอก',
          ] },
          { callout: 'Time budget: 2 ชม. รวม Part I (20 pts) + Part II (15 pts) → ให้ ~45-50 นาทีเขียน summary · 75-80 นาที reading questions', kind: 'tip' },
        ],
      },
      {
        heading: '✅ Sample Summary จาก KEY (Veterinary Medicine, Bats)',
        source: 'Exercise 2 KEY',
        body: [
          'ดูจาก Exercise 2 KEY — examples of key idea highlighting:',
          { bullets: [
            'Main idea = "what is veterinary medicine + scope"',
            'Major details = "history (2000 BCE)" + "contributions (vaccines, surgical techniques)" + "diversity challenge" + "training (basic + clinical)" + "modern roles"',
            '→ เขียน summary 150 words ที่ครอบคลุม main idea + 4-5 details ดังกล่าว ใน own words',
          ] },
          { sub: 'Sample summary structure (rough)',
            body: [
              { bullets: [
                'Sentence 1 (Main idea): "Veterinary medicine is the medical specialty focused on preventing, diagnosing, and treating diseases in animals while protecting human health from animal-borne illness."',
                'Sentences 2-5 (Details): history → contributions → diversity → training',
                'Sentence 6 (Conclusion): modern roles in clinical, government, research',
              ] },
            ] },
        ],
      },
    ],
  },
};
