// ============================================================
// MockExamView.jsx — Timed / Untimed Mock Session Exam Player
// ============================================================

import React, { useState, useEffect } from 'react';
import { fmtTime } from '../hooks/utils.js';

export default function MockExamView({
  session = {
    id: 'session-demo-001',
    userId: 'user-current',
    domainId: 'domain-exotic-medicine',
    title: 'Exotic Medicine Mock Exam',
    status: 'in_progress',
    questionCount: 2,
    timeLimitSeconds: 1500,
  },
  questions = [
    {
      id: 'q-exotic-001',
      questionCode: 'EXOTIC-001',
      stem: 'Which structure in the avian respiratory system connects the posterior air sacs to the lungs? (DEMO ONLY)',
      choices: [
        'Syrinx',
        'Primary bronchi',
        'Neopulmonic parabronchi',
        'Paleopulmonic parabronchi',
      ],
    },
    {
      id: 'q-exotic-002',
      questionCode: 'EXOTIC-002',
      stem: 'What is the recommended blood sampling site in large psittacine birds? (DEMO ONLY)',
      choices: [
        'Right jugular vein',
        'Left jugular vein',
        'Medial metatarsal vein',
        'Cephalic vein',
      ],
    },
  ],
  currentUserId = 'user-current',
  onSaveChoice, // (sessionId, questionId, choiceIndex) => void
  onSubmitSession, // (sessionId) => void
  onAbandonSession, // (sessionId) => void
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [timeLeft, setTimeLeft] = useState(session.timeLimitSeconds || null);

  // Security Rule: Prevent access to another user's session
  if (session.userId && currentUserId && session.userId !== currentUserId) {
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, textAlign: 'center', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 12 }}>
        <h2 style={{ color: 'var(--clr-rose)', margin: '0 0 12px 0' }}>⛔ Unauthorized Access</h2>
        <p style={{ color: 'var(--clr-ink-soft)' }}>
          คุณไม่มีสิทธิ์เข้าถึงชุดข้อสอบของผู้ใช้อื่น (You cannot access another user's mock session).
        </p>
      </div>
    );
  }

  // Timer countdown if timeLimitSeconds is set
  useEffect(() => {
    if (!session.timeLimitSeconds || session.status !== 'in_progress') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          onSubmitSession?.(session.id, selectedChoices);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [session.timeLimitSeconds, session.status]);

  const currentQ = questions[currentIdx] || questions[0];
  const selectedChoice = selectedChoices[currentQ?.id] ?? null;

  const handleSelectChoice = (idx) => {
    const updated = { ...selectedChoices, [currentQ.id]: idx };
    setSelectedChoices(updated);
    onSaveChoice?.(session.id, currentQ.id, idx);
  };

  const handleAbandon = () => {
    if (window.confirm('คุณต้องการยกเลิกชุดข้อสอบนี้ใช่หรือไม่? (Abandon this mock session?)')) {
      onAbandonSession?.(session.id);
    }
  };

  const handleSubmit = () => {
    if (window.confirm('ยืนยันส่งชุดข้อสอบ? (Submit mock session?)')) {
      onSubmitSession?.(session.id, selectedChoices);
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '16px 20px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button
          type="button"
          onClick={handleAbandon}
          className="vmx-btn vmx-btn-ghost vmx-btn-sm"
          style={{ padding: '4px 12px', fontSize: 13 }}
        >
          ✕ Abandon Session
        </button>

        <div style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', fontSize: 14 }}>
          Q {currentIdx + 1} / {questions.length}
        </div>

        {timeLeft !== null && (
          <div style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: timeLeft < 120 ? 'var(--clr-rose)' : 'var(--clr-ink)' }}>
            ⏱️ {fmtTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div style={{ height: 6, background: 'var(--clr-surface-2)', borderRadius: 999, overflow: 'hidden', marginBottom: 20 }}>
        <div
          style={{
            height: '100%',
            width: `${((currentIdx + 1) / questions.length) * 100}%`,
            background: 'var(--clr-sage)',
            transition: 'width 0.2s',
          }}
        />
      </div>

      {/* Question Card */}
      <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>
          {currentQ.questionCode}
        </div>
        <h2 style={{ margin: '0 0 20px 0', fontSize: 18, lineHeight: 1.5, fontFamily: 'Fraunces, Georgia, serif' }}>
          {currentQ.stem}
        </h2>

        {/* Answer Choices — NO answers or explanations revealed during session */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {currentQ.choices?.map((choice, i) => {
            const isSelected = selectedChoice === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectChoice(i)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: isSelected ? '2px solid var(--clr-sage)' : '1px solid var(--clr-border)',
                  background: isSelected ? 'rgba(74, 107, 74, 0.1)' : 'var(--clr-surface-2)',
                  fontWeight: isSelected ? 600 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all 0.15s',
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: isSelected ? 'var(--clr-sage)' : 'var(--clr-surface)',
                    color: isSelected ? 'white' : 'var(--clr-ink-soft)',
                    border: '1px solid var(--clr-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1, fontSize: 15, lineHeight: 1.4 }}>{choice}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <button
          type="button"
          className="vmx-btn vmx-btn-ghost"
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
        >
          ← Previous
        </button>

        {currentIdx < questions.length - 1 ? (
          <button
            type="button"
            className="vmx-btn vmx-btn-primary"
            onClick={() => setCurrentIdx((i) => i + 1)}
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            className="vmx-btn vmx-btn-primary"
            onClick={handleSubmit}
            style={{ background: 'var(--clr-sage)', borderColor: 'var(--clr-sage)' }}
          >
            ✓ Submit Mock Session
          </button>
        )}
      </div>
    </div>
  );
}
