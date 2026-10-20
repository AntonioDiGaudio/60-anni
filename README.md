# 60 anni di papà

Sito Next.js: album sfogliabile con foto, descrizioni e un player per pagina, più una pagina per ogni canzone (`/canzoni/<slug>`).

## Avvio

```bash
npm install
npm run dev
```

## Cambiare i contenuti

- **Testi generali** (nome, date, dedica, firma): `lib/festa.ts`
- **Pagine dell'album**: `lib/libro.ts` — foto in `public/foto/`, ogni pagina può avere una `canzone` (slug)
- **Canzoni**: `lib/canzoni.ts` — audio in `public/audio/`, copertine in `public/copertine/`

Le foto e l'audio attuali (`demo-auguri.wav`, un carillon di "Tanti auguri") sono segnaposto da sostituire.
