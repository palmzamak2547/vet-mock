import { useEffect } from 'react';

// ─── Fallback for an overlay opened by a tap ────────────────────
// The page under it stays, so there is no skeleton to draw: the bar runs,
// and a screen reader hears the label. Without it a tap whose code is still
// downloading (a lecturer's profile brings the faculty directory) looked
// like a tap that did nothing. Its own file, importing only React, so a view
// (KnowledgeView) takes it without TopLoadingBar's loader and Mochi.
export function OverlayPending({ label }) {
  useEffect(() => {
    window.dispatchEvent(new Event('vmx-loading-start'));
    return () => { window.dispatchEvent(new Event('vmx-loading-end')); };
  }, []);
  return <span className="vmx-sr-only" role="status">{label}</span>;
}

export default OverlayPending;
