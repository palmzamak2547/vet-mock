import { useModalFocus } from '../hooks/useModalFocus.js';

const STATUS_LABELS = {
  faculty: 'บุคลากรในรายชื่อหน่วยงานปัจจุบัน',
  emeritus: 'ศาสตราจารย์กิตติคุณ',
  researcher: 'มีโปรไฟล์นักวิจัยของคณะ',
  external: 'วิทยากรหรือผู้เชี่ยวชาญภายนอก',
  historical: 'ผู้สอนที่มีข้อมูลย้อนหลัง',
};

const PROFILE_LABELS = {
  official: 'Chula Vet',
  department: 'รายชื่อภาควิชา',
  scholar: 'Google Scholar',
  scopus: 'Scopus',
  openalex: 'OpenAlex',
  orcid: 'ORCID',
  pubmed: 'PubMed',
  researchgate: 'ResearchGate',
  kasetsart: 'Kasetsart University',
  publicProfile: 'โปรไฟล์วิชาชีพ',
};

const AREA_SOURCE_LABELS = {
  official: 'สาขาวิจัยจากโปรไฟล์ทางการ',
  'public-profile': 'สาขาความเชี่ยวชาญจากโปรไฟล์วิชาชีพที่ตรวจสอบแล้ว',
  OpenAlex: 'สาขาวิจัยสรุปจาก OpenAlex',
  publications: 'สาขาวิจัยสรุปจากชื่อผลงานที่ตรวจสอบแล้ว',
};

function formatVerifiedDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00+07:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Bangkok',
  }).format(date);
}

export default function InstructorModal({ instructor, onClose }) {
  const dialogRef = useModalFocus({ active: Boolean(instructor), onClose });

  if (!instructor) return null;

  const {
    nameEn, nameTh, position, department, institution, email, profiles = {},
    areas = [], areaSource, papers = [], status, verification = {},
  } = instructor;
  const verifiedDate = formatVerifiedDate(verification.verifiedAt);

  return (
    <div className="vmx-modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="vmx-modal"
        onClick={(event) => event.stopPropagation()}
        style={{
          maxWidth: 760,
          maxHeight: 'min(90vh, calc(100dvh - 24px))',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
        tabIndex={-1}
        data-vmx-modal="true"
        role="dialog"
        aria-modal="true"
        aria-label={`ข้อมูลผู้สอน ${nameTh || nameEn}`}
      >
        <div style={{ marginBottom: 18 }}>
          <div style={{
            display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap',
            fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)',
            marginBottom: 8,
          }}>
            <span>👨‍🏫 ข้อมูลคณาจารย์และผู้สอน</span>
            <span aria-hidden="true">—</span>
            <span>{STATUS_LABELS[status] || 'ตรวจสอบสถานะแล้ว'}</span>
          </div>
          <h2 style={{ margin: 0, fontSize: 25, color: 'var(--clr-ink)', lineHeight: 1.25 }}>
            {nameTh || nameEn}
          </h2>
          {nameTh && nameEn && (
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 16, color: 'var(--clr-ink-soft)', marginTop: 4 }}>
              {nameEn}
            </div>
          )}
        </div>

        <div style={{
          padding: '12px 16px', background: 'var(--clr-surface-2)', borderRadius: 10,
          fontSize: 13, marginBottom: 20, lineHeight: 1.5,
        }}>
          <div style={{ fontWeight: 650 }}>{position}</div>
          <div style={{ color: 'var(--clr-ink-soft)', marginTop: 4 }}>{department}</div>
          <div style={{ color: 'var(--clr-ink-soft)', fontSize: 12, marginTop: 2 }}>{institution}</div>
          {email && (
            <a
              href={`mailto:${email}`}
              style={{ display: 'inline-block', marginTop: 7, fontFamily: 'var(--vmx-mono)', fontSize: 11, color: 'var(--clr-rose-text)' }}
            >
              {email}
            </a>
          )}
          <div style={{ marginTop: 9, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {Object.entries(profiles).map(([key, url]) => url && (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-rose-text)',
                  padding: '2px 8px', border: '1px solid var(--clr-border)',
                  borderRadius: 999, textDecoration: 'none',
                }}
              >
                {PROFILE_LABELS[key] || key} ↗
              </a>
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center',
          padding: '9px 12px', marginBottom: 20, border: '1px solid var(--clr-border)',
          borderRadius: 10, background: 'var(--clr-surface)', fontSize: 11,
          fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', flexWrap: 'wrap',
        }}>
          <span>{verification.status === 'verified' ? '✓ ยืนยันชื่อและผลงานจากแหล่งอ้างอิงที่เชื่อมโยงได้' : '✓ ตรวจสอบจากแหล่งสาธารณะที่เชื่อมโยงได้'}</span>
          {verifiedDate && <span>ตรวจล่าสุด {verifiedDate}</span>}
        </div>

        {areas.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontFamily: 'var(--vmx-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--clr-ink-soft)', margin: '0 0 4px' }}>
              สาขาวิจัย
            </h3>
            {AREA_SOURCE_LABELS[areaSource] && (
              <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', marginBottom: 9 }}>
                {AREA_SOURCE_LABELS[areaSource]}
              </div>
            )}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {areas.map((area) => (
                <span key={area} style={{
                  padding: '4px 10px', background: 'var(--clr-surface)',
                  border: '1px solid var(--clr-border)', borderRadius: 999,
                  fontSize: 12, color: 'var(--clr-ink)',
                }}>
                  {area}
                </span>
              ))}
            </div>
          </section>
        )}

        <section style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 13, fontFamily: 'var(--vmx-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--clr-ink-soft)', margin: '0 0 5px' }}>
            📑 ผลงานวิจัยคัดเลือก ({papers.length})
          </h3>
          <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', marginBottom: 12 }}>
            แสดงผลงานตัวอย่างที่ตรวจชื่อผู้เขียนและลิงก์ต้นทางแล้ว ไม่ใช่รายการผลงานทั้งหมด
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {papers.map((paper) => (
              <article key={paper.doi || paper.url || paper.title} style={{
                padding: '12px 14px', background: 'var(--clr-surface)',
                border: '1px solid var(--clr-border)', borderRadius: 10,
              }}>
                <div style={{ fontSize: 14, fontWeight: 550, color: 'var(--clr-ink)', lineHeight: 1.45 }}>
                  <a href={paper.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                    {paper.title}
                  </a>
                </div>
                <div style={{ marginTop: 6, fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', lineHeight: 1.5 }}>
                  {[paper.year, paper.journal].filter(Boolean).join(', ')}
                  {paper.verifiedBy && `, ตรวจผ่าน ${paper.verifiedBy}`}
                </div>
                {paper.authors && (
                  <div style={{ marginTop: 6, fontSize: 12, color: 'var(--clr-ink-soft)', lineHeight: 1.45 }}>
                    {paper.authors}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {verification.sources?.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontFamily: 'var(--vmx-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--clr-ink-soft)', margin: '0 0 8px' }}>
              แหล่งตรวจสอบ
            </h3>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {verification.sources.map((source) => (
                <a
                  key={`${source.label}-${source.url}`}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 12, color: 'var(--clr-rose-text)' }}
                >
                  {source.label} ↗
                </a>
              ))}
            </div>
          </section>
        )}

        <div className="vmx-btn-row" style={{ marginTop: 20 }}>
          <button className="vmx-btn vmx-btn-ghost" onClick={onClose}>ปิด (esc)</button>
        </div>
      </div>
    </div>
  );
}
