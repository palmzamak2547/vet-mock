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
// A link only opens when its owner shared it publicly ("ทุกคนที่มีลิงก์");
// Notion additionally needs the page shared with the VetMock integration.
// The view says so instead of showing a broken render.
// ============================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import { renderMarkdown } from '../lib/markdown-render.js';
import { safeLinkUrl } from '../lib/safe-url.js';
import {
  PROVIDER_LABELS,
  fetchExternalDoc,
  loadRecentExternalDocs,
  rememberRecentExternalDoc,
} from '../lib/external-doc-client.js';

export default function ExternalDocView({ goHome }) {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState('');
  const [recents, setRecents] = useState(() => loadRecentExternalDocs());

  // One request in flight at a time: an older answer never lands after a
  // newer paste, and unmounting cancels what is still running.
  const requestRef = useRef(0);
  const abortRef = useRef(null);
  useEffect(() => () => abortRef.current?.abort(), []);

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

  const providerLabel = doc ? (PROVIDER_LABELS[doc.provider] || 'ลิงก์') : '';
  const sourceHref = doc ? safeLinkUrl(doc.sourceUrl) : null;

  return (
    <div className="vmx-extdoc">
      <div className="vmx-extdoc-head">
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={goHome} aria-label="กลับหน้าแรก">←</button>
        <h1 className="vmx-extdoc-title">เอกสารภายนอก</h1>
      </div>
      <p className="vmx-extdoc-sub">
        วางลิงก์เอกสารหรือชีตของ Google หรือหน้าของ Notion แล้วอ่านต่อในหน้านี้
        ลิงก์ต้องแชร์แบบทุกคนที่มีลิงก์ก่อน
      </p>

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
