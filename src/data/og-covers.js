// ============================================================
// og-covers.js — the share card for every public destination
// ============================================================
// Every route below ships a 1200x630 cover in public/og/<id>.png plus a
// title and description written for a link preview, not for the page.
//
// Why this file exists: /app/* is a single-page app, so every route served
// the same index.html and therefore the same Open Graph tags — one square
// 512px icon, declared as a large summary card. A link to the video shelf
// and a link to the focus timer previewed identically, and neither filled
// the space that card shape reserves. Crawlers and chat apps do not run our
// JavaScript, so this cannot be fixed in the client: scripts/prerender-og.mjs
// writes one static shell per route at build time, and Vercel serves a
// matching file before it falls back to the /app/* rewrite. That is the same
// mechanism prerender-wiki.mjs already uses for articles.
//
// `description` comes from the app's own words for that destination
// (src/lib/feature-registry.js) instead of being written fresh, so a preview
// cannot promise something the screen does not do.
//
// `indexable` is the exception, not the rule. These are application screens
// that need a year or an account to mean anything, so they are shareable but
// not pages a search engine should hold. noindex does not affect previews —
// Facebook, LINE and X read the OG tags either way.
// ============================================================

export const OG_COVERS = [
  { id: 'home', route: '/',
    title: 'VetMock',
    description: 'คลังโจทย์ MCQ แนวข้อสอบ และสรุปคลิปย้อนหลัง สำหรับนิสิตสัตวแพทย์',
    cover: 'อ่านให้เข้าใจ ฝึกให้มั่นใจ',
    indexable: true },
  { id: 'subject-select', route: '/app/study',
    title: 'ฝึกข้อสอบรายวิชา',
    description: 'เลือกวิชาและหัวข้อ แล้วตั้งจำนวนข้อกับเวลาเอง',
    cover: 'ฝึกโจทย์ ทีละเรื่อง' },
  { id: 'sr-session', route: '/app/review',
    title: 'ทบทวนตามรอบ',
    description: 'ข้อที่ผิดหรือลังเลจะกลับมาตามรอบที่เหมาะสม',
    cover: 'จำได้วันนี้ จำได้อีกนาน' },
  { id: 'dashboard', route: '/app/progress',
    title: 'ความคืบหน้า',
    description: 'สถิติ จุดอ่อน และสำรองข้อมูล',
    cover: 'มองเห็น การเรียนรู้' },
  { id: 'question-manager', route: '/app/questions',
    title: 'เพิ่ม/แก้ข้อสอบเอง',
    description: 'สร้างข้อสอบ custom',
    cover: 'คลังโจทย์ ของเรา' },
  { id: 'groups', route: '/app/groups',
    title: 'กลุ่มติว',
    description: 'แชร์ข้อสอบและอันดับคะแนนกลุ่ม',
    cover: 'อ่านด้วยกัน ไปได้ไกลกว่า' },
  { id: 'leaderboard-global', route: '/app/leaderboard',
    title: 'อันดับคะแนน',
    description: 'อันดับคะแนนรวม',
    cover: 'ฝึกไปด้วยกัน' },
  { id: 'schedule', route: '/app/schedule',
    title: 'ตารางเรียน & สอบ',
    description: 'ตารางเรียน นับถอยหลังสอบ และเนื้อหาออกสอบ',
    cover: 'วางแผนวันนี้ ให้พร้อมวันสอบ' },
  { id: 'scores', route: '/app/course-scores',
    title: 'สัดส่วนคะแนนรายวิชา',
    description: 'โครงสร้างคะแนน ปี 4 เทอม 2',
    cover: 'ทุกวิชา เห็นภาพเดียว' },
  { id: 'videos', route: '/app/videos',
    title: 'คลิปย้อนหลัง',
    description: 'สรุปคลิปและเพลย์ลิสต์ YouTube',
    cover: 'เปิดคลิป ต่อยอดความรู้' },
  { id: 'about', route: '/app/about',
    title: 'เกี่ยวกับ VetMock',
    description: 'เกี่ยวกับ VetMock + changelog',
    cover: 'รู้จัก VetMock',
    indexable: true },
  { id: 'privacy', route: '/app/privacy',
    title: 'ข้อมูลและความเป็นส่วนตัว',
    description: 'เก็บอะไร เก็บที่ไหน ใครประมวลผล และลบบัญชีได้อย่างไร',
    cover: 'ความเป็นส่วนตัว ของคุณ',
    indexable: true },
  { id: 'feedback', route: '/app/feedback',
    title: 'แจ้งปัญหาและข้อเสนอแนะ',
    description: 'แจ้งข้อผิดพลาด ติชม หรือขอฟีเจอร์',
    cover: 'เสียงของคุณ ช่วยให้ดีขึ้น' },
  { id: 'ig-cards', route: '/app/tools/cards',
    title: 'IG Card Studio',
    description: 'สร้างโพสต์ @vetmock.cu',
    cover: 'ความรู้หนึ่งเรื่อง เล่าต่อได้' },
  { id: 'year-select', route: '/app/year',
    title: 'เลือกชั้นปี',
    description: 'เนื้อหาและคลังข้อสอบปรับตามชั้นปีที่เลือก',
    cover: 'เริ่มจาก ชั้นปีของคุณ' },
  { id: 'phase-select', route: '/app/phase',
    title: 'เลือกช่วงสอบ',
    description: 'กรองวิชาและหัวข้อให้เหลือเฉพาะช่วงสอบที่กำลังจะถึง',
    cover: 'เรียนถึงไหน เริ่มตรงนั้น' },
  { id: 'reading-checklist', route: '/app/reading',
    title: 'รายการอ่าน',
    description: 'เช็กหัวข้อที่อ่านแล้ว',
    cover: 'ทีละบท ทีละก้าว' },
  { id: 'library', route: '/app/library',
    title: 'คลังเอกสาร',
    description: 'อ่านเอกสารในคลัง หรือเปิด PDF ของตัวเองแล้วจด',
    cover: 'เปิดโลก บนชั้นหนังสือ' },
  { id: 'atlas', route: '/app/atlas',
    title: 'Atlas สัตว์',
    description: 'สำรวจโครงกระดูกและอวัยวะ 3D พร้อมขอบเขตและที่มา',
    cover: 'เห็นโครงสร้าง เข้าใจร่างกาย' },
  { id: 'faculty', route: '/app/faculty',
    title: 'อาจารย์ผู้สอน',
    description: 'รวมโปรไฟล์อาจารย์ + งานวิจัย',
    cover: 'รู้จักผู้สอน ในแต่ละวิชา' },
  { id: 'account-settings', route: '/app/account',
    title: 'ตั้งค่าบัญชี',
    description: 'จัดการบัญชี รหัสผ่าน และการลบบัญชี',
    cover: 'พื้นที่ของคุณ' },
  { id: 'offline-game', route: '/app/game',
    title: 'มินิเกม',
    description: 'ลูกไก่หนีเชื้อโรค (เล่นตอนออฟไลน์ได้)',
    cover: 'พักสักนิด แล้วค่อยไปต่อ' },
  { id: 'mochi', route: '/app/mochi',
    title: 'พักกับ Mochi',
    description: 'เล่น พักสายตา และตั้งค่าการเคลื่อนไหว',
    cover: 'เจอกันนะ โมจิ' },
  { id: 'pomodoro', route: '/app/focus',
    title: 'จับเวลาโฟกัส',
    description: 'โฟกัสครั้งละ 25 นาที',
    cover: 'อยู่กับ หน้าตรงนี้' },
  { id: 'race', route: '/app/race',
    title: 'แข่งกับเพื่อน',
    description: 'แข่งทำข้อสอบกับเพื่อน',
    cover: 'พร้อมไหม ไปด้วยกัน' },
  { id: 'pdf-annotate', route: '/app/tools/pdf',
    title: 'เขียนบน PDF',
    description: 'อัปโหลดเอกสารแล้วขีดเขียนได้ทันที',
    cover: 'อ่าน ขีด เขียน ให้เป็นของเรา' },
  { id: 'pinboard', route: '/app/pinboard',
    title: 'กระดานทบทวน',
    description: 'รวมข้อและบันทึกที่เก็บไว้',
    cover: 'เรื่องที่อยาก กลับมาอ่าน' },
  { id: 'image-occlusion', route: '/app/tools/image-occlusion',
    title: 'แฟลชการ์ดปิดภาพ',
    description: 'ทำแฟลชการ์ดจากรูปด้วยการปิดบางส่วน',
    cover: 'ซ่อนคำตอบ ลองนึกดู' },
  { id: 'phase-wrapped', route: '/app/wrapped',
    title: 'สรุปช่วงสอบ',
    description: 'สรุปการเรียนตลอดช่วงสอบ',
    cover: 'ย้อนดู การเดินทาง' },
  { id: 'contribute', route: '/app/contribute',
    title: 'ช่วยเติมเนื้อหา',
    description: 'ส่ง slide / notes / past paper',
    cover: 'แบ่งปันความรู้ ให้เพื่อนรุ่นต่อไป' },
  { id: 'review-queue', route: '/app/review-queue',
    title: 'คิวรอตรวจ',
    description: 'คิวข้อที่ขอให้ตรวจ',
    cover: 'ช่วยกันอ่าน ช่วยกันตรวจ' },
  { id: 'wiki', route: '/wiki',
    title: 'VetWiki',
    description: 'คลังความรู้ที่ตรวจสอบได้ ทุกหัวข้อบอกที่มา',
    cover: 'ความรู้ที่ เชื่อมถึงกัน',
    indexable: true },
  { id: 'blog', route: '/blog/',
    title: 'บทความ',
    description: 'วิธีใช้ VetMock และเบื้องหลังการทำคลังข้อสอบ',
    cover: 'เรื่องเรียน นอกห้องเรียน',
    indexable: true },
  { id: 'bench', route: '/app/bench',
    title: 'โต๊ะทดลองผลตรวจ',
    description: 'ผลบวกหนึ่งครั้งเชื่อได้แค่ไหน — หมุน Se, Sp และความชุก แล้วดู PPV ขยับ',
    cover: 'ผลบวกหนึ่งครั้ง เชื่อได้แค่ไหน' },
];

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

const trim = (p) => (p.length > 1 ? p.replace(/[/]+$/, '') : p);

export function ogCoverFor(id) {
  return OG_COVERS.find((c) => c.id === id) || null;
}

export function ogCoverForRoute(route) {
  const want = trim(String(route || '/'));
  return OG_COVERS.find((c) => trim(c.route) === want) || null;
}
