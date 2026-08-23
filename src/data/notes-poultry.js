// ──────────────────────────────────────────────────────────────────
// Poultry Health Management (3107409) Study Notes — Final scope (L8-L14)
// Final exam: 7 พ.ค. 2569, VET6 702, 13:00-15:00
// Coordinator: อ.ดร.เกรียงวิชญ์ ลิมปวิทยากุล
//
// ⚠️ Lecture order corrected per myCourseVille syllabus 6 พ.ค.:
//   L8 = Nutrition (อ.หทัยรัตน์) | L9 = Biosecurity (ณทยา) |
//   L10-11 = Drugs (นิวัตร) | L12 = QA (เอกสิงห์) |
//   L13 = Zoonosis (กมลพรรณ) | L14 = First-week mortality (เกรียงวิทย์)
//
// Source priority:
//   1) Lecture 2026 slides (L8-L14)
//   2) Master 86 compilation (senior recall)
//   3) Kim85 + Ploy83 cross-ref
//   4) AAAP / OIE / WHO standards
// ──────────────────────────────────────────────────────────────────

export const NOTES_POULTRY = {
  'nutrition': {
    topic: 'nutrition',
    title: 'L8, Animal Nutrition (Final scope!)',
    lecturer: 'ผศ.ดร.หทัยรัตน์ พลายมาศ (Hatairat Plaimast, ปี 86)',
    icon: '🌾',
    summary: '3 ส่วนหลัก (แหล่งอาหาร, วัตถุดิบ, กระบวนการผลิต), Limiting AAs, Lysine ref=100, ROSS 308 phase table, Antinutritional factors, Pelleting, Heat stress, Egg quality',
    sections: [
      {
        heading: 'ภาพรวม L8 — 3 ส่วนหลักของวิชา',
        source: 'Aj.หทัยรัตน์ slide L8 (Vet 84 — เนื้อหาเดียวกับ Vet 86)',
        body: [
          { bullets: [
            'การจัดการด้านอาหารสัตว์ปีกแบ่งเป็น **3 ส่วน**:',
            '  1. **คุณภาพของแหล่งอาหารสัตว์** (energy/protein/supplement balance)',
            '  2. **คุณภาพของวัตถุดิบ** (ingredient analysis + antinutritional factors)',
            '  3. **คุณภาพของกระบวนการผลิต + การจัดการหลังการผลิต** (grinding, pelleting, QC, storage, FIFO)',
            '**Animal Feed Composition** มาตรฐาน:',
            '  • Energy Source: **60%** (corn, cassava, rice bran)',
            '  • Protein Source: **30%** (soybean meal, fish meal)',
            '  • Nutritive Supplement / Non-Nutritive Feed Additives: **~10%**',
          ] },
        ],
      },
      {
        heading: 'Energy Requirements (ME ที่สำคัญ)',
        source: 'Aj.หทัยรัตน์ slide L8 p8-9',
        body: [
          { bullets: [
            '**ME meat bird > layer chicken**',
            '  • ไก่เนื้อ: **3,200 kcal/kg**',
            '  • ไก่ไข่: **2,800 kcal/kg**',
            '**ไก่กินเพื่อให้ได้ energy** → energy concentration กำหนด feed intake',
            '  • Energy ↑ → Feed intake ↓',
            '  • Energy ↓ → Feed intake ↑',
            '**Calorie:Protein ratio** สำคัญ — ถ้า energy สูงแต่ protein ต่ำ ไก่จะกินน้อยทำให้ขาด protein',
            '⭐ **Non-cage systems** (organic, cage-free, free-range) ต้องการ **+10–15% energy** เพิ่มจาก cage system (เคลื่อนไหวมากกว่า)',
          ] },
        ],
      },
      {
        heading: 'Protein & Amino Acids',
        source: 'Aj.หทัยรัตน์ slide L8 p10-11 + Master 86 + TJ p1',
        body: [
          { bullets: [
            '**3 most limiting AAs** (จำกัดที่สุด ลำดับการขาด):',
            '  1. **Methionine** — ไก่ไข่ขาดบ่อยสุด, key methyl donor',
            '  2. **Lysine** — กินเด่น เป็น **reference = 100** ใน ideal AA profile',
            '  3. **Threonine** — สำคัญต่อ mucin (gut)',
            '**Ideal AA Profile** เทียบเป็น % ของ Lysine ทุกช่วงอายุ:',
            '  • Met+Cys = 72, Threonine = 67-68.5, Tryptophan = 16-17, Arginine = 105-108',
            'ℹ️ ค่า ideal ratio เป็นช่วง ไม่ใช่ค่าตายตัว ขึ้นกับวิธีประเมิน สายพันธุ์ และเกณฑ์ที่ใช้ optimize (BWG หรือ FCR) — งาน N balance ใน ROSS 308 ได้ Arginine 105 และ Tryptophan 17-19 ตรงกับโน้ตดี แต่ได้ **Threonine เพียง 60-62** ขณะที่อีกงานได้ digestible Thr ต่อ Lys 66-70 ซึ่งใกล้เคียงโน้ต',
            '**Semi-essential AAs** = Cysteine + Tyrosine',
            '  • ปกติ Non-essential แต่สังเคราะห์จาก Met (→Cys) + Phe (→Tyr)',
            '  • ถ้าได้ Cys/Tyr ตรง → ลดความต้องการ Met + Phe',
            '**Digestible AA** > total AA — ไก่ใช้ได้จริงคือ digestible portion',
            '**Protein level**: meat bird > layer chicken (ตาม ME)',
          ] },
        ],
      },
      {
        heading: 'Broiler ROSS 308 Nutritional Requirement (ตารางที่ออกบ่อย)',
        source: 'Aj.หทัยรัตน์ slide L8 p16-17 + Animal Nutrition Consortium 2560',
        body: [
          { table: {
            headers: ['Nutrient', '1-21d Starter', '22d-slaughter Grower', 'Slaughter Finisher'],
            rows: [
              ['ME (kcal/kg)', '3,050-3,100', '3,150', '3,200'],
              ['Protein (%)', '21.5-22.0', '19.0-20.0', '17.5-18.5'],
              ['**Lysine**', '**1.35**', '**1.15**', '**1.06**'],
              ['Methionine', '0.50', '0.47', '0.41'],
              ['Met+Cys', '0.95', '0.85', '0.83'],
              ['Arginine', '1.45', '1.21', '1.11'],
              ['Threonine', '0.93', '0.78', '0.72'],
              ['Tryptophan', '0.22', '0.18', '0.17'],
              ['Available P', '0.46', '0.39', '0.40'],
            ] } },
          { bullets: [
            'Pattern: **Protein/AA ลด** ตามอายุ, **ME เพิ่ม** ตามอายุ',
            'อายุ 1-21d ต้องการ AA สูงสุด (Lysine 1.35%) เพราะกำลังเจริญเติบโต',
            'Layer/Pullet = ค่าต่ำกว่า broiler ทุกช่วง (กินเพื่อ maintenance + production)',
          ] },
        ],
      },
      {
        heading: 'Fat & Essential Fatty Acid',
        source: 'Aj.หทัยรัตน์ slide L8 p12 + Master 86 p6',
        body: [
          { bullets: [
            '**Linoleic acid (omega-6)** = Essential FA ในไก่, ไก่สังเคราะห์เองไม่ได้',
            '  • ใช้สร้าง phospholipid, arachidonic acid, prostaglandins',
            '**Minimum requirement**:',
            '  • Broiler > **3%**',
            '  • Pullet > 2%',
            '  • Layer (production) > 3%',
            '**ประโยชน์ของ fat ในอาหาร**:',
            '  • Important for high energy diets',
            '  • Improve diet palatability (อร่อย กินเยอะขึ้น)',
            '  • Reduce dustiness in feed mill / poultry house',
            '  • Improve product quality',
            '**Total fat** ในอาหาร — ไม่ควรเกิน 5% (ป้องกันรา + เหม็นหืน)',
          ] },
        ],
      },
      {
        heading: 'Minerals — Calcium & Phosphorus (สำคัญมาก!)',
        source: 'Aj.หทัยรัตน์ slide L8 p13-14 + Master 86 p7 + TJ p1 #3',
        body: [
          { table: {
            headers: ['Parameter', 'Broiler', 'Layer'],
            rows: [
              ['**Ca:Available P ratio**', '**2:1**', '**10:1** (เปลือกไข่)'],
              ['Eggshell composition', '—', '~95% CaCO₃'],
              ['Risk if imbalanced', 'ขาดโครงกระดูก', 'osteomalacia, hen fatigue'],
            ] } },
          { bullets: [
            '**Phytate-P** = **60-80%** ของ P ในอาหารพืช',
            '  • ไก่ไม่มี phytase enzyme → ใช้ไม่ได้',
            '  • ผูก mineral อื่น (Ca, Zn, Fe)',
            '  • **เสริม Phytase** ช่วยย่อย → ลด P inorganic',
            '**Available P (Non-phytate)** จาก Monocalcium phosphate / Dicalcium phosphate (inorganic)',
            '⚠️ **High dietary Ca** → ลดการดูดซึม P + ลด pepsin activity ใน proventriculus + gizzard → pH สูง → ย่อย protein แย่ลง',
            '**Coarse calcium 2-4 mm** (หินเกล็ด) สำคัญต่อ eggshell quality:',
            '  • ค้างใน gizzard → ปล่อย Ca ช้าๆ ตอนกลางคืน (ช่วงสร้างเปลือก)',
            '  • Fine Ca ดูดซึมเร็ว แต่หมดเร็ว — ใช้คู่กัน',
            '**Fine:Coarse Ca ratio ใน Layer** เปลี่ยนตามอายุ:',
            '  • 17-35 wk: **50:50**, 36-55 wk: 40:60, 56-90 wk: 35:65',
            '  • อายุมาก → เปลือกบางลง → เพิ่ม Coarse',
          ] },
        ],
      },
      {
        heading: 'Dietary Electrolyte Balance (DEB) + Trace Minerals + Vitamins',
        source: 'Aj.หทัยรัตน์ slide L8 p15 + Master 86 p7',
        body: [
          { bullets: [
            '**DEB สูตร**: DEB = (Na⁺ + K⁺) − Cl⁻ mEq/kg',
            '**Optimum** = **250 mEq/kg** (สำหรับ growth)',
            'DEB **สูงเกิน** → wet litter, alkalosis',
            'DEB **ต่ำเกิน** → acidosis, ลด feed intake',
            '**ปรับด้วย**: NaHCO₃ (Na⁺), NH₄Cl (Cl⁻), KCl, K₂SO₄',
            '**Trace minerals**: Organic > Inorganic biological availability',
            '  • Organic forms (chelated) ดูดซึมดีกว่า inorganic salts',
            '**Vitamin activity & stability**:',
            '  • Fat-soluble (A,D,E,K) — high PUFA / heat stress → เสริม **Vit E** (lipid antioxidant)',
            '  • Water-soluble (B,C) — heat stress → เสริม **Vit C** (water-soluble antioxidant)',
            '⚠️ ADEK กับ B-complex โดน oxidation ทำลายในอาหารร้อน — ต้องเสริม',
          ] },
        ],
      },
      {
        heading: 'Dietary Fiber & Feed Additives (Enzymes, Probiotics, Botanicals)',
        source: 'Aj.หทัยรัตน์ slide L8 p18-19',
        body: [
          { bullets: [
            '**Insoluble fiber (NSP)** = Cellulose, Lignin',
            '  • ย่อยช้า/ไม่ได้ → กระตุ้น **gizzard motility** + ลำไส้เคลื่อนตัว',
            '  • ลด pathogen attachment',
            '  • ใช้ใน developer diet (ไก่ไข่ระยะพัฒนา)',
            '**Soluble fiber (NSC)** = FOS, Beta-glucans, Resistant starch',
            '  • Ferment เร็ว → SCFA energy + microbiome',
            '  • แต่ระวัง viscosity สูงเกิน → ลด feed digestibility',
            '⭐ **Feed Additives 4 กลุ่ม**:',
            '  1. **Enzymes**: Phytase (ย่อย phytate), Protease, Amylase, NSP-ase',
            '  2. **Probiotics** (live bacteria): Lactobacillus, Bacillus, Yeast',
            '  3. **Prebiotics** (substrate for good bacteria): FOS, MOS (Mannan-oligosaccharides จาก yeast cell wall ผูก E.coli/Salmonella ขับออก)',
            '  4. **Botanicals**: Herbs, Spices, Plant extracts, Essential oils (e.g., Oregano, Carvacrol)',
          ] },
        ],
      },
      {
        heading: '⚠️ Antinutritional Factors / สารต่อต้านในวัตถุดิบ',
        source: 'Aj.หทัยรัตน์ slide L8 p22-25',
        body: [
          { table: {
            headers: ['ประเภทวัตถุดิบ', 'สารต่อต้าน / ข้อจำกัด'],
            rows: [
              ['**ข้าว/ข้าวโพด/รำ/มันสำปะหลัง** (cereals)', 'Mycotoxin (Aflatoxin, Zearalenone, Fumonisin, Ochratoxin), Soluble NSP (arabinoxylan), Hydrocyanic acid (มันสำปะหลัง), High fiber, Phytic acid, PUFA rancidity'],
              ['**โปรตีนพืช** (ถั่วเหลือง, canola, legumes)', 'Trypsin inhibitor, Phytate, Oligosaccharides, Mycotoxin (Zearalenone, T2-toxin), Glucosinolate (canola), Mimosine + Tannin (legumes), ⚠️ Mimosine กระทบ Thyroxine'],
              ['**โปรตีนสัตว์** (ปลาป่น, MBM, feather meal)', 'Salmonella, Biogenic amine, Gizzerosine (ปลาป่น — กัด gizzard), Thiaminase, Rancidity, Salt content, High Ash, Protein digestibility ต่ำ (MBM/PBM), Amino acid imbalance (feather meal)'],
              ['**Inorganic** (หิน, DCP, MCP)', 'หินเกล็ด/หินป่นใช้ใน mash/pellet, ⭐ **DCP (Dicalcium phosphate) มี Ca + P สูงกว่า bone meal**, Fluorine sulfur impurity, Salt'],
            ] } },
          { bullets: [
            '**Aflatoxin** เป็นอันตรายที่สุด → ตับเสียหาย + immunosuppression, ตรวจที่ moisture <14%',
            '**Trypsin inhibitor** ในถั่วเหลืองดิบ → ต้องอบ heat treatment ก่อนใช้',
            '**Gizzerosine** ในปลาป่นย่อย → กัด gizzard → ulcer, ต้องเลือก fish meal คุณภาพ',
          ] },
        ],
      },
      {
        heading: 'Feed Processing — Grinding, Pelleting, Crumbling',
        source: 'Aj.หทัยรัตน์ slide L8 p32-34',
        body: [
          { bullets: [
            '**1. Grinding** (บด)',
            '  • Optimal particle size สำคัญ',
            '  • Improve mixing, pelleting, feed digestibility',
            '**2. Pelleting** (อัดเม็ด)',
            '  • Prevent segregation of ingredients (ไก่กินครบทุกอย่างไม่เลือก)',
            '  • Reduce selective feeding',
            '  • Reduce feed wastage',
            '  • Increase bulk density',
            '  • Better body weight gains + improve **FCR**',
            '  • ⚠️ Better gizzard development — จุดนี้กล่าวเกินหลักฐาน สิ่งที่กระตุ้น gizzard คือ **อนุภาคหยาบ (coarse particle)** ไม่ใช่การอัดเม็ด: การทดลอง 14 วันพบน้ำหนัก gizzard ไม่เปลี่ยนตามข้าวโพดบดหยาบในสูตร crumble แต่เพิ่มขึ้นแบบเชิงเส้นในสูตร mash',
            '**3. Crumbling** (เม็ดบดละเอียด)',
            '  • ใช้สำหรับ starter (ไก่เล็กกินเม็ดใหญ่ไม่ได้)',
            '⭐ **Pellet > mash** สำหรับ feed intake ในไก่เนื้อ (Abdollahi 2018)',
            '⚠️ Pellet **ไม่ใหญ่เกิน** ไก่กินไม่ได้',
          ] },
        ],
      },
      {
        heading: 'Feed QC + Post-Production Management',
        source: 'Aj.หทัยรัตน์ slide L8 p35-36',
        body: [
          { bullets: [
            '**คุณภาพการผลิตอาหารสัตว์**:',
            '  • **Mixing test** — หาค่า **Coefficient of Variation (CV)** ตรวจการกระจายตัวของ ingredients',
            '  • ตรวจปริมาณโภชนะ (proximate analysis)',
            '  • ตรวจคุณภาพเม็ดอาหาร (hardness, durability)',
            '  • ตรวจการปนเปื้อน (E.coli, Mycotoxin, Salmonella)',
            '**การจัดการหลังการผลิต**:',
            '  • การเก็บรักษาอาหารสัตว์ — สะอาดต่อเนื่อง',
            '  • โครงการกำจัดสัตว์พาหะในไซโล',
            '  • ⭐ **First-In, First-Out (FIFO)** — ใช้อาหารเก่าก่อน ป้องกัน rancidity',
            '  • การส่งอาหารสัตว์ — สะอาด ปิดมิดชิด',
          ] },
        ],
      },
      {
        heading: 'Heat Stress Nutrition Management',
        source: 'Aj.หทัยรัตน์ slide L8 p42-44 + TJ p2 #11',
        body: [
          { bullets: [
            '**Heat stress** → reactive oxygen species (ROS) เพิ่ม + immunosuppression + ลด feed intake',
            '**Nutrition strategies**:',
            '  • **Maintain protein levels** + เพิ่ม crucial AAs:',
            '    - **Glutamine**, **Arginine**, **Threonine**',
            '  • **Increase fat** (heat increment ของ fat < protein/CHO)',
            '  • **Supplemental electrolytes**: NaHCO₃, NH₄Cl, KCl, K₂SO₄',
            '  • **Vit C + Vit E** (antioxidants)',
            '  • **Feed additives**: Prebiotic, Probiotic, **Betaine**, Phytochemicals',
            '**Feed management**:',
            '  • Frequent feeding (กินบ่อยครั้งละน้อย)',
            '  • Stirring of feed in feeder (กวนอาหารในถาด)',
            '  • Pellet/crumble form (กินเร็วกว่า mash)',
            '  • ให้กินตอนเย็น/เช้ามืด (อุณหภูมิต่ำ)',
          ] },
        ],
      },
      {
        heading: 'Broiler Diet Phases (Starter, Grower, Finisher)',
        source: 'Aj.หทัยรัตน์ slide L8 p46-49',
        body: [
          { bullets: [
            '**Starter diet** (1-21 วัน)',
            '  • ให้เป็น **crumble feed**',
            '  • Relatively high protein + AA content',
            '  • ให้กินเพื่อให้ได้ target weight',
            '  • Feed formulation **based on performance, not feed cost**',
            '**Grower diet** (transition)',
            '  • Transitioning จาก crumble → pellet',
            '  • Change of feed texture + nutrient density',
            '  • Pellet **ไม่ใหญ่เกินไป**',
            '**Finisher diet**',
            '  • Relatively high energy content',
            '  • Lowest protein (ดูตาราง ROSS 308 ด้านบน)',
          ] },
        ],
      },
      {
        heading: 'Layer Diet Phases (Starter, Grower, Developer, Pre-lay, Production)',
        source: 'Aj.หทัยรัตน์ slide L8 p50-58',
        body: [
          { bullets: [
            '**1. Starter** (0-5 wk)',
            '  • Fed as **crumble feed**',
            '  • Relatively high energy + protein',
            '  • **Ca 1.05–1.10%** เพื่อ skeletal growth',
            '**2. Grower** (5-10 wk)',
            '  • Slightly less energy + protein',
            '  • **Ca 0.9–1.10%**, supply adequate P',
            '**3. Developer** ⭐ (สำคัญ — ออกข้อสอบบ่อย)',
            '  • Promote **GI organ development** + reduce overweight birds',
            '  • **Low energy density + high fiber + coarse feed particles**',
            '  • → Increase feed intake, stimulate **gizzard activity**, increase digestive enzyme secretion',
            '**4. Pre-lay** (10-14 days OR until 2% hen-house production)',
            '  • Moderate increase Ca, P, protein',
            '  • **Dietary Ca supply 2-2.5%**',
            '**5. Production**',
            '  • Egg weight controlled by dietary energy intake',
            '  • Egg size in aging flocks: restrict sulfur-AAs (Met, Cys) + decrease P + Linoleic acid → 1% by end of lay',
          ] },
        ],
      },
      {
        heading: 'Egg Quality (Production diet)',
        source: 'Aj.หทัยรัตน์ slide L8 p58-61',
        body: [
          { bullets: [
            '**1. Albumen quality**',
            '  • **Vit C** improves albumen height + Haugh unit ใน heat-stressed hens',
            '**2. Yolk color** (สำคัญต่อราคาไข่)',
            '  • **Carotenoids/xanthophylls**: Lutein, Zeaxanthin, Capsanthin',
            '  • Plant sources: Corn, Corn gluten, Leucaena leaf meal, Marigold (ดอกดาวเรือง)',
            '  • Roche fan score 1-15',
            '**3. Eggshell quality**',
            '  • Adequate dietary Ca + P',
            '  • **Vit D** activity regulates Ca uptake',
            '    - Activated by hydroxylases ในตับ + ไต → **1,25-(OH)₂-D₃** (active form)',
            '    - ⚠️ ในไก่อายุมาก: ลด **α-1-hydroxylase activity** ในไต → ขาด active Vit D → เปลือกบาง',
            '  • Ca availability for shell ขึ้นกับ **particle size + gizzard activity**',
            '    - Coarse Ca 2-4mm + active gizzard → ปล่อย Ca ช้าๆ ตอนกลางคืน',
          ] },
        ],
      },
      {
        heading: 'Past Exam Mapping (L8 nutrition)',
        source: 'Master 86 compilation + TJ p1-2 + slide notes',
        body: [
          { bullets: [
            'Q "Animal feed composition %" → Energy 60%, Protein 30%, Supplements 10%',
            'Q "ME meat bird vs layer" → 3,200 vs 2,800 kcal/kg',
            'Q "Non-cage system energy +" → +10–15%',
            'Q "Most limiting AAs" → Methionine, Lysine, Threonine',
            'Q "Lysine ref ใน ideal profile" → = 100',
            'Q "Semi-essential AAs" → Cysteine + Tyrosine',
            'Q "Essential FA ในไก่" → Linoleic acid (omega-6)',
            'Q "Phytate-P %" → 60-80% ของ P ในอาหารพืช',
            'Q "Ca:P Broiler / Layer" → 2:1 / 10:1',
            'Q "DEB optimum" → 250 mEq/kg, (Na+K)−Cl',
            'Q "Heat stress vitamins" → Vit C + E',
            'Q "Heat stress AAs" → Glutamine, Arginine, Threonine',
            'Q "Coarse Ca size" → 2-4 mm, ค้าง gizzard ปล่อยตอนกลางคืน',
            'Q "Fine:Coarse Ca 17-35 wk" → 50:50',
            'Q "High GI pH effect" → ลด pepsin → ย่อย protein แย่ลง',
            'Q "Insoluble fiber benefit" → กระตุ้น gizzard + ลำไส้เคลื่อน',
            'Q "Broiler diet phases" → 3 phases, Protein ลด, Energy เพิ่ม',
            'Q "Layer Developer diet purpose" → low energy + high fiber + coarse → GI organ + reduce overweight',
            'Q "Pre-lay Ca supply" → 2-2.5%',
            'Q "Layer Starter Ca" → 1.05-1.10%',
            'Q "Yolk color sources" → Lutein/Zeaxanthin/Capsanthin, marigold, corn',
            'Q "Eggshell active Vit D" → 1,25-(OH)₂-D₃, α-1-hydroxylase ในไต',
            'Q "FIFO" → First-In First-Out, ป้องกัน feed rancidity',
            'Q "Antinutritional in fish meal" → Gizzerosine, Salt, Salmonella, Biogenic amine',
            'Q "Mycotoxins ในข้าวโพด" → Aflatoxin, Zearalenone, Fumonisin, Ochratoxin',
            'Q "Trypsin inhibitor source" → ถั่วเหลืองดิบ — ต้อง heat treatment',
            'Q "Banned antibiotics in layer" → Monensin/Salinomycin/Narasin/Maduramicin (cross-ref L10-11)',
          ] },
        ],
      },
    ],
  },

  'first-week-mortality': {
    topic: 'first-week-mortality',
    title: 'L14, First Week Mortality + Immunology (AHRA)',
    lecturer: 'อ.สมศักดิ์ + พี่อู๋ (course coordinator)',
    icon: '🐣',
    summary: 'AHRA framework, Pasgar score, IgY/MDA/Harderian gland, Rolling reaction, vaccine principles',
    sections: [
      {
        heading: 'Avian Immune System Anatomy',
        source: 'อ.สมศักดิ์ Lecture + Kim85 + Master 86',
        body: [
          { bullets: [
            '**Primary lymphoid organs**:',
            '  • **Bursa of Fabricius** — B-cell maturation (unique to birds), involutes ~15 wk',
            '  • **Thymus** — T-cell maturation, 7 lobes neck',
            '**Secondary lymphoid organs**:',
            '  • Spleen, cecal tonsils, Peyer\'s patches, Harderian gland (eye)',
            '  • GALT (gut-associated), BALT (bronchus-associated)',
            '⚠️ **No lymph nodes** in chickens (unlike mammals)',
          ] },
        ],
      },
      {
        heading: 'Antibodies + Maternal Immunity',
        source: 'อ.สมศักดิ์',
        body: [
          { table: {
            headers: ['Ig class', 'Mammal equivalent', 'Notes'],
            rows: [
              ['**IgY**', 'IgG', 'Major serum Ab, transferred via **yolk** → MDA in chick ~3 wk'],
              ['IgM', 'IgM', 'Pentamer, early infection, transferred via egg white (small amount)'],
              ['IgA', 'IgA', 'Mucosal, Harderian gland (upper resp), gut'],
            ],
          } },
          { bullets: [
            '**MDA (Maternal-Derived Antibody)** — protect chick first 1-3 weeks, interferes with vaccine',
            '**Harderian gland** — secretory IgA, upper respiratory immunity, spray vaccine target',
            'No placenta → all maternal Ig via egg',
          ] },
        ],
      },
      {
        heading: 'First Week Mortality Targets',
        source: 'AHRA / ShineChick framework',
        body: [
          { table: {
            headers: ['Period', 'Target Mortality', 'Concern If'],
            rows: [
              ['Day 0 (placement)', '<0.5%', '>1% = hatchery/transport'],
              ['Day 1-7', '<1%', '>1.5% spike = investigate'],
              ['Day 8-14', '<1.5%', 'Cumulative day 14 <2-3%'],
              ['Day 15-21', '<2%', 'Cumulative day 21 <3-4%'],
            ],
          } },
          { bullets: [
            'Slide showed 3% spike day 4 = abnormal (investigate hatchery / brooding)',
          ] },
        ],
      },
      {
        heading: 'Pasgar Score (Chick Quality at 24h)',
        source: 'Pasgar+© commercial framework',
        body: [
          { bullets: [
            '⚠️ **สเกลไม่ใช่ 0-5** — งานตีพิมพ์รายงานค่าเฉลี่ย Pasgar score 9.21 ± 0.89 ซึ่งเป็นไปไม่ได้ถ้าคะแนนเต็มคือ 5 แปลว่าคะแนนเต็มจริงอย่างน้อย 10 และข้อบกพร่องที่ตรวจพบเป็นตัวหักคะแนนลง',
            'ℹ️ งานร่วมชุดระบุว่าคะแนนที่ต่ำลงมาจาก poor navel quality, red hocks และ red beaks เป็นหลัก ซึ่งไม่ตรงกับคำที่โน้ตกางไว้',
            'ตามที่เลกเชอร์ให้ (ใช้ตอบข้อสอบ): Score **5 categories**, each 0-1, total 0-5 (perfect = 5) — สังเกตว่าโน้ตขัดกันเอง เพราะระบุ 5 หมวด แต่ไล่ 6 ตัวอักษร P-A-S-G-A-R',
            '**P** — Posture (legs steady, alert)',
            '**A** — Activity (responsive)',
            '**S** — Skin (navel closure)',
            '**G** — Gut (yolk absorption)',
            '**A** — Appearance (clean, feathered)',
            '**R** — Reflex (right itself when laid back)',
            '⭐ Pasgar ≥4 = good batch',
          ] },
        ],
      },
      {
        heading: 'Common Causes of First Week Mortality',
        source: 'AHRA framework + Aviagen',
        body: [
          { bullets: [
            '**Yolk sac infection (omphalitis)** — bacterial entry via unhealed navel, E. coli, Enterococcus, Staph',
            '**Dehydration** — improper water access, high temp brooding',
            '**Chilling** — cold floor, poor heat distribution',
            '**Overheating** — close-quarter brooding, heat stress',
            '**Starve-out** — chick fails to find feed/water (poor placement, long transport)',
            '**Pulmonary hypertension syndrome (ascites)** — high-altitude or hypoxia',
            '**Wet litter** — contributes to cold stress + paw pad injury',
          ] },
        ],
      },
      {
        heading: 'Vaccine Strategy (Rolling Reaction Concept)',
        source: 'อ.สมศักดิ์ + WVPA',
        body: [
          { bullets: [
            '**Rolling reaction** = vaccine mild local infection rolls through flock + boosts immunity',
            '⚠️ คำว่า rolling reaction เป็นศัพท์ภาคสนามและการค้า ไม่ใช่คำที่มีนิยามในวารสาร (ค้น PubMed ไม่พบบทความที่ใช้เป็น defined term) — ส่วนตัวกลไก คือวัคซีนเชื้อเป็นแพร่จากตัวสู่ตัว, take ไม่สม่ำเสมอทั้งฝูง, ปฏิกิริยาลากยาว มีหลักฐานทดลองยืนยันจริง',
            'Live vaccine spreads bird-to-bird → entire flock immunized even if some birds skip dose',
            'Risk: rolling reaction too strong → reaction stronger than disease → respiratory or production loss',
            'Mitigate: titer match, hatchery vs farm timing, MDA decay window',
          ] },
          { sub: 'Common Vaccines + Routes',
            body: [
              { table: {
                headers: ['Disease', 'Vaccine type', 'Route'],
                rows: [
                  ['Marek\'s', 'HVT/SB-1 cell-associated', 'In-ovo / SC day-old (hatchery)'],
                  ['IBD (Gumboro)', 'Live attenuated', 'Drinking water / SC immune complex'],
                  ['NDV', 'Live (LaSota, B1)', 'Spray, drinking water, eye drop'],
                  ['IB', 'Live (Mass, Ark, Conn)', 'Spray, drinking water'],
                  ['ILT', 'Live (TCO/CEO, vector)', 'Eye drop, spray (vector)'],
                  ['AI (H5/H7)', 'Inactivated', 'IM (regulated)'],
                  ['Coccidiosis', 'Live oocyst', 'Spray, feed gel'],
                ],
              } },
            ] },
          { sub: 'Vaccine Timing Decision',
            body: [
              { bullets: [
                'MDA high (early week 1) → live vaccine neutralized → ineffective',
                'MDA decay (week 2-3) → optimal vaccination window',
                'ℹ️ แม่นกว่าคือ **คำนวณจาก MDA titre ที่วัดจริงของฝูงนั้น** (Deventer/Kouwenhoven formula) ไม่ยึดปฏิทินตายตัว — งาน IBD ในแอลจีเรียได้ผลดีที่สุดเมื่อทำวัคซีนวันที่ 21 แล้ว boost วันที่ 28 คือปลายสัปดาห์ 3 ต่อสัปดาห์ 4',
                'Multi-dose schedule: prime + boost, monitor seroconversion (HI, ELISA)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Past Exam Mapping (L14 immunology + first week)',
        source: 'Master 86 compilation + Kim85',
        body: [
          { bullets: [
            'Q "Avian B-cell maturation organ" → Bursa of Fabricius',
            'Q "Maternal Ab via yolk" → IgY',
            'Q "Harderian gland role" → Mucosal IgA respiratory',
            'Q "Day 0 mortality target" → <0.5%',
            'Q "Pasgar 5 categories" → Posture, Activity, Skin, Gut, Appearance/Reflex',
            'Q "Omphalitis pathogen" → E. coli + Enterococcus + Staph',
            'Q "Rolling reaction concept" → live vaccine spread bird-to-bird boost flock immunity',
            'Q "ทำไม MDA ทำลายวัคซีน" → maternal Ab neutralize live vaccine virus',
          ] },
        ],
      },
    ],
  },

  'avian-zoonosis': {
    topic: 'avian-zoonosis',
    title: 'L13, Avian Zoonosis',
    lecturer: 'อ.กมลพรรณ เจริญกุล (Vet Public Health, CU)',
    icon: '🧬',
    summary: 'Zoonotic diseases ที่ติดจากสัตว์ปีกมาคน, bacteria + virus + fungi, AI pandemic, One Health',
    sections: [
      {
        heading: 'Major Avian Zoonoses (Bacterial)',
        source: 'Aj.กมลพรรณ slide L13 + WHO',
        body: [
          { table: {
            headers: ['Disease', 'Pathogen', 'Notes'],
            rows: [
              ['**Chlamydiosis (Psittacosis)**', 'Chlamydia psittaci', 'Gram-neg obligate intracellular, pet birds (parrots), pneumonia in handlers, doxycycline Tx'],
              ['**Erysipelas**', 'Erysipelothrix rhusiopathiae', 'Skin lesions in handlers, "fish handler\'s disease"'],
              ['**Avian TB**', 'Mycobacterium avium', 'Chronic granuloma, slow growth, zoonotic but rare'],
              ['**Salmonellosis**', 'Salmonella spp. (Typhimurium, Enteritidis)', 'Common foodborne, egg contamination via shell + transovarian'],
              ['**Campylobacteriosis**', 'Campylobacter jejuni', 'Most common bacterial gastroenteritis worldwide, undercooked poultry'],
              ['**Yersiniosis**', 'Yersinia pseudotuberculosis, Y. enterocolitica', 'Cold-loving, refrigerator pathogen'],
              ['**Q Fever**', 'Coxiella burnetii', 'Aerosol transmission, ruminants > poultry'],
              ['**Listeriosis**', 'Listeria monocytogenes', 'Refrigerator pathogen, pregnant + immunocompromised'],
            ],
          } },
        ],
      },
      {
        heading: 'Major Avian Zoonoses (Viral)',
        source: 'Aj.กมลพรรณ slide L13 + WHO + WOAH',
        body: [
          { table: {
            headers: ['Disease', 'Pathogen', 'Pandemic Risk'],
            rows: [
              ['**Avian Influenza (HPAI)**', 'Influenza A H5N1, H7N9, H5N6', '⭐ Highest, pandemic potential, 2024-2026 H5N1 dairy outbreak US'],
              ['**Newcastle disease (NDV)**', 'Paramyxovirus type 1', 'Conjunctivitis ใน handler, ส่วนใหญ่ self-limiting ⚠️ แต่ไม่ใช่ทุกราย มีรายงานเด็ก 2 ขวบที่ภูมิคุ้มกันบกพร่องติด pigeon variant ของ avian paramyxovirus type 1 แล้วเกิด neurologic infection จนเสียชีวิต'],
              ['**West Nile (WNV)**', 'Flavivirus', 'Mosquito-borne, birds = reservoir, neurologic in human'],
              ['**Eastern/Western EE**', 'Alphavirus', 'Mosquito vector, neurologic'],
              ['**Japanese encephalitis**', 'Flavivirus', 'Mosquito, pigs amplify'],
            ],
          } },
        ],
      },
      {
        heading: 'Avian Influenza (HPAI) — Detail',
        source: 'WOAH + WHO 2024-26',
        body: [
          { bullets: [
            '**Hemagglutinin (H1-18)** + **Neuraminidase (N1-11)** → 144 combinations theoretically',
            '**HPAI** = high pathogenicity (multibasic cleavage site at HA), 100% mortality in chickens',
            '**LPAI** = low pathogenicity, localized respiratory, can mutate to HPAI',
            '**Reservoir** = wild waterfowl (asymptomatic) → migration spread',
            '**Pandemic potential**: H5N1 (since 1997), H7N9 (China 2013), current concern dairy cattle 2024',
          ] },
          { sub: 'Transmission to Human',
            body: [
              { bullets: [
                'Direct contact with infected birds (slaughter, culling, handling)',
                'Aerosol from contaminated environments',
                'Rare human-to-human (pandemic alert)',
                'PPE: N95, goggles, gloves, gown',
              ] },
            ] },
          { sub: 'Public Health Response (Stamp Out)',
            body: [
              { bullets: [
                'Detection → quarantine premises → cull all birds → disposal (burn/bury) → disinfect → restocking after waiting period',
                'Surveillance ring 3-10 km',
                'Trace-back + trace-forward',
                'Biosecurity audit',
                'Compensation farmers',
              ] },
            ] },
        ],
      },
      {
        heading: 'Major Avian Zoonoses (Fungal, Parasitic)',
        source: 'Aj.กมลพรรณ slide',
        body: [
          { table: {
            headers: ['Disease', 'Pathogen', 'Notes'],
            rows: [
              ['**Cryptococcosis**', 'Cryptococcus neoformans (yeast)', 'Pigeon droppings, soil, meningitis in immunocompromised'],
              ['**Histoplasmosis**', 'Histoplasma capsulatum', 'Bird/bat droppings, pulmonary, endemic Mississippi'],
              ['**Aspergillosis**', 'Aspergillus fumigatus', 'Decaying organic matter, pulmonary, immunocompromised'],
              ['**Cryptosporidiosis**', 'Cryptosporidium spp.', 'Diarrhea, waterborne'],
            ],
          } },
        ],
      },
      {
        heading: 'One Health Concept',
        source: 'WHO + WOAH + FAO Tripartite',
        body: [
          { bullets: [
            '**One Health** = human + animal + environment integrated',
            '~75% of emerging infectious diseases are zoonotic',
            '~60% of all human pathogens are zoonotic',
            'Major collaborations: GLEWS (Global Early Warning System), OFFLU (avian flu), Tripartite (WHO+WOAH+FAO+UNEP since 2022)',
            'Vet role: surveillance, biosecurity, risk communication, One Health education',
          ] },
        ],
      },
      {
        heading: 'Past Exam Mapping (L13 zoonosis)',
        source: 'Master 86 compilation + WHO',
        body: [
          { bullets: [
            'Q "Psittacosis pathogen" → Chlamydia psittaci',
            'Q "Avian TB" → Mycobacterium avium',
            'Q "Pigeon dropping fungus" → Cryptococcus neoformans',
            'Q "AI HPAI subtype" → H5N1, H7N9',
            'Q "WNV reservoir" → wild birds',
            'Q "ทำไม Salmonella ไข่" → transovarian + shell contamination',
            'Q "Stamp out คือ" → cull all + disposal + disinfect + restock after wait',
            'Q "One Health คือ" → human + animal + environment integrated',
          ] },
        ],
      },
    ],
  },

  'biosecurity': {
    topic: 'biosecurity',
    title: 'L9, Biosecurity + Disease Surveillance',
    lecturer: 'อ.ณทยา เจริญวิศาล (ผศ.สพ.ญ.ดร.)',
    icon: '🛡',
    summary: '3-level biosecurity (Conceptual/Structural/Procedural), sample size + Se/Sp, disease prevention vs control',
    sections: [
      {
        heading: '3 Levels of Biosecurity',
        source: 'Aj.ณทยา slide L9 + Master 86 compilation p.28',
        body: [
          { table: {
            headers: ['Level', 'Definition', 'Examples'],
            rows: [
              ['**Conceptual**', 'แผนผังโครงสร้างฟาร์ม', 'Zoning, fencing, pest exclusion, ระยะห่างจากฟาร์มอื่น >1-3 km, prevailing wind direction'],
              ['**Structural**', 'อุปกรณ์ + ระบบ', 'Boot dip, perimeter fence, shower-in, dedicated equipment per house, all-in/all-out'],
              ['**Procedural**', 'SOP + monitoring', 'Employee training, water quality (pH + heavy metal + bacterial count), feed QC, recordkeeping, vehicle disinfection'],
            ],
          } },
        ],
      },
      {
        heading: 'Bio-Exclusion vs Bio-Containment',
        source: 'Aj.ณทยา + AAAP',
        body: [
          { bullets: [
            '**Bio-exclusion** = keep pathogens OUT (most poultry farms, prevent introduction)',
            '**Bio-containment** = keep pathogens IN (during outbreak, prevent spread)',
            'Both use same tools (PPE, disinfection, zoning) but mindset differs',
            'Bio-management = continuous biosecurity audit + improvement',
          ] },
        ],
      },
      {
        heading: 'Sampling for Surveillance',
        source: 'OIE + Cannon-Roe formula',
        body: [
          { bullets: [
            '**Sample size depends on test Se/Sp** — low Se/Sp → ต้องเพิ่ม n เพื่อ statistical power',
            'Cannon-Roe formula: n = log(α) / log(1 - Se×P) where P = expected prevalence, α = confidence',
            'Example: 95% confidence detect ≥5% prevalence with Se 90% → n ≈ 60',
          ] },
          { sub: 'Sample Types',
            body: [
              { table: {
                headers: ['Sample', 'Use'],
                rows: [
                  ['**Boot swab**', 'Environmental sampling (Salmonella, AI, litter)'],
                  ['**Cloacal swab**', 'Individual bird (NDV, AI, LT)'],
                  ['**Cleft palate / oropharyngeal swab**', 'Respiratory pathogens (MG, ILT, IB)'],
                  ['**Tracheal swab**', 'Respiratory virus high yield'],
                  ['**Serum**', 'Serology, titer, seroconversion (HI, ELISA)'],
                  ['**Tissue**', 'Necropsy lesions, IHC, PCR'],
                ],
              } },
            ] },
        ],
      },
      {
        heading: 'Production Metrics',
        source: 'Aviagen + Hy-Line + Lohmann',
        body: [
          { bullets: [
            '**Hen Housed (HH) production** = total eggs / hens housed at start',
            '**Hen Day (HD) production** = eggs that day / hens alive that day',
            'HD ≥ HH — HD จะสูงกว่า HH **เมื่อฝูงมี mortality** เท่านั้น (ถ้า mortality = 0 ทั้งสองค่าเท่ากันพอดี) ยิ่ง cumulative mortality สูง ช่องว่างยิ่งกว้าง',
            '**Mortality % cumulative** = critical KPI',
            '**Feed Conversion Ratio (FCR)** = feed consumed / weight gain (broiler) or per dozen eggs (layer)',
            '**EPEF (European Production Efficiency Factor)** = (livability × BW × 100) / (FCR × age), broiler benchmarking',
          ] },
        ],
      },
      {
        heading: 'Disease Prevention vs Control vs Eradication',
        source: 'Master 86 compilation p.28',
        body: [
          { table: {
            headers: ['Phase', 'Goal', 'Tools'],
            rows: [
              ['**Prevention**', 'ก่อนติด, keep out', 'Vaccine + biosecurity + surveillance + immunity check'],
              ['**Control**', 'หลังติด, limit spread', 'Isolation, culling, treatment, disinfection, trace + restrict movement'],
              ['**Eradication**', 'กำจัดให้หมด', 'Stamp out (HPAI), vaccination + cull, long-term surveillance'],
            ],
          } },
          { bullets: [
            'ถ้าโรคไวรัสที่รักษาไม่ได้ (เช่น HPAI) → stamp out (กำจัดทั้งฝูง + ทำลายซาก)',
            'Reportable diseases: AI, ND, Salmonellosis, Mycoplasmosis, ILT (varies by country)',
          ] },
        ],
      },
      {
        heading: 'Key Disinfectants',
        source: 'OIE + AAAP',
        body: [
          { table: {
            headers: ['Disinfectant', 'Spectrum', 'Use'],
            rows: [
              ['**Quaternary ammonium**', 'Bact, enveloped virus', 'General farm, gentle'],
              ['**Glutaraldehyde**', 'Broad incl. spores', 'Footbath, equipment'],
              ['**Sodium hypochlorite (bleach)**', 'Broad', 'Surface, 1:10 dilution, inactivated by organic matter'],
              ['**Phenolics**', 'Bact + some virus', 'Less affected by organic'],
              ['**Iodophors**', 'Broad', 'Equipment, footdip'],
              ['**Peracetic acid**', 'Broad incl. spores', 'Hatchery'],
              ['**Formaldehyde**', 'Broad incl. spores', '⚠️ Carcinogen, restricted, hatchery only'],
            ],
          } },
          { callout: '⚠️ Always clean (remove organic matter) BEFORE disinfect — most disinfectants inactivated by feces/feed', kind: 'warn' },
        ],
      },
      {
        heading: 'Past Exam Mapping (L9 biosecurity)',
        source: 'Master 86 compilation + Aj.ณทยา',
        body: [
          { bullets: [
            'Q "3 levels biosecurity" → Conceptual, Structural, Procedural',
            'Q "Conceptual ตัวอย่าง" → Zoning, ระยะห่างฟาร์ม, prevailing wind',
            'Q "Procedural ตัวอย่าง" → SOP, training, water QC, feed QC',
            'Q "Bio-exclusion vs containment" → out vs in',
            'Q "Boot swab ใช้ตรวจอะไร" → environmental Salmonella, AI litter',
            'Q "HH vs HD difference" → HH ignore mortality เริ่มต้น, HD รายวัน',
            'Q "Stamp out คืออะไร" → cull + disposal + disinfect + restock wait',
            'Q "Disinfectant ก่อนใช้ต้องทำไร" → clean organic matter ก่อน',
            'Q "Sample size ขึ้นกับ" → Se/Sp + prevalence + confidence',
          ] },
        ],
      },
    ],
  },

  'avian-drugs': {
    topic: 'avian-drugs',
    title: 'L10-11, Avian Drugs, AMR',
    lecturer: 'Prof.นิวัตร จันทร์ศิริพรชัย (DTBVM, CU Vet)',
    icon: '💊',
    summary: 'Antimicrobial classification, time- vs concentration-dependent, Mycoplasma Tx, banned drugs, AMR 5 Rs',
    sections: [
      {
        heading: 'Antimicrobial Classification',
        source: 'Prof.นิวัตร slide L10-11',
        body: [
          { table: {
            headers: ['Class', 'Mechanism', 'Example'],
            rows: [
              ['Cidal vs Static', 'Kill vs inhibit growth', 'Cidal: PCN, FQs, aminoglycoside, Static: tetra, macrolide, sulfonamide'],
              ['Time-dependent', 'Effect = time above MIC', 'β-lactams (PCN, cephalosporin), macrolides — give frequent doses'],
              ['Concentration-dependent', 'Effect = peak/MIC ratio', 'FQs, aminoglycosides — give high doses less often'],
              ['Mixed (AUC/MIC)', 'Both concentration + time', 'Tetracyclines, vancomycin (not in poultry)'],
            ],
          } },
        ],
      },
      {
        heading: 'PK/PD Principles',
        source: 'Prof.นิวัตร + Plumb',
        body: [
          { bullets: [
            '**PK (Pharmacokinetics)** = what body does to drug, ADME (Absorption, Distribution, Metabolism, Excretion)',
            '**PD (Pharmacodynamics)** = what drug does to body, MIC, MBC, post-antibiotic effect',
            '**MIC (Minimum Inhibitory Concentration)** = lowest conc inhibits visible growth in vitro',
            '**MBC (Minimum Bactericidal Concentration)** = lowest conc kills 99.9%',
            '**Distribution in poultry**:',
            '  • Water-soluble (tetracycline, sulfonamide, macrolide low-MW) → drinking water effective',
            '  • Lipid-soluble (FQs, macrolide high-MW) → IM/SC route',
            '  • Crop, gizzard pH affect oral absorption',
          ] },
        ],
      },
      {
        heading: '⛔ Banned Drugs (Thailand poultry)',
        source: 'Prof.นิวัตร, Thai DLD regulations + EU/FDA',
        body: [
          { bullets: [
            '**Vancomycin** — last-resort human, ห้ามในสัตว์อาหาร (AMR critical)',
            '**DES (Diethylstilbestrol)** — synthetic estrogen, carcinogen',
            '**Chloramphenicol (CAP)** — bone marrow toxicity in humans (aplastic anemia), zero tolerance residue',
            '**Nitrofurans** (Furazolidone, Nitrofurazone, AOZ, AMOZ) — carcinogenic + mutagenic',
            '**Nitroimidazoles** (Metronidazole, Dimetridazole) — carcinogenic suspected',
            '**Beta-agonists** (Clenbuterol, Ractopamine ห้ามในไทยและ EU)',
            '**Carbadox** (growth promoter) — carcinogenic',
          ] },
          { callout: '⚠️ Reason: ตกค้างในผลิตภัณฑ์ → carcinogen/mutagen + AMR concern, zero tolerance ห้ามแม้ trace', kind: 'warn' },
        ],
      },
      {
        heading: 'Common Conditions + First-line Drugs',
        source: 'Slide L10-11 + AAAP',
        body: [
          { table: {
            headers: ['Condition', 'Pathogen', 'First-line'],
            rows: [
              ['**Mycoplasmosis (MG/MS)**', 'Mycoplasma gallisepticum / synoviae', 'Tylosin, Tilmicosin, Enrofloxacin (NOT β-lactams, no cell wall), Doxycycline'],
              ['**Colibacillosis**', 'E. coli', 'Enrofloxacin, trimethoprim-sulfa, amoxicillin'],
              ['**Necrotic enteritis**', 'Clostridium perfringens', 'Bacitracin, Amoxicillin, Tylosin'],
              ['**Coccidiosis**', 'Eimeria spp.', 'Toltrazuril, Amprolium, Sulfaquinoxaline, Decoquinate (in feed)'],
              ['**Salmonellosis**', 'Salmonella spp.', 'Enrofloxacin, Trimethoprim-sulfa, vaccinate prefer'],
              ['**Pasteurellosis (Fowl cholera)**', 'Pasteurella multocida', 'Sulfonamide, Tetra, Penicillin'],
              ['**Plasmodium (Avian malaria)**', 'Plasmodium spp.', 'Chloroquine + Primaquine'],
              ['**Knemidocoptes (scaly leg mite)**', 'Mite', 'Ivermectin'],
              ['**Mold binders (mycotoxin)**', 'Aspergillus, Fusarium toxin', 'Clay binders + activated charcoal'],
            ],
          } },
        ],
      },
      {
        heading: 'Drug Withdrawal Period',
        source: 'EMA, FDA, Thai DLD',
        body: [
          { bullets: [
            '**Withdrawal time** = period drug must be stopped before slaughter / egg sales, safe MRL',
            'Examples (broiler):',
            '  • Enrofloxacin: 8-10 days — ⚠️ ไม่มีค่าเดียวที่ใช้ได้ทุกสายพันธุ์ งานในไก่ 5 สายพันธุ์ (ป้อน 10 mg/kg นาน 5 วัน) ได้ WT สายขนขาวประมาณ 2.30-2.64 วัน แต่สายขนเหลืองและไก่กระดูกดำได้ 8.16-39.74 วัน โดย skin with fat เป็น limiting tissue ทั้งนี้ตัวเลขชุดนี้อ้าง MRL ของจีน ใช้แทนค่าที่ขึ้นทะเบียนในไทยไม่ได้',
            '  • Doxycycline: 5-7 days',
            '  • Tylosin: 1-5 days',
            '  • Amoxicillin: 1-7 days',
            'Layer: more strict due to egg residue → many drugs ห้ามใน laying hens',
            'Records mandatory, audit trail',
          ] },
        ],
      },
      {
        heading: 'AMR 5 Rs (responsible use)',
        source: 'WHO + OIE + FAO Tripartite',
        body: [
          { bullets: [
            '⚠️ ชื่อกรอบและที่มา: กรอบ **5R ของ antimicrobial stewardship ทางสัตวแพทย์ที่ตีพิมพ์จริง** คือ Responsibility, Review, Reduce, Replace, Refine ไม่ใช่ชุด Right ข้างล่างนี้ และไม่ได้ออกโดย WHO, WOAH หรือ FAO — ชุด Right 5 ข้อยืมมาจากหลัก rights of medication administration ทางการพยาบาลและเภสัชกรรม แต่ละข้อยังเป็น stewardship ที่ถูกต้อง',
            '**Right Drug** (narrow spectrum if possible, culture-guided)',
            '**Right Dose** (full therapeutic, ไม่ underdose → resistance selection)',
            '**Right Duration** (ไม่ short course, complete treatment)',
            '**Right Time** (early, before deterioration)',
            '**Right Patient** (correct ID, withdrawal time, residue avoidance)',
            '+ Avoid prophylactic mass medication where possible',
            '+ Never use HPCIA (Highest Priority Critically Important Antimicrobials, colistin, 3rd-gen ceph) in poultry routine',
          ] },
        ],
      },
      {
        heading: 'Past Exam Mapping (L10-11 drugs)',
        source: 'Master 86 + Kim85',
        body: [
          { bullets: [
            'Q "Time-dependent ตัวอย่าง" → β-lactams, macrolides',
            'Q "Concentration-dependent ตัวอย่าง" → FQs, aminoglycosides',
            'Q "Mycoplasma ทำไมไม่ใช้ β-lactam" → ไม่มี cell wall',
            'Q "Mycoplasma drug" → Tylosin, Tilmicosin, Enrofloxacin, Doxycycline',
            'Q "Banned drug poultry" → Vancomycin, CAP, Nitrofurans, DES',
            'Q "ทำไม CAP ห้าม" → bone marrow aplastic anemia in human',
            'Q "AMR 5 Rs" → Right Drug, Dose, Duration, Time, Patient',
            'Q "Withdrawal time" → period before slaughter for residue safety',
            'Q "Coccidiostat ตัวอย่าง" → Toltrazuril, Amprolium, Decoquinate',
            'Q "Knemidocoptes Tx" → Ivermectin',
          ] },
        ],
      },
    ],
  },

  'quality-assurance': {
    topic: 'quality-assurance',
    title: 'L12, Quality Assurance, Betagro framework',
    lecturer: 'น.สพ.เอกสิงห์ สาเรือง (Betagro)',
    icon: '🏆',
    summary: 'QA 5 ด้าน, PDCA cycle, Five Freedoms, BQM 4 มิติ, Haugh Unit, FCR, Slow-growth',
    sections: [
      {
        heading: 'Quality Assurance 5 ด้าน',
        source: 'น.สพ.เอกสิงห์ slide L12',
        body: [
          { table: {
            headers: ['Element', 'Definition'],
            rows: [
              ['**Quality Control (QC)**', 'Inspection ระหว่างผลิต, catch defect early'],
              ['**Quality Audit**', 'Internal/external review, compliance check'],
              ['**Accreditation**', 'Certification body (GAP, HACCP, ISO, GMP)'],
              ['**Quality Assessment**', 'Outcome metrics (Haugh Unit, FCR, mortality)'],
              ['**Traceability**', 'Track product back to farm/batch, QR code, barcode'],
            ],
          } },
        ],
      },
      {
        heading: 'PDCA Cycle (Deming wheel)',
        source: 'Quality management standard, ISO 9001',
        body: [
          { bullets: [
            '**Plan** — ระบุปัญหา + วางแผน (e.g. egg quality drop)',
            '**Do** — ลงมือทำตามแผน (test new feed in 1 house)',
            '**Check** — เก็บข้อมูล + ประเมิน (Haugh Unit, egg weight)',
            '**Act** — Standardize ถ้าสำเร็จ, revise ถ้าไม่, loop กลับ Plan',
            'Continuous improvement, iterative',
          ] },
        ],
      },
      {
        heading: 'Five Freedoms (Welfare)',
        source: 'FAWC + AVMA + RSPCA',
        body: [
          { bullets: [
            '1. Freedom from **hunger + thirst** (access to fresh water + balanced diet)',
            '2. Freedom from **discomfort** (proper environment, shelter, resting area)',
            '3. Freedom from **pain, injury, disease** (prevention + rapid diagnosis + treatment)',
            '4. Freedom to **express normal behavior** (space, facilities, social companions)',
            '5. Freedom from **fear + distress** (conditions avoid mental suffering)',
          ] },
          { callout: '⭐ Five Freedoms = foundation of modern animal welfare science, adopted globally', kind: 'tip' },
        ],
      },
      {
        heading: 'Five Domains Model (newer, 2020)',
        source: 'Mellor 2020',
        body: [
          { bullets: [
            'Update of Five Freedoms, 5 domains:',
            '1. Nutrition',
            '2. Physical environment',
            '3. Health',
            '4. Behavioural interactions',
            '5. **Mental state** (positive emotions, NOT just absence of negative)',
            '⭐ Adds positive welfare focus (vs only avoiding negative)',
          ] },
        ],
      },
      {
        heading: 'BQM 4 มิติ (Better Quality Management)',
        source: 'Betagro QA framework',
        body: [
          { table: {
            headers: ['Dimension', 'Metric examples'],
            rows: [
              ['**Productivity**', 'Hen housed, FCR, livability, weight gain'],
              ['**Quality**', 'Haugh Unit, egg weight uniformity, meat color/pH'],
              ['**Safety**', 'Antibiotic residue zero, Salmonella negative, withdrawal compliance'],
              ['**Welfare**', 'Stocking density, footpad lesion score, mortality, behavioral indicators'],
            ],
          } },
        ],
      },
      {
        heading: 'Key Metrics',
        source: 'Betagro + Aviagen + Hy-Line',
        body: [
          { bullets: [
            '**Haugh Unit (HU)** — egg quality, log of albumen height adjusted for egg weight, >72 = AA grade',
            '**FCR (Feed Conversion Ratio)** = feed consumed / weight gain, target broiler 1.6-1.8',
            '**ADG (Average Daily Gain)** = total weight gain / days',
            '**Slow-growth trade-offs** — better welfare, slower growth, higher cost vs intensive, ~56-day vs 35-day, "premium" market',
            '**NCR (Non-Conformance Report)** — log + corrective action',
            '**Footpad Dermatitis Score (FPD)** — 0-4 scale, welfare KPI, linked to litter wetness',
            '**Hock burn** — welfare indicator, lower body contact with wet litter',
          ] },
        ],
      },
      {
        heading: 'Egg Quality Parameters',
        source: 'USDA + Hy-Line',
        body: [
          { bullets: [
            '**Albumen height** = proxy for protein quality',
            '**Yolk color** = Roche fan 1-15, feed pigment (xanthophyll, marigold, capsanthin)',
            '**Shell quality** = thickness >0.33 mm, color, cracks',
            '**Specific gravity** = 1.080-1.100 = good shell',
            'Storage affects HU drop (~0.5 unit/day at room temp), refrigerate slows decline',
          ] },
        ],
      },
      {
        heading: 'GAP / HACCP / ISO Standards',
        source: 'Codex Alimentarius + Thai DLD',
        body: [
          { bullets: [
            '**GAP (Good Agricultural Practice)** — farm-level standard, Thai GAP DLD',
            '**HACCP (Hazard Analysis Critical Control Point)** — food safety, 7 principles, CCP identification',
            '**ISO 9001** — quality management system, documented process',
            '**ISO 22000** — food safety management',
            '**Halal, Kosher** — religious certification',
            '**Animal Welfare standards** (Global GAP, RSPCA assured)',
          ] },
          { sub: 'HACCP 7 Principles',
            body: [
              { bullets: [
                '1. Conduct hazard analysis',
                '2. Determine CCPs',
                '3. Establish critical limits',
                '4. Establish monitoring procedures',
                '5. Establish corrective actions',
                '6. Establish verification procedures',
                '7. Establish recordkeeping',
              ] },
            ] },
        ],
      },
      {
        heading: 'Past Exam Mapping (L12 QA)',
        source: 'Master 86 + Kim85',
        body: [
          { bullets: [
            'Q "QA 5 ด้าน" → QC, Audit, Accreditation, Assessment, Traceability',
            'Q "PDCA" → Plan, Do, Check, Act',
            'Q "Five Freedoms" → hunger/thirst, discomfort, pain/disease, normal behavior, fear/distress',
            'Q "Haugh Unit AA grade" → >72',
            'Q "FCR broiler target" → 1.6-1.8',
            'Q "BQM 4 มิติ" → Productivity, Quality, Safety, Welfare',
            'Q "HACCP CCP" → Critical Control Point, 7 principles',
            'Q "Slow-growth tradeoff" → welfare ↑, cost ↑, time ↑',
            'Q "Egg yolk color scale" → Roche fan 1-15',
          ] },
        ],
      },
    ],
  },
};
