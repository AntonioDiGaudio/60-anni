"use client";

import { useRouter } from "next/navigation";
import { PlayIcon, useAudio } from "./Audio";
import { Progresso } from "./Progresso";
import type { Canzone } from "@/lib/canzoni";

export function MusicCard({ canzone, precedente, successiva }: { canzone: Canzone; precedente: Canzone; successiva: Canzone }) {
  const router = useRouter();
  const { alterna, suona, suonaQuesta, attiva, errore } = useAudio(canzone);

  // Cambio canzone: parte subito (è un click, quindi il browser lo permette) e cambia pagina.
  function vai(altra: Canzone) {
    suona(altra);
    router.push(`/canzoni/${altra.slug}`, { scroll: false });
  }

  return <article className={`music-card ${suonaQuesta ? "is-playing" : ""}`}>
    <div className="music-cover">
      <img src={canzone.copertina} alt="" />
      <div className="music-bars" aria-hidden="true"><i /><i /><i /><i /></div>
    </div>
    <div className="music-meta">
      <h1>{canzone.titolo}</h1>
      <p>{canzone.artista}</p>
    </div>
    <Progresso canzone={canzone} />
    {attiva && errore && <p className="audio-errore" role="status">File audio non trovato.</p>}
    <div className="music-controls">
      <button type="button" onClick={() => vai(precedente)} aria-label={`Canzone precedente: ${precedente.titolo}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 6v12M18 6.5v11a.5.5 0 0 1-.8.4L9.6 12.4a.5.5 0 0 1 0-.8l7.6-5.5a.5.5 0 0 1 .8.4Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" /></svg>
      </button>
      <button type="button" className="music-play" onClick={() => alterna(canzone)} aria-label={suonaQuesta ? "Pausa" : `Ascolta ${canzone.titolo}`}>
        <PlayIcon playing={suonaQuesta} />
      </button>
      <button type="button" onClick={() => vai(successiva)} aria-label={`Canzone successiva: ${successiva.titolo}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 6v12M6 6.5v11a.5.5 0 0 0 .8.4l7.6-5.5a.5.5 0 0 0 0-.8L6.8 6.1a.5.5 0 0 0-.8.4Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" /></svg>
      </button>
    </div>
  </article>;
}
