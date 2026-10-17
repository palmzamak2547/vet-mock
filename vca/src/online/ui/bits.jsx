// Small pieces the community pages share: the report sheet, the "sign in to join" prompt, the
// coming-soon state, and a post's chips.

import { useState } from 'react';
import { Sheet } from '../../components/Sheet.jsx';
import { Icon } from '../../components/Icon.jsx';
import { Seg } from '../../components/bits.jsx';
import { CARD_BY_ID } from '../../lib/bank.js';
import { plateNo } from '../../lib/format.js';
import { KIND_LABEL, REPORT_REASONS } from '../shapes.js';
import { getBackend, useAccount } from '../account.js';
import { askJoin } from './AccountButton.jsx';
import '../community.css';

/** Report a post, comment or message. Three reports from different people hide it for review. */
export function ReportSheet({ target, id, onClose }) {
  const [reason, setReason] = useState('spam');
  const [note, setNote] = useState('');
  const [state, setState] = useState('idle');
  const send = async () => {
    setState('busy');
    try {
      const b = await getBackend();
      await b.board.report(target, id, reason, note.trim());
      setState('done');
    } catch {
      setState('error');
    }
  };
  return (
    <Sheet open onClose={onClose} title="รายงาน">
      {state === 'done' ? (
        <div className="report-done" role="status">
          <Icon name="check" size={22} />
          <p>ได้รับรายงานแล้ว ขอบคุณที่ช่วยดูแลชุมชน ถ้ามีคนรายงานเรื่องเดียวกันหลายคน ระบบจะซ่อนไว้ระหว่างรอผู้ดูแลตรวจ</p>
          <button type="button" className="btn btn-ink btn-sm" onClick={onClose} data-autofocus>ปิด</button>
        </div>
      ) : (
        <>
          <fieldset className="report-reasons">
            <legend className="sr">เหตุผล</legend>
            {REPORT_REASONS.map((r) => (
              <label key={r.id} className={`report-reason${reason === r.id ? ' on' : ''}`}>
                <input type="radio" name="reason" value={r.id} checked={reason === r.id} onChange={() => setReason(r.id)} />
                {r.label}
              </label>
            ))}
          </fieldset>
          <label className="form-row">
            <span className="form-label">รายละเอียดเพิ่มเติม</span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} rows={2} placeholder="ไม่ใส่ก็ได้" />
          </label>
          {state === 'error' && <p className="form-error" role="alert">ส่งรายงานไม่สำเร็จ ลองอีกครั้ง</p>}
          <button type="button" className="btn btn-ink btn-block" onClick={send} disabled={state === 'busy'} data-autofocus>
            {state === 'busy' ? <span className="spinner" aria-hidden="true" /> : <Icon name="flag" size={18} />}ส่งรายงาน
          </button>
        </>
      )}
    </Sheet>
  );
}

/** What a reader who cannot join yet sees instead of a composer. */
export function JoinPrompt({ what = 'ร่วมพูดคุย' }) {
  const account = useAccount();
  // Still finding out who this is: say nothing rather than ask a signed-in student to sign in.
  if (account.status === 'idle' || account.status === 'loading') return null;
  if (account.status === 'in' && account.profile) return null;
  const needsProfile = account.status === 'in' && !account.profile;
  return (
    <div className="join">
      <Icon name={needsProfile ? 'user' : 'users'} size={20} />
      <p>{needsProfile ? `ตั้งโปรไฟล์ก่อน แล้ว${what}ได้เลย` : `เข้าสู่ระบบด้วยบัญชี VetMock เพื่อ${what}`}</p>
      <button type="button" className="btn btn-ink btn-sm" onClick={askJoin}>
        {needsProfile ? 'ตั้งโปรไฟล์' : 'เข้าสู่ระบบ'}
      </button>
    </div>
  );
}

/** The community in a production build that has no backend yet. */
export function Soon() {
  return (
    <div className="wrap soon">
      <p className="kicker">The commons</p>
      <h1 className="page-h">ชุมชน VCA กำลังจะเปิด</h1>
      <p className="page-p">กระดานถามข้อสอบ โปรไฟล์ และแชทกับเพื่อนที่สอบรอบเดียวกัน ระหว่างนี้ฝึกได้ทุกอย่างเหมือนเดิม</p>
    </div>
  );
}

export function PostChips({ post }) {
  const card = post.domain ? CARD_BY_ID[post.domain] : null;
  return (
    <span className="pchips">
      <span className={`pchip pchip-${post.kind}`}>{KIND_LABEL[post.kind] || post.kind}</span>
      {card && <span className="pchip pchip-domain"><span className="drow-pl">{plateNo(card.plate)}</span>{card.th}</span>}
      {post.questionNo && <span className="pchip pchip-no">No. {post.questionNo}</span>}
    </span>
  );
}

/** Kind filter for the board, shared by the feed and the composer. */
export function KindSeg({ value, onChange, withAll = false, name = 'kind' }) {
  const options = [...(withAll ? [{ value: '', label: 'ทั้งหมด' }] : []), ...Object.entries(KIND_LABEL).map(([value, label]) => ({ value, label }))];
  return <Seg name={name} label="ประเภท" value={value} onChange={onChange} options={options} />;
}
