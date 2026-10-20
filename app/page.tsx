import Link from "next/link";
import { FotoLibro } from "@/components/FotoLibro";
import { Intro } from "@/components/Intro";
import { canzoni } from "@/lib/canzoni";
import { festa } from "@/lib/festa";

export default function Home() {
  return <main>
    <Intro />
    <header className="hero shell">
      <p className="eyebrow hero-line">{festa.nascita} <span>—</span> {festa.oggi}</p>
      <h1 className="hero-title"><span className="hero-60">60</span><span className="hero-words">anni di <em>{festa.nome.toLowerCase()}</em></span></h1>
      <p className="hero-dedica">{festa.dedica}</p>
      <a className="hero-cta" href="#album">Sfoglia l'album <span aria-hidden="true">↓</span></a>
    </header>

    <section id="album" className="section shell">
      <div className="section-head" data-reveal>
        <p className="eyebrow">Capitolo uno</p>
        <h2>L'album</h2>
      </div>
      <FotoLibro />
    </section>

    <section id="canzoni" className="section section-last shell">
      <div className="section-head" data-reveal>
        <h2>La colonna sonora</h2>
      </div>
      <ol className="song-list">
        {canzoni.map((c, i) => <li key={c.slug} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
          <Link href={`/canzoni/${c.slug}`}>
            <span className="song-n">{String(i + 1).padStart(2, "0")}</span>
            <img src={c.copertina} alt="" />
            <span className="song-text"><strong>{c.titolo}</strong><span>{c.artista}</span></span>
            <span className="song-arrow" aria-hidden="true">→</span>
          </Link>
        </li>)}
      </ol>
    </section>
  </main>;
}
