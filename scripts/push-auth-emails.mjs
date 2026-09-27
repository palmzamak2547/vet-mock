// Push the auth email templates in supabase/email-templates/ (and their
// subjects) to the VetMock Supabase project, then read them back and fail
// unless the live copy matches the repo.
//
// The templates used to reach students only after someone re-pasted them
// into the Supabase dashboard, so a fixed link could sit in the repo for
// days while every email still sent the old one. This keeps repo and live
// the same thing.
//
//   SUPABASE_ACCESS_TOKEN=<personal access token> node scripts/push-auth-emails.mjs
//   SUPABASE_ACCESS_TOKEN=<token> node scripts/push-auth-emails.mjs --check   (read only)
//
// Only the ten mailer fields below are sent; every other auth setting is
// left as it is.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const PROJECT_REF = 'mpovsdzdggvksmeehqfj';

export const TEMPLATES = {
  magic_link: { file: '01-magic-link.html', subject: '✨ ลิงก์เข้าสู่ระบบ VetMock', tokens: ['{{ .ConfirmationURL }}'] },
  confirmation: { file: '02-confirm-signup.html', subject: '🎉 ยินดีต้อนรับสู่ VetMock ยืนยันอีเมลของคุณ', tokens: ['{{ .ConfirmationURL }}'] },
  recovery: { file: '03-reset-password.html', subject: '🔐 รีเซ็ตรหัสผ่าน VetMock', tokens: ['{{ .ConfirmationURL }}'] },
  email_change: { file: '04-change-email.html', subject: '📧 ยืนยันอีเมลใหม่ของคุณ', tokens: ['{{ .ConfirmationURL }}'] },
  reauthentication: { file: '05-reauthentication.html', subject: '🔐 รหัสยืนยัน VetMock: {{ .Token }}', tokens: ['{{ .Token }}'] },
};

const TEMPLATE_DIR = fileURLToPath(new URL('../supabase/email-templates/', import.meta.url));

/** The PATCH body for /config/auth, built from the repo. Throws when a
 *  template lost the token that makes it work or carries a separator. */
export function buildAuthEmailPatch(dir = TEMPLATE_DIR) {
  const body = {};
  for (const [key, { file, subject, tokens }] of Object.entries(TEMPLATES)) {
    const html = readFileSync(path.join(dir, file), 'utf8').replace(/\r\n/g, '\n');
    for (const token of tokens) {
      if (!html.includes(token)) throw new Error(`${file} no longer contains ${token}`);
    }
    if (/[·—]/.test(html + subject)) throw new Error(`${file} or its subject carries a middle dot or an em dash`);
    body[`mailer_templates_${key}_content`] = html;
    body[`mailer_subjects_${key}`] = subject;
  }
  return body;
}

async function call(method, token, body) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'vetmock-push-auth-emails',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} /config/auth answered ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

function differences(body, live) {
  return Object.keys(body).filter((field) => String(live[field] ?? '').replace(/\r\n/g, '\n') !== body[field]);
}

async function main() {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) throw new Error('Set SUPABASE_ACCESS_TOKEN (a Supabase personal access token).');
  const body = buildAuthEmailPatch();
  const before = await call('GET', token);
  const stale = differences(body, before);
  if (process.argv.includes('--check')) {
    console.log(stale.length ? `live differs from the repo: ${stale.join(', ')}` : 'live matches the repo');
    // exitCode, not process.exit(): on Windows exiting while fetch's socket is
    // still closing trips a libuv assertion and turns 0 into 127.
    process.exitCode = stale.length ? 1 : 0;
    return;
  }
  if (!stale.length) { console.log('live already matches the repo; nothing sent'); return; }
  await call('PATCH', token, body);
  const after = await call('GET', token);
  const left = differences(body, after);
  if (left.length) throw new Error(`read-back differs after the push: ${left.join(', ')}`);
  console.log(`pushed and verified: ${stale.join(', ')}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
