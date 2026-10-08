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

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  listExternalFiles,
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
  const ownerId = user?.id || null;
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState('');
  const [recents, setRecents] = useState(() => loadRecentExternalDocs(ownerId));
  const [connections, setConnections] = useState([]);
  const [connectionsLoading, setConnectionsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [connectBusy, setConnectBusy] = useState('');
  const [providerFiles, setProviderFiles] = useState({});
  const [loadingFiles, setLoadingFiles] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const [notice, setNotice] = useState('');

  // One request in flight at a time: an older answer never lands after a
  // newer paste, and unmounting cancels what is still running.
  const requestRef = useRef(0);
  const abortRef = useRef(null);
  const scopeRef = useRef(null);

  // The OAuth callback lands here with its outcome in the query string.
  // Read it once, say it once, strip the URL — a refresh should not
  // re-announce a finished flow.
  const callbackIntentRef = useRef(readCallbackIntent());

  const loadFiles = useCallback(async (provider, scope) => {
    const version = scope.version;
    setLoadingFiles(prev => ({ ...prev, [provider]: true }));
    setFileErrors(prev => ({ ...prev, [provider]: '' }));
    const result = await listExternalFiles(provider, { ownerId: scope.ownerId, signal: scope.controller.signal });
    if (!scope.active || version !== scope.version) return;
    setLoadingFiles(prev => ({ ...prev, [provider]: false }));
    if (result.ok) setProviderFiles(prev => ({ ...prev, [provider]: result.files }));
    else setFileErrors(prev => ({ ...prev, [provider]: result.error }));
  }, []);

  const refreshConnections = useCallback(async (scope) => {
    if (!scope?.active || !scope.ownerId) return;
    const version = ++scope.statusVersion;
    setConnectionsLoading(true);
    setConnectionError('');
    const result = await fetchExternalConnections({ ownerId: scope.ownerId, signal: scope.controller.signal });
    if (!scope.active || version !== scope.statusVersion) return;
    setConnectionsLoading(false);
    if (!result.ok) { setConnectionError(result.error); return; }
    ++scope.version;
    setConnections(result.connections);
    setProviderFiles({});
    setLoadingFiles({});
    setFileErrors({});
    await Promise.all(result.connections.map(conn => loadFiles(conn.provider, scope)));
  }, [loadFiles]);

  useLayoutEffect(() => {
    const scope = { ownerId, active: true, version: 0, statusVersion: 0, busy: false, controller: new AbortController() };
    scopeRef.current = scope;
    setUrl(''); setStatus('idle'); setDoc(null); setError(''); setNotice('');
    setRecents(loadRecentExternalDocs(ownerId));
    setConnections([]); setProviderFiles({}); setLoadingFiles({}); setFileErrors({});
    setConnectionError(''); setConnectionsLoading(false); setConnectBusy('');
    refreshConnections(scope);
    return () => {
      scope.active = false;
      scope.controller.abort();
      ++requestRef.current;
      abortRef.current?.abort();
    };
  }, [ownerId, refreshConnections]);

  useEffect(() => {
    const intent = callbackIntentRef.current;
    if (!intent) return;
    if (intent.connected && Object.hasOwn(CONNECT_PROVIDER_LABELS, intent.connected)) {
      setNotice(`เชื่อมต่อ${CONNECT_PROVIDER_LABELS[intent.connected]}สำเร็จแล้ว`);
    } else if (intent.connectError) {
      setError(connectMessageFor(intent.connectError));
      setStatus('error');
    }
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      const next = new URL(window.location.href);
      next.searchParams.delete('connected');
      next.searchParams.delete('connect_error');
      window.history.replaceState(window.history.state, '', next);
    }
  }, []);

  const open = useCallback(async (raw) => {
    const scope = scopeRef.current;
    if (!scope?.active) return;
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
    const result = await fetchExternalDoc(target, { ownerId: scope.ownerId, signal: controller.signal });
    if (!scope.active || id !== requestRef.current || result.aborted) return;
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
    }, scope.ownerId));
  }, []);

  const connect = useCallback(async (provider) => {
    const scope = scopeRef.current;
    if (!scope?.active || scope.busy) return;
    scope.busy = true;
    setConnectBusy(provider);
    setConnectionError('');
    setNotice('');
    const result = await startExternalConnection(provider, { ownerId: scope.ownerId, signal: scope.controller.signal });
    if (!scope.active) return;
    scope.busy = false;
    setConnectBusy('');
    if (!result.ok) {
      setConnectionError(result.error);
      return;
    }
    if (typeof window !== 'undefined') window.location.assign(result.url);
  }, []);

  const disconnect = useCallback(async (provider) => {
    const scope = scopeRef.current;
    if (!scope?.active || scope.busy) return;
    scope.busy = true;
    setConnectBusy(provider);
    setConnectionError('');
    setNotice('');
    const result = await disconnectExternalConnection(provider, { ownerId: scope.ownerId, signal: scope.controller.signal });
    if (!scope.active) return;
    scope.busy = false;
    setConnectBusy('');
    if (!result.ok) {
      setConnectionError(result.error);
      return;
    }
    setNotice(`ยกเลิกการเชื่อมต่อ${CONNECT_PROVIDER_LABELS[provider] || ''}แล้ว`);
    ++requestRef.current;
    abortRef.current?.abort();
    setDoc(null); setStatus('idle'); setError('');
    setConnections(prev => prev.filter(conn => conn.provider !== provider));
    setProviderFiles(prev => ({ ...prev, [provider]: [] }));
    await refreshConnections(scope);
  }, [refreshConnections]);

  const providerLabel = doc ? (PROVIDER_LABELS[doc.provider] || 'ลิงก์') : '';
  const sourceHref = doc ? safeLinkUrl(doc.sourceUrl) : null;
  const connectedFor = (p) => connections.find((c) => c.provider === p) || null;

  
  const renderFiles = (provider) => {
    if (loadingFiles[provider]) return <div className="vmx-extdoc-connect-hint" style={{marginTop: 8}}>กำลังโหลดไฟล์...</div>;
    if (fileErrors[provider]) return (
      <div className="vmx-extdoc-error" role="alert">
        {fileErrors[provider]}{' '}
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => loadFiles(provider, scopeRef.current)}>ลองโหลดไฟล์อีกครั้ง</button>
      </div>
    );
    const files = providerFiles[provider] || [];
    if (files.length === 0) return <p className="vmx-extdoc-connect-hint">ไม่พบเอกสารที่บัญชีนี้เปิดได้</p>;
    return (
      <div style={{ marginTop: 12, borderTop: '1px solid var(--clr-border)', paddingTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--clr-ink-soft)', marginBottom: 8 }}>เอกสารล่าสุดที่เปิดได้ (สูงสุด 20 รายการ)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {files.map(f => (
            <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--clr-surface-2)', borderRadius: 6 }}>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14 }}>
                <a href={safeLinkUrl(f.url) || undefined} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-ink)', textDecoration: 'none' }}>{f.title}</a>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { setUrl(f.url); open(f.url); }}>เปิดอ่าน</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
                  disabled={!!connectBusy || connectionsLoading}
                  onClick={() => disconnect('google')}
                >
                  ยกเลิกการเชื่อมต่อ
                </button>
              ) : (
                <button
                  type="button"
                  className="vmx-btn vmx-btn-sm"
                  disabled={!!connectBusy || connectionsLoading}
                  onClick={() => connect('google')}
                >
                  เชื่อมต่อ
                </button>
              )}
            </div>
            {connectedFor('google') && renderFiles('google')}
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
                  disabled={!!connectBusy || connectionsLoading}
                  onClick={() => disconnect('notion')}
                >
                  ยกเลิกการเชื่อมต่อ
                </button>
              ) : (
                <button
                  type="button"
                  className="vmx-btn vmx-btn-sm"
                  disabled={!!connectBusy || connectionsLoading}
                  onClick={() => connect('notion')}
                >
                  เชื่อมต่อ
                </button>
              )}
            </div>
            {connectedFor('notion') && renderFiles('notion')}
            {connectionsLoading && <p className="vmx-extdoc-connect-hint" role="status">กำลังตรวจการเชื่อมต่อ…</p>}
            {connectionError && <div className="vmx-extdoc-error" role="alert">
              {connectionError}{' '}
              <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" disabled={connectionsLoading || !!connectBusy} onClick={() => refreshConnections(scopeRef.current)}>ตรวจการเชื่อมต่ออีกครั้ง</button>
            </div>}
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

      {notice && <div className="vmx-extdoc-notice" role="status">{notice}</div>}
      {status === 'loading' && <p className="vmx-extdoc-loading" aria-busy="true">กำลังเปิดเอกสาร…</p>}
      {status === 'error' && error && (
        <div className="vmx-extdoc-error" role="alert">{error}</div>
      )}

      {status === 'ready' && doc && (
        <article className="vmx-extdoc-doc">
          <div className="vmx-extdoc-meta">
            <span className="vmx-extdoc-provider">{providerLabel}</span>
            {sourceHref && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <a className="vmx-extdoc-source" href={sourceHref} target="_blank" rel="noopener noreferrer">
                  เปิดต้นฉบับ
                </a>
              </div>
            )}
          </div>
          {doc.title && <h2 className="vmx-extdoc-doc-title">{doc.title}</h2>}
          <div className="vmx-summary-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.markdown) }} />
        </article>
      )}
    </div>
  );
}
