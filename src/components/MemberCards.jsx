// MemberCards: a group's members, each as the card they chose.
// Styles come through card_styles (lib/card-style-remote.js). Before the
// database has them, or for a member who never chose, the default card is
// shown; the student's own card is the one on this device, as in the studio.
import { useEffect, useState } from 'react';
import StudentCard from './StudentCard.jsx';
import { fetchCardStyles } from '../lib/card-style-remote.js';
import { cardFace, readCard, readLocalCard, shownPhoto } from '../lib/card-style.js';
import { shownName, shownPicture } from '../lib/public-display.js';

/** One face per member: their saved style, the default card, or (for the
 *  student) this device's copy. No numbers: a classmate's record is theirs. */
export function memberFaces(members, styles, { selfId = null, selfToken = null, theme = 'light', pictures = {} } = {}) {
  return (Array.isArray(members) ? members : []).map((m) => {
    const token = m.id === selfId && selfToken ? selfToken : styles.get(m.id);
    return {
      id: m.id,
      role: m.role,
      self: m.id === selfId,
      face: cardFace({ card: readCard(token), name: shownName(m.username), picture: shownPicture(m.avatar_emoji), photo: shownPhoto(pictures?.[m.id]), theme }),
    };
  });
}

const appTheme = () => (typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

// pictures: usePictures() of the members (their own uploads). onPhotoBroken(url): a picture failed to load.
// under(member): what the page puts under a member's card, such as the link that reports a picture.
export default function MemberCards({ members, user, pictures = {}, onPhotoBroken = null, under = null }) {
  const [styles, setStyles] = useState(() => new Map());
  const ids = (members || []).map((m) => m.id).join(',');
  useEffect(() => {
    let live = true;
    fetchCardStyles(ids ? ids.split(',') : []).then((map) => { if (live) setStyles(map); });
    return () => { live = false; };
  }, [ids]);
  const cards = memberFaces(members, styles, { selfId: user?.id || null, selfToken: readLocalCard(user?.id), theme: appTheme(), pictures });
  const byId = new Map((members || []).map((m) => [m.id, m]));
  return (
    <div className="vmx-member-cards">
      {cards.map(({ id, role, self, face }) => (
        <div key={id} className="vmx-member-card">
          <StudentCard face={face} compact still onPhotoBroken={onPhotoBroken} />
          {(self || role === 'admin') && (
            <p className="vmx-member-card-note">
              {self && <span>คุณ</span>}
              {role === 'admin' && <span className="is-admin">ผู้ดูแลกลุ่ม</span>}
            </p>
          )}
          {under ? under(byId.get(id)) : null}
        </div>
      ))}
    </div>
  );
}
