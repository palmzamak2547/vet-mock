// "เอกสารที่เกี่ยวข้อง": library pages whose own text names a topic
// (library_doc_links, see scripts/library-links.mjs). Each item shows the words
// found on that page and opens the reader there. Rows whose document is not on
// this reader's shelf (restricted, removed) are left out, never guessed.
import React, { useEffect, useRef, useState } from 'react';
import { displayDocTitle, getLibraryCatalogFast, markTerms, readerPayload, recordRecentDoc, tidyEvidence } from '../lib/library.js';

// Snapshot first, the fresh catalogue after (same order as WrapUpView).
let _bySlug = null;
const index = (r) => new Map((r?.docs || []).filter((d) => d?.slug).map((d) => [d.slug, d]));
function useCatalogBySlug() {
  const [bySlug, setBySlug] = useState(_bySlug);
  useEffect(() => {
    if (_bySlug) return undefined;
    let alive = true;
    const { stale, fresh } = getLibraryCatalogFast();
    stale.then((s) => { if (alive && s) setBySlug((cur) => cur || index(s)); }).catch(() => {});
    fresh.then((f) => { _bySlug = index(f); if (alive) setBySlug(_bySlug); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  return bySlug;
}

// Three first: a topic card or an article end stays short; the rest on tap.
const FIRST = 3;

// `land`: the student is back from the reader through this list, so bring it
// into view once it has rendered. Figures above it may still be loading and
// push it down, so look again shortly after, unless the student has already
// started scrolling or tapping.
function useLanding(ref, ready, land) {
  useEffect(() => {
    if (!land || !ready || !ref.current) return undefined;
    let touched = false;
    const stop = () => { touched = true; };
    const opts = { passive: true, once: true };
    window.addEventListener('wheel', stop, opts);
    window.addEventListener('touchstart', stop, opts);
    window.addEventListener('keydown', stop, { once: true });
    const go = () => {
      const el = ref.current;
      if (touched || !el) return;
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.top > window.innerHeight * 0.6) el.scrollIntoView({ block: 'center' });
    };
    const raf = requestAnimationFrame(go);
    const again = setTimeout(go, 600);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(again);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('keydown', stop);
    };
  }, [land, ready, ref]);
}

export default function RelatedDocs({ rows, onOpenDoc, target = null, heading = true, land = false, variant = 'cards' }) {
  const bySlug = useCatalogBySlug();
  const [all, setAll] = useState(false);
  const ref = useRef(null);
  const items = rows?.length && bySlug && onOpenDoc
    ? rows.map((r) => ({ ...r, doc: bySlug.get(r.slug) })).filter((r) => r.doc)
    : [];
  useLanding(ref, items.length > 0, land);
  if (!items.length) return null;
  const shown = all ? items : items.slice(0, FIRST);
  return (
    <section ref={ref} className={`vmx-related-docs${variant === 'wiki' ? ' vw-end-block is-wiki' : ''}`} aria-label={heading ? undefined : 'เอกสารที่เกี่ยวข้อง'} aria-labelledby={heading ? 'vmx-related-heading' : undefined}>
      {heading && <h2 id="vmx-related-heading" className="vmx-related-heading">เอกสารที่เกี่ยวข้อง</h2>}
      <ul>
        {shown.map(({ doc, page, pages, term, evidence }) => (
          <li key={`${doc.slug}:${page}`}>
            <button
              type="button"
              onClick={() => { recordRecentDoc(doc); onOpenDoc(readerPayload(doc, { page, returnTarget: target })); }}
            >
              <span className="vmx-related-title">{displayDocTitle(doc.title)}</span>
              <span className="vmx-related-meta">
                {pages > 1 ? `หน้า ${page}, พบใน ${pages} หน้า` : `หน้า ${page}`}
              </span>
              <span className="vmx-related-evidence vmx-lib-snippet">
                {markTerms(tidyEvidence(evidence, term), term).map((part, i) => (part.hit ? <mark key={i}>{part.text}</mark> : <span key={i}>{part.text}</span>))}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {items.length > shown.length && (
        <button type="button" className="vmx-related-more" onClick={() => setAll(true)}>
          ดูอีก {items.length - shown.length} ไฟล์
        </button>
      )}
      {items.some((r) => !r.reviewed) && (
        <p className="vmx-related-note">จับคู่จากคำในหน้าเอกสาร ยังไม่ได้ตรวจทีละรายการ</p>
      )}
    </section>
  );
}
