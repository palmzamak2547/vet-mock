// A set's questions out to the apps students revise with: Anki and Quizlet for flashcards,
// Google Sheets, Excel and Notion through CSV. The missed ones by default, or the whole set.

import { useMemo, useState } from 'react';
import { Icon } from './Icon.jsx';
import { Sheet } from './Sheet.jsx';
import { BrandTile } from './Brands.jsx';
import { Seg } from './bits.jsx';
import { copyText, exportRows, saveFile, toAnki, toCsv, toQuizlet } from '../lib/connect.js';
import { num } from '../lib/format.js';

/**
 * @param {{ open: boolean, onClose: () => void, items: Array<{ q: any, order: number[], domainName: string, missed: boolean }>, stamp: string }} props
 */
export function ExportSheet({ open, onClose, items, stamp }) {
  const missedCount = items.filter((it) => it.missed).length;
  const [scope, setScope] = useState(missedCount ? 'missed' : 'all');
  const [done, setDone] = useState(null);
  const rows = useMemo(() => exportRows(scope === 'missed' ? items.filter((it) => it.missed) : items), [items, scope]);
  const base = `vetmock-vca-${stamp}${scope === 'missed' ? '-missed' : ''}`;
  const finish = (what) => { setDone(what); setTimeout(() => setDone(null), 2600); };

  return (
    <Sheet open={open} onClose={onClose} title="ส่งออกไปทบทวนต่อ">
      {/* A choice only when the two differ: with every question missed they are the same set. */}
      {missedCount > 0 && missedCount < items.length && (
        <Seg
          name="export-scope" label="ส่งออกข้อไหน" value={scope} onChange={setScope}
          options={[{ value: 'missed', label: `ข้อที่พลาด ${num(missedCount)} ข้อ` }, { value: 'all', label: `ทั้งชุด ${num(items.length)} ข้อ` }]}
        />
      )}
      <ul className="export-list">
        <li>
          <button type="button" className="export-opt has-logo" onClick={() => { saveFile(`${base}-anki.txt`, toAnki(rows)); finish('anki'); }} data-autofocus>
            <span className="export-logo"><BrandTile name="anki" /></span>
            <span className="export-app">Anki</span>
            <span className="export-how">ไฟล์สำหรับ File แล้ว Import เป็นการ์ดคำถามคำตอบ</span>
            <Icon name={done === 'anki' ? 'check' : 'download'} />
          </button>
        </li>
        <li>
          <button type="button" className="export-opt has-logo" onClick={async () => { if (await copyText(toQuizlet(rows))) finish('quizlet'); }}>
            <span className="export-logo"><BrandTile name="quizlet" /></span>
            <span className="export-app">Quizlet</span>
            <span className="export-how">{done === 'quizlet' ? 'คัดลอกแล้ว วางในช่อง Import ของชุดใหม่ได้เลย' : 'คัดลอกข้อความไปวางในช่อง Import'}</span>
            <Icon name={done === 'quizlet' ? 'check' : 'copy'} />
          </button>
        </li>
        <li>
          <button type="button" className="export-opt has-logo" onClick={() => { saveFile(`${base}.csv`, toCsv(rows), 'text/csv;charset=utf-8'); finish('csv'); }}>
            <span className="export-logo brand-pair"><BrandTile name="googlesheets" size={21} /><BrandTile name="notion" size={21} /></span>
            <span className="export-app">Google Sheets, Excel, Notion</span>
            <span className="export-how">ไฟล์ CSV หนึ่งข้อหนึ่งแถว พร้อมเฉลยและคำอธิบาย</span>
            <Icon name={done === 'csv' ? 'check' : 'download'} />
          </button>
        </li>
      </ul>
    </Sheet>
  );
}
