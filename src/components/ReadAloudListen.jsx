// ============================================================
// ReadAloudListen — the read-aloud for a screen that shows questions or
// their explanations outside the practice card
// ============================================================
// The same engine (lib/read-aloud.js, loaded on the first tap), the same bar
// and the same voice settings as the practice card (Question.jsx). A screen
// calls useReadAloud(prefix) once, puts a ListenButton beside each text it
// shows, and mounts the hook's bar once. A job reads exactly the text its
// button sits beside, and a button for an explanation is drawn only where the
// explanation is already on screen, so nothing is read before it can be seen.
// Leaving the screen stops its reading.
// ============================================================
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import NavIcon from './NavIcon.jsx';
import ReadAloudBar from './ReadAloudBar.jsx';
import { unlockAudio } from '../lib/audio-unlock.js';
import { readAloud, primePlayer } from '../lib/read-aloud-store.js';
import '../styles-listen.css';

const LOAD_NOTE = 'อ่านออกเสียงไม่ได้ตอนนี้ ต่ออินเทอร์เน็ตแล้วลองกดอีกครั้ง';

/**
 * prefix: what every job id of this screen starts with (one screen at a
 * time reads). Returns { readingId, speak(job), preload, note, bar }.
 * job: { id, what: 'q' | 'explain', title, album, subject, stem, options,
 *        explain, container(kind, option) => Element | null }
 */
export function useReadAloud(prefix, { raised = false } = {}) {
  const readingId = useSyncExternalStore(readAloud.subscribe, () => {
    const id = readAloud.get().job?.id;
    return id && id.startsWith(prefix) ? id : '';
  }, () => '');
  const engineRef = useRef(null);
  const [engine, setEngine] = useState(null);
  // Why a tap could not start (the engine's code did not load): { id, text }.
  const [note, setNote] = useState(null);
  const prefixNow = useRef(prefix);
  prefixNow.current = prefix;

  useEffect(() => () => {
    if (readAloud.get().job?.id.startsWith(prefix)) engineRef.current?.stop();
    setNote(null);
  }, [prefix]);

  const load = () => (engineRef.current
    ? Promise.resolve(engineRef.current)
    : import('../lib/read-aloud.js').then((m) => { engineRef.current = m; setEngine(m); return m; }));
  const preload = () => { load().catch(() => {}); };

  // A tap on the button that is reading stops it; on another it switches.
  const speak = async (job) => {
    // iOS lets sound start only inside the tap: prime before any await.
    primePlayer();
    unlockAudio();
    if (readAloud.get().job?.id === job.id) { engineRef.current?.stop(); return; }
    setNote(null);
    try {
      const m = await load();
      if (prefixNow.current !== prefix) return;
      m.start(job);
    } catch {
      setNote({ id: job.id, text: LOAD_NOTE });
    }
  };

  const bar = <ReadAloudBar jobPrefix={prefix} engine={engine} raised={raised} />;
  return { readingId, speak, preload, note, bar };
}

/** The 44 px listen button drawn as a 32 px circle, as on the practice card. */
export function ListenButton({ on, onClick, onPointerDown, what = 'q', className = '' }) {
  const label = on ? 'หยุดอ่านออกเสียง' : what === 'explain' ? 'อ่านเหตุผลออกเสียง' : what === 'item' ? 'อ่านหัวข้อนี้ออกเสียง' : 'อ่านคำถามออกเสียง';
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      className={`vmx-listen-btn${on ? ' is-on' : ''}${className ? ` ${className}` : ''}`}
      onClick={onClick}
      onPointerDown={onPointerDown}
      title={on ? 'หยุดอ่าน' : 'อ่านออกเสียง'}
    >
      <span className="vmx-listen-dot"><NavIcon name={on ? 'speaker-off' : 'speaker'} size={16} /></span>
    </button>
  );
}

/** The words a reader sees in an element: its text, without the parts that are controls. */
export function shownText(el, skip = 'button, [aria-hidden="true"], img, figure, .vmx-read-skip') {
  if (!el) return '';
  const copy = el.cloneNode(true);
  for (const n of copy.querySelectorAll(skip)) n.remove();
  // Block ends become line breaks, so sentences do not run together.
  for (const n of copy.querySelectorAll('li, p, h1, h2, h3, h4, div')) n.append('\n');
  return copy.textContent.replace(/[ \t ]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim();
}
