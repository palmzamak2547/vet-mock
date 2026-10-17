// The account's place in the top bar: a quiet "sign in" for a visitor, the student's own mark
// once signed in. The sheets it opens live at the app's root (AccountSheets), outside the bar,
// whose glass would otherwise hold a full-screen sheet inside it. They load when first opened;
// the profile sheet also opens by itself after a first sign-in, until the student has a profile.

import { Suspense, lazy, useEffect, useState } from 'react';
import { Icon } from '../../components/Icon.jsx';
import { Avatar } from './Avatar.jsx';
import { accountStore, openSetup, useAccount } from '../account.js';

const SignInSheet = lazy(() => import('./SignInSheet.jsx'));
const ProfileSheet = lazy(() => import('./ProfileSheet.jsx'));
const AccountMenu = lazy(() => import('./AccountMenu.jsx'));

const EVENT = 'vca:account';
const ask = (sheet) => window.dispatchEvent(new CustomEvent(EVENT, { detail: sheet }));

/** Ask for the sign-in sheet from anywhere in the community. */
export const askSignIn = () => ask('signin');
/** Open the profile sheet, to make a profile or edit it. */
export const askProfile = () => ask('profile');
/** Whatever stands between a reader and joining in: signing in, or then a profile. */
export const askJoin = () => {
  const { status, profile } = accountStore.get();
  ask(status === 'in' && !profile ? 'profile' : 'signin');
};

export function AccountButton() {
  const account = useAccount();
  if (account.status === 'off') return null;
  const signedIn = account.status === 'in';
  const label = signedIn ? `บัญชีของ ${account.profile?.name || 'ฉัน'}` : 'เข้าสู่ระบบ';
  return (
    <button
      type="button"
      className={`icon-btn acct-btn${signedIn && account.profile ? ' is-in' : ''}${account.status === 'loading' ? ' is-loading' : ''}`}
      onClick={() => ask(signedIn ? (account.profile ? 'menu' : 'profile') : 'signin')}
      aria-label={label}
      aria-haspopup="dialog"
      title={label}
    >
      {signedIn && account.profile ? <Avatar profile={account.profile} size={34} /> : <Icon name="user" />}
    </button>
  );
}

export function AccountSheets() {
  const account = useAccount();
  const [sheet, setSheet] = useState(null);

  useEffect(() => {
    const open = (e) => setSheet(e.detail);
    window.addEventListener(EVENT, open);
    return () => window.removeEventListener(EVENT, open);
  }, []);
  // Signed in from the sheet: it has done its work.
  useEffect(() => { if (account.status === 'in' && sheet === 'signin') setSheet(null); }, [account.status, sheet]);

  if (account.status === 'off') return null;
  const close = () => { setSheet(null); openSetup(false); };
  return (
    <Suspense fallback={null}>
      {sheet === 'signin' && account.status !== 'in' && <SignInSheet open onClose={close} />}
      {sheet === 'menu' && account.profile && <AccountMenu open onClose={close} onEdit={() => setSheet('profile')} />}
      {account.status === 'in' && (sheet === 'profile' || account.setup) && <ProfileSheet open onClose={close} />}
    </Suspense>
  );
}
