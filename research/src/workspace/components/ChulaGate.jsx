// The Chula sign-in wall in front of the workspace [docs/CHULA-SIGNIN.md]. A lazy chunk, loaded only
// when this build has sign-in (Workspace.jsx), so a guest build and the landing never fetch it. While
// the wall is on, the workspace waits for a member session: a calm "checking" line while the session or
// the switch is unknown (never a flash of the workspace), then the sign-in card or, for an account with
// no Chula identity, the way to link one at vetmock.com. With the switch off it renders the workspace
// as before. The way in is Google's own button (lib/auth/gis.js); the house button, which redirects,
// only where it cannot run. Every string is a key of the runtime-chula area. OWNER: runtime role.
import { useEffect, useMemo, useRef, useState } from 'react';
import { registerArea, useT } from '../../i18n/index.js';
import runtimeChula from '../../i18n/runtime-chula.js';
import { CHULA_HD } from '../../lib/auth/chula.js';
import { APP_NAMES, externalUrl, inAppBrowser } from '../../lib/auth/inapp.js';
import { gisUsable, renderGoogleButton } from '../../lib/auth/gis.js';
import { chulaWall, problemKey, useChulaWall } from '../../lib/auth/wall.js';
import { LangSwitch } from './TopBar.jsx';
import { Busy, Notice } from './Bits.jsx';
import Icon from './Icon.jsx';
import Link from './Link.jsx';
import '../../styles/wall.css';

registerArea('runtime-chula', runtimeChula);
// Made at load, before the client or useOwner reads the address: an OAuth error in it is taken once.
const wall = chulaWall();

const LINK_HOME = 'https://vetmock.com/app/home';
const DOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const GOLD = 9;

/** Google's own G, as drawn in its sign-in branding; its four colours are tokens (tokens.css). */
function GoogleG() {
  return (
    <svg className="rs-wall-g" viewBox="0 0 48 48" width="20" height="20" aria-hidden="true" focusable="false">
      <path className="rs-g-red" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path className="rs-g-blue" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path className="rs-g-yellow" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path className="rs-g-green" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function useOnline() {
  const [online, setOnline] = useState(() => globalThis.navigator?.onLine !== false);
  useEffect(() => {
    const on = () => setOnline(globalThis.navigator?.onLine !== false);
    window.addEventListener('online', on);
    window.addEventListener('offline', on);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', on); };
  }, []);
  return online;
}

/** Words put into the live region a frame after it exists, so a screen reader announces them. */
function useAnnounced(text) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setShown(text));
    return () => window.cancelAnimationFrame(id);
  }, [text]);
  return shown;
}

async function copyLink(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch { /* an app browser without the clipboard API */ }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.className = 'rs-visually-hidden';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Inside an app's own browser Google refuses to sign in: the way out instead of a dead button. */
function InAppWay({ app }) {
  const { t } = useT();
  const [copied, setCopied] = useState(false);
  const exit = externalUrl(app, window.location.href);
  if (exit) {
    return (
      <>
        <p className="rs-wall-inapp">{t('runtime.chula.inapp.line')}</p>
        <a className="rs-btn rs-btn--primary" href={exit}>{t('runtime.chula.inapp.open')}<Icon name="arrow" size={18} /></a>
      </>
    );
  }
  return (
    <>
      <p className="rs-wall-inapp">{t('runtime.chula.inapp.other', { app: APP_NAMES[app] || app })}</p>
      <button type="button" className="rs-btn rs-btn--primary" onClick={async () => setCopied(await copyLink(window.location.href))}>
        <Icon name={copied ? 'check' : 'copy'} size={18} />
        {t(copied ? 'runtime.chula.inapp.copied' : 'runtime.chula.inapp.copy')}
      </button>
      <span className="rs-visually-hidden" role="status">{copied ? t('runtime.chula.inapp.copied') : ''}</span>
    </>
  );
}

function Spin() {
  return <span className="rs-wall-spin" aria-hidden="true" />;
}

/** The page's theme as base.css paints it (data-theme on <html>), followed when it changes. */
function usePageTheme() {
  const read = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  const [theme, setTheme] = useState(read);
  useEffect(() => {
    const watch = new MutationObserver(() => setTheme(read()));
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => watch.disconnect();
  }, []);
  return theme;
}

/**
 * Google's own button (One Tap beside it) for the hosted domain `hd`: its window names this site.
 * Only where Google's script cannot run (an origin the client does not list, blocked, offline)
 * does the house button take its place, and that one redirects through the database's address.
 */
function GoogleSignIn({ hd, busy }) {
  const { t, lang } = useT();
  const theme = usePageTheme();
  const host = useRef(null);
  const [failed, setFailed] = useState(() => !gisUsable());
  useEffect(() => {
    if (failed) return undefined;
    let alive = true;
    let undo = null;
    renderGoogleButton(host.current, {
      hd,
      theme: theme === 'dark' ? 'filled_black' : 'outline',
      locale: lang,
      prompt: true,
      onCredential: (token, nonce) => wall.signInWithGoogleToken(token, nonce),
    })
      .then((u) => { if (alive) undo = u; else u(); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; undo?.(); };
  }, [hd, theme, lang, failed]);
  if (failed) {
    return (
      <button type="button" className="rs-wall-google" onClick={() => wall.signIn(hd)} disabled={Boolean(busy)} aria-busy={busy === hd || undefined}>
        <GoogleG />
        <span>{t('runtime.chula.google')}</span>
        {busy === hd ? <Spin /> : null}
      </button>
    );
  }
  return (
    <div className="rs-wall-gsi" data-busy={busy === 'google' ? '1' : '0'}>
      <div ref={host} className="rs-wall-gsi-slot" />
      {busy === 'google' ? <p className="rs-wall-caption" role="status">{t('runtime.chula.signingIn')}</p> : null}
    </div>
  );
}

function Wall({ state }) {
  const { t } = useT();
  const heading = useRef(null);
  const online = useOnline();
  const app = useMemo(() => inAppBrowser(globalThis.navigator?.userAgent), []);
  const [staff, setStaff] = useState(false);
  const { gate, busy } = state;
  const hd = staff ? CHULA_HD.staff : CHULA_HD.student;
  const titleKey = gate === 'link' ? 'runtime.chula.linkTitle' : gate === 'checking' ? 'runtime.chula.checking' : 'runtime.chula.title';
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [gate]);
  useEffect(() => { document.title = `${t(titleKey)} | ${t('common.appName')}`; }, [titleKey, t]);
  const problem = state.problem || (!online && gate === 'signin' ? 'offline' : null);
  const message = useAnnounced(problem ? t(problemKey(problem)) : '');

  const top = (
    <header className="rs-top">
      <a className="rs-skip" href="#rs-main">{t('ws.skip')}</a>
      <Link to="/" className="rs-wordmark" aria-label={t('ws.account.frontDoor')}>
        <span className="rs-wordmark-a">{t('common.wordmark.a')}</span>
        <span className="rs-wordmark-b">{t('common.wordmark.b')}</span>
      </Link>
      <span className="rs-grow" />
      <LangSwitch />
    </header>
  );

  if (gate === 'checking') {
    return (
      <div className="rs-ws" aria-busy="true">
        {top}
        <main id="rs-main" className="rs-wall-main">
          <h1 ref={heading} tabIndex={-1} className="rs-visually-hidden">{t('runtime.chula.checking')}</h1>
          <Busy label={t('runtime.chula.checking')} />
        </main>
      </div>
    );
  }

  const live = (
    <div aria-live="polite">
      {message ? <Notice tone={problem === 'not-chula' || problem === 'unknown' ? 'stop' : 'warn'}>{message}</Notice> : null}
    </div>
  );
  const dots = (
    <span className="rs-wall-dots" aria-hidden="true">
      {DOTS.map((i) => <span key={i} className={`rs-wall-dot${i === GOLD ? ' rs-wall-dot--gold' : ''}`} />)}
    </span>
  );

  if (gate === 'link') {
    return (
      <div className="rs-ws">
        {top}
        <main id="rs-main" className="rs-wall-main">
          <section className="rs-wall-card" aria-labelledby="rs-wall-title">
            {dots}
            <h1 id="rs-wall-title" ref={heading} tabIndex={-1} className="rs-wall-title">{t('runtime.chula.linkTitle')}</h1>
            {state.email ? <p className="rs-wall-who"><Icon name="user" size={16} />{t('runtime.auth.signedInAs', { email: state.email })}</p> : null}
            <p className="rs-wall-lead">{t('runtime.chula.linkBody')}</p>
            <div className="rs-wall-actions">
              <a className="rs-btn rs-btn--primary" href={LINK_HOME}>{t('runtime.chula.linkGo')}<Icon name="arrow" size={18} /></a>
              <button type="button" className="rs-btn rs-btn--quiet rs-wall-alt" onClick={wall.signOut} disabled={Boolean(busy)}>
                {t('runtime.chula.other')}{busy === 'signout' ? <Spin /> : null}
              </button>
            </div>
            {live}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="rs-ws">
      {top}
      <main id="rs-main" className="rs-wall-main">
        <section className="rs-wall-card" aria-labelledby="rs-wall-title">
          {dots}
          <h1 id="rs-wall-title" ref={heading} tabIndex={-1} className="rs-wall-title">{t('runtime.chula.title')}</h1>
          <p className="rs-wall-lead">{t('runtime.chula.lead')}</p>
          <div className="rs-wall-id" role="group" aria-label={t('runtime.chula.addressLabel')}>
            <p className="rs-wall-addr">
              <span className="rs-wall-addr-local">{t(staff ? 'runtime.chula.local.staff' : 'runtime.chula.local.student')}</span>
              <span className="rs-wall-addr-domain">{staff ? '@chula.ac.th' : '@student.chula.ac.th'}</span>
            </p>
            <p className="rs-wall-caption">{t('runtime.chula.addressCaption')}</p>
          </div>
          <div className="rs-wall-actions">
            {app ? <InAppWay app={app} /> : (
              <>
                <GoogleSignIn hd={hd} busy={busy} />
                <button type="button" className="rs-btn rs-btn--quiet rs-wall-alt" onClick={() => setStaff(!staff)} disabled={Boolean(busy)}>
                  {t(staff ? 'runtime.chula.student' : 'runtime.chula.staff')}
                </button>
              </>
            )}
            {busy && busy !== 'signout' && busy !== 'google' ? <span className="rs-visually-hidden" role="status">{t('runtime.auth.redirecting')}</span> : null}
          </div>
          {live}
        </section>
      </main>
    </div>
  );
}

/**
 * @param {{ children: (returnedKey: string|null) => any }} props  the workspace, given the key of a
 *   sign-in error the provider sent back when the wall is off (useOwner showed it before the wall)
 */
export default function ChulaGate({ children }) {
  const state = useChulaWall();
  useEffect(() => { wall.start(); }, []);
  if (state.gate === 'open') return children(state.returned ? 'runtime.auth.failed' : null);
  return <Wall state={state} />;
}
