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
