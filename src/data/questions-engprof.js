// ============================================================
// Eng Vet Prof II Questions — Final Exam Mock (Units 4-5)
// ============================================================
// Final exam structure (28 เม.ย. 2569 13:00-15:00, 35 pts):
//   Part I  (20 pts) — Read research paper → short answers + T/F
//   Part II (15 pts) — Write 150-word summary using paraphrasing
//
// This file mirrors that structure:
//   • IDs 1100-1119  → Warm-up concept Qs (MCQ/TF) — keep these short
//                      so students can review key facts fast
//   • IDs 1130-1141  → MOCK PART I — Pet-Human Relationships passage
//                      (MDORS/CORS study from textbook p.100-112) with
//                      short-answer + T/F questions across all 4
//                      sections (Intro / Methods / Results / Discussion)
//   • ID  1145       → MOCK PART II — "Bats" passage (textbook p.154-155)
//                      with summary writing Q (essay type, 150-word target)
//
// Question types used:
//   mcq   — multiple choice (warm-up only)
//   tf    — true/false (warm-up + Part I)
//   short — free-form short answer text input (Part I)
//   essay — full writing question with word counter (Part II)
//
// ============================================================

// ──────────────────────────────────────────────────────────────
// PART I MOCK PASSAGE — Pet-Human Relationships (MDORS/CORS study)
// Reproduced from textbook p.100-112 (truncated/condensed for mock).
// ──────────────────────────────────────────────────────────────
const PASSAGE_PETS = `**Title: Pet-Human Relationships: Dogs versus Cats**

**Introduction**
In recent decades, interest in studying human-animal interactions has increased, and the results of such studies have revealed that owners of dogs and cats tend to have better physical health than non-owners or owners of other types of pets. Nevertheless, other research has shown no differences between dog owners and non-dog owners in self-reported mental health, general health, loneliness, or life satisfaction.

There are different scales to evaluate the owner-pet relationship. The **Monash dog owner relationship scale (MDORS)** is the most robust scale to measure quality of dog-owner relationship from the owner's perception. The MDORS was developed from social exchange theory, which specifies that relationships are maintained only when the perceived cost and benefits are balanced or when the perceived benefits are greater than the costs of the relationship. The scale has three subscales evaluating perceived emotional closeness, interaction, and perceived cost. Recently the MDORS was adapted to evaluate the cat-owner relationship (CORS).

The aim of this study was to compare the dog-owner relationship with the cat-owner relationship based on the perceptions of people living with both dogs and cats, considering the three aspects in the MDORS/CORS: interaction, emotional closeness, and perceived cost.

**Methodology**
The methodology and ethical aspects of this study were approved by researchers from the Universidad Autónoma de Nuevo León, Mexico (CAPS-20-19-11). Owners of both dogs and cats living in Mexico participated. **Snowball sampling** was used: an online system (SurveyMonkey.com) was used and the survey link was posted on the author's Facebook wall. In total, **132 people** who had at least one dog and one cat participated. Mean owner age was 35.6 years (SD 11.9); 86.4% were women. Each participant completed both the MDORS and the CORS.

To evaluate the difference between dog-owner vs cat-owner scores, the **Wilcoxon signed-rank statistical test** was used. Mann-Whitney U was used for pet-sex comparisons; Spearman correlation was used to analyze relationships with age. Nonparametric tests were used because scores did not fit a normal distribution per the Kolmogorov-Smirnov test (p < 0.05).

**Results**
Owners reported greater **interaction** and lower **perceived cost** with their cats, but greater **emotional closeness** with their dogs. The total CORS/MDORS score indicated that relationships with cats were better than relationships with dogs overall. This finding was confirmed when comparing male dogs and cats and when comparing female dogs and cats.

The cat-owner relationship was better with male cats specifically: greater emotional closeness and lower perceived cost. For dogs, the only significant difference between sexes was in emotional closeness, with a higher score for male dogs.

When evaluating correlation with the age of the companion animal, the only subscale with a significant negative correlation was **perceived cost**, both for cats (rs = -0.263; p = 0.002) and dogs (rs = -0.349; p = 0.001), indicating that **younger pets imply higher perceived cost** for owners.

**Discussion and Conclusion**
The participants indicated greater emotional closeness with their dogs than with their cats, indicating that people perceived greater social support, companionship, and unconditional love with dogs. However, scores for cats were higher for interaction and lower for perceived cost. Based on the balance between benefits and costs, the relationship overall was better with cats.

Among the limitations: most participants were women (only 18 men responded). Female bias in survey participation is widely reported in studies on dog/cat relationships. Future studies should include questions identifying where dogs and cats spend most time (indoors/outdoors), evaluate neuter/spay status differences, and assess the relationship between dogs and cats themselves.

Based on the results obtained, it was concluded that for this sample of participants residing in Mexico, **their relationship with cats was better than the relationship with their dogs**, due in large part to the fact that the perceived cost of the relationship with cats is less. Emotional closeness was greater with dogs than with cats.`;

// ──────────────────────────────────────────────────────────────
// PART II MOCK PASSAGE — "Bats" by Debbie Dean (textbook p.154-155)
// Used for summary writing practice. Model answer ("The Undervalued
// Bat") is in the textbook on p.155-156.
// ──────────────────────────────────────────────────────────────
const PASSAGE_BATS = `**Title: Bats** — by Debbie Dean

In the distant past, many people thought bats had magical powers, but times have changed. Today, many people believe that bats are rodents, that they cannot see, and that they are more likely than other animals to carry rabies. All of these beliefs are mistaken. Bats are not rodents, are not blind, and are no more likely than dogs and cats to transmit rabies. Bats, in fact, are among the least understood and least appreciated of animals.

Bats are not rodents with wings, contrary to popular belief. Like all rodents, bats are mammals, but they have a skeleton similar to the human skeleton. The bones in bat wings are much like those in arms and the human hand, with a thumb and four fingers. In bats, the bones of the arms and the four fingers of the hands are very long. This bone structure helps support the web of skin that stretches from the body to the ends of the fingers to form wings.

Although bats cannot see colors, they have good vision in both dim and bright light. Since most bats stay in darkness during the day and do their feeding at night, they do not use their vision to maneuver in the dark but use a process called echolocation. This process enables bats to emit sounds from their mouths that bounce off objects and allow them to avoid the objects when flying. They use this system to locate flying insects to feed on as well.

There are about 1,000 species of bat, ranging in size from the bumblebee bat (about an inch long) to the flying fox (sixteen inches long with a wingspan of five feet). Each type of bat has a specialized diet. For seventy percent of bats, the diet is insects. Other types of bats feed on flowers, pollen, nectar, and fruit or on small animals such as birds, mice, lizards, and frogs. One species of bat, the common vampire bat, feeds on the blood of large mammals — only in Latin America, and probably best known for feeding on cattle. Unfortunately, in attempts to control vampire bat populations, farmers have unintentionally killed thousands of beneficial fruit- and insect-eating bats as well.

Bats, in fact, perform a number of valuable functions. Their greatest economic value is in eliminating insect pests. Insect-eating bats can catch six hundred mosquitoes in an hour and eat half their body weight in insects every night. In many tropical rain forests, fruit-eating bats are the main means of spreading the seeds of tropical fruits. Nectar-feeding bats pollinate a number of tropical plants. If it were not for bats, we might not have peaches, bananas, mangoes, guavas, figs, or dates.

Today, the survival of many bat species is uncertain. Sixty percent of bats do not survive past infancy. Some are killed by predators such as owls, hawks, snakes and other meat-eating creatures, but most are victims of pesticides and other human intrusions. In Carlsbad Caverns, New Mexico, where there were once eight million bats, there are now a quarter million. At Eagle Creek, Arizona, the bat population dropped from thirty million to thirty thousand in six years.

Bats often have been burdened with a bad reputation, perhaps because they are not the warm, cuddly sort of animal we love to love. However, their unusual physical features should not lead us to overestimate their harm or underestimate their value.`;


export const QB_ENGPROF = [
  // ═══════════════════════════════════════════════════════════
  // WARM-UP — Concept questions (high-yield, no weird distractors)
  // IDs 1100-1119
  // ═══════════════════════════════════════════════════════════
  { id: 1100, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.99', tags: ['warmup', 'imrd'], type: 'mcq',
    q: 'A veterinary research paper conventionally consists of which 4 sections, in order?',
    options: [
      'Abstract → Methods → References → Discussion',
      'Introduction → Methodology → Results → Discussion / Conclusion',
      'Introduction → Discussion → Methods → Results',
      'Methods → Results → Introduction → Conclusion',
    ],
    answer: 1, explain: 'IMRD format = Introduction → Methodology → Results → Discussion / Conclusion',
    verified: 'Textbook p.99' },

  { id: 1101, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.100', tags: ['warmup', 'introduction'], type: 'mcq',
    q: 'In which section would you find the **purpose / aim of the study**?',
    options: ['Introduction (often last paragraph)', 'Methodology', 'Results', 'References'],
    answer: 0, explain: 'Purpose / aim / objective อยู่ใน Introduction มักประโยคสุดท้ายของ section',
    verified: 'Textbook p.100' },

  { id: 1102, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.103', tags: ['warmup', 'methodology'], type: 'mcq',
    q: 'Information about **statistical tests used** to analyze the data goes in which section?',
    options: ['Introduction', 'Methodology', 'Results', 'Conclusion'],
    answer: 1, explain: 'Methodology บอก data analysis method (เช่น t-test, chi-square, Wilcoxon, ฯลฯ)',
    verified: 'Textbook p.103' },

  { id: 1103, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.107', tags: ['warmup', 'results'], type: 'tf',
    q: 'The Results section is the appropriate place to **interpret the meaning** of the findings.',
    answer: false, explain: 'False — Results เพียงแค่รายงานข้อมูล (ตัวเลข, tables, figures) · การ interpret meaning อยู่ใน Discussion',
    verified: 'Textbook p.107' },

  { id: 1104, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.110', tags: ['warmup', 'discussion'], type: 'mcq',
    q: 'Which of the following is typically found in the **Discussion** section?',
    options: [
      'Sample recruitment method',
      'Mean and SD of variables',
      'Limitations of the study and recommendations for further research',
      'Definition of technical terms',
    ],
    answer: 2, explain: 'Discussion = interpret + compare to prior literature + state limitations + recommend further research',
    verified: 'Textbook p.110' },

  { id: 1105, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.104', tags: ['warmup'], type: 'mcq',
    q: 'A study **follows 500 dogs over 5 years** to see who develops cancer. This is a:',
    options: ['Case report', 'Case-control study', 'Cohort study', 'Cross-sectional study'],
    answer: 2, explain: 'Cohort = ตามกลุ่มผ่านเวลา (prospective) → ดี incidence + risk',
    verified: 'Textbook p.104' },

  { id: 1106, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.104', tags: ['warmup'], type: 'mcq',
    q: 'A study compares dogs **with lymphoma (cases)** to dogs **without lymphoma (controls)** by looking back at their dietary history. This is a:',
    options: ['Cohort study', 'Case-control study', 'Cross-sectional study', 'Randomized controlled trial'],
    answer: 1, explain: 'Case-control = compare มีโรค vs ไม่มีโรค ย้อนหลัง (retrospective) — ดีสำหรับ rare diseases',
    verified: 'Textbook p.104' },

  { id: 1107, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.105', tags: ['warmup', 'rct'], type: 'mcq',
    q: 'Which design is the **gold standard** for testing the effect of a new treatment?',
    options: ['Case series', 'Cross-sectional', 'Cohort', 'Randomized Controlled Trial (RCT)'],
    answer: 3, explain: 'RCT = Controlled Clinical Trial + random assignment → eliminates selection bias',
    verified: 'Textbook p.104-105' },

  { id: 1108, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.105', tags: ['warmup'], type: 'tf',
    q: 'Coin tosses or odd/even number assignment counts as **true randomization** in an RCT.',
    answer: false, explain: 'False — coin toss / odd-even = pseudo-randomization · ต้องใช้ machine-generated random tables',
    verified: 'Textbook p.105' },

  { id: 1109, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.104', tags: ['warmup', 'cross-sectional'], type: 'mcq',
    q: 'A descriptive study that **counts how many dogs in Bangkok have obesity in 2024** (one point in time) is a:',
    options: ['Cohort study', 'Case-control study', 'Cross-sectional study', 'Clinical trial'],
    answer: 2, explain: 'Cross-sectional = snapshot ณ จุดเวลาเดียว · ดี prevalence',
    verified: 'Textbook p.104' },

  { id: 1110, subject: 'engprof', topic: 'paraphrasing', year: 4,
    source: 'Textbook p.149', tags: ['warmup'], type: 'mcq',
    q: 'Which is **NOT** one of the 5 paraphrasing techniques?',
    options: [
      'Using synonyms',
      'Changing active and passive verb forms',
      'Inventing new information not in the original',
      'Changing sentence structures',
    ],
    answer: 2, explain: '5 techniques = synonyms / active↔passive / parts of speech / sentence markers / sentence structures · NEVER invent material',
    verified: 'Textbook p.149' },

  { id: 1111, subject: 'engprof', topic: 'paraphrasing', year: 4,
    source: 'Textbook p.147-148', tags: ['warmup', 'acceptable'], type: 'mcq',
    q: 'Original: *"If the existence of a signing ape was unsettling for linguists, it was also startling news for animal behaviorists."* Which is the **acceptable** paraphrase?',
    options: [
      'Davis observed that the existence of a signing ape unsettled linguists and startled animal behaviorists.',
      'Davis observed that if the presence of a sign-language-using chimp was disturbing for scientists studying language, it was also surprising to scientists studying animal behavior.',
      'Davis observed both linguists and animal behaviorists were taken by surprise upon learning of an ape\'s ability to use sign language.',
      'A signing ape was very surprising news.',
    ],
    answer: 2, explain: 'Acceptable = เปลี่ยน word choice + structure → own words. Option 0 = borrow phrases. Option 1 = borrow structure (if X, also Y). Option 3 = no citation + incomplete',
    verified: 'Textbook p.147-148' },

  { id: 1112, subject: 'engprof', topic: 'paraphrasing', year: 4,
    source: 'Textbook p.149', tags: ['warmup', 'markers'], type: 'mcq',
    q: 'Which marker is a valid replacement for **"however"**?',
    options: ['Therefore', 'Because', 'Nevertheless', 'For example'],
    answer: 2, explain: 'However ↔ nevertheless / nonetheless / on the other hand (contrast). Therefore = consequence; Because = reason; For example = illustration',
    verified: 'Textbook p.149' },

  { id: 1113, subject: 'engprof', topic: 'paraphrasing', year: 4,
    source: 'Textbook p.147', tags: ['warmup', 'plagiarism'], type: 'tf',
    q: 'When you paraphrase, you must **always cite the source** to avoid plagiarism.',
    answer: true, explain: 'True — paraphrase ≠ excuse to skip citation · เปลี่ยนคำเฉยๆ ไม่ทำให้กลายเป็น original idea ของเรา',
    verified: 'Textbook p.147' },

  { id: 1114, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Final Exam Spec', tags: ['warmup', 'word-count'], type: 'mcq',
    q: 'In Final Part II, the target summary length is **150 words**. What penalty applies if your summary is **205 words**?',
    options: ['No penalty', '−1 point (over 180)', '−2 points (over 200)', '−5 points'],
    answer: 2, explain: '205 > 200 → −2 points. The penalty zones: ≤ 180 = OK · 181-200 = −1 · > 200 = −2',
    verified: 'Final Exam Spec p.2' },

  { id: 1115, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Final Exam Spec', tags: ['warmup', 'rubric'], type: 'mcq',
    q: 'Final Part II (Summary, 15 points) is divided into:',
    options: [
      'Content 5 + Grammar 5 + Length 5',
      'Content 7 + Organization & Grammar 5 + Paraphrasing 3',
      'Main idea 7 + Word choice 8',
      'Reading 10 + Writing 5',
    ],
    answer: 1, explain: '15 pts = Content 7 (main idea 1-2 + key details 1 each) + Org & Grammar 5 + Paraphrasing 3',
    verified: 'Final Exam Spec p.2' },

  { id: 1116, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Textbook p.152', tags: ['warmup', 'rules'], type: 'mcq',
    q: 'Which should you NOT include in a summary?',
    options: ['The main idea of the original', 'Major supporting details', 'Your own opinion or judgement on the original', 'A clear opening statement'],
    answer: 2, explain: 'Summary = objective condensation · ห้ามใส่ opinion/judgement · ห้าม invent material',
    verified: 'Textbook p.152' },

  { id: 1117, subject: 'engprof', topic: 'academic-writing', year: 4,
    source: 'Textbook p.122', tags: ['warmup', 'review'], type: 'mcq',
    q: 'Which sequence describes the structure of a **review article**?',
    options: [
      'Introduction → Methods → Results → Discussion',
      'Introduction → Case Description → Discussion',
      'Introduction → Body paragraphs (with subheadings) → Conclusion',
      'Abstract → References',
    ],
    answer: 2, explain: 'Review article: Intro (problem + scope) → Body with subheadings → Conclusion',
    verified: 'Textbook p.122-123' },

  { id: 1118, subject: 'engprof', topic: 'academic-writing', year: 4,
    source: 'Textbook p.132', tags: ['warmup', 'ama'], type: 'mcq',
    q: 'In **AMA citation style**, in-text citations are formatted as:',
    options: [
      '(Author, Year)',
      'Author (Year)',
      'Superscript Arabic numbers (¹ ² ³)',
      '[Author] [Page]',
    ],
    answer: 2, explain: 'AMA = superscript Arabic numbers, ordered by appearance in paper',
    verified: 'Textbook p.132' },

  { id: 1119, subject: 'engprof', topic: 'academic-writing', year: 4,
    source: 'Textbook p.144', tags: ['warmup', 'plagiarism'], type: 'tf',
    q: 'Common knowledge **must always be cited** in an academic paper.',
    answer: false, explain: 'False — common knowledge ไม่ต้อง cite · เฉพาะ ideas/info ที่ไม่ใช่ของเรา + ไม่ใช่ common knowledge ต้อง cite',
    verified: 'Textbook p.144' },

  // ═══════════════════════════════════════════════════════════
  // 🎯 MOCK EXAM Final 86 — PART I (20 pts)
  // Reading Vet Research Paper: Pet-Human Relationships (MDORS/CORS)
  // 8 short-answer + 4 T/F = 12 questions
  // IDs 1130-1141
  // ═══════════════════════════════════════════════════════════
  { id: 1130, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.100-112 (MDORS/CORS article)',
    tags: ['mock', 'part-1', 'introduction'], type: 'short',
    examOrigin: 'Mock Final Part I',
    passage: PASSAGE_PETS,
    passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: '**1. What was the purpose of the study?** (short answer)',
    keywords: ['compare', 'dog-owner', 'cat-owner', 'relationship'],
    model_answer: 'The aim of the study was to compare the dog-owner relationship with the cat-owner relationship based on the perceptions of people living with both dogs and cats, considering interaction, emotional closeness, and perceived cost.',
    explain: 'Purpose ตรงๆ จาก Introduction ย่อหน้าสุดท้าย: "compare the dog-owner relationship with the cat-owner relationship" + 3 aspects ของ MDORS/CORS' },

  { id: 1131, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.101 (MDORS description)',
    tags: ['mock', 'part-1', 'introduction'], type: 'short',
    examOrigin: 'Mock Final Part I',
    passage: PASSAGE_PETS,
    passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: '**2. What is the Monash dog owner relationship scale (MDORS) used for?**',
    keywords: ['measure', 'quality', 'dog-owner', 'relationship'],
    model_answer: 'The MDORS is used to measure the quality of the dog-owner relationship from the owner\'s perception. It has three subscales: perceived emotional closeness, interaction, and perceived cost.',
    explain: 'MDORS = "the most robust scale to measure quality of dog-owner relationship, from the owner\'s perception" + 3 subscales' },

  { id: 1132, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.105 (Methods)',
    tags: ['mock', 'part-1', 'methods', 'sampling'], type: 'short',
    examOrigin: 'Mock Final Part I',
    passage: PASSAGE_PETS,
    passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: '**3. What sampling method was used in this study and how were participants recruited?**',
    keywords: ['snowball', 'sampling', 'online', 'survey', 'facebook'],
    model_answer: 'Snowball sampling was used. The survey was administered through an online system (SurveyMonkey.com), and the survey link was posted on the author\'s Facebook wall. Contacts were asked to share it.',
    explain: 'Methods: "Snowball sampling was used... An online system (SurveyMonkey.com) was used. The survey link was posted on the author\'s wall on Facebook"' },

  { id: 1133, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.105 (Methods)',
    tags: ['mock', 'part-1', 'methods', 'sample'], type: 'short',
    examOrigin: 'Mock Final Part I',
    passage: PASSAGE_PETS,
    passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: '**4. How many participants were included and what was the gender distribution?**',
    keywords: ['132', 'women', 'men'],
    model_answer: 'A total of 132 people participated. The mean age was 35.6 years (SD 11.9). 86.4% (n=114) were women, and 13.6% (n=18) were men.',
    explain: 'Methods: "In total, 132 people who had at least one dog and one cat as pets participated. The mean age of owners was 35.6 years; 86.4% were women (n=114), and 13.6% were men (n=18)."' },

  { id: 1134, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.106 (Methods stats)',
    tags: ['mock', 'part-1', 'methods', 'statistics'], type: 'short',
    examOrigin: 'Mock Final Part I',
    passage: PASSAGE_PETS,
    passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: '**5. What statistical test was used to compare dog-owner vs cat-owner relationship scores, and why was a non-parametric test chosen?**',
    keywords: ['wilcoxon', 'signed-rank', 'normal', 'distribution', 'kolmogorov'],
    model_answer: 'The Wilcoxon signed-rank test was used because the participants were paired (the same person rated both their dog and cat). Non-parametric tests were used because the scores did not fit a normal distribution when evaluated with the Kolmogorov-Smirnov test (p < 0.05).',
    explain: 'Methods: "the Wilcoxon signed-rank statistical test was used; because they are paired groups... Nonparametric tests were used because the scores did not fit a normal distribution when evaluated with the Kolmogorov-Smirnov test (p < 0.05)"' },

  { id: 1135, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.108 (Results)',
    tags: ['mock', 'part-1', 'results'], type: 'short',
    examOrigin: 'Mock Final Part I',
    passage: PASSAGE_PETS,
    passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: '**6. According to the results, in which subscale did owners report a higher score for cats than for dogs, and in which subscale was the score higher for dogs?**',
    keywords: ['interaction', 'cost', 'cats', 'emotional', 'closeness', 'dogs'],
    model_answer: 'Owners reported greater interaction and lower perceived cost with cats. They reported greater emotional closeness with dogs.',
    explain: 'Results: "owners reported greater interaction and lower perceived cost with their cats and greater emotional closeness with their dogs"' },

  { id: 1136, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.110-112 (Discussion)',
    tags: ['mock', 'part-1', 'discussion'], type: 'short',
    examOrigin: 'Mock Final Part I',
    passage: PASSAGE_PETS,
    passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: '**7. State at least ONE limitation of this study mentioned by the authors.**',
    keywords: ['women', 'men', 'female', 'bias', 'sample'],
    model_answer: 'The main limitation was that most participants were women — only 18 men responded. Female bias in survey participation is widely reported in studies on dog/cat relationships, which limits how generalizable the findings are.',
    explain: 'Discussion: "Among the limitations of the study is the fact that most of the participants were women: only 18 men responded. Female bias in survey... is widely reported"' },

  { id: 1137, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.112 (Conclusion)',
    tags: ['mock', 'part-1', 'discussion', 'recommendations'], type: 'short',
    examOrigin: 'Mock Final Part I',
    passage: PASSAGE_PETS,
    passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: '**8. What recommendations for further research did the authors propose?**',
    keywords: ['indoor', 'outdoor', 'neuter', 'spay', 'time'],
    model_answer: 'Future studies should include questions identifying where dogs and cats spend most of their time (indoors/outdoors), evaluate MDORS/CORS differences by neuter/spay status, and assess the relationship between dogs and cats themselves.',
    explain: 'Discussion: "Future studies should include questions that can help identify where dogs and cats spend most of their time (indoors/outdoors)... Knowing MDORS and CORS differences between neuter/spay status is likely to be important as well"' },

  { id: 1138, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.108 (Results)',
    tags: ['mock', 'part-1', 'tf'], type: 'tf',
    examOrigin: 'Mock Final Part I',
    passage: PASSAGE_PETS,
    passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: '**T/F #1.** Owners reported greater **emotional closeness with their cats** than with their dogs.',
    answer: false, explain: 'False — กลับกัน: greater emotional closeness with **dogs**. Cats higher in interaction + lower perceived cost' },

  { id: 1139, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.108 (Results)',
    tags: ['mock', 'part-1', 'tf'], type: 'tf',
    examOrigin: 'Mock Final Part I',
    passage: PASSAGE_PETS,
    passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: '**T/F #2.** Overall, the total CORS/MDORS score indicated that **relationships with cats were better** than with dogs.',
    answer: true, explain: 'True — "the total score indicates that relationships with cats are better than relationships with dogs"' },

  { id: 1140, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.109 (Results)',
    tags: ['mock', 'part-1', 'tf'], type: 'tf',
    examOrigin: 'Mock Final Part I',
    passage: PASSAGE_PETS,
    passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: '**T/F #3.** The age of the companion animal correlated **positively** with perceived cost (i.e., older pets cost more).',
    answer: false, explain: 'False — correlation was **negative** (rs = −0.263 cats, −0.349 dogs). Younger pets imply higher perceived cost (mess, more spending)' },

  { id: 1141, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.105 (Methods)',
    tags: ['mock', 'part-1', 'tf'], type: 'tf',
    examOrigin: 'Mock Final Part I',
    passage: PASSAGE_PETS,
    passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: '**T/F #4.** Both the MDORS and CORS use exactly the same number of questionnaire items.',
    answer: false, explain: 'False — Methods: "the number of items differs between the MDORS and the CORS" — that\'s why they used **mean scores** (total score / number of items) for comparison' },

  // ═══════════════════════════════════════════════════════════
  // 🎯 MOCK EXAM Final 86 — PART II (15 pts)
  // Writing a 150-word summary with paraphrasing
  // ID 1145
  // ═══════════════════════════════════════════════════════════
  { id: 1145, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Textbook p.154-155 ("Bats" by Debbie Dean) + Final Exam Spec',
    tags: ['mock', 'part-2', 'essay', 'summary'], type: 'essay',
    examOrigin: 'Mock Final Part II',
    passage: PASSAGE_BATS,
    passage_title: 'Read this article and write a summary',
    target_words: 150,
    soft_max_words: 180,
    hard_max_words: 200,
    q: '**Part II — Writing a Summary (15 points)**\n\nWrite a **150-word summary** of the article above using different paraphrasing techniques.\n\n*Tips: identify ONE main idea + 4-5 major supporting details. Use your own words. Do NOT include opinions, examples, or quotations from the original.*',
    model_answer: `**Sample Summary — "The Undervalued Bat"** (~155 words, from textbook p.155)

In the article "Bats," by Debbie Dean, we learn that in contrast to some mistaken beliefs, bats have sight, are mammals, and are not especially likely to carry rabies. Bats are relatively misunderstood and unappreciated.

Bats have some interesting physical features. They have similar bone structure and skeletons to that of humans, so they are not winged rodents. They are color blind, so they use echolocation if there is not sufficient light. Otherwise, their sight is enough.

Species of bats total about a thousand. The species come in a variety of sizes and have unique diets. Most eat insects, but some eat plant products and small animals. However, vampire bats drink blood, which can be harmful to livestock. Farmers have accidentally killed many helpful bats while trying to rid themselves of vampire bats.

Bats can actually be helpful to humans. They destroy unwanted bugs, spread fruit seeds, and pollinate plants. However, the survival of bats is not known because many are killed by human disruptions and predators. The bat population has dropped steadily and may continue to drop.

Hopefully, we will realize that although bats look different than our favorite animals, we can learn to accept and admire their uniqueness.

---

**ตัวอย่างนี้มี ~250 คำ** (จาก textbook ใช้เป็นตัวอย่างให้ดูโครงสร้างเฉยๆ — ของจริงต้อง trim ลงเหลือ 150 words)

📌 **Main idea ที่ควรเก็บ:** Bats are misunderstood mammals (not rodents, not blind, not high rabies risk) that are actually beneficial through pest control, seed dispersal, and pollination — but their populations are declining due to human activity.

📌 **Major details ที่ควรมี:**
1. Common misconceptions vs reality (mammals not rodents, can see, low rabies risk)
2. Echolocation for navigation in darkness
3. ~1000 species + diverse diets (insects 70% / fruit / nectar / vampire bats)
4. Beneficial functions (pest control, seed dispersal, pollination)
5. Population decline (60% don't survive infancy, human pesticides + intrusions)`,
    rubric: `**Marking Criteria (Total = 15 points)**

**Content (7 pts)**
• Main idea — 1-2 pts (identify the central message)
• Major details — 1 pt each (~5 details = 5 pts)

**Organization & Grammar (5 pts)**
• Score 5 = ideas connected, excellent transitions, statements coincide with original
• Score 4 = logical order, good transitions, most coincide
• Score 3 = somewhat logical, partial transitions, some don't coincide
• Score 2 = random order, illogical transitions, most don't coincide
• Score 1 = not logical, no transitions, few coincide

**Paraphrasing (3 pts)**
• 3 = paraphrase using own words ★
• 2 = own words but copy some key phrases
• 1 = minimal paraphrase + copy most key phrases
• 0 = copy all key phrases

**Word-count Penalty**
• 150 = target ✓
• > 180 words → −1 point
• > 200 words → −2 points`,
    explain: 'Use the model answer + rubric to self-grade. Target 150 words; staying under 180 is safest. Make sure to: (1) Open with main idea (2) Use 4-5 major details (3) Add transitions (However, Moreover, In addition) (4) Paraphrase fully — change BOTH words AND structure (5) Cite the original ("In the article...by Debbie Dean") (6) NO opinion, NO examples from original' },
];
