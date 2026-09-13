import Mochi from './Mochi.jsx';
import MotionLoader from './MotionLoader.jsx';
import { MotionButton, MotionEnter } from './MotionFeedback.jsx';
import { LOADING_ART } from '../data/art.js';

// `art` (an entry from EMPTY_ART) replaces the mascot on a first-run empty
// panel. Only on `kind="empty"`: an illustration of an empty shelf beside an
// error message would be telling the user the wrong thing.
export default function StatePanel({
  kind = 'empty',
  title,
  body,
  art = null,
  actionLabel,
  onAction,
  busy = false,
}) {
  const isError = kind === 'error';
  const isLoading = kind === 'loading';
  return (
    <MotionEnter
      effect={isError ? 'retry' : 'reveal'}
      className={`vmx-state-panel vmx-state-panel--${kind}`}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      aria-busy={isLoading || busy ? 'true' : undefined}
    >
      {isLoading ? (
        // __mochi is what makes the icon slot 56px and transparent; without
        // it the box snaps back to the 38px grey chip and a 64px picture sits
        // on top of it.
        <div className="vmx-state-panel__icon vmx-state-panel__mochi" aria-hidden="true">
          <img
            className="vmx-state-panel__loader-art"
            src={LOADING_ART.book.src}
            alt=""
            width={400}
            height={400}
            decoding="async"
          />
          <MotionLoader label={title || 'กำลังโหลด'} />
        </div>
      ) : art && !isError ? (
        <img
          className="vmx-state-panel__art"
          src={art.src}
          alt={art.alt || ''}
          width={640}
          height={480}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="vmx-state-panel__icon vmx-state-panel__mochi" aria-hidden="true">
          <Mochi state={isLoading ? 'loading' : isError ? 'encourage' : 'curious'} size={56} slot="status" animate={isLoading} fallback={isLoading ? '•••' : isError ? '!' : '—'} />
          {(isLoading || busy) && <MotionLoader label={title || 'กำลังโหลด'} />}
        </div>
      )}
      {title && <div className="vmx-state-panel__title">{title}</div>}
      {body && <div className="vmx-state-panel__body">{body}</div>}
      {actionLabel && onAction && (
        <MotionButton
          type="button"
          className="vmx-btn vmx-btn-ghost vmx-btn-sm"
          onClick={onAction}
          disabled={busy}
        >
          {busy ? 'กำลังลองใหม่…' : actionLabel}
        </MotionButton>
      )}
    </MotionEnter>
  );
}
