import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount } from '../helpers/fake-react.mjs';

test('modal return focus follows the actual pointer, keyboard or explicit launcher', async t => {
  const previous = new Map(['window', 'document', 'Element', 'HTMLElement'].map(key => [key, globalThis[key]]));
  const events = new Map(), frames = [];
  class Control {
    isConnected = true;
    constructor(name) { this.name = name; }
    closest(selector) { return selector.includes('aria-hidden') ? null : this; }
    getClientRects() { return [{}]; }
    focus() { document.activeElement = this; }
    querySelectorAll() { return [acknowledge]; }
  }
  const body = new Control('body'), stale = new Control('earlier parent control');
  const pointer = new Control('tapped launcher'), keyboard = new Control('keyboard launcher');
  const explicit = new Control('explicit launcher'), acknowledge = new Control('acknowledge');
  globalThis.Element = globalThis.HTMLElement = Control;
  globalThis.document = {
    body, activeElement: stale,
    addEventListener(type, listener) { if (!events.has(type)) events.set(type, new Set()); events.get(type).add(listener); },
    removeEventListener(type, listener) { events.get(type)?.delete(listener); },
    querySelectorAll() { return []; },
  };
  globalThis.window = { requestAnimationFrame(callback) { frames.push(callback); return frames.length; }, cancelAnimationFrame() {} };
  t.after(() => { for (const [key, value] of previous) { if (value === undefined) delete globalThis[key]; else globalThis[key] = value; } });
  const { useModalFocus } = await loadModule('src/hooks/useModalFocus.js');
  const dispatch = (type, event) => { for (const listener of events.get(type) || []) listener(event); };
  function Dialog(props) {
    const ref = useModalFocus(props);
    ref.current = new Control('dialog');
    return null;
  }
  for (const kind of ['pointer', 'keyboard', 'explicit']) {
    document.activeElement = stale;
    dispatch('pointerdown', { target: pointer });
    if (kind === 'keyboard') {
      document.activeElement = keyboard;
      dispatch('keydown', { key: 'Enter', target: keyboard });
    }
    const panel = mount(Dialog, kind === 'explicit' ? { returnFocusRef: { current: explicit } } : {});
    frames.splice(0).forEach(callback => callback());
    assert.equal(document.activeElement, acknowledge, `${kind}: initial focus enters the dialog`);
    panel.unmount();
    assert.equal(document.activeElement, { pointer, keyboard, explicit }[kind], `${kind}: closing restores its real launcher`);
  }
});
