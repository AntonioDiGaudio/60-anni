"use client";

import { forwardRef, useEffect, useRef, useState, type PointerEvent } from "react";
import HTMLFlipBook from "react-pageflip";
import { pagine, type PaginaLibro } from "@/lib/libro";
import { trovaCanzone } from "@/lib/canzoni";
import { festa } from "@/lib/festa";
import { MiniPlayer } from "./MiniPlayer";

type BookApi = { flipNext(): void; flipPrev(): void; turnToNextPage(): void; turnToPrevPage(): void };

const Copertina = forwardRef<HTMLDivElement, { retro?: boolean }>(function Copertina({ retro }, ref) {
  return <div ref={ref} className={`book-page book-cover ${retro ? "book-back" : ""}`}>
    <div className="cover-inner">
      {retro
        ? <><p className="cover-small">fine… per ora</p><p className="cover-firma">{festa.firma}</p></>
        : <><p className="cover-small">{festa.nascita.split(" ").pop()} — {festa.oggi.split(" ").pop()}</p><p className="cover-60">60</p><p className="cover-title">L'album di {festa.nome}</p><p className="cover-small">sfoglia →</p></>}
    </div>
  </div>;
});

const Pagina = forwardRef<HTMLDivElement, { pagina: PaginaLibro; numero: number }>(function Pagina({ pagina, numero }, ref) {
  const canzone = pagina.canzone ? trovaCanzone(pagina.canzone) : undefined;
  return <div ref={ref} className="book-page">
    <div className="page-inner">
      <figure className="page-photo">
        <img src={pagina.foto} alt={pagina.descrizione} loading="lazy" draggable={false} />
      </figure>
      <p className="page-year">{pagina.anno}</p>
      <p className="page-text">{pagina.descrizione}</p>
      <div className="page-bottom">
        {canzone && <MiniPlayer canzone={canzone} />}
        <span className="page-number">{String(numero).padStart(2, "0")}</span>
      </div>
    </div>
  </div>;
});

export function FotoLibro() {
  const book = useRef<{ pageFlip: () => BookApi }>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [page, setPage] = useState(0);
  const [landscape, setLandscape] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reduced, setReduced] = useState(false);
  const totale = pagine.length + 2;

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const change = () => setReduced(mq.matches);
    mq.addEventListener("change", change);
    return () => mq.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    if (!stage.current) return;
    // Reagisce solo ai cambi di larghezza: su telefono la barra dell'indirizzo
    // cambia l'altezza mentre scorri, e ricreare il libro farebbe saltare la pagina.
    let ultimaLarghezza = -1;
    const observer = new ResizeObserver(entries => {
      const available = Math.floor(entries[0].contentRect.width);
      if (available === ultimaLarghezza) return;
      ultimaLarghezza = available;
      const doppia = available >= 720;
      const perAltezza = doppia ? Math.floor((innerHeight - 170) / 1.48) : Infinity;
      const next = Math.max(240, Math.min(430, perAltezza, doppia ? Math.floor(available / 2) : available));
      setWidth(prev => { if (prev !== next) setReady(false); return next; });
    });
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  const height = Math.round(width * 1.48);
  const allaFine = page >= totale - 1;

  function move(dir: "next" | "prev") {
    const api = book.current?.pageFlip();
    if (!api || !ready || busy) return;
    if (dir === "next" && !allaFine) reduced ? api.turnToNextPage() : api.flipNext();
    if (dir === "prev" && page > 0) reduced ? api.turnToPrevPage() : api.flipPrev();
  }
  // Swipe fatto da noi: in verticale la pagina scorre normalmente,
  // un gesto orizzontale gira pagina con l'animazione completa.
  const inizio = useRef<{ x: number; y: number } | null>(null);
  function giu(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    inizio.current = { x: e.clientX, y: e.clientY };
  }
  function su(e: PointerEvent<HTMLDivElement>) {
    const start = inizio.current;
    inizio.current = null;
    if (!start) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? "next" : "prev");
  }
  // Frecce della tastiera quando l'album è sullo schermo (senza dare il focus al libro:
  // su telefono il focus faceva scorrere la pagina).
  const moveRef = useRef(move);
  moveRef.current = move;
  useEffect(() => {
    const tasto = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const r = stage.current?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > innerHeight) return;
      e.preventDefault();
      moveRef.current(e.key === "ArrowRight" ? "next" : "prev");
    };
    addEventListener("keydown", tasto);
    return () => removeEventListener("keydown", tasto);
  }, []);

  const due = (n: number) => String(n).padStart(2, "0");
  const pagineVisibili = page === 0 ? "copertina" : page === totale - 1 ? "fine"
    : `${due(page)}${landscape ? `–${due(page + 1)}` : ""} / ${due(pagine.length)}`;

  return <div className="libro">
    <div className={`book-stage ${landscape && page === 0 ? "chiuso-davanti" : ""} ${landscape && page === totale - 1 ? "chiuso-dietro" : ""} ${landscape && page > 0 && page < totale - 1 && !busy ? "aperto" : ""}`} ref={stage} onPointerDown={giu} onPointerUp={su} onPointerCancel={() => { inizio.current = null; }} role="region" aria-label="Album sfogliabile. Usa le frecce della tastiera, i pulsanti o scorri con il dito." style={width ? { height, "--h": `${height}px` } as React.CSSProperties : undefined}>
      {!ready && <div className="book-loading" role="status"><span /><p>Apriamo l'album…</p></div>}
      {width > 0 && <HTMLFlipBook
        key={width} ref={book} renderOnlyPageLengthChange
        width={width} height={height} size="fixed"
        minWidth={240} maxWidth={430} minHeight={300} maxHeight={700}
        startPage={page} drawShadow flippingTime={800} usePortrait startZIndex={0} autoSize
        maxShadowOpacity={0.35} showCover mobileScrollSupport={false} clickEventForward useMouseEvents={false}
        swipeDistance={30} showPageCorners={false} disableFlipByClick={false}
        className={`flip-book ${ready ? "book-ready" : ""}`} style={{}}
        onInit={(e: { data: { mode: string } }) => { setLandscape(e.data.mode === "landscape"); setReady(true); setBusy(false); }}
        onFlip={(e: { data: number }) => setPage(e.data)}
        onChangeOrientation={(e: { data: string }) => setLandscape(e.data === "landscape")}
        onChangeState={(e: { data: string }) => setBusy(e.data === "flipping")}
      >
        <Copertina />
        {pagine.map((p, i) => <Pagina pagina={p} numero={i + 1} key={p.foto + i} />)}
        <Copertina retro />
      </HTMLFlipBook>}
    </div>
    <div className="book-controls">
      <button type="button" aria-label="Pagina precedente" disabled={page === 0 || busy || !ready} onClick={() => move("prev")}>←</button>
      <p aria-live="polite">{pagineVisibili}</p>
      <button type="button" aria-label="Pagina successiva" disabled={allaFine || busy || !ready} onClick={() => move("next")}>→</button>
    </div>
    <p className="book-hint">Scorri di lato con il dito per girare pagina.</p>
  </div>;
}
