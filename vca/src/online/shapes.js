// The community's vocabulary and the shapes both backends hand the pages, in plain functions the
// unit tests can hold (tests/unit/community.test.mjs). Rows from the database arrive in
// snake_case; the pages only ever see what these return.

export const HANDLE = /^[a-z0-9][a-z0-9_]{2,19}$/;
export const RESERVED_HANDLES = new Set(['admin', 'admins', 'moderator', 'mod', 'mods', 'vetmock', 'vca', 'support', 'help', 'system', 'staff', 'official', 'root', 'null', 'me', 'new']);

/** Why a handle cannot be used, or null when it can (the database says the same). */
export function handleProblem(handle) {
  const h = String(handle || '');
  if (!h) return 'ตั้งชื่อผู้ใช้ก่อน';
  if (h.length < 3) return 'อย่างน้อย 3 ตัว';
  if (h.length > 20) return 'ไม่เกิน 20 ตัว';
  if (!HANDLE.test(h)) return 'ใช้ a-z ตัวเลข และ _ ขึ้นต้นด้วยตัวอักษรหรือตัวเลข';
  if (RESERVED_HANDLES.has(h) || h.startsWith('vetmock') || h.startsWith('admin')) return 'ชื่อนี้สงวนไว้';
  return null;
}

/** A handle suggested from a name or an email, for the profile form to start from. */
export function suggestHandle(...seeds) {
  for (const seed of seeds) {
    const base = String(seed || '').split('@')[0].toLowerCase().normalize('NFKD').replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '').replace(/_{2,}/g, '_').slice(0, 20);
    if (base.length >= 3 && !handleProblem(base)) return base;
  }
  return '';
}

export const KINDS = [
  { id: 'question', label: 'ถามข้อสอบ' },
  { id: 'tip', label: 'เทคนิคและสรุป' },
  { id: 'experience', label: 'ประสบการณ์สอบ' },
  { id: 'general', label: 'ทั่วไป' },
];
export const KIND_LABEL = Object.fromEntries(KINDS.map((k) => [k.id, k.label]));

export const REPORT_REASONS = [
  { id: 'spam', label: 'สแปมหรือโฆษณา' },
  { id: 'rude', label: 'ไม่สุภาพหรือคุกคาม' },
  { id: 'wrong', label: 'ข้อมูลผิดที่อาจทำให้เข้าใจผิด' },
  { id: 'leak', label: 'ข้อมูลส่วนตัวหรือสิ่งที่ไม่ควรเผยแพร่' },
  { id: 'other', label: 'อื่น ๆ' },
];

export const TONES = ['verd', 'brass', 'cinn', 'cobalt', 'plum', 'ink'];
export const AVATARS = ['🐾', '🐶', '🐱', '🐮', '🐷', '🐴', '🐔', '🐟', '🦜', '🐢', '🐑', '🐐', '🐇', '🦎', '🐝', '🦉'];

/** The open rooms, in the order the chat lists them, with what each is for. */
export const OPEN_ROOMS = [
  { slug: 'lobby', name: 'ห้องรวม', about: 'คุยได้ทุกเรื่องเกี่ยวกับการสอบ' },
  { slug: 'bio', name: 'พื้นฐานทางสัตวแพทย์', about: 'กายวิภาค เภสัช พยาธิ จุลชีวะ' },
  { slug: 'species', name: 'คลินิกตามชนิดสัตว์', about: 'สุนัขแมว สัตว์ใหญ่ สัตว์ปีก สัตว์น้ำ' },
  { slug: 'clinic', name: 'สาขาคลินิก', about: 'สืบพันธุ์ ศัลย์ รังสี' },
  { slug: 'public', name: 'สาธารณสุขและวิชาชีพ', about: 'อาหาร โรคสัตว์สู่คน ระบาด กฎหมาย' },
];
export const ROOM_BY_SLUG = Object.fromEntries(OPEN_ROOMS.map((r) => [r.slug, r]));

export const toProfile = (r) => (r ? {
  id: r.user_id,
  handle: r.handle,
  name: r.display_name,
  avatar: r.avatar || '🐾',
  tone: TONES.includes(r.tone) ? r.tone : 'verd',
  school: r.school || '',
  cohort: r.cohort || '',
  round: r.target_round || '',
  bio: r.bio || '',
  stats: r.stats && typeof r.stats === 'object' ? r.stats : {},
  fromVetmock: !!r.from_vetmock,
  createdAt: r.created_at,
} : null);

/** A profile form's fields as the database columns they fill. */
export const fromProfile = (p) => ({
  handle: p.handle,
  display_name: String(p.name || '').trim(),
  avatar: p.avatar || '🐾',
  tone: p.tone || 'verd',
  school: p.school?.trim() || null,
  cohort: p.cohort?.trim() || null,
  target_round: p.round || null,
  bio: p.bio?.trim() || null,
  stats: p.stats || {},
  from_vetmock: !!p.fromVetmock,
});

export const toPost = (r) => ({
  id: r.id,
  author: toProfile(r.author) || { id: r.author_id, handle: '', name: 'ผู้ใช้', avatar: '🐾', tone: 'ink' },
  kind: r.kind,
  domain: r.domain || null,
  questionNo: r.question_no || null,
  title: r.title,
  body: r.body,
  comments: r.comment_count || 0,
  likes: r.like_count || 0,
  hidden: !!r.hidden,
  createdAt: r.created_at,
  editedAt: r.edited_at || null,
  activeAt: r.last_activity_at || r.created_at,
});

export const toComment = (r) => ({
  id: r.id,
  postId: r.post_id,
  parentId: r.parent_id || null,
  author: toProfile(r.author) || { id: r.author_id, handle: '', name: 'ผู้ใช้', avatar: '🐾', tone: 'ink' },
  body: r.body,
  likes: r.like_count || 0,
  hidden: !!r.hidden,
  createdAt: r.created_at,
  editedAt: r.edited_at || null,
});

export const toMessage = (r) => ({
  id: r.id,
  roomId: r.room_id,
  authorId: r.author_id,
  body: r.body,
  replyTo: r.reply_to || null,
  hidden: !!r.hidden,
  createdAt: r.created_at,
  editedAt: r.edited_at || null,
});

/** The first lines of a post, for the feed: whole words, no more than `max` characters. */
export function excerpt(text, max = 160) {
  const flat = String(text || '').replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trim()}…`;
}

/**
 * When something happened, the way a person says it: "เมื่อสักครู่", "5 นาทีที่แล้ว",
 * "3 ชั่วโมงที่แล้ว", "เมื่อวาน", then the date.
 */
export function ago(iso, now = Date.now()) {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '';
  const s = Math.max(0, Math.round((now - t) / 1000));
  if (s < 60) return 'เมื่อสักครู่';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} นาทีที่แล้ว`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ชั่วโมงที่แล้ว`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'เมื่อวาน';
  if (d < 7) return `${d} วันที่แล้ว`;
  return new Date(t).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: d > 300 ? '2-digit' : undefined, timeZone: 'Asia/Bangkok' });
}

/** A message's clock time, Bangkok. */
export const clockOf = (iso) => new Date(iso).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' });

/** The day a run of messages belongs to, for the dividers in a thread. */
export function dayOf(iso, now = Date.now()) {
  const day = (t) => new Date(t).toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
  const d = day(iso);
  if (d === day(now)) return 'วันนี้';
  if (d === day(now - 86400000)) return 'เมื่อวาน';
  return new Date(iso).toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Bangkok' });
}

/**
 * Messages in runs: one author's consecutive messages within five minutes sit together under
 * one name, and a new day starts a new run behind a divider.
 * @param {ReturnType<typeof toMessage>[]} messages oldest first
 */
export function groupMessages(messages, now = Date.now()) {
  const out = [];
  let last = null;
  for (const m of messages) {
    const day = dayOf(m.createdAt, now);
    const t = new Date(m.createdAt).getTime();
    if (!last || last.day !== day) out.push({ divider: day, key: `d-${day}-${m.id}` });
    const prev = out[out.length - 1];
    if (prev?.messages && prev.authorId === m.authorId && t - prev.lastAt < 5 * 60 * 1000) {
      prev.messages.push(m);
      prev.lastAt = t;
    } else {
      out.push({ key: `g-${m.id}`, authorId: m.authorId, messages: [m], lastAt: t });
    }
    last = { day };
  }
  return out;
}

/** What went wrong, in words a student can act on, from a backend error. */
const PROBLEMS = [
  [/too many posts/i, 'ตั้งกระทู้ถี่เกินไป พักสักครู่แล้วลองใหม่'],
  [/too many comments/i, 'ตอบถี่เกินไป พักสักครู่แล้วลองใหม่'],
  [/too many messages/i, 'ส่งข้อความถี่เกินไป รอสักครู่'],
  [/too many reports/i, 'วันนี้รายงานครบจำนวนแล้ว ขอบคุณที่ช่วยดูแล'],
  [/too many new conversations/i, 'วันนี้เริ่มแชทใหม่ครบจำนวนแล้ว'],
  [/make a profile first/i, 'ตั้งโปรไฟล์ก่อน'],
  [/not available|blocked/i, 'ส่งถึงคนนี้ไม่ได้'],
  [/handle is reserved/i, 'ชื่อนี้สงวนไว้'],
  [/duplicate|unique/i, 'ชื่อผู้ใช้นี้มีคนใช้แล้ว'],
  [/failed to fetch|network|load failed/i, 'เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่'],
  [/jwt|not authenticated|permission denied|row-level security|42501/i, 'เข้าสู่ระบบใหม่อีกครั้งแล้วลองใหม่'],
  [/check constraint|22001|23514/i, 'ข้อความสั้นหรือยาวเกินไป'],
];
export function problemText(err) {
  const text = `${err?.message || ''} ${err?.code || ''}`;
  for (const [re, says] of PROBLEMS) if (re.test(text)) return says;
  return 'ทำรายการไม่สำเร็จ ลองอีกครั้ง';
}

/** Stats a student chose to show, from this device's practice record. */
export function statsFrom({ seen = 0, correct = 0, streak = 0, mocks = 0 } = {}) {
  return { answered: seen, accuracy: seen ? Math.round((correct / seen) * 100) : null, streak, mocks };
}
