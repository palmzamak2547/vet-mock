// NotebookShelf: blank notebooks, on the reader's opening screen.
//
// A new notebook is a title and a paper (each shown as a small live sheet,
// not a word), then one tap. Existing notebooks open in the same reader as a
// deck. Removing one asks first; it takes the notebook off this list, and the
// dialog says plainly that it cannot be brought back from here.
import React, { useState } from 'react';
import NavIcon from './NavIcon.jsx';
import { PAPERS, createNotebook, listNotebooks, removeNotebook } from '../lib/notebook.js';
import { confirmDialog } from '../lib/dialog.js';

const fmt = (t) => {
  try { return new Date(t).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }); } catch { return ''; }
};

export default function NotebookShelf({ onOpen }) {
  const [list, setList] = useState(() => listNotebooks());
  const [paper, setPaper] = useState('lined');
  const [title, setTitle] = useState('');
  // The notebook being crumpled away; it leaves the list when the paper has.
  const [leaving, setLeaving] = useState(null);
  const [said, setSaid] = useState('');

  const create = (e) => {
    e?.preventDefault?.();
    const nb = createNotebook({ title, paper, pages: 4 });
    setList(listNotebooks());
    setTitle('');
    onOpen(nb);
  };

  const remove = async (nb) => {
    const ok = await confirmDialog({
      title: `ลบสมุด “${nb.title}”?`,
      body: 'สมุดและรอยที่เขียนไว้ในสมุดเล่มนี้จะหายจากรายการนี้ และกู้คืนไม่ได้',
      confirmLabel: 'ลบสมุด',
      tone: 'danger',
    });
    if (!ok) return;
    removeNotebook(nb.id);
    setLeaving(nb.id);
    setSaid(`ลบสมุด ${nb.title} แล้ว`);
    const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => { setLeaving(null); setList(listNotebooks()); }, reduced ? 160 : 520);
  };

  return (
    <section className="vmx-nb" aria-labelledby="vmx-nb-title">
      <h2 id="vmx-nb-title" className="vmx-nb-title">สมุดเปล่า</h2>
      <p className="vmx-nb-lead">เขียนโน้ต วาดแผนภาพ หรือทบทวนจากความจำ โดยไม่ต้องมีไฟล์ PDF</p>
      <form className="vmx-nb-new" onSubmit={create}>
        <div className="vmx-nb-papers" role="radiogroup" aria-label="แบบกระดาษ">
          {PAPERS.map((p) => (
            <button key={p.id} type="button" role="radio" aria-checked={paper === p.id}
              className={`vmx-nb-paper${paper === p.id ? ' is-on' : ''}`} onClick={() => setPaper(p.id)}>
              <span className={`vmx-nb-sheet is-${p.id}`} aria-hidden="true" />
              <span>{p.label}</span>
            </button>
          ))}
        </div>
        <div className="vmx-nb-row">
          <label className="vmx-sr-only" htmlFor="vmx-nb-name">ชื่อสมุด</label>
          <input id="vmx-nb-name" className="vmx-nb-name" value={title} maxLength={80}
            onChange={(e) => setTitle(e.target.value)} placeholder="ชื่อสมุด เช่น Physio สรุปบท 3" />
          <button type="submit" className="vmx-btn vmx-btn-primary">สร้างสมุด</button>
        </div>
      </form>
      <p className="vmx-sr-only" role="status">{said}</p>
      {list.length > 0 && (
        <ul className="vmx-nb-list" aria-label="สมุดของฉัน">
          {list.map((nb) => (
            <li key={nb.id} className={leaving === nb.id ? 'is-crumpling' : undefined}>
              <button type="button" className="vmx-nb-open" onClick={() => onOpen(nb)}>
                <span className={`vmx-nb-sheet is-${nb.paper}`} aria-hidden="true" />
                <span className="vmx-nb-meta">
                  <b>{nb.title}</b>
                  <span>{nb.pages} หน้า, เปิดล่าสุด {fmt(nb.updatedAt)}</span>
                </span>
              </button>
              <button type="button" className="vmx-nb-del" onClick={() => remove(nb)} aria-label={`ลบสมุด ${nb.title}`} title="ลบสมุด">
                <NavIcon name="trash" size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
