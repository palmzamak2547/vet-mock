// ============================================================
// dialog — promise-based confirm/alert backed by the app's own dialog
// ============================================================
// window.confirm() / window.alert() ignore the theme, can't say more than
// one line, block the whole tab, and on a phone read as a browser warning
// rather than part of the app. ConfirmDialog already replaced them in the
// exam flow, but every other destructive action was still calling the OS.
//
// This keeps the ergonomics that made the native calls attractive — the
// call site reads the same, just with an await:
//
//   if (!(await confirmDialog({ title: 'ลบ deck?', tone: 'danger' }))) return;
//
// DialogHost (mounted once in App) registers the opener. Before it mounts,
// or if it somehow isn't there, we fall back to the native dialog rather
// than silently dropping a confirmation on a destructive action.
// ============================================================

let openDialog = null;

/** Called by DialogHost on mount. */
export function registerDialogHost(fn) {
  openDialog = fn;
  return () => { if (openDialog === fn) openDialog = null; };
}

function nativeText(opts) {
  return [opts.title, opts.body, opts.note].filter(Boolean).join('\n\n');
}

/** A plain string keeps working: first line is the title, the rest is body.
 *  window.alert() ran them together, and several call sites are already
 *  written that way (summary + reasons, code + instructions). */
function normalize(opts) {
  if (typeof opts !== 'string') return opts || {};
  const nl = opts.indexOf('\n');
  if (nl < 0) return { title: opts };
  return { title: opts.slice(0, nl).trim(), body: opts.slice(nl + 1).trim() };
}

/**
 * @param {{title: string, body?: string, note?: string,
 *          confirmLabel?: string, cancelLabel?: string,
 *          tone?: 'default'|'danger'}} opts
 * @returns {Promise<boolean>} true when confirmed
 */
export function confirmDialog(opts) {
  const o = normalize(opts);
  if (!openDialog) {
    return Promise.resolve(
      typeof window !== 'undefined' ? window.confirm(nativeText(o)) : false,
    );
  }
  return new Promise((resolve) => openDialog({ ...o, mode: 'confirm', resolve }));
}

/**
 * Ask for one line of text. Resolves to the string, or null if cancelled —
 * same contract as window.prompt(), so call sites keep their null check.
 * @param {{title: string, body?: string, placeholder?: string,
 *          maxLength?: number, multiline?: boolean, initial?: string,
 *          confirmLabel?: string}} opts
 */
export function promptDialog(opts) {
  const o = normalize(opts);
  if (!openDialog) {
    if (typeof window === 'undefined') return Promise.resolve(null);
    return Promise.resolve(window.prompt(nativeText(o), o.initial || ''));
  }
  return new Promise((resolve) => openDialog({
    ...o,
    mode: 'prompt',
    confirmLabel: o.confirmLabel || 'ส่ง',
    input: {
      placeholder: o.placeholder,
      maxLength: o.maxLength,
      multiline: o.multiline,
      initial: o.initial,
    },
    resolve,
  }));
}

/** Single-button notice. Resolves when dismissed. */
export function alertDialog(opts) {
  const o = normalize(opts);
  if (!openDialog) {
    if (typeof window !== 'undefined') window.alert(nativeText(o));
    return Promise.resolve();
  }
  return new Promise((resolve) => openDialog({
    ...o,
    mode: 'alert',
    confirmLabel: o.confirmLabel || 'เข้าใจแล้ว',
    resolve,
  }));
}
