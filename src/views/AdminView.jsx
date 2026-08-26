// ============================================================
// AdminView.jsx — Admin & Content Management Dashboard
// ============================================================
// Minimal role helper:
// TODO: Replace checkIsAdmin with Clerk publicMetadata.role === 'admin'
// or Supabase custom claims in production.

import React, { useState } from 'react';
import BackBar from '../components/BackBar.jsx';

/**
 * Minimal role check helper for admin route protection
 */
export function checkIsAdmin(user) {
  if (!user) return false;
  // Check Clerk metadata or explicit email/role properties
  if (user.publicMetadata?.role === 'admin') return true;
  if (user.role === 'admin') return true;
  if (user.email && (user.email.endsWith('@vetmock.org') || user.email.includes('admin'))) return true;
  // Default to false for strict security
  return false;
}

export default function AdminView({ user, onBack, initialTab = 'domains' }) {
  const isAdmin = checkIsAdmin(user);
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, textAlign: 'center', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 12 }}>
        <h2 style={{ color: 'var(--clr-rose-text)', margin: '0 0 12px 0' }}>Access Denied</h2>
        <p style={{ color: 'var(--clr-ink-soft)', lineHeight: 1.6 }}>
          คุณไม่มีสิทธิ์เข้าถึงส่วนผู้ดูแลระบบ (Admin authorization required).
        </p>
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)' }}>
          {/* TODO: Configure Clerk publicMetadata.role = 'admin' or database roles in production */}
          TODO: Configure production-grade Clerk/Supabase admin roles.
        </div>
        <button type="button" className="vmx-btn vmx-btn-ghost" onClick={onBack} style={{ marginTop: 20 }}>
          ← กลับหน้าหลัก
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '16px 20px' }}>
      <BackBar onBack={onBack} title="VetMock Admin Management" />

      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--clr-border)', marginBottom: 20, paddingTop: 8 }}>
        {[
          { id: 'domains', label: '📁 Domains' },
          { id: 'questions', label: '❓ Questions' },
          { id: 'wiki_pages', label: 'Wiki Pages' },
          { id: 'wiki_anchors', label: '⚓ Wiki Anchors' },
          { id: 'mappings', label: 'Citation Mappings' },
          { id: 'reviews', label: 'Content Reviews' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: activeTab === tab.id ? 700 : 500,
              borderBottom: activeTab === tab.id ? '2px solid var(--clr-sage)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--clr-sage)' : 'var(--clr-ink-soft)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 12, padding: 24 }}>
        {activeTab === 'domains' && (
          <div>
            <h3 style={{ margin: '0 0 16px 0' }}>Manage Domains</h3>
            <p style={{ color: 'var(--clr-ink-soft)', fontSize: 14 }}>Create and manage veterinary study domains and subjects.</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 16 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--clr-border)', textAlign: 'left' }}>
                  <th style={{ padding: 8 }}>Slug</th>
                  <th style={{ padding: 8 }}>Name</th>
                  <th style={{ padding: 8 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--clr-border)' }}>
                  <td style={{ padding: 8 }}><code>exotic-medicine</code></td>
                  <td style={{ padding: 8 }}>Exotic Medicine</td>
                  <td style={{ padding: 8, color: 'var(--clr-sage-text)', fontWeight: 700 }}>Published</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--clr-border)' }}>
                  <td style={{ padding: 8 }}><code>small-animal-internal-medicine</code></td>
                  <td style={{ padding: 8 }}>Small Animal Medicine</td>
                  <td style={{ padding: 8, color: 'var(--clr-sage-text)', fontWeight: 700 }}>Published</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'questions' && (
          <div>
            <h3 style={{ margin: '0 0 16px 0' }}>Manage Questions</h3>
            <p style={{ color: 'var(--clr-ink-soft)', fontSize: 14 }}>Review stem, choices, correct index, and published status.</p>
            <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)' }}>Total items in bank: 2,948+ questions.</div>
          </div>
        )}

        {activeTab === 'wiki_pages' && (
          <div>
            <h3 style={{ margin: '0 0 16px 0' }}>Manage Wiki Pages</h3>
            <p style={{ color: 'var(--clr-ink-soft)', fontSize: 14 }}>Approve, draft, or archive knowledge pages.</p>
          </div>
        )}

        {activeTab === 'wiki_anchors' && (
          <div>
            <h3 style={{ margin: '0 0 16px 0' }}>Manage Wiki Anchors</h3>
            <p style={{ color: 'var(--clr-ink-soft)', fontSize: 14 }}>Configure mappingEligible flags and source approval refs.</p>
          </div>
        )}

        {activeTab === 'mappings' && (
          <div>
            <h3 style={{ margin: '0 0 16px 0' }}>Question-to-Wiki Mappings</h3>
            <p style={{ color: 'var(--clr-ink-soft)', fontSize: 14 }}>Map question WikiRefs to verified anchors.</p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h3 style={{ margin: '0 0 16px 0' }}>Content Reviews & Approvals</h3>
            <p style={{ color: 'var(--clr-ink-soft)', fontSize: 14 }}>Review pending entity change requests.</p>
          </div>
        )}
      </div>
    </div>
  );
}
