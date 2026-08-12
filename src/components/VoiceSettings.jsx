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
import { getTtsPrefs, setTtsPrefs, DEFAULT_TTS_PREFS } from '../lib/tts.js';
import { useModalFocus } from '../hooks/useModalFocus.js';

export default function VoiceSettings({ onClose }) {
  // Local state so dragging a slider doesn't write to localStorage on
  // every pointermove (those writes are ~1ms each but still pointless
  // — we commit on input release via the slider's onChange-after-pointerup
  // flow, which fires once per "settled" value).
  const [prefs, setPrefs] = useState(() => getTtsPrefs());
  const firstControlRef = useRef(null);
  const dialogRef = useModalFocus({ onClose, initialFocusRef: firstControlRef });

  const update = (patch) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    setTtsPrefs(next);  // immediate persist — pausesFor() reads on next speak
  };

  const reset = () => {
    setPrefs({ ...DEFAULT_TTS_PREFS });
    setTtsPrefs({ ...DEFAULT_TTS_PREFS });
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
        aria-label="Voice settings"
        style={{ maxWidth: 480 }}
      >
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            🎚 Voice settings
          </div>
          <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>ปรับเสียงพูดข้อสอบ</h2>
          <p style={{ fontSize: 12, color: 'var(--clr-ink-soft)', margin: '6px 0 0', lineHeight: 1.5 }}>
            ค่าจะ apply ทันทีที่กด 🔊 ครั้งต่อไป (ไม่ต้อง refresh).
            {' '}เก็บไว้ในเครื่องนี้เท่านั้น (ไม่ sync ข้ามอุปกรณ์).
          </p>
        </div>

        <SliderRow
          inputRef={firstControlRef}
          label="ความเร็วเสียงพูด"
          hint="0.8 = ช้า, 1.0 = ปกติ, 1.2 = เร็ว"
          value={prefs.speed}
          min={0.8}
          max={1.2}
          step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
          onChange={(v) => update({ speed: v })}
        />

        <SliderRow
          label="พักหลังโจทย์"
          hint={`หยุดก่อนเข้าตัวเลือก A (default ${DEFAULT_TTS_PREFS.afterStem} ms)`}
          value={prefs.afterStem}
          min={0}
          max={800}
          step={10}
          format={(v) => `${v} ms`}
          onChange={(v) => update({ afterStem: v })}
        />

        <SliderRow
          label="ช่องว่างระหว่างตัวเลือก"
          hint={`A → B → C → D (default ${DEFAULT_TTS_PREFS.betweenOpts} ms)`}
          value={prefs.betweenOpts}
          min={0}
          max={500}
          step={10}
          format={(v) => `${v} ms`}
          onChange={(v) => update({ betweenOpts: v })}
        />

        <SliderRow
          label="พักท้ายข้อ"
          hint={`หยุดหลังตัวเลือกสุดท้ายก่อนปุ่ม onEnd (default ${DEFAULT_TTS_PREFS.afterLast} ms)`}
          value={prefs.afterLast}
          min={0}
          max={500}
          step={10}
          format={(v) => `${v} ms`}
          onChange={(v) => update({ afterLast: v })}
        />

        <div className="vmx-btn-row" style={{ marginTop: 16, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={reset} type="button">
            ↺ คืนค่า default
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
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-ink)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 12, color: 'var(--clr-sage)' }}>
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
      <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontStyle: 'italic', marginTop: 2 }}>{hint}</div>
    </div>
  );
}
