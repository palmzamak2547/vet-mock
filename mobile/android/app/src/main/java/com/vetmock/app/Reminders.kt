package com.vetmock.app

import android.Manifest
import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import java.util.Calendar
import java.util.TimeZone

/**
 * One daily reminder, only on days the student has not practised yet, at the time they usually study
 * (the median of their recent first sets, 19:00 until three days are known). It is an inexact alarm
 * (setAndAllowWhileIdle): no exact-alarm permission, batched with the system's own wake-ups. The same alarm
 * refreshes the widget just after midnight, when "today" changes. Practising cancels the day's reminder.
 */
object Reminders {
    const val CHANNEL = "study_reminder"
    private const val PREFS = "vmx_reminder"
    private const val ACTION_FIRE = "com.vetmock.app.REMINDER"
    private const val NOTIFICATION_ID = 1
    private const val DEFAULT_MINUTE = 19 * 60
    // A reminder is late, not wrong, for this long after its time; past it the day is left alone.
    private const val LATE_WINDOW_MIN = 180
    private val BANGKOK: TimeZone = TimeZone.getTimeZone("Asia/Bangkok")

    private fun prefs(context: Context) = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    fun enabled(context: Context) = prefs(context).getBoolean("enabled", false)

    /** Minutes past midnight (Bangkok): the student's pick, else their usual time, else 19:00. */
    fun minute(context: Context): Int =
        prefs(context).getInt("minute", -1).takeIf { it >= 0 } ?: Study.usualMinute(context) ?: DEFAULT_MINUTE

    fun pickedMinute(context: Context): Int? = prefs(context).getInt("minute", -1).takeIf { it >= 0 }

    fun set(context: Context, enabled: Boolean, minute: Int?) {
        prefs(context).edit().putBoolean("enabled", enabled).apply {
            if (minute == null) remove("minute") else putInt("minute", minute.coerceIn(0, 24 * 60 - 1))
        }.apply()
        schedule(context)
    }

    fun canNotify(context: Context): Boolean {
        if (Build.VERSION.SDK_INT >= 33 &&
            ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) return false
        return NotificationManagerCompat.from(context).areNotificationsEnabled()
    }

    private fun bangkok(ms: Long) = Calendar.getInstance(BANGKOK).apply { timeInMillis = ms }

    /** The next moment (epoch ms) when the clock in Bangkok reads [minute], strictly after [now]. */
    fun nextAt(minute: Int, now: Long): Long {
        val c = bangkok(now).apply {
            set(Calendar.HOUR_OF_DAY, minute / 60); set(Calendar.MINUTE, minute % 60)
            set(Calendar.SECOND, 0); set(Calendar.MILLISECOND, 0)
        }
        if (c.timeInMillis <= now) c.add(Calendar.DAY_OF_MONTH, 1)
        return c.timeInMillis
    }

    private fun pendingIntent(context: Context): PendingIntent =
        PendingIntent.getBroadcast(context, 0, Intent(context, ReminderReceiver::class.java).setAction(ACTION_FIRE),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)

    fun schedule(context: Context) {
        val am = context.getSystemService(AlarmManager::class.java) ?: return
        val now = System.currentTimeMillis()
        val times = mutableListOf<Long>()
        if (enabled(context)) {
            val day = Study.read(context)
            var at = nextAt(minute(context), now)
            // Already practised today: the next reminder is tomorrow's.
            if (Study.practicedToday(day) && Study.dateKey(at) == Study.today(now)) at = nextAt(minute(context), at)
            times += at
        }
        if (StudyWidget.hasWidgets(context)) times += nextAt(5, now)
        val at = times.minOrNull()
        if (at == null) am.cancel(pendingIntent(context)) else am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pendingIntent(context))
    }

    /** The student practised: today's reminder is no longer needed, and the widget changes. */
    fun onPracticed(context: Context) {
        NotificationManagerCompat.from(context).cancel(NOTIFICATION_ID)
        StudyWidget.updateAll(context)
        schedule(context)
    }

    fun onAlarm(context: Context) {
        StudyWidget.updateAll(context)
        val now = System.currentTimeMillis()
        val nowMinute = bangkok(now).let { it.get(Calendar.HOUR_OF_DAY) * 60 + it.get(Calendar.MINUTE) }
        val late = nowMinute - minute(context)
        val p = prefs(context)
        val day = Study.read(context)
        if (enabled(context) && late in 0..LATE_WINDOW_MIN && !Study.practicedToday(day) &&
            p.getString("notified", null) != Study.today(now) && canNotify(context)
        ) {
            notify(context, Study.liveStreak(day), now)
            p.edit().putString("notified", Study.today(now)).apply()
        }
        schedule(context)
    }

    private fun notify(context: Context, streak: Int, now: Long) {
        if (Build.VERSION.SDK_INT >= 26) {
            val channel = NotificationChannel(CHANNEL, context.getString(R.string.channel_reminder_name), NotificationManager.IMPORTANCE_DEFAULT)
                .apply { description = context.getString(R.string.channel_reminder_desc) }
            context.getSystemService(NotificationManager::class.java)?.createNotificationChannel(channel)
        }
        // Gone at midnight if it was not opened: a reminder about yesterday is noise.
        val untilMidnight = nextAt(0, now) - now
        val body = if (streak > 0) context.getString(R.string.reminder_body_streak, streak) else context.getString(R.string.reminder_body_start)
        val notification = NotificationCompat.Builder(context, CHANNEL)
            .setSmallIcon(R.drawable.ic_launcher_monochrome)
            .setColor(ContextCompat.getColor(context, R.color.vmx_sage))
            .setContentTitle(context.getString(R.string.reminder_title))
            .setContentText(body)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setAutoCancel(true)
            .setTimeoutAfter(untilMidnight)
            .setContentIntent(StudyWidget.openPage(context, "/app/study", 2))
            .build()
        try {
            NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, notification)
        } catch (_: SecurityException) {
            // Permission withdrawn between the check and the post: nothing to show.
        }
    }
}

/** The reminder alarm, plus re-arming it after a restart, an app update or a clock change. */
class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == "com.vetmock.app.REMINDER") Reminders.onAlarm(context) else {
            Reminders.schedule(context)
            StudyWidget.updateAll(context)
        }
    }
}
