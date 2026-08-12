export default function StatePanel({
  kind = 'empty',
  title,
  body,
  actionLabel,
  onAction,
  busy = false,
}) {
  const isError = kind === 'error';
  const isLoading = kind === 'loading';
  return (
    <div
      className={`vmx-state-panel vmx-state-panel--${kind}`}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      aria-busy={isLoading || busy ? 'true' : undefined}
    >
      <div className="vmx-state-panel__icon" aria-hidden="true">
        {isLoading ? '•••' : isError ? '!' : '—'}
      </div>
      {title && <div className="vmx-state-panel__title">{title}</div>}
      {body && <div className="vmx-state-panel__body">{body}</div>}
      {actionLabel && onAction && (
        <button
          type="button"
          className="vmx-btn vmx-btn-ghost vmx-btn-sm"
          onClick={onAction}
          disabled={busy}
        >
          {busy ? 'กำลังลองใหม่…' : actionLabel}
        </button>
      )}
    </div>
  );
}
