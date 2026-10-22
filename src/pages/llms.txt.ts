import type { APIRoute } from 'astro';
import { contact, site } from '../data/site';
import { areas, facts, focus, strafrecht } from '../data/content';

/** A plain Markdown summary of the site for language models (https://llmstxt.org) */
export const GET: APIRoute = () => {
  const url = (path: string) => new URL(path, site.url).href;
  const list = (items: string[], indent = '') => items.map((item) => `${indent}- ${item}`).join('\n');

  const body = `# ${site.name}

> ${site.description}

Die Kanzlei berät und vertritt Privatpersonen, Unternehmen und Gemeinwesen vor sämtlichen Gerichten und Behörden. Mandate werden persönlich betreut; sofern zielführend, werden Spezialisten aus dem In- und Ausland beigezogen. Sitz der Kanzlei ist Stäfa am Zürichsee.

## Kontakt

- Adresse: ${contact.firm}, ${contact.street}, ${contact.postalCode} ${contact.city}, Schweiz
- Telefon: ${contact.phones.join(', ')}
- E-Mail: ${contact.email}
- Anfahrt: S-Bahn S7 ab Zürich HB bis Bahnhof Stäfa, von dort 7 Minuten zu Fuss (ca. 700 m). Besucherparkplätze sind vorhanden.

## Schwerpunkte

${list(focus)}

## Rechtsgebiete

- Strafrecht
${list(strafrecht, '  ')}
${areas.map(({ title, items }) => `- ${title}${items ? `\n${list(items, '  ')}` : ''}`).join('\n')}

## ${contact.name}

${list(facts)}

## Seiten

- [Home](${url('/')})
- [Rechtsgebiete](${url('/rechtsgebiete/')})
- [Team](${url('/team/')}): Werdegang von ${contact.name}
- [Kontakt](${url('/kontakt/')})
- [Impressum](${url('/impressum/')}), [Datenschutzerklärung](${url('/datenschutz/')})
`;

  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
