// Small shared pieces: page heading, notices, chips, the verified badge, the error box and the
// status line. Status is never colour alone: every tone carries an icon and words. OWNER: workspace role.
import { translate, useT } from '../../i18n/index.js';
import Icon from './Icon.jsx';

/** @param {{ eyebrow?: string, title: string, sub?: string, right?: any, id?: string }} props */
export function PageHead({ eyebrow, title, sub, right = null, id }) {
  return (
    <div className="rs-pagehead">
      <div className="rs-pagehead-text">
        {eyebrow ? <div className="rs-eyebrow">{eyebrow}</div> : null}
        <h1 id={id} className="rs-h1" tabIndex={-1}>{title}</h1>
        {sub ? <p className="rs-sub">{sub}</p> : null}
      </div>
      {right ? <div className="rs-pagehead-right">{right}</div> : null}
    </div>
  );
}

const TONE_ICON = { info: 'info', warn: 'alert', stop: 'stop', ok: 'check' };

/** @param {{ tone?: 'info'|'warn'|'stop'|'ok', title?: string, children?: any, action?: any, role?: string }} props */
export function Notice({ tone = 'info', title, children, action = null, role }) {
  return (
    <div className={`rs-notice rs-notice--${tone}`} role={role}>
      <span className="rs-notice-icon"><Icon name={TONE_ICON[tone]} size={20} /></span>
      <div className="rs-notice-text">
        {title ? <strong className="rs-notice-title">{title}</strong> : null}
        {children ? <div>{children}</div> : null}
      </div>
      {action ? <div className="rs-notice-action">{action}</div> : null}
    </div>
  );
}

/** @param {{ tone?: ''|'gold'|'sage'|'rose', icon?: string, children: any, title?: string }} props */
export function Chip({ tone = '', icon, children, title }) {
  return (
    <span className={`rs-chip${tone ? ` rs-chip--${tone}` : ''}`} title={title}>
      {icon ? <Icon name={icon} size={15} /> : null}
      {children}
    </span>
  );
}

/** Shown only when the method is pinned by fixtures (envelope.verified or catalogue verified). */
export function VerifiedBadge({ show }) {
  const { t } = useT();
  if (!show) return null;
  return <Chip tone="sage" icon="check" title={t('ws.verified.title')}>{t('ws.verified.label')}</Chip>;
}

/** @param {{ error: { key: string, detail?: string } | null, onRetry?: () => void }} props */
export function ErrorBox({ error, onRetry }) {
  const { t } = useT();
  if (!error) return null;
  return (
    <Notice tone="stop" title={t(error.key)} role="alert" action={onRetry ? <button type="button" className="rs-btn" onClick={onRetry}>{t('ws.action.retry')}</button> : null}>
      {error.detail ? (
        <details className="rs-devdetail">
          <summary>{t('ws.error.detailSummary')}</summary>
          <code className="rs-mono">{error.detail}</code>
        </details>
      ) : null}
    </Notice>
  );
}

/** A polite busy line (no spinner animation needed to read it). */
export function Busy({ label }) {
  return (
    <p className="rs-busy" role="status">
      <span className="rs-busy-dot" aria-hidden="true" />
      {label}
    </p>
  );
}

/** Label and control stacked, the label tied to the control. */
export function Field({ label, hint, children, htmlFor }) {
  return (
    <div className="rs-field">
      <label className="rs-field-label" htmlFor={htmlFor}>{label}</label>
      {children}
      {hint ? <p className="rs-field-hint">{hint}</p> : null}
    </div>
  );
}

/** Bytes as a short size in the page language (storage and file sizes; not a statistic). */
export function formatBytes(n, lang) {
  if (!Number.isFinite(n)) return '';
  const units = ['ws.bytes.b', 'ws.bytes.kb', 'ws.bytes.mb', 'ws.bytes.gb'].map((k) => translate(lang === 'en' ? 'en' : 'th', k));
  let v = n;
  let u = 0;
  while (v >= 1024 && u < units.length - 1) { v /= 1024; u += 1; }
  const num = u === 0 ? Math.round(v).toLocaleString('en-US') : v.toFixed(v >= 100 ? 0 : 1);
  return `${num} ${units[u]}`;
}
