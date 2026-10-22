package com.vetmock.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.view.View
import android.widget.RemoteViews

/** Home-screen widget: the streak, today's practice and the next exam. Tapping it opens practice. */
class StudyWidget : AppWidgetProvider() {
    override fun onUpdate(context: Context, manager: AppWidgetManager, ids: IntArray) {
        val views = render(context)
        ids.forEach { manager.updateAppWidget(it, views) }
    }

    override fun onEnabled(context: Context) {
        // The widget's "today" flips at midnight; the reminder alarm doubles as its midnight refresh.
        Reminders.schedule(context)
    }

    companion object {
        fun updateAll(context: Context) {
            val manager = AppWidgetManager.getInstance(context)
            val ids = manager.getAppWidgetIds(ComponentName(context, StudyWidget::class.java))
            if (ids.isNotEmpty()) StudyWidget().onUpdate(context, manager, ids)
        }

        fun hasWidgets(context: Context): Boolean =
            AppWidgetManager.getInstance(context).getAppWidgetIds(ComponentName(context, StudyWidget::class.java)).isNotEmpty()

        private fun render(context: Context): RemoteViews {
            val d = Study.read(context)
            val today = Study.today()
            val streak = Study.liveStreak(d, today)
            val todayText = if (Study.practicedToday(d, today)) {
                context.getString(R.string.widget_today_done, d.answeredToday)
            } else {
                context.getString(R.string.widget_today_none)
            }
            val daysToExam = d.examDate?.let { Study.daysBetween(today, it) }?.takeIf { it >= 0 }
            val examText = when {
                d.examLabel == null || daysToExam == null -> null
                daysToExam == 0 -> context.getString(R.string.widget_exam_today, d.examLabel)
                else -> context.getString(R.string.widget_exam_days, d.examLabel, daysToExam)
            }
            return RemoteViews(context.packageName, R.layout.widget_study).apply {
                setTextViewText(R.id.widget_streak, streak.toString())
                setTextViewText(R.id.widget_today, todayText)
                if (examText != null) {
                    setTextViewText(R.id.widget_exam, examText)
                    setViewVisibility(R.id.widget_exam, View.VISIBLE)
                } else {
                    setViewVisibility(R.id.widget_exam, View.GONE)
                }
                setContentDescription(android.R.id.background,
                    context.getString(R.string.widget_a11y, streak, todayText, examText.orEmpty()))
                setOnClickPendingIntent(android.R.id.background, openPage(context, "/app/study", 1))
            }
        }

        /** An intent that opens a VetMock page in the app, the same way an App Link does. */
        fun openPage(context: Context, path: String, requestCode: Int): PendingIntent {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://${MainActivity.HOST}$path"))
                .setClass(context, MainActivity::class.java)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
            return PendingIntent.getActivity(context, requestCode, intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        }
    }
}
