// The community's front door. The practice site's components and pages may import this module
// and nothing else under online/ (tests/unit/boundaries.test.mjs): what is behind it, Supabase
// included, loads only when a student first reaches for it.

import { MODE } from './config.js';

export { MODE } from './config.js';
export { useAccount, startAccount, signOut, openSetup } from './account.js';
export { AccountButton, AccountSheets, prefetchSignIn } from './ui/AccountButton.jsx';

/** Whether the community shows at all: hidden in a production build with no backend yet. */
export const COMMUNITY_ON = MODE !== 'off';

/** Where to talk a question over: the board's threads about it, or null when there is nowhere. */
export const discussHref = (questionNo, domain) => {
  if (!COMMUNITY_ON || !questionNo) return null;
  return `/community?q=${encodeURIComponent(questionNo)}${domain ? `&d=${encodeURIComponent(domain)}` : ''}`;
};
