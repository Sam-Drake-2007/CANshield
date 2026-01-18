import { useEffect, useMemo, useRef, useState } from "react";
import {
  gridCellToLatLng,
  latLngToGridCell,
  clampGridCell,
  isWaterCell,
} from "../services/loadArcticWaterMask";

// haversine meters
function haversineMeters(a, b) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371000;
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);

  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(s));
}

function toFiniteNumber(x) {
  if (typeof x === "number") return Number.isFinite(x) ? x : 0;
  if (typeof x === "string") {
    const n = parseFloat(x);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export function useCoverageTracker({
  running,
  ships,
  positionsById,
  maskObj,
  getRadiusMetersByShipId,
  sampleMs = 200,
}) {
  const [snapshot, setSnapshot] = useState(null);

  // keep latest positions without retriggering interval effect
  const positionsRef = useRef(positionsById);
  useEffect(() => {
    positionsRef.current = positionsById;
  }, [positionsById]);

  // keep latest radius getter without retriggering interval effect
  const getRadiusRef = useRef(getRadiusMetersByShipId);
  useEffect(() => {
    getRadiusRef.current = getRadiusMetersByShipId;
  }, [getRadiusMetersByShipId]);

  // shipId -> Set("r,c")
  const coveredByShipRef = useRef(new Map());

  const totalWaterCells = useMemo(() => {
    if (!maskObj?.rows || !maskObj?.cols || !maskObj?.mask) return 0;
    let count = 0;
    const m = maskObj.mask;
    for (let i = 0; i < m.length; i++) if (m[i] === 1) count++;
    return count;
  }, [maskObj]);

  useEffect(() => {
    if (!running) return;
    if (
      !maskObj?.rows ||
      !maskObj?.cols ||
      !maskObj?.bounds ||
      !maskObj?.waterRunsByRow
    )
      return;
    if (!ships?.length) return;

    coveredByShipRef.current = new Map();
    setSnapshot(null);

    const { rows, cols, bounds } = maskObj;

    const intervalId = window.setInterval(() => {
      const coveredByShip = coveredByShipRef.current;
      const posMap = positionsRef.current;

      for (const s of ships) {
        const pos = posMap?.[s.id];
        if (!pos) continue;

        const radiusM = toFiniteNumber(getRadiusRef.current?.(s.id));
        if (!(radiusM > 0)) continue;

        if (!coveredByShip.has(s.id)) coveredByShip.set(s.id, new Set());
        const set = coveredByShip.get(s.id);

        // bounding box in degrees (cheap prefilter)
        const lat = pos[0];
        const latDelta = radiusM / 111320;
        const lngDelta = radiusM / (111320 * Math.cos((lat * Math.PI) / 180));

        const [r0, c0] = clampGridCell(
          maskObj,
          ...latLngToGridCell(bounds, rows, cols, pos[0], pos[1])
        );
        const [rA] = clampGridCell(
          maskObj,
          ...latLngToGridCell(bounds, rows, cols, pos[0] + latDelta, pos[1])
        );
        const [rB] = clampGridCell(
          maskObj,
          ...latLngToGridCell(bounds, rows, cols, pos[0] - latDelta, pos[1])
        );
        const [, cA] = clampGridCell(
          maskObj,
          ...latLngToGridCell(bounds, rows, cols, pos[0], pos[1] - lngDelta)
        );
        const [, cB] = clampGridCell(
          maskObj,
          ...latLngToGridCell(bounds, rows, cols, pos[0], pos[1] + lngDelta)
        );

        const rMin = Math.max(0, Math.min(r0, rA, rB));
        const rMax = Math.min(rows - 1, Math.max(r0, rA, rB));
        const cMin = Math.max(0, Math.min(c0, cA, cB));
        const cMax = Math.min(cols - 1, Math.max(c0, cA, cB));

        for (let r = rMin; r <= rMax; r++) {
          for (let c = cMin; c <= cMax; c++) {
            if (!isWaterCell(maskObj, r, c)) continue;

            const center = gridCellToLatLng(bounds, rows, cols, r, c);
            if (haversineMeters(pos, center) <= radiusM) {
              set.add(`${r},${c}`);
            }
          }
        }
      }

      const perShip = ships.map((s) => {
        const covered = coveredByShip.get(s.id)?.size ?? 0;
        const pct = totalWaterCells ? (covered / totalWaterCells) * 100 : 0;
        return {
          shipId: s.id,
          boatId: s.boatId,
          coveredWaterCells: covered,
          coveragePercent: pct,
        };
      });

      const union = new Set();
      for (const set of coveredByShip.values()) for (const k of set) union.add(k);

      const totalCoveredWaterCells = union.size;
      const totalCoveragePercent = totalWaterCells
        ? (totalCoveredWaterCells / totalWaterCells) * 100
        : 0;

      setSnapshot({
        totalWaterCells,
        totalCoveredWaterCells,
        totalCoveragePercent,
        perShip,
      });
    }, sampleMs);

    return () => window.clearInterval(intervalId);
  }, [running, ships, maskObj, sampleMs, totalWaterCells]);

  return snapshot;
}
