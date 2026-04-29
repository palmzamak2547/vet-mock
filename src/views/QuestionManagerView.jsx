import { useState } from 'react';
import { QB, SUBJECTS } from '../data/questions.js';
import { downloadJSON } from '../hooks/utils.js';

export default function QuestionManagerView({ customQuestions, setCustomQuestions, goHome }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initForm());

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
    if (!formData.q.trim()) { alert('กรุณาใส่คำถาม'); return; }
    const base = {
      subject: formData.subject,
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

  const deleteQ = (id) => {
    if (confirm('ลบข้อนี้?')) setCustomQuestions(customQuestions.filter((q) => q.id !== id));
  };

  const exportCustom = () => downloadJSON(customQuestions, `custom-questions-${Date.now()}.json`);

  // Validate one entry against required fields per type. Returns
  // null if valid, or a short reason string if invalid. Used during
  // import to avoid silently committing broken questions that crash
  // the renderer later (e.g., MCQ with no options or no answer index).
  const validateImportItem = (q) => {
    if (!q || typeof q !== 'object') return 'not an object';
    if (!q.q || typeof q.q !== 'string' || !q.q.trim()) return 'missing q (question text)';
    if (!q.subject || typeof q.subject !== 'string') return 'missing subject';
    if (!q.type || typeof q.type !== 'string') return 'missing type';
    if (q.type === 'mcq') {
      if (!Array.isArray(q.options) || q.options.length < 2) return 'mcq needs ≥2 options';
      if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.options.length) return 'mcq answer index out of range';
    } else if (q.type === 'tf') {
      if (typeof q.answer !== 'boolean') return 'tf answer must be true/false';
    } else if (q.type === 'fill') {
      if (!Array.isArray(q.blanks) || q.blanks.length === 0) return 'fill needs blanks[]';
    } else if (q.type === 'match') {
      if (!Array.isArray(q.pairs) || q.pairs.length === 0) return 'match needs pairs[]';
    } else if (q.type === 'short' || q.type === 'essay') {
      // open-ended types are lenient — model_answer optional
    } else {
      return `unknown type "${q.type}"`;
    }
    return null;
  };

  const importCustom = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data)) throw new Error('top-level is not an array');

        // Pre-validate all items so we can give the user a real preview
        // of how many will succeed. Reject entire import if all-invalid.
        const valid = [];
        const invalidReasons = {};
        data.forEach((q, i) => {
          const err = validateImportItem(q);
          if (err) {
            invalidReasons[err] = (invalidReasons[err] || 0) + 1;
          } else {
            valid.push(q);
          }
        });

        if (valid.length === 0) {
          alert(`Import ล้มเหลว — ทุก ${data.length} ข้อมีข้อมูลไม่ครบ:\n\n` +
            Object.entries(invalidReasons).map(([r, n]) => `• ${n} ข้อ: ${r}`).join('\n'));
          e.target.value = ''; // reset so same file can be re-tried
          return;
        }

        const skipped = data.length - valid.length;
        const summary = skipped === 0
          ? `Import ${valid.length} ข้อ`
          : `Import ${valid.length}/${data.length} ข้อ (ข้าม ${skipped} ข้อที่ไม่ครบ)\n\nสาเหตุที่ข้าม:\n` +
            Object.entries(invalidReasons).map(([r, n]) => `• ${n} ข้อ: ${r}`).join('\n');

        if (confirm(`${summary}\n\nยืนยัน?`)) {
          const allIds = new Set([...customQuestions.map((q) => q.id), ...QB.map((q) => q.id)]);
          let nextId = Math.max(500, ...allIds);
          // Always reassign IDs so importing the same file twice doesn't
          // duplicate IDs (was a silent bug — IDs collided with QB and the
          // app would render whichever came first in the array).
          const withNewIds = valid.map((q) => ({ ...q, id: ++nextId }));
          setCustomQuestions([...customQuestions, ...withNewIds]);
        }
        e.target.value = '';
      } catch (err) { alert('ไฟล์ JSON ไม่ถูกต้อง — ' + (err?.message || 'parse error')); }
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
            <label>วิชา</label>
            <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}>
              {SUBJECTS.filter((s) => s.id !== 'all').map((s) => (
                <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
              ))}
            </select>
          </div>

          <div className="vmx-form-group">
            <label>ชนิด</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
              <option value="mcq">Multiple Choice</option>
              <option value="tf">True / False</option>
              <option value="fill">Fill in the Blank</option>
              <option value="match">Matching</option>
            </select>
          </div>

          <div className="vmx-form-group">
            <label>Tags (คั่นด้วย comma)</label>
            <input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="e.g. ortho, plate, fracture" />
          </div>

          <div className="vmx-form-group">
            <label>คำถาม</label>
            <textarea value={formData.q} onChange={(e) => setFormData({ ...formData, q: e.target.value })} />
          </div>

          <div className="vmx-form-group">
            <label>รูปภาพ (URL - optional)</label>
            <input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://... หรือ data:image/..." />
          </div>

          {formData.type === 'mcq' && (
            <div className="vmx-form-group">
              <label>ตัวเลือก (เลือก radio ที่ถูก)</label>
              {formData.options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                  <input type="radio" name="answer" checked={formData.answer == i} onChange={() => setFormData({ ...formData, answer: i })} />
                  <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, minWidth: 20 }}>{String.fromCharCode(65 + i)}.</span>
                  <input value={opt} onChange={(e) => { const opts = [...formData.options]; opts[i] = e.target.value; setFormData({ ...formData, options: opts }); }} />
                </div>
              ))}
            </div>
          )}

          {formData.type === 'tf' && (
            <div className="vmx-form-group">
              <label>คำตอบ</label>
              <select value={formData.answer === true ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, answer: e.target.value === 'true' })}>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          )}

          {formData.type === 'fill' && (
            <div className="vmx-form-group">
              <label>คำตอบแต่ละช่อง (ใส่ ____ ในคำถามตรงตำแหน่งที่ต้องการให้เติม)</label>
              {formData.blanks.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <span style={{ minWidth: 70, fontSize: 12, alignSelf: 'center' }}>ช่องที่ {i + 1}</span>
                  <input value={b} onChange={(e) => { const bs = [...formData.blanks]; bs[i] = e.target.value; setFormData({ ...formData, blanks: bs }); }} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setFormData({ ...formData, blanks: [...formData.blanks, ''] })}>+ ช่อง</button>
                {formData.blanks.length > 1 && (
                  <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setFormData({ ...formData, blanks: formData.blanks.slice(0, -1) })}>− ช่อง</button>
                )}
              </div>
            </div>
          )}

          {formData.type === 'match' && (
            <div className="vmx-form-group">
              <label>คู่ matching (ซ้าย ↔ ขวา)</label>
              {formData.pairs.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <input style={{ flex: 1 }} value={p.left} placeholder="ซ้าย" onChange={(e) => { const ps = [...formData.pairs]; ps[i] = { ...ps[i], left: e.target.value }; setFormData({ ...formData, pairs: ps }); }} />
                  <span style={{ alignSelf: 'center' }}>↔</span>
                  <input style={{ flex: 1 }} value={p.right} placeholder="ขวา" onChange={(e) => { const ps = [...formData.pairs]; ps[i] = { ...ps[i], right: e.target.value }; setFormData({ ...formData, pairs: ps }); }} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setFormData({ ...formData, pairs: [...formData.pairs, { left: '', right: '' }] })}>+ คู่</button>
                {formData.pairs.length > 1 && (
                  <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setFormData({ ...formData, pairs: formData.pairs.slice(0, -1) })}>− คู่</button>
                )}
              </div>
            </div>
          )}

          <div className="vmx-form-group">
            <label>คำอธิบาย (Why)</label>
            <textarea value={formData.explain} onChange={(e) => setFormData({ ...formData, explain: e.target.value })} placeholder="เพราะเซลล์ไตจะ..." />
          </div>
        </div>

        <div className="vmx-btn-row">
          <button className="vmx-btn vmx-btn-ghost" onClick={() => setShowForm(false)}>← ยกเลิก</button>
          <button className="vmx-btn vmx-btn-primary" onClick={save}>💾 บันทึก</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="vmx-hero">
        <h1>Question <em>Manager</em></h1>
        <p>เพิ่ม แก้ไข หรือ import ข้อสอบของตัวเอง · มี {customQuestions.length} ข้อ custom</p>
      </div>

      <div className="vmx-btn-row" style={{ marginBottom: 24, justifyContent: 'flex-start' }}>
        <button className="vmx-btn vmx-btn-primary" onClick={startAdd}>➕ เพิ่มข้อสอบ</button>
        <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={exportCustom}>📥 Export JSON</button>
        <label className="vmx-btn vmx-btn-ghost vmx-btn-sm" style={{ cursor: 'pointer' }}>
          📤 Import JSON
          <input type="file" accept=".json" onChange={importCustom} style={{ display: 'none' }} />
        </label>
      </div>

      {customQuestions.length === 0 ? (
        <div className="vmx-empty">ยังไม่มีข้อสอบ custom — กด "เพิ่มข้อสอบ" เพื่อสร้าง</div>
      ) : (
        <div>
          {customQuestions.map((q) => (
            <div key={q.id} className="vmx-review-item">
              <div className="vmx-review-head">
                <span>#{q.id} · {SUBJECTS.find((s) => s.id === q.subject)?.name || q.subject} · {q.type.toUpperCase()}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => startEdit(q)}>✏️ แก้</button>
                  <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => deleteQ(q.id)}>🗑</button>
                </div>
              </div>
              <div className="vmx-review-q">{q.q}</div>
              {q.tags && q.tags.length > 0 && (
                <div>{q.tags.map((t) => <span key={t} className="vmx-tag-pill">#{t}</span>)}</div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="vmx-btn-row">
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← กลับหน้าแรก</button>
      </div>
    </>
  );
}
