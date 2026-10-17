// The community on the shared VetMock backend: the account is VetMock's (one Supabase project),
// the rows are the vca schema's (supabase/migrations/20261017120000_vca_community.sql), and the
// policies there decide who may read and write what. This module only asks.

import { CALLBACK_PATH, LINE_LIFF_ID, SUPABASE_URL } from './config.js';
import { anonHeaders, functionUrl, getClient } from './client.js';
import { fromMedia, fromProfile, toComment, toMessage, toPost, toProfile } from './shapes.js';
import { randomName } from './media.js';

const AUTHOR = 'author:profiles(user_id, handle, display_name, avatar, tone, photo)';
const POST_COLUMNS = `id, author_id, kind, domain, question_no, title, body, media, comment_count, like_count, hidden, created_at, edited_at, last_activity_at, ${AUTHOR}`;
const COMMENT_COLUMNS = `id, post_id, author_id, parent_id, body, media, like_count, hidden, created_at, edited_at, ${AUTHOR}`;
const MESSAGE_COLUMNS = 'id, room_id, author_id, body, media, reply_to, hidden, created_at, edited_at';

const callback = () => `${window.location.origin}${CALLBACK_PATH}`;

/** Supabase answers with { data, error }; the pages want the data or a thrown, readable error. */
async function must(promise) {
  const { data, error } = await promise;
  if (error) throw Object.assign(new Error(error.message || 'ทำรายการไม่สำเร็จ'), { code: error.code, cause: error });
  return data;
}

async function uid() {
  const sb = await getClient();
  const { data } = await sb.auth.getSession();
  return data.session?.user?.id || null;
}

export const auth = {
  async session() {
    const sb = await getClient();
    const { data } = await sb.auth.getSession();
    const u = data.session?.user;
    return u ? { user: { id: u.id, email: u.email || '', name: u.user_metadata?.full_name || u.user_metadata?.name || u.user_metadata?.line_name || '' } } : null;
  },
  onChange(cb) {
    let unsubscribe = () => {};
    getClient().then((sb) => {
      const { data } = sb.auth.onAuthStateChange(() => { auth.session().then(cb); });
      unsubscribe = () => data.subscription.unsubscribe();
    });
    return () => unsubscribe();
  },
  async google() {
    const sb = await getClient();
    await must(sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: callback(), queryParams: { prompt: 'select_account' } } }));
  },
  /** Google Identity Services handed back an ID token (online/gis.js): trade it for a session. */
  async googleIdToken(token, nonce) {
    const sb = await getClient();
    await must(sb.auth.signInWithIdToken({ provider: 'google', token, nonce }));
  },
  async email(address) {
    const sb = await getClient();
    await must(sb.auth.signInWithOtp({ email: address, options: { emailRedirectTo: callback(), shouldCreateUser: true } }));
    return { sent: true };
  },
  /** LINE: LIFF signs the student in with LINE and hands back an ID token, which VetMock's
   *  line-auth function turns into a one-time sign-in link for the same account. */
  async line() {
    if (!LINE_LIFF_ID) throw new Error('ยังเข้าสู่ระบบด้วย LINE บนเว็บนี้ไม่ได้');
    const { lineIdToken } = await import('./line.js');
    const token = await lineIdToken(LINE_LIFF_ID, `${window.location.origin}/auth/line`);
    if (!token) return; // LIFF went to LINE to sign in; it comes back to /auth/line
    const res = await fetch(functionUrl('line-auth'), { method: 'POST', headers: anonHeaders(), body: JSON.stringify({ id_token: token, redirect_to: callback() }) });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.action_link) throw new Error(body.error || 'เข้าสู่ระบบด้วย LINE ไม่สำเร็จ');
    window.location.assign(body.action_link);
  },
  /** Finish a sign-in that came back to the callback page: a session in the address, or why not. */
  async complete(url) {
    const sb = await getClient();
    const u = new URL(url);
    const hash = new URLSearchParams(u.hash.replace(/^#/, ''));
    const problem = u.searchParams.get('error_description') || hash.get('error_description');
    if (problem) throw new Error(problem);
    if (hash.get('access_token') && hash.get('refresh_token')) {
      await must(sb.auth.setSession({ access_token: hash.get('access_token'), refresh_token: hash.get('refresh_token') }));
    } else if (u.searchParams.get('code')) {
      await must(sb.auth.exchangeCodeForSession(u.searchParams.get('code')));
    }
    return auth.session();
  },
  async signOut() {
    const sb = await getClient();
    // This device only: the account is shared with vetmock.com, and the default (global) revokes
    // every refresh token, which signed the student out of VetMock on all their devices.
    await sb.auth.signOut({ scope: 'local' });
  },
};

export const profiles = {
  async mine() {
    const id = await uid();
    if (!id) return null;
    const sb = await getClient();
    return toProfile(await must(sb.from('profiles').select('*').eq('user_id', id).maybeSingle()));
  },
  async byHandle(handle) {
    const sb = await getClient();
    return toProfile(await must(sb.from('profiles').select('*').eq('handle', handle).maybeSingle()));
  },
  async byIds(ids) {
    if (!ids.length) return [];
    const sb = await getClient();
    return (await must(sb.from('profiles').select('*').in('user_id', ids))).map(toProfile);
  },
  async taken(handle) {
    const sb = await getClient();
    const rows = await must(sb.from('profiles').select('user_id').eq('handle', handle).limit(1));
    const me = await uid();
    return rows.some((r) => r.user_id !== me);
  },
  async save(profile, { create }) {
    const sb = await getClient();
    const row = fromProfile(profile);
    if (create) return toProfile(await must(sb.from('profiles').insert(row).select('*').single()));
    const id = await uid();
    return toProfile(await must(sb.from('profiles').update(row).eq('user_id', id).select('*').single()));
  },
  async snapshot() {
    const sb = await getClient();
    return (await must(sb.rpc('vetmock_snapshot'))) || null;
  },
  async isModerator() {
    const sb = await getClient();
    return !!(await must(sb.rpc('is_moderator')));
  },
};

export const board = {
  async list({ kind, domain, questionNo, authorId, before, limit = 20 } = {}) {
    const sb = await getClient();
    let q = sb.from('posts').select(POST_COLUMNS).order('last_activity_at', { ascending: false }).limit(limit + 1);
    if (kind) q = q.eq('kind', kind);
    if (domain) q = q.eq('domain', domain);
    if (questionNo) q = q.eq('question_no', questionNo);
    if (authorId) q = q.eq('author_id', authorId);
    if (before) q = q.lt('last_activity_at', before);
    const rows = (await must(q)).map(toPost);
    const more = rows.length > limit;
    const posts = rows.slice(0, limit);
    return { posts, next: more ? posts[posts.length - 1].activeAt : null };
  },
  async get(id) {
    const sb = await getClient();
    const row = await must(sb.from('posts').select(POST_COLUMNS).eq('id', id).maybeSingle());
    return row ? toPost(row) : null;
  },
  async create(fields) {
    const sb = await getClient();
    return toPost(await must(sb.from('posts').insert(postRow(fields)).select(POST_COLUMNS).single()));
  },
  async update(id, fields) {
    const sb = await getClient();
    return toPost(await must(sb.from('posts').update(postRow(fields)).eq('id', id).select(POST_COLUMNS).single()));
  },
  async remove(id) {
    const sb = await getClient();
    await must(sb.from('posts').delete().eq('id', id));
  },
  async comments(postId) {
    const sb = await getClient();
    return (await must(sb.from('comments').select(COMMENT_COLUMNS).eq('post_id', postId).order('created_at'))).map(toComment);
  },
  async comment(postId, body, parentId = null, media = []) {
    const sb = await getClient();
    return toComment(await must(sb.from('comments').insert({ post_id: postId, parent_id: parentId, body, media: fromMedia(media) }).select(COMMENT_COLUMNS).single()));
  },
  async removeComment(id) {
    const sb = await getClient();
    await must(sb.from('comments').delete().eq('id', id));
  },
  async like(target, id, on) {
    const sb = await getClient();
    const column = target === 'post' ? 'post_id' : 'comment_id';
    if (on) {
      const { error } = await sb.from('likes').insert({ [column]: id });
      if (error && error.code !== '23505') throw new Error(error.message);
    } else {
      const me = await uid();
      await must(sb.from('likes').delete().eq(column, id).eq('user_id', me));
    }
  },
  async myLikes({ posts = [], comments = [] }) {
    const me = await uid();
    if (!me || (!posts.length && !comments.length)) return new Set();
    const sb = await getClient();
    const out = new Set();
    if (posts.length) for (const r of await must(sb.from('likes').select('post_id').eq('user_id', me).in('post_id', posts))) out.add(r.post_id);
    if (comments.length) for (const r of await must(sb.from('likes').select('comment_id').eq('user_id', me).in('comment_id', comments))) out.add(r.comment_id);
    return out;
  },
  async report(target, id, reason, note) {
    const sb = await getClient();
    const { error } = await sb.from('reports').insert({ [`${target}_id`]: id, reason, note: note || null });
    if (error && error.code !== '23505') throw new Error(error.message);
  },
  watchComments(postId, onChange) {
    let channel = null;
    getClient().then((sb) => {
      channel = sb.channel(`vca-post-${postId}`)
        .on('postgres_changes', { event: '*', schema: 'vca', table: 'comments', filter: `post_id=eq.${postId}` }, () => onChange())
        .subscribe();
    });
    return () => { channel?.unsubscribe(); };
  },
};

function postRow(f) {
  return {
    kind: f.kind, domain: f.domain || null, question_no: f.questionNo ? Number(f.questionNo) : null,
    title: String(f.title).trim(), body: String(f.body).trim(),
    ...(f.media ? { media: fromMedia(f.media) } : {}),
  };
}

export const chat = {
  async rooms() {
    const sb = await getClient();
    const me = await uid();
    const rooms = await must(sb.from('rooms').select('id, kind, slug, last_message_at'));
    const seats = me ? await must(sb.from('room_members').select('room_id, user_id, last_read_at')) : [];
    const mine = new Map(seats.filter((s) => s.user_id === me).map((s) => [s.room_id, s.last_read_at]));
    const others = new Map(seats.filter((s) => s.user_id !== me).map((s) => [s.room_id, s.user_id]));
    const people = new Map((await profiles.byIds([...new Set(others.values())])).map((p) => [p.id, p]));
    return rooms.map((r) => {
      const lastRead = mine.get(r.id) || null;
      return {
        id: r.id, kind: r.kind, slug: r.slug, lastMessageAt: r.last_message_at, lastReadAt: lastRead,
        unread: !!r.last_message_at && (!lastRead || new Date(r.last_message_at) > new Date(lastRead)),
        other: r.kind === 'direct' ? people.get(others.get(r.id)) || null : null,
      };
    });
  },
  async messages(roomId, { before, limit = 50 } = {}) {
    const sb = await getClient();
    let q = sb.from('messages').select(MESSAGE_COLUMNS).eq('room_id', roomId).order('id', { ascending: false }).limit(limit);
    if (before) q = q.lt('id', before);
    return (await must(q)).map(toMessage).reverse();
  },
  async send(roomId, body, replyTo = null, media = []) {
    const sb = await getClient();
    return toMessage(await must(sb.from('messages').insert({ room_id: roomId, body, reply_to: replyTo, media: fromMedia(media) }).select(MESSAGE_COLUMNS).single()));
  },
  async remove(id) {
    const sb = await getClient();
    await must(sb.from('messages').delete().eq('id', id));
  },
  async markRead(roomId) {
    const sb = await getClient();
    await must(sb.rpc('mark_read', { room: roomId }));
  },
  async openDirect(userId) {
    const sb = await getClient();
    return must(sb.rpc('open_direct', { other: userId }));
  },
  watch(roomId, onEvent) {
    let channel = null;
    getClient().then((sb) => {
      channel = sb.channel(`vca-room-${roomId}`)
        .on('postgres_changes', { event: '*', schema: 'vca', table: 'messages', filter: `room_id=eq.${roomId}` }, (p) => {
          onEvent({ type: p.eventType.toLowerCase(), message: toMessage(p.new && p.new.id ? p.new : p.old) });
        })
        .subscribe();
    });
    return () => { channel?.unsubscribe(); };
  },
};

export const safety = {
  async blocked() {
    const sb = await getClient();
    return new Set((await must(sb.from('blocks').select('blocked_id'))).map((r) => r.blocked_id));
  },
  async block(userId) {
    const sb = await getClient();
    const { error } = await sb.from('blocks').insert({ blocked_id: userId });
    if (error && error.code !== '23505') throw new Error(error.message);
  },
  async unblock(userId) {
    const sb = await getClient();
    const me = await uid();
    await must(sb.from('blocks').delete().eq('blocker_id', me).eq('blocked_id', userId));
  },
  async moderate(target, id, action) {
    const sb = await getClient();
    await must(sb.rpc('moderate', { target, target_id: String(id), action }));
  },
};

// Files on Supabase Storage (20261018090100_vca_media_storage.sql): public pictures and video in
// vca-media, a direct room's in vca-private, each under the uploader's own folder.
const PUBLIC_BUCKET = 'vca-media';
const PRIVATE_BUCKET = 'vca-private';
const isPrivate = (path) => /^[0-9a-f-]{36}\/dm\//.test(path);
const signed = new Map();

export const media = {
  /**
   * Send one prepared file (online/media.js) and get back the path a row points at.
   * @param {'avatar'|'post'|'comment'|'chat'} kind
   * @param {{ blob: Blob, ext: string, type: string }} file
   * @param {{ room?: string|null, name?: string }} [where] room: a direct room's id
   */
  async upload(kind, file, { room = null, name = randomName() } = {}) {
    const me = await uid();
    if (!me) throw new Error('not authenticated');
    const sb = await getClient();
    const path = room ? `${me}/dm/${room}/${name}.${file.ext}` : `${me}/${kind}/${name}.${file.ext}`;
    const { error } = await sb.storage.from(room ? PRIVATE_BUCKET : PUBLIC_BUCKET).upload(path, file.blob, { contentType: file.type, cacheControl: '31536000', upsert: false });
    if (error) throw Object.assign(new Error(error.message || 'upload failed'), { cause: error });
    return path;
  },
  /** Where to draw a file from. Pictures can ask for a width (Supabase resizes them on the way). */
  url(path, { width } = {}) {
    if (!path) return '';
    if (isPrivate(path)) return signed.get(path)?.url || '';
    const base = SUPABASE_URL.replace(/\/$/, '');
    if (width && /\.(webp|jpg)$/.test(path)) return `${base}/storage/v1/render/image/public/${PUBLIC_BUCKET}/${path}?width=${Math.round(width)}&quality=75&resize=contain`;
    return `${base}/storage/v1/object/public/${PUBLIC_BUCKET}/${path}`;
  },
  /** A direct room's files are signed for an hour; this fetches what the url() above returns. */
  async sign(paths) {
    const want = paths.filter((p) => isPrivate(p) && !(signed.get(p)?.until > Date.now() + 60_000));
    if (!want.length) return;
    const sb = await getClient();
    const { data } = await sb.storage.from(PRIVATE_BUCKET).createSignedUrls(want, 3600);
    for (const d of data || []) if (d.signedUrl) signed.set(d.path, { url: d.signedUrl, until: Date.now() + 3600_000 });
  },
  /** Take back files that were sent but not used (a post that was not published). */
  async discard(paths) {
    if (!paths.length) return;
    const sb = await getClient();
    const pub = paths.filter((p) => !isPrivate(p));
    const priv = paths.filter(isPrivate);
    if (pub.length) await sb.storage.from(PUBLIC_BUCKET).remove(pub);
    if (priv.length) await sb.storage.from(PRIVATE_BUCKET).remove(priv);
  },
};
