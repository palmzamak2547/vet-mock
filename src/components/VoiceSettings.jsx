// ============================================================
// VoiceSettings — the listener's voice: speed, tone, which voice
// ============================================================
// One small dialog, opened from the read-aloud bar's speed button, from the
// profile and from search. Every change is kept on this device at once
// (lib/voice-prefs.js) and heard at once: a reading in progress takes the new
// speed mid-word and a new tone or voice from the sentence it is on. Nothing
// here asks a paid voice for anything: ลองฟัง is the device's own voice.
// ============================================================

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useModalFocus } from '../hooks/useModalFocus.js';
import {
  DEFAULT_VOICE_PREFS, PITCHES, RATES, getVoicePrefs, setVoicePrefs, subscribeVoicePrefs,
} from '../lib/voice-prefs.js';
import { PITCH_LABELS, PRESETS, presetOf } from '../lib/voice-choices.js';
import '../styles-voice.css';

const NO_THAI = 'เครื่องนี้ไม่มีเสียงอ่านภาษาไทย เพิ่มได้ในการตั้งค่าเสียงของเครื่อง';
const rateText = (r) => `${r}x`;

export default function VoiceSettings({ onClose, onBeforeSample }) {
  const prefs = useSyncExternalStore(subscribeVoicePrefs, getVoicePrefs, getVoicePrefs);
  const preset = presetOf(prefs);
  const firstRef = useRef(null);
  const dialogRef = useModalFocus({ onClose, initialFocusRef: firstRef });
  // The device's voices load with the speech code (out of the first load).
  const [voices, setVoices] = useState(null);
  const [sample, setSample] = useState({ state: 'idle', note: '' });
  const tts = useRef(null);
  const sampleRun = useRef(0);
  useEffect(() => {
    let live = true;
    import('../lib/tts.js').then((m) => {
      tts.current = m;
      return m.deviceVoices();
    }).then((v) => { if (live) setVoices(v); }, () => { if (live) setVoices({ th: [], en: [] }); });
    return () => { live = false; tts.current?.stopSample?.(); };
  }, []);

  const playSample = async () => {
    if (sample.state === 'playing') { sampleRun.current++; tts.current?.stopSample(); setSample({ state: 'idle', note: '' }); return; }
    onBeforeSample?.();
    const mine = ++sampleRun.current;
    setSample({ state: 'playing', note: '' });
    let res;
    try {
      const m = tts.current || await import('../lib/tts.js');
      tts.current = m;
      res = await m.speakSample('th');
    } catch { res = { ok: false, reason: 'no-speech' }; }
    if (mine !== sampleRun.current) return;
    if (!res.ok) { setSample({ state: 'idle', note: res.reason === 'no-speech' ? 'เบราว์เซอร์นี้อ่านออกเสียงเองไม่ได้' : NO_THAI }); return; }
    setSample({ state: 'idle', note: '' });
  };

  const pitchIndex = Math.max(0, PITCHES.indexOf(prefs.pitch));
  const thai = voices?.th || [];
  const english = voices?.en || [];

  return (
    <div className="vmx-modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="vmx-modal vmx-voice-sheet"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        data-vmx-modal="true"
        role="dialog"
        aria-modal="true"
        aria-label="ตั้งค่าเสียงอ่าน"
      >
        <h2 className="vmx-voice-title">ตั้งค่าเสียงอ่าน</h2>
        <p className="vmx-voice-lead">ใช้กับเสียงอ่านคำถามและเหตุผล เก็บไว้ในเครื่องนี้</p>

        <div className="vmx-voice-group" role="radiogroup" aria-label="แบบเสียงอ่าน">
          {PRESETS.map((p, i) => (
            <button
              key={p.id}
              ref={i === 0 ? firstRef : undefined}
              type="button"
              role="radio"
              aria-checked={preset === p.id}
              className={`vmx-voice-preset${preset === p.id ? ' is-on' : ''}`}
              onClick={() => setVoicePrefs({ rate: p.rate, pitch: p.pitch })}
            >
              <span className="vmx-voice-preset-name">{p.label}</span>
              <span className="vmx-voice-preset-note">{p.note}</span>
            </button>
          ))}
        </div>

        <div className="vmx-voice-row">
          <span className="vmx-voice-label" id="vmx-voice-rate">ความเร็ว</span>
          <div className="vmx-voice-chips" role="radiogroup" aria-labelledby="vmx-voice-rate">
            {RATES.map((r) => (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={prefs.rate === r}
                aria-label={`${r} เท่า`}
                className={`vmx-voice-chip${prefs.rate === r ? ' is-on' : ''}`}
                onClick={() => setVoicePrefs({ rate: r })}
              >
                {rateText(r)}
              </button>
            ))}
          </div>
        </div>

        <div className="vmx-voice-row">
          <label className="vmx-voice-label" htmlFor="vmx-voice-pitch">
            โทนเสียง <span className="vmx-voice-value">{PITCH_LABELS[pitchIndex]}</span>
          </label>
          <input
            id="vmx-voice-pitch"
            className="vmx-voice-range"
            type="range"
            min="0"
            max={PITCHES.length - 1}
            step="1"
            value={pitchIndex}
            aria-valuetext={PITCH_LABELS[pitchIndex]}
            onChange={(e) => setVoicePrefs({ pitch: PITCHES[Number(e.target.value)] })}
          />
          <div className="vmx-voice-ends" aria-hidden="true"><span>ทุ้ม</span><span>สูง</span></div>
          <p className="vmx-voice-hint">ใช้กับเสียงอ่านของเครื่อง เสียงที่อัดไว้แล้วปรับได้เฉพาะความเร็ว</p>
        </div>

        <div className="vmx-voice-row">
          <span className="vmx-voice-label">เสียงของเครื่อง</span>
          {voices && !thai.length && <p className="vmx-voice-hint vmx-voice-hint-top">{NO_THAI}</p>}
          <div className="vmx-voice-pick">
            {!(voices && !thai.length) && (
              <label className="vmx-voice-field">
                <span>ภาษาไทย</span>
                <select
                  className="vmx-voice-select"
                  aria-label="เสียงของเครื่อง ภาษาไทย"
                  value={thai.some((v) => v.id === prefs.voiceTh) ? prefs.voiceTh : ''}
                  disabled={!voices}
                  onChange={(e) => setVoicePrefs({ voiceTh: e.target.value })}
                >
                  <option value="">{voices ? 'เลือกให้อัตโนมัติ' : 'กำลังหาเสียง'}</option>
                  {thai.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </label>
            )}
            {english.length > 0 && (
              <label className="vmx-voice-field">
                <span>ข้อภาษาอังกฤษ</span>
                <select
                  className="vmx-voice-select"
                  aria-label="เสียงของเครื่อง ภาษาอังกฤษ"
                  value={english.some((v) => v.id === prefs.voiceEn) ? prefs.voiceEn : ''}
                  onChange={(e) => setVoicePrefs({ voiceEn: e.target.value })}
                >
                  <option value="">เลือกให้อัตโนมัติ</option>
                  {english.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </label>
            )}
          </div>
        </div>

        <div className="vmx-voice-actions">
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm vmx-voice-try" onClick={playSample} aria-pressed={sample.state === 'playing'}>
            {sample.state === 'playing' ? 'หยุดฟัง' : 'ลองฟัง'}
          </button>
          <span className="vmx-voice-gap" />
          <button
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            type="button"
            onClick={() => setVoicePrefs({ ...DEFAULT_VOICE_PREFS })}
          >
            คืนค่าเริ่มต้น
          </button>
          <button className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={onClose} type="button">เสร็จ</button>
        </div>
        <p className="vmx-voice-hint" role="status" aria-live="polite">{sample.note}</p>
      </div>
    </div>
  );
}
