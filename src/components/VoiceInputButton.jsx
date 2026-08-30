// ============================================================
// VoiceInputButton — Web Speech Recognition wrapper
// ============================================================
// Tiny FAB-style button you drop next to a textarea. Tap once to
// start dictating; tap again to stop. Transcripts get appended to
// the controlled value via onAppend(text). Pure browser API — no
// servers, no API keys.
//
// Defaults to lang='th-TH' but accepts override (en-US for English
// summaries). Supports continuous + interim results so the user
// sees text appear live as they speak.
//
// Browser support:
//   • Chrome/Edge (desktop + Android)        ✅ full
//   • Safari iOS 14.5+                        ✅ full
//   • Firefox                                 ❌ no SpeechRecognition
//   • Anywhere not HTTPS                      ❌ blocked by browser
//
// We render NOTHING when unsupported — no error toast, no broken
// button. The text input still works normally.
// ============================================================

import { useEffect, useRef, useState } from 'react';

const RecognitionCtor =
  typeof window !== 'undefined'
    ? (window.SpeechRecognition || window.webkitSpeechRecognition)
    : null;

export default function VoiceInputButton({ onAppend, lang = 'th-TH', title = 'พูดเพื่อแปลงเป็นข้อความ', size = 32 }) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState(null);
  const recRef = useRef(null);

  // rec.onresult is installed ONCE per dictation and rec.continuous is true,
  // so one handler serves every utterance in the session — holding the
  // onAppend from the moment the mic was tapped. The callers rebuild the new
  // value from render-scoped text ("current answer + what you just said"), so
  // the second sentence was appended to the text as it stood BEFORE the
  // first, wiping it. Reading the callback from a ref means the handler
  // always calls the current render's version.
  const onAppendRef = useRef(onAppend);
  useEffect(() => { onAppendRef.current = onAppend; });

  // Cleanup on unmount — important on iOS where leaving a hot mic
  // open will silently drain the battery.
  useEffect(() => {
    return () => {
      try { recRef.current?.stop(); } catch {}
      recRef.current = null;
    };
  }, []);

  if (!RecognitionCtor) return null;

  function start() {
    setError(null);
    let rec;
    try {
      rec = new RecognitionCtor();
    } catch (e) {
      setError('ไม่สามารถเปิดไมค์ได้');
      return;
    }
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = true;
    rec.onresult = (event) => {
      // Each event includes ALL results (final + interim). We track only
      // the latest final segment we haven't appended yet.
      let appendedFinal = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) appendedFinal += res[0].transcript;
      }
      if (appendedFinal) {
        const trimmed = appendedFinal.trim();
        if (trimmed) onAppendRef.current?.(trimmed);
      }
    };
    rec.onerror = (e) => {
      // Common: 'not-allowed' (mic perm), 'no-speech', 'aborted'
      if (e.error && e.error !== 'aborted' && e.error !== 'no-speech') {
        setError(e.error === 'not-allowed' ? 'อนุญาตไมค์ในเบราว์เซอร์ก่อน' : `ผิดพลาด: ${e.error}`);
      }
    };
    rec.onend = () => {
      setActive(false);
      recRef.current = null;
    };
    recRef.current = rec;
    try {
      rec.start();
      setActive(true);
    } catch {
      setActive(false);
    }
  }

  function stop() {
    try { recRef.current?.stop(); } catch {}
    setActive(false);
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <button
        type="button"
        onClick={active ? stop : start}
        title={active ? 'หยุดพูด' : title}
        aria-label={active ? 'หยุดพูด' : title}
        aria-pressed={active}
        style={{
          width: size, height: size,
          borderRadius: '50%',
          border: '1px solid var(--clr-border)',
          background: active ? 'var(--clr-rose, #c0392b)' : 'var(--clr-surface)',
          color: active ? '#fff' : 'var(--clr-ink)',
          cursor: 'pointer',
          fontSize: size * 0.45,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          padding: 0,
          boxShadow: active ? '0 0 0 4px rgba(192, 57, 43, 0.15)' : '0 1px 3px rgba(0,0,0,0.06)',
          transition: 'background 0.15s, box-shadow 0.15s',
        }}
      >
        {active ? '⏹' : '🎤'}
      </button>
      {error && <span style={{ fontSize: 11, color: 'var(--clr-rose-text, #c0392b)' }}>{error}</span>}
    </span>
  );
}
