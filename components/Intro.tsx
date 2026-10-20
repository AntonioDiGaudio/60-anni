"use client";

import { useEffect, useRef, useState } from "react";

// Parte solo al primo caricamento della pagina, non quando torni alla home da una canzone.
let giaVista = false;

const pausa = (ms: number) => new Promise(r => setTimeout(r, ms));

// Coriandoli: posizioni fisse (niente Math.random, così server e browser coincidono).
const colori = ["#e9a90c", "#7a2e2e", "#26221d", "#e9a90c", "#d98a5f"];
const coriandoli = Array.from({ length: 28 }, (_, i) => {
  const angolo = (i / 28) * 360 + ((i * 37) % 13);
  const distanza = 150 + ((i * 53) % 9) * 22;
  return { angolo, distanza, colore: colori[i % colori.length], grande: i % 3 === 0 };
});

export function Intro() {
  const [visibile, setVisibile] = useState(() => !giaVista);
  const [anni, setAnni] = useState(0);
  const [scala, setScala] = useState(0.4);
  const [fase, setFase] = useState<"conta" | "boom" | "uscita">("conta");
  const numero = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visibile) return;
    giaVista = true;
    let annullato = false;
    const root = document.documentElement;

    const fine = () => { root.style.overflow = ""; setVisibile(false); };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { fine(); return; }

    history.scrollRestoration = "manual";
    scrollTo(0, 0);
    root.style.overflow = "hidden";

    (async () => {
      await pausa(350);
      for (let decennio = 0; decennio < 6; decennio++) {
        for (let k = 1; k <= 10; k++) {
          if (annullato) return;
          setAnni(decennio * 10 + k);
          // rallenta un po' avvicinandosi alla decina
          await pausa(16 + k * k * 0.6);
        }
        setScala(0.4 + (decennio + 1) * 0.1);
        if (decennio < 5) await pausa(300);
      }

      setFase("boom");
      await pausa(700);
      if (annullato) return;

      // Vola al posto del "60" della home
      const da = numero.current?.getBoundingClientRect();
      const a = document.querySelector(".hero-60")?.getBoundingClientRect();
      setFase("uscita");
      if (numero.current && da && a) {
        const dx = a.left + a.width / 2 - (da.left + da.width / 2);
        const dy = a.top + a.height / 2 - (da.top + da.height / 2);
        const s = a.height / da.height;
        const volo = numero.current.animate(
          [{ transform: "translate(0, 0) scale(1)" }, { transform: `translate(${dx}px, ${dy}px) scale(${s})` }],
          { duration: 900, easing: "cubic-bezier(.65, 0, .25, 1)", fill: "forwards" },
        );
        // se il browser mette in pausa le animazioni (scheda in background), non restare bloccati
        await Promise.race([volo.finished.catch(() => {}), pausa(1200)]);
      }
      if (!annullato) fine();
    })();

    return () => { annullato = true; root.style.overflow = ""; };
  }, []);

  if (!visibile) return null;

  return <div ref={overlay} className={`intro intro-${fase}`} aria-hidden="true">
    <div ref={numero} className="intro-numero">
      <span className="intro-scala" style={{ transform: `scale(${scala})` }}>
        <span key={anni % 10 === 0 ? anni : "n"} className={anni % 10 === 0 && anni > 0 ? "intro-tappa" : ""}>{anni}</span>
      </span>
      <span className="intro-coriandoli">
        {coriandoli.map((c, i) => <i key={i} style={{ "--a": `${c.angolo}deg`, "--d": `${c.distanza}px`, background: c.colore, width: c.grande ? 10 : 6, height: c.grande ? 10 : 6 } as React.CSSProperties} />)}
      </span>
    </div>
    <p className="intro-scritta">anni</p>
  </div>;
}
