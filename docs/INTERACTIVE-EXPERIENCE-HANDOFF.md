# VetMock — Interactive Experience Handoff

วันที่: 2026-09-18 · สถานะ: แผนงานพร้อมส่งต่อ ยังไม่ได้ implement

## คำสั่งตั้งต้นสำหรับผู้รับงาน

**สถานะส่งต่อสุดท้าย 2026-09-18:** งานเตรียม asset/motion เสร็จใน `design/interactive-assets-v1/START-HERE.md` พร้อม `INTEGRATION.md`, ภาพต้นฉบับ 12 ชิ้น, ภาพนิ่ง rest/open 24 ไฟล์, gallery และผลตรวจ 156 ท่า. ZIP แบบเปิดดูแยกจาก repo อยู่ที่ `work/interactive-delivery-20260918/vetmock-interactive-ready.zip` พร้อม hashes. Checkbox IX ด้านล่างยังเป็นงาน implementation ในแอป ไม่ใช่รายการ asset ที่ขาด.

อ่าน `AGENTS.md`, `STABILITY.md` และเอกสารนี้ก่อนทำงาน ตรวจ source/working tree ปัจจุบันอีกครั้ง แล้วดำเนินงานตามชุดด้านล่างเมื่อได้รับมอบหมายให้ implement ไม่ต้องสร้างระบบซ้ำกับของเดิม งานนี้เน้นลูกเล่นและประสบการณ์สัมผัสเว็บ ไม่ใช่เพิ่มฟีเจอร์การเรียนทั่วไปหรือ redesign ทั้งแอป

คำขอล่าสุดของผู้ใช้คือให้จัดรายการส่งต่อ รอบที่เขียนเอกสารนี้จึงทำเฉพาะ handoff ไม่ได้แก้แอป commit push หรือ deploy การส่งเอกสารนี้ไม่ได้เป็นหลักฐานว่า implementation/release ได้เริ่มหรือเสร็จแล้ว ให้ยึดคำสั่งมอบหมายล่าสุดของผู้ใช้สำหรับขอบเขตการลงมือและ release

## ทิศทางผลิตภัณฑ์

**สมุดเรียนสัตวแพทย์ที่มีชีวิต**: เนื้อหาหยิบจับและจัดได้ ภาพเปิดสำรวจได้ พื้นที่ส่วนตัวมีร่องรอยของผู้เรียน และ Mochi มีบุคลิกที่อบอุ่น

เป็นแนวทางประสบการณ์ ไม่ต้องทำ UI เป็นหนังสือจำลองหรือห้อง 3D รักษา warm editorial, ภาษาไทย, cream/sage, dark mode และลำดับความสำคัญของการอ่าน/สอบ

แกนที่เลือก:

1. เนื้อหาที่หยิบจับได้และการนำทางที่ต่อเนื่อง
2. ภาพสัตวแพทย์ที่เปิดสำรวจได้
3. กระดานส่วนตัวและ Mochi ที่ทำให้รู้สึกเป็นพื้นที่ของเรา

เกณฑ์คัดลูกเล่น: ใช้ครั้งที่ 30 แล้วยังช่วยให้ควบคุมง่าย รู้สึกดี หรืออยากกลับมาใช้ ไม่พึ่งความแปลกใหม่ครั้งแรกอย่างเดียว

## สิ่งที่มีแล้ว — ตรวจและต่อยอดก่อนสร้าง

**Asset pack ที่เตรียมเพิ่ม 2026-09-18:** `design/interactive-assets-v1/README.md` พร้อม gallery `index.html`, `contact-sheet.png`, 12 layered SVGs, `manifest.json` และ `verification.json`. ปกกอง 3, ของบนโต๊ะ 4, สติกเกอร์ 3, แฟ้มและการ์ดสรุป 2 ชิ้น ใช้กับ IX-02/04/05/06/07; ยังไม่ integrate เข้าแอป. Mochi/ภาพประจำวิชาใช้ของเดิม; IX-03 ยังต้องใช้ภาพสอนจริงที่ตรวจแล้ว ไม่ใช้ asset ตกแต่งแทนภาพคลินิก.

**Motion revision 2:** หลังผู้ใช้ทักว่าขยับน้อยและดูแปลก ปรับ rig/จุดหมุนจริง เพิ่ม spring ที่กลับทิศกลางทางได้และการลาก/range/keyboard. ใช้ `motion-model.mjs` และ `motion-runtime.js` เป็น reference; CSS offsets รุ่นแรกถูกแทนแล้ว. ตรวจ `motion-frames.png` และ `motion-verification.json` ก่อน integrate โดยเชื่อมกับ preferences/cleanup ของแอปเดิม.

| ฐานเดิม | จุดเริ่มอ่าน |
| --- | --- |
| Motion บน controls จริง: ripple, tilt, bookmark, flip/reveal, celebrations, reading effects, breaks | `docs/motion-kit-real-usage.md`, `src/components/MotionFeedback.jsx`, `src/lib/motion-kit/feedback.js` |
| Auto/quiet/off, companion, loader, celebration และ reading pointer preferences | `src/lib/motion-preferences.js`, `src/components/MotionSettings.jsx` |
| Mochi ตามบริบทและกิจกรรมพัก | `src/lib/mochi-presence.js`, `src/components/Mochi.jsx`, `src/views/MochiView.jsx`, `src/lib/motion-kit/play.js` |
| Pinboard ของข้อสอบ สรุป การ์ด และโน้ต | `src/views/PinboardView.jsx`, `src/lib/pinboard.js` |
| Image lightbox และ modal/focus behavior | `src/components/ZoomableImage.jsx` |
| Atlas explore/compare/recall, Imaging Practical, image occlusion | `src/views/AtlasView.jsx`, `src/views/LabView.jsx`, `src/views/ImageOcclusionView.jsx` |
| บทเรียนพร้อม checkpoint และ screening simulator | `src/views/BenchView.jsx`, `src/components/ScreeningBench.jsx` |
| Navigation และ transitions | `src/App.jsx`, `src/lib/view-route.js` |
| สไตล์และ regression contracts | `docs/DESIGN_SYSTEM.md`, `STABILITY.md`, `tests/e2e/motion-integration.spec.js` |

ไฟล์ข้างต้นเป็นจุดเริ่มอ่าน ไม่ใช่คำสั่งให้แก้ทุกไฟล์ ตรวจ implementation จริงมากกว่าคอมเมนต์เก่าหรือบันทึก release

## ลำดับงานและ dependencies

- ชุด A: IX-00 → IX-01 + IX-02: ทำฐานสัมผัสและการนำทางให้ต่อเนื่อง
- ชุด B: IX-03: ทำภาพสำรวจ pilot จากสื่อที่พร้อม
- ชุด C: IX-04 → IX-05: ทำกองทบทวนก่อนเพิ่มการจัดวาง/ตกแต่ง
- ชุด D: IX-06: บุคลิก Mochi บน surface เดิม ทำแยกจาก schema ของ Pinboard ได้
- ชุด E: IX-07 → IX-08: จังหวะปิดกิจกรรมและตรวจ journey รวม

ใช้ checkbox เป็นสถานะจริง ทุกงานยังไม่เริ่ม ห้ามติ๊กจาก mockup หรือ component demo อย่างเดียว

### [ ] IX-00 — Baseline และเลือก pilot

**งาน**
- ตรวจ git status/worktrees และอ่าน handoff ล่าสุด รักษางานที่คนอื่นกำลังทำ
- เปิด flow ปัจจุบัน: Home → วิชา → สื่อ → กลับ, บันทึก pin → เปิด Pinboard, ภาพ/lightbox, Mochi/Pomodoro, practice/exam
- เก็บภาพและ accessibility snapshot ที่ desktop, มือถือ 390px และจุดเสี่ยง 320px
- ทำตารางสั้น ๆ ว่า interaction ใดมีแล้ว ใช้จริงตรงไหน และส่วนใดต้องต่อเติม
- เลือกหนึ่งวิชาสำหรับ navigation pilot และสื่อภาพที่มีแหล่งที่มา/สิทธิ์พร้อมสำหรับ IX-03 หากไม่มีคู่ภาพพร้อม ให้เริ่ม hotspot/reveal ที่มีหลักฐาน ห้ามแต่งภาพคลินิกหรือคำอธิบายเพื่อให้ demo ครบ

**ตรวจรับ**: ระบุ pilot, baseline, entry/exit path และช่องว่างจริงได้ ไม่มีฟีเจอร์เดิมถูกนับเป็นงานใหม่

### [ ] IX-01 — การ์ดเปิดต่อเป็นหน้าวิชา

**งาน**
- ทำ transition จากการ์ดวิชาที่เลือกไปยังชื่อ/ภาพประกอบในหน้าปลายทาง รักษาตัวตนของรายการเดิม
- Back กลับรายการเดิม ตำแหน่ง scroll และ focus ที่เหมาะสม
- ใช้ transition seam เดิม ตรวจเหตุผลของ WebKit/reduced-motion fallback ก่อนแก้
- ไม่มี animation ค้างรอ network; ข้อมูลโหลดช้าให้แสดง loading/error ที่ทำงานจริง

**ตรวจรับ**: คลิกเร็วซ้ำ, Back ระหว่างโหลด, โหลดล้มเหลว, keyboard และ motion off ยังนำทางได้ถูกต้อง ไม่เปลี่ยน subject/topic/phase ผิด และไม่หน่วง action เพื่อรอเอฟเฟกต์

### [ ] IX-02 — เก็บการ์ดแล้วเห็นว่าไปอยู่ที่ไหน

**งาน**
- ต่อจาก pin action เดิม: เมื่อบันทึกสำเร็จให้ feedback สั้น ๆ พร้อม action เปิดกอง/กระดาน
- ใช้การ์ดฉบับย่อหรือภาพเคลื่อนเข้าเป้าหมายเฉพาะเมื่อปลายทางอยู่ใน viewport; บนมือถือใช้ feedback ใกล้ปุ่มได้
- Undo ต้องย้อนเฉพาะ mutation ที่เพิ่งทำ ไม่ลบ pin เดิมที่มีอยู่แล้วหรือเขียนทับการแก้จากที่อื่น
- ความล้มเหลว/พื้นที่เต็มต้องคงข้อมูลเดิมและบอกตามจริง

**ตรวจรับ**: pin ใหม่, pin ซ้ำ, write fail, เต็มความจุ, Undo และสลับหน้าไม่ทำให้ข้อมูลหาย เอฟเฟกต์ไม่ยิงจาก cloud pull หรือการเปิดข้อที่ pin ไว้แล้ว

### [ ] IX-03 — ภาพที่สำรวจได้

**งาน**
- ต่อจาก viewer/lightbox เดิม ทำ pilot ขนาดเล็กในหน้าบทเรียนจริง
- รองรับตามชนิดสื่อ: hotspot พร้อมคำอธิบาย, overlay/ชื่อที่เปิดทีละชั้น, magnifier และ slider เปรียบเทียบคู่ภาพ
- คู่ภาพต้องมีบริบท/แนวภาพที่เปรียบเทียบได้ มี caption บอกขอบเขต ไม่ทำให้ภาพต่างเคสดูเหมือน before/after เคสเดียว
- จุด/overlay ต้องผูกกับพิกัดภาพต้นฉบับอย่างถูกต้องเมื่อ resize/zoom
- ไม่เปิดเฉลยภาพระหว่างสอบก่อนเวลาที่ engine อนุญาต

**ตรวจรับ**: ใช้กับภาพจริงที่ตรวจแล้วได้; touch/keyboard มีวิธีเทียบเท่าการ hover/ลาก; zoom ไม่ทำ hotspot เลื่อนผิด; ภาพโหลดพลาดยังอ่าน caption/ที่มาได้; ปิด viewer คืน focus

**ส่งมอบ**: รายชื่อสื่อ pilot, source locator, provenance/permission, ผู้หรือหลักฐานที่ตรวจ label, ข้อจำกัด และเส้นทางเข้าจากบทเรียน ไม่ใช่หน้าสาธิตแยก

### [ ] IX-04 — กองทบทวนส่วนตัว

**งาน**
- เพิ่ม named collections ใน Pinboard เดิม เช่น “สอบวันจันทร์” “สองโรคนี้ยังสับสน”
- เพิ่ม/เปลี่ยนชื่อกอง, ย้ายรายการเข้ากอง, เรียงลำดับ และโน้ตสั้นระดับกอง
- การลบกองต้องระบุขอบเขตชัดเจน ค่าเริ่มต้นให้รายการกลับพื้นที่ไม่จัดกอง ไม่ลบข้อสอบ/การ์ดต้นทาง
- เปิดรายการต้องไปยัง item เดิมโดย exact identity ไม่เปิด pool ทั่วไปแทน
- ก่อนเปลี่ยน storage ให้ตรวจ `src/lib/local-extras.js`, `src/lib/user-data-schema.js`, `src/lib/user-data-sync.js` และขอบเขตบัญชีจริง วาง migration, backup/restore และ merge ให้ครบ ไม่สร้าง localStorage ก้อนใหม่โดยไม่ตรวจระบบเดิม

**ตรวจรับ**: pin เก่ายังอยู่ครบ, duplicate identity ไม่เพิ่มซ้ำ, ย้าย/เปลี่ยนชื่อ/ลบกอง/refresh/สลับบัญชีไม่สูญหาย; offline และ restore มีพฤติกรรมชัดเจน; หาก sync รองรับต้องทดสอบ conflict จริง ไม่ถือว่า last-write-wins ปลอดภัยโดยอัตโนมัติ

### [ ] IX-05 — จัดกองและแต่งรายละเอียดเล็ก ๆ

**ขึ้นกับ**: IX-04

**งาน**
- ลากเรียงภายในกองและย้ายระหว่างกอง มี preview ตำแหน่งก่อนปล่อย
- มีเมนู “ย้ายไปกอง…” และปุ่มเลื่อนลำดับสำหรับ touch/keyboard เสมอ
- เลือกปก/แถบสี/สติกเกอร์จากชุดเล็กที่เข้ากับแบรนด์ ไม่ต้องมี marketplace, upload pipeline หรือระบบเงิน
- ใช้ grid/list ที่ responsive; ไม่ทำ infinite canvas เป็นหน้าหลัก

**ตรวจรับ**: ยกเลิกลากได้, touch scroll ไม่ถูกแย่ง, focus ติดตามรายการหลังย้าย, save fail คืน state อย่างถูกต้อง, สีไม่เป็นตัวระบุเพียงอย่างเดียว, ลำดับคงอยู่หลัง reload

### [ ] IX-06 — Mochi มีนิสัยและมุมพัก

**งาน**
- ใช้ Mochi/assets/actions เดิม สร้างชุดพฤติกรรมเล็ก ๆ ที่มี entry/exit ชัดเจน
- หน้าแรก: แตะทักทายและปฏิกิริยาสั้น ๆ โดยมี cooldown ไม่วนเองตลอด
- หน้าอ่าน: อยู่มุมประจำอย่างสงบ; หน้า exam และพื้นที่เขียน/วัดภาพรักษากฎการหลีกทางเดิม
- หน้าพัก/Pomodoro: ใช้กิจกรรมเดิมก่อน เพิ่มรายละเอียดโต้ตอบกับของบนโต๊ะได้เล็กน้อย
- หากเพิ่มของแต่ง ให้เป็นตัวเลือกสมัครใจ ไม่มีความหิว การลงโทษ streak หรือข้อความกดดันเมื่อหายไป
- เคารพ companion off, quiet/off, reduced motion และการหยุดเมื่อแท็บซ่อน

**ตรวจรับ**: แตะเล่นได้จริงโดยไม่บังปุ่ม/ข้อความ, ไม่มีคะแนนเรียนจากเล่น, ไม่มีเสียง autoplay, motion/pointer failure ไม่ทำให้หน้าใช้ไม่ได้, ปิดฟีเจอร์แล้วงาน animation/listener ถูกคืน

### [ ] IX-07 — จังหวะปิดกิจกรรมที่มีความหมาย

**งาน**
- เพิ่มการ์ดสรุปสั้นหลังจบกิจกรรมบน Results/สรุปเดิม ไม่สร้าง dashboard แข่งขันอีกหน้า
- เริ่มจากข้อมูลที่มีหลักฐานจริงใน session เช่น จำนวนข้อที่ทำ/คำตอบที่ตรวจได้
- ถ้าจะรวมภาพที่สำรวจหรือโน้ตที่เก็บ ต้องมี event ที่น่าเชื่อถือก่อน ห้ามใช้การเปิดหน้าแทน completion
- ข้อความบอกว่าได้ทำอะไร ไม่อ้าง mastery จากการอ่านหรือคำตอบซ้ำ
- แสดง celebration สั้นเฉพาะจังหวะจบจริง มีทางข้าม และไม่เล่นซ้ำจาก sync/reload

**ตรวจรับ**: จำนวนตรงกับ session จริง, incomplete/failed save ไม่แสดงเป็นสำเร็จ, ไม่เพิ่ม reward ซ้ำ, อ่านสรุปได้เมื่อ motion off

### [ ] IX-08 — เชื่อมทุกส่วนและตรวจรับ

**journey หลัก**
1. เข้ากองทบทวนที่จัดไว้ → เปิดเนื้อหาจริง
2. สำรวจภาพ → เก็บรายการ/โน้ตกลับกอง
3. กลับมาแล้วตำแหน่งและบริบทไม่หาย
4. ฝึกและดูผลตาม engine เดิม → เลือกพักกับ Mochi หรือกลับไปอ่าน

**ตรวจรับรวม**
- หน้าแรกชวนสำรวจ หน้าอ่านสงบ หน้าฝึกตอบสนองไว หน้าสอบไม่เผยคำใบ้ก่อนเวลา
- 320px/390px, desktop, dark mode, keyboard, reduced motion และ Chromium/Firefox/WebKit ผ่านตามขอบเขตที่แก้
- ไม่มี overflow, layout shift จากลูกเล่น, focus trap ผิด หรือ hover-only action
- แท็บซ่อน/ออกจากหน้าแล้วหยุดงานเบื้องหลัง; ตรวจ responsiveness และ frame behavior บนอุปกรณ์/การจำลองเดียวกับ baseline ก่อนอ้างว่าดีขึ้น
- พฤติกรรมหลักยังทำงานเมื่อ animation API ใช้ไม่ได้ เน็ตหลุด และ storage เขียนไม่สำเร็จ
- เพิ่ม behavioral tests ตามความเสี่ยง โดยเฉพาะ migration/Undo/focus/reveal gating ไม่เขียนแต่ source-text assertions
- ก่อน commit/release ใช้ gates ตาม `AGENTS.md`: `npm run build`, `npm run test:unit`, `npm run lint:all` และ E2E ที่เกี่ยวข้อง
- ถ้ารอบ implement รวม release ต้องมี exact-SHA GitHub Build + Smoke E2E, Vercel Production สำเร็จ และ live journey จริง ปฏิบัติตาม one-push/cost rules ห้ามอ้างว่า build ผ่านเท่ากับขึ้น production

## กติกาข้ามทุกชุดงาน

- ลูกเล่นต้องไม่เปลี่ยนผลคำตอบ เงื่อนไขสอบ การบันทึก หรือความเป็นเจ้าของข้อมูล
- เอฟเฟกต์สำเร็จต้องตามการสำเร็จจริง ไม่ใช้ animation ปกปิด failure
- ใช้ tokens, preferences และ cleanup scope เดิม ไม่เพิ่ม motion library ใหม่เพื่อเอฟเฟกต์พื้นฐาน
- Content loading แบบ lazy ต่อไป ไม่โหลด 3D/ภาพใหญ่/เสียงในหน้าแรกเพียงเพื่อเตรียมลูกเล่น
- ไม่มี public copy หรือ commit trailer ที่กล่าวถึงเครื่องมือช่วยสร้าง ตามกฎ repo
- หากแบ่งงาน parallel: ภาพและ Mochi แยกได้; Pinboard schema/merge ต้องมีเจ้าของเดียว; App/global CSS เขียนตามลำดับ หลีกเลี่ยงหลายคนแก้ seam เดียวกันพร้อมกัน

## พักไว้นอก scope รอบแรก

- ห้อง 3D เต็มหน้า, infinite canvas, pet economy, ร้านของแต่ง, multiplayer presence
- วงล้อสุ่มกิจกรรม, cursor effects เพิ่ม, confetti ทุกคำตอบ, เสียงเปิดเอง
- เปลี่ยน question/SRS engine, สร้าง clinical workstation, แปลงคลังเนื้อหาทั้งหมดเป็น interactive
- การแชร์สาธารณะหรืออัปโหลดสื่อส่วนตัวใหม่ ซึ่งต้องออกแบบสิทธิ์และข้อมูลแยกก่อน

## สิ่งที่ต้องส่งกลับเมื่อ implement

1. ตาราง IX-00–IX-08: ทำแล้ว/บางส่วน/ยังไม่ทำ พร้อมเหตุผลและไฟล์
2. ภาพหรือวิดีโอสั้นจาก flow จริงบน desktop/mobile พร้อมคำสั่งทดสอบและผลจริง
3. หลักฐานว่าข้อมูลเก่าไม่หาย การบันทึกล้มเหลวไม่หลอกว่าสำเร็จ และ keyboard/quiet mode ใช้งานได้
4. รายการสื่อที่ใช้และข้อจำกัดด้านคำอธิบาย/ที่มา
5. สถานะ local/CI/deploy แยกกัน และ handoff สั้นใน `AGENTS.md`

## หลักฐานและสถานะตอนส่งต่อ

- Source checkpoint: `77eca23c` บน `main` ณ เวลาเตรียมเอกสาร; มีงานค้างของผู้อื่นใน AGENTS/package/video-summary pipeline อย่ารวม commit หรือย้อนงานเหล่านั้น
- รอบสำรวจก่อนหน้าเปิด production Home → วิชาระบาดวิทยา → Module 5 และลองเปลี่ยน preset ของ screening simulator แล้ว ไม่ใช่การทดสอบทุกฟีเจอร์หรือ exact-SHA production proof
- รอบแรกจัดแผนอย่างเดียว; รอบต่อมาผู้ใช้สั่งสร้าง assets และปรับ motion จึงมีแพ็ก preview ที่ตรวจแล้ว พร้อม static fallbacks และคู่มือ integration. ยังไม่มี implementation ใน production app หรือ release tests
- ถ้าหลักฐานปัจจุบันต่างจากเอกสาร ให้ใช้ source และพฤติกรรมที่ตรวจใหม่ พร้อมอัปเดตสถานะ ไม่เริ่มซ่อมตามบันทึกเก่าโดยไม่ตรวจ
