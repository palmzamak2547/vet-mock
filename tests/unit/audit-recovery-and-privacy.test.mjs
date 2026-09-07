import test from 'node:test';
import assert from 'node:assert/strict';
import { inflightExamKey, readOwnedExam, clearCompletedExam, readUnclaimedExam, claimLegacyExam } from '../../src/lib/exam-recovery.js';
import { diagnosticRecord, installClientDiagnostics } from '../../src/lib/client-diagnostics.js';
import { buildDailyPlan } from '../../src/lib/daily-plan.js';

test('parked sessions are owner-bound and failed completions survive until committed', () => {
  const values=new Map();
  const storage={getItem:k=>values.get(k),removeItem:k=>values.delete(k)};
  values.set(inflightExamKey('a'),JSON.stringify({ownerId:'a',questions:[{id:1}],sessionId:'run',submitted:true,localSaved:false,submittedAt:100}));
  assert.equal(readOwnedExam(storage,'b'),null);
  assert.equal(clearCompletedExam(storage,'a','run'),false);
  assert.equal(readOwnedExam(storage,'a').submittedAt,100);
  values.set(inflightExamKey('a'),JSON.stringify({...readOwnedExam(storage,'a'),localSaved:true,detailsSaved:true}));
  assert.equal(clearCompletedExam(storage,'a','other-run'),false);
  assert.equal(clearCompletedExam(storage,'a','run'),true);
});
test('diagnostics discard exception text and identifiers; stop prevents further sending', async () => {
  const error={name:'TypeError',message:'secret note and email@example.invalid',stack:'https://host/app?token=private'};
  const record=diagnosticRecord(error,'/app/private-person','render');
  assert.deepEqual(Object.keys(record).sort(),['category','kind','release','view']);
  assert.equal(record.view,'other');
  assert.doesNotMatch(JSON.stringify(record),/secret|email|token|private-person/);
  const target=new EventTarget(),sent=[];
  const stop=installClientDiagnostics({target,getView:()=> 'exam',send:value=>sent.push(value)});
  const event=new Event('error');event.error=error;
  target.dispatchEvent(event);target.dispatchEvent(event);
  await Promise.resolve();assert.equal(sent.length,1);
  stop();target.dispatchEvent(event);await Promise.resolve();assert.equal(sent.length,1);
});
test('daily plans stay within the chosen time even with a large SRS backlog', () => {
  for (const minutes of [15,30,60]) {
    const plan=buildDailyPlan({minutes,due:1000,wrong:200});
    assert.equal(plan.steps.reduce((sum,s)=>sum+s.minutes,0)+plan.reviewMinutes,minutes);
    assert.ok(plan.reviewMinutes>=3);
    assert.ok(plan.steps.every(s=>s.count>0 && s.count<=30));
  }
  assert.equal(buildDailyPlan({minutes:15,exam:true}).steps[0].kind,'exam');
});


test('legacy snapshots reveal no answers until explicit ownership is claimed', () => {
  const values=new Map([['vmx-inflight-exam',JSON.stringify({questions:[{id:1}],answers:{1:'private answer'}})]]);
  const storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
  assert.equal(readOwnedExam(storage,null),null);
  assert.equal(readOwnedExam(storage,'a'),null);
  assert.ok(readUnclaimedExam(storage));
  claimLegacyExam(storage,'a');
  assert.equal(readOwnedExam(storage,'a').answers[1],'private answer');
  assert.equal(claimLegacyExam(storage,'b'),null);
  assert.equal(readOwnedExam(storage,null),null);
});
