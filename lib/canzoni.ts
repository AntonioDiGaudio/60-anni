// Le canzoni del sito. Ogni canzone ha la sua pagina: /canzoni/<slug>
// Metti i file audio in public/audio e le copertine in public/copertine.
export type Canzone = {
  slug: string;
  titolo: string;
  artista: string;
  audio: string;
  copertina: string;
  durata: string; // mostrata prima che il file audio sia caricato
  ricordo?: string;
};

export const canzoni: Canzone[] = [
  {
    slug: "emozioni",
    titolo: "Emozioni",
    artista: "Lucio Battisti",
    audio: "/audio/demo-auguri.wav", // sostituisci con /audio/emozioni.mp3
    copertina: "/copertine/emozioni.svg",
    durata: "0:25",
    ricordo: "Quella che cantavi a squarciagola sull'Aurelia, finestrini giù.",
  },
  {
    slug: "albachiara",
    titolo: "Albachiara",
    artista: "Vasco Rossi",
    audio: "/audio/demo-auguri.wav",
    copertina: "/copertine/albachiara.svg",
    durata: "0:25",
    ricordo: "Il primo concerto insieme. Tu dicevi che eri lì solo per accompagnarci.",
  },
  {
    slug: "anno-che-verra",
    titolo: "L'anno che verrà",
    artista: "Lucio Dalla",
    audio: "/audio/demo-auguri.wav",
    copertina: "/copertine/anno-che-verra.svg",
    durata: "0:25",
    ricordo: "Ogni 31 dicembre, puntuale come il brindisi.",
  },
  {
    slug: "tanti-auguri",
    titolo: "Tanti auguri",
    artista: "Tutti noi",
    audio: "/audio/demo-auguri.wav",
    copertina: "/copertine/tanti-auguri.svg",
    durata: "0:25",
    ricordo: "Stonati, ma col cuore.",
  },
];

export const trovaCanzone = (slug: string) => canzoni.find(c => c.slug === slug);
