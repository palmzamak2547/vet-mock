# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: summary-pdf-export.spec.js >> a summary prints as a PDF, and the app is put back afterwards
- Location: tests/e2e/summary-pdf-export.spec.js:113:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByText('Milk microbiology').first()

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "ข้ามไปเนื้อหาหลัก" [ref=e4]:
    - /url: "#main"
  - generic [ref=e5]:
    - banner [ref=e6]:
      - button "VetMock — หน้าแรก" [ref=e8] [cursor=pointer]
      - generic [ref=e19]:
        - button "ค้นหา" [ref=e20] [cursor=pointer]
        - button "ตัวเลือกธีมและจานสี" [ref=e25] [cursor=pointer]
    - main [active] [ref=e28]:
      - button "หน้าแรก" [ref=e30] [cursor=pointer]:
        - generic [ref=e31]: ←
      - generic [ref=e33]:
        - heading [level=1] [ref=e34]:
          - text: คลิป
          - emphasis [ref=e35]: ย้อนหลัง
        - paragraph [ref=e36]:
          - text: คลิปจากช่อง
          - link "Dai (@dai.1387)" [ref=e37]:
            - /url: https://www.youtube.com/@dai.1387
          - text: และอื่นๆ — คลิกเข้าไปเพื่อเลือกคลิปใน playlist ได้
      - generic [ref=e38]:
        - generic [ref=e39]:
          - button "ทั้งหมด 55 ชุด" [pressed] [ref=e40] [cursor=pointer]
          - button "เพิ่มคลิป" [ref=e41] [cursor=pointer]
        - generic [ref=e42]:
          - generic [ref=e43]: ปี 5, เทอม 1
          - generic [ref=e44]:
            - button "📊 ระบาดวิทยา 2" [ref=e45] [cursor=pointer]:
              - text: 📊 ระบาดวิทยา
              - generic [ref=e46]: "2"
            - button "🐟 คลินิกสัตว์น้ำ 2" [ref=e47] [cursor=pointer]:
              - text: 🐟 คลินิกสัตว์น้ำ
              - generic [ref=e48]: "2"
            - button "🦅 อายุรศาสตร์สัตว์ปีก 2" [ref=e49] [cursor=pointer]:
              - text: 🦅 อายุรศาสตร์สัตว์ปีก
              - generic [ref=e50]: "2"
            - button "🩺 POA, การแก้ปัญหาคลินิกสัตว์เล็ก 1" [ref=e51] [cursor=pointer]:
              - text: 🩺 POA, การแก้ปัญหาคลินิกสัตว์เล็ก
              - generic [ref=e52]: "1"
            - button "🥩 สุขศาสตร์น้ำนม + เนื้อ 2" [ref=e53] [cursor=pointer]:
              - text: 🥩 สุขศาสตร์น้ำนม + เนื้อ
              - generic [ref=e54]: "2"
            - button "🌐 One Health 2" [ref=e55] [cursor=pointer]:
              - text: 🌐 One Health
              - generic [ref=e56]: "2"
            - button "🏭 อุตสาหกรรมอาหาร (FIQC) 2" [ref=e57] [cursor=pointer]:
              - text: 🏭 อุตสาหกรรมอาหาร (FIQC)
              - generic [ref=e58]: "2"
            - button "🐎 เวชปฏิบัติม้า + ศัลย์ 2" [ref=e59] [cursor=pointer]:
              - text: 🐎 เวชปฏิบัติม้า + ศัลย์
              - generic [ref=e60]: "2"
            - button "🐴 การสืบพันธุ์ในม้า 2" [ref=e61] [cursor=pointer]:
              - text: 🐴 การสืบพันธุ์ในม้า
              - generic [ref=e62]: "2"
            - button "🦠 โรคติดต่อระหว่างสัตว์-คน 2" [ref=e63] [cursor=pointer]:
              - text: 🦠 โรคติดต่อระหว่างสัตว์-คน
              - generic [ref=e64]: "2"
            - button "🐖 อายุรศาสตร์สุกร 2" [ref=e65] [cursor=pointer]:
              - text: 🐖 อายุรศาสตร์สุกร
              - generic [ref=e66]: "2"
        - generic [ref=e67]:
          - generic [ref=e68]: ปี 5, เทอม 2
          - generic [ref=e69]:
            - button "🔬 Recent Advances in Vet Biosciences 1" [ref=e70] [cursor=pointer]:
              - text: 🔬 Recent Advances in Vet Biosciences
              - generic [ref=e71]: "1"
            - button "🎓 ปฐมนิเทศคลินิก 2" [ref=e72] [cursor=pointer]:
              - text: 🎓 ปฐมนิเทศคลินิก
              - generic [ref=e73]: "2"
        - generic [ref=e74]:
          - generic [ref=e75]: ปี 4, เทอม 1
          - generic [ref=e76]:
            - button "🐕 อายุรศาสตร์สัตว์เล็ก I 1" [ref=e77] [cursor=pointer]:
              - text: 🐕 อายุรศาสตร์สัตว์เล็ก I
              - generic [ref=e78]: "1"
            - button "🐩 อายุรศาสตร์สัตว์เล็ก II 2" [ref=e79] [cursor=pointer]:
              - text: 🐩 อายุรศาสตร์สัตว์เล็ก II
              - generic [ref=e80]: "2"
            - button "🔪 ปฏิบัติศัลยศาสตร์ I 1" [ref=e81] [cursor=pointer]:
              - text: 🔪 ปฏิบัติศัลยศาสตร์ I
              - generic [ref=e82]: "1"
            - button "🐖 สุขศาสตร์ฝูงสุกร 1" [ref=e83] [cursor=pointer]:
              - text: 🐖 สุขศาสตร์ฝูงสุกร
              - generic [ref=e84]: "1"
            - button "🐷 การสืบพันธุ์ในสุกร 1" [ref=e85] [cursor=pointer]:
              - text: 🐷 การสืบพันธุ์ในสุกร
              - generic [ref=e86]: "1"
            - button "🩻 การถ่ายภาพทางสัตวแพทย์ 1" [ref=e87] [cursor=pointer]:
              - text: 🩻 การถ่ายภาพทางสัตวแพทย์
              - generic [ref=e88]: "1"
            - button "🥩 ความปลอดภัยอาหาร 1" [ref=e89] [cursor=pointer]:
              - text: 🥩 ความปลอดภัยอาหาร
              - generic [ref=e90]: "1"
            - button "⚖️ กฎหมาย จริยธรรม + สวัสดิภาพสัตว์ 1" [ref=e91] [cursor=pointer]:
              - text: ⚖️ กฎหมาย จริยธรรม + สวัสดิภาพสัตว์
              - generic [ref=e92]: "1"
            - button "🐂 สุขศาสตร์ฝูงโค-กระบือ 1" [ref=e93] [cursor=pointer]:
              - text: 🐂 สุขศาสตร์ฝูงโค-กระบือ
              - generic [ref=e94]: "1"
        - generic [ref=e95]:
          - generic [ref=e96]: ปี 4, เทอม 2
          - generic [ref=e97]:
            - button "👁️ Vet Surg Lab II 3" [ref=e98] [cursor=pointer]:
              - text: 👁️ Vet Surg Lab II
              - generic [ref=e99]: "3"
            - button "🦴 Vet Surg Lab III 2" [ref=e100] [cursor=pointer]:
              - text: 🦴 Vet Surg Lab III
              - generic [ref=e101]: "2"
            - button "🐕 COM V 2" [ref=e102] [cursor=pointer]:
              - text: 🐕 COM V
              - generic [ref=e103]: "2"
            - button "🚨 COM III 2" [ref=e104] [cursor=pointer]:
              - text: 🚨 COM III
              - generic [ref=e105]: "2"
            - button "🩺 COM IV 2" [ref=e106] [cursor=pointer]:
              - text: 🩺 COM IV
              - generic [ref=e107]: "2"
            - button "🐾 Repro Lecture 2" [ref=e108] [cursor=pointer]:
              - text: 🐾 Repro Lecture
              - generic [ref=e109]: "2"
            - button "🐔 Poultry 2" [ref=e110] [cursor=pointer]:
              - text: 🐔 Poultry
              - generic [ref=e111]: "2"
            - button "🦜 Wildlife & Exotic 2" [ref=e112] [cursor=pointer]:
              - text: 🦜 Wildlife & Exotic
              - generic [ref=e113]: "2"
            - button "🐂 Practice Ruminant 2" [ref=e114] [cursor=pointer]:
              - text: 🐂 Practice Ruminant
              - generic [ref=e115]: "2"
            - button "🐄 Clinical App Rumen 2" [ref=e116] [cursor=pointer]:
              - text: 🐄 Clinical App Rumen
              - generic [ref=e117]: "2"
      - generic [ref=e118]:
        - button "📋 PLAYLIST 👁️ Vet Surg Lab II Vet Surg Lab II + III — บทเรียนทบทวน by Dai (@dai.1387)" [ref=e120] [cursor=pointer]:
          - generic [ref=e121]:
            - generic [ref=e122]: 📋
            - generic [ref=e123]: PLAYLIST
          - generic [ref=e124]:
            - generic [ref=e125]: 👁️ Vet Surg Lab II
            - generic [ref=e127]: Vet Surg Lab II + III — บทเรียนทบทวน
            - generic [ref=e128]: by Dai (@dai.1387)
        - button "📋 PLAYLIST 🦴 Vet Surg Lab III Vet Surg Lab II + III — บทเรียนทบทวน by Dai (@dai.1387)" [ref=e130] [cursor=pointer]:
          - generic [ref=e131]:
            - generic [ref=e132]: 📋
            - generic [ref=e133]: PLAYLIST
          - generic [ref=e134]:
            - generic [ref=e135]: 🦴 Vet Surg Lab III
            - generic [ref=e137]: Vet Surg Lab II + III — บทเรียนทบทวน
            - generic [ref=e138]: by Dai (@dai.1387)
        - button "📋 PLAYLIST 🚨 COM III COM III — บทเรียนทบทวน by Dai (@dai.1387)" [ref=e140] [cursor=pointer]:
          - generic [ref=e141]:
            - generic [ref=e142]: 📋
            - generic [ref=e143]: PLAYLIST
          - generic [ref=e144]:
            - generic [ref=e145]: 🚨 COM III
            - generic [ref=e147]: COM III — บทเรียนทบทวน
            - generic [ref=e148]: by Dai (@dai.1387)
        - button "📋 PLAYLIST 🩺 COM IV COM IV — บทเรียนทบทวน by Dai (@dai.1387)" [ref=e150] [cursor=pointer]:
          - generic [ref=e151]:
            - generic [ref=e152]: 📋
            - generic [ref=e153]: PLAYLIST
          - generic [ref=e154]:
            - generic [ref=e155]: 🩺 COM IV
            - generic [ref=e157]: COM IV — บทเรียนทบทวน
            - generic [ref=e158]: by Dai (@dai.1387)
        - button "📋 PLAYLIST 🐕 COM V COM V — บทเรียนทบทวน by Dai (@dai.1387)" [ref=e160] [cursor=pointer]:
          - generic [ref=e161]:
            - generic [ref=e162]: 📋
            - generic [ref=e163]: PLAYLIST
          - generic [ref=e164]:
            - generic [ref=e165]: 🐕 COM V
            - generic [ref=e167]: COM V — บทเรียนทบทวน
            - generic [ref=e168]: by Dai (@dai.1387)
        - button "📋 PLAYLIST 🐾 Repro Lecture Comp Ani Repro Lecture — บทเรียนทบทวน Lect 1-24 by Dai (@dai.1387)" [ref=e170] [cursor=pointer]:
          - generic [ref=e171]:
            - generic [ref=e172]: 📋
            - generic [ref=e173]: PLAYLIST
          - generic [ref=e174]:
            - generic [ref=e175]: 🐾 Repro Lecture
            - generic [ref=e177]: Comp Ani Repro Lecture — บทเรียนทบทวน Lect 1-24
            - generic [ref=e178]: by Dai (@dai.1387)
        - button "📋 PLAYLIST 🦜 Wildlife & Exotic Wildlife & Exotic — บทเรียนทบทวน by Dai (@dai.1387)" [ref=e180] [cursor=pointer]:
          - generic [ref=e181]:
            - generic [ref=e182]: 📋
            - generic [ref=e183]: PLAYLIST
          - generic [ref=e184]:
            - generic [ref=e185]: 🦜 Wildlife & Exotic
            - generic [ref=e187]: Wildlife & Exotic — บทเรียนทบทวน
            - generic [ref=e188]: by Dai (@dai.1387)
        - button "📋 PLAYLIST 🐂 Practice Ruminant Practice Ruminant — บทเรียนทบทวน by Dai (@dai.1387)" [ref=e190] [cursor=pointer]:
          - generic [ref=e191]:
            - generic [ref=e192]: 📋
            - generic [ref=e193]: PLAYLIST
          - generic [ref=e194]:
            - generic [ref=e195]: 🐂 Practice Ruminant
            - generic [ref=e197]: Practice Ruminant — บทเรียนทบทวน
            - generic [ref=e198]: by Dai (@dai.1387)
        - button "📋 PLAYLIST 🐄 Clinical App Rumen Clinical App Ruminant — บทเรียนทบทวน by Dai (@dai.1387)" [ref=e200] [cursor=pointer]:
          - generic [ref=e201]:
            - generic [ref=e202]: 📋
            - generic [ref=e203]: PLAYLIST
          - generic [ref=e204]:
            - generic [ref=e205]: 🐄 Clinical App Rumen
            - generic [ref=e207]: Clinical App Ruminant — บทเรียนทบทวน
            - generic [ref=e208]: by Dai (@dai.1387)
        - button "📋 PLAYLIST 🐔 Poultry Poultry Health — บทเรียนทบทวน by Dai (@dai.1387)" [ref=e210] [cursor=pointer]:
          - generic [ref=e211]:
            - generic [ref=e212]: 📋
            - generic [ref=e213]: PLAYLIST
          - generic [ref=e214]:
            - generic [ref=e215]: 🐔 Poultry
            - generic [ref=e217]: Poultry Health — บทเรียนทบทวน
            - generic [ref=e218]: by Dai (@dai.1387)
        - button "📋 PLAYLIST 🐕 อายุรศาสตร์สัตว์เล็ก I COM I — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e220] [cursor=pointer]:
          - generic [ref=e221]:
            - generic [ref=e222]: 📋
            - generic [ref=e223]: PLAYLIST
          - generic [ref=e224]:
            - generic [ref=e225]: 🐕 อายุรศาสตร์สัตว์เล็ก I
            - generic [ref=e227]: COM I — DekDokVet85
            - generic [ref=e228]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🐩 อายุรศาสตร์สัตว์เล็ก II COM II — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e230] [cursor=pointer]:
          - generic [ref=e231]:
            - generic [ref=e232]: 📋
            - generic [ref=e233]: PLAYLIST
          - generic [ref=e234]:
            - generic [ref=e235]: 🐩 อายุรศาสตร์สัตว์เล็ก II
            - generic [ref=e237]: COM II — DekDokVet85
            - generic [ref=e238]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🔪 ปฏิบัติศัลยศาสตร์ I Vet Surg Lab I — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e240] [cursor=pointer]:
          - generic [ref=e241]:
            - generic [ref=e242]: 📋
            - generic [ref=e243]: PLAYLIST
          - generic [ref=e244]:
            - generic [ref=e245]: 🔪 ปฏิบัติศัลยศาสตร์ I
            - generic [ref=e247]: Vet Surg Lab I — DekDokVet85
            - generic [ref=e248]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🐖 สุขศาสตร์ฝูงสุกร Swine Herd Health — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e250] [cursor=pointer]:
          - generic [ref=e251]:
            - generic [ref=e252]: 📋
            - generic [ref=e253]: PLAYLIST
          - generic [ref=e254]:
            - generic [ref=e255]: 🐖 สุขศาสตร์ฝูงสุกร
            - generic [ref=e257]: Swine Herd Health — DekDokVet85
            - generic [ref=e258]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🐷 การสืบพันธุ์ในสุกร Swine Reproduction — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e260] [cursor=pointer]:
          - generic [ref=e261]:
            - generic [ref=e262]: 📋
            - generic [ref=e263]: PLAYLIST
          - generic [ref=e264]:
            - generic [ref=e265]: 🐷 การสืบพันธุ์ในสุกร
            - generic [ref=e267]: Swine Reproduction — DekDokVet85
            - generic [ref=e268]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🩻 การถ่ายภาพทางสัตวแพทย์ Veterinary Imaging — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e270] [cursor=pointer]:
          - generic [ref=e271]:
            - generic [ref=e272]: 📋
            - generic [ref=e273]: PLAYLIST
          - generic [ref=e274]:
            - generic [ref=e275]: 🩻 การถ่ายภาพทางสัตวแพทย์
            - generic [ref=e277]: Veterinary Imaging — DekDokVet85
            - generic [ref=e278]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🥩 ความปลอดภัยอาหาร Food Safety — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e280] [cursor=pointer]:
          - generic [ref=e281]:
            - generic [ref=e282]: 📋
            - generic [ref=e283]: PLAYLIST
          - generic [ref=e284]:
            - generic [ref=e285]: 🥩 ความปลอดภัยอาหาร
            - generic [ref=e287]: Food Safety — DekDokVet85
            - generic [ref=e288]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST ⚖️ กฎหมาย จริยธรรม + สวัสดิภาพสัตว์ Vet Jurisprudent + Ethics + Welfare — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e290] [cursor=pointer]:
          - generic [ref=e291]:
            - generic [ref=e292]: 📋
            - generic [ref=e293]: PLAYLIST
          - generic [ref=e294]:
            - generic [ref=e295]: ⚖️ กฎหมาย จริยธรรม + สวัสดิภาพสัตว์
            - generic [ref=e297]: Vet Jurisprudent + Ethics + Welfare — DekDokVet85
            - generic [ref=e298]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🐂 สุขศาสตร์ฝูงโค-กระบือ Herd Health Ruminant — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e300] [cursor=pointer]:
          - generic [ref=e301]:
            - generic [ref=e302]: 📋
            - generic [ref=e303]: PLAYLIST
          - generic [ref=e304]:
            - generic [ref=e305]: 🐂 สุขศาสตร์ฝูงโค-กระบือ
            - generic [ref=e307]: Herd Health Ruminant — DekDokVet85
            - generic [ref=e308]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🚨 COM III Dog-Cat III — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e310] [cursor=pointer]:
          - generic [ref=e311]:
            - generic [ref=e312]: 📋
            - generic [ref=e313]: PLAYLIST
          - generic [ref=e314]:
            - generic [ref=e315]: 🚨 COM III
            - generic [ref=e317]: Dog-Cat III — DekDokVet85
            - generic [ref=e318]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🩺 COM IV Dog-Cat IV — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e320] [cursor=pointer]:
          - generic [ref=e321]:
            - generic [ref=e322]: 📋
            - generic [ref=e323]: PLAYLIST
          - generic [ref=e324]:
            - generic [ref=e325]: 🩺 COM IV
            - generic [ref=e327]: Dog-Cat IV — DekDokVet85
            - generic [ref=e328]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🐕 COM V Dog-Cat V — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e330] [cursor=pointer]:
          - generic [ref=e331]:
            - generic [ref=e332]: 📋
            - generic [ref=e333]: PLAYLIST
          - generic [ref=e334]:
            - generic [ref=e335]: 🐕 COM V
            - generic [ref=e337]: Dog-Cat V — DekDokVet85
            - generic [ref=e338]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🐄 Clinical App Rumen Clinical App Ruminant — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e340] [cursor=pointer]:
          - generic [ref=e341]:
            - generic [ref=e342]: 📋
            - generic [ref=e343]: PLAYLIST
          - generic [ref=e344]:
            - generic [ref=e345]: 🐄 Clinical App Rumen
            - generic [ref=e347]: Clinical App Ruminant — DekDokVet85
            - generic [ref=e348]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🐂 Practice Ruminant Practice Ruminant (นครปฐม) — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e350] [cursor=pointer]:
          - generic [ref=e351]:
            - generic [ref=e352]: 📋
            - generic [ref=e353]: PLAYLIST
          - generic [ref=e354]:
            - generic [ref=e355]: 🐂 Practice Ruminant
            - generic [ref=e357]: Practice Ruminant (นครปฐม) — DekDokVet85
            - generic [ref=e358]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🐔 Poultry Poultry Health — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e360] [cursor=pointer]:
          - generic [ref=e361]:
            - generic [ref=e362]: 📋
            - generic [ref=e363]: PLAYLIST
          - generic [ref=e364]:
            - generic [ref=e365]: 🐔 Poultry
            - generic [ref=e367]: Poultry Health — DekDokVet85
            - generic [ref=e368]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🦜 Wildlife & Exotic Wildlife & Exotic Health — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e370] [cursor=pointer]:
          - generic [ref=e371]:
            - generic [ref=e372]: 📋
            - generic [ref=e373]: PLAYLIST
          - generic [ref=e374]:
            - generic [ref=e375]: 🦜 Wildlife & Exotic
            - generic [ref=e377]: Wildlife & Exotic Health — DekDokVet85
            - generic [ref=e378]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🐾 Repro Lecture Comp Animal Reproduction — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e380] [cursor=pointer]:
          - generic [ref=e381]:
            - generic [ref=e382]: 📋
            - generic [ref=e383]: PLAYLIST
          - generic [ref=e384]:
            - generic [ref=e385]: 🐾 Repro Lecture
            - generic [ref=e387]: Comp Animal Reproduction — DekDokVet85
            - generic [ref=e388]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 👁️ Vet Surg Lab II Surgery Lab II — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e390] [cursor=pointer]:
          - generic [ref=e391]:
            - generic [ref=e392]: 📋
            - generic [ref=e393]: PLAYLIST
          - generic [ref=e394]:
            - generic [ref=e395]: 👁️ Vet Surg Lab II
            - generic [ref=e397]: Surgery Lab II — DekDokVet85
            - generic [ref=e398]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🦴 Vet Surg Lab III Surgery Lab III — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e400] [cursor=pointer]:
          - generic [ref=e401]:
            - generic [ref=e402]: 📋
            - generic [ref=e403]: PLAYLIST
          - generic [ref=e404]:
            - generic [ref=e405]: 🦴 Vet Surg Lab III
            - generic [ref=e407]: Surgery Lab III — DekDokVet85
            - generic [ref=e408]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 📊 ระบาดวิทยา Veterinary Epidemiology — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e410] [cursor=pointer]:
          - generic [ref=e411]:
            - generic [ref=e412]: 📋
            - generic [ref=e413]: PLAYLIST
          - generic [ref=e414]:
            - generic [ref=e415]: 📊 ระบาดวิทยา
            - generic [ref=e417]: Veterinary Epidemiology — DekDokVet85
            - generic [ref=e418]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🐟 คลินิกสัตว์น้ำ Aquatic Medicine — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e420] [cursor=pointer]:
          - generic [ref=e421]:
            - generic [ref=e422]: 📋
            - generic [ref=e423]: PLAYLIST
          - generic [ref=e424]:
            - generic [ref=e425]: 🐟 คลินิกสัตว์น้ำ
            - generic [ref=e427]: Aquatic Medicine — DekDokVet85
            - generic [ref=e428]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🦅 อายุรศาสตร์สัตว์ปีก Avian Medicine — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e430] [cursor=pointer]:
          - generic [ref=e431]:
            - generic [ref=e432]: 📋
            - generic [ref=e433]: PLAYLIST
          - generic [ref=e434]:
            - generic [ref=e435]: 🦅 อายุรศาสตร์สัตว์ปีก
            - generic [ref=e437]: Avian Medicine — DekDokVet85
            - generic [ref=e438]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🩺 POA, การแก้ปัญหาคลินิกสัตว์เล็ก POA — Clinical Problem Solving (Companion) — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e440] [cursor=pointer]:
          - generic [ref=e441]:
            - generic [ref=e442]: 📋
            - generic [ref=e443]: PLAYLIST
          - generic [ref=e444]:
            - generic [ref=e445]: 🩺 POA, การแก้ปัญหาคลินิกสัตว์เล็ก
            - generic [ref=e447]: POA — Clinical Problem Solving (Companion) — DekDokVet85
            - generic [ref=e448]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🥩 สุขศาสตร์น้ำนม + เนื้อ Milk Hygiene & Meat — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e450] [cursor=pointer]:
          - generic [ref=e451]:
            - generic [ref=e452]: 📋
            - generic [ref=e453]: PLAYLIST
          - generic [ref=e454]:
            - generic [ref=e455]: 🥩 สุขศาสตร์น้ำนม + เนื้อ
            - generic [ref=e457]: Milk Hygiene & Meat — DekDokVet85
            - generic [ref=e458]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🌐 One Health One Health — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e460] [cursor=pointer]:
          - generic [ref=e461]:
            - generic [ref=e462]: 📋
            - generic [ref=e463]: PLAYLIST
          - generic [ref=e464]:
            - generic [ref=e465]: 🌐 One Health
            - generic [ref=e467]: One Health — DekDokVet85
            - generic [ref=e468]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🏭 อุตสาหกรรมอาหาร (FIQC) Food Industry — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e470] [cursor=pointer]:
          - generic [ref=e471]:
            - generic [ref=e472]: 📋
            - generic [ref=e473]: PLAYLIST
          - generic [ref=e474]:
            - generic [ref=e475]: 🏭 อุตสาหกรรมอาหาร (FIQC)
            - generic [ref=e477]: Food Industry — DekDokVet85
            - generic [ref=e478]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🐎 เวชปฏิบัติม้า + ศัลย์ Equine Medicine + Surgery — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e480] [cursor=pointer]:
          - generic [ref=e481]:
            - generic [ref=e482]: 📋
            - generic [ref=e483]: PLAYLIST
          - generic [ref=e484]:
            - generic [ref=e485]: 🐎 เวชปฏิบัติม้า + ศัลย์
            - generic [ref=e487]: Equine Medicine + Surgery — DekDokVet85
            - generic [ref=e488]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🐴 การสืบพันธุ์ในม้า Equine Reproduction — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e490] [cursor=pointer]:
          - generic [ref=e491]:
            - generic [ref=e492]: 📋
            - generic [ref=e493]: PLAYLIST
          - generic [ref=e494]:
            - generic [ref=e495]: 🐴 การสืบพันธุ์ในม้า
            - generic [ref=e497]: Equine Reproduction — DekDokVet85
            - generic [ref=e498]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🥩 สุขศาสตร์น้ำนม + เนื้อ Milk Hygiene — VET86 (รุ่นปัจจุบัน) by WW (VET86)" [ref=e500] [cursor=pointer]:
          - generic [ref=e501]:
            - generic [ref=e502]: 📋
            - generic [ref=e503]: PLAYLIST
          - generic [ref=e504]:
            - generic [ref=e505]: 🥩 สุขศาสตร์น้ำนม + เนื้อ
            - generic [ref=e507]: Milk Hygiene — VET86 (รุ่นปัจจุบัน)
            - generic [ref=e508]: by WW (VET86)
        - button "📋 PLAYLIST 🦅 อายุรศาสตร์สัตว์ปีก Avian Medicine — VET86 (รุ่นปัจจุบัน) by WW (VET86)" [ref=e510] [cursor=pointer]:
          - generic [ref=e511]:
            - generic [ref=e512]: 📋
            - generic [ref=e513]: PLAYLIST
          - generic [ref=e514]:
            - generic [ref=e515]: 🦅 อายุรศาสตร์สัตว์ปีก
            - generic [ref=e517]: Avian Medicine — VET86 (รุ่นปัจจุบัน)
            - generic [ref=e518]: by WW (VET86)
        - button "📋 PLAYLIST 🌐 One Health One Health — VET86 (รุ่นปัจจุบัน) by WW (VET86)" [ref=e520] [cursor=pointer]:
          - generic [ref=e521]:
            - generic [ref=e522]: 📋
            - generic [ref=e523]: PLAYLIST
          - generic [ref=e524]:
            - generic [ref=e525]: 🌐 One Health
            - generic [ref=e527]: One Health — VET86 (รุ่นปัจจุบัน)
            - generic [ref=e528]: by WW (VET86)
        - button "📋 PLAYLIST 🐟 คลินิกสัตว์น้ำ Aquatic Animal Medicine — VET86 (รุ่นปัจจุบัน) by WW (VET86)" [ref=e530] [cursor=pointer]:
          - generic [ref=e531]:
            - generic [ref=e532]: 📋
            - generic [ref=e533]: PLAYLIST
          - generic [ref=e534]:
            - generic [ref=e535]: 🐟 คลินิกสัตว์น้ำ
            - generic [ref=e537]: Aquatic Animal Medicine — VET86 (รุ่นปัจจุบัน)
            - generic [ref=e538]: by WW (VET86)
        - button "📋 PLAYLIST 🏭 อุตสาหกรรมอาหาร (FIQC) Food Industry — VET86 (รุ่นปัจจุบัน) by WW (VET86)" [ref=e540] [cursor=pointer]:
          - generic [ref=e541]:
            - generic [ref=e542]: 📋
            - generic [ref=e543]: PLAYLIST
          - generic [ref=e544]:
            - generic [ref=e545]: 🏭 อุตสาหกรรมอาหาร (FIQC)
            - generic [ref=e547]: Food Industry — VET86 (รุ่นปัจจุบัน)
            - generic [ref=e548]: by WW (VET86)
        - button "📋 PLAYLIST 🦠 โรคติดต่อระหว่างสัตว์-คน Zoonoses — VET86 (รุ่นปัจจุบัน) by WW (VET86)" [ref=e550] [cursor=pointer]:
          - generic [ref=e551]:
            - generic [ref=e552]: 📋
            - generic [ref=e553]: PLAYLIST
          - generic [ref=e554]:
            - generic [ref=e555]: 🦠 โรคติดต่อระหว่างสัตว์-คน
            - generic [ref=e557]: Zoonoses — VET86 (รุ่นปัจจุบัน)
            - generic [ref=e558]: by WW (VET86)
        - button "📋 PLAYLIST 🐖 อายุรศาสตร์สุกร Swine Medicine — VET86 (รุ่นปัจจุบัน) by WW (VET86)" [ref=e560] [cursor=pointer]:
          - generic [ref=e561]:
            - generic [ref=e562]: 📋
            - generic [ref=e563]: PLAYLIST
          - generic [ref=e564]:
            - generic [ref=e565]: 🐖 อายุรศาสตร์สุกร
            - generic [ref=e567]: Swine Medicine — VET86 (รุ่นปัจจุบัน)
            - generic [ref=e568]: by WW (VET86)
        - button "📋 PLAYLIST 🐎 เวชปฏิบัติม้า + ศัลย์ Equine Medicine and Surgery — VET86 (รุ่นปัจจุบัน) by WW (VET86)" [ref=e570] [cursor=pointer]:
          - generic [ref=e571]:
            - generic [ref=e572]: 📋
            - generic [ref=e573]: PLAYLIST
          - generic [ref=e574]:
            - generic [ref=e575]: 🐎 เวชปฏิบัติม้า + ศัลย์
            - generic [ref=e577]: Equine Medicine and Surgery — VET86 (รุ่นปัจจุบัน)
            - generic [ref=e578]: by WW (VET86)
        - button "📋 PLAYLIST 📊 ระบาดวิทยา Epidemiology — VET86 (รุ่นปัจจุบัน) by WW (VET86)" [ref=e580] [cursor=pointer]:
          - generic [ref=e581]:
            - generic [ref=e582]: 📋
            - generic [ref=e583]: PLAYLIST
          - generic [ref=e584]:
            - generic [ref=e585]: 📊 ระบาดวิทยา
            - generic [ref=e587]: Epidemiology — VET86 (รุ่นปัจจุบัน)
            - generic [ref=e588]: by WW (VET86)
        - button "📋 PLAYLIST 🐴 การสืบพันธุ์ในม้า Equine Reproduction — VET86 (รุ่นปัจจุบัน) by WW (VET86)" [ref=e590] [cursor=pointer]:
          - generic [ref=e591]:
            - generic [ref=e592]: 📋
            - generic [ref=e593]: PLAYLIST
          - generic [ref=e594]:
            - generic [ref=e595]: 🐴 การสืบพันธุ์ในม้า
            - generic [ref=e597]: Equine Reproduction — VET86 (รุ่นปัจจุบัน)
            - generic [ref=e598]: by WW (VET86)
        - button "📋 PLAYLIST 🦠 โรคติดต่อระหว่างสัตว์-คน Zoonoses — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e600] [cursor=pointer]:
          - generic [ref=e601]:
            - generic [ref=e602]: 📋
            - generic [ref=e603]: PLAYLIST
          - generic [ref=e604]:
            - generic [ref=e605]: 🦠 โรคติดต่อระหว่างสัตว์-คน
            - generic [ref=e607]: Zoonoses — DekDokVet85
            - generic [ref=e608]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🐖 อายุรศาสตร์สุกร Swine Medicine — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e610] [cursor=pointer]:
          - generic [ref=e611]:
            - generic [ref=e612]: 📋
            - generic [ref=e613]: PLAYLIST
          - generic [ref=e614]:
            - generic [ref=e615]: 🐖 อายุรศาสตร์สุกร
            - generic [ref=e617]: Swine Medicine — DekDokVet85
            - generic [ref=e618]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🔬 Recent Advances in Vet Biosciences Recent Advance in Bioscience — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e620] [cursor=pointer]:
          - generic [ref=e621]:
            - generic [ref=e622]: 📋
            - generic [ref=e623]: PLAYLIST
          - generic [ref=e624]:
            - generic [ref=e625]: 🔬 Recent Advances in Vet Biosciences
            - generic [ref=e627]: Recent Advance in Bioscience — DekDokVet85
            - generic [ref=e628]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🎓 ปฐมนิเทศคลินิก ปฐมนิเทศคลินิก Year 5 — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e630] [cursor=pointer]:
          - generic [ref=e631]:
            - generic [ref=e632]: 📋
            - generic [ref=e633]: PLAYLIST
          - generic [ref=e634]:
            - generic [ref=e635]: 🎓 ปฐมนิเทศคลินิก
            - generic [ref=e637]: ปฐมนิเทศคลินิก Year 5 — DekDokVet85
            - generic [ref=e638]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🎓 ปฐมนิเทศคลินิก ปฐมนิเทศ Year 6 — DekDokVet85 by DekDokVet85 (Vet 85)" [ref=e640] [cursor=pointer]:
          - generic [ref=e641]:
            - generic [ref=e642]: 📋
            - generic [ref=e643]: PLAYLIST
          - generic [ref=e644]:
            - generic [ref=e645]: 🎓 ปฐมนิเทศคลินิก
            - generic [ref=e647]: ปฐมนิเทศ Year 6 — DekDokVet85
            - generic [ref=e648]: by DekDokVet85 (Vet 85)
        - button "📋 PLAYLIST 🐩 อายุรศาสตร์สัตว์เล็ก II COM II — บันทึกโดยนิสิต (Vet 86) by Dai (@dai.1387)" [ref=e650] [cursor=pointer]:
          - generic [ref=e651]:
            - generic [ref=e652]: 📋
            - generic [ref=e653]: PLAYLIST
          - generic [ref=e654]:
            - generic [ref=e655]: 🐩 อายุรศาสตร์สัตว์เล็ก II
            - generic [ref=e657]: COM II — บันทึกโดยนิสิต (Vet 86)
            - generic [ref=e658]: by Dai (@dai.1387)
        - button "📋 PLAYLIST 👁️ Vet Surg Lab II Surgery Lab — บันทึกโดยนิสิต (Vet 86) by Dai (@dai.1387)" [ref=e660] [cursor=pointer]:
          - generic [ref=e661]:
            - generic [ref=e662]: 📋
            - generic [ref=e663]: PLAYLIST
          - generic [ref=e664]:
            - generic [ref=e665]: 👁️ Vet Surg Lab II
            - generic [ref=e667]: Surgery Lab — บันทึกโดยนิสิต (Vet 86)
            - generic [ref=e668]: by Dai (@dai.1387)
      - generic [ref=e669]:
        - text: ⚠️
        - strong [ref=e670]: "หมายเหตุ:"
        - text: คลิปเหล่านี้เป็นของเจ้าของช่องบน YouTube ต้นฉบับ ไม่ใช่ผลงานของ VetMockคลิปที่เพิ่มเองและประวัติการดูเก็บไว้ในเบราว์เซอร์เครื่องนี้เท่านั้น
      - button "← หน้าแรก" [ref=e672] [cursor=pointer]
    - navigation "เมนูหลัก" [ref=e673]:
      - button "หน้าแรก" [ref=e674] [cursor=pointer]
      - button "ฝึก" [ref=e679] [cursor=pointer]
      - button "สอบ" [ref=e685] [cursor=pointer]
      - button "คืบหน้า" [ref=e691] [cursor=pointer]
      - button "VetWiki" [ref=e696] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect } from './fixtures.js';
  2   | test.use({ serviceWorkers: 'block' });
  3   | 
  4   | // The summary used to leave the app as a .md file, which assumes the reader
  5   | // owns a markdown editor. It now prints as a PDF, which every student already
  6   | // knows how to save. The browser is the writer on purpose: it is the only
  7   | // engine in this app that shapes Thai vowels and tone marks correctly.
  8   | //
  9   | // What can break, and what each expectation below pins:
  10  | //
  11  | //   • The printed copy is mounted only while a print is running, because these
  12  | //     summaries pass 60,000 characters and a permanent second copy in the DOM
  13  | //     is a cost almost no reader would ever use. If someone makes it permanent
  14  | //     again, the first and last assertions fail.
  15  | //   • window.print() must not fire before React has committed that copy, or
  16  | //     the dialog snapshots a page with nothing on it.
  17  | //   • The print skin has to come off afterwards. Leaving data-vmx-printing on
  18  | //     <html> would leave the whole app hidden behind print-only CSS.
  19  | //
  20  | // The playlist listing is stubbed because /api/playlist is a serverless
  21  | // function; everything downstream of it here is the real application.
  22  | 
  23  | const CLIP = 'hPV3Rhh8r3Q';
  24  | const PLAYLIST = {
  25  |   count: 2,
  26  |   items: [
  27  |     { id: CLIP, videoId: CLIP, title: '5.Milk microbiology + Milk borne pathogens and diseases 9 Sep 69', duration: '129:00' },
  28  |     { id: 'cHediceYO_Y', videoId: 'cHediceYO_Y', title: '2.Milk Introduction + Mastitis & Milk quality 19 Aug 69', duration: '130:00' },
  29  |   ],
  30  | };
  31  | 
  32  | // ── No third-party video in this spec ───────────────────────────────────
  33  | // Picking a clip mounts the YouTube player, and nothing here is about the
  34  | // player. On Firefox and WebKit, which run headful on software GL in CI, the
  35  | // embed and its API are heavy enough to compete with the summary for the
  36  | // main thread, and a slow youtube.com is a failure nobody here can fix. The
  37  | // same block is in video-navigation.spec.js and video-shelf-requests.spec.js;
  38  | // the latter records that the player dialog still opens and renders its
  39  | // chrome with youtube.com blocked. The summary button reads only the clip's
  40  | // metadata, never the player.
  41  | test.beforeEach(async ({ page }) => {
  42  |   await page.route(/https:\/\/(?:[^/]+\.)?(?:youtube\.com|ytimg\.com)\//, (route) => route.abort());
  43  | });
  44  | 
  45  | // STAB-09: this family failed on Firefox and WebKit in 8 of 19 local gates,
  46  | // some of them quiet, and the wait was never measured. Every step is timed
  47  | // and the clip's own summary chunk is awaited by name, so a red run says
  48  | // which step was slow instead of "waiting for locator" after 30 s. The
  49  | // numbers are attached to the test as a "timing" annotation.
  50  | async function openASummary(page) {
  51  |   const steps = {};
  52  |   let t = Date.now();
  53  |   const lap = (name) => { steps[name] = Date.now() - t; t = Date.now(); };
  54  | 
  55  |   await page.route('**/api/playlist**', route => route.fulfill({
  56  |     status: 200, contentType: 'application/json', body: JSON.stringify(PLAYLIST),
  57  |   }));
  58  |   await page.goto('/app/videos');
  59  |   const playlist = page.getByRole('button', { name: /VET86/ }).filter({ hasText: /Milk|น้ำนม/ }).first();
  60  |   await playlist.click();
  61  |   lap('shelf');
  62  |   const clip = page.getByText('Milk microbiology', { exact: false }).first();
> 63  |   await clip.click();
      |              ^ Error: locator.click: Test timeout of 30000ms exceeded.
  64  |   lap('clipList');
  65  |   const open = page.getByRole('button', { name: /อ่านสรุปคลิป/ });
  66  |   await expect(open).toBeVisible({ timeout: 30000 });
  67  |   lap('summaryButton');
  68  | 
  69  |   // The modal cannot appear before this clip's summary module arrives, so
  70  |   // wait for that response explicitly, then for the modal. The page records
  71  |   // its own click and modal times, so the split is measured in the browser.
  72  |   await page.evaluate(() => {
  73  |     window.__summaryTiming = {};
  74  |     document.addEventListener('click', (e) => {
  75  |       if (/อ่านสรุปคลิป/.test(e.target?.closest?.('button')?.textContent || '')) {
  76  |         window.__summaryTiming.click = performance.now();
  77  |       }
  78  |     }, { capture: true });
  79  |     const seen = new MutationObserver(() => {
  80  |       if (document.querySelector('.vmx-summary-modal')) {
  81  |         window.__summaryTiming.modal = performance.now();
  82  |         seen.disconnect();
  83  |       }
  84  |     });
  85  |     seen.observe(document.body, { childList: true, subtree: true });
  86  |   });
  87  |   const chunk = page.waitForResponse(
  88  |     (r) => r.url().includes(CLIP) && /\.js(?:\?|$)/.test(r.url()),
  89  |     { timeout: 30000 },
  90  |   );
  91  |   await open.click();
  92  |   expect((await chunk).ok(), `the ${CLIP} summary module did not load`).toBe(true);
  93  |   lap('summaryModule');
  94  |   await expect(page.locator('.vmx-summary-modal')).toBeVisible({ timeout: 30000 });
  95  |   lap('modal');
  96  | 
  97  |   const inPage = await page.evaluate((clipId) => {
  98  |     const t = window.__summaryTiming || {};
  99  |     const entry = performance.getEntriesByType('resource').find((e) => e.name.includes(clipId) && /\.js(?:\?|$)/.test(e.name));
  100 |     return {
  101 |       clickToModalMs: t.click && t.modal ? Math.round(t.modal - t.click) : null,
  102 |       moduleFetchMs: entry ? Math.round(entry.responseEnd - entry.startTime) : null,
  103 |       moduleToModalMs: entry && t.modal ? Math.round(t.modal - entry.responseEnd) : null,
  104 |       moduleBytes: entry ? entry.transferSize || entry.encodedBodySize || null : null,
  105 |     };
  106 |   }, CLIP);
  107 |   const info = test.info();
  108 |   const timing = JSON.stringify({ project: info.project.name, steps, ...inPage });
  109 |   info.annotations.push({ type: 'timing', description: timing });
  110 |   console.log(`[summary-timing] ${timing}`);
  111 | }
  112 | 
  113 | test('a summary prints as a PDF, and the app is put back afterwards', async ({ page }) => {
  114 |   await openASummary(page);
  115 | 
  116 |   // Nothing extra in the DOM until a print is asked for.
  117 |   await expect(page.locator('.vmx-print-doc')).toHaveCount(0);
  118 | 
  119 |   // Stand in for the native dialog and record what it would have seen.
  120 |   await page.evaluate(() => {
  121 |     window.__printSaw = null;
  122 |     window.print = () => {
  123 |       window.__printSaw = {
  124 |         attr: document.documentElement.getAttribute('data-vmx-printing'),
  125 |         title: document.querySelector('.vmx-print-title')?.textContent || '',
  126 |         bodyChars: document.querySelector('.vmx-print-body')?.textContent?.length || 0,
  127 |         appHidden: !!document.querySelector('.vmx-print-doc'),
  128 |       };
  129 |       setTimeout(() => window.dispatchEvent(new Event('afterprint')), 20);
  130 |     };
  131 |   });
  132 | 
  133 |   await page.getByRole('button', { name: /บันทึกเป็น PDF/ }).click();
  134 | 
  135 |   await expect.poll(() => page.evaluate(() => window.__printSaw), { timeout: 15000 })
  136 |     .not.toBeNull();
  137 |   const saw = await page.evaluate(() => window.__printSaw);
  138 | 
  139 |   // The dialog saw a finished document, not an empty page.
  140 |   expect(saw.attr).toBe('summary');
  141 |   expect(saw.title.length).toBeGreaterThan(10);
  142 |   expect(saw.bodyChars).toBeGreaterThan(2000);
  143 | 
  144 |   // And the app is itself again.
  145 |   await expect.poll(() => page.evaluate(
  146 |     () => document.documentElement.getAttribute('data-vmx-printing')), { timeout: 15000 }).toBeNull();
  147 |   await expect(page.locator('.vmx-print-doc')).toHaveCount(0);
  148 | });
  149 | 
  150 | test('the printed sheet hides the app and sets Thai type on white', async ({ page }) => {
  151 |   await openASummary(page);
  152 |   await page.evaluate(() => { window.print = () => {}; });
  153 |   await page.getByRole('button', { name: /บันทึกเป็น PDF/ }).click();
  154 |   await expect(page.locator('.vmx-print-doc')).toHaveCount(1, { timeout: 15000 });
  155 | 
  156 |   await page.emulateMedia({ media: 'print' });
  157 |   const printed = await page.evaluate(() => {
  158 |     const doc = document.querySelector('.vmx-print-doc');
  159 |     const body = document.querySelector('.vmx-print-body');
  160 |     const app = document.querySelector('.vmx-app');
  161 |     return {
  162 |       // Paint, not declared display. The first version of this test asked
  163 |       // getComputedStyle(doc).display and got "block" while the page printed
```