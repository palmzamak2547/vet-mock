// The workspace top bar [workspace boards, topbar()]: wordmark, project crumb, "คำนวณในเครื่องนี้",
// ไทย/EN, account. On a phone it shrinks to the wordmark, the lock, the language switch, the account
// button and, inside a project, the menu button that opens the rail. OWNER: workspace role.
import { useState } from 'react';
import { useT } from '../../i18n/index.js';
import Icon from './Icon.jsx';
import Link from './Link.jsx';
import AccountMenu from './AccountMenu.jsx';

/** ไทย/EN: a pressed-button group; the choice is kept per device (prefs.lang). */
export function LangSwitch() {
  const { lang, setLang, t } = useT();
  return (
    <div className="rs-seg" role="group" aria-label={t('common.lang.group')}>
      <button type="button" className="rs-seg-btn" aria-pressed={lang === 'th'} onClick={() => setLang('th')} lang="th">{t('common.lang.th')}</button>
      <button type="button" className="rs-seg-btn" aria-pressed={lang === 'en'} onClick={() => setLang('en')} lang="en">{t('common.lang.en')}</button>
    </div>
  );
}

/**
 * @param {{ crumb?: string|null, onMenu?: (() => void) | null, menuOpen?: boolean }} props
 */
export default function TopBar({ crumb = null, onMenu = null, menuOpen = false }) {
  const { t } = useT();
  const [account, setAccount] = useState(false);
  return (
    <header className="rs-top">
      {/* The first tab stop on every workspace page (review round 2; the landing already had one). */}
      <a className="rs-skip" href="#rs-main">{t('ws.skip')}</a>
      {onMenu ? (
        <button type="button" className="rs-iconbtn rs-only-narrow" onClick={onMenu} aria-expanded={menuOpen} aria-controls="rs-rail" aria-label={t('ws.top.menu')}>
          <Icon name="menu" size={22} />
        </button>
      ) : null}
      <Link to="/app" className="rs-wordmark" aria-label={t('ws.top.homeLabel')}>
        <span className="rs-wordmark-a">{t('common.wordmark.a')}</span>
        <span className="rs-wordmark-b">{t('common.wordmark.b')}</span>
      </Link>
      {crumb ? (
        <>
          <span className="rs-top-sep" aria-hidden="true" />
          <span className="rs-top-crumb" title={crumb}>{crumb}</span>
        </>
      ) : null}
      <span className="rs-grow" />
      <span className="rs-chip rs-top-local" title={t('ws.top.localTitle')}>
        <Icon name="lock" size={16} />
        <span className="rs-only-wide">{t('ws.top.local')}</span>
        <span className="rs-only-narrow">{t('ws.top.localShort')}</span>
      </span>
      <LangSwitch />
      <button type="button" className="rs-avatar" onClick={() => setAccount(true)} aria-haspopup="dialog" aria-label={t('ws.account.open')}>
        <Icon name="user" />
      </button>
      <AccountMenu open={account} onClose={() => setAccount(false)} />
    </header>
  );
}
