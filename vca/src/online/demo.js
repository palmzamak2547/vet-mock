// An in-memory community with the same calls as live.js, for development and the end-to-end
// tests: the pages can be built, tried and tested with no account and no network. Signing in
// signs in at once as a demo student. What happens is kept for the tab's life (sessionStorage),
// so a reload keeps the conversation. Never used in a production build (config.js).

import { fromProfile, toComment, toMessage, toPost, toProfile } from './shapes.js';

const KEY = 'vca:demo:community:v1';
const ME = '00000000-0000-4000-8000-00000000d3e0';
const minutes = (n) => new Date(Date.now() - n * 60000).toISOString();
const uuid = () => (globalThis.crypto?.randomUUID ? crypto.randomUUID() : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`);

function seed() {
  const people = [
    { user_id: 'a1', handle: 'mintra_vet', display_name: 'มินตรา', avatar: '🐮', tone: 'cobalt', school: 'จุฬาฯ', cohort: 'Vet 85', target_round: '2/2569', bio: 'ซ้อมวันละ 50 ข้อ เน้นสัตว์ใหญ่', stats: { answered: 1240, accuracy: 74, streak: 12 } },
    { user_id: 'a2', handle: 'ploy_k', display_name: 'พลอย', avatar: '🐱', tone: 'plum', school: 'เกษตรฯ', cohort: 'KU 79', target_round: '2/2569', bio: '', stats: {} },
    { user_id: 'a3', handle: 'tanakorn', display_name: 'ธนกร', avatar: '🐴', tone: 'brass', school: 'ขอนแก่น', cohort: '', target_round: '1/2570', bio: 'รักม้า', stats: { answered: 380, accuracy: 68, streak: 3 } },
  ].map((p) => ({ ...p, from_vetmock: false, created_at: minutes(60 * 24 * 20) }));
  const posts = [
    { id: uuid(), author_id: 'a1', kind: 'question', domain: 'ruminant', question_no: null, title: 'Milk fever กับ grass tetany แยกจากอาการยังไงให้เร็ว', body: 'สองโรคนี้ชักเหมือนกัน เจอในข้อสอบปีที่แล้ว ตอนนั้นตอบผิดเพราะดูแค่ช่วงหลังคลอด มีหลักจำง่าย ๆ ไหมครับ', comment_count: 2, like_count: 5, created_at: minutes(180), last_activity_at: minutes(25) },
    { id: uuid(), author_id: 'a2', kind: 'tip', domain: 'zoonoses', question_no: null, title: 'ตารางโรคสัตว์สู่คนที่ออกบ่อย สรุปไว้หน้าเดียว', body: 'รวม host ทางติดต่อ และอาการในคน ของโรคที่ออกสอบซ้ำหลายปี เช่น leptospirosis, brucellosis, rabies, Q fever แปะไว้ให้ทบทวนก่อนนอน', comment_count: 0, like_count: 11, created_at: minutes(60 * 26), last_activity_at: minutes(60 * 26) },
    { id: uuid(), author_id: 'a3', kind: 'experience', domain: null, question_no: null, title: 'เล่าห้องสอบรอบ 1/2569 สำหรับคนสอบรอบหน้า', body: 'หมวด 2 เวลาพอดี ๆ ข้อยาวเยอะ แนะนำให้ซ้อมจับเวลา 54 วินาทีต่อข้อ ส่วนหมวด 3 ภาพประกอบเยอะกว่าที่คิด', comment_count: 1, like_count: 8, created_at: minutes(60 * 50), last_activity_at: minutes(60 * 30) },
  ].map((p) => ({ ...p, hidden: false, edited_at: null }));
  const comments = [
    { id: uuid(), post_id: posts[0].id, author_id: 'a3', parent_id: null, body: 'Milk fever เป็นโคนมหลังคลอดไม่กี่วัน แคลเซียมต่ำ ยืนไม่ขึ้น S-shaped neck ส่วน grass tetany แมกนีเซียมต่ำ เจอตอนกินหญ้าอ่อน ตื่นเต้นไวต่อเสียงแล้วชัก', like_count: 3, created_at: minutes(40) },
    { id: uuid(), post_id: posts[0].id, author_id: 'a2', parent_id: null, body: 'จำว่า Mg ต่ำ = ตื่นเต้น ชัก, Ca ต่ำ = อ่อนแรง นอน ช่วยได้มากค่ะ', like_count: 1, created_at: minutes(25) },
    { id: uuid(), post_id: posts[2].id, author_id: 'a1', parent_id: null, body: 'ขอบคุณที่เล่าครับ เรื่องภาพในหมวด 3 นี่ต้องเตรียมตัวเลย', like_count: 0, created_at: minutes(60 * 30) },
  ].map((c) => ({ ...c, hidden: false, edited_at: null }));
  const rooms = ['lobby', 'bio', 'species', 'clinic', 'public'].map((slug, i) => ({ id: `room-${slug}`, kind: 'open', slug, last_message_at: i === 0 ? minutes(8) : i === 2 ? minutes(90) : null }));
  let n = 1;
  const messages = [
    { room_id: 'room-lobby', author_id: 'a1', body: 'ใครสอบรอบ 2/2569 บ้าง มาติวกันในนี้ได้นะ', created_at: minutes(60 * 3) },
    { room_id: 'room-lobby', author_id: 'a2', body: 'สอบค่า ตอนนี้ไล่ทำทีละหมวดอยู่', created_at: minutes(60 * 2.9) },
    { room_id: 'room-lobby', author_id: 'a3', body: 'ผมด้วยครับ อ่อนสัตว์ปีกมาก', created_at: minutes(9) },
    { room_id: 'room-lobby', author_id: 'a1', body: 'ไปห้องคลินิกตามชนิดสัตว์ มีคนสรุป Newcastle ไว้', created_at: minutes(8) },
    { room_id: 'room-species', author_id: 'a2', body: 'ND กับ AI แยกจากรอยโรคที่ proventriculus ได้ไหม', created_at: minutes(90) },
  ].map((m) => ({ id: n++, reply_to: null, hidden: false, edited_at: null, ...m }));
  return { people, posts, comments, likes: [], rooms, members: [], messages, blocks: [], reports: [], session: null, nextId: n };
}

let db = null;
function load() {
  if (db) return db;
  try { db = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch { db = null; }
  if (!db) db = seed();
  return db;
}
function save() { try { sessionStorage.setItem(KEY, JSON.stringify(db)); } catch { /* the tab keeps it */ } }

const authListeners = new Set();
const roomListeners = new Map();
const postListeners = new Map();
const tick = () => new Promise((r) => setTimeout(r, 120));
const person = (id) => load().people.find((p) => p.user_id === id) || null;
const withAuthor = (row) => ({ ...row, author: person(row.author_id) });
const me = () => load().session?.user?.id || null;

function signIn() {
  const d = load();
  d.session = { user: { id: ME, email: 'demo@vca.local', name: 'นิสิตทดลอง' } };
  save();
  for (const l of authListeners) l(d.session);
}

export const auth = {
  async session() { await tick(); return load().session; },
  onChange(cb) { authListeners.add(cb); return () => authListeners.delete(cb); },
  async google() { await tick(); signIn(); },
  async line() { await tick(); signIn(); },
  async email() { await tick(); signIn(); return { sent: false, signedIn: true }; },
  async complete() { return load().session; },
  async signOut() { const d = load(); d.session = null; save(); for (const l of authListeners) l(null); },
};

export const profiles = {
  async mine() { await tick(); return toProfile(person(me())); },
  async byHandle(handle) { await tick(); return toProfile(load().people.find((p) => p.handle === handle)); },
  async byIds(ids) { return load().people.filter((p) => ids.includes(p.user_id)).map(toProfile); },
  async taken(handle) { return load().people.some((p) => p.handle === handle && p.user_id !== me()); },
  async save(profile, { create }) {
    await tick();
    const d = load();
    const row = { ...fromProfile(profile), user_id: me() };
    if (d.people.some((p) => p.handle === row.handle && p.user_id !== me())) throw new Error('ชื่อผู้ใช้นี้มีคนใช้แล้ว');
    if (create) d.people.push({ ...row, created_at: new Date().toISOString() });
    else Object.assign(person(me()), row);
    save();
    return toProfile(person(me()));
  },
  async snapshot() { await tick(); return { username: 'demo_student', avatar: '🐶', answered: 320, correct: 240, streak: 4 }; },
  async isModerator() { return false; },
};

function sortPosts(rows) { return rows.sort((a, b) => new Date(b.last_activity_at) - new Date(a.last_activity_at)); }

export const board = {
  async list({ kind, domain, questionNo, authorId, before, limit = 20 } = {}) {
    await tick();
    let rows = sortPosts(load().posts.filter((p) => !p.hidden || p.author_id === me()));
    if (kind) rows = rows.filter((p) => p.kind === kind);
    if (domain) rows = rows.filter((p) => p.domain === domain);
    if (questionNo) rows = rows.filter((p) => p.question_no === Number(questionNo));
    if (authorId) rows = rows.filter((p) => p.author_id === authorId);
    if (before) rows = rows.filter((p) => p.last_activity_at < before);
    const posts = rows.slice(0, limit).map(withAuthor).map(toPost);
    return { posts, next: rows.length > limit ? posts[posts.length - 1].activeAt : null };
  },
  async get(id) { await tick(); const p = load().posts.find((x) => x.id === id); return p ? toPost(withAuthor(p)) : null; },
  async create(f) {
    await tick();
    if (!person(me())) throw new Error('ตั้งโปรไฟล์ก่อน');
    const now = new Date().toISOString();
    const row = { id: uuid(), author_id: me(), kind: f.kind, domain: f.domain || null, question_no: f.questionNo ? Number(f.questionNo) : null, title: String(f.title).trim(), body: String(f.body).trim(), comment_count: 0, like_count: 0, hidden: false, created_at: now, edited_at: null, last_activity_at: now };
    load().posts.push(row); save();
    return toPost(withAuthor(row));
  },
  async update(id, f) {
    await tick();
    const p = load().posts.find((x) => x.id === id && x.author_id === me());
    if (!p) throw new Error('แก้ไม่ได้');
    Object.assign(p, { kind: f.kind, domain: f.domain || null, question_no: f.questionNo ? Number(f.questionNo) : null, title: String(f.title).trim(), body: String(f.body).trim(), edited_at: new Date().toISOString() });
    save();
    return toPost(withAuthor(p));
  },
  async remove(id) { const d = load(); d.posts = d.posts.filter((p) => !(p.id === id && p.author_id === me())); save(); },
  async comments(postId) { await tick(); return load().comments.filter((c) => c.post_id === postId && (!c.hidden || c.author_id === me())).sort((a, b) => a.created_at.localeCompare(b.created_at)).map(withAuthor).map(toComment); },
  async comment(postId, body, parentId = null) {
    await tick();
    const d = load();
    if (!person(me())) throw new Error('ตั้งโปรไฟล์ก่อน');
    const row = { id: uuid(), post_id: postId, author_id: me(), parent_id: parentId, body: String(body).trim(), like_count: 0, hidden: false, created_at: new Date().toISOString(), edited_at: null };
    d.comments.push(row);
    const p = d.posts.find((x) => x.id === postId);
    if (p) { p.comment_count += 1; p.last_activity_at = row.created_at; }
    save();
    for (const l of postListeners.get(postId) || []) l();
    return toComment(withAuthor(row));
  },
  async removeComment(id) {
    const d = load();
    const c = d.comments.find((x) => x.id === id && x.author_id === me());
    if (!c) return;
    d.comments = d.comments.filter((x) => x.id !== id);
    const p = d.posts.find((x) => x.id === c.post_id);
    if (p) p.comment_count = Math.max(0, p.comment_count - 1);
    save();
  },
  async like(target, id, on) {
    const d = load();
    const key = target === 'post' ? 'post_id' : 'comment_id';
    const had = d.likes.some((l) => l[key] === id && l.user_id === me());
    if (on === had) return;
    if (on) d.likes.push({ [key]: id, user_id: me() });
    else d.likes = d.likes.filter((l) => !(l[key] === id && l.user_id === me()));
    const row = (target === 'post' ? d.posts : d.comments).find((x) => x.id === id);
    if (row) row.like_count = Math.max(0, row.like_count + (on ? 1 : -1));
    save();
  },
  async myLikes({ posts = [], comments = [] }) {
    const out = new Set();
    for (const l of load().likes) {
      if (l.user_id !== me()) continue;
      if (posts.includes(l.post_id)) out.add(l.post_id);
      if (comments.includes(l.comment_id)) out.add(l.comment_id);
    }
    return out;
  },
  async report(target, id, reason, note) { await tick(); load().reports.push({ target, id, reason, note, reporter: me() }); save(); },
  watchComments(postId, onChange) {
    const set = postListeners.get(postId) || new Set();
    set.add(onChange); postListeners.set(postId, set);
    return () => set.delete(onChange);
  },
};

export const chat = {
  async rooms() {
    await tick();
    const d = load();
    return d.rooms.filter((r) => r.kind === 'open' || d.members.some((m) => m.room_id === r.id && m.user_id === me())).map((r) => {
      const seat = d.members.find((m) => m.room_id === r.id && m.user_id === me());
      const other = r.kind === 'direct' ? d.members.find((m) => m.room_id === r.id && m.user_id !== me()) : null;
      return {
        id: r.id, kind: r.kind, slug: r.slug, lastMessageAt: r.last_message_at, lastReadAt: seat?.last_read_at || null,
        unread: !!r.last_message_at && (!seat || r.last_message_at > seat.last_read_at),
        other: other ? toProfile(person(other.user_id)) : null,
      };
    });
  },
  async messages(roomId, { before, limit = 50 } = {}) {
    await tick();
    let rows = load().messages.filter((m) => m.room_id === roomId && (!m.hidden || m.author_id === me()));
    if (before) rows = rows.filter((m) => m.id < before);
    return rows.slice(-limit).map(toMessage);
  },
  async send(roomId, body, replyTo = null) {
    const d = load();
    if (!person(me())) throw new Error('ตั้งโปรไฟล์ก่อน');
    const row = { id: d.nextId++, room_id: roomId, author_id: me(), body: String(body).trim(), reply_to: replyTo, hidden: false, created_at: new Date().toISOString(), edited_at: null };
    d.messages.push(row);
    const r = d.rooms.find((x) => x.id === roomId);
    if (r) r.last_message_at = row.created_at;
    const seat = d.members.find((m) => m.room_id === roomId && m.user_id === me());
    if (seat) seat.last_read_at = row.created_at; else d.members.push({ room_id: roomId, user_id: me(), last_read_at: row.created_at });
    save();
    const message = toMessage(row);
    for (const l of roomListeners.get(roomId) || []) l({ type: 'insert', message });
    return message;
  },
  async remove(id) {
    const d = load();
    const m = d.messages.find((x) => x.id === id && x.author_id === me());
    if (!m) return;
    d.messages = d.messages.filter((x) => x.id !== id); save();
    for (const l of roomListeners.get(m.room_id) || []) l({ type: 'delete', message: toMessage(m) });
  },
  async markRead(roomId) {
    const d = load();
    const now = new Date().toISOString();
    const seat = d.members.find((m) => m.room_id === roomId && m.user_id === me());
    if (seat) seat.last_read_at = now; else d.members.push({ room_id: roomId, user_id: me(), last_read_at: now });
    save();
  },
  async openDirect(userId) {
    const d = load();
    const mine = d.members.filter((m) => m.user_id === me()).map((m) => m.room_id);
    const found = d.rooms.find((r) => r.kind === 'direct' && mine.includes(r.id) && d.members.some((m) => m.room_id === r.id && m.user_id === userId));
    if (found) return found.id;
    const id = `dm-${uuid()}`;
    d.rooms.push({ id, kind: 'direct', slug: null, last_message_at: null });
    d.members.push({ room_id: id, user_id: me(), last_read_at: new Date().toISOString() }, { room_id: id, user_id: userId, last_read_at: new Date().toISOString() });
    save();
    return id;
  },
  watch(roomId, onEvent) {
    const set = roomListeners.get(roomId) || new Set();
    set.add(onEvent); roomListeners.set(roomId, set);
    return () => set.delete(onEvent);
  },
};

export const safety = {
  async blocked() { return new Set(load().blocks.filter((b) => b.blocker === me()).map((b) => b.blocked)); },
  async block(userId) { load().blocks.push({ blocker: me(), blocked: userId }); save(); },
  async unblock(userId) { const d = load(); d.blocks = d.blocks.filter((b) => !(b.blocker === me() && b.blocked === userId)); save(); },
  async moderate() { throw new Error('เฉพาะผู้ดูแล'); },
};
