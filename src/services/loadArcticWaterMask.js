import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import arcticLandUrl from "@/assets/geojsons/arctic_land_simplified.geojson?url";

export function gridCellToLatLng(bounds, rows, cols, r, c) {
  const [[latMin, lngMin], [latMax, lngMax]] = bounds;
  const latStep = (latMax - latMin) / rows;
  const lngStep = (lngMax - lngMin) / cols;

  const lat = latMin + (r + 0.5) * latStep;
  const lng = lngMin + (c + 0.5) * lngStep;

  return [lat, lng];
}

export function latLngToGridCell(bounds, rows, cols, lat, lng) {
  const [[latMin, lngMin], [latMax, lngMax]] = bounds;
  const latStep = (latMax - latMin) / rows;
  const lngStep = (lngMax - lngMin) / cols;

  const r = Math.floor((lat - latMin) / latStep);
  const c = Math.floor((lng - lngMin) / lngStep);

  return [r, c];
}

export function clampGridCell(maskObj, r, c) {
  const rr = Math.max(0, Math.min(maskObj.rows - 1, r));
  const cc = Math.max(0, Math.min(maskObj.cols - 1, c));
  return [rr, cc];
}

export function isWaterCell(maskObj, r, c) {
  const runs = maskObj?.waterRunsByRow?.[r];
  if (!runs) return false;
  for (const [a, b] of runs) if (c >= a && c <= b) return true;
  return false;
}

export default async function loadArcticWaterMask({ bounds, rows, cols }) {
  const landGeojson = await fetch(arcticLandUrl).then((r) => r.json());

  const gridMask = buildWaterMaskFromGeoJSON(bounds, rows, cols, landGeojson);

  denoiseWaterMask(gridMask.mask, rows, cols, 2);

  // Compress to runs for fast isWaterCell() checks
  const { waterRunsByRow } = compressWaterRuns(gridMask);

  return { ...gridMask, waterRunsByRow };
}

function normalizeToFeatureCollection(geo) {
  if (!geo) return { type: "FeatureCollection", features: [] };

  if (geo.type === "FeatureCollection") return geo;

  if (geo.type === "GeometryCollection") {
    return {
      type: "FeatureCollection",
      features: geo.geometries.map((g) => ({
        type: "Feature",
        properties: {},
        geometry: g,
      })),
    };
  }

  // Polygon / MultiPolygon
  return {
    type: "FeatureCollection",
    features: [{ type: "Feature", properties: {}, geometry: geo }],
  };
}

export function buildWaterMaskFromGeoJSON(bounds, rows, cols, landGeojson) {
  const landFC = normalizeToFeatureCollection(landGeojson);
  const [[latMin, lngMin], [latMax, lngMax]] = bounds;

  const latStep = (latMax - latMin) / rows;
  const lngStep = (lngMax - lngMin) / cols;

  const mask = new Uint8Array(rows * cols);

  // small inset so corners don’t fall exactly on boundaries
  const epsLat = latStep * 0.05;
  const epsLng = lngStep * 0.05;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const south = latMin + r * latStep;
      const north = latMin + (r + 1) * latStep;
      const west = lngMin + c * lngStep;
      const east = lngMin + (c + 1) * lngStep;

      const center = [(south + north) / 2, (west + east) / 2];

      // sample 4 corners (slightly inset) + center
      const samples = [
        center,
        [south + epsLat, west + epsLng],
        [south + epsLat, east - epsLng],
        [north - epsLat, west + epsLng],
        [north - epsLat, east - epsLng],
      ];

      let onLand = false;

      // if ANY sample is land, treat whole cell as land
      outer: for (const [lat, lng] of samples) {
        const pt = point([lng, lat]); // turf wants [lng, lat]
        for (const feat of landFC.features) {
          if (booleanPointInPolygon(pt, feat)) {
            onLand = true;
            break outer;
          }
        }
      }

      mask[r * cols + c] = onLand ? 0 : 1;
    }
  }

  return { rows, cols, mask, bounds };
}

export function compressWaterRuns({ rows, cols, mask }) {
  const waterRunsByRow = [];

  for (let r = 0; r < rows; r++) {
    const runs = [];
    let c = 0;

    while (c < cols) {
      while (c < cols && mask[r * cols + c] === 0) c++; // skip land
      if (c >= cols) break;

      const start = c;
      while (c < cols && mask[r * cols + c] === 1) c++; // water run
      runs.push([start, c - 1]);
    }

    waterRunsByRow.push(runs);
  }

  return { rows, cols, waterRunsByRow };
}

export function gridCellsToLatLngRoute(maskObj, cells) {
  const { bounds, rows, cols } = maskObj;
  return (cells || []).map(([r, c]) => gridCellToLatLng(bounds, rows, cols, r, c));
}

function denoiseWaterMask(mask, rows, cols, passes = 1) {
  const idx = (r, c) => r * cols + c;

  for (let p = 0; p < passes; p++) {
    const next = new Uint8Array(mask); // copy

    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        const i = idx(r, c);
        if (mask[i] !== 1) continue; // only consider water cells

        // Count land neighbors (8-neighborhood)
        let landN = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            if (mask[idx(r + dr, c + dc)] === 0) landN++;
          }
        }

        // If mostly surrounded by land, treat as land
        if (landN >= 6) next[i] = 0;
      }
    }

    mask.set(next);
  }
}
