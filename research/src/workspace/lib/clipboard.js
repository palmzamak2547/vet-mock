// Copy a paragraph to the clipboard as rich text Word keeps (a <p>) and as plain text. Tables go
// through lib/runtime/export.js copyTable; this is only for the methods and results paragraphs.
// Nothing leaves the device: the clipboard stays on this computer. OWNER: workspace role.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** @param {string} text @param {{ lang?: string }} [opts] @returns {Promise<'html'|'text'|'failed'>} */
export async function copyParagraph(text, opts = {}) {
  const html = `<p${opts.lang ? ` lang="${opts.lang}"` : ''} style="font-family: 'TH Sarabun New', Sarabun, sans-serif; font-size: 12pt; line-height: 1.5;">${esc(text)}</p>`;
  try {
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      await navigator.clipboard.write([new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([text], { type: 'text/plain' }),
      })]);
      return 'html';
    }
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return 'text';
    }
  } catch {
    /* permission refused or not a secure context: try the textarea path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok ? 'text' : 'failed';
  } catch {
    return 'failed';
  }
}
