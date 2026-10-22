package com.vetmock.app

import android.content.Context
import android.net.ConnectivityManager
import android.net.Uri
import android.system.Os
import android.util.Base64
import android.util.Log
import android.webkit.MimeTypeMap
import android.webkit.WebResourceResponse
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Keeps the app's copy of the web build current without a Play update.
 *
 * The APK carries one complete build (assets/public, with its app-bundle.json). Each newer build vetmock.com
 * publishes lands in files/bundles/<build>/ holding only the files whose hash differs from the APK's, plus
 * index.html; the WebView client serves the unchanged ones straight from the APK. A downloaded build is switched
 * in at the next cold start and must report healthy (VetMock.ready) within two starts, or the app returns to the
 * previous build. Every file is checked against its SHA-256 before it is used. See docs/ADR-android-app.md.
 */
object BundleUpdater {
    private const val TAG = "VetMockBundle"
    private const val ORIGIN = "https://vetmock.com"
    private const val PREFS = "vmx_bundle"
    private const val CHECK_EVERY_MS = 30 * 60 * 1000L
    // A larger update waits for an unmetered network.
    private const val METERED_LIMIT_BYTES = 25L * 1000 * 1000
    private const val MAX_FILE_BYTES = 40L * 1000 * 1000
    private const val HEALTH_STARTS = 2

    private val worker = Executors.newSingleThreadExecutor()
    private val checking = AtomicBoolean(false)
    @Volatile private var active: Active? = null

    /** A manifest: path to base64url SHA-256, plus the page's CSP. */
    class Manifest(val build: String, val minNative: Int, val csp: String?, val files: Map<String, String>, val sizes: Map<String, Long>) {
        companion object {
            fun parse(text: String): Manifest {
                val json = JSONObject(text)
                val list: JSONArray = json.getJSONArray("files")
                val files = HashMap<String, String>(list.length() * 2)
                val sizes = HashMap<String, Long>(list.length() * 2)
                for (i in 0 until list.length()) {
                    val entry = list.getJSONArray(i)
                    val path = entry.getString(0)
                    require(safePath(path)) { "unsafe path in manifest: $path" }
                    files[path] = entry.getString(1)
                    sizes[path] = entry.getLong(2)
                }
                return Manifest(json.getString("build"), json.optInt("minNative", 1), json.optString("csp").ifEmpty { null }, files, sizes)
            }
        }
    }

    /** What the WebView serves right now. */
    class Active(val manifest: Manifest, val apk: Manifest, val dir: File?)

    fun safePath(path: String): Boolean =
        path.isNotEmpty() && !path.startsWith("/") && '\\' !in path && path.none { it.code < 0x20 } &&
            path.split('/').none { it.isEmpty() || it == "." || it == ".." }

    private fun prefs(context: Context) = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    private fun root(context: Context) = File(context.filesDir, "bundles")
    private fun capPrefs(context: Context) =
        context.getSharedPreferences(com.getcapacitor.plugin.WebView.WEBVIEW_PREFS_NAME, Context.MODE_PRIVATE)

    private fun apkManifest(context: Context): Manifest =
        context.assets.open("public/app-bundle.json").use { Manifest.parse(it.readBytes().decodeToString()) }

    /** Runs before Capacitor builds its bridge, which reads the base path we set here. */
    fun beforeBridge(context: Context) {
        val p = prefs(context)
        val native = BuildConfig.VERSION_CODE
        val edit = p.edit()
        try {
            val apkBuild = apkManifest(context).build
            if (p.getInt("native", -1) != native || p.getString("apk", null) != apkBuild) {
                // A new APK (Play update) brings its own, newer build: start from it.
                root(context).deleteRecursively()
                edit.clear().putInt("native", native).putString("apk", apkBuild)
                setBasePath(context, null)
                edit.apply()
                return
            }
            val pending = p.getString("pending", null)
            if (pending != null) {
                val starts = p.getInt("pendingStarts", 0) + 1
                if (starts > HEALTH_STARTS) {
                    Log.w(TAG, "build $pending never reported healthy; going back")
                    File(root(context), pending).deleteRecursively()
                    val previous = p.getString("previous", null)?.takeIf { complete(File(root(context), it)) }
                    setBasePath(context, previous?.let { File(root(context), it) })
                    edit.putString("current", previous).remove("pending").remove("pendingStarts").remove("etag")
                } else {
                    edit.putInt("pendingStarts", starts)
                }
                edit.apply()
                return
            }
            val next = p.getString("next", null)
            if (next != null && complete(File(root(context), next))) {
                setBasePath(context, File(root(context), next))
                edit.putString("previous", p.getString("current", null)).putString("current", next).remove("next")
                    .putString("pending", next).putInt("pendingStarts", 1)
            }
            edit.apply()
        } catch (e: Exception) {
            // The APK's own bundle always works: fall back to it rather than start broken.
            Log.e(TAG, "bundle state unreadable; using the APK's build", e)
            setBasePath(context, null)
            edit.clear().apply()
        }
    }

    private fun setBasePath(context: Context, dir: File?) {
        capPrefs(context).edit().putString(com.getcapacitor.plugin.WebView.CAP_SERVER_PATH, dir?.absolutePath ?: "").apply()
    }

    private fun complete(dir: File) = File(dir, ".complete").isFile

    /** The build being served, read once per process (the first request pays for parsing). */
    fun active(context: Context): Active {
        active?.let { return it }
        synchronized(this) {
            active?.let { return it }
            val apk = apkManifest(context)
            val current = prefs(context).getString("current", null)
            val dir = current?.let { File(root(context), it) }?.takeIf { complete(it) }
            val manifest = dir?.let { runCatching { Manifest.parse(File(it, "app-bundle.json").readText()) }.getOrNull() }
            return Active(manifest ?: apk, apk, if (manifest != null) dir else null).also { active = it }
        }
    }

    /** Builds the app holds: the APK's, the one served, and one waiting for the next start (or null). */
    fun status(context: Context): Triple<String, String, String?> {
        val a = active(context)
        return Triple(a.apk.build, a.manifest.build, prefs(context).getString("next", null))
    }

    /**
     * Switches to the waiting build now and reloads the page. The page calls this only where nothing is lost
     * by a reload (src/lib/native-app.js); otherwise the switch waits for the next cold start.
     */
    fun applyStaged(activity: MainActivity): Boolean {
        val p = prefs(activity)
        val next = p.getString("next", null) ?: return false
        val dir = File(root(activity), next)
        if (!complete(dir)) return false
        setBasePath(activity, dir)
        p.edit().putString("previous", p.getString("current", null)).putString("current", next).remove("next")
            .putString("pending", next).putInt("pendingStarts", 1).apply()
        synchronized(this) { active = null }
        activity.getBridge().setServerBasePath(dir.absolutePath)
        return true
    }

    /** The page reported its first paint: the build in use is healthy. */
    fun confirmHealthy(context: Context) {
        val p = prefs(context)
        if (p.getString("pending", null) == p.getString("current", null)) {
            p.edit().remove("pending").remove("pendingStarts").apply()
        }
    }

    /**
     * A file the current build shares with the APK, served from the APK (the bundles folder holds only what changed).
     * Null when Capacitor should serve it (from the bundles folder, or the APK when no newer build is active).
     */
    fun fromApk(context: Context, path: String): WebResourceResponse? {
        val a = active(context)
        val dir = a.dir ?: return null
        if (File(dir, path).isFile) return null
        if (a.apk.files[path] != a.manifest.files[path]) return null
        val stream: InputStream = runCatching { context.assets.open("public/$path") }.getOrNull() ?: return null
        return WebResourceResponse(mimeType(path), null, stream)
    }

    fun mimeType(path: String): String {
        val ext = path.substringAfterLast('.', "").lowercase()
        return when (ext) {
            "js", "mjs" -> "text/javascript"
            "css" -> "text/css"
            "html" -> "text/html"
            "json", "webmanifest" -> "application/json"
            "wasm" -> "application/wasm"
            "svg" -> "image/svg+xml"
            "woff2" -> "font/woff2"
            else -> MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext) ?: "application/octet-stream"
        }
    }

    /** Looks for a newer build in the background; at most every 30 minutes unless [force]. */
    fun check(context: Context, force: Boolean = false) {
        val app = context.applicationContext
        val p = prefs(app)
        if (!force && System.currentTimeMillis() - p.getLong("lastCheck", 0) < CHECK_EVERY_MS) return
        if (!checking.compareAndSet(false, true)) return
        worker.execute {
            try {
                download(app)
            } catch (e: Exception) {
                Log.w(TAG, "update check failed: ${e.message}")
            } finally {
                checking.set(false)
            }
        }
    }

    private fun download(context: Context) {
        val p = prefs(context)
        val conn = (URL("$ORIGIN/app-bundle.json").openConnection() as HttpURLConnection).apply {
            connectTimeout = 10_000
            readTimeout = 20_000
            p.getString("etag", null)?.let { setRequestProperty("If-None-Match", it) }
        }
        try {
            if (conn.responseCode == HttpURLConnection.HTTP_NOT_MODIFIED) {
                p.edit().putLong("lastCheck", System.currentTimeMillis()).apply()
                return
            }
            if (conn.responseCode != 200) return
            val text = conn.inputStream.use { it.readBytes().decodeToString() }
            val next = Manifest.parse(text)
            val a = active(context)
            val known = setOf(a.manifest.build, p.getString("next", null))
            if (next.build in known || next.minNative > BuildConfig.VERSION_CODE) {
                p.edit().putLong("lastCheck", System.currentTimeMillis()).putString("etag", conn.getHeaderField("ETag")).apply()
                return
            }
            // Only what differs from the APK is stored; index.html always, because Capacitor opens it from the folder.
            val wanted = next.files.filter { (path, hash) -> path == "index.html" || a.apk.files[path] != hash }
            val fetchBytes = wanted.filter { (path, hash) -> !(a.dir != null && a.manifest.files[path] == hash && File(a.dir, path).isFile) && a.apk.files[path] != hash }
                .keys.sumOf { next.sizes[it] ?: 0L }
            val cm = context.getSystemService(ConnectivityManager::class.java)
            if (fetchBytes > METERED_LIMIT_BYTES && cm?.isActiveNetworkMetered == true) return

            val staging = File(root(context), ".staging-${next.build}").apply { deleteRecursively(); mkdirs() }
            for ((path, hash) in wanted) {
                val target = File(staging, path).apply { parentFile?.mkdirs() }
                val reuse = a.dir?.let { File(it, path) }?.takeIf { it.isFile && a.manifest.files[path] == hash }
                when {
                    reuse != null -> runCatching { Os.link(reuse.absolutePath, target.absolutePath) }.getOrElse { reuse.copyTo(target, true) }
                    a.apk.files[path] == hash -> context.assets.open("public/$path").use { input -> target.outputStream().use { input.copyTo(it) } }
                    else -> fetch(path, hash, target)
                }
            }
            File(staging, "app-bundle.json").writeText(text)
            File(staging, ".complete").writeText(next.build)
            val dest = File(root(context), next.build)
            dest.deleteRecursively()
            check(staging.renameTo(dest)) { "could not move the new build into place" }
            p.edit().putString("next", next.build).putString("etag", conn.getHeaderField("ETag"))
                .putLong("lastCheck", System.currentTimeMillis()).apply()
            // Keep only what is in use, staged, or the fallback.
            val keep = setOf(next.build, p.getString("current", null), p.getString("previous", null))
            root(context).listFiles()?.filter { it.name !in keep }?.forEach { it.deleteRecursively() }
            Log.i(TAG, "build ${next.build} ready for the next start (${fetchBytes / 1000} kB downloaded)")
        } finally {
            conn.disconnect()
        }
    }

    private fun fetch(path: String, hash: String, target: File) {
        val url = ORIGIN + "/" + path.split('/').joinToString("/") { Uri.encode(it) }
        val conn = (URL(url).openConnection() as HttpURLConnection).apply {
            connectTimeout = 10_000
            readTimeout = 30_000
        }
        try {
            check(conn.responseCode == 200) { "HTTP ${conn.responseCode} for $path" }
            val digest = MessageDigest.getInstance("SHA-256")
            var total = 0L
            conn.inputStream.use { input ->
                target.outputStream().use { output ->
                    val buffer = ByteArray(64 * 1024)
                    while (true) {
                        val n = input.read(buffer)
                        if (n < 0) break
                        total += n
                        check(total <= MAX_FILE_BYTES) { "$path is larger than any build file should be" }
                        digest.update(buffer, 0, n)
                        output.write(buffer, 0, n)
                    }
                }
            }
            val got = Base64.encodeToString(digest.digest(), Base64.URL_SAFE or Base64.NO_PADDING or Base64.NO_WRAP)
            check(got == hash) { "hash mismatch for $path" }
        } finally {
            conn.disconnect()
        }
    }
}
