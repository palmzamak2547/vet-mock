// The Chula sign-in wall (docs/CHULA-SIGNIN.md): what the site shows instead of its pages until
// a member session is present. A pane of glass on the gallery wall, the same light behind it as
// every page, the mark at the top; nothing else of the site shows through, and nothing on it
// moves but its entrance (opacity and transform, once). The state comes from online/gate.js. The
// way in is Google's own button (online/gis.js); the house button only where it cannot run. An
// account with no Chula identity links one in place, on this site's own session, and starts again.

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Lockup } from '../../components/Mark.jsx';
import { Icon } from '../../components/Icon.jsx';
import { APP_NAMES, inAppBrowser, lineExternalUrl } from '../../lib/inapp.js';
import { copyText } from '../../lib/connect.js';
import { pageReady } from '../../lib/motion.js';
import { toggleTheme, useTheme } from '../../lib/prefs.js';
import { CHULA_HD } from '../chula.js';
import { GOOGLE_ORIGINS, WALL_GOOGLE_CLIENT_ID } from '../config.js';
import { problemText } from '../wall.js';
import '../wall.css';

/** Google's own G, as its sign-in branding asks a sign-in button to carry it. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" width="22" height="22" aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/** The top bar's theme switch, without the rest of the bar (whose links lead past the wall). */
function ThemeSwitch() {
  const { effective } = useTheme();
  const next = effective === 'dark' ? 'สว่าง' : 'มืด';
  return (
    <button
      type="button" className="icon-btn"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggleTheme(r.left + r.width / 2, r.top + r.height / 2);
      }}
      aria-label={`เปลี่ยนเป็นธีม${next}`} title={`ธีม${next}`}
    >
      <Icon name={effective === 'dark' ? 'sun' : 'moon'} />
    </button>
  );
}

function useOnline() {
  const [online, setOnline] = useState(() => navigator.onLine !== false);
  useEffect(() => {
    const on = () => setOnline(navigator.onLine !== false);
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
    const id = requestAnimationFrame(() => setShown(text));
    return () => cancelAnimationFrame(id);
  }, [text]);
  return shown;
}

/** Inside an app's own browser Google refuses to sign in: the way out instead of a dead button. */
function InAppWay({ app }) {
  const [copied, setCopied] = useState(false);
  if (app === 'line') {
    return (
      <>
        <p className="cwall-inapp">LINE เปิดหน้าเข้าสู่ระบบของ Google ไม่ได้</p>
        <a className="btn btn-ink btn-lg btn-block" href={lineExternalUrl(window.location.href)}>เปิดในเบราว์เซอร์<Icon name="arrowUpRight" size={18} /></a>
      </>
    );
  }
  return (
    <>
      <p className="cwall-inapp">{APP_NAMES[app] || 'แอปนี้'} เปิดหน้าเข้าสู่ระบบของ Google ไม่ได้ แตะเมนูของแอปแล้วเลือกเปิดในเบราว์เซอร์</p>
      <button type="button" className="btn btn-ink btn-lg btn-block" onClick={async () => setCopied(await copyText(window.location.href))}>
        <Icon name={copied ? 'check' : 'copy'} size={18} />{copied ? 'คัดลอกลิงก์แล้ว' : 'คัดลอกลิงก์'}
      </button>
      <span className="sr" role="status">{copied ? 'คัดลอกลิงก์แล้ว' : ''}</span>
    </>
  );
}

/**
 * Google's own button for the hosted domain `hd`: its window names this site. To sign in it has One
 * Tap beside it; to link (`mode` 'link') it has none, so a passer-by on a shared device is never
 * offered a stranger's account. Where Google's script cannot run (an origin the client does not
 * list, blocked, offline), or its button has not drawn 4 s after the script loaded, the house button
 * takes its place, and that one redirects through the database's address.
 */
function GoogleSignIn({ hd, busy, mode = 'signin', onToken, onRedirect }) {
  const host = useRef(null);
  const { effective } = useTheme();
  const [failed, setFailed] = useState(() => !WALL_GOOGLE_CLIENT_ID || !GOOGLE_ORIGINS.includes(window.location.origin));
  const handler = useRef(onToken);
  handler.current = onToken;
  const link = mode === 'link';
  useEffect(() => {
    if (failed) return undefined;
    let alive = true;
    let undo = null;
    let stopWatch = null;
    const el = host.current;
    import('../gis.js')
      .then(({ renderGoogleButton, watchDrawn }) => renderGoogleButton(el, {
        clientId: WALL_GOOGLE_CLIENT_ID,
        hd,
        prompt: !link,
        text: link ? 'continue_with' : 'signin_with',
        theme: effective === 'dark' ? 'filled_black' : 'outline',
        width: el.clientWidth,
        onCredential: (token, nonce) => handler.current?.(token, nonce),
      }).then((u) => {
        if (!alive) { u(); return; }
        undo = u;
        stopWatch = watchDrawn(el, () => { if (alive) setFailed(true); });
      }))
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; stopWatch?.(); undo?.(); };
  }, [hd, effective, link, failed]);
  if (failed) {
    return (
      <button type="button" className="cwall-google" onClick={onRedirect} disabled={Boolean(busy)} aria-busy={busy === hd || undefined}>
        <span className="cwall-google-mark"><GoogleMark /></span>
        <span>ดำเนินการต่อด้วย Google</span>
        {busy === hd ? <span className="spinner" aria-hidden="true" /> : null}
      </button>
    );
  }
  const working = busy === (link ? 'link' : 'google');
  return (
    <div className="cwall-gsi" data-busy={working ? '1' : '0'}>
      <div ref={host} className="cwall-gsi-slot" />
      {working ? <p className="cwall-caption" role="status">{link ? 'กำลังเชื่อมบัญชี' : 'กำลังเข้าสู่ระบบ'}</p> : null}
    </div>
  );
}

/** The address to choose in Google's window, the same on the sign-in and the link screens. */
function Address({ staff }) {
  return (
    <div className="cwall-id">
      <p className="cwall-addr">
        <span className="cwall-addr-local">{staff ? 'ชื่อ' : 'รหัสนิสิต'}</span>
        <span className="cwall-addr-domain">{staff ? '@chula.ac.th' : '@student.chula.ac.th'}</span>
      </p>
      <p className="cwall-caption">ไม่ต้องพิมพ์ เลือกบัญชีนี้ในหน้าต่างของ Google</p>
    </div>
  );
}

export function ChulaWall({ state, onSignIn, onGoogleToken, onLinkToken, onLinkRedirect, onSignOut }) {
  const heading = useRef(null);
  const online = useOnline();
  const app = useMemo(() => inAppBrowser(), []);
  const [staff, setStaff] = useState(false);
  const { gate, busy } = state;
  const hd = staff ? CHULA_HD.staff : CHULA_HD.student;
  // a view transition waiting on a page (lib/motion.js) has its page: the wall
  useLayoutEffect(() => { pageReady(); }, [gate]);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [gate]);
  const problem = state.problem || (!online && gate !== 'checking' ? 'offline' : null);
  const message = useAnnounced(problemText(problem));

  const top = (
    <header className="cwall-top">
      <span className="cwall-brand"><Lockup size={30} /></span>
      <ThemeSwitch />
    </header>
  );
  const staffToggle = (
    <button type="button" className="text-link cwall-alt" onClick={() => setStaff(!staff)} disabled={Boolean(busy)}>
      {staff ? 'นิสิตใช้ @student.chula.ac.th' : 'บุคลากรใช้ @chula.ac.th'}
    </button>
  );
  const live = (
    <div className="cwall-live" aria-live="polite">
      {message ? (
        <div className="cwall-note">
          <p>{message}</p>
          {/* that Chula address already has its own account: leave this one and sign in with it */}
          {problem === 'identity-taken' ? (
            <button type="button" className="btn btn-ghost btn-sm cwall-note-act" onClick={onSignOut} disabled={Boolean(busy)}>เข้าบัญชีจุฬานั้นแทน</button>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  if (gate === 'checking') {
    return (
      <div className="cwall" aria-busy="true">
        {top}
        <main id="main" className="cwall-main">
          <h1 ref={heading} tabIndex={-1} className="sr">กำลังตรวจสอบบัญชี</h1>
          <p className="cwall-wait" role="status"><span className="spinner" aria-hidden="true" />กำลังตรวจสอบบัญชี</p>
        </main>
      </div>
    );
  }

  if (gate === 'link') {
    return (
      <div className="cwall">
        {top}
        <main id="main" className="cwall-main">
          <section className="cwall-card glass" aria-labelledby="cwall-h">
            <p className="kicker">Members’ entrance</p>
            <h1 id="cwall-h" ref={heading} tabIndex={-1} className="cwall-h">บัญชีนี้ยังไม่ได้เชื่อมกับอีเมลจุฬา</h1>
            {state.email ? <p className="cwall-who"><Icon name="user" size={16} /><span className="sr">เข้าสู่ระบบอยู่ด้วย </span>{state.email}</p> : null}
            <p className="cwall-p">กดปุ่ม Google แล้วเลือกอีเมลจุฬาของคุณ ความคืบหน้าเดิมอยู่ครบ</p>
            <Address staff={staff} />
            <div className="cwall-ways">
              {app ? <InAppWay app={app} /> : (
                <>
                  <GoogleSignIn hd={hd} busy={busy} mode="link" onToken={onLinkToken} onRedirect={() => onLinkRedirect(hd)} />
                  {staffToggle}
                </>
              )}
              <button type="button" className="text-link cwall-alt" onClick={onSignOut} disabled={Boolean(busy)}>
                ใช้บัญชีอื่น{busy === 'signout' ? <span className="spinner" aria-hidden="true" /> : null}
              </button>
            </div>
            {live}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="cwall">
      {top}
      <main id="main" className="cwall-main">
        <section className="cwall-card glass" aria-labelledby="cwall-h">
          <p className="kicker">Members’ entrance</p>
          <h1 id="cwall-h" ref={heading} tabIndex={-1} className="cwall-h">เข้าสู่ระบบด้วยอีเมลจุฬา</h1>
          <p className="cwall-p">กดปุ่ม Google ด้านล่าง แล้วเลือกอีเมลจุฬาของคุณ</p>
          <Address staff={staff} />
          <div className="cwall-ways">
            {app ? <InAppWay app={app} /> : (
              <>
                <GoogleSignIn hd={hd} busy={busy} onToken={onGoogleToken} onRedirect={() => onSignIn(hd)} />
                {staffToggle}
              </>
            )}
          </div>
          {live}
        </section>
      </main>
    </div>
  );
}
