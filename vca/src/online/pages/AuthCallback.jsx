// Where a sign-in comes back to. Google and an email link land on /auth/callback with the session
// in the address; LINE lands on /auth/line, where its sign-in carries on to VetMock's line-auth
// and back here. Either way the student returns to the page they left, and the address drops
// what it carried.

import { useEffect, useState } from 'react';
import { Link } from '../../components/Link.jsx';
import { Icon } from '../../components/Icon.jsx';
import { useTitle } from '../../lib/hooks.js';
import { navigate } from '../../router.js';
import { askSignIn } from '../ui/AccountButton.jsx';
import { Soon } from '../ui/bits.jsx';
import { MODE } from '../config.js';
import { ensureAccount, getBackend, takeReturn } from '../account.js';
import '../community.css';

function readable(message) {
  if (/expired|invalid|already been used|otp/i.test(message)) return 'ลิงก์นี้หมดอายุหรือถูกใช้ไปแล้ว ขอลิงก์ใหม่ได้เลย';
  if (/access_denied|cancel/i.test(message)) return 'ยกเลิกการเข้าสู่ระบบแล้ว';
  if (/failed to fetch|network/i.test(message)) return 'เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่';
  return 'เข้าสู่ระบบไม่สำเร็จ ลองอีกครั้ง';
}

export default function AuthCallback({ route }) {
  const via = route.params.via;
  const [problem, setProblem] = useState('');
  useTitle(problem ? 'เข้าสู่ระบบไม่สำเร็จ' : 'กำลังเข้าสู่ระบบ');

  useEffect(() => {
    if (MODE === 'off') return undefined;
    let live = true;
    (async () => {
      const b = await getBackend();
      if (via === 'line') {
        // Signed in with LINE now: trade its token for VetMock's sign-in link, which comes back
        // to /auth/callback.
        await b.auth.line();
        return;
      }
      const session = await b.auth.complete(window.location.href);
      if (!session) throw new Error('no session');
      await ensureAccount();
      if (live) navigate(takeReturn(), { replace: true });
    })().catch((err) => {
      if (!live) return;
      window.history.replaceState(null, '', window.location.pathname);
      setProblem(readable(String(err?.message || '')));
    });
    return () => { live = false; };
  }, [via]);

  if (MODE === 'off') return <Soon />;
  return (
    <div className="wrap auth-back">
      <div className="auth-card">
        {problem ? (
          <>
            <span className="auth-mark is-bad"><Icon name="info" size={24} /></span>
            <h1 className="auth-h">เข้าสู่ระบบไม่สำเร็จ</h1>
            <p className="auth-p">{problem}</p>
            <div className="auth-go">
              <button type="button" className="btn btn-ink" onClick={askSignIn}>ลองอีกครั้ง</button>
              <Link to="/" className="btn btn-ghost">กลับหน้าแรก</Link>
            </div>
          </>
        ) : (
          <>
            <span className="auth-mark"><span className="spinner" aria-hidden="true" /></span>
            <h1 className="auth-h">กำลังเข้าสู่ระบบ</h1>
            <p className="auth-p" role="status">{via === 'line' ? 'กำลังเชื่อมบัญชี LINE กับบัญชี VetMock ของคุณ' : 'อีกสักครู่จะพากลับไปหน้าที่เปิดค้างไว้'}</p>
          </>
        )}
      </div>
    </div>
  );
}
