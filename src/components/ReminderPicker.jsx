// ============================================================
// ReminderPicker — a daily study reminder, at a time the student picks
// ============================================================
// On the web the student's own calendar keeps it (lib/study-reminder.js):
// Google Calendar opens its "new event" page filled in, any other calendar
// gets one .ics. Inside the VetMock Android app (window.VetMockApp, defined
// by src/lib/native-app.js there) the app itself reminds, after the phone's
// own permission prompt, which only ever opens from this button.
// ============================================================

import { useEffect, useState } from 'react';
import { REMINDER_TIMES, DEFAULT_REMINDER, googleReminderUrl, reminderIcsUrl } from '../lib/study-reminder.js';

const appNotifications = () => (typeof window !== 'undefined' ? window.VetMockApp?.notifications : null) || null;

// The results page asks once, ever: after the first set of a day, never at
// first launch. Any answer (a calendar, the app's prompt, "ไม่ต้อง") ends it;
// the same picker stays on the connected-apps page for later.
const OFFER_KEY = 'vmx-reminder-offer';
const offerAnswered = () => { try { return localStorage.getItem(OFFER_KEY) !== null; } catch { return true; } };
const answerOffer = (value) => { try { localStorage.setItem(OFFER_KEY, value); } catch {} };

export function ReminderOffer({ usual = null, className = '', style }) {
  const app = appNotifications();
  const [open, setOpen] = useState(() => !offerAnswered());
  const [chosen, setChosen] = useState(null);
  // Inside the app: a phone that already said yes or no is not asked again.
  useEffect(() => {
    if (!open || !app?.status) return undefined;
    let live = true;
    Promise.resolve(app.status()).then((s) => { if (live && (s === 'granted' || s === 'denied')) setOpen(false); }).catch(() => {});
    return () => { live = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- once, at the result
  if (!open) return null;
  const choose = (how) => { answerOffer(how); setChosen(how); };
  return (
    <div className={`vmx-reminder-offer ${className}`} style={style}>
      <strong>{app ? 'ให้ VetMock เตือนทำโจทย์ทุกวันไหม' : 'ให้ปฏิทินเตือนทำโจทย์ทุกวันไหม'}</strong>
      {chosen && chosen !== 'app'
        ? <p className="vmx-reminder-note" role="status">เปิดปฏิทินให้แล้ว กดบันทึกนัดในปฏิทินเพื่อให้เตือน เปลี่ยนเวลาได้ที่หน้าเชื่อมแอป</p>
        : <ReminderPicker usual={usual} onChosen={choose} />}
      {!chosen && (
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { answerOffer('no'); setOpen(false); }}>ไม่ต้อง</button>
      )}
    </div>
  );
}

export default function ReminderPicker({ usual = null, onChosen }) {
  const app = appNotifications();
  const choices = usual && !REMINDER_TIMES.includes(usual) ? [usual, ...REMINDER_TIMES] : REMINDER_TIMES;
  const [time, setTime] = useState(usual || DEFAULT_REMINDER);
  const [appState, setAppState] = useState(null);
  useEffect(() => {
    if (!app?.status) return undefined;
    let live = true;
    Promise.resolve(app.status()).then((s) => { if (live) setAppState(s); }).catch(() => {});
    return () => { live = false; };
  }, [app]);

  const times = (
    <>
      <div className="vmx-reminder-times" role="group" aria-label="เวลาที่ให้เตือน">
        {choices.map((t) => (
          <button key={t} type="button" className={`vmx-chip${t === time ? ' active' : ''}`} aria-pressed={t === time} onClick={() => setTime(t)}>
            {t} น.
          </button>
        ))}
      </div>
      {usual && <p className="vmx-reminder-note">เวลาที่คุณมักทำโจทย์ในสองสัปดาห์ที่ผ่านมา ราว {usual} น.</p>}
    </>
  );

  if (app) {
    // The app's own reminder: the phone's prompt only on this tap, then the
    // chosen time (reminders.set takes minutes after midnight).
    const minute = (() => { const p = time.split(':').map(Number); return p[0] * 60 + p[1]; })();
    const ask = async () => {
      try {
        const result = appState === 'granted' ? 'granted' : await app.request();
        setAppState(result);
        if (result === 'granted') {
          await Promise.resolve(window.VetMockApp?.reminders?.set?.({ enabled: true, minute }));
          onChosen?.('app');
        }
      } catch { setAppState('error'); }
    };
    return (
      <div className="vmx-reminder-picker">
        {times}
        <button type="button" className="vmx-btn vmx-btn-primary" onClick={ask}>ให้แอปเตือนเวลา {time} น.</button>
        {appState === 'granted' && <p className="vmx-reminder-note" role="status">แอปจะเตือนทุกวันเวลา {time} น. ถ้าวันนั้นทำโจทย์แล้วจะไม่เตือน</p>}
        {appState === 'denied' && (
          <p className="vmx-reminder-note" role="status">
            เครื่องยังไม่อนุญาตให้แจ้งเตือน{' '}
            {app.openSettings && <button type="button" className="vmx-inline-action" onClick={() => app.openSettings()}>เปิดในตั้งค่า</button>}
          </p>
        )}
        {appState === 'error' && <p className="vmx-reminder-note" role="status">ยังเปิดการแจ้งเตือนไม่ได้ ลองอีกครั้ง</p>}
      </div>
    );
  }

  return (
    <div className="vmx-reminder-picker">
      {times}
      <div className="vmx-reminder-targets">
        <a className="vmx-reminder-target" href={googleReminderUrl(time)} target="_blank" rel="noopener noreferrer" onClick={() => onChosen?.('google')}>
          <img src="/brand/google-calendar.svg" alt="" width="22" height="22" loading="lazy" decoding="async" />
          <span>Google Calendar</span>
        </a>
        <a className="vmx-reminder-target" href={reminderIcsUrl(time)} onClick={() => onChosen?.('ics')}>
          <img src="/brand/apple-calendar.svg" alt="" width="22" height="22" loading="lazy" decoding="async" />
          <span>ปฏิทินอื่น (Apple, Outlook)</span>
        </a>
      </div>
      <p className="vmx-reminder-note">ปฏิทินจะเตือนทุกวันเวลา {time} น. แม้วันนั้นทำโจทย์แล้ว เลิกได้โดยลบนัดนี้ในปฏิทิน</p>
    </div>
  );
}
