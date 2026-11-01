// ============================================================
// ChulaGateView — the Chula sign-in wall (docs/CHULA-SIGNIN.md)
// ============================================================
// Shown instead of the app until a member session is present. The database
// decides who is a member; this screen only explains and offers the way in:
//   signin    no session: Google with a Chula address, or an old account
//   link      signed in with an account that holds no Chula identity yet
//   checking  the session or the switch is still being read
// ChulaGateExit is the door that opens over the app once, after a sign-in.
// ============================================================
import { useEffect, useMemo, useRef, useState } from 'react';
import '../styles-gate.css';
import { MOCHI_POSE_ASSETS } from '../data/mochi-poses.generated.js';
import { CHULA_HD, chulaEmailOf, signInProblem, takeAuthErrorFromUrl } from '../lib/chula.js';
import { inAppBrowser, externalUrl, APP_NAMES } from '../lib/inapp.js';
import {
  getSupabase, signInWithGoogle, signInWithEmail, signInWithPasskey, isPasskeySupported, signOut,
  SIGNED_OUT_KEY, BOOT_HAD_SESSION,
} from '../lib/supabase.js';
import { isGoogleGisAvailable, renderGoogleGisButton } from '../lib/google-gis.js';
import { sendFeedback } from '../lib/feedback-client.js';
import { takeBootAuthError } from '../hooks/useChulaWall.js';

const PROBLEMS = {
  'not-chula': ['บัญชีนี้ไม่ใช่อีเมลจุฬา', 'เลือกบัญชี @student.chula.ac.th หรือ @chula.ac.th แล้วลองใหม่'],
  cancelled: ['ยกเลิกการเข้าสู่ระบบแล้ว', 'ลองใหม่ได้ทุกเมื่อ'],
  offline: ['ยังไม่ได้ต่ออินเทอร์เน็ต', 'การเข้าสู่ระบบครั้งแรกต้องใช้เน็ต เครื่องที่เคยเข้าสู่ระบบแล้วใช้ต่อได้แบบออฟไลน์'],
  expired: ['เซสชันหมดอายุแล้ว', 'เข้าสู่ระบบอีกครั้ง ความคืบหน้าทั้งหมดยังอยู่ในบัญชี'],
  'identity-taken': ['บัญชีจุฬานี้มีบัญชี VetMock ของตัวเองอยู่แล้ว', 'เข้าบัญชีจุฬานั้นแทนได้เลย ความคืบหน้าในบัญชีนี้ยังอยู่ ถ้าอยากรวมสองบัญชี แจ้งเราด้านล่าง'],
  'linking-off': ['ตอนนี้ยังเชื่อมบัญชีไม่ได้', 'ลองใหม่อีกครั้ง หรือแจ้งเราด้านล่าง'],
  'bad-password': ['อีเมลหรือรหัสผ่านไม่ถูกต้อง', 'ลองใหม่ หรือเข้าด้วย Google บัญชีเดิม'],
  unknown: ['เข้าสู่ระบบไม่สำเร็จ', 'ลองใหม่อีกครั้ง'],
};

const SAFETY_MS = 12_000; // a sign-in that neither lands nor fails must not leave the buttons busy
const NOISE = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=<>/';
const DOMAIN = '@student.chula.ac.th';
// A control-sized spring (response 0.35 s, damping 0.82, about 1% overshoot so a
// glyph seems to click into place), sampled into linear(); settles in 480 ms.
const SNAP = 'linear(0, 0.108, 0.32, 0.536, 0.712, 0.839, 0.922, 0.971, 0.997, 1.008, 1.011, 1.01, 1.008, 1.006, 1.004, 1.002, 1)';
const SNAP_MS = 480;
// Where each glyph flies in from: fixed per position (no Math.random), so the
// assembly looks the same every time and two halves of the door agree.
const scatter = (i) => {
  const h = Math.imul(i + 1, 2654435761) >>> 0;
  return { x: (h % 81) - 40, y: ((h >>> 8) % 2 ? 1 : -1) * (14 + ((h >>> 9) % 23)), r: ((h >>> 16) % 41) - 20 };
};

const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const signedOutOnPurpose = () => { try { return sessionStorage.getItem(SIGNED_OUT_KEY) === '1'; } catch { return false; } };

function problemOf(error) {
  if (/invalid login credentials/i.test(String(error?.message || ''))) return 'bad-password';
  if (error?.name === 'NotAllowedError' || error?.name === 'AbortError') return 'cancelled';
  return signInProblem(error, { online: typeof navigator === 'undefined' || navigator.onLine !== false }) || 'unknown';
}

function useOnline() {
  const [online, setOnline] = useState(() => typeof navigator === 'undefined' || navigator.onLine !== false);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return online;
}

/**
 * The address, assembled: each glyph keeps its final letter's width while noise
 * cycles above it, and settles as a beam sweeps past at constant speed (one glyph
 * every 32 ms, the way a scanner reads). One rAF loop writes the DOM directly and
 * stops when the last glyph lands. Reduced motion shows the address at once.
 */
export function ChulaAddress({ local = '', domain = DOMAIN, play = true }) {
  const host = useRef(null);
  const chars = useMemo(() => [...domain], [domain]);
  useEffect(() => {
    const root = host.current;
    if (!root) return undefined;
    const glyphs = [...root.querySelectorAll('.vmx-gate-g')];
    const beam = root.querySelector('.vmx-gate-beam');
    const settleAll = () => { for (const g of glyphs) g.dataset.s = '1'; if (beam) beam.style.opacity = '0'; root.dataset.done = '1'; };
    root.dataset.done = '0';
    if (!play || reducedMotion()) { settleAll(); return undefined; }
    const box = root.getBoundingClientRect();
    const spots = glyphs.map((g) => {
      const r = g.getBoundingClientRect();
      return { x: r.right - box.left, y: r.top - box.top, h: r.height };
    });
    const START = 260;
    const STEP = 32;
    const end = START + STEP * glyphs.length;
    let raf = 0;
    let noiseAt = -Infinity;
    const t0 = performance.now();
    const frame = (now) => {
      const t = now - t0;
      const front = Math.floor((t - START) / STEP);
      glyphs.forEach((g, i) => { if (i <= front && g.dataset.s === '0') g.dataset.s = '1'; });
      if (now - noiseAt > 48) {
        noiseAt = now;
        glyphs.forEach((g) => { if (g.dataset.s === '0') g.lastChild.textContent = NOISE[(Math.random() * NOISE.length) | 0]; });
      }
      const spot = spots[Math.min(spots.length - 1, Math.max(0, front))];
      if (beam && spot) {
        beam.style.top = `${spot.y - 6}px`;
        beam.style.height = `${spot.h + 12}px`;
        beam.style.transform = `translateX(${spot.x}px)`;
        beam.style.opacity = t < START ? String(t / START) : t > end ? String(Math.max(0, 1 - (t - end) / 240)) : '1';
      }
      if (t < end + 240) raf = requestAnimationFrame(frame);
      else settleAll();
    };
    raf = requestAnimationFrame(frame);
    // The assembly: every glyph flies in from its own scattered place and snaps
    // home just as the beam reaches it. Transform and opacity only.
    const flights = typeof Element !== 'undefined' && Element.prototype.animate ? glyphs.map((g, i) => {
      const s = scatter(i);
      return g.animate([
        { transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)`, opacity: 0 },
        { transform: 'none', opacity: 1 },
      ], { duration: SNAP_MS, delay: Math.max(0, START + STEP * i - SNAP_MS * 0.6), easing: SNAP, fill: 'backwards' });
    }) : [];
    return () => { cancelAnimationFrame(raf); for (const f of flights) f.cancel(); settleAll(); };
  }, [chars, play]);

  return (
    <div className="vmx-gate-addr" ref={host}>
      {local ? <span className="vmx-gate-addr-local" aria-hidden="true">{local}</span> : null}
      <span className="vmx-gate-glyphs" aria-hidden="true">
        {chars.map((ch, i) => (
          // The settled state is the default, so a glyph never waits on the loop to be readable.
          <span key={`${i}-${ch}`} className="vmx-gate-g" data-s={play ? '0' : '1'}><b>{ch}</b><i /></span>
        ))}
      </span>
      <span className="vmx-gate-beam" aria-hidden="true" />
      <span className="vmx-sr-only">{`${local}${domain}`}</span>
    </div>
  );
}

/**
 * Google's own button, with One Tap beside it, and never a redirect: Google's
 * screen then names vetmock.com, where the redirect named the database's raw
 * supabase.co address. Only when Google's script cannot run here (blocked, or an
 * origin Google does not list) does the house button take its place, and that
 * one can only redirect.
 */
function GoogleSignIn({ hd = '', link = false, busy = false, label, onBegin, onSession, onFail, onRedirect }) {
  const host = useRef(null);
  const [failed, setFailed] = useState(() => !isGoogleGisAvailable());
  const handlers = useRef({});
  handlers.current = { onBegin, onSession, onFail };
  const theme = typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'filled_black' : 'outline';
  useEffect(() => {
    if (failed) return undefined;
    let alive = true;
    let teardown = null;
    (async () => {
      try {
        const supabase = await getSupabase();
        if (!alive) return;
        if (!supabase || !host.current) throw new Error('no client');
        teardown = await renderGoogleGisButton(host.current, {
          supabase, hd, link, theme, prompt: true, text: link ? 'continue_with' : 'signin_with',
          onCredential: () => handlers.current.onBegin?.(),
          onSuccess: (data) => handlers.current.onSession?.(data),
          onError: (error) => handlers.current.onFail?.(error),
        });
        if (!alive) teardown?.();
      } catch {
        if (alive) setFailed(true);
      }
    })();
    return () => {
      alive = false;
      teardown?.();
      try { window.google?.accounts?.id?.cancel(); } catch { /* not loaded */ }
    };
  }, [hd, link, theme, failed]);
  if (failed) {
    return (
      <button type="button" className={`vmx-gate-primary${busy ? ' vmx-gate-busy' : ''}`} onClick={onRedirect} disabled={busy}>
        <GoogleMark />
        <span className="vmx-gate-primary-label">{busy ? 'กำลังเปิดบัญชี Google' : label}</span>
      </button>
    );
  }
  return (
    <div className="vmx-gate-gsi" data-busy={busy ? '1' : '0'}>
      <div ref={host} className="vmx-gate-gsi-slot" />
      {busy ? <p className="vmx-gate-caption" role="status">กำลังเข้าสู่ระบบ</p> : null}
    </div>
  );
}

function GoogleMark() {
  return <span className="vmx-gate-g-mark" aria-hidden="true"><img src="/brand/google-g.svg" alt="" width="20" height="20" /></span>;
}

function Notice({ kind, children }) {
  if (!kind) return null;
  const [head, body] = PROBLEMS[kind] || PROBLEMS.unknown;
  return (
    <div className="vmx-gate-note" data-tone="problem">
      <b>{head}</b>
      {body}
      {children}
    </div>
  );
}

function HelpForm() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ sending: false, done: false, error: '' });
  if (!open) {
    return <button type="button" className="vmx-gate-quiet" onClick={() => setOpen(true)}>ติดปัญหา แจ้งเรา</button>;
  }
  if (state.done) return <p role="status">ส่งแล้ว ขอบคุณที่บอกเรา จะติดต่อกลับทางอีเมลถ้าให้ไว้</p>;
  const send = async (event) => {
    event.preventDefault();
    if (!text.trim() || state.sending) return;
    setState({ sending: true, done: false, error: '' });
    const result = await sendFeedback({
      type: 'Sign-in',
      subject: 'เข้าสู่ระบบด้วยอีเมลจุฬาไม่ได้',
      message: `${text.trim()}\n\n(${typeof navigator === 'undefined' ? '' : navigator.userAgent})`,
      ...(email.trim() ? { fromEmail: email.trim() } : {}),
    });
    setState(result.ok ? { sending: false, done: true, error: '' } : { sending: false, done: false, error: result.messageTh });
  };
  return (
    <form className="vmx-gate-form" onSubmit={send}>
      <label htmlFor="vmx-gate-help">เล่าให้ฟังว่าเกิดอะไรขึ้น</label>
      <textarea id="vmx-gate-help" value={text} onChange={(e) => setText(e.target.value)} required maxLength={2000} />
      <label htmlFor="vmx-gate-help-email">อีเมลสำหรับตอบกลับ (ไม่บังคับ)</label>
      <input id="vmx-gate-help-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      {state.error ? <p role="alert" className="vmx-gate-note" data-tone="problem">{state.error}</p> : null}
      <button type="submit" className="vmx-gate-chip-btn" disabled={state.sending || !text.trim()}>{state.sending ? 'กำลังส่ง' : 'ส่งถึงทีม VetMock'}</button>
    </form>
  );
}

function InAppNote({ app }) {
  const exit = typeof window === 'undefined' ? null : externalUrl(app, window.location.href);
  const [copied, setCopied] = useState(false);
  const name = APP_NAMES[app] || 'แอปนี้';
  const copy = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); } catch { setCopied(false); }
  };
  return (
    <div className="vmx-gate-note">
      <b>{name} เปิดหน้าเข้าสู่ระบบของ Google ไม่ได้</b>
      {exit ? 'เปิดหน้านี้ในเบราว์เซอร์ของเครื่องแล้วเข้าสู่ระบบต่อได้เลย' : 'แตะเมนูของแอปแล้วเลือกเปิดในเบราว์เซอร์ หรือคัดลอกลิงก์ไปวางในเบราว์เซอร์'}
      <div className="vmx-gate-note-actions">
        {exit
          ? <a className="vmx-gate-chip-btn" href={exit}>เปิดในเบราว์เซอร์</a>
          : <button type="button" className="vmx-gate-chip-btn" onClick={copy}>{copied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}</button>}
      </div>
    </div>
  );
}

export default function ChulaGateView({ wall, user, onAbout }) {
  const state = wall.state;
  const online = useOnline();
  const inApp = useMemo(() => (typeof navigator === 'undefined' ? null : inAppBrowser(navigator.userAgent)), []);
  const [busy, setBusy] = useState(null);
  const [problem, setProblem] = useState(() => {
    const fromUrl = takeBootAuthError() || takeAuthErrorFromUrl();
    if (fromUrl) return signInProblem(fromUrl) || 'unknown';
    return BOOT_HAD_SESSION && !signedOutOnPurpose() ? 'expired' : null;
  });
  const [form, setForm] = useState(null); // 'password' while the old-account form is open
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const heading = useRef(null);
  const safety = useRef(0);

  useEffect(() => () => clearTimeout(safety.current), []);
  useEffect(() => {
    document.title = state === 'link' ? 'เชื่อมบัญชีจุฬา | VetMock' : 'เข้าสู่ระบบด้วยอีเมลจุฬา | VetMock';
  }, [state]);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [state]);
  // A session that arrived clears the "expired" line; one that was asked to leave does too.
  useEffect(() => { if (user && problem === 'expired') setProblem(null); }, [user, problem]);

  const [staff, setStaff] = useState(false);
  const [legacyGoogle, setLegacyGoogle] = useState(false);

  // Google's button reports in three calls; these keep the screen in step with them.
  const begin = (kind) => {
    setProblem(null);
    setBusy(kind);
    wall.armWelcome();
    clearTimeout(safety.current);
    safety.current = setTimeout(() => setBusy(null), SAFETY_MS);
  };
  const landed = (data, { reload = false } = {}) => {
    clearTimeout(safety.current);
    setBusy(null);
    // Linking in place changes what every part of the app may read: start it
    // again clean, and the door opens on the far side.
    if (reload && (data?.session || data?.user)) window.location.reload();
  };
  const stopped = (error) => {
    clearTimeout(safety.current);
    setBusy(null);
    try { sessionStorage.removeItem('vmx-chula-welcome'); } catch { /* private mode */ }
    setProblem(problemOf(error));
  };

  const run = async (kind, action, { reloadOnSession = false } = {}) => {
    if (busy) return;
    begin(kind);
    try {
      const result = await action();
      // Linking in place (no redirect) changes what every part of the app may read:
      // start it again clean, and the door opens on the far side.
      if (reloadOnSession && (result?.session || result?.user)) window.location.reload();
    } catch (error) {
      try { sessionStorage.removeItem('vmx-chula-welcome'); } catch { /* private mode */ }
      setProblem(problemOf(error));
    } finally {
      clearTimeout(safety.current);
      setBusy(null);
    }
  };

  const hd = staff ? CHULA_HD.staff : CHULA_HD.student;
  const redirectChula = () => run('chula', () => signInWithGoogle({ hd }));
  const redirectLink = () => run('link', () => signInWithGoogle({ hd: CHULA_HD.student, link: true }), { reloadOnSession: true });
  const useOther = async () => {
    setBusy('signout');
    try { await signOut(); } catch { /* the local session is gone either way */ }
    setBusy(null);
    setProblem(null);
  };
  const passwordSignIn = (event) => {
    event.preventDefault();
    if (!email.trim() || !password) return;
    run('password', () => signInWithEmail(email.trim(), password));
  };

  const pose = state === 'link' ? 'curious' : state === 'checking' ? 'loading' : 'wave';
  const mochi = <img className="vmx-gate-mochi" src={MOCHI_POSE_ASSETS[pose] || MOCHI_POSE_ASSETS.idle} alt="" width="88" height="88" decoding="async" />;
  const scene = (
    <div className="vmx-gate-scene" aria-hidden="true"><span className="vmx-gate-floor" /><span className="vmx-gate-radar" /></div>
  );
  const top = (
    <header className="vmx-gate-top">
      <span className="vmx-gate-wordmark" aria-label="VetMock">Vet<span>Mock</span></span>
      {onAbout ? <button type="button" className="vmx-gate-quiet" onClick={onAbout}>VetMock คืออะไร</button> : null}
    </header>
  );

  if (state === 'checking') {
    return (
      <div className="vmx-gate" aria-busy="true">
        {scene}
        {top}
        <main className="vmx-gate-checking">
          <h1 ref={heading} tabIndex={-1} className="vmx-sr-only">กำลังตรวจบัญชี</h1>
          {mochi}
          <span className="vmx-gate-checking-text">กำลังตรวจบัญชี</span>
        </main>
        <footer />
      </div>
    );
  }

  const offlineNote = !online && !problem ? <Notice kind="offline" /> : null;
  const foot = (
    <footer className="vmx-gate-foot">
      <p>VetMock รับแค่ชื่อ อีเมล และรูปโปรไฟล์จาก Google เป็นแพลตฟอร์มอิสระ ไม่ใช่ระบบทางการของจุฬาฯ</p>
      <div className="vmx-gate-foot-links"><a href="/app/privacy">ความเป็นส่วนตัวและข้อตกลง</a><HelpForm /></div>
    </footer>
  );

  if (state === 'link') {
    const current = user?.email || user?.user_metadata?.email || 'บัญชีนี้';
    return (
      <div className="vmx-gate">
        {scene}
        {top}
        <main className="vmx-gate-main vmx-gate-rise">
          <div className="vmx-gate-hello">
            {mochi}
            <h1 ref={heading} tabIndex={-1} className="vmx-gate-title">เชื่อมบัญชีจุฬา</h1>
          </div>
          <p className="vmx-gate-lead">บัญชีนี้ยังไม่ได้ผูกกับอีเมลจุฬา กดปุ่ม Google แล้วเลือกอีเมลจุฬาของคุณ ความคืบหน้าเดิมอยู่ครบ</p>
          <section className="vmx-gate-id" data-play="1" aria-label="บัญชีที่จะเชื่อม">
            <span className="vmx-gate-corner" data-c="tl" /><span className="vmx-gate-corner" data-c="tr" />
            <span className="vmx-gate-corner" data-c="bl" /><span className="vmx-gate-corner" data-c="br" />
            <div className="vmx-gate-link-from"><strong>{current}</strong><span className="vmx-gate-tag">ยังไม่ใช่อีเมลจุฬา</span></div>
            <span className="vmx-gate-wire" aria-hidden="true" />
            <ChulaAddress local="รหัสนิสิต" />
            <p className="vmx-gate-caption">ไม่ต้องพิมพ์ เลือกบัญชีนี้ในหน้าต่างของ Google</p>
          </section>
          <div aria-live="polite">
            {problem ? (
              <Notice kind={problem}>
                {problem === 'identity-taken' ? (
                  <div className="vmx-gate-note-actions">
                    <button type="button" className="vmx-gate-chip-btn" onClick={useOther} disabled={Boolean(busy)}>เข้าบัญชีจุฬานั้นแทน</button>
                  </div>
                ) : null}
              </Notice>
            ) : offlineNote}
          </div>
          <div className="vmx-gate-actions">
            {inApp ? <InAppNote app={inApp} /> : (
              <GoogleSignIn
                hd={CHULA_HD.student} link label="ดำเนินการต่อด้วย Google" busy={busy === 'link'}
                onBegin={() => begin('link')} onSession={(data) => landed(data, { reload: true })} onFail={stopped}
                onRedirect={redirectLink}
              />
            )}
            <button type="button" className="vmx-gate-quiet" onClick={useOther} disabled={Boolean(busy)}>ใช้บัญชีอื่น</button>
          </div>
        </main>
        {foot}
      </div>
    );
  }

  return (
    <div className="vmx-gate">
      {scene}
      {top}
      <main className="vmx-gate-main vmx-gate-rise">
        <div className="vmx-gate-hello">
          {mochi}
          <h1 ref={heading} tabIndex={-1} className="vmx-gate-title">เข้าสู่ระบบด้วยอีเมลจุฬา</h1>
        </div>
        <p className="vmx-gate-lead">กดปุ่ม Google ด้านล่าง แล้วเลือกอีเมลจุฬาของคุณ</p>
        <section className="vmx-gate-id" data-play="1" aria-label="อีเมลที่ใช้เข้าสู่ระบบ">
          <span className="vmx-gate-corner" data-c="tl" /><span className="vmx-gate-corner" data-c="tr" />
          <span className="vmx-gate-corner" data-c="bl" /><span className="vmx-gate-corner" data-c="br" />
          <ChulaAddress local={staff ? 'ชื่อ' : 'รหัสนิสิต'} domain={staff ? '@chula.ac.th' : DOMAIN} />
          <p className="vmx-gate-caption">ไม่ต้องพิมพ์ เลือกบัญชีนี้ในหน้าต่างของ Google</p>
        </section>
        <div aria-live="polite">{problem ? <Notice kind={problem} /> : offlineNote}</div>
        <div className="vmx-gate-actions">
          {inApp ? <InAppNote app={inApp} /> : (
            <>
              {legacyGoogle ? <p className="vmx-gate-caption">ใช้ปุ่ม Google ในหัวข้อบัญชีเดิมด้านล่าง</p> : (
                <GoogleSignIn
                  hd={hd} label="ดำเนินการต่อด้วย Google" busy={busy === 'chula'}
                  onBegin={() => begin('chula')} onSession={landed} onFail={stopped}
                  onRedirect={redirectChula}
                />
              )}
              <button type="button" className="vmx-gate-quiet" onClick={() => { setStaff(!staff); setLegacyGoogle(false); }} disabled={Boolean(busy)}>
                {staff ? 'นิสิตใช้ @student.chula.ac.th' : 'บุคลากรใช้ @chula.ac.th'}
              </button>
            </>
          )}
        </div>
        <details className="vmx-gate-other">
          <summary>เคยใช้ VetMock ด้วยอีเมลอื่น</summary>
          <div className="vmx-gate-other-body">
            <p>เข้าบัญชีเดิมก่อน แล้วเชื่อมกับอีเมลจุฬา ความคืบหน้าอยู่ครบ บัญชีใหม่สร้างได้ด้วยอีเมลจุฬาเท่านั้น</p>
            <div className="vmx-gate-row">
              {!inApp && !legacyGoogle ? <button type="button" className="vmx-gate-chip-btn" onClick={() => setLegacyGoogle(true)} disabled={Boolean(busy)}><img src="/brand/google-g.svg" alt="" width="18" height="18" />Google บัญชีเดิม</button> : null}
              <button type="button" className="vmx-gate-chip-btn" onClick={() => setForm(form === 'password' ? null : 'password')} aria-expanded={form === 'password'} disabled={Boolean(busy)}>อีเมลและรหัสผ่าน</button>
              {!inApp && isPasskeySupported() ? <button type="button" className="vmx-gate-chip-btn" onClick={() => run('passkey', () => signInWithPasskey())} disabled={Boolean(busy)}>Passkey</button> : null}
            </div>
            {legacyGoogle && !inApp ? (
              <GoogleSignIn
                label="Google บัญชีเดิม" busy={busy === 'google'}
                onBegin={() => begin('google')} onSession={landed} onFail={stopped}
                onRedirect={() => run('google', () => signInWithGoogle())}
              />
            ) : null}
            {form === 'password' ? (
              <form className="vmx-gate-form" onSubmit={passwordSignIn}>
                <label htmlFor="vmx-gate-email">อีเมล</label>
                <input id="vmx-gate-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label htmlFor="vmx-gate-password">รหัสผ่าน</label>
                <input id="vmx-gate-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" className={`vmx-gate-chip-btn${busy === 'password' ? ' vmx-gate-busy' : ''}`} disabled={Boolean(busy)}>{busy === 'password' ? 'กำลังเข้าสู่ระบบ' : 'เข้าบัญชีเดิม'}</button>
              </form>
            ) : null}
          </div>
        </details>
      </main>
      {foot}
    </div>
  );
}

/** The door: the gate's last frame, opened over the app once after a sign-in. */
export function ChulaGateExit({ user, onDone }) {
  const [phase, setPhase] = useState('hold');
  const email = chulaEmailOf(user) || user?.email || '';
  const at = email.indexOf('@');
  const name = String(user?.user_metadata?.full_name || user?.user_metadata?.name || '').trim().split(/\s+/)[0];
  useEffect(() => {
    const reduced = reducedMotion();
    const hold = reduced ? 700 : 260 + 32 * Math.max(0, email.length - Math.max(0, at)) + 360;
    const open = setTimeout(() => setPhase('open'), hold);
    const done = setTimeout(onDone, hold + (reduced ? 160 : 760));
    return () => { clearTimeout(open); clearTimeout(done); };
  }, [email, at, onDone]);
  // Each half shows its own half of the same card; only the lower one plays,
  // and the address sits wholly below the seam.
  const card = (play) => (
    <div className="vmx-gate-exit-card">
      <img src={MOCHI_POSE_ASSETS.happy || MOCHI_POSE_ASSETS.idle} alt="" width="64" height="64" />
      <p className="vmx-gate-exit-hello">{name ? `ยินดีต้อนรับ ${name}` : 'ยินดีต้อนรับ'}</p>
      {at > 0 ? <ChulaAddress local={email.slice(0, at)} domain={email.slice(at)} play={play} /> : null}
    </div>
  );
  return (
    <div className="vmx-gate-exit" data-phase={phase}>
      <p role="status" className="vmx-sr-only">เข้าสู่ระบบแล้ว ยินดีต้อนรับ</p>
      <div className="vmx-gate-exit-half" data-h="top" aria-hidden="true">{card(false)}</div>
      <div className="vmx-gate-exit-half" data-h="bottom" aria-hidden="true">{card(true)}</div>
    </div>
  );
}
