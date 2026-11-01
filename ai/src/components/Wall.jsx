import { useEffect, useMemo, useRef, useState } from 'react';
import { CHULA_HD } from '../lib/chula.js';
import { APP_NAMES, externalUrl, inAppBrowser } from '../lib/inapp.js';
import { gisUsable, renderGoogleButton } from '../lib/gis.js';
import { problemText } from '../lib/wall.js';
import { IconArrowOut } from './icons.jsx';

// The Chula sign-in wall (docs/CHULA-SIGNIN.md): what the page shows instead of
// the assistant until a member session is present. A glass card over the sea,
// like the composer; the sea dims under it (App.jsx sets it as the content
// rectangle). Only opacity and transform move here, and only once.
//
// The way in is Google's own button (lib/gis.js), with One Tap beside it: its
// window names this site. The house button, which redirects through the
// database's address, stands in only when Google's script cannot run here.

const LINK_HOME = 'https://vetmock.com/app/home';

/** Google's own G, as drawn in its sign-in branding (not redrawn). */
export function GoogleG({ size = 20 }) {
  return (
    <svg className="wall-g" viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
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

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch { /* an app browser without the clipboard API */ }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

function Spinner() {
  return <span className="wall-spin" aria-hidden="true" />;
}

/** Inside an app's own browser Google refuses to sign in: the way out instead of a dead button. */
function InAppWay({ app }) {
  const [copied, setCopied] = useState(false);
  const exit = externalUrl(app, window.location.href);
  if (exit) {
    return (
      <>
        <p className="wall-inapp">LINE เปิดหน้าเข้าสู่ระบบของ Google ไม่ได้</p>
        <a className="wall-go" href={exit}>เปิดในเบราว์เซอร์<IconArrowOut size={18} /></a>
      </>
    );
  }
  return (
    <>
      <p className="wall-inapp">{APP_NAMES[app] || 'แอปนี้'} เปิดหน้าเข้าสู่ระบบของ Google ไม่ได้ แตะเมนูของแอปแล้วเลือกเปิดในเบราว์เซอร์</p>
      <button type="button" className="wall-go" onClick={async () => setCopied(await copyText(window.location.href))}>
        {copied ? 'คัดลอกลิงก์แล้ว' : 'คัดลอกลิงก์'}
      </button>
      <span className="sr-only" role="status">{copied ? 'คัดลอกลิงก์แล้ว' : ''}</span>
    </>
  );
}

/**
 * Google's own button (One Tap beside it) for the hosted domain `hd`. If the script cannot run
 * here (blocked, offline, an origin Google does not list), the house button takes its place.
 */
function GoogleSignIn({ hd, theme, busy, onToken, onRedirect }) {
  const host = useRef(null);
  const [failed, setFailed] = useState(() => !gisUsable());
  const handler = useRef(onToken);
  handler.current = onToken;
  useEffect(() => {
    if (failed) return undefined;
    let alive = true;
    let teardown = null;
    renderGoogleButton(host.current, {
      hd,
      theme: theme === 'dark' ? 'filled_black' : 'outline',
      prompt: true,
      onCredential: (token, nonce) => handler.current?.(token, nonce),
    })
      .then((undo) => { if (alive) teardown = undo; else undo(); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; teardown?.(); };
  }, [hd, theme, failed]);
  if (failed) {
    return (
      <button type="button" className="wall-google" onClick={onRedirect} disabled={Boolean(busy)} aria-busy={busy === hd || undefined}>
        <GoogleG />
        <span>ดำเนินการต่อด้วย Google</span>
        {busy === hd ? <Spinner /> : null}
      </button>
    );
  }
  return (
    <div className="wall-gsi" data-busy={busy === 'google' ? '1' : '0'}>
      <div ref={host} className="wall-gsi-slot" />
      {busy === 'google' ? <p className="wall-caption" role="status">กำลังเข้าสู่ระบบ</p> : null}
    </div>
  );
}

export default function Wall({ state, theme, onSignIn, onGoogleToken, onSignOut, cardRef }) {
  const heading = useRef(null);
  const online = useOnline();
  const app = useMemo(() => inAppBrowser(navigator.userAgent), []);
  const [staff, setStaff] = useState(false);
  const { gate, busy } = state;
  const hd = staff ? CHULA_HD.staff : CHULA_HD.student;
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [gate]);
  const problem = state.problem || (!online && gate === 'signin' ? 'offline' : null);
  const message = useAnnounced(problemText(problem));
  const live = (
    <div className="wall-msg" aria-live="polite">
      {message ? <p className="wall-note">{message}</p> : null}
    </div>
  );

  if (gate === 'checking') {
    return (
      <main className="stage wall" aria-busy="true">
        <h1 ref={heading} tabIndex={-1} className="sr-only">กำลังตรวจสอบบัญชี</h1>
        <p className="wall-wait" role="status">กำลังตรวจสอบบัญชี</p>
      </main>
    );
  }

  if (gate === 'link') {
    return (
      <main className="stage wall">
        <section ref={cardRef} className="wall-card" aria-labelledby="wall-title">
          <h1 id="wall-title" ref={heading} tabIndex={-1} className="wall-title">บัญชีนี้ยังไม่ได้เชื่อมกับอีเมลจุฬา</h1>
          {state.email ? <p className="wall-who"><span className="sr-only">เข้าสู่ระบบอยู่ด้วย </span>{state.email}</p> : null}
          <p className="wall-lead">เชื่อมบัญชีจุฬาที่ vetmock.com ครั้งเดียว ความคืบหน้าเดิมอยู่ครบ</p>
          <a className="wall-go" href={LINK_HOME}>ไปเชื่อมบัญชีจุฬา<IconArrowOut size={18} /></a>
          <button type="button" className="wall-alt" onClick={onSignOut} disabled={Boolean(busy)}>
            ใช้บัญชีอื่น{busy === 'signout' ? <Spinner /> : null}
          </button>
          {live}
        </section>
      </main>
    );
  }

  return (
    <main className="stage wall">
      <section ref={cardRef} className="wall-card" aria-labelledby="wall-title">
        <h1 id="wall-title" ref={heading} tabIndex={-1} className="wall-title">เข้าสู่ระบบด้วยอีเมลจุฬา</h1>
        <p className="wall-lead">กดปุ่ม Google ด้านล่าง แล้วเลือกอีเมลจุฬาของคุณ</p>
        <div className="wall-id">
          <p className="wall-addr">
            <span className="wall-addr-local">{staff ? 'ชื่อ' : 'รหัสนิสิต'}</span>
            <span className="wall-addr-domain">{staff ? '@chula.ac.th' : '@student.chula.ac.th'}</span>
          </p>
          <p className="wall-caption">ไม่ต้องพิมพ์ เลือกบัญชีนี้ในหน้าต่างของ Google</p>
        </div>
        {app ? <InAppWay app={app} /> : (
          <>
            <GoogleSignIn hd={hd} theme={theme} busy={busy} onToken={onGoogleToken} onRedirect={() => onSignIn(hd)} />
            <button type="button" className="wall-alt" onClick={() => setStaff(!staff)} disabled={Boolean(busy)}>
              {staff ? 'นิสิตใช้ @student.chula.ac.th' : 'บุคลากรใช้ @chula.ac.th'}
            </button>
          </>
        )}
        {live}
      </section>
    </main>
  );
}
