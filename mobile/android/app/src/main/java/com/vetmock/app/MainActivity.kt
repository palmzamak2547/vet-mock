package com.vetmock.app

import android.content.Intent
import android.os.Bundle
import android.os.SystemClock
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.content.ContextCompat
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.getcapacitor.BridgeActivity

/**
 * The app's one screen: the vetmock.com web build in a WebView (Capacitor), served from the app's own storage.
 * See docs/ADR-android-app.md.
 */
class MainActivity : BridgeActivity() {
    @Volatile private var webReady = false
    private val createdAt = SystemClock.uptimeMillis()
    private lateinit var back: OnBackPressedCallback

    override fun onCreate(savedInstanceState: Bundle?) {
        // The student's own theme pick, before any window exists, so the splash, the window and the page's
        // prefers-color-scheme all agree from the first frame.
        AppCompatDelegate.setDefaultNightMode(Theme.nightMode(this))
        val splash = installSplashScreen()
        // Held until the page reports its first paint (VetMock.ready), never longer than SPLASH_MAX_MS.
        splash.setKeepOnScreenCondition { !webReady && SystemClock.uptimeMillis() - createdAt < SPLASH_MAX_MS }
        // Applies a downloaded bundle, or rolls back one that never reported healthy, before the bridge reads it.
        BundleUpdater.beforeBridge(this)
        registerPlugin(VetMockPlugin::class.java)
        super.onCreate(savedInstanceState)

        val webView = bridge.webView
        webView.setBackgroundColor(ContextCompat.getColor(this, R.color.vmx_bg))
        webView.settings.userAgentString = "${webView.settings.userAgentString} VetMockApp/${BuildConfig.VERSION_NAME}"
        // Back walks the page's own history first; at its root the system takes over (predictive back to home).
        back = object : OnBackPressedCallback(false) {
            override fun handleOnBackPressed() = webView.goBack()
        }
        onBackPressedDispatcher.addCallback(this, back)
        bridge.setWebViewClient(AppWebViewClient(bridge, this))
    }

    /** Called by the WebView client whenever the page's history changes. */
    fun onHistoryChanged() {
        back.isEnabled = bridge.webView.canGoBack()
    }

    /** The page has painted its first screen: drop the splash, and tell Android the start is complete. */
    fun markWebReady() {
        if (webReady) return
        webReady = true
        reportFullyDrawn()
    }

    /** App Links, shortcuts, the widget and sign-in returns all arrive as https://vetmock.com/... */
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        val url = intent.data ?: return
        if (url.scheme == "https" && url.host == HOST) bridge.webView.loadUrl(url.toString())
    }

    companion object {
        const val HOST = "vetmock.com"
        private const val SPLASH_MAX_MS = 2500L
    }
}
