package com.vetmock.app

import android.app.Activity
import android.content.Context
import android.graphics.Color
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.view.WindowCompat

/**
 * The theme the student picked on the page (vmx-theme: light, dark or system), kept for the next launch so the
 * splash and the first frame already match it, and applied to the system bars as soon as the page switches.
 */
object Theme {
    private const val PREFS = "vmx_app"
    private const val KEY = "theme"
    // Mirrors res/values*/colors.xml vmx_bg; needed for the theme the page shows, not the one Android resolved.
    private val BG_LIGHT = Color.parseColor("#F6EFE4")
    private val BG_DARK = Color.parseColor("#1A1612")

    fun nightMode(context: Context): Int =
        when (context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY, "system")) {
            "light" -> AppCompatDelegate.MODE_NIGHT_NO
            "dark" -> AppCompatDelegate.MODE_NIGHT_YES
            else -> AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM
        }

    /** [pref] is what the student chose; [shown] is the theme the page now draws (light or dark). */
    fun apply(activity: Activity, pref: String, shown: String) {
        if (pref in setOf("light", "dark", "system")) {
            activity.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(KEY, pref).apply()
        }
        val light = shown != "dark"
        val bg = if (light) BG_LIGHT else BG_DARK
        activity.window.decorView.setBackgroundColor(bg)
        (activity as? MainActivity)?.getBridge()?.webView?.setBackgroundColor(bg)
        WindowCompat.getInsetsController(activity.window, activity.window.decorView).apply {
            isAppearanceLightStatusBars = light
            isAppearanceLightNavigationBars = light
        }
    }
}
