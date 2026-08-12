// ShortcutSheet — Linear-style "press ? for keyboard help" modal.
// Mounted from App.jsx, opened by '?' key (gated to exam/review views
// in App.jsx). Closes on Esc + overlay click. 44 px touch targets,
// 100dvh-aware, safe-area-inset-bottom respected.
//
// Pure presentation — no listeners outside Esc/overlay; the key
// bindings themselves live in App.jsx so the gating logic stays
// centralised (view + input-target guards).

import { useModalFocus } from '../hooks/useModalFocus.js';

const SHORTCUTS = [
  {
    section: 'Navigation',
    items: [
      { keys: ['J', '→'], label: 'ข้อถัดไป' },
      { keys: ['K', '←'], label: 'ข้อก่อนหน้า' },
      { keys: ['Space', 'Enter'], label: 'ถัดไป / ส่งคำตอบ' },
    ],
  },
  {
    section: 'Actions',
    items: [
      { keys: ['B'], label: 'บันทึก (bookmark)' },
      { keys: ['P'], label: 'หมุด (pin)' },
      { keys: ['F'], label: 'ทำเครื่องหมาย (flag)' },
      { keys: ['1', '2', '3', '4'], label: 'เลือกตัวเลือก (MCQ)' },
      { keys: ['T', 'F'], label: 'True / False' },
    ],
  },
  {
    section: 'Tools',
    items: [
      { keys: ['⌘K', 'Ctrl+K'], label: 'Command palette' },
      { keys: ['?'], label: 'แสดง / ปิด keyboard shortcut sheet' },
    ],
  },
  {
    section: 'Close',
    items: [{ keys: ['Esc'], label: 'ปิด modal' }],
  },
];

function Kbd({ children }) {
  return (
    <kbd
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 28,
        height: 26,
        padding: '0 6px',
        borderRadius: 6,
        background: 'var(--clr-surface-2, rgba(0,0,0,0.05))',
        border: '1px solid var(--clr-border)',
        fontFamily: 'var(--vmx-mono)',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--clr-ink)',
        lineHeight: 1,
      }}
    >
      {children}
    </kbd>
  );
}

export default function ShortcutSheet({ open, onClose }) {
  const dialogRef = useModalFocus({ active: open, onClose });

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        // Longhand for Safari < 14.1; inset shorthand below covers
        // modern browsers (renders identically).
        top: 0, right: 0, bottom: 0, left: 0,
        inset: 0,
        zIndex: 980,
        background: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'env(safe-area-inset-top, 12px) 12px env(safe-area-inset-bottom, 12px) 12px',
        height: '100dvh',
      }}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="แป้นพิมพ์ลัด (keyboard shortcuts)"
        tabIndex={-1}
        data-vmx-modal="true"
        style={{
          background: 'var(--clr-surface)',
          border: '1px solid var(--clr-border)',
          borderRadius: 14,
          padding: 18,
          maxWidth: 480,
          width: '100%',
          maxHeight: 'calc(100dvh - 32px)',
          overflowY: 'auto',
          boxShadow: '0 12px 36px rgba(0,0,0,0.24)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 15,
              fontFamily: 'var(--vmx-mono)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--clr-ink)',
            }}
          >
            ⌨️ Keyboard shortcuts
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            style={{
              all: 'unset',
              cursor: 'pointer',
              minHeight: 44,
              minWidth: 44,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              color: 'var(--clr-ink-soft)',
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {SHORTCUTS.map((sec) => (
            <section key={sec.section}>
              <h3
                style={{
                  margin: '0 0 8px 0',
                  fontSize: 11,
                  fontFamily: 'var(--vmx-mono)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--clr-ink-soft)',
                }}
              >
                {sec.section}
              </h3>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  display: 'grid',
                  gap: 6,
                }}
              >
                {sec.items.map((it) => (
                  <li
                    key={it.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '6px 0',
                      fontSize: 13,
                      color: 'var(--clr-ink)',
                    }}
                  >
                    <span style={{ flex: 1, minWidth: 0 }}>{it.label}</span>
                    <span style={{ display: 'inline-flex', gap: 4, flexShrink: 0 }}>
                      {it.keys.map((k, i) => (
                        <Kbd key={i}>{k}</Kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p
          style={{
            margin: '14px 0 0 0',
            fontSize: 11,
            color: 'var(--clr-ink-soft)',
            fontFamily: 'var(--vmx-mono)',
            textAlign: 'center',
          }}
        >
          กด <Kbd>?</Kbd> ในหน้า exam หรือ review เพื่อเปิด/ปิด
        </p>
      </div>
    </div>
  );
}
