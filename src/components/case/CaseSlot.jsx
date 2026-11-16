import { useState, useEffect } from 'react';
import { importFresh } from '../../lib/chunk-error.js';

// ============================================================
// CaseSlot — where a card's case goes until the case pane has loaded
// ============================================================
// The case pane (a case, or a reading passage) is a chunk of its own, fetched
// the first time a card has a passage: most cards have none, so it is in
// neither the exam's first load nor what Home warms up. Every card that shows
// a case reaches the pane through this slot only. A second static importer
// would make the pane's chunk a shared one whose exports carry short names,
// and the retry below (importFresh, which asks for the file itself under a
// fresh address) would then find no `default` in it.
//
// While the pane loads, its title stands where the pane will be, with a line
// saying so; a failed load says so in the same place, with a button that
// tries again. One import for the page; a failed one is dropped.
// ============================================================

let paneLoad = null;
let PaneLoaded = null;
function loadPane() {
  if (!paneLoad) {
    paneLoad = importFresh(() => import('./CasePane.jsx'))
      .then((m) => {
        if (typeof m.default !== 'function') throw new Error('CasePane: the loaded file has no default export');
        PaneLoaded = m.default;
        return PaneLoaded;
      })
      .catch((err) => { paneLoad = null; throw err; });
  }
  return paneLoad;
}

export default function CaseSlot(props) {
  const [Pane, setPane] = useState(() => PaneLoaded);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (Pane) return undefined;
    let live = true;
    loadPane()
      .then((C) => { if (live) { setFailed(false); setPane(() => C); } })
      .catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [Pane, attempt]);
  if (Pane) return <Pane {...props} />;
  return (
    <div className="vmx-case-pane">
      <div className="vmx-case-top">
        <div className="vmx-case-head">
          <span className="vmx-case-title">{props.title || 'Reading Passage'}</span>
        </div>
        {failed ? (
          <p className="vmx-case-note" role="alert">
            โหลดเคสไม่สำเร็จ{' '}
            <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { setFailed(false); setAttempt((n) => n + 1); }}>ลองอีกครั้ง</button>
          </p>
        ) : (
          <p className="vmx-case-note" role="status">กำลังโหลดเคส…</p>
        )}
      </div>
    </div>
  );
}
