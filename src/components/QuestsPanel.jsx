// QuestsPanel — daily quest dashboard on HomeView.
// 3 quest cards + a bonus card when all 3 are claimed.
// Subscribes to vmx-quests-changed and vmx-xp-changed so any path
// (exam finish, SR grade, notes read, flashcard create) updates the
// progress + claim availability live.

import { useEffect, useState } from 'react';
import {
  getTodaysQuests,
  getBonusState,
  claimQuestReward,
  claimBonusReward,
  getQuestStreak,
  QUEST_EVENT,
} from '../lib/quests.js';
import { XP_EVENT } from '../lib/xp.js';

function useQuestState(year) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const refresh = () => setTick((t) => t + 1);
    window.addEventListener(QUEST_EVENT, refresh);
    window.addEventListener(XP_EVENT, refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener(QUEST_EVENT, refresh);
      window.removeEventListener(XP_EVENT, refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  // tick keeps this fresh; reads pull directly from quests.js so we
  // don't have to mirror state in React.
  return {
    quests: getTodaysQuests(year),
    bonus: getBonusState(year),
    streak: getQuestStreak(),
    _tick: tick,
  };
}

// Map quest IDs to action types — Phase 4 (2026-05-18) needs per-quest
// "▶️ ลุย" routing without HomeView having to know the schema. Returns
// null when no obvious entry point exists (e.g. quest is bonus-tier).
//
// Patterns:
//   answer-N-any / answer-N-correct / answer-N-mixed  → random Q
//   answer-N-<subject>                                → that subject
//   review-N-sr / sr-easy-N                           → SR session
//   read-N-topic*                                     → subject grid (notes)
//   flashcard-*                                       → subject grid
function questActionFor(quest) {
  if (!quest || quest.claimed || quest.complete) return null;
  const id = String(quest.id || '');
  if (id.startsWith('review-') && id.endsWith('-sr')) return { kind: 'sr' };
  if (id.startsWith('sr-')) return { kind: 'sr' };
  if (id.startsWith('flashcard-')) return { kind: 'subject-select', hint: 'flashcard' };
  if (id.startsWith('read-')) return { kind: 'subject-select', hint: 'notes' };
  if (id.startsWith('answer-')) {
    // answer-10-com3 / answer-8-repro / answer-N-any|correct|mixed
    const m = id.match(/^answer-\d+-(\w+)$/);
    const tail = m?.[1];
    if (!tail) return { kind: 'random' };
    if (tail === 'any' || tail === 'correct' || tail === 'mixed') return { kind: 'random' };
    return { kind: 'subject', subject: tail };
  }
  return null;
}

function QuestCard({ quest, compact, onStart }) {
  const claimable = quest.complete && !quest.claimed;
  const action = onStart ? questActionFor(quest) : null;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? 10 : 14,
        padding: compact ? '10px 12px' : '12px 14px',
        borderRadius: 12,
        background: 'var(--clr-surface)',
        border: `1px solid ${claimable ? 'var(--clr-sage, #4a6b4a)' : 'var(--clr-border)'}`,
        boxShadow: claimable ? '0 0 0 2px rgba(74,107,74,0.10)' : 'none',
        minHeight: compact ? 56 : 64,
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
        opacity: quest.claimed ? 0.62 : 1,
        // Palm compat audit 2026-05-24: at narrow viewports (320px
        // iPhone SE), icon + label + button row exceeds container
        // width. flex-wrap lets the button drop below the label so
        // we never trigger horizontal overflow.
        flexWrap: 'wrap',
        // Prevent the flex line from forcing parent wider than
        // its allotted grid cell.
        minWidth: 0,
      }}
    >
      <div
        aria-hidden
        style={{
          fontSize: compact ? 22 : 26,
          width: compact ? 36 : 40,
          textAlign: 'center',
          flexShrink: 0,
        }}
      >
        {quest.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: compact ? 13 : 14,
            fontWeight: 600,
            color: 'var(--clr-ink)',
            marginBottom: 6,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 8,
          }}
        >
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {quest.label}
          </span>
          <span
            style={{
              fontSize: 11,
              fontFamily: 'var(--vmx-mono)',
              color: 'var(--clr-sage-text, #4a6b4a)',
              flexShrink: 0,
            }}
          >
            +{quest.xp} XP
          </span>
        </div>
        <div
          aria-hidden
          style={{
            position: 'relative',
            height: 6,
            borderRadius: 3,
            background: 'rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 0, right: 0, bottom: 0, left: 0,
              inset: 0,
              width: `${quest.pct}%`,
              background: quest.claimed
                ? 'var(--clr-ink-soft, #888)'
                : 'var(--clr-sage, #4a6b4a)',
              transition: 'width 400ms ease',
            }}
          />
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--clr-ink-soft)',
            marginTop: 4,
            fontFamily: 'var(--vmx-mono)',
          }}
        >
          {quest.progress} / {quest.target}
        </div>
      </div>
      {claimable && (
        <button
          type="button"
          onClick={() => {
            claimQuestReward(quest.id);
            // Round 2A 2026-05-18: emit a custom event the panel
            // listens to so it can surface "ทำต่อ quest ถัดไป" —
            // Palm spec wants the claim flow to chain into the next
            // incomplete quest instead of stopping at "รับแล้ว".
            try {
              window.dispatchEvent(new CustomEvent('vmx-quest-claimed', { detail: { id: quest.id } }));
            } catch {}
          }}
          className="vmx-pop-in"
          style={{
            all: 'unset',
            cursor: 'pointer',
            padding: '10px 14px',
            minHeight: 44,
            borderRadius: 999,
            background: 'var(--clr-sage, #4a6b4a)',
            color: 'white',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: 'var(--vmx-mono)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-label={`รับ ${quest.xp} XP`}
        >
          🎁 รับ
        </button>
      )}
      {!claimable && action && (
        <button
          type="button"
          onClick={() => onStart?.(action, quest)}
          style={{
            all: 'unset',
            cursor: 'pointer',
            padding: '8px 12px',
            minHeight: 40,
            borderRadius: 999,
            background: 'transparent',
            border: '1px solid var(--clr-sage, #4a6b4a)',
            color: 'var(--clr-sage-text, #4a6b4a)',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'var(--vmx-mono)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
          aria-label={`เริ่มภารกิจ ${quest.label}`}
          title="กดเริ่มภารกิจนี้ทันที"
        >
          ▶️ ลุย
        </button>
      )}
      {quest.claimed && (
        <span
          aria-hidden
          style={{
            padding: '6px 10px',
            fontSize: 11,
            color: 'var(--clr-ink-soft)',
            fontFamily: 'var(--vmx-mono)',
            flexShrink: 0,
          }}
        >
          ✓ รับแล้ว
        </span>
      )}
    </div>
  );
}

function BonusCard({ bonus, compact }) {
  // Respect prefers-reduced-motion — skip the entrance bounce.
  const prefersReduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return (
    <div
      className={prefersReduce ? undefined : 'vmx-pop-in'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: compact ? '10px 12px' : '12px 14px',
        borderRadius: 12,
        background:
          'linear-gradient(135deg, rgba(217, 119, 68, 0.10), rgba(74, 107, 74, 0.10))',
        border: '1px solid var(--clr-sage, #4a6b4a)',
        minHeight: compact ? 52 : 60,
      }}
    >
      <div style={{ fontSize: 24, flexShrink: 0 }} aria-hidden>
        🎉
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--clr-ink)' }}>
          ครบทุก quest วันนี้!
        </div>
        <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)' }}>
          โบนัส +{bonus.xp} XP
        </div>
      </div>
      <button
        type="button"
        onClick={() => claimBonusReward()}
        style={{
          all: 'unset',
          cursor: 'pointer',
          padding: '10px 14px',
          minHeight: 44,
          borderRadius: 999,
          background: 'var(--clr-sage, #4a6b4a)',
          color: 'white',
          fontSize: 13,
          fontWeight: 700,
          fontFamily: 'var(--vmx-mono)',
          flexShrink: 0,
        }}
      >
        🎁 รับโบนัส
      </button>
    </div>
  );
}

export default function QuestsPanel({ compact = false, onStart, year = null }) {
  const { quests, bonus, streak } = useQuestState(year);
  // Round 2A 2026-05-18: "หลัง claim → เสนอ quest ถัดไป" — ephemeral
  // suggestion banner shown for ~6s after a claim, pointing to the
  // first incomplete + actionable next quest. Auto-dismisses so it
  // doesn't accumulate noise across multiple claims in a session.
  const [recentClaim, setRecentClaim] = useState(null);
  useEffect(() => {
    const handler = () => {
      // Pick the next non-claimed, non-complete quest that has an
      // action mapping. Re-read from getTodaysQuests inside the
      // handler so we see the just-claimed state.
      const fresh = getTodaysQuests(year);
      const next = fresh.find((q) => !q.claimed && !q.complete && questActionFor(q));
      if (next) setRecentClaim({ next, t: Date.now() });
    };
    window.addEventListener('vmx-quest-claimed', handler);
    return () => window.removeEventListener('vmx-quest-claimed', handler);
  }, []);
  useEffect(() => {
    if (!recentClaim) return;
    const t = setTimeout(() => setRecentClaim(null), 6500);
    return () => clearTimeout(t);
  }, [recentClaim]);

  if (!quests || quests.length === 0) return null;
  const claimedCount = quests.filter((q) => q.claimed).length;

  return (
    <section
      aria-label="ภารกิจประจำวัน"
      style={{
        marginBottom: 18,
        padding: 'env(safe-area-inset-top, 0) 0 0 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 10,
          flexWrap: 'wrap',
          gap: 6,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 14,
            fontFamily: 'var(--vmx-mono)',
            color: 'var(--clr-ink)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          ภารกิจประจำวัน
        </h3>
        <div
          style={{
            fontSize: 11,
            color: 'var(--clr-ink-soft)',
            fontFamily: 'var(--vmx-mono)',
          }}
        >
          {claimedCount}/{quests.length} เสร็จ
          {streak > 0 && <span>, streak {streak} วัน</span>}
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gap: 8,
          gridTemplateColumns: '1fr',
          paddingBottom: 'env(safe-area-inset-bottom, 0)',
        }}
      >
        {quests.map((q) => (
          <QuestCard key={q.id} quest={q} compact={compact} onStart={onStart} />
        ))}
        {recentClaim?.next && onStart && (
          <div
            className="vmx-pop-in"
            role="status"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(74, 107, 74, 0.10), rgba(184, 137, 64, 0.08))',
              border: '1px dashed var(--clr-sage, #4a6b4a)',
              minHeight: 52,
            }}
          >
            <div style={{ fontSize: 20, flexShrink: 0 }} aria-hidden>👉</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-sage-text, #4a6b4a)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                ทำต่อ quest ถัดไป
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2, color: 'var(--clr-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {recentClaim.next.label.replace('{N}', recentClaim.next.target)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const action = questActionFor(recentClaim.next);
                if (action) onStart(action, recentClaim.next);
                setRecentClaim(null);
              }}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '8px 12px',
                minHeight: 40,
                borderRadius: 999,
                background: 'var(--clr-sage, #4a6b4a)',
                color: 'white',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'var(--vmx-mono)',
                flexShrink: 0,
              }}
            >
              ▶️ ลุย
            </button>
          </div>
        )}
        {bonus.available && <BonusCard bonus={bonus} compact={compact} />}
        {bonus.claimed && (
          <div
            style={{
              fontSize: 11,
              color: 'var(--clr-ink-soft)',
              textAlign: 'center',
              fontFamily: 'var(--vmx-mono)',
              padding: '6px 0',
            }}
          >
            ✓ รับโบนัสวันนี้แล้ว — กลับมาพรุ่งนี้
          </div>
        )}
      </div>
    </section>
  );
}
