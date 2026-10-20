"use client";

import { formatta, useAudio } from "./Audio";
import type { Canzone } from "@/lib/canzoni";

const inSecondi = (testo: string) => { const [m, s] = testo.split(":").map(Number); return m * 60 + (s || 0); };

export function Progresso({ canzone, compatto = false }: { canzone: Canzone; compatto?: boolean }) {
  const { attiva, tempo, durata, vaiA } = useAudio(canzone);
  const totale = attiva && durata ? durata : inSecondi(canzone.durata);
  const ora = attiva ? tempo : 0;
  const percento = totale ? Math.min(100, (ora / totale) * 100) : 0;

  return <div className={`progresso ${compatto ? "progresso-compatto" : ""}`}>
    <input
      type="range" min={0} max={totale || 1} step={0.1} value={ora}
      disabled={!attiva}
      aria-label={`Posizione in ${canzone.titolo}`}
      aria-valuetext={`${formatta(ora)} di ${formatta(totale)}`}
      style={{ "--p": `${percento}%` } as React.CSSProperties}
      onChange={e => vaiA(Number(e.target.value))}
    />
    <div className="progresso-tempi"><span>{formatta(ora)}</span><span>{formatta(totale)}</span></div>
  </div>;
}
