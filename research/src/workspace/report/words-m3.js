// Registers the report's M3a words (i18n/report-m3.js) when the report code loads: build.js (the result paragraphs and
// the draft) and the R and SPSS script writers import this module, so every M3a sentence and script comment finds its
// words without the workspace's first chunk carrying them (tests/unit/build-lazy-exporters.test.mjs keeps that chunk
// under its byte budget). registerArea is idempotent per area. OWNER: report role.
import { registerArea } from '../../i18n/index.js';
import reportM3 from '../../i18n/report-m3.js';

registerArea('report-m3', reportM3);

export default reportM3;
