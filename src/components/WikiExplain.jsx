// ============================================================
// WikiExplain — grounded AI explanation for a VetWiki article
// ============================================================
// Renders the answer as CLAIMS, each showing how it is supported and linking
// to the exact section it came from. Nothing here trusts the model: the
// server already re-grounded every citation, and this component re-runs the
// same validation before rendering (isomorphic guard).
//
// Degrades honestly: if the AI isn't configured (503) the panel says so and
// the article is still fully readable.
// ============================================================

import React, { useState } from 'react';
import { validateAnswer, allowedFromSections, ANSWER_SUPPORT_LABEL } from '../lib/vetwiki/answer.js';

const TONE = {
  strong: 'var(--clr-sage-text)',
  weak: 'var(--clr-gold-text)',
  muted: 'var(--clr-ink-soft)',
};

const PRESETS = [
  'อธิบายหัวข้อนี้ให้ง่ายขึ้น',
  'สรุปสั้น ๆ ก่อนสอบ',
  'จุดที่นิสิตมักสับสนคืออะไร',
];

export default function WikiExplain({ knowledge, onJumpToSection }) {
  const [q, setQ] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [claims, setClaims] = useState([]);
  const [message, setMessage] = useState('');

  const sectionById = new Map(knowledge.sections.map((s) => [s.id, s]));

  const ask = async (question) => {
    const text = String(question || '').trim();
    if (!text || state === 'loading') return;
    setState('loading'); setMessage(''); setClaims([]);
    try {
      const res = await fetch('/api/wiki-explain', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: text, subject: knowledge.subject, topic: knowledge.topic }),
      });
      if (res.status === 503) {
        setState('error');
        setMessage('ยังไม่ได้เปิดใช้ผู้ช่วย AI — เนื้อหาในหน้านี้อ่านได้ตามปกติ');
        return;
      }
      if (res.status === 429) {
        setState('error'); setMessage('ถามบ่อยเกินไป ลองใหม่ในอีกสักครู่'); return;
      }
      // In local preview there is no serverless runtime, so /api/* returns the
      // SPA shell. Say that plainly instead of a generic failure.
      if (!(res.headers.get('content-type') || '').includes('application/json')) {
        setState('error');
        setMessage('ผู้ช่วย AI ใช้ได้เฉพาะบนเว็บจริง — เนื้อหาในหน้านี้อ่านได้ตามปกติ');
        return;
      }
      if (!res.ok) { setState('error'); setMessage('ตอบไม่สำเร็จ ลองใหม่อีกครั้ง'); return; }
      const data = await res.json();
      // Re-validate client-side too — never render an unchecked citation.
      const allowed = allowedFromSections(knowledge.id, knowledge.sections);
      const { claims: safe } = validateAnswer(data.claims, allowed);
      setClaims(safe);
      setState('done');
    } catch {
      setState('error'); setMessage('เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง');
    }
  };

  return (
    <section style={{ marginTop: 30, padding: '16px 18px', borderRadius: 14, background: 'var(--clr-surface)', border: '1px solid var(--clr-border)' }}>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 17, margin: '0 0 4px' }}>ถามจากหัวข้อนี้</h2>
      <p style={{ fontSize: 12.5, color: 'var(--clr-ink-soft)', margin: '0 0 12px', lineHeight: 1.6 }}>
        ตอบโดยใช้เฉพาะเนื้อหาในหน้านี้ และบอกทุกประโยคว่ามาจากหัวข้อย่อยไหน
      </p>

      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 10 }}>
        {PRESETS.map((p) => (
          <button key={p} type="button" className="vmx-chip" style={{ cursor: 'pointer' }}
            onClick={() => { setQ(p); ask(p); }} disabled={state === 'loading'}>
            {p}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <label htmlFor="wiki-ask" style={{ position: 'absolute', left: -9999 }}>คำถาม</label>
        <input id="wiki-ask" className="vmx-fill-input" value={q} onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') ask(q); }}
          placeholder="พิมพ์คำถามเกี่ยวกับหัวข้อนี้"
          style={{ flex: 1, minWidth: 180, boxSizing: 'border-box' }} />
        <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={() => ask(q)} disabled={state === 'loading' || !q.trim()}>
          {state === 'loading' ? 'กำลังคิด...' : 'ถาม'}
        </button>
      </div>

      {state === 'loading' && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[0, 1, 2].map((i) => <div key={i} className="vmx-skeleton" style={{ height: 44, borderRadius: 10 }} />)}
        </div>
      )}

      {state === 'error' && (
        <div className="vmx-empty" style={{ marginTop: 12 }}>{message}</div>
      )}

      {state === 'done' && claims.length > 0 && (
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {claims.map((c) => {
            const label = ANSWER_SUPPORT_LABEL[c.supportType];
            return (
              <div key={c.id} style={{ padding: '11px 13px', borderRadius: 10, background: 'var(--clr-surface-2)', borderLeft: `3px solid ${TONE[label?.tone] || 'var(--clr-border)'}` }}>
                <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--clr-ink)' }}>{c.text}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 7 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: TONE[label?.tone] || 'var(--clr-ink-soft)' }}>
                    {label?.th || c.supportType}
                  </span>
                  {c.support.map((s) => {
                    const sec = sectionById.get(s.sectionId);
                    if (!sec) return null;
                    return (
                      <button key={s.sectionId} type="button" className="vmx-chip"
                        onClick={() => onJumpToSection?.(s.sectionId)}
                        title="ไปที่หัวข้อย่อยที่เป็นที่มา"
                        style={{ cursor: 'pointer', fontSize: 11.5 }}>
                        ↑ {sec.heading}
                      </button>
                    );
                  })}
                </div>
                {c.limitations?.length > 0 && (
                  <ul style={{ margin: '7px 0 0', paddingLeft: 18, fontSize: 11.5, color: 'var(--clr-ink-soft)' }}>
                    {c.limitations.map((l, i) => <li key={i}>{l}</li>)}
                  </ul>
                )}
              </div>
            );
          })}
          <p style={{ fontSize: 11.5, color: 'var(--clr-ink-soft)', lineHeight: 1.5, margin: '2px 0 0' }}>
            ทุกประโยคที่อ้างหัวข้อย่อย ถูกตรวจกับเนื้อหาจริงในหน้านี้แล้ว ส่วนที่เขียนว่า “การวิเคราะห์ของ VetMock” คือการสรุป/เชื่อมโยง ไม่ใช่ข้อความที่ยกมาตรง ๆ
          </p>
        </div>
      )}
    </section>
  );
}
