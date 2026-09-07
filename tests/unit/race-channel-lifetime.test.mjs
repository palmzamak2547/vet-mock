import { questionRevision } from '../../src/lib/study-events.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveRaceQuestions, mergeRaceProgress, rankRacePlayers } from '../../src/lib/race-session.js';
import { readFileSync } from 'node:fs';
const source = readFileSync('src/views/RaceView.jsx', 'utf8');
test('race snapshots continue through every phase and ignore client broadcasts', () => {
  assert.doesNotMatch(source, /on\('broadcast'/);
  assert.match(source, /\[code, user\?\.id\]/);
  assert.match(source, /ownedRpc\(owner, 'answer_race'/);
});
test('question resolution loads the host year and rejects incomplete sets', async () => {
  const bank=[];
  const snapshot={started_at:'2026-09-07',year:4,subject:'com3',question_ids:[1,2,3,4,5]};
  const loaded=await resolveRaceQuestions(snapshot, bank, async year => {
    assert.equal(year,4);bank.push(...snapshot.question_ids.map(id=>({id,subject:'com3',type:'mcq'})));snapshot.question_versions=Object.fromEntries(bank.map(q=>[q.id,questionRevision(q)]));
  });
  assert.equal(loaded.length,5);
  await assert.rejects(resolveRaceQuestions({...snapshot,question_versions:{}},bank,async()=>{}), /คนละรุ่น/);
  await assert.rejects(resolveRaceQuestions({...snapshot,question_ids:[1,2,3,4,6]},bank,async()=>{}));
});
test('older polls cannot rewind an acknowledged answer; rank ties use server duration', () => {
  assert.equal(mergeRaceProgress({a:{idx:5}}, {a:{idx:3}}).a.idx,5);
  const ranked=rankRacePlayers({a:{idx:5,correct:5,finished:true,duration_ms:2000},b:{idx:5,correct:5,finished:true,duration_ms:1000},c:{idx:4,correct:4,finished:false}});
  assert.deepEqual(ranked.map(r=>r.user_id),['b','a','c']);
});
