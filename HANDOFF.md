# Handoff: anwaltskanzlei-baumgartner.ch

State as of 2026-10-30. Read this together with `README.md` (setup, structure, map, deployment).

## Where things stand

- Static Astro site for the Anwaltskanzlei Dr. iur. Andreas Baumgartner, Stäfa, built from the Adobe XD design (links in the README). All pages are done: Home, Rechtsgebiete, Team, Kontakt, Impressum, Datenschutz, 404, plus the mobile layout with the black overlay menu.
- **Staging** at https://staging.anwaltskanzlei-baumgartner.ch, deployed with `./deploy.sh`. `master` is pushed to github.com/marceli-to/anwaltskanzlei-baumgartner.ch. No other branches.
- **Production** (https://anwaltskanzlei-baumgartner.ch): set up on Hostpoint on 2026-10-30 (document root `www/anwaltskanzlei-baumgartner.ch/public`, `www.` as alias, DNS on Hostpoint). Deploy with `./deploy.sh production`. The SSL certificate was still being issued that day.

## Stack

- Astro 7.4, Vite 8.3, Tailwind 4.3, TypeScript 6.0.3. Node 24 via `.nvmrc` (run `nvm use`, the nvm default is older).
- Mapbox GL for the Kontakt map; token in `.env` (`PUBLIC_MAPBOX_TOKEN`), allowed for the live, staging and `.test` domains.

## Deployment

- `./deploy.sh --dry-run`, then `./deploy.sh`. Only committed code is deployed: it builds a clean copy (with the local `.env` copied in) and rsyncs `dist/` to `unofibem@anwaltskanzlei-baumgartner.ch:/home/unofibem/www/staging.anwaltskanzlei-baumgartner.ch/public` (the subdomain's document root).
- Staging only: the script appends `Header set X-Robots-Tag "noindex, nofollow"` to `.htaccess` and replaces `robots.txt` with `Disallow: /`. The repo's own `robots.txt`, sitemap, canonicals and `llms.txt` all point to the production domain.
- SSH needs Marcel's password (no key on the server), so Marcel runs the deploy himself.
- `./deploy.sh production` skips the two staging steps. `public/.htaccess` redirects http and `www.` to `https://anwaltskanzlei-baumgartner.ch` (except `/.well-known/`), so deploy production only once the certificate is active, or https visitors get a certificate warning.

## Fixed after the first staging deploy (2026-10-26)

All committed and pushed; deploy once more to see them on staging.

- **Hero parallax removed:** the photo jumped on mobile when scrolling up (Chrome), also after switching the page height to svh, so the parallax is gone and the photo is still.
- **Short pages scrolled on wide windows:** the panel's `min-h-[75vw]` (mobile hero) also applied from md and outgrew `md:h-dvh`. Now `max-md:min-h-[75vw]`.
- **Dotted underline on the address (iOS):** Safari's data detectors. `<meta name="format-detection">` turns them off; phone numbers and email are real links anyway.
- **Blue ring on the menu close button:** `showModal()` focused the close button. The script now focuses the dialog itself (`tabindex="-1"`); the button keeps a white `focus-visible` ring for keyboards.
- **Body text** raised on mobile from 17 px to 18 px (still 20 px at 1920), line height 1.25 → 1.35. Marcel still has to look at the long pages on a phone; 1.3 is the fallback if it feels loose.

## Team page photos (2026-10-29)

- Portrait by Henrik Nielsen (`andy-portrait.jpg`) as the hero right after "Zur Person", full content width, uncropped.
- Below Eckdaten, not indented, three per row at every width: park portrait (`andy-park.jpg`), snowboard, golf (`andy-golf.jpg`, anchored left). Gap above the grid 40 / 64 / 96 px (mobile / md / lg).
- Impressum, Bildnachweis: "Fotograf: Henrik Nielsen".
- The two Nielsen portraits are the photographer's originals (2026-10-30), converted from Adobe RGB to sRGB and scaled to 2400 / 2000 px on the long side with `sips`. The hero is now 3:2 (the original's format); the park portrait is cropped to 4:5 from the centre.
- `/sitemap.xml` redirects to `/sitemap-index.xml` (`public/.htaccess`).

## Open


- Logo: the icon and favicons use a stand-in mark (condensed "A" on black) until there is a logo (`npm run assets`).
- Impressum / Datenschutz texts not reviewed by a lawyer.
- Production go-live: first `./deploy.sh production` once the certificate is active, then check http → https, www → non-www, the Kontakt map, and submit the sitemap in Google Search Console.

## Working with Marcel

- He tests on staging and on his phone and reports issues in short messages; fix, verify in the browser at 390 px and desktop sizes, then commit and push.
- "bcp" means build, commit and push.
- Copy is in German (Swiss spelling, "ss" instead of "ß").
