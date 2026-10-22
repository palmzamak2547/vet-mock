// tidyEvidence: a related document's evidence starts and ends on whole words,
// and never loses the term that made the link.
import test from 'node:test';
import assert from 'node:assert/strict';
import { tidyEvidence } from '../../src/lib/library.js';

test('a partial first and last word are dropped', () => {
  assert.equal(
    tidyEvidence('l pathogens • Canine parvovirus (CPV) • Canine coronavirus (CCV) • Segmented double-stranded RNA, ', 'CCV'),
    'pathogens, Canine parvovirus (CPV), Canine coronavirus (CCV), Segmented double-stranded RNA',
  );
});

test('slide bullets read as commas, never as dots', () => {
  assert.equal(tidyEvidence('Core vaccines • CDV / CPV / CAV • Rabies (endemic country) • CaPiV x', 'Rabies'), 'Core vaccines, CDV / CPV / CAV, Rabies (endemic country), CaPiV');
  assert.equal(tidyEvidence('• Fecal exam · CPV –ve ▪ ', 'CPV'), 'Fecal exam, CPV –ve');
  assert.equal(tidyEvidence('Dx § Rabies \uF0A7 FA test ❖ RT-PCR', 'Rabies'), 'Dx, Rabies, FA test, RT-PCR');
  assert.equal(tidyEvidence('Act §5 Rabies', 'Rabies'), 'Act §5 Rabies');
  assert.equal(tidyEvidence('see § 4.2 of the act on Rabies vaccination', 'Rabies'), '§ 4.2 of the act on Rabies');
  assert.equal(tidyEvidence('1. Rabies 2. Distemper', 'Rabies'), '1. Rabies 2. Distemper');
  assert.equal(tidyEvidence('Rabies, Chulalongkorn Un', 'Rabies'), 'Rabies, Chulalongkorn');
  assert.equal(tidyEvidence('ึง gluteal fascia ที่อยู่บริเวณสะโพก', 'gluteal'), 'gluteal fascia ที่อยู่บริเวณสะโพก');
});

test('the term is never cut away', () => {
  assert.equal(tidyEvidence('Rabies Vachira Hunprasit D.V.M. Ph.D.', 'Rabies'), 'Rabies Vachira Hunprasit D.V.M. Ph.D.');
  assert.equal(tidyEvidence('ore vaccines CDV CPV', 'CPV'), 'vaccines CDV CPV');
});

test('long first or last runs are kept (Thai without spaces)', () => {
  const thai = 'โรคพิษสุนัขบ้าเป็นโรคติดต่อระหว่างสัตว์และคน';
  assert.equal(tidyEvidence(thai, 'โรคพิษสุนัขบ้า'), thai);
});
