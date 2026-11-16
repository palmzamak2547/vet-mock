// MyCardTile: the profile hub's "การ์ดของฉัน", the card as classmates see it
// and the one way into "ปรับแต่งการ์ด" (views/StudioView.jsx).
import { useMyCard, useOwnPicture } from '../hooks/useMyCard.js';
import { ownCard } from '../lib/own-card.js';
import StudentCard from './StudentCard.jsx';

export default function MyCardTile({ user = null, profile = null, history = [], srCards = {}, streakData = null, selectedYear = null, theme = 'light', onOpen }) {
  const { card } = useMyCard(user);
  const ownPicture = useOwnPicture(user?.id);
  const { face } = ownCard({ card, user, profile, history, srCards, streakData, selectedYear, theme, ownPicture });
  return (
    <section className="vmx-dash-card vmx-profile-card vmx-hub-card" aria-labelledby="hub-card" data-testid="hub-card">
      <h2 id="hub-card">การ์ดของฉัน</h2>
      <div className="vmx-hub-card-stage">
        <StudentCard face={face} still />
      </div>
      <button type="button" className="vmx-btn vmx-btn-ghost vmx-hub-card-open" onClick={onOpen}>ปรับแต่งการ์ด</button>
    </section>
  );
}
