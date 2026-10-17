// LINE sign-in on this site: LIFF (LINE Front-end Framework) signs the student in with LINE and
// hands back a LINE ID token. The LIFF app is VCA's own (its endpoint is vca.vetmock.com), in the
// same LINE Login channel as VetMock's, so a student is the same LINE user on both sites and
// lands in the same account. Loaded only when the LINE button is pressed.

/**
 * @param {string} liffId
 * @param {string} redirectUri where LINE sends the student back after signing in
 * @returns {Promise<string|null>} the ID token, or null while LINE is being visited
 */
export async function lineIdToken(liffId, redirectUri) {
  const { default: liff } = await import('@line/liff');
  await liff.init({ liffId });
  if (!liff.isLoggedIn()) {
    liff.login({ redirectUri });
    return null;
  }
  return liff.getIDToken();
}
