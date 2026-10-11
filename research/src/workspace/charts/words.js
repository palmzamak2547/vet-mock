// The words of the M3 chart kinds (src/i18n/graphs-m3.js), registered when the chart kit loads. charts/model.js
// (every chart drawn) and charts/from-result.js (every chart listed, with its title) import this module, so the
// words are in the dictionary before any M3 chart or chart title renders, and the first workspace chunk does not
// carry them. registerArea is idempotent per area. OWNER: graphs role.
import { registerArea } from '../../i18n/index.js';
import graphsM3 from '../../i18n/graphs-m3.js';

registerArea('graphs-m3', graphsM3);
