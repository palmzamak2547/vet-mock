// ============================================================
// BoardPresenceNotice — "where am I on this board", said on the board
// ============================================================
// A student who chose not to appear used to see a board with no sign of the
// choice, and one outside the rows never learnt why. This line says which it
// is (boardStanding in lib/public-identity.js) and where to change it.
// ============================================================

import { boardStanding } from '../lib/public-identity.js';
import { LEADERBOARD_MIN_QUESTIONS } from '../lib/leaderboard-gate.js';
import '../styles-profile.css';

export default function BoardPresenceNotice({ user, rows, scope = 'global', onEdit = null }) {
  const standing = boardStanding(user, rows);
  if (!standing) return null;
  const where = scope === 'group' ? 'อันดับของกลุ่มนี้' : 'กระดานนี้';
  let text;
  if (standing.kind === 'hidden') {
    text = `คุณเลือกไม่แสดงบนกระดาน จึงไม่มีชื่อคุณใน${where} และเพื่อนไม่เห็นคะแนนของคุณ`;
  } else if (standing.kind === 'ranked') {
    text = `คุณอยู่อันดับ ${standing.rank} จาก ${standing.of} คนใน${where}`;
  } else {
    text = standing.capped
      ? `ยังไม่มีชื่อคุณใน ${standing.of} อันดับแรกของ${where}`
      : `ยังไม่มีชื่อคุณใน${where} ชุดที่ระบบตรวจและมีอย่างน้อย ${LEADERBOARD_MIN_QUESTIONS} ข้อจะขึ้นกระดาน`;
  }
  return (
    <div className={`vmx-board-me is-${standing.kind}`} role="status" data-testid="board-presence">
      <span>{text}</span>
      {standing.kind === 'hidden' && onEdit && (
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={onEdit}>เปลี่ยนที่โปรไฟล์</button>
      )}
    </div>
  );
}
