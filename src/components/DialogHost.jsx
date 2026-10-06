// ============================================================
// DialogHost — the single mounted dialog that lib/dialog.js drives
// ============================================================
// Mounted for the current view/account at the App root. Callers use confirmDialog() /
// promptDialog()/alertDialog(), so no view has to carry open/close
// state for a one-off confirmation.
//
// One request at a time: a second open() while one is showing resolves the
// first as cancelled, which matches how the native dialog behaved (you
// could never have two).
// ============================================================

import { useEffect, useState, useRef } from 'react';
import ConfirmDialog from './ConfirmDialog.jsx';
import { registerDialogHost } from '../lib/dialog.js';

const cancelValue = (req) => req.mode === 'alert' ? true : (req.mode === 'prompt' ? null : false);

export default function DialogHost({ scope, owner } = {}) {
  const [req, setReq] = useState(null);
  const reqRef = useRef(null);
  useEffect(() => {
    setReq(null);
    const unregister = registerDialogHost((next) => {
      const prev = reqRef.current;
      reqRef.current = next;
      if (prev) prev.resolve(cancelValue(prev));
      setReq(next);
    });
    return () => {
      unregister();
      const pending = reqRef.current;
      reqRef.current = null;
      if (pending) pending.resolve(cancelValue(pending));
    };
  }, [owner]);

  useEffect(() => {
    const pending = reqRef.current;
    // Notices can explain a navigation result; decisions belong to their page.
    if (!pending || pending.mode === 'alert') return;
    reqRef.current = null;
    setReq(null);
    pending.resolve(cancelValue(pending));
  }, [scope]);

  if (!req) return null;

  const settle = (value) => {
    if (reqRef.current !== req) return;
    reqRef.current = null;
    setReq(null);
    req.resolve(value);
  };

  // Cancelling means different things per mode: a notice resolves (it was
  // only ever "ok"), a confirm is a no, and a prompt returns null so callers
  // can keep the null check they wrote against window.prompt().
  return (
    <ConfirmDialog
      open
      title={req.title}
      body={req.body}
      note={req.note}
      confirmLabel={req.confirmLabel}
      cancelLabel={req.cancelLabel}
      tone={req.tone}
      hideCancel={req.mode === 'alert'}
      input={req.input || null}
      onConfirm={(value) => settle(req.mode === 'prompt' ? value : true)}
      onCancel={() => settle(cancelValue(req))}
    />
  );
}
