package com.vetmock.app

import android.content.Context
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import java.util.Locale

/**
 * Android's text-to-speech behind the page's speechSynthesis (the WebView has none). Read-aloud plays the shared
 * clips first; this voice reads what has no clip. [onEvent] gets (utteranceId, "start" | "end" | "error").
 */
class Speech(context: Context, private val onEvent: (String, String) -> Unit) {
    private val queue = mutableListOf<Array<Any>>()
    @Volatile private var ready = false
    @Volatile private var failed = false
    private val tts: TextToSpeech = TextToSpeech(context.applicationContext) { status ->
        synchronized(queue) {
            ready = status == TextToSpeech.SUCCESS
            failed = !ready
            queue.forEach { (id, text, lang, rate, pitch) -> speakNow(id as String, text as String, lang as String, rate as Float, pitch as Float) }
            queue.clear()
        }
    }

    init {
        tts.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
            override fun onStart(id: String) = onEvent(id, "start")
            override fun onDone(id: String) = onEvent(id, "end")
            @Deprecated("Deprecated in Java")
            override fun onError(id: String) = onEvent(id, "error")
            override fun onError(id: String, errorCode: Int) = onEvent(id, "error")
            override fun onStop(id: String, interrupted: Boolean) = onEvent(id, "end")
        })
    }

    fun speak(id: String, text: String, lang: String, rate: Float, pitch: Float) {
        synchronized(queue) {
            when {
                failed -> onEvent(id, "error")
                !ready -> queue += arrayOf(id, text, lang, rate, pitch)
                else -> speakNow(id, text, lang, rate, pitch)
            }
        }
    }

    private fun speakNow(id: String, text: String, lang: String, rate: Float, pitch: Float) {
        if (failed) return onEvent(id, "error")
        val locale = Locale.forLanguageTag(lang.ifBlank { "th-TH" })
        if (tts.setLanguage(locale) < TextToSpeech.LANG_AVAILABLE) return onEvent(id, "error")
        tts.setSpeechRate(rate.coerceIn(0.1f, 4f))
        tts.setPitch(pitch.coerceIn(0.1f, 2f))
        // QUEUE_ADD: the page queues stem then options, as speechSynthesis does.
        if (tts.speak(text, TextToSpeech.QUEUE_ADD, Bundle(), id) != TextToSpeech.SUCCESS) onEvent(id, "error")
    }

    fun stop() {
        synchronized(queue) { queue.clear() }
        tts.stop()
    }

    /** BCP 47 tags of the installed voices' languages. */
    fun languages(): List<String> =
        if (!ready) emptyList() else runCatching { tts.availableLanguages.map { it.toLanguageTag() }.distinct() }.getOrDefault(emptyList())

    fun shutdown() = tts.shutdown()
}
