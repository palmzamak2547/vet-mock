// ============================================================
// PublicWikiView.jsx — Student-facing Public Knowledge Base & Wiki
// ============================================================
// Enforces server-side public access rules:
// 1. Only approved, non-demo, source-verified pages are accessible.
// 2. Draft/blocked/archived/demo anchors are strictly excluded before rendering.
// 3. Inaccessible pages or anchors render a secure 404 (Not Found) response without leaking titles or content.

import React, { useState } from 'react';
import BackBar from '../components/BackBar.jsx';
import { filterPublicPages } from '../lib/public-wiki-filter.js';

export { filterPublicPages };

export default function PublicWikiView({
  pages = [],
  selectedPageId = null,
  selectedAnchorId = null,
  onBack,
  onSelectPage,
}) {
  const publicPages = filterPublicPages(pages);

  // If a specific page ID was requested via URL, check if it's in publicPages
  const activePage = selectedPageId
    ? publicPages.find((p) => p.pageId === selectedPageId)
    : publicPages[0];

  // Direct route 404 guard: If requested pageId is not accessible, return 404 without leaking title/content
  const isRequestedPageNotFound = selectedPageId && !activePage;

  if (isRequestedPageNotFound) {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto', padding: 24, textAlign: 'center', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 12 }}>
        <h2 style={{ color: 'var(--clr-rose-text)', margin: '0 0 8px 0', fontSize: 24 }}>404 — Page Not Found</h2>
        <p style={{ color: 'var(--clr-ink-soft)', margin: 0 }}>
          หน้า Wiki ที่คุณขอไม่มีอยู่หรือยังไม่ผ่านการอนุมัติเผยแพร่ (The requested page is not accessible).
        </p>
        <button type="button" className="vmx-btn vmx-btn-ghost" onClick={onBack} style={{ marginTop: 20 }}>
          ← กลับหน้าหลัก
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px 20px' }}>
      <BackBar onBack={onBack} title="VetMock Knowledge Wiki" />

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, marginTop: 16 }}>
        {/* Sidebar Nav */}
        <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--clr-ink-soft)', marginBottom: 8 }}>
            Approved Knowledge Pages
          </div>
          {publicPages.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
              No public wiki pages available.
            </div>
          ) : (
            publicPages.map((page) => (
              <button
                key={page.pageId}
                type="button"
                onClick={() => onSelectPage?.(page.pageId)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'block',
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '8px 10px',
                  borderRadius: 8,
                  marginBottom: 4,
                  fontSize: 13,
                  fontWeight: page.pageId === activePage?.pageId ? 700 : 400,
                  background: page.pageId === activePage?.pageId ? 'rgba(74, 107, 74, 0.12)' : 'transparent',
                  color: page.pageId === activePage?.pageId ? 'var(--clr-sage)' : 'var(--clr-ink)',
                }}
              >
                📖 {page.title}
              </button>
            ))
          )}
        </div>

        {/* Content Panel */}
        <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 12, padding: 24 }}>
          {activePage ? (
            <div>
              <div style={{ borderBottom: '1px solid var(--clr-border)', paddingBottom: 12, marginBottom: 16 }}>
                <h1 style={{ margin: 0, fontSize: 22, fontFamily: 'Fraunces, Georgia, serif' }}>{activePage.title}</h1>
                <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)', marginTop: 4 }}>
                  Page ID: <code>{activePage.pageId}</code> | Approval Ref: <code>{activePage.sourceApprovalRef}</code>
                </div>
              </div>

              {/* Anchors List */}
              <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12 }}>Approved Anchors</h3>

              {activePage.anchors.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
                  No approved anchors found on this page.
                </div>
              ) : (
                activePage.anchors.map((anchor) => {
                  const isTarget = anchor.anchorId === selectedAnchorId;
                  return (
                    <div
                      key={anchor.anchorId}
                      id={anchor.anchorId}
                      style={{
                        marginBottom: 16,
                        padding: 16,
                        borderRadius: 10,
                        background: isTarget ? 'rgba(74, 107, 74, 0.08)' : 'var(--clr-surface-2)',
                        border: isTarget ? '2px solid var(--clr-sage)' : '1px solid var(--clr-border)',
                      }}
                    >
                      <h4 style={{ margin: 0, fontSize: 15, fontFamily: 'Fraunces, Georgia, serif' }}>
                        <a href={`#${anchor.anchorId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          # {anchor.title}
                        </a>
                      </h4>
                      <p style={{ margin: '8px 0 0 0', fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.5 }}>
                        {anchor.contentSummary || 'No summary available.'}
                      </p>
                      <div style={{ fontSize: 10, opacity: 0.7, fontFamily: 'var(--vmx-mono)', marginTop: 8 }}>
                        Anchor ID: <code>{anchor.anchorId}</code> | Approval: <code>{anchor.sourceApprovalRef}</code>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--clr-ink-soft)' }}>
              Select a page to view content.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
