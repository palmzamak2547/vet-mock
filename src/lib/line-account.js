// ============================================================
// line-account.js — recognise the placeholder email of a LINE-only account
// ============================================================
// LINE often signs a student in without sharing an email. The line-auth edge
// function (supabase/functions/line-auth/index.ts) then stores the account
// under `line_<sub>@line.vetmock.local`, an address no mail ever reaches.
//
// Anything that mails the account's own address (the reauth code that guards
// a password change) cannot work for such an account, and the address itself
// is not the student's email, so it must not be shown as one.
// tests/unit/account-settings-copy.test.mjs checks that the edge function
// still mints this suffix.
// ============================================================

export const LINE_PLACEHOLDER_SUFFIX = '@line.vetmock.local';

/** True when the user (or a bare address) is the LINE placeholder. */
export function isSyntheticLineEmail(userOrEmail) {
  const email = typeof userOrEmail === 'string' ? userOrEmail : userOrEmail?.email;
  return typeof email === 'string' && email.trim().toLowerCase().endsWith(LINE_PLACEHOLDER_SUFFIX);
}
