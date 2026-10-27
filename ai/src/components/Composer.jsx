import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { IconImage, IconMic, IconSend, IconStop, IconClose } from './icons.jsx';
import { CAN_LISTEN, IN_APP, TOUCH } from '../lib/env.js';
import { listen } from '../lib/speech.js';
import { CAN_RECORD, startRecording } from '../lib/record.js';
import { transcribe, transcribeAvailable } from '../lib/api.js';
import { prepareImage } from '../lib/image.js';
import { graphemes } from '../lib/graphemes.js';
import { toast } from './ShareMenu.jsx';

const MAX = 4000;
const MIC_ERRORS = {
  'not-allowed': 'ยังไม่ได้อนุญาตให้ใช้ไมค์ เปิดสิทธิ์ไมค์ในการตั้งค่าเบราว์เซอร์ก่อน',
  inapp: 'แอปนี้ไม่ให้หน้าเว็บใช้ไมค์ เปิดลิงก์ในเบราว์เซอร์แล้วลองอีกครั้ง',
  'audio-capture': 'ไม่พบไมค์ในเครื่องนี้',
  network: 'การฟังเสียงต้องใช้อินเทอร์เน็ต ลองใหม่อีกครั้ง',
  'no-speech': 'ไม่ได้ยินเสียง ลองกดแล้วพูดใหม่',
  other: 'ฟังเสียงไม่ได้ในเบราว์เซอร์นี้ ลองพิมพ์แทน',
};
// The browser's own recognition gave up, but recording still can: these go to the recorder.
const RECORD_INSTEAD = new Set(['network', 'service-not-allowed', 'language-not-supported', 'bad-grammar', 'error']);
const later = (ms, timer) => new Promise((r) => { timer.id = setTimeout(r, ms); });

// The box you type in. It is uncontrolled while you type (a keystroke never
// waits on React), reports caret position to the ocean so the water ripples
// under your words, takes a photo (button, paste or drop) and, where the
// browser can, your voice. On the landing page it types example questions
// (`ghost`) where the placeholder sits; → takes the one shown.
const Composer = forwardRef(function Composer({ busy, disabled, onSend, onStop, onFocusChange, onRipple, onListen, onTyping, placeholder, ghost, autoFocus }, ref) {
  const ta = useRef(null);
  const box = useRef(null);
  const file = useRef(null);
  const [hasText, setHasText] = useState(false);
  const [image, setImage] = useState(null);
  const [imgError, setImgError] = useState('');
  const [listening, setListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [drag, setDrag] = useState(false);
  const rec = useRef(null);
  const recorder = useRef(null);
  // Whether the server can transcribe a recording (probed once). Without the
  // browser's own recognition, the microphone shows only when this is true:
  // no button that would fail.
  const [recorderOk, setRecorderOk] = useState(false);
  const probed = useRef(null);
  const canRecord = () => {
    if (!CAN_RECORD) return Promise.resolve(false);
    if (!probed.current) probed.current = transcribeAvailable().then((ok) => { setRecorderOk(ok); return ok; });
    return probed.current;
  };
  useEffect(() => { if (!CAN_LISTEN) canRecord(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const measure = useRef(null);
  const ghostEl = useRef(null);
  const ghostText = useRef('');

  const fill = (text) => {
    if (!ta.current) return;
    ta.current.value = text;
    grow();
    setHasText(!!text.trim());
    ta.current.focus();
  };

  useImperativeHandle(ref, () => ({
    focus: () => ta.current?.focus(),
    fill,
    rect: () => box.current?.getBoundingClientRect(),
    el: () => box.current,
  }));

  // the example question: the old one fades, the new one is typed piece by
  // piece at a person's pace (marks never float alone: graphemes)
  useEffect(() => {
    const el = ghostEl.current;
    if (!el) return undefined;
    const timer = { id: 0 };
    let alive = true;
    ghostText.current = ghost || '';
    (async () => {
      if (el.textContent) { el.classList.add('is-out'); await later(220, timer); }
      if (!alive) return;
      el.textContent = '';
      el.classList.remove('is-out');
      box.current?.classList.toggle('has-ghost', !!ghost);
      if (!ghost) return;
      await later(280, timer);
      for (const g of graphemes(ghost)) {
        if (!alive) return;
        el.textContent += g;
        await later(g === ' ' ? 90 : 34 + Math.random() * 32, timer);
      }
    })();
    return () => { alive = false; clearTimeout(timer.id); };
  }, [ghost]);

  // anything in the box (text, a photo, the microphone) holds the show still
  useEffect(() => { onTyping?.(hasText || !!image || listening); }, [hasText, image, listening, onTyping]);

  const grow = () => {
    const el = ta.current;
    if (!el) return;
    el.style.height = 'auto';
    const h = el.scrollHeight + 1; // +1: sub-pixel line boxes otherwise round into a phantom scrollbar
    el.style.height = `${Math.min(h, 220)}px`;
    el.style.overflowY = h > 220 ? 'auto' : 'hidden';
  };

  useEffect(() => {
    if (autoFocus && !TOUCH) ta.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  // where the caret is, roughly: last line's measured width from the box's left
  const caretPoint = () => {
    const el = ta.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (!measure.current) measure.current = document.createElement('canvas').getContext('2d');
    const ctx = measure.current;
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const before = el.value.slice(0, el.selectionEnd ?? el.value.length);
    const lines = before.split('\n');
    const w = ctx.measureText(lines[lines.length - 1]).width;
    const pl = parseFloat(cs.paddingLeft) || 0;
    const lh = parseFloat(cs.lineHeight) || 24;
    const x = Math.min(r.right - 12, r.left + pl + (w % Math.max(1, r.width - pl * 2)));
    const y = Math.min(r.bottom - 8, r.top + (parseFloat(cs.paddingTop) || 0) + lh * (Math.min(lines.length, 8) - 0.5) - el.scrollTop);
    return { x, y };
  };

  const submit = () => {
    const text = (ta.current?.value || '').trim().slice(0, MAX);
    if ((!text && !image) || busy || disabled) return;
    onSend(text || 'ช่วยอธิบายรูปนี้', image);
    ta.current.value = '';
    grow();
    setHasText(false);
    setImage(null);
    setImgError('');
  };

  const onKey = (e) => {
    // → on an empty box takes the example question it is showing (like a shell's suggestion)
    if (e.key === 'ArrowRight' && !ta.current.value && ghostText.current && box.current?.classList.contains('has-ghost')) {
      e.preventDefault();
      fill(ghostText.current);
      return;
    }
    // Thai input methods use Enter to commit a word: never send mid-composition
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.keyCode !== 229) {
      if (TOUCH) return; // on a phone, Enter is a new line; the send button sends
      e.preventDefault();
      submit();
    }
  };

  const onInput = () => {
    grow();
    setHasText(!!ta.current.value.trim());
    const p = caretPoint();
    if (p) onRipple?.(p.x, p.y);
  };

  const takeFile = async (f) => {
    setImgError('');
    try {
      setImage(await prepareImage(f));
    } catch (err) {
      setImgError(err.message || 'แนบรูปไม่ได้');
    }
  };

  const onPaste = (e) => {
    const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith('image/'));
    if (item) { e.preventDefault(); takeFile(item.getAsFile()); }
  };

  // text from the microphone joins what is already in the box
  const addSpoken = (text) => {
    const el = ta.current;
    if (!el) return;
    el.value = el.value.trim() ? `${el.value.trim()} ${text}` : text;
    grow();
    setHasText(!!el.value.trim());
    el.focus();
  };

  // The recorder: where the browser has no recognition (Firefox, LINE and other
  // in-app browsers) or it failed. Tap to start, tap again when done; the clip
  // goes to Thai ASR (/api/ai-transcribe) and its text lands in the box.
  const startRecorder = async () => {
    try {
      recorder.current = await startRecording({ onAutoStop: () => finishRecorder() });
      setListening(true);
      onListen?.(true);
    } catch (e) {
      recorder.current = null;
      const denied = e?.name === 'NotAllowedError' || e?.name === 'SecurityError';
      toast(denied ? (IN_APP ? MIC_ERRORS.inapp : MIC_ERRORS['not-allowed']) : e?.name === 'NotFoundError' ? MIC_ERRORS['audio-capture'] : MIC_ERRORS.other);
    }
  };
  const finishRecorder = async () => {
    const session = recorder.current;
    if (!session) return;
    recorder.current = null;
    setListening(false);
    onListen?.(false);
    setTranscribing(true);
    try {
      const text = await transcribe(await session.stop());
      if (text) addSpoken(text);
      else toast(MIC_ERRORS['no-speech']);
    } catch (e) {
      toast(e?.message || MIC_ERRORS.other);
    } finally {
      setTranscribing(false);
    }
  };

  const toggleMic = () => {
    if (transcribing) return;
    if (recorder.current) { finishRecorder(); return; }
    if (listening) { rec.current?.stop(); return; }
    if (!CAN_LISTEN) { if (recorderOk) startRecorder(); else toast(MIC_ERRORS.other); return; }
    const base = ta.current.value ? `${ta.current.value.trim()} ` : '';
    // the recorder, when the browser's own recognition cannot (only if the server can transcribe)
    const recordInstead = async (err) => {
      if (await canRecord()) startRecorder();
      else toast(MIC_ERRORS[err] || MIC_ERRORS.other);
    };
    rec.current = listen({
      onText: (t) => { ta.current.value = base + t; grow(); setHasText(!!ta.current.value.trim()); },
      onEnd: (err) => {
        setListening(false); onListen?.(false); rec.current = null; ta.current?.focus();
        if (!err || err === 'aborted') return;
        if (RECORD_INSTEAD.has(err)) { recordInstead(err); return; }
        // a microphone that fails says why, instead of going quiet
        toast(MIC_ERRORS[err] || MIC_ERRORS.other);
      },
    });
    if (rec.current) { setListening(true); onListen?.(true); }
    else recordInstead('other');
  };

  useEffect(() => () => { rec.current?.stop(); recorder.current?.cancel(); }, []);

  const canSend = (hasText || image) && !disabled;

  return (
    <div
      ref={box}
      className={`composer${drag ? ' is-drag' : ''}${busy ? ' is-busy' : ''}${hasText ? ' has-text' : ''}${image ? ' has-image' : ''}${listening ? ' is-listening' : ''}`}
      onDragOver={(e) => { if ([...e.dataTransfer.types].includes('Files')) { e.preventDefault(); setDrag(true); } }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) takeFile(f); }}
    >
      {(image || imgError) && (
        <div className="composer-attach">
          {image && (
            <div className="attach-thumb">
              <img src={image.preview} alt="รูปที่แนบ" />
              <button type="button" className="attach-x" onClick={() => setImage(null)} aria-label="เอารูปออก"><IconClose size={14} /></button>
            </div>
          )}
          {imgError && <p className="attach-error" role="alert">{imgError}</p>}
        </div>
      )}
      <label className="sr-only" htmlFor="composer-input">ข้อความ</label>
      <div ref={ghostEl} className="composer-ghost" aria-hidden="true" />
      <textarea
        id="composer-input"
        ref={ta}
        rows={1}
        maxLength={MAX}
        placeholder={transcribing ? 'กำลังถอดเสียง…' : listening ? (recorder.current ? 'กำลังฟัง แตะไมค์อีกครั้งเมื่อพูดจบ' : 'กำลังฟัง…') : placeholder}
        onKeyDown={onKey}
        onInput={onInput}
        onPaste={onPaste}
        onFocus={() => onFocusChange?.(true)}
        onBlur={() => onFocusChange?.(false)}
        enterKeyHint="send"
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
      />
      <div className="composer-row">
        <div className="composer-tools">
          <input ref={file} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) takeFile(f); e.target.value = ''; }} />
          <button type="button" className="tool" onClick={() => file.current?.click()} aria-label="แนบรูป" title="แนบรูป" disabled={disabled}>
            <IconImage />
          </button>
          {(CAN_LISTEN || recorderOk) && (
            <button
              type="button"
              className={`tool${listening ? ' is-on' : ''}${transcribing ? ' is-busy' : ''}`}
              onClick={toggleMic}
              aria-label={transcribing ? 'กำลังถอดเสียง' : listening ? 'หยุดฟัง' : 'พูด'}
              aria-pressed={listening}
              title="พูด"
              disabled={disabled || transcribing}
            >
              <IconMic />
            </button>
          )}
        </div>
        {busy ? (
          <button type="button" className="send is-stop" onClick={onStop} aria-label="หยุด">
            <IconStop size={18} />
          </button>
        ) : (
          <button type="button" className="send" onClick={submit} disabled={!canSend} aria-label="ส่ง">
            <IconSend size={18} />
          </button>
        )}
      </div>
    </div>
  );
});

export default Composer;
