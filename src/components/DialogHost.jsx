// ============================================================
// DialogHost — the single mounted dialog that lib/dialog.js drives
// ============================================================
// Mounted once at the App root. Everything else calls confirmDialog() /
// alertDialog() and awaits a boolean, so no view has to carry open/close
// state for a one-off confirmation.
//
// One request at a time: a second open() while one is showing resolves the
// first as cancelled, which matches how the native dialog behaved (you
// could never have two).
// ============================================================

import { useEffect, useState, useRef } from 'react';
import ConfirmDialog from './ConfirmDialog.jsx';
import { registerDialogHost } from '../lib/dialog.js';

export default function DialogHost() {
  const [req, setReq] = useState(null);
  const reqRef = useRef(null);
  reqRef.current = req;

  useEffect(() => registerDialogHost((next) => {
    const prev = reqRef.current;
    if (prev) prev.resolve(false);
    setReq(next);
  }), []);

  if (!req) return null;

  const settle = (value) => {
    setReq(null);
    req.resolve(value);
  };

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
      onConfirm={() => settle(true)}
      onCancel={() => settle(req.mode === 'alert')}
    />
  );
}
