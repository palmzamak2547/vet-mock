// One paragraph in Thai beside the same paragraph in English, each with its own copy button. Used by
// the Report pane (the whole draft) and under every result (that result's own methods and results
// sentences, the same functions the Report uses, so both say the same thing). OWNER: workspace role.
import { useT, translate } from '../../i18n/index.js';
import Icon from './Icon.jsx';

/** @param {{ label: string, th: string, en: string, onCopy: (text: string, lang: 'th'|'en') => void }} props */
export default function Paragraphs({ label, th, en, onCopy }) {
  const { t } = useT();
  return (
    <div className="rs-paras">
      <div className="rs-para" lang="th">
        <div className="rs-para-head">
          <h3 className="rs-eyebrow">{t('ws.report.langTh', { label })}</h3>
          <button type="button" className="rs-btn rs-btn--sm" onClick={() => onCopy(th, 'th')} disabled={!th} aria-label={`${t('ws.action.copy')} ${t('ws.report.langTh', { label })}`}><Icon name="copy" size={16} />{t('ws.action.copy')}</button>
        </div>
        <p className="rs-para-text rs-num">{th || translate('th', 'ws.report.nothingYet')}</p>
      </div>
      <div className="rs-para" lang="en">
        <div className="rs-para-head">
          <h3 className="rs-eyebrow">{t('ws.report.langEn', { label })}</h3>
          <button type="button" className="rs-btn rs-btn--sm" onClick={() => onCopy(en, 'en')} disabled={!en} aria-label={`${t('ws.action.copy')} ${t('ws.report.langEn', { label })}`}><Icon name="copy" size={16} />{t('ws.action.copy')}</button>
        </div>
        <p className="rs-para-text rs-num">{en || translate('en', 'ws.report.nothingYet')}</p>
        {/[\u0E00-\u0E7F]/.test(en || '') ? <p className="rs-soft rs-small" role="note">{t('ws.report.thaiInEnglish')}</p> : null}
      </div>
    </div>
  );
}
