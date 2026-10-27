import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { IconImage, IconMic, IconSend, IconStop, IconClose } from './icons.jsx';
import { CAN_LISTEN, TOUCH } from '../lib/env.js';
import { listen } from '../lib/speech.js';
import { prepareImage } from '../lib/image.js';

const MAX = 4000;

// The box you type in. It is uncontrolled while you type (a keystroke never
// waits on React), reports caret position to the ocean so the water ripples
// under your words, takes a photo (button, paste or drop) and, where the
// browser can, your voice.
const Composer = forwardRef(function Composer({ busy, disabled, onSend, onStop, onFocusChange, onRipple, onListen, placeholder, autoFocus }, ref) {
  const ta = useRef(null);
  const box = useRef(null);
  const file = useRef(null);
  const [hasText, setHasText] = useState(false);
  const [image, setImage] = useState(null);
  const [imgError, setImgError] = useState('');
  const [listening, setListening] = useState(false);
  const [drag, setDrag] = useState(false);
  const rec = useRef(null);
  const measure = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => ta.current?.focus(),
    fill: (text) => {
      if (!ta.current) return;
      ta.current.value = text;
      grow();
      setHasText(!!text.trim());
      ta.current.focus();
    },
    rect: () => box.current?.getBoundingClientRect(),
    el: () => box.current,
  }));

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

  const toggleMic = () => {
    if (listening) { rec.current?.stop(); return; }
    const base = ta.current.value ? `${ta.current.value.trim()} ` : '';
    rec.current = listen({
      onText: (t) => { ta.current.value = base + t; grow(); setHasText(!!ta.current.value.trim()); },
      onEnd: () => { setListening(false); onListen?.(false); rec.current = null; ta.current?.focus(); },
    });
    if (rec.current) { setListening(true); onListen?.(true); }
  };

  useEffect(() => () => rec.current?.stop(), []);

  const canSend = (hasText || image) && !disabled;

  return (
    <div
      ref={box}
      className={`composer${drag ? ' is-drag' : ''}${busy ? ' is-busy' : ''}`}
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
      <textarea
        id="composer-input"
        ref={ta}
        rows={1}
        maxLength={MAX}
        placeholder={listening ? 'กำลังฟัง…' : placeholder}
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
          {CAN_LISTEN && (
            <button type="button" className={`tool${listening ? ' is-on' : ''}`} onClick={toggleMic} aria-label={listening ? 'หยุดฟัง' : 'พูด'} aria-pressed={listening} title="พูด" disabled={disabled}>
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
