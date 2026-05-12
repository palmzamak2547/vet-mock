// ============================================================
// QSourceChip — surface source/verified/examOrigin per Q
// ============================================================
//
// Friend's review (2026-05-12): "เพิ่มชั้น trust/source/verification
// ให้โจทย์ทุกก้อน" — every Q should let the user see where it came
// from and who verified it.
//
// Renders a compact chip with the source filename, expandable to a
// detail panel showing all citation fields + a "report" CTA that
// prefills the feedback form with the Q context. Iron Rule 0: this
// chip just READS existing fields (q.source, q.verified, q.examOrigin,
// q.flag) — no fabrication.
//
// Placement: inside the Question component, below the options +
// explain panel, above the optional image-fallback strip.
// ============================================================

import { useState } from 'react';

export default function QSourceChip({ q, onReport }) {
  const [open, setOpen] = useState(false);

  // Show nothing if Q has zero citation fields (no source, no verified,
  // no examOrigin, no flag) — keep cards clean for the few legacy Qs
  // that pre-date the citation convention.
  const hasAny = !!(q?.source || q?.verified || q?.examOrigin || q?.flag);
  if (!hasAny) return null;

  // Compact summary: prefer examOrigin (most user-meaningful), fall
  // back to source filename if examOrigin missing.
  const summary = q.examOrigin
    ? q.examOrigin
    : (typeof q.source === 'string' ? q.source.replace(/\.pdf.*$/, '.pdf') : 'มีแหล่งอ้างอิง');

  return (
    <div style={{
      marginTop: 14,
      padding: '8px 12px',
      borderRadius: 10,
      background: 'rgba(74, 107, 74, 0.04)',
      border: '1px solid var(--clr-border)',
      fontSize: 12,
      color: 'var(--clr-ink-soft)',
      fontFamily: 'JetBrains Mono, monospace',
    }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
        }}
        aria-expanded={open}
        title={open ? 'ซ่อนแหล่งที่มา' : 'ดูแหล่งที่มาของข้อนี้'}
      >
        <span style={{ fontSize: 14, lineHeight: 1, flex: '0 0 auto' }}>📚</span>
        <span style={{
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          letterSpacing: 0,
        }}>
          ที่มา: {summary}
        </span>
        <span style={{ fontSize: 11, opacity: 0.7, flex: '0 0 auto' }}>
          {open ? '▴ ซ่อน' : '▾ ดูเต็ม'}
        </span>
      </button>

      {open && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed var(--clr-border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {q.source && (
            <Row label="Source"   value={q.source} />
          )}
          {q.verified && (
            <Row label="Verified" value={q.verified} icon="✓" iconColor="var(--clr-sage)" />
          )}
          {q.examOrigin && (
            <Row label="ที่มาแนว" value={q.examOrigin} />
          )}
          {q.flag?.note && (
            <Row
              label="Flag"
              value={q.flag.note}
              icon="⚠️"
              iconColor={
                q.flag.severity === 'major' ? 'var(--clr-rose)'
                : q.flag.severity === 'minor' ? 'var(--clr-gold)'
                : 'var(--clr-ink-soft)'
              }
            />
          )}
          {q.tags && q.tags.length > 0 && (
            <Row label="Tags" value={q.tags.join(' · ')} />
          )}

          {onReport && (
            <button
              type="button"
              onClick={() => onReport(q)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                alignSelf: 'flex-start',
                marginTop: 4,
                padding: '4px 10px',
                borderRadius: 999,
                border: '1px solid var(--clr-border)',
                fontSize: 11,
                fontFamily: 'inherit',
                color: 'var(--clr-rose)',
                background: 'rgba(225, 48, 108, 0.04)',
              }}
              title="ส่ง feedback สำหรับข้อนี้ — เปิดแบบฟอร์มพร้อมเนื้อหา prefilled"
            >
              🐛 แจ้งปัญหาข้อนี้
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, icon, iconColor }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, lineHeight: 1.5 }}>
      {icon && (
        <span style={{ flex: '0 0 auto', color: iconColor || 'inherit', fontSize: 11 }}>
          {icon}
        </span>
      )}
      <span style={{ flex: '0 0 auto', minWidth: 60, color: 'var(--clr-ink-soft)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </span>
      <span style={{ flex: 1, color: 'var(--clr-ink)', fontFamily: 'inherit', fontSize: 11 }}>
        {value}
      </span>
    </div>
  );
}
