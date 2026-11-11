import { Suspense, useState } from 'react';
import ErrorBoundary from './ErrorBoundary.jsx';
import { alertDialog } from '../lib/dialog.js';

// Optional overlays sit outside the page's boundary. Their import/render
// failure must not unmount the page and discard its draft or active session.
// Background helpers omit onClose and disappear quietly if they fail.
// `pending` is what shows while the feature's code downloads: nothing by
// default, since most are warm by the time they open. A feature a student
// opens by a tap passes one (OverlayPending at least), or the tap looks dead.
// `failed(retry)` replaces the close-and-alert with a state the feature draws
// itself, offering `retry`; `onRetry` runs first (a lazyWithRetry's .retry).
export default function OptionalFeature({ children, label, onClose, pending = null, failed = null, onRetry }) {
  const [attempt, setAttempt] = useState(0);
  const onError = () => {
    if (failed || !onClose) return;
    onClose();
    void alertDialog({
      title: `เปิด${label}ไม่สำเร็จ`,
      body: 'ตรวจการเชื่อมต่อแล้วลองเปิดอีกครั้ง หากยังไม่ได้ ให้บันทึกงานก่อนโหลดหน้านี้ใหม่',
      confirmLabel: 'ปิด',
    });
  };
  const retry = () => {
    onRetry?.();
    setAttempt((n) => n + 1);
  };
  return (
    <ErrorBoundary key={attempt} fallback={failed ? failed(retry) : null} onError={onError}>
      <Suspense fallback={pending}>{children}</Suspense>
    </ErrorBoundary>
  );
}
