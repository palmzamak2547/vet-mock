// ============================================================
// Eng Vet Prof II Questions — Final Exam Mock Bank (Units 4-5)
// ============================================================
// Final exam structure (28 เม.ย. 2569 13:00-15:00, 35 pts):
//   Part I  (20 pts) — Read research paper → short answers + T/F
//   Part II (15 pts) — Write 150-word summary using paraphrasing
//
// Layout
//   IDs 1100-1119  → Warm-up concept Qs (MCQ/TF)
//   IDs 1120-1135  → MOCK 1 — Pet-Human Relationships (textbook)
//   IDs 1140-1155  → MOCK 2 — Bone density in baboons (Exercise 2 KEY)
//   IDs 1160-1175  → MOCK 3 — Newcastle disease in Oman (Exercise 2 KEY)
//   IDs 1180-1192  → MOCK 4 — Antibiotic resistance MRSP (✏️ ORIGINAL)
//   IDs 1200-1209  → Summary practice — Atopic dermatitis (Exercise 1)
//   IDs 1210-1212  → Summary practice — Ear abscesses (Exercise 1)
//
// Within each mock the order is: Intro Qs → Methods Qs → Results Qs
// → Discussion Qs → T/F (Results-focused) → Essay summary (last).
// Display ordering will follow ID order automatically since the QB
// is sorted by id when filtered to a topic.
//
// Question types
//   mcq   — multiple choice (warm-up only)
//   tf    — true/false (warm-up + Part I T/F)
//   short — free-form short answer (Part I)
//   essay — full writing question with word counter (Part II)
// ============================================================

// ╔═══════════════════════════════════════════════════════════════╗
// ║ PASSAGE LIBRARY                                               ║
// ║                                                               ║
// ║ Each constant holds a complete reading passage that's         ║
// ║ attached to its mock's questions via q.passage. Keeping       ║
// ║ them as module-level constants means the same string is       ║
// ║ shared by reference across all questions in a mock — no       ║
// ║ duplication in memory or in the JS bundle.                    ║
// ╚═══════════════════════════════════════════════════════════════╝

// ──────────────────────────────────────────────────────────────
// MOCK 1 — Pet-Human Relationships (MDORS/CORS)
// Source: textbook p.100-112, abridged
// ──────────────────────────────────────────────────────────────
const PASSAGE_PETS = `Title: Pet-Human Relationships: Dogs versus Cats

Introduction
In recent decades, interest in studying human-animal interactions has increased, and the results of such studies have revealed that owners of dogs and cats tend to have better physical health than non-owners or owners of other types of pets. Nevertheless, other research has shown no differences between dog owners and non-dog owners in self-reported mental health, general health, loneliness, or life satisfaction.

There are different scales to evaluate the owner-pet relationship. The Monash dog owner relationship scale (MDORS) is the most robust scale to measure quality of dog-owner relationship from the owner's perception. The MDORS was developed from social exchange theory, which specifies that relationships are maintained only when the perceived cost and benefits are balanced or when the perceived benefits are greater than the costs of the relationship. The scale has three subscales evaluating perceived emotional closeness, interaction, and perceived cost. Recently the MDORS was adapted to evaluate the cat-owner relationship (CORS).

The aim of this study was to compare the dog-owner relationship with the cat-owner relationship based on the perceptions of people living with both dogs and cats, considering the three aspects in the MDORS/CORS: interaction, emotional closeness, and perceived cost.

Methodology
The methodology and ethical aspects of this study were approved by researchers from the Universidad Autónoma de Nuevo León, Mexico (CAPS-20-19-11). Owners of both dogs and cats living in Mexico participated. Snowball sampling was used: an online system (SurveyMonkey.com) was used and the survey link was posted on the author's Facebook wall. In total, 132 people who had at least one dog and one cat participated. Mean owner age was 35.6 years (SD 11.9); 86.4% were women. Each participant completed both the MDORS and the CORS.

To evaluate the difference between dog-owner vs cat-owner scores, the Wilcoxon signed-rank statistical test was used. Mann-Whitney U was used for pet-sex comparisons; Spearman correlation was used to analyze relationships with age. Nonparametric tests were used because scores did not fit a normal distribution per the Kolmogorov-Smirnov test (p < 0.05).

Results
Owners reported greater interaction and lower perceived cost with their cats, but greater emotional closeness with their dogs. The total CORS/MDORS score indicated that relationships with cats were better than relationships with dogs overall.

The cat-owner relationship was better with male cats specifically: greater emotional closeness and lower perceived cost. For dogs, the only significant difference between sexes was in emotional closeness, with a higher score for male dogs.

When evaluating correlation with the age of the companion animal, the only subscale with a significant negative correlation was perceived cost, both for cats (rs = -0.263; p = 0.002) and dogs (rs = -0.349; p = 0.001), indicating that younger pets imply higher perceived cost for owners.

Discussion and Conclusion
The participants indicated greater emotional closeness with their dogs than with their cats, indicating that people perceived greater social support, companionship, and unconditional love with dogs. However, scores for cats were higher for interaction and lower for perceived cost. Based on the balance between benefits and costs, the relationship overall was better with cats.

Among the limitations: most participants were women (only 18 men responded). Female bias in survey participation is widely reported in studies on dog/cat relationships. Future studies should include questions identifying where dogs and cats spend most time (indoors/outdoors), evaluate neuter/spay status differences, and assess the relationship between dogs and cats themselves.

Based on the results obtained, it was concluded that for this sample of participants residing in Mexico, their relationship with cats was better than the relationship with their dogs, due in large part to the fact that the perceived cost of the relationship with cats is less. Emotional closeness was greater with dogs than with cats.`;

// ──────────────────────────────────────────────────────────────
// MOCK 1 SUMMARY — "Bats" by Debbie Dean (textbook p.154-155)
// ──────────────────────────────────────────────────────────────
const PASSAGE_BATS = `Title: Bats — by Debbie Dean

In the distant past, many people thought bats had magical powers, but times have changed. Today, many people believe that bats are rodents, that they cannot see, and that they are more likely than other animals to carry rabies. All of these beliefs are mistaken. Bats are not rodents, are not blind, and are no more likely than dogs and cats to transmit rabies. Bats, in fact, are among the least understood and least appreciated of animals.

Bats are not rodents with wings, contrary to popular belief. Like all rodents, bats are mammals, but they have a skeleton similar to the human skeleton. The bones in bat wings are much like those in arms and the human hand, with a thumb and four fingers. In bats, the bones of the arms and the four fingers of the hands are very long. This bone structure helps support the web of skin that stretches from the body to the ends of the fingers to form wings.

Although bats cannot see colors, they have good vision in both dim and bright light. Since most bats stay in darkness during the day and do their feeding at night, they do not use their vision to maneuver in the dark but use a process called echolocation. This process enables bats to emit sounds from their mouths that bounce off objects and allow them to avoid the objects when flying. They use this system to locate flying insects to feed on as well.

There are about 1,000 species of bat, ranging in size from the bumblebee bat (about an inch long) to the flying fox (sixteen inches long with a wingspan of five feet). Each type of bat has a specialized diet. For seventy percent of bats, the diet is insects. Other types of bats feed on flowers, pollen, nectar, and fruit or on small animals such as birds, mice, lizards, and frogs. One species of bat, the common vampire bat, feeds on the blood of large mammals — only in Latin America, and probably best known for feeding on cattle.

Bats, in fact, perform a number of valuable functions. Their greatest economic value is in eliminating insect pests. Insect-eating bats can catch six hundred mosquitoes in an hour and eat half their body weight in insects every night. In many tropical rain forests, fruit-eating bats are the main means of spreading the seeds of tropical fruits. Nectar-feeding bats pollinate a number of tropical plants. If it were not for bats, we might not have peaches, bananas, mangoes, guavas, figs, or dates.

Today, the survival of many bat species is uncertain. Sixty percent of bats do not survive past infancy. Some are killed by predators, but most are victims of pesticides and other human intrusions. In Carlsbad Caverns, where there were once eight million bats, there are now a quarter million. At Eagle Creek, the bat population dropped from thirty million to thirty thousand in six years.

Bats often have been burdened with a bad reputation, perhaps because they are not the warm, cuddly sort of animal we love to love. However, their unusual physical features should not lead us to overestimate their harm or underestimate their value.`;

// ──────────────────────────────────────────────────────────────
// MOCK 2 — Bone Density in Baboons (Exercise 2 Research Article I)
// Synthesized from Exercise 2 KEY content — text condensed for mock.
// ──────────────────────────────────────────────────────────────
const PASSAGE_BABOONS = `Title: Age-Related Bone Loss in Baboons (Papio hamadryas spp.) as a Model for Human Osteopenia and Osteoporosis

Introduction
Skeletal aging is a leading cause of morbidity in elderly humans, with osteopenia and osteoporosis presenting major risks for fracture. Animal models are essential for understanding the underlying biological mechanisms and for testing therapies. Among non-human primates, the baboon has emerged as a valuable model because male and female baboons show bone loss with age similar to that seen in humans, and females show increased bone turnover after ovariectomy. Baboons also undergo processes of intracortical remodeling that parallel those of humans.

Previous biomechanical studies have demonstrated that baboon bone is more similar to human bone than the bone of other commonly used animal models with respect to fracture, microstructural, and compositional properties. Baboon bone was not significantly different from human bone with regard to mineral density, organic density, volume fraction, fracture surface pattern, length of collagen-mineral bundles, and the presence of a secondary osteonal bone structure. However, the degree to which bone loss in baboons reaches a magnitude substantial enough to be termed osteopenia or osteoporosis using human-comparable definitions has only rarely been assessed. The purpose of this study was to test the hypothesis that older male and female baboons experience bone loss with age severe enough to be termed osteopenia and osteoporosis.

Methodology
This was a quantitative observational study. Two sets of samples were analyzed. The primary sample consisted of 460 females and 207 males ranging in age from 5 to 30 years; subjects were olive baboons (Papio hamadryas anubis), yellow baboons (Papio hamadryas cynocephalus), and their hybrids. A second focused subsample of 54 females over the age of 19.0 years was used for the osteopenia/osteoporosis prevalence analysis.

All animals were part of the breeding colony at the Southwest National Primate Research Center / Southwest Foundation for Biomedical Research (SNPRC/SFBR). Animals had originally been captured from Kenya for biomedical research. They were housed outdoors in social group cages and maintained on commercial monkey chow with ad libitum access. Data analysis used descriptive statistics including T-scores and qualitative comparisons of inter-site correspondence and bivariate correlations.

Results
Bone mineral density declined significantly with age in both sexes, with females showing a steeper decline. Among older females (n = 54), the prevalence of osteopenia varied across skeletal sites. Figure 1 showed that there was no statistically significant relationship between baboons classified as osteopenic versus those with normal bone density when grouped by age, suggesting age alone does not predict osteopenia status in older females. Importantly, when osteopenia was identified at one skeletal site, it was likely to also occur at other bones of the same anatomical region, indicating regional patterning of bone loss.

Discussion and Conclusion
The baboon and related species experience bone loss with age, particularly in females. Older male baboons begin to show meaningful bone loss at much older ages than females, paralleling the pattern observed in humans where males are at risk of osteopenia and osteoporosis at much older ages than females. A noted limitation is potential survivorship bias in the colony: routine veterinary care results in artificial selection for healthier animals into the oldest age ranges, and could explain the high incidence of osteopenia but the relative absence of frank osteoporosis. Ultimately the results validate the use of the baboon as an appropriate and valuable animal model of human bone maintenance and turnover.`;

// ──────────────────────────────────────────────────────────────
// MOCK 3 — Newcastle Disease in Oman (Exercise 2 Research Article II)
// Synthesized from Exercise 2 KEY content.
// ──────────────────────────────────────────────────────────────
const PASSAGE_NEWCASTLE = `Title: Seroprevalence and Risk Factors of Newcastle Disease Virus (NDV) in Backyard Chicken Flocks in the Sultanate of Oman

Introduction
Newcastle disease (ND) is a highly contagious viral disease of poultry caused by Newcastle disease virus (NDV) and represents one of the most economically devastating diseases in commercial and backyard chicken industries worldwide. The major approach to prevent the severe spread of ND is vaccination, but coverage in backyard flocks is often inadequate. The Sultanate of Oman, located in the west coast of the Gulf of Oman, has been considered a major location of NDV transmission for two reasons: (1) the trajectory of migratory birds passes through the country, and (2) the growing trade between Oman and neighboring countries has increased the movement of poultry and poultry products. Despite this, baseline data on the seroprevalence of NDV in Omani backyard flocks were lacking. The purpose of this study was to determine the seroprevalence of NDV antibodies and the herd-level risk factors associated with ND outbreaks in backyard chicken flocks in Oman.

Methodology
This was a survey study. 383 serum samples were collected from chickens drawn from 139 flocks distributed across the nine governorates of Oman. In addition, 875 poultry farmers completed structured questionnaires on management practices, biosecurity, and outbreak history. Data collection was conducted from June 2016 to September 2016.

Statistical analyses included descriptive statistics (median and mean), the Pearson chi-square test, Spearman's correlation coefficient, and a logistic analysis comprising univariate and subsequent multivariate analyses to identify risk factors associated with seropositivity and outbreak occurrence.

Results
The overall NDV seroprevalence varied substantially across regions; there was no significant relationship between seroprevalence and all sampled flocks and birds at all locations combined. Regarding farm production patterns, three-fifths of the products produced by respondents' farms were chicken meat. When asked about responses to ND outbreaks on their farms, respondents most commonly reported that they stopped selling products and restricted production rather than other practices such as culling or relocating birds.

Discussion and Conclusion
This study provided vital data for better understanding the epidemiology of ND in Oman. The results revealed a high seroprevalence of NDV in backyard chickens, representing a potential source of infection to commercial flocks. Findings at the bird level in Oman were similar to those reported from Middle Eastern countries and Brazil, likely because of comparable geographical locations and the predominance of backyard poultry rearing.

The principal causes of disease transmission identified were: (1) lack of a vaccination program; (2) free entry of visitors and reliance on non-permanent staff; (3) sharing of materials such as means of transportation or feed products; and (4) frequent change of staff. The implications are significant: the maintenance of the virus in backyard populations and its spread to commercial flocks threaten the wider poultry industry. There is a clear need for improvement of Oman's poultry disease reporting system, with emphasis on farmer education and appropriate practices to prevent and control ND.

Future research should aim to identify the circulating virus genotypes and models of transmission for a better understanding of ND epidemiology in backyard chickens in Oman.`;

// ──────────────────────────────────────────────────────────────
// MOCK 4 — Antimicrobial Resistance in Companion Animals (✏️ ORIGINAL)
// This passage was written by Claude specifically for VetMock,
// directly to match the Final exam Part I specifications. It is
// NOT from any published article — it is an original mock.
// ──────────────────────────────────────────────────────────────
const PASSAGE_AMR = `Title: Methicillin-Resistant Staphylococcus pseudintermedius (MRSP) in Canine Pyoderma: A Cross-Sectional Survey from Bangkok, Thailand

> ✏️ NOTE: This passage was written specifically for VetMock as a mock Final exam item. It is not a real published study, but is structured exactly like a research paper as described in the textbook (Unit 4) and the Final exam specifications.

Introduction
Antimicrobial resistance (AMR) is recognised by the World Health Organization as one of the top global threats to public health. In small animal veterinary practice, Staphylococcus pseudintermedius is the leading cause of canine pyoderma — a common and recurrent skin infection — and the rapid emergence of methicillin-resistant strains (MRSP) has narrowed the empirical treatment options available to clinicians. Resistance to methicillin is conferred by the *mecA* gene, which renders bacteria resistant to all beta-lactam antibiotics including the first-line empirical drug, cephalexin.

While MRSP prevalence has been documented at 20–40% in pyoderma isolates in Europe and the United States, comparable Thai data are limited. With increasing rates of empirical cephalosporin use in Thai small-animal clinics and the high humidity that predisposes dogs in Bangkok to recurrent skin infections, the local prevalence of MRSP could differ significantly. The purpose of this study was to determine the prevalence of MRSP among S. pseudintermedius isolates from dogs presenting with pyoderma at three teaching hospitals in Bangkok, and to identify owner-reported risk factors associated with MRSP carriage.

Methodology
This was a cross-sectional study conducted between January and December 2024. A total of 210 dogs with clinical pyoderma (defined by primary or secondary lesions plus cytologic evidence of cocci with neutrophilic inflammation) were enrolled at three Bangkok teaching hospitals. Owners completed a structured questionnaire covering antibiotic exposure in the previous 12 months, contact with other dogs, and grooming frequency.

Skin swabs from the most active lesion were cultured on mannitol salt agar and S. pseudintermedius identification was confirmed by MALDI-TOF mass spectrometry. **Methicillin resistance was determined by oxacillin disc diffusion and confirmed by *mecA* PCR.** Antimicrobial susceptibility for ten additional antibiotics was tested by disc diffusion following CLSI veterinary standards.

Data were analysed with descriptive statistics (mean, SD, percentage). Differences between MRSP-positive and MRSP-negative groups were assessed by chi-square test for categorical variables and Mann–Whitney U test for continuous variables. Risk factors with p < 0.10 in univariate analysis were entered into a multivariate logistic regression. Statistical significance was set at p < 0.05.

Results
S. pseudintermedius was isolated from 187 of 210 dogs (89.0%). The overall prevalence of MRSP was 38.5% (72/187 isolates), with no significant difference between hospitals (p = 0.31). Of the MRSP isolates, 91.7% were resistant to four or more non-beta-lactam antibiotic classes, meeting the definition of multidrug resistance.

Univariate analysis identified three risk factors significantly associated with MRSP: prior antibiotic use within the last 6 months (OR 4.2, 95% CI 2.1–8.4), recurrent pyoderma (≥3 episodes in the past year; OR 3.7, 95% CI 1.8–7.5), and frequent professional grooming (≥monthly; OR 2.1, 95% CI 1.1–4.0). After multivariate adjustment, prior antibiotic use and recurrent pyoderma remained significant predictors. Susceptibility was retained for amikacin (96%), chloramphenicol (88%), and rifampicin (82%) among MRSP isolates.

Discussion and Conclusion
The MRSP prevalence of 38.5% in this Bangkok cohort is at the upper end of figures reported from Europe and the United States, suggesting that empirical cephalexin therapy for canine pyoderma in Bangkok may now have an unacceptably high failure rate. The strong association with prior antibiotic use is consistent with selection pressure from previous courses of treatment, and underscores the need for culture and susceptibility testing before re-prescribing in recurrent cases.

A key limitation of this study is its restriction to teaching hospitals, which receive disproportionately complex cases referred from primary practice; the overall community prevalence of MRSP in Bangkok dogs may therefore be lower. The cross-sectional design also cannot establish causality between risk factors and MRSP acquisition. Future research should include longitudinal sampling from primary-care clinics across Thailand, molecular typing to identify circulating MRSP clones, and intervention studies on antimicrobial stewardship programs in small-animal practice.

In conclusion, MRSP is now a substantial and likely under-recognized contributor to canine pyoderma in Bangkok. Routine susceptibility testing, judicious antibiotic prescribing, and increased awareness among owners and clinicians are urgently needed to slow further resistance.`;

// ──────────────────────────────────────────────────────────────
// MOCK 5 — 2021 Final Past Exam (Part III paraphrase task)
// Real past-exam item from Final Examination: Eng Vet Prof II 2021
// ("Paraphase exam2021.pdf"). Source text + 2021 student's
// handwritten response are reproduced as the model answer.
// ──────────────────────────────────────────────────────────────
const PASSAGE_2021_PETS_ALLERGIES = `Source text — Final Examination: Eng Vet Prof II 2021, Part III (15 points)

Pets really do seem to prevent allergies: the more cats or dogs you live with as an infant, the lower your chance of developing asthma, hay fever or eczema.

Some studies have found that having a pet early in life protects from allergies later in childhood. Bill Hesselmar at the University of Gothenburg, Sweden, and colleagues wondered if having more than one pet would increase the benefit.

They looked at data from a previous study. The studied reviewed data taken from 1,029 children aged seven to eight. The incidence of allergies was 49 per cent in children who had spent their first 12 months of life in a home with no pets. This fell to 43 per cent in children who as babies had lived with one pet, and 24 per cent for children who had lived with three pets. Two of the children had lived with five pets — neither of them had allergies.

This shows that there is a dose-dependent relationship: more exposure to pets means more protection. Previous studies also have found that children who grow up on a farm with livestock have a lower risk of allergies. Hesselmar thinks having multiple pets is like living on a "mini-farm," with lots of exposure to allergens.

Allergies have been on the rise since the mid-20th century, but we still don't really know what causes them. Hesselmar thinks that pets carry microbes that stimulate the human immune system so that children don't become allergic. Spending time with other children and being outdoors in early life also seem to have a protective effect.`;

// ──────────────────────────────────────────────────────────────
// PRACTICE — Atopic Dermatitis (Exercise 1 Text 1)
// Used for summary writing practice. Highlighted KEY ideas in
// Exercise 1 KEY (yellow highlights).
// ──────────────────────────────────────────────────────────────
const PASSAGE_ATOPIC = `Title: Allergies: Atopic Dermatitis in Dogs and Cats — Wendy Brooks, DVM, DABVP

Atopy
Atopy is defined as the genetic tendency to develop allergic diseases. These diseases are due to a heightened immune response to common substances in the environment known as allergens.

In atopic dermatitis, allergens including pollens, molds, and dust particles make their way to the skin and gain entry through a defective skin barrier. The immune system becomes reactive to the airborne allergens and inflammation, itching, and scratching begin. Even if allergens come from the air, the itch is felt in the skin, leading to scratching, hair loss, redness, and skin thickening.

Atopic dermatitis has a genetic basis. Predisposed breeds include Dalmatian, Golden retriever, West Highland white terrier, Shar Pei, Labrador retriever, Cairn terrier, Lhasa Apso, Shih Tzu, Boxer, and Pug.

Features of Atopy in Dogs
The following findings in patient history and examination might lead to a diagnosis of atopy. Meeting five criteria from this list yields an 85 percent accuracy for the diagnosis:

1. Young Age of Onset: Seasonal itchiness due to atopy tends to begin between ages 1 and 3 in 70% of dogs. Food allergies tend to begin earlier (less than 6 months) or later (5-6 years).
2. Mostly Indoor Lifestyle: Indoors is where many airborne allergens are concentrated.
3. Good Response to Steroids: Itchiness due to atopy responds rapidly to cortisone-type medications.
4. Chronic or Recurring Yeast Infections in the Skin: Yeast (Malassezia pachydermatis) proliferate to create a stinky, thickened, pigmented skin.
5. Front Feet Involved: Foot licking is a classic feature.
6. Ear Flaps Involved: The non-haired (concave) portion of the ear flap is commonly involved.
7. Ear Margins Not Involved: Ear margin involvement is suggestive of sarcoptic mange instead.
8. Lower Back Area Not Involved: The lower back is the flea bite zone.
9. Seasonality: Seasonality of itching is also a clue toward an airborne-related allergy.

Testing for Atopic Dermatitis
Atopic diagnosis is a clinical diagnosis based on symptoms and findings. Allergy testing (skin test or blood testing) is not a test for atopic dermatitis itself; instead, it is done after diagnosis has been confirmed clinically, in order to make an allergy shot serum (immunotherapy) for that specific patient.`;

// ──────────────────────────────────────────────────────────────
// PRACTICE — Ear Abscesses in Turtles (Exercise 1 Text 2)
// ──────────────────────────────────────────────────────────────
const PASSAGE_EARABSCESS = `Title: Ear Abscesses in Turtles and Tortoises — Brad Lock, DVM, DACZM

Ear abscesses, also known as aural abscesses, are common in turtles and tortoises and are usually caused by bacterial infections. The infection begins in the mouth and moves up into the ear canal through the eustachian tube. Unlike mammals, turtles and tortoises do not have an open external ear canal, so when an infection reaches the ear, it has nowhere to go and builds up as a large pocket of pus. Pus in mammals is liquid, but in reptiles including turtles and tortoises, pus is firm with a cheesy consistency. Because of this firmness, the pus will not drain back into the mouth.

The pressure created in the closed ear from the growing abscess may cause a break on the outside of the ear that is seen as a hole in the side of the head, or it may create a large swelling or lump on one or both sides of the head. If left untreated, changes to the skull can occur, possibly resulting in permanent damage.

Ear abscesses can occur when:
- the immune system is suppressed from stress such as during hibernation;
- they have a viral infection;
- they are in a poor environment (too wet or too dry);
- they have just suffered a traumatic injury;
- they have just been exposed to pesticides;
- they have a nutritional deficiency.

Treatment
Surgery is required to remove the hardened pus from an aural abscess. Surgery is the most effective and safest means of treating it. The procedure involves cutting under the abscess and pulling it out. The ear canal is flushed to remove all pieces. The wound is left open and heals on its own.

Depending on severity, the veterinarian may prescribe antibiotics before surgery. During surgery, a swab of the ear canal may be sent for culture and sensitivity testing to identify the bacteria and determine the most appropriate drugs.

Prevention
After diagnosis and treatment, follow recommendations about diet changes or husbandry alterations to help prevent another abscess. Provide appropriate temperature, humidity, and water quality. Water should be changed regularly, and frequent water bowl/terrarium disinfection is recommended. Always complete the full course of any prescribed antibiotic.`;


// ╔═══════════════════════════════════════════════════════════════╗
// ║ QUESTION BANK                                                 ║
// ╚═══════════════════════════════════════════════════════════════╝
export const QB_ENGPROF = [
  // ═══════════════════════════════════════════════════════════
  // WARM-UP — Concept questions (1100-1119)
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
    q: 'In which section would you find the purpose / aim of the study?',
    options: ['Introduction (often last paragraph)', 'Methodology', 'Results', 'References'],
    answer: 0, explain: 'Purpose / aim / objective อยู่ใน Introduction มักประโยคสุดท้ายของ section',
    verified: 'Textbook p.100' },

  { id: 1102, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.103', tags: ['warmup', 'methodology'], type: 'mcq',
    q: 'Information about statistical tests used to analyze the data goes in which section?',
    options: ['Introduction', 'Methodology', 'Results', 'Conclusion'],
    answer: 1, explain: 'Methodology บอก data analysis method (เช่น t-test, chi-square, Wilcoxon, ฯลฯ)',
    verified: 'Textbook p.103' },

  { id: 1103, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.107', tags: ['warmup', 'results'], type: 'tf',
    q: 'The Results section is the appropriate place to interpret the meaning of the findings.',
    answer: false, explain: 'False — Results เพียงแค่รายงานข้อมูล (ตัวเลข, tables, figures) · การ interpret meaning อยู่ใน Discussion',
    verified: 'Textbook p.107' },

  { id: 1104, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.110', tags: ['warmup', 'discussion'], type: 'mcq',
    q: 'Which of the following is typically found in the Discussion section?',
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
    q: 'A study follows 500 dogs over 5 years to see who develops cancer. This is a:',
    options: ['Case report', 'Case-control study', 'Cohort study', 'Cross-sectional study'],
    answer: 2, explain: 'Cohort = ตามกลุ่มผ่านเวลา (prospective) → ดี incidence + risk',
    verified: 'Textbook p.104' },

  { id: 1106, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.104', tags: ['warmup'], type: 'mcq',
    q: 'A study compares dogs with lymphoma (cases) to dogs without lymphoma (controls) by looking back at their dietary history. This is a:',
    options: ['Cohort study', 'Case-control study', 'Cross-sectional study', 'Randomized controlled trial'],
    answer: 1, explain: 'Case-control = compare มีโรค vs ไม่มีโรค ย้อนหลัง (retrospective) — ดีสำหรับ rare diseases',
    verified: 'Textbook p.104' },

  { id: 1107, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.105', tags: ['warmup', 'rct'], type: 'mcq',
    q: 'Which design is the gold standard for testing the effect of a new treatment?',
    options: ['Case series', 'Cross-sectional', 'Cohort', 'Randomized Controlled Trial (RCT)'],
    answer: 3, explain: 'RCT = Controlled Clinical Trial + random assignment → eliminates selection bias',
    verified: 'Textbook p.104-105' },

  { id: 1108, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.105', tags: ['warmup'], type: 'tf',
    q: 'Coin tosses or odd/even number assignment counts as true randomization in an RCT.',
    answer: false, explain: 'False — coin toss / odd-even = pseudo-randomization · ต้องใช้ machine-generated random tables',
    verified: 'Textbook p.105' },

  { id: 1109, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.104', tags: ['warmup', 'cross-sectional'], type: 'mcq',
    q: 'A descriptive study that counts how many dogs in Bangkok have obesity in 2024 (one point in time) is a:',
    options: ['Cohort study', 'Case-control study', 'Cross-sectional study', 'Clinical trial'],
    answer: 2, explain: 'Cross-sectional = snapshot ณ จุดเวลาเดียว · ดี prevalence',
    verified: 'Textbook p.104' },

  { id: 1110, subject: 'engprof', topic: 'paraphrasing', year: 4,
    source: 'Textbook p.149', tags: ['warmup'], type: 'mcq',
    q: 'Which is NOT one of the 5 paraphrasing techniques?',
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
    q: 'Original: *"If the existence of a signing ape was unsettling for linguists, it was also startling news for animal behaviorists."* Which is the acceptable paraphrase?',
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
    q: 'Which marker is a valid replacement for "however"?',
    options: ['Therefore', 'Because', 'Nevertheless', 'For example'],
    answer: 2, explain: 'However ↔ nevertheless / nonetheless / on the other hand (contrast). Therefore = consequence; Because = reason; For example = illustration',
    verified: 'Textbook p.149' },

  { id: 1113, subject: 'engprof', topic: 'paraphrasing', year: 4,
    source: 'Textbook p.147', tags: ['warmup', 'plagiarism'], type: 'tf',
    q: 'When you paraphrase, you must always cite the source to avoid plagiarism.',
    answer: true, explain: 'True — paraphrase ≠ excuse to skip citation · เปลี่ยนคำเฉยๆ ไม่ทำให้กลายเป็น original idea ของเรา',
    verified: 'Textbook p.147' },

  { id: 1114, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Final Exam Spec', tags: ['warmup', 'word-count'], type: 'mcq',
    q: 'In Final Part II, the target summary length is 150 words. What penalty applies if your summary is 205 words?',
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
    q: 'Which sequence describes the structure of a review article?',
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
    q: 'In AMA citation style, in-text citations are formatted as:',
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
    q: 'Common knowledge must always be cited in an academic paper.',
    answer: false, explain: 'False — common knowledge ไม่ต้อง cite · เฉพาะ ideas/info ที่ไม่ใช่ของเรา + ไม่ใช่ common knowledge ต้อง cite',
    verified: 'Textbook p.144' },

  // ═══════════════════════════════════════════════════════════
  // 🎯 MOCK 1 — Pet-Human Relationships (Textbook MDORS/CORS)
  // Part I (1120-1133) → Part II Summary (1135)
  // ═══════════════════════════════════════════════════════════
  // ── Mock 1 Part I — Introduction ──────────────────────────
  { id: 1120, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.100-112 (MDORS/CORS)',
    tags: ['mock-1', 'part-1', 'introduction'], type: 'short',
    examOrigin: 'Mock 1 Part I',
    passage: PASSAGE_PETS,
    passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: 'What was the purpose of the study?',
    keywords: ['compare', 'dog-owner', 'cat-owner', 'relationship'],
    model_answer: 'The aim of the study was to compare the dog-owner relationship with the cat-owner relationship based on the perceptions of people living with both dogs and cats, considering interaction, emotional closeness, and perceived cost.',
    explain: 'Purpose ตรงๆ จาก Introduction ย่อหน้าสุดท้าย (always last paragraph of Intro)' },

  { id: 1121, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.101', tags: ['mock-1', 'part-1', 'introduction'], type: 'short',
    examOrigin: 'Mock 1 Part I',
    passage: PASSAGE_PETS, passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: 'What is the Monash Dog Owner Relationship Scale (MDORS) used for?',
    keywords: ['measure', 'quality', 'dog-owner', 'relationship'],
    model_answer: 'The MDORS is used to measure the quality of the dog-owner relationship from the owner\'s perception. It has three subscales: perceived emotional closeness, interaction, and perceived cost.',
    explain: '"the most robust scale to measure quality of dog-owner relationship, from the owner\'s perception" + 3 subscales' },

  // ── Mock 1 Part I — Methods ───────────────────────────────
  { id: 1122, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.105', tags: ['mock-1', 'part-1', 'methods', 'sampling'], type: 'short',
    examOrigin: 'Mock 1 Part I',
    passage: PASSAGE_PETS, passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: 'What sampling method was used in this study and how were participants recruited?',
    keywords: ['snowball', 'sampling', 'online', 'survey', 'facebook'],
    model_answer: 'Snowball sampling was used. The survey was administered through an online system (SurveyMonkey.com), and the survey link was posted on the author\'s Facebook wall. Contacts were asked to share it.',
    explain: 'Methods: "Snowball sampling was used... The survey link was posted on the author\'s wall on Facebook"' },

  { id: 1123, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.105', tags: ['mock-1', 'part-1', 'methods', 'sample'], type: 'short',
    examOrigin: 'Mock 1 Part I',
    passage: PASSAGE_PETS, passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: 'How many participants were included and what was the gender distribution?',
    keywords: ['132', 'women', 'men', 'female'],
    model_answer: 'A total of 132 people participated. The mean age was 35.6 years (SD 11.9). 86.4% (n=114) were women, and 13.6% (n=18) were men.',
    explain: '"In total, 132 people who had at least one dog and one cat as pets participated... 86.4% were women"' },

  { id: 1124, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Textbook p.106', tags: ['mock-1', 'part-1', 'methods', 'statistics'], type: 'short',
    examOrigin: 'Mock 1 Part I',
    passage: PASSAGE_PETS, passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: 'What statistical test was used to compare dog-owner vs cat-owner relationship scores, and why was a non-parametric test chosen?',
    keywords: ['wilcoxon', 'signed-rank', 'normal', 'distribution', 'kolmogorov'],
    model_answer: 'The Wilcoxon signed-rank test was used because the participants were paired (the same person rated both their dog and cat). Non-parametric tests were used because the scores did not fit a normal distribution when evaluated with the Kolmogorov-Smirnov test (p < 0.05).',
    explain: '"the Wilcoxon signed-rank statistical test was used; because they are paired groups... Nonparametric tests were used because the scores did not fit a normal distribution"' },

  // ── Mock 1 Part I — Results ───────────────────────────────
  { id: 1125, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.108', tags: ['mock-1', 'part-1', 'results'], type: 'short',
    examOrigin: 'Mock 1 Part I',
    passage: PASSAGE_PETS, passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: 'According to the results, in which subscale did owners report a higher score for cats than for dogs, and in which subscale was the score higher for dogs?',
    keywords: ['interaction', 'cost', 'cats', 'emotional', 'closeness', 'dogs'],
    model_answer: 'Owners reported greater interaction and lower perceived cost with cats. They reported greater emotional closeness with dogs.',
    explain: 'Results: "owners reported greater interaction and lower perceived cost with their cats and greater emotional closeness with their dogs"' },

  // ── Mock 1 Part I — Discussion ────────────────────────────
  { id: 1126, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.112', tags: ['mock-1', 'part-1', 'discussion'], type: 'short',
    examOrigin: 'Mock 1 Part I',
    passage: PASSAGE_PETS, passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: 'State at least ONE limitation of this study mentioned by the authors.',
    keywords: ['women', 'men', 'female', 'bias'],
    model_answer: 'The main limitation was that most participants were women — only 18 men responded. Female bias in survey participation is widely reported in studies on dog/cat relationships, which limits generalizability.',
    explain: '"Among the limitations of the study is the fact that most of the participants were women: only 18 men responded"' },

  { id: 1127, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.112', tags: ['mock-1', 'part-1', 'discussion', 'recommendations'], type: 'short',
    examOrigin: 'Mock 1 Part I',
    passage: PASSAGE_PETS, passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: 'What recommendations for further research did the authors propose?',
    keywords: ['indoor', 'outdoor', 'neuter', 'spay', 'time'],
    model_answer: 'Future studies should include questions identifying where dogs and cats spend most of their time (indoors/outdoors), evaluate MDORS/CORS differences by neuter/spay status, and assess the relationship between dogs and cats themselves.',
    explain: '"Future studies should include questions that can help identify where dogs and cats spend most of their time (indoors/outdoors)... Knowing MDORS and CORS differences between neuter/spay status..."' },

  // ── Mock 1 Part I — True/False ────────────────────────────
  { id: 1130, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.108', tags: ['mock-1', 'part-1', 'tf'], type: 'tf',
    examOrigin: 'Mock 1 Part I',
    passage: PASSAGE_PETS, passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: 'Owners reported greater emotional closeness with their cats than with their dogs.',
    answer: false, explain: 'False — กลับกัน: greater emotional closeness with dogs. Cats higher in interaction + lower perceived cost' },

  { id: 1131, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.108', tags: ['mock-1', 'part-1', 'tf'], type: 'tf',
    examOrigin: 'Mock 1 Part I',
    passage: PASSAGE_PETS, passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: 'Overall, the total CORS/MDORS score indicated that relationships with cats were better than with dogs.',
    answer: true, explain: 'True — "the total score indicates that relationships with cats are better than relationships with dogs"' },

  { id: 1132, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.109', tags: ['mock-1', 'part-1', 'tf'], type: 'tf',
    examOrigin: 'Mock 1 Part I',
    passage: PASSAGE_PETS, passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: 'The age of the companion animal correlated positively with perceived cost (i.e., older pets cost more).',
    answer: false, explain: 'False — correlation was negative (rs = −0.263 cats, −0.349 dogs). Younger pets imply higher perceived cost' },

  { id: 1133, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Textbook p.105', tags: ['mock-1', 'part-1', 'tf'], type: 'tf',
    examOrigin: 'Mock 1 Part I',
    passage: PASSAGE_PETS, passage_title: 'Article: Pet-Human Relationships — Dogs versus Cats',
    q: 'Both the MDORS and CORS use exactly the same number of questionnaire items.',
    answer: false, explain: 'False — Methods note "the number of items differs between the MDORS and the CORS" — that\'s why they used mean scores for comparison' },

  // ── Mock 1 Part II — Summary writing ──────────────────────
  { id: 1135, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Textbook p.154-155 ("Bats" by Debbie Dean) + Final Exam Spec',
    tags: ['mock-1', 'part-2', 'essay', 'summary'], type: 'essay',
    examOrigin: 'Mock 1 Part II',
    passage: PASSAGE_BATS, passage_title: 'Read this article and write a summary',
    target_words: 150, soft_max_words: 180, hard_max_words: 200,
    q: 'Part II — Writing a Summary (15 points)\n\nWrite a 150-word summary of the article above using different paraphrasing techniques.\n\n*Tips: identify ONE main idea + 4-5 major supporting details. Use your own words. Do NOT include opinions, examples, or quotations from the original.*',
    model_answer: `Sample Summary — "The Undervalued Bat" (~155 words from textbook p.155)

In the article "Bats," by Debbie Dean, we learn that in contrast to some mistaken beliefs, bats have sight, are mammals, and are not especially likely to carry rabies. Bats are relatively misunderstood and unappreciated.

Bats have some interesting physical features. They have similar bone structure and skeletons to that of humans, so they are not winged rodents. They are color blind, so they use echolocation if there is not sufficient light. Otherwise, their sight is enough.

Species of bats total about a thousand. The species come in a variety of sizes and have unique diets. Most eat insects, but some eat plant products and small animals. However, vampire bats drink blood, which can be harmful to livestock.

Bats can actually be helpful to humans. They destroy unwanted bugs, spread fruit seeds, and pollinate plants. However, the survival of bats is not known because many are killed by human disruptions and predators.

📌 Main idea: Bats are misunderstood mammals that are actually beneficial through pest control, seed dispersal, and pollination — but their populations are declining due to human activity.

📌 Major details:
1. Common misconceptions vs reality (mammals not rodents, can see, low rabies risk)
2. Echolocation for navigation in darkness
3. ~1000 species + diverse diets (insects 70% / fruit / nectar / vampire bats)
4. Beneficial functions (pest control, seed dispersal, pollination)
5. Population decline (60% don't survive infancy, human pesticides + intrusions)`,
    rubric: `Marking Criteria (Total = 15 points)

Content (7 pts) — main idea (1-2 pts) + major details (1 pt each)
Organization & Grammar (5 pts) — connected ideas + transitions + few/no errors
Paraphrasing (3 pts) — 3 = own words ★ / 2 = own words but copy some / 1 = minimal / 0 = copy all
Word-count Penalty: > 180 words → −1 / > 200 words → −2`,
    explain: 'Use the model answer + rubric to grade. Aim for 150 words; staying under 180 is safest. Open with main idea, use 4-5 key details, add transitions (However, Moreover, In addition), paraphrase fully (change BOTH words AND structure), cite the original ("In the article...by Debbie Dean"). NO opinion, NO examples from original.' },

  // ═══════════════════════════════════════════════════════════
  // 🎯 MOCK 2 — Bone Density in Baboons (Exercise 2 KEY Article I)
  // Part I (1140-1153) → Part II (1155 — same passage as exam usually
  // pairs it; we use a different summary text for variety)
  // ═══════════════════════════════════════════════════════════
  // ── Mock 2 Part I — Introduction ──────────────────────────
  { id: 1140, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article I (KEY p.23)',
    tags: ['mock-2', 'part-1', 'introduction'], type: 'short',
    examOrigin: 'Mock 2 Part I',
    passage: PASSAGE_BABOONS, passage_title: 'Article: Age-Related Bone Loss in Baboons',
    q: 'What was the purpose of the study?',
    keywords: ['hypothesis', 'baboons', 'bone loss', 'osteopenia', 'osteoporosis', 'older'],
    model_answer: 'The purpose of the study was to test the hypothesis that older male and female baboons experience bone loss with age severe enough to be termed osteopenia and osteoporosis.',
    explain: 'Per Exercise 2 KEY: study aim → test hypothesis that older baboons of both sexes experience meaningful bone loss meeting human-comparable osteopenia/osteoporosis definitions' },

  { id: 1141, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article I (KEY p.23)',
    tags: ['mock-2', 'part-1', 'introduction', 'background'], type: 'short',
    examOrigin: 'Mock 2 Part I',
    passage: PASSAGE_BABOONS, passage_title: 'Article: Age-Related Bone Loss in Baboons',
    q: 'Regarding skeletal biology, what are the similarities between baboons and humans? (state at least 2)',
    keywords: ['bone loss', 'age', 'ovariectomy', 'remodeling', 'fracture', 'similar'],
    model_answer: 'Male and female baboons show bone loss with age similar to humans, and females show increased bone turnover after ovariectomy. Baboons also undergo intracortical remodeling that parallels humans. Baboon bone is similar to human bone with regard to fracture, microstructural, and compositional properties (mineral density, organic density, volume fraction, fracture surface pattern, length of collagen-mineral bundles, and secondary osteonal structure).',
    explain: 'Multiple similarities listed in Intro — answer can mention any 2+ for credit' },

  // ── Mock 2 Part I — Methods ───────────────────────────────
  { id: 1142, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Exercise 2 Article I (KEY p.23)',
    tags: ['mock-2', 'part-1', 'methods', 'design'], type: 'short',
    examOrigin: 'Mock 2 Part I',
    passage: PASSAGE_BABOONS, passage_title: 'Article: Age-Related Bone Loss in Baboons',
    q: 'What was the study design?',
    keywords: ['quantitative', 'observational'],
    model_answer: 'Quantitative research design (observational study). The researchers measured bone density data without intervening on the animals.',
    explain: 'Per Exercise 2 KEY: "Quantitative research design (Observational study)" — no intervention, just measurement' },

  { id: 1143, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article I (KEY p.23)',
    tags: ['mock-2', 'part-1', 'methods', 'sample'], type: 'short',
    examOrigin: 'Mock 2 Part I',
    passage: PASSAGE_BABOONS, passage_title: 'Article: Age-Related Bone Loss in Baboons',
    q: 'Describe the participants in this study.',
    keywords: ['460', '207', '5', '30', 'olive', 'yellow', 'baboons', '54'],
    model_answer: 'Two sets of samples were used. The primary sample contained 460 females and 207 males ranging in age from 5 to 30 years; subjects were olive baboons (Papio hamadryas anubis), yellow baboons (Papio hamadryas cynocephalus), and their hybrids. A second focused subsample of 54 females over the age of 19 years was also used.',
    explain: 'Per Exercise 2 KEY: "2 sets of samples — 1) The sample (460 females, 207 males) ranging in age from 5 to 30 years... 2) 54 females over the age of 19.0 years"' },

  { id: 1144, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article I (KEY p.23-24)',
    tags: ['mock-2', 'part-1', 'methods', 'setting'], type: 'short',
    examOrigin: 'Mock 2 Part I',
    passage: PASSAGE_BABOONS, passage_title: 'Article: Age-Related Bone Loss in Baboons',
    q: 'Describe the research setting.',
    keywords: ['snprc', 'sfbr', 'breeding colony', 'kenya'],
    model_answer: 'All animals were part of the breeding colony at the Southwest National Primate Research Center / Southwest Foundation for Biomedical Research (SNPRC/SFBR). The baboons were originally captured from Kenya for biomedical research. They were housed outdoors in social group cages and maintained on commercial monkey chow with ad libitum access.',
    explain: 'Per Exercise 2 KEY: "All animals were a part of the breeding colony at the SNPRC/SFBR. The baboons were captured from Kenya for biomedical research..."' },

  { id: 1145, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article I (KEY p.24)',
    tags: ['mock-2', 'part-1', 'methods', 'statistics'], type: 'short',
    examOrigin: 'Mock 2 Part I',
    passage: PASSAGE_BABOONS, passage_title: 'Article: Age-Related Bone Loss in Baboons',
    q: 'What statistical procedures were used in data analysis?',
    keywords: ['descriptive', 't-score', 'qualitative', 'comparison', 'bivariate', 'correlation'],
    model_answer: 'Descriptive statistics including T-scores were used, along with qualitative comparisons of inter-site correspondence and bivariate correlations.',
    explain: 'Per Exercise 2 KEY: Descriptive statistics: T-score · Qualitative comparisons of inter-site correspondence and bivariate correlations' },

  // ── Mock 2 Part I — True/False (Results) ──────────────────
  { id: 1148, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article I (KEY p.24)',
    tags: ['mock-2', 'part-1', 'tf', 'results'], type: 'tf',
    examOrigin: 'Mock 2 Part I',
    passage: PASSAGE_BABOONS, passage_title: 'Article: Age-Related Bone Loss in Baboons',
    q: 'It is likely that one-fourth of older females have osteopenia or osteoporosis at any skeletal sites.',
    answer: false, explain: 'False — per Exercise 2 KEY this statement is marked F. The Results show variable prevalence by skeletal site, not a single one-fourth figure across "any" sites' },

  { id: 1149, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article I (KEY p.24)',
    tags: ['mock-2', 'part-1', 'tf', 'results'], type: 'tf',
    examOrigin: 'Mock 2 Part I',
    passage: PASSAGE_BABOONS, passage_title: 'Article: Age-Related Bone Loss in Baboons',
    q: 'According to Figure 1, there was a significant relationship between the baboons with osteopenia and the normal group when classified by their ages.',
    answer: false, explain: 'False — per Exercise 2 KEY: Figure 1 showed NO statistically significant relationship between osteopenic vs normal groups when classified by age' },

  { id: 1150, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article I (KEY p.24)',
    tags: ['mock-2', 'part-1', 'tf', 'results'], type: 'tf',
    examOrigin: 'Mock 2 Part I',
    passage: PASSAGE_BABOONS, passage_title: 'Article: Age-Related Bone Loss in Baboons',
    q: 'The results show that osteopenia incidence may occur in relation to bones of the same anatomical region.',
    answer: true, explain: 'True — per Exercise 2 KEY: when osteopenia was identified at one skeletal site, it was likely to also occur at other bones of the same anatomical region (regional patterning)' },

  // ── Mock 2 Part I — Discussion ────────────────────────────
  { id: 1151, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article I (KEY p.24)',
    tags: ['mock-2', 'part-1', 'discussion', 'conclusion'], type: 'short',
    examOrigin: 'Mock 2 Part I',
    passage: PASSAGE_BABOONS, passage_title: 'Article: Age-Related Bone Loss in Baboons',
    q: 'What can be concluded from the study?',
    keywords: ['baboon', 'bone loss', 'age', 'females', 'osteopenia', 'osteoporosis'],
    model_answer: 'The baboon and related species experience bone loss with age, particularly in females. The degree to which bone loss reaches a magnitude substantial enough to be termed osteopenia or osteoporosis using definitions comparable to those applied to humans has only rarely been assessed previously, but this study confirms the pattern.',
    explain: 'Per Exercise 2 KEY: "The baboon and related species experience bone loss with age, particularly in females..."' },

  { id: 1152, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article I (KEY p.24)',
    tags: ['mock-2', 'part-1', 'discussion', 'limitations'], type: 'short',
    examOrigin: 'Mock 2 Part I',
    passage: PASSAGE_BABOONS, passage_title: 'Article: Age-Related Bone Loss in Baboons',
    q: 'What was the limitation of the study?',
    keywords: ['artificial', 'selection', 'healthier', 'oldest', 'survivorship'],
    model_answer: 'The colony management could result in artificial selection for healthier animals into the oldest age ranges (survivorship bias). This could explain the high incidence of osteopenia but the relative absence of frank osteoporosis observed in the data.',
    explain: 'Per Exercise 2 KEY: "This would result in artificial selection for healthier animals in the oldest age ranges, and could explain our high incidence of osteopenia, but absence of osteoporosis"' },

  { id: 1153, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article I (KEY p.24)',
    tags: ['mock-2', 'part-1', 'discussion', 'implications'], type: 'short',
    examOrigin: 'Mock 2 Part I',
    passage: PASSAGE_BABOONS, passage_title: 'Article: Age-Related Bone Loss in Baboons',
    q: 'What implication of the study did the authors mention?',
    keywords: ['baboon', 'animal model', 'human', 'bone', 'maintenance', 'turnover', 'valid'],
    model_answer: 'The results validate the use of the baboon as an appropriate and valuable animal model of human bone maintenance and turnover, supporting future biomedical research into osteopenia, osteoporosis, and skeletal aging.',
    explain: 'Per Exercise 2 KEY: "Ultimately our results validate the use of the baboon as an appropriate and valuable animal model of human bone maintenance and turnover"' },

  // ── Mock 2 Part II — Summary writing (Atopic dermatitis) ──
  { id: 1155, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Exercise 1 Text 1 (Atopic Dermatitis) + Final Exam Spec',
    tags: ['mock-2', 'part-2', 'essay', 'summary'], type: 'essay',
    examOrigin: 'Mock 2 Part II',
    passage: PASSAGE_ATOPIC, passage_title: 'Read this article and write a summary',
    target_words: 150, soft_max_words: 180, hard_max_words: 200,
    q: 'Part II — Writing a Summary (15 points)\n\nWrite a 150-word summary of the article on Atopic Dermatitis above. Use paraphrasing techniques (synonyms, structure changes, etc.). Include the main idea + key supporting details only. Do not include the full diagnostic checklist verbatim.',
    model_answer: `Sample summary (~150 words)

In her article on atopic dermatitis, Brooks (DVM, DABVP) explains that atopy is a genetically driven tendency for animals to develop allergic disease through an exaggerated immune response to environmental allergens such as pollen, mold, and dust. In affected dogs, allergens enter through a defective skin barrier and trigger inflammation, itching, scratching, hair loss, and skin thickening. Predisposed breeds include several terriers and retrievers. Diagnosis is clinical rather than test-based: meeting at least five of nine clinical features — including young onset, indoor lifestyle, response to steroids, recurrent yeast infection, foot and ear flap involvement, and characteristic seasonality — yields about 85% diagnostic accuracy. Importantly, ear margin and lower-back involvement argue against atopy, suggesting sarcoptic mange or flea allergy instead. Allergy testing by skin or blood is not used to diagnose atopy; rather, it is performed afterward to formulate immunotherapy serum tailored to that individual patient's allergens.

📌 Main idea: Atopic dermatitis in dogs is a genetic, immune-mediated allergy diagnosed clinically rather than by laboratory testing.

📌 Key details:
1. Definition of atopy + role of allergens entering through defective skin barrier
2. Genetic basis + predisposed breeds
3. Clinical signs (itching, hair loss, skin thickening, secondary yeast infection)
4. Diagnostic criteria — meeting ≥5 of 9 features = 85% accuracy
5. Distinguishing features (ear margin & lower back NOT involved)
6. Role of allergy testing (post-diagnosis, for immunotherapy formulation only)`,
    rubric: `Marking Criteria (Total = 15 points)

Content (7 pts) — main idea (1-2 pts) + major details (1 pt each, ~5 details)
Organization & Grammar (5 pts) — flow + transitions + few/no errors
Paraphrasing (3 pts) — 3 = own words ★ / 2 = own words but copy some / 1 = minimal / 0 = copy all
Word-count Penalty: > 180 → −1 / > 200 → −2`,
    explain: 'Atopic dermatitis is a meatier passage than "Bats" — main idea is the clinical-diagnosis-by-criteria nature of the disease. Pick 4-5 of the 9 features to mention rather than listing all. Mention that allergy testing is for THERAPY not diagnosis (high-yield distinction)' },

  // ═══════════════════════════════════════════════════════════
  // 🎯 MOCK 3 — Newcastle Disease in Oman (Exercise 2 KEY Article II)
  // Part I (1160-1173) → Part II (1175)
  // ═══════════════════════════════════════════════════════════
  // ── Mock 3 Part I — Introduction ──────────────────────────
  { id: 1160, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article II (KEY p.25)',
    tags: ['mock-3', 'part-1', 'introduction'], type: 'short',
    examOrigin: 'Mock 3 Part I',
    passage: PASSAGE_NEWCASTLE, passage_title: 'Article: Newcastle Disease in Oman',
    q: 'What was the purpose of the study?',
    keywords: ['seroprevalence', 'NDV', 'antibodies', 'risk factors', 'backyard', 'chicken', 'oman'],
    model_answer: 'The purpose of the study was to determine the seroprevalence of NDV antibodies and the herd-level risk factors associated with ND outbreaks in backyard chicken flocks in Oman.',
    explain: 'Per Exercise 2 KEY: "to determine the seroprevalence of NDV antibodies and the herd-level risk factors associated with ND outbreaks in backyard chicken flocks in Oman"' },

  { id: 1161, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article II (KEY p.25)',
    tags: ['mock-3', 'part-1', 'introduction'], type: 'short',
    examOrigin: 'Mock 3 Part I',
    passage: PASSAGE_NEWCASTLE, passage_title: 'Article: Newcastle Disease in Oman',
    q: 'What is the major approach used to prevent the severe spread of Newcastle disease (ND)?',
    keywords: ['vaccination'],
    model_answer: 'Vaccination.',
    explain: 'Per Exercise 2 KEY: vaccination is the primary control approach' },

  { id: 1162, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article II (KEY p.25)',
    tags: ['mock-3', 'part-1', 'introduction'], type: 'short',
    examOrigin: 'Mock 3 Part I',
    passage: PASSAGE_NEWCASTLE, passage_title: 'Article: Newcastle Disease in Oman',
    q: 'Name two reasons why Oman was considered a major location for NDV transmission.',
    keywords: ['migratory', 'birds', 'trade', 'neighboring'],
    model_answer: '(1) The trajectory of migratory birds passes through Oman. (2) The growing trade between Oman and neighboring countries increases poultry movement.',
    explain: 'Per Exercise 2 KEY: "1. the trajectory of migratory birds; 2. the growing trade between Oman and neighboring countries"' },

  // ── Mock 3 Part I — Methods ───────────────────────────────
  { id: 1163, subject: 'engprof', topic: 'research-design', year: 4,
    source: 'Exercise 2 Article II (KEY p.25)',
    tags: ['mock-3', 'part-1', 'methods', 'design'], type: 'short',
    examOrigin: 'Mock 3 Part I',
    passage: PASSAGE_NEWCASTLE, passage_title: 'Article: Newcastle Disease in Oman',
    q: 'What was the study design?',
    keywords: ['survey'],
    model_answer: 'Survey study.',
    explain: 'Per Exercise 2 KEY: Survey study (questionnaire + serum collection from backyard flocks)' },

  { id: 1164, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article II (KEY p.25)',
    tags: ['mock-3', 'part-1', 'methods', 'sample'], type: 'short',
    examOrigin: 'Mock 3 Part I',
    passage: PASSAGE_NEWCASTLE, passage_title: 'Article: Newcastle Disease in Oman',
    q: 'Describe the participants and samples in this study.',
    keywords: ['383', '139', '875', 'serum', 'farmers'],
    model_answer: '383 serum samples were collected from chickens in 139 flocks. In addition, 875 poultry farmers completed structured questionnaires.',
    explain: 'Per Exercise 2 KEY: "383 serum samples were collected from chickens from 139 flocks; 875 poultry farmers"' },

  { id: 1165, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article II (KEY p.25)',
    tags: ['mock-3', 'part-1', 'methods', 'setting'], type: 'short',
    examOrigin: 'Mock 3 Part I',
    passage: PASSAGE_NEWCASTLE, passage_title: 'Article: Newcastle Disease in Oman',
    q: 'Describe the research setting (location, region, and duration).',
    keywords: ['oman', 'governorates', 'june', 'september', '2016'],
    model_answer: 'The Sultanate of Oman, located on the west coast of the Gulf of Oman. Sampling was distributed across the nine governorates of Oman. The duration of data collection was from June 2016 to September 2016.',
    explain: 'Per Exercise 2 KEY: "the Sultanate of Oman... within the nine governorates of Oman... duration was from June 2016 to September 2016"' },

  { id: 1166, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article II (KEY p.25)',
    tags: ['mock-3', 'part-1', 'methods', 'statistics'], type: 'short',
    examOrigin: 'Mock 3 Part I',
    passage: PASSAGE_NEWCASTLE, passage_title: 'Article: Newcastle Disease in Oman',
    q: 'List the statistical procedures used in data analysis (state at least 3).',
    keywords: ['descriptive', 'pearson', 'chi-square', 'spearman', 'logistic', 'univariate', 'multivariate'],
    model_answer: 'Descriptive statistics (median and mean), the Pearson chi-square test, the Spearman correlation coefficient, and a logistic analysis comprising univariate and multivariate analyses.',
    explain: 'Per Exercise 2 KEY: descriptive stats / Pearson Chi-square / Spearman / logistic / univariate / multivariate' },

  // ── Mock 3 Part I — True/False (Results) ──────────────────
  { id: 1169, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article II (KEY p.26)',
    tags: ['mock-3', 'part-1', 'tf', 'results'], type: 'tf',
    examOrigin: 'Mock 3 Part I',
    passage: PASSAGE_NEWCASTLE, passage_title: 'Article: Newcastle Disease in Oman',
    q: 'There is a significant relationship between the NDV seroprevalence and all sampled flocks and birds at all locations.',
    answer: false, explain: 'False — per Exercise 2 KEY: this is F. NDV seroprevalence varied substantially across regions; it was not uniform across all sampled flocks/birds/locations' },

  { id: 1170, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article II (KEY p.26)',
    tags: ['mock-3', 'part-1', 'tf', 'results'], type: 'tf',
    examOrigin: 'Mock 3 Part I',
    passage: PASSAGE_NEWCASTLE, passage_title: 'Article: Newcastle Disease in Oman',
    q: 'Three-fifths of the products produced by the respondents\' farms are chicken meat.',
    answer: true, explain: 'True — per Exercise 2 KEY: 3/5 of products produced by respondents\' farms = chicken meat' },

  { id: 1171, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article II (KEY p.26)',
    tags: ['mock-3', 'part-1', 'tf', 'results'], type: 'tf',
    examOrigin: 'Mock 3 Part I',
    passage: PASSAGE_NEWCASTLE, passage_title: 'Article: Newcastle Disease in Oman',
    q: 'When there was an ND outbreak on their farms, respondents most likely stopped selling products and restricted productions more than the other practices.',
    answer: true, explain: 'True — per Exercise 2 KEY: respondents most commonly reported stopping product sales and restricting production over other practices (e.g., culling)' },

  // ── Mock 3 Part I — Discussion ────────────────────────────
  { id: 1172, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article II (KEY p.26)',
    tags: ['mock-3', 'part-1', 'discussion', 'conclusion'], type: 'short',
    examOrigin: 'Mock 3 Part I',
    passage: PASSAGE_NEWCASTLE, passage_title: 'Article: Newcastle Disease in Oman',
    q: 'What can be concluded from the study?',
    keywords: ['vital', 'epidemiology', 'high', 'seroprevalence', 'commercial', 'flocks'],
    model_answer: 'The study provided vital data for better understanding the epidemiology of ND in Oman. The results revealed a high seroprevalence of NDV in backyard chickens, representing a potential source of infection to commercial flocks. Factors such as the absence of a vaccination program, lack of veterinary services, and poor biosecurity measures could be addressed to reduce NDV exposure.',
    explain: 'Per Exercise 2 KEY: vital data + high seroprevalence + potential source to commercial flocks + factors that could reduce exposure' },

  { id: 1173, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: 'Exercise 2 Article II (KEY p.27)',
    tags: ['mock-3', 'part-1', 'discussion', 'recommendations'], type: 'short',
    examOrigin: 'Mock 3 Part I',
    passage: PASSAGE_NEWCASTLE, passage_title: 'Article: Newcastle Disease in Oman',
    q: 'What recommendation for further research was proposed in the article?',
    keywords: ['identify', 'genotypes', 'transmission', 'epidemiology', 'backyard'],
    model_answer: 'Future research should aim to identify the circulating virus genotypes and models of transmission for a better understanding of ND epidemiology in backyard chickens in Oman.',
    explain: 'Per Exercise 2 KEY: "identify the circulating virus genotypes and models of transmission for better understanding of ND epidemiology in backyard chickens in Oman"' },

  // ── Mock 3 Part II — Summary writing (Ear Abscesses) ──────
  { id: 1175, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: 'Exercise 1 Text 2 (Ear Abscesses) + Final Exam Spec',
    tags: ['mock-3', 'part-2', 'essay', 'summary'], type: 'essay',
    examOrigin: 'Mock 3 Part II',
    passage: PASSAGE_EARABSCESS, passage_title: 'Read this article and write a summary',
    target_words: 150, soft_max_words: 180, hard_max_words: 200,
    q: 'Part II — Writing a Summary (15 points)\n\nWrite a 150-word summary of the article on Ear Abscesses in Turtles and Tortoises above. Use paraphrasing techniques. Include the main idea + key supporting details (cause, signs, treatment, prevention). Do not list every predisposing factor verbatim.',
    model_answer: `Sample summary (~150 words)

According to Lock (DVM, DACZM), aural abscesses are a common bacterial infection in turtles and tortoises that originates in the mouth and migrates through the eustachian tube to the closed ear canal. Because reptilian pus is firm rather than liquid, it cannot drain naturally and instead accumulates as a cheesy mass that may rupture externally or, untreated, cause permanent skull damage. Several conditions predispose chelonians to abscesses, including immune suppression from stress or hibernation, viral infection, poor environmental conditions, recent trauma, pesticide exposure, and nutritional deficiency. Treatment requires surgical extraction of the hardened pus, ear-canal flushing, and frequent culture-and-sensitivity testing to guide antibiotic therapy. Pre-operative antibiotics may also be prescribed in severe cases. Prevention focuses on appropriate husbandry — controlled temperature, humidity, and water quality, regular water changes, and disinfection — alongside dietary correction and completion of the full prescribed antibiotic course to limit recurrence.

📌 Main idea: Aural abscesses in turtles/tortoises are a closed bacterial infection requiring surgery, with prevention through husbandry.

📌 Key details:
1. Cause + pathogenesis (bacterial, eustachian tube, firm pus)
2. Predisposing factors (stress, viral, environment, trauma, pesticides, malnutrition)
3. Treatment = surgery + culture-sensitivity + antibiotics
4. Prevention = husbandry (temperature/humidity/water) + diet + complete antibiotic course`,
    rubric: `Marking Criteria (Total = 15 points)

Content (7 pts) — main idea (1-2 pts) + major details (1 pt each, ~5 details)
Organization & Grammar (5 pts) — flow + transitions + few/no errors
Paraphrasing (3 pts) — 3 = own words ★ / 2 = own words but copy some / 1 = minimal / 0 = copy all
Word-count Penalty: > 180 → −1 / > 200 → −2`,
    explain: 'This passage has a clear cause→signs→treatment→prevention structure. Use that structure in your summary too. Don\'t list all 6 predisposing factors verbatim — group them ("various conditions including X, Y, Z"). Mention culture-and-sensitivity testing as it\'s clinically important.' },

  // ═══════════════════════════════════════════════════════════
  // 🎯 MOCK 4 — MRSP in Bangkok (✏️ ORIGINAL by Claude)
  // Part I (1180-1190) → Part II Summary (1192)
  // ═══════════════════════════════════════════════════════════
  // ── Mock 4 Part I — Introduction ──────────────────────────
  { id: 1180, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: '✏️ Original passage written for VetMock per Final exam spec',
    tags: ['mock-4', 'part-1', 'introduction', 'original'], type: 'short',
    examOrigin: 'Mock 4 Part I (Original)',
    passage: PASSAGE_AMR, passage_title: '✏️ MRSP in Canine Pyoderma — Bangkok (Original)',
    q: 'What was the purpose of the study?',
    keywords: ['prevalence', 'mrsp', 'bangkok', 'risk factors', 'pyoderma'],
    model_answer: 'The purpose of the study was to determine the prevalence of MRSP among S. pseudintermedius isolates from dogs presenting with pyoderma at three teaching hospitals in Bangkok, and to identify owner-reported risk factors associated with MRSP carriage.',
    explain: 'Always look in the LAST paragraph of Introduction for the explicit purpose statement. Here it begins "The purpose of this study was to..."' },

  { id: 1181, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: '✏️ Original',
    tags: ['mock-4', 'part-1', 'introduction', 'background'], type: 'short',
    examOrigin: 'Mock 4 Part I (Original)',
    passage: PASSAGE_AMR, passage_title: '✏️ MRSP in Canine Pyoderma — Bangkok (Original)',
    q: 'According to the introduction, what gene is responsible for methicillin resistance and what does it cause?',
    keywords: ['mecA', 'beta-lactam', 'cephalexin', 'resistance'],
    model_answer: 'The mecA gene confers methicillin resistance. It renders bacteria resistant to all beta-lactam antibiotics, including the first-line empirical drug, cephalexin.',
    explain: 'Background information in Intro: "Resistance to methicillin is conferred by the mecA gene, which renders bacteria resistant to all beta-lactam antibiotics including the first-line empirical drug, cephalexin"' },

  // ── Mock 4 Part I — Methods ───────────────────────────────
  { id: 1182, subject: 'engprof', topic: 'research-design', year: 4,
    source: '✏️ Original',
    tags: ['mock-4', 'part-1', 'methods', 'design'], type: 'short',
    examOrigin: 'Mock 4 Part I (Original)',
    passage: PASSAGE_AMR, passage_title: '✏️ MRSP in Canine Pyoderma — Bangkok (Original)',
    q: 'What was the study design and over what time period was the study conducted?',
    keywords: ['cross-sectional', '2024', 'january', 'december'],
    model_answer: 'A cross-sectional study, conducted between January and December 2024.',
    explain: 'Cross-sectional = snapshot of prevalence at a point/period in time' },

  { id: 1183, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: '✏️ Original',
    tags: ['mock-4', 'part-1', 'methods', 'sample'], type: 'short',
    examOrigin: 'Mock 4 Part I (Original)',
    passage: PASSAGE_AMR, passage_title: '✏️ MRSP in Canine Pyoderma — Bangkok (Original)',
    q: 'How many dogs were enrolled and how was the case definition for pyoderma determined?',
    keywords: ['210', 'cytologic', 'cocci', 'neutrophilic'],
    model_answer: '210 dogs with clinical pyoderma were enrolled. Pyoderma was defined by primary or secondary lesions plus cytologic evidence of cocci with neutrophilic inflammation.',
    explain: 'Methods specifies both sample size and the case definition — both expected in a Methods short answer' },

  { id: 1184, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: '✏️ Original',
    tags: ['mock-4', 'part-1', 'methods', 'instruments'], type: 'short',
    examOrigin: 'Mock 4 Part I (Original)',
    passage: PASSAGE_AMR, passage_title: '✏️ MRSP in Canine Pyoderma — Bangkok (Original)',
    q: 'How was methicillin resistance confirmed in the laboratory?',
    keywords: ['oxacillin', 'disc', 'mecA', 'PCR'],
    model_answer: 'Methicillin resistance was determined by oxacillin disc diffusion and confirmed by mecA PCR.',
    explain: 'Two-step lab confirmation: phenotypic (oxacillin disc diffusion) + genotypic (mecA PCR)' },

  { id: 1185, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: '✏️ Original',
    tags: ['mock-4', 'part-1', 'methods', 'statistics'], type: 'short',
    examOrigin: 'Mock 4 Part I (Original)',
    passage: PASSAGE_AMR, passage_title: '✏️ MRSP in Canine Pyoderma — Bangkok (Original)',
    q: 'What statistical procedures were used in data analysis?',
    keywords: ['descriptive', 'chi-square', 'mann-whitney', 'logistic'],
    model_answer: 'Descriptive statistics (mean, SD, percentage) were used. Chi-square test compared categorical variables and Mann-Whitney U test compared continuous variables. Risk factors with p < 0.10 in univariate analysis were entered into a multivariate logistic regression. Significance was set at p < 0.05.',
    explain: 'Standard epidemiologic stat package: descriptive + categorical (chi-square) + continuous (Mann-Whitney) + risk factor analysis (logistic regression with univariate screen)' },

  // ── Mock 4 Part I — True/False (Results) ──────────────────
  { id: 1187, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: '✏️ Original',
    tags: ['mock-4', 'part-1', 'tf', 'results'], type: 'tf',
    examOrigin: 'Mock 4 Part I (Original)',
    passage: PASSAGE_AMR, passage_title: '✏️ MRSP in Canine Pyoderma — Bangkok (Original)',
    q: 'The overall prevalence of MRSP in this Bangkok cohort exceeded 50%.',
    answer: false, explain: 'False — overall MRSP prevalence was 38.5% (72/187), which is below 50% even though it is at the upper end of figures reported elsewhere' },

  { id: 1188, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: '✏️ Original',
    tags: ['mock-4', 'part-1', 'tf', 'results'], type: 'tf',
    examOrigin: 'Mock 4 Part I (Original)',
    passage: PASSAGE_AMR, passage_title: '✏️ MRSP in Canine Pyoderma — Bangkok (Original)',
    q: 'After multivariate adjustment, prior antibiotic use within the last 6 months remained a significant predictor of MRSP carriage.',
    answer: true, explain: 'True — "After multivariate adjustment, prior antibiotic use and recurrent pyoderma remained significant predictors"' },

  { id: 1189, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: '✏️ Original',
    tags: ['mock-4', 'part-1', 'tf', 'results'], type: 'tf',
    examOrigin: 'Mock 4 Part I (Original)',
    passage: PASSAGE_AMR, passage_title: '✏️ MRSP in Canine Pyoderma — Bangkok (Original)',
    q: 'Among MRSP isolates, susceptibility to amikacin was retained in over 90% of cases.',
    answer: true, explain: 'True — "Susceptibility was retained for amikacin (96%), chloramphenicol (88%), and rifampicin (82%) among MRSP isolates"' },

  // ── Mock 4 Part I — Discussion ────────────────────────────
  { id: 1190, subject: 'engprof', topic: 'research-paper-structure', year: 4,
    source: '✏️ Original',
    tags: ['mock-4', 'part-1', 'discussion', 'limitations'], type: 'short',
    examOrigin: 'Mock 4 Part I (Original)',
    passage: PASSAGE_AMR, passage_title: '✏️ MRSP in Canine Pyoderma — Bangkok (Original)',
    q: 'What were the limitations of the study? (state at least TWO)',
    keywords: ['teaching', 'hospitals', 'referred', 'cross-sectional', 'causality'],
    model_answer: '(1) The study was restricted to teaching hospitals, which receive disproportionately complex cases referred from primary practice — overall community MRSP prevalence in Bangkok dogs may therefore be lower. (2) The cross-sectional design cannot establish causality between risk factors and MRSP acquisition — only association.',
    explain: 'Two distinct limitations cited in Discussion: (a) referral/setting bias from teaching-hospital sampling, (b) cross-sectional design limits causal inference. Either alone earns partial credit; both = full credit.' },

  // ── Mock 4 Part II — Summary writing (Original passage) ───
  { id: 1192, subject: 'engprof', topic: 'summary-writing', year: 4,
    source: '✏️ Original passage written for VetMock per Final exam spec',
    tags: ['mock-4', 'part-2', 'essay', 'summary', 'original'], type: 'essay',
    examOrigin: 'Mock 4 Part II (Original)',
    passage: PASSAGE_AMR, passage_title: '✏️ MRSP in Canine Pyoderma — Bangkok (Original)',
    target_words: 150, soft_max_words: 180, hard_max_words: 200,
    q: 'Part II — Writing a Summary (15 points)\n\n✏️ *This passage was written specifically for VetMock to practice the Final exam Part II format.*\n\nWrite a 150-word summary of the entire article above. Cover the main idea + key findings + key implications. Use your own words and proper paraphrasing techniques.',
    model_answer: `Sample summary (~155 words)

A recent cross-sectional study from three Bangkok teaching hospitals investigated how often methicillin-resistant Staphylococcus pseudintermedius (MRSP) infects dogs with pyoderma and which factors raise the risk. Among 210 enrolled dogs, the bacterium was isolated from 187, of which 38.5% were methicillin-resistant — a figure at the higher end of those reported internationally. Most resistant isolates were also resistant to several other antibiotic classes. Two factors were significantly associated with MRSP carriage after multivariable analysis: previous antibiotic use within six months and recurrent skin infections. Amikacin, chloramphenicol, and rifampicin remained largely effective against the resistant strains. Because cases came from referral hospitals, the community-wide rate may be lower; the cross-sectional design also prevents conclusions about causation. The authors argue that empirical cephalexin therapy in Bangkok dogs is now of questionable reliability, and they call for routine culture-and-sensitivity testing, careful prescribing, and longitudinal community studies.

📌 Main idea: MRSP is now substantially prevalent in Bangkok pyoderma dogs (38.5%), undermining empirical first-line therapy.

📌 Key details:
1. Cross-sectional, 3 hospitals, 210 dogs, 2024
2. Prevalence: 38.5%, mostly multidrug-resistant
3. Risk factors after multivariate: prior antibiotic + recurrent pyoderma
4. Susceptibility retained for amikacin/chloramphenicol/rifampicin
5. Limitations: referral setting + no causality (cross-sectional)
6. Implication: empirical cephalexin questionable; culture before re-prescribing`,
    rubric: `Marking Criteria (Total = 15 points)

Content (7 pts) — main idea (1-2 pts) + major details (1 pt each, ~5 details)
Organization & Grammar (5 pts) — connected ideas + transitions + few/no errors
Paraphrasing (3 pts) — 3 = own words ★ / 2 = own words but copy some / 1 = minimal / 0 = copy all
Word-count Penalty: > 180 → −1 / > 200 → −2

✏️ *Note: This is an original mock passage written specifically for VetMock per Final spec. Its difficulty mirrors the actual Final but allows practice with content the student has not previously seen.*`,
    explain: 'This passage is technical (genetics + statistics + clinical) — paraphrase carefully. Avoid copying long technical phrases like "methicillin-resistant Staphylococcus pseudintermedius" — you can shorten to MRSP after introducing it once. Mention BOTH significant risk factors but don\'t restate every odds ratio. State the practical implication (empirical cephalexin is questionable) clearly.' },

  // ═══════════════════════════════════════════════════════════
  // 🎯 MOCK 5 — 2021 PAST EXAM (Part III paraphrase task)
  // Reproduced from "Paraphase exam2021.pdf" (Final 2021)
  // ═══════════════════════════════════════════════════════════
  { id: 1195, subject: 'engprof', topic: 'paraphrasing', year: 4,
    source: 'Final Examination: Eng Vet Prof II 2021 — Part III',
    tags: ['mock-5', 'past-exam', '2021', 'paraphrase', 'essay'], type: 'essay',
    examOrigin: 'Past Exam 2021 · Part III',
    passage: PASSAGE_2021_PETS_ALLERGIES,
    passage_title: '📜 Past Exam 2021 · Part III · Paraphrase task (15 points)',
    target_words: 200, soft_max_words: 230, hard_max_words: 260,
    q: 'Final Examination: Eng Vet Prof II 2021 — Part III (15 points)\n\nParaphrase the following text using different paraphrasing techniques.\n\n*Note: this is a paraphrase task (full text), not a 150-word summary. The 2021 exam asked students to paraphrase the source while preserving all the information. Aim for around 200 words.*',
    model_answer: `Sample paraphrase from the 2021 student's response (handwritten):

It is said that living with your pet since you were an infant reduces the chance of developing allergies. The more pets you live with as an infant, the better benefits you get. To prove the words, Bill Hesselmar at the University of Gothenburg, Sweden, and colleagues were trying to gather and review the previous studies in which the data had been taken from 1,029 children aged between 7 and 8. The incidence of allergies in children who had spent the first year of their life with no pets, in children who had lived with one pet, in children who had lived with three pets, and in children who had lived with five pets were 49, 43, 24, and 0 percent, respectively. Obviously, the review has shown that the development of allergies was lower in children living with more pets. Moreover, it indicates that there is a dose-dependent relationship. Since the mid-20th century, some unknown causes have caused the rise of allergies. Hesselmar believes that human immune system can be sensitized by multiple stimulators, for example, pets who carrying microbes. Furthermore, being outdoors since a young age also seems to provide a protective effect.

📌 Key ideas to capture (highlighted in 2021 KEY):
1. Studies have found that having a pet early in life protects from allergies later in childhood
2. They looked at data from a previous study (1,029 children aged 7-8)
3. Incidence of allergies: 49% (no pets), 43% (one pet), 24% (three pets), 0% (five pets, n=2)
4. Dose-dependent relationship: more exposure to pets = more protection
5. Children who grow up on a farm with livestock have a lower risk of allergies
6. Allergies have been on the rise since the mid-20th century
7. Hesselmar's theory: pets carry microbes that stimulate the human immune system so children don't become allergic
8. Spending time with other children and being outdoors in early life also seems to have a protective effect

⚠️ Note: The 2021 sample student response above is presented as a real student-level reference, not as a perfect 15/15 answer. It demonstrates the expected length and style. Compare your paraphrase against the 8 key ideas — that's how the marker will check coverage.`,
    rubric: `Marking Criteria — 2021 Format (Total = 15 points)

Content (7 pts) — captured all key ideas (main idea + 5+ major details)
Organization & Grammar (5 pts) — flow + transitions + few/no errors
Paraphrasing (3 pts) — 3 = own words / 2 = mostly own / 1 = minimal / 0 = copy

📌 Note on 2021 vs 2025/26 format:
The 2021 exam asked students to paraphrase the entire text (not write a 150-word summary). The 2025/26 Final Spec changed this to a 150-word summary using paraphrasing techniques. So you'll get more practice of paraphrase mechanics here, but expect to compress more aggressively in the actual Final.

Word-count Penalty (this mock uses 2021 length expectations): > 230 → −1 / > 260 → −2`,
    explain: 'This is a real past-exam item from 2021. The task here is paraphrase, not summary — so you keep all the information but rewrite in your own words. Use the 5 paraphrasing techniques: synonyms, active↔passive, parts of speech, sentence markers, sentence structures. The 2021 student response above shows the expected length and style. Note: the 2025/26 Final asks for a 150-word SUMMARY instead, which is harder because you also need to compress.' },

  // ═══════════════════════════════════════════════════════════
  // 📝 EXTRA SUMMARY PRACTICE — already covered in Mock 2/3
  // ═══════════════════════════════════════════════════════════
  // (Atopic Dermatitis + Ear Abscess essays already appear in Mocks
  // 2 and 3 with full model answers + rubrics. Students can re-do
  // them via Bookmarks.)
];
