package com.vetmock.app

import android.content.Context
import android.os.Build
import android.os.VibrationAttributes
import android.os.VibrationEffect
import android.os.Vibrator
import android.provider.Settings
import android.view.HapticFeedbackConstants
import android.view.View

/**
 * Mochi's states as Android's own haptic vocabulary. performHapticFeedback follows the phone's touch-feedback
 * setting by itself; the composed milestone checks the same setting before it plays.
 *
 *   correct    CONFIRM (a firm single tick)       Mochi's "correct" pose
 *   wrong      REJECT (two soft ticks)            Mochi's "encourage" pose
 *   milestone  three rising clicks, 70 ms apart   a run of 3, 5, 10, 15... correct answers
 *   tap        KEYBOARD_TAP                       a light confirmation on press
 */
object Haptics {
    fun perform(view: View, kind: String): Boolean = when (kind) {
        "correct" -> view.performHapticFeedback(if (Build.VERSION.SDK_INT >= 30) HapticFeedbackConstants.CONFIRM else HapticFeedbackConstants.VIRTUAL_KEY)
        "wrong" -> view.performHapticFeedback(if (Build.VERSION.SDK_INT >= 30) HapticFeedbackConstants.REJECT else HapticFeedbackConstants.LONG_PRESS)
        "milestone" -> milestone(view)
        "tap" -> view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
        else -> false
    }

    private fun milestone(view: View): Boolean {
        val context = view.context
        if (Build.VERSION.SDK_INT < 30) return perform(view, "correct")
        val vibrator = context.getSystemService(Vibrator::class.java)
        if (vibrator == null || !vibrator.areAllPrimitivesSupported(VibrationEffect.Composition.PRIMITIVE_CLICK)) {
            return perform(view, "correct")
        }
        val effect = VibrationEffect.startComposition()
            .addPrimitive(VibrationEffect.Composition.PRIMITIVE_CLICK, 0.5f)
            .addPrimitive(VibrationEffect.Composition.PRIMITIVE_CLICK, 0.75f, 70)
            .addPrimitive(VibrationEffect.Composition.PRIMITIVE_CLICK, 1f, 70)
            .compose()
        if (Build.VERSION.SDK_INT >= 33) {
            // Touch usage: the system scales it by the touch-feedback intensity, and mutes it when that is off.
            vibrator.vibrate(effect, VibrationAttributes.createForUsage(VibrationAttributes.USAGE_TOUCH))
        } else {
            if (!touchFeedbackOn(context)) return false
            vibrator.vibrate(effect)
        }
        return true
    }

    private fun touchFeedbackOn(context: Context) =
        Settings.System.getInt(context.contentResolver, Settings.System.HAPTIC_FEEDBACK_ENABLED, 1) != 0
}
