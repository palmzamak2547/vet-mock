// The workspace's first screen for someone with no project yet [M1-DESIGN.md 16, 17]: what the
// Studio does in three steps, one large drop zone (the shape the entrance's dots settle on), the
// course sample-size tool that needs no file, and what happens to data on this device. It holds no
// state of its own: the workspace passes the handlers that open the file picker and take dropped
// files (intake), and gets the drop zone element back through dropRef to aim the entrance at it.
// OWNER: landing role (design); the workspace role mounts it and wires the handlers.
import { useState } from 'react';
import { registerArea, useT } from '../i18n/index.js';
import entrance from '../i18n/entrance.js';
import { appLink } from '../landing/shell/nav.js';
import './entrance.css';

registerArea('entrance', entrance);

function Icon({ d, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={d} />
    </svg>
  );
}

const ICON = {
  upload: 'M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z M14 3v5h5 M12 17.5v-6 M9.5 14L12 11.5 14.5 14',
  lock: 'M6 11h12v9.5H6z M8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  log: 'M4 6h10 M4 11h7 M4 16h6 M17 12.5v3l2 1.2 M17 11a4.5 4.5 0 1 0 0 9a4.5 4.5 0 1 0 0-9',
  wifiOff: 'M3 3l18 18 M8.6 13.5a5 5 0 0 1 6.8 0 M5.2 10a10 10 0 0 1 3.7-2.2 M18.8 10a10 10 0 0 0-5-2.7 M12 18h.01',
  calc: 'M6.5 3h11A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3z M8.5 7h7 M8.5 11h.01 M12 11h.01 M15.5 11h.01 M8.5 14.5h.01 M12 14.5h.01 M15.5 14.5h.01 M8.5 18h.01 M12 18h3.5',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
};

/**
 * @param {{ onChooseFile: () => void, onDropFiles: (files: FileList) => void,
 *   dropRef?: import('react').Ref<HTMLDivElement>, busy?: boolean }} props
 */
export default function Welcome({ onChooseFile, onDropFiles, dropRef, busy = false }) {
  const { t } = useT();
  const [over, setOver] = useState(false);
  const steps = ['step1', 'step2', 'step3'];
  return (
    <section className="rs-welcome" aria-labelledby="rs-welcome-title">
      <div className="rs-welcome-main">
        <p className="rs-welcome-eyebrow">{t('entrance.welcome.eyebrow')}</p>
        <h1 id="rs-welcome-title" className="rs-welcome-title">{t('entrance.welcome.title')}</h1>
        <p className="rs-welcome-lead">{t('entrance.welcome.lead')}</p>
        <ol className="rs-welcome-steps">
          {steps.map((k, i) => (
            <li key={k}>
              <span className="rs-welcome-step-n rs-num" aria-hidden="true">{i + 1}</span>
              <span>
                <strong>{t(`entrance.welcome.${k}.title`)}</strong>
                <span className="rs-welcome-step-body">{t(`entrance.welcome.${k}.body`)}</span>
              </span>
            </li>
          ))}
        </ol>
        <div
          ref={dropRef}
          className={`rs-welcome-drop${over ? ' rs-welcome-drop-over' : ''}`}
          onDragEnter={(e) => { e.preventDefault(); setOver(true); }}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
          onDragLeave={(e) => { if (e.currentTarget === e.target) setOver(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            if (e.dataTransfer?.files?.length) onDropFiles(e.dataTransfer.files);
          }}
        >
          <span className="rs-welcome-drop-icon"><Icon d={ICON.upload} size={34} /></span>
          <p className="rs-welcome-drop-title">{t('entrance.drop.title')}</p>
          <p className="rs-welcome-drop-sub">{t('entrance.drop.types')}</p>
          <button type="button" className="rs-welcome-btn rs-welcome-btn-primary" onClick={onChooseFile} disabled={busy}>
            {busy ? t('entrance.drop.busy') : t('entrance.drop.choose')}
          </button>
          <p className="rs-welcome-drop-note">{t('entrance.drop.note')}</p>
        </div>
      </div>
      <aside className="rs-welcome-side">
        <a className="rs-welcome-card rs-welcome-card-link" href="/app/tools/sample-size" onClick={appLink('/app/tools/sample-size')}>
          <span className="rs-welcome-card-icon"><Icon d={ICON.calc} /></span>
          <span className="rs-welcome-card-text">
            <strong>{t('entrance.course.title')}</strong>
            <span>{t('entrance.course.body')}</span>
          </span>
          <span className="rs-welcome-card-go"><Icon d={ICON.arrow} size={18} /></span>
        </a>
        <section className="rs-welcome-card" aria-labelledby="rs-welcome-device">
          <h2 id="rs-welcome-device" className="rs-welcome-card-h">{t('entrance.device.title')}</h2>
          <p className="rs-welcome-fact"><Icon d={ICON.lock} size={18} />{t('entrance.device.compute')}</p>
          <p className="rs-welcome-fact"><Icon d={ICON.log} size={18} />{t('entrance.device.egress')}</p>
          <p className="rs-welcome-fact"><Icon d={ICON.wifiOff} size={18} />{t('entrance.device.offline')}</p>
        </section>
      </aside>
    </section>
  );
}
