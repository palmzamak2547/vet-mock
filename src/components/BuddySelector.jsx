import { useEffect, useState } from 'react';
import { SQUAD_MASCOTS } from '../data/art.js';
import {
  getSelectedBuddy,
  setSelectedBuddy,
  getBuddyStats,
  formatBuddyTime,
} from '../lib/buddy-stats.js';

export default function BuddySelector({ onSelect, selectedId }) {
  const [activeId, setActiveId] = useState(() => selectedId || getSelectedBuddy());
  const [statsMap, setStatsMap] = useState({});

  useEffect(() => {
    if (selectedId) setActiveId(selectedId);
  }, [selectedId]);

  // Load stats for all mascots
  const refreshStats = () => {
    const map = {};
    Object.keys(SQUAD_MASCOTS).forEach((id) => {
      map[id] = getBuddyStats(id);
    });
    setStatsMap(map);
  };

  useEffect(() => {
    refreshStats();
    const handleUpdate = () => refreshStats();
    window.addEventListener('vmx-buddy-changed', handleUpdate);
    return () => window.removeEventListener('vmx-buddy-changed', handleUpdate);
  }, []);

  const handlePick = (id) => {
    setActiveId(id);
    setSelectedBuddy(id);
    onSelect?.(id);
  };

  return (
    <div style={{ margin: 'var(--space-3) 0', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--clr-ink)' }}>
          🐾 เลือกคู่หูอ่านหนังสือ (Study Buddy)
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--clr-sage-text)' }}>
          อ่านด้วยกัน {formatBuddyTime(statsMap[activeId]?.minutes || 0)}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '6px',
          scrollbarWidth: 'thin',
        }}
      >
        {Object.values(SQUAD_MASCOTS).map((mascot) => {
          const isSelected = mascot.id === activeId;
          const buddyTime = statsMap[mascot.id]?.minutes || 0;
          return (
            <button
              key={mascot.id}
              type="button"
              onClick={() => handlePick(mascot.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '999px',
                border: isSelected ? '2px solid var(--clr-sage)' : '1px solid var(--clr-border)',
                background: isSelected ? 'var(--clr-sage-soft)' : 'var(--clr-surface)',
                color: isSelected ? 'var(--clr-sage-text)' : 'var(--clr-ink)',
                fontSize: '0.8rem',
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
            >
              <img
                src={mascot.src}
                alt=""
                width={24}
                height={24}
                style={{ width: '24px', height: '24px', objectFit: 'contain', borderRadius: '50%' }}
              />
              <span>{mascot.nameTh}</span>
              {buddyTime > 0 && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    opacity: 0.8,
                    background: isSelected ? 'var(--clr-surface)' : 'var(--clr-surface-2)',
                    padding: '2px 6px',
                    borderRadius: '8px',
                  }}
                >
                  {formatBuddyTime(buddyTime)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
