// A thread as the board and a profile list it: who, when, the title, its first lines, its chips
// and counts. The whole card is the link.

import { Link } from '../../components/Link.jsx';
import { Icon } from '../../components/Icon.jsx';
import { Avatar, Byline } from './Avatar.jsx';
import { PostChips } from './bits.jsx';
import { MediaThumbs } from './Media.jsx';
import { ago, excerpt } from '../shapes.js';

export function PostCard({ post, i = 0 }) {
  return (
    <li className="cell" data-reveal style={{ '--i': Math.min(i, 8) }}>
      <Link to={`/community/p/${post.id}`} className={`post-card${post.hidden ? ' is-hidden' : ''}`} data-sheen>
        <span className="post-top">
          <Avatar profile={post.author} size={28} />
          <Byline profile={post.author} />
          <span className="post-when">{ago(post.activeAt)}</span>
        </span>
        <span className="post-title">{post.title}</span>
        <span className="post-excerpt">{excerpt(post.body)}</span>
        <MediaThumbs media={post.media} />
        <span className="post-foot">
          <PostChips post={post} />
          <span className="post-counts">
            <span aria-label={`${post.comments} คำตอบ`}><Icon name="chat" size={16} />{post.comments}</span>
            <span aria-label={`${post.likes} ถูกใจ`}><Icon name="heart" size={16} />{post.likes}</span>
          </span>
        </span>
      </Link>
    </li>
  );
}
