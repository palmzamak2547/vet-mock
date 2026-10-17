// The VCA documents: past papers and tutor handouts gathered by several cohorts, shelved by field.
// Reading a file happens in the VetMock library, which checks the reader's sign-in; this page is
// the catalogue, so every row opens the document there.

import { useEffect, useMemo, useState } from 'react';
import { Link } from '../components/Link.jsx';
import { Icon } from '../components/Icon.jsx';
import { useAsync, useTitle } from '../lib/hooks.js';
import { BANK, CARD_BY_ID } from '../lib/bank.js';
import { searchDocs } from '../lib/search.js';
import { navigate, withQuery } from '../router.js';
import { num, yearRange } from '../lib/format.js';

const SHELF_SHOWN = 6;
const loadLibrary = () => import('../generated/library.js').then((m) => m.LIBRARY);
const readerUrl = (title) => `https://vetmock.com/app/library?${new URLSearchParams({ subject: 'vca', q: title })}`;

export default function Library({ route }) {
  useTitle('เอกสาร VCA');
  const lib = useAsync(loadLibrary, 'library');
  const [query, setQuery] = useState(route.query.get('q') || '');
  const [kind, setKind] = useState(() => (['paper', 'handout'].includes(route.query.get('kind')) ? route.query.get('kind') : 'all'));
  const [family, setFamily] = useState('all');
  const [openShelves, setOpenShelves] = useState(() => new Set());
  const focusShelf = route.query.get('shelf');

  useEffect(() => {
    const t = setTimeout(() => navigate(withQuery('/library', { q: query.trim(), kind: kind === 'all' ? null : kind, shelf: focusShelf }), { replace: true }), 350);
    return () => clearTimeout(t);
  }, [query, kind, focusShelf]);

  // Arriving from a shelf chip scrolls that shelf into view once the catalogue is in.
  useEffect(() => {
    if (lib.status !== 'ready' || !focusShelf) return;
    requestAnimationFrame(() => document.getElementById(`shelf-${focusShelf}`)?.scrollIntoView({ block: 'start' }));
  }, [lib.status, focusShelf]);

  const view = useMemo(() => {
    if (lib.status !== 'ready') return [];
    const L = lib.value;
    const names = Object.fromEntries(L.shelves.map((s) => [s.id, `${s.th} ${s.en}`]));
    let docs = L.docs.map((d) => ({ ...d, shelfName: names[d.shelf] }));
    if (kind !== 'all') docs = docs.filter((d) => d.kind === kind);
    docs = searchDocs(docs, query);
    return L.shelves
      .filter((s) => family === 'all' || s.family === family || (family === 'general' && !s.family))
      .map((s) => ({ shelf: s, docs: docs.filter((d) => d.shelf === s.id) }))
      .filter((g) => g.docs.length);
  }, [lib, kind, query, family]);
  const shownDocs = view.reduce((n, g) => n + g.docs.length, 0);
  const summary = BANK.library;

  return (
    <div className="wrap library">
      <header className="page-head">
        <p className="kicker">The archive</p>
        <h1 className="page-h">เอกสาร VCA</h1>
        <p className="page-p">ข้อสอบเก่าและเอกสารติว {num(summary.documents)} ชุด {num(summary.pages)} หน้า ที่รุ่นพี่หลายรุ่นรวบรวมไว้ เรียงตามสาขา กดชื่อเอกสารเพื่อเปิดอ่านในคลังเอกสาร VetMock</p>
      </header>

      <div className="lib-stats">
        <div><b>{num(summary.papers)}</b><span>ชุดข้อสอบเก่า</span></div>
        <div><b>{num(summary.handouts)}</b><span>เอกสารติว</span></div>
        <div><b>{num(summary.pages)}</b><span>หน้า PDF</span></div>
        <p className="lib-note"><Icon name="info" size={18} />เอกสารเปิดในคลังเอกสาร VetMock บางไฟล์ต้องเข้าสู่ระบบก่อน เป็นบันทึกของรุ่นพี่สำหรับทบทวน ไม่ใช่ประกาศขอบเขตการสอบ</p>
      </div>

      <div className="bank-tools glass">
        <label className="search">
          <Icon name="search" />
          <span className="sr">ค้นหาเอกสาร</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="เช่น Swine, Juris, 2567" autoComplete="off" enterKeyHint="search" />
        </label>
        <div className="bank-filters">
          {[['all', 'ทุกประเภท'], ['paper', 'ข้อสอบเก่า'], ['handout', 'เอกสารติว']].map(([v, th]) => (
            <button key={v} type="button" className="chip" aria-pressed={kind === v} onClick={() => setKind(v)}>{th}</button>
          ))}
          <label className="select">
            <span className="sr">กลุ่มสาขา</span>
            <select value={family} onChange={(e) => setFamily(e.target.value)}>
              <option value="all">ทุกกลุ่มสาขา</option>
              {BANK.families.map((f) => <option key={f.id} value={f.id}>{f.numeral}  {f.th}</option>)}
              <option value="general">ข้อสอบรวมและข้อมูลการสอบ</option>
            </select>
            <Icon name="chevronDown" size={18} />
          </label>
        </div>
      </div>

      {lib.status === 'loading' && <p className="bank-status" role="status"><span className="spinner" aria-hidden="true" />กำลังเปิดชั้นเอกสาร…</p>}
      {lib.status === 'error' && <p className="notice notice-error"><Icon name="info" />เปิดชั้นเอกสารไม่สำเร็จ <button type="button" className="text-link" onClick={lib.retry}>ลองอีกครั้ง</button></p>}
      {lib.status === 'ready' && (
        <>
          <p className="bank-status" role="status">{num(shownDocs)} ชุด ใน {num(view.length)} ชั้น</p>
          {view.length === 0 && <div className="empty"><h2>ไม่พบเอกสาร</h2><p>ลองคำค้นที่สั้นลง หรือเลือกทุกประเภท</p></div>}
          <div className="shelves">
            {view.map(({ shelf, docs }) => {
              const domain = shelf.domain && CARD_BY_ID[shelf.domain];
              // Six to a shelf until asked; a search or the shelf you came for shows all.
              const whole = openShelves.has(shelf.id) || query.trim() || shelf.id === focusShelf || docs.length <= SHELF_SHOWN + 1;
              const shown = whole ? docs : docs.slice(0, SHELF_SHOWN);
              return (
                <section key={shelf.id} id={`shelf-${shelf.id}`} className={`shelf${shelf.id === focusShelf ? ' is-focus' : ''}`} aria-labelledby={`sh-${shelf.id}`} data-reveal>
                  <div className="shelf-head">
                    <h2 id={`sh-${shelf.id}`} className="shelf-h">{shelf.th}<span className="shelf-en">{shelf.en}</span></h2>
                    <span className="shelf-n">{docs.length} ชุด</span>
                    {domain && <Link to={`/d/${domain.id}`} className="text-link shelf-go">ฝึกหมวด{domain.th} <Icon name="arrowRight" size={16} /></Link>}
                  </div>
                  <ul className="docs" id={`docs-${shelf.id}`}>
                    {shown.map((d) => (
                      <li key={d.id}>
                        <a className="doc" href={readerUrl(d.title)} target="_blank" rel="noopener noreferrer">
                          <span className={`doc-kind doc-${d.kind}`}>{d.kind === 'paper' ? 'ข้อสอบเก่า' : 'เอกสารติว'}</span>
                          <span className="doc-title">{d.title}</span>
                          <span className="doc-meta">
                            {d.years && <span>{yearRange(d.years)}</span>}
                            {d.pages && <span>{num(d.pages)} หน้า</span>}
                            {d.formats.map((f) => <span key={f} className="doc-fmt">{f}</span>)}
                            {d.files > 1 && <span>{d.files} ไฟล์</span>}
                          </span>
                          <Icon name="arrowUpRight" size={18} className="doc-go" />
                        </a>
                      </li>
                    ))}
                  </ul>
                  {!whole && (
                    <button type="button" className="shelf-more" aria-controls={`docs-${shelf.id}`} onClick={() => setOpenShelves((x) => new Set(x).add(shelf.id))}>
                      ดูอีก {docs.length - SHELF_SHOWN} ชุดในชั้นนี้<Icon name="chevronDown" size={16} />
                    </button>
                  )}
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
