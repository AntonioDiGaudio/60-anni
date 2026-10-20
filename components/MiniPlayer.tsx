"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { PlayIcon, useAudio } from "./Audio";
import { Progresso } from "./Progresso";
import type { Canzone } from "@/lib/canzoni";

export function MiniPlayer({ canzone }: { canzone: Canzone }) {
  const { alterna, suonaQuesta } = useAudio(canzone);
  const box = useRef<HTMLDivElement>(null);

  // Il libro ascolta mouse e tocchi per girare pagina: qui dentro li fermiamo,
  // così si può premere play o spostare la barra senza sfogliare.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ferma = (e: Event) => e.stopPropagation();
    const eventi = ["mousedown", "touchstart", "pointerdown"] as const;
    eventi.forEach(n => el.addEventListener(n, ferma, { passive: true }));
    return () => eventi.forEach(n => el.removeEventListener(n, ferma));
  }, []);

  return <div ref={box} className={`mini-player ${suonaQuesta ? "is-playing" : ""}`}>
    <button type="button" className="mini-play" onClick={() => alterna(canzone)} aria-label={suonaQuesta ? "Pausa" : `Ascolta ${canzone.titolo}`}>
      <PlayIcon playing={suonaQuesta} />
    </button>
    <div className="mini-body">
      <div className="mini-title">
        <span className="mini-bars" aria-hidden="true"><i /><i /><i /></span>
        <strong>{canzone.titolo}</strong>
        <span>· {canzone.artista}</span>
        <Link href={`/canzoni/${canzone.slug}`} aria-label={`Apri la pagina di ${canzone.titolo}`}>↗</Link>
      </div>
      <Progresso canzone={canzone} compatto />
    </div>
  </div>;
}
