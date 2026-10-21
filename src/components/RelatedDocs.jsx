// "เอกสารที่เกี่ยวข้อง": library pages whose own text names a topic
// (library_doc_links, see scripts/library-links.mjs). Each item shows the words
// found on that page and opens the reader there. Rows whose document is not on
// this reader's shelf (restricted, removed) are left out, never guessed.
import React, { useEffect, useState } from 'react';
import { displayDocTitle, getLibraryCatalogFast, markTerms, readerPayload, recordRecentDoc } from '../lib/library.js';

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

export default function RelatedDocs({ rows, onOpenDoc, heading = true }) {
  const bySlug = useCatalogBySlug();
  if (!rows?.length || !bySlug || !onOpenDoc) return null;
  const items = rows.map((r) => ({ ...r, doc: bySlug.get(r.slug) })).filter((r) => r.doc);
  if (!items.length) return null;
  return (
    <section className="vmx-related-docs" aria-label="เอกสารที่เกี่ยวข้อง">
      {heading && <div className="vmx-section-label">เอกสารที่เกี่ยวข้อง</div>}
      <ul>
        {items.map(({ doc, page, pages, term, evidence }) => (
          <li key={`${doc.slug}:${page}`}>
            <button
              type="button"
              onClick={() => { recordRecentDoc(doc); onOpenDoc(readerPayload(doc, { page })); }}
            >
              <span className="vmx-related-title">{displayDocTitle(doc.title)}</span>
              <span className="vmx-related-meta">
                {pages > 1 ? `หน้า ${page}, พบใน ${pages} หน้า` : `หน้า ${page}`}
              </span>
              <span className="vmx-related-evidence vmx-lib-snippet">
                …{markTerms(evidence, term).map((part, i) => (part.hit ? <mark key={i}>{part.text}</mark> : <span key={i}>{part.text}</span>))}…
              </span>
            </button>
          </li>
        ))}
      </ul>
      {items.some((r) => !r.reviewed) && (
        <p className="vmx-related-note">เชื่อมจากคำที่พบในหน้าเอกสาร ยังไม่มีคนตรวจทุกรายการ</p>
      )}
    </section>
  );
}
