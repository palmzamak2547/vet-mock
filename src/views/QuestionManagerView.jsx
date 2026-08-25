import { useState } from 'react';
import { QB, SUBJECTS } from '../data/questions.js';
import { yearForSubject } from '../data/curriculum.js';
import { downloadJSON } from '../hooks/utils.js';
import { confirmDialog, alertDialog, promptDialog } from '../lib/dialog.js';
import { parseCustomQuestion, USER_DATA_IMPORT_MAX_BYTES } from '../lib/user-data-schema.js';

export default function QuestionManagerView({ customQuestions, setCustomQuestions, goHome }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initForm());

  // Bulk-select / lasso state — checkbox-based UX (cross-platform safe vs canvas lasso)
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [lastSelectedId, setLastSelectedId] = useState(null); // for shift-click range
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  const clearSelection = () => { setSelectedIds(new Set()); setLastSelectedId(null); };
  const exitSelectMode = () => { setSelectMode(false); clearSelection(); setShowSubjectPicker(false); };

  // Toggle a single id, supporting shift-click range from lastSelectedId.
  // Uses functional setState so scroll position never resets and we don't
  // depend on a possibly-stale selectedIds reference inside event handlers.
  const toggleId = (id, shiftKey = false) => {
    if (shiftKey && lastSelectedId != null && lastSelectedId !== id) {
      const ids = customQuestions.map((q) => q.id);
      const a = ids.indexOf(lastSelectedId);
      const b = ids.indexOf(id);
      if (a !== -1 && b !== -1) {
        const [lo, hi] = a < b ? [a, b] : [b, a];
        const range = ids.slice(lo, hi + 1);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          range.forEach((r) => next.add(r));
          return next;
        });
        setLastSelectedId(id);
        return;
      }
    }
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setLastSelectedId(id);
  };

  const bulkDelete = async () => {
    const n = selectedIds.size;
    if (n === 0) return;
    if (!(await confirmDialog({ title: `ลบ ${n} ข้อ?`, note: 'ลบแล้วกู้คืนไม่ได้', confirmLabel: 'ลบ', tone: 'danger' }))) return;
    setCustomQuestions((prev) => prev.filter((q) => !selectedIds.has(q.id)));
    clearSelection();
  };

  const bulkAddTag = async () => {
    if (selectedIds.size === 0) return;
    const raw = await promptDialog({
      title: 'เพิ่ม tag',
      body: `จะเพิ่มให้ทุกข้อที่เลือกไว้ ${selectedIds.size} ข้อ`,
      placeholder: 'ชื่อ tag',
      maxLength: 30,
      confirmLabel: 'เพิ่ม tag',
    });
    if (raw == null) return;
    const tag = raw.trim();
    if (!tag) { alertDialog('tag ว่างไม่ได้'); return; }
    if (tag.length >= 30) { alertDialog('tag ยาวเกินไป (< 30 ตัวอักษร)'); return; }
    setCustomQuestions((prev) => prev.map((q) => {
      if (!selectedIds.has(q.id)) return q;
      const existing = Array.isArray(q.tags) ? q.tags : [];
      if (existing.includes(tag)) return q; // de-dup
      return { ...q, tags: [...existing, tag] };
    }));
    clearSelection();
  };

  const bulkChangeSubject = (subjectId) => {
    if (selectedIds.size === 0) return;
    setCustomQuestions((prev) => prev.map((q) => selectedIds.has(q.id) ? { ...q, subject: subjectId } : q));
    setShowSubjectPicker(false);
    clearSelection();
  };

  function initForm() {
    return {
      subject: 'surg2',
      tags: '',
      type: 'mcq',
      q: '',
      options: ['', '', '', ''],
      answer: 0,
      blanks: [''],
      pairs: [{ left: '', right: '' }],
      explain: '',
      image: '',
    };
  }

  const startAdd = () => { setFormData(initForm()); setEditingId(null); setShowForm(true); };
  const startEdit = (q) => {
    setFormData({
      subject: q.subject,
      tags: (q.tags || []).join(', '),
      type: q.type,
      q: q.q,
      options: q.options || ['', '', '', ''],
      answer: q.answer || 0,
      blanks: q.blanks || [''],
      pairs: q.pairs || [{ left: '', right: '' }],
      explain: q.explain || '',
      image: q.image || '',
    });
    setEditingId(q.id);
    setShowForm(true);
  };

  const save = () => {
    if (!formData.q.trim()) { alertDialog('กรุณาใส่คำถาม'); return; }
    // Year auto-derived from subject (data-layer audit 2026-05-18).
    // Custom Qs inherit the curriculum year of their subject. Without
    // this tag, SR session + Pinboard year-toggles couldn't filter
    // custom Qs and they'd leak into other-year views.
    // SUBJECTS_BY_YEAR is the source of truth; falls back to 4 (the
    // current dominant year) when the subject is unmapped.
    const yearTag = yearForSubject(formData.subject) ?? 4;
    const base = {
      subject: formData.subject,
      year: yearTag,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      type: formData.type,
      q: formData.q,
      explain: formData.explain,
    };
    if (formData.image) base.image = formData.image;
    if (formData.type === 'mcq') { base.options = formData.options; base.answer = parseInt(formData.answer); }
    else if (formData.type === 'tf') { base.answer = formData.answer === true || formData.answer === 'true'; }
    else if (formData.type === 'fill') { base.blanks = formData.blanks.filter((b) => b.trim()); }
    else if (formData.type === 'match') { base.pairs = formData.pairs.filter((p) => p.left.trim() && p.right.trim()); }

    if (editingId) {
      setCustomQuestions(customQuestions.map((q) => q.id === editingId ? { ...base, id: editingId } : q));
    } else {
      const maxId = Math.max(500, ...customQuestions.map((q) => q.id), ...QB.map((q) => q.id));
      setCustomQuestions([...customQuestions, { ...base, id: maxId + 1 }]);
    }
    setShowForm(false);
  };

  const deleteQ = async (id) => {
    if (await confirmDialog({ title: 'ลบข้อนี้?', confirmLabel: 'ลบ', tone: 'danger' })) setCustomQuestions(customQuestions.filter((q) => q.id !== id));
  };

  const exportCustom = () => downloadJSON(customQuestions, `custom-questions-${Date.now()}.json`);

  const importCustom = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > USER_DATA_IMPORT_MAX_BYTES) {
      alertDialog('ไฟล์ใหญ่เกิน 20 MB กรุณาแบ่งเป็นหลายไฟล์แล้วนำเข้าทีละชุด');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data)) throw new Error('top-level is not an array');
        if (data.length === 0) throw new Error('ไฟล์ไม่มีข้อสอบ');

        // Pre-validate all items so we can give the user a real preview
        // of how many will succeed. Reject entire import if all-invalid.
        const valid = [];
        const invalidReasons = {};
        data.forEach((q) => {
          const parsed = parseCustomQuestion(q);
          if (!parsed.success) {
            invalidReasons[parsed.reason] = (invalidReasons[parsed.reason] || 0) + 1;
          } else {
            valid.push(parsed.data);
          }
        });

        if (valid.length === 0) {
          alertDialog(`นำเข้าไม่ได้ — ทั้ง ${data.length} ข้อมีข้อมูลไม่ครบ:\n\n` +
            Object.entries(invalidReasons).map(([r, n]) => `• ${n} ข้อ: ${r}`).join('\n'));
          e.target.value = ''; // reset so same file can be re-tried
          return;
        }

        const skipped = data.length - valid.length;
        const summary = skipped === 0
          ? `นำเข้า ${valid.length} ข้อ`
          : `นำเข้า ${valid.length}/${data.length} ข้อ (ข้าม ${skipped} ข้อที่ไม่ครบ)\n\nสาเหตุที่ข้าม:\n` +
            Object.entries(invalidReasons).map(([r, n]) => `• ${n} ข้อ: ${r}`).join('\n');

        if (await confirmDialog({ title: summary.split('\n')[0], body: summary.split('\n').slice(1).join('\n').trim(), confirmLabel: 'นำเข้า' })) {
          const allIds = new Set([...customQuestions.map((q) => q.id), ...QB.map((q) => q.id)]);
          let nextId = Math.max(500, ...allIds);
          // Always reassign IDs so importing the same file twice doesn't
          // duplicate IDs (was a silent bug — IDs collided with QB and the
          // app would render whichever came first in the array).
          const withNewIds = valid.map((q) => ({ ...q, id: ++nextId }));
          setCustomQuestions([...customQuestions, ...withNewIds]);
        }
        e.target.value = '';
      } catch (err) {
        e.target.value = '';
        alertDialog('ไฟล์ JSON ไม่ถูกต้อง — ' + (err?.message || 'อ่านไฟล์ไม่ได้'));
      }
    };
    reader.onerror = () => {
      e.target.value = '';
      alertDialog('อ่านไฟล์ไม่สำเร็จ กรุณาลองเลือกไฟล์อีกครั้ง');
    };
    reader.readAsText(file);
  };

  if (showForm) {
    return (
      <>
        <div className="vmx-hero">
          <h1>{editingId ? 'แก้ไข' : 'เพิ่ม'} <em>ข้อสอบ</em></h1>
        </div>

        <div className="vmx-config-panel">
          <div className="vmx-form-group">
            <label htmlFor="vmx-custom-subject">วิชา</label>
            <select id="vmx-custom-subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}>
              {SUBJECTS.filter((s) => s.id !== 'all').map((s) => (
                <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
              ))}
            </select>
          </div>

          <div className="vmx-form-group">
            <label htmlFor="vmx-custom-type">ชนิด</label>
            <select id="vmx-custom-type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
              <option value="mcq">Multiple Choice</option>
              <option value="tf">True / False</option>
              <option value="fill">Fill in the Blank</option>
              <option value="match">Matching</option>
            </select>
          </div>

          <div className="vmx-form-group">
            <label htmlFor="vmx-custom-tags">Tags (คั่นด้วย comma)</label>
            <input id="vmx-custom-tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="e.g. ortho, plate, fracture" />
          </div>

          <div className="vmx-form-group">
            <label htmlFor="vmx-custom-question">คำถาม</label>
            <textarea id="vmx-custom-question" value={formData.q} onChange={(e) => setFormData({ ...formData, q: e.target.value })} />
          </div>

          <div className="vmx-form-group">
            <label htmlFor="vmx-custom-image">รูปภาพ (URL - optional)</label>
            <input id="vmx-custom-image" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://... หรือ data:image/..." />
          </div>

          {formData.type === 'mcq' && (
            <div className="vmx-form-group" role="group" aria-labelledby="vmx-custom-options-label">
              <div id="vmx-custom-options-label">ตัวเลือก (เลือก radio ที่ถูก)</div>
              {formData.options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                  <input type="radio" name="answer" checked={formData.answer == i} onChange={() => setFormData({ ...formData, answer: i })} aria-label={`ตั้งตัวเลือก ${String.fromCharCode(65 + i)} เป็นคำตอบที่ถูก`} />
                  <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, minWidth: 20 }}>{String.fromCharCode(65 + i)}.</span>
                  <input value={opt} onChange={(e) => { const opts = [...formData.options]; opts[i] = e.target.value; setFormData({ ...formData, options: opts }); }} aria-label={`ข้อความตัวเลือก ${String.fromCharCode(65 + i)}`} />
                </div>
              ))}
            </div>
          )}

          {formData.type === 'tf' && (
            <div className="vmx-form-group">
              <label htmlFor="vmx-custom-tf-answer">คำตอบ</label>
              <select id="vmx-custom-tf-answer" value={formData.answer === true ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, answer: e.target.value === 'true' })}>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          )}

          {formData.type === 'fill' && (
            <div className="vmx-form-group" role="group" aria-labelledby="vmx-custom-blanks-label">
              <div id="vmx-custom-blanks-label">คำตอบแต่ละช่อง (ใส่ ____ ในคำถามตรงตำแหน่งที่ต้องการให้เติม)</div>
              {formData.blanks.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <span style={{ minWidth: 70, fontSize: 12, alignSelf: 'center' }}>ช่องที่ {i + 1}</span>
                  <input value={b} onChange={(e) => { const bs = [...formData.blanks]; bs[i] = e.target.value; setFormData({ ...formData, blanks: bs }); }} aria-label={`คำตอบช่องที่ ${i + 1}`} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setFormData({ ...formData, blanks: [...formData.blanks, ''] })}>+ ช่อง</button>
                {formData.blanks.length > 1 && (
                  <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setFormData({ ...formData, blanks: formData.blanks.slice(0, -1) })}>− ช่อง</button>
                )}
              </div>
            </div>
          )}

          {formData.type === 'match' && (
            <div className="vmx-form-group" role="group" aria-labelledby="vmx-custom-pairs-label">
              <div id="vmx-custom-pairs-label">คู่ matching (ซ้าย ↔ ขวา)</div>
              {formData.pairs.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <input style={{ flex: 1 }} value={p.left} placeholder="ซ้าย" aria-label={`คู่ที่ ${i + 1} ด้านซ้าย`} onChange={(e) => { const ps = [...formData.pairs]; ps[i] = { ...ps[i], left: e.target.value }; setFormData({ ...formData, pairs: ps }); }} />
                  <span style={{ alignSelf: 'center' }}>↔</span>
                  <input style={{ flex: 1 }} value={p.right} placeholder="ขวา" aria-label={`คู่ที่ ${i + 1} ด้านขวา`} onChange={(e) => { const ps = [...formData.pairs]; ps[i] = { ...ps[i], right: e.target.value }; setFormData({ ...formData, pairs: ps }); }} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setFormData({ ...formData, pairs: [...formData.pairs, { left: '', right: '' }] })}>+ คู่</button>
                {formData.pairs.length > 1 && (
                  <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setFormData({ ...formData, pairs: formData.pairs.slice(0, -1) })}>− คู่</button>
                )}
              </div>
            </div>
          )}

          <div className="vmx-form-group">
            <label htmlFor="vmx-custom-explanation">คำอธิบาย (Why)</label>
            <textarea id="vmx-custom-explanation" value={formData.explain} onChange={(e) => setFormData({ ...formData, explain: e.target.value })} placeholder="เพราะเซลล์ไตจะ..." />
          </div>
        </div>

        <div className="vmx-btn-row">
          <button className="vmx-btn vmx-btn-ghost" onClick={() => setShowForm(false)}>← ยกเลิก</button>
          <button className="vmx-btn vmx-btn-primary" onClick={save}>บันทึก</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="vmx-hero">
        <h1>จัดการ <em>ข้อสอบส่วนตัว</em></h1>
        <p>เพิ่ม แก้ไข หรือนำเข้าข้อสอบของตัวเอง — มี {customQuestions.length} ข้อ</p>
      </div>

      <div className="vmx-btn-row" style={{ marginBottom: 12, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        <button className="vmx-btn vmx-btn-primary" onClick={startAdd}>เพิ่มข้อสอบ</button>
        <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={exportCustom}>ส่งออก JSON</button>
        <label className="vmx-btn vmx-btn-ghost vmx-btn-sm" style={{ cursor: 'pointer' }}>
          นำเข้า JSON
          <input type="file" accept=".json" onChange={importCustom} style={{ display: 'none' }} />
        </label>
        {customQuestions.length > 0 && (
          <button
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            onClick={() => selectMode ? exitSelectMode() : setSelectMode(true)}
            style={{ minHeight: 44 }}
          >
            {selectMode ? '✕ ปิดการเลือก' : '☑ เลือกหลายข้อ'}
          </button>
        )}
      </div>
      {selectMode && (
        <div style={{ fontSize: 13, color: '#888', marginBottom: 16, padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 6 }}>
          คลิกที่ข้อเพื่อเลือก, แล้วแถบจะขึ้นด้านล่าง (กด Shift + คลิก เพื่อเลือกหลายข้อพร้อมกัน)
        </div>
      )}

      {customQuestions.length === 0 ? (
        <div className="vmx-empty">ยังไม่มีข้อสอบส่วนตัว — กด “เพิ่มข้อสอบ” เพื่อสร้าง</div>
      ) : (
        <div style={{ paddingBottom: selectedIds.size > 0 ? 96 : 0 }}>
          {customQuestions.map((q) => {
            const checked = selectedIds.has(q.id);
            return (
              <div
                key={q.id}
                className="vmx-review-item"
                onClick={selectMode ? (e) => {
                  // Don't hijack clicks on action buttons inside the row
                  if (e.target.closest('button') || e.target.closest('input')) return;
                  toggleId(q.id, e.shiftKey);
                } : undefined}
                style={selectMode ? {
                  cursor: 'pointer',
                  outline: checked ? '2px solid #4ade80' : 'none',
                  outlineOffset: -2,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 0,
                } : undefined}
              >
                {selectMode && (
                  <label
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      flexShrink: 0,
                      width: 44,
                      minHeight: 44,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      marginRight: 4,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => toggleId(q.id, e.nativeEvent.shiftKey)}
                      style={{ width: 24, height: 24, cursor: 'pointer' }}
                      aria-label={`เลือกข้อ ${q.id}`}
                    />
                  </label>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="vmx-review-head">
                    <span>#{q.id}, {SUBJECTS.find((s) => s.id === q.subject)?.name || q.subject}, {q.type.toUpperCase()}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={(e) => { e.stopPropagation(); startEdit(q); }}>แก้</button>
                      <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={(e) => { e.stopPropagation(); deleteQ(q.id); }}>🗑</button>
                    </div>
                  </div>
                  <div className="vmx-review-q">{q.q}</div>
                  {q.tags && q.tags.length > 0 && (
                    <div>{q.tags.map((t) => <span key={t} className="vmx-tag-pill">#{t}</span>)}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky floating bulk-action bar (a.k.a. "lasso" action pill) */}
      {selectedIds.size > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 'max(16px, env(safe-area-inset-bottom))',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 800,
            background: 'rgba(20,20,24,0.96)',
            color: '#fff',
            borderRadius: 999,
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
            border: '1px solid rgba(255,255,255,0.12)',
            maxWidth: 'calc(100vw - 24px)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span style={{
            background: '#4ade80',
            color: '#0a0a0a',
            fontWeight: 700,
            borderRadius: 999,
            padding: '4px 10px',
            fontSize: 13,
            minHeight: 28,
            display: 'inline-flex',
            alignItems: 'center',
          }}>
            {selectedIds.size} ข้อ
          </span>
          <button
            onClick={bulkDelete}
            style={bulkBtn}
          >ลบทั้งหมด</button>
          <button
            onClick={bulkAddTag}
            style={bulkBtn}
          >🏷 เปลี่ยน tag</button>
          <button
            onClick={() => setShowSubjectPicker((v) => !v)}
            style={bulkBtn}
          >📂 ย้ายวิชา</button>
          <button
            onClick={clearSelection}
            style={{ ...bulkBtn, opacity: 0.7 }}
          >ยกเลิก</button>
        </div>
      )}

      {/* Subject picker popover — sits above the floating bar */}
      {showSubjectPicker && selectedIds.size > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(max(16px, env(safe-area-inset-bottom)) + 64px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 801,
            background: 'rgba(20,20,24,0.98)',
            color: '#fff',
            borderRadius: 12,
            padding: 12,
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            maxWidth: 'calc(100vw - 24px)',
            maxHeight: '60vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minWidth: 240,
          }}
        >
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>เลือกวิชาใหม่สำหรับ {selectedIds.size} ข้อ</div>
          {SUBJECTS.filter((s) => s.id !== 'all').map((s) => (
            <button
              key={s.id}
              onClick={() => bulkChangeSubject(s.id)}
              style={{
                textAlign: 'left',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '10px 12px',
                minHeight: 44,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >{s.icon} {s.name}</button>
          ))}
        </div>
      )}

      <div className="vmx-btn-row">
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← กลับหน้าแรก</button>
      </div>
    </>
  );
}

// Bulk-action pill button style — touch-friendly (≥44px height),
// no hover dependency, uses :active feel via inline opacity tweak.
const bulkBtn = {
  background: 'rgba(255,255,255,0.1)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 999,
  padding: '8px 14px',
  minHeight: 44,
  fontSize: 14,
  cursor: 'pointer',
  fontWeight: 500,
  whiteSpace: 'nowrap',
};
