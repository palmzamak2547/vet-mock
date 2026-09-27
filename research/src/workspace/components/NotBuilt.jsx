// Placeholder for an M2 screen whose owner has not built it yet [M2-DESIGN.md 10]. A page titled by the
// rail's own word and one plain sentence. Nothing may ship while a screen still renders this: the
// release check greps for STUB(m2). OWNER: ui-analysis role.
import { useT } from '../../i18n/index.js';
import { PageHead } from './Bits.jsx';

/** @param {{ titleKey: string }} props */
export default function NotBuilt({ titleKey }) {
  const { t } = useT();
  return (
    <>
      <PageHead title={t(titleKey)} />
      <p className="rs-soft">{t('common.notBuilt')}</p>
    </>
  );
}
