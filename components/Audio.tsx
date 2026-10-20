"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Canzone } from "@/lib/canzoni";

type AudioState = {
  corrente: Canzone | null;
  inRiproduzione: boolean;
  tempo: number;
  durata: number;
  errore: boolean;
  suona(canzone: Canzone): void;
  alterna(canzone: Canzone): void;
  vaiA(secondi: number): void;
};

const AudioContext = createContext<AudioState | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [corrente, setCorrente] = useState<Canzone | null>(null);
  const [inRiproduzione, setInRiproduzione] = useState(false);
  const [tempo, setTempo] = useState(0);
  const [durata, setDurata] = useState(0);
  const [errore, setErrore] = useState(false);

  // Aggiorna il tempo a ogni frame mentre suona, così la barra scorre fluida.
  useEffect(() => {
    if (!inRiproduzione) return;
    let frame = 0;
    const tick = () => { if (audio.current) setTempo(audio.current.currentTime); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inRiproduzione]);

  const suona = useCallback((canzone: Canzone) => {
    const el = audio.current;
    if (!el) return;
    if (corrente?.slug !== canzone.slug) {
      el.src = canzone.audio;
      setCorrente(canzone);
      setTempo(0);
      setDurata(0);
      setErrore(false);
    }
    el.play().catch(() => setInRiproduzione(false));
  }, [corrente]);

  const alterna = useCallback((canzone: Canzone) => {
    const el = audio.current;
    if (el && corrente?.slug === canzone.slug && !el.paused) el.pause();
    else suona(canzone);
  }, [corrente, suona]);

  const vaiA = useCallback((secondi: number) => {
    if (!audio.current || !Number.isFinite(secondi)) return;
    audio.current.currentTime = secondi;
    setTempo(secondi);
  }, []);

  return <AudioContext value={{ corrente, inRiproduzione, tempo, durata, errore, suona, alterna, vaiA }}>
    {children}
    <audio
      ref={audio}
      preload="metadata"
      onPlay={() => setInRiproduzione(true)}
      onPause={() => setInRiproduzione(false)}
      onEnded={() => { setInRiproduzione(false); setTempo(0); }}
      onLoadedMetadata={e => setDurata(e.currentTarget.duration)}
      onError={() => { setErrore(true); setInRiproduzione(false); }}
    />
  </AudioContext>;
}

export function useAudio(canzone?: Canzone) {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio va usato dentro <AudioProvider>");
  const attiva = !!canzone && ctx.corrente?.slug === canzone.slug;
  return { ...ctx, attiva, suonaQuesta: attiva && ctx.inRiproduzione };
}

export function formatta(secondi: number) {
  if (!Number.isFinite(secondi) || secondi < 0) secondi = 0;
  const s = Math.floor(secondi);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function PlayIcon({ playing }: { playing: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="play-icon">
    {playing
      ? <g fill="currentColor"><rect x="8" y="7" width="2.6" height="10" rx="1" /><rect x="13.4" y="7" width="2.6" height="10" rx="1" /></g>
      : <path d="M9.5 7.2v9.6a.6.6 0 0 0 .9.5l7.4-4.8a.6.6 0 0 0 0-1L10.4 6.7a.6.6 0 0 0-.9.5Z" fill="currentColor" />}
  </svg>;
}
