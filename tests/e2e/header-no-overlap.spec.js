import { test, expect, PINNED_NOW } from './fixtures.js';
import { studiedQuestions } from './lib/routes.js';

// The header never draws one control over another, at any width from 320 to 1440, for a signed-in
// student with every chip the header can show (a streak, saved questions, a five-digit XP total and a
// long name) and for one with none of them. A tap must land on the control it is aimed at: the paper
// pill once sat under the XP chip between about 900 and 1060 px, so a tap there opened the XP panel.
//
// The student is modelled as student-profile.spec.js models one: a session planted in storage as data,
// every request to the database host answered here, any other *.supabase.co host refused. Nothing real
// is called. Runs against the connected bundle (it needs the database settings); the plain bundle has
// no accounts and skips it, as student-profile.spec.js does.
test.use({ serviceWorkers: 'block' });

const HOST = 'mpovsdzdggvksmeehqfj.supabase.co';
const TOKEN_KEY = 'sb-mpovsdzdggvksmeehqfj-auth-token';
const UID = '44444444-4444-4444-8444-444444444444';
const encoded = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const WIDTHS = [320, 360, 390, 430, 600, 601, 700, 768, 820, 900, 901, 960, 1024, 1060, 1100, 1180, 1199, 1200, 1280, 1366, 1440];

const person = (metadata) => ({
  id: UID, email: '6600000044@student.chula.ac.th', aud: 'authenticated', role: 'authenticated',
  identities: [{ provider: 'google', identity_data: { email: '6600000044@student.chula.ac.th', email_verified: true, custom_claims: { hd: 'student.chula.ac.th' } } }],
  app_metadata: { provider: 'google', providers: ['google'] },
  user_metadata: { full_name: 'นิสิตสัตวแพทย์ทดสอบชื่อยาวมาก', identity_intro_done: true, ...metadata },
  created_at: '2026-01-01T00:00:00Z', email_confirmed_at: '2026-01-01T00:00:00Z',
});

async function modeled(page, context, { chips }) {
  const now = Date.parse(PINNED_NOW);
  const day = 86_400_000;
  const studied = await studiedQuestions();
  // xp_quests is what the account earned from quests (lib/xp-account.js): enough for five digits.
  const user = person(chips ? { xp_quests: 12_345 } : {});
  const profile = { id: UID, username: 'user_44', display_name: 'นิสิตสัตวแพทย์ทดสอบชื่อยาวมาก', avatar_emoji: '🐾', created_at: '2026-01-01T00:00:00Z' };
  const account = {
    user_id: UID,
    history: chips ? studied.map((q, i) => ({ date: now - i * 3_600_000, questionId: q.id, subject: q.subject, year: 5, phase: '1-mid', correct: i % 3 !== 0 })) : [],
    streak_data: chips ? { streak: 128, lastDate: now - day, freezeUsedAt: null } : { streak: 0, lastDate: null },
    sr_cards: {}, bookmarks: chips ? studied.slice(0, 3).map((q) => q.id) : [], notes: {}, custom_questions: [],
    updated_at: new Date(now - day).toISOString(), sync_version: 2, sync_revision: 1, sync_clock: now - day,
  };
  const state = { db: 0, revision: 1 };
  await context.routeWebSocket('**/*', (socket) => socket.close());
  await page.route('**://*.supabase.co/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname !== HOST) return route.abort();
    state.db++;
    const p = url.pathname;
    const one = /pgrst\.object/.test(request.headers().accept || '');
    if (p === '/rest/v1/rpc/chula_access_state') return route.fulfill({ json: { enforce: true, signed_in: true, member: true, uid: UID } });
    if (p.startsWith('/auth/v1/user')) return route.fulfill({ json: user });
    if (p === '/rest/v1/profiles' || p === '/rest/v1/rpc/ensure_profile') return route.fulfill({ json: one || p.includes('rpc') ? profile : [profile] });
    if (p === '/rest/v1/rpc/sync_user_data_v2') {
      let ops = [];
      try { ops = request.postDataJSON()?.p_operations || []; } catch { /* no body */ }
      state.revision += 1;
      return route.fulfill({ json: { row: { ...account, sync_revision: state.revision, sync_clock: Date.now() }, acknowledged: ops.map((o) => o.id), conflicts: [] } });
    }
    if (p === '/rest/v1/user_data' && request.method() === 'GET') return route.fulfill({ json: one ? account : [account] });
    // Everything else stays unanswered, as in student-profile.spec.js.
    return route.abort();
  });
  const planted = {
    access_token: `${encoded({ alg: 'none', typ: 'JWT' })}.${encoded({ sub: UID, aud: 'authenticated', role: 'authenticated', exp: 4102444800 })}.modeled-only`,
    refresh_token: 'modeled-only-not-a-real-session', token_type: 'bearer', expires_in: 3600, expires_at: 4102444800, user,
  };
  await page.addInitScript(({ planted, key }) => {
    if (window !== window.top) return;
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-pwa-install-dismissed', '1');
    if (!sessionStorage.getItem('vmx-test-planted')) {
      localStorage.setItem(key, JSON.stringify(planted));
      sessionStorage.setItem('vmx-test-planted', '1');
    }
  }, { planted, key: TOKEN_KEY });
  return state;
}

// Every control drawn in the header, with its box, and whether a tap at its centre reaches it.
const measure = (page) => page.evaluate(() => {
  const header = document.querySelector('.vmx-header');
  const nodes = [...header.querySelectorAll('button, a[href], [role="button"], .vmx-streak, .vmx-context-group')];
  const seen = nodes.filter((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
  });
  const name = (el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}${el.getAttribute('aria-label') ? `[${el.getAttribute('aria-label')}]` : ''}`;
  const boxes = seen.map((el) => {
    const r = el.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return { el, name: name(el), box: { left: r.left, top: r.top, right: r.right, bottom: r.bottom }, reached: Boolean(hit && (el.contains(hit) || hit.contains(el))) };
  });
  const crossings = [];
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i]; const b = boxes[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const w = Math.min(a.box.right, b.box.right) - Math.max(a.box.left, b.box.left);
      const h = Math.min(a.box.bottom, b.box.bottom) - Math.max(a.box.top, b.box.top);
      if (w > 0.5 && h > 0.5) crossings.push(`${a.name} and ${b.name} share ${w.toFixed(1)} x ${h.toFixed(1)} px`);
    }
  }
  const unreachable = boxes.filter((b) => !b.reached).map((b) => b.name);
  const pageWider = document.documentElement.scrollWidth > window.innerWidth + 1;
  return { crossings, unreachable, pageWider, names: boxes.map((b) => b.name) };
});

for (const chips of [true, false]) {
  test(`no header control is drawn over another, 320 to 1440 px, ${chips ? 'streak, saved and a five-digit level' : 'no chips'}`, async ({ page, context }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 1024, height: 768 });
    const state = await modeled(page, context, { chips });
    await page.goto('/');
    await expect(page.locator('.vmx-header')).toBeVisible();
    for (let i = 0; i < 30 && state.db === 0; i++) await page.waitForTimeout(100);
    test.skip(state.db === 0, 'Built bundle has no Supabase configuration; accounts need it');
    await expect(page.locator('.vmx-usermenu-trigger')).toBeVisible();
    if (chips) {
      await expect(page.locator('.vmx-streak')).toBeVisible();
      await expect(page.locator('.vmx-saved-btn')).toBeVisible();
      await expect(page.locator('.vmx-xp-chip')).toBeVisible();
    }
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 800 });
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const m = await measure(page);
      expect(m.crossings, `at ${width} px: ${m.names.join(', ')}`).toEqual([]);
      expect(m.unreachable, `at ${width} px a tap at the centre misses`).toEqual([]);
      expect(m.pageWider, `at ${width} px the page scrolls sideways`).toBe(false);
    }
  });
}
