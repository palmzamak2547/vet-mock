// ============================================================
// LadderStrip — the three rungs of practice, drawn once for every screen
// ============================================================
// The config screen draws it as a control (one tap applies a rung's preset);
// the results screen draws it as a map (the rung just climbed, the one that
// comes next). Same anatomy either way, so a student learns it once.
// Rung order and names come from lib/practice-ladder.js, never from here.
// ============================================================
import { LADDER_STEPS } from '../lib/practice-ladder.js';

export default function LadderStrip({
  active = null,          // the rung the current settings are on (config)
  onPick = null,          // when given, each rung is a button
  done = null,            // the rung a finished set ran on (results)
  doneLabel = '',         // what to print on that rung, e.g. "ได้ 80%"
  next = null,            // the rung the results screen recommends
  labelledBy,
  className = '',
}) {
  const interactive = typeof onPick === 'function';
  return (
    <div className={`vmx-ladder${className ? ` ${className}` : ''}`} role="group" aria-labelledby={labelledBy}>
      {LADDER_STEPS.map((step) => {
        const isActive = step.id === active;
        const isDone = step.id === done;
        const isNext = step.id === next && !isDone;
        const cls = `vmx-ladder-step${isActive ? ' is-active' : ''}${isDone ? ' is-done' : ''}${isNext ? ' is-next' : ''}`;
        const body = (
          <>
            <span className="vmx-ladder-n" aria-hidden="true">{step.n}</span>
            <span className="vmx-ladder-text">
              <span className="vmx-ladder-label">{step.label}</span>
              {isDone && doneLabel && <span className="vmx-ladder-tag">{doneLabel}</span>}
              {isNext && <span className="vmx-ladder-tag is-next">ขั้นต่อไป</span>}
            </span>
          </>
        );
        if (interactive) {
          return (
            <button
              key={step.id}
              type="button"
              className={cls}
              aria-pressed={isActive}
              aria-label={`ขั้น ${step.n} ${step.label}`}
              onClick={() => onPick(step.id)}
            >
              {body}
            </button>
          );
        }
        return (
          <div key={step.id} className={cls} aria-label={`ขั้น ${step.n} ${step.label}${isDone ? ', ทำแล้ว' : ''}${isNext ? ', ขั้นต่อไป' : ''}`}>
            {body}
          </div>
        );
      })}
    </div>
  );
}
