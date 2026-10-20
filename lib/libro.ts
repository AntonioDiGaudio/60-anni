// Le pagine dell'album. Metti le foto in public/foto.
// "canzone" è lo slug di una canzone in lib/canzoni.ts (facoltativo).
export type PaginaLibro = {
  foto: string;
  anno: string;
  descrizione: string;
  canzone?: string;
};

export const pagine: PaginaLibro[] = [
  { foto: "/foto/1966.svg", anno: "1966", descrizione: "Il primo sorriso. Già si capiva che avrebbe parlato tanto.", canzone: "tanti-auguri" },
  { foto: "/foto/1972.svg", anno: "1972", descrizione: "La bicicletta rossa e le ginocchia sbucciate di tutta l'estate." },
  { foto: "/foto/1980.svg", anno: "1980", descrizione: "Capelli lunghi, chitarra e una certa idea di sé.", canzone: "emozioni" },
  { foto: "/foto/1988.svg", anno: "1988", descrizione: "Il giorno del sì. La cravatta l'aveva scelta la nonna.", canzone: "albachiara" },
  { foto: "/foto/1994.svg", anno: "1994", descrizione: "Papà per la prima volta: notti in bianco e occhi lucidi." },
  { foto: "/foto/2001.svg", anno: "2001", descrizione: "Le vacanze al mare, l'ombrellone sempre in prima fila.", canzone: "anno-che-verra" },
  { foto: "/foto/2010.svg", anno: "2010", descrizione: "Il pranzo della domenica, che finiva alle sei di sera." },
  { foto: "/foto/2026.svg", anno: "2026", descrizione: "Sessanta. E il meglio, come sempre, deve ancora venire.", canzone: "tanti-auguri" },
];
