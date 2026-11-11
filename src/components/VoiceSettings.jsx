// ============================================================
// VoiceSettings — modal for tuning TTS pace + pause defaults
// ============================================================
//
// Palm 2026-05-16: "ค่า default ตามที่ผมบอก, แต่ user ปรับเองได้".
// This modal surfaces the live values from getTtsPrefs() and writes
// back via setTtsPrefs() — pausesFor() reads on every speak so a
// slider change takes effect on the very next Q without page reload.
//
// Surfaced from:
//   • CommandPalette (action: 'voice-settings')
//   • AccountSettingsView (signed-in users)
//   • Possibly a tiny ⚙ next to the 🔊 button later
// ============================================================

import { useRef, useState } from 'react';
import { prefRow, readPref, writePref } from '../lib/prefs/table.js';
import { useModalFocus } from '../hooks/useModalFocus.js';

// The four sliders are the voice.* rows of src/lib/prefs/table.js: their
// label, range and default come from there and a change is written through
// it (lib/tts.js stays the owner of the stored value).
const ROWS = ['voice.speed', 'voice.afterStem', 'voice.betweenOpts', 'voice.afterLast'];
const FORMAT = { 'voice.speed': (v) => `${v.toFixed(2)}×` };
const HINT = {
  'voice.speed': () => '0.8 ช้า 1.0 ปกติ 1.2 เร็ว',
  'voice.afterStem': (d) => `หยุดก่อนเข้าตัวเลือก ก (ค่าเริ่มต้น ${d} มิลลิวินาที)`,
  'voice.betweenOpts': (d) => `ระหว่างตัวเลือกแต่ละข้อ (ค่าเริ่มต้น ${d} มิลลิวินาที)`,
  'voice.afterLast': (d) => `หยุดหลังอ่านตัวเลือกสุดท้าย (ค่าเริ่มต้น ${d} มิลลิวินาที)`,
};

export default function VoiceSettings({ onClose }) {
  const [prefs, setPrefs] = useState(() => Object.fromEntries(ROWS.map((id) => [id, readPref(id)])));
  const firstControlRef = useRef(null);
  const dialogRef = useModalFocus({ onClose, initialFocusRef: firstControlRef });

  const update = (id, value) => {
    setPrefs((p) => ({ ...p, [id]: value }));
    writePref(id, value);  // pausesFor() reads on the next speak
  };
  const reset = () => {
    for (const id of ROWS) update(id, prefRow(id).def());
  };

  return (
    <div className="vmx-modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="vmx-modal"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        data-vmx-modal="true"
        role="dialog"
        aria-modal="true"
        aria-label="ตั้งค่าเสียงอ่าน"
        style={{ maxWidth: 480 }}
      >
        <div style={{ marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 22 }}>ปรับเสียงพูดข้อสอบ</h2>
          <p style={{ fontSize: 14, color: 'var(--clr-ink-soft)', margin: '6px 0 0', lineHeight: 1.5 }}>
            ค่าที่ตั้งใช้กับการกดฟังครั้งต่อไป ไม่ต้องโหลดหน้าใหม่
            {' '}เก็บไว้ในเครื่องนี้เท่านั้น
          </p>
        </div>

        {ROWS.map((id, i) => {
          const row = prefRow(id);
          const d = row.def();
          return (
            <SliderRow
              key={id}
              inputRef={i === 0 ? firstControlRef : undefined}
              label={row.label}
              hint={HINT[id](d)}
              value={prefs[id]}
              {...row.range}
              format={FORMAT[id] || ((v) => `${v} ms`)}
              onChange={(v) => update(id, v)}
            />
          );
        })}

        <div className="vmx-btn-row" style={{ marginTop: 16, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={reset} type="button">
            คืนค่าเริ่มต้น
          </button>
          <button className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={onClose} type="button">
            เสร็จ
          </button>
        </div>
      </div>
    </div>
  );
}

function SliderRow({ label, hint, value, min, max, step, format, onChange, inputRef }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--clr-ink)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 12, color: 'var(--clr-sage-text)' }}>
          {format(value)}
        </span>
      </div>
      <input
        ref={inputRef}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        style={{ width: '100%', accentColor: 'var(--clr-sage)' }}
      />
      <div style={{ fontSize: 14, color: 'var(--clr-ink-soft)', fontStyle: 'italic', marginTop: 2 }}>{hint}</div>
    </div>
  );
}
