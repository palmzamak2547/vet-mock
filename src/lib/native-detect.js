// ============================================================
// native-detect — is this page inside the VetMock Android app?
// ============================================================
// The one answer the first load needs. Everything the app layer does
// (window.VetMockApp, the WebView's missing APIs, the splash and widget
// messages) lives in native-app.js, which main.jsx loads only when this is
// true and starts the app after it, so no module reads window.VetMockApp
// before it exists. In a browser that file is never fetched.
// ============================================================

const cap = typeof window !== 'undefined' ? window.Capacitor : undefined;

/** True only inside the Android app. */
export const IS_APP = Boolean(cap?.isNativePlatform?.() && cap.getPlatform?.() === 'android');
