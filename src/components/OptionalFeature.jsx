import { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary.jsx';
import { alertDialog } from '../lib/dialog.js';

// Optional overlays sit outside the page's boundary. Their import/render
// failure must not unmount the page and discard its draft or active session.
// Background helpers omit onClose and disappear quietly if they fail.
// `pending` is what shows while the feature's code downloads: nothing by
// default, since most are warm by the time they open.
export default function OptionalFeature({ children, label, onClose, pending = null }) {
  const failed = () => {
    if (!onClose) return;
    onClose();
    void alertDialog({
      title: `เปิด${label}ไม่สำเร็จ`,
      body: 'ตรวจการเชื่อมต่อแล้วลองเปิดอีกครั้ง หากยังไม่ได้ ให้บันทึกงานก่อนโหลดหน้านี้ใหม่',
      confirmLabel: 'ปิด',
    });
  };
  return (
    <ErrorBoundary fallback={null} onError={failed}>
      <Suspense fallback={pending}>{children}</Suspense>
    </ErrorBoundary>
  );
}
