// ============================================================
// QComments — discussion thread per question
// ============================================================
//
// Shown inline in ReviewView under each Q. Reads/writes to the
// `q_comments` Supabase table (RLS: public read, authenticated insert
// of own rows). Subscribes to Postgres CDC so new replies appear
// without a refresh.
//
// Compound key (q_subject, q_id) because Q ids aren't unique across
// the question bank — a known dupe-id issue tracked in the vault.
//
// Single-player (no Supabase) or anonymous (no login) gracefully
// fall back to a sign-in CTA + read-only view (anyone can read).
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { hasSupabase } from '../lib/supabase.js';
import {
  listQComments, postQComment, deleteQComment, subscribeQComments,
} from '../lib/api.js';
import { confirmDialog } from '../lib/dialog.js';

function fmtTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = Date.now();
  const ago = (now - d.getTime()) / 1000;
  if (ago < 60) return 'เมื่อกี้';
  if (ago < 3600) return `${Math.floor(ago / 60)} นาทีที่แล้ว`;
  if (ago < 86400) return `${Math.floor(ago / 3600)} ชั่วโมงที่แล้ว`;
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
}

export default function QComments({ qSubject, qId, user, setView }) {
  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const channelRef = useRef(null);

  // Initial fetch
  useEffect(() => {
    if (!hasSupabase) { setLoading(false); return; }
    let cancelled = false;
    listQComments(qSubject, qId).then((rows) => {
      if (cancelled) return;
      setComments(rows);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [qSubject, qId]);

  // Realtime — new INSERTs append, DELETEs remove, UPDATEs replace
  useEffect(() => {
    if (!hasSupabase) return;
    let active = true;
    subscribeQComments(qSubject, qId, (payload) => {
      if (!active) return;
      setComments((prev) => {
        if (payload.eventType === 'INSERT') {
          if (prev.find((c) => c.id === payload.new.id)) return prev; // dupe (we just posted)
          return [...prev, payload.new];
        }
        if (payload.eventType === 'DELETE') return prev.filter((c) => c.id !== payload.old.id);
        if (payload.eventType === 'UPDATE') return prev.map((c) => c.id === payload.new.id ? { ...c, ...payload.new } : c);
        return prev;
      });
    }).then((ch) => { channelRef.current = ch; });
    return () => {
      active = false;
      const ch = channelRef.current;
      if (ch) ch.unsubscribe?.();
    };
  }, [qSubject, qId]);

  // iOS Safari kills background WebSockets — when the tab returns,
  // the CDC channel is dead. Re-fetch comments so we sync any posts
  // we missed while backgrounded. (Subscribe-again would also work
  // but a one-shot list refresh is cheaper + safer.)
  useEffect(() => {
    if (!hasSupabase) return;
    const onVis = () => {
      if (document.visibilityState === 'visible') {
        listQComments(qSubject, qId).then((rows) => setComments(rows));
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [qSubject, qId]);

  async function submit() {
    if (!user) {
      setView?.('auth');
      return;
    }
    const text = draft.trim();
    if (!text) return;
    setPosting(true); setErr(null);
    try {
      const row = await postQComment(qSubject, qId, text, user.id);
      // Optimistic add (realtime will dedup)
      setComments((prev) => prev.find((c) => c.id === row.id) ? prev : [...prev, row]);
      setDraft('');
    } catch (e) {
      setErr(e.message || 'โพสต์ไม่สำเร็จ');
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete(id) {
    if (!(await confirmDialog({ title: 'ลบความเห็นนี้?', confirmLabel: 'ลบ', tone: 'danger' }))) return;
    try {
      await deleteQComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setErr(e.message);
    }
  }

  if (!hasSupabase) {
    return (
      <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: 'var(--clr-surface-2)', fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
        ความเห็นเปิดเฉพาะเครื่องที่ตั้งค่า Supabase ไว้ — single-player mode
      </div>
    );
  }

  return (
    <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: 'rgba(74, 107, 74, 0.04)', border: '1px solid var(--clr-border)' }}>
      <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
        ความเห็น {comments.length > 0 && `(${comments.length})`}
      </div>

      {loading && <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)' }}>กำลังโหลด…</div>}

      {!loading && comments.length === 0 && (
        <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic', marginBottom: 8 }}>
          ยังไม่มีความเห็น — เป็นคนแรกได้
        </div>
      )}

      {comments.length > 0 && (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
          {comments.map((c) => {
            const mine = user && c.user_id === user.id;
            const author = c.profiles?.username || 'ผู้ใช้';
            const avatar = c.profiles?.avatar_emoji || '🐾';
            return (
              <li key={c.id} style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--clr-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14 }}>{avatar}</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{author}</span>
                  <span style={{ fontSize: 10, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)' }}>{fmtTime(c.created_at)}</span>
                  {mine && (
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      title="ลบ"
                      style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--clr-ink-soft)', cursor: 'pointer', fontSize: 12, padding: 0 }}
                    >🗑</button>
                  )}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.55, whiteSpace: 'pre-wrap', color: 'var(--clr-ink)' }}>
                  {c.body}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Composer */}
      <div style={{ display: 'flex', gap: 6 }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={user ? 'พิมพ์ความเห็น/แก้ไข/แชร์ tip…' : 'login เพื่อโพสต์ — อ่านได้ไม่ต้อง login'}
          rows={2}
          maxLength={2000}
          disabled={!user || posting}
          style={{
            flex: 1, padding: 8, borderRadius: 6,
            border: '1px solid var(--clr-border)', fontSize: 13,
            fontFamily: 'inherit', resize: 'vertical',
            background: user ? 'var(--clr-bg)' : 'var(--clr-surface-2)',
            color: 'var(--clr-ink)',
          }}
        />
        <button
          type="button"
          onClick={submit}
          disabled={posting || (user && !draft.trim())}
          className="vmx-btn vmx-btn-primary vmx-btn-sm"
          style={{ alignSelf: 'flex-start' }}
        >
          {!user ? 'Login' : posting ? '...' : 'โพสต์'}
        </button>
      </div>
      {err && <div style={{ marginTop: 6, fontSize: 11, color: 'var(--clr-rose, #c0392b)' }}>{err}</div>}
    </div>
  );
}
