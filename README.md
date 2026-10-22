# anwaltskanzlei-baumgartner.ch

Static website of the Anwaltskanzlei Dr. iur. Andreas Baumgartner, Stäfa. Built with Astro 7 and Tailwind 4; all content lives in this repo.

## Development

```sh
nvm use          # Node 24 (.nvmrc)
npm install
npm run dev      # background dev server on http://127.0.0.1:4322 (astro dev status | logs | stop)
npm run build    # astro check + static build into dist/
```

Herd proxies **https://anwaltskanzlei-baumgartner.ch.test** to the dev server (`herd proxy anwaltskanzlei-baumgartner.ch http://127.0.0.1:4322 --secure`), so it only works while `npm run dev` is running.

## Structure

- `src/pages/` – one file per page (Home, Rechtsgebiete, Team, Kontakt, Impressum, Datenschutz, 404). Texts are written directly in the pages.
- `src/data/site.ts` – address, phone numbers, email and navigation, used across pages, the footer and the JSON-LD.
- `src/data/content.ts` – the lists (Schwerpunkte, Rechtsgebiete, Eckdaten), shared by the pages and `llms.txt`.
- `src/pages/llms.txt.ts`, `robots.txt.ts` – generated at build time; the sitemap comes from `@astrojs/sitemap`.
- `src/components/Panel.astro` – the photo panel with "Better Call Andy". Positions are pixels from the 1920 × 1080 XD artboards multiplied by `--u` (see `src/styles/global.css`).
- `src/assets/` – images, optimised by Astro at build time.

## Map

The Kontakt page shows a Mapbox map (ported from the immosite.ch starter's `map` module) with the office and the visitor parking; markers and style in `src/data/site.ts`. The public token comes from `PUBLIC_MAPBOX_TOKEN` in `.env` (not committed, see `.env.example`) and has to allow `https://anwaltskanzlei-baumgartner.ch` and `https://anwaltskanzlei-baumgartner.ch.test` in the Mapbox account, otherwise the tiles return 403. `deploy` builds locally, so `.env` must be present when building.

## Icons and Open Graph image

Favicons, app icons and `public/og.png` (1200 × 630) are rendered from the HTML sources in `scripts/assets/` with headless Chrome and ImageMagick: `npm run assets`. The icon is a stand-in mark from the design (the condensed "A" on black) until there is a logo.

## Fonts

- **Host Grotesk** (body text), self-hosted from Fontsource.
- **Anton** (display type: "Better Call Andy", the CTA, the icon), self-hosted from Fontsource. The XD artboards were set in TT Bluescreens, so `--fs` in `global.css` scales Anton down to Bluescreens' cap height and width.

## Design

Adobe XD (one screen per link): [Home](https://xd.adobe.com/view/2f0c13dc-9f92-4159-b73f-ecc575242c25-7a5f/), [Rechtsgebiete](https://xd.adobe.com/view/5bcc7ec6-a639-48a1-82aa-92ce9f4deab8-0e9f/), [Team](https://xd.adobe.com/view/9d085ca2-ead9-4601-a48b-e09acef801cc-c85b/), [Kontakt](https://xd.adobe.com/view/c380b790-9970-41b7-b8fc-70635e9a2f7b-96d3/).
