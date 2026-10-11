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
// The second way exists only where the deployment can serve it: a provider
// the server cannot connect has no button and no promise in the copy (GET
// /api/external-connect, see fetchConnectable). The paste box comes first
// because it works for every visitor.
// ============================================================

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { renderMarkdown } from '../lib/markdown-render.js';
import { safeLinkUrl } from '../lib/safe-url.js';
import { inAppBrowser, externalUrl, APP_NAMES } from '../lib/inapp.js';
import {
  PROVIDER_LABELS,
  CONNECT_PROVIDER_LABELS,
  NO_CONNECTABLE,
  connectMessageFor,
  connectNoticeFor,
  connectNoteFor,
  fetchConnectable,
  peekConnectable,
  fetchExternalDoc,
  fetchExternalConnections,
  disconnectExternalConnection,
  startExternalConnection,
  listExternalFiles,
  loadRecentExternalDocs,
  rememberRecentExternalDoc,
} from '../lib/external-doc-client.js';

const CONNECT_ORDER = ['google', 'notion'];
const CONNECT_DETAIL = {
  google: 'อ่านเอกสารและชีตที่บัญชีของคุณเห็น',
  notion: 'อ่านเพจที่คุณเลือกให้สิทธิ์ตอนเชื่อมต่อ',
};

/** The connected=/connect_error= the OAuth callback redirects back with, read once. */
function readCallbackIntent() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const connected = params.get('connected');
  const connectError = params.get('connect_error');
  if (!connected && !connectError) return null;
  return { connected, connectError };
}

/** The app browser this page is open in (LINE, Facebook, ...), or null. */
function currentInAppBrowser() {
  return typeof navigator === 'undefined' ? null : inAppBrowser(navigator.userAgent);
}

/**
 * Where the system browser should land: this library page on its external
 * tab, without a finished OAuth outcome that would be announced again.
 */
function externalTabHref() {
  try {
    const next = new URL(window.location.href);
    next.searchParams.delete('connected');
    next.searchParams.delete('connect_error');
    next.searchParams.set('tab', 'external');
    return next.toString();
  } catch {
    return null;
  }
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
  // Google refuses its consent screen inside LINE, Facebook, Instagram and
  // Messenger ("disallowed_useragent") and leaves the student on its error
  // page. Say so here, before sending them there.
  const [inAppBlock, setInAppBlock] = useState(null);
  // null until the server has said which accounts this deployment can
  // connect; until then, and whenever it cannot say, nothing is offered.
  const [connectable, setConnectable] = useState(() => peekConnectable());
  const anyConnectable = !!connectable && (connectable.google || connectable.notion);

  // One request in flight at a time: an older answer never lands after a
  // newer paste, and unmounting cancels what is still running.
  const requestRef = useRef(0);
  const abortRef = useRef(null);
  const scopeRef = useRef(null);
  // A document opened from the paste box lands below the fold on a phone; the
  // student tapped to read it, so it is brought up to the top of the screen.
  const docRef = useRef(null);
  useEffect(() => {
    if (status !== 'ready' || !doc || !docRef.current || typeof window === 'undefined') return;
    const top = docRef.current.getBoundingClientRect?.().top;
    if (typeof top === 'number' && top > window.innerHeight * 0.6) docRef.current.scrollIntoView?.({ block: 'start' });
  }, [status, doc]);

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
    setConnectionError(''); setConnectionsLoading(false); setConnectBusy(''); setInAppBlock(null);
    return () => {
      scope.active = false;
      scope.controller.abort();
      ++requestRef.current;
      abortRef.current?.abort();
    };
  }, [ownerId]);

  // Which accounts can be connected here, asked once per page.
  useEffect(() => {
    if (connectable) return undefined;
    const controller = new AbortController();
    fetchConnectable({ signal: controller.signal }).then((result) => {
      if (!controller.signal.aborted) setConnectable(result.connectable || NO_CONNECTABLE);
    });
    return () => controller.abort();
  }, [connectable]);

  // A signed-in student's own connections are read only where connecting is
  // possible at all: elsewhere there is nothing to list and nothing to say.
  useEffect(() => {
    if (!ownerId || !anyConnectable) return;
    refreshConnections(scopeRef.current);
  }, [ownerId, anyConnectable, refreshConnections]);

  useEffect(() => {
    const intent = callbackIntentRef.current;
    if (!intent) return;
    if (intent.connected && Object.hasOwn(CONNECT_PROVIDER_LABELS, intent.connected)) {
      setNotice(`เชื่อมต่อ${CONNECT_PROVIDER_LABELS[intent.connected]}สำเร็จแล้ว`);
    } else if (intent.connectError) {
      const neutral = connectNoticeFor(intent.connectError);
      if (neutral) {
        setNotice(neutral);
      } else {
        setError(connectMessageFor(intent.connectError));
        setStatus('error');
      }
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
    const app = provider === 'google' ? currentInAppBrowser() : null;
    if (app) {
      setConnectionError('');
      setNotice('');
      setInAppBlock(app);
      return;
    }
    setInAppBlock(null);
    scope.busy = true;
    setConnectBusy(provider);
    setConnectionError('');
    setNotice('');
    const result = await startExternalConnection(provider, { ownerId: scope.ownerId, signal: scope.controller.signal });
    if (!scope.active) return;
    scope.busy = false;
    setConnectBusy('');
    if (!result.ok && result.reason === 'not_configured') {
      // The server cannot connect this provider after all: take the button
      // away instead of leaving one that will answer the same way again.
      setConnectable((prev) => ({ ...(prev || NO_CONNECTABLE), [provider]: false }));
      setNotice(`ตอนนี้ยังเชื่อมบัญชี ${CONNECT_PROVIDER_LABELS[provider] || ''} ไม่ได้ ลิงก์ที่แชร์แบบทุกคนที่มีลิงก์ยังเปิดได้ตามปกติ`);
      return;
    }
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
  // A provider shows when it can be connected here, or when this account
  // already holds a grant for it (a grant can always be ended).
  const shownProviders = CONNECT_ORDER.filter((p) => connectable?.[p] || connectedFor(p));
  const connectNote = connectNoteFor(connectable);

  const renderFiles = (provider) => {
    if (loadingFiles[provider]) return <p className="vmx-extdoc-connect-hint" role="status">กำลังโหลดไฟล์...</p>;
    if (fileErrors[provider]) return (
      <div className="vmx-extdoc-error" role="alert">
        {fileErrors[provider]}{' '}
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => loadFiles(provider, scopeRef.current)}>ลองโหลดไฟล์อีกครั้ง</button>
      </div>
    );
    const files = providerFiles[provider] || [];
    if (files.length === 0) return <p className="vmx-extdoc-connect-hint">ไม่พบเอกสารที่บัญชีนี้เปิดได้</p>;
    return (
      <div className="vmx-extdoc-files">
        <p className="vmx-extdoc-files-label">เอกสารล่าสุดที่เปิดได้ (สูงสุด 20 รายการ)</p>
        <ul className="vmx-extdoc-file-list">
          {files.map(f => (
            <li key={f.id} className="vmx-extdoc-file">
              <a className="vmx-extdoc-file-title" href={safeLinkUrl(f.url) || undefined} target="_blank" rel="noopener noreferrer">{f.title}</a>
              <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { setUrl(f.url); open(f.url); }}>เปิดอ่าน</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderProvider = (provider) => {
    const connected = connectedFor(provider);
    return (
      <div key={provider} className="vmx-extdoc-connect-block">
        <div className="vmx-extdoc-connect-row">
          <div className="vmx-extdoc-connect-info">
            <span className="vmx-extdoc-connect-name">{CONNECT_PROVIDER_LABELS[provider]}</span>
            <span className="vmx-extdoc-connect-detail">{connected?.accountLabel || CONNECT_DETAIL[provider]}</span>
          </div>
          {connected ? (
            <button
              type="button"
              className="vmx-btn vmx-btn-ghost vmx-btn-sm"
              disabled={!!connectBusy || connectionsLoading}
              onClick={() => disconnect(provider)}
            >
              ยกเลิกการเชื่อมต่อ
            </button>
          ) : (
            <button
              type="button"
              className="vmx-btn vmx-btn-sm"
              disabled={!!connectBusy || connectionsLoading}
              onClick={() => connect(provider)}
            >
              เชื่อมต่อ
            </button>
          )}
        </div>
        {provider === 'google' && inAppBlock && !connected && (() => {
          const exit = externalTabHref();
          const exitHref = exit ? externalUrl(inAppBlock, exit) : null;
          return (
            <div className="vmx-extdoc-inapp" role="note">
              <b>ตอนนี้เปิดอยู่ในแอป {APP_NAMES[inAppBlock] || 'อื่น'}</b>
              <p>
                Google ไม่ให้เชื่อมบัญชีในเบราว์เซอร์ของแอป เปิดหน้านี้ใน Safari หรือ Chrome
                แล้วเข้าสู่ระบบ VetMock ที่นั่นอีกครั้งก่อนกดเชื่อมต่อ
              </p>
              {exitHref
                ? <a className="vmx-btn vmx-btn-ghost vmx-btn-sm" href={exitHref}>เปิดในเบราว์เซอร์</a>
                : <p>กดปุ่มเมนู (⋯ หรือ ⋮) ที่มุมจอ แล้วเลือกเปิดในเบราว์เซอร์</p>}
            </div>
          );
        })()}
        {connected && renderFiles(provider)}
      </div>
    );
  };

  return (
    <div className="vmx-extdoc">
      <p className="vmx-extdoc-sub">
        วางลิงก์เอกสารหรือชีตของ Google ที่แชร์แบบทุกคนที่มีลิงก์ แล้วอ่านต่อในหน้านี้ได้เลย
        {connectNote ? ` ${connectNote}` : ''}
      </p>

      <form
        className="vmx-extdoc-form"
        onSubmit={(e) => { e.preventDefault(); open(url); }}
      >
        <input
          className="vmx-extdoc-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="วางลิงก์เอกสารที่นี่"
          inputMode="url"
          enterKeyHint="go"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
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
              <span className="vmx-extdoc-recent-text">
                {PROVIDER_LABELS[entry.provider] || 'ลิงก์'}{entry.title ? ` — ${entry.title}` : ''}
              </span>
            </button>
          ))}
        </div>
      )}

      {notice && <div className="vmx-extdoc-notice" role="status">{notice}</div>}
      {status === 'loading' && <p className="vmx-extdoc-loading" aria-busy="true">กำลังเปิดเอกสาร…</p>}
      {status === 'error' && error && (
        <div className="vmx-extdoc-error" role="alert">{error}</div>
      )}

      {/* Connecting is offered only where this deployment can do it, and a
          guest hears about it only then, never about a door that is shut. */}
      {shownProviders.length > 0 && (
        <section className="vmx-extdoc-connect" aria-label="เชื่อมต่อบัญชี">
          <p className="vmx-extdoc-connect-title">เชื่อมบัญชีของคุณ</p>
          {!user ? (
            <p className="vmx-extdoc-connect-hint">เข้าสู่ระบบเพื่อเชื่อมบัญชี ส่วนลิงก์สาธารณะยังเปิดได้เหมือนเดิม</p>
          ) : (
            <>
              {shownProviders.map(renderProvider)}
              {connectionsLoading && <p className="vmx-extdoc-connect-hint" role="status">กำลังตรวจการเชื่อมต่อ…</p>}
              {connectionError && <div className="vmx-extdoc-error" role="alert">
                {connectionError}{' '}
                <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" disabled={connectionsLoading || !!connectBusy} onClick={() => refreshConnections(scopeRef.current)}>ตรวจการเชื่อมต่ออีกครั้ง</button>
              </div>}
              <p className="vmx-extdoc-connect-hint">
                แอปจะอ่านอย่างเดียว ไม่แก้ไขและไม่ลบ ยกเลิกได้ที่ปุ่มในกล่องนี้หรือหน้าตั้งค่าของผู้ให้บริการ
              </p>
            </>
          )}
        </section>
      )}

      {status === 'ready' && doc && (
        <article ref={docRef} className="vmx-extdoc-doc">
          <div className="vmx-extdoc-meta">
            <span className="vmx-extdoc-provider">{providerLabel}</span>
            {sourceHref && (
              <a className="vmx-extdoc-source" href={sourceHref} target="_blank" rel="noopener noreferrer">
                เปิดต้นฉบับ
              </a>
            )}
          </div>
          {doc.title && <h2 className="vmx-extdoc-doc-title">{doc.title}</h2>}
          {doc.imagesOmitted && (
            <p className="vmx-extdoc-connect-hint">รูปภาพในเอกสารนี้ไม่แสดงในหน้าอ่าน กดเปิดต้นฉบับเพื่อดูรูป</p>
          )}
          <div className="vmx-summary-body vmx-extdoc-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.markdown) }} />
        </article>
      )}
    </div>
  );
}
