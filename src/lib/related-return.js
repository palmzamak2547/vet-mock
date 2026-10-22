// Where the PDF reader's back lands after a "เอกสารที่เกี่ยวข้อง" row.
//
// App writes the topic here only when the student takes the reader's own way
// back (returnToLibrary), so the topic card or the VetWiki article can reopen
// the same list in view. Any other way out of the reader writes nothing. One
// read clears it. Kept out of library.js so App's bundle does not pull that in.
const KEY = 'vmx-related-return';

export function markRelatedReturn(target) {
  try { sessionStorage.setItem(KEY, target); } catch { /* storage off: no return point */ }
}

export function takeRelatedReturn(targets) {
  try {
    const t = sessionStorage.getItem(KEY);
    if (!t || !targets.includes(t)) return null;
    sessionStorage.removeItem(KEY);
    return t;
  } catch { return null; }
}
