import { SUBJECTS } from '../data/curriculum.js';
import { QUESTION_SOURCES } from '../data/sources.js';

export default function AboutView({ goHome, setView }) {
  return (
    <>
      <div className="vmx-hero">
        <h1>เกี่ยวกับ <em>VetMock</em></h1>
        <p>คลังข้อสอบและเครื่องมือเตรียมสอบสำหรับสัตวแพทย์ จุฬาฯ</p>
      </div>

      {/* Who */}
      <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
        <h3>👥 ผู้สร้าง</h3>
        <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--clr-ink)' }}>
          เว็บนี้สร้างโดย <strong>Vet 86</strong> (คณะสัตวแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย)<br/>
          เพื่อช่วยให้รุ่นน้อง รุ่นพี่ และเพื่อนร่วมห้อง ได้ฝึกทำข้อสอบแบบจำลอง<br/>
          เนื้อหาทุกอย่างมาจากข้อสอบเก่าที่เพื่อนๆ รุ่นพี่ช่วยกันรวบรวม
        </div>
      </div>

      {/* Mission */}
      <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
        <h3>🎯 เป้าหมาย</h3>
        <div style={{ fontSize: 14, lineHeight: 1.7 }}>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li>ช่วยให้รุ่นน้อง Vet ได้ฝึกสอบด้วยข้อสอบจริงจากรุ่นพี่</li>
            <li>รวมคลังข้อสอบทุกชั้นปีในเว็บเดียว (ตอนนี้เริ่มที่ปี 4 ก่อน)</li>
            <li>ไม่มีค่าใช้จ่าย ไม่โฆษณา ไม่เก็บข้อมูลส่วนตัว</li>
            <li>Open for contribution — ใครอยากช่วยเพิ่มข้อสอบทักมาได้</li>
          </ul>
        </div>
      </div>

      {/* Exam structure — what shows up on the actual final */}
      <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
        <h3>📝 โครงสร้างข้อสอบจริง (อัปเดตล่าสุด)</h3>
        <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginBottom: 14, fontStyle: 'italic' }}>
          ข้อมูลที่อาจารย์/เพื่อนๆ บอกมาเรื่อยๆ — เก็บไว้ที่นี่ให้พร้อมเตรียม · โปรดยืนยันกับอาจารย์/หัวปีอีกครั้งก่อนวันสอบจริง
        </div>

        {/* COM III */}
        <div style={{ marginBottom: 14, paddingLeft: 12, borderLeft: '3px solid #c26d6d' }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
            🚨 COM III · C Ani Clin Sci III
          </div>
          <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13, lineHeight: 1.7, color: 'var(--clr-ink)' }}>
            <li>ออก <strong>~5-7 ข้อต่อคาบ</strong> (ตารางเรียน 14 คาบ → ~70-100 ข้อรวม)</li>
            <li>ตัวเลือก <strong>5 ช้อยส์</strong> (A-E)</li>
            <li>สัดส่วน <strong>40%</strong> ของคะแนนวิชา</li>
            <li style={{ color: 'var(--clr-gold)' }}>
              ⚠️ <strong>เรื่อง AI</strong> ยังไม่ confirm ว่าออกไหม — อาจารย์ตั้งใจให้ <em>ไม่ออก</em> · รออาจารย์ confirm อีกที
            </li>
          </ul>
        </div>

        {/* Poultry */}
        <div style={{ marginBottom: 0, paddingLeft: 12, borderLeft: '3px solid #c2924a' }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
            🐔 Poultry Health Management
          </div>
          <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13, lineHeight: 1.7, color: 'var(--clr-ink)' }}>
            <li>สัดส่วน <strong>7.5% ต่อสัปดาห์</strong></li>
            <li>
              <strong>แนวข้อสอบ</strong> (เท่าที่รู้):
              <ul style={{ paddingLeft: 18, margin: '4px 0 0', fontSize: 12.5, color: 'var(--clr-ink-soft)' }}>
                <li>การประกันคุณภาพของฟาร์มสัตว์ปีก — <code>True/False</code> ~10 ข้อ</li>
                <li>การจัดการฟาร์มสัตว์ปีก + ปัญหาลูกไก่ตายในสัปดาห์แรก — <code>MCQ ช้อยส์</code></li>
                <li>Avian zoonosis — <code>เติมคำ (fill-in)</code></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* Sources */}
      <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
        <h3>📚 แหล่งที่มาของข้อสอบ</h3>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--clr-ink-soft)', marginBottom: 14 }}>
          ข้อสอบในเว็บนี้ดึงมาจากข้อสอบเก่าของรุ่นพี่ Vet 83–85 ที่ช่วยกันรวบรวมและแชร์กันในห้อง
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
            <li><strong>พี่พล Vet 84</strong> — ข้อสอบเก่า Orthopedic, ESF, Approach</li>
            <li><strong>Kimchii 85</strong> — ข้อสอบเก่า COM III, COM IV, Exotic</li>
            <li><strong>TJ86</strong> — ข้อสอบเก่า COM V (รวบรวมข้อสอบเก่ารุ่นพี่ + อัพเดต 2024)</li>
            <li><strong>pployyyn Vet 83</strong> — ข้อสอบเก่า Repro Lab</li>
            <li><strong>Vet 84</strong> (Ping, Sunsun, Saideang, Janny) — ข้อสอบเก่า Surg Lab 3</li>
            <li><strong>Vet 85</strong> — ข้อสอบเก่า Surg Lab eye + aural</li>
            <li><strong>เพื่อนๆ Vet 86</strong> — feedback และการใช้งานจริง</li>
          </ul>
        </div>
      </div>

      {/* Tech */}
      <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
        <h3>⚙️ Tech Stack</h3>
        <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          Frontend: React + Vite<br/>
          Backend: Supabase (Postgres + Auth)<br/>
          Hosting: Vercel<br/>
          Version: v5.0<br/>
          Cost: $0/month (free tier ทั้งหมด)
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: 16, borderRadius: 12, background: 'var(--clr-surface-2)', fontSize: 12, color: 'var(--clr-ink-soft)', lineHeight: 1.7 }}>
        <strong>⚠️ Disclaimer:</strong> เว็บนี้เป็น unofficial และไม่มีความเกี่ยวข้องกับคณะสัตวแพทยศาสตร์ จุฬาฯ อย่างเป็นทางการ
        เนื้อหาเป็นเพียงการ<strong>จำลอง</strong>ข้อสอบเพื่อการฝึก ไม่ใช่ข้อสอบจริง
        ข้อมูลตารางสอบอาจมีการเปลี่ยนแปลง โปรดตรวจสอบกับทางคณะ/เพื่อนร่วมห้องอีกครั้ง
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 24 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
        <button className="vmx-btn vmx-btn-primary" onClick={() => setView('feedback')}>💌 แจ้งปัญหา/เสนอแนะ</button>
      </div>
    </>
  );
}
