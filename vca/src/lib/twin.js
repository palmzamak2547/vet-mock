// A VCA question's two addresses: its own page on this site (/d/<domain>/<no>, the number the bank
// prints as "No.") and the same question in the VetMock app (the shared-question link the app
// itself reads, ?qset=, built by the app's own code so the two cannot drift).

import { encodeQuizSet } from '@vetmock/lib/share-link.js';
import { familyMember } from '@vetmock/lib/family/family.js';

const DOMAIN = /^[a-z-]{2,40}$/;
const NO = /^\d{1,9}$/;

/** This site's address for a question, or null when the domain or number cannot be one. */
export function questionPath(domain, no) {
  const n = String(no ?? '');
  return DOMAIN.test(String(domain || '')) && NO.test(n) ? `/d/${domain}/${n}` : null;
}

/** The same question in the VetMock app, or null when it cannot travel in a link. */
export function twinUrl(q) {
  if (!q?.subject || q.id == null) return null;
  const qset = encodeQuizSet([{ subject: q.subject, id: q.id }]);
  return qset ? `${familyMember('main').url}?qset=${qset}` : null;
}
