// ============================================================
// เชื่อมแอป: VetMock with the apps a student already uses
// ============================================================
// One page, grouped by what the student is doing (documents, calendar,
// review), one card per app with its own logo (public/brand, official
// marks), what it does in one line, and one main action. Only what works on
// this deployment is shown: Drive and Notion appear when the server can
// connect them (or the account already holds a grant), the calendar feed
// exists for years with a timetable, and Anki needs nothing but a download.
// ============================================================

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../styles-connect.css';
import NavIcon from '../components/NavIcon.jsx';
import {
  fetchConnectable, fetchExternalConnections, startExternalConnection,
  disconnectExternalConnection, CONNECT_PROVIDER_LABELS,
} from '../lib/external-doc-client.js';
import { rememberViewIntent } from '../lib/feature-registry.js';
import { CALENDAR_YEARS } from '../lib/exam-calendar.js';
import { ankiText } from '../lib/anki-export.js';
import { loadPins } from '../lib/pinboard.js';
import { stillWrong, historyKey } from '../lib/wrong-pool.js';
import { copyText } from '../lib/clipboard.js';

const ORIGIN = 'https://vetmock.com';

const DOC_APPS = [
  { id: 'google', name: 'Google Drive', logo: '/brand/google-drive.svg', does: 'เลือกเอกสารหรือชีตจาก Drive มาอ่านต่อในคลังเอกสาร แอปเปิดได้เฉพาะไฟล์ที่คุณเลือก' },
  { id: 'notion', name: 'Notion', logo: '/brand/notion.svg', does: 'อ่านหน้าโน้ตใน Notion ที่คุณให้สิทธิ์ ในคลังเอกสารของ VetMock' },
];

function Logo({ src, name }) {
  return (
    <span className="vmx-conn-logo">
      <img src={src} alt="" width="28" height="28" loading="lazy" decoding="async" />
      <span className="vmx-sr-only">{name}</span>
    </span>
  );
}

function Card({ logo, title, status, children }) {
  return (
    <article className="vmx-conn-card">
      <header className="vmx-conn-head">
        {logo}
        <h3>{title}</h3>
        {status && <span className={`vmx-conn-status is-${status.tone}`}>{status.text}</span>}
      </header>
      {children}
    </article>
  );
}

function DocsSection({ user, setView }) {
  const [connectable, setConnectable] = useState(null);
  const [connections, setConnections] = useState([]);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const ownerId = user?.id || null;
  const abortRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    fetchConnectable({ signal: controller.signal }).then((r) => { if (!controller.signal.aborted) setConnectable(r.connectable); });
    if (ownerId) {
      fetchExternalConnections({ ownerId, signal: controller.signal }).then((r) => {
        if (!controller.signal.aborted && r.ok) setConnections(r.connections);
      });
    }
    return () => controller.abort();
  }, [ownerId]);

  const connectedFor = (p) => connections.find((c) => c.provider === p) || null;
  const shown = DOC_APPS.filter((a) => connectable?.[a.id] || connectedFor(a.id));

  const connect = useCallback(async (provider) => {
    setBusy(provider); setMessage('');
    const r = await startExternalConnection(provider, { ownerId, signal: abortRef.current?.signal });
    if (r.ok) { window.location.assign(r.url); return; }
    setBusy('');
    setMessage(r.error || 'เชื่อมต่อไม่สำเร็จ ลองอีกครั้ง');
  }, [ownerId]);

  const disconnect = useCallback(async (provider) => {
    setBusy(provider); setMessage('');
    const r = await disconnectExternalConnection(provider, { ownerId, signal: abortRef.current?.signal });
    setBusy('');
    if (!r.ok) { setMessage(r.error || 'ยกเลิกไม่สำเร็จ ลองอีกครั้ง'); return; }
    setConnections((prev) => prev.filter((c) => c.provider !== provider));
    setMessage(`ยกเลิกการเชื่อมต่อ ${CONNECT_PROVIDER_LABELS[provider] || ''} แล้ว`);
  }, [ownerId]);

  const openFiles = () => { rememberViewIntent('external'); setView('library'); };

  if (connectable === null || shown.length === 0) return null;
  return (
    <section className="vmx-conn-section" aria-labelledby="conn-docs">
      <h2 id="conn-docs">เอกสาร</h2>
      <div className="vmx-conn-grid">
        {shown.map((app) => {
          const conn = connectedFor(app.id);
          return (
            <Card
              key={app.id}
              logo={<Logo src={app.logo} name={app.name} />}
              title={app.name}
              status={conn ? { tone: 'on', text: 'เชื่อมแล้ว' } : null}
            >
              <p className="vmx-conn-does">{conn?.accountLabel ? `บัญชี ${conn.accountLabel}` : app.does}</p>
              <div className="vmx-conn-actions">
                {!user ? (
                  <button type="button" className="vmx-btn vmx-btn-primary" onClick={() => setView('auth')}>เข้าสู่ระบบเพื่อเชื่อม</button>
                ) : conn ? (
                  <>
                    <button type="button" className="vmx-btn vmx-btn-primary" onClick={openFiles}>เปิดไฟล์</button>
                    <button type="button" className="vmx-btn vmx-btn-ghost" disabled={!!busy} onClick={() => disconnect(app.id)}>
                      {busy === app.id ? 'กำลังยกเลิก…' : 'ยกเลิกการเชื่อมต่อ'}
                    </button>
                  </>
                ) : (
                  <button type="button" className="vmx-btn vmx-btn-primary" disabled={!!busy} onClick={() => connect(app.id)}>
                    {busy === app.id ? 'กำลังไปหน้าให้สิทธิ์…' : `เชื่อม ${app.name}`}
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      {message && <p className="vmx-conn-note" role="status">{message}</p>}
    </section>
  );
}

function CalendarSection({ selectedYear }) {
  const [year, setYear] = useState(CALENDAR_YEARS.includes(selectedYear) ? selectedYear : CALENDAR_YEARS.at(-1));
  const [copied, setCopied] = useState(false);
  const feed = `${ORIGIN}/api/calendar?year=${year}`;
  const webcal = feed.replace(/^https:/, 'webcal:');
  const name = `ตารางสอบ VetMock ปี ${year}`;
  const targets = [
    { id: 'google', label: 'Google Calendar', logo: '/brand/google-calendar.svg', href: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}` },
    { id: 'apple', label: 'Apple Calendar', logo: '/brand/apple-calendar.svg', href: webcal },
    { id: 'outlook', label: 'Outlook', logo: '/brand/outlook.svg', href: `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(feed)}&name=${encodeURIComponent(name)}` },
  ];
  const copy = async () => { if ((await copyText(feed)).ok) { setCopied(true); setTimeout(() => setCopied(false), 2400); } };
  return (
    <section className="vmx-conn-section" aria-labelledby="conn-cal">
      <h2 id="conn-cal">ปฏิทิน</h2>
      <Card logo={<span className="vmx-conn-logo is-glyph"><NavIcon name="calendar" size={24} /></span>} title="ตารางสอบในปฏิทินของคุณ">
        <p className="vmx-conn-does">
          ทุกวิชาที่สอบพร้อมเวลาและห้อง เตือนล่วงหน้า 1 วัน ถ้าตารางเปลี่ยน ปฏิทินจะอัปเดตเอง
        </p>
        {CALENDAR_YEARS.length > 1 && (
          <div className="vmx-conn-years" role="group" aria-label="ปีของตารางสอบ">
            {CALENDAR_YEARS.map((y) => (
              <button key={y} type="button" className={`vmx-chip${y === year ? ' active' : ''}`} aria-pressed={y === year} onClick={() => setYear(y)}>ปี {y}</button>
            ))}
          </div>
        )}
        <div className="vmx-conn-targets">
          {targets.map((t) => (
            <a key={t.id} className="vmx-conn-target" href={t.href} target={t.id === 'apple' ? undefined : '_blank'} rel="noopener noreferrer">
              <img src={t.logo} alt="" width="22" height="22" loading="lazy" decoding="async" />
              <span>{t.label}</span>
            </a>
          ))}
        </div>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm vmx-conn-copy" onClick={copy}>
          {copied ? 'คัดลอกลิงก์แล้ว' : 'คัดลอกลิงก์ปฏิทิน'}
        </button>
        {!CALENDAR_YEARS.includes(selectedYear) && selectedYear != null && (
          <p className="vmx-conn-note">ตอนนี้มีตารางสอบของปี {CALENDAR_YEARS.join(' และปี ')}</p>
        )}
      </Card>
    </section>
  );
}

function download(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function AnkiSection({ history }) {
  const pinKeys = useMemo(() => loadPins().filter((p) => p.type === 'question' && p.payload?.id != null)
    .map((p) => historyKey(p.payload.subject, p.payload.id)), []);
  const wrongKeys = useMemo(() => [...stillWrong(history).keys], [history]);
  const [state, setState] = useState({ busy: '', done: '' });

  const exportSet = async (kind) => {
    const keys = new Set(kind === 'pins' ? pinKeys : wrongKeys);
    setState({ busy: kind, done: '' });
    try {
      const [{ loadQB, QB }, { isQuestionDeliverable }] = await Promise.all([
        import('../data/questions.js'), import('../data/question-delivery.generated.js'),
      ]);
      await loadQB();
      const questions = QB.filter((q) => keys.has(historyKey(q.subject, q.id)) && isQuestionDeliverable(q));
      const label = kind === 'pins' ? 'ข้อที่ปักหมุด' : 'ข้อที่ยังตอบผิด';
      const { text, count } = ankiText(questions, { deck: `VetMock::${label}` });
      if (!count) { setState({ busy: '', done: 'ไม่มีข้อที่ส่งออกได้ในชุดนี้' }); return; }
      download(`vetmock-${kind === 'pins' ? 'pinned' : 'mistakes'}.txt`, text);
      setState({ busy: '', done: `ดาวน์โหลดแล้ว ${count} การ์ด เปิด Anki บนคอมพิวเตอร์ เลือก File แล้ว Import แล้วเลือกไฟล์นี้ การ์ดจะเข้าเด็ค ${label}` });
    } catch {
      setState({ busy: '', done: 'โหลดข้อสอบไม่สำเร็จ ตรวจอินเทอร์เน็ตแล้วลองอีกครั้ง' });
    }
  };

  const sets = [
    { kind: 'pins', label: 'ข้อที่ปักหมุด', n: pinKeys.length, empty: 'กดหมุดที่ข้อไหนก็ได้ระหว่างฝึก แล้วข้อนั้นจะส่งออกได้ที่นี่' },
    { kind: 'wrong', label: 'ข้อที่ยังตอบผิด', n: wrongKeys.length, empty: 'ข้อที่ตอบผิดล่าสุดจะรวมอยู่ที่นี่' },
  ];
  return (
    <section className="vmx-conn-section" aria-labelledby="conn-review">
      <h2 id="conn-review">ทบทวน</h2>
      <Card logo={<Logo src="/brand/anki.svg" name="Anki" />} title="Anki">
        <p className="vmx-conn-does">ส่งข้อสอบเป็นการ์ดทบทวน ด้านหน้าเป็นโจทย์และตัวเลือก ด้านหลังเป็นเฉลยพร้อมคำอธิบาย</p>
        <ul className="vmx-conn-sets">
          {sets.map((s) => (
            <li key={s.kind}>
              <span className="vmx-conn-set-label">{s.label}<b>{s.n} ข้อ</b></span>
              {s.n > 0 ? (
                <button type="button" className="vmx-btn vmx-btn-sm" disabled={!!state.busy} onClick={() => exportSet(s.kind)}>
                  {state.busy === s.kind ? 'กำลังเตรียมไฟล์…' : 'ดาวน์โหลด'}
                </button>
              ) : <span className="vmx-conn-set-empty">{s.empty}</span>}
            </li>
          ))}
        </ul>
        {state.done && <p className="vmx-conn-note" role="status">{state.done}</p>}
      </Card>
    </section>
  );
}

export default function ConnectAppsView({ goHome, setView, user, history, selectedYear }) {
  useEffect(() => { document.title = 'เชื่อมแอป | VetMock'; }, []);
  return (
    <div className="vmx-conn">
      <div className="vmx-conn-top">
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => (goHome ? goHome() : setView('home'))}>← หน้าแรก</button>
      </div>
      <h1>เชื่อมแอป</h1>
      <p className="vmx-conn-lead">ใช้ VetMock คู่กับแอปที่คุณใช้อยู่แล้ว</p>
      <DocsSection user={user} setView={setView} />
      <CalendarSection selectedYear={Number(selectedYear) || null} />
      <AnkiSection history={history} />
    </div>
  );
}
