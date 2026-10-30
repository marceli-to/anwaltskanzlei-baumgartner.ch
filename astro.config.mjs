// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://anwaltskanzlei-baumgartner.ch',
  // Fixed IPv4 address, and a different port than marceli.to so both can run at once
  server: { host: '127.0.0.1', port: 4322 },
  vite: {
    plugins: [tailwindcss()],
    // mapbox-gl (~1.9 MB) is its own chunk, loaded only on the Kontakt page
    build: { chunkSizeWarningLimit: 2000 },
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
      // Display type ("Better Call Andy", the CTA). Anton has a single, already heavy weight.
      provider: fontProviders.local(),
      name: 'Anton',
      cssVariable: '--font-anton',
      fallbacks: ['Arial Narrow', 'sans-serif'],
      options: {
        variants: [
          { src: ['@fontsource/anton/files/anton-latin-400-normal.woff2'], weight: 400, style: 'normal' },
        ],
      },
    },
  ],
});
