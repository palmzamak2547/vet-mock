package com.vetmock.app

import android.net.Uri
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import com.getcapacitor.Bridge
import com.getcapacitor.BridgeWebViewClient

/**
 * Decides, per request to https://vetmock.com, whether the app's own copy answers it or the real site does.
 *
 *   /api/*                              the real site (the WebView sends it with its body, as a browser would)
 *   a file the build carries            the app's copy (the bundles folder, or the APK)
 *   any other file (figures, atlas...)  the real site; the WebView's HTTP cache keeps what was seen
 *   a page address                      index.html from the app's copy, under the production CSP
 */
class AppWebViewClient(bridge: Bridge, private val activity: MainActivity) : BridgeWebViewClient(bridge) {
    override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
        val url = request.url
        if (url.host != MainActivity.HOST || url.scheme != "https") return super.shouldInterceptRequest(view, request)
        if (request.method != "GET") return null
        val path = url.path.orEmpty().ifEmpty { "/" }
        if (path.startsWith("/api/")) return null
        // Capacitor's own local-file and HTTP routes.
        if (path.startsWith("/_capacitor_")) return super.shouldInterceptRequest(view, request)

        val active = BundleUpdater.active(activity)
        val isFile = url.lastPathSegment?.contains('.') == true
        if (isFile) {
            val rel = Uri.decode(path.removePrefix("/"))
            if (rel !in active.manifest.files) return null
            BundleUpdater.fromApk(activity, rel)?.let { return it }
        }
        val response = super.shouldInterceptRequest(view, request)
        if (request.isForMainFrame && response != null) {
            active.manifest.csp?.let { csp ->
                response.responseHeaders = (response.responseHeaders ?: emptyMap()) + ("Content-Security-Policy" to csp)
            }
        }
        return response
    }

    /** Only the page itself navigates out of the app; an embedded frame (a video, a document) stays in its frame. */
    override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean =
        if (!request.isForMainFrame) false else super.shouldOverrideUrlLoading(view, request)

    override fun doUpdateVisitedHistory(view: WebView, url: String?, isReload: Boolean) {
        super.doUpdateVisitedHistory(view, url, isReload)
        activity.onHistoryChanged()
    }
}
