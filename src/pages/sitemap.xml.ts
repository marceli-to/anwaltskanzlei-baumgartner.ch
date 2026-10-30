import type { APIRoute } from 'astro';
import { execFileSync } from 'node:child_process';
import { site } from '../data/site';

/** Every page in this folder except the 404, with its source, keyed by file name */
const sources = import.meta.glob<string>(['./*.astro', '!./404.astro'], { query: '?raw', import: 'default', eager: true });

/**
 * Date of the last commit that changed the page or one of the src/data files it imports
 * (the lists and the address live there). deploy.sh builds a copy without .git and points
 * GIT_DIR at the repository. Without git history the page simply has no <lastmod>.
 */
function lastmod(name: string, source: string): string | undefined {
  const data = [...source.matchAll(/from '\.\.\/data\/(\w+)'/g)].map(([, file]) => `src/data/${file}.ts`);
  try {
    return execFileSync('git', ['log', '-1', '--format=%cd', '--date=short', '--', `src/pages/${name}.astro`, ...data], { encoding: 'utf8' }).trim() || undefined;
  } catch {
    return undefined;
  }
}

const pages = Object.entries(sources)
  .map(([file, source]) => {
    const name = file.slice(2, -'.astro'.length);
    return { path: name === 'index' ? '/' : `/${name}/`, lastmod: lastmod(name, source) };
  })
  .sort((a, b) => a.path.localeCompare(b.path));

export const GET: APIRoute = () => {
  const urls = pages
    .map(({ path, lastmod }) => {
      const date = lastmod ? `<lastmod>${lastmod}</lastmod>` : '';
      return `  <url><loc>${new URL(path, site.url).href}</loc>${date}</url>`;
    })
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
