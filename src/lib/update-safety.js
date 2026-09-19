// Installing a worker and replacing a running document are different actions.
// Every view can hold work not represented by its URL: a draft, a PDF, a
// playing clip, a dialog, or simply the current reading position. There is no
// safe-view list. Automatic updates prepare the NEXT document; the current
// document is only replaced by a browser navigation or an explicit retry.
export function publishUpdateStatus(target, reason, version = null) {
  const detail = { state: reason === 'preload-error' ? 'deferred' : 'ready', reason, version };
  target.__VMX_UPDATE_STATUS__ = detail;
  target.document.documentElement.dataset.vmxUpdateStatus = detail.state;
  if (detail.state === 'deferred') {
    target.dispatchEvent(new target.CustomEvent('vmx-update-deferred', { detail }));
  }
  target.dispatchEvent(new target.CustomEvent('vmx-sw-update', { detail }));
  return detail;
}
