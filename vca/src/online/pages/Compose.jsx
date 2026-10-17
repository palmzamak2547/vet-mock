// Starting a thread, or editing one's own. A thread can be about one question in the bank: it
// arrives here from that question with its number and domain, and shows it above the form. An
// unsent thread is kept on this device until it is posted, so a closed tab loses nothing.

import { useEffect, useState } from 'react';
import { Link } from '../../components/Link.jsx';
import { Icon } from '../../components/Icon.jsx';
import { useTitle } from '../../lib/hooks.js';
import { DOMAIN_CARDS, CARD_BY_ID } from '../../lib/bank.js';
import { navigate } from '../../router.js';
import { JoinPrompt, KindSeg, Soon } from '../ui/bits.jsx';
import { QuestionPeek } from '../ui/QuestionPeek.jsx';
import { AttachButton, MediaGrid, MediaTray, useMediaTray } from '../ui/Media.jsx';
import { MODE } from '../config.js';
import { ensureAccount, getBackend, useAccount } from '../account.js';
import { problemText } from '../shapes.js';
import '../community.css';

const DRAFT = 'vca:community:draft';
const TITLE_MAX = 140;
const BODY_MAX = 8000;

function readDraft() {
  try { return JSON.parse(localStorage.getItem(DRAFT) || 'null'); } catch { return null; }
}
function keepDraft(form) {
  try {
    if (form.title.trim() || form.body.trim()) localStorage.setItem(DRAFT, JSON.stringify(form));
    else localStorage.removeItem(DRAFT);
  } catch { /* the form still holds it */ }
}
const dropDraft = () => { try { localStorage.removeItem(DRAFT); } catch { /* nothing kept */ } };

export default function Compose({ route }) {
  const editing = route.params.id || null;
  const account = useAccount();
  const fromQuery = () => {
    const no = Number(route.query.get('q')) || '';
    const d = CARD_BY_ID[route.query.get('d')] ? route.query.get('d') : '';
    const kind = route.query.get('kind') || 'question';
    const draft = readDraft();
    // A draft about another question stays for later; this one starts clean.
    if (draft && String(draft.questionNo || '') === String(no) && (!d || draft.domain === d)) return draft;
    return { kind, domain: d, questionNo: no, title: '', body: '' };
  };
  const [form, setForm] = useState(() => (editing ? null : fromQuery()));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [missing, setMissing] = useState(false);
  const tray = useMediaTray({ kind: 'post', max: 4, video: true });
  useTitle(editing ? 'แก้ไขกระทู้' : 'ตั้งกระทู้');

  useEffect(() => { ensureAccount(); }, []);
  useEffect(() => {
    if (!editing || MODE === 'off') return undefined;
    let live = true;
    getBackend().then((b) => b.board.get(editing)).then((p) => {
      if (!live) return;
      if (!p) { setMissing(true); return; }
      setForm({ kind: p.kind, domain: p.domain || '', questionNo: p.questionNo || '', title: p.title, body: p.body, authorId: p.author.id, media: p.media });
    }).catch(() => { if (live) setMissing(true); });
    return () => { live = false; };
  }, [editing]);
  useEffect(() => { if (form && !editing) keepDraft(form); }, [form, editing]);

  if (MODE === 'off') return <Soon />;
  const canWrite = account.status === 'in' && account.profile;
  const back = editing ? `/community/p/${editing}` : '/community';

  const head = (
    <>
      <nav className="crumbs" aria-label="ตำแหน่ง">
        <Link to="/community">ชุมชน</Link>
        <Icon name="chevronRight" size={16} />
        <span>{editing ? 'แก้ไขกระทู้' : 'ตั้งกระทู้'}</span>
      </nav>
      <header className="page-head compose-head">
        <h1 className="page-h">{editing ? 'แก้ไขกระทู้' : 'ตั้งกระทู้'}</h1>
      </header>
    </>
  );

  if (missing) {
    return (
      <div className="wrap compose">
        {head}
        <div className="empty"><p className="empty-h">ไม่พบกระทู้นี้</p><Link to="/community" className="btn btn-ink">กลับไปชุมชน</Link></div>
      </div>
    );
  }
  if (account.status === 'idle' || account.status === 'loading' || !form) {
    return <div className="wrap compose">{head}<div className="skel-card"><span className="skel skel-line w60" /><span className="skel skel-line w80" /><span className="skel skel-line w40" /></div></div>;
  }
  if (!canWrite) return <div className="wrap compose">{head}<JoinPrompt what="ตั้งกระทู้" /></div>;
  if (editing && form.authorId && form.authorId !== account.user?.id) {
    return <div className="wrap compose">{head}<p className="notice">แก้ไขได้เฉพาะกระทู้ของตัวเอง</p></div>;
  }

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v?.target ? v.target.value : v }));
  const titleOk = form.title.trim().length >= 4;
  const ready = titleOk && form.body.trim().length > 0;
  const lockedQuestion = !editing && !!(form.questionNo && form.domain && route.query.get('q'));

  const submit = async (e) => {
    e.preventDefault();
    if (!ready || busy || tray.busy) return;
    setBusy(true);
    setError('');
    try {
      const b = await getBackend();
      const fields = { kind: form.kind, domain: form.domain, questionNo: form.questionNo, title: form.title, body: form.body, ...(editing ? {} : { media: tray.media }) };
      const post = editing ? await b.board.update(editing, fields) : await b.board.create(fields);
      if (!editing) { dropDraft(); tray.done(); }
      navigate(`/community/p/${post.id}`, { replace: true });
    } catch (err) {
      setError(problemText(err));
      setBusy(false);
    }
  };

  return (
    <div className="wrap compose">
      {head}
      {form.questionNo && form.domain && <QuestionPeek no={form.questionNo} domain={form.domain} />}
      <form className="compose-form" onSubmit={submit}>
        <KindSeg value={form.kind} onChange={set('kind')} name="compose-kind" />
        <label className="form-row">
          <span className="form-label">หัวข้อ</span>
          <input value={form.title} onChange={set('title')} maxLength={TITLE_MAX} required placeholder="สรุปสิ่งที่อยากถามหรืออยากเล่าในบรรทัดเดียว" />
          <span className={`form-note${form.title && !titleOk ? ' is-bad' : ''}`}>{form.title && !titleOk ? 'อย่างน้อย 4 ตัวอักษร' : `${form.title.length}/${TITLE_MAX}`}</span>
        </label>
        <label className="form-row">
          <span className="form-label">รายละเอียด</span>
          <textarea value={form.body} onChange={set('body')} maxLength={BODY_MAX} rows={8} required placeholder="เล่าให้ครบพอที่เพื่อนจะตอบได้ เช่น ข้อไหน ตอบอะไรไป ติดตรงไหน" />
          <span className="form-note">{form.body.length > BODY_MAX * 0.8 ? `${form.body.length}/${BODY_MAX}` : 'เว้นบรรทัดว่างเพื่อขึ้นย่อหน้าใหม่'}</span>
        </label>
        {editing ? (form.media?.length ? <div className="compose-media-kept"><MediaGrid media={form.media} compact /><span className="hint">รูปและวิดีโอของกระทู้แก้ภายหลังไม่ได้</span></div> : null) : (
          <div className="compose-media">
            <div className="compose-attach">
              <AttachButton tray={tray} className="btn btn-ghost btn-sm" label="รูปหรือวิดีโอ" />
              <span className="hint">สูงสุด 4 รูป หรือวิดีโอ 1 คลิปไม่เกิน 2 นาที</span>
            </div>
            <MediaTray tray={tray} />
          </div>
        )}
        {lockedQuestion ? (
          <p className="compose-about"><Icon name="link" size={16} />ผูกกับข้อ No. {form.questionNo} ในหมวด{CARD_BY_ID[form.domain]?.th}</p>
        ) : (
          <div className="form-pair">
            <label className="form-row">
              <span className="form-label">หมวด <span className="label-note">ไม่ใส่ก็ได้</span></span>
              <span className="select select-block">
                <select value={form.domain} onChange={set('domain')}>
                  <option value="">ไม่ระบุหมวด</option>
                  {DOMAIN_CARDS.map((d) => <option key={d.id} value={d.id}>{d.th}</option>)}
                </select>
                <Icon name="chevronDown" size={18} />
              </span>
            </label>
            <label className="form-row">
              <span className="form-label">ข้อในคลัง <span className="label-note">ไม่ใส่ก็ได้</span></span>
              <span className="form-prefix"><span aria-hidden="true">No.</span>
                <input inputMode="numeric" pattern="[0-9]*" value={form.questionNo} onChange={(e) => set('questionNo')(e.target.value.replace(/\D/g, '').slice(0, 7))} placeholder="เลขข้อ" />
              </span>
            </label>
          </div>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="compose-go">
          <button type="submit" className="btn btn-ink" disabled={!ready || busy || tray.busy}>
            {busy ? <span className="spinner" aria-hidden="true" /> : <Icon name={editing ? 'check' : 'send'} size={18} />}
            {editing ? 'บันทึก' : 'โพสต์'}
          </button>
          <Link to={back} className="btn btn-ghost">ยกเลิก</Link>
          {!editing && (form.title || form.body) && <span className="hint compose-kept">เก็บร่างไว้ในเครื่องนี้แล้ว</span>}
        </div>
      </form>
    </div>
  );
}
