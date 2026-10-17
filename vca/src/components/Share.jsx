// Sharing a page: a phone opens its own share sheet (LINE, Messenger, Instagram and the rest are
// all there); a desk gets LINE, Facebook and X, and the link to copy.

import { useState } from 'react';
import { Icon } from './Icon.jsx';
import { Sheet } from './Sheet.jsx';
import { canShareNatively, copyText, shareNatively, shareTargets, siteUrl } from '../lib/connect.js';

export function ShareButton({ path, title, text, label = 'แชร์', className = 'btn btn-ghost', iconSize = 18 }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = siteUrl(path);
  const onClick = async () => {
    if (canShareNatively() && await shareNatively({ title, text, url })) return;
    setCopied(false);
    setOpen(true);
  };
  return (
    <>
      <button type="button" className={className} onClick={onClick}><Icon name="share" size={iconSize} />{label}</button>
      <Sheet open={open} onClose={() => setOpen(false)} title="แชร์ให้เพื่อน">
        <p className="sheet-p">{text}</p>
        <div className="share-apps">
          {shareTargets({ url, text }).map((t) => (
            <a key={t.id} className={`share-app share-${t.id}`} href={t.href} target="_blank" rel="noopener noreferrer">
              <span className="share-mark" aria-hidden="true">{t.label.slice(0, 1)}</span>{t.label}
            </a>
          ))}
        </div>
        <div className="share-link">
          <span className="share-url">{url.replace(/^https:\/\//, '')}</span>
          <button type="button" className="btn btn-ink btn-sm" onClick={async () => setCopied(await copyText(url))} data-autofocus>
            <Icon name={copied ? 'check' : 'link'} size={18} />{copied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}
          </button>
        </div>
      </Sheet>
    </>
  );
}
