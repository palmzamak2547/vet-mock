// WebKit logs Cache API cancellation in native code before returning the
// exception, even when the application's promise rejection is handled.
// https://github.com/WebKit/WebKit/blob/main/Source/WebCore/Modules/cache/DOMCacheEngine.cpp
// Limit classification to its exact native signature during document reload.
export function isCacheShutdownDiagnostic(error, browserName, navigating) {
  return browserName === 'webkit' && navigating === true
    && error?.name === 'Cache API operation failed'
    && error.message === 'Context is stopped' && error.stack === '';
}
