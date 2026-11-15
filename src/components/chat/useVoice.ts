"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
  Voice mode for the portfolio assistant, built on the browser's own Web Speech API:
  speech-to-text (SpeechRecognition) for asking, speech synthesis for replies. No audio
  leaves the browser through this site and no API key is needed. Where a browser lacks
  speech input (e.g. Firefox) the mic is simply not offered; reading aloud works almost
  everywhere.
*/

type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};
type RecognitionCtor = new () => Recognition;

const LANG: Record<string, string> = { en: "en-IN", ta: "ta-IN", hi: "hi-IN" };

/** Strip markdown and links so the voice reads sentences, not symbols. */
export function speakable(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*_#>`~|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function useVoice(locale: string) {
  const lang = LANG[locale] ?? "en-IN";
  const [canListen, setCanListen] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [error, setError] = useState<"blocked" | "nospeech" | null>(null);
  const rec = useRef<Recognition | null>(null);

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
    const id = requestAnimationFrame(() => {
      setCanListen(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
      setCanSpeak("speechSynthesis" in window);
    });
    // Voices load asynchronously in Chrome; touching the list starts that load.
    if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
    return () => {
      cancelAnimationFrame(id);
      rec.current?.abort();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  /** Listen once; `onText` gets the live transcript, `onDone` the final one. */
  const listen = useCallback(
    (onText: (t: string) => void, onDone: (t: string) => void) => {
      const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
      const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
      if (!Ctor) return;
      window.speechSynthesis?.cancel();
      setSpeakingId(null);
      rec.current?.abort();
      const r = new Ctor();
      r.lang = lang;
      r.interimResults = true;
      r.continuous = false;
      r.maxAlternatives = 1;
      let finalText = "";
      r.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) finalText += res[0].transcript;
          else interim += res[0].transcript;
        }
        onText((finalText + interim).trim());
      };
      r.onerror = (e) => {
        if (e.error === "not-allowed" || e.error === "service-not-allowed") setError("blocked");
        else if (e.error === "no-speech") setError("nospeech");
      };
      r.onend = () => {
        setListening(false);
        rec.current = null;
        if (finalText.trim()) onDone(finalText.trim());
      };
      setError(null);
      rec.current = r;
      try {
        r.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    },
    [lang],
  );

  const stopListening = useCallback(() => rec.current?.stop(), []);

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, []);

  /** Read a reply aloud; `id` lets the UI show which message is playing. */
  const speak = useCallback(
    (text: string, id: number) => {
      if (!("speechSynthesis" in window)) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      const clean = speakable(text);
      if (!clean) return;
      const voices = synth.getVoices();
      const voice = voices.find((v) => v.lang === lang) ?? voices.find((v) => v.lang.startsWith(lang.slice(0, 2))) ?? null;
      // Long replies are spoken sentence by sentence (some engines stop after ~15s of one utterance).
      const parts = clean.match(/[^.!?।]+[.!?।]*/g) ?? [clean];
      parts.forEach((p, i) => {
        const u = new SpeechSynthesisUtterance(p.trim());
        u.lang = voice?.lang ?? lang;
        if (voice) u.voice = voice;
        u.rate = 1;
        if (i === 0) u.onstart = () => setSpeakingId(id);
        if (i === parts.length - 1) {
          u.onend = () => setSpeakingId((cur) => (cur === id ? null : cur));
          u.onerror = () => setSpeakingId((cur) => (cur === id ? null : cur));
        }
        synth.speak(u);
      });
    },
    [lang],
  );

  return { canListen, canSpeak, listening, speakingId, error, listen, stopListening, speak, stopSpeaking };
}
