// Module worker entry [M1-DESIGN.md 11]. Parses files, applies recipes and runs analyses off the main
// thread. Uses self.* for every global (lint:bindings). No network: this file and everything it
// imports must pass tests/unit/no-egress.test.mjs. OWNER: runtime role.
import { OPS, REPLY, ENGINE_VERSION } from './protocol.js';

/** @param {MessageEvent} event */
self.onmessage = (event) => {
  const { id, op } = event.data || {};
  if (op === OPS.HELLO) {
    self.postMessage({ id, type: REPLY.RESULT, result: { engineVersion: ENGINE_VERSION, features: { xlsx: false } } });
    return;
  }
  self.postMessage({ id, type: REPLY.ERROR, error: { code: 'not-implemented', key: 'runtime.engine.notReady' } });
};
