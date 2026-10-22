package com.vetmock.app

import android.content.Context
import java.util.Calendar
import java.util.Locale
import java.util.TimeZone

/**
 * What the page last reported about the student's day (VetMock.studyDay / setExam), read by the widget and the
 * reminder. Dates are Bangkok calendar days (YYYY-MM-DD), the same clock the web counts streaks on.
 */
object Study {
    private const val PREFS = "vmx_study"
    private val BANGKOK: TimeZone = TimeZone.getTimeZone("Asia/Bangkok")

    data class Day(val streak: Int, val answeredToday: Int, val day: String?, val examLabel: String?, val examDate: String?)

    fun today(now: Long = System.currentTimeMillis()): String = dateKey(now)

    fun dateKey(ms: Long): String {
        val c = Calendar.getInstance(BANGKOK).apply { timeInMillis = ms }
        return String.format(Locale.US, "%04d-%02d-%02d", c.get(Calendar.YEAR), c.get(Calendar.MONTH) + 1, c.get(Calendar.DAY_OF_MONTH))
    }

    /** Whole Bangkok days from [from] to [to] (both YYYY-MM-DD). */
    fun daysBetween(from: String, to: String): Int {
        fun utcDay(key: String): Long {
            val (y, m, d) = key.split('-').map { it.toInt() }
            val c = Calendar.getInstance(TimeZone.getTimeZone("UTC")).apply { clear(); set(y, m - 1, d) }
            return c.timeInMillis / 86_400_000L
        }
        return (utcDay(to) - utcDay(from)).toInt()
    }

    fun read(context: Context): Day {
        val p = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        return Day(p.getInt("streak", 0), p.getInt("answeredToday", 0), p.getString("day", null),
            p.getString("examLabel", null), p.getString("examDate", null))
    }

    fun saveDay(context: Context, streak: Int, answeredToday: Int, day: String) {
        val p = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        // Minutes past midnight of recent practice, for a reminder at the time this student usually studies.
        // One sample per day: the first set of the day says when this student sits down to study.
        val minute = Calendar.getInstance(BANGKOK).let { it.get(Calendar.HOUR_OF_DAY) * 60 + it.get(Calendar.MINUTE) }
        val previous = p.getString("practiceMinutes", "")!!.split(',').filter { it.isNotBlank() }
        val recent = if (p.getString("day", null) == day) previous else (previous + minute.toString()).takeLast(7)
        p.edit().putInt("streak", streak).putInt("answeredToday", answeredToday).putString("day", day)
            .putString("practiceMinutes", recent.joinToString(",")).apply()
    }

    fun saveExam(context: Context, label: String?, date: String?) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
            .putString("examLabel", label).putString("examDate", date).apply()
    }

    /** The streak as it stands today: it survives until a whole day passes without practice. */
    fun liveStreak(d: Day, today: String = today()): Int {
        val last = d.day ?: return 0
        return if (daysBetween(last, today) <= 1) d.streak else 0
    }

    fun practicedToday(d: Day, today: String = today()) = d.day == today && d.answeredToday > 0

    /** The median of recent practice times (minutes past midnight), or null with fewer than three. */
    fun usualMinute(context: Context): Int? {
        val list = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString("practiceMinutes", "")!!
            .split(',').mapNotNull { it.toIntOrNull() }.sorted()
        return if (list.size < 3) null else list[list.size / 2]
    }
}
