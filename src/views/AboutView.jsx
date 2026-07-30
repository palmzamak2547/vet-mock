import { SUBJECTS } from '../data/curriculum.js';
import { QUESTION_SOURCES } from '../data/sources.js';
import BackBar from '../components/BackBar.jsx';

export default function AboutView({ goHome, setView }) {
  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />
      <div className="vmx-hero">
        <h1>เกี่ยวกับ <em>VetMock</em></h1>
        <p>คลังโจทย์ฝึกและเครื่องมือทบทวนสำหรับสัตวแพทย์ จุฬาฯ</p>
      </div>

      {/* Who */}
      <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
        <h3>👥 ผู้สร้าง</h3>
        <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--clr-ink)' }}>
          เว็บนี้สร้างโดย <strong>Vet 86</strong> (คณะสัตวแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย)<br/>
          เพื่อให้รุ่นน้อง รุ่นพี่ และเพื่อนร่วมห้อง ได้ฝึกโจทย์ทบทวนเนื้อหา lecture<br/>
          โจทย์ทุกข้อเรียบเรียงจากเนื้อหาที่เรียน + โน้ตที่นิสิตในรุ่นช่วยกันสรุป
        </div>
      </div>

      {/* Instagram — follow channel for daily Qs, clip recommendations, launch news */}
      <div className="vmx-dash-card" style={{
        marginBottom: 16,
        background: 'linear-gradient(135deg, rgba(225, 48, 108, 0.08), rgba(245, 96, 64, 0.08), rgba(247, 119, 55, 0.08))',
        border: '1px solid rgba(225, 48, 108, 0.3)',
      }}>
        <h3>📷 ติดตามบน Instagram</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginTop: 8 }}>
          <a
            href="https://www.instagram.com/vetmock.cu/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ flexShrink: 0, display: 'block', lineHeight: 0, borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            title="Scan หรือกดเพื่อเปิด @vetmock.cu"
          >
            <img src="/ig-qr.png" alt="QR code → instagram.com/vetmock.cu" width="120" height="120" loading="lazy" decoding="async" style={{ display: 'block' }} />
          </a>
          <div style={{ flex: '1 1 220px', fontSize: 14, lineHeight: 1.7 }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
              @vetmock.cu
            </div>
            <div style={{ color: 'var(--clr-ink-soft)', marginBottom: 10, fontSize: 13 }}>
              Daily Q ของวัน, clip recommendations, changelog, study tips จากเพื่อนๆ ในรุ่น
            </div>
            <a
              href="https://www.instagram.com/vetmock.cu/"
              target="_blank"
              rel="noopener noreferrer"
              className="vmx-btn vmx-btn-primary"
              style={{ display: 'inline-block', textDecoration: 'none', padding: '8px 16px', fontSize: 14 }}
            >
              เปิด Instagram →
            </a>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
        <h3>🎯 เป้าหมาย</h3>
        <div style={{ fontSize: 14, lineHeight: 1.7 }}>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li>เครื่องมือทบทวนครบจบในเว็บเดียว — โจทย์ฝึก, notes สรุป, flashcard, สรุปคลิป, scoring</li>
            <li>รวมโจทย์ฝึกทุกชั้นปีในเว็บเดียว (ตอนนี้เริ่มที่ปี 4 ก่อน)</li>
            <li>ไม่มีค่าใช้จ่าย ไม่โฆษณา ไม่เก็บข้อมูลส่วนตัวที่ไม่จำเป็น</li>
            <li>Open for contribution — ใครอยากช่วยเพิ่มโจทย์ฝึกทักมาได้</li>
          </ul>
        </div>
      </div>

      {/* Features — what's actually in the app */}
      <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
        <h3>🛠 ฟีเจอร์ที่ใช้ได้ตอนนี้</h3>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--clr-ink)' }}>
          <FeatureGroup
            title="📝 ฝึกโจทย์"
            items={[
              'Quick Practice + Exam Mode (ตั้งจำนวนข้อ + เวลา ได้)',
              '4 ประเภท: MCQ (4-5 ช้อยส์), True/False, Fill-in, Matching',
              'Quiz navigator — สำหรับ exam ยาว (≥15 ข้อ) ข้ามไปข้อไหนก็ได้',
              'แยกตามวิชา → หัวข้อ (คาบ) → ความยากของหัวข้อนั้น',
            ]}
          />
          <FeatureGroup
            title="🧠 Spaced Repetition (SR)"
            items={[
              'SM-2 algorithm — ใบที่ผิดบ่อยจะกลับมาเร็วกว่า',
              'เลือกขนาด session: 25 / 50 / 100 / 200 / ทั้งหมด',
              'กรองตามวิชาได้ + ตัดข้อที่ flashcard ไม่ได้ (ข้อจับคู่, ข้อ "ข้อใดถูก...") ออกอัตโนมัติ',
            ]}
          />
          <FeatureGroup
            title="📖 ทบทวนเนื้อหา (Notes)"
            items={[
              'สรุปเนื้อหาแยกหัวข้อ — table, callout, source citation',
              'อิงจาก slide 2026 + เปรียบเทียบกับโน้ตของรุ่นพี่',
            ]}
          />
          <FeatureGroup
            title="🎥 คลิปย้อนหลัง"
            items={[
              'รวม YouTube playlists ของอาจารย์/รุ่นพี่ — ดูใน-app ได้',
              'Search ในเพลย์ลิสต์ + เปลี่ยนคลิป + จำคลิปที่ดูแล้ว',
            ]}
          />
          <FeatureGroup
            title="📊 Track ตัวเอง"
            items={[
              'Dashboard — % ตอบถูกต่อหัวข้อ, weak topics, streak',
              'ประวัติคะแนนสอบเก่า + ทบทวนข้อที่เคยตอบผิด',
              'Bookmark + Note ส่วนตัวต่อข้อ',
            ]}
          />
          <FeatureGroup
            title="👥 Cloud features (เลือกเปิด — ต้อง Login)"
            items={[
              'Study Groups + Leaderboard',
              'Sync bookmark/note/SR ข้ามเครื่อง',
              'แชร์โจทย์ฝึกกับเพื่อนใน group',
            ]}
          />
          <FeatureGroup
            title="✏️ Customize"
            items={[
              'เพิ่มโจทย์ฝึกเอง (custom question manager)',
              'Theme: ☀️ light / 🌙 dark',
              'Mobile-friendly — ใช้บน iPad, มือถือ portrait/landscape ได้',
            ]}
          />
        </div>
      </div>

      {/* Sources */}
      <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
        <h3>📚 ที่มาของโจทย์ฝึก</h3>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--clr-ink-soft)', marginBottom: 14 }}>
          โจทย์ฝึกในเว็บนี้เรียบเรียงจากเนื้อหา lecture + โน้ตทบทวนที่รุ่นพี่ Vet 83–85 ส่งต่อกันมาในรุ่น
        </div>

        {SUBJECTS.filter((s) => s.id !== 'all').map((s) => {
          const src = QUESTION_SOURCES[s.id];
          if (!src) return null;
          return (
            <div key={s.id} style={{
              marginBottom: 14, paddingLeft: 12,
              borderLeft: `3px solid ${s.color}`,
            }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                {s.icon} {s.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', lineHeight: 1.6 }}>
                <strong>หัวข้อ:</strong> {src.topics}<br/>
                <strong>ดึงจาก:</strong> {src.files.join(', ')}<br/>
                <strong>ต้องขอบคุณ:</strong> {src.contributors.join(', ')}<br/>
                {src.note && <em>💡 {src.note}</em>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Thanks */}
      <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
        <h3>🙏 ขอบคุณ</h3>
        <div style={{ fontSize: 14, lineHeight: 1.7 }}>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li><strong>พี่พล Vet 84</strong> — แชร์โน้ตทบทวน Orthopedic, ESF, Approach</li>
            <li><strong>Kimchii 85</strong> — แชร์โน้ตทบทวน COM III, COM IV, Exotic</li>
            <li><strong>TJ86</strong> — แชร์โน้ตทบทวน COM V (รวบรวมจากรุ่นพี่ + อัพเดต 2024)</li>
            <li><strong>pployyyn Vet 83</strong> — แชร์โน้ตทบทวน Repro Lab</li>
            <li><strong>Vet 84</strong> (Ping, Sunsun, Saideang, Janny) — แชร์โน้ตทบทวน Surg Lab 3</li>
            <li><strong>Vet 85</strong> — แชร์โน้ตทบทวน Surg Lab eye + aural</li>
            <li><strong>เพื่อนๆ Vet 86</strong> — feedback และการใช้งานจริง</li>
          </ul>
        </div>
      </div>

      {/* Tech */}
      <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
        <h3>⚙️ Tech Stack</h3>
        <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          Frontend: React 18 + Vite (lazy-loaded views, manual chunks)<br/>
          Backend: Supabase Postgres + Auth (lazy-loaded — โหลดเฉพาะตอน Login)<br/>
          Hosting: Vercel + 1 serverless function (YouTube playlist API)<br/>
          Version: v5.0<br/>
          Cost: $0/month (free tier ทั้งหมด)
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: 16, borderRadius: 12, background: 'var(--clr-surface-2)', fontSize: 12, color: 'var(--clr-ink-soft)', lineHeight: 1.7 }}>
        <strong>⚠️ Disclaimer:</strong> เว็บนี้เป็น unofficial และไม่มีความเกี่ยวข้องกับคณะสัตวแพทยศาสตร์ จุฬาฯ อย่างเป็นทางการ
        เนื้อหาเป็น<strong>โจทย์ฝึก</strong>ที่นิสิตเรียบเรียงเองจากเนื้อหา lecture, ไม่ใช่ข้อสอบจริงและไม่ทดแทนการอ่านเนื้อหาหลัก
        ข้อมูลตารางสอบอาจมีการเปลี่ยนแปลง โปรดตรวจสอบกับทางคณะ/เพื่อนร่วมห้องอีกครั้ง
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 24 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
        <button className="vmx-btn vmx-btn-primary" onClick={() => setView('feedback')}>💌 แจ้งปัญหา/เสนอแนะ</button>
      </div>
    </>
  );
}

function FeatureGroup({ title, items }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
        {title}
      </div>
      <ul style={{ paddingLeft: 22, margin: 0, fontSize: 13, lineHeight: 1.65, color: 'var(--clr-ink)' }}>
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </div>
  );
}
