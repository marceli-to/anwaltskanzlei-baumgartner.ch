// Map markers, shared by the map (src/scripts/map.ts) and its legend (src/components/Map.astro),
// so both always show the same icons. Black like the rest of the site.

/** The starter's pin, `height` px tall */
export const officeMarker = (height: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.8 52.8" width="${Math.round((height * 40.8) / 52.8)}" height="${height}" aria-hidden="true" style="display:block"><path d="M40.8,20.4A20.4,20.4,0,0,0,0,20.4C0,31.7,20.4,52.8,20.4,52.8S40.8,31.7,40.8,20.4ZM10.9,20a9.5,9.5,0,1,1,9.5,9.5A9.6,9.6,0,0,1,10.9,20Z" fill="#000"/></svg>`;

/** A "P" sign, `size` px square, with a white ring so it stands out on the map */
export const parkingMarker = (size: number) =>
  `<span aria-hidden="true" style="display:grid;place-items:center;width:${size}px;height:${size}px;background:#000;color:#fff;font:400 ${Math.round(size * 0.63)}px/1 var(--font-anton),sans-serif;box-shadow:0 0 0 ${size >= 24 ? 2 : 1}px #fff">P</span>`;
