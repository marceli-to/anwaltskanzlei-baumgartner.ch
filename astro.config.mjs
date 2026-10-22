// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://anwaltskanzlei-baumgartner.ch',
  integrations: [sitemap()],
  // Fixed IPv4 address, and a different port than marceli.to so both can run at once
  server: { host: '127.0.0.1', port: 4322 },
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: ['anwaltskanzlei-baumgartner.ch.test'] },
  },
  // Self-hosted from Fontsource, latin only (German and every name on the site fall within it).
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Host Grotesk',
      cssVariable: '--font-host-grotesk',
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      options: {
        variants: [
          { src: ['@fontsource-variable/host-grotesk/files/host-grotesk-latin-wght-normal.woff2'], weight: '300 800', style: 'normal' },
        ],
      },
    },
    {
      // Stand-in for TT Bluescreens Pro Bold (the design uses the trial version; needs a web licence from TypeType)
      provider: fontProviders.local(),
      name: 'Antonio',
      cssVariable: '--font-antonio',
      fallbacks: ['Arial Narrow', 'sans-serif'],
      options: {
        variants: [
          { src: ['@fontsource/antonio/files/antonio-latin-700-normal.woff2'], weight: 700, style: 'normal' },
        ],
      },
    },
  ],
});
