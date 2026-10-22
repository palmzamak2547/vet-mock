package com.vetmock.app

import android.Manifest
import android.content.ActivityNotFoundException
import android.content.ClipData
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.util.Base64
import androidx.activity.result.ActivityResultLauncher
import androidx.browser.auth.AuthTabIntent
import androidx.browser.customtabs.CustomTabColorSchemeParams
import androidx.browser.customtabs.CustomTabsIntent
import androidx.core.content.FileProvider
import androidx.credentials.CredentialManager
import androidx.credentials.CredentialManagerCallback
import androidx.credentials.GetCredentialRequest
import androidx.credentials.GetCredentialResponse
import androidx.credentials.exceptions.GetCredentialException
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.PermissionState
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback
import com.google.android.gms.tasks.Task
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateOptions
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.InstallStatus
import com.google.android.play.core.install.model.UpdateAvailability
import com.google.android.play.core.review.ReviewManagerFactory
import java.io.File
import java.util.concurrent.Executors

/**
 * Everything the page asks of the phone, as window.VetMockApp (src/lib/native-app.js). Each method is small and
 * resolves quickly; nothing here blocks the page's main thread.
 */
@CapacitorPlugin(
    name = "VetMock",
    permissions = [Permission(alias = "notifications", strings = [Manifest.permission.POST_NOTIFICATIONS])],
)
class VetMockPlugin : Plugin() {
    private var speech: Speech? = null
    private lateinit var authTab: ActivityResultLauncher<Intent>
    private val io = Executors.newSingleThreadExecutor()

    override fun load() {
        // Registered before the activity starts, as the Activity Result API requires.
        authTab = AuthTabIntent.registerActivityResultLauncher(activity) { result ->
            if (result.resultCode == AuthTabIntent.RESULT_OK) result.resultUri?.let { bridge.webView.loadUrl(it.toString()) }
        }
    }

    override fun handleOnResume() {
        BundleUpdater.check(context)
    }

    override fun handleOnDestroy() {
        speech?.shutdown()
        speech = null
    }

    // ---- The page's first paint, theme and updates ------------------------------------------------------------

    @PluginMethod
    fun ready(call: PluginCall) {
        activity.runOnUiThread { (activity as? MainActivity)?.markWebReady() }
        BundleUpdater.confirmHealthy(context)
        BundleUpdater.check(context)
        checkPlayUpdate()
        call.resolve()
    }

    @PluginMethod
    fun setTheme(call: PluginCall) {
        val pref = call.getString("pref") ?: "system"
        val shown = call.getString("shown") ?: "light"
        activity.runOnUiThread { Theme.apply(activity, pref, shown) }
        call.resolve()
    }

    @PluginMethod
    fun bundleStatus(call: PluginCall) {
        val (apk, current, next) = BundleUpdater.status(context)
        call.resolve(JSObject().put("apk", apk).put("current", current).put("next", next)
            .put("version", BuildConfig.VERSION_NAME).put("versionCode", BuildConfig.VERSION_CODE))
    }

    @PluginMethod
    fun applyUpdate(call: PluginCall) {
        activity.runOnUiThread {
            val applied = (activity as? MainActivity)?.let { BundleUpdater.applyStaged(it) } ?: false
            call.resolve(JSObject().put("applied", applied))
        }
    }

    // ---- Haptics ----------------------------------------------------------------------------------------------

    @PluginMethod
    fun haptic(call: PluginCall) {
        val kind = call.getString("kind") ?: "tap"
        activity.runOnUiThread { Haptics.perform(bridge.webView, kind) }
        call.resolve()
    }

    // ---- The study day: widget and reminder -------------------------------------------------------------------

    @PluginMethod
    fun studyDay(call: PluginCall) {
        val day = call.getString("day") ?: Study.today()
        val answered = call.getInt("answeredToday") ?: 0
        Study.saveDay(context, call.getInt("streak") ?: 0, answered, day)
        if (answered > 0 && day == Study.today()) Reminders.onPracticed(context) else StudyWidget.updateAll(context)
        call.resolve()
    }

    @PluginMethod
    fun setExam(call: PluginCall) {
        Study.saveExam(context, call.getString("label"), call.getString("date"))
        StudyWidget.updateAll(context)
        call.resolve()
    }

    @PluginMethod
    fun getReminder(call: PluginCall) {
        call.resolve(JSObject().put("enabled", Reminders.enabled(context)).put("minute", Reminders.minute(context))
            .put("picked", Reminders.pickedMinute(context) != null))
    }

    @PluginMethod
    fun setReminder(call: PluginCall) {
        Reminders.set(context, call.getBoolean("enabled", true) ?: true, call.getInt("minute"))
        getReminder(call)
    }

    // ---- Notifications: asked only when the page asks, after a streak extension -------------------------------

    private fun notificationState(): String {
        if (Reminders.canNotify(context)) return "granted"
        if (Build.VERSION.SDK_INT < 33) return "denied"
        val asked = context.getSharedPreferences("vmx_app", Context.MODE_PRIVATE).getBoolean("askedNotifications", false)
        return if (!asked || activity.shouldShowRequestPermissionRationale(Manifest.permission.POST_NOTIFICATIONS)) "prompt" else "denied"
    }

    @PluginMethod
    fun notificationStatus(call: PluginCall) {
        call.resolve(JSObject().put("state", notificationState()))
    }

    @PluginMethod
    fun requestNotifications(call: PluginCall) {
        val state = notificationState()
        if (state != "prompt" || Build.VERSION.SDK_INT < 33) {
            if (state == "granted") Reminders.set(context, true, Reminders.pickedMinute(context))
            call.resolve(JSObject().put("state", state))
            return
        }
        context.getSharedPreferences("vmx_app", Context.MODE_PRIVATE).edit().putBoolean("askedNotifications", true).apply()
        requestPermissionForAlias("notifications", call, "notificationsAnswered")
    }

    @PermissionCallback
    private fun notificationsAnswered(call: PluginCall) {
        val granted = getPermissionState("notifications") == PermissionState.GRANTED
        if (granted) Reminders.set(context, true, Reminders.pickedMinute(context))
        call.resolve(JSObject().put("state", if (granted) "granted" else "denied"))
    }

    /** For a student who said no and changes their mind: the system page for this app's notifications. */
    @PluginMethod
    fun openNotificationSettings(call: PluginCall) {
        val intent = Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).putExtra(Settings.EXTRA_APP_PACKAGE, context.packageName)
        runCatching { activity.startActivity(intent) }
        call.resolve()
    }

    // ---- Share sheet: navigator.share for the WebView, files included -----------------------------------------

    @PluginMethod
    fun share(call: PluginCall) {
        val title = call.getString("title")
        val text = listOfNotNull(call.getString("text"), call.getString("url")).joinToString("\n").ifBlank { null }
        val files: JSArray = call.getArray("files") ?: JSArray()
        io.execute {
            try {
                val dir = File(context.cacheDir, "share").apply { mkdirs() }
                // Yesterday's cards are not needed by anyone.
                dir.listFiles()?.filter { System.currentTimeMillis() - it.lastModified() > 3_600_000 }?.forEach { it.delete() }
                val uris = ArrayList<Uri>()
                var type: String? = null
                for (i in 0 until files.length()) {
                    val f = files.getJSONObject(i)
                    val name = f.optString("name", "vetmock-$i").replace(Regex("[^\\w.ก-๙-]"), "_").take(80)
                    val file = File(dir, name)
                    file.writeBytes(Base64.decode(f.getString("data"), Base64.DEFAULT))
                    uris += FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", file)
                    type = f.optString("type", "application/octet-stream")
                }
                val intent = when {
                    uris.size > 1 -> Intent(Intent.ACTION_SEND_MULTIPLE).putParcelableArrayListExtra(Intent.EXTRA_STREAM, uris)
                    uris.size == 1 -> Intent(Intent.ACTION_SEND).putExtra(Intent.EXTRA_STREAM, uris[0])
                    else -> Intent(Intent.ACTION_SEND)
                }.apply {
                    setType(if (uris.size == 1) type else if (uris.isEmpty()) "text/plain" else "*/*")
                    text?.let { putExtra(Intent.EXTRA_TEXT, it) }
                    title?.let { putExtra(Intent.EXTRA_TITLE, it) }
                    if (uris.isNotEmpty()) {
                        clipData = ClipData.newRawUri(title ?: "", uris[0]).apply { uris.drop(1).forEach { addItem(ClipData.Item(it)) } }
                        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    }
                }
                activity.runOnUiThread {
                    activity.startActivity(Intent.createChooser(intent, title))
                    call.resolve()
                }
            } catch (e: Exception) {
                call.reject("share failed", "SHARE_FAILED", e)
            }
        }
    }

    // ---- Read-aloud: speechSynthesis for the WebView ----------------------------------------------------------

    private fun speech(): Speech = speech ?: Speech(context) { id, type ->
        notifyListeners("speech", JSObject().put("id", id).put("type", type))
    }.also { speech = it }

    @PluginMethod
    fun speak(call: PluginCall) {
        speech().speak(call.getString("id") ?: "", call.getString("text") ?: "", call.getString("lang") ?: "th-TH",
            call.getFloat("rate") ?: 1f, call.getFloat("pitch") ?: 1f)
        call.resolve()
    }

    @PluginMethod
    fun stopSpeaking(call: PluginCall) {
        speech?.stop()
        call.resolve()
    }

    @PluginMethod
    fun speechLanguages(call: PluginCall) {
        call.resolve(JSObject().put("languages", JSArray(speech().languages())))
    }

    // ---- Google sign-in with Android's account sheet ----------------------------------------------------------

    @PluginMethod
    fun googleIdToken(call: PluginCall) {
        val clientId = call.getString("clientId") ?: return call.reject("no client id", "NO_CLIENT_ID")
        val option = GetSignInWithGoogleOption.Builder(clientId).apply { call.getString("nonce")?.let { setNonce(it) } }.build()
        val request = GetCredentialRequest.Builder().addCredentialOption(option).build()
        CredentialManager.create(context).getCredentialAsync(activity, request, null, io,
            object : CredentialManagerCallback<GetCredentialResponse, GetCredentialException> {
                override fun onResult(result: GetCredentialResponse) {
                    try {
                        val token = GoogleIdTokenCredential.createFrom(result.credential.data).idToken
                        call.resolve(JSObject().put("idToken", token))
                    } catch (e: Exception) {
                        call.reject("not a Google credential", "UNEXPECTED_CREDENTIAL", e)
                    }
                }

                override fun onError(e: GetCredentialException) {
                    call.reject(e.message ?: "sign-in failed", e.type, e)
                }
            })
    }

    // ---- Play: review at a genuine happy moment, updates ------------------------------------------------------

    @PluginMethod
    fun happyMoment(call: PluginCall) {
        val p = context.getSharedPreferences("vmx_app", Context.MODE_PRIVATE)
        val now = System.currentTimeMillis()
        val firstSeen = p.getLong("firstSeen", 0L).takeIf { it > 0 } ?: now.also { p.edit().putLong("firstSeen", it).apply() }
        val lastAsked = p.getLong("reviewAsked", 0L)
        // Not in the first three days, and at most once in 120: Play also limits how often the sheet appears.
        if (now - firstSeen < 3 * DAY || now - lastAsked < 120 * DAY) return call.resolve(JSObject().put("asked", false))
        val manager = ReviewManagerFactory.create(context)
        manager.requestReviewFlow().addOnCompleteListener { info ->
            if (!info.isSuccessful) return@addOnCompleteListener call.resolve(JSObject().put("asked", false))
            p.edit().putLong("reviewAsked", now).apply()
            manager.launchReviewFlow(activity, info.result).addOnCompleteListener { call.resolve(JSObject().put("asked", true)) }
        }
    }

    /** A flexible Play update after three days of staleness; installed when the student next leaves the app. */
    private fun checkPlayUpdate() {
        val manager = AppUpdateManagerFactory.create(context)
        manager.registerListener { state ->
            if (state.installStatus() == InstallStatus.DOWNLOADED) pendingInstall = { manager.completeUpdate() }
        }
        manager.appUpdateInfo.addOnSuccessListener { info ->
            val stale = (info.clientVersionStalenessDays() ?: 0) >= 3
            if (info.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE && stale && info.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)) {
                runCatching { manager.startUpdateFlow(info, activity, AppUpdateOptions.defaultOptions(AppUpdateType.FLEXIBLE)) }
            }
        }
    }

    private var pendingInstall: (() -> Task<Void>)? = null

    override fun handleOnStop() {
        pendingInstall?.invoke()
        pendingInstall = null
    }

    // ---- Links that leave vetmock.com ---------------------------------------------------------------------------

    /**
     * Sign-in pages (Supabase's Google and Discord, LINE's) open in an Auth Tab and come back to the app at
     * https://vetmock.com/ with the session in the address; other sites open in a Custom Tab over the app.
     */
    override fun shouldOverrideLoad(url: Uri): Boolean? {
        if (url.host == MainActivity.HOST) return null
        if (url.scheme != "https" && url.scheme != "http") return null
        val host = url.host.orEmpty()
        val signIn = (host.endsWith(".supabase.co") && url.path.orEmpty().startsWith("/auth/v1/authorize")) || host == "access.line.me"
        try {
            if (signIn) AuthTabIntent.Builder().build().launch(authTab, url, MainActivity.HOST, "/")
            else customTab().launchUrl(activity, url)
        } catch (e: ActivityNotFoundException) {
            runCatching { activity.startActivity(Intent(Intent.ACTION_VIEW, url)) }
        }
        return true
    }

    private fun customTab(): CustomTabsIntent {
        fun scheme(bg: String) = CustomTabColorSchemeParams.Builder().setToolbarColor(Color.parseColor(bg)).build()
        return CustomTabsIntent.Builder()
            .setShowTitle(true)
            .setColorSchemeParams(CustomTabsIntent.COLOR_SCHEME_LIGHT, scheme("#F6EFE4"))
            .setColorSchemeParams(CustomTabsIntent.COLOR_SCHEME_DARK, scheme("#1A1612"))
            .build()
    }

    private companion object {
        const val DAY = 86_400_000L
    }
}
