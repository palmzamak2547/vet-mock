// ============================================================
// StudioView — "ปรับแต่ง", the one place a student makes VetMock theirs
// ============================================================
// Play, never configuration (Palm, 11 Nov 2026): one tap, seen at once,
// undone at once, never required, and the default is already right.
//   - the card stays in view at the top while anything changes
//   - first row: ready-made sets (src/lib/prefs/table.js PRESETS), the one
//     the app chose named with its reason (decisions/studio-preset.js)
//   - the character, the colour and the card are visual pickers
//   - everything else is folded under "ปรับเอง", drawn as samples
// Every control reads and writes through the preference table; a change
// applies at once, and one "ย้อนกลับ" puts the last change back. Nothing asks
// for confirmation. The studio is never reachable from a running set or
// exam (its entries live in the header and the profile hub, which an exam
// screen does not show).
// ============================================================
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import StudentCard from '../components/StudentCard.jsx';
import Avatar from '../components/Avatar.jsx';
import MotionSurface from '../components/MotionSurface.jsx';
import {
  PREFS, PRESETS, PREF_CHANGE_EVENT, prefRow, readPref, writePref, resolvedState, matchingPreset, snapshotFor, applyValues,
} from '../lib/prefs/table.js';
import { parseCardToken, encodeCard, CARD_BACKDROPS, MAX_ON_SHOW } from '../lib/prefs/card-token.js';
import { deriveTheme } from '../lib/prefs/accent.js';
import { choiceLabel, choiceMeta, PALETTE_DOTS } from '../lib/prefs/labels.js';
import { flushPrefsSync } from '../lib/prefs/account-sync.js';
import { cardAllowance, wearable, nextTrophy, FRAME_EARNED_BY, FRAME_LABEL } from '../lib/card-trophies.js';
import { CHARACTER_EMOJI, characterFor } from '../lib/avatar.js';
import { PICTURES, isPicture } from '../lib/public-identity.js';
import { saveIdentity } from '../lib/identity-write.js';
import { streakShown } from '../hooks/utils.js';
import { BUDDIES, canShow3D } from '../lib/buddy.js';
import { BADGE_ART, IG_BACKGROUNDS } from '../data/art.js';
import { decide } from '../lib/decide.js';
import { STUDIO_PRESET } from '../lib/decisions/studio-preset.js';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';
import { canVibrate } from '../lib/haptics.js';
import { studentNumbers } from '../lib/student-numbers.js';
import '../styles-studio.css';

const Mascot3D = lazy(() => import('../components/MascotSquad3DViewer.jsx'));

// ── The table as React state: one subscription for every row ───────────────
let cached = null;
const snapshot = () => (cached ??= resolvedState());
function subscribe(cb) {
  const on = () => { cached = null; cb(); };
  window.addEventListener(PREF_CHANGE_EVENT, on);
  window.addEventListener('vmx-motion-settings-change', on);
  window.addEventListener('vmx-buddy-changed', on);
  window.addEventListener('storage', on);
  return () => {
    window.removeEventListener(PREF_CHANGE_EVENT, on);
    window.removeEventListener('vmx-motion-settings-change', on);
    window.removeEventListener('vmx-buddy-changed', on);
    window.removeEventListener('storage', on);
  };
}
const usePrefs = () => useSyncExternalStore(subscribe, snapshot, snapshot);

// A whole-page change (colour, light or dark) cross-fades where the browser
// can; mobile WebKit is left out, as App's withTransition does (it can crash
// while snapshotting a large view).
function withViewTransition(fn, reduced) {
  const ua = typeof navigator === 'undefined' ? '' : navigator.userAgent || '';
  const webkit = /AppleWebKit/i.test(ua) && !/(Chrome|Chromium|Edg|OPR|SamsungBrowser)/i.test(ua);
  if (reduced || webkit || typeof document === 'undefined' || !document.startViewTransition) { fn(); return; }
  try {
    const t = document.startViewTransition(fn);
    t?.finished?.catch(() => {}); t?.ready?.catch(() => {}); t?.updateCallbackDone?.catch(() => {});
  } catch { fn(); }
}

const BACKDROP_LABEL = { paper: 'กระดาษ', graph: 'กระดาษกราฟ', ...Object.fromEntries(IG_BACKGROUNDS.map((b) => [b.id, b.label])) };
const BACKDROP_SRC = Object.fromEntries(IG_BACKGROUNDS.filter((b) => b.src).map((b) => [b.id, b.src]));
const PRESET_SAMPLE = { phone: 'auto', calm: 'still', lively: 'lively', night: 'night' };
const allowPicture = (e) => Boolean(characterFor(e)) || isPicture(e);

export default function StudioView({ goBack, user, profile, history = [], srCards = {}, streakData = null, selectedYear = null, theme = 'light' }) {
  const prefs = usePrefs();
  const { reduced, systemReduced } = useMotionPreferences();
  const [open, setOpen] = useState(false);
  const [undo, setUndo] = useState(null);
  const undoTimer = useRef(0);
  const [show3D, setShow3D] = useState(false);
  // When the card scrolls away, a small copy docks at the top so every change
  // stays in view. One observer flips one class; nothing runs per frame.
  const stageRef = useRef(null);
  const [docked, setDocked] = useState(false);
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    // Docked once less than a fifth of the card is on screen.
    const io = new IntersectionObserver(([entry]) => setDocked(entry.intersectionRatio < 0.2), { threshold: [0, 0.2, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // One step back: what the last tap overwrote, kept for a few seconds.
  const change = useCallback((values, { transition = false } = {}) => {
    const before = snapshotFor(Object.keys(values));
    const run = () => applyValues(values);
    if (transition) withViewTransition(run, reduced); else run();
    clearTimeout(undoTimer.current);
    setUndo(before);
    undoTimer.current = setTimeout(() => setUndo(null), 6000);
  }, [reduced]);
  const takeBack = () => {
    if (!undo) return;
    const keep = undo;
    setUndo(null);
    withViewTransition(() => applyValues(keep), reduced);
  };
  // Leaving the studio writes the account copy at once (no wait for the quiet).
  useEffect(() => () => { clearTimeout(undoTimer.current); flushPrefsSync(); }, []);

  // ── The card ──────────────────────────────────────────────────────────────
  // The hub's readers: the saved streak as of today, earnedBadges and
  // nextBadge with it (lib/card-trophies.js, lib/student-numbers.js).
  const currentStreak = streakShown(streakData);
  const allowance = useMemo(() => cardAllowance({ history, srCards, currentStreak }), [history, srCards, currentStreak]);
  const stored = parseCardToken(prefs.card, { allowPicture }) || parseCardToken(prefRow('card').def());
  const card = wearable(stored, allowance);
  // Signed in, the picture is the account's (profiles.avatar_emoji, written
  // through saveIdentity, the one write path); a guest keeps it in the card.
  const [savedPicture, setSavedPicture] = useState(null);
  const accountPicture = user ? (savedPicture || profile?.avatar_emoji || null) : null;
  const picture = accountPicture || card.picture || CHARACTER_EMOJI[prefs.buddy] || CHARACTER_EMOJI.mochi;
  const pickPicture = (emoji) => {
    setCard({ picture: emoji });
    if (!user) return;
    setSavedPicture(emoji);
    // A failed write keeps the picture on this device's card and says nothing.
    saveIdentity({ avatarEmoji: emoji, introDone: false }).catch(() => setSavedPicture(null));
  };
  const setCard = (patch) => change({ card: encodeCard({ ...stored, ...patch }) });
  const stats = studentNumbers({ history, streakData, srCards, badges: allowance.badges });
  // The year the app is set to (the header's pill), never a placeholder.
  const yearLine = Number.isInteger(Number(selectedYear)) && Number(selectedYear) > 0 ? `ปี ${Number(selectedYear)}` : '';
  const name = profile?.username || 'นิสิตสัตวแพทย์';
  const next = useMemo(() => nextTrophy({ history, srCards, currentStreak }), [history, srCards, currentStreak]);

  // ── The ready-made set the app would choose, and what is on screen ───────
  const decided = decide(STUDIO_PRESET, { systemReduced });
  const onScreen = matchingPreset(prefs);
  const presetLine = onScreen === decided.value
    ? { lead: 'จัดให้แล้ว:', text: `${PRESETS.find((p) => p.id === onScreen).label} ${decided.why}` }
    : onScreen
      ? { lead: 'ตั้งไว้แล้ว:', text: `${PRESETS.find((p) => p.id === onScreen).label} ตามที่คุณตั้งไว้` }
      : { lead: 'ตั้งไว้แล้ว:', text: 'ปรับเองตามที่คุณตั้งไว้' };

  const accentPreview = deriveTheme(prefs.accentHue, theme === 'dark' ? 'dark' : 'light')['--clr-sage'];
  const can3D = typeof window !== 'undefined' && canShow3D() && !navigator.connection?.saveData && !(navigator.deviceMemory && navigator.deviceMemory < 4);
  const pictureId = characterFor(picture);

  return (
    <div className="vmx-studio">
      <header className="vmx-studio__head">
        <button type="button" className="vmx-studio__back" onClick={goBack} aria-label="กลับ"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
        <h1>ปรับแต่ง</h1>
      </header>

      <div className={`vmx-studio__dock is-frame-${card.frame}${docked ? ' is-on' : ''}`} aria-hidden="true"><div className="vmx-studio__dockbar">
        <Avatar emoji={picture} size={36} />
        <span className="vmx-studio__dockname">{name}</span>
        {card.title && <span className="vmx-studio__docktitle">{BADGE_ART[card.title]?.label}</span>}
        <span className="vmx-studio__dockdots"><i /><i /></span>
      </div></div>
      <div className="vmx-studio__stage" ref={stageRef}>
        <StudentCard card={card} name={name} picture={picture} stats={stats} yearLine={yearLine} />
      </div>

      <section className="vmx-studio__sec" aria-labelledby="st-sets">
        <h2 id="st-sets" className="vmx-studio__h">ชุดสำเร็จ</h2>
        <p className="vmx-studio__decided"><b>{presetLine.lead}</b> {presetLine.text}</p>
        <div className="vmx-studio__sets" role="group" aria-label="ชุดสำเร็จ">
          {PRESETS.map((p) => (
            <button key={p.id} type="button" className="vmx-studio__set" aria-pressed={onScreen === p.id}
              onClick={() => change(p.values, { transition: p.values.theme !== undefined && p.values.theme !== prefs.theme })}>
              <span className={`vmx-studio__mini is-${PRESET_SAMPLE[p.id]}`} aria-hidden="true"><i /><i /><i /></span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="vmx-studio__sec" aria-labelledby="st-who">
        <h2 id="st-who" className="vmx-studio__h">ตัวละครของฉัน</h2>
        <div className="vmx-studio__chars" role="radiogroup" aria-label="รูปบนการ์ด">
          {BUDDIES.map((b) => {
            const emoji = CHARACTER_EMOJI[b.id];
            return (
              <button key={b.id} type="button" role="radio" aria-checked={pictureId === b.id} className="vmx-studio__char"
                onClick={() => pickPicture(emoji)}>
                <Avatar emoji={emoji} size={48} />
                <span>{b.nameTh}</span>
              </button>
            );
          })}
        </div>
        <div className="vmx-studio__animals" role="radiogroup" aria-label="สัตว์อื่น">
          {PICTURES.map(({ emoji: e, label }) => (
            <button key={e} type="button" role="radio" aria-checked={picture === e} aria-label={label} className="vmx-studio__animal" onClick={() => pickPicture(e)}>
              <span aria-hidden="true">{e}</span>
            </button>
          ))}
        </div>
        {pictureId && can3D && (
          show3D
            ? <div className="vmx-studio__3d"><Suspense fallback={<p className="vmx-studio__quiet">กำลังโหลด</p>}><Mascot3D id={pictureId} greet /></Suspense></div>
            : <button type="button" className="vmx-studio__link" onClick={() => setShow3D(true)}>ดูแบบสามมิติ</button>
        )}
      </section>

      <section className="vmx-studio__sec" aria-labelledby="st-colour">
        <h2 id="st-colour" className="vmx-studio__h">สี</h2>
        <div className="vmx-studio__swatches" role="radiogroup" aria-label="จานสี">
          {prefRow('palette').choices.map((id) => (
            <button key={id} type="button" role="radio" aria-checked={prefs.palette === id} className="vmx-studio__swatch"
              onClick={() => change({ palette: id }, { transition: true })}>
              <span className="vmx-studio__dot" aria-hidden="true"
                style={id === 'custom'
                  ? { '--a': accentPreview, '--b': accentPreview, background: 'conic-gradient(from 0deg, oklch(0.62 0.12 0), oklch(0.62 0.12 120), oklch(0.62 0.12 240), oklch(0.62 0.12 360))' }
                  : { '--a': PALETTE_DOTS[id][0], '--b': PALETTE_DOTS[id][1] }} />
              <span>{choiceLabel('palette', id)}</span>
            </button>
          ))}
        </div>
        {prefs.palette === 'custom' && (
          <label className="vmx-studio__hue">
            <span>เฉดสี <output>{prefs.accentHue}°</output></span>
            <input type="range" min="0" max="359" step="1" value={prefs.accentHue}
              onChange={(e) => writePref('accentHue', Number(e.target.value))}
              onPointerDown={() => setUndo(snapshotFor(['accentHue']))} />
            <small>ทุกเฉดอ่านได้ชัด ระบบปรับความสว่างให้เอง</small>
          </label>
        )}
      </section>

      <section className="vmx-studio__sec" aria-labelledby="st-card">
        <h2 id="st-card" className="vmx-studio__h">การ์ด</h2>
        <h3 className="vmx-studio__sub">พื้นหลัง</h3>
        <div className="vmx-studio__backdrops" role="radiogroup" aria-label="พื้นหลังการ์ด">
          {CARD_BACKDROPS.map((id) => (
            <button key={id} type="button" role="radio" aria-checked={card.backdrop === id} className={`vmx-studio__bd is-bd-${id}`} onClick={() => setCard({ backdrop: id })}>
              {BACKDROP_SRC[id] && <img src={BACKDROP_SRC[id]} alt="" loading="lazy" decoding="async" />}
              <span>{BACKDROP_LABEL[id]}</span>
            </button>
          ))}
        </div>
        <h3 className="vmx-studio__sub">กรอบ</h3>
        <div className="vmx-studio__frames" role="radiogroup" aria-label="กรอบการ์ด">
          {Object.keys(FRAME_EARNED_BY).map((id) => {
            const ok = allowance.frames.includes(id);
            return (
              <button key={id} type="button" role="radio" aria-checked={card.frame === id} disabled={!ok}
                className={`vmx-studio__frame is-frame-${id}`} onClick={() => setCard({ frame: id })}>
                <span className="vmx-studio__framebox" aria-hidden="true" />
                <span>{FRAME_LABEL[id]}</span>
                {!ok && <small>{BADGE_ART[FRAME_EARNED_BY[id]]?.label}</small>}
              </button>
            );
          })}
        </div>
        <h3 className="vmx-studio__sub">ถ้วยบนการ์ด <small>{card.trophies.length}/{MAX_ON_SHOW}</small></h3>
        {allowance.badges.length === 0
          ? <p className="vmx-studio__quiet">ยังไม่มีถ้วย</p>
          : (
            <div className="vmx-studio__trophies">
              {allowance.badges.map((b) => {
                const on = card.trophies.includes(b.id);
                const full = !on && card.trophies.length >= MAX_ON_SHOW;
                return (
                  <button key={b.id} type="button" aria-pressed={on} disabled={full} className="vmx-studio__trophy"
                    onClick={() => setCard({ trophies: on ? card.trophies.filter((x) => x !== b.id) : [...card.trophies, b.id] })}>
                    <img src={b.src} alt="" width="40" height="40" loading="lazy" />
                    <span>{b.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        {allowance.badges.length > 0 && (
          <>
            <h3 className="vmx-studio__sub">ตำแหน่ง</h3>
            <div className="vmx-studio__chips" role="radiogroup" aria-label="ตำแหน่งบนการ์ด">
              <button type="button" role="radio" aria-checked={!card.title} className="vmx-studio__chip" onClick={() => setCard({ title: null })}>ไม่ใส่</button>
              {allowance.badges.map((b) => (
                <button key={b.id} type="button" role="radio" aria-checked={card.title === b.id} className="vmx-studio__chip" onClick={() => setCard({ title: b.id })}>{b.label}</button>
              ))}
            </div>
          </>
        )}
        {next && (
          <p className="vmx-studio__next">
            ถ้วยถัดไป {next.label} อีก <b>{next.left.toLocaleString('en-US')}</b> {next.unit}
            {next.frame ? ` ได้กรอบ${FRAME_LABEL[next.frame]}` : ''}
          </p>
        )}
      </section>

      <section className="vmx-studio__sec vmx-studio__own">
        <button type="button" className="vmx-studio__fold" aria-expanded={open} aria-controls="st-own" onClick={() => setOpen((o) => !o)}>
          <span>ปรับเอง</span>
          <svg className="vmx-studio__chev" width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div id="st-own" hidden={!open}>
          <Group title="สว่างหรือมืด">
            <div className="vmx-studio__pages" role="radiogroup" aria-label="สว่างหรือมืด">
              {prefRow('theme').choices.map((id) => [id, choiceLabel('theme', id)]).map(([id, label]) => (
                <button key={id} type="button" role="radio" aria-checked={prefs.theme === id} className={`vmx-studio__page is-${id}`}
                  onClick={() => change({ theme: id }, { transition: true })}>
                  <span className="vmx-studio__pagebox" aria-hidden="true"><i /><i /><i /></span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </Group>

          <Group title="การเคลื่อนไหว">
            <div className="vmx-studio__chips" role="radiogroup" aria-label="การเคลื่อนไหว">
              {prefRow('motion.mode').choices.map((id) => [id, choiceLabel('motion.mode', id)]).map(([id, label]) => (
                <button key={id} type="button" role="radio" aria-checked={prefs['motion.mode'] === id} className={`vmx-studio__chip is-motion-${id}`}
                  onClick={() => change({ 'motion.mode': id })}>
                  <span className="vmx-studio__pulse" aria-hidden="true" />{label}
                </button>
              ))}
            </div>
            {systemReduced && <p className="vmx-studio__quiet">เครื่องนี้ตั้งให้ลดการเคลื่อนไหว จึงเห็นเป็นภาพนิ่ง</p>}
          </Group>

          {/* ── ตัวอักษร: reserved for components/FontGallery.jsx (branch
               claude/reading-fonts). Shown in development only, so a
               release without the fonts carries no empty section. ── */}
          {import.meta.env.DEV && (
            <Group title="ตัวอักษร">
              <div className="vmx-studio__slot" data-slot="fonts">ที่ของชุดตัวอักษร</div>
            </Group>
          )}

          <Group title="เพื่อนติว">
            <div className="vmx-studio__chips" role="radiogroup" aria-label="เพื่อนติวในหน้าต่าง ๆ">
              <button type="button" role="radio" aria-checked={prefs['motion.companion'] === true} className="vmx-studio__chip" onClick={() => change({ 'motion.companion': true })}>แสดง</button>
              <button type="button" role="radio" aria-checked={prefs['motion.companion'] === false} className="vmx-studio__chip" onClick={() => change({ 'motion.companion': false })}>ซ่อน</button>
            </div>
            <div className="vmx-studio__buddies" role="radiogroup" aria-label="เพื่อนติว">
              {BUDDIES.map((b) => (
                <button key={b.id} type="button" role="radio" aria-checked={prefs.buddy === b.id} className="vmx-studio__buddy" onClick={() => change({ buddy: b.id })}>
                  <Avatar emoji={CHARACTER_EMOJI[b.id]} size={36} />
                  <span>{b.nameTh}</span>
                </button>
              ))}
            </div>
          </Group>

          <EffectGroup title="ระหว่างรอโหลด" id="motion.loader" value={prefs['motion.loader']} onPick={(v) => change({ 'motion.loader': v })} reduced={reduced} />
          <EffectGroup title="เมื่อทำชุดสำเร็จ" id="motion.celebration" value={prefs['motion.celebration']} onPick={(v) => change({ 'motion.celebration': v })} reduced={reduced}
            stageFor={(v) => (v === 'contextual' ? 'chapter' : v)} />
          <EffectGroup title="ตัวชี้ตอนอ่าน" id="motion.readingPointer" value={prefs['motion.readingPointer']} onPick={(v) => change({ 'motion.readingPointer': v })} reduced={reduced}
            stageFor={(v) => (v === 'auto' ? 'spotlight' : v === 'none' ? null : v)} />

          <Group title="เสียงอ่าน">
            <div className="vmx-studio__chips" role="radiogroup" aria-label="ความเร็วเสียงอ่าน">
              {prefRow('readAloudRate').choices.map((r) => (
                <button key={r} type="button" role="radio" aria-checked={prefs.readAloudRate === r} className="vmx-studio__chip is-num" onClick={() => change({ readAloudRate: r })}>
                  {r}×
                </button>
              ))}
            </div>
          </Group>

          {canVibrate() && (
            <Group title="สั่นเบา ๆ เมื่อรู้ผล">
              <div className="vmx-studio__chips" role="radiogroup" aria-label="สั่นเบา ๆ เมื่อรู้ผล">
                <button type="button" role="radio" aria-checked={prefs['motion.haptics'] === true} className="vmx-studio__chip" onClick={() => change({ 'motion.haptics': true })}>เปิด</button>
                <button type="button" role="radio" aria-checked={prefs['motion.haptics'] === false} className="vmx-studio__chip" onClick={() => change({ 'motion.haptics': false })}>ปิด</button>
              </div>
            </Group>
          )}
        </div>
      </section>

      <p className="vmx-studio__foot">
        {user ? 'สี เพื่อนติว และการ์ดตามไปทุกเครื่องที่เข้าบัญชีนี้' : 'เก็บไว้ในเครื่องนี้'}
      </p>

      <div className={`vmx-studio__undo${undo ? ' is-on' : ''}`} role="status" aria-live="polite">
        {undo && (
          <>
            <span>เปลี่ยนแล้ว</span>
            <button type="button" onClick={takeBack}>ย้อนกลับ</button>
          </>
        )}
      </div>
    </div>
  );
}

function Group({ title, children }) {
  return (
    <div className="vmx-studio__group">
      <h3 className="vmx-studio__sub">{title}</h3>
      {children}
    </div>
  );
}

// A row of samples and one live stage for the picked one: the stage plays the
// real motion-kit effect (MotionSurface), still under reduced motion.
function EffectGroup({ title, id, value, onPick, reduced, stageFor = (v) => v }) {
  const choices = prefRow(id).choices;
  const stage = stageFor(value);
  return (
    <Group title={title}>
      <div className="vmx-studio__effects" role="radiogroup" aria-label={title}>
        {choices.map((v) => {
          const meta = choiceMeta(id, v);
          return (
            <button key={v} type="button" role="radio" aria-checked={value === v} className="vmx-studio__effect" onClick={() => onPick(v)}>
              <span className="vmx-studio__glyph" aria-hidden="true">{meta.symbol}</span>
              <span>{meta.th}</span>
            </button>
          );
        })}
      </div>
      {stage && !reduced && (
        <div className="vmx-studio__live" aria-hidden="true"><MotionSurface key={stage} effect={stage} /></div>
      )}
    </Group>
  );
}

