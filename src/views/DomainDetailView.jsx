// ============================================================
// DomainDetailView.jsx — Domain Detail & Session Launcher View
// ============================================================

import React from 'react';
import BackBar from '../components/BackBar.jsx';

export default function DomainDetailView({
  domain = {
    id: 'domain-exotic-medicine',
    slug: 'exotic-medicine',
    name: 'Exotic Medicine',
    description: 'Avian, Reptile, and Small Mammal Veterinary Medicine practice domain',
    isPublished: true,
  },
  questionCount = 10,
  userProgress = {
    xp: 120,
    correctAnswers: 18,
    totalAnswers: 20,
    masteryPercent: 90,
  },
  onStartPractice, // (count, timeLimit) => void
  onBack,
}) {
  const hasPublishedQuestions = questionCount > 0;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px 20px' }}>
      <BackBar onBack={onBack} title="Domain Practice" />

      <div
        style={{
          marginTop: 16,
          padding: 24,
          borderRadius: 16,
          background: 'var(--clr-surface)',
          border: '1px solid var(--clr-border)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🩺</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontFamily: 'Fraunces, Georgia, serif' }}>{domain.name}</h1>
            <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)' }}>
              Slug: <code>{domain.slug}</code>
            </div>
          </div>
        </div>

        <p style={{ marginTop: 12, color: 'var(--clr-ink-soft)', lineHeight: 1.6 }}>{domain.description}</p>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 12,
            marginTop: 20,
            marginBottom: 24,
          }}
        >
          <div style={{ padding: 12, borderRadius: 10, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)' }}>
            <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase' }}>Published Qs</div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--vmx-mono)' }}>{questionCount}</div>
          </div>
          <div style={{ padding: 12, borderRadius: 10, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)' }}>
            <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase' }}>Mastery</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--clr-sage-text)', fontFamily: 'var(--vmx-mono)' }}>
              {userProgress.masteryPercent}%
            </div>
          </div>
          <div style={{ padding: 12, borderRadius: 10, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)' }}>
            <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase' }}>XP Earned</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--clr-gold-text)', fontFamily: 'var(--vmx-mono)' }}>
              ⚡ {userProgress.xp}
            </div>
          </div>
        </div>

        {/* Actions */}
        {!hasPublishedQuestions ? (
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: 'rgba(194, 109, 109, 0.1)',
              border: '1px solid var(--clr-rose)',
              color: 'var(--clr-rose-text)',
              textAlign: 'center',
            }}
          >
            Domain นี้ยังไม่มีข้อสอบที่เปิดเผยแพร่ (No published questions available)
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="vmx-btn vmx-btn-primary"
              onClick={() => onStartPractice?.(10, null)}
              style={{ flex: 1, minWidth: 200, padding: '14px 20px', fontSize: 15 }}
            >
              Start 10-Question Practice
            </button>

            <button
              type="button"
              className="vmx-btn vmx-btn-ghost"
              onClick={() => onStartPractice?.(25, 1500)}
              style={{
                flex: 1,
                minWidth: 200,
                padding: '14px 20px',
                fontSize: 15,
                border: '1px solid var(--clr-sage)',
                color: 'var(--clr-sage-text)',
              }}
            >
              Start 25-Question Mock Exam (25 min)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
