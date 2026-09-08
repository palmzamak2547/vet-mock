import { useEffect } from 'react';
import { useModalFocus } from '../hooks/useModalFocus.js';
import NavIcon from './NavIcon.jsx';
import Mochi from './Mochi.jsx';

// The first-time tour, upgraded 2026-09-07 from the old 4-slide version that
// lived inside HomeView. It now covers the whole feature map (7 steps) and
// lives at App level so ANY view can open it — the old version could only be
// reached from a first-visit banner that disappears after one exam attempt,
// which locked mid-term newcomers out of the tour forever.

const STEPS = [
  {
    icon: '👋',
    title: 'ยินดีต้อนรับสู่ VetMock',
    body: 'คลังข้อสอบสัตวแพทย์ จุฬาฯ พร้อมเครื่องมือทบทวนครบจบในเว็บเดียว ใช้ฟรี ไม่มีโฆษณา เริ่มฝึกได้เลยไม่ต้องสมัคร — ล็อกอินใช้เมื่ออยากซิงก์สถิติข้ามเครื่อง หรือเข้ากลุ่มอ่านหนังสือกับเพื่อน',
  },
  {
    icon: '✏️',
    title: 'ฝึกข้อสอบทีละวิชา',
    body: 'เลือกวิชาที่ต้องการ → เลือกหัวข้อ → ตั้งจำนวนข้อ เวลา และประเภทคำถาม (MCQ, True/False, เติมคำ จับคู่) โหมดฝึกจะเฉลยทันทีที่ตอบเลือก พร้อมเหตุผลและแหล่งอ้างอิง',
  },
  {
    icon: '🎯',
    title: 'จำลองสอบจริงด้วย Mock Exam',
    body: 'อยากวัดตัวเองแบบห้องสอบ ใช้โหมดสอบ — จับเวลารวมทั้งชุด ไม่โชว์เฉลยจนกว่าจะส่ง แล้วดูสรุปคะแนน + ข้อที่ผิดครบทั้งชุดทันที',
  },
  {
    icon: '🔍',
    title: 'ค้นหา ถาม หรือสั่งงาน ในช่องเดียว',
    body: 'กดปุ่มค้นหา (หรือ Ctrl+K) แล้วพิมพ์หรือพูดใส่ไมค์ได้เลย ค้นข้อสอบ เอกสาร และบทความ, ถามคำถามให้ตอบพร้อมแหล่งที่มา หรือสั่งเช่น "จัดข้อสอบ COM5 20 ข้อ" แล้วกดยืนยันให้ระบบจัดให้',
  },
  {
    icon: '🔁',
    title: 'ทบทวนจากสิ่งที่พลาด',
    body: 'หลังทำข้อสอบ ย้อนดูข้อที่ตอบผิดพร้อมเฉลยและแหล่งอ้างอิงได้ทุกเมื่อ และระบบทบทวนตามรอบ (SR) จะค่อยๆ ย้อนข้อที่เสี่ยงลืมกลับมาตามจังหวะความจำของคุณ',
  },
  {
    icon: '📚',
    title: 'สรุปและคลังความรู้',
    body: 'เมนู "เรียน & ทบทวน" รวมโน้ตสรุปจากเพื่อนรุ่น สรุปคลิปวิดีโอ บทความ VetWiki และห้องสมุดเอกสาร — อ่านเสริมรอบๆ การฝึกข้อสอบได้ในที่เดียว',
  },
  {
    icon: '📈',
    title: 'ติดตามความคืบหน้าของตัวเอง',
    body: 'หน้าความคืบหน้าจะสรุปคะแนนรายวิชา วิชาที่ยังอ่อน และสถิติการฝึกต่อเนื่อง (streak) เพื่อให้รู้ว่าควรเริ่มทบทวนจากวิชาไหนก่อน',
  },
];

export default function OnboardingTour({ step, onNext, onBack, onDismiss, onStart, returnFocusRef }) {
  const current = STEPS[step] || STEPS[0];
  const isLast = step >= STEPS.length - 1;
  const isFirst = step === 0;

  const dialogRef = useModalFocus({ onClose: onDismiss, returnFocusRef });
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  return (
    <div className="vmx-tour-overlay">
      <div className="vmx-tour-backdrop" aria-hidden="true" onClick={onDismiss} />
      <div
        ref={dialogRef}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-label={current.title}
        data-vmx-modal="true"
        className="vmx-tour-dialog"
      >
        <button
          type="button"
          aria-label="ข้าม"
          onClick={onDismiss}
          className="vmx-icon-close vmx-tour-close"
          title="ข้าม"
        ><NavIcon name="close" size={16} /></button>

        <span className="vmx-tour-icon" aria-hidden="true"><Mochi state={['wave', 'think', 'curious', 'think', 'encourage', 'read', 'happy'][step] || 'wave'} size={48} animate slot="guide" fallback={current.icon} /></span>
        <h2 className="vmx-tour-title">{current.title}</h2>
        <div className="vmx-tour-body">{current.body}</div>

        {/* Dots indicator */}
        <div className="vmx-tour-dots" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span key={i} className={i === step ? 'vmx-tour-dot is-active' : 'vmx-tour-dot'} />
          ))}
        </div>

        <div className="vmx-tour-actions">
          <button
            type="button"
            onClick={onDismiss}
            className="vmx-tour-skip"
          >
            ข้าม
          </button>
          <div className="vmx-tour-nav">
            {!isFirst && (
              <button
                type="button"
                className="vmx-btn vmx-btn-ghost"
                onClick={onBack}
              >
                ย้อนกลับ
              </button>
            )}
            <button
              type="button"
              className="vmx-btn vmx-btn-primary"
              onClick={isLast ? onStart : onNext}
            >
              {isLast ? 'เริ่มฝึกซ้อม' : 'ถัดไป'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
