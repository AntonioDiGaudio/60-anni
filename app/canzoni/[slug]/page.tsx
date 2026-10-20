import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MusicCard } from "@/components/MusicCard";
import { canzoni, trovaCanzone } from "@/lib/canzoni";

export const dynamicParams = false;
export function generateStaticParams() {
  return canzoni.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/canzoni/[slug]">): Promise<Metadata> {
  const canzone = trovaCanzone((await params).slug);
  return canzone ? { title: `${canzone.titolo} — ${canzone.artista}` } : {};
}

export default async function CanzonePage({ params }: PageProps<"/canzoni/[slug]">) {
  const { slug } = await params;
  const canzone = trovaCanzone(slug);
  if (!canzone) notFound();
  const i = canzoni.indexOf(canzone);
  const precedente = canzoni[(i - 1 + canzoni.length) % canzoni.length];
  const successiva = canzoni[(i + 1) % canzoni.length];

  return <main className="song-page shell">
    <div className="song-stage" key={canzone.slug}>
      <MusicCard canzone={canzone} precedente={precedente} successiva={successiva} />
      {canzone.ricordo && <p className="song-ricordo">“{canzone.ricordo}”</p>}
    </div>
    <Link href="/#canzoni" className="back-button"><span aria-hidden="true">←</span> Indietro</Link>
  </main>;
}
