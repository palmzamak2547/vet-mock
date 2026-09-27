// Account menu [M1-DESIGN.md 9.6, 9.7]: sign-in is optional (a guest works fully on this device and
// nothing syncs in M1), sign-out keeps the data on the device and says so, theme, storage health with
// an explicit "keep my data" request, and deleting this owner's research data. OWNER: workspace role.
import { useEffect, useState } from 'react';
import { useT } from '../../i18n/index.js';
import { AUTH_CONFIGURED, signIn, signOut } from '../../lib/auth/client.js';
import { storageHealth } from '../../lib/store/health.js';
import { deleteAllForOwner } from '../../lib/store/projects.js';
import { readPrefs, writePrefs } from '../../lib/store/prefs.js';
import { navigate } from '../../router.js';
import { useWs, errorInfo } from '../ws-context.js';
import Dialog from './Dialog.jsx';
import Icon from './Icon.jsx';
import Link from './Link.jsx';
import { formatBytes } from './Bits.jsx';

/** Apply a theme choice now: data-theme on <html>, the system setting when 'system'. */
export function applyTheme(theme) {
  const dark = theme === 'dark' || (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}

export default function AccountMenu({ open, onClose }) {
  const { t, lang } = useT();
  const { owner, user, db, notify, bumpProjects } = useWs();
  const [theme, setTheme] = useState(() => readPrefs().theme);
  const [health, setHealth] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    let live = true;
    storageHealth({ mode: db?.mode === 'memory' ? 'memory' : 'idb' }).then((h) => { if (live) setHealth(h); }).catch(() => { if (live) setHealth(null); });
    return () => { live = false; };
  }, [open, db]);

  const chooseTheme = (v) => {
    setTheme(v);
    writePrefs({ theme: v });
    applyTheme(v);
  };

  const askPersist = async () => {
    try {
      const ok = await navigator.storage?.persist?.();
      notify(ok ? 'ws.account.persistGranted' : 'ws.account.persistRefused', {}, ok ? 'ok' : 'warn');
      setHealth(await storageHealth({ mode: db?.mode === 'memory' ? 'memory' : 'idb' }));
    } catch {
      notify('ws.account.persistRefused', {}, 'warn');
    }
  };

  const doSignIn = async () => {
    try { await signIn('google'); } catch (err) { notify(errorInfo(err).key, {}, 'error'); }
  };
  const doSignOut = async () => {
    try {
      await signOut();
      notify('ws.account.signedOut', {}, 'ok');
      onClose();
    } catch (err) { notify(errorInfo(err).key, {}, 'error'); }
  };
  const doDeleteAll = async () => {
    setBusy(true);
    try {
      await deleteAllForOwner(db, owner);
      notify('ws.account.deletedAll', {}, 'ok');
      setConfirmDelete(false);
      onClose();
      bumpProjects();
      navigate('/app');
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Dialog open={open && !confirmDelete} onClose={onClose} title={t('ws.account.title')}>
        <section className="rs-acc-block" aria-labelledby="rs-acc-who">
          <h3 id="rs-acc-who" className="rs-h3">{user ? t('ws.account.signedInAs', { email: user.email || t('ws.account.noEmail') }) : t('ws.account.guest')}</h3>
          <p className="rs-soft">{user ? t('ws.account.signedInNote') : t('ws.account.guestNote')}</p>
          <div className="rs-row-wrap">
            {!user && AUTH_CONFIGURED ? <button type="button" className="rs-btn rs-btn--primary" onClick={doSignIn}>{t('ws.account.signIn')}</button> : null}
            {!user && !AUTH_CONFIGURED ? <p className="rs-soft">{t('ws.account.signInUnavailable')}</p> : null}
            {user ? <button type="button" className="rs-btn" onClick={doSignOut}>{t('ws.account.signOut')}</button> : null}
          </div>
          {user ? <p className="rs-soft rs-small">{t('ws.account.signOutKeeps')}</p> : null}
        </section>
        <section className="rs-acc-block" aria-labelledby="rs-acc-theme">
          <h3 id="rs-acc-theme" className="rs-h3">{t('ws.account.theme')}</h3>
          <div className="rs-seg" role="radiogroup" aria-labelledby="rs-acc-theme">
            {['system', 'light', 'dark'].map((v) => (
              <button key={v} type="button" role="radio" aria-checked={theme === v} className="rs-seg-btn" onClick={() => chooseTheme(v)}>
                <Icon name={v === 'dark' ? 'moon' : v === 'light' ? 'sun' : 'info'} size={16} />
                {t(`ws.account.theme.${v}`)}
              </button>
            ))}
          </div>
        </section>
        <section className="rs-acc-block" aria-labelledby="rs-acc-store">
          <h3 id="rs-acc-store" className="rs-h3">{t('ws.account.storage')}</h3>
          {health ? (
            <ul className="rs-plainlist">
              <li>{health.mode === 'memory' ? t('ws.account.storageMemory') : t('ws.account.storageIdb')}</li>
              {Number.isFinite(health.usage) && Number.isFinite(health.quota) ? <li>{t('ws.account.storageUse', { used: formatBytes(health.usage, lang), quota: formatBytes(health.quota, lang) })}</li> : null}
              <li>{health.persisted ? t('ws.account.persisted') : t('ws.account.notPersisted')}</li>
              {health.safariEviction ? <li>{t('ws.account.safariNote')}</li> : null}
            </ul>
          ) : <p className="rs-soft">{t('ws.account.storageUnknown')}</p>}
          {health && !health.persisted ? <button type="button" className="rs-btn" onClick={askPersist}>{t('ws.account.persist')}</button> : null}
          <p className="rs-soft rs-small">{t('ws.account.noEgress')}</p>
        </section>
        <section className="rs-acc-block" aria-labelledby="rs-acc-danger">
          <h3 id="rs-acc-danger" className="rs-h3">{t('ws.account.deleteTitle')}</h3>
          <p className="rs-soft">{t('ws.account.deleteNote')}</p>
          <button type="button" className="rs-btn rs-btn--danger" onClick={() => setConfirmDelete(true)}>
            <Icon name="trash" size={18} />
            {t('ws.account.deleteAll')}
          </button>
        </section>
        <nav className="rs-acc-links" aria-label={t('ws.account.links')}>
          <Link to="/">{t('ws.account.frontDoor')}</Link>
          <Link to="/licenses">{t('ws.account.licenses')}</Link>
        </nav>
      </Dialog>
      <Dialog
        open={open && confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={t('ws.account.deleteConfirmTitle')}
        footer={(
          <>
            <button type="button" className="rs-btn" onClick={() => setConfirmDelete(false)} data-autofocus>{t('ws.action.cancel')}</button>
            <button type="button" className="rs-btn rs-btn--danger" onClick={doDeleteAll} disabled={busy}>{t('ws.account.deleteConfirm')}</button>
          </>
        )}
      >
        <p>{t('ws.account.deleteConfirmBody')}</p>
      </Dialog>
    </>
  );
}
