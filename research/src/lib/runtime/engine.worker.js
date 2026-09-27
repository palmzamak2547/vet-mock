// Module worker entry [M1-DESIGN.md 11]. Parses files, applies recipes and runs analyses off the main
// thread. Uses self.* for every global (lint:bindings). No network: this file and everything it
// imports must pass tests/unit/no-egress.test.mjs. OWNER: runtime role.
import { REPLY } from './protocol.js';
import { handleRequest, toEngineError } from './engine-core.js';

/** @param {MessageEvent} event */
self.onmessage = async (event) => {
  const { id, op, payload } = event.data || {};
  try {
    const { result, transfer } = await handleRequest(op, payload, {
      mode: 'worker',
      onProgress: (progress) => self.postMessage({ id, type: REPLY.PROGRESS, progress }),
    });
    self.postMessage({ id, type: REPLY.RESULT, result }, transfer);
  } catch (e) {
    self.postMessage({ id, type: REPLY.ERROR, error: toEngineError(e) });
  }
};
