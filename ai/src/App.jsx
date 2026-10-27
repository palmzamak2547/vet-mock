import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createOcean } from './ocean/index.js';
import Composer from './components/Composer.jsx';
import Message from './components/Message.jsx';
import HeroWord from './components/HeroWord.jsx';
import { Header, History, Specimen, Footer } from './components/Chrome.jsx';
import { IconDown } from './components/icons.jsx';
import { Toasts } from './components/ShareMenu.jsx';
import { chat as callChat, health, warm } from './lib/api.js';
import { listChats, saveChat, deleteChat, clearChats, newId, titleFor, getPref, setPref } from './lib/store.js';
import { hasThaiVoice } from './lib/speech.js';
import { reducedMotion } from './lib/env.js';
import './styles/app.css';

const SUGGEST = ['ระยะฟักตัวของ rabies ในสุนัข', 'ขอข้อสอบ COM5 5 ข้อ', 'หางานวิจัย PRRSV ล่าสุด', 'VetMock มีอะไรใหม่'];
// The landing page's one moving line: the hero's last word and the box's example
// question change together, one beat at a time (the word leads, the question
// answers it). Two rounds, then it rests on ถามให้ลึก: it stops on its own
// (WCAG 2.2.2), and pauses while you type. Examples differ from SUGGEST.
const SHOW = [
  { word: 'ลึก', ask: 'ทำไมแมวไวต่อยาพาราเซตามอล' },
  { word: 'คม', ask: 'แยก parvo กับ distemper ยังไง' },
  { word: 'ชัด', ask: 'อธิบาย VHS แบบเข้าใจง่าย' },
  { word: 'รู้ที่มา', ask: 'ขนาดยา meloxicam ในสุนัข' },
];
const BEAT_MS = 4400;
const THEME_COLOR = { dark: '#010c19', light: '#faf7f1' };
const blank = () => ({ id: newId(), title: '', messages: [] });

export default function App() {
  const canvasRef = useRef(null);
  const oceanRef = useRef(null);
  const composerRef = useRef(null);
  const dockRef = useRef(null);
  const heroRef = useRef(null);
  const threadRef = useRef(null);
  const specimenRef = useRef(null);
  const abortRef = useRef(null);
  const flipRef = useRef(null);
  const pinned = useRef(false); // follow the newest line? only after the jump button

  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  const [chat, setChat] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [chats, setChats] = useState(listChats);
  const [stats, setStats] = useState(null);
  const [still, setStill] = useState(false);
  const [specimen, setSpecimen] = useState(null);
  const [canSpeak, setCanSpeak] = useState(false);
  const [online, setOnline] = useState(() => navigator.onLine !== false);
  const [away, setAway] = useState(false);
  const [beat, setBeat] = useState(-1); // -1: at rest
  const typing = useRef(false);
  const nextBeat = useRef(() => {});

  const mode = chat.messages.length ? 'chat' : 'landing';
  // ?bare: the sea alone (film plates, OG frames, visual review)
  const bare = useRef(new URLSearchParams(location.search).has('bare')).current;
  const modeRef = useRef(mode);
  modeRef.current = mode;

  // ── the ocean ───────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    let cleanup = () => {};
    const q = new URLSearchParams(location.search);
    // ?capture: a manual clock for frame-exact recording (film, OG); the page draws only when stepped
    const capture = q.has('capture');
    createOcean(canvasRef.current, {
      theme,
      reducedMotion: reducedMotion(),
      allowSoftware: q.has('soft') || capture,
      manual: capture,
      seed: q.get('seed') ? Number(q.get('seed')) : undefined,
      cell: q.get('cell') ? Number(q.get('cell')) : undefined,
      exposure: q.get('exposure') ? Number(q.get('exposure')) : undefined,
      bare: q.has('bare'),
    })
      .then((o) => {
        if (!alive) { o.destroy(); return; }
        oceanRef.current = o;
        if (import.meta.env.DEV || capture) window.__ocean = o;
        const onMove = (e) => { if (e.pointerType !== 'touch') o.pointer(e.clientX, e.clientY, true); };
        const onLeave = () => o.pointer(-1e4, -1e4, false);
        window.addEventListener('pointermove', onMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onLeave);
        cleanup = () => {
          window.removeEventListener('pointermove', onMove);
          document.documentElement.removeEventListener('pointerleave', onLeave);
        };
        syncRects();
        // the link cover: a whale shark crossing behind the words, the school milling
        // around them the way it does while an answer is being looked up
        if (q.has('og')) {
          o.compose({
            animals: [
              { key: 'hammerhead', x: 0.56, y: 0.93, heading: 0.05, len: 0.42, z: 0.45 },
              { key: 'jelly', x: 0.64, y: 0.12, heading: 1.2, len: 0.12, z: 0.1 },
              { key: 'jelly', x: 0.93, y: 0.47, heading: 2.4, len: 0.09, z: 0.2 },
              { key: 'whaleShark', x: 0.2, y: 0.8, heading: 2.8, len: 1.3, z: 0.1 },
              { key: 'manta', x: 0.15, y: 0.24, heading: 0.35, len: 0.28, z: 0.08 },
              { key: 'turtle', x: 0.86, y: 0.8, heading: -2.6, len: 0.3, z: 0.05 },
            ],
            school: { x: 0.5, y: 0.5, r: 0.42, n: 120 },
          });
        }
      })
      .catch(() => alive && setStill(true));
    return () => { alive = false; cleanup(); oceanRef.current?.destroy(); oceanRef.current = null; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // rectangles the ocean needs: the box you type in, the column you read
  const syncRects = useCallback(() => {
    const o = oceanRef.current;
    if (!o) return;
    const c = composerRef.current?.rect();
    o.setFocus(c ? { x: c.left, y: c.top, w: c.width, h: c.height } : null);
    if (modeRef.current === 'chat') {
      const t = threadRef.current?.getBoundingClientRect();
      if (t) o.setContent({ x: t.left - 24, y: 0, w: t.width + 48, h: window.innerHeight }, 0.86);
    } else {
      const h = heroRef.current?.getBoundingClientRect();
      const d = dockRef.current?.getBoundingClientRect() || h;
      if (h && d) {
        const x = Math.min(h.left, d.left) - 32;
        const y = h.top - 24;
        const og = heroRef.current?.classList.contains('og');
        o.setContent({ x, y, w: Math.max(h.right, d.right) + 32 - x, h: d.bottom + 24 - y }, og ? 0.42 : 0.62);
      }
    }
  }, []);

  useEffect(() => {
    let raf = 0;
    const root = document.documentElement;
    const vv = window.visualViewport;
    // iOS keeps the layout viewport under the keyboard: lift the dock by the hidden
    // part. Only while the box has focus, and only a keyboard's height: toolbars
    // sliding in and out while you scroll must not move the dock.
    const keyboard = () => {
      const typing = document.activeElement?.id === 'composer-input';
      const kb = vv && typing ? window.innerHeight - vv.height - vv.offsetTop : 0;
      root.style.setProperty('--kb', `${kb > 120 ? Math.round(kb) : 0}px`);
    };
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        oceanRef.current?.resize(); // a no-op unless the canvas really changed size
        syncRects();
        keyboard();
        // the thread keeps clear of the dock however tall the box grows
        if (dockRef.current) root.style.setProperty('--dock-h', `${Math.round(dockRef.current.offsetHeight)}px`);
      });
    };
    window.addEventListener('resize', on);
    vv?.addEventListener('resize', on);
    vv?.addEventListener('scroll', keyboard, { passive: true });
    const onScroll = () => {
      // the header turns to glass once the page moves under it
      root.toggleAttribute('data-scrolled', window.scrollY > 4);
      if (modeRef.current === 'landing') { if (!raf) raf = requestAnimationFrame(() => { raf = 0; syncRects(); }); return; }
      checkAway();
    };
    // The reader steers. Following the newest line is only ever switched on by
    // the jump button, and any move of the reader's own (wheel up, a finger on
    // the page, keys that go up) switches it off at once, before the next frame
    // could pull the page back down.
    const letGo = () => { pinned.current = false; };
    const onWheel = (e) => { if (e.deltaY < 0) letGo(); };
    const onKey = (e) => { if (['ArrowUp', 'PageUp', 'Home'].includes(e.key) && e.target === document.body) letGo(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchmove', letGo, { passive: true });
    window.addEventListener('keydown', onKey);
    const ro = new ResizeObserver(on);
    if (dockRef.current) ro.observe(dockRef.current);
    return () => {
      window.removeEventListener('resize', on);
      vv?.removeEventListener('resize', on);
      vv?.removeEventListener('scroll', keyboard);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', letGo);
      window.removeEventListener('keydown', onKey);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [syncRects]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    syncRects();
    // landing -> chat: the composer glides from the hero to the bottom (FLIP)
    const f = flipRef.current;
    const el = dockRef.current;
    if (f && el && mode === 'chat') {
      flipRef.current = null;
      const now = el.getBoundingClientRect();
      const dy = f.top - now.top;
      if (Math.abs(dy) > 2 && !reducedMotion() && el.animate) {
        // Web Animations, not an inline transition: nothing is left behind on the
        // element if the tab is hidden mid-flight, and it can be interrupted
        const frames = [{ transform: `translate3d(0, ${dy}px, 0)` }, { transform: 'translate3d(0, 0, 0)' }];
        const spring = getComputedStyle(document.documentElement).getPropertyValue('--ease-spring').trim();
        let a;
        // Safari before 17.2 throws on a linear() easing (it would take the whole page down here)
        try { a = el.animate(frames, { duration: 520, easing: spring || 'ease-out' }); } catch { a = el.animate(frames, { duration: 520, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }); }
        a.onfinish = syncRects;
      }
    }
  }, [mode, chat.messages.length, syncRects]);

  // ── theme ───────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    oceanRef.current?.setTheme(theme);
    // the browser's bar follows the page's theme, not the system's (both media variants)
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => { m.content = THEME_COLOR[theme]; });
  }, [theme]);
  const toggleTheme = () => setTheme((t) => { const n = t === 'dark' ? 'light' : 'dark'; setPref('vmai-theme', n); return n; });

  useEffect(() => {
    hasThaiVoice().then(setCanSpeak);
    const ctl = new AbortController();
    health(ctl.signal).then((h) => setStats(h?.stats || null)).catch(() => {});
    const on = () => setOnline(navigator.onLine !== false);
    window.addEventListener('online', on);
    window.addEventListener('offline', on);
    return () => { ctl.abort(); window.removeEventListener('online', on); window.removeEventListener('offline', on); };
  }, []);

  useEffect(() => {
    document.title = chat.title ? `${chat.title} – VetMock AI` : 'VetMock AI';
  }, [chat.title]);

  // ── the landing show (see SHOW) ─────────────────────────
  useEffect(() => {
    if (mode !== 'landing' || bare || reducedMotion()) return undefined;
    let n = 0;
    let budget = SHOW.length * 2;
    let t = 0;
    const step = () => {
      clearTimeout(t);
      if (typing.current || document.hidden) { t = setTimeout(step, 1200); return; }
      if (n >= budget) { setBeat(-1); return; }
      setBeat(n % SHOW.length);
      n++;
      t = setTimeout(step, BEAT_MS);
    };
    // a tap on the word: the next beat now (and one more, even after the show ended)
    nextBeat.current = () => { if (!typing.current) { budget = Math.max(budget, n + 1); step(); } };
    t = setTimeout(step, 1800);
    return () => { clearTimeout(t); nextBeat.current = () => {}; setBeat(-1); };
  }, [mode, bare]);
  const onHeroSwap = useCallback((x, y) => oceanRef.current?.ripple(x, y), []);

  // ── sending ─────────────────────────────────────────────
  const update = useCallback((id, fn) => {
    setChat((c) => ({ ...c, messages: c.messages.map((m) => (m.id === id ? fn(m) : m)) }));
  }, []);

  const scrollToEnd = (smooth = false) => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: smooth && !reducedMotion() ? 'smooth' : 'auto' });
  };

  // A new turn starts at the top of the screen: the question just under the
  // header, the answer flowing down beneath it (the last turn is tall enough
  // for this, .turn-last). Reading goes down the page, so the page never chases
  // the answer's end on its own.
  const anchorTurn = (id, smooth = true) => {
    const el = document.querySelector(`[data-mid="${id}"]`);
    if (!el) return;
    const head = document.querySelector('.hdr')?.offsetHeight || 60;
    const top = el.getBoundingClientRect().top + window.scrollY - head - 16;
    window.scrollTo({ top: Math.max(0, top), behavior: smooth && !reducedMotion() ? 'smooth' : 'auto' });
  };

  // is there more answer below the screen? (shows the jump button)
  const checkAway = () => {
    const root = document.documentElement;
    setAway(root.scrollHeight - (window.innerHeight + window.scrollY) > 160);
  };

  const pointFor = (id) => {
    const el = document.querySelector(`[data-mid="${id}"]`);
    const r = el?.getBoundingClientRect();
    if (r && r.height) return { x: r.left + Math.min(r.width, 640) * 0.5, y: Math.min(window.innerHeight * 0.6, r.top + 40) };
    const c = composerRef.current?.rect();
    return c ? { x: c.left + c.width / 2, y: c.top - 80 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  };

  const run = useCallback(async (history, asstId, image) => {
    setBusy(true);
    const ctl = new AbortController();
    abortRef.current = ctl;
    const o = oceanRef.current;
    requestAnimationFrame(() => o?.setMode('thinking', pointFor(asstId)));
    // Paced reveal: the network may hand over a whole paragraph at once; the
    // reader still sees it flow. Text appears at a reading pace (96 chars/s)
    // or faster when a backlog builds, draining any backlog within 0.45 s
    // (0.25 s once the stream has ended), so the page never lags the network
    // by more than half a second. A cut never lands inside a Thai cluster.
    let buf = '';
    let shown = 0;
    let raf = 0;
    let last = 0;
    let ended = false;
    let lastPulse = 0;
    const instant = reducedMotion();
    let settle = null;
    const settled = new Promise((r) => { settle = r; });
    const tick = (now) => {
      raf = 0;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
      last = now;
      const backlog = buf.length - shown;
      if (backlog > 0) {
        const rate = instant ? Infinity : Math.max(96, backlog / (ended ? 0.25 : 0.45));
        shown = Math.min(buf.length, shown + Math.max(1, Math.ceil(rate * dt)));
        while (shown < buf.length && /[ัิ-ฺ็-๎]/.test(buf[shown])) shown++;
        update(asstId, (m) => ({ ...m, content: buf.slice(0, shown) }));
        // only a reader who asked to follow (the jump button) is followed
        if (pinned.current) scrollToEnd();
        else checkAway();
      }
      if (shown < buf.length || !ended) raf = requestAnimationFrame(tick);
      else settle();
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    try {
      await callChat({
        messages: history,
        image,
        signal: ctl.signal,
        on: (ev, d) => {
          if (ev === 'status') update(asstId, (m) => ({ ...m, status: d }));
          else if (ev === 'sources') update(asstId, (m) => ({ ...m, sources: d }));
          else if (ev === 'delta') {
            if (!buf) o?.setMode('answering');
            buf += d?.text || '';
            const now = performance.now();
            if (now - lastPulse > 1300) {
              lastPulse = now;
              const el = document.querySelector(`[data-mid="${asstId}"]`)?.getBoundingClientRect();
              if (el) o?.pulse(el.left + 12, Math.min(window.innerHeight - 40, el.bottom));
            }
            kick();
          } else if (ev === 'cards') update(asstId, (m) => ({ ...m, cards: [...(m.cards || []), ...(d?.items || [])] }));
          else if (ev === 'check') update(asstId, (m) => ({ ...m, check: d }));
          else if (ev === 'error') update(asstId, (m) => ({ ...m, error: d?.message || 'ระบบตอบไม่ได้ในตอนนี้', status: null }));
        },
      });
      // the answer is complete: let the reveal finish before the actions appear
      ended = true;
      kick();
      // a hidden tab pauses animation frames: never hold the turn open on it
      await Promise.race([settled, new Promise((r) => setTimeout(r, 4000))]);
    } catch (e) {
      if (e?.name === 'AbortError') update(asstId, (m) => ({ ...m, stopped: true, status: null }));
      else {
        // a rate limit says when to come back: the retry button waits that long
        const retryAt = e?.retryAfter > 0 ? Date.now() + Math.min(e.retryAfter, 600) * 1000 : 0;
        update(asstId, (m) => ({ ...m, error: e?.message || 'ระบบตอบไม่ได้ในตอนนี้', retryAt, status: null }));
      }
    } finally {
      cancelAnimationFrame(raf);
      update(asstId, (m) => ({ ...m, content: buf || m.content, done: true, status: null }));
      // the actions row arrives with the last line: keep it in view if you were following
      requestAnimationFrame(() => { if (pinned.current) scrollToEnd(true); else checkAway(); });
      setBusy(false);
      abortRef.current = null;
      o?.setMode(document.activeElement?.id === 'composer-input' ? 'focus' : 'idle');
    }
  }, [update]);

  // persist after each finished turn
  useEffect(() => {
    if (!busy && chat.messages.length) { saveChat(chat); setChats(listChats()); }
  }, [busy]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = useCallback((text, image) => {
    if (busy) return;
    const userMsg = { id: newId(), role: 'user', content: text, image: image ? { preview: image.preview } : null };
    const asst = { id: newId(), role: 'assistant', content: '', status: { phase: 'plan', label: 'กำลังอ่านคำถาม' }, cards: [] };
    if (modeRef.current === 'landing') {
      const r = dockRef.current?.getBoundingClientRect();
      if (r) flipRef.current = { top: r.top };
      window.scrollTo({ top: 0 });
    }
    const history = [...chat.messages, userMsg]
      .filter((m) => m.content && !m.error)
      .map((m) => ({ role: m.role, content: m.content }))
      .slice(-12);
    setChat((c) => ({ ...c, title: c.title || titleFor(text), messages: [...c.messages, userMsg, asst] }));
    pinned.current = false;
    // two frames: the turn is rendered (and the landing-to-chat glide begun) first
    requestAnimationFrame(() => requestAnimationFrame(() => anchorTurn(userMsg.id)));
    run(history, asst.id, image ? { mediaType: image.mediaType, data: image.data } : null);
  }, [busy, chat.messages, run]);

  const stop = () => abortRef.current?.abort();

  const retry = () => {
    if (busy) return;
    const msgs = chat.messages;
    const lastUser = [...msgs].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    const keep = msgs.slice(0, msgs.lastIndexOf(lastUser) + 1);
    const asst = { id: newId(), role: 'assistant', content: '', status: { phase: 'plan', label: 'กำลังอ่านคำถาม' }, cards: [] };
    setChat((c) => ({ ...c, messages: [...keep, asst] }));
    pinned.current = false;
    requestAnimationFrame(() => requestAnimationFrame(() => anchorTurn(lastUser.id)));
    const history = keep.filter((m) => m.content && !m.error).map((m) => ({ role: m.role, content: m.content })).slice(-12);
    run(history, asst.id, null);
  };

  const newChat = () => {
    if (busy) stop();
    setChat(blank());
    setSpecimen(null);
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() => composerRef.current?.focus());
  };

  const openChat = (id) => {
    const c = listChats().find((x) => x.id === id);
    if (!c) return;
    if (busy) stop();
    setChat({ id: c.id, title: c.title, messages: c.messages.map((m) => ({ ...m, done: true, status: null })) });
    setHistoryOpen(false);
    // a past chat opens on its last question, ready to read down
    const lastUser = [...c.messages].reverse().find((m) => m.role === 'user');
    pinned.current = false;
    requestAnimationFrame(() => requestAnimationFrame(() => (lastUser ? anchorTurn(lastUser.id, false) : scrollToEnd())));
  };

  // tap on open water: name the animal under the finger
  const tapOcean = (e) => {
    if (e.target.closest('button, a, textarea, input, label, .composer, .msg, .card, .ftr, .hdr, .hw')) return;
    const info = oceanRef.current?.hit(e.clientX, e.clientY, specimenRef.current);
    if (info) setSpecimen(info);
  };

  const onFocusChange = (f) => {
    if (f) warm();
    if (busy) return;
    syncRects();
    oceanRef.current?.setMode(f ? 'focus' : 'idle');
  };

  if (bare) {
    const og = new URLSearchParams(location.search).has('og');
    return (
      <div className="app">
        <canvas ref={canvasRef} className="ocean" aria-hidden="true" />
        <Specimen elRef={specimenRef} info={specimen} />
        <main className="stage" style={{ position: 'fixed', inset: 0 }} onPointerDown={tapOcean}>
          {og && (
            <div className="og" ref={heroRef}>
              <div className="og-brand">
                <img src="/brand/vetmock-logo.svg" width="44" height="44" alt="" />
                <span className="brand-word">VetMock</span>
                <span className="brand-ai">AI</span>
              </div>
              <h1 className="og-title">ถามให้ลึก</h1>
              <p className="og-url">ai.vetmock.com</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className={`app mode-${mode}`}>
      <canvas ref={canvasRef} className="ocean" aria-hidden="true" />
      {still && <div className="ocean-still" data-theme-art={theme} aria-hidden="true" />}
      <Header theme={theme} onTheme={toggleTheme} onNew={newChat} onHistory={() => { setChats(listChats()); setHistoryOpen(true); }} hasChat={mode === 'chat'} />
      <main className="stage" onPointerDown={tapOcean}>
        {mode === 'landing' && (
          <section ref={heroRef} className="hero">
            <h1 className="hero-title">
              <span className="sr-only">ถามให้ลึก</span>
              <span aria-hidden="true">ถามให้<HeroWord word={beat >= 0 ? SHOW[beat].word : 'ลึก'} onSwap={onHeroSwap} onTap={() => nextBeat.current()} /></span>
            </h1>
            {/* a narrow phone breaks between the two phrases, never inside แหล่งอ้างอิง */}
            <p className="hero-sub"><span className="nb">ตอบจากคลังความรู้ VetMock</span> <span className="nb">พร้อมแหล่งอ้างอิง</span></p>
          </section>
        )}
        {mode === 'chat' && (
          <div ref={threadRef} className="thread" role="log" aria-live="off">
            {chat.messages.map((m, i) => (
              <div key={m.id} data-mid={m.id} className={i === chat.messages.length - 1 && m.role === 'assistant' ? 'turn-last' : undefined}>
                <Message m={m} last={i === chat.messages.length - 1} onRetry={retry} canSpeak={canSpeak} streaming={busy && i === chat.messages.length - 1} question={m.role === 'assistant' ? chat.messages[i - 1]?.content || '' : ''} />
              </div>
            ))}
          </div>
        )}
        <div ref={dockRef} className="dock">
          {mode === 'chat' && away && (
            <button type="button" className="jump" onClick={() => { pinned.current = true; scrollToEnd(true); }} aria-label="ไปที่คำตอบล่าสุด"><IconDown size={18} /></button>
          )}
          <Composer
            ref={composerRef}
            busy={busy}
            disabled={!online}
            onSend={send}
            onStop={stop}
            onFocusChange={onFocusChange}
            onRipple={(x, y) => oceanRef.current?.ripple(x, y)}
            onListen={(on) => { const c = composerRef.current?.rect(); oceanRef.current?.setMode(on ? 'listening' : 'idle', c ? { x: c.left + c.width / 2, y: c.top + c.height / 2 } : null); }}
            placeholder="ถามเรื่องสัตว์ ยา โรค หรืองานวิจัย"
            ghost={mode === 'landing' && beat >= 0 ? SHOW[beat].ask : null}
            onTyping={(busyBox) => { typing.current = busyBox; }}
            autoFocus={mode === 'landing'}
          />
          {!online && <p className="dock-note" role="status">ออฟไลน์อยู่ ต่ออินเทอร์เน็ตแล้วถามต่อได้</p>}
          {mode === 'landing' && (
            <>
              <ul className="suggest" aria-label="ตัวอย่างคำถาม">
                {SUGGEST.map((s) => (
                  <li key={s}><button type="button" onClick={() => send(s, null)} disabled={!online}>{s}</button></li>
                ))}
              </ul>
              <p className="dock-note">ทดลองใช้ ตรวจสอบก่อนนำไปใช้กับสัตว์จริง</p>
            </>
          )}
        </div>
      </main>
      {mode === 'landing' && <Footer stats={stats} />}
      <Specimen elRef={specimenRef} info={specimen} />
      <Toasts />
      <History
        open={historyOpen}
        chats={chats}
        currentId={chat.id}
        onClose={() => setHistoryOpen(false)}
        onOpen={openChat}
        onDelete={(id) => { deleteChat(id); setChats(listChats()); if (id === chat.id) setChat(blank()); }}
        onClear={() => { clearChats(); setChats([]); setChat(blank()); setHistoryOpen(false); }}
      />
    </div>
  );
}
