// Kaplan-Meier (Greenwood SE; log, log-log and plain intervals; median with R's rule) and the log-rank test
// [M2-DESIGN.md 3.2.3]. Pins: R 4.6.0 survival 3.8.6 survfit() and survdiff() on aml (M2-DESIGN.md 3.2.3 and
// the architect's run log for the SEs and the log-log and plain bounds), plus the models role's run for the
// median on an exact 0.5 stretch and a three-group log-rank; sources in models-fixtures.mjs. OWNER: models role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kaplanMeier, logRank, runKaplanMeier } from '../../src/lib/models/survival.js';
import { makeTable, spec, near, nearAll, same, AML } from './models-fixtures.mjs';

const TOL = { rel: 1e-10 };

const R = {
  Maintained: {
    time: [9, 13, 18, 23, 31, 34, 48], nRisk: [11, 10, 8, 7, 5, 4, 2],
    surv: [0.90909090909090906, 0.81818181818181812, 0.71590909090909083, 0.61363636363636354, 0.49090909090909085, 0.36818181818181817, 0.18409090909090908],
    se: [0.08667841720414475, 0.11629129983033294, 0.13966497055722782, 0.152632331027312, 0.16419326722113581, 0.16266888582709479, 0.15349274578629368],
    log: { lower: [0.75413384508152548, 0.61924898739936352, 0.48842628742212846, 0.37686705950167976, 0.25485995119931731, 0.15487711789719105, 0.035917898489185258], upper: [1, 1, 1, 0.99915760022847266, 0.94558495520042918, 0.87526067814390762, 0.94352576947455202] },
    loglog: { lower: [0.50808020576992974, 0.44742861468218142, 0.35019038590793838, 0.26575204000128611, 0.16733090977685081, 0.092829574936985182, 0.011738480123189602], upper: [0.98667382266782311, 0.95116222858249166, 0.8990239741910534, 0.83529924325022142, 0.75339979037081128, 0.6570408323981638, 0.52501484272664145] },
    plain: { lower: [0.73920433313384837, 0.59025505879901674, 0.44217077871507732, 0.31448249194643668, 0.16909620065170372, 0.049356660555454401, 0], upper: [1, 1, 0.98964740310310439, 0.91279023532629044, 0.81272198116647798, 0.68700697580818193, 0.48493116272020675] },
    median: 31, medianCi: [18, null],
  },
  Nonmaintained: {
    time: [5, 8, 12, 23, 27, 30, 33, 43, 45], nRisk: [12, 10, 8, 6, 5, 4, 3, 2, 1], nEvent: [2, 2, 1, 1, 1, 1, 1, 1, 1],
    surv: [0.83333333333333337, 0.66666666666666674, 0.58333333333333337, 0.48611111111111116, 0.38888888888888895, 0.29166666666666674, 0.19444444444444448, 0.097222222222222238, 0],
    se: [0.1075828707279838, 0.13608276348795437, 0.14231876063832777, 0.14813006255348293, 0.14698618394803281, 0.13871516913498738, 0.12187450538044615, 0.091866364967520514, null],
    log: { lower: [0.64703698701336165, 0.44684608115026392, 0.36161370521038472, 0.26751824885826658, 0.18539652609555676, 0.1148311501524704, 0.056921552571604174, 0.015256527170865199, null], upper: [1, 0.99462536025909154, 0.9409980121738093, 0.88331922533955765, 0.81573571569127235, 0.74082201851580376, 0.66422365988256338, 0.61954862911905562, null] },
    loglog: { lower: [0.48171494219537886, 0.33701893254140197, 0.27013892408549733, 0.19187661961872829, 0.12627201219539366, 0.072401608907771836, 0.03119864293121194, 0.0057463056958638346, null], upper: [0.95550936572806489, 0.85971179908443984, 0.80094019233338687, 0.72967156977948544, 0.64981740828931511, 0.56088605267140923, 0.46142947623811392, 0.34890386111074972, null] },
    plain: { lower: [0.62247478135305678, 0.39994935131359399, 0.30439368815783435, 0.19578152347861938, 0.10080126212576529, 0.019789931052709431, 0, 0, null], upper: [1, 0.93338398201973949, 0.86227297850883233, 0.776440698743603, 0.67697651565201267, 0.56354340228062405, 0.43331408562375195, 0.27727698894917452, null] },
    median: 23, medianCi: [8, null],
  },
  logrank: { chisq: 3.3963886989776011, p: 0.065339322040505132, obs: [7, 11], exp: [10.689335992300725, 7.3106640076992759] },
};

const group = (g) => AML.time.map((_, i) => i).filter((i) => AML.x[i] === g);
const eventRows = (km) => km.nEvent.map((d, k) => (d > 0 ? k : -1)).filter((k) => k >= 0);

for (const g of ['Maintained', 'Nonmaintained']) {
  test(`aml ${g}: survfit() steps, Greenwood SE and the three interval types`, () => {
    const idx = group(g);
    const want = R[g];
    for (const [confType, key] of [['log', 'log'], ['log-log', 'loglog'], ['plain', 'plain']]) {
      const km = kaplanMeier(idx.map((i) => AML.time[i]), idx.map((i) => AML.status[i] === 1), confType, 0.95);
      const ev = eventRows(km);
      nearAll(ev.map((k) => km.time[k]), want.time, TOL, `${g} time`);
      nearAll(ev.map((k) => km.nRisk[k]), want.nRisk, TOL, `${g} n at risk`);
      if (want.nEvent) nearAll(ev.map((k) => km.nEvent[k]), want.nEvent, TOL, `${g} events`);
      nearAll(ev.map((k) => km.surv[k]), want.surv, TOL, `${g} survival`);
      nearAll(ev.map((k) => km.se[k]), want.se, TOL, `${g} SE`);
      nearAll(ev.map((k) => km.lower[k]), want[key].lower, TOL, `${g} ${confType} lower`);
      nearAll(ev.map((k) => km.upper[k]), want[key].upper, TOL, `${g} ${confType} upper`);
      if (confType === 'log') {
        near(km.median, want.median, TOL, `${g} median`);
        nearAll(km.medianCi, want.medianCi, TOL, `${g} median CI`);
      }
    }
  });
}

test('aml log-rank: survdiff() chi-square, p, observed and expected', () => {
  const lr = logRank(AML.time, AML.status.map((s) => s === 1), AML.x.map((x) => (x === 'Maintained' ? 0 : 1)));
  near(lr.statistic, R.logrank.chisq, TOL, 'X2');
  same(lr.df, 1, 'df');
  near(lr.p, R.logrank.p, TOL, 'p');
  nearAll(lr.observed, R.logrank.obs, TOL, 'observed');
  nearAll(lr.expected, R.logrank.exp, TOL, 'expected');
});

test('three groups: survdiff() on aml plus a third group (models role\'s run)', () => {
  const time = [...AML.time, 4, 7, 10, 20, 40];
  const event = [...AML.status, 1, 1, 0, 1, 0].map((s) => s === 1);
  const g = [...AML.x.map((x) => (x === 'Maintained' ? 0 : 1)), 2, 2, 2, 2, 2];
  const lr = logRank(time, event, g);
  near(lr.statistic, 3.3902229234608425, TOL, 'X2');
  same(lr.df, 2, 'df');
  near(lr.p, 0.18357876588039654, TOL, 'p');
  nearAll(lr.expected, [11.034305207463101, 7.7757082099187365, 2.1899865826181615], TOL, 'expected');
});

test('median rule on an exact 0.5 stretch (R survfit summary table, models role\'s run)', () => {
  // survfit(Surv(1:4, rep(1, 4)) ~ 1): median 2.5, 0.95LCL 1, 0.95UCL NA
  let km = kaplanMeier([1, 2, 3, 4], [true, true, true, true]);
  near(km.median, 2.5, TOL, 'midpoint to the next drop');
  nearAll(km.medianCi, [1, null], TOL, 'CI');
  // survfit(Surv(1:6, c(1, 1, 1, 0, 0, 0)) ~ 1): S stays at 0.5 to the end; median 3, LCL 2, UCL NA
  km = kaplanMeier([1, 2, 3, 4, 5, 6], [true, true, true, false, false, false]);
  near(km.median, 3, TOL, 'no later drop: the start of the stretch');
  nearAll(km.medianCi, [2, null], TOL, 'CI');
  // survfit(Surv(c(1, 2, 2.5, 3, 4, 5), c(1, 1, 0, 1, 1, 1)) ~ 1): median 3, LCL 2, UCL NA
  km = kaplanMeier([1, 2, 2.5, 3, 4, 5], [true, true, false, true, true, true]);
  near(km.median, 3, TOL, 'median');
  nearAll(km.medianCi, [2, null], TOL, 'CI');
  // a group that never falls to half has no median
  km = kaplanMeier([1, 2, 3, 4], [true, false, false, false]);
  assert.equal(km.median, null);
});

test('runKaplanMeier: grouped values, open upper bound, tables, log-rank test and the G22 note', () => {
  const t = makeTable({
    time: { kind: 'number', values: AML.time },
    status: { kind: 'category', levels: ['censored', 'dead'], values: AML.status.map((s) => (s ? 'dead' : 'censored')) },
    x: { kind: 'category', levels: ['Maintained', 'Nonmaintained'], values: AML.x },
  });
  const out = runKaplanMeier(spec('surv.kaplanMeier', { roles: { time: 'time', event: 'status', group: 'x' }, levels: { outcomePositive: 'dead' }, options: { confType: 'log', test: 'logrank' } }), t);
  assert.equal(out.status, 'ok');
  assert.equal(out.used, 23);
  const m = out.values['median:Maintained'];
  near(m.value, 31, TOL, 'median');
  near(m.ci[0], 18, TOL, 'median lower');
  assert.equal(m.ci[1], Infinity, 'no upper limit is an open bound');
  assert.equal(m.noteKey, 'models.undefined.noUpper');
  same(out.values['events:Nonmaintained'].value, 11, 'events');
  same(out.values['n:Nonmaintained'].value, 12, 'n');
  const lr = out.tests.find((x) => x.id === 'logrank');
  near(lr.statistic.value, R.logrank.chisq, TOL, 'log-rank X2');
  near(lr.p, R.logrank.p, TOL, 'log-rank p');
  const surv = out.tables.find((x) => x.id === 'survival');
  // censored times are kept (a chart draws their ticks): Maintained has 13 (censored), 28, 45, 161
  assert.equal(surv.rows.filter((r) => r[0] === 'Maintained').length, 10);
  const last = surv.rows.filter((r) => r[0] === 'Nonmaintained').at(-1);
  assert.deepEqual([last[5], last[6], last[7], last[8]], [0, null, null, null], 'survival 0: SE and bounds undefined');
  assert.ok(out.notes.some((n) => n.id === 'G22'));
  const none = runKaplanMeier(spec('surv.kaplanMeier', { roles: { time: 'time', event: 'status', group: 'x' }, levels: { outcomePositive: 'dead' }, options: { test: 'none' } }), t);
  assert.equal(none.tests.length, 0);
  const all = runKaplanMeier(spec('surv.kaplanMeier', { roles: { time: 'time', event: 'status' }, levels: { outcomePositive: 'dead' } }), t);
  assert.ok('median' in all.values && all.tests.length === 0, 'one curve: no test');
  assert.equal(all.tables.find((x) => x.id === 'survival').columns[0], 'models.col.time', 'one curve: no group column');
  assert.deepEqual(all.resolvedOptions, { test: 'none' });
});

test('runKaplanMeier refuses an event column without the event level, and drops negative times', () => {
  const t = makeTable({ time: { kind: 'number', values: [1, -2, 3, 4] }, e: { kind: 'number', values: [1, 1, 0, 1] } });
  const out = runKaplanMeier(spec('surv.kaplanMeier', { roles: { time: 'time', event: 'e' } }), t);
  assert.equal(out.used, 3);
  assert.deepEqual(out.dropped, [{ reason: 'invalid', column: 'time', count: 1 }]);
  const t2 = makeTable({ time: { kind: 'number', values: [1, 2] }, e: { kind: 'category', levels: ['a', 'b'], values: ['a', 'b'] } });
  assert.equal(runKaplanMeier(spec('surv.kaplanMeier', { roles: { time: 'time', event: 'e' } }), t2).values.reason.reasonKey, 'models.error.needEventLevel');
});
