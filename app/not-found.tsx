import Link from "next/link";

export default function NotFound() {
  return <main className="song-page shell"><p className="eyebrow">Pagina non trovata</p><h1 className="nf-title">Questa pagina è scivolata fuori dall'album.</h1><Link href="/" className="back-link">← Torna all'inizio</Link></main>;
}
