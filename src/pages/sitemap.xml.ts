import type { APIRoute } from 'astro';
import { site } from '../data/site';

/** Every page in this folder except the 404, as /name/ (the URL form the server redirects to) */
const paths = Object.keys(import.meta.glob('./*.astro'))
  .map((file) => file.slice(2, -'.astro'.length))
  .filter((name) => name !== '404')
  .map((name) => (name === 'index' ? '/' : `/${name}/`))
  .sort();

export const GET: APIRoute = () => {
  const urls = paths.map((path) => `  <url><loc>${new URL(path, site.url).href}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
