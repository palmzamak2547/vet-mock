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
// Both sides side by side from 640 px (styles.css .vmx-conflict), then what to
// do in the exam across the full width. Nothing is struck through.
export default function ConflictNote({ item }) {
  const strong = item.severity === 'contradicts';
  return (
    <div className={`vmx-conflict${strong ? '' : ' is-narrows'}`}>
      <div className="vmx-conflict-label">
        {strong ? 'ตรงนี้แหล่งอ้างอิงไม่ตรงกับที่สอน' : 'ตรงนี้ที่สอนกว้างกว่าที่แหล่งอ้างอิงยืนยัน'}
      </div>
      <div className="vmx-conflict-sides">
        <div>
          <div className="vmx-conflict-side">ที่สอนในคาบ</div>
          <RichText text={item.lectureSays} />
        </div>
        <div>
          <div className="vmx-conflict-side">แหล่งอ้างอิงว่า</div>
          <RichText text={item.evidenceSays} />
        </div>
      </div>
      {item.examAdvice && (
        <div className="vmx-conflict-exam">
          <span className="vmx-conflict-side">ตอนสอบ</span>
          <RichText text={item.examAdvice} />
        </div>
      )}
    </div>
  );
}
