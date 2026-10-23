// Mapbox map (see src/components/Map.astro). Settings come from src/data/site.ts via data-map.
import { officeMarker, parkingMarker } from '../lib/markers';

type Marker = { kind: 'office' | 'parking'; title: string; coordinates: [number, number] };
type Config = { token: string; style: string; zoom: number; markers: Marker[] };

const LOCALE = {
  'ScrollZoomBlocker.CtrlMessage': 'Zum Zoomen Strg + Scrollen verwenden',
  'ScrollZoomBlocker.CmdMessage': 'Zum Zoomen ⌘ + Scrollen verwenden',
  'TouchPanBlocker.Message': 'Karte mit zwei Fingern bewegen',
  'NavigationControl.ZoomIn': 'Vergrössern',
  'NavigationControl.ZoomOut': 'Verkleinern',
  'NavigationControl.ResetBearing': 'Nach Norden ausrichten',
};

const markerHtml = { office: officeMarker(47), parking: parkingMarker(30) };

// The photo panel's palette (sampled from src/assets/mountain.jpg): blush and lilac sky, grey-lavender haze,
// white snow, navy rock. Layers are matched by source layer and type, not by id, so this survives changes
// to the house style.
const PALETTE = {
  land: '#f1e9ee',
  green: '#e4d3e0',
  building: '#d3cddb',
  water: '#b4b8cb',
  road: '#ffffff',
  roadCase: '#d3cddb',
  line: '#8e8aa0',
  text: '#293347',
  halo: 'rgba(255, 255, 255, 0.9)',
};

function applyPalette(map: import('mapbox-gl').Map) {
  for (const layer of map.getStyle()?.layers ?? []) {
    const id = layer.id;
    const source = 'source-layer' in layer ? layer['source-layer'] : undefined;
    const set = (property: string, value: string) => map.setPaintProperty(id, property as never, value as never);

    if (layer.type === 'background') set('background-color', PALETTE.land);
    else if (layer.type === 'symbol') {
      set('text-color', PALETTE.text);
      set('text-halo-color', PALETTE.halo);
    } else if (source === 'water' || source === 'waterway') set(layer.type === 'fill' ? 'fill-color' : 'line-color', PALETTE.water);
    else if (source === 'building') set('fill-color', PALETTE.building);
    else if (source === 'landuse' || source === 'landuse_overlay') set('fill-color', PALETTE.green);
    else if (source === 'road' && layer.type === 'line') {
      // Rails, ferries and lifts as thin dark lines; streets and paths white like the snow
      const thin = /rail|ferry|aerial/.test(id);
      set('line-color', thin ? PALETTE.line : id.endsWith('-case') ? PALETTE.roadCase : PALETTE.road);
    } else if (source === 'admin' || source === 'aeroway') set(layer.type === 'fill' ? 'fill-color' : 'line-color', PALETTE.line);
  }
}

export async function initMap(el: HTMLElement) {
  const config: Config = JSON.parse(el.dataset.map ?? '{}');
  if (!config.token) return;

  const [{ default: mapboxgl }] = await Promise.all([import('mapbox-gl'), import('mapbox-gl/dist/mapbox-gl.css')]);
  mapboxgl.accessToken = config.token;

  const map = new mapboxgl.Map({
    container: el,
    style: config.style,
    center: config.markers[0].coordinates,
    zoom: config.zoom,
    // One finger scrolls the page, two fingers move the map
    cooperativeGestures: true,
    locale: LOCALE,
  });
  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
  // Before the first frame, so the house colours never flash up
  map.once('style.load', () => applyPalette(map));

  const bounds = new mapboxgl.LngLatBounds();
  for (const marker of config.markers) {
    const node = document.createElement('div');
    node.innerHTML = markerHtml[marker.kind];
    node.title = marker.title;
    new mapboxgl.Marker({ element: node, anchor: marker.kind === 'office' ? 'bottom' : 'center' })
      .setLngLat(marker.coordinates)
      .setPopup(new mapboxgl.Popup({ offset: 24, closeButton: false }).setText(marker.title))
      .addTo(map);
    bounds.extend(marker.coordinates);
  }
  // Both pins in view, but never closer than the configured zoom
  map.fitBounds(bounds, { padding: 80, maxZoom: config.zoom, duration: 0 });

  const reveal = () => el.classList.remove('opacity-0');
  map.once('load', reveal);
  // 'load' never fires if the style or tiles fail: reveal anyway instead of leaving an invisible area
  map.once('error', reveal);
}
