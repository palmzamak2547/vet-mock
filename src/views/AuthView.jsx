import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithLine,
  signInWithDiscord,
  signInWithMagicLink,
  resendVerificationEmail,
  sendPasswordReset,
  updatePassword,
  isUsernameAvailable,
  migrateLocalToCloud,
  getSupabase,
} from '../lib/supabase.js';

// OAuth setup help — opens when LINE/Apple errors with
// PROVIDER_NOT_CONFIGURED. Lazy so the main signin path doesn't
// pay the bundle cost.
const OAuthSetupHelp = lazy(() => import('../components/OAuthSetupHelp.jsx'));
import { thaiAuthError } from '../lib/auth-errors.js';
import {
  deriveUsernameFromEmail,
  sanitizeUsername,
  validateUsername,
  passwordStrength,
} from '../lib/auth-utils.js';

// AuthView — sign in / sign up / forgot password
//
// Modes:
//   'signin'  → email + password Login
//   'signup'  → username + email + password
//   'reset'   → email-only, sends reset link via Supabase
//
// UX features (Level 2):
//   • Thai error messages (lib/auth-errors.js)
//   • Show/hide password toggle (👁)
//   • Forgot password flow + success banner
//   • Defensive email-confirmation hint when signup returns no session
//   • Already-signed-in detection (auto-redirect via prop)
//
// Smart features (Level 3) layer on top of this in a follow-up commit.
export default function AuthView({ onBack, onSuccess, user }) {
  // Detect password-reset deep link (`?auth=reset`) on mount so the
  // initial mode lands users straight into the update-password flow.
  // When user clicks the link in their reset email, Supabase's SDK
  // (with detectSessionInUrl) auto-creates a temporary "recovery"
  // session — meaning `user` is already populated by the time we
  // render. We therefore can't auto-redirect on `user` (BUG 7) until
  // AFTER deciding mode, otherwise the recovery flow bounces home.
  const initialMode = (() => {
    if (typeof window === 'undefined') return 'signin';
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('auth') === 'reset') return 'update-password';
    } catch {}
    return 'signin';
  })();
  const [mode, setMode] = useState(initialMode); // signin | signup | reset | update-password | magic-link

  // Stay signed in (persist session). Default true (most users want).
  // Stored in localStorage so the choice survives refresh / OAuth bounce.
  const [staySignedIn, setStaySignedIn] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      const saved = window.localStorage.getItem('vmx-stay-signed-in');
      return saved === null ? true : saved === '1';
    } catch { return true; }
  });
  useEffect(() => {
    try { window.localStorage.setItem('vmx-stay-signed-in', staySignedIn ? '1' : '0'); } catch {}
  }, [staySignedIn]);

  // Track recent failed attempts (rate-limit hint UI)
  const [attemptCount, setAttemptCount] = useState(0);

  // BUG 7 — already signed in → bounce to home immediately, EXCEPT
  // when we landed here via a password-reset link (in which case the
  // existing session is the recovery session and we want to stay).
  useEffect(() => {
    if (user && mode !== 'update-password' && onSuccess) onSuccess();
  }, [user, mode, onSuccess]);

  // Preload Supabase SDK as soon as the auth screen is open. The SDK
  // is a 190KB chunk, lazy by default; without preload, the user pays
  // for the download AFTER they've typed their credentials and hit
  // submit, which adds 200-500ms of perceived "submit lag" on top of
  // the actual signin round-trip. Kicking off the import now means
  // the chunk is usually ready before they finish typing.
  //
  // This also doubles as the fix for the password-reset deep link:
  // recovery flow puts an access_token in the URL hash that needs
  // createClient's detectSessionInUrl to swap into a session, and
  // createClient only runs on the first getSupabase() call. Loading
  // here ensures the hash is consumed in time for form submit.
  useEffect(() => {
    getSupabase().catch(() => {});
  }, []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [emailVerifyPending, setEmailVerifyPending] = useState(null); // null | { email }

  // ── Google GIS button mount (inline, no Supabase URL flash) ──
  // When VITE_GOOGLE_CLIENT_ID is configured, render the official
  // Google Identity Services button into gisButtonRef. The button
  // triggers a Google-hosted popup that returns an ID token directly
  // to this page → supabase.signInWithIdToken → session established.
  // No browser redirect through <project>.supabase.co/auth/v1/callback,
  // so the user never sees the raw Supabase URL.
  const gisButtonRef = useRef(null);
  const [gisReady, setGisReady] = useState(false);
  useEffect(() => {
    if (mode === 'reset' || mode === 'update-password' || mode === 'magic-link') return;
    if (!gisButtonRef.current) return;
    let cleanup = null;
    (async () => {
      try {
        const supabase = await getSupabase();
        if (!supabase) return;
        const { isGoogleGisAvailable, renderGoogleGisButton } = await import('../lib/google-gis.js');
        if (!isGoogleGisAvailable()) return;
        const teardown = await renderGoogleGisButton(gisButtonRef.current, {
          supabase,
          theme: 'filled_blue',
          onSuccess: () => { onSuccess?.(); },
          onError: (err) => {
            // Surface as inline error — covers cancelled popup, network,
            // ID token mismatch (rare). Keep the rendered button so the
            // user can retry without re-rendering the whole form.
            setError(thaiAuthError(err));
            setLoading(false);
          },
        });
        cleanup = teardown;
        setGisReady(true);
      } catch (err) {
        // GIS unavailable (offline, CSP, env missing) — keep fallback
        // custom button visible. Silent — the fallback path still works.
        if (err?.message !== 'NO_GOOGLE_CLIENT_ID') {
          console.warn('[auth] GIS button render failed', err);
        }
      }
    })();
    return () => { try { cleanup?.(); } catch { /* noop */ } };
    // mode is in deps so the button re-mounts when user switches back
    // to signin from a hidden mode. onSuccess is stable from App.jsx.
  }, [mode, onSuccess]);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  // ── Smart UX state ──
  const [usernameTouched, setUsernameTouched] = useState(false);
  // 'idle' | 'invalid' | 'checking' | 'available' | 'taken' | 'unknown'
  const [usernameStatus, setUsernameStatus] = useState('idle');
  const usernameDebounceRef = useRef(null);

  // Reset banners when switching modes
  useEffect(() => {
    setError(''); setInfo(''); setEmailVerifyPending(null);
  }, [mode]);

  // ── OAuth cancel/error detection ──
  // When a user clicks an OAuth button and then cancels/back-navigates
  // on the provider screen, the provider redirects us back with an
  // error fragment in the URL (#error=access_denied / ?error=...).
  // Without this guard, the user lands on AuthView again with no
  // context — they re-click the same button and feel like the system
  // is broken. We parse, show a friendly Thai message, and clean the
  // URL so refreshing doesn't re-trigger.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    const re = /(?:^|[#?&])error=([^&]+)/;
    const errMatch = hash.match(re) || search.match(re);
    if (!errMatch) return;
    const errCode = decodeURIComponent(errMatch[1] || '');
    const descMatch = (hash + search).match(/error_description=([^&]+)/);
    const desc = descMatch ? decodeURIComponent(descMatch[1].replace(/\+/g, ' ')) : '';
    if (/access_denied|user.*denied|cancel/i.test(errCode + desc)) {
      setError('🚪 การ Login ถูกยกเลิก — ลองอีกครั้งหรือเลือก provider อื่น');
    } else if (/server_error|temporarily_unavailable/i.test(errCode)) {
      setError('⚠️ Provider login มีปัญหาชั่วคราว — ลองอีกครั้งใน 1-2 นาที');
    } else {
      setError(`⚠️ Login ไม่สำเร็จ${desc ? ': ' + desc : ''} — ลองอีกครั้ง`);
    }
    // Clean URL so refresh doesn't re-trigger this banner
    try {
      window.history.replaceState(null, '', window.location.pathname);
    } catch { /* noop */ }
  }, []);

  // ── Resend verification email — 60s cooldown ──
  const [resendCooldown, setResendCooldown] = useState(0);
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);
  const handleResendVerify = async () => {
    if (!emailVerifyPending?.email || resendCooldown > 0) return;
    setError(''); setInfo('');
    try {
      await resendVerificationEmail(emailVerifyPending.email);
      setInfo('✓ ส่งอีเมลยืนยันใหม่แล้ว — เช็ค inbox + junk folder');
      setResendCooldown(60);
    } catch (err) {
      const msg = err?.message || '';
      // Supabase often returns "Email rate limit exceeded" with no
      // explicit duration — default to 60s in that case.
      if (/rate|too many|429/i.test(msg)) {
        setError('⏱ ส่งใหม่บ่อยเกินไป — รอ 60 วินาทีแล้วลอง');
        setResendCooldown(60);
      } else {
        setError(thaiAuthError(err));
      }
    }
  };

  // ── Rate-limit countdown for submit ──
  // When Supabase returns 429 on signin/signup, the helpful UX is a
  // visible "try again in N seconds" timer instead of a vague
  // "ลองมากเกินไป" string. Parse the wait hint from Supabase's error
  // message when present, else default to 60s.
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);
  useEffect(() => {
    if (rateLimitCountdown <= 0) return;
    const id = setInterval(() => setRateLimitCountdown((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(id);
  }, [rateLimitCountdown]);

  // ── Smart: auto-suggest username from email (signup only) ──
  // Only fires when the user hasn't manually edited the username yet.
  // Once they touch it, we stop auto-overwriting their choice.
  useEffect(() => {
    if (mode !== 'signup') return;
    if (usernameTouched) return;
    const suggested = deriveUsernameFromEmail(email);
    if (suggested && suggested !== username) setUsername(suggested);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally not depending on `username` to avoid feedback loop
  }, [email, mode, usernameTouched]);

  // ── Smart: real-time username availability (debounced 500ms) ──
  useEffect(() => {
    if (mode !== 'signup') return;

    // Validate locally first — skip the network call for invalid input
    const v = validateUsername(username);
    if (!v.ok) {
      setUsernameStatus(username.length === 0 ? 'idle' : 'invalid');
      return;
    }
    setUsernameStatus('checking');

    if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current);
    usernameDebounceRef.current = setTimeout(async () => {
      const result = await isUsernameAvailable(username);
      // Result: true (free) | false (taken) | null (unknown / no Supabase)
      if (result === true) setUsernameStatus('available');
      else if (result === false) setUsernameStatus('taken');
      else setUsernameStatus('unknown');
    }, 500);

    return () => {
      if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current);
    };
  }, [username, mode]);

  const submit = async (e) => {
    e?.preventDefault();
    setError(''); setInfo(''); setEmailVerifyPending(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        if (!username.trim()) throw new Error('กรุณาใส่ชื่อ username');
        if (password.length < 6) throw new Error('รหัสผ่านต้องยาว 6 ตัวขึ้นไป');
        const result = await signUpWithEmail(email, password, username.trim());
        // If Supabase returned a session → email confirmation is OFF, user is in.
        // Run the anon→cloud migration FIRST (before any pullUserData fires
        // and overwrites their local progress with an empty cloud row).
        if (result?.session) {
          try {
            const migration = await migrateLocalToCloud();
            if (migration?.migrated) {
              console.info('[auth] migrated local progress to cloud:', migration.counts);
            }
          } catch (mErr) {
            // Migration failure is non-fatal — local data still exists.
            console.warn('[auth] migration failed:', mErr);
          }
          if (onSuccess) onSuccess();
          return;
        }
        // No session → either email-confirmation is ON, or sign-in needed
        try {
          await signInWithEmail(email, password);
          // Migrate after the immediate post-signup sign-in succeeds so the
          // session exists when the upsert runs.
          try { await migrateLocalToCloud(); } catch {}
          if (onSuccess) onSuccess();
        } catch (signInErr) {
          // Most common reason: email confirmation pending
          const msg = thaiAuthError(signInErr);
          if (/ยืนยันอีเมล|confirm/i.test(msg) || /not confirmed/i.test(signInErr.message || '')) {
            setEmailVerifyPending({ email });
          } else {
            setInfo('✓ สมัครสำเร็จ! ลอง Login ด้วย email + password ของคุณ');
            setMode('signin');
          }
        }
      } else if (mode === 'reset') {
        if (!email.trim()) throw new Error('กรุณาใส่อีเมล');
        await sendPasswordReset(email.trim());
        setInfo(`✓ ส่งลิงก์รีเซ็ตรหัสผ่านไปที่ ${email} แล้ว — เช็คอีเมล (รวม junk folder)`);
      } else if (mode === 'update-password') {
        if (newPassword.length < 6) throw new Error('รหัสผ่านใหม่ต้องยาว 6 ตัวขึ้นไป');
        if (newPassword !== newPasswordConfirm) throw new Error('รหัสผ่านยืนยันไม่ตรงกัน');
        await updatePassword(newPassword);
        setInfo('✓ เปลี่ยนรหัสผ่านสำเร็จ');
        // Clean the ?auth=reset query param from URL so refreshing
        // doesn't re-trigger this mode forever.
        try { window.history.replaceState(null, '', window.location.pathname); } catch {}
        setTimeout(() => { if (onSuccess) onSuccess(); }, 1200);
      } else if (mode === 'magic-link') {
        if (!email.trim()) throw new Error('กรุณาใส่อีเมล');
        await signInWithMagicLink(email.trim());
        setInfo(`✓ ส่งลิงก์ login ไปที่ ${email} แล้ว — กดลิงก์ในอีเมลเพื่อเข้าระบบ (ลิงก์ใช้ได้ 1 ครั้ง, 1 ชั่วโมง)`);
      } else {
        // signin
        await signInWithEmail(email, password);
        setAttemptCount(0);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      const isRateLimit = /rate|too many|429/i.test(err?.message || '');
      const isInvalidCreds = /invalid|wrong|incorrect|password/i.test(err?.message || '');
      if (mode === 'signin' && isInvalidCreds) {
        setAttemptCount((n) => n + 1);
      }
      if (isRateLimit) {
        // Try to extract the wait hint from the message; Supabase
        // sometimes includes "after N seconds" or similar. Default 60s.
        const m = (err?.message || '').match(/(\d+)\s*(seconds?|วินาที)/i);
        const wait = m ? Math.min(120, Math.max(5, parseInt(m[1], 10))) : 60;
        setRateLimitCountdown(wait);
        setError(`⏱ ลองมากเกินไป — รอ ${wait} วินาทีแล้วลองใหม่`);
      } else {
        setError(thaiAuthError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  // OAuth providers that may not be configured in Supabase yet (LINE,
  // Discord). Surface a friendly Thai inline message PLUS open a setup-
  // help modal that walks through every dashboard step with the exact
  // callback URL to paste. The modal is reusable across all providers.
  const [oauthHelp, setOauthHelp] = useState(null); // null | {provider, rawError}

  // OAuth click → safety timeout. signInWithOAuth normally redirects
  // the browser away (so this state doesn't matter), but if the SDK
  // throws synchronously OR the popup is silently cancelled, the
  // loading=true persists and locks every other button incl. submit.
  // The 12s timeout is a backstop — way longer than any reasonable
  // redirect, way shorter than the user's patience.
  const oauthTimeoutRef = useRef(null);
  const beginOauth = () => {
    setError(''); setInfo(''); setLoading(true);
    if (oauthTimeoutRef.current) clearTimeout(oauthTimeoutRef.current);
    oauthTimeoutRef.current = setTimeout(() => setLoading(false), 12_000);
  };
  const endOauth = () => {
    if (oauthTimeoutRef.current) { clearTimeout(oauthTimeoutRef.current); oauthTimeoutRef.current = null; }
    setLoading(false);
  };
  useEffect(() => () => { if (oauthTimeoutRef.current) clearTimeout(oauthTimeoutRef.current); }, []);

  const google = async () => {
    beginOauth();
    try { await signInWithGoogle(); }
    catch (err) { setError(thaiAuthError(err)); }
    finally { endOauth(); }
  };

  const lineLogin = async () => {
    beginOauth();
    try { await signInWithLine(); }
    catch (err) {
      if (err?.message?.startsWith('PROVIDER_NOT_CONFIGURED:')) {
        setError('LINE login ยังไม่เปิด — ดูขั้นตอนตั้งค่าด้านล่าง 👇');
        setOauthHelp({ provider: 'line', rawError: err.rawMessage || err.message });
      } else {
        setError(thaiAuthError(err));
      }
    }
    finally { endOauth(); }
  };
  const discordLogin = async () => {
    beginOauth();
    try { await signInWithDiscord(); }
    catch (err) {
      if (err?.message?.startsWith('PROVIDER_NOT_CONFIGURED:')) {
        setError('Discord login ยังไม่เปิด — ดูขั้นตอนตั้งค่าด้านล่าง 👇');
        setOauthHelp({ provider: 'discord', rawError: err.rawMessage || err.message });
      } else {
        setError(thaiAuthError(err));
      }
    }
    finally { endOauth(); }
  };

  // ── Heading text per mode ──
  const heading = {
    signin:           { title: 'ยินดีต้อนรับ',     sub: 'Login เพื่อ sync progress และ join group กับเพื่อน',  cta: 'Login' },
    signup:           { title: 'สมัครใช้งาน',     sub: 'สร้าง account ใหม่ — ฟรี ไม่มีค่าใช้จ่าย',           cta: 'สมัคร' },
    reset:            { title: 'ลืมรหัสผ่าน?',    sub: 'ใส่อีเมลของคุณ เราจะส่งลิงก์รีเซ็ตให้',                cta: 'ส่งลิงก์รีเซ็ต' },
    'update-password':{ title: 'ตั้งรหัสผ่านใหม่', sub: 'ใส่รหัสผ่านใหม่ที่อยากใช้',                          cta: 'บันทึกรหัสผ่าน' },
    'magic-link':     { title: 'Login ผ่านอีเมล',  sub: 'ไม่ต้องจำรหัสผ่าน — เราจะส่งลิงก์ login ไปที่อีเมลคุณ',  cta: '✨ ส่งลิงก์ login' },
  }[mode];

  return (
    <>
      <div className="vmx-hero">
        <h1>{heading.title} <em>VetMock</em></h1>
        <p>{heading.sub}</p>
      </div>

      <div className="vmx-config-panel" style={{ maxWidth: 440, margin: '0 auto' }}>
        {/* Email-verification pending banner */}
        {emailVerifyPending && (
          <div style={{ padding: 14, borderRadius: 12, background: 'rgba(184, 137, 64, 0.12)', border: '1px solid var(--clr-gold)', marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
            📧 <strong>ตรวจอีเมลของคุณ</strong><br/>
            <span style={{ color: 'var(--clr-ink-soft)' }}>
              เราส่งลิงก์ยืนยันไปที่ <code>{emailVerifyPending.email}</code>, คลิกลิงก์นั้นเพื่อยืนยันก่อน Login (อาจอยู่ใน junk/spam)
            </span>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleResendVerify}
                disabled={resendCooldown > 0}
                className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                style={{ minHeight: 32, fontSize: 12 }}
              >
                {resendCooldown > 0 ? `รอ ${resendCooldown}s` : '↻ ส่งใหม่'}
              </button>
              <button
                type="button"
                onClick={() => { setEmailVerifyPending(null); setMode('signin'); }}
                className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                style={{ minHeight: 32, fontSize: 12 }}
              >
                ✓ ยืนยันแล้ว — ไป Login
              </button>
            </div>
          </div>
        )}

        {/* Google OAuth + Magic Link — hide on reset / update / magic-link itself */}
        {mode !== 'reset' && mode !== 'update-password' && mode !== 'magic-link' && (
          <>
            {/* Official Google Identity Services button — renders inline
                when VITE_GOOGLE_CLIENT_ID is configured. Triggers a
                Google-hosted popup that returns an ID token directly to
                this page, so the user never sees the "<project>.supabase.co"
                URL flash that the redirect-based fallback exposes.
                Mounted as a useEffect below; this div is the container. */}
            <div
              ref={gisButtonRef}
              style={{
                width: '100%',
                minHeight: gisReady ? 44 : 0,
                marginBottom: gisReady ? 8 : 0,
                display: gisReady ? 'flex' : 'none',
                justifyContent: 'center',
              }}
              aria-label="เข้าสู่ระบบด้วย Google"
            />
            {/* Fallback custom-styled button — only shown when GIS isn't
                available (no env var, script load failure, etc.). Uses
                signInWithOAuth redirect which DOES flash the Supabase URL
                briefly; acceptable as fallback only. */}
            {!gisReady && (
              <button className="vmx-btn vmx-btn-ghost" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginBottom: 8 }} onClick={google} disabled={loading}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  เข้าสู่ระบบด้วย Google
                </span>
              </button>
            )}

            {/* LINE OAuth — Thailand-popular. Provider config in Supabase
                Dashboard → Auth → Providers → Line; until then the click
                surfaces a friendly Thai message. */}
            <button
              type="button"
              className="vmx-btn vmx-btn-ghost"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginBottom: 8, background: '#06C755', color: '#fff', borderColor: '#06C755' }}
              onClick={lineLogin}
              disabled={loading}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                {/* Simple LINE chat-bubble — distinctive curved-square
                    bubble silhouette. Wordmark in the icon was too
                    small to read at 20px (and the button label already
                    says "LINE"), so we drop the inner letters. */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C5.92 2 1 5.97 1 10.86c0 4.39 3.91 8.07 9.19 8.77.36.08.85.24.97.55.11.28.07.71.04.99l-.16 1.15c-.05.34-.27 1.34 1.17.73 1.44-.61 7.77-4.58 10.6-7.84C24.32 13.07 25 11.55 25 9.86 25 4.97 19.08 1 13 1z" transform="translate(-1 1)"/>
                </svg>
                เข้าสู่ระบบด้วย LINE
              </span>
            </button>

            {/* Discord OAuth — replaces Apple ($99/yr) with a free
                option popular in the student community. Supabase
                supports Discord as a native OAuth provider. */}
            <button
              type="button"
              className="vmx-btn vmx-btn-ghost"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginBottom: 8, background: '#5865F2', color: '#fff', borderColor: '#5865F2' }}
              onClick={discordLogin}
              disabled={loading}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                เข้าสู่ระบบด้วย Discord
              </span>
            </button>

            {/* Magic Link button (only on signin mode) */}
            {mode === 'signin' && (
              <button
                type="button"
                className="vmx-btn vmx-btn-ghost"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', marginBottom: 20 }}
                onClick={() => setMode('magic-link')}
                disabled={loading}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  ✨ Login ผ่านลิงก์ในอีเมล (ไม่ต้องใช้รหัสผ่าน)
                </span>
              </button>
            )}

            {mode !== 'signin' && <div style={{ height: 12 }} />}

            <div style={{ textAlign: 'center', margin: '16px 0', fontSize: 12, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace' }}>
              — หรือใช้อีเมล + รหัสผ่าน —
            </div>
          </>
        )}

        <form onSubmit={submit} noValidate>
          {mode === 'signup' && (
            <div className="vmx-form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>ชื่อแสดง (Username)</span>
                <UsernameStatusBadge status={usernameStatus} username={username} />
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  if (!usernameTouched) setUsernameTouched(true);
                  setUsername(sanitizeUsername(e.target.value));
                }}
                placeholder="เช่น vet86_ping"
                maxLength={30}
                autoComplete="username"
              />
              <div style={{ marginTop: 4, fontSize: 11, color: 'var(--clr-ink-soft)', minHeight: 16 }}>
                {(() => {
                  const v = validateUsername(username);
                  if (username && !v.ok) return `⚠️ ${v.reason}`;
                  if (usernameStatus === 'taken') return '❌ ชื่อนี้ถูกใช้ไปแล้ว — ลองชื่ออื่น';
                  if (usernameStatus === 'available') return '✓ ชื่อนี้ใช้ได้';
                  if (usernameStatus === 'checking') return '… ตรวจอยู่';
                  return 'ใช้ได้: a-z, A-Z, 0-9, _, ความยาว 3-30';
                })()}
              </div>
            </div>
          )}

          {mode !== 'update-password' && (
            <div className="vmx-form-group">
              <label>อีเมล</label>
              <input
                type="text"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                maxLength={254}
              />
            </div>
          )}

          {mode === 'signin' || mode === 'signup' ? (
            <div className="vmx-form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>รหัสผ่าน</span>
                {mode === 'signin' && (
                  <a
                    onClick={() => setMode('reset')}
                    style={{ cursor: 'pointer', color: 'var(--clr-sage)', fontSize: 11, fontWeight: 400, textDecoration: 'underline' }}
                  >
                    ลืมรหัสผ่าน?
                  </a>
                )}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'อย่างน้อย 6 ตัว' : ''}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  style={{ paddingRight: 44, width: '100%', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  style={{
                    position: 'absolute',
                    right: 6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 6,
                    fontSize: 16,
                    color: 'var(--clr-ink-soft)',
                    lineHeight: 1,
                  }}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              {mode === 'signup' && password && <PasswordStrengthBar password={password} />}
            </div>
          ) : null}

          {mode === 'update-password' && (
            <>
              <div className="vmx-form-group">
                <label>รหัสผ่านใหม่</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="อย่างน้อย 6 ตัว"
                  autoComplete="new-password"
                />
                {newPassword && <PasswordStrengthBar password={newPassword} />}
              </div>
              <div className="vmx-form-group">
                <label>ยืนยันรหัสผ่านใหม่</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  placeholder="พิมพ์ซ้ำให้ตรง"
                  autoComplete="new-password"
                />
              </div>
              <div style={{ marginBottom: 12, fontSize: 12, color: 'var(--clr-ink-soft)' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
                  แสดงรหัสผ่าน
                </label>
              </div>
            </>
          )}

          {/* Stay signed in toggle — visible on signin/signup only */}
          {(mode === 'signin' || mode === 'signup') && (
            <div style={{ marginBottom: 12, fontSize: 12, color: 'var(--clr-ink-soft)' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={staySignedIn}
                  onChange={(e) => setStaySignedIn(e.target.checked)}
                />
                จดจำ session — login ค้างไว้ แม้ปิดเว็บ
              </label>
            </div>
          )}

          {/* Rate-limit / multiple-failure warning */}
          {mode === 'signin' && attemptCount >= 3 && (
            <div style={{ padding: 10, borderRadius: 8, background: 'rgba(184, 137, 64, 0.12)', border: '1px solid var(--clr-gold)', color: 'var(--clr-ink)', fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>
              ⚠️ ลองผิดมาแล้ว <strong>{attemptCount} ครั้ง</strong> — ถ้าลืมรหัส {' '}
              <a onClick={() => setMode('reset')} style={{ ...linkStyle, fontSize: 12 }}>กดที่นี่</a>
              {' '}เพื่อรีเซ็ต หรือใช้ {' '}
              <a onClick={() => setMode('magic-link')} style={{ ...linkStyle, fontSize: 12 }}>magic link</a>
              {' '}แทน
            </div>
          )}

          {error && (
            <div style={{ padding: 10, borderRadius: 8, background: 'var(--clr-rose-soft)', color: 'var(--clr-ink)', fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>
              ⚠️ {error}
            </div>
          )}
          {info && (
            <div style={{ padding: 10, borderRadius: 8, background: 'rgba(74, 107, 74, 0.15)', color: 'var(--clr-ink)', fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>
              {info}
            </div>
          )}

          <button
            type="submit"
            className="vmx-btn vmx-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
            disabled={
              loading
              || rateLimitCountdown > 0
              // Block signup if username is known-bad (don't waste a round-trip)
              || (mode === 'signup' && (usernameStatus === 'taken' || usernameStatus === 'invalid'))
            }
          >
            {loading
              ? '⏳ ...'
              : rateLimitCountdown > 0
                ? `⏱ รอ ${rateLimitCountdown}s แล้วลองใหม่`
                : heading.cta}
          </button>
        </form>

        {/* Mode switch links */}
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--clr-ink-soft)' }}>
          {mode === 'signin' && (
            <>ยังไม่มี account? <a onClick={() => setMode('signup')} style={linkStyle}>สมัครเลย</a></>
          )}
          {mode === 'signup' && (
            <>มี account แล้ว? <a onClick={() => setMode('signin')} style={linkStyle}>Login</a></>
          )}
          {mode === 'reset' && (
            <>จำได้แล้ว? <a onClick={() => setMode('signin')} style={linkStyle}>กลับไป Login</a></>
          )}
          {mode === 'magic-link' && (
            <>อยากใช้รหัสผ่าน? <a onClick={() => setMode('signin')} style={linkStyle}>กลับไป Login ปกติ</a></>
          )}
        </div>
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 30, justifyContent: 'center' }}>
        <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={onBack}>
          ← ใช้งานแบบไม่ login (single-player)
        </button>
      </div>

      {/* OAuth setup help modal — opens when LINE/Apple errors with
          PROVIDER_NOT_CONFIGURED. Shows exact callback URL + dashboard
          steps so Palm (or any admin) can fix it inline. */}
      {oauthHelp && (
        <Suspense fallback={null}>
          <OAuthSetupHelp
            provider={oauthHelp.provider}
            rawError={oauthHelp.rawError}
            onClose={() => setOauthHelp(null)}
          />
        </Suspense>
      )}
    </>
  );
}

const linkStyle = { cursor: 'pointer', color: 'var(--clr-sage)', textDecoration: 'underline' };

// ── Username availability badge (shown next to the label) ───────
function UsernameStatusBadge({ status, username }) {
  if (!username) return null;
  if (status === 'idle' || status === 'unknown') return null;

  const styles = {
    checking:  { color: 'var(--clr-ink-soft)', text: '… ตรวจ' },
    available: { color: 'var(--clr-sage)',     text: '✓ ใช้ได้' },
    taken:     { color: 'var(--clr-rose)',     text: '✗ ถูกใช้แล้ว' },
    invalid:   { color: 'var(--clr-rose)',     text: '✗ รูปแบบไม่ถูก' },
  };
  const s = styles[status];
  if (!s) return null;
  return (
    <span style={{ fontSize: 11, fontWeight: 500, color: s.color, fontFamily: 'JetBrains Mono, monospace' }}>
      {s.text}
    </span>
  );
}

// ── Password strength bar + label ───────────────────────────────
function PasswordStrengthBar({ password }) {
  const s = passwordStrength(password);
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ height: 4, background: 'var(--clr-surface-2)', borderRadius: 999, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${s.percent}%`,
            background: s.color,
            transition: 'width 0.2s ease, background 0.2s ease',
          }}
        />
      </div>
      <div style={{ marginTop: 4, fontSize: 11, color: 'var(--clr-ink-soft)', display: 'flex', justifyContent: 'space-between' }}>
        <span>ความแข็งแรง: <strong style={{ color: s.color }}>{s.label}</strong></span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{password.length} ตัว</span>
      </div>
    </div>
  );
}
