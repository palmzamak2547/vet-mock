// ============================================================
// ConflictNote — where the published evidence disagrees with the lecture
// ============================================================
// Lives here rather than inside a view because it now renders on more than
// one surface (the wiki article and the notes a student actually revises
// from). Two copies of this component would eventually describe the same
// disagreement in two different ways, which is the one thing a conflict note
// cannot afford to do.
//
// It deliberately shows BOTH sides and never collapses them into an answer.
// Deleting the lecturer's version would cost marks on a paper the lecturer
// marks, while looking like an improvement in the repo. See the reasoning at
// the top of src/lib/vetwiki/corrections.js.
// ============================================================

import React from 'react';
import { RichText } from '../lib/richtext.jsx';

/** @param {{ item: {severity: string, lectureSays: string, evidenceSays: string, examAdvice?: string, sourceRef?: string} }} props */
export default function ConflictNote({ item }) {
  const strong = item.severity === 'contradicts';
  return (
    <div style={{ marginTop: 12, padding: '11px 13px', borderRadius: 10, background: 'var(--clr-surface-2)', borderLeft: `3px solid ${strong ? 'var(--clr-rose)' : 'var(--clr-gold)'}` }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: strong ? 'var(--clr-rose-text)' : 'var(--clr-gold-text)', marginBottom: 6 }}>
        {strong ? 'หลักฐานขัดกับที่บรรยาย' : 'ที่บรรยายกว้างกว่าที่หลักฐานรองรับ'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, lineHeight: 1.6 }}>
        <div><span style={{ color: 'var(--clr-ink-soft)' }}>ที่บรรยายสอน: </span><RichText text={item.lectureSays} /></div>
        <div><span style={{ color: 'var(--clr-ink-soft)' }}>ที่แหล่งอ้างอิงพบ: </span><RichText text={item.evidenceSays} /></div>
        {item.examAdvice && (
          <div style={{ marginTop: 2, paddingTop: 6, borderTop: '1px solid var(--clr-border)', color: 'var(--clr-ink)' }}>
            <span style={{ fontWeight: 700 }}>เวลาสอบ: </span><RichText text={item.examAdvice} />
          </div>
        )}
      </div>
    </div>
  );
}
