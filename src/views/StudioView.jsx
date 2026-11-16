// ============================================================
// StudioView: "ปรับแต่งการ์ด", where a student styles their card
// ============================================================
// Opened from the card on the profile hub. The card stays in view while
// anything changes; every pick applies at once and is saved at once (this
// device first, then for classmates, lib/card-style-remote.js), and one
// line says where it was saved. "คืนค่าเริ่มต้น" puts the card back.
// The picture and the name are the account's, edited on the profile's
// identity card, so they are not offered here.
// Never reachable from a question set: its only entry is the profile hub.
// ============================================================
import { Suspense, useCallback, useMemo, useState } from 'react';
import BackBar from '../components/BackBar.jsx';
import StudentCard from '../components/StudentCard.jsx';
import { useMyCard } from '../hooks/useMyCard.js';
import { ownCard } from '../lib/own-card.js';
import {
  CARD_BACKDROPS, FRAME_EARNED_BY, FRAME_LABEL, MAX_ON_SHOW, DEFAULT_CARD,
  backdropLabel, backdropSrc, isDefaultCard, nextTrophy,
} from '../lib/card-style.js';
import { BADGE_ART } from '../data/art.js';
import '../styles-studio.css';

import { lazyWithRetry } from '../lib/lazy-retry.js';
const ShareCardSheet = lazyWithRetry(() => import('../components/ShareCardSheet.jsx'));

const STATUS = {
  loading: 'กำลังโหลดการ์ดที่บันทึกไว้',
  saving: 'กำลังบันทึก',
  saved: 'บันทึกแล้ว เพื่อนในกลุ่มติวเห็นการ์ดแบบนี้',
  device: 'บันทึกไว้ในเครื่องนี้แล้ว',
  offline: 'ไม่มีอินเทอร์เน็ต บันทึกไว้ในเครื่องนี้ก่อน จะส่งให้เมื่อกลับมาออนไลน์',
  failed: 'บันทึกให้เพื่อนเห็นไม่สำเร็จ การ์ดยังอยู่ในเครื่องนี้',
  guest: 'การ์ดเก็บไว้ในเครื่องนี้ เข้าสู่ระบบเพื่อให้เพื่อนในกลุ่มติวเห็นการ์ดนี้',
};

export default function StudioView({ goBack, user = null, profile = null, history = [], srCards = {}, streakData = null, selectedYear = null, theme = 'light' }) {
  const { card, status, save, retry } = useMyCard(user);
  const [sharing, setSharing] = useState(false);
  const { face, worn, allowance, streak } = ownCard({ card, user, profile, history, srCards, streakData, selectedYear, theme });
  const next = useMemo(() => nextTrophy({ history: history || [], srCards: srCards || {}, currentStreak: streak }), [history, srCards, streak]);
  const set = (patch) => save({ ...worn, ...patch });
  const draw = useCallback(async (t) => {
    const { drawStudentCard, cardArt } = await import('../lib/share-card/student-card.js');
    const { face: f } = ownCard({ card, user, profile, history, srCards, streakData, selectedYear, theme: t });
    return drawStudentCard(f, { art: await cardArt(f) });
  }, [card, user, profile, history, srCards, streakData, selectedYear]);

  const line = status === 'idle' ? (user ? '' : STATUS.guest) : STATUS[status];
  const earnedAny = allowance.badges.length > 0;

  return (
    <div className="vmx-studio">
      <BackBar onBack={goBack} label="โปรไฟล์" />
      <header className="vmx-studio__head">
        <h1>ปรับแต่งการ์ด</h1>
        <p>เลือกพื้นหลัง กรอบ และถ้วยที่ได้มา การ์ดเปลี่ยนให้เห็นทันที รูปที่แชร์ก็เป็นแบบเดียวกัน</p>
      </header>

      <div className="vmx-studio__stage" aria-busy={status === 'loading' || undefined}>
        <StudentCard face={face} />
      </div>

      <div className="vmx-studio__controls">
        <section className="vmx-studio__sec" aria-labelledby="st-bd">
          <h2 id="st-bd" className="vmx-studio__h">พื้นหลัง</h2>
          <div className="vmx-studio__backdrops" role="radiogroup" aria-labelledby="st-bd">
            {CARD_BACKDROPS.map((id) => (
              <button key={id} type="button" role="radio" aria-checked={worn.backdrop === id} className="vmx-studio__bd" style={{ background: face.colours.stock }} onClick={() => set({ backdrop: id })}>
                {backdropSrc(id) && <img src={backdropSrc(id)} alt="" decoding="async" style={{ opacity: face.colours.plateOpacity, filter: face.colours.plateFilter }} />}
                <span>{backdropLabel(id)}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="vmx-studio__sec" aria-labelledby="st-frame">
          <h2 id="st-frame" className="vmx-studio__h">กรอบ</h2>
          <div className="vmx-studio__frames" role="radiogroup" aria-labelledby="st-frame">
            {Object.keys(FRAME_EARNED_BY).map((id) => {
              const ok = allowance.frames.includes(id);
              const by = FRAME_EARNED_BY[id] ? BADGE_ART[FRAME_EARNED_BY[id]]?.label : null;
              return (
                <button key={id} type="button" role="radio" aria-checked={worn.frame === id} aria-disabled={!ok || undefined}
                  className={`vmx-studio__frame is-frame-${id}${ok ? '' : ' is-locked'}`}
                  onClick={() => { if (ok) set({ frame: id }); }}>
                  <span className="vmx-studio__framebox" aria-hidden="true" />
                  <span className="vmx-studio__framename">{FRAME_LABEL[id]}</span>
                  {!ok && <small>ได้เมื่อมีถ้วย{by}</small>}
                </button>
              );
            })}
          </div>
        </section>

        <section className="vmx-studio__sec" aria-labelledby="st-trophy">
          <h2 id="st-trophy" className="vmx-studio__h">ถ้วยบนการ์ด <small>เลือกได้ {MAX_ON_SHOW} ใบ</small></h2>
          {!earnedAny ? (
            <p className="vmx-studio__quiet">ยังไม่มีถ้วย ได้ถ้วยแรกแล้วเลือกมาโชว์บนการ์ดได้ที่นี่</p>
          ) : (
            <div className="vmx-studio__trophies">
              {allowance.badges.map((b) => {
                const on = worn.trophies.includes(b.id);
                const full = !on && worn.trophies.length >= MAX_ON_SHOW;
                return (
                  <button key={b.id} type="button" aria-pressed={on} aria-disabled={full || undefined} className="vmx-studio__trophy"
                    onClick={() => { if (!full) set({ trophies: on ? worn.trophies.filter((x) => x !== b.id) : [...worn.trophies, b.id] }); }}>
                    <img src={b.src} alt="" width="40" height="40" loading="lazy" />
                    <span>{b.label}</span>
                  </button>
                );
              })}
            </div>
          )}
          {earnedAny && worn.trophies.length >= MAX_ON_SHOW && <p className="vmx-studio__quiet">ครบ {MAX_ON_SHOW} ใบแล้ว แตะใบที่เลือกไว้เพื่อเอาออกก่อน</p>}
        </section>

        {earnedAny && (
          <section className="vmx-studio__sec" aria-labelledby="st-title">
            <h2 id="st-title" className="vmx-studio__h">คำใต้ชื่อ</h2>
            <div className="vmx-studio__chips" role="radiogroup" aria-labelledby="st-title">
              <button type="button" role="radio" aria-checked={!worn.title} className="vmx-studio__chip" onClick={() => set({ title: null })}>ไม่ใส่</button>
              {allowance.badges.map((b) => (
                <button key={b.id} type="button" role="radio" aria-checked={worn.title === b.id} className="vmx-studio__chip" onClick={() => set({ title: b.id })}>{b.label}</button>
              ))}
            </div>
          </section>
        )}

        {next && (
          <p className="vmx-studio__next">
            ถ้วยถัดไป "{next.label}" อีก <b>{next.left.toLocaleString('en-US')}</b> {next.unit}
            {next.frame ? ` ได้ถ้วยนี้แล้วใช้กรอบ${FRAME_LABEL[next.frame]}ได้` : ''}
          </p>
        )}

        <section className="vmx-studio__sec vmx-studio__end" aria-label="บันทึกและแชร์">
          <p className={`vmx-studio__status is-${status}`} role="status" aria-live="polite">
            {line}
            {status === 'failed' && <button type="button" className="vmx-studio__retry" onClick={retry}>ลองอีกครั้ง</button>}
          </p>
          <div className="vmx-studio__actions">
            <button type="button" className="vmx-btn vmx-btn-primary" onClick={() => setSharing(true)}>แชร์การ์ด</button>
            <button type="button" className="vmx-btn vmx-btn-ghost" disabled={isDefaultCard(worn)} onClick={() => save(DEFAULT_CARD)}>คืนค่าเริ่มต้น</button>
          </div>
          <p className="vmx-studio__quiet">คืนค่าเริ่มต้นเปลี่ยนพื้นหลัง กรอบ ถ้วย และคำใต้ชื่อกลับเป็นแบบแรก ชื่อและรูปไม่เปลี่ยน</p>
        </section>
      </div>

      {sharing && (
        <Suspense fallback={null}>
          <ShareCardSheet
            title="แชร์การ์ด"
            onClose={() => setSharing(false)}
            draw={draw}
            fileBase="vetmock-card"
            alt={`การ์ดของ ${face.name}`}
          />
        </Suspense>
      )}
    </div>
  );
}
