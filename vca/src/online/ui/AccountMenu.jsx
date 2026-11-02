// The signed-in student's own corner: their profile, the board, chat, and signing out. A student
// with no profile yet gets it too, with "ตั้งโปรไฟล์" in place of their profile, so signing out is
// always one tap from the header (behind the Chula wall every student here is signed in).

import { Sheet } from '../../components/Sheet.jsx';
import { Icon } from '../../components/Icon.jsx';
import { Link } from '../../components/Link.jsx';
import { Avatar } from './Avatar.jsx';
import { useAccount } from '../account.js';
import { signOutHere } from '../gate.js';
import '../community.css';

export default function AccountMenu({ open, onClose, onEdit }) {
  const { profile, user, moderator } = useAccount();
  if (!user) return null;
  const go = () => onClose();
  return (
    <Sheet open={open} onClose={onClose} title="บัญชี">
      <div className="acct-head">
        <Avatar profile={profile} size={56} ring />
        <div>
          <p className="acct-name">{profile ? profile.name : user.name || 'บัญชีของฉัน'}</p>
          <p className="acct-handle">
            {profile ? `@${profile.handle}` : null}
            {user.email ? (profile ? <span> {user.email}</span> : user.email) : null}
          </p>
        </div>
      </div>
      <nav className="acct-links" aria-label="บัญชี">
        {profile ? <Link to={`/u/${profile.handle}`} className="acct-link" onClick={go} data-autofocus><Icon name="user" />โปรไฟล์ของฉัน</Link> : null}
        {!profile ? <button type="button" className="acct-link" onClick={onEdit} data-autofocus><Icon name="edit" />ตั้งโปรไฟล์</button> : null}
        <Link to="/community" className="acct-link" onClick={go}><Icon name="users" />ชุมชน</Link>
        <Link to="/chat" className="acct-link" onClick={go}><Icon name="chat" />แชท</Link>
        {profile ? <button type="button" className="acct-link" onClick={onEdit}><Icon name="edit" />แก้ไขโปรไฟล์</button> : null}
        {moderator && <span className="acct-mod"><Icon name="shield" size={16} />ผู้ดูแลชุมชน</span>}
      </nav>
      <button type="button" className="btn btn-ghost btn-block" onClick={async () => { await signOutHere(); onClose(); }}>
        <Icon name="logout" size={18} />ออกจากระบบ
      </button>
    </Sheet>
  );
}
