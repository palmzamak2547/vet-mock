// The front door at / [M1-DESIGN.md 15]. Port of work/research-studio/design/ (WebGL herd, scroll
// story, the chapter "what CUVET papers use" from the Europe PMC counts) into React with refs and one
// rAF loop, or CSS scroll-driven animation generated from the same layout function. OWNER: landing role.
import { registerArea, useT } from '../i18n/index.js';
import landing from '../i18n/landing.js';

registerArea('landing', landing);

export default function Landing() {
  const { t } = useT();
  return (
    <main className="rs-landing">
      <h1>{t('common.appName')}</h1>
    </main>
  );
}
