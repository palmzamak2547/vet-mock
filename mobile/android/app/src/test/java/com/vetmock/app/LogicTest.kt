package com.vetmock.app

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import java.util.Calendar
import java.util.TimeZone

/** The parts of the native shell that decide something: which files an update may write, and when a day is a day. */
class LogicTest {
    @Test
    fun anUpdateNeverWritesOutsideItsFolder() {
        assertTrue(BundleUpdater.safePath("assets/index-abc.js"))
        assertTrue(BundleUpdater.safePath("subject-art/com5.webp"))
        for (bad in listOf("", "/etc/passwd", "../files/x", "assets/../../x", "a//b", "a\\b", "a/./b", "a/b\u0000")) {
            assertFalse(bad, BundleUpdater.safePath(bad))
        }
    }

    @Test
    fun aManifestWithAnUnsafePathIsRefusedWhole() {
        val ok = BundleUpdater.Manifest.parse("""{"build":"b1","minNative":1,"csp":"default-src 'self'","files":[["index.html","h1",10],["assets/a.js","h2",20]]}""")
        assertEquals("b1", ok.build)
        assertEquals("h2", ok.files["assets/a.js"])
        assertEquals(20L, ok.sizes["assets/a.js"])
        assertEquals("default-src 'self'", ok.csp)
        val refused = runCatching { BundleUpdater.Manifest.parse("""{"build":"b2","files":[["../x","h",1]]}""") }
        assertTrue(refused.isFailure)
    }

    @Test
    fun daysAreBangkokCalendarDays() {
        assertEquals(1, Study.daysBetween("2026-10-31", "2026-11-01"))
        assertEquals(366, Study.daysBetween("2028-01-01", "2029-01-01"))
        // 17:30 UTC on 22 Oct is 00:30 on 23 Oct in Bangkok.
        val utc = Calendar.getInstance(TimeZone.getTimeZone("UTC")).apply { clear(); set(2026, 9, 22, 17, 30) }.timeInMillis
        assertEquals("2026-10-23", Study.dateKey(utc))
    }

    @Test
    fun aStreakLastsUntilAWholeDayIsMissed() {
        val day = Study.Day(streak = 6, answeredToday = 12, day = "2026-10-21", examLabel = null, examDate = null)
        assertEquals(6, Study.liveStreak(day, "2026-10-22"))
        assertEquals(0, Study.liveStreak(day, "2026-10-23"))
        assertFalse(Study.practicedToday(day, "2026-10-22"))
        assertTrue(Study.practicedToday(day, "2026-10-21"))
    }

    @Test
    fun theNextReminderIsTheNextTimeTheBangkokClockReadsIt() {
        val bkk = TimeZone.getTimeZone("Asia/Bangkok")
        val now = Calendar.getInstance(bkk).apply { clear(); set(2026, 9, 22, 18, 0) }.timeInMillis
        val at = Calendar.getInstance(bkk).apply { timeInMillis = Reminders.nextAt(19 * 60, now) }
        assertEquals(22, at.get(Calendar.DAY_OF_MONTH))
        assertEquals(19, at.get(Calendar.HOUR_OF_DAY))
        val later = Calendar.getInstance(bkk).apply { timeInMillis = Reminders.nextAt(17 * 60, now) }
        assertEquals(23, later.get(Calendar.DAY_OF_MONTH))
    }
}
