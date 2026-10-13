// ============================================================
// ShareCardSheet: a share card in its own dialog
// ============================================================
// The daily question and the score card open their image here. A click on
// the backdrop closes this sheet only: the daily question's own dialog sits
// under it, and a click that bubbled up used to close both.
// ============================================================

import { useModalFocus } from '../hooks/useModalFocus.js';
import ShareCardPanel from './ShareCardPanel.jsx';

export default function ShareCardSheet({ title, onClose, ...panel }) {
  const dialogRef = useModalFocus({ onClose });
  return (
    <div
      className="vmx-modal-overlay"
      style={{ zIndex: 1100 }}
      onClick={(e) => { e.stopPropagation(); onClose?.(); }}
    >
      <div
        ref={dialogRef}
        className="vmx-modal vmx-share-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vmx-share-title"
        tabIndex={-1}
        data-vmx-modal="true"
      >
        <div className="vmx-share-head">
          <h2 id="vmx-share-title">{title}</h2>
          <button type="button" className="vmx-btn vmx-btn-ghost" onClick={onClose}>ปิด</button>
        </div>
        <ShareCardPanel title={title} {...panel} />
      </div>
    </div>
  );
}
