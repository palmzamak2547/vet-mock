// One question at its own address (/d/<domain>/<no>), so it can be shared, sent to a friend or
// opened in the VetMock app. A client page only: it is not prerendered, so it adds nothing to the
// build's prerender or to the sitemap.

import { Link } from '../components/Link.jsx';
import { Icon } from '../components/Icon.jsx';
import { QuestionPeek } from '../components/QuestionPeek.jsx';
import { CARD_BY_ID } from '../lib/bank.js';
import { useTitle } from '../lib/hooks.js';
import NotFound from './NotFound.jsx';

export default function QuestionPage({ route }) {
  const { domain, no } = route.params;
  const card = CARD_BY_ID[domain];
  useTitle(card ? `ข้อ No. ${no} ${card.th}` : 'ไม่พบหน้านี้');
  if (!card) return <NotFound />;
  return (
    <section className="wrap question-page">
      <header className="page-head">
        <p className="kicker">No. {no}</p>
        <h1 className="page-h">{card.th}</h1>
      </header>
      <QuestionPeek no={no} domain={domain} twin missing={<p className="page-p">ไม่พบข้อนี้ในหมวดนี้ อาจถูกนำออกจากคลังแล้ว</p>} />
      <p><Link to={`/d/${domain}`} className="text-link">ฝึกหมวดนี้ <Icon name="arrowRight" size={16} /></Link></p>
    </section>
  );
}
