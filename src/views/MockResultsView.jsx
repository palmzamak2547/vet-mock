// ============================================================
// MockResultsView.jsx — Mock Exam Session Results & Review
// ============================================================

import React from 'react';
import BackBar from '../components/BackBar.jsx';
import QSourceChip from '../components/QSourceChip.jsx';
import { getEligibleCitationForQuestion } from '../lib/citation-gate.js';

export default function MockResultsView({
  session = {
    id: 'session-demo-001',
    title: 'Exotic Medicine Mock Exam',
    questionCount: 2,
    startedAt: new Date().toISOString(),
    submittedAt: new Date().toISOString(),
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
      correctChoiceIndex: 3,
      explanation: 'Paleopulmonic parabronchi comprise the majority of the avian lung structure with unidirectional airflow.',
      questionWikiRef: {
        wikiPageId: 'exotic-avian-and-reptile-medicine',
        wikiAnchorId: 'avian-anatomy-and-common-diseases',
      },
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
      correctChoiceIndex: 0,
      explanation: 'The right jugular vein is significantly larger than the left in most avian species.',
    },
  ],
  selectedChoices = { 'q-exotic-001': 3, 'q-exotic-002': 0 },
  store = {
    wikiPages: {
      'exotic-avian-and-reptile-medicine': {
        id: 'p-1',
        pageId: 'exotic-avian-and-reptile-medicine',
        status: 'approved',
        sourceApprovalRef: 'DEMO_ONLY_REF_001',
      },
    },
    wikiAnchors: {
      'exotic-avian-and-reptile-medicine#avian-anatomy-and-common-diseases': {
        id: 'a-1',
        anchorId: 'avian-anatomy-and-common-diseases',
        status: 'approved',
        mappingEligible: true,
        sourceApprovalRef: 'DEMO_ONLY_REF_001',
      },
    },
  },
  onHome,
}) {
  // Calculate score & stats
  let correctCount = 0;
  questions.forEach((q) => {
    if (selectedChoices[q.id] === q.correctChoiceIndex) {
      correctCount++;
    }
  });

  const accuracyPct = Math.round((correctCount / Math.max(1, questions.length)) * 100);
  const xpEarned = correctCount * 10 + 20;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px 20px' }}>
      <BackBar onBack={onHome} title="Mock Session Results" />

      {/* Summary Banner */}
      <div
        style={{
          marginTop: 16,
          padding: 24,
          borderRadius: 16,
          background: 'var(--clr-surface)',
          border: '1px solid var(--clr-border)',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--clr-ink-soft)', letterSpacing: '0.05em' }}>
          {session.title}
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            fontFamily: 'Fraunces, Georgia, serif',
            color: accuracyPct >= 70 ? 'var(--clr-sage)' : 'var(--clr-rose)',
            margin: '8px 0',
          }}
        >
          {accuracyPct}%
        </div>
        <div style={{ fontSize: 15, color: 'var(--clr-ink)' }}>
          {correctCount} / {questions.length} Correct · Earned <span style={{ color: 'var(--clr-gold)', fontWeight: 700 }}>⚡ +{xpEarned} XP</span>
        </div>
      </div>

      {/* Detailed Per-Question Breakdown */}
      <h3 style={{ marginTop: 28, marginBottom: 16, fontSize: 18, fontFamily: 'Fraunces, Georgia, serif' }}>
        Question Review & Citations
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {questions.map((q, idx) => {
          const userChoice = selectedChoices[q.id];
          const isCorrect = userChoice === q.correctChoiceIndex;
          const eligibleCitation = getEligibleCitationForQuestion(q, store);

          return (
            <div
              key={q.id}
              style={{
                background: 'var(--clr-surface)',
                border: '1px solid var(--clr-border)',
                borderLeft: `5px solid ${isCorrect ? 'var(--clr-sage)' : 'var(--clr-rose)'}`,
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace' }}>
                <span>Q{idx + 1} · {q.questionCode}</span>
                <span style={{ color: isCorrect ? 'var(--clr-sage)' : 'var(--clr-rose)', fontWeight: 700 }}>
                  {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                </span>
              </div>

              <h4 style={{ margin: '0 0 12px 0', fontSize: 16, lineHeight: 1.4, fontFamily: 'Fraunces, Georgia, serif' }}>
                {q.stem}
              </h4>

              {/* Choices */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {q.choices.map((choice, i) => {
                  const isUserSelected = userChoice === i;
                  const isAnswerKey = q.correctChoiceIndex === i;

                  let bg = 'var(--clr-surface-2)';
                  let color = 'var(--clr-ink)';
                  let border = '1px solid var(--clr-border)';

                  if (isAnswerKey) {
                    bg = 'rgba(74, 107, 74, 0.12)';
                    color = 'var(--clr-sage)';
                    border = '1px solid var(--clr-sage)';
                  } else if (isUserSelected && !isCorrect) {
                    bg = 'rgba(194, 109, 109, 0.12)';
                    color = 'var(--clr-rose)';
                    border = '1px solid var(--clr-rose)';
                  }

                  return (
                    <div
                      key={i}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: bg,
                        color,
                        border,
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>
                        <strong style={{ fontFamily: 'JetBrains Mono, monospace', marginRight: 8 }}>{String.fromCharCode(65 + i)}.</strong>
                        {choice}
                      </span>
                      {isAnswerKey && <span style={{ fontSize: 11, fontWeight: 700 }}>✓ Correct Choice</span>}
                      {isUserSelected && !isAnswerKey && <span style={{ fontSize: 11, fontWeight: 700 }}>Your Selection</span>}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {q.explanation && (
                <div style={{ padding: 12, borderRadius: 8, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)', fontSize: 13, color: 'var(--clr-ink-soft)', marginBottom: 8 }}>
                  💡 <strong>Explanation:</strong> {q.explanation}
                </div>
              )}

              {/* Citation Chip ONLY rendered via getEligibleCitationForQuestion() */}
              <QSourceChip q={q} store={store} />
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <button type="button" className="vmx-btn vmx-btn-primary" onClick={onHome} style={{ padding: '12px 24px', fontSize: 15 }}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
