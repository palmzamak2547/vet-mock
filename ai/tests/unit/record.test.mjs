import test from 'node:test';
import assert from 'node:assert/strict';
import { encodeWav, toMono16k } from '../../src/lib/record.js';

test('WAV header: RIFF/WAVE, PCM, mono, 16 kHz, 16-bit, sizes right', async () => {
  const wav = encodeWav(new Float32Array([0, 0.5, -0.5, 1, -1]));
  const b = Buffer.from(await wav.arrayBuffer());
  assert.equal(b.toString('ascii', 0, 4), 'RIFF');
  assert.equal(b.toString('ascii', 8, 12), 'WAVE');
  assert.equal(b.readUInt16LE(20), 1, 'PCM');
  assert.equal(b.readUInt16LE(22), 1, 'mono');
  assert.equal(b.readUInt32LE(24), 16000);
  assert.equal(b.readUInt16LE(34), 16);
  assert.equal(b.readUInt32LE(40), 10, 'five samples, two bytes each');
  assert.equal(b.length, 54);
  assert.equal(b.readInt16LE(44 + 6), 32767, 'full scale clips to the 16-bit maximum');
  assert.equal(b.readInt16LE(44 + 8), -32768);
});

test('stereo 48 kHz becomes mono 16 kHz, a third as long, levels kept', () => {
  const n = 4800;
  const left = Float32Array.from({ length: n }, () => 0.5);
  const right = Float32Array.from({ length: n }, () => -0.1);
  const out = toMono16k([left, right], 48000);
  assert.equal(out.length, 1600);
  assert.ok(Math.abs(out[800] - 0.2) < 1e-6);
  assert.equal(toMono16k([new Float32Array(10)], 16000).length, 10, '16 kHz passes through');
});
