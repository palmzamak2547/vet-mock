// ============================================================
// ExternalDocView — เปิดลิงก์ Notion / Google เป็นหน้าอ่านในแอป
// ============================================================
// The browser is not allowed to fetch those hosts (CSP) or frame them,
// so the paste box hands the link to /api/fetch-external-doc and the
// answer renders through the same escape-first markdown pipeline the
// summaries use. Everything the student sees here comes from another
// person's server, so nothing is rendered raw — see
// tests/unit/markdown-render.test.mjs for the pinned contract.
//
// Two ways in, both honest on screen:
//   - a link shared "ทุกคนที่มีลิงก์" opens for anyone, no account needed;
//   - a student who connects their OWN Notion / Google account (OAuth,
//     consent screen on the provider, tokens kept server-side) can open
//     the documents that account can read, private ones included.
// The view says what each path needs instead of showing a broken render.
// ============================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import { renderMarkdown } from '../lib/markdown-render.js';
import { safeLinkUrl } from '../lib/safe-url.js';
import {
  PROVIDER_LABELS,
  CONNECT_PROVIDER_LABELS,
  connectMessageFor,
  fetchExternalDoc,
  fetchExternalConnections,
  disconnectExternalConnection,
  startExternalConnection,
  loadRecentExternalDocs,
  rememberRecentExternalDoc,
} from '../lib/external-doc-client.js';

/** The connected=/connect_error= the OAuth callback redirects back with, read once. */
function readCallbackIntent() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const connected = params.get('connected');
  const connectError = params.get('connect_error');
  if (!connected && !connectError) return null;
  return { connected, connectError };
}

export default function ExternalDocsSection({ user }) {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState('');
  const [recents, setRecents] = useState(() => loadRecentExternalDocs());
  const [connections, setConnections] = useState([]);
  const [connectBusy, setConnectBusy] = useState('');
  const [notice, setNotice] = useState('');

  // One request in flight at a time: an older answer never lands after a
  // newer paste, and unmounting cancels what is still running.
  const requestRef = useRef(0);
  const abortRef = useRef(null);
  useEffect(() => () => abortRef.current?.abort(), []);

  // The OAuth callback lands here with its outcome in the query string.
  // Read it once, say it once, strip the URL — a refresh should not
  // re-announce a finished flow.
  const callbackIntentRef = useRef(readCallbackIntent());
  useEffect(() => {
    const intent = callbackIntentRef.current;
    if (!intent) return;
    if (intent.connected) {
      setNotice(`เชื่อมต่อ${CONNECT_PROVIDER_LABELS[intent.connected] || ''}สำเร็จแล้ว`);
    } else if (intent.connectError) {
      setError(connectMessageFor(intent.connectError));
      setStatus('error');
    }
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(window.history.state, '', window.location.pathname);
    }
  }, []);

  const refreshConnections = useCallback(async (signedIn) => {
    if (!signedIn) {
      setConnections([]);
      return;
    }
    const result = await fetchExternalConnections();
    if (result.ok) setConnections(result.connections);
  }, []);

  useEffect(() => {
    refreshConnections(Boolean(user));
  }, [user, refreshConnections]);

  const open = useCallback(async (raw) => {
    const target = String(raw || '').trim();
    if (!target) {
      setStatus('error');
      setError('วางลิงก์เอกสารก่อน แล้วกดเปิด');
      return;
    }
    const id = ++requestRef.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus('loading');
    setError('');
    setDoc(null);
    const result = await fetchExternalDoc(target, { signal: controller.signal });
    if (id !== requestRef.current || result.aborted) return;
    if (!result.ok) {
      setStatus('error');
      setError(result.error);
      return;
    }
    setDoc(result.doc);
    setStatus('ready');
    setRecents(rememberRecentExternalDoc({
      url: result.doc.sourceUrl || target,
      provider: result.doc.provider,
      title: result.doc.title || '',
    }));
  }, []);

  const connect = useCallback(async (provider) => {
    setConnectBusy(provider);
    setError('');
    setNotice('');
    const result = await startExternalConnection(provider);
    setConnectBusy('');
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (typeof window !== 'undefined') window.location.assign(result.url);
  }, []);

  const disconnect = useCallback(async (provider) => {
    setConnectBusy(provider);
    const result = await disconnectExternalConnection(provider);
    setConnectBusy('');
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setNotice(`ยกเลิกการเชื่อมต่อ${CONNECT_PROVIDER_LABELS[provider] || ''}แล้ว`);
    await refreshConnections(Boolean(user));
  }, [user, refreshConnections]);

  const providerLabel = doc ? (PROVIDER_LABELS[doc.provider] || 'ลิงก์') : '';
  const sourceHref = doc ? safeLinkUrl(doc.sourceUrl) : null;
  const connectedFor = (p) => connections.find((c) => c.provider === p) || null;

  return (
    <div className="vmx-extdoc">
      <p className="vmx-extdoc-sub">
        วางลิงก์เอกสารหรือชีตของ Google หรือหน้าของ Notion แล้วอ่านต่อในหน้านี้
        ลิงก์ที่แชร์แบบทุกคนที่มีลิงก์เปิดได้เลย เอกสารส่วนตัวต้องเชื่อมบัญชีของคุณก่อน
      </p>

      <section className="vmx-extdoc-connect" aria-label="เชื่อมต่อบัญชี">
        <p className="vmx-extdoc-connect-title">เชื่อมบัญชีของคุณ</p>
        {!user ? (
          <p className="vmx-extdoc-connect-hint">เข้าสู่ระบบเพื่อเชื่อมบัญชี ส่วนลิงก์สาธารณะยังเปิดได้เหมือนเดิม</p>
        ) : (
          <>
            <div className="vmx-extdoc-connect-row">
              <div className="vmx-extdoc-connect-info">
                <span className="vmx-extdoc-connect-name">Google</span>
                <span className="vmx-extdoc-connect-detail">
                  {connectedFor('google')?.accountLabel || 'อ่านเอกสารและชีตที่บัญชีของคุณเห็น'}
                </span>
              </div>
              {connectedFor('google') ? (
                <button
                  type="button"
                  className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                  disabled={connectBusy === 'google'}
                  onClick={() => disconnect('google')}
                >
                  ยกเลิกการเชื่อมต่อ
                </button>
              ) : (
                <button
                  type="button"
                  className="vmx-btn vmx-btn-sm"
                  disabled={connectBusy === 'google'}
                  onClick={() => connect('google')}
                >
                  เชื่อมต่อ
                </button>
              )}
            </div>
            <div className="vmx-extdoc-connect-row">
              <div className="vmx-extdoc-connect-info">
                <span className="vmx-extdoc-connect-name">Notion</span>
                <span className="vmx-extdoc-connect-detail">
                  {connectedFor('notion')?.accountLabel || 'อ่านเพจที่คุณเลือกให้สิทธิ์ตอนเชื่อมต่อ'}
                </span>
              </div>
              {connectedFor('notion') ? (
                <button
                  type="button"
                  className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                  disabled={connectBusy === 'notion'}
                  onClick={() => disconnect('notion')}
                >
                  ยกเลิกการเชื่อมต่อ
                </button>
              ) : (
                <button
                  type="button"
                  className="vmx-btn vmx-btn-sm"
                  disabled={connectBusy === 'notion'}
                  onClick={() => connect('notion')}
                >
                  เชื่อมต่อ
                </button>
              )}
            </div>
            <p className="vmx-extdoc-connect-hint">
              แอปจะอ่านอย่างเดียว ไม่แก้ไขและไม่ลบ ยกเลิกได้ที่ปุ่มด้านบนหรือหน้าตั้งค่าของผู้ให้บริการ
            </p>
          </>
        )}
      </section>

      <form
        className="vmx-extdoc-form"
        onSubmit={(e) => { e.preventDefault(); open(url); }}
      >
        <input
          className="vmx-extdoc-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="วางลิงก์ที่นี่ เช่น https://docs.google.com/document/d/..."
          inputMode="url"
          autoComplete="off"
          aria-label="ลิงก์เอกสาร"
        />
        <button type="submit" className="vmx-btn vmx-btn-primary" disabled={status === 'loading'}>
          เปิดเอกสาร
        </button>
      </form>

      {recents.length > 0 && (
        <div className="vmx-extdoc-recents">
          <span className="vmx-extdoc-recents-label">เปิดล่าสุด</span>
          {recents.map((entry) => (
            <button
              key={entry.url}
              type="button"
              className="vmx-extdoc-recent"
              onClick={() => { setUrl(entry.url); open(entry.url); }}
            >
              {PROVIDER_LABELS[entry.provider] || 'ลิงก์'}{entry.title ? ` — ${entry.title}` : ''}
            </button>
          ))}
        </div>
      )}

      {notice && <div className="vmx-extdoc-notice">{notice}</div>}
      {status === 'loading' && <p className="vmx-extdoc-loading" aria-busy="true">กำลังเปิดเอกสาร…</p>}
      {status === 'error' && error && (
        <div className="vmx-extdoc-error" role="alert">{error}</div>
      )}

      {status === 'ready' && doc && (
        <article className="vmx-extdoc-doc">
          <div className="vmx-extdoc-meta">
            <span className="vmx-extdoc-provider">{providerLabel}</span>
            {sourceHref && (
              <a className="vmx-extdoc-source" href={sourceHref} target="_blank" rel="noopener noreferrer">
                เปิดต้นฉบับ
              </a>
            )}
          </div>
          {doc.title && <h2 className="vmx-extdoc-doc-title">{doc.title}</h2>}
          <div className="vmx-summary-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.markdown) }} />
        </article>
      )}
    </div>
  );
}
