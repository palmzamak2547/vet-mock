// ============================================================
// PrivateNotes — the shelf only the admin account can open
// ============================================================
// Anything under src/data/ ships inside the public JavaScript bundle, so a
// document that exactly one person may read cannot live there: hiding the
// route would hide the link, not the bytes. These notes live in Postgres in
// private_notes, a table with RLS on and no policy at all, reachable only
// through SECURITY DEFINER functions whose first line asks is_admin(). A
// signed-in student calling them by hand gets 42501 and no rows.
//
// A note arrives by the admin picking a file off their own disk. The browser
// splits it into parts and writes each one through admin_private_note_put
// under their own session, so a large document never has to travel any other
// way, and rebuilding it locally is one click to re-import.
// ============================================================
import { useEffect, useMemo, useState } from 'react';
import { adminRpc } from '../lib/admin-api.js';
import { splitKey, slugify } from '../lib/private-notes.js';

const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const fmtWhen = (iso) => {
  const d = new Date(iso || '');
  if (Number.isNaN(d.getTime())) return '—';
  return `${d.getDate()} ${TH_MONTHS[d.getMonth()]} ${String(d.getFullYear() + 543).slice(-2)}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
const TYPE_LABEL = { MULTIPLE_CHOICE: 'ปรนัย', ESSAY: 'อัตนัย', FIB: 'เติมคำ' };

function Question({ q }) {
  const keyLetter = String(q.answer ?? '').trim().toUpperCase();
  const disputed = /DISPUTED/i.test(q.note || '');
  return (
    <article className="ad-pn-q" id={`pn-q${q.n}`}>
      <div className="ad-pn-qh">
        <span className="ad-pn-n">{q.n}</span>
        <span className="ad-pn-t">{TYPE_LABEL[q.type] || q.type}</span>
        {disputed && <span className="ad-pn-flag is-bad">ยังเถียงกันอยู่</span>}
        {!disputed && q.confidence === 'low' && <span className="ad-pn-flag is-warn">มั่นใจต่ำ</span>}
      </div>
      <p className="ad-pn-stem">{q.stem}</p>
      {q.fig ? (
        <figure className="ad-pn-fig">
          <img src={q.fig} alt={`รูปประกอบข้อ ${q.n}`} loading="lazy" />
        </figure>
      ) : q.image ? <p className="ad-muted">มีรูปประกอบในข้อนี้ แต่ยังไม่ได้ฝังไฟล์</p> : null}
      {Array.isArray(q.opts) && q.opts.length ? (
        <ol className="ad-pn-opts">
          {q.opts.map(([L, text]) => (
            <li key={L} className={L === keyLetter ? 'is-key' : ''}><b>{L}</b> {text}</li>
          ))}
        </ol>
      ) : null}
      <div className="ad-pn-ans">
        <i>เฉลย</i>
        {q.type === 'MULTIPLE_CHOICE' ? <b>{q.answer}</b> : <span className="ad-pn-free">{q.answer}</span>}
      </div>
      {q.why ? <p className="ad-pn-why">{q.why}</p> : null}
      {q.src ? <p className="ad-pn-src">ที่มา {q.src}</p> : null}
      {q.textbook ? <p className="ad-pn-note is-book"><i>ตำราว่า</i> {q.textbook}</p> : null}
      {q.note ? <p className="ad-pn-note"><i>หมายเหตุ</i> {q.note}</p> : null}
    </article>
  );
}

export default function PrivateNotes() {
  const [list, setList] = useState(null);
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState(null);
  const [filter, setFilter] = useState('');

  const reload = () => adminRpc('admin_private_notes')
    .then((rows) => setList(Array.isArray(rows) ? rows : []))
    .catch((e) => { setList([]); setErr(e); });

  useEffect(() => { reload(); }, []);

  const view = async (slug) => {
    if (open?.slug === slug) { setOpen(null); return; }
    setBusy(`กำลังเปิด ${slug}`); setErr(null); setFilter('');
    try { setOpen(await adminRpc('admin_private_note', { note_slug: slug })); }
    catch (e) { setErr(e); }
    finally { setBusy(''); }
  };

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setErr(null);
    try {
      // ponytail: a re-import overwrites parts 1..N and leaves any part
      // above N behind, which only happens if the same document loses a
      // section. Delete the note and import again if that ever comes up.
      const key = JSON.parse(await file.text());
      const parts = splitKey(key);
      const slug = slugify(key.slug || key.course || file.name);
      const title = String(key.title || file.name).slice(0, 200);
      if (!slug) throw new Error('ตั้งชื่อ slug จากไฟล์นี้ไม่ได้');
      for (const p of parts) {
        setBusy(`กำลังอัปโหลด ${p.part}/${parts.length}`);
        await adminRpc('admin_private_note_put', {
          note_slug: slug, note_part: p.part, note_title: title,
          note_kind: key.kind || 'exam-key', note_payload: p.payload,
        });
      }
      setBusy('');
      await reload();
      await view(slug);
    } catch (e) { setBusy(''); setErr(e); }
  };

  const remove = async (slug) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`ลบ ${slug} ออกจากฐานข้อมูล เอากลับไม่ได้`)) return;
    setBusy(`กำลังลบ ${slug}`); setErr(null);
    try { await adminRpc('admin_private_note_delete', { note_slug: slug }); setOpen(null); await reload(); }
    catch (e) { setErr(e); }
    finally { setBusy(''); }
  };

  // The parts come back ordered, so the questions concatenate straight into
  // the paper's own order and each section keeps its heading.
  const sections = useMemo(() => (open?.parts || []).map((p) => ({
    title: p.section || `ส่วนที่ ${p.part}`,
    questions: (p.questions || []).filter((q) => {
      const f = filter.trim().toLowerCase();
      if (!f) return true;
      if (String(q.n) === f) return true;
      return `${q.stem} ${q.answer} ${q.why}`.toLowerCase().includes(f);
    }),
  })).filter((s) => s.questions.length), [open, filter]);

  const shown = sections.reduce((t, s) => t + s.questions.length, 0);
  const total = (open?.parts || []).reduce((t, p) => t + (p.questions?.length || 0), 0);

  return (
    <section id="ad-notes" className="ad-card">
      <div className="ad-card-head">
        <h2>บันทึกส่วนตัว</h2>
        <p>เก็บในฐานข้อมูลหลังการตรวจสิทธิ์ ไม่ได้อยู่ในไฟล์ที่ส่งให้เครื่องอื่น บัญชีอื่นเรียกเองก็ไม่ได้ข้อมูล</p>
      </div>

      <div className="ad-pn-bar">
        <label className="vmx-btn vmx-btn-ghost vmx-btn-sm">
          เพิ่มจากไฟล์
          <input type="file" accept="application/json,.json" onChange={onFile} hidden />
        </label>
        {busy ? <span className="ad-muted">{busy}</span> : null}
        {err ? <span className="ad-pn-err">ทำไม่สำเร็จ: {err.message}</span> : null}
      </div>

      {list === null ? <div className="ad-skeleton" style={{ width: '45%' }} /> : null}
      {list?.length === 0 ? <p className="ad-muted">ยังไม่มีบันทึก เลือกไฟล์ JSON เพื่อเพิ่ม</p> : null}

      {list?.length ? (
        <ul className="ad-pn-list">
          {list.map((row) => (
            <li key={row.slug} className={open?.slug === row.slug ? 'is-open' : ''}>
              <button type="button" onClick={() => view(row.slug)}>
                <b>{row.title}</b>
                <small>{row.parts} ส่วน · แก้ล่าสุด {fmtWhen(row.updatedAt)}</small>
              </button>
              <button type="button" className="ad-pn-del" onClick={() => remove(row.slug)} aria-label={`ลบ ${row.title}`}>ลบ</button>
            </li>
          ))}
        </ul>
      ) : null}

      {open ? (
        <div className="ad-pn-doc">
          <div className="ad-pn-tools">
            <input
              type="search" value={filter} onChange={(e) => setFilter(e.target.value)}
              placeholder="พิมพ์เลขข้อ หรือคำในโจทย์" aria-label="ค้นในบันทึก"
            />
            <span className="ad-muted">{shown === total ? `${total} ข้อ` : `${shown} จาก ${total} ข้อ`}</span>
          </div>
          {sections.map((s) => (
            <div key={s.title}>
              <h3 className="ad-pn-sec">{s.title}</h3>
              {s.questions.map((q) => <Question key={q.n} q={q} />)}
            </div>
          ))}
          {!sections.length ? <p className="ad-muted">ไม่พบข้อที่ตรงกับคำค้น</p> : null}
        </div>
      ) : null}
    </section>
  );
}
