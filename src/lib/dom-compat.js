// ── Survive DOM mutation by things outside the app ──────────────────
// React assumes it owns the nodes it created. Google Translate does not:
// on a Thai-language page Chrome readily offers to translate, and doing so
// rewraps text nodes in <font> elements. When React later tries to remove or
// reorder a node it no longer physically owns, the DOM throws
//   "Failed to execute 'removeChild' on 'Node': The node to be removed is
//    not a child of this node"
// and the error escapes React's render, taking the view down with it —
// a white screen for something the student did in their own browser chrome.
// Browser extensions that inject into the page do the same thing.
//
// Making these two operations no-ops when the node is not actually a child
// turns a crash into a cosmetic mismatch that the next render repairs. It
// does NOT block translation, which is the student's choice to make.
// Same defence Tipjai carries for the same reason.
if (typeof Node === 'function' && Node.prototype) {
  const nativeRemoveChild = Node.prototype.removeChild
  Node.prototype.removeChild = function (child) {
    if (child && child.parentNode !== this) return child
    return nativeRemoveChild.apply(this, arguments)
  }
  const nativeInsertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) return newNode
    return nativeInsertBefore.apply(this, arguments)
  }
}
