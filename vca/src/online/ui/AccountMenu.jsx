// The signed-in student's own corner: their profile, the board, chat, and signing out.

import { Sheet } from '../../components/Sheet.jsx';
import { Icon } from '../../components/Icon.jsx';
import { Link } from '../../components/Link.jsx';
import { Avatar } from './Avatar.jsx';
import { signOut, useAccount } from '../account.js';
import '../community.css';

export default function AccountMenu({ open, onClose, onEdit }) {
  const { profile, user, moderator } = useAccount();
  if (!profile) return null;
  const go = () => onClose();
  return (
    <Sheet open={open} onClose={onClose} title="บัญชี">
      <div className="acct-head">
        <Avatar profile={profile} size={56} ring />
        <div>
          <p className="acct-name">{profile.name}</p>
          <p className="acct-handle">@{profile.handle}{user?.email ? <span> {user.email}</span> : null}</p>
        </div>
      </div>
      <nav className="acct-links" aria-label="บัญชี">
        <Link to={`/u/${profile.handle}`} className="acct-link" onClick={go} data-autofocus><Icon name="user" />โปรไฟล์ของฉัน</Link>
        <Link to="/community" className="acct-link" onClick={go}><Icon name="users" />ชุมชน</Link>
        <Link to="/chat" className="acct-link" onClick={go}><Icon name="chat" />แชท</Link>
        <button type="button" className="acct-link" onClick={onEdit}><Icon name="edit" />แก้ไขโปรไฟล์</button>
        {moderator && <span className="acct-mod"><Icon name="shield" size={16} />ผู้ดูแลชุมชน</span>}
      </nav>
      <button type="button" className="btn btn-ghost btn-block" onClick={async () => { await signOut(); onClose(); }}>
        <Icon name="logout" size={18} />ออกจากระบบ
      </button>
    </Sheet>
  );
}
