import { useMemo } from "react";
import { useMapEvents } from "react-leaflet";

function pointInRing(point, ring) {
  // point: [lat, lng], ring: Array<[lat, lng]>
  const x = point[1]; // lng
  const y = point[0]; // lat

  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][1], yi = ring[i][0];
    const xj = ring[j][1], yj = ring[j][0];

    const intersect =
      (yi > y) !== (yj > y) &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + 0.0) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

function bboxOfRing(ring) {
  let minLat = Infinity, minLng = Infinity, maxLat = -Infinity, maxLng = -Infinity;
  for (const [lat, lng] of ring) {
    if (lat < minLat) minLat = lat;
    if (lng < minLng) minLng = lng;
    if (lat > maxLat) maxLat = lat;
    if (lng > maxLng) maxLng = lng;
  }
  return { minLat, minLng, maxLat, maxLng };
}

function pointInBbox([lat, lng], bb) {
  return lat >= bb.minLat && lat <= bb.maxLat && lng >= bb.minLng && lng <= bb.maxLng;
}

function RouteRecorder({ enabled, onAddPoint, islandIndex }) {
  useMapEvents({
    click(e) {
      if (!enabled) return;

      const { lat, lng } = e.latlng;
      const pt = [Number(lat.toFixed(5)), Number(lng.toFixed(5))];

      // if we don't have outlines yet, allow drawing
      if (!islandIndex?.length) {
        onAddPoint(pt);
        return;
      }

      // ignore clicks on land
      const onLand = islandIndex.some(({ ring, bb }) => {
        if (!pointInBbox(pt, bb)) return false;
        return pointInRing(pt, ring);
      });

      if (onLand) return;

      onAddPoint(pt);
    },
  });

  return null;
}

export function RouteDrawingLayer({
  enabled,
  setRoute,
  islandOutlines = [],
}) {
  const islandIndex = useMemo(() => {
    return islandOutlines.map((ring) => ({
      ring,
      bb: bboxOfRing(ring),
    }));
  }, [islandOutlines]);

  return (
    <RouteRecorder
      enabled={enabled}
      islandIndex={islandIndex}
      onAddPoint={(pt) => setRoute((prev) => [...prev, pt])}
    />
  );
}